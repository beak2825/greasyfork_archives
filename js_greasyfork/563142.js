// ==UserScript==
// @name         AnMe
// @author       zjw
// @version      9.7.0
// @namespace    https://github.com/Zhu-junwei/AnMe
// @description  通用网站多账号切换工具，保存并恢复 Cookie 与存储数据
// @description:zh  通用网站多账号切换工具，保存并恢复 Cookie 与存储数据
// @description:en  Universal multi-account switching tool for websites, supporting saving and restoring of Cookies and storage data.
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
// @downloadURL https://update.greasyfork.org/scripts/563142/AnMe.user.js
// @updateURL https://update.greasyfork.org/scripts/563142/AnMe.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.self !== window.top) return;

    // ========================================================================
    // 1. Constants & Configuration & Styles
    // ========================================================================

    const CONST = {
        PREFIX: 'acc_stable_',
        ORDER_PREFIX: 'acc_order_',
        CFG: {
            LANG: 'cfg_lang',
            FAB_MODE: 'cfg_fab_mode',
            FAB_POS: 'cfg_fab_pos'
        },
        HOST: location.hostname,
        META: {
            NAME: GM_info.script.name,
            VERSION: GM_info.script.version,
            AUTHOR: GM_info.script.author,
            LINKS: {
                PROJECT: "https://github.com/Zhu-junwei/AnMe",
                DONATE: "https://www.cnblogs.com/zjw-blog/p/19466109"
            }
        }
    };

    const I18N_DATA = {
        zh: {
            _name: "简体中文",
            nav_switch: "账号切换", nav_mgr: "管理账号", nav_set: "高级设置", nav_notice: "使用声明", nav_about: "关于脚本",
            placeholder_name: "给新账号命名...", tip_help: "切换登录失败？尝试勾选 LocalStorage 和 SessionStorage。",
            tip_lock: "为保证正常读取Cookie，请在篡改猴高级模式下，设置允许脚本访问 Cookie: ALL",
            btn_save: "保存当前账号", btn_clean: "切换新环境 (清空本站痕迹)",
            set_fab_mode: "悬浮球显示模式", fab_auto: "智能", fab_show: "常驻", fab_hide: "隐藏",
            fab_auto_title: "有账号记录时自动显示，无记录时隐藏", fab_show_title: "始终显示悬浮球",fab_hide_title: "平时不显示，仅能通过菜单唤起",
            set_lang: "语言设置 / Language", set_backup: "数据备份与还原",
            btn_exp_curr: "导出当前网站数据", btn_exp_all: "导出脚本全部数据", btn_imp: "导入备份文件",
            donate: "支持作者", btn_clear_all: "清空脚本所有数据 (慎用)",
            notice_title: "《使用声明与免责条款》", back: "← 返回上一级",
            no_data: "🍃 暂无账号记录", confirm_clean: "确定清空当前网站所有痕迹并开启新环境？",
            confirm_clear_all: "⚠️ 警告：这将删除本脚本保存的所有网站的所有账号数据！且无法恢复！",
            import_ok: "✅ 成功导入/更新 {count} 个账号！", import_err: "❌ 导入失败：文件格式错误",
            export_err: "⚠️ 没有可导出的数据", menu_open: "🚀 开启账号管理",
            tag_ck: "CK", tag_ls: "LS", tag_ss: "SS",
            dlg_ok: "确定", dlg_cancel: "取消",
            about_desc: "本脚本旨在提供简单高效的多账号切换方案。",
            notice_content: `
                 <h4>1. 脚本功能说明</h4>
                 <p>本脚本通过篡改猴插件提供的存储API，将当前网站的 Cookie、LocalStorage 和 SessionStorage 进行快照保存。当您点击切换时，脚本会清空当前痕迹并还原选中的快照数据，从而实现多账号快速登录。</p>
                 <h4>2. 数据存储安全</h4>
                 <p>所有账号数据均存储在您浏览器的篡改猴插件内部管理器中（GM_setValue），脚本没有联网权限，更不会上传任何数据到远程服务器。</p>
                 <h4>3. 风险提示</h4>
                 <p>由于浏览器环境的开放性，本脚本无法阻止同域名下的其他恶意脚本通过篡改猴 API 或存储机制尝试获取这些数据。请勿在公共电脑或不可信的设备环境中使用本脚本保存重要账号。</p>
                 <h4>4. 免责声明</h4>
                 <p>本脚本仅供学习交流使用。因使用本脚本导致的账号被封禁、数据泄露或任何形式的损失，作者不承担任何法律责任。</p>`
        },
        en: {
            _name: "English",
            nav_switch: "Accounts", nav_mgr: "Manage", nav_set: "Settings", nav_notice: "Disclaimer", nav_about: "About",
            placeholder_name: "Name this account...", tip_help: "Switch failed? Try checking LS/SS.",
            tip_lock: "Set 'Cookie Access' to 'ALL' in Tampermonkey settings.",
            btn_save: "Save Current", btn_clean: "New Env",
            set_fab_mode: "Float Button Mode", fab_auto: "Auto", fab_show: "Show", fab_hide: "Hide",
            fab_auto_title: "Automatically show when accounts exist, hide when none",fab_show_title: "Always show the floating button",fab_hide_title: "Hidden by default, can only be activated via the menu",
            set_lang: "Language / 语言设置", set_backup: "Backup & Restore",
            btn_exp_curr: "Export Current Site", btn_exp_all: "Export All Data", btn_imp: "Import Backup",
            donate: "Buy me a coffee",btn_clear_all: "Clear All App Data",
            notice_title: "Disclaimer & Terms", back: "← Back",
            no_data: "🍃 No accounts", confirm_clean: "Clear all local traces?",
            confirm_clear_all: "⚠️ Warning: This deletes ALL data for ALL sites! Continue?",
            import_ok: "✅ Imported {count} accounts!", import_err: "❌ Invalid format",
            export_err: "⚠️ No data", menu_open: "🚀 Open Manager",
            tag_ck: "CK", tag_ls: "LS", tag_ss: "SS",
            dlg_ok: "OK", dlg_cancel: "Cancel",
            about_desc: "A simple and efficient solution for account switching.",
            notice_content: `
                <h4>1. Function Description</h4>
                <p>This script snapshots Cookies, LocalStorage, and SessionStorage via Tampermonkey's storage API. It clears current traces and restores selected snapshots for fast switching.</p>
                <h4>2. Data Security</h4>
                <p>All data is stored locally within Tampermonkey (GM_setValue). The script has no network permissions.</p>
                <h4>3. Risk Warning</h4>
                <p>The script cannot prevent other malicious scripts on the same domain from attempting to access this data. Do not use on public devices.</p>
                <h4>4. Disclaimer</h4>
                <p>This script is for educational purposes. The author is not responsible for any loss resulting from use.</p>`
        }

    };

    const STYLE_CSS = `
        #acc-mgr-fab { position: fixed; bottom: 100px; right: 30px; width: 44px; height: 44px; background: #2196F3; color: white; border-radius: 50%; display: none; align-items: center; justify-content: center; font-size: 20px; cursor: move; z-index: 1000000; box-shadow: 0 4px 10px rgba(0,0,0,0.2); user-select: none; border: none; touch-action: none; }
        .acc-panel { position: fixed; width: 340px; background: white; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.25); z-index: 1000001; display: none; flex-direction: column; font-family: system-ui, -apple-system, sans-serif; border: 1px solid #ddd; overflow: hidden; height: 480px;overscroll-behavior: none !important;}
        .acc-panel.show { display: flex; }
        .acc-header { height: 40px; display: flex; align-items: center; padding: 0 15px; border-bottom: 1px solid #eee; background: #fdfdfd; font-weight: bold; font-size: 14px; color: #333; flex-shrink: 0; justify-content: space-between; }
        .acc-tab-content { flex: 1; display: none; padding: 15px; overflow: hidden; flex-direction: column; background: #fff; }
        .acc-tab-content.active { display: flex; }
        .acc-tabs-footer { display: flex; background: #f8f9fa; border-top: 1px solid #eee; height: 60px; padding-bottom: 6px; flex-shrink: 0; box-sizing: border-box; }
        .acc-tab-btn { flex: 1; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 12px; color: #666; font-weight: bold; border-top: 2px solid transparent; flex-direction: column; padding-top: 6px;}
        .acc-tab-btn span { font-size: 18px; margin-bottom: 2px; }
        .acc-tab-btn.active { color: #2196F3; border-top-color: #2196F3; background: white; }
        .acc-scroll-area { flex: 1; overflow-y: auto; padding-right: 4px; margin-top: 2px; overscroll-behavior: contain;}
        .acc-scroll-area::-webkit-scrollbar { width: 4px; }
        .acc-scroll-area::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; }

        /* --- Customized Elements --- */
        .acc-backup-row { display: flex; gap: 8px; margin-bottom: 10px; justify-content: space-between; }
        .acc-icon-btn { flex: 1; height: 38px; padding: 0; border-radius: 6px; border: 1px solid #eee; background: #f9f9f9; cursor: pointer; font-size: 18px; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
        .acc-icon-btn:hover { background: #e3f2fd; border-color: #2196F3; }
        .acc-icon-btn.danger:hover { background: #ffebee; border-color: #f44336; color: #f44336; }

        .acc-about-content { padding: 5px; color: #444 !important; font-size: 13px !important; line-height: 1.6 !important; text-align: left !important; }
        .acc-about-header { text-align: center !important; margin-bottom: 20px !important; }
        .acc-about-logo { font-size: 20px !important; margin-bottom: 5px !important; display: block !important; }
        .acc-about-name { font-weight: bold !important; font-size: 16px !important; color: #333 !important; }
        .acc-about-ver { color: #999 !important; font-size: 12px !important; }
        .acc-about-item { display: flex !important; justify-content: space-between !important; padding: 3px 0 !important; border-bottom: 1px solid #f5f5f5 !important; }
        .acc-about-label { color: #888 !important; font-weight: bold !important; }

        /* Custom Dialog UI */
        .acc-dialog-mask { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); z-index: 2000005; display: none; align-items: center; justify-content: center; backdrop-filter: blur(2px); }
        .acc-dialog-box { background: white; width: 280px; border-radius: 12px; padding: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); animation: accPop 0.05s ease-out; display: flex; flex-direction: column; }
        @keyframes accPop { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .acc-dialog-msg { font-size: 14px; color: #333; margin-bottom: 20px; line-height: 1.5; text-align: center; white-space: pre-wrap; font-weight: 500; }
        .acc-dialog-footer { display: flex; gap: 10px; }
        .acc-dialog-btn { flex: 1; padding: 8px 0; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 13px; transition: 0.1s; }
        .acc-dialog-btn-ok { background: #2196F3; color: white; }
        .acc-dialog-btn-ok:hover { background: #1976D2; }
        .acc-dialog-btn-cancel { background: #f5f5f5; color: #666; }
        .acc-dialog-btn-cancel:hover { background: #e0e0e0; }

        /* Others ... */
        .acc-switch-card { padding: 12px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 8px; cursor: pointer; transition: 0.2s; position: relative; }
        .acc-switch-card:hover { border-color: #2196F3; background: #f7fbff; }
        .acc-card-name { font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 6px; margin-bottom: 6px; color: #333; }
        .acc-card-meta { font-size: 10px; color: #999; display: flex; flex-wrap: wrap; gap: 4px; }
        .acc-mini-tag { background: #f0f0f0; padding: 1px 5px; border-radius: 3px; color: #777; transition: all 0.2s; border: 1px solid transparent; }
        .acc-click-tag { cursor: pointer; text-decoration: none; position: relative; }
        .acc-click-tag:hover { background: #2196F3; color: white; border-color: #1976D2; z-index: 2; }
        .acc-mgr-item { display: flex; align-items: center; margin-top: 2px; border-bottom: 1px solid #f9f9f9; background: white; cursor: grab; }
        .acc-mgr-item.dragging { opacity: 0.4; background: #e3f2fd; border: 1px dashed #2196F3; }
        .acc-mgr-handle { margin: 0 8px; color: #ccc; font-size: 14px; user-select: none; cursor: grab; }
        .acc-mgr-input { flex: 1; border: 1px solid transparent; padding: 3px; font-size: 13px; outline: none; border-radius: 4px; background: transparent; }
        .acc-btn-del { color: #ccc; cursor: pointer; padding: 0 12px; font-size: 20px; font-weight: 300; user-select: none; }
        .acc-btn-del:hover { color: #f44336; }
        .acc-action-fixed { border-top: 1px solid #eee; padding-top: 12px; flex-shrink: 0; }
        .acc-row-btn { display: flex; gap: 8px; align-items: center; }
        .acc-input-text { flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; box-sizing: border-box; }
        .acc-btn { border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 13px; display: flex; align-items: center; justify-content: center; gap: 5px; transition: 0.2s; }
        .acc-btn-blue { flex: 1; background: #2196F3; color: white; }
        .acc-btn-plus { width: 38px; height: 38px; background: #fff; color: #666; border: 1px solid #ddd; font-size: 20px; }
        .acc-btn-plus:hover { border-color: #2196F3; color: #2196F3; }
        .acc-help-tip, .acc-lock-tip { display: inline-block; width: 16px; height: 16px; border-radius: 50%; font-size: 11px; line-height: 16px; text-align: center; cursor: help; margin-left: 2px; }
        .acc-help-tip { background: #eee; color: #999; }
        .acc-lock-tip { background: transparent; font-size: 12px; margin-left: 8px; }
        .acc-set-group { margin-bottom: 10px; }
        .acc-set-title { font-size: 12px; font-weight: bold; color: #999; margin-bottom: 8px; }
        .acc-set-row { display: flex; gap: 10px; margin-bottom: 10px; padding: 0 3px;}
        .acc-btn-light { background: #f5f5f5; color: #333; flex: 1; border: 1px solid #eee; }
        .acc-btn-light:hover { background: #e0e0e0; }
        .acc-btn-active { background: #2196F3 !important; color: white !important; border-color: #2196F3 !important; }
        .acc-notice-content { line-height: 1.6; color: #444; font-size: 13px; }
        .acc-notice-content h4 { margin: 15px 0 8px 0; color: #333; border-left: 3px solid #2196F3; padding-left: 8px; }
        .acc-link-btn { color: #2196F3; cursor: pointer; text-decoration: underline; font-size: 12px; }
        .acc-select-ui { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; background: #fff; cursor: pointer; outline: none; }
        .acc-chk-label { display: inline-flex !important; align-items: center !important; cursor: pointer !important; margin-right: 8px !important; user-select: none; font-size: 12px; }
        .acc-custom-chk { appearance: none !important; width: 14px !important; height: 14px !important; border: 1px solid #ccc !important; border-radius: 3px !important; margin-right: 4px !important; cursor: pointer !important; position: relative !important; }
        .acc-custom-chk:checked { background-color: #2196F3 !important; border-color: #2196F3 !important; }
        .acc-custom-chk:checked::after { content: ''; position: absolute !important; left: 4px !important; top: 1px !important; width: 3px !important; height: 7px !important; border: solid white !important; border-width: 0 2px 2px 0 !important; transform: rotate(45deg) !important; }
    `;

    // ========================================================================
    // 2. Global State & Utils
    // ========================================================================

    let currentLang = GM_getValue(CONST.CFG.LANG, navigator.language.startsWith('zh') ? 'zh' : 'en');
    if (!I18N_DATA[currentLang]) currentLang = 'en';

    let currentViewingHost = CONST.HOST;
    let isForcedShow = false;
    let fab, panel, dialogMask;

    const Utils = {
        t: (key) => I18N_DATA[currentLang][key] || key,
        extractName: (key) => key.split('::')[1] || key,
        makeKey: (name, host = CONST.HOST) => `${CONST.PREFIX}${host}::${name}`,
        listAllHosts: () => [...new Set(GM_listValues().filter(v => v.startsWith(CONST.PREFIX)).map(v => v.split('::')[0].replace(CONST.PREFIX, '')))],
        getSortedKeysByHost: (host) => {
            const allKeys = GM_listValues().filter(k => k.startsWith(`${CONST.PREFIX}${host}::`));
            const savedOrder = GM_getValue(CONST.ORDER_PREFIX + host, []);
            return allKeys.sort((a, b) => {
                const nameA = Utils.extractName(a);
                const nameB = Utils.extractName(b);
                let idxA = savedOrder.indexOf(nameA);
                let idxB = savedOrder.indexOf(nameB);
                if (idxA === -1) idxA = 9999;
                if (idxB === -1) idxB = 9999;
                if (idxA !== idxB) return idxA - idxB;
                const dataA = GM_getValue(a);
                const dataB = GM_getValue(b);
                return new Date(dataB.time || 0) - new Date(dataA.time || 0);
            });
        }
    };

    // ========================================================================
    // 3. Core Logic (Data & Storage)
    // ========================================================================

    const Core = {
        async saveAccount(name, options = { ck: true, ls: false, ss: false }) {
            const snapshot = {
                time: new Date().toLocaleString('zh-CN', { hour12: false }),
                localStorage: options.ls ? { ...localStorage } : {},
                sessionStorage: options.ss ? { ...sessionStorage } : {},
                cookies: []
            };
            if (options.ck) {
                snapshot.cookies = await new Promise(res => GM_cookie.list({ url: window.location.href }, res));
            }
            GM_setValue(Utils.makeKey(name), snapshot);
            const currentOrder = GM_getValue(CONST.ORDER_PREFIX + CONST.HOST, []);
            if (!currentOrder.includes(name)) {
                currentOrder.push(name);
                GM_setValue(CONST.ORDER_PREFIX + CONST.HOST, currentOrder);
            }
        },

        async loadAccount(key) {
            const data = GM_getValue(key);
            if (!data) return;
            localStorage.clear(); sessionStorage.clear();
            const ck = await new Promise(res => GM_cookie.list({ url: window.location.href }, res));
            for (const c of (ck || [])) await new Promise(res => GM_cookie.delete({ url: window.location.href, name: c.name }, res));
            Object.entries(data.localStorage || {}).forEach(([k, v]) => localStorage.setItem(k, v));
            Object.entries(data.sessionStorage || {}).forEach(([k, v]) => sessionStorage.setItem(k, v));
            for (const c of (data.cookies || [])) {
                const d = { ...c, url: window.location.href }; delete d.hostOnly; delete d.session;
                await new Promise(res => GM_cookie.set(d, res));
            }
            location.reload();
        },

        async cleanEnvironment() {
            localStorage.clear(); sessionStorage.clear();
            const ck = await new Promise(res => GM_cookie.list({ url: window.location.href }, res));
            for (const c of (ck || [])) await new Promise(res => GM_cookie.delete({ url: window.location.href, name: c.name }, res));
            location.reload();
        },

        inspectData(key, type) {
            const data = GM_getValue(key);
            if (!data) return;
            let content = null;
            if (type === 'cookies') content = data.cookies;
            else if (type === 'localStorage') content = data.localStorage;
            else if (type === 'sessionStorage') content = data.sessionStorage;
            if (content) {
                const win = window.open("", "_blank");
                if (win) {
                    win.document.write(`<html><head><title>AnMe Inspector</title><style>body{font-family:monospace;padding:20px;background:#f5f5f5}pre{white-space:pre-wrap;word-wrap:break-word;background:#fff;padding:15px;border:1px solid #ddd;border-radius:5px}</style></head><body><h3>${Utils.extractName(key)} - ${type}</h3><pre>${JSON.stringify(content, null, 2)}</pre></body></html>`);
                    win.document.close();
                }
            }
        },

        renameAccount(oldKey, newName, host) {
            const data = GM_getValue(oldKey);
            GM_deleteValue(oldKey);
            GM_setValue(Utils.makeKey(newName, host), data);
            const orderKey = CONST.ORDER_PREFIX + host;
            let order = GM_getValue(orderKey, []);
            const idx = order.indexOf(Utils.extractName(oldKey));
            if(idx !== -1) { order[idx] = newName; GM_setValue(orderKey, order); }
        },

        deleteAccount(key, host) {
            GM_deleteValue(key);
            const orderKey = CONST.ORDER_PREFIX + host;
            const name = Utils.extractName(key);
            const order = GM_getValue(orderKey, []);
            GM_setValue(orderKey, order.filter(n => n !== name));
        },

        updateOrder(host, nameList) { GM_setValue(CONST.ORDER_PREFIX + host, nameList); },

        async exportData(scope) {
            let exportObj = {};
            const allKeys = GM_listValues();
            const targetAccKeys = scope === 'current' ? allKeys.filter(k => k.startsWith(`${CONST.PREFIX}${CONST.HOST}::`)) : allKeys.filter(k => k.startsWith(CONST.PREFIX));

            if (targetAccKeys.length === 0) { await UI.alert(Utils.t('export_err')); return; }
            targetAccKeys.forEach(key => exportObj[key] = GM_getValue(key));

            if (scope === 'current') {
                const orderKey = CONST.ORDER_PREFIX + CONST.HOST;
                const orderVal = GM_getValue(orderKey);
                if (orderVal) exportObj[orderKey] = orderVal;
            } else {
                allKeys.filter(k => k.startsWith(CONST.ORDER_PREFIX)).forEach(k => exportObj[k] = GM_getValue(k));
            }

            const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const downsite = scope === 'current' ? CONST.HOST : 'All_Sites';
            const a = document.createElement('a'); a.href = url; a.download = `${CONST.META.NAME}_Backup_${downsite}_${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url);
        },

        async importData(file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    let count = 0;
                    const hostsInFile = [...new Set(Object.keys(data).filter(k => k.startsWith(CONST.PREFIX)).map(k => k.replace(CONST.PREFIX, '').split('::')[0]))];
                    hostsInFile.forEach(host => {
                        const orderKey = CONST.ORDER_PREFIX + host;
                        const fileOrder = data[orderKey] || [];
                        let localOrder = GM_getValue(orderKey, []);
                        const namesToImport = fileOrder.length > 0 ? fileOrder : Object.keys(data).filter(k => k.startsWith(`${CONST.PREFIX}${host}::`)).map(k => k.split('::')[1]);
                        namesToImport.forEach(name => {
                            const fullKey = `${CONST.PREFIX}${host}::${name}`;
                            if (data[fullKey]) {
                                GM_setValue(fullKey, data[fullKey]);
                                if (!localOrder.includes(name)) localOrder.push(name);
                                count++;
                            }
                        });
                        GM_setValue(orderKey, localOrder);
                    });
                    await UI.alert(Utils.t('import_ok').replace('{count}', count));
                    UI.refresh();
                } catch (err) {
                    await UI.alert(Utils.t('import_err'));
                }
            };
            reader.readAsText(file);
        },

        clearAllData() {
            GM_listValues().forEach(k => { if (k.startsWith(CONST.PREFIX) || k.startsWith(CONST.ORDER_PREFIX)) GM_deleteValue(k); });
        }
    };

    // ========================================================================
    // 4. UI Rendering & Templates
    // ========================================================================

    const Templates = {
        panel: () => {
            const langOptions = Object.keys(I18N_DATA).map(code => `<option value="${code}" ${currentLang === code ? 'selected' : ''}>${I18N_DATA[code]._name}</option>`).join('');

            return `
            <div class="acc-header">
                <div class="acc-header-title" id="acc-header-text">${Utils.t('nav_switch')}</div>
                <div style="cursor:pointer; color:#ccc;" id="acc-close-btn">✕</div>
            </div>

            <div class="acc-tab-content active" id="pg-switch"><div class="acc-scroll-area" id="switch-area"></div></div>

            <div class="acc-tab-content" id="pg-mgr">
                <select id="host-sel" style="width:100%; padding:6px; margin-bottom:10px; font-size:12px; border:1px solid #eee; border-radius:4px; outline:none; cursor:pointer; background:#fff;"></select>
                <div class="acc-scroll-area" id="mgr-list-area"></div>
                <div class="acc-action-fixed" id="mgr-fixed-actions">
                    <input type="text" id="acc-new-name" class="acc-input-text" placeholder="${Utils.t('placeholder_name')}" style="margin-bottom:8px; width:100%;">
                    <div style="display:flex; align-items:center; flex-wrap:wrap; font-size:11px; color:#666; margin-bottom:10px;">
                        <label class="acc-chk-label"><input type="checkbox" id="c-ck" class="acc-custom-chk"> Cookie</label>
                        <label class="acc-chk-label"><input type="checkbox" id="c-ls" class="acc-custom-chk"> LS</label>
                        <label class="acc-chk-label"><input type="checkbox" id="c-ss" class="acc-custom-chk"> SS</label>
                        <span class="acc-help-tip" title="${Utils.t('tip_help')}">?</span>
                        <span class="acc-lock-tip" title="${Utils.t('tip_lock')}">🔒</span>
                    </div>
                    <div class="acc-row-btn">
                        <button id="do-save" class="acc-btn acc-btn-blue"><span>💾</span> ${Utils.t('btn_save')}</button>
                        <button id="do-clean" class="acc-btn acc-btn-plus" title="${Utils.t('btn_clean')}">+</button>
                    </div>
                </div>
            </div>

            <div class="acc-tab-content" id="pg-set">
                <div class="acc-scroll-area">
                    <div class="acc-set-group">
                        <div class="acc-set-title">${Utils.t('set_fab_mode')}</div>
                        <div class="acc-set-row">
                            <button class="acc-btn acc-btn-light fab-mode-btn" data-val="auto" title="${Utils.t('fab_auto_title')}">${Utils.t('fab_auto')}</button>
                            <button class="acc-btn acc-btn-light fab-mode-btn" data-val="show" title="${Utils.t('fab_show_title')}">${Utils.t('fab_show')}</button>
                            <button class="acc-btn acc-btn-light fab-mode-btn" data-val="hide" title="${Utils.t('fab_hide_title')}">${Utils.t('fab_hide')}</button>
                        </div>
                    </div>
                    <div class="acc-set-group">
                        <div class="acc-set-title">${Utils.t('set_lang')}</div>
                        <div class="acc-set-row"><select id="lang-sel" class="acc-select-ui">${langOptions}</select></div>
                    </div>
                    <div class="acc-set-group">
                        <div class="acc-set-title">${Utils.t('set_backup')}</div>
                        <div class="acc-backup-row">
                            <button class="acc-icon-btn" id="btn-export-curr" title="${Utils.t('btn_exp_curr')}">📤</button>
                            <button class="acc-icon-btn" id="btn-export-all" title="${Utils.t('btn_exp_all')}">📦</button>
                            <button class="acc-icon-btn" id="btn-import-trigger" title="${Utils.t('btn_imp')}">📥</button>
                            <button class="acc-icon-btn danger" id="btn-clear-all" title="${Utils.t('btn_clear_all')}">🗑️</button>
                            <input type="file" id="inp-import-file" accept=".json" style="display:none">
                        </div>
                    </div>
                    <div class="acc-set-group">
                        <div class="acc-set-title">${Utils.t('nav_about')}</div>
                        <button class="acc-btn acc-btn-light" id="go-about" style="width:100%">${Utils.t('nav_about')}</button>
                    </div>
                    <div style="text-align: center; margin-top: 20px;">
                       <span class="acc-link-btn" id="go-notice">${Utils.t('notice_title')}</span>
                    </div>
                </div>
            </div>

            <div class="acc-tab-content" id="pg-about">
                 <div style="margin-bottom: 5px; font-weight: bold; color: #2196F3; cursor: pointer;" class="back-to-set-btn">${Utils.t('back')}</div>
                 <div class="acc-scroll-area">
                    <div class="acc-about-content">
                        <div class="acc-about-header">
                            <div class="acc-about-logo">👥</div>
                            <div class="acc-about-name">${CONST.META.NAME}</div>
                            <div class="acc-about-ver">Version ${CONST.META.VERSION}</div>
                            <div style="margin:3px 0; color:#666;">${Utils.t('about_desc')}</div>
                        </div>
                        <div class="acc-about-item"><span class="acc-about-label">Author</span><span>${CONST.META.AUTHOR}</span></div>
                        <div class="acc-about-item"><span class="acc-about-label">License</span><span>MIT</span></div>
                        <div class="acc-about-item"><span class="acc-about-label">Github</span><a href="${CONST.META.LINKS.PROJECT}" target="_blank" style="color:#2196F3">View Repo</a></div>
                        <div style="text-align:center;margin-top:20px;">
                            <a href="${CONST.META.LINKS.DONATE}" target="_blank" class="acc-btn acc-btn-blue" style="text-decoration:none; display:inline-flex; width:80%;">☕ ${Utils.t('donate')}</a>
                        </div>
                    </div>
                 </div>
            </div>

            <div class="acc-tab-content" id="pg-notice">
               <div style="margin-bottom: 5px; font-weight: bold; color: #2196F3; cursor: pointer;" class="back-to-set-btn">${Utils.t('back')}</div>
               <div class="acc-scroll-area"><div class="acc-notice-content">${Utils.t('notice_content')}</div></div>
            </div>

            <div class="acc-tabs-footer">
                <div class="acc-tab-btn active" data-pg="pg-switch" data-title="${Utils.t('nav_switch')}"><span>🔃</span>${Utils.t('nav_switch')}</div>
                <div class="acc-tab-btn" data-pg="pg-mgr" data-title="${Utils.t('nav_mgr')}"><span>👥</span>${Utils.t('nav_mgr')}</div>
                <div class="acc-tab-btn" data-pg="pg-set" data-title="${Utils.t('nav_set')}"><span>⚙️</span>${Utils.t('nav_set')}</div>
            </div>
        `},
        switchCard: (key, data) => `
            <div class="acc-switch-card" data-key="${key}">
                <span class="acc-card-name">👤 ${Utils.extractName(key)}</span>
                <div class="acc-card-meta">
                    <span class="acc-mini-tag">🕒 ${data.time || 'N/A'}</span>
                    ${(data.cookies?.length || 0) ? `<span class="acc-mini-tag acc-click-tag" data-type="cookies">${Utils.t('tag_ck')}: ${data.cookies.length}</span>` : ''}
                    ${Object.keys(data.localStorage || {}).length ? `<span class="acc-mini-tag acc-click-tag" data-type="localStorage">${Utils.t('tag_ls')}: ${Object.keys(data.localStorage).length}</span>` : ''}
                    ${Object.keys(data.sessionStorage || {}).length ? `<span class="acc-mini-tag acc-click-tag" data-type="sessionStorage">${Utils.t('tag_ss')}: ${Object.keys(data.sessionStorage).length}</span>` : ''}
                </div>
            </div>
        `,
        mgrItem: (key) => `
            <div class="acc-mgr-item" draggable="true">
                <span class="acc-mgr-handle">☰</span>
                <input type="text" class="acc-mgr-input" value="${Utils.extractName(key)}" data-key="${key}">
                <span class="acc-btn-del" data-key="${key}">×</span>
            </div>
        `,
        noData: () => `<div style="text-align:center;color:#ccc;margin-top:100px;font-size:13px;">${Utils.t('no_data')}</div>`
    };

    const UI = {
        // --- Custom Dialog System ---
        async alert(msg) { return this.showDialog(msg, false); },
        async confirm(msg) { return this.showDialog(msg, true); },
        showDialog(msg, isConfirm) {
            return new Promise(resolve => {
                if (!dialogMask) {
                    dialogMask = document.createElement('div'); dialogMask.className = 'acc-dialog-mask';
                    document.body.appendChild(dialogMask);
                }
                dialogMask.innerHTML = `
                    <div class="acc-dialog-box">
                        <div class="acc-dialog-msg">${msg}</div>
                        <div class="acc-dialog-footer">
                            ${isConfirm ? `<button class="acc-dialog-btn acc-dialog-btn-cancel" id="acc-dlg-cancel">${Utils.t('dlg_cancel')}</button>` : ''}
                            <button class="acc-dialog-btn acc-dialog-btn-ok" id="acc-dlg-ok">${Utils.t('dlg_ok')}</button>
                        </div>
                    </div>
                `;
                dialogMask.style.display = 'flex';
                const okBtn = dialogMask.querySelector('#acc-dlg-ok');
                const cancelBtn = dialogMask.querySelector('#acc-dlg-cancel');
                const close = (res) => { dialogMask.style.display = 'none'; resolve(res); };
                okBtn.onclick = () => close(true);
                if (cancelBtn) cancelBtn.onclick = () => close(false);
            });
        },

        initDraggable() {
            const container = document.getElementById('mgr-list-area');
            if (!container) return;
            let draggingEle = null;
            const onDragStart = (e) => { draggingEle = e.target.closest('.acc-mgr-item'); if (draggingEle) draggingEle.classList.add('dragging'); };
            const onDragEnd = (e) => {
                if (draggingEle) {
                    draggingEle.classList.remove('dragging'); draggingEle = null;
                    const items = [...container.querySelectorAll('.acc-mgr-input')];
                    const newOrder = items.map(input => Utils.extractName(input.dataset.key));
                    Core.updateOrder(currentViewingHost, newOrder);
                    UI.renderSwitchView();
                }
            };
            const onDragOver = (e) => {
                e.preventDefault();
                const afterElement = getDragAfterElement(container, e.clientY);
                if (afterElement == null) container.appendChild(draggingEle); else container.insertBefore(draggingEle, afterElement);
            };
            function getDragAfterElement(container, y) {
                const draggableElements = [...container.querySelectorAll('.acc-mgr-item:not(.dragging)')];
                return draggableElements.reduce((closest, child) => {
                    const box = child.getBoundingClientRect();
                    const offset = y - box.top - box.height / 2;
                    if (offset < 0 && offset > closest.offset) return { offset: offset, element: child }; else return closest;
                }, { offset: Number.NEGATIVE_INFINITY }).element;
            }
            container.removeEventListener('dragstart', container._ds); container.removeEventListener('dragend', container._de); container.removeEventListener('dragover', container._do);
            container._ds = onDragStart; container._de = onDragEnd; container._do = onDragOver;
            container.addEventListener('dragstart', onDragStart); container.addEventListener('dragend', onDragEnd); container.addEventListener('dragover', onDragOver);
        },

        renderSwitchView() {
            const currentKeys = Utils.getSortedKeysByHost(CONST.HOST);
            const switchArea = document.getElementById('switch-area');
            if (!switchArea) return;
            switchArea.innerHTML = currentKeys.length === 0 ? Templates.noData() : currentKeys.map(k => Templates.switchCard(k, GM_getValue(k))).join('');
        },

        renderMgrView() {
            const mgrList = document.getElementById('mgr-list-area');
            if (!mgrList) return;
            const viewingKeys = Utils.getSortedKeysByHost(currentViewingHost);
            mgrList.innerHTML = viewingKeys.map(k => Templates.mgrItem(k)).join('');
            this.initDraggable();
            mgrList.querySelectorAll('.acc-mgr-input').forEach(i => {
                const row = i.closest('.acc-mgr-item');
                i.onmouseenter = () => { if(row) row.setAttribute('draggable', 'false'); };
                i.onmouseleave = () => { if(row) row.setAttribute('draggable', 'true'); };
                i.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); i.blur(); } };
                i.onblur = () => {
                    const val = i.value.trim();
                    if (val && val !== Utils.extractName(i.dataset.key)) { Core.renameAccount(i.dataset.key, val, currentViewingHost); UI.refresh(); }
                };
            });
        },

        refresh() {
            if (!fab || !panel) return;
            this.renderSwitchView();
            const hosts = Utils.listAllHosts();
            if (!hosts.includes(CONST.HOST)) hosts.push(CONST.HOST);
            const hostSel = document.getElementById('host-sel');
            if (hostSel) hostSel.innerHTML = hosts.map(h => `<option value="${h}" ${h === currentViewingHost ? 'selected' : ''}>${h === CONST.HOST ? '📌 ' : '🌐 '}${h}</option>`).join('');
            this.renderMgrView();
            const fixedAct = document.getElementById('mgr-fixed-actions');
            if (fixedAct) fixedAct.style.display = (currentViewingHost === CONST.HOST) ? 'block' : 'none';
            const fabMode = GM_getValue(CONST.CFG.FAB_MODE, 'auto');
            const hasAccounts = Utils.getSortedKeysByHost(CONST.HOST).length > 0;
            const isPanelOpen = panel.classList.contains('show');
            panel.querySelectorAll('.fab-mode-btn').forEach(btn => btn.classList.toggle('acc-btn-active', btn.dataset.val === fabMode));
            fab.style.display = (isPanelOpen || isForcedShow || (fabMode === 'show') || (fabMode === 'auto' && hasAccounts)) ? 'flex' : 'none';
        },

        syncPanelPos() {
            if (!fab || !panel) return;
            const r = fab.getBoundingClientRect();
            panel.style.bottom = (window.innerHeight - r.top + 10) + 'px';
            panel.style.left = Math.max(10, r.left - 290) + 'px';
        },

        closePanel() {
            panel.classList.remove('show'); isForcedShow = false; UI.refresh();
        },

        createFab() {
            if (document.getElementById('acc-mgr-fab')) { fab = document.getElementById('acc-mgr-fab'); return; }
            fab = document.createElement('div'); fab.id = 'acc-mgr-fab'; fab.innerHTML = '👤'; document.body.appendChild(fab);
            const savedPos = GM_getValue(CONST.CFG.FAB_POS);
            if (savedPos && savedPos.left !== undefined) {
                fab.style.left = Math.max(0, Math.min(savedPos.left, window.innerWidth - 44)) + 'px';
                fab.style.top = Math.max(0, Math.min(savedPos.top, window.innerHeight - 44)) + 'px';
                fab.style.bottom = 'auto'; fab.style.right = 'auto';
            }
            let isDrag = false;
            fab.onmousedown = (e) => {
                isDrag = false; let sx=e.clientX, sy=e.clientY, bx=fab.offsetLeft, by=fab.offsetTop;
                const mv=(ev)=>{
                    isDrag=true;
                    let nl = Math.max(0, Math.min(bx + ev.clientX - sx, window.innerWidth - 44));
                    let nt = Math.max(0, Math.min(by + ev.clientY - sy, window.innerHeight - 44));
                    fab.style.left= nl + 'px'; fab.style.top= nt + 'px'; fab.style.bottom='auto'; fab.style.right='auto';
                    if(panel && panel.classList.contains('show')) UI.syncPanelPos();
                };
                const up=()=>{ document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up); if (isDrag) GM_setValue(CONST.CFG.FAB_POS, { left: parseInt(fab.style.left), top: parseInt(fab.style.top) }); };
                document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up);
            };
            fab.onclick = (e) => { if(!isDrag && panel) { e.stopPropagation(); if(panel.classList.toggle('show')) UI.syncPanelPos(); else isForcedShow = false; UI.refresh(); } };
        },

        createPanel() {
            if (document.getElementById('acc-mgr-panel')) return;
            panel = document.createElement('div'); panel.id = 'acc-mgr-panel'; panel.className = 'acc-panel';
            panel.innerHTML = Templates.panel();
            document.body.appendChild(panel);
            this.bindPanelEvents(); this.updateSaveBtnState();
        },

        updateSaveBtnState() {
            const ck = document.getElementById('c-ck').checked, ls = document.getElementById('c-ls').checked, ss = document.getElementById('c-ss').checked;
            const saveBtn = document.getElementById('do-save');
            const isAnyChecked = ck || ls || ss;
            saveBtn.disabled = !isAnyChecked; saveBtn.style.opacity = isAnyChecked ? "1" : "0.5"; saveBtn.style.cursor = isAnyChecked ? "pointer" : "not-allowed";
        },

        bindPanelEvents() {
            // Tab switching
            panel.querySelectorAll('.acc-tab-btn').forEach(b => b.onclick = () => {
                panel.querySelectorAll('.acc-tab-btn, .acc-tab-content').forEach(el => el.classList.remove('active'));
                b.classList.add('active');
                document.getElementById(b.dataset.pg).classList.add('active');
                document.getElementById('acc-header-text').innerText = b.dataset.title;
            });

            // Close
            document.getElementById('acc-close-btn').onclick = this.closePanel;
            panel.onclick = (e) => e.stopPropagation();

            // Settings: Fab Mode & Language
            panel.querySelectorAll('.fab-mode-btn').forEach(btn => btn.onclick = () => { GM_setValue(CONST.CFG.FAB_MODE, btn.dataset.val); this.refresh(); });
            document.getElementById('lang-sel').onchange = (e) => {
                currentLang = e.target.value; GM_setValue(CONST.CFG.LANG, currentLang);
                document.body.removeChild(panel); UI.init();
                if (document.getElementById('acc-mgr-panel')) { const newPanel = document.getElementById('acc-mgr-panel'); newPanel.classList.add('show'); UI.syncPanelPos(); }
            };

            // Switch View Logic
            document.getElementById('switch-area').onclick = (e) => {
                const tag = e.target.closest('.acc-click-tag');
                if (tag) { e.stopPropagation(); const card = tag.closest('.acc-switch-card'); Core.inspectData(card.dataset.key, tag.dataset.type); return; }
                const card = e.target.closest('.acc-switch-card');
                if (card) Core.loadAccount(card.dataset.key);
            };

            // Manager View Logic
            document.getElementById('mgr-list-area').onclick = async (e) => {
                if (e.target.classList.contains('acc-btn-del')) {
                    e.stopPropagation();
                    const key = e.target.dataset.key;
                    Core.deleteAccount(key, currentViewingHost);
                    this.refresh();
                }
            };
            document.getElementById('host-sel').onchange = (e) => { currentViewingHost = e.target.value; this.refresh(); };

            // Save & Clean Logic (Async Dialogs)
            ['c-ck', 'c-ls', 'c-ss'].forEach(id => document.getElementById(id).addEventListener('change', this.updateSaveBtnState));
            document.getElementById('do-save').onclick = async () => {
                const nameInp = document.getElementById('acc-new-name');
                const name = nameInp.value.trim();
                if (!name) return;
                await Core.saveAccount(name, { ck: document.getElementById('c-ck').checked, ls: document.getElementById('c-ls').checked, ss: document.getElementById('c-ss').checked });
                nameInp.value = ""; this.refresh();
            };
            document.getElementById('do-clean').onclick = async () => { if(await UI.confirm(Utils.t('confirm_clean'))) Core.cleanEnvironment(); };

            // Backup & Restore Actions
            document.getElementById('btn-export-curr').onclick = () => Core.exportData('current');
            document.getElementById('btn-export-all').onclick = () => Core.exportData('all');
            document.getElementById('btn-import-trigger').onclick = () => document.getElementById('inp-import-file').click();
            document.getElementById('inp-import-file').onchange = (e) => { if(e.target.files.length) Core.importData(e.target.files[0]); e.target.value = ''; };
            document.getElementById('btn-clear-all').onclick = async () => {
                if (await UI.confirm(Utils.t('confirm_clear_all'))) { Core.clearAllData(); this.refresh(); }
            };

            // Sub-pages Navigation (Notice & About)
            const showSubPage = (pageId, titleKey) => {
                panel.querySelectorAll('.acc-tab-content').forEach(el => el.classList.remove('active'));
                document.getElementById(pageId).classList.add('active');
                document.getElementById('acc-header-text').innerText = Utils.t(titleKey);
            };
            const backToSet = () => {
                panel.querySelectorAll('.acc-tab-content').forEach(el => el.classList.remove('active'));
                document.getElementById('pg-set').classList.add('active');
                document.getElementById('acc-header-text').innerText = Utils.t('nav_set');
            };

            document.getElementById('go-notice').onclick = () => showSubPage('pg-notice', 'nav_notice');
            document.getElementById('go-about').onclick = () => showSubPage('pg-about', 'nav_about');
            panel.querySelectorAll('.back-to-set-btn').forEach(btn => btn.onclick = backToSet);
        },

        init() { this.createFab(); this.createPanel(); this.refresh(); }
    };

    // ========================================================================
    // 5. Initialization
    // ========================================================================

    GM_addStyle(STYLE_CSS);

    const start = () => {
        if (document.body) {
            UI.init();
            new MutationObserver(() => { if (!document.getElementById('acc-mgr-fab')) UI.init(); }).observe(document.body, { childList: true });
        } else { setTimeout(start, 200); }
    };

    window.addEventListener('resize', () => {
        if (fab && fab.style.left) {
            fab.style.left = Math.min(Math.max(0, parseFloat(fab.style.left)), window.innerWidth - 44) + 'px';
            fab.style.top = Math.min(Math.max(0, parseFloat(fab.style.top)), window.innerHeight - 44) + 'px';
            if (panel && panel.classList.contains('show')) UI.syncPanelPos();
        }
    });

    document.addEventListener('click', (e) => {
        if (panel && panel.classList.contains('show') && !panel.contains(e.target) && e.target !== fab && !e.target.closest('.acc-dialog-mask')) UI.closePanel();
    });

    GM_registerMenuCommand(Utils.t('menu_open'), () => {
        isForcedShow = true; UI.init();
        if (fab) fab.style.display = 'flex';
        if (panel && !panel.classList.contains('show')) { panel.classList.add('show'); UI.syncPanelPos(); }
        UI.refresh();
    });

    if (document.readyState === 'complete' || document.readyState === 'interactive') start();
    else window.addEventListener('DOMContentLoaded', start);

})();