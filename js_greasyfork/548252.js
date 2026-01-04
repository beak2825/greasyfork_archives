// ==UserScript==
// @name         优化哔哩哔哩/B站动态首页'视频投稿'按钮使其显示全部视频
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  当前的视频并不会显示收藏的视频合集以及番剧，使其显示，与手机端一致
// @author       You
// @match        https://t.bilibili.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548252/%E4%BC%98%E5%8C%96%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9B%E7%AB%99%E5%8A%A8%E6%80%81%E9%A6%96%E9%A1%B5%27%E8%A7%86%E9%A2%91%E6%8A%95%E7%A8%BF%27%E6%8C%89%E9%92%AE%E4%BD%BF%E5%85%B6%E6%98%BE%E7%A4%BA%E5%85%A8%E9%83%A8%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/548252/%E4%BC%98%E5%8C%96%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9B%E7%AB%99%E5%8A%A8%E6%80%81%E9%A6%96%E9%A1%B5%27%E8%A7%86%E9%A2%91%E6%8A%95%E7%A8%BF%27%E6%8C%89%E9%92%AE%E4%BD%BF%E5%85%B6%E6%98%BE%E7%A4%BA%E5%85%A8%E9%83%A8%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==


(function() {
    'use strict';
    
    // 你的固定CSS
    const fixedCSS = `
        div.bili-dyn-list__item:not(:has(a.bili-dyn-card-video,a.bili-dyn-card-pgc)),
        div.bili-dyn-list__item:has(div.bili-dyn-content__orig__author) {
            display: none;
        }
    `;
    
    const cssStorageKey = 'customCSSEnabled';
    let styleElement = null;
    let currentActiveTab = '全部'; // 默认激活的是"全部"标签

    // 注入CSS的函数
    function injectCSS() {
        if (styleElement) {
            document.head.removeChild(styleElement);
        }
        styleElement = document.createElement('style');
        styleElement.id = 'bili-dyn-custom-css';
        styleElement.textContent = fixedCSS;
        document.head.appendChild(styleElement);
        GM_setValue(cssStorageKey, true);
    }

    // 移除CSS的函数
    function removeCSS() {
        const existingStyle = document.getElementById('bili-dyn-custom-css');
        if (existingStyle) {
            existingStyle.parentNode.removeChild(existingStyle);
        }
        styleElement = null;
        GM_setValue(cssStorageKey, false);
    }

    // 处理标签点击事件
    function handleTabClick(tabElement, tabName) {
        // 移除所有标签的active类
        document.querySelectorAll('.bili-dyn-list-tabs__item.fs-medium').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // 给当前点击的标签添加active类
        tabElement.classList.add('active');
        
        // 根据规则处理CSS
        if (currentActiveTab === '全部' && tabName === '视频投稿') {
            // 从"全部"切换到"视频投稿"，加载CSS
            injectCSS();
        } else if (currentActiveTab === '视频投稿' && tabName !== '视频投稿') {
            // 从"视频投稿"切换到其他标签，移除CSS
            removeCSS();
        } else if (currentActiveTab !== '全部' && currentActiveTab !== '视频投稿' && tabName === '视频投稿') {
            // 从其他标签切换到"视频投稿"，需要先点击"全部"再切换到"视频投稿"
            const allTab = findTabByText('全部');
            if (allTab) {
                // 先模拟点击"全部"
                handleTabClick(allTab, '全部');
                // 然后切换到"视频投稿"
                setTimeout(() => {
                    handleTabClick(tabElement, '视频投稿');
                }, 100);
                return; // 直接返回，不更新currentActiveTab
            }
        }
        
        // 更新当前激活的标签
        currentActiveTab = tabName;
    }

    // 通过文本内容查找标签
    function findTabByText(text) {
        const tabs = document.querySelectorAll('.bili-dyn-list-tabs__item.fs-medium');
        for (let tab of tabs) {
            if (tab.textContent.includes(text)) {
                return tab;
            }
        }
        return null;
    }

    // 初始化标签点击事件
    function initTabs() {
        const tabs = document.querySelectorAll('.bili-dyn-list-tabs__item.fs-medium');
        
        tabs.forEach(tab => {
            // 克隆节点以移除原有事件监听器
            const clonedTab = tab.cloneNode(true);
            tab.parentNode.replaceChild(clonedTab, tab);
            
            // 获取标签文本内容
            const tabText = clonedTab.textContent.trim();
            
            // 添加点击事件
            clonedTab.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                handleTabClick(clonedTab, tabText);
            });
        });
        
        // 设置初始状态（全部按钮默认激活）
        const allTab = findTabByText('全部');
        if (allTab) {
            allTab.classList.add('active');
            currentActiveTab = '全部';
        }
        
        // 检查之前是否有保存的状态
        GM_getValue(cssStorageKey, false).then((savedState) => {
            if (savedState) {
                injectCSS();
            }
        });
    }

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        const tabsContainer = document.querySelector('.bili-dyn-list-tabs__list');
        if (tabsContainer) {
            initTabs();
            // 找到后可以停止观察，或者根据需求调整
            observer.disconnect();
        }
    });

    // 页面加载后尝试初始化
    if (document.querySelector('.bili-dyn-list-tabs__list')) {
        initTabs();
    } else {
        // 如果容器不存在，开始观察DOM变化
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();