// ==UserScript==
// @name         あいもげ153fix
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  掲示板のYouTube埋め込みエラー(153)を自動修正します
// @author       You
// @match        https://nijiurachan.net/pc/thread.php?id=*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/560514/%E3%81%82%E3%81%84%E3%82%82%E3%81%92153fix.user.js
// @updateURL https://update.greasyfork.org/scripts/560514/%E3%81%82%E3%81%84%E3%82%82%E3%81%92153fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 修正処理を行う関数
    function fixYoutubeEmbeds() {
        const iframes = document.querySelectorAll('iframe[src*="youtube.com/embed"]');

        iframes.forEach(iframe => {
            // すでに修正済みの場合はスキップ（無限ループ防止）
            if (iframe.getAttribute('data-fixed') === 'true') return;

            // 1. referrerpolicyを追加
            iframe.setAttribute('referrerpolicy', 'origin');

            // 2. originパラメータを追加してリロード
            try {
                const currentSrc = new URL(iframe.src);

                // originパラメータがなければ追加
                if (!currentSrc.searchParams.has('origin')) {
                    currentSrc.searchParams.set('origin', window.location.origin);
                    iframe.src = currentSrc.toString();
                }

                // 修正済みフラグを立てる
                iframe.setAttribute('data-fixed', 'true');

            } catch (e) {
                console.error('YouTube Fix Error:', e);
            }
        });
    }

    // 1. ページ読み込み時に実行
    fixYoutubeEmbeds();

    // 2. 動的な要素追加（オートロードや「さらに読み込む」）に対応するための監視
    const observer = new MutationObserver((mutations) => {
        let shouldRun = false;
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                shouldRun = true;
            }
        });
        if (shouldRun) {
            fixYoutubeEmbeds();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();