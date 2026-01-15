// ==UserScript==
// @name         Zed Market Price Helper
// @namespace    https://github.com/Mrgongm
// @version      1.6.3
// @description  在物品详情中显示市场价格
// @author       Owen
// @license      MIT
// @icon         https://www.zed.city/icons/favicon.svg
// @match        https://www.zed.city/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      api.zed.city
// @downloadURL https://update.greasyfork.org/scripts/560709/Zed%20Market%20Price%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/560709/Zed%20Market%20Price%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 调试模式
    const DEBUG = false;

  // XMLHttpRequest hook 更新物价
    const open_prototype = XMLHttpRequest.prototype.open;
    unsafeWindow.XMLHttpRequest.prototype.open = function () {
        this.addEventListener("readystatechange", function (event) {
        if (this.readyState === 4) {
            if (this.responseURL === "https://api.zed.city/getMarket") {
                try {
                    const raw = JSON.parse(this.response);
                    const items = raw.items || [];
                    const itemWorths = {};
                    const itemWorthsSyncList = [];

                    items.forEach(item => {
                        if (item.name && typeof item.market_price === "number") {
                            itemWorths[item.name] = { price: item.market_price };
                            itemWorthsSyncList.push({
                                name: item.name,
                                market_id: item.market_id,
                                market_price: item.market_price,
                                quantity: item.quantity
                            });
                        }
                    });
                    localStorage.setItem("marketPriceHelper_itemWorths", JSON.stringify(itemWorths));
                    localStorage.setItem("marketPriceHelper_itemWorths_timestamp", Date.now());
                    log("✅ 已从 getMarket 响应更新物价表");
                } catch (err) {
                    log("❌ getMarket 响应解析失败", err);
                }
            }
        }});
        return open_prototype.apply(this, arguments);
    };

    if (!localStorage.getItem("marketPriceHelper_itemWorths")) {
        localStorage.setItem("marketPriceHelper_itemWorths", JSON.stringify({}));
    }


    // 存储价格元素和观察器的映射
    const itemObservers = new Map();

    // 主观察器，监听物品详情的出现和变化
    let mainObserver;

    function init() {
        log('脚本开始运行');
        //向zed服务器请求物品数据
        getItemWorthsFromServer()

        // 停止现有的观察器
        if (mainObserver) {
            mainObserver.disconnect();
        }

        // 初始化主观察器，监听物品详情的出现
        mainObserver = new MutationObserver(handleMutations);
        mainObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 初始处理已存在的物品详情
        setTimeout(() => {
            document.querySelectorAll('.item-info').forEach(setupItemObserver);
        }, 500);
    }

    // 处理DOM变化
    function handleMutations(mutations) {
        for (const mutation of mutations) {
            // 检查新增的节点
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) { // 元素节点
                    // 查找新增的物品详情
                    const itemInfos = node.matches('.item-info') ?
                        [node] : node.querySelectorAll('.item-info');

                    itemInfos.forEach(itemInfo => {
                        if (!itemObservers.has(itemInfo)) {
                            setupItemObserver(itemInfo);
                        }
                    });
                }
            }

            // 检查移除的节点
            for (const node of mutation.removedNodes) {
                if (node.nodeType === 1) {
                    // 清理被移除的物品详情
                    const itemInfos = node.matches('.item-info') ?
                        [node] : node.querySelectorAll('.item-info');

                    itemInfos.forEach(itemInfo => {
                        cleanupItemObserver(itemInfo);
                    });
                }
            }
        }
    }

    // 为单个物品详情设置观察器
    function setupItemObserver(itemInfo) {
        if (itemObservers.has(itemInfo)) {
            cleanupItemObserver(itemInfo);
        }

        // 立即处理一次
        updateItemPrice(itemInfo);

        // 设置观察器，监听物品名称的变化
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'characterData' || mutation.type === 'childList') {
                    // 检查是否是text-h5或其子节点变化
                    const target = mutation.target;
                    const titleElement = target.classList && target.classList.contains('text-h5') ?
                        target : target.closest('.text-h5');

                    if (titleElement && titleElement.closest('.item-info') === itemInfo) {
                        log('检测到物品名称变化，更新价格');
                        updateItemPrice(itemInfo);
                        break;
                    }
                }
            }
        });

        // 找到标题元素
        const titleElement = itemInfo.querySelector('.text-h5');
        if (titleElement) {
            // 观察文本内容变化
            observer.observe(titleElement, {
                characterData: true,
                childList: true,
                subtree: true
            });
        }

        // 观察整个item-info的变化（防漏）
        observer.observe(itemInfo, {
            childList: true,
            subtree: true
        });

        itemObservers.set(itemInfo, observer);

        log(`为物品详情设置观察器: ${titleElement?.textContent || '未知'}`);
    }

    // 更新单个物品的价格显示
    function updateItemPrice(itemInfo) {
        // 获取物品名称
        const titleElement = itemInfo.querySelector('.text-h5');
        if (!titleElement) return;
        const originalName = titleElement.getAttribute('script_translated_from')||titleElement.textContent.trim();
        if (!originalName) return;
        // 获取名称
        const possibleNames = generatePossibleNames(originalName);
        // 获取价格
        const price = getItemPrice(possibleNames);
        // 更新或添加价格显示
        updatePriceDisplay(itemInfo, price, originalName);
    }

    // 生成可能的物品名称列表
    function generatePossibleNames(originalName) {
        return [
            originalName,
            originalName.toLowerCase(),
            originalName.replace(/\s+/g, ' ').trim(),
            // 移除常见前缀
            originalName.replace(/^(Craft|Smelt|Forge|Burn|Blueprint:?)\s*/i, ''),
            // 尝试移除括号内容
            originalName.replace(/\s*\(.*?\)\s*/g, ''),
            // 尝试移除特殊字符
            originalName.replace(/[^\w\s]/g, '')
        ].filter(name => name && name.trim() !== '');
    }

    // 获取物品价格
    function getItemPrice(possibleNames) {
        try {
            const jsonStr = localStorage.getItem("marketPriceHelper_itemWorths");
            if (!jsonStr) return 0;
            const json = JSON.parse(jsonStr);
            if (!json) return 0;
            for (const name of possibleNames) {
                if (json.hasOwnProperty(name)) {
                    const price = Number(json[name].price) || 0;
                    return price;
                }
            }
            return '暂无报价';
        } catch (e) {
            console.error('获取物品价格失败:', e);
            return '暂无报价';
        }
    }

    // 更新价格显示
    function updatePriceDisplay(itemInfo, price, itemName) {
        // 查找或创建价格显示元素
        let statsGrid = itemInfo.querySelector('.stats-grid');
        if (!statsGrid) {
            const statsGridContainer = itemInfo.querySelector('.item-stats-grid');
            if (statsGridContainer) {
                statsGrid = statsGridContainer.querySelector('.stats-grid');
            }
        }

        if (!statsGrid) {
            log(`无法找到stats-grid元素`);
            return;
        }

        // 查找现有的价格显示
        let priceStat = statsGrid.querySelector('.script-price-stat');

        if (!priceStat) {
            // 创建新的价格显示元素
            priceStat = createPriceStatElement();
            statsGrid.appendChild(priceStat);
        }

        // 更新价格显示
        const statVal = priceStat.querySelector('.stat-val');
        if (statVal) {
            statVal.textContent = formatPrice(price);
            statVal.style.color = '#4CAF50';
        }
    }

    // 创建价格显示元素
    function createPriceStatElement() {
        const statItem = document.createElement('div');
        statItem.className = 'stat-item script-price-stat';

        const statBlock = document.createElement('div');
        statBlock.className = 'stat-block';

        const statLabel = document.createElement('div');
        statLabel.className = 'stat-label';
        statLabel.textContent = '市场价格';

        const statValue = document.createElement('div');
        statValue.className = 'stat-value';

        const marketPrice = document.createElement('span');
        marketPrice.className = 'market-price';

        const iconSpan = document.createElement('span');
        iconSpan.className = 'icon icon-money';

        const icon = document.createElement('i');
        icon.className = 'q-icon text-green-5 fas fa-dollar-sign';
        icon.setAttribute('aria-hidden', 'true');

        iconSpan.appendChild(icon);

        const priceSpan = document.createElement('span');
        priceSpan.className = 'stat-val';
        priceSpan.textContent = '0';

        marketPrice.appendChild(iconSpan);
        marketPrice.appendChild(document.createTextNode(' '));
        marketPrice.appendChild(priceSpan);
        statValue.appendChild(marketPrice);
        statBlock.appendChild(statLabel);
        statBlock.appendChild(statValue);
        statItem.appendChild(statBlock);
        return statItem;
    }

    // 清理物品观察器
    function cleanupItemObserver(itemInfo) {
        const observer = itemObservers.get(itemInfo);
        if (observer) {
            observer.disconnect();
            itemObservers.delete(itemInfo);
        }
    }

    // 格式化价格
    function formatPrice(price) {
        // 参数校验
        const num = Number(price);
        if (isNaN(num)) {
            return "暂无报价";
        }
        return new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 0, // 保留0位小数
        }).format(num);
    }

   //向zed服务器请求market数据
    function getItemWorthsFromServer() {
        const lastUpdate = localStorage.getItem("marketPriceHelper_itemWorths_timestamp");
        if (lastUpdate && Date.now() - lastUpdate < 1000*60*30) {
            log("✅ 已有物价缓存，跳过主动更新（30分钟）");
            return;
        }

        log("📦 正在从 Zed 官方 API 获取物价数据");

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://api.zed.city/getMarket",
                headers: {
                    "Content-Type": "application/json",
                },
                onload: function (response) {
                    if (!response || !response.responseText) {
                        log("❌ 网络错误：无响应内容");
                        resolve("网络错误onload");
                        return;
                    }

                    try {
                        const raw = JSON.parse(response.responseText);
                        const items = raw.items || [];
                        const itemWorths = {};
                        const itemWorthsSyncList = [];

                        items.forEach(item => {
                            if (item.name && typeof item.market_price === "number") {
                                itemWorths[item.name] = { price: item.market_price };
                                itemWorthsSyncList.push({
                                    name: item.name,
                                    market_id: item.market_id,
                                    market_price: item.market_price,
                                    quantity: item.quantity
                                });
                            }
                        });
                        //缓存至本地
                        localStorage.setItem("marketPriceHelper_itemWorths", JSON.stringify(itemWorths));
                        localStorage.setItem("marketPriceHelper_itemWorths_timestamp", Date.now());
                    } catch (err) {
                        log("❌ JSON解析失败", err);
                        resolve("JSON解析失败");
                    }
                },
                onerror: function (error) {
                    log("❌ 网络错误onerror", error);
                    resolve("网络错误onerror");
                }
            });
        });
    }

    // 调试日志
    function log(message) {
        if (DEBUG) {
            console.log(`[物品价格脚本] ${message}`);
        }
    }

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .script-price-stat .market-price {
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        .script-price-stat .stat-val {
            font-weight: bold;
            min-width: 40px;
            display: inline-block;
            transition: color 0.3s;
        }
        .script-price-stat:hover {
            background-color: rgba(0, 0, 0, 0.05);
            border-radius: 4px;
            cursor: pointer;
        }
        #script-refresh-price-btn:hover {
            opacity: 1 !important;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
    `;
    document.head.appendChild(style);

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听localStorage变化，实时更新价格
    window.addEventListener('storage', function(e) {
        if (e.key === 'marketPriceHelper_itemWorths') {
            log('检测到localStorage变化，更新所有价格');
            document.querySelectorAll('.item-info').forEach(updateItemPrice);
        }
    });

})();