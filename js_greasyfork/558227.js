// ==UserScript==
// @name         115转存助手 (115 Auto Save)
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  115网盘分享页面自动转存，支持自动登录、验证码识别及最近接收文件夹选择。
// @author       Xiaowu
// @match        https://115cdn.com/s/*
// @match        https://115.com/*
// @icon         https://115.com/favicon.ico
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558227/115%E8%BD%AC%E5%AD%98%E5%8A%A9%E6%89%8B%20%28115%20Auto%20Save%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558227/115%E8%BD%AC%E5%AD%98%E5%8A%A9%E6%89%8B%20%28115%20Auto%20Save%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 配置项 ==========
    const CONFIG = {
        WAIT_TIMEOUT: 10000,
        ACTION_DELAY: 500,
        AUTO_CHECK_RECENT_PATH: true,
        AUTO_CLOSE_SUCCESS: true,
        // 匹配逻辑定义
        SELECTORS: {
            BUTTONS: 'button, a, li, span',
            INPUTS: 'input[type="text"], input[type="tel"], input[type="number"]'
        },
        TEXTS: {
            submit: ['确定', '提交', 'Submit', 'OK'],
            save: ['转存'],
            oneClick: ['一键转存'],
            confirm: ['立即转存', '转存到此'],
            close: ['关闭', 'Close'],
            getSms: ['获取验证码', '发送验证码', '免费获取'],
            login: ['登录'],
            accountMode: ['使用账号登录'],
            smsTitle: ['短信验证']
        }
    };

    // ========== 工具函数 ==========

    const log = (msg, type = 'info') => {
        const colors = { info: '#3b82f6', success: '#22c55e', warn: '#f59e0b', error: '#ef4444' };
        console.log(`%c[115转存助手] ${msg}`, `color: ${colors[type] || colors.info}`);
    };

    const sleep = (ms) => new Promise(res => setTimeout(res, ms));

    /**
     * 统一元素选择器（根据文本和可见性）
     */
    const queryByText = (selector, texts, options = {}) => {
        const { isExact = true, visibleOnly = true } = options;
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
            const content = el.textContent.trim();
            const matches = Array.isArray(texts) 
                ? texts.some(t => isExact ? content === t : content.includes(t))
                : (isExact ? content === texts : content.includes(texts));
            
            if (matches) {
                if (!visibleOnly || (el.offsetParent !== null || el.offsetWidth > 0)) return el;
            }
        }
        return null;
    };

    const waitForElement = (callback, timeout = CONFIG.WAIT_TIMEOUT) => {
        return new Promise((resolve, reject) => {
            const result = callback();
            if (result) return resolve(result);

            const observer = new MutationObserver(() => {
                const res = callback();
                if (res) {
                    observer.disconnect();
                    resolve(res);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => {
                observer.disconnect();
                reject(new Error('Timeout waiting for element'));
            }, timeout);
        });
    };

    const safeClick = async (el, desc) => {
        if (el) {
            log(`点击: ${desc}`);
            // 如果不可见，强行修正样式（针对Tailwind等隐藏组件）
            if (el.offsetParent === null) {
                el.style.visibility = 'visible';
                el.style.display = 'block';
            }
            el.click();
            await sleep(CONFIG.ACTION_DELAY);
            return true;
        }
        return false;
    };

    const triggerHover = (el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        ['mouseenter', 'mouseover', 'mousemove'].forEach(type => {
            el.dispatchEvent(new MouseEvent(type, {
                view: window, bubbles: true, cancelable: true,
                clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2
            }));
        });
    };

    // ========== 业务逻辑 ==========

    /**
     * 处理短信验证
     */
    const handleSmsVerification = async () => {
        try {
            // 1. 等待并发送验证码
            log('正在寻找发送按钮...');
            const sendBtn = await waitForElement(
                () => queryByText('a, button, span', CONFIG.TEXTS.getSms, { isExact: false }),
                5000
            ).catch(() => null);

            if (sendBtn) {
                log('发送验证码...');
                sendBtn.click();
            } else {
                log('未找到发送按钮，可能已发送或需手动点击', 'warn');
            }

            log('⏳ 等待验证码输入 (60s)...');
            const startTime = Date.now();
            let lastLog = 0;

            while (Date.now() - startTime < 60000) {
                const inputs = document.querySelectorAll(CONFIG.SELECTORS.INPUTS);
                let smsInput = null;
                for (const input of inputs) {
                    const name = input.getAttribute('name') || '';
                    if (name === 'account' || name === 'passwd') continue;
                    if (input.offsetParent !== null || input.offsetWidth > 0) {
                        smsInput = input;
                        break;
                    }
                }

                if (Date.now() - lastLog > 5000) {
                    log(`检测中... 输入框: ${smsInput ? '就绪' : '未找到'}, 当前长度: ${smsInput?.value?.length || 0}`);
                    lastLog = Date.now();
                }

                if (smsInput && smsInput.value.length >= 4) {
                    log(`✅ 自动提交验证码: ${smsInput.value.length}位`);
                    await sleep(300);
                    const okBtn = queryByText('a, button', '确定');
                    if (await safeClick(okBtn, '短信确认按钮')) {
                        // 登录成功后的自动跳转兜底
                        await sleep(2000);
                        const goto = localStorage.getItem('115_auto_save_goto');
                        if (goto) {
                            log(`重定向回原始页面: ${goto.slice(0, 30)}...`);
                            localStorage.removeItem('115_auto_save_goto');
                            window.location.href = goto;
                        }
                        return true;
                    }
                }
                await sleep(500);
            }
            return false;
        } catch (e) { log(`验证失败: ${e.message}`, 'error'); return false; }
    };

    /**
     * 登录页面自动化
     */
    const handleLoginPage = async () => {
        log('检测到登录页...');
        const params = new URLSearchParams(window.location.search);
        let goto = params.get('goto') || (window.location.href.split('goto=')[1]?.split('&')[0]);
        if (goto) {
            localStorage.setItem('115_auto_save_goto', decodeURIComponent(goto));
        }

        await sleep(1000);
        // 切换账号模式
        const accLink = queryByText('a', CONFIG.TEXTS.accountMode);
        if (accLink) accLink.click();
        
        await sleep(1500); // 等待填充
        const acc = document.querySelector('input[name="account"]');
        const pwd = document.querySelector('input[name="passwd"]');
        
        if (acc?.value && pwd?.value) {
            const loginBtn = queryByText('a.button', CONFIG.TEXTS.login);
            if (await safeClick(loginBtn, '主登录按钮')) {
                log('已点击登录，等待结果...');
                // 等待短信弹窗或完成
                const smsDialog = await waitForElement(
                    () => queryByText('h3, div', CONFIG.TEXTS.smsTitle, { isExact: false }),
                    5000
                ).catch(() => null);

                if (smsDialog) {
                    log('检测到短信验证弹窗');
                    await sleep(500);
                    await handleSmsVerification();
                }
            }
        }
    };

    /**
     * 转存流程
     */
    const runScript = async () => {
        log('启动转存流程...');
        try {
            // 步骤 1: 确定访问码
            const subBtn = await waitForElement(() => queryByText('button', CONFIG.TEXTS.submit)).catch(() => null);
            await safeClick(subBtn, '提交访问码');

            // 步骤 2: 触发表显并点击转存
            log('准备转存操作...');
            await sleep(1000);
            const mainBtn = await waitForElement(() => queryByText('button', CONFIG.TEXTS.save));
            
            // 优先直接查隐藏的一键转存按钮
            let targetBtn = queryByText(CONFIG.SELECTORS.BUTTONS, CONFIG.TEXTS.oneClick, { visibleOnly: false });
            if (!targetBtn || targetBtn.offsetParent === null) {
                // 如果没显示，hover一下主按钮旁边的东西
                triggerHover(mainBtn.nextElementSibling || mainBtn);
                await sleep(500);
                targetBtn = queryByText(CONFIG.SELECTORS.BUTTONS, CONFIG.TEXTS.oneClick, { visibleOnly: false }) || mainBtn;
            }
            await safeClick(targetBtn, targetBtn === mainBtn ? '普通转存' : '一键转存');

            // 步骤 3: 确定保存位置
            await sleep(800);
            // 尝试选择"最近接收"
            const folder = queryByText(CONFIG.SELECTORS.BUTTONS, '最近接收');
            if (folder) {
                await safeClick(folder, '选择最近接收文件夹');
            } else if (CONFIG.AUTO_CHECK_RECENT_PATH) {
                // 备选：勾选"最近保存路径"复选框
                const labels = Array.from(document.querySelectorAll('label')).find(l => l.textContent.includes('最近保存路径'));
                const cb = labels?.previousElementSibling || document.querySelector('input[type="checkbox"]+label')?.previousElementSibling;
                if (cb && !cb.checked) cb.click();
            }

            await sleep(300);
            const finalBtn = await waitForElement(() => queryByText('button', CONFIG.TEXTS.confirm));
            await safeClick(finalBtn, '最终转存确认');

            // 步骤 4: 自动关闭
            if (CONFIG.AUTO_CLOSE_SUCCESS) {
                const closeTitle = await waitForElement(() => queryByText('h3, div', ['成功', '转存成功'], { isExact: false }), 5000).catch(() => null);
                if (closeTitle) {
                    await sleep(300);
                    safeClick(queryByText('button, a', CONFIG.TEXTS.close), '关闭提示');
                }
            }
            log('🎉 转存成功！', 'success');
        } catch (e) { log(`流程中断: ${e.message}`, 'warn'); }
    };

    // ========== 主入口 ==========
    
    const isLoginPage = () => window.location.href.includes('115.com') && 
                             (window.location.href.includes('goto=') || document.querySelector('input[name="account"]'));

    const main = async () => {
        const saved = localStorage.getItem('115_auto_save_goto');
        const url = window.location.href;

        // 首页兜底跳转
        if (saved && url.includes('115.com') && !isLoginPage() && (url.includes('mode=wangpan') || url === 'https://115.com/')) {
            log('登录成功，执行延迟跳转...');
            localStorage.removeItem('115_auto_save_goto');
            window.location.href = saved;
            return;
        }

        if (isLoginPage()) {
            handleLoginPage();
        } else if (url.includes('115cdn.com/s/')) {
            runScript();
        }
    };

    if (document.readyState === 'complete') main();
    else window.addEventListener('load', main);

})();