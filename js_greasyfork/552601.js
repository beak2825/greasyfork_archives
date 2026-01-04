// ==UserScript==
// @name         MakerWorld 国内站国际站搜索切换
// @namespace    https://github.com/SIXiaolong1117/Rules
// @version      0.3
// @description  在 MakerWorld 搜索框旁边放置转到另一个网站的按钮（.com <-> .com.cn）
// @license      MIT
// @icon         https://makerworld.com.cn/favicon.ico
// @author       SI Xiaolong
// @match        https://makerworld.com/*
// @match        https://makerworld.com.cn/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552601/MakerWorld%20%E5%9B%BD%E5%86%85%E7%AB%99%E5%9B%BD%E9%99%85%E7%AB%99%E6%90%9C%E7%B4%A2%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/552601/MakerWorld%20%E5%9B%BD%E5%86%85%E7%AB%99%E5%9B%BD%E9%99%85%E7%AB%99%E6%90%9C%E7%B4%A2%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const WRAPPER_CLASS = 'search-input-wrapper';
    const POLL_INTERVAL = 500;
    let injected = false;

    function getTargetHost() {
        const hn = location.hostname.toLowerCase();
        return hn.endsWith('makerworld.com.cn') ? 'makerworld.com' : 'makerworld.com.cn';
    }

    function buildTargetUrl() {
        try {
            const u = new URL(location.href);
            u.hostname = getTargetHost();
            return u.toString();
        } catch {
            return location.href.replace(/\/\/[^\/]+/, '//' + getTargetHost());
        }
    }

    function setupWrapperStyles() {
        const wrapperSelector = '.' + WRAPPER_CLASS.split(' ').join('.');
        const wrapper = document.querySelector(wrapperSelector);
        if (wrapper) {
            // 设置为相对定位，以便按钮绝对定位
            wrapper.style.position = 'relative';
        }
    }

    function createButton(targetHost) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'mw-switch-site-btn';
        btn.textContent = targetHost.endsWith('.com') ? '转到 .com' : '转到 .com.cn';
        btn.title = `转到 ${targetHost}`;
        
        // 使用绝对定位放在右侧
        btn.style.cssText = [
            'position:absolute',
            'right:0',
            'top:50%',
            'transform:translateY(-50%)',
            'display:inline-flex',
            'align-items:center',
            'justify-content:center',
            'height:40px',
            'min-width:100px',
            'padding:0 16px',
            'margin:0',
            'font-size:14px',
            'font-weight:500',
            'line-height:1',
            'border-radius:8px',
            'border:1px solid rgba(0,0,0,0.12)',
            'background:rgba(255,255,255,0.08)',
            'color:inherit',
            'cursor:pointer',
            'flex-shrink:0',
            'box-sizing:border-box',
            'user-select:none',
            'transition:all 0.2s ease',
            'white-space:nowrap',
            'z-index:10'
        ].join(';');

        // 添加 hover 效果
        btn.addEventListener('mouseenter', () => {
            btn.style.background = 'rgba(255,255,255,0.15)';
            btn.style.borderColor = 'rgba(0,0,0,0.2)';
            btn.style.transform = 'translateY(-50%) translateY(-1px)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'rgba(255,255,255,0.08)';
            btn.style.borderColor = 'rgba(0,0,0,0.12)';
            btn.style.transform = 'translateY(-50%)';
        });

        // 添加 active 效果
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'translateY(-50%)';
            btn.style.background = 'rgba(255,255,255,0.05)';
        });

        btn.addEventListener('click', e => {
            e.preventDefault();
            window.location.href = buildTargetUrl();
        });
        
        btn.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
        
        btn.tabIndex = 0;
        return btn;
    }

    function tryInject() {
        if (injected) return;

        const wrapperSelector = '.' + WRAPPER_CLASS.split(' ').join('.');
        const wrapper = document.querySelector(wrapperSelector);
        if (!wrapper) return;

        // 防止重复注入
        if (wrapper.querySelector('.mw-switch-site-btn')) {
            injected = true;
            return;
        }

        // 设置 wrapper 样式
        setupWrapperStyles();

        const btn = createButton(getTargetHost());
        // 直接添加到 wrapper 中（绝对定位）
        wrapper.appendChild(btn);

        // 给 wrapper 添加右侧内边距，避免按钮遮挡内容
        wrapper.style.paddingRight = '120px';

        injected = true;
    }

    function handleResponsive() {
        const btn = document.querySelector('.mw-switch-site-btn');
        if (!btn) return;
        
        const wrapper = document.querySelector('.' + WRAPPER_CLASS.split(' ').join('.'));
        if (!wrapper) return;
        
        // 在小屏幕上简化文字
        if (window.innerWidth < 768) {
            const targetHost = getTargetHost();
            btn.textContent = targetHost.endsWith('.com') ? '.com' : '.cn';
            btn.style.minWidth = '60px';
            btn.style.padding = '0 12px';
            wrapper.style.paddingRight = '80px';
        } else {
            const targetHost = getTargetHost();
            btn.textContent = targetHost.endsWith('.com') ? '转到 .com' : '转到 .com.cn';
            btn.style.minWidth = '100px';
            btn.style.padding = '0 16px';
            wrapper.style.paddingRight = '120px';
        }
    }

    const poller = setInterval(() => {
        tryInject();
        if (injected) {
            clearInterval(poller);
            handleResponsive();
        }
    }, POLL_INTERVAL);

    const mo = new MutationObserver(() => {
        if (!injected) tryInject();
        else mo.disconnect();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('resize', handleResponsive);

    setTimeout(() => {
        if (!injected) {
            clearInterval(poller);
            mo.disconnect();
        }
    }, 10000);

})();