// ==UserScript==
// @name         Auto Like YouTube Videos v20.11.2
// @namespace    https://github.com/seth-wiiplaza
// @version      20.11.2
// @description  Automatically likes YouTube videos ONLY in fullscreen mode
// @author       Seth@WiiPlaza
// @icon         https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/85aa6584-7ebf-439b-b994-59802e194f0b/djm0ls4-ac1eba6a-6058-4454-9ce9-6eba6ad26b23.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzg1YWE2NTg0LTdlYmYtNDM5Yi1iOTk0LTU5ODAyZTE5NGYwYlwvZGptMGxzNC1hYzFlYmE2YS02MDU4LTQ0NTQtOWNlOS02ZWJhNmFkMjZiMjMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.ei28OmVYY6hrSLNsa61AIocsIhsN2VKBCRUv2N6lTc4
// @match        *://www.youtube.com/*
// @match        *://www.youtube-nocookie.com/embed/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555312/Auto%20Like%20YouTube%20Videos%20v20112.user.js
// @updateURL https://update.greasyfork.org/scripts/555312/Auto%20Like%20YouTube%20Videos%20v20112.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function isFullscreen() {
        return !!document.fullscreenElement;
    }

    function likeVideoFullscreenOnly() {
        if (!isFullscreen()) return;

        const feedbackDiv = document.querySelector(
            '.ytPlayerQuickActionButtonsHost > like-button-view-model:nth-child(1) > toggle-button-view-model:nth-child(1) > button-view-model:nth-child(1) > button:nth-child(1) > yt-touch-feedback-shape:nth-child(2) > div:nth-child(2)'
        );

        if (!feedbackDiv) return;

        const button = feedbackDiv.closest('button');
        if (!button) return;

        const isLiked = button.getAttribute('aria-pressed') === 'true';
        if (!isLiked) {
            button.click();
            console.log('[AutoLike] Liked video in fullscreen');
        }
    }

    const observer = new MutationObserver(() => {
        setTimeout(likeVideoFullscreenOnly, 800);
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    document.addEventListener('fullscreenchange', () => {
        if (isFullscreen()) {
            setTimeout(likeVideoFullscreenOnly, 800);
        }
    });

    window.addEventListener('yt-navigate-finish', () => {
        setTimeout(likeVideoFullscreenOnly, 1500);
    });
})();
