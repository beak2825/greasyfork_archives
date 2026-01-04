// ==UserScript==
// @name         123网盘资源社区自动签到
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  自动完成123网盘资源社区的每日签到
// @author       自动脚本工具
// @match        https://123panfx.com/*
// @match        https://pan1.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548200/123%E7%BD%91%E7%9B%98%E8%B5%84%E6%BA%90%E7%A4%BE%E5%8C%BA%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/548200/123%E7%BD%91%E7%9B%98%E8%B5%84%E6%BA%90%E7%A4%BE%E5%8C%BA%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 日志输出函数
    function log(message) {
        console.log(`[自动签到][${new Date().toLocaleTimeString()}] ${message}`);
    }

    // 查找签到按钮（通过文本和样式特征）
    function findCheckinButton() {
        // 遍历所有按钮元素
        const buttons = document.querySelectorAll('button, .btn');
        for (const btn of buttons) {
            // 匹配包含"签到"文本的按钮
            const text = btn.textContent.trim();
            if (text.includes('签到') && (text.includes('立即') || text.includes('每日'))) {
                // 额外验证按钮样式（蓝色背景）
                const bgColor = window.getComputedStyle(btn).backgroundColor;
                if (bgColor.includes('rgb(59, 130, 246)') || bgColor.includes('blue')) {
                    log(`找到签到按钮: ${text}`);
                    return btn;
                }
            }
        }
        return null;
    }

    // 检测是否已签到
    function hasCheckedIn() {
        // 检测页面中是否有"已签到"相关文本
        const checkinTexts = ['已签到', '今日已签', '签到成功'];
        const elements = document.querySelectorAll('.签到状态, .tip, .alert, .notice');
        for (const el of elements) {
            const text = el.textContent.trim();
            if (checkinTexts.some(key => text.includes(key))) {
                log(`已签到: ${text}`);
                return true;
            }
        }
        return false;
    }

    // 执行签到操作
    function executeCheckin() {
        log("开始执行自动签到");

        // 检查是否已签到
        if (hasCheckedIn()) {
            return;
        }

        // 查找签到按钮
        const checkinBtn = findCheckinButton();
        if (!checkinBtn) {
            log("未找到签到按钮，可能已签到或页面结构变化");
            return;
        }

        // 点击签到按钮
        checkinBtn.click();
        log("已点击签到按钮");

        // 验证签到结果（延迟1秒检查）
        setTimeout(() => {
            if (hasCheckedIn()) {
                log("签到成功！");
            } else {
                log("签到状态未确认，请手动检查");
            }
        }, 1000);
    }

    // 页面加载完成后执行
    function init() {
        // 确保页面完全加载
        if (document.readyState === 'complete') {
            executeCheckin();
        } else {
            window.addEventListener('load', executeCheckin, { once: true });
        }

        // 监听动态内容加载（应对异步渲染）
        const observer = new MutationObserver((mutations) => {
            if (!hasCheckedIn() && findCheckinButton()) {
                executeCheckin();
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 启动脚本
    init();
})();
