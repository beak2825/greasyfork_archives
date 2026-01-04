// ==UserScript==
// @name         [MWI]list created time
// @name:zh-CN   [银河奶牛]市场挂单时长显示
// @namespace    http://tampermonkey.net/
// @version      1.14
// @description  Display estimated listing times in marketplace order books
// @description:zh-CN  显示市场中的挂单存在时长
// @author       deric
// @match        https://www.milkywayidle.com/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/552900/%5BMWI%5Dlist%20created%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/552900/%5BMWI%5Dlist%20created%20time.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        giteeToken: 'xxx',
        giteeRepoOwner: 'xxx',
        giteeRepoName: 'xxx'
    };

    const globalVariable = {
        market: {
            allListings: {}
        },
        lastOrderBookProcessTime: 0,
        marketDataMatrix: {
            ids: [],
            times: []
        }
    };

    function updateMarketListings(listings) {
        if (!listings || typeof listings !== 'object') return;

        for (const [itemId, itemData] of Object.entries(listings)) {
            if (!globalVariable.market.allListings[itemId]) {
                globalVariable.market.allListings[itemId] = {};
            }

            if (itemData.sellOrders) {
                globalVariable.market.allListings[itemId].sellOrders = itemData.sellOrders;
            }

            if (itemData.buyOrders) {
                globalVariable.market.allListings[itemId].buyOrders = itemData.buyOrders;
            }
        }

        const matrixData = [];
        for (const itemId in globalVariable.market.allListings) {
            const item = globalVariable.market.allListings[itemId];

            if (item.sellOrders && Array.isArray(item.sellOrders)) {
                item.sellOrders.forEach(order => {
                    if (order.listingId && order.timestamp) {
                        matrixData.push({
                            id: order.listingId,
                            time: new Date(order.timestamp).toISOString()
                        });
                    }
                });
            }

            if (item.buyOrders && Array.isArray(item.buyOrders)) {
                item.buyOrders.forEach(order => {
                    if (order.listingId && order.timestamp) {
                        matrixData.push({
                            id: order.listingId,
                            time: new Date(order.timestamp).toISOString()
                        });
                    }
                });
            }
        }

        if (matrixData.length > 0) {
            const sortedData = matrixData.sort((a, b) => parseInt(a.id) - parseInt(b.id));
            const uniqueData = sortedData.filter((item, index, self) =>
                index === 0 || item.id !== self[index - 1].id
            );

            globalVariable.marketDataMatrix.ids = uniqueData.map(item => item.id);
            globalVariable.marketDataMatrix.times = uniqueData.map(item => item.time);

            uploadToGitee(globalVariable.marketDataMatrix);
        }
    }

    function mergeAndSortMatrices() {
        try {
            if (!window.apiDataMatrix) return;

            const localIds = globalVariable.marketDataMatrix.ids;
            const localTimes = globalVariable.marketDataMatrix.times;
            const apiIds = window.apiDataMatrix.ids;
            const apiTimes = window.apiDataMatrix.times;

            const combinedIds = [...localIds, ...apiIds];
            const combinedTimes = [...localTimes, ...apiTimes];

            const uniqueMap = new Map();
            combinedIds.forEach((id, index) => {
                if (!uniqueMap.has(id) || new Date(combinedTimes[index]) > new Date(uniqueMap.get(id))) {
                    uniqueMap.set(id, combinedTimes[index]);
                }
            });

            const sortedEntries = Array.from(uniqueMap.entries()).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

            globalVariable.marketDataMatrix.ids = sortedEntries.map(entry => entry[0]);
            globalVariable.marketDataMatrix.times = sortedEntries.map(entry => entry[1]);
        } catch (e) {
        }
    }

    function uploadToGitee(data) {
        try {
            const jsonData = JSON.stringify(data, null, 2);
            const filename = 'listdata.json';
            const giteeUrl = `https://gitee.com/api/v5/repos/${config.giteeRepoOwner}/${config.giteeRepoName}/contents/${filename}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: giteeUrl,
                headers: {
                    'Authorization': `token ${config.giteeToken}`
                },
                onload: function(response) {
                    let sha = '';
                    if (response.status === 200) {
                        const fileInfo = JSON.parse(response.responseText);
                        sha = fileInfo.sha;
                    }

                    const payload = {
                        message: 'Update listdata.json',
                        content: btoa(unescape(encodeURIComponent(jsonData))),
                        branch: 'master'
                    };

                    if (sha) {
                        payload.sha = sha;
                    }

                    GM_xmlhttpRequest({
                        method: 'PUT',
                        url: giteeUrl,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `token ${config.giteeToken}`
                        },
                        data: JSON.stringify(payload),
                        timeout: 10000,
                        onload: function(response) {
                            if (response.status === 200 || response.status === 201) {
                                console.log('数据上传成功！');
                            }
                        }
                    });
                }
            });
        } catch (e) {
        }
    }

    function handleMessage(data, type) {
        try {
            const obj = JSON.parse(data);

            if (type !== 'get' || !obj) return;

            if (obj.type === "init_character_data") {
                globalVariable.market.allListings = {};
                if (obj.myMarketListings) {
                    updateMarketListings(obj.myMarketListings);
                }
            } else if (obj.type === "market_listings_updated") {
                if (obj.endMarketListings) {
                    updateMarketListings(obj.endMarketListings);
                }
            } else if (obj.type === "market_item_order_books_updated") {
                const now = Date.now();
                const timeSinceLastProcess = now - globalVariable.lastOrderBookProcessTime;

                if (timeSinceLastProcess < 500) {
                    return;
                }

                globalVariable.lastOrderBookProcessTime = now;

                console.log("接收到市场物品订单簿更新消息:");
                console.log(obj);

                const allListingIds = [];
                let mainListingIds = [];

                if (obj.marketItemOrderBooks && Array.isArray(obj.marketItemOrderBooks.orderBooks)) {
                    const orderBooksCount = obj.marketItemOrderBooks.orderBooks.length;
                    console.log("检测到的orderBooks数量:", orderBooksCount);

                    obj.marketItemOrderBooks.orderBooks.forEach((orderBook, index) => {
                        const listingIdsForBook = [];

                        if (Array.isArray(orderBook.asks)) {
                            orderBook.asks.forEach(ask => {
                                if (ask.listingId && !listingIdsForBook.includes(ask.listingId)) {
                                    listingIdsForBook.push(ask.listingId);
                                }
                            });
                        }

                        if (Array.isArray(orderBook.bids)) {
                            orderBook.bids.forEach(bid => {
                                if (bid.listingId && !listingIdsForBook.includes(bid.listingId)) {
                                    listingIdsForBook.push(bid.listingId);
                                }
                            });
                        }

                        allListingIds.push(listingIdsForBook);

                        if (index === 0) {
                            mainListingIds = listingIdsForBook;
                            console.log("提取到的主要listingId数组:", mainListingIds);
                        }
                    });
                }

                const allTimeRangeArrays = [];
                const allFormattedTimeRanges = {};
                let mainTimeRangeArray = [];
                let formattedTimeRanges = [];

                if (window.apiDataMatrix) {
                    const mergedIds = window.apiDataMatrix.ids;
                    const mergedTimes = window.apiDataMatrix.times;

                    if (mergedIds.length > 0) {
                        allListingIds.forEach((listingIds, bookIndex) => {
                            const timeRangeArray = [];

                            listingIds.forEach(id => {
                                let timeRange = "";
                                const numId = parseInt(id);

                                if (numId < parseInt(mergedIds[0])) {
                                    timeRange = `0+${mergedTimes[0]}`;
                                }
                                else if (numId > parseInt(mergedIds[mergedIds.length - 1])) {
                                    timeRange = `${mergedTimes[mergedTimes.length - 1]}+-1`;
                                }
                                else {
                                    for (let i = 0; i < mergedIds.length - 1; i++) {
                                        const currentId = parseInt(mergedIds[i]);
                                        const nextId = parseInt(mergedIds[i + 1]);

                                        if (numId >= currentId && numId <= nextId) {
                                            timeRange = `${mergedTimes[i]}+${mergedTimes[i + 1]}`;
                                            break;
                                        }
                                    }
                                }

                                timeRangeArray.push(timeRange);
                            });

                            allTimeRangeArrays.push(timeRangeArray);

                            if (bookIndex === 0) {
                                mainTimeRangeArray = timeRangeArray;
                            }
                        });

                        allTimeRangeArrays.forEach((timeRangeArray, bookIndex) => {
                            const listingIds = allListingIds[bookIndex];
                            const formattedArray = timeRangeArray.map((timeRange, index) => {
                                if (!timeRange || timeRange === '0+0') {
                                    return null;
                                }

                                const currentListingId = listingIds[index];
                                const numListingId = parseInt(currentListingId);

                                const formatTimeDiff = (diffMs) => {
                                    if (diffMs < 0) return '0m';

                                    const totalDays = diffMs / (1000 * 60 * 60 * 24);
                                    const totalHours = diffMs / (1000 * 60 * 60);
                                    const totalMinutes = Math.floor(diffMs / (1000 * 60));

                                    if (totalDays >= 1) {
                                        return `${totalDays.toFixed(1)}d`;
                                    } else if (totalHours >= 1) {
                                        return `${totalHours.toFixed(1)}h`;
                                    } else {
                                        return `${totalMinutes}m`;
                                    }
                                };

                                if (timeRange.startsWith('0+') && timeRange !== '0+0') {
                                    const timeStr = timeRange.substring(2);
                                    try {
                                        const targetTime = new Date(timeStr);
                                        const now = new Date();
                                        const nowUTC8 = new Date(now.getTime() + 8 * 60 * 60 * 1000);
                                        const targetTimeUTC8 = new Date(targetTime.getTime() + 8 * 60 * 60 * 1000);
                                        const timeDiff = nowUTC8 - targetTimeUTC8;

                                        return `${formatTimeDiff(timeDiff)}以上`;
                                    } catch (e) {
                                        return '未知时间以上';
                                    }
                                }

                                if (timeRange.includes('+-1')) {
                                    const timeStr = timeRange.split('+')[0];
                                    try {
                                        const targetTime = new Date(timeStr);
                                        const now = new Date();
                                        const nowUTC8 = new Date(now.getTime() + 8 * 60 * 60 * 1000);
                                        const targetTimeUTC8 = new Date(targetTime.getTime() + 8 * 60 * 60 * 1000);
                                        const timeDiff = nowUTC8 - targetTimeUTC8;

                                        return `${formatTimeDiff(timeDiff)}以内`;
                                    } catch (e) {
                                        return '未知时间以内';
                                    }
                                }

                                const [startTimeStr, endTimeStr] = timeRange.split('+');

                                if (startTimeStr === '0' || endTimeStr === '-1') {
                                    return null;
                                }

                                let interpolatedTime = null;
                                for (let i = 0; i < mergedIds.length - 1; i++) {
                                    const currentId = parseInt(mergedIds[i]);
                                    const nextId = parseInt(mergedIds[i + 1]);

                                    if (numListingId >= currentId && numListingId <= nextId) {
                                        const startTime = new Date(startTimeStr).getTime();
                                        const endTime = new Date(endTimeStr).getTime();

                                        const idRange = nextId - currentId;
                                        const timeRange = endTime - startTime;
                                        const idPosition = numListingId - currentId;
                                        const timePosition = Math.floor((idPosition / idRange) * timeRange);

                                        interpolatedTime = new Date(startTime + timePosition);
                                        break;
                                    }
                                }

                                try {
                                    let targetTime;
                                    if (interpolatedTime) {
                                        targetTime = interpolatedTime;
                                    } else {
                                        targetTime = new Date(startTimeStr);
                                    }

                                    const now = new Date();
                                    const nowUTC8 = new Date(now.getTime() + 8 * 60 * 60 * 1000);
                                    const targetTimeUTC8 = new Date(targetTime.getTime() + 8 * 60 * 60 * 1000);
                                    const timeDiff = nowUTC8 - targetTimeUTC8;

                                    return formatTimeDiff(timeDiff);
                                } catch (e) {
                                    return null;
                                }
                            });

                            if (bookIndex === 0) {
                                formattedTimeRanges = formattedArray;
                            } else if (bookIndex >= 1 && bookIndex <= 20) {
                                const variableName = `formattedTimeRanges${bookIndex}`;
                                allFormattedTimeRanges[variableName] = formattedArray;
                                window[variableName] = formattedArray;
                            }
                        });
                    } else {
                        console.log("合并后的矩阵为空，无法生成时间范围数组");
                    }
                }

                setTimeout(() => {
                    try {
                        const enhancementElement = document.querySelector("#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.MarketplacePanel_tabsComponentContainer__3ctJH > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div > div.MarketplacePanel_infoContainer__2mCnh > div > div.Item_itemContainer__x7kH1 > div > div > div.Item_enhancementLevel__19g-e");

                        let targetFormattedTimeRanges = formattedTimeRanges;

                        if (enhancementElement && enhancementElement.textContent) {
                            const enhancementText = enhancementElement.textContent.trim();
                            const enhancementLevel = parseInt(enhancementText.match(/\d+/)[0]);
                            console.log(`检测到增强等级: ${enhancementLevel}`);

                            if (enhancementLevel >= 1 && enhancementLevel <= 20) {
                                const variableName = `formattedTimeRanges${enhancementLevel}`;
                                if (window[variableName]) {
                                    targetFormattedTimeRanges = window[variableName];
                                    console.log(`使用formattedTimeRanges${enhancementLevel}`);
                                } else {
                                    console.log(`未找到formattedTimeRanges${enhancementLevel}，使用默认formattedTimeRanges`);
                                }
                            }
                        } else {
                            console.log("未找到增强等级元素，使用默认formattedTimeRanges");
                        }

                        // 设置表格1最大填充20个，表格2填充21-40个
                        const MAX_TABLE1_ENTRIES = 20;
                        const MAX_TABLE2_ENTRIES = 20;

                        const tableSelector1 = "#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.MarketplacePanel_tabsComponentContainer__3ctJH > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div > div.MarketplacePanel_orderBook__326Yx > div.MarketplacePanel_orderBooksContainer__B4YE- > div:nth-child(1) > table";
                        const table1 = document.querySelector(tableSelector1);

                        if (table1) {
                            let hasOrderTimeColumn = false;
                            const thElements = table1.querySelectorAll('thead th');
                            for (let i = 0; i < thElements.length; i++) {
                                if (thElements[i].textContent.trim() === '时长') {
                                    hasOrderTimeColumn = true;
                                    break;
                                }
                            }

                            if (!hasOrderTimeColumn) {
                                const theadRow = table1.querySelector('thead tr');
                                if (theadRow) {
                                    const newTh = document.createElement('th');
                                    newTh.textContent = '时长';

                                    const thCells = theadRow.querySelectorAll('th');
                                    if (thCells.length > 1) {
                                        theadRow.insertBefore(newTh, thCells[thCells.length - 1]);
                                    } else {
                                        theadRow.appendChild(newTh);
                                    }

                                    const tbodyRows = table1.querySelectorAll('tbody tr');
                                    // 处理所有行，但只有前20行显示实际数据，20行之后显示"-"
                                    tbodyRows.forEach((row, i) => {
                                        const newTd = document.createElement('td');

                                        if (i < MAX_TABLE1_ENTRIES && i < targetFormattedTimeRanges.length) {
                                            const timeValue = targetFormattedTimeRanges[i];
                                            newTd.textContent = timeValue !== null ? timeValue : '-';

                                            if (timeValue !== null && timeValue !== '-') {
                                                if (timeValue.includes('d')) {
                                                    newTd.style.color = 'red';
                                                } else if (timeValue.includes('h')) {
                                                    const hours = parseFloat(timeValue);
                                                    if (hours >= 12) {
                                                        newTd.style.color = 'white';
                                                    } else {
                                                        newTd.style.color = 'green';
                                                    }
                                                } else {
                                                    newTd.style.color = 'green';
                                                }
                                            }
                                        } else {
                                            // 20行之后或数据不足时显示"-"
                                            newTd.textContent = '-';
                                        }

                                        const tdCells = row.querySelectorAll('td');
                                        if (tdCells.length > 1) {
                                            row.insertBefore(newTd, tdCells[tdCells.length - 1]);
                                        } else {
                                            row.appendChild(newTd);
                                        }
                                    })
                                }
                            }
                        }

                        const tableSelector2 = "#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.MarketplacePanel_tabsComponentContainer__3ctJH > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div > div.MarketplacePanel_orderBook__326Yx > div.MarketplacePanel_orderBooksContainer__B4YE- > div:nth-child(2) > table";
                        const table2 = document.querySelector(tableSelector2);

                        if (table2) {
                            let hasOrderTimeColumn2 = false;
                            const thElements2 = table2.querySelectorAll('thead th');
                            for (let i = 0; i < thElements2.length; i++) {
                                if (thElements2[i].textContent.trim() === '时长') {
                                    hasOrderTimeColumn2 = true;
                                    break;
                                }
                            }

                            if (!hasOrderTimeColumn2) {
                                const theadRow2 = table2.querySelector('thead tr');
                                if (theadRow2) {
                                    const newTh2 = document.createElement('th');
                                    newTh2.textContent = '时长';

                                    const thCells2 = theadRow2.querySelectorAll('th');
                                    if (thCells2.length > 1) {
                                        theadRow2.insertBefore(newTh2, thCells2[thCells2.length - 1]);
                                    } else {
                                        theadRow2.appendChild(newTh2);
                                    }

                                    const tbodyRows2 = table2.querySelectorAll('tbody tr');
                                    // 处理表格2的所有行，只对前20行使用20-39的索引显示数据，20行之后显示"-"
                                    tbodyRows2.forEach((row, i) => {
                                        const newTd2 = document.createElement('td');

                                        if (i < MAX_TABLE2_ENTRIES) {
                                            const currentIndex = MAX_TABLE1_ENTRIES + i; // 表格2使用20-39的索引

                                            if (currentIndex < targetFormattedTimeRanges.length) {
                                                const timeValue = targetFormattedTimeRanges[currentIndex];
                                                newTd2.textContent = timeValue !== null ? timeValue : '-';

                                                if (timeValue !== null && timeValue !== '-') {
                                                    if (timeValue.includes('d')) {
                                                        newTd2.style.color = 'red';
                                                    } else if (timeValue.includes('h')) {
                                                        const hours = parseFloat(timeValue);
                                                        if (hours >= 12) {
                                                            newTd2.style.color = 'white';
                                                        } else {
                                                            newTd2.style.color = 'green';
                                                        }
                                                    } else {
                                                        newTd2.style.color = 'green';
                                                    }
                                                }
                                            } else {
                                                // 数据不足时显示"-"
                                                newTd2.textContent = '-';
                                            }
                                        } else {
                                            // 20行之后显示"-"
                                            newTd2.textContent = '-';
                                        }

                                        const tdCells2 = row.querySelectorAll('td');
                                        if (tdCells2.length > 1) {
                                            row.insertBefore(newTd2, tdCells2[tdCells2.length - 1]);
                                        } else {
                                            row.appendChild(newTd2);
                                        }
                                    })
                                }
                            }
                        }
                    } catch (e) {
                    }
                }, 0);
            }
        } catch (err) {
            console.error("处理WebSocket消息时出错:", err);
        }
    }

    function initWebSocketInterceptor() {
        const oriGet = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data").get;

        function hookedGet() {
            const socket = this.currentTarget;
            if (!(socket instanceof WebSocket) || !socket.url) {
                return oriGet.call(this);
            }

            const message = oriGet.call(this);
            try {
                handleMessage(message, 'get');
            } catch (err) {
                console.error("拦截WebSocket接收消息时出错:", err);
            }
            return message;
        }

        Object.defineProperty(MessageEvent.prototype, "data", {
            get: hookedGet,
            configurable: true,
            enumerable: true
        });

        const originalSend = WebSocket.prototype.send;

        WebSocket.prototype.send = function (message) {
            try {
                handleMessage(message, 'send');
            } catch (err) {
                console.error("拦截WebSocket发送消息时出错:", err);
            }
            return originalSend.call(this, message);
        };
    }

    function fetchAndPrintApiData() {
        const apiUrl = 'https://gitee.com/derrrric/milkywayidle_listtime/raw/master/listdata.json';
        console.log(`尝试获取API数据: ${apiUrl}`);

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            headers: {
                'Accept': 'application/json',
            },
            timeout: 10000,
            onload: function(response) {
                console.log(`API请求完成，状态码: ${response.status}`);

                try {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);

                            if (Array.isArray(data)) {
                                const ids = data.map(item => item.id || '').filter(Boolean);
                                const times = data.map(item => item.time || '').filter(Boolean);

                                if (ids.length > 0 && times.length > 0) {
                                    window.apiDataMatrix = {
                                        ids: ids,
                                        times: times
                                    };

                                    if (globalVariable.marketDataMatrix.ids.length > 0) {
                                        mergeAndSortMatrices();
                                    }
                                } else {
                                    console.log('API数据中没有找到id和time字段');
                                    console.log('从API获取的JSON数据:', data);
                                }
                            } else {
                                console.log('API返回的数据不是数组格式');
                                console.log('从API获取的JSON数据:', data);
                            }
                        } catch (jsonError) {
                            console.log('从API获取的文本数据:', response.responseText);
                            console.warn('无法解析为JSON:', jsonError.message);
                        }
                    } else {
                        console.error(`API请求失败，状态码: ${response.status}, 响应: ${response.statusText}`);
                    }
                } catch (error) {
                    console.error('处理API响应时出错:', error);
                }
            },
            onerror: function(error) {
                console.error('API请求出错:', error);
                console.info('可能的原因: 网络连接问题、服务器不可达或URL不正确');
            },
            ontimeout: function() {
                console.error('API请求超时: 请求在10秒内未完成');
            }
        });
    }

    initWebSocketInterceptor();
    fetchAndPrintApiData();
})();