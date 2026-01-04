// ==UserScript==
// @name           TVer Click to Play
// @icon           https://www.google.com/s2/favicons?domain=tver.jp&size=16
// @description    Stop auto-play on TVer episode pages.
// @description:ja TVerの自動再生をストップ（hamachi様のスクリプトをベースに修正）
// @namespace      https://bsky.app/profile/neon-ai.art
// @homepage       https://neon-aiart.github.io/
// @version        1.0
// @author         ねおん
// @match          https://tver.jp/*
// @grant          none
// @run-at         document-idle
// @license        MIT
// @copyright      ねおん (Based on code by hamachi)
// @downloadURL https://update.greasyfork.org/scripts/560254/TVer%20Click%20to%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/560254/TVer%20Click%20to%20Play.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const regex = /https:\/\/tver\.jp\/episodes\/.+/;
    let saveURL = "";;

    const observer = new MutationObserver(() => {
        const currentURL = location.href;
        if (regex.test(currentURL)) {
            // URLが変わった場合、停止処理を再度行えるようにリセット
            if (saveURL !== location.href) {
                const video = document.querySelector("video");

                // ビデオが見つかり、かつ再生されている（または再生しようとしている）場合
                if (video && !video.paused) {
                    video.pause();
                    video.currentTime = 0;
                    // 1回止めたらこのURLでの自動停止は終了
                    saveURL = currentURL;
                    // console.log("[Debug] Auto-play stopped successfully.");
                }
            }
        } else {
            // エピソードページ以外（トップ画面など）に戻ったらリセット
            saveURL = "";
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();