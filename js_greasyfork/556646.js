// ==UserScript==
// @name         Bing搜索隐藏抖音结果
// @version      1.2
// @description  在Bing搜索结果中隐藏来自douyin.com的内容
// @homepage     https://lmxhl.top
// @author       临明小狐狸
// @match        https://www.bing.com/*
// @match        https://cn.bing.com/*
// @grant        none
// @icon         http://api.afmax.cn/so/ico/index.php?r=https://lmxhl.top/
// @supportURL   https://lmxhl.top
// @run-at       document-start
// @namespace https://greasyfork.org/users/1538324
// @downloadURL https://update.greasyfork.org/scripts/556646/Bing%E6%90%9C%E7%B4%A2%E9%9A%90%E8%97%8F%E6%8A%96%E9%9F%B3%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/556646/Bing%E6%90%9C%E7%B4%A2%E9%9A%90%E8%97%8F%E6%8A%96%E9%9F%B3%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 主要函数：隐藏抖音搜索结果
    function hideDouyinResults() {
        // 获取所有搜索结果项
        const searchResults = document.querySelectorAll('#b_results > .b_algo, .b_algo');

        searchResults.forEach(result => {
            // 在搜索结果中查找包含douyin.com的链接
            const links = result.querySelectorAll('a[href*="douyin.com"]');
            const douyinLinks = Array.from(links).filter(link =>
                link.href.includes('https://www.douyin.com/search/') ||
                link.href.includes('//www.douyin.com/search/')
            );

            // 如果找到抖音链接，隐藏整个搜索结果项
            if (douyinLinks.length > 0) {
                result.style.display = 'none';
                console.log('已隐藏抖音搜索结果:', douyinLinks[0].href);
            }
        });
    }

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        let shouldCheck = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                shouldCheck = true;
            }
        });
        if (shouldCheck) {
            setTimeout(hideDouyinResults, 100);
        }
    });

    // 页面加载完成后初始化
    window.addEventListener('load', function() {
        // 初始执行一次
        setTimeout(hideDouyinResults, 500);

        // 开始观察页面变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });

    // 监听URL变化（针对Bing的AJAX导航）
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(hideDouyinResults, 500);
        }
    }).observe(document, { subtree: true, childList: true });

    // 监听用户交互，确保及时更新
    document.addEventListener('click', function() {
        setTimeout(hideDouyinResults, 300);
    });

    // 滚动时也检查（针对LazyLoad）
    window.addEventListener('scroll', function() {
        setTimeout(hideDouyinResults, 200);
    });
})();