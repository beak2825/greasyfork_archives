// ==UserScript==
// @name         Line of Action Auto Downloader 
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  automatically downloads reference pictures from Line of Action
// @author       copilot&marco
// @match        https://line-of-action.com/practice-tools/app*
// @license MIT
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/550943/Line%20of%20Action%20Auto%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/550943/Line%20of%20Action%20Auto%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[LoA Downloader] 脚本已启动");

    const selector = ".overlay--image";
    const downloadedSet = new Set();

    function extractUrl(styleStr) {
        console.log("[LoA Downloader] 当前 style:", styleStr);
        const match = styleStr.match(/url\(["']?(.*?)["']?\)/);
        return match ? match[1] : null;
    }

    function downloadImage(url) {
        if (!url) return;
        if (downloadedSet.has(url)) {
            console.log("[LoA Downloader] 已下载过，跳过:", url);
            return;
        }
        downloadedSet.add(url);

        const filename = "LoA_" + Date.now() + "_" + url.split("/").pop();
        console.log("[LoA Downloader] 下载:", url, "保存为:", filename);

        GM_download({
            url: url,
            name: filename,
            onerror: err => console.error("[LoA Downloader] 下载失败:", err),
            onload: () => console.log("[LoA Downloader] 下载完成:", filename)
        });
    }

    function bindObserver() {
        const target = document.querySelector(selector);
        if (!target) {
            console.warn("[LoA Downloader] 未找到目标元素，1秒后重试...");
            setTimeout(bindObserver, 1000);
            return;
        }

        console.log("[LoA Downloader] 找到目标元素，开始监听");

        // 初始提取
        const initialUrl = extractUrl(target.getAttribute("style") || "");
        if (initialUrl) downloadImage(initialUrl);

        const observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                if (m.type === "attributes" && m.attributeName === "style") {
                    const newUrl = extractUrl(target.getAttribute("style") || "");
                    if (newUrl) downloadImage(newUrl);
                }
            }
        });

        observer.observe(target, { attributes: true, attributeFilter: ["style"] });
    }

    window.addEventListener("load", () => {
        bindObserver();
    });

    window.addEventListener("hashchange", () => {
        console.log("[LoA Downloader] hash 变化，重新绑定观察器");
        bindObserver();
    });

})();
