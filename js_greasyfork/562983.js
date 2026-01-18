// ==UserScript==
// @name         GitHub - Add Releases Menu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a 'Releases' menu item to the GitHub repository top menu
// @author       Kimi
// @match        https://github.com/*
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/562983/GitHub%20-%20Add%20Releases%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/562983/GitHub%20-%20Add%20Releases%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查是否是仓库页面
    const isRepoPage = window.location.pathname.match(/^\/[^/]+\/[^/]+$/);
    if (!isRepoPage) return;

    // 获取顶部菜单栏
    const topNav = document.querySelector('.UnderlineNav-body');
    if (!topNav) return;

    // 创建新的菜单项
    const releasesLink = document.createElement('a');
    releasesLink.href = `${window.location.origin}${window.location.pathname}/releases`;
    releasesLink.textContent = '>>Releases';
    releasesLink.className = 'js-selected-navigation-item UnderlineNav-item';

    // 添加点击事件（可选）
    releasesLink.addEventListener('click', () => {
        console.log('Navigating to Releases');
    });

    // 将新的菜单项添加到顶部菜单栏
    topNav.appendChild(releasesLink);
})();