// ==UserScript==
// @name         网页图片透明化与悬停显示效果（可配置版）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  支持在插件页面配置域名，控制脚本是否在对应域名生效
// @author       sdujava2011
// @icon         https://blog.ops-coffee.com/favicon.ico
// @match        *://blog.ops-coffee.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548016/%E7%BD%91%E9%A1%B5%E5%9B%BE%E7%89%87%E9%80%8F%E6%98%8E%E5%8C%96%E4%B8%8E%E6%82%AC%E5%81%9C%E6%98%BE%E7%A4%BA%E6%95%88%E6%9E%9C%EF%BC%88%E5%8F%AF%E9%85%8D%E7%BD%AE%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/548016/%E7%BD%91%E9%A1%B5%E5%9B%BE%E7%89%87%E9%80%8F%E6%98%8E%E5%8C%96%E4%B8%8E%E6%82%AC%E5%81%9C%E6%98%BE%E7%A4%BA%E6%95%88%E6%9E%9C%EF%BC%88%E5%8F%AF%E9%85%8D%E7%BD%AE%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 预设的域名列表
    const presetDomains = [
        "blog.ops-coffee.com"
    ];

    // 获取用户配置的域名状态
    function getDomainConfig() {
        const config = GM_getValue('domainConfig', {});
        presetDomains.forEach(domain => {
            if (!config.hasOwnProperty(domain)) {
                config[domain] = true; // 默认启用
            }
        });
        return config;
    }

    // 保存用户配置的域名状态
    function saveDomainConfig(config) {
        GM_setValue('domainConfig', config);
    }

    // 创建配置界面
    function createConfigUI() {
        const config = getDomainConfig();
        const dialog = document.createElement('div');
        dialog.style.position = 'fixed';
        dialog.style.top = '10px';
        dialog.style.right = '10px';
        dialog.style.backgroundColor = 'white';
        dialog.style.padding = '10px';
        dialog.style.border = '1px solid #ccc';
        dialog.style.zIndex = '9999';

        presetDomains.forEach(domain => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = config[domain];
            checkbox.addEventListener('change', () => {
                config[domain] = checkbox.checked;
                saveDomainConfig(config);
            });

            const label = document.createElement('label');
            label.textContent = domain;
            label.insertBefore(checkbox, label.firstChild);

            const br = document.createElement('br');
            dialog.appendChild(label);
            dialog.appendChild(br);
        });

        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.addEventListener('click', () => {
            dialog.remove();
        });
        dialog.appendChild(closeButton);

        document.body.appendChild(dialog);
    }

    // 注册菜单命令，用于打开配置界面
    GM_registerMenuCommand('配置域名', createConfigUI);

    // 检查当前域名是否启用脚本
    function isDomainEnabled() {
        const config = getDomainConfig();
        const currentDomain = window.location.hostname;
        return config[currentDomain] || false;
    }

    // 原脚本的图片处理逻辑
    function applyImageEffect() {
        const images = document.getElementsByTagName('img');
        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            if (img.width > 30 && img.height > 30) {
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s';
                img.addEventListener('mouseover', function() {
                    this.style.opacity = '1';
                });
                img.addEventListener('mouseout', function() {
                    this.style.opacity = '0';
                });
            }
        }
    }
        
    if (isDomainEnabled()) {
        // 页面加载完成后执行
        window.addEventListener('load', applyImageEffect);

        // 监听DOM变化，处理动态加载的图片
        const observer = new MutationObserver(applyImageEffect);
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();