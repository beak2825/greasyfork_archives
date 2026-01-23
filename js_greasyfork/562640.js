// ==UserScript==
// @name         Linux.do 自动跳转外部链接
// @namespace    https://github.com/sxjeru
// @version      1.0
// @description  当 linux.do 出现“打开外部链接”弹窗时，自动点击继续按钮（仅左键点击时生效）
// @author       sxjeru
// @match        https://linux.do/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562640/Linuxdo%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%A4%96%E9%83%A8%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/562640/Linuxdo%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%A4%96%E9%83%A8%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = false;

    // 预定义的类名
    const TARGET_CLASS = 'd-modal';
    const TITLE_CLASS = '.d-modal__title-text';
    const CONFIRM_BTN_CLASS = '.d-modal__footer .btn-primary';

    // 记录最后一次左键点击的时间戳
    let lastLeftClickTime = 0;

    // 监听全局点击事件（捕获阶段），只记录左键点击
    document.addEventListener('click', (e) => {
        // e.button === 0 代表左键
        if (e.button === 0) {
            lastLeftClickTime = Date.now();
        }
    }, true);

    // 具体的处理逻辑
    function checkAndClick(node) {
        // 0. 安全检查：如果弹窗出现的时间距离上一次左键点击超过 500ms，说明可能不是左键触发的（例如右键、脚本或其他方式），则忽略
        if (Date.now() - lastLeftClickTime > 500) {
            if (DEBUG) console.log('检测到弹窗，但非左键点击触发，忽略。');
            return;
        }

        // 1. 检查节点本身是否是弹窗，或者节点内部包含弹窗
        let modal = null;
        if (node.classList && node.classList.contains(TARGET_CLASS)) {
            modal = node;
        } else if (node.querySelector) {
            modal = node.querySelector(`.${TARGET_CLASS}`);
        }

        if (!modal) return;

        // 2. 验证标题
        const titleElement = modal.querySelector(TITLE_CLASS);
        if (titleElement && titleElement.innerText.trim() === '打开外部链接') {
            const confirmBtn = modal.querySelector(CONFIRM_BTN_CLASS);
            if (confirmBtn) {
                if (DEBUG) console.log('检测到外部链接拦截，已自动点击跳转。');
                confirmBtn.click();
            }
        }
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        checkAndClick(node);
                    }
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

})();