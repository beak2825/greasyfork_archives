// ==UserScript==
// @name         小r究极无敌挂单时间看破
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  天基武器四号
// @author       XiaoR
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      localhost
// @connect      127.0.0.1
// @connect      115.175.25.149
// @run-at       document-start
// @license      禁止传播
// @downloadURL https://update.greasyfork.org/scripts/552159/%E5%B0%8Fr%E7%A9%B6%E6%9E%81%E6%97%A0%E6%95%8C%E6%8C%82%E5%8D%95%E6%97%B6%E9%97%B4%E7%9C%8B%E7%A0%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/552159/%E5%B0%8Fr%E7%A9%B6%E6%9E%81%E6%97%A0%E6%95%8C%E6%8C%82%E5%8D%95%E6%97%B6%E9%97%B4%E7%9C%8B%E7%A0%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const uw = unsafeWindow;

    // 存储WebSocket实例和状态
    const wsState = {
        instances: [],
        currentWS: null,
        connected: false,
        autoQueryInterval: null
    };

    // 存储市场订单簿数据，键为物品ID，值为订单簿数据
    const orderBooksCache = new Map();
    // 存储订单ID历史数据
    let orderIdHistory = [];
    // 是否已经加载历史数据
    let historyDataLoaded = false;

    // 当前显示的物品信息
    const currentDisplayedItem = {
        hrid: null,
        level: 0,
        lastUpdated: 0
    };

    // 时间列显示状态
    let timeColumnVisible = true;



    // 设置WebSocket拦截
    const setupWebSocketInterception = () => {
        // 防止重复拦截
        if (uw.wsInterceptionSet) return;
        uw.wsInterceptionSet = true;

        const OriginalWebSocket = uw.WebSocket;

        // 拦截WebSocket构造函数
        uw.WebSocket = function InterceptedWebSocket(url, protocols) {
            const ws = new OriginalWebSocket(url, protocols);

            // 检查是否是游戏WebSocket
            if (typeof url === 'string' &&
                (url.includes('milkywayidle.com/ws') ||
                 url.includes('test.milkywayidle.com/ws'))) {

                // 添加到实例列表
                wsState.instances.push(ws);
                wsState.currentWS = ws;

                // 拦截send方法
                const originalSend = ws.send.bind(ws);
                ws.send = function(data) {
                    try {
                        originalSend(data);
                    } catch (e) {
                        console.error('[MWI OrderBooks Tracker] 发送消息出错:', e);
                    }
                };

                // 添加消息监听器
                ws.addEventListener('message', (event) => {
                    try {
                        const data = JSON.parse(event.data);

                        // 处理市场订单簿更新
                        if (data.type === 'market_item_order_books_updated') {
                            enhancedHandleOrderBooksUpdate(data);
                        }

                        // 连接状态更新
                        if (data.type === 'init_character_data') {
                            wsState.connected = true;
                            // 连接成功后启动加载历史数据
                            if (!historyDataLoaded) {
                                loadOrderIdHistory();
                            }
                        }

                        // 连接打开事件
                        ws.addEventListener('open', () => {
                            wsState.connected = true;
                            // 连接成功后启动加载历史数据
                            if (!historyDataLoaded) {
                                loadOrderIdHistory();
                            }
                        });

                        // 连接关闭事件
                        ws.addEventListener('close', (event) => {
                            wsState.connected = false;

                            // 从实例列表中移除
                            const index = wsState.instances.indexOf(ws);
                            if (index > -1) wsState.instances.splice(index, 1);

                            // 更新当前WebSocket
                            wsState.currentWS = wsState.instances.length > 0
                                ? wsState.instances[wsState.instances.length - 1]
                                : null;
                        });
                    } catch (e) {
                        console.error('[MWI OrderBooks Tracker] 处理消息出错:', e);
                    }
                });
            }

            return ws;
        };

        // 保持原型链
        uw.WebSocket.prototype = OriginalWebSocket.prototype;
        uw.WebSocket.OPEN = OriginalWebSocket.OPEN;
        uw.WebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
        uw.WebSocket.CLOSING = OriginalWebSocket.CLOSING;
        uw.WebSocket.CLOSED = OriginalWebSocket.CLOSED;
    };

    // 处理市场订单簿更新
    const handleOrderBooksUpdate = (data) => {
        if (!data.marketItemOrderBooks || !data.marketItemOrderBooks.orderBooks) return;

        const itemHrid = data.marketItemOrderBooks.itemHrid;
        const orderBooks = data.marketItemOrderBooks.orderBooks;

        // 缓存订单簿数据
        orderBooksCache.set(itemHrid, {
            orderBooks: orderBooks,
            timestamp: Date.now()
        });

        console.log(`[MWI OrderBooks Tracker] 缓存了 ${itemHrid} 的订单簿数据`);

        // 如果历史数据已加载，则处理订单ID
        if (historyDataLoaded) {
            processOrderIds(itemHrid, orderBooks);
        }
    };

    // 加载订单ID历史数据
    const loadOrderIdHistory = () => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://115.175.25.149:8080/order_id_history',
            headers: {
                'Content-Type': 'application/json'
            },
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.status === 'success' && data.data) {
                        orderIdHistory = data.data;
                        historyDataLoaded = true;
                        console.log(`[MWI OrderBooks Tracker] 成功加载了 ${orderIdHistory.length} 条历史订单数据`);

                        // 处理已缓存的订单簿数据
                        for (const [itemHrid, cachedData] of orderBooksCache.entries()) {
                            processOrderIds(itemHrid, cachedData.orderBooks);
                        }
                    }
                } catch (e) {
                    console.error('[MWI OrderBooks Tracker] 解析历史数据失败:', e);
                }
            },
            onerror: function(error) {
                console.error('[MWI OrderBooks Tracker] 加载历史数据失败:', error);
            }
        });
    };

    // 处理订单ID，计算min_time和max_time
    const processOrderIds = (itemHrid, orderBooks) => {
        if (!orderBooks || orderBooks.length === 0) return;

        const currentTime = new Date();

        // 遍历所有订单簿
        orderBooks.forEach((orderBook, index) => {
            if (!orderBook || (!orderBook.asks && !orderBook.bids)) return;

            // 处理asks订单
            if (orderBook.asks && Array.isArray(orderBook.asks)) {
                orderBook.asks.forEach(ask => {
                    if (ask && ask.listingId) {
                        const orderInfo = findOrderPosition(ask.listingId);
                        if (orderInfo) {
                            // 计算时间差值（小时）
                            ask.min_time = orderInfo.minTimeDiff;
                            ask.max_time = orderInfo.maxTimeDiff;
                        }
                    }
                });
            }

            // 处理bids订单
            if (orderBook.bids && Array.isArray(orderBook.bids)) {
                orderBook.bids.forEach(bid => {
                    if (bid && bid.listingId) {
                        const orderInfo = findOrderPosition(bid.listingId);
                        if (orderInfo) {
                            // 计算时间差值（小时）
                            bid.min_time = orderInfo.minTimeDiff;
                            bid.max_time = orderInfo.maxTimeDiff;
                        }
                    }
                });
            }
        });

        console.log(`[MWI OrderBooks Tracker] 已处理 ${itemHrid} 的订单ID，添加了时间范围信息`);
        // 在控制台输出以确认结果
        console.log(`处理后的订单簿数据 (${itemHrid}):`, orderBooks);
    };

    // 查找订单ID在历史数据中的位置，并计算精确时间
    const findOrderPosition = (listingId) => {
        if (!orderIdHistory || orderIdHistory.length === 0) return null;

        const listingIdNum = Number(String(listingId).trim());
        const currentTime = new Date();

        // 按order_id从大到小排序（最新的在前）
        const sortedHistory = [...orderIdHistory].sort((a, b) => {
            return Number(b.order_id.trim()) - Number(a.order_id.trim());
        });

        // 寻找目标订单ID的位置并计算精确时间
        let exactTimeDiff = 0;
        const currentTimeMs = currentTime.getTime();

        // 找到第一个比当前订单ID小的历史ID
        let targetIndex = -1;
        for (let i = 0; i < sortedHistory.length - 1; i++) {
            const currId = Number(sortedHistory[i].order_id.trim());
            const nextId = Number(sortedHistory[i + 1].order_id.trim());

            // 如果订单ID在两个历史ID之间
            if (currId >= listingIdNum && listingIdNum >= nextId) {
                targetIndex = i;
                break;
            }
        }

        // 计算精确时间
        if (targetIndex !== -1) {
            // 找到匹配区间，计算精确时间
            const currId = Number(sortedHistory[targetIndex].order_id.trim());
            const nextId = Number(sortedHistory[targetIndex + 1].order_id.trim());
            const currTime = new Date(sortedHistory[targetIndex].timestamp).getTime();
            const nextTime = new Date(sortedHistory[targetIndex + 1].timestamp).getTime();

            // 计算ID差值和时间差值
            const idDiff = currId - nextId;
            const timeDiffMs = nextTime - currTime;

            // 计算每秒平均增加的ID数量
            const avgIdPerMs = idDiff / timeDiffMs;

            // 计算目标ID相对于currId的差值
            const targetIdDiff = currId - listingIdNum;

            // 计算目标ID对应的时间
            const targetTimeMs = currTime + (targetIdDiff / avgIdPerMs);

            // 计算与当前时间的差值（小时）
            exactTimeDiff = (currentTimeMs - targetTimeMs) / (1000 * 60 * 60);
        } else {
            // 计算整体ID增长速度
            const firstId = Number(sortedHistory[0].order_id.trim());
            const lastId = Number(sortedHistory[sortedHistory.length - 1].order_id.trim());
            const firstTime = new Date(sortedHistory[0].timestamp).getTime();
            const lastTime = new Date(sortedHistory[sortedHistory.length - 1].timestamp).getTime();

            // 计算ID差值和时间差值
            const idDiff = firstId - lastId;
            const timeDiffMs = lastTime - firstTime;

            // 计算每秒平均增加的ID数量
            const avgIdPerMs = idDiff / timeDiffMs;

            // 判断订单ID是大于最大历史ID还是小于最小历史ID
            if (listingIdNum > firstId) {
                // 订单ID大于最大历史ID
                const idDiff = listingIdNum - firstId;
                const targetTimeMs = firstTime - (idDiff / avgIdPerMs);
                exactTimeDiff = Math.max(0, (currentTimeMs - targetTimeMs) / (1000 * 60 * 60));
            } else {
                // 订单ID小于最小历史ID
                const idDiff = lastId - listingIdNum;
                const targetTimeMs = lastTime + (idDiff / avgIdPerMs);
                exactTimeDiff = (currentTimeMs - targetTimeMs) / (1000 * 60 * 60);
            }
        }

        // 确保最新的id估算出的时间最小不能低于0min
        exactTimeDiff = Math.max(0, exactTimeDiff);

        return {
            minTimeDiff: exactTimeDiff,
            maxTimeDiff: exactTimeDiff
        };
    };

    // 计算两个时间之间的小时差值
    const calculateHoursDiff = (pastTime, currentTime) => {
        const diffMs = currentTime - pastTime;
        const diffHours = diffMs / (1000 * 60 * 60);
        return Number(diffHours.toFixed(2)); // 保留两位小数
    };



    // 添加时间列到订单簿表格
    const addTimeColumnToTables = () => {
        // 查找所有订单簿表格
        const tables = uw.document.querySelectorAll('.MarketplacePanel_orderBookTable__3zzrv');

        tables.forEach(table => {
            // 检查是否已经添加过时间列
            if (table.querySelector('.time-column-header')) {
                return;
            }

            // 获取表头
            const thead = table.querySelector('thead tr');
            if (thead) {
                // 创建时间列标题
                const th = uw.document.createElement('th');
                th.className = 'time-column-header';
                th.textContent = '挂单时长';
                th.style.width = '100px';
                th.style.textAlign = 'center';

                // 在操作列前插入
                const actionTh = thead.querySelector('th:last-child');
                if (actionTh) {
                    thead.insertBefore(th, actionTh);
                } else {
                    thead.appendChild(th);
                }
            }
        });
    };

    // 更新订单行的时间显示
    const updateOrderRowTime = (row, minTime, maxTime) => {
        // 检查是否已经有时间单元格
        let timeCell = row.querySelector('.order-time-cell');

        if (!timeCell) {
            // 创建新的时间单元格
            timeCell = uw.document.createElement('td');
            timeCell.className = 'order-time-cell';
            timeCell.style.textAlign = 'center';
            timeCell.style.fontSize = '12px';
            timeCell.style.fontWeight = 'bold';

            // 在操作按钮前插入
            const actionCell = row.querySelector('td:last-child');
            if (actionCell) {
                row.insertBefore(timeCell, actionCell);
            } else {
                row.appendChild(timeCell);
            }
        }

        // 设置时间文本和样式
        if (minTime !== undefined && maxTime !== undefined) {
            // 使用精确时间值（由于现在minTime和maxTime相同，直接使用minTime即可）
            const exactTime = minTime;

            let displayText = '';
            let displayColor = '#9cdcfe'; // 默认蓝色

            if (exactTime < 1) {
                // 低于1小时，显示绿色，单位为分钟
                const minutes = Math.round(exactTime * 60);
                displayColor = '#4ade80'; // 绿色
                displayText = `${minutes}m`;
            } else if (exactTime < 24) {
                // 低于1天但大于等于1小时，显示蓝色，单位为小时
                displayColor = '#9cdcfe'; // 蓝色
                displayText = `${exactTime.toFixed(1)}h`;
            } else if (exactTime < 72) {
                // 大于等于1天但小于3天，显示橙色，单位为天
                const days = (exactTime / 24).toFixed(1);
                displayColor = '#f97316'; // 橙色
                displayText = `${days}d`;
            } else {
                // 大于等于3天，显示红色，单位为天
                const days = (exactTime / 24).toFixed(1);
                displayColor = '#ef4444'; // 红色
                displayText = `${days}d`;
            }

            timeCell.textContent = displayText;
            timeCell.style.color = displayColor;
        } else {
            timeCell.textContent = '计算中...';
            timeCell.style.color = '#9ca3af'; // 灰色
        }
    };

    // 获取当前页面显示的物品信息
    const getCurrentDisplayedItem = () => {
        // 使用正确的选择器查找当前物品元素
        const currentItem = uw.document.querySelector('.MarketplacePanel_currentItem__3ercC');

        if (!currentItem) {
            // 如果没有找到，回退到原来的选择器
            const fallbackItem = uw.document.querySelector('.ItemDisplay_title__2OeA0') ||
                              uw.document.querySelector('.MarketplacePanel_itemInfo__1nXwE');
            if (!fallbackItem) {
                return null;
            }

            // 获取物品增强等级
            let levelStr = fallbackItem.querySelector(".Item_enhancementLevel__19g-e");
            let enhancementLevel = parseInt(levelStr?.textContent.replace("+", "") || "0");

            // 获取物品HRID
            const iconElement = fallbackItem.querySelector(".Icon_icon__2LtL_");
            let itemHrid = null;

            if (iconElement && iconElement.ariaLabel) {
                // 简化版的ensureItemHrid函数，提取物品名称
                const itemName = iconElement.ariaLabel.split(' ')[0].toLowerCase();
                // 将物品名称转换为HRID格式
                itemHrid = `/items/${itemName.replace(/[\s']+/g, '_')}`;
            }

            // 如果无法直接获取，尝试从URL或其他元素获取
            if (!itemHrid) {
                const breadcrumbs = uw.document.querySelector('.Breadcrumb_breadcrumb__1eK3x');
                if (breadcrumbs) {
                    const pathParts = Array.from(breadcrumbs.querySelectorAll('a')).map(el => el.textContent.trim().toLowerCase());
                    if (pathParts.includes('marketplace') && pathParts.length > 1) {
                        const itemName = pathParts[pathParts.length - 1].replace(/[\s']+/g, '_');
                        itemHrid = `/items/${itemName}`;
                    }
                }
            }

            return {
                hrid: itemHrid,
                level: enhancementLevel
            };
        }

        // 以下是用户提供的正确方法
        // 获取物品增强等级
        let levelStr = currentItem?.querySelector(".Item_enhancementLevel__19g-e");
        let enhancementLevel = parseInt(levelStr?.textContent.replace("+", "") || "0");

        // 获取物品HRID
        const iconElement = currentItem.querySelector(".Icon_icon__2LtL_");
        let itemHrid = null;

        itemHrid = uw.mwi.ensureItemHrid(iconElement.ariaLabel);

        let itemHridLevel = itemHrid + (itemHrid && enhancementLevel ? ":" + enhancementLevel : "");

        return {
            hrid: itemHrid,
            level: enhancementLevel,
            hridWithLevel: itemHridLevel
        };
    };

    // 处理订单列表显示
    const processOrderListDisplay = (isNewDataUpdate = false) => {
        // 确保有缓存的数据
        if (orderBooksCache.size === 0) {
            console.log('[MWI OrderBooks Tracker] 跳过更新：无缓存数据');
            return;
        }

        // 获取当前显示的物品信息
        const displayedItem = getCurrentDisplayedItem();

        // 如果无法识别当前物品，跳过更新
        if (!displayedItem || !displayedItem.hrid) {
            console.log('[MWI OrderBooks Tracker] 跳过更新：无法识别当前显示的物品');
            return;
        }

        // 检查物品或强化等级是否发生变化
        const itemChanged = displayedItem.hrid !== currentDisplayedItem.hrid ||
                           displayedItem.level !== currentDisplayedItem.level;

        // 确定是否需要更新页面
        const shouldUpdate = itemChanged || isNewDataUpdate;

        // 保存当前物品信息
        const oldHrid = currentDisplayedItem.hrid;
        const oldLevel = currentDisplayedItem.level;

        // 更新当前显示的物品信息
        currentDisplayedItem.hrid = displayedItem.hrid;
        currentDisplayedItem.level = displayedItem.level;

        // 如果不需要更新，打印日志并返回
        if (!shouldUpdate) {
            console.log('[MWI OrderBooks Tracker] 跳过更新：物品和强化等级未变化且无新数据');
            return;
        }

        // 如果需要更新，继续处理并打印日志
        currentDisplayedItem.lastUpdated = Date.now();

        // 检查是否有对应的缓存数据
        const cachedData = orderBooksCache.get(displayedItem.hrid);
        let targetItemHrid = null;
        let targetOrderBooks = null;
        let targetLevelIndex = 0; // 默认使用第一个等级

        if (cachedData && cachedData.orderBooks && cachedData.orderBooks.length > 0) {
            targetItemHrid = displayedItem.hrid;
            targetOrderBooks = cachedData.orderBooks;

            // 根据强化等级选择正确的订单簿数据
            targetLevelIndex = Math.min(displayedItem.level, targetOrderBooks.length - 1);

            // 打印更新日志
            if (itemChanged) {
                const changeType = oldHrid !== displayedItem.hrid ? '物品变化' : '强化等级变化';
                console.log(`[MWI OrderBooks Tracker] ${changeType}触发更新：${displayedItem.level}等级${targetItemHrid}数据`);
            } else {
                console.log(`[MWI OrderBooks Tracker] 新数据触发更新：${displayedItem.level}等级${targetItemHrid}数据`);
            }

            // 添加时间列
            addTimeColumnToTables();

            // 获取所有订单行
            const sellRows = uw.document.querySelectorAll('.MarketplacePanel_orderBookTableContainer__hUu-X:first-child tbody tr');
            const buyRows = uw.document.querySelectorAll('.MarketplacePanel_orderBookTableContainer__hUu-X:last-child tbody tr');

            // 处理出售订单
            if (targetOrderBooks[targetLevelIndex] && targetOrderBooks[targetLevelIndex].asks) {
                targetOrderBooks[targetLevelIndex].asks.forEach((ask, index) => {
                    if (sellRows[index]) {
                        updateOrderRowTime(sellRows[index], ask.min_time, ask.max_time);
                    }
                });
            }

            // 处理购买订单
            if (targetOrderBooks[targetLevelIndex] && targetOrderBooks[targetLevelIndex].bids) {
                targetOrderBooks[targetLevelIndex].bids.forEach((bid, index) => {
                    if (buyRows[index]) {
                        updateOrderRowTime(buyRows[index], bid.min_time, bid.max_time);
                    }
                });
            }
        } else {
            console.log(`[MWI OrderBooks Tracker] 跳过更新：未找到${displayedItem.hrid}的缓存数据`);
        }
    };

    // 设置DOM变化监听器
    const setupDOMObserver = () => {
        // 创建MutationObserver来监听订单列表的出现和变化
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;

            mutations.forEach((mutation) => {
                // 检查是否有订单列表容器相关的变化
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        const node = mutation.addedNodes[i];
                        if (node.nodeType === 1) { // Element node
                            if (node.classList && node.classList.contains('MarketplacePanel_orderBookTableContainer__hUu-X')) {
                                // 订单列表容器出现
                                console.log('[MWI OrderBooks Tracker] 检测到订单列表容器');
                                shouldUpdate = true;
                                return;
                            }
                        }
                    }
                }
            });

            // 只有在需要更新时才触发处理
            if (shouldUpdate) {
                setTimeout(processOrderListDisplay, 100); // 延迟处理，确保DOM渲染完成
            }
        });

        // 只观察市场面板区域，而不是整个文档体
        const marketplacePanel = uw.document.querySelector('.MarketplacePanel_marketplacePanel__1rGz-');
        if (marketplacePanel) {
            observer.observe(marketplacePanel, {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            });
            console.log('[MWI OrderBooks Tracker] DOM变化监听器已设置在市场面板上');
        } else {
            // 如果没有找到市场面板，使用更精确的选择器观察
            observer.observe(uw.document.body, {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            });
            console.log('[MWI OrderBooks Tracker] DOM变化监听器已设置');
        }
    };

    // 切换时间列显示状态
    const toggleTimeColumnVisibility = () => {
        timeColumnVisible = !timeColumnVisible;

        // 隐藏/显示表头
        const headers = uw.document.querySelectorAll('.time-column-header');
        headers.forEach(header => {
            header.style.display = timeColumnVisible ? '' : 'none';
        });

        // 隐藏/显示单元格
        const cells = uw.document.querySelectorAll('.order-time-cell');
        cells.forEach(cell => {
            cell.style.display = timeColumnVisible ? '' : 'none';
        });

        console.log(`[MWI OrderBooks Tracker] 预估时间列已${timeColumnVisible ? '显示' : '隐藏'}`);
    };

    // 初始化
    uw.addEventListener('DOMContentLoaded', () => {
        // 设置WebSocket拦截
        setupWebSocketInterception();

        // 尝试立即加载历史数据
        if (!historyDataLoaded) {
            loadOrderIdHistory();
        }

        // 设置DOM观察器
        setupDOMObserver();

        // 设置强化等级变化监听器
        setupEnhancementLevelObserver();

        // 添加键盘事件监听
        uw.document.addEventListener('keydown', (event) => {
            // 检查是否按下了h键，且没有按下其他修饰键
            if (event.key.toLowerCase() === 'h' && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
                // 检查当前焦点元素是否为输入框或文本区域
                const activeElement = uw.document.activeElement;
                const isInputElement = activeElement &&
                    (activeElement.tagName === 'INPUT' ||
                     activeElement.tagName === 'TEXTAREA' ||
                     activeElement.isContentEditable);

                // 如果不是输入框，才阻止默认行为并切换时间列
                if (!isInputElement) {
                    // 防止事件冒泡和默认行为
                    event.preventDefault();
                    event.stopPropagation();

                    // 切换时间列显示状态
                    toggleTimeColumnVisibility();
                }
            }
        });

        // 定期检查订单列表（应对可能的延迟渲染）
        setInterval(() => {
            if (uw.document.querySelector('.MarketplacePanel_orderBookTable__3zzrv')) {
                processOrderListDisplay(false); // 传入false表示这是定期检查
            }
        }, 2000);
    });

    // 创建增强版的订单簿更新处理函数，在缓存更新后也更新UI
    const enhancedHandleOrderBooksUpdate = (data) => {
        // 调用原始的处理函数
        handleOrderBooksUpdate(data);

        // 延迟更新UI，确保数据处理完成
        setTimeout(() => {
            // 检查是否是当前显示的物品的数据
            const isCurrentItem = data && data.marketItemOrderBooks.itemHrid && currentDisplayedItem.hrid &&
                                data.marketItemOrderBooks.itemHrid === currentDisplayedItem.hrid;

            // 如果是当前显示的物品且订单列表表格可见，就更新UI
            if (isCurrentItem && uw.document.querySelector('.MarketplacePanel_orderBookTable__3zzrv')) {
                processOrderListDisplay(true); // 传入true表示这是由新数据触发的更新
            } else if (!isCurrentItem && currentDisplayedItem.hrid) {
                // console.log('[MWI OrderBooks Tracker] 跳过更新：收到的是其他物品的数据');
            }
        }, 100);
    };

    // 增强DOM监听器，专门监听物品强化等级变化
    const setupEnhancementLevelObserver = () => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target && mutation.target.classList &&
                    mutation.target.classList.contains('Item_enhancementLevel__19g-e')) {
                    console.log('[MWI OrderBooks Tracker] 检测到强化等级变化');
                    setTimeout(processOrderListDisplay, 100); // 延迟处理，确保DOM渲染完成
                }
            });
        });

        // 开始观察物品信息区域的变化
        const itemInfoElement = uw.document.querySelector('.MarketplacePanel_itemInfo__1nXwE') ||
                               uw.document.querySelector('.ItemDisplay_title__2OeA0');

        if (itemInfoElement) {
            observer.observe(itemInfoElement, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'textContent']
            });
        }

        console.log('[MWI OrderBooks Tracker] 强化等级变化监听器已设置');
    };
})();