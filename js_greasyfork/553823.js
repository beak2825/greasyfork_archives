// ==UserScript==
// @name         微博自动展开
// @namespace    https://github.com/SIXiaolong1117/Rules
// @version      0.2
// @description  自动点击微博的展开按钮，显示完整内容
// @license      MIT
// @icon         https://weibo.com/favicon.ico
// @author       SI Xiaolong
// @match        https://weibo.com/*
// @match        https://*.weibo.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553823/%E5%BE%AE%E5%8D%9A%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/553823/%E5%BE%AE%E5%8D%9A%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 点击所有展开按钮的函数
    function clickExpandButtons() {
        const expandButtons = document.querySelectorAll('.expand');
        expandButtons.forEach(button => {
            // 检查按钮是否可见且未被点击
            if (button.offsetParent !== null && !button.classList.contains('clicked')) {
                button.click();
                button.classList.add('clicked');
                console.log('已点击展开按钮');
                // 展开后稍等片刻再隐藏收起按钮
                setTimeout(hideCollapseButtons, 800);
            }
        });
    }

    // 隐藏所有收起按钮
    function hideCollapseButtons() {
        const collapseButtons = document.querySelectorAll('.collapse');
        collapseButtons.forEach(btn => {
            btn.style.display = 'none';
            btn.style.visibility = 'hidden';
        });
    }

    // 初始执行一次
    clickExpandButtons();
    hideCollapseButtons();

    // 使用 MutationObserver 监听页面变化
    const observer = new MutationObserver((mutations) => {
        clickExpandButtons();
        hideCollapseButtons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 备用定时检查
    setInterval(() => {
        clickExpandButtons();
        hideCollapseButtons();
    }, 1000);

    console.log('微博自动展开脚本已启动');
})();