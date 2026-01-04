// ==UserScript==
// @name         自动点击器
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  修复布局问题和添加正则表达式支持的自动点击器，新增按钮锁定功能和导入导出整合
// @author       You
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/555199/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/555199/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 主题配置
    const themes = {
        blue: {
            name: '浅蓝梦境',
            solid: '#a8b5eaff',
            lightBg: '#F0F9FF',
            text: '#2C5282'
        },
        pink: {
            name: '粉红幻想',
            solid: '#ff89a9',
            lightBg: '#FFF5F7',
            text: '#97266D'
        },
        mint: {
            name: '薄荷清新',
            solid: '#A5D6A7',
            lightBg: '#F0FFF4',
            text: '#22543D'
        },
        lavender: {
            name: '薰衣草',
            solid: '#C4B5FD',
            lightBg: '#FAF5FF',
            text: '#553C9A'
        }
    };


    // 默认配置
    const defaultConfig = {
        selectors: ['.btn-primary'],
        interval: 1000,
        repeat: 1,
        icon: '✨',
        hotkey: '',
        actionType: 'click',
        emitKey: '',
        emitCtrl: false,
        emitShift: false,
        emitAlt: false,
        emitMeta: false
    };

    // 按钮配置
    const defaultButtonConfig = {
        buttons: [
            {
                id: 'default',
                name: '魔法点击器',
                configName: 'default',
                visible: true,
                locked: false, // 新增：锁定状态
                showIcon: true, // 新增：是否显示图标
                position: { x: 20, y: 20 },
                domains: ['*'] // 默认在所有域名显示
            }
        ],
        buttonSize: 36,
        currentTheme: 'blue'
    };

    // 获取当前主题
    function getCurrentTheme() {
        const buttonConfig = GM_getValue('buttonConfig');
        return themes[buttonConfig?.currentTheme] || themes.blue;
    }

    // 获取当前页面的完整URL信息
    function getCurrentURLInfo() {
        const url = new URL(window.location.href);
        return {
            hostname: url.hostname,
            pathname: url.pathname,
            origin: url.origin,
            fullUrl: url.href
        };
    }

    // 检查按钮是否应该在当前页面显示
    function shouldShowButton(button) {
        if (!button.domains || button.domains.length === 0) {
            return true; // 如果没有设置域名，默认显示
        }

        const currentUrl = getCurrentURLInfo();

        for (const domainRule of button.domains) {
            if (domainRule === '*') {
                return true; // 通配符，所有域名都显示
            }

            // 检查是否是正则表达式（以/开头和结尾）
            if (domainRule.startsWith('/') && domainRule.endsWith('/')) {
                try {
                    const regex = new RegExp(domainRule.slice(1, -1));
                    const fullUrl = currentUrl.hostname + currentUrl.pathname;
                    if (regex.test(fullUrl)) {
                        return true;
                    }
                } catch (e) {
                    console.warn('无效的正则表达式:', domainRule);
                }
                continue;
            }

            // 处理多层通配符路径：abc.com/*/path/*/subpath
            if (domainRule.includes('/*/')) {
                try {
                    const [domainPart, ...pathParts] = domainRule.split('/');
                    const ruleUrl = new URL(domainPart.startsWith('http') ? domainPart : `https://${domainPart}`);

                    if (currentUrl.hostname !== ruleUrl.hostname) {
                        continue;
                    }

                    // 将多层通配符转换为正则表达式
                    let regexPattern = '^';
                    for (const part of pathParts) {
                        if (part === '*') {
                            regexPattern += '\/[^\/]*';
                        } else {
                            regexPattern += `\/${part}`;
                        }
                    }
                    regexPattern += '$';

                    const regex = new RegExp(regexPattern);
                    if (regex.test(currentUrl.pathname)) {
                        return true;
                    }
                } catch (e) {
                    console.warn('无效的多层通配符规则:', domainRule);
                }
                continue;
            }

            // 处理域名规则
            if (domainRule.includes('/')) {
                // 包含路径的规则
                try {
                    const ruleUrl = new URL(domainRule.startsWith('http') ? domainRule : `https://${domainRule}`);
                    if (currentUrl.hostname === ruleUrl.hostname &&
                        currentUrl.pathname.startsWith(ruleUrl.pathname)) {
                        return true;
                    }

                    // 支持路径通配符：example.com/path/*
                    if (ruleUrl.pathname.endsWith('/*')) {
                        const basePath = ruleUrl.pathname.slice(0, -2);
                        if (currentUrl.hostname === ruleUrl.hostname &&
                            currentUrl.pathname.startsWith(basePath)) {
                            return true;
                        }
                    }
                } catch (e) {
                    console.warn('无效的URL规则:', domainRule);
                }
            } else {
                // 纯域名规则
                if (currentUrl.hostname === domainRule ||
                    currentUrl.hostname.endsWith('.' + domainRule)) {
                    return true;
                }
            }
        }

        return false;
    }

    // 初始化配置
    function initConfig() {
        if (!GM_getValue('savedConfigs')) {
            GM_setValue('savedConfigs', {
                'default': defaultConfig
            });
        }
        if (!GM_getValue('buttonConfig')) {
            GM_setValue('buttonConfig', defaultButtonConfig);
        }
        if (!GM_getValue('currentConfig')) {
            GM_setValue('currentConfig', 'default');
        }
    }

    // 更新菜单命令 - 移除独立的导入导出菜单项
    GM_registerMenuCommand('🎨 配置点击器', showMainConfigPanel);
    GM_registerMenuCommand('🔧 管理按钮', showButtonConfigPanel);

    // 创建所有按钮
    function createActionButtons() {
        const buttonConfig = GM_getValue('buttonConfig');
        const savedConfigs = GM_getValue('savedConfigs');

        buttonConfig.buttons.forEach(button => {
            if (button.visible && shouldShowButton(button)) {
                // 获取按钮对应的配置信息
                const config = savedConfigs[button.configName];
                if (config) {
                    createSingleButton(button, config);
                } else {
                    console.warn('配置不存在:', button.configName);
                }
            }
        });
    }

    // 创建单个按钮
    function createSingleButton(buttonConfig, clickConfig) {
        const btn = document.createElement('button');
        // 使用配置中的图标，根据 showIcon 属性决定是否显示
        btn.innerHTML = (buttonConfig.showIcon !== false) ? (clickConfig.icon || '✨') : '';
        btn.title = buttonConfig.configName;
        btn.id = `auto-clicker-btn-${buttonConfig.id}`;
        btn.dataset.configName = buttonConfig.configName;
        btn.dataset.locked = buttonConfig.locked || false;

        const theme = getCurrentTheme();
        const globalButtonConfig = GM_getValue('buttonConfig');
        const buttonSize = globalButtonConfig.buttonSize || 36;

        btn.style.cssText = `
            position: fixed;
            top: ${buttonConfig.position?.y || 20}px;
            left: ${buttonConfig.position?.x || 20}px;
            width: ${buttonSize}px;
            height: ${buttonSize}px;
            background: #ffffff00;
            border: 0px solid ${theme.solid};
            border-radius: ${buttonSize / 2}px;
            box-shadow: 0 0px 0px rgba(0,0,0,0.01);
            cursor: pointer;
            z-index: 20000;
            font-size: ${Math.max(16, buttonSize * 0.45)}px;
            display: flex;
            align-items: center;
            justify-content: center;
            user-select: none;
            touch-action: none;
            color: ${theme.text};
            font-weight: bold;
            -webkit-tap-highlight-color: transparent;
        `;

        // 根据锁定状态设置样式
        if (buttonConfig.locked) {
            btn.style.opacity = '0.7';
            btn.style.cursor = 'default';
            btn.title = `${buttonConfig.configName} (已锁定)`;
        } else {
            // 拖动功能 - 只有未锁定的按钮才可拖动
            makeDraggable(btn, buttonConfig.id);
        }

        // 点击事件
        // 添加拖拽检测（放在click监听器前面）
        let isDragging = false;
        let startX, startY;

        btn.addEventListener('mousedown', function(e) {
            // 如果按钮已锁定，阻止拖动
            if (buttonConfig.locked) {
                e.stopPropagation();
                return;
            }
            isDragging = false;
            startX = e.clientX;
            startY = e.clientY;
        });

        btn.addEventListener('mousemove', function(e) {
            if (buttonConfig.locked) return; // 锁定按钮不处理移动
            if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
                isDragging = true;
            }
        });

        // 你现有的点击代码（修改它）
        btn.addEventListener('click', function(e) {
            // 锁定按钮可以点击执行操作，但不能拖动
            if (!buttonConfig.locked && isDragging) {
                e.stopPropagation();
                return; // 如果是拖拽，不执行点击行为
            }

            e.stopPropagation();
            console.log('点击按钮:', buttonConfig.configName);
            executeClickActions(buttonConfig.configName);
        });

        // 触摸事件
        btn.addEventListener('touchstart', function(e) {
            if (buttonConfig.locked) {
                e.stopPropagation();
            }
        }, { passive: true });

        document.body.appendChild(btn);
        return btn;
    }

    // 拖动功能 - 修复移动端页面滚动问题
    function makeDraggable(element, buttonId) {
        let isDragging = false;
        let startX, startY, initialX, initialY;

        // 触摸事件
        element.addEventListener('touchstart', function(e) {
            if (e.touches.length !== 1) return;

            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            initialX = element.offsetLeft;
            initialY = element.offsetTop;

            isDragging = true;
            element.style.opacity = '0.8';

            e.stopPropagation();

            document.addEventListener('touchmove', onTouchMove, { passive: false });
            document.addEventListener('touchend', onTouchEnd, { passive: false });

            // 添加临时样式阻止页面滚动
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';

        }, { passive: false });

        // 鼠标事件
        element.addEventListener('mousedown', function(e) {
            // 阻止默认行为，避免文本选择、拖拽不跟手
            e.preventDefault();
            e.stopPropagation();

            startX = e.clientX;
            startY = e.clientY;

            // 使用计算样式或位置来获取初始坐标，兼容 position: fixed
            const computed = window.getComputedStyle(element);
            const leftVal = parseFloat(computed.left);
            const topVal = parseFloat(computed.top);
            const rect = element.getBoundingClientRect();
            initialX = isNaN(leftVal) ? rect.left : leftVal;
            initialY = isNaN(topVal) ? rect.top : topVal;

            isDragging = true;
            element.style.opacity = '0.8';

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);

            // 阻止文本选择
            document.body.style.userSelect = 'none';
        });

        function onTouchMove(e) {
            if (!isDragging) return;

            // 阻止默认行为，防止页面滚动
            e.preventDefault();
            e.stopPropagation();

            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;

            // 限制拖动范围在视口内
            const newX = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, initialX + deltaX));
            const newY = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, initialY + deltaY));

            element.style.left = newX + "px";
            element.style.top = newY + "px";
        }

        function onTouchEnd(e) {
            if (!isDragging) return;

            isDragging = false;
            element.style.opacity = '1';

            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);

            // 恢复页面滚动
            document.body.style.overflow = '';
            document.body.style.touchAction = '';

            saveButtonPosition(buttonId, parseInt(element.style.left), parseInt(element.style.top));
        }

        function onMouseMove(e) {
            if (!isDragging) return;

            // 阻止默认行为，避免页面选择或滚动影响拖拽
            e.preventDefault();

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            // 限制拖动范围在视口内
            const newX = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, initialX + deltaX));
            const newY = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, initialY + deltaY));

            element.style.left = newX + 'px';
            element.style.top = newY + 'px';
        }

        function onMouseUp(e) {
            if (!isDragging) return;

            isDragging = false;
            element.style.opacity = '1';

            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            // 恢复文本选择
            document.body.style.userSelect = '';

            saveButtonPosition(buttonId, parseInt(element.style.left), parseInt(element.style.top));
        }
    }

    // 保存按钮位置
    function saveButtonPosition(buttonId, x, y) {
        const buttonConfig = GM_getValue('buttonConfig');
        const buttonIndex = buttonConfig.buttons.findIndex(btn => btn.id === buttonId);
        if (buttonIndex !== -1) {
            buttonConfig.buttons[buttonIndex].position = { x, y };
            GM_setValue('buttonConfig', buttonConfig);
        }
    }

    // 打开开发者工具 - 实用版本
    function openDevTools(panel = '') {
        try {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

            // 方法1: 尝试直接调用浏览器API（如果可用）
            if (typeof chrome !== 'undefined' && chrome.devtools) {
                try {
                    chrome.devtools.inspectedWindow.eval("console.log('开发者工具已打开')");
                    showNotification('开发者工具已通过扩展API打开', 'success');
                    return;
                } catch (e) {
                    // 忽略错误，继续尝试其他方法
                }
            }

            // 方法2: 创建详细的使用说明
            const shortcut = isMac ? '⌥ + ⌘ + I (Option + Command + I)' : 'F12 或 Ctrl + Shift + I';
            const message = `请手动按 ${shortcut} 打开开发者工具\n\n` +
                  `常用面板快捷键:\n` +
                  `• ${isMac ? '⌥ + ⌘ + J' : 'Ctrl + Shift + J'} - 控制台\n` +
                  `• ${isMac ? '⌥ + ⌘ + C' : 'Ctrl + Shift + C'} - 检查元素\n` +
                  `• ${isMac ? '⌘ + [' : 'Ctrl + ['} - 上一个面板\n` +
                  `• ${isMac ? '⌘ + ]' : 'Ctrl + ]'} - 下一个面板`;

            // 显示详细提示
            showNotification(`请按 ${isMac ? '⌥⌘I' : 'F12'} 打开开发者工具`, 'info');

            // 同时在控制台输出详细说明
            console.log(`%c🔧 自动点击器 - 开发者工具打开指南`, 'color: #4CAF50; font-size: 16px; font-weight: bold;');
            console.log(`%c${message}`, 'color: #2196F3; font-size: 14px; line-height: 1.4;');
            console.log(`%c💡 提示: 你可以在浏览器设置中查看或修改这些快捷键`, 'color: #FF9800; font-size: 12px;');

            // 方法3: 尝试触发右键菜单的"检查"选项（有限支持）
            try {
                // 创建一个隐藏的调试元素
                const debugElement = document.createElement('div');
                debugElement.id = 'auto-clicker-debug-element';
                debugElement.style.cssText = 'position: fixed; top: 0; left: 0; width: 1px; height: 1px; opacity: 0.001; z-index: -9999;';
                debugElement.setAttribute('data-debug', 'auto-clicker');
                document.body.appendChild(debugElement);

                // 尝试触发上下文菜单事件
                const event = new MouseEvent('contextmenu', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: 10,
                    clientY: 10
                });
                debugElement.dispatchEvent(event);

                // 清理
                setTimeout(() => {
                    if (debugElement.parentNode) {
                        debugElement.remove();
                    }
                }, 1000);

            } catch (e) {
                // 忽略错误
            }

        } catch (error) {
            console.error('打开开发者工具失败:', error);
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const shortcut = isMac ? '⌥ + ⌘ + I' : 'F12 或 Ctrl + Shift + I';
            showNotification(`请手动按 ${shortcut} 打开开发者工具`, 'info');
        }
    }

    function executeClickActions(configName) {
        console.log('开始执行点击操作，配置:', configName);

        const savedConfigs = GM_getValue('savedConfigs');
        const config = savedConfigs[configName];

        if (!config) {
            showNotification('配置不存在: ' + configName, 'error');
            return;
        }

        const action = config.actionType || 'click';
        const isKey = action === 'keypress';
        if (action === 'click') {
            if (!config.selectors || config.selectors.length === 0) {
                showNotification('请先为配置 "' + configName + '" 设置点击规则', 'error');
                return;
            }
        } else if (action === 'keypress') {
            if (!config.emitKey || config.emitKey.trim() === '') {
                showNotification('请为配置 "' + configName + '" 设置目标按键', 'error');
                return;
            }
        }

        let currentRound = 0;
        const interval = config.interval || 1000;
        const repeat = config.repeat || 1;

        console.log('配置信息:', {
            mode: action,
            selectors: config.selectors,
            emitKey: config.emitKey,
            ctrl: !!config.emitCtrl,
            shift: !!config.emitShift,
            alt: !!config.emitAlt,
            meta: !!config.emitMeta,
            interval: interval,
            repeat: repeat
        });

        const executeRound = () => {
            if (currentRound >= repeat) {
                showNotification('点击操作完成: ' + configName, 'success');
                return;
            }

            if (action === 'click') {
                let clickedCount = 0;
                config.selectors.forEach((selector, index) => {
                    setTimeout(() => {
                        const element = document.querySelector(selector);
                        if (element) {
                            element.click();
                            clickedCount++;
                            console.log(`点击了选择器: ${selector}`);
                        } else {
                            console.warn(`未找到元素: ${selector}`);
                        }
                    }, index * 200);
                });
            } else if (action === 'centerClick') {
                try {
                    centerClickAtViewport();
                    console.log('已点击屏幕中心');
                    showNotification('点击屏幕中心', 'info');
                } catch (e) {
                    console.error('中心点击失败:', e);
                }
            } else {
                dispatchKeyStroke(config.emitKey, {
                    ctrlKey: !!config.emitCtrl,
                    shiftKey: !!config.emitShift,
                    altKey: !!config.emitAlt,
                    metaKey: !!config.emitMeta
                });
                console.log(`发送按键: ${config.emitKey}`);
                try {
                    const nk = normalizeKey(config.emitKey || '');
                    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

                    // 平台适配的主修饰键
                    const mainModifier = isMac ? (config.emitMeta || config.emitCtrl) : config.emitCtrl;
                    const altModifier = config.emitAlt;
                    const shiftModifier = config.emitShift;
                    const ctrlKey = config.emitCtrl;

                    console.log('快捷键检测:', { key: nk, mainModifier, shiftModifier, altModifier, isMac });

                    // === 基础编辑操作 ===
                    if (mainModifier && nk === 'a') {
                        selectAllFallback();
                        showNotification('全选', 'success');
                        return;
                    } else if (mainModifier && nk === 'c') {
                        copyFallback();
                        showNotification('已复制', 'success');
                        return;
                    } else if (mainModifier && nk === 'x') {
                        cutFallback();
                        showNotification('已剪切', 'success');
                        return;
                    } else if (mainModifier && nk === 'v') {
                        pasteFallback();
                        showNotification('已粘贴', 'success');
                        return;
                    } else if (mainModifier && nk === 'z') {
                        if (shiftModifier) {
                            redoFallback();
                            showNotification('重做', 'success');
                        } else {
                            undoFallback();
                            showNotification('撤销', 'success');
                        }
                        return;
                    } else if ((!isMac && mainModifier && nk === 'y') || (isMac && mainModifier && shiftModifier && nk === 'z')) {
                        redoFallback();
                        showNotification('重做', 'success');
                        return;
                    }

                    // === 浏览器操作 ===
                    else if (mainModifier && nk === 'r') {
                        // Command/Ctrl + R 刷新
                        location.reload();
                        showNotification('刷新页面', 'info');
                        return;
                    } else if (mainModifier && shiftModifier && nk === 'r') {
                        // Command/Ctrl + Shift + R 强制刷新
                        location.reload(true);
                        showNotification('强制刷新', 'info');
                        return;
                    } else if (mainModifier && nk === 'l') {
                        // Command/Ctrl + L 聚焦地址栏
                        showNotification('聚焦地址栏', 'info');
                        return;
                    } else if (mainModifier && nk === 'n') {
                        window.open('', '_blank');
                        showNotification('新建窗口', 'info');
                        return;
                    } else if (mainModifier && nk === 't') {
                        window.open('', '_blank');
                        showNotification('新建标签页', 'info');
                        return;
                    } else if (mainModifier && nk === 'w') {
                        closeCurrentTab();
                        return;
                    } else if (mainModifier && shiftModifier && nk === 'w') {
                        closeCurrentTab();
                        return;
                    } else if (mainModifier && shiftModifier && nk === 't') {
                        showNotification('重新打开关闭的标签页', 'info');
                        return;
                    }

                    // === 开发者工具 (Mac 适配) ===
                    else if ((isMac && mainModifier && altModifier && nk === 'i') ||
                             (!isMac && mainModifier && shiftModifier && nk === 'i')) {
                        openDevTools();
                        return;
                    } else if ((isMac && mainModifier && altModifier && nk === 'j') ||
                               (!isMac && mainModifier && shiftModifier && nk === 'j')) {
                        openDevTools('console');
                        return;
                    } else if ((isMac && mainModifier && altModifier && nk === 'c') ||
                               (!isMac && mainModifier && shiftModifier && nk === 'c')) {
                        openDevTools('elements');
                        return;
                    }

                    // === 全屏功能 (平台适配) ===
                    else if ((isMac && mainModifier && ctrlKey && nk === 'f') ||
                             (!isMac && nk === 'f11')) {
                        toggleFullscreen();
                        return;
                    }

                    // === 功能键 (提供替代方案) ===
                    else if (nk === 'f5') {
                        // F5 刷新 - 在 Mac 上可能不可用
                        if (!isMac) {
                            location.reload();
                        } else {
                            showNotification('在 Mac 上请使用 ⌘+R 刷新', 'info');
                        }
                        return;
                    } else if (nk === 'f11') {
                        // F11 全屏 - 在 Mac 上可能不可用
                        if (!isMac) {
                            toggleFullscreen();
                        } else {
                            showNotification('在 Mac 上请使用 ⌃+⌘+F 全屏', 'info');
                        }
                        return;
                    } else if (nk === 'f12') {
                        // F12 开发者工具 - 在 Mac 上可能不可用
                        if (!isMac) {
                            showNotification('开发者工具', 'info');
                        } else {
                            showNotification('在 Mac 上请使用 ⌥+⌘+I 打开开发者工具', 'info');
                        }
                        return;
                    }

                    // === 页面导航 ===
                    else if (altModifier && nk === 'arrowleft') {
                        history.back();
                        showNotification('后退', 'info');
                        return;
                    } else if (altModifier && nk === 'arrowright') {
                        history.forward();
                        showNotification('前进', 'info');
                        return;
                    } else if (mainModifier && nk === 'arrowup') {
                        window.scrollTo(0, 0);
                        showNotification('滚动到顶部', 'info');
                        return;
                    } else if (mainModifier && nk === 'arrowdown') {
                        window.scrollTo(0, document.body.scrollHeight);
                        showNotification('滚动到底部', 'info');
                        return;
                    } else if (nk === 'space') {
                        if (shiftModifier) {
                            window.scrollBy(0, -window.innerHeight * 0.8);
                            showNotification('向上翻页', 'info');
                        } else {
                            window.scrollBy(0, window.innerHeight * 0.8);
                            showNotification('向下翻页', 'info');
                        }
                        return;
                    } else if (nk === 'home') {
                        window.scrollTo(0, 0);
                        return;
                    } else if (nk === 'end') {
                        window.scrollTo(0, document.body.scrollHeight);
                        return;
                    }

                    // === 标签页管理 ===
                    else if (mainModifier && nk >= '1' && nk <= '8') {
                        const tabIndex = parseInt(nk) - 1;
                        showNotification(`切换到标签页 ${nk}`, 'info');
                        return;
                    } else if (mainModifier && nk === '9') {
                        showNotification('切换到最后一个标签页', 'info');
                        return;
                    } else if (mainModifier && shiftModifier && nk === 'tab') {
                        showNotification('上一个标签页', 'info');
                        return;
                    } else if (mainModifier && nk === 'tab') {
                        showNotification('下一个标签页', 'info');
                        return;
                    }

                    // === 文本格式化 ===
                    else if (mainModifier && nk === 'b') {
                        formatText('bold');
                        showNotification('加粗', 'success');
                        return;
                    } else if (mainModifier && nk === 'i') {
                        formatText('italic');
                        showNotification('斜体', 'success');
                        return;
                    } else if (mainModifier && nk === 'u') {
                        formatText('underline');
                        showNotification('下划线', 'success');
                        return;
                    } else if (mainModifier && shiftModifier && nk === 's') {
                        formatText('strikethrough');
                        showNotification('删除线', 'success');
                        return;
                    } else if (mainModifier && nk === 'e') {
                        formatText('justifyCenter');
                        showNotification('居中对齐', 'success');
                        return;
                    } else if (mainModifier && nk === 'l') {
                        formatText('justifyLeft');
                        showNotification('左对齐', 'success');
                        return;
                    } else if (mainModifier && nk === 'r') {
                        formatText('justifyRight');
                        showNotification('右对齐', 'success');
                        return;
                    } else if (mainModifier && shiftModifier && nk === 'l') {
                        formatText('insertUnorderedList');
                        showNotification('无序列表', 'success');
                        return;
                    } else if (mainModifier && shiftModifier && nk === 'o') {
                        formatText('insertOrderedList');
                        showNotification('有序列表', 'success');
                        return;
                    }

                    // === 功能键 (保留但添加提示) ===
                    else if (nk === 'f1') {
                        if (isMac) {
                            showNotification('F1 - 在 Mac 上可能需要 fn+F1', 'info');
                        } else {
                            showNotification('帮助', 'info');
                        }
                        return;
                    } else if (nk === 'f2') {
                        if (isMac) {
                            showNotification('F2 - 在 Mac 上可能需要 fn+F2', 'info');
                        } else {
                            showNotification('重命名', 'info');
                        }
                        return;
                    } else if (nk === 'f3') {
                        if (isMac) {
                            showNotification('F3 - 在 Mac 上可能需要 fn+F3', 'info');
                        } else {
                            showNotification('查找下一个', 'info');
                        }
                        return;
                    } else if (nk === 'f4') {
                        if (isMac) {
                            showNotification('F4 - 在 Mac 上可能需要 fn+F4', 'info');
                        } else {
                            if (altModifier) {
                                closeCurrentTab();
                                return;
                            }
                            showNotification('F4功能', 'info');
                        }
                        return;
                    } else if (nk === 'f6') {
                        if (isMac) {
                            showNotification('F6 - 在 Mac 上可能需要 fn+F6', 'info');
                        } else {
                            showNotification('聚焦地址栏', 'info');
                        }
                        return;
                    } else if (nk === 'f7') {
                        if (isMac) {
                            showNotification('F7 - 在 Mac 上可能需要 fn+F7', 'info');
                        } else {
                            showNotification('拼写检查', 'info');
                        }
                        return;
                    }

                    // === 特殊操作 ===
                    else if (nk === 'escape') {
                        closeModals();
                        showNotification('取消/关闭', 'info');
                        return;
                    } else if (nk === 'delete') {
                        deleteFallback();
                        showNotification('删除', 'info');
                        return;
                    } else if (nk === 'backspace') {
                        deleteFallback();
                        showNotification('退格删除', 'info');
                        return;
                    } else if (mainModifier && nk === 's') {
                        // 保存功能
                        simulateSave();
                        showNotification('保存', 'success');
                        return;
                    } else if (mainModifier && nk === 'o') {
                        // 打开功能
                        simulateOpen();
                        showNotification('打开', 'info');
                        return;
                    } else if (mainModifier && nk === 'p') {
                        // 打印
                        window.print();
                        showNotification('打印', 'info');
                        return;
                    } else if (mainModifier && shiftModifier && nk === 's') {
                        // 另存为
                        simulateSaveAs();
                        showNotification('另存为', 'info');
                        return;
                    }

                    // === 媒体控制 ===
                    else if (nk === 'medialplaypause') {
                        mediaControl('playpause');
                        showNotification('播放/暂停', 'info');
                        return;
                    } else if (nk === 'medianexttrack') {
                        mediaControl('next');
                        showNotification('下一曲', 'info');
                        return;
                    } else if (nk === 'mediaprevioustrack') {
                        mediaControl('previous');
                        showNotification('上一曲', 'info');
                        return;
                    } else if (nk === 'mediastop') {
                        mediaControl('stop');
                        showNotification('停止', 'info');
                        return;
                    } else if (nk === 'volumemute') {
                        mediaControl('mute');
                        showNotification('静音', 'info');
                        return;
                    } else if (nk === 'volumedown') {
                        mediaControl('volumedown');
                        showNotification('音量减小', 'info');
                        return;
                    } else if (nk === 'volumeup') {
                        mediaControl('volumeup');
                        showNotification('音量增加', 'info');
                        return;
                    }

                    // === 光标移动和选择 ===
                    else if (mainModifier && nk === 'arrowleft') {
                        moveToLineStart();
                        showNotification('行首', 'info');
                        return;
                    } else if (mainModifier && nk === 'arrowright') {
                        moveToLineEnd();
                        showNotification('行尾', 'info');
                        return;
                    } else if (mainModifier && nk === 'arrowup') {
                        moveToDocumentStart();
                        showNotification('文档开始', 'info');
                        return;
                    } else if (mainModifier && nk === 'arrowdown') {
                        moveToDocumentEnd();
                        showNotification('文档结束', 'info');
                        return;
                    } else if (shiftModifier && nk === 'arrowleft') {
                        selectTextLeft();
                        showNotification('向左选择', 'info');
                        return;
                    } else if (shiftModifier && nk === 'arrowright') {
                        selectTextRight();
                        showNotification('向右选择', 'info');
                        return;
                    } else if (mainModifier && shiftModifier && nk === 'arrowleft') {
                        selectToLineStart();
                        showNotification('选择到行首', 'info');
                        return;
                    } else if (mainModifier && shiftModifier && nk === 'arrowright') {
                        selectToLineEnd();
                        showNotification('选择到行尾', 'info');
                        return;
                    }

                    // === 系统级快捷键 ===
                    else if (mainModifier && shiftModifier && nk === 'escape') {
                        showNotification('任务管理器', 'info');
                        return;
                    } else if (mainModifier && nk === 'h') {
                        showNotification('显示/隐藏', 'info');
                        return;
                    } else if (mainModifier && nk === 'm') {
                        minimizeWindow();
                        showNotification('最小化', 'info');
                        return;
                    } else if (mainModifier && nk === 'q') {
                        showNotification('退出应用', 'info');
                        return;
                    }

                    // === 数字小键盘 ===
                    else if (nk.startsWith('numpad')) {
                        const numKey = nk.replace('numpad', '');
                        showNotification(`小键盘 ${numKey}`, 'info');
                        return;
                    }

                    // === 如果没有匹配的特定快捷键，使用默认的按键发送 ===
                    dispatchKeyStroke(config.emitKey, {
                        ctrlKey: !!config.emitCtrl,
                        shiftKey: !!config.emitShift,
                        altKey: !!config.emitAlt,
                        metaKey: !!config.emitMeta
                    });

                } catch (e) {
                    console.error('快捷键处理错误:', e);
                    // 出错时也发送按键
                    dispatchKeyStroke(config.emitKey, {
                        ctrlKey: !!config.emitCtrl,
                        shiftKey: !!config.emitShift,
                        altKey: !!config.emitAlt,
                        metaKey: !!config.emitMeta
                    });
                }
            }

            currentRound++;

            if (currentRound < repeat) {
                setTimeout(executeRound, interval);
            }
        };

        executeRound();
    }

    function keyToCode(key) {
        const k = key || '';
        if (k.length === 1) {
            const c = k.toLowerCase();
            if (c >= 'a' && c <= 'z') return 'Key' + c.toUpperCase();
            if (c >= '0' && c <= '9') return 'Digit' + c;
        }
        return k;
    }

    function normalizeKey(key) {
        if (!key) return '';
        if (key.length === 1) return key.toLowerCase();
        return key;
    }

    function getKeyInfo(k) {
        const key = k.length === 1 ? k.toLowerCase() : k;
        const map = {
            Enter: 13,
            Escape: 27,
            Backspace: 8,
            Tab: 9,
            Space: 32,
            ArrowLeft: 37,
            ArrowUp: 38,
            ArrowRight: 39,
            ArrowDown: 40,
            Delete: 46,
            Home: 36,
            End: 35,
            PageUp: 33,
            PageDown: 34
        };
        let keyCode = 0;
        let code = '';
        if (key.length === 1) {
            code = (key >= 'a' && key <= 'z') ? 'Key' + key.toUpperCase() : (key >= '0' && key <= '9') ? 'Digit' + key : '';
            keyCode = key.toUpperCase().charCodeAt(0);
        } else if (/^F[1-9]\d?$/.test(key)) {
            const n = parseInt(key.slice(1), 10);
            keyCode = 111 + n;
            code = key;
        } else {
            keyCode = map[key] || 0;
            code = key;
        }
        return { key, code: code || key, keyCode };
    }

    function dispatchKeyStroke(key, mods) {
        const k = normalizeKey(key);
        const info = getKeyInfo(k);
        const base = Object.assign({
            key: info.key,
            code: info.code,
            bubbles: true,
            cancelable: true,
            composed: true,
            view: (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window)
        }, mods || {});
        try {
            if (typeof unsafeWindow !== 'undefined' && unsafeWindow.focus) unsafeWindow.focus();
            if (document.body && document.body.focus) document.body.focus();
        } catch (e) {}
        const targets = [];
        const ae = document.activeElement;
        if (ae) targets.push(ae);
        if (document.body && document.body !== ae) targets.push(document.body);
        targets.push(document);
        targets.push(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);
        const types = ['keydown','keypress','keyup'];
        targets.forEach(t => {
            types.forEach(tp => {
                const ev = new KeyboardEvent(tp, base);
                try { Object.defineProperty(ev, 'keyCode', { get: () => info.keyCode }); } catch (e) {}
                try { Object.defineProperty(ev, 'which', { get: () => info.keyCode }); } catch (e) {}
                try { Object.defineProperty(ev, 'charCode', { get: () => tp === 'keypress' ? info.keyCode : 0 }); } catch (e) {}
                t.dispatchEvent(ev);
            });
        });
    }

    function selectAllFallback() {
        try {
            const ae = document.activeElement;
            if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA')) {
                if (typeof ae.select === 'function') ae.select();
                return;
            }
            if (ae && ae.isContentEditable === true) {
                const r = document.createRange();
                r.selectNodeContents(ae);
                const s = window.getSelection();
                s.removeAllRanges();
                s.addRange(r);
                return;
            }
            const range = document.createRange();
            range.selectNodeContents(document.body);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } catch (e) {}
    }

    function copyFallback() {
        try {
            const ok = document.execCommand('copy');
            if (ok) return;
        } catch (e) {}
        try {
            const t = getCurrentSelectionText();
            if (!t) return;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(t).catch(() => {});
            }
        } catch (e) {}
    }

    function cutFallback() {
        try {
            const ok = document.execCommand('cut');
            if (ok) return;
        } catch (e) {}
        try {
            const ae = document.activeElement;
            if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA') && typeof ae.selectionStart === 'number') {
                const start = ae.selectionStart;
                const end = ae.selectionEnd;
                const sel = ae.value.slice(start, end);
                if (sel && navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(sel).catch(() => {});
                const nv = ae.value.slice(0, start) + ae.value.slice(end);
                ae.value = nv;
                ae.selectionStart = ae.selectionEnd = start;
                ae.dispatchEvent(new Event('input', { bubbles: true }));
                return;
            }
            const s = window.getSelection();
            if (s && s.rangeCount > 0) {
                const t = s.toString();
                if (t && navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).catch(() => {});
                s.deleteFromDocument();
            }
        } catch (e) {}
    }

    function pasteFallback() {
        try {
            if (!(navigator.clipboard && navigator.clipboard.readText)) return;
            navigator.clipboard.readText().then(text => {
                if (!text) return;
                const ae = document.activeElement;
                if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA') && typeof ae.selectionStart === 'number') {
                    const start = ae.selectionStart;
                    const end = ae.selectionEnd;
                    const nv = ae.value.slice(0, start) + text + ae.value.slice(end);
                    ae.value = nv;
                    const pos = start + text.length;
                    ae.selectionStart = ae.selectionEnd = pos;
                    ae.dispatchEvent(new Event('input', { bubbles: true }));
                    return;
                }
                if (document.execCommand) {
                    const ok = document.execCommand('insertText', false, text);
                    if (ok) return;
                }
                const s = window.getSelection();
                if (s && s.rangeCount > 0) {
                    s.deleteFromDocument();
                    const r = s.getRangeAt(0);
                    r.insertNode(document.createTextNode(text));
                }
            }).catch(() => {});
        } catch (e) {}
    }

    function undoFallback() {
        try { if (document.execCommand) document.execCommand('undo'); } catch (e) {}
    }

    function redoFallback() {
        try { if (document.execCommand) document.execCommand('redo'); } catch (e) {}
    }

    function getCurrentSelectionText() {
        try {
            const ae = document.activeElement;
            if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA') && typeof ae.selectionStart === 'number') {
                return ae.value.slice(ae.selectionStart, ae.selectionEnd);
            }
            const s = window.getSelection();
            return s ? s.toString() : '';
        } catch (e) { return ''; }
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        // 添加 Mac 平台检测
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

        // 如果是 Mac 且涉及功能键，添加提示
        if (isMac && type === 'info' && message.includes('F') && /F[0-9]+/.test(message)) {
            message += ' (在 Mac 上可能需要 fn 键)';
        }

        const oldNotification = document.getElementById('clicker-notification');
        if (oldNotification) {
            oldNotification.remove();
        }

        const notification = document.createElement('div');
        notification.id = 'clicker-notification';
        notification.textContent = message;

        const theme = getCurrentTheme();
        const bgColor = type === 'error' ? '#f56565' :
        type === 'success' ? '#48bb78' :
        theme.solid;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: bgColor,
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            zIndex: '10001',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            color: 'white',
            textAlign: 'center',
            maxWidth: '80%'
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // 文本格式化函数
    function formatText(command) {
        try {
            if (document.execCommand) {
                document.execCommand(command, false, null);
            }
        } catch (e) {
            console.log('文本格式化不支持:', command);
        }
    }

    // 全屏切换
    function toggleFullscreen() {
        try {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(e => {
                    console.log('退出全屏失败:', e);
                });
            } else {
                document.documentElement.requestFullscreen().catch(e => {
                    console.log('进入全屏失败:', e);
                    // 备用方案：尝试使用 F11
                    const event = new KeyboardEvent('keydown', {
                        key: 'F11',
                        code: 'F11',
                        keyCode: 122,
                        which: 122,
                        bubbles: true
                    });
                    document.dispatchEvent(event);
                });
            }
        } catch (e) {
            console.log('全屏操作失败:', e);
            showNotification('全屏功能在此浏览器中可能受限', 'info');
        }
    }

    function centerClickAtViewport() {
        const x = Math.max(0, Math.floor(window.innerWidth / 2));
        const y = Math.max(0, Math.floor(window.innerHeight / 2));
        let target = document.elementFromPoint(x, y) || document.body || document.documentElement;
        try {
            if (target && typeof target.focus === 'function') target.focus();
        } catch (e) {}
        const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        try {
            const pd = new PointerEvent('pointerdown', { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerType: isTouch ? 'touch' : 'mouse', buttons: 1 });
            const pu = new PointerEvent('pointerup', { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerType: isTouch ? 'touch' : 'mouse' });
            target.dispatchEvent(pd);
            target.dispatchEvent(pu);
        } catch (e) {}
        try {
            const me = new MouseEvent('click', { bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0 });
            target.dispatchEvent(me);
        } catch (e) {
            try { if (target && typeof target.click === 'function') target.click(); } catch (e2) {}
        }
    }

    function closeCurrentTab() {
        try {
            window.opener = null;
        } catch (e) {}
        try {
            window.open('', '_self');
        } catch (e) {}
        try {
            window.close();
        } catch (e) {}
    }

    // 关闭模态框
    function closeModals() {
        // 尝试关闭可能打开的模态框
        const modals = document.querySelectorAll('.modal, .dialog, [role="dialog"]');
        modals.forEach(modal => {
            const closeBtn = modal.querySelector('.close, [data-dismiss="modal"], [aria-label="Close"]');
            if (closeBtn) closeBtn.click();
        });
    }

    // 媒体控制
    function mediaControl(action) {
        const video = document.querySelector('video');
        const audio = document.querySelector('audio');

        if (video) {
            switch(action) {
                case 'playpause': video.paused ? video.play() : video.pause(); break;
                case 'next': case 'previous': case 'stop': break; // 需要具体实现
                case 'mute': video.muted = !video.muted; break;
                case 'volumedown': video.volume = Math.max(0, video.volume - 0.1); break;
                case 'volumeup': video.volume = Math.min(1, video.volume + 0.1); break;
            }
        } else if (audio) {
            // 类似视频控制
        }
    }

    // 光标移动函数
    function moveToLineStart() {
        const ae = document.activeElement;
        if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA')) {
            ae.selectionStart = ae.selectionEnd = 0;
        }
    }

    function moveToLineEnd() {
        const ae = document.activeElement;
        if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA')) {
            const len = ae.value.length;
            ae.selectionStart = ae.selectionEnd = len;
        }
    }

    // 模拟保存等功能
    function simulateSave() {
        const event = new KeyboardEvent('keydown', {
            key: 's', code: 'KeyS', keyCode: 83,
            ctrlKey: true, metaKey: navigator.platform.toUpperCase().indexOf('MAC') >= 0
        });
        document.dispatchEvent(event);
    }

    function deleteFallback() {
        try {
            if (document.execCommand('delete')) return;
            const ae = document.activeElement;
            if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA')) {
                const start = ae.selectionStart;
                const end = ae.selectionEnd;
                if (start === end) {
                    // 删除光标后的字符
                    ae.value = ae.value.slice(0, start) + ae.value.slice(start + 1);
                } else {
                    // 删除选中文本
                    ae.value = ae.value.slice(0, start) + ae.value.slice(end);
                }
                ae.selectionStart = ae.selectionEnd = start;
                ae.dispatchEvent(new Event('input', { bubbles: true }));
            }
        } catch (e) {}
    }

    // 窗口最小化（模拟）
    function minimizeWindow() {
        // 这通常需要浏览器扩展权限，这里只是模拟
        showNotification('窗口最小化功能需要扩展权限', 'info');
    }

    // 其他辅助函数
    function moveToDocumentStart() {
        window.scrollTo(0, 0);
    }

    function moveToDocumentEnd() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    function selectTextLeft() {
        // 实现文本向左选择
    }

    function selectTextRight() {
        // 实现文本向右选择
    }

    function selectToLineStart() {
        // 实现选择到行首
    }

    function selectToLineEnd() {
        // 实现选择到行尾
    }

    function simulateOpen() {
        const event = new KeyboardEvent('keydown', {
            key: 'o', code: 'KeyO', keyCode: 79,
            ctrlKey: true, metaKey: navigator.platform.toUpperCase().indexOf('MAC') >= 0
        });
        document.dispatchEvent(event);
    }

    function simulateSaveAs() {
        const event = new KeyboardEvent('keydown', {
            key: 's', code: 'KeyS', keyCode: 83,
            ctrlKey: true, shiftKey: true, metaKey: navigator.platform.toUpperCase().indexOf('MAC') >= 0
        });
        document.dispatchEvent(event);
    }

    // 配置面板相关函数
    function showConfigPanel(type = 'main') {
        let panel = document.getElementById('auto-clicker-config-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'auto-clicker-config-panel';
            document.body.appendChild(panel);
        }

        const styleId = 'auto-clicker-styles';
        const existingStyle = document.getElementById(styleId);
        const newStyle = createPanelStyles();
        newStyle.id = styleId;
        if (!existingStyle) {
            document.head.appendChild(newStyle);
        } else {
            existingStyle.textContent = newStyle.textContent;
        }

        panel.innerHTML = type === 'main' ? getMainConfigPanelHTML() : getButtonConfigPanelHTML();

        setupConfigPanelListeners(panel, type);

        if (type === 'main') {
            loadConfigList(panel);
            loadCurrentConfig(panel);
        } else {
            loadButtonConfigList(panel);
        }
    }

    function getMainConfigPanelHTML() {
        const theme = getCurrentTheme();
        return `
            <div class="panel-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center; transition: none !important; animation: none !important;">
                <div class="panel-container" style="position: relative; transition: none !important; animation: none !important;">
                    <div class="panel-header" style="background: ${theme.solid}">
                        <div class="panel-title">
                            <span class="title-icon">⚡</span>
                            自动点击器
                        </div>
                        <button class="panel-close">✕</button>
                    </div>
                    <div class="panel-content">
                    <div class="config-group">
                        <div class="group-header">
                            <span class="group-icon">🎨</span>
                            主题设置
                        </div>
                        <select class="fancy-select" id="theme-select">
                            ${Object.entries(themes).map(([key, theme]) =>
                                                         `<option value="${key}">${theme.name}</option>`
                                                        ).join('')}
                        </select>
                    </div>



                    <div class="config-group">
                        <div class="group-header">
                            <span class="group-icon">🎯</span>
                            点击目标
                        </div>
                        <div class="input-group" id="selectors-container" style="display: grid;">
                            <div class="input-with-action">
                                <input type="text" class="fancy-input selector-input" placeholder="输入CSS选择器...">
                                <button class="action-btn remove-btn">−</button>
                            </div>
                        </div>
                        <button class="add-btn" id="add-selector">
                            <span class="btn-icon">+</span>
                            添加新规则
                        </button>
                    </div>

                    <div class="config-grid">
                        <div class="config-group">
                            <div class="group-header">
                                <span class="group-icon">⏰</span>
                                时间设置
                            </div>
                            <input type="number" id="interval-input" class="fancy-input" value="1000" min="100" placeholder="间隔(毫秒)">
                            <input type="number" id="repeat-input" class="fancy-input" value="1" min="1" placeholder="重复次数">
                        </div>

                        <div class="config-group">
                            <div class="group-header">
                                <span class="group-icon">🎪</span>
                                按钮图标
                            </div>
                            <input type="text" id="icon-input" class="fancy-input" value="✨" placeholder="表情图标" maxlength="2">
                        </div>
                    </div>

                    <div class="config-group">
                        <div class="group-header">
                            <span class="group-icon">🛠️</span>
                            动作类型
                        </div>
                        <select class="fancy-select" id="action-type-select">
                            <option value="click">点击元素</option>
                            <option value="keypress">按键/快捷键</option>
                            <option value="centerClick">点击屏幕中心</option>
                        </select>
                        <div class="input-group" id="emit-key-container" style="margin-top:8px;;width: 100%;">
                            <div class="input-with-action">
                                <input type="text" class="fancy-input" id="emit-key-input" placeholder="目标按键，例如 a、Enter、F1">
                            </div>
                            <div style="display:flex;gap:8px;margin-top:8px;">
                                <label style="display:flex;align-items:center;gap:6px;">
                                    <input type="checkbox" id="emit-ctrl"> Ctrl
                                </label>
                                <label style="display:flex;align-items:center;gap:6px;">
                                    <input type="checkbox" id="emit-shift"> Shift
                                </label>
                                <label style="display:flex;align-items:center;gap:6px;">
                                    <input type="checkbox" id="emit-alt"> Alt
                                </label>
                                <label style="display:flex;align-items:center;gap:6px;">
                                    <input type="checkbox" id="emit-meta"> Meta
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="config-group">
                        <div class="group-header">
                            <span class="group-icon">⌨️</span>
                            快捷键
                        </div>
                        <input type="text" id="hotkey-input" class="fancy-input" value="" placeholder="例如 a、Enter、F1">
                    </div>

                    <div class="config-group">
                        <div class="group-header">
                            <span class="group-icon">💾</span>
                            配置管理
                        <select class="config-selector fancy-select" id="config-selector">
                            <option value="">选择配置...</option>
                        </select>
                    </div>
                        <div class="save-section">
                            <input type="text" id="config-name" class="fancy-input save-input" placeholder="配置名称...">
                            <button class="fancy-btn save-btn" id="save-config">
                                <span class="btn-icon">💫</span>
                                保存配置
                            </button>
                        </div>
                        <button class="fancy-btn delete-btn" id="delete-config">
                            <span class="btn-icon">🗑️</span>
                            删除配置
                        </button>
                    </div>

                    <div class="action-group">
                        <button class="fancy-btn secondary manage-btn" id="manage-buttons">
                            <span class="btn-icon">🔧</span>
                            管理按钮
                        </button>
                        <button class="fancy-btn secondary" id="import-export-btn">
                            <span class="btn-icon">📤</span>
                            导入/导出配置
                        </button>
                    </div>

                        <div id="status" class="status-message">准备就绪</div>
                    </div>
                </div>
            </div>
        `;
    }

    function getButtonConfigPanelHTML() {
        const theme = getCurrentTheme();
        const currentUrl = getCurrentURLInfo();
        return `
            <div class="panel-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center; transition: none !important; animation: none !important;">
                <div class="panel-container" style="position: relative; transition: none !important; animation: none !important;">
                    <div class="panel-header" style="background: ${theme.solid}">
                        <div class="panel-title">
                            <span class="title-icon">🔧</span>
                            按钮管理
                        </div>
                        <button class="panel-close">✕</button>
                    </div>
                    <div class="panel-content">
                    <div class="config-group">
                        <div class="group-header">
                            <span class="group-icon">🌐</span>
                            当前页面
                        </div>
                        <div class="url-info">
                            <div class="url-item">
                                <strong>域名:</strong> ${currentUrl.hostname}
                            </div>
                            <div class="url-item">
                                <strong>路径:</strong> ${currentUrl.pathname}
                            </div>
                            <div class="url-item">
                                <strong>完整URL:</strong> ${currentUrl.fullUrl}
                            </div>
                        </div>
                    </div>

                    <div class="config-group">
                        <div class="group-header">
                            <span class="group-icon">✨</span>
                            按钮列表
                        </div>
                        <div id="buttons-container" class="buttons-list">
                        </div>
                        <button class="add-btn" id="add-button">
                            <span class="btn-icon">+</span>
                            添加按钮
                        </button>
                    </div>

                    <div class="config-group">
                        <div class="group-header">
                            <span class="group-icon">📐</span>
                            按钮设置
                        </div>
                        <div class="size-control">
                            <label>按钮尺寸：</label>
                            <input type="range" id="button-size-slider" class="size-slider" min="24" max="48" value="36">
                            <span id="size-value">36px</span>
                        </div>
                    </div>

                    <div class="action-group">
                        <button class="fancy-btn primary" id="save-buttons-config">
                            <span class="btn-icon">💾</span>
                            保存设置
                        </button>
                        <button class="fancy-btn secondary" id="back-to-main">
                            <span class="btn-icon">←</span>
                            返回主配置
                        </button>
                    </div>

                        <div id="button-status" class="status-message">调整按钮设置</div>
                    </div>
                </div>
            </div>
        `;
    }

    function createPanelStyles() {
        const theme = getCurrentTheme();
        const style = document.createElement('style');
        style.textContent = `
            /* 作用域限定，防止外站样式影响 */
            #auto-clicker-config-panel .panel-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: none !important;
                animation: none !important;
            }
            #auto-clicker-config-panel .panel-container {
                position: relative;
                width: 95%;
                max-width: 500px;
                max-height: 85vh;
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
                z-index: 10001;
                overflow: hidden;
                font-family: system-ui, -apple-system, sans-serif;
                transition: none !important;
                animation: none !important;
                will-change: transform;
            }
            #auto-clicker-config-panel .panel-header {
                padding: 20px 24px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            #auto-clicker-config-panel .panel-title {
                font-size: 18px;
                font-weight: 700;
                color: white;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            #auto-clicker-config-panel .panel-close {
                background: rgba(255, 255, 255, 0.3);
                border: none;
                font-size: 18px;
                color: white;
                cursor: pointer;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: none !important;
                animation: none !important;
            }
            #auto-clicker-config-panel .panel-content {
                padding: 24px;
                max-height: 70vh;
                overflow-y: auto;
            }
            #auto-clicker-config-panel .import-export-area {
                width: 100%;
                min-height: 160px;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 10px;
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                font-size: 12px;
                color: #2d3748;
                box-sizing: border-box;
                background: #fff;
            }
            #auto-clicker-config-panel .config-group {
                background: #f8fafc;
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 16px;
                border: 1px solid #e2e8f0;
            }
            #auto-clicker-config-panel .group-header {
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 12px;
                color: #2d3748;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            #auto-clicker-config-panel .url-info {
                font-size: 12px;
                line-height: 1.4;
            }
            #auto-clicker-config-panel .url-item {
                margin-bottom: 6px;
                word-break: break-all;
            }
            #auto-clicker-config-panel .url-item strong {
                color: ${theme.text};
            }
            #auto-clicker-config-panel .config-grid {
                display: grid;
                gap: 12px;
            }
            #auto-clicker-config-panel .fancy-input, #auto-clicker-config-panel .fancy-select {
                width: 100%;
                padding: 10px 12px;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                font-size: 14px;
                outline: none;
                font-family: inherit;
                margin-bottom: 8px;
                box-sizing: border-box;
                background: white;
                color: #2d3748;
                width：40px;
            }
            #auto-clicker-config-panel .fancy-input:focus, #auto-clicker-config-panel .fancy-select:focus {
                border-color: ${theme.solid};
            }
            #auto-clicker-config-panel .input-with-action {
                display: flex;
                gap: 8px;
                align-items: center;
                padding-top: 10px;
            }
            #auto-clicker-config-panel .input-with-action .fancy-input {
                flex: 1;
                margin-bottom: 0;
            }
            #auto-clicker-config-panel .action-btn {
                background: ${theme.solid};
                border: none;
                color: white;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: bold;
                transition: none !important;
                animation: none !important;
            }

            #auto-clicker-config-panel .icon-toggle-btn.icon-hidden {
                background: white;
                color: ${theme.text};
                border: 1px solid ${theme.solid};
            }


            #auto-clicker-config-panel .button-visibility.hidden {
                background: white !important;
                color: ${theme.solid} !important;
                border: 1px solid ${theme.solid} !important;
            }

            #auto-clicker-config-panel .button-visibility:hover {
                transform: scale(1.05) !important;
            }
            #auto-clicker-config-panel .add-btn {
                background: transparent;
                border: 2px dashed #cbd5e0;
                color: #718096;
                padding: 10px 12px;
                border-radius: 8px;
                font-size: 1${theme.solid}4px;
                cursor: pointer;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                font-family: inherit;
                font-weight: 500;
            }
            #auto-clicker-config-panel .add-btn:hover {
                border-color: ${theme.solid};
                color: ${theme.text};
            }
            #auto-clicker-config-panel .fancy-btn {
                padding: 12px 16px;
                border: none;
                border-radius: 10px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                font-family: inherit;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                width: 100%;
                margin-bottom: 8px;
                color: white;
                transition: none !important;
                animation: none !important;
            }
	.fancy-btn{padding:10px;border-radius:12px;color:white}
            #auto-clicker-config-panel .fancy-btn.primary {
                background: ${theme.solid};
            }
            #auto-clicker-config-panel .fancy-btn.secondary {
                background: #718096;
            }
            #auto-clicker-config-panel .save-section {
                display: flex;
                gap: 8px;
                margin-bottom: 8px;
            }
            #auto-clicker-config-panel .save-section .fancy-input {
                flex: 1;
            }
            #auto-clicker-config-panel .save-btn {
                background: ${theme.solid};
                flex: 0 0 auto;
                width: auto;
                padding: 10px 16px;
            }
            #auto-clicker-config-panel .delete-btn {
                background: ${theme.solid};
            }
            #auto-clicker-config-panel .buttons-list {
                max-height: 500px;
                overflow-y: auto;
                margin-bottom: 12px;
            }
            #auto-clicker-config-panel .button-item {
                background: white;
                border-radius: 8px;
                padding: 10px;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 10px;
                border: 1px solid #e2e8f0;
            }
            #auto-clicker-config-panel .button-preview {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                color: ${theme.text};
                background: white;
                border: 2px solid ${theme.solid};
                flex-shrink: 0;
            }
            #auto-clicker-config-panel .button-info {
                flex: 1;
                min-width: 0;
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .button-name {
                font-weight: 600;
                color: #2d3748;
                font-size: 12px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .button-details {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
            }

            .button-config, .button-icon, .button-domains {
                font-size: 11px;
                color: #718096;
                white-space: nowrap;
            }

            .button-settings {
                display: flex;
                align-items: center;
                gap: 4px;
                flex-shrink: 0;
                flex-wrap: nowrap;
            }

            .config-select {
                padding: 4px 6px;
                border: 1px solid #e2e8f0;
                border-radius: 4px;
                font-size: 11px;
                background: white;
                color: #2d3748;
                min-width: 70px;
            }

            .domain-input {
                padding: 4px 8px;
                border: 1px solid #e2e8f0;
                border-radius: 4px;
                font-size: 12px;
                background: white;
                color: #2d3748;
                width: 120px;
            }

            .domain-add-btn {
                background: ${theme.solid};
                border: none;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
            }

            .domain-list {
                margin-top: 8px;
            }

            .domain-tag {
                display: inline-flex;
                align-items: center;
                background: #e2e8f0;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 11px;
                margin: 2px;
                color: #4a5568;
            }

            .domain-tag-remove {
                margin-left: 4px;
                cursor: pointer;
                color: #718096;
            }

            .size-control {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .size-slider {
                flex: 1;
                height: 4px;
                border-radius: 2px;
                background: #e2e8f0;
                outline: none;
            }

            .size-slider::-webkit-slider-thumb {
                appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: ${theme.solid};
                cursor: pointer;
            }

            .status-message {
    	text-align: center;
    	font-size: 14px;
    	color: #718096;
    	padding: 12px;
    	border-radius: 8px;
    	background: #f8fafc;
    	margin-top: 16px;
}

            .action-group {
                margin-top: 16px;
            }

            /* 移动端适配 */
            @media (max-width: 768px) {
                #auto-clicker-config-panel .panel-container {
                    width: 98%;
                    max-width: none;
                }

                .button-item {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 8px;
                }

                .button-info {
                    width: 100%;
                }

                .button-settings {
                    width: 100%;
                    justify-content: space-between;
                }

                .button-details {
                    flex-direction: row;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .config-grid {
                    grid-template-columns: 1fr;
                }
            }

            /* 域名设置面板样式 */
            .domain-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10002;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: none !important;
                animation: none !important;
            }
            .domain-container {
                position: relative;
                width: 90%;
                max-width: 400px;
                background: white;
                border-radius: 12px;
                z-index: 10003;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                transition: none !important;
                animation: none !important;
                will-change: transform;
            }
            .domain-header {
                background: ${theme.solid};
                padding: 16px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 12px 12px 0 0;
            }
            .domain-title {
                color: white;
                font-weight: 600;
            }
            .domain-close {
                background: rgba(255,255,255,0.3);
                border: none;
                color: white;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                cursor: pointer;
                transition: none !important;
                animation: none !important;
            }
            .domain-content {
                padding: 20px;
            }
            .domain-input-group {
                display: flex;
                gap: 8px;
                margin-bottom: 12px;
            }
            .domain-examples {
                font-size: 12px;
                color: #718096;
                margin-bottom: 12px;
                line-height: 1.4;
            }
            .domain-examples div {
                margin-bottom: 2px;
            }
            .domain-actions {
                margin-top: 16px;
            }
                .domain-actions button {
        border :none ;
        background: ${theme.solid};
    }

            /* 导入导出面板 */
            .import-export-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10002;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: none !important;
                animation: none !important;
            }
            .import-export-container {
                position: relative;
                width: 92%;
                max-width: 520px;
                background: white;
                border-radius: 12px;
                z-index: 10003;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                transition: none !important;
                animation: none !important;
                will-change: transform;
            }
            .import-export-header {
                background: ${theme.solid};
                padding: 16px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 12px 12px 0 0;
                color: white;
                font-weight: 600;
            }
            .import-export-close {
                background: rgba(255,255,255,0.3);
                border: none;
                color: white;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                cursor: pointer;
                transition: none !important;
                animation: none !important;
            }
            .import-export-content {
                padding: 20px;
            }

            /* 锁定按钮样式 */
            .lock-btn {
                background: white !important;
                border: 1px solid ${theme.solid};
                color: ${theme.text};
                width: 28px;
                height: 28px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: bold;
                transition: all 0.2s;
            }

            .lock-btn.locked {
                background: ${theme.solid} !important;
                color: white;
                border: 1px solid ${theme.solid};
            }

            .lock-btn:hover {
                transform: scale(1.1);
            }

            /* 导入导出选项按钮样式 */
            .import-export-options {
                display: flex;
                gap: 12px;
                margin-bottom: 16px;
            }

            .import-export-options .option-btn {
                flex: 1;
                padding: 14px 16px;
                border: 2px solid #e2e8f0;
                border-radius: 10px;
                background: white;
                color: #4a5568;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.2s;
            }

            .import-export-options .option-btn.active {
                background: ${theme.solid};
                color: white;
                border-color: ${theme.solid};
            }

            .import-export-options .option-btn:hover {
                border-color: ${theme.solid};
                color: ${theme.text};
            }

            .textarea-container {
                position: relative;
                margin-bottom: 16px;
            }

            .textarea-container textarea {
                width: 100%;
                min-height: 200px;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                padding: 12px;
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                font-size: 13px;
                line-height: 1.5;
                resize: vertical;
                background: #f8fafc;
                color: #2d3748;
                box-sizing: border-box;
            }

            .textarea-container textarea:focus {
                outline: none;
                border-color: ${theme.solid};
                background: white;
            }

            .textarea-actions {
                display: flex;
                gap: 8px;
                margin-top: 8px;
            }

            .copy-btn {
                background: ${theme.solid};
            }

            .download-btn {
                background: ${theme.solid};
            }

            .apply-btn {
                background: ${theme.solid};
            }

            .status-indicator {
                font-size: 12px;
                color: #718096;
                margin-top: 8px;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .status-indicator.success {
                color: #38a169;
            }

            .status-indicator.error {
                color: #e53e3e;
            }

            input[type=checkbox]{
            background: ${theme.solid} !important;
            border:none !important;
            box-shadow:none !important;
            }


        `;
        return style;
    }

    function setupConfigPanelListeners(panel, type) {
        panel.querySelector('.panel-close').addEventListener('click', () => {
            panel.remove();
        });

        panel.querySelector('.panel-overlay').addEventListener('click', () => {
            panel.remove();
        });
        const containerEl = panel.querySelector('.panel-container');
        if (containerEl) {
            containerEl.addEventListener('click', function(e) { e.stopPropagation(); });
        }

        if (type === 'main') {
            setupMainConfigListeners(panel);
        } else {
            setupButtonConfigListeners(panel);
        }
    }

    function setupMainConfigListeners(panel) {
        const themeSelect = panel.querySelector('#theme-select');
        const buttonConfig = GM_getValue('buttonConfig');
        themeSelect.value = buttonConfig.currentTheme || 'blue';
        themeSelect.addEventListener('change', function() {
            const buttonConfig = GM_getValue('buttonConfig');
            buttonConfig.currentTheme = this.value;
            GM_setValue('buttonConfig', buttonConfig);
            showMainConfigPanel();
        });

        panel.querySelector('#add-selector').addEventListener('click', function() {
            const container = panel.querySelector('#selectors-container');
            const newItem = document.createElement('div');
            newItem.className = 'input-with-action';
            newItem.innerHTML = `
                <input type="text" class="fancy-input selector-input" placeholder="输入CSS选择器...">
                <button class="action-btn remove-btn">−</button>
            `;
            container.appendChild(newItem);

            newItem.querySelector('.remove-btn').addEventListener('click', function() {
                newItem.remove();
            });
        });

        const initialRemoveBtn = panel.querySelector('.remove-btn');
        if (initialRemoveBtn) {
            initialRemoveBtn.addEventListener('click', function() {
                this.closest('.input-with-action').remove();
            });
        }

        panel.querySelector('#config-selector').addEventListener('change', function() {
            const configName = this.value;
            if (configName) {
                loadConfigToPanel(configName, panel);
                GM_setValue('currentConfig', configName);
            }
        });

        panel.querySelector('#save-config').addEventListener('click', function() {
            const configName = panel.querySelector('#config-name').value.trim();
            if (!configName) {
                updateConfigStatus('请输入配置名称', 'error', panel);
                return;
            }
            saveConfigFromPanel(configName, panel);
            updateConfigStatus(`配置 "${configName}" 已保存`, 'success', panel);
            loadConfigList(panel);
            refreshButtons();
        });

        panel.querySelector('#delete-config').addEventListener('click', function() {
            const configName = panel.querySelector('#config-selector').value;
            if (!configName) {
                updateConfigStatus('请选择要删除的配置', 'error', panel);
                return;
            }
            deleteConfig(configName);
            updateConfigStatus(`配置 "${configName}" 已删除`, 'success', panel);
            loadConfigList(panel);
            refreshButtons();
        });

        panel.querySelector('#manage-buttons').addEventListener('click', function() {
            showButtonConfigPanel();
        });

        // 新增：导入导出按钮事件
        panel.querySelector('#import-export-btn').addEventListener('click', function() {
            showImportExportPanel();
        });

        const actionTypeSelect = panel.querySelector('#action-type-select');
        const emitKeyContainer = panel.querySelector('#emit-key-container');
        const selectorsContainer = panel.querySelector('#selectors-container');
        const contentRoot = panel.querySelector('.panel-content');
        try {
            if (emitKeyContainer && contentRoot) {
                const actionGroup = emitKeyContainer.closest('.config-group');
                if (actionGroup) {
                    contentRoot.insertBefore(actionGroup, contentRoot.firstChild);
                }
            }
            const configSelectorEl = panel.querySelector('#config-selector');
            const configManageGroup = panel.querySelector('#save-config')?.closest('.config-group');
            const configHeader = configManageGroup?.querySelector('.group-header');
            if (configSelectorEl && configManageGroup && configHeader) {
                configHeader.insertAdjacentElement('afterend', configSelectorEl);
            }
        } catch (e) {}

        if (actionTypeSelect && emitKeyContainer) {
            actionTypeSelect.addEventListener('change', function() {
                emitKeyContainer.style.display = this.value === 'keypress' ? '' : 'none';
                try {
                    const selectorsGroup = selectorsContainer?.closest('.config-group');
                    if (selectorsGroup) selectorsGroup.style.display = this.value === 'click' ? '' : 'none';
                } catch (e) {}
            });
            const savedConfigs = GM_getValue('savedConfigs') || {};
            const currentName = GM_getValue('currentConfig') || 'default';
            const cfg = savedConfigs[currentName] || {};
            const action = cfg.actionType || 'click';
            const isKey = action === 'keypress';
            emitKeyContainer.style.display = isKey ? '' : 'none';
            try {
                const selectorsGroup = selectorsContainer?.closest('.config-group');
                if (selectorsGroup) selectorsGroup.style.display = action === 'click' ? '' : 'none';
            } catch (e) {}
        }
    }

    function setupButtonConfigListeners(panel) {
        panel.querySelector('#add-button').addEventListener('click', function() {
            const newButtonId = 'button_' + Date.now();
            const buttonConfig = GM_getValue('buttonConfig');
            const savedConfigs = GM_getValue('savedConfigs');
            const configNames = Object.keys(savedConfigs);
            const defaultConfigName = configNames.length > 0 ? configNames[0] : 'default';
            const currentUrl = getCurrentURLInfo();

            buttonConfig.buttons.push({
                id: newButtonId,
                name: defaultConfigName,
                configName: defaultConfigName,
                visible: true,
                locked: false, // 新增按钮默认未锁定
                position: { x: 20, y: 20 + buttonConfig.buttons.length * 50 },
                domains: [currentUrl.hostname]
            });
            GM_setValue('buttonConfig', buttonConfig);
            loadButtonConfigList(panel);
            refreshButtons();
        });

        panel.querySelector('#save-buttons-config').addEventListener('click', function() {
            saveButtonConfig(panel);
            updateButtonConfigStatus('按钮配置已保存', 'success', panel);
            refreshButtons();
        });

        panel.querySelector('#back-to-main').addEventListener('click', function() {
            showMainConfigPanel();
        });

        const sizeSlider = panel.querySelector('#button-size-slider');
        const sizeValue = panel.querySelector('#size-value');
        sizeSlider.addEventListener('input', function() {
            sizeValue.textContent = this.value + 'px';
            const buttonConfig = GM_getValue('buttonConfig');
            buttonConfig.buttonSize = parseInt(this.value);
            GM_setValue('buttonConfig', buttonConfig);
        });
    }

    function loadButtonConfigList(panel) {
        const container = panel.querySelector('#buttons-container');
        container.innerHTML = '';

        const buttonConfig = GM_getValue('buttonConfig');
        const savedConfigs = GM_getValue('savedConfigs');
        const configNames = Object.keys(savedConfigs);

        buttonConfig.buttons.forEach((button, index) => {
            const config = savedConfigs[button.configName];
            const domainsText = button.domains && button.domains.length > 0 ?
                  button.domains.join(', ') : '所有域名';
            const lockedText = button.locked ? ' (已锁定)' : '';

            const buttonItem = document.createElement('div');
            buttonItem.className = 'button-item';

            buttonItem.innerHTML = `
                <div class="button-preview">${button.showIcon !== false ? (config?.icon || '✨') : ''}</div>
                <div class="button-info">
                    <div class="button-name">${button.configName}${lockedText}</div>
                    <div class="button-details">
                        <span class="button-icon">${config?.icon || '✨'}</span>
                        <span class="button-domains">${domainsText}</span>
                    </div>
                </div>
                <div class="button-settings">
                    <select class="config-select" data-index="${index}">
                        ${configNames.map(name =>
                                          `<option value="${name}" ${name === button.configName ? 'selected' : ''}>${name}</option>`
                                         ).join('')}
                    </select>
                    <button class="lock-btn ${button.locked ? 'locked' : ''}" data-index="${index}" title="${button.locked ? '已锁定' : '未锁定'}">
                        ${button.locked ? '🔒' : '🔓'}
                    </button>
                    <button class="action-btn domain-btn" data-index="${index}" title="设置域名">🌐</button>
                    <button class="action-btn icon-toggle-btn" data-index="${index}" title="${button.showIcon !== false ? '隐藏图标' : '显示图标'}">✦</button>
                    <button class="action-btn button-visibility ${button.visible ? 'visible' : 'hidden'}" data-index="${index}" title="${button.visible ? '隐藏按钮' : '显示按钮'}">✿</button>
                    <button class="action-btn remove-btn" data-index="${index}">−</button>
                </div>
            `;
            container.appendChild(buttonItem);

            const configSelect = buttonItem.querySelector('.config-select');
            configSelect.addEventListener('change', function() {
                buttonConfig.buttons[this.dataset.index].configName = this.value;
                buttonConfig.buttons[this.dataset.index].name = this.value;
                GM_setValue('buttonConfig', buttonConfig);
                const config = savedConfigs[this.value];
                const nameDisplay = buttonItem.querySelector('.button-name');
                const iconDisplay = buttonItem.querySelector('.button-preview');
                const iconText = buttonItem.querySelector('.button-icon');
                const lockedText = buttonConfig.buttons[this.dataset.index].locked ? ' (已锁定)' : '';
                nameDisplay.textContent = this.value + lockedText;
                iconDisplay.textContent = config?.icon || '✨';
                iconText.textContent = `图标: ${config?.icon || '✨'}`;
            });

            // 新增：锁定按钮事件
            const lockBtn = buttonItem.querySelector('.lock-btn');
            lockBtn.addEventListener('click', function() {
                const idx = this.dataset.index;
                buttonConfig.buttons[idx].locked = !buttonConfig.buttons[idx].locked;
                GM_setValue('buttonConfig', buttonConfig);

                // 更新按钮样式
                if (buttonConfig.buttons[idx].locked) {
                    this.classList.add('locked');
                    this.innerHTML = '🔒';
                    this.title = '已锁定';
                } else {
                    this.classList.remove('locked');
                    this.innerHTML = '🔓';
                    this.title = '未锁定';
                }

                // 更新名称显示
                const nameDisplay = buttonItem.querySelector('.button-name');
                const lockedText = buttonConfig.buttons[idx].locked ? ' (已锁定)' : '';
                nameDisplay.textContent = buttonConfig.buttons[idx].configName + lockedText;

                // 刷新实际显示的按钮
                refreshButtons();
            });

            const domainBtn = buttonItem.querySelector('.domain-btn');
            domainBtn.addEventListener('click', function() {
                showDomainSettings(button, this.dataset.index, buttonItem);
            });

            // 新增：图标显示/隐藏按钮事件
            const iconToggleBtn = buttonItem.querySelector('.icon-toggle-btn');
            // 初始化时如果已隐藏图标，添加 icon-hidden class
            if (button.showIcon === false) {
                iconToggleBtn.classList.add('icon-hidden');
            }
            iconToggleBtn.addEventListener('click', function() {
                const idx = this.dataset.index;
                buttonConfig.buttons[idx].showIcon = !buttonConfig.buttons[idx].showIcon;
                GM_setValue('buttonConfig', buttonConfig);

                // 更新按钮标题和预览
                const preview = buttonItem.querySelector('.button-preview');
                const config = savedConfigs[buttonConfig.buttons[idx].configName];
                preview.textContent = buttonConfig.buttons[idx].showIcon ? (config?.icon || '✨') : '';

                this.title = buttonConfig.buttons[idx].showIcon ? '隐藏图标' : '显示图标';

                // 切换 icon-hidden class
                if (buttonConfig.buttons[idx].showIcon) {
                    this.classList.remove('icon-hidden');
                } else {
                    this.classList.add('icon-hidden');
                }

                // 刷新实际显示的按钮
                refreshButtons();
            });

            const checkbox = buttonItem.querySelector('.button-visibility');
            checkbox.addEventListener('click', function() {
                const idx = this.dataset.index;
                buttonConfig.buttons[idx].visible = !buttonConfig.buttons[idx].visible;
                GM_setValue('buttonConfig', buttonConfig);

                // 切换样式
                if (buttonConfig.buttons[idx].visible) {
                    this.classList.remove('hidden');
                    this.classList.add('visible');
                    this.title = '隐藏按钮';
                } else {
                    this.classList.remove('visible');
                    this.classList.add('hidden');
                    this.title = '显示按钮';
                }

                // 刷新实际显示的按钮
                refreshButtons();
            });

            const removeBtn = buttonItem.querySelector('.remove-btn');
            removeBtn.addEventListener('click', function() {
                buttonConfig.buttons.splice(this.dataset.index, 1);
                GM_setValue('buttonConfig', buttonConfig);
                loadButtonConfigList(panel);
                refreshButtons();
            });
        });

        const sizeSlider = panel.querySelector('#button-size-slider');
        const sizeValue = panel.querySelector('#size-value');
        const buttonConfigData = GM_getValue('buttonConfig');
        sizeSlider.value = buttonConfigData.buttonSize || 36;
        sizeValue.textContent = (buttonConfigData.buttonSize || 36) + 'px';
    }

    function showDomainSettings(button, index, buttonItem) {
        const domainPanel = document.createElement('div');
        domainPanel.className = 'domain-panel';
        domainPanel.innerHTML = `
            <div class="domain-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 10002; display: flex; align-items: center; justify-content: center; transition: none !important; animation: none !important;">
                <div class="domain-container" style="position: relative; transition: none !important; animation: none !important;">
                    <div class="domain-header">
                        <div class="domain-title">设置显示域名</div>
                        <button class="domain-close">✕</button>
                    </div>
                    <div class="domain-content">
                    <div class="domain-input-group">
                        <input type="text" class="domain-input" placeholder="输入域名或URL..." value="">
                        <button class="domain-add-btn">+</button>
                    </div>
                    <div class="domain-examples">
    <div><strong>示例:</strong></div>
    <div>• example.com (整个域名)</div>
    <div>• sub.example.com (子域名)</div>
    <div>• example.com/path (特定路径)</div>
    <div>• example.com/path/* (路径及其子路径)</div>
    <div>• example.com/*/api/* (多层通配符)</div>
    <div>• /example\\.com\\/path.*/ (正则表达式)</div>
    <div>• * (所有域名)</div>
</div>
                    <div class="domain-list" id="domain-list-${index}">
                        ${button.domains ? button.domains.map(domain => `
                            <div class="domain-tag">
                                ${domain}
                                <span class="domain-tag-remove" data-domain="${domain}">×</span>
                            </div>
                        `).join('') : ''}
                    </div>
                        <div class="domain-actions">
                            <button class="fancy-btn primary" id="save-domains-${index}">保存</button>
                            <button class="fancy-btn secondary" id="add-current-${index}">添加当前页面</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(domainPanel);

        const domainInput = domainPanel.querySelector('.domain-input');
        const domainAddBtn = domainPanel.querySelector('.domain-add-btn');
        const domainList = domainPanel.querySelector(`#domain-list-${index}`);
        const saveBtn = domainPanel.querySelector(`#save-domains-${index}`);
        const addCurrentBtn = domainPanel.querySelector(`#add-current-${index}`);
        const closeBtn = domainPanel.querySelector('.domain-close');
        const overlay = domainPanel.querySelector('.domain-overlay');
        const domainContainerEl = domainPanel.querySelector('.domain-container');
        if (domainContainerEl) {
            domainContainerEl.addEventListener('click', function(e) { e.stopPropagation(); });
        }

        let domains = [...(button.domains || [])];

        function updateDomainList() {
            domainList.innerHTML = domains.map(domain => `
                <div class="domain-tag">
                    ${domain}
                    <span class="domain-tag-remove" data-domain="${domain}">×</span>
                </div>
            `).join('');

            domainList.querySelectorAll('.domain-tag-remove').forEach(removeBtn => {
                removeBtn.addEventListener('click', function() {
                    const domainToRemove = this.dataset.domain;
                    domains = domains.filter(d => d !== domainToRemove);
                    updateDomainList();
                });
            });
        }

        domainAddBtn.addEventListener('click', function() {
            const domain = domainInput.value.trim();
            if (domain && !domains.includes(domain)) {
                domains.push(domain);
                domainInput.value = '';
                updateDomainList();
            }
        });

        addCurrentBtn.addEventListener('click', function() {
            const currentUrl = getCurrentURLInfo();
            const currentDomain = currentUrl.hostname + currentUrl.pathname;
            if (!domains.includes(currentDomain)) {
                domains.push(currentDomain);
                updateDomainList();
            }
        });

        saveBtn.addEventListener('click', function() {
            const buttonConfig = GM_getValue('buttonConfig');
            buttonConfig.buttons[index].domains = domains;
            GM_setValue('buttonConfig', buttonConfig);

            const domainsText = domains.length > 0 ? domains.join(', ') : '所有域名';
            const domainsDisplay = buttonItem.querySelector('.button-domains');
            domainsDisplay.textContent = `显示在: ${domainsText}`;

            domainPanel.remove();
            refreshButtons();
        });

        closeBtn.addEventListener('click', function() {
            domainPanel.remove();
        });

        overlay.addEventListener('click', function() {
            domainPanel.remove();
        });

        domainInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                domainAddBtn.click();
            }
        });

        updateDomainList();
    }

    function getExportJSON() {
        const savedConfigs = GM_getValue('savedConfigs') || {};
        const buttonConfig = GM_getValue('buttonConfig') || {};
        const currentConfig = GM_getValue('currentConfig') || 'default';
        const payload = {
            meta: { name: '自动点击器', version: '1.5', exportedAt: new Date().toISOString() },
            savedConfigs,
            buttonConfig,
            currentConfig
        };
        return JSON.stringify(payload, null, 2);
    }

    function applyImportJSON(jsonText) {
        try {
            const obj = JSON.parse(jsonText);
            if (!obj || typeof obj !== 'object') throw new Error('格式错误');
            if (!obj.savedConfigs || !obj.buttonConfig) throw new Error('缺少必要字段');
            GM_setValue('savedConfigs', obj.savedConfigs);
            GM_setValue('buttonConfig', obj.buttonConfig);
            if (obj.currentConfig) GM_setValue('currentConfig', obj.currentConfig);
            refreshButtons();
            showNotification('配置已导入', 'success');
            return { success: true, message: '配置已成功导入' };
        } catch (e) {
            console.error('导入失败:', e);
            return { success: false, message: '导入失败: ' + e.message };
        }
    }

    function showImportExportPanel() {
        const panel = document.createElement('div');
        panel.className = 'import-export-panel';

        panel.innerHTML = `
            <div class="import-export-overlay">
                <div class="import-export-container">
                    <div class="import-export-header">
                        <div>导入/导出配置</div>
                        <button class="import-export-close">✕</button>
                    </div>
                    <div class="import-export-content">
                        <div class="import-export-options">
                            <button class="option-btn active" data-mode="export">
                                <span class="btn-icon">📤</span>
                                导出配置
                            </button>
                            <button class="option-btn" data-mode="import">
                                <span class="btn-icon">📥</span>
                                导入配置
                            </button>
                        </div>

                        <div class="textarea-container">
                            <textarea id="import-export-text" placeholder="在此处粘贴要导入的配置，或查看导出的配置..."></textarea>
                            <div class="textarea-actions" id="export-actions" style="display: flex;">
                                <button class="fancy-btn copy-btn" id="copy-configs">
                                    <span class="btn-icon">📋</span>
                                    复制到剪贴板
                                </button>
                                <button class="fancy-btn download-btn" id="download-configs">
                                    <span class="btn-icon">💾</span>
                                    下载JSON文件
                                </button>
                            </div>
                            <div class="textarea-actions" id="import-actions" style="display: none;">
                                <button class="fancy-btn apply-btn" id="apply-import">
                                    <span class="btn-icon">✅</span>
                                    应用导入配置
                                </button>
                            </div>
                            <div id="status-indicator" class="status-indicator"></div>
                        </div>

                        <div class="action-group">
                            <button class="fancy-btn secondary" id="close-import-export">
                                <span class="btn-icon">←</span>
                                返回
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        const overlay = panel.querySelector('.import-export-overlay');
        const container = panel.querySelector('.import-export-container');
        const closeBtn = panel.querySelector('.import-export-close');
        const backBtn = panel.querySelector('#close-import-export');
        const textarea = panel.querySelector('#import-export-text');
        const exportActions = panel.querySelector('#export-actions');
        const importActions = panel.querySelector('#import-actions');
        const statusIndicator = panel.querySelector('#status-indicator');

        // 设置初始模式为导出
        let currentMode = 'export';
        textarea.value = getExportJSON();

        container.addEventListener('click', function(e) { e.stopPropagation(); });
        overlay.addEventListener('click', function() { panel.remove(); });
        closeBtn.addEventListener('click', function() { panel.remove(); });
        backBtn.addEventListener('click', function() { panel.remove(); });

        // 模式切换按钮
        panel.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const mode = this.dataset.mode;
                if (mode === currentMode) return;

                currentMode = mode;

                // 更新按钮状态
                panel.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // 切换显示内容
                if (mode === 'export') {
                    textarea.value = getExportJSON();
                    exportActions.style.display = 'flex';
                    importActions.style.display = 'none';
                    textarea.placeholder = '这是导出的配置JSON，可以复制或下载...';
                    statusIndicator.textContent = '';
                } else {
                    textarea.value = '';
                    exportActions.style.display = 'none';
                    importActions.style.display = 'flex';
                    textarea.placeholder = '在此处粘贴要导入的配置JSON...';
                    statusIndicator.textContent = '';
                }
            });
        });

        // 导出功能
        const copyBtn = panel.querySelector('#copy-configs');
        const downloadBtn = panel.querySelector('#download-configs');

        copyBtn.addEventListener('click', async function() {
            try {
                await navigator.clipboard.writeText(textarea.value);
                statusIndicator.textContent = '✓ 已复制到剪贴板';
                statusIndicator.className = 'status-indicator success';
                setTimeout(() => {
                    statusIndicator.textContent = '';
                    statusIndicator.className = 'status-indicator';
                }, 2000);
            } catch (e) {
                statusIndicator.textContent = '✗ 复制失败，请手动复制';
                statusIndicator.className = 'status-indicator error';
                console.error('复制失败:', e);
            }
        });

        downloadBtn.addEventListener('click', function() {
            const blob = new Blob([textarea.value], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `auto-clicker-config-${new Date().toISOString().slice(0,10)}.json`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            statusIndicator.textContent = '✓ 文件下载已开始';
            statusIndicator.className = 'status-indicator success';
            setTimeout(() => {
                statusIndicator.textContent = '';
                statusIndicator.className = 'status-indicator';
            }, 2000);
        });

        // 导入功能
        const applyBtn = panel.querySelector('#apply-import');
        applyBtn.addEventListener('click', function() {
            if (!textarea.value.trim()) {
                statusIndicator.textContent = '✗ 请输入要导入的配置';
                statusIndicator.className = 'status-indicator error';
                return;
            }

            const result = applyImportJSON(textarea.value);
            if (result.success) {
                statusIndicator.textContent = '✓ ' + result.message;
                statusIndicator.className = 'status-indicator success';
                setTimeout(() => {
                    panel.remove();
                }, 1500);
            } else {
                statusIndicator.textContent = '✗ ' + result.message;
                statusIndicator.className = 'status-indicator error';
            }
        });

        // 文本区域变化检测
        textarea.addEventListener('input', function() {
            if (currentMode === 'import') {
                try {
                    JSON.parse(this.value);
                    statusIndicator.textContent = '✓ JSON格式正确';
                    statusIndicator.className = 'status-indicator success';
                } catch (e) {
                    statusIndicator.textContent = '✗ JSON格式错误';
                    statusIndicator.className = 'status-indicator error';
                }
            }
        });
    }

    function saveButtonConfig(panel) {
        const buttonConfig = GM_getValue('buttonConfig');
        buttonConfig.buttonSize = parseInt(panel.querySelector('#button-size-slider').value);
        GM_setValue('buttonConfig', buttonConfig);
    }

    function updateButtonConfigStatus(message, type, panel) {
        const statusEl = panel.querySelector('#button-status');
        statusEl.textContent = message;
        statusEl.className = 'status-message';
        if (type === 'error') {
            statusEl.style.background = '#fed7d7';
            statusEl.style.color = '#c53030';
        } else if (type === 'success') {
            statusEl.style.background = '#c6f6d5';
            statusEl.style.color = '#276749';
        }
    }

    function refreshButtons() {
        document.querySelectorAll('[id^="auto-clicker-btn-"]').forEach(btn => btn.remove());
        createActionButtons();
    }

    function updateConfigStatus(message, type, panel) {
        const statusEl = panel.querySelector('#status');
        statusEl.textContent = message;
        statusEl.className = 'status-message';
        if (type === 'error') {
            statusEl.style.background = '#fed7d7';
            statusEl.style.color = '#c53030';
        } else if (type === 'success') {
            statusEl.style.background = '#c6f6d5';
            statusEl.style.color = '#276749';
        }
    }

    function saveConfigFromPanel(name, panel) {
        const selectors = Array.from(panel.querySelectorAll('.selector-input'))
        .map(input => input.value.trim())
        .filter(selector => selector !== '');

        const interval = panel.querySelector('#interval-input').value;
        const repeat = panel.querySelector('#repeat-input').value;
        const icon = panel.querySelector('#icon-input').value || '✨';
        const hotkey = (panel.querySelector('#hotkey-input') && panel.querySelector('#hotkey-input').value.trim()) || '';
        const actionType = (panel.querySelector('#action-type-select') && panel.querySelector('#action-type-select').value) || 'click';
        const emitKey = (panel.querySelector('#emit-key-input') && panel.querySelector('#emit-key-input').value.trim()) || '';
        const emitCtrl = !!(panel.querySelector('#emit-ctrl') && panel.querySelector('#emit-ctrl').checked);
        const emitShift = !!(panel.querySelector('#emit-shift') && panel.querySelector('#emit-shift').checked);
        const emitAlt = !!(panel.querySelector('#emit-alt') && panel.querySelector('#emit-alt').checked);
        const emitMeta = !!(panel.querySelector('#emit-meta') && panel.querySelector('#emit-meta').checked);

        const config = {
            selectors,
            interval: parseInt(interval) || 1000,
            repeat: parseInt(repeat) || 1,
            icon: icon,
            hotkey: hotkey,
            actionType: actionType,
            emitKey: emitKey,
            emitCtrl: emitCtrl,
            emitShift: emitShift,
            emitAlt: emitAlt,
            emitMeta: emitMeta,
            timestamp: new Date().toISOString()
        };

        const savedConfigs = GM_getValue('savedConfigs') || {};
        savedConfigs[name] = config;
        GM_setValue('savedConfigs', savedConfigs);

        panel.querySelector('#config-name').value = name;
        panel.querySelector('#config-selector').value = name;
        GM_setValue('currentConfig', name);
    }

    function loadConfigToPanel(name, panel) {
        const savedConfigs = GM_getValue('savedConfigs');
        const config = savedConfigs[name];
        if (!config) return;

        const container = panel.querySelector('#selectors-container');
        container.innerHTML = '';

        config.selectors.forEach(selector => {
            const newItem = document.createElement('div');
            newItem.className = 'input-with-action';
            newItem.innerHTML = `
                <input type="text" class="fancy-input selector-input" value="${selector}" placeholder="输入CSS选择器...">
                <button class="action-btn remove-btn">−</button>
            `;
            container.appendChild(newItem);

            newItem.querySelector('.remove-btn').addEventListener('click', function() {
                newItem.remove();
            });
        });

        if (config.selectors.length === 0) {
            const newItem = document.createElement('div');
            newItem.className = 'input-with-action';
            newItem.innerHTML = `
                <input type="text" class="fancy-input selector-input" placeholder="输入CSS选择器...">
                <button class="action-btn remove-btn">−</button>
            `;
            container.appendChild(newItem);

            newItem.querySelector('.remove-btn').addEventListener('click', function() {
                newItem.remove();
            });
        }

        panel.querySelector('#interval-input').value = config.interval;
        panel.querySelector('#repeat-input').value = config.repeat;
        panel.querySelector('#icon-input').value = config.icon || '✨';
        if (panel.querySelector('#hotkey-input')) {
            panel.querySelector('#hotkey-input').value = config.hotkey || '';
        }
        if (panel.querySelector('#action-type-select')) {
            panel.querySelector('#action-type-select').value = config.actionType || 'click';
        }
        if (panel.querySelector('#emit-key-input')) {
            panel.querySelector('#emit-key-input').value = config.emitKey || '';
        }
        if (panel.querySelector('#emit-ctrl')) {
            panel.querySelector('#emit-ctrl').checked = !!config.emitCtrl;
        }
        if (panel.querySelector('#emit-shift')) {
            panel.querySelector('#emit-shift').checked = !!config.emitShift;
        }
        if (panel.querySelector('#emit-alt')) {
            panel.querySelector('#emit-alt').checked = !!config.emitAlt;
        }
        if (panel.querySelector('#emit-meta')) {
            panel.querySelector('#emit-meta').checked = !!config.emitMeta;
        }
        panel.querySelector('#config-name').value = name;
    }

    function loadCurrentConfig(panel) {
        const currentConfigName = GM_getValue('currentConfig') || 'default';
        loadConfigToPanel(currentConfigName, panel);
        panel.querySelector('#config-selector').value = currentConfigName;
    }

    function deleteConfig(name) {
        const savedConfigs = GM_getValue('savedConfigs');
        if (savedConfigs && savedConfigs[name]) {
            delete savedConfigs[name];
            GM_setValue('savedConfigs', savedConfigs);
        }
    }

    function loadConfigList(panel) {
        const selector = panel.querySelector('#config-selector');
        selector.innerHTML = '<option value="">选择配置...</option>';

        const savedConfigs = GM_getValue('savedConfigs');
        if (savedConfigs) {
            Object.keys(savedConfigs).forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                selector.appendChild(option);
            });
        }

        const currentConfig = GM_getValue('currentConfig');
        if (currentConfig) {
            selector.value = currentConfig;
        }
    }

    function showMainConfigPanel() {
        showConfigPanel('main');
    }

    function showButtonConfigPanel() {
        showConfigPanel('buttons');
    }

    function getActiveHotkeyConfigs() {
        const buttonConfig = GM_getValue('buttonConfig');
        const names = [];
        buttonConfig.buttons.forEach(b => {
            if (b.visible && shouldShowButton(b)) {
                names.push(b.configName);
            }
        });
        return Array.from(new Set(names));
    }

    function setupHotkeys() {
        window.addEventListener('keydown', function(e) {
            const t = e.target;
            if (!t) return;
            const tag = t.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t.isContentEditable === true)) return;
            const keyPressed = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            const savedConfigs = GM_getValue('savedConfigs') || {};
            const activeNames = getActiveHotkeyConfigs();
            let handled = false;
            activeNames.forEach(name => {
                const cfg = savedConfigs[name];
                if (cfg && cfg.hotkey) {
                    const hk = cfg.hotkey.length === 1 ? cfg.hotkey.toLowerCase() : cfg.hotkey;
                    if (hk === keyPressed && !handled) {
                        executeClickActions(name);
                        handled = true;
                    }
                }
            });
            if (!handled) {
                const current = GM_getValue('currentConfig');
                const cfg = savedConfigs[current];
                if (cfg && cfg.hotkey) {
                    const hk = cfg.hotkey.length === 1 ? cfg.hotkey.toLowerCase() : cfg.hotkey;
                    if (hk === keyPressed) {
                        executeClickActions(current);
                    }
                }
            }
        });
    }

    // 初始化
    initConfig();
    createActionButtons();
    setupHotkeys();
})();
