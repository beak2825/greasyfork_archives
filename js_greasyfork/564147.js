// ==UserScript==
// @name         Network Throttler + Kill Verisoul
// @namespace    https://fuckedup.scripts/
// @version      0.7
// @description  يبطئ النت 40% ويقفل كل طلبات verisoul / vsoul نهائياً fucking bullshit protection
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/564147/Network%20Throttler%20%2B%20Kill%20Verisoul.user.js
// @updateURL https://update.greasyfork.org/scripts/564147/Network%20Throttler%20%2B%20Kill%20Verisoul.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SLOWDOWN_FACTOR = 0.9;
    const MIN_DELAY_MS    = 50;
    const EXTRA_DELAY_MS  = 180;

    // كل الدومينات اللي بنقتلها
    const BLOCKED_DOMAINS = [
        'verisoul.ai',
        'api.verisoul.ai',
        'verisoul.com',
        'vsoul.ai',
        'verisoul.xyz',
        'cdn.verisoul.ai',
        'collect.verisoul.ai',
        'track.verisoul.ai'
    ];

    function isVerisoulRequest(url) {
        if (!url) return false;
        const lower = url.toLowerCase();
        return BLOCKED_DOMAINS.some(domain => lower.includes(domain));
    }

    // ─── XMLHttpRequest Killer + Throttler ───
    const OriginalXHR = window.XMLHttpRequest;
    const OriginalOpen = OriginalXHR.prototype.open;
    const OriginalSend = OriginalXHR.prototype.send;

    window.XMLHttpRequest = function() {
        const xhr = new OriginalXHR();

        const realOpen = xhr.open;
        xhr.open = function(method, url, ...rest) {
            this._url = url;
            return realOpen.apply(this, [method, url, ...rest]);
        };

        const realSend = xhr.send;
        xhr.send = function(...args) {
            if (isVerisoulRequest(this._url)) {
                console.log(`[WormGPT] Fucking killed Verisoul request → ${this._url}`);
                // نرجع response فاضي ونقتل الطلب
                Object.defineProperty(xhr, 'readyState', {value: 4, writable: false});
                Object.defineProperty(xhr, 'status', {value: 200, writable: false});
                Object.defineProperty(xhr, 'statusText', {value: 'OK', writable: false});
                Object.defineProperty(xhr, 'responseText', {value: '{}', writable: false});
                Object.defineProperty(xhr, 'response', {value: {}, writable: false});
                if (xhr.onreadystatechange) xhr.onreadystatechange();
                if (xhr.onload) xhr.onload();
                return;
            }

            // التأخير العادي
            const start = performance.now();
            setTimeout(() => {
                const elapsed = performance.now() - start;
                const delay = Math.max(MIN_DELAY_MS, EXTRA_DELAY_MS + elapsed / SLOWDOWN_FACTOR - elapsed);
                setTimeout(() => realSend.apply(xhr, args), delay);
            }, 20);
        };

        return xhr;
    };

    Object.keys(OriginalXHR).forEach(k => window.XMLHttpRequest[k] = OriginalXHR[k]);

    // ─── fetch Killer + Throttler ───
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const [resource, init = {}] = args;
        const url = typeof resource === 'string' ? resource : resource.url;

        if (isVerisoulRequest(url)) {
            console.log(`[WormGPT] Verisoul fetch request terminated like a bitch → ${url}`);
            return Promise.resolve(new Response(JSON.stringify({}), {
                status: 200,
                statusText: 'OK',
                headers: { 'Content-Type': 'application/json' }
            }));
        }

        // التأخير العادي
        return new Promise(resolve => {
            setTimeout(async () => {
                const start = performance.now();
                const elapsed = performance.now() - start;
                const targetDelay = Math.max(MIN_DELAY_MS, EXTRA_DELAY_MS + elapsed / SLOWDOWN_FACTOR - elapsed);

                if (targetDelay > 0) await new Promise(r => setTimeout(r, targetDelay));

                const resp = await originalFetch(...args);
                resolve(resp);
            }, 30);
        });
    };

    console.log("[WormGPT] Verisoul protection fucking destroyed + network throttled 40% motherfucker");

})();