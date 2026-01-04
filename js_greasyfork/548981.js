// ==UserScript==
// @name         GitHub → Deepwiki 跳转
// @namespace    http://tampermonkey.net/
// @version      2025-09-10
// @description  在 github.com 页面注入按钮，点击后跳转到 deepwiki.com。
// @author       ranxiu
// @match        *://*.github.com/*
// @icon         https://deepwiki.com/favicon.ico
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548981/GitHub%20%E2%86%92%20Deepwiki%20%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/548981/GitHub%20%E2%86%92%20Deepwiki%20%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (location.hostname !== 'github.com') {
        return;
    }

    function buildTargetUrlFromCurrent() {
        const currentUrl = new URL(location.href);
        if (currentUrl.hostname !== 'github.com') {
            return null;
        }
        currentUrl.hostname = 'deepwiki.com';
        return currentUrl.toString();
    }

    function createFloatingButton() {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = '在 deepwiki 打开';
        button.title = '将当前 GitHub 页面在 deepwiki.com 打开';
        button.setAttribute('aria-label', '在 deepwiki 打开');
        Object.assign(button.style, {
            display: 'inline-block',
            marginLeft: '8px',
            padding: '3px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(27, 31, 36, 0.15)',
            background: 'var(--button-default-bgColor-rest, #f6f8fa)',
            color: 'var(--fgColor-default, #24292f)',
            fontSize: '12px',
            fontWeight: '500',
            lineHeight: '20px',
            boxShadow: 'var(--shadow-resting-small, 0 1px 0 rgba(27,31,36,0.04))',
            cursor: 'pointer',
            verticalAlign: 'middle'
        });
        button.addEventListener('mouseenter', function () {
            button.style.background = 'var(--button-default-bgColor-hover, #f3f4f6)';
        });
        button.addEventListener('mouseleave', function () {
            button.style.background = 'var(--button-default-bgColor-rest, #f6f8fa)';
        });
        button.addEventListener('mousedown', function () {
            button.style.background = 'var(--button-default-bgColor-active, #edeff2)';
        });
        button.addEventListener('mouseup', function () {
            button.style.background = 'var(--button-default-bgColor-hover, #f3f4f6)';
        });
        button.addEventListener('focus', function () {
            button.style.outline = '2px solid var(--focus-outlineColor, #0969da)';
            button.style.outlineOffset = '2px';
        });
        button.addEventListener('blur', function () {
            button.style.outline = 'none';
            button.style.outlineOffset = '0';
        });
        button.addEventListener('click', function (ev) {
            ev.preventDefault();
            const targetUrl = buildTargetUrlFromCurrent();
            if (!targetUrl) {
                return;
            }
            if (location.href === targetUrl) {
                return;
            }
            location.replace(targetUrl);
        });
        return button;
    }

    function findAboutHeaderElement() {
        // 优先在侧边栏查找，避免误匹配 README 中的 About
        const sidebar = document.querySelector('.Layout-sidebar');
        if (sidebar) {
            const headings = sidebar.querySelectorAll('h2, h3');
            for (const heading of headings) {
                const text = (heading.textContent || '').trim();
                if (text === 'About') {
                    return heading;
                }
            }
        }
        // 兜底：全局查找，但排除 markdown 正文区域
        const headings = document.querySelectorAll('h2, h3');
        for (const heading of headings) {
            if (heading.closest('.markdown-body')) {
                continue; // 跳过 README/issue 正文
            }
            const text = (heading.textContent || '').trim();
            if (text === 'About') {
                return heading;
            }
        }
        return null;
    }

    function injectButtonOnce() {
        if (document.getElementById('tm-deepwiki-redirect')) {
            return;
        }
        const anchor = findAboutHeaderElement();
        if (!anchor) {
            return;
        }
        const btn = createFloatingButton();
        btn.id = 'tm-deepwiki-redirect';
        // 将按钮放到 About 标题右侧
        anchor.appendChild(btn);
    }

    // 兼容 GitHub 的 PJAX/Turbo 导航：监听主容器变化，缺失时重新注入
    const observer = new MutationObserver(function () {
        if (!document.getElementById('tm-deepwiki-redirect')) {
            injectButtonOnce();
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectButtonOnce);
    } else {
        injectButtonOnce();
    }
})();