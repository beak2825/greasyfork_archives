// ==UserScript==
// @name         VK Optimizer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ускоряет (оптимизирует) Вконтакте
// @author       torch
// @match        *://*.vk.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555961/VK%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/555961/VK%20Optimizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styles = `
        /* Hide specific VK skeleton elements */
        div#FeedPageSkeleton,
        .LeftMenuLegacySkeleton,
        .TopSearchRoot .SkeletonIso,
        .ProfileMenuSkeletonRoot,
        div[id^=react_rootTopNav] .SkeletonIso {
            display: none !important;
        }

        /* Hide common skeleton and placeholder elements */
        .skeleton,
        .skeleton-loader,
        .placeholder-animation,
        .loading-skeleton,
        [class*="skeleton"],
        .animated-background {
            display: none !important;
        }

        /* Override animation and transition timing */
        * {
            animation-timing-function: step-start !important;
            transition-timing-function: step-start !important;
        }

        *, ::before, ::after {
            transition-property: none !important;
            animation: none !important;
        }
    `;

    GM_addStyle(styles);
})();