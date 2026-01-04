// ==UserScript==
// @name         亚马逊补货订单导出工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在亚马逊补货订单页面添加CSV导出按钮，自动分页获取数据并下载
// @author       自定义
// @match        https://sellercentral.amazon.com/asdn*
// @match        https://sellercentral.amazon.com/asdn-app/*
// @run-at       document-end  // 页面DOM加载完成后执行
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550652/%E4%BA%9A%E9%A9%AC%E9%80%8A%E8%A1%A5%E8%B4%A7%E8%AE%A2%E5%8D%95%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/550652/%E4%BA%9A%E9%A9%AC%E9%80%8A%E8%A1%A5%E8%B4%A7%E8%AE%A2%E5%8D%95%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ====================== 工具函数 ======================
    /**
     * 延迟函数（控制请求频率，防限流）
     * @param {number} ms - 延迟毫秒数
     * @returns {Promise}
     */
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 时间戳转可读日期（YYYY-MM-DD HH:MM:SS）
     * @param {number} timestamp - 毫秒级时间戳
     * @returns {string} 格式化后的日期
     */
    function formatTimestamp(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toISOString().replace('T', ' ').slice(0, 19); // 截取到秒
    }

    /**
     * 拼接地址信息（地址对象转字符串）
     * @param {object} addressObj - 地址对象（含address子对象）
     * @returns {string} 完整地址
     */
    function formatAddress(addressObj) {
        if (!addressObj || !addressObj.address) return '';
        const { addressLine1, addressLine2, addressLine3, city, stateOrRegion, postalCode, countryCode } = addressObj.address;
        // 过滤空值，拼接地址
        const addressParts = [addressLine1, addressLine2, addressLine3, `${city}, ${stateOrRegion} ${postalCode}`, countryCode]
            .filter(part => part && part.trim() !== '');
        return addressParts.join(' | ');
    }

    /**
     * 数据转CSV格式（处理逗号、引号转义）
     * @param {array} data - 二维数组或对象数组
     * @param {array} headers - CSV表头
     * @returns {string} CSV字符串
     */
    function convertToCSV(data, headers) {
        // 处理表头
        const headerRow = headers.join(',');
        // 处理数据行（转义逗号和双引号）
        const dataRows = data.map(row => {
            return headers.map(key => {
                const value = row[key] || '';
                // 若值含逗号或双引号，用双引号包裹，且双引号转义为两个双引号
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',');
        });
        // 拼接表头和数据，添加换行符
        return [headerRow, ...dataRows].join('\n');
    }

    /**
     * 下载CSV文件
     * @param {string} csvContent - CSV字符串
     * @param {string} filename - 下载文件名
     */
    function downloadCSV(csvContent, filename) {
        // 创建Blob对象（UTF-8编码防乱码）
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        // 创建隐藏的下载链接
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = filename;
        downloadLink.style.display = 'none';
        // 触发下载
        document.body.appendChild(downloadLink);
        downloadLink.click();
        // 清理资源
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
    }

    // ====================== 核心业务逻辑 ======================
    /**
     * 分页获取所有订单数据
     * @returns {array} 所有订单的详情列表
     */
    async function fetchAllOrders() {
        const apiUrl = 'https://sellercentral.amazon.com/asdn-app/fetch-outbound-orders';
        let offset = null; // 分页索引（第一页为空）
        let allOrders = []; // 存储所有订单
        const pageLimit = 100; // 每页数量（与原请求一致）
        const requestDelay = 1500; // 请求间隔（1.5秒，可根据限流情况调整）

        while (true) {
            try {
                // 1. 构造请求体
                const requestBody = {
                    pageLimit: pageLimit,
                    offset: offset,
                    sortByAttributes: { attributeName: 'OrderLastUpdatedOn', order: 'DESCENDING' },
                    filterAttributes: {},
                    searchAttributes: {}
                };

                // 2. 发送POST请求（自动携带当前会话Cookie，无需硬编码）
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Origin': 'https://sellercentral.amazon.com',
                        'Referer': 'https://sellercentral.amazon.com/asdn?ref=asdn_about',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
                    },
                    body: JSON.stringify(requestBody),
                    credentials: 'same-origin' // 关键：确保携带登录Cookie
                });

                // 3. 检查请求状态
                if (!response.ok) {
                    throw new Error(`请求失败：${response.status} ${response.statusText}`);
                }

                // 4. 解析响应数据
                const responseData = await response.json();
                if (!responseData.result || !Array.isArray(responseData.result.orderDetailsData)) {
                    throw new Error('响应格式异常，未找到订单数据');
                }

                // 5. 累加当前页订单
                const currentPageOrders = responseData.result.orderDetailsData;
                allOrders = [...allOrders, ...currentPageOrders];
                console.log(`已获取第 ${Math.ceil(allOrders.length / pageLimit)} 页，累计 ${allOrders.length} 个订单`);

                // 6. 获取下一页索引（无则终止循环）
                const nextOffset = responseData.result.nextPageIndex;
                if (!nextOffset) {
                    console.log('已获取所有页面数据，终止请求');
                    break;
                }

                // 7. 准备下一页请求（添加延迟防限流）
                offset = nextOffset;
                await delay(requestDelay);

            } catch (error) {
                // 捕获错误并携带已获取数据量
                throw new Error(`获取数据失败：${error.message}（已获取 ${allOrders.length} 个订单）`);
            }
        }

        return allOrders;
    }

    /**
     * 解析订单数据（适配CSV格式）
     * @param {array} orderList - 原始订单列表
     * @returns {array} CSV行数据（每行对应一条物流记录）
     */
    function parseOrderData(orderList) {
        const csvRows = [];

        orderList.forEach(order => {
            // 1. 提取订单基础信息（每个订单共用）
            const baseInfo = {
                订单ID: order.orderID || '',
                创建时间: formatTimestamp(order.createdOn),
                最后更新时间: formatTimestamp(order.lastUpdatedOn),
                包装类型: order.packageDetails?.packingType || '',
                订单总数量: order.packageDetails?.totalQuantity || 0,
                订单状态: order.orderStatus || ''
            };

            // 2. 提取物流记录（一个订单可能对应多个物流）
            const shipments = order.orderShipmentsData || [];
            if (shipments.length === 0) {
                // 无物流记录的订单，补空行
                csvRows.push({
                    ...baseInfo,
                    物流ID: '',
                    跟踪号: '',
                    发货地址: '',
                    收货地址: '',
                    物流状态: ''
                });
            } else {
                // 有物流记录，每行对应一条物流
                shipments.forEach(shipment => {
                    csvRows.push({
                        ...baseInfo,
                        物流ID: shipment.shipmentId || '',
                        跟踪号: shipment.trackingId || '',
                        发货地址: formatAddress(shipment.originAddress),
                        收货地址: formatAddress(shipment.destinationAddress),
                        物流状态: shipment.shipmentStatus || ''
                    });
                });
            }
        });

        return csvRows;
    }

    /**
     * 处理导出按钮点击事件
     * @param {Event} e - 点击事件对象
     */
    async function handleExportClick(e) {
        const exportBtn = e.target;
        // 禁用按钮防止重复点击
        exportBtn.disabled = true;
        exportBtn.textContent = '导出中...';

        try {
            // 1. 获取所有订单数据
            const allOrders = await fetchAllOrders();
            if (allOrders.length === 0) {
                alert('未获取到任何订单数据，请检查页面或筛选条件');
                return;
            }

            // 2. 解析数据为CSV格式
            const csvData = parseOrderData(allOrders);
            // 定义CSV表头（与parseOrderData的字段对应）
            const csvHeaders = [
                '订单ID', '创建时间', '最后更新时间', '包装类型', '订单总数量',
                '订单状态', '物流ID', '跟踪号', '发货地址', '收货地址', '物流状态'
            ];

            // 3. 生成并下载CSV
            const csvContent = convertToCSV(csvData, csvHeaders);
            const filename = `亚马逊补货订单_${new Date().toISOString().slice(0, 10)}.csv`;
            downloadCSV(csvContent, filename);

            // 导出成功提示
            alert(`导出成功！共导出 ${csvData.length} 条物流记录（含 ${allOrders.length} 个订单）`);

        } catch (error) {
            // 错误提示
            alert(`导出失败：${error.message}`);
            console.error('导出错误详情：', error);

        } finally {
            // 恢复按钮状态
            exportBtn.disabled = false;
            exportBtn.textContent = '导出CSV';
        }
    }
    /**
     * 延迟添加导出按钮（轮询检测父容器，直到存在或超时）
     * @param {string} targetSelector - 搜索按钮父容器的选择器（需用户调整）
     * @param {number} checkInterval - 轮询间隔（毫秒）
     * @param {number} timeout - 超时时间（毫秒）
     */
    function addExportButtonWithDelay(targetSelector, checkInterval = 500, timeout = 10000) {
        let checkTimer; // 轮询定时器
        let startTime = Date.now(); // 开始时间，用于计算超时

        // 轮询检测函数
        function checkAndAddButton() {
            // 1. 检查是否超时
            if (Date.now() - startTime > timeout) {
                clearInterval(checkTimer);
                console.log(`【按钮添加超时】${timeout}毫秒内未找到父容器，请检查选择器：${targetSelector}`);
                return;
            }

            // 2. 尝试获取父容器（搜索按钮的外层容器）
            const searchBtnContainer = document.querySelector(targetSelector);
            if (!searchBtnContainer) {
                console.log(`【未找到容器】将在${checkInterval}毫秒后重试...`);
                return; // 未找到，继续轮询
            }

            // 3. 找到容器，停止轮询并添加按钮
            clearInterval(checkTimer);
            console.log(`【找到容器】开始添加导出按钮`);

            // 创建导出按钮（样式与原逻辑一致）
            const exportBtn = document.createElement('button');
            exportBtn.textContent = '导出CSV';
            exportBtn.style.cssText = `
                margin-left: 8px;
                padding: 6px 12px;
                border: 1px solid #d1d5db;
                border-radius: 4px;
                background-color: #f9fafb;
                color: #111827;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.2s;
            `;

            // 按钮交互效果
            exportBtn.addEventListener('mouseover', () => {
                exportBtn.style.backgroundColor = '#f3f4f6';
            });
            exportBtn.addEventListener('mouseout', () => {
                exportBtn.style.backgroundColor = '#f9fafb';
            });

            // 绑定点击事件
            exportBtn.addEventListener('click', handleExportClick);

            // 插入到搜索按钮旁边
            searchBtnContainer.appendChild(exportBtn);
            console.log('【按钮添加成功】导出按钮已显示在搜索按钮旁');
        }

        // 启动轮询（每checkInterval毫秒检测一次）
        checkTimer = setInterval(checkAndAddButton, checkInterval);
        // 立即执行一次检测（无需等待第一个间隔）
        checkAndAddButton();
    }

    // ====================== 脚本初始化（调用延迟添加函数） ======================
    // -------------------------- 注意：需手动调整选择器 --------------------------
    const SEARCH_BTN_CONTAINER_SELECTOR = '#root > div > div.css-360fy1.no-borders.order-history-page > div.filters-row.page-spacing > div > div.search-row'; // 替换为你的搜索按钮父容器选择器
    // --------------------------------------------------------------------------

    // 启动延迟添加按钮（轮询500ms/次，10秒超时）
    addExportButtonWithDelay(SEARCH_BTN_CONTAINER_SELECTOR, 500, 10000);

})();