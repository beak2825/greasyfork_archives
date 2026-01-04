// ==UserScript==
// @name         自动翻页刷课助手
// @name:en      Auto Page Turner for Online Courses
// @namespace    https://github.com/lang-workspace
// @version      1.0.0
// @description  自动模拟鼠标点击下一页，用于在线课程学习。开启后会在30秒到1分钟内随机点击下一页进行翻页。
// @description:en Auto click next page button for online courses. Random delay between 30-60 seconds.
// @author       lang
// @license      MIT
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        unsafeWindow
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/559879/%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/559879/%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置
    const DEFAULT_CONFIG = {
        minDelay: 30,
        maxDelay: 60,
        nextPageSelector: "a:contains('下一页'), button:contains('下一页'), .next, .pagination-next, [class*='next'], [id*='next']",
        isEnabled: false,
        showStatusPanel: true
    };

    // 插件状态
    let state = {
        isRunning: false,
        timer: null,
        nextClickTime: null,
        minDelay: DEFAULT_CONFIG.minDelay,
        maxDelay: DEFAULT_CONFIG.maxDelay,
        nextPageSelector: DEFAULT_CONFIG.nextPageSelector,
        clickCount: 0,
        lastClickTime: null,
        observer: null,
        statusPanel: null
    };

    // 加载配置
    function loadConfig() {
        state.minDelay = GM_getValue('minDelay', DEFAULT_CONFIG.minDelay);
        state.maxDelay = GM_getValue('maxDelay', DEFAULT_CONFIG.maxDelay);
        state.nextPageSelector = GM_getValue('nextPageSelector', DEFAULT_CONFIG.nextPageSelector);
        state.isEnabled = GM_getValue('isEnabled', DEFAULT_CONFIG.isEnabled);
        state.showStatusPanel = GM_getValue('showStatusPanel', DEFAULT_CONFIG.showStatusPanel);
    }

    // 保存配置
    function saveConfig() {
        GM_setValue('minDelay', state.minDelay);
        GM_setValue('maxDelay', state.maxDelay);
        GM_setValue('nextPageSelector', state.nextPageSelector);
        GM_setValue('isEnabled', state.isEnabled);
        GM_setValue('showStatusPanel', state.showStatusPanel);
    }

    // 查找下一页按钮
    function findNextPageButton() {
        try {
            // 尝试使用提供的选择器
            const selectors = state.nextPageSelector.split(',').map(s => s.trim());

            for (const selector of selectors) {
                try {
                    // 对于:contains选择器，需要使用自定义方法
                    if (selector.includes(':contains(')) {
                        const textMatch = selector.match(/:contains\(['"]([^'"]+)['"]\)/);
                        if (textMatch) {
                            const text = textMatch[1];
                            const elementType = selector.split(':contains')[0].trim();

                            // 查找包含指定文本的元素
                            const elements = document.querySelectorAll(elementType);
                            for (const el of elements) {
                                if (el.textContent.includes(text)) {
                                    console.log('[自动翻页] 找到下一页按钮（文本匹配）:', el);
                                    return el;
                                }
                            }
                        }
                    } else {
                        // 普通CSS选择器
                        const elements = document.querySelectorAll(selector);
                        if (elements.length > 0) {
                            console.log(`[自动翻页] 找到下一页按钮（选择器: ${selector}）:`, elements[0]);
                            return elements[0];
                        }
                    }
                } catch (error) {
                    console.warn(`[自动翻页] 选择器 "${selector}" 无效:`, error);
                }
            }

            // 如果上述选择器都没找到，尝试一些常见的选择器
            const commonSelectors = [
                'a[href*="next"]',
                'button[class*="next"]',
                '.pagination .next',
                '.page-next',
                '[aria-label*="下一页"]',
                '[aria-label*="next"]',
                '[title*="下一页"]',
                '[title*="next"]',
                'input[value*="下一页"]',
                'input[value*="next"]'
            ];

            for (const selector of commonSelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    console.log('[自动翻页] 找到下一页按钮（通用选择器）:', element);
                    return element;
                }
            }

            // 最后尝试查找包含"下一页"文本的任何元素
            const allElements = document.querySelectorAll('a, button, span, div, li');
            for (const element of allElements) {
                if (element.textContent && element.textContent.trim() === '下一页') {
                    console.log('[自动翻页] 找到下一页按钮（文本精确匹配）:', element);
                    return element;
                }
            }

            console.log('[自动翻页] 未找到下一页按钮');
            return null;
        } catch (error) {
            console.error('[自动翻页] 查找下一页按钮时出错:', error);
            return null;
        }
    }

    // 模拟点击下一页按钮
    function clickNextPageButton() {
        const button = findNextPageButton();

        if (!button) {
            console.log('[自动翻页] 未找到下一页按钮，等待重试...');
            updateStatusPanel('no_next_button');
            return false;
        }

        try {
            // 记录点击信息
            state.clickCount++;
            state.lastClickTime = new Date();

            console.log(`[自动翻页] 点击下一页按钮 (#${state.clickCount})`, button);

            // 模拟真实点击事件
            button.focus();

            // 创建并触发鼠标事件
            const mouseDownEvent = new MouseEvent('mousedown', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            button.dispatchEvent(mouseDownEvent);

            const mouseUpEvent = new MouseEvent('mouseup', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            button.dispatchEvent(mouseUpEvent);

            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            button.dispatchEvent(clickEvent);

            // 如果是链接，也可以尝试直接点击
            if (button.tagName === 'A') {
                const href = button.getAttribute('href');
                if (href && !href.startsWith('javascript:')) {
                    // 让浏览器自然处理链接点击
                    button.click();
                }
            } else {
                button.click();
            }

            updateStatusPanel('clicked');
            return true;
        } catch (error) {
            console.error('[自动翻页] 点击下一页按钮时出错:', error);
            updateStatusPanel('error');
            return false;
        }
    }

    // 计算随机延迟时间（秒）
    function getRandomDelay() {
        const min = Math.min(state.minDelay, state.maxDelay);
        const max = Math.max(state.minDelay, state.maxDelay);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 主循环函数
    function startNextPageLoop() {
        if (!state.isRunning) {
            return;
        }

        // 清除之前的定时器
        if (state.timer) {
            clearTimeout(state.timer);
        }

        // 计算下次点击时间
        const delaySeconds = getRandomDelay();
        const nextClickTime = new Date(Date.now() + delaySeconds * 1000);

        state.nextClickTime = nextClickTime;
        console.log(`[自动翻页] 下次点击将在 ${delaySeconds} 秒后 (${nextClickTime.toLocaleTimeString()})`);

        // 更新状态面板
        updateStatusPanel('waiting', delaySeconds);

        // 设置定时器
        state.timer = setTimeout(() => {
            if (!state.isRunning) {
                return;
            }

            console.log('[自动翻页] 执行自动点击...');
            const clicked = clickNextPageButton();

            if (clicked) {
                // 点击成功，继续循环
                console.log('[自动翻页] 点击成功，等待下一次...');

                // 等待页面可能的变化（比如加载新内容）
                setTimeout(() => {
                    if (state.isRunning) {
                        startNextPageLoop();
                    }
                }, 3000); // 等待3秒让页面稳定
            } else {
                // 点击失败，稍后重试
                console.log('[自动翻页] 点击失败，30秒后重试...');
                setTimeout(() => {
                    if (state.isRunning) {
                        startNextPageLoop();
                    }
                }, 30000);
            }
        }, delaySeconds * 1000);
    }

    // 开始自动翻页
    function startAutoPaging() {
        if (state.isRunning) {
            console.log('[自动翻页] 自动翻页已经在运行中');
            return;
        }

        console.log('[自动翻页] 开始自动翻页...');

        // 设置状态
        state.isRunning = true;
        state.clickCount = 0;
        state.isEnabled = true;
        saveConfig();

        // 设置DOM变化观察器
        setupDOMObserver();

        // 创建状态面板
        if (state.showStatusPanel) {
            createStatusPanel();
        }

        // 开始循环
        startNextPageLoop();

        updateStatusPanel('running');
        console.log('[自动翻页] 自动翻页已启动');

        // 显示通知
        GM_notification({
            text: '自动翻页已启动',
            title: '自动翻页刷课助手',
            timeout: 3000
        });
    }

    // 停止自动翻页
    function stopAutoPaging() {
        if (!state.isRunning) {
            console.log('[自动翻页] 自动翻页未运行');
            return;
        }

        console.log('[自动翻页] 停止自动翻页...');

        // 清除定时器
        if (state.timer) {
            clearTimeout(state.timer);
            state.timer = null;
        }

        // 停止DOM观察器
        if (state.observer) {
            state.observer.disconnect();
            state.observer = null;
        }

        // 重置状态
        state.isRunning = false;
        state.nextClickTime = null;
        state.isEnabled = false;
        saveConfig();

        updateStatusPanel('stopped');
        console.log('[自动翻页] 自动翻页已停止');

        // 显示通知
        GM_notification({
            text: '自动翻页已停止',
            title: '自动翻页刷课助手',
            timeout: 3000
        });
    }

    // 设置DOM变化观察器
    function setupDOMObserver() {
        if (state.observer) {
            state.observer.disconnect();
        }

        // 创建观察器监测DOM变化
        state.observer = new MutationObserver((mutations) => {
            if (!state.isRunning) return;

            // 检查是否有新元素添加
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // DOM有变化，重新查找下一页按钮
                    const button = findNextPageButton();
                    if (button) {
                        console.log('[自动翻页] DOM变化检测到新元素，找到下一页按钮');
                    }
                    break;
                }
            }
        });

        // 开始观察整个文档
        state.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 创建状态面板
    function createStatusPanel() {
        // 如果面板已存在，先移除
        if (state.statusPanel) {
            state.statusPanel.remove();
        }

        // 创建面板元素
        const panel = document.createElement('div');
        panel.id = 'auto-page-status-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 999999;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
            font-size: 14px;
            min-width: 200px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255,255,255,0.2);
            transition: all 0.3s ease;
        `;

        // 标题栏
        const title = document.createElement('div');
        title.textContent = '📚 自动翻页助手';
        title.style.cssText = `
            font-weight: bold;
            margin-bottom: 8px;
            border-bottom: 1px solid rgba(255,255,255,0.2);
            padding-bottom: 5px;
            font-size: 15px;
        `;

        // 状态显示
        const statusText = document.createElement('div');
        statusText.id = 'auto-page-status-text';
        statusText.textContent = '等待开始...';

        // 控制按钮容器
        const buttons = document.createElement('div');
        buttons.style.cssText = `
            display: flex;
            gap: 8px;
            margin-top: 10px;
        `;

        // 开关按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '开启';
        toggleBtn.style.cssText = `
            flex: 1;
            padding: 5px 10px;
            border: none;
            border-radius: 4px;
            background: #4CAF50;
            color: white;
            cursor: pointer;
            font-size: 13px;
            transition: background 0.2s;
        `;
        toggleBtn.onmouseover = () => toggleBtn.style.background = '#45a049';
        toggleBtn.onmouseout = () => toggleBtn.style.background = '#4CAF50';
        toggleBtn.onclick = () => {
            if (state.isRunning) {
                stopAutoPaging();
                toggleBtn.textContent = '开启';
                toggleBtn.style.background = '#4CAF50';
            } else {
                startAutoPaging();
                toggleBtn.textContent = '停止';
                toggleBtn.style.background = '#f44336';
            }
        };

        // 设置按钮
        const settingsBtn = document.createElement('button');
        settingsBtn.textContent = '设置';
        settingsBtn.style.cssText = `
            flex: 1;
            padding: 5px 10px;
            border: none;
            border-radius: 4px;
            background: #2196F3;
            color: white;
            cursor: pointer;
            font-size: 13px;
            transition: background 0.2s;
        `;
        settingsBtn.onmouseover = () => settingsBtn.style.background = '#0b7dda';
        settingsBtn.onmouseout = () => settingsBtn.style.background = '#2196F3';
        settingsBtn.onclick = showSettingsDialog;

        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.title = '隐藏面板';
        closeBtn.style.cssText = `
            position: absolute;
            top: 5px;
            right: 8px;
            background: transparent;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            line-height: 18px;
            text-align: center;
        `;
        closeBtn.onclick = () => {
            panel.style.display = 'none';
            state.showStatusPanel = false;
            saveConfig();
        };

        // 组装面板
        buttons.appendChild(toggleBtn);
        buttons.appendChild(settingsBtn);
        panel.appendChild(closeBtn);
        panel.appendChild(title);
        panel.appendChild(statusText);
        panel.appendChild(buttons);

        // 添加到页面
        document.body.appendChild(panel);
        state.statusPanel = panel;

        // 添加拖拽功能
        makePanelDraggable(panel);
    }

    // 使面板可拖拽
    function makePanelDraggable(panel) {
        let isDragging = false;
        let offsetX, offsetY;

        panel.style.cursor = 'move';

        panel.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;

            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;

            panel.style.transition = 'none';
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;

            // 限制在视窗内
            const maxX = window.innerWidth - panel.offsetWidth;
            const maxY = window.innerHeight - panel.offsetHeight;

            panel.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
            panel.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
            panel.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            panel.style.transition = 'all 0.3s ease';
            document.body.style.userSelect = '';
        });
    }

    // 更新状态面板
    function updateStatusPanel(status, nextClickIn = 0) {
        if (!state.statusPanel || !state.showStatusPanel) return;

        const statusText = document.getElementById('auto-page-status-text');
        if (!statusText) return;

        let text = '';
        let color = '#ffffff';

        switch (status) {
            case 'running':
                text = '✅ 自动翻页运行中';
                color = '#4CAF50';
                break;
            case 'waiting':
                text = `⏳ 等待下次点击: ${nextClickIn} 秒`;
                color = '#FF9800';
                break;
            case 'clicked':
                text = '🔄 已点击下一页，等待页面加载...';
                color = '#2196F3';
                break;
            case 'stopped':
                text = '⏸️ 自动翻页已停止';
                color = '#9E9E9E';
                break;
            case 'no_next_button':
                text = '❌ 未找到下一页按钮';
                color = '#f44336';
                break;
            case 'error':
                text = '❌ 发生错误';
                color = '#f44336';
                break;
            default:
                text = '等待开始...';
        }

        statusText.textContent = text;
        statusText.style.color = color;

        // 如果面板被隐藏了，但需要显示重要状态，可以自动显示
        if ((status === 'no_next_button' || status === 'error') && state.statusPanel.style.display === 'none') {
            state.statusPanel.style.display = 'block';
            state.showStatusPanel = true;
            saveConfig();
        }
    }

    // 显示设置对话框
    function showSettingsDialog() {
        const dialog = document.createElement('div');
        dialog.id = 'auto-page-settings-dialog';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            color: #333;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 5px 30px rgba(0,0,0,0.3);
            z-index: 1000000;
            min-width: 300px;
            font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
        `;

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 999999;
        `;
        overlay.onclick = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        };

        // 对话框内容
        dialog.innerHTML = `
            <h3 style="margin-top:0; color:#333;">⚙️ 自动翻页设置</h3>

            <div style="margin-bottom:15px;">
                <label style="display:block; margin-bottom:5px; font-size:14px;">最小延迟时间（秒）</label>
                <input type="number" id="minDelayInput" value="${state.minDelay}" min="5" max="300" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;">
            </div>

            <div style="margin-bottom:15px;">
                <label style="display:block; margin-bottom:5px; font-size:14px;">最大延迟时间（秒）</label>
                <input type="number" id="maxDelayInput" value="${state.maxDelay}" min="10" max="600" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;">
            </div>

            <div style="margin-bottom:20px;">
                <label style="display:block; margin-bottom:5px; font-size:14px;">下一页按钮选择器</label>
                <textarea id="selectorInput" rows="3" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box; font-family:monospace; font-size:12px;">${state.nextPageSelector}</textarea>
                <div style="font-size:12px; color:#666; margin-top:5px;">多个选择器用逗号分隔</div>
            </div>

            <div style="margin-bottom:20px;">
                <label style="display:flex; align-items:center; cursor:pointer;">
                    <input type="checkbox" id="showPanelInput" ${state.showStatusPanel ? 'checked' : ''} style="margin-right:8px;">
                    <span>显示状态面板</span>
                </label>
            </div>

            <div style="display:flex; gap:10px;">
                <button id="saveBtn" style="flex:1; padding:10px; background:#4CAF50; color:white; border:none; border-radius:4px; cursor:pointer;">保存</button>
                <button id="cancelBtn" style="flex:1; padding:10px; background:#f44336; color:white; border:none; border-radius:4px; cursor:pointer;">取消</button>
            </div>
        `;

        // 添加事件处理
        setTimeout(() => {
            const saveBtn = document.getElementById('saveBtn');
            const cancelBtn = document.getElementById('cancelBtn');
            const minDelayInput = document.getElementById('minDelayInput');
            const maxDelayInput = document.getElementById('maxDelayInput');
            const selectorInput = document.getElementById('selectorInput');
            const showPanelInput = document.getElementById('showPanelInput');

            saveBtn.onclick = () => {
                const minDelay = parseInt(minDelayInput.value) || DEFAULT_CONFIG.minDelay;
                const maxDelay = parseInt(maxDelayInput.value) || DEFAULT_CONFIG.maxDelay;

                if (minDelay >= maxDelay) {
                    alert('最小延迟时间必须小于最大延迟时间');
                    return;
                }

                state.minDelay = minDelay;
                state.maxDelay = maxDelay;
                state.nextPageSelector = selectorInput.value.trim() || DEFAULT_CONFIG.nextPageSelector;
                state.showStatusPanel = showPanelInput.checked;

                saveConfig();

                // 如果正在运行，重新开始循环
                if (state.isRunning) {
                    stopAutoPaging();
                    setTimeout(startAutoPaging, 100);
                }

                // 更新状态面板
                if (state.showStatusPanel && !state.statusPanel) {
                    createStatusPanel();
                } else if (!state.showStatusPanel && state.statusPanel) {
                    state.statusPanel.style.display = 'none';
                }

                document.body.removeChild(overlay);
                document.body.removeChild(dialog);

                GM_notification({
                    text: '设置已保存',
                    title: '自动翻页刷课助手',
                    timeout: 2000
                });
            };

            cancelBtn.onclick = () => {
                document.body.removeChild(overlay);
                document.body.removeChild(dialog);
            };
        }, 0);

        // 添加到页面
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);

        // 聚焦到第一个输入框
        setTimeout(() => {
            const input = document.getElementById('minDelayInput');
            if (input) input.focus();
        }, 100);
    }

    // 初始化
    function init() {
        // 加载配置
        loadConfig();

        console.log('[自动翻页] 脚本加载完成');

        // 如果之前是启用状态，自动开始
        if (state.isEnabled) {
            console.log('[自动翻页] 检测到之前为启用状态，自动开始...');
            setTimeout(startAutoPaging, 1000);
        }

        // 创建状态面板（如果设置中启用了）
        if (state.showStatusPanel) {
            setTimeout(() => createStatusPanel(), 500);
        }
    }

    // 注册菜单命令
    function registerMenuCommands() {
        // 开启/停止命令
        GM_registerMenuCommand(state.isRunning ? '🛑 停止自动翻页' : '🚀 开启自动翻页', () => {
            if (state.isRunning) {
                stopAutoPaging();
            } else {
                startAutoPaging();
            }
        });

        // 设置命令
        GM_registerMenuCommand('⚙️ 设置', showSettingsDialog);

        // 显示/隐藏面板命令
        GM_registerMenuCommand(state.showStatusPanel ? '👁️ 隐藏状态面板' : '👁️ 显示状态面板', () => {
            state.showStatusPanel = !state.showStatusPanel;
            saveConfig();

            if (state.showStatusPanel) {
                if (!state.statusPanel) {
                    createStatusPanel();
                } else {
                    state.statusPanel.style.display = 'block';
                }
                GM_notification({
                    text: '状态面板已显示',
                    title: '自动翻页刷课助手',
                    timeout: 2000
                });
            } else if (state.statusPanel) {
                state.statusPanel.style.display = 'none';
                GM_notification({
                    text: '状态面板已隐藏',
                    title: '自动翻页刷课助手',
                    timeout: 2000
                });
            }
        });

        // 测试按钮查找命令
        GM_registerMenuCommand('🔍 测试查找下一页按钮', () => {
            const button = findNextPageButton();
            if (button) {
                GM_notification({
                    text: '找到下一页按钮，位置已高亮',
                    title: '自动翻页刷课助手',
                    timeout: 3000
                });

                // 高亮按钮
                const originalOutline = button.style.outline;
                button.style.outline = '3px solid red';
                button.style.outlineOffset = '2px';

                setTimeout(() => {
                    button.style.outline = originalOutline;
                }, 3000);
            } else {
                GM_notification({
                    text: '未找到下一页按钮',
                    title: '自动翻页刷课助手',
                    timeout: 3000
                });
            }
        });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            registerMenuCommands();
        });
    } else {
        init();
        registerMenuCommands();
    }

    // 暴露一些函数到全局作用域（用于调试）
    unsafeWindow.autoPageHelper = {
        start: startAutoPaging,
        stop: stopAutoPaging,
        settings: showSettingsDialog,
        findButton: findNextPageButton,
        testClick: clickNextPageButton,
        getState: () => ({ ...state })
    };

    // 页面卸载时清理
    window.addEventListener('beforeunload', () => {
        if (state.isRunning) {
            console.log('[自动翻页] 页面即将卸载，停止自动翻页');
            stopAutoPaging();
        }
    });

})();