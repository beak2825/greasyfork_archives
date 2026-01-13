// ==UserScript==
// @name         Apple App Store 账单统计助手
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  统计 reportaproblem.apple.com 页面的订单数据，提供可视化图表和筛选功能 (已排除充值记录)
// @author       棒棒糖
// @match        https://reportaproblem.apple.com/*
// @icon         https://www.apple.com/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js
// @license    	 MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/562397/Apple%20App%20Store%20%E8%B4%A6%E5%8D%95%E7%BB%9F%E8%AE%A1%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/562397/Apple%20App%20Store%20%E8%B4%A6%E5%8D%95%E7%BB%9F%E8%AE%A1%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 1. 样式定义 (CSS)
    // ==========================================
    const styles = `
        #aas-float-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: #0071e3;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            cursor: pointer;
            z-index: 9999;
            transition: transform 0.2s;
            font-size: 14px;
            text-align: center;
            line-height: 1.2;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        #aas-float-btn:hover {
            transform: scale(1.1);
            background: #0077ed;
        }
        #aas-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            display: none;
            justify-content: center;
            align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        #aas-modal {
            background: white;
            width: 90%;
            max-width: 1000px;
            height: 85vh;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        .aas-header {
            padding: 15px 20px;
            border-bottom: 1px solid #e5e5e5;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f5f5f7;
        }
        .aas-header h2 { margin: 0; font-size: 18px; color: #1d1d1f; }
        .aas-close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #86868b;
        }
        .aas-body {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .aas-controls {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            padding: 15px;
            background: #fbfbfd;
            border-radius: 8px;
            border: 1px solid #d2d2d7;
            align-items: center;
        }
        .aas-input-group { display: flex; flex-direction: column; gap: 5px; }
        .aas-input-group label { font-size: 12px; color: #86868b; }
        .aas-input {
            padding: 8px;
            border: 1px solid #d2d2d7;
            border-radius: 6px;
            font-size: 14px;
        }
        .aas-btn {
            padding: 8px 16px;
            background: #0071e3;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            height: 36px;
            margin-top: auto;
        }
        .aas-btn:hover { background: #0077ed; }
        .aas-btn.secondary { background: #e5e5e5; color: #1d1d1f; }
        .aas-btn.secondary:hover { background: #d5d5d5; }

        .aas-stats-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        .aas-card {
            background: #fbfbfd;
            padding: 15px;
            border-radius: 10px;
            border: 1px solid #e5e5e5;
            text-align: center;
        }
        .aas-card-title { font-size: 13px; color: #86868b; margin-bottom: 5px; }
        .aas-card-value { font-size: 24px; font-weight: bold; color: #1d1d1f; }

        .aas-charts-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        .aas-chart-wrapper {
            background: white;
            border: 1px solid #e5e5e5;
            border-radius: 10px;
            padding: 15px;
            position: relative;
            height: 350px;
        }
        .aas-span-full {
            grid-column: 1 / -1;
        }

        @media (max-width: 768px) {
            .aas-charts-container { grid-template-columns: 1fr; }
            .aas-chart-wrapper { height: 300px; }
            .aas-span-full { grid-column: auto; }
        }
    `;

    GM_addStyle(styles);

    // ==========================================
    // 2. 核心逻辑 (Logic)
    // ==========================================

    let rawData = [];
    let charts = { appPie: null, pubPie: null, bar: null };

    // 初始化 UI
    function initUI() {
        // 创建悬浮按钮
        const floatBtn = document.createElement('div');
        floatBtn.id = 'aas-float-btn';
        floatBtn.innerHTML = '账单<br>统计';
        floatBtn.onclick = openModal;
        document.body.appendChild(floatBtn);

        // 创建模态框
        const modalHtml = `
            <div id="aas-modal-overlay">
                <div id="aas-modal">
                    <div class="aas-header">
                        <h2>App Store 消费分析</h2>
                        <button class="aas-close-btn" id="aas-close">&times;</button>
                    </div>
                    <div class="aas-body">
                        <!-- 控制区 -->
                        <div class="aas-controls">
                            <div class="aas-input-group">
                                <label>开始日期</label>
                                <input type="date" id="aas-date-start" class="aas-input">
                            </div>
                            <div class="aas-input-group">
                                <label>结束日期</label>
                                <input type="date" id="aas-date-end" class="aas-input">
                            </div>
                            <div class="aas-input-group" style="flex: 1;">
                                <label>搜索 App / 商家名称</label>
                                <input type="text" id="aas-search" class="aas-input" placeholder="输入名称筛选...">
                            </div>
                            <button class="aas-btn secondary" id="aas-refresh">🔄 重新抓取数据</button>
                        </div>

                        <!-- 统计卡片 -->
                        <div class="aas-stats-cards">
                            <div class="aas-card">
                                <div class="aas-card-title">总消费 (CNY)</div>
                                <div class="aas-card-value" id="aas-val-total">¥0.00</div>
                            </div>
                            <div class="aas-card">
                                <div class="aas-card-title">订单数量</div>
                                <div class="aas-card-value" id="aas-val-count">0</div>
                            </div>
                            <div class="aas-card">
                                <div class="aas-card-title">单笔最高</div>
                                <div class="aas-card-value" id="aas-val-max">¥0.00</div>
                            </div>
                        </div>

                        <!-- 图表区 -->
                        <div class="aas-charts-container">
                            <!-- App 维度 -->
                            <div class="aas-chart-wrapper">
                                <canvas id="aas-chart-app-pie"></canvas>
                            </div>
                            <!-- 商家 维度 -->
                            <div class="aas-chart-wrapper">
                                <canvas id="aas-chart-pub-pie"></canvas>
                            </div>
                            <!-- 时间 维度 -->
                            <div class="aas-chart-wrapper aas-span-full">
                                <canvas id="aas-chart-bar"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // 绑定事件
        document.getElementById('aas-close').onclick = closeModal;
        document.getElementById('aas-modal-overlay').onclick = (e) => {
            if (e.target.id === 'aas-modal-overlay') closeModal();
        };

        // 筛选事件
        document.getElementById('aas-date-start').addEventListener('change', renderDashboard);
        document.getElementById('aas-date-end').addEventListener('change', renderDashboard);
        document.getElementById('aas-search').addEventListener('input', renderDashboard);
        document.getElementById('aas-refresh').addEventListener('click', () => {
            scrapeData();
            renderDashboard();
        });
    }

    // 数据抓取函数
    function scrapeData() {
        const purchases = document.querySelectorAll('.purchase');
        const extracted = [];

        purchases.forEach(purchaseRow => {
            // 1. 获取日期
            const dateEl = purchaseRow.querySelector('.invoice-date');
            if (!dateEl) return;
            const dateStr = dateEl.innerText.trim(); // e.g. "2026年1月12日"
            const dateObj = parseChineseDate(dateStr);

            // 2. 遍历该订单下的所有 Item (ul.pli-list > li.pli)
            const items = purchaseRow.querySelectorAll('.pli-list.applicable-items .pli');

            items.forEach(item => {
                // 3. 获取 App 标题
                const titleEl = item.querySelector('.pli-title');
                const title = titleEl ? titleEl.innerText.trim() : "未知应用";
                debugger

                // --- 排除逻辑：排除充值记录 ---
                // "为 Apple 账户充值" 或 "App Store 与 iTunes Store 礼品"
                // 使用 includes 模糊匹配以增强兼容性
                if (title.indexOf('为 Apple 账户充值')>0 ||
                    title.indexOf('App Store 与 iTunes Store 礼品')>0 ||
                    title.indexOf('Add funds to Apple Account')>0 || // 英文情况
                    title.indexOf('App Store & iTunes Gift Card')>0) { // 英文情况
                    return;
                }

                // 4. 获取发布者/商家
                const publisherEl = item.querySelector('.pli-publisher');
                const publisher = publisherEl ? publisherEl.innerText.trim() : "未知商家";
                if (publisher === ''){
                   return;
                }



                // 5. 获取价格
                const priceEl = item.querySelector('.pli-price');
                let priceRaw = priceEl ? priceEl.innerText.trim() : "0";
                let price = 0;

                if (priceRaw.includes('免费') || priceRaw.includes('Free')) {
                    price = 0;
                } else {
                    // 移除货币符号 (¥, $, etc) 和逗号
                    price = parseFloat(priceRaw.replace(/[^\d.]/g, ''));
                }

                if (!isNaN(price)) {
                    extracted.push({
                        date: dateObj,
                        dateStr: dateStr, // 用于展示
                        timestamp: dateObj.getTime(),
                        title: title,
                        publisher: publisher,
                        price: price
                    });
                }
            });
        });

        rawData = extracted.sort((a, b) => b.timestamp - a.timestamp); // 按时间倒序
        console.log(`[App Store 统计] 已抓取 ${rawData.length} 条记录 (已排除充值)`);
    }

    // 解析中文日期 "2026年1月12日" -> Date Object
    function parseChineseDate(str) {
        // 简单的正则匹配
        const match = str.match(/(\d+)年(\d+)月(\d+)日/);
        if (match) {
            return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
        }
        return new Date(); // Fallback
    }

    // 格式化日期 YYYY-MM-DD
    function formatDateInput(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    // 渲染仪表盘
    function renderDashboard() {
        // 1. 获取筛选条件
        const startVal = document.getElementById('aas-date-start').value;
        const endVal = document.getElementById('aas-date-end').value;
        const searchVal = document.getElementById('aas-search').value.toLowerCase();

        const startDate = startVal ? new Date(startVal).getTime() : 0;
        const endDate = endVal ? new Date(endVal).getTime() + 86400000 : Infinity; // 加一天包含当天

        // 2. 过滤数据
        const filteredData = rawData.filter(item => {
            const timeMatch = item.timestamp >= startDate && item.timestamp < endDate;
            const nameMatch = item.title.toLowerCase().includes(searchVal) || item.publisher.toLowerCase().includes(searchVal);
            return timeMatch && nameMatch;
        });

        // 3. 计算统计卡片数据
        const totalAmount = filteredData.reduce((acc, curr) => acc + curr.price, 0);
        const maxAmount = Math.max(...filteredData.map(i => i.price), 0);

        document.getElementById('aas-val-total').innerText = `¥${totalAmount.toFixed(2)}`;
        document.getElementById('aas-val-count').innerText = filteredData.length;
        document.getElementById('aas-val-max').innerText = `¥${maxAmount.toFixed(2)}`;

        // 4. 准备图表数据
        updateCharts(filteredData);
    }

    function updateCharts(data) {
        // 通用颜色
        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#C9CBCF', '#E7E9ED', '#5A5E6B'
        ];

        // 辅助函数：聚合数据并排序
        function aggregateAndSort(items, keyField) {
            const map = {};
            items.forEach(item => {
                const k = item[keyField] || '未知';
                if (!map[k]) map[k] = 0;
                map[k] += item.price;
            });
            let arr = Object.keys(map).map(k => ({ name: k, value: map[k] }));
            arr.sort((a, b) => b.value - a.value);

            // Top 8 + Others
            const top = arr.slice(0, 8);
            const othersVal = arr.slice(8).reduce((acc, curr) => acc + curr.value, 0);
            if (othersVal > 0) {
                top.push({ name: '其他', value: othersVal });
            }
            return top;
        }

        // 1. 准备 App 数据
        const topApps = aggregateAndSort(data, 'title');

        // 2. 准备 Publisher 数据
        const topPubs = aggregateAndSort(data, 'publisher');

        // 3. 准备 Monthly 数据
        const monthMap = {};
        data.forEach(item => {
            const d = new Date(item.timestamp);
            const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}`;
            if (!monthMap[key]) monthMap[key] = 0;
            monthMap[key] += item.price;
        });
        const sortedMonths = Object.keys(monthMap).sort();

        // 销毁旧图表
        if (charts.appPie) charts.appPie.destroy();
        if (charts.pubPie) charts.pubPie.destroy();
        if (charts.bar) charts.bar.destroy();

        // 渲染 App 饼图
        const ctxApp = document.getElementById('aas-chart-app-pie').getContext('2d');
        charts.appPie = createPieChart(ctxApp, topApps, '商品消费占比', colors);

        // 渲染 Publisher 饼图
        const ctxPub = document.getElementById('aas-chart-pub-pie').getContext('2d');
        // 使用稍微不同的颜色顺序或色系区分，这里简单倒序一下颜色
        charts.pubPie = createPieChart(ctxPub, topPubs, 'APP/商家消费占比', [...colors].reverse());

        // 渲染柱状图
        const ctxBar = document.getElementById('aas-chart-bar').getContext('2d');
        charts.bar = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: sortedMonths,
                datasets: [{
                    label: '月度消费 (¥)',
                    data: sortedMonths.map(m => monthMap[m]),
                    backgroundColor: '#0071e3',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: '月度消费趋势' }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // 辅助函数：创建饼图
    function createPieChart(ctx, dataArr, titleStr, colorArr) {
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: dataArr.map(i => i.name),
                datasets: [{
                    data: dataArr.map(i => i.value),
                    backgroundColor: colorArr,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { boxWidth: 10, font: { size: 10 } } },
                    title: { display: true, text: titleStr },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) label += ': ';
                                let value = context.parsed;
                                let total = context.chart._metasets[context.datasetIndex].total;
                                let percentage = ((value / total) * 100).toFixed(1) + "%";
                                return label + '¥' + value.toFixed(2) + ' (' + percentage + ')';
                            }
                        }
                    }
                }
            }
        });
    }

    function openModal() {
        scrapeData(); // 每次打开重新抓取

        if (rawData.length > 0) {
            const timestamps = rawData.map(d => d.timestamp);
            const minTime = Math.min(...timestamps);
            const maxTime = Math.max(...timestamps);

            const startInput = document.getElementById('aas-date-start');
            const endInput = document.getElementById('aas-date-end');

            if (!startInput.value) startInput.value = formatDateInput(new Date(minTime));
            if (!endInput.value) endInput.value = formatDateInput(new Date(maxTime));
        }

        renderDashboard();
        document.getElementById('aas-modal-overlay').style.display = 'flex';
    }

    function closeModal() {
        document.getElementById('aas-modal-overlay').style.display = 'none';
    }

    // ==========================================
    // 3. 启动
    // ==========================================
    // 等待页面加载完成一些基础元素
    window.addEventListener('load', () => {
        setTimeout(initUI, 1000);
    });

})();