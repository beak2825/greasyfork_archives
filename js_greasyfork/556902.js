// ==UserScript==
// @name         McKinsey文章下載器 (文章提取與Word格式下載)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  下載當前頁面及其所有內部連結的文章內容，彙整成單一Word檔案，並複製主文章純文字到剪貼簿。
// @author       Gemini
// @match        https://www.mckinsey.com/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-end // 確保 DOM 結構已載入
// @downloadURL https://update.greasyfork.org/scripts/556902/McKinsey%E6%96%87%E7%AB%A0%E4%B8%8B%E8%BC%89%E5%99%A8%20%28%E6%96%87%E7%AB%A0%E6%8F%90%E5%8F%96%E8%88%87Word%E6%A0%BC%E5%BC%8F%E4%B8%8B%E8%BC%89%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556902/McKinsey%E6%96%87%E7%AB%A0%E4%B8%8B%E8%BC%89%E5%99%A8%20%28%E6%96%87%E7%AB%A0%E6%8F%90%E5%8F%96%E8%88%87Word%E6%A0%BC%E5%BC%8F%E4%B8%8B%E8%BC%89%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BASE_URL = 'https://www.mckinsey.com';
    const ARTICLE_SELECTORS = 'main, .article-body, .content-container'; // 內容容器的通用選擇器

    /**
     * 輔助函數：透過 URL 抓取頁面內容並提取文章主體
     * @param {string} url - 要抓取的連結
     * @returns {Promise<{title: string, html: string, url: string}>} - 文章標題、HTML內容和原始URL
     */
    async function fetchAndExtractArticle(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');

            const titleElement = doc.querySelector('h1') || doc.querySelector('title');
            const articleTitle = titleElement ? titleElement.textContent.trim() : 'Linked Article';

            // 嘗試從通用容器中提取內容
            let contentContainer = doc.querySelector(ARTICLE_SELECTORS) || doc.body;

            const articleHTML = contentContainer.innerHTML;

            return { title: articleTitle, html: articleHTML, url: url };

        } catch (error) {
            console.error(`Error fetching or parsing URL: ${url}`, error);
            return { title: `下載失敗: ${url}`, html: `<p style="color: red;">無法載入此連結的內容。</p>`, url: url };
        }
    }

    // 核心功能：提取文章內容並觸發下載 (已修改為非同步)
    async function downloadArticle() {
        const button = document.getElementById('mckinsey-download-button');
        
        // 0. 顯示載入中狀態
        if (button) {
            button.textContent = '載入中... (正在抓取下一層文章)';
            button.style.backgroundColor = '#ffc107'; // 載入中顏色
        }

        // 1. 取得當前頁面標題和內容
        const titleElement = document.querySelector('h1') || document.querySelector('title');
        const mainArticleTitle = titleElement ? titleElement.textContent.trim() : 'McKinsey_Main_Article';

        let contentContainer = document.querySelector(ARTICLE_SELECTORS);

        if (!contentContainer) {
            contentContainer = document.body;
            console.warn('找不到特定的文章容器，將使用整個頁面內容。');
        }

        // 提取主文章 HTML
        let mainArticleHTML = contentContainer.innerHTML;

        // 2. 提取所有內部連結（只提取下一層）
        const linkElements = contentContainer.querySelectorAll('a[href]');
        const uniqueUrls = new Set();
        
        linkElements.forEach(a => {
            const href = a.getAttribute('href');
            
            // 檢查是否為內部連結且非媒體/錨點/外部連結
            if (href && (href.startsWith('/') || href.startsWith(BASE_URL))) {
                 // 轉換相對連結為絕對連結
                const absoluteUrl = href.startsWith('/') ? `${BASE_URL}${href}` : href;

                // 排除非文章類型連結 (如首頁、媒體檔案、錨點)
                if (absoluteUrl.length > BASE_URL.length + 1 && !absoluteUrl.match(/\.(pdf|zip|mp4|jpg|png|gif|#)/i)) {
                    // 排除當前頁面以避免重複抓取
                    if (absoluteUrl !== window.location.href && absoluteUrl !== window.location.href.replace(/\/$/, "")) {
                        uniqueUrls.add(absoluteUrl);
                    }
                }
            }
        });
        
        // 3. 批次下載連結頁面內容
        const fetchPromises = Array.from(uniqueUrls).map(url => fetchAndExtractArticle(url));
        const linkedArticles = await Promise.all(fetchPromises);
        
        // 4. 複製純文字到剪貼簿 (只複製主文章純文字內容)
        GM_setClipboard(contentContainer.textContent, 'text');


        // 5. 彙整所有 HTML 內容
        let aggregatedHTML = `
            <h2 style="color: #153e7a; border-bottom: 2px solid #153e7a; padding-bottom: 5px;">【主文章內容】: ${mainArticleTitle}</h2>
            <p><strong>原始連結：</strong> <a href="${window.location.href}">${window.location.href}</a></p>
            <hr style="border: 2px solid #999; margin: 30px 0;">
            ${mainArticleHTML}
        `;

        if (linkedArticles.length > 0) {
            aggregatedHTML += `<h1 style="margin-top: 50px; color: #cc0000; text-align: center; border-bottom: 3px double #cc0000; padding-bottom: 10px;">--- 相關文章內容彙整 (${linkedArticles.length} 篇) ---</h1>`;
            
            linkedArticles.forEach((article, index) => {
                aggregatedHTML += `
                    <div style="page-break-before: always; border: 1px solid #ddd; padding: 25px; margin-top: 40px; background-color: #fcfcfc;">
                        <h2 style="color: #007bff; border-bottom: 1px dashed #ddd; padding-bottom: 5px;">相關文章 #${index + 1}: ${article.title}</h2>
                        <p><strong>原始連結：</strong> <a href="${article.url}">${article.url}</a></p>
                        <hr style="margin-bottom: 20px;">
                        ${article.html}
                    </div>
                `;
            });
        }
        
        // 6. 建構 Word 友善的最終 HTML 結構
        const finalHtmlContent = `
            <!DOCTYPE html>
            <html lang="zh-Hant">
            <head>
                <meta charset="UTF-8">
                <title>彙整文章: ${mainArticleTitle}</title>
                <style>
                    body { font-family: 'Arial', 'Noto Sans TC', sans-serif; line-height: 1.6; max-width: 900px; margin: 0 auto; padding: 20px; }
                    h1 { color: #153e7a; border-bottom: 2px solid #ccc; padding-bottom: 10px; margin-top: 0; }
                    h2, h3 { color: #3d5e94; }
                    /* 基本樣式清理，提升 Word 相容性 */
                    img { max-width: 100%; height: auto; display: block; margin: 15px auto; }
                    a { text-decoration: none; color: inherit; } 
                </style>
            </head>
            <body>
                <h1>McKinsey 文章彙整下載 (${mainArticleTitle})</h1>
                <p>本文件包含主頁面及所有發現的內部連結文章內容 (下一層)。</p>
                ${aggregatedHTML}
                <hr style="margin-top: 30px;">
                <p style="font-size: 0.8em; color: #999;">文章由油猴腳本於 ${new Date().toLocaleString('zh-TW')} 下載。</p>
            </body>
            </html>
        `;

        // 7. 創建 Blob 和觸發下載
        const blob = new Blob([finalHtmlContent], { type: 'application/msword;charset=utf-8' });
        const sanitizedTitle = mainArticleTitle.replace(/[^\w\s\u4e00-\u9fa5-]/g, '').trim().replace(/\s+/g, '_');
        const filename = `Aggregated_McKinsey_${sanitizedTitle}.doc`;

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // 8. 提供視覺回饋
        if (button) {
            button.textContent = `下載完成! (${linkedArticles.length} 篇相關文章)`;
            button.style.backgroundColor = '#28a745';
            setTimeout(() => {
                button.textContent = '文章下載 (下載為 Word 檔案)';
                button.style.backgroundColor = '#007bff';
            }, 5000); // 延長顯示時間
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
        // 將事件監聽器改為呼叫新的非同步函數
        button.addEventListener('click', downloadArticle);

        // 由於 @run-at document-end 確保 body 已存在，我們直接附加
        document.body.appendChild(button);
    }

    // 啟動腳本
    addDownloadButton();
})();