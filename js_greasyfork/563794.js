// ==UserScript==
// @name         El Universal Bypass and Readability Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove Piano paywall and improve readability on El Universal
// @author       MiguelDLM
// @match        https://www.eluniversal.com.mx/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563794/El%20Universal%20Bypass%20and%20Readability%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/563794/El%20Universal%20Bypass%20and%20Readability%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function injectCSS() {
        const css = `
            #piano_wrapper, #piano_inline, #piano_inline_2, #piano_inline_3, #engagement_piano, iframe[src*="tinypass"], iframe[src*="piano"] { display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; }
            html, body { overflow: auto !important; height: auto !important; position: static !important; touch-action: auto !important; }
        `;
        const s = document.createElement('style');
        s.textContent = css;
        document.head && document.head.appendChild(s);
    }

    function removePiano() {
        const ids = ['piano_wrapper','piano_inline','piano_inline_2','piano_inline_3','engagement_piano'];
        let removed = false;
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.remove(); removed = true; }
        });
        // remove iframes that look like paywall
        document.querySelectorAll('iframe').forEach(iframe => {
            const src = (iframe.src || '').toLowerCase();
            if (src.includes('tinypass') || src.includes('piano') || src.includes('offer')) {
                iframe.remove(); removed = true;
            }
        });
        if (removed) console.log('ElUniversal bypass: piano elements removed');
        return removed;
    }

    injectCSS();
    removePiano();
    // Restore scroll in case the site blocks it via styles or event handlers
    function restoreScroll() {
        try {
            // Strong CSS (already injected), but also clear inline styles
            const docEl = document.documentElement;
            const body = document.body;
            if (docEl) {
                docEl.style.overflow = 'auto';
                docEl.style.height = 'auto';
                docEl.style.position = 'static';
                docEl.style.touchAction = 'auto';
                docEl.removeAttribute('style');
            }
            if (body) {
                body.style.overflow = 'auto';
                body.style.height = 'auto';
                body.style.position = 'static';
                body.style.touchAction = 'auto';
                body.removeAttribute('style');
            }

            // Remove common blocking classes
            const blockingClasses = ['modal-open','no-scroll','noscroll','piano-open','piano-disabled','has-modal','locked'];
            blockingClasses.forEach(cl => {
                if (body && body.classList && body.classList.contains(cl)) body.classList.remove(cl);
                if (docEl && docEl.classList && docEl.classList.contains(cl)) docEl.classList.remove(cl);
            });

            // Add capture-phase listeners to stop other scripts from preventing default on wheel/touchmove
            const stopper = (e) => { try { e.stopImmediatePropagation(); } catch (err) {} };
            // Use passive:false to be able to intercept touch events in some browsers
            window.addEventListener('wheel', stopper, {passive:false, capture:true});
            window.addEventListener('touchmove', stopper, {passive:false, capture:true});

            // Also nullify inline handlers
            window.ontouchmove = null;
            document.ontouchmove = null;
            window.onwheel = null;

            console.log('ElUniversal bypass: scroll restored (styles cleaned, capture blockers added)');
            return true;
        } catch (e) {
            console.error('ElUniversal bypass: error restoring scroll', e);
            return false;
        }
    }

    restoreScroll();
    setTimeout(removePiano, 500);
    setTimeout(removePiano, 1500);
    setTimeout(restoreScroll, 500);
    setTimeout(restoreScroll, 1500);

    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            if (m.addedNodes && m.addedNodes.length) removePiano();
        }
    });
    observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

})();