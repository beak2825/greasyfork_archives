// ==UserScript==
// @name         Steam艺术作品黑边图片修复
// @name:en      Steam Artwork Black Border Fix
// @version      1.0.1
// @description  Steam 艺术作品黑边图片修复
// @description:en Steam Web Artwork Black Border Fix
// @author       lecoler
// @match        https://steamcommunity.com/id/*/images
// @match        https://steamcommunity.com/id/*/images/*
// @match        https://steamcommunity.com/profiles/*/images
// @match        https://steamcommunity.com/profiles/*/images/*
// @icon         https://steamcommunity.com/favicon.ico
// @grant        none
// @homepageURL  https://github.com/lecoler/SteamWebArtworkFix
// @run-at 		 document-end
// @namespace https://greasyfork.org/users/320236
// @downloadURL https://update.greasyfork.org/scripts/550094/Steam%E8%89%BA%E6%9C%AF%E4%BD%9C%E5%93%81%E9%BB%91%E8%BE%B9%E5%9B%BE%E7%89%87%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/550094/Steam%E8%89%BA%E6%9C%AF%E4%BD%9C%E5%93%81%E9%BB%91%E8%BE%B9%E5%9B%BE%E7%89%87%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function processFloatHelp(helpEl, {skipProcessedCheck = false} = {}) {
        if (!skipProcessedCheck && helpEl.dataset.processed) return;

        const aTag = helpEl.querySelector("a");

        if (
            aTag &&
            aTag.href.startsWith("https://steamcommunity.com/sharedfiles/filedetails")
        ) {
            const divTag = aTag.querySelector("div");

            if (
                divTag &&
                divTag.style.backgroundImage &&
                divTag.style.backgroundImage.includes("https://images.steamusercontent.com")
            ) {
                // 修改 a 标签高度
                aTag.style.height = "180px";

                // 修改背景图 ?imh 参数
                const bg = divTag.style.backgroundImage;
                const urlMatch = bg.match(/url\(["']?(.*?)["']?\)/);
                if (urlMatch) {
                    let imageUrl = urlMatch[1];
                    const [base, query] = imageUrl.split("?");
                    const params = new URLSearchParams(query || "");
                    params.set("imh", "180");
                    const newUrl = base + "?" + params.toString();
                    divTag.style.backgroundImage = `url("${newUrl}")`;
                }

                // 标记（只在非 resize 的情况下加）
                if (!skipProcessedCheck) {
                    helpEl.dataset.processed = "1";
                }
            }
        }
    }

    function processAll({skipProcessedCheck = false} = {}) {
        document.querySelectorAll(".floatHelp").forEach(el =>processFloatHelp(el, {skipProcessedCheck}));
    }

    // 初始执行
    processAll();

    // 监听 DOM 变化
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.classList.contains("floatHelp")) {
                        processFloatHelp(node);
                    } else {
                        node.querySelectorAll?.(".floatHelp").forEach(processFloatHelp);
                    }
                }
            });
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 监听窗口 resize（强制跳过 processed 检查）
    window.addEventListener("resize", () => processAll({skipProcessedCheck: true}));
})();
