// ==UserScript==
// @name         自定义网页自动刷新（F4快捷键+可拖拽+持续循环）
// @namespace    https://github.com/
// @version      1.0
// @description  支持F4快捷键切换开启/关闭刷新、自定义刷新间隔、窗口自由拖拽，实现持续循环刷新
// @author       Your Name
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564395/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%EF%BC%88F4%E5%BF%AB%E6%8D%B7%E9%94%AE%2B%E5%8F%AF%E6%8B%96%E6%8B%BD%2B%E6%8C%81%E7%BB%AD%E5%BE%AA%E7%8E%AF%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/564395/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%EF%BC%88F4%E5%BF%AB%E6%8D%B7%E9%94%AE%2B%E5%8F%AF%E6%8B%96%E6%8B%BD%2B%E6%8C%81%E7%BB%AD%E5%BE%AA%E7%8E%AF%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量
    let refreshTimer = null;
    let refreshInterval = 30;
    let isDragging = false;
    let panelOffsetX = 0;
    let panelOffsetY = 0;
    // 关键：为当前网页生成唯一存储key（避免不同网页的刷新设置互相干扰）
    const storageKeyPrefix = `custom_refresh_${window.location.hostname}`;
    const isRefreshingKey = `${storageKeyPrefix}_isRefreshing`;
    const intervalKey = `${storageKeyPrefix}_interval`;

    // 1. 注入控制界面样式（保留拖拽样式）
    GM_addStyle(`
        #custom-refresh-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 99999999;
            display: flex;
            align-items: center;
            gap: 8px;
            opacity: 0.8;
            transition: opacity 0.3s, box-shadow 0.3s;
            cursor: move;
        }
        #custom-refresh-panel:hover {
            opacity: 1;
        }
        #custom-refresh-panel.dragging {
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
            opacity: 0.95;
        }
        #custom-refresh-input {
            width: 60px;
            padding: 6px 8px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            text-align: center;
            font-size: 14px;
            cursor: text;
        }
        #custom-refresh-input:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }
        #custom-refresh-btn {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.2s;
        }
        .refresh-start {
            background: #10b981;
            color: white;
        }
        .refresh-stop {
            background: #ef4444;
            color: white;
        }
        #custom-refresh-tip {
            font-size: 12px;
            color: #6b7280;
            user-select: none;
        }
        // 新增：快捷键提示，让用户知晓F4功能
        #custom-refresh-hotkey {
            font-size: 11px;
            color: #9ca3af;
            margin-left: 4px;
            user-select: none;
        }
    `);

    // 2. 读取本地存储的状态和间隔（页面刷新后恢复状态）
    function loadRefreshState() {
        const savedIsRefreshing = localStorage.getItem(isRefreshingKey) === 'true';
        const savedInterval = parseInt(localStorage.getItem(intervalKey) || '30');
        // 验证存储的间隔是否有效
        refreshInterval = isNaN(savedInterval) || savedInterval < 1 ? 30 : savedInterval;
        return savedIsRefreshing;
    }

    // 3. 保存刷新状态到本地存储
    function saveRefreshState(isRefreshing, interval) {
        localStorage.setItem(isRefreshingKey, isRefreshing.toString());
        localStorage.setItem(intervalKey, interval.toString());
    }

    // 4. 启动自动刷新（封装核心逻辑，方便页面刷新后调用）
    function startAutoRefresh(btn, input) {
        const inputValue = parseInt(input.value.trim());
        if (isNaN(inputValue) || inputValue < 1) {
            alert('请输入有效的正整数（最小1秒）');
            input.value = refreshInterval;
            return;
        }
        // 更新间隔并保存状态
        refreshInterval = inputValue;
        saveRefreshState(true, refreshInterval);
        // 更新按钮样式和文本
        btn.classList.remove('refresh-start');
        btn.classList.add('refresh-stop');
        btn.textContent = '停止刷新';
        // 启动定时器（循环刷新）
        refreshTimer = setInterval(() => {
            window.location.reload();
        }, refreshInterval * 1000);
    }

    // 5. 停止自动刷新（封装核心逻辑）
    function stopAutoRefresh(btn) {
        clearInterval(refreshTimer);
        refreshTimer = null;
        // 清空存储的刷新状态
        saveRefreshState(false, refreshInterval);
        // 更新按钮样式和文本
        btn.classList.remove('refresh-stop');
        btn.classList.add('refresh-start');
        btn.textContent = '开始刷新';
    }

    // 6. 绑定F4快捷键事件（核心新增功能）
    function bindHotkeyEvent() {
        document.addEventListener('keydown', function(e) {
            // 监听F4键，同时阻止默认行为（避免触发浏览器/网页原有F4功能）
            if (e.key === 'F4') {
                e.preventDefault(); // 阻止默认F4行为（如关闭窗口、切换标签等）
                e.stopPropagation(); // 阻止事件冒泡

                // 找到刷新按钮，若存在则模拟点击（复用原有切换逻辑，减少冗余）
                const refreshBtn = document.getElementById('custom-refresh-btn');
                const intervalInput = document.getElementById('custom-refresh-input');
                if (refreshBtn && intervalInput) {
                    // 若当前是未启动状态，先验证输入是否有效（和手动点击逻辑一致）
                    if (refreshBtn.classList.contains('refresh-start')) {
                        const inputValue = parseInt(intervalInput.value.trim());
                        if (!isNaN(inputValue) && inputValue >= 1) {
                            refreshBtn.click(); // 输入有效则直接切换
                        } else {
                            alert('请先输入有效的正整数（最小1秒）再使用F4快捷键');
                            intervalInput.value = refreshInterval;
                        }
                    } else {
                        refreshBtn.click(); // 已启动状态，直接点击停止
                    }
                }
            }
        });
    }

    // 7. 构建控制界面并绑定事件
    function createControlPanel() {
        if (document.getElementById('custom-refresh-panel')) {
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'custom-refresh-panel';
        // 新增快捷键提示，让用户知晓F4功能
        panel.innerHTML = `
            <span id="custom-refresh-tip">刷新间隔（秒）：</span>
            <input type="number" id="custom-refresh-input" min="1" value="${refreshInterval}">
            <button id="custom-refresh-btn" class="refresh-start">开始刷新</button>
            <span id="custom-refresh-hotkey">【F4切换】</span>
        `;
        document.body.appendChild(panel);

        const refreshBtn = document.getElementById('custom-refresh-btn');
        const intervalInput = document.getElementById('custom-refresh-input');
        // 读取存储的刷新状态
        const isRefreshing = loadRefreshState();

        // 页面刷新后，若之前处于刷新状态，自动重启刷新
        if (isRefreshing) {
            intervalInput.value = refreshInterval;
            startAutoRefresh(refreshBtn, intervalInput);
        }

        // 按钮点击事件（启动/停止切换）
        refreshBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (this.classList.contains('refresh-start')) {
                startAutoRefresh(this, intervalInput);
            } else {
                stopAutoRefresh(this);
            }
        });

        // 输入框回车触发启动
        intervalInput.addEventListener('keydown', function(e) {
            e.stopPropagation();
            if (e.key === 'Enter' && refreshBtn.classList.contains('refresh-start')) {
                refreshBtn.click();
            }
        });

        // 输入框点击阻止冒泡（避免拖拽冲突）
        intervalInput.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // 绑定拖拽事件
        bindDragEvent(panel);
    }

    // 8. 拖拽逻辑（保留原有功能）
    function bindDragEvent(panel) {
        panel.addEventListener('mousedown', function(e) {
            isDragging = true;
            panel.classList.add('dragging');
            panelOffsetX = e.clientX - panel.getBoundingClientRect().left;
            panelOffsetY = e.clientY - panel.getBoundingClientRect().top;
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            const newLeft = e.clientX - panelOffsetX;
            const newTop = e.clientY - panelOffsetY;
            panel.style.top = `${newTop}px`;
            panel.style.right = 'auto';
            panel.style.left = `${newLeft}px`;
        });

        document.addEventListener('mouseup', function() {
            if (!isDragging) return;
            isDragging = false;
            panel.classList.remove('dragging');
            document.body.style.userSelect = '';
        });

        document.addEventListener('mouseleave', function() {
            if (isDragging) {
                isDragging = false;
                panel.classList.remove('dragging');
                document.body.style.userSelect = '';
            }
        });
    }

    // 9. 初始化：绑定快捷键+创建控制界面
    function init() {
        // 先绑定F4快捷键（确保页面加载完成前也能监听）
        bindHotkeyEvent();
        // 再创建控制界面
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            createControlPanel();
        } else {
            document.addEventListener('DOMContentLoaded', createControlPanel);
        }
    }

    // 执行初始化
    init();

})();