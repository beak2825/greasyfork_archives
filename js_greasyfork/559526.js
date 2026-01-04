// ==UserScript==
// @name         B站搜索增强（首页直接输入 / 视频页仅 /）
// @namespace    https://bilibili.com/
// @version      4.0
// @description  首页直接输入进入搜索，视频页仅 / 进入搜索，不破坏快捷键
// @match        https://www.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559526/B%E7%AB%99%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA%EF%BC%88%E9%A6%96%E9%A1%B5%E7%9B%B4%E6%8E%A5%E8%BE%93%E5%85%A5%20%20%E8%A7%86%E9%A2%91%E9%A1%B5%E4%BB%85%20%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/559526/B%E7%AB%99%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA%EF%BC%88%E9%A6%96%E9%A1%B5%E7%9B%B4%E6%8E%A5%E8%BE%93%E5%85%A5%20%20%E8%A7%86%E9%A2%91%E9%A1%B5%E4%BB%85%20%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let searchBox = null;

    function isEditable(el) {
        if (!el) return false;
        const tag = el.tagName;
        return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
    }

    function isHomePage() {
        return location.pathname === '/';
    }

    function isVideoPage() {
        return location.pathname.startsWith('/video/');
    }

    function findSearchBox() {
        const selectors = [
            'input.nav-search-input',
            'input.search-input',
            'input[type="text"][placeholder*="搜索"]'
        ];
        for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el && el.offsetParent !== null) {
                return el;
            }
        }
        return null;
    }

    // 适配 SPA / 懒加载
    const observer = new MutationObserver(() => {
        if (!searchBox) {
            searchBox = findSearchBox();
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    document.addEventListener('keydown', (e) => {
        if (isEditable(document.activeElement)) return;

        // ===== 视频页：只处理 / =====
        if (isVideoPage()) {
            if (e.key !== '/') return;

            if (!searchBox) return;
            searchBox.focus();
            e.preventDefault();
            return;
        }

        // ===== 首页 =====
        if (isHomePage()) {
            // / 键
            if (e.key === '/') {
                if (!searchBox) return;
                searchBox.focus();
                e.preventDefault();
                return;
            }

            // 普通可输入字符：直接进入搜索
            if (e.ctrlKey || e.altKey || e.metaKey) return;
            if (e.key.length !== 1) return;

            if (!searchBox) return;
            searchBox.focus();

            const start = searchBox.selectionStart ?? searchBox.value.length;
            const end = searchBox.selectionEnd ?? searchBox.value.length;
            searchBox.value =
                searchBox.value.slice(0, start) +
                e.key +
                searchBox.value.slice(end);
            searchBox.setSelectionRange(start + 1, start + 1);

            e.preventDefault();
        }
    }, false); // 冒泡阶段，安全
})();
