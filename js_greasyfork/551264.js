// ==UserScript==
// @name         Unblock Video Play
// @namespace    softforum
// @version      2.2
// @description  Remove blocked div and avoid popups
// @match        *://turbovidhls.com/*
// @match        *://streamtape.xyz/*
// @match        *://javclan.com/*
// @match        *://jav.guru/*
// @match        *://bitstreams.live/*
// @grant        none
// @license      MIT
// @run-at       none
// @downloadURL https://update.greasyfork.org/scripts/551264/Unblock%20Video%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/551264/Unblock%20Video%20Play.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // -----------------------------
    // 1. Remove hidden or overlay iframes
    // -----------------------------
    function shouldRemove(iframe) {
        const style = getComputedStyle(iframe);
        const attrWidth = iframe.getAttribute('width');
        const width = parseInt(style.width, 10) || 0;
        const height = parseInt(style.height, 10) || 0;
        const opacity = parseFloat(style.opacity) || 0;
        const zIndex = parseInt(style.zIndex, 10) || 0;
        const left = parseInt(style.left, 10) || 0;
        const top = parseInt(style.top, 10) || 0;

        // Case 1: explicitly hidden or zero size
        if (attrWidth === '0' || width === 0 || height === 0) return true;

        // Case 2: display:none or visibility:hidden
        if (style.display === 'none' || style.visibility === 'hidden') return true;

        // Case 3: full-screen overlay with low opacity or high z-index
        const isFullscreen =
            style.position === 'fixed' &&
            width >= window.innerWidth * 0.95 &&
            height >= window.innerHeight * 0.95;
        const isInvisible = opacity < 0.1;
        const isHighZ = zIndex >= 99999;
        if (isFullscreen && (isInvisible || isHighZ)) return true;

        // Case 4: off-screen
        if (left < -500 || top < -500) return true;

        return false;
    }

    function removeBadIframes(root = document) {
        const iframes = root.querySelectorAll('iframe');
        for (const iframe of iframes) {
            if (shouldRemove(iframe)) {
                console.log('Removed suspicious iframe:', iframe.src || iframe);
                iframe.remove();
            }
        }
    }

    // initial clean-up
    removeBadIframes();

    // watch for dynamically added iframes
    const observerIframe = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType !== 1) continue;
                if (node.tagName === 'IFRAME') {
                    if (shouldRemove(node)) {
                        console.log('Removed new hidden iframe:', node.src || node);
                        node.remove();
                    }
                } else {
                    removeBadIframes(node);
                }
            }
        }
    });
    observerIframe.observe(document.documentElement, { childList: true, subtree: true });    
    
    
    // -----------------------------
    // 2. Remove blocking div
    // -----------------------------    
    const divSelectors = ["#pop", ".div_pop", ".play-overlay", "[class*='bottomRight']"];
 
    function hideDivs() {
        divSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.remove();
            });
        });
 
        document.querySelectorAll("div").forEach(el => {
            const st = el.style;
            if (
                st.position === "fixed" &&
                st.cursor === "pointer" &&
                st.background === "black" &&
                st.opacity === "0.01"
            ) {
                el.remove();
            }
        });


        document.querySelectorAll("in-page-message").forEach(el => {
            el.remove();
        });
    }

    // Run once after load
    window.addEventListener("load", hideDivs);

    // Optional: keep watching if the site reinserts ads
    const observer = new MutationObserver(hideDivs);
    observer.observe(document.body, { childList: true, subtree: true });
})();
