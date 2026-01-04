// ==UserScript==
// @name         自动强化1.5
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  就是自动点手动强化，效率比自带的自动强化高，而且两者可以同时进行。
// @author       latersoar
// @match        https://www.moyu-idle.com/
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/555085/%E8%87%AA%E5%8A%A8%E5%BC%BA%E5%8C%9615.user.js
// @updateURL https://update.greasyfork.org/scripts/555085/%E8%87%AA%E5%8A%A8%E5%BC%BA%E5%8C%9615.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isAutoEnhancing = false;
    let intervalId = null;
    let checkInterval = 2000;
    let isExpanded = false;

    // 创建迷你开关界面
    function createMiniSwitch() {
        const miniContainer = document.createElement('div');
        miniContainer.id = 'enhance-mini-switch';

        // 获取保存的位置，设置默认值
        const savedPosition = GM_getValue('switchPosition', { top: '50px', left: '50px' });

        miniContainer.style.cssText = `
            position: fixed;
            top: ${savedPosition.top};
            left: ${savedPosition.left};
            z-index: 10000;
            background: #4CAF50;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: move;
            font-size: 20px;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            border: 2px solid #fff;
            transition: all 0.3s ease;
            user-select: none;
            touch-action: none;
        `;

        miniContainer.textContent = '⚡';
        miniContainer.title = '强化助手 - 点击展开';

        miniContainer.addEventListener('click', function(e) {
            // 防止拖动时触发点击
            if (Math.abs(e.movementX) < 5 && Math.abs(e.movementY) < 5) {
                if (!isExpanded) {
                    showExpandedPanel();
                } else {
                    hideExpandedPanel();
                }
            }
        });

        // 添加优化的拖动功能
        makeDraggable(miniContainer);

        document.body.appendChild(miniContainer);
        return miniContainer;
    }

    // 优化的拖动功能
    function makeDraggable(element) {
        let isDragging = false;
        let startX, startY, initialX, initialY;

        element.addEventListener('mousedown', startDrag);

        function startDrag(e) {
            if (isExpanded) return;

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

            const rect = element.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;

            element.style.cursor = 'grabbing';
            element.style.transition = 'none'; // 拖动时禁用过渡动画

            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);

            e.preventDefault();
        }

        function drag(e) {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            let newX = initialX + deltaX;
            let newY = initialY + deltaY;

            // 限制在窗口范围内
            const maxX = window.innerWidth - element.offsetWidth;
            const maxY = window.innerHeight - element.offsetHeight;

            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));

            element.style.left = newX + 'px';
            element.style.top = newY + 'px';
            element.style.right = 'auto';
        }

        function stopDrag(e) {
            if (!isDragging) return;

            isDragging = false;
            element.style.cursor = 'pointer';
            element.style.transition = 'all 0.3s ease'; // 恢复过渡动画

            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);

            // 保存位置
            const rect = element.getBoundingClientRect();
            GM_setValue('switchPosition', {
                top: rect.top + 'px',
                left: rect.left + 'px'
            });
        }

        // 支持触摸设备
        element.addEventListener('touchstart', function(e) {
            if (isExpanded) return;

            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;

            const rect = element.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;

            element.style.transition = 'none';

            document.addEventListener('touchmove', touchDrag, { passive: false });
            document.addEventListener('touchend', stopTouchDrag);

            e.preventDefault();
        });

        function touchDrag(e) {
            if (!e.touches.length) return;

            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;

            let newX = initialX + deltaX;
            let newY = initialY + deltaY;

            const maxX = window.innerWidth - element.offsetWidth;
            const maxY = window.innerHeight - element.offsetHeight;

            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));

            element.style.left = newX + 'px';
            element.style.top = newY + 'px';
            element.style.right = 'auto';

            e.preventDefault();
        }

        function stopTouchDrag() {
            element.style.transition = 'all 0.3s ease';

            document.removeEventListener('touchmove', touchDrag);
            document.removeEventListener('touchend', stopTouchDrag);

            // 保存位置
            const rect = element.getBoundingClientRect();
            GM_setValue('switchPosition', {
                top: rect.top + 'px',
                left: rect.left + 'px'
            });
        }
    }

    // 创建展开面板
    function createExpandedPanel() {
        const panel = document.createElement('div');
        panel.id = 'enhance-expanded-panel';
        panel.style.cssText = `
            position: fixed;
            z-index: 10001;
            background: rgba(0, 0, 0, 0.95);
            color: white;
            padding: 15px;
            border-radius: 10px;
            font-family: Arial, sans-serif;
            min-width: 250px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            border: 2px solid #4CAF50;
            display: none;
        `;

        const title = document.createElement('div');
        title.textContent = '强化助手';
        title.style.cssText = 'font-weight: bold; margin-bottom: 10px; font-size: 14px; text-align: center;';

        const statusDiv = document.createElement('div');
        statusDiv.id = 'enhance-status';
        statusDiv.textContent = '状态: 已停止';
        statusDiv.style.cssText = 'margin-bottom: 10px; font-size: 12px; color: #ff6b6b;';

        // 目标按钮信息
        const targetInfo = document.createElement('div');
        targetInfo.style.cssText = 'margin-bottom: 10px; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 5px; font-size: 11px;';
        targetInfo.innerHTML = '<div style="color: #4CAF50; text-align: center;">目标按钮已锁定</div>';

        // 间隔时间设置
        const intervalContainer = document.createElement('div');
        intervalContainer.style.cssText = 'margin-bottom: 10px; font-size: 12px; display: flex; align-items: center; justify-content: space-between;';

        const intervalLabel = document.createElement('span');
        intervalLabel.textContent = '间隔(秒):';

        const intervalInput = document.createElement('input');
        intervalInput.type = 'number';
        intervalInput.id = 'enhance-interval';
        intervalInput.value = checkInterval / 1000;
        intervalInput.min = 1;
        intervalInput.max = 60;
        intervalInput.style.cssText = 'width: 50px; padding: 2px;';

        intervalInput.addEventListener('change', function() {
            const seconds = parseInt(this.value);
            if (seconds >= 1 && seconds <= 60) {
                checkInterval = seconds * 1000;
                if (isAutoEnhancing) {
                    restartAutoEnhance();
                }
            }
        });

        intervalContainer.appendChild(intervalLabel);
        intervalContainer.appendChild(intervalInput);

        // 开关按钮
        const toggleButton = document.createElement('button');
        toggleButton.id = 'enhance-toggle';
        toggleButton.textContent = '开始自动强化';
        toggleButton.style.cssText = `
            width: 100%;
            padding: 8px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.3s;
            margin-bottom: 8px;
        `;

        toggleButton.addEventListener('click', toggleAutoEnhance);

        // 关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '收起';
        closeButton.style.cssText = `
            width: 100%;
            padding: 5px;
            background: #666;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
        `;

        closeButton.addEventListener('click', hideExpandedPanel);

        // 统计信息
        const statsDiv = document.createElement('div');
        statsDiv.id = 'enhance-stats';
        statsDiv.style.cssText = 'margin-top: 8px; font-size: 10px; color: #ccc; text-align: center;';
        statsDiv.textContent = '已点击: 0 次';

        // 组装面板
        panel.appendChild(title);
        panel.appendChild(statusDiv);
        panel.appendChild(targetInfo);
        panel.appendChild(intervalContainer);
        panel.appendChild(toggleButton);
        panel.appendChild(statsDiv);
        panel.appendChild(closeButton);

        document.body.appendChild(panel);
        return panel;
    }

    // 显示展开面板
    function showExpandedPanel() {
        const miniSwitch = document.getElementById('enhance-mini-switch');
        const panel = document.getElementById('enhance-expanded-panel') || createExpandedPanel();

        // 获取迷你开关的位置
        const rect = miniSwitch.getBoundingClientRect();

        // 计算面板位置（尽量显示在迷你开关旁边）
        let panelLeft = rect.left - 280; // 放在左侧
        let panelTop = rect.top;

        // 确保面板不会超出屏幕
        if (panelLeft < 10) {
            panelLeft = rect.right + 10; // 如果左侧空间不够，放在右侧
        }

        if (panelTop + panel.offsetHeight > window.innerHeight - 10) {
            panelTop = window.innerHeight - panel.offsetHeight - 10;
        }

        panel.style.left = panelLeft + 'px';
        panel.style.top = panelTop + 'px';
        panel.style.display = 'block';

        isExpanded = true;
        miniSwitch.style.background = '#2196F3';
        miniSwitch.title = '强化助手 - 点击收起';
    }

    // 隐藏展开面板
    function hideExpandedPanel() {
        const panel = document.getElementById('enhance-expanded-panel');
        const miniSwitch = document.getElementById('enhance-mini-switch');

        if (panel) {
            panel.style.display = 'none';
        }

        isExpanded = false;
        miniSwitch.style.background = isAutoEnhancing ? '#f44336' : '#4CAF50';
        miniSwitch.title = '强化助手 - 点击展开';
    }

    // 精确查找目标强化按钮
    function findTargetEnhanceButtons() {
        const selectors = [
            'button.el-button.el-button--primary.flex-1.w-full',
            '.el-button.el-button--primary.flex-1.w-full'
        ];

        let foundButtons = [];

        selectors.forEach(selector => {
            try {
                const buttons = Array.from(document.querySelectorAll(selector));
                const validButtons = buttons.filter(button => {
                    const hasEnhanceText = button.textContent && button.textContent.includes('强化');
                    const isClickable = isButtonClickable(button);
                    return hasEnhanceText && isClickable;
                });
                foundButtons = foundButtons.concat(validButtons);
            } catch (e) {
                console.log('选择器错误:', e);
            }
        });

        return [...new Set(foundButtons)];
    }

    // 检查按钮是否可点击
    function isButtonClickable(button) {
        if (!button || button.offsetParent === null) return false;
        if (button.disabled) return false;
        if (button.getAttribute('aria-disabled') === 'true') return false;
        if (button.classList.contains('is-disabled')) return false;
        if (button.style.display === 'none') return false;
        if (getComputedStyle(button).visibility === 'hidden') return false;

        const rect = button.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;

        return true;
    }

    // 点击强化按钮
    function clickEnhanceButtons() {
        const buttons = findTargetEnhanceButtons();

        if (buttons.length > 0) {
            buttons.forEach(button => {
                try {
                    button.click();
                    updateStats(true);
                } catch (error) {
                    console.error('点击按钮时出错:', error);
                }
            });
            return buttons.length;
        }

        updateStats(false);
        return 0;
    }

    // 更新统计信息
    let clickCount = 0;
    function updateStats(clicked) {
        if (clicked) {
            clickCount++;
        }

        const statsDiv = document.getElementById('enhance-stats');
        if (statsDiv) {
            const buttons = findTargetEnhanceButtons();
            statsDiv.textContent = `已点击: ${clickCount} 次 | 找到: ${buttons.length} 个`;
        }
    }

    // 开始自动强化
    function startAutoEnhance() {
        if (intervalId) return;

        isAutoEnhancing = true;
        intervalId = setInterval(() => {
            const clickedCount = clickEnhanceButtons();
            const statusDiv = document.getElementById('enhance-status');
            const miniSwitch = document.getElementById('enhance-mini-switch');

            if (statusDiv) {
                if (clickedCount > 0) {
                    statusDiv.textContent = `状态: 运行中 - 点击了 ${clickedCount} 个按钮`;
                    statusDiv.style.color = '#4CAF50';
                } else {
                    statusDiv.textContent = `状态: 运行中 - 等待可用按钮`;
                    statusDiv.style.color = '#ffa726';
                }
            }

            if (miniSwitch && !isExpanded) {
                miniSwitch.style.background = '#f44336';
            }
        }, checkInterval);

        const toggleButton = document.getElementById('enhance-toggle');
        if (toggleButton) {
            toggleButton.textContent = '停止自动强化';
            toggleButton.style.background = '#f44336';
        }
    }

    // 停止自动强化
    function stopAutoEnhance() {
        isAutoEnhancing = false;
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }

        const toggleButton = document.getElementById('enhance-toggle');
        if (toggleButton) {
            toggleButton.textContent = '开始自动强化';
            toggleButton.style.background = '#4CAF50';
        }

        const statusDiv = document.getElementById('enhance-status');
        if (statusDiv) {
            statusDiv.textContent = '状态: 已停止';
            statusDiv.style.color = '#ff6b6b';
        }

        const miniSwitch = document.getElementById('enhance-mini-switch');
        if (miniSwitch && !isExpanded) {
            miniSwitch.style.background = '#4CAF50';
        }
    }

    // 切换自动强化状态
    function toggleAutoEnhance() {
        if (isAutoEnhancing) {
            stopAutoEnhance();
        } else {
            startAutoEnhance();
        }
    }

    // 重新启动自动强化
    function restartAutoEnhance() {
        if (isAutoEnhancing) {
            stopAutoEnhance();
            startAutoEnhance();
        }
    }

    // 初始化
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createMiniSwitch);
        } else {
            createMiniSwitch();
        }

        // 添加快捷键
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'E') {
                e.preventDefault();
                toggleAutoEnhance();
            }
        });

        // 点击页面其他地方收起面板
        document.addEventListener('click', function(e) {
            const panel = document.getElementById('enhance-expanded-panel');
            const miniSwitch = document.getElementById('enhance-mini-switch');

            if (isExpanded && panel && miniSwitch &&
                !panel.contains(e.target) &&
                !miniSwitch.contains(e.target)) {
                hideExpandedPanel();
            }
        });

        console.log('强化助手已加载 - 优化拖动版本');
    }

    init();
})();