// ==UserScript==
// @name         YouTube Share Link Cleaner (Remove ?si=)
// @name:ko      유튜브 공유 링크 클리너 (?si=)
// @name:ja      YouTube リンククリーナー (?si=)
// @name:zh-CN   YouTube 链接清理器 (?si=)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Remove ?si= parameter from YouTube share links
// @description:ko 유튜브 영상 공유 시 생성되는 링크에서 추적 파라미터(?si=)를 제거합니다.
// @description:ja YouTubeの共有ボタンを押したときに表示されるリンクから追跡パラメータ（?si=）を削除します。
// @description:zh-CN 删除 YouTube 分享链接中的追踪参数 (?si=)。
// @author       disprosium1
// @license      MIT
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        navigator.clipboard.writeText
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/563761/YouTube%20Share%20Link%20Cleaner%20%28Remove%20si%3D%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563761/YouTube%20Share%20Link%20Cleaner%20%28Remove%20si%3D%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function cleanUrl(url) {
        try {
            const urlObj = new URL(url);
            urlObj.searchParams.delete('si');
            return urlObj.toString();
        } catch (e) {
            return url;
        }
    }

    function handleShareDialog() {
        const shareInput = document.getElementById('share-url');
        if (!shareInput) return;

        if (shareInput.value.includes('si=')) {
            const originalVal = shareInput.value;
            const cleanVal = cleanUrl(originalVal);
            
            if (originalVal !== cleanVal) {
                shareInput.value = cleanVal;
                shareInput.dispatchEvent(new Event('input', { bubbles: true }));
                shareInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }

        const copyButton = document.querySelector('ytd-unified-share-panel-renderer #copy-button button') || 
                           document.querySelector('yt-share-target-renderer #copy-button button') ||
                           document.querySelector('button[aria-label="복사"]');

        if (copyButton && !copyButton.dataset.tmCleanListener) {
            copyButton.dataset.tmCleanListener = "true";
            
            copyButton.addEventListener('click', function(e) {
                const currentLink = document.getElementById('share-url').value;
                const cleanLink = cleanUrl(currentLink);

                navigator.clipboard.writeText(cleanLink).then(() => {
                    console.log('Clean link copied');
                }).catch(err => {
                    console.error('Failed to copy clean link', err);
                });
            });
        }
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (document.getElementById('share-url')) {
                handleShareDialog();
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();