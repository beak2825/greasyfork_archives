// ==UserScript==
// @name         YouTube Square Design
// @namespace    https://github.com/
// @version      3.0
// @license      MIT
// @description  Remove ALL rounded corners from YouTube - fully working version
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555908/YouTube%20Square%20Design.user.js
// @updateURL https://update.greasyfork.org/scripts/555908/YouTube%20Square%20Design.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const css = `
        /* ========================================
           GLOBAL APPROACH - COMPREHENSIVE COVERAGE
        ======================================== */

        /* Core YouTube polymer elements */
        ytd-rich-item-renderer,
        ytd-rich-grid-media,
        ytd-video-renderer,
        ytd-compact-video-renderer,
        ytd-grid-video-renderer,
        ytd-playlist-renderer,
        ytd-channel-renderer,
        ytd-rich-shelf-renderer,
        ytd-shelf-renderer,
        ytd-movie-renderer,
        ytd-radio-renderer,
        ytd-playlist-video-renderer,
        ytd-post-renderer,
        ytd-backstage-post-renderer,
        ytd-reel-item-renderer,
        ytd-rich-grid-slim-media {
            border-radius: 0 !important;
            box-shadow: none !important;
        }

        /* All thumbnails - most important for homepage/sidebar */
        ytd-thumbnail,
        ytd-thumbnail *,
        ytd-thumbnail img,
        ytd-thumbnail a,
        ytd-thumbnail yt-image,
        ytd-thumbnail yt-img-shadow,
        #thumbnail,
        #thumbnail *,
        #thumbnail img,
        yt-img-shadow,
        yt-img-shadow *,
        yt-img-shadow img,
        yt-image,
        yt-image img,
        .yt-core-image,
        .yt-core-image--fill-parent-height,
        .yt-core-image--fill-parent-width {
            border-radius: 0 !important;
        }

        /* Avatar images */
        #avatar,
        #avatar *,
        #avatar img,
        #avatar yt-img-shadow,
        yt-img-shadow[is-channel-avatar],
        .yt-spec-avatar-shape,
        yt-decorated-avatar-view-model,
        yt-avatar-shape {
            border-radius: 0 !important;
        }

        /* Video player */
        .html5-video-player,
        .html5-video-player *,
        .ytp-cued-thumbnail-overlay-image,
        .ytp-ce-element,
        video {
            border-radius: 0 !important;
        }

        /* All buttons */
        button,
        button *,
        paper-button,
        tp-yt-paper-button,
        tp-yt-paper-icon-button,
        tp-yt-paper-icon-button-light,
        yt-button-shape,
        yt-button-renderer,
        ytd-button-renderer,
        yt-icon-button,
        .yt-spec-button-shape-next,
        #subscribe-button,
        ytd-subscribe-button-renderer,
        ytd-toggle-button-renderer,
        yt-smartimation,
        yt-button-view-model {
            border-radius: 0 !important;
            box-shadow: none !important;
        }

        /* Chips bar (the horizontal scrolling filter bar) */
        yt-chip-cloud-renderer,
        yt-chip-cloud-chip-renderer,
        yt-chip-cloud-chip-renderer *,
        #chip-bar,
        ytd-feed-filter-chip-bar-renderer,
        ytd-feed-filter-chip-bar-renderer *,
        yt-chip-cloud-chip-renderer .yt-spec-button-shape-next,
        yt-chip-cloud-chip-renderer button {
            border-radius: 0 !important;
            box-shadow: none !important;
        }

        /* Remove chip bar background (all variations) */
        ytd-feed-filter-chip-bar-renderer,
        ytd-feed-filter-chip-bar-renderer[is-dark-theme],
        ytd-feed-filter-chip-bar-renderer[is-watch-page],
        #chip-bar,
        #chip-bar.ytd-feed-filter-chip-bar-renderer,
        #chips-wrapper,
        yt-chip-cloud-renderer,
        #chips-content {
            background: transparent !important;
            background-color: transparent !important;
            backdrop-filter: none !important;
        }

        /* Remove background from next/prev arrow buttons */
        #right-arrow,
        #left-arrow,
        #right-arrow.ytd-feed-filter-chip-bar-renderer,
        #left-arrow.ytd-feed-filter-chip-bar-renderer,
        #right-arrow-button,
        #left-arrow-button {
            background: transparent !important;
            background-color: transparent !important;
            background-image: none !important;
            backdrop-filter: none !important;
        }

        /* Remove gradient fade effects next to arrows */
        #left-arrow::before,
        #right-arrow::before,
        #left-arrow::after,
        #right-arrow::after,
        ytd-feed-filter-chip-bar-renderer::before,
        ytd-feed-filter-chip-bar-renderer::after {
            display: none !important;
            background: transparent !important;
            background-image: none !important;
        }

        /* Input fields */
        input,
        input *,
        textarea,
        textarea *,
        #search-input,
        #search,
        ytd-searchbox,
        ytd-searchbox *,
        form#search-form,
        yt-searchbox,
        .ytSearchboxComponentInput {
            border-radius: 0 !important;
        }

        /* Live chat */
        yt-live-chat-renderer,
        yt-live-chat-renderer *,
        yt-live-chat-text-message-renderer,
        yt-live-chat-paid-message-renderer,
        yt-live-chat-membership-item-renderer,
        yt-live-chat-ticker-renderer,
        #author-photo,
        #author-photo *,
        yt-live-chat-author-chip {
            border-radius: 0 !important;
            box-shadow: none !important;
        }

        /* Comments */
        ytd-comment-renderer,
        ytd-comment-renderer *,
        ytd-comment-thread-renderer,
        #author-thumbnail,
        #author-thumbnail *,
        ytd-comments-header-renderer,
        ytd-comment-simplebox-renderer {
            border-radius: 0 !important;
        }

        /* Modals and popups */
        ytd-popup-container,
        ytd-popup-container *,
        yt-dialog-renderer,
        tp-yt-paper-dialog,
        ytd-menu-popup-renderer,
        ytd-modal-with-element-renderer,
        paper-dialog,
        ytd-consent-bump-v2-renderer {
            border-radius: 0 !important;
            box-shadow: none !important;
        }

        /* Badges */
        ytd-badge-supported-renderer,
        yt-author-badge-renderer,
        .badge,
        yt-icon[shape-style] {
            border-radius: 0 !important;
        }

        /* Navigation */
        ytd-guide-renderer,
        ytd-guide-renderer *,
        ytd-guide-entry-renderer,
        ytd-mini-guide-renderer,
        ytd-mini-guide-entry-renderer,
        #guide-icon {
            border-radius: 0 !important;
        }

        /* Header */
        ytd-masthead,
        ytd-masthead *,
        #masthead-container,
        ytd-topbar-menu-button-renderer {
            border-radius: 0 !important;
            box-shadow: none !important;
        }

        /* Watch page */
        #primary,
        #primary *,
        #secondary,
        #secondary *,
        ytd-watch-flexy,
        ytd-watch-metadata,
        ytd-video-primary-info-renderer,
        ytd-video-secondary-info-renderer,
        ytd-channel-name,
        ytd-segmented-like-dislike-button-renderer,
        ytd-segmented-like-dislike-button-renderer * {
            border-radius: 0 !important;
        }

        /* Rich grid (homepage layout) */
        ytd-rich-grid-renderer,
        ytd-rich-grid-row,
        #contents > ytd-rich-grid-row,
        ytd-rich-section-renderer {
            border-radius: 0 !important;
        }

        /* Tooltips */
        tp-yt-paper-tooltip,
        .ytp-tooltip,
        [role="tooltip"] {
            border-radius: 0 !important;
        }

        /* Miscellaneous */
        yt-icon,
        yt-formatted-string,
        ytd-thumbnail-overlay-time-status-renderer,
        #movie_player,
        ytd-thumbnail-overlay-resume-playback-renderer,
        ytd-thumbnail-overlay-toggle-button-renderer,
        yt-lockup-view-model,
        yt-lockup-view-model * {
            border-radius: 0 !important;
        }

        /* ========================================
           LAYOUT FIXES - Prevent overlapping
        ======================================== */

        /* Fix chip bar spacing on homepage */
        ytd-feed-filter-chip-bar-renderer {
            margin-bottom: 24px !important;
            padding-bottom: 12px !important;
        }

        /* Ensure proper spacing between chips and video grid */
        ytd-rich-grid-renderer {
            margin-top: 24px !important;
            padding-top: 0 !important;
        }

        /* Fix the actual chip container */
        #chip-bar.ytd-feed-filter-chip-bar-renderer {
            margin-bottom: 16px !important;
        }

        /* Ensure videos don't start too high */
        ytd-rich-grid-row:first-child {
            margin-top: 16px !important;
        }

        /* Fix sidebar proper spacing */
        #secondary.ytd-watch-flexy {
            margin-top: 0 !important;
        }
    `;

    // Inject styles as early as possible
    const style = document.createElement('style');
    style.id = 'yt-square-design';
    style.textContent = css;

    // Try multiple injection points for earliest possible load
    const injectStyle = () => {
        if (!document.getElementById('yt-square-design')) {
            (document.head || document.documentElement).appendChild(style);
        }
    };

    // Immediate injection
    injectStyle();

    // Backup injection on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectStyle);
    }

    // Final backup on full load
    window.addEventListener('load', injectStyle);

})();