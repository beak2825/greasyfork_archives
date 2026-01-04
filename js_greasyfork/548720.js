// ==UserScript==
// @name         GitHub 返回顶部按钮
// @namespace    http://mrx.la
// @version      1.0
// @description  为GitHub的所有页面添加返回顶部按钮
// @author       Mobius
// @match        https://github.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/548720/GitHub%20%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/548720/GitHub%20%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建返回顶部按钮
    function createBackToTopButton() {
        const button = document.createElement('div');
        button.id = 'github-back-to-top';
        button.innerHTML = '🔝';
        button.title = '返回顶部';
        
        // 设置按钮样式
        button.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background-color: #24292f;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 20px;
            font-weight: bold;
            cursor: pointer;
            z-index: 9999;
            display: none;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
            user-select: none;
        `;
        
        // 鼠标悬停效果
        button.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#32383f';
            this.style.transform = 'scale(1.1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#24292f';
            this.style.transform = 'scale(1)';
        });
        
        // 点击事件 - 平滑滚动到顶部
        button.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        return button;
    }
    
    // 控制按钮显示/隐藏
    function toggleButtonVisibility(button) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 300) {
            button.style.display = 'flex';
        } else {
            button.style.display = 'none';
        }
    }
    
    // 初始化脚本
    function init() {
        // 检查是否已经存在按钮
        if (document.getElementById('github-back-to-top')) {
            return;
        }
        
        // 创建并添加按钮到页面
        const button = createBackToTopButton();
        document.body.appendChild(button);
        
        // 监听滚动事件
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(function() {
                    toggleButtonVisibility(button);
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // 初始检查是否需要显示按钮
        toggleButtonVisibility(button);
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // 监听页面变化（GitHub使用PJAX进行页面切换）
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 延迟执行以确保页面完全加载
                setTimeout(init, 100);
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
})();