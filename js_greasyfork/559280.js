// ==UserScript==
// @name         TikTok Vertical Monitor Layout Fix + Toggle
// @namespace    tiktok-vertical-layout
// @description  fix centering, add 2x
// @version      1.4
// @match        https://www.tiktok.com/*
// @exclude      https://www.tiktok.com/
// @exclude      https://www.tiktok.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/559280/TikTok%20Vertical%20Monitor%20Layout%20Fix%20%2B%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/559280/TikTok%20Vertical%20Monitor%20Layout%20Fix%20%2B%20Toggle.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function isVerticalScreen() {
        return window.innerHeight > window.innerWidth * 1.1;
    }

    function isForYouFeed() {
        return (
            document.querySelector('[data-e2e="recommend-list"]') ||
            document.querySelector('[data-e2e="home-feed"]') ||
            document.querySelector('[data-e2e="comment-button"]')
        );
    }

    // Inject CSS ONCE
    GM_addStyle(`
        body.tiktok-vertical-layout {
            overflow-x: hidden;
        }

        body.tiktok-vertical-layout #main-content,
        body.tiktok-vertical-layout main {
            flex-direction: column !important;
            align-items: center;
        }

        body.tiktok-vertical-layout [data-e2e="browse-video"] {
            max-width: 100vw !important;
            padding-bottom: 30vh;
        }

        body.tiktok-vertical-layout video {
            max-height: calc(100vh - 30vh);
            background: black !important;
        }

        body.tiktok-vertical-layout
        [data-e2e="browse-video"] img,
        body.tiktok-vertical-layout
        [data-e2e="browse-video"] picture,
        body.tiktok-vertical-layout
        [data-e2e="browse-video"] canvas {
            display: none !important;
        }

        body.tiktok-vertical-layout
        .css-18j56ob-7937d88b--DivContentContainer {
            position: fixed !important;
            bottom: 0;
            left: 0;
            width: 100vw !important;
            max-height: 30vh;
            resize: vertical;
            overflow-y: auto;
            background: #121212;
            z-index: 9999;
            border-top: 1px solid rgba(255,255,255,0.1);
            transition: transform 0.25s ease;
        }

        body.tiktok-comments-hidden
        .css-18j56ob-7937d88b--DivContentContainer {
            transform: translateY(100%);
        }

        body.tiktok-comments-hidden
        [data-e2e="browse-video"] {
            padding-bottom: 0 !important;
        }

        body.tiktok-comments-hidden video {
            max-height: 100vh !important;
        }
    `);

    function updateLayoutState() {
        if (isVerticalScreen() && !isForYouFeed()) {
            document.body.classList.add('tiktok-vertical-layout');
        } else {
            // FULL RESET on For You
            document.body.classList.remove(
                'tiktok-vertical-layout',
                'tiktok-comments-hidden'
            );
        }
    }

    // Keyboard toggle
    document.addEventListener('keydown', (e) => {
        if (
            e.target.tagName === 'INPUT' ||
            e.target.tagName === 'TEXTAREA' ||
            isForYouFeed()
        ) return;

        if (e.key.toLowerCase() === 't') {
            document.body.classList.toggle('tiktok-comments-hidden');
        }
    });

    // Watch SPA changes
    const observer = new MutationObserver(updateLayoutState);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('resize', updateLayoutState);
    updateLayoutState();

    function spawnHeart(x, y) {
    const heart = document.createElement("div");
    heart.textContent = "❤️";
    heart.style.position = "fixed";
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.fontSize = "80px";
    heart.style.pointerEvents = "none";
    heart.style.transform = "translate(-50%, -50%) scale(0.8)";
    heart.style.opacity = "0.9";
    heart.style.zIndex = "99999";
    heart.style.transition = "transform 0.6s ease, opacity 0.6s ease";

    document.body.appendChild(heart);

    requestAnimationFrame(() => {
        heart.style.transform = "translate(-50%, -50%) scale(1.2)";
        heart.style.opacity = "0";
    });

    setTimeout(() => heart.remove(), 600);
}

document.addEventListener("dblclick", (e) => {
    const video = e.target.closest("video");
    if (!video) return;

    spawnHeart(e.clientX, e.clientY);
});

})();
