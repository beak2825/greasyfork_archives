// ==UserScript==
// @name         MissAV 备份
// @namespace    http://tampermonkey.net/
// @version      5.9
// @description  自动发现并批量抓取MissAV所有片单和收藏，提供多种格式导出功能
// @author       Gemini
// @match        *://missav.*/*
// @match        *://missav.ai/*
// @match        *://missav.ws/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/549508/MissAV%20%E5%A4%87%E4%BB%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/549508/MissAV%20%E5%A4%87%E4%BB%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 核心函数和变量
    const state = {
        allPlaylists: [],
        savedVideos: [],
        isScraping: false
    };

    let container, statusDiv, scrapePlaylistsBtn, scrapeSavedBtn, exportHtmlBtn, exportMdBtn, exportJsonBtn, resultsDiv, videoListDiv, logOutputDiv, header, bodyContainer;

    // 检查并插入UI的函数
    function insertUI() {
        container = document.createElement('div');
        container.id = 'missav-manager-container';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            background-color: #1a202c;
            color: #e2e8f0;
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            font-family: 'Inter', sans-serif;
            width: 300px;
            max-height: 80vh;
            overflow-y: auto;
        `;

        header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.75rem;
            cursor: grab;
        `;

        const title = document.createElement('h3');
        title.id = 'missav-title';
        title.textContent = '播放列表管理器';
        title.style.cssText = 'font-size: 1.125rem; font-weight: bold; margin: 0;';

        header.appendChild(title);

        bodyContainer = document.createElement('div');
        bodyContainer.id = 'missav-body';
        bodyContainer.style.cssText = 'display: flex; flex-direction: column; gap: 0.75rem;';

        statusDiv = document.createElement('div');
        statusDiv.id = 'missav-status';
        statusDiv.style.cssText = 'padding: 0.5rem; border-radius: 0.25rem; text-align: center; background-color: #4a5568;';
        statusDiv.textContent = '等待操作...';

        const scrapeBtnGroup = document.createElement('div');
        scrapeBtnGroup.style.cssText = 'display: flex; flex-direction: column; gap: 0.5rem;';

        scrapePlaylistsBtn = createScrapeButton('批量抓取所有片单①', '#3182ce', '#2c5282');
        scrapeSavedBtn = createScrapeButton('抓取我的收藏视频②', '#48bb78', '#38a169');
        scrapeBtnGroup.appendChild(scrapePlaylistsBtn);
        scrapeBtnGroup.appendChild(scrapeSavedBtn);

        const exportBtnGroup = document.createElement('div');
        exportBtnGroup.style.cssText = 'display: flex; flex-direction: row; gap: 0.5rem;';

        exportHtmlBtn = createExportButton('导出为 HTML (推荐)③', 'html', '#38a169', '#2f855a');
        exportMdBtn = createExportButton('导出为 Markdown', 'md', '#667eea', '#5a67d8');
        exportJsonBtn = createExportButton('导出为 JSON', 'json', '#e53e3e', '#c53030');

        exportBtnGroup.appendChild(exportHtmlBtn);
        exportBtnGroup.appendChild(exportMdBtn);
        exportBtnGroup.appendChild(exportJsonBtn);

        resultsDiv = document.createElement('div');
        resultsDiv.id = 'missav-results';
        resultsDiv.style.cssText = 'margin-top: 1rem;';

        logOutputDiv = document.createElement('div');
        logOutputDiv.id = 'missav-log';
        logOutputDiv.style.cssText = 'background-color: #2d3748; padding: 0.5rem; border-radius: 0.25rem; max-height: 150px; overflow-y: auto; font-size: 0.8rem; margin-top: 0.5rem; white-space: pre-wrap; word-wrap: break-word;';
        logOutputDiv.textContent = '日志输出:';

        videoListDiv = document.createElement('div');
        videoListDiv.id = 'missav-video-list';
        videoListDiv.style.cssText = 'padding: 0.5rem; background-color: #2d3748; border-radius: 0.25rem; max-height: 200px; overflow-y: auto;';
        videoListDiv.textContent = '抓取结果将显示在这里。';

        bodyContainer.appendChild(scrapeBtnGroup);
        bodyContainer.appendChild(exportBtnGroup);
        bodyContainer.appendChild(statusDiv);
        bodyContainer.appendChild(logOutputDiv);
        bodyContainer.appendChild(resultsDiv);
        resultsDiv.appendChild(videoListDiv);

        container.appendChild(header);
        container.appendChild(bodyContainer);
        document.body.appendChild(container);

        scrapePlaylistsBtn.addEventListener('click', scrapeAllPlaylists);
        scrapeSavedBtn.addEventListener('click', scrapeSavedVideos);
        exportHtmlBtn.addEventListener('click', () => exportData('html'));
        exportMdBtn.addEventListener('click', () => exportData('md'));
        exportJsonBtn.addEventListener('click', () => exportData('json'));
        header.addEventListener('click', toggleUI);
        header.addEventListener('mousedown', startDrag);

        logMessage('UI 已成功加载。');
    }

    // 辅助函数，用于创建抓取按钮
    function createScrapeButton(text, bgColor, hoverColor) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = 'width: 100%; padding: 0.75rem; border-radius: 0.25rem; color: white; font-weight: bold; cursor: pointer; transition: background-color 0.2s ease-in-out;';
        btn.style.backgroundColor = bgColor;
        btn.onmouseover = () => btn.style.backgroundColor = hoverColor;
        btn.onmouseout = () => btn.style.backgroundColor = bgColor;
        return btn;
    }

    // 辅助函数，用于创建导出按钮
    function createExportButton(text, format, bgColor, hoverColor) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `flex: 1; padding: 0.75rem 0; border-radius: 0.25rem; background-color: ${bgColor}; color: white; font-weight: bold; cursor: pointer; transition: background-color 0.2s ease-in-out;`;
        btn.onmouseover = () => btn.style.backgroundColor = hoverColor;
        btn.onmouseout = () => btn.style.backgroundColor = bgColor;
        btn.disabled = true;
        btn.dataset.format = format;
        return btn;
    }

    // 核心函数
    function logMessage(message, isError = false) {
        if (!logOutputDiv) {
            console.error('日志容器未找到。');
            return;
        }
        const time = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.textContent = `[${time}] ${message}`;
        logEntry.style.color = isError ? '#f56565' : '#e2e8f0';
        logOutputDiv.appendChild(logEntry);
        logOutputDiv.scrollTop = logOutputDiv.scrollHeight;
    }

    function setStatus(message, isError = false) {
        if (statusDiv) {
            statusDiv.textContent = message;
            statusDiv.style.backgroundColor = isError ? '#c53030' : '#4a5568';
        }
        logMessage(message, isError);
    }

    // 更新UI以显示分类后的数据和封面图
    function updateUI() {
        const allData = [...state.allPlaylists, ...state.savedVideos.length ? [{ playlistTitle: '我的收藏', videos: state.savedVideos }] : []];

        if (allData.length > 0) {
            videoListDiv.innerHTML = '';
            allData.forEach(playlist => {
                const playlistTitleEl = document.createElement('h4');
                playlistTitleEl.textContent = playlist.playlistTitle;
                playlistTitleEl.style.cssText = 'font-weight: bold; margin-top: 1rem; border-bottom: 1px solid #4a5568; padding-bottom: 0.25rem;';
                videoListDiv.appendChild(playlistTitleEl);

                const ul = document.createElement('ul');
                ul.style.cssText = 'list-style-type: none; padding: 0;';
                playlist.videos.forEach(video => {
                    const li = document.createElement('li');
                    li.style.cssText = 'display: flex; align-items: center; padding: 0.5rem; border-bottom: 1px solid #4a5568;';

                    if (video.coverUrl) {
                        const img = document.createElement('img');
                        img.src = video.coverUrl;
                        img.style.cssText = 'width: 50px; height: 50px; object-fit: cover; margin-right: 0.75rem; border-radius: 0.25rem;';
                        li.appendChild(img);
                    }

                    const link = document.createElement('a');
                    link.href = video.url;
                    link.target = '_blank';
                    link.style.cssText = 'color: #63b3ed; text-decoration: none;';
                    link.textContent = video.title;
                    li.appendChild(link);

                    ul.appendChild(li);
                });
                videoListDiv.appendChild(ul);
            });
            exportHtmlBtn.disabled = false;
            exportMdBtn.disabled = false;
            exportJsonBtn.disabled = false;
        } else {
            videoListDiv.textContent = '未找到任何视频。';
            exportHtmlBtn.disabled = true;
            exportMdBtn.disabled = true;
            exportJsonBtn.disabled = true;
        }
        logMessage('UI已更新。');
    }

    let wasDragged = false;
    function toggleUI(event) {
        if (wasDragged) {
            wasDragged = false;
            return;
        }

        const isHidden = bodyContainer.style.display === 'none';
        if (isHidden) {
            bodyContainer.style.display = 'flex';
            container.style.width = '300px';
            header.querySelector('h3').textContent = '播放列表管理器';
        } else {
            bodyContainer.style.display = 'none';
            container.style.width = 'fit-content';
            header.querySelector('h3').textContent = '▼';
        }
    }

    let isDragging = false;
    let offsetX, offsetY;

    function startDrag(e) {
        e.preventDefault();
        if (e.target.tagName.toLowerCase() === 'a' || e.target.tagName.toLowerCase() === 'button') {
            return;
        }

        isDragging = true;
        wasDragged = false;

        const rect = container.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        header.style.cursor = 'grabbing';
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();

        wasDragged = true;

        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;

        container.style.left = `${newX}px`;
        container.style.top = `${newY}px`;
        container.style.right = 'auto';
        container.style.bottom = 'auto';
    }

    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
        header.style.cursor = 'grab';
    }

    // 检查是否为无意义的标签标题
    function isJunkTitle(title) {
        if (!title) return true;
        const junkTitles = [
            'CHINESE-SUBTITLE', 'NEW', 'RELEASE', 'UNCENSORED-LEAK',
            'TODAY-HOT', 'WEEKLY-HOT', 'MONTHLY-HOT', 'SIRO', 'LUXU',
            'GANA', 'MAAN', 'SCUTE', 'ARA', 'FC2', 'HEYZO', 'TOKYOHOT',
            '1pondo', 'CARIBBEANCOM', 'CARIBBEANCOMPR', '10musume',
            'PACOPACOMAMA', 'GACHINCO', 'XXXAV', 'MARRIEDSLASH',
            'NAUGHTY4610', 'NAUGHTY0930', 'MADOU', 'TWAV', 'FURUKE',
            'BOKD', 'DASS', 'BTIS', 'OTLD', 'MIAD', 'ZEX', 'DAZD', 'ACZD',
            'HSM', 'CNY', 'DM'
        ];
        const normalizedTitle = title.toUpperCase().trim();
        return junkTitles.some(junk => normalizedTitle.startsWith(junk));
    }

    // 提取视频信息的通用函数，现在也包含封面图
    function extractVideosFromDoc(doc, baseUrl) {
        const videos = [];
        const seenUrls = new Set();

        const videoCards = doc.querySelectorAll('.thumbnail.group');
        if (videoCards.length === 0) {
            return videos;
        }

        videoCards.forEach(card => {
            const linkElement = card.querySelector('a[href]');
            if (!linkElement || !linkElement.href.includes('missav')) {
                return;
            }

            const imgElement = linkElement.querySelector('img');
            const url = linkElement.href.startsWith('http') ? linkElement.href : new URL(linkElement.href, baseUrl).href;

            let coverUrl = '';
            if (imgElement) {
                // 优先从 data-src 或 data-original 获取，解决懒加载问题
                coverUrl = imgElement.getAttribute('data-src') || imgElement.getAttribute('data-original') || imgElement.src;
            }

            let title = '';
            let code = '';

            try {
                const pathname = new URL(url).pathname;
                const pathSegments = pathname.split('/').filter(Boolean);
                if (pathSegments.length > 0) {
                    code = pathSegments[pathSegments.length - 1];
                }
            } catch (e) {
                return;
            }

            if (imgElement && imgElement.alt) {
                title = imgElement.alt.trim();
            }

            if (!title || title.length < 5) {
                if (code) {
                    title = code.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                } else {
                    return;
                }
            }

            if (isJunkTitle(title)) {
                logMessage(`跳过垃圾标签: ${title}`);
                return;
            }

            if (code && !title.toUpperCase().includes(code.toUpperCase())) {
                title = `${code.toUpperCase()} ${title}`;
            }

            if (title && url && !seenUrls.has(url)) {
                videos.push({ title, url, coverUrl });
                seenUrls.add(url);
            }
        });

        return videos;
    }

    // 自动发现所有播放列表并获取标题（新版，支持分页）
    async function findPlaylists() {
        setStatus('正在发现所有片单...');
        let allPlaylists = [];
        let page = 1;
        const maxPages = 50;
        let consecutiveEmptyPages = 0;
        const baseUrl = 'https://missav.ai/cn/playlists';

        while (page <= maxPages) {
            const playlistsUrl = `${baseUrl}?page=${page}`;
            logMessage(`正在发现片单，第 ${page} 页...`);

            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: playlistsUrl,
                        onload: resolve,
                        onerror: reject,
                        withCredentials: true
                    });
                });

                if (response.status !== 200) {
                    logMessage(`网络请求失败，状态码: ${response.status}，已达到抓取终点。`, true);
                    break;
                }

                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');
                const playlistCards = doc.querySelectorAll('a[href*="/playlists/"]');

                const foundPlaylists = [];
                const seenUrls = new Set();

                playlistCards.forEach(card => {
                    const url = new URL(card.href, playlistsUrl).href;
                    if (url.includes('/playlists/') && url.split('/').length > 5 && !seenUrls.has(url)) {
                        const titleElement = card.querySelector('p.text-base.font-medium.text-nord6.truncate');
                        const title = titleElement ? titleElement.textContent.trim() : '未知标题';

                        if (!allPlaylists.some(p => p.url === url)) {
                            foundPlaylists.push({
                                title: title,
                                url: url
                            });
                            seenUrls.add(url);
                        }
                    }
                });

                if (foundPlaylists.length > 0) {
                    logMessage(`第 ${page} 页找到 ${foundPlaylists.length} 个片单。`);
                    allPlaylists.push(...foundPlaylists);
                    consecutiveEmptyPages = 0;
                    page++;
                } else {
                    consecutiveEmptyPages++;
                    logMessage(`第 ${page} 页没有找到片单。连续空页数：${consecutiveEmptyPages}`);
                    if (consecutiveEmptyPages >= 2) {
                        logMessage('连续两页未找到片单，停止抓取。');
                        break;
                    }
                    page++;
                }

            } catch (error) {
                setStatus(`发现片单失败: ${error.message}`, true);
                break;
            }
        }

        const uniquePlaylists = Array.from(new Map(allPlaylists.map(p => [p.url, p])).values());
        logMessage(`已发现 ${uniquePlaylists.length} 个不重复的片单。`);
        return uniquePlaylists;
    }


    // 改进后的单播放列表抓取函数
    async function scrapeSingleList(list) {
        const { title, url } = list;
        const baseUrl = url.split('?')[0];
        let page = 1;
        const maxPages = 50;
        let consecutiveEmptyPages = 0;
        let listVideos = [];

        logMessage(`--- 开始抓取：${title} ---`);

        while(page <= maxPages) {
            const pageUrl = `${baseUrl}?page=${page}`;
            logMessage(`正在抓取 ${title}，第 ${page} 页...`);

            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: pageUrl,
                        onload: resolve,
                        onerror: reject,
                        withCredentials: true
                    });
                });

                if (response.status !== 200) {
                    logMessage(`网络请求失败，状态码: ${response.status}，已达到抓取终点。`, true);
                    break;
                }

                const parser = new DOMParser();
                const pageDoc = parser.parseFromString(response.responseText, 'text/html');
                const videosFound = extractVideosFromDoc(pageDoc, pageUrl);

                if (videosFound.length > 0) {
                    logMessage(`第 ${page} 页找到 ${videosFound.length} 个视频。`);
                    listVideos.push(...videosFound);
                    page++;
                    consecutiveEmptyPages = 0;
                } else {
                    consecutiveEmptyPages++;
                    logMessage(`第 ${page} 页没有找到视频。连续空页数：${consecutiveEmptyPages}`);
                    if (consecutiveEmptyPages >= 2) {
                        logMessage('连续两页未找到视频，停止抓取。');
                        break;
                    }
                    page++;
                }
            } catch (error) {
                logMessage(`抓取页面 ${pageUrl} 失败: ${error.message}`, true);
                break;
            }
        }
        return {
            title: title,
            videos: listVideos
        };
    }

    // 批量抓取所有播放列表
    async function scrapeAllPlaylists() {
        if (state.isScraping) {
            setStatus('正在抓取中，请稍候...', false);
            return;
        }

        state.isScraping = true;
        state.allPlaylists = [];

        const playlists = await findPlaylists();

        if (playlists.length === 0) {
            setStatus('未发现任何片单。', true);
            state.isScraping = false;
            return;
        }

        let totalVideosFound = 0;

        for (const playlist of playlists) {
            setStatus(`正在抓取片单: ${playlist.title}`);
            const result = await scrapeSingleList(playlist);
            if (result.videos.length > 0) {
                state.allPlaylists.push({
                    playlistTitle: result.title,
                    videos: result.videos
                });
                totalVideosFound += result.videos.length;
            }
            updateUI();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        setStatus(`所有片单抓取完成！总共找到 ${totalVideosFound} 个视频。`, false);
        state.isScraping = false;
    }

    // 抓取我的收藏视频
    async function scrapeSavedVideos() {
        if (state.isScraping) {
            setStatus('正在抓取中，请稍候...', false);
            return;
        }

        state.isScraping = true;
        state.savedVideos = [];

        setStatus('正在抓取收藏视频...');
        const savedResult = await scrapeSingleList({
            title: '我的收藏',
            url: 'https://missav.ai/cn/saved'
        });

        if (savedResult.videos.length > 0) {
            state.savedVideos = savedResult.videos;
            setStatus(`收藏视频抓取完成！总共找到 ${state.savedVideos.length} 个视频。`);
        } else {
            setStatus('未在收藏列表中找到任何视频。');
        }

        updateUI();
        state.isScraping = false;
    }

    // 导出数据并支持多种格式
    function exportData(format) {
        if (state.allPlaylists.length === 0 && state.savedVideos.length === 0) {
            setStatus('没有可以导出的数据。', true);
            return;
        }

        let data = '';
        let fileName = '';
        let mimeType = '';

        if (format === 'html') {
            fileName = 'missav_collection.html';
            mimeType = 'text/html';
            data = generateHtmlData(state.allPlaylists, state.savedVideos);
        } else if (format === 'md') {
            fileName = 'missav_collection.md';
            mimeType = 'text/markdown';
            data = generateMarkdownData(state.allPlaylists, state.savedVideos);
        } else if (format === 'json') {
            fileName = 'missav_collection.json';
            mimeType = 'application/json';
            data = JSON.stringify({
                playlists: state.allPlaylists,
                savedVideos: state.savedVideos
            }, null, 2);
        }

        const blob = new Blob([data], { type: mimeType });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setStatus(`数据已导出为 ${format.toUpperCase()} 格式！`, false);
    }

    // 生成带目录和排版的 Markdown 数据
    function generateMarkdownData(playlists, savedVideos) {
        let md = '# MissAV 数据导出\n\n';

        if (playlists.length > 0) {
            md += '## 所有片单\n\n';
            md += '### 目录\n\n';
            playlists.forEach(playlist => {
                const sanitizedTitle = playlist.playlistTitle.toLowerCase().replace(/[\s\W]+/g, '-');
                md += `* [${playlist.playlistTitle}](#${sanitizedTitle})\n`;
            });
            md += '\n---\n\n';
            playlists.forEach(playlist => {
                md += `## ${playlist.playlistTitle}\n\n`;
                md += '影片数量：' + playlist.videos.length + '\n\n';
                playlist.videos.forEach(video => {
                    md += `### ${video.title}\n`;
                    md += `![${video.title}](${video.coverUrl})\n`;
                    md += `**链接**: [${video.url}](${video.url})\n\n`;
                });
                md += '\n---\n\n';
            });
        }

        if (savedVideos.length > 0) {
            md += '## 我的收藏\n\n';
            md += '影片数量：' + savedVideos.length + '\n\n';
            savedVideos.forEach(video => {
                md += `### ${video.title}\n`;
                md += `![${video.title}](${video.coverUrl})\n`;
                md += `**链接**: [${video.url}](${video.url})\n\n`;
            });
        }
        return md;
    }

    // 生成美观的 HTML 数据（新增目录和美化）
    function generateHtmlData(playlists, savedVideos) {
        const hasPlaylists = playlists.length > 0;
        const hasSavedVideos = savedVideos.length > 0;

        let html = `
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MissAV 收藏与片单</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; margin: 0; padding: 2rem; background-color: #f0f2f5; color: #1a202c; }
        h1 { color: #2d3748; text-align: center; margin-bottom: 2rem; }
        main { display: flex; gap: 2rem; }
        .content { flex: 1; margin-left: 200px; }
        .toc-container {
            position: fixed;
            top: 2rem;
            left: 2rem;
            width: 180px;
            max-height: calc(100vh - 4rem);
            overflow-y: auto;
            background-color: #fff;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            padding: 1rem;
            border-left: 4px solid #4299e1;
            z-index: 100;
        }
        .toc-container h3 { margin-top: 0; color: #2b6cb0; }
        .toc-list { list-style: none; padding: 0; margin: 0; }
        .toc-list a { display: block; padding: 0.5rem; color: #4a5568; text-decoration: none; border-radius: 0.25rem; transition: background-color 0.2s; }
        .toc-list a:hover { background-color: #e2e8f0; }
        .playlist-section { background-color: #fff; border-radius: 0.5rem; box-shadow: 0 4px 10px rgba(0,0,0,0.05); padding: 1.5rem; margin-bottom: 2rem; }
        .playlist-title { color: #4a5568; margin-top: 0; margin-bottom: 1rem; font-size: 1.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; }
        .video-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
        .video-card { background-color: #f7fafc; border-radius: 0.5rem; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: transform 0.2s, box-shadow 0.2s; text-align: center; }
        .video-card:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .video-cover { width: 100%; height: auto; display: block; }
        .video-info { padding: 1rem; }
        .video-title { margin: 0; font-size: 0.9rem; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .video-link { display: block; margin-top: 0.5rem; color: #4299e1; text-decoration: none; font-size: 0.8rem; }
        .video-link:hover { text-decoration: underline; }

        .toggle-btn {
            position: fixed;
            top: 2rem;
            right: 2rem;
            background-color: #2d3748;
            color: #fff;
            border: none;
            padding: 10px 15px;
            border-radius: 0.5rem;
            cursor: pointer;
            z-index: 101;
            transition: background-color 0.2s;
        }
        .toggle-btn:hover {
            background-color: #4a5568;
        }

        .saved-videos-container .video-card {
            background-color: #fff;
        }

        .hidden { display: none; }
    </style>
</head>
<body>
    <h1>MissAV 收藏与片单</h1>
    ${hasPlaylists && hasSavedVideos ? `<button id="toggle-view" class="toggle-btn">切换到我的收藏</button>` : ''}
    <main>
        ${hasPlaylists ? `
        <div id="toc-container" class="toc-container">
            <h3>片单目录</h3>
            <ul class="toc-list">
                ${playlists.map(p => {
                    const sanitizedTitle = p.playlistTitle.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '');
                    return `<li><a href="#${sanitizedTitle}">${p.playlistTitle}</a></li>`;
                }).join('')}
            </ul>
        </div>
        ` : ''}

        <div id="content" class="content">
            <div id="playlists-view" ${!hasPlaylists ? 'class="hidden"' : ''}>
                ${playlists.map(p => `
                    <div class="playlist-section" id="${p.playlistTitle.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '')}">
                        <h2 class="playlist-title">${p.playlistTitle}</h2>
                        <div class="video-grid">
                            ${p.videos.map(v => `
                                <div class="video-card">
                                    <a href="${v.url}" target="_blank" class="video-link">
                                        <img src="${v.coverUrl}" alt="${v.title}" class="video-cover">
                                        <div class="video-info">
                                            <p class="video-title" title="${v.title}">${v.title}</p>
                                        </div>
                                    </a>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>

            <div id="saved-view" ${hasPlaylists ? 'class="hidden"' : ''}>
                <div class="playlist-section saved-videos-container">
                    <h2 class="playlist-title">我的收藏</h2>
                    <div class="video-grid">
                        ${savedVideos.map(v => `
                            <div class="video-card">
                                <a href="${v.url}" target="_blank" class="video-link">
                                    <img src="${v.coverUrl}" alt="${v.title}" class="video-cover">
                                    <div class="video-info">
                                        <p class="video-title" title="${v.title}">${v.title}</p>
                                    </div>
                                </a>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script>
        const toggleBtn = document.getElementById('toggle-view');
        const playlistsView = document.getElementById('playlists-view');
        const savedView = document.getElementById('saved-view');
        const tocContainer = document.getElementById('toc-container');
        const content = document.getElementById('content');

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const isPlaylistsHidden = playlistsView.classList.contains('hidden');

                if (isPlaylistsHidden) {
                    playlistsView.classList.remove('hidden');
                    savedView.classList.add('hidden');
                    if(tocContainer) tocContainer.classList.remove('hidden');
                    if(content) content.style.marginLeft = '200px';
                    toggleBtn.textContent = '切换到我的收藏';
                } else {
                    playlistsView.classList.add('hidden');
                    savedView.classList.remove('hidden');
                    if(tocContainer) tocContainer.classList.add('hidden');
                    if(content) content.style.marginLeft = '2rem';
                    toggleBtn.textContent = '切换到所有片单';
                }
            });
        }
    </script>
</body>
</html>
        `;
        return html;
    }

    window.addEventListener('load', insertUI);
})();