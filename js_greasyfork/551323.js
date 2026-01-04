// ==UserScript==
// @name         视频快进快退+自定义按钮（可拖动+开关+记忆秒数）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  可拖动快进快退面板，含自定义输入、开关和秒数记忆，操作window.player.currentTime
// @author       t.k
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551323/%E8%A7%86%E9%A2%91%E5%BF%AB%E8%BF%9B%E5%BF%AB%E9%80%80%2B%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8C%89%E9%92%AE%EF%BC%88%E5%8F%AF%E6%8B%96%E5%8A%A8%2B%E5%BC%80%E5%85%B3%2B%E8%AE%B0%E5%BF%86%E7%A7%92%E6%95%B0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/551323/%E8%A7%86%E9%A2%91%E5%BF%AB%E8%BF%9B%E5%BF%AB%E9%80%80%2B%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8C%89%E9%92%AE%EF%BC%88%E5%8F%AF%E6%8B%96%E5%8A%A8%2B%E5%BC%80%E5%85%B3%2B%E8%AE%B0%E5%BF%86%E7%A7%92%E6%95%B0%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 本地存储key
    const PANEL_VISIBLE_KEY = '__jump_panel_visible__';
    const CUSTOM_SECONDS_KEY = '__jump_custom_seconds__';

    // 按钮配置
    const backwardButtons = [
        { label: '⏪10s', offset: -10 },
        { label: '⏪1m', offset: -60 },
        { label: '⏪10m', offset: -600 }
    ];
    const forwardButtons = [
        { label: '⏩10s', offset: 10 },
        { label: '⏩1m', offset: 60 },
        { label: '⏩10m', offset: 600 }
    ];

    // 右上角开关按钮
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = '快进/快退面板';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.top = '20px';
    toggleBtn.style.right = '28px';
    toggleBtn.style.zIndex = '999999';
    toggleBtn.style.background = '#222';
    toggleBtn.style.color = '#fff';
    toggleBtn.style.border = 'none';
    toggleBtn.style.borderRadius = '6px';
    toggleBtn.style.padding = '7px 16px';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.fontSize = '15px';
    toggleBtn.style.opacity = '0.5';
    toggleBtn.style.transition = 'opacity 0.2s';
    toggleBtn.onmouseenter = () => toggleBtn.style.opacity = '0.95';
    toggleBtn.onmouseleave = () => toggleBtn.style.opacity = '0.5';
    document.body.appendChild(toggleBtn);

    // 可拖动面板
    const dragContainer = document.createElement('div');
    dragContainer.style.position = 'fixed';
    dragContainer.style.left = '40px';
    dragContainer.style.top = '60px';
    dragContainer.style.zIndex = '999998';
    dragContainer.style.userSelect = 'none';
    dragContainer.style.background = 'rgba(0,0,0,0.05)';
    dragContainer.style.borderRadius = '10px';
    dragContainer.style.padding = '14px 18px 12px 18px';
    dragContainer.style.boxShadow = '0 2px 12px rgba(0,0,0,0.12)';
    dragContainer.style.display = 'inline-block';
    dragContainer.style.backdropFilter = 'blur(2px)';
    dragContainer.style.minWidth = '320px';
    dragContainer.style.fontFamily = 'sans-serif';

    // 拖动逻辑
    let isDragging = false, startX, startY, startLeft, startTop;
    dragContainer.addEventListener('mousedown', function(e) {
        // 只允许在面板空白区拖动
        if (e.target !== dragContainer) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = parseInt(dragContainer.style.left);
        startTop = parseInt(dragContainer.style.top);
        e.preventDefault();
    });
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        dragContainer.style.left = (startLeft + e.clientX - startX) + 'px';
        dragContainer.style.top = (startTop + e.clientY - startY) + 'px';
    });
    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // 标题
    const title = document.createElement('div');
    title.textContent = '快进/快退控制';
    title.style.fontWeight = 'bold';
    title.style.fontSize = '16px';
    title.style.marginBottom = '8px';
    title.style.color = '#333';
    dragContainer.appendChild(title);

    // 快退按钮行
    const backRow = document.createElement('div');
    backRow.style.display = 'flex';
    backRow.style.flexDirection = 'row';
    backRow.style.gap = '10px';
    backRow.style.marginBottom = '8px';

    backwardButtons.forEach(({label, offset}) => {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.style.opacity = '0.3';
        btn.style.background = '#000';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '6px';
        btn.style.padding = '8px 16px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '16px';
        btn.style.transition = 'opacity 0.2s';
        btn.onmouseenter = () => btn.style.opacity = '0.7';
        btn.onmouseleave = () => btn.style.opacity = '0.3';
        btn.onclick = () => {
            if (window.player && typeof window.player.currentTime === 'number') {
                let t = window.player.currentTime + offset;
                if (t < 0) t = 0;
                if (window.player.duration && t > window.player.duration) t = window.player.duration;
                window.player.currentTime = t;
            } else {
                alert('window.player.currentTime 不存在！');
            }
        };
        backRow.appendChild(btn);
    });
    dragContainer.appendChild(backRow);

    // 快进按钮行
    const forwardRow = document.createElement('div');
    forwardRow.style.display = 'flex';
    forwardRow.style.flexDirection = 'row';
    forwardRow.style.gap = '10px';
    forwardRow.style.marginBottom = '8px';

    forwardButtons.forEach(({label, offset}) => {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.style.opacity = '0.3';
        btn.style.background = '#000';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '6px';
        btn.style.padding = '8px 16px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '16px';
        btn.style.transition = 'opacity 0.2s';
        btn.onmouseenter = () => btn.style.opacity = '0.7';
        btn.onmouseleave = () => btn.style.opacity = '0.3';
        btn.onclick = () => {
            if (window.player && typeof window.player.currentTime === 'number') {
                let t = window.player.currentTime + offset;
                if (t < 0) t = 0;
                if (window.player.duration && t > window.player.duration) t = window.player.duration;
                window.player.currentTime = t;
            } else {
                alert('window.player.currentTime 不存在！');
            }
        };
        forwardRow.appendChild(btn);
    });
    dragContainer.appendChild(forwardRow);

    // 自定义行
    const customRow = document.createElement('div');
    customRow.style.display = 'flex';
    customRow.style.flexDirection = 'row';
    customRow.style.alignItems = 'center';
    customRow.style.gap = '8px';

    const input = document.createElement('input');
    input.type = 'number';
    input.placeholder = '秒数';
    input.style.width = '70px';
    input.style.padding = '7px';
    input.style.border = '1px solid #aaa';
    input.style.borderRadius = '6px';
    input.style.fontSize = '15px';
    input.style.background = 'rgba(255,255,255,0.7)';
    input.style.color = '#222';

    // 恢复自定义秒数
    const savedSeconds = localStorage.getItem(CUSTOM_SECONDS_KEY);
    if (savedSeconds && !isNaN(savedSeconds)) {
        input.value = savedSeconds;
    }

    // 保存自定义秒数
    input.addEventListener('input', () => {
        if (input.value && !isNaN(input.value)) {
            localStorage.setItem(CUSTOM_SECONDS_KEY, input.value);
        }
    });

    const btnBack = document.createElement('button');
    btnBack.textContent = '⏪自定义';
    btnBack.style.opacity = '0.3';
    btnBack.style.background = '#000';
    btnBack.style.color = '#fff';
    btnBack.style.border = 'none';
    btnBack.style.borderRadius = '6px';
    btnBack.style.padding = '8px 16px';
    btnBack.style.cursor = 'pointer';
    btnBack.style.fontSize = '16px';
    btnBack.style.transition = 'opacity 0.2s';
    btnBack.onmouseenter = () => btnBack.style.opacity = '0.7';
    btnBack.onmouseleave = () => btnBack.style.opacity = '0.3';
    btnBack.onclick = () => {
        const val = parseFloat(input.value);
        if (isNaN(val) || val <= 0) return alert('请输入正数秒数');
        if (window.player && typeof window.player.currentTime === 'number') {
            let t = window.player.currentTime - val;
            if (t < 0) t = 0;
            if (window.player.duration && t > window.player.duration) t = window.player.duration;
            window.player.currentTime = t;
        } else {
            alert('window.player.currentTime 不存在！');
        }
    };

    const btnForward = document.createElement('button');
    btnForward.textContent = '⏩自定义';
    btnForward.style.opacity = '0.3';
    btnForward.style.background = '#000';
    btnForward.style.color = '#fff';
    btnForward.style.border = 'none';
    btnForward.style.borderRadius = '6px';
    btnForward.style.padding = '8px 16px';
    btnForward.style.cursor = 'pointer';
    btnForward.style.fontSize = '16px';
    btnForward.style.transition = 'opacity 0.2s';
    btnForward.onmouseenter = () => btnForward.style.opacity = '0.7';
    btnForward.onmouseleave = () => btnForward.style.opacity = '0.3';
    btnForward.onclick = () => {
        const val = parseFloat(input.value);
        if (isNaN(val) || val <= 0) return alert('请输入正数秒数');
        if (window.player && typeof window.player.currentTime === 'number') {
            let t = window.player.currentTime + val;
            if (t < 0) t = 0;
            if (window.player.duration && t > window.player.duration) t = window.player.duration;
            window.player.currentTime = t;
        } else {
            alert('window.player.currentTime 不存在！');
        }
    };

    customRow.appendChild(input);
    customRow.appendChild(btnBack);
    customRow.appendChild(btnForward);

    dragContainer.appendChild(customRow);

    // 面板显示/隐藏逻辑
    function setPanelVisible(visible) {
        dragContainer.style.display = visible ? 'inline-block' : 'none';
        localStorage.setItem(PANEL_VISIBLE_KEY, visible ? '1' : '0');
        toggleBtn.textContent = visible ? '关闭快进/快退面板' : '快进/快退面板';
        toggleBtn.style.background = visible ? '#d32f2f' : '#222';
    }

    // 开关按钮事件
    toggleBtn.onclick = function() {
        const visible = dragContainer.style.display === 'none';
        setPanelVisible(visible);
    };

    // 初始化显示状态
    const initialVisible = localStorage.getItem(PANEL_VISIBLE_KEY) === '1';
    setPanelVisible(initialVisible);

    // 加入页面
    document.body.appendChild(dragContainer);

})();
