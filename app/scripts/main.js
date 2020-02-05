'use strict';

const applicationServerPublicKey = 'BH-O7kTwRaZot55-jessFjX1Q7lRRMyb2CcqSjD_y9ho1JoGZguQbFWYZecCCOYNmf0258HpOJ-4SzzpmlXfSVc';
const pushButton = document.querySelector('.js-push-btn');
const safari = document.getElementById('enable-push-safari');
const enablePushButton = document.getElementById('enable-push');
const subscribeButton = document.getElementById('subscribe');
const consoleOutputSpan = document.getElementById('console-output');

let isSubscribed = false;
let swRegistration = null;

let isSafari = 'safari' in window;

const trace = (msg, obj) => {
    console.log(msg, obj);
    consoleOutputSpan.innerHTML = msg;
}

enablePushButton.addEventListener('click', () => {
    if (isSafari && 'pushNotification' in window.safari) {
        var permissionData = window.safari.pushNotification.permission('web.dti-ulaval.pushpoc');
        checkRemotePermission(permissionData);
    } else if ('serviceWorker' in navigator && 'PushManager' in window) {
        navigator.serviceWorker
            .register('sw.js')
            .then(function (swReg) {
                trace('Service Worker is registered', swReg);
                swRegistration = swReg;
                initializeUI();
            })
            .catch(function (error) {
                console.error('Service Worker Error', error);
            });
    }
});

subscribeButton.addEventListener('click', () => {
    if (safari) {
        return;
    }

    subscribeNonSafari();
});

// safari.addEventListener('click', () => {
//     if ('safari' in window && 'pushNotification' in window.safari) {
//         var permissionData = window.safari.pushNotification.permission('web.dti-ulaval.pushpoc');
//         checkRemotePermission(permissionData);
//     }
// });

// var checkRemotePermission = function (permissionData) {
//     trace('permissionData', permissionData);

//     if (permissionData.permission === 'default') {
//         window.safari.pushNotification.requestPermission(
//             'https://76a3f99a.ngrok.io', // The web service URL.
//             'web.dti-ulaval.pushpoc',     // The Website Push ID.
//             {}, // Data that you choose to send to your server to help you identify the user.
//             checkRemotePermission         // The callback function.
//         );
//     }
//     else if (permissionData.permission === 'denied') {
//         trace('denied');
//         // The user said no.
//     }
//     else if (permissionData.permission === 'granted') {
//         trace('granted', permissionData);
//         // The web service URL is a valid push provider, and the user said yes.
//         // permissionData.deviceToken is now available to use.
//     }
// };

// if ('safari' in window && 'pushNotification' in window.safari) {
//     document.getElementById('title').innerHTML = 'Environement: Safari'
//     document.getElementById('enable-push-safari').hidden = false;
//     trace('Safari push is supported');

//     // var xhttp = new XMLHttpRequest();
//     // xhttp.onreadystatechange = function () {
//     //     if (this.readyState == 4 && this.status == 200) {
//     //         document.getElementById("demo").innerHTML = this.responseText;
//     //     }
//     // };
//     // xhttp.open("GET", "/push", true);
//     // xhttp.send();
// }

// if ('serviceWorker' in navigator && 'PushManager' in window) {
//     document.getElementById('title').innerHTML = 'Environement: Not safari'
//     document.getElementById('enable-push-not-safari').visible = false;

//     trace('Service Worker and Push is supported');

//     navigator.serviceWorker
//         .register('sw.js')
//         .then(function (swReg) {
//             trace('Service Worker is registered', swReg);

//             swRegistration = swReg;
//             initializeUI();
//         })
//         .catch(function (error) {
//             console.error('Service Worker Error', error);
//         });
// } else {
//     console.warn('Non-safari push messaging is not supported');
//     pushButton.textContent = 'Push Not Supported';
// }

function initializeUI() {
    if (isSafari) {
        return;
    }

    swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
            isSubscribed = !(subscription === null);

            if (isSubscribed) {
                trace('User IS subscribed.');
                consoleOutputSpan.innerHTML = 'User IS subscribed';
            } else {
                trace('User is NOT subscribed.');
                consoleOutputSpan.innerHTML = 'User IS NOT subscribed';
            }
        });
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

function subscribeNonSafari() {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);

    swRegistration.pushManager
        .subscribe({
            userVisibleOnly: true,
            applicationServerKey
        })
        .then(function (subscription) {
            trace('User is subscribed.');

            // updateSubscriptionOnServer(subscription);

            isSubscribed = true;
        })
        .catch(function (err) {
            trace('Failed to subscribe the user: ', err);
        });
}

// function updateSubscriptionOnServer(subscription) {
//     const subscriptionJson = document.querySelector('.js-subscription-json');
//     const subscriptionDetails = document.querySelector('.js-subscription-details');

//     if (subscription) {
//         subscriptionJson.textContent = JSON.stringify(subscription);
//         subscriptionDetails.classList.remove('is-invisible');
//     } else {
//         subscriptionDetails.classList.add('is-invisible');
//     }
// }

// function updateBtn() {
//     if (Notification.permission === 'denied') {
//         pushButton.textContent = 'Push Messaging Blocked.';
//         pushButton.disabled = true;

//         updateSubscriptionOnServer(null);

//         return;
//     }

//     if (isSubscribed) {
//         pushButton.textContent = 'Disable Push Messaging';
//     } else {
//         pushButton.textContent = 'Enable Push Messaging';
//     }

//     pushButton.disabled = false;
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
