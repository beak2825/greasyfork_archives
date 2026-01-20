// ==UserScript==
// @name         AI Studio Auto-Config
// @namespace    http://tampermonkey.net/
// @version      v1.0.1
// @description  自动配置 Google AI Studio 系统指令
// @author       Moonlit Night (for oy3o)
// @match      https://aistudio.google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558592/AI%20Studio%20Auto-Config.user.js
// @updateURL https://update.greasyfork.org/scripts/558592/AI%20Studio%20Auto-Config.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 核心配置 ===
    const CFG = {
        path: 'prompts/new_chat',
        // 你的自定义选项位置：默认取第2个选项 (nth-child(2))
        optionSelector: '.cdk-overlay-pane mat-option:nth-child(2)',
        selectors: {
            btn: 'ms-system-instructions-panel > button', // 简化选择器
            dropdown: 'mat-dialog-content mat-select',
            input: 'ms-prompt-renderer ms-prompt-box textarea' // 全局唯一的 textarea 通常就是输入框
        }
    };

    // === 极简工具库 ===
    const wait = (sel, timeout = 5000) => new Promise(resolve => {
        if (document.querySelector(sel)) return resolve(document.querySelector(sel));
        const obs = new MutationObserver(() => {
            const el = document.querySelector(sel);
            if (el) { obs.disconnect(); resolve(el); }
        });
        obs.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => { obs.disconnect(); resolve(null); }, timeout);
    });

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    // === 业务逻辑 ===
    let isRunning = false;

    async function execute() {
        if (!location.href.includes(CFG.path) || isRunning) return;
        isRunning = true;

        try {
            // 1. 等待并点击设置按钮
            const btn = await wait(CFG.selectors.btn);
            if (!btn) return; // 找不到默默退出，不报错干扰
            btn.click();

            // 2. 等待并打开下拉菜单
            const dropdown = await wait(CFG.selectors.dropdown);
            if (!dropdown) return;
            dropdown.click();

            // 3. 等待并选择配置项 (Angular 渲染动画需要一点缓冲)
            const option = await wait(CFG.optionSelector);
            if (option) {
                await sleep(100); // 确保点击被注册
                option.click();
            }

            // 4. 处理遮罩与聚焦 (通过模拟 ESC 关闭可能更稳，但点击遮罩也行)
            await sleep(300); // 等待选项生效
            const backdrop = document.querySelector('.cdk-overlay-backdrop');
            if (backdrop) backdrop.click();

            // 5. 聚焦输入框
            const input = await wait(CFG.selectors.input);
            if (input) input.focus();

        } catch (e) {
            console.debug('[AutoCfg]', e);
        } finally {
            // 冷却时间，防止短时间重复触发
            setTimeout(() => isRunning = false, 1000);
        }
    }

    // === SPA 路由劫持 (Hook) ===
    function installHook() {
        const wrap = (type) => {
            const orig = history[type];
            return function() {
                const res = orig.apply(this, arguments);
                setTimeout(execute, 500); // 等待应用界面切换
                return res;
            };
        };
        history.pushState = wrap('pushState');
        history.replaceState = wrap('replaceState');
        window.addEventListener('popstate', execute);

        // 首次运行
        execute();
    }

    installHook();

})();