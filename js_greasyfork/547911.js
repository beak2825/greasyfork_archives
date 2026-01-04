// ==UserScript==
// @name         itch.io 自动添加 exclude 参数（所有游戏页面）
// @namespace    johntito
// @version      1.1
// @description  在 itch.io 的所有游戏页面自动添加 ?exclude=tg.horror 参数
// @author       johntito
// @match        https://itch.io*
// @match        https://itch.io/games*
// @match        https://itch.io/games?*
// @match        https://itch.io/games/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547911/itchio%20%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%20exclude%20%E5%8F%82%E6%95%B0%EF%BC%88%E6%89%80%E6%9C%89%E6%B8%B8%E6%88%8F%E9%A1%B5%E9%9D%A2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/547911/itchio%20%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%20exclude%20%E5%8F%82%E6%95%B0%EF%BC%88%E6%89%80%E6%9C%89%E6%B8%B8%E6%88%8F%E9%A1%B5%E9%9D%A2%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const excludeParam = 'exclude=tg.horror';
    const targetPathPrefix = '/games';

    // 检查当前URL是否需要添加参数
    function checkAndUpdateUrl() {
        const currentUrl = window.location.href;
        const urlObj = new URL(currentUrl);

        // 如果当前路径以/games开头且没有exclude参数
        if (urlObj.pathname.startsWith(targetPathPrefix) && !urlObj.search.includes(excludeParam)) {
            // 添加参数但不重定向（避免页面刷新）
            const separator = urlObj.search ? '&' : '?';
            const newUrl = currentUrl + separator + excludeParam;

            // 使用history.replaceState更新URL而不刷新页面
            window.history.replaceState(null, '', newUrl);
            console.log('已添加exclude参数到URL:', newUrl);
        }
    }

    // 检查URL是否需要添加参数
    function shouldAddParam(url) {
        try {
            const urlObj = new URL(url, window.location.origin);
            return urlObj.pathname.startsWith(targetPathPrefix) && !urlObj.search.includes(excludeParam);
        } catch (e) {
            return false;
        }
    }

    // 给URL添加参数
    function addParamToUrl(url) {
        const separator = url.includes('?') ? '&' : '?';
        return url + separator + excludeParam;
    }

    // 修改单个元素的链接
    function updateElementLink(element, attribute) {
        const originalUrl = element.getAttribute(attribute);
        if (originalUrl && shouldAddParam(originalUrl)) {
            const newUrl = addParamToUrl(originalUrl);
            element.setAttribute(attribute, newUrl);

            // 如果是当前页面的分页链接，添加点击事件处理
            if (attribute === 'href' && element.tagName === 'A') {
                element.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.location.href = newUrl;
                });
            }
        }
    }

    // 修改页面中所有相关链接
    function updateAllLinks() {
        // 处理普通链接
        document.querySelectorAll('a[href]').forEach(link => {
            updateElementLink(link, 'href');
        });

        // 处理表单action
        document.querySelectorAll('form[action]').forEach(form => {
            updateElementLink(form, 'action');
        });

        console.log('已自动为itch.io游戏页面链接添加exclude参数');
    }

    // 使用MutationObserver监听DOM变化，处理动态加载的内容
    const observer = new MutationObserver(function(mutations) {
        let shouldUpdate = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                shouldUpdate = true;
                break;
            }
        }
        if (shouldUpdate) {
            // 延迟执行以避免频繁更新
            clearTimeout(window.updateLinksTimeout);
            window.updateLinksTimeout = setTimeout(() => {
                updateAllLinks();
                checkAndUpdateUrl();
            }, 500);
        }
    });

    // 主执行函数
    function init() {
        // 更新当前URL（如果必要）
        checkAndUpdateUrl();

        // 更新页面中的所有链接
        updateAllLinks();

        // 开始观察DOM变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 监听分页按钮点击事件（itch.io使用AJAX加载内容）
        document.addEventListener('click', function(e) {
            const target = e.target.closest('a');
            if (target && target.getAttribute('href') && shouldAddParam(target.getAttribute('href'))) {
                e.preventDefault();
                const newUrl = addParamToUrl(target.getAttribute('href'));
                window.location.href = newUrl;
            }
        }, true);
    }

    // 等待页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();