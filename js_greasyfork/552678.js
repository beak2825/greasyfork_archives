// ==UserScript==
// @name         物品筛选器
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  筛选特定物品的脚本，支持正则表达式配置
// @author       XiaoR
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://tupian.li/images/2025/09/07/68bd44250be41.png
// @grant        none
// @license      CC-BY-NC-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/552678/%E7%89%A9%E5%93%81%E7%AD%9B%E9%80%89%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/552678/%E7%89%A9%E5%93%81%E7%AD%9B%E9%80%89%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 存储筛选方案的正则表达式
    let filterSchemes = {
        scheme1: { name: '方案1', regex: '' },
        scheme2: { name: '方案2', regex: '' },
        scheme3: { name: '方案3', regex: '' },
        scheme4: { name: '方案4', regex: '' }
    };

    // 加载保存的配置
    function loadConfig() {
        const saved = localStorage.getItem('itemFilterConfig');
        if (saved) {
            try {
                filterSchemes = JSON.parse(saved);
            } catch (e) {
                console.error('加载配置失败:', e);
            }
        }
    }

    // 保存配置
    function saveConfig() {
        localStorage.setItem('itemFilterConfig', JSON.stringify(filterSchemes));
    }

    // 初始化加载配置
    loadConfig();

    // 创建悬浮界面
    function createFloatingUI() {
        // 主容器
        const container = document.createElement('div');
        container.id = 'itemFilterContainer';
        container.style.cssText = `
            position: fixed;
            top: 50px;
            left: 50px;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #66CCFF;
            border-radius: 8px;
            padding: 10px;
            z-index: 9999;
            color: white;
            font-family: Arial, sans-serif;
            user-select: none;
            width: 240px;
            height: 150px; // 固定高度防止页面被拉伸
            box-sizing: border-box;
        `;

        // 按钮容器 (4x3 网格)
        const buttonGrid = document.createElement('div');
        buttonGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(3, 1fr);
            gap: 5px;
            width: 100%;
        `;
        container.appendChild(buttonGrid);

        // 创建拖动区域（SVG青蛙图标）
        const dragArea = document.createElement('div');
        dragArea.id = 'dragArea';
        dragArea.style.cssText = `
            grid-column: 1 / 2;
            grid-row: 1 / 2;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            cursor: move;
            padding: 2px;
            height: 40px; // 固定高度防止页面被拉伸
        `;
        
        // 创建SVG元素
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("role", "img");
        svg.setAttribute("aria-label", "action icon");
        svg.setAttribute("class", "Icon_icon__2LtL_");
        svg.style.width = "100%";
        svg.style.height = "100%";
        
        const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
        use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "/static/media/combat_monsters_sprite.75d964d1.svg#frog");
        
        svg.appendChild(use);
        dragArea.appendChild(svg);
        buttonGrid.appendChild(dragArea);

        // 创建默认按钮 (2x1)
        const defaultButton = document.createElement('button');
        defaultButton.id = 'defaultFilter';
        defaultButton.textContent = '默认';
        defaultButton.style.cssText = `
            grid-column: 2 / 4;
            grid-row: 1 / 2;
            padding: 8px;
            border: 1px solid #66CCFF;
            background: #333;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            height: 40px; // 固定按钮高度防止页面被拉伸
        `;
        defaultButton.onclick = function(e) {
            e.stopPropagation();
            applyDefaultFilter();
        };
        buttonGrid.appendChild(defaultButton);

        // 创建设置按钮 (1x1) - 带齿轮图标
        const settingsButton = document.createElement('button');
        settingsButton.id = 'settingsButton';
        settingsButton.style.cssText = `
            grid-column: 4 / 5;
            grid-row: 1 / 2;
            padding: 8px;
            border: 1px solid #66CCFF;
            background: #333;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 40px; // 固定按钮高度防止页面被拉伸
        `;
        // 创建齿轮图标
        const gearIcon = document.createElement('span');
        gearIcon.innerHTML = '⚙️'; // 齿轮表情符号
        gearIcon.style.fontSize = '16px';
        settingsButton.appendChild(gearIcon);
        settingsButton.onclick = function(e) {
            e.stopPropagation();
            openSettings();
        };
        buttonGrid.appendChild(settingsButton);

        // 创建方案按钮 (每个2x1)
        const schemeButtons = [
            { id: 'scheme1Button', text: filterSchemes.scheme1.name, onclick: () => applyFilter('scheme1'), gridColumn: '1 / 3', gridRow: '2 / 3' },
            { id: 'scheme2Button', text: filterSchemes.scheme2.name, onclick: () => applyFilter('scheme2'), gridColumn: '3 / 5', gridRow: '2 / 3' },
            { id: 'scheme3Button', text: filterSchemes.scheme3.name, onclick: () => applyFilter('scheme3'), gridColumn: '1 / 3', gridRow: '3 / 4' },
            { id: 'scheme4Button', text: filterSchemes.scheme4.name, onclick: () => applyFilter('scheme4'), gridColumn: '3 / 5', gridRow: '3 / 4' }
        ];

        schemeButtons.forEach(btn => {
            const button = document.createElement('button');
            button.id = btn.id;
            button.textContent = btn.text;
            button.style.cssText = `
                grid-column: ${btn.gridColumn};
                grid-row: ${btn.gridRow};
                padding: 10px 8px;
                border: 1px solid #66CCFF;
                background: #333;
                color: white;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                height: 40px; // 固定按钮高度防止页面被拉伸
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            button.onclick = function(e) {
                e.stopPropagation();
                btn.onclick();
            };
            buttonGrid.appendChild(button);
        });

        // 添加到页面
        document.body.appendChild(container);

        // 实现拖动功能
        makeDraggable(container, dragArea);
    }

    // 实现元素拖动
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 打开设置面板
    function openSettings() {
        // 检查设置面板是否已存在
        let settingsPanel = document.getElementById('itemFilterSettings');
        if (settingsPanel) {
            settingsPanel.remove();
            return;
        }

        // 创建设置面板
        settingsPanel = document.createElement('div');
        settingsPanel.id = 'itemFilterSettings';
        settingsPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #66CCFF;
            border-radius: 10px;
            padding: 20px;
            z-index: 10000;
            color: white;
            font-family: Arial, sans-serif;
            width: 400px;
            max-height: 80vh;
            overflow-y: auto;
        `;

        // 设置标题
        const title = document.createElement('h3');
        title.textContent = '筛选方案设置';
        title.style.cssText = 'margin-top: 0; color: #66CCFF; text-align: center;';
        settingsPanel.appendChild(title);

        // 为每个方案创建设置项
        ['scheme1', 'scheme2', 'scheme3', 'scheme4'].forEach(scheme => {
            const schemeContainer = document.createElement('div');
            schemeContainer.style.cssText = 'margin-bottom: 15px; padding: 10px; border: 1px solid #555; border-radius: 5px;';

            // 方案名称
            const nameLabel = document.createElement('label');
            nameLabel.textContent = '方案名称:';
            nameLabel.style.display = 'block';
            nameLabel.style.marginBottom = '5px';
            schemeContainer.appendChild(nameLabel);

            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.value = filterSchemes[scheme].name;
            nameInput.dataset.scheme = scheme;
            nameInput.dataset.field = 'name';
            nameInput.style.cssText = 'width: 100%; padding: 5px; margin-bottom: 10px; background: #333; color: white; border: 1px solid #666;';
            nameInput.oninput = updateScheme;
            schemeContainer.appendChild(nameInput);

            // 正则表达式
            const regexLabel = document.createElement('label');
            regexLabel.textContent = '正则表达式:';
            regexLabel.style.display = 'block';
            regexLabel.style.marginBottom = '5px';
            schemeContainer.appendChild(regexLabel);

            const regexInput = document.createElement('input');
            regexInput.type = 'text';
            regexInput.value = filterSchemes[scheme].regex;
            regexInput.dataset.scheme = scheme;
            regexInput.dataset.field = 'regex';
            regexInput.style.cssText = 'width: 100%; padding: 5px; margin-bottom: 5px; background: #333; color: white; border: 1px solid #666;';
            regexInput.oninput = updateScheme;
            schemeContainer.appendChild(regexInput);

            settingsPanel.appendChild(schemeContainer);
        });

        // 保存按钮
        const saveButton = document.createElement('button');
        saveButton.textContent = '保存设置';
        saveButton.style.cssText = `
            background: #66CCFF;
            color: black;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            width: 100%;
            margin-top: 10px;
        `;
        saveButton.onclick = function() {
            saveConfig();
            updateButtonLabels();
            settingsPanel.remove();
            alert('设置已保存！');
        };
        settingsPanel.appendChild(saveButton);

        // 关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.cssText = `
            background: #555;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            margin-top: 10px;
        `;
        closeButton.onclick = function() {
            settingsPanel.remove();
        };
        settingsPanel.appendChild(closeButton);

        // 添加到页面
        document.body.appendChild(settingsPanel);
    }

    // 更新方案数据
    function updateScheme(e) {
        const scheme = e.target.dataset.scheme;
        const field = e.target.dataset.field;
        filterSchemes[scheme][field] = e.target.value;
        // 注意：只保存数据，不进行正则验证，验证会在点击应用按钮时进行
    }

    // 更新按钮标签
    function updateButtonLabels() {
        document.getElementById('scheme1Button').textContent = filterSchemes.scheme1.name;
        document.getElementById('scheme2Button').textContent = filterSchemes.scheme2.name;
        document.getElementById('scheme3Button').textContent = filterSchemes.scheme3.name;
        document.getElementById('scheme4Button').textContent = filterSchemes.scheme4.name;
    }

    // 默认筛选（显示所有物品）
    function applyDefaultFilter() {
        applyFilterToItems(null);
        highlightActiveButton('defaultFilter');
    }

    // 应用特定方案筛选
    function applyFilter(scheme) {
        const regexPattern = filterSchemes[scheme].regex;
        // 只有当用户点击按钮时才验证正则表达式
        applyFilterToItems(regexPattern);
        highlightActiveButton(scheme + 'Button');
    }

    // 高亮当前活动按钮
    function highlightActiveButton(activeButtonId) {
        const buttons = ['defaultFilter', 'scheme1Button', 'scheme2Button', 'scheme3Button', 'scheme4Button'];
        buttons.forEach(btnId => {
            const button = document.getElementById(btnId);
            if (btnId === activeButtonId) {
                button.style.backgroundColor = '#66CCFF';
                button.style.color = 'black';
                button.style.fontWeight = 'bold';
            } else {
                button.style.backgroundColor = '#333';
                button.style.color = 'white';
                button.style.fontWeight = 'normal';
            }
        });
    }

    // 注意：applyFilterToItems函数已被applyFilterDebounced替代，以提供更好的性能和持续筛选能力

    // 保存当前激活的筛选方案 - 提前初始化这些变量
    let currentActiveScheme = 'defaultFilter';
    let currentRegexPattern = null;

    // 初始化函数
    function init() {
        // 创建悬浮UI
        createFloatingUI();
        
        // 高亮默认按钮
        highlightActiveButton('defaultFilter');
    }

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 注意：这些变量已在前面初始化，避免重复定义
    
    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // 更新当前激活的筛选方案
    function updateCurrentFilter(btnId, regexPattern = null) {
        currentActiveScheme = btnId;
        currentRegexPattern = regexPattern;
    }
    
    // 优化后的应用筛选函数
    const applyFilterDebounced = debounce(function(regexPattern) {
        // 直接应用筛选，不再检查调用栈，因为这是从防抖函数调用的
        const root1 = document.querySelector("div.GamePage_characterManagementPanel__3OYQL > div > div > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div");
        if (!root1) return;

        const items = root1.querySelectorAll(".Item_itemContainer__x7kH1");
        let regex = null;

        // 编译正则表达式 - 只有在有模式且长度大于0时才验证
        if (regexPattern && regexPattern.trim()) {
            try {
                regex = new RegExp(regexPattern, 'i'); // 不区分大小写
            } catch (e) {
                // 静默失败，不显示错误，因为这是自动触发的
                console.log('正则表达式无效（自动应用时）:', e.message);
                return;
            }
        }

        // 应用筛选
        items.forEach(container => {
            try {
                const name = container.querySelector("svg").firstChild.href.baseVal.split("#")[1];
                // 获取物品等级
                const levelElement = container.querySelector(".script_itemLevel");
                const level = levelElement ? levelElement.textContent : '';
                
                if (!regex) {
                    // 默认筛选 - 显示所有
                    container.hidden = false;
                } else {
                    // 应用正则表达式筛选
                    // 如果名称或等级匹配正则表达式，则显示，否则隐藏
                    const nameMatch = regex.test(name);
                    const levelMatch = level ? regex.test(level) : false;
                    container.hidden = !(nameMatch || levelMatch);
                }
            } catch (err) {
                // 如果无法获取物品名称，则默认显示
                container.hidden = false;
            }
        });
    }, 100); // 100ms防抖延迟
    
    // 修改高亮函数，同时更新当前激活的筛选方案
    function highlightActiveButton(activeButtonId) {
        const buttons = ['defaultFilter', 'scheme1Button', 'scheme2Button', 'scheme3Button', 'scheme4Button'];
        let regexPattern = null;
        
        buttons.forEach(btnId => {
            const button = document.getElementById(btnId);
            if (btnId === activeButtonId) {
                button.style.backgroundColor = '#66CCFF';
                button.style.color = 'black';
                button.style.fontWeight = 'bold';
                
                // 更新当前激活的方案
                if (btnId !== 'defaultFilter') {
                    const scheme = btnId.replace('Button', '');
                    regexPattern = filterSchemes[scheme].regex;
                }
            } else {
                button.style.backgroundColor = '#333';
                button.style.color = 'white';
                button.style.fontWeight = 'normal';
            }
        });
        
        // 保存当前激活的筛选方案
        updateCurrentFilter(activeButtonId, regexPattern);
    }
    
    // 修改默认筛选函数
    function applyDefaultFilter() {
        highlightActiveButton('defaultFilter');
        // 立即应用筛选，同时保存到当前激活方案
        applyFilterDebounced(null);
    }
    
    // 修改应用特定方案筛选函数
    function applyFilter(scheme) {
        const regexPattern = filterSchemes[scheme].regex;
        highlightActiveButton(scheme + 'Button');
        
        // 验证正则表达式 - 只在用户点击时验证
        if (regexPattern && regexPattern.trim()) {
            try {
                new RegExp(regexPattern, 'i'); // 测试正则表达式是否有效
            } catch (e) {
                alert('正则表达式无效: ' + e.message);
                return;
            }
        }
        
        // 应用筛选
        applyFilterDebounced(regexPattern);
    }
    
    // 创建一个更加健壮的MutationObserver来监控DOM变化
    new MutationObserver(function(mutationsList) {
        // 检查是否有物品相关的DOM变化
        let shouldApplyFilter = false;
        
        for (const mutation of mutationsList) {
            // 检查是否有添加或删除子节点
            if (mutation.type === 'childList') {
                // 检查是否与物品列表相关
                if (mutation.target.querySelector && 
                    (mutation.target.classList.contains('Item_itemContainer__x7kH1') || 
                     mutation.target.querySelector('.Item_itemContainer__x7kH1') ||
                     mutation.target.closest('div.TabsComponent_tabPanelsContainer__26mzo'))) {
                    shouldApplyFilter = true;
                    break;
                }
            }
        }
        
        // 如果检测到相关变化，应用当前激活的筛选方案
        if (shouldApplyFilter) {
            applyFilterDebounced(currentRegexPattern);
        }
    }).observe(document, {childList: true, subtree: true});
    
    // 定期应用筛选，作为额外保障
    setInterval(function() {
        // 只在有激活筛选方案时定期应用
        if (currentActiveScheme !== 'defaultFilter' || currentRegexPattern) {
            applyFilterDebounced(currentRegexPattern);
        }
    }, 500); // 每500ms检查一次，确保筛选持续有效

})();