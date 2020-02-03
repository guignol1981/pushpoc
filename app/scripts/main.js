'use strict';

const applicationServerPublicKey = 'BEMnipj1c0AtSHkAGYORpFPQl0BLhPdn2rUH8Qrxr1DcavcPwcr3tC9_44_RPreTBDrekp7MRaO2Fv6z3_hU8NA';

const pushButton = document.querySelector('.js-push-btn');
const safari = document.getElementById('enable-push-safari');
const websitePushId = 'web.dti-ulaval.pushpoc';
const webServiceUrl = 'https://a75a7954.ngrok.io';

let isSubscribed = false;
let swRegistration = null;

safari.addEventListener('click', () => {
    if ('safari' in window && 'pushNotification' in window.safari) {
        var permissionData = window.safari.pushNotification.permission(websitePushId);
        checkRemotePermission(permissionData);
    }
});

var checkRemotePermission = function (permissionData) {
    console.log('permissionData', permissionData);

    if (permissionData.permission === 'default') {
        window.safari.pushNotification.requestPermission(
            webServiceUrl,
            websitePushId,
            {},
            checkRemotePermission
        );
    }
    else if (permissionData.permission === 'denied') {
        console.log('user denied push notifications');
    }
    else if (permissionData.permission === 'granted') {
        console.log('granted', permissionData);
    }
};

if ('safari' in window && 'pushNotification' in window.safari) {
    console.log('Safari push is supported');
    document.getElementById('title').innerHTML = 'Environement: Safari'
    document.getElementById('enable-push-safari').hidden = false;
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
    document.getElementById('title').innerHTML = 'Environement: Not safari'
    document.getElementById('enable-push-not-safari').visible = false;

    console.log('Service Worker and Push is supported');

    navigator.serviceWorker
        .register('sw.js')
        .then(function (swReg) {
            console.log('Service Worker is registered', swReg);

            swRegistration = swReg;
            initializeUI();
        })
        .catch(function (error) {
            console.error('Service Worker Error', error);
        });
} else {
    console.warn('Non-safari push messaging is not supported');
    pushButton.textContent = 'Push Not Supported';
}

function initializeUI() {
    pushButton.addEventListener('click', function () {
        pushButton.disabled = true;

        if (isSubscribed) {
            unsubscribeUser();
        } else {
            subscribeUser();
        }
    });

    swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
            isSubscribed = !(subscription === null);

            if (isSubscribed) {
                console.log('User IS subscribed.');
            } else {
                console.log('User IS NOT subscribed.');
            }

            updateBtn();
        });
}

function unsubscribeUser() {
    swRegistration.pushManager.getSubscription()
        .then(subscription => {
            if (subscription) {
                return subscription.unsubscribe();
            }
        })
        .catch((err) => {
            console.log('Error unsubscribing', err);
        })
        .then(_ => {
            updateSubscriptionOnServer(null);

            console.log('User is unsubscribed.');

            isSubscribed = false;

            updateBtn();
        });
}

function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);

    swRegistration.pushManager
        .subscribe({
            userVisibleOnly: true,
            applicationServerKey
        })
        .then(function (subscription) {
            console.log('User is subscribed.');

            updateSubscriptionOnServer(subscription);

            isSubscribed = true;

            updateBtn();
        })
        .catch(function (err) {
            console.log('Failed to subscribe the user: ', err);
            updateBtn();
        });
}

function updateSubscriptionOnServer(subscription) {
    const subscriptionJson = document.querySelector('.js-subscription-json');
    const subscriptionDetails = document.querySelector('.js-subscription-details');

    if (subscription) {
        subscriptionJson.textContent = JSON.stringify(subscription);
        subscriptionDetails.classList.remove('is-invisible');
    } else {
        subscriptionDetails.classList.add('is-invisible');
    }
}

function updateBtn() {
    if (Notification.permission === 'denied') {
        pushButton.textContent = 'Push Messaging Blocked.';
        pushButton.disabled = true;

        updateSubscriptionOnServer(null);

        return;
    }

    if (isSubscribed) {
        pushButton.textContent = 'Disable Push Messaging';
    } else {
        pushButton.textContent = 'Enable Push Messaging';
    }

    pushButton.disabled = false;
}

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
