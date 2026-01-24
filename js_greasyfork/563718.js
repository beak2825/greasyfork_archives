// ==UserScript==
// @name         Linux.do外链免弹窗跳转
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  智能绕过Linux.do外部链接确认弹窗，提升浏览体验。
// @author       skyow
// @match        https://linux.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563718/Linuxdo%E5%A4%96%E9%93%BE%E5%85%8D%E5%BC%B9%E7%AA%97%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/563718/Linuxdo%E5%A4%96%E9%93%BE%E5%85%8D%E5%BC%B9%E7%AA%97%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --------------------------
    // 配置选项
    // --------------------------
    const CONFIG = {
        DEBUG: false,                    // 调试模式
        SAFETY_TIMEOUT: 500,             // 安全时间窗口(ms)
        OPEN_NEW_TAB: true,              // 新标签页打开链接
        MODAL_CHECK_INTERVAL: 100,       // 弹窗检查间隔(ms)

        // CSS选择器
        SELECTORS: {
            EXTERNAL_LINK: 'a.normal-external-link-icon',
            MODAL: '.modal.d-modal',
            MODAL_TITLE: 'h1.d-modal__title-text',
            CONFIRM_BTN: '.btn.btn-icon-text.btn-primary, .d-modal__footer .btn-primary'
        }
    };

    // --------------------------
    // 全局变量
    // --------------------------
    let lastLeftClickTime = 0;
    let modalCheckTimer = null;

    // --------------------------
    // 工具函数
    // --------------------------
    const log = (...args) => CONFIG.DEBUG && console.log('[Linux.do Bypass]', ...args);

    // --------------------------
    // 核心功能
    // --------------------------

    // 1. 统一的点击事件处理（合并两个监听器）
    document.addEventListener('click', (e) => {
        // 仅处理左键点击，右键直接返回
        if (e.button !== 0) {
            log('非左键点击，直接返回');
            return;
        }

        // 记录左键点击时间
        lastLeftClickTime = Date.now();
        log('记录左键点击时间:', lastLeftClickTime);

        // 检查是否是外部链接
        const link = e.target.closest(CONFIG.SELECTORS.EXTERNAL_LINK);
        if (link) {
            log('拦截外部链接左键点击:', link.href);
            // 直接打开链接
            window.open(link.href, CONFIG.OPEN_NEW_TAB ? '_blank' : '_self');
            // 阻止默认行为，防止弹出确认窗口
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);

    // 2. 阻止右键点击时的默认行为被干扰
    document.addEventListener('contextmenu', (e) => {
        // 右键菜单正常显示，不做任何处理
        log('检测到右键点击，正常显示菜单');
        // 确保不阻止右键菜单，不调用preventDefault
    }, true);

    // 3. 检查并关闭弹窗
    const closeModal = () => {
        // 安全检查
        if (Date.now() - lastLeftClickTime > CONFIG.SAFETY_TIMEOUT) {
            log('弹窗超时或非左键触发，忽略');
            return;
        }

        const modal = document.querySelector(CONFIG.SELECTORS.MODAL);
        if (!modal) return;

        const title = modal.querySelector(CONFIG.SELECTORS.MODAL_TITLE);
        if (title && title.innerText.trim() === '打开外部链接') {
            const confirmBtn = modal.querySelector(CONFIG.SELECTORS.CONFIRM_BTN);
            if (confirmBtn) {
                log('检测到弹窗，自动点击继续');
                confirmBtn.click();
                // 清除定时器，避免重复检查
                if (modalCheckTimer) {
                    clearTimeout(modalCheckTimer);
                    modalCheckTimer = null;
                }
            }
        }
    };

    // 4. 高效的弹窗监控（结合MutationObserver和定时器）
    const observer = new MutationObserver((mutations) => {
        let modalFound = false;

        // 快速检查新增节点
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        // 检查是否是弹窗或包含弹窗
                        if (node.matches(CONFIG.SELECTORS.MODAL) || node.querySelector(CONFIG.SELECTORS.MODAL)) {
                            modalFound = true;
                            break;
                        }
                    }
                }
                if (modalFound) break;
            }
        }

        if (modalFound) {
            closeModal();
        }
    });

    // 5. 初始化
    const init = () => {
        // 启动MutationObserver
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        // 初始检查
        closeModal();

        log('脚本已加载 v5.0');
    };

    // --------------------------
    // 启动脚本
    // --------------------------
    // 确保DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 页面卸载时清理资源
    window.addEventListener('beforeunload', () => {
        observer.disconnect();
        if (modalCheckTimer) {
            clearTimeout(modalCheckTimer);
        }
    });

})();