// ==UserScript==
// @name         ChatGPT 账单管理/取消续订（独立版）
// @namespace    http://tampermonkey.net/
// @version      5.3
// @description  利用 GM_xmlhttpRequest 突破 CORS 限制，支持全网手动管理账号
// @author       ChatGPT指导员V：chatgpt4v
// @license      MIT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      chatgpt.com
// @downloadURL https://update.greasyfork.org/scripts/557847/ChatGPT%20%E8%B4%A6%E5%8D%95%E7%AE%A1%E7%90%86%E5%8F%96%E6%B6%88%E7%BB%AD%E8%AE%A2%EF%BC%88%E7%8B%AC%E7%AB%8B%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557847/ChatGPT%20%E8%B4%A6%E5%8D%95%E7%AE%A1%E7%90%86%E5%8F%96%E6%B6%88%E7%BB%AD%E8%AE%A2%EF%BC%88%E7%8B%AC%E7%AB%8B%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // API 基础路径
    const BASE_URL = "https://chatgpt.com";
    const CANCEL_API_PATH = `${BASE_URL}/backend-api/subscriptions/cancel`;
    const PORTAL_API_PATH = `${BASE_URL}/backend-api/payments/customer_portal`;
    const SESSION_API_PATH = `${BASE_URL}/api/auth/session`;

    // =========================================================================
    // 缓存变量
    // =========================================================================
    let var_TokenOnly = null;
    let var_CancelData = null;
    let var_FullJson = null;

    // 注入样式 (保持不变)
    const style = document.createElement('style');
    style.innerHTML = `
    /* ========================== UI 样式 ========================== */
    #gpt-tool-trigger {
        position: fixed; top: 50%; right: 0; transform: translateY(-50%);
        background: #212121; color: rgba(255, 255, 255, 0.9);
        padding: 10px 12px; border-radius: 12px 0 0 12px;
        border: 1px solid rgba(255, 255, 255, 0.1); border-right: none;
        cursor: pointer; z-index: 2147483647;
        font-size: 20px;
        box-shadow: -2px 0 10px rgba(0,0,0,0.3);
        transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    #gpt-tool-trigger:hover { padding-right: 18px; background: #2a2a2a; }

    .gpt-tool-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: transparent; z-index: 10000; display: block;
    }

    .gpt-tool-modal {
        position: fixed; top: 50%; right: 70px;
        transform: translateY(-50%) scale(0.95);
        background: rgba(33, 33, 33, 0.98);
        backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px;
        width: 320px; padding: 24px 20px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        text-align: center; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
        opacity: 0; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        transform-origin: right center;
    }
    .gpt-tool-modal.active { opacity: 1; transform: translateY(-50%) scale(1); }
    .gpt-btn-group { display: flex; flex-direction: column; gap: 14px; width: 100%; }

    .gpt-tool-btn {
        background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 18px; padding: 14px; font-size: 14px; font-weight: 700;
        cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        color: #fff; display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .gpt-tool-btn:hover {
        background: rgba(255, 255, 255, 0.12); border-color: rgba(255, 255, 255, 0.25); transform: scale(1.02);
    }

    .gpt-textarea {
        width: 100%; height: 120px; background: rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
        color: #eee; padding: 10px; font-size: 12px; resize: none;
        margin-bottom: 10px; outline: none; box-sizing: border-box;
    }
    .gpt-textarea:focus { border-color: #10a37f; }

    .grad-manage { background-image: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 0 5px rgba(0, 242, 254, 0.2)); }
    .grad-cancel { background-image: linear-gradient(135deg, #FF512F 0%, #DD2476 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 0 5px rgba(221, 36, 118, 0.25)); }
    .grad-token { background-image: linear-gradient(135deg, #E2B0FF 0%, #9F44D3 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 0 5px rgba(159, 68, 211, 0.3)); }
    .grad-json { background-image: linear-gradient(135deg, #42e695 0%, #3bb2b8 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 0 5px rgba(66, 230, 149, 0.2)); }

    .gpt-divider { display: flex; align-items: center; justify-content: center; margin: 6px 0; color: rgba(255,255,255,0.3); font-size: 12px; font-weight: 500; }
    .gpt-divider::before, .gpt-divider::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); }
    .gpt-divider::before { margin-right: 12px; } .gpt-divider::after { margin-left: 12px; }

    .gpt-toast {
        position: fixed; bottom: 30px; right: 30px;
        background: #212121;
        color: #fff;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10002;
        transform: translateY(100px);
        transition: transform 0.3s ease;
        opacity: 0; white-space: pre-wrap;
    }
    .gpt-toast.success-green { background: #10a37f; border: none; box-shadow: 0 4px 15px rgba(16, 163, 127, 0.4); font-weight: 500; }
    .gpt-toast.error { background: #cf2e2e; }
    .gpt-toast.show { transform: translateY(0); opacity: 1; }
    `;
    document.head.appendChild(style);

    // =========================================================================
    // 核心黑科技：GM_xmlhttpRequest 封装
    // =========================================================================
    function gmFetch(url, options = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method || "GET",
                url: url,
                headers: options.headers || {},
                data: options.body,
                responseType: 'text', // 默认返回文本，手动 parse
                onload: (response) => {
                    // 模拟标准 fetch 的 response 对象
                    resolve({
                        ok: response.status >= 200 && response.status < 300,
                        status: response.status,
                        statusText: response.statusText,
                        text: () => Promise.resolve(response.responseText),
                        json: () => {
                            try { return Promise.resolve(JSON.parse(response.responseText)); }
                            catch (e) { return Promise.reject(e); }
                        }
                    });
                },
                onerror: (err) => reject(new Error("GM_XHR Error: " + err.error))
            });
        });
    }

    // =========================================================================
    // 初始化逻辑
    // =========================================================================
    const tryInitButton = () => {
        if (document.getElementById('gpt-tool-trigger')) return;
        if (!document.body) return;
        const triggerBtn = document.createElement('div');
        triggerBtn.id = 'gpt-tool-trigger';
        triggerBtn.innerText = '🛠️';
        triggerBtn.onclick = showModal;
        document.body.appendChild(triggerBtn);
    };

    tryInitButton();
    window.addEventListener('load', tryInitButton);
    setInterval(tryInitButton, 1500);

    // 数据预加载 (自动获取在非官网依旧很难，但我们还是尝试一下)
    async function preLoadAllData(needNotify = false) {
        if (var_TokenOnly && var_CancelData && var_FullJson) return true;
        if (window.location.hostname.includes("chatgpt.com") && needNotify) {
            showToast("🚀 正在预加载 Token 数据...", 'green', 1000);
        }

        try {
            // 使用标准 fetch (仅在官网有效，因为需要 Cookie)
            // 如果在非官网，这一步通常会失败，或者拿到空数据
            let fetchFunc = window.fetch;
            if (!window.location.hostname.includes("chatgpt.com")) {
                 // 非官网即使 via GM_xhr 也难带上 httpOnly cookie，所以这里静默失败是预期的
                 return false;
            }

            const r = await fetchFunc(SESSION_API_PATH);
            if (!r.ok) throw new Error("Network response was not ok");
            const d = await r.json();
            if (d.accessToken) var_TokenOnly = d.accessToken;
            if (d.accessToken && d.account && d.account.id) var_CancelData = { token: d.accessToken, accountId: d.account.id };
            var_FullJson = d;
            return true;
        } catch (e) {
            if (needNotify && window.location.hostname.includes("chatgpt.com")) {
                showToast("❌ 数据预加载失败", 'error');
            }
            return false;
        }
    }

    function showModal() {
        preLoadAllData(false);
        if (document.querySelector('.gpt-tool-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'gpt-tool-overlay';
        const modal = document.createElement('div');
        modal.className = 'gpt-tool-modal';
        const btnGroup = document.createElement('div');
        btnGroup.className = 'gpt-btn-group';
        btnGroup.id = 'gpt-main-menu';

        buildMainMenu(btnGroup, overlay, modal);

        overlay.onclick = (e) => {
            if (e.target === overlay) {
                modal.classList.remove('active');
                setTimeout(() => document.body.removeChild(overlay), 200);
            }
        };

        modal.appendChild(btnGroup);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        requestAnimationFrame(() => modal.classList.add('active'));
    }

    // =========================================================================
    // 菜单系统
    // =========================================================================
    function buildMainMenu(container, overlay, modal) {
        container.innerHTML = '';
        container.appendChild(createDivider("支付订阅 / 账单管理"));
        container.appendChild(createBtn(`💳 <span class="grad-manage">账单订阅管理 (Billing)</span>`, "btn-portal", () => showBillingOptions(container, overlay)));
        container.appendChild(createBtn(`🚫 <span class="grad-cancel">取消自动续费 (Cancel)</span>`, "btn-cancel", () => showCancelMenu(container, overlay)));

        container.appendChild(createDivider("开发者选项"));
        container.appendChild(createBtn(`🔑 <span class="grad-token">复制Access Token(Single)</span>`, "btn-token", () => handleCopyToken(overlay)));
        container.appendChild(createBtn(`📤 <span class="grad-json">Copy All Data (Full JSON)</span>`, "btn-data", () => handleCopyFullJson(overlay)));
    }

    // 账单菜单
    function showBillingOptions(container, overlay) {
        container.innerHTML = '';
        container.appendChild(createDivider("选择账户数据来源"));
        container.appendChild(createBtn(`🤖 当前账号Token(自动)`, "btn-portal", async () => {
            document.body.removeChild(overlay);
            let token = var_TokenOnly;
            if (!token) {
                showToast("⌛ 获取 Token 中...", 'green');
                await preLoadAllData(true);
                token = var_TokenOnly;
            }
            // 自动模式下，如果是在百度点这个按钮，肯定拿不到 Token
            if (!token) return showToast("❌ 获取失败 (非官网请用手动模式)", 'error');
            openBillingPortal(token);
        }));
        container.appendChild(createBtn(`✍️ 其他账号 Json (手动)`, "btn-data", () => {
            showBillingManualInput(container, overlay);
        }));
        container.appendChild(createBtn(`⬅️ 返回`, "btn-back", () => buildMainMenu(container, overlay)));
    }

    // 账单手动
    function showBillingManualInput(container, overlay) {
        container.innerHTML = '';
        container.appendChild(createDivider("请粘贴完整 JSON 数据"));
        const textarea = document.createElement('textarea');
        textarea.className = 'gpt-textarea';
        textarea.placeholder = '在此粘贴 {"user": {...}, "accessToken": "..."} ...';
        container.appendChild(textarea);
        container.appendChild(createBtn(`✅ 提取并跳转 (Submit)`, "btn-portal", () => {
            const rawJson = textarea.value.trim();
            try {
                const data = JSON.parse(rawJson);
                const token = data.accessToken;
                if (!token) return showToast("❌ JSON 中未找到 accessToken", 'error');
                showToast(`✅ Token 提取成功! 跨域请求中...`, 'green');
                document.body.removeChild(overlay);
                openBillingPortal(token);
            } catch (e) { showToast("❌ JSON 格式错误", 'error'); }
        }));
        container.appendChild(createBtn(`⬅️ 返回`, "btn-back", () => showBillingOptions(container, overlay)));
    }

    // 取消菜单
    function showCancelMenu(container, overlay) {
        container.innerHTML = '';
        container.appendChild(createDivider("选择账户数据来源"));
        container.appendChild(createBtn(`🤖 当前账号Token(自动)`, "btn-cancel", () => {
            document.body.removeChild(overlay);
            handleCancelSubscription();
        }));
        container.appendChild(createBtn(`✍️ 其他账号 Json (手动)`, "btn-data", () => {
            showCancelManualInput(container, overlay);
        }));
        container.appendChild(createBtn(`⬅️ 返回`, "btn-back", () => buildMainMenu(container, overlay)));
    }

    // 取消手动
    function showCancelManualInput(container, overlay) {
        container.innerHTML = '';
        container.appendChild(createDivider("请粘贴 JSON 以取消订阅"));
        const textarea = document.createElement('textarea');
        textarea.className = 'gpt-textarea';
        textarea.placeholder = '在此粘贴 {"user": {...}, "accessToken": "..."} ...';
        container.appendChild(textarea);
        container.appendChild(createBtn(`🚫 提取并取消 (Submit)`, "btn-cancel", () => {
            const rawJson = textarea.value.trim();
            try {
                const data = JSON.parse(rawJson);
                const token = data.accessToken;
                const accountId = (data.account && data.account.id) ? data.account.id : (data.user && data.user.id ? data.user.id : null);
                if (!token || !accountId) return showToast("❌ 数据缺失", 'error');
                showToast(`✅ ID:${accountId} 提取成功!`, 'green');
                document.body.removeChild(overlay);
                handleCancelSubscription({ token, accountId });
            } catch (e) { showToast("❌ JSON 格式错误", 'error'); }
        }));
        container.appendChild(createBtn(`⬅️ 返回`, "btn-back", () => showCancelMenu(container, overlay)));
    }


    // =========================================================================
    // 核心业务函数 (全部使用 gmFetch 以支持跨域)
    // =========================================================================

    // 1. 账单管理
    function openBillingPortal(token) {
        const win = window.open('', '_blank');
        if(!win) return showToast("❌ 请允许弹窗！", 'error');
        win.opener = null;

        const baseStyle = "background:#212121;color:#e4e4e7;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;font-family:sans-serif;padding:20px;text-align:center;";
        win.document.write(`<html><head><meta name="referrer" content="no-referrer"></head><body style="${baseStyle}"><h2 style="font-weight:400;">正在建立安全连接 (GM Mode)...</h2></body></html>`);
        win.document.close();

        // 核心修改：使用 gmFetch 代替 fetch
        gmFetch(PORTAL_API_PATH, {
            headers: { "Authorization": "Bearer " + token }
        })
        .then(async r => {
            if (r.status === 401) {
                win.document.body.innerHTML = `<div style="${baseStyle}"><h2 style="color:#ff6b6b;">Token 已失效 (401)</h2></div>`;
                throw new Error("401 Token Invalid");
            }
            if (!r.ok) {
                const errText = await r.text();
                throw new Error(`HTTP Error ${r.status}`);
            }
            return r.json();
        })
        .then(res => {
            if (res.url) win.location.replace(res.url);
            else throw new Error("API返回成功但没有URL字段");
        })
        .catch((err) => {
            if (err.message === "401 Token Invalid") return;
            win.document.body.innerHTML = `<div style="${baseStyle}"><h2 style="color:#ff6b6b;">❌ 请求失败</h2><div style="background:#000;padding:15px;margin-top:10px;">${err.message}</div></div>`;
        });
    }

    // 2. 取消订阅
    async function handleCancelSubscription(explicitData = null) {
        let data = explicitData;
        if (!data) {
            data = var_CancelData;
            if (!data && window.location.hostname.includes("chatgpt.com")) {
                showToast("⌛ 同步数据...", 'green');
                await preLoadAllData(true);
                data = var_CancelData;
            }
        }

        if (!data || !data.token || !data.accountId) {
             return showToast("❌ 无法获取账户信息 (非官网请用手动模式)", 'error');
        }

        showToast(`🚀 ID:${data.accountId}...\n正在发送取消请求 (GM Mode)...`, 'green');

        try {
            // 核心修改：使用 gmFetch 代替 fetch
            const r = await gmFetch(CANCEL_API_PATH, {
                method: "POST",
                headers: { "Authorization": "Bearer " + data.token, "Content-Type": "application/json" },
                body: JSON.stringify({ account_id: data.accountId })
            });

            if (r.ok) {
                showToast("🎉 取消成功！", 'green');
                if (!explicitData && window.location.hostname.includes("chatgpt.com")) {
                    setTimeout(() => location.reload(), 2000);
                }
            } else {
                showToast(`❌ 取消失败 HTTP ${r.status}`, 'error');
            }
        } catch (e) {
            console.error(e);
            showToast("❌ 网络错误 (GM_XHR Failed)", 'error');
        }
    }

    // 3. 复制功能
    function handleCopyToken(overlay) {
        document.body.removeChild(overlay);
        const success = () => showToast("✅ Token 已复制", 'green');
        const fail = () => showToast("❌ 获取失败 (需在官网登录)", 'error');

        if (var_TokenOnly) navigator.clipboard.writeText(var_TokenOnly).then(success);
        else preLoadAllData(true).then(() => {
            if(var_TokenOnly) navigator.clipboard.writeText(var_TokenOnly).then(success);
            else fail();
        });
    }

    function handleCopyFullJson(overlay) {
        document.body.removeChild(overlay);
        const success = () => showToast("✅ JSON 已复制", 'green');
        const fail = () => showToast("❌ 获取失败 (需在官网登录)", 'error');

        if (var_FullJson) navigator.clipboard.writeText(JSON.stringify(var_FullJson)).then(success);
        else preLoadAllData(true).then(() => {
            if(var_FullJson) navigator.clipboard.writeText(JSON.stringify(var_FullJson)).then(success);
            else fail();
        });
    }

    // 辅助工具
    function createDivider(text) { const div = document.createElement('div'); div.className = 'gpt-divider'; div.innerText = text; return div; }
    function createBtn(htmlContent, className, onClick) { const btn = document.createElement('button'); btn.className = `gpt-tool-btn ${className}`; btn.innerHTML = htmlContent; btn.onclick = onClick; return btn; }
    function showToast(text, styleType = 'normal', duration = 4000) {
        const existing = document.querySelector('.gpt-toast'); if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.className = 'gpt-toast';
        if (styleType === 'error') toast.classList.add('error');
        if (styleType === 'green') toast.classList.add('success-green');
        toast.innerText = text;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => toast.remove(), duration);
    }
})();