// ==UserScript==
// @name         Steam 添加 SteamDB Link
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在Steam游戏商店页面添加SteamDB链接
// @author       leone
// @match        https://store.steampowered.com/app/*
// @icon         https://store.steampowered.com/favicon.ico
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554724/Steam%20%E6%B7%BB%E5%8A%A0%20SteamDB%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/554724/Steam%20%E6%B7%BB%E5%8A%A0%20SteamDB%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addSteamDBLink() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addSteamDBLink);
            return;
        }

        // 获取当前URL并提取游戏ID
        const currentUrl = window.location.href;
        const appIdMatch = currentUrl.match(/\/app\/(\d+)/);
        
        if (!appIdMatch) {
            console.log('SteamDB Link: 未找到游戏ID');
            return;
        }

        const appId = appIdMatch[1];
        const steamDBUrl = `https://steamdb.info/app/${appId}`;
        
        console.log(`SteamDB Link: 找到游戏ID ${appId}, SteamDB链接: ${steamDBUrl}`);

        // 使用指定的DOM节点作为插入位置
        const targetElement = document.querySelector('#glanceMidCtn > div.glance_ctn_responsive_left > div:nth-child(4)');

        if (!targetElement) {
            console.log('SteamDB Link: 未找到目标元素 #glanceMidCtn > div.glance_ctn_responsive_left > div:nth-child(4)');
            return;
        }

        // 检查是否已经添加过SteamDB链接
        if (targetElement.nextElementSibling && targetElement.nextElementSibling.classList.contains('steamdb-link')) {
            console.log('SteamDB Link: 链接已存在');
            return;
        }

        // 创建SteamDB链接元素，使用与发行商相同的样式
        const steamDBLink = document.createElement('div');
        steamDBLink.className = 'dev_row';

        // 创建标签列
        const labelColumn = document.createElement('div');
        labelColumn.className = 'subtitle column';
        labelColumn.textContent = 'SteamDB:';

        // 创建链接列
        const linkColumn = document.createElement('div');
        linkColumn.className = 'summary column';

        // 创建链接
        const link = document.createElement('a');
        link.href = steamDBUrl;
        link.textContent = appId;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        // 组装元素
        linkColumn.appendChild(link);
        steamDBLink.appendChild(labelColumn);
        steamDBLink.appendChild(linkColumn);

        // 直接在目标元素后面插入
        targetElement.parentNode.insertBefore(steamDBLink, targetElement.nextSibling);

        console.log('SteamDB Link: 链接已添加');
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addSteamDBLink);
    } else {
        addSteamDBLink();
    }

    // 监听页面变化（对于单页应用）
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(addSteamDBLink, 1000); // 延迟1秒等待页面加载
        }
    }).observe(document, {subtree: true, childList: true});

})();