// ==UserScript==
// @name         HUST课程平台课件批量下载器 V1.0
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一次性获取所有课件链接，并提供自动下载模式。
// @author       dy_boat
// @match        https://smartcourse.hust.edu.cn/mooc-smartcourse/mycourse/studentstudy*
// @grant        GM_download
// @grant        GM_addStyle
// @license      MIT
// @connect      smartcourse.hust.edu.cn
// @downloadURL https://update.greasyfork.org/scripts/555416/HUST%E8%AF%BE%E7%A8%8B%E5%B9%B3%E5%8F%B0%E8%AF%BE%E4%BB%B6%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%99%A8%20V10.user.js
// @updateURL https://update.greasyfork.org/scripts/555416/HUST%E8%AF%BE%E7%A8%8B%E5%B9%B3%E5%8F%B0%E8%AF%BE%E4%BB%B6%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%99%A8%20V10.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区 ---
    const DOWNLOAD_INTERVAL_MS = 1500; // 使用浏览器下载时，每个文件间的下载间隔(毫秒)

    // --- UI界面 ---
    const launcherBtn = document.createElement('div');
    launcherBtn.innerHTML = `<button id="launcher-btn">🚀 启动下载器</button>`;
    document.body.appendChild(launcherBtn);

    const panel = document.createElement('div');
    panel.id = 'downloader-panel';
    panel.innerHTML = `
        <div id="downloader-container">
            <div id="downloader-header">
                <span>课件批量下载器</span>
                <span id="close-btn">[X]</span>
            </div>
            <button id="fetch-btn">1. 一键获取全部课件链接</button>
            <div id="download-options" style="display:none;">
                <button id="browser-download-btn">2a. 使用浏览器批量下载</button>
                <button id="idm-export-btn">2b. 导出链接 (用于IDM等)</button>
            </div>
            <div id="export-area" style="display:none;">
                <p><b>请复制所有链接到下载工具:</b></p>
                <textarea id="links-textarea" readonly></textarea>
            </div>
            <div id="progress-log"></div>
        </div>`;
    document.body.appendChild(panel);

    GM_addStyle(`
        #launcher-btn { position: fixed; bottom: 20px; right: 20px; z-index: 9998; background-color: #007bff; color: white; border: none; padding: 10px 15px; border-radius: 20px; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.2); font-size: 14px; }
        #downloader-panel { display: none; } /* 初始隐藏 */
        #downloader-container { position: fixed; top: 10px; right: 10px; z-index: 9999; background-color: #f8f9fa; border: 1px solid #dee2e6; padding: 12px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: "Microsoft YaHei", sans-serif; max-width: 400px; width: 350px; }
        #downloader-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-weight: bold; color: #495057; }
        #close-btn { cursor: pointer; font-size: 14px; color: #6c757d; }
        #downloader-container button { width: 100%; border: none; padding: 10px; border-radius: 5px; cursor: pointer; font-size: 14px; transition: background-color 0.3s; margin-top: 5px; }
        #fetch-btn { background-color: #007bff; color: white; }
        #browser-download-btn { background-color: #28a745; color: white; }
        #idm-export-btn { background-color: #6f42c1; color: white; }
        #downloader-container button:disabled { background-color: #6c757d; cursor: not-allowed; }
        #download-options, #export-area { margin-top: 10px; }
        #export-area p { font-size:12px; margin-bottom:5px; color:#343a40; }
        #progress-log { font-size: 12px; max-height: 300px; overflow-y: auto; color: #495057; background-color: #fff; padding: 8px; border-radius: 4px; border: 1px solid #ced4da; line-height: 1.5; margin-top: 10px;}
        #links-textarea { width: 95%; height: 120px; font-size: 11px; padding: 5px; margin-top: 5px; border: 1px solid #ced4da; border-radius: 4px; }
        .log-success { color: #28a745; font-weight: bold; } .log-error { color: #dc3545; font-weight: bold; } .log-info { color: #17a2b8; }
    `);

    const launcher = document.getElementById('launcher-btn');
    const panelDiv = document.getElementById('downloader-panel');
    const closeBtn = document.getElementById('close-btn');
    const fetchBtn = document.getElementById('fetch-btn');
    const downloadOptionsDiv = document.getElementById('download-options');
    const browserDownloadBtn = document.getElementById('browser-download-btn');
    const idmExportBtn = document.getElementById('idm-export-btn');
    const exportAreaDiv = document.getElementById('export-area');
    const linksTextarea = document.getElementById('links-textarea');
    const logDiv = document.getElementById('progress-log');

    let totalDownloadQueue = [];

    launcher.addEventListener('click', () => panelDiv.style.display = 'block');
    closeBtn.addEventListener('click', () => panelDiv.style.display = 'none');

    function log(message, type = 'info') {
        const time = new Date().toLocaleTimeString();
        const escapedMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        logDiv.innerHTML = `<div class="log-${type}">[${time}] ${escapedMessage}</div>` + logDiv.innerHTML;
        console.log(`[Downloader] ${message}`);
    }

    fetchBtn.addEventListener('click', async () => {
        log('🚀 **开始获取所有链接...**');
        fetchBtn.disabled = true;
        totalDownloadQueue = [];
        logDiv.innerHTML = '';

        try {
            log('正在扫描课程目录...');
            const taskElements = document.querySelectorAll('span.posCatalog_name[onclick*="getTeacherAjax"]');
            if (taskElements.length === 0) throw new Error('未在目录中找到任何章节。');

            const tasks = Array.from(taskElements).map(el => {
                const onclickAttr = el.getAttribute('onclick');
                const match = onclickAttr.match(/getTeacherAjax\('([^']*)',\s*'([^']*)',\s*'([^']*)'\)/);
                if (!match) return null;
                return { title: el.getAttribute('title') || el.innerText.trim(), courseId: match[1], clazzid: match[2], chapterId: match[3] };
            }).filter(Boolean);

            log(`扫描完成，共找到 ${tasks.length} 个有效章节。`, 'info');
            fetchBtn.innerText = `正在处理 0/${tasks.length}...`;

            const results = tasks.map((task, i) => processChapter(task, i + 1, tasks.length));
            await Promise.all(results);

            log(`🎉 **链接获取完成！共找到 ${totalDownloadQueue.length} 个文件！**`, 'success');
            fetchBtn.innerText = `已获取 ${totalDownloadQueue.length} 个文件`;

            if (totalDownloadQueue.length > 0) {
                downloadOptionsDiv.style.display = 'block';
            } else {
                log('课程中未发现可下载的课件。', 'info');
            }

        } catch (error) {
            log(`❌ 发生严重错误: ${error.message}`, 'error');
            fetchBtn.innerText = '获取失败，请重试';
            fetchBtn.disabled = false;
        }
    });

    browserDownloadBtn.addEventListener('click', () => {
        log('🚀 **已选择 [浏览器下载]**');
        browserDownloadBtn.disabled = true;
        idmExportBtn.disabled = true;
        startBrowserDownloadManager();
    });

    idmExportBtn.addEventListener('click', () => {
        log('🚀 **已选择 [导出链接]**');
        browserDownloadBtn.disabled = true;
        idmExportBtn.disabled = true;
        const allLinks = totalDownloadQueue.map(item => item.url).join('\n');
        linksTextarea.value = allLinks;
        exportAreaDiv.style.display = 'block';
        linksTextarea.select();
        log('✅ 所有链接已生成，请全选(Ctrl+A)并复制。', 'success');
    });

    async function processChapter(task, current, total) {
        try {
            const url1 = `https://smartcourse.hust.edu.cn/mooc-ans/mycourse/studentstudyAjax?courseId=${task.courseId}&clazzid=${task.clazzid}&chapterId=${task.chapterId}&mooc2=1`;
            const response1 = await fetch(url1, { credentials: 'include' });
            if (!response1.ok) throw new Error(`HTTP Error`);
            const html1 = await response1.text();

            const iframeSrcMatch = html1.match(/<iframe.*?src="([^"]*cards[^"]*)"/);
            if (!iframeSrcMatch || !iframeSrcMatch[1]) return;
            const iframeSrc = iframeSrcMatch[1].replace(/&amp;/g, '&');
            const url2 = new URL(iframeSrc, 'https://smartcourse.hust.edu.cn').href;

            const response2 = await fetch(url2, { credentials: 'include' });
            if (!response2.ok) throw new Error(`HTTP Error`);
            const html2 = await response2.text();

            const mArgMatch = html2.match(/mArg\s*=\s*({[\s\S]*?});/);
            if (!mArgMatch || !mArgMatch[1]) return;

            const mArgObject = new Function('return ' + mArgMatch[1])();
            if (!mArgObject.attachments || mArgObject.attachments.length === 0) return;

            const objectIds = mArgObject.attachments.map(att => att.property?.objectid).filter(Boolean);
            if (objectIds.length === 0) return;

            for (const objectId of objectIds) {
                const url3 = `https://smartcourse.hust.edu.cn/ananas/status/${objectId}?flag=normal&_dc=${new Date().getTime()}`;
                const response3 = await fetch(url3, { credentials: 'include' });
                const jsonData = await response3.json();
                if (jsonData.status === 'success' && jsonData.download && jsonData.filename) {
                    totalDownloadQueue.push({ name: jsonData.filename, url: jsonData.download });
                    log(`[${current}/${total}] 解析成功: ${jsonData.filename}`, 'info');
                }
            }
        } catch (e) {
            log(`❌ 处理章节 [${task.title}] 失败`, 'error');
        } finally {
            fetchBtn.innerText = `正在处理 ${current}/${total}...`;
        }
    }

    function startBrowserDownloadManager() {
        let downloadedCount = 0;
        const totalFiles = totalDownloadQueue.length;
        log(`[浏览器下载] 队列启动，共 ${totalFiles} 个文件。`, 'info');

        const interval = setInterval(() => {
            if (totalDownloadQueue.length > 0) {
                const file = totalDownloadQueue.shift();
                downloadedCount++;
                log(`📥 (${downloadedCount}/${totalFiles}) 正在下载: ${file.name}`);
                GM_download({ url: file.url, name: file.name, onerror: err => log(`❌ 下载 ${file.name} 失败`, "error"), ontimeout: () => log(`❌ 下载 ${file.name} 超时`, "error") });
            } else {
                clearInterval(interval);
                log('🎉 **所有下载任务已派发完毕！**', 'success');
            }
        }, DOWNLOAD_INTERVAL_MS);
    }
})();