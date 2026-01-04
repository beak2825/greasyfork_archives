// ==UserScript==
// @name         Bypass CliffsNotes Premium
// @name:zh-CN   绕过 CliffsNotes 高级会员
// @namespace    https://greasyfork.org/users/1512314
// @version      1.0
// @description  Removes premium paywall popups, blur effects, and overlays on CliffsNotes study notes and documents, allowing full access to previews without subscription.
// @description:zh-CN 移除 CliffsNotes 学习笔记和文档上的高级会员付费墙弹窗、模糊效果和覆盖层，让您无需订阅即可完全访问预览。
// @author       user81829132
// @match        https://www.cliffsnotes.com/*
// @icon         https://www.google.com/s2/favicons?domain=cliffsnotes.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552867/Bypass%20CliffsNotes%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/552867/Bypass%20CliffsNotes%20Premium.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removePremiumElements() {
        // Remove the main premium popup
        const mainPopup = document.querySelector('div.tw-py-16.tw-px-32.tw-bg-black.tw-text-white.tw-rounded-lg.tw-flex.tw-flex-col.tw-items-center.-tw-mt-\\[52rem\\]');
        if (mainPopup) {
            mainPopup.remove();
        }

        // Remove the blur overlay - broad selector to catch with or without tw-backdrop-blur-sm
        const blurOverlays = document.querySelectorAll('div.tw-absolute.tw-top-0.tw-left-0.tw-w-full.tw-h-full');
        blurOverlays.forEach(overlay => {
            overlay.remove();
        });

        // Remove the "Why is this page out of focus?" popup
        const focusPopup = document.querySelector('div.tw-w-4\\/5.tw-text-center.tw-py-24');
        if (focusPopup) {
            focusPopup.remove();
        }

        // Also target any elements with backdrop-blur-sm class to unblur content
        const blurredElements = document.querySelectorAll('.tw-backdrop-blur-sm');
        blurredElements.forEach(el => {
            el.classList.remove('tw-backdrop-blur-sm');
            el.style.backdropFilter = 'none';
            el.style.filter = 'none';
            el.style.webkitBackdropFilter = 'none';
            el.style.webkitFilter = 'none';
        });

        // Hide any remaining premium modals or overlays by adding a style
        let style = document.getElementById('bypass-cliffsnotes-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'bypass-cliffsnotes-style';
            style.textContent = `
                div[class*="premium"], div[class*="paywall"], div[class*="subscription"] {
                    display: none !important;
                }
                .tw-backdrop-blur-sm {
                    filter: none !important;
                    backdrop-filter: none !important;
                    -webkit-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                }
                /* Extra override for any full-screen overlays */
                div.tw-absolute.tw-top-0.tw-left-0.tw-w-full.tw-h-full {
                    display: none !important;
                }
                /* Ensure document content is not blurred */
                [class*="html-preview"], [class*="document-content"], .t, .s0_1, .s1_1, span[class*="t"] {
                    filter: none !important;
                    backdrop-filter: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Run immediately
    removePremiumElements();

    // Observe for dynamic additions (in case popups load later)
    const observer = new MutationObserver(removePremiumElements);
    observer.observe(document.body, { childList: true, subtree: true });

    // Also run after short delays for any async loads, including later pages
    setTimeout(removePremiumElements, 1000);
    setTimeout(removePremiumElements, 3000);
    setTimeout(removePremiumElements, 5000);

    // Periodic check for multi-page docs
    const interval = setInterval(() => {
        removePremiumElements();
    }, 2000);

    // Stop interval after 30 seconds if no more issues
    setTimeout(() => clearInterval(interval), 30000);
})();