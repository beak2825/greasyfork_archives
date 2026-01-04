// ==UserScript==
// @name         猫国建设者游戏时间流速控制器
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  为小猫加速每秒获得的资源。注意：倍速太高会极大破坏游戏体验，谨慎设置！！！\n新增了
// @author       woshishabidouyourenqiang
// @match        https://likexia.gitee.io/cat-zh/*
// @match        https://zhaolinxu.github.io/cat-zh/*
// @match        https://lolitalibrary.com/maomao/*
// @match        https://kittensgame.com/web/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/dojotoolkit/1.17.2/dojo/dojo.js
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/555061/%E7%8C%AB%E5%9B%BD%E5%BB%BA%E8%AE%BE%E8%80%85%E6%B8%B8%E6%88%8F%E6%97%B6%E9%97%B4%E6%B5%81%E9%80%9F%E6%8E%A7%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/555061/%E7%8C%AB%E5%9B%BD%E5%BB%BA%E8%AE%BE%E8%80%85%E6%B8%B8%E6%88%8F%E6%97%B6%E9%97%B4%E6%B5%81%E9%80%9F%E6%8E%A7%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置项 ---
    const CONFIG = {
        // 控制面板样式 (使用 Flexbox 布局更稳定)
        panelStyle: {
            position: 'fixed',
            top: '10px',
            right: '10px', // 初始位置
            zIndex: '9999',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px',
            borderRadius: '8px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            border: '1px solid #555',
            // 关键样式：让面板本身不捕获鼠标事件，实现“穿透”
            pointerEvents: 'none',
            // 防止拖动时选中文本
            userSelect: 'none',
            // 使用 Flexbox 布局，使内部元素对齐更整齐
            display: 'flex',
            alignItems: 'center',
            // 设置一个最小宽度，防止内容过少时面板缩得太小
            minWidth: '200px',
        },
        // 拖动手柄样式
        handleStyle: {
            marginRight: '8px',
            cursor: 'move',
            fontSize: '18px',
            lineHeight: '1',
            // 关键样式：让手柄可以捕获鼠标事件
            pointerEvents: 'auto',
        },
        // 下拉菜单样式
        selectStyle: {
            marginLeft: '5px',
            padding: '3px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            // 关键样式：让下拉菜单可以捕获鼠标事件
            pointerEvents: 'auto',
        },
        // 预设的速度选项 (格式: "显示文本": 每秒资源跳动次数)
        speedOptions: {
            "每秒5次（默认）": 5,
            "每秒10次（2倍速）": 10,
            "每秒20次（4倍速）": 20,
            "每秒40次（8倍速）": 40,
            "每秒50次（10倍速）": 50,
            "每秒60次（12倍速）": 60,
            "每秒120次（24倍速）": 120,
            "每秒240次（48倍速）": 240,
        },
        // 默认速度，每秒5次
        defaultSpeed: 5
    };

    /**
     * 使元素可拖动 (修复了首次拖动跳跃的问题)
     * @param {HTMLElement} element - 需要被拖动的元素
     * @param {HTMLElement} handle - 用于触发拖动的手柄元素
     */
    function makeElementDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();

            // --- 关键修复：防止首次拖动时跳跃 ---
            // 1. 获取元素当前位置
            const currentLeft = element.offsetLeft;
            const currentTop = element.offsetTop;

            // 2. 清除 right 属性，防止与 left 冲突
            element.style.right = 'auto';

            // 3. 立即用获取到的位置设置 left 和 top，将元素“钉”在原地
            element.style.left = currentLeft + 'px';
            element.style.top = currentTop + 'px';
            // --- 修复结束 ---

            // 记录鼠标按下时的位置
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // 计算鼠标移动的距离
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // 设置元素的新位置
            const newTop = (element.offsetTop - pos2);
            const newLeft = (element.offsetLeft - pos1);
            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
        }

        function closeDragElement() {
            // 停止拖动，移除事件监听
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    /**
     * 设置游戏速度的核心函数
     * @param {number} newTicksPerSecond - 新的每秒刷新率 (FPS)
     */
    function setGameSpeed(newTicksPerSecond) {
        if (typeof game === 'undefined' || !game.tick || typeof game._mainTimer === 'undefined') {
            console.error("[游戏时间流速控制器] 错误: 找不到 game 对象或其关键属性。");
            return;
        }

        if (game._mainTimer) {
            clearInterval(game._mainTimer);
            game._mainTimer = null;
        }

        game.ticksPerSecond = newTicksPerSecond;

        if (newTicksPerSecond > 0) {
            if (typeof dojo === 'undefined' || !dojo.hitch) {
                 console.error("[游戏时间流速控制器] 错误: Dojo Toolkit 未加载。");
                 return;
            }
            const delay = 1000 / newTicksPerSecond;
            game._mainTimer = setInterval(dojo.hitch(game, game.tick), delay);
            console.log(`[游戏时间流速控制器] 游戏速度已设置为: ${newTicksPerSecond} 次/秒 (间隔: ${delay.toFixed(2)}ms)`);
        } else {
            console.log("[游戏时间流速控制器] 游戏已暂停。");
        }
    }

    /**
     * 创建并注入UI控制面板
     */
    function createSpeedControlPanel() {
        // 创建主容器
        const panel = document.createElement('div');
        panel.id = 'game-speed-controller';

        // 创建拖动手柄
        const handle = document.createElement('span');
        handle.id = 'drag-handle';
        handle.textContent = '☰';
        handle.title = "拖动我";
        Object.assign(handle.style, CONFIG.handleStyle);

        // 创建标签
        const label = document.createElement('label');
        label.textContent = '每秒资源跳动次数:';
        label.htmlFor = 'speed-selector';

        // 创建下拉选择框
        const selector = document.createElement('select');
        selector.id = 'speed-selector';

        // 填充速度选项
        for (const [text, value] of Object.entries(CONFIG.speedOptions)) {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = text;
            if (value === CONFIG.defaultSpeed) {
                option.selected = true;
            }
            selector.appendChild(option);
        }

        // 添加事件监听器
        selector.addEventListener('change', (event) => {
            const newSpeed = parseInt(event.target.value, 10);
            setGameSpeed(newSpeed);
        });

        // 组装UI
        panel.appendChild(handle);
        panel.appendChild(label);
        panel.appendChild(selector);

        // 应用样式
        Object.assign(panel.style, CONFIG.panelStyle);
        Object.assign(selector.style, CONFIG.selectStyle);

        // 将面板添加到页面
        document.body.appendChild(panel);

        // 使面板可拖动
        makeElementDraggable(panel, handle);

        // 初始化速度
        setGameSpeed(CONFIG.defaultSpeed);
        console.log("[游戏时间流速控制器] 控制面板已加载。");
    }

    /**
     * 等待游戏对象加载完成
     */
    function waitForGameAndInit() {
        const checkInterval = setInterval(() => {
            if (typeof game !== 'undefined' && game.tick && typeof game.ticksPerSecond !== 'undefined') {
                clearInterval(checkInterval);
                createSpeedControlPanel();
            }
        }, 500);
    }

    // 启动脚本
    waitForGameAndInit();

})();