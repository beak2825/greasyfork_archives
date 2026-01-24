// ==UserScript==
// @name         User-Agent Rotator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Cycles or spoofs User-Agent strings automatically
// @author       sakura1337
// @match        *://*/*
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563934/User-Agent%20Rotator.user.js
// @updateURL https://update.greasyfork.org/scripts/563934/User-Agent%20Rotator.meta.js
// ==/UserScript==

/*
MIT License
Copyright (c) 2025 sakura1337

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files, to deal in the Software
without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to
do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
*/

(function() {
    'use strict';

    // List of User-Agent strings to rotate through
    const userAgents = [
        // Chrome on Windows
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        // Chrome on macOS
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        // Firefox on Windows
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
        // Firefox on macOS
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
        // Safari on macOS
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
        // Safari on iOS
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
        // Edge on Windows
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
        // Chrome on Linux
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        // Opera on Windows
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OPR/106.0.0.0',
        // Mobile Chrome on Android
        'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.210 Mobile Safari/537.36',
    ];

    // Rotation mode: 'random', 'round-robin', 'session'
    const ROTATION_MODE = 'random';

    // Storage key
    const STORAGE_KEY = 'tampermonkey_ua_index';
    const SESSION_KEY = 'tampermonkey_ua_session';

    let currentUA = '';

    // Get UA based on rotation mode
    function getUA() {
        if (ROTATION_MODE === 'random') {
            return userAgents[Math.floor(Math.random() * userAgents.length)];
        }
        
        if (ROTATION_MODE === 'session') {
            let sessionUA = sessionStorage.getItem(SESSION_KEY);
            if (!sessionUA) {
                sessionUA = userAgents[Math.floor(Math.random() * userAgents.length)];
                sessionStorage.setItem(SESSION_KEY, sessionUA);
            }
            return sessionUA;
        }

        // Round-robin
        let index = parseInt(localStorage.getItem(STORAGE_KEY) || '0');
        const ua = userAgents[index];
        index = (index + 1) % userAgents.length;
        localStorage.setItem(STORAGE_KEY, index.toString());
        return ua;
    }

    // Initialize
    currentUA = getUA();

    // Override Navigator properties
    const navProto = Object.getPrototypeOf(navigator);
    
    Object.defineProperty(navProto, 'userAgent', {
        get: function() { return currentUA; },
        configurable: true
    });

    Object.defineProperty(navProto, 'platform', {
        get: function() {
            if (currentUA.includes('Windows')) return 'Win32';
            if (currentUA.includes('Mac OS')) return 'MacIntel';
            if (currentUA.includes('Linux')) return 'Linux x86_64';
            if (currentUA.includes('Android')) return 'Linux armv7l';
            if (currentUA.includes('iOS') || currentUA.includes('iPhone')) return 'iPhone';
            return 'Unknown';
        },
        configurable: true
    });

    Object.defineProperty(navProto, 'appVersion', {
        get: function() { return currentUA.replace('Mozilla/', ''); },
        configurable: true
    });

    Object.defineProperty(navProto, 'appName', {
        get: function() { return 'Netscape'; },
        configurable: true
    });

    // Console helpers
    console.log('[User-Agent Rotator] Active UA:', currentUA);

    window.setUserAgent = function(ua) {
        if (userAgents.includes(ua)) {
            currentUA = ua;
            console.log('[User-Agent Rotator] UA changed to:', ua);
        } else {
            userAgents.push(ua);
            currentUA = ua;
        }
    };

    window.getCurrentUA = function() { return currentUA; };
    window.getAllUAs = function() { return userAgents; };

})();
