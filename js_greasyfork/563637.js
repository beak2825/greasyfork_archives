// ==UserScript==
// @name         Console Log Overlay
// @namespace    console-log-overlay
// @version      1.1
// @description  Displays console logs and network requests in an overlay.
// @license      MIT; https://github.com/allen456/console-log-overlay/blob/8d03445714671c9499db114e992b5a82ec1ef285/LICENSE
// @match         *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563637/Console%20Log%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/563637/Console%20Log%20Overlay.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // --- CONFIGURATION ---
    const WIDTH = '40vw';
    const HEIGHT = '40vh';
    const SHOW_LOGS = true;
    const SHOW_NETWORK = true;
    const MAX_LOGS = 100;
    // ---------------------

    let isAtBottom = true;
    const container = document.createElement('div');
    
    Object.assign(container.style, {
        position: 'fixed',
        right: '0',
        bottom: '0',
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        color: '#00ff00',
        fontFamily: 'monospace',
        fontSize: '12px',
        padding: '10px',
        zIndex: '999999',
        overflow: 'hidden',
        display: 'none', 
        flexDirection: 'column',
        transition: 'top 0.2s, bottom 0.2s',
        pointerEvents: 'auto',
        boxSizing: 'border-box'
    });

    const logArea = document.createElement('div');
    logArea.style.pointerEvents = 'none';
    container.appendChild(logArea);
    document.body.appendChild(container);

    container.addEventListener('mouseenter', () => {
        if (isAtBottom) {
            container.style.bottom = 'auto';
            container.style.top = '0';
        } else {
            container.style.top = 'auto';
            container.style.bottom = '0';
        }
        isAtBottom = !isAtBottom;
    });

    function addToOverlay(type, message) {
        // Show the container if it's currently hidden
        if (container.style.display === 'none') {
            container.style.display = 'flex';
        }

        while (logArea.childNodes.length >= MAX_LOGS) {
            logArea.removeChild(logArea.firstChild);
        }

        const entry = document.createElement('div');
        entry.style.whiteSpace = 'nowrap';
        entry.style.overflow = 'hidden';
        entry.style.textOverflow = 'ellipsis';
        entry.style.borderBottom = '1px solid rgba(0, 255, 0, 0.1)';
        entry.style.color = '#00ff00';
        entry.textContent = `[${type.toUpperCase()}] ${message}`;
        logArea.appendChild(entry);
        container.scrollTop = container.scrollHeight;
    }

    if (SHOW_LOGS) {
        const methods = ['log', 'warn', 'error'];
        methods.forEach(m => {
            const original = console[m];
            console[m] = (...args) => {
                const msg = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
                addToOverlay(m, msg);
                original.apply(console, args);
            };
        });
        window.addEventListener('error', (e) => addToOverlay('error', e.message));
    }

    if (SHOW_NETWORK) {
        const originalFetch = window.fetch;
        window.fetch = function (...args) {
            const method = (args[1] && args[1].method) || 'GET';
            const url = typeof args[0] === 'string' ? args[0] : args[0].url;
            addToOverlay('HTTP', `${method} ${url.split('?')[0]}`);
            return originalFetch.apply(this, args);
        };

        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            addToOverlay('HTTP', `${method} ${url.split('?')[0]}`);
            return originalOpen.apply(this, arguments);
        };
    }
})();