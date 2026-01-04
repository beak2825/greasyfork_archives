// ==UserScript==
// @name         通用网盘自动关闭保存成功弹窗
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  自动关闭所有主流网盘(夸克/百度/迅雷/阿里/天翼/115/蓝奏云等)保存文件后的弹窗
// @author       You
// @match        *://pan.quark.cn/*
// @match        *://*.quark.cn/*
// @match        *://pan.baidu.com/*
// @match        *://*.baidu.com/*
// @match        *://pan.xunlei.com/*
// @match        *://*.xunlei.com/*
// @match        *://www.aliyundrive.com/*
// @match        *://*.aliyundrive.com/*
// @match        *://www.alipan.com/*
// @match        *://*.alipan.com/*
// @match        *://cloud.189.cn/*
// @match        *://*.189.cn/*
// @match        *://115.com/*
// @match        *://*.115.com/*
// @match        *://*.lanzou*.com/*
// @match        *://*.ilanzou.com/*
// @match        *://www.123pan.com/*
// @match        *://*.123pan.com/*
// @match        *://www.jianguoyun.com/*
// @match        *://*.jianguoyun.com/*
// @match        *://www.weiyun.com/*
// @match        *://*.weiyun.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pan.baidu.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557665/%E9%80%9A%E7%94%A8%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E4%BF%9D%E5%AD%98%E6%88%90%E5%8A%9F%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/557665/%E9%80%9A%E7%94%A8%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E4%BF%9D%E5%AD%98%E6%88%90%E5%8A%9F%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取当前网站名称
    const hostname = window.location.hostname;
    let siteName = '网盘';
    if (hostname.includes('quark')) siteName = '夸克网盘';
    else if (hostname.includes('baidu')) siteName = '百度网盘';
    else if (hostname.includes('xunlei')) siteName = '迅雷网盘';
    else if (hostname.includes('aliyun') || hostname.includes('alipan')) siteName = '阿里云盘';
    else if (hostname.includes('189')) siteName = '天翼云盘';
    else if (hostname.includes('115')) siteName = '115网盘';
    else if (hostname.includes('lanzou')) siteName = '蓝奏云';
    else if (hostname.includes('123pan')) siteName = '123网盘';
    else if (hostname.includes('jianguoyun')) siteName = '坚果云';
    else if (hostname.includes('weiyun')) siteName = '微云';

    console.log(`[${siteName}助手] 脚本已启动`);

    // 检测弹窗的关键词列表（更全面）
    const successKeywords = [
        '保存成功', '已保存', '保存到', '转存成功', '已转存',
        '添加成功', '已添加', '收藏成功', '已收藏',
        '分享成功', '已分享', '复制成功', '已复制',
        '移动成功', '已移动', '重命名成功',
        '立即查看', '查看文件', '打开客户端', '去查看',
        '我的资源库', '我的云盘', '存储成功'
    ];

    // 检查文本是否包含成功关键词
    function containsSuccessKeyword(text) {
        return successKeywords.some(keyword => text.includes(keyword));
    }

    // 多种关闭弹窗的方法
    function closeDialog() {
        let closed = false;

        // 方法1: 查找并点击关闭按钮 (X按钮)
        const closeSelectors = [
            '[class*="close"]',
            '[class*="Close"]',
            '[aria-label*="关闭"]',
            '[aria-label*="close"]',
            '[title*="关闭"]',
            '[title*="close"]',
            'button[class*="icon-close"]',
            'i[class*="close"]',
            '.ant-modal-close',
            '.el-dialog__close',
            '.modal-close'
        ];

        closeSelectors.forEach(selector => {
            const buttons = document.querySelectorAll(selector);
            buttons.forEach(btn => {
                if (btn && btn.offsetParent !== null) {
                    // 检查按钮所在的弹窗是否包含成功关键词
                    let parent = btn.closest('[class*="dialog"], [class*="modal"], [role="dialog"]');
                    if (parent && containsSuccessKeyword(parent.textContent)) {
                        console.log(`[${siteName}助手] 找到关闭按钮，点击关闭`);
                        btn.click();
                        closed = true;
                    }
                }
            });
        });

        if (closed) return true;

        // 方法2: 查找包含成功关键词的弹窗并尝试关闭
        const dialogSelectors = [
            '[class*="dialog"]',
            '[class*="Dialog"]',
            '[class*="modal"]',
            '[class*="Modal"]',
            '[role="dialog"]',
            '[class*="popup"]',
            '[class*="Popup"]',
            '.ant-modal',
            '.el-dialog',
            '.modal-dialog'
        ];

        dialogSelectors.forEach(selector => {
            const dialogs = document.querySelectorAll(selector);
            dialogs.forEach(dialog => {
                if (containsSuccessKeyword(dialog.textContent)) {
                    console.log(`[${siteName}助手] 找到保存成功弹窗`);

                    // 尝试找到该弹窗内的关闭按钮
                    const closeBtn = dialog.querySelector('[class*="close"], [aria-label*="关闭"]');
                    if (closeBtn) {
                        console.log(`[${siteName}助手] 点击弹窗内的关闭按钮`);
                        closeBtn.click();
                        closed = true;
                        return;
                    }

                    // 尝试点击遮罩层
                    const maskSelectors = [
                        '[class*="mask"]',
                        '[class*="Mask"]',
                        '[class*="overlay"]',
                        '[class*="Overlay"]',
                        '.ant-modal-mask',
                        '.el-dialog__wrapper',
                        '.modal-backdrop'
                    ];

                    maskSelectors.forEach(maskSelector => {
                        const mask = document.querySelector(maskSelector);
                        if (mask && mask.offsetParent !== null) {
                            console.log(`[${siteName}助手] 点击遮罩层关闭`);
                            mask.click();
                            closed = true;
                        }
                    });

                    if (closed) return;

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
                    dialog.dispatchEvent(escEvent);
                    console.log(`[${siteName}助手] 模拟按ESC键`);
                    closed = true;
                }
            });
        });

        if (closed) return true;

        // 方法3: 直接移除包含成功关键词的弹窗元素（激进方案）
        dialogSelectors.forEach(selector => {
            const dialogs = document.querySelectorAll(selector);
            dialogs.forEach(dialog => {
                const text = dialog.textContent;
                if (containsSuccessKeyword(text)) {
                    console.log(`[${siteName}助手] 直接移除弹窗元素`);
                    dialog.remove();
                    closed = true;

                    // 同时移除遮罩层
                    const masks = document.querySelectorAll('[class*="mask"], [class*="overlay"], .ant-modal-mask, .modal-backdrop');
                    masks.forEach(m => {
                        if (m.offsetParent !== null) {
                            m.remove();
                        }
                    });
                }
            });
        });

        return closed;
    }

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // 元素节点
                        const text = node.textContent || '';

                        // 检测到保存成功弹窗
                        if (containsSuccessKeyword(text)) {
                            console.log(`[${siteName}助手] 检测到保存成功弹窗，准备关闭`);

                            // 延迟关闭，确保弹窗完全加载
                            setTimeout(() => {
                                closeDialog();
                            }, 300);

                            // 多次尝试关闭
                            setTimeout(() => {
                                closeDialog();
                            }, 800);

                            setTimeout(() => {
                                closeDialog();
                            }, 1500);
                        }
                    }
                });
            }
        });
    });

    // 开始观察
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } else {
        // 如果body还未加载，等待加载后再观察
        window.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    // 定时检查并关闭弹窗（后备方案，降低频率以减少性能影响）
    setInterval(() => {
        closeDialog();
    }, 2000);

    console.log(`[${siteName}助手] 监听器已启动，支持自动关闭保存成功弹窗`);
})();
