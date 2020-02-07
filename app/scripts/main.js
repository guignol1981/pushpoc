'use strict';

const webPushId = 'web.dti-ulaval.pushpoc';
const webServerUrl = 'todo';
const applicationServerPublicKey = 'BH-O7kTwRaZot55-jessFjX1Q7lRRMyb2CcqSjD_y9ho1JoGZguQbFWYZecCCOYNmf0258HpOJ-4SzzpmlXfSVc';
const pushButton = document.querySelector('.js-push-btn');
const safari = document.getElementById('enable-push-safari');
const enablePushButton = document.getElementById('enable-push');
const subscribeButton = document.getElementById('subscribe');
const consoleOutputSpan = document.getElementById('console-output');
const environementSpan = document.getElementById('environement');
const permissionSpan = document.getElementById('permission');
const subscribedSpan = document.getElementById('subscribed');
const supportedSpan = document.getElementById('supported');
const webServerUrlButton = document.getElementById('web-server-url-button');
const webServerUrlInput = document.getElementById('web-server-url-input');
const webServerUrlSpan = document.getElementById('web-server-url');

let isSubscribed = false;
let swRegistration = null;
let isSupported = false;
const isSafari = 'safari' in window;


function trace(m, o) {
    console.log(m, o);
    consoleOutputSpan.innerHTML = m;
}

if (isSafari) {
    isSupported = 'pushNotification' in window.safari;
    subscribedSpan.innerHTML = 'not related to safari';
} else {
    isSupported = 'PushManager' in window;
    permissionSpan.innerHTML = 'not related to non-safari';
}

if (!isSupported) {
    trace('Push not supported');
}

updateStatus();

webServerUrlButton.addEventListener('click', () => {
    webServerUrlSpan.innerHTML = webServerUrlInput.value;
});

enablePushButton.addEventListener('click', () => {
    if (!isSupported) {
        return;
    }

    if (isSafari && 'pushNotification' in window.safari) {
        var permissionData = window
            .safari
            .pushNotification
            .permission(webPushId);

        checkRemotePermission(permissionData);
    } else if ('serviceWorker' in navigator && 'PushManager' in window) {
        navigator.serviceWorker
            .register('sw.js')
            .then(function (swReg) {
                trace('Service Worker is registered', swReg);
                swRegistration = swReg;
                updateStatus();
            })
            .catch(function (error) {
                console.error('Service Worker Error', error);
            });
    }
});

subscribeButton.addEventListener('click', () => {
    if (safari || !swRegistration) {
        return;
    }

    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);

    swRegistration.pushManager
        .subscribe({
            userVisibleOnly: true,
            applicationServerKey
        })
        .then(_ => {
            trace('User is subscribed.');
            updateStatus();
        })
        .catch((err) => {
            trace('Failed to subscribe the user: ', err);
        });
});

function checkRemotePermission(permissionData) {
    trace('permissionData', permissionData);

    if (permissionData.permission === 'default') {
        window.safari.pushNotification.requestPermission(
            webServerUrl, webPushId, {}, // user data
            checkRemotePermission
        );
    } else if (permissionData.permission === 'denied') {
        trace('denied');
    } else if (permissionData.permission === 'granted') {
        trace('granted', permissionData);
    }
    updateStatus();
}

function updateStatus() {
    environementSpan.innerHTML = isSafari ? 'Safari' : 'Non-Safari';
    supportedSpan.innerHTML = isSupported;

    if (isSafari) {
        const permissionData = window
            .safari
            .pushNotification
            .permission(webPushId);

        permissionSpan.innerHTML = permissionData.permission;
        return;
    } else if (swRegistration) {
        swRegistration.pushManager.getSubscription()
            .then((subscription) => {
                isSubscribed = !(subscription === null);
                subscribedSpan.innerHTML = isSubscribed;
            });
    }
}

// function unsubscribeUser() {
//     swRegistration.pushManager.getSubscription()
//         .then(subscription => {
//             if (subscription) {
//                 return subscription.unsubscribe();
//             }
//         })
//         .catch((err) => {
//             trace('Error unsubscribing', err);
//         })
//         .then(_ => {
//             updateSubscriptionOnServer(null);

//             trace('User is unsubscribed.');

//             isSubscribed = false;

//             updateBtn();
//         });
// }


function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
