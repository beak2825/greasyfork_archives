// ==UserScript==
// @name         F95Zone - Buzzheavier Direct Download
// @namespace    clandestine
// @version      0.1
// @description  Directly downloads Buzzheavier links from F95 threads.
// @author       Cat-Ling
// @license      GPL-2.0
// @match        https://f95zone.to/threads/*
// @match        https://buzzheavier.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562186/F95Zone%20-%20Buzzheavier%20Direct%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/562186/F95Zone%20-%20Buzzheavier%20Direct%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const HOST = window.location.hostname;
    const IS_PARENT = HOST.includes('f95zone.to');
    const IS_CHILD = HOST.includes('buzzheavier.com');

    const RE_PAYLOAD = /https:\/\/trashbytes\.net\/dl\/[\w-]+(?:\?.+)?/;
    const SEL_ANCHOR = 'a[href*="buzzheavier.com"]';
    const SEL_BTN = 'a[hx-get*="/download"]';
    const TIMEOUT_MS = 8000;

    const STATE = {
        PENDING: { color: '#FFA500', text: '[Resolving...] ' },
        SUCCESS: { color: '#4CAF50', text: '[Direct] ' }
    };

    // ========================================================================
    // PARENT: F95ZONE
    // ========================================================================
    if (IS_PARENT) {
        const _cache = new Map(); // { url: { element, originalText, timer } }

        window.addEventListener('message', ({ data }) => {
            if (!data || data.op !== 'BH_RESOLVED') return;

            const { src, dest } = data;
            const ctx = _cache.get(src);
            if (!ctx) return;

            const { el, frame, timer } = ctx;
            clearTimeout(timer);

            // Success
            el.dataset.state = 'resolved';
            el.href = dest;
            el.textContent = STATE.SUCCESS.text + ctx.originalText;
            Object.assign(el.style, { color: STATE.SUCCESS.color, fontWeight: 'bold', textDecoration: 'none' });

            if (frame) frame.remove();
            _cache.delete(src);

            // Auto navogate to direct link
            window.location.href = dest;
        });

        const injectFrame = (url) => {
            const frame = document.createElement('iframe');
            Object.assign(frame.style, { display: 'none', visibility: 'hidden', width: 0, height: 0 });
            frame.src = url;
            frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');
            document.body.appendChild(frame);
            return frame;
        };

        document.addEventListener('click', e => {
            const el = e.target.closest(SEL_ANCHOR);
            
            if (!el || el.dataset.state) return;

            e.preventDefault();
            
            const url = el.href;
            const originalText = el.textContent;

            el.dataset.state = 'pending';
            el.textContent = STATE.PENDING.text + originalText;
            el.style.color = STATE.PENDING.color;

            const frame = injectFrame(url);

            // Failsafe timer to not get people stuck in case we trigger some detection or the script gets outdated
            const timer = setTimeout(() => {
                if (el.dataset.state !== 'resolved') {
                    
                    el.dataset.state = ''; // Reset flag
                    el.textContent = originalText;
                    el.style.color = '';
                    if (frame) frame.remove();
                    _cache.delete(url);
                    window.location.href = url; // Fallback nav
                }
            }, TIMEOUT_MS);

            _cache.set(url, { el, originalText, frame, timer });
        });
    }

    // ========================================================================
    // CHILD: BUZZHEAVIER.
    // ========================================================================
    if (IS_CHILD) {
        if (window.top === window.self) return;

        const exec = async () => {
            const btn = document.querySelector(SEL_BTN);
            if (!btn) return;

            const endpoint = window.location.origin + btn.getAttribute('hx-get');

            try {
                const res = await fetch(endpoint, {
                    headers: {
                        'HX-Request': 'true',
                        'HX-Current-URL': window.location.href
                    }
                });

                const text = await res.text();
                const match = text.match(RE_PAYLOAD);
                const header = res.headers.get('HX-Redirect');
                
                let dest = match ? match[0] : (header && header.includes('trashbytes.net') ? header : null);
                
                if (!dest && res.url.includes('trashbytes.net')) dest = res.url;

                if (dest) {
                    window.parent.postMessage({
                        op: 'BH_RESOLVED',
                        src: window.location.href,
                        dest: dest.replace(/&amp;/g, '&')
                    }, '*');
                }
            } catch (e) {
                console.error('[BH-Resolver] Fetch failed', e);
            }
        };

        document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', exec) : exec();
    }
})();
