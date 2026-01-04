// ==UserScript==
// @name         复制当前链接
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  20px完美渐变玫粉色按钮，拖动超跟手，点击效果惊艳
// @author       YourName
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553162/%E5%A4%8D%E5%88%B6%E5%BD%93%E5%89%8D%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/553162/%E5%A4%8D%E5%88%B6%E5%BD%93%E5%89%8D%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮元素
    const copyButton = document.createElement('div');
    copyButton.id = 'copy-link-button';
    
    // 设置按钮样式（20px大小，精致设计）
    copyButton.style.position = 'fixed';
    copyButton.style.bottom = '20px';
    copyButton.style.right = '20px';
    copyButton.style.width = '20px';
    copyButton.style.height = '20px';
    copyButton.style.borderRadius = '50%';
    copyButton.style.background = 'white';
    copyButton.style.border = '1px solid rgba(255,255,255,0.3)';
    copyButton.style.boxShadow = '0 2px 8px rgba(255,105,180,0.3)';
    copyButton.style.cursor = 'pointer';
    copyButton.style.zIndex = '9999';
    copyButton.style.transition = 'all 0.1s ease-out';
    copyButton.style.userSelect = 'none';
    copyButton.style.pointerEvents = 'auto';
    copyButton.style.touchAction = 'none';
    copyButton.style.willChange = 'transform'; // 提升动画性能
    
    // 拖动功能变量
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    let animationFrameId = null;
    
    // 开始拖动（优化后的拖动开始）
    copyButton.addEventListener('mousedown', startDrag);
    copyButton.addEventListener('touchstart', startDrag, { passive: false });
    
    function startDrag(e) {
        // 获取初始位置
        const rect = copyButton.getBoundingClientRect();
        startLeft = parseInt(copyButton.style.left) || rect.left;
        startTop = parseInt(copyButton.style.top) || rect.top;
        
        // 获取初始指针位置
        const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
        
        startX = clientX;
        startY = clientY;
        
        // 立即开始拖动
        isDragging = true;
        
        // 拖动时样式（更明显的反馈）
        copyButton.style.transform = 'scale(1.2)';
        copyButton.style.boxShadow = '0 4px 12px rgba(255,105,180,0.5)';
        copyButton.style.opacity = '0.95';
        
        e.preventDefault();
    }
    
    // 使用requestAnimationFrame实现丝滑拖动
    function handleMove(e) {
        if (!isDragging) return;
        
        // 取消之前的动画帧以防堆积
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        
        // 在新动画帧中更新位置
        animationFrameId = requestAnimationFrame(() => {
            const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
            const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
            
            // 计算新位置（使用CSS transform提升性能）
            const newLeft = startLeft + (clientX - startX);
            const newTop = startTop + (clientY - startY);
            
            // 应用新位置（使用translate3d开启硬件加速）
            copyButton.style.left = newLeft + 'px';
            copyButton.style.top = newTop + 'px';
            copyButton.style.right = 'auto';
            copyButton.style.bottom = 'auto';
            copyButton.style.transform = 'translate3d(0, 0, 0) scale(1.2)';
        });
        
        e.preventDefault();
    }
    
    // 添加移动事件监听
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, { passive: false });
    
    // 结束拖动/点击
    function handleEnd(e) {
        if (!isDragging) return;
        
        // 取消动画帧
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        
        // 判断是否为点击（移动距离小于5px且时间短）
        const clientX = e.type === 'mouseup' ? e.clientX : e.changedTouches[0].clientX;
        const clientY = e.type === 'mouseup' ? e.clientY : e.changedTouches[0].clientY;
        const moveDistance = Math.sqrt(Math.pow(clientX - startX, 2) + Math.pow(clientY - startY, 2));
        
        // 恢复样式
        copyButton.style.transform = 'scale(1)';
        copyButton.style.boxShadow = '0 2px 8px rgba(255,105,180,0.3)';
        copyButton.style.opacity = '1';
        
        // 如果是点击（移动距离小）
        if (moveDistance < 5) {
            handleButtonClick();
        }
        
        isDragging = false;
        e.preventDefault();
    }
    
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);
    
    // 点击处理函数（惊艳的渐变效果）
    function handleButtonClick() {
        const url = window.location.href;
        
        // 点击效果 - 变为美丽渐变玫粉色
        copyButton.style.background = 'linear-gradient(135deg, #ff6b9d 0%, #ff8fab 50%, #ffb3c6 100%)';
        copyButton.style.borderColor = 'transparent';
        copyButton.style.transform = 'scale(1.4)';
        copyButton.style.boxShadow = '0 4px 16px rgba(255,105,180,0.6)';
        
        // 0.4秒后恢复白色
        setTimeout(() => {
            copyButton.style.background = 'white';
            copyButton.style.borderColor = 'rgba(255,255,255,0.3)';
            copyButton.style.transform = 'scale(1)';
            copyButton.style.boxShadow = '0 2px 8px rgba(255,105,180,0.3)';
        }, 400);
        
        // 复制链接
        copyToClipboard(url);
    }
    
    // 终极版复制到剪贴板函数
    async function copyToClipboard(text) {
        try {
            // 优先使用现代API
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
                return;
            }
            
            // 创建优化的复制元素
            const copyEl = document.createElement('textarea');
            copyEl.value = text;
            copyEl.style.position = 'fixed';
            copyEl.style.opacity = '0';
            copyEl.style.left = '-9999px';
            copyEl.setAttribute('readonly', '');
            document.body.appendChild(copyEl);
            
            // 特殊处理iOS
            if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                const range = document.createRange();
                range.selectNodeContents(copyEl);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                copyEl.setSelectionRange(0, 99999);
            } else {
                copyEl.select();
            }
            
            try {
                document.execCommand('copy');
            } finally {
                document.body.removeChild(copyEl);
            }
            
            // 最终回退方案
            if (!navigator.clipboard) {
                prompt('请手动复制链接:', text);
            }
        } catch (err) {
            console.error('复制失败:', err);
            prompt('复制失败，请手动复制:', text);
        }
    }
    
    // 添加到页面
    document.body.appendChild(copyButton);
})();