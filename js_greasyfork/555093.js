// ==UserScript==
// @name auto_milkcnomy
// @namespace http://tampermonkey.net/
// @version 5.92
// @description 自动收集页面数据并生成排序表格，包含是否制作装备状态和市场售价
// @author baozhi
// @license CC-BY-NC-SA-4.0
// @match https://milkonomy.pages.dev/*
// @grant GM_xmlhttpRequest
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// @connect www.milkywayidlecn.com
// @run-at document-end 
// @downloadURL https://update.greasyfork.org/scripts/555093/auto_milkcnomy.user.js
// @updateURL https://update.greasyfork.org/scripts/555093/auto_milkcnomy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let panel = null;
    let currentAllData = []; // 存储当前所有数据
    let equipmentPrices = {}; // 存储制作装备状态下的价格
    // 添加暂停控制变量
    let isPaused = false;
    let isRunning = false;
    let hasResults = false; // 标记是否有结果显示
    let normalWidth = '320px'; // 正常状态宽度
    let resultsWidth = '1350px'; // 有结果时的宽度
    let focusedRowIndex = -1; // 当前聚焦的行索引，-1表示显示全部
    let enhancementLevels = [10]; // 默认强化等级数组，支持多选
    let isPanelVisible = true; // 面板可见状态

    // 用户设置
    let userSettings = {
        sortField: 'sellHourly', // 默认排序字段改为出售工时费
        sortOrder: 'desc', // 默认排序顺序
        showSellProfit: true, // 显示出售利润
        marketFee: 0.98 // 市场手续费
    };

    // 滚动位置保存变量
    let tableScrollPosition = 0;
    let isRestoringScroll = false;
    let lastFocusedRowIndex = -1; // 记录上次聚焦的行
    // 市场API数据结构
    let marketData = {};
    let marketAPITimestamp = 0;
    let isMarketDataLoading = false;
    let marketDataLoadPromise = null;

    // 检查当前URL是否匹配目标页面
    function isTargetPage() {
        return window.location.href === 'https://milkonomy.pages.dev/#/enhancer';
    }

    // 显示或隐藏面板
    function updatePanelVisibility() {
        if (isTargetPage()) {
            if (!panel) createControlPanel();
            if (panel) {
                if (isPanelVisible) {
                    panel.style.display = 'block';
                } else {
                    panel.style.display = 'none';
                }
            }
        } else {
            if (panel) panel.style.display = 'none';
        }
    }

    // 切换面板显示状态
    function togglePanelVisibility() {
        isPanelVisible = !isPanelVisible;
        updatePanelVisibility();

        // 显示状态提示
        const statusDiv = panel ? panel.querySelector('#status') : null;
        if (statusDiv) {
            statusDiv.textContent = isPanelVisible ? '面板已显示 (按F1隐藏)' : '面板已隐藏 (按F1显示)';
            setTimeout(() => {
                if (!isRunning && statusDiv) statusDiv.textContent = '准备就绪';
            }, 2000);
        }
    }

    // 监听键盘事件
    function setupKeyboardListener() {
        document.addEventListener('keydown', function(e) {
            // 检查是否按下了F1键
            if (e.key === 'F1' || e.keyCode === 112) {
                e.preventDefault(); // 阻止浏览器默认的F1帮助行为
                togglePanelVisibility();
            }
        });
    }

    // 监听URL变化
    function watchUrlChange() {
        let currentUrl = location.href;
        const observer = new MutationObserver(() => {
            if (currentUrl !== location.href) {
                currentUrl = location.href;
                updatePanelVisibility();
            }
        });
        observer.observe(document, { childList: true, subtree: true });
        window.addEventListener('popstate', updatePanelVisibility);
    }

    // 加载用户设置
    function loadUserSettings() {
        try {
            const savedSettings = GM_getValue('userSettings');
            if (savedSettings) {
                userSettings = { ...userSettings, ...savedSettings };
            }
            // 加载强化等级设置
            const savedLevels = GM_getValue('enhancementLevels');
            if (savedLevels && Array.isArray(savedLevels) && savedLevels.length > 0) {
                enhancementLevels = savedLevels;
            }
        } catch (error) {
            console.log('无法加载用户设置，使用默认设置');
        }
    }

    // 保存用户设置
    function saveUserSettings() {
        try {
            GM_setValue('userSettings', userSettings);
            GM_setValue('enhancementLevels', enhancementLevels);
        } catch (error) {
            console.log('无法保存用户设置');
        }
    }

    // 从API获取市场数据
    function fetchMarketDataFromAPI() {
        return new Promise((resolve, reject) => {
            if (isMarketDataLoading && marketDataLoadPromise) {
                return marketDataLoadPromise;
            }
            isMarketDataLoading = true;
            const apiUrl = 'https://www.milkywayidlecn.com/game_data/marketplace.json';
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: apiUrl,
                    timeout: 10000,
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            marketData = data.marketData || {};
                            marketAPITimestamp = data.timestamp || 0;
                            isMarketDataLoading = false;
                            resolve(marketData);
                        } catch (error) {
                            isMarketDataLoading = false;
                            reject(error);
                        }
                    },
                    onerror: function(error) {
                        isMarketDataLoading = false;
                        reject(error);
                    },
                    ontimeout: function() {
                        isMarketDataLoading = false;
                        reject(new Error('请求超时'));
                    }
                });
            } else {
                fetch(apiUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('网络响应不正常');
                        }
                        return response.json();
                    })
                    .then(data => {
                        marketData = data.marketData || {};
                        marketAPITimestamp = data.timestamp || 0;
                        isMarketDataLoading = false;
                        resolve(marketData);
                    })
                    .catch(error => {
                        isMarketDataLoading = false;
                        reject(error);
                    });
            }
        });
    }

    // 获取装备市场最低卖价
    function getMarketAskPrice(itemName, level) {
        if (!marketData || Object.keys(marketData).length === 0) {
            return -1;
        }
        const itemHrid = `/items/${itemName}`;
        if (!marketData[itemHrid]) {
            if (marketData[itemName]) {
                const levelData = marketData[itemName][level.toString()];
                if (levelData && levelData.a && levelData.a > 0) {
                    return levelData.a;
                } else {
                    return -1;
                }
            }
            return -1;
        }
        const levelData = marketData[itemHrid][level.toString()];
        if (!levelData) {
            return -1;
        }
        if (!levelData.a || levelData.a === -1 || levelData.a <= 0) {
            return -1;
        }
        return levelData.a;
    }

    // 格式化市场售价显示
    function formatMarketPrice(price) {
        if (price === -1) return '无数据';
        if (price === 0) return '0';
        return formatNumber(price);
    }

    // 收购工时费和出售工时费的颜色逻辑
    function getHourlyColor(hourlyValue) {
        if (hourlyValue < 0) return '#a0aec0'; // 灰色：<0
        if (hourlyValue === 0) return '#e2e8f0'; // 默认颜色加粗：=0
        if (hourlyValue > 0 && hourlyValue <= 3000000) return '#90EE90'; // 浅绿：0<且<=3M
        if (hourlyValue > 3000000 && hourlyValue <= 8000000) return '#00FF00'; // 绿色：3M<且<=8M
        if (hourlyValue > 8000000 && hourlyValue <= 10000000) return '#FFFF00'; // 黄色：8M<且<=10M
        if (hourlyValue > 10000000 && hourlyValue <= 20000000) return '#FFA500'; // 橙色：10M<且<=20M
        if (hourlyValue > 20000000) return '#FF0000'; // 红色：>20M
        return '#e2e8f0'; // 默认颜色
    }

    // 收购价和出售价的颜色逻辑，如果<=0则灰色
    function getPriceColor(price) {
        if (price <= 0) return '#a0aec0'; // 灰色：<=0
        return '#e2e8f0'; // 默认颜色
    }

    // 将时间字符串转换为小时数
    function parseTimeToHours(timeStr) {
        if (!timeStr) return 0;
        let totalHours = 0;
        if (timeStr.includes('h') || timeStr.includes('m') || timeStr.includes('s')) {
            const hoursMatch = timeStr.match(/(\d+(\.\d+)?)h/);
            if (hoursMatch) {
                totalHours += parseFloat(hoursMatch[1]);
            }
            const minutesMatch = timeStr.match(/(\d+(\.\d+)?)m/);
            if (minutesMatch) {
                totalHours += parseFloat(minutesMatch[1]) / 60;
            }
            const secondsMatch = timeStr.match(/(\d+(\.\d+)?)s/);
            if (secondsMatch) {
                totalHours += parseFloat(secondsMatch[1]) / 3600;
            }
            return totalHours;
        }
        if (timeStr.includes('s') && !timeStr.includes('m') && !timeStr.includes('h')) {
            const secondsMatch = timeStr.match(/(\d+(\.\d+)?)s/);
            if (secondsMatch) {
                const seconds = parseFloat(secondsMatch[1]);
                totalHours = seconds / 3600;
                return totalHours;
            }
        }
        if (timeStr.includes('m') && !timeStr.includes('h')) {
            const minutesMatch = timeStr.match(/(\d+(\.\d+)?)m/);
            if (minutesMatch) {
                const minutes = parseFloat(minutesMatch[1]);
                totalHours = minutes / 60;
                const secondsMatch = timeStr.match(/(\d+(\.\d+)?)s/);
                if (secondsMatch) {
                    totalHours += parseFloat(secondsMatch[1]) / 3600;
                }
                return totalHours;
            }
        }
        return 0;
    }

    // 计算出售工时费，考虑市场手续费
    function calculateSellHourly(marketPrice, materialCost, equipmentCost, timeStr) {
        if (marketPrice <= 0) {
            return 0;
        }
        const hours = parseTimeToHours(timeStr);
        if (hours <= 0) {
            return 0;
        }
        // 出售工时费 = (出售价 * 0.98 - 材料费用 - 装备成本) / 时间(小时)
        const profit = (marketPrice * userSettings.marketFee) - materialCost - equipmentCost;
        const sellHourly = profit / hours;
        return sellHourly;
    }

    // 计算出售利润
    function calculateSellProfit(marketPrice, materialCost, equipmentCost) {
        if (marketPrice <= 0) return 0;
        return (marketPrice * userSettings.marketFee) - materialCost - equipmentCost;
    }

    // 计算出售利润率
    function calculateSellProfitRate(marketPrice, materialCost, equipmentCost) {
        if (marketPrice <= 0) return 0;
        const totalCost = materialCost + equipmentCost;
        if (totalCost <= 0) return 0;
        const profit = (marketPrice * userSettings.marketFee) - totalCost;
        return profit / totalCost;
    }

    // 确保选择成品售价选项卡
    function ensureProductPriceTab() {
        try {
            const tabs = document.querySelectorAll('.el-tabs__item');
            let productPriceTab = null;
            for (let tab of tabs) {
                if (tab.textContent.trim() === '成品售价') {
                    productPriceTab = tab;
                    break;
                }
            }
            if (!productPriceTab) {
                return false;
            }
            if (productPriceTab.classList.contains('is-active')) {
                return true;
            }
            productPriceTab.click();
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(true);
                }, 300);
            });
        } catch (error) {
            return false;
        }
    }

    // 设置强化等级
    function setEnhancementLevel(level) {
        try {
            const cells = document.querySelectorAll('.el-table__cell');
            let targetCell = null;
            for (let cell of cells) {
                if (cell.textContent.trim() === '目标:') {
                    targetCell = cell;
                    break;
                }
            }
            if (!targetCell) {
                return false;
            }
            const row = targetCell.closest('tr');
            if (!row) {
                return false;
            }
            const input = row.querySelector('input[type="number"]');
            if (!input) {
                return false;
            }
            input.value = level;
            const event = new Event('input', { bubbles: true });
            input.dispatchEvent(event);
            const changeEvent = new Event('change', { bubbles: true });
            input.dispatchEvent(changeEvent);
            return true;
        } catch (error) {
            return false;
        }
    }

    // 更新面板标题
    function updatePanelTitle() {
        const titleElement = panel.querySelector('#panel-title');
        if (titleElement) {
            const levelsText = enhancementLevels.map(l => `+${l}`).join('、');
            titleElement.innerHTML = `强化数据分析（${levelsText}） <span style="font-size: 10px; color: #a0aec0; font-weight: normal;">按F1隐藏/显示</span>`;
        }
    }

    // 解析数字（支持K/M/B单位和逗号分隔）
    const parseNumber = str => {
        if (!str) return 0;
        const s = str.toString().trim().toUpperCase().replace(/,/g, '');
        const map = { 'K': 1e3, 'M': 1e6, 'B': 1e9 };
        const last = s.slice(-1);
        return parseFloat(map[last] ? s.slice(0, -1) : s) * (map[last] || 1);
    };

    // 获取装备价格
    function getEquipmentPrice() {
        let priceInput = null;
        const targetCell = document.querySelector('[class*="el-table_"][class*="_column_"][class*="is-center"]');
        if (targetCell) {
            priceInput = targetCell.querySelector('.el-input__inner');
        }
        if (!priceInput) {
            const tables = document.querySelectorAll('.el-table__body');
            if (tables.length > 1) {
                const secondTable = tables[1];
                priceInput = secondTable.querySelector('.el-input__inner');
            } else {
                priceInput = document.querySelector('.el-input__inner');
            }
        }
        if (!priceInput) {
            return 0;
        }
        if (priceInput.value && priceInput.value !== "-1" && priceInput.value !== "") {
            const value = parseNumber(priceInput.value);
            return value;
        }
        if (priceInput.placeholder && priceInput.placeholder !== "-1" && priceInput.placeholder !== "") {
            const value = parseNumber(priceInput.placeholder);
            return value;
        }
        const ariaValue = priceInput.getAttribute('aria-valuenow');
        if (ariaValue && ariaValue !== "-1" && ariaValue !== "") {
            const value = parseNumber(ariaValue);
            return value;
        }
        return 0;
    }

    // 获取成品售价
    function getProductPrice() {
        const priceElements = Array.from(document.querySelectorAll('.font-size-14px'));
        const priceLabel = priceElements.find(el => el.textContent.trim() === '价格');
        if (!priceLabel) {
            return 0;
        }
        const parentContainer = priceLabel.closest('.flex.justify-between.items-center');
        if (!parentContainer) {
            return 0;
        }
        const priceInput = parentContainer.querySelector('.el-input__inner');
        if (!priceInput) {
            return 0;
        }
        let priceValue = priceInput.value || priceInput.placeholder;
        if (!priceValue || priceValue === "-1" || priceValue === "") {
            return 0;
        }
        return parseNumber(priceValue);
    }

    // 从次数字符串中提取数字
    function extractAttemptsNumber(attemptsStr) {
        if (!attemptsStr) return 0;

        const cleanStr = attemptsStr.replace(/[^\d]/g, '');
        if (cleanStr) {
            return parseInt(cleanStr, 10);
        }
        return 0;

     //   const match = attemptsStr.match(/\d+/);
      //  return match ? parseInt(match[0], 10) : 0;
    }

    // 计算单次材料成本
    function calculateMaterialCostPerAttempt(materialCost, attempts) {
        const attemptsNumber = extractAttemptsNumber(attempts);
        if (attemptsNumber === 0) return 0;
        return materialCost / attemptsNumber;
    }

    // 从装备按钮获取装备名称
    function getItemNameFromButton(buttonElement) {
        const useElement = buttonElement.querySelector('use');
        if (useElement) {
            const href = useElement.getAttribute('xlink:href');
            if (href) {
                const parts = href.split('#');
                if (parts.length > 1) {
                    return parts[1];
                }
            }
            if (useElement.href && useElement.href.baseVal) {
                const parts = useElement.href.baseVal.split('#');
                if (parts.length > 1) {
                    return parts[1];
                }
            }
        }
        return '';
    }

    // 获取保护材料费用
    function getProtectionMaterialCost() {
        try {
            // 查找包含保护物品选择的表格（第二个表格）
            const tables = document.querySelectorAll('.el-table');
            let protectionTable = null;

            for (let table of tables) {
                // 查找包含el-radio-group的表格，这是保护物品选择表格
                if (table.querySelector('.el-radio-group')) {
                    protectionTable = table;
                    break;
                }
            }

            if (!protectionTable) {
                return { originalValue: -1, parsedValue: -1 };
            }

            // 在保护表格中查找输入框
            const inputWrapper = protectionTable.querySelector('.el-input__wrapper');
            if (!inputWrapper) {
                return { originalValue: -1, parsedValue: -1 };
            }

            const input = inputWrapper.querySelector('.el-input__inner');
            if (!input) {
                return { originalValue: -1, parsedValue: -1 };
            }

            // 获取placeholder值
            const placeholder = input.getAttribute('placeholder');

            if (!placeholder || placeholder === "-1" || placeholder === "") {
                return { originalValue: placeholder, parsedValue: -1 };
            } else {
                // 解析placeholder的值
                return { originalValue: placeholder, parsedValue: parseNumber(placeholder) };
            }
        } catch (error) {
            return { originalValue: -1, parsedValue: -1 };
        }
    }

    // 设置保护材料费用
    function setProtectionMaterialCost(cost) {
        try {
            // 查找包含保护物品选择的表格（第二个表格）
            const tables = document.querySelectorAll('.el-table');
            let protectionTable = null;

            for (let table of tables) {
                // 查找包含el-radio-group的表格，这是保护物品选择表格
                if (table.querySelector('.el-radio-group')) {
                    protectionTable = table;
                    break;
                }
            }

            if (!protectionTable) {
                return false;
            }

            // 在保护表格中查找输入框
            const inputWrapper = protectionTable.querySelector('.el-input__wrapper');
            if (!inputWrapper) {
                return false;
            }

            const input = inputWrapper.querySelector('.el-input__inner');
            if (!input) {
                return false;
            }

            // 设置值
            input.value = cost;

            // 触发输入事件
            const event = new Event('input', { bubbles: true });
            input.dispatchEvent(event);

            // 触发变化事件
            const changeEvent = new Event('change', { bubbles: true });
            input.dispatchEvent(changeEvent);

            return true;
        } catch (error) {
            return false;
        }
    }

    // 获取单条数据 - 添加重试逻辑
    async function getData(isChecked, index, itemName, currentLevel, retryCount = 0) {
        const maxRetries = 1; // 最大重试次数

        const getRowData = (rowIndex = 0) => {
            const rows = document.querySelectorAll('.el-table__row');
            if (!rows || rows.length === 0) return {
                value: 0,
                time: '',
                materialCost: 0,
                profitRate: '',
                unitProfit: 0,
                protectionLevel: '',
                attempts: '',
                experience: ''
            };
            const el = rows[rowIndex];
            if (!el) return {
                value: 0,
                time: '',
                materialCost: 0,
                profitRate: '',
                unitProfit: 0,
                protectionLevel: '',
                attempts: '',
                experience: ''
            };
            const cells = el.querySelectorAll('.el-table__cell');
            const protectionLevelCell = cells[0];
            const attemptsCell = cells[1];
            const timeCell = cells[2];
            const experienceCell = cells[3];
            const valueCell = el.lastElementChild;
            const materialCostIndex = cells.length - 5;
            const profitRateIndex = cells.length - 3;
            const unitProfitIndex = cells.length - 2;
            let materialCost = 0;
            let profitRate = '';
            let unitProfit = 0;
            let protectionLevel = '';
            let attempts = '';
            let experience = '';
            if (protectionLevelCell) {
                try {
                    const protectionLevelCellContent = protectionLevelCell.querySelector('.cell');
                    if (protectionLevelCellContent) {
                        protectionLevel = protectionLevelCellContent.textContent.trim();
                    }
                } catch (error) {}
            }
            if (attemptsCell) {
                try {
                    const attemptsCellContent = attemptsCell.querySelector('.cell');
                    if (attemptsCellContent) {
                        attempts = attemptsCellContent.textContent.trim();
                    }
                } catch (error) {}
            }
            if (experienceCell) {
                try {
                    const experienceCellContent = experienceCell.querySelector('.cell');
                    if (experienceCellContent) {
                        experience = experienceCellContent.textContent.trim();
                    }
                } catch (error) {}
            }
            if (cells[materialCostIndex]) {
                try {
                    const materialCostCell = cells[materialCostIndex].querySelector('.cell');
                    if (materialCostCell) {
                        const materialCostText = materialCostCell.textContent.trim();
                        materialCost = parseNumber(materialCostText);
                    }
                } catch (error) {}
            }
            if (cells[profitRateIndex]) {
                try {
                    const profitRateCell = cells[profitRateIndex].querySelector('.cell');
                    if (profitRateCell) {
                        profitRate = profitRateCell.textContent.trim();
                    }
                } catch (error) {}
            }
            if (cells[unitProfitIndex]) {
                try {
                    const unitProfitCell = cells[unitProfitIndex].querySelector('.cell');
                    if (unitProfitCell) {
                        const unitProfitText = unitProfitCell.textContent.trim();
                        unitProfit = parseNumber(unitProfitText);
                    }
                } catch (error) {}
            }
            return {
                value: parseNumber(valueCell.innerText),
                time: timeCell ? timeCell.querySelector('.cell').textContent.trim() : '',
                materialCost: materialCost,
                profitRate: profitRate,
                unitProfit: unitProfit,
                protectionLevel: protectionLevel,
                attempts: attempts,
                experience: experience
            };
        };
        const herfElement = document.querySelector('.el-card__body .el-button').parentElement.querySelector('use');
        const herf = herfElement ? herfElement.href.baseVal : '';
        const getValueByColor = (color) => {
            const el = document.querySelector(`.el-table__row[style*="${color}"]`);
            if (el) {
                const cells = el.querySelectorAll('.el-table__cell');
                const protectionLevelCell = cells[0];
                const attemptsCell = cells[1];
                const timeCell = cells[2];
                const experienceCell = cells[3];
                const valueCell = el.lastElementChild;
                const materialCostIndex = cells.length - 5;
                const profitRateIndex = cells.length - 3;
                const unitProfitIndex = cells.length - 2;
                let materialCost = 0;
                let profitRate = '';
                let unitProfit = 0;
                let protectionLevel = '';
                let attempts = '';
                let experience = '';
                if (protectionLevelCell) {
                    try {
                        const protectionLevelCellContent = protectionLevelCell.querySelector('.cell');
                        if (protectionLevelCellContent) {
                            protectionLevel = protectionLevelCellContent.textContent.trim();
                        }
                    } catch (error) {}
                }
                if (attemptsCell) {
                    try {
                        const attemptsCellContent = attemptsCell.querySelector('.cell');
                        if (attemptsCellContent) {
                            attempts = attemptsCellContent.textContent.trim();
                        }
                    } catch (error) {}
                }
                if (experienceCell) {
                    try {
                        const experienceCellContent = experienceCell.querySelector('.cell');
                        if (experienceCellContent) {
                            experience = experienceCellContent.textContent.trim();
                        }
                    } catch (error) {}
                }
                if (cells[materialCostIndex]) {
                    try {
                        const materialCostCell = cells[materialCostIndex].querySelector('.cell');
                        if (materialCostCell) {
                            const materialCostText = materialCostCell.textContent.trim();
                            materialCost = parseNumber(materialCostText);
                        }
                    } catch (error) {}
                }
                if (cells[profitRateIndex]) {
                    try {
                        const profitRateCell = cells[profitRateIndex].querySelector('.cell');
                        if (profitRateCell) {
                            profitRate = profitRateCell.textContent.trim();
                        }
                    } catch (error) {}
                }
                if (cells[unitProfitIndex]) {
                    try {
                        const unitProfitCell = cells[unitProfitIndex].querySelector('.cell');
                        if (unitProfitCell) {
                            const unitProfitText = unitProfitCell.textContent.trim();
                            unitProfit = parseNumber(unitProfitText);
                        }
                    } catch (error) {}
                }
                return {
                    value: parseNumber(valueCell.innerText),
                    time: timeCell ? timeCell.querySelector('.cell').textContent.trim() : '',
                    materialCost: materialCost,
                    profitRate: profitRate,
                    unitProfit: unitProfit,
                    protectionLevel: protectionLevel,
                    attempts: attempts,
                    experience: experience
                };
            } else {
                return getRowData(0);
            }
        };
        const hourlyRateData = getValueByColor('rgb(34, 68, 34)');
        let equipmentCost = getEquipmentPrice();
        let productPrice = getProductPrice();
        let materialCostPerAttempt = calculateMaterialCostPerAttempt(hourlyRateData.materialCost, hourlyRateData.attempts);

        // 获取保护材料费用
        let protectionMaterialCostInfo = getProtectionMaterialCost();
        let protectionMaterialCost = protectionMaterialCostInfo.parsedValue;

        // 如果保护材料费用是-1或空，且没有超过重试次数，则设置值并重试
        if ((protectionMaterialCost === -1 || protectionMaterialCost === 0) && retryCount < maxRetries) {
            const success = setProtectionMaterialCost(10500000);
            if (success) {
                // 等待界面更新
                await new Promise(resolve => setTimeout(resolve, 500));
                // 重新收集这个装备的数据
                return getData(isChecked, index, itemName, currentLevel, retryCount + 1);
            }
        }

        // 如果重试后还是-1，使用10500000作为默认值
        if (protectionMaterialCost === -1 && retryCount > 0) {
            protectionMaterialCost = 10500000;
        }

        let marketAskPrice = -1;
        if (itemName) {
            marketAskPrice = getMarketAskPrice(itemName, currentLevel);
        }
        let sellHourly = 0;
        if (marketAskPrice > 0) {
            sellHourly = calculateSellHourly(
                marketAskPrice,
                hourlyRateData.materialCost,
                equipmentCost,
                hourlyRateData.time
            );
        }
        // 计算出售利润和利润率
        let sellProfit = 0;
        let sellProfitRate = 0;
        if (marketAskPrice > 0) {
            sellProfit = calculateSellProfit(marketAskPrice, hourlyRateData.materialCost, equipmentCost);
            sellProfitRate = calculateSellProfitRate(marketAskPrice, hourlyRateData.materialCost, equipmentCost);
        }
        if (isChecked && equipmentCost > 0) {
            equipmentPrices[index] = equipmentCost;
        }
        return {
            herf,
            itemName: itemName,
            buyHourly: hourlyRateData.value,
            hourlyRateTime: hourlyRateData.time,
            materialCost: hourlyRateData.materialCost,
            materialCostPerAttempt: materialCostPerAttempt,
            profitRate: hourlyRateData.profitRate,
            unitProfit: hourlyRateData.unitProfit,
            equipmentCost: equipmentCost,
            productPrice: productPrice,
            marketAskPrice: marketAskPrice,
            sellHourly: sellHourly,
            sellProfit: sellProfit, // 出售利润
            sellProfitRate: sellProfitRate, // 出售利润率
            protectionLevel: hourlyRateData.protectionLevel,
            attempts: hourlyRateData.attempts,
            experience: hourlyRateData.experience,
            protectionMaterialCost: protectionMaterialCost, // 保护材料费用
            isChecked,
            enhancementLevel: currentLevel, // 添加强化等级信息
            retryCount: retryCount // 记录重试次数
        };
    }

    // 点击图标功能 - 修改为使用当前行的强化等级
    function clickIcon(index, isChecked, priceType = null, enhancementLevel = null) {
        try {
            setCheckboxState(isChecked).then(() => {
                const startButton = document.querySelector('.el-card__body .el-button');
                if (!startButton) {
                    return;
                }
                startButton.click();
                setTimeout(() => {
                    const dialogBody = document.querySelector('.el-dialog__body');
                    if (!dialogBody) {
                        return;
                    }
                    const items = dialogBody.lastElementChild.querySelectorAll('.el-button');
                    if (items[index]) {
                        items[index].click();
                        setTimeout(() => {
                            // 使用传入的当前行强化等级，而不是数据收集时的等级
                            if (enhancementLevel) {
                                setEnhancementLevel(enhancementLevel);
                            } else {
                                // 如果没有传入等级，则查找数据项中的等级
                                const itemData = currentAllData.find(item =>
                                    item.index === index &&
                                    item.isChecked === isChecked
                                );
                                if (itemData && itemData.enhancementLevel) {
                                    setEnhancementLevel(itemData.enhancementLevel);
                                }
                            }

                            // 根据priceType设置价格
                            const itemData = currentAllData.find(item =>
                                item.index === index &&
                                item.isChecked === isChecked &&
                                item.enhancementLevel === (enhancementLevel || item.enhancementLevel)
                            );

                            if (priceType === 'market' && itemData && itemData.marketAskPrice > 0) {
                                setTimeout(() => {
                                    setProductPrice(itemData.marketAskPrice);
                                }, 200);
                            } else if (priceType === 'product' && itemData && itemData.productPrice > 0) {
                                setTimeout(() => {
                                    setProductPrice(itemData.productPrice);
                                }, 200);
                            }

                            focusOnRow(index);
                        }, 200);
                    }
                }, 300);
            });
        } catch (error) {
            console.error('点击图标时出错:', error);
        }
    }

    // 设置成品售价
    function setProductPrice(price) {
        try {
            const priceElements = Array.from(document.querySelectorAll('.font-size-14px'));
            const priceLabel = priceElements.find(el => el.textContent.trim() === '价格');
            if (!priceLabel) {
                return false;
            }
            const parentContainer = priceLabel.closest('.flex.justify-between.items-center');
            if (!parentContainer) {
                return false;
            }
            const priceInput = parentContainer.querySelector('.el-input__inner');
            if (!priceInput) {
                return false;
            }

            // 设置价格值
            priceInput.value = price;

            // 触发输入事件
            const event = new Event('input', { bubbles: true });
            priceInput.dispatchEvent(event);

            // 触发变化事件
            const changeEvent = new Event('change', { bubbles: true });
            priceInput.dispatchEvent(changeEvent);

            return true;
        } catch (error) {
            return false;
        }
    }

    // 聚焦到特定行
    function focusOnRow(index) {
        const tableContainer = panel.querySelector('.table-container');
        if (tableContainer) {
            tableScrollPosition = tableContainer.scrollTop;
        }
        focusedRowIndex = index;
        lastFocusedRowIndex = index;
        updateTableDisplay();
        setTimeout(() => {
            const tableContainer = panel.querySelector('.table-container');
            if (tableContainer && focusedRowIndex >= 0) {
                tableContainer.scrollTop = 0;
            }
        }, 50);
    }

    // 显示全部行
    function showAllRows() {
        const tableContainer = panel.querySelector('.table-container');
        if (tableContainer) {
            tableScrollPosition = tableContainer.scrollTop;
        }
        focusedRowIndex = -1;
        updateTableDisplay();
        setTimeout(() => {
            const tableContainer = panel.querySelector('.table-container');
            if (tableContainer) {
                if (lastFocusedRowIndex >= 0) {
                    const filteredData = filterInvalidData(currentAllData);
                    const sortedData = sortData(filteredData, userSettings.sortField, userSettings.sortOrder);
                    const focusedRowPosition = sortedData.findIndex(item => item.index === lastFocusedRowIndex);
                    if (focusedRowPosition >= 0) {
                        const rowHeight = 50;
                        const targetScrollTop = focusedRowPosition * rowHeight - 40;
                        tableContainer.scrollTop = targetScrollTop;
                        return;
                    }
                }
                if (tableScrollPosition > 0) {
                    tableContainer.scrollTop = tableScrollPosition;
                }
            }
        }, 100);
    }

    // 更新表格显示
    function updateTableDisplay() {
        if (currentAllData.length > 0) {
            const tableContainer = panel.querySelector('.table-container');
            if (tableContainer && !isRestoringScroll) {
                tableScrollPosition = tableContainer.scrollTop;
            }
            const filteredData = filterInvalidData(currentAllData);
            const tableContent = panel.querySelector('#table-content');
            if (tableContent) {
                tableContent.innerHTML = createSortedTable(filteredData, userSettings.sortField, userSettings.sortOrder);
                if (tableScrollPosition > 0) {
                    isRestoringScroll = true;
                    setTimeout(() => {
                        const newTableContainer = panel.querySelector('.table-container');
                        if (newTableContainer) {
                            newTableContainer.scrollTop = tableScrollPosition;
                        }
                        isRestoringScroll = false;
                    }, 50);
                }
            }
        }
    }

    // 过滤无效数据
    function filterInvalidData(allData) {
        return allData.filter(item => {
            if (!item.isChecked && (item.equipmentCost <= 0 || item.equipmentCost === -1)) {
                return false;
            }
            if (item.equipmentCost < 0) {
                return false;
            }
            if (item.buyHourly <= 0 && item.sellHourly <= 0) {
                return false;
            }
            return true;
        });
    }

    // 检查并设置复选框状态
    function setCheckboxState(shouldBeChecked) {
        return new Promise((resolve) => {
            const checkboxLabel = document.querySelector('.el-checkbox');
            if (!checkboxLabel) {
                resolve();
                return;
            }
            const isChecked = checkboxLabel.classList.contains('is-checked');
            if (isChecked !== shouldBeChecked) {
                checkboxLabel.querySelector('.el-checkbox__original').click();
                setTimeout(resolve, 100);
            } else {
                resolve();
            }
        });
    }

    // 等待元素出现
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            function checkElement() {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime >= timeout) {
                    reject(new Error(`等待元素超时: ${selector}`));
                } else {
                    setTimeout(checkElement, 100);
                }
            }
            checkElement();
        });
    }

    // 收集所有数据 - 修改为支持多等级
    async function collectAllData(statusCallback, isChecked, currentLevel) {
        const allData = [];
        const startButton = document.querySelector('.el-card__body .el-button');
        if (!startButton) throw new Error('未找到起始按钮');
        statusCallback(`正在打开界面（强化+${currentLevel}，${isChecked ? '制作装备' : '非制作装备'}）...`, 0);
        startButton.click();
        try {
            await waitForElement('.el-dialog__body', 3000);
        } catch (error) {
            throw new Error('对话框打开失败');
        }
        const itemsContainer = document.querySelector('.el-dialog__body');
        if (!itemsContainer) throw new Error('未找到项目容器');
        const items = itemsContainer.lastElementChild.querySelectorAll('.el-button');
        await setCheckboxState(isChecked);
        for (let i = 0; i < items.length; i++) {
            if (isPaused) {
                statusCallback(`已暂停 - 处理到项目 ${i + 1}/${items.length}`, (i / items.length) * 100);
                throw new Error('用户暂停');
            }
            try {
                const progress = ((i + 1) / items.length) * 100;
                const itemName = getItemNameFromButton(items[i]);
                // 将百分比放在处理项目前面
                statusCallback(`${Math.round(progress)}% - 处理项目 强化+${currentLevel} ${isChecked ? '制作装备 ' : '非制作装备 '} ${i + 1}/${items.length}（${itemName || '未知装备'}）`, progress);
                items[i].click();
                await new Promise(resolve => setTimeout(resolve, 50));
                const data = await getData(isChecked, i, itemName, currentLevel);
                data.index = i;
                allData.push(data);
            } catch (error) {
                allData.push({
                    index: i,
                    itemName: '',
                    herf: '',
                    buyHourly: 0,
                    hourlyRateTime: '',
                    materialCost: 0,
                    materialCostPerAttempt: 0,
                    profitRate: '',
                    unitProfit: 0,
                    equipmentCost: 0,
                    productPrice: 0,
                    marketAskPrice: -1,
                    sellHourly: 0,
                    sellProfit: 0,
                    sellProfitRate: 0,
                    protectionLevel: '',
                    attempts: '',
                    experience: '',
                    protectionMaterialCost: 0, // 保护材料费用
                    isChecked,
                    enhancementLevel: currentLevel,
                    error: error.message
                });
            }
        }
        statusCallback(`完成！共处理 ${allData.length} 个项目（强化+${currentLevel}，${isChecked ? '制作装备' : '非制作装备'}）`, 100);
        return allData;
    }

    // 数据排序函数
    function sortData(data, sortField, sortOrder) {
        return [...data].sort((a, b) => {
            let aValue = a[sortField] || 0;
            let bValue = b[sortField] || 0;

            if (sortOrder === 'desc') {
                return bValue - aValue;
            } else {
                return aValue - bValue;
            }
        });
    }

    // 创建排序表格 - 修复滚动条错位问题并全部居中
    function createSortedTable(data, sortField = 'sellHourly', sortOrder = 'desc') {
        const sortedData = sortData(data, sortField, sortOrder);
        let displayData;
        if (focusedRowIndex >= 0) {
            const focusedRowPosition = sortedData.findIndex(item => item.index === focusedRowIndex);
            if (focusedRowPosition >= 0) {
                displayData = [sortedData[focusedRowPosition]];
            } else {
                displayData = sortedData;
            }
        } else {
            displayData = sortedData;
        }

        // 格式化利润率显示
        const formatProfitRate = (rate) => {
            if (rate === 0) return '0%';
            return (rate * 100).toFixed(1) + '%';
        };

        // 改进保护等级显示格式：+10 8保 4次
        const formatProtectionInfo = (protectionLevel, attempts, enhancementLevel) => {
            if (!protectionLevel || !attempts) return '未知';

            const attemptsNumber = extractAttemptsNumber(attempts);
            const formattedAttempts = attemptsNumber.toLocaleString();

            // 新的显示格式：强化等级 保护等级保 次数次
            // 例如：+10 8保 4次
            return `+${enhancementLevel} ${protectionLevel}保 ${formattedAttempts}次`;
        };

        return `
            <div style="background: #2d3748; border: 1px solid #4a5568; border-radius: 6px; overflow: hidden; font-family: Arial, sans-serif;">
                <!-- 表头 - 修复滚动条错位 -->
                <div style="background: #1a202c; border-bottom: 1px solid #4a5568;">
                    <div style="display: flex; border-bottom: 1px solid #4a5568; font-size: 12px; color: #e2e8f0; font-weight: bold;">
                        <div style="flex: 0 0 35px; padding: 10px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">排名</div>
                        <div style="flex: 0 0 50px; padding: 10px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">图标</div>
                        <div style="flex: 1; padding: 10px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">出售工时费</div>
                        <div style="flex: 1; padding: 10px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">收购工时费</div>
                        <!-- 价格列移到利润列前面 -->
                        <div style="flex: 1.2; padding: 10px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">价格</div>
                        <!-- 利润列标题，出售利润在前 -->
                        <div style="flex: 1; padding: 10px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">利润</div>
                        <!-- 利润率列标题 -->
                        <div style="flex: 1; padding: 10px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">利润率</div>
                        <!-- 强化信息列标题 -->
                        <div style="flex: 1; padding: 10px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">强化信息</div>
                        <div style="flex: 0.8; padding: 10px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">时间</div>
                        <div style="flex: 1; padding: 10px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">材料费用</div>
                        <div style="flex: 1; padding: 10px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">装备成本</div>
                        <div style="flex: 0.7; padding: 10px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">经验</div>
                        <!-- 制作装备列移到最后 -->
                        <div style="flex: 0 0 55px; padding: 10px 2px; display: flex; align-items: center; justify-content: center;">制作装备</div>
                    </div>
                </div>
                <!-- 表格内容 - 修复滚动条错位并全部居中 -->
                <div class="table-container" style="max-height: 500px; overflow-y: auto; position: relative;">
                    <style>
                        .table-container::-webkit-scrollbar {
                            width: 8px;
                        }
                        .table-container::-webkit-scrollbar-track {
                            background: #4a5568;
                            border-radius: 4px;
                        }
                        .table-container::-webkit-scrollbar-thumb {
                            background: #718096;
                            border-radius: 4px;
                        }
                        .table-container::-webkit-scrollbar-thumb:hover {
                            background: #a0aec0;
                        }
                        .focused-row {
                            background: #2c5282 !important;
                            border-left: 3px solid #3182ce !important;
                        }
                        .hourly-cell {
                            cursor: pointer;
                            transition: background-color 0.2s;
                        }
                        .hourly-cell:hover {
                            background-color: #4a5568 !important;
                        }
                        /* 修复滚动条导致的错位问题 */
                        .table-scroll-fix {
                            width: 100%;
                            box-sizing: border-box;
                        }
                    </style>
                    <div class="table-scroll-fix">
                        ${displayData.map((item, displayIndex) => {
                            const isFocusedRow = item.index === focusedRowIndex;
                            const isCrafted = item.isChecked;
                            // 使用显示索引+1作为排名，确保每个装备都有独立排名
                            const actualRank = displayIndex + 1;
                            // 使用改进的保护等级显示格式：+10 8保 4次
                            const protectionInfo = formatProtectionInfo(item.protectionLevel, item.attempts, item.enhancementLevel);
                            return `
                            <div class="${isFocusedRow ? 'focused-row' : ''}" style="display: flex; border-bottom: 1px solid #4a5568; font-size: 14px; color: #e2e8f0; ${displayIndex % 2 === 0 ? 'background: #2d3748;' : 'background: #1a202c;'}" data-index="${item.index}">
                                <div style="flex: 0 0 35px; padding: 8px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #e2e8f0;">${actualRank}</div>
                                <div style="flex: 0 0 50px; padding: 8px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">
                                    <div class="icon-cell" data-index="${item.index}" data-is-checked="${item.isChecked}" data-enhancement-level="${item.enhancementLevel}" style="cursor: pointer; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 4px; border: 1px solid #718096; background: #4a5568; transition: all 0.2s;">
                                        ${item.herf ? `<svg width="28" height="28"><use href="${item.herf}"></use></svg>` : '📊'}
                                    </div>
                                </div>
                                <!-- 出售工时费单元格添加点击功能，并传递强化等级 -->
                                <div class="hourly-cell" data-index="${item.index}" data-is-checked="${item.isChecked}" data-enhancement-level="${item.enhancementLevel}" data-price-type="market" style="flex: 1; padding: 8px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">
                                    <div style="font-weight: bold; font-size: 14px; color: ${getHourlyColor(item.sellHourly)}; ${item.sellHourly === 0 ? 'font-weight: bold;' : ''}">${formatNumber(item.sellHourly)}</div>
                                </div>
                                <!-- 收购工时费单元格添加点击功能，并传递强化等级 -->
                                <div class="hourly-cell" data-index="${item.index}" data-is-checked="${item.isChecked}" data-enhancement-level="${item.enhancementLevel}" data-price-type="product" style="flex: 1; padding: 8px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">
                                    <div style="font-weight: bold; font-size: 14px; color: ${getHourlyColor(item.buyHourly)}; ${item.buyHourly === 0 ? 'font-weight: bold;' : ''}">${formatNumber(item.buyHourly)}</div>
                                </div>
                                <!-- 价格列移到利润列前面，全部居中 -->
                                <div style="flex: 1.2; padding: 8px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">
                                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
                                        <!-- 简化价格显示，全部居中 -->
                                        <div style="display: flex; justify-content: center; align-items: center; width: 100%;">
                                            <span style="font-weight: 600; font-size: 12px; color: ${getPriceColor(item.marketAskPrice)}; margin-right: 8px;">${formatMarketPrice(item.marketAskPrice)}</span>
                                            <span style="font-size: 10px; color: #a0aec0;">/</span>
                                            <span style="font-weight: 600; font-size: 12px; color: ${getPriceColor(item.productPrice)}; margin-left: 8px;">${formatNumber(item.productPrice)}</span>
                                        </div>
                                    </div>
                                </div>
                                <!-- 利润列显示格式，出售利润在前，全部居中 -->
                                <div style="flex: 1; padding: 8px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">
                                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
                                        <!-- 第一行：出售利润/收购利润 -->
                                        <div style="display: flex; justify-content: center; align-items: center; width: 100%; margin-bottom: 2px;">
                                            <span style="font-weight: bold; font-size: 12px; color: #e2e8f0; margin-right: 8px;">${formatNumber(item.sellProfit)}</span>
                                            <span style="font-size: 10px; color: #a0aec0;">/</span>
                                            <span style="font-weight: bold; font-size: 12px; color: #e2e8f0; margin-left: 8px;">${formatNumber(item.unitProfit)}</span>
                                        </div>
                                    </div>
                                </div>
                                <!-- 利润率列，全部居中 -->
                                <div style="flex: 1; padding: 8px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">
                                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
                                        <!-- 第二行：出售利润率/收购利润率 -->
                                        <div style="display: flex; justify-content: center; align-items: center; width: 100%;">
                                            <span style="font-size: 10px; color: #e2e8f0; margin-right: 8px;">${formatProfitRate(item.sellProfitRate)}</span>
                                            <span style="font-size: 10px; color: #a0aec0;">/</span>
                                            <span style="font-size: 10px; color: #e2e8f0; margin-left: 8px;">${item.profitRate}</span>
                                        </div>
                                    </div>
                                </div>
                                <!-- 使用改进的保护等级显示格式：+10 8保 4次，全部居中 -->
                                <div style="flex: 1; padding: 8px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">
                                    <div style="font-weight: 600; font-size: 14px; text-align: center; color: #a0aec0;">${protectionInfo}</div>
                                </div>
                                <div style="flex: 0.8; padding: 8px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">
                                    <div style="font-weight: 600; font-size: 14px; text-align: center; color: #a0aec0;">${item.hourlyRateTime || '未知'}</div>
                                </div>
                                <div style="flex: 1; padding: 8px 2px; border-right: 1px solid #4a5568; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                                    <div style="font-weight: bold; font-size: 14px; color: #e2e8f0;">${formatNumber(item.materialCost)}</div>
                                    <div style="font-size: 11px; color: #a0aec0; margin-top: 1px;">${formatNumber(item.materialCostPerAttempt)}/次</div>
                                </div>
                                <div style="flex: 1; padding: 8px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">
                                    <div style="font-weight: 600; font-size: 14px; color: #e2e8f0;">${formatNumber(item.equipmentCost)}</div>
                                </div>
                                <div style="flex: 0.7; padding: 8px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">
                                    <div style="font-weight: 600; font-size: 14px; text-align: center; color: #e2e8f0;">${item.experience || '未知'}</div>
                                </div>
                                <!-- 制作装备列移到最后，全部居中 -->
                                <div style="flex: 0 0 55px; padding: 8px 2px; display: flex; align-items: center; justify-content: center;">
                                    <span style="font-weight: 600; font-size: 14px; color: #a0aec0;">${isCrafted ? '是' : '否'}</span>
                                </div>
                            </div>
                        `}).join('')}
                    </div>
                </div>
                ${focusedRowIndex >= 0 ? `
                    <div style="text-align: center; padding: 12px; background: #1a202c; color: #a0aec0; font-size: 11px; cursor: pointer; border-top: 1px solid #4a5568;" class="show-all-rows">
                        点击展开全部 ${sortedData.length} 项
                    </div>
                ` : ''}
            </div>
        `;
    }

    // 格式化数字函数，支持负数格式化
    function formatNumber(num) {
        const absNum = Math.abs(num);
        let formatted;

        if (absNum >= 1e9) {
            formatted = (absNum / 1e9).toFixed(2) + 'B';
        } else if (absNum >= 1e6) {
            formatted = (absNum / 1e6).toFixed(2) + 'M';
        } else if (absNum >= 1e3) {
            formatted = (absNum / 1e3).toFixed(2) + 'K';
        } else {
            formatted = absNum.toFixed(2);
        }

        // 如果是负数，添加负号
        return num < 0 ? '-' + formatted : formatted;
    }

    // 更新标题提示
    function updateTitleHint(showHint) {
        const titleElement = panel.querySelector('#panel-title');
        if (titleElement) {
            const levelsText = enhancementLevels.map(l => `+${l}`).join('、');
            if (showHint) {
                titleElement.innerHTML = `强化数据分析（${levelsText}） <span style="font-size: 10px; color: #a0aec0; font-weight: normal;">点击图标可打开对应项目 | 按F1隐藏/显示</span>`;
            } else {
                titleElement.innerHTML = `强化数据分析（${levelsText}） <span style="font-size: 10px; color: #a0aec0; font-weight: normal;">按F1隐藏/显示</span>`;
            }
        }
    }

    // 显示结果
    function displayResults(allData) {
        currentAllData = allData;
        hasResults = true;
        focusedRowIndex = -1;
        lastFocusedRowIndex = -1;
        const filteredData = filterInvalidData(allData);
        const resultHTML = `
            <div id="result-section">
                <div id="table-content">${createSortedTable(filteredData, userSettings.sortField, userSettings.sortOrder)}</div>
            </div>
        `;
        const existingResult = panel.querySelector('#result-section');
        if (existingResult) existingResult.remove();
        panel.querySelector('#panel-content').insertAdjacentHTML('beforeend', resultHTML);
        panel.style.width = resultsWidth;
        const sortButtons = panel.querySelector('#sort-buttons');
        if (sortButtons) sortButtons.style.display = 'flex';
        const content = panel.querySelector('#panel-content');
        const progressContainer = panel.querySelector('#progress-container');
        content.style.display = 'block';
        progressContainer.style.display = 'block';
        panel.querySelector('#collapse-btn').textContent = '_';
        updateTitleHint(true);
        const statusDiv = panel.querySelector('#status');
        const levelSection = panel.querySelector('#level-section');
        statusDiv.style.display = 'none';
        if (levelSection) levelSection.style.display = 'none';
        progressContainer.style.display = 'none';

        // 确保重新收集按钮显示
        const startBtn = panel.querySelector('#start-btn');
        startBtn.textContent = '重新收集';
        startBtn.style.background = '#3182ce';
        startBtn.style.display = 'block'; // 确保按钮显示
    }

    // 暂停数据收集
    function pauseCollection() {
        isPaused = true;
        isRunning = false; // 修复：暂停时设置运行状态为false
        const startBtn = panel.querySelector('#start-btn');
        const statusDiv = panel.querySelector('#status');
        startBtn.textContent = '重新收集';
        startBtn.style.background = '#3182ce';
        statusDiv.textContent = '已暂停 - 点击"重新收集"重新开始';
    }

    // 重新开始数据收集 - 彻底修复重新收集问题
    function restartCollection() {
        isPaused = false;
        isRunning = false;
        hasResults = false;
        focusedRowIndex = -1;
        lastFocusedRowIndex = -1;
        currentAllData = []; // 重置数据
        equipmentPrices = {}; // 重置装备价格

        const startBtn = panel.querySelector('#start-btn');
        const statusDiv = panel.querySelector('#status');
        const progressBar = panel.querySelector('#progress-bar');
        const levelSection = panel.querySelector('#level-section');
        const progressContainer = panel.querySelector('#progress-container');

        // 重置UI状态
        startBtn.textContent = '开始收集';
        startBtn.style.background = '#3182ce';
        startBtn.disabled = false; // 确保按钮可用
        startBtn.style.display = 'block'; // 确保按钮显示

        statusDiv.textContent = '已重置 - 可修改设置后重新收集';
        statusDiv.style.display = 'block';

        progressBar.style.width = '0%';
        progressContainer.style.display = 'none';

        if (levelSection) levelSection.style.display = 'block';

        // 移除结果显示
        const existingResult = panel.querySelector('#result-section');
        if (existingResult) existingResult.remove();

        const sortButtons = panel.querySelector('#sort-buttons');
        if (sortButtons) sortButtons.style.display = 'none';

        panel.style.width = normalWidth;
        updateTitleHint(false);
    }

    // 创建控制面板
    function createControlPanel() {
        panel = document.createElement('div');
        panel.id = 'data-collection-panel';
        panel.style.cssText = `
            position: fixed; top: 20px; right: 20px; width: ${normalWidth};
            background: #2d3748; border: 1px solid #4a5568; border-radius: 8px;
            z-index: 9999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #e2e8f0; font-size: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            min-height: 40px; overflow: hidden;
        `;
        let isCollapsed = false;

        // 加载用户设置
        loadUserSettings();

        const levelsText = enhancementLevels.map(l => `+${l}`).join('、');
        panel.innerHTML = `
            <div id="panel-header" style="padding: 12px 16px; cursor: move; background: #1a202c; border-bottom: 1px solid #4a5568; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                <div id="panel-title" style="font-weight: bold; color: #e2e8f0; font-size: 14px; white-space: nowrap; flex: 1; min-width: 200px;">强化数据分析（${levelsText}） <span style="font-size: 10px; color: #a0aec0; font-weight: normal;">按F1隐藏/显示</span></div>
                <div style="display: flex; gap: 8px; align-items: center; white-space: nowrap; flex-shrink: 0;">
                    <!-- 排序按钮顺序，出售工时费放在前面 -->
                    <div id="sort-buttons" style="display: none; gap: 4px; white-space: nowrap;">
                        <button id="tab-sell-hourly" class="tab-btn" style="padding: 4px 8px; background: ${userSettings.sortField === 'sellHourly' ? '#3182ce' : '#4a5568'}; color: #e2e8f0; border: none; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: bold; white-space: nowrap;">出售工时费</button>
                        <button id="tab-buy-hourly" class="tab-btn" style="padding: 4px 8px; background: ${userSettings.sortField === 'buyHourly' ? '#3182ce' : '#4a5568'}; color: #e2e8f0; border: none; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: bold; white-space: nowrap;">收购工时费</button>
                        <button id="tab-sell-profit" class="tab-btn" style="padding: 4px 8px; background: ${userSettings.sortField === 'sellProfit' ? '#3182ce' : '#4a5568'}; color: #e2e8f0; border: none; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: bold; white-space: nowrap;">出售利润</button>
                        <button id="tab-profit" class="tab-btn" style="padding: 4px 8px; background: ${userSettings.sortField === 'unitProfit' ? '#3182ce' : '#4a5568'}; color: #e2e8f0; border: none; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: bold; white-space: nowrap;">收购利润</button>
                        <!-- 重新收集按钮 -->
                        <button id="restart-collection" style="padding: 4px 8px; background: #3182ce; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: bold; white-space: nowrap;">重新收集</button>
                    </div>
                    <button id="settings-btn" style="background: #4a5568; border: none; color: #e2e8f0; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; white-space: nowrap; flex-shrink: 0; transition: background 0.2s;">⚙</button>
                    <button id="collapse-btn" style="background: #4a5568; border: none; color: #e2e8f0; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; white-space: nowrap; flex-shrink: 0; transition: background 0.2s;">_</button>
                </div>
            </div>
            <div id="progress-container" style="padding: 0 16px; background: #1a202c; border-bottom: 1px solid #4a5568; display: none;">
                <div style="height: 4px; background: #4a5568; border-radius: 2px; margin: 8px 0; overflow: hidden;">
                    <div id="progress-bar" style="height: 100%; background: #3182ce; width: 0%; transition: width 0.3s ease;"></div>
                </div>
                <!-- 移除进度条下面的百分比显示 -->
            </div>
            <div id="panel-content" style="padding: 16px;">
                <div id="level-section" style="margin-bottom: 16px; padding: 12px; background: #4a5568; border-radius: 6px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div style="font-size: 13px; color: #e2e8f0; font-weight: bold;">设置强化等级</div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="text" id="enhancement-levels-input" value="${enhancementLevels.join(',')}" placeholder="多个等级用逗号分隔" style="width: 120px; padding: 6px 8px; background: #2d3748; border: 1px solid #718096; border-radius: 4px; font-size: 12px; color: #e2e8f0; outline: none;">
                            <div style="font-size: 10px; color: #a0aec0;">1-20，多选</div>
                        </div>
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                        <button class="level-btn" data-level="5" style="padding: 6px 12px; background: ${enhancementLevels.includes(5) ? '#3182ce' : '#4a5568'}; color: ${enhancementLevels.includes(5) ? '#fff' : '#e2e8f0'}; border: 1px solid ${enhancementLevels.includes(5) ? '#3182ce' : '#718096'}; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; transition: all 0.2s; flex: 1;">+5</button>
                        <button class="level-btn" data-level="7" style="padding: 6px 12px; background: ${enhancementLevels.includes(7) ? '#3182ce' : '#4a5568'}; color: ${enhancementLevels.includes(7) ? '#fff' : '#e2e8f0'}; border: 1px solid ${enhancementLevels.includes(7) ? '#3182ce' : '#718096'}; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; transition: all 0.2s; flex: 1;">+7</button>
                        <button class="level-btn" data-level="10" style="padding: 6px 12px; background: ${enhancementLevels.includes(10) ? '#3182ce' : '#4a5568'}; color: ${enhancementLevels.includes(10) ? '#fff' : '#e2e8f0'}; border: 1px solid ${enhancementLevels.includes(10) ? '#3182ce' : '#718096'}; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; transition: all 0.2s; flex: 1;">+10</button>
                        <button class="level-btn" data-level="12" style="padding: 6px 12px; background: ${enhancementLevels.includes(12) ? '#3182ce' : '#4a5568'}; color: ${enhancementLevels.includes(12) ? '#fff' : '#e2e8f0'}; border: 1px solid ${enhancementLevels.includes(12) ? '#3182ce' : '#718096'}; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; transition: all 0.2s; flex: 1;">+12</button>
                    </div>
                    <div style="margin-top: 8px; display: flex; gap: 6px;">
                        <!-- 将全选/清空合并为一个切换按钮 -->
                        <button id="toggle-all-levels" style="padding: 4px 8px; background: #4a5568; color: #e2e8f0; border: 1px solid #718096; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: bold; transition: all 0.2s; flex: 1;">全选</button>
                        <!-- 将开始收集按钮放在全选按钮右边 -->
                        <button id="start-btn" style="padding: 6px 12px; background: #3182ce; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; white-space: nowrap; flex-shrink: 0; transition: background 0.2s; flex: 1;">开始收集</button>
                    </div>
                </div>
                <div id="status" style="font-size: 11px; color: #a0aec0; min-height: 14px;">准备就绪 - 按F1隐藏/显示面板</div>
            </div>
        `;
        document.body.appendChild(panel);

        // 设置面板
        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'settings-panel';
        settingsPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2d3748;
            border: 1px solid #4a5568;
            border-radius: 8px;
            padding: 20px;
            z-index: 10000;
            min-width: 400px;
            display: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        `;
        settingsPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="color: #e2e8f0; margin: 0;">设置</h3>
                <button id="close-settings" style="background: none; border: none; color: #e2e8f0; font-size: 18px; cursor: pointer;">×</button>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; color: #e2e8f0; margin-bottom: 8px; font-weight: bold;">默认排序字段</label>
                <select id="default-sort-field" style="width: 100%; padding: 8px; background: #4a5568; border: 1px solid #718096; border-radius: 4px; color: #e2e8f0;">
                    <option value="sellHourly" ${userSettings.sortField === 'sellHourly' ? 'selected' : ''}>出售工时费</option>
                    <option value="buyHourly" ${userSettings.sortField === 'buyHourly' ? 'selected' : ''}>收购工时费</option>
                    <option value="sellProfit" ${userSettings.sortField === 'sellProfit' ? 'selected' : ''}>出售利润</option>
                    <option value="unitProfit" ${userSettings.sortField === 'unitProfit' ? 'selected' : ''}>收购利润</option>
                </select>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; color: #e2e8f0; margin-bottom: 8px; font-weight: bold;">默认排序顺序</label>
                <select id="default-sort-order" style="width: 100%; padding: 8px; background: #4a5568; border: 1px solid #718096; border-radius: 4px; color: #e2e8f0;">
                    <option value="desc" ${userSettings.sortOrder === 'desc' ? 'selected' : ''}>降序 (高到低)</option>
                    <option value="asc" ${userSettings.sortOrder === 'asc' ? 'selected' : ''}>升序 (低到高)</option>
                </select>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; color: #e2e8f0; margin-bottom: 8px; font-weight: bold;">税率</label>
                <input type="number" id="market-fee" min="0.01" max="1" step="0.01" value="${userSettings.marketFee}" style="width: 100%; padding: 8px; background: #4a5568; border: 1px solid #718096; border-radius: 4px; color: #e2e8f0;">
                <div style="font-size: 12px; color: #a0aec0; margin-top: 4px;">出售价将乘以这个比例来计算实际收入</div>
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button id="reset-settings" style="padding: 8px 16px; background: #4a5568; color: #e2e8f0; border: 1px solid #718096; border-radius: 4px; cursor: pointer;">重置默认</button>
                <button id="save-settings" style="padding: 8px 16px; background: #3182ce; color: #fff; border: none; border-radius: 4px; cursor: pointer;">保存设置</button>
            </div>
        `;
        document.body.appendChild(settingsPanel);

        // 事件监听器 - 修复：传递强化等级参数
        panel.addEventListener('click', function(e) {
            const iconCell = e.target.closest('.icon-cell');
            if (iconCell) {
                const index = parseInt(iconCell.getAttribute('data-index'));
                const isChecked = iconCell.getAttribute('data-is-checked') === 'true';
                const enhancementLevel = parseInt(iconCell.getAttribute('data-enhancement-level'));
                clickIcon(index, isChecked, null, enhancementLevel);
                return;
            }

            // 工时费单元格点击事件 - 修复：传递强化等级参数
            const hourlyCell = e.target.closest('.hourly-cell');
            if (hourlyCell) {
                const index = parseInt(hourlyCell.getAttribute('data-index'));
                const isChecked = hourlyCell.getAttribute('data-is-checked') === 'true';
                const priceType = hourlyCell.getAttribute('data-price-type');
                const enhancementLevel = parseInt(hourlyCell.getAttribute('data-enhancement-level'));
                clickIcon(index, isChecked, priceType, enhancementLevel);
                return;
            }

            const showAllBtn = e.target.closest('.show-all-rows');
            if (showAllBtn) {
                showAllRows();
                return;
            }
        });

        // 设置按钮事件
        panel.querySelector('#settings-btn').addEventListener('click', () => {
            settingsPanel.style.display = 'block';
        });

        // 关闭设置事件
        settingsPanel.querySelector('#close-settings').addEventListener('click', () => {
            settingsPanel.style.display = 'none';
        });

        // 保存设置事件
        settingsPanel.querySelector('#save-settings').addEventListener('click', () => {
            userSettings.sortField = settingsPanel.querySelector('#default-sort-field').value;
            userSettings.sortOrder = settingsPanel.querySelector('#default-sort-order').value;
            userSettings.marketFee = parseFloat(settingsPanel.querySelector('#market-fee').value);
            saveUserSettings();
            settingsPanel.style.display = 'none';

            // 更新排序按钮状态
            updateSortButtons();

            // 如果有数据显示，重新排序
            if (currentAllData.length > 0) {
                updateTableDisplay();
            }

            // 显示保存成功提示
            const statusDiv = panel.querySelector('#status');
            statusDiv.textContent = '设置已保存';
            setTimeout(() => {
                if (!isRunning) statusDiv.textContent = '准备就绪';
            }, 2000);
        });

        // 重置设置事件
        settingsPanel.querySelector('#reset-settings').addEventListener('click', () => {
            userSettings = {
                sortField: 'sellHourly', // 改为出售工时费
                sortOrder: 'desc',
                showSellProfit: true,
                marketFee: 0.98
            };
            enhancementLevels = [10]; // 重置为默认等级
            settingsPanel.querySelector('#default-sort-field').value = userSettings.sortField;
            settingsPanel.querySelector('#default-sort-order').value = userSettings.sortOrder;
            settingsPanel.querySelector('#market-fee').value = userSettings.marketFee;

            // 更新等级输入框和按钮
            updateLevelInput();
            updateLevelButtons();

            saveUserSettings();

            // 更新排序按钮状态
            updateSortButtons();

            // 显示重置成功提示
            const statusDiv = panel.querySelector('#status');
            statusDiv.textContent = '设置已重置为默认';
            setTimeout(() => {
                if (!isRunning) statusDiv.textContent = '准备就绪';
            }, 2000);
        });

        // 更新等级输入框
        function updateLevelInput() {
            const levelInput = panel.querySelector('#enhancement-levels-input');
            if (levelInput) {
                levelInput.value = enhancementLevels.join(',');
            }
        }

        // 更新等级按钮状态
        function updateLevelButtons() {
            const levelButtons = panel.querySelectorAll('.level-btn');
            levelButtons.forEach(btn => {
                const level = parseInt(btn.getAttribute('data-level'));
                const isActive = enhancementLevels.includes(level);
                btn.style.background = isActive ? '#3182ce' : '#4a5568';
                btn.style.color = isActive ? '#fff' : '#e2e8f0';
                btn.style.border = isActive ? '1px solid #3182ce' : '1px solid #718096';
            });
        }

        // 更新排序按钮状态函数
        function updateSortButtons() {
            const tabSellHourly = panel.querySelector('#tab-sell-hourly');
            const tabBuyHourly = panel.querySelector('#tab-buy-hourly');
            const tabProfit = panel.querySelector('#tab-profit');
            const tabSellProfit = panel.querySelector('#tab-sell-profit');

            if (tabSellHourly && tabBuyHourly && tabProfit && tabSellProfit) {
                tabSellHourly.style.background = userSettings.sortField === 'sellHourly' ? '#3182ce' : '#4a5568';
                tabBuyHourly.style.background = userSettings.sortField === 'buyHourly' ? '#3182ce' : '#4a5568';
                tabProfit.style.background = userSettings.sortField === 'unitProfit' ? '#3182ce' : '#4a5568';
                tabSellProfit.style.background = userSettings.sortField === 'sellProfit' ? '#3182ce' : '#4a5568';
            }
        }

        // 强化等级按钮和输入框事件处理 - 修改为多选模式
        const levelButtons = panel.querySelectorAll('.level-btn');
        const levelInput = panel.querySelector('#enhancement-levels-input');

        // 等级按钮点击事件 - 切换选择状态
        levelButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const level = parseInt(this.getAttribute('data-level'));
                const index = enhancementLevels.indexOf(level);

                if (index === -1) {
                    // 如果不在数组中，添加
                    enhancementLevels.push(level);
                    enhancementLevels.sort((a, b) => a - b); // 排序
                } else {
                    // 如果在数组中，移除
                    enhancementLevels.splice(index, 1);
                }

                // 更新UI
                updateLevelInput();
                updateLevelButtons();
                updatePanelTitle();

                // 保存设置
                saveUserSettings();

                const statusDiv = panel.querySelector('#status');
                const levelsText = enhancementLevels.map(l => `+${l}`).join('、');
                statusDiv.textContent = `已设置强化等级为 ${levelsText}`;
                setTimeout(() => {
                    if (!isRunning) statusDiv.textContent = '准备就绪';
                }, 2000);
            });
        });

        // 等级输入框变化事件
        levelInput.addEventListener('change', function() {
            let value = this.value.trim();
            if (!value) {
                enhancementLevels = [10]; // 默认值
            } else {
                // 解析逗号分隔的数字
                const levels = value.split(',')
                    .map(s => parseInt(s.trim()))
                    .filter(n => !isNaN(n) && n >= 1 && n <= 20);

                if (levels.length > 0) {
                    // 去重并排序
                    enhancementLevels = [...new Set(levels)].sort((a, b) => a - b);
                } else {
                    enhancementLevels = [10]; // 默认值
                }
            }

            // 更新UI
            updateLevelInput();
            updateLevelButtons();
            updatePanelTitle();

            // 保存设置
            saveUserSettings();

            const statusDiv = panel.querySelector('#status');
            const levelsText = enhancementLevels.map(l => `+${l}`).join('、');
            statusDiv.textContent = `已设置强化等级为 ${levelsText}`;
            setTimeout(() => {
                if (!isRunning) statusDiv.textContent = '准备就绪';
            }, 2000);
        });

        // 全选/清空切换按钮
        let isAllSelected = false;
        panel.querySelector('#toggle-all-levels').addEventListener('click', function() {
            if (isAllSelected) {
                // 清空
                enhancementLevels = [];
                this.textContent = '全选';
            } else {
                // 全选
                enhancementLevels = [5, 7, 10, 12];
                this.textContent = '清空';
            }
            isAllSelected = !isAllSelected;

            updateLevelInput();
            updateLevelButtons();
            updatePanelTitle();
            saveUserSettings();

            const statusDiv = panel.querySelector('#status');
            const levelsText = enhancementLevels.map(l => `+${l}`).join('、');
            statusDiv.textContent = isAllSelected ? '已选择所有常用等级' : '已清空等级选择';
            setTimeout(() => {
                if (!isRunning) statusDiv.textContent = '准备就绪';
            }, 2000);
        });

        // 重新收集按钮事件
        panel.querySelector('#restart-collection').addEventListener('click', () => {
            restartCollection();
        });

        // 拖拽功能
        let isDragging = false, currentX = 0, currentY = 0, initialX = 0, initialY = 0;
        const header = panel.querySelector('#panel-header');
        header.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            isDragging = true;
            initialX = e.clientX - currentX;
            initialY = e.clientY - initialY;
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                panel.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        });
        document.addEventListener('mouseup', () => isDragging = false);

        // 折叠功能
        panel.querySelector('#collapse-btn').addEventListener('click', () => {
            const content = panel.querySelector('#panel-content');
            const progressContainer = panel.querySelector('#progress-container');
            if (isCollapsed) {
                content.style.display = 'block';
                progressContainer.style.display = 'block';
                panel.querySelector('#collapse-btn').textContent = '_';
                if (hasResults) {
                    panel.style.width = resultsWidth;
                    const sortButtons = panel.querySelector('#sort-buttons');
                    if (sortButtons) sortButtons.style.display = 'flex';
                } else {
                    panel.style.width = normalWidth;
                }
            } else {
                content.style.display = 'none';
                progressContainer.style.display = 'none';
                panel.querySelector('#collapse-btn').textContent = '□';
                panel.style.width = 'auto';
                panel.style.minWidth = '300px';
            }
            isCollapsed = !isCollapsed;
        });

        // 开始数据收集的主函数 - 修改为支持多等级遍历
        async function startCollection() {
            const startBtn = panel.querySelector('#start-btn');
            const statusDiv = panel.querySelector('#status');
            const progressBar = panel.querySelector('#progress-bar');
            const progressContainer = panel.querySelector('#progress-container');

            isRunning = true;
            isPaused = false;
            startBtn.textContent = '暂停收集';
            startBtn.style.background = '#ed8936';
            progressContainer.style.display = 'block';

            const updateStatus = (message, progress = 0) => {
                statusDiv.textContent = message;
                progressBar.style.width = progress + '%';
            };

            try {
                // 检查是否有选中的等级
                if (enhancementLevels.length === 0) {
                    throw new Error('请至少选择一个强化等级');
                }

                updateStatus('正在加载市场数据...', 5);
                try {
                    await fetchMarketDataFromAPI();
                    updateStatus('市场数据加载完成', 10);
                } catch (error) {
                    updateStatus('市场数据加载失败，继续收集数据...', 10);
                }

                let allData = [];
                const totalLevels = enhancementLevels.length;

                for (let levelIndex = 0; levelIndex < totalLevels; levelIndex++) {
                    const currentLevel = enhancementLevels[levelIndex];
                    const levelProgress = (levelIndex / totalLevels) * 80 + 10; // 10%-90%用于等级遍历

                    if (isPaused) {
                        return;
                    }

                    updateStatus(`正在设置强化等级为 +${currentLevel}...`, levelProgress);
                    const success = setEnhancementLevel(currentLevel);
                    if (!success) {
                        throw new Error('设置强化等级失败，请确保在强化界面');
                    }
                    await new Promise(resolve => setTimeout(resolve, 300));

                    updateStatus(`正在切换到成品售价选项卡（+${currentLevel}）...`, levelProgress + 5);
                    const tabSuccess = await ensureProductPriceTab();
                    if (!tabSuccess) {
                        throw new Error('切换成品售价选项卡失败');
                    }
                    await new Promise(resolve => setTimeout(resolve, 300));

                    equipmentPrices = {};

                    updateStatus(`正在收集制作装备状态数据（+${currentLevel}）...`, levelProgress + 10);
                    const checkedData = await collectAllData(updateStatus, true, currentLevel);
                    if (isPaused) {
                        return;
                    }

                    updateStatus(`正在收集非制作装备状态数据（+${currentLevel}）...`, levelProgress + 40);
                    const uncheckedData = await collectAllData(updateStatus, false, currentLevel);
                    if (isPaused) {
                        return;
                    }

                    allData = [...allData, ...uncheckedData, ...checkedData];
                }

                if (allData.length > 0) {
                    displayResults(allData);
                } else {
                    updateStatus('未收集到数据', 0);
                }
            } catch (error) {
                if (error.message === '用户暂停') {
                    return;
                }
                updateStatus(`错误: ${error.message}`, 0);
                // 出错时重置状态
                isRunning = false;
                startBtn.textContent = '开始收集';
                startBtn.style.background = '#3182ce';
            } finally {
                if (!isPaused) {
                    isRunning = false;
                    startBtn.disabled = false;
                    if (hasResults) {
                        startBtn.textContent = '重新收集';
                        startBtn.style.background = '#3182ce';
                    } else {
                        startBtn.textContent = '开始收集';
                        startBtn.style.background = '#3182ce';
                    }
                }
            }
        }

        // 开始/暂停/重新收集按钮功能 - 彻底修复版本
        panel.querySelector('#start-btn').addEventListener('click', async () => {
            const startBtn = panel.querySelector('#start-btn');

            // 重新收集逻辑：如果有结果且不在运行中，点击即重置并回到设置面板
            if (hasResults && !isRunning) {
                restartCollection();
                return;
            }

            // 暂停逻辑：如果正在运行且没有暂停，点击即暂停
            if (isRunning && !isPaused) {
                pauseCollection();
                return;
            }

            // 恢复逻辑：如果正在运行且已暂停，点击即恢复
            if (isRunning && isPaused) {
                isPaused = false;
                isRunning = true; // 修复：恢复时设置运行状态为true
                startBtn.textContent = '暂停收集';
                startBtn.style.background = '#ed8936';
                const statusDiv = panel.querySelector('#status');
                statusDiv.textContent = '已恢复收集';
                return;
            }

            // 开始新的数据收集
            await startCollection();
        });

        // 标签切换功能
        const tabSellHourly = panel.querySelector('#tab-sell-hourly');
        const tabBuyHourly = panel.querySelector('#tab-buy-hourly');
        const tabProfit = panel.querySelector('#tab-profit');
        const tabSellProfit = panel.querySelector('#tab-sell-profit');

        if (tabSellHourly && tabBuyHourly && tabProfit && tabSellProfit) {
            // 设置初始状态
            updateSortButtons();

            tabSellHourly.addEventListener('click', () => {
                userSettings.sortField = 'sellHourly';
                saveUserSettings();
                updateSortButtons();
                if (currentAllData.length > 0) {
                    updateTableDisplay();
                }
            });

            tabBuyHourly.addEventListener('click', () => {
                userSettings.sortField = 'buyHourly';
                saveUserSettings();
                updateSortButtons();
                if (currentAllData.length > 0) {
                    updateTableDisplay();
                }
            });

            tabProfit.addEventListener('click', () => {
                userSettings.sortField = 'unitProfit';
                saveUserSettings();
                updateSortButtons();
                if (currentAllData.length > 0) {
                    updateTableDisplay();
                }
            });

            tabSellProfit.addEventListener('click', () => {
                userSettings.sortField = 'sellProfit';
                saveUserSettings();
                updateSortButtons();
                if (currentAllData.length > 0) {
                    updateTableDisplay();
                }
            });
        }
    }

    // 初始化
    function init() {
        watchUrlChange();
        updatePanelVisibility();
        setupKeyboardListener(); // 设置键盘监听
        // 初始化时预加载市场数据
        fetchMarketDataFromAPI().catch(error => {
            // 静默失败，不影响主要功能
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();