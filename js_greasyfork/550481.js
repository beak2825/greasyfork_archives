// ==UserScript==
// @name         飞书表格 - 可拖拽按钮复制单元格纯文本
// @license      GPL License
// @namespace    https://bytedance.com
// @version      1.0
// @description  按钮可拖拽，复制表格的纯文本，提示居中
// @author       Sfly-小飞哥
// @match        *://*.feishu.cn/*
// @match        *://*.larkoffice.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feishu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550481/%E9%A3%9E%E4%B9%A6%E8%A1%A8%E6%A0%BC%20-%20%E5%8F%AF%E6%8B%96%E6%8B%BD%E6%8C%89%E9%92%AE%E5%A4%8D%E5%88%B6%E5%8D%95%E5%85%83%E6%A0%BC%E7%BA%AF%E6%96%87%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/550481/%E9%A3%9E%E4%B9%A6%E8%A1%A8%E6%A0%BC%20-%20%E5%8F%AF%E6%8B%96%E6%8B%BD%E6%8C%89%E9%92%AE%E5%A4%8D%E5%88%B6%E5%8D%95%E5%85%83%E6%A0%BC%E7%BA%AF%E6%96%87%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BUTTON_ID = 'gcsj-copy-button';
    const STORAGE_KEY = 'gcsj_copy_button_position';

    // 读取上次保存的位置
    const savedPos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const { left, top } = savedPos;

    // 创建按钮
    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.textContent = '📋 复制文本';
    button.title = '点击复制当前单元格纯文本\n可拖动调整位置';

    Object.assign(button.style, {
        position: 'fixed',
        left: left ? `${left}px` : '10px',
        top: top ? `${top}px` : '10px',
        zIndex: '99999',
        padding: '8px 12px',
        background: '#00b96b',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'move',
        fontSize: '13px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        transition: 'background 0.2s',
        userSelect: 'none'
    });

    // 悬停效果
    button.onmouseover = () => {
        button.style.background = '#009a59';
        button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    };
    button.onmouseout = () => {
        button.style.background = '#00b96b';
        button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
    };

    // === 拖拽逻辑 ===
    let isDragging = false;
    let offsetX, offsetY;

    button.onmousedown = function (e) {
        if (e.target !== button) return;
        isDragging = true;
        offsetX = e.clientX - button.offsetLeft;
        offsetY = e.clientY - button.offsetTop;
        button.style.cursor = 'grabbing';
        button.style.opacity = '0.9';
        button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
        e.preventDefault();
    };

    document.onmousemove = function (e) {
        if (!isDragging) return;
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;
        const maxX = window.innerWidth - button.offsetWidth;
        const maxY = window.innerHeight - button.offsetHeight;
        const boundedX = Math.max(0, Math.min(x, maxX));
        const boundedY = Math.max(0, Math.min(y, maxY));
        button.style.left = `${boundedX}px`;
        button.style.top = `${boundedY}px`;
    };

    document.onmouseup = function () {
        if (isDragging) {
            const pos = {
                left: parseInt(button.style.left),
                top: parseInt(button.style.top)
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
        }
        isDragging = false;
        button.style.cursor = 'move';
        button.style.opacity = '1';
        button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
    };

    // === 复制功能（纯文本）===
    button.onclick = function (e) {
        if (isDragging) return;

        const el = document.querySelector('.gcsj-func-normal-text');
        if (!el) {
            showToast('❌ 未找到目标元素');
            return;
        }

        const textContent = el.innerText || el.textContent || '';
        const trimmedContent = textContent.trim();

        if (!trimmedContent) {
            showToast('⚠️ 当前单元格无文本内容');
            return;
        }

        // 预览文本（最多显示 60 个字符）
        const preview = trimmedContent.length > 60
            ? trimmedContent.substring(0, 60) + '...'
            : trimmedContent;

        // 复制到剪贴板
        navigator.clipboard.writeText(trimmedContent)
            .then(() => {
                showToast(`✅ 已复制: "${preview}"`);
            })
            .catch(err => {
                const errorMsg = err.message || '权限被拒绝';
                showToast(`❌ 复制失败: ${errorMsg.substring(0, 80)}`);
            });
    };

    // === 居中提示组件 ===
    function showToast(message) {
        const existing = document.getElementById('gcsj-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'gcsj-toast';
        Object.assign(toast.style, {
            position: 'fixed',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: '90%',
            padding: '12px 20px',
            background: '#52c41a',
            color: 'white',
            borderRadius: '6px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '99999',
            pointerEvents: 'none',
            opacity: '0',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        });

        toast.textContent = message;
        document.body.appendChild(toast);

        // 淡入
        setTimeout(() => toast.style.opacity = '1', 100);

        // 淡出并移除
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentElement) document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }

    // === 防重复注入 ===
    if (document.getElementById(BUTTON_ID)) {
        console.log('🟡 按钮已存在');
        return;
    }

    // 添加按钮
    document.body.appendChild(button);
    console.log('🎯 纯文本复制按钮已注入');
})();