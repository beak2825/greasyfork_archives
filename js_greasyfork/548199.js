// ==UserScript==
// @name         123网盘论坛自动回复（多样化文案版）
// @namespace    https://tampermonkey.net/
// @version      3.5
// @description  禁止页面移动+极速回复+多样化自然文案
// @author       自动回复工具
// @match        https://pan1.me/*
// @match        https://*.pan1.me/*
// @match        https://123panfx.com/*
// @match        https://*.123panfx.com/*
// @grant        none
// @run-at       document-interactive
// @license      MIT  // 新增：声明MIT许可证
// @downloadURL https://update.greasyfork.org/scripts/548199/123%E7%BD%91%E7%9B%98%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%EF%BC%88%E5%A4%9A%E6%A0%B7%E5%8C%96%E6%96%87%E6%A1%88%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/548199/123%E7%BD%91%E7%9B%98%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%EF%BC%88%E5%A4%9A%E6%A0%B7%E5%8C%96%E6%96%87%E6%A1%88%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function log(message) {
        console.log(`[自动回复] ${message}`);
    }

    // 防滚动机制
    function preventScroll(action) {
        const scrollX = window.pageXOffset;
        const scrollY = window.pageYOffset;
        action();
        window.scrollTo(scrollX, scrollY);
    }

    // 帖子识别
    const REPLY_TIP = '您好，本帖含有特定内容，请回复后再查看。';
    function isThreadPage() {
        const containers = document.querySelectorAll('.post-content, .tip, .alert, .notice');
        for (const el of containers) {
            if (el.textContent.trim() === REPLY_TIP) {
                log("检测到目标帖子");
                return true;
            }
        }
        return false;
    }

    // 【更新：多样化自然回复文案库（无"解锁"关键词）】
    const replyTexts = [
        "感谢楼主分享，内容很实用，收藏了~",
        "这个资源看起来很棒，谢谢分享！",
        "刚好需要这类内容，太及时了，感谢！",
        "楼主辛苦啦，内容很有价值，支持一下",
        "之前一直在找类似的，谢谢分享👍",
        "内容不错，已保存，感谢整理～",
        "很实用的分享，感谢楼主的用心",
        "这个很有帮助，谢谢啦！",
        "支持一下，内容很精彩",
        "感谢分享，学到了不少",
        "楼主太给力了，谢谢分享资源",
        "内容很优质，感谢分享出来",
        "刚好能用上，感谢楼主的分享",
        "收藏了，慢慢研究，谢谢～",
        "很赞的分享，感谢付出！",
        "这份分享太及时了，谢谢楼主",
        "内容很丰富，感谢整理和分享",
        "支持原创分享，谢谢楼主",
        "找了好久终于遇到了，感谢分享",
        "内容对我很有帮助，谢谢！"
    ];

    // 随机选择回复内容
    function getRandomReply() {
        return replyTexts[Math.floor(Math.random() * replyTexts.length)];
    }

    // 已回复检测
    function hasReplied() {
        const replyStatus = document.querySelector('.my-reply, .post-footer .status');
        if (!replyStatus) return false;

        const text = replyStatus.textContent;
        return text.includes('已回复') || text.includes('您已参与') || text.includes('回复成功');
    }

    // 元素查找合并查询
    function findElements() {
        const result = { replyBox: null, submitBtn: null };
        const candidates = document.querySelectorAll(
            'textarea, button, input[type="submit"], input[type="button"], [contenteditable="true"]'
        );

        for (const el of candidates) {
            if (!result.replyBox) {
                if (el.tagName === 'TEXTAREA' && (el.name === 'message' || el.id === 'content' || el.classList.contains('reply-textarea'))) {
                    result.replyBox = el;
                } else if (el.isContentEditable && el.classList.contains('reply-editor')) {
                    result.replyBox = el;
                }
            }

            if (!result.submitBtn && (el.tagName === 'BUTTON' || el.type === 'submit' || el.type === 'button')) {
                const text = (el.textContent || el.value || '').trim().toLowerCase();
                if (text.includes('回复') || text.includes('回帖') || text.includes('发表')) {
                    result.submitBtn = el;
                }
            }

            if (result.replyBox && result.submitBtn) break;
        }

        return result;
    }

    // 填充提交无延迟
    function fillAndSubmit(replyBox, submitBtn, text) {
        if (replyBox.tagName === 'TEXTAREA') {
            replyBox.value = text;
        } else if (replyBox.isContentEditable) {
            replyBox.innerText = text;
        }
        replyBox.dispatchEvent(new Event('input', { bubbles: true }));
        preventScroll(() => submitBtn.click());
    }

    // 核心流程
    function executeReply() {
        if (hasReplied()) {
            log("已回复，无需操作");
            return;
        }

        const { replyBox, submitBtn } = findElements();

        if (replyBox && submitBtn) {
            const replyText = getRandomReply();
            fillAndSubmit(replyBox, submitBtn, replyText);
            log("极速回复完成");
            return;
        }

        setTimeout(() => {
            const { replyBox: retryBox, submitBtn: retryBtn } = findElements();
            if (retryBox && retryBtn) {
                fillAndSubmit(retryBox, retryBtn, getRandomReply());
                log("重试后回复完成");
            } else {
                log("未找到必要元素");
            }
        }, 200);
    }

    // 初始化
    function init() {
        if (isThreadPage()) {
            setTimeout(executeReply, 50);
        }
    }

    init();
})();
