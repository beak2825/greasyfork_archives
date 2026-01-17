// ==UserScript==
// @name         微信外部链接自动跳转
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  通过读取 cgiData 变量精准获取 URL ，并修正跳转逻辑，彻底解决微信新版提示页的自动跳转问题。
// @author       MoonIRL
// @match        *://weixin110.qq.com/*
// @match        *://weixin.qq.com/cgi-bin/redirectforward*
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562835/%E5%BE%AE%E4%BF%A1%E5%A4%96%E9%83%A8%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/562835/%E5%BE%AE%E4%BF%A1%E5%A4%96%E9%83%A8%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听 DOM 加载完成事件
    window.addEventListener('DOMContentLoaded', () => {
        console.log('微信跳转页面加载，开始查找 cgiData 变量...');

        // 使用 unsafeWindow 访问页面的全局 JS 变量
        if (typeof unsafeWindow.cgiData === 'undefined' || unsafeWindow.cgiData === null) {
            console.error('未能在页面中找到 cgiData 全局变量。脚本无法执行。');
            return; // 提前退出
        }

        const cgiData = unsafeWindow.cgiData;
        console.log('成功访问到 cgiData 对象:', cgiData);

        // 1. 提取原始 URL
        let rawUrl = (cgiData.btns && cgiData.btns[0] && cgiData.btns[0].url) || cgiData.url;

        if (!rawUrl) {
            console.error('在 cgiData 对象中未找到有效的 URL。');
            return; // 提前退出
        }

        // 2. **关键修正：净化 URL**
        // 手动将 HTML 实体编码的斜杠替换回来
        let cleanUrl = rawUrl.replace(/&#x2f;/g, '/');
        console.log('净化后的 URL:', cleanUrl);

        // 3. **关键修正：验证 URL**
        // 确保它是一个绝对路径，防止浏览器错误解析为相对路径
        if (cleanUrl.startsWith('http://' ) || cleanUrl.startsWith('https://' )) {
            console.log('URL 验证通过，准备跳转至:', cleanUrl);
            window.location.replace(cleanUrl);
        } else {
            console.error('净化后的 URL 不是一个有效的绝对地址，跳转取消:', cleanUrl);
        }
    });
})();
