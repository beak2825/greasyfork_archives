// ==UserScript==
// @name         极速鸟工作流自定义标题库优化
// @namespace    https://kuiwaiwai.com/
// @version      0.1
// @description  为极速鸟工作流添加自定义标题库功能（极速鸟！！！还我自定义标题！！！）
// @author       kuiwaiwai
// @license      Apache License 2.0
// @match        https://auto3.kunpengguanjia.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/549200/%E6%9E%81%E9%80%9F%E9%B8%9F%E5%B7%A5%E4%BD%9C%E6%B5%81%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%87%E9%A2%98%E5%BA%93%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/549200/%E6%9E%81%E9%80%9F%E9%B8%9F%E5%B7%A5%E4%BD%9C%E6%B5%81%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%87%E9%A2%98%E5%BA%93%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'customTitleGroup_data_v1';
    const defaultData = { titlesText: '' };

    window.__ctg_temp_enabled = window.__ctg_temp_enabled || false;

    function loadData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return {...defaultData};
            return Object.assign({}, defaultData, JSON.parse(raw));
        } catch (e) {
            console.warn('读取自定义标题组数据失败', e);
            return {...defaultData};
        }
    }
    function saveData(obj) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
            window.dispatchEvent(new Event('ctg-storage-updated'));
        } catch (e) {
            console.warn('保存自定义标题组数据失败', e);
        }
    }
    function parseTitles(text) {
        if (!text) return [];
        return text.split(/\r?\n/).map(s => s.trim()).filter(s => s.length > 0);
    }
    function titleCount() {
        return parseTitles(loadData().titlesText).length;
    }
    function shuffle(array) {
        const a = array.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    function pickRandomTitles(titles, n) {
        if (!Array.isArray(titles)) return [];
        if (titles.length <= n) return titles.slice();
        return shuffle(titles).slice(0, n);
    }

    // 编辑面板
    function createPanelIfNeeded() {
        if (document.getElementById('ctg-panel')) return;
        const data = loadData();

        const panel = document.createElement('div');
        panel.id = 'ctg-panel';
        panel.style.position = 'fixed';
        panel.style.left = '50%';
        panel.style.top = '50%';
        panel.style.transform = 'translate(-50%,-50%)';
        panel.style.zIndex = 2147483646;
        panel.style.width = '520px';
        panel.style.maxWidth = '92vw';
        panel.style.background = '#fff';
        panel.style.border = '1px solid rgba(0,0,0,0.12)';
        panel.style.borderRadius = '8px';
        panel.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
        panel.style.padding = '12px';
        panel.style.boxSizing = 'border-box';
        panel.style.fontFamily = 'Arial, "Microsoft Yahei", sans-serif';
        panel.style.fontSize = '13px';

        const title = document.createElement('div');
        title.style.fontWeight = 600;
        title.style.marginBottom = '6px';
        title.innerText = '自定义标题库设置';
        panel.appendChild(title);

        const ta = document.createElement('textarea');
        ta.id = 'ctg-textarea';
        ta.placeholder = '每行一个标题';
        ta.style.width = '100%';
        ta.style.height = '220px';
        ta.style.boxSizing = 'border-box';
        ta.style.padding = '8px';
        ta.style.border = '1px solid #ddd';
        ta.style.borderRadius = '6px';
        ta.value = data.titlesText || '';
        panel.appendChild(ta);

        const bottom = document.createElement('div');
        bottom.style.display = 'flex';
        bottom.style.justifyContent = 'space-between';
        bottom.style.alignItems = 'center';
        bottom.style.marginTop = '8px';

        const info = document.createElement('div');
        info.style.color = '#666';
        info.innerText = `已配置 ${parseTitles(ta.value).length} 个标题`;
        bottom.appendChild(info);

        ta.addEventListener('input', () => {
            info.innerText = `已配置 ${parseTitles(ta.value).length} 个标题`;
        });

        const btns = document.createElement('div');

        const saveBtn = document.createElement('button');
        saveBtn.type = 'button';
        saveBtn.innerText = '保存';
        saveBtn.style.marginRight = '8px';
        saveBtn.style.padding = '6px 12px';
        saveBtn.style.borderRadius = '6px';
        saveBtn.style.border = '1px solid #0b84ff';
        saveBtn.style.background = '#0b84ff';
        saveBtn.style.color = '#fff';
        saveBtn.style.cursor = 'pointer';

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.innerText = '关闭';
        closeBtn.style.padding = '6px 12px';
        closeBtn.style.borderRadius = '6px';
        closeBtn.style.border = '1px solid #bbb';
        closeBtn.style.background = '#fff';
        closeBtn.style.color = '#333';
        closeBtn.style.cursor = 'pointer';

        btns.appendChild(saveBtn);
        btns.appendChild(closeBtn);
        bottom.appendChild(btns);
        panel.appendChild(bottom);

        saveBtn.addEventListener('click', () => {
            const current = loadData();
            current.titlesText = ta.value;
            saveData(current);
            saveBtn.innerText = '已保存';
            setTimeout(() => saveBtn.innerText = '保存', 1000);
        });

        closeBtn.addEventListener('click', () => {
            panel.remove();
        });

        document.body.appendChild(panel);
    }
    function showPanel() {
        createPanelIfNeeded();
        const panel = document.getElementById('ctg-panel');
        if (panel) {
            panel.style.display = 'block';
            const ta = document.getElementById('ctg-textarea');
            if (ta) { ta.focus(); ta.selectionStart = ta.value.length; }
        }
    }

    // 网络拦截（仅当临时启用时）
    function hookFetch() {
        if (window.__ctg_fetch_hooked) return;
        window.__ctg_fetch_hooked = true;
        const originalFetch = window.fetch.bind(window);

        window.fetch = async function(input, init) {
            try {
                if (!window.__ctg_temp_enabled) return originalFetch(input, init);

                let url = '';
                if (typeof input === 'string') url = input;
                else if (input instanceof Request) url = input.url || '';
                else url = String(input);

                if (url && url.indexOf('playlet.jingwen520.com/wpPay.workPool/addWorkPoolJob') !== -1) {
                    let bodyText = null;
                    if (typeof input === 'string') {
                        if (init && init.body) {
                            if (typeof init.body === 'string') bodyText = init.body;
                            else {
                                try { bodyText = JSON.stringify(init.body); } catch (e) { bodyText = String(init.body); }
                            }
                        }
                    } else if (input instanceof Request) {
                        try { bodyText = await input.clone().text(); } catch (e) { bodyText = null; }
                    }

                    if (bodyText && typeof bodyText === 'string') {
                        let parsed = null;
                        try { parsed = JSON.parse(bodyText); } catch (e) {
                            try {
                                const firstBrace = bodyText.indexOf('{');
                                const lastBrace = bodyText.lastIndexOf('}');
                                if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                                    parsed = JSON.parse(bodyText.slice(firstBrace, lastBrace + 1));
                                }
                            } catch (e2) { parsed = null; }
                        }

                        if (parsed && typeof parsed === 'object') {
                            if (parsed.hasOwnProperty('title_map_type')) { try { delete parsed.title_map_type; } catch (e) {} }
                            const userTitles = parseTitles(loadData().titlesText);
                            if (userTitles.length > 0) parsed.title_map = pickRandomTitles(userTitles, 10);
                            else if (!parsed.hasOwnProperty('title_map')) parsed.title_map = [];

                            // clear temp flag after sending this request
                            window.__ctg_temp_enabled = false;

                            const newBodyText = JSON.stringify(parsed);
                            if (typeof input === 'string') {
                                const newInit = Object.assign({}, init || {});
                                newInit.body = newBodyText;
                                newInit.headers = newInit.headers || {};
                                try {
                                    if (newInit.headers instanceof Headers) {
                                        if (!newInit.headers.has('content-type')) newInit.headers.set('content-type', 'application/json');
                                    } else {
                                        if (!('content-type' in newInit.headers) && !('Content-Type' in newInit.headers)) newInit.headers['Content-Type'] = 'application/json';
                                    }
                                } catch (e) {}
                                return originalFetch(input, newInit);
                            } else if (input instanceof Request) {
                                try { return originalFetch(new Request(input.url, Object.assign({}, { method: input.method, headers: input.headers, body: newBodyText, mode: input.mode, credentials: input.credentials, cache: input.cache, redirect: input.redirect, referrer: input.referrer, referrerPolicy: input.referrerPolicy, integrity: input.integrity, keepalive: input.keepalive }))); } catch (e) {
                                    const fallbackInit = Object.assign({}, init || {}, { body: newBodyText });
                                    return originalFetch(input.url, fallbackInit);
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                console.warn('ctg fetch 拦截异常：', err);
            }
            return originalFetch(input, init);
        };
    }
    function hookXHR() {
        if (window.__ctg_xhr_hooked) return;
        window.__ctg_xhr_hooked = true;
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;
        const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            try { this.__ctg_url = url ? String(url) : ''; this.__ctg_method = method ? String(method) : ''; } catch (e) {}
            return originalOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
            try { if (!this.__ctg_headers) this.__ctg_headers = {}; this.__ctg_headers[String(header).toLowerCase()] = String(value); } catch (e) {}
            return originalSetRequestHeader.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function(body) {
            try {
                if (!window.__ctg_temp_enabled) return originalSend.call(this, body);

                const url = this.__ctg_url || '';
                if (url.indexOf('playlet.jingwen520.com/wpPay.workPool/addWorkPoolJob') !== -1 && body && typeof body === 'string') {
                    let parsed = null;
                    try { parsed = JSON.parse(body); } catch (e) {
                        try {
                            const firstBrace = body.indexOf('{');
                            const lastBrace = body.lastIndexOf('}');
                            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) parsed = JSON.parse(body.slice(firstBrace, lastBrace + 1));
                        } catch (e2) { parsed = null; }
                    }
                    if (parsed && typeof parsed === 'object') {
                        if (parsed.hasOwnProperty('title_map_type')) { try { delete parsed.title_map_type; } catch (e) {} }
                        const userTitles = parseTitles(loadData().titlesText);
                        if (userTitles.length > 0) parsed.title_map = pickRandomTitles(userTitles, 10);
                        else if (!parsed.hasOwnProperty('title_map')) parsed.title_map = [];

                        window.__ctg_temp_enabled = false;

                        const newBody = JSON.stringify(parsed);
                        try {
                            const headers = this.__ctg_headers || {};
                            if (!headers['content-type'] && !headers['Content-Type']) {
                                try { this.setRequestHeader('Content-Type', 'application/json'); } catch (e) {}
                            }
                        } catch (e) {}
                        return originalSend.call(this, newBody);
                    }
                }
            } catch (err) {
                console.warn('ctg XHR 拦截异常：', err);
                try { return originalSend.call(this, body); } catch (e) {}
            }
            return originalSend.call(this, body);
        };
    }

    // 注入选项（重建 DOM，避免复制文本节点；对话框关闭时彻底清理）
    function observeModalAndInjectOption() {
        if (window.__ctg_modal_observer_installed) return;
        window.__ctg_modal_observer_installed = true;

        function isTargetModal(modalEl) {
            try {
                const titleEl = modalEl.querySelector('.ant-modal-title');
                if (!titleEl) return false;
                const t = (titleEl.textContent || '').trim();
                return /^新建.*任务$/.test(t) || t === '新建任务';
            } catch (e) { return false; }
        }

        function findTitleRadioGroup(modalEl) {
            const labels = modalEl.querySelectorAll('.ant-form-item-label label');
            for (const lbl of labels) {
                if ((lbl.textContent || '').trim() === '标题') {
                    const fi = lbl.closest('.ant-form-item');
                    if (fi) {
                        const rg = fi.querySelector('.ant-radio-group');
                        if (rg) return rg;
                    }
                }
            }
            const possible = modalEl.querySelectorAll('.ant-form-item');
            for (const p of possible) {
                const rg = p.querySelector('.ant-radio-group');
                if (rg) return rg;
            }
            return null;
        }

        function updateCountSpan(countSpan) {
            if (!countSpan) return;
            const c = titleCount();
            countSpan.textContent = `（已配置${c}个）`;
        }

        function buildCustomLabelFromTemplate(templateWrapper) {
            const label = document.createElement('label');
            if (templateWrapper && templateWrapper.className) label.className = templateWrapper.className;
            label.setAttribute('data-ctg-custom-option', '1');

            const radioSpan = document.createElement('span');
            radioSpan.className = 'ant-radio';
            const input = document.createElement('input');
            input.type = 'radio';
            input.className = 'ant-radio-input';
            input.value = 'ctg_custom';
            input.removeAttribute && input.removeAttribute('name');
            const inner = document.createElement('span');
            inner.className = 'ant-radio-inner';
            radioSpan.appendChild(input);
            radioSpan.appendChild(inner);

            const textSpan = document.createElement('span');
            textSpan.textContent = '自定义标题库';
            const countSpan = document.createElement('span');
            countSpan.className = 'ctg-count';
            countSpan.style.marginLeft = '6px';
            countSpan.style.color = '#666';
            countSpan.style.fontSize = (window.getComputedStyle ? (parseFloat(window.getComputedStyle(textSpan).fontSize || 13) - 1) + 'px' : '12px');
            countSpan.style.display = 'none';
            textSpan.appendChild(countSpan);

            label.appendChild(radioSpan);
            label.appendChild(textSpan);

            return { label, input, countSpan, textSpan };
        }

        function injectIntoModal(modalEl) {
            try {
                if (!isTargetModal(modalEl)) return;
                const radioGroup = findTitleRadioGroup(modalEl);
                if (!radioGroup) return;
                if (radioGroup.querySelector('[data-ctg-custom-option]')) return;

                const existingWrapper = radioGroup.querySelector('.ant-radio-wrapper');
                const { label: customLabel, input: customInput, countSpan, textSpan } = buildCustomLabelFromTemplate(existingWrapper);

                customInput.checked = false;
                radioGroup.appendChild(customLabel);

                function clearCustomSelectionVisuals() {
                    const custom = radioGroup.querySelector('[data-ctg-custom-option]');
                    if (!custom) return;
                    const c = custom.querySelector('.ctg-count');
                    if (c) c.style.display = 'none';
                    custom.classList.remove('ant-radio-wrapper-checked');
                    const rr = custom.querySelector('.ant-radio');
                    if (rr) rr.classList.remove('ant-radio-checked');
                    try { const inp = custom.querySelector('input.ant-radio-input'); if (inp) inp.checked = false; } catch (e) {}
                    window.__ctg_temp_enabled = false;
                }

                const radioChangeHandler = (ev) => {
                    const tgt = ev.target;
                    if (!tgt) return;
                    const parentWrapper = tgt.closest && tgt.closest('.ant-radio-wrapper');
                    if (parentWrapper && !parentWrapper.hasAttribute('data-ctg-custom-option')) {
                        clearCustomSelectionVisuals();
                    }
                };
                radioGroup.addEventListener('click', radioChangeHandler, true);
                radioGroup.addEventListener('change', radioChangeHandler, true);

                customLabel.addEventListener('click', (ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();

                    const wrappers = radioGroup.querySelectorAll('.ant-radio-wrapper');
                    wrappers.forEach(w => {
                        if (w !== customLabel) {
                            w.classList.remove('ant-radio-wrapper-checked');
                            const r = w.querySelector('.ant-radio');
                            if (r) r.classList.remove('ant-radio-checked');
                            try { const inp = w.querySelector('input.ant-radio-input'); if (inp) inp.checked = false; } catch (e) {}
                        }
                    });

                    customLabel.classList.add('ant-radio-wrapper-checked');
                    const r = customLabel.querySelector('.ant-radio');
                    if (r) r.classList.add('ant-radio-checked');
                    try { customInput.checked = true; } catch (e) {}

                    window.__ctg_temp_enabled = true;

                    if (countSpan) {
                        updateCountSpan(countSpan);
                        countSpan.style.display = 'inline';
                    }
                });

                if (textSpan) {
                    let pressTimer = null;
                    const startPress = (e) => {
                        if (pressTimer) clearTimeout(pressTimer);
                        pressTimer = setTimeout(() => { showPanel(); }, 600);
                    };
                    const cancelPress = () => { if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; } };
                    textSpan.addEventListener('mousedown', (e) => { e.stopPropagation(); startPress(e); });
                    document.addEventListener('mouseup', cancelPress);
                    textSpan.addEventListener('touchstart', (e) => { e.stopPropagation(); startPress(e); }, {passive: true});
                    document.addEventListener('touchend', cancelPress);
                    document.addEventListener('touchcancel', cancelPress);
                }

                const storageHandler = () => updateCountSpan(countSpan);
                window.addEventListener('ctg-storage-updated', storageHandler);
                window.addEventListener('storage', (ev) => { if (ev.key === STORAGE_KEY) storageHandler(); });

                const modalObserver = new MutationObserver(() => {
                    const stillInDOM = document.body.contains(modalEl);
                    if (!stillInDOM) {
                        window.__ctg_temp_enabled = false;
                        try {
                            const leftovers = document.querySelectorAll('[data-ctg-custom-option]');
                            leftovers.forEach(el => el.remove());
                        } catch (e) {}
                        try {
                            const leftoverInputs = document.querySelectorAll('input.ant-radio-input[value="ctg_custom"]');
                            leftoverInputs.forEach(i => { try { i.checked = false; } catch (e) {} });
                        } catch (e) {}
                        modalObserver.disconnect();
                        try {
                            radioGroup.removeEventListener('click', radioChangeHandler, true);
                            radioGroup.removeEventListener('change', radioChangeHandler, true);
                            window.removeEventListener('ctg-storage-updated', storageHandler);
                        } catch (e) {}
                    }
                });
                modalObserver.observe(document.body, { childList: true, subtree: true });

            } catch (e) {
                console.warn('注入自定义标题库失败：', e);
            }
        }

        const observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.addedNodes && m.addedNodes.length > 0) {
                    for (const node of m.addedNodes) {
                        if (!(node instanceof HTMLElement)) continue;
                        if (node.matches && node.matches('.ant-modal-content')) {
                            injectIntoModal(node);
                        } else {
                            const modal = node.querySelector && node.querySelector('.ant-modal-content');
                            if (modal) injectIntoModal(modal);
                        }
                    }
                }
                if (m.type === 'childList') {
                    const modals = document.querySelectorAll('.ant-modal-content');
                    modals.forEach(modalEl => { try { injectIntoModal(modalEl); } catch (e) {} });
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        setTimeout(() => {
            const modals = document.querySelectorAll('.ant-modal-content');
            modals.forEach(modalEl => { try { injectIntoModal(modalEl); } catch (e) {} });
        }, 200);
    }

    // SPA 路由监听
    function isTargetRoute() {
        try { return (location.hash || '').startsWith('#/new_running_task'); } catch (e) { return false; }
    }
    function setupRouteChangeListener() {
        if (window.__ctg_route_hooked) return;
        window.__ctg_route_hooked = true;
        const _pushState = history.pushState;
        const _replaceState = history.replaceState;
        history.pushState = function() { const res = _pushState.apply(this, arguments); window.dispatchEvent(new Event('locationchange')); return res; };
        history.replaceState = function() { const res = _replaceState.apply(this, arguments); window.dispatchEvent(new Event('locationchange')); return res; };
        window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
        window.addEventListener('hashchange', () => window.dispatchEvent(new Event('locationchange')));
        window.addEventListener('locationchange', () => {
            if (isTargetRoute()) setTimeout(() => observeModalAndInjectOption(), 200);
        });
    }

    // init
    function init() {
        hookFetch();
        hookXHR();
        setupRouteChangeListener();
        observeModalAndInjectOption();
        window.__ctg_openPanel = showPanel;
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') init();
    else window.addEventListener('DOMContentLoaded', init);

})();