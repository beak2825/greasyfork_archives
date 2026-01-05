// ==UserScript==
// @name         Minawan Arcade - Background Remover + Transparent Backdrop
// @namespace    http://tampermonkey.net/
// @author       SamsaWan
// @version      1.0
// @description  Hides only the dynamic background image and replaces it with a blurred translucent layer
// @match        https://arcade.minawan.dog/findtheminawan*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558692/Minawan%20Arcade%20-%20Background%20Remover%20%2B%20Transparent%20Backdrop.user.js
// @updateURL https://update.greasyfork.org/scripts/558692/Minawan%20Arcade%20-%20Background%20Remover%20%2B%20Transparent%20Backdrop.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BG_PATH = "/api/images/background/";
    const RE_FULL_ABS = /^https?:\/\/[^/]+\/api\/images\/background\//i;

    const DARK_GLASS = "rgba(26, 26, 26, 0.55)";
    const BLUR_AMOUNT = "18px";

    // ----------------------------------------------------
    // 1. Insert blurred translucent background layer
    // ----------------------------------------------------
    const style = document.createElement("style");
    style.textContent = `
        #minawan-soft-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: -1;
            background: ${DARK_GLASS};
            backdrop-filter: blur(${BLUR_AMOUNT});
        }

        body {
            background: transparent !important;
        }
    `;
    document.head.appendChild(style);

    if (!document.getElementById("minawan-soft-bg")) {
        const bg = document.createElement("div");
        bg.id = "minawan-soft-bg";
        document.body.appendChild(bg);
    }

    // ----------------------------------------------------
    // 2. Surgical removal of ONLY the dynamic background image
    // ----------------------------------------------------
    const css = `
        img[src*="${BG_PATH}"],
        img[src^="https://arcade.minawan.dog${BG_PATH}"],
        img[src^="http://arcade.minawan.dog${BG_PATH}"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        [style*="${BG_PATH}"] {
            background-image: none !important;
            background-color: transparent !important;
        }
    `;
    const styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    const hideBgImg = (img) => {
        if (!img || img._handled) return;
        const src = img.getAttribute && img.getAttribute('src');
        if (!src) return;

        if (src.indexOf(BG_PATH) === -1 && !RE_FULL_ABS.test(src)) return;

        img._handled = true;
        img.style.setProperty('display', 'none', 'important');
        img.style.setProperty('visibility', 'hidden', 'important');
        img.style.setProperty('opacity', '0', 'important');
        img.removeAttribute('src');
        img.removeAttribute('srcset');
    };

    const clearInlineBg = (el) => {
        if (!el || el._styleHandled) return;
        const style = el.getAttribute && el.getAttribute('style');
        if (!style) return;

        if (style.indexOf(BG_PATH) !== -1) {
            el._styleHandled = true;
            el.style.backgroundImage = 'none';
            el.style.background = 'transparent';
        }
    };

    const sweep = () => {
        document.querySelectorAll('img').forEach(hideBgImg);
        document.querySelectorAll('[style]').forEach(clearInlineBg);
    };
    sweep();

    // Observer for dynamic background image insertions
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.addedNodes && m.addedNodes.length) {
                m.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;

                    if (node.tagName === 'IMG') hideBgImg(node);
                    node.querySelectorAll && node.querySelectorAll('img').forEach(hideBgImg);

                    if (node.getAttribute && node.getAttribute('style')) clearInlineBg(node);
                    node.querySelectorAll && node.querySelectorAll('[style]').forEach(clearInlineBg);
                });
            }

            if (m.type === 'attributes' && m.target) {
                const t = m.target;

                if (t.tagName === 'IMG' && (m.attributeName === 'src' || m.attributeName === 'srcset')) {
                    hideBgImg(t);
                }

                if (m.attributeName === 'style') {
                    clearInlineBg(t);
                }
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'srcset', 'style']
    });

    setInterval(sweep, 1500);
})();
