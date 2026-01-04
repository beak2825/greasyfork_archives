// ==UserScript==
// @name         自动复制视频链接嗅探器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动嗅探视频链接并复制到剪贴板，仅在白名单网站运行
// @author       特比欧炸
// @match        https://*/*
// @match        http://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554754/%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E5%97%85%E6%8E%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/554754/%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E5%97%85%E6%8E%A2%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 样式定义
    const style = document.createElement('style');
    style.textContent = `
        /* 深色模式变量 */
        :root {
            --vs-bg-primary: white;
            --vs-bg-secondary: #f9fafb;
            --vs-bg-hover: #f3f4f6;
            --vs-border: #e5e7eb;
            --vs-border-hover: #d1d5db;
            --vs-text-primary: #111827;
            --vs-text-secondary: #6b7280;
            --vs-input-bg: white;
            --vs-input-border: #d1d5db;
        }

        [data-theme="dark"] {
            --vs-bg-primary: #1f2937;
            --vs-bg-secondary: #111827;
            --vs-bg-hover: #374151;
            --vs-border: #374151;
            --vs-border-hover: #4b5563;
            --vs-text-primary: #f9fafb;
            --vs-text-secondary: #9ca3af;
            --vs-input-bg: #374151;
            --vs-input-border: #4b5563;
        }

        /* 无感通知样式 */
        .video-sniffer-toast {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 220px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border-radius: 6px;
            padding: 8px 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 12px;
            line-height: 1.3;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255,255,255,0.1);
            transform: translateX(240px);
            opacity: 0;
            transition: all 0.3s ease;
            pointer-events: none;
        }
        .video-sniffer-toast.show {
            transform: translateX(0);
            opacity: 1;
        }
        .toast-content {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .toast-icon {
            font-size: 14px;
            flex-shrink: 0;
        }
        .toast-message {
            flex: 1;
        }

        /* 管理面板样式 */
        .vs-panel-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 9998;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.2s ease;
            padding: 10px;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .vs-panel {
            background: var(--vs-bg-primary);
            border-radius: 12px;
            width: 100%;
            max-width: 700px;
            max-height: 85vh;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            display: flex;
            flex-direction: column;
            animation: slideUp 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .vs-panel-header {
            padding: 16px 20px;
            border-bottom: 1px solid var(--vs-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
        }
        .vs-panel-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--vs-text-primary);
            margin: 0;
        }
        .vs-panel-actions {
            display: flex;
            gap: 8px;
            align-items: center;
        }
        .vs-panel-close {
            background: none;
            border: none;
            font-size: 24px;
            color: var(--vs-text-secondary);
            cursor: pointer;
            padding: 0;
            width: 32px;
            height: 32px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        .vs-panel-close:hover {
            background: var(--vs-bg-hover);
            color: var(--vs-text-primary);
        }
        .vs-theme-toggle {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            padding: 6px;
            border-radius: 6px;
            transition: all 0.2s;
        }
        .vs-theme-toggle:hover {
            background: var(--vs-bg-hover);
        }
        .vs-panel-search {
            padding: 12px 20px;
            border-bottom: 1px solid var(--vs-border);
            flex-shrink: 0;
        }
        .vs-search-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid var(--vs-input-border);
            border-radius: 6px;
            font-size: 14px;
            background: var(--vs-input-bg);
            color: var(--vs-text-primary);
            transition: all 0.2s;
        }
        .vs-search-input:focus {
            outline: none;
            border-color: #3b82f6;
        }
        .vs-search-input::placeholder {
            color: var(--vs-text-secondary);
        }
        .vs-panel-body {
            padding: 16px 20px;
            overflow-y: auto;
            flex: 1;
            min-height: 0;
        }
        .vs-panel-footer {
            padding: 12px 20px;
            border-top: 1px solid var(--vs-border);
            display: flex;
            gap: 8px;
            justify-content: flex-end;
            flex-wrap: wrap;
            flex-shrink: 0;
        }
        .vs-btn {
            padding: 8px 16px;
            border-radius: 6px;
            border: none;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
        }
        .vs-btn-primary {
            background: #3b82f6;
            color: white;
        }
        .vs-btn-primary:hover {
            background: #2563eb;
        }
        .vs-btn-danger {
            background: #ef4444;
            color: white;
        }
        .vs-btn-danger:hover {
            background: #dc2626;
        }
        .vs-btn-secondary {
            background: var(--vs-bg-hover);
            color: var(--vs-text-primary);
        }
        .vs-btn-secondary:hover {
            background: var(--vs-border-hover);
        }
        .vs-btn-success {
            background: #10b981;
            color: white;
        }
        .vs-btn-success:hover {
            background: #059669;
        }

        /* 列表样式 */
        .vs-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .vs-list-item {
            padding: 12px 16px;
            border: 1px solid var(--vs-border);
            border-radius: 8px;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.2s;
            background: var(--vs-bg-primary);
        }
        .vs-list-item:hover {
            background: var(--vs-bg-secondary);
            border-color: var(--vs-border-hover);
        }
        .vs-list-item-content {
            flex: 1;
            min-width: 0;
        }
        .vs-list-item-title {
            font-size: 14px;
            font-weight: 500;
            color: var(--vs-text-primary);
            word-break: break-all;
        }
        .vs-list-item-meta {
            font-size: 12px;
            color: var(--vs-text-secondary);
            margin-top: 4px;
        }
        .vs-list-item-actions {
            display: flex;
            gap: 8px;
            margin-left: 12px;
            flex-shrink: 0;
        }
        .vs-icon-btn {
            background: none;
            border: none;
            padding: 6px;
            cursor: pointer;
            color: var(--vs-text-secondary);
            border-radius: 4px;
            transition: all 0.2s;
            font-size: 16px;
        }
        .vs-icon-btn:hover {
            background: var(--vs-bg-hover);
            color: var(--vs-text-primary);
        }
        .vs-icon-btn.danger:hover {
            background: #fee2e2;
            color: #dc2626;
        }
        .vs-icon-btn.success:hover {
            background: #dcfce7;
            color: #16a34a;
        }

        /* 空状态 */
        .vs-empty {
            text-align: center;
            padding: 40px 20px;
            color: var(--vs-text-secondary);
        }
        .vs-empty-icon {
            font-size: 48px;
            margin-bottom: 12px;
        }
        .vs-empty-text {
            font-size: 14px;
        }

        /* 历史记录特殊样式 */
        .vs-history-url {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            color: #3b82f6;
            word-break: break-all;
            background: var(--vs-bg-secondary);
            padding: 4px 8px;
            border-radius: 4px;
            margin-top: 4px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .vs-history-url:hover {
            background: var(--vs-bg-hover);
        }
        [data-theme="dark"] .vs-history-url {
            color: #60a5fa;
        }

        /* 移动端优化 */
        @media (max-width: 640px) {
            .vs-panel {
                max-height: 90vh;
                border-radius: 12px 12px 0 0;
            }
            .vs-panel-title {
                font-size: 16px;
            }
            .vs-btn {
                font-size: 13px;
                padding: 7px 12px;
            }
            .vs-list-item {
                flex-direction: column;
                align-items: flex-start;
            }
            .vs-list-item-actions {
                margin-left: 0;
                margin-top: 8px;
                width: 100%;
                justify-content: flex-end;
            }
        }

        /* 搜索栏样式 */
        .vs-search-container {
            display: flex;
            gap: 8px;
            align-items: center;
        }
        .vs-search-input {
            flex: 1;
        }
        .vs-search-btn {
            white-space: nowrap;
        }
    `;
    document.head.appendChild(style);

    // 白名单和历史记录功能
    class WhitelistManager {
        constructor() {
            this.whitelistKey = 'videoSnifferWhitelist';
            this.historyKey = 'videoSnifferHistory';
            this.themeKey = 'videoSnifferTheme';
            this.init();
        }

        init() {
            // 初始化白名单和历史记录
            if (GM_getValue(this.whitelistKey) === undefined) {
                GM_setValue(this.whitelistKey, []);
            }
            if (GM_getValue(this.historyKey) === undefined) {
                GM_setValue(this.historyKey, []);
            }
            if (GM_getValue(this.themeKey) === undefined) {
                GM_setValue(this.themeKey, 'light');
            }

            // 应用主题
            this.applyTheme();

            // 注册菜单命令
            this.registerMenuCommands();
        }

        registerMenuCommands() {
            GM_registerMenuCommand('✅ 添加当前网站到白名单', () => {
                this.addCurrentSite();
            });

            GM_registerMenuCommand('❌ 从白名单移除当前网站', () => {
                this.removeCurrentSite();
            });

            GM_registerMenuCommand('📋 管理白名单', () => {
                this.showWhitelistPanel();
            });

            GM_registerMenuCommand('📜 查看历史链接', () => {
                this.showHistoryPanel();
            });

            GM_registerMenuCommand('🌓 切换深色模式', () => {
                this.toggleTheme();
            });

            GM_registerMenuCommand('🗑️ 清空白名单', () => {
                this.clearWhitelist();
            });

            GM_registerMenuCommand('🗑️ 清空历史记录', () => {
                this.clearHistory();
            });

            // 保留：复制当前视频链接功能
            GM_registerMenuCommand('📱 复制当前视频链接', () => {
                this.copyCurrentVideoUrl();
            });
        }

        getCurrentSite() {
            const url = new URL(window.location.href);
            return url.hostname;
        }

        addCurrentSite() {
            const site = this.getCurrentSite();
            const whitelist = GM_getValue(this.whitelistKey, []);

            if (!whitelist.includes(site)) {
                whitelist.push(site);
                GM_setValue(this.whitelistKey, whitelist);

                this.showToast('✅ 已添加到白名单', 2000);

                // 立即启动脚本，无需刷新
                if (!window.videoSniffer) {
                    window.videoSniffer = new VideoSniffer();
                }
            } else {
                this.showToast('ℹ️ 已在白名单中', 2000);
            }
        }

        removeCurrentSite() {
            const site = this.getCurrentSite();
            let whitelist = GM_getValue(this.whitelistKey, []);

            if (whitelist.includes(site)) {
                whitelist = whitelist.filter(s => s !== site);
                GM_setValue(this.whitelistKey, whitelist);

                this.showToast('✅ 已移除白名单', 2000);

                // 停止脚本
                if (window.videoSniffer) {
                    window.videoSniffer.stop();
                    window.videoSniffer = null;
                }
            } else {
                this.showToast('ℹ️ 不在白名单中', 2000);
            }
        }

        showWhitelistPanel() {
            // 只在顶层窗口显示面板，避免iframe中重复显示
            if (window.self !== window.top) {
                return;
            }

            // 检查是否已存在面板，避免重复创建
            if (document.querySelector('.vs-panel-overlay')) {
                return;
            }

            const whitelist = GM_getValue(this.whitelistKey, []);
            const currentSite = this.getCurrentSite();

            const overlay = document.createElement('div');
            overlay.className = 'vs-panel-overlay';

            const panel = document.createElement('div');
            panel.className = 'vs-panel';

            panel.innerHTML = `
                <div class="vs-panel-header">
                    <h3 class="vs-panel-title">📋 白名单管理</h3>
                    <div class="vs-panel-actions">
                        <button class="vs-theme-toggle" title="切换主题">${this.getTheme() === 'dark' ? '☀️' : '🌙'}</button>
                        <button class="vs-panel-close">×</button>
                    </div>
                </div>
                <div class="vs-panel-body">
                    ${whitelist.length === 0 ? `
                        <div class="vs-empty">
                            <div class="vs-empty-icon">📋</div>
                            <div class="vs-empty-text">白名单为空</div>
                        </div>
                    ` : `
                        <ul class="vs-list" id="vs-whitelist">
                            ${whitelist.map(site => `
                                <li class="vs-list-item">
                                    <div class="vs-list-item-content">
                                        <div class="vs-list-item-title">${site}</div>
                                        ${site === currentSite ? '<div class="vs-list-item-meta">📍 当前网站</div>' : ''}
                                    </div>
                                    <div class="vs-list-item-actions">
                                        <button class="vs-icon-btn danger" data-action="remove" data-site="${site}" title="移除">🗑️</button>
                                    </div>
                                </li>
                            `).join('')}
                        </ul>
                    `}
                </div>
                <div class="vs-panel-footer">
                    ${!whitelist.includes(currentSite) ?
                        '<button class="vs-btn vs-btn-primary" id="vs-add-current">✅ 添加当前网站</button>' : ''}
                    <button class="vs-btn vs-btn-primary" id="vs-add-manual">➕ 手动添加</button>
                    ${whitelist.length > 0 ?
                        '<button class="vs-btn vs-btn-danger" id="vs-clear-all">🗑️ 清空全部</button>' : ''}
                    <button class="vs-btn vs-btn-secondary" id="vs-close">关闭</button>
                </div>
            `;

            overlay.appendChild(panel);
            document.body.appendChild(overlay);

            // 事件处理
            panel.querySelector('.vs-panel-close').addEventListener('click', () => overlay.remove());
            panel.querySelector('.vs-theme-toggle').addEventListener('click', () => {
                this.toggleTheme();
                overlay.remove();
                setTimeout(() => this.showWhitelistPanel(), 100);
            });
            panel.querySelector('#vs-close').addEventListener('click', () => overlay.remove());
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) overlay.remove();
            });

            // 移除网站
            const whitelist_ul = panel.querySelector('#vs-whitelist');
            if (whitelist_ul) {
                whitelist_ul.addEventListener('click', (e) => {
                    const btn = e.target.closest('[data-action="remove"]');
                    if (btn) {
                        const site = btn.dataset.site;
                        if (confirm(`确定要从白名单移除 ${site} 吗？`)) {
                            const newWhitelist = whitelist.filter(s => s !== site);
                            GM_setValue(this.whitelistKey, newWhitelist);
                            this.showToast('✅ 已移除', 2000);
                            overlay.remove();

                            if (site === currentSite && window.videoSniffer) {
                                window.videoSniffer.stop();
                                window.videoSniffer = null;
                            }
                        }
                    }
                });
            }

            // 添加当前网站
            const addBtn = panel.querySelector('#vs-add-current');
            if (addBtn) {
                addBtn.addEventListener('click', () => {
                    this.addCurrentSite();
                    overlay.remove();
                });
            }

            // 手动添加网站
            const manualBtn = panel.querySelector('#vs-add-manual');
            if (manualBtn) {
                manualBtn.addEventListener('click', () => {
                    const domain = prompt('请输入要添加的域名（例如：example.com）:');
                    if (domain) {
                        const trimmedDomain = domain.trim().toLowerCase()
                            .replace(/^https?:\/\//, '')  // 移除协议
                            .replace(/\/.*$/, '');         // 移除路径

                        if (trimmedDomain && /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(trimmedDomain)) {
                            const newWhitelist = GM_getValue(this.whitelistKey, []);
                            if (!newWhitelist.includes(trimmedDomain)) {
                                newWhitelist.push(trimmedDomain);
                                GM_setValue(this.whitelistKey, newWhitelist);
                                this.showToast('✅ 已添加: ' + trimmedDomain, 2000);
                                overlay.remove();
                            } else {
                                this.showToast('ℹ️ 域名已存在', 2000);
                            }
                        } else {
                            this.showToast('❌ 域名格式无效', 2000);
                        }
                    }
                });
            }

            // 清空全部
            const clearBtn = panel.querySelector('#vs-clear-all');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    if (confirm('确定要清空白名单吗？')) {
                        GM_setValue(this.whitelistKey, []);
                        this.showToast('✅ 白名单已清空', 2000);
                        overlay.remove();

                        if (window.videoSniffer) {
                            window.videoSniffer.stop();
                            window.videoSniffer = null;
                        }
                    }
                });
            }
        }

        showHistoryPanel() {
            // 只在顶层窗口显示面板，避免iframe中重复显示
            if (window.self !== window.top) {
                return;
            }

            // 检查是否已存在面板，避免重复创建
            if (document.querySelector('.vs-panel-overlay')) {
                return;
            }

            const history = GM_getValue(this.historyKey, []);
            let filteredHistory = [...history];
            let searchQuery = '';

            const overlay = document.createElement('div');
            overlay.className = 'vs-panel-overlay';

            const panel = document.createElement('div');
            panel.className = 'vs-panel';

            const renderHistory = () => {
                panel.innerHTML = `
                    <div class="vs-panel-header">
                        <h3 class="vs-panel-title">📜 历史链接 (${filteredHistory.length}${searchQuery ? '/' + history.length : ''})</h3>
                        <div class="vs-panel-actions">
                            <button class="vs-theme-toggle" title="切换主题">${this.getTheme() === 'dark' ? '☀️' : '🌙'}</button>
                            <button class="vs-panel-close">×</button>
                        </div>
                    </div>
                    ${history.length > 0 ? `
                        <div class="vs-panel-search">
                            <div class="vs-search-container">
                                <input type="text" class="vs-search-input" placeholder="🔍 搜索标题..." value="${searchQuery}" id="vs-search-input">
                                <button class="vs-btn vs-btn-primary vs-search-btn" id="vs-search-btn">搜索</button>
                            </div>
                        </div>
                    ` : ''}
                    <div class="vs-panel-body">
                        ${filteredHistory.length === 0 && !searchQuery ? `
                            <div class="vs-empty">
                                <div class="vs-empty-icon">📜</div>
                                <div class="vs-empty-text">历史记录为空</div>
                            </div>
                        ` : filteredHistory.length === 0 && searchQuery ? `
                            <div class="vs-empty">
                                <div class="vs-empty-icon">🔍</div>
                                <div class="vs-empty-text">没有找到匹配的记录</div>
                            </div>
                        ` : `
                            <ul class="vs-list" id="vs-history">
                                ${filteredHistory.map((item, index) => {
                                    const originalIndex = history.indexOf(item);
                                    return `
                                    <li class="vs-list-item">
                                        <div class="vs-list-item-content">
                                            <div class="vs-list-item-title">📄 ${this.escapeHtml(item.pageTitle || '未知标题')}</div>
                                            <div class="vs-list-item-meta">
                                                🌐 ${item.site} | 📍 ${item.source} | 🕐 ${item.timestamp}
                                            </div>
                                            <div class="vs-history-url" data-url="${this.escapeHtml(item.url)}" title="点击复制">
                                                ${this.truncateUrl(item.url, 80)}
                                            </div>
                                        </div>
                                        <div class="vs-list-item-actions">
                                            <button class="vs-icon-btn success" data-action="copy" data-url="${this.escapeHtml(item.url)}" title="复制链接">📋</button>
                                            <button class="vs-icon-btn danger" data-action="delete" data-index="${originalIndex}" title="删除">🗑️</button>
                                        </div>
                                    </li>
                                `;
                                }).join('')}
                            </ul>
                        `}
                    </div>
                    <div class="vs-panel-footer">
                        ${history.length > 0 ?
                            '<button class="vs-btn vs-btn-success" id="vs-export-csv">📥 导出CSV</button>' : ''}
                        ${history.length > 0 ?
                            '<button class="vs-btn vs-btn-danger" id="vs-clear-history">🗑️ 清空历史</button>' : ''}
                        <button class="vs-btn vs-btn-secondary" id="vs-close">关闭</button>
                    </div>
                `;

                overlay.innerHTML = '';
                overlay.appendChild(panel);

                // 事件处理
                panel.querySelector('.vs-panel-close').addEventListener('click', () => overlay.remove());
                panel.querySelector('.vs-theme-toggle').addEventListener('click', () => {
                    this.toggleTheme();
                    renderHistory();
                });
                panel.querySelector('#vs-close').addEventListener('click', () => overlay.remove());
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) overlay.remove();
                });

                // 搜索功能 - 修改为需要手动触发
                const searchInput = panel.querySelector('#vs-search-input');
                const searchBtn = panel.querySelector('#vs-search-btn');
                if (searchInput && searchBtn) {
                    const performSearch = () => {
                        searchQuery = searchInput.value.trim().toLowerCase();
                        filteredHistory = searchQuery ?
                            history.filter(item =>
                                (item.pageTitle || '').toLowerCase().includes(searchQuery) ||
                                (item.site || '').toLowerCase().includes(searchQuery) ||
                                (item.url || '').toLowerCase().includes(searchQuery)
                            ) : [...history];
                        renderHistory();
                    };

                    // 按回车键搜索
                    searchInput.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            performSearch();
                        }
                    });

                    // 点击搜索按钮搜索
                    searchBtn.addEventListener('click', performSearch);
                }

                // 历史记录操作
                const history_ul = panel.querySelector('#vs-history');
                if (history_ul) {
                    history_ul.addEventListener('click', (e) => {
                        // 复制链接
                        if (e.target.classList.contains('vs-history-url') || e.target.closest('[data-action="copy"]')) {
                            const url = e.target.dataset.url || e.target.closest('[data-action="copy"]').dataset.url;
                            this.copyToClipboard(url);
                        }

                        // 删除记录
                        const deleteBtn = e.target.closest('[data-action="delete"]');
                        if (deleteBtn) {
                            const index = parseInt(deleteBtn.dataset.index);
                            if (confirm('确定要删除这条记录吗？')) {
                                history.splice(index, 1);
                                GM_setValue(this.historyKey, history);
                                filteredHistory = searchQuery ?
                                    history.filter(item =>
                                        (item.pageTitle || '').toLowerCase().includes(searchQuery)
                                    ) : [...history];
                                this.showToast('✅ 已删除', 2000);
                                renderHistory();
                            }
                        }
                    });
                }

                // 导出CSV
                const exportBtn = panel.querySelector('#vs-export-csv');
                if (exportBtn) {
                    exportBtn.addEventListener('click', () => {
                        this.exportHistoryToCSV(filteredHistory);
                    });
                }

                // 清空历史
                const clearBtn = panel.querySelector('#vs-clear-history');
                if (clearBtn) {
                    clearBtn.addEventListener('click', () => {
                        if (confirm('确定要清空历史记录吗？')) {
                            GM_setValue(this.historyKey, []);
                            this.showToast('✅ 历史记录已清空', 2000);
                            overlay.remove();
                        }
                    });
                }
            };

            document.body.appendChild(overlay);
            renderHistory();
        }

        // 保留：复制当前视频链接功能
        copyCurrentVideoUrl() {
            if (!window.videoSniffer) {
                this.showToast('❌ 视频嗅探器未运行', 3000);
                return;
            }

            // 获取所有检测到的视频链接
            const videoUrls = Array.from(window.videoSniffer.detectedUrls);

            if (videoUrls.length === 0) {
                this.showToast('❌ 当前页面未检测到视频链接', 3000);
                return;
            }

            // 使用第一个检测到的视频链接
            const videoUrl = videoUrls[0];

            // 直接复制，不再区分移动端和PC端
            this.copyToClipboard(videoUrl);
        }

        addToHistory(url, source, pageTitle = null) {
            const history = GM_getValue(this.historyKey, []);
            const entry = {
                url: url,
                source: source,
                domain: new URL(url).hostname,
                timestamp: new Date().toLocaleString(),
                site: this.getCurrentSite(),
                pageTitle: pageTitle || document.title || '未知标题'
            };

            // 避免重复添加相同的URL
            if (!history.some(item => item.url === url)) {
                history.unshift(entry); // 新的放在前面
                // 只保留最近50条记录
                if (history.length > 50) {
                    history.splice(50);
                }
                GM_setValue(this.historyKey, history);
            }
        }

        clearWhitelist() {
            if (confirm('确定要清空白名单吗？')) {
                GM_setValue(this.whitelistKey, []);
                this.showToast('✅ 白名单已清空', 2000);

                // 停止脚本
                if (window.videoSniffer) {
                    window.videoSniffer.stop();
                    window.videoSniffer = null;
                }
            }
        }

        clearHistory() {
            if (confirm('确定要清空历史记录吗？')) {
                GM_setValue(this.historyKey, []);
                this.showToast('✅ 历史记录已清空', 2000);
            }
        }

        isCurrentSiteWhitelisted() {
            const site = this.getCurrentSite();
            const whitelist = GM_getValue(this.whitelistKey, []);
            return whitelist.includes(site);
        }

        showToast(message, duration = 2000) {
            const toast = document.createElement('div');
            toast.className = 'video-sniffer-toast';
            toast.innerHTML = `
                <div class="toast-content">
                    <div class="toast-message">${message}</div>
                </div>
            `;

            document.body.appendChild(toast);

            // 显示动画
            setTimeout(() => toast.classList.add('show'), 10);

            // 自动关闭
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.classList.remove('show');
                    setTimeout(() => toast.remove(), 300);
                }
            }, duration);
        }

        truncateUrl(url, maxLength = 40) {
            if (!url) return '';
            if (url.length <= maxLength) return url;
            return url.substring(0, maxLength) + '...';
        }

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // 主题管理
        getTheme() {
            return GM_getValue(this.themeKey, 'light');
        }

        toggleTheme() {
            const currentTheme = this.getTheme();
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            GM_setValue(this.themeKey, newTheme);
            this.applyTheme();
            this.showToast(newTheme === 'dark' ? '🌙 深色模式' : '☀️ 浅色模式', 2000);
        }

        applyTheme() {
            const theme = this.getTheme();
            document.documentElement.setAttribute('data-theme', theme);
        }

        // 复制到剪贴板（简化版，移除移动端确认）
        copyToClipboard(text) {
            // 直接复制，不再需要移动端确认
            this.performCopy(text);
        }

        // 执行复制操作
        performCopy(text) {
            // 尝试使用 GM_setClipboard
            try {
                GM_setClipboard(text);
                this.showToast('✅ 链接已复制', 2000);
                return;
            } catch (e) {
                console.log('GM_setClipboard失败，尝试其他方法');
            }

            // 尝试使用 Clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                    this.showToast('✅ 链接已复制', 2000);
                }).catch(err => {
                    console.error('Clipboard API失败:', err);
                    this.fallbackCopy(text);
                });
            } else {
                this.fallbackCopy(text);
            }
        }

        // 后备复制方法
        fallbackCopy(text) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.top = '0';
            textArea.style.left = '0';
            textArea.style.width = '2em';
            textArea.style.height = '2em';
            textArea.style.padding = '0';
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            textArea.style.background = 'transparent';
            textArea.style.opacity = '0';

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    this.showToast('✅ 链接已复制', 2000);
                } else {
                    this.showToast('⚠️ 请手动复制链接', 3000);
                }
            } catch (err) {
                console.error('复制失败:', err);
                this.showToast('⚠️ 请手动复制链接', 3000);
            }

            document.body.removeChild(textArea);
        }

        // 导出为CSV
        exportHistoryToCSV(history) {
            const csvContent = [
                ['序号', '网页标题', '视频链接', '网站', '来源', '时间'],
                ...history.map((item, index) => [
                    index + 1,
                    item.pageTitle || '未知标题',
                    item.url,
                    item.site,
                    item.source,
                    item.timestamp
                ])
            ].map(row =>
                row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
            ).join('\n');

            const BOM = '\uFEFF';
            const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `视频链接历史_${new Date().toLocaleDateString()}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            this.showToast('✅ CSV已导出', 2000);
        }
    }

    // 视频嗅探器类（简化版，移除移动端增强检测）
    class VideoSniffer {
        constructor() {
            this.detectedUrls = new Set();
            this.observers = [];
            this.firstVideoDetected = false;
            this.init();
        }

        init() {
            console.log('视频嗅探器已启动');
            this.setupMessageListener();
            this.setupSniffing();
        }

        stop() {
            // 停止所有观察器
            this.observers.forEach(observer => {
                if (observer && typeof observer.disconnect === 'function') {
                    observer.disconnect();
                }
            });
            this.observers = [];

            console.log('视频嗅探器已停止');
        }

        setupMessageListener() {
            // 监听来自iframe的消息
            const messageHandler = (event) => {
                try {
                    const data = event.data;
                    let videoUrl = null;
                    let source = 'iframe';

                    if (data && data.type === 'VIDEO_URL' && data.url) {
                        videoUrl = data.url;
                        // iframe发来的视频，使用顶层窗口（壳页面）的标题
                        source = 'iframe';
                    } else if (typeof data === 'string' && this.isMainVideoUrl(data)) {
                        videoUrl = data;
                    }

                    if (videoUrl && this.isMainVideoUrl(videoUrl)) {
                        // 使用顶层窗口的标题（壳页面标题）
                        this.handleDetectedUrl(videoUrl, source, document.title);
                    }
                } catch (e) {
                    console.error('处理消息时出错:', e);
                }
            };

            window.addEventListener('message', messageHandler);
            this.observers.push({ type: 'event', handler: messageHandler });

            // 如果当前在iframe中，设置发送功能
            if (window.self !== window.top) {
                this.setupIframeSender();
            }
        }

        setupIframeSender() {
            // 监听DOM变化
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            if (node.tagName === 'VIDEO' && node.src) {
                                // iframe中检测到视频，只发送给父窗口，不在本地处理
                                this.sendVideoUrlToParent(node.src);
                            }

                            if (node.querySelectorAll) {
                                node.querySelectorAll('video[src]').forEach(video => {
                                    // iframe中检测到视频，只发送给父窗口，不在本地处理
                                    this.sendVideoUrlToParent(video.src);
                                });
                            }
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            this.observers.push(observer);

            // 检查已存在的video元素
            document.querySelectorAll('video[src]').forEach(video => {
                this.sendVideoUrlToParent(video.src);
            });

            // 在iframe中也监听网络请求，但只发送给父窗口
            if (window.PerformanceObserver) {
                const perfObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        if (this.isMainVideoUrl(entry.name)) {
                            this.sendVideoUrlToParent(entry.name);
                        }
                    });
                });

                perfObserver.observe({entryTypes: ['resource']});
                this.observers.push(perfObserver);
            }
        }

        sendVideoUrlToParent(url) {
            if (!this.isMainVideoUrl(url)) return;

            try {
                // 只发送视频URL，不发送标题
                // 标题由顶层窗口（壳页面）负责获取
                window.parent.postMessage({
                    type: 'VIDEO_URL',
                    url: url,
                    source: location.href,
                    timestamp: Date.now()
                }, '*');
            } catch (e) {
                console.error('向父窗口发送消息失败:', e);
            }
        }

        setupSniffing() {
            // 如果在iframe中，不设置本地监听，只负责发送消息给父窗口
            if (window.self !== window.top) {
                console.log('在iframe中运行，只发送视频信息给父窗口');
                return;
            }

            // 只在顶层窗口中设置监听
            console.log('在顶层窗口中运行，开始监听视频');

            // 监听DOM变化
            const domObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            if (node.tagName === 'VIDEO' && node.src) {
                                this.handleDetectedUrl(node.src, 'dom', document.title);
                            }

                            if (node.querySelectorAll) {
                                node.querySelectorAll('video[src]').forEach(video => {
                                    this.handleDetectedUrl(video.src, 'dom', document.title);
                                });
                            }
                        }
                    });
                });
            });

            domObserver.observe(document.body, {
                childList: true,
                subtree: true
            });

            this.observers.push(domObserver);

            // 检查已存在的video元素
            document.querySelectorAll('video[src]').forEach(video => {
                this.handleDetectedUrl(video.src, 'dom', document.title);
            });

            // 监听网络请求
            if (window.PerformanceObserver) {
                const perfObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        if (this.isMainVideoUrl(entry.name)) {
                            this.handleDetectedUrl(entry.name, 'network', document.title);
                        }
                    });
                });

                perfObserver.observe({entryTypes: ['resource']});
                this.observers.push(perfObserver);
            }

            // 10秒后如果还没检测到视频，显示提示
            setTimeout(() => {
                if (!this.firstVideoDetected) {
                    whitelistManager.showToast('🔍 正在检测视频...', 3000);
                }
            }, 10000);
        }

        handleDetectedUrl(url, source, pageTitle = null) {
            if (!this.isMainVideoUrl(url) || this.detectedUrls.has(url)) {
                return;
            }

            this.detectedUrls.add(url);
            console.log(`检测到视频链接 (来源: ${source}):`, url);

            // 使用传入的标题，如果没有则使用当前页面标题
            const finalTitle = pageTitle || document.title || '未知标题';

            // 添加到历史记录
            whitelistManager.addToHistory(url, source, finalTitle);

            // 只处理第一个视频链接
            if (!this.firstVideoDetected) {
                this.firstVideoDetected = true;

                // 自动复制到剪贴板
                whitelistManager.copyToClipboard(url);

                // 显示无感通知
                this.showFirstVideoToast();
            }
        }

        showFirstVideoToast() {
            whitelistManager.showToast('✅ 首个视频链接已复制', 2000);
        }

        isMainVideoUrl(url) {
            if (!url || typeof url !== 'string') return false;

            // 排除.ts文件和其他不需要的格式
            const excludePatterns = [
                /\.ts(\?|$)/i,
                /segment/i,
                /chunk/i,
                /part\d+/i,
                /fragment/i
            ];

            if (excludePatterns.some(pattern => pattern.test(url))) {
                return false;
            }

            // 主视频文件格式
            const mainVideoPatterns = [
                /\.mp4(\?|$)/i,
                /\.webm(\?|$)/i,
                /\.ogg(\?|$)/i,
                /\.mov(\?|$)/i,
                /\.m3u8(\?|$)/i,
                /\.flv(\?|$)/i,
                /\.avi(\?|$)/i,
                /\.wmv(\?|$)/i,
                /\.mkv(\?|$)/i,
                /\/video\//i,
                /\/videos\//i,
                /\/playlist\//i
            ];

            return mainVideoPatterns.some(pattern => pattern.test(url));
        }
    }

    // 主执行逻辑
    const whitelistManager = new WhitelistManager();

    // 检查当前网站是否在白名单中
    if (whitelistManager.isCurrentSiteWhitelisted()) {
        // 如果在白名单中，启动视频嗅探器
        window.videoSniffer = new VideoSniffer();
    }
})();