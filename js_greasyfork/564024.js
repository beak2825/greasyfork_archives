// ==UserScript==
// @name         草榴自动下载助手
// @namespace    https://github.com/weiruankeji2025/weiruan-caoliu
// @version      1.0.0
// @description  草榴社区BT种子自动下载助手，支持自动检测磁力链接和种子文件，一键添加到qBittorrent下载
// @author       草榴自动下载助手
// @match        *://*.t66y.com/*
// @match        *://*.cl.*/htmml/200*/*
// @match        *://t66y.com/*
// @match        *://*.t66y.com/htm_data/*
// @match        *://cl.*/htm_data/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_addStyle
// @connect      localhost
// @connect      127.0.0.1
// @connect      *
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564024/%E8%8D%89%E6%A6%B4%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/564024/%E8%8D%89%E6%A6%B4%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置管理 ====================
    const DEFAULT_CONFIG = {
        qbHost: 'http://localhost:8080',
        qbUsername: 'admin',
        qbPassword: 'adminadmin',
        savePath: '',
        autoDownload: false,
        showNotification: true,
        highlightLinks: true
    };

    let config = Object.assign({}, DEFAULT_CONFIG, GM_getValue('config', {}));

    function saveConfig() {
        GM_setValue('config', config);
    }

    // ==================== 样式注入 ====================
    GM_addStyle(`
        /* 主题颜色 */
        :root {
            --cl-primary: #e74c3c;
            --cl-primary-hover: #c0392b;
            --cl-success: #27ae60;
            --cl-warning: #f39c12;
            --cl-info: #3498db;
            --cl-dark: #2c3e50;
            --cl-light: #ecf0f1;
        }

        /* 下载按钮样式 */
        .cl-download-btn {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 10px;
            margin: 2px 4px;
            background: linear-gradient(135deg, var(--cl-primary), var(--cl-primary-hover));
            color: white !important;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            text-decoration: none !important;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .cl-download-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            background: linear-gradient(135deg, var(--cl-primary-hover), #a93226);
        }

        .cl-download-btn.downloading {
            background: linear-gradient(135deg, var(--cl-warning), #e67e22);
            pointer-events: none;
        }

        .cl-download-btn.success {
            background: linear-gradient(135deg, var(--cl-success), #1e8449);
        }

        .cl-download-btn.error {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
        }

        /* 磁力链接高亮 */
        .cl-magnet-highlight {
            background: linear-gradient(90deg, rgba(231,76,60,0.1), rgba(231,76,60,0.05));
            border-left: 3px solid var(--cl-primary);
            padding: 8px 12px;
            margin: 8px 0;
            border-radius: 0 4px 4px 0;
            display: block;
        }

        /* 浮动工具栏 */
        .cl-toolbar {
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .cl-toolbar-btn {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        }

        .cl-toolbar-btn:hover {
            transform: scale(1.1);
        }

        .cl-toolbar-btn.main {
            background: linear-gradient(135deg, var(--cl-primary), var(--cl-primary-hover));
        }

        .cl-toolbar-btn.settings {
            background: linear-gradient(135deg, var(--cl-dark), #1a252f);
            width: 40px;
            height: 40px;
            font-size: 16px;
        }

        /* 设置面板 */
        .cl-settings-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.6);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .cl-settings-overlay.show {
            opacity: 1;
            visibility: visible;
        }

        .cl-settings-panel {
            background: white;
            border-radius: 12px;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            transform: scale(0.9);
            transition: all 0.3s ease;
        }

        .cl-settings-overlay.show .cl-settings-panel {
            transform: scale(1);
        }

        .cl-settings-header {
            background: linear-gradient(135deg, var(--cl-primary), var(--cl-primary-hover));
            color: white;
            padding: 20px;
            border-radius: 12px 12px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .cl-settings-header h2 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
        }

        .cl-settings-close {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
            opacity: 0.8;
            transition: opacity 0.2s;
        }

        .cl-settings-close:hover {
            opacity: 1;
        }

        .cl-settings-body {
            padding: 20px;
        }

        .cl-form-group {
            margin-bottom: 20px;
        }

        .cl-form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--cl-dark);
            font-size: 14px;
        }

        .cl-form-group input[type="text"],
        .cl-form-group input[type="password"] {
            width: 100%;
            padding: 10px 12px;
            border: 2px solid #e0e0e0;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.2s;
            box-sizing: border-box;
        }

        .cl-form-group input:focus {
            outline: none;
            border-color: var(--cl-primary);
        }

        .cl-form-group .hint {
            font-size: 12px;
            color: #888;
            margin-top: 4px;
        }

        .cl-checkbox-group {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .cl-checkbox-group input[type="checkbox"] {
            width: 18px;
            height: 18px;
            cursor: pointer;
        }

        .cl-checkbox-group label {
            margin: 0;
            cursor: pointer;
        }

        .cl-settings-footer {
            padding: 15px 20px;
            border-top: 1px solid #eee;
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }

        .cl-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
        }

        .cl-btn-primary {
            background: var(--cl-primary);
            color: white;
        }

        .cl-btn-primary:hover {
            background: var(--cl-primary-hover);
        }

        .cl-btn-secondary {
            background: #e0e0e0;
            color: var(--cl-dark);
        }

        .cl-btn-secondary:hover {
            background: #d0d0d0;
        }

        .cl-btn-test {
            background: var(--cl-info);
            color: white;
        }

        .cl-btn-test:hover {
            background: #2980b9;
        }

        /* 下载目录选择弹窗 */
        .cl-path-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 12px;
            padding: 20px;
            z-index: 9999999;
            box-shadow: 0 20px 60px rgba(0,0,0,0.4);
            min-width: 400px;
        }

        .cl-path-dialog h3 {
            margin: 0 0 15px;
            color: var(--cl-dark);
        }

        .cl-path-list {
            max-height: 300px;
            overflow-y: auto;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            margin-bottom: 15px;
        }

        .cl-path-item {
            padding: 10px 15px;
            cursor: pointer;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: background 0.2s;
        }

        .cl-path-item:hover {
            background: #f8f9fa;
        }

        .cl-path-item:last-child {
            border-bottom: none;
        }

        .cl-path-item.selected {
            background: rgba(231,76,60,0.1);
            color: var(--cl-primary);
        }

        .cl-path-item .icon {
            font-size: 18px;
        }

        /* Toast通知 */
        .cl-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-size: 14px;
            z-index: 99999999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transform: translateX(120%);
            transition: transform 0.3s ease;
            max-width: 350px;
        }

        .cl-toast.show {
            transform: translateX(0);
        }

        .cl-toast.success {
            background: var(--cl-success);
        }

        .cl-toast.error {
            background: var(--cl-primary);
        }

        .cl-toast.info {
            background: var(--cl-info);
        }

        /* 统计徽章 */
        .cl-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: var(--cl-success);
            color: white;
            font-size: 11px;
            padding: 2px 6px;
            border-radius: 10px;
            font-weight: bold;
        }

        /* 批量下载面板 */
        .cl-batch-panel {
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: white;
            border-radius: 12px;
            padding: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 99998;
            min-width: 280px;
            display: none;
        }

        .cl-batch-panel.show {
            display: block;
        }

        .cl-batch-panel h4 {
            margin: 0 0 10px;
            color: var(--cl-dark);
            font-size: 14px;
        }

        .cl-batch-list {
            max-height: 200px;
            overflow-y: auto;
            margin-bottom: 10px;
        }

        .cl-batch-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 12px;
        }

        .cl-batch-item input {
            margin: 0;
        }

        .cl-batch-actions {
            display: flex;
            gap: 8px;
        }
    `);

    // ==================== qBittorrent API ====================
    class QBittorrentAPI {
        constructor() {
            this.sid = null;
            this.isLoggedIn = false;
        }

        async login() {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${config.qbHost}/api/v2/auth/login`,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: `username=${encodeURIComponent(config.qbUsername)}&password=${encodeURIComponent(config.qbPassword)}`,
                    onload: (response) => {
                        if (response.status === 200 && response.responseText === 'Ok.') {
                            this.isLoggedIn = true;
                            // 提取SID cookie
                            const cookies = response.responseHeaders;
                            const sidMatch = cookies.match(/SID=([^;]+)/);
                            if (sidMatch) {
                                this.sid = sidMatch[1];
                            }
                            resolve(true);
                        } else {
                            reject(new Error('登录失败，请检查用户名和密码'));
                        }
                    },
                    onerror: (error) => {
                        reject(new Error('无法连接到qBittorrent，请确保已启动并开启Web UI'));
                    }
                });
            });
        }

        async addTorrent(magnetOrUrl, savePath = '') {
            if (!this.isLoggedIn) {
                await this.login();
            }

            return new Promise((resolve, reject) => {
                let formData = `urls=${encodeURIComponent(magnetOrUrl)}`;
                if (savePath) {
                    formData += `&savepath=${encodeURIComponent(savePath)}`;
                }
                // 高速下载设置
                formData += '&sequentialDownload=false';
                formData += '&firstLastPiecePrio=true';

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${config.qbHost}/api/v2/torrents/add`,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: formData,
                    onload: (response) => {
                        if (response.status === 200 && response.responseText === 'Ok.') {
                            resolve(true);
                        } else {
                            reject(new Error('添加种子失败'));
                        }
                    },
                    onerror: (error) => {
                        reject(new Error('请求失败'));
                    }
                });
            });
        }

        async getDefaultSavePath() {
            if (!this.isLoggedIn) {
                await this.login();
            }

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${config.qbHost}/api/v2/app/defaultSavePath`,
                    onload: (response) => {
                        if (response.status === 200) {
                            resolve(response.responseText);
                        } else {
                            reject(new Error('获取默认保存路径失败'));
                        }
                    },
                    onerror: (error) => {
                        reject(new Error('请求失败'));
                    }
                });
            });
        }

        async getPreferences() {
            if (!this.isLoggedIn) {
                await this.login();
            }

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${config.qbHost}/api/v2/app/preferences`,
                    onload: (response) => {
                        if (response.status === 200) {
                            resolve(JSON.parse(response.responseText));
                        } else {
                            reject(new Error('获取偏好设置失败'));
                        }
                    },
                    onerror: (error) => {
                        reject(new Error('请求失败'));
                    }
                });
            });
        }

        async testConnection() {
            try {
                await this.login();
                return { success: true, message: '连接成功！' };
            } catch (error) {
                return { success: false, message: error.message };
            }
        }
    }

    const qbApi = new QBittorrentAPI();

    // ==================== 工具函数 ====================
    function showToast(message, type = 'info') {
        const existing = document.querySelector('.cl-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `cl-toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);

        if (config.showNotification) {
            GM_notification({
                title: '草榴自动下载助手',
                text: message,
                timeout: 3000
            });
        }
    }

    function extractMagnetLinks() {
        const magnets = [];
        const links = document.querySelectorAll('a[href^="magnet:"]');
        links.forEach(link => {
            const href = link.href;
            if (!magnets.includes(href)) {
                magnets.push({
                    url: href,
                    name: extractMagnetName(href),
                    element: link
                });
            }
        });

        // 同时检测页面文本中的磁力链接
        const textContent = document.body.innerText;
        const magnetRegex = /magnet:\?xt=urn:btih:[a-zA-Z0-9]{32,}/gi;
        const textMagnets = textContent.match(magnetRegex) || [];
        textMagnets.forEach(magnet => {
            if (!magnets.find(m => m.url === magnet)) {
                magnets.push({
                    url: magnet,
                    name: extractMagnetName(magnet),
                    element: null
                });
            }
        });

        return magnets;
    }

    function extractMagnetName(magnetUrl) {
        const dnMatch = magnetUrl.match(/dn=([^&]+)/);
        if (dnMatch) {
            return decodeURIComponent(dnMatch[1]);
        }
        const hashMatch = magnetUrl.match(/btih:([a-zA-Z0-9]+)/i);
        if (hashMatch) {
            return hashMatch[1].substring(0, 16) + '...';
        }
        return '未知种子';
    }

    function extractTorrentLinks() {
        const torrents = [];
        const links = document.querySelectorAll('a[href$=".torrent"]');
        links.forEach(link => {
            const href = link.href;
            if (!torrents.find(t => t.url === href)) {
                torrents.push({
                    url: href,
                    name: link.textContent.trim() || href.split('/').pop(),
                    element: link
                });
            }
        });
        return torrents;
    }

    // ==================== 下载功能 ====================
    async function downloadTorrent(magnetOrUrl, button = null) {
        if (button) {
            button.classList.add('downloading');
            button.innerHTML = '⏳ 添加中...';
        }

        try {
            const savePath = config.savePath || '';
            await qbApi.addTorrent(magnetOrUrl, savePath);

            if (button) {
                button.classList.remove('downloading');
                button.classList.add('success');
                button.innerHTML = '✓ 已添加';
            }

            showToast('种子已添加到qBittorrent！', 'success');

            // 尝试打开qBittorrent客户端
            setTimeout(() => {
                window.open(config.qbHost, '_blank');
            }, 500);

            return true;
        } catch (error) {
            if (button) {
                button.classList.remove('downloading');
                button.classList.add('error');
                button.innerHTML = '✗ 失败';
            }

            showToast(error.message, 'error');
            return false;
        }
    }

    async function batchDownload(urls) {
        let success = 0;
        let failed = 0;

        for (const url of urls) {
            try {
                await qbApi.addTorrent(url, config.savePath);
                success++;
            } catch (error) {
                failed++;
            }
        }

        showToast(`批量下载完成: ${success}成功, ${failed}失败`, success > 0 ? 'success' : 'error');

        if (success > 0) {
            window.open(config.qbHost, '_blank');
        }
    }

    // ==================== UI组件 ====================
    function createDownloadButton(item, type = 'magnet') {
        const btn = document.createElement('button');
        btn.className = 'cl-download-btn';
        btn.innerHTML = `📥 下载`;
        btn.title = item.name;
        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            downloadTorrent(item.url, btn);
        };
        return btn;
    }

    function highlightLinks() {
        if (!config.highlightLinks) return;

        const magnets = extractMagnetLinks();
        magnets.forEach(item => {
            if (item.element && !item.element.dataset.clProcessed) {
                item.element.dataset.clProcessed = 'true';

                // 创建包装容器
                const wrapper = document.createElement('span');
                wrapper.className = 'cl-magnet-highlight';

                // 插入下载按钮
                const btn = createDownloadButton(item);
                item.element.parentNode.insertBefore(wrapper, item.element);
                wrapper.appendChild(item.element.cloneNode(true));
                wrapper.appendChild(btn);
                item.element.remove();
            }
        });

        const torrents = extractTorrentLinks();
        torrents.forEach(item => {
            if (item.element && !item.element.dataset.clProcessed) {
                item.element.dataset.clProcessed = 'true';
                const btn = createDownloadButton(item, 'torrent');
                item.element.parentNode.insertBefore(btn, item.element.nextSibling);
            }
        });
    }

    function createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'cl-toolbar';

        const magnets = extractMagnetLinks();
        const torrents = extractTorrentLinks();
        const totalLinks = magnets.length + torrents.length;

        // 主按钮
        const mainBtn = document.createElement('button');
        mainBtn.className = 'cl-toolbar-btn main';
        mainBtn.innerHTML = '📥';
        mainBtn.title = `发现 ${totalLinks} 个下载链接`;
        mainBtn.style.position = 'relative';

        if (totalLinks > 0) {
            const badge = document.createElement('span');
            badge.className = 'cl-badge';
            badge.textContent = totalLinks;
            mainBtn.appendChild(badge);
        }

        mainBtn.onclick = () => toggleBatchPanel();

        // 设置按钮
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'cl-toolbar-btn settings';
        settingsBtn.innerHTML = '⚙️';
        settingsBtn.title = '设置';
        settingsBtn.onclick = () => showSettings();

        toolbar.appendChild(mainBtn);
        toolbar.appendChild(settingsBtn);
        document.body.appendChild(toolbar);

        // 创建批量下载面板
        createBatchPanel(magnets, torrents);
    }

    function createBatchPanel(magnets, torrents) {
        const panel = document.createElement('div');
        panel.className = 'cl-batch-panel';
        panel.id = 'cl-batch-panel';

        const allItems = [...magnets, ...torrents];

        panel.innerHTML = `
            <h4>📥 发现 ${allItems.length} 个下载链接</h4>
            <div class="cl-batch-list">
                ${allItems.map((item, index) => `
                    <div class="cl-batch-item">
                        <input type="checkbox" id="cl-item-${index}" data-url="${item.url}" checked>
                        <label for="cl-item-${index}" title="${item.url}">${item.name.substring(0, 40)}${item.name.length > 40 ? '...' : ''}</label>
                    </div>
                `).join('')}
            </div>
            <div class="cl-batch-actions">
                <button class="cl-btn cl-btn-primary" id="cl-batch-download">全部下载</button>
                <button class="cl-btn cl-btn-secondary" id="cl-select-all">全选/取消</button>
            </div>
        `;

        document.body.appendChild(panel);

        // 绑定事件
        document.getElementById('cl-batch-download').onclick = () => {
            const checkedItems = panel.querySelectorAll('input[type="checkbox"]:checked');
            const urls = Array.from(checkedItems).map(cb => cb.dataset.url);
            if (urls.length > 0) {
                batchDownload(urls);
            } else {
                showToast('请至少选择一个下载链接', 'error');
            }
        };

        document.getElementById('cl-select-all').onclick = () => {
            const checkboxes = panel.querySelectorAll('input[type="checkbox"]');
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            checkboxes.forEach(cb => cb.checked = !allChecked);
        };
    }

    function toggleBatchPanel() {
        const panel = document.getElementById('cl-batch-panel');
        if (panel) {
            panel.classList.toggle('show');
        }
    }

    function createSettingsPanel() {
        const overlay = document.createElement('div');
        overlay.className = 'cl-settings-overlay';
        overlay.id = 'cl-settings-overlay';

        overlay.innerHTML = `
            <div class="cl-settings-panel">
                <div class="cl-settings-header">
                    <h2>⚙️ 草榴自动下载助手 设置</h2>
                    <button class="cl-settings-close" id="cl-settings-close">&times;</button>
                </div>
                <div class="cl-settings-body">
                    <div class="cl-form-group">
                        <label>qBittorrent Web UI 地址</label>
                        <input type="text" id="cl-qb-host" value="${config.qbHost}" placeholder="http://localhost:8080">
                        <div class="hint">默认: http://localhost:8080</div>
                    </div>
                    <div class="cl-form-group">
                        <label>用户名</label>
                        <input type="text" id="cl-qb-username" value="${config.qbUsername}" placeholder="admin">
                    </div>
                    <div class="cl-form-group">
                        <label>密码</label>
                        <input type="password" id="cl-qb-password" value="${config.qbPassword}" placeholder="adminadmin">
                    </div>
                    <div class="cl-form-group">
                        <label>默认保存路径</label>
                        <input type="text" id="cl-save-path" value="${config.savePath}" placeholder="留空使用qBittorrent默认路径">
                        <div class="hint">例如: /downloads 或 D:\\Downloads</div>
                    </div>
                    <div class="cl-form-group">
                        <div class="cl-checkbox-group">
                            <input type="checkbox" id="cl-auto-download" ${config.autoDownload ? 'checked' : ''}>
                            <label for="cl-auto-download">自动下载检测到的链接</label>
                        </div>
                    </div>
                    <div class="cl-form-group">
                        <div class="cl-checkbox-group">
                            <input type="checkbox" id="cl-show-notification" ${config.showNotification ? 'checked' : ''}>
                            <label for="cl-show-notification">显示桌面通知</label>
                        </div>
                    </div>
                    <div class="cl-form-group">
                        <div class="cl-checkbox-group">
                            <input type="checkbox" id="cl-highlight-links" ${config.highlightLinks ? 'checked' : ''}>
                            <label for="cl-highlight-links">高亮显示下载链接</label>
                        </div>
                    </div>
                </div>
                <div class="cl-settings-footer">
                    <button class="cl-btn cl-btn-test" id="cl-test-connection">测试连接</button>
                    <button class="cl-btn cl-btn-secondary" id="cl-settings-cancel">取消</button>
                    <button class="cl-btn cl-btn-primary" id="cl-settings-save">保存</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // 绑定事件
        document.getElementById('cl-settings-close').onclick = hideSettings;
        document.getElementById('cl-settings-cancel').onclick = hideSettings;
        overlay.onclick = (e) => {
            if (e.target === overlay) hideSettings();
        };

        document.getElementById('cl-settings-save').onclick = () => {
            config.qbHost = document.getElementById('cl-qb-host').value.trim();
            config.qbUsername = document.getElementById('cl-qb-username').value.trim();
            config.qbPassword = document.getElementById('cl-qb-password').value;
            config.savePath = document.getElementById('cl-save-path').value.trim();
            config.autoDownload = document.getElementById('cl-auto-download').checked;
            config.showNotification = document.getElementById('cl-show-notification').checked;
            config.highlightLinks = document.getElementById('cl-highlight-links').checked;
            saveConfig();
            showToast('设置已保存！', 'success');
            hideSettings();
            // 重新处理页面
            highlightLinks();
        };

        document.getElementById('cl-test-connection').onclick = async () => {
            const btn = document.getElementById('cl-test-connection');
            btn.textContent = '测试中...';
            btn.disabled = true;

            // 临时更新配置用于测试
            const tempHost = document.getElementById('cl-qb-host').value.trim();
            const tempUser = document.getElementById('cl-qb-username').value.trim();
            const tempPass = document.getElementById('cl-qb-password').value;

            const originalHost = config.qbHost;
            const originalUser = config.qbUsername;
            const originalPass = config.qbPassword;

            config.qbHost = tempHost;
            config.qbUsername = tempUser;
            config.qbPassword = tempPass;

            const result = await qbApi.testConnection();

            config.qbHost = originalHost;
            config.qbUsername = originalUser;
            config.qbPassword = originalPass;

            btn.textContent = '测试连接';
            btn.disabled = false;

            showToast(result.message, result.success ? 'success' : 'error');
        };
    }

    function showSettings() {
        let overlay = document.getElementById('cl-settings-overlay');
        if (!overlay) {
            createSettingsPanel();
            overlay = document.getElementById('cl-settings-overlay');
        }
        // 更新表单值
        document.getElementById('cl-qb-host').value = config.qbHost;
        document.getElementById('cl-qb-username').value = config.qbUsername;
        document.getElementById('cl-qb-password').value = config.qbPassword;
        document.getElementById('cl-save-path').value = config.savePath;
        document.getElementById('cl-auto-download').checked = config.autoDownload;
        document.getElementById('cl-show-notification').checked = config.showNotification;
        document.getElementById('cl-highlight-links').checked = config.highlightLinks;

        overlay.classList.add('show');
    }

    function hideSettings() {
        const overlay = document.getElementById('cl-settings-overlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    }

    // ==================== 初始化 ====================
    function init() {
        console.log('🌿 草榴自动下载助手 v1.0.0 已加载');

        // 注册菜单命令
        GM_registerMenuCommand('⚙️ 设置', showSettings);
        GM_registerMenuCommand('📥 批量下载', toggleBatchPanel);

        // 创建UI
        createToolbar();
        highlightLinks();

        // 自动下载功能
        if (config.autoDownload) {
            const magnets = extractMagnetLinks();
            if (magnets.length > 0) {
                showToast(`检测到 ${magnets.length} 个磁力链接，开始自动下载...`, 'info');
                batchDownload(magnets.map(m => m.url));
            }
        }

        // 监听动态内容
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && (node.querySelector('a[href^="magnet:"]') || node.querySelector('a[href$=".torrent"]'))) {
                            shouldUpdate = true;
                        }
                    });
                }
            });
            if (shouldUpdate) {
                highlightLinks();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2026-01-25
// @description  try to take over the world!
// @author       You
// @match        https://github.com/weiruankeji2025/weiruan-caoliu/blob/main/caoliu-auto-download.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();