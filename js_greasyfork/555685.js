// ==UserScript==
// @name         启迪小说TXT下载器
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  支持选择章节范围的小说下载器，优化性能警告
// @author       GitHub:Dolphin-QvQ
// @match        *://www.qidiy.com/book/*/
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555685/%E5%90%AF%E8%BF%AA%E5%B0%8F%E8%AF%B4TXT%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/555685/%E5%90%AF%E8%BF%AA%E5%B0%8F%E8%AF%B4TXT%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const CONFIG = {
        collectInterval: 100,
        downloadInterval: 100
    };

    let chapterList = [];
    let isCollecting = false;
    let baseUrl = '';
    let bookId = '';
    let protocol = 'https:';
    // 缓存DOM元素，避免频繁查询
    let dom = {
        statusDiv: null,
        countDiv: null,
        progressFill: null,
        collectBtn: null,
        downloadBtn: null
    };

    // 初始化基础信息和DOM缓存
    function init() {
        protocol = window.location.protocol;
        const pathMatch = window.location.pathname.match(/\/book\/(\d+)(?:\/|_|\d+\/)/);
        if (pathMatch && pathMatch[1]) {
            bookId = pathMatch[1];
            baseUrl = `${protocol}//www.qidiy.com/book/${bookId}/`;
        }
        createControlPanel();
        // 缓存DOM元素
        dom.statusDiv = document.getElementById('downloadStatus');
        dom.countDiv = document.getElementById('chapterCount');
        dom.progressFill = document.getElementById('progressFill');
        dom.collectBtn = document.querySelector('button:first-of-type');
        dom.downloadBtn = document.querySelector('button:last-of-type');
    }

    // 创建控制界面（减少DOM操作次数）
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 9999;
            background: white; padding: 15px; border: 1px solid #ccc;
            border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            max-width: 500px;
        `;

        // 一次性拼接HTML，减少DOM插入次数
        panel.innerHTML = `
            <h3 style="margin-top:0; margin-bottom:15px;">小说章节下载器（范围选择）</h3>
            <div style="margin-bottom:15px; font-size:13px;">
                <label>收集间隔(毫秒): </label>
                <input type="number" value="${CONFIG.collectInterval}" min="50" max="5000" style="width:80px;" id="collectInterval">
                <label> 下载间隔(毫秒): </label>
                <input type="number" value="${CONFIG.downloadInterval}" min="50" max="5000" style="width:80px;" id="downloadInterval">
            </div>
            <div style="margin-bottom:15px; padding:10px; border:1px solid #eee; border-radius:3px;">
                <div style="margin-bottom:10px; font-weight:bold;">下载范围选择:</div>
                <label>开始章节: </label>
                <select id="startChapter" style="width:150px;" disabled></select>
                <label> 结束章节: </label>
                <select id="endChapter" style="width:150px;" disabled></select>
            </div>
            <div id="downloadStatus" style="margin-bottom:10px; min-height:40px;">准备就绪，点击"收集所有章节"开始</div>
            <div id="chapterCount" style="margin-bottom:10px; font-size:13px;">已收集章节: 0</div>
            <div style="height:10px; background:#eee; border-radius:5px; overflow:hidden; margin-bottom:10px; display:none;">
                <div id="progressFill" style="height:100%; background:#4CAF50; width:0%;"></div>
            </div>
            <div style="display:flex; gap:10px;">
                <button style="padding:6px 10px; background:#2196F3; color:white; border:none; border-radius:3px; cursor:pointer; flex:1;">收集所有章节</button>
                <button style="padding:6px 10px; background:#4CAF50; color:white; border:none; border-radius:3px; cursor:pointer; flex:1;" disabled>下载选中范围</button>
            </div>
        `;

        document.body.appendChild(panel);

        // 绑定间隔输入框事件
        document.getElementById('collectInterval').addEventListener('change', e => {
            CONFIG.collectInterval = parseInt(e.target.value) || 500;
        });
        document.getElementById('downloadInterval').addEventListener('change', e => {
            CONFIG.downloadInterval = parseInt(e.target.value) || 1000;
        });

        // 绑定按钮事件
        panel.querySelector('button:first-of-type').addEventListener('click', startCollectingChapters);
        panel.querySelector('button:last-of-type').addEventListener('click', downloadSelectedRange);
    }

    // 更新章节选择下拉框（优化DOM操作）
    function updateChapterSelectors() {
        const startSelect = document.getElementById('startChapter');
        const endSelect = document.getElementById('endChapter');
        // 先清空再批量添加，减少重排
        startSelect.innerHTML = '';
        endSelect.innerHTML = '';

        const fragment = document.createDocumentFragment(); // 文档片段，减少DOM插入次数
        const startOptions = [];
        const endOptions = [];

        chapterList.forEach((chapter, index) => {
            const optionText = `[${index + 1}] ${chapter.title} (${chapter.id})`;

            const startOpt = document.createElement('option');
            startOpt.value = chapter.id;
            startOpt.textContent = optionText;
            startOptions.push(startOpt);

            const endOpt = document.createElement('option');
            endOpt.value = chapter.id;
            endOpt.textContent = optionText;
            endOptions.push(endOpt);
        });

        // 批量添加选项
        startOptions.forEach(opt => startSelect.appendChild(opt));
        endOptions.forEach(opt => endSelect.appendChild(opt));

        if (chapterList.length > 0) {
            endSelect.selectedIndex = chapterList.length - 1;
            startSelect.disabled = false;
            endSelect.disabled = false;
            dom.downloadBtn.disabled = false;
        }
    }

    // 提取当前页正文章节
    function extractCurrentPageChapters(doc) {
        const contentTit = Array.from(doc.querySelectorAll('.layout-tit')).find(
            el => el.textContent.trim().includes('正文')
        );
        if (!contentTit) return [];

        const sectionBox = contentTit.nextElementSibling;
        if (!sectionBox || !sectionBox.classList.contains('section-box')) return [];

        const links = sectionBox.querySelectorAll('.section-list a');
        const chapters = [];
        links.forEach(link => {
            const href = link.getAttribute('href');
            const idMatch = href.match(/\/book\/\d+\/(\d+)\.html/);
            if (idMatch && idMatch[1]) {
                chapters.push({ id: idMatch[1], title: link.textContent.trim() });
            }
        });
        return chapters;
    }

    // 开始收集所有章节
    function startCollectingChapters() {
        if (isCollecting || !bookId) return;

        isCollecting = true;
        chapterList = [];
        dom.statusDiv.textContent = '开始收集章节...';
        dom.collectBtn.disabled = true;
        dom.downloadBtn.disabled = true;

        fetch(baseUrl)
            .then(response => response.ok ? response.text() : Promise.reject(`HTTP错误: ${response.status}`))
            .then(html => {
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const currentChapters = extractCurrentPageChapters(doc);
                chapterList.push(...currentChapters);
                updateChapterCount();

                const select = doc.querySelector('select[name="pageselect"]');
                if (!select) {
                    dom.statusDiv.textContent = '未找到分页控件，仅收集到当前页章节';
                    finishCollecting();
                    return;
                }

                // 修正分页URL为HTTPS
                Array.from(select.options).forEach(option => {
                    if (option.value) {
                        option.value = option.value.startsWith('http')
                            ? option.value.replace('http://', 'https://')
                            : `${protocol}//www.qidiy.com${option.value}`;
                    }
                });

                traverseAllPages(select, 0);
            })
            .catch(error => {
                console.error('获取书籍首页失败:', error);
                dom.statusDiv.textContent = `获取失败: ${error}`;
                isCollecting = false;
                dom.collectBtn.disabled = false;
            });
    }

    // 遍历所有分页
    function traverseAllPages(select, currentIndex) {
        if (!isCollecting) return;

        const totalPages = select.options.length;
        dom.statusDiv.textContent = `正在收集第 ${currentIndex + 1}/${totalPages} 页章节...`;

        if (currentIndex === 0) {
            processNextPage(select, currentIndex, totalPages);
            return;
        }

        let pageUrl = select.options[currentIndex].value.replace('http://', 'https://');
        fetch(pageUrl)
            .then(response => response.ok ? response.text() : Promise.reject(`HTTP错误: ${response.status}`))
            .then(html => {
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const pageChapters = extractCurrentPageChapters(doc);

                // 去重添加
                pageChapters.forEach(chapter => {
                    if (!chapterList.some(c => c.id === chapter.id)) {
                        chapterList.push(chapter);
                    }
                });

                updateChapterCount();
                processNextPage(select, currentIndex, totalPages);
                doc.body.innerHTML = ''; // 释放内存
            })
            .catch(error => {
                console.error(`加载分页失败:`, error);
                if (confirm(`第 ${currentIndex + 1} 页加载失败，是否继续？`)) {
                    processNextPage(select, currentIndex, totalPages);
                } else {
                    finishCollecting();
                }
            });
    }

    // 处理下一页
    function processNextPage(select, currentIndex, totalPages) {
        if (currentIndex + 1 < totalPages) {
            setTimeout(() => traverseAllPages(select, currentIndex + 1), CONFIG.collectInterval);
        } else {
            finishCollecting();
        }
    }

    // 完成收集
    function finishCollecting() {
        isCollecting = false;
        chapterList.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        updateChapterSelectors();
        dom.statusDiv.textContent = `章节收集完成！共找到 ${chapterList.length} 个正文章节`;
        dom.collectBtn.disabled = false;
    }

    // 更新章节计数（减少DOM操作）
    function updateChapterCount() {
        dom.countDiv.textContent = `已收集章节: ${chapterList.length}`;
    }

    // 提取单页内容
    function extractPageContent(doc) {
        const titleElem = doc.querySelector('h1.title');
        let chapterTitle = titleElem ? titleElem.textContent.trim() : '未知章节';

        const contentElem = doc.getElementById('content');
        if (!contentElem) return { chapterTitle, content: '', totalPages: 1 };

        let totalPages = 1;
        const contentHtml = contentElem.innerHTML;
        const pageMatch = contentHtml.match(/\(第(\d+)\/(\d+)页\)/i);
        if (pageMatch && pageMatch.length === 3) {
            totalPages = parseInt(pageMatch[2], 10);
        }

        let content = contentHtml
            .replace(/<script[\s\S]*?<\/script>/gi, '')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/　/g, ' ')
            .replace(/（本章未完，请点击下一页继续阅读）/g, '')
            .trim();

        const lines = content.split('\n');
        if (lines.length > 0 && lines[0].match(/\(第\d+\/\d+页\)/i)) {
            content = lines.slice(1).join('\n').trim();
        }

        doc.body.innerHTML = '';
        return { chapterTitle, content: content.replace(/\n+/g, '\n').trim(), totalPages };
    }

    // 获取章节分页URL
    async function getChapterPageUrls(chapterId) {
        const firstPageUrl = `${baseUrl}${chapterId}.html`.replace('http://', 'https://');
        const urls = [firstPageUrl];

        try {
            const response = await fetch(firstPageUrl);
            if (!response.ok) throw new Error(`请求失败: ${response.status}`);

            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const { totalPages } = extractPageContent(doc);

            if (totalPages > 1) {
                for (let i = 2; i <= totalPages; i++) {
                    urls.push(`${baseUrl}${chapterId}/${i}.html`.replace('http://', 'https://'));
                }
            }
            return urls;
        } catch (e) {
            console.error(`获取分页失败:`, e);
            return urls;
        }
    }

    // 下载单个章节
    async function downloadChapter(chapter) {
        const pageUrls = await getChapterPageUrls(chapter.id);
        let fullContent = '';
        let chapterTitle = chapter.title;

        for (let i = 0; i < pageUrls.length; i++) {
            try {
                const response = await fetch(pageUrls[i].replace('http://', 'https://'));
                if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);

                const html = await response.text();
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const { content } = extractPageContent(doc);
                fullContent += content + '\n';
            } catch (e) {
                fullContent += `【第${i+1}页下载失败: ${e.message}】\n`;
            }
        }

        return { chapterTitle, content: fullContent.replace(/\n+/g, '\n').trim() };
    }

    // 下载选中范围
    async function downloadSelectedRange() {
        const startId = document.getElementById('startChapter').value;
        const endId = document.getElementById('endChapter').value;

        if (!startId || !endId || parseInt(startId) > parseInt(endId)) {
            alert('请选择有效的章节范围（开始章节 ≤ 结束章节）');
            return;
        }

        const selectedChapters = chapterList
            .filter(ch => parseInt(ch.id) >= parseInt(startId) && parseInt(ch.id) <= parseInt(endId))
            .sort((a, b) => parseInt(a.id) - parseInt(b.id));

        if (selectedChapters.length === 0) {
            alert('未找到选中范围内的章节');
            return;
        }

        const total = selectedChapters.length;
        let completed = 0;
        let allContent = '';
        const progressBar = dom.progressFill.parentElement;
        progressBar.style.display = 'block';
        dom.statusDiv.textContent = `开始下载 ${total} 个章节...`;
        dom.collectBtn.disabled = true;
        dom.downloadBtn.disabled = true;

        for (const chapter of selectedChapters) {
            try {
                const chapterIndex = chapterList.findIndex(c => c.id === chapter.id) + 1;
                dom.statusDiv.textContent = `正在下载: 第${chapterIndex}章 ${chapter.title}（${completed+1}/${total}）`;

                const { chapterTitle, content } = await downloadChapter(chapter);
                if (content) {
                    allContent += `=== 第${chapterIndex}章 ${chapterTitle} ===\n${content}\n\n`;
                }

                completed++;
                dom.progressFill.style.width = `${(completed / total) * 100}%`;

                if (completed < total) {
                    await new Promise(resolve => setTimeout(resolve, CONFIG.downloadInterval));
                }
            } catch (e) {
                if (!confirm(`章节 ${chapter.title} 下载失败，是否继续？`)) {
                    dom.statusDiv.textContent = '下载已取消';
                    dom.collectBtn.disabled = false;
                    dom.downloadBtn.disabled = false;
                    return;
                }
            }
        }

        const bookTitle = document.querySelector('h1').textContent || `book_${bookId}`;
        const startIndex = chapterList.findIndex(c => c.id === startId) + 1;
        const endIndex = chapterList.findIndex(c => c.id === endId) + 1;
        const blob = new Blob([allContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        GM_download({
            url: url,
            name: `${bookTitle}_第${startIndex}-${endIndex}章.txt`,
            onload: () => {
                dom.statusDiv.textContent = `下载完成！共${total}个章节`;
                dom.progressFill.style.width = '100%';
                dom.collectBtn.disabled = false;
                dom.downloadBtn.disabled = false;
                URL.revokeObjectURL(url);
            }
        });
    }

    window.addEventListener('load', init);
})();