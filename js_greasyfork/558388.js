// ==UserScript==
// @name         PT自动感谢
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  获取PT站点所有种子连接并且全自动感谢发布者,修改计数自用
// @author       jadylc
// @match        *://*/torrents.php*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/558388/PT%E8%87%AA%E5%8A%A8%E6%84%9F%E8%B0%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/558388/PT%E8%87%AA%E5%8A%A8%E6%84%9F%E8%B0%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentSite = {
        protocol: window.location.protocol,
        host: window.location.host,
        baseUrl: window.location.protocol + '//' + window.location.host
    };

    const style = document.createElement('style');
    style.textContent = `
        .custom-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            width: 420px;
            z-index: 10000;
            font-family: Arial, sans-serif;
        }
        .dialog-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #333;
            text-align: center;
        }
        .task-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
        }
        .current-task {
            margin-top: 15px;
            padding: 10px;
            background: #f0f7ff;
            border-radius: 6px;
            border-left: 4px solid #1890ff;
            display: none;
        }
        .progress-container {
            margin: 20px 0;
            background: #f0f2f5;
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
        }
        .progress-bar {
            height: 100%;
            background: #1890ff;
            width: 0%;
            transition: width 0.3s;
        }
        .task-completed {
            color: #52c41a;
            font-weight: bold;
        }
        .task-failed {
            color: #ff4d4f;
            font-weight: bold;
        }
        .task-skipped {
            color: #faad14;
            font-weight: bold;
        }
        .task-status {
            margin-top: 15px;
            text-align: center;
            font-size: 16px;
        }
        .status-chips {
            display: flex;
            justify-content: center;
            margin-top: 15px;
            gap: 10px;
        }
        .status-chip {
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 13px;
            display: inline-flex;
            align-items: center;
        }
        .chip-success {
            background-color: #f6ffed;
            border: 1px solid #b7eb8f;
            color: #52c41a;
        }
        .chip-error {
            background-color: #fff2f0;
            border: 1px solid #ffccc7;
            color: #ff4d4f;
        }
        .chip-warning {
            background-color: #fffbe6;
            border: 1px solid #ffe58f;
            color: #faad14;
        }
        .close-button {
            position: absolute;
            right: 15px;
            top: 15px;
            cursor: pointer;
            font-size: 20px;
            color: #999;
            transition: color 0.3s;
        }
        .close-button:hover {
            color: #666;
        }
        .action-buttons {
            text-align: center;
            margin-top: 25px;
        }
        .action-button {
            padding: 8px 20px;
            border: none;
            border-radius: 6px;
            background: #1890ff;
            color: white;
            cursor: pointer;
            transition: background 0.3s;
        }
        .action-button:hover {
            background: #40a9ff;
        }
        .action-button:disabled {
            background: #bedaff;
            cursor: not-allowed;
        }
        .dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
        }
        .settings-group {
            margin: 15px 0;
        }
        .settings-label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: #333;
        }
        .settings-input {
            width: 100%;
            padding: 8px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .settings-input:focus {
            border-color: #40a9ff;
            outline: none;
            box-shadow: 0 0 0 2px rgba(24,144,255,0.2);
        }
        .settings-radio {
            margin-right: 10px;
        }
        .settings-radio-label {
            margin-right: 20px;
            font-weight: normal;
        }
        .page-settings {
            display: none;
            margin-top: 10px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 4px;
        }
        .current-page-info {
            margin-bottom: 10px;
            font-size: 13px;
            color: #666;
        }
        .floating-button {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #1890ff;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            cursor: pointer;
            z-index: 9998;
            transition: all 0.3s;
            border: none;
            font-size: 24px;
        }
        .floating-button:hover {
            background: #40a9ff;
            transform: translateY(-3px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }
        .page-status {
            margin-top: 10px;
            font-size: 14px;
            color: #666;
            text-align: center;
        }
        .site-info {
            margin-top: 5px;
            font-size: 12px;
            color: #999;
            text-align: center;
        }
    `;
    document.head.appendChild(style);

    let settings = {
        interval: 2000,
        pageMode: 'current',
        pageCount: 1
    };

    function getCurrentPage() {
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get('page')) || 1;
    }

    function generatePageUrl(page) {
        const url = new URL(window.location.href);
        url.searchParams.set('page', page);
        return url.toString();
    }

    async function getLinksFromPage(url) {
        try {
            const response = await fetch(url);
            const html = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const links = [];
            const rows = doc.querySelectorAll('.torrentname');

            rows.forEach(row => {
                const linkElement = row.querySelector('a[href^="details.php?id="]');
                if (linkElement) {
                    const href = linkElement.getAttribute('href');
                    const title = linkElement.getAttribute('title') || linkElement.textContent;
                    if (href && title) {
                        const fullUrl = `${currentSite.baseUrl}/${href}`;
                        const idMatch = href.match(/id=(\d+)/);
                        if (idMatch) {
                            links.push({
                                title: title.trim(),
                                url: fullUrl,
                                id: idMatch[1]
                            });
                        }
                    }
                }
            });

            return links;
        } catch (error) {
            console.error('获取页面链接失败:', error);
            return [];
        }
    }

    async function checkIfThanked(url) {
        try {
            const response = await fetch(url);
            const html = await response.text();

            return html.includes('你已說過謝謝') || html.includes('你已说过谢谢');
        } catch (error) {
            console.error('检查是否已感谢失败:', error);
            return false;
        }
    }

    async function executeThanks(id, url) {
        const formData = new URLSearchParams();
        formData.append('id', id);

        const response = await fetch(`${currentSite.baseUrl}/thanks.php`, {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'accept-language': 'zh-CN,zh;q=0.9',
                'cache-control': 'no-cache',
                'content-type': 'application/x-www-form-urlencoded',
                'origin': currentSite.baseUrl,
                'pragma': 'no-cache',
                'referer': url,
                'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
            },
            body: formData,
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`感谢请求失败: ${response.status}`);
        }

        const text = await response.text();
        if (text.includes('error') || text.includes('失败')) {
            throw new Error(text);
        }

        return true;
    }

    function createDialog(links) {
        const currentPage = getCurrentPage();

        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';

        const dialog = document.createElement('div');
        dialog.className = 'custom-dialog';

        const closeButton = document.createElement('span');
        closeButton.className = 'close-button';
        closeButton.textContent = '×';
        closeButton.onclick = () => {
            overlay.remove();
            dialog.remove();
        };

        const title = document.createElement('div');
        title.className = 'dialog-title';
        title.textContent = '自动感谢任务';

        const siteInfo = document.createElement('div');
        siteInfo.className = 'site-info';
        siteInfo.textContent = `当前站点: ${currentSite.host}`;

        const pageModeGroup = document.createElement('div');
        pageModeGroup.className = 'settings-group';

        const pageModeLabel = document.createElement('label');
        pageModeLabel.className = 'settings-label';
        pageModeLabel.textContent = '执行范围';

        const pageModeOptions = document.createElement('div');

        const currentPageRadio = document.createElement('input');
        currentPageRadio.type = 'radio';
        currentPageRadio.name = 'pageMode';
        currentPageRadio.id = 'pageMode-current';
        currentPageRadio.className = 'settings-radio';
        currentPageRadio.value = 'current';
        currentPageRadio.checked = true;

        const currentPageLabel = document.createElement('label');
        currentPageLabel.htmlFor = 'pageMode-current';
        currentPageLabel.className = 'settings-radio-label';
        currentPageLabel.textContent = '当前页面';

        const multiPageRadio = document.createElement('input');
        multiPageRadio.type = 'radio';
        multiPageRadio.name = 'pageMode';
        multiPageRadio.id = 'pageMode-multi';
        multiPageRadio.className = 'settings-radio';
        multiPageRadio.value = 'multi';

        const multiPageLabel = document.createElement('label');
        multiPageLabel.htmlFor = 'pageMode-multi';
        multiPageLabel.className = 'settings-radio-label';
        multiPageLabel.textContent = '自定义页数';

        const pageSettings = document.createElement('div');
        pageSettings.className = 'page-settings';
        pageSettings.id = 'page-settings';

        const currentPageInfo = document.createElement('div');
        currentPageInfo.className = 'current-page-info';
        currentPageInfo.textContent = `当前页码: ${currentPage}`;

        const pageCountLabel = document.createElement('label');
        pageCountLabel.className = 'settings-label';
        pageCountLabel.textContent = '需要处理的页数:';
        pageCountLabel.style.marginBottom = '8px';

        const pageCountInput = document.createElement('input');
        pageCountInput.className = 'settings-input';
        pageCountInput.type = 'number';
        pageCountInput.min = '1';
        pageCountInput.max = '10';
        pageCountInput.value = '3';
        pageCountInput.id = 'page-count';

        pageSettings.appendChild(currentPageInfo);
        pageSettings.appendChild(pageCountLabel);
        pageSettings.appendChild(pageCountInput);

        pageModeOptions.appendChild(currentPageRadio);
        pageModeOptions.appendChild(currentPageLabel);
        pageModeOptions.appendChild(multiPageRadio);
        pageModeOptions.appendChild(multiPageLabel);

        pageModeGroup.appendChild(pageModeLabel);
        pageModeGroup.appendChild(pageModeOptions);
        pageModeGroup.appendChild(pageSettings);

        currentPageRadio.addEventListener('change', () => {
            if(currentPageRadio.checked) {
                pageSettings.style.display = 'none';
                settings.pageMode = 'current';
            }
        });

        multiPageRadio.addEventListener('change', () => {
            if(multiPageRadio.checked) {
                pageSettings.style.display = 'block';
                settings.pageMode = 'multi';
                settings.pageCount = parseInt(pageCountInput.value);
            }
        });

        pageCountInput.addEventListener('change', () => {
            settings.pageCount = parseInt(pageCountInput.value);
        });

        const taskInfo = document.createElement('div');
        taskInfo.className = 'task-info';
        taskInfo.id = 'task-info';
        taskInfo.textContent = `当前页找到 ${links.length} 个链接`;

        const currentTask = document.createElement('div');
        currentTask.className = 'current-task';
        currentTask.id = 'current-task';
        currentTask.style.display = 'none';

        const pageStatus = document.createElement('div');
        pageStatus.className = 'page-status';
        pageStatus.id = 'page-status';
        pageStatus.style.display = 'none';

        const statusChips = document.createElement('div');
        statusChips.className = 'status-chips';
        statusChips.id = 'status-chips';
        statusChips.innerHTML = `
            <div class="status-chip chip-success">成功: 0</div>
            <div class="status-chip chip-warning">跳过: 0</div>
            <div class="status-chip chip-error">失败: 0</div>
        `;
        statusChips.style.display = 'none';

        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.id = 'progress-bar';

        progressContainer.appendChild(progressBar);

        const taskStatus = document.createElement('div');
        taskStatus.className = 'task-status';
        taskStatus.id = 'task-status';
        taskStatus.textContent = '准备就绪';

        const settingsGroup = document.createElement('div');
        settingsGroup.className = 'settings-group';

        const settingsLabel = document.createElement('label');
        settingsLabel.className = 'settings-label';
        settingsLabel.textContent = '请求间隔时间 (毫秒)';

        const settingsInput = document.createElement('input');
        settingsInput.className = 'settings-input';
        settingsInput.type = 'number';
        settingsInput.min = '1000';
        settingsInput.max = '10000';
        settingsInput.step = '500';
        settingsInput.value = settings.interval;
        settingsInput.onchange = (e) => {
            settings.interval = parseInt(e.target.value);
        };

        settingsGroup.appendChild(settingsLabel);
        settingsGroup.appendChild(settingsInput);

        const actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';

        const executeButton = document.createElement('button');
        executeButton.className = 'action-button';
        executeButton.textContent = '开始执行任务';
        executeButton.onclick = async () => {
            executeButton.disabled = true;
            executeButton.textContent = '任务执行中...';
            settingsInput.disabled = true;
            pageCountInput.disabled = true;
            currentPageRadio.disabled = true;
            multiPageRadio.disabled = true;
            statusChips.style.display = 'flex';

            if (settings.pageMode === 'current') {
                await executeAllTasks(links);
            } else {
                await executeMultiPageTasks(currentPage, settings.pageCount);
            }

            executeButton.textContent = '任务已完成';
        };

        actionButtons.appendChild(executeButton);

        dialog.appendChild(closeButton);
        dialog.appendChild(title);
        dialog.appendChild(siteInfo);
        dialog.appendChild(pageModeGroup);
        dialog.appendChild(taskInfo);
        dialog.appendChild(pageStatus);
        dialog.appendChild(currentTask);
        dialog.appendChild(statusChips);
        dialog.appendChild(progressContainer);
        dialog.appendChild(taskStatus);
        dialog.appendChild(settingsGroup);
        dialog.appendChild(actionButtons);

        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }

    function updateStatusChips(completed, skipped, failed) {
    const statusChips = document.getElementById('status-chips');
    if (!statusChips) return;
    const successChip = statusChips.querySelector('.chip-success');
    const skipChip = statusChips.querySelector('.chip-warning');
    const failChip = statusChips.querySelector('.chip-error');
    if (successChip) successChip.textContent = `成功: ${completed}`;
    if (skipChip) skipChip.textContent = `跳过: ${skipped}`;
    if (failChip) failChip.textContent = `失败: ${failed}`;
}

    async function executeMultiPageTasks(startPage, pageCount) {
        let totalCompleted = 0;
        let totalSkipped = 0;
        let totalFailed = 0;
        let totalLinks = 0;

        const progressBar = document.getElementById('progress-bar');
        const taskStatus = document.getElementById('task-status');
        const pageStatus = document.getElementById('page-status');
        const taskInfo = document.getElementById('task-info');

        pageStatus.style.display = 'block';

        for (let i = 0; i < pageCount; i++) {
            const pageNum = startPage + i;
            const pageUrl = generatePageUrl(pageNum);

            pageStatus.textContent = `正在处理第 ${i + 1}/${pageCount} 页 (页码: ${pageNum})`;
            progressBar.style.width = `${(i / pageCount) * 100}%`;

            const pageLinks = await getLinksFromPage(pageUrl);
            totalLinks += pageLinks.length;

            taskInfo.textContent = `共找到 ${totalLinks} 个链接`;

            const pageResult = await executeAllTasks(pageLinks, totalCompleted, totalSkipped, totalFailed);

            totalCompleted = pageResult.completed;
            totalSkipped = pageResult.skipped;
            totalFailed = pageResult.failed;
        }

        progressBar.style.width = '100%';

        if (totalFailed === 0) {
            taskStatus.textContent = `✅ 全部任务执行完成!`;
            taskStatus.className = 'task-status task-completed';
        } else {
            taskStatus.textContent = `⚠️ 任务执行完成，部分失败!`;
            taskStatus.className = 'task-status task-failed';
        }

        updateStatusChips(totalCompleted, totalSkipped, totalFailed);
    }

    async function executeAllTasks(links, initialCompleted = 0, initialSkipped = 0, initialFailed = 0) {
        const totalTasks = links.length;
        let completed = initialCompleted;
        let failed = initialFailed;
        let skipped = initialSkipped;

        const progressBar = document.getElementById('progress-bar');
        const taskStatus = document.getElementById('task-status');
        const currentTask = document.getElementById('current-task');

        if (initialCompleted === 0) {
            progressBar.style.width = '0%';
        }

        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            if (settings.pageMode === 'current') {
                const progress = Math.round((i / totalTasks) * 100);
                progressBar.style.width = `${progress}%`;
            }

            currentTask.style.display = 'block';
            currentTask.textContent = `正在处理: ${link.title.substring(0, 50)}${link.title.length > 50 ? '...' : ''}`;

            try {
                const alreadyThanked = await checkIfThanked(link.url);

                if (alreadyThanked) {
                    skipped++;
                    currentTask.textContent += ' (已跳过)';
                    currentTask.style.borderLeft = '4px solid #faad14';
                } else {
                    await executeThanks(link.id, link.url);
                    completed++;
                    currentTask.style.borderLeft = '4px solid #52c41a';
                }
            } catch (error) {
                failed++;
                currentTask.style.borderLeft = '4px solid #ff4d4f';
                console.error('执行任务失败:', error, link);
            }

            updateStatusChips(completed, skipped, failed);

            if (settings.pageMode === 'current') {
                taskStatus.textContent = `进度: ${i + 1}/${totalTasks}`;
            } else {
                taskStatus.textContent = `当前页进度: ${i + 1}/${totalTasks}`;
            }

            await new Promise(resolve => setTimeout(resolve, settings.interval));
        }

        if (settings.pageMode === 'current') {
            progressBar.style.width = '100%';
            currentTask.style.display = 'none';

            if (failed === 0) {
                taskStatus.textContent = `✅ 全部任务执行完成!`;
                taskStatus.className = 'task-status task-completed';
            } else {
                taskStatus.textContent = `⚠️ 任务执行完成，部分失败!`;
                taskStatus.className = 'task-status task-failed';
            }
        }

        return { completed, skipped, failed };
    }

    function getCurrentPageLinks() {
        const links = [];
        const rows = document.querySelectorAll('.torrentname');

        rows.forEach(row => {
            const linkElement = row.querySelector('a[href^="details.php?id="]');
            if (linkElement) {
                const href = linkElement.getAttribute('href');
                const title = linkElement.getAttribute('title') || linkElement.textContent;
                if (href && title) {
                    const fullUrl = `${currentSite.baseUrl}/${href}`;
                    const idMatch = href.match(/id=(\d+)/);
                    if (idMatch) {
                        links.push({
                            title: title.trim(),
                            url: fullUrl,
                            id: idMatch[1]
                        });
                    }
                }
            }
        });

        return links;
    }

    const floatingButton = document.createElement('button');
    floatingButton.className = 'floating-button';
    floatingButton.textContent = '👍';
    floatingButton.title = '获取链接并执行感谢';
    floatingButton.onclick = function() {
        const links = getCurrentPageLinks();

        if (links.length > 0) {
            createDialog(links);
        } else {
            alert('未找到任何链接！');
        }
    };

    document.body.appendChild(floatingButton);
})();

(function() {
    'use strict';

    const currentSite = {
        protocol: window.location.protocol,
        host: window.location.host,
        baseUrl: window.location.protocol + '//' + window.location.host
    };

    const style = document.createElement('style');
    style.textContent = `
        .custom-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            width: 420px;
            z-index: 10000;
            font-family: Arial, sans-serif;
        }
        .dialog-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #333;
            text-align: center;
        }
        .task-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
        }
        .current-task {
            margin-top: 15px;
            padding: 10px;
            background: #f0f7ff;
            border-radius: 6px;
            border-left: 4px solid #1890ff;
            display: none;
        }
        .progress-container {
            margin: 20px 0;
            background: #f0f2f5;
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
        }
        .progress-bar {
            height: 100%;
            background: #1890ff;
            width: 0%;
            transition: width 0.3s;
        }
        .task-completed {
            color: #52c41a;
            font-weight: bold;
        }
        .task-failed {
            color: #ff4d4f;
            font-weight: bold;
        }
        .task-skipped {
            color: #faad14;
            font-weight: bold;
        }
        .task-status {
            margin-top: 15px;
            text-align: center;
            font-size: 16px;
        }
        .status-chips {
            display: flex;
            justify-content: center;
            margin-top: 15px;
            gap: 10px;
        }
        .status-chip {
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 13px;
            display: inline-flex;
            align-items: center;
        }
        .chip-success {
            background-color: #f6ffed;
            border: 1px solid #b7eb8f;
            color: #52c41a;
        }
        .chip-error {
            background-color: #fff2f0;
            border: 1px solid #ffccc7;
            color: #ff4d4f;
        }
        .chip-warning {
            background-color: #fffbe6;
            border: 1px solid #ffe58f;
            color: #faad14;
        }
        .close-button {
            position: absolute;
            right: 15px;
            top: 15px;
            cursor: pointer;
            font-size: 20px;
            color: #999;
            transition: color 0.3s;
        }
        .close-button:hover {
            color: #666;
        }
        .action-buttons {
            text-align: center;
            margin-top: 25px;
        }
        .action-button {
            padding: 8px 20px;
            border: none;
            border-radius: 6px;
            background: #1890ff;
            color: white;
            cursor: pointer;
            transition: background 0.3s;
        }
        .action-button:hover {
            background: #40a9ff;
        }
        .action-button:disabled {
            background: #bedaff;
            cursor: not-allowed;
        }
        .dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
        }
        .settings-group {
            margin: 15px 0;
        }
        .settings-label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: #333;
        }
        .settings-input {
            width: 100%;
            padding: 8px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .settings-input:focus {
            border-color: #40a9ff;
            outline: none;
            box-shadow: 0 0 0 2px rgba(24,144,255,0.2);
        }
        .settings-radio {
            margin-right: 10px;
        }
        .settings-radio-label {
            margin-right: 20px;
            font-weight: normal;
        }
        .page-settings {
            display: none;
            margin-top: 10px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 4px;
        }
        .current-page-info {
            margin-bottom: 10px;
            font-size: 13px;
            color: #666;
        }
        .floating-button {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #1890ff;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            cursor: pointer;
            z-index: 9998;
            transition: all 0.3s;
            border: none;
            font-size: 24px;
        }
        .floating-button:hover {
            background: #40a9ff;
            transform: translateY(-3px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }
        .page-status {
            margin-top: 10px;
            font-size: 14px;
            color: #666;
            text-align: center;
        }
        .site-info {
            margin-top: 5px;
            font-size: 12px;
            color: #999;
            text-align: center;
        }
    `;
    document.head.appendChild(style);

    let settings = {
        interval: 2000,
        pageMode: 'current',
        pageCount: 1
    };

    function getCurrentPage() {
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get('page')) || 1;
    }

    function generatePageUrl(page) {
        const url = new URL(window.location.href);
        url.searchParams.set('page', page);
        return url.toString();
    }

    async function getLinksFromPage(url) {
        try {
            const response = await fetch(url);
            const html = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const links = [];
            const rows = doc.querySelectorAll('.torrentname');

            rows.forEach(row => {
                const linkElement = row.querySelector('a[href^="details.php?id="]');
                if (linkElement) {
                    const href = linkElement.getAttribute('href');
                    const title = linkElement.getAttribute('title') || linkElement.textContent;
                    if (href && title) {
                        const fullUrl = `${currentSite.baseUrl}/${href}`;
                        const idMatch = href.match(/id=(\d+)/);
                        if (idMatch) {
                            links.push({
                                title: title.trim(),
                                url: fullUrl,
                                id: idMatch[1]
                            });
                        }
                    }
                }
            });

            return links;
        } catch (error) {
            console.error('获取页面链接失败:', error);
            return [];
        }
    }

    async function checkIfThanked(url) {
        try {
            const response = await fetch(url);
            const html = await response.text();

            return html.includes('你已說過謝謝') || html.includes('你已说过谢谢');
        } catch (error) {
            console.error('检查是否已感谢失败:', error);
            return false;
        }
    }

    async function executeThanks(id, url) {
        const formData = new URLSearchParams();
        formData.append('id', id);

        const response = await fetch(`${currentSite.baseUrl}/thanks.php`, {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'accept-language': 'zh-CN,zh;q=0.9',
                'cache-control': 'no-cache',
                'content-type': 'application/x-www-form-urlencoded',
                'origin': currentSite.baseUrl,
                'pragma': 'no-cache',
                'referer': url,
                'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
            },
            body: formData,
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`感谢请求失败: ${response.status}`);
        }

        const text = await response.text();
        if (text.includes('error') || text.includes('失败')) {
            throw new Error(text);
        }

        return true;
    }

    function createDialog(links) {
        const currentPage = getCurrentPage();

        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';

        const dialog = document.createElement('div');
        dialog.className = 'custom-dialog';

        const closeButton = document.createElement('span');
        closeButton.className = 'close-button';
        closeButton.textContent = '×';
        closeButton.onclick = () => {
            overlay.remove();
            dialog.remove();
        };

        const title = document.createElement('div');
        title.className = 'dialog-title';
        title.textContent = '自动感谢任务';

        const siteInfo = document.createElement('div');
        siteInfo.className = 'site-info';
        siteInfo.textContent = `当前站点: ${currentSite.host}`;

        const pageModeGroup = document.createElement('div');
        pageModeGroup.className = 'settings-group';

        const pageModeLabel = document.createElement('label');
        pageModeLabel.className = 'settings-label';
        pageModeLabel.textContent = '执行范围';

        const pageModeOptions = document.createElement('div');

        const currentPageRadio = document.createElement('input');
        currentPageRadio.type = 'radio';
        currentPageRadio.name = 'pageMode';
        currentPageRadio.id = 'pageMode-current';
        currentPageRadio.className = 'settings-radio';
        currentPageRadio.value = 'current';
        currentPageRadio.checked = true;

        const currentPageLabel = document.createElement('label');
        currentPageLabel.htmlFor = 'pageMode-current';
        currentPageLabel.className = 'settings-radio-label';
        currentPageLabel.textContent = '当前页面';

        const multiPageRadio = document.createElement('input');
        multiPageRadio.type = 'radio';
        multiPageRadio.name = 'pageMode';
        multiPageRadio.id = 'pageMode-multi';
        multiPageRadio.className = 'settings-radio';
        multiPageRadio.value = 'multi';

        const multiPageLabel = document.createElement('label');
        multiPageLabel.htmlFor = 'pageMode-multi';
        multiPageLabel.className = 'settings-radio-label';
        multiPageLabel.textContent = '自定义页数';

        const pageSettings = document.createElement('div');
        pageSettings.className = 'page-settings';
        pageSettings.id = 'page-settings';

        const currentPageInfo = document.createElement('div');
        currentPageInfo.className = 'current-page-info';
        currentPageInfo.textContent = `当前页码: ${currentPage}`;

        const pageCountLabel = document.createElement('label');
        pageCountLabel.className = 'settings-label';
        pageCountLabel.textContent = '需要处理的页数:';
        pageCountLabel.style.marginBottom = '8px';

        const pageCountInput = document.createElement('input');
        pageCountInput.className = 'settings-input';
        pageCountInput.type = 'number';
        pageCountInput.min = '1';
        pageCountInput.max = '10';
        pageCountInput.value = '3';
        pageCountInput.id = 'page-count';

        pageSettings.appendChild(currentPageInfo);
        pageSettings.appendChild(pageCountLabel);
        pageSettings.appendChild(pageCountInput);

        pageModeOptions.appendChild(currentPageRadio);
        pageModeOptions.appendChild(currentPageLabel);
        pageModeOptions.appendChild(multiPageRadio);
        pageModeOptions.appendChild(multiPageLabel);

        pageModeGroup.appendChild(pageModeLabel);
        pageModeGroup.appendChild(pageModeOptions);
        pageModeGroup.appendChild(pageSettings);

        currentPageRadio.addEventListener('change', () => {
            if(currentPageRadio.checked) {
                pageSettings.style.display = 'none';
                settings.pageMode = 'current';
            }
        });

        multiPageRadio.addEventListener('change', () => {
            if(multiPageRadio.checked) {
                pageSettings.style.display = 'block';
                settings.pageMode = 'multi';
                settings.pageCount = parseInt(pageCountInput.value);
            }
        });

        pageCountInput.addEventListener('change', () => {
            settings.pageCount = parseInt(pageCountInput.value);
        });

        const taskInfo = document.createElement('div');
        taskInfo.className = 'task-info';
        taskInfo.id = 'task-info';
        taskInfo.textContent = `当前页找到 ${links.length} 个链接`;

        const currentTask = document.createElement('div');
        currentTask.className = 'current-task';
        currentTask.id = 'current-task';
        currentTask.style.display = 'none';

        const pageStatus = document.createElement('div');
        pageStatus.className = 'page-status';
        pageStatus.id = 'page-status';
        pageStatus.style.display = 'none';

        const statusChips = document.createElement('div');
        statusChips.className = 'status-chips';
        statusChips.id = 'status-chips';
        statusChips.innerHTML = `
            <div class="status-chip chip-success">成功: 0</div>
            <div class="status-chip chip-warning">跳过: 0</div>
            <div class="status-chip chip-error">失败: 0</div>
        `;
        statusChips.style.display = 'none';

        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.id = 'progress-bar';

        progressContainer.appendChild(progressBar);

        const taskStatus = document.createElement('div');
        taskStatus.className = 'task-status';
        taskStatus.id = 'task-status';
        taskStatus.textContent = '准备就绪';

        const settingsGroup = document.createElement('div');
        settingsGroup.className = 'settings-group';

        const settingsLabel = document.createElement('label');
        settingsLabel.className = 'settings-label';
        settingsLabel.textContent = '请求间隔时间 (毫秒)';

        const settingsInput = document.createElement('input');
        settingsInput.className = 'settings-input';
        settingsInput.type = 'number';
        settingsInput.min = '1000';
        settingsInput.max = '10000';
        settingsInput.step = '500';
        settingsInput.value = settings.interval;
        settingsInput.onchange = (e) => {
            settings.interval = parseInt(e.target.value);
        };

        settingsGroup.appendChild(settingsLabel);
        settingsGroup.appendChild(settingsInput);

        const actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';

        const executeButton = document.createElement('button');
        executeButton.className = 'action-button';
        executeButton.textContent = '开始执行任务';
        executeButton.onclick = async () => {
            executeButton.disabled = true;
            executeButton.textContent = '任务执行中...';
            settingsInput.disabled = true;
            pageCountInput.disabled = true;
            currentPageRadio.disabled = true;
            multiPageRadio.disabled = true;
            statusChips.style.display = 'flex';

            if (settings.pageMode === 'current') {
                await executeAllTasks(links);
            } else {
                await executeMultiPageTasks(currentPage, settings.pageCount);
            }

            executeButton.textContent = '任务已完成';
        };

        actionButtons.appendChild(executeButton);

        dialog.appendChild(closeButton);
        dialog.appendChild(title);
        dialog.appendChild(siteInfo);
        dialog.appendChild(pageModeGroup);
        dialog.appendChild(taskInfo);
        dialog.appendChild(pageStatus);
        dialog.appendChild(currentTask);
        dialog.appendChild(statusChips);
        dialog.appendChild(progressContainer);
        dialog.appendChild(taskStatus);
        dialog.appendChild(settingsGroup);
        dialog.appendChild(actionButtons);

        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }

    function updateStatusChips(completed, skipped, failed) {
    const statusChips = document.getElementById('status-chips');
    if (!statusChips) return;
    const successChip = statusChips.querySelector('.chip-success');
    const skipChip = statusChips.querySelector('.chip-warning');
    const failChip = statusChips.querySelector('.chip-error');
    if (successChip) successChip.textContent = `成功: ${completed}`;
    if (skipChip) skipChip.textContent = `跳过: ${skipped}`;
    if (failChip) failChip.textContent = `失败: ${failed}`;
}

    async function executeMultiPageTasks(startPage, pageCount) {
        let totalCompleted = 0;
        let totalSkipped = 0;
        let totalFailed = 0;
        let totalLinks = 0;

        const progressBar = document.getElementById('progress-bar');
        const taskStatus = document.getElementById('task-status');
        const pageStatus = document.getElementById('page-status');
        const taskInfo = document.getElementById('task-info');

        pageStatus.style.display = 'block';

        for (let i = 0; i < pageCount; i++) {
            const pageNum = startPage + i;
            const pageUrl = generatePageUrl(pageNum);

            pageStatus.textContent = `正在处理第 ${i + 1}/${pageCount} 页 (页码: ${pageNum})`;
            progressBar.style.width = `${(i / pageCount) * 100}%`;

            const pageLinks = await getLinksFromPage(pageUrl);
            totalLinks += pageLinks.length;

            taskInfo.textContent = `共找到 ${totalLinks} 个链接`;

            const pageResult = await executeAllTasks(pageLinks, totalCompleted, totalSkipped, totalFailed);

            totalCompleted = pageResult.completed;
            totalSkipped = pageResult.skipped;
            totalFailed = pageResult.failed;
        }

        progressBar.style.width = '100%';

        if (totalFailed === 0) {
            taskStatus.textContent = `✅ 全部任务执行完成!`;
            taskStatus.className = 'task-status task-completed';
        } else {
            taskStatus.textContent = `⚠️ 任务执行完成，部分失败!`;
            taskStatus.className = 'task-status task-failed';
        }

        updateStatusChips(totalCompleted, totalSkipped, totalFailed);
    }

    async function executeAllTasks(links, initialCompleted = 0, initialSkipped = 0, initialFailed = 0) {
        const totalTasks = links.length;
        let completed = initialCompleted;
        let failed = initialFailed;
        let skipped = initialSkipped;

        const progressBar = document.getElementById('progress-bar');
        const taskStatus = document.getElementById('task-status');
        const currentTask = document.getElementById('current-task');

        if (initialCompleted === 0) {
            progressBar.style.width = '0%';
        }

        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            if (settings.pageMode === 'current') {
                const progress = Math.round((i / totalTasks) * 100);
                progressBar.style.width = `${progress}%`;
            }

            currentTask.style.display = 'block';
            currentTask.textContent = `正在处理: ${link.title.substring(0, 50)}${link.title.length > 50 ? '...' : ''}`;

            try {
                const alreadyThanked = await checkIfThanked(link.url);

                if (alreadyThanked) {
                    skipped++;
                    currentTask.textContent += ' (已跳过)';
                    currentTask.style.borderLeft = '4px solid #faad14';
                } else {
                    await executeThanks(link.id, link.url);
                    completed++;
                    currentTask.style.borderLeft = '4px solid #52c41a';
                }
            } catch (error) {
                failed++;
                currentTask.style.borderLeft = '4px solid #ff4d4f';
                console.error('执行任务失败:', error, link);
            }

            updateStatusChips(completed, skipped, failed);

            if (settings.pageMode === 'current') {
                taskStatus.textContent = `进度: ${i + 1}/${totalTasks}`;
            } else {
                taskStatus.textContent = `当前页进度: ${i + 1}/${totalTasks}`;
            }

            await new Promise(resolve => setTimeout(resolve, settings.interval));
        }

        if (settings.pageMode === 'current') {
            progressBar.style.width = '100%';
            currentTask.style.display = 'none';

            if (failed === 0) {
                taskStatus.textContent = `✅ 全部任务执行完成!`;
                taskStatus.className = 'task-status task-completed';
            } else {
                taskStatus.textContent = `⚠️ 任务执行完成，部分失败!`;
                taskStatus.className = 'task-status task-failed';
            }
        }

        return { completed, skipped, failed };
    }

    function getCurrentPageLinks() {
        const links = [];
        const rows = document.querySelectorAll('.torrentname');

        rows.forEach(row => {
            const linkElement = row.querySelector('a[href^="details.php?id="]');
            if (linkElement) {
                const href = linkElement.getAttribute('href');
                const title = linkElement.getAttribute('title') || linkElement.textContent;
                if (href && title) {
                    const fullUrl = `${currentSite.baseUrl}/${href}`;
                    const idMatch = href.match(/id=(\d+)/);
                    if (idMatch) {
                        links.push({
                            title: title.trim(),
                            url: fullUrl,
                            id: idMatch[1]
                        });
                    }
                }
            }
        });

        return links;
    }

    const floatingButton = document.createElement('button');
    floatingButton.className = 'floating-button';
    floatingButton.textContent = '👍';
    floatingButton.title = '获取链接并执行感谢';
    floatingButton.onclick = function() {
        const links = getCurrentPageLinks();

        if (links.length > 0) {
            createDialog(links);
        } else {
            alert('未找到任何链接！');
        }
    };

    document.body.appendChild(floatingButton);
})();