// ==UserScript==
// @name         Подсветка лайкнутых тем и симпатий
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Подсвечивает темы, где ты поставил лайк/симпатию или ответил
// @author       Forest
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562542/%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BB%D0%B0%D0%B9%D0%BA%D0%BD%D1%83%D1%82%D1%8B%D1%85%20%D1%82%D0%B5%D0%BC%20%D0%B8%20%D1%81%D0%B8%D0%BC%D0%BF%D0%B0%D1%82%D0%B8%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/562542/%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BB%D0%B0%D0%B9%D0%BA%D0%BD%D1%83%D1%82%D1%8B%D1%85%20%D1%82%D0%B5%D0%BC%20%D0%B8%20%D1%81%D0%B8%D0%BC%D0%BF%D0%B0%D1%82%D0%B8%D0%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY_LIKES = 'lzt_liked_threads';
    const STORAGE_KEY_REPLIES = 'lzt_replied_threads';

    const style = document.createElement('style');
    style.textContent = `
        .discussionListItem--like2Count.icon.lzt-liked-thread::before,
        .discussionListItem--likeCount.icon.lzt-liked-thread::before {
            color: #4CAF50 !important;
        }
        .discussionListItem--replyCount.icon.lzt-replied-thread::before {
            color: #4CAF50 !important;
        }
    `;
    document.head.appendChild(style);

    function getStoredThreads(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    function saveStoredThreads(key, threads) {
        try {
            localStorage.setItem(key, JSON.stringify(threads));
        } catch (e) {
            console.error(e);
        }
    }

    function updateStorage(key, threadId, shouldAdd) {
        const stored = getStoredThreads(key);
        const index = stored.indexOf(threadId);

        if (shouldAdd) {
            if (index === -1) {
                stored.push(threadId);
                saveStoredThreads(key, stored);
            }
        } else {
            if (index > -1) {
                stored.splice(index, 1);
                saveStoredThreads(key, stored);
            }
        }
    }

    function getCurrentThreadId() {
        const match = window.location.pathname.match(/\/threads\/(\d+)/);
        return match ? match[1] : null;
    }

    function getCurrentUsername() {
        if (typeof XenForo !== 'undefined' && XenForo.visitor && XenForo.visitor.username) {
            return XenForo.visitor.username;
        }
        const $visitor = $('.visitorMenu .username');
        return $visitor.length ? ($visitor.attr('data-username') || $visitor.text().trim()) : null;
    }

    function trackLikesInThread() {
        const threadId = getCurrentThreadId();
        if (!threadId) return;

        const $firstPostLikeLink = $('.message').first().find('.LikeLink').first();
        if (!$firstPostLikeLink.length) return;

        const checkState = () => {
            const isLiked = $firstPostLikeLink.hasClass('unlike');
            updateStorage(STORAGE_KEY_LIKES, threadId, isLiked);
        };

        checkState();

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    checkState();
                }
            });
        });

        observer.observe($firstPostLikeLink[0], {
            attributes: true
        });
    }

    function trackRepliesInThread() {
        const threadId = getCurrentThreadId();
        if (!threadId) return;

        const currentUser = getCurrentUsername();
        if (!currentUser) return;

        const hasUserPost = $('.message').filter(function() {
            const author = $(this).attr('data-author');
            return author && author.toLowerCase() === currentUser.toLowerCase();
        }).length > 0;

        if (hasUserPost) {
            updateStorage(STORAGE_KEY_REPLIES, threadId, true);
        }
    }

    function highlightThreadsInList() {
        const likedThreads = getStoredThreads(STORAGE_KEY_LIKES);
        const repliedThreads = getStoredThreads(STORAGE_KEY_REPLIES);

        $('.discussionListItem').each(function() {
            const $item = $(this);
            const itemId = $item.attr('id');
            if (!itemId) return;

            const threadId = itemId.replace('thread-', '');

            if (likedThreads.includes(threadId)) {
                $item.find('.discussionListItem--likeCount, .discussionListItem--like2Count')
                     .addClass('lzt-liked-thread');
            }

            if (repliedThreads.includes(threadId) || $item.hasClass('userPosted')) {
                $item.find('.discussionListItem--replyCount').addClass('lzt-replied-thread');

                if ($item.hasClass('userPosted') && !repliedThreads.includes(threadId)) {
                    updateStorage(STORAGE_KEY_REPLIES, threadId, true);
                }
            }
        });
    }

    function init() {
        if (window.location.pathname.match(/\/threads\/\d+/)) {
            trackLikesInThread();
            trackRepliesInThread();
        } else {
            highlightThreadsInList();
        }
    }

    $(document).on('XenForoActivationComplete', init);
    $(document).ready(init);

})();