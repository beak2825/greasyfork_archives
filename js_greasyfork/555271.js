// ==UserScript==
// @name         网页定时刷新
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  网页定时刷新工具
// @author       huihuia24
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @noframes
// @homepage     https://github.com/huihuia24
// @source       https://github.com/huihuia24/Web-page-auto-refresh
// @icon         https://pic.uzzf.com/up/2025-5/2025591617247637.png
// @downloadURL https://update.greasyfork.org/scripts/555271/%E7%BD%91%E9%A1%B5%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/555271/%E7%BD%91%E9%A1%B5%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 单实例防护
    const UI_ID = 'realTimeRefreshTool';
    if (document.getElementById(UI_ID)) return;
    
    const SITE_KEY = window.location.hostname;
    const INSTANCE_KEY = `${SITE_KEY}_refresh_instance`;
    if (GM_getValue(INSTANCE_KEY, false)) return;
    GM_setValue(INSTANCE_KEY, true);

    // 状态存储
    const STATE_KEY = {
        isEnabled: `${SITE_KEY}_is_enabled`,
        interval: `${SITE_KEY}_interval`,
        unit: `${SITE_KEY}_unit`,
        lastStartTime: `${SITE_KEY}_last_start`,
        position: `${SITE_KEY}_ui_position`
    };

    // 恢复状态
    let isEnabled = GM_getValue(STATE_KEY.isEnabled, false);
    let currentUnit = GM_getValue(STATE_KEY.unit, 's');
    let intervalSeconds = GM_getValue(STATE_KEY.interval, 60);
    let lastStartTime = GM_getValue(STATE_KEY.lastStartTime, Date.now());
    let remainingSeconds = 0;
    let timer = null;
    let isDragging = false;
    let offsetX, offsetY;
    let animationFrameId = null;

    // 计算剩余时间
    function calculateRemaining() {
        if (!isEnabled) return intervalSeconds;
        const now = Date.now();
        const elapsed = Math.floor((now - lastStartTime) / 1000);
        return Math.max(0, intervalSeconds - elapsed);
    }
    remainingSeconds = calculateRemaining();

    // 单位转换
    function convertToSeconds(value, unit) {
        switch(unit) {
            case 'h': return value * 3600;
            case 'm': return value * 60;
            case 's': default: return value;
        }
    }
    function convertFromSeconds(seconds, unit) {
        switch(unit) {
            case 'h': return Math.floor(seconds / 3600);
            case 'm': return Math.floor(seconds / 60);
            case 's': default: return seconds;
        }
    }
    function formatTime(seconds) {
        if (seconds < 60) return `${seconds}s`;
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m${s}s`;
    }

    // 创建UI（确保时长实时生效）
    function createUI() {
        // 主容器
        const container = document.createElement('div');
        container.id = UI_ID;
        container.style.cssText = `
            position: fixed;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px 16px;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
            z-index: 99999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 12px;
            user-select: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            will-change: transform, box-shadow;
        `;

        // 全局悬停效果
        container.addEventListener('mouseenter', () => {
            if (!isDragging) {
                container.style.transform = 'translateY(-2px)';
                container.style.boxShadow = isEnabled
                    ? '0 8px 24px rgba(239, 68, 68, 0.2)'
                    : '0 8px 24px rgba(99, 102, 241, 0.2)';
            }
        });
        container.addEventListener('mouseleave', () => {
            if (!isDragging) {
                container.style.transform = 'translateY(0)';
                container.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.08)';
            }
        });

        // 恢复位置
        const savedPos = GM_getValue(STATE_KEY.position, { top: '20px', left: '20px' });
        container.style.top = savedPos.top;
        container.style.left = savedPos.left;

        // 图标区域
        const iconArea = document.createElement('div');
        iconArea.style.cssText = `
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        iconArea.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" width="18" height="18">
                <path d="M23 4v6h-6"/>
                <path d="M1 20v-6h6"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
        `;

        // 标题
        const title = document.createElement('span');
        title.textContent = '定时刷新 =';
        title.style.fontWeight = '500';
        title.style.color = '#1e293b';

        // 输入框（实时生效修复）
        const input = document.createElement('input');
        input.type = 'number';
        input.value = convertFromSeconds(intervalSeconds, currentUnit);
        input.min = currentUnit === 's' ? 5 : 1;
        input.style.cssText = `
            width: 50px;
            padding: 6px 10px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s ease;
            cursor: text;
        `;
        
        // 关键修复：使用input事件实时更新，而非仅依赖change事件
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.trim() === '') return;
            
            const value = Math.max(parseInt(this.value, 10) || 1, parseInt(this.min, 10));
            const newInterval = convertToSeconds(value, currentUnit);
            
            // 实时更新状态
            intervalSeconds = newInterval;
            GM_setValue(STATE_KEY.interval, intervalSeconds);
            
            // 正在运行时立即更新剩余时间
            if (isEnabled) {
                remainingSeconds = intervalSeconds;
                uiElements.statusText.textContent = `(剩余: ${formatTime(remainingSeconds)})`;
                restartTimer(); // 立即重启计时器应用新时长
            } else {
                remainingSeconds = intervalSeconds;
                uiElements.statusText.textContent = `(剩余: ${formatTime(remainingSeconds)})`;
            }
        });
        
        input.addEventListener('focus', () => {
            input.style.borderColor = '#a5b4fc';
            container.style.userSelect = 'text';
        });
        input.addEventListener('blur', () => {
            input.style.borderColor = '#e2e8f0';
            container.style.userSelect = 'none';
            // 失焦时确保值有效
            if (input.value.trim() === '') {
                input.value = convertFromSeconds(intervalSeconds, currentUnit);
            }
        });

        // 单位选择（实时生效修复）
        const unitSelect = document.createElement('select');
        unitSelect.style.cssText = `
            padding: 6px 10px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            background: white;
            font-size: 14px;
            color: #475569;
            cursor: pointer;
            outline: none;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' width='12' height='12'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 10px center;
            background-size: 12px;
            transition: border-color 0.2s ease;
        `;
        ['s', 'm', 'h'].forEach(unit => {
            const option = document.createElement('option');
            option.value = unit;
            option.textContent = { s: '秒', m: '分', h: '时' }[unit];
            option.selected = unit === currentUnit;
            unitSelect.appendChild(option);
        });
        
        // 关键修复：单位切换后立即更新并应用
        unitSelect.addEventListener('change', function() {
            const oldUnit = currentUnit;
            currentUnit = this.value;
            
            // 计算新单位下的数值
            const minValue = currentUnit === 's' ? 5 : 1;
            let newValue = convertFromSeconds(intervalSeconds, currentUnit);
            newValue = Math.max(newValue, minValue);
            
            // 更新输入框
            input.value = newValue;
            input.min = minValue;
            
            // 实时更新状态
            GM_setValue(STATE_KEY.unit, currentUnit);
            
            // 正在运行时立即应用新单位
            if (isEnabled) {
                // 重新计算剩余时间（基于新单位转换后的总时长）
                intervalSeconds = convertToSeconds(newValue, currentUnit);
                GM_setValue(STATE_KEY.interval, intervalSeconds);
                remainingSeconds = intervalSeconds;
                uiElements.statusText.textContent = `(剩余: ${formatTime(remainingSeconds)})`;
                restartTimer(); // 立即重启计时器
            } else {
                intervalSeconds = convertToSeconds(newValue, currentUnit);
                GM_setValue(STATE_KEY.interval, intervalSeconds);
                remainingSeconds = intervalSeconds;
                uiElements.statusText.textContent = `(剩余: ${formatTime(remainingSeconds)})`;
            }
        });
        
        unitSelect.addEventListener('focus', () => {
            unitSelect.style.borderColor = '#a5b4fc';
        });
        unitSelect.addEventListener('blur', () => {
            unitSelect.style.borderColor = '#e2e8f0';
        });

        // 控制按钮
        const controlBtn = document.createElement('button');
        controlBtn.style.cssText = `
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            border: none;
            border-radius: 8px;
            color: white;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            background: ${isEnabled ? 'linear-gradient(135deg, #f87171, #ef4444)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)'};
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        controlBtn.innerHTML = isEnabled 
            ? `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" width="16" height="16">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                </svg>
                停止
            ` 
            : `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" width="16" height="16">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                启动
            `;

        // 状态显示
        const statusText = document.createElement('span');
        statusText.textContent = isEnabled ? `(剩余: ${formatTime(remainingSeconds)})` : '(已停止)';
        statusText.style.cssText = `
            color: #64748b;
            font-size: 13px;
            min-width: 90px;
            text-align: center;
            font-family: monospace;
        `;

        // 组装UI
        container.appendChild(iconArea);
        container.appendChild(title);
        container.appendChild(input);
        container.appendChild(unitSelect);
        container.appendChild(controlBtn);
        container.appendChild(statusText);
        document.body.appendChild(container);

        // 拖拽功能
        container.addEventListener('mousedown', (e) => {
            if (e.target === input || e.target === unitSelect) {
                return;
            }
            
            isDragging = true;
            const rect = container.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            container.style.transition = 'none';
            container.style.zIndex = '999999';
            container.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(() => {
                const newLeft = e.clientX - offsetX;
                const newTop = e.clientY - offsetY;
                const maxLeft = window.innerWidth - container.offsetWidth - 20;
                const maxTop = window.innerHeight - container.offsetHeight - 20;
                
                container.style.left = `${Math.max(20, Math.min(newLeft, maxLeft))}px`;
                container.style.top = `${Math.max(20, Math.min(newTop, maxTop))}px`;
            });
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
                container.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                container.style.zIndex = '99999';
                container.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.08)';
                GM_setValue(STATE_KEY.position, {
                    top: container.style.top,
                    left: container.style.left
                });
            }
        });

        // 控制按钮事件
        controlBtn.addEventListener('click', () => {
            if (isEnabled) {
                stopTimer();
                controlBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" width="16" height="16">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                    启动
                `;
                controlBtn.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
                statusText.textContent = '(已停止)';
                container.dispatchEvent(new Event('mouseleave'));
                container.dispatchEvent(new Event('mouseenter'));
            } else {
                startTimer();
                controlBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" width="16" height="16">
                        <rect x="6" y="4" width="4" height="16"/>
                        <rect x="14" y="4" width="4" height="16"/>
                    </svg>
                    停止
                `;
                controlBtn.style.background = 'linear-gradient(135deg, #f87171, #ef4444)';
                container.dispatchEvent(new Event('mouseleave'));
                container.dispatchEvent(new Event('mouseenter'));
            }
        });

        return { container, controlBtn, statusText, input, unitSelect, iconArea };
    }

    // 计时器控制（确保立即应用新时长）
    function startTimer() {
        isEnabled = true;
        lastStartTime = Date.now();
        // 强制使用当前设置的时长
        remainingSeconds = intervalSeconds;
        GM_setValue(STATE_KEY.isEnabled, true);
        GM_setValue(STATE_KEY.lastStartTime, lastStartTime);
        GM_setValue(STATE_KEY.interval, intervalSeconds); // 确保存储最新值

        if (timer) clearInterval(timer);
        timer = setInterval(() => {
            remainingSeconds--;
            uiElements.statusText.textContent = `(剩余: ${formatTime(remainingSeconds)})`;

            if (remainingSeconds <= 0) {
                clearInterval(timer);
                GM_setValue(STATE_KEY.lastStartTime, Date.now());
                window.location.reload();
            }
        }, 1000);
    }

    function stopTimer() {
        if (timer) clearInterval(timer);
        timer = null;
        isEnabled = false;
        GM_setValue(STATE_KEY.isEnabled, false);
    }

    // 关键修复：重启计时器时强制使用最新设置的时长
    function restartTimer() {
        if (timer) clearInterval(timer);
        lastStartTime = Date.now();
        remainingSeconds = intervalSeconds; // 使用最新的时长
        GM_setValue(STATE_KEY.lastStartTime, lastStartTime);
        GM_setValue(STATE_KEY.interval, intervalSeconds); // 确保存储最新值
        
        timer = setInterval(() => {
            remainingSeconds--;
            uiElements.statusText.textContent = `(剩余: ${formatTime(remainingSeconds)})`;

            if (remainingSeconds <= 0) {
                clearInterval(timer);
                GM_setValue(STATE_KEY.lastStartTime, Date.now());
                window.location.reload();
            }
        }, 1000);
    }

    // 初始化
    const uiElements = createUI();

    // 自动启动
    if (isEnabled) {
        startTimer();
    }

    // 页面卸载清理
    window.addEventListener('beforeunload', () => {
        GM_setValue(INSTANCE_KEY, false);
    });
})();