// ==UserScript==
// @name         GD 檢測器 - Stage 5 (數量檢測版)
// @name:zh-TW   GD 檢測器 - Stage 5 (數量檢測版)
// @name:zh-CN   GD 检测器 - Stage 5 (数量检测版)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  自動掃描頁面上的 Google Drive 連結並檢測真實狀態 (包含動態載入內容)
// @description:zh-TW 自動掃描頁面上的 Google Drive 連結並檢測真實狀態 (包含動態載入內容)
// @description:zh-CN 自动扫描页面上的 Google Drive 连结并检测真实状态 (包含动态载入内容)
// @author       Mark
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      drive.google.com
// @connect      google.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563192/GD%20%E6%AA%A2%E6%B8%AC%E5%99%A8%20-%20Stage%205%20%28%E6%95%B8%E9%87%8F%E6%AA%A2%E6%B8%AC%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563192/GD%20%E6%AA%A2%E6%B8%AC%E5%99%A8%20-%20Stage%205%20%28%E6%95%B8%E9%87%8F%E6%AA%A2%E6%B8%AC%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CHECKED_CLASS = 'gd-link-checked';

    function scanAndCheckLinks() {
        const links = document.querySelectorAll(`a[href*="drive.google.com"]:not(.${CHECKED_CLASS})`);
        links.forEach(link => {
            link.classList.add(CHECKED_CLASS);
            const originalText = link.innerText;
            // UI：掃描中顯示沙漏
            link.innerText += " ⏳";
            link.style.borderBottom = "2px solid orange";
            checkGoogleDriveLink(link, originalText);
        });
    }

    function checkGoogleDriveLink(link, originalText) {
        GM_xmlhttpRequest({
            method: "GET",
            url: link.href,
            onload: function(response) {
                const html = response.responseText;
                const status = response.status;

                let isAlive = false;
                let fileCountInfo = "";

                // 死亡關鍵字 (如果有這些字，代表連結失效)
                const deadKeywords = [
                    "檔案不存在", "File does not exist",
                    "無法存取", "Access denied",
                    "您沒有權限", "You need permission",
                    "We're sorry", "違反服務條款"
                ];

                if (status === 404) {
                    isAlive = false;
                } else if (status === 200) {
                    // 檢查是否包含死亡關鍵字
                    const isDead = deadKeywords.some(keyword => html.includes(keyword));

                    if (isDead) {
                        isAlive = false;
                    } else {
                        // 活著！開始判斷數量
                        isAlive = true;
                        fileCountInfo = extractFileCount(html, link.href);
                    }
                } else {
                    isAlive = false;
                }

                updateLinkUI(link, originalText, isAlive, fileCountInfo);
            },
            onerror: function(err) {
                updateLinkUI(link, originalText, false, "");
            }
        });
    }

    // --- ★ 核心修改：只檢測數量 ---
    function extractFileCount(html, url) {
        let info = "";

        // 判斷網址是否為資料夾
        const isFolder = url.includes("drive.google.com/drive/folders") || url.includes("drive.google.com/folderview");

        if (isFolder) {
            // --- 資料夾策略：挖掘 "x items" ---
            // Regex: 找數字 + 空白 + items/個項目
            const folderMatch = html.match(/(\d+)\s+(items|個項目)/i);
            if (folderMatch) {
                info = ` (${folderMatch[1]} 個檔案)`;
            } else {
                // 如果是資料夾但抓不到數字，可能只有少數幾個檔案直接顯示在畫面上，或者空資料夾
                // 這裡可以選擇不顯示，或顯示 (資料夾)
                info = " (資料夾)";
            }
        } else {
            // --- 單一檔案策略：直接回傳 1 ---
            // 既然連結有效且不是資料夾，那它肯定就是一個檔案
            // 這樣就解決了 1.1GB 被誤判成 7MB 的問題，因為我們不再去猜大小
            info = " (1 個檔案)";
        }

        return info;
    }

    function updateLinkUI(link, originalText, isAlive, extraInfo) {
        link.style.borderBottom = "none";
        link.innerText = originalText;

        const statusSpan = document.createElement("span");
        statusSpan.style.fontWeight = "bold";

        if (isAlive) {
            statusSpan.innerText = ` [✅有效${extraInfo}]`;
            statusSpan.style.color = "#28a745";
        } else {
            statusSpan.innerText = " [❌失效]";
            statusSpan.style.color = "#dc3545";
        }

        link.appendChild(statusSpan);
    }

    function initAutoScan() {
        console.log('GD 數量檢測器 v5.0 啟動...');
        scanAndCheckLinks();
        const observer = new MutationObserver(() => scanAndCheckLinks());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAutoScan);
    } else {
        initAutoScan();
    }
})();