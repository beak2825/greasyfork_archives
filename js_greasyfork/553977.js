// ==UserScript==
// @name         TRIP Internal Dedicated
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Internal POST body replacement script with config UI (Search Text Readonly)
// @author       You
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553977/TRIP%20Internal%20Dedicated.user.js
// @updateURL https://update.greasyfork.org/scripts/553977/TRIP%20Internal%20Dedicated.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 默认配置
    const DEFAULT_CONFIG = {
        enabled: false,
        searchText: 'M12345678',  // 固定默认值
        replaceText: ''
    };

    // 加载配置
    function loadConfig() {
        return {
            enabled: GM_getValue('enabled', DEFAULT_CONFIG.enabled),
            searchText: GM_getValue('searchText', DEFAULT_CONFIG.searchText),  // 始终使用默认或已保存，但UI只读
            replaceText: GM_getValue('replaceText', DEFAULT_CONFIG.replaceText)
        };
    }

    // 保存配置（searchText 不保存，始终用默认）
    function saveConfig(config) {
        GM_setValue('enabled', config.enabled);
        GM_setValue('replaceText', config.replaceText);
        // searchText 不保存，固定为默认
    }

    // 通用 body 替换函数
    function replaceBody(body, searchText, replaceText) {
        if (typeof body === 'string') {
            return body.replace(searchText, replaceText);
        } else if (body instanceof FormData) {
            const newFormData = new FormData();
            for (let [key, value] of body.entries()) {
                if (typeof value === 'string' && value.includes(searchText)) {
                    value = value.replace(searchText, replaceText);
                    console.log('TRIP script: FormData value replaced');
                }
                newFormData.append(key, value);
            }
            return newFormData;
        } else if (body instanceof Blob) {
            // Blob 转字符串替换
            return new Blob([body.text().then(text => text.replace(searchText, replaceText))], { type: body.type });
        }
        return body;
    }

    // 应用拦截
    function applyInterception(config) {
        if (!config.enabled || !config.searchText) {
            console.log('TRIP script: 未启用或无查找文本，跳过拦截。');
            return;
        }

        console.log('TRIP script: 启用替换 - 查找:', config.searchText, '替换为:', config.replaceText);

        // 1. XHR 拦截（增强日志）
        try {
            const originalXHROpen = XMLHttpRequest.prototype.open;
            const originalXHRSend = XMLHttpRequest.prototype.send;

            XMLHttpRequest.prototype.open = function(method, url, ...args) {
                this._method = method;
                this._url = url;
                return originalXHROpen.apply(this, [method, url, ...args]);
            };

            XMLHttpRequest.prototype.send = function(body) {
                console.log('TRIP script: XHR 调用 - Method:', this._method, 'URL:', this._url, 'Body 类型:', typeof body);
                if (this._method === 'POST' && body && (typeof body === 'string' || body instanceof FormData) && (typeof body === 'string' ? body.includes(config.searchText) : Array.from(body.entries()).some(([k, v]) => typeof v === 'string' && v.includes(config.searchText)))) {
                    console.log('TRIP script: XHR POST 拦截成功，替换 body');
                    const newBody = replaceBody(body, config.searchText, config.replaceText);
                    return originalXHRSend.call(this, newBody);
                }
                return originalXHRSend.apply(this, arguments);
            };
        } catch (e) {
            console.warn('TRIP script: XHR patch 失败:', e.message);
        }

        // 2. Fetch 拦截（增强 + Axios 支持）
        try {
            const originalFetch = window.fetch;
            window.fetch = function(...args) {
                const url = args[0];
                let init = args[1] || {};
                console.log('TRIP script: Fetch 调用 - URL:', url, 'Method:', init.method, 'Body 类型:', typeof init.body);
                if (init.method === 'POST' && init.body && (typeof init.body === 'string' ? init.body.includes(config.searchText) : true /* 检查 FormData 等 */)) {
                    console.log('TRIP script: Fetch POST 拦截成功，替换 body');
                    init.body = replaceBody(init.body, config.searchText, config.replaceText);
                }
                return originalFetch.apply(this, args);
            };
            console.log('TRIP script: Fetch patch 应用。');
        } catch (e) {
            console.warn('TRIP script: Fetch patch 失败 (可能 CSP):', e.message);
        }

        // 3. Axios 支持（如果网站用 Axios）
        if (window.axios) {
            const originalAxios = window.axios;
            window.axios = function(config) {
                console.log('TRIP script: Axios 调用 - URL:', config.url, 'Method:', config.method);
                if (config.method === 'post' && config.data && typeof config.data === 'string' && config.data.includes(config.searchText)) {
                    console.log('TRIP script: Axios POST 拦截成功，替换 data');
                    config.data = config.data.replace(config.searchText, config.replaceText);
                }
                return originalAxios(config);
            };
            console.log('TRIP script: Axios patch 应用。');
        }

        console.log('TRIP script: 拦截已应用 (v1.8 只读版)。');
    }

    // UI 注入（查找框设为 readonly）
    function injectUI() {
        const style = document.createElement('style');
        style.textContent = `
            #trip-panel { position: fixed; top: 10px; right: 10px; width: 280px; background: #fff; border: 1px solid #ccc; border-radius: 8px; padding: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); z-index: 99999; font-family: Arial, sans-serif; font-size: 12px; }
            #trip-panel.hidden { display: none; }
            #trip-panel h3 { margin: 0 0 10px; font-size: 14px; }
            #trip-panel label { display: block; margin: 8px 0; }
            #trip-panel input[type="checkbox"] { margin-right: 5px; }
            #trip-panel input[type="text"] { width: 100%; padding: 4px; box-sizing: border-box; }
            #searchText { background-color: #f8f9fa; color: #6c757d; cursor: not-allowed; }  /* 只读样式 */
            #trip-toggle-btn { position: fixed; top: 10px; right: 10px; z-index: 100000; padding: 5px 8px; background: #ff6b6b; color: white; border: none; border-radius: 50%; cursor: pointer; font-size: 12px; }
            #trip-toggle-btn:hover { background: #ee5a5a; }
        `;
        (document.head || document.documentElement).appendChild(style);

        const panel = document.createElement('div');
        panel.id = 'trip-panel';
        panel.className = 'hidden';
        panel.innerHTML = `
            <h3>TRIP 内部专用</h3>
            <label><input type="checkbox" id="enableToggle"> 启动功能</label>
            <label>Search Text (默认: M12345678): <input type="text" id="searchText" placeholder="M12345678" value="M12345678" readonly></label>
            <label>Replace Text: <input type="text" id="replaceText" placeholder="Enter replacement"></label>
            <button id="saveBtn" style="width: 100%; padding: 6px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Save</button>
            <div style="text-align: center; margin-top: 10px; font-size: 10px; color: #666;">Status: <span id="status">Disabled</span></div>
        `;

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'trip-toggle-btn';
        toggleBtn.textContent = 'T';
        toggleBtn.title = 'TRIP Config';

        const enableToggle = panel.querySelector('#enableToggle');
        const searchText = panel.querySelector('#searchText');  // 只读，不允许修改
        const replaceText = panel.querySelector('#replaceText');
        const saveBtn = panel.querySelector('#saveBtn');
        const status = panel.querySelector('#status');

        const config = loadConfig();
        enableToggle.checked = config.enabled;
        searchText.value = DEFAULT_CONFIG.searchText;  // 固定为默认
        searchText.readOnly = true;  // 确保只读
        replaceText.value = config.replaceText;
        status.textContent = config.enabled ? 'Enabled' : 'Disabled';

        saveBtn.addEventListener('click', () => {
            const newConfig = {
                enabled: enableToggle.checked,
                searchText: DEFAULT_CONFIG.searchText,  // 固定，不变
                replaceText: replaceText.value.trim()
            };
            saveConfig(newConfig);
            status.textContent = newConfig.enabled ? 'Enabled' : 'Disabled';
            applyInterception(newConfig);
            alert('Config saved! Refresh page for full effect.');
        });

        toggleBtn.onclick = () => {
            const isHidden = panel.classList.contains('hidden');
            panel.classList.toggle('hidden');
            toggleBtn.textContent = isHidden ? 'T' : '×';
        };

        applyInterception(config);

        function appendElements() {
            if (document.body) {
                document.body.appendChild(toggleBtn);
                document.body.appendChild(panel);
                console.log('TRIP script: UI injected (v1.8 只读版)。');
            } else {
                setTimeout(appendElements, 200);
            }
        }
        setTimeout(appendElements, 500);
    }

    // 初始化
    console.log('TRIP script: v1.8 初始化中...');
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectUI);
    } else {
        injectUI();
    }

    // SPA 支持
    new MutationObserver(() => {
        const config = loadConfig();
        applyInterception(config);
    }).observe(document.documentElement, { childList: true, subtree: true });

})();