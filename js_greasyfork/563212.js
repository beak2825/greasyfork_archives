// ==UserScript==
// @name         Linux Do Authorize Helper
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Linux Do 授权增强：语义化按钮定位、GM存储保障安全、XSS防御、可视化管理、支持通配符与编辑功能。
// @author       blackzero358
// @license      AGPLv3
// @match        https://connect.linux.do/oauth2/authorize*
// @icon         data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔑</text></svg>
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/563212/Linux%20Do%20Authorize%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/563212/Linux%20Do%20Authorize%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置常量 =================
    const CONFIG = {
        STORAGE_MODE: 'ld_auth_mode',
        STORAGE_LIST: 'ld_trusted_list',
        STORAGE_AUTO_ADD: 'ld_auto_add_manual',
        STORAGE_TRUST_OFFICIAL: 'ld_trust_official_subdomains',
        SELECTORS: {
            APPROVE_BTN: 'a[href*="/oauth2/approve/"]',
            APPROVE_TEXT_XPATH: "//a[contains(text(), '允许') or contains(text(), 'Authorize') or contains(text(), 'Approve')]",
            SITE_LINK: '.bg-white p.mb-2 a[href^="http"]'
        }
    };

    // ================= 样式定义 (Dark Mode) =================
    const styles = `
        /* 主面板 */
        #ld-auth-panel {
            position: fixed; bottom: 20px; right: 20px;
            background: #1f2937; color: #e5e7eb;
            padding: 16px; border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.6);
            z-index: 9999; font-size: 14px;
            border: 1px solid #374151; width: 260px;
            font-family: system-ui, -apple-system, sans-serif;
        }
        .ld-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .ld-title { font-weight: 700; color: #f3f4f6; font-size: 15px; }

        /* 控件通用 */
        .ld-select, .ld-input {
            width: 100%; padding: 8px; margin-bottom: 10px;
            background: #374151; border: 1px solid #4b5563;
            color: white; border-radius: 6px; outline: none;
            box-sizing: border-box;
        }
        .ld-input:focus { border-color: #60a5fa; }

        .ld-checkbox-row {
            display: flex; align-items: center; gap: 8px;
            margin-bottom: 8px; font-size: 12px; color: #9ca3af;
            transition: opacity 0.3s;
        }
        .ld-checkbox-row.hidden { display: none; }
        .ld-checkbox-row input { accent-color: #60a5fa; cursor: pointer; }
        .ld-checkbox-row label { cursor: pointer; user-select: none; }

        /* 状态条 */
        .ld-status {
            padding: 10px; border-radius: 6px; margin-bottom: 12px; margin-top: 5px;
            background: #111827; border: 1px solid #374151;
            font-size: 13px; line-height: 1.4;
        }
        .ld-status.safe { color: #34d399; border-color: #059669; }
        .ld-status.warn { color: #fbbf24; border-color: #d97706; }
        .ld-status.danger { color: #f87171; border-color: #dc2626; animation: pulse 2s infinite; }

        /* 按钮 */
        .ld-btn {
            width: 100%; padding: 8px; background: #374151; color: #e5e7eb;
            border: 1px solid #4b5563; border-radius: 6px; cursor: pointer;
            transition: all 0.2s; display: inline-flex; justify-content: center; align-items: center; gap: 5px;
        }
        .ld-btn:hover { background: #4b5563; }
        .ld-btn.primary { background: #2563eb; border-color: #1d4ed8; }
        .ld-btn.primary:hover { background: #1d4ed8; }
        .ld-btn.danger { color: #fca5a5; border-color: #7f1d1d; }
        .ld-btn.danger:hover { background: #991b1b; color: white; }
        .ld-btn-sm { padding: 4px 8px; font-size: 12px; width: auto; }

        /* 模态框 */
        #ld-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.75); z-index: 10000;
            display: none; justify-content: center; align-items: center;
            backdrop-filter: blur(3px);
        }
        #ld-modal {
            background: #1f2937; width: 500px; max-width: 90%;
            border-radius: 12px; border: 1px solid #4b5563;
            display: flex; flex-direction: column; max-height: 80vh; overflow: hidden;
        }
        .ld-modal-header { padding: 15px; border-bottom: 1px solid #374151; display: flex; justify-content: space-between; align-items: center; background: #1f2937; }
        .ld-modal-body { flex: 1; overflow-y: auto; padding: 0; position: relative; }

        /* 列表项 */
        .ld-list-item {
            padding: 12px 15px; border-bottom: 1px solid #374151;
            display: flex; justify-content: space-between; align-items: center;
        }
        .ld-list-item:hover { background: #2d3748; }
        .ld-site-info { display: flex; flex-direction: column; gap: 2px; flex: 1; margin-right: 10px; overflow: hidden; }
        .ld-site-url { font-size: 14px; color: #e5e7eb; word-break: break-all; }
        .ld-site-date { font-size: 11px; color: #9ca3af; }
        .ld-actions { display: flex; gap: 5px; }

        /* 编辑页面 */
        .ld-editor-view { padding: 20px; }
        .ld-help-text { font-size: 12px; color: #9ca3af; margin-bottom: 15px; line-height: 1.5; background: #111827; padding: 10px; border-radius: 6px; border: 1px dashed #4b5563; }
        .ld-help-text code { background: #374151; padding: 2px 4px; border-radius: 3px; color: #60a5fa; font-family: monospace; }
        .ld-editor-actions { display: flex; gap: 10px; margin-top: 15px; }

        .ld-action-btn { background: none; border: none; cursor: pointer; opacity: 0.7; font-size: 16px; padding: 4px; color: #e5e7eb; }
        .ld-action-btn:hover { opacity: 1; transform: scale(1.1); }
        .ld-action-btn.edit:hover { color: #60a5fa; }
        .ld-action-btn.del:hover { color: #f87171; }

        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }
    `;
    GM_addStyle(styles);

    // ================= 核心逻辑工具 =================

    const Store = {
        getMode: () => GM_getValue(CONFIG.STORAGE_MODE, 'manual'),
        setMode: (val) => GM_setValue(CONFIG.STORAGE_MODE, val),

        getList: () => GM_getValue(CONFIG.STORAGE_LIST, []),
        setList: (list) => GM_setValue(CONFIG.STORAGE_LIST, list),

        getAutoAdd: () => GM_getValue(CONFIG.STORAGE_AUTO_ADD, false),
        setAutoAdd: (val) => GM_setValue(CONFIG.STORAGE_AUTO_ADD, val),

        getTrustOfficial: () => GM_getValue(CONFIG.STORAGE_TRUST_OFFICIAL, false),
        setTrustOfficial: (val) => GM_setValue(CONFIG.STORAGE_TRUST_OFFICIAL, val)
    };

    const Utils = {
        normalizeUrl: (url) => {
            if (!url) return '';
            try { return url.trim().replace(/\/+$/, ''); } catch (e) { return url; }
        },
        getTargetSite: () => {
            try {
                const strongTags = Array.from(document.querySelectorAll('strong'));
                const siteLabel = strongTags.find(el => el.textContent.includes('网站'));
                if (siteLabel && siteLabel.parentElement) {
                    const link = siteLabel.parentElement.querySelector('a');
                    if (link) return link.href;
                }
                const link = document.querySelector(CONFIG.SELECTORS.SITE_LINK);
                return link ? link.href : null;
            } catch (e) { return null; }
        },
        getApproveBtn: () => {
            let btn = document.querySelector(CONFIG.SELECTORS.APPROVE_BTN);
            if (!btn) {
                const result = document.evaluate(CONFIG.SELECTORS.APPROVE_TEXT_XPATH, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                btn = result.singleNodeValue;
            }
            return btn;
        },
        formatDate: (timestamp) => {
            if (!timestamp) return '手动添加';
            return new Date(timestamp).toLocaleString('zh-CN', { hour12: false });
        },
        createSafeElement: (tag, className, text) => {
            const el = document.createElement(tag);
            if (className) el.className = className;
            if (text) el.textContent = text;
            return el;
        },
        isLinuxDoSubdomain: (urlStr) => {
            try {
                const hostname = new URL(urlStr).hostname;
                return hostname === 'linux.do' || hostname.endsWith('.linux.do');
            } catch (e) { return false; }
        },
        isWildcardMatch: (pattern, targetUrl) => {
            if (!pattern || !targetUrl) return false;
            const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
            const regex = new RegExp(`^${escaped}$`, 'i');
            return regex.test(targetUrl);
        }
    };

    // ================= 业务逻辑 =================

    const Logic = {
        addSite: (url) => {
            if (!url) return;
            const normUrl = Utils.normalizeUrl(url);
            const list = Store.getList();
            if (list.some(item => Utils.normalizeUrl(item.url) === normUrl)) return;

            list.push({ url: normUrl, addedAt: Date.now() });
            Store.setList(list);
            console.log('[LD Auth] Added:', normUrl);
            UI.updateStatus();
        },
        updateSite: (oldUrl, newUrl) => {
            const list = Store.getList();
            const normOld = Utils.normalizeUrl(oldUrl);
            const normNew = Utils.normalizeUrl(newUrl);

            const index = list.findIndex(item => Utils.normalizeUrl(item.url) === normOld);
            if (index !== -1) {
                list[index].url = normNew;
                list[index].addedAt = Date.now();
            } else {
                list.push({ url: normNew, addedAt: Date.now() });
            }
            Store.setList(list);
            UI.updateStatus();
        },
        removeSite: (url) => {
            const normUrl = Utils.normalizeUrl(url);
            const list = Store.getList().filter(item => Utils.normalizeUrl(item.url) !== normUrl);
            Store.setList(list);
            UI.updateStatus();
        },
        checkTrust: (targetUrl) => {
            if (!targetUrl) return false;
            const normTarget = Utils.normalizeUrl(targetUrl);

            if (Store.getTrustOfficial() && Utils.isLinuxDoSubdomain(normTarget)) {
                return true;
            }

            const list = Store.getList();
            return list.some(item => Utils.isWildcardMatch(item.url, normTarget));
        },
        performClick: (btn, reason) => {
            if (!btn) return;
            const statusEl = document.getElementById('ld-status-text');
            if (statusEl) {
                statusEl.innerHTML = `正在自动授权...<br><span style="opacity:0.7;font-size:12px">(${reason})</span>`;
            }
            setTimeout(() => { btn.click(); }, 800);
        }
    };

    // ================= UI 渲染 =================

    const UI = {
        state: {
            currentView: 'list',
            editingItem: null
        },

        init: () => {
            const panel = document.createElement('div');
            panel.id = 'ld-auth-panel';
            panel.innerHTML = `
                <div class="ld-header">
                    <span class="ld-title">🛡️ Linux Do Auth Helper</span>
                </div>

                <select id="ld-mode-select" class="ld-select">
                    <option value="manual">🔵 手动模式</option>
                    <option value="safe">🟢 安全模式</option>
                    <option value="dangerous">🔴 危险模式</option>
                </select>

                <div id="ld-trust-official-container" class="ld-checkbox-row">
                    <input type="checkbox" id="ld-trust-official-check">
                    <label for="ld-trust-official-check" title="在安全模式下，自动允许 *.linux.do 的请求">自动信任 *.linux.do</label>
                </div>

                <div id="ld-auto-add-container" class="ld-checkbox-row" title="手动点击允许按钮时，自动将该站点加入白名单">
                    <input type="checkbox" id="ld-auto-add-check">
                    <label for="ld-auto-add-check">手动授权时自动信任</label>
                </div>

                <div id="ld-status-text" class="ld-status">初始化中...</div>

                <button id="ld-manage-btn" class="ld-btn">📋 管理信任列表</button>
            `;
            document.body.appendChild(panel);

            UI.bindEvents();
            UI.updateStatus();
            UI.buildModal();
            UI.toggleControlsVisibility(Store.getMode());
        },

        toggleControlsVisibility: (mode) => {
            const autoAddContainer = document.getElementById('ld-auto-add-container');
            const officialTrustContainer = document.getElementById('ld-trust-official-container');

            // 手动模式下：显示“自动记录”，隐藏“官方信任”
            if (mode === 'manual') {
                autoAddContainer?.classList.remove('hidden');
                officialTrustContainer?.classList.add('hidden');
            }
            // 安全模式下：显示“官方信任”，隐藏“自动记录”
            else if (mode === 'safe') {
                autoAddContainer?.classList.add('hidden');
                officialTrustContainer?.classList.remove('hidden');
            }
            // 危险模式下：全部隐藏
            else {
                autoAddContainer?.classList.add('hidden');
                officialTrustContainer?.classList.add('hidden');
            }
        },

        bindEvents: () => {
            const modeSelect = document.getElementById('ld-mode-select');
            modeSelect.value = Store.getMode();
            modeSelect.addEventListener('change', (e) => {
                const val = e.target.value;
                if (val === 'dangerous') {
                    if (!confirm('⚠️ 高危警告：\n危险模式将自动同意【所有】网站的授权请求。\n\n请确认风险！')) {
                        modeSelect.value = Store.getMode();
                        return;
                    }
                }
                Store.setMode(val);
                UI.toggleControlsVisibility(val);
                UI.updateStatus();
                Main.runAutoLogic();
            });

            const officialCheck = document.getElementById('ld-trust-official-check');
            officialCheck.checked = Store.getTrustOfficial();
            officialCheck.addEventListener('change', (e) => {
                Store.setTrustOfficial(e.target.checked);
                UI.updateStatus();
                Main.runAutoLogic();
            });

            const autoAddCheck = document.getElementById('ld-auto-add-check');
            autoAddCheck.checked = Store.getAutoAdd();
            autoAddCheck.addEventListener('change', (e) => {
                Store.setAutoAdd(e.target.checked);
            });

            document.getElementById('ld-manage-btn').addEventListener('click', () => {
                UI.switchView('list');
                document.getElementById('ld-overlay').style.display = 'flex';
            });
        },

        updateStatus: () => {
            const mode = Store.getMode();
            const targetUrl = Utils.getTargetSite();
            const isLinuxDo = Utils.isLinuxDoSubdomain(targetUrl);
            const trustOfficial = Store.getTrustOfficial();
            const isTrusted = Logic.checkTrust(targetUrl);
            const statusEl = document.getElementById('ld-status-text');

            statusEl.className = 'ld-status';

            if (mode === 'manual') {
                statusEl.textContent = '手动模式：请手动点击允许。';
            } else if (mode === 'dangerous') {
                statusEl.classList.add('danger');
                statusEl.innerHTML = '危险模式运行中<br>自动同意所有请求！';
            } else if (mode === 'safe') {
                if (isTrusted) {
                    statusEl.classList.add('safe');
                    if (trustOfficial && isLinuxDo) {
                        statusEl.innerHTML = '✅ 官方域名(自动匹配)<br>准备自动授权...';
                    } else {
                        statusEl.innerHTML = '✅ 已匹配信任规则<br>准备自动授权...';
                    }
                } else {
                    statusEl.classList.add('warn');
                    statusEl.innerHTML = '⚠️ 未信任的新站点<br>等待手动确认';
                }
            }
        },

        buildModal: () => {
            const overlay = document.createElement('div');
            overlay.id = 'ld-overlay';
            overlay.innerHTML = `
                <div id="ld-modal">
                    <div class="ld-modal-header">
                        <span class="ld-title" id="ld-modal-title">信任站点管理</span>
                        <div style="display:flex; gap:10px; align-items:center;">
                             <button id="ld-add-btn" class="ld-btn ld-btn-sm primary" title="新建规则">✚ 新建</button>
                             <button id="ld-modal-close" class="ld-action-btn" style="font-size:20px">×</button>
                        </div>
                    </div>

                    <div id="ld-view-list" style="display:flex; flex-direction:column; flex:1; overflow:hidden;">
                        <div style="padding:10px; border-bottom:1px solid #374151;">
                            <input type="text" id="ld-search" class="ld-input" placeholder="🔍 搜索规则..." style="margin:0;">
                        </div>
                        <div id="ld-list-body" class="ld-modal-body"></div>
                        <div style="padding:15px; border-top:1px solid #374151; display:flex; justify-content:flex-end;">
                            <button id="ld-clear-all" class="ld-btn danger" style="width:auto; padding:6px 15px;">🗑️ 清空全部</button>
                        </div>
                    </div>

                    <div id="ld-view-editor" class="ld-modal-body" style="display:none;"></div>
                </div>
            `;
            document.body.appendChild(overlay);

            const close = () => { overlay.style.display = 'none'; };
            document.getElementById('ld-modal-close').addEventListener('click', close);
            overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

            document.getElementById('ld-search').addEventListener('input', (e) => UI.renderList(e.target.value));
            document.getElementById('ld-clear-all').addEventListener('click', () => {
                if (confirm('确定删除所有信任记录吗？')) {
                    Store.setList([]);
                    UI.renderList();
                    UI.updateStatus();
                }
            });
            document.getElementById('ld-add-btn').addEventListener('click', () => {
                UI.switchView('editor', null);
            });
        },

        switchView: (view, item = null) => {
            UI.state.currentView = view;
            UI.state.editingItem = item;

            const listView = document.getElementById('ld-view-list');
            const editorView = document.getElementById('ld-view-editor');
            const addBtn = document.getElementById('ld-add-btn');
            const title = document.getElementById('ld-modal-title');

            if (view === 'list') {
                listView.style.display = 'flex';
                editorView.style.display = 'none';
                addBtn.style.display = 'block';
                title.textContent = '信任站点管理';
                UI.renderList(document.getElementById('ld-search').value);
            } else {
                listView.style.display = 'none';
                editorView.style.display = 'block';
                addBtn.style.display = 'none';
                title.textContent = item ? '编辑规则' : '新建规则';
                UI.renderEditor(item);
            }
        },

        renderList: (filterText = '') => {
            const container = document.getElementById('ld-list-body');
            container.innerHTML = '';

            let list = Store.getList();
            if (filterText) {
                list = list.filter(item => item.url.toLowerCase().includes(filterText.toLowerCase()));
            }

            if (list.length === 0) {
                container.innerHTML = '<div style="padding:20px; text-align:center; color:#6b7280;">无数据</div>';
                return;
            }

            list.sort((a, b) => b.addedAt - a.addedAt).forEach(item => {
                const row = document.createElement('div');
                row.className = 'ld-list-item';

                const info = document.createElement('div');
                info.className = 'ld-site-info';
                info.appendChild(Utils.createSafeElement('div', 'ld-site-url', item.url));
                info.appendChild(Utils.createSafeElement('div', 'ld-site-date', Utils.formatDate(item.addedAt)));

                const actions = document.createElement('div');
                actions.className = 'ld-actions';

                const editBtn = document.createElement('button');
                editBtn.className = 'ld-action-btn edit';
                editBtn.innerHTML = '✎';
                editBtn.title = '编辑';
                editBtn.onclick = () => UI.switchView('editor', item);

                const delBtn = document.createElement('button');
                delBtn.className = 'ld-action-btn del';
                delBtn.innerHTML = '🗑️';
                delBtn.title = '删除';
                delBtn.onclick = () => {
                    if (confirm(`不再信任 ${item.url}?`)) {
                        Logic.removeSite(item.url);
                        UI.renderList(document.getElementById('ld-search').value);
                    }
                };

                actions.appendChild(editBtn);
                actions.appendChild(delBtn);

                row.appendChild(info);
                row.appendChild(actions);
                container.appendChild(row);
            });
        },

        renderEditor: (item) => {
            const container = document.getElementById('ld-view-editor');
            const initialValue = item ? item.url : '';

            container.innerHTML = `
                <div class="ld-editor-view">
                    <label style="display:block; margin-bottom:5px; color:#e5e7eb;">域名或 URL 规则：</label>
                    <input type="text" id="ld-edit-input" class="ld-input" value="${initialValue}" placeholder="例如: https://example.com" autofocus>

                    <div class="ld-help-text">
                        <strong>💡 规则说明：</strong><br>
                        1. <strong>精准匹配：</strong> 输入完整 URL，如 <code>https://oa.example.com</code><br>
                        2. <strong>通配符匹配：</strong> 使用 <code>*</code> 代表任意字符。<br>
                           - <code>*.example.com</code> 匹配所有二级域名。<br>
                           - <code>*linux.do</code> 匹配所有以 linux.do 结尾的域名。<br>
                        3. <strong>注意：</strong> 匹配时不区分大小写。
                    </div>

                    <div class="ld-editor-actions">
                        <button id="ld-save-btn" class="ld-btn primary">💾 保存</button>
                        <button id="ld-cancel-btn" class="ld-btn">取消</button>
                    </div>
                </div>
            `;

            const input = document.getElementById('ld-edit-input');
            input.focus();

            document.getElementById('ld-save-btn').addEventListener('click', () => {
                const val = input.value.trim();
                if (!val) {
                    alert('内容不能为空');
                    return;
                }

                if (item) {
                    Logic.updateSite(item.url, val);
                } else {
                    Logic.addSite(val);
                }
                UI.switchView('list');
            });

            document.getElementById('ld-cancel-btn').addEventListener('click', () => {
                UI.switchView('list');
            });

            input.addEventListener('keyup', (e) => {
                 if (e.key === 'Enter') document.getElementById('ld-save-btn').click();
            });
        }
    };

    // ================= 主程序 =================

    const Main = {
        init: () => {
            try {
                UI.init();
                Main.hookManualClick();
                Main.runAutoLogic();
            } catch (e) {
                console.error('[LD Auth] Init failed:', e);
            }
        },

        hookManualClick: () => {
            const btn = Utils.getApproveBtn();
            if (!btn) return;

            btn.addEventListener('click', (e) => {
                if (!e.isTrusted) return;

                if (Store.getAutoAdd()) {
                    const url = Utils.getTargetSite();
                    if (url) {
                        Logic.addSite(url);
                        setTimeout(UI.updateStatus, 100);
                    }
                }
            });
        },

        runAutoLogic: () => {
            const btn = Utils.getApproveBtn();
            const targetUrl = Utils.getTargetSite();
            const mode = Store.getMode();

            if (!btn) return;

            if (mode === 'dangerous') {
                Logic.performClick(btn, '危险模式');
            } else if (mode === 'safe') {
                if (Logic.checkTrust(targetUrl)) {
                    const isOfficial = Store.getTrustOfficial() && Utils.isLinuxDoSubdomain(targetUrl);
                    Logic.performClick(btn, isOfficial ? '安全模式-官方域名' : '安全模式-规则匹配');
                }
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', Main.init);
    } else {
        Main.init();
    }

})();