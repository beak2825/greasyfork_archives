// ==UserScript==
// @name         MilkyWay状态监控与刷新
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description  监控页面元素，可自定义时间间隔，如果没找到关键元素就自动刷新页面，保证游戏在线状态
// @author       baozhi
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @icon         https://www.milkywayidle.com/favicon.svg
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/556544/MilkyWay%E7%8A%B6%E6%80%81%E7%9B%91%E6%8E%A7%E4%B8%8E%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/556544/MilkyWay%E7%8A%B6%E6%80%81%E7%9B%91%E6%8E%A7%E4%B8%8E%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class PageMonitor {
        constructor() {
            // 从存储中加载配置，如果没有则使用默认值
            this.config = {
                enabled: GM_getValue('monitor_enabled', true),
                checkInterval: GM_getValue('monitor_checkInterval', 10) * 60 * 1000, // 默认10分钟
                retryInterval: GM_getValue('monitor_retryInterval', 20) * 1000, // 默认20秒（强制大于20秒）
                maxRetries: GM_getValue('monitor_maxRetries', 3),
                panelVisible: GM_getValue('monitor_panelVisible', true),
                panelPosition: GM_getValue('monitor_panelPosition', { top: 10, right: 10 })
            };

            // 强制重试间隔至少20秒
            if (this.config.retryInterval < 20000) {
                this.config.retryInterval = 20000;
            }

            this.retryCount = 0;
            this.lastCheckResult = null;
            this.targetSelectors = [
                'div.Header_displayName__1hN09', // 状态显示元素
                'div.CharacterName_name__1amXp'  // 角色名元素
            ];
            this.isMonitoring = false;
            this.lastCheckTime = null;
            this.initialDelayCompleted = false; // 初始延迟完成标志
            this.nextRetryTime = null; // 下次重试时间

            this.init();
        }

        init() {
            console.log('页面状态监控插件已加载');
            this.createControlPanel();
            this.initKeyboardShortcut();

            // 默认开启监控，刷新后保持监控状态
            this.startMonitoring();
        }

        saveConfig() {
            GM_setValue('monitor_enabled', this.config.enabled);
            GM_setValue('monitor_checkInterval', this.config.checkInterval / (60 * 1000)); // 存储为分钟
            GM_setValue('monitor_retryInterval', this.config.retryInterval / 1000); // 存储为秒
            GM_setValue('monitor_maxRetries', this.config.maxRetries);
            GM_setValue('monitor_panelVisible', this.config.panelVisible);
            GM_setValue('monitor_panelPosition', this.config.panelPosition);
        }

        startMonitoring() {
            if (this.isMonitoring) return;

            this.isMonitoring = true;
            this.initialDelayCompleted = false;
            console.log(`开始监控页面状态，30秒后开始检查，检查间隔：${this.config.checkInterval / (60 * 1000)}分钟，重试间隔：${this.config.retryInterval / 1000}秒`);

            // 重置重试计数
            this.retryCount = 0;
            this.nextRetryTime = null;

            // 30秒延迟后执行第一次检查
            setTimeout(() => {
                this.initialDelayCompleted = true;
                console.log('初始延迟完成，开始正常检查');
                this.checkPageStatus();

                // 设置定时检查
                this.monitorTimer = setInterval(() => {
                    this.checkPageStatus();
                }, this.config.checkInterval);
            }, 30000); // 30秒延迟

            this.config.enabled = true;
            this.saveConfig();
            this.updateControlPanel();
        }

        stopMonitoring() {
            if (this.monitorTimer) {
                clearInterval(this.monitorTimer);
                this.monitorTimer = null;
            }
            this.isMonitoring = false;
            this.config.enabled = false;
            this.saveConfig();
            console.log('停止监控页面状态');
            this.updateControlPanel();
        }

        checkPageStatus() {
            const found = this.checkElementsExistence();
            this.lastCheckTime = new Date();
            this.lastCheckResult = found ? '成功' : '失败';

            if (!found) {
                this.retryCount++;
                console.warn(`第 ${this.retryCount} 次检查未找到关键元素`);

                if (this.retryCount >= this.config.maxRetries) {
                    console.log(`已达到最大重试次数 ${this.config.maxRetries}，执行页面刷新`);
                    this.refreshPage();
                } else {
                    // 如果没找到元素，但重试次数未满，设置下次重试时间
                    this.nextRetryTime = new Date(Date.now() + this.config.retryInterval);

                    // 等待自定义时间后再次检查
                    setTimeout(() => {
                        this.checkPageStatus();
                    }, this.config.retryInterval);
                }
            } else {
                // 找到元素，重置重试计数和下次重试时间
                if (this.retryCount > 0) {
                    console.log('关键元素已找到，重置重试计数');
                    this.retryCount = 0;
                    this.nextRetryTime = null;
                }
            }

            this.updateControlPanel();
        }

        checkElementsExistence() {
            for (const selector of this.targetSelectors) {
                try {
                    const element = document.querySelector(selector);
                    if (element && this.isElementVisible(element)) {
                        console.log(`找到元素: ${selector}`);
                        return true;
                    }
                } catch (error) {
                    console.warn(`检查元素 ${selector} 时出错:`, error);
                }
            }
            return false;
        }

        isElementVisible(element) {
            if (!element) return false;

            const style = window.getComputedStyle(element);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
                return false;
            }

            if (element.offsetWidth === 0 && element.offsetHeight === 0) {
                return false;
            }

            return true;
        }

        refreshPage() {
            console.log('执行页面刷新...');
            // 注意：这里不要停止监控，因为刷新后需要保持监控状态
            // 刷新页面
            window.location.reload();
        }

        createControlPanel() {
            // 创建控制面板
            this.controlPanel = document.createElement('div');
            this.controlPanel.id = 'page-monitor-control-panel';
            this.controlPanel.style.cssText = `
                position: fixed;
                top: ${this.config.panelPosition.top}px;
                right: ${this.config.panelPosition.right}px;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 15px;
                border-radius: 8px;
                font-size: 12px;
                z-index: 10000;
                font-family: Arial, sans-serif;
                min-width: 280px;
                border: 1px solid #444;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                backdrop-filter: blur(5px);
                cursor: move;
            `;

            this.updateControlPanel();
            document.body.appendChild(this.controlPanel);

            if (!this.config.panelVisible) {
                this.controlPanel.style.display = 'none';
            }

            this.makePanelDraggable();
        }

        updateControlPanel() {
            if (!this.controlPanel) return;

            const status = this.isMonitoring ? '运行中' : '已停止';
            const statusColor = this.isMonitoring ? '#4CAF50' : '#f44336';
            const lastCheck = this.lastCheckTime ?
                this.lastCheckTime.toLocaleTimeString() : '尚未检查';
            const nextCheck = this.lastCheckTime && this.isMonitoring && this.initialDelayCompleted ?
                new Date(this.lastCheckTime.getTime() + this.config.checkInterval).toLocaleTimeString() : '--';

            const checkIntervalMinutes = this.config.checkInterval / (60 * 1000);
            const retryIntervalSeconds = this.config.retryInterval / 1000;

            // 显示初始延迟状态
            let delayStatus = '';
            if (this.isMonitoring && !this.initialDelayCompleted) {
                delayStatus = '<div style="color: #FF9800; font-size: 10px;">初始延迟中(30秒)...</div>';
            }

            // 显示重试时间
            let retryTimeInfo = '';
            if (this.nextRetryTime && this.retryCount > 0) {
                retryTimeInfo = `<div style="color: #FF9800; font-size: 10px;">下次重试: ${this.nextRetryTime.toLocaleTimeString()}</div>`;
            }

            this.controlPanel.innerHTML = `
                <div style="margin-bottom: 10px; font-weight: bold; border-bottom: 1px solid #444; padding-bottom: 8px;">
                    <span style="color: ${statusColor}">🕒 页面监控: ${status}</span>
                    <button id="monitor-toggle" style="float: right; margin-left: 10px; padding: 2px 8px; background: ${this.isMonitoring ? '#f44336' : '#4CAF50'}; color: white; border: none; border-radius: 3px; cursor: pointer;">
                        ${this.isMonitoring ? '停止' : '开始'}
                    </button>
                    <button id="panel-toggle" style="float: right; padding: 2px 8px; background: #666; color: white; border: none; border-radius: 3px; cursor: pointer;">
                        隐藏
                    </button>
                </div>

                <div style="font-size: 11px; color: #ccc; margin-bottom: 10px;">
                    ${delayStatus}
                    <div>上次检查: ${lastCheck} <span style="color: ${this.lastCheckResult === '成功' ? '#4CAF50' : (this.lastCheckResult === '失败' ? '#ff9800' : '#ccc')}">${this.lastCheckResult || ''}</span></div>
                    <div>下次检查: ${nextCheck}</div>
                    <div>重试次数: ${this.retryCount}/${this.config.maxRetries}</div>
                    ${retryTimeInfo}
                </div>

                <div style="border-top: 1px solid #444; padding-top: 10px;">
                    <div style="margin-bottom: 8px;">
                        <label style="display: block; margin-bottom: 4px;">检查间隔 (分钟):</label>
                        <input type="number" id="check-interval" value="${checkIntervalMinutes}" min="1" max="120" style="width: 60px; padding: 2px; background: #333; color: white; border: 1px solid #555; border-radius: 3px;">
                    </div>
                    <div style="margin-bottom: 8px;">
                        <label style="display: block; margin-bottom: 4px;">重试间隔 (秒):</label>
                        <input type="number" id="retry-interval" value="${retryIntervalSeconds}" min="20" max="60" style="width: 60px; padding: 2px; background: #333; color: white; border: 1px solid #555; border-radius: 3px;">
                        <div style="font-size: 10px; color: #888;">最小20秒</div>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <label style="display: block; margin-bottom: 4px;">最大重试次数:</label>
                        <input type="number" id="max-retries" value="${this.config.maxRetries}" min="1" max="10" style="width: 60px; padding: 2px; background: #333; color: white; border: 1px solid #555; border-radius: 3px;">
                    </div>
                    <button id="save-settings" style="padding: 4px 12px; background: #2196F3; color: white; border: none; border-radius: 3px; cursor: pointer; margin-right: 5px;">保存设置</button>
                    <button id="manual-check" style="padding: 4px 12px; background: #FF9800; color: white; border: none; border-radius: 3px; cursor: pointer;">立即检查</button>
                </div>

                <div style="font-size: 10px; color: #888; margin-top: 10px; border-top: 1px solid #444; padding-top: 8px;">
                    F2: 隐藏/显示面板 | 拖动: 移动面板
                </div>
            `;

            // 添加事件监听器
            this.controlPanel.querySelector('#monitor-toggle').addEventListener('click', () => {
                if (this.isMonitoring) {
                    this.stopMonitoring();
                } else {
                    this.startMonitoring();
                }
            });

            this.controlPanel.querySelector('#panel-toggle').addEventListener('click', () => {
                this.togglePanelVisibility();
            });

            this.controlPanel.querySelector('#save-settings').addEventListener('click', () => {
                this.saveSettings();
            });

            this.controlPanel.querySelector('#manual-check').addEventListener('click', () => {
                this.manualCheck();
            });
        }

        saveSettings() {
            const checkIntervalInput = this.controlPanel.querySelector('#check-interval');
            const retryIntervalInput = this.controlPanel.querySelector('#retry-interval');
            const maxRetriesInput = this.controlPanel.querySelector('#max-retries');

            const checkIntervalMinutes = parseInt(checkIntervalInput.value) || 10;
            let retryIntervalSeconds = parseInt(retryIntervalInput.value) || 20;
            const maxRetries = parseInt(maxRetriesInput.value) || 3;

            // 强制重试间隔至少20秒
            if (retryIntervalSeconds < 20) {
                retryIntervalSeconds = 20;
                retryIntervalInput.value = 20;
            }

            this.config.checkInterval = checkIntervalMinutes * 60 * 1000;
            this.config.retryInterval = retryIntervalSeconds * 1000;
            this.config.maxRetries = maxRetries;

            this.saveConfig();

            // 如果正在监控，重新启动以应用新的时间间隔
            if (this.isMonitoring) {
                this.stopMonitoring();
                this.startMonitoring();
            }

            console.log(`设置已保存: 检查间隔=${checkIntervalMinutes}分钟, 重试间隔=${retryIntervalSeconds}秒, 最大重试=${maxRetries}次`);
            this.updateControlPanel();
        }

        togglePanelVisibility() {
            this.config.panelVisible = !this.config.panelVisible;
            this.controlPanel.style.display = this.config.panelVisible ? 'block' : 'none';
            this.saveConfig();

            const panelToggleBtn = this.controlPanel.querySelector('#panel-toggle');
            if (panelToggleBtn) {
                panelToggleBtn.textContent = this.config.panelVisible ? '隐藏' : '显示';
            }
        }

        makePanelDraggable() {
            let isDragging = false;
            let offset = [0, 0];

            this.controlPanel.addEventListener('mousedown', (e) => {
                // 如果点击的是输入框或按钮，不启动拖动
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') {
                    return;
                }

                isDragging = true;
                offset = [
                    e.clientX - this.controlPanel.offsetLeft,
                    e.clientY - this.controlPanel.offsetTop
                ];
                this.controlPanel.style.cursor = 'grabbing';
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;

                const x = e.clientX - offset[0];
                const y = e.clientY - offset[1];

                // 限制面板在视口范围内
                const maxX = window.innerWidth - this.controlPanel.offsetWidth;
                const maxY = window.innerHeight - this.controlPanel.offsetHeight;

                this.controlPanel.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
                this.controlPanel.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
                this.controlPanel.style.right = 'auto';
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    this.controlPanel.style.cursor = 'move';

                    // 保存面板位置
                    this.config.panelPosition = {
                        top: this.controlPanel.offsetTop,
                        right: window.innerWidth - this.controlPanel.offsetLeft - this.controlPanel.offsetWidth
                    };
                    this.saveConfig();
                }
            });
        }

        initKeyboardShortcut() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'F2') {
                    e.preventDefault();
                    this.togglePanelVisibility();
                }
            });
        }

        // 手动检查页面状态（用于调试）
        manualCheck() {
            console.log('手动执行页面状态检查');
            this.checkPageStatus();
        }

        // 手动刷新页面
        manualRefresh() {
            console.log('手动执行页面刷新');
            this.refreshPage();
        }
    }

    // 等待页面加载完成后初始化监控
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.pageMonitor = new PageMonitor();
        });
    } else {
        window.pageMonitor = new PageMonitor();
    }

    // 添加全局函数以便在控制台调试
    window.monitorManualCheck = () => window.pageMonitor?.manualCheck();
    window.monitorManualRefresh = () => window.pageMonitor?.manualRefresh();
    window.monitorStop = () => window.pageMonitor?.stopMonitoring();
    window.monitorStart = () => window.pageMonitor?.startMonitoring();

    console.log(`
页面监控插件已加载！可用命令：
- monitorManualCheck(): 手动检查页面状态
- monitorManualRefresh(): 手动刷新页面
- monitorStop(): 停止监控
- monitorStart(): 开始监控
- F2: 隐藏/显示控制面板
    `);

})();