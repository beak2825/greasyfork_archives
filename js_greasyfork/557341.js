// ==UserScript==
// @name         Cookie终极复制工具完美版
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  功能强大的Cookie复制工具，提供双重复制api(主要为适配移动端)、支持窗口拖拽缩放与位置记忆、自定义快捷键、单个Cookie独立复制，采用菜单项设计，并对复杂DOM环境及内嵌网页下的兼容性进行了深度优化。
// @author       wqzhello
// @license      MIT; https://opensource.org/licenses/MIT
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTQiIGZpbGw9IiNGRjdDMDAiIHN0cm9rZT0iI0ZGN0MwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjIiIGZpbGw9IndoaXRlIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMTIiIHI9IjIiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMSAxOEMxMSAxOCAxNCAyMSAxNiAyMUMxOCAyMSAyMSAxOCAyMSAxOCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+Cg==
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557341/Cookie%E7%BB%88%E6%9E%81%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7%E5%AE%8C%E7%BE%8E%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/557341/Cookie%E7%BB%88%E6%9E%81%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7%E5%AE%8C%E7%BE%8E%E7%89%88.meta.js
// ==/UserScript==

// 全局变量管理
let currentContainer = null;
let currentResizeObserver = null;
let currentEscListener = null;

// 定义全局变量主容器坐标初始值
const minTop = window.minTop || 5;
const minLeft = window.minLeft || 5;

//定义全部cookie显示框容器初始高度
const pricH = () =>`${20.2}vh`;

//设置主容器初始数值
const priL = () => `${minLeft}px`;
const priT = () => `${minTop}px`;

// CSS值转数字转义函数 添加缓存机制
const cssValueCache = new Map();
function cssValueToNumber(cssValue) {
    // 缓存检查
    if (cssValueCache.has(cssValue)) {
        return cssValueCache.get(cssValue);
    }

    if (typeof cssValue === 'number') return cssValue;
    if (typeof cssValue !== 'string') return 0;

    let result = 0;
    const numericValue = parseFloat(cssValue);

    if (cssValue.includes('px')) {
        result = numericValue;
    } else if (cssValue.includes('vw')) {
        result = (numericValue / 100) * window.innerWidth;
    } else if (cssValue.includes('vh')) {
        result = (numericValue / 100) * window.innerHeight;
    } else {
        result = numericValue;
    }

    // 存入缓存
    cssValueCache.set(cssValue, result);
    return result;
}

// 缓存计算结果
let cachedPriW = null;
let cachedPriH = null;

// 计算取最小初始宽 适配移动端
const priW = () => {
    if (cachedPriW) return cachedPriW; // 使用缓存
    const vwValue = 96;
    const pxValue = 506.88;
    const vwInPx = (vwValue / 100) * window.innerWidth;
    cachedPriW = vwInPx < pxValue ? `${vwValue}vw` : `${pxValue}px`;
    return cachedPriW;
};

// 计算取最小初始高
const priH = () => {
    if (cachedPriH) return cachedPriH; // 使用缓存
    const vhValue = 98;
    const pxValue = 671;
    const vhInPx = (vhValue / 100) * window.innerHeight;
    cachedPriH = vhInPx < pxValue ? `${vhValue}vh` : `${pxValue}px`;
    return cachedPriH;
};

// 监听窗口尺寸变化，清除缓存
window.addEventListener('resize', () => {
    cachedPriW = null;
    cachedPriH = null;
});

const primaxW = () => `${98.2}vw`;
const primaxH = () => `${98.2}vh`;

// 动态最小宽度：取初始宽度和设定最小宽度的最小值
const priminW = () => {
    const initialWidth = cssValueToNumber(priW());
    const staticMinWidth = 312+1;
    const dynamicMinWidth = Math.min(initialWidth, staticMinWidth);
    return `${dynamicMinWidth-1}px`;//留出冗余
};

// 动态最小高度：取初始高度和设定最小高度的最小值
const priminH = () => {
    const initialHeight = cssValueToNumber(priH());
    const staticMinHeight = 356+1;
    const dynamicMinHeight = Math.min(initialHeight, staticMinHeight);
    return `${dynamicMinHeight-1}px`;
};

//设置“全部复制”、“手动选中”按钮初始数值
const buttonW = () => `${104}px`;

// 快捷键配置管理 在主函数前注册
const ShortcutManager = {
    // 默认快捷键
    defaultShortcut: 'Ctrl+Alt+C',

    // 获取当前快捷键
    getCurrentShortcut() {
        return GM_getValue('cookie_shortcut', this.defaultShortcut);
    },

    // 设置新快捷键
    setShortcut(newShortcut) {
        GM_setValue('cookie_shortcut', newShortcut);
    },

    // 解析快捷键字符串为事件对象
    parseShortcut(shortcutStr) {
        const parts = shortcutStr.split('+');
        const result = {
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            key: ''
        };

        parts.forEach(part => {
            const lowerPart = part.toLowerCase();
            if (lowerPart === 'ctrl') result.ctrlKey = true;
            else if (lowerPart === 'shift') result.shiftKey = true;
            else if (lowerPart === 'alt') result.altKey = true;
            else result.key = part.toUpperCase(); // 按键字符
        });

        return result;
    },

    // 检查按键是否匹配快捷键
    isShortcutMatch(e, shortcutConfig) {
        return e.ctrlKey === shortcutConfig.ctrlKey &&
               e.shiftKey === shortcutConfig.shiftKey &&
               e.altKey === shortcutConfig.altKey &&
               e.key.toUpperCase() === shortcutConfig.key;
    }
};

// 面板位置记忆管理：记忆函数大全
const PositionMemory = {
    //获取记忆状态函数
    isEnabled: () => GM_getValue('position_memory_enabled', true),
    //设置切换记忆状态函数
    toggleEnabled: () => {
        const current = PositionMemory.isEnabled();
        GM_setValue('position_memory_enabled', !current);
    },
    //设置位置信息函数
    setPosition: (position) => {
        // 关键修改：直接检查记忆状态，而不是等待参数
        if (PositionMemory.isEnabled()== true) {
            GM_setValue('container_position', position);
        }
    },
    getPosition:() => GM_getValue('container_position', null),
    // 显示框高度记忆
    setDisplayDivHeight: (height) => {
        if (PositionMemory.isEnabled() == true) {
            GM_setValue('display_div_height', height);
        }
    },
    getDisplayDivHeight: () => GM_getValue('display_div_height', null)
};

(function() {
    'use strict';

    // 原方案：内嵌网页屏蔽
    if (window.self !== window.top) {
        return;
    }

    // 防止重复初始化
    if (window.cookieToolInitialized) {
        return;
    }
    window.cookieToolInitialized = true;

    // CSS 样式初始化 (移至顶部，只执行一次)
    if (!document.getElementById('cookie-tool-styles')) {
        const style = document.createElement('style');
        style.id = 'cookie-tool-styles';
        style.textContent = `
            /* 显示框内的 cookie 名称样式 */
            .cookie-display-div strong,
            .cookie-display-div .cookie-name-bold {
                font-weight: bold !important;
                color: #856404 !important;
            }
            /* 整个容器内的 cookie 名称样式 */
            #cookie-copy-container strong,
            #cookie-copy-container .cookie-name-bold {
                font-weight: bold !important;
            }
            /* 网格模块内的 cookie 名称样式 */
            #cookie-copy-container .cookie-name-bold {
                color: #333 !important;
            }

            /* 统一滚动条样式 */
            #cookie-copy-container,
            #cookie-copy-container * {
                /* Firefox 样式 */
                scrollbar-width: thin !important;
                scrollbar-color: rgba(136, 136, 136, 0.5) transparent !important;
            }

            /* 统一隐藏所有WebKit滚动条 - 更简洁的选择器 */
            #cookie-copy-container ::-webkit-scrollbar {
                width: 0px !important;
                height: 0px !important;
                display: none !important;
            }

            /* 确保所有滚动区域功能正常 */
            .cookie-display-div,
            .modules-container {
                overflow: auto !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 保存位置函数
    function saveContainerPosition() {
        if (!currentContainer) return;

        const rect = currentContainer.getBoundingClientRect();
        // 获取Cookie显示框的高度
        const displayDiv = document.querySelector('.cookie-display-div');
        const displayDivHeight = displayDiv ? displayDiv.offsetHeight : null;

        const position = {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
            displayDivHeight: displayDivHeight, // 保存Cookie显示框高度
            timestamp: Date.now()
        };
        //保存位置
        PositionMemory.setPosition(position);
    }

    // 重置位置函数
    function resetContainerPosition() {
        if (!currentContainer) return;

        // 获取CSS值 - 这方法比获取位置准确
        const leftCss = priL();
        const topCss = priT();
        const widthCss = priW();
        const heightCss = priH();

        // 应用新位置到DOM
        currentContainer.style.left = leftCss;
        currentContainer.style.top = topCss;
        currentContainer.style.width = widthCss;
        currentContainer.style.height = heightCss;

        // 重置Cookie显示框高度
        const displayDiv = currentContainer.querySelector('.cookie-display-div');
        if (displayDiv) {
            displayDiv.style.height = pricH(); // 恢复到初始高度
        }

        // 转换为数字保存
        const position = {
            left: cssValueToNumber(leftCss),
            top: cssValueToNumber(topCss),
            width: cssValueToNumber(widthCss)+8,//补偿法要加回去
            height: cssValueToNumber(heightCss)+8,
            displayDivHeight: cssValueToNumber('20vh'), // 保存重置后的高度
            timestamp: Date.now()
        };

        // 保存重置后的位置
        GM_setValue('container_position', position);
    }

    // 注册菜单命令
    const currentShortcut = ShortcutManager.getCurrentShortcut();
    const menuText = currentShortcut ? `🍪 显示Cookie(${currentShortcut})` : '🍪 显示Cookie';
    GM_registerMenuCommand(menuText, showCookieInterface);
    GM_registerMenuCommand('⚙️ 设置快捷键', showShortcutSettings);

    // 更新油猴菜单项文字的函数
    function updateMenuText() {
        const currentShortcut = ShortcutManager.getCurrentShortcut();
        // 显示临时消息
        showTempMessage(`快捷键已更新: ${currentShortcut || '无快捷键'}。菜单文字将在刷新后更新`);
    }

    // 快捷键关闭函数
    function toggleCookieInterface() {
        const existingContainer = document.getElementById('cookie-copy-container');
        if (existingContainer) {
            // 如果界面存在，则关闭
            cleanup();
        }
        else {
            showCookieInterface();
        }
    }

    // 全局快捷键监听器
    let currentShortcutListener = null;

    // 快捷键监听函数window级监听增强版
    function setupKeyboardShortcut() {

        // 移除旧的监听器
        if (currentShortcutListener) {
            window.removeEventListener('keydown', currentShortcutListener, true);
        }

        // 创建新的监听器
        currentShortcutListener = function(e) {

            // 【关键修复代码开始】
            const shortcutInput = document.getElementById('shortcut-input');

            // 逻辑：如果快捷键设置输入框存在，并且它是当前激活的元素，则退出。
            // 这将阻止全局快捷键捕获事件，让输入框可以处理按键。
            if (shortcutInput && document.activeElement === shortcutInput) {
                return;
            }
            // 【关键修复代码结束】

            const currentShortcut = ShortcutManager.getCurrentShortcut();
            if (!currentShortcut) return;

            const shortcutConfig = ShortcutManager.parseShortcut(currentShortcut);

            if (ShortcutManager.isShortcutMatch(e, shortcutConfig)) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                toggleCookieInterface();
            }
        };

        // 在 window 上使用捕获阶段
        window.addEventListener('keydown', currentShortcutListener, true);
    }

    // 初始化快捷键
    setupKeyboardShortcut();

    // 快捷键格式验证函数
    function isValidShortcut(shortcut) {
        // 允许空字符串（无快捷键）
        if (shortcut === '') {
            return true;
        }

        // 非空时验证格式
        const parts = shortcut.split('+');
        if (parts.length < 2) return false;

        const hasModifier = parts.some(part =>
            ['Ctrl', 'Shift', 'Alt'].includes(part)
        );
        const hasMainKey = parts.some(part =>
            !['Ctrl', 'Shift', 'Alt'].includes(part) && part.length === 1
        );

        return hasModifier && hasMainKey;
    }

    //比比谁更高吧：设置容器层级
    const maxlevel = 2147483640;
    const max2level = maxlevel - 1;
    const max3level = maxlevel - 2;

    // 显示临时消息的函数
    function showTempMessage(message) {
        const msgElement = document.createElement('div');
        // // 根据消息内容决定背景色
        // const isMemoryEnabled = message.includes('已开启');
        // const backgroundColor = isMemoryEnabled ? '#28a745' : '#dc3545'; // 开启绿色，关闭红色

        // 更精确的颜色判断逻辑
        let backgroundColor;
        if (message.includes('已开启') || message.includes('已更新')) {
            backgroundColor = '#28a745'; // 绿色 - 记忆开启
        } else if (message.includes('已关闭')) {
            backgroundColor = '#dc3545'; // 红色 - 记忆关闭或位置还原
        } else {
            backgroundColor = '#1d4ed8'; // 蓝色 - 其他消息（如复制成功等）
        }
        //else if (message.includes('已还原')) {
        //     backgroundColor = '#ffc107'; // 黄色 - 位置还原
        // }

        msgElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${backgroundColor}; // 动态背景色 //原#28a745;
            color: white;
            padding: 10px 15px;
            border-radius: 4px;
            z-index: ${maxlevel};
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
            font-size: 14px;
            letter-spacing: 1.2px;  // 添加字间距
    `;
    msgElement.textContent = message;
    document.body.appendChild(msgElement);

    // 消失计时器
    setTimeout(() => {
        if (msgElement.parentNode) {
            msgElement.parentNode.removeChild(msgElement);
        }
    }, 1000);
}

    // 快捷键设置界面
    function showShortcutSettings() {

        // 清理可能存在的设置界面
        const existingSettings = document.getElementById('cookie-shortcut-settings');
        if (existingSettings) {
            existingSettings.remove();
        }

        const currentShortcut = ShortcutManager.getCurrentShortcut();

        //快捷键设置页面
        const settingsOverlay = document.createElement('div');
        settingsOverlay.id = 'cookie-shortcut-settings';
        settingsOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.5);
            z-index: ${maxlevel};
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const settingsPanel = document.createElement('div');
        settingsPanel.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            min-width: 300px;
            max-width: 90vw;
            display: flex;
            flex-direction: column;
            z-index: ${maxlevel};
            gap: 15px;
            align-items: center;  // 关键：让所有子元素水平居中
            justify-content: center;  // 垂直也居中
        `;

        settingsPanel.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: #333; text-align: center; width: 100%;">设置快捷键</h3>
            <div style="margin-bottom: 15px; width: 100%; display: flex; flex-direction: column; align-items: center;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; text-align: center;">当前快捷键</label>
                <input type="text" id="shortcut-input" readonly
                       style="width: 85%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f9f9f9; text-align: center;" /* 对话框属性 */
                       value="${currentShortcut}">
            </div>
            <div style="margin-bottom: 15px; color: #666; font-size: 12px; text-align: center; width: 100%;">
                <p>点击文本框后按下组合键</p>
                <p>支持：Ctrl, Shift, Alt + 字母/数字，或留空取消快捷键</p>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center; width: 100%;">
                <button id="clear-shortcut" style="
                    background: #ffc107;
                    color: black;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                ">清除快捷键</button>
                <button id="save-shortcut" style="
                    background: #28a745;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                ">保存</button>
                <button id="reset-shortcut" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                ">重置默认</button>
                <button id="cancel-shortcut" style="
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                ">取消</button>
            </div>
        `;
        settingsOverlay.appendChild(settingsPanel);
        document.body.appendChild(settingsOverlay);

        // 清除按钮事件
        settingsPanel.querySelector('#clear-shortcut').addEventListener('click', function() {
            newShortcut = '';
            shortcutInput.value = '';
        });

        // 快捷键捕获逻辑
        const shortcutInput = settingsPanel.querySelector('#shortcut-input');
        let newShortcut = currentShortcut;

        // 自动聚焦输入框
        shortcutInput.focus();
        // shortcutInput.select();

        // 输入框按键函数
        function captureShortcut(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation(); // 关键：阻止其他监听器

            // 允许ESC键退出
            if (e.key === 'Escape') {
                shortcutInput.blur();
                return;
            }

            const parts = [];
            if (e.ctrlKey) parts.push('Ctrl');
            if (e.shiftKey) parts.push('Shift');
            if (e.altKey) parts.push('Alt');

            // // 支持空快捷键：如果只按了ESC或者没有有效组合，就清空
            // if (parts.length === 0 || e.key === 'Escape') {
            //     newShortcut = '';
            //     shortcutInput.value = '';
            //     return;
            // }

            // 有修饰键且有主键
            if (parts.length > 0 && e.key.length === 1) {
                parts.push(e.key.toUpperCase());
                newShortcut = parts.join('+');
                shortcutInput.value = newShortcut;
            }
        }

        // 修改输入框聚焦事件，添加屏蔽逻辑
        let originalShortcutListener = null;

        //输入框聚焦事件
        shortcutInput.addEventListener('focus', function() {
            // 保存并临时移除全局快捷键监听器
            if (currentShortcutListener) {
                originalShortcutListener = currentShortcutListener;
                window.removeEventListener('keydown', currentShortcutListener, true);
            }

            document.addEventListener('keydown', captureShortcut, true);
        });

        shortcutInput.addEventListener('blur', function() {
            // 恢复全局快捷键监听器
            document.removeEventListener('keydown', captureShortcut, true);

            if (originalShortcutListener) {
                window.addEventListener('keydown', originalShortcutListener, true);
                originalShortcutListener = null;
            }

            // 更新变量
            newShortcut = shortcutInput.value;
        });

        // 保存按钮事件
        settingsPanel.querySelector('#save-shortcut').addEventListener('click', function() {
            // 允许空字符串（无快捷键）
            const shortcut = newShortcut ? newShortcut.trim() : '';

            // 格式验证（空字符串也通过验证）
            if (!isValidShortcut(shortcut)) {
                alert('快捷键格式不正确！请使用格式：Ctrl+Shift+A，或留空取消快捷键');
                return;
            }

            ShortcutManager.setShortcut(shortcut);
            setupKeyboardShortcut(); // 重新设置快捷键监听
            updateMenuText(); // 更新菜单文字和显示提示
            settingsOverlay.remove();
        });

        //重置功能
        settingsPanel.querySelector('#reset-shortcut').addEventListener('click', function() {
            ShortcutManager.setShortcut(ShortcutManager.defaultShortcut);
            setupKeyboardShortcut();
            updateMenuText(); // 更新菜单文字
            settingsOverlay.remove();
        });

        //点击取消按钮关闭
        settingsPanel.querySelector('#cancel-shortcut').addEventListener('click', function() {
            settingsOverlay.remove();
        });

        //点击背景退出
        let backgroundMouseDown = false;

        settingsOverlay.addEventListener('mousedown', function(e) {
            if (e.target === settingsOverlay) {
                backgroundMouseDown = true;
            } else {
                backgroundMouseDown = false;
            }
        });

        settingsOverlay.addEventListener('mouseup', function(e) {
            if (e.target === settingsOverlay && backgroundMouseDown) {
                // 只有鼠标按下和抬起都在背景上才关闭
                settingsOverlay.remove();
                // 清理事件监听器
                document.removeEventListener('keydown', escHandler);
            }
            backgroundMouseDown = false;
        });

        // ESC键关闭
        function escHandler(e) {
            if (e.key === 'Escape') {
                settingsOverlay.remove();
                document.removeEventListener('keydown', escHandler);
            }
        }
        document.addEventListener('keydown', escHandler);
    }

    // 清理函数
    function cleanup() {

        // 保存当前位置
        saveContainerPosition();

        // 清理所有事件监听器
        document.removeEventListener('keydown', currentShortcutListener);
        document.removeEventListener('keydown', currentEscListener);

        // 清理透明操作层
        const existingOverlay = document.getElementById('cookie-drag-overlay');
        if (existingOverlay && existingOverlay.parentNode) {
            existingOverlay.parentNode.removeChild(existingOverlay);
        }
        // 恢复光标样式（防止拖拽过程中关闭时光标异常）
        document.body.style.cursor = '';

		// 清理DOM元素
        const elementsToRemove = [
            'cookie-copy-container',
            'cookie-drag-overlay',
            // 'cookie-shortcut-settings', //不清理快捷键设置
            // 'cookie-tool-styles'
        ];
        //列表清理
        elementsToRemove.forEach(id => {
            const element = document.getElementById(id);
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });

        // 重置全局变量
        currentContainer = null;
        currentResizeObserver = null;
        currentEscListener = null;
        currentShortcutListener = null;
    }

    // 创建透明操作层的函数
    function createTransparentOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'cookie-drag-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: transparent;
            z-index: 10002;
            cursor: inherit;
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    //总图形页面
    function showCookieInterface() {

        // 格式化函数使用三重保障 优化版
        function formatCookies(cookieStr) {
            const cookies = cookieStr.split(';');
            const result = new Array(cookies.length);

            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                const eqIndex = cookie.indexOf('=');

                if (eqIndex === -1) {
                    result[i] = '';
                    continue;
                }

                const name = cookie.substring(0, eqIndex).trim();
                const value = cookie.substring(eqIndex + 1).trim();

                if (!name) {
                    result[i] = '';
                    continue;
                }

                // 去除换行和缩进，使用单行字符串
                result[i] = `<strong class="cookie-name-bold" style="font-weight: bold !important;">${escapeHTML(name)}</strong>=${escapeHTML(value)}`;
            }

            return result.filter(Boolean).join('; ');
        }

        // 先清理现有的主图形监视器等 - 防止重复创建
        cleanup();

        //检测cookie是否为空
        const cookies = document.cookie;
        if (!cookies) {
            alert('❌ 该网站没有Cookie');
            return;
        }

        // 过滤空值cookie
        const cookieList = cookies.split(';').map(cookie => {
            const [name, ...valueParts] = cookie.trim().split('=');
            return {
                name: name.trim(),
                value: valueParts.join('=').trim()
            };
        }).filter(cookie => cookie.name && cookie.value); // 新增过滤

        // 创建主容器
        const mainContainer = document.createElement('div');
        mainContainer.id = 'cookie-copy-container';
        mainContainer.style.cssText = `
            position: fixed;
            top: ${priT()};
            left: ${priL()};
            width: ${priW()};
            height: ${priH()};
            max-width: ${primaxW()};
            max-height: ${primaxH()};
            min-width: ${priminW()};
            min-height: ${priminH()};
            background: #fff3cd;
            border: 0px solid #ffd43b;
            border-radius: 8px;
            padding: 4px;
            z-index: ${max3level};
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;
        currentContainer = mainContainer;

        // 创建内边框容器
        const innerContainer = document.createElement('div');
        innerContainer.style.cssText = `
            width: 100%;
            height: 100%;
            border: 4px solid #ffa94d;
            border-radius: 4px;
            background: #fff3cd;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-sizing: border-box;
        `;

        // 全部cookie显示框 创建显示的div - 替换原来的textarea
        const displayDiv = document.createElement('div');
        displayDiv.className = 'cookie-display-div';
        displayDiv.innerHTML = formatCookies(cookies);
        displayDiv.style.cssText = `
            width: 100%;
            height: ${pricH()};
            min-height: 30px;
            max-height: 60vh;
            border: 1px solid #ced4da;
            border-radius: 4px;
            padding: 8px;
            font-size: 13px;
            font-family: sans-serif;
            resize: vertical;  // 添加这个，允许垂直调整大小
            margin-bottom: 0;
            box-sizing: border-box;
            line-height: 1.4;
            background: #f8f9fa;
            color: #495057;
            flex-shrink: 0;
            overflow: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
            user-select: text; // 确保文本可以被选中
            -webkit-user-select: text; // Safari兼容
        `;

        //声明保存临时保存位置函数
        const savedPosition = PositionMemory.getPosition();

        // 应用保存的Cookie显示框高度
        if (savedPosition && savedPosition.displayDivHeight) {
            displayDiv.style.height = `${savedPosition.displayDivHeight}px`;
        }

        // 创建手动选中按钮
        const manualSelectBtn = document.createElement('button');
        manualSelectBtn.textContent = '👆 手动选中';
        manualSelectBtn.style.cssText = `
            background: #6c757d;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 12px;
            flex: 1;
            min-width: ${buttonW()};
            height: 30px;
            box-sizing: border-box;
        `;

        // 设置标题栏按钮宽度和高度
        const poziW = 26;
        const poziH = poziW;

        // 设置主容器innerContainer的HTML
        innerContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; flex-shrink: 0; padding: 0 4px;">
                <h3 style="margin: 0; color: #856404; font-size: 16px;">🍪 网站Cookie内容 (${cookieList.length}个)</h3>
                <button id="close-cookie-display" style="
                    background: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 5px 10px;
                    cursor: pointer;
                    font-size: 12px;
                    min-height: ${poziW+0.1}px;
                ">关闭</button>
            </div>
            <div style="display: flex; gap: 10px; margin-bottom: 8px;flex-wrap: wrap; width: 100%; box-sizing: border-box; flex-shrink: 0; padding: 0 4px;">
                <button id="total-copy-exec" style="
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 12px;
                    flex: 1;
                    min-width: ${buttonW()};
                    height: 30px;
                    box-sizing: border-box;
                ">📋 全部复制1</button>
                <button id="total-copy-clipboard" style="
                    background: #28a745;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 12px;
                    flex: 1;
                    min-width: ${buttonW()};
                    height: 30px;
                    box-sizing: border-box;
                ">📋 全部复制2</button>
                <button id="manual-select-btn-placeholder" style="display: none;"></button>
            </div>
        `;

        // 组装手动选中按钮
        const buttonContainer = innerContainer.querySelector('div[style*="display: flex; gap: 10px;"]');
        const placeholder = innerContainer.querySelector('#manual-select-btn-placeholder');
        buttonContainer.replaceChild(manualSelectBtn, placeholder);

        // 创建记忆开关和重置按钮 在标题栏
        const header = innerContainer.querySelector('div[style*="display: flex; justify-content: space-between;"]');

        // 创建记忆开关和重置按钮容器
        const buttonGroup = document.createElement('div');
        buttonGroup.style.cssText = `
            display: flex;
            gap: 4px;
            align-items: center;
            margin-left: auto;  // 让按钮组靠右
        `;

        // 点击记忆开关按钮
        const memoryToggleBtn = document.createElement('button');
        memoryToggleBtn.id = 'memory-toggle-btn';
        // 记忆开启短消息文本
        memoryToggleBtn.title = PositionMemory.isEnabled() ? '记忆功能已开启' : '记忆功能已关闭';
        memoryToggleBtn.style.cssText = `
            background: ${PositionMemory.isEnabled() ? '#28a745' : '#6c757d'};
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            cursor: pointer;
            font-size: 12px;
            width: ${poziW}px;
            height: ${poziH}px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            letter-spacing: 1.2px; //字间距
        `;

        // 设置图标（使用SVG或文本图标）
        memoryToggleBtn.innerHTML = '💾'; // 始终使用💾图标

        // 重置位置按钮
        const resetPositionBtn = document.createElement('button');
        resetPositionBtn.id = 'reset-position-btn';
        resetPositionBtn.title = '还原默认位置';
        resetPositionBtn.style.cssText = `
            background: #ffc107;
            color: black;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            cursor: pointer;
            font-size: 12px;
            width: ${poziW-0.3}px;
            height: ${poziH+0.4}px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        resetPositionBtn.innerHTML = '🏠';

        // 组装按钮
        buttonGroup.appendChild(memoryToggleBtn);
        buttonGroup.appendChild(resetPositionBtn);

        // 创建空白间距元素
        const spacer = document.createElement('div');
        spacer.style.cssText = `
            width: 4px;        // 控制间距大小
            flex-shrink: 0;     // 防止被压缩
            display: block;     // 确保显示为块元素
        `;

        // 定义关闭按钮
        const closeButton = header.querySelector('#close-cookie-display');

        header.appendChild(buttonGroup);
        header.appendChild(spacer);
        header.appendChild(closeButton);

        // 单组cookie的网格部分 使用文档片段优化DOM操作 - 替换原来的innerHTML方式
        const modulesFragment = document.createDocumentFragment();
        const modulesContainer = document.createElement('div');

        modulesContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
            gap: 8px;
            overflow-y: auto;
            padding: 0;
            flex: 1;
            min-height: 0;
            align-content: start;
            grid-auto-rows: minmax(80px, 1fr); /* 保持行高弹性，但有最小值 */
        `;

        // 【优化】创建模板，避免重复的innerHTML解析
        const moduleTemplate = document.createElement('template');
        moduleTemplate.innerHTML = `
            <div style="
                background: white;
                border: 1px solid #ddd;
                border-radius: 6px;
                padding: 10px;
                box-sizing: border-box;
                min-width: 0;
                display: flex;
                flex-direction: column;
                gap: 8px;
                overflow: hidden;
            ">
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: stretch;
                    gap: 8px;
                    flex: 1;
                    min-height: 0;
                ">
                    <div style="
                        flex: 1;
                        word-break: break-all;
                        font-family: sans-serif;
                        font-size: 13px;
                        line-height: 1.3;
                        min-width: 0;
                        min-height: 0;
                        overflow-y: auto;
                    ">
                        <strong style="font-size: 13px;"></strong><br>
                        <span style="color: #666; font-size: 13px;"></span>
                    </div>
                    <div style="display: flex; gap: 6px; flex-direction: column; min-width: 70px; flex-shrink: 0;">
                        <button class="single-copy-btn exec-copy" style="
                            background: #007bff;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            padding: 5px 10px;
                            cursor: pointer;
                            white-space: nowrap;
                            font-size: 12px;
                            height: fit-content;
                            width: 100%;
                            min-width: 30px;
                            box-sizing: border-box;
                        ">复制1</button>
                        <button class="single-copy-btn clipboard-copy" style="
                            background: #28a745;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            padding: 5px 10px;
                            cursor: pointer;
                            white-space: nowrap;
                            font-size: 12px;
                            height: fit-content;
                            width: 100%;
                            min-width: 30px;
                            box-sizing: border-box;
                        ">复制2</button>
                    </div>
                </div>
            </div>
        `;

        // 【优化】批量创建模块 - 使用模板克隆
        cookieList.forEach((cookie, index) => {
            const moduleDiv = moduleTemplate.content.cloneNode(true);
            const moduleElement = moduleDiv.firstElementChild;

            // 【优化】一次性设置所有文本内容
            const nameElement = moduleElement.querySelector('strong');
            const valueElement = moduleElement.querySelector('span');
            const buttons = moduleElement.querySelectorAll('.single-copy-btn');

            nameElement.textContent = escapeHTML(cookie.name);
            valueElement.textContent = escapeHTML(cookie.value);

            // 【优化】一次性设置所有data属性
            const cookieData = `${escapeHTML(cookie.name)}=${escapeHTML(cookie.value)}`;
            buttons.forEach(btn => {
                btn.setAttribute('data-cookie', cookieData);
            });

            modulesContainer.appendChild(moduleDiv);
        });

        modulesFragment.appendChild(modulesContainer);

        // 在创建按钮后添加一个变量来存储定时器
        let manualSelectTimer = null;

        // 修改手动选中按钮功能 - 使用Selection API
        manualSelectBtn.addEventListener('click', function() {
            // 清除现有选择
            window.getSelection().removeAllRanges();

            // 创建范围并选中displayDiv中的所有文本
            const range = document.createRange();
            range.selectNodeContents(displayDiv);

            // 添加到选择中
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // 更新按钮状态
            this.textContent = '✅ 已选中';
            this.style.background = '#17a2b8';

            // 清除之前的定时器
            if (manualSelectTimer) {
                clearTimeout(manualSelectTimer);
            }

            // 设置定时器恢复按钮状态
            manualSelectTimer = setTimeout(() => {
                this.textContent = '👆 手动选中';
                this.style.background = '#6c757d';
                manualSelectTimer = null;
            }, 600);
        });

        // 创建"全部复制"、"手动选中"内容区域
        const contentArea = document.createElement('div');
        contentArea.style.cssText = `
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 0 4px 4px 4px;
            overflow: hidden;
            gap: 4px;
        `;

        // 组装内容区域
        contentArea.appendChild(displayDiv);
        contentArea.appendChild(modulesContainer);
        innerContainer.appendChild(contentArea);

        //组装完DOM
        mainContainer.appendChild(innerContainer);

        if (savedPosition) {
            mainContainer.style.left = `${savedPosition.left}px`;
            mainContainer.style.top = `${savedPosition.top}px`;
            mainContainer.style.width = `${savedPosition.width-8}px`;
            mainContainer.style.height = `${savedPosition.height-8}px`;
        // 应用保存的Cookie显示框高度
        if (savedPosition.displayDivHeight) {
            displayDiv.style.height = `${savedPosition.displayDivHeight}px`;
        }
        }

        //主图形body进行组装
        document.body.appendChild(mainContainer);

        // 点击记忆按钮功能
        memoryToggleBtn.addEventListener('click', function() {

            // 直接保存 (防止记忆转非记忆时无法记录位置)
            saveContainerPosition();

            // 直接设置状态
            PositionMemory.toggleEnabled();

            // 二次保存 (防止非记忆转记忆时无法记录位置)
            saveContainerPosition();

            const currentState = PositionMemory.isEnabled();

            // 更新UI
            this.style.background = currentState ? '#28a745' : '#6c757d';
            this.title = currentState ? '记忆功能已开启' : '记忆功能已关闭';
            showTempMessage(currentState ? '位置记忆已开启' : '位置记忆已关闭');
        });

        // 重置位置按钮点击事件
        resetPositionBtn.addEventListener('click', function() {
            resetContainerPosition();
            showTempMessage('已还原默认位置');
        });

        //初始化位置记忆系统 在DOM完全构建后调用 监听容器大小变化并自动保存位置
        function setupPositionMemory() {
            // 监听容器大小变化
            const resizeObserver = new ResizeObserver(saveContainerPosition);
            resizeObserver.observe(mainContainer);
            currentResizeObserver = resizeObserver;

            // 监听Cookie显示框大小变化
            const displayDiv = mainContainer.querySelector('.cookie-display-div');
            if (displayDiv) {
                resizeObserver.observe(displayDiv);
            }
        }

        // 在DOM构建完成后调用初始化
        setupPositionMemory();

        // 创建边框拖动功能
        function enableBorderResize(container) {
            const directions = ['left', 'right', 'top', 'bottom', 'top-left', 'top-right', 'bottom-right', 'bottom-left'];
            const cursors = {
                'left': 'w-resize',
                'right': 'e-resize',
                'top': 'n-resize',
                'bottom': 's-resize',
                'top-left': 'nw-resize',
                'top-right': 'ne-resize',
                'bottom-right': 'se-resize',
                'bottom-left': 'sw-resize'
            };

            //总拖动方法
            directions.forEach(dir => {
                const handle = document.createElement('div');
                handle.className = `resize-handle resize-${dir}`;

                // 鼠标拖动区域
                switch(dir) {
                    case 'left':
                        handle.style.cssText = `
                            position: absolute;
                            top: 8px;
                            left: 0;
                            bottom: 8px;
                            width: 12px;
                            cursor: w-resize;
                            z-index: ${max2level};
                            background: rgba(255, 212, 59, 0.3);
                        `;
                        break;
                    case 'right':
                        handle.style.cssText = `
                            position: absolute;
                            top: 8px;
                            right: 0;
                            bottom: 8px;
                            width: 12px;
                            cursor: e-resize;
                            z-index: 10001;
                            background: rgba(255, 212, 59, 0.3);
                        `;
                        break;
                    case 'top':
                        handle.style.cssText = `
                            position: absolute;
                            top: 0;
                            left: 8px;
                            right: 8px;
                            height: 12px;
                            cursor: n-resize;
                            z-index: 10001;
                            background: rgba(255, 212, 59, 0.3);
                        `;
                        break;
                    case 'bottom':
                        handle.style.cssText = `
                            position: absolute;
                            bottom: 0;
                            left: 8px;
                            right: 8px;
                            height: 12px;
                            cursor: s-resize;
                            z-index: 10001;
                            background: rgba(255, 212, 59, 0.3);
                        `;
                        break;
                    case 'top-left':
                        handle.style.cssText = `
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 16px;
                            height: 16px;
                            cursor: nw-resize;
                            z-index: 10001;
                            background: rgba(255, 212, 59, 0.5);
                        `;
                        break;
                    case 'top-right':
                        handle.style.cssText = `
                            position: absolute;
                            top: 0;
                            right: 0;
                            width: 16px;
                            height: 16px;
                            cursor: ne-resize;
                            z-index: 10001;
                            background: rgba(255, 212, 59, 0.5);
                        `;
                        break;
                    case 'bottom-right':
                        handle.style.cssText = `
                            position: absolute;
                            bottom: 0;
                            right: 0;
                            width: 16px;
                            height: 16px;
                            cursor: se-resize;
                            z-index: 10001;
                            background: rgba(255, 212, 59, 0.5);
                        `;
                        break;
                    case 'bottom-left':
                        handle.style.cssText = `
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            width: 16px;
                            height: 16px;
                            cursor: sw-resize;
                            z-index: 10001;
                            background: rgba(255, 212, 59, 0.5);
                        `;
                        break;
                }

                let dragState = null;

                // 拖动事件处理
                handle.addEventListener('mousedown', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    const startX = e.clientX;
                    const startY = e.clientY;
                    const rect = container.getBoundingClientRect();
                    const startLeft = rect.left;
                    const startTop = rect.top;
                    const startWidth = rect.width - 8;//原width不准，减8是为了修正原宽度
                    const startHeight = rect.height - 8;//原height不准，减8是为了修正原高度

                    //转义函数
                    const parseComputedValue = (value) => {
                        if (value.includes('vw')) {
                            return (parseFloat(value) / 100) * window.innerWidth;
                        } else if (value.includes('vh')) {
                            return (parseFloat(value) / 100) * window.innerHeight;
                        } else if (value.includes('px')) {
                            return parseFloat(value);
                        } else {
                            return parseFloat(value) || 0;
                        }
                    };

                    const computedStyle = window.getComputedStyle(container);
                    const minWidth = parseFloat(computedStyle.minWidth);
                    const minHeight = parseFloat(computedStyle.minHeight);
                    const maxWidth = parseComputedValue(computedStyle.maxWidth);
                    const maxHeight = parseComputedValue(computedStyle.maxHeight);
                    const maxTop = maxHeight + minTop - minHeight;
                    const maxLeft = maxWidth + minLeft - minWidth;
                    const priX = startWidth + startLeft;//初始右基点位置（容器右边框X坐标）
                    const priY = startHeight + startTop;//初始下基点位置（容器下边框Y坐标）

                    //边框拖拽移动和限制
                    function onMouseMove(e) {

                        // 计算光标坐标
                        let clientLeft = e.clientX;
                        let clientTop = e.clientY;

                        // 光标限制出界，限制光标位置
                        if (clientLeft < minLeft) {
                            clientLeft = minLeft;
                        }
                        if (clientLeft > maxWidth + minLeft) {
                            clientLeft = maxWidth + minLeft;
                        }
                        if (clientTop < minTop) {
                            clientTop = minTop;
                        }
                        if (clientTop > maxHeight + minTop) {
                            clientTop = maxHeight + minTop;
                        }

                        let newWidth, newHeight, newLeft, newTop;

                        // 拖拽实现：根据拖拽方向计算新位置和尺寸
                        switch(dir) {
                            //左边框拖动
                            case 'left': {
                                newLeft = clientLeft;
                                newWidth = priX - newLeft;
                                //最小宽度限制
                                if (newWidth <= minWidth) {
                                    newLeft = priX - minWidth;
                                    newWidth = minWidth;
                                }
                                break;
                            }
                            case 'right': {
                                // 右边拖动：只改变宽度
                                if (clientLeft - startLeft >= minWidth) {
                                    newWidth = clientLeft - startLeft;
                                } else {
                                    newWidth = minWidth;
                                }
                                break;
                            }
                            //上边框拖动，改变纵坐标
                            case 'top': {
                                newTop = clientTop;
                                newHeight = priY - newTop;
                                if (newHeight <= minHeight) {
                                    newTop = priY - minHeight;
                                    newHeight = minHeight;
                                }
                                break;
                            }
                            // 下边拖动：只改变高度
                            case 'bottom': {
                                if (clientTop - startTop >= minHeight) {
                                    newHeight = clientTop - startTop;
                                } else {
                                    newHeight = minHeight;
                                }
                                break;
                            }
                            //左上方向，改变left和top值
                            case 'top-left': {
                                newLeft = clientLeft;
                                newWidth = priX - newLeft;
                                //最小宽度限制
                                if (newWidth <= minWidth) {
                                    newLeft = priX - minWidth;
                                    newWidth = minWidth;
                                }

                                newTop = clientTop;
                                newHeight = priY - newTop;
                                if (newHeight <= minHeight) {
                                    newTop = priY - minHeight;
                                    newHeight = minHeight;
                                }
                                break;
                            }
                            //左下方向
                            case 'bottom-left': {
                                newLeft = clientLeft;
                                newWidth = priX - newLeft;
                                //最小宽度限制
                                if (newWidth <= minWidth) {
                                    newLeft = priX - minWidth;
                                    newWidth = minWidth;
                                }

                                if (clientTop - startTop >= minHeight) {
                                    newHeight = clientTop - startTop;
                                } else {
                                    newHeight = minHeight;
                                }
                                break;
                            }
                            //右上方向拖动：改变宽度和Top值
                            case 'top-right': {
                                if (clientLeft - startLeft >= minWidth) {
                                    newWidth = clientLeft - startLeft;
                                } else {
                                    newWidth = minWidth;
                                }

                                newTop = clientTop;
                                newHeight = priY - newTop;
                                if (newHeight <= minHeight) {
                                    newTop = priY - minHeight;
                                    newHeight = minHeight;
                                }
                                break;
                            }
                            // 右下角拖动：改变宽度和高度
                            case 'bottom-right': {
                                if (clientLeft - startLeft >= minWidth) {
                                    newWidth = clientLeft - startLeft;
                                } else {
                                    newWidth = minWidth;
                                }

                                if (clientTop - startTop >= minHeight) {
                                    newHeight = clientTop - startTop;
                                } else {
                                    newHeight = minHeight;
                                }
                                break;
                            }
                        }

                        // 最终赋值
                        container.style.width = newWidth + 'px';
                        container.style.height = newHeight + 'px';
                        container.style.left = newLeft + 'px';
                        container.style.top = newTop + 'px';
                    }


                    function onMouseUp() {
                        // 移除透明操作层
                        if (overlay && overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                                                    }
                        document.removeEventListener('mousemove', onMouseMove);
                        document.removeEventListener('mouseup', onMouseUp);

                        // 恢复光标样式
                        document.body.style.cursor = '';

                        saveContainerPosition();
                    }

                    // 创建透明操作层方案
                    const overlay = createTransparentOverlay();
                    // 设置对应的光标样式
                    overlay.style.cursor = cursors[dir];
                    document.body.style.cursor = cursors[dir];

                    //原方案: 又绑定回documengt了
                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);
                });

                container.appendChild(handle);
            });

            // 标题栏拖动功能
            const header = container.querySelector('div[style*="display: flex; justify-content: space-between;"]');
            header.style.cursor = 'move';
            header.style.padding = '4px';

            header.addEventListener('mousedown', function(e) {
                // 只有当点击关闭按钮时才不触发拖动
                if (e.target.id === 'close-cookie-display') return;

                e.preventDefault();
                e.stopPropagation();

                const startX = e.clientX;
                const startY = e.clientY;
                const startLeft = container.offsetLeft;
                const startTop = container.offsetTop;

                //转义函数
                    const parseComputedValue = (value) => {
                        if (value.includes('vw')) {
                            return (parseFloat(value) / 100) * window.innerWidth;
                        } else if (value.includes('vh')) {
                            return (parseFloat(value) / 100) * window.innerHeight;
                        } else if (value.includes('px')) {
                            return parseFloat(value);
                        } else {
                            return parseFloat(value) || 0;
                        }
                    };

                const computedStyle = window.getComputedStyle(container);
                const maxWidth = parseComputedValue(computedStyle.maxWidth);
                const maxHeight = parseComputedValue(computedStyle.maxHeight);
                const maxLeft = maxWidth + minLeft - container.offsetWidth + 8;//例行修正
                const maxTop = maxHeight + minTop - container.offsetHeight + 8;//例行修正

                function onMouseMove(e) {
                    const deltaX = e.clientX - startX;
                    const deltaY = e.clientY - startY;

                    const newLeft = Math.max(minLeft, Math.min(startLeft + deltaX, maxLeft));
                    const newTop = Math.max(minTop, Math.min(startTop + deltaY, maxTop));

                    container.style.left = newLeft + 'px';
                    container.style.top = newTop + 'px';
                }

                function onMouseUp(e) {
                    // 移除透明操作层
                    if (overlay && overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }

                    // 移除事件监听器 - 关键修复：从document移除
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);

                    // 恢复光标样式
                    document.body.style.cursor = '';

                    saveContainerPosition();
                }
                 // 创建透明操作层
                const overlay = createTransparentOverlay();
                // 设置透明层光标样式与标题栏一致
                overlay.style.cursor = 'move';

                //原方案：又给绑定回document了
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);

                // 设置光标样式
                document.body.style.cursor = 'move';
            });
        }

        // 启用边框拖动功能
        enableBorderResize(mainContainer);


        // 更新显示框最大高度的函数 - 修改为操作displayDiv
        function updateTextareaMaxHeight() {
            const containerHeight = mainContainer.offsetHeight;
            const headerHeight = 60;
            const maxDisplayHeight = (containerHeight - headerHeight) * 0.47;
            displayDiv.style.maxHeight = `${maxDisplayHeight}px`;
        }

        // 初始化最大高度
        updateTextareaMaxHeight();

        // 使用ResizeObserver监听容器大小变化
        const resizeObserver = new ResizeObserver(() => {
            updateTextareaMaxHeight();
        });

        resizeObserver.observe(mainContainer);

        // ESC键处理函数
        function handleEscKey(e) {
            if (e.key === 'Escape') {
                cleanup(); // 改为调用清理函数
            }
        }

        // 注册ESC键监听
        currentEscListener = handleEscKey; // 保存引用
        document.addEventListener('keydown', currentEscListener);

        // 复制函数 - execCommand方法
        function copyWithExecCommand(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            textarea.setSelectionRange(0, 99999);

            try {
                const success = document.execCommand('copy');
                document.body.removeChild(textarea);
                return success;
            } catch (err) {
                document.body.removeChild(textarea);
                return false;
            }
        }

        // 复制函数 - Clipboard API方法
        async function copyWithClipboard(text) {
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(text);
                    return true;
                } else {
                    return false;
                }
            } catch (err) {
                return false;
            }
        }

        // 按钮状态更新函数
        function updateButtonState(button, success, isExecCommand = true) {
            const originalText = button.textContent;
            const originalColor = isExecCommand ? '#007bff' : '#28a745';

            if (success) {
                button.textContent = '已复制';
                button.style.background = isExecCommand ? '#0056b3' : '#1e7e34';
            } else {
                button.textContent = '失败';
                button.style.background = '#dc3545';
            }

            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = originalColor;
            }, 1500);
        }

        // 事件委托 - 优化事件监听（替换原来的多个addEventListener）
        innerContainer.addEventListener('click', function(e) {
            const target = e.target;

            // 总复制按钮 - execCommand方法
            if (target.id === 'total-copy-exec') {
                const success = copyWithExecCommand(cookies);
                updateButtonState(target, success, true);
            }

            // 总复制按钮 - Clipboard API方法
            else if (target.id === 'total-copy-clipboard') {
                copyWithClipboard(cookies).then(success => {
                    updateButtonState(target, success, false);
                });
            }

            // 单个复制按钮 - execCommand方法
            else if (target.classList.contains('exec-copy')) {
                const cookieText = target.getAttribute('data-cookie');
                const success = copyWithExecCommand(cookieText);
                updateButtonState(target, success, true);
            }

            // 单个复制按钮 - Clipboard API方法
            else if (target.classList.contains('clipboard-copy')) {
                const cookieText = target.getAttribute('data-cookie');
                copyWithClipboard(cookieText).then(success => {
                    updateButtonState(target, success, false);
                });
            }

            // 关闭按钮
            else if (target.id === 'close-cookie-display') {
                cleanup(); // 改为调用清理函数
            }
        });

    }

    // HTML转义函数
    function escapeHTML(str) {
        return str.replace(/[&<>"']/g, function(match) {
            const escapes = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            };
            return escapes[match];
        });
    }

    // Cookie格式化显示函数 修改 formatCookies 函数为更可靠的版本
    function formatCookies(cookieStr) {
    return cookieStr.split(';').map(cookie => {
        const [name, ...valueParts] = cookie.trim().split('=');
        if (!name) return '';
        const value = valueParts.join('=').trim();
        // // 双重保障：使用strong标签和class
        // return `<strong class="cookie-name-bold">${escapeHTML(name)}</strong>=${escapeHTML(value)}`;
        // 三重保障：语义化标签 + class + 内联样式
        return `<strong class="cookie-name-bold" style="font-weight: bold !important;">${escapeHTML(name)}</strong>=${escapeHTML(value)}`;
    }).join('; ');
}

})();