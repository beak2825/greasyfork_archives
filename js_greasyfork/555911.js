// ==UserScript==
// @name         YouTube Ultra-Optimized Background + Text Colors + Blur
// @namespace    https://youtube.com/
// @version      4.0
// @license MIT
// @description  Zero-lag background with organized settings block & optional blur
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555911/YouTube%20Ultra-Optimized%20Background%20%2B%20Text%20Colors%20%2B%20Blur.user.js
// @updateURL https://update.greasyfork.org/scripts/555911/YouTube%20Ultra-Optimized%20Background%20%2B%20Text%20Colors%20%2B%20Blur.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* =============================================
       🎨 CUSTOMIZATION SETTINGS
       ============================================= */
    const SETTINGS = {
        backgroundImage: "https://images.pexels.com/photos/4737484/pexels-photo-4737484.jpeg",

        // NEW: Blur effect (0 = no blur, 5-10 = subtle, 15-20 = heavy)
        backgroundBlur: 0,

        // NEW: Dark overlay for readability (0 = none, 0.3 = subtle, 0.6 = heavy)
        backgroundOverlay: 0.6,

        // Text colors
        text: "#ffffff",
        secondary: "#cccccc",
        link: "#00b3ff",
        description: "#f5f5f5",
        comment: "#e8e8e8"
    };

    /* =============================================
       🚀 BACKGROUND LAYER (with optional blur)
       ============================================= */
    function injectBackgroundLayer() {
        if (document.getElementById("yt-custom-bg")) return;

        const bg = document.createElement("div");
        bg.id = "yt-custom-bg";
        Object.assign(bg.style, {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: "-999999",
            pointerEvents: "none",
            background: `url("${SETTINGS.backgroundImage}") center center / cover no-repeat`,
            filter: SETTINGS.backgroundBlur > 0 ? `blur(${SETTINGS.backgroundBlur}px)` : "none"
        });

        // Add dark overlay if specified
        if (SETTINGS.backgroundOverlay > 0) {
            bg.style.boxShadow = `inset 0 0 0 100vmax rgba(0, 0, 0, ${SETTINGS.backgroundOverlay})`;
        }

        document.body.appendChild(bg);
    }

    /* =============================================
       🎨 TEXT COLOR CSS
       ============================================= */
    function injectCSS() {
        if (document.getElementById("yt-custom-style")) return;

        const style = document.createElement("style");
        style.id = "yt-custom-style";
        style.textContent = `
        /* Transparent YouTube layers so BG shows through */
        html, body, ytd-app, #content, #page-manager, #primary {
            background: transparent !important;
        }
        /* Main text */
        yt-formatted-string,
        #content-text,
        #description {
            color: ${SETTINGS.text} !important;
        }
        /* Secondary text */
        #metadata-line span {
            color: ${SETTINGS.secondary} !important;
        }
        /* Links */
        a, ytd-channel-name a {
            color: ${SETTINGS.link} !important;
        }
        /* Description */
        #description,
        yt-formatted-string#description {
            color: ${SETTINGS.description} !important;
        }
        /* Comments */
        #comments #content-text {
            color: ${SETTINGS.comment} !important;
        }
        `;
        document.head.appendChild(style);
    }

    /* Initial Load */
    injectBackgroundLayer();
    injectCSS();

    /* Polymer-safe reinjection */
    const observer = new MutationObserver(() => {
        injectBackgroundLayer();
        injectCSS();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();