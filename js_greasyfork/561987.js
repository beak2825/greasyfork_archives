// ==UserScript==
// @name         Sa鸭子注册助手
// @namespace    http://tampermonkey.net/
// @version      9.1
// @description  增加防丢失功能开关(默认关闭)，优化性能，事件驱动响应
// @author       Gemini
// @license      MIT
// @match        https://saduck.top/*
// @connect      api.mail.tm
// @connect      saduck.top
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @grant        GM_notification
// @grant        window.onurlchange
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561987/Sa%E9%B8%AD%E5%AD%90%E6%B3%A8%E5%86%8C%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561987/Sa%E9%B8%AD%E5%AD%90%E6%B3%A8%E5%86%8C%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 常量与配置
    // ==========================================
    const TARGET_PATH = "/my/personalCenter.html";
    const DB_KEY = "saduck_recent_accounts";
    const SETTING_KEY_ANTILOST = "saduck_setting_antilost"; // 存储防丢失设置
    const EXPIRE_MS = 3 * 24 * 60 * 60 * 1000;

    // ==========================================
    // 账号管理器
    // ==========================================
    const AccountManager = {
        save: function(email, password) {
            let accounts = GM_getValue(DB_KEY, []);
            const idx = accounts.findIndex(a => a.email === email);
            if (idx > -1) {
                accounts[idx].time = Date.now();
                accounts[idx].password = password;
            } else {
                accounts.push({ email, password, time: Date.now() });
            }
            GM_setValue(DB_KEY, accounts);
        },
        delete: function(email) {
            let accounts = GM_getValue(DB_KEY, []);
            const newAcc = accounts.filter(acc => acc.email !== email);
            GM_setValue(DB_KEY, newAcc);
        },
        getList: function() {
            let accounts = GM_getValue(DB_KEY, []);
            const valid = accounts.filter(acc => (Date.now() - acc.time) < EXPIRE_MS);
            if(valid.length !== accounts.length) GM_setValue(DB_KEY, valid);
            return valid.reverse();
        }
    };

    const CONFIG = {
        sendCodeApiUrl: "https://saduck.top/api/code/register",
        regPassword: "TempUser123!",
        selectors: {
            box: '.login-box',
            title: '.title',
            email: 'input[name="email"]',
            password: 'input[name="password"]',
            code: 'input.code-input',
            submitBtn: 'button.submit-btn, button.el-button--submit',
            switchLoginType: '.switch-type',
            profileHeader: '.profile-header1',
            userEmail: '.profile-header1 h2',
            logoutBtn: 'button.logout-btn',
            expireDateEl: '.user-info .value',
            expiredTag: '.membership-nottag'
        }
    };

    // ==========================================
    // UI 面板
    // ==========================================
    function createPanel() {
        if(document.getElementById('helper_panel_root')) return;

        // 读取防丢失设置 (默认 false)
        const isAntiLostOn = GM_getValue(SETTING_KEY_ANTILOST, false);
        const toggleColor = isAntiLostOn ? '#67C23A' : '#666';
        const toggleTitle = isAntiLostOn ? '防丢失: 已开启' : '防丢失: 已关闭';

        const div = document.createElement('div');
        div.id = 'helper_panel_root';
        div.style.display = 'none';

        div.style.cssText = `
            position: fixed; top: 15%; right: 20px; z-index: 999999;
            background: rgba(20, 20, 20, 0.98);
            backdrop-filter: blur(10px);
            padding: 18px; border-radius: 12px; color: #fff; width: 260px;
            font-family: -apple-system, sans-serif;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
            transition: opacity 0.3s ease;
        `;

        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:10px;">
                <span style="font-weight:700; font-size:16px; color:#fff;">⚡ 自动助手 Pro</span>
                <div style="display:flex; align-items:center;">
                    <span id="anti_lost_toggle" title="${toggleTitle}" style="
                        cursor:pointer;
                        color:${toggleColor};
                        font-size:14px;
                        margin-right:12px;
                        border:1px solid ${toggleColor};
                        padding:2px 6px;
                        border-radius:4px;
                        transition: all 0.2s;
                    ">🛡️</span>
                    <span id="close_panel_btn" style="cursor:pointer; color:#bbb; font-size:20px;">×</span>
                </div>
            </div>

            <div style="background:rgba(255,255,255,0.08); border-radius:6px; padding:10px; margin-bottom:15px;">
                <div style="font-size:12px; color:#ccc; margin-bottom:4px;">当前状态：</div>
                <div id="panel_status_text" style="font-size:13px; font-weight:bold; color:#F56C6C; line-height:1.4;">🔴 待机中</div>
            </div>

            <div id="account_selector_box" style="display:none; margin-bottom:15px;">
                <div style="font-size:12px; color:#ccc; margin-bottom:4px;">选择账号：</div>
                <select id="saved_account_select" style="width: 100%; padding: 8px; background: #333; border: 1px solid #555; color: #fff; border-radius: 4px; font-size: 13px; outline: none;"></select>
            </div>

            <div id="status_log" style="font-size:12px; color:#E6A23C; margin-bottom:15px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                请打开弹窗
            </div>

            <button id="action_btn" style="
                background: #555; color: #ffffff; border: 1px solid rgba(255,255,255,0.1);
                padding: 12px 0; width: 100%; border-radius: 8px; font-weight: 700; font-size: 15px;
                cursor: not-allowed; opacity: 1; text-shadow: 0 1px 2px rgba(0,0,0,0.5);
                transition: background 0.2s;
            " disabled>等待操作...</button>
        `;

        (document.body || document.documentElement).appendChild(div);

        // 事件绑定
        document.getElementById('action_btn').onclick = handleAction;
        document.getElementById('close_panel_btn').onclick = () => {
            div.style.display = 'none';
            div.dataset.manualClose = "true";
        };
        document.getElementById('anti_lost_toggle').onclick = toggleAntiLost;

        handleUrlChange(window.location.href);
    }

    // ==========================================
    // 功能逻辑：防丢失开关
    // ==========================================
    function toggleAntiLost() {
        const current = GM_getValue(SETTING_KEY_ANTILOST, false);
        const newState = !current;
        GM_setValue(SETTING_KEY_ANTILOST, newState);

        // 更新UI
        const btn = document.getElementById('anti_lost_toggle');
        if(btn) {
            btn.style.color = newState ? '#67C23A' : '#666';
            btn.style.borderColor = newState ? '#67C23A' : '#666';
            btn.title = newState ? '防丢失: 已开启' : '防丢失: 已关闭';

            // 提示用户
            const logEl = document.getElementById('status_log');
            if(logEl) logEl.innerText = newState ? "🛡️ 防丢失模式: ON" : "🛡️ 防丢失模式: OFF";
        }
    }

    // ==========================================
    // 核心监听
    // ==========================================
    if (window.onurlchange === null) {
        window.addEventListener('urlchange', (info) => handleUrlChange(info.url));
    }

    function handleUrlChange(url) {
        const panel = document.getElementById('helper_panel_root');
        if (!panel) return;

        // 如果用户之前只是在当前页手动关闭了，换页面（只要符合目标）还是会显示
        panel.dataset.manualClose = "false";

        if (url.includes(TARGET_PATH)) {
            panel.style.display = 'block';
        } else {
            panel.style.display = 'none';
        }
    }

    let currentMode = 'idle';

    function getVisibleBox() {
        const boxes = Array.from(document.querySelectorAll(CONFIG.selectors.box));
        return boxes.find(box => box.offsetParent !== null && box.style.display !== 'none');
    }

    function updateAccountSelect() {
        const select = document.getElementById('saved_account_select');
        const list = AccountManager.getList();
        select.innerHTML = '';
        if (list.length === 0) {
            select.appendChild(new Option("无可用账号", ""));
            return false;
        }
        list.forEach(acc => {
            const timeStr = new Date(acc.time).toLocaleString().split(' ')[0];
            const opt = new Option(`${acc.email.substring(0, 10)}... (${timeStr})`, JSON.stringify(acc));
            select.appendChild(opt);
        });
        return true;
    }

    function checkVipAndClean() {
        const profile = document.querySelector(CONFIG.selectors.profileHeader);
        if (!profile) return false;
        const emailEl = document.querySelector(CONFIG.selectors.userEmail);
        const currentEmail = emailEl ? emailEl.innerText.trim() : null;
        let isExpired = false;
        const notTags = Array.from(document.querySelectorAll(CONFIG.selectors.expiredTag));
        if (notTags.some(t => t.innerText.includes('已过期') && t.style.display !== 'none')) isExpired = true;
        if (!isExpired) {
            const dateEl = document.querySelector(CONFIG.selectors.expireDateEl);
            if (dateEl) {
                const dateStr = dateEl.getAttribute('title');
                if (dateStr && new Date(dateStr).getTime() < Date.now()) isExpired = true;
            }
        }
        if (isExpired) {
            const statusText = document.getElementById('panel_status_text');
            const logEl = document.getElementById('status_log');
            if(statusText) statusText.innerHTML = '<span style="color:#F56C6C">❌ VIP已过期</span>';
            if(logEl) logEl.innerText = "正在清理并退出...";
            if(currentEmail) AccountManager.delete(currentEmail);
            const logoutBtn = document.querySelector(CONFIG.selectors.logoutBtn);
            if(logoutBtn) {
                GM_notification({ title: "账号清理", text: `账号 ${currentEmail} 已过期`, timeout: 3000 });
                setTimeout(() => logoutBtn.click(), 800);
            }
            return true;
        }
        return false;
    }

    // DOM 状态监测循环
    function startDomWatcher() {
        setInterval(() => {
            const panel = document.getElementById('helper_panel_root');
            if (!panel || panel.style.display === 'none') return; // 面板隐藏时不工作

            const btn = document.getElementById('action_btn');
            const statusText = document.getElementById('panel_status_text');
            const logEl = document.getElementById('status_log');
            const selectBox = document.getElementById('account_selector_box');

            if(btn.getAttribute('data-running') === 'true') return;

            if (checkVipAndClean()) return;

            const box = getVisibleBox();
            if (box) {
                const titleEl = box.querySelector(CONFIG.selectors.title);
                const titleText = titleEl ? titleEl.innerText.trim() : "";

                if (titleText.includes("注册")) {
                    currentMode = 'register';
                    selectBox.style.display = 'none';
                    if(statusText.innerText !== '🟢 注册模式') {
                        statusText.innerHTML = '<span style="color:#67C23A">🟢 注册模式</span>';
                        logEl.innerText = "👋 准备就绪";
                        btn.disabled = false;
                        btn.innerText = "⚡ 一键注册";
                        btn.style.background = "#409EFF";
                        btn.style.borderColor = "#409EFF";
                        btn.style.cursor = "pointer";
                    }
                } else if (titleText.includes("登录")) {
                    currentMode = 'login';
                    selectBox.style.display = 'block';
                    const hasAccounts = updateAccountSelect();
                    if(statusText.innerText !== '🔵 登录模式') {
                        statusText.innerHTML = '<span style="color:#409EFF">🔵 登录模式</span>';
                        if(hasAccounts) {
                            logEl.innerText = "👇 选择账号自动登录";
                            btn.disabled = false;
                            btn.innerText = "🚀 自动登录";
                            btn.style.background = "#67C23A";
                            btn.style.borderColor = "#67C23A";
                            btn.style.cursor = "pointer";
                        } else {
                            logEl.innerText = "⚠️ 无可用账号";
                            btn.disabled = true;
                            btn.innerText = "无可用账号";
                            btn.style.background = "#555";
                            btn.style.cursor = "not-allowed";
                        }
                    }
                }
            } else {
                currentMode = 'idle';
                if (document.querySelector(CONFIG.selectors.profileHeader)) {
                     statusText.innerHTML = '<span style="color:#67C23A">✅ VIP监控中</span>';
                     logEl.innerText = "账号状态正常";
                     btn.disabled = true;
                     btn.innerText = "监控运行中...";
                     btn.style.background = "#333";
                     selectBox.style.display = 'none';
                } else {
                    if(!statusText.innerText.includes('待机')) {
                        statusText.innerHTML = '<span style="color:#F56C6C">🔴 待机中</span>';
                        logEl.innerText = "请打开弹窗";
                        btn.disabled = true;
                        btn.innerText = "等待操作...";
                        btn.style.background = "#555";
                        selectBox.style.display = 'none';
                    }
                }
            }
        }, 800);
    }

    function handleAction() {
        if (currentMode === 'register') runRegisterProcess();
        else if (currentMode === 'login') runLoginProcess();
    }

    function log(msg) {
        const el = document.getElementById('status_log');
        if(el) el.innerText = msg;
    }

    // 基础工具
    const MailTm = {
        baseUrl: "https://api.mail.tm",
        token: "",
        address: "",
        request: function(method, path, data, auth = false) {
            return new Promise((resolve, reject) => {
                const headers = { "Content-Type": "application/json" };
                if (auth && this.token) headers["Authorization"] = `Bearer ${this.token}`;
                GM_xmlhttpRequest({
                    method: method, url: this.baseUrl + path, headers: headers,
                    data: data ? JSON.stringify(data) : null,
                    onload: (res) => {
                        if (res.status >= 200 && res.status < 300) {
                            try { resolve(JSON.parse(res.responseText)); } catch(e) { resolve(res.responseText); }
                        } else { reject(`Mail Error: ${res.status}`); }
                    },
                    onerror: () => reject("网络错误")
                });
            });
        },
        init: async function() {
            const domains = await this.request("GET", "/domains");
            const domain = domains['hydra:member'][0].domain;
            const username = "u" + Math.random().toString(36).substring(2, 9);
            const password = "Pwd" + Math.random().toString(36).substring(2, 9);
            this.address = `${username}@${domain}`;
            await this.request("POST", "/accounts", { address: this.address, password: password });
            const tokenRes = await this.request("POST", "/token", { address: this.address, password: password });
            this.token = tokenRes.token;
            return this.address;
        },
        getLatestCode: async function() {
            const msgs = await this.request("GET", "/messages?page=1", null, true);
            const list = msgs['hydra:member'];
            if (list && list.length > 0) {
                const mailDetail = await this.request("GET", `/messages/${list[0].id}`, null, true);
                const text = mailDetail.text || mailDetail.intro || "";
                const m = text.match(/\b\d{4,6}\b/);
                return m ? m[0] : null;
            }
            return null;
        }
    };

    function smartFill(selector, value, contextBox) {
        if (!contextBox) return false;
        const el = contextBox.querySelector(selector);
        if (!el) return false;
        el.click();
        el.focus();
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        if (setter) setter.call(el, value);
        else el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
    }

    async function runRegisterProcess() {
        const box = getVisibleBox();
        const btn = document.getElementById('action_btn');
        const statusText = document.getElementById('panel_status_text');

        btn.setAttribute('data-running', 'true');
        btn.disabled = true;
        btn.innerText = "⏳ 注册中...";
        btn.style.background = '#E6A23C';
        btn.style.borderColor = '#E6A23C';

        try {
            log("📧 获取邮箱...");
            const email = await MailTm.init();
            smartFill(CONFIG.selectors.email, email, box);
            await new Promise(r => setTimeout(r, 200));
            smartFill(CONFIG.selectors.password, CONFIG.regPassword, box);

            log("📡 请求验证码...");
            const apiRes = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST", url: CONFIG.sendCodeApiUrl,
                    headers: { "Content-Type": "application/json;charset=UTF-8" },
                    data: JSON.stringify({ "email": email }),
                    onload: (res) => resolve(res.responseText),
                    onerror: () => reject("网络错误")
                });
            });
            const resJson = JSON.parse(apiRes);
            if (resJson.code !== 0) throw new Error(resJson.message || "拒绝");

            let code = null;
            let attempts = 0;
            while (attempts < 20) {
                attempts++;
                log(`📩 收信中 (${attempts}s)...`);
                await new Promise(r => setTimeout(r, 2000));
                try { code = await MailTm.getLatestCode(); if (code) break; } catch(e) {}
            }

            if (!code) throw new Error("验证码超时");
            smartFill(CONFIG.selectors.code, code, box);

            const submitBtn = box.querySelector(CONFIG.selectors.submitBtn);
            if(submitBtn) {
                log("🎉 提交中...");
                await new Promise(r => setTimeout(r, 500));
                submitBtn.click();
                AccountManager.save(email, CONFIG.regPassword);
                GM_notification({ title: "注册成功", text: "账号已保存", timeout: 3000 });
                statusText.innerHTML = '<span style="color:#67C23A">✅ 注册成功</span>';
                btn.removeAttribute('data-running');
                btn.innerText = "✅ 完成 (自动隐藏)";
                btn.style.background = '#67C23A';
                btn.style.borderColor = '#67C23A';
                setTimeout(() => {
                    document.getElementById('helper_panel_root').style.display = 'none';
                    document.getElementById('helper_panel_root').dataset.manualClose = "true";
                }, 2000);
            } else { throw new Error("无按钮"); }
        } catch (e) {
            log(`❌ ${e.message}`);
            btn.removeAttribute('data-running');
            btn.disabled = false;
            btn.innerText = "重试";
        }
    }

    async function runLoginProcess() {
        const box = getVisibleBox();
        const btn = document.getElementById('action_btn');
        const select = document.getElementById('saved_account_select');
        let account = null;
        try { account = JSON.parse(select.value); } catch(e) { log("❌ 未选择账号"); return; }
        btn.setAttribute('data-running', 'true');
        btn.innerText = "⏳ 登录中...";
        try {
            let passInput = box.querySelector(CONFIG.selectors.password);
            if (!passInput || passInput.offsetParent === null) {
                const switchBtn = box.querySelector(CONFIG.selectors.switchLoginType);
                if(switchBtn) { switchBtn.click(); await new Promise(r => setTimeout(r, 300)); }
            }
            smartFill(CONFIG.selectors.email, account.email, box);
            await new Promise(r => setTimeout(r, 100));
            smartFill(CONFIG.selectors.password, account.password, box);
            const submitBtn = box.querySelector(CONFIG.selectors.submitBtn);
            if(submitBtn) {
                log("🚀 登录中...");
                await new Promise(r => setTimeout(r, 300));
                submitBtn.click();
                setTimeout(() => {
                    btn.removeAttribute('data-running');
                    document.getElementById('helper_panel_root').style.display = 'none';
                }, 1000);
            } else { throw new Error("无按钮"); }
        } catch(e) {
            log("❌ " + e.message);
            btn.removeAttribute('data-running');
            btn.disabled = false;
            btn.innerText = "重试";
        }
    }

    // 启动
    setTimeout(createPanel, 500);

    // ==========================================
    // 防丢失循环 (仅在开关开启时运行)
    // ==========================================
    setInterval(() => {
        // 1. 检查开关状态
        const isAntiLostOn = GM_getValue(SETTING_KEY_ANTILOST, false);
        if (!isAntiLostOn) return;

        // 2. 如果开启，且面板丢失，则重建
        if (!document.getElementById('helper_panel_root')) {
            createPanel();
        }
    }, 1500);

    startDomWatcher();

})();