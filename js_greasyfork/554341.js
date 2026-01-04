// ==UserScript==
// @name         Geo Spoofer
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Big brother doesn't know
// @author       Anon
// @match        https://onko.qlite.kz/web/index.php?r=quzhattar/inputa
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554341/Geo%20Spoofer.user.js
// @updateURL https://update.greasyfork.org/scripts/554341/Geo%20Spoofer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const myIIN = "YOUR_IIN";
    const fakeLatitude = 49.79508;
    const fakeLongitude = 73.06299;
    const originalGetCurrentPosition = navigator.geolocation.getCurrentPosition.bind(navigator.geolocation);
    navigator.geolocation.getCurrentPosition = function(successCallback, errorCallback, options) {
        const position = {
            coords: {
                latitude: fakeLatitude,
                longitude: fakeLongitude,
                accuracy: 20,
                altitude: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null
            },
            timestamp: Date.now(),
        };
        successCallback(position);
    };
    window.addEventListener('DOMContentLoaded', function() {
        const iinInput = document.querySelector('input[name="iin"]');
        if (iinInput) {
            iinInput.value = myIIN;
            console.log('IIN ' + myIIN + ' was successfully inserted.');
        } else {
            console.error('Could not find the IIN input field with name="iin".');
        }
    });
})();