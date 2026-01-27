// ==UserScript==
// @name         TBD Auto Thanks
// @namespace    Noob
// @version      1.2
// @description  Automates thanking the uploader on TorrentBD (Auto Thanks only)
// @match        https://www.torrentbd.com/torrents-details.php?id=*
// @match        https://www.torrentbd.net/torrents-details.php?id=*
// @match        https://www.torrentbd.me/torrents-details.php?id=*
// @match        https://www.torrentbd.org/torrents-details.php?id=*
// @license      MIT
// @icon         https://www.torrentbd.net/themes/material/static/favicon/favicon-32x32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564210/TBD%20Auto%20Thanks.user.js
// @updateURL https://update.greasyfork.org/scripts/564210/TBD%20Auto%20Thanks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration options
    var config = {
        waitTimeout: 10000, // Timeout for waiting for elements (in ms)
        clickDelay: 500 // Delay between actions (in ms)
    };

    // Function to wait for an element to appear
    function waitForElement(selector, callback) {
        var interval = 100;
        var elapsed = 0;
        var checkInterval = setInterval(function() {
            var element = document.querySelector(selector);
            if (element) {
                clearInterval(checkInterval);
                callback(null, element);
            } else if (elapsed >= config.waitTimeout) {
                clearInterval(checkInterval);
                callback(new Error('Element ' + selector + ' not found within ' + config.waitTimeout + 'ms'));
            }
            elapsed += interval;
        }, interval);
    }

    // Function to click an element with delay
    function clickElement(selector, callback) {
        waitForElement(selector, function(err, element) {
            if (err) {
                console.error('Error clicking ' + selector + ':', err);
                return callback(err);
            }
            element.click();
            console.log('Clicked ' + selector);
            setTimeout(function() {
                callback(null);
            }, config.clickDelay);
        });
    }

    // Function to perform action (Modified to only click Thanks)
    function performActions() {
        clickElement('#thanks-button', function(err) {
            if (err) return;
            console.log('Thanks action performed successfully');
        });
    }

    // Event listener for page load to start actions
    window.addEventListener('load', performActions);

    // Global error handling
    window.addEventListener('error', function(e) {
        console.error('Global error occurred:', e.error);
    });
})();