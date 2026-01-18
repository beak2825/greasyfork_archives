// ==UserScript==
// @name         YouTube - ClearVision V4 (Full Metadata Fix)
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  Complete UI overhaul including the video metadata, subscribe bar, and "above-the-fold" content.
// @author       Gemini/ClearVision
// @match        *://*.youtube.com/*
// @license      MIT
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562868/YouTube%20-%20ClearVision%20V4%20%28Full%20Metadata%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562868/YouTube%20-%20ClearVision%20V4%20%28Full%20Metadata%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        /* --- CORE THEME VARIABLES --- */
        :root {
            --cv-bg-image: url(https://clearvision.github.io/images/sapphire.jpg);
            --cv-overlay: rgba(0, 0, 0, 0.40);
            --cv-accent: #2780e6;
            --cv-accent-glow: rgba(39, 128, 230, 0.5);
            --cv-blur: 15px;
            --cv-glass: rgba(255, 255, 255, 0.05);
        }

        /* --- GLOBAL TRANSPARENCY (EVERYTHING TRANSPARENT) --- */
        * {
            background: transparent !important;
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
            transition: none !important;
            animation: none !important;
            transform: none !important;
        }

        /* Restore background image for main elements */
        html, body, ytd-app {
            background: var(--cv-bg-image) fixed center/cover !important;
            background-color: transparent !important;
            transition: none !important;
            animation: none !important;
        }

        /* Remove all YouTube animations and transitions */
        *, *::before, *::after {
            transition-duration: 0s !important;
            transition-delay: 0s !important;
            animation-duration: 0s !important;
            animation-delay: 0s !important;
        }

        /* Specific YouTube animation classes */
        .yt-smartimation, .smartimation, .smartimation__content,
        .yt-animated-icon, .ytAnimatedActionHost, .ytAnimatedActionContentWithBackground,
        .lottie-player, .ytLottieComponentHost, ytd-lottie-player, lottie-component {
            animation: none !important;
            transition: none !important;
            transform: none !important;
        }

        html[dark], [dark] {
            --yt-spec-base-background: transparent !important;
            --yt-spec-raised-background: transparent !important;
            --yt-spec-general-background-a: transparent !important;
            --yt-spec-brand-background-primary: transparent !important;
            --yt-spec-10-percent-layer: transparent !important;
            --yt-spec-badge-chip-background: transparent !important;
            --yt-spec-button-chip-background-hover: transparent !important;
        }

        /* Video Player Transparency */
        #movie_player, .html5-video-container, .html5-video-player,
        .video-stream, .ytp-player-container, .ytp-watch-flexy,
        .ytp-embed, .ytp-embed-video, .ytp-player-content {
            background: transparent !important;
            background-color: transparent !important;
        }

        /* All Buttons Transparent */
        button, .yt-spec-button-shape-next, .yt-spec-button-shape-next--filled,
        .yt-spec-button-shape-next--tonal, .yt-spec-button-shape-next--outlined,
        .yt-spec-button-shape-next--text, .ytd-button-renderer,
        #subscribe-button, #like-button, #dislike-button, #share-button {
            background: transparent !important;
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
        }

        /* All Text Elements Transparent Background */
        h1, h2, h3, h4, h5, h6, p, span, div, yt-formatted-string,
        .yt-core-attributed-string, .ytd-video-primary-info-renderer,
        .ytd-video-secondary-info-renderer, #title, #description,
        #owner, #top-row, #above-the-fold, #actions, #actions-inner {
            background: transparent !important;
            background-color: transparent !important;
        }

        /* Comments Section */
        ytd-comments, ytd-comment-thread-renderer, ytd-comment-renderer,
        #comments, #comment-section-renderer-items {
            background: transparent !important;
            background-color: transparent !important;
        }

        /* Sidebar and Recommendations */
        #secondary, #secondary-inner, ytd-watch-next-secondary-results-renderer,
        ytd-compact-video-renderer, ytd-recommendation-renderer {
            background: transparent !important;
            background-color: transparent !important;
        }

        /* Header and Search */
        #masthead, #container.ytd-searchbox, ytd-searchbox,
        #search-form, #search-input {
            background: transparent !important;
            background-color: transparent !important;
            border: none !important;
        }

        /* Remove all borders and shadows */
        * {
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            outline: none !important;
        }

        /* Keep text visible with shadows for readability */
        h1, h2, h3, h4, h5, h6, p, span, yt-formatted-string,
        .yt-core-attributed-string, #title, #description,
        #channel-name a, #owner-sub-count {
            color: white !important;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8) !important;
        }

        /* Button text visibility */
        button, .yt-spec-button-shape-next, .yt-core-attributed-string {
            color: white !important;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8) !important;
        }
    `;

    // Inject styles
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

})();