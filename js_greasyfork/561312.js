// ==UserScript==
// @name         QQ/微信 拦截链接自动跳转助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动解析 QQ/微信 拦截页面 (c.pc.qq.com) 的真实链接，并在页面上添加“直接访问”按钮
// @author       棒棒糖
// @match        *://c.pc.qq.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561312/QQ%E5%BE%AE%E4%BF%A1%20%E6%8B%A6%E6%88%AA%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561312/QQ%E5%BE%AE%E4%BF%A1%20%E6%8B%A6%E6%88%AA%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 获取 URL 中的参数
    const getQueryParam = (name) => {
        const searchParams = new URLSearchParams(window.location.search);
        return searchParams.get(name);
    };

    // 2. 核心逻辑
    const init = () => {
        // 提取 'url' 参数 (目标网址)
        let targetUrl = getQueryParam('url');

        // 如果没有 url 参数，尝试从 html 源码或其他常见参数中查找 (容错处理)
        if (!targetUrl) {
            console.log('未在 URL 参数中找到目标链接');
            return;
        }
        if (targetUrl.endsWith('/')) {
            targetUrl = targetUrl.slice(0, -1);
            console.log('已去除链接末尾多余的 "/"');
        }
        // 这里的 targetUrl 通常已经被 URLSearchParams 自动解码了一次
        // 但为了保险，可以再尝试 decodeURIComponent 一次，防止双重编码，
        // 不过大多数浏览器处理 href 会自动识别，这里直接使用即可。
        console.log(`捕捉到目标链接: ${targetUrl}`);

        createRedirectButton(targetUrl);
    };

    // 3. 创建 UI 按钮
    const createRedirectButton = (url) => {
        // 创建容器
        const btn = document.createElement('a');
        btn.href = url;
        btn.innerText = '继续访问原网页';
        btn.target = '_self'; // 在当前页打开，也可改为 '_blank' 新窗口打开

        // 设置样式 (悬浮在底部，绿色醒目)
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '100px', // 距离底部
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: '999999',
            backgroundColor: '#07c160', // 微信绿
            color: '#ffffff',
            padding: '15px 30px',
            borderRadius: '50px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            fontSize: '18px',
            fontWeight: 'bold',
            textDecoration: 'none',
            textAlign: 'center',
            cursor: 'pointer',
            border: '2px solid #fff',
            whiteSpace: 'nowrap'
        });

        // 鼠标悬停效果
        btn.onmouseover = () => { btn.style.backgroundColor = '#06ad56'; };
        btn.onmouseout = () => { btn.style.backgroundColor = '#07c160'; };

        document.body.appendChild(btn);
    };

    // 启动
    init();

})();