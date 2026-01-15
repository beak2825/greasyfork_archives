// ==UserScript==
// @name         Linux.do 自动跳转外部链接
// @namespace    https://github.com/sxjeru
// @version      0.2
// @description  当 linux.do 出现“打开外部链接”弹窗时，自动点击继续按钮
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

    // 预定义的类名，避免重复创建字符串
    const TARGET_CLASS = 'd-modal';
    const TITLE_CLASS = '.d-modal__title-text';
    const CONFIRM_BTN_CLASS = '.d-modal__footer .btn-primary';

    // 具体的处理逻辑
    function checkAndClick(node) {
        // 1. 检查节点本身是否是弹窗，或者节点内部包含弹窗
        // Discourse 通常会插入一个包含 d-modal 的容器，或者直接插入 d-modal
        let modal = null;

        if (node.classList && node.classList.contains(TARGET_CLASS)) {
            modal = node;
        } else if (node.querySelector) {
            modal = node.querySelector(`.${TARGET_CLASS}`);
        }

        if (!modal) return;

        // 2. 验证标题（双重保险，防止误点其他确认框）
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
                // 遍历每一个新增的节点
                for (const node of mutation.addedNodes) {
                    // 只有当节点是元素节点 (Type 1) 时才处理
                    if (node.nodeType === 1) {
                        checkAndClick(node);
                    }
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true, // 监控子节点添加/删除
        subtree: true, // 监控所有后代节点（必须开启，因为弹窗可能插入在深层容器中）
    });

})();