// ==UserScript==
// @name         GT故事下载器
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  提供 shrunken.men 和 outsized.social 网站的故事一键整理下载功能，根据当前网站自动启用相应脚本。
// @author       Donnyu
// @match        *://shrunken.men/*
// @match        *://outsized.social/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shrunken.men
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/550863/GT%E6%95%85%E4%BA%8B%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/550863/GT%E6%95%85%E4%BA%8B%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hostname = window.location.hostname;

    // ===================================================================
    // Logic for outsized.social
    // ===================================================================
    if (hostname.includes('outsized.social')) {
        console.log('检测到 outsized.social，加载下载器...');

        /**
         * 创建并添加下载按钮到页面上
         */
        function addDownloadButton() {
            if (document.getElementById('story-downloader-btn')) return;

            const downloadButton = document.createElement('button');
            downloadButton.id = 'story-downloader-btn';
            downloadButton.innerHTML = '下载故事';

            Object.assign(downloadButton.style, {
                position: 'fixed',
                top: '20px',
                right: '40px',
                zIndex: '9999',
                padding: '10px 18px',
                backgroundColor: '#3a86ff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                transition: 'background-color 0.3s, box-shadow 0.3s'
            });

            downloadButton.onmouseover = () => { if (!downloadButton.disabled) { downloadButton.style.backgroundColor = '#005ed3'; } };
            downloadButton.onmouseout = () => { if (!downloadButton.disabled) { downloadButton.style.backgroundColor = '#3a86ff'; } };

            document.body.appendChild(downloadButton);
            downloadButton.addEventListener('click', startScraping);
            console.log('Outsized 下载按钮已成功添加。');
        }

        /**
         * 使用 MutationObserver 等待关键元素加载
         */
        const observer = new MutationObserver((mutations, obs) => {
            if (document.querySelector('main.page #page-header h2')) {
                console.log('Outsized 页面核心内容已加载，准备添加按钮...');
                addDownloadButton();
                obs.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        /**
         * 在隐藏的 iframe 中加载 URL 并等待内容渲染
         */
        function loadUrlInIframe(url) {
            return new Promise((resolve, reject) => {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';

                const timeout = setTimeout(() => {
                    cleanup();
                    if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
                    reject(new Error(`加载超时: ${url}`));
                }, 30000);

                let checkInterval;
                const cleanup = () => { clearInterval(checkInterval); clearTimeout(timeout); };

                iframe.onload = () => {
                    checkInterval = setInterval(() => {
                        try {
                            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                            if (!iframeDoc) return;

                            let isContentLoaded = false;
                            const pagePath = new URL(iframe.src).pathname;

                            if (pagePath.startsWith('/series/')) {
                                const storyTiles = iframeDoc.querySelectorAll('.story-tile');
                                if (storyTiles.length > 0 && storyTiles[storyTiles.length - 1].querySelector('header h4 a')) {
                                    isContentLoaded = true;
                                }
                            } else {
                                if (iframeDoc.querySelector('main.page #page-header h2') && iframeDoc.querySelector('.forum-post > .markdown')) {
                                    isContentLoaded = true;
                                }
                            }

                            if (isContentLoaded) {
                                cleanup();
                                resolve(iframe);
                            }
                        } catch (e) {}
                    }, 500);
                };

                iframe.onerror = () => { cleanup(); reject(new Error(`无法加载 iframe: ${url}`)); };
                iframe.src = url;
                document.body.appendChild(iframe);
            });
        }

        /**
         * 主函数：开始抓取流程
         */
        async function startScraping() {
            const startTime = performance.now();
            console.log(`[TIMER] Scraping process started at ${new Date().toLocaleTimeString()}`);

            const button = document.getElementById('story-downloader-btn');
            button.disabled = true;
            button.innerHTML = '分析页面...';
            button.style.backgroundColor = '#aaa';
            button.style.cursor = 'not-allowed';

            try {
                let urlsToScrape = [];
                let storyTitle = '', author = '', seriesSummary = '';
                const currentPath = window.location.pathname;

                if (currentPath.startsWith('/series/')) {
                    const seriesInfo = scrapeSeriesData(document);
                    storyTitle = seriesInfo.title;
                    author = seriesInfo.author;
                    seriesSummary = seriesInfo.summary;
                    urlsToScrape = Array.from(document.querySelectorAll('.story-tile header h4 a')).map(a => a.href);
                } else if (currentPath.startsWith('/stories/')) {
                    const seriesLinkElement = document.querySelector('h5 > a[href*="/series/"]');
                    if (seriesLinkElement) {
                        author = document.querySelector('a.author > div.name')?.textContent.trim() || '';
                        button.innerHTML = '获取系列...';
                        const seriesUrl = seriesLinkElement.href;
                        let seriesIframe = null;
                        try {
                            seriesIframe = await loadUrlInIframe(seriesUrl);
                            const seriesDoc = seriesIframe.contentDocument;
                            const seriesInfo = scrapeSeriesData(seriesDoc);
                            storyTitle = seriesInfo.title;
                            if (!author) author = seriesInfo.author;
                            seriesSummary = seriesInfo.summary;
                            urlsToScrape = Array.from(seriesDoc.querySelectorAll('.story-tile header h4 a')).map(a => a.href);
                        } finally {
                            if (seriesIframe) document.body.removeChild(seriesIframe);
                        }
                    } else {
                        const pageData = scrapePageData(document);
                        const markdown = formatSingleChapter(pageData);
                        saveContentToFile(markdown, `${pageData.title.replace(/[\\/:*?"<>|]/g, '_')} - ${pageData.author}.md`);
                        finishDownload(button, startTime);
                        return;
                    }
                } else {
                    throw new Error("当前页面不是支持的故事或系列页面。");
                }

                if (urlsToScrape.length === 0) throw new Error("未能找到任何章节链接。");

                let markdownParts = [`# ${storyTitle}`, `**作者:** ${author}`];
                if (seriesSummary) markdownParts.push(`> ${seriesSummary.replace(/\n/g, '\n> ')}`);

                for (let i = 0; i < urlsToScrape.length; i++) {
                    button.innerHTML = `抓取中 (${i + 1}/${urlsToScrape.length})...`;
                    let chapterIframe = null, chapterData;
                    try {
                        chapterIframe = await loadUrlInIframe(urlsToScrape[i]);
                        chapterData = scrapePageData(chapterIframe.contentDocument);
                    } finally {
                        if (chapterIframe) document.body.removeChild(chapterIframe);
                    }
                    markdownParts.push(formatChapter(chapterData, urlsToScrape.length > 1));
                }

                saveContentToFile(markdownParts.join('\n\n'), `${storyTitle.replace(/[\\/:*?"<>|]/g, '_')} - ${author}.md`);
                finishDownload(button, startTime);

            } catch (error) {
                handleError(error, button);
            }
        }

        function formatSingleChapter(pageData) {
            const parts = [`# ${pageData.title}`, `**作者:** ${pageData.author}`];
            if (pageData.tags) parts.push(`**标签:** ${pageData.tags}`);
            if (pageData.summary) parts.push(`> ${pageData.summary.replace(/\n/g, '\n> ')}`);
            parts.push('\n---\n', pageData.content);
            return parts.join('\n\n');
        }

        function formatChapter(chapterData, isSeries) {
            const parts = [];
            if (isSeries) parts.push(`\n## ${chapterData.title}`);
            if (chapterData.tags) parts.push(`**标签:** ${chapterData.tags}`);
            if (chapterData.summary) parts.push(`> ${chapterData.summary.replace(/\n/g, '\n> ')}`);
            parts.push('\n---\n', chapterData.content);
            return parts.join('\n\n');
        }

        function scrapeSeriesData(doc) {
            const page = doc.querySelector('main.page');
            return {
                title: page.querySelector('#page-header h2')?.textContent.trim() || '',
                author: page.querySelector('a.author > div.name')?.textContent.trim() || '',
                summary: page.querySelector('.stories')?.previousElementSibling?.previousElementSibling?.textContent.trim() || ''
            };
        }

        function scrapePageData(doc) {
            const page = doc.querySelector('main.page');
            const labels = Array.from(page.querySelectorAll('.labels .label-name')).map(el => el.textContent.trim());
            const tags = Array.from(page.querySelectorAll('.tags .name')).map(el => el.textContent.trim());
            const markdownDivs = Array.from(page.querySelectorAll('.forum-post > .markdown'));

            return {
                title: page.querySelector('#page-header h2')?.textContent.trim() || '',
                author: page.querySelector('a.author > div.name')?.textContent.trim() || '',
                tags: [...new Set([...labels, ...tags])].join(', '),
                summary: markdownDivs.length > 1 ? markdownDivs[0].innerText.trim() : '',
                content: markdownDivs.length > 0 ? markdownDivs[markdownDivs.length - 1].innerText.trim() : ''
            };
        }

        function finishDownload(button, startTime) {
            console.log(`[TIMER] Total processing finished at ${((performance.now() - startTime) / 1000).toFixed(2)}s`);
            button.innerHTML = '下载完成!';
            setTimeout(() => {
                button.innerHTML = '下载故事';
                button.disabled = false;
                button.style.backgroundColor = '#3a86ff';
                button.style.cursor = 'pointer';
            }, 3000);
        }
    }


    // ===================================================================
    // Logic for shrunken.men
    // ===================================================================
    else if (hostname.includes('shrunken.men')) {
        console.log('检测到 shrunken.men，加载下载器...');

        function addDownloadButton_shrunken() {
            if (document.getElementById('story-downloader-btn-shrunken')) return;
            const button = document.createElement('button');
            button.id = 'story-downloader-btn-shrunken';
            button.textContent = '下载故事';
            Object.assign(button.style, {
                position: 'fixed',
                top: '20px',
                right: '40px',
                zIndex: '10000',
                padding: '10px 18px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            });
            button.addEventListener('click', startScraping_shrunken);
            document.body.appendChild(button);
        }

        const observer_shrunken = new MutationObserver((mutations, obs) => {
            if (document.querySelector('.elementor-element-919fd40')) {
                addDownloadButton_shrunken();
                obs.disconnect();
            }
        });
        observer_shrunken.observe(document.body, { childList: true, subtree: true });

        async function startScraping_shrunken() {
            const button = document.getElementById('story-downloader-btn-shrunken');
            button.disabled = true;
            button.style.cursor = 'not-allowed';
            button.textContent = '分析页面...';

            try {
                let chapterLinks = Array.from(document.querySelectorAll('a.chapter-box')).map(a => a.href);
                if (chapterLinks.length === 0) {
                    chapterLinks.push(window.location.href);
                }

                const markdownParts = [];
                let storyTitle = 'Untitled Story', author = 'Unknown Author';

                for (let i = 0; i < chapterLinks.length; i++) {
                    button.textContent = `抓取中 (${i + 1}/${chapterLinks.length})...`;
                    const response = await fetch(chapterLinks[i]);
                    const text = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, 'text/html');
                    const data = scrapePageData_shrunken(doc);

                    if (i === 0) {
                        storyTitle = data.title || storyTitle;
                        author = data.author || author;
                        markdownParts.push(`# ${storyTitle}`);
                        markdownParts.push(`**作者:** ${author}`);
                    }

                    if (chapterLinks.length > 1) {
                        markdownParts.push(`\n## ${data.title}`);
                    }
                    markdownParts.push(`**标签:** ${data.tags}`);
                    markdownParts.push(`> **${data.summaryTitle}**\n> ${data.summaryContent}`);
                    markdownParts.push('\n---\n');
                    markdownParts.push(data.content);
                }

                const filename = `${storyTitle.replace(/[\\/:*?"<>|]/g, '_')} - ${author}.md`;
                saveContentToFile(markdownParts.join('\n\n'), filename);
                button.textContent = '下载完成!';
            } catch (error) {
                handleError(error, button);
            } finally {
                setTimeout(() => {
                    button.textContent = '下载故事';
                    button.disabled = false;
                    button.style.cursor = 'pointer';
                }, 3000);
            }
        }

        function scrapePageData_shrunken(doc) {
            const storyContainer = doc.querySelector('.elementor-element-919fd40');
            return {
                title: storyContainer?.querySelector('.story-title-row > div')?.textContent.trim(),
                author: storyContainer?.querySelector('.story-avatar-desktop > div')?.textContent.trim(),
                tags: storyContainer?.querySelector('.story-tags')?.textContent.trim().replace(/\s+/g, ' '),
                summaryTitle: storyContainer?.querySelector('.story-excerpt-heading')?.textContent.trim(),
                summaryContent: storyContainer?.querySelector('.story-excerpt-text')?.textContent.trim(),
                content: Array.from(doc.querySelectorAll('.elementor-element-3ba74c5 .elementor-widget-container > div > div > p'))
                              .map(p => p.textContent.trim())
                              .join('\n\n')
            };
        }
    }


    // ===================================================================
    // Shared utility functions
    // ===================================================================
    /**
     * 将收集到的内容保存为文件并触发下载
     */
    function saveContentToFile(content, filename) {
        if (!content) {
            alert('没有提取到任何内容。');
            return;
        }
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        console.log(`文件下载已触发: ${filename}`);
    }

    /**
     * 统一的错误处理函数
     */
    function handleError(error, button) {
        console.error('故事下载器发生错误:', error);
        button.innerHTML = '抓取失败!';
        alert(`抓取失败: ${error.message}`);
        setTimeout(() => {
            button.innerHTML = '下载故事';
            button.disabled = false;
            button.style.backgroundColor = '#3a86ff'; // or original color
            button.style.cursor = 'pointer';
        }, 5000);
    }

})();
