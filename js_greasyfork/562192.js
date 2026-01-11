// ==UserScript==
// @name         iKuuu 账户管理助手
// @namespace    https://greasyfork.org/users/huojian1888888
// @version      7.1
// @description  右上角账户管理 + 自动登录/签到 + 多账户循环 + 点击切换自动填充
// @author       huojian1888888
// @match        https://ikuuu.de/*
// @match        https://*.ikuuu.de/*  // 可选：增加通配，防止子域问题
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @icon         https://i.imgs.ovh/2026/01/10/yjBcxF.jpeg
// @license      MIT  
// @downloadURL https://update.greasyfork.org/scripts/562192/iKuuu%20%E8%B4%A6%E6%88%B7%E7%AE%A1%E7%90%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/562192/iKuuu%20%E8%B4%A6%E6%88%B7%E7%AE%A1%E7%90%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========================
    // 🔒 防止重复注入
    // ========================
    if (window.ikuuuAutoLoopRunning) {
        console.log('🚫 iKuuu 助手已加载，跳过重复注入');
        return;
    }
    window.ikuuuAutoLoopRunning = true;

    console.log('🚀 iKuuu 账户管理助手 v7.0 开始加载...');

    // ========================
    // 🎨 添加全局样式（UI优化：增加间距、调整位置、避免重叠）
    // ========================
    GM_addStyle(`
        /* 主按钮：垂直排列，增大尺寸和间距 */
        .ik-account-btn, .ik-auto-sign-btn {
            position: fixed !important;
            right: 20px !important;
            width: 48px !important;
            height: 48px !important;
            border-radius: 50% !important;
            border: none !important;
            cursor: pointer !important;
            z-index: 99999 !important;
            box-shadow: 0 4px 16px rgba(0,0,0,0.25) !important;
            font-size: 22px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.3s ease !important;
        }
        .ik-account-btn { top: 120px !important; background: #4a6fa5 !important; color: white !important; }
        .ik-auto-sign-btn { top: 180px !important; background: #27ae60 !important; color: white !important; }
        .ik-account-btn:hover, .ik-auto-sign-btn:hover { transform: scale(1.15) !important; box-shadow: 0 8px 24px rgba(0,0,0,0.35) !important; }
        .ik-auto-sign-btn.disabled { background: #95a5a6 !important; }

        .account-count, .auto-sign-status {
            position: absolute !important;
            top: -6px !important;
            right: -6px !important;
            border-radius: 50% !important;
            width: 20px !important;
            height: 20px !important;
            font-size: 12px !important;
            font-weight: bold !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: white !important;
        }
        .account-count { background: #e74c3c !important; }
        .auto-sign-status { background: #3498db !important; }

        /* 账户面板：更大宽度、flex布局、顶部下移 */
        .ik-account-panel {
            position: fixed !important;
            top: 80px !important;
            right: 20px !important;
            width: 380px !important;
            max-height: 80vh !important;
            background: white !important;
            border-radius: 16px !important;
            box-shadow: 0 12px 48px rgba(0,0,0,0.25) !important;
            z-index: 10000 !important;
            border: 1px solid #e1e5e9 !important;
            font-family: 'Segoe UI', system-ui, sans-serif !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
        }

        /* 日志面板：移到右下角，半透明背景 */
        #ikuuu-log {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            width: 340px !important;
            max-height: 280px !important;
            background: rgba(255,255,255,0.95) !important;
            backdrop-filter: blur(8px) !important;
            border-radius: 12px !important;
            padding: 14px !important;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2) !important;
            z-index: 9998 !important;
            font-size: 12px !important;
            border: 1px solid #e1e5e9 !important;
            overflow-y: auto !important;
        }

        /* 开关样式（稍大） */
        .auto-toggle {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 28px;
        }
        .auto-toggle input { opacity: 0; width: 0; height: 0; }
        .auto-toggle .slider {
            position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
            background-color: #ccc; transition: .4s; border-radius: 28px;
        }
        .auto-toggle .slider:before {
            position: absolute; content: ""; height: 22px; width: 22px; left: 3px; bottom: 3px;
            background-color: white; transition: .4s; border-radius: 50%;
        }
        .auto-toggle input:checked + .slider { background: linear-gradient(135deg, #4a6fa5, #2c3e50); }
        .auto-toggle input:checked + .slider:before { transform: translateX(22px); }

        /* 按钮通用悬停 */
        .ik-btn {
            transition: all 0.2s ease !important;
            font-weight: 600 !important;
        }
        .ik-btn:hover { transform: translateY(-2px) !important; filter: brightness(1.1) !important; box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important; }
    `);

    // ========================
    // 📝 日志系统（最新日志在上，限制条目）
    // ========================
    class LogManager {
        constructor(maxEntries = 60) {
            this.maxEntries = maxEntries;
            this.init();
        }
        init() {
            if (document.getElementById('ikuuu-log')) return;
            const logDiv = document.createElement('div');
            logDiv.id = 'ikuuu-log';
            document.body.appendChild(logDiv);
        }
        add(message) {
            const logDiv = document.getElementById('ikuuu-log');
            if (!logDiv) return;

            const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const entry = document.createElement('div');
            entry.style.cssText = `margin-bottom: 8px; padding: 8px 10px; border-radius: 8px; background: #f8f9fa; border-left: 4px solid #3498db; font-size: 12px; line-height: 1.5;`;

            let color = '#3498db';
            if (message.includes('✅') || message.includes('成功')) { color = '#27ae60'; entry.style.background = '#eafaf1'; }
            else if (message.includes('❌') || message.includes('错误') || message.includes('失败')) { color = '#e74c3c'; entry.style.background = '#fdeded'; }
            else if (message.includes('⚠️') || message.includes('警告')) { color = '#f39c12'; entry.style.background = '#fef9e7'; }

            entry.style.borderLeftColor = color;
            entry.innerHTML = `<span style="color: ${color}; font-weight: 500;">[${timestamp}] ${message}</span>`;
            logDiv.prepend(entry);
            logDiv.scrollTop = 0;

            while (logDiv.children.length > this.maxEntries) {
                logDiv.removeChild(logDiv.lastChild);
            }

            console.log(`[iKuuu] ${message}`);
        }
    }
    const logger = new LogManager();

    // ========================
    // 🧰 辅助函数
    // ========================
    const getAccounts = () => {
        try { return JSON.parse(GM_getValue('ikuuuAccounts', '[]')); }
        catch { logger.add('❌ 读取账户失败，使用空数组'); return []; }
    };
    const saveAccounts = (accounts) => GM_setValue('ikuuuAccounts', JSON.stringify(accounts));

    const getCurrentIndex = () => {
        const idx = parseInt(GM_getValue('ikuuuCurrentIndex', '0'));
        const accounts = getAccounts();
        return Math.min(Math.max(0, idx), Math.max(0, accounts.length - 1));
    };

    const isAutoEnabled = () => GM_getValue('ikuuuAutoLogin', 'false') === 'true';
    const setAutoEnabled = (enabled) => GM_setValue('ikuuuAutoLogin', enabled.toString());

    const getToday = () => new Date().toISOString().split('T')[0];
    const hasCheckedInToday = (email) => GM_getValue(`ikuuu_checkin_${email.replace(/[@.]/g, '_')}`, '') === getToday();
    const markCheckedInToday = (email) => GM_setValue(`ikuuu_checkin_${email.replace(/[@.]/g, '_')}`, getToday());

    const clearCheckinRecords = () => {
        getAccounts().forEach(acc => GM_setValue(`ikuuu_checkin_${acc.email.replace(/[@.]/g, '_')}`, ''));
        logger.add('✅ 已清除所有签到记录');
    };

    // ========================
    // ✅ API 签到函数
    // ========================
    const performCheckinViaAPI = (email) => {
        return new Promise((resolve) => {
            if (hasCheckedInToday(email)) {
                return resolve({ success: false, message: "今日已签到（本地记录）", skipped: true });
            }

            GM_xmlhttpRequest({
                method: "POST",
                url: "https://ikuuu.de/user/checkin",
                headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" },
                data: JSON.stringify({}),
                timeout: 10000,
                onload: (response) => {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.ret === 1 || (result.msg && result.msg.includes("签到成功"))) {
                            markCheckedInToday(email);
                            resolve({ success: true, message: result.msg || "签到成功" });
                        } else if (result.msg && (result.msg.includes("已签到") || result.msg.includes("已经"))) {
                            markCheckedInToday(email);
                            resolve({ success: false, message: result.msg, skipped: true });
                        } else {
                            resolve({ success: false, message: result.msg || "未知响应" });
                        }
                    } catch (e) {
                        resolve({ success: false, message: "响应解析失败" });
                    }
                },
                onerror: () => resolve({ success: false, message: "网络错误" })
            });
        });
    };

    // ========================
    // 🔄 处理下一个账户
    // ========================
    const processNextAccount = () => {
        const accounts = getAccounts();
        let idx = getCurrentIndex() + 1;

        if (idx < accounts.length) {
            GM_setValue('ikuuuCurrentIndex', idx.toString());
            logger.add(`➡️ 切换到账户 ${idx + 1}/${accounts.length}`);
            setTimeout(() => {
                const logout = document.querySelector('a[href="/user/logout"], a[href*="logout"]');
                if (logout) logout.click();
                else window.location.href = '/user/logout';
            }, 1000);
        } else {
            GM_setValue('ikuuuCurrentIndex', '0');
            logger.add('✅ 本轮所有账户处理完成');
        }
    };

    // ========================
    // 🎮 手动签到
    // ========================
    const handleManualSign = async () => {
        const accounts = getAccounts();
        const idx = getCurrentIndex();
        if (idx >= accounts.length) return alert('没有可用账户！');

        const email = accounts[idx].email;
        logger.add(`🖱️ 手动签到: ${email}`);
        const result = await performCheckinViaAPI(email);
        if (result.success) logger.add(`✅ ${result.message}`);
        else if (result.skipped) logger.add(`ℹ️ ${result.message}`);
        else logger.add(`⚠️ ${result.message}`);
    };

    // ========================
    // 🔐 自动填充登录表单（增强版）
    // ========================
    const autoFillLoginForm = () => {
        const isLoginPage = /\/(auth\/)?login/.test(window.location.pathname) ||
                           document.querySelector('input[type="email"], input[name="email"], #email') !== null;

        if (!isLoginPage) return;

        logger.add('🔍 检测到登录页面，尝试自动填入账户信息');

        const accounts = getAccounts();
        const idx = getCurrentIndex();
        if (idx >= accounts.length) return;

        const { email, password } = accounts[idx];

        const tryFill = () => {
            const selectors = [
                ['input[name="email"], input[type="email"], #email, input[name="username"]', 'input[name="password"], input[type="password"], #password'],
                ['input[placeholder*="邮箱"], input[placeholder*="mail"]', 'input[placeholder*="密码"], input[placeholder*="pass"]']
            ];

            for (const [eSel, pSel] of selectors) {
                const eInput = document.querySelector(eSel);
                const pInput = document.querySelector(pSel);
                if (eInput && pInput) {
                    eInput.value = email;
                    pInput.value = password;
                    ['input', 'change', 'keyup'].forEach(ev => {
                        eInput.dispatchEvent(new Event(ev, { bubbles: true }));
                        pInput.dispatchEvent(new Event(ev, { bubbles: true }));
                    });
                    logger.add(`✅ 已自动填入账户: ${email}`);
                    return true;
                }
            }

            // 备用遍历
            const allInputs = document.querySelectorAll('input');
            const emailFields = Array.from(allInputs).filter(i => i.type === 'email' || /email/i.test(i.name || i.id || i.placeholder || ''));
            const passFields = Array.from(allInputs).filter(i => i.type === 'password' || /pass/i.test(i.name || i.id || i.placeholder || ''));
            if (emailFields[0] && passFields[0]) {
                emailFields[0].value = email;
                passFields[0].value = password;
                ['input', 'change'].forEach(ev => {
                    emailFields[0].dispatchEvent(new Event(ev, { bubbles: true }));
                    passFields[0].dispatchEvent(new Event(ev, { bubbles: true }));
                });
                logger.add(`✅ 已通过备用方式填入账户: ${email}`);
                return true;
            }
            return false;
        };

        let attempts = 0;
        const interval = setInterval(() => {
            if (tryFill() || attempts++ > 12) {
                clearInterval(interval);
                if (attempts > 12) logger.add('❌ 未找到登录表单字段');
            }
        }, 500);
    };

    // ========================
    // 🔁 自动流程控制
    // ========================
    const handleLoginPage = () => {
        if (!isAutoEnabled()) return;

        setTimeout(() => {
            const accounts = getAccounts();
            const idx = getCurrentIndex();
            if (accounts.length === 0 || idx >= accounts.length) return;

            const { email, password } = accounts[idx];
            logger.add(`🔐 自动登录 [${idx + 1}/${accounts.length}]: ${email}`);

            const emailInput = document.querySelector('input[name="email"], input[type="email"], #email');
            const passwordInput = document.querySelector('input[name="password"], input[type="password"], #password');
            const submitBtn = document.querySelector('button[type="submit"], input[type="submit"], .login-button');

            if (emailInput && passwordInput && submitBtn) {
                emailInput.value = email;
                passwordInput.value = password;
                ['input', 'change'].forEach(ev => {
                    emailInput.dispatchEvent(new Event(ev, { bubbles: true }));
                    passwordInput.dispatchEvent(new Event(ev, { bubbles: true }));
                });
                submitBtn.click();
                logger.add(`✅ 已提交登录: ${email}`);
            } else {
                logger.add('❌❌ 登录表单未找到！');
            }
        }, 1500);
    };

    const handleUserPage = async () => {
        if (!isAutoEnabled()) return;

        setTimeout(async () => {
            const accounts = getAccounts();
            const idx = getCurrentIndex();
            if (accounts.length === 0 || idx >= accounts.length) return;

            const email = accounts[idx].email;
            if (hasCheckedInToday(email)) {
                logger.add(`⏭ 本地记录已签到: ${email}`);
                processNextAccount();
                return;
            }

            logger.add(`⏳ 正在签到: ${email}`);
            const result = await performCheckinViaAPI(email);
            if (result.success) logger.add(`✅ ${result.message}`);
            else if (result.skipped) logger.add(`ℹ️ ${result.message}`);
            else logger.add(`⚠️ ${result.message}`);

            processNextAccount();
        }, 2000);
    };

    // ========================
    // 🖥 账户管理面板
    // ========================
    let panelVisible = false;
    let panelElement = null;

    const togglePanel = () => {
        if (panelVisible) {
            if (panelElement) panelElement.remove();
            panelVisible = false;
        } else {
            renderPanel();
            panelVisible = true;
        }
    };

    const renderPanel = () => {
        if (panelElement) panelElement.remove();

        const accounts = getAccounts();
        const idx = getCurrentIndex();

        const isLoginPage = /\/(auth\/)?login/.test(window.location.pathname);

        const panel = document.createElement('div');
        panel.className = 'ik-account-panel';
        panel.innerHTML = `
            <div style="padding:18px 24px; background:linear-gradient(135deg,#4a6fa5,#2c3e50); color:white; border-radius:16px 16px 0 0;">
                <h4 style="margin:0; font-weight:600; font-size:18px;">iKuuu 账户管理</h4>
                <div style="font-size:13px; opacity:0.9; margin-top:6px;">
                    当前账户: <span id="current-account" style="font-weight:600;">${idx + 1}/${accounts.length || 0}</span>
                </div>
                ${isLoginPage ? '<div style="margin-top:10px; padding:8px; background:rgba(255,255,255,0.2); border-radius:8px; font-size:12px;"><strong>💡 提示：</strong>点击账户列表项可切换并自动填入登录信息</div>' : ''}
            </div>

            <div style="flex:1; overflow-y:auto; padding:20px 24px;">
                <div id="account-list" style="margin-bottom:20px;"></div>

                <div style="background:#f8f9fa; padding:16px; border-radius:12px; margin-bottom:20px;">
                    <h5 style="margin:0 0 12px; font-weight:600; color:#2c3e50;">添加新账户</h5>
                    <input type="email" id="new-email" placeholder="邮箱" style="width:100%; padding:10px; margin-bottom:10px; border:1px solid #ddd; border-radius:8px;">
                    <input type="password" id="new-password" placeholder="密码" style="width:100%; padding:10px; margin-bottom:10px; border:1px solid #ddd; border-radius:8px;">
                    <input type="text" id="new-note" placeholder="备注（可选）" style="width:100%; padding:10px; margin-bottom:14px; border:1px solid #ddd; border-radius:8px;">
                    <button id="add-account-btn" class="ik-btn" style="width:100%; background:#4a6fa5; color:white; padding:12px; border-radius:8px;">添加账户</button>
                </div>

                <div style="background:#f0f8ff; padding:16px; border-radius:12px; margin-bottom:20px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-weight:600; color:#2c3e50;">自动登录/签到</span>
                        <label class="auto-toggle">
                            <input type="checkbox" id="auto-login-toggle" ${isAutoEnabled() ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div style="font-size:12px; color:#666; margin-top:8px;">启用后将自动处理账户列表</div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
                    <button id="manual-sign-btn" class="ik-btn" style="background:#27ae60; color:white; padding:12px; border-radius:8px;">手动签到</button>
                    <button id="reset-first-btn" class="ik-btn" style="background:#e74c3c; color:white; padding:12px; border-radius:8px;">重置索引</button>
                </div>

                <div style="display:grid; grid-template-columns:1fr; gap:10px;">
                    <button id="clear-checkin-btn" class="ik-btn" style="background:#f39c12; color:white; padding:12px; border-radius:8px;">清除签到记录</button>
                    <button id="export-btn" class="ik-btn" style="background:#9b59b6; color:white; padding:12px; border-radius:8px;">导出账户</button>
                    <button id="import-btn" class="ik-btn" style="background:#3498db; color:white; padding:12px; border-radius:8px;">导入账户</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        panelElement = panel;

        renderAccountList();
        bindPanelEvents();
    };

    const renderAccountList = () => {
        const list = document.getElementById('account-list');
        if (!list) return;

        const accounts = getAccounts();
        const idx = getCurrentIndex();

        if (accounts.length === 0) {
            list.innerHTML = `<div style="text-align:center; padding:40px; color:#7f8c8d; font-size:14px;">暂无账户<br><small style="font-size:12px;">请添加账户开始使用</small></div>`;
            return;
        }

        list.innerHTML = accounts.map((acc, i) => {
            const isCurrent = i === idx;
            const checked = hasCheckedInToday(acc.email);
            return `
                <div style="padding:14px; border-radius:12px; margin-bottom:12px; background:${isCurrent ? '#e8f4fd' : '#f8f9fa'};
                            border-left:4px solid ${isCurrent ? '#1976d2' : '#4a6fa5'}; position:relative; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,0.05);"
                     data-index="${i}">
                    <div style="display:flex; justify-content:space-between; align-items:start;">
                        <div style="flex:1;">
                            <div style="font-weight:600; color:#2c3e50; font-size:14px;">
                                ${acc.email} ${isCurrent ? '<span style="color:#e74c3c; font-size:11px;">[当前]</span>' : ''}
                            </div>
                            <div style="font-size:12px; color:#7f8c8d; margin:6px 0;">${acc.note || '无备注'}</div>
                            <span style="font-size:11px; padding:4px 8px; background:${checked ? '#27ae60' : '#e74c3c'}; color:white; border-radius:12px;">
                                ${checked ? '已签到' : '未签到'}
                            </span>
                        </div>
                        <div class="account-actions" style="display:none; align-items:center; gap:8px;">
                            <button class="ik-edit-btn" data-index="${i}" style="background:#3498db; color:white; border:none; width:28px; height:28px; border-radius:50%;">✏️</button>
                            <button class="ik-delete-btn" data-index="${i}" style="background:#e74c3c; color:white; border:none; width:28px; height:28px; border-radius:50%;">×</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        document.querySelectorAll('#account-list > div[data-index]').forEach(item => {
            const i = parseInt(item.dataset.index);

            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-3px)';
                item.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                item.querySelector('.account-actions').style.display = 'flex';
            });
            item.addEventListener('mouseleave', () => {
                item.style.transform = '';
                item.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                item.querySelector('.account-actions').style.display = 'none';
            });

            item.addEventListener('click', (e) => {
                if (e.target.closest('.ik-edit-btn') || e.target.closest('.ik-delete-btn')) return;

                if (i !== idx) {
                    GM_setValue('ikuuuCurrentIndex', i.toString());
                    logger.add(`➡️ 切换账户: ${accounts[i].email}`);
                    renderPanel();
                    updateButtons();
                    autoFillLoginForm();
                }
            });

            item.querySelector('.ik-edit-btn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                editAccount(i);
            });
            item.querySelector('.ik-delete-btn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteAccount(i);
            });
        });
    };

    const bindPanelEvents = () => {
        document.getElementById('auto-login-toggle')?.addEventListener('change', (e) => {
            setAutoEnabled(e.target.checked);
            logger.add(`自动模式 ${e.target.checked ? '启用' : '禁用'}`);
            updateButtons();
        });

        document.getElementById('add-account-btn')?.addEventListener('click', () => {
            const email = document.getElementById('new-email').value.trim();
            const pass = document.getElementById('new-password').value.trim();
            const note = document.getElementById('new-note').value.trim();

            if (!email || !pass) return alert('邮箱和密码必填！');
            if (!email.includes('@')) return alert('邮箱格式错误！');

            const accounts = getAccounts();
            if (accounts.some(a => a.email === email)) return alert('该邮箱已存在！');

            accounts.push({ email, password: pass, note });
            saveAccounts(accounts);
            document.getElementById('new-email').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('new-note').value = '';

            logger.add(`✅ 添加账户成功: ${email}`);
            renderPanel();
            updateButtons();
        });

        document.getElementById('manual-sign-btn')?.addEventListener('click', handleManualSign);
        document.getElementById('reset-first-btn')?.addEventListener('click', () => {
            GM_setValue('ikuuuCurrentIndex', '0');
            logger.add('🔄 已重置为第一个账户');
            renderPanel();
            updateButtons();
        });
        document.getElementById('clear-checkin-btn')?.addEventListener('click', clearCheckinRecords);
        document.getElementById('export-btn')?.addEventListener('click', exportAccounts);
        document.getElementById('import-btn')?.addEventListener('click', importAccounts);
    };

    const editAccount = (i) => {
        const accounts = getAccounts();
        const acc = accounts[i];
        const modal = document.createElement('div');
        modal.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:20000;display:flex;justify-content:center;align-items:center;`;
        modal.innerHTML = `
            <div style="background:white;padding:24px;border-radius:16px;width:320px;box-shadow:0 12px 40px rgba(0,0,0,0.3);">
                <h4 style="margin:0 0 16px;color:#2c3e50;font-size:18px;">编辑账户</h4>
                <input type="email" id="edit-email" value="${acc.email}" style="width:100%;padding:10px;margin-bottom:12px;border:1px solid #ddd;border-radius:8px;">
                <input type="password" id="edit-password" value="${acc.password}" style="width:100%;padding:10px;margin-bottom:12px;border:1px solid #ddd;border-radius:8px;">
                <input type="text" id="edit-note" value="${acc.note || ''}" style="width:100%;padding:10px;margin-bottom:20px;border:1px solid #ddd;border-radius:8px;">
                <div style="display:flex;gap:12px;">
                    <button id="save-edit" style="flex:1;background:#27ae60;color:white;border:none;padding:12px;border-radius:8px;">保存</button>
                    <button id="cancel-edit" style="flex:1;background:#95a5a6;color:white;border:none;padding:12px;border-radius:8px;">取消</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('#cancel-edit').onclick = () => modal.remove();
        modal.querySelector('#save-edit').onclick = () => {
            const newEmail = modal.querySelector('#edit-email').value.trim();
            const newPass = modal.querySelector('#edit-password').value.trim();
            const newNote = modal.querySelector('#edit-note').value.trim();
            if (!newEmail || !newPass) return alert('邮箱和密码不能为空！');
            accounts[i] = { email: newEmail, password: newPass, note: newNote };
            saveAccounts(accounts);
            logger.add(`✅ 账户更新: ${newEmail}`);
            modal.remove();
            renderPanel();
            updateButtons();
        };
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    };

    const deleteAccount = (i) => {
        const accounts = getAccounts();
        const acc = accounts[i];
        if (!confirm(`确定删除账户 "${acc.email}" 吗？`)) return;

        accounts.splice(i, 1);
        saveAccounts(accounts);
        let newIdx = getCurrentIndex();
        if (i <= newIdx) {
            newIdx = Math.max(0, newIdx - 1);
            GM_setValue('ikuuuCurrentIndex', newIdx.toString());
        }
        logger.add(`🗑️ 已删除账户: ${acc.email}`);
        renderPanel();
        updateButtons();
    };

    const exportAccounts = () => {
        const accounts = getAccounts();
        if (accounts.length === 0) return alert('无账户可导出');
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(accounts, null, 2));
        const link = document.createElement('a');
        link.href = dataUri;
        link.download = `ikuuu-accounts-${getToday()}.json`;
        link.click();
        logger.add(`✅ 已导出 ${accounts.length} 个账户`);
    };

    const importAccounts = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const imported = JSON.parse(ev.target.result);
                    if (!Array.isArray(imported)) throw new Error('格式错误');
                    const current = getAccounts();
                    let added = 0;
                    imported.forEach(acc => {
                        if (acc.email && acc.password && !current.some(c => c.email === acc.email)) {
                            current.push(acc);
                            added++;
                        }
                    });
                    saveAccounts(current);
                    logger.add(`✅ 导入成功，新增 ${added} 个账户，共 ${current.length} 个`);
                    renderPanel();
                    updateButtons();
                } catch (err) {
                    alert('导入失败: ' + err.message);
                    logger.add('❌ 导入失败');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    // ========================
    // 🔘 按钮创建与更新
    // ========================
    const updateButtons = () => {
        updateAccountButton();
        updateAutoSignButton();
    };

    const createAccountButton = () => {
        const old = document.querySelector('.ik-account-btn');
        if (old) old.remove();

        const btn = document.createElement('button');
        btn.className = 'ik-account-btn';
        btn.innerHTML = '🔧';
        btn.title = '账户管理面板';

        const count = document.createElement('span');
        count.className = 'account-count';
        btn.appendChild(count);

        btn.onclick = togglePanel;
        document.body.appendChild(btn);
        updateAccountButton();
    };

    const updateAccountButton = () => {
        const btn = document.querySelector('.ik-account-btn');
        if (!btn) return;
        const count = getAccounts().length;
        const span = btn.querySelector('.account-count');
        span.textContent = count;
        span.style.display = count > 0 ? 'flex' : 'none';
    };

    const createAutoSignButton = () => {
        const old = document.querySelector('.ik-auto-sign-btn');
        if (old) old.remove();

        const btn = document.createElement('button');
        btn.className = `ik-auto-sign-btn ${isAutoEnabled() ? '' : 'disabled'}`;
        btn.innerHTML = isAutoEnabled() ? '🔔' : '🔕';
        btn.title = isAutoEnabled() ? '自动模式已启用' : '自动模式已禁用';

        const status = document.createElement('span');
        status.className = 'auto-sign-status';
        status.textContent = isAutoEnabled() ? '✓' : '✗';
        btn.appendChild(status);

        btn.onclick = () => {
            setAutoEnabled(!isAutoEnabled());
            logger.add(`自动模式 ${isAutoEnabled() ? '启用' : '禁用'}`);
            updateAutoSignButton();
        };
        document.body.appendChild(btn);
    };

    const updateAutoSignButton = () => {
        const btn = document.querySelector('.ik-auto-sign-btn');
        if (!btn) return;
        const enabled = isAutoEnabled();
        btn.className = `ik-auto-sign-btn ${enabled ? '' : 'disabled'}`;
        btn.innerHTML = enabled ? '🔔' : '🔕';
        let status = btn.querySelector('.auto-sign-status');
        if (!status) {
            status = document.createElement('span');
            status.className = 'auto-sign-status';
            btn.appendChild(status);
        }
        status.textContent = enabled ? '✓' : '✗';
    };

    // ========================
    // 🎯 初始化
    // ========================
    const initialize = () => {
        createAccountButton();
        createAutoSignButton();
        logger.add('🚀 脚本初始化完成');

        const path = window.location.pathname;
        if (/\/(auth\/)?login/.test(path)) {
            setTimeout(autoFillLoginForm, 600);
            if (isAutoEnabled()) handleLoginPage();
        } else if (path === '/user') {
            handleUserPage();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initialize, 1000));
    } else {
        setTimeout(initialize, 1000);
    }
})();