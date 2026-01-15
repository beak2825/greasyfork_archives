// ==UserScript==
// @name         Return YouTube Dislike (Mobile Optimized)
// @namespace    https://www.returnyoutubedislike.com/
// @version      3.1.5-mobile
// @description  Return of the YouTube Dislike for mobile site
// @author       Anarios & JRWR (Modded for Mobile by RehanDilawar)
// @match        *://*.youtube.com/*
// @exclude      *://music.youtube.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @connect      returnyoutubedislikeapi.com
// @run-at       document-end
// @icon         https://www.freeiconspng.com/thumbs/youtube-dislike-png/youtube-dislike-png-red-clipart-13.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562613/Return%20YouTube%20Dislike%20%28Mobile%20Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562613/Return%20YouTube%20Dislike%20%28Mobile%20Optimized%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const extConfig = {
        disableLogging: false,
        numberDisplayFormat: "compactShort",
        numberDisplayRoundDown: true,
        rateBarEnabled: true
    };

    let likesvalue = 0;
    let dislikesvalue = 0;
    let isMobile = location.hostname === "m.youtube.com";

    // --- Utility: Get Video ID ---
    function getVideoId() {
        const url = new URL(window.location.href);
        if (url.pathname.startsWith("/shorts/")) return url.pathname.split("/")[2];
        return url.searchParams.get("v");
    }

    // --- Mobile Selector Helpers ---
    function getMobileButtons() {
        // Mobile YouTube uses different action bar classes
        return document.querySelector('.slim-video-action-bar-actions') ||
               document.querySelector('ytm-segmented-like-dislike-button-renderer');
    }

    function getMobileDislikeContainer() {
        const buttons = getMobileButtons();
        if (!buttons) return null;
        // Target the second button in the action bar (Dislike)
        const dislikeBtn = buttons.querySelectorAll('button')[1];
        if (!dislikeBtn) return null;

        let textSpan = dislikeBtn.querySelector('.button-renderer-text');
        if (!textSpan) {
            textSpan = document.createElement('span');
            textSpan.className = 'button-renderer-text';
            textSpan.style.marginLeft = "5px";
            dislikeBtn.appendChild(textSpan);
        }
        return textSpan;
    }

    // --- API Interaction ---
    async function fetchDislikes() {
        const videoId = getVideoId();
        if (!videoId) return;

        try {
            const response = await fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`);
            const data = await response.json();
            likesvalue = data.likes;
            dislikesvalue = data.dislikes;
            renderDislikes();
        } catch (e) {
            console.error("RYD: Error fetching data", e);
        }
    }

    function renderDislikes() {
        const container = getMobileDislikeContainer();
        if (container) {
            container.innerText = numberFormat(dislikesvalue);
        }
    }

    // --- Formatting ---
    function numberFormat(num) {
        return Intl.NumberFormat(navigator.language, {
            notation: "compact",
            compactDisplay: "short"
        }).format(num);
    }

    // --- Initialization ---
    function init() {
        if (!getVideoId()) return;

        // Wait for buttons to appear
        const checkExist = setInterval(() => {
            if (getMobileButtons()) {
                clearInterval(checkExist);
                fetchDislikes();
            }
        }, 1000);
    }

    // Listen for mobile navigation (YouTube uses SPA navigation)
    window.addEventListener("state-navigate-finish", init);
    window.addEventListener("yt-navigate-finish", init);

    // Initial load
    init();

    // Polling backup for mobile page changes
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            init();
        }
    }, 2000);

})();