// ==UserScript==
// @name         知乎净化工具
// @name:en      Zhihu Purifier
// @namespace    https://github.com/b1n // 使用你的ID，确保全球唯一
// @version      1.0
// @description  一个强大的知乎净化工具：专注宽屏 | 匿名模式 | 彻底移除元素 | 隐藏顶栏 | 全方位屏蔽 | 智能跳转。
// @description:en A powerful Zhihu purification tool: Widescreen | Anonymous Mode | Remove Elements | Hide Header | Block Everything | Smart Redirect.
// @author       bin
// @match        *://*.zhihu.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @homepageURL  https://greasyfork.org/zh-CN/scripts/你的脚本发布后的ID // 发布后再回来填
// @supportURL   https://greasyfork.org/zh-CN/scripts/你的脚本发布后的ID/feedback // 发布后再回来填
// @downloadURL https://update.greasyfork.org/scripts/555491/%E7%9F%A5%E4%B9%8E%E5%87%80%E5%8C%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/555491/%E7%9F%A5%E4%B9%8E%E5%87%80%E5%8C%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置与日志 ---
    let minLength = GM_getValue('minLength', 200);
    let removalMethod = GM_getValue('removalMethod', 'remove');
    let widescreenEnabled = GM_getValue('widescreenEnabled', true);
    let hideHeaderEnabled = GM_getValue('hideHeaderEnabled', true);
    let anonymousModeEnabled = GM_getValue('anonymousModeEnabled', false); // 新增：匿名模式，默认关闭
    let blockAnswerCardEnabled = GM_getValue('blockAnswerCardEnabled', true);
    let autoExpandEnabled = GM_getValue('autoExpandEnabled', true);
    let blockAdsEnabled = GM_getValue('blockAdsEnabled', true);
    const log = (message) => console.log(`[知乎净化器] ${message}`);

    // --- 核心处理函数 ---
    const processElement = (element) => {
        if (element.dataset.processed === 'true') return;

        let shouldProcess = false;
        let reason = '';

        if (blockAdsEnabled && element.matches('.Pc-word-new')) {
            shouldProcess = true; reason = '广告';
        }
        else if (blockAnswerCardEnabled && element.matches('.AnswerTopCard, [class*="KfeCollection"]')) {
            shouldProcess = true; reason = '回答内推荐';
        }
        else if (element.matches('.AnswerItem, .CommentItem')) {
            const contentElement = element.querySelector('.RichContent, .CommentContent');
            if (contentElement && contentElement.innerText.trim().length < minLength) {
                shouldProcess = true; reason = `短内容 (字数=${contentElement.innerText.trim().length})`;
            }
        }

        if (shouldProcess) {
            const container = element.closest('.List-item') || element;
            log(`判定: [${reason}] -> 操作目标: ${container.className}`);
            if (removalMethod === 'remove') container.remove();
            else container.style.display = 'none';
        }

        element.dataset.processed = 'true';
    };

    // --- 重新处理所有内容 ---
    const reprocessAllContent = () => {
        log(`--- 用户触发重新处理 ---`);
        document.querySelectorAll('.AnswerItem, .CommentItem, .Pc-word-new, .AnswerTopCard, [class*="KfeCollection"]').forEach(item => {
            item.dataset.processed = 'false';
            if (removalMethod === 'hide') item.style.display = '';
            processElement(item);
        });
    };

    // --- 注入/应用全局样式 ---
    const applyGlobalStyles = () => {
        const styleId = 'zh-purifier-styles';
        let existingStyle = document.getElementById(styleId);
        if (existingStyle) existingStyle.remove();

        let styles = `
            /* 匿名模式 */
            .zh-purifier-anonymous .AnswerItem-authorInfo { display: none !important; }
            /* 专注宽屏 */
            .zh-purifier-widescreen .Question-sideColumn { display: none !important; }
            .zh-purifier-widescreen .Question-mainColumn { width: 100% !important; max-width: none !important; }
            /* 隐藏顶栏 */
            .zh-purifier-hide-header #root > div > div.css-s8xum0 > header { display: none !important; }
        `;

        GM_addStyle(styles, styleId);

        document.body.classList.toggle('zh-purifier-anonymous', anonymousModeEnabled);
        document.body.classList.toggle('zh-purifier-widescreen', widescreenEnabled);
        document.body.classList.toggle('zh-purifier-hide-header', hideHeaderEnabled);

        log('全局样式已应用。');
    };

    // --- UI创建 (V2.0 最终版) ---
    const createUI = () => {
        const uiHTML = `
            <div id="zhihu-helper-fab">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61-.25-1.17-.59-1.69-.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19-.15-.24-.42-.12.64l2 3.46c.12-.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49.42l.38-2.65c.61-.25 1.17-.59-1.69-.98l2.49 1c.23-.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>
            </div>
            <div id="zhihu-helper-sidebar" class="closed">
                <div id="zhihu-helper-content">
                    <h3>知乎遗风净化器</h3>
                    <div class="setting-row"><label>回答最短字数</label><input type="number" id="minLengthInput" value="${minLength}"></div>
                    <div class="setting-row"><label>屏蔽回答方式</label><select id="removalMethodSelect"><option value="remove">移除 (彻底)</option><option value="hide">隐藏 (可逆)</option></select></div>
                    <div class="setting-row"><label>专注宽屏</label><label class="switch"><input type="checkbox" id="widescreenToggle" ${widescreenEnabled ? 'checked' : ''}><span class="slider"></span></label></div>
                    <div class="setting-row"><label>隐藏顶栏</label><label class="switch"><input type="checkbox" id="hideHeaderToggle" ${hideHeaderEnabled ? 'checked' : ''}><span class="slider"></span></label></div>
                    <div class="setting-row"><label>匿名模式</label><label class="switch"><input type="checkbox" id="anonymousModeToggle" ${anonymousModeEnabled ? 'checked' : ''}><span class="slider"></span></label></div>
                    <div class="setting-row"><label>屏蔽广告</label><label class="switch"><input type="checkbox" id="blockAdsToggle" ${blockAdsEnabled ? 'checked' : ''}><span class="slider"></span></label></div>
                    <div class="setting-row"><label>屏蔽回答内推荐</label><label class="switch"><input type="checkbox" id="blockAnswerCardToggle" ${blockAnswerCardEnabled ? 'checked' : ''}><span class="slider"></span></label></div>
                    <div class="setting-row"><label>自动跳转</label><label class="switch"><input type="checkbox" id="autoExpandToggle" ${autoExpandEnabled ? 'checked' : ''}><span class="slider"></span></label></div>
                    <button id="saveBtn">保存并应用</button>
                    <p id="statusMsg"></p>
                </div>
            </div>
        `;
        const uiCSS = `
            #zhihu-helper-fab { position: fixed; bottom: 30px; right: 30px; width: 48px; height: 48px; background-color: rgba(0, 0, 0, 0.45); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: all 0.2s ease; z-index: 9998; }
            #zhihu-helper-fab:hover { background-color: rgba(0, 0, 0, 0.6); transform: scale(1.05); }
            #zhihu-helper-sidebar { position: fixed; top: 120px; right: -280px; width: 260px; background: rgba(245, 245, 245, 0.75); backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); z-index: 9999; transition: right 0.4s cubic-bezier(0.25, 1, 0.5, 1); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
            #zhihu-helper-sidebar.open { right: 20px; }
            #zhihu-helper-content { padding: 20px; }
            #zhihu-helper-content h3 { margin-top: 0; margin-bottom: 20px; color: #1d1d1f; font-weight: 600; }
            .setting-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
            #zhihu-helper-content label { font-size: 15px; color: #333; }
            #zhihu-helper-content input[type="number"] { width: 70px; padding: 8px; border: 1px solid rgba(0, 0, 0, 0.1); background: rgba(255, 255, 255, 0.6); border-radius: 8px; font-size: 15px; color: #1d1d1f; text-align: center; }
            #zhihu-helper-content select { padding: 8px; border: 1px solid rgba(0, 0, 0, 0.1); background: rgba(255, 255, 255, 0.6); border-radius: 8px; font-size: 14px; }
            #zhihu-helper-content button { width: 100%; padding: 10px; background-color: rgba(0, 122, 255, 0.9); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 15px; font-weight: 500; transition: background-color 0.2s ease; margin-top: 10px; }
            #zhihu-helper-content button:hover { background-color: rgba(0, 122, 255, 1); }
            #statusMsg { margin-top: 15px; font-size: 13px; color: #007bff; min-height: 1.2em; text-align: center; }
            .switch { position: relative; display: inline-block; width: 50px; height: 28px; } .switch input { opacity: 0; width: 0; height: 0; }
            .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 28px; }
            .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
            input:checked + .slider { background-color: #007bff; } input:checked + .slider:before { transform: translateX(22px); }
            /* --- 手机端适配样式 --- */
@media (max-width: 768px) {
    /* 当屏幕宽度小于768像素时，以下样式生效 */

    /* 1. 让悬浮按钮变得更小、更靠边 */
    #zhihu-helper-fab {
        width: 40px;       /* 变小一点 */
        height: 40px;
        bottom: 20px;      /* 更贴近角落 */
        right: 20px;
    }

    /* 2. 让设置面板不再悬浮，而是从底部滑出，占满整个屏幕宽度 */
    #zhihu-helper-sidebar {
        width: 100%;       /* 占满宽度 */
        top: auto;         /* 解除顶部固定 */
        bottom: -100%;     /* 初始状态下藏在屏幕下方 */
        right: 0;          /* 贴紧右边 */
        left: 0;           /* 贴紧左边 */
        border-radius: 12px 12px 0 0; /* 只保留顶部圆角 */
        transition: bottom 0.3s ease-in-out; /* 动画效果改成从底部滑出 */
    }

    #zhihu-helper-sidebar.open {
        bottom: 0;         /* 打开时，滑到屏幕底部 */
        right: 0;          /* 确保贴紧 */
    }
}
        `;
        GM_addStyle(uiCSS);
        document.body.insertAdjacentHTML('beforeend', uiHTML);

        document.getElementById('removalMethodSelect').value = removalMethod;

        document.getElementById('saveBtn').addEventListener('click', () => {
            minLength = parseInt(document.getElementById('minLengthInput').value, 10);
            removalMethod = document.getElementById('removalMethodSelect').value;
            widescreenEnabled = document.getElementById('widescreenToggle').checked;
            hideHeaderEnabled = document.getElementById('hideHeaderToggle').checked;
            anonymousModeEnabled = document.getElementById('anonymousModeToggle').checked;
            blockAdsEnabled = document.getElementById('blockAdsToggle').checked;
            blockAnswerCardEnabled = document.getElementById('blockAnswerCardToggle').checked;
            autoExpandEnabled = document.getElementById('autoExpandToggle').checked;

            GM_setValue('minLength', minLength); GM_setValue('removalMethod', removalMethod);
            GM_setValue('widescreenEnabled', widescreenEnabled); GM_setValue('hideHeaderEnabled', hideHeaderEnabled);
            GM_setValue('anonymousModeEnabled', anonymousModeEnabled); GM_setValue('blockAdsEnabled', blockAdsEnabled);
            GM_setValue('blockAnswerCardEnabled', blockAnswerCardEnabled); GM_setValue('autoExpandEnabled', autoExpandEnabled);

            document.getElementById('statusMsg').textContent = '设置已保存';
            applyGlobalStyles();
            reprocessAllContent();
            setTimeout(() => document.getElementById('statusMsg').textContent = '', 2000);
        });
        document.getElementById('zhihu-helper-fab').addEventListener('click', () => {
            document.getElementById('zhihu-helper-sidebar').classList.toggle('open');
        });
    };

    // --- “哨兵”：监视新加载的内容 ---
    const observeNewContent = (container) => {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType !== 1) return;
                        processElement(node);
                        node.querySelectorAll('.AnswerItem, .CommentItem, .Pc-word-new, .AnswerTopCard, [class*="KfeCollection"]').forEach(processElement);
                    });
                }
            }
        });
        observer.observe(container, { childList: true, subtree: true });
    };

    // --- 自动跳转功能 ---
    const handleAutoExpand = () => {
        if (!autoExpandEnabled) return false;
        const expandButton = document.querySelector('a.ViewAll-QuestionMainAction');
        if (expandButton) {
            log("发现“查看全部回答”按钮，即将自动跳转...");
            setTimeout(() => expandButton.click(), 500);
            return true;
        }
        return false;
    };

    // --- 脚本主程序 ---
    const main = () => {
        log(`脚本启动！`);
        applyGlobalStyles();
        createUI();

        if (handleAutoExpand()) {
            log("自动跳转已触发。此页面任务结束。");
            return;
        }

        const startupObserver = new MutationObserver((mutations, observer) => {
            const container = document.querySelector('#QuestionAnswers-answers, .Comments-container');
            if (container) {
                observer.disconnect();
                const existingItems = document.querySelectorAll('.AnswerItem, .CommentItem, .Pc-word-new, .AnswerTopCard, [class*="KfeCollection"]');
                log(`首次扫描发现 ${existingItems.length} 个待处理项。`);
                existingItems.forEach(processElement);
                observeNewContent(container);
            }
        });
        startupObserver.observe(document.body, { childList: true, subtree: true });
    };

    main();

})();