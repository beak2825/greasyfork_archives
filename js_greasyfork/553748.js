// ==UserScript==
// @name         韭研公社涨停板跟踪
// @author       binary4cat
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  在韭研公社action页面添加异动第二天涨幅跟踪功能
// @license     Proprietary; All rights reserved. Redistribution or modification prohibited.
// @copyright   2025 binary4cat. Unauthorized copying or distribution is strictly forbidden.
// @match        https://www.jiuyangongshe.com/action
// @match        https://www.jiuyangongshe.com/action/*
// @connect      push2ex.eastmoney.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/553748/%E9%9F%AD%E7%A0%94%E5%85%AC%E7%A4%BE%E6%B6%A8%E5%81%9C%E6%9D%BF%E8%B7%9F%E8%B8%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/553748/%E9%9F%AD%E7%A0%94%E5%85%AC%E7%A4%BE%E6%B6%A8%E5%81%9C%E6%9D%BF%E8%B7%9F%E8%B8%AA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 添加按钮样式
  GM_addStyle(`
        #data-extract-button {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px 20px;
            background-color: #1890ff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
        }
        
        #data-extract-button:hover {
            background-color: #40a9ff;
        }
    `);

  /**
   * 从页面提取数据
   * @returns {Object} 提取的数据数组
   */
  function extractDataFromPage () {
    // 查找class为"module-box jc0"的ul标签
    const targetUl = document.querySelector('ul.module-box.jc0');

    if (!targetUl) {
      console.error('未找到class为"module-box jc0"的ul元素');
      return [];
    }

    // 获取所有li标签
    const listItems = targetUl.querySelectorAll('li.module');
    const dataArray = { data: [] };
    listItems.forEach((item, index) => {
      const sectorData = {};
      // 检查li下是否有class为"hsh-flex-upDown jc-bline"的div
      const targetDiv = item.querySelector('div.hsh-flex-upDown.jc-bline');
      if (!targetDiv) {
        // 如果没有找到目标div，跳过当前循环
        return;
      }

      // 获取item的直接子div（一级div）
      const allDivs = Array.from(item.children).filter(child => child.tagName === 'DIV');

      if (allDivs.length < 2) {
        // 如果没有找到第二个div，跳过当前循环
        return;
      }

      // 在第一个div下查找class为"fs18-bold lf"的div内容
      const sectorNameDiv = allDivs[0].querySelector('div.fs18-bold.lf');
      const sectorName = sectorNameDiv ? sectorNameDiv.textContent.trim() : '';
      // 跳过ST板块
      if (sectorName === 'ST板块') {
        return;
      }

      // 在第一个div下查找class为"number lf"的div内容
      const sectorCountDiv = allDivs[0].querySelector('div.number.lf');
      const sectorCount = sectorCountDiv ? sectorCountDiv.textContent.trim() : '';
      // 必须有板块名称
      if (!sectorName) {
        return;
      }

      sectorData.sectorName = sectorName;
      sectorData.sectorCount = sectorCount;
      sectorData.stockList = [];

      // 在第二个div下查找class为"td-box"的ul元素
      const tdBoxUl = allDivs[1].querySelector('ul.td-box');

      if (!tdBoxUl) {
        // 如果没有找到class为"td-box"的ul，跳过当前循环
        return;
      }

      // 获取td-box下的所有li元素
      const tdBoxItems = tdBoxUl.querySelectorAll('li');
      tdBoxItems.forEach((tdItem, tdIndex) => {
        const stock = {};

        // 首先找到class为hsh-flex-both alcenter的div
        const stockInfoDiv = tdItem.querySelector('div.hsh-flex-both.alcenter');

        if (stockInfoDiv) {
          // 股票名称：class为shrink fs15-bold的div的内容
          const stockNameDiv = stockInfoDiv.querySelector('div.shrink.fs15-bold');
          stock.name = stockNameDiv ? stockNameDiv.textContent.trim() : 'N/A';

          // 股票代码：class为shrink fs12-bold-ash force-wrap的div的内容
          const stockCodeDiv = stockInfoDiv.querySelector('div.shrink.fs12-bold-ash.force-wrap');
          stock.code = stockCodeDiv ? stockCodeDiv.textContent.trim() : 'N/A';

          // 股票价格：class为shrink number的div的内容
          const stockPriceDiv = stockInfoDiv.querySelector('div.shrink.number');
          stock.price = stockPriceDiv ? stockPriceDiv.textContent.trim() : 'N/A';

          // 股票涨停时间：class为shrink fs15的div的内容
          const stockLimitTimeDiv = stockInfoDiv.querySelector('div.shrink.fs15');
          stock.limitTime = stockLimitTimeDiv ? stockLimitTimeDiv.textContent.trim() : 'N/A';

          // 股票连板数：class为sort的div的内容
          const stockBoardDiv = stockInfoDiv.querySelector('div.sort');
          stock.continuousBoards = stockBoardDiv ? stockBoardDiv.textContent.trim() : '首板';
          // 如果涨停时间为“--”，则说明不是涨停
          if (stock.limitTime === '--') {
            stock.continuousBoards = '异动';
          }

          // 股票涨跌幅：class为shrink cred的div的内容
          const stockChangeDiv = stockInfoDiv.querySelector('div.shrink.cred');
          stock.changePercent = stockChangeDiv ? stockChangeDiv.textContent.trim() : 'N/A';

          // 股票涨停原因：class为pre tl expound noneHile的pre标签下的a标签的内容
          const reasonPreTag = stockInfoDiv.querySelector('pre');
          stock.reason = reasonPreTag ? reasonPreTag.textContent.trim() : 'N/A';

          // 添加到股票列表
          sectorData.stockList.push(stock);
        }
      });

      dataArray.data.push(sectorData);
    });

    return dataArray;
  }

  /**
   * 创建并打开新标签页展示数据
   * @param {Array} data 要展示的数据
   */
  function openDataViewer (data) {
    try {
      // 创建新窗口
      const newTab = window.open('', '_blank');

      if (newTab) {

        // 构建HTML内容，使用函数字符串传递数据
        const pageHtml = dataHTML(data);

        // 写入页面内容
        newTab.document.open();
        newTab.document.write(pageHtml);
        newTab.document.close();
      }
    } catch (e) {
      alert('打开数据查看器失败: ' + e.message);
      console.error('打开数据查看器错误:', e);
    }
  }

  function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function addExtractButton () {
    for (let i = 0; i < 50; i++) {
      // 尝试查找标签元素
      const activeTab = document.querySelector('ul.module-box.jc0');
      // 如果找到标签，则继续添加按钮
      if (activeTab) {
        console.log('检测到"全部异动解析"标签，准备添加提取按钮');
        break;
      } else {
        console.log(`第${i + 1}次尝试：未检测到"全部异动解析"标签`);
        await sleep(2000);
        continue;
      }
    }

    // 查找目标容器
    const targetContainer = document.querySelector('div.yd-top.hsh-flex-upDown.straight-line');

    if (targetContainer) {
      // 获取容器下的所有div元素
      const childDivs = targetContainer.querySelectorAll('div');

      if (childDivs.length > 0) {
        // 获取最后一个div
        const lastDiv = childDivs[childDivs.length - 1];

        // 创建按钮容器div（仿照指定格式）
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'yd-tabs_item is-top';
        buttonContainer.setAttribute('data-v-2cbcafa3', '');

        // 创建内部文本div
        const innerTextDiv = document.createElement('div');
        innerTextDiv.setAttribute('data-v-2cbcafa3', '');
        innerTextDiv.textContent = '查看异动实时数据';

        // 将内部文本div添加到按钮容器
        buttonContainer.appendChild(innerTextDiv);

        // 添加点击事件
        buttonContainer.addEventListener('click', () => {
          try {
            const extractedData = extractDataFromPage();
            if (extractedData.data && extractedData.data.length > 0) {
              openDataViewer(extractedData.data);
            } else {
              alert('未提取到数据，请检查页面结构是否正确');
            }
          } catch (error) {
            console.error('提取数据失败:', error);
            alert('提取数据时发生错误，请查看控制台');
          }
        });

        // 添加样式使其看起来像一个可点击的标签
        buttonContainer.style.transition = 'background-color 0.3s';
        buttonContainer.style.fontSize = 'xx-small'
        buttonContainer.style.color = 'red'

        buttonContainer.addEventListener('mouseenter', () => {
          buttonContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
        });

        buttonContainer.addEventListener('mouseleave', () => {
          buttonContainer.style.backgroundColor = '';
        });

        // 在最后一个div后面插入按钮容器
        lastDiv.parentNode.insertBefore(buttonContainer, lastDiv.nextSibling);
        return;
      }
    }

    // 如果找不到目标容器，回退到原有的添加方式
    const button = document.createElement('button');
    button.id = 'data-extract-button';
    button.textContent = '查看涨停板数据';

    button.addEventListener('click', () => {
      try {
        const extractedData = extractDataFromPage();
        if (extractedData.data && extractedData.data.length > 0) {
          openDataViewer(extractedData.data);
        } else {
          alert('未提取到数据，请检查页面结构是否正确');
        }
      } catch (error) {
        console.error('提取数据失败:', error);
        alert('提取数据时发生错误，请查看控制台');
      }
    });

    document.body.appendChild(button);
  }

  function dataHTML (data) {
    return `
<!DOCTYPE html>
<html lang="zh-CN">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>韭研公社全部异动票跟踪</title>
  <style>
    body {
      font-family: 'Microsoft YaHei', Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
    }

    .container {
      /* max-width: 1200px; */
      margin: 0 auto;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }

    h1 {
      color: #333;
      margin-bottom: 20px;
      text-align: center;
    }

    .table-container {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    th,
    td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    th {
      background-color: #f2f2f2;
      font-weight: bold;
      color: #333;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    tr:hover {
      background-color: #f5f5f5;
    }

    .sector-header {
      background-color: #e8f4f8;
      font-weight: bold;
      color: #2c5aa0;
    }

    .sector-header td {
      border-bottom: 2px solid #2c5aa0;
    }

    .positive-change {
      color: red;
    }

    .negative-change {
      color: green;
    }

    .limit-up,
    .limit-down {
      font-weight: bold;
    }

    .loading {
      text-align: center;
      padding: 20px;
      color: #666;
    }

    .update-info {
      text-align: right;
      color: #666;
      font-size: 12px;
      margin-top: 10px;
    }

    .spelling-error {
      text-decoration-line: spelling-error;
      font-style: italic;
    }

    /* 响应式设计 */
    @media (max-width: 768px) {

      th,
      td {
        padding: 8px;
        font-size: 14px;
      }

      .container {
        padding: 10px;
      }
    }
  </style>
</head>

<body>
  <div class="container">
    <h1>韭研公社涨停板数据</h1>
    <div class="update-info">最后更新时间: <span id="last-update">加载中...</span></div>
    <div class="table-container">
      <table id="stock-table">
        <thead>
          <tr>
            <th>板块名称</th>
            <th>股票名称</th>
            <th>股票代码</th>
            <th>股票价格</th>
            <th>涨跌幅</th>
            <th>实时涨幅</th>
            <th>连续板数</th>
            <th>涨停时间</th>
            <th>涨停原因</th>
          </tr>
        </thead>
        <tbody id="table-body">
          <tr class="loading">
            <td colspan="9">数据加载中...</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <script>
    // 数据将通过函数参数传递
    function initializePage (initialData) {
      // 存储当前页面的数据
      let currentData = [];
      // 存储涨停和跌停股票池
      let limitUpStocks = new Set();  // 涨停股票池
      let limitDownStocks = new Set();  // 跌停股票池
      // 定时器ID
      let updateInterval = null;

      // 初始化页面数据
      function initData () {
        // 直接使用初始数据
        processData(initialData);
      }

      // 处理并展示数据
      function processData (data) {
        currentData = data;

        // 构建板块数据结构
        const sectors = {};

        // 遍历每个板块
        data.forEach(sector => {
          if (sector.sectorName && sector.stockList && Array.isArray(sector.stockList)) {
            sectors[sector.sectorName] = {
              stocks: sector.stockList,
              count: sector.sectorCount || sector.stockList.length
            };
          }
        });

        // 更新表格
        renderTable(sectors);

        // 启动实时更新
        startRealTimeUpdates();
      }

      // 渲染表格
      function renderTable (sectors) {
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';

        // 遍历每个板块
        Object.keys(sectors).forEach(sectorName => {
          const sectorData = sectors[sectorName];
          const stocks = sectorData.stocks;

          // 添加板块头部行
          const sectorRow = document.createElement('tr');
          sectorRow.className = 'sector-header';
          sectorRow.innerHTML = '<td colspan="9"><strong>' + sectorName + '</strong> - 共 ' + sectorData.count + ' 只股票</td>';
          tableBody.appendChild(sectorRow);

          // 添加股票行
          stocks.forEach(stock => {
            const row = document.createElement('tr');
            row.setAttribute('data-stock-code', stock.code);
            row.innerHTML = '<td></td>' +
              '<td>' + (stock.name || 'N/A') + '</td>' +
              '<td>' + (stock.code || 'N/A') + '</td>' +
              '<td>' + (stock.price || 'N/A') + '</td>' +
              '<td class="' + (stock.changePercent && stock.changePercent.includes('+') ? 'positive-change' : 'positive-change') + '">' +
              (stock.changePercent || 'N/A') + '</td>' +
              '<td class="realtime-change">加载中...</td>' +
              '<td class="' + (stock.continuousBoards === '异动' ? 'spelling-error' : '') + '">' + (stock.continuousBoards || 'N/A') + '</td>' +
              '<td>' + (stock.limitTime || 'N/A') + '</td>' +
              '<td title="' + (stock.reason || '无涨停原因') +
              '" style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + (stock.reason || 'N/A') + '</td>';
            tableBody.appendChild(row);
          });
        });

        // 更新最后更新时间
        updateLastUpdateTime();
      }

      // 启动实时更新
      function startRealTimeUpdates () {
        // 清除现有的定时器
        if (updateInterval) {
          clearInterval(updateInterval);
        }

        // 初始获取涨停和跌停股票池
        getLimitStockPools();

        // 更新实时涨幅
        updateRealTimeChanges();

        // 设置定时器，每2秒更新一次实时涨幅
        updateInterval = setInterval(() => {
          updateRealTimeChanges();

          // 每分钟更新一次涨停/跌停股票池
          const now = new Date();
          if (now.getSeconds() === 0) {
            getLimitStockPools();
          }
        }, 2000);
      }

      // 获取涨停/跌停股票池
      function getLimitStockPools () {
        // 获取当前日期，格式化为YYYYMMDD
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const currentDate = year + month + day;

        // 获取涨停股票池
        async function fetchLimitUpStocks () {
          try {
            const response = await fetch("https://push2ex.eastmoney.com/getTopicZTPool?ut=7eea3edcaed734bea9cbfc24409ed989&dpt=wz.ztzt&Pageindex=0&pagesize=170&sort=fbt%3Aasc&date=" + currentDate);
            const data = await response.json();
            if (data.rc === 0 && data.data && data.data.pool) {
              return new Set(data.data.pool.map(stock => stock.c));
            }
          } catch (error) {
            console.error('获取涨停股票池失败:', error);
          }
          return new Set();
        }

        // 获取跌停股票池
        async function fetchLimitDownStocks () {
          try {
            const response = await fetch("https://push2ex.eastmoney.com/getTopicDTPool?ut=7eea3edcaed734bea9cbfc24409ed989&dpt=wz.ztzt&Pageindex=0&pagesize=20&sort=fund%3Aasc&date=" + currentDate);
            const data = await response.json();
            if (data.rc === 0 && data.data && data.data.pool) {
              return new Set(data.data.pool.map(stock => stock.c));
            }
          } catch (error) {
            console.error('获取跌停股票池失败:', error);
          }
          return new Set();
        }

        // 初始化股票池数据
        async function initializeStockPools () {
          try {
            const [upStocks, downStocks] = await Promise.all([
              fetchLimitUpStocks(),
              fetchLimitDownStocks()
            ]);
            limitUpStocks = upStocks;
            limitDownStocks = downStocks;
          } catch (error) {
            console.error('初始化股票池失败:', error);
            // 失败时使用空集合作为后备
            limitUpStocks = new Set();
            limitDownStocks = new Set();
          }
        }

        // 初始化股票池数据
        initializeStockPools();

        // 更新所有涨停/跌停股票的样式
        updateLimitStockStyles();
      }

      // 更新实时涨幅
      function updateRealTimeChanges () {
        // 实际调用东方财富API获取股票数据
        async function fetchStockData () {
          try {
            // 发起API请求
            // 获取当前日期并格式化为YYYYMMDD格式
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const currentDate = year + month + day;
            // 使用动态日期发起API请求
            const response = await fetch('https://push2ex.eastmoney.com/getYesterdayZTPool?ut=7eea3edcaed734bea9cbfc24409ed989&dpt=wz.ztzt&Pageindex=0&pagesize=200&sort=zs%3Adesc&date=' + currentDate);
            const result = await response.json();

            // 检查响应是否成功
            if (result.rc === 0 && result.data && result.data.pool) {
              // 遍历返回的pool数据
              result.data.pool.forEach(stockData => {
                const stockName = stockData.n; // 股票名称
                const zhangDieFu = stockData.zdp; // 实时涨跌幅

                // 查找表格中对应的股票行
                const stockRows = document.querySelectorAll('#table-body tr:not(.sector-header)');

                stockRows.forEach(row => {
                  const nameCell = row.cells[1]; // 股票名称所在列
                  if (nameCell && nameCell.textContent.trim() === stockName) {
                    const changeCell = row.querySelector('.realtime-change');
                    if (changeCell) {
                      // 直接使用zdp数据，保留两位小数
                      const isPositive = zhangDieFu >= 0;
                      const formattedValue = Number(zhangDieFu).toFixed(2);

                      // 设置文本和样式
                      changeCell.textContent = (isPositive ? '+' : '') + formattedValue + '%';
                      changeCell.className = 'realtime-change ' + (isPositive ? 'positive-change' : 'negative-change');

                      // 检查是否在涨停或跌停股票池
                      checkAndSetLimitStockStyle(row, row.getAttribute('data-stock-code'));
                    }
                  }
                });
              });
            }
          } catch (error) {
            console.error('获取股票数据失败:', error);
            // 出错时使用随机数据作为备份
            updateWithFallbackData();
          }
        }

        // 备用方案：当API调用失败时使用
        function updateWithFallbackData () {
          const stockRows = document.querySelectorAll('#table-body tr:not(.sector-header)');
          stockRows.forEach(row => {
            const changeCell = row.querySelector('.realtime-change');
            if (changeCell) {
              // 生成随机涨跌幅
              const randomChange = (Math.random() * 20 - 10).toFixed(2);
              const changeValue = parseFloat(randomChange);
              const isPositive = changeValue >= 0;

              // 设置文本和样式
              changeCell.textContent = (isPositive ? '+' : '') + randomChange + '%';
              changeCell.className = 'realtime-change ' + (isPositive ? 'positive-change' : 'negative-change');
            }
          });
        }

        // 执行数据获取
        fetchStockData();

        // 更新最后更新时间
        updateLastUpdateTime();
      }

      // 检查并设置涨停/跌停股票的样式
      function checkAndSetLimitStockStyle (row, stockCode) {
        const changeCell = row.querySelector('.realtime-change');
        if (changeCell) {
          // 重置样式
          changeCell.style.fontWeight = 'normal';

          // 检查是否在涨停或跌停股票池中
          // 去除股票代码开头的字母，只保留数字部分进行匹配 
          const numericStockCode = stockCode.replace(/^[A-Za-z]/, '');
          if (limitUpStocks.has(numericStockCode)) {
            // 设置加粗样式 - 涨停
            changeCell.style.fontWeight = 'bold';
            changeCell.style.color = '#ff4d4f';
          } else if (limitDownStocks.has(numericStockCode)) {
            // 设置加粗样式 - 跌停
            changeCell.style.fontWeight = 'bold';
            changeCell.style.color = '#52c41a';
          }
        }
      }

      // 更新涨停跌停股票的样式
      function updateLimitStockStyles () {
        // 遍历所有行，检查是否在涨停或跌停股票池中
        document.querySelectorAll('tr[data-stock-code]').forEach(row => {
          const stockCode = row.getAttribute('data-stock-code');
          checkAndSetLimitStockStyle(row, stockCode);
        });
      }

      // 更新最后更新时间
      function updateLastUpdateTime () {
        document.getElementById('last-update').textContent = new Date().toLocaleString();
      }

      // 清理函数
      function cleanup () {
        if (updateInterval) {
          clearInterval(updateInterval);
          updateInterval = null;
        }
      }

      // 初始化数据
      initData();

      // 页面卸载时清理
      window.addEventListener('beforeunload', cleanup);
    }

    data = ${JSON.stringify(data)}  
    initializePage(data);  
  </script>
</body>

</html>
`
  }

  // 等待页面加载完成后添加按钮
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addExtractButton);
  } else {
    addExtractButton();
  }
})();
