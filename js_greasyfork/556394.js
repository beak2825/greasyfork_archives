// ==UserScript==
// @name         Biliwiki跳转VSCode
// @namespace    https://github.com/haihe8177
// @description  为 Biliwiki 提供一键跳转至 Visual Studio Code 编辑页面的功能。配合Wikitext编辑器扩展使用。
// @version      1.3
// @license      MIT
// @author       Haihe
// @match        *://wiki.biligame.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556394/Biliwiki%E8%B7%B3%E8%BD%ACVSCode.user.js
// @updateURL https://update.greasyfork.org/scripts/556394/Biliwiki%E8%B7%B3%E8%BD%ACVSCode.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // 创建按钮（样式完全保留）
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

    // 悬停效果（完全保留）
    button.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-2px) scale(1.1)';
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    });
    button.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.backgroundColor = 'transparent';
    });

    // 图片加载失败降级（完全保留）
    window.addEventListener('load', function () {
        button.style.display = 'flex';
        const img = button.querySelector('img');
        if (img) {
            img.onerror = function () {
                this.style.display = 'none';
                button.innerHTML = 'VSC';
                button.style.fontSize = '12px';
                button.style.color = '#007acc';
                button.style.fontWeight = 'bold';
                button.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            };
        }
    });

    document.body.appendChild(button);

    // === 点击处理函数：每次点击都重新判断环境 ===
    button.addEventListener('click', async function () {
        // 检查基本 MediaWiki 对象
        if (typeof window.mw === 'undefined') {
            alert('当前页面不是 MediaWiki 站点，无法使用此功能。');
            return;
        }

        // 检查 wgPageName 是否已注入（通常 DOM 加载后就有）
        let title;
        try {
            title = window.mw.config.get('wgPageName');
        } catch (e) {
            alert('页面信息尚未加载完成，请稍等几秒再试。');
            return;
        }

        if (!title) {
            alert('无法获取当前页面标题，请稍后再试。');
            return;
        }

        // 确保 mediawiki.util 已加载（按需加载）
        try {
            await window.mw.loader.using('mediawiki.util');
        } catch (err) {
            console.error('Failed to load mediawiki.util:', err);
            alert('MediaWiki 工具模块加载失败，请刷新页面重试。');
            return;
        }

        // 构造参数（与菜单按钮完全一致）
        const vsc_btn_args = {
            RemoteBot: 'true',
            TransferProtocol: window.location.protocol,
            SiteHost: '//wiki.biligame.com',
            APIPath: window.mw.util.wikiScript('api'),
            Title: title
        };

        const targetURL = "vscode://rowewilsonfrederiskholme.wikitext/PullPage?" +
                          new URLSearchParams(vsc_btn_args).toString();

        try {
            window.location.href = targetURL;
        } catch (error) {
            console.error('跳转失败:', error);
            alert('无法打开 VS Code 链接。\n请确保已安装 “Wikitext” 扩展。');
        }
    });
})();