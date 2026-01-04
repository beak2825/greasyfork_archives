// ==UserScript==
// @name         Biliwiki跳转VSCode
// @namespace    https://github.com/haihe8177
// @description  想要使用VSCode编辑Biliwiki，苦于站点未添加启动插件
// @version      1.1
// @license      MIT
// @author       Haihe
// @match        *://wiki.biligame.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556394/Biliwiki%E8%B7%B3%E8%BD%ACVSCode.user.js
// @updateURL https://update.greasyfork.org/scripts/556394/Biliwiki%E8%B7%B3%E8%BD%ACVSCode.meta.js
// ==/UserScript==
 (function () {
    'use strict';
    const button = document.createElement('button');
    button.innerHTML = '<img src="https://vscode.github.net.cn/assets/images/code-stable.png" alt="VS Code" style="width: 24px; height: 24px;">';
    button.style.cssText = `
        position: fixed;
        left: 20px;
        bottom: 65px;
        z-index: 10000;
        padding: 8px;
        background: transparent;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    `;
    button.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-2px) scale(1.1)';
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    });
     button.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.backgroundColor = 'transparent';
    });
    function getTitleFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const url = window.location.href;
        let title = urlParams.get('title');
        const siteMatch = url.match(/wiki\.biligame\.com\/([^/]+)/);
        let site = siteMatch ? siteMatch[1] : 'main';
        if (!title) {
            const titleMatch = url.match(/wiki\.biligame\.com\/[^/?]+\/(.+)/);
            if (titleMatch) {
                title = titleMatch[1];
            }
        }
        return {
            site: site,
            title: title || '未知页面'
        };
    }
    button.addEventListener('click', function () {
        const pageInfo = getTitleFromURL();
        const site = pageInfo.site;
        const title = pageInfo.title;
         console.log('项目:', site);
        console.log('标题:', title);
        const targetURL = `vscode://rowewilsonfrederiskholme.wikitext/PullPage?RemoteBot=true&TransferProtocol=https%3A&SiteHost=%2F%2Fwiki.biligame.com&APIPath=%2F${site}%2Fapi.php&Title=${title}`;
         console.log('跳转链接:', targetURL);
        try {
            window.location.href = targetURL;
        } catch (error) {
            console.error('跳转失败:', error);
            alert('无法打开VS Code链接。请确保已安装Wikitext扩展。\n项目: ' + site + '\n页面标题: ' + decodeURIComponent(title));
        }
    });
    document.body.appendChild(button);
    window.addEventListener('load', function () {
        button.style.display = 'flex';
        const img = button.querySelector('img');
        img.onerror = function () {
            this.style.display = 'none';
            button.innerHTML = 'VSC';
            button.style.fontSize = '12px';
            button.style.color = '#007acc';
            button.style.fontWeight = 'bold';
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        };
    });
})();