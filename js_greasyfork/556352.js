// ==UserScript==
// @name         GitHub 仓库下载器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在 GitHub 代码页面添加下载功能，支持选择性下载文件和目录为 ZIP 格式，支持递归下载子目录
// @author       GitHub Downloader
// @match        https://github.com/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.9.1/jszip.min.js
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556352/GitHub%20%E4%BB%93%E5%BA%93%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/556352/GitHub%20%E4%BB%93%E5%BA%93%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局日志开关（使用 window 对象，可在控制台动态切换）
    // 使用方法：在浏览器控制台输入 window.GITHUB_DOWNLOADER_DEBUG = true/false
    if (typeof window.GITHUB_DOWNLOADER_DEBUG === 'undefined') {
        window.GITHUB_DOWNLOADER_DEBUG = false;
    }

    const log = (msg) => {
        if (window.GITHUB_DOWNLOADER_DEBUG) {
            console.log(`[GitHub下载器] ${new Date().toLocaleTimeString()}: ${msg}`);
        }
    };

    const error = (msg) => {
        if (window.GITHUB_DOWNLOADER_DEBUG) {
            console.error(`[GitHub下载器] ${new Date().toLocaleTimeString()}: ${msg}`);
        }
    };

    // 检查是否是代码页面
    function isCodePage() {
        const url = window.location.href;
        // 检查是否是仓库代码页面（排除 issues, pulls, releases 等）
        // 匹配: github.com/owner/repo 或 github.com/owner/repo/tree/branch 或 github.com/owner/repo/blob/branch/path
        const isRepo = /github\.com\/[^\/]+\/[^\/]+(?:\/(?:tree|blob)\/[^\/]+)?(?:\/.*)?$/.test(url);
        const notSpecialPage = !/\/(issues|pulls|releases|wiki|discussions|projects|security|settings|actions)/.test(url);
        const result = isRepo && notSpecialPage;
        log(`isCodePage 检查: URL=${url}, isRepo=${isRepo}, notSpecialPage=${notSpecialPage}, result=${result}`);
        return result;
    }

    // 获取或提示输入 GitHub Token
    function getGitHubToken() {
        let token = GM_getValue('github_token', '');
        
        if (!token) {
            const input = prompt('请输入 GitHub Personal Access Token（可选，用于提高 API 速率限制）:\n\n如果不输入，将使用未认证请求（限制 60 次/小时）\n\n获取 Token: https://github.com/settings/tokens');
            if (input) {
                GM_setValue('github_token', input);
                token = input;
                log(`GitHub Token 已保存`);
            }
        }
        
        return token;
    }

    // 解析 GitHub URL 获取仓库信息
    function parseGitHubUrl() {
        log('开始解析 GitHub URL');
        const url = window.location.href;
        log(`当前 URL: ${url}`);

        const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/tree\/([^\/]+))?(?:\/(.*))?/);
        if (!match) {
            log('URL 不匹配 GitHub 仓库格式');
            return null;
        }

        const owner = match[1];
        const repo = match[2];
        let branch = match[3];
        const path = match[4] || '';

        // 如果 URL 中没有分支信息，尝试从页面中检测
        if (!branch) {
            log('URL 中未找到分支信息，尝试从页面检测');
            
            // 方法 1: 从页面的分支选择器按钮中获取当前分支
            const branchButton = document.querySelector('[data-testid="anchor-button"][aria-label*="branch"]');
            if (branchButton) {
                // 查找包含分支名的 span
                const branchSpan = branchButton.querySelector('.RefSelectorAnchoredOverlay-module__RefSelectorText--bxVhQ');
                if (branchSpan) {
                    const branchName = branchSpan.textContent.trim();
                    log(`从分支按钮检测到分支: ${branchName}`);
                    branch = branchName;
                } else {
                    // 备用：从 aria-label 中提取
                    const ariaLabel = branchButton.getAttribute('aria-label');
                    const labelMatch = ariaLabel.match(/(\w+)\s+branch/);
                    if (labelMatch) {
                        branch = labelMatch[1];
                        log(`从 aria-label 检测到分支: ${branch}`);
                    }
                }
            }
            
            // 方法 2: 如果方法 1 失败，尝试从旧的分支选择器获取
            if (!branch) {
                const branchSelector = document.querySelector('[data-testid="ref-selector"]');
                if (branchSelector) {
                    const branchText = branchSelector.textContent.trim();
                    const branchName = branchText.split('\n')[0].trim();
                    log(`从旧分支选择器检测到分支: ${branchName}`);
                    branch = branchName;
                }
            }
            
            // 方法 3: 如果都失败，尝试从 meta 标签获取
            if (!branch) {
                const headBranch = document.querySelector('meta[name="branch"]');
                if (headBranch) {
                    branch = headBranch.getAttribute('content');
                    log(`从 meta 标签检测到分支: ${branch}`);
                }
            }
            
            // 方法 4: 如果都失败，尝试从页面 HTML 中查找分支信息
            if (!branch) {
                const pageHtml = document.documentElement.innerHTML;
                // 查找 "branch":"xxx" 的模式
                const branchMatch = pageHtml.match(/"branch":"([^"]+)"/);
                if (branchMatch) {
                    branch = branchMatch[1];
                    log(`从页面 HTML 检测到分支: ${branch}`);
                }
            }
            
            // 最后的默认值
            if (!branch) {
                branch = 'main';
                log(`使用默认分支: ${branch}`);
            }
        }

        log(`解析结果 - 所有者: ${owner}, 仓库: ${repo}, 分支: ${branch}, 路径: ${path}`);

        return { owner, repo, branch, path };
    }

    // 创建控制面板
    function createControlPanel() {
        log('创建控制面板');

        const panelId = 'github-zip-downloader-panel';
        
        // 检查是否已存在
        if (document.getElementById(panelId)) {
            log('控制面板已存在，跳过创建');
            return;
        }

        // 创建展开/收缩按钮（始终显示）
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'github-zip-toggle-btn';
        toggleBtn.textContent = '📦';
        toggleBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #0366d6;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 24px;
            z-index: 9999;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        toggleBtn.onmouseover = () => {
            toggleBtn.style.background = '#0256c7';
            toggleBtn.style.transform = 'scale(1.1)';
        };
        toggleBtn.onmouseout = () => {
            toggleBtn.style.background = '#0366d6';
            toggleBtn.style.transform = 'scale(1)';
        };

        // 主面板（默认隐藏）
        const panel = document.createElement('div');
        panel.id = panelId;
        panel.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            background: white;
            border: 2px solid #0366d6;
            border-radius: 8px;
            padding: 15px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            width: 300px;
            max-height: 600px;
            overflow-y: auto;
            display: none;
            animation: slideIn 0.3s ease;
        `;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);

        // 面板头部（带关闭按钮）
        const panelHeader = document.createElement('div');
        panelHeader.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e1e4e8;
        `;

        const title = document.createElement('div');
        title.style.cssText = `
            font-weight: bold;
            font-size: 14px;
            color: #24292e;
        `;
        title.textContent = 'GitHub 下载器';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 24px;
            height: 24px;
        `;
        closeBtn.onclick = () => {
            panel.style.display = 'none';
            toggleBtn.style.display = 'flex';
        };

        panelHeader.appendChild(title);
        panelHeader.appendChild(closeBtn);

        // 分支信息显示
        const branchInfo = document.createElement('div');
        branchInfo.id = 'branch-info';
        branchInfo.style.cssText = `
            font-size: 11px;
            color: #666;
            margin-bottom: 10px;
            padding: 6px;
            background: #f6f8fa;
            border-radius: 4px;
        `;
        branchInfo.textContent = '分支: 加载中...';

        // 选择文件的容器
        const fileListContainer = document.createElement('div');
        fileListContainer.id = 'file-list-container';
        fileListContainer.style.cssText = `
            max-height: 200px;
            overflow-y: auto;
            margin-bottom: 10px;
            border: 1px solid #e1e4e8;
            border-radius: 4px;
            padding: 8px;
            background: #f6f8fa;
        `;

        // 全选复选框
        const selectAllContainer = document.createElement('div');
        selectAllContainer.style.cssText = `
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e1e4e8;
        `;

        const selectAllCheckbox = document.createElement('input');
        selectAllCheckbox.type = 'checkbox';
        selectAllCheckbox.id = 'select-all-checkbox';
        selectAllCheckbox.style.marginRight = '8px';

        const selectAllLabel = document.createElement('label');
        selectAllLabel.htmlFor = 'select-all-checkbox';
        selectAllLabel.textContent = '全选';
        selectAllLabel.style.cssText = `
            cursor: pointer;
            font-size: 13px;
            color: #24292e;
        `;

        selectAllContainer.appendChild(selectAllCheckbox);
        selectAllContainer.appendChild(selectAllLabel);

        // 按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 8px;
            margin-bottom: 10px;
        `;

        // 下载按钮
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = '📥 下载';
        downloadBtn.style.cssText = `
            flex: 1;
            padding: 8px 12px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition: background 0.2s;
        `;

        downloadBtn.onmouseover = () => downloadBtn.style.background = '#218838';
        downloadBtn.onmouseout = () => downloadBtn.style.background = '#28a745';

        // 刷新按钮
        const refreshBtn = document.createElement('button');
        refreshBtn.textContent = '🔄 刷新';
        refreshBtn.style.cssText = `
            flex: 1;
            padding: 8px 12px;
            background: #6f42c1;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition: background 0.2s;
        `;

        refreshBtn.onmouseover = () => refreshBtn.style.background = '#5a32a3';
        refreshBtn.onmouseout = () => refreshBtn.style.background = '#6f42c1';

        buttonContainer.appendChild(downloadBtn);
        buttonContainer.appendChild(refreshBtn);

        // Token 管理容器
        const tokenContainer = document.createElement('div');
        tokenContainer.style.cssText = `
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #e1e4e8;
            font-size: 12px;
        `;

        // Token 头部（可收缩）
        const currentToken = GM_getValue('github_token', '');
        const hasToken = !!currentToken;
        
        const tokenHeader = document.createElement('div');
        tokenHeader.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            padding: 8px 10px;
            border-radius: 4px;
            background: ${hasToken ? '#d4edda' : '#f8d7da'};
            margin-bottom: 8px;
            user-select: none;
            border: 1px solid ${hasToken ? '#c3e6cb' : '#f5c6cb'};
        `;

        tokenHeader.onmouseover = () => tokenHeader.style.background = hasToken ? '#c3e6cb' : '#f5c6cb';
        tokenHeader.onmouseout = () => tokenHeader.style.background = hasToken ? '#d4edda' : '#f8d7da';

        const tokenTitle = document.createElement('div');
        tokenTitle.style.cssText = `
            font-weight: 600;
            color: ${hasToken ? '#155724' : '#721c24'};
            display: flex;
            align-items: center;
            gap: 6px;
        `;
        tokenTitle.innerHTML = `<span style="font-size: 16px;">${hasToken ? '✅' : '⚠️'}</span> <span>${hasToken ? 'Token 已设置' : 'Token 未设置'}</span>`;

        const tokenToggleIcon = document.createElement('span');
        tokenToggleIcon.textContent = '▼';
        tokenToggleIcon.style.cssText = `
            font-size: 10px;
            color: ${hasToken ? '#155724' : '#721c24'};
            transition: transform 0.3s ease;
        `;

        tokenHeader.appendChild(tokenTitle);
        tokenHeader.appendChild(tokenToggleIcon);

        // Token 内容容器（可收缩）
        const tokenContent = document.createElement('div');
        tokenContent.style.cssText = `
            display: block;
            transition: all 0.3s ease;
            max-height: 500px;
            overflow: hidden;
        `;

        let isTokenExpanded = !hasToken; // 如果没有 Token，默认展开；有 Token 则默认收缩

        const tokenStatusDiv = document.createElement('div');
        tokenStatusDiv.style.cssText = `
            padding: 8px;
            background: #f6f8fa;
            border-radius: 4px;
            font-size: 11px;
            color: #666;
            margin-bottom: 8px;
            border-left: 3px solid ${currentToken ? '#28a745' : '#d73a49'};
        `;
        if (currentToken) {
            tokenStatusDiv.textContent = `✅ Token 已保存 (${currentToken.substring(0, 10)}...)`;
        } else {
            tokenStatusDiv.textContent = '❌ 未设置 Token';
        }

        const tokenInputContainer = document.createElement('div');
        tokenInputContainer.style.cssText = `
            display: flex;
            gap: 4px;
            margin-bottom: 6px;
            flex-wrap: wrap;
        `;

        const tokenInput = document.createElement('input');
        tokenInput.placeholder = '粘贴 Token';
        tokenInput.style.cssText = `
            flex: 1;
            min-width: 120px;
            padding: 6px;
            border: 1px solid #e1e4e8;
            border-radius: 4px;
            font-size: 11px;
        `;

        const tokenSaveBtn = document.createElement('button');
        tokenSaveBtn.textContent = '保存';
        tokenSaveBtn.style.cssText = `
            padding: 6px 12px;
            background: #0366d6;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 600;
        `;

        tokenSaveBtn.onmouseover = () => tokenSaveBtn.style.background = '#0256c7';
        tokenSaveBtn.onmouseout = () => tokenSaveBtn.style.background = '#0366d6';

        tokenSaveBtn.onclick = () => {
            const token = tokenInput.value.trim();
            if (token) {
                GM_setValue('github_token', token);
                tokenInput.value = '';
                log(`GitHub Token 已保存`);
                alert('✅ Token 已保存');
                // 更新状态显示
                tokenStatusDiv.textContent = `✅ Token 已保存 (${token.substring(0, 10)}...)`;
                tokenStatusDiv.style.borderLeftColor = '#28a745';
                // 更新头部显示
                tokenTitle.innerHTML = `<span style="font-size: 16px;">✅</span> <span>Token 已设置</span>`;
                tokenTitle.style.color = '#155724';
                tokenHeader.style.background = '#d4edda';
                tokenHeader.style.borderColor = '#c3e6cb';
                tokenToggleIcon.style.color = '#155724';
                // 自动收缩
                isTokenExpanded = false;
                updateTokenUI();
            } else {
                alert('❌ Token 不能为空');
            }
        };

        const tokenApplyBtn = document.createElement('button');
        tokenApplyBtn.textContent = '申请';
        tokenApplyBtn.style.cssText = `
            padding: 6px 12px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 600;
        `;

        tokenApplyBtn.onmouseover = () => tokenApplyBtn.style.background = '#218838';
        tokenApplyBtn.onmouseout = () => tokenApplyBtn.style.background = '#28a745';

        tokenApplyBtn.onclick = () => {
            window.open('https://github.com/settings/tokens/new?scopes=repo,read:user&description=GitHub%20Downloader', '_blank');
        };

        const tokenClearBtn = document.createElement('button');
        tokenClearBtn.textContent = '清除';
        tokenClearBtn.style.cssText = `
            padding: 6px 12px;
            background: #d73a49;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 600;
        `;

        tokenClearBtn.onmouseover = () => tokenClearBtn.style.background = '#cb2431';
        tokenClearBtn.onmouseout = () => tokenClearBtn.style.background = '#d73a49';

        tokenClearBtn.onclick = () => {
            if (confirm('确定要清除保存的 Token 吗？')) {
                GM_setValue('github_token', '');
                log(`GitHub Token 已清除`);
                alert('✅ Token 已清除');
                tokenStatusDiv.textContent = '❌ 未设置 Token';
                tokenStatusDiv.style.borderLeftColor = '#d73a49';
                // 更新头部显示
                tokenTitle.innerHTML = `<span style="font-size: 16px;">⚠️</span> <span>Token 未设置</span>`;
                tokenTitle.style.color = '#721c24';
                tokenHeader.style.background = '#f8d7da';
                tokenHeader.style.borderColor = '#f5c6cb';
                tokenToggleIcon.style.color = '#721c24';
                // 展开以便用户重新设置
                isTokenExpanded = true;
                updateTokenUI();
            }
        };

        tokenInputContainer.appendChild(tokenInput);
        tokenInputContainer.appendChild(tokenSaveBtn);
        tokenInputContainer.appendChild(tokenApplyBtn);
        tokenInputContainer.appendChild(tokenClearBtn);

        tokenContent.appendChild(tokenStatusDiv);
        tokenContent.appendChild(tokenInputContainer);

        // 更新 Token UI 的函数
        const updateTokenUI = () => {
            if (isTokenExpanded) {
                tokenContent.style.maxHeight = '500px';
                tokenContent.style.opacity = '1';
                tokenToggleIcon.style.transform = 'rotate(0deg)';
            } else {
                tokenContent.style.maxHeight = '0px';
                tokenContent.style.opacity = '0';
                tokenToggleIcon.style.transform = 'rotate(-90deg)';
            }
        };

        // 初始化 Token UI
        updateTokenUI();

        // Token 头部点击事件
        tokenHeader.onclick = () => {
            isTokenExpanded = !isTokenExpanded;
            updateTokenUI();
        };

        tokenContainer.appendChild(tokenHeader);
        tokenContainer.appendChild(tokenContent);

        // 组装面板内容
        panel.appendChild(panelHeader);
        panel.appendChild(branchInfo);
        panel.appendChild(selectAllContainer);
        panel.appendChild(fileListContainer);
        panel.appendChild(buttonContainer);
        panel.appendChild(tokenContainer);

        // 添加到页面
        document.body.appendChild(panel);
        document.body.appendChild(toggleBtn);

        // 切换按钮事件
        toggleBtn.onclick = () => {
            panel.style.display = 'block';
            toggleBtn.style.display = 'none';
        };

        log('控制面板创建完成');

        return { panel, fileListContainer, downloadBtn, refreshBtn, selectAllCheckbox, branchInfo, toggleBtn };
    }

    // 获取当前页面的文件列表
    function getFileListFromPage() {
        log('从页面获取文件列表');

        const files = [];
        const processedHrefs = new Set();

        // 方法 1: 查找 react-directory-row 行（新版 GitHub）
        log('尝试方法 1: 查找 react-directory-row');
        const directoryRows = document.querySelectorAll('tr.react-directory-row');
        log(`找到 ${directoryRows.length} 个目录行`);

        if (directoryRows.length > 0) {
            directoryRows.forEach((row, index) => {
                try {
                    // 查找行内的链接
                    const link = row.querySelector('a[href*="/blob/"], a[href*="/tree/"]');
                    if (!link) {
                        log(`行 ${index}: 没有找到文件链接`);
                        return;
                    }

                    const href = link.getAttribute('href');
                    const fileName = link.textContent.trim();

                    // 基本验证
                    if (!href || !fileName || processedHrefs.has(href)) {
                        log(`行 ${index}: 跳过 (href=${href}, fileName=${fileName})`);
                        return;
                    }

                    // 跳过非标准链接
                    if (!href.includes('/blob/') && !href.includes('/tree/')) {
                        log(`行 ${index}: 跳过非标准格式 href="${href}"`);
                        return;
                    }

                    // 跳过包含查询参数的链接
                    if (href.includes('?')) {
                        log(`行 ${index}: 跳过包含查询参数的链接 href="${href}"`);
                        return;
                    }

                    processedHrefs.add(href);
                    const isDirectory = href.includes('/tree/');

                    log(`行 ${index}: 文件名="${fileName}", 是目录=${isDirectory}`);

                    files.push({
                        name: fileName,
                        href: href,
                        isDirectory: isDirectory,
                        fullUrl: `https://github.com${href}`
                    });
                } catch (e) {
                    error(`解析行 ${index} 时出错: ${e.message}`);
                }
            });
        }

        // 方法 2: 如果方法 1 没有找到，查找所有 /blob/ 和 /tree/ 链接
        if (files.length === 0) {
            log('方法 1 未找到文件，尝试方法 2: 查找所有 /blob/ 和 /tree/ 链接');
            const allLinks = document.querySelectorAll('a[href*="/blob/"], a[href*="/tree/"]');
            log(`找到 ${allLinks.length} 个文件/目录链接`);

            allLinks.forEach((link, index) => {
                try {
                    const href = link.getAttribute('href');
                    const fileName = link.textContent.trim();

                    if (!href || !fileName || processedHrefs.has(href)) {
                        return;
                    }

                    if (!href.includes('/blob/') && !href.includes('/tree/')) {
                        return;
                    }

                    if (href.includes('?')) {
                        return;
                    }

                    processedHrefs.add(href);
                    const isDirectory = href.includes('/tree/');

                    log(`链接 ${index}: 文件名="${fileName}", 是目录=${isDirectory}`);

                    files.push({
                        name: fileName,
                        href: href,
                        isDirectory: isDirectory,
                        fullUrl: `https://github.com${href}`
                    });
                } catch (e) {
                    error(`解析链接 ${index} 时出错: ${e.message}`);
                }
            });
        }

        log(`总共获取 ${files.length} 个文件/目录`);
        return files;
    }

    // 渲染文件列表到面板
    function renderFileList(files, container, selectAllCheckbox) {
        log('渲染文件列表到面板');

        container.innerHTML = '';

        if (files.length === 0) {
            log('文件列表为空');
            const emptyMsg = document.createElement('div');
            emptyMsg.textContent = '没有找到文件';
            emptyMsg.style.cssText = `
                padding: 10px;
                text-align: center;
                color: #666;
                font-size: 12px;
            `;
            container.appendChild(emptyMsg);
            return;
        }

        files.forEach((file, index) => {
            const checkboxContainer = document.createElement('div');
            checkboxContainer.style.cssText = `
                display: flex;
                align-items: center;
                padding: 6px 0;
                border-bottom: 1px solid #e1e4e8;
            `;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'file-checkbox';
            checkbox.value = file.href;
            checkbox.dataset.isDirectory = file.isDirectory;
            checkbox.style.marginRight = '8px';
            checkbox.checked = false;

            const label = document.createElement('label');
            label.style.cssText = `
                flex: 1;
                cursor: pointer;
                font-size: 12px;
                color: #24292e;
                display: flex;
                align-items: center;
            `;

            const icon = document.createElement('span');
            icon.textContent = file.isDirectory ? '📁 ' : '📄 ';
            icon.style.marginRight = '4px';

            const nameSpan = document.createElement('span');
            nameSpan.textContent = file.name;
            nameSpan.title = file.name;
            nameSpan.style.overflow = 'hidden';
            nameSpan.style.textOverflow = 'ellipsis';
            nameSpan.style.whiteSpace = 'nowrap';

            label.appendChild(icon);
            label.appendChild(nameSpan);

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
            container.appendChild(checkboxContainer);

            log(`渲染文件 ${index + 1}/${files.length}: ${file.name}`);
        });

        // 全选逻辑
        selectAllCheckbox.onchange = () => {
            log(`全选状态改变: ${selectAllCheckbox.checked}`);
            const checkboxes = container.querySelectorAll('.file-checkbox');
            checkboxes.forEach(cb => cb.checked = selectAllCheckbox.checked);
        };
    }

    // 获取选中的文件
    function getSelectedFiles() {
        const checkboxes = document.querySelectorAll('.file-checkbox:checked');
        const selected = Array.from(checkboxes).map(cb => ({
            href: cb.value,
            isDirectory: cb.dataset.isDirectory === 'true'
        }));

        log(`获取选中文件: 共 ${selected.length} 个`);
        selected.forEach((file, index) => {
            log(`  ${index + 1}. href=${file.href}, isDirectory=${file.isDirectory}`);
        });

        return selected;
    }

    // 下载文件内容
    async function downloadFileContent(url) {
        return new Promise((resolve, reject) => {
            log(`下载文件内容: ${url}`);

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: 10000,
                onload: (response) => {
                    log(`响应状态: ${response.status}, 大小: ${response.responseText.length} 字节`);
                    
                    if (response.status === 200) {
                        log(`文件下载成功: ${url}`);
                        resolve(response.responseText);
                    } else if (response.status === 404) {
                        error(`文件不存在 (404): ${url}`);
                        reject(new Error(`文件不存在: ${url}`));
                    } else {
                        error(`下载失败 (${response.status}): ${url}`);
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: (err) => {
                    error(`文件下载出错: ${url}, 错误: ${err}`);
                    reject(err);
                },
                ontimeout: () => {
                    error(`文件下载超时: ${url}`);
                    reject(new Error(`下载超时: ${url}`));
                }
            });
        });
    }

    // 获取原始文件 URL
    function getRawUrl(githubUrl) {
        // 将 /blob/ 或 /tree/ 转换为原始 URL
        const rawUrl = githubUrl
            .replace('github.com', 'raw.githubusercontent.com')
            .replace('/blob/', '/')
            .replace('/tree/', '/');

        log(`转换 URL: ${githubUrl} -> ${rawUrl}`);
        return rawUrl;
    }

    // 递归获取目录中的所有文件（带自动重试机制和 Token 支持）
    async function getFilesFromDirectory(dirPath, repoInfo, retryBranch = null, token = null) {
        log(`获取目录内容: ${dirPath}`);
        
        const branch = retryBranch || repoInfo.branch;
        const dirUrl = `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/contents/${dirPath}?ref=${branch}`;
        log(`API URL: ${dirUrl}`);
        
        return new Promise((resolve, reject) => {
            const headers = {};
            if (token) {
                headers['Authorization'] = `token ${token}`;
            }
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: dirUrl,
                headers: headers,
                timeout: 10000,
                onload: (response) => {
                    if (response.status === 200) {
                        try {
                            const items = JSON.parse(response.responseText);
                            log(`目录 ${dirPath} 包含 ${items.length} 项`);
                            resolve(items);
                        } catch (e) {
                            error(`解析 API 响应失败: ${e.message}`);
                            reject(e);
                        }
                    } else if (response.status === 404 && !retryBranch && branch === 'main') {
                        // 如果是 main 分支返回 404，尝试用 master 分支
                        log(`分支 'main' 返回 404，尝试 'master' 分支`);
                        getFilesFromDirectory(dirPath, repoInfo, 'master', token)
                            .then(resolve)
                            .catch(reject);
                    } else if (response.status === 403) {
                        // 403 通常是速率限制或权限问题
                        error(`获取目录失败 (403): ${dirUrl}`);
                        error(`响应头: ${JSON.stringify(response.responseHeaders)}`);
                        reject(new Error(`API 速率限制或权限不足 (403)`));
                    } else {
                        error(`获取目录失败 (${response.status}): ${dirUrl}`);
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: (err) => {
                    error(`获取目录出错: ${dirPath}, 错误: ${err}`);
                    reject(err);
                },
                ontimeout: () => {
                    error(`获取目录超时: ${dirPath}`);
                    reject(new Error(`超时: ${dirPath}`));
                }
            });
        });
    }

    // 递归收集所有文件（包括子目录中的文件）
    async function collectAllFiles(items, repoInfo, depth = 0, token = null) {
        const allFiles = [];
        const maxDepth = 10; // 防止无限递归
        
        if (depth > maxDepth) {
            log(`达到最大递归深度 ${maxDepth}，停止递归`);
            return allFiles;
        }
        
        for (const item of items) {
            if (item.type === 'file') {
                allFiles.push(item);
            } else if (item.type === 'dir') {
                log(`[深度 ${depth}] 递归处理子目录: ${item.path}`);
                try {
                    const subItems = await getFilesFromDirectory(item.path, repoInfo, null, token);
                    const subFiles = await collectAllFiles(subItems, repoInfo, depth + 1, token);
                    allFiles.push(...subFiles);
                } catch (e) {
                    // 404 或其他错误时，记录但继续处理其他目录
                    log(`[深度 ${depth}] 跳过子目录 ${item.path}: ${e.message}`);
                }
            }
        }
        
        return allFiles;
    }

    // 创建 ZIP 文件并下载
    async function createAndDownloadZip(files, repoInfo) {
        log('开始创建 ZIP 文件');
        log(`总共需要处理 ${files.length} 个文件/目录`);

        try {
            // 检查 JSZip 是否已加载
            if (typeof JSZip === 'undefined') {
                error('JSZip 库未加载');
                throw new Error('JSZip 库未加载，请稍后重试');
            }

            // 获取 GitHub Token
            const token = getGitHubToken();
            if (token) {
                log(`使用 GitHub Token 进行认证请求`);
            } else {
                log(`未使用 Token，使用未认证请求（限制 60 次/小时）`);
            }

            const zip = new JSZip();
            let fileCount = 0;
            let skipCount = 0;
            let errorCount = 0;

            // 收集所有需要下载的文件
            const filesToDownload = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                try {
                    log(`[${i + 1}/${files.length}] 处理: ${file.href}`);

                    if (file.isDirectory) {
                        log(`[${i + 1}/${files.length}] 递归获取目录内容...`);
                        
                        // 从 href 中提取目录路径
                        const dirMatch = file.href.match(/\/tree\/[^\/]+\/(.*)$/);
                        const dirPath = dirMatch ? dirMatch[1] : '';
                        
                        if (!dirPath) {
                            log(`[${i + 1}/${files.length}] 目录路径为空，跳过`);
                            skipCount++;
                            continue;
                        }
                        
                        try {
                            const items = await getFilesFromDirectory(dirPath, repoInfo, null, token);
                            
                            // 递归收集所有文件（包括子目录）
                            const allDirFiles = await collectAllFiles(items, repoInfo, 0, token);
                            log(`[${i + 1}/${files.length}] 递归找到 ${allDirFiles.length} 个文件`);
                            
                            if (allDirFiles.length > 0) {
                                filesToDownload.push(...allDirFiles.map(item => ({
                                    name: item.name,
                                    path: item.path,
                                    downloadUrl: item.download_url
                                })));
                            } else {
                                log(`[${i + 1}/${files.length}] 目录为空`);
                                skipCount++;
                            }
                        } catch (e) {
                            error(`[${i + 1}/${files.length}] 获取目录失败: ${e.message}`);
                            skipCount++;
                        }
                        continue;
                    }

                    // 单个文件
                    const blobMatch = file.href.match(/\/blob\/[^\/]+\/(.+)$/);
                    const filePath = blobMatch ? blobMatch[1] : file.href.split('/').pop();
                    
                    filesToDownload.push({
                        name: file.name,
                        path: filePath,
                        href: file.href
                    });

                } catch (e) {
                    errorCount++;
                    error(`[${i + 1}/${files.length}] 处理失败: ${e.message}`);
                }
            }

            log(`总共需要下载 ${filesToDownload.length} 个文件`);

            // 下载所有文件（限制并发数为 3）
            const maxConcurrent = 3;
            for (let i = 0; i < filesToDownload.length; i += maxConcurrent) {
                const batch = filesToDownload.slice(i, i + maxConcurrent);
                const promises = batch.map(async (file, batchIndex) => {
                    const globalIndex = i + batchIndex;
                    try {
                        log(`[下载 ${globalIndex + 1}/${filesToDownload.length}] ${file.path}`);

                        let content;
                        if (file.downloadUrl) {
                            // 使用 GitHub API 的下载 URL
                            content = await downloadFileContent(file.downloadUrl);
                        } else {
                            // 使用 raw.githubusercontent.com
                            const fullUrl = `https://github.com${file.href}`;
                            const rawUrl = getRawUrl(fullUrl);
                            content = await downloadFileContent(rawUrl);
                        }

                        zip.file(file.path, content);
                        fileCount++;
                        log(`[下载 ${globalIndex + 1}/${filesToDownload.length}] ✓ 已添加`);

                    } catch (e) {
                        errorCount++;
                        error(`[下载 ${globalIndex + 1}/${filesToDownload.length}] 失败: ${e.message}`);
                    }
                });

                await Promise.all(promises);
                
                // 批次之间延迟 100ms，避免过多并发
                if (i + maxConcurrent < filesToDownload.length) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            log(`处理完成 - 成功: ${fileCount}, 失败: ${errorCount}`);

            if (fileCount === 0) {
                throw new Error('没有成功添加任何文件到 ZIP');
            }

            // 生成 ZIP 文件
            log('正在生成 ZIP 文件...');
            log(`ZIP 中包含 ${fileCount} 个文件`);
            
            let zipContent;
            try {
                // 使用异步方式生成 ZIP，使用流式处理
                log('开始异步生成 ZIP...');
                
                const generatePromise = zip.generateAsync({ 
                    type: 'blob',
                    compression: 'DEFLATE',
                    compressionOptions: { level: 1 },  // 降低压缩级别以加快速度
                    streamFiles: true  // 启用流式处理
                });

                // 添加超时保护
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => {
                        log('ZIP 生成超时（超过 20 秒）');
                        reject(new Error('ZIP 生成超时'));
                    }, 20000);
                });

                zipContent = await Promise.race([generatePromise, timeoutPromise]);
                log(`ZIP 文件生成完成，大小: ${(zipContent.size / 1024).toFixed(2)} KB`);
            } catch (e) {
                error(`生成 ZIP 失败: ${e.message}`);
                throw new Error(`无法生成 ZIP 文件: ${e.message}`);
            }

            // 下载 ZIP 文件
            const zipName = `${repoInfo.repo}-${repoInfo.branch}-${Date.now()}.zip`;
            log(`准备下载 ZIP: ${zipName}`);
            
            try {
                const url = URL.createObjectURL(zipContent);
                log(`ObjectURL 创建成功`);

                const a = document.createElement('a');
                a.href = url;
                a.download = zipName;
                document.body.appendChild(a);
                
                log('触发下载...');
                a.click();
                
                document.body.removeChild(a);
                
                // 延迟释放 URL，确保下载完成
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                    log('ObjectURL 已释放');
                }, 500);

                log(`ZIP 文件下载完成: ${zipName}`);
                alert(`✅ 下载完成！\n文件: ${zipName}\n成功: ${fileCount}, 失败: ${errorCount}`);
            } catch (downloadErr) {
                error(`下载失败: ${downloadErr.message}`);
                throw new Error(`下载失败: ${downloadErr.message}`);
            }

        } catch (e) {
            error(`创建 ZIP 文件失败: ${e.message}`);
            alert(`❌ 下载失败: ${e.message}`);
        }
    }


    // 初始化脚本
    function init() {
        log('=== 脚本初始化开始 ===');

        const repoInfo = parseGitHubUrl();
        if (!repoInfo) {
            log('不是有效的 GitHub 仓库页面，脚本退出');
            return;
        }

        log(`✅ 已解析仓库信息 - 所有者: ${repoInfo.owner}, 仓库: ${repoInfo.repo}, 分支: ${repoInfo.branch}`);

        const { panel, fileListContainer, downloadBtn, refreshBtn, selectAllCheckbox, branchInfo, toggleBtn } = createControlPanel();

        // 立即更新分支信息显示
        branchInfo.textContent = `📌 分支: ${repoInfo.branch}`;
        branchInfo.title = `仓库: ${repoInfo.owner}/${repoInfo.repo}`;

        let isRefreshing = false;
        let lastRefreshTime = 0;

        // 刷新函数
        const refresh = () => {
            const now = Date.now();
            // 防止频繁刷新（500ms 内不重复刷新）
            if (isRefreshing || (now - lastRefreshTime < 500)) {
                log('刷新被跳过（防止频繁刷新）');
                return;
            }

            isRefreshing = true;
            lastRefreshTime = now;

            log('执行刷新操作');
            const files = getFileListFromPage();
            renderFileList(files, fileListContainer, selectAllCheckbox);

            isRefreshing = false;
        };

        // 初始刷新
        refresh();

        // 下载按钮事件
        downloadBtn.onclick = async () => {
            log('点击下载按钮');
            downloadBtn.disabled = true;
            downloadBtn.textContent = '⏳ 处理中...';

            try {
                const selectedFiles = getSelectedFiles();
                if (selectedFiles.length === 0) {
                    alert('请选择至少一个文件');
                    log('没有选中任何文件');
                    return;
                }

                await createAndDownloadZip(selectedFiles, repoInfo);
            } catch (e) {
                error(`下载过程出错: ${e.message}`);
                alert(`错误: ${e.message}`);
            } finally {
                downloadBtn.disabled = false;
                downloadBtn.textContent = '📥 下载为 ZIP';
            }
        };

        // 刷新按钮事件
        refreshBtn.onclick = refresh;

        log('=== 脚本初始化完成 ===');
    }

    // 等待页面加载完成后初始化
    if (isCodePage()) {
        log('检测到代码页面，准备初始化');
        if (document.readyState === 'loading') {
            log('页面仍在加载，等待 DOMContentLoaded 事件');
            document.addEventListener('DOMContentLoaded', init);
        } else {
            log('页面已加载，直接初始化');
            init();
        }
    } else {
        log('不是代码页面，脚本不启动');
    }

})();
