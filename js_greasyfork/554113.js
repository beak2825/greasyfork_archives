// ==UserScript==
// @name         Steam客户端新窗口页面打开[仅Watt Toolkit(Steam++) 特用]
// @version      1.0.2
// @description  仅支持Watt Toolkit(Steam++)的脚本功能，Steam客户端里以Steam客户端新窗口页面打开
// @author       Licht
// @namespace    https://github.com/LichtS
// @noframes
// @license MIT
// @grant        GM_addStyle
// @match        *://store.steampowered.com/*
// @match        *://steamcommunity.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554113/Steam%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%96%B0%E7%AA%97%E5%8F%A3%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80%5B%E4%BB%85Watt%20Toolkit%28Steam%2B%2B%29%20%E7%89%B9%E7%94%A8%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/554113/Steam%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%96%B0%E7%AA%97%E5%8F%A3%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80%5B%E4%BB%85Watt%20Toolkit%28Steam%2B%2B%29%20%E7%89%B9%E7%94%A8%5D.meta.js
// ==/UserScript==

;(function () {
    'use strict'
    
    // 检测是否在Steam客户端中运行
    function isInSteamClient() {
        return navigator.userAgent.includes('Valve Steam') || 
               window.steamEnv || 
               document.body.classList.contains('steam_client');
    }
    
    // 如果不是Steam客户端，则不执行
    if (!isInSteamClient()) {
        return;
    }

    let styleCSS = `
    #open-in-browser-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #181d25;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    #open-in-browser-button:hover {
        background-color: #2a3341;
        transform: scale(1.1);
    }
 
    #open-in-browser-button svg {
        fill: #4d7fbe;
        width: 50%;
        height: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    `
 
    GM_addStyle(styleCSS)

    const title = '在客户端新页面打开'

    const main = {
        init() {
            // 检查是否已存在按钮
            if (document.getElementById('open-in-browser-button')) {
                return;
            }
            
            const openInBrowserButton = document.createElement('a')
            openInBrowserButton.id = 'open-in-browser-button'
            openInBrowserButton.title = title
            openInBrowserButton.href = location.href
            openInBrowserButton.target = '_blank'
            openInBrowserButton.rel = 'noopener noreferrer'
            openInBrowserButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" height="32" width="32" viewBox="0 -960 960 960" >
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/>
            </svg>
            `
 
            document.body.appendChild(openInBrowserButton)
        },
    }
 
    // 等待页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main.init);
    } else {
        main.init();
    }
})()