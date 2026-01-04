// ==UserScript==
// @name         Emulate sendBeacon on Perplexity.ai
// @namespace    http://tampermonkey.net/
// @author       ohmylock
// @version      1.0
// @description  Emulate sendBeacon if beacon.enabled is disabled in Firefox for https://*.perplexity.ai/*
// @match        https://*.perplexity.ai/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551068/Emulate%20sendBeacon%20on%20Perplexityai.user.js
// @updateURL https://update.greasyfork.org/scripts/551068/Emulate%20sendBeacon%20on%20Perplexityai.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Переопределяем navigator.sendBeacon для сайта, если это нужно
    if (!navigator.sendBeacon) {
        navigator.sendBeacon = function(url, data) {
            try {
                fetch(url, {
                    method: 'POST',
                    body: data,
                    keepalive: true,
                    credentials: 'include', // если нужен куки
                    headers: {
                        // Если данные в формате Blob или FormData, можно не указывать
                        // 'Content-Type': 'application/x-www-form-urlencoded' // при необходимости
                    }
                });
                return true;
            } catch (e) {
                return false;
            }
        };
    }
})();
