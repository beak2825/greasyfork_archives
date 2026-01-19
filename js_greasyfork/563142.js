// ==UserScript==
// @name         AnMe
// @author       zjw
// @version      9.6.1
// @namespace    https://github.com/Zhu-junwei/AnMe
// @description  通用网站多账号切换工具，保存并恢复 Cookie 与存储数据
// @description:zh  通用网站多账号切换工具，保存并恢复 Cookie 与存储数据
// @icon         data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>👥</text></svg>
// @match        *://*/*
// @license      MIT
// @run-at       document-end
// @grant        GM_cookie
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_info
// @connect      *
// @tag          Account
// @tag          Cookie
// @tag          Switcher
// @tag          多账号
// @description:en  Universal multi-account switching tool for websites, supporting saving and restoring of Cookies and storage data.
// @downloadURL https://update.greasyfork.org/scripts/563142/AnMe.user.js
// @updateURL https://update.greasyfork.org/scripts/563142/AnMe.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.self !== window.top) return;

    // --- 多语言配置 ---
    const i18n = {
        zh: {
            nav_switch: "账号切换",
            nav_mgr: "管理账号",
            nav_set: "高级设置",
            nav_notice: "使用声明",
            placeholder_name: "给新账号命名...",
            tip_help: "切换登录失败？尝试勾选 LocalStorage 和 SessionStorage。",
            tip_lock: "为保证正常读取Cookie，请在篡改猴高级模式下，设置允许脚本访问 Cookie: ALL",
            btn_save: "保存当前账号",
            btn_clean: "切换新环境 (清空本站痕迹)",
            set_fab_mode: "悬浮球显示模式",
            fab_auto: "智能显隐",
            fab_show: "常驻显示",
            fab_hide: "彻底隐藏",
            fab_auto_title: "有账号记录时自动显示，无记录时隐藏",
            fab_show_title: "无论是否有账号，悬浮球一直显示",
            fab_hide_title: "平时不显示，仅能通过篡改猴菜单唤起",
            set_lang: "语言设置 / Language",
            set_backup: "数据备份与还原",
            btn_exp_curr: "📤 导出当前网站",
            btn_exp_all: "📦 导出全部数据",
            btn_imp: "📥 导入备份",
            donate: "请作者喝杯咖啡",
            btn_clear_all: "🗑️ 清空脚本所有数据 (慎用)",
            notice_title: "《使用声明与免责条款》",
            back: "← 返回设置",
            no_data: "🍃 暂无账号记录",
            confirm_clean: "确定清空当前网站所有痕迹并开启新环境？",
            confirm_clear_all: "⚠️ 警告：这将删除本脚本保存的所有网站的所有账号数据！且无法恢复！",
            import_ok: "✅ 成功导入/更新 {count} 个账号！",
            import_err: "❌ 导入失败：文件格式错误",
            export_err: "⚠️ 没有可导出的数据",
            menu_open: "🚀 开启账号管理",
            notice_content: `
                 <h4>1. 脚本功能说明</h4>
                 <p>本脚本通过篡改猴插件提供的存储API，将当前网站的 Cookie、LocalStorage 和 SessionStorage 进行快照保存。当您点击切换时，脚本会清空当前痕迹并还原选中的快照数据，从而实现多账号快速登录。
                    脚本提供了数据的导入导出功能，可以在不同电脑、不同浏览器间无缝切换账号。
                 </p>
                 <h4>2. 数据存储安全</h4>
                 <p>所有账号数据均存储在您浏览器的篡改猴插件内部管理器中（GM_setValue），脚本没有联网权限，更不会上传任何数据到远程服务器。</p>
                 <h4>3. 风险提示</h4>
                 <p>由于浏览器环境的开放性，本脚本无法阻止同域名下的其他恶意脚本通过篡改猴 API 或存储机制尝试获取这些数据。请勿在公共电脑或不可信的设备环境中使用本脚本保存重要账号。</p>
                 <h4>4. 免责声明</h4>
                 <p>本脚本仅供学习交流使用。因使用本脚本导致的账号被封禁、数据泄露或任何形式的损失，作者不承担任何法律责任。请在确保环境安全的前提下谨慎使用。</p>`
        },
        en: {
            nav_switch: "Accounts",
            nav_mgr: "Manage",
            nav_set: "Settings",
            nav_notice: "Disclaimer",
            placeholder_name: "Name this account...",
            tip_help: "Switch failed? Try checking LocalStorage and SessionStorage.",
            tip_lock: "To ensure Cookie access, set 'Cookie Access' to 'ALL' in Tampermonkey Advanced settings.",
            btn_save: "Save Current",
            btn_clean: "New Environment (Clear Traces)",
            set_fab_mode: "Float Button Mode",
            fab_auto: "Smart",
            fab_show: "Show",
            fab_hide: "Hide",
            fab_auto_title: "Show automatically when accounts exist, hide otherwise",
            fab_show_title: "Always show the float button regardless of accounts",
            fab_hide_title: "Hidden by default; access only via Tampermonkey menu",
            set_lang: "Language / 语言设置",
            set_backup: "Backup & Restore",
            btn_exp_curr: "📤 Export Current",
            btn_exp_all: "📦 Export All Data",
            btn_imp: "📥 Import Backup",
            donate: "Buy me a coffee",
            btn_clear_all: "🗑️ Clear All App Data (Caution)",
            notice_title: "Disclaimer & Terms",
            back: "← Back to Settings",
            no_data: "🍃 No accounts recorded",
            confirm_clean: "Clear all local traces and start a new environment?",
            confirm_clear_all: "⚠️ Warning: This will delete ALL account data for ALL sites saved by this script! This cannot be undone!",
            import_ok: "✅ Successfully imported/updated {count} accounts!",
            import_err: "❌ Import failed: Invalid file format",
            export_err: "⚠️ No data available to export",
            menu_open: "🚀 Open Account Manager",
            notice_content: `
                <h4>1. Function Description</h4>
                <p>This script snapshots Cookies, LocalStorage, and SessionStorage via Tampermonkey's storage API. When switching, it clears current traces and restores the selected snapshot to enable fast multi-account switching. Import/Export functions are provided for seamless migration across devices and browsers.</p>
                <h4>2. Data Security</h4>
                <p>All data is stored locally within your browser's Tampermonkey manager (GM_setValue). The script has no network permissions and will never upload your data to any remote server.</p>
                <h4>3. Risk Warning</h4>
                <p>Due to the open nature of the browser environment, the script cannot prevent other malicious scripts on the same domain from attempting to access this data via APIs. Do not use this script on public or untrusted devices to save sensitive accounts.</p>
                <h4>4. Disclaimer</h4>
                <p>This script is for educational and exchange purposes only. The author is not responsible for account bans, data leaks, or any loss resulting from the use of this script. Use with caution in a secure environment.</p>`
        }
    };

    const CFG_LANG = 'cfg_lang';
    let currentLang = GM_getValue(CFG_LANG, navigator.language.startsWith('zh') ? 'zh' : 'en');
    const t = (key) => i18n[currentLang][key] || key;

    const PREFIX = 'acc_stable_';
    const CFG_FAB_MODE = 'cfg_fab_mode';
    const CFG_FAB_POS = 'cfg_fab_pos';
    const HOST = location.hostname;
    const NAME = GM_info.script.name;
    const VERSION = GM_info.script.version;
    const AUTHOR = GM_info.script.author;
    let isForcedShow = false;

    GM_addStyle(`
        #acc-mgr-fab { position: fixed; bottom: 100px; right: 30px; width: 44px; height: 44px; background: #2196F3; color: white; border-radius: 50%; display: none; align-items: center; justify-content: center; font-size: 20px; cursor: move; z-index: 1000000; box-shadow: 0 4px 10px rgba(0,0,0,0.2); user-select: none; border: none; touch-action: none; }
        .acc-panel { position: fixed; width: 340px; background: white; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.25); z-index: 1000001; display: none; flex-direction: column; font-family: system-ui, -apple-system, sans-serif; border: 1px solid #ddd; overflow: hidden; height: 480px; }
        .acc-panel.show { display: flex; }
        .acc-header { height: 40px; display: flex; align-items: center; padding: 0 15px; border-bottom: 1px solid #eee; background: #fdfdfd; font-weight: bold; font-size: 14px; color: #333; flex-shrink: 0; justify-content: space-between; }
        .acc-header-title { display: flex; align-items: center; gap: 6px; }
        .acc-tab-content { flex: 1; display: none; padding: 15px; overflow: hidden; flex-direction: column; background: #fff; }
        .acc-tab-content.active { display: flex; }
        .acc-tabs-footer { display: flex; background: #f8f9fa; border-top: 1px solid #eee; height: 60px; padding-bottom: 6px; flex-shrink: 0; box-sizing: border-box; }
        .acc-tab-btn { flex: 1; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 12px; color: #666; font-weight: bold; border-top: 2px solid transparent; gap: 3px; flex-direction: column; padding-top: 6px;}
        .acc-tab-btn span { font-size: 18px; margin-bottom: 2px; }
        .acc-tab-btn.active { color: #2196F3; border-top-color: #2196F3; background: white; }
        .acc-scroll-area { flex: 1; overflow-y: auto; margin-bottom: 5px; padding-right: 4px; }
        .acc-scroll-area::-webkit-scrollbar { width: 4px; }
        .acc-scroll-area::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; }
        .acc-switch-card { padding: 12px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 8px; cursor: pointer; transition: 0.2s; position: relative; }
        .acc-switch-card:hover { border-color: #2196F3; background: #f7fbff; }
        .acc-card-name { font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 6px; margin-bottom: 6px; color: #333; }
        .acc-card-meta { font-size: 10px; color: #999; display: flex; flex-wrap: wrap; gap: 4px; }
        .acc-mini-tag { background: #f0f0f0; padding: 1px 5px; border-radius: 3px; color: #777; }
        .acc-mgr-item { display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid #f9f9f9; background: white; cursor: grab; }
        .acc-mgr-item:active { cursor: grabbing; }
        .acc-mgr-item.dragging { opacity: 0.4; background: #e3f2fd; border: 1px dashed #2196F3; }
        .acc-mgr-handle { margin: 0 8px; color: #ccc; font-size: 14px; user-select: none; cursor: grab; }
        .acc-mgr-input { flex: 1; border: 1px solid transparent; padding: 5px; font-size: 13px; outline: none; border-radius: 4px; background: transparent; cursor: text; }
        .acc-mgr-input:focus { background: #f9f9f9; border-color: #eee; }
        .acc-btn-del { color: #ccc; cursor: pointer; padding: 0 12px; font-size: 20px; font-weight: 300; user-select: none; }
        .acc-btn-del:hover { color: #f44336; }
        .acc-action-fixed { border-top: 1px solid #eee; padding-top: 12px; flex-shrink: 0; }
        .acc-row-btn { display: flex; gap: 8px; align-items: center; }
        .acc-input-text { flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; box-sizing: border-box; }
        .acc-btn { border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 13px; display: flex; align-items: center; justify-content: center; gap: 5px; transition: 0.2s; }
        .acc-btn-blue { flex: 1; background: #2196F3; color: white; }
        .acc-btn-blue:hover { background: #1976D2; }
        .acc-btn-plus { width: 38px; height: 38px; background: #fff; color: #666; border: 1px solid #ddd; font-size: 20px; }
        .acc-btn-plus:hover { border-color: #2196F3; color: #2196F3; }
        .acc-help-tip, .acc-lock-tip { display: inline-block; width: 16px; height: 16px; border-radius: 50%; font-size: 11px; line-height: 16px; text-align: center; cursor: help; margin-left: 2px; }
        .acc-help-tip { background: #eee; color: #999; }
        .acc-lock-tip { background: transparent; font-size: 12px; margin-left: 8px; }
        .acc-set-group { margin-bottom: 5px; }
        .acc-set-title { font-size: 12px; font-weight: bold; color: #999; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
        .acc-set-row { display: flex; gap: 10px; margin-bottom: 10px; }
        .acc-btn-light { background: #f5f5f5; color: #333; flex: 1; border: 1px solid #eee; }
        .acc-btn-light:hover { background: #e0e0e0; }
        .acc-btn-active { background: #2196F3 !important; color: white !important; border-color: #2196F3 !important; }
        .acc-btn-danger { background: #fff0f0; color: #d32f2f; border: 1px solid #ffcdd2; width: 100%; }
        .acc-btn-danger:hover { background: #ffebee; }
        .acc-info-box { font-size: 12px; color: #666; text-align: center; padding: 10px 5px; background: #f9f9f9; border-radius: 6px; margin-top: 10px; }
        .acc-notice-content { line-height: 1.6; color: #444; font-size: 13px; }
        .acc-notice-content h4 { margin: 15px 0 8px 0; color: #333; border-left: 3px solid #2196F3; padding-left: 8px; }
        .acc-notice-content p { margin-bottom: 10px; text-align: justify; }
        .acc-link-btn { color: #2196F3; cursor: pointer; text-decoration: underline; font-size: 12px; }
        #pg-mgr label, #pg-mgr input[type="checkbox"] {cursor: pointer !important;}
        #pg-mgr label:hover {color: #2196F3;}
        .acc-select-ui { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; background: #fff; cursor: pointer; outline: none; }
        .acc-select-ui:focus { border-color: #2196F3; }
    `);

    let fab, panel;
    let currentViewingHost = HOST;

    const listAllHosts = () => [...new Set(GM_listValues().filter(v => v.startsWith(PREFIX)).map(v => v.split('::')[0].replace(PREFIX, '')))];

    const getSortedKeysByHost = (host) => {
        return GM_listValues()
            .filter(k => k.startsWith(`${PREFIX}${host}::`))
            .sort((a, b) => {
                const dataA = GM_getValue(a);
                const dataB = GM_getValue(b);
                const orderA = dataA.index ?? 999999;
                const orderB = dataB.index ?? 999999;
                if (orderA !== orderB) return orderA - orderB;
                return new Date(dataB.time || 0) - new Date(dataA.time || 0);
            });
    };

    const extractName = (key) => key.split('::')[1] || key;
    const makeKey = (name, host = HOST) => `${PREFIX}${host}::${name}`;

    async function handleSave() {
        const nameInput = document.getElementById('acc-new-name');
        const name = nameInput.value.trim();
        if (!name) return;

        const existingKeys = getSortedKeysByHost(HOST);
        const nextIndex = existingKeys.length;

        const snapshot = {
            index: nextIndex,
            time: new Date().toLocaleString('zh-CN', { hour12: false }),
            localStorage: document.getElementById('c-ls').checked ? { ...localStorage } : {},
            sessionStorage: document.getElementById('c-ss').checked ? { ...sessionStorage } : {},
            cookies: []
        };
        if (document.getElementById('c-ck').checked) snapshot.cookies = await new Promise(res => GM_cookie.list({ url: window.location.href }, res));
        GM_setValue(makeKey(name), snapshot);
        nameInput.value = "";
        refresh();
    }

    async function handleLoad(key) {
        const data = GM_getValue(key);
        if (!data) return;
        localStorage.clear(); sessionStorage.clear();
        const ck = await new Promise(res => GM_cookie.list({ url: window.location.href }, res));
        for (const c of (ck || [])) await new Promise(res => GM_cookie.delete({ url: window.location.href, name: c.name }, res));
        Object.entries(data.localStorage || {}).forEach(([k, v]) => localStorage.setItem(k, v));
        Object.entries(data.sessionStorage || {}).forEach(([k, v]) => sessionStorage.setItem(k, v));
        for (const c of (data.cookies || [])) {
            const d = { ...c, url: window.location.href };
            delete d.hostOnly; delete d.session;
            await new Promise(res => GM_cookie.set(d, res));
        }
        location.reload();
    }

    function exportData(scope) {
        let exportObj = {};
        const allKeys = GM_listValues().filter(k => k.startsWith(PREFIX));
        const targetKeys = scope === 'current' ? allKeys.filter(k => k.startsWith(`${PREFIX}${HOST}::`)) : allKeys;
        if (targetKeys.length === 0) { alert(t('export_err')); return; }
        targetKeys.forEach(key => { exportObj[key] = GM_getValue(key); });
        const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AnMe_Backup_${scope}_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                let count = 0;
                Object.entries(data).forEach(([key, value]) => {
                    if (key.startsWith(PREFIX)) {
                        if (value.index === undefined) value.index = 9999;
                        GM_setValue(key, value);
                        count++;
                    }
                });
                alert(t('import_ok').replace('{count}', count));
                refresh();
            } catch (err) {
                alert(t('import_err'));
            }
        };
        reader.readAsText(file);
    }

    function initDraggable() {
        const container = document.getElementById('mgr-list-area');
        if (!container) return;
        let draggingEle = null;
        container.addEventListener('dragstart', (e) => { draggingEle = e.target.closest('.acc-mgr-item'); if (draggingEle) draggingEle.classList.add('dragging'); });
        container.addEventListener('dragend', (e) => { if (draggingEle) { draggingEle.classList.remove('dragging'); draggingEle = null; saveOrder(); } });
        container.addEventListener('dragover', (e) => { e.preventDefault(); const afterElement = getDragAfterElement(container, e.clientY); if (afterElement == null) container.appendChild(draggingEle); else container.insertBefore(draggingEle, afterElement); });
        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.acc-mgr-item:not(.dragging)')];
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
                else return closest;
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }
        function saveOrder() {
            const items = [...container.querySelectorAll('.acc-mgr-input')];
            items.forEach((input, idx) => {
                const key = input.dataset.key;
                const data = GM_getValue(key);
                if (data) { data.index = idx; GM_setValue(key, data); }
            });
            updateSwitchView();
        }
    }

    function updateSwitchView() {
        const currentKeys = getSortedKeysByHost(HOST);
        const switchArea = document.getElementById('switch-area');
        if (!switchArea) return;
        if (currentKeys.length === 0) {
            switchArea.innerHTML = `<div style="text-align:center;color:#ccc;margin-top:100px;font-size:13px;">${t('no_data')}</div>`;
        } else {
            switchArea.innerHTML = currentKeys.map(k => {
                const d = GM_getValue(k);
                const ckLen = d.cookies?.length || 0;
                const lsLen = Object.keys(d.localStorage || {}).length;
                return `<div class="acc-switch-card" data-key="${k}">
                    <span class="acc-card-name">👤 ${extractName(k)}</span>
                    <div class="acc-card-meta">
                        <span class="acc-mini-tag">🕒 ${d.time || 'N/A'}</span>
                        ${ckLen ? `<span class="acc-mini-tag">CK: ${ckLen}</span>` : ''}
                        ${lsLen ? `<span class="acc-mini-tag">LS: ${lsLen}</span>` : ''}
                    </div>
                </div>`;
            }).join('');
            switchArea.querySelectorAll('.acc-switch-card').forEach(el => el.onclick = () => handleLoad(el.dataset.key));
        }
    }

    function refresh() {
        if (!fab || !panel) return;
        updateSwitchView();
        const hosts = listAllHosts();
        if (!hosts.includes(HOST)) hosts.push(HOST);
        const hostSel = document.getElementById('host-sel');
        if (hostSel) hostSel.innerHTML = hosts.map(h => `<option value="${h}" ${h === currentViewingHost ? 'selected' : ''}>${h === HOST ? '📌 ' : '🌐 '}${h}</option>`).join('');

        const mgrList = document.getElementById('mgr-list-area');
        if (mgrList) {
            const viewingKeys = getSortedKeysByHost(currentViewingHost);
            mgrList.innerHTML = viewingKeys.map(k => `
                <div class="acc-mgr-item" draggable="true">
                    <span class="acc-mgr-handle">☰</span>
                    <input type="text" class="acc-mgr-input" value="${extractName(k)}" data-key="${k}">
                    <span class="acc-btn-del" data-key="${k}">×</span>
                </div>
            `).join('');
            initDraggable();
            mgrList.querySelectorAll('.acc-mgr-input').forEach(i => {
                const row = i.closest('.acc-mgr-item');
                i.onmouseenter = () => { if(row) row.setAttribute('draggable', 'false'); };
                i.onmouseleave = () => { if(row) row.setAttribute('draggable', 'true'); };
                i.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); i.blur(); } };
                i.onblur = () => {
                    const val = i.value.trim();
                    if (val && val !== extractName(i.dataset.key)) {
                        const data = GM_getValue(i.dataset.key);
                        GM_deleteValue(i.dataset.key);
                        GM_setValue(makeKey(val, currentViewingHost), data);
                        refresh();
                    }
                };
            });
            mgrList.querySelectorAll('.acc-btn-del').forEach(b => b.onclick = (e) => { e.stopPropagation(); GM_deleteValue(b.dataset.key); refresh(); });
        }

        const fixedAct = document.getElementById('mgr-fixed-actions');
        if (fixedAct) fixedAct.style.display = (currentViewingHost === HOST) ? 'block' : 'none';

        const fabMode = GM_getValue(CFG_FAB_MODE, 'auto');
        const hasAccounts = getSortedKeysByHost(HOST).length > 0;
        const isPanelOpen = panel.classList.contains('show');
        panel.querySelectorAll('.fab-mode-btn').forEach(btn => btn.classList.toggle('acc-btn-active', btn.dataset.val === fabMode));

        const shouldShowFab = isPanelOpen || isForcedShow || (fabMode === 'show') || (fabMode === 'auto' && hasAccounts);
        fab.style.display = shouldShowFab ? 'flex' : 'none';
    }

    function syncPanelPos() {
        if (!fab || !panel) return;
        const r = fab.getBoundingClientRect();
        panel.style.bottom = (window.innerHeight - r.top + 10) + 'px';
        panel.style.left = Math.max(10, r.left - 290) + 'px';
    }

    function closePanel() { panel.classList.remove('show'); isForcedShow = false; refresh(); }

    function init() {
        // --- 1. 创建或获取悬浮球 ---
        if (!document.getElementById('acc-mgr-fab')) {
            fab = document.createElement('div');
            fab.id = 'acc-mgr-fab'; fab.innerHTML = '👤';
            document.body.appendChild(fab);
            const savedPos = GM_getValue(CFG_FAB_POS);
            if (savedPos && savedPos.left !== undefined) {
                fab.style.left = Math.max(0, Math.min(savedPos.left, window.innerWidth - 44)) + 'px';
                fab.style.top = Math.max(0, Math.min(savedPos.top, window.innerHeight - 44)) + 'px';
                fab.style.bottom = 'auto'; fab.style.right = 'auto';
            }
            // 绑定悬浮球事件 (仅在创建时绑定一次)
            let isDrag = false;
            fab.onmousedown = (e) => {
                isDrag = false;
                let sx=e.clientX, sy=e.clientY, bx=fab.offsetLeft, by=fab.offsetTop;
                const mv=(ev)=>{
                    isDrag=true;
                    let nl = Math.max(0, Math.min(bx + ev.clientX - sx, window.innerWidth - 44));
                    let nt = Math.max(0, Math.min(by + ev.clientY - sy, window.innerHeight - 44));
                    fab.style.left= nl + 'px'; fab.style.top= nt + 'px';
                    fab.style.bottom='auto'; fab.style.right='auto';
                    if(panel && panel.classList.contains('show')) syncPanelPos();
                };
                const up=()=>{
                    document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up);
                    if (isDrag) GM_setValue(CFG_FAB_POS, { left: parseInt(fab.style.left), top: parseInt(fab.style.top) });
                };
                document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up);
            };
            fab.onclick = (e) => {
                if(!isDrag && panel) {
                    e.stopPropagation();
                    if(panel.classList.toggle('show')) syncPanelPos();
                    else isForcedShow = false;
                    refresh();
                }
            };
        } else {
            fab = document.getElementById('acc-mgr-fab');
        }

        // --- 2. 创建管理面板 ---
        if (document.getElementById('acc-mgr-panel')) return; // 避免重复创建

        panel = document.createElement('div');
        panel.id = 'acc-mgr-panel';
        panel.className = 'acc-panel';
        panel.innerHTML = `
            <div class="acc-header">
                <div class="acc-header-title" id="acc-header-text">${t('nav_switch')}</div>
                <div style="cursor:pointer; color:#ccc;" id="acc-close-btn">✕</div>
            </div>
            <div class="acc-tab-content active" id="pg-switch">
                <div class="acc-scroll-area" id="switch-area"></div>
            </div>
            <div class="acc-tab-content" id="pg-mgr">
                <select id="host-sel" style="width:100%; padding:6px; margin-bottom:10px; font-size:12px; border:1px solid #eee; border-radius:4px; outline:none; cursor:pointer; background:#fff;"></select>
                <div class="acc-scroll-area" id="mgr-list-area"></div>
                <div class="acc-action-fixed" id="mgr-fixed-actions">
                    <input type="text" id="acc-new-name" class="acc-input-text" placeholder="${t('placeholder_name')}" style="margin-bottom:8px; width:100%;">
                    <div style="display:flex; align-items:center; gap:5px; font-size:11px; color:#666; margin-bottom:10px;">
                        <label><input type="checkbox" id="c-ck" checked> Cookie</label>
                        <label><input type="checkbox" id="c-ls"> LS</label>
                        <label><input type="checkbox" id="c-ss"> SS</label>
                        <span class="acc-help-tip" title="${t('tip_help')}">?</span>
                        <span class="acc-lock-tip" title="${t('tip_lock')}">🔒</span>
                    </div>
                    <div class="acc-row-btn">
                        <button id="do-save" class="acc-btn acc-btn-blue"><span>💾</span> ${t('btn_save')}</button>
                        <button id="do-clean" class="acc-btn acc-btn-plus" title="${t('btn_clean')}">+</button>
                    </div>
                </div>
            </div>
            <div class="acc-tab-content" id="pg-set">
                <div class="acc-scroll-area">
                    <div class="acc-set-group">
                        <div class="acc-set-title">${t('set_fab_mode')}</div>
                        <div class="acc-set-row">
                            <button class="acc-btn acc-btn-light fab-mode-btn" data-val="auto" title="${t('fab_auto_title')}">${t('fab_auto')}</button>
                            <button class="acc-btn acc-btn-light fab-mode-btn" data-val="show" title="${t('fab_show_title')}">${t('fab_show')}</button>
                            <button class="acc-btn acc-btn-light fab-mode-btn" data-val="hide" title="${t('fab_hide_title')}">${t('fab_hide')}</button>
                        </div>
                    </div>
                    <div class="acc-set-group">
                        <div class="acc-set-title">${t('set_lang')}</div>
                        <div class="acc-set-row">
                            <select id="lang-sel" class="acc-select-ui">
                                <option value="zh" ${currentLang === 'zh' ? 'selected' : ''}>简体中文</option>
                                <option value="en" ${currentLang === 'en' ? 'selected' : ''}>English</option>
                            </select>
                        </div>
                    </div>
                    <div class="acc-set-group">
                        <div class="acc-set-title">${t('set_backup')}</div>
                        <div class="acc-set-row">
                            <button class="acc-btn acc-btn-light" id="btn-export-curr">${t('btn_exp_curr')}</button>
                            <button class="acc-btn acc-btn-light" id="btn-export-all">${t('btn_exp_all')}</button>
                        </div>
                        <div class="acc-set-row">
                            <button class="acc-btn acc-btn-light" id="btn-import-trigger">${t('btn_imp')}</button>
                            <input type="file" id="inp-import-file" accept=".json" style="display:none">
                        </div>
                         <div class="acc-set-row">
                            <button class="acc-btn acc-btn-danger" id="btn-clear-all">${t('btn_clear_all')}</button>
                        </div>
                    </div>
                    <div class="acc-info-box">
                        <div><a href="https://github.com/Zhu-junwei/AnMe" target="_blank">${NAME}</a> v${VERSION}</div>
                        <div style="margin-top:4px; color:#999;">Designed by  <a href="https://www.cnblogs.com/zjw-blog/p/19466109" target="_blank" title="${t('donate')}" style="text-decoration:none; margin-left:5px;">${AUTHOR} ☕</a></div>
                    </div>
                    <div style="text-align: center; margin-top: 10px;">
                       <span class="acc-link-btn" id="go-notice">${t('notice_title')}</span>
                    </div>
                </div>
            </div>
            <div class="acc-tab-content" id="pg-notice">
               <div style="margin-bottom: 5px; font-weight: bold; color: #2196F3; cursor: pointer;" id="back-to-set">${t('back')}</div>
               <div class="acc-scroll-area">
                   <div class="acc-notice-content">${t('notice_content')}</div>
               </div>
            </div>
            <div class="acc-tabs-footer">
                <div class="acc-tab-btn active" data-pg="pg-switch" data-title="${t('nav_switch')}"><span>🔃</span>${t('nav_switch')}</div>
                <div class="acc-tab-btn" data-pg="pg-mgr" data-title="${t('nav_mgr')}"><span>👥</span>${t('nav_mgr')}</div>
                <div class="acc-tab-btn" data-pg="pg-set" data-title="${t('nav_set')}"><span>⚙️</span>${t('nav_set')}</div>
            </div>
        `;
        document.body.appendChild(panel);

        // 面板内事件绑定
        panel.querySelectorAll('.fab-mode-btn').forEach(btn => btn.onclick = () => { GM_setValue(CFG_FAB_MODE, btn.dataset.val); refresh(); });
        document.getElementById('lang-sel').onchange = (e) => {
            currentLang = e.target.value;
            GM_setValue(CFG_LANG, currentLang);
            document.body.removeChild(panel); // 仅移除面板
            init(); // 重新生成面板
            if (document.getElementById('acc-mgr-panel')) {
                const newPanel = document.getElementById('acc-mgr-panel');
                newPanel.classList.add('show');
                syncPanelPos();
            }
        };
        document.getElementById('acc-close-btn').onclick = closePanel;
        panel.onclick = (e) => e.stopPropagation();
        const updateSaveBtnState = () => {
            const ck = document.getElementById('c-ck').checked;
            const ls = document.getElementById('c-ls').checked;
            const ss = document.getElementById('c-ss').checked;
            const saveBtn = document.getElementById('do-save');
            const isAnyChecked = ck || ls || ss;
            saveBtn.disabled = !isAnyChecked;
            saveBtn.style.opacity = isAnyChecked ? "1" : "0.5";
            saveBtn.style.cursor = isAnyChecked ? "pointer" : "not-allowed";
        };

        ['c-ck', 'c-ls', 'c-ss'].forEach(id => {
            document.getElementById(id).addEventListener('change', updateSaveBtnState);
        });
        updateSaveBtnState();
        panel.querySelectorAll('.acc-tab-btn').forEach(b => b.onclick = () => {
            panel.querySelectorAll('.acc-tab-btn, .acc-tab-content').forEach(el => el.classList.remove('active'));
            b.classList.add('active');
            document.getElementById(b.dataset.pg).classList.add('active');
            document.getElementById('acc-header-text').innerText = b.dataset.title;
        });
        document.getElementById('host-sel').onchange = (e) => { currentViewingHost = e.target.value; refresh(); };
        document.getElementById('do-save').onclick = handleSave;
        document.getElementById('do-clean').onclick = async () => {
            if(!confirm(t('confirm_clean'))) return;
            localStorage.clear(); sessionStorage.clear();
            const ck = await new Promise(res => GM_cookie.list({ url: window.location.href }, res));
            for (const c of (ck || [])) await new Promise(res => GM_cookie.delete({ url: window.location.href, name: c.name }, res));
            location.reload();
        };
        document.getElementById('btn-export-curr').onclick = () => exportData('current');
        document.getElementById('btn-export-all').onclick = () => exportData('all');
        document.getElementById('btn-import-trigger').onclick = () => document.getElementById('inp-import-file').click();
        document.getElementById('inp-import-file').onchange = (e) => { if(e.target.files.length) importData(e.target.files[0]); e.target.value = ''; };
        document.getElementById('btn-clear-all').onclick = () => { if(confirm(t('confirm_clear_all'))) { GM_listValues().filter(k => k.startsWith(PREFIX)).forEach(k => GM_deleteValue(k)); refresh(); } };
        document.getElementById('go-notice').onclick = () => {
            panel.querySelectorAll('.acc-tab-content').forEach(el => el.classList.remove('active'));
            document.getElementById('pg-notice').classList.add('active');
            document.getElementById('acc-header-text').innerText = t('nav_notice');
        };
        document.getElementById('back-to-set').onclick = () => {
            document.getElementById('pg-notice').classList.remove('active');
            document.getElementById('pg-set').classList.add('active');
            document.getElementById('acc-header-text').innerText = t('nav_set');
        };

        refresh();
    }

    const start = () => {
        if (document.body) {
            init();
            new MutationObserver(() => { if (!document.getElementById('acc-mgr-fab')) init(); }).observe(document.body, { childList: true });
        } else setTimeout(start, 200);
    };

    GM_registerMenuCommand(t('menu_open'), () => {
        isForcedShow = true;
        init();
        if (fab) fab.style.display = 'flex';
        if (panel && !panel.classList.contains('show')) { panel.classList.add('show'); syncPanelPos(); }
        refresh();
    });

    if (document.readyState === 'complete' || document.readyState === 'interactive') start();
    else window.addEventListener('DOMContentLoaded', start);

    window.addEventListener('resize', () => {
        if (fab && fab.style.left) {
            fab.style.left = Math.min(Math.max(0, parseFloat(fab.style.left)), window.innerWidth - 44) + 'px';
            fab.style.top = Math.min(Math.max(0, parseFloat(fab.style.top)), window.innerHeight - 44) + 'px';
            if (panel && panel.classList.contains('show')) syncPanelPos();
        }
    });

    document.addEventListener('click', (e) => {
        if (panel && panel.classList.contains('show') && !panel.contains(e.target) && e.target !== fab) closePanel();
    });
})();