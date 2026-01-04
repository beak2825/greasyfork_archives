// ==UserScript==
// @name         www.biquge.tw台湾笔趣阁小说下载器
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在台湾笔趣阁(biquge.tw)的小说简介页面添加一个“下载全书”按钮，一键下载小说简介+所有章节为.txt文件。
// @author       第一作者：Google Gemini 通讯作者：hhhxxxyyy3
// @match        *://*.biquge.tw/book/*.html
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551313/wwwbiqugetw%E5%8F%B0%E6%B9%BE%E7%AC%94%E8%B6%A3%E9%98%81%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/551313/wwwbiqugetw%E5%8F%B0%E6%B9%BE%E7%AC%94%E8%B6%A3%E9%98%81%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let downloadButton;

    // --- 1. 定义按钮的样式 (已移除宽度限制) ---
    GM_addStyle(`
        #download-book-btn {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            border-radius: 5px;
            margin-left: 15px;
            transition: background-color 0.3s;
            /* 下面这4行限制宽度的代码已被删除或注释掉 */
            /*
            max-width: 250px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            */
        }
        #download-book-btn:hover {
            background-color: #0056b3;
        }
        #download-book-btn:disabled {
            background-color: #555;
            cursor: not-allowed;
        }
    `);

    // --- 2. 创建并添加“下载全书”按钮 ---
    const buttonContainer = document.querySelector('.book-read');

    if (buttonContainer) {
        downloadButton = document.createElement('button');
        downloadButton.id = 'download-book-btn';
        downloadButton.innerText = '下载全书';

        buttonContainer.appendChild(downloadButton);

        downloadButton.addEventListener('click', () => {
            downloadButton.disabled = true;
            downloadButton.innerText = '准备采集中...';
            scrapeBook().finally(() => {
                downloadButton.disabled = false;
                downloadButton.innerText = '下载全书';
            });
        });
    }

    // --- 3. 核心抓取逻辑 ---

    function downloadAsFile(filename, text) {
        const element = document.createElement('a');
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        element.href = URL.createObjectURL(blob);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        URL.revokeObjectURL(element.href);
    }

    async function scrapeBook() {
        console.log('全书爬取任务已启动...');
        let bookTitle = '';
        let bookIntro = '';
        let firstChapterUrl = '';

        try {
            const titleElement = document.querySelector('div.right h1 a');
            const introElement = document.querySelector('div.intro p');
            const startLinkElement = document.querySelector('span#start a');

            if (!titleElement || !introElement || !startLinkElement) {
                alert('错误：无法在当前页面找到书名、简介或“开始阅读”链接。');
                return;
            }

            bookTitle = titleElement.innerText.trim().replace(/[\\/:*?"<>|]/g, '');
            bookIntro = `简介：\n${introElement.innerText.trim()}`;
            firstChapterUrl = new URL(startLinkElement.href, window.location.href).href;
            console.log(`成功识别书名: ${bookTitle}`);
        } catch (error) {
            console.error('解析简介页面时发生错误:', error);
            alert(`解析简介页面时出错: ${error.message}`);
            return;
        }

        const chapterParts = [];
        let nextUrl = firstChapterUrl;
        const visitedUrls = new Set();

        try {
            while (nextUrl && !visitedUrls.has(nextUrl)) {
                visitedUrls.add(nextUrl);

                const response = await fetch(nextUrl);
                if (!response.ok) throw new Error(`无法加载页面 ${nextUrl}`);
                const htmlText = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, 'text/html');

                const chapterTitleElement = doc.querySelector('div.read h1');
                const contentElement = doc.querySelector('#chaptercontent');

                if (!chapterTitleElement || !contentElement) {
                    console.warn('找不到章节标题或内容，可能已达末尾。', nextUrl);
                    break;
                }

                const title = chapterTitleElement.innerText.trim();

                // ***【核心修改点】***
                // 在成功获取到标题后，更新按钮文本为详细格式
                if (downloadButton) {
                    const progressText = `第${visitedUrls.size}页采集中: ${title}`;
                    downloadButton.innerText = progressText;
                    // 同时给按钮的 title 属性赋值，这样鼠标悬浮时能看到完整标题
                    downloadButton.title = progressText;
                }

                const content = Array.from(contentElement.querySelectorAll('p')).map(p => p.innerText.trim()).join('\n');
                chapterParts.push({ title, content });
                console.log(`成功抓取: ${title}`);

                const nextPageLink = doc.querySelector('a#next_url');
                const indexLink = doc.querySelector('a#info_url');

                if (!nextPageLink || !indexLink || nextPageLink.href === indexLink.href) {
                    console.log('到达书籍末尾，章节抓取完成。');
                    break;
                }
                nextUrl = new URL(nextPageLink.href, nextUrl).href;
            }

            if (chapterParts.length > 0) {
                if (downloadButton) downloadButton.innerText = '生成文件中...';
                const allChaptersText = chapterParts.map(part => `${part.title}\n\n${part.content}`).join('\n\n\n---\n\n\n');
                const fullText = `${bookTitle}\n\n${bookIntro}\n\n\n====================\n\n\n${allChaptersText}`;
                const fileName = `${bookTitle}.txt`;
                downloadAsFile(fileName, fullText);
            } else {
                alert('未能抓取到任何章节数据。');
            }
        } catch (error) {
            console.error('抓取章节过程中发生错误:', error);
            alert(`抓取章节时出错: ${error.message}`);
        }
    }
})();