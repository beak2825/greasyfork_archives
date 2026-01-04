// ==UserScript==
// @name         强制所有链接新标签打开（白名单版）
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  只有白名单中的网站才会强制所有<a>标签在新标签页打开（可通过菜单添加当前域名）
// @author       你
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550710/%E5%BC%BA%E5%88%B6%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%EF%BC%88%E7%99%BD%E5%90%8D%E5%8D%95%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/550710/%E5%BC%BA%E5%88%B6%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%EF%BC%88%E7%99%BD%E5%90%8D%E5%8D%95%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取当前域名
    const currentDomain = location.hostname;

    // 从存储中取白名单，没有则返回空数组
    let whitelist = GM_getValue('whitelist', []);

    // 注册菜单：添加当前域名到白名单
    GM_registerMenuCommand(`添加 ${currentDomain} 到白名单`, () => {
        if (!whitelist.includes(currentDomain)) {
            whitelist.push(currentDomain);
            GM_setValue('whitelist', whitelist);
            alert(`已将 ${currentDomain} 添加到白名单`);
        } else {
            alert(`${currentDomain} 已在白名单中`);
        }
    });

    // 注册菜单：查看白名单
    GM_registerMenuCommand('查看白名单', () => {
        alert('白名单：\n' + (whitelist.length ? whitelist.join('\n') : '（空）'));
    });

    // 注册菜单：清空白名单
    GM_registerMenuCommand('清空白名单', () => {
        if (confirm('确定要清空白名单吗？')) {
            whitelist = [];
            GM_setValue('whitelist', whitelist);
            alert('白名单已清空');
        }
    });

    // 判断当前域名是否在白名单中
    if (whitelist.includes(currentDomain)) {
        // 修改页面中所有<a>标签
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
    }
})();
