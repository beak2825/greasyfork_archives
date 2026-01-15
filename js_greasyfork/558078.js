// ==UserScript==
// @name         摸鱼放置妙妙小工具_v0.42.3
// @namespace    http://tampermonkey.net/
// @version      0.42.3
// @description  火龙果妙妙小工具,日利计算，每日利润计算，仓库价格统计，菜单栏技能信息
// @author       火龙果
// @match        **moyu-idle.com/*
// @match        *://*moyu-idle.com/*
// @match        *://www.moyu-idle.com/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moyu-idle.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @run-at       document-start
// @require      https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js
// @downloadURL https://update.greasyfork.org/scripts/558078/%E6%91%B8%E9%B1%BC%E6%94%BE%E7%BD%AE%E5%A6%99%E5%A6%99%E5%B0%8F%E5%B7%A5%E5%85%B7_v0423.user.js
// @updateURL https://update.greasyfork.org/scripts/558078/%E6%91%B8%E9%B1%BC%E6%94%BE%E7%BD%AE%E5%A6%99%E5%A6%99%E5%B0%8F%E5%B7%A5%E5%85%B7_v0423.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //有什么关于本脚本的意见或建议 1群内找火龙果

    // 显示用户等级信息
    let showUserLevel = true;
    // 显示物品价格
    let showItemPrice = false;
    // 等待返回消息时长 设置长时间以防破财 毫秒
    const waitForMsg = 30 * 1000;
    // socketIo模式
    const socketIoMode = true;
    // ws调试模式开关
    let WS_DEBUG_MODE = false;
    // 显示真战斗经验
    let showRealBattleExp = true;
    // debugLogs
    const debugLogs = false;
    // 发送时间间隔 毫秒
    const sendInterval = 500;

    console.log(`[猫猫放置妙妙小工具] 已启动 v0.39`);

    initWs()
    // 物品价格 物品:价格
    let cn_en = {};
    let en_cn = {};

    // 仓库物品数量
    let warehouseItemsCount = {};

    // 市场价格
    let marketPrices = GM_getValue('marketPrices', {});
    unsafeWindow.marketPrices = marketPrices;

    initMarketPrices();

    let catDaily = GM_getValue('catDaily', false);

    async function initMarketPrices() {
        // API 请求配置
        const apiUrl = 'https://www.moyu-idle.com/api/game/market/price';
        const data = await httpGet(apiUrl);
        console.log('[妙妙工具] 获取市场价格成功,更新时间：', new Date(data.lastUpdateTime).toLocaleString())
        const newMarketPrices = data.items

        newMarketPrices["gold"] = {
            sellOrders: {
                itemId: "gold",
                minPrice: 1,
                minPriceCount: 1
            },
            buyOrders: {
                itemId: "gold",
                maxPrice: 1,
                maxPriceCount: 1
            }
        }

        newMarketPrices["__satiety"] = {
            sellOrders: {
                itemId: "__satiety",
                minPrice: 5,
                minPriceCount: 1
            },
            buyOrders: {
                itemId: "__satiety",
                maxPrice: 5,
                maxPriceCount: 1
            }
        }

        for (const [id, item] of Object.entries(newMarketPrices)) {
            if (id) {
                if (!item['sellOrders']) {
                    item['sellOrders'] = {
                        minPrice: 0,
                        minPriceCount: 0
                    }
                }
                if (!item['buyOrders']) {
                    item['buyOrders'] = {
                        maxPrice: 0,
                        maxPriceCount: 0
                    }
                }
                marketPrices[id] = item;
            }
        }

        GM_setValue('marketPrices', marketPrices);
    }


    function getCnToEn(itemInfos) {
        let mapping = Object.fromEntries(
            Object.entries(itemInfos).map(item => [item[1]?.name, item[0]])
        )
        mapping['饱食度'] = '__satiety'
        return mapping;
    }

    function getEntoCn(itemInfos) {
        let mapping = Object.fromEntries(
            Object.entries(itemInfos).map(item => [item[0], item[1]?.name,])
        )
        mapping['__satiety'] = '饱食度'
        return mapping;
    }

    // 轮询等待数据到来
    function waitFor(item) {
        return new Promise((resolve, reject) => {
            // 如果数据已经存在，直接返回，保存最新数据兜底
            if (unsafeWindow[item] && Object.keys(unsafeWindow[item]).length > 0) {
                GM_setValue(item, unsafeWindow[item])
                resolve(unsafeWindow[item]);
                return;
            }

            // 否则开始轮询
            const maxWaitTime = 50000; // 5秒超时
            const checkInterval = 200;
            const startTime = Date.now();

            const checkData = () => {
                if (unsafeWindow[item] && Object.keys(unsafeWindow[item]).length > 0) {
                    GM_setValue(item, unsafeWindow[item])
                    resolve(unsafeWindow[item]);
                    return;
                }

                if (Date.now() - startTime > maxWaitTime) {
                    // 超时，尝试读取兜底数据
                    const cachedValue = GM_getValue(item)
                    if (!cachedValue) {
                        // 兜底数据也不存在
                        reject(new Error(`等待数据:${item} 超时`));
                        return;
                    }
                    resolve(cachedValue);
                }

                setTimeout(checkData, checkInterval);
            };

            checkData();
        });
    }

    // 使用 Promise 封装 GM_xmlhttpRequest
    function httpGet(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function (response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.code === 200) {
                                resolve(data.data); // 数据
                            } else {
                                reject(new Error("业务错误: " + data.message));
                            }
                        } catch (error) {
                            reject(new Error("解析响应失败: " + error.message));
                        }
                    } else {
                        reject(new Error("请求失败，状态码: " + response.status));
                    }
                },
                onerror: function (error) {
                    reject(new Error("网络错误: " + error));
                }
            });
        });
    }

    function addDailyTable(dialog) {

        if (!dialog) {
            return;
        }
        // 横杠
        const borderElement = dialog.querySelector('.border-t.border-gray-200.dark\\:border-gray-600.my-3');
        const oldDailyStatsTable = document.querySelector('#daily-stats-table')
        if (oldDailyStatsTable) {
            oldDailyStatsTable.remove()
        }
        // 3. 提取耗时（修复querySelector）
        const timeLabel = findElementByText(dialog, '耗时:', 'span');
        const timeCard = timeLabel?.closest('.p-2.bg-gray-100.dark\\:bg-gray-700.rounded.mb-2');
        if (!timeCard) {
            return;
        }

        // 4. 耗时转换（保持不变）
        const timeTextRaw = timeCard.querySelector('.bg-blue-100')?.textContent || '';

        let actualTimeText;
        if (catDaily) {
            actualTimeText = timeTextRaw.match(/(?<=基础)(\d+天)?(\d+时)?(\d+分)?(\d+秒)?/)?.[0]?.trim() || '';
        } else {
            actualTimeText = timeTextRaw.match(/^(.*?)\(基础/)?.[1]?.trim() || '';
        }

        let costTime = convertTimeToSeconds(actualTimeText);
        if (catDaily) {
            costTime *= 0.93;
        }
        // 提取需求（避免重复解析）
        const demands = [];
        const demandLabels = findElementsByText(dialog, '需求:', 'span');

        demandLabels.forEach(label => {
            const demandCard = label.closest('.p-2.bg-gray-100.dark\\:bg-gray-700.rounded.mb-2');

            // 精准选择需求项元素（只选择最内层的span）
            const demandItems = demandCard?.querySelectorAll('div.flex.items-center.rounded.text-sm.white-space-nowrap > span.inline-block.px-2.py-1.rounded.text-sm');
            demandItems?.forEach(item => {
                const text = item.textContent.trim();
                // 尝试匹配"名称: 数量"格式
                const resourceMatch = text.match(/(.+?)\s*[:：]\s*(\d+)\s*(?:\(([^)]*)\))?/);

                if (resourceMatch) {
                    demands.push({
                        type: 'resource',
                        name: removeEmoji(resourceMatch[1].trim()).trim(),
                        amount: parseInt(resourceMatch[2])
                    });
                }
            });
        });

        // 提取获得
        const gainLabel = findElementByText(dialog, '获得:', 'span');
        const gainCard = gainLabel?.closest('.p-2.bg-gray-100.dark\\:bg-gray-700.rounded.mb-2');
        const gainItems = gainCard?.querySelectorAll('.bg-blue-100');
        const gains = [];

        gainItems?.forEach(item => {
            const text = item.textContent.trim();
            const nameMatch = text.match(/(.+?)\s*[:：]/)?.[1]?.trim();
            const probMatch = text.match(/(\d+\.?\d*)%/)?.[1] || '100';

            let min, max;
            const rangeMatch = text.match(/(\d+)\s*[~-]\s*(\d+)/);

            if (rangeMatch) {
                // 处理范围情况（如 "1~3"）
                min = parseInt(rangeMatch[1]);
                max = parseInt(rangeMatch[2]);
            } else {
                // 处理单个数字情况（如 "1"）
                const singleMatch = text.match(/(\d+)/);
                if (singleMatch) {
                    min = max = parseInt(singleMatch[1]);
                } else {
                    // 默认值（防止NaN）
                    min = max = 1;
                }
            }

            const probability = parseFloat(probMatch) / 100;

            if (nameMatch && !isNaN(min) && !isNaN(max) && !isNaN(probability)) {
                gains.push({
                    name: removeEmoji(nameMatch).trim(),
                    range: [min, max],
                    probability
                });
            }
        });

        // 7. 计算每日产量和消耗量（保持不变）
        const dailyTimes = Math.floor(86400 / costTime);

        // 原料
        const dailyConsume = demands.map(demand => {
            const amount = demand.amount * (catDaily ? 0.95 : 1);
            return {
                name: demand.name,
                amount: amount,
                total: amount * dailyTimes
            }
        });

        // 产出
        const dailyOutput = gains.map(gain => {
            const avgPerAmount = (gain.range[0] + gain.range[1]) / 2;
            const avgAmount = avgPerAmount * gain.probability * (catDaily ? 1.05 : 1);
            return {
                name: gain.name,
                amount: avgAmount,
                total: Math.round(dailyTimes * avgAmount)
            };
        });
        // 创建展示区
        createDisplayHtml(dialog, borderElement, costTime, dailyConsume, dailyOutput);

    }

    //秒转 天 时 分 秒
    function formatSeconds(seconds) {
        // 处理无效输入
        if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
            return "0秒";
        }

        // 计算各单位值
        const days = Math.floor(seconds / 86400); // 1天 = 86400秒
        const hours = Math.floor((seconds % 86400) / 3600); // 1小时 = 3600秒
        const minutes = Math.floor((seconds % 3600) / 60); // 1分钟 = 60秒
        const remainingSeconds = Math.floor(seconds % 60);

        // 存储非零单位
        const timeParts = [];
        if (days > 0) timeParts.push(`${days}天`);
        if (hours > 0) timeParts.push(`${hours}时`);
        if (minutes > 0) timeParts.push(`${minutes}分`);
        if (remainingSeconds > 0) timeParts.push(`${remainingSeconds}秒`);

        // 处理所有单位都为0的情况（输入为0时）
        if (timeParts.length === 0) {
            return "0秒";
        }

        // 拼接结果
        return timeParts.join('');
    }
    function convertTimeToSeconds(timeText) {
        let totalSeconds = 0;

        // 匹配“时”（1时=3600秒）
        const hourMatch = timeText.match(/(\d+\.?\d*)\s*[时h]/);
        if (hourMatch) {
            totalSeconds += parseFloat(hourMatch[1]) * 3600;
            timeText = timeText.replace(hourMatch[0], ''); // 移除已匹配的部分
        }

        // 匹配“分”（1分=60秒）
        const minuteMatch = timeText.match(/(\d+\.?\d*)\s*[分m]/);
        if (minuteMatch) {
            totalSeconds += parseFloat(minuteMatch[1]) * 60;
            timeText = timeText.replace(minuteMatch[0], ''); // 移除已匹配的部分
        }

        // 匹配“秒”（直接累加）
        const secondMatch = timeText.match(/(\d+\.?\d*)\s*[秒s]/);
        if (secondMatch) {
            totalSeconds += parseFloat(secondMatch[1]);
        }

        return totalSeconds;
    }
    /**
     * 查找包含指定文本的元素
     * @param {Element} parent 父元素
     * @param {string} text 要匹配的文本
     * @param {string} tag 目标元素标签（如 'span'）
     * @returns {Element[]} 匹配的元素数组
     */
    function findElementsByText(parent, text, tag = '*') {
        const result = [];
        const elements = parent.getElementsByTagName(tag);
        for (const el of elements) {
            if (el.textContent.trim().includes(text.trim())) {
                result.push(el);
            }
        }
        return result;
    }

    // 工具函数：查找包含指定文本的单个元素
    function findElementByText(parent, text, tag = '*') {
        const elements = parent.getElementsByTagName(tag);
        for (const el of elements) {
            if (el.textContent.trim().includes(text.trim())) {
                return el;
            }
        }
        return null;
    }

    GM_addStyle(`
        .item-refresh-btn {
            cursor: pointer;
            font-size: 18px;
            transition: all 0.2s ease;
            user-select: none;
        }

        .item-refresh-btn:active {
            transform: scale(0.9);
            opacity: 0.6;
            filter: brightness(0.7);
        }

        .item-refresh-btn:hover {
            transform: rotate(15deg);
        }
    `);

    // 核心函数：使用dailyConsume和dailyOutput创建展示区HTML
    function createDisplayHtml(dialog, borderElement, costTime, dailyConsume, dailyOutput) {
        // 单个物品的材料价格
        let sellUnitPrice = 0;
        let buyUnitPrice = 0;

        // 计算原料总价值
        const materialRows = dailyConsume.map(item => {
            const price = marketPrices[cn_en[item.name]] || { sellOrders: { minPrice: 0 }, buyOrders: { maxPrice: 0 } };

            const sellValue = item.total * price.sellOrders.minPrice;  // 总挂价价值
            const buyValue = item.total * price.buyOrders.maxPrice;    // 总填价价值

            sellUnitPrice += item.amount * price.sellOrders.minPrice;
            buyUnitPrice += item.amount * price.buyOrders.maxPrice;
            return {
                ...item,
                price,
                sellValue,
                buyValue
            };
        });

        // 计算产品总价值
        const productRows = dailyOutput.map(item => {
            const price = marketPrices[cn_en[item.name]] || { sellOrders: { minPrice: 0 }, buyOrders: { maxPrice: 0 } };
            const sellValue = item.total * price.sellOrders?.minPrice;  // 总挂价价值
            const buyValue = item.total * price.buyOrders?.maxPrice;    // 总填价价值
            return {
                ...item,
                price,
                sellValue,
                buyValue
            };
        });

        // 计算总计
        const totalMaterialSell = materialRows.reduce((sum, item) => sum + item.sellValue, 0);
        const totalMaterialBuy = materialRows.reduce((sum, item) => sum + item.buyValue, 0);
        const totalProductSell = productRows.reduce((sum, item) => sum + item.sellValue, 0);
        const totalProductBuy = productRows.reduce((sum, item) => sum + item.buyValue, 0);

        const cutTex = 0.97

        // 计算利润
        const profit1 = totalProductSell * cutTex - totalMaterialBuy;  // 产品挂价 - 原料填价
        const profit2 = totalProductBuy * cutTex - totalMaterialSell;  // 产品填价 - 原料挂价

        // 生成原料行HTML
        const materialHtml = materialRows.map(item => `
            <tr>
                <td class="border px-2 py-1 text-sm">${item.name}<span class="item-refresh-btn text-sm" data-itemname="${cn_en[item.name]}">↺</span></td>
                <td class="border px-2 py-1 text-sm text-right">${item.total.toFixed(0)}</td>
                <td class="border px-2 py-1 text-sm text-right ${item.price.sellOrders.minPrice == 0 ? 'text-red-600' : ''}">${formatLargeNumber(item.price.sellOrders.minPrice)}</td>
                <td class="border px-2 py-1 text-sm text-right">${formatLargeNumber(item.sellValue)}</td>
                <td class="border px-2 py-1 text-sm text-right ${item.price.buyOrders.maxPrice == 0 ? 'text-red-600' : ''}">${formatLargeNumber(item.price.buyOrders.maxPrice)}</td>
                <td class="border px-2 py-1 text-sm text-right">${formatLargeNumber(item.buyValue)}</td>
            </tr>
        `).join('');

        // 生成产品行HTML
        const productHtml = productRows.map(item => `
            <tr>
                <td class="border px-2 py-1 text-sm">${item.name}<span class="item-refresh-btn text-sm" data-itemname="${cn_en[item.name]}">↺</span></td>
                <td class="border px-2 py-1 text-sm text-right">${item.total.toFixed(0)}</td>
                <td class="border px-2 py-1 text-sm text-right ${item.price.sellOrders.minPrice == 0 ? 'text-red-600' : ''}">${formatLargeNumber(item.price.sellOrders.minPrice)}</td>
                <td class="border px-2 py-1 text-sm text-right">${formatLargeNumber(item.sellValue)}</td>
                <td class="border px-2 py-1 text-sm text-right ${item.price.buyOrders.maxPrice == 0 ? 'text-red-600' : ''}">${formatLargeNumber(item.price.buyOrders.maxPrice)}</td>
                <td class="border px-2 py-1 text-sm text-right">${formatLargeNumber(item.buyValue)}</td>
            </tr>
        `).join('');

        // 技能升级提示
        const displayHtml = `
            <div id="daily-stats-table" class="my-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <!-- 插入样式代码 -->
                <style>
                    /* 表格边框统一改为浅灰色 */
                    #daily-stats-table table {
                        border-collapse: collapse;
                    }
                    #daily-stats-table th,
                    #daily-stats-table td {
                        border-color: #e5e7eb !important;
                    }
                    @media (prefers-color-scheme: dark) {
                        #daily-stats-table th,
                        #daily-stats-table td {
                            border-color: #374151 !important;
                        }
                    }
                    #daily-stats-table thead tr {
                        border-bottom: 1px solid #e5e7eb !important;
                    }

                    #daily-stats-table .input-checkbox {
                        vertical-align: middle;
                        margin-top: 2px;
                    }

                    #daily-stats-table .span-checkbox {
                        display: inline-flex;
                        align-items: center;
                        gap: 4px;
                    }
                    @media (prefers-color-scheme: dark) {
                        #daily-stats-table thead tr {
                            border-bottom-color: #374151 !important;
                        }
                    }
                </style>
                <h4 class="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">每日产量/消耗价值表<span class="text-sm span-checkbox">  (小猫<input type="checkbox" id="isCatDaily" class="input-checkbox" ${catDaily ? 'checked' : ''}>)</span></h4>

                <!-- 原料消耗部分 -->
                <div class="mb-4">
                    <h5 class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">消耗</h5>
                    <table class="min-w-full text-sm">
                        <thead>
                            <tr class="bg-gray-50 dark:bg-gray-700">
                                <th class="border px-2 py-1 text-left" style="min-width: 45px;">原料</th>
                                <th class="border px-2 py-1 text-center">日消</th>
                                <th class="border px-2 py-1 text-center">挂</th>
                                <th class="border px-2 py-1 text-center">总挂</th>
                                <th class="border px-2 py-1 text-center">填</th>
                                <th class="border px-2 py-1 text-center">总填</th>
                            </tr>
                        </thead>
                        <tbody>${materialHtml}</tbody>
                        <tfoot class="bg-gray-50 dark:bg-gray-700 font-medium">
                            <tr>
                                <td class="border px-2 py-1 text-left" style="min-width: 45px;">总计</td>
                                <td class="border px-2 py-1 text-center">-</td>
                                <td class="border px-2 py-1 text-center">${formatLargeNumber(sellUnitPrice)}</td>
                                <td class="border px-2 py-1 text-center">${formatLargeNumber(totalMaterialSell)}</td>
                                <td class="border px-2 py-1 text-center">${formatLargeNumber(buyUnitPrice)}</td>
                                <td class="border px-2 py-1 text-center">${formatLargeNumber(totalMaterialBuy)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <!-- 产品产出部分 -->
                <div class="mb-4">
                    <h5 class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">产出</h5>
                    <table class="min-w-full text-sm">
                        <thead>
                            <tr class="bg-gray-50 dark:bg-gray-700">
                                <th class="border px-2 py-1 text-left" style="min-width: 45px;">产品</th>
                                <th class="border px-2 py-1 text-center">日产</th>
                                <th class="border px-2 py-1 text-center">挂</th>
                                <th class="border px-2 py-1 text-center">总挂</th>
                                <th class="border px-2 py-1 text-center">填</th>
                                <th class="border px-2 py-1 text-center">总填</th>
                            </tr>
                        </thead>
                        <tbody>${productHtml}</tbody>
                        <tfoot class="bg-gray-50 dark:bg-gray-700 font-medium">
                            <tr>
                                <td class="border px-2 py-1 text-left" style="min-width: 45px;">总计</td>
                                <td class="border px-2 py-1 text-center">-</td>
                                <td class="border px-2 py-1 text-center">-</td>
                                <td class="border px-2 py-1 text-center">${formatLargeNumber(totalProductSell)}</td>
                                <td class="border px-2 py-1 text-center">-</td>
                                <td class="border px-2 py-1 text-center">${formatLargeNumber(totalProductBuy)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <!-- 利润计算部分 -->
                <div class="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h5 class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">每日利润分析</h5>
                    <div class="grid grid-cols-2 gap-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">挂填：</span>
                            <span class="${profit1 >= 0 ? 'text-green-600' : 'text-red-600'}">
                                ${profit1 >= 0 ? '+' : ''}${formatLargeNumber(profit1)}
                            </span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">填挂：</span>
                            <span class="${profit2 >= 0 ? 'text-green-600' : 'text-red-600'}">
                                ${profit2 >= 0 ? '+' : ''}${formatLargeNumber(profit2)}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="p-2 bg-gray-50 rounded-lg">
                    到
                    <input type="number" id="levelUpInput" value="100" min="0" max="102" step="1" style="width: 40px;">
                    级还需做
                    <span id="levelUpTimesSpan">0 次[0 天]</span>
                </div>
            </div>
        `;

        // 6. 插入到指定位置
        borderElement.insertAdjacentHTML('afterend', displayHtml);

        document.getElementById('isCatDaily').addEventListener('change', function () {
            catDaily = this.checked;
            GM_setValue('catDaily', catDaily);
            document.getElementById("daily-stats-table").remove()
            addDailyTable(dialog);
        });

        document.querySelectorAll('.item-refresh-btn.text-sm').forEach(btn => {
            btn.addEventListener('click', async function () {
                sendGetItemPriceMessage(this.dataset.itemname)
                wsRespondMsgStatus.wait = true
                const res = await waitTaskListCallback()
                if (res) {
                    setTimeout(() => {
                        document.getElementById("daily-stats-table").remove()
                        createDisplayHtml(dialog, borderElement, costTime, dailyConsume, dailyOutput)
                    }, 200)
                }
            });
        });


        const levelUpTimesSpan = document.getElementById('levelUpTimesSpan')
        levelUpTimesSpan.innerText = ` 0 次[0 天]`

        const expPerLabel = findElementByText(dialog, '提升:', 'span');
        if (expPerLabel) {
            //flex flex-wrap gap-2 ml-10 w-full
            const expLabel = expPerLabel.parentNode.children[1]
            const expLabelInnerText = expLabel.innerText.trim();
            if (expLabelInnerText && expLabelInnerText.includes('经验')) {
                const expLabelInfos = expLabelInnerText.replace(' ', '').split(':');
                const expName = removeEmoji(expLabelInfos[0]);
                const exp = parseInt(expLabelInfos[1].replace('经验', ''), 0);
                const levelUpInput = document.getElementById('levelUpInput')
                const expInfo = expInfoMap[skillEnCn[expName] || '']
                if (expInfo) {

                    // 技能升级提示
                    levelUpInput.dataset.expName = expName;
                    levelUpInput.dataset.exp = exp;
                    levelUpInput.value = expInfo.level
                    levelUpInput.addEventListener('change', function () {
                        const value = this.value
                        const level = expInfo.level
                        if (value < 0 || value > levelExp.length) {
                            this.value = level
                            return
                        }

                        let totalNeedExp = levelExp[String(level + 1)] - expInfo.currentExp
                        for (let i = level + 2; i <= value; i++) {
                            totalNeedExp += parseInt(levelExp[String(i)])
                        }
                        const doTimes = totalNeedExp / exp
                        levelUpTimesSpan.innerText = ` ${doTimes.toFixed(2)} 次[${formatSeconds(doTimes * costTime)}]`
                    });
                }

            }

        }

    }


    async function sleep(time) {
        await new Promise(resolve => setTimeout(resolve, time));
    }

    function removeEmoji(text) {
        if (!text) return '';
        // 更全面的emoji匹配正则，包括变体选择器
        const emojiRegex = /(?:[\u2700-\u27BF]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff]|[\uFE00-\uFE0F])/g;
        try {
            return text.replace(emojiRegex, '');
        } catch (error) {
            console.error('妙妙工具 移除 emoji 失败:', error);
            return '';
        }
    }

    let expQueueLock;
    let resQueueLock;

    // 物品价格 物品:价格
    function monitorMarketMessage(data) {
        const event = data?.event
        if (debugLogs) {
            console.log('receive:', event, data.data)
        }
        //console.log('socket.io:', event,data.data)

        if (event === "battle:giveExpReward:success") {
            if (!expQueueLock) expQueueLock = new MethodQueueLock();
            expQueueLock.acquire(addBattleExpInfo, data.data)
        } else if (event === "inventoryModify") {
            if (!resQueueLock) resQueueLock = new MethodQueueLock();
            resQueueLock.acquire(addBattleResInfo, data.data)
        } else if (event === "battle:fullInfo:success") {
            updateBattleUserNameInfo(data.data)
        } else if (event === "inventoryUpdated") {
            warehouseItemsCount = data.data.data
        } else if (event === "battle:useBattleItem:success") {
            updateBattleItemUsedInfo(data.data.data)
        }

        //其他功能
        if (!socketIoMode) return
        if (event === "newMarket:getUnifiedTransactionList:success") {
            updateMarketPrices(data.data.data)
        }
        else if (showUserLevel && event.includes("dispatchCharacterStatusInfo")) {
            const userExpInfo = data.data?.data
            menusAddUserExpInfo(userExpInfo)
            userInfoPageAddUserExpInfo(userExpInfo)
        } else if (event.includes("dispatchTaskQueueToClient")) {
            tryUpdateSatietyShow(data.data?.data)
        }
    }

    window.monitorMarketMessage = monitorMarketMessage

    let updateMarketPricesing = false;

    function updateMarketPrices(marketList) {
        if (updateMarketPricesing) return;
        updateMarketPricesing = true;
        const marketItem = { itemId: "", sellOrders: { minPrice: 0 }, buyOrders: { maxPrice: 0 } }

        for (let marketListElement of marketList) {
            if (!marketItem.itemId) {
                marketItem.itemId = marketListElement.sellResourceId ? marketListElement.sellResourceId : marketListElement.requireResourceId
                if (!marketItem.itemId) {
                    continue;
                }
            }

            if (marketListElement.costResourceId === "gold" && marketListElement.type === "sell") {
                if (marketItem.itemId === marketListElement.sellResourceId && (marketItem.sellOrders.minPrice === 0 || marketItem.sellOrders.minPrice > marketListElement.costPerUnit)) {
                    //卖
                    marketItem.sellOrders = {
                        minPrice: marketListElement.costPerUnit,
                        minPriceCount: marketListElement.sellResourceCount - marketListElement.selledResourceCount
                    }
                }
            } else if (marketListElement.payResourceId === "gold" && marketListElement.type === "buy") {
                if (marketItem.itemId === marketListElement.requireResourceId && (marketItem.buyOrders.maxPrice === 0 || marketItem.buyOrders.maxPrice < marketListElement.payPerUnit)) {
                    //买
                    marketItem.buyOrders = {
                        maxPrice: marketListElement.payPerUnit,
                        maxPriceCount: marketListElement.requireResourceCount - marketListElement.doneResourceCount
                    }
                }
            }
        }
        if (marketItem.itemId) {
            marketPrices[marketItem.itemId] = marketItem
            GM_setValue("marketPrices", marketPrices)
            console.log('[妙妙工具] 获取市场价格完成', marketItem.itemId, marketItem.sellOrders, marketItem.buyOrders)
        }

        updateMarketPricesing = false;
    }


    // 菜单栏 添加经验信息============================================================
    //升级经验
    const levelExp = { '1': '0', '2': '20', '3': '45', '4': '80', '5': '125', '6': '180', '7': '245', '8': '320', '9': '405', '10': '500', '11': '605', '12': '720', '13': '845', '14': '980', '15': '1125', '16': '1280', '17': '1445', '18': '1620', '19': '1805', '20': '2000', '21': '2205', '22': '2420', '23': '2645', '24': '2880', '25': '3125', '26': '3380', '27': '3645', '28': '3920', '29': '4205', '30': '4500', '31': '4805', '32': '5760', '33': '6825', '34': '8000', '35': '9285', '36': '10680', '37': '12185', '38': '13800', '39': '15525', '40': '17360', '41': '19305', '42': '21360', '43': '23525', '44': '25800', '45': '28185', '46': '30680', '47': '33285', '48': '36000', '49': '38825', '50': '41760', '51': '44805', '52': '52869', '53': '62386', '54': '73616', '55': '86866', '56': '102502', '57': '120953', '58': '142725', '59': '168415', '60': '198730', '61': '234502', '62': '276712', '63': '326520', '64': '385294', '65': '454647', '66': '536483', '67': '633050', '68': '747000', '69': '881460', '70': '1040122', '71': '1227344', '72': '1448267', '73': '1708955', '74': '2016566', '75': '2379549', '76': '2807867', '77': '3313284', '78': '3909675', '79': '4613416', '80': '5443831', '81': '6423721', '82': '7579991', '83': '8944389', '84': '10554379', '85': '12454168', '86': '14695918', '87': '17341183', '88': '20462597', '89': '24145864', '90': '28492120', '91': '33620701', '92': '39672428', '93': '46813465', '94': '55239888', '95': '65183068', '96': '76916021', '97': '90760905', '98': '107097867', '99': '126375484', '100': '149123071', '101': '175965224', '102': '202360007', '103': '232714008', '104': '267621110', '105': '307764276', '106': '353928918', '107': '407018256', '108': '468070994', '109': '538281643', '110': '619023890', '111': '711877473', '112': '818659094', '113': '941457958', '114': '1082676652', '115': '1245078150', '116': '1431839873', '117': '1646615854', '118': '1893608232', '119': '2177649467', '120': '2504296887', '121': '2879941420', '122': '3311932633', '123': '3808722528', '124': '4380030907', '125': '5037035543', '126': '5792590875', '127': '6661479506', '128': '7660701432', '129': '8809806647', '130': '10131277644', '131': '11650969291', '132': '13049085606', '133': '14614975878', '134': '16368772984', '135': '18333025742', '136': '20532988831', '137': '22996947491', '138': '25756581190', '139': '28847370932', '140': '32309055444', '141': '36186142098', '142': '40528479150', '143': '45391896648', '144': '50838924245', '145': '56939595155', '146': '63772346574', '147': '71425028162', '148': '79996031542', '149': '89595555327', '150': '100347021966', '151': '112388664602' }
    const levelTotalExp = { 1: 0, 2: 20, 3: 65, 4: 145, 5: 270, 6: 450, 7: 695, 8: 1015, 9: 1420, 10: 1920, 11: 2525, 12: 3245, 13: 4090, 14: 5070, 15: 6195, 16: 7475, 17: 8920, 18: 10540, 19: 12345, 20: 14345, 21: 16550, 22: 18970, 23: 21615, 24: 24495, 25: 27620, 26: 31000, 27: 34645, 28: 38565, 29: 42770, 30: 47270, 31: 52075, 32: 57835, 33: 64660, 34: 72660, 35: 81945, 36: 92625, 37: 104810, 38: 118610, 39: 134135, 40: 151495, 41: 170800, 42: 192160, 43: 215685, 44: 241485, 45: 269670, 46: 300350, 47: 333635, 48: 369635, 49: 408460, 50: 450220, 51: 495025, 52: 547894, 53: 610280, 54: 683896, 55: 770762, 56: 873264, 57: 994217, 58: 1136942, 59: 1305357, 60: 1504087, 61: 1738589, 62: 2015301, 63: 2341821, 64: 2727115, 65: 3181762, 66: 3718245, 67: 4351295, 68: 5098295, 69: 5979755, 70: 7019877, 71: 8247221, 72: 9695488, 73: 11404443, 74: 13421009, 75: 15800558, 76: 18608425, 77: 21921709, 78: 25831384, 79: 30444800, 80: 35888631, 81: 42312352, 82: 49892343, 83: 58836732, 84: 69391111, 85: 81845279, 86: 96541197, 87: 113882380, 88: 134344977, 89: 158490841, 90: 186982961, 91: 220603662, 92: 260276090, 93: 307089555, 94: 362329443, 95: 427512511, 96: 504428532, 97: 595189437, 98: 702287304, 99: 828662788, 100: 977785859, 101: 1153751083, 102: 1180145866, 103: 1412859874, 104: 1680480984, 105: 1988245260, 106: 2342174178, 107: 2749192434, 108: 3217263428, 109: 3755545071, 110: 4374568961, 111: 5086446434, 112: 5905105528, 113: 6846563486, 114: 7929240138, 115: 9174318288, 116: 10606158161, 117: 12252774015, 118: 14146382247, 119: 16324031714, 120: 18828328601, 121: 21708270021, 122: 25020202654, 123: 28828925182, 124: 33208956089, 125: 38245991632, 126: 44038582507, 127: 50700062013, 128: 58360763445, 129: 67170570092, 130: 77301847736, 131: 88952817027, 132: 102001902633, 133: 116616878511, 134: 132985651495, 135: 151318677237, 136: 171851666068, 137: 194848613559, 138: 220605194749, 139: 249452565681, 140: 281761621125, 141: 317947763223, 142: 358476242373, 143: 403868139021, 144: 454707063266, 145: 511646658421, 146: 575419004995, 147: 646844033157, 148: 726840064699, 149: 816435620026, 150: 916782641992, 151: 1029171306594 }
    const menusEnCn = { "市场": "trading", "强化": "enhance", "战斗": "battle", "采集": 'collecting', "钓鱼": 'fishing', '养殖': 'farmingAnimal', '挖掘': 'mining', "烹饪": 'cooking', "制造": 'manufacturing', '锻造': 'forging', '缝制': 'sewing', '炼金': 'mysterious', '探索': 'exploring' }
    const skillEnCn = { "攻击": "attacking", "战斗": "battle", "采集": "collecting", "烹饪": "cooking", "防御": "defencing", "敏捷": "dexterity", "强化": "enhance", "探索": "exploring", "畜牧": "farmingAnimal", "种植": "farmingPlant", "钓鱼": "fishing", "锻造": "forging", "智力": "intelligence", "学识": "knowledge", "幸运": "luck", "制造": "manufacturing", "挖掘": "mining", "神秘": "mysterious", "缝纫": "sewing", "耐力": "stamina", "力量": "strength", "交易": "trading" }

    let expInfoMap;
    let menusAddUserExpInfoing = false;
    function menusAddUserExpInfo(userExpInfo) {
        if (menusAddUserExpInfoing) return;
        menusAddUserExpInfoing = true;
        expInfoMap = userExpInfo
        // 尝试通过特定类名查找
        const menubars = document.querySelectorAll('.el-menu-item.cute-menu-item');
        for (let menubar of menubars) {
            const menubarText = (menubar.querySelector('.menu-text')?.innerText || '').trim();
            const menuName = menusEnCn[menubarText]
            if (menuName) {
                const menuExp = userExpInfo[menuName]
                if (!menuExp) continue
                //往左移动
                menubar.style.paddingLeft = '8px'

                // 3. 创建等级标签并插入到图标左侧
                const id = `${menuName}-level`
                let levelBadge = document.getElementById(id)
                if (!levelBadge) {
                    levelBadge = document.createElement('span');
                    levelBadge.id = `${menuName}-level`

                    // 调整等级标签样式（减小宽度和内边距）
                    levelBadge.className = 'inline-block mr-0 px-0 py-0.5 text-xs rounded-sm';
                    levelBadge.style.minWidth = '2.3em'; // 强制最小宽度为两个字符
                    levelBadge.style.textAlign = 'center'; // 文本居中
                    // 找到图标元素并插入等级标签
                    const iconElement = menubar.querySelector('.el-icon.menu-icon');
                    if (iconElement) {
                        iconElement.parentNode.appendChild(levelBadge);
                    }
                }
                levelBadge.textContent = menuExp?.level || 0;

                // 4. 创建进度条容器并插入到按钮底部
                const progressId = `${menuName}-progress`
                let progressContainer = document.getElementById(progressId)
                if (!progressContainer) {
                    progressContainer = document.createElement('div');
                    progressContainer.id = `${menuName}-progress`;
                    progressContainer.className = 'absolute bottom-0 left-10% right-10% h-0.5 bg-gray-300 dark:bg-gray-600';
                    //'absolute bottom-0 left-10% right-10% h-0.5 bg-gray-300 dark:bg-gray-600';
                    progressContainer.style.width = '75%';
                    menubar.appendChild(progressContainer);
                }

                // 7. 进度条背景
                const progressBgId = `${menuName}-progress-bg`
                let progressBg = document.getElementById(progressBgId)
                if (!progressBg) {
                    progressBg = document.createElement('div');
                    progressBg.id = progressBgId;
                    progressBg.className = 'w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden';
                    progressContainer.appendChild(progressBg);
                }

                // 8. 进度条填充部分
                const progressFillId = `${menuName}-progress-fill`
                let progressFill = document.getElementById(progressFillId)
                if (!progressFill) {
                    progressFill = document.createElement('div');
                    progressFill.id = progressFillId;
                    progressFill.className = 'h-full bg-blue-400 transition-all duration-300';
                    progressBg.appendChild(progressFill);
                }

                const progressPercent = ((menuExp.currentExp || 0) / (levelExp[menuExp.level + 1] || 99999999)) * 100;
                progressFill.style.width = `${Math.min(100, progressPercent)}%`;

                // 7. 调整菜单项样式，为进度条腾出空间
                // menubar.style.paddingBottom = '8px';
                // menubar.style.position = 'relative';
            }
        }
        menusAddUserExpInfoing = false;
    }

    let startExpInfoMap;
    let startExpInfoTime = Date.now();
    let tryUserInfoPageAddUserExpInfo = 0;
    let userInfoPageAddUserExpInfoing = false;
    // 人物信息页面添加
    function userInfoPageAddUserExpInfo(userExpInfo) {
        if (userInfoPageAddUserExpInfoing) return;
        userInfoPageAddUserExpInfoing = true;
        if (!startExpInfoMap) {
            startExpInfoMap = userExpInfo;
        }
        //校验是否在页面
        const characterStatusInfoPanels = document.querySelectorAll('.character-status-info.flex.flex-col.gap-4 > .grid.grid-cols-2.md\\:grid-cols-2.gap-2')
        if (characterStatusInfoPanels.length <= 0) {
            tryUserInfoPageAddUserExpInfo++;
            userInfoPageAddUserExpInfoing = false;
            if (tryUserInfoPageAddUserExpInfo < 10) {
                setTimeout(() => {
                    userInfoPageAddUserExpInfo(userExpInfo)
                }, 500);
            } else {
                tryUserInfoPageAddUserExpInfo = 0;
            }
            return;
        };

        try {
            characterStatusInfoPanels.forEach(characterStatusInfoPanel => {
                characterStatusInfoPanel.children.forEach(item => {
                    const nameDiv = item.querySelector('.name.font-bold')
                    if (!nameDiv) return;
                    const cnName = nameDiv.innerText
                    const enName = skillEnCn[cnName]
                    const expInfo = userExpInfo[enName]
                    const setrtExpInfo = startExpInfoMap[enName]
                    if (expInfo && setrtExpInfo) {
                        const expIncrease = expInfo.currentExp + (levelTotalExp[expInfo.level] || 0) - setrtExpInfo.currentExp - (levelTotalExp[setrtExpInfo.level] || 0)
                        const expPerHour = battleInfoCalcPerHour(expIncrease, startExpInfoTime)
                        const span = item.querySelector('.exp-per-hour')
                        if (span) {
                            span.textContent = `(${formatLargeNumber(expPerHour)}/h)`
                        } else {
                            // exp text-xs text-gray-400
                            item.querySelector('.exp.text-xs.text-gray-400').insertAdjacentHTML('afterend', `<span class="text-sm text-gray-400 exp-per-hour">(${formatLargeNumber(expPerHour)}/h)</span>`)
                        }
                        // 升级时间 text-xs text-gray-400 ml-0 md:ml-auto
                        const upNeedExpSpan = item.querySelector('.text-xs.text-gray-400.ml-0')
                        if (upNeedExpSpan) {
                            let timeText = ''
                            if (expInfo.currentExp - setrtExpInfo.currentExp <= 0) {
                                timeText = '--'
                            } else {
                                const upNeedExpText = upNeedExpSpan.innerText || ''
                                // 正则表达式：匹配"升级所需: "后面的数字
                                const regex = /(?<=升级所需: )\d+/;
                                // 执行匹配
                                const result = upNeedExpText.match(regex) || [0];
                                const upNeedExp = parseInt(result[0], 0)
                                const perSecond = battleInfoCalcPerSecond(expIncrease, startExpInfoTime)
                                const upNeedSecond = upNeedExp / perSecond
                                timeText = formatSecondToTime(upNeedSecond)
                            }

                            const span = item.querySelector('.up-need-second')
                            if (span) {
                                span.textContent = ` (${timeText})`
                            } else {
                                upNeedExpSpan.insertAdjacentHTML('afterend', `<span class="text-xs text-gray-400 up-need-second"> (${timeText})</span>`)
                            }
                        }
                    }
                })
            })
        } catch (error) {
            console.log(error)
        } finally {
            userInfoPageAddUserExpInfoing = false;
            tryUserInfoPageAddUserExpInfo = 0;
        }



    }


    /**
     * 将大数字格式化为人性化显示（k/m/b）
     * @param {number} num - 要格式化的数字
     * @param {number} [decimalPlaces=1] - 保留的小数位数
     * @returns {string} 格式化后的字符串（如 "100.0k", "100.0m", "100.0b"）
     */
    function formatLargeNumber(num, decimalPlaces = 1) {

        if (typeof num !== 'number') {
            try {
                num = parseInt(num, 0)
            } catch (error) {
                return 0.0;
            }
        }
        // 处理非数字或0的情况
        if (isNaN(num) || num === 0 || num === 0.0) return '0';

        // 定义单位和对应的量级
        const units = [
            { unit: 'b', value: 1e9 },   // 十亿
            { unit: 'm', value: 1e6 },   // 百万
            { unit: 'k', value: 1e3 }    // 千
        ];

        // 遍历单位找到合适的量级
        for (const { unit, value } of units) {
            if (Math.abs(num) >= value) {
                // 计算数值并保留指定小数位数
                const formattedNum = (num / value).toFixed(decimalPlaces);
                return `${formattedNum}${unit}`;
            }
        }

        // 小于1k的数字直接返回（可根据需要添加整数处理）
        try {
            return num.toFixed(decimalPlaces);
        } catch (error) {
            console.log('[妙妙工具] 序列化大数字异常', num, error)
            return 0.0;
        }
    }

    /**
     * 将带单位的数值字符串转换为实际数值
     * @param {string} valueStr - 带单位的数值字符串，如 "32.0K"、"1.5M"
     * @returns {number} - 转换后的实际数值
     */
    function parseUnitValue(valueStr) {
        // 定义单位映射表（k: 千, m: 百万, b: 十亿, 以此类推）
        const unitMap = {
            'b': 1e9,    // 10^9
            'm': 1e6,    // 10^6
            'k': 1e3,    // 10^3
            '': 1        // 无单位，基数为1
        };

        // 正则表达式：匹配数字部分和单位部分
        const regex = /^(\d+(?:\.\d+)?)\s*([bkm]?)$/i;
        const match = valueStr.trim().match(regex);

        if (!match) {
            return 0;
        }

        // 提取数字和单位
        const number = parseFloat(match[1]);
        const unit = match[2].toLowerCase();

        // 转换为实际数值
        return number * unitMap[unit];
    }


    function dailyNodeObserver() {
        // 1. 日利节点
        // 选择要观察的目标节点（这里选择body）
        const targetNode = document.body;
        // 创建观察器实例
        const observer = new MutationObserver(mutationsList => {
            // 检查body是否有目标class
            if (document.body.classList.contains('el-popup-parent--hidden')) {
                // 查找可见的el-overlay元素
                const visibleOverlay = document.querySelector('div.el-overlay:not([style*="display: none"])');

                if (visibleOverlay && visibleOverlay.parentElement === document.body) {
                    // 在这里执行你需要的操作
                    addDailyTable(visibleOverlay)
                }
            }

        });
        // 配置观察选项
        const config = {
            attributes: true,         // 监听属性变化
            attributeFilter: ['class'], // 只监听class属性
            childList: true,          // 监听子节点变化
            subtree: false             // 不监听所有后代节点
        };

        // 开始观察
        observer.observe(targetNode, config);
    }

    // 日利完成 开始仓库相关=======================================================================================================

    let showSellPrice = true;

    let showItemPriceCopy = showItemPrice

    // 仓库内容配置
    const warehouseConfig = {
        // 左侧菜单中“仓库”选项的选择器
        warehouseMenuSelector: '.el-menu-item:has(.iconify.i-material-symbols\\:warehouse-outline-rounded)',
        // 内容容器（仓库页面内容的父容器）
        contentWrapper: '.content-wrapper',
        // 仓库内容面板（仓库页面的核心容器）
        warehousePane: '#pane-full',
        // 物品卡片基础类
        itemCard: '.item-card.relative',
        // 物品名称选择器（用于获取物品名称）
        itemNameSelector: '.absolute.text-center.left-0.-bottom-5.5.text-xs'
    };

    // 仓库内容状态管理：避免重复监听和处理
    let warehouseState = {
        isInWarehouse: false,       // 是否在仓库页面
        menuObserver: null,         // 监听仓库菜单点击的观察者
        itemObserver: null,         // 监听物品卡片的观察者
        itemHoverObserver: null     // 监听物品卡片悬停的观察者
    };

    /**
     * 第一步：监听仓库菜单点击，启动仓库监听逻辑
     */
    function watchWarehouseEntry() {
        // 查找仓库菜单元素
        const warehouseMenu = document.querySelector(warehouseConfig.warehouseMenuSelector);
        if (warehouseMenu) {
            // 直接监听菜单点击事件
            warehouseMenu.addEventListener('click', onWarehouseEnter);
        } else {
            setTimeout(watchWarehouseEntry, 1000);
        }

        //面板折叠 iconify i-material-symbols:expand-content-rounded
        const collapseMenu = document.querySelector('.iconify.i-material-symbols\\:collapse-content-rounded');
        if (collapseMenu) {
            collapseMenu.parentNode.parentNode.addEventListener('click', function () {
                stopWarehouseListening()
                setTimeout(watchWarehouseEntry, 1000);
            });
        }

        const expandMenu = document.querySelector('.iconify.i-material-symbols\\:expand-content-rounded');
        if (expandMenu) {
            expandMenu.parentNode.parentNode.addEventListener('click', function () {
                stopWarehouseListening()
                setTimeout(watchWarehouseEntry, 1000);
            });
        }

    }

    /**
     * 进入仓库页面后执行的逻辑
     */
    function onWarehouseEnter() {
        if (warehouseState.isInWarehouse) {
            return;
        }
        warehouseState.isInWarehouse = true;

        // 等待仓库内容加载（给页面渲染留时间）
        setTimeout(() => {
            // 监听是否离开仓库页面
            watchWarehouseExit();
            try {
                startWarehouseContentListener();
            } catch (e) {
                console.error('物品价格渲染失败', e);
            }
            try {
                itemHoverNodeObserver();
            } catch (e) {
                console.error('物品hover渲染失败', e);
            }
        }, 100);
    }

    /**
     * 第二步：监听仓库内容容器，等待仓库面板出现
     */
    function startWarehouseContentListener() {
        const contentWrapper = document.querySelector(warehouseConfig.contentWrapper);
        if (!contentWrapper) {
            console.error('未找到仓库内容容器');
            return;
        }
        const warehousePane = document.querySelector(warehouseConfig.warehousePane)
        // 初始扫描已存在的物品卡片
        scanAndProcessItems(warehousePane);

        // 启动物品卡片监听（监听新增和刷新）
        //watchWarehouseItems(warehousePane);
    }

    /**
     * 第三步：监听仓库面板内的物品卡片变化
     * @param {HTMLElement} warehousePane - 仓库面板元素
     */
    function watchWarehouseItems(warehousePane) {
        warehouseState.itemObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                // 处理新增物品卡片
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            // 新增节点本身是物品卡片
                            if (node.matches(warehouseConfig.itemCard)) {
                                processItemCard(node);
                            }
                            // 新增节点的后代中包含物品卡片
                            node.querySelectorAll(warehouseConfig.itemCard).forEach(processItemCard);
                        }
                    });
                }
            });
        });

        // 只监听仓库面板内的必要变化
        warehouseState.itemObserver.observe(warehousePane.querySelector('.flex.flex-wrap.gap-x-6.gap-8.pb-8'), {
            childList: true,
            subtree: true, // 监听后代（物品卡片在面板内部）
            attributes: true,
            attributeFilter: ['class'], // 只关注影响显示的属性
            attributeOldValue: false
        });

    }

    /**
     * 扫描并处理容器内所有未处理的物品卡片
     * @param {HTMLElement} container - 容器元素
     */
    function scanAndProcessItems(container) {
        //container.querySelectorAll(warehouseConfig.itemCard).forEach(processItemCard);

        //计算总价
        warehouseTotalPrice()
    }

    let warehouseTotalPriceUpdate = false;

    function warehouseTotalPrice() {
        if (warehouseTotalPriceUpdate) return;
        warehouseTotalPriceUpdate = true;
        let sellTotal = 0
        let buyTotal = 0
        for (const [name, count] of Object.entries(warehouseItemsCount)) {
            const marketPrice = marketPrices[name] || { sellOrders: { minPrice: 0 }, buyOrders: { maxPrice: 0 } };
            sellTotal += count.count * marketPrice.sellOrders.minPrice
            buyTotal += count.count * marketPrice.buyOrders.maxPrice
        }
        const sellTotalStr = formatLargeNumber(sellTotal)
        const buyTotalStr = formatLargeNumber(buyTotal)
        // 定位输入框容器
        const inputContainer = document.querySelector('.el-input.w-full.md\\:w-20');
        if (!inputContainer) return;

        // 缩短输入框宽度
        inputContainer.style.width = '45%'; // 可根据需要调整

        // 创建"总资产"显示区域
        const assetsContainerId = 'assets-container';
        let assetsContainer = document.getElementById(assetsContainerId)
        if (!assetsContainer) {
            assetsContainer = document.createElement('div');
            assetsContainer.className = 'ml-2 flex items-center justify-center px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-md cursor-help relative';
            assetsContainer.innerHTML = `
                <span class="text-sm font-medium">总资产: 0/0</span>
                <button class="el-button el-button--mini ml-2" style="padding: 2px 8px; font-size: 12px;">挂价</button>
                <button class="el-button el-button--mini ml-1" style="padding: 2px 8px; font-size: 12px;">填价</button>
            `;
            assetsContainer.id = 'assets-container'
            // 调整总资产容器样式阻止换行+灵活占宽
            assetsContainer.style.cssText += `white-space: nowrap;  flex: 1; min-width: 0; `;

            // 添加到页面
            inputContainer.parentNode.appendChild(assetsContainer);
            // 绑定按钮点击事件
            const priceButton = assetsContainer.querySelector('button:first-of-type');
            const fillButton = assetsContainer.querySelector('button:last-of-type');
            if (!showItemPriceCopy) showSellPrice = null;
            priceButton.addEventListener('click', () => {
                if (showSellPrice === null || showSellPrice === false) {
                    showSellPrice = true;
                    showItemPriceCopy = true;
                    document.querySelector(warehouseConfig.warehousePane).querySelectorAll(warehouseConfig.itemCard).forEach(processItemCard);
                    addTypeTotalPrice();
                    //sort
                    document.getElementById('pane-full').querySelectorAll('.flex.flex-col.gap-2.w-full > .flex.flex-wrap.gap-x-6.gap-8').forEach(sortGroupedChildDivs)
                }

            });

            fillButton.addEventListener('click', () => {
                if (showSellPrice === null || showSellPrice === true) {
                    showSellPrice = false;
                    showItemPriceCopy = true;
                    document.querySelector(warehouseConfig.warehousePane).querySelectorAll(warehouseConfig.itemCard).forEach(processItemCard);
                    addTypeTotalPrice();
                    //sort
                    document.getElementById('pane-full').querySelectorAll('.flex.flex-col.gap-2.w-full > .flex.flex-wrap.gap-x-6.gap-8').forEach(sortGroupedChildDivs)
                }
            });
        }
        assetsContainer.querySelector('.text-sm.font-medium').innerText = `总资产: ${sellTotalStr}/${buyTotalStr}`;
        warehouseTotalPriceUpdate = false;
    }

    function addTypeTotalPrice() {
        const itemCardPrices = document.querySelectorAll('.item-card-price')
        const typePriceMap = {}
        itemCardPrices.forEach(itemCardPrice => {
            const priceinfo = itemCardPrice.dataset.price
            const name = itemCardPrice.dataset.name
            const type = itemCardPrice.dataset.type
            if (!priceinfo) {
                return
            }
            const prices = priceinfo.split('/')
            const sell = parseInt(prices[0], 0)
            const buy = parseInt(prices[1], 0)

            //大类计价
            let typePrice = typePriceMap[type]
            if (!typePrice) {
                typePrice = { sell: 0, buy: 0 }
                typePriceMap[type] = typePrice
            }
            typePrice.sell += sell
            typePrice.buy += buy
        });

        document.querySelectorAll('.w-full.font-bold.text-lg').forEach(cardTitle => {
            const title = cardTitle.innerText.trim()
            const typePrice = typePriceMap[title]
            if (typePrice) {
                // 创建要添加的小字元素
                let smallText = document.getElementById('type-Price-' + title)
                if (!smallText) {
                    smallText = document.createElement('div');
                    smallText.id = 'type-Price-' + title
                    smallText.style.cssText = `
                                    display: inline-block;
                                    font-size: 0.7em;
                                    font-weight: normal;
                                    color: #666;
                                    vertical-align: middle;
                                `;
                    // 获取目标元素的父容器（用于插入同级元素）
                    cardTitle.parentNode.insertBefore(smallText, cardTitle.nextSibling);
                }
                smallText.textContent = `${formatLargeNumber(typePrice.sell)}/${formatLargeNumber(typePrice.buy)}`;
            }
        });
    }

    /**
     * 对父div的第一级子节点按两两一组排序
     * @param {boolean} isAsc 是否升序（默认true）
     */
    function sortGroupedChildDivs(parent) {

        const isAsc = false;
        const targetClass = 'item-card-price'
        // 获取第一级子节点（只包含直接子元素，且过滤非div节点）
        const children = Array.from(parent.children).filter(el => el.tagName === 'DIV');

        // 检查子节点数量是否为双数
        if (children.length % 2 !== 0) {
            console.warn('子节点数量不是双数，无法按两两分组');
            return;
        }

        // 2. 按两两一组分组（[0,1]、[2,3]、[4,5]...）
        const groups = [];
        for (let i = 0; i < children.length; i += 2) {
            const group = [
                children[i],       // 组内第一个节点
                children[i + 1]    // 组内第二个节点
            ];
            groups.push(group);
        }

        // 3. 为每组提取排序关键字（组内任一节点中目标class的文本）
        groups.forEach(group => {
            // 在组内两个节点中查找带目标class的元素
            let sortText = 0;
            group.some(node => {
                const targetEl = node.querySelector(`.${targetClass}`);
                if (targetEl) {
                    const pricesText = targetEl.dataset.price.trim(); // 提取文本作为排序依据
                    pricesText.split('/')
                    sortText = parseInt(pricesText.split('/')[showSellPrice ? 0 : 1]);
                    return true; // 找到后停止查找
                }
                return false;
            });
            group.sortText = sortText; // 存储排序关键字
        });

        // 4. 按组的排序关键字排序（支持数字/文本排序）
        groups.sort((a, b) => {
            const textA = a.sortText;
            const textB = b.sortText;

            // 优先按数字排序（如果是数字）
            if (!isNaN(Number(textA)) && !isNaN(Number(textB))) {
                return isAsc ? Number(textA) - Number(textB) : Number(textB) - Number(textA);
            }

            // 文本按字母顺序排序
            return -1;
        });


        // 关键修改：不销毁节点，仅移动位置（保留事件和绑定）
        // 1. 先将所有节点临时移到文档片段（避免频繁DOM重绘）
        const fragment = document.createDocumentFragment();
        groups.forEach(group => {
            fragment.appendChild(group[0]); // 移动组内第一个节点
            fragment.appendChild(group[1]); // 移动组内第二个节点
        });

        // 2. 将文档片段一次性插入父容器（高效且保留节点）
        parent.appendChild(fragment);

    }


    function processItemCard(itemCard) {
        //跳过金币
        const itemNum = parseUnitValue(itemCard.children[1].innerText)
        const itemCnName = itemCard.children[2].innerText.trim()
        let itemEnName = cn_en[itemCnName]
        if (!itemEnName) {
            console.log(`未找到 ${itemCnName} 的英文名称`)
            return
        }
        const itemPrice = marketPrices[itemEnName] || { sellOrders: { minPrice: 0 }, buyOrders: { maxPrice: 0 } };
        //获取类型标签
        let typeNode;
        if (itemCard.parentNode.classList && itemCard.parentNode.classList.length > 0) {
            typeNode = itemCard.parentNode.parentNode.children[0]
        } else {
            typeNode = itemCard.parentNode.parentNode.parentNode.children[0]
        }

        let type = ''
        if (typeNode) {
            type = typeNode.innerText.trim()
        }
        // 创建新的数字元素
        let id = 'item-card-' + type + "-" + itemCnName
        let numberElement = document.getElementById(id)
        if (!numberElement) {
            numberElement = document.createElement('div');
            numberElement.id = id
            // 将新元素添加到卡片中
            itemCard.appendChild(numberElement);
            // 设置与现有数字相同的样式类
            numberElement.className = 'flex justify-start items-start text-sm text-yellow-600 dark:text-cyan-600 absolute w-16 h-16 left-1 top-1 break-all text-left drop-shadow-sm item-card-price';

        }
        // 设置文本内容
        const sellTotal = itemNum * itemPrice.sellOrders.minPrice || 0;
        const buyTotal = itemNum * itemPrice.buyOrders.maxPrice || 0;
        numberElement.textContent = showSellPrice ? formatLargeNumber(sellTotal) : formatLargeNumber(buyTotal);
        numberElement.dataset.price = sellTotal + "/" + buyTotal
        numberElement.dataset.name = itemCnName
        numberElement.dataset.type = type
        numberElement.style.display = showItemPriceCopy ? "block" : 'none'
    }


    function itemHoverNodeObserver() {
        let targetNode = null;

        // 物品hover节点
        document.querySelectorAll('[id^="el-popper-container-"]').forEach(element => {
            if (/^el-popper-container-\d+$/.test(element.id)) {
                targetNode = element;
                return;
            }
        });
        if (!targetNode) {
            console.log('未找到匹配的hover元素');
        }

        // 创建观察器实例，只监听 targetNode 内部的变化
        warehouseState.itemHoverObserver = new MutationObserver(mutationsList => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            addPriceInfo(node);
                        }
                    });
                }
            }
        });

        // 配置观察选项
        const config = {
            childList: true,        // 监听子节点添加/移除
            attributes: false,       // 监听属性变化
            subtree: false,
            //attributeFilter: ['style'], // 只监听class属性
        };
        // 开始观察
        warehouseState.itemHoverObserver.observe(targetNode, config);

    }

    // 在指定节点下查找目标div并添加价格信息
    function addPriceInfo(parentNode) {
        // 查找目标div元素
        const targetDiv = parentNode.querySelector('div.el-divider.el-divider--horizontal.my-2\\!');

        if (targetDiv) {
            const text = parentNode.querySelectorAll('.font-bold.text-base')[0].innerText.trim()
            // 创建价格信息元素
            const id = 'price-info-' + text;
            let priceDiv = document.getElementById(id)
            if (!priceDiv) {
                //oldInfo.remove()
                priceDiv = document.createElement('div');
                // 设置样式类（使用Tailwind CSS类）
                priceDiv.className = 'text-sm text-gray-600 dark:text-gray-400 mb-2';
                priceDiv.id = id;
                // 将价格元素插入到目标div之后
                targetDiv.parentNode.insertBefore(priceDiv, targetDiv.nextSibling);
            }

            // 设置文本内容
            const itemNum = parseUnitValue(getPreviousSiblingText(text))
            const itemPrice = marketPrices[cn_en[text]] || { sellOrders: { minPrice: 0 }, buyOrders: { maxPrice: 0 } };
            const totalSell = itemNum * itemPrice.sellOrders.minPrice
            priceDiv.textContent = `价格：${formatLargeNumber(itemPrice.sellOrders.minPrice)}/${formatLargeNumber(itemPrice.buyOrders.maxPrice)} (${formatLargeNumber(totalSell, 1)}/${formatLargeNumber(itemNum * itemPrice.buyOrders.maxPrice, 1)})`;
        }
    }

    // 函数：获取指定文本的div的上一个同级div的文本
    function getPreviousSiblingText(targetText) {

        // 1. 查找页面中所有符合样式的div
        const allDivs = document.querySelectorAll(
            'div[class*="absolute"][class*="text-center"][class*="left-0"][class*="-bottom-5.5"][class*="text-xs"][class*="w-16"][class*="text-gray-600"][class*="dark:text-gray-200"]'
        );
        // 2. 遍历div，找到文本内容匹配的目标元素
        let targetDiv = null;
        for (const div of allDivs) {
            if (div.textContent.trim() === targetText) {
                targetDiv = div;
                break; // 找到第一个匹配的即可
            }
        }

        if (!targetDiv) {
            console.log(`未找到文本为"${targetText}"的div元素`);
            return 0;
        }

        const prevDiv = getPrevDivNode(targetDiv)

        if (!prevDiv) {
            console.log(`目标div没有同级上一个div元素`);
            return 0;
        }

        // 4. 返回上一个div的文本内容
        const prevText = prevDiv.textContent.trim();

        return prevText;
    }

    // 同级上一个div
    function getPrevDivNode(node) {
        // 3. 获取上一个同级div元素（只找div类型的同级元素）
        let prevDiv = node.previousElementSibling;
        // 循环查找上一个同级，直到找到div或无同级元素
        while (prevDiv && prevDiv.tagName !== 'DIV') {
            prevDiv = prevDiv.previousElementSibling;
        }

        return prevDiv;
    }
    /**
     * 监听是否离开仓库页面（停止所有监听）
     */
    function watchWarehouseExit() {
        // 监听仓库菜单是否失去激活状态（离开仓库时）
        warehouseState.menuObserver = new MutationObserver(() => {
            const warehouseMenu = document.querySelector(warehouseConfig.warehouseMenuSelector);
            // 仓库菜单不再激活，视为离开仓库
            if (warehouseMenu && !warehouseMenu.classList.contains('is-active')) {
                stopWarehouseListening();
            } else if (!warehouseMenu) {
                stopWarehouseListening();
            }
        });

        // 监听菜单的类名变化（检测激活状态）
        const menuContainer = document.querySelector('.el-menu');
        if (menuContainer) {
            warehouseState.menuObserver.observe(menuContainer, {
                childList: false,
                subtree: true,
                attributes: true,
                attributeFilter: ['class']
            });
        }
    }

    /**
     * 离开仓库页面时，停止所有监听并清理状态
     */
    function stopWarehouseListening() {
        if (!warehouseState.isInWarehouse) return;
        warehouseState.isInWarehouse = false;
        showItemPriceCopy = showItemPrice;
        // 断开所有观察者
        if (warehouseState.menuObserver) warehouseState.menuObserver.disconnect();
        if (warehouseState.itemObserver) warehouseState.itemObserver.disconnect();
        if (warehouseState.itemHoverObserver) warehouseState.itemHoverObserver.disconnect();

    }

    // 仓库相关结束 ====================================================================================================
    // 聊天图片=========================================================================================================


    function createPicUpdateUI() {
        // 添加样式
        GM_addStyle(`
            .moyu-upload-container {
                bottom: 20px;
                right: 20px;
                cursor: move;
            }
            .moyu-upload-btn {
                background-color: #4CAF50;
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            .moyu-upload-btn:hover {
                background-color: #45a049;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            .moyu-upload-panel {
                display: none;
                position: fixed;
                z-index: 99999;
                bottom: 80px;
                right: 0;
                width: 320px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                padding: 15px;
                cursor: default;
            }
            .moyu-upload-panel.show {
                display: block;
                animation: fadeIn 0.3s;
            }
            .moyu-paste-hint {
                margin-bottom: 15px;
                font-size: 14px;
                color: #555;
                text-align: center;
                padding: 10px;
                background: #f8f9fa;
                border-radius: 5px;
            }
            .moyu-preview-container {
                position: relative;
                margin: 10px 0;
                display: none;
            }
            .moyu-preview {
                max-width: 100%;
                max-height: 200px;
                display: block;
                margin: 0 auto;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .moyu-result {
                margin-top: 15px;
                padding: 12px;
                background: #f8f9fa;
                border-radius: 5px;
                word-break: break-all;
                font-size: 13px;
                display: none;
                border: 1px solid #e0e0e0;
            }
            .moyu-copy-btn {
                background-color: #2196F3;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 12px;
                font-size: 13px;
                width: 100%;
                transition: all 0.2s;
            }
            .moyu-copy-btn:hover {
                background-color: #0b7dda;
                transform: translateY(-1px);
            }
            .moyu-status {
                margin: 12px 0;
                font-size: 13px;
                color: #666;
                text-align: center;
                min-height: 20px;
            }
            .moyu-close-btn {
                position: absolute;
                top: 8px;
                right: 8px;
                background: #f44336;
                color: white;
                border: none;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                font-size: 14px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            .moyu-close-btn:hover {
                opacity: 1;
            }
            .moyu-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #eee;
            }
            .moyu-title {
                font-weight: bold;
                color: #333;
            }
            .moyu-drag-handle {
                width: 100%;
                height: 30px;
                position: absolute;
                top: 0;
                left: 0;
                cursor: move;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .moyu-progress {
                width: 100%;
                height: 4px;
                background: #e0e0e0;
                border-radius: 2px;
                margin: 10px 0;
                overflow: hidden;
                display: none;
            }
            .moyu-progress-bar {
                height: 100%;
                background: #4CAF50;
                width: 0%;
                transition: width 0.3s;
            }
        `);
        // 创建UI元素
        const container = document.createElement('div');
        container.className = 'moyu-upload-container';

        const uploadBtn = document.createElement('button');
        uploadBtn.className = 'moyu-upload-btn';
        uploadBtn.textContent = '截图上传';

        const panel = document.createElement('div');
        panel.className = 'moyu-upload-panel';

        const header = document.createElement('div');
        header.className = 'moyu-header';
        const title = document.createElement('div');
        title.className = 'moyu-title';
        title.textContent = '截图上传助手';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'moyu-close-btn';
        closeBtn.innerHTML = '×';
        closeBtn.title = '关闭';

        const pasteHint = document.createElement('div');
        pasteHint.className = 'moyu-paste-hint';
        pasteHint.textContent = '截图后按 Ctrl+V 粘贴图片';

        const previewContainer = document.createElement('div');
        previewContainer.className = 'moyu-preview-container';
        const preview = document.createElement('img');
        preview.className = 'moyu-preview';

        const progress = document.createElement('div');
        progress.className = 'moyu-progress';
        const progressBar = document.createElement('div');
        progressBar.className = 'moyu-progress-bar';
        progress.appendChild(progressBar);

        const status = document.createElement('div');
        status.className = 'moyu-status';

        const result = document.createElement('div');
        result.className = 'moyu-result';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'moyu-copy-btn';
        copyBtn.textContent = '复制图片链接';

        // 组装UI
        header.appendChild(title);
        header.appendChild(closeBtn);
        panel.appendChild(header);
        panel.appendChild(pasteHint);
        previewContainer.appendChild(preview);
        panel.appendChild(previewContainer);
        panel.appendChild(progress);
        panel.appendChild(status);
        panel.appendChild(result);
        panel.appendChild(copyBtn);
        container.appendChild(uploadBtn);
        container.appendChild(panel);

        // 事件处理
        uploadBtn.addEventListener('click', () => {
            panel.classList.toggle('show');
            if (panel.classList.contains('show')) {
                panel.focus();
                result.textContent = '';
                result.style.display = 'none';
                status.textContent = '';
                preview.src = '';
                previewContainer.style.display = 'none';
            }
        });

        closeBtn.addEventListener('click', () => {
            panel.classList.remove('show');
        });

        copyBtn.addEventListener('click', () => {
            if (result.textContent) {
                GM_setClipboard(result.textContent);
                //showNotification('复制成功', '图片链接已复制到剪贴板');
            }
        });

        // 粘贴事件处理
        panel.addEventListener('paste', async (e) => {
            panel.classList.add('show');

            const items = e.clipboardData.items;
            let imageFound = false;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    imageFound = true;
                    const blob = items[i].getAsFile();

                    // 显示预览
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        preview.src = e.target.result;
                        previewContainer.style.display = 'block';
                    };
                    reader.readAsDataURL(blob);

                    status.textContent = '正在上传截图...';
                    result.style.display = 'none';
                    progress.style.display = 'block';
                    progressBar.style.width = '30%';

                    try {
                        const formData = new FormData();
                        formData.append('image', blob);
                        formData.append('outputFormat', 'auto');

                        const xhr = new XMLHttpRequest();
                        xhr.open('POST', 'https://img.scdn.io/api/v1.php', true);

                        xhr.upload.onprogress = (e) => {
                            if (e.lengthComputable) {
                                const percent = Math.round((e.loaded / e.total) * 100);
                                progressBar.style.width = percent + '%';
                            }
                        };

                        xhr.onload = () => {
                            if (xhr.status === 200) {
                                const data = JSON.parse(xhr.responseText);
                                if (data.success) {
                                    const imgUrl = `[${data.url}]`;
                                    result.textContent = imgUrl;
                                    result.style.display = 'block';
                                    status.textContent = '上传成功！';
                                    progressBar.style.width = '100%';
                                    setTimeout(() => {
                                        progress.style.display = 'none';
                                    }, 500);
                                } else {
                                    status.textContent = '上传失败: ' + (data.message || '未知错误');
                                    progress.style.display = 'none';
                                }
                            } else {
                                status.textContent = '上传出错: 服务器返回状态 ' + xhr.status;
                                progress.style.display = 'none';
                            }
                        };

                        xhr.onerror = () => {
                            status.textContent = '上传出错: 网络错误';
                            progress.style.display = 'none';
                        };

                        xhr.send(formData);

                    } catch (error) {
                        console.error('上传错误:', error);
                        status.textContent = '上传出错: ' + error.message;
                        progress.style.display = 'none';
                    }
                    break;
                }
            }

            if (!imageFound) {
                status.textContent = '剪贴板中没有找到图片';
                setTimeout(() => {
                    status.textContent = '';
                }, 2000);
            }
        });

        // 使面板可聚焦
        panel.tabIndex = -1;

        // // 显示通知
        // function showNotification(title, text) {
        //     GM_notification({
        //         title: title,
        //         text: text,
        //         timeout: 2000,
        //         silent: true
        //     });
        // }

        return container
    }

    function chatPicTool() {
        const chatBtn = document.querySelector('.cute-chat-button.fixed\\!.z-50.bottom-6.right-6.md\\:bottom-8.md\\:right-8')
        if (!chatBtn) {
            setTimeout(() => {
                chatPicTool()
            }, 500);
            return
        }
        chatBtn.addEventListener('click', function () {
            setTimeout(() => {
                const chatInput = document.querySelector('.el-input.el-input--large.flex-1')
                let picUpdateContainer = document.getElementById('picUpdateContainer')
                if (chatInput && !picUpdateContainer && !chatInput.dataset?.processed) {
                    chatInput.dataset.processed = true
                    picUpdateContainer = createPicUpdateUI()
                    picUpdateContainer.id = 'picUpdateContainer'
                    chatInput.parentNode.appendChild(picUpdateContainer, chatInput.nextSibling);
                }
            }, 500);
        });
    }

    function satietyShowTool() {
        const mainBar = document.querySelector('.el-icon.menu-icon')
        if (!mainBar) {
            setTimeout(() => {
                satietyShowTool()
            }, 500);
            return
        }
        mainBar.parentNode.addEventListener('click', function () {
            tryUpdateSatietyShowCount = 0
            setTimeout(updateSatietyShow, 500);
        });
        tryUpdateSatietyShowCount = 0
        setTimeout(updateSatietyShow, 500);
    }

    let tryUpdateSatietyShowCount = 0

    function tryUpdateSatietyShow(data) {
        tryUpdateSatietyShowCount = 0
        setTimeout(() => updateSatietyShow(data), 500);
    }

    let tryUpdateSatietyShowing = false
    function updateSatietyShow(data) {
        if (tryUpdateSatietyShowing) {
            return
        }
        tryUpdateSatietyShowing = true
        tryUpdateSatietyShowCount++
        const userTaskCadrsNode = document.querySelector('.bg-gradient-to-br.from-white')
        if (!userTaskCadrsNode) {
            if (tryUpdateSatietyShowCount < 10) {
                setTimeout(() => updateSatietyShow(data), 500);
            }
            tryUpdateSatietyShowing = false
            return
        }
        const totalSatietyCount = warehouseItemsCount['__satiety']
        if (totalSatietyCount === undefined || totalSatietyCount === null) {
            if (tryUpdateSatietyShowCount < 10) {
                setTimeout(() => updateSatietyShow(data), 500);
            }
            tryUpdateSatietyShowing = false
            return
        }
        let totalSatiety = totalSatietyCount.count

        const taskCards = userTaskCadrsNode.querySelectorAll('.group.relative.overflow-hidden.rounded-lg.border.transition-all.duration-300')
        let firstUseOut = true
        let lastEndTime = new Date().toLocaleString()
        for (let i = 0; i < taskCards.length; i++) {
            const taskCard = taskCards[i];

            const taskInfo = data[i] || { actionId: "", createTime: 0, currentRepeat: 0, hasDeductFirstTaskResource: false, lastSubtaskDoneTime: 0, pastTimeAboutLastSubtask: 0, repeatCount: 0 }
            const satietyShow = taskCard.querySelector('.flex.items-center.space-x-2.text-xs.text-gray-500');
            const satietyNode = satietyShow.childNodes[0]
            const satiety = parseInt(removeEmoji(satietyNode.textContent?.trim()), 0)

            //剩余饱食
            const remaining = totalSatiety
            totalSatiety -= satiety
            const useOut = totalSatiety <= 0
            const appendDiv = document.getElementById('totalSatiety-' + i)
            let originaltime;
            if (appendDiv) {
                originaltime = appendDiv.dataset.originaltime
                appendDiv.remove()
            } else {
                originaltime = satietyShow.childNodes[1].innerText
            }
            satietyNode.insertAdjacentHTML('afterend', `<span id='totalSatiety-${i}' data-originaltime="${originaltime}" class="text-xs text-gray-500 ${useOut ? 'text-red-400' : ''} ">(剩余 ${totalSatiety})</span>`)

            if (useOut) {
                if (firstUseOut) {
                    firstUseOut = false
                    satietyShow.childNodes[2].innerText = calculateAdjustedTime(originaltime, lastEndTime, remaining / satiety)
                } else {
                    satietyShow.childNodes[2].innerText = '-----------------------'
                }
            }
            //结束时间
            lastEndTime = originaltime
        }
        tryUpdateSatietyShowCount = 0
        tryUpdateSatietyShowing = false
    }
    /**
     * 计算两个时间差值%并加到初始时间上
     * @param {string} time1 - 带⏰的结束时间字符串
     * @param {string} time2 - 带⏰的开始时间字符串
     * @returns {string} 计算后的时间字符串（带⏰）
     */
    function calculateAdjustedTime(time1, time2, percentage) {
        try {
            // 解析时间字符串为Date对象
            const date1 = new Date(removeEmoji(time1));
            const date2 = new Date(removeEmoji(time2));
            // 计算时间差（毫秒）并转换为秒
            const timeDiffMs = date1 - date2;
            const timeDiffSeconds = timeDiffMs / 1000;

            // 计算差值
            const adjustmentSeconds = timeDiffSeconds * percentage;

            // 计算调整后的时间（毫秒）
            const adjustedTimeMs = date2.getTime() + adjustmentSeconds * 1000;

            // 格式化结果为指定字符串格式
            const adjustedDate = new Date(adjustedTimeMs);
            const year = adjustedDate.getFullYear();
            const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
            const day = String(adjustedDate.getDate()).padStart(2, '0');
            const hours = String(adjustedDate.getHours()).padStart(2, '0');
            const minutes = String(adjustedDate.getMinutes()).padStart(2, '0');
            const seconds = String(adjustedDate.getSeconds()).padStart(2, '0');
            return `⏰ ${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
        } catch (error) {
            console.error('时间计算出错:', error);
            return '';
        }
    }


    function calculateTime(startTime, endTime) {
        if (!startTime || !endTime) {
            return '';
        }
        // 确保输入是Date对象，如果是时间戳则转换
        const start = startTime instanceof Date ? startTime : new Date(startTime);
        const end = endTime instanceof Date ? endTime : new Date(endTime);

        // 计算时间差（毫秒），取绝对值确保结果为正
        const diffMs = Math.abs(end - start);

        // 转换为各时间单位
        const totalSeconds = Math.floor(diffMs / 1000);
        return formatSecondToTime(totalSeconds);
    }

    function formatSecondToTime(totalSeconds) {
        const seconds = (totalSeconds % 60).toFixed(2);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const minutes = totalMinutes % 60;
        const totalHours = Math.floor(totalMinutes / 60);
        const hours = totalHours % 24;
        const days = Math.floor(totalHours / 24);

        // 收集非零的时间部分
        const parts = [];
        if (days > 0) parts.push(`${days}天`);
        if (hours > 0) parts.push(`${hours}时`);
        if (minutes > 0) parts.push(`${minutes}分`);
        if (seconds > 0) parts.push(`${seconds}秒`);

        // 处理所有单位都为零的情况
        return parts.length > 0 ? parts.join('') : '0秒';
    }

    // 战斗页面 ============================================================================
    // 战斗内容配置
    const battleInfoConfig = {
        // 左侧菜单中“战斗”选项的选择器
        menuSelector: '.el-menu-item:has(.iconify.i-game-icons\\:crossed-swords)',
        // 内容容器（战斗页面内容的父容器）
        contentWrapper: '.content-wrapper',
        collapseSelector: '.el-menu-item:has(.iconify.i-material-symbols\\:collapse-content-rounded)',
        expandSelector: '.el-menu-item:has(.iconify.i-material-symbols\\:expand-content-rounded)'
    };

    // 战斗内容状态管理：避免重复监听和处理
    let battleInfoState = {
        isInPage: false,       // 是否在战斗页面
        menuObserver: null         // 监听战斗菜单点击的观察者
    };

    /**
     * 第一步：监听菜单点击，启动监听逻辑
     */
    function battlePageEntry() {
        // 查找战斗菜单元素
        const menuBar = document.querySelector(battleInfoConfig.menuSelector);
        if (menuBar) {
            // 直接监听菜单点击事件
            menuBar.addEventListener('click', onBattlePageEnter);
        } else {
            setTimeout(battlePageEntry, 1000);
        }

        //面板折叠 iconify i-material-symbols:expand-content-rounded
        const collapseMenu = document.querySelector(battleInfoConfig.collapseSelector);
        if (collapseMenu) {
            collapseMenu.addEventListener('click', function () {
                stopBattlePageListening()
                setTimeout(battlePageEntry, 1000);
            });
        }

        const expandMenu = document.querySelector(battleInfoConfig.expandSelector);
        if (expandMenu) {
            expandMenu.addEventListener('click', function () {
                stopBattlePageListening()
                setTimeout(battlePageEntry, 1000);
            });
        }

    }

    /**
     * 进入页面后执行的逻辑
     */
    function onBattlePageEnter() {
        if (battleInfoState.isInPage) {
            return;
        }
        battleInfoState.isInPage = true;

        // 等待内容加载（给页面渲染留时间）
        setTimeout(() => {
            // 监听是否离开页面
            watchBattlePageExit();
            try {
                startShowBattleInfo();
            } catch (e) {
                console.error('妙妙工具 渲染失败', e);
            }
        }, 1000);
    }

    /**
     * 第二步：监听内容容器，等待面板出现
     */
    function startShowBattleInfo() {
        const contentWrapper = document.querySelector(battleInfoConfig.contentWrapper);
        if (!contentWrapper) {
            return;
        }

        //判断是否在战斗动画页面
        const battleTab = document.getElementById('tab-battle')
        if (!battleTab) {
            return
        }
        if (battleTab.classList.contains('is-active')) {
            //在战斗页面
            showBattleInfo()
        } else {
            //不在战斗页面
            if (battleTab.dataset?.showbattleinfo) return
            battleTab.dataset.showbattleinfo = true
            battleTab.addEventListener('click', function () {
                //在战斗页面
                setTimeout(showBattleInfo, 1000)
            })
        }
    }

    // 全局样式（使用GM_addStyle确保隔离）
    GM_addStyle(`
        /* 布局基础类 */
        .battle-info-mb-2 { margin-bottom: 0.5rem !important; }
        .battle-info-mr-2 { margin-right: 0.5rem !important; }
        .battle-info-mt-3 { margin-top: 0.75rem !important; }
        .battle-info-p-3 { padding: 0.75rem !important; }
        .battle-info-flex { display: flex !important; }
        .battle-info-grid { display: grid !important; }
        .battle-info-grid-cols-2 { grid-template-columns: repeat(3, 1fr) !important; }
        .battle-info-gap-2 { gap: 0.5rem !important; }

        /* 样式类 */
        .battle-info-border { border: 1px solid #e5e7eb !important; }
        .battle-info-rounded-md { border-radius: 0.375rem !important; }
        .battle-info-bg-white { background-color: #fff !important; }
        .battle-info-text-primary { color: #409eff !important; }
        .battle-info-hidden { display: none !important; }

        /* 玩家选择器样式 */
        .battle-info-player-selector { display: flex; gap: 8px; padding: 8px 0; flex-wrap: wrap; margin-bottom: 10px; }

        /* 基础按钮样式 - 浅色模式默认 */
        .battle-info-player-btn {
            padding: 4px 12px !important;
            cursor: pointer !important;
            border-radius: 4px !important;
            border: 1px solid #dcdfe6 !important;
            background: #fff !important;
            color: #303133 !important; /* 浅色模式文字色 */
            transition: all 0.2s ease !important; /* 平滑过渡效果 */
        }

        /*  hover状态 - 浅色模式 */
        .battle-info-player-btn:hover {
            background: #f5f7fa !important;
            border-color: #c0c4cc !important;
        }

        /* 激活状态 - 浅色模式 */
        .battle-info-player-btn.active {
            background: #409eff !important;
            color: #fff !important;
            border-color: #409eff !important;
        }

        /* 夜间模式基础样式 */
        .dark .battle-info-player-btn {
            background: #303133 !important; /* 深色背景 */
            border-color: #4e4e4e !important; /* 深色边框 */
            color: #e5e6eb !important; /* 深色模式文字色 */
        }

        /* 夜间模式hover状态 */
        .dark .battle-info-player-btn:hover {
            background: #4e4e4e !important;
            border-color: #666 !important;
        }

        /* 夜间模式激活状态 */
        .dark .battle-info-player-btn.active {
            background: #409eff !important; /* 保持主色调一致性 */
            color: #fff !important; /* 激活状态文字始终为白色 */
            border-color: #69b1ff !important; /* 亮一点的边框 */
        }
        /* 物品容器基础样式 */
        .battle-info-items-used-container,
        .battle-info-items-container {
            display: flex !important;
            flex-wrap: wrap !important;
            margin: 0 -5px !important;
            padding: 5px 0 !important;
        }
        .battle-info-item {
            flex: 0 0 16% !important;
            max-width: 16% !important;
            box-sizing: border-box !important;
            padding: 0 8px !important;
            margin-bottom: 8px !important;
            font-size: 12px !important;
            display: flex !important;
            align-items: center !important; /* 垂直居中 */
            white-space: nowrap !important;
            overflow: hidden !important;
        }

        /* 物品名称部分 - 占50%宽度，居左 */
        .battle-info-item-name {
            width: 50% !important; /* 占父容器50% */
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            margin-right: 5px !important; /* 与右侧保持间距 */
            text-align: left !important;
        }

        /* 数量价格部分 - 占50%宽度，居左 */
        .battle-info-item-meta {
            width: 50% !important; /* 占父容器50% */
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            text-align: left !important; /* 改为居左对齐 */
        }

        /* 保持夜间模式适配 */
        .battle-info-item {
            color: #666 !important;
        }
        .dark .battle-info-item {
            color: #bbb !important;
        }

        /* 无物品提示的特殊样式 */
        .battle-info-items-empty {
            flex: 0 0 100% !important; /* 占满整行 */
            font-style: italic !important; /* 区分普通物品项 */
        }
        /* 基础红色文本样式，提高优先级 */
        .battle-info-item.text-red-600 {
            color: #dc2626 !important; /* 红色 */
        }

        /* 夜间模式下的红色文本（更亮一些，确保可见） */
        .dark .battle-info-item.text-red-600 {
            color: #f87171 !important;
        }

        /* 确保覆盖其他颜色样式 */
        .battle-info-item.text-red-600.battle-info-item-name,
        .battle-info-item.text-red-600.battle-info-item-meta {
            color: inherit !important; /* 继承父元素的红色 */
        }
        /* 响应式调整 */
        @media (max-width: 768px) {
            .battle-info-item {
                flex: 0 0 50% !important; /* 小屏幕每行5个 */
                max-width: 50% !important;
            }
        }
    `);

    let tryShowBattleInfo = 0
    function showBattleInfo() {
        tryShowBattleInfo++;
        const battlePane = document.getElementById('pane-battle')
        if (!battlePane) return
        const cardBody = battlePane.querySelector('.el-card.is-always-shadow.mb-4 > .el-card__body')
        if (!cardBody || cardBody.children.length < 1) {
            if (tryShowBattleInfo < 10) {
                setTimeout(() => {
                    showBattleInfo()
                }, 500)
            }
            return
        }
        const thisBo = cardBody?.children[0]
        if (!thisBo) return
        let thisBoText = thisBo.innerText?.trim() || ''
        if (!thisBoText.includes('当前波次：')) return;
        thisBoText = thisBoText.replace('当前波次：', '')
        const thisBoNum = parseInt(thisBoText)
        if (thisBoNum < 1) return;
        if (!battleUserMap || Object.keys(battleUserMap).length < 1) {
            if (tryShowBattleInfo < 10) {
                setTimeout(() => {
                    showBattleInfo()
                }, 500)
            }
            return
        }

        const miaomiaobattleshow = document.getElementById('miaomiao-battle-show')
        if (!miaomiaobattleshow) {
            // 战斗统计面板HTML（Element UI风格）
            const selectedPlayer = (battleUserMap[battleCountInfo.selectedPlayerUuid ? battleCountInfo.selectedPlayerUuid : battleCountInfo.uuid]) || new BattleUserInfo('', '')

            // 面板HTML结构
            const battleInfoHtml = `
                <div id="miaomiao-battle-show">
                    <!-- 玩家选择区 -->
                    <div class="battle-info-player-selector"></div>

                    <div class="battle-info-mb-2 text-gray-600 dark:text-gray-300 text-base">
                        <span>统计波次：</span>
                        <span class="battle-info-wave-count">${battleCountInfo.count} (${battleInfoCalcPerHour(battleCountInfo.count, battleCountInfo.start)}/h)</span>
                    </div>
                    <div class="battle-info-mb-2 text-gray-600 dark:text-gray-300 text-base">
                        <span>统计时间长：</span>
                        <span class="battle-info-time-count">${calculateTime(new Date(), battleCountInfo.start)}${battleCountInfo.count} (前30波: ${calculateTime(battleCountInfo.lastEne30Time, battleCountInfo.lastStart30Time)})</span>
                    </div>
                    <div class="battle-info-mb-2 text-gray-600 dark:text-gray-300 text-base">
                        <span>战利品价值：</span>
                        <span class="battle-info-item-sell">0.0</span>/<span class="battle-info-item-buy">0.0</span>
                        <span class="text-gray-500 text-sm ml-2">
                            ( <span class="battle-info-sell-rate">0.0</span>/d / <span class="battle-info-buy-rate">0.0</span>/d )
                        </span>
                    </div>
                    <div class="battle-info-mb-2 text-gray-600 dark:text-gray-300 text-base">
                        <span>消耗品价值：</span>
                        <span class="battle-info-item-used-sell">0.0</span>/<span class="battle-info-item-used-buy">0.0</span>
                        <span class="text-gray-500 text-sm ml-2">
                            ( <span class="battle-info-used-sell-rate">0.0</span>/d / <span class="battle-info-used-buy-rate">0.0</span>/d )
                        </span>
                    </div>
                    <div class="battle-info-mb-2 text-gray-600 dark:text-gray-300 text-base">
                        <span>战斗经验：</span>
                        <span class="battle-info-battle-exp">${selectedPlayer.exp.battle}</span>
                        <span class="text-gray-500 text-sm ml-2">
                            ( <span class="battle-info-battle-exp-rate">0.0</span> )
                        </span>
                    </div>

                    <div class="battle-info-flex items-center battle-info-mb-2">
                        <span class="battle-info-mr-2 w-24 text-gray-600 dark:text-gray-300 text-nowrap">详细信息：</span>
                        <div class="battle-info-details-trigger battle-info-text-primary cursor-pointer text-sm" style="text-decoration: underline;">
                            点击查看属性经验及物品
                        </div>
                    </div>

                    <div class="battle-info-details-panel battle-info-hidden battle-info-mt-3 battle-info-p-3 battle-info-border battle-info-rounded-md">
                        <div class="text-gray-700 dark:text-gray-200 font-medium battle-info-mb-2">属性经验详情</div>
                        <div class="battle-info-grid battle-info-grid-cols-2 battle-info-gap-2 text-sm">
                            <div class="text-gray-600 dark:text-gray-300">
                                智力：<span class="battle-info-intelligence-exp">0.0</span>
                                <span class="text-gray-500 ml-1">(<span class="battle-info-intelligence-rate">0.0</span>/h)</span>
                            </div>
                            <div class="text-gray-600 dark:text-gray-300">
                                力量：<span class="battle-info-strength-exp">0.0</span>
                                <span class="text-gray-500 ml-1">(<span class="battle-info-strength-rate">0.0</span>/h)</span>
                            </div>
                            <div class="text-gray-600 dark:text-gray-300">
                                敏捷：<span class="battle-info-dexterity-exp">0.0</span>
                                <span class="text-gray-500 ml-1">(<span class="battle-info-dexterity-rate">0.0</span>/h)</span>
                            </div>
                            <div class="text-gray-600 dark:text-gray-300">
                                攻击：<span class="battle-info-attacking-exp">0.0</span>
                                <span class="text-gray-500 ml-1">(<span class="battle-info-attacking-rate">0.0</span>/h)</span>
                            </div>
                            <div class="text-gray-600 dark:text-gray-300">
                                耐力：<span class="battle-info-stamina-exp">0.0</span>
                                <span class="text-gray-500 ml-1">(<span class="battle-info-stamina-rate">0.0</span>/h)</span>
                            </div>
                            <div class="text-gray-600 dark:text-gray-300">
                                防御：<span class="battle-info-defencing-exp">0.0</span>
                                <span class="text-gray-500 ml-1">(<span class="battle-info-defencing-rate">0.0</span>/h)</span>
                            </div>
                        </div>

                        <div class="text-gray-700 dark:text-gray-200 font-medium battle-info-mt-3 battle-info-mb-2 battle-info-items-used-title">消耗品剩余</div>
                        <div class="battle-info-items-used-container text-sm">
                            <div class="text-gray-600 dark:text-gray-300">暂无物品</div>
                        </div>

                        <div class="text-gray-700 dark:text-gray-200 font-medium battle-info-mt-3 battle-info-mb-2">战利品详情</div>
                        <div class="battle-info-items-container text-sm">
                            <div class="text-gray-600 dark:text-gray-300">暂无物品</div>
                        </div>
                    </div>

                    <div class="battle-info-flex justify-start battle-info-mt-3">
                        <button aria-disabled="false" id="battle-info-refreshbattleInfo" type="button" class="el-button el-button--primary el-button--small battle-info-mr-2">
                            <span>重置统计</span>
                        </button>
                    </div>
                </div>
                `;
            cardBody.children[1].insertAdjacentHTML('afterend', battleInfoHtml);

            // 绑定详情面板切换事件
            document.querySelector('.battle-info-details-trigger').addEventListener('click', () => {
                document.querySelector('.battle-info-details-panel')?.classList.toggle('battle-info-hidden');
            });

            document.getElementById('battle-info-refreshbattleInfo').addEventListener('click', () => {
                initBattleInfo();
                updateBattleInfoDisplay();
            });

            updateBattleInfoPlayerSelector();
        }

        // 初始化显示
        updateBattleInfoDisplay();
        tryShowBattleInfo = 0;
    }

    // 工具函数：计算每小时速率
    function battleInfoCalcPerHour(value, startTime) {
        const hours = (new Date() - startTime) / (1000 * 60 * 60);
        return hours > 0 ? (value / hours).toFixed(1) : "0.0";
    }

    // 工具函数：计算每小时速率
    function battleInfoCalcPerDay(value, startTime) {
        const hours = (new Date() - startTime) / (1000 * 60 * 60 * 24);
        return hours > 0 ? (value / hours).toFixed(1) : "0.0";
    }

    // 工具函数：计算每小时速率
    function battleInfoCalcPerSecond(value, startTime) {
        const second = (new Date() - startTime) / (1000);
        return second > 0 ? (value / second).toFixed(1) : 0;
    }
    // 更新玩家选择器
    function updateBattleInfoPlayerSelector() {
        const selector = document.querySelector('.battle-info-player-selector');
        if (!selector) return;

        selector.innerHTML = '';

        if (Object.keys(battleUserMap).length === 0) {
            selector.innerHTML = '<div class="text-gray-500">未选择玩家</div>';
            return;
        }

        Object.values(battleUserMap).forEach(user => {
            const btn = document.createElement('button');
            btn.className = `battle-info-player-btn ${(battleCountInfo.selectedPlayerUuid || battleCountInfo.uuid) === user.uuid ? 'active' : ''}`;
            btn.textContent = user.name || user.uuid;
            btn.addEventListener('click', () => {
                battleCountInfo.selectedPlayerUuid = user.uuid;
                selector.querySelectorAll('.battle-info-player-btn').forEach(btn => {
                    btn.classList.remove('active')
                    if (btn.textContent === user.name || btn.textContent === user.uuid) {
                        btn.classList.add('active');
                    }
                });

                updateBattleInfoDisplay();
            });
            selector.appendChild(btn);
        });

    }

    // 更新战斗统计UI
    function updateBattleInfoDisplay() {
        if (!battleInfoState.isInPage || !document.getElementById('miaomiao-battle-show')) return;
        const uuid = battleCountInfo.selectedPlayerUuid ? battleCountInfo.selectedPlayerUuid : battleCountInfo.uuid
        // 获取当前数据（全局或选中玩家）
        const currentData = battleUserMap[battleCountInfo.selectedPlayerUuid ? battleCountInfo.selectedPlayerUuid : battleCountInfo.uuid];
        if (!currentData) return;
        // 更新基础信息
        document.querySelector('.battle-info-wave-count').textContent = `${battleCountInfo.count} (${battleInfoCalcPerHour(battleCountInfo.count, battleCountInfo.start)}/h)`;
        document.querySelector('.battle-info-time-count').textContent =
            `${calculateTime(new Date(), battleCountInfo.start)}${battleCountInfo.count} (前30波: ${calculateTime(battleCountInfo.lastEne30Time, battleCountInfo.lastStart30Time)})`;

        // 更新经验信息
        let expPerHour
        if (startExpInfoMap && showRealBattleExp && battleCountInfo.uuid === uuid) {
            const expInfo = expInfoMap['battle']
            const setrtExpInfo = startExpInfoMap['battle']
            if (expInfo && setrtExpInfo) {
                const expIncrease = expInfo.currentExp + (levelTotalExp[expInfo.level] || 0) - setrtExpInfo.currentExp - (levelTotalExp[setrtExpInfo.level] || 0)
                expPerHour = battleInfoCalcPerDay(expIncrease, startExpInfoTime)
            }
        }

        document.querySelector('.battle-info-battle-exp').textContent = currentData.exp.battle;
        document.querySelector('.battle-info-battle-exp-rate').textContent = formatLargeNumber(battleInfoCalcPerDay(currentData.exp.battle, battleCountInfo.start)) + "/d" + (expPerHour ? ` 真实: ${formatLargeNumber(expPerHour)}/d` : '');

        // 更新属性经验详情
        const expKeys = ['intelligence', 'strength', 'dexterity', 'attacking', 'stamina', 'defencing'];
        expKeys.forEach(key => {
            document.querySelector(`.battle-info-${key}-exp`).textContent = currentData.exp[key].toFixed(1);
            document.querySelector(`.battle-info-${key}-rate`).textContent = formatLargeNumber(battleInfoCalcPerHour(currentData.exp[key], battleCountInfo.start));
        });

        // 更新物品详情
        const itemsContainer = document.querySelector('.battle-info-items-container');
        itemsContainer.innerHTML = '';

        const [itemDivs, sellTotal, buyTotal] = itemCountGoldShow(currentData.res.items)
        itemDivs.forEach(div => itemsContainer.appendChild(div));

        // 获取物品总金
        document.querySelector('.battle-info-item-sell').textContent = formatLargeNumber(sellTotal);
        document.querySelector('.battle-info-item-buy').textContent = formatLargeNumber(buyTotal);
        document.querySelector('.battle-info-sell-rate').textContent = formatLargeNumber(battleInfoCalcPerDay(sellTotal, battleCountInfo.start));
        document.querySelector('.battle-info-buy-rate').textContent = formatLargeNumber(battleInfoCalcPerDay(buyTotal, battleCountInfo.start));

        // 更新消耗品 battle-info-items-used-container
        const itemsUsedContainer = document.querySelector('.battle-info-items-used-container');
        itemsUsedContainer.innerHTML = '';

        const [itemUsedDivs, sellTotalUsed, buyTotalUsed] = itemUsedCountGoldShow(currentData.res.itemsUsed)
        itemUsedDivs.forEach(div => itemsUsedContainer.appendChild(div));
        // 获取物品总金
        document.querySelector('.battle-info-item-used-sell').textContent = formatLargeNumber(sellTotalUsed);
        document.querySelector('.battle-info-item-used-buy').textContent = formatLargeNumber(buyTotalUsed);
        document.querySelector('.battle-info-used-sell-rate').textContent = formatLargeNumber(battleInfoCalcPerDay(sellTotalUsed, battleCountInfo.start));
        document.querySelector('.battle-info-used-buy-rate').textContent = formatLargeNumber(battleInfoCalcPerDay(buyTotalUsed, battleCountInfo.start));

    }

    function itemCountGoldShow(items) {
        let sellTotal = 0;
        let buyTotal = 0;
        const itemDivs = [];
        if (Object.keys(items).length === 0) {
            // 无物品提示 - 适配深色模式
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'battle-info-item battle-info-items-empty';
            // 不直接设置颜色，由CSS根据模式自动切换
            emptyDiv.textContent = '暂无物品';
            itemDivs.push(emptyDiv);
        } else {
            // 物品渲染逻辑
            Object.entries(items).forEach(([name, count]) => {
                const div = document.createElement('div');
                div.className = 'battle-info-item';

                // 获取市场价格数据
                const marketPrice = marketPrices[name] || {
                    sellOrders: { minPrice: 0 },
                    buyOrders: { maxPrice: 0 }
                };
                const sellPrice = marketPrice.sellOrders.minPrice;
                const buyPrice = marketPrice.buyOrders.maxPrice;

                div.dataset.sellprice = sellPrice;
                const itemSellPrice = sellPrice * count
                const itemBuyPrice = buyPrice * count
                sellTotal += itemSellPrice;
                buyTotal += itemBuyPrice;
                // 完整信息（用于悬停提示）
                const fullInfo = `${en_cn[name] || name}：${count} (${formatLargeNumber(itemSellPrice)}/${formatLargeNumber(itemBuyPrice)})`;
                div.title = fullInfo;

                // 左侧：物品名称
                const nameSpan = document.createElement('span');
                nameSpan.className = 'battle-info-item-name';
                nameSpan.textContent = en_cn[name] || name;

                // 右侧：数量和价格
                const metaSpan = document.createElement('span');
                metaSpan.className = 'battle-info-item-meta';
                metaSpan.textContent = `${count} (${formatLargeNumber(itemSellPrice)}/${formatLargeNumber(itemBuyPrice)})`;

                // 组合元素
                div.appendChild(nameSpan);
                div.appendChild(metaSpan);
                itemDivs.push(div);
            });
            itemDivs.sort((a, b) => b.dataset.sellprice - a.dataset.sellprice)
        }


        return [itemDivs, sellTotal, buyTotal];

    }


    function itemUsedCountGoldShow(items) {

        let sellTotal = 0;
        let buyTotal = 0;
        const itemDivs = [];
        let minUsedOutTime;
        if (Object.keys(items).length === 0) {
            // 无物品提示 - 适配深色模式
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'battle-info-item battle-info-items-empty';
            // 不直接设置颜色，由CSS根据模式自动切换
            emptyDiv.textContent = '暂无物品';
            itemDivs.push(emptyDiv);
        } else {
            // 物品渲染逻辑
            Object.entries(items).forEach(([name, countInfo]) => {
                const div = document.createElement('div');
                /*
                {
                    startCount: data.remainingCount + 1,
                    remainingCount: data.remainingCount
                }
                */

                const count = countInfo.startCount - countInfo.remainingCount;

                const useOutTime = calculateItemDepletion(countInfo.startCount, countInfo.remainingCount, battleCountInfo.start) || Infinity;
                if (useOutTime && (!minUsedOutTime || minUsedOutTime.time > useOutTime)) {
                    // 未用完 添加时间显示
                    minUsedOutTime = {
                        div: div,
                        time: useOutTime
                    }
                }

                // 获取市场价格数据
                const marketPrice = marketPrices[name] || {
                    sellOrders: { minPrice: 0 },
                    buyOrders: { maxPrice: 0 }
                };
                const sellPrice = marketPrice.sellOrders.minPrice;
                const buyPrice = marketPrice.buyOrders.maxPrice;

                div.dataset.timeout = useOutTime;
                const itemSellPrice = sellPrice * count
                const itemBuyPrice = buyPrice * count
                sellTotal += itemSellPrice;
                buyTotal += itemBuyPrice;
                const usedPerDay = battleInfoCalcPerHour(count, battleCountInfo.start)
                // 完整信息（用于悬停提示）
                const fullInfo = `${en_cn[name] || name}：${countInfo.remainingCount} (${usedPerDay}/h)`;
                div.title = fullInfo;

                // 左侧：物品名称
                const nameSpan = document.createElement('span');
                nameSpan.className = `battle-info-item-name item-used-${name}`;
                nameSpan.textContent = en_cn[name] || name;

                // 右侧：数量和价格
                const metaSpan = document.createElement('span');
                metaSpan.className = `battle-info-item-meta item-used-${name}`;
                metaSpan.textContent = `${countInfo.remainingCount} (${usedPerDay}/h)`;

                // 组合元素
                div.className = `battle-info-item ${useOutTime > itemUsedOutMillisecond ? 'text-gray-500' : 'text-red-600'}`;
                div.appendChild(nameSpan);
                div.appendChild(metaSpan);
                itemDivs.push(div);
            });
            itemDivs.sort((a, b) => a.dataset.timeout - b.dataset.timeout)
        }
        //text-red-600
        const itemUsedTitle = document.querySelector('.battle-info-items-used-title');
        if (minUsedOutTime) {
            if (minUsedOutTime.time) {
                //大于两小时时间用完
                const textColor = minUsedOutTime.time > itemUsedOutMillisecond ? 'text-gray-500' : 'text-red-600';
                itemUsedTitle.innerHTML = `消耗品剩余 <span class="text-sm ${textColor}">剩余时间: ${formatSecondToTime(minUsedOutTime.time / 1000)}</span>`;
            } else {
                itemUsedTitle.innerHTML = `消耗品剩余 <span class="text-sm text-red-600">剩余时间: 0.0秒</span>`;
            }
        } else {
            const itemUsedTitle = document.querySelector('.battle-info-items-used-title');
            itemUsedTitle.innerHTML = `消耗品剩余`;
        }

        return [itemDivs, sellTotal, buyTotal];

    }

    /**
     * 计算单个物品的用完时间
     * @param {number} startCount - 初始数量
     * @param {number} remainingCount - 剩余数量
     * @param {Date} startTime - 开始时间
     * @returns {Object} 包含用完时间及相关信息的对象
     */
    function calculateItemDepletion(startCount, remainingCount, startTime) {
        // 获取当前时间
        const now = new Date();
        // 计算从开始到现在经过的毫秒数
        const elapsedMs = now - startTime;

        // 如果还没有经过时间，无法计算消耗速率
        if (elapsedMs <= 0) {
            return
        }

        // 已使用的数量
        const usedCount = startCount - remainingCount;

        // 如果还没有使用任何物品，无法预测用完时间
        if (usedCount <= 0) {
            return
        }

        // 计算消耗速率（个/毫秒）
        const consumptionRate = usedCount / elapsedMs;

        // 如果消耗速率为0，也无法预测
        if (consumptionRate <= 0) {
            return
        }

        // 计算剩余物品用完所需的毫秒数
        const timeToDepletionMs = remainingCount / consumptionRate;

        // 计算用完的具体时间
        return timeToDepletionMs;
    }
    /**
     * 监听是否离开页面（停止所有监听）
     */
    function watchBattlePageExit() {
        // 监听菜单是否失去激活状态
        battleInfoState.menuObserver = new MutationObserver(() => {
            const menuBar = document.querySelector(battleInfoConfig.menuSelector);
            // 菜单不再激活，视为离开
            if (!menuBar || !menuBar.classList.contains('is-active')) {
                stopBattlePageListening();
            }
        });

        // 监听菜单的类名变化（检测激活状态）
        const menuContainer = document.querySelector('.el-menu');
        if (menuContainer) {
            battleInfoState.menuObserver.observe(menuContainer, {
                childList: false,
                subtree: true,
                attributes: true,
                attributeFilter: ['class']
            });
        }
    }

    /**
     * 离开页面时，停止所有监听并清理状态
     */
    function stopBattlePageListening() {
        if (!battleInfoState.isInPage) return;
        battleInfoState.isInPage = false;

        // 断开所有观察者
        if (battleInfoState.menuObserver) battleInfoState.menuObserver.disconnect();

    }

    // 战斗数据 =================================================================================


    let battleCountInfo = {
        start: new Date(),
        lastStart30Time: null,
        lastEne30Time: null,
        count: 0,
        uuid: '',
        selectedPlayerUuid: '',
    }

    const battleUserMap = {}

    const expEnCn = {
        battle: '战斗',
        intelligence: '智力',
        strength: '力量',
        dexterity: '敏捷',
        attacking: '攻击',
        stamina: '耐力',
        defencing: '防御'
    }

    //4 * 60 * 60 * 1000
    const itemUsedOutMillisecond = 10 * 60 * 60 * 1000;

    function initBattleInfo() {
        battleCountInfo = {
            start: new Date(),
            lastStart30Time: null,
            lastEne30Time: null,
            count: 0,
            uuid: battleCountInfo.uuid,
            selectedPlayerUuid: battleCountInfo.selectedPlayerUuid
        }
        Object.keys(battleUserMap).forEach(k => {
            battleUserMap[k].clearInfo()
        })
        startExpInfoMap = null;
        startExpInfoTime = Date.now();
    }

    function addBattleExpInfo(data) {
        const userUuid = data.user
        if (!userUuid) return
        const expRewardDetail = data.data?.expRewardDetail
        if (!expRewardDetail) return
        //本玩家uuid
        if (!battleCountInfo.uuid) {
            battleCountInfo.uuid = userUuid
        }

        for (const [uuid, info] of Object.entries(battleUserMap)) {
            const userExpRewardDetail = expRewardDetail[uuid]
            if (!userExpRewardDetail) continue
            info.updateExp(userExpRewardDetail)
        }

        battleCountInfo.count++
        if (!battleCountInfo.lastEne30Time) battleCountInfo.lastEne30Time = Date.now()
        if (battleCountInfo.count && battleCountInfo.count % 30 === 0) {
            battleCountInfo.lastStart30Time = battleCountInfo.lastEne30Time
            battleCountInfo.lastEne30Time = Date.now()
        }
        updateBattleInfoDisplay()

        if (showRealBattleExp) {
            try {
                sendGetUserInfoMessage()
            } catch (e) {
                //
            }
        }
    }

    function addBattleResInfo(data) {
        const userUuid = data.user?.uuid
        if (!userUuid) return
        const resourceList = data.data
        if (!resourceList || resourceList.length == 0) return
        //本玩家uuid
        if (!battleCountInfo.uuid) {
            battleCountInfo.uuid = userUuid
        }
        if (battleUserMap[userUuid]) {
            battleUserMap[userUuid].updateRes(resourceList)
        }
    }

    function updateBattleUserNameInfo(data) {
        const battleInfo = data?.data?.battleInfo || null
        if (!battleInfo) return
        if (!battleCountInfo.uuid) {
            battleCountInfo.uuid = data.user
        }
        if (battleInfo.battleStatus !== "BATTLING") return

        const members = battleInfo.members
        if (!members || members.length < 1) return
        // 可以获取装备技能信息
        //所有的玩家信息
        const players = members.filter(member => member.isPlayer)
        //删除不存在的玩家
        const playerUuids = new Set(players.map(player => player.uuid))
        for (const [battleUserUuid, v] of Object.entries(battleUserMap)) {

            if (!playerUuids.has(battleUserUuid)) {
                delete battleUserMap[battleUserUuid]
            }
        }

        // 更新玩家名字信息
        for (const player of players) {
            const uuid = player.uuid
            if (!battleUserMap[uuid]) {
                battleUserMap[uuid] = new BattleUserInfo(player.name, uuid)
            }
            const battleUser = battleUserMap[uuid]
            if (player.name !== battleUser) {
                battleUser.setName(player.name)
            }
        }

    }

    //玩家物品信息
    function updateBattleItemUsedInfo(data) {
        const battleUser = battleUserMap[data.user]
        if (!battleUser) return
        battleUser.updateItemsUsed(data)
    }

    class BattleUserInfo {
        constructor(name, uuid) {
            this.name = name
            this.uuid = uuid
            this.exp = {
                battle: 0, //战斗
                intelligence: 0, //智力
                strength: 0, //力量
                dexterity: 0, //敏捷
                attacking: 0, //攻击
                stamina: 0, //耐力
                defencing: 0 //防御
            }
            this.res = {
                items: {},
                itemsUsed: {}
            }
        }

        setName(name) {
            this.name = name
        }
        updateExp(userExpRewardDetail) {
            if (!userExpRewardDetail) return
            for (const [expListKey, expList] of Object.entries(userExpRewardDetail)) {
                for (const expObj of expList) {
                    const expName = expObj['status']
                    if (!this.exp[expName]) this.exp[expName] = 0
                    try {
                        this.exp[expName] += expObj['increaseExp']
                    } catch (e) {
                        console.error(`妙妙工具 [${this.name ? this.name : this.uuid} ${expEnCn[expName]} ${expName}]经验数据异常 重置经验`, e)
                        this.exp[expName] = 0
                    }

                }
            }
        }
        updateRes(userResourceRewardDetail) {
            if (!userResourceRewardDetail) return
            try {
                for (const [resName, resObj] of Object.entries(userResourceRewardDetail)) {
                    if (!this.res.items[resName]) this.res.items[resName] = 0
                    this.res.items[resName] += resObj.count
                }
            } catch (e) {
                console.error('资源数据异常', e)
                this.res = {
                    items: {},
                    itemsUsed: {}
                }
            }
        }
        updateItemsUsed(data) {
            if (!data || this.uuid !== data.user) return
            if (!this.res.itemsUsed[data.itemId]) {
                this.res.itemsUsed[data.itemId] = {
                    startCount: data.remainingCount + 1,
                    remainingCount: data.remainingCount
                }
            }
            this.res.itemsUsed[data.itemId].remainingCount = data.remainingCount
        }

        // getItemsSellPrice(){
        //     this.res.items
        //     let sum = 0;
        //     for (const [resName, resObj] of Object.entries(this.res.items)) {
        //         const itemPrice = marketPrices[resName] || { sellOrders: { minPrice: 0 }, buyOrders: { maxPrice: 0 } };
        //         sum += (resObj.count * itemPrice.sellOrders.minPrice)
        //     }
        // }
        // getItemsBuyPrice(){

        // }
        clearInfo() {
            this.exp = {
                battle: 0, //战斗
                intelligence: 0, //智力
                strength: 0, //力量
                dexterity: 0, //敏捷
                attacking: 0, //攻击
                stamina: 0, //耐力
                defencing: 0 //防御
            }
            this.res = {
                items: {},
                itemsUsed: {}
            }
        }
    }

    class MethodQueueLock {
        constructor() {
            // 任务队列，存储待执行的任务
            this.queue = [];
            // 标记当前是否有任务正在执行
            this.isProcessing = false;
        }

        /**
         * 获取锁并执行方法
         * @param {Function} fn - 需要执行的方法（可以是异步方法）
         * @param {...any} args - 方法的参数
         * @returns {Promise} - 返回一个Promise， resolve为方法执行结果，reject为错误信息
         */
        acquire(fn, ...args) {
            return new Promise((resolve, reject) => {
                // 将任务添加到队列
                this.queue.push({
                    fn,
                    args,
                    resolve,
                    reject
                });

                // 如果当前没有任务在执行，则开始处理队列
                if (!this.isProcessing) {
                    this.isProcessing = true;
                    this.processQueue();
                }
            });
        }

        /**
         * 处理队列中的任务
         */
        async processQueue() {
            // 如果队列为空，重置状态并返回
            if (this.queue.length === 0) {
                this.isProcessing = false;
                return;
            }

            // 取出队列中的第一个任务
            const { fn, args, resolve, reject } = this.queue.shift();

            try {
                // 执行任务（支持同步和异步方法）
                const result = await fn(...args);
                resolve(result);
            } catch (error) {
                // 捕获执行过程中的错误
                reject(error);
            } finally {
                // 无论成功失败，继续处理下一个任务
                this.processQueue();
            }
        }

        /**
         * 清除队列中未执行的任务
         */
        clearQueue() {
            this.queue = [];
        }

        /**
         * 获取当前队列长度
         * @returns {number} 队列长度
         */
        getQueueLength() {
            return this.queue.length;
        }
    }
    // ===================================================================================

    let userInfoMenuManager
    // 技能书
    function countSkillBooks() {
        if (!userInfoMenuManager) {
            userInfoMenuManager = new MenuManager('.el-menu-item:has(.iconify.i-material-symbols\\:emoji-people-rounded)', onSkillBooksPageEnter)
        }
        userInfoMenuManager.enterMenuPage()
    }

    function onSkillBooksPageEnter() {
        const page = document.querySelector('.content-wrapper')
        if (!page) return
        const skillPageBtn = document.getElementById('tab-inBattle')
        if (!skillPageBtn) return
        skillPageBtn.addEventListener('click', () => {
            setTimeout(() => {
                const skillCards = document.querySelector('.content-wrapper').querySelectorAll('.relative.flex.items-center.skill-card.transition-all.duration-200')
                addSkillBookscount(skillCards)
            }, 100)
        })
    }

    function addSkillBookscount(skillCards) {
        if (!skillCards) return
        for (let i = 0; i < skillCards.length; i++) {
            const skillCard = skillCards[i]
            const levelDiv = skillCard.querySelector('.flex.flex-col.items-start.justify-between.h-full > .w-full.h-full.flex-1')
            if (!levelDiv) return
            levelDiv.querySelector('.skill-books-count')?.remove()
            const skillBooksCountDiv = document.createElement('div')
            skillBooksCountDiv.className = 'skill-books-count mt-1 text-xs text-gray-600'
            const levelStr = levelDiv.querySelector('.mt-1.text-xs.text-gray-600 > .font-bold')?.innerText?.trim() || '0'
            const level = parseInt(levelStr, 0)
            const thisLevelExp = levelDiv.querySelector('.w-full.mt-1 > .text-xs.text-gray-600.mt-1 > .font-mono')?.innerText?.trim() || 0
            const nextLevelTotalExp = levelExp[String(level + 1)] - thisLevelExp
            const booksCount = Math.ceil(nextLevelTotalExp / 50)
            skillBooksCountDiv.innerHTML = `等级：<input id="skill-books-input-${i}" data-index="${i}" type="number" min="0" max="151" step="1" style="width:35px;" value="${level + 1}"> <span id="skill-books-count-${i}" class="text-xs">${booksCount}本</span>`
            levelDiv.appendChild(skillBooksCountDiv)
            const input = document.getElementById(`skill-books-input-${i}`)
            const span = document.getElementById(`skill-books-count-${i}`)

            // 输入完成后（失焦时）执行计算逻辑（适配移动端）
            input.addEventListener('blur', (e) => {
                const input = e.target;
                const toLevel = parseInt(input.value, 10) || level + 1;
                // 基础输入限制：仅允许 大于当前等级+1 且 不超过151 的整数
                if (toLevel <= level + 1 || toLevel > 151 || isNaN(toLevel)) {
                    input.value = level + 1; // 超出范围时重置为最小值
                }
                // 最终验证（防止意外值）
                const validToLevel = Math.max(level + 1, Math.min(151, toLevel));
                input.value = validToLevel; // 确保显示的是合法值

                // 计算所需书籍数量
                const totalExp = levelTotalExp[validToLevel] - levelTotalExp[level] - thisLevelExp;
                const booksCount = Math.ceil(totalExp / 50);
                span.innerText = `${booksCount}本`;
            });
        }
    }

    // ===================================================================================
    // 菜单解析
    class MenuManager {
        constructor(menuSelector, onPageEnter, pageExitFun) {
            this.menuSelector = menuSelector
            this.onPageEnter = onPageEnter
            this.pageExitFun = pageExitFun || function () { }
            this.isInPage = false
            this.collapseSelector = '.el-menu-item:has(.iconify.i-material-symbols\\:collapse-content-rounded)'
            this.expandSelector = '.el-menu-item:has(.iconify.i-material-symbols\\:expand-content-rounded)'
        }

        enterMenuPage() {
            const menuBar = document.querySelector(this.menuSelector);
            if (menuBar) {
                // 直接监听菜单点击事件
                menuBar.addEventListener('click', () => {
                    if (this.isInPage) return
                    this.isInPage = true
                    try {
                        setTimeout(() => {
                            this.watchPageExit()
                            this.onPageEnter()
                        }, 200);
                    } catch (e) {
                        console.error('妙妙工具 进入页面方法失败', menuSelector, e)
                    }

                });
            } else {
                setTimeout(() => this.enterMenuPage(), 1000);
                return
            }

            //面板折叠 iconify i-material-symbols:expand-content-rounded
            const collapseMenu = document.querySelector(this.collapseSelector);
            if (collapseMenu) {
                collapseMenu.addEventListener('click', () => {
                    this.pageExitFun()
                    setTimeout(() => this.enterMenuPage(), 500);
                });
            }

            const expandMenu = document.querySelector(this.expandSelector);
            if (expandMenu) {
                expandMenu.addEventListener('click', () => {
                    this.pageExitFun();
                    setTimeout(() => this.enterMenuPage(), 500);
                });
            }
        }
        menuExit() {
            this.isInPage = false
            this.pageExitFun()
        }
        watchPageExit() {
            // 监听菜单是否失去激活状态
            battleInfoState.menuObserver = new MutationObserver(() => {
                const menuBar = document.querySelector(this.menuSelector);
                // 菜单不再激活，视为离开
                if (!menuBar || !menuBar.classList.contains('is-active')) {
                    this.menuExit();
                }
            });

            // 监听菜单的类名变化（检测激活状态）
            const menuContainer = document.querySelector('.el-menu');
            if (menuContainer) {
                battleInfoState.menuObserver.observe(menuContainer, {
                    childList: false,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class']
                });
            }
        }

    }

    // ws =================================================================================

    // =================================================================================
    // == 核心：WebSocket 拦截器 (原型链拦截)
    // =================================================================================
    // 全局WebSocket实例引用
    let currentSocket = null;
    let userInfo = null;

    let wsRespondMsgStatus = {
        titel: '',
        wait: false, //是否等待
        netx: false //是否下一条消息
    };

    const wsRespondFuns = {
        // 'dispatchCharacterStatusInfo': menusAddUserExpInfo,
        // 'dispatchTaskQueueToClient': tryUpdateSatietyShow,
        'newMarket:getUnifiedTransactionList:success': updateMarketPrices,
        // 'battle:fullInfo:success': updateBattleUserNameInfo
    };

    // 存储所有活跃连接
    const activeSockets = new Set();

    function initWs() {
        console.log('妙妙工具 初始化WebSocket...');

        // // 1. 拦截构造函数（关键新增）
        // const OriginalWebSocket = window.WebSocket;
        // unsafeWindow.WebSocket = function (...args) {
        //     const ws = new OriginalWebSocket(...args);
        //     activeSockets.add(ws);
        //     setupSocketCleanup(ws); // 设置清理钩子
        //     return ws;
        // };

        // // 2. 连接清理函数
        // function setupSocketCleanup(ws) {
        //     const originalClose = ws.close;
        //     ws.close = function (...args) {
        //         activeSockets.delete(ws);
        //         return originalClose.apply(this, args);
        //     };

        //     ws.addEventListener('close', () => {
        //         activeSockets.delete(ws);
        //         currentSocket = null;
        //     });
        // }

        // // 3. 页面刷新时的清理（新增）
        // unsafeWindow.addEventListener('beforeunload', () => {
        //     for (let ws of activeSockets) {
        //         try {
        //             ws.close(1000, 'page reload');
        //         } catch (e) { }
        //     }
        // });

        wsSendAndReceive()
        console.log('[妙妙工具] WebSocket拦截初始化完成');
    }

    function wsSendAndReceive() {
        const wsProto = WebSocket.prototype;

        // 判断当前对象是否为真正的WebSocket实例
        function isRealWebSocket(obj) {
            // 双重校验：类型和构造函数，避免原型链污染导致的误判
            return obj instanceof WebSocket &&
                obj.constructor === WebSocket &&
                !activeSockets.has(obj); // 避免重复处理;
        }
        // 1. 拦截 send 方法
        const originalSend = wsProto.send;
        wsProto.send = function (data) {
            if (!isRealWebSocket(this)) {
                return originalSend.apply(this, arguments); // 非WebSocket实例直接放行
            }
            currentSocket = this;
            handleSendMessage(data);
            return originalSend.apply(this, arguments);
        };

        // 2. 拦截 onmessage
        let onmessageDescriptor = Object.getOwnPropertyDescriptor(wsProto, 'onmessage');
        if (!onmessageDescriptor || typeof onmessageDescriptor.set !== 'function') {
            const onmessageStore = new WeakMap();
            onmessageDescriptor = {
                get() { return onmessageStore.get(this); },
                set(callback) { onmessageStore.set(this, callback); }
            };
        }

        Object.defineProperty(wsProto, 'onmessage', {
            ...onmessageDescriptor,
            set: function (callback) {
                if (!isRealWebSocket(this)) {
                    return onmessageDescriptor.set.call(this, callback); // 非WebSocket实例直接放行
                }
                const ws = this;
                currentSocket = ws;
                const wrapped = (event) => {
                    handleReceivedMessage(event.data, ws);
                    if (typeof callback === 'function') {
                        callback.call(ws, event);
                    }
                };
                onmessageDescriptor.set.call(this, wrapped);
            }
        });

        // 3. 拦截 addEventListener
        const originalAddEventListener = wsProto.addEventListener;
        wsProto.addEventListener = function (type, listener, options) {
            if (!isRealWebSocket(this)) {
                return originalAddEventListener.call(this, type, listener, options); // 非WebSocket实例直接放行
            }
            if (type === 'message') {
                const ws = this;
                currentSocket = ws;
                const wrappedListener = (event) => {
                    handleReceivedMessage(event.data, ws);
                    listener.call(ws, event);
                };
                return originalAddEventListener.call(this, type, wrappedListener, options);
            }
            return originalAddEventListener.call(this, type, listener, options);
        };
    }

    // —— 消息处理核心函数 ——
    /**
     * 处理发送的WebSocket消息
     * @param {string|ArrayBuffer} data - 发送的消息数据
     */
    function handleSendMessage(data) {
        if (WS_DEBUG_MODE) {
            console.log('%c[妙妙工具 WS发送]', 'color: #03A9F4; font-weight: bold;', data);
        }
        if (!userInfo) {
            userInfo = getUserInfo(data);
        }
        // 可在此处添加发送消息的自定义处理逻辑
    }

    // —— 解析用户数据 ——
    function getUserInfo(data) {
        try {
            if (typeof data === 'string' && data.length > 2) {

                const payload = JSON.parse(data.substring(2, data.length));
                if (payload[1] && payload[1]['user'] && payload[1]['user']['name']) {
                    return payload[1]['user'];
                }
            }
        } catch (e) {
            // 解析失败，忽略
        }
        return null;
    }

    /**
     * 处理接收的WebSocket消息
     * @param {string|ArrayBuffer} messageData - 接收的消息数据
     * @param {WebSocket} ws - WebSocket实例
     */
    function handleReceivedMessage(messageData, ws) {
        if (messageData instanceof ArrayBuffer) {
            try {
                // 检测压缩格式并解压
                const format = detectCompression(messageData);
                const text = pako.inflate(new Uint8Array(messageData), { to: 'string' });
                let parsed;
                let isJson = false;
                try {
                    parsed = JSON.parse(text);
                    isJson = true;
                } catch {
                    parsed = text;

                }
                if (WS_DEBUG_MODE) {
                    console.log('%c[妙妙工具 WS接收]', 'color: #4CAF50; font-weight: bold;', `(已压缩 ${format} ${isJson ? 'json' : ''})`, parsed);
                }
                // 可在此处添加接收消息的自定义处理逻辑
                // 例如：解析特定消息类型、触发自定义事件等
                if (wsRespondMsgStatus.netx) {
                    wsRespondMsgStatus.netx = false;
                    wsRespondMsgStatus.wait = false;
                    const fun = wsRespondFuns[wsRespondMsgStatus.titel]
                    if (fun && typeof fun === 'function') {
                        fun(parsed.data)
                    }
                    wsRespondMsgStatus.titel = ''
                }

            } catch (err) {
                if (WS_DEBUG_MODE) {
                    console.error('%c[妙妙工具 WS错误]', 'color: #f44336;', '消息解压失败:', err);
                }
            }
        } else {
            // 文本消息直接打印
            if (WS_DEBUG_MODE) {
                console.log('%c[妙妙工具 WS接收]', 'color: #4CAF50; font-weight: bold;', '(文本消息)', messageData);
            }
            let listIndex = messageData.indexOf('[')
            let mapIndex = messageData.indexOf('{')
            messageData = messageData.substring(listIndex > mapIndex ? mapIndex : listIndex)

            try {
                const payload = JSON.parse(messageData);
                if (wsRespondFuns[payload[0]]) {
                    wsRespondMsgStatus.wait = true;
                    wsRespondMsgStatus.titel = payload[0];
                    wsRespondMsgStatus.netx = true
                }
            } catch (e) {
                //
            }

        }
    }

    /**
     * 检测数据压缩格式
     * @param {ArrayBuffer} buf - 二进制数据
     * @returns {string} 压缩格式 ('gzip'|'zlib'|'deflate')
     */
    function detectCompression(buf) {
        const b = new Uint8Array(buf);
        if (b.length < 2) return 'deflate';
        if (b[0] === 0x1f && b[1] === 0x8b) return 'gzip';
        if (b[0] === 0x78 && (((b[0] << 8) | b[1]) % 31) === 0) return 'zlib';
        return 'deflate';
    }


    // —— 自定义发送消息接口 ——
    // 等待任务列表返回
    async function waitTaskListCallback() {
        const now = Date.now();
        while (Date.now() - now < waitForMsg && wsRespondMsgStatus.wait) {
            await sleep(100);
        }
        if (wsRespondMsgStatus.wait) {
            wsRespondMsgStatus.wait = false;
            wsRespondMsgStatus.netx = false;
            return false;
        }
        wsRespondMsgStatus.wait = false;
        wsRespondMsgStatus.netx = false;
        return true
    };


    // 刷新物品价格
    function sendGetItemPriceMessage(itemName) {
        if (!itemName || itemName === '' || itemName === 'null' || itemName === 'undefined') {
            return;
        }
        console.log('妙妙工具 发送刷新物品价格消息', itemName)
        const msg = `42["newMarket:getUnifiedTransactionList",{"user":${JSON.stringify(userInfo)},"data":{"resourceId":"${itemName}"}}]`
        sendCustomWsMessage(msg)
    }

    // 刷新个人信息
    function sendGetUserInfoMessage() {
        const msg = `42["requestCharacterStatusInfo",{"user":${JSON.stringify(userInfo)},"data":null}]`
        sendCustomWsMessage(msg)
    }


    // —— 自定义发送消息接口 ——
    /**
     * 发送自定义WebSocket消息
     * @param {string|object} data - 要发送的消息数据（对象会自动转为JSON字符串）
     * @param {string} [type='custom'] - 消息类型标识
     * @returns {boolean} 是否发送成功
     */
    let sendLastMsgTime = null;
    function sendCustomWsMessage(message) {
        if (sendLastMsgTime && Date.now() - sendLastMsgTime < sendInterval) {
            console.log('%c[妙妙工具 WS发送失败]', 'color: #f44336;', '消息发送太频繁');
            console.log('%c[自定义发送失败-消息发送频繁]', 'color: #FF9800; font-weight: bold;', message, sendLastMsgTime, Date.now(), Date.now() - sendLastMsgTime);
            return false;
        }
        sendLastMsgTime = Date.now();
        if (!currentSocket || currentSocket.readyState !== WebSocket.OPEN) {
            console.error('%c[妙妙工具 WS发送失败]', 'color: #f44336;', 'WebSocket未连接或已关闭');
            wsSendAndReceive();
            return false;
        }
        try {
            currentSocket.send(message);
            // console.log('%c[自定义发送]', 'color: #FF9800; font-weight: bold;', message);
            return true;
        } catch (error) {
            console.error('%c[妙妙工具 自定义发送失败]', 'color: #f44336;', error);
            return false;
        }
    };

    window.addEventListener('load', function () {

        // 延迟创建以确保页面完全加载
        setTimeout(async function () {
            // 从官方变量中提取物品映射
            const itemInfos = await waitFor('tAllGameResource')
            cn_en = getCnToEn(itemInfos);
            en_cn = getEntoCn(itemInfos);
            unsafeWindow.itemCnEn = cn_en
            unsafeWindow.itemEnCn = en_cn

            // 1. 日利节点
            dailyNodeObserver()
            // 2. 仓库点击展示价格
            watchWarehouseEntry()
            // 3. 聊天图片
            chatPicTool()
            // 4.饱食度 使用socket触发
            //satietyShowTool()
            // 5. 战斗信息
            battlePageEntry()
            // 6. 技能书
            countSkillBooks()
        }, 1200);

    });
})();

window.addEventListener("moyu-socket-event", (e) => {
    monitorMarketMessage(e.detail);
});