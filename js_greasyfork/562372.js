// ==UserScript==
// @name         仿M浏览器元素审查
// @namespace    https://viayoo.com/81gzxv
// @version      2.8
// @description  利用AI模仿并生成M浏览器的元素审查，在脚本菜单开启元素审查，专注AD规则生成，支持规则编辑。
// @author       Via && Gemini
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license       MIT
// @icon        data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/562372/%E4%BB%BFM%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%83%E7%B4%A0%E5%AE%A1%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/562372/%E4%BB%BFM%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%83%E7%B4%A0%E5%AE%A1%E6%9F%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isDebugMode = false;
    let isPicking = false;
    let isCollapsed = false;
    let currentTarget = null;
    let activePreviewStyle = null;

    const api = {
        addStyle: (css) => {
            if (typeof GM_addStyle !== 'undefined') {
                GM_addStyle(css);
            } else {
                const style = document.createElement('style');
                style.textContent = css;
                document.head.appendChild(style);
            }
        },
        setClipboard: (text) => {
            if (typeof GM_setClipboard !== 'undefined') {
                GM_setClipboard(text);
                alert('已复制');
            } else {
                navigator.clipboard.writeText(text).then(() => alert('已复制')).catch(() => {
                    const textarea = document.createElement('textarea');
                    textarea.value = text;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    alert('已复制');
                });
            }
        },
        registerMenu: (name, fn) => {
            if (typeof GM_registerMenuCommand !== 'undefined') {
                GM_registerMenuCommand(name, fn);
            }
        },
        getValue: (key, def) => {
            if (typeof GM_getValue !== 'undefined') {
                return GM_getValue(key, def);
            }
            const val = localStorage.getItem(key);
            return val === null ? def : JSON.parse(val);
        },
        setValue: (key, val) => {
            if (typeof GM_setValue !== 'undefined') {
                GM_setValue(key, val);
            } else {
                localStorage.setItem(key, JSON.stringify(val));
            }
        }
    };

    api.addStyle(`
        :root {
            --mb-bg: #ffffff; --mb-text: #333; --mb-header-bg: #f1f1f1; --mb-border: #ddd; --mb-item-bg: #fdfdfd;
            --mb-code-key: #881280; --mb-code-attr: #994500; --mb-code-val: #1a1aa6;
            --mb-glass-bg: rgba(255, 255, 255, 0.7); --mb-glass-border: rgba(255, 255, 255, 0.5);
        }
        @media (prefers-color-scheme: dark) {
            :root {
                --mb-bg: #1e1e1e; --mb-text: #ccc; --mb-header-bg: #2d2d2d; --mb-border: #444; --mb-item-bg: #252525;
                --mb-code-key: #d197d9; --mb-code-attr: #deb887; --mb-code-val: #7fb4ca;
                --mb-glass-bg: rgba(45, 45, 45, 0.7); --mb-glass-border: rgba(255, 255, 255, 0.1);
            }
        }
        #mb-debug-panel {
            position: fixed; left: 0; bottom: 0; width: 100%; height: 50%;
            background: var(--mb-bg) !important; z-index: 2147483647 !important; 
            display: none; flex-direction: column; box-shadow: 0 -2px 15px rgba(0,0,0,0.3);
            font-family: sans-serif !important; border-top: 1px solid var(--mb-border);
            transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1); color: var(--mb-text);
        }
        #mb-debug-panel * { text-align: left; }
        #mb-main-stage { display: flex; flex-wrap: nowrap; width: auto; height: calc(100% - 40px); transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .mb-page { width: 100%; flex: 0 0 100%; height: 100%; display: flex; flex-direction: column; overflow: hidden; }

        #mb-debug-header { display: flex; align-items: center; background: var(--mb-header-bg); height: 40px; border-bottom: 1px solid var(--mb-border); flex-shrink: 0; padding: 0; }
        .mb-header-left, .mb-header-right { flex-shrink: 0; display: flex; align-items: center; padding: 0 12px; }
        .mb-header-middle { flex: 1; display: flex; align-items: center; overflow-x: auto; white-space: nowrap; }
        .mb-header-middle::-webkit-scrollbar { display: none; }
        
        .mb-tool-btn { margin-right: 18px; cursor: pointer; color: var(--mb-text); font-size: 14px; user-select: none; flex-shrink: 0; }
        .mb-tool-btn.active { color: #ff4757 !important; font-weight: bold; }
        #mb-btn-close { margin-right: 0; font-size: 18px; }

        #mb-debug-content, #mb-ad-content, #mb-data-content, #mb-icon-content { flex: 1; overflow: auto; padding: 10px; background: var(--mb-bg) !important; }
        
        .ad-rule-item, .data-group-box, .icon-config-card { background: var(--mb-item-bg); border: 1px solid var(--mb-border); border-radius: 6px; padding: 12px; margin-bottom: 15px; }
        .ad-rule-display, .data-row-display { display: block; word-break: break-all; font-weight: bold; margin-bottom: 10px; font-size: 14px; line-height: 1.4; font-family: monospace; }
        .hl-domain { color: #ff8c00; } .hl-sep { color: #007bff; } .hl-selector { color: #808080; } .hl-url { color: #ff0000; }

        .ad-action-bar, .data-action-bar { display: flex; flex-wrap: wrap; gap: 8px; }
        .ad-mini-btn { padding: 5px 12px; font-size: 12px; border: 1px solid var(--mb-border); background: var(--mb-bg); cursor: pointer; border-radius: 4px; color: var(--mb-text); }
        
        .icon-config-row { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; }
        .icon-input { width: 80px; padding: 4px; border: 1px solid var(--mb-border); background: var(--mb-bg); color: var(--mb-text); border-radius: 4px; }
        .icon-area { width: 100%; height: 80px; margin-top: 8px; font-family: monospace; font-size: 12px; padding: 6px; border: 1px solid var(--mb-border); background: var(--mb-bg); color: var(--mb-text); resize: none; }

        .data-item-card { border-top: 1px solid var(--mb-border); padding: 8px 0; margin-top: 8px; }
        .data-key-label { color: var(--mb-code-attr); font-weight: bold; }

        .mb-inspect-hl { outline: 2px dashed #ff4757 !important; outline-offset: 2px !important; background: rgba(255, 71, 87, 0.1) !important; }
        .node-wrapper { margin-left: 14px; border-left: 1px solid var(--mb-border); font-family: monospace; }
        .node-row { padding: 2px 4px; cursor: pointer; white-space: pre-wrap; word-break: break-all; display: flex; color: var(--mb-text); }
        .node-row.selected { background: rgba(30, 144, 255, 0.2); outline: 1px solid #1e90ff; }
        .toggle-btn { width: 18px; flex-shrink: 0; text-align: center; font-size: 10px; color: #999; cursor: pointer; }

        #mb-debug-trigger { position: fixed; right: 16px; width: 32px; height: 32px; background: var(--mb-glass-bg); backdrop-filter: blur(15px) saturate(160%); -webkit-backdrop-filter: blur(15px) saturate(160%); border-radius: 14px; border: 1.5px solid var(--glass-border); box-shadow: 0 6px 16px rgba(0,0,0,0.12), inset 0 0 2px rgba(255,255,255,0.8); cursor: pointer; z-index: 2147483646; display: none; align-items: center; justify-content: center; transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); user-select: none; -webkit-tap-highlight-color: transparent; }
        #mb-debug-trigger:active { transform: scale(0.92); }
        #mb-debug-trigger svg { width: 22px; height: 22px; filter: drop-shadow(0 1px 1.5px rgba(0,0,0,0.15)); }

        #mb-js-content {height: 100%;display: flex;flex-direction: column; padding: 10px; box-sizing: border-box;background: var(--mb-bg) !important;}
        #mb-js-log {flex: 1; margin-top: 10px;overflow-y: auto !important;font-family: monospace;font-size: 11px;border-top: 1px solid var(--mb-border);padding-top: 5px;-webkit-overflow-scrolling: touch;}
        #mb-js-input {flex-shrink: 0; height: 100px;}       
        .log-item { border-bottom: 0.5px solid var(--mb-border); padding: 4px 0; white-space: pre-wrap; font-size: 11px;}
        .log-warn { color: #f1c40f; }
        .log-error { color: #ff4757; background: rgba(255, 71, 87, 0.05); }
        .log-result { color: #2ecc71; }
 
        body.mb-picking-mode { cursor: crosshair !important; }

        @media (min-width: 768px) {
            #mb-debug-panel { height: 45% !important; }
            #mb-js-content { flex-direction: row; gap: 12px; }
            #mb-js-input { flex: 1; height: auto !important; }
            #mb-js-log { flex: 1; margin-top: 0; border-top: none; border-left: 1px solid var(--mb-border); padding-left: 10px; }
            #mb-ad-content, #mb-data-content, #mb-icon-content { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; align-content: start; }
            #mb-debug-content { max-width: 900px; margin: 0 auto; }
            .ad-rule-item, .data-group-box, .icon-config-card { margin-bottom: 0; }
        }
    `);


    const panel = document.createElement('div');
    panel.id = 'mb-debug-panel';
    panel.innerHTML = `
        <div id="mb-debug-header">
            <div class="mb-header-left">
                <span class="mb-tool-btn" id="mb-btn-pick">🎯选取</span>
            </div>
            <div class="mb-header-middle">
                <span class="mb-tool-btn" id="mb-btn-fold">▼收起</span>
                <span class="mb-tool-btn" id="mb-btn-back" style="display:none;">⬅ 返回</span>
                <span class="mb-tool-btn" id="mb-btn-parent">父</span>
                <span class="mb-tool-btn" id="mb-btn-restore">恢复</span>
                <span class="mb-tool-btn" id="mb-btn-to-ad" style="color:#d11; font-weight:bold;">AD规则</span>
                <span class="mb-tool-btn" id="mb-btn-to-js" style="color:#f1c40f; font-weight:bold;">JS代码</span>
                <span class="mb-tool-btn" id="mb-btn-to-data" style="color:#009432; font-weight:bold;">🛡️数据</span>
                <span class="mb-tool-btn" id="mb-btn-to-icon" style="color:#007aff; font-weight:bold;">🧩图标</span>
                <span class="mb-tool-btn" id="mb-btn-copy-html">H(复制)</span>
            </div>
            <div class="mb-header-right">
                <span class="mb-tool-btn" id="mb-btn-close">✕</span>
            </div>
        </div>

        <div id="mb-main-stage">
            <div class="mb-page" id="page-dom">
                <div id="mb-debug-content"></div>
            </div>

            <div class="mb-page" id="page-js">
                <div id="mb-js-content">
                    <textarea id="mb-js-input" placeholder="输入 JS 代码..."></textarea>
                    <div class="ad-action-bar" style="margin-top:8px;">
                        <button class="ad-mini-btn" id="btn-js-run" style="background:#f1c40f; color:#000; border:none; font-weight:bold;">执行</button>
                        <button class="ad-mini-btn" id="btn-js-clear">清空日志</button>
                        <button class="ad-mini-btn" id="btn-js-copy-all">复制日志</button>
                    </div>
                    <div id="mb-js-log"></div>
                </div>
            </div>

            <div class="mb-page" id="page-ad">
                <div id="mb-ad-content"></div>
            </div>

            <div class="mb-page" id="page-data">
                <div id="mb-data-content"></div>
            </div>

            <div class="mb-page" id="page-icon">
                <div id="mb-icon-content"></div>
            </div>
        </div>
    `;

    document.body.appendChild(panel);

    const domContent = document.getElementById('mb-debug-content');
    const adContent = document.getElementById('mb-ad-content');
    const dataContent = document.getElementById('mb-data-content');
    const stage = document.getElementById('mb-main-stage');
    const btnPick = document.getElementById('mb-btn-pick');
    const btnFold = document.getElementById('mb-btn-fold');
    const jsLog = document.getElementById('mb-js-log');
    const jsInput = document.getElementById('mb-js-input');

    function addLog(msg, type = '') {
      const div = document.createElement('div'); div.className = `log-item ${type}`;
       if (typeof msg === 'object' && msg !== null) { try { msg = JSON.stringify(msg); } catch (e) { msg = Object.prototype.toString.call(msg); }} div.innerText = `[${new Date().toLocaleTimeString(undefined, {hour12:false})}] ${msg}`; jsLog.prepend(div);}
       const originalConsole = {log: console.log,error: console.error,warn: console.warn,info: console.info};
       const hookConsole = (level, type) => { console[level] = (...args) => { originalConsole[level].apply(console, args); addLog(args.length > 1 ? args : args[0], type);};};
       hookConsole('log', ''); hookConsole('error', 'log-error'); hookConsole('warn', 'log-error'); hookConsole('info', 'log-result');
       window.addEventListener('error', (e) => { addLog(`${e.message} at ${e.filename}:${e.lineno}`, 'log-error');});
       window.addEventListener('unhandledrejection', (e) => { addLog(`Promise Error: ${e.reason}`, 'log-error');
    });

    function switchToPage(index) {
        stage.style.transform = `translateX(-${index * 100}%)`;
        const btnBack = document.getElementById('mb-btn-back');
        if (btnBack) btnBack.style.display = index === 0 ? 'none' : 'inline';
    }

    function updateFoldState() {
        if (isCollapsed) {
            panel.style.height = '40px';
            btnFold.innerText = '▲展开';
        } else {
            const adaptiveHeight = window.innerHeight < 600 ? '40%' : '50%';
            panel.style.height = adaptiveHeight;
            document.body.style.paddingBottom = adaptiveHeight.replace('%', 'vh');
            btnFold.innerText = '▼收起';
        }
    }

    function startPicking() {
        isPicking = true;
        btnPick.classList.add('active');
        document.body.classList.add('mb-picking-mode');
    }

    function stopPicking() {
        isPicking = false;
        btnPick.classList.remove('active');
        document.body.classList.remove('mb-picking-mode');
    }

    function togglePanel(show) {
        isDebugMode = show;
        panel.style.display = show ? 'flex' : 'none';
        if (show) {
            document.body.style.paddingBottom = '50vh';
            isCollapsed = false;
            updateFoldState();
            startPicking();
        } else {
            document.body.style.removeProperty('padding-bottom');
            stopPicking();
            if (currentTarget) currentTarget.classList.remove('mb-inspect-hl');
        }
    }

    function highlightAdRule(rule) {
        const match = rule.match(/^(.*?)(###?)(.*)$/);
        if (!match) return `<span>${rule}</span>`;
        let rest = match[3].replace(/("(.*?)")/g, '<span class="hl-url">"$2"</span>');
        return `<span class="hl-domain">${match[1]}</span><span class="hl-sep">${match[2]}</span><span class="hl-selector">${rest}</span>`;
    }

    function generateSmartRules(el) {
        const domain = window.location.hostname;
        const tagName = el.tagName.toLowerCase();
        let rules = [];
        const isInvalid = (str) => /^[:\d]/.test(str) || str.includes(':');
        if (el.id && !isInvalid(el.id)) {
            rules.push(`${domain}###${el.id}`);
        }
        const classList = Array.from(el.classList).filter(c =>
            !/\d{5,}/.test(c) && c.length < 30 && c !== 'mb-inspect-hl' && !isInvalid(c)
        );
        if (classList.length > 0) {
            classList.forEach(c => rules.push(`${domain}##.${c}`));
            if (classList.length >= 2) rules.push(`${domain}##.${classList.slice(0, 2).join('.')}`);
            if (classList.length >= 3) rules.push(`${domain}##.${classList.join('.')}`);
        }
        let attrRules = [];
        let sizeBundle = "";
        for (let attr of el.attributes) {
            if (['id', 'class', 'style'].includes(attr.name)) continue;
            let val = attr.value;
            if (!val) continue;
            if (['width', 'height'].includes(attr.name)) {
                sizeBundle += `[${attr.name}="${val}"]`;
                continue;
            }
            if (val.startsWith('data:')) {
                const b64 = val.match(/^data:[^;]+;base64,/);
                if (b64) {
                    attrRules.push(`${tagName}[${attr.name}^="${b64[0]}"]`);
                    continue;
                }
            }
            if (/^(https?:|)\/\//.test(val)) {
                const urlMatch = val.match(/^((?:https?:|)\/\/[^\/]+\/)/);
                if (urlMatch) {
                    attrRules.push(`${tagName}[${attr.name}^="${urlMatch[1]}"]`);
                } else {
                    attrRules.push(`${tagName}[${attr.name}="${val}"]`);
                }
            } else {
                if (val.length > 180) {
                    attrRules.push(`${tagName}[${attr.name}^="${val.substring(0, 30)}"]`);
                } else {
                    attrRules.push(`${tagName}[${attr.name}="${val}"]`);
                }
            }
        }
        if (sizeBundle) {
            rules.push(`${domain}##${tagName}${sizeBundle}`);
        }
        attrRules.forEach(r => rules.push(`${domain}##${r}`));
        rules = [...new Set(rules)];
        rules.sort((a, b) => {
            const getWeight = (s) => {
                if (/[Aa][Dd][Ss]|[Bb]anner/i.test(s)) return 1;
                if (s.includes('[src') || s.includes('[href') || s.includes('[data-src') || s.includes('[srcid')) return 2;
                if (s.includes('[width') || s.includes('[height')) return 3;
                if (s.includes('###') || (s.includes('##.') && !s.includes('['))) return 4;
                return 5;
            };
            const weightA = getWeight(a);
            const weightB = getWeight(b);
            if (weightA !== weightB) return weightA - weightB;
            return a.length - b.length;
        });
        const genericTags = ['div', 'span', 'p', 'li', 'ul', 'ins', 'section', 'article'];
        return rules.filter(r => {
            const selector = r.split(/###?/)[1];
            return !genericTags.includes(selector);
        });
    }

    function renderAdPage() {
        adContent.innerHTML = '';
        if (!currentTarget) return;
        const rules = generateSmartRules(currentTarget);
        if (rules.length === 0) {
            adContent.innerHTML = '<div style="color:#999;padding:20px;">该元素特征不足，未生成自动规则。</div>';
        }
        rules.forEach(ruleText => {
            let currentRule = ruleText;
            const originalRule = ruleText;
            const item = document.createElement('div');
            item.className = 'ad-rule-item';
            const updateUI = (isEditing = false) => {
                item.innerHTML = `
                    <div class="ad-rule-display" ${isEditing ? 'contenteditable="true" style="border:1px solid #007bff; padding:5px; outline:none; background:var(--mb-bg);"' : ''}>${isEditing ? currentRule : highlightAdRule(currentRule)}</div>
                    <div class="ad-action-bar">
                        ${isEditing ? `
                            <button class="ad-mini-btn btn-save" style="background:#28a745; color:#fff; border:none;">保存</button>
                            <button class="ad-mini-btn btn-undo">撤销</button>
                        ` : `
                            <button class="ad-mini-btn btn-copy">复制</button>
                            <button class="ad-mini-btn btn-pre">预览执行</button>
                            <button class="ad-mini-btn btn-res">恢复单条</button>
                            <button class="ad-mini-btn btn-edit">编辑</button>
                        `}
                    </div>
                `;
                if (isEditing) {
                    const display = item.querySelector('.ad-rule-display');
                    setTimeout(() => display.focus(), 10);
                    item.querySelector('.btn-save').onclick = () => { currentRule = display.innerText.trim(); updateUI(false); };
                    item.querySelector('.btn-undo').onclick = () => { currentRule = originalRule; updateUI(false); };
                } else {
                    item.querySelector('.btn-copy').onclick = () => api.setClipboard(currentRule);
                    item.querySelector('.btn-edit').onclick = () => updateUI(true);
                    item.querySelector('.btn-pre').onclick = () => {
                        if (activePreviewStyle) activePreviewStyle.remove();
                        activePreviewStyle = document.createElement('style');
                        try {
                            const isIdRule = currentRule.includes('###');
                            let selector = currentRule.split(/###?/)[1];
                            if (isIdRule && !selector.startsWith('#')) {
                                selector = '#' + selector;
                            }
                            activePreviewStyle.innerHTML = `${selector} { display: none !important; }`;
                            document.head.appendChild(activePreviewStyle);
                        } catch (e) { alert("语法错误"); }
                    };
                    item.querySelector('.btn-res').onclick = () => { if (activePreviewStyle) activePreviewStyle.remove(); };
                }
            };
            updateUI();
            adContent.appendChild(item);
        });
    }


    function renderDataPage() {
        dataContent.innerHTML = '';
        const getPaths = () => {
            const p = window.location.pathname;
            const s = p.split('/').filter(Boolean);
            const r = ['/', p];
            let c = '';
            s.forEach(seg => { c += '/' + seg; r.push(c); });
            return [...new Set(r)];
        };
        const getDoms = () => {
            const d = window.location.hostname;
            const r = [d, '.' + d];
            const p = d.split('.');
            if (p.length > 2) {
                const root = p.slice(-2).join('.');
                r.push(root, '.' + root, 'www.' + root, '.www.' + root);
            }
            return [...new Set(r)];
        };
        const configs = [
            {
                label: 'Cookies', emoji: '🍪',
                get: () => document.cookie.split('; ').reduce((acc, c) => { const [k, v] = c.split('='); if (k) acc[k] = decodeURIComponent(v); return acc; }, {}),
                set: (k, v) => { document.cookie = `${encodeURIComponent(k)}=${encodeURIComponent(v)}; path=/`; },
                del: (k) => {
                    const ps = getPaths();
                    const ds = getDoms();
                    ps.forEach(p => {
                        ds.forEach(d => {
                            document.cookie = `${encodeURIComponent(k)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${p}; domain=${d}`;
                            document.cookie = `${encodeURIComponent(k)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${p}; domain=${d}; SameSite=None; Secure`;
                            document.cookie = `${encodeURIComponent(k)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${p}`;
                        });
                    });
                }
            },
            { label: 'SessionStorage', emoji: '💬', get: () => ({ ...sessionStorage }), set: (k, v) => sessionStorage.setItem(k, v), del: (k) => sessionStorage.removeItem(k) },
            { label: 'LocalStorage', emoji: '🌐', get: () => ({ ...localStorage }), set: (k, v) => localStorage.setItem(k, v), del: (k) => localStorage.removeItem(k) }
        ];

        configs.forEach(conf => {
            const data = conf.get();
            const box = document.createElement('div');
            box.className = 'data-group-box';
            const keys = Object.keys(data);
            box.innerHTML = `
                <div style="font-weight:bold; font-size:16px; margin-bottom:10px;">${conf.emoji} ${conf.label} (${keys.length})</div>
                <div class="data-action-bar">
                    <button class="ad-mini-btn btn-copy-all">一键复制</button>
                    <button class="ad-mini-btn btn-clear-all" style="color:#d11;">一键清理</button>
                </div>
                <div class="data-items-list" style="display:none; margin-top:10px;"></div>
            `;
            const list = box.querySelector('.data-items-list');
            box.onclick = (e) => { if (e.target === box || e.target.parentElement === box) list.style.display = list.style.display === 'none' ? 'block' : 'none'; };
            box.querySelector('.btn-copy-all').onclick = (e) => { e.stopPropagation(); api.setClipboard(JSON.stringify(data, null, 2)); };
            box.querySelector('.btn-clear-all').onclick = (e) => { e.stopPropagation(); if (confirm('确定清理全部?')) { keys.forEach(k => conf.del(k)); renderDataPage(); } };

            keys.forEach(k => {
                const item = document.createElement('div');
                item.className = 'data-item-card';
                let currentVal = data[k];
                const updateItemUI = (isEditing = false) => {
                    item.innerHTML = `
                        <div class="data-row-display">
                            <span class="data-key-label">${k}</span> : 
                            <span class="data-val-text" ${isEditing ? 'contenteditable="true" style="border:1px solid #007bff; padding:2px; outline:none; background:var(--mb-bg);"' : ''}>${currentVal}</span>
                        </div>
                        <div class="data-action-bar">
                            ${isEditing ? `<button class="ad-mini-btn btn-save">确定</button><button class="ad-mini-btn btn-cancel">取消</button>` : `<button class="ad-mini-btn btn-copy">复制</button><button class="ad-mini-btn btn-edit">修改</button><button class="ad-mini-btn btn-del" style="color:#d11;">删除</button>`}
                        </div>
                    `;
                    if (isEditing) {
                        const vDom = item.querySelector('.data-val-text');
                        setTimeout(() => vDom.focus(), 10);
                        item.querySelector('.btn-save').onclick = () => { conf.set(k, vDom.innerText.trim()); currentVal = vDom.innerText.trim(); updateItemUI(false); };
                        item.querySelector('.btn-cancel').onclick = () => updateItemUI(false);
                    } else {
                        item.querySelector('.btn-copy').onclick = () => api.setClipboard(currentVal);
                        item.querySelector('.btn-edit').onclick = () => updateItemUI(true);
                        item.querySelector('.btn-del').onclick = () => { conf.del(k); item.remove(); };
                    }
                };
                updateItemUI();
                list.appendChild(item);
            });
            dataContent.appendChild(box);
        });
    }
    
    const iconContent = document.getElementById('mb-icon-content');
    const DEFAULT_SVG = `<svg viewBox="0 0 24 24"> <rect x="6" y="6" width="14" height="14" rx="2.5" stroke="currentColor" stroke-width="1.8" fill="none" style="color:var(--mb-text); opacity:0.7;"/> <path d="M9 10h8M9 13h5M9 16h8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" style="color:var(--mb-text); opacity:0.4;"/><g transform="translate(2, 2)"><path d="M4.5 4.5l6.5 6.5M4.5 4.5v5.5M4.5 4.5h5.5" stroke="#007aff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`;

    function renderIconPage() {
        iconContent.innerHTML = `
            <div class="icon-config-card">
                <div style="font-weight:bold; margin-bottom:10px;">位置与尺寸</div>
                <div class="icon-config-row"><span>大小 (px):</span><input type="number" class="icon-input" id="in-icon-size" value="${api.getValue('mb_icon_size', 32)}"></div>
                <div class="icon-config-row"><span>距离底部 (px):</span><input type="number" class="icon-input" id="in-icon-bottom" value="${api.getValue('mb_icon_bottom', 95)}"></div>
                <div class="icon-config-row"><span>距离右侧 (px):</span><input type="number" class="icon-input" id="in-icon-right" value="${api.getValue('mb_icon_right', 16)}"></div>
            </div>
            <div class="icon-config-card">
                <div style="font-weight:bold;">自定义 SVG 代码</div>
                <textarea class="icon-area" id="in-icon-svg">${api.getValue('mb_icon_svg', DEFAULT_SVG)}</textarea>
                <div class="ad-action-bar" style="margin-top:10px;">
                    <button class="ad-mini-btn" id="btn-icon-save" style="background:#007aff; color:#fff; border:none;">应用并保存</button>
                    <button class="ad-mini-btn" id="btn-icon-reset">恢复默认</button>
                    <button class="ad-mini-btn" id="btn-icon-temp-hide" style="color:#ff4757;">临时隐藏图标</button>
                </div>
            </div>
        `;
        document.getElementById('btn-icon-save').onclick = () => {
            api.setValue('mb_icon_size', parseInt(document.getElementById('in-icon-size').value));
            api.setValue('mb_icon_bottom', parseInt(document.getElementById('in-icon-bottom').value));
            api.setValue('mb_icon_right', parseInt(document.getElementById('in-icon-right').value));
            api.setValue('mb_icon_svg', document.getElementById('in-icon-svg').value);
            updateIconStyle();
            alert('保存成功');
        };
        document.getElementById('btn-icon-reset').onclick = () => {
            if(confirm('确定恢复默认图标设置吗？')){
                api.setValue('mb_icon_size', 32);
                api.setValue('mb_icon_bottom', 95);
                api.setValue('mb_icon_right', 16);
                api.setValue('mb_icon_svg', DEFAULT_SVG);
                renderIconPage();
                updateIconStyle();
            }
        };
        document.getElementById('btn-icon-temp-hide').onclick = () => {
            const trigger = document.getElementById('mb-debug-trigger');
            if (trigger) trigger.style.display = 'none';
            alert('图标已临时隐藏，刷新页面即可恢复。');
        };
    }

    function updateIconStyle() {
        const trigger = document.getElementById('mb-debug-trigger');
        if (!trigger) return;
        const size = api.getValue('mb_icon_size', 32);
        const bottom = api.getValue('mb_icon_bottom', 95);
        const right = api.getValue('mb_icon_right', 16);
        const svgCode = api.getValue('mb_icon_svg', DEFAULT_SVG);
        
        trigger.style.width = size + 'px';
        trigger.style.height = size + 'px';
        trigger.style.bottom = bottom + 'px';
        trigger.style.right = right + 'px';
        trigger.innerHTML = svgCode;
        
        const svgEl = trigger.querySelector('svg');
        if (svgEl) {
            svgEl.style.width = (size * 0.7) + 'px';
            svgEl.style.height = (size * 0.7) + 'px';
        }
    }

    function buildTree(el, isRoot = false) {
        if (!el) return null;
        if (el.nodeType === 3) {
            const text = el.textContent.trim();
            if (!text) return null;
            const textDiv = document.createElement('div');
            textDiv.className = 'node-row';
            textDiv.style.cssText = "margin-left: 18px; white-space: pre-wrap; cursor: default;";
            textDiv.innerText = text;
            return textDiv;
        }
        if (el.nodeType !== 1) return null;
        const wrapper = document.createElement('div');
        wrapper.className = 'node-wrapper';
        const row = document.createElement('div');
        const isSelected = el === currentTarget;
        row.className = 'node-row' + (isSelected ? ' selected' : '');
        const hasChildren = el.childNodes.length > 0;
        const arrow = document.createElement('span');
        arrow.className = 'toggle-btn';
        arrow.innerText = (hasChildren && (isRoot || isSelected)) ? '▼' : (hasChildren ? '▶' : ' ');
        row.appendChild(arrow);
        let html = `<span style="color:var(--mb-code-key);font-weight:bold;">&lt;${el.tagName.toLowerCase()}</span>`;
        for (let attr of el.attributes) {
            let val = attr.value;
            if (attr.name === 'class') { val = val.replace('mb-inspect-hl', '').trim(); if (!val) continue; }
            html += ` <span style="color:var(--mb-code-attr);"> ${attr.name}=</span><span style="color:var(--mb-code-val);">"${val}"</span>`;
        }
        html += `<span style="color:var(--mb-code-key);font-weight:bold;">&gt;</span>`;
        const label = document.createElement('span');
        label.innerHTML = html;
        row.appendChild(label);
        wrapper.appendChild(row);
        const cBox = document.createElement('div');
        if (hasChildren && (isRoot || isSelected)) {
            cBox.style.display = 'block';
            Array.from(el.childNodes).forEach(c => { const childNode = buildTree(c, false); if (childNode) cBox.appendChild(childNode); });
        } else { cBox.style.display = 'none'; }
        wrapper.appendChild(cBox);
        arrow.onclick = (e) => {
            e.stopPropagation();
            if (cBox.style.display === 'none') {
                if (cBox.innerHTML === '') { Array.from(el.childNodes).forEach(c => { const childNode = buildTree(c, false); if (childNode) cBox.appendChild(childNode); }); }
                cBox.style.display = 'block'; arrow.innerText = '▼';
            } else { cBox.style.display = 'none'; arrow.innerText = '▶'; }
        };
        row.onclick = (e) => { e.stopPropagation(); highlight(el); renderDOM(); };
        return wrapper;
    }

    function renderDOM() {
        domContent.innerHTML = '';
        if (!currentTarget) return;
        const parent = currentTarget.parentElement;
        if (parent) domContent.appendChild(buildTree(parent, true));
        else domContent.appendChild(buildTree(currentTarget, true));
        setTimeout(() => {
            const selectedNode = domContent.querySelector('.node-row.selected');
            if (selectedNode) {
                selectedNode.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });
            }
        }, 50);
    }

    function highlight(el) {
        if (currentTarget) currentTarget.classList.remove('mb-inspect-hl');
        currentTarget = el;
        currentTarget.classList.add('mb-inspect-hl');
    }
    
    function updateTriggerVisibility() {
        const trigger = document.getElementById('mb-debug-trigger');
        if (trigger) {
            trigger.style.display = api.getValue('mb_icon_visible', true) ? 'flex' : 'none';
        }
    }
    
    function toggleIconVisible() {
        const currentState = api.getValue('mb_icon_visible', true);
        api.setValue('mb_icon_visible', !currentState);
        updateTriggerVisibility();
    }

    function createDebugTrigger() {
        if (document.getElementById('mb-debug-trigger')) return;
        const trigger = document.createElement('div');
        trigger.id = 'mb-debug-trigger';
        trigger.onclick = () => togglePanel(!isDebugMode);
        document.body.appendChild(trigger);
        updateIconStyle();
        updateTriggerVisibility();
    }

    btnPick.onclick = (e) => { e.stopPropagation(); isPicking ? stopPicking() : startPicking(); };
    btnFold.onclick = (e) => { e.stopPropagation(); isCollapsed = !isCollapsed; updateFoldState(); };
    document.getElementById('mb-btn-to-js').onclick = () => switchToPage(1);
    document.getElementById('mb-btn-to-ad').onclick = () => { if (!currentTarget) return; renderAdPage(); switchToPage(2); };
    document.getElementById('mb-btn-to-data').onclick = () => { renderDataPage(); switchToPage(3); };
    document.getElementById('mb-btn-to-icon').onclick = () => { renderIconPage(); switchToPage(4); };
    document.getElementById('mb-btn-back').onclick = () => switchToPage(0);
    document.getElementById('mb-btn-close').onclick = () => togglePanel(false);
    document.getElementById('mb-btn-copy-html').onclick = () => { if (currentTarget) {const clone = currentTarget.cloneNode(true);clone.classList.remove('mb-inspect-hl');if (clone.classList.length === 0) clone.removeAttribute('class');api.setClipboard(clone.outerHTML);}};
    document.getElementById('mb-btn-parent').onclick = () => { if (currentTarget && currentTarget.parentElement) { highlight(currentTarget.parentElement); renderDOM(); } };
    document.getElementById('mb-btn-restore').onclick = () => { if (activePreviewStyle) { activePreviewStyle.remove(); activePreviewStyle = null; } };
    document.getElementById('btn-js-clear').onclick = () => { jsLog.innerHTML = ''; };
    document.getElementById('btn-js-run').onclick = () => { const code = jsInput.value.trim(); if (!code) return; try { const result = window.eval(code); if (result !== undefined) addLog(result, 'log-result'); } catch (e) { addLog(e.stack || e.message, 'log-error');}};
    document.getElementById('btn-js-copy-all').onclick = () => { const logs = Array.from(jsLog.querySelectorAll('.log-item')); if (logs.length === 0) { alert('没有可复制的日志'); return;} const text = logs.map(el => el.innerText).reverse().join('\n'); api.setClipboard(text);};

    api.registerMenu("开启/关闭审查面板", () => togglePanel(!isDebugMode));
    api.registerMenu("显示/隐藏悬浮图标", () => toggleIconVisible());

    if (document.readyState === 'complete') createDebugTrigger();
    else window.addEventListener('load', createDebugTrigger);
    
    const handler = (e) => {
        if (!isDebugMode || !isPicking || panel.contains(e.target)) return;
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
        if (e.type === 'click') { highlight(e.target); renderDOM(); if (isCollapsed) { isCollapsed = false; updateFoldState(); } }
    };
    ['click', 'mousedown', 'mouseup', 'pointerdown'].forEach(type => window.addEventListener(type, handler, true));
})();