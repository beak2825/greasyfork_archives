// ==UserScript==
// @name         小红书全量数据采集 (可视化配置版)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  采集 InitialState 和 Feed 流，支持可视化配置服务器地址及开关控制。
// @author       Gemini
// @match        https://www.xiaohongshu.com/*
// @match        https://edith.xiaohongshu.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @connect      *
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559126/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%85%A8%E9%87%8F%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86%20%28%E5%8F%AF%E8%A7%86%E5%8C%96%E9%85%8D%E7%BD%AE%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559126/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%85%A8%E9%87%8F%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86%20%28%E5%8F%AF%E8%A7%86%E5%8C%96%E9%85%8D%E7%BD%AE%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🛡️ 小红书采集 Hook (V2.0 Configurable) 已注入');

    // =========================================================
    // 1. 配置管理模块 (Storage & Defaults)
    // =========================================================
    const DEFAULT_CONFIG = {
        serverUrl: 'http://192.168.2.114:8000/receive_feed',
        enabled: true
    };

    // 获取配置
    function getConfig() {
        return {
            serverUrl: GM_getValue('xhs_server_url', DEFAULT_CONFIG.serverUrl),
            enabled: GM_getValue('xhs_hook_enabled', DEFAULT_CONFIG.enabled)
        };
    }

    // 保存配置
    function saveConfig(url, enabled) {
        GM_setValue('xhs_server_url', url);
        GM_setValue('xhs_hook_enabled', enabled);
        showToast('配置已保存，即刻生效', 'success');
    }

    // API 路径特征 (用于匹配请求)
    const TARGET_API_PART = '/api/sns/web/v1/feed';


    // =========================================================
    // 2. UI 界面系统 (设置面板 + 气泡)
    // =========================================================

    // 注入 CSS
    const css = `
        /* 气泡容器 */
        #xhs-toast-container { position: fixed; top: 20px; right: 20px; z-index: 999999; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
        .xhs-toast { min-width: 250px; max-width: 400px; padding: 12px 20px; border-radius: 8px; color: #fff; font-size: 14px; font-family: sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.15); opacity: 0; transform: translateX(20px); transition: all 0.3s ease; display: flex; align-items: center; word-break: break-all; pointer-events: auto; }
        .xhs-toast.show { opacity: 1; transform: translateX(0); }
        .xhs-toast-success { background-color: #52c41a; }
        .xhs-toast-error { background-color: #ff4d4f; }
        .xhs-toast-info { background-color: #1890ff; }
        .xhs-toast-icon { margin-right: 8px; font-size: 16px; flex-shrink: 0; }

        /* 设置按钮 (左下角) */
        #xhs-settings-btn { position: fixed; bottom: 20px; left: 20px; width: 40px; height: 40px; background: #ff2442; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 999998; box-shadow: 0 2px 10px rgba(0,0,0,0.2); transition: transform 0.2s; font-size: 20px; }
        #xhs-settings-btn:hover { transform: scale(1.1); }

        /* 设置面板 Modal */
        #xhs-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 999999; display: none; align-items: center; justify-content: center; backdrop-filter: blur(2px); }
        #xhs-modal { background: white; padding: 25px; border-radius: 12px; width: 320px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); font-family: sans-serif; }
        .xhs-field { margin-bottom: 15px; }
        .xhs-field label { display: block; margin-bottom: 5px; font-weight: bold; font-size: 14px; color: #333; }
        .xhs-input { width: 100%; padding: 8px 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; outline: none; transition: border 0.2s; }
        .xhs-input:focus { border-color: #ff2442; }

        /* 开关 Switch */
        .xhs-switch { position: relative; display: inline-block; width: 50px; height: 24px; }
        .xhs-switch input { opacity: 0; width: 0; height: 0; }
        .xhs-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px; }
        .xhs-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .xhs-slider { background-color: #ff2442; }
        input:checked + .xhs-slider:before { transform: translateX(26px); }

        .xhs-btn-row { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
        .xhs-btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; }
        .xhs-btn-cancel { background: #f0f0f0; color: #666; }
        .xhs-btn-save { background: #ff2442; color: white; }
    `;
    GM_addStyle(css);

    // 初始化 UI
    function initUI() {
        // 1. Toast 容器
        let toastContainer = document.createElement('div');
        toastContainer.id = 'xhs-toast-container';
        document.body.appendChild(toastContainer);

        // 2. 设置按钮
        let btn = document.createElement('div');
        btn.id = 'xhs-settings-btn';
        btn.innerHTML = '⚙️';
        btn.title = '小红书采集设置';
        btn.onclick = openSettings;
        document.body.appendChild(btn);

        // 3. 设置面板
        let overlay = document.createElement('div');
        overlay.id = 'xhs-modal-overlay';
        overlay.innerHTML = `
            <div id="xhs-modal">
                <h3 style="margin-top:0; margin-bottom: 20px; color:#ff2442;">采集配置</h3>

                <div class="xhs-field">
                    <label>启用采集 Hook</label>
                    <label class="xhs-switch">
                        <input type="checkbox" id="xhs-config-enable">
                        <span class="xhs-slider"></span>
                    </label>
                </div>

                <div class="xhs-field">
                    <label>服务器接收地址 (URL)</label>
                    <input type="text" id="xhs-config-url" class="xhs-input" placeholder="http://127.0.0.1:8000/...">
                </div>

                <div class="xhs-btn-row">
                    <button class="xhs-btn xhs-btn-cancel" id="xhs-btn-cancel">取消</button>
                    <button class="xhs-btn xhs-btn-save" id="xhs-btn-save">保存配置</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // 绑定事件
        document.getElementById('xhs-btn-cancel').onclick = closeSettings;
        document.getElementById('xhs-btn-save').onclick = () => {
            const url = document.getElementById('xhs-config-url').value;
            const enabled = document.getElementById('xhs-config-enable').checked;
            saveConfig(url, enabled);
            closeSettings();
        };
    }

    function openSettings() {
        const config = getConfig();
        document.getElementById('xhs-config-url').value = config.serverUrl;
        document.getElementById('xhs-config-enable').checked = config.enabled;
        document.getElementById('xhs-modal-overlay').style.display = 'flex';
    }

    function closeSettings() {
        document.getElementById('xhs-modal-overlay').style.display = 'none';
    }

    function showToast(message, type = 'info') {
        const config = getConfig();
        // 如果禁用了采集，且不是保存配置的成功提示，则不显示气泡
        if (!config.enabled && !message.includes('配置已保存')) return;

        let container = document.getElementById('xhs-toast-container');
        if(!container) return; // 页面刚加载可能还没生成

        const toast = document.createElement('div');
        toast.className = `xhs-toast xhs-toast-${type}`;
        const icons = { success: '✅', error: '❌', info: 'ℹ️' };
        toast.innerHTML = `<span class="xhs-toast-icon">${icons[type]}</span><span>${message}</span>`;

        container.appendChild(toast);
        void toast.offsetWidth; // 触发重绘
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => { if (toast.parentElement) toast.parentElement.removeChild(toast); }, 300);
        }, 5000);
    }

    // 页面加载完成后初始化 UI
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUI);
    } else {
        initUI();
    }


    // =========================================================
    // 3. 数据发送核心逻辑
    // =========================================================

    function sendData(source, payload) {
        const config = getConfig();

        // --- 核心开关控制 ---
        if (!config.enabled) {
            console.log(`🚫 [采集已禁用] 忽略 ${source} 数据`);
            return;
        }

        const wrapper = {
            source: source,
            capture_url: location.href,
            timestamp: new Date().getTime(),
            payload: payload
        };

        GM_xmlhttpRequest({
            method: "POST",
            url: config.serverUrl, // 动态使用配置的 URL
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(wrapper),
            onload: function(res) {
                if (res.status === 200) {
                    let serverMsg = 'OK';
                    try {
                        const jsonRes = JSON.parse(res.responseText);
                        serverMsg = jsonRes.msg || jsonRes.message || JSON.stringify(jsonRes);
                    } catch (e) {
                        serverMsg = res.responseText.substring(0, 100);
                    }
                    showToast(`上传成功<br/><small style="opacity:0.8; font-size:12px">服务端: ${serverMsg}</small>`, 'success');
                } else {
                    showToast(`上传失败 (${res.status})`, 'error');
                }
            },
            onerror: function(err) {
                console.error(`❌ [${source}] 连接失败`, err);
                showToast(`无法连接服务器 (检查地址)`, 'error');
            }
        });
    }


    // =========================================================
    // 4. Initial State 采集模块
    // =========================================================
    function captureInitialState() {
        let checkCount = 0;
        const timer = setInterval(() => {
            checkCount++;
            if (unsafeWindow.__INITIAL_STATE__) {
                clearInterval(timer);

                // 仅在开启时处理
                if(getConfig().enabled) {
                    showToast('捕获到 Initial State', 'info');
                    try {
                        const stateData = JSON.parse(JSON.stringify(unsafeWindow.__INITIAL_STATE__));
                        sendData('window.__INITIAL_STATE__', stateData);
                    } catch (e) {
                        console.error('❌ 解析 InitialState 失败', e);
                    }
                }
            } else if (checkCount >= 50) {
                clearInterval(timer);
            }
        }, 100);
    }
    captureInitialState();


    // =========================================================
    // 5. XHR Hook 模块
    // =========================================================
    const globalObj = unsafeWindow;
    const OriginalXHR = globalObj.XMLHttpRequest;

    class ProxyXHR extends OriginalXHR {
        constructor() {
            super();
            this._url = '';
        }
        open(method, url, async, user, password) {
            this._url = url;
            return super.open(method, url, async, user, password);
        }
        send(body) {
            // 每次请求时动态检查开关
            const config = getConfig();

            if (config.enabled && this._url && this._url.includes(TARGET_API_PART)) {
                this.addEventListener('readystatechange', () => {
                    if (this.readyState === 4 && this.status === 200) {
                        try {
                            const originalResp = this.responseText;
                            const jsonResp = JSON.parse(originalResp);

                            // 发送数据
                            sendData(TARGET_API_PART, jsonResp);

                            // 保持原始响应流
                            Object.defineProperty(this, 'responseText', { get: () => originalResp });
                            Object.defineProperty(this, 'response', { get: () => originalResp });
                        } catch (e) {
                            console.error('❌ Hook Error:', e);
                        }
                    }
                });
            }
            return super.send(body);
        }
    }
    globalObj.XMLHttpRequest = ProxyXHR;

})();