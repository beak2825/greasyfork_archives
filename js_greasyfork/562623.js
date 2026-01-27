// ==UserScript==
// @name         PS price
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在 PSNine 游戏页面展示港服价格历史和史低价格
// @author       听风
// @match        https://psnine.com/psngame/*
// @match        https://psn0.com/psngame/*
// @match        https://www.psnine.com/psngame/*
// @match        https://www.psn0.com/psngame/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js
// @connect      api.psnsgame.com
// @license MI
// @downloadURL https://update.greasyfork.org/scripts/562623/PS%20price.user.js
// @updateURL https://update.greasyfork.org/scripts/562623/PS%20price.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置 API 地址（请根据实际部署地址修改）
    const API_BASE = 'https://api.psnsgame.com/api/psn/PSN/';

    // 从 URL 提取游戏 ID
    function getGameIdFromUrl() {
        const match = window.location.pathname.match(/\/psngame\/(\d+)/);
        if (match && match[1]) {
            // 转换为 NPWR 格式
            return `NPWR${match[1]}_00`;
        }
        return null;
    }

    // 格式化价格
    function formatPrice(price) {
        if (price === null || price === undefined) return '--';
        return `HK${Number(price).toFixed(2)}`;
    }

    // 格式化日期
    function formatDate(dateStr) {
        if (!dateStr) return '--';
        const date = new Date(dateStr);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${month}-${day}`;
    }

    // 添加样式 - 匹配 PSNine 浅色风格
    GM_addStyle(`
        .gp-price-card {
            background: #fff;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            font-family: -apple-system, BlinkMacSystemFont, 'Microsoft YaHei', sans-serif;
        }
        .gp-price-title {
            font-size: 14px;
            font-weight: 600;
            color: #3498db;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        .gp-price-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 15px;
        }
        .gp-price-item {
            flex: 1;
            min-width: 100px;
            text-align: center;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 6px;
        }
        .gp-price-label {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
        }
        .gp-price-value {
            font-size: 20px;
            font-weight: 700;
            color: #666;
        }
        .gp-price-current .gp-price-value {
            color: #e74c3c;
        }
        .gp-price-base .gp-price-value {
            color: #999;
            text-decoration: line-through;
            font-size: 16px;
        }
        .gp-price-lowest .gp-price-value {
            color: #27ae60;
        }
        .gp-price-discount .gp-price-value {
            color: #f39c12;
            font-size: 14px;
        }
        .gp-chart-container {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        .gp-chart-title {
            font-size: 12px;
            color: #666;
            margin-bottom: 10px;
        }
        .gp-chart {
            width: 100%;
            height: 200px;
            background: #fafafa;
            border-radius: 6px;
        }
        .gp-loading {
            text-align: center;
            padding: 20px;
            color: #999;
        }
        .gp-error, .gp-no-data {
            text-align: center;
            padding: 15px;
            color: #999;
            font-size: 13px;
            background: #f8f9fa;
            border-radius: 6px;
        }
    `);

    // 使用 ECharts 绘制价格曲线
    function drawChart(container, priceHistory) {
        if (!priceHistory || priceHistory.length < 2) {
            container.innerHTML = '<div class="gp-no-data">历史数据不足</div>';
            return;
        }

        // 反转数据（API 返回的是倒序）
        const data = [...priceHistory].reverse();
        const dates = data.map(p => formatDate(p.recordDate));
        const prices = data.map(p => parseFloat(p.price));

        // 创建 ECharts 实例
        const chart = echarts.init(container);

        const option = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(50, 50, 50, 0.9)',
                borderColor: 'transparent',
                textStyle: {
                    color: '#fff',
                    fontSize: 12
                },
                formatter: function (params) {
                    const point = params[0];
                    return `<strong>HK${point.value.toFixed(2)}</strong><br/>${point.axisValue}`;
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '8%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: dates,
                axisLine: {
                    lineStyle: {
                        color: '#ddd'
                    }
                },
                axisLabel: {
                    color: '#999',
                    fontSize: 10,
                    interval: 'auto',
                    rotate: 0
                },
                axisTick: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                min: function (value) {
                    return Math.floor(value.min * 0.9);
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    color: '#999',
                    fontSize: 10,
                    formatter: 'HK{value}'
                },
                splitLine: {
                    lineStyle: {
                        color: '#f0f0f0',
                        type: 'dashed'
                    }
                }
            },
            series: [{
                name: '价格',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                showSymbol: true,
                lineStyle: {
                    width: 3,
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: '#3498db' },
                        { offset: 1, color: '#9b59b6' }
                    ])
                },
                itemStyle: {
                    color: '#3498db',
                    borderWidth: 2,
                    borderColor: '#fff'
                },
                emphasis: {
                    itemStyle: {
                        color: '#e74c3c',
                        borderColor: '#fff',
                        borderWidth: 3
                    },
                    scale: 1.5
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(52, 152, 219, 0.4)' },
                        { offset: 1, color: 'rgba(52, 152, 219, 0.02)' }
                    ])
                },
                data: prices
            }]
        };

        chart.setOption(option);

        // 响应式
        window.addEventListener('resize', () => {
            chart.resize();
        });
    }

    // 创建价格卡片
    function createPriceCard(data) {
        const card = document.createElement('div');
        card.className = 'gp-price-card';

        const hasDiscount = data.currentPrice && data.basePrice && parseFloat(data.currentPrice) < parseFloat(data.basePrice);

        let html = `
            <div class="gp-price-title">💰 港服价格信息</div>
            <div class="gp-price-grid">
                <div class="gp-price-item gp-price-current">
                    <div class="gp-price-label">当前价格</div>
                    <div class="gp-price-value">${formatPrice(data.currentPrice)}</div>
                </div>
        `;

        if (hasDiscount) {
            html += `
                <div class="gp-price-item gp-price-base">
                    <div class="gp-price-label">原价</div>
                    <div class="gp-price-value">${formatPrice(data.basePrice)}</div>
                </div>
            `;
        }

        html += `
                <div class="gp-price-item gp-price-lowest">
                    <div class="gp-price-label">📉 史低价格</div>
                    <div class="gp-price-value">${formatPrice(data.lowestPrice)}</div>
                </div>
        `;

        if (data.discountEndTime) {
            html += `
                <div class="gp-price-item gp-price-discount">
                    <div class="gp-price-label">⏰ 折扣截止</div>
                    <div class="gp-price-value">${formatDate(data.discountEndTime)}</div>
                </div>
            `;
        }

        html += `</div>`;

        if (data.priceHistory && data.priceHistory.length > 0) {
            html += `
                <div class="gp-chart-container">
                    <div class="gp-chart-title">📈 价格走势</div>
                    <div class="gp-chart" id="gp-price-chart"></div>
                </div>
            `;
        }

        card.innerHTML = html;

        // 绘制图表
        if (data.priceHistory && data.priceHistory.length > 0) {
            setTimeout(() => {
                const chartContainer = card.querySelector('#gp-price-chart');
                if (chartContainer) {
                    drawChart(chartContainer, data.priceHistory);
                }
            }, 100);
        }

        return card;
    }

    // 查找插入位置
    function findInsertPosition() {
        // PSNine 实际 DOM 结构：
        // .main > .box.pd10 是游戏头部区域
        // 在头部区域后插入
        const headerBox = document.querySelector('.main > .box.pd10');
        if (headerBox) {
            return { element: headerBox, position: 'afterend' };
        }
        // 备选：在侧边栏顶部插入
        const sidebar = document.querySelector('.side');
        if (sidebar) {
            return { element: sidebar, position: 'afterbegin' };
        }
        // 再备选：在 .main 顶部插入
        const main = document.querySelector('.main');
        if (main) {
            return { element: main, position: 'afterbegin' };
        }
        return null;
    }

    // 获取价格数据
    function fetchPriceHistory(npid) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${API_BASE}/getPriceHistoryByNpid?npid=${encodeURIComponent(npid)}`,
                headers: {
                    'Accept': 'application/json'
                },
                onload: function (response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data);
                        } catch (e) {
                            reject(new Error('解析响应失败'));
                        }
                    } else {
                        reject(new Error(`请求失败: ${response.status}`));
                    }
                },
                onerror: function (error) {
                    reject(new Error('网络请求失败'));
                }
            });
        });
    }

    // 主函数
    async function init() {
        const npid = getGameIdFromUrl();
        if (!npid) {
            console.log('[GP] 无法从 URL 提取游戏 ID');
            return;
        }

        console.log('[GP] 正在获取价格历史:', npid);

        // 创建占位容器
        const placeholder = document.createElement('div');
        placeholder.className = 'gp-price-card';
        placeholder.innerHTML = '<div class="gp-loading">⏳ 正在加载价格信息...</div>';

        const insertPos = findInsertPosition();
        if (insertPos) {
            insertPos.element.insertAdjacentElement(insertPos.position, placeholder);
        } else {
            console.log('[GP] 找不到合适的插入位置');
            return;
        }

        try {
            const data = await fetchPriceHistory(npid);

            if (data && (data.currentPrice || data.lowestPrice)) {
                const priceCard = createPriceCard(data);
                placeholder.replaceWith(priceCard);
            } else {
                placeholder.innerHTML = '<div class="gp-no-data">暂无价格信息</div>';
            }
        } catch (error) {
            console.error('[GP] 获取价格失败:', error);
            placeholder.innerHTML = `<div class="gp-error">获取价格失败: ${error.message}</div>`;
        }
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
