// ==UserScript==
// @name         快捷复制 Saber Token
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  一键复制 saber-access-token 到剪贴板，圆形按钮可拖拽，支持两个地址
// @author       Dia
// @match        http://10.250.5.21/*
// @match        http://10.138.231.115/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/549688/%E5%BF%AB%E6%8D%B7%E5%A4%8D%E5%88%B6%20Saber%20Token.user.js
// @updateURL https://update.greasyfork.org/scripts/549688/%E5%BF%AB%E6%8D%B7%E5%A4%8D%E5%88%B6%20Saber%20Token.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建圆形悬浮按钮
    const btn = document.createElement('button');
    btn.innerText = '🔑';
    btn.title = '复制 Token';
    btn.style.position = 'fixed';
    btn.style.right = '30px';
    btn.style.bottom = '30px';
    btn.style.zIndex = '9999';
    btn.style.width = '48px';
    btn.style.height = '48px';
    btn.style.background = '#007bff';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '50%';
    btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    btn.style.cursor = 'grab';
    btn.style.fontSize = '24px';
    btn.style.opacity = '0.85';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.userSelect = 'none';

    btn.onmouseover = () => btn.style.opacity = '1';
    btn.onmouseout = () => btn.style.opacity = '0.85';

    // 拖拽功能
    let isDragging = false, offsetX = 0, offsetY = 0;

    btn.addEventListener('mousedown', function(e) {
        isDragging = true;
        btn.style.cursor = 'grabbing';
        offsetX = e.clientX - btn.getBoundingClientRect().left;
        offsetY = e.clientY - btn.getBoundingClientRect().top;
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;
            x = Math.max(0, Math.min(window.innerWidth - btn.offsetWidth, x));
            y = Math.max(0, Math.min(window.innerHeight - btn.offsetHeight, y));
            btn.style.left = x + 'px';
            btn.style.top = y + 'px';
            btn.style.right = '';
            btn.style.bottom = '';
        }
    });

    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            btn.style.cursor = 'grab';
            document.body.style.userSelect = '';
        }
    });

    // 复制 token 的函数
    function copyToken() {
        const cookies = document.cookie.split(';');
        let token = '';
        for (let c of cookies) {
            let [key, value] = c.split('=');
            if (key.trim() === 'saber-access-token') {
                token = decodeURIComponent(value);
                break;
            }
        }
        if (token) {
            if (typeof GM_setClipboard === 'function') {
                GM_setClipboard(token);
            } else {
                navigator.clipboard.writeText(token);
            }
            showTip('Token 已复制！');
        } else {
            showTip('未找到 Token！');
        }
    }

    // 显示提示
    function showTip(msg) {
        const tip = document.createElement('div');
        tip.innerText = msg;
        tip.style.position = 'fixed';
        tip.style.right = '40px';
        tip.style.bottom = '90px';
        tip.style.background = '#333';
        tip.style.color = '#fff';
        tip.style.padding = '10px 18px';
        tip.style.borderRadius = '6px';
        tip.style.zIndex = '10000';
        tip.style.fontSize = '15px';
        tip.style.opacity = '0.95';
        document.body.appendChild(tip);
        setTimeout(() => {
            tip.remove();
        }, 1800);
    }

    btn.onclick = function(e) {
        if (!isDragging) copyToken();
    };

    document.body.appendChild(btn);
})();
