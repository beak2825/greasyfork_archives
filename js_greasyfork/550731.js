// ==UserScript==
// @name         新版百度网盘共享文件库目录导出工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  用于导出百度网盘共享文件库目录和文件列表
// @author       superzhang
// @license      MIT
// @match        https://pan.baidu.com/disk*
// @icon         https://nd-static.bdstatic.com/m-static/v20-main/favicon-main.ico
// @grant        GM_xmlhttpRequest
// @require      https://unpkg.com/xlsx/dist/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/550731/%E6%96%B0%E7%89%88%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%85%B1%E4%BA%AB%E6%96%87%E4%BB%B6%E5%BA%93%E7%9B%AE%E5%BD%95%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/550731/%E6%96%B0%E7%89%88%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%85%B1%E4%BA%AB%E6%96%87%E4%BB%B6%E5%BA%93%E7%9B%AE%E5%BD%95%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加调试日志函数
    const DEBUG = true;
    function debugLog(message, data) {
        if (DEBUG) {
            console.log(`[NBNT Debug] ${message}`, data || '');
        }
    }

    let directories = []; // 存储解析后的目录数据
    let depthSetting = 1; // 默认层数设置

    // 添加并发控制池
    class RequestPool {
        constructor(maxConcurrent = 2, requestInterval = 3000) {
            this.maxConcurrent = maxConcurrent;
            this.currentRequests = 0;
            this.queue = [];
            this.requestInterval = requestInterval;
            this.lastRequestTime = 0;
        }

        async add(fn) {
            if (this.currentRequests >= this.maxConcurrent) {
                await new Promise(resolve => this.queue.push(resolve));
            }

            const now = Date.now();
            const timeSinceLastRequest = now - this.lastRequestTime;
            if (timeSinceLastRequest < this.requestInterval) {
                await new Promise(resolve =>
                    setTimeout(resolve, this.requestInterval - timeSinceLastRequest)
                );
            }

            this.currentRequests++;
            this.lastRequestTime = Date.now();

            try {
                return await fn();
            } finally {
                this.currentRequests--;
                if (this.queue.length > 0) {
                    const next = this.queue.shift();
                    next();
                }
            }
        }
    }

    // 添加进度条组件
    function createProgressBar() {
        const progressContainer = document.createElement('div');
        progressContainer.id = 'directory-progress';
        progressContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            display: none;
            width: 350px;
            font-family: "Microsoft YaHei", sans-serif;
        `;

        const titleDiv = document.createElement('div');
        titleDiv.style.cssText = `
            font-weight: bold;
            margin-bottom: 15px;
            color: #333;
            font-size: 14px;
        `;
        titleDiv.textContent = '目录获取进度';

        const progressText = document.createElement('div');
        progressText.id = 'progress-text';
        progressText.style.cssText = `
            margin-bottom: 10px;
            color: #666;
            font-size: 13px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 280px;
        `;
        progressText.textContent = '正在获取目录信息...';

        const progressBarOuter = document.createElement('div');
        progressBarOuter.style.cssText = `
            width: 100%;
            height: 6px;
            background: #f0f0f0;
            border-radius: 3px;
            overflow: hidden;
        `;

        const progressBarInner = document.createElement('div');
        progressBarInner.id = 'progress-bar';
        progressBarInner.style.cssText = `
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, #2196F3, #00BCD4);
            transition: width 0.3s ease;
            border-radius: 3px;
        `;

        progressBarOuter.appendChild(progressBarInner);
        progressContainer.appendChild(titleDiv);
        progressContainer.appendChild(progressText);
        progressContainer.appendChild(progressBarOuter);
        document.body.appendChild(progressContainer);

        return {
            show: () => progressContainer.style.display = 'block',
            hide: () => progressContainer.style.display = 'none',
            remove: () => {
                if (progressContainer.parentNode) {
                    progressContainer.parentNode.removeChild(progressContainer);
                }
            },
            updateProgress: (current, total) => {
                const percentage = Math.min((current / total) * 100, 100);
                progressBarInner.style.width = `${percentage}%`;
                progressText.textContent = `进度：${current}/${total} (${percentage.toFixed(1)}%)`;
            },
            updateText: (text) => {
                progressText.textContent = text;
            }
        };
    }

    // 等待文件库按钮和标题加载，并添加点击事件监听
    function waitForLibraryElements() {
        let isProcessing = false;

        // 检查并添加按钮到操作栏
        function checkAndAddOperationButtons() {
            if (isProcessing) return;
            isProcessing = true;

            try {
                const operateDiv = document.querySelector('.im-file-nav__operate');
                const downloadButton = operateDiv?.querySelector('.u-icon-download')?.closest('button');

                if (!operateDiv || !downloadButton) {
                    isProcessing = false;
                    return;
                }

                const existingCheckButton = document.querySelector('#check-dir-button');
                const existingFetchButton = document.querySelector('#fetch-dir-button');

                if (existingCheckButton || existingFetchButton) {
                    isProcessing = false;
                    return;
                }

                // 添加样式
                const style = document.createElement('style');
                style.textContent = `
                    .export-dropdown {
                        position: relative;
                        display: inline-flex;
                        align-items: center;
                        cursor: pointer;
                        height: 24px;
                        line-height: 24px;
                    }
                    .export-dropdown::after {
                        content: '';
                        position: absolute;
                        right: -12px;
                        top: 6px;
                        width: 1px;
                        height: 12px;
                        background-color: rgb(217, 217, 217);
                    }
                    .export-dropdown-menu {
                        display: none;
                        position: absolute;
                        top: 100%;
                        left: 50%;
                        transform: translateX(-50%);
                        background: white;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                        padding: 4px;
                        z-index: 99999;
                        margin-top: 2px;
                        border: 1px solid #e8e8e8;
                        white-space: nowrap;
                        flex-direction: row;
                    }
                    .export-dropdown-menu.show {
                        display: flex;
                    }
                    .export-item {
                        padding: 4px 12px;
                        cursor: pointer;
                        color: #333;
                        font-size: 12px;
                        line-height: 1.5;
                        border-right: 1px solid #e8e8e8;
                    }
                    .export-item:last-child {
                        border-right: none;
                    }
                    .export-item:hover {
                        background: #f5f5f5;
                    }
                `;
                document.head.appendChild(style);

                const checkButton = document.createElement('button');
                checkButton.id = 'check-dir-button';
                checkButton.type = 'button';
                checkButton.className = 'u-button u-button--default u-button--mini';
                checkButton.innerHTML = `
                    <i class="u-icon-search"></i>
                    <span>检查目录</span>
                `;

                const exportDropdown = document.createElement('div');
                exportDropdown.className = 'export-dropdown u-button u-button--default u-button--mini';
                exportDropdown.innerHTML = `
                    <i class="u-icon-folder"></i>
                    <span>导出目录</span>
                    <i class="u-icon-arrow-down" style="margin-left: 4px;"></i>
                    <div class="export-dropdown-menu">
                        <div class="export-item" data-type="txt">导出为TXT</div>
                        <div class="export-item" data-type="xlsx">导出为Excel</div>
                    </div>
                `;

                const fetchAllDropdown = document.createElement('div');
                fetchAllDropdown.className = 'export-dropdown u-button u-button--default u-button--mini';
                fetchAllDropdown.innerHTML = `
                    <i class="u-icon-download-bold"></i>
                    <span>导出全部</span>
                    <i class="u-icon-arrow-down" style="margin-left: 4px;"></i>
                    <div class="export-dropdown-menu">
                        <div class="export-item" data-type="txt">导出为TXT</div>
                        <div class="export-item" data-type="xlsx">导出为Excel</div>
                    </div>
                `;

                checkButton.onclick = function() {
                    const selectedDirs = getSelectedDirectories();
                    console.log(selectedDirs);
                    if (selectedDirs.length === 0) {
                        alert('请至少选中一个目录!');
                        return;
                    }

                    // 如果选中了多个目录，则显示所有选中目录的信息
                    if (selectedDirs.length > 1) {
                        let infoText = `已选中 ${selectedDirs.length} 个目录:\n\n`;
                        selectedDirs.forEach((selected, index) => {
                            const { dirInfo, title } = selected;
                            infoText += `${index + 1}. ${title}\n`;
                            infoText += `   fs_id: ${dirInfo.fs_id}\n`;
                            infoText += `   group_id: ${dirInfo.group_id}\n`;
                            infoText += `   uk: ${dirInfo.uk}\n\n`;
                        });
                        alert(infoText);
                    } else {
                        // 如果只选中了一个目录，则使用原来的方式显示
                        const { dirInfo, title } = selectedDirs[0];
                        checkDirectoryInfo(dirInfo.msg_id, title);
                    }
                };

                // 处理导出选项点击
                exportDropdown.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const menu = this.querySelector('.export-dropdown-menu');
                    menu.classList.toggle('show');
                });

                // 点击其他地方关闭菜单
                document.addEventListener('click', function() {
                    const menus = document.querySelectorAll('.export-dropdown-menu');
                    menus.forEach(menu => menu.classList.remove('show'));
                });

                // 防止菜单项点击事件冒泡
                exportDropdown.querySelector('.export-dropdown-menu').addEventListener('click', function(e) {
                    e.stopPropagation();
                });

                exportDropdown.querySelector('.export-dropdown-menu').addEventListener('click', async function(e) {
                    const exportType = e.target.dataset.type;
                    if (!exportType) return;

                    try {
                        const selectedDirs = getSelectedDirectories();
                        if (selectedDirs.length === 0) {
                            alert('请至少选中一个目录!');
                            return;
                        }

                        depthSetting = parseInt(prompt("请输入要获取的子目录层数:", "1"), 10);
                        if (isNaN(depthSetting) || depthSetting < 1) {
                            alert("请输入有效的层数！");
                            return;
                        }

                        // 创建进度条
                        const progressBar = createProgressBar();
                        progressBar.show();
                        progressBar.updateText(`准备处理 ${selectedDirs.length} 个选中的目录...`);

                        // 存储所有目录的结果
                        const allResults = [];
                        let processedCount = 0;

                        // 逐个处理选中的目录
                        for (const selected of selectedDirs) {
                            const { dirInfo, title } = selected;
                            console.log(`处理目录 ${processedCount + 1}/${selectedDirs.length}: ${title}`);
                            progressBar.updateText(`正在处理目录 ${processedCount + 1}/${selectedDirs.length}: ${title}`);

                            const uk = dirInfo.uk;
                            const fsId = dirInfo.fs_id;
                            const gid = dirInfo.group_id;
                            const msgId = dirInfo.msg_id;

                            try {
                                const result = await fetchSubdirectories(uk, msgId, fsId, gid, title, depthSetting);
                                if (!window.cancelOperation && result) {
                                    allResults.push({
                                        title: title,
                                        result: result
                                    });
                                }
                            } catch (error) {
                                console.error(`处理目录 "${title}" 时出错:`, error);
                            }

                            processedCount++;
                            progressBar.updateProgress(processedCount, selectedDirs.length);
                        }

                        // 处理完成后导出文件
                        if (allResults.length > 0) {
                            progressBar.updateText('正在生成导出文件...');

                            if (exportType === 'txt') {
                                // 生成合并的文本内容
                                const combinedContent = formatMultipleDirectoryTrees(allResults);
                                const fileName = selectedDirs.length === 1 ? selectedDirs[0].title : '多个目录';
                                saveAsTxt(combinedContent, fileName);
                            } else if (exportType === 'xlsx') {
                                // 生成Excel文件
                                const fileName = selectedDirs.length === 1 ? selectedDirs[0].title : '多个目录';
                                saveMultipleAsExcel(allResults, fileName);
                            }

                            progressBar.updateText('导出完成!');
                            setTimeout(() => progressBar.hide(), 2000);
                        } else {
                            progressBar.updateText('没有成功处理任何目录');
                            setTimeout(() => progressBar.hide(), 2000);
                        }
                    } finally {
                        cleanup();
                    }
                });

                // 处理导出全部按钮的点击事件
                fetchAllDropdown.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const menu = this.querySelector('.export-dropdown-menu');
                    menu.classList.toggle('show');
                });

                // 防止菜单项点击事件冒泡
                fetchAllDropdown.querySelector('.export-dropdown-menu').addEventListener('click', function(e) {
                    e.stopPropagation();
                });

                // 修改导出全部选项的点击处理
                fetchAllDropdown.querySelector('.export-dropdown-menu').addEventListener('click', async function(e) {
                    const exportType = e.target.dataset.type;
                    if (!exportType) return;

                    try {
                        const selectedDirs = getSelectedDirectories();
                        if (selectedDirs.length === 0) {
                            alert('请至少选中一个目录!');
                            return;
                        }

                        depthSetting = parseInt(prompt("请输入要获取的层数:", "1"), 10);
                        if (isNaN(depthSetting) || depthSetting < 1) {
                            alert("请输入有效的层数！");
                            return;
                        }

                        // 创建进度条
                        const progressBar = createProgressBar();
                        progressBar.show();
                        progressBar.updateText(`准备处理 ${selectedDirs.length} 个选中的目录...`);

                        // 存储所有目录的结果
                        const allResults = [];
                        let processedCount = 0;

                        // 逐个处理选中的目录
                        for (const selected of selectedDirs) {
                            const { dirInfo, title } = selected;
                            console.log(`处理目录 ${processedCount + 1}/${selectedDirs.length}: ${title}`);
                            progressBar.updateText(`正在处理目录 ${processedCount + 1}/${selectedDirs.length}: ${title}`);

                            const uk = dirInfo.uk;
                            const fsId = dirInfo.fs_id;
                            const gid = dirInfo.group_id;
                            const msgId = dirInfo.msg_id;

                            try {
                                const result = await fetchAllContent(uk, msgId, fsId, gid, title, depthSetting);
                                if (!window.cancelOperation && result) {
                                    allResults.push({
                                        title: title,
                                        result: result
                                    });
                                }
                            } catch (error) {
                                console.error(`处理目录 "${title}" 时出错:`, error);
                            }

                            processedCount++;
                            progressBar.updateProgress(processedCount, selectedDirs.length);
                        }

                        // 处理完成后导出文件
                        if (allResults.length > 0) {
                            progressBar.updateText('正在生成导出文件...');

                            if (exportType === 'txt') {
                                // 生成合并的文本内容
                                const combinedContent = formatMultipleAllContent(allResults);
                                const fileName = selectedDirs.length === 1 ? selectedDirs[0].title + "_完整" : '多个目录_完整';
                                saveAsTxt(combinedContent, fileName);
                            } else if (exportType === 'xlsx') {
                                // 生成Excel文件
                                const fileName = selectedDirs.length === 1 ? selectedDirs[0].title + "_完整" : '多个目录_完整';
                                saveMultipleAllAsExcel(allResults, fileName);
                            }

                            progressBar.updateText('导出完成!');
                            setTimeout(() => progressBar.hide(), 2000);
                        } else {
                            progressBar.updateText('没有成功处理任何目录');
                            setTimeout(() => progressBar.hide(), 2000);
                        }
                    } finally {
                        cleanup();
                    }
                });

                // 修改按钮插入顺序
                requestAnimationFrame(() => {
                    downloadButton.after(fetchAllDropdown);
                    downloadButton.after(document.createTextNode(' ')); // 添加空格
                    downloadButton.after(exportDropdown);
                    downloadButton.after(document.createTextNode(' ')); // 添加空格
                    downloadButton.after(checkButton);
                });

            } finally {
                isProcessing = false;
            }
        }

        // 创建一个防抖函数
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // 使用防抖包装检查函数
        const debouncedCheck = debounce(checkAndAddOperationButtons, 200);

        // 修改 MutationObserver 的配置
        const observer = new MutationObserver((mutations) => {
            // 只在有相关变化时触发检查
            const hasRelevantChanges = mutations.some(mutation => {
                return mutation.addedNodes.length > 0 &&
                       Array.from(mutation.addedNodes).some(node => {
                           return node.classList?.contains('im-file-nav__operate') ||
                                  node.querySelector?.('.im-file-nav__operate');
                       });
            });

            if (hasRelevantChanges) {
                debouncedCheck();
            }
        });

        // 使用更具体的观察配置
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        // 初始检查
        checkAndAddOperationButtons();

        // 拦截请求（只需要执行一次）
        interceptNetworkRequests();
    }

    // 获取当前选中的目录（支持多选）
    function getSelectedDirectories() {
        debugLog('开始获取选中的目录');
        const selectedDirs = document.querySelectorAll('.im-pan-table__body-row.selected, .im-pan-list__item.selected');
        debugLog('找到的选中元素：', selectedDirs);

        if (selectedDirs.length === 0) {
            debugLog('没有选中任何目录');
            return [];
        }

        const results = [];

        for (const selectedDir of selectedDirs) {
            const title = selectedDir.querySelector('.im-pan-list__file-name-title-text')?.innerText;
            debugLog('获取到的目录标题：', title);

            if (!title) {
                debugLog('未能获取到目录标题，跳过此项');
                continue;
            }

            debugLog('当前目录列表：', directories);
            const matchedDir = directories.find(dir => {
                debugLog('比对目录：', {
                    current: dir.server_filename,
                    target: title,
                    match: dir.server_filename === title
                });
                return dir.server_filename === title;
            });

            if (!matchedDir) {
                console.error(`未找到目录 "${title}" 的记录`);
                debugLog('尝试模糊匹配...');
                // 尝试模糊匹配
                const fuzzyMatch = directories.find(dir =>
                    dir.server_filename.includes(title) ||
                    title.includes(dir.server_filename)
                );
                if (fuzzyMatch) {
                    debugLog('找到模糊匹配结果：', fuzzyMatch);
                    results.push({
                        element: selectedDir,
                        title: title,
                        dirInfo: fuzzyMatch
                    });
                } else {
                    debugLog(`模糊匹配也未找到结果，跳过 "${title}"`);
                }
            } else {
                debugLog('成功匹配到目录：', matchedDir);
                results.push({
                    element: selectedDir,
                    title: title,
                    dirInfo: matchedDir
                });
            }
        }

        debugLog('获取到的所有选中目录：', results);
        return results;
    }

    // 检查目录信息并显示相关信息
    function checkDirectoryInfo(msgId, title) {
        console.log(`检查目录: ${title}, msgId: ${msgId}`);

        const matchedDir = directories.find(dir => dir.msg_id === msgId);
        console.log("当前目录数据：", directories);

        if (matchedDir) {
            alert(`匹配到目录: ${title}\nfs_id: ${matchedDir.fs_id}\ngroup_id: ${matchedDir.group_id}\nuk: ${matchedDir.uk}`);
            console.log("匹配的目录信息：", matchedDir);
        } else {
            alert(`未找到与目录 "${title}" 匹配的记录。`);
        }
    }

    // 拦截 XMLHttpRequest 请求
    function interceptNetworkRequests() {
        const originalOpen = XMLHttpRequest.prototype.open; // 保存原始 XMLHttpRequest.open

        XMLHttpRequest.prototype.open = function (method, url, ...rest) {
            if (url.includes('mbox/group/listshare')) {
                console.log("准备拦截 XMLHttpRequest 请求：", url);
                this.addEventListener('load', function () {
                    try {
                        const data = this.responseType === 'json' ? this.response : JSON.parse(this.responseText);
                        console.debug("完整的响应数据：", data); // 调试输出完整数据
                        processLibraryData(data);
                    } catch (e) {
                        console.error("解析响应失败：", e);
                    }
                });
            }

            // 拦截进入目录的请求
            if (url.includes('mbox/msg/shareinfo')) {
                console.log("准备拦截进入目录的 XMLHttpRequest 请求：", url);
                this.addEventListener('load', function () {
                    try {
                        const data = this.responseType === 'json' ? this.response : JSON.parse(this.responseText);
                        console.debug("完整的响应数据：", data); // 调试输出完整数据
                        processDirectoryData(data);
                    } catch (e) {
                        console.error("解析响应失败：", e);
                    }
                });
            }

            return originalOpen.apply(this, [method, url, ...rest]);
        };
    }

    // 处理文件库数据：取需要的信息并存储
    function processLibraryData(data) {
        debugLog('收到文件库数据：', data);
        if (!data || data.errno !== 0) {
            console.error("文件库数据获取失败，错误码：", data?.errno);
            return;
        }

        directories = [];
        const msgList = data.records?.msg_list || [];
        debugLog('解析到的消息列表：', msgList);

        msgList.forEach((msg, index) => {
            const group_id = msg.group_id;
            const uk = msg.uk;
            debugLog(`处理第 ${index + 1} 条消息：`, { group_id, uk });

            msg.file_list.forEach(file => {
                if (parseInt(file.isdir) === 1) {
                    directories.push({
                        fs_id: file.fs_id,
                        server_filename: file.server_filename,
                        group_id: group_id,
                        msg_id: msg.msg_id,
                        uk: uk
                    });
                    debugLog('添加目录：', file.server_filename);
                }
            });
        });

        debugLog('当前所有目录：', directories);
    }

    // 处理目录数据：提取需要的信息并存储
    function processDirectoryData(data) {
        if (!data || data.errno !== 0) {
            console.error("目录数据获取失败，错误码：", data?.errno);
            return;
        }

        const records = data.records || [];

        records.forEach(record => {
            // 保存所有目录信息，包括子目录
            if (parseInt(record.isdir) === 1) {
                // 处理路径，移除"我的资源"前缀
                let processedPath = record.path;
                if (processedPath.startsWith('/我的资源/')) {
                    processedPath = processedPath.substring('/我的资源'.length);
                }

                // 从处理后的路径中提取各级目录
                const pathParts = processedPath.split('/').filter(p => p);
                const rootName = pathParts[0];

                // 查找根目录信息
                const rootDir = directories.find(d => d.server_filename === rootName);

                if (rootDir) {
                    // 检查是否已存在相同的记录
                    const existingRecord = directories.find(d => d.fs_id === record.fs_id);
                    if (!existingRecord) {
                        // 构建完整的目录信息
                        const dirInfo = {
                            fs_id: record.fs_id,
                            server_filename: record.server_filename,
                            path: processedPath,
                            group_id: rootDir.group_id,
                            msg_id: rootDir.msg_id,
                            uk: rootDir.uk,
                            parent_path: pathParts.slice(0, -1).join('/'),
                            level: pathParts.length - 1  // 添加层级信息
                        };

                        // 添加到目录列表
                        directories.push(dirInfo);
                    }
                } else {
                    // 如果是根目录级别的分享，直接添加
                    if (pathParts.length === 1) {
                        const dirInfo = {
                            fs_id: record.fs_id,
                            server_filename: record.server_filename,
                            path: processedPath,
                            group_id: record.group_id,
                            msg_id: record.msg_id,
                            uk: record.uk,
                            level: 0
                        };
                        directories.push(dirInfo);
                    }
                }
            }
        });

        // 按层级排序，方便调试查看
        directories.sort((a, b) => (a.level || 0) - (b.level || 0));
    }

    // 获取子目录信息
    async function fetchSubdirectories(uk, msgId, fsId, gid, title, depth) {
        debugLog('开始获取子目录', {
            uk, msgId, fsId, gid, title, depth
        });

        const startTime = performance.now();
        const progressBar = createProgressBar();
        progressBar.show();

        let result = {
            name: title,
            children: [],
            level: 0,
            isRoot: true,
            startTime: startTime
        };

        let totalDirectories = 0;
        let processedDirectories = 0;

        async function fetchDirContent(parentDir, currentDepth) {
            if (currentDepth >= depth) return;

            debugLog(`获取目录内容：${parentDir.name}，当前深度：${currentDepth}`);

            let page = 1;
            let hasMore = true;
            const allRecords = [];

            while (hasMore) {
                progressBar.updateText(`正在获取 "${parentDir.name}" 的第 ${page} 页数据...`);
                debugLog(`[${parentDir.name}] 获取第 ${page} 页`);

                const url = `https://pan.baidu.com/mbox/msg/shareinfo?from_uk=${encodeURIComponent(uk)}&msg_id=${encodeURIComponent(msgId)}&type=2&num=100&page=${page}&fs_id=${encodeURIComponent(parentDir.fs_id || fsId)}&gid=${encodeURIComponent(gid)}&limit=100&desc=1&clienttype=0&app_id=250528&web=1`;

                try {
                    const response = await fetch(url, { timeout: 10000 });
                    const data = await response.json();
                    debugLog(`[${parentDir.name}] 第 ${page} 页响应：`, data);

                    if (data.errno !== 0) {
                        console.error(`[${parentDir.name}] 获取第 ${page} 页失败:`, data);
                        return;
                    }

                    allRecords.push(...data.records);
                    hasMore = data.has_more === 1;

                    debugLog(`[${parentDir.name}] 第 ${page} 页获取成功，记录数：${data.records.length}，是否还有更多：${hasMore}`);
                    page++;

                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (error) {
                    console.error(`[${parentDir.name}] 获取第 ${page} 页时发生错误:`, error);
                    return;
                }
            }

            // 分离目录和文件
            const directories = allRecords.filter(record => parseInt(record.isdir) === 1);
            const files = allRecords.filter(record => parseInt(record.isdir) === 0);
            totalDirectories += directories.length;

            debugLog(`[${parentDir.name}] 内容获取完成，总页数：${page - 1}，总记录数：${allRecords.length}，目录数：${directories.length}，文件数：${files.length}`);

            // 先添加文件到父目录
            files.forEach(record => {
                const childFile = {
                    name: record.server_filename,
                    fs_id: record.fs_id,
                    size: record.size || 0,
                    children: [],
                    level: currentDepth + 1,
                    parentLevel: currentDepth,
                    isDir: false
                };
                debugLog(`添加文件：${childFile.name}，大小：${childFile.size}`);
                parentDir.children.push(childFile);
            });

            // 然后处理目录
            const promises = directories.map(async record => {
                const childDir = {
                    name: record.server_filename,
                    fs_id: record.fs_id,
                    children: [],
                    level: currentDepth + 1,
                    parentLevel: currentDepth,
                    isDir: true
                };
                debugLog(`创建子目录：${childDir.name}，层级：${childDir.level}`);
                parentDir.children.push(childDir);

                if (currentDepth + 1 < depth) {
                    await fetchDirContent(childDir, currentDepth + 1);
                }

                processedDirectories++;
                progressBar.updateProgress(processedDirectories, totalDirectories);
            });

            await Promise.all(promises);
        }

        try {
            await fetchDirContent(result, 0);
            debugLog('目录获取完成', result);
            progressBar.updateText('目录获取完成！');
            setTimeout(() => progressBar.hide(), 2000);

            return {
                tree: result,
                startTime: startTime
            };
        } finally {
            progressBar.remove();
            result = null;
            cleanup();
        }
    }

    // 添加清理文件名的函数
    function cleanFileName(name) {
        // 移除零宽空格和其他不可见字符
        return name.replace(/[\u200b\u200c\u200d\u200e\u200f\ufeff]/g, '');
    }

    // 格式化目录树
    function formatDirItem(node, prefix = '', isLastArray = []) {
        if (node.isRoot) {
            result += `${cleanFileName(node.name)}/\n`;
            if (node.children && node.children.length > 0) {
                node.children.forEach((child, index) => {
                    const isLast = index === node.children.length - 1;
                    formatDirItem(child, '', [isLast]);
                });
            }
        } else {
            const connector = isLastArray[isLastArray.length - 1] ? SYMBOLS.last : SYMBOLS.tee;
            const cleanName = cleanFileName(node.name);
            result += `${prefix}${connector}${cleanName}\n`;

            if (node.children && node.children.length > 0) {
                node.children.forEach((child, index) => {
                    const isLast = index === node.children.length - 1;
                    const newPrefix = prefix + (isLastArray[isLastArray.length - 1] ? SYMBOLS.space : SYMBOLS.branch);
                    formatDirItem(child, newPrefix, [...isLastArray, isLast]);
                });
            }
        }
    }

    function formatDirectoryTree(dir) {
        const formatStartTime = performance.now();
        const SYMBOLS = {
            space:  '    ',
            branch: '│   ',
            tee:    '├──',
            last:   '└──'
        };

        let result = '';
        const currentTime = new Date().toLocaleString();

        // 添加标题和信息头
        result += `目录结构导出清单\n`;
        result += `导出时间：${currentTime}\n`;
        result += `根目录：${dir.name}\n`;
        result += `${'='.repeat(50)}\n\n`;

        // 内部函数，用于格式化目录
        function formatDir(node, prefix = '', isLastArray = []) {
            if (node.isRoot) {
                result += `${cleanFileName(node.name)}\n`;
                if (node.children && node.children.length > 0) {
                    node.children.forEach((child, index) => {
                        const isLast = index === node.children.length - 1;
                        formatDir(child, '', [isLast]);
                    });
                }
            } else {
                const connector = isLastArray[isLastArray.length - 1] ? SYMBOLS.last : SYMBOLS.tee;
                const itemName = node.isDir ? `${cleanFileName(node.name)}/` : cleanFileName(node.name);
                const sizeInfo = !node.isDir && node.size ? ` (${formatSize(node.size)})` : '';
                result += `${prefix}${connector}${itemName}${sizeInfo}\n`;

                if (node.children && node.children.length > 0) {
                    node.children.forEach((child, index) => {
                        const isLast = index === node.children.length - 1;
                        const newPrefix = prefix + (isLastArray[isLastArray.length - 1] ? SYMBOLS.space : SYMBOLS.branch);
                        formatDir(child, newPrefix, [...isLastArray, isLast]);
                    });
                }
            }
        }

        formatDir(dir, '', []);

        const endTime = performance.now();
        const formatTime = ((endTime - formatStartTime) / 1000).toFixed(2); // 格式化耗时
        const totalTime = ((endTime - (dir.startTime || formatStartTime)) / 1000).toFixed(2); // 总耗时

        // 统计文件和目录数量
        let fileCount = 0;
        let dirCount = 0;
        let totalSize = 0;

        function countItems(node) {
            if (!node.isRoot) {
                if (node.isDir) {
                    dirCount++;
                } else {
                    fileCount++;
                    totalSize += node.size || 0;
                }
            }
            if (node.children && node.children.length > 0) {
                node.children.forEach(countItems);
            }
        }

        countItems(dir);

        // 添加页脚和统计信息
        result += `\n${'='.repeat(50)}\n`;
        result += `统计信息：\n`;
        result += `目录数量：${dirCount} 个\n`;
        result += `文件数量：${fileCount} 个\n`;
        if (fileCount > 0) {
            result += `文件大小：${formatSize(totalSize)}\n`;
        }
        result += `总项目数：${dirCount + fileCount} 个\n`;
        result += `格式化耗时：${formatTime} 秒\n`;
        if (dir.startTime) {
            result += `总处理耗时：${totalTime} 秒\n`;
        }

        return result;
    }

    // 格式化多个目录树
    function formatMultipleDirectoryTrees(dirResults) {
        const formatStartTime = performance.now();
        const SYMBOLS = {
            space:  '    ',
            branch: '│   ',
            tee:    '├──',
            last:   '└──'
        };

        let result = '';
        const currentTime = new Date().toLocaleString();

        // 添加标题和信息头
        result += `多目录结构导出清单\n`;
        result += `导出时间：${currentTime}\n`;
        result += `目录数量：${dirResults.length} 个\n`;
        result += `${'='.repeat(50)}\n\n`;

        let totalDirCount = 0;
        let totalProcessingTime = 0;

        // 逐个处理每个目录
        dirResults.forEach((dirResult, index) => {
            const { title, result: dirData } = dirResult;
            const dir = dirData.tree;

            // 添加目录标题
            result += `${index + 1}. ${title}\n`;
            result += `${'-'.repeat(50)}\n`;

            // 内部函数，用于格式化目录
            function formatDir(node, prefix = '', isLastArray = []) {
                if (node.isRoot) {
                    if (node.children && node.children.length > 0) {
                        node.children.forEach((child, index) => {
                            const isLast = index === node.children.length - 1;
                            formatDir(child, '', [isLast]);
                        });
                    } else {
                        result += `(空目录)\n`;
                    }
                } else {
                    const connector = isLastArray[isLastArray.length - 1] ? SYMBOLS.last : SYMBOLS.tee;
                    const itemName = node.isDir ? `${cleanFileName(node.name)}/` : cleanFileName(node.name);
                    const sizeInfo = !node.isDir && node.size ? ` (${formatSize(node.size)})` : '';
                    result += `${prefix}${connector}${itemName}${sizeInfo}\n`;

                    if (node.children && node.children.length > 0) {
                        node.children.forEach((child, index) => {
                            const isLast = index === node.children.length - 1;
                            const newPrefix = prefix + (isLastArray[isLastArray.length - 1] ? SYMBOLS.space : SYMBOLS.branch);
                            formatDir(child, newPrefix, [...isLastArray, isLast]);
                        });
                    }
                }
            }

            formatDir(dir, '', []);

            // 添加当前目录的统计信息
            let dirCount = 0;
            let fileCount = 0;

            function countItems(node) {
                if (!node.isRoot) {
                    if (node.isDir) {
                        dirCount++;
                    } else {
                        fileCount++;
                    }
                }
                if (node.children && node.children.length > 0) {
                    node.children.forEach(countItems);
                }
            }

            countItems(dir);
            totalDirCount += dirCount;

            if (dir.startTime) {
                const processingTime = (performance.now() - dir.startTime) / 1000;
                totalProcessingTime += processingTime;
            }

            result += `\n`;

            // 如果不是最后一个目录，添加分隔线
            if (index < dirResults.length - 1) {
                result += `${'-'.repeat(50)}\n\n`;
            }
        });

        const endTime = performance.now();
        const formatTime = ((endTime - formatStartTime) / 1000).toFixed(2);

        // 添加总统计信息
        result += `\n${'='.repeat(50)}\n`;
        result += `总统计信息：\n`;
        result += `处理目录数：${dirResults.length} 个\n`;
        result += `总子目录数：${totalDirCount} 个\n`;
        result += `格式化耗时：${formatTime} 秒\n`;
        result += `总处理耗时：${(totalProcessingTime + parseFloat(formatTime)).toFixed(2)} 秒\n`;

        return result;
    }

    // 添加统计目录数量的辅助函数
    function countDirectories(dir) {
        let count = 0;

        function traverse(node) {
            if (!node.isRoot && node.isDir) {
                count++;
            }
            if (node.children && node.children.length > 0) {
                node.children.forEach(traverse);
            }
        }

        traverse(dir);
        return count;
    }

    // 保存为 TXT 文件
    function saveAsTxt(content, title) {
        const blob = new Blob([content], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${title}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log(`已保存文件: ${title}.txt`);
    }

    // 添加获取全部内容的函数
    async function fetchAllContent(uk, msgId, fsId, gid, title, depth) {
        const startTime = performance.now();
        const progressBar = createProgressBar();
        progressBar.show();

        let result = {
            name: title,
            children: [],
            level: 0,
            isRoot: true,
            startTime: startTime
        };

        let totalItems = 0;
        let processedItems = 0;

        async function fetchContent(parentDir, currentDepth) {
            if (currentDepth >= depth) return;

            let page = 1;
            let hasMore = true;
            const allRecords = [];
            const maxRetries = 3;
            const requestPool = new RequestPool(2, 3000);

            while (hasMore) {
                progressBar.updateText(`正在获取 "${parentDir.name}" 的第 ${page} 页数据...`);
                console.log(`[${parentDir.name}] 正在获取第 ${page} 页数据...`);

                const url = `https://pan.baidu.com/mbox/msg/shareinfo?from_uk=${encodeURIComponent(uk)}&msg_id=${encodeURIComponent(msgId)}&type=2&num=100&page=${page}&fs_id=${encodeURIComponent(parentDir.fs_id || fsId)}&gid=${encodeURIComponent(gid)}&limit=100&desc=1&clienttype=0&app_id=250528&web=1`;

                let retryCount = 0;
                let success = false;

                while (retryCount < maxRetries && !success) {
                    try {
                        const data = await requestPool.add(async () => {
                            const response = await fetch(url, {
                                timeout: 30000,
                                headers: {
                                    'Cache-Control': 'no-cache',
                                    'Pragma': 'no-cache'
                                }
                            });
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.json();
                        });

                        if (data.errno !== 0) {
                            throw new Error(`API error: ${data.errno}`);
                        }

                        allRecords.push(...data.records);
                        hasMore = data.has_more === 1;
                        success = true;

                        console.log(`[${parentDir.name}] 第 ${page} 页获取成功，本页记录数: ${data.records.length}，hasMore: ${hasMore}`);
                    } catch (error) {
                        retryCount++;
                        console.error(`[${parentDir.name}] 页面 ${page} 获取失败 (${retryCount}/${maxRetries})`);

                        if (retryCount < maxRetries) {
                            const delay = Math.min(1000 * Math.pow(2, retryCount), 10000); // 指数退避策略
                            progressBar.updateText(`请求失败，${delay/1000}秒后重试...`);
                            await new Promise(resolve => setTimeout(resolve, delay));
                        } else {
                            progressBar.updateText(`获取 "${parentDir.name}" 第 ${page} 页失败，跳过...`);
                            console.error(`[${parentDir.name}] 达到重试上限，跳过`);
                            hasMore = false;
                        }
                    }
                }

                if (success) {
                    page++;
                    // 成功后也适当延迟，避免请求过快
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }

            // 处理所有记录（包括文件和目录）
            totalItems += allRecords.length;

            const promises = allRecords.map(async record => {
                const childItem = {
                    name: record.server_filename,
                    fs_id: record.fs_id,
                    isDir: parseInt(record.isdir) === 1,
                    size: record.size,
                    children: [],
                    level: currentDepth + 1,
                    parentLevel: currentDepth
                };
                parentDir.children.push(childItem);

                if (childItem.isDir && currentDepth + 1 < depth) {
                    await fetchContent(childItem, currentDepth + 1);
                }

                processedItems++;
                progressBar.updateProgress(processedItems, totalItems);
            });

            await Promise.all(promises);
        }

        try {
            await fetchContent(result, 0);
            progressBar.updateText('内容获取完成！');
            setTimeout(() => progressBar.hide(), 2000);

            return {
                tree: result,
                startTime: startTime
            };
        } finally {
            progressBar.remove();
            result = null;
            cleanup();
        }
    }

    function formatAllContent(dir) {
        const formatStartTime = performance.now();
        let result = '';
        const currentTime = new Date().toLocaleString();

        const SYMBOLS = {
            space:  '    ',
            branch: '│   ',
            tee:    '├──',
            last:   '└──'
        };

        result += `完整目录结构导出清单\n`;
        result += `导出时间：${currentTime}\n`;
        result += `根目录：${dir.name}\n`;
        result += `${'='.repeat(50)}\n\n`;

        let fileCount = 0;
        let dirCount = 0;
        let totalSize = 0;

        function formatItem(node, prefix = '', isLastArray = []) {
            if (node.isRoot) {
                result += `${cleanFileName(node.name)}/\n`;
                if (node.children && node.children.length > 0) {
                    node.children.forEach((child, index) => {
                        const isLast = index === node.children.length - 1;
                        formatItem(child, '', [isLast]);
                    });
                }
            } else {
                const connector = isLastArray[isLastArray.length - 1] ? SYMBOLS.last : SYMBOLS.tee;
                const cleanName = cleanFileName(node.name);
                const itemName = node.isDir ? `${cleanName}/` : cleanName;
                const size = !node.isDir ? ` (${formatSize(node.size)})` : '';

                result += `${prefix}${connector}${itemName}${size}\n`;

                if (node.isDir) {
                    dirCount++;
                } else {
                    fileCount++;
                    totalSize += node.size || 0;
                }

                if (node.children && node.children.length > 0) {
                    node.children.forEach((child, index) => {
                        const isLast = index === node.children.length - 1;
                        const newPrefix = prefix + (isLastArray[isLastArray.length - 1] ? SYMBOLS.space : SYMBOLS.branch);
                        formatItem(child, newPrefix, [...isLastArray, isLast]);
                    });
                }
            }
        }

        formatItem(dir, '', []);

        const endTime = performance.now();
        const formatTime = ((endTime - formatStartTime) / 1000).toFixed(2);
        const totalTime = ((endTime - dir.startTime) / 1000).toFixed(2);

        result += `\n${'='.repeat(50)}\n`;
        result += `统计信息：\n`;
        result += `目录数量：${dirCount}\n`;
        result += `文件数量：${fileCount}\n`;
        result += `文件大小：${formatSize(totalSize)}\n`;
        result += `处理总计：${dirCount + fileCount} 个项目\n`;
        result += `格式化耗时：${formatTime} 秒\n`;
        result += `总处理耗时：${totalTime} 秒\n`;

        return result;
    }

    // 格式化多个目录的所有内容
    function formatMultipleAllContent(dirResults) {
        const formatStartTime = performance.now();
        let result = '';
        const currentTime = new Date().toLocaleString();

        const SYMBOLS = {
            space:  '    ',
            branch: '│   ',
            tee:    '├──',
            last:   '└──'
        };

        result += `多目录完整结构导出清单\n`;
        result += `导出时间：${currentTime}\n`;
        result += `目录数量：${dirResults.length} 个\n`;
        result += `${'='.repeat(50)}\n\n`;

        let totalFileCount = 0;
        let totalDirCount = 0;
        let totalSize = 0;
        let totalProcessingTime = 0;

        // 逐个处理每个目录
        dirResults.forEach((dirResult, index) => {
            const { title, result: dirData } = dirResult;
            const dir = dirData.tree;

            // 添加目录标题
            result += `${index + 1}. ${title}\n`;
            result += `${'-'.repeat(50)}\n`;

            let fileCount = 0;
            let dirCount = 0;
            let dirSize = 0;

            function formatItem(node, prefix = '', isLastArray = []) {
                if (node.isRoot) {
                    if (node.children && node.children.length > 0) {
                        node.children.forEach((child, index) => {
                            const isLast = index === node.children.length - 1;
                            formatItem(child, '', [isLast]);
                        });
                    } else {
                        result += `(空目录)\n`;
                    }
                } else {
                    const connector = isLastArray[isLastArray.length - 1] ? SYMBOLS.last : SYMBOLS.tee;
                    const cleanName = cleanFileName(node.name);
                    const itemName = node.isDir ? `${cleanName}/` : cleanName;
                    const size = !node.isDir ? ` (${formatSize(node.size)})` : '';

                    result += `${prefix}${connector}${itemName}${size}\n`;

                    if (node.isDir) {
                        dirCount++;
                    } else {
                        fileCount++;
                        dirSize += node.size || 0;
                    }

                    if (node.children && node.children.length > 0) {
                        node.children.forEach((child, index) => {
                            const isLast = index === node.children.length - 1;
                            const newPrefix = prefix + (isLastArray[isLastArray.length - 1] ? SYMBOLS.space : SYMBOLS.branch);
                            formatItem(child, newPrefix, [...isLastArray, isLast]);
                        });
                    }
                }
            }

            formatItem(dir, '', []);

            // 添加当前目录的统计信息
            result += `\n当前目录统计: 目录 ${dirCount} 个, 文件 ${fileCount} 个, 总大小 ${formatSize(dirSize)}\n`;

            totalDirCount += dirCount;
            totalFileCount += fileCount;
            totalSize += dirSize;

            if (dir.startTime) {
                const processingTime = (performance.now() - dir.startTime) / 1000;
                totalProcessingTime += processingTime;
            }

            // 如果不是最后一个目录，添加分隔线
            if (index < dirResults.length - 1) {
                result += `\n${'-'.repeat(50)}\n\n`;
            }
        });

        const endTime = performance.now();
        const formatTime = ((endTime - formatStartTime) / 1000).toFixed(2);

        // 添加总统计信息
        result += `\n${'='.repeat(50)}\n`;
        result += `总统计信息：\n`;
        result += `处理目录数：${dirResults.length} 个\n`;
        result += `总目录数量：${totalDirCount} 个\n`;
        result += `总文件数量：${totalFileCount} 个\n`;
        result += `总文件大小：${formatSize(totalSize)}\n`;
        result += `总项目数量：${totalDirCount + totalFileCount} 个\n`;
        result += `格式化耗时：${formatTime} 秒\n`;
        result += `总处理耗时：${(totalProcessingTime + parseFloat(formatTime)).toFixed(2)} 秒\n`;

        return result;
    }

    function formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function cleanup() {
        const progressBar = document.getElementById('directory-progress');
        if (progressBar && progressBar.parentNode) {
            progressBar.parentNode.removeChild(progressBar);
        }
    }

    function saveAsExcel(data, title) {
        const wb = XLSX.utils.book_new();

        const excelData = [];

        excelData.push(['目录结构导出清单']);
        excelData.push([`导出时间: ${new Date().toLocaleString()}`]);

        let fileCount = 0;
        let dirCount = 0;
        let totalSize = 0;

        function countItems(node) {
            if (!node.isRoot) {
                if (node.isDir !== false) { // 目录或者没有isDir属性的节点（兼容旧数据）
                    dirCount++;
                } else {
                    fileCount++;
                    totalSize += node.size || 0;
                }
            }
            if (node.children && node.children.length > 0) {
                node.children.forEach(countItems);
            }
        }

        countItems(data.tree);

        excelData.push(['统计信息']);
        excelData.push([`目录数量: ${dirCount}`]);
        if (fileCount > 0) {
            excelData.push([`文件数量: ${fileCount}`]);
            excelData.push([`文件大小: ${formatSize(totalSize)}`]);
            excelData.push([`处理总计: ${dirCount + fileCount} 个项目`]);
        }
        excelData.push([`格式化耗时: ${((performance.now() - data.startTime) / 1000).toFixed(2)} 秒`]);
        excelData.push(['']);

        function getMaxDepth(node, currentDepth = 0) {
            if (!node.children || node.children.length === 0) {
                return currentDepth;
            }
            return Math.max(...node.children.map(child =>
                getMaxDepth(child, currentDepth + 1)
            ));
        }

        const actualDepth = Math.min(depthSetting, getMaxDepth(data.tree) + 1);

        // 改为显示项目名称、类型和大小的表格格式
        excelData.push(['项目名称', '类型', '大小', '路径']);

        const allRows = [];

        function extractNumber(str) {
            const match = str.match(/^(\d+)\./);
            return match ? parseInt(match[1]) : Infinity;
        }

        function compareItems(a, b) {
            const numA = extractNumber(a.name);
            const numB = extractNumber(b.name);

            if (numA !== numB) {
                return numA - numB;
            }

            return a.name.localeCompare(b.name, 'zh-CN');
        }

        function processNode(node, path = '') {
            if (!node.isRoot) {
                const currentPath = path ? `${path}/${node.name}` : node.name;
                const itemType = node.isDir !== false ? '目录' : '文件';
                const itemSize = node.isDir !== false ? '' : formatSize(node.size || 0);

                allRows.push([node.name, itemType, itemSize, currentPath]);

                if (node.children && node.children.length > 0) {
                    const sortedChildren = [...node.children].sort(compareItems);
                    sortedChildren.forEach(child => {
                        processNode(child, currentPath);
                    });
                }
            } else {
                if (node.children && node.children.length > 0) {
                    const sortedChildren = [...node.children].sort(compareItems);
                    sortedChildren.forEach(child => {
                        processNode(child, '');
                    });
                }
            }
        }

        processNode(data.tree);

        excelData.push(...allRows);

        const ws = XLSX.utils.aoa_to_sheet(excelData);

        // 设置列宽：项目名称、类型、大小、路径
        ws['!cols'] = [
            { wch: 40 },  // 项目名称
            { wch: 10 },  // 类型
            { wch: 15 },  // 大小
            { wch: 60 }   // 路径
        ];

        ws['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },  // 标题行
            { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },  // 时间行
            { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } },  // 统计信息标题
            { s: { r: 3, c: 0 }, e: { r: 3, c: 3 } },  // 目录数量
        ];

        if (fileCount > 0) {
            ws['!merges'].push(
                { s: { r: 4, c: 0 }, e: { r: 4, c: 3 } },  // 文件数量
                { s: { r: 5, c: 0 }, e: { r: 5, c: 3 } },  // 文件大小
                { s: { r: 6, c: 0 }, e: { r: 6, c: 3 } },  // 处理总计
                { s: { r: 7, c: 0 }, e: { r: 7, c: 3 } },  // 格式化耗时
                { s: { r: 8, c: 0 }, e: { r: 8, c: 3 } }   // 空行
            );
        } else {
            ws['!merges'].push(
                { s: { r: 4, c: 0 }, e: { r: 4, c: 3 } },  // 格式化耗时
                { s: { r: 5, c: 0 }, e: { r: 5, c: 3 } }   // 空行
            );
        }

        XLSX.utils.book_append_sheet(wb, ws, '目录结构');

        XLSX.writeFile(wb, `${title}.xlsx`);
    }

    // 将多个目录导出为Excel
    function saveMultipleAsExcel(dirResults, title) {
        const wb = XLSX.utils.book_new();
        const startTime = performance.now();

        // 创建汇总表格
        const summaryData = [];
        const currentTime = new Date().toLocaleString();

        summaryData.push(['多目录结构导出清单']);
        summaryData.push([`导出时间: ${currentTime}`]);
        summaryData.push([`目录数量: ${dirResults.length} 个`]);
        summaryData.push(['']);

        // 添加目录汇总表头
        summaryData.push(['序号', '目录名称', '子目录数量', '处理耗时(秒)']);

        let totalDirCount = 0;
        let totalProcessingTime = 0;

        // 逐个处理每个目录，并添加到汇总表
        dirResults.forEach((dirResult, index) => {
            const { title, result: dirData } = dirResult;
            const dir = dirData.tree;

            // 统计子目录数量
            const dirCount = countDirectories(dir);
            totalDirCount += dirCount;

            // 计算处理时间
            let processingTime = 0;
            if (dir.startTime) {
                processingTime = (performance.now() - dir.startTime) / 1000;
                totalProcessingTime += processingTime;
            }

            // 添加到汇总表
            summaryData.push([index + 1, title, dirCount, processingTime.toFixed(2)]);

            // 为每个目录创建一个单独的工作表
            createDirectoryWorksheet(wb, dir, title);
        });

        // 添加总统计信息
        summaryData.push(['']);
        summaryData.push(['统计信息']);
        summaryData.push([`总目录数: ${dirResults.length} 个`]);
        summaryData.push([`总子目录数: ${totalDirCount} 个`]);

        const endTime = performance.now();
        const formatTime = ((endTime - startTime) / 1000).toFixed(2);

        summaryData.push([`格式化耗时: ${formatTime} 秒`]);
        summaryData.push([`总处理耗时: ${(totalProcessingTime + parseFloat(formatTime)).toFixed(2)} 秒`]);

        // 创建汇总工作表
        const ws = XLSX.utils.aoa_to_sheet(summaryData);

        // 设置列宽
        ws['!cols'] = [
            { wch: 8 },   // 序号
            { wch: 40 },  // 目录名称
            { wch: 15 },  // 子目录数量
            { wch: 15 }   // 处理耗时
        ];

        // 设置合并单元格
        ws['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },  // 标题行
            { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },  // 时间行
            { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } },  // 目录数量行
            { s: { r: 3, c: 0 }, e: { r: 3, c: 3 } },  // 空行
            { s: { r: summaryData.length - 6, c: 0 }, e: { r: summaryData.length - 6, c: 3 } }, // 空行
            { s: { r: summaryData.length - 5, c: 0 }, e: { r: summaryData.length - 5, c: 3 } }, // 统计信息标题
            { s: { r: summaryData.length - 4, c: 0 }, e: { r: summaryData.length - 4, c: 3 } }, // 总目录数
            { s: { r: summaryData.length - 3, c: 0 }, e: { r: summaryData.length - 3, c: 3 } }, // 总子目录数
            { s: { r: summaryData.length - 2, c: 0 }, e: { r: summaryData.length - 2, c: 3 } }, // 格式化耗时
            { s: { r: summaryData.length - 1, c: 0 }, e: { r: summaryData.length - 1, c: 3 } }  // 总处理耗时
        ];

        // 将汇总工作表添加到工作簿
        XLSX.utils.book_append_sheet(wb, ws, '目录汇总');

        // 导出Excel文件
        XLSX.writeFile(wb, `${title}.xlsx`);

        // 创建单个目录的工作表的内部函数
        function createDirectoryWorksheet(wb, dir, sheetTitle) {
            const excelData = [];

            excelData.push([`目录: ${dir.name}`]);

            let dirCount = 0;

            function countItems(node) {
                if (!node.isRoot && node.isDir) {
                    dirCount++;
                }
                if (node.children && node.children.length > 0) {
                    node.children.forEach(countItems);
                }
            }

            countItems(dir);

            excelData.push([`子目录数量: ${dirCount}`]);
            excelData.push(['']);

            function getMaxDepth(node, currentDepth = 0) {
                if (!node.children || node.children.length === 0) {
                    return currentDepth;
                }
                return Math.max(...node.children.map(child =>
                    getMaxDepth(child, currentDepth + 1)
                ));
            }

            const actualDepth = Math.min(depthSetting, getMaxDepth(dir) + 1);

            const headers = [];
            for (let i = 1; i <= actualDepth; i++) {
                headers.push(`${i}级目录`);
            }
            excelData.push(headers);

            const allRows = [];

            function processNode(node, level = 0, parentRow = []) {
                if (level >= actualDepth) return;

                const currentRow = [...parentRow];

                if (!node.isRoot) {
                    currentRow[level] = node.name;
                    allRows.push([...currentRow]);
                }

                if (node.children && node.children.length > 0) {
                    if (node.isRoot) {
                        node.children.sort(compareItems);
                        node.children.forEach(child => {
                            const newRow = new Array(actualDepth).fill('');
                            newRow[0] = child.name;
                            allRows.push([...newRow]);

                            if (child.children && child.children.length > 0) {
                                child.children.sort(compareItems);
                                child.children.forEach(grandChild => {
                                    processNode(grandChild, 1, newRow);
                                });
                            }
                        });
                    } else {
                        node.children.sort(compareItems);
                        node.children.forEach(child => {
                            processNode(child, level + 1, currentRow);
                        });
                    }
                }
            }

            processNode(dir, 0, new Array(actualDepth).fill(''));

            excelData.push(...allRows);

            const ws = XLSX.utils.aoa_to_sheet(excelData);

            const colWidths = [];
            for (let i = 0; i < actualDepth; i++) {
                colWidths.push({ wch: 45 });
            }
            ws['!cols'] = colWidths;

            ws['!merges'] = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: actualDepth - 1 } },  // 目录名称
                { s: { r: 1, c: 0 }, e: { r: 1, c: actualDepth - 1 } },  // 子目录数量
                { s: { r: 2, c: 0 }, e: { r: 2, c: actualDepth - 1 } }   // 空行
            ];

            // 工作表名称不能超过31个字符，如果超过需要截断
            let safeSheetName = sheetTitle;
            if (safeSheetName.length > 28) {
                safeSheetName = safeSheetName.substring(0, 25) + '...';
            }

            // 添加工作表到工作簿
            XLSX.utils.book_append_sheet(wb, ws, safeSheetName);
        }
    }

    // 将多个目录的所有内容导出为Excel
    function saveMultipleAllAsExcel(dirResults, title) {
        const wb = XLSX.utils.book_new();
        const startTime = performance.now();

        // 创建汇总表格
        const summaryData = [];
        const currentTime = new Date().toLocaleString();

        summaryData.push(['多目录完整结构导出清单']);
        summaryData.push([`导出时间: ${currentTime}`]);
        summaryData.push([`目录数量: ${dirResults.length} 个`]);
        summaryData.push(['']);

        // 添加目录汇总表头
        summaryData.push(['序号', '目录名称', '子目录数量', '文件数量', '总大小', '处理耗时(秒)']);

        let totalDirCount = 0;
        let totalFileCount = 0;
        let totalSize = 0;
        let totalProcessingTime = 0;

        // 逐个处理每个目录，并添加到汇总表
        dirResults.forEach((dirResult, index) => {
            const { title, result: dirData } = dirResult;
            const dir = dirData.tree;

            // 统计目录和文件数量
            let dirCount = 0;
            let fileCount = 0;
            let dirSize = 0;

            function countItems(node) {
                if (!node.isRoot) {
                    if (node.isDir) {
                        dirCount++;
                    } else {
                        fileCount++;
                        dirSize += node.size || 0;
                    }
                }
                if (node.children && node.children.length > 0) {
                    node.children.forEach(countItems);
                }
            }

            countItems(dir);

            totalDirCount += dirCount;
            totalFileCount += fileCount;
            totalSize += dirSize;

            // 计算处理时间
            let processingTime = 0;
            if (dir.startTime) {
                processingTime = (performance.now() - dir.startTime) / 1000;
                totalProcessingTime += processingTime;
            }

            // 添加到汇总表
            summaryData.push([
                index + 1,
                title,
                dirCount,
                fileCount,
                formatSize(dirSize),
                processingTime.toFixed(2)
            ]);

            // 为每个目录创建一个单独的工作表
            createAllContentWorksheet(wb, dir, title);
        });

        // 添加总统计信息
        summaryData.push(['']);
        summaryData.push(['统计信息']);
        summaryData.push([`总目录数: ${dirResults.length} 个`]);
        summaryData.push([`总子目录数: ${totalDirCount} 个`]);
        summaryData.push([`总文件数: ${totalFileCount} 个`]);
        summaryData.push([`总文件大小: ${formatSize(totalSize)}`]);

        const endTime = performance.now();
        const formatTime = ((endTime - startTime) / 1000).toFixed(2);

        summaryData.push([`格式化耗时: ${formatTime} 秒`]);
        summaryData.push([`总处理耗时: ${(totalProcessingTime + parseFloat(formatTime)).toFixed(2)} 秒`]);

        // 创建汇总工作表
        const ws = XLSX.utils.aoa_to_sheet(summaryData);

        // 设置列宽
        ws['!cols'] = [
            { wch: 8 },   // 序号
            { wch: 30 },  // 目录名称
            { wch: 12 },  // 子目录数量
            { wch: 12 },  // 文件数量
            { wch: 15 },  // 总大小
            { wch: 15 }   // 处理耗时
        ];

        // 设置合并单元格
        ws['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },  // 标题行
            { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },  // 时间行
            { s: { r: 2, c: 0 }, e: { r: 2, c: 5 } },  // 目录数量行
            { s: { r: 3, c: 0 }, e: { r: 3, c: 5 } },  // 空行
            { s: { r: summaryData.length - 8, c: 0 }, e: { r: summaryData.length - 8, c: 5 } }, // 空行
            { s: { r: summaryData.length - 7, c: 0 }, e: { r: summaryData.length - 7, c: 5 } }, // 统计信息标题
            { s: { r: summaryData.length - 6, c: 0 }, e: { r: summaryData.length - 6, c: 5 } }, // 总目录数
            { s: { r: summaryData.length - 5, c: 0 }, e: { r: summaryData.length - 5, c: 5 } }, // 总子目录数
            { s: { r: summaryData.length - 4, c: 0 }, e: { r: summaryData.length - 4, c: 5 } }, // 总文件数
            { s: { r: summaryData.length - 3, c: 0 }, e: { r: summaryData.length - 3, c: 5 } }, // 总文件大小
            { s: { r: summaryData.length - 2, c: 0 }, e: { r: summaryData.length - 2, c: 5 } }, // 格式化耗时
            { s: { r: summaryData.length - 1, c: 0 }, e: { r: summaryData.length - 1, c: 5 } }  // 总处理耗时
        ];

        // 将汇总工作表添加到工作簿
        XLSX.utils.book_append_sheet(wb, ws, '目录汇总');

        // 导出Excel文件
        XLSX.writeFile(wb, `${title}.xlsx`);

        // 创建单个目录的完整内容工作表的内部函数
        function createAllContentWorksheet(wb, dir, sheetTitle) {
            const excelData = [];

            excelData.push([`目录: ${dir.name}`]);

            let dirCount = 0;
            let fileCount = 0;
            let totalSize = 0;

            function countItems(node) {
                if (!node.isRoot) {
                    if (node.isDir) {
                        dirCount++;
                    } else {
                        fileCount++;
                        totalSize += node.size || 0;
                    }
                }
                if (node.children && node.children.length > 0) {
                    node.children.forEach(countItems);
                }
            }

            countItems(dir);

            excelData.push([`子目录数量: ${dirCount}`]);
            excelData.push([`文件数量: ${fileCount}`]);
            excelData.push([`总大小: ${formatSize(totalSize)}`]);
            excelData.push(['']);

            // 添加表头
            excelData.push(['项目名称', '类型', '大小']);

            const allRows = [];

            function processNode(node, prefix = '') {
                if (!node.isRoot) {
                    const itemName = prefix + node.name;
                    const itemType = node.isDir ? '目录' : '文件';
                    const itemSize = node.isDir ? '' : formatSize(node.size || 0);
                    allRows.push([itemName, itemType, itemSize]);
                }

                if (node.children && node.children.length > 0) {
                    const newPrefix = node.isRoot ? '' : prefix + '  ';
                    node.children.forEach(child => {
                        processNode(child, newPrefix);
                    });
                }
            }

            processNode(dir);

            excelData.push(...allRows);

            const ws = XLSX.utils.aoa_to_sheet(excelData);

            // 设置列宽
            ws['!cols'] = [
                { wch: 60 },  // 项目名称
                { wch: 10 },  // 类型
                { wch: 15 }   // 大小
            ];

            ws['!merges'] = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },  // 目录名称
                { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } },  // 子目录数量
                { s: { r: 2, c: 0 }, e: { r: 2, c: 2 } },  // 文件数量
                { s: { r: 3, c: 0 }, e: { r: 3, c: 2 } },  // 总大小
                { s: { r: 4, c: 0 }, e: { r: 4, c: 2 } }   // 空行
            ];

            // 工作表名称不能超过31个字符，如果超过需要截断
            let safeSheetName = sheetTitle;
            if (safeSheetName.length > 28) {
                safeSheetName = safeSheetName.substring(0, 25) + '...';
            }

            // 添加工作表到工作簿
            XLSX.utils.book_append_sheet(wb, ws, safeSheetName);
        }
    }

    waitForLibraryElements();
})();

