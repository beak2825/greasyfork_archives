// ==UserScript==
// @name         b站：动态投票结果生成图表（饼图）
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  点击b站动态页面左下角的按钮，获取投票数据，生成图表（饼图）
// @author       你看清楚了吗
// @match        https://www.bilibili.com/opus/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561820/b%E7%AB%99%EF%BC%9A%E5%8A%A8%E6%80%81%E6%8A%95%E7%A5%A8%E7%BB%93%E6%9E%9C%E7%94%9F%E6%88%90%E5%9B%BE%E8%A1%A8%EF%BC%88%E9%A5%BC%E5%9B%BE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/561820/b%E7%AB%99%EF%BC%9A%E5%8A%A8%E6%80%81%E6%8A%95%E7%A5%A8%E7%BB%93%E6%9E%9C%E7%94%9F%E6%88%90%E5%9B%BE%E8%A1%A8%EF%BC%88%E9%A5%BC%E5%9B%BE%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 添加自定义按钮和饼图容器样式（重点修改布局样式）
    GM_addStyle(`
        #getDataRidBtn {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 999999;
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            transition: background 0.3s;
        }
        #getDataRidBtn:hover {
            background: #45a049;
        }
        #getDataRidBtn:active {
            background: #3d8b40;
        }
        #voteChartContainer {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999999;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            max-width: 1400px; /* 加宽容器适配左右布局 */
            width: 95%;
            max-height: 90vh;
            overflow: auto;
            display: flex; /* 启用flex布局实现左右排列 */
            flex-direction: column; /* 先纵向排列标题，再横向排列内容 */
        }
        /* 新增：点击外部关闭的遮罩层 */
/* 点击外部关闭的遮罩层（新增禁止滚动相关） */
#voteChartMask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.3);
    z-index: 9999998;
    pointer-events: auto; /* 确保遮罩能拦截滚动 */
    touch-action: none; /* 禁止移动端触摸滚动 */
    overflow: hidden;
}
/* 新增：禁止页面主体滚动的样式 */
body.no-scroll {
    overflow: hidden;
    height: 100vh;
}
        /* 左右布局的内容容器 */
        #chartTableWrapper {
            display: flex;
            gap: 20px; /* 表格和饼图之间的间距 */
            margin-top: 10px;
            flex: 1; /* 占满剩余空间 */
        }
        /* 左侧表格容器 */
        #voteTableContainer {
            flex: 1; /* 表格占1份宽度 */
            min-width: 300px; /* 表格最小宽度，防止太窄 */
            max-height: 1200px; /* 表格最大高度，超出滚动 */
            overflow: auto;
        }
        /* 右侧饼图容器 */
        #voteChartCanvasWrapper {
            flex: 1.5; /* 饼图占1.5份宽度（比表格宽一点） */
            min-width: 400px; /* 饼图最小宽度 */
            display: flex;
            align-items: center; /* 饼图垂直居中 */
            justify-content: center; /* 饼图水平居中 */
        }
        #votePieChart {
            width: 100% !important;
            height: 100% !important;
            max-height: 500px; /* 饼图最大高度 */
        }
        #closeChartBtn {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 5px 10px;
            background: #ff4444;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            z-index: 10; /* 确保关闭按钮在最上层 */
        }
        #chartLoading {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999999;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 20px 40px;
            border-radius: 8px;
            font-size: 16px;
        }
        /* 表格样式优化 */
        #voteDataTable {
            width: 100%;
            border-collapse: collapse; /* 合并边框 */
        }
        #voteDataTable th, #voteDataTable td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        #voteDataTable th {
            background: #f0f0f0;
            position: sticky; /* 表头固定 */
            top: 0;
        }
        /* 图表标题样式 */
        #voteChartTitle {
            text-align: center;
            margin: 0 0 10px 0;
            flex-shrink: 0; /* 标题不收缩 */
        }
    `);
/**
 * 将时间戳转换为指定格式的时间字符串
 * @param {number} timestamp - 时间戳（单位：毫秒，若为秒需先乘以1000）
 * @param {string} format - 时间格式，默认 'YYYY-MM-DD HH:mm:ss'
 *                          可选占位符：YYYY(年)、MM(月)、DD(日)、HH(时)、mm(分)、ss(秒)
 * @returns {string} 格式化后的时间字符串
 */
function timestampToTime(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
    // 处理时间戳：如果是10位（秒级），转换为13位（毫秒级）
    const ts = timestamp.toString().length === 10 ? timestamp * 1000 : timestamp;

    // 创建Date对象
    const date = new Date(ts);

    // 补零函数：确保数字为两位数（如 1 → 01）
    const padZero = (num) => num.toString().padStart(2, '0');

    // 提取时间各部分
    const year = date.getFullYear(); // 年
    const month = padZero(date.getMonth() + 1); // 月（月份从0开始，需+1）
    const day = padZero(date.getDate()); // 日
    const hour = padZero(date.getHours()); // 时
    const minute = padZero(date.getMinutes()); // 分
    const second = padZero(date.getSeconds()); // 秒

    // 替换格式占位符
    return format.replace('YYYY', year)
                 .replace('MM', month)
                 .replace('DD', day)
                 .replace('HH', hour)
                 .replace('mm', minute)
                 .replace('ss', second);
}
    // 2. 创建并插入按钮到页面
    function createButton() {
        // 避免重复创建按钮
        if (document.getElementById('getDataRidBtn')) return;

        const btn = document.createElement('button');
        btn.id = 'getDataRidBtn';
        btn.textContent = '生成投票饼图';

        // 点击按钮触发获取逻辑
        btn.addEventListener('click', getRidAndGenerateChart);

        document.body.appendChild(btn);
    }

    // 3. 显示加载提示
    function showLoading() {
        let loading = document.getElementById('chartLoading');
        if (!loading) {
            loading = document.createElement('div');
            loading.id = 'chartLoading';
            loading.textContent = '正在请求投票数据并生成图表，请稍候...';
            document.body.appendChild(loading);
        }
        loading.style.display = 'block';
    }

    // 4. 隐藏加载提示
    function hideLoading() {
        const loading = document.getElementById('chartLoading');
        if (loading) loading.style.display = 'none';
    }

// 5. 关闭饼图容器（新增移除遮罩）
function closeChartContainer() {
    const container = document.getElementById('voteChartContainer');
    const mask = document.getElementById('voteChartMask');
    if (container) container.remove();
    if (mask) mask.remove();
    document.body.classList.remove('no-scroll'); // 新增：恢复页面滚动
}

    // 6. 核心逻辑：获取data-rid并请求API生成饼图
    function getRidAndGenerateChart() {
        // 获取所有包含data-rid属性的元素
        const elements = document.querySelectorAll('[data-rid]');
        const ridValues = [];

        // 遍历元素收集值
        elements.forEach((el) => {
            const rid = el.getAttribute('data-rid');
            if (rid && !ridValues.includes(rid)) { // 去重
                ridValues.push(rid);
            }
        });

        // 结果判断
        if (ridValues.length === 0) {
            alert('当前页面没有投票');
            console.log('📢 当前页面未找到包含data-rid属性的元素');
            return;
        }

        // 只取第一个有效的vote_id（也可以循环处理多个，这里默认取第一个）
        const voteId = ridValues[0];
        console.log('🔍 选中的vote_id:', voteId);

        // 显示加载提示
        showLoading();

        // 拼接API链接并跨域请求
        const apiUrl = `https://api.bilibili.com/x/vote/vote_info?vote_id=${voteId}`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            timeout: 10000,
            onload: function(response) {
                hideLoading();
                try {
                    // 解析返回的JSON数据
                    const result = JSON.parse(response.responseText);
                    if (result.code !== 0) {
                        alert(`请求投票数据失败：${result.message || '未知错误'}`);
                        console.error('❌ 投票API请求失败', result);
                        return;
                    }

                    // 提取投票选项数据
                    const voteData = result.data.vote_info;
                    const options = voteData.options;
                    if (!options || options.length === 0) {
                        alert('该投票暂无选项数据');
                        return;
                    }

                    // 计算总票数和占比
                    const totalVotes = options.reduce((sum, item) => sum + item.cnt, 0);
                    const chartData = options.map(item => ({
                        name: item.opt_desc,
                        value: item.cnt,
                        percentage: ((item.cnt / totalVotes) * 100).toFixed(2) // 保留两位小数
                    })).sort((a, b) => b.value - a.value);

                    // 生成饼图
                    generatePieChart(chartData, `${voteData.title} 投票人数：${voteData.join_num} 截至时间：${timestampToTime(voteData.end_time)}`);

                } catch (error) {
                    hideLoading();
                    alert(`解析投票数据失败：${error.message}`);
                    console.error('❌ 解析数据失败', error);
                }
            },
            onerror: function(error) {
                hideLoading();
                alert(`请求投票API失败：${error.message}`);
                console.error('❌ API请求错误', error);
            },
            ontimeout: function() {
                hideLoading();
                alert('请求投票API超时，请重试');
                console.error('❌ API请求超时');
            }
        });
    }

    // 7. 生成饼图（重点修改布局结构）
    function generatePieChart(chartData, title) {
        // 先移除已存在的饼图容器
        closeChartContainer();

        // 新增：创建遮罩层（点击遮罩关闭容器）
const mask = document.createElement('div');
mask.id = 'voteChartMask';
mask.addEventListener('click', closeChartContainer);
document.body.appendChild(mask);
document.body.classList.add('no-scroll'); // 新增：禁止页面滚动

        // 创建饼图容器（主容器）
        const container = document.createElement('div');
        container.id = 'voteChartContainer';

        // 创建关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.id = 'closeChartBtn';
        closeBtn.textContent = '关闭';
        closeBtn.addEventListener('click', closeChartContainer);
        container.appendChild(closeBtn);

        // 创建图表标题
        const chartTitle = document.createElement('h3');
        chartTitle.id = 'voteChartTitle';
        chartTitle.textContent = title || '投票数据统计';
        container.appendChild(chartTitle);

        // 创建左右布局的内容容器
        const chartTableWrapper = document.createElement('div');
        chartTableWrapper.id = 'chartTableWrapper';
        container.appendChild(chartTableWrapper);

        // ========== 左侧：表格容器 ==========
        const tableContainer = document.createElement('div');
        tableContainer.id = 'voteTableContainer';
        chartTableWrapper.appendChild(tableContainer);

        // 创建数据表格
        const table = document.createElement('table');
        table.id = 'voteDataTable';

        // 表头
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>排名</th>
                <th>选项名称</th>
                <th>票数</th>
                <th>占比</th>
            </tr>
        `;
        table.appendChild(thead);

        // 表格内容
        const tbody = document.createElement('tbody');
        chartData.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.value}</td>
                <td>${item.percentage}%</td>
            `;
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        tableContainer.appendChild(table);

        // ========== 右侧：饼图容器 ==========
        const chartCanvasWrapper = document.createElement('div');
        chartCanvasWrapper.id = 'voteChartCanvasWrapper';
        chartTableWrapper.appendChild(chartCanvasWrapper);

        // 创建canvas用于绘制饼图
        const canvas = document.createElement('canvas');
        canvas.id = 'votePieChart';
        chartCanvasWrapper.appendChild(canvas);

        // 将容器添加到页面
        document.body.appendChild(container);

        // 使用Chart.js绘制饼图
        const ctx = canvas.getContext('2d');
        // 生成随机颜色（保证每个选项颜色不同）
        const getRandomColor = () => {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        };

        // 准备饼图数据
        const pieData = {
            labels: chartData.map(item => item.name),
            datasets: [{
                label: '票数',
                data: chartData.map(item => item.value),
                backgroundColor: chartData.map(() => getRandomColor()),
                borderWidth: 1
            }]
        };

        // 配置饼图选项（显示名称、数量、占比）
        const pieOptions = {
            responsive: true,
            maintainAspectRatio: false, // 关闭宽高比锁定，适配容器
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(2);
                            return `${label}: ${value}票 (${percentage}%)`;
                        }
                    }
                }
            },
            layout: {
                padding: 0 // 消除饼图内置空白
            }
        };

        // 销毁已存在的图表，避免重复渲染
        if (window.voteChart) {
            window.voteChart.destroy();
        }

        // 创建饼图
        window.voteChart = new Chart(ctx, {
            type: 'pie',
            data: pieData,
            options: pieOptions
        });
    }

    // 辅助函数：生成元素的唯一选择器（方便定位元素）
    function getElementSelector(el) {
        if (el.id) return `#${el.id}`;
        if (el.className) return `${el.tagName.toLowerCase()}.${el.className.replace(/\s+/g, '.')}`;
        return el.tagName.toLowerCase();
    }

    // 页面加载完成后创建按钮
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        createButton();
    } else {
        document.addEventListener('DOMContentLoaded', createButton);
    }

    // 防止按钮被动态内容移除，监听页面变化重新创建
    const observer = new MutationObserver(() => {
        if (!document.getElementById('getDataRidBtn')) {
            createButton();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();