// ==UserScript==
// @name         [MWI]Chefs-Market
// @name:zh-CN   [银河奶牛]MWI-Chefs-Market
// @namespace    http://xigai.fun/
// @version      1.2.1
// @description  chef market tool
// @description:zh-CN  厨子市场工具
// @author       xigaimax
// @license      MIT
// @match        https://www.milkywayidle.com/game*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        none
// @run-at       document-start
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/553740/%5BMWI%5DChefs-Market.user.js
// @updateURL https://update.greasyfork.org/scripts/553740/%5BMWI%5DChefs-Market.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // 配置项
    const CONFIG = {
        // 服务器地址 - 请根据实际情况修改
        SERVER_URL: 'https://chefs.xigai.top/api/chefupload',
        // 目标消息类型
        TARGET_MESSAGE_TYPES: ['market_listings_updated','init_character_data','market_item_order_books_updated'],
        // 是否启用调试日志
        DEBUG: false,
        // 新增：后端查询接口地址
        LISTINGS_API: 'https://chefs.xigai.top/api/listings'
    };
    // 新增：角色名称持久化存储键
    const CHARACTER_NAME_STORAGE_KEY = 'MWI_CHARACTER_NAME';
    // 全局变量存储角色名称（恢复声明）
    let characterName = null;
    // 启动时从本地存储预载（不依赖 debugLog，避免调用时序问题）
    try {
        const savedName = localStorage.getItem(CHARACTER_NAME_STORAGE_KEY);
        if (savedName) {
            characterName = savedName;
        }
    } catch (_) {}

    // 调试日志函数
    const debugLog = (message, data = null) => {
        if (CONFIG.DEBUG) {
            const timestamp = new Date().toISOString().split('T')[1].substring(0, 12);
            console.log(`[Chefs Market ${timestamp}] ${message}`, data || '');
        }
    };


    // 数据上传函数
    const uploadData = async (data) => {
        // 新：改为上传 id -> itemHrid 的映射
        const map = data && data.id2itemHrid ? data.id2itemHrid : {};
        if (Object.keys(map).length === 0) {
            debugLog('映射为空，跳过上传');
            return;
        }
        try {
            const payload = {
                listing_map: map,
                timestamp: Date.now(),
                character_name: characterName
            };

            debugLog('准备上传市场映射', { count: Object.keys(map).length });

            const response = await fetch(CONFIG.SERVER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                debugLog('数据上传成功', { status: response.status });
            } else {
                debugLog('数据上传失败', { 
                    status: response.status, 
                    statusText: response.statusText 
                });
            }
        } catch (error) {
            debugLog('上传数据时发生错误', error);
        }
    };

    // 立即验证WebSocket替换时机
    debugLog('开始WebSocket替换过程...');
    debugLog('当前document状态:', document.readyState);
    debugLog('原始WebSocket类型:', typeof window.WebSocket);
    
    // 代理 WebSocket - 使用与工作脚本相似的结构
    const OriginalWebSocket = window.WebSocket;
    const handlerQueue = [];

    function MwiWebSocketket(url, protocols) {
        debugLog('WebSocket构造函数被调用！', { url, protocols });
        const ws = new OriginalWebSocket(url, protocols);

        ws.addEventListener("message", function(event) {
            try {
                const msgData = JSON.parse(event.data);
                
                // 使用处理器队列处理消息
                handlerQueue.reduce((prev, handler) => {
                    return handler(prev);
                }, msgData);
                
            } catch (e) {
                debugLog('处理消息时发生错误', { error: e.message, data: (event && event.data ? String(event.data).substring(0, 50) : '') });
            }
        });

        ws.addEventListener("open", function() {
            debugLog(`WebSocket连接已建立: ${url}`);
        });

        ws.addEventListener("close", function(event) {
            debugLog(`WebSocket连接已关闭: ${url}`, { 
                code: event.code, 
                reason: event.reason 
            });
        });

        ws.addEventListener("error", function(event) {
            debugLog(`WebSocket错误: ${url}`, event);
        });

        return ws;
    }

    // 全局食物列表常量
    const FOOD_LIST = [
        "/items/donut",
        "/items/blueberry_donut",
        "/items/blackberry_donut",
        "/items/strawberry_donut",
        "/items/mooberry_donut",
        "/items/marsberry_donut",
        "/items/spaceberry_donut",
        "/items/cupcake",
        "/items/blueberry_cake",
        "/items/blackberry_cake",
        "/items/strawberry_cake",
        "/items/mooberry_cake",
        "/items/marsberry_cake",
        "/items/spaceberry_cake",
        "/items/gummy",
        "/items/apple_gummy",
        "/items/orange_gummy",
        "/items/plum_gummy",
        "/items/peach_gummy",
        "/items/dragon_fruit_gummy",
        "/items/star_fruit_gummy",
        "/items/yogurt",
        "/items/apple_yogurt",
        "/items/orange_yogurt",
        "/items/plum_yogurt",
        "/items/peach_yogurt",
        "/items/dragon_fruit_yogurt",
        "/items/star_fruit_yogurt",
    ];

    // 调试日志函数
    const processMyMarketListings = (myMarketListings) => {
        // 使用全局食物列表
        const foodlist = FOOD_LIST;
        for (var i = 0; i < myMarketListings.length; i++){
            // 如果当前订单的物品不在食物列表中，则将其从数组中移除
            if (!foodlist.includes(myMarketListings[i].itemHrid)) {
                myMarketListings.splice(i, 1);
                i--; // 调整索引，避免跳过下一个元素
            }
            // 再检查isSell字段是否为true，如果是true则移除
            if (myMarketListings[i] && myMarketListings[i].isSell === true) {
                myMarketListings.splice(i, 1);
                i--;
            }
            // 检查status字段是否为"/market_listing_status/active"，如果不是则移除
            if (myMarketListings[i] && myMarketListings[i].status !== "/market_listing_status/active") {
                myMarketListings.splice(i, 1);
                i--;
            }
        }
        // 新：构建 id -> itemHrid 的映射对象
        const id2itemHrid = Object.fromEntries(myMarketListings.map(o => [o.id, o.itemHrid]));
        
        return { id2itemHrid };

    }
    

    // 替换原生WebSocket
    window.WebSocket = MwiWebSocketket;
    
    // 验证替换是否成功
    debugLog('WebSocket替换完成');
    debugLog('验证替换结果:', window.WebSocket === MwiWebSocketket);
    debugLog('新WebSocket函数名:', window.WebSocket.name);

    // 消息处理器 - 处理目标消息并上传
    const processMarketMessage = (msgData) => {
        // 只处理目标消息类型（按类型分支处理）
        if (CONFIG.TARGET_MESSAGE_TYPES.includes(msgData.type)) {
            switch (msgData.type) {
                case 'market_listings_updated':
                    debugLog('检测到个人订单更新消息', { type: msgData.type });
                    uploadData(processMyMarketListings(msgData.endMarketListings));
                    break;

                case 'init_character_data':
                    debugLog('检测到角色初始化数据消息', { type: msgData.type });
                    if (characterName != null){
                        debugLog('角色名称已存在，跳过再次获取', { characterName });
                    } else if (msgData.character && msgData.character.name) {
                        characterName = msgData.character.name;
                        debugLog(`获取到角色名称: ${characterName}`);
                        try {
                            localStorage.setItem(CHARACTER_NAME_STORAGE_KEY, characterName);
                            debugLog('角色名称已保存到持久化存储');
                        } catch (e) {
                            debugLog('保存角色名称到持久化存储失败', e);
                        }
                    }
                    debugLog('开始处理初始化数据中的个人订单')
                    // 
                    if (!msgData.myMarketListings){
                        debugLog('个人订单不存在');
                        break;
                    }
                    uploadData(processMyMarketListings(msgData.myMarketListings));
                    break;

                case 'market_item_order_books_updated': {
                    debugLog('检测到物品订单簿更新消息', { type: msgData.type });
                    //在此处调用接口，获得listingids数组
                    // 尝试从消息中提取 itemHrid
                    const itemHrid = msgData.marketItemOrderBooks && msgData.marketItemOrderBooks.itemHrid;
                    if (!FOOD_LIST.includes(itemHrid)) {
                        break;
                    } 
                    fetchListingIdsForItem(itemHrid).then((listingIds) => {
                        // 计算在 bids 中的从上往下位置（1 开始）
                        const orderBooks = msgData.marketItemOrderBooks && msgData.marketItemOrderBooks.orderBooks;
                        const bids = Array.isArray(orderBooks) && orderBooks[0] && Array.isArray(orderBooks[0].bids) ? orderBooks[0].bids : [];
                        const bidsIds = bids.map(b => b.listingId);
                        const positions = listingIds
                            .map(id => bidsIds.indexOf(id))
                            .filter(idx => idx >= 0)
                            .map(idx => idx + 1);
                        highlightOrderBookRows(positions);
                    }).catch((e) => {
                        debugLog('查询 listingIds 发生错误', e);
                    });


                    //
                    break;
                }
                
            }
        }
        return msgData;
    };

    // 注册消息处理器
    handlerQueue.push(processMarketMessage);

    // 新增：查询某个 itemHrid 的 listingIds
    const fetchListingIdsForItem = async (itemHrid) => {
        try {
            const url = `${CONFIG.LISTINGS_API}?itemHrid=${encodeURIComponent(itemHrid)}`;
            debugLog('查询后端 listingIds', { url });
            const response = await fetch(url, { method: 'GET' });
            const json = await response.json();
            if (response.ok && json && json.success) {
                debugLog('查询 listingIds 成功', { itemHrid, count: json.count, listingIds: json.listingIds });
                return Array.isArray(json.listingIds) ? json.listingIds : [];
            } else {
                debugLog('查询 listingIds 失败', { status: response.status, body: json });
                return [];
            }
        } catch (e) {
            debugLog('查询 listingIds 发生错误', e);
            return [];
        }
    };

    // 注入高亮样式
    const injectHighlightStyles = () => {
        try {
            if (document.getElementById('mwi-highlight-style')) return;
            const style = document.createElement('style');
            style.id = 'mwi-highlight-style';
            style.textContent = `
            table.MarketplacePanel_orderBookTable__3zzrv tbody tr.mwi-highlight { position: relative; }
            table.MarketplacePanel_orderBookTable__3zzrv tbody tr.mwi-highlight::after {
                content: "";
                position: absolute;
                left: 0; top: 0; right: 0; bottom: 0;
                border: 2px solid #ffeb3b !important;
                pointer-events: none;
                box-sizing: border-box;
            }
            `;
            document.head.appendChild(style);
        } catch (e) {
            debugLog('注入高亮样式失败', e);
        }
    };

    // 根据位置高亮表格行
    const highlightOrderBookRows = (positions) => {
        try {
            injectHighlightStyles();
            // 只高亮第二个表格（bids表格）
            const containers = document.querySelectorAll('div.MarketplacePanel_orderBooksContainer__B4YE-');
            if (!containers || containers.length === 0) return;
            const tableContainers = containers[0].querySelectorAll('div.MarketplacePanel_orderBookTableContainer__hUu-X');
            if (!tableContainers || tableContainers.length < 2) return;
            const targetTable = tableContainers[1].querySelector('table.MarketplacePanel_orderBookTable__3zzrv');
            if (!targetTable) return;

            const rows = Array.from(targetTable.querySelectorAll('tbody tr'));
            // 清除之前的高亮
            rows.forEach(r => r.classList.remove('mwi-highlight'));
            // 应用新的高亮（1-based 索引）
            positions.forEach(pos => {
                const idx = Number(pos) - 1;
                if (idx >= 0 && idx < rows.length) {
                    rows[idx].classList.add('mwi-highlight');
                }
            });
        } catch (e) {
            debugLog('高亮表格行失败', e);
        }
    };
    debugLog('市场数据收集器已启动');
    debugLog('配置信息', CONFIG);
    debugLog('等待WebSocket连接和市场数据...');
})();