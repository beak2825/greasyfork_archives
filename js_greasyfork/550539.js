// ==UserScript==
// @name         夸克网盘自动关闭保存成功弹窗
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动关闭夸克网盘保存文件后的弹窗
// @author       You
// @match        *://pan.quark.cn/*
// @match        *://*.quark.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quark.cn
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550539/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E4%BF%9D%E5%AD%98%E6%88%90%E5%8A%9F%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/550539/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E4%BF%9D%E5%AD%98%E6%88%90%E5%8A%9F%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('[夸克网盘助手] 脚本已启动');

    // 多种关闭弹窗的方法
    function closeDialog() {
        // 方法1: 查找关闭按钮 (X按钮)
        const closeButtons = document.querySelectorAll('[class*="close"]');
        closeButtons.forEach(btn => {
            if (btn && btn.offsetParent !== null) {
                console.log('[夸克网盘助手] 找到关闭按钮，点击关闭');
                btn.click();
                return true;
            }
        });

        // 方法2: 查找包含"保存成功"的弹窗并点击遮罩层关闭
        const dialogs = document.querySelectorAll('[class*="dialog"], [class*="modal"], [role="dialog"]');
        dialogs.forEach(dialog => {
            if (dialog.textContent.includes('保存成功') || dialog.textContent.includes('已保存')) {
                console.log('[夸克网盘助手] 找到保存成功弹窗');

                // 尝试点击遮罩层
                const mask = document.querySelector('[class*="mask"]');
                if (mask) {
                    console.log('[夸克网盘助手] 点击遮罩层关闭');
                    mask.click();
                    return true;
                }

                // 尝试按ESC键
                const escEvent = new KeyboardEvent('keydown', {
                    key: 'Escape',
                    code: 'Escape',
                    keyCode: 27,
                    which: 27,
                    bubbles: true,
                    cancelable: true
                });
                document.dispatchEvent(escEvent);
                console.log('[夸克网盘助手] 模拟按ESC键');
                return true;
            }
        });

        // 方法3: 直接移除弹窗元素
        const saveDialogs = document.querySelectorAll('[class*="dialog"], [class*="modal"]');
        saveDialogs.forEach(dialog => {
            const text = dialog.textContent;
            if (text.includes('保存成功') || text.includes('已保存') || text.includes('立即查看')) {
                console.log('[夸克网盘助手] 直接移除弹窗元素');
                dialog.remove();

                // 同时移除遮罩层
                const masks = document.querySelectorAll('[class*="mask"]');
                masks.forEach(m => m.remove());
                return true;
            }
        });
    }

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // 元素节点
                        const text = node.textContent || '';

                        // 检测到保存成功弹窗
                        if (text.includes('保存成功') || text.includes('已保存')) {
                            console.log('[夸克网盘助手] 检测到保存成功弹窗，准备关闭');

                            // 延迟关闭，确保弹窗完全加载
                            setTimeout(() => {
                                closeDialog();
                            }, 500);

                            // 多次尝试关闭
                            setTimeout(() => {
                                closeDialog();
                            }, 1000);
                        }
                    }
                });
            }
        });
    });

    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 定时检查并关闭弹窗（后备方案）
    setInterval(() => {
        closeDialog();
    }, 1000);

    console.log('[夸克网盘助手] 监听器已启动');
})();
