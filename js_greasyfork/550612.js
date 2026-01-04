// ==UserScript==
// @name         B城赛马自动投注
// @namespace    https://imyes.cn/
// @version      1.3
// @description  B城赛马小游戏自动投注，解放双手，新勋章兑换再也不是梦想！
// @author       陈小锅
// @license      MIT
// @match        *://*/horse_racing*
// @icon         data:image/gif;base64,R0lGODlhQABAAIABAAAAAP///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDIgNzkuYjdjNjRjY2Y5LCAyMDI0LzA3LzE2LTEyOjM5OjA0ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjYuMCAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowRTU1NDgzMDhCOUExMUYwODkzMjlDREYzQUQ3RDZBOCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowRTU1NDgzMThCOUExMUYwODkzMjlDREYzQUQ3RDZBOCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjBFNTU0ODJFOEI5QTExRjA4OTMyOUNERjNBRDdENkE4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjBFNTU0ODJGOEI5QTExRjA4OTMyOUNERjNBRDdENkE4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEAQAAAQAsAAAAAEAAQAAAAv+Mj6nL7Q+jnLTaiy/I3IK/daIDluOZlCZ6qi4rui+cyTNd2TKe6zsf8QVswIdw+CsujgaiMuWE3p66RlR5XSaBWe2W1mVUcWFrufNFrA7nWpq9br7dU2kcWefM5Sp7P7bH9+GV51GoAGIWCLFIMaZxiNFGEkn313PJMolYidbJmWkUSpg40Qj3qPbpNxjks7bJKvFKW2q6ilfLNLuqS2t4p2ji2+qIW6cLHCz2lno7ylwG7bosfKpcTO0MOE25rYfL2o2djXnNOM577m0LHs5eblltPE8e4t7OXa8dj59v/s/TPlGZiBGTl82gL4T3cincBTDhw1+SpkykCKngRYgN9OJs5PgkpMiRJB8UAAA7
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550612/B%E5%9F%8E%E8%B5%9B%E9%A9%AC%E8%87%AA%E5%8A%A8%E6%8A%95%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/550612/B%E5%9F%8E%E8%B5%9B%E9%A9%AC%E8%87%AA%E5%8A%A8%E6%8A%95%E6%B3%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 标记变量：是否正在执行投注操作
    let isBetting = false;
    // 用于倒计时更新的定时器
    let refreshCountdownTimer;
    // 初始为600秒(10分钟)
    let timeUntilRefresh = 600;
    // 'manual'表示自选，'random'表示随机，'odds'表示按赔率，默认为自选
    let selectionMode = 'manual';
    // 赔率选择类型：'high'高赔率, 'low'低赔率，默认为高赔率
    let oddsSelectionType = 'high';

    // 默认选号
    const DEFAULT_NUMBERS = [22, 23, 24];

    // 获取保存的选号设置（从localStorage读取或使用默认值）
    function getSavedNumbers() {
        const storedNumbers = localStorage.getItem('horseRacingNumbers');
        if (storedNumbers) {
            try {
                const parsedNumbers = JSON.parse(storedNumbers);
                // 验证解析后的数字是否有效
                if (Array.isArray(parsedNumbers) && parsedNumbers.length >= 3) {
                    return parsedNumbers;
                }
            } catch (e) {
                console.error('解析选号设置失败:', e);
            }
        }
        return DEFAULT_NUMBERS;
    }

    // 更新刷新倒计时显示的函数
    function updateRefreshCountdown() {
        const countdownElement = document.getElementById('refreshCountdown');
        if (countdownElement) {
            // 将秒转换为分:秒格式
            const minutes = Math.floor(timeUntilRefresh / 60);
            const seconds = timeUntilRefresh % 60;
            countdownElement.textContent = `下次刷新: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        // 倒计时减1
        timeUntilRefresh--;

        // 当倒计时为0时重置为600秒
        if (timeUntilRefresh < 0) {
            timeUntilRefresh = 600;
        }
    }

    // 工具函数：检查元素是否存在并包含特定文本
    function checkElementExists(selector, textContent = null) {
        const element = document.querySelector(selector);
        if (!element) return false;
        if (textContent === null) return true;
        return element.textContent.includes(textContent);
    }

    // 获取奖池阈值（从localStorage读取或使用默认值）
    function getPrizePoolThreshold() {
        const storedThreshold = localStorage.getItem('horseRacingPrizePoolThreshold');
        return storedThreshold ? parseInt(storedThreshold, 10) : 200000;
    }

    // 工具函数：获取元素文本内容
    function getElementText(selector) {
        const element = document.querySelector(selector);
        return element ? element.textContent.trim() : '';
    }

    // 工具函数：点击元素
    function clickElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.click();
            console.log(`点击了元素: ${selector}`);
            return true;
        }
        console.log(`元素未找到: ${selector}`);
        return false;
    }

    // 创建悬浮提示框函数
    function createFloatTip(message) {
        // 检查是否已存在提示框，如果有则移除
        const existingTip = document.getElementById('prizePoolTip');
        if (existingTip) {
            existingTip.remove();
        }

        // 创建新的提示框
        const tip = document.createElement('div');
        tip.id = 'prizePoolTip';
        tip.style.position = 'fixed';
        tip.style.top = '50px';
        tip.style.left = '50%';
        tip.style.transform = 'translateX(-50%)';
        tip.style.padding = '20px';
        // 设置为半透明背景色 (rgba格式，最后一个参数是透明度，0.8表示80%不透明)
        tip.style.backgroundColor = 'rgba(255, 107, 107, 0.8)'
        tip.style.color = 'white';
        tip.style.borderRadius = '8px';
        tip.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        tip.style.zIndex = '9999';
        tip.style.fontSize = '16px';
        tip.style.fontWeight = 'bold';
        tip.textContent = message;

        // 添加到页面
        document.body.appendChild(tip);

        // 3秒后自动移除
        setTimeout(() => {
            if (document.body.contains(tip)) {
                tip.style.opacity = '0';
                tip.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    if (document.body.contains(tip)) {
                        document.body.removeChild(tip);
                    }
                }, 500);
            }
        }, 3000);
    }

    // 全局变量，用于存储状态更新函数
    let updateStatusFunction = null;
    // 全局变量，用于存储日志信息
    let currentLog = '';

    // 创建可拖拽的悬浮设定窗口
    function createSettingsPanel() {
        // 检查是否已存在设置窗口，如果有则移除
        const existingPanel = document.getElementById('settingsPanel');
        if (existingPanel) {
            existingPanel.remove();
        }

        // 创建设置窗口
        const panel = document.createElement('div');
        panel.id = 'settingsPanel';
        panel.style.position = 'fixed';
        panel.style.top = '150px';
        panel.style.right = '50px';
        panel.style.width = '220px';
        panel.style.backgroundColor = '#ffffff';
        panel.style.border = '2px solid #dddddd';
        panel.style.borderRadius = '8px';
        panel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        panel.style.zIndex = '9998';
        panel.style.fontSize = '13px';
        panel.style.color = '#333333';
        panel.style.userSelect = 'none';

        // 添加标题栏（可拖拽区域）
        const titleBar = document.createElement('div');
        titleBar.style.padding = '8px 12px';
        titleBar.style.backgroundColor = '#4CAF50';
        titleBar.style.color = 'white';
        titleBar.style.borderTopLeftRadius = '6px';
        titleBar.style.borderTopRightRadius = '6px';
        titleBar.style.cursor = 'move';
        titleBar.style.fontWeight = 'bold';
        titleBar.style.fontSize = '12px';
        titleBar.style.display = 'flex';
        titleBar.style.alignItems = 'center';

        const titleText = document.createElement('span');
        titleText.textContent = '赛马自动投注';
        titleBar.appendChild(titleText);

        // 添加折叠按钮
        const collapseButton = document.createElement('div');
        collapseButton.id = 'collapseButton';
        collapseButton.style.marginLeft = 'auto';
        collapseButton.style.width = '20px';
        collapseButton.style.height = '20px';
        collapseButton.style.display = 'flex';
        collapseButton.style.alignItems = 'center';
        collapseButton.style.justifyContent = 'center';
        collapseButton.style.cursor = 'pointer';
        collapseButton.style.borderRadius = '4px';
        collapseButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        collapseButton.style.transition = 'all 0.2s ease';

        const collapseIcon = document.createElement('span');
        collapseIcon.textContent = '▼';
        collapseIcon.style.fontSize = '10px';
        collapseIcon.style.fontWeight = 'bold';
        collapseIcon.id = 'collapseIcon';

        collapseButton.appendChild(collapseIcon);
        titleBar.appendChild(collapseButton);
        panel.appendChild(titleBar);

        // 添加运行状态指示器
        const statusIndicator = document.createElement('div');
        statusIndicator.id = 'scriptStatusIndicator';
        statusIndicator.style.padding = '6px 12px';
        statusIndicator.style.backgroundColor = '#f5f5f5';
        statusIndicator.style.display = 'flex';
        statusIndicator.style.alignItems = 'center';
        statusIndicator.style.gap = '6px';

        const statusDot = document.createElement('div');
        statusDot.style.width = '12px';
        statusDot.style.height = '12px';
        statusDot.style.borderRadius = '50%';

        const statusText = document.createElement('span');
        statusText.style.fontSize = '12px';
        statusText.style.color = '#666';

        // 添加刷新倒计时显示
        const refreshCountdown = document.createElement('span');
        refreshCountdown.id = 'refreshCountdown';
        refreshCountdown.style.fontSize = '11px';
        refreshCountdown.style.color = '#888';
        refreshCountdown.style.marginLeft = 'auto'; // 右对齐
        refreshCountdown.textContent = '下次刷新: --:--';

        statusIndicator.appendChild(statusDot);
        statusIndicator.appendChild(statusText);
        statusIndicator.appendChild(refreshCountdown);
        panel.appendChild(statusIndicator);

        // 添加日志显示区域
        const logDisplay = document.createElement('div');
        logDisplay.id = 'scriptLogDisplay';
        logDisplay.style.padding = '6px 12px';
        logDisplay.style.backgroundColor = '#f9f9f9';
        logDisplay.style.borderBottom = '1px solid #eee';

        const logLabel = document.createElement('div');
        logLabel.style.fontSize = '11px';
        logLabel.style.color = '#888';
        logLabel.style.marginBottom = '4px';
        logLabel.textContent = '最新状态：';
        logDisplay.appendChild(logLabel);

        const logText = document.createElement('div');
        logText.id = 'currentLogText';
        logText.style.fontSize = '11px';
        logText.style.color = '#555';
        logText.style.maxHeight = '60px';
        logText.style.overflow = 'hidden';
        logText.textContent = currentLog || '脚本已加载';
        logDisplay.appendChild(logText);
        panel.appendChild(logDisplay);

        // 更新日志显示
        window.updateLogDisplay = function(message) {
            currentLog = message;
            const logElement = document.getElementById('currentLogText');
            if (logElement) {
                logElement.textContent = message;
                // 添加淡入动画效果
                logElement.style.opacity = '0.5';
                setTimeout(() => {
                    if (logElement) logElement.style.opacity = '1';
                }, 100);
            }
        };

        // 更新状态显示
        function updateStatusDisplay() {
            const isEnabled = localStorage.getItem('horseRacingScriptEnabled') === 'true';
            const isActive = window.checkInterval !== null;

            if (isEnabled && isActive) {
                statusDot.style.backgroundColor = '#4CAF50'; // 绿色
                statusText.textContent = '运行中';
            } else {
                statusDot.style.backgroundColor = '#f44336'; // 红色
                statusText.textContent = '已停止';
            }
        }

        // 保存更新状态函数的引用到全局变量
        updateStatusFunction = updateStatusDisplay;

        // 初始更新状态
        updateStatusDisplay();

        // 添加状态更新监听器
        window.addEventListener('storage', function(e) {
            if (e.key === 'horseRacingScriptEnabled') {
                updateStatusDisplay();
            }
        });

        // 创建内容区域（可折叠的部分）
        const content = document.createElement('div');
        content.id = 'settingsContent';
        content.style.padding = '12px';
        panel.appendChild(content);

        // 添加折叠/展开功能
        // 从localStorage读取保存的折叠状态，如果没有则默认为false
        let isCollapsed = localStorage.getItem('horseRacingPanelCollapsed') === 'true';

        // 初始化时应用保存的折叠状态
        if (isCollapsed) {
            collapseIcon.textContent = '▶';
            content.style.display = 'none';
            panel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            collapseButton.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            // 添加底部圆角效果
            logDisplay.style.borderBottomLeftRadius = '6px';
            logDisplay.style.borderBottomRightRadius = '6px';
        } else {
            collapseIcon.textContent = '▼';
            content.style.display = 'block';
            panel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            collapseButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            logDisplay.style.borderBottomLeftRadius = '0';
            logDisplay.style.borderBottomRightRadius = '0';
        }
        collapseButton.onclick = function(e) {
            e.stopPropagation(); // 防止触发拖拽
            isCollapsed = !isCollapsed;

            if (isCollapsed) {
                // 折叠状态
                collapseIcon.textContent = '▶';
                content.style.display = 'none';
                panel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                collapseButton.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                // 添加底部圆角效果
                logDisplay.style.borderBottomLeftRadius = '6px';
                logDisplay.style.borderBottomRightRadius = '6px';
                // 保存折叠状态到localStorage
                localStorage.setItem('horseRacingPanelCollapsed', 'true');
            } else {
                // 展开状态
                collapseIcon.textContent = '▼';
                content.style.display = 'block';
                panel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                collapseButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                // 恢复原始样式
                logDisplay.style.borderBottomLeftRadius = '0';
                logDisplay.style.borderBottomRightRadius = '0';
                // 保存展开状态到localStorage
                localStorage.setItem('horseRacingPanelCollapsed', 'false');
            }
        };

        // 悬停效果
        collapseButton.onmouseenter = function() {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
        };

        collapseButton.onmouseleave = function() {
            this.style.backgroundColor = isCollapsed ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)';
        };

        // 添加奖池阈值设置
        const thresholdLabel = document.createElement('div');
        thresholdLabel.style.marginBottom = '6px';
        thresholdLabel.style.fontSize = '12px';
        thresholdLabel.textContent = '奖池高于多少开始下注：';
        content.appendChild(thresholdLabel);

        const thresholdInput = document.createElement('input');
        thresholdInput.type = 'number';
        thresholdInput.id = 'prizePoolThreshold';
        // 从localStorage读取保存的值，如果没有则使用默认值200000
        thresholdInput.value = getPrizePoolThreshold();
        thresholdInput.style.width = 'calc(100% - 16px)'; // 考虑内边距
        thresholdInput.style.padding = '6px';
        thresholdInput.style.border = '1px solid #ccc';
        thresholdInput.style.borderRadius = '4px';
        thresholdInput.style.marginBottom = '12px';
        thresholdInput.style.fontSize = '12px';
        content.appendChild(thresholdInput);

        // 添加选择模式切换按钮（随机/自选）
        const modeContainer = document.createElement('div');
        modeContainer.style.display = 'flex';
        modeContainer.style.gap = '8px';
        modeContainer.style.marginBottom = '12px';
        content.appendChild(modeContainer);

        // 创建随机按钮
        const randomButton = document.createElement('button');
        randomButton.id = 'randomModeButton';
        randomButton.textContent = '随机';
        randomButton.style.flex = '1';
        randomButton.style.padding = '6px';
        randomButton.style.backgroundColor = '#f0f0f0';
        randomButton.style.color = '#666';
        randomButton.style.border = '1px solid #ccc';
        randomButton.style.borderRadius = '4px';
        randomButton.style.cursor = 'pointer';
        randomButton.style.fontSize = '11px';

        // 创建自选按钮
        const manualButton = document.createElement('button');
        manualButton.id = 'manualModeButton';
        manualButton.textContent = '自选';
        manualButton.style.flex = '1';
        manualButton.style.padding = '6px';
        manualButton.style.backgroundColor = '#4CAF50';
        manualButton.style.color = 'white';
        manualButton.style.border = '1px solid #4CAF50';
        manualButton.style.borderRadius = '4px';
        manualButton.style.cursor = 'pointer';
        manualButton.style.fontSize = '11px';

        // 创建按赔率按钮
        const oddsButton = document.createElement('button');
        oddsButton.id = 'oddsModeButton';
        oddsButton.textContent = '按赔率';
        oddsButton.style.flex = '1';
        oddsButton.style.padding = '6px';
        oddsButton.style.backgroundColor = '#f0f0f0';
        oddsButton.style.color = '#666';
        oddsButton.style.border = '1px solid #ccc';
        oddsButton.style.borderRadius = '4px';
        oddsButton.style.cursor = 'pointer';
        oddsButton.style.fontSize = '11px';

        // 添加点击事件处理
        randomButton.onclick = function() {
            // 更新选择模式
            selectionMode = 'random';
            // 更新按钮样式
            randomButton.style.backgroundColor = '#4CAF50';
            randomButton.style.color = 'white';
            randomButton.style.borderColor = '#4CAF50';
            manualButton.style.backgroundColor = '#f0f0f0';
            manualButton.style.color = '#666';
            manualButton.style.borderColor = '#ccc';
            oddsButton.style.backgroundColor = '#f0f0f0';
            oddsButton.style.color = '#666';
            oddsButton.style.borderColor = '#ccc';
            // 隐藏选号部分
            numbersContainer.style.display = 'none';
            // 隐藏赔率选择部分
            if (oddsSelectionContainer) {
                oddsSelectionContainer.style.display = 'none';
            }
            // 隐藏赔率模式倍率选择容器
            if (oddsMultiplierContainer) {
                oddsMultiplierContainer.style.display = 'none';
            }

            // 如果随机倍率选择容器不存在，创建它
            if (!randomMultiplierContainer) {
                randomMultiplierContainer = document.createElement('div');
                randomMultiplierContainer.style.display = 'flex';
                randomMultiplierContainer.style.flexDirection = 'column';
                randomMultiplierContainer.style.marginBottom = '12px';
                numbersLabel.parentNode.insertBefore(randomMultiplierContainer, numbersContainer);

                // 创建倍率选择标签
                const multiplierLabel = document.createElement('div');
                multiplierLabel.style.marginBottom = '6px';
                multiplierLabel.style.fontSize = '12px';
                multiplierLabel.textContent = '随机模式倍率：';
                randomMultiplierContainer.appendChild(multiplierLabel);

                // 创建倍率选择下拉框
                randomMultiplierSelect = document.createElement('select');
                randomMultiplierSelect.id = 'randomMultiplierSelect';
                randomMultiplierSelect.style.width = '100%';
                randomMultiplierSelect.style.padding = '4px';
                randomMultiplierSelect.style.border = '1px solid #ccc';
                randomMultiplierSelect.style.borderRadius = '4px';
                randomMultiplierSelect.style.fontSize = '10px';
                randomMultiplierSelect.style.marginTop = '2px';
                randomMultiplierSelect.style.boxSizing = 'border-box';

                // 添加倍率选项
                const multiplierOptions = [1, 2, 3, 4, 5, 10, 20, 50];
                multiplierOptions.forEach(multiplier => {
                    const option = document.createElement('option');
                    option.value = multiplier;
                    option.textContent = `${multiplier}倍`;
                    randomMultiplierSelect.appendChild(option);
                });

                // 从localStorage读取保存的随机模式倍率
                const storedRandomMultiplier = localStorage.getItem('horseRacingRandomMultiplier');
                if (storedRandomMultiplier) {
                    randomMultiplierSelect.value = storedRandomMultiplier;
                }

                // 添加change事件以保存选择
                randomMultiplierSelect.onchange = function() {
                    localStorage.setItem('horseRacingRandomMultiplier', this.value);
                };

                randomMultiplierContainer.appendChild(randomMultiplierSelect);

                // 新增：随机模式下的“选号数量”下拉框
                const randomCountLabel = document.createElement('div');
                randomCountLabel.style.margin = '6px 0';
                randomCountLabel.style.fontSize = '12px';
                randomCountLabel.textContent = '选号数量：';
                randomMultiplierContainer.appendChild(randomCountLabel);

                const randomCountSelect = document.createElement('select');
                randomCountSelect.id = 'randomCountSelect';
                randomCountSelect.style.width = '100%';
                randomCountSelect.style.padding = '4px';
                randomCountSelect.style.border = '1px solid #ccc';
                randomCountSelect.style.borderRadius = '4px';
                randomCountSelect.style.fontSize = '10px';
                randomCountSelect.style.marginTop = '2px';
                randomCountSelect.style.boxSizing = 'border-box';

                [1, 2, 3].forEach(count => {
                    const option = document.createElement('option');
                    option.value = count;
                    option.textContent = `${count}`;
                    randomCountSelect.appendChild(option);
                });

                // 从localStorage读取保存的随机模式选号数量
                const storedRandomCount = localStorage.getItem('horseRacingRandomCount');
                if (storedRandomCount) {
                    randomCountSelect.value = storedRandomCount;
                }

                // 添加change事件以保存选择
                randomCountSelect.onchange = function() {
                    localStorage.setItem('horseRacingRandomCount', this.value);
                };

                randomMultiplierContainer.appendChild(randomCountSelect);
            } else {
                // 显示随机倍率选择容器
                randomMultiplierContainer.style.display = 'flex';
            }

            // 保存选择模式到localStorage
            localStorage.setItem('horseRacingSelectionMode', 'random');
        };

        manualButton.onclick = function() {
            // 更新选择模式
            selectionMode = 'manual';
            // 更新按钮样式
            manualButton.style.backgroundColor = '#4CAF50';
            manualButton.style.color = 'white';
            manualButton.style.borderColor = '#4CAF50';
            randomButton.style.backgroundColor = '#f0f0f0';
            randomButton.style.color = '#666';
            randomButton.style.borderColor = '#ccc';
            oddsButton.style.backgroundColor = '#f0f0f0';
            oddsButton.style.color = '#666';
            oddsButton.style.borderColor = '#ccc';
            // 启用选号输入框
            const numberInputs = document.querySelectorAll('#horseNumber1, #horseNumber2, #horseNumber3');
            numberInputs.forEach(input => {
                input.disabled = false;
                input.style.backgroundColor = 'white';
                input.style.color = '#333';
            });
            // 显示选号部分，隐藏赔率选择部分、随机倍率选择部分和赔率模式倍率选择部分
            if (oddsSelectionContainer) {
                oddsSelectionContainer.style.display = 'none';
            }
            if (randomMultiplierContainer) {
                randomMultiplierContainer.style.display = 'none';
            }
            if (oddsMultiplierContainer) {
                oddsMultiplierContainer.style.display = 'none';
            }
            numbersContainer.style.display = 'flex';
            // 保存选择模式到localStorage
            localStorage.setItem('horseRacingSelectionMode', 'manual');
        };

        // 添加按赔率按钮点击事件
        let oddsSelectionContainer;
        let highOddsButton;
        let lowOddsButton;
        let oddsSelectionType = 'high'; // 默认选择高赔率
        let randomMultiplierContainer;
        let randomMultiplierSelect;
        let oddsMultiplierContainer;
        let oddsMultiplierSelect;
        let defaultOddsMultiplier = 1; // 默认赔率模式倍率为1倍

        oddsButton.onclick = function() {
            // 更新选择模式
            selectionMode = 'odds';
            // 更新按钮样式
            oddsButton.style.backgroundColor = '#4CAF50';
            oddsButton.style.color = 'white';
            oddsButton.style.borderColor = '#4CAF50';
            randomButton.style.backgroundColor = '#f0f0f0';
            randomButton.style.color = '#666';
            randomButton.style.borderColor = '#ccc';
            manualButton.style.backgroundColor = '#f0f0f0';
            manualButton.style.color = '#666';
            manualButton.style.borderColor = '#ccc';
            // 禁用选号输入框
            const numberInputs = document.querySelectorAll('#horseNumber1, #horseNumber2, #horseNumber3');
            numberInputs.forEach(input => {
                input.disabled = true;
                input.style.backgroundColor = '#f5f5f5';
                input.style.color = '#999';
            });
            // 隐藏选号部分
            numbersContainer.style.display = 'none';
            // 隐藏随机倍率选择部分
            if (randomMultiplierContainer) {
                randomMultiplierContainer.style.display = 'none';
            }

            // 如果赔率选择容器不存在，创建它
            if (!oddsSelectionContainer) {
                oddsSelectionContainer = document.createElement('div');
                oddsSelectionContainer.style.display = 'flex';
                oddsSelectionContainer.style.gap = '4px';
                oddsSelectionContainer.style.marginBottom = '12px';
                numbersLabel.parentNode.insertBefore(oddsSelectionContainer, numbersContainer);

                // 创建高赔率按钮
                highOddsButton = document.createElement('button');
                highOddsButton.id = 'highOddsButton';
                highOddsButton.textContent = '高赔率';
                highOddsButton.style.flex = '1';
                highOddsButton.style.padding = '6px';
                highOddsButton.style.backgroundColor = '#4CAF50';
                highOddsButton.style.color = 'white';
                highOddsButton.style.border = '1px solid #4CAF50';
                highOddsButton.style.borderRadius = '4px';
                highOddsButton.style.cursor = 'pointer';
                highOddsButton.style.fontSize = '11px';

                // 创建低赔率按钮
                lowOddsButton = document.createElement('button');
                lowOddsButton.id = 'lowOddsButton';
                lowOddsButton.textContent = '低赔率';
                lowOddsButton.style.flex = '1';
                lowOddsButton.style.padding = '6px';
                lowOddsButton.style.backgroundColor = '#f0f0f0';
                lowOddsButton.style.color = '#666';
                lowOddsButton.style.border = '1px solid #ccc';
                lowOddsButton.style.borderRadius = '4px';
                lowOddsButton.style.cursor = 'pointer';
                lowOddsButton.style.fontSize = '11px';

                // 添加高赔率按钮点击事件
                highOddsButton.onclick = function() {
                    oddsSelectionType = 'high';
                    highOddsButton.style.backgroundColor = '#4CAF50';
                    highOddsButton.style.color = 'white';
                    highOddsButton.style.borderColor = '#4CAF50';
                    lowOddsButton.style.backgroundColor = '#f0f0f0';
                    lowOddsButton.style.color = '#666';
                    lowOddsButton.style.borderColor = '#ccc';
                    localStorage.setItem('horseRacingOddsSelectionType', 'high');
                };

                // 添加低赔率按钮点击事件
                lowOddsButton.onclick = function() {
                    oddsSelectionType = 'low';
                    lowOddsButton.style.backgroundColor = '#4CAF50';
                    lowOddsButton.style.color = 'white';
                    lowOddsButton.style.borderColor = '#4CAF50';
                    highOddsButton.style.backgroundColor = '#f0f0f0';
                    highOddsButton.style.color = '#666';
                    highOddsButton.style.borderColor = '#ccc';
                    localStorage.setItem('horseRacingOddsSelectionType', 'low');
                };

                oddsSelectionContainer.appendChild(highOddsButton);
                oddsSelectionContainer.appendChild(lowOddsButton);

                // 从localStorage读取保存的赔率选择类型
                const storedOddsType = localStorage.getItem('horseRacingOddsSelectionType');
                if (storedOddsType === 'low') {
                    lowOddsButton.click();
                } else {
                    highOddsButton.click();
                }
            } else {
                // 显示赔率选择容器
                oddsSelectionContainer.style.display = 'flex';
            }

            // 如果赔率模式倍率选择容器不存在，创建它
            if (!oddsMultiplierContainer) {
                oddsMultiplierContainer = document.createElement('div');
                oddsMultiplierContainer.style.display = 'flex';
                oddsMultiplierContainer.style.flexDirection = 'column';
                oddsMultiplierContainer.style.marginBottom = '12px';
                numbersLabel.parentNode.insertBefore(oddsMultiplierContainer, numbersContainer);

                // 创建赔率模式倍率选择标签
                const oddsMultiplierLabel = document.createElement('div');
                oddsMultiplierLabel.style.marginBottom = '6px';
                oddsMultiplierLabel.style.fontSize = '12px';
                oddsMultiplierLabel.textContent = '赔率模式倍率：';
                oddsMultiplierContainer.appendChild(oddsMultiplierLabel);

                // 创建赔率模式倍率选择下拉框
                oddsMultiplierSelect = document.createElement('select');
                oddsMultiplierSelect.id = 'oddsMultiplierSelect';
                oddsMultiplierSelect.style.width = '100%';
                oddsMultiplierSelect.style.padding = '4px';
                oddsMultiplierSelect.style.border = '1px solid #ccc';
                oddsMultiplierSelect.style.borderRadius = '4px';
                oddsMultiplierSelect.style.fontSize = '10px';
                oddsMultiplierSelect.style.marginTop = '2px';
                oddsMultiplierSelect.style.boxSizing = 'border-box';

                // 添加倍率选项
                const multiplierOptions = [1, 2, 3, 4, 5, 10, 20, 50];
                multiplierOptions.forEach(multiplier => {
                    const option = document.createElement('option');
                    option.value = multiplier;
                    option.textContent = `${multiplier}倍`;
                    oddsMultiplierSelect.appendChild(option);
                });

                // 从localStorage读取保存的赔率模式倍率
                const storedOddsMultiplier = localStorage.getItem('horseRacingOddsMultiplier');
                if (storedOddsMultiplier) {
                    oddsMultiplierSelect.value = storedOddsMultiplier;
                } else {
                    oddsMultiplierSelect.value = defaultOddsMultiplier;
                }

                // 添加change事件以保存选择
                oddsMultiplierSelect.onchange = function() {
                    localStorage.setItem('horseRacingOddsMultiplier', this.value);
                };

                oddsMultiplierContainer.appendChild(oddsMultiplierSelect);

                // 创建“选号数量”标签
                const oddsCountLabel = document.createElement('div');
                oddsCountLabel.style.marginTop = '6px';
                oddsCountLabel.style.marginBottom = '6px';
                oddsCountLabel.style.fontSize = '12px';
                oddsCountLabel.textContent = '选号数量：';
                oddsMultiplierContainer.appendChild(oddsCountLabel);

                // 创建“选号数量”下拉框（1、2、3）
                const oddsCountSelect = document.createElement('select');
                oddsCountSelect.id = 'oddsCountSelect';
                oddsCountSelect.style.width = '100%';
                oddsCountSelect.style.padding = '4px';
                oddsCountSelect.style.border = '1px solid #ccc';
                oddsCountSelect.style.borderRadius = '4px';
                oddsCountSelect.style.fontSize = '10px';
                oddsCountSelect.style.marginTop = '2px';
                oddsCountSelect.style.boxSizing = 'border-box';
                [1, 2, 3].forEach(count => {
                    const option = document.createElement('option');
                    option.value = count;
                    option.textContent = `${count}个`;
                    oddsCountSelect.appendChild(option);
                });
                // 从localStorage读取保存的选号数量，默认3
                const storedOddsCount = localStorage.getItem('horseRacingOddsCount');
                oddsCountSelect.value = storedOddsCount ? storedOddsCount : '3';
                // 保存选择
                oddsCountSelect.onchange = function() {
                    localStorage.setItem('horseRacingOddsCount', this.value);
                };
                oddsMultiplierContainer.appendChild(oddsCountSelect);
            } else {
                // 显示赔率模式倍率选择容器
                oddsMultiplierContainer.style.display = 'flex';
            }

            // 保存选择模式到localStorage
            localStorage.setItem('horseRacingSelectionMode', 'odds');
        };

        modeContainer.appendChild(randomButton);
        modeContainer.appendChild(manualButton);
        modeContainer.appendChild(oddsButton);

        // 添加选号设置
        const numbersLabel = document.createElement('div');
        numbersLabel.style.marginBottom = '6px';
        numbersLabel.style.fontSize = '12px';
        numbersLabel.textContent = '选号：（自选填0则不选跳过）';
        content.appendChild(numbersLabel);

        // 创建选号输入框容器
        const numbersContainer = document.createElement('div');
        numbersContainer.style.display = 'flex';
        numbersContainer.style.gap = '4px';
        numbersContainer.style.marginBottom = '12px';
        content.appendChild(numbersContainer);

        // 创建三个选号输入框
        const numberInputs = [];
        const multiplierSelects = [];
        const savedNumbers = getSavedNumbers();

        // 获取保存的倍数设置（从localStorage读取或使用默认值[1, 1, 1]）
        function getSavedMultipliers() {
            const storedMultipliers = localStorage.getItem('horseRacingMultipliers');
            if (storedMultipliers) {
                try {
                    const parsedMultipliers = JSON.parse(storedMultipliers);
                    // 验证解析后的倍数是否有效
                    if (Array.isArray(parsedMultipliers) && parsedMultipliers.length >= 3) {
                        return parsedMultipliers;
                    }
                } catch (e) {
                    console.error('解析倍数设置失败:', e);
                }
            }
            return [1, 1, 1]; // 默认都是1倍
        }

        const savedMultipliers = getSavedMultipliers();

        for (let i = 0; i < 3; i++) {
            // 创建输入框和倍数选择的容器
            const inputContainer = document.createElement('div');
            inputContainer.style.display = 'flex';
            inputContainer.style.flexDirection = 'column';
            inputContainer.style.width = 'calc(33.33% - 3px)'; // 考虑间距

            const numberInput = document.createElement('input');
            numberInput.type = 'number';
            numberInput.id = `horseNumber${i + 1}`;
            numberInput.min = '0';
            numberInput.max = '36';
            numberInput.value = (typeof savedNumbers[i] !== 'undefined') ? savedNumbers[i] : DEFAULT_NUMBERS[i];
            numberInput.style.width = '100%';
            numberInput.style.padding = '6px';
            numberInput.style.border = '1px solid #ccc';
            numberInput.style.borderRadius = '4px';
            numberInput.style.fontSize = '12px';
            numberInput.style.boxSizing = 'border-box';

            // 添加输入验证，允许填写0并限制到0-36的范围
            numberInput.oninput = function() {
                let value = parseInt(this.value, 10);
                if (isNaN(value) || value < 0) {
                    this.value = 0;
                } else if (value > 36) {
                    this.value = 36;
                }
            };

            // 创建倍数选择下拉菜单
            const multiplierSelect = document.createElement('select');
            multiplierSelect.id = `multiplier${i + 1}`;
            multiplierSelect.style.width = '100%';
            multiplierSelect.style.padding = '4px';
            multiplierSelect.style.border = '1px solid #ccc';
            multiplierSelect.style.borderRadius = '4px';
            multiplierSelect.style.fontSize = '10px';
            multiplierSelect.style.marginTop = '2px';
            multiplierSelect.style.boxSizing = 'border-box';

            // 倍数选项
            const multipliers = [1, 2, 3, 4, 5, 10, 20, 50];
            multipliers.forEach(multiplier => {
                const option = document.createElement('option');
                option.value = multiplier;
                option.textContent = `${multiplier}倍`;
                multiplierSelect.appendChild(option);
            });

            // 使用保存的倍数设置，如果没有则默认为1倍
            multiplierSelect.value = savedMultipliers[i] || 1;

            // 将输入框和倍数选择添加到容器中
            inputContainer.appendChild(numberInput);
            inputContainer.appendChild(multiplierSelect);

            numbersContainer.appendChild(inputContainer);
            numberInputs.push(numberInput);
            multiplierSelects.push(multiplierSelect);
        }

        // 添加保存按钮
        const saveButton = document.createElement('button');
        saveButton.textContent = '保存设置';
        saveButton.style.width = 'calc(100%)'; // 与阈值输入框保持一致的宽度计算
        saveButton.style.padding = '8px';
        saveButton.style.margin = '0';
        saveButton.style.backgroundColor = '#4CAF50';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '4px';
        saveButton.style.cursor = 'pointer';
        saveButton.style.fontWeight = 'bold';
        saveButton.style.fontSize = '12px';
        saveButton.onclick = function() {
            const newThreshold = parseInt(thresholdInput.value, 10);
            if (!isNaN(newThreshold) && newThreshold > 0) {
                // 保存奖池阈值到localStorage
                localStorage.setItem('horseRacingPrizePoolThreshold', newThreshold);

                // 保存选号到localStorage
                const numbers = numberInputs.map(input => parseInt(input.value, 10));
                localStorage.setItem('horseRacingNumbers', JSON.stringify(numbers));

                // 保存倍数设置到localStorage
                const multipliers = multiplierSelects.map(select => parseInt(select.value, 10));
                localStorage.setItem('horseRacingMultipliers', JSON.stringify(multipliers));

                createFloatTip('设置已保存！即将刷新页面...');
                console.log(`奖池阈值已更新为: ${newThreshold}`);
                console.log(`选号已更新为: ${numbers.join(', ')}`);
                console.log(`倍数设置已更新为: ${multipliers.join(', ')}`);
                // 1秒后刷新页面
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                createFloatTip('请输入有效的数字！');
            }
        };
        content.appendChild(saveButton);

        // 添加分隔线
        const divider = document.createElement('div');
        divider.style.height = '1px';
        divider.style.backgroundColor = '#ddd';
        divider.style.margin = '12px 0';
        content.appendChild(divider);

        // 添加按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        content.appendChild(buttonContainer);

        // 添加开始按钮
        const startButton = document.createElement('button');
        startButton.textContent = '开始';
        startButton.style.width = '50%';
        startButton.style.padding = '8px';
        startButton.style.backgroundColor = '#2196F3';
        startButton.style.color = 'white';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '4px';
        startButton.style.cursor = 'pointer';
        startButton.style.fontWeight = 'bold';
        startButton.style.fontSize = '12px';
        startButton.onclick = function() {
            localStorage.setItem('horseRacingScriptEnabled', 'true');
            createFloatTip('脚本已开始运行！');
            console.log('脚本已开始运行');
            // 确保定时器正常工作
            if (!window.checkInterval) {
                window.checkInterval = setInterval(checkAndBet, 5000);
            }
            // 立即更新状态显示
            updateStatusDisplay();
            // 更新日志显示
            if (typeof window.updateLogDisplay === 'function') {
                window.updateLogDisplay('脚本已开始运行');
            }
        };
        buttonContainer.appendChild(startButton);

        // 添加停止按钮
        const stopButton = document.createElement('button');
        stopButton.textContent = '停止';
        stopButton.style.width = '50%';
        stopButton.style.padding = '8px';
        stopButton.style.backgroundColor = '#f44336';
        stopButton.style.color = 'white';
        stopButton.style.border = 'none';
        stopButton.style.borderRadius = '4px';
        stopButton.style.cursor = 'pointer';
        stopButton.style.fontWeight = 'bold';
        stopButton.style.fontSize = '12px';
        stopButton.onclick = function() {
            localStorage.setItem('horseRacingScriptEnabled', 'false');
            createFloatTip('脚本已停止运行！');
            console.log('脚本已停止运行');
            // 清除检查定时器
            if (window.checkInterval) {
                clearInterval(window.checkInterval);
                window.checkInterval = null;
            }
            // 立即更新状态显示
            updateStatusDisplay();
            // 更新日志显示
            if (typeof window.updateLogDisplay === 'function') {
                window.updateLogDisplay('脚本已停止运行');
            }
        };
        buttonContainer.appendChild(stopButton);

        // 添加到页面
        document.body.appendChild(panel);

        // 实现拖拽功能
        let isDragging = false;
        let offsetX, offsetY;

        titleBar.addEventListener('mousedown', function(e) {
            isDragging = true;
            // 计算鼠标相对于面板的位置
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
            // 提升z-index防止被其他元素遮挡
            panel.style.zIndex = '9999';
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            // 防止文本选择
            e.preventDefault();
            // 计算面板新位置
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            // 限制在视口内
            const maxX = window.innerWidth - panel.offsetWidth;
            const maxY = window.innerHeight - panel.offsetHeight;
            const boundedX = Math.max(0, Math.min(x, maxX));
            const boundedY = Math.max(0, Math.min(y, maxY));
            // 设置新位置
            panel.style.left = boundedX + 'px';
            panel.style.top = boundedY + 'px';
            panel.style.right = 'auto';
            panel.style.transform = 'none';
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
            panel.style.zIndex = '9998';

            // 保存面板位置到localStorage
            const position = {
                x: panel.style.left,
                y: panel.style.top
            };
            localStorage.setItem('horseRacingPanelPosition', JSON.stringify(position));
        });

        // 从localStorage读取保存的面板位置并应用
        const storedPosition = localStorage.getItem('horseRacingPanelPosition');
        if (storedPosition) {
            try {
                const position = JSON.parse(storedPosition);
                panel.style.left = position.x;
                panel.style.top = position.y;
                panel.style.right = 'auto';
                panel.style.transform = 'none';
            } catch (e) {
                console.error('恢复面板位置失败:', e);
            }
        }

        // 从localStorage读取保存的选择模式并初始化UI
        const storedMode = localStorage.getItem('horseRacingSelectionMode');
        if (storedMode === 'random') {
            // 模拟点击随机按钮以设置正确的UI状态
            randomButton.click();
        } else if (storedMode === 'odds') {
            // 模拟点击按赔率按钮以设置正确的UI状态
            oddsButton.click();
        } else {
            // 默认或上次是自选模式
            manualButton.click();
        }

        return panel;
    }

    // 主逻辑函数
    function checkAndBet() {
        try {
            // 检查是否正在执行投注操作，如果是则跳过本次检查
            if (isBetting) {
                console.log('正在执行投注操作，跳过本次检查');
                return;
            }

            // 检查奖池金额
            const prizePoolElement = document.querySelector('#prizePool');
            if (!prizePoolElement) {
                console.log('未检测到奖池元素');
                return;
            }

            // 提取奖池数字（移除非数字字符）
            const prizePoolText = prizePoolElement.textContent;
            const prizePoolNumber = parseInt(prizePoolText.replace(/[^\d]/g, ''), 10);
            console.log(`当前奖池金额: ${prizePoolNumber}`);

            // 获取奖池阈值
            const prizePoolThreshold = getPrizePoolThreshold();
            console.log(`当前使用的奖池阈值: ${prizePoolThreshold}`);

            // 更新奖池状态日志
            if (typeof window.updateLogDisplay === 'function') {
                window.updateLogDisplay(`奖池：${prizePoolNumber} (阈值：${prizePoolThreshold})`);
            }

            // 检查奖池是否达到设定值
            if (prizePoolNumber < prizePoolThreshold) {
                console.log('奖池未达到设定值，暂停投注');
                createFloatTip('奖池未达到设定值，暂停投注！');
                if (typeof window.updateLogDisplay === 'function') {
                    window.updateLogDisplay(`奖池未达标(${prizePoolNumber} < ${prizePoolThreshold})，暂停投注`);
                }
                return;
            }

            // 检查是否有封盘倒计时
            const hasCountdown = checkElementExists('#countdown', '封盘倒计时');
            if (!hasCountdown) {
                console.log('未检测到封盘倒计时');
                if (typeof window.updateLogDisplay === 'function') {
                    window.updateLogDisplay('未检测到封盘倒计时');
                }
                return;
            }

            // 获取剩余投注数
            const remainingBets = getElementText('#remainingBets');
            console.log(`当前剩余投注数: ${remainingBets}`);
            if (typeof window.updateLogDisplay === 'function') {
                window.updateLogDisplay(`剩余投注数: ${remainingBets}`);
            }

            // 检查剩余投注数是否为0，如果是则不生成随机号码
            if (remainingBets === '0') {
                console.log('剩余投注数为0，停止生成随机号码');
                if (typeof window.updateLogDisplay === 'function') {
                    window.updateLogDisplay('剩余投注数为0，等待下一轮');
                }
                return;
            }

            // 尝试将剩余投注数转换为数字
            const remainingBetsNum = parseInt(remainingBets, 10);

            // 基于当前模式与“选号数量”决定是否提前停止本轮投注
             try {
                 if (selectionMode === 'random') {
                     let rc = parseInt(localStorage.getItem('horseRacingRandomCount') || 'NaN', 10);
                     if (isNaN(rc)) {
                         const randomCountSelectEl = document.getElementById('randomCountSelect');
                         if (randomCountSelectEl) {
                             const val = parseInt(randomCountSelectEl.value, 10);
                             if (!isNaN(val)) rc = val;
                         }
                     }
                     const randomCount = (isNaN(rc) || rc < 1 || rc > 3) ? 3 : rc;
                     if (randomCount === 1 && remainingBetsNum <= 2) {
                         if (typeof window.updateLogDisplay === 'function') {
                             window.updateLogDisplay('随机模式：选号数量为1且剩余投注数<=2，停止本轮投注');
                         }
                         return;
                     }
                     if (randomCount === 2 && remainingBetsNum <= 1) {
                         if (typeof window.updateLogDisplay === 'function') {
                             window.updateLogDisplay('随机模式：选号数量为2且剩余投注数<=1，停止本轮投注');
                         }
                         return;
                     }
                 } else if (selectionMode === 'odds') {
                     let oc = parseInt(localStorage.getItem('horseRacingOddsCount') || 'NaN', 10);
                     if (isNaN(oc)) {
                         const oddsCountSelectEl = document.getElementById('oddsCountSelect');
                         if (oddsCountSelectEl) {
                             const val = parseInt(oddsCountSelectEl.value, 10);
                             if (!isNaN(val)) oc = val;
                         }
                     }
                     const oddsCount = (isNaN(oc) || oc < 1 || oc > 3) ? 3 : oc;
                     if (oddsCount === 1 && remainingBetsNum <= 2) {
                         if (typeof window.updateLogDisplay === 'function') {
                             window.updateLogDisplay('按赔率模式：选号数量为1且剩余投注数<=2，停止本轮投注');
                         }
                         return;
                     }
                     if (oddsCount === 2 && remainingBetsNum <= 1) {
                         if (typeof window.updateLogDisplay === 'function') {
                             window.updateLogDisplay('按赔率模式：选号数量为2且剩余投注数<=1，停止本轮投注');
                         }
                         return;
                     }
                 }
             } catch (e) {
                 console.error('本轮提前停止判断时出错:', e);
             }

            // 根据选择模式决定使用随机号码还是用户选择的号码
            let selectedNumbers;
            let selectedMultipliers = [1, 1, 1]; // 默认倍数都是1倍

            if (selectionMode === 'random') {
                // 从localStorage读取随机选号数量（默认3），Firefox下localStorage可能未更新，增加DOM回退
                let rcVal = parseInt(localStorage.getItem('horseRacingRandomCount') || 'NaN', 10);
                if (isNaN(rcVal)) {
                    const randomCountSelectEl = document.getElementById('randomCountSelect');
                    if (randomCountSelectEl) {
                        const val = parseInt(randomCountSelectEl.value, 10);
                        if (!isNaN(val)) rcVal = val;
                    }
                }
                let randomCount = rcVal;
                if (isNaN(randomCount) || randomCount < 1 || randomCount > 3) randomCount = 3;

                // 生成randomCount个1-36之间的随机数（不允许重复）
                const numbers = new Set();
                while (numbers.size < randomCount) {
                    const randomNum = Math.floor(Math.random() * 36) + 1;
                    numbers.add(randomNum);
                }
                selectedNumbers = Array.from(numbers);
                if (typeof window.updateLogDisplay === 'function') {
                    window.updateLogDisplay(`随机生成号码: ${selectedNumbers.join(', ')}（共${randomCount}个）`);
                }
                // 获取用户选择的随机模式倍率（应用到所选数量）
                if (randomMultiplierSelect) {
                    const selectedMultiplier = parseInt(randomMultiplierSelect.value, 10);
                    if (!isNaN(selectedMultiplier)) {
                        // 为所有随机选号设置相同的倍率
                        selectedMultipliers = new Array(randomCount).fill(selectedMultiplier);
                        if (typeof window.updateLogDisplay === 'function') {
                            window.updateLogDisplay(`随机模式倍率: ${selectedMultiplier}倍`);
                        }
                    }
                }
            } else if (selectionMode === 'odds') {
                // 按赔率选择模式
                // 获取36匹马的赔率
                const horsesWithOdds = [];
                for (let i = 1; i <= 36; i++) {
                    const oddsElement = document.querySelector(`#horsesGrid > div:nth-child(${i}) > div.horse-odds`);
                    if (oddsElement) {
                        const oddsText = oddsElement.textContent.trim();
                        // 提取纯数字部分
                        const cleanOddsText = oddsText.replace(/[^\d.]/g, '');
                        const odds = parseFloat(cleanOddsText);
                        if (!isNaN(odds)) {
                            horsesWithOdds.push({
                                horseNumber: i,
                                odds: odds
                            });
                        }
                    }
                }

                // 对马匹进行乱序处理，确保每次遍历顺序不同
                function shuffleArray(array) {
                    const shuffled = [...array];
                    for (let i = shuffled.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                    }
                    return shuffled;
                }

                // 打乱马匹顺序
                const shuffledHorsesWithOdds = shuffleArray(horsesWithOdds);

                selectedNumbers = [];

                // 直接从localStorage读取赔率选择类型，确保获取到用户实际选择的值
                const storedOddsType = localStorage.getItem('horseRacingOddsSelectionType') || 'high';

                // 读取赔率模式“选号数量”，默认3，限定在1-3之间
                const storedOddsCountStr = localStorage.getItem('horseRacingOddsCount');
                let oddsCount = parseInt(storedOddsCountStr || '3', 10);
                if (isNaN(oddsCount) || oddsCount < 1 || oddsCount > 3) {
                    oddsCount = 3;
                }
                if (typeof window.updateLogDisplay === 'function') {
                    window.updateLogDisplay(`赔率模式选号数量: ${oddsCount}个`);
                }

                if (storedOddsType === 'high') {
                    // 高倍率模式：寻找10.00开始递减的赔率
                    if (typeof window.updateLogDisplay === 'function') {
                        window.updateLogDisplay('高倍率模式：从10.00开始递减寻找赔率');
                    }

                    let currentOdds = 10.00;
                    let foundHorses = [];

                    // 按选择数量寻找符合条件的马
                    while (foundHorses.length < oddsCount && currentOdds >= 0) {
                        // 查找当前赔率的马，使用乱序数组并排除已选马匹，匹配精度为0.1
                        const matchedHorses = shuffledHorsesWithOdds.filter(horse =>
                            Math.abs(horse.odds - currentOdds) < 0.1 && !foundHorses.includes(horse.horseNumber)
                        );

                        if (matchedHorses.length > 0) {
                            // 将匹配的马添加到已找到的列表
                            foundHorses.push(matchedHorses[0].horseNumber);

                            if (typeof window.updateLogDisplay === 'function') {
                                window.updateLogDisplay(`找到赔率为${currentOdds}的马${matchedHorses[0].horseNumber}`);
                            }
                        } else {
                            // 没有找到当前赔率的马，递减0.1
                            currentOdds = Math.max(0, currentOdds - 0.1);
                            currentOdds = parseFloat(currentOdds.toFixed(2)); // 保持两位小数
                        }
                    }

                    selectedNumbers = foundHorses;
                } else {
                    // 低倍率模式：寻找0.10开始递增的赔率
                    if (typeof window.updateLogDisplay === 'function') {
                        window.updateLogDisplay('低倍率模式：从0.10开始递增寻找赔率');
                        window.updateLogDisplay(`当前赔率选择类型: ${storedOddsType}`); // 添加调试日志
                    }

                    let currentOdds = 0.10;
                    let foundHorses = [];
                    const maxOdds = Math.max(...horsesWithOdds.map(horse => horse.odds)) + 1; // 设置最大赔率上限

                    // 按选择数量寻找符合条件的马
                    while (foundHorses.length < oddsCount && currentOdds <= maxOdds) {
                        // 添加寻找当前赔率的日志
                        if (typeof window.updateLogDisplay === 'function') {
                            window.updateLogDisplay(`正在寻找赔率为${currentOdds}的马匹...`);
                        }

                        // 查找当前赔率的马，使用乱序数组并排除已选马匹，匹配精度为0.1
                        const matchedHorses = shuffledHorsesWithOdds.filter(horse =>
                            Math.abs(horse.odds - currentOdds) < 0.1 && !foundHorses.includes(horse.horseNumber)
                        );

                        if (matchedHorses.length > 0) {
                            // 将匹配的马添加到已找到的列表
                            foundHorses.push(matchedHorses[0].horseNumber);

                            if (typeof window.updateLogDisplay === 'function') {
                                window.updateLogDisplay(`找到赔率为${currentOdds}的马${matchedHorses[0].horseNumber}`);
                            }
                        } else {
                            // 没有找到当前赔率的马，递增0.1
                            if (typeof window.updateLogDisplay === 'function') {
                                window.updateLogDisplay(`未找到赔率为${currentOdds}的马，尝试下一个赔率: ${parseFloat((currentOdds + 0.1).toFixed(2))}`);
                            }
                            currentOdds = parseFloat((currentOdds + 0.1).toFixed(2)); // 保持两位小数
                        }
                    }

                    selectedNumbers = foundHorses;

                    // 添加低倍率模式结果日志
                    if (typeof window.updateLogDisplay === 'function') {
                        window.updateLogDisplay(`低倍率模式选择结果: 找到${selectedNumbers.length}匹马`);
                    }
                }

                // 如果没有找到足够的马，使用默认选择
                if (selectedNumbers.length < oddsCount) {
                    if (typeof window.updateLogDisplay === 'function') {
                        window.updateLogDisplay(`未找到足够符合条件的马，正在按${storedOddsType === 'high' ? '高' : '低'}赔率排序选择剩余马匹`);
                    }

                    // 创建临时数组用于排序
                    const sortedHorses = [...shuffledHorsesWithOdds];

                    // 按赔率排序
                    if (storedOddsType === 'high') {
                        sortedHorses.sort((a, b) => b.odds - a.odds);
                    } else {
                        // 低倍率模式：按赔率升序排列，确保选择最小赔率的马匹
                        sortedHorses.sort((a, b) => a.odds - b.odds);
                    }

                    // 添加剩余需要的马，确保不重复选择
                    let addedCount = 0;
                    for (const horse of sortedHorses) {
                        if (!selectedNumbers.includes(horse.horseNumber)) {
                            selectedNumbers.push(horse.horseNumber);
                            addedCount++;
                            if (addedCount + selectedNumbers.length >= oddsCount) break;
                        }
                    }

                    // 截取前N匹马，其中N为“选号数量”
                    selectedNumbers = selectedNumbers.slice(0, oddsCount);
                }

                // 记录选择的马匹和赔率
                if (typeof window.updateLogDisplay === 'function') {
                    const logMessage = selectedNumbers.map((num, index) => {
                        const horseInfo = horsesWithOdds.find(horse => horse.horseNumber === num);
                        const odds = horseInfo ? horseInfo.odds : '未知';
                        return `第${index + 1}名: 马${num} (赔率: ${odds})`;
                    }).join(', ');
                    window.updateLogDisplay(`按赔率选择的马匹: ${logMessage}`);
                }

                // 获取用户选择的赔率模式倍率
                if (oddsMultiplierSelect) {
                    const selectedMultiplier = parseInt(oddsMultiplierSelect.value, 10);
                    if (!isNaN(selectedMultiplier)) {
                        // 为所有赔率模式选号设置相同的倍率（数量由“选号数量”决定）
                        selectedMultipliers = new Array(Math.max(1, selectedNumbers.length)).fill(selectedMultiplier);
                        if (typeof window.updateLogDisplay === 'function') {
                            window.updateLogDisplay(`赔率模式倍率: ${selectedMultiplier}倍`);
                        }
                    }
                }
            } else {
                // 自选模式
                // 获取保存的选号设置
                selectedNumbers = getSavedNumbers();
                // 获取用户选择的倍数
                for (let i = 0; i < 3; i++) {
                    const multiplierSelect = document.getElementById(`multiplier${i + 1}`);
                    if (multiplierSelect) {
                        selectedMultipliers[i] = parseInt(multiplierSelect.value, 10);
                    }
                }
                // 过滤掉填入为0的号码，同时同步过滤对应的倍率
                const filteredNumbers = [];
                const filteredMultipliers = [];
                for (let i = 0; i < 3; i++) {
                    const num = selectedNumbers[i];
                    if (typeof num === 'number' && num > 0) {
                        filteredNumbers.push(num);
                        filteredMultipliers.push(selectedMultipliers[i] || 1);
                    }
                }
                selectedNumbers = filteredNumbers;
                selectedMultipliers = filteredMultipliers;
            }

            console.log(`当前使用的选号: ${selectedNumbers.join(', ')}`);

            // 根据剩余投注数执行相应操作
            if ((remainingBets === '3' || remainingBetsNum === 3) && selectedNumbers.length >= 1) {
                // 设置投注标志为true
                isBetting = true;
                console.log('开始投注流程：剩余投注数3');
                if (typeof window.updateLogDisplay === 'function') {
                    window.updateLogDisplay(`开始投注第1/3场：马号${selectedNumbers[0]}`);
                }

                // 延迟1秒后点击第一个选号对应的赛马
                setTimeout(() => {
                    clickElement(`#horsesGrid > div:nth-child(${selectedNumbers[0]})`);
                    // 再延迟1秒点击选择的倍数按钮
                    setTimeout(() => {
                        const multiplierIndex = selectedMultipliers[0] === 1 ? 1 :
                                              selectedMultipliers[0] === 2 ? 2 :
                                              selectedMultipliers[0] === 3 ? 3 :
                                              selectedMultipliers[0] === 4 ? 4 :
                                              selectedMultipliers[0] === 5 ? 5 :
                                              selectedMultipliers[0] === 10 ? 6 :
                                              selectedMultipliers[0] === 20 ? 7 :
                                              selectedMultipliers[0] === 50 ? 8 : 1;
                        clickElement(`#currentRace > div.bet-controls > div > div > button:nth-child(${multiplierIndex})`);
                        console.log(`选择了${selectedMultipliers[0]}倍`);
                        // 再延迟1秒点击确认投注
                        setTimeout(() => {
                            clickElement('#confirmBet');
                            // 投注确认后延迟5秒
                            setTimeout(() => {
                                console.log('投注确认后等待5秒');
                                if (typeof window.updateLogDisplay === 'function') {
                                    window.updateLogDisplay('投注确认成功，等待下一轮');
                                }
                                // 再次检测剩余投注数并根据“选号数量”判断是否停止
                                try {
                                    const remainingAfterText = getElementText('#remainingBets');
                                    const remainingAfter = parseInt(remainingAfterText, 10);
                                    if (!isNaN(remainingAfter)) {
                                        if (selectionMode === 'random') {
                                            let rc = parseInt(localStorage.getItem('horseRacingRandomCount') || 'NaN', 10);
                                            if (isNaN(rc)) {
                                                const randomCountSelectEl = document.getElementById('randomCountSelect');
                                                if (randomCountSelectEl) {
                                                    const val = parseInt(randomCountSelectEl.value, 10);
                                                    if (!isNaN(val)) rc = val;
                                                }
                                            }
                                            const randomCount = (isNaN(rc) || rc < 1 || rc > 3) ? 3 : rc;
                                            if (randomCount === 1 && remainingAfter <= 2 && typeof window.updateLogDisplay === 'function') {
                                                window.updateLogDisplay('随机模式：选号数量=1，剩余投注数<=2，停止后续投注');
                                            } else if (randomCount === 2 && remainingAfter <= 1 && typeof window.updateLogDisplay === 'function') {
                                                window.updateLogDisplay('随机模式：选号数量=2，剩余投注数<=1，停止后续投注');
                                            }
                                        } else if (selectionMode === 'odds') {
                                            let oc = parseInt(localStorage.getItem('horseRacingOddsCount') || 'NaN', 10);
                                            if (isNaN(oc)) {
                                                const oddsCountSelectEl = document.getElementById('oddsCountSelect');
                                                if (oddsCountSelectEl) {
                                                    const val = parseInt(oddsCountSelectEl.value, 10);
                                                    if (!isNaN(val)) oc = val;
                                                }
                                            }
                                            const oddsCount = (isNaN(oc) || oc < 1 || oc > 3) ? 3 : oc;
                                            if (oddsCount === 1 && remainingAfter <= 2 && typeof window.updateLogDisplay === 'function') {
                                                window.updateLogDisplay('按赔率模式：选号数量=1，剩余投注数<=2，停止后续投注');
                                            } else if (oddsCount === 2 && remainingAfter <= 1 && typeof window.updateLogDisplay === 'function') {
                                                window.updateLogDisplay('按赔率模式：选号数量=2，剩余投注数<=1，停止后续投注');
                                            }
                                        }
                                    }
                                } catch (e) {
                                    console.error('下注后检测剩余投注数时出错:', e);
                                }
                                // 重置投注标志，允许下一次投注
                                isBetting = false;
                            }, 5000);
                        }, 1000);
                    }, 1000);
                }, 1000);
            } else if ((remainingBets === '2' || remainingBetsNum === 2) && selectedNumbers.length >= 2) {
                // 设置投注标志为true
                isBetting = true;
                console.log('开始投注流程：剩余投注数2');
                if (typeof window.updateLogDisplay === 'function') {
                    window.updateLogDisplay(`开始投注第2/3场：马号${selectedNumbers[1]}`);
                }

                // 延迟1秒后点击第二个选号对应的赛马
                setTimeout(() => {
                    clickElement(`#horsesGrid > div:nth-child(${selectedNumbers[1]})`);
                    // 再延迟1秒点击选择的倍数按钮
                    setTimeout(() => {
                        const multiplierIndex = selectedMultipliers[1] === 1 ? 1 :
                                              selectedMultipliers[1] === 2 ? 2 :
                                              selectedMultipliers[1] === 3 ? 3 :
                                              selectedMultipliers[1] === 4 ? 4 :
                                              selectedMultipliers[1] === 5 ? 5 :
                                              selectedMultipliers[1] === 10 ? 6 :
                                              selectedMultipliers[1] === 20 ? 7 :
                                              selectedMultipliers[1] === 50 ? 8 : 1;
                        clickElement(`#currentRace > div.bet-controls > div > div > button:nth-child(${multiplierIndex})`);
                        console.log(`选择了${selectedMultipliers[1]}倍`);
                        // 再延迟1秒点击确认投注
                        setTimeout(() => {
                            clickElement('#confirmBet');
                            // 投注确认后延迟5秒
                            setTimeout(() => {
                                console.log('投注确认后等待5秒');
                                // 再次检测剩余投注数并根据“选号数量”判断是否停止
                                try {
                                    const remainingAfterText = getElementText('#remainingBets');
                                    const remainingAfter = parseInt(remainingAfterText, 10);
                                    if (!isNaN(remainingAfter)) {
                                        if (selectionMode === 'random') {
                                            let rc = parseInt(localStorage.getItem('horseRacingRandomCount') || 'NaN', 10);
                                            if (isNaN(rc)) {
                                                const randomCountSelectEl = document.getElementById('randomCountSelect');
                                                if (randomCountSelectEl) {
                                                    const val = parseInt(randomCountSelectEl.value, 10);
                                                    if (!isNaN(val)) rc = val;
                                                }
                                            }
                                            const randomCount = (isNaN(rc) || rc < 1 || rc > 3) ? 3 : rc;
                                            if (randomCount === 1 && remainingAfter <= 2 && typeof window.updateLogDisplay === 'function') {
                                                window.updateLogDisplay('随机模式：选号数量=1，剩余投注数<=2，停止后续投注');
                                            } else if (randomCount === 2 && remainingAfter <= 1 && typeof window.updateLogDisplay === 'function') {
                                                window.updateLogDisplay('随机模式：选号数量=2，剩余投注数<=1，停止后续投注');
                                            }
                                        } else if (selectionMode === 'odds') {
                                            const oc = parseInt(localStorage.getItem('horseRacingOddsCount') || '3', 10);
                                            const oddsCount = (isNaN(oc) || oc < 1 || oc > 3) ? 3 : oc;
                                            if (oddsCount === 1 && remainingAfter <= 2 && typeof window.updateLogDisplay === 'function') {
                                                window.updateLogDisplay('按赔率模式：选号数量=1，剩余投注数<=2，停止后续投注');
                                            } else if (oddsCount === 2 && remainingAfter <= 1 && typeof window.updateLogDisplay === 'function') {
                                                window.updateLogDisplay('按赔率模式：选号数量=2，剩余投注数<=1，停止后续投注');
                                            }
                                        }
                                    }
                                } catch (e) {
                                    console.error('下注后检测剩余投注数时出错:', e);
                                }
                                // 重置投注标志，允许下一次投注
                                isBetting = false;
                            }, 5000);
                        }, 1000);
                    }, 1000);
                }, 1000);
            } else if ((remainingBets === '1' || remainingBetsNum === 1) && selectedNumbers.length >= 3) {
                // 设置投注标志为true
                isBetting = true;
                console.log('开始投注流程：剩余投注数1');
                if (typeof window.updateLogDisplay === 'function') {
                    window.updateLogDisplay(`开始投注第3/3场：马号${selectedNumbers[2]}`);
                }

                // 延迟1秒后点击第三个选号对应的赛马
                setTimeout(() => {
                    clickElement(`#horsesGrid > div:nth-child(${selectedNumbers[2]})`);
                    // 再延迟1秒点击选择的倍数按钮
                    setTimeout(() => {
                        const multiplierIndex = selectedMultipliers[2] === 1 ? 1 :
                                              selectedMultipliers[2] === 2 ? 2 :
                                              selectedMultipliers[2] === 3 ? 3 :
                                              selectedMultipliers[2] === 4 ? 4 :
                                              selectedMultipliers[2] === 5 ? 5 :
                                              selectedMultipliers[2] === 10 ? 6 :
                                              selectedMultipliers[2] === 20 ? 7 :
                                              selectedMultipliers[2] === 50 ? 8 : 1;
                        clickElement(`#currentRace > div.bet-controls > div > div > button:nth-child(${multiplierIndex})`);
                        console.log(`选择了${selectedMultipliers[2]}倍`);
                        // 再延迟1秒点击确认投注
                        setTimeout(() => {
                            clickElement('#confirmBet');
                            // 投注确认后延迟5秒
                            setTimeout(() => {
                                console.log('投注确认后等待5秒');
                                // 再次检测剩余投注数并根据“选号数量”判断是否停止
                                try {
                                    const remainingAfterText = getElementText('#remainingBets');
                                    const remainingAfter = parseInt(remainingAfterText, 10);
                                    if (!isNaN(remainingAfter)) {
                                        if (selectionMode === 'random') {
                                            const rc = parseInt(localStorage.getItem('horseRacingRandomCount') || '3', 10);
                                            const randomCount = (isNaN(rc) || rc < 1 || rc > 3) ? 3 : rc;
                                            if (randomCount === 1 && remainingAfter <= 2 && typeof window.updateLogDisplay === 'function') {
                                                window.updateLogDisplay('随机模式：选号数量=1，剩余投注数<=2，停止后续投注');
                                            } else if (randomCount === 2 && remainingAfter <= 1 && typeof window.updateLogDisplay === 'function') {
                                                window.updateLogDisplay('随机模式：选号数量=2，剩余投注数<=1，停止后续投注');
                                            }
                                        } else if (selectionMode === 'odds') {
                                            const oc = parseInt(localStorage.getItem('horseRacingOddsCount') || '3', 10);
                                            const oddsCount = (isNaN(oc) || oc < 1 || oc > 3) ? 3 : oc;
                                            if (oddsCount === 1 && remainingAfter <= 2 && typeof window.updateLogDisplay === 'function') {
                                                window.updateLogDisplay('按赔率模式：选号数量=1，剩余投注数<=2，停止后续投注');
                                            } else if (oddsCount === 2 && remainingAfter <= 1 && typeof window.updateLogDisplay === 'function') {
                                                window.updateLogDisplay('按赔率模式：选号数量=2，剩余投注数<=1，停止后续投注');
                                            }
                                        }
                                    }
                                } catch (e) {
                                    console.error('下注后检测剩余投注数时出错:', e);
                                }
                                // 重置投注标志，允许下一次投注
                                isBetting = false;
                            }, 5000);
                        }, 1000);
                    }, 1000);
                }, 1000);
            }
        } catch (error) {
            console.error('脚本执行出错:', error);
        }
    }

    // 设置页面自动刷新定时器（10分钟 = 600000毫秒）
    const refreshInterval = setInterval(() => {
        console.log('定时刷新页面');
        location.reload();
    }, 600000);

    // 检查localStorage中的脚本状态，默认停止
    const isScriptEnabled = localStorage.getItem('horseRacingScriptEnabled') === 'true';

    if (isScriptEnabled) {
        // 如果脚本应该启用，则设置检查定时器
        window.checkInterval = setInterval(checkAndBet, 5000); // 每5秒检查一次
        console.log('赛马自动投注脚本已启动，页面将每10分钟自动刷新一次');
        // 当updateStatusFunction可用时更新状态显示
        setTimeout(() => {
            if (typeof updateStatusFunction === 'function') {
                updateStatusFunction();
            }
        }, 100);
    } else {
        // 默认停止状态
        window.checkInterval = null;
        console.log('赛马自动投注脚本已加载（默认停止状态），页面将每10分钟自动刷新一次');
        // 当updateStatusFunction可用时更新状态显示
        setTimeout(() => {
            if (typeof updateStatusFunction === 'function') {
                updateStatusFunction();
            }
        }, 100);
    }

    // 页面卸载时清除所有定时器
    window.addEventListener('beforeunload', function() {
        if (window.checkInterval) {
            clearInterval(window.checkInterval);
            window.checkInterval = null;
        }
        if (refreshInterval) {
            clearInterval(refreshInterval);
        }
        if (refreshCountdownTimer) {
            clearInterval(refreshCountdownTimer);
            refreshCountdownTimer = null;
        }
    });

    // 创建悬浮设定窗口
    createSettingsPanel();

    // 启动倒计时更新定时器
    refreshCountdownTimer = setInterval(updateRefreshCountdown, 1000);
})();