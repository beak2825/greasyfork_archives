// ==UserScript==
// @name         强制新标签页打开链接
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  将所有链接设置为在新标签页中打开 (target="_blank")
// @author       Gemini
// @match        *://*/*
// @grant        none
// @license MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561158/%E5%BC%BA%E5%88%B6%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/561158/%E5%BC%BA%E5%88%B6%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 逻辑 1：每当页面加载或内容变化时，修改所有 a 标签
    function updateLinks() {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            // 排除内链（如 #section1）和 javascript 脚本链接
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                link.target = '_blank';
                // 安全最佳实践：防止新页面获取原页面的 window 对象
                link.rel = 'noopener noreferrer';
            }
        });
    }

    // 逻辑 2：监听点击事件（处理动态生成的链接）
    document.addEventListener('click', function(e) {
        let target = e.target;
        // 向上寻找最近的 a 标签（处理点击到链接里的图片或图标的情况）
        while (target && target.tagName !== 'A') {
            target = target.parentNode;
        }
        if (target && target.tagName === 'A') {
            const href = target.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                target.target = '_blank';
            }
        }
    }, true);

    // 初始化执行
    updateLinks();

    // 观察页面变化（针对单页应用如微博、知乎等动态加载内容）
    const observer = new MutationObserver(updateLinks);
    observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true
    });

})();