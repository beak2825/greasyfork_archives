// ==UserScript==
// @name         店小蜜价格助手
// @namespace    http://tampermonkey.net/
// @version      4.1.0
// @description  移除最高价/最低价
// @author       Rayu
// @match        https://www.dianxiaomi.com/web/shopeeSite/edit*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554623/%E5%BA%97%E5%B0%8F%E8%9C%9C%E4%BB%B7%E6%A0%BC%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/554623/%E5%BA%97%E5%B0%8F%E8%9C%9C%E4%BB%B7%E6%A0%BC%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========================================
    // 配置项
    // ========================================
    const CONFIG = {
        // 价格高亮配置
        HIGHLIGHT_COLOR: 'yellow',
        MULTIPLE_THRESHOLD: 5,
        INCLUDE_EQUAL: true,
        DEBOUNCE_DELAY: 300,
    };

    let debounceTimer;

    // ========================================
    // 公共函数:等待元素加载
    // ========================================
    function waitForElement(selector, callback, maxAttempts = 50) {
        let attempts = 0;
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element || attempts >= maxAttempts) {
                clearInterval(interval);
                if (element) callback(element);
            }
            attempts++;
        }, 200);
    }

    // ========================================
    // 公共函数:智能查找价格列
    // ========================================
    function findPriceColumnIndex() {
        const table = document.querySelector('#skuDataInfo table.myj-table');
        if (!table) {
            console.warn('[价格工具] 未找到表格');
            return -1;
        }

        const headers = table.querySelectorAll('thead th');
        let priceColumnIndex = -1;

        headers.forEach((th, index) => {
            const text = th.textContent.trim();
            if ((text.includes('价格') && (text.includes('TWD') || text.includes('$')))
                && !text.includes('促销')) {
                priceColumnIndex = index + 1;
                console.log(`[价格工具] 找到"价格"列，索引为 ${priceColumnIndex}，表头文本: "${text}"`);
            }
        });

        return priceColumnIndex;
    }

    // ========================================
    // 公共函数:获取价格输入框
    // ========================================
    function findPriceInputs() {
        const priceColumnIndex = findPriceColumnIndex();

        if (priceColumnIndex !== -1) {
            const selector = `#skuDataInfo tbody tr td:nth-child(${priceColumnIndex}) .sku-valid-item > div > input.g-form-component:not([disabled])`;
            const inputs = document.querySelectorAll(selector);
            if (inputs.length > 0) {
                console.log(`[价格工具] 通过表头匹配找到 ${inputs.length} 个价格输入框`);
                return Array.from(inputs);
            }
        }

        // 回退策略
        const fallbackSelectors = [
            '#skuDataInfo tbody tr td:nth-child(4) input.g-form-component:not([disabled])',
            '#skuDataInfo tbody tr td:nth-child(5) input.g-form-component:not([disabled])',
        ];

        for (let selector of fallbackSelectors) {
            const inputs = document.querySelectorAll(selector);
            if (inputs.length > 0) {
                console.log(`[价格工具] 使用回退选择器找到 ${inputs.length} 个价格输入框: ${selector}`);
                return Array.from(inputs);
            }
        }

        console.warn('[价格工具] 无法找到任何价格输入框');
        return [];
    }

    // ========================================
    // 功能1: 价格高亮显示
    // ========================================
    function highlightPrices() {
        console.log('[价格高亮] 执行价格高亮...');

        const priceInputs = findPriceInputs();

        if (priceInputs.length === 0) {
            console.log('[价格高亮] 未找到价格输入框');
            return;
        }

        const validPrices = [];
        const inputElements = [];

        priceInputs.forEach(input => {
            input.style.backgroundColor = '';

            const priceStr = input.value.trim();
            const price = parseFloat(priceStr);

            if (!isNaN(price) && price > 0) {
                validPrices.push(price);
                inputElements.push(input);
            }
        });

        if (validPrices.length === 0) {
            console.log('[价格高亮] 没有有效价格可供比较');
            return;
        }

        const minPrice = Math.min(...validPrices);
        const thresholdPrice = minPrice * CONFIG.MULTIPLE_THRESHOLD;

        console.log(`[价格高亮] 最低价: ${minPrice}, 阈值: ${thresholdPrice} (${CONFIG.MULTIPLE_THRESHOLD}倍)`);

        let highlightCount = 0;
        inputElements.forEach(input => {
            const currentPrice = parseFloat(input.value);
            if (!isNaN(currentPrice)) {
                if (CONFIG.INCLUDE_EQUAL) {
                    if (currentPrice >= thresholdPrice) {
                        input.style.backgroundColor = CONFIG.HIGHLIGHT_COLOR;
                        highlightCount++;
                    }
                } else {
                    if (currentPrice > thresholdPrice) {
                        input.style.backgroundColor = CONFIG.HIGHLIGHT_COLOR;
                        highlightCount++;
                    }
                }
            }
        });

        console.log(`[价格高亮] 共高亮 ${highlightCount} 个价格，总计 ${inputElements.length} 个`);
    }

    // ========================================
    // 功能2: 移除极值价格商品
    // ========================================

    // 提取价格数据
    function extractPriceData() {
        const priceInputs = findPriceInputs();
        if (priceInputs.length === 0) return null;

        const priceData = [];

        // 获取所有复选框以便进行映射检查
        const allCheckboxes = getAllCheckboxes();
        console.log(`[DEBUG extractPriceData] 总共 ${allCheckboxes.length} 个复选框, ${priceInputs.length} 个价格输入框`);

        priceInputs.forEach((input, inputIndex) => {
            const value = input.value.trim();
            const price = parseFloat(value);

            if (!isNaN(price) && price > 0) {
                // 找到输入框所在的 tr 元素
                const tr = input.closest('tr');
                // 获取这个 tr 在 tbody 中的真实索引
                const tbody = tr.parentElement;
                const trIndexInTbody = Array.from(tbody.children).indexOf(tr);

                console.log(`[DEBUG extractPriceData] 价格输入框序号: ${inputIndex}, 价格: ${price}, tr在tbody中的索引: ${trIndexInTbody}`);

                // 使用输入框在有效输入框列表中的索引作为rowIndex
                priceData.push({
                    price: price,
                    rowIndex: inputIndex,  // 改用inputIndex而不是trIndexInTbody
                    input: input,
                    trIndexInTbody: trIndexInTbody  // 保留用于调试
                });
            }
        });

        console.log(`[价格移除] 成功提取 ${priceData.length} 个有效价格数据:`, priceData.map(d => `价格${d.price}@行${d.rowIndex}`).join(', '));
        return priceData.length > 0 ? priceData : null;
    }

    // 找到所有最低价和最高价的商品
    function findPriceExtremes(priceData) {
        if (!priceData || priceData.length === 0) return null;

        let minPriceValue = Math.min(...priceData.map(item => item.price));
        let maxPriceValue = Math.max(...priceData.map(item => item.price));

        let minPriceItems = priceData.filter(item => item.price === minPriceValue);
        let maxPriceItems = priceData.filter(item => item.price === maxPriceValue);

        return { minPriceItems, maxPriceItems };
    }

    // 获取分组的复选框信息
    function getCheckboxGroups() {
        const container1 = document.querySelector('#skuAttrInfo > div.form-card-content > div > form > div.sku-attrs-container > div:nth-child(1)');
        const container2 = document.querySelector('#skuAttrInfo > div.form-card-content > div > form > div.sku-attrs-container > div:nth-child(2)');

        const group1 = container1 ? Array.from(container1.querySelectorAll('input[type="checkbox"]:checked')) : [];
        const group2 = container2 ? Array.from(container2.querySelectorAll('input[type="checkbox"]:checked')) : [];

        console.log(`[DEBUG] 变种主题1: ${group1.length}个复选框, 变种主题2: ${group2.length}个复选框`);

        return { group1, group2, container1, container2 };
    }

    // 获取所有已选中的复选框（用于兼容性）
    function getAllCheckboxes() {
        const { group1, group2 } = getCheckboxGroups();
        return [...group1, ...group2];
    }

    // 根据行索引找到对应的复选框并取消勾选（笛卡尔积组合智能移除）
    function uncheckByRowIndex(rowIndex) {
        const { group1, group2 } = getCheckboxGroups();
        const totalCheckboxes = group1.length + group2.length;
        const cartesianProductCount = group1.length * group2.length;

        console.log(`[DEBUG] 主题1: ${group1.length}个复选框, 主题2: ${group2.length}个复选框`);
        console.log(`[DEBUG] 笛卡尔积组合数: ${group1.length}×${group2.length}=${cartesianProductCount}`);

        // 判断哪个变种主题的复选框数量更多（大主题）和更少（小主题）
        const largerGroup = group1.length > group2.length ? group1 : group2;
        const smallerGroup = group1.length > group2.length ? group2 : group1;
        const largerGroupName = group1.length > group2.length ? '变种主题1' : '变种主题2';

        console.log(`[DEBUG] 大主题：${largerGroupName} (${largerGroup.length}个复选框)，小主题：${smallerGroup.length}个复选框`);

        let targetIndex;

        // 如果小主题复选框数量为0，直接使用rowIndex
        if (smallerGroup.length === 0) {
            targetIndex = rowIndex;
            console.log(`[DEBUG] 小主题复选框数量为0，直接使用行索引${rowIndex}`);
        } else if (group1.length < group2.length) {
            // 当主题1 < 主题2时，直接使用rowIndex
            targetIndex = rowIndex;
            console.log(`[DEBUG] 主题1 < 主题2，直接使用行索引${rowIndex}`);
        } else {
            // 使用用户提供的公式计算大主题中要移除的复选框索引
            // 公式：CEILING((行索引+1)/小主题复选框数量, 1) - 1（减1是因为数组索引从0开始）
            targetIndex = Math.ceil((rowIndex + 1) / smallerGroup.length) - 1;
            console.log(`[DEBUG] 价格行索引${rowIndex} → 使用公式CEILING((${rowIndex}+1)/${smallerGroup.length},1)-1 = ${targetIndex}`);
        }

        console.log(`[DEBUG] 映射到${largerGroupName}的第${targetIndex}个复选框`);

        if (targetIndex >= 0 && targetIndex < largerGroup.length) {
            const checkbox = largerGroup[targetIndex];
            if (checkbox && checkbox.checked) {
                console.log(`[DEBUG] 点击${largerGroupName}的复选框${targetIndex}`);
                checkbox.click();
                return true;
            } else {
                console.log(`[DEBUG] ${largerGroupName}的复选框${targetIndex}不存在或未选中`);
                return false;
            }
        } else {
            console.log(`[DEBUG] 计算出的目标索引${targetIndex}超出${largerGroupName}范围(0-${largerGroup.length-1})`);
            return false;
        }
    }

    // 移除最低价商品（只移除第一个）
    async function removeMinPrice() {
        const priceData = extractPriceData();
        if (!priceData || priceData.length === 0) {
            alert('无法提取价格数据');
            return;
        }

        const extremes = findPriceExtremes(priceData);
        if (!extremes || !extremes.minPriceItems || extremes.minPriceItems.length === 0) {
            alert('无法找到最低价');
            return;
        }

        const { minPriceItems } = extremes;
        // 只移除第一个最低价
        const firstItem = minPriceItems[0];

        if (uncheckByRowIndex(firstItem.rowIndex)) {
            console.log(`已移除最低价商品: ¥${firstItem.price}`);
            alert(`成功移除最低价商品\n价格: ¥${firstItem.price}`);
            // 移除后重新高亮
            setTimeout(highlightPrices, 500);
        } else {
            alert('移除失败，请检查页面结构');
        }
    }

    // 移除最高价商品（只移除第一个）
    async function removeMaxPrice() {
        const priceData = extractPriceData();
        if (!priceData || priceData.length === 0) {
            alert('无法提取价格数据');
            return;
        }

        const extremes = findPriceExtremes(priceData);
        if (!extremes || !extremes.maxPriceItems || extremes.maxPriceItems.length === 0) {
            alert('无法找到最高价');
            return;
        }

        const { maxPriceItems } = extremes;
        // 只移除第一个最高价
        const firstItem = maxPriceItems[0];

        if (uncheckByRowIndex(firstItem.rowIndex)) {
            console.log(`已移除最高价商品: ¥${firstItem.price}`);
            alert(`成功移除最高价商品\n价格: ¥${firstItem.price}`);
            // 移除后重新高亮
            setTimeout(highlightPrices, 500);
        } else {
            alert('移除失败，请检查页面结构');
        }
    }

    // ========================================
    // UI: 创建操作按钮
    // ========================================
    function createButtons() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        const minButton = document.createElement('button');
        minButton.textContent = '移除最低价';
        minButton.style.cssText = `
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: background-color 0.3s;
        `;

        minButton.addEventListener('mouseenter', () => {
            minButton.style.backgroundColor = '#45a049';
        });

        minButton.addEventListener('mouseleave', () => {
            minButton.style.backgroundColor = '#4CAF50';
        });

        minButton.addEventListener('click', removeMinPrice);

        const maxButton = document.createElement('button');
        maxButton.textContent = '移除最高价';
        maxButton.style.cssText = `
            padding: 10px 20px;
            background-color: #ff4444;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: background-color 0.3s;
        `;

        maxButton.addEventListener('mouseenter', () => {
            maxButton.style.backgroundColor = '#cc0000';
        });

        maxButton.addEventListener('mouseleave', () => {
            maxButton.style.backgroundColor = '#ff4444';
        });

        maxButton.addEventListener('click', removeMaxPrice);

        container.appendChild(minButton);
        container.appendChild(maxButton);

        document.body.appendChild(container);
    }

    // ========================================
    // 监听器: MutationObserver
    // ========================================
    const observerCallback = function(mutationsList, observer) {
        console.log('[价格工具] DOM变化检测');

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            highlightPrices();
        }, CONFIG.DEBOUNCE_DELAY);
    };

    function startObserver() {
        const targetNode = document.getElementById('skuDataInfo');

        if (targetNode) {
            const config = {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['value']
            };

            const observer = new MutationObserver(observerCallback);
            observer.observe(targetNode, config);

            console.log('[价格工具] MutationObserver 已启动');

            highlightPrices();
        } else {
            console.warn('[价格工具] #skuDataInfo 未找到，重试中...');

            let retryCount = 0;
            const maxRetries = 10;
            const retryInterval = 500;

            const findAndObserve = () => {
                const dynamicTargetNode = document.getElementById('skuDataInfo');
                if (dynamicTargetNode) {
                    const config = {
                        childList: true,
                        subtree: true,
                        attributes: true,
                        attributeFilter: ['value']
                    };
                    const observer = new MutationObserver(observerCallback);
                    observer.observe(dynamicTargetNode, config);
                    highlightPrices();
                    console.log('[价格工具] #skuDataInfo 找到并启动观察器');
                } else if (retryCount < maxRetries) {
                    retryCount++;
                    console.warn(`[价格工具] 重试中 (${retryCount}/${maxRetries})...`);
                    setTimeout(findAndObserve, retryInterval);
                } else {
                    console.error('[价格工具] 多次重试后仍未找到 #skuDataInfo');
                }
            };

            setTimeout(findAndObserve, 1000);
        }
    }

    // 监听价格输入框的 input 事件
    function attachInputListeners() {
        document.addEventListener('input', function(e) {
            if (e.target && e.target.classList && e.target.classList.contains('g-form-component')) {
                const parentTd = e.target.closest('td');
                if (parentTd) {
                    const table = parentTd.closest('table');
                    const skuDataInfo = parentTd.closest('#skuDataInfo');
                    if (table && skuDataInfo && !e.target.disabled) {
                        console.log('[价格工具] 检测到价格输入，重新计算...');
                        clearTimeout(debounceTimer);
                        debounceTimer = setTimeout(() => {
                            highlightPrices();
                        }, CONFIG.DEBOUNCE_DELAY);
                    }
                }
            }
        }, true);
        console.log('[价格工具] Input 事件监听器已附加');
    }

    // ========================================
    // 初始化
    // ========================================
    function init() {
        waitForElement('#skuDataInfo', () => {
            console.log('[价格工具] 检测到SKU数据表格，初始化功能...');
            createButtons();
            startObserver();
            attachInputListeners();
        });
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 延迟执行，确保异步加载的内容也能被处理
    setTimeout(() => {
        console.log('[价格工具] 延迟执行 (1.5s)');
        highlightPrices();
    }, 1500);

    setTimeout(() => {
        console.log('[价格工具] 延迟执行 (4s)');
        highlightPrices();
    }, 4000);

    // 监听页面路由变化（单页应用）
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log('[价格工具] URL变化，重新初始化...');
            setTimeout(() => {
                startObserver();
                highlightPrices();
            }, 2000);
        }
    }).observe(document, {subtree: true, childList: true});

})();