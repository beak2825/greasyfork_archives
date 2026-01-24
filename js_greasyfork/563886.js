// ==UserScript==
// @name         论坛已读标记
// @namespace    https://felixchristian.dev/userscripts/multi-forum-read-marker
// @version      1.2.0
// @description  论坛帖子阅读标记工具 - 自动记录已读帖子，支持多站点、导入导出、JSONBin云同步
// @author       Felix + ChatGPT + Gemini
// @license      MIT
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/563886/%E8%AE%BA%E5%9D%9B%E5%B7%B2%E8%AF%BB%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/563886/%E8%AE%BA%E5%9D%9B%E5%B7%B2%E8%AF%BB%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==
/**
 * 论坛已读标记 - 论坛帖子阅读标记工具
 *
 * 功能说明：
 * - 自动记录打开过的帖子为「已读」状态
 * - 在论坛列表页显示 [已读] 标记，避免重复阅读
 * - 支持多站点统一管理（可自定义域名和别名）
 * - 支持导入/导出记录，方便备份和迁移
 * - 支持 JSONBin 云端同步，跨设备使用
 */
(function () {
    'use strict';
    // ==================== 存储键 ====================
    const DOMAIN_CONFIG_KEY = 'forum_domain_config';
    const DOMAIN_INDEX_KEY = 'visitedTids_index';
    const JSONBIN_BASE = 'https://api.jsonbin.io/v3/b';
    // ==================== iframe 检测 ====================
    // 防止在 iframe 中重复创建面板
    if (window !== window.top) {
        return; // 在 iframe 中不运行
    }
    // ==================== 默认域名配置 ====================
    const DEFAULT_DOMAIN_CONFIG = [
        {
            name: 'soutong',
            primary: 'soutong.men',
            aliases: ['stboy.net', '74.222.3.60'],
            listPattern: 'forum.php?mod=forumdisplay',
            threadPattern: 'forum.php?mod=viewthread',
            linkSelector: 'a.s.xst'
        },
        {
            name: 'tt1069',
            primary: 'www.tt1069.com',
            aliases: [],
            listPattern: 'forum',
            threadPattern: 'thread-',
            linkSelector: 'a.s.xst'
        }
    ];
    // ==================== 加载域名配置 ====================
    function loadDomainConfig() {
        const config = GM_getValue(DOMAIN_CONFIG_KEY, null);
        if (!config || !Array.isArray(config) || config.length === 0) {
            GM_setValue(DOMAIN_CONFIG_KEY, DEFAULT_DOMAIN_CONFIG);
            return DEFAULT_DOMAIN_CONFIG;
        }
        return config;
    }
    function saveDomainConfig(config) {
        GM_setValue(DOMAIN_CONFIG_KEY, config);
    }
    // ==================== 检测当前站点 ====================
    function getCurrentSiteConfig() {
        const currentHost = location.hostname;
        const config = loadDomainConfig();
        for (const site of config) {
            if (site.primary === currentHost || site.aliases?.includes(currentHost)) {
                return site;
            }
        }
        return null;
    }
    const siteConfig = getCurrentSiteConfig();
    // 如果当前站点不在配置中，不运行脚本主逻辑
    if (!siteConfig) {
        // 仍然注入一个小按钮，方便用户添加当前站点
        injectAddSiteButton();
        return;
    }
    const hostname = siteConfig.primary;
    const STORAGE_KEY = `visitedTids_${hostname}`;
    // ==================== 自定义弹窗系统 ====================
    function createModal(options) {
        const { title, content, buttons, onClose } = options;
        // 遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'rm-modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(4px);
        `;
        // 弹窗容器
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: linear-gradient(135deg, rgba(30,30,30,0.98), rgba(20,20,20,0.99));
            color: #fff;
            border-radius: 12px;
            padding: 20px 24px;
            min-width: 320px;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.1);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        `;
        // 标题
        if (title) {
            const titleEl = document.createElement('div');
            titleEl.style.cssText = `
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 16px;
                padding-bottom: 12px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            `;
            titleEl.textContent = title;
            modal.appendChild(titleEl);
        }
        // 内容
        const contentEl = document.createElement('div');
        contentEl.style.cssText = `
            font-size: 14px;
            line-height: 1.6;
            color: #ccc;
        `;
        if (typeof content === 'string') {
            contentEl.innerHTML = content;
        } else {
            contentEl.appendChild(content);
        }
        modal.appendChild(contentEl);
        // 按钮区
        if (buttons && buttons.length > 0) {
            const btnContainer = document.createElement('div');
            btnContainer.style.cssText = `
                display: flex;
                gap: 10px;
                justify-content: flex-end;
                margin-top: 20px;
                padding-top: 16px;
                border-top: 1px solid rgba(255,255,255,0.1);
            `;
            buttons.forEach(btn => {
                const btnEl = document.createElement('button');
                btnEl.textContent = btn.text;
                btnEl.style.cssText = `
                    padding: 8px 16px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 13px;
                    transition: all 0.2s;
                    ${btn.primary
                        ? 'background: #4CAF50; color: #fff;'
                        : 'background: rgba(255,255,255,0.15); color: #fff;'}
                `;
                btnEl.onmouseover = () => btnEl.style.opacity = '0.8';
                btnEl.onmouseout = () => btnEl.style.opacity = '1';
                btnEl.onclick = () => {
                    closeModal();
                    btn.onClick?.();
                };
                btnContainer.appendChild(btnEl);
            });
            modal.appendChild(btnContainer);
        }
        function closeModal() {
            overlay.remove();
            onClose?.();
        }
        overlay.appendChild(modal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
        document.body.appendChild(overlay);
        return { close: closeModal, modal, overlay };
    }
    function showAlert(message, title = '提示') {
        return new Promise(resolve => {
            createModal({
                title,
                content: message,
                buttons: [{ text: '确定', primary: true, onClick: resolve }]
            });
        });
    }
    function showConfirm(message, title = '确认') {
        return new Promise(resolve => {
            createModal({
                title,
                content: message,
                buttons: [
                    { text: '取消', onClick: () => resolve(false) },
                    { text: '确定', primary: true, onClick: () => resolve(true) }
                ]
            });
        });
    }
    function showPrompt(message, defaultValue = '', title = '输入') {
        return new Promise(resolve => {
            const container = document.createElement('div');
            container.innerHTML = `
                <div style="margin-bottom: 12px;">${message}</div>
                <input type="text" value="${defaultValue}" style="
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 6px;
                    background: rgba(0,0,0,0.3);
                    color: #fff;
                    font-size: 14px;
                    box-sizing: border-box;
                ">
            `;
            const input = container.querySelector('input');
            createModal({
                title,
                content: container,
                buttons: [
                    { text: '取消', onClick: () => resolve(null) },
                    { text: '确定', primary: true, onClick: () => resolve(input.value) }
                ]
            });
            setTimeout(() => input.focus(), 100);
        });
    }
    // ==================== 工具函数 ====================
    function formatDate(date = new Date()) {
        const pad = n => String(n).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
            `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }
    function getTidFromUrl(url) {
        try {
            const u = new URL(url, location.origin);
            let tid = u.searchParams.get('tid');
            if (!tid) {
                const match = url.match(/thread-(\d+)-/);
                tid = match?.[1] ?? null;
            }
            return tid;
        } catch {
            return null;
        }
    }
    // ==================== 存储操作 ====================
    function loadVisited() {
        try {
            const data = GM_getValue(STORAGE_KEY, {});
            return (typeof data === 'object' && data !== null) ? data : {};
        } catch {
            return {};
        }
    }
    function markAsRead(tid) {
        if (!tid) return;
        const freshData = loadVisited();
        if (!freshData[tid]) {
            freshData[tid] = { visitedAt: formatDate() };
            try {
                GM_setValue(STORAGE_KEY, freshData);
            } catch (e) {
                console.error('[ReadMarker] 保存失败：', e);
            }
        }
    }
    function isRead(tid) {
        if (!tid) return false;
        const data = loadVisited();
        return !!data[tid];
    }
    function getLatestReadDate() {
        const data = loadVisited();
        let latest = null;
        for (const tid in data) {
            const visitedAt = data[tid]?.visitedAt;
            if (visitedAt && (!latest || visitedAt > latest)) {
                latest = visitedAt;
            }
        }
        return latest;
    }
    function getDomainIndex() {
        const idx = GM_getValue(DOMAIN_INDEX_KEY, []);
        return Array.isArray(idx) ? idx : [];
    }
    function updateDomainIndex() {
        const domainList = getDomainIndex();
        if (!domainList.includes(hostname)) {
            domainList.push(hostname);
            GM_setValue(DOMAIN_INDEX_KEY, domainList);
        }
    }
    // ==================== 页面类型检测 ====================
    function isForumListPage() {
        const url = location.href;
        const pattern = siteConfig.listPattern;
        return url.includes(pattern) || /forum-\d+-\d+\.html/.test(location.pathname);
    }
    function isThreadPage() {
        const url = location.href;
        const pattern = siteConfig.threadPattern;
        return url.includes(pattern) || /thread-\d+-/.test(location.pathname);
    }
    // ==================== 共享样式 ====================
    const PANEL_STYLE = `
        position: fixed;
        z-index: 9999;
        background: linear-gradient(135deg, rgba(0,0,0,0.85), rgba(20,20,20,0.95));
        color: #fff;
        border-radius: 10px;
        font-size: 12px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        box-shadow: 0 4px 16px rgba(0,0,0,0.4);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1);
    `;
    // ==================== UI: 统一面板 ====================
    let panelState = 'collapsed';
    function createUnifiedPanel() {
        if (document.getElementById('read-marker-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'read-marker-panel';
        panel.style.cssText = PANEL_STYLE + `
            top: 10px;
            left: 10px;
            padding: 10px 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            min-width: 160px;
        `;
        updatePanelContent(panel);
        document.body.appendChild(panel);
    }
    function updatePanelContent(panel) {
        const latestDate = getLatestReadDate();
        const data = loadVisited();
        const totalCount = Object.keys(data).length;
        let content = '';
        switch (panelState) {
            case 'collapsed':
                content = `
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span>📖 ${latestDate ? `上次: ${latestDate}` : '暂无记录'}</span>
                        <span style="margin-left: 10px; opacity: 0.6;">⚙️</span>
                    </div>
                `;
                break;
            case 'stats':
                content = `
                    <div style="margin-bottom: 10px; font-weight: 600; font-size: 13px;">📊 阅读统计</div>
                    <div style="color: #ccc; margin-bottom: 6px;">
                        📖 上次阅读: <span style="color: #4CAF50;">${latestDate || '无'}</span>
                    </div>
                    <div style="color: #ccc; margin-bottom: 10px;">
                        📚 已读帖子: <span style="color: #2196F3;">${totalCount} 篇</span>
                    </div>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        ${createPanelButton('📤 导出', 'export')}
                        ${createPanelButton('📥 导入', 'import')}
                        ${createPanelButton('🗑️ 清除', 'clear')}
                    </div>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
                        ${createPanelButton('☁️ 备份', 'upload')}
                        ${createPanelButton('⬇️ 恢复', 'download')}
                        ${createPanelButton('🔧 云设置', 'config')}
                    </div>
                    <div style="display: flex; gap: 8px; margin-top: 8px;">
                        ${createPanelButton('🌐 站点', 'sites')}
                        ${createPanelButton('❓ 帮助', 'help')}
                    </div>
                    <div style="color: #666; font-size: 10px; margin-top: 10px; text-align: center;">点击空白处收起</div>
                `;
                break;
            case 'help':
                content = `
                    <div style="margin-bottom: 10px; font-weight: 600; font-size: 13px;">❓ 使用说明</div>
                    <div style="color: #ccc; line-height: 1.6; max-width: 280px;">
                        <div style="margin-bottom: 8px;"><strong style="color: #4CAF50;">📌 基本使用</strong></div>
                        <div style="margin-bottom: 6px;">• 点击或 Ctrl+点击帖子链接，自动标记为已读</div>
                        <div style="margin-bottom: 6px;">• 已读帖子在列表页显示 <span style="color: #e74c3c; font-weight: bold;">[已读]</span> 标记</div>
                        <div style="margin-bottom: 12px;">• 支持快速连续打开多个帖子</div>

                        <div style="margin-bottom: 8px;"><strong style="color: #2196F3;">💾 数据管理</strong></div>
                        <div style="margin-bottom: 6px;">• <strong>导出</strong>: 下载 JSON 格式的阅读记录</div>
                        <div style="margin-bottom: 6px;">• <strong>导入</strong>: 从 JSON 文件恢复记录</div>
                        <div style="margin-bottom: 12px;">• <strong>清除</strong>: 删除所有阅读记录</div>

                        <div style="margin-bottom: 8px;"><strong style="color: #9b59b6;">☁️ 云同步</strong></div>
                        <div style="margin-bottom: 6px;">• 点击「云设置」配置 JSONBin</div>
                        <div style="margin-bottom: 6px;">• 访问 jsonbin.io 创建免费账号</div>
                        <div style="margin-bottom: 6px;">• 创建 Bin，获取 ID 和 Key</div>
                    </div>
                    <div style="display: flex; gap: 8px; margin-top: 12px;">
                        ${createPanelButton('← 返回', 'back')}
                    </div>
                `;
                break;
            case 'sites':
                const domainConfig = loadDomainConfig();
                content = `
                    <div style="margin-bottom: 10px; font-weight: 600; font-size: 13px;">🌐 站点管理</div>
                    <div style="color: #ccc; margin-bottom: 10px; max-height: 200px; overflow-y: auto;">
                        ${domainConfig.map((site, idx) => `
                            <div style="background: rgba(255,255,255,0.05); padding: 8px 10px; border-radius: 6px; margin-bottom: 6px;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="color: #4CAF50; font-weight: 600;">${site.name}</span>
                                    <div>
                                        ${createPanelButton('✏️', `edit-site-${idx}`, true)}
                                        ${createPanelButton('🗑️', `del-site-${idx}`, true)}
                                    </div>
                                </div>
                                <div style="font-size: 11px; color: #888; margin-top: 4px;">
                                    主域名: ${site.primary}
                                </div>
                                ${site.aliases?.length > 0 ? `
                                    <div style="font-size: 11px; color: #666; margin-top: 2px;">
                                        别名: ${site.aliases.join(', ')}
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                    <div style="display: flex; gap: 8px; margin-top: 8px;">
                        ${createPanelButton('➕ 添加站点', 'add-site')}
                        ${createPanelButton('← 返回', 'back')}
                    </div>
                `;
                break;
        }
        panel.innerHTML = content;
        // 绑定事件
        if (panelState === 'collapsed') {
            panel.onclick = (e) => {
                e.stopPropagation();
                panelState = 'stats';
                updatePanelContent(panel);
            };
        } else {
            panel.onclick = (e) => {
                const target = e.target;
                const action = target.dataset?.action;
                if (action) {
                    e.stopPropagation();
                    handlePanelAction(action, panel);
                } else if (target === panel || (target.tagName !== 'BUTTON' && !target.closest('button'))) {
                    panelState = 'collapsed';
                    updatePanelContent(panel);
                }
            };
        }
    }
    function createPanelButton(text, action, small = false) {
        return `<button data-action="${action}" style="
            padding: ${small ? '4px 6px' : '6px 10px'};
            border: none;
            border-radius: 6px;
            background: rgba(255,255,255,0.15);
            color: #fff;
            cursor: pointer;
            font-size: ${small ? '10px' : '11px'};
            transition: background 0.2s;
            white-space: nowrap;
        " onmouseover="this.style.background='rgba(255,255,255,0.25)'"
           onmouseout="this.style.background='rgba(255,255,255,0.15)'">${text}</button>`;
    }
    async function handlePanelAction(action, panel) {
        if (action === 'export') {
            exportVisitedData();
        } else if (action === 'import') {
            triggerImport();
        } else if (action === 'clear') {
            await clearVisitedData();
        } else if (action === 'upload') {
            await uploadToJsonBin();
        } else if (action === 'download') {
            await downloadFromJsonBin();
        } else if (action === 'config') {
            await configureJsonBin();
        } else if (action === 'help') {
            panelState = 'help';
            updatePanelContent(panel);
        } else if (action === 'sites') {
            panelState = 'sites';
            updatePanelContent(panel);
        } else if (action === 'back') {
            panelState = 'stats';
            updatePanelContent(panel);
        } else if (action === 'add-site') {
            await addNewSite();
            updatePanelContent(panel);
        } else if (action.startsWith('edit-site-')) {
            const idx = parseInt(action.replace('edit-site-', ''));
            await editSite(idx);
            updatePanelContent(panel);
        } else if (action.startsWith('del-site-')) {
            const idx = parseInt(action.replace('del-site-', ''));
            await deleteSite(idx);
            updatePanelContent(panel);
        }
    }
    // ==================== 站点管理 ====================
    function showSiteForm(site = null, title = '添加站点') {
        const isEdit = !!site;
        const defaults = site || {
            name: '',
            primary: location.hostname,
            aliases: [],
            listPattern: 'forumdisplay',
            threadPattern: 'viewthread',
            linkSelector: 'a.s.xst'
        };
        const content = document.createElement('div');
        content.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 14px;">
                <div>
                    <label style="display: block; margin-bottom: 6px; color: #ccc; font-size: 12px;">
                        站点名称 <span style="color: #e74c3c;">*</span>
                    </label>
                    <input type="text" id="rm-site-name" value="${defaults.name}" placeholder="如：mybb" style="
                        width: 100%;
                        padding: 10px 12px;
                        border: 1px solid rgba(255,255,255,0.2);
                        border-radius: 6px;
                        background: rgba(0,0,0,0.3);
                        color: #fff;
                        font-size: 14px;
                        box-sizing: border-box;
                    ">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 6px; color: #ccc; font-size: 12px;">
                        主域名 <span style="color: #e74c3c;">*</span>
                    </label>
                    <input type="text" id="rm-site-primary" value="${defaults.primary}" placeholder="如：example.com" style="
                        width: 100%;
                        padding: 10px 12px;
                        border: 1px solid rgba(255,255,255,0.2);
                        border-radius: 6px;
                        background: rgba(0,0,0,0.3);
                        color: #fff;
                        font-size: 14px;
                        box-sizing: border-box;
                    ">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 6px; color: #ccc; font-size: 12px;">
                        别名域名 <span style="color: #888; font-weight: normal;">（逗号分隔，可留空）</span>
                    </label>
                    <input type="text" id="rm-site-aliases" value="${defaults.aliases?.join(', ') || ''}" placeholder="如：backup.com, 1.2.3.4" style="
                        width: 100%;
                        padding: 10px 12px;
                        border: 1px solid rgba(255,255,255,0.2);
                        border-radius: 6px;
                        background: rgba(0,0,0,0.3);
                        color: #fff;
                        font-size: 14px;
                        box-sizing: border-box;
                    ">
                </div>
                <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 14px; margin-top: 4px;">
                    <div style="color: #888; font-size: 11px; margin-bottom: 10px;">
                        🔧 高级设置（通常不需要修改，点击 ❓ 查看说明）
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div>
                            <label style="display: block; margin-bottom: 4px; color: #aaa; font-size: 11px;">
                                列表页特征
                                <span class="rm-help-tip" title="URL 中用于识别论坛列表页的关键字。&#10;&#10;示例：&#10;• forumdisplay - Discuz论坛&#10;• forum- - 部分论坛&#10;• board - phpBB论坛&#10;&#10;如何找到：打开论坛的帖子列表页，查看地址栏URL中的特征词。" style="cursor: help; color: #2196F3;">❓</span>
                            </label>
                            <input type="text" id="rm-site-list" value="${defaults.listPattern}" style="
                                width: 100%;
                                padding: 8px 10px;
                                border: 1px solid rgba(255,255,255,0.15);
                                border-radius: 4px;
                                background: rgba(0,0,0,0.2);
                                color: #ccc;
                                font-size: 12px;
                                box-sizing: border-box;
                            ">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px; color: #aaa; font-size: 11px;">
                                帖子页特征
                                <span class="rm-help-tip" title="URL 中用于识别帖子详情页的关键字。&#10;&#10;示例：&#10;• viewthread - Discuz论坛&#10;• thread- - 部分论坛&#10;• topic - phpBB论坛&#10;&#10;如何找到：打开任意帖子，查看地址栏URL中的特征词。" style="cursor: help; color: #2196F3;">❓</span>
                            </label>
                            <input type="text" id="rm-site-thread" value="${defaults.threadPattern}" style="
                                width: 100%;
                                padding: 8px 10px;
                                border: 1px solid rgba(255,255,255,0.15);
                                border-radius: 4px;
                                background: rgba(0,0,0,0.2);
                                color: #ccc;
                                font-size: 12px;
                                box-sizing: border-box;
                            ">
                        </div>
                    </div>
                    <div style="margin-top: 10px;">
                        <label style="display: block; margin-bottom: 4px; color: #aaa; font-size: 11px;">
                            帖子链接选择器
                            <span class="rm-help-tip" title="用于选择帖子标题链接的 CSS 选择器。&#10;&#10;示例：&#10;• a.s.xst - Discuz论坛&#10;• a.topictitle - phpBB论坛&#10;• .thread-title a - 通用格式&#10;&#10;如何找到：&#10;1. 在列表页按 F12 打开开发者工具&#10;2. 点击左上角的元素选择器图标&#10;3. 点击任意帖子标题&#10;4. 查看该元素的 class 或其他属性&#10;5. 写成 CSS 选择器格式" style="cursor: help; color: #2196F3;">❓</span>
                        </label>
                        <input type="text" id="rm-site-selector" value="${defaults.linkSelector}" style="
                            width: 100%;
                            padding: 8px 10px;
                            border: 1px solid rgba(255,255,255,0.15);
                            border-radius: 4px;
                            background: rgba(0,0,0,0.2);
                            color: #ccc;
                            font-size: 12px;
                            box-sizing: border-box;
                        ">
                    </div>
                    <div style="margin-top: 10px; padding: 8px 10px; background: rgba(33,150,243,0.1); border-radius: 4px; font-size: 11px; color: #aaa; line-height: 1.5;">
                        💡 <strong>提示</strong>：鼠标悬停在 <span style="color: #2196F3;">❓</span> 上可查看详细说明。大多数 Discuz 论坛使用默认值即可。
                    </div>
                </div>
            </div>
        `;
        return new Promise(resolve => {
            createModal({
                title: isEdit ? '✏️ 编辑站点' : '➕ 添加站点',
                content: content,
                buttons: [
                    { text: '取消', onClick: () => resolve(null) },
                    {
                        text: isEdit ? '保存' : '添加',
                        primary: true,
                        onClick: () => {
                            const name = content.querySelector('#rm-site-name').value.trim();
                            const primary = content.querySelector('#rm-site-primary').value.trim();
                            const aliasesStr = content.querySelector('#rm-site-aliases').value.trim();
                            const listPattern = content.querySelector('#rm-site-list').value.trim();
                            const threadPattern = content.querySelector('#rm-site-thread').value.trim();
                            const linkSelector = content.querySelector('#rm-site-selector').value.trim();
                            if (!name || !primary) {
                                showAlert('❌ 站点名称和主域名不能为空');
                                resolve(null);
                                return;
                            }
                            const aliases = aliasesStr
                                ? aliasesStr.split(',').map(s => s.trim()).filter(Boolean)
                                : [];
                            resolve({
                                name,
                                primary,
                                aliases,
                                listPattern: listPattern || 'forumdisplay',
                                threadPattern: threadPattern || 'viewthread',
                                linkSelector: linkSelector || 'a.s.xst'
                            });
                        }
                    }
                ]
            });
        });
    }
    async function addNewSite() {
        const site = await showSiteForm(null);
        if (!site) return;
        const config = loadDomainConfig();
        config.push(site);
        saveDomainConfig(config);
        await showAlert('✅ 站点添加成功！刷新页面后生效。');
    }
    async function editSite(idx) {
        const config = loadDomainConfig();
        const site = config[idx];
        if (!site) return;
        const updated = await showSiteForm(site);
        if (!updated) return;
        config[idx] = updated;
        saveDomainConfig(config);
        await showAlert('✅ 站点修改成功！刷新页面后生效。');
    }
    async function deleteSite(idx) {
        const config = loadDomainConfig();
        const site = config[idx];
        if (!site) return;
        const confirmed = await showConfirm(`确定删除站点「${site.name}」吗？\n\n主域名: ${site.primary}`);
        if (!confirmed) return;
        config.splice(idx, 1);
        saveDomainConfig(config);
        await showAlert('✅ 站点已删除！刷新页面后生效。');
    }
    function triggerImport() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = e => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => importVisitedData(reader.result);
                reader.readAsText(file);
            }
        };
        input.click();
    }
    function refreshPanel() {
        const panel = document.getElementById('read-marker-panel');
        if (panel) {
            updatePanelContent(panel);
        }
    }
    // ==================== UI: 已读标记 ====================
    function markReadThreadsInList() {
        const selector = siteConfig.linkSelector || 'a.s.xst';
        const threadLinks = document.querySelectorAll(selector);
        threadLinks.forEach(link => {
            if (link.dataset.markedVisited) return;
            const tid = getTidFromUrl(link.href);
            if (tid && isRead(tid)) {
                const tag = document.createElement('span');
                tag.textContent = '[已读] ';
                tag.style.cssText = 'color: #e74c3c; font-weight: bold; margin-right: 4px;';
                link.insertBefore(tag, link.firstChild);
                link.dataset.markedVisited = 'true';
            }
        });
    }
    function attachClickListeners() {
        const selector = siteConfig.linkSelector || 'a.s.xst';
        const threadLinks = document.querySelectorAll(selector);
        threadLinks.forEach(link => {
            if (link.dataset.clickListenerAdded) return;
            link.addEventListener('mousedown', (e) => {
                if (e.button === 0 || e.button === 1) {
                    const tid = getTidFromUrl(link.href);
                    if (tid) {
                        markAsRead(tid);
                        if (!link.dataset.markedVisited) {
                            const tag = document.createElement('span');
                            tag.textContent = '[已读] ';
                            tag.style.cssText = 'color: #e74c3c; font-weight: bold; margin-right: 4px;';
                            link.insertBefore(tag, link.firstChild);
                            link.dataset.markedVisited = 'true';
                        }
                        refreshPanel();
                    }
                }
            });
            link.dataset.clickListenerAdded = 'true';
        });
    }
    // ==================== 导入导出功能 ====================
    function exportVisitedData() {
        const domainList = getDomainIndex();
        const exportData = {};
        domainList.forEach(domain => {
            const key = `visitedTids_${domain}`;
            try {
                const gmData = GM_getValue(key, {});
                const cleaned = {};
                for (const tid in gmData) {
                    if (gmData[tid]?.visitedAt) {
                        cleaned[tid] = { visitedAt: gmData[tid].visitedAt };
                    }
                }
                exportData[domain] = cleaned;
            } catch (e) {
                console.error(`[ReadMarker] 导出 ${domain} 失败：`, e);
                exportData[domain] = {};
            }
        });
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `forum_read_marker_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showAlert('✅ 导出成功！');
    }
    async function importVisitedData(jsonText) {
        try {
            const newData = JSON.parse(jsonText);
            if (typeof newData !== 'object' || newData === null) {
                await showAlert('❌ 导入失败：格式错误');
                return;
            }
            let domainList = getDomainIndex();
            let importedCount = 0;
            for (const site in newData) {
                const key = `visitedTids_${site}`;
                const old = GM_getValue(key, {});
                const newRecords = newData[site];
                const merged = { ...old, ...newRecords };
                GM_setValue(key, merged);
                importedCount += Object.keys(newRecords).length;
                if (!domainList.includes(site)) {
                    domainList.push(site);
                }
            }
            GM_setValue(DOMAIN_INDEX_KEY, domainList);
            await showAlert(`✅ 导入成功！共导入 ${importedCount} 条记录`);
            location.reload();
        } catch {
            await showAlert('❌ 导入失败：JSON 解析错误');
        }
    }
    async function clearVisitedData() {
        const confirmed = await showConfirm('⚠️ 确定清除所有站点的阅读记录？\n\n此操作不可恢复！建议先导出备份。');
        if (!confirmed) return;
        const domainList = getDomainIndex();
        domainList.forEach(domain => {
            GM_setValue(`visitedTids_${domain}`, {});
        });
        GM_setValue(DOMAIN_INDEX_KEY, []);
        await showAlert('✅ 所有记录已清除！');
        location.reload();
    }
    // ==================== JSONBin 云同步 ====================
    async function uploadToJsonBin() {
        const jsonbinId = GM_getValue('jsonbin_id', '');
        const jsonbinKey = GM_getValue('jsonbin_key', '');
        if (!jsonbinId || !jsonbinKey) {
            await showAlert('❌ 请先在「云设置」中配置 JSONBin');
            return;
        }
        const confirmed = await showConfirm('确定将本地记录备份到云端？\n\n这会覆盖云端已有的数据。');
        if (!confirmed) return;
        try {
            const domainList = getDomainIndex();
            const allData = {};
            for (const domain of domainList) {
                allData[domain] = GM_getValue(`visitedTids_${domain}`, {});
            }
            const resp = await fetch(`${JSONBIN_BASE}/${jsonbinId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': jsonbinKey
                },
                body: JSON.stringify({
                    updatedAt: new Date().toISOString(),
                    visitedData: allData
                })
            });
            if (!resp.ok) throw new Error('上传失败');
            await showAlert('✅ 云端备份成功！');
        } catch (e) {
            await showAlert('❌ 云端备份失败：' + e.message);
        }
    }
    async function downloadFromJsonBin() {
        const jsonbinId = GM_getValue('jsonbin_id', '');
        const jsonbinKey = GM_getValue('jsonbin_key', '');
        if (!jsonbinId || !jsonbinKey) {
            await showAlert('❌ 请先在「云设置」中配置 JSONBin');
            return;
        }
        const confirmed = await showConfirm('确定从云端恢复记录？\n\n云端数据将与本地数据合并。');
        if (!confirmed) return;
        try {
            const resp = await fetch(`${JSONBIN_BASE}/${jsonbinId}/latest`, {
                method: 'GET',
                headers: { 'X-Master-Key': jsonbinKey }
            });
            if (!resp.ok) throw new Error('记录不存在');
            const json = await resp.json();
            const allData = json.record?.visitedData;
            if (typeof allData !== 'object' || allData === null) {
                await showAlert('❌ 云端数据格式错误');
                return;
            }
            const domainList = Object.keys(allData);
            GM_setValue(DOMAIN_INDEX_KEY, domainList);
            let totalCount = 0;
            for (const domain of domainList) {
                const key = `visitedTids_${domain}`;
                const oldData = GM_getValue(key, {});
                const newData = allData[domain];
                GM_setValue(key, { ...oldData, ...newData });
                totalCount += Object.keys(newData).length;
            }
            await showAlert(`✅ 云端恢复成功！共恢复 ${totalCount} 条记录`);
            location.reload();
        } catch (e) {
            await showAlert('❌ 云端恢复失败：' + e.message);
        }
    }
    async function configureJsonBin() {
        const currentId = GM_getValue('jsonbin_id', '');
        const currentKey = GM_getValue('jsonbin_key', '');
        const content = document.createElement('div');
        content.innerHTML = `
            <div style="margin-bottom: 16px; color: #aaa; line-height: 1.6;">
                <strong style="color: #4CAF50;">设置说明：</strong><br>
                1. 访问 <a href="https://jsonbin.io" target="_blank" style="color: #2196F3;">jsonbin.io</a> 注册免费账号<br>
                2. 登录后点击「Create a Bin」<br>
                3. 复制 Bin ID<br>
                4. 在「API KEYS」页面复制 Master Key
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 6px; color: #ccc;">Bin ID:</label>
                <input type="text" id="rm-jsonbin-id" value="${currentId}" style="
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 6px;
                    background: rgba(0,0,0,0.3);
                    color: #fff;
                    font-size: 14px;
                    box-sizing: border-box;
                ">
            </div>
            <div>
                <label style="display: block; margin-bottom: 6px; color: #ccc;">API Key (Master Key):</label>
                <input type="text" id="rm-jsonbin-key" value="${currentKey}" style="
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 6px;
                    background: rgba(0,0,0,0.3);
                    color: #fff;
                    font-size: 14px;
                    box-sizing: border-box;
                ">
            </div>
        `;
        return new Promise(resolve => {
            createModal({
                title: '☁️ JSONBin 云同步设置',
                content: content,
                buttons: [
                    { text: '取消', onClick: resolve },
                    {
                        text: '保存', primary: true, onClick: () => {
                            const binId = content.querySelector('#rm-jsonbin-id').value.trim();
                            const apiKey = content.querySelector('#rm-jsonbin-key').value.trim();
                            GM_setValue('jsonbin_id', binId);
                            GM_setValue('jsonbin_key', apiKey);
                            showAlert('✅ 设置已保存！');
                            resolve();
                        }
                    }
                ]
            });
        });
    }
    // ==================== 添加站点按钮（非配置站点） ====================
    function injectAddSiteButton() {
        const btn = document.createElement('div');
        btn.id = 'rm-add-site-btn';
        btn.style.cssText = PANEL_STYLE + `
            top: 10px;
            left: 10px;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 11px;
        `;
        btn.innerHTML = '📖 添加此站点到已读标记';
        btn.onclick = async () => {
            await addNewSite();
        };
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => document.body.appendChild(btn));
        } else {
            document.body.appendChild(btn);
        }
    }
    // ==================== 主逻辑 ====================
    function init() {
        updateDomainIndex();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createUnifiedPanel);
        } else {
            createUnifiedPanel();
        }
        if (isForumListPage()) {
            window.addEventListener('load', () => {
                markReadThreadsInList();
                attachClickListeners();
            });
            const observer = new MutationObserver(() => {
                markReadThreadsInList();
                attachClickListeners();
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
        if (isThreadPage()) {
            const tid = getTidFromUrl(location.href);
            if (tid) {
                markAsRead(tid);
            }
        }
    }
    init();
})();
