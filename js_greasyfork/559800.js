// ==UserScript==
// @name         自动开启Bilibili双语字幕
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Auto Bilingual Subtitles for bilibili
// @author       Frontend Engineer
// @match        https://www.bilibili.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559800/%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AFBilibili%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/559800/%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AFBilibili%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // DEBUG模式开关
    const DEBUG = true;
    const LOG_PREFIX = '[B站字幕助手]';
    let lastUrl = location.href;

    /**
     * 安全日志输出
     */
    function safeLog(message, ...args) {
        if (DEBUG) {
            console.log(`${LOG_PREFIX} ${message}`, ...args);
        }
    }

    /**
     * 检测字幕场景类型
     */
    async function detectSubtitleScenario() {
        safeLog('开始检测字幕场景...');

        // 检查字幕按钮是否存在
        const subtitleBtn = await waitForElement('.bpx-player-ctrl-subtitle[aria-label*="字幕"]', 5000);
        if (!subtitleBtn) {
            safeLog('未找到字幕按钮，判定为: NO_SUBTITLE');
            return 'NO_SUBTITLE';
        }

        // 检查中文字幕是否存在
        // const chineseItem = document.querySelector('.bpx-player-ctrl-subtitle-language-item[data-lan="ai-zh"]');
        // if (!chineseItem) {
        //     safeLog('未找到中文字幕选项，判定为: NO_CHINESE');
        //     return 'NO_CHINESE';
        // }

        // 检查双语开关是否存在
        const bilingualSwitch = await waitForElement('.bui-switch-input[aria-label*="双语字幕"]');
        if (bilingualSwitch) {
            safeLog('检测到双语字幕开关，判定为: BILINGUAL');
            return 'BILINGUAL';
        }

        safeLog('检测到单字幕模式，判定为: SINGLE');
        return 'SINGLE';
    }

    /**
     * 等待元素出现
     */
    async function waitForElement(selector, timeout = 1000) {
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        // 1. 先静默等待 200ms，让 B 站播放器的内部逻辑跑完
        await sleep(200);
        
        return new Promise((resolve) => {
            const startTime = Date.now();
            const check = () => {
                const el = document.querySelector(selector);
                if (el) {
                    safeLog(`元素已就绪: ${selector}`);
                    resolve(el);
                } else if (Date.now() - startTime > timeout) {
                    safeLog(`超时未找到: ${selector}`);
                    resolve(null);
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    }

    /**
     * 单字幕模式
     */
    async function enableSingleSubtitle() {
        safeLog('开始执行单字幕模式...');

        // const subtitleBtn = Array.from(document.querySelectorAll('.bpx-player-ctrl-subtitle-result')).find(el => el.textContent.includes('字幕'));
        const subtitleBtn = await waitForElement('.bpx-player-ctrl-subtitle[aria-label*="字幕"]', 500);
        if (!subtitleBtn) {
            safeLog('未找到字幕按钮，中止操作');
            return false;
        }

        safeLog('找到字幕按钮，执行点击');
        subtitleBtn.click();

        // 选择中文字幕
        const chineseItem = await waitForElement('.bpx-player-ctrl-subtitle-major .bpx-player-ctrl-subtitle-language-item[data-lan*="zh"]');
        if (!chineseItem) {
            safeLog('未找到中文字幕选项');
            return false;
        }

        safeLog('找到中文字幕选项，执行点击');
        chineseItem.click();
        chineseItem.classList.add('bpx-state-active');

        safeLog('✅ 单字幕模式操作完成');
        return true;
    }

    /**
     * 双语字幕模式
     */
    async function enableBilingualSubtitles() {
        safeLog('开始执行双语字幕模式...');

        const subtitleBtn = await waitForElement('.bpx-player-ctrl-subtitle[aria-label*="字幕"]', 500);
        if (!subtitleBtn) {
            safeLog('未找到字幕按钮，中止操作');
            return false;
        }

        safeLog('找到字幕按钮，执行点击');
        subtitleBtn.click();

        // 定位双语开关
        const switchInput = await waitForElement('.bpx-player-ctrl-subtitle-bilingual-bottom input.bui-switch-input');
        if (!switchInput) {
            safeLog('未找到找到双语开关');
        }

        safeLog('找到双语开关，执行开启操作');
        if(!switchInput.checked){
            safeLog('当前状态未开启，开始启用双语字幕');
            switchInput.click();
            switchInput.checked = true;
        }

        // 选择主字幕（中文）
        const majorChinese = await waitForElement('.bpx-player-ctrl-subtitle-major .bpx-player-ctrl-subtitle-language-item[data-lan*="zh"]');
        if (!majorChinese) {
            safeLog('未找到中文字幕选项');
            return false;
        }

        safeLog('选择主字幕: 中文');
        majorChinese.click();
        majorChinese.classList.add('bpx-state-active');

        // 选择副字幕（English）
        const minorEnglish = await waitForElement('.bpx-player-ctrl-subtitle-minor .bpx-player-ctrl-subtitle-language-item[data-lan*="en"]');
        if (!minorEnglish) {
            safeLog('未找到 English 字幕选项');
            return false;

        }

        safeLog('选择副字幕: English');
        minorEnglish.click();
        minorEnglish.classList.add('bpx-state-active');


        safeLog('✅ 双语字幕模式操作完成');
        return true;
    }

    /**
     * 主执行函数
     */
    async function main() {
        safeLog('字幕控件已加载，开始字幕检测...');
        const scenario = await detectSubtitleScenario();

        switch(scenario) {
            case 'SINGLE':
                await enableSingleSubtitle();
                break;
            case 'BILINGUAL':
                await enableBilingualSubtitles();
                break;
            default:
                safeLog(`无需操作的场景: ${scenario}`);
                return;
        }
    }


    // 调试工具
    if (DEBUG) {
        window.__bilibiliSubtitleDebug = {
            detectScenario: detectSubtitleScenario,
            enableSingle: enableSingleSubtitle,
            enableBilingual: enableBilingualSubtitles
        };
        safeLog('已添加调试工具: window.__bilibiliSubtitleDebug');
    }

    function initUrlWatcher(onUrlChange) {
        // 监听浏览器原生后退/前进按钮
        window.addEventListener('popstate', onUrlChange);
        // 监听锚点变化
        window.addEventListener('hashchange', onUrlChange);

        // 重写 history.pushState (SPA 常用跳转方式)
        const originalPushState = history.pushState;
        history.pushState = function() {
            originalPushState.apply(this, arguments);
            onUrlChange();
        };

        // 重写 history.replaceState
        const originalReplaceState = history.replaceState;
        history.replaceState = function() {
            originalReplaceState.apply(this, arguments);
            onUrlChange();
        };
    }

    /**
     * 安全执行器：防止短时间内多次触发
     */
    let timer = null;
    function handleRouteUpdate() {
        // 如果 URL 没变，则不触发（排除纯参数顺序改变等干扰）
        if (location.href === lastUrl) return;
        lastUrl = location.href;

        // 防抖处理：等待页面 DOM 渲染（有些框架跳转后 DOM 不立即就绪）
        clearTimeout(timer);
        timer = setTimeout(async () => {
            try {
                await main();
            } catch (err) {
                safeLog('❌ 脚本执行出错:', err);
                console.error(`${LOG_PREFIX} 脚本错误:`, err);
            }
        }, 1000);
    }

    // --- 3. 脚本启动入口 ---
    function init() {
        // 1. 立即执行一次
        main().catch(err => {
            safeLog('❌ 初始执行出错:', err);
        });

        // 2. 开启 URL 变化监听
        initUrlWatcher(handleRouteUpdate);
    }

    init();

})();