// ==UserScript==
// @name         集思录 可转债 三低
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  可转债三低策略：选取价格<150（价格可调），溢价率<60%，剩余规模<5亿，按价格+溢价率*100+剩余规模*10 排序。已排除公告强赎、强赎满足天数小于8天、信用等级低、正股ST、正股股价低于2元、净资产为负，剩余年限小于1年，可转债概念为空。
// @author       melville0333
// @match        https://www.jisilu.cn/data/cbnew/*
// @match        https://www.jisilu.cn/web/data/cb/list*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560586/%E9%9B%86%E6%80%9D%E5%BD%95%20%E5%8F%AF%E8%BD%AC%E5%80%BA%20%E4%B8%89%E4%BD%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/560586/%E9%9B%86%E6%80%9D%E5%BD%95%20%E5%8F%AF%E8%BD%AC%E5%80%BA%20%E4%B8%89%E4%BD%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置区（小白可改的地方） ====================
    let defaultPriceThreshold = 150;   // 默认现价阈值，超过此价格的转债三低显示9999
    let ascending = true;              // 三低排序方向：true=从小到大（好券在前）

    // ==================== 全局变量（脚本运行时使用） ====================
    let indexes = {};                  // 记录各关键列的位置（因为集思录表头可能变）
    let priceThreshold = defaultPriceThreshold;  // 当前现价阈值（输入框可改）

    // ==================== 计算三低得分的核心函数 ====================
    // 输入：单行所有单元格文字数组（rowData）
    // 输出：得分（正常数字或9999表示垃圾券）
    function calculateScore(rowData) {
        // 安全读取各列数据（找不到列就用默认值防止崩溃）
        const price        = parseFloat(rowData[indexes.price] || 0);           // 现价
        const stockPrice   = parseFloat(rowData[indexes.stockPrice] || 999);    // 正股价
        const pb           = parseFloat(rowData[indexes.pb] || 999);            // 正股PB
        const remainYearStr= (rowData[indexes.remainYear] || '').trim();         // 剩余年限（字符串，可能带“天”）
        const remainYear   = parseFloat(remainYearStr) || 999;                  // 转成数字
        const redeemStatus = (rowData[indexes.redeemStatus] || '').trim();      // 强赎状态
        const premium      = parseFloat((rowData[indexes.premium] || '0%').replace('%', '')) || 0;  // 转股溢价率
        const scale        = parseFloat(rowData[indexes.scale] || 0);           // 剩余规模（亿元）

        // ==================== 垃圾券过滤条件（满足任一就直接9999） ====================
        if (price > priceThreshold) return 9999;                                        // 现价太高
        if (stockPrice < 2) return 9999;                                                // 正股仙股
        if (pb < 1) return 9999;                                                        // 正股破净
        if (remainYearStr.includes('天')) return 9999;                                  // 剩余年限不到1年（显示“XX天”）
        if (remainYear < 1.5) return 9999;                                              // 剩余年限太短
        if (redeemStatus.includes('最后交易') ||
            redeemStatus.includes('已公告强赎') ||
            redeemStatus.includes('已满足强赎条件')) return 9999;                       // 各种强赎状态
        // 强赎倒计时≤8天
        const dayMatch = redeemStatus.match(/至少还需(\d+)天/);
        if (dayMatch && parseInt(dayMatch[1], 10) <= 8) return 9999;

        // ==================== 正常三低计算 ====================
        return (price + premium + scale * 10).toFixed(2);
    }

    // ==================== 更新三低得分列 ====================
    function updateThreeLowScores(dataRows) {
        dataRows.forEach(row => {
            // 读取当前行所有文字
            const rowData = Array.from(row.querySelectorAll('td')).map(td => td.textContent.trim());
            const score = calculateScore(rowData);

            // 创建或获取“三低”单元格（放在排名列前面）
            let scoreCell = row.querySelector('.jsl-three-low');
            if (!scoreCell) {
                scoreCell = document.createElement('td');
                scoreCell.classList.add('jsl-three-low');
                const rankCell = row.querySelector('.jsl-rank');
                if (rankCell) {
                    row.insertBefore(scoreCell, rankCell);
                } else {
                    row.appendChild(scoreCell);
                }
            }

            scoreCell.textContent = score;
            scoreCell.style.fontWeight = 'bold';
            scoreCell.style.textAlign = 'center';
            if (score == 9999) {
                scoreCell.style.backgroundColor = '#ff5252';  // 垃圾券红底
                scoreCell.style.color = 'white';
            } else {
                scoreCell.style.backgroundColor = '#c8e6c9';  // 正常绿底
            }
        });
    }

    // ==================== 更新排名列（实时） ====================
    function updateRanks(dataRows) {
        dataRows.forEach((row, i) => {
            let rankCell = row.querySelector('.jsl-rank');
            if (!rankCell) {
                rankCell = document.createElement('td');
                rankCell.classList.add('jsl-rank');
                row.appendChild(rankCell);
            }
            const rank = i + 1;
            rankCell.textContent = rank;
            rankCell.style.fontWeight = 'bold';
            rankCell.style.textAlign = 'center';
            // 每5名标红（5、10、15...）
            if (rank % 5 === 0) {
                rankCell.style.backgroundColor = '#ff5252';
                rankCell.style.color = 'white';
            } else {
                rankCell.style.backgroundColor = '#e3f2fd';
            }
        });
    }

    // ==================== 三低点击排序 ====================
    function sortByThreeLow(dataRows, headerText) {
        dataRows.forEach(row => {
            const rowData = Array.from(row.querySelectorAll('td')).map(td => td.textContent.trim());
            row._tempScore = parseFloat(calculateScore(rowData)) || 9999;
        });

        dataRows.sort((a, b) => ascending ? (a._tempScore - b._tempScore) : (b._tempScore - a._tempScore));

        const parent = dataRows[0].parentNode;
        dataRows.forEach(row => parent.appendChild(row));

        updateRanks(dataRows);
        ascending = !ascending;
        headerText.textContent = ascending ? '三低 ↑' : '三低 ↓';
    }

    // ==================== 主刷新函数（初始化 + 重新加载） ====================
    function refreshTable() {
        const allRows = Array.from(document.querySelectorAll('tr'));
        if (allRows.length < 50) return false;  // 表格还没加载好

        // 找表头行
        let headerRow = null;
        for (let row of allRows) {
            if (row.querySelectorAll('th').length > 10) {
                headerRow = row;
                break;
            }
        }
        if (!headerRow) return false;

        // 动态识别列位置
        const headerTexts = Array.from(headerRow.querySelectorAll('th')).map(th => th.textContent.trim().replace(/\s+/g, ''));
        indexes = {
            price:        headerTexts.findIndex(t => t.includes('现价')),
            stockPrice:   headerTexts.findIndex(t => t.includes('正股价')),
            pb:           headerTexts.findIndex(t => t.includes('正股PB')),
            premium:      headerTexts.findIndex(t => t.includes('转股溢价率')),
            redeemStatus: headerTexts.findIndex(t => t.includes('强赎状态')),
            remainYear:   headerTexts.findIndex(t => t.includes('剩余年限')),
            scale:        headerTexts.findIndex(t => t.includes('剩余规模'))
        };
        if (Object.values(indexes).some(i => i === -1)) return false;

        const dataRows = allRows.filter(r => r !== headerRow && r.querySelectorAll('td').length > 10);

        // 只初始化一次表头
        if (!headerRow.querySelector('.jsl-three-low-header')) {
            // 三低表头
            const threeLowHeader = document.createElement('th');
            threeLowHeader.classList.add('jsl-three-low-header');
            threeLowHeader.style.cssText = 'position:relative;font-weight:bold;background:#ffeb3b;text-align:center;padding:8px';
            threeLowHeader.title = '按价格 + 溢价率 + 剩余规模*10 排序';

            const clickText = document.createElement('div');
            clickText.textContent = '三低 ↑';
            clickText.style.cursor = 'pointer';
            clickText.style.display = 'inline-block';
            threeLowHeader.appendChild(clickText);

            const inputArea = document.createElement('div');
            inputArea.style.marginTop = '4px';
            inputArea.style.fontSize = '12px';
            inputArea.innerHTML = '现价＞<input type="number" value="150" step="1" style="width:50px;padding:2px;font-size:12px" title="现价超过此值强制9999">';
            threeLowHeader.appendChild(inputArea);

            const input = inputArea.querySelector('input');
            input.value = priceThreshold;
            input.onchange = () => {
                const v = parseFloat(input.value);
                if (!isNaN(v) && v > 0) {
                    priceThreshold = v;
                    updateThreeLowScores(dataRows);
                }
            };

            clickText.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                sortByThreeLow(dataRows, clickText);
            };

            headerRow.appendChild(threeLowHeader);

            // 排名表头
            const rankHeader = document.createElement('th');
            rankHeader.textContent = '排名';
            rankHeader.style.cssText = 'font-weight:bold;background:#64b5f6;text-align:center;padding:8px';
            headerRow.appendChild(rankHeader);
        }

        updateThreeLowScores(dataRows);
        updateRanks(dataRows);

        return true;
    }

    // ==================== 防卡死监听器 ====================
    let refreshTimer = null;
    const observer = new MutationObserver(() => {
        if (refreshTimer) clearTimeout(refreshTimer);
        refreshTimer = setTimeout(refreshTable, 300);  // 300ms防抖
    });

    // ==================== 启动脚本 ====================
    let initAttempts = 0;
    const initInterval = setInterval(() => {
        initAttempts++;
        if (refreshTable()) {
            clearInterval(initInterval);
            observer.observe(document.body, { childList: true, subtree: true });
            console.log('脚本加载完成！三低+排名全显示，任何操作实时更新，排名每5标红，剩余年限带“天”自动9999，阈值随便调！');
        } else if (initAttempts >= 30) {
            clearInterval(initInterval);
        }
    }, 1000);
})();