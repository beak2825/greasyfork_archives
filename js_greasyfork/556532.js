// ==UserScript==
// @name         壹速云机场自动签到 (傻瓜通用版)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  全自动后台签到。首次安装后，请在你想作为“签到主页”的网站上进行配置，之后仅在该网站运行。
// @author       You
// @connect      www.onesy1.cc
// @match        *://*/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/556532/%E5%A3%B9%E9%80%9F%E4%BA%91%E6%9C%BA%E5%9C%BA%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%20%28%E5%82%BB%E7%93%9C%E9%80%9A%E7%94%A8%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556532/%E5%A3%B9%E9%80%9F%E4%BA%91%E6%9C%BA%E5%9C%BA%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%20%28%E5%82%BB%E7%93%9C%E9%80%9A%E7%94%A8%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 防止在 iframe (网页里的广告框) 中运行，只在主窗口运行
    if (window.top !== window.self) return;

    // ================= 常量定义 =================
    const SITE_CONFIG = {
        siteUrl: "https://www.onesy1.cc",
        loginApi: "/auth/login",
        checkinApi: "/user/checkin"
    };

    const ICONS = {
        waiting: '🟠',
        success: '🟢',
        error:   '🔴',
        info:    '🔵',
        setting: '⚙️'
    };

    const PANEL_ID = 'vpn-checkin-panel-v5';
    const MODAL_ID = 'vpn-checkin-settings-modal';
    const SETUP_BTN_ID = 'vpn-setup-float-btn';

    // ================= 样式定义 =================
    GM_addStyle(`
        /* 主面板 (极致隐形风) */
        #${PANEL_ID} {
            position: fixed; top: 20px; right: 20px; z-index: 2147483647;
            background: rgba(20, 20, 20, 0.9); backdrop-filter: blur(4px);
            color: #fff; border-radius: 50px; font-size: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            display: flex; align-items: center; padding: 3px;
            border: 1px solid rgba(255,255,255,0.05); cursor: pointer;
        }
        #${PANEL_ID} .icon-box { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; margin-right: 6px; }
        #${PANEL_ID}.waiting .icon-box { background: rgba(255, 152, 0, 0.2); color: #ff9800; }
        #${PANEL_ID}.success .icon-box { background: rgba(76, 175, 80, 0.2); color: #4caf50; }
        #${PANEL_ID}.info .icon-box    { background: rgba(33, 150, 243, 0.2); color: #2196f3; }
        #${PANEL_ID}.error .icon-box   { background: rgba(244, 67, 54, 0.2);  color: #f44336; }
        
        #${PANEL_ID} .content-box { margin-right: 8px; display: flex; flex-direction: column; justify-content: center; }
        #${PANEL_ID} .status { font-weight: bold; font-size: 12px; line-height: 1; }
        
        /* 缩回模式 */
        #${PANEL_ID}.collapsed { padding: 2px; width: 28px; height: 28px; background: rgba(0,0,0,0.15); border: none; box-shadow: none; }
        #${PANEL_ID}.collapsed .icon-box { margin: 0; width: 100%; height: 100%; font-size: 12px; }
        #${PANEL_ID}.collapsed .content-box { display: none; }
        #${PANEL_ID}.collapsed:hover { width: auto; height: auto; background: rgba(20, 20, 20, 0.95); padding: 4px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
        #${PANEL_ID}.collapsed:hover .icon-box { width: 24px; height: 24px; margin-right: 6px; }
        #${PANEL_ID}.collapsed:hover .content-box { display: flex; }

        /* 初始设置按钮 (未配置时显示) */
        #${SETUP_BTN_ID} {
            position: fixed; bottom: 30px; right: 30px; z-index: 2147483647;
            background: #4caf50; color: white; padding: 10px 20px;
            border-radius: 30px; font-weight: bold; cursor: pointer;
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
            font-family: sans-serif; font-size: 14px;
            animation: vpn-pulse 2s infinite;
        }
        @keyframes vpn-pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }

        /* 设置弹窗 */
        #${MODAL_ID} { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 2147483648; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(3px); }
        #${MODAL_ID} .card { background: #2d2d2d; color: #fff; width: 320px; padding: 25px; border-radius: 12px; border: 1px solid #444; font-family: sans-serif; }
        #${MODAL_ID} h3 { margin: 0 0 15px 0; color: #4caf50; text-align: center; }
        #${MODAL_ID} .group { margin-bottom: 15px; }
        #${MODAL_ID} label { display: block; font-size: 12px; color: #aaa; margin-bottom: 5px; }
        #${MODAL_ID} input { width: 100%; padding: 10px; background: #3d3d3d; border: 1px solid #444; color: white; border-radius: 6px; box-sizing: border-box; }
        #${MODAL_ID} .tip { font-size: 11px; color: #888; margin-top: 5px; }
        #${MODAL_ID} .btn-row { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
        #${MODAL_ID} button { padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; font-weight: bold; }
        #${MODAL_ID} .save { background: #4caf50; color: white; }
        #${MODAL_ID} .cancel { background: transparent; color: #aaa; }
        #${MODAL_ID} .use-curr { font-size: 11px; color: #2196f3; cursor: pointer; float: right; margin-top: -20px; }
    `);

    // ================= 核心逻辑入口 =================
    
    // 1. 读取配置
    const config = GM_getValue('vpn_config', {});
    const currentUrl = window.location.href;
    
    // 2. 逻辑分支
    if (!config.email || !config.password || !config.homepage) {
        // 场景A: 未配置 -> 显示右下角“配置”大按钮
        showSetupButton();
    } else {
        // 场景B: 已配置 -> 检查当前网页是不是主页
        if (isHomepage(currentUrl, config.homepage)) {
            // 是主页 -> 运行签到程序
            initCheckinUI(config);
        } else {
            // 不是主页 -> 什么都不做，静默退出 (不占内存)
            return;
        }
    }

    // ================= 辅助函数 =================

    // 判断当前 URL 是否匹配用户设置的主页
    function isHomepage(current, target) {
        // 简单包含匹配，比如 target是 "baidu.com"，current是 "www.baidu.com/s?wd=1" -> 匹配
        return current.includes(target) || target.includes(current);
    }

    // 显示右下角配置按钮
    function showSetupButton() {
        const btn = document.createElement('div');
        btn.id = SETUP_BTN_ID;
        btn.innerText = "⚙️ 配置自动签到";
        btn.onclick = () => showSettings(true);
        document.body.appendChild(btn);
    }

    // 显示设置弹窗
    function showSettings(isFirstTime) {
        if (document.getElementById(MODAL_ID)) return;

        const oldConfig = GM_getValue('vpn_config', {});
        
        // 默认主页地址填入当前网址
        const defaultHome = oldConfig.homepage || window.location.hostname;

        const modal = document.createElement('div');
        modal.id = MODAL_ID;
        modal.innerHTML = `
            <div class="card">
                <h3>⚙️ 机场签到设置</h3>
                
                <div class="group">
                    <label>运行主页 (在该网站才运行)</label>
                    <span class="use-curr" id="btn-use-curr">使用当前网址</span>
                    <input type="text" id="inp-home" value="${defaultHome}">
                    <div class="tip">提示：建议填入你浏览器打开显示的第一个网页</div>
                </div>

                <div class="group">
                    <label>机场邮箱账号</label>
                    <input type="text" id="inp-email" value="${oldConfig.email || ''}" placeholder="email">
                </div>

                <div class="group">
                    <label>机场登录密码</label>
                    <input type="password" id="inp-pass" value="${oldConfig.password || ''}" placeholder="password">
                </div>

                <div class="btn-row">
                    <button class="cancel" id="btn-cancel">取消</button>
                    <button class="save" id="btn-save">保存并运行</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // 按钮事件
        document.getElementById('btn-cancel').onclick = () => modal.remove();
        
        document.getElementById('btn-use-curr').onclick = () => {
            document.getElementById('inp-home').value = window.location.hostname;
        };

        document.getElementById('btn-save').onclick = () => {
            const homepage = document.getElementById('inp-home').value.trim();
            const email = document.getElementById('inp-email').value.trim();
            const password = document.getElementById('inp-pass').value.trim();

            if (homepage && email && password) {
                GM_setValue('vpn_config', { homepage, email, password });
                alert(`设置成功！\n\n脚本已锁定在 [${homepage}] 运行。\n以后打开这个网站就会自动签到了！`);
                modal.remove();
                
                // 如果当前就是主页，直接刷新生效
                if (isHomepage(window.location.href, homepage)) {
                    location.reload();
                } else {
                    // 如果当前不是设置的主页，隐藏配置按钮
                    const setupBtn = document.getElementById(SETUP_BTN_ID);
                    if(setupBtn) setupBtn.remove();
                }
            } else {
                alert("请将三个空都填好哦");
            }
        };
    }

    // 注册菜单 (防止用户想改配置找不到地方)
    GM_registerMenuCommand("⚙️ 修改配置 (账号/主页)", () => showSettings(false));

    // ================= 签到逻辑 =================
    function initCheckinUI(config) {
        // 创建面板
        const panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.innerHTML = `<div class="icon-box">${ICONS.waiting}</div><div class="content-box"><div class="status">正在签到...</div></div>`;
        // 点击面板也可以改配置
        panel.onclick = () => showSettings(false);
        document.body.appendChild(panel);

        // 鼠标交互
        let timer;
        panel.onmouseenter = () => { clearTimeout(timer); panel.classList.remove('collapsed'); };
        panel.onmouseleave = () => { if(!panel.classList.contains('waiting')) timer = setTimeout(() => panel.classList.add('collapsed'), 1500); };

        // 更新UI函数
        const updateUI = (text, type, autoCollapse) => {
            panel.className = type; // waiting, success, error, info
            panel.querySelector('.icon-box').innerText = ICONS[type];
            panel.querySelector('.status').innerText = text;
            
            if (autoCollapse) {
                clearTimeout(timer);
                timer = setTimeout(() => panel.classList.add('collapsed'), 2500);
            }
        };

        // 检查日期
        const today = new Date().toDateString();
        if (GM_getValue('last_run_date') === today) {
            console.log("今日已签");
            updateUI("今日已签到", 'info', true);
            return;
        }

        // 运行请求
        GM_xmlhttpRequest({
            method: "POST",
            url: SITE_CONFIG.siteUrl + SITE_CONFIG.loginApi,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Origin": SITE_CONFIG.siteUrl
            },
            data: `email=${encodeURIComponent(config.email)}&passwd=${encodeURIComponent(config.password)}&code=`,
            onload: (res) => {
                // 登录成功或已登录
                doCheckin(config, updateUI, today);
            },
            onerror: () => updateUI("网络错误", 'error', true)
        });
    }

    function doCheckin(config, updateUI, today) {
        GM_xmlhttpRequest({
            method: "POST",
            url: SITE_CONFIG.siteUrl + SITE_CONFIG.checkinApi,
            headers: { "Origin": SITE_CONFIG.siteUrl, "Referer": SITE_CONFIG.siteUrl + "/user" },
            onload: (res) => {
                try {
                    const json = JSON.parse(res.responseText);
                    const msg = json.msg || json.message || "已签到";
                    GM_setValue('last_run_date', today);
                    updateUI(msg.length > 12 ? "签到成功" : msg, 'success', true);
                } catch(e) {
                    GM_setValue('last_run_date', today);
                    updateUI("签到完成", 'success', true);
                }
            }
        });
    }

})();