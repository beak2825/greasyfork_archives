// ==UserScript==
// @name         Discourse外链安全解锁器
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Discourse 论坛外链拦截器 & 强制新标签页打开 & 破解登录可见 (支持 linux.do, qingju.me 等)
// @author       Linuxdo (Modified by AI)
// @match        https://linux.do/*
// @match        https://qingju.me/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563020/Discourse%E5%A4%96%E9%93%BE%E5%AE%89%E5%85%A8%E8%A7%A3%E9%94%81%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/563020/Discourse%E5%A4%96%E9%93%BE%E5%AE%89%E5%85%A8%E8%A7%A3%E9%94%81%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'discourse_skip_agreement_signed';
    const CONFIRM_MSG = "【安全警告】\n\n运行此脚本后：\n1. 即使未登录，也能直接看到被隐藏的真实链接（破解 External Link Shield）。\n2. 点击帖子里的链接将不再弹出提示，且会自动在新标签页打开。\n\n你是否确信自己完全不会误点到钓鱼或恶意链接？\n\n点击「确定」启用功能。\n点击「取消」保持原样。";

    // ============================================================
    // 核心功能 1: 破解 "External Link Shield" (未登录查看链接)
    // 原理：劫持 replaceWith，阻止主题组件将真实链接替换为登录跳转链接
    // ============================================================
    const originalReplaceWith = Element.prototype.replaceWith;
    Element.prototype.replaceWith = function(...nodes) {
        // 1. 检查被替换的元素是否为 A 标签，且是否为外链
        if (this.tagName === 'A' && this.href && (this.protocol === 'http:' || this.protocol === 'https:')) {
            const currentHost = window.location.hostname;
            // 确保是外链 (hostname 不包含当前域名，或者不相等)
            if (this.hostname && this.hostname !== currentHost) {

                // 2. 检查替换它的新节点是什么
                if (nodes.length > 0 && nodes[0].tagName === 'A') {
                    const newLink = nodes[0];
                    const newHref = newLink.getAttribute('href');

                    // 3. 特征识别 (基于 secure-links.js 源码分析)
                    // 特征 A: 替换成了相对路径 (通常是 settings.anonymous_redirect_url，即 /login)
                    const isLoginRedirect = newHref && newHref.startsWith('/');

                    // 特征 B: 替换成了带有 secure-links 类的按钮 (TL1 需手动点击查看的情况)
                    const isSecureButton = newLink.classList.contains('secure-links');

                    if (isLoginRedirect || isSecureButton) {
                        // 命中拦截规则！阻止替换，保留原始链接
                        // 可选：给保留下来的链接加个样式，提示已被脚本破解
                        this.style.borderBottom = "2px dashed #ff0000";
                        this.title = "已破解登录/等级限制，直接访问";
                        console.log(`[Link Skipper] 已阻止隐藏外链: ${this.href}`);

                        // 直接返回，不执行原本的 replaceWith
                        return;
                    }
                }
            }
        }
        // 对于其他无关的 DOM 操作，放行
        return originalReplaceWith.apply(this, nodes);
    };


    // ============================================================
    // 核心功能 2: 点击事件拦截 (去弹窗 & 新标签页)
    // ============================================================
    function handler(e) {
        // 检查用户是否已同意协议
        if (localStorage.getItem(STORAGE_KEY) !== 'true') {
            return;
        }

        // 获取点击的链接元素
        const anchor = e.target.closest('a');
        if (!anchor || !anchor.href) return;

        const currentHost = window.location.hostname;
        const targetHost = anchor.hostname;

        // 排除站内链接 (targetHost 等于 currentHost) 或无 host 的链接
        if (!targetHost || targetHost === currentHost) return;

        // 仅处理 http/https 协议
        if (!['http:', 'https:'].includes(anchor.protocol)) return;

        // --- 功能修改区 ---
        // 1. 设置在新标签页打开
        anchor.setAttribute('target', '_blank');
        // 2. 安全性最佳实践 (防止新页面访问 window.opener)
        anchor.setAttribute('rel', 'noopener noreferrer');
        // -----------------

        // 阻止 Discourse 自身的拦截脚本运行 (停止事件传播)
        // 这一步非常关键，因为它阻止了 secure-links.js 中原本绑定在 link 上的 click 事件监听器
        e.stopImmediatePropagation();
    }

    // 监听所有相关鼠标事件，确保在 Discourse 脚本之前截获
    const eventTypes = [
        'click', 'dblclick',
        'mousedown', 'mouseup',
        'contextmenu',
        'auxclick',
        'pointerdown', 'pointerup'
    ];

    eventTypes.forEach(type => {
        // useCapture 设置为 true，确保在捕获阶段优先处理
        window.addEventListener(type, handler, true);
    });

    // 首次运行时的确认弹窗逻辑
    setTimeout(() => {
        const hasAgreed = localStorage.getItem(STORAGE_KEY);

        if (hasAgreed !== 'true') {
            const userAgreed = confirm(CONFIRM_MSG);

            if (userAgreed) {
                localStorage.setItem(STORAGE_KEY, 'true');
                console.log(`✅ 用户已确认，外链拦截器已在 ${window.location.hostname} 生效。`);
            } else {
                console.log('❌ 用户取消，功能处于休眠状态。');
            }
        }
    }, 800);

})();