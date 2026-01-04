// ==UserScript==
// @name         射手助手优化
// @version      1.4
// @author       you
// @description  优化挂单创建时间的显示方式、自动隐藏自己的挂单
// @match        https://*.milkywayidle.com/*
// @match        https://*.milkywayidlecn.com/*
// @connect      www.milkywayidle.com
// @connect      test.milkywayidle.com
// @connect      www.milkywayidlecn.com
// @connect      test.milkywayidlecn.com
// @grant        GM.xmlHttpRequest
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @license      CC-BY-NC-SA-4.0
// @namespace    http://tampermonkey.net/
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558370/%E5%B0%84%E6%89%8B%E5%8A%A9%E6%89%8B%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/558370/%E5%B0%84%E6%89%8B%E5%8A%A9%E6%89%8B%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量
    const globalVariable = {
        market: {
            allListings: {}
        },
        lastOrderBookProcessTime: 0
    };

    // 全局变量：角色名称元素
    let NAME = null;

    // 时间格式化函数：将X天X时X分格式化为1.3d或1.3h或1.3m
    // 返回对象包含格式化后的时间字符串和对应的颜色
    function formatTime(timeStr) {
        // 检查是否包含负数时间（如-1天、-1时、-2分）
        if (timeStr.includes('-1天') || timeStr.includes('-1时') || timeStr.includes('-2分') || timeStr.includes('-')) {
            return { time: '0m', color: '#00ff00' }; // 绿色
        }

        let days = 0, hours = 0, minutes = 0;

        // 提取天、时、分
        if (timeStr.includes('天')) {
            days = parseInt(timeStr.match(/(\d+)天/)[1]);
        }
        if (timeStr.includes('时')) {
            hours = parseInt(timeStr.match(/(\d+)时/)[1]);
        }
        if (timeStr.includes('分')) {
            minutes = parseInt(timeStr.match(/(\d+)分/)[1]);
        }

        // 计算总分钟数和总小时数
        const totalMinutes = days * 24 * 60 + hours * 60 + minutes;
        const totalHours = totalMinutes / 60;

        // 根据总分钟数选择合适的单位
        let formattedTime;
        if (totalMinutes >= 24 * 60) {
            // 超过1天，用天表示，保留一位小数
            const daysFormatted = (totalMinutes / (24 * 60)).toFixed(1);
            formattedTime = `${daysFormatted}d`;
        } else if (totalMinutes >= 60) {
            // 超过1小时，用小时表示，保留一位小数
            const hoursFormatted = totalHours.toFixed(1);
            formattedTime = `${hoursFormatted}h`;
        } else {
            // 不足1小时，用分钟表示，保留一位小数
            const minutesFormatted = totalMinutes.toFixed(1);
            formattedTime = `${minutesFormatted}m`;
        }

        // 根据总小时数确定颜色
        let color;
        if (totalHours < 12) {
            color = '#00ff00'; // 绿色
        } else if (totalHours < 24) {
            color = '#ffffff'; // 白色
        } else if (totalHours < 48) {
            color = '#a52a2a'; // 棕色
        } else {
            color = '#ff0000'; // 红色
        }

        return { time: formattedTime, color: color };
    }

    // 处理DOM元素中的时间格式和表头文本
    function processTimeElements() {
        // 1. 处理时间格式和颜色
        const timeElements = document.querySelectorAll('td.RangedWayIdleEstimateListingCreateTime');

        timeElements.forEach(element => {
            const originalText = element.textContent.trim();
            if (originalText && (originalText.includes('天') || originalText.includes('时') || originalText.includes('分'))) {
                const formattedResult = formatTime(originalText);
                element.textContent = formattedResult.time;
                element.style.color = formattedResult.color;
            }
        });

        // 2. 将"估计创建时间"修改为"时长"
        const tableHeaders = document.querySelectorAll('th');
        tableHeaders.forEach(header => {
            if (header.textContent.trim() === '估计创建时间') {
                header.textContent = '时长';
            } else if (header.textContent.trim() === '挂单所有者') {
                header.textContent = '挂单者';
            }
        });
        
        // 3. 仅对"挂单者"这一列应用每行最多显示7个字符的设置
        // 查找所有表格
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            // 查找当前表格的表头
            const headers = table.querySelectorAll('th');
            let ownerColumnIndex = -1;
            
            // 找到"挂单者"列的索引
            headers.forEach((header, index) => {
                if (header.textContent.trim() === '挂单者') {
                    ownerColumnIndex = index;
                }
            });
            
            // 如果找到"挂单者"列，则应用样式
            if (ownerColumnIndex >= 0) {
                // 获取该列的所有单元格
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells[ownerColumnIndex]) {
                        const cell = cells[ownerColumnIndex];
                        // 设置最大宽度为7个字符宽度，使每行最多显示7个字符
                        cell.style.maxWidth = '7ch';
                        cell.style.whiteSpace = 'normal';
                        cell.style.wordBreak = 'break-word';
                        cell.style.height = 'auto';
                        cell.style.padding = '2px 4px'; // 调整内边距以适应多行显示
                    }
                });
            }
        });
    }

    // WebSocket消息处理函数
    function handleMessage(data, type) {
        try {
            const obj = JSON.parse(data);

            if (type !== 'get' || !obj) return;

            // 显示market_listings_updated和init_character_data类型的信息
            if (obj.type === "market_listings_updated" || obj.type === "init_character_data") {
                console.log(`[WebSocket拦截 - ${type}] 接收到${obj.type}类型消息:`);
                console.log(obj);
                
                // 提取ID并保存到localStorage的通用函数
                const saveMarketListingIds = (listings) => {
                    if (listings && Array.isArray(listings)) {
                        const marketListingIds = listings.map(listing => listing.id);
                        console.log(`[WebSocket拦截] 市场挂单ID列表: ${marketListingIds.join(', ')}`);
                        // 将id以数组格式保存到localStorage.ranged_way_idle_deleted_listings中
                        try {
                            localStorage.setItem('ranged_way_idle_deleted_listings', JSON.stringify(marketListingIds));
                            console.log('[WebSocket拦截] 市场挂单ID已保存到localStorage');
                        } catch (error) {
                            console.error('[WebSocket拦截] 保存到localStorage失败:', error);
                        }
                    }
                };
                
                if (obj.type === "market_listings_updated") {
                    console.log("[WebSocket拦截] 市场列表更新");
                    // 提取market_listings_updated中的id信息
                    if (obj.listings) {
                        saveMarketListingIds(obj.listings);
                    }
                } else if (obj.type === "init_character_data") {
                    console.log("[WebSocket拦截] 角色初始化数据");
                    // 提取myMarketListings中的id信息
                    if (obj.myMarketListings) {
                        saveMarketListingIds(obj.myMarketListings);
                    }
                }

                // 查找包含NAME变量内容的元素并模拟点击
                if (NAME && NAME.textContent) {
                    // 添加0.5秒延迟，确保DOM更新完成
                    setTimeout(() => {
                        // 查找两个订单簿表格（出售和购买）
                        const orderBooks = document.querySelectorAll("#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.MarketplacePanel_tabsComponentContainer__3ctJH > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div > div.MarketplacePanel_orderBook__326Yx > div.MarketplacePanel_orderBooksContainer__B4YE- > div:nth-child(-n+2) > table > tbody > tr > td:nth-child(4)");

                        orderBooks.forEach(tdElement => {
                            if (tdElement.textContent.includes(NAME.textContent)) {
                                console.log("[射手助手优化] 找到包含角色名称的元素，模拟点击:", tdElement.textContent);
                                tdElement.click();
                            }
                        });
                    }, 500);
                }
            }
        } catch (err) {
            console.error("[WebSocket拦截] 处理消息时出错:", err);
        }
    }

    // 初始化WebSocket拦截器
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
                console.error("[WebSocket拦截] 拦截接收消息时出错:", err);
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
                console.error("[WebSocket拦截] 拦截发送消息时出错:", err);
            }
            return originalSend.call(this, message);
        };
    }

    // 初始化函数，在页面加载完成后执行
    function init() {
        // 查找角色名称元素并保存为全局变量
        NAME = document.querySelector("#root > div > div > div.GamePage_headerPanel__1T_cA > div > div.Header_rightHeader__8LPWK > div.Header_characterInfo__3ixY8 > div.Header_info__26fkk > div.Header_name__227rJ > div > div.CharacterName_name__1amXp.CharacterName_fancy_yellow__1Bzqp > span");
        if (NAME) {
            console.log("[射手助手优化] 已找到角色名称元素:", NAME.textContent);
        } else {
            console.log("[射手助手优化] 未找到角色名称元素");
        }

        // 初始处理
        processTimeElements();

        // 设置MutationObserver监控页面变化
        const observer = new MutationObserver(() => {
            processTimeElements();
            // 再次尝试查找角色名称元素（如果页面结构变化）
            if (!NAME) {
                NAME = document.querySelector("#root > div > div > div.GamePage_headerPanel__1T_cA > div > div.Header_rightHeader__8LPWK > div.Header_characterInfo__3ixY8 > div.Header_info__26fkk > div.Header_name__227rJ > div > div.CharacterName_name__1amXp.CharacterName_fancy_yellow__1Bzqp > span");
                if (NAME) {
                    console.log("[射手助手优化] 已找到角色名称元素:", NAME.textContent);
                }
            }
        });

        // 监控body内的所有变化
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        // 初始化WebSocket拦截
        initWebSocketInterceptor();
        console.log("[射手助手优化] WebSocket拦截功能已启用");
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();