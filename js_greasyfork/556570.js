// ==UserScript==
// @name           Delete YouTube spam comments
// @name:ja        YouTube[貰える動画]系スパムのコメントを消す
// @namespace      http://tampermonkey.net/
// @version        0.40(test)
// @description    Delete comments containing spam keywords or user IDs. Easily customizable.
// @description:ja スパムキーワードまたはユーザーIDを含むYouTubeコメントを自動削除。カスタマイズ可能。
// @author         kmikrt 
// @license        MIT
// @match          *://www.youtube.com/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/556570/Delete%20YouTube%20spam%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/556570/Delete%20YouTube%20spam%20comments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const blockedKeywords = [
        'るどう', 'つまんな', 'る動',
        '絶対に翻訳したら', '簡単に稼げる', 'LINE追加',
        '例として書いておく１'
    ];

    const blockedUserIds = [
        '@%E3%81%97%E3%82%93-d9s',
        '@%E3%82%B3%E3%82%B9%E3%83%A1%E5%A4%A7%E5%A5%BD%E3%81%8D%E3%81%AA%E3%82%8A%E3%82%93%E3%81%AA',
        '@%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E8%A6%8B%E3%81%9F%E3%82%84%E3%81%A4%E5%8B%95%E7%94%BB%E8%A6%8B%E3%82%8D',
        '@%E3%81%AD%E3%82%8B%E3%81%AD%E3%82%8B%E3%81%95%E3%81%B6-i5k',
        '@a217b_7ab',
        '%E4%BD%BF%E3%83%A9%E3%83%95%E3%83%AC%E3%82%B7%E3%82%A2',
        '@nanoha-145',
        '@%E7%A7%81%E9%A0%AD%E3%81%84%E3%81%84%E3%81%A7%E3%81%99a',
        '@%E3%82%BD%E3%82%B7%E3%83%A3%E3%82%B2%E3%81%AE%E9%97%87',
        '@%E7%94%B0%E5%8F%A3%E8%A9%A9%E9%81%8A-p2v',
        '@%E5%A0%95%E8%83%8E%E3%83%91%E3%83%B3%E3%83%81',
        '@%E3%83%99%E3%83%A0%E3%82%B9%E3%82%BF%E3%83%BC%E3%81%8B%E3%82%82',
        '@例5',
        '@例5',
        '@例5',
        '@例5',
        '@例4'
    ];

    /* =========================
       NG REGEX (language-based)
       ========================= */

    const blockedRegex = [
        /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/u, // Arabic
        /[\u0400-\u04FF]/u,                           // Cyrillic
        /[\uAC00-\uD7AF]/u,                           // Hangul
        /[\u0E00-\u0E7F]/u                            // Thai
    ];

    let observer = null;

    function stopObservingComments() {
        if (observer) {
            observer.disconnect();
            observer = null;
            console.log('🛑 Stopped observing comments.');
        }
    }

    function handleNewNode(node) {
        if (!(node instanceof HTMLElement)) return;

        if (
            node.matches('ytd-comment-thread-renderer, ytd-comment-view-model') ||
            node.querySelector('ytd-comment-view-model')
        ) {
            const commentTexts = node.querySelectorAll(
                'yt-attributed-string[slot="content"] span.yt-core-attributed-string'
            );

            commentTexts.forEach(comment => {
                const text = comment.textContent || '';

                if (
                    blockedKeywords.some(keyword => text.includes(keyword)) ||
                    blockedRegex.some(regex => regex.test(text))
                ) {
                    const container = comment.closest('ytd-comment-view-model');
                    if (container) {
                        console.log('🧹 Deleted by text NG:', text);
                        container.remove();
                    }
                }
            });

            const authorLinks = node.querySelectorAll('a#author-text.yt-simple-endpoint');
            authorLinks.forEach(link => {
                const href = link.getAttribute('href') || '';

                if (
                    blockedUserIds.some(id => href.includes(id)) ||
                    blockedRegex.some(regex => regex.test(href))
                ) {
                    const container = link.closest('ytd-comment-view-model');
                    if (container) {
                        console.log('🧹 Deleted by author NG:', href);
                        container.remove();
                    }
                }
            });
        }
    }

    function observeComments() {
        const target = document.querySelector('ytd-comments#comments');
        if (!target) return;

        observer = new MutationObserver(function(mutations) {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    handleNewNode(node);
                });
            });
        });

        observer.observe(target, { childList: true, subtree: true });
        console.log('📡 Started observing YouTube comments (optimized).');
    }

    function waitForCommentsElement() {
        const waitObserver = new MutationObserver(function() {
            if (document.querySelector('ytd-comments#comments')) {
                waitObserver.disconnect();
                observeComments();
            }
        });

        waitObserver.observe(document.body, { childList: true, subtree: true });
        console.log('⏳ Waiting for comments section...');
    }

    function checkURLAndObserve() {
        if (window.location.href.includes('watch') || window.location.href.includes('live')) {
            waitForCommentsElement();
        } else {
            stopObservingComments();
        }
    }

    window.addEventListener('load', function() {
        checkURLAndObserve();
    });

    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            checkURLAndObserve();
        }
    }).observe(document.body, { subtree: true, childList: true });
})();
