// ==UserScript==
// @name         48PaiPriceViewer
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  PriceViewer：看价和设定价格。0.9分域名
// @author       so-fei-jie-hun
// @match        https://shop.48.cn/pai/item/*
// @match        https://48.gnz48.com/pai/item/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556462/48PaiPriceViewer.user.js
// @updateURL https://update.greasyfork.org/scripts/556462/48PaiPriceViewer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let bidsList = [];
    let started = false;
    let autoBid = false;

    const urlParts = window.location.pathname.split('/');
    const pai_item = urlParts[urlParts.length - 1];

    function createFloatingWindow() {
        const floatingWindow = document.createElement('div');
        floatingWindow.id = 'floatingWindow';
        floatingWindow.innerHTML = `
    <div id="floatingWindowHeader">
        <h3>看价&出价</h3>
    </div>
    <div id="floatingWindowContent">
        <div id="controlPanel">
            <label for="refreshInterval">轮询间隔</label>
            <input type="number" id="refreshInterval" value="1000">
            <label for="pageSize">页大小</label>
            <input type="number" id="pageSize" value="20" min="1">
            <label for="paiItem">商品ID</label>
            <input type="text" id="paiItem" value=${pai_item}>
            <button id="bidPoolingButton">开始</button>
            <br>
            <span id="refreshTime"></span>
            <span id="responseTime">响应时间 ...</span>
        </div>
        <div id="autoBidPanel">
            <label for="targetRank">目标顺位</label>
            <input type="number" id="targetRank" min="1" value="12">
            <label for="increment">加价</label>
            <input type="number" id="increment" value="1">
            <label for="minBudget">最小价格</label>
            <input type="number" id="minBudget" min="1" value="1">
            <label for="maxBudget">最大价格</label>
            <input type="number" id="maxBudget" min="1" value="1000">
            <button id="autoBidButton">开始</button>
        </div>
        <div id="apiResult">
            <table id="bidsTable">
                <thead>
                    <tr>
                        <th>排名</th>
                        <th>用户名</th>
                        <th>价格</th>
                        <th>排名</th>
                        <th>用户名</th>
                        <th>价格</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
    <div id="resizeHandle"></div>
`;
        document.body.appendChild(floatingWindow);

        // Add styles for the floating window
        GM_addStyle(`
            #floatingWindow {
                position: fixed;
                left: 10px;  /* Adjusted to left side */
                top: 50%;
                transform: translateY(-50%);
                width: 500px;
                height: 600px; /* Adjusted height */
                background: white;
                border: 1px solid #ccc;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                z-index: 10000;
                overflow: hidden;
                font-family: Arial, sans-serif;
                resize: both;
                display: flex;
                flex-direction: column;
            }
            #floatingWindowHeader {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 5px 10px; /* Adjust padding to reduce the gap */
                background: #f1f1f1;
                border-bottom: 1px solid #ccc;
                cursor: move;
            }
            #controlPanel, #autoBidPanel {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                padding: 5px 10px; /* Adjust padding to reduce the gap */
                background: #f9f9f9;
                border-bottom: 1px solid #ccc;
                margin-bottom: 10px;
            }
            #controlPanel label, #autoBidPanel label {
                margin-right: 5px; /* Adjust margin to reduce the gap */
            }
            #controlPanel input, #autoBidPanel input {
                width: 60px;
                margin-right: 5px; /* Adjust margin to reduce the gap */
            }
            button {
                background: #28a745;
                color: white;
                border: none;
                cursor: pointer;
                padding: 5px 10px;
                margin-right: 5px; /* Adjust margin to reduce the gap */
            }
            #refreshTime, #responseTime {
                display: block;
                margin-top: 5px; /* Adjust margin to reduce the gap */
            }
            #floatingWindowContent {
                padding: 5px 10px; /* Adjust padding to reduce the gap */
                flex: 1;
                overflow: auto;
                white-space: pre-wrap;
                word-wrap: break-word;
            }
            #bidsTable {
                width: 100%;
                border-collapse: collapse;
            }
            #bidsTable th, #bidsTable td {
                border: 1px solid #ddd;
                padding: 5px; /* Adjust padding to reduce the gap */
                text-align: left;
            }
            #bidsTable th {
                background-color: #f2f2f2;
            }
            #resizeHandle {
                width: 10px;
                height: 10px;
                background: transparent;
                position: absolute;
                right: 0;
                bottom: 0;
                cursor: se-resize;
            }
        `);

        // Add drag functionality
        let isDragging = false;
        let offsetX, offsetY;

        const header = floatingWindow.querySelector('#floatingWindowHeader');
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - floatingWindow.getBoundingClientRect().left;
            offsetY = e.clientY - floatingWindow.getBoundingClientRect().top;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (isDragging) {
                floatingWindow.style.left = `${e.clientX - offsetX}px`;
                floatingWindow.style.top = `${e.clientY - offsetY}px`;
                floatingWindow.style.transform = 'none';
            }
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        // Add resize functionality
        const resizeHandle = document.getElementById('resizeHandle');
        resizeHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            document.addEventListener('mousemove', onResize);
            document.addEventListener('mouseup', stopResize);
        });

        function onResize(e) {
            floatingWindow.style.width = `${e.clientX - floatingWindow.getBoundingClientRect().left}px`;
            floatingWindow.style.height = `${e.clientY - floatingWindow.getBoundingClientRect().top}px`;
        }

        function stopResize() {
            document.removeEventListener('mousemove', onResize);
            document.removeEventListener('mouseup', stopResize);
        }

        // Add start/stop functionality
        const bidPoolingButton = document.getElementById('bidPoolingButton');
        bidPoolingButton.addEventListener('click', async () => {
            if (!started) { // start
                started = true;
                await fetchAndCalcBid()
                bidPoolingButton.style.backgroundColor = '#dc3545';
                bidPoolingButton.textContent = '结束';
            } else { // stop
                started = false;
                bidPoolingButton.style.backgroundColor = '#28a745';
                bidPoolingButton.textContent = '开始';
            }
        });

        // Add interval change handler to stop polling
        const refreshIntervalInput = document.getElementById('refreshInterval');
        refreshIntervalInput.addEventListener('change', () => {
            if (started) {
                started = false;
                bidPoolingButton.style.backgroundColor = '#28a745';
                bidPoolingButton.textContent = '开始';
                console.log('轮询间隔已变更，轮询已停止。请点击开始按钮重新启动。');
            }
        });

        const autoBidButton = document.getElementById('autoBidButton');
        autoBidButton.addEventListener('click', () => {
            if (!autoBid) { // start
                autoBid = true
                autoBidButton.style.backgroundColor = '#dc3545';
                autoBidButton.textContent = '结束';
            } else { // stop
                autoBid = false
                autoBidButton.style.backgroundColor = '#28a745';
                autoBidButton.textContent = '开始';
            }
        });
    }

    // 获取当前域名对应的API配置
    function getApiConfig() {
        const currentDomain = window.location.hostname;

        // window.location.hostname.includes('gnz48.com')
        if (window.location.hostname.includes('gnz48.com')) {
            return {
                apiBaseUrl: 'https://48.gnz48.com',
                origin: 'https://48.gnz48.com',
                host: '48.gnz48.com'
            };
        } else {
            // 默认为48.cn域名
            return {
                apiBaseUrl: 'https://shop.48.cn',
                origin: 'https://shop.48.cn',
                host: 'shop.48.cn'
            };
        }
    }

    // Fetch bids data for multiple pages if needed
    async function fetchBidsData(pai_item, userPageSize) {
        const apiConfig = getApiConfig();
        const apiUrl = `${apiConfig.apiBaseUrl}/pai/GetShowBids`;
        const fixedPageSize = 20; // API now requires fixed pageSize of 20
        const numberOfCalls = Math.ceil(userPageSize / fixedPageSize);
        console.log(`Number of API calls needed: ${numberOfCalls}`);
        const allBids = [];

        // Make serial API calls
        for (let page = 1; page <= numberOfCalls; page++) {
            const rValue = Math.random().toString();
            const data = `id=${pai_item}&numPerPage=${fixedPageSize}&pageNum=${page}&r=${rValue}`;
            console.log(data)

            // Use PC version headers
            const headers = {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Accept-Language': 'ja,zh-CN;q=0.9,zh;q=0.8',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Origin': apiConfig.origin,
                'Pragma': 'no-cache',
                'Referer': `${apiConfig.origin}/pai/item/${pai_item}`,
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest',
                'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"'
            };

            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: apiUrl,
                        data: data,
                        headers: headers,
                        onload: resolve,
                        onerror: reject
                    });
                });

                if (response.status === 200) {
                    const jsonResponse = JSON.parse(response.responseText);
                    if (jsonResponse.list && jsonResponse.list.length > 0) {
                        // Only take the first 20 items from each response
                        const bidsToTake = jsonResponse.list.slice(0, 20);
                        allBids.push(...bidsToTake);
                        console.log(`Page ${page}: got ${jsonResponse.list.length} items, taking first 20`);
                    } else {
                        // No more data available, stop making more calls
                        break;
                    }
                } else {
                    throw new Error(`HTTP error: ${response.statusText}`);
                }
            } catch (error) {
                console.error(`Error fetching page ${page}:`, error);
                // Continue with whatever data we have
                break;
            }
        }

        return allBids;
    }

    // loop this
    async function fetchAndCalcBid() {
        if (!started) {
            return;
        }

        const userPageSize = parseInt(document.getElementById('pageSize').value, 10);
        const pai_item = document.getElementById('paiItem').value;
        const startTime = Date.now();

        try {
            const allBids = await fetchBidsData(pai_item, userPageSize);
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            // 创建新的bidsList，确保相同用户只保留最高价
            const newBidList = [];
            const userBidMap = new Map(); // 存储每个用户的最高出价

            // 处理所有API返回的数据
            for (const bid of allBids) {
                if (!userBidMap.has(bid.user_name)) {
                    // 第一次遇到这个用户，添加到map
                    userBidMap.set(bid.user_name, {
                        username: bid.user_name,
                        price: bid.bid_amt,
                        status: bid.auction_status
                    });
                } else {
                    // 如果用户已存在，检查是否需要更新价格（保留更高的价格）
                    const existingBid = userBidMap.get(bid.user_name);
                    if (bid.bid_amt > existingBid.price) {
                        userBidMap.set(bid.user_name, {
                            username: bid.user_name,
                            price: bid.bid_amt,
                            status: bid.auction_status
                        });
                    }
                }
            }

            // 将map转换为数组并按价格降序排序
            const sortedBids = Array.from(userBidMap.values()).sort((a, b) => b.price - a.price);

            // 设置排名
            for (let i = 0; i < sortedBids.length; i++) {
                newBidList.push({
                    rank: i + 1,
                    username: sortedBids[i].username,
                    price: sortedBids[i].price,
                    status: sortedBids[i].status
                });
            }

            // 替换整个bidsList
            bidsList = newBidList;
            document.getElementById('responseTime').textContent = `响应时间 ${responseTime} ms`;
            const now = new Date();
            const timeString = now.toTimeString().split(' ')[0] + '.' + ('000' + now.getMilliseconds()).slice(-3);
            document.getElementById('refreshTime').textContent = `上次刷新 ${timeString} (获取${allBids.length}条数据)`;
            displayBids();
            if (autoBid) {
                performAutoBid();
            }
        } catch (error) {
            console.error('Error in fetchAndCalcBid:', error);
            document.getElementById('apiResult').textContent = `Error fetching data: ${error.message}`;
        }

        setTimeout(() => {
            logMessage('Fetching bids...');
            fetchAndCalcBid();
        }, parseInt(document.getElementById('refreshInterval').value, 10));
    }

    // Function to display bids in a table
    function displayBids() {
        const tbody = document.querySelector('#bidsTable tbody');
        tbody.innerHTML = '';

        // Display bids in two columns using bidsList (already ordered)
        for (let i = 0; i < bidsList.length; i += 2) {
            const row = document.createElement('tr');

            const rankCell1 = document.createElement('td');
            rankCell1.textContent = bidsList[i].rank;
            if (bidsList[i].status === 1) {
                rankCell1.style.color = 'red';
            }

            const userCell1 = document.createElement('td');
            userCell1.textContent = bidsList[i].username;

            const bidCell1 = document.createElement('td');
            bidCell1.textContent = bidsList[i].price;

            row.appendChild(rankCell1);
            row.appendChild(userCell1);
            row.appendChild(bidCell1);

            if (i + 1 < bidsList.length) {
                const rankCell2 = document.createElement('td');
                rankCell2.textContent = bidsList[i + 1].rank;
                if (bidsList[i + 1].status === 1) {
                    rankCell2.style.color = 'red';
                }

                const userCell2 = document.createElement('td');
                userCell2.textContent = bidsList[i + 1].username;

                const bidCell2 = document.createElement('td');
                bidCell2.textContent = bidsList[i + 1].price;

                row.appendChild(rankCell2);
                row.appendChild(userCell2);
                row.appendChild(bidCell2);
            }

            tbody.appendChild(row);
        }
    }

    // Function to perform auto bid
    function performAutoBid() {
        const targetRank = parseInt(document.getElementById('targetRank').value, 10);
        const increment = parseInt(document.getElementById('increment').value, 10);
        const minBudget = parseInt(document.getElementById('minBudget').value, 10);
        const maxBudget = parseInt(document.getElementById('maxBudget').value, 10);

        let targetBidAmount = minBudget;

        // Use bidsList directly since it's already ordered by rank
        if (bidsList.length >= targetRank) {
            targetBidAmount = bidsList[targetRank - 1].price + increment;
        }

        if (targetBidAmount > maxBudget) {
            targetBidAmount = maxBudget;
        }

        const txtInput = document.getElementById('txt_amt');
        if (txtInput) { // active
            document.getElementById('txt_amt').value = targetBidAmount;
        }
        logMessage(targetBidAmount);
    }

    function logMessage(message) {
        const now = new Date();
        const formattedTime = now.toLocaleString();
        console.log(`[${formattedTime}] ${message}`);
    }

    function main() {
        createFloatingWindow();
    }

    main();
})();