// ==UserScript==
// @name         RockyIdle 血量减少20后自动点击背包最后一个物品
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  当血量低于阈值时自动点击背包最后一个物品
// @author       tiande
// @match        https://rockyidle.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563130/RockyIdle%20%E8%A1%80%E9%87%8F%E5%87%8F%E5%B0%9120%E5%90%8E%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%83%8C%E5%8C%85%E6%9C%80%E5%90%8E%E4%B8%80%E4%B8%AA%E7%89%A9%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/563130/RockyIdle%20%E8%A1%80%E9%87%8F%E5%87%8F%E5%B0%9120%E5%90%8E%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%83%8C%E5%8C%85%E6%9C%80%E5%90%8E%E4%B8%80%E4%B8%AA%E7%89%A9%E5%93%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const HP_THRESHOLD = 20; // 血量差值阈值
    const CHECK_INTERVAL = 200; // 检查间隔(毫秒)
    
    // 脚本状态
    let isEnabled = true;
    let checkTimer = null;

    // 获取当前血量信息
    function getHPInfo() {
        const hpElement = document.querySelector('span.z-10');
        if (!hpElement) return null;

        const hpText = hpElement.textContent.trim();
        const match = hpText.match(/(\d+)\s*\/\s*(\d+)/);
        
        if (match) {
            return {
                current: parseInt(match[1]),
                max: parseInt(match[2])
            };
        }
        return null;
    }

    // 点击背包最后一格(第24格)
    function clickLastInventorySlot() {
        // 找到背包容器
        const inventory = document.querySelector('.grid.grid-cols-4.grid-rows-7');
        if (!inventory) {
            console.log('[自动吃药] 未找到背包');
            return false;
        }

        // 获取所有格子
        const slots = inventory.querySelectorAll('.h-fit > div');
        if (slots.length === 0) {
            console.log('[自动吃药] 背包格子为空');
            return false;
        }

        // 找到第24格(索引23)或最后一个有物品的格子
        let targetSlot = null;
        
        // 从后往前找第一个有物品的格子
        for (let i = slots.length - 1; i >= 0; i--) {
            const slot = slots[i];
            const img = slot.querySelector('img[alt="image"]');
            if (img && img.src && img.src.startsWith('data:image')) {
                targetSlot = slot;
                break;
            }
        }

        if (!targetSlot) {
            console.log('[自动吃药] 未找到药品');
            return false;
        }

        // 检查是否可点击
        if (targetSlot.style.opacity === '1' && 
            targetSlot.getAttribute('aria-disabled') === 'false') {
            targetSlot.click();
            console.log('[自动吃药] 已使用药品');
            return true;
        }

        return false;
    }

    // 主检查函数
    function checkAndHeal() {
        if (!isEnabled) return;
        
        const hpInfo = getHPInfo();
        
        if (!hpInfo) {
            return;
        }

        const hpDiff = hpInfo.max - hpInfo.current;
        
        if (hpDiff > HP_THRESHOLD) {
            console.log(`[自动吃药] 血量: ${hpInfo.current}/${hpInfo.max}, 差值: ${hpDiff}, 需要吃药`);
            clickLastInventorySlot();
        }
    }

    // 创建浮动开关
    function createToggleButton() {
        const button = document.createElement('div');
        button.id = 'auto-heal-toggle';
        button.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                width: 120px;
                height: 40px;
                background: ${isEnabled ? '#10b981' : '#ef4444'};
                color: white;
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: move;
                user-select: none;
                z-index: 99999;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
                font-weight: bold;
                font-size: 14px;
                transition: background 0.3s;
            ">
                <span id="toggle-text">${isEnabled ? '🍖 自动吃药' : '❌ 已暂停'}</span>
            </div>
        `;
        
        document.body.appendChild(button);
        
        const toggleDiv = button.firstElementChild;
        const toggleText = document.getElementById('toggle-text');
        
        // 点击切换状态
        toggleDiv.addEventListener('click', (e) => {
            if (!isDragging) {
                isEnabled = !isEnabled;
                toggleDiv.style.background = isEnabled ? '#10b981' : '#ef4444';
                toggleText.textContent = isEnabled ? '🍖 自动吃药' : '❌ 已暂停';
                console.log(`[自动吃药] ${isEnabled ? '已启用' : '已暂停'}`);
            }
        });
        
        // 拖拽功能
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        toggleDiv.addEventListener('mousedown', (e) => {
            isDragging = false;
            startX = e.clientX;
            startY = e.clientY;
            const rect = toggleDiv.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            
            function onMouseMove(e) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                    isDragging = true;
                }
                toggleDiv.style.left = (startLeft + dx) + 'px';
                toggleDiv.style.top = (startTop + dy) + 'px';
                toggleDiv.style.right = 'auto';
            }
            
            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                setTimeout(() => { isDragging = false; }, 10);
            }
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    // 启动定时检查
    console.log('[自动吃药] 脚本已启动');
    checkTimer = setInterval(checkAndHeal, CHECK_INTERVAL);

    // 页面加载完成后立即检查一次并创建开关
    if (document.readyState === 'complete') {
        checkAndHeal();
        createToggleButton();
    } else {
        window.addEventListener('load', () => {
            checkAndHeal();
            createToggleButton();
        });
    }
})();