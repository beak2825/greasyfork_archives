// ==UserScript==
// @name         Discord 可拖动的回顶按钮
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在Discord页面添加一个可拖动的按钮，点击后跳转到当前频道的初始位置 (URL末尾变为 /1)
// @author       You
// @match        https://discord.com/channels/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563573/Discord%20%E5%8F%AF%E6%8B%96%E5%8A%A8%E7%9A%84%E5%9B%9E%E9%A1%B6%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/563573/Discord%20%E5%8F%AF%E6%8B%96%E5%8A%A8%E7%9A%84%E5%9B%9E%E9%A1%B6%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 创建按钮元素
    const btn = document.createElement('div');
    btn.innerText = '回顶';

    // 2. 设置按钮样式
    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '50px',            // 默认右下角
        right: '50px',             // 默认右下角
        width: '50px',
        height: '50px',
        backgroundColor: 'rgb(93, 156, 188)', // 指定颜色
        color: '#ffffff',
        borderRadius: '50%',       // 圆形
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        zIndex: '9999',            // 保证在最上层
        userSelect: 'none',        // 防止拖拽时选中文字
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        fontSize: '14px',
        fontWeight: 'bold',
        fontFamily: 'sans-serif'
    });

    document.body.appendChild(btn);

    // 3. 实现拖拽功能
    let isDragging = false;
    let hasMoved = false; // 用于区分是“点击”还是“拖拽”
    let offsetX, offsetY;

    btn.addEventListener('mousedown', (e) => {
        isDragging = true;
        hasMoved = false;
        // 计算鼠标点击点相对于按钮左上角的偏移
        offsetX = e.clientX - btn.getBoundingClientRect().left;
        offsetY = e.clientY - btn.getBoundingClientRect().top;
        btn.style.cursor = 'move';
        btn.style.transition = 'none'; // 拖动时移除过渡动画
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        // 只要移动了，就标记为 hasMoved，防止触发点击事件
        hasMoved = true;
        e.preventDefault(); // 防止选中页面文字

        // 将 bottom/right 清除，改为使用 left/top 定位
        btn.style.bottom = 'auto';
        btn.style.right = 'auto';

        // 计算新位置
        let left = e.clientX - offsetX;
        let top = e.clientY - offsetY;

        // 边界检查（防止拖出屏幕）
        const maxX = window.innerWidth - btn.offsetWidth;
        const maxY = window.innerHeight - btn.offsetHeight;

        left = Math.min(Math.max(0, left), maxX);
        top = Math.min(Math.max(0, top), maxY);

        btn.style.left = left + 'px';
        btn.style.top = top + 'px';
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            btn.style.cursor = 'pointer';
        }
    });

    // 4. 点击跳转逻辑
    btn.addEventListener('click', () => {
        // 如果刚刚进行了拖拽操作，则不触发跳转
        if (hasMoved) return;

        // 获取当前 URL 路径
        // 典型格式: /channels/GUILD_ID/CHANNEL_ID/MESSAGE_ID
        // 分割后: ["", "channels", "GUILD_ID", "CHANNEL_ID", "MESSAGE_ID"]
        const pathParts = window.location.pathname.split('/');

        // 确保路径至少包含 channels, guild_id, channel_id (长度至少为4)
        if (pathParts.length >= 4) {
            // 提取前三个重要部分： /channels/GUILD_ID/CHANNEL_ID
            const baseChannelPath = `/${pathParts[1]}/${pathParts[2]}/${pathParts[3]}`;

            // 拼接 /1
            const targetUrl = window.location.origin + baseChannelPath + '/1';

            // 跳转
            window.location.href = targetUrl;
        } else {
            console.log("当前不在有效的频道URL中");
        }
    });

})();
