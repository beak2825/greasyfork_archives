// ==UserScript==
// @name         YouTube 自动展开并翻译评论（无限滚动适配版）
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  自动展开 YouTube 评论并点击“翻译成中文”按钮，适配新版结构与无限滚动加载。
// @author       ChatGPT
// @match        https://www.youtube.com/watch*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558190/YouTube%20%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%B9%B6%E7%BF%BB%E8%AF%91%E8%AF%84%E8%AE%BA%EF%BC%88%E6%97%A0%E9%99%90%E6%BB%9A%E5%8A%A8%E9%80%82%E9%85%8D%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558190/YouTube%20%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%B9%B6%E7%BF%BB%E8%AF%91%E8%AF%84%E8%AE%BA%EF%BC%88%E6%97%A0%E9%99%90%E6%BB%9A%E5%8A%A8%E9%80%82%E9%85%8D%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const RUN_INTERVAL = 2000; // 每 2 秒扫描一次，兼容无限滚动
    let hasInitLog = false;

    // 展开长评论和回复
    function clickExpandButtons() {
        // 展开“展开”“更多”“查看更多”等
        document
            .querySelectorAll("#comments tp-yt-paper-button span.more-button")
            .forEach(span => {
                const text = span.textContent.trim();
                if (text === "展开" || text === "更多" || text === "查看更多") {
                    const btn = span.closest("tp-yt-paper-button");
                    if (btn && !btn.dataset._ytAutoClicked) {
                        btn.dataset._ytAutoClicked = "1";
                        btn.click();
                    }
                }
            });

        // 展开“查看全部回复”一类按钮
        document
            .querySelectorAll("#comments button[aria-label]")
            .forEach(btn => {
                const label = btn.getAttribute("aria-label") || "";
                if (
                    !btn.dataset._ytAutoClicked &&
                    (label.includes("查看全部") || label.includes("查看回复") || label.includes("更多回复"))
                ) {
                    btn.dataset._ytAutoClicked = "1";
                    btn.click();
                }
            });
    }

    // 点击“翻译成中文”按钮
    function clickTranslateButtons() {
        // 评论区中 tri-state 翻译按钮里的 paper-button
        const buttons = document.querySelectorAll(
            "#comments ytd-tri-state-button-view-model tp-yt-paper-button[role='button']"
        );

        buttons.forEach(btn => {
            if (btn.dataset._ytTranslated) return; // 已处理过，跳过

            const text = (btn.textContent || "").trim();
            if (!text) return;

            // 常见文案：
            //  - 翻译成中文（中国）
            //  - 翻译成中文（简体）
            //  - 翻译评论
            // 已翻译后的按钮一般是“显示原文”“查看原文”之类
            const hasTranslate = text.includes("翻译");
            const isShowOriginal = text.includes("原文") || text.includes("显示原文");

            if (hasTranslate && !isShowOriginal) {
                btn.dataset._ytTranslated = "1";
                btn.click();
            }
        });
    }

    function main() {
        const commentsSection = document.getElementById("comments");
        if (!commentsSection) return;

        if (!hasInitLog) {
            hasInitLog = true;
            console.log("[YT Comment Auto Translate] 启动");
        }

        clickExpandButtons();
        clickTranslateButtons();
    }

    // 等评论区挂载后，再开始循环
    function waitForCommentsAndStart() {
        const timer = setInterval(() => {
            const commentsSection = document.getElementById("comments");
            if (commentsSection) {
                clearInterval(timer);
                // 立即跑一轮
                main();
                // 之后每 RUN_INTERVAL 秒轮询一次，兼容无限滚动
                setInterval(main, RUN_INTERVAL);
            }
        }, 1000);
    }

    waitForCommentsAndStart();
})();
