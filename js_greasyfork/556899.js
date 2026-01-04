// ==UserScript==
// @name         McKinsey文章下載器 (文章提取與Word格式下載)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在McKinsey網站的文章頁面添加一個下載按鈕，將文章內容提取為HTML格式的.doc檔案，並複製純文字到剪貼簿。
// @author       Gemini
// @match        https://www.mckinsey.com/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-end // 更改為 document-end，確保 DOM 結構已載入，提高按鈕顯示的可靠性
// @downloadURL https://update.greasyfork.org/scripts/556899/McKinsey%E6%96%87%E7%AB%A0%E4%B8%8B%E8%BC%89%E5%99%A8%20%28%E6%96%87%E7%AB%A0%E6%8F%90%E5%8F%96%E8%88%87Word%E6%A0%BC%E5%BC%8F%E4%B8%8B%E8%BC%89%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556899/McKinsey%E6%96%87%E7%AB%A0%E4%B8%8B%E8%BC%89%E5%99%A8%20%28%E6%96%87%E7%AB%A0%E6%8F%90%E5%8F%96%E8%88%87Word%E6%A0%BC%E5%BC%8F%E4%B8%8B%E8%BC%89%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 核心功能：提取文章內容並觸發下載
    function downloadArticle() {
        // 1. 取得文章標題，作為檔案名稱和內容的標題
        const titleElement = document.querySelector('h1') || document.querySelector('title');
        const articleTitle = titleElement ? titleElement.textContent.trim() : 'McKinsey_Article';

        // 2. 識別主要內容容器
        // 嘗試使用最有可能包含文章內容的通用選擇器：
        // a) <main> 標籤 (語義上最正確)
        // b) 網站可能使用的特定類名 (例如 .article-body 或 .content-container)
        // c) 最後使用 <body> 作為後備
        let contentContainer = document.querySelector('main') ||
                               document.querySelector('.article-body') ||
                               document.querySelector('.content-container');

        if (!contentContainer) {
            // 如果沒有找到特定的內容容器，則使用 body，並嘗試排除導航和頁腳
            contentContainer = document.body;
            console.warn('找不到特定的文章容器，將使用整個頁面內容。');
        }

        // 3. 提取內容 (使用 innerHTML 保留格式，有利於Word開啟)
        let articleContentHTML = contentContainer.innerHTML;

        // 4. 建構 Word 友善的 HTML 結構
        // 為了讓 Word 更好地解析和呈現，我們將內容包裝在一個完整的 HTML 文件中，
        // 並使用基本的 CSS 進行排版。
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="zh-Hant">
            <head>
                <meta charset="UTF-8">
                <title>${articleTitle}</title>
                <style>
                    body { font-family: 'Arial', 'Noto Sans TC', sans-serif; line-height: 1.6; max-width: 900px; margin: 0 auto; padding: 20px; }
                    h1 { color: #153e7a; border-bottom: 2px solid #ccc; padding-bottom: 10px; margin-top: 0; }
                    h2, h3 { color: #3d5e94; }
                    /* 基本樣式清理，提升 Word 相容性 */
                    img { max-width: 100%; height: auto; display: block; margin: 15px auto; }
                    a { text-decoration: none; color: inherit; } /* 移除連結樣式 */
                </style>
            </head>
            <body>
                <h1>${articleTitle}</h1>
                ${articleContentHTML}
                <hr style="margin-top: 30px;">
                <p style="font-size: 0.8em; color: #999;">文章由油猴腳本於 ${new Date().toLocaleString('zh-TW')} 下載。</p>
            </body>
            </html>
        `;

        // 5. 創建 Blob 和觸發下載
        // 使用 'application/msword' MIME Type 和 .doc 擴展名，以提示系統使用 Word 開啟
        const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });

        // 清理標題以作為檔案名稱
        const sanitizedTitle = articleTitle.replace(/[^\w\s\u4e00-\u9fa5-]/g, '').trim().replace(/\s+/g, '_');
        const filename = `${sanitizedTitle}.doc`;

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click(); // 觸發下載
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // 6. 複製純文字到剪貼簿 (回應使用者要求)
        const pureText = contentContainer.textContent;
        // 使用 GM_setClipboard 確保在 Tampermonkey 環境下成功複製
        GM_setClipboard(pureText, 'text');

        // 7. 提供視覺回饋
        const button = document.getElementById('mckinsey-download-button');
        if (button) {
            button.textContent = '文章已下載並複製！';
            button.style.backgroundColor = '#28a745';
            setTimeout(() => {
                button.textContent = '文章下載 (下載為 Word 檔案)';
                button.style.backgroundColor = '#007bff';
            }, 3000);
        }
    }

    // 建立並添加下載按鈕到頁面
    function addDownloadButton() {
        // 使用 GM_addStyle 插入 CSS 樣式，確保按鈕樣式一致
        GM_addStyle(`
            #mckinsey-download-button {
                position: fixed;
                top: 15px;
                right: 15px;
                z-index: 99999;
                background-color: #007bff; /* 藍色 */
                color: white;
                border: none;
                padding: 12px 18px;
                cursor: pointer;
                border-radius: 8px;
                font-size: 16px;
                font-weight: bold;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                transition: background-color 0.3s, transform 0.1s;
                opacity: 0.95;
            }
            #mckinsey-download-button:hover {
                background-color: #0056b3;
                opacity: 1;
            }
            #mckinsey-download-button:active {
                transform: translateY(1px);
            }
        `);

        const button = document.createElement('button');
        button.id = 'mckinsey-download-button';
        button.textContent = '文章下載 (下載為 Word 檔案)';
        button.addEventListener('click', downloadArticle);

        // 由於 @run-at document-end 確保 body 已存在，我們直接附加
        document.body.appendChild(button);
    }

    // 啟動腳本
    addDownloadButton();
})();