// ==UserScript==
// @name         MEGA 連結自動檢測器 (資料夾+自動掃描版)
// @name:zh-TW   MEGA 連結自動檢測器 (資料夾+自動掃描版)
// @name:zh-CN   MEGA 连结自动检测器 (资料夹+自动扫描版)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自動掃描頁面上的 MEGA 連結並檢測狀態 (包含動態載入內容)
// @description:zh-TW 自動掃描頁面上的 MEGA 連結並檢測狀態 (包含動態載入內容)
// @description:zh-CN 自动扫描页面上的 MEGA 连结并检测状态 (包含动态载入内容)
// @author       Mark
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      api.mega.co.nz
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563161/MEGA%20%E9%80%A3%E7%B5%90%E8%87%AA%E5%8B%95%E6%AA%A2%E6%B8%AC%E5%99%A8%20%28%E8%B3%87%E6%96%99%E5%A4%BE%2B%E8%87%AA%E5%8B%95%E6%8E%83%E6%8F%8F%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563161/MEGA%20%E9%80%A3%E7%B5%90%E8%87%AA%E5%8B%95%E6%AA%A2%E6%B8%AC%E5%99%A8%20%28%E8%B3%87%E6%96%99%E5%A4%BE%2B%E8%87%AA%E5%8B%95%E6%8E%83%E6%8F%8F%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 設定一個 CSS class 名稱，用來標記「這個連結已經檢查過了」
    const CHECKED_CLASS = 'mega-link-checked';

    // 1. 掃描與檢測主邏輯 (修改版)
    function scanAndCheckLinks() {
        // 關鍵修改：只選取「沒有」被標記過的 <a> 標籤
        // :not(.class) 是 CSS 的反向選取器
        const links = document.querySelectorAll(`a:not(.${CHECKED_CLASS})`);

        links.forEach(link => {
            // 立刻標記它為「已檢查」，避免下一次掃描重複處理
            link.classList.add(CHECKED_CLASS);

            const url = link.href;
            if (url.includes('mega.nz')) {
                const info = extractMegaInfo(url);
                if (info) {
                    // 在開發者工具的 Console 顯示日誌，方便除錯
                    console.log(`發現 MEGA 連結: ${url}`);

                    updateStatus(link, '檢測中...', 'orange');

                    if (info.type === 'folder') {
                        checkMegaFolder(info.id, link);
                    } else {
                        checkMegaFile(info.id, link);
                    }
                }
            }
        });
    }

    // 2. 初始化與自動監聽 (取代原本的按鈕)
    function initAutoScan() {
        console.log('MEGA 檢測器已啟動...');

        // (A) 頁面剛載入時，先掃描一次現有的
        scanAndCheckLinks();

        // (B) 建立「變動觀察者」來處理動態內容
        const observer = new MutationObserver(function(mutations) {
            // 當網頁結構發生變化時 (例如滑鼠捲動載入新文章)，觸發掃描
            // 因為 scanAndCheckLinks 裡面有檢查 class，所以執行成本很低
            scanAndCheckLinks();
        });

        // 開始監視整個網頁 (document.body)
        // childList: 監聽子元素增減, subtree: 監聽所有後代元素
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // --- 以下為輔助函數 (與上一版相同) ---

    function extractMegaInfo(url) {
        let type = 'file';
        let id = null;
        if (url.includes('folder/') || url.includes('#F!')) {
            type = 'folder';
            const match = url.match(/(?:folder\/|#F!)([\w-]+)/);
            if (match) id = match[1];
        } else {
            type = 'file';
            const match = url.match(/(?:file\/|#!)([\w-]+)/);
            if (match) id = match[1];
        }
        return id ? { id, type } : null;
    }

    function updateStatus(element, text, color) {
        let statusSpan = element.nextElementSibling;
        if (!statusSpan || !statusSpan.classList.contains('mega-status')) {
            statusSpan = document.createElement('span');
            statusSpan.className = 'mega-status';
            statusSpan.style.marginLeft = '10px';
            statusSpan.style.fontWeight = 'bold';
            statusSpan.style.fontSize = '0.9em'; //稍微縮小一點字體
            element.parentNode.insertBefore(statusSpan, element.nextSibling);
        }
        statusSpan.innerText = `[${text}]`;
        statusSpan.style.color = color;
    }

    function checkMegaFile(fileId, linkElement) {
        const payload = [{ 'a': 'g', 'p': fileId }];
        sendMegaRequest(payload, null, (data) => {
            if (typeof data === 'number') {
                updateStatus(linkElement, `失效 (${data})`, 'red');
            } else if (data && data.s) {
                const sizeMB = (data.s / 1048576).toFixed(2);
                updateStatus(linkElement, `有效 ${sizeMB}MB`, 'green');
            } else {
                updateStatus(linkElement, '未知', 'gray');
            }
        }, linkElement);
    }

    function checkMegaFolder(folderId, linkElement) {
        const payload = [{ 'a': 'f', 'c': 1, 'ca': 1, 'r': 0 }];
        const urlParams = `&n=${folderId}`;
        sendMegaRequest(payload, urlParams, (data) => {
            if (typeof data === 'number') {
                updateStatus(linkElement, `資料夾失效 (${data})`, 'red');
            } else if (data && data.f) {
                updateStatus(linkElement, `資料夾有效`, 'green');
            } else {
                updateStatus(linkElement, '未知', 'gray');
            }
        }, linkElement);
    }

    function sendMegaRequest(payload, urlParams, callback, linkElement) {
        let apiUrl = "https://g.api.mega.co.nz/cs?id=" + Math.random();
        if (urlParams) apiUrl += urlParams;

        GM_xmlhttpRequest({
            method: "POST",
            url: apiUrl,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(payload),
            onload: function(response) {
                try {
                    const res = JSON.parse(response.responseText);
                    const data = Array.isArray(res) ? res[0] : res;
                    callback(data);
                } catch (e) {
                    updateStatus(linkElement, 'API 錯', 'gray');
                }
            },
            onerror: function(err) {
                updateStatus(linkElement, '連線失敗', 'red');
            }
        });
    }

    // 程式進入點：等待 DOM 載入完成後執行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAutoScan);
    } else {
        initAutoScan();
    }

})();