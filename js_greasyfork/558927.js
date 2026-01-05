// ==UserScript==
// @name         智能自动点击器
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  可设置坐标、延迟、次数的自动点击器，带光标跟随效果
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558927/%E6%99%BA%E8%83%BD%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/558927/%E6%99%BA%E8%83%BD%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置对象
    const config = {
        enabled: false,
        delay: 1000, // 点击延迟（毫秒）
        clickCount: 0, // 点击次数，0表示无限
        currentClicks: 0, // 当前已点击次数
        targetX: 0,
        targetY: 0,
        hasTarget: false
    };

    // 创建光标元素
    const cursor = document.createElement('div');
    cursor.id = 'auto-clicker-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 3px solid #ff0000;
        border-radius: 50%;
        pointer-events: none;
        z-index: 999999;
        display: none;
        background: rgba(255, 0, 0, 0.2);
        box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
        transform: translate(-50%, -50%);
    `;

    // 创建主按钮
    const mainButton = document.createElement('button');
    mainButton.id = 'auto-clicker-button';
    mainButton.innerText = '⚙️ 自动点击器';
    mainButton.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 999998;
        padding: 10px 15px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
    `;
    mainButton.onmouseover = () => {
        mainButton.style.transform = 'translateY(-2px)';
        mainButton.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
    };
    mainButton.onmouseout = () => {
        mainButton.style.transform = 'translateY(0)';
        mainButton.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
    };

    // 创建控制面板
    const panel = document.createElement('div');
    panel.id = 'auto-clicker-panel';
    panel.style.cssText = `
        position: fixed;
        top: 50px;
        right: 10px;
        z-index: 999997;
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
        display: none;
        min-width: 300px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;

    panel.innerHTML = `
        <div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #667eea;">
            <h3 style="margin: 0; color: #333; font-size: 18px;">⚙️ 自动点击器设置</h3>
        </div>

        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #555; font-weight: bold;">
                点击延迟 (毫秒):
            </label>
            <input type="number" id="click-delay" value="1000" min="100" step="100"
                style="width: 100%; padding: 8px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px;">
        </div>

        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #555; font-weight: bold;">
                点击次数 (0=无限):
            </label>
            <input type="number" id="click-count" value="0" min="0" step="1"
                style="width: 100%; padding: 8px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px;">
        </div>

        <div style="margin-bottom: 15px; padding: 12px; background: #f8f9fa; border-radius: 6px;">
            <div style="color: #666; font-size: 13px; margin-bottom: 5px;">
                <strong>目标坐标:</strong>
                <span id="coord-display" style="color: #667eea;">未设置</span>
            </div>
            <div style="color: #666; font-size: 13px;">
                <strong>已点击:</strong>
                <span id="click-counter" style="color: #764ba2;">0</span>
            </div>
        </div>

        <div style="margin-bottom: 15px;">
            <button id="set-position-btn" style="
                width: 100%;
                padding: 10px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition: all 0.3s ease;
            ">📍 设置点击位置</button>
        </div>

        <div style="display: flex; gap: 10px;">
            <button id="start-btn" style="
                flex: 1;
                padding: 12px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition: all 0.3s ease;
            ">▶️ 开始</button>

            <button id="stop-btn" style="
                flex: 1;
                padding: 12px;
                background: #f44336;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition: all 0.3s ease;
            ">⏹️ 停止</button>
        </div>

        <div style="margin-top: 10px; font-size: 12px; color: #999; text-align: center;">
            提示: 点击"设置位置"后，移动鼠标到目标位置并点击
        </div>
    `;

    // 添加元素到页面
    document.body.appendChild(cursor);
    document.body.appendChild(mainButton);
    document.body.appendChild(panel);

    // 获取元素引用
    const delayInput = document.getElementById('click-delay');
    const countInput = document.getElementById('click-count');
    const coordDisplay = document.getElementById('coord-display');
    const clickCounter = document.getElementById('click-counter');
    const setPosBtn = document.getElementById('set-position-btn');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');

    let clickInterval = null;
    let isSettingPosition = false;

    // 切换面板显示
    mainButton.addEventListener('click', () => {
        const isVisible = panel.style.display === 'block';
        panel.style.display = isVisible ? 'none' : 'block';
    });

    // 更新延迟设置
    delayInput.addEventListener('change', () => {
        config.delay = parseInt(delayInput.value) || 1000;
        if (config.delay < 100) {
            config.delay = 100;
            delayInput.value = 100;
        }
    });

    // 更新点击次数设置
    countInput.addEventListener('change', () => {
        config.clickCount = parseInt(countInput.value) || 0;
        if (config.clickCount < 0) {
            config.clickCount = 0;
            countInput.value = 0;
        }
    });

    // 设置点击位置
    setPosBtn.addEventListener('click', () => {
        if (isSettingPosition) return;

        isSettingPosition = true;
        setPosBtn.style.background = '#FF9800';
        setPosBtn.innerText = '📍 请点击目标位置...';
        cursor.style.display = 'block';

        // 临时鼠标移动监听
        const moveHandler = (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        };

        // 点击确定位置
        const clickHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();

            config.targetX = e.clientX;
            config.targetY = e.clientY;
            config.hasTarget = true;

            coordDisplay.textContent = `X: ${config.targetX}, Y: ${config.targetY}`;
            coordDisplay.style.color = '#4CAF50';

            // 清理监听器
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('click', clickHandler, true);

            cursor.style.display = 'none';
            isSettingPosition = false;
            setPosBtn.style.background = '#4CAF50';
            setPosBtn.innerText = '📍 设置点击位置';

            alert(`位置已设置: X=${config.targetX}, Y=${config.targetY}`);
        };

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('click', clickHandler, true);
    });

    // 执行点击
    function performClick() {
        if (!config.hasTarget) {
            stopClicking();
            alert('请先设置点击位置！');
            return;
        }

        // 检查点击次数限制
        if (config.clickCount > 0 && config.currentClicks >= config.clickCount) {
            stopClicking();
            alert(`已完成 ${config.currentClicks} 次点击！`);
            return;
        }

        // 显示光标动画
        cursor.style.display = 'block';
        cursor.style.left = config.targetX + 'px';
        cursor.style.top = config.targetY + 'px';

        // 放大动画
        cursor.style.transition = 'transform 0.1s ease';
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';

        setTimeout(() => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 100);

        // 获取目标元素并模拟真实鼠标点击
        const element = document.elementFromPoint(config.targetX, config.targetY);
        if (element) {
            // 创建完整的鼠标事件配置
            const mouseEventInit = {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: config.targetX,
                clientY: config.targetY,
                screenX: config.targetX + window.screenX,
                screenY: config.targetY + window.screenY,
                button: 0,
                buttons: 1,
                detail: 1,
                composed: true
            };

            // 模拟真实鼠标点击序列：mouseover -> mouseenter -> mousemove -> mousedown -> mouseup -> click
            const mouseoverEvent = new MouseEvent('mouseover', mouseEventInit);
            const mouseenterEvent = new MouseEvent('mouseenter', mouseEventInit);
            const mousemoveEvent = new MouseEvent('mousemove', mouseEventInit);
            const mousedownEvent = new MouseEvent('mousedown', mouseEventInit);
            const mouseupEvent = new MouseEvent('mouseup', mouseEventInit);
            const clickEvent = new MouseEvent('click', mouseEventInit);

            // 按顺序触发所有事件
            element.dispatchEvent(mouseoverEvent);
            element.dispatchEvent(mouseenterEvent);
            element.dispatchEvent(mousemoveEvent);
            element.dispatchEvent(mousedownEvent);

            // mouseup 和 click 稍微延迟，模拟真实点击
            setTimeout(() => {
                element.dispatchEvent(mouseupEvent);
                element.dispatchEvent(clickEvent);

                // 如果是链接或按钮，尝试触发原生点击
                if (element.tagName === 'A' || element.tagName === 'BUTTON' || element.onclick) {
                    element.click();
                }
            }, 50);
        }

        config.currentClicks++;
        clickCounter.textContent = config.currentClicks;

        // 隐藏光标
        setTimeout(() => {
            cursor.style.display = 'none';
        }, 200);
    }

    // 开始点击
    function startClicking() {
        if (!config.hasTarget) {
            alert('请先设置点击位置！');
            return;
        }

        if (config.enabled) return;

        config.enabled = true;
        config.currentClicks = 0;
        clickCounter.textContent = '0';

        startBtn.style.background = '#999';
        startBtn.disabled = true;
        stopBtn.style.background = '#f44336';
        stopBtn.disabled = false;

        mainButton.innerText = '🔴 运行中...';
        mainButton.style.background = 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)';

        // 立即执行一次
        performClick();

        // 设置定时器
        clickInterval = setInterval(performClick, config.delay);
    }

    // 停止点击
    function stopClicking() {
        config.enabled = false;

        if (clickInterval) {
            clearInterval(clickInterval);
            clickInterval = null;
        }

        startBtn.style.background = '#667eea';
        startBtn.disabled = false;
        stopBtn.style.background = '#999';
        stopBtn.disabled = true;

        mainButton.innerText = '⚙️ 自动点击器';
        mainButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

        cursor.style.display = 'none';
    }

    // 按钮事件
    startBtn.addEventListener('click', startClicking);
    stopBtn.addEventListener('click', stopClicking);

    // 按钮悬停效果
    [setPosBtn, startBtn, stopBtn].forEach(btn => {
        btn.addEventListener('mouseover', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            }
        });
        btn.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // 初始化停止按钮状态
    stopBtn.style.background = '#999';
    stopBtn.disabled = true;

    // 快捷键支持 (Ctrl+Shift+A 开始/停止)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            if (config.enabled) {
                stopClicking();
            } else {
                startClicking();
            }
        }
    });

    console.log('✅ 自动点击器已加载！快捷键: Ctrl+Shift+A 开始/停止');
})();
