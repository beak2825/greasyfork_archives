// ==UserScript==
// @name         OmniTools - 全能工具箱
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  高颜值开发者工具箱：优化JSON操作布局（大按钮格式化），合并时间获取按钮，精简计算逻辑。
// @author       yuisole
// @license      MIT
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/563860/OmniTools%20-%20%E5%85%A8%E8%83%BD%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/563860/OmniTools%20-%20%E5%85%A8%E8%83%BD%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==========================================
    // 1. 极光 UI 样式定义 (CSS)
    // ==========================================
    const STYLES = `
        :root {
            --omni-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --omni-glass-bg: rgba(255, 255, 255, 0.95);
            --omni-glass-border: 1px solid rgba(255, 255, 255, 0.6);
            --omni-shadow: 0 10px 30px rgba(0,0,0,0.15);
            --omni-radius: 12px;
            --omni-text-main: #2d3748;
        }

        /* 悬浮球 */
        #omni-fab {
            position: fixed; bottom: 40px; right: 30px;
            width: 40px; height: 40px;
            background: var(--omni-primary);
            border-radius: 50%; color: white; font-size: 20px;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 12px rgba(118, 75, 162, 0.4);
            cursor: move; z-index: 999999;
            transition: transform 0.2s, box-shadow 0.2s;
            backdrop-filter: blur(4px); user-select: none;
        }
        #omni-fab:hover { transform: scale(1.1); box-shadow: 0 6px 16px rgba(118, 75, 162, 0.5); }
        #omni-fab:active { transform: scale(0.95); cursor: grabbing; }

        /* 主面板 */
        #omni-panel {
            position: fixed; top: 10%; right: 100px; width: 360px; max-height: 85vh;
            background: var(--omni-glass-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: var(--omni-glass-border);
            box-shadow: var(--omni-shadow);
            border-radius: var(--omni-radius);
            z-index: 999998; display: none;
            flex-direction: column; overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            animation: omniFadeIn 0.2s ease;
        }
        #omni-panel.visible { display: flex; }

        @keyframes omniFadeIn { from { opacity: 0; } to { opacity: 1; } }

        .omni-header {
            padding: 10px 15px; border-bottom: 1px solid rgba(0,0,0,0.05);
            display: flex; justify-content: space-between; align-items: center;
            cursor: move; user-select: none; background: rgba(255,255,255,0.5);
        }
        .omni-header h3 {
            margin: 0; font-size: 16px; font-weight: 700;
            background: var(--omni-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            pointer-events: none;
        }
        .omni-close { cursor: pointer; padding: 5px; color: #999; font-weight: bold; font-size: 14px; }
        .omni-close:hover { color: #d63031; }

        /* Tabs */
        .omni-tabs { display: flex; padding: 8px 15px 0 15px; gap: 8px; }
        .omni-tab {
            flex: 1; padding: 8px; text-align: center; cursor: pointer;
            font-size: 13px; color: #718096; border-radius: 8px 8px 0 0;
            transition: all 0.2s; position: relative; user-select: none;
        }
        .omni-tab.active { background: rgba(255,255,255,0.6); color: #667eea; font-weight: 600; }
        .omni-tab.active::after {
            content: ''; position: absolute; bottom: 0; left: 25%; right: 25%;
            height: 2px; background: var(--omni-primary); border-radius: 2px 2px 0 0;
        }

        .omni-content { padding: 15px; overflow-y: auto; flex: 1; }
        .omni-module { display: none; }
        .omni-module.active { display: block; }

        /* 表单 */
        .omni-form-group { margin-bottom: 12px; }
        .omni-label { display: block; font-size: 11px; font-weight: 600; color: #718096; margin-bottom: 5px; }
        .omni-input, .omni-textarea {
            width: 100%; box-sizing: border-box; padding: 8px 10px;
            border: 1px solid rgba(0,0,0,0.05); background: rgba(255,255,255,0.6);
            border-radius: 8px; font-family: 'Menlo', monospace; font-size: 12px;
            color: #2d3748; outline: none; transition: border 0.2s, background 0.2s;
        }
        .omni-textarea { height: 80px; resize: vertical; }
        .omni-input:focus, .omni-textarea:focus {
            background: #fff; box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
        }

        /* 按钮 */
        .omni-btn-group { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 5px;}
        .omni-btn {
            padding: 6px 12px; border: none; border-radius: 6px; flex: 1; white-space: nowrap;
            cursor: pointer; font-size: 12px; font-weight: 500;
            background: rgba(255,255,255,0.8); color: #4a5568;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05); transition: all 0.2s;
        }
        .omni-btn:hover { transform: translateY(-1px); box-shadow: 0 3px 5px rgba(0,0,0,0.08); }
        .omni-btn.primary {
            background: var(--omni-primary); color: white;
            box-shadow: 0 3px 8px rgba(118, 75, 162, 0.3);
        }

        /* JSON Highlight */
        .omni-json-key { color: #e06c75; font-weight: bold; }
        .omni-json-string { color: #98c379; }
        .omni-json-number { color: #d19a66; }
        .omni-json-boolean { color: #61aeee; font-weight: bold; }
        .omni-json-null { color: #56b6c2; font-style: italic; }

        /* Time Grid */
        .omni-time-grid { display: flex; flex-direction: column; gap: 6px; margin-top: 10px; }
        .omni-time-card {
            background: white; padding: 8px 12px; border-radius: 8px;
            border: 1px solid rgba(0,0,0,0.05);
            display: flex; align-items: center; justify-content: space-between;
            cursor: pointer; transition: all 0.2s;
        }
        .omni-time-card:hover { background: #f7fafc; border-color: #cbd5e0; transform: translateX(2px); }
        .omni-time-left { display: flex; align-items: center; font-size: 12px; color: #2d3748; font-family: 'Menlo', monospace; overflow: hidden; }
        .omni-time-label-text { color: #718096; font-weight: bold; white-space: nowrap; margin-right: 5px; }
        .omni-time-val-text { color: #2d3748; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .omni-time-hint { font-size: 10px; color: #a0aec0; opacity: 0; transition: opacity 0.2s; white-space: nowrap; margin-left: 10px; }
        .omni-time-card:hover .omni-time-hint { opacity: 1; color: #667eea; }

        /* Modal */
        #omni-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(5px);
            z-index: 9999999; display: flex; align-items: center; justify-content: center;
            opacity: 0; pointer-events: none; transition: opacity 0.2s;
        }
        #omni-modal-overlay.active { opacity: 1; pointer-events: auto; }
        .omni-modal-content {
            width: 80%; height: 80%; background: #282c34; color: #abb2bf;
            border-radius: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            display: flex; flex-direction: column; overflow: hidden;
            transform: scale(0.95); transition: transform 0.2s;
        }
        #omni-modal-overlay.active .omni-modal-content { transform: scale(1); }
        .omni-modal-header {
            padding: 8px 15px; background: #21252b; display: flex; justify-content: space-between; align-items: center;
            border-bottom: 1px solid #181a1f; color: #fff; font-size: 13px;
        }
        .omni-modal-body {
            flex: 1; padding: 15px; overflow: auto;
            font-family: 'Menlo', 'Consolas', monospace; white-space: pre; font-size: 12px; line-height: 1.5;
        }
        .omni-modal-body::-webkit-scrollbar { width: 6px; height: 6px; }
        .omni-modal-body::-webkit-scrollbar-thumb { background: #4b5263; border-radius: 3px; }

        /* Context Menu */
        #omni-context-menu {
            position: fixed; background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(12px); border: 1px solid rgba(0,0,0,0.05);
            box-shadow: 0 8px 30px rgba(0,0,0,0.12); border-radius: 10px;
            z-index: 1000000; padding: 5px; display: none; min-width: 160px;
        }
        .omni-menu-item {
            padding: 6px 10px; cursor: pointer; font-size: 12px; color: #333;
            border-radius: 5px; display: flex; justify-content: space-between;
        }
        .omni-menu-item:hover { background: rgba(102, 126, 234, 0.1); color: #667eea; }
        .omni-menu-hint { font-size: 10px; color: #999; margin-left: 10px; }
        .omni-menu-divider { height: 1px; background: #eee; margin: 3px 0; }
    `;

    GM_addStyle(STYLES);

    // ==========================================
    // 2. 基础工具类
    // ==========================================
    const Utils = {
        copy: (text) => {
            GM_setClipboard(text);
            Utils.toast('已复制 ✅');
        },
        toast: (msg) => {
            let toast = document.getElementById('omni-toast');
            if(!toast) {
                toast = document.createElement('div');
                toast.id = 'omni-toast';
                Object.assign(toast.style, {
                    position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.8)', color: 'white', padding: '6px 12px',
                    borderRadius: '20px', zIndex: '10000000', fontSize: '12px',
                    backdropFilter: 'blur(4px)', transition: 'all 0.3s', opacity: '0', pointerEvents: 'none'
                });
                document.body.appendChild(toast);
            }
            toast.innerText = msg;
            toast.style.opacity = '1';
            toast.style.top = '50px';
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.top = '20px';
            }, 1500);
        },
        syntaxHighlight: (json) => {
            if (typeof json !== 'string') json = JSON.stringify(json, undefined, 4);
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                let cls = 'omni-json-number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) cls = 'omni-json-key';
                    else cls = 'omni-json-string';
                } else if (/true|false/.test(match)) cls = 'omni-json-boolean';
                else if (/null/.test(match)) cls = 'omni-json-null';
                return '<span class="' + cls + '">' + match + '</span>';
            });
        },
        showModal: (content, title, isHtml = false) => {
            let overlay = document.getElementById('omni-modal-overlay');
            if (!overlay) {
                overlay = Utils.el('div', 'active', '', 'omni-modal-overlay');
                overlay.id = 'omni-modal-overlay';
                overlay.className = '';
                overlay.innerHTML = `
                    <div class="omni-modal-content">
                        <div class="omni-modal-header">
                            <span id="omni-modal-title">Result</span>
                            <span class="omni-close" id="omni-modal-close" style="color:#fff">✕ ESC</span>
                        </div>
                        <div class="omni-modal-body" id="omni-modal-text" title="双击全文复制"></div>
                    </div>
                `;
                document.body.appendChild(overlay);
                const close = () => overlay.classList.remove('active');
                overlay.querySelector('#omni-modal-close').onclick = close;
                overlay.onclick = (e) => { if(e.target === overlay) close(); };
                document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && overlay.classList.contains('active')) close(); });
            }
            overlay.querySelector('#omni-modal-title').innerText = title || '结果';
            const body = overlay.querySelector('#omni-modal-text');
            if (isHtml) body.innerHTML = content;
            else body.textContent = content;
            body.ondblclick = () => { Utils.copy(body.innerText); Utils.toast('全文已复制'); };
            overlay.classList.add('active');
        },
        formatDate: (date) => {
            const pad = n => n < 10 ? '0' + n : n;
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        },
        el: (tag, className, html = '', id = '') => {
            const d = document.createElement(tag);
            if (className) d.className = className;
            if (id) d.id = id;
            if (html) d.innerHTML = html;
            return d;
        },
        makeDraggable: (element, triggerHandle) => {
            const handle = triggerHandle || element;
            let isDragging = false;
            let startX, startY, initialLeft, initialTop;
            handle.onmousedown = (e) => {
                if (e.button !== 0) return;
                e.preventDefault();
                const rect = element.getBoundingClientRect();
                initialLeft = rect.left;
                initialTop = rect.top;
                startX = e.clientX;
                startY = e.clientY;
                isDragging = false;
                element.style.position = 'fixed';
                element.style.left = `${initialLeft}px`;
                element.style.top = `${initialTop}px`;
                element.style.right = 'auto';
                element.style.bottom = 'auto';
                element.style.margin = '0';
                const onMove = (evt) => {
                    const dx = evt.clientX - startX;
                    const dy = evt.clientY - startY;
                    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) isDragging = true;
                    element.style.left = `${initialLeft + dx}px`;
                    element.style.top = `${initialTop + dy}px`;
                };
                const onUp = () => {
                    document.removeEventListener('mousemove', onMove);
                    document.removeEventListener('mouseup', onUp);
                };
                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
            };
            return () => isDragging;
        }
    };

    // ==========================================
    // 3. 模块定义
    // ==========================================

    class JsonModule {
        constructor() { this.name = 'JSON 工具'; this.id = 'json'; }
        renderPanel() {
            const container = Utils.el('div', 'omni-module');
            container.innerHTML = `
                <div class="omni-form-group">
                    <label class="omni-label">SOURCE JSON</label>
                    <textarea class="omni-textarea" id="omni-json-input" placeholder="粘贴 JSON..."></textarea>
                </div>
                <div class="omni-btn-group">
                    <button class="omni-btn" id="omni-btn-unescape">↩️ 去转义</button>
                    <button class="omni-btn" id="omni-btn-compress">📦 压缩</button>
                    <button class="omni-btn" id="omni-btn-escape">🔣 转义</button>
                    <button class="omni-btn primary" id="omni-btn-format" style="flex-basis: 100%; margin-top: 5px; font-size: 14px; padding: 10px;">✨ 格式化 (弹窗)</button>
                </div>
            `;
            this.bindEvents(container);
            return container;
        }
        bindEvents(container) {
            const input = container.querySelector('#omni-json-input');
            const handle = (action) => {
                const text = input.value.trim();
                if (!text) { Utils.toast('请输入内容'); return; }
                try {
                    let res = '';
                    if (action === 'format') {
                        const formattedStr = JSON.stringify(JSON.parse(text), null, 4);
                        const highlightedHtml = Utils.syntaxHighlight(formattedStr);
                        Utils.showModal(highlightedHtml, 'JSON 格式化预览', true);
                        return;
                    }
                    if (action === 'compress') res = JSON.stringify(JSON.parse(text));
                    if (action === 'escape') res = text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
                    if (action === 'unescape') res = text.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                    Utils.copy(res);
                } catch (e) { Utils.toast('❌ JSON 解析错误'); }
            };
            container.querySelector('#omni-btn-format').onclick = () => handle('format');
            container.querySelector('#omni-btn-compress').onclick = () => handle('compress');
            container.querySelector('#omni-btn-escape').onclick = () => handle('escape');
            container.querySelector('#omni-btn-unescape').onclick = () => handle('unescape');
        }
        getContextActions(selectedText) {
            const actions = [];
            const trimmed = selectedText.trim();
            if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
                actions.push({
                    label: '✨ 格式化 JSON',
                    onClick: () => {
                        try {
                            const formattedStr = JSON.stringify(JSON.parse(trimmed), null, 4);
                            const highlightedHtml = Utils.syntaxHighlight(formattedStr);
                            Utils.showModal(highlightedHtml, 'JSON 查看', true);
                        } catch (e) { alert('JSON 解析失败'); }
                    }
                });
            }
            return actions;
        }
    }

    class TimeModule {
        constructor() { this.name = '时间转换'; this.id = 'time'; }
        renderPanel() {
            const container = Utils.el('div', 'omni-module');
            container.innerHTML = `
                <div class="omni-form-group">
                    <label class="omni-label">INPUT</label>
                    <input class="omni-input" id="omni-time-input" placeholder="输入时间戳 或 2023-10-01">
                </div>
                <div class="omni-btn-group">
                    <button class="omni-btn primary" id="omni-btn-time-conv">🚀 转换</button>
                    <button class="omni-btn" id="omni-btn-now">⏰ 当前</button>
                    <button class="omni-btn" data-calc="today_start">🌅 0点</button>
                    <button class="omni-btn" data-calc="today_end">🌃 末点</button>
                </div>

                <div id="omni-time-results" style="display:none">
                    <div class="omni-time-grid">
                        <div class="omni-time-card" id="card-date">
                            <div class="omni-time-left"><span class="omni-time-label-text">日期：</span><span class="omni-time-val-text"></span></div>
                            <span class="omni-time-hint">双击复制</span>
                        </div>
                        <div class="omni-time-card" id="card-ms">
                            <div class="omni-time-left"><span class="omni-time-label-text">毫秒：</span><span class="omni-time-val-text"></span></div>
                            <span class="omni-time-hint">双击复制</span>
                        </div>
                        <div class="omni-time-card" id="card-sec">
                            <div class="omni-time-left"><span class="omni-time-label-text">秒级：</span><span class="omni-time-val-text"></span></div>
                            <span class="omni-time-hint">双击复制</span>
                        </div>
                    </div>
                </div>

                <div class="omni-form-group" style="margin-top:15px; border-top:1px dashed #ddd; padding-top:10px;">
                    <label class="omni-label">日期推算 (±N天)</label>
                    <div style="display:flex; align-items:center; gap:6px;">
                        <input type="number" id="omni-n-days" class="omni-input" value="1" min="0" style="width:60px; padding:6px; text-align:center;" title="自定义天数 N">
                        <button class="omni-btn" id="omni-btn-plus-n" style="flex:1">往后 (+)</button>
                        <button class="omni-btn" id="omni-btn-minus-n" style="flex:1">往前 (-)</button>
                    </div>
                </div>
            `;
            this.bindEvents(container);
            return container;
        }
        bindEvents(container) {
            const input = container.querySelector('#omni-time-input');
            const resultArea = container.querySelector('#omni-time-results');
            const cardDate = container.querySelector('#card-date .omni-time-val-text');
            const cardMs = container.querySelector('#card-ms .omni-time-val-text');
            const cardSec = container.querySelector('#card-sec .omni-time-val-text');
            const nInput = container.querySelector('#omni-n-days');

            const renderData = (dateObj) => {
                if (isNaN(dateObj.getTime())) { Utils.toast('无效的时间格式'); return; }
                const dateStr = Utils.formatDate(dateObj);
                const ms = dateObj.getTime();
                const sec = Math.floor(ms / 1000);
                cardDate.textContent = dateStr;
                cardMs.textContent = ms;
                cardSec.textContent = sec;
                resultArea.style.display = 'block';
            };
            container.querySelector('#omni-btn-time-conv').onclick = () => {
                const val = input.value.trim();
                if(!val) return;
                let date;
                if (/^\d+$/.test(val)) {
                    const ts = val.length === 10 ? parseInt(val) * 1000 : parseInt(val);
                    date = new Date(ts);
                } else { date = new Date(val); }
                renderData(date);
            };
            container.querySelector('#omni-btn-now').onclick = () => {
                const now = new Date();
                input.value = now.getTime();
                renderData(now);
            };
            [container.querySelector('#card-date'), container.querySelector('#card-ms'), container.querySelector('#card-sec')].forEach(card => {
                card.ondblclick = () => Utils.copy(card.querySelector('.omni-time-val-text').textContent);
            });
            // 绑定 0点和末点
            container.querySelectorAll('button[data-calc]').forEach(btn => {
                btn.onclick = () => {
                    const type = btn.dataset.calc;
                    let d = new Date();
                    if (type === 'today_start') d.setHours(0,0,0,0);
                    if (type === 'today_end') d.setHours(23,59,59,999);
                    input.value = Utils.formatDate(d);
                    renderData(d);
                };
            });

            // N 天逻辑 (防止负数)
            const calcN = (factor) => {
                const n = Math.abs(parseInt(nInput.value) || 0); // 强制取绝对值
                const d = new Date();
                d.setDate(d.getDate() + (n * factor));
                input.value = Utils.formatDate(d);
                renderData(d);
            };
            container.querySelector('#omni-btn-plus-n').onclick = () => calcN(1);
            container.querySelector('#omni-btn-minus-n').onclick = () => calcN(-1);
        }
        getContextActions(selectedText) {
            const actions = [];
            const text = selectedText.trim();
            if (!text) return actions;
            if (/^\d{10}$|^\d{13}$/.test(text)) {
                const ts = text.length === 10 ? text * 1000 : text * 1;
                actions.push({
                    label: '📅 转为日期',
                    hint: Utils.formatDate(new Date(ts)),
                    onClick: () => Utils.copy(Utils.formatDate(new Date(ts)))
                });
            }
            else if (/\d/.test(text) && !isNaN(Date.parse(text))) {
                 const d = new Date(text);
                 actions.push({
                    label: '🔢 转时间戳',
                    hint: d.getTime(),
                    onClick: () => Utils.copy(d.getTime())
                });
            }
            return actions;
        }
    }

    class OmniToolsApp {
        constructor() {
            this.modules = [new JsonModule(), new TimeModule()];
            this.initUI();
            this.initContextMenu();
        }
        initUI() {
            const fab = Utils.el('div', '', '⚡️', 'omni-fab');
            document.body.appendChild(fab);
            const panel = Utils.el('div', '', '', 'omni-panel');
            const header = Utils.el('div', 'omni-header', `<h3>OmniTools</h3><span class="omni-close">✕</span>`);
            panel.appendChild(header);
            const tabsContainer = Utils.el('div', 'omni-tabs');
            const contentContainer = Utils.el('div', 'omni-content');
            this.modules.forEach((mod, index) => {
                const tab = Utils.el('div', `omni-tab ${index === 0 ? 'active' : ''}`, mod.name);
                tab.dataset.id = mod.id;
                tab.onclick = () => this.switchTab(mod.id);
                tabsContainer.appendChild(tab);
                const content = mod.renderPanel();
                if (index === 0) content.classList.add('active');
                content.dataset.id = mod.id;
                contentContainer.appendChild(content);
            });
            panel.appendChild(tabsContainer);
            panel.appendChild(contentContainer);
            document.body.appendChild(panel);
            const checkFabDrag = Utils.makeDraggable(fab);
            fab.onclick = () => {
                if (!checkFabDrag()) panel.classList.toggle('visible');
            };
            Utils.makeDraggable(panel, header);
            header.querySelector('.omni-close').onclick = () => panel.classList.remove('visible');
        }
        switchTab(modId) {
            document.querySelectorAll('.omni-tab').forEach(t => t.classList.toggle('active', t.dataset.id === modId));
            document.querySelectorAll('.omni-module').forEach(m => m.classList.toggle('active', m.dataset.id === modId));
        }
        initContextMenu() {
            const menu = Utils.el('div', '', '', 'omni-context-menu');
            document.body.appendChild(menu);
            const hideMenu = () => { menu.style.display = 'none'; };
            document.addEventListener('click', hideMenu);
            document.addEventListener('contextmenu', (e) => {
                const selection = window.getSelection().toString();
                if (!selection) return;
                let contextActions = [];
                this.modules.forEach(mod => {
                    const actions = mod.getContextActions(selection);
                    if (actions && actions.length > 0) contextActions = contextActions.concat(actions);
                });
                if (contextActions.length === 0) return;
                e.preventDefault();
                menu.innerHTML = '';
                contextActions.forEach(action => {
                    const item = Utils.el('div', 'omni-menu-item');
                    let html = `<span>${action.label}</span>`;
                    if(action.hint) html += `<span class="omni-menu-hint">${action.hint}</span>`;
                    item.innerHTML = html;
                    item.onclick = (evt) => {
                        evt.stopPropagation();
                        action.onClick();
                        hideMenu();
                    };
                    menu.appendChild(item);
                });
                const divider = Utils.el('div', 'omni-menu-divider');
                menu.appendChild(divider);
                const openItem = Utils.el('div', 'omni-menu-item', '<span>⚙️ 打开工具箱</span>');
                openItem.onclick = () => { document.getElementById('omni-panel').classList.add('visible'); };
                menu.appendChild(openItem);
                menu.style.display = 'block';
                let left = e.clientX, top = e.clientY;
                if(left + 200 > window.innerWidth) left = window.innerWidth - 210;
                menu.style.left = `${left}px`;
                menu.style.top = `${top}px`;
            });
        }
    }
    new OmniToolsApp();
})();