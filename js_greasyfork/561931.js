// ==UserScript==
// @name        踩蘑菇页面优化
// @namespace   Violentmonkey Scripts
// @match       https://www.caimogu.cc/*
// @grant       none
// @version     1.0
// @author      特拉瓦尔多
// @description 2026/01/06 11点13分
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561931/%E8%B8%A9%E8%98%91%E8%8F%87%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/561931/%E8%B8%A9%E8%98%91%E8%8F%87%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 隐藏 float-up 元素
        const floatUp = document.querySelector('.float-up');
        if (floatUp) {
            floatUp.style.display = 'none';
        }

        // 隐藏 sidebar-footer 元素
        const sidebarFooter = document.querySelector('.sidebar-footer');
        if (sidebarFooter) {
            sidebarFooter.style.display = 'none';
        }

        // 获取具有指定 class 的 div 元素
        const sidebar = document.querySelector('.sidebar.simple');

        // 获取 search-bar 的父元素
        const searchBarParent = document.querySelector('.info.simple');
        const searchBar = searchBarParent?.querySelector('.search-bar');

        if (sidebar && searchBar) {
            // 创建按钮
            const toggleButton = document.createElement('button');
            toggleButton.textContent = '隐藏侧边栏';

            // 设置按钮样式
            toggleButton.style.marginRight = '10px';
            toggleButton.style.padding = '8px 16px';
            toggleButton.style.backgroundColor = '#007BFF';
            toggleButton.style.color = 'white';
            toggleButton.style.border = 'none';
            toggleButton.style.borderRadius = '4px';
            toggleButton.style.cursor = 'pointer';
            toggleButton.style.transition = 'background-color 0.3s ease';

            // 鼠标悬停样式
            toggleButton.addEventListener('mouseover', function() {
                toggleButton.style.backgroundColor = '#0056b3';
            });

            // 鼠标移开样式
            toggleButton.addEventListener('mouseout', function() {
                toggleButton.style.backgroundColor = '#007BFF';
            });

            // 按钮点击事件处理函数
            toggleButton.addEventListener('click', function() {
                if (sidebar.style.display === 'none') {
                    sidebar.style.display = '';
                    toggleButton.textContent = '隐藏侧边栏';
                } else {
                    sidebar.style.display = 'none';
                    toggleButton.textContent = '显示侧边栏';
                }
            });

            // 将按钮插入到 search-bar 之前
            searchBarParent.insertBefore(toggleButton, searchBar);
        }
    });
})();