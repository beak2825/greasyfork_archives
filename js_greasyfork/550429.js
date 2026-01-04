// ==UserScript==
// @name         飞书多维表格详情页优化，从右侧半屏改中间弹窗，半透明蒙版增强Bitable
// @namespace    m_fs
// @version      3.0
// @description  献给所有从钉钉teambition被迫迁移到飞书多维表格做任务管理的难友。
// @author       Momo675
// @include      *.feishu.cn/wiki/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550429/%E9%A3%9E%E4%B9%A6%E5%A4%9A%E7%BB%B4%E8%A1%A8%E6%A0%BC%E8%AF%A6%E6%83%85%E9%A1%B5%E4%BC%98%E5%8C%96%EF%BC%8C%E4%BB%8E%E5%8F%B3%E4%BE%A7%E5%8D%8A%E5%B1%8F%E6%94%B9%E4%B8%AD%E9%97%B4%E5%BC%B9%E7%AA%97%EF%BC%8C%E5%8D%8A%E9%80%8F%E6%98%8E%E8%92%99%E7%89%88%E5%A2%9E%E5%BC%BABitable.user.js
// @updateURL https://update.greasyfork.org/scripts/550429/%E9%A3%9E%E4%B9%A6%E5%A4%9A%E7%BB%B4%E8%A1%A8%E6%A0%BC%E8%AF%A6%E6%83%85%E9%A1%B5%E4%BC%98%E5%8C%96%EF%BC%8C%E4%BB%8E%E5%8F%B3%E4%BE%A7%E5%8D%8A%E5%B1%8F%E6%94%B9%E4%B8%AD%E9%97%B4%E5%BC%B9%E7%AA%97%EF%BC%8C%E5%8D%8A%E9%80%8F%E6%98%8E%E8%92%99%E7%89%88%E5%A2%9E%E5%BC%BABitable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_RIGHT = '380px';
    const DIALOG_SELECTOR = 'div[role="dialog"][aria-modal="true"].ud__drawer__content__wrapper';
    const MASK_SELECTOR = '.bitable-drawer-card-mask';

    // 增强原生蒙版样式
    function enhanceNativeMask(mask) {
        if (!mask || mask.hasAttribute('data-enhanced')) return;

        // 让蒙版覆盖整个视口
        mask.style.width = '100%';
        mask.style.left = '0';

        // 设置半透明背景
        mask.style.background = 'rgba(0, 0, 0, 0.5)';

        // 可选：鼠标指针样式（提示可点击）
        mask.style.cursor = 'default';

        // 标记已增强，避免重复处理
        mask.setAttribute('data-enhanced', 'true');
        console.log('🎨 [Bitable 修正器] 原生蒙版已增强：全屏 + 半透明');
    }

    // 强制设置弹窗 right
    function forceSetRight(element) {
        if (!element || !element.style) return;
        if (element.style.right === TARGET_RIGHT) return;

        element.style.right = TARGET_RIGHT;
        console.log('🎯 [Bitable 修正器] 弹窗 right 已设为 540px');

        // 防覆盖：巩固样式
        let attempts = 0;
        const reinforce = () => {
            if (element.style.right !== TARGET_RIGHT && attempts < 3) {
                element.style.right = TARGET_RIGHT;
                attempts++;
                requestAnimationFrame(reinforce);
            }
        };
        requestAnimationFrame(reinforce);
    }

    // 判断弹窗是否激活
    function isDialogActive(element) {
        if (!element) return false;

        const className = element.className;
        if (className.includes('appear-done') || className.includes('enter-done')) {
            return true;
        }

        if (element.style.transform === 'translateX(0px)') {
            return true;
        }

        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight;
    }

    // 处理弹窗元素
    function processDialog(element) {
        if (isDialogActive(element)) {
            forceSetRight(element);
        }
    }

    // 监听 DOM 变化
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'attributes') {
                const target = mutation.target;

                // 如果是弹窗元素 → 处理弹窗
                if (target.matches?.(DIALOG_SELECTOR)) {
                    processDialog(target);
                }

                // 如果是蒙版元素 → 增强蒙版
                if (target.matches?.(MASK_SELECTOR)) {
                    enhanceNativeMask(target);
                }
            }
        }

        // 扫描所有弹窗
        document.querySelectorAll(DIALOG_SELECTOR).forEach(processDialog);

        // 扫描并增强蒙版
        const mask = document.querySelector(MASK_SELECTOR);
        if (mask) enhanceNativeMask(mask);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
    });

    // 初始执行
    document.querySelectorAll(DIALOG_SELECTOR).forEach(processDialog);
    const initialMask = document.querySelector(MASK_SELECTOR);
    if (initialMask) enhanceNativeMask(initialMask);

    // 轻量兜底
    setInterval(() => {
        document.querySelectorAll(DIALOG_SELECTOR).forEach(processDialog);
        const mask = document.querySelector(MASK_SELECTOR);
        if (mask && !mask.hasAttribute('data-enhanced')) {
            enhanceNativeMask(mask);
        }
    }, 2000);

    console.log('🚀 [Bitable 弹窗增强修正器] 已启动：弹窗 right:540px + 原生蒙版全屏半透明');
})();