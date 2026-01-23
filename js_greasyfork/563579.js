// ==UserScript==
// @name         集思录 封闭股基(股票型) 修正年化折价率
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在集思录封闭股基(股票型)页面添加“修正年化折价率”列，公式=(折价率 - 1.5) ÷ 剩余年限。值越小（越负）越好。支持点击表头排序。
// @author       melville0333
// @match        https://www.jisilu.cn/data/cf/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563579/%E9%9B%86%E6%80%9D%E5%BD%95%20%E5%B0%81%E9%97%AD%E8%82%A1%E5%9F%BA%28%E8%82%A1%E7%A5%A8%E5%9E%8B%29%20%E4%BF%AE%E6%AD%A3%E5%B9%B4%E5%8C%96%E6%8A%98%E4%BB%B7%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/563579/%E9%9B%86%E6%80%9D%E5%BD%95%20%E5%B0%81%E9%97%AD%E8%82%A1%E5%9F%BA%28%E8%82%A1%E7%A5%A8%E5%9E%8B%29%20%E4%BF%AE%E6%AD%A3%E5%B9%B4%E5%8C%96%E6%8A%98%E4%BB%B7%E7%8E%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 可修改的配置区 ====================
    // 小白建议：只改这一块就够了，其他地方尽量不要动

    let ascending = true;               // true = 从小到大排序（负值靠前，最好）  false = 从大到小
    const SCORE_COLUMN_WIDTH = '70px';  // 修正年化折价率列宽度（可改成'90px'、'100px'等）
    const RANK_COLUMN_WIDTH = '30px';   // 排名列宽度

    // ==================== 全局变量 ====================
    let indexes = {}; // 用于记录“折价率”和“剩余年限”在表格中的第几列

    // ==================== 核心计算函数 ====================
    function calculateScore(rowData) {
        const discountStr = (rowData[indexes.discount] || '0%').trim();
        let discount = parseFloat(discountStr.replace('%', '')) || 0;

        const remainYearStr = (rowData[indexes.remainYear] || '').trim();
        let remainYear = parseFloat(remainYearStr);

        if (isNaN(remainYear) || remainYear <= 0) {
            return 'N/A';
        }

        const adjusted = (discount - 1.5) / remainYear;
        return adjusted.toFixed(3);
    }

    // ==================== 更新或创建“修正年化折价率”列 ====================
    function updateScores(dataRows) {
        dataRows.forEach(row => {
            const rowData = Array.from(row.querySelectorAll('td')).map(td => td.textContent.trim());
            const score = calculateScore(rowData);

            let scoreCell = row.querySelector('.jsl-adjusted-discount');
            if (!scoreCell) {
                scoreCell = document.createElement('td');
                scoreCell.classList.add('jsl-adjusted-discount');
                const rankCell = row.querySelector('.jsl-rank');
                if (rankCell) {
                    row.insertBefore(scoreCell, rankCell);
                } else {
                    row.appendChild(scoreCell);
                }
                scoreCell.style.width = SCORE_COLUMN_WIDTH;
                scoreCell.style.minWidth = SCORE_COLUMN_WIDTH;
                scoreCell.style.maxWidth = SCORE_COLUMN_WIDTH;
            }

            scoreCell.textContent = score;
            scoreCell.style.fontWeight = 'bold';
            scoreCell.style.textAlign = 'center';

            if (score === 'N/A') {
                scoreCell.style.backgroundColor = '#ff9800';
                scoreCell.style.color = 'white';
            } else {
                const value = parseFloat(score);
                if (value < 0) {
                    scoreCell.style.backgroundColor = '#4caf50';
                    scoreCell.style.color = 'white';
                } else {
                    scoreCell.style.backgroundColor = '#ffeb3b';
                    scoreCell.style.color = 'black';
                }
            }
        });
    }

    // ==================== 更新或创建“排名”列 ====================
    function updateRanks(dataRows) {
        dataRows.forEach((row, i) => {
            let rankCell = row.querySelector('.jsl-rank');
            if (!rankCell) {
                rankCell = document.createElement('td');
                rankCell.classList.add('jsl-rank');
                row.appendChild(rankCell);
                rankCell.style.width = RANK_COLUMN_WIDTH;
                rankCell.style.minWidth = RANK_COLUMN_WIDTH;
                rankCell.style.maxWidth = RANK_COLUMN_WIDTH;
            }

            const rank = i + 1;
            rankCell.textContent = rank;
            rankCell.style.fontWeight = 'bold';
            rankCell.style.textAlign = 'center';

            if (rank % 5 === 0) {
                rankCell.style.backgroundColor = '#ff5252';
                rankCell.style.color = 'white';
            } else {
                rankCell.style.backgroundColor = '#e3f2fd';
                rankCell.style.color = 'black';
            }
        });
    }

    // ==================== 点击表头进行排序（修复版）===================
    function sortByScore(dataRows, headerText) {
        dataRows.forEach(row => {
            const rowData = Array.from(row.querySelectorAll('td')).map(td => td.textContent.trim());
            const score = calculateScore(rowData);

            // 关键修复：统一把有效数值转为数字，N/A 排到最末
            if (score === 'N/A') {
                row._tempScore = Infinity;  // N/A 永远排最后
            } else {
                row._tempScore = parseFloat(score);
            }
        });

        // 排序逻辑
        dataRows.sort((a, b) => {
            if (ascending) {
                return a._tempScore - b._tempScore;  // 小 → 大（负值在前）
            } else {
                return b._tempScore - a._tempScore;  // 大 → 小（正值在前）
            }
        });

        const parent = dataRows[0].parentNode;
        dataRows.forEach(row => parent.appendChild(row));

        updateRanks(dataRows);

        ascending = !ascending;
        headerText.textContent = ascending ? '修正年化折价率 ↑' : '修正年化折价率 ↓';
    }

    // ==================== 主刷新函数 ====================
    function refreshTable() {
        const allRows = Array.from(document.querySelectorAll('tr'));
        if (allRows.length < 20) return false;

        let headerRow = null;
        for (let row of allRows) {
            if (row.querySelectorAll('th').length > 10) {
                headerRow = row;
                break;
            }
        }
        if (!headerRow) return false;

        const headerTexts = Array.from(headerRow.querySelectorAll('th'))
            .map(th => th.textContent.trim().replace(/\s+/g, ''));

        indexes = {
            discount: headerTexts.findIndex(t => t.includes('折价率')),
            remainYear: headerTexts.findIndex(t => t.includes('剩余年限'))
        };

        if (Object.values(indexes).some(i => i === -1)) return false;

        const dataRows = allRows.filter(r => r !== headerRow && r.querySelectorAll('td').length > 10);

        if (!headerRow.querySelector('.jsl-adjusted-header')) {
            const scoreHeader = document.createElement('th');
            scoreHeader.classList.add('jsl-adjusted-header');
            scoreHeader.style.cssText = `font-weight:bold;background:#ffeb3b;text-align:center;padding:8px;cursor:pointer;width:${SCORE_COLUMN_WIDTH};min-width:${SCORE_COLUMN_WIDTH};max-width:${SCORE_COLUMN_WIDTH};`;
            scoreHeader.title = '（折价率 - 1.5） ÷ 剩余年限，值越小（越负）越优质';

            const clickText = document.createElement('div');
            clickText.textContent = '修正年化折价率 ↑';
            clickText.style.display = 'inline-block';
            scoreHeader.appendChild(clickText);

            clickText.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                sortByScore(dataRows, clickText);
            };

            const rankHeader = headerRow.querySelector('.jsl-rank-header');
            if (rankHeader) {
                headerRow.insertBefore(scoreHeader, rankHeader);
            } else {
                headerRow.appendChild(scoreHeader);
            }

            const rankHeaderNew = document.createElement('th');
            rankHeaderNew.classList.add('jsl-rank-header');
            rankHeaderNew.textContent = '排名';
            rankHeaderNew.style.cssText = `font-weight:bold;background:#64b5f6;text-align:center;padding:8px;width:${RANK_COLUMN_WIDTH};min-width:${RANK_COLUMN_WIDTH};max-width:${RANK_COLUMN_WIDTH};`;
            headerRow.appendChild(rankHeaderNew);
        }

        updateScores(dataRows);
        updateRanks(dataRows);
        return true;
    }

    // ==================== 监听页面变化 ====================
    let refreshTimer = null;
    const observer = new MutationObserver(() => {
        if (refreshTimer) clearTimeout(refreshTimer);
        refreshTimer = setTimeout(refreshTable, 300);
    });

    // ==================== 启动脚本 ====================
    let initAttempts = 0;
    const initInterval = setInterval(() => {
        initAttempts++;
        if (refreshTable()) {
            clearInterval(initInterval);
            observer.observe(document.body, { childList: true, subtree: true });
            console.log('集思录封闭股基 - 修正年化折价率脚本 v1.5 加载完成！排序已修复，0值再也不会乱排了。');
        } else if (initAttempts >= 50) {
            clearInterval(initInterval);
        }
    }, 1000);
})();
