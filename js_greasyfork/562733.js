// ==UserScript==
// @name         导出拼多多订单 v1.6
// @namespace    win.somereason.web.utils
// @version      1.6.0
// @description  UI大翻新！支持导出下单日期、商品链接、规格、数量、运费等详细字段。安全拦截，防封号。
// @author       Luoshen Seeker & Optimized by Assistant
// @match        *://mobile.pinduoduo.com/orders.html*
// @icon         https://raw.githubusercontent.com/luoshenseeker/PDD_order_exporter/master/icon.png
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562733/%E5%AF%BC%E5%87%BA%E6%8B%BC%E5%A4%9A%E5%A4%9A%E8%AE%A2%E5%8D%95%20v16.user.js
// @updateURL https://update.greasyfork.org/scripts/562733/%E5%AF%BC%E5%87%BA%E6%8B%BC%E5%A4%9A%E5%A4%9A%E8%AE%A2%E5%8D%95%20v16.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==========================================
    // 0. 全局样式注入 (CSS 美化核心)
    // ==========================================
    const cssStyles = `
        #pdd-export-panel {
            position: fixed; top: 0; left: 0; width: 100%;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid #e0e0e0;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            z-index: 999999;
            padding: 12px 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Microsoft YaHei", sans-serif;
        }
        .pdd-export-container {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
        }
        .pdd-date-input {
            border: 1px solid #d9d9d9;
            background: #f5f5f5;
            padding: 8px 12px;
            border-radius: 6px;
            color: #333;
            font-size: 14px;
            outline: none;
            transition: all 0.3s ease;
            width: 135px;
            font-weight: 500;
        }
        .pdd-date-input:hover {
            border-color: #ff6c6c;
            background: #fff;
        }
        .pdd-date-input:focus {
            border-color: #e2231a;
            background: #fff;
            box-shadow: 0 0 0 3px rgba(226, 35, 26, 0.1);
        }
        /* 优化日期选择器的小图标 */
        .pdd-date-input::-webkit-calendar-picker-indicator {
            cursor: pointer;
            opacity: 0.6;
            transition: 0.2s;
        }
        .pdd-date-input::-webkit-calendar-picker-indicator:hover {
            opacity: 1;
            transform: scale(1.1);
        }
        .pdd-separator {
            color: #999;
            font-weight: bold;
            font-size: 14px;
        }
        .pdd-btn {
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 4px;
            transition: transform 0.1s, opacity 0.2s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .pdd-btn:active {
            transform: scale(0.96);
        }
        .pdd-btn:hover {
            opacity: 0.9;
        }
        .btn-red { background: linear-gradient(135deg, #ff4d4d, #e2231a); color: white; }
        .btn-orange { background: linear-gradient(135deg, #ffbd2e, #f59e0b); color: white; }
        .btn-green { background: linear-gradient(135deg, #34d399, #10b981); color: white; }
    `;

    // 注入 CSS
    const styleEl = document.createElement('style');
    styleEl.innerHTML = cssStyles;
    document.head.appendChild(styleEl);


    // ==========================================
    // 1. 数据拦截核心
    // ==========================================
    window.pddOrderCache = new Map();

    // 获取用户名
    function getCurrentUserName() {
        const match = document.cookie.match(/pdd_user_id=([^;]+)/);
        return match ? match[1] : "当前用户";
    }

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(data) {
        this.addEventListener('load', function() {
            if (this._url && this._url.includes('api') && this.responseText) {
                try {
                    const json = JSON.parse(this.responseText);
                    let orders = [];
                    if (json.order_list) orders = json.order_list;
                    else if (json.data && json.data.list) orders = json.data.list;
                    else if (json.orders) orders = json.orders;
                    else if (Array.isArray(json)) orders = json;

                    orders.forEach(order => {
                        const orderSn = order.order_sn || order.orderSn || "";
                        if (!orderSn) return;

                        let rawTime = order.order_time || order.pay_time || order.created_time || 0;
                        if (rawTime > 0 && rawTime < 9999999999) rawTime *= 1000;

                        const formatDate = (ts) => {
                            if (!ts) return "";
                            const d = new Date(ts);
                            return d.getFullYear() + "-" +
                                   String(d.getMonth() + 1).padStart(2, '0') + "-" +
                                   String(d.getDate()).padStart(2, '0') + " " +
                                   String(d.getHours()).padStart(2, '0') + ":" +
                                   String(d.getMinutes()).padStart(2, '0') + ":" +
                                   String(d.getSeconds()).padStart(2, '0');
                        };
                        const orderDate = formatDate(rawTime);

                        let receiveTime = "列表未显示";
                        if (order.receive_time) receiveTime = formatDate(order.receive_time * 1000);
                        else if (order.confirm_time) receiveTime = formatDate(order.confirm_time * 1000);

                        const orderPaid = order.pay_amount ? (order.pay_amount / 100).toFixed(2) : (order.order_amount / 100).toFixed(2);
                        let shippingFee = "包邮";
                        if (order.postage && order.postage > 0) shippingFee = (order.postage / 100).toFixed(2);
                        const status = order.status_prompt || "已完成";

                        const goodsList = order.order_goods || order.goods_list || [];
                        goodsList.forEach((good, index) => {
                            const uniqueKey = `${orderSn}_${good.goods_id || index}`;
                            const unitPrice = good.goods_price ? (good.goods_price / 100).toFixed(2) : "";
                            const spec = good.goods_spec || good.spec || "";
                            const count = good.goods_number || good.goods_num || 1;
                            const link = `https://mobile.pinduoduo.com/goods.html?goods_id=${good.goods_id}`;

                            window.pddOrderCache.set(uniqueKey, {
                                rawTime: rawTime,
                                data: {
                                    date: orderDate,
                                    goodsId: good.goods_id || "",
                                    goodsLink: link,
                                    orderSn: orderSn + "\t",
                                    price: unitPrice,
                                    paid: orderPaid,
                                    spec: spec,
                                    count: count,
                                    status: status,
                                    shipping: shippingFee,
                                    receiveTime: receiveTime,
                                    username: getCurrentUserName(),
                                    goodsName: good.goods_name || ""
                                }
                            });
                        });
                    });
                    checkAutoStop();
                } catch(e) { }
            }
        });
        originalSend.apply(this, arguments);
    };

    // ==========================================
    // 2. 界面 UI (使用新样式类名)
    // ==========================================
    let isScrolling = false;
    let scrollTimer = null;
    let noChangeCount = 0;

    function setupUI() {
        if (document.getElementById("pdd-export-panel")) return;

        const panel = document.createElement("div");
        panel.id = "pdd-export-panel";

        const today = new Date().toISOString().split('T')[0];

        // 构造新的 HTML 结构
        panel.innerHTML = `
            <div style="text-align:center; margin-bottom: 8px; color: #555; font-size: 12px;">
                📊 拼多多订单导出助手 <span id="pdd-status-text" style="color:#e2231a; font-weight:bold; margin-left:5px;">(准备就绪)</span>
            </div>
            <div class="pdd-export-container">
                <input type="date" id="pddStartDate" class="pdd-date-input" title="开始日期">
                <span class="pdd-separator">至</span>
                <input type="date" id="pddEndDate" value="${today}" class="pdd-date-input" title="结束日期">

                <button id="startScrollBtn" class="pdd-btn btn-red">
                    <span>🚀</span> 开始抓取
                </button>
                <button id="stopScrollBtn" class="pdd-btn btn-orange" style="display: none;">
                    <span>⏸️</span> 停止滚动
                </button>
                <button id="exportNowBtn" class="pdd-btn btn-green">
                    <span>📥</span> 导出Excel
                </button>
            </div>
        `;

        document.body.appendChild(panel);
        document.body.style.paddingTop = "120px"; // 增加顶部留白

        document.getElementById("startScrollBtn").onclick = startAutoScroll;
        document.getElementById("stopScrollBtn").onclick = stopAutoScroll;
        document.getElementById("exportNowBtn").onclick = exportHandler;
    }

    function logMessage(msg) {
        const statusText = document.getElementById("pdd-status-text");
        if(statusText) statusText.innerText = `${msg}`;
    }

    // ==========================================
    // 3. 滚动与导出逻辑
    // ==========================================
    function checkAutoStop() {
        if (!isScrolling) return;
        const startDateStr = document.getElementById("pddStartDate").value;
        if (!startDateStr) return;

        const startDateTs = new Date(startDateStr).getTime();
        let foundOlder = false;

        for (let item of window.pddOrderCache.values()) {
            if (item.rawTime < startDateTs) {
                foundOlder = true;
                break;
            }
        }
        if (foundOlder) {
            logMessage(`已加载到 ${startDateStr} 之前的数据，自动停止`);
            stopAutoScroll();
        }
    }

    function startAutoScroll() {
        if (isScrolling) return;
        isScrolling = true;
        document.getElementById("startScrollBtn").style.display = "none";
        document.getElementById("stopScrollBtn").style.display = "flex"; // flex for proper alignment
        logMessage("正在自动滚动抓取...");

        let lastHeight = 0;

        function scrollStep() {
            if (!isScrolling) return;

            const currentHeight = document.body.scrollHeight;
            const doneText = document.querySelector('.loading-text');

            if (doneText && (doneText.innerText.includes('没有更多') || doneText.innerText.includes('到底了'))) {
                logMessage("页面已到底");
                stopAutoScroll();
                return;
            }
            if (currentHeight === lastHeight) {
                noChangeCount++;
                if (noChangeCount > 10) {
                    logMessage("页面不再加载，停止");
                    stopAutoScroll();
                    return;
                }
            } else {
                noChangeCount = 0;
                lastHeight = currentHeight;
            }

            window.scrollBy({ top: 2000, behavior: 'smooth' });
            logMessage(`已缓存 ${window.pddOrderCache.size} 条商品...`);
            setTimeout(checkAutoStop, 500);
            scrollTimer = setTimeout(scrollStep, 1200);
        }
        scrollStep();
    }

    function stopAutoScroll() {
        isScrolling = false;
        clearTimeout(scrollTimer);
        document.getElementById("startScrollBtn").style.display = "flex";
        document.getElementById("stopScrollBtn").style.display = "none";
    }

    function exportHandler() {
        if (isScrolling) stopAutoScroll();

        setTimeout(() => {
            const startDateStr = document.getElementById("pddStartDate").value;
            const endDateStr = document.getElementById("pddEndDate").value;

            const startTs = startDateStr ? new Date(startDateStr).getTime() : 0;
            const endTs = endDateStr ? new Date(endDateStr).getTime() + 86400000 : Infinity;

            if (window.pddOrderCache.size === 0) {
                alert("未抓取到数据，请先点击【开始抓取】！");
                return;
            }

            let csv = `下单日期,商品名称,商品ID,商品链接,订单ID,价格,实付(订单总额),规格,数量,订单状态,运费,收货时间,用户名\n`;

            const sortedItems = Array.from(window.pddOrderCache.values())
                .sort((a, b) => b.rawTime - a.rawTime);

            let count = 0;
            const clean = (str) => `"${(String(str)||"").replace(/"/g, '""')}"`;

            sortedItems.forEach(item => {
                if (item.rawTime >= startTs && item.rawTime < endTs) {
                    const d = item.data;
                    csv += `${clean(d.date)},${clean(d.goodsName)},${clean(d.goodsId)},${clean(d.goodsLink)},${clean(d.orderSn)},${clean(d.price)},${clean(d.paid)},${clean(d.spec)},${clean(d.count)},${clean(d.status)},${clean(d.shipping)},${clean(d.receiveTime)},${clean(d.username)}\n`;
                    count++;
                }
            });

            if (count === 0) {
                alert("当前日期范围内没有数据。");
            } else {
                logMessage(`正在导出 ${count} 条明细...`);
                const fileName = `PDD_明细_${startDateStr || '全部'}_至_${endDateStr || '至今'}.csv`;
                downloadCSV(fileName, csv);
            }
        }, 500);
    }

    function downloadCSV(filename, content) {
        const blob = new Blob(['\uFEFF' + content], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    const initInterval = setInterval(() => {
        if (document.body) {
            setupUI();
            clearInterval(initInterval);
        }
    }, 500);

})();