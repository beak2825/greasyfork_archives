// ==UserScript==
// @name         Browser Signature Anonymizer
// @namespace    QnJvd3NlciBTaWduYXR1cmUgQW5vbnltaXplcg
// @version      1.0
// @description  Spoofs key browser fingerprinting properties to enhance anonymity
// @author       smed79
// @license      GPLv3
// @icon         https://i25.servimg.com/u/f25/11/94/21/24/anonym11.png
// @run-at       document-start
// @include      http://*
// @include      https://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549559/Browser%20Signature%20Anonymizer.user.js
// @updateURL https://update.greasyfork.org/scripts/549559/Browser%20Signature%20Anonymizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Spoof user agent
    Object.defineProperty(navigator, 'userAgent', {
        get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36'
    });

    // Spoof screen resolution
    Object.defineProperty(screen, 'width', { get: () => 1920 });
    Object.defineProperty(screen, 'height', { get: () => 1080 });
    Object.defineProperty(screen, 'availWidth', { get: () => 1920 });
    Object.defineProperty(screen, 'availHeight', { get: () => 1040 });

    // Spoof language
    Object.defineProperty(navigator, 'language', { get: () => 'en-US' });
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });

    // Spoof platform
    Object.defineProperty(navigator, 'platform', { get: () => 'Win32' });

    // Disable plugins enumeration
    Object.defineProperty(navigator, 'plugins', { get: () => [] });

    // Disable mimeTypes enumeration
    Object.defineProperty(navigator, 'mimeTypes', { get: () => [] });

    // Spoof timezone
    Intl.DateTimeFormat = function() {
        return {
            resolvedOptions: () => ({ timeZone: 'UTC' })
        };
    };

    // Canvas fingerprinting resistance
    const toDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function() {
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/6XfZ9sAAAAASUVORK5CYII=";
    };

    // Audio fingerprinting resistance
    const getChannelData = AudioBuffer.prototype.getChannelData;
    AudioBuffer.prototype.getChannelData = function() {
        const data = getChannelData.apply(this, arguments);
        for (let i = 0; i < data.length; i++) {
            data[i] = data[i] + (Math.random() * 0.00001);
        }
        return data;
    };
})();
