// ==UserScript==
// @name         auto_Enhancelator
// @namespace    http://tampermonkey.net/
// @version      1.0002
// @description  自动收集页面数据并生成排序表格
// @author       baozhi
// @license      CC-BY-NC-SA-4.0
// @match        https://doh-nuts.github.io/Enhancelator/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @gran         GM_setValue
// @grant        GM_getValue
// @connect      www.milkywayidlecn.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556339/auto_Enhancelator.user.js
// @updateURL https://update.greasyfork.org/scripts/556339/auto_Enhancelator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let panel = null;
    let isRunning = false;
    let isPaused = false;
    let currentData = [];
    let currentIndex = 0;
    let marketData = {};
    let selectedLevels = new Set(['10']); // 默认选择+10
    let currentSortField = 'buyHourlyRate';
    let currentSortOrder = 'desc';
    let expandedRows = new Set(); // 用于记录展开的行
    let isPanelVisible = true; // 面板显示状态

    // 检查当前URL是否匹配目标页面
    function isTargetPage() {
        return window.location.href.startsWith('https://doh-nuts.github.io/Enhancelator');
    }

    // 显示或隐藏面板
    function updatePanelVisibility() {
        if (isTargetPage()) {
            if (!panel) createControlPanel();
            if (panel) panel.style.display = isPanelVisible ? 'block' : 'none';
        } else {
            if (panel) panel.style.display = 'none';
        }
    }

    // 切换面板显示/隐藏
    function togglePanelVisibility() {
        isPanelVisible = !isPanelVisible;
        if (panel) {
            panel.style.display = isPanelVisible ? 'block' : 'none';
        }
    }

    // 时间戳转换
    function formatTimestamp(timestamp) {
        const date = new Date(timestamp * 1000);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    }

    const parseNumber = str => {
        const s = str.toString().replace(/,/g, '').trim().toUpperCase();
        const map = { 'K': 1e3, 'M': 1e6, 'B': 1e9 };
        const last = s.slice(-1);
        return parseFloat(map[last] ? s.slice(0, -1) : s) * (map[last] || 1);
    };

    // 格式化数字显示
    function formatNumber(num) {
        if (!num || isNaN(num)) return '';
        if (num < 0) return ''; // 负值显示为空
        if (num >= 1e9) {
            const value = num / 1e9;
            return value % 1 === 0 ? value.toFixed(0) + 'B' : value.toFixed(2) + 'B';
        }
        if (num >= 1e6) {
            const value = num / 1e6;
            return value % 1 === 0 ? value.toFixed(0) + 'M' : value.toFixed(2) + 'M';
        }
        if (num >= 1e3) {
            const value = num / 1e3;
            return value % 1 === 0 ? value.toFixed(0) + 'K' : value.toFixed(2) + 'K';
        }
        return num.toFixed(2);
    }

    // 获取工时费颜色
    function getHourlyRateColor(value) {
        if (!value || value <= 0) return '#a0aec0'; // 灰色 - 0或负值
        if (value <= 3e6) return '#90EE90'; // 浅绿 - 0-3M
        if (value <= 8e6) return '#00FF00'; // 绿色 - 3M-8M
        if (value <= 10e6) return '#FFFF00'; // 黄色 - 8M-10M
        if (value <= 20e6) return '#FFA500'; // 橙色 - 10M-20M
        return '#FF0000'; // 红色 - 20M以上
    }

    // 将时间字符串转换为小时数
    function timeStringToHours(timeStr) {
        const parts = timeStr.split(', ');
        let hours = 0, minutes = 0, seconds = 0;

        for (const part of parts) {
            if (part.includes('h')) {
                hours = parseFloat(part.replace('h', ''));
            } else if (part.includes('m')) {
                minutes = parseFloat(part.replace('m', ''));
            } else if (part.includes('s')) {
                seconds = parseFloat(part.replace('s', ''));
            }
        }

        return hours + (minutes / 60) + (seconds / 3600);
    }

    // 优化时间显示格式
    function formatTime(timeStr) {
        const parts = timeStr.split(', ');
        let hours = 0, minutes = 0, seconds = 0;

        for (const part of parts) {
            if (part.includes('h')) {
                hours = parseInt(part.replace('h', ''));
            } else if (part.includes('m')) {
                minutes = parseInt(part.replace('m', ''));
            } else if (part.includes('s')) {
                seconds = parseInt(part.replace('s', ''));
            }
        }

        if (hours > 0) {
            return `${hours}h${minutes.toString().padStart(2, '0')}m`;
        } else if (minutes > 0) {
            return `${minutes}m${seconds.toString().padStart(2, '0')}s`;
        } else {
            return `${seconds}s`;
        }
    }

    // 获取市场数据
    async function fetchMarketData() {
        try {
            const apiUrl = 'https://www.milkywayidlecn.com/game_data/marketplace.json';
            const response = await fetch(apiUrl);
            const data = await response.json();
            marketData = data.marketData || {};
            console.log('市场数据加载完成');
            return data.timestamp; // 返回时间戳
        } catch (error) {
            console.error('获取市场数据失败:', error);
            return null;
        }
    }

    // 获取物品市场价格
    function getMarketPrice(itemPath, level) {
        if (!marketData[itemPath]) return { a: '', b: '' };

        const itemData = marketData[itemPath][level] || marketData[itemPath]['0'];
        if (!itemData) return { a: '', b: '' };

        return {
            a: itemData.a === -1 ? '' : itemData.a,
            b: itemData.b === -1 ? '' : itemData.b
        };
    }

    // 获取0强化等级的市场价格
    function getBaseMarketPrice(itemPath) {
        if (!marketData[itemPath] || !marketData[itemPath]['0']) return null;
        return marketData[itemPath]['0'].a; // 获取0强化等级的出售价
    }

    // 计算利润
    function calculateProfit(price, matCost, basePrice, taxRate) {
        if (!price) return 0;
        const taxMultiplier = 1 - (taxRate / 100);
        return (price * taxMultiplier) - matCost - basePrice;
    }

    // 计算工时费
    function calculateHourlyRate(profit, hours) {
        if (!profit || !hours || hours === 0) return 0;
        return profit / hours;
    }

    // 自动填充材料价格
    function fillMaterialPrices() {
        console.log('开始填充材料价格...');
        for (let i = 1; i <= 5; i++) {
            const matCell = document.getElementById(`mat_${i}_cell`);
            if (matCell && matCell.style.display !== 'none') {
                const iconElement = document.getElementById(`mat_${i}_icon`).querySelector('use');
                if (iconElement) {
                    const materialHref = iconElement.getAttribute('xlink:href').replace('#', '');
                    const materialPath = `/items/${materialHref}`;

                    console.log(`材料 ${i}: ${materialHref}, 路径: ${materialPath}`);

                    if (marketData[materialPath] && marketData[materialPath]['0']) {
                        const priceData = marketData[materialPath]['0'];
                        const price = priceData.a !== -1 ? priceData.a : (priceData.b !== -1 ? priceData.b : '');

                        console.log(`材料 ${i} 价格数据:`, priceData, `最终价格: ${price}`);

                        if (price && price !== -1) {
                            const priceInput = document.getElementById(`i_prc_${i}`);
                            if (priceInput) {
                                priceInput.value = price;
                                priceInput.placeholder = price;
                                console.log(`已设置材料 ${i} 价格为: ${price}`);

                                // 触发输入事件
                                const event = new Event('input', { bubbles: true });
                                priceInput.dispatchEvent(event);
                            }
                        } else {
                            console.log(`材料 ${i} 价格无效: ${price}`);
                        }
                    } else {
                        console.log(`材料 ${i} 未找到市场价格数据`);
                    }
                } else {
                    console.log(`材料 ${i} 未找到图标元素`);
                }
            } else {
                console.log(`材料 ${i} 单元格不存在或已隐藏`);
            }
        }
        console.log('材料价格填充完成');
    }

    // 自动填充底子价格
    function fillBasePrice(itemData) {
        console.log('开始填充底子价格...');
        const basePriceInput = document.getElementById('i_base_price');
        if (!basePriceInput) {
            console.log('未找到底子价格输入框');
            return;
        }

        // 获取当前装备的0强化市场价格
        const baseMarketPrice = getBaseMarketPrice(itemData);
        if (baseMarketPrice && baseMarketPrice > 0) {
            basePriceInput.value = baseMarketPrice;
            basePriceInput.placeholder = baseMarketPrice;
            console.log(`已设置底子价格为: ${baseMarketPrice}`);

            // 触发输入事件
            const event = new Event('input', { bubbles: true });
            basePriceInput.dispatchEvent(event);
        } else {
            console.log('未找到有效的底子价格');
        }
    }

    function getData(itemData, level) {
        // 只获取绿色行数据 (rgb(34, 68, 34))
        const greenRow = document.querySelector('tr[style*="rgb(34, 68, 34)"]');
        if (!greenRow) {
            console.log('未找到绿色行数据');
            return null;
        }

        const cells = greenRow.querySelectorAll('.results_data_cells');
        if (cells.length < 5) {
            console.log('表格列数不足');
            return null;
        }

        // 第1列: 保护等级
        const protLevel = cells[0].innerText;

        // 第3列: 时间 (字符串)
        const time = cells[2].innerText;

        // 第5列: 经验/小时 (转换为K)
        const expPerHour = parseNumber(cells[4].innerText);

        // 倒数第2列: 材料费用
        const matCost = parseNumber(cells[cells.length - 2].innerText);

        // 获取当前项目的图标
        const herfElement = document.querySelector('#item_slot svg use');
        const herf = herfElement ? herfElement.getAttribute('xlink:href') : '';

        // 获取市场价格
        const marketPrice = getMarketPrice(itemData, level);

        // 获取底子价格和税率 - 使用placeholder值
        const basePriceInput = document.getElementById('i_base_price');
        let basePrice = basePriceInput ? parseNumber(basePriceInput.getAttribute('placeholder') || '0') : 0;

        const taxRateInput = document.getElementById('i_percent_rate');
        const taxRate = taxRateInput ? parseFloat(taxRateInput.getAttribute('placeholder') || '0') : 0;

        // 检查市场价是否更小
        const baseMarketPrice = getBaseMarketPrice(itemData);
        let useMarketPrice = false;
        if (baseMarketPrice && baseMarketPrice > 0 && baseMarketPrice < basePrice) {
            basePrice = baseMarketPrice;
            useMarketPrice = true;
        }

        // 计算利润
        const sellProfit = calculateProfit(marketPrice.a, matCost, basePrice, taxRate);
        const buyProfit = calculateProfit(marketPrice.b, matCost, basePrice, taxRate);

        // 计算工时费
        const hours = timeStringToHours(time);
        const sellHourlyRate = calculateHourlyRate(sellProfit, hours);
        const buyHourlyRate = calculateHourlyRate(buyProfit, hours);

        return {
            herf,
            protLevel,
            time,
            expPerHour,
            matCost,
            basePrice,
            useMarketPrice,
            level,
            itemData,
            marketPrice,
            hours,
            sellProfit,
            buyProfit,
            sellHourlyRate,
            buyHourlyRate,
            enhanceInfo: `+${level} ${protLevel}保`,
            expFormatted: formatNumber(expPerHour),
            matCostFormatted: formatNumber(matCost),
            basePriceFormatted: formatNumber(basePrice),
            sellHourlyRateFormatted: formatNumber(sellHourlyRate),
            buyHourlyRateFormatted: formatNumber(buyHourlyRate),
            sellProfitFormatted: formatNumber(sellProfit),
            buyProfitFormatted: formatNumber(buyProfit),
            priceDisplay: marketPrice.a || marketPrice.b ?
                `${marketPrice.a ? formatNumber(marketPrice.a) : ''} / ${marketPrice.b ? formatNumber(marketPrice.b) : ''}` :
                '',
            profitDisplay: (sellProfit || buyProfit) ?
                `${sellProfit ? formatNumber(sellProfit) : ''} / ${buyProfit ? formatNumber(buyProfit) : ''}` :
                '',
            timeFormatted: formatTime(time)
        };
    }

    function clickIcon(index) {
        try {
            // 打开项目选择界面
            const itemSlot = document.querySelector('#item_slot .item_slot_icon');
            if (itemSlot) {
                itemSlot.click();

                // 等待选择界面打开
                setTimeout(() => {
                    const selItemContainer = document.getElementById('sel_item_container');
                    if (selItemContainer && selItemContainer.style.display === 'flex') {
                        // 获取所有可选项目
                        const items = selItemContainer.querySelectorAll('#sel_item .sel_item_div');
                        if (items[index]) {
                            const itemData = items[index].getAttribute('data');

                            items[index].click();

                            // 自动填充材料价格和底子价格
                            setTimeout(() => {
                                fillMaterialPrices();
                                fillBasePrice(itemData);
                            }, 50);

                            // 等待选择界面关闭和数据更新
                            setTimeout(() => {
                                // 确保选择界面关闭
                                if (selItemContainer.style.display === 'flex') {
                                    const closeBtn = selItemContainer.querySelector('.close.btn');
                                    if (closeBtn) closeBtn.click();
                                }
                            }, 50);
                        }
                    }
                }, 50);
            }
        } catch (error) {
            console.error('点击图标失败:', error);
        }
    }

    // 切换表格行展开状态
    function toggleRow(index) {
        if (expandedRows.has(index)) {
            expandedRows.delete(index);
        } else {
            expandedRows.clear();
            expandedRows.add(index);
        }
        return expandedRows.has(index);
    }

    async function collectAllData(statusCallback) {
        currentData = [];
        currentIndex = 0;

        // 检查市场数据
        if (Object.keys(marketData).length === 0) {
            statusCallback('正在获取市场数据...', 0);
            const marketTimestamp = await fetchMarketData();
            if (marketTimestamp) {
                // 更新时间显示
                const updateTimeSpan = document.getElementById('script_update_time');
                if (updateTimeSpan) {
                    updateTimeSpan.textContent = formatTimestamp(marketTimestamp);
                }
            } else {
                statusCallback('市场数据获取失败，继续收集...', 0);
            }
        }

        // 打开项目选择界面
        statusCallback('正在打开项目选择界面...', 5);
        const itemSlot = document.querySelector('#item_slot .item_slot_icon');
        if (!itemSlot) {
            statusCallback('错误: 未找到项目选择按钮', 0);
            return currentData;
        }

        itemSlot.click();
        await new Promise(resolve => setTimeout(resolve, 100));

        // 获取项目选择容器
        const selItemContainer = document.getElementById('sel_item_container');
        if (!selItemContainer || selItemContainer.style.display !== 'flex') {
            statusCallback('错误: 项目选择界面未打开', 0);
            return currentData;
        }

        // 获取所有可选项目
        const items = selItemContainer.querySelectorAll('#sel_item .sel_item_div');
        if (items.length === 0) {
            statusCallback('错误: 未找到可选项目', 0);
            // 关闭选择界面
            const closeBtn = selItemContainer.querySelector('.close.btn');
            if (closeBtn) closeBtn.click();
            return currentData;
        }

        const totalItems = items.length * selectedLevels.size;
        let processedItems = 0;

        statusCallback(`找到 ${items.length} 个项目，${selectedLevels.size} 个等级，开始收集数据...`, 10);

        for (let i = 0; i < items.length; i++) {
            // 检查是否暂停
            if (isPaused) {
                statusCallback(`已暂停 - 已完成 ${processedItems}/${totalItems} 项`,
                             10 + (processedItems / totalItems) * 85);
                return currentData;
            }

            try {
                // 点击项目
                items[i].click();
                await new Promise(resolve => setTimeout(resolve, 30));

                // 等待数据更新
                await new Promise(resolve => setTimeout(resolve, 30));

                const itemData = items[i].getAttribute('data');
                const itemName = items[i].getAttribute('value') || `项目${i + 1}`;

                // 为每个选中的等级收集数据
                for (const level of selectedLevels) {
                    currentIndex = processedItems;
                    const progress = 10 + ((processedItems + 1) / totalItems) * 85;
                    statusCallback(`处理 ${itemName} +${level} (${processedItems + 1}/${totalItems})`, progress);

                    // 设置强化等级
                    const stopAtInput = document.getElementById('i_stop_at');
                    if (stopAtInput) {
                        stopAtInput.value = level;
                        const event = new Event('input', { bubbles: true });
                        stopAtInput.dispatchEvent(event);
                    }

                    // 等待数据更新
                    await new Promise(resolve => setTimeout(resolve, 30));

                    const data = getData(itemData, level);
                    if (data) {
                        data.index = i;
                        data.name = itemName;
                        currentData.push(data);
                    }

                    processedItems++;
                }

            } catch (error) {
                const itemData = items[i].getAttribute('data');
                const itemName = items[i].getAttribute('value') || `项目${i + 1}`;

                // 为每个选中的等级添加错误数据
                for (const level of selectedLevels) {
                    currentData.push({
                        index: i,
                        name: itemName,
                        herf: '',
                        protLevel: '0',
                        time: '0h, 0m, 0s',
                        expPerHour: 0,
                        matCost: 0,
                        basePrice: 0,
                        useMarketPrice: false,
                        level: level,
                        itemData: itemData || '',
                        marketPrice: { a: '', b: '' },
                        hours: 0,
                        sellProfit: 0,
                        buyProfit: 0,
                        sellHourlyRate: 0,
                        buyHourlyRate: 0,
                        enhanceInfo: `+${level} 0保`,
                        expFormatted: '',
                        matCostFormatted: '',
                        basePriceFormatted: '',
                        sellHourlyRateFormatted: '',
                        buyHourlyRateFormatted: '',
                        sellProfitFormatted: '',
                        buyProfitFormatted: '',
                        priceDisplay: '',
                        profitDisplay: '',
                        timeFormatted: '0m',
                        error: error.message
                    });
                    processedItems++;
                }
            }
        }

        // 关闭选择界面
        const closeBtn = selItemContainer.querySelector('.close.btn');
        if (closeBtn) closeBtn.click();

        statusCallback('', 100);
        return currentData;
    }

    // 数据过滤逻辑
    function filterData(data) {
        return data.filter(item => {
            // 如果两个工时费都是负数，过滤掉
            if (item.sellHourlyRate < 0 && item.buyHourlyRate < 0) {
                return false;
            }

            // 如果一边是空一边是负数，过滤掉
            if ((!item.marketPrice.a && item.buyHourlyRate < 0) ||
                (!item.marketPrice.b && item.sellHourlyRate < 0)) {
                return false;
            }

            // 如果收购价和出售价都是空，过滤掉
            if (!item.marketPrice.a && !item.marketPrice.b) {
                return false;
            }

            return true;
        });
    }

    // 排序数据
    function sortData(data, field, order) {
        const sortedData = [...data].sort((a, b) => {
            let aValue = a[field] || 0;
            let bValue = b[field] || 0;

            if (order === 'desc') {
                return bValue - aValue;
            } else {
                return aValue - bValue;
            }
        });

        return sortedData;
    }

    function createSortedTable(data) {
        // 过滤数据
        const filteredData = filterData(data);

        // 排序数据
        const sortedData = sortData(filteredData, currentSortField, currentSortOrder);

        // 根据展开状态显示数据
        const displayData = expandedRows.size > 0 ?
            sortedData.filter(item => expandedRows.has(item.index)) :
            sortedData;

        return `
            <div style="background: #2d3748; border: 1px solid #4a5568; border-radius: 6px; overflow: hidden; font-family: Arial, sans-serif;">
                <!-- 表头 - 固定位置 -->
                <div style="background: #1a202c; border-bottom: 1px solid #4a5568; position: sticky; top: 0; z-index: 10;">
                    <div style="display: flex; border-bottom: 1px solid #4a5568; font-size: 12px; color: #e2e8f0; font-weight: bold; min-width: 980px;">
                        <div style="flex: 0 0 40px; padding: 8px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">排名</div>
                        <div style="flex: 0 0 50px; padding: 8px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">图标</div>
                        <div style="flex: 1; padding: 8px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">
                            <button class="sort-btn" data-field="sellHourlyRate" style="background: none; border: none; font-weight: 600; cursor: pointer; width: 100%; text-align: center; white-space: nowrap; color: #e2e8f0; font-size: 11px;">出售工时费 ${currentSortField === 'sellHourlyRate' ? (currentSortOrder === 'desc' ? '▼' : '▲') : ''}</button>
                        </div>
                        <div style="flex: 1; padding: 8px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">
                            <button class="sort-btn" data-field="buyHourlyRate" style="background: none; border: none; font-weight: 600; cursor: pointer; width: 100%; text-align: center; white-space: nowrap; color: #e2e8f0; font-size: 11px;">收购工时费 ${currentSortField === 'buyHourlyRate' ? (currentSortOrder === 'desc' ? '▼' : '▲') : ''}</button>
                        </div>
                        <div style="flex: 1; padding: 8px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center; font-size: 11px;">价格</div>
                        <div style="flex: 1; padding: 8px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center; font-size: 11px;">利润</div>
                        <div style="flex: 1; padding: 8px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center; font-size: 11px;">强化信息</div>
                        <div style="flex: 0.8; padding: 8px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">
                            <button class="sort-btn" data-field="expPerHour" style="background: none; border: none; font-weight: 600; cursor: pointer; width: 100%; text-align: center; white-space: nowrap; color: #e2e8f0; font-size: 11px;">经验 ${currentSortField === 'expPerHour' ? (currentSortOrder === 'desc' ? '▼' : '▲') : ''}</button>
                        </div>
                        <div style="flex: 1; padding: 8px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center; font-size: 11px;">材料费</div>
                        <div style="flex: 1; padding: 8px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center; font-size: 11px;">底子价</div>
                        <div style="flex: 0.8; padding: 8px 2px; display: flex; align-items: center; justify-content: center; font-size: 11px;">时间</div>
                    </div>
                </div>
                <!-- 表格内容 -->
                <div class="table-container" style="max-height: 400px; overflow-y: auto; overflow-x: hidden; position: relative;">
                    <style>
                        .table-container {
                            scrollbar-width: thin;
                            scrollbar-color: transparent transparent;
                        }
                        .table-container:hover {
                            scrollbar-color: #718096 #4a5568;
                        }
                        .table-container::-webkit-scrollbar {
                            width: 8px;
                        }
                        .table-container::-webkit-scrollbar-track {
                            background: transparent;
                            border-radius: 4px;
                        }
                        .table-container::-webkit-scrollbar-thumb {
                            background: transparent;
                            border-radius: 4px;
                        }
                        .table-container:hover::-webkit-scrollbar-track {
                            background: #4a5568;
                        }
                        .table-container:hover::-webkit-scrollbar-thumb {
                            background: #718096;
                        }
                        .table-container:hover::-webkit-scrollbar-thumb:hover {
                            background: #a0aec0;
                        }
                        .hourly-cell {
                            cursor: pointer;
                            transition: background-color 0.2s;
                        }
                        .hourly-cell:hover {
                            background-color: #4a5568 !important;
                        }
                        .table-scroll-fix {
                            width: 100%;
                            box-sizing: border-box;
                            min-width: 980px;
                        }
                        .icon-cell {
                            cursor: pointer;
                            transition: all 0.2s;
                        }
                        .icon-cell:hover {
                            background-color: #4a5568 !important;
                            border-color: #3182ce !important;
                        }
                        .focused-row {
                            background: #2c5282 !important;
                            border-left: 3px solid #3182ce;
                        }
                        .clickable-cell {
                            cursor: pointer;
                            transition: background-color 0.2s;
                        }
                        .clickable-cell:hover {
                            background-color: #4a5568 !important;
                        }
                    </style>
                    <div class="table-scroll-fix">
                        ${displayData.map((item, displayIndex) => {
                            const actualRank = sortedData.findIndex(d => d === item) + 1;
                            const isFocusedRow = expandedRows.size > 0 && expandedRows.has(item.index);
                            return `
                            <div class="${isFocusedRow ? 'focused-row' : ''}" style="display: flex; border-bottom: 1px solid #4a5568; font-size: 12px; color: #e2e8f0; ${displayIndex % 2 === 0 ? 'background: #2d3748;' : 'background: #1a202c;'} min-width: 980px;" data-index="${item.index}">
                                <div style="flex: 0 0 40px; padding: 6px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #e2e8f0;">${actualRank}</div>
                                <div style="flex: 0 0 50px; padding: 6px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">
                                    <div class="icon-cell clickable-cell" data-index="${item.index}" style="width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 4px; border: 1px solid #718096; background: #4a5568; transition: all 0.2s;">
                                        ${item.herf ? `<svg width="24" height="24"><use href="${item.herf}"></use></svg>` : '📊'}
                                    </div>
                                </div>
                                <div class="hourly-cell clickable-cell" data-index="${item.index}" style="flex: 1; padding: 6px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">
                                    <div style="font-weight: bold; font-size: 12px; color: ${getHourlyRateColor(item.sellHourlyRate)};">${item.sellHourlyRateFormatted}</div>
                                </div>
                                <div class="hourly-cell clickable-cell" data-index="${item.index}" style="flex: 1; padding: 6px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">
                                    <div style="font-weight: bold; font-size: 12px; color: ${getHourlyRateColor(item.buyHourlyRate)};">${item.buyHourlyRateFormatted}</div>
                                </div>
                                <div style="flex: 1; padding: 6px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">
                                    <div style="font-weight: 600; font-size: 12px; color: #e2e8f0;">${item.priceDisplay}</div>
                                </div>
                                <div style="flex: 1; padding: 6px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">
                                    <div style="font-weight: 600; font-size: 12px; color: #e2e8f0;">${item.profitDisplay}</div>
                                </div>
                                <div style="flex: 1; padding: 6px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">
                                    <div style="font-weight: 600; font-size: 12px; text-align: center; color: #a0aec0;">${item.enhanceInfo}</div>
                                </div>
                                <div style="flex: 0.8; padding: 6px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">
                                    <div style="font-weight: 600; font-size: 12px; color: #67c23a;">${item.expFormatted}</div>
                                </div>
                                <div style="flex: 1; padding: 6px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">
                                    <div style="font-weight: 600; font-size: 12px; color: #e6a23c;">${item.matCostFormatted}</div>
                                </div>
                                <div style="flex: 1; padding: 6px 2px; border-right: 1px solid #4a5568; display: flex; align-items: center; justify-content: center;">
                                    <div style="font-weight: 600; font-size: 12px; color: ${item.useMarketPrice ? '#85ce61' : '#a0aec0'};">${item.basePriceFormatted}</div>
                                </div>
                                <div style="flex: 0.8; padding: 6px 2px; display: flex; align-items: center; justify-content: center;">
                                    <div style="font-weight: 600; font-size: 12px; text-align: center; color: #a0aec0;">${item.timeFormatted}</div>
                                </div>
                            </div>
                        `}).join('')}
                    </div>
                </div>
                ${expandedRows.size > 0 ? `
                    <div style="text-align: center; padding: 8px; background: #1a202c; color: #a0aec0; font-size: 10px; cursor: pointer; border-top: 1px solid #4a5568;" class="show-all-rows">
                        点击展开全部 ${sortedData.length} 项
                    </div>
                ` : ''}
            </div>
        `;
    }

    function displayResults(data) {
        const resultHTML = `
            <div id="result-section" style="margin-top: 8px;">
                <div id="table-content">${createSortedTable(data)}</div>
            </div>
        `;

        const existingResult = panel.querySelector('#result-section');
        if (existingResult) existingResult.remove();

        panel.querySelector('#panel-content').insertAdjacentHTML('beforeend', resultHTML);
        panel.style.width = '1050px';
        panel.style.height = 'auto';
        panel.style.maxHeight = '500px';

        // 隐藏开始按钮、状态区域和等级选择部分以节省空间
        const startBtn = panel.querySelector('#start-btn');
        const statusDiv = panel.querySelector('#status');
        const levelSelection = panel.querySelector('#level-selection');
        const progressContainer = panel.querySelector('#progress-container');

        if (startBtn) startBtn.style.display = 'none';
        if (statusDiv) statusDiv.style.display = 'none';
        if (levelSelection) levelSelection.style.display = 'none';
        if (progressContainer) progressContainer.style.display = 'none';

        // 压缩面板内容区域
        const panelContent = panel.querySelector('#panel-content');
        if (panelContent) {
            panelContent.style.padding = '8px 12px';
        }

        // 添加排序功能
        panel.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const field = btn.getAttribute('data-field');

                if (currentSortField === field) {
                    // 切换排序顺序
                    currentSortOrder = currentSortOrder === 'desc' ? 'asc' : 'desc';
                } else {
                    // 切换到新的排序字段，默认降序
                    currentSortField = field;
                    currentSortOrder = 'desc';
                }

                // 排序时清空展开的行
                expandedRows.clear();

                // 重新渲染表格
                const tableContent = panel.querySelector('#table-content');
                tableContent.innerHTML = createSortedTable(data);

                // 重新绑定事件
                displayResults(data);
            });
        });

        // 添加显示全部按钮事件
        const showAllBtn = panel.querySelector('.show-all-rows');
        if (showAllBtn) {
            showAllBtn.addEventListener('click', () => {
                expandedRows.clear();
                const tableContent = panel.querySelector('#table-content');
                tableContent.innerHTML = createSortedTable(data);
                displayResults(data);
            });
        }
    }

    // 重新收集功能
    function resetCollection() {
        isRunning = false;
        isPaused = false;
        currentData = [];
        currentIndex = 0;
        expandedRows.clear();

        // 清除现有结果
        const existingResult = panel.querySelector('#result-section');
        if (existingResult) existingResult.remove();

        // 重置UI
        const startBtn = panel.querySelector('#start-btn');
        const statusDiv = panel.querySelector('#status');
        const levelSelection = panel.querySelector('#level-selection');
        const progressBar = panel.querySelector('#progress-bar');
        const progressContainer = panel.querySelector('#progress-container');
        const panelContent = panel.querySelector('#panel-content');

        if (startBtn) {
            startBtn.textContent = '开始收集数据';
            startBtn.style.background = '#3182ce';
            startBtn.style.display = 'block';
        }
        if (statusDiv) {
            statusDiv.textContent = '准备就绪';
            statusDiv.style.display = 'block';
        }
        if (levelSelection) levelSelection.style.display = 'block';
        if (progressBar) progressBar.style.width = '0%';
        if (progressContainer) progressContainer.style.display = 'block';
        if (panelContent) {
            panelContent.style.padding = '16px';
        }

        // 面板宽度恢复
        panel.style.width = '350px';
        panel.style.height = 'auto';
        panel.style.maxHeight = 'none';
    }

    // 切换等级选择
    function toggleLevel(level) {
        if (selectedLevels.has(level)) {
            selectedLevels.delete(level);
        } else {
            selectedLevels.add(level);
        }

        // 更新按钮样式
        updateLevelButtons();

        // 更新选中等级显示
        updateSelectedLevelsDisplay();
    }

    // 更新等级按钮样式
    function updateLevelButtons() {
        const levelButtons = panel.querySelectorAll('.level-btn');
        levelButtons.forEach(btn => {
            const level = btn.getAttribute('data-level');
            if (selectedLevels.has(level)) {
                btn.style.background = '#3182ce';
                btn.style.color = '#fff';
                btn.style.border = '1px solid #3182ce';
            } else {
                btn.style.background = '#4a5568';
                btn.style.color = '#e2e8f0';
                btn.style.border = '1px solid #718096';
            }
        });
    }

    // 更新选中等级显示
    function updateSelectedLevelsDisplay() {
        const selectedLevelsSpan = document.getElementById('script_selected_levels');
        if (selectedLevelsSpan) {
            const levels = Array.from(selectedLevels).sort((a, b) => a - b);
            selectedLevelsSpan.textContent = levels.map(l => `+${l}`).join(', ');
        }
    }

    function createControlPanel() {
        panel = document.createElement('div');
        panel.id = 'data-collection-panel';
        panel.style.cssText = `
            position: fixed; top: 20px; right: 20px; width: 350px;
            background: #2d3748; border: 1px solid #4a5568; border-radius: 8px;
            z-index: 9999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #e2e8f0; font-size: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            backdrop-filter: blur(10px); max-height: 90vh; overflow-y: auto;
        `;

        let isCollapsed = false;

        panel.innerHTML = `
            <div id="panel-header" style="padding: 10px 12px; cursor: move; background: #1a202c; border-bottom: 1px solid #4a5568; border-radius: 8px 8px 0 0; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <button id="reset-btn" style="background: #4a5568; border: 1px solid #718096; color: #e2e8f0; padding: 4px 6px; border-radius: 4px; cursor: pointer; font-size: 10px; transition: all 0.2s;">↻</button>
                    <span style="font-weight: 700; font-size: 13px; color: #90EE90;">搞！</span>
                    <div style="width: 1px; height: 14px; background: #4a5568;"></div>
                    <span id="script_selected_levels" style="color: #3182ce; font-weight: 600; font-size: 11px;">+10</span>
                    <span id="script_update_time" style="color: #e6a23c; font-weight: 600; font-size: 10px;">-</span>
                </div>
                <div style="display: flex; gap: 4px;">
                    <button id="collapse-btn" style="background: #4a5568; border: 1px solid #718096; color: #e2e8f0; padding: 4px 6px; border-radius: 4px; cursor: pointer; font-size: 10px; transition: all 0.2s;">_</button>
                </div>
            </div>
            <div id="progress-container" style="background: #1a202c; border-bottom: 1px solid #4a5568; width: 100%;">
                <div style="height: 3px; background: #4a5568; border-radius: 0; margin: 0; overflow: hidden;">
                    <div id="progress-bar" style="height: 100%; background: linear-gradient(90deg, #90EE90, #00FF00); width: 0%; transition: width 0.3s ease;"></div>
                </div>
            </div>
            <div id="panel-content" style="padding: 12px;">
                <div id="level-selection" style="margin-bottom: 12px; padding: 10px; background: #4a5568; border-radius: 6px;">
                    <div style="font-size: 11px; color: #e2e8f0; margin-bottom: 6px; font-weight: 600;">强化等级选择:</div>
                    <div style="display: flex; gap: 4px; margin-bottom: 8px; flex-wrap: wrap;">
                        <button class="level-btn" data-level="5" style="padding: 5px 8px; background: #4a5568; color: #e2e8f0; border: 1px solid #718096; border-radius: 4px; cursor: pointer; font-size: 10px; transition: all 0.2s; flex: 1;">+5</button>
                        <button class="level-btn" data-level="7" style="padding: 5px 8px; background: #4a5568; color: #e2e8f0; border: 1px solid #718096; border-radius: 4px; cursor: pointer; font-size: 10px; transition: all 0.2s; flex: 1;">+7</button>
                        <button class="level-btn" data-level="8" style="padding: 5px 8px; background: #4a5568; color: #e2e8f0; border: 1px solid #718096; border-radius: 4px; cursor: pointer; font-size: 10px; transition: all 0.2s; flex: 1;">+8</button>
                        <button class="level-btn" data-level="10" style="padding: 5px 8px; background: #3182ce; color: #fff; border: 1px solid #3182ce; border-radius: 4px; cursor: pointer; font-size: 10px; transition: all 0.2s; flex: 1;">+10</button>
                        <button class="level-btn" data-level="12" style="padding: 5px 8px; background: #4a5568; color: #e2e8f0; border: 1px solid #718096; border-radius: 4px; cursor: pointer; font-size: 10px; transition: all 0.2s; flex: 1;">+12</button>
                    </div>
                </div>
                <button id="start-btn" style="width: 100%; padding: 8px; background: #3182ce; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; margin-bottom: 8px; transition: all 0.2s; font-size: 11px; box-shadow: 0 1px 4px rgba(49, 130, 206, 0.3);">开始收集数据</button>
                <div id="status" style="font-size: 10px; color: #a0aec0; min-height: 12px; text-align: center;">准备就绪</div>
            </div>
        `;

        document.body.appendChild(panel);

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
            if (isCollapsed) {
                content.style.display = 'block';
                panel.querySelector('#collapse-btn').textContent = '_';
            } else {
                content.style.display = 'none';
                panel.querySelector('#collapse-btn').textContent = '□';
            }
            isCollapsed = !isCollapsed;
        });

        // 重新收集按钮功能
        panel.querySelector('#reset-btn').addEventListener('click', resetCollection);

        // 等级按钮功能 - 多选
        panel.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const level = btn.getAttribute('data-level');
                toggleLevel(level);
            });
        });

        // 初始化等级按钮样式
        updateLevelButtons();
        updateSelectedLevelsDisplay();

        // 添加图标和工时费点击事件委托
        panel.addEventListener('click', function(e) {
            // 处理图标点击
            const iconCell = e.target.closest('.icon-cell');
            if (iconCell) {
                const index = parseInt(iconCell.getAttribute('data-index'));
                const isExpanded = toggleRow(index);

                // 重新渲染表格，只显示被点击的行
                const tableContent = panel.querySelector('#table-content');
                if (tableContent && currentData.length > 0) {
                    tableContent.innerHTML = createSortedTable(currentData);
                    displayResults(currentData);
                }

                // 执行跳转
                clickIcon(index);
                return;
            }

            // 处理工时费单元格点击
            const hourlyCell = e.target.closest('.hourly-cell');
            if (hourlyCell) {
                const index = parseInt(hourlyCell.getAttribute('data-index'));
                const isExpanded = toggleRow(index);

                // 重新渲染表格，只显示被点击的行
                const tableContent = panel.querySelector('#table-content');
                if (tableContent && currentData.length > 0) {
                    tableContent.innerHTML = createSortedTable(currentData);
                    displayResults(currentData);
                }

                // 执行跳转
                clickIcon(index);
                return;
            }

            // 处理显示全部按钮点击
            const showAllBtn = e.target.closest('.show-all-rows');
            if (showAllBtn) {
                expandedRows.clear();
                const tableContent = panel.querySelector('#table-content');
                if (tableContent && currentData.length > 0) {
                    tableContent.innerHTML = createSortedTable(currentData);
                    displayResults(currentData);
                }
                return;
            }
        });

        // 开始/暂停/重新收集按钮功能
        panel.querySelector('#start-btn').addEventListener('click', async () => {
            const startBtn = panel.querySelector('#start-btn');
            const statusDiv = panel.querySelector('#status');
            const progressBar = panel.querySelector('#progress-bar');

            if (!isRunning) {
                // 检查是否选择了等级
                if (selectedLevels.size === 0) {
                    statusDiv.textContent = '错误: 请至少选择一个强化等级';
                    return;
                }

                // 开始收集
                isRunning = true;
                isPaused = false;
                startBtn.disabled = false;
                startBtn.style.opacity = '1';
                startBtn.textContent = '暂停收集';
                startBtn.style.background = '#ed8936';

                const updateStatus = (message, progress = 0) => {
                    statusDiv.textContent = message;
                    progressBar.style.width = progress + '%';
                };

                try {
                    const data = await collectAllData(updateStatus);
                    if (data.length > 0) {
                        currentData = data; // 保存数据
                        displayResults(data);
                        if (!isPaused) {
                            updateStatus('', 100);
                        }
                    } else {
                        updateStatus('未收集到数据', 0);
                    }
                } catch (error) {
                    updateStatus(`错误: ${error.message}`, 0);
                } finally {
                    if (!isPaused) {
                        isRunning = false;
                        startBtn.disabled = false;
                        startBtn.style.opacity = '1';
                        startBtn.textContent = '开始收集数据';
                        startBtn.style.background = '#3182ce';
                    }
                }
            } else if (isRunning && !isPaused) {
                // 暂停收集
                isPaused = true;
                startBtn.textContent = '重新收集';
                startBtn.style.background = '#e53e3e';
                statusDiv.textContent = `已暂停 - 已完成 ${currentIndex} 项`;
            } else if (isPaused) {
                // 重新收集 - 重置状态
                resetCollection();
            }
        });
    }

    // 添加F1按键监听
    function addF1Listener() {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'F1') {
                e.preventDefault(); // 阻止浏览器默认帮助行为
                togglePanelVisibility();
            }
        });
    }

    // 初始化
    function init() {
        updatePanelVisibility();
        addF1Listener(); // 添加F1按键监听
        // 预加载市场数据
        fetchMarketData().then(timestamp => {
            if (timestamp) {
                const updateTimeSpan = document.getElementById('script_update_time');
                if (updateTimeSpan) {
                    updateTimeSpan.textContent = formatTimestamp(timestamp);
                }
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('强化数据分析脚本已加载！');
})();