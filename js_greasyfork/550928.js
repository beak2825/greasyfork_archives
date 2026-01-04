// ==UserScript==
// @name         新球体育网欧赔统计
// @namespace    http://dol.freevar.com/
// @version      1.03
// @description  新球体育网（球探）手机端网页，数字输入框里输入要统计赛前多少小时的欧赔。在赛程页面加入“统计”按钮，统计当前页面里所有已完场的比赛。在分析页面加入“统计”,“表格”,“预测”按钮，“统计”按钮统计当前页面这场比赛。“表格”按钮生成各个公司对已统计场次的准确度表格，误差越低的公司越准确。选择公司后可点击“预测”按钮，比较两极分化的公司预测赛果。
// @author       Dolphin
// @match        https://m.titan007.com/info/*
// @match        https://m.titan007.com/Analy/*
// @match        https://m.titan007.com/analy/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550928/%E6%96%B0%E7%90%83%E4%BD%93%E8%82%B2%E7%BD%91%E6%AC%A7%E8%B5%94%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/550928/%E6%96%B0%E7%90%83%E4%BD%93%E8%82%B2%E7%BD%91%E6%AC%A7%E8%B5%94%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量
    let tableData = {};

    // 插入控制元素
    function insertControls() {
        const contentDiv = document.getElementById('content');
        if (!contentDiv) return;

        const controlContainer = document.createElement('div');
        controlContainer.style.fontSize = '16px';
        controlContainer.style.textAlign = 'right';

        const label = document.createElement('span');
        label.textContent = '赛前小时:';

        const input = document.createElement('input');
        input.type = 'number';
        input.id = 'preMatchTime';
        input.value = localStorage.getItem('preMatchHour') || 24;
        input.style.fontSize = '20px';
        input.style.width = '50px';
        input.style.margin = '0 5px 5px 0';
        input.style.border = '1px solid #0170CA';

        const statsBtn = document.createElement('button');
        statsBtn.id = 'statsBtn';
        statsBtn.textContent = '统计';
        statsBtn.style.background = '#bfb';
        statsBtn.style.fontSize = '18px';
        statsBtn.style.margin = '5px 5px 0 0';

        const clearBtn = document.createElement('button');
        clearBtn.id = 'clearBtn';
        clearBtn.textContent = '清除';
        clearBtn.style.background = '#fbb';
        clearBtn.style.fontSize = '18px';
        clearBtn.style.margin = '5px 5px 0 0';
        clearBtn.addEventListener('click', () => {
            if (confirm('确定清除所有统计数据吗？')) {
                localStorage.removeItem('euroStats');
                localStorage.removeItem('preMatchHour');
            }
        });

        controlContainer.appendChild(clearBtn);
        controlContainer.appendChild(label);
        controlContainer.appendChild(input);
        controlContainer.appendChild(statsBtn);

        if (/\/analy\/(shijian|Analysis)\//i.test(location.href)) {
            const tableBtn = document.createElement('button');
            tableBtn.id = 'tableBtn';
            tableBtn.textContent = '表格';
            tableBtn.style.background = '#bbf';
            tableBtn.style.fontSize = '18px';
            tableBtn.style.margin = '5px 5px 0 0';
            tableBtn.addEventListener('click', () => {
                const preMatchTime = parseInt(document.getElementById('preMatchTime').value);
                generateTable(preMatchTime);
            });

            const predictBtn = document.createElement('button');
            predictBtn.id = 'predictBtn';
            predictBtn.textContent = '预测';
            predictBtn.style.background = '#ffb';
            predictBtn.style.fontSize = '18px';
            predictBtn.style.margin = '5px 5px 0 0';
            predictBtn.addEventListener('click', predictResult);

            controlContainer.appendChild(tableBtn);
            controlContainer.appendChild(predictBtn);

            statsBtn.addEventListener('click', () => {
                const preMatchTime = parseInt(document.getElementById('preMatchTime').value);
                localStorage.setItem('preMatchHour', preMatchTime);
                startAnalysisPageStats(preMatchTime);
            });
        } else {
            statsBtn.addEventListener('click', () => {
                const preMatchTime = parseInt(document.getElementById('preMatchTime').value);
                localStorage.setItem('preMatchHour', preMatchTime);
                startInfoPageStats(preMatchTime);
            });
        }

        if (contentDiv.firstChild) {
            contentDiv.insertBefore(controlContainer, contentDiv.firstChild);
        } else {
            contentDiv.appendChild(controlContainer);
        }
    }

    // 开始信息页面统计
    function startInfoPageStats(preMatchTime) {
        const scoreElements = document.querySelectorAll('span.red, span[style="color:red;"]');
        if (scoreElements.length === 0) {
            alert('没有完场的比赛')
            return
        }
        const statsBtn = document.getElementById('statsBtn');
        statsBtn.disabled = true;
        statsBtn.textContent = '统计中';

        const matches = [];
        scoreElements.forEach(element => {
            const tr = element.closest('tr');
            if (!tr) return;

            const onclick = tr.getAttribute('onclick');
            const matchId = onclick.match(/ToAnaly\((\d+)\s*,\s*-1\)/)[1];

            const scoreText = element.textContent.trim();
            const scoreParts = scoreText.split(':');
            if (scoreParts.length !== 2) return;

            const homeScore = parseInt(scoreParts[0]);
            const guestScore = parseInt(scoreParts[1]);

            matches.push({
                id: matchId,
                homeScore,
                guestScore
            });
        });

        processMatches(matches, preMatchTime, () => {
            statsBtn.disabled = false;
            statsBtn.textContent = '统计';
            alert('已统计'+matches.length+'场比赛！');
        });
    }

    // 开始分析页面统计
    function startAnalysisPageStats(preMatchTime) {
        const statsBtn = document.getElementById('statsBtn');
        const homeScoreEl = document.getElementById('homeScore');
        const guestScoreEl = document.getElementById('guestScore');

        if (!homeScoreEl || !guestScoreEl) {
            alert('没有比分！');
            return
        }

        statsBtn.disabled = true;
        statsBtn.textContent = '统计中';

        const matchId = scheduleId;
        const homeScore = parseInt(homeScoreEl.textContent);
        const guestScore = parseInt(guestScoreEl.textContent);

        processMatches([{ id: matchId, homeScore, guestScore }], preMatchTime, () => {
            statsBtn.disabled = false;
            statsBtn.textContent = '统计';
        });
    }

    // 处理多场比赛
    function processMatches(matches, preMatchTime, callback) {
        let processed = 0;

        matches.forEach((match, index) => {
            setTimeout(() => {
                fetchOddsData(match.id, (oddsData) => {
                    if (oddsData) {
                        calculateErrors(match, oddsData, preMatchTime);
                    }
                    processed++;
                    document.getElementById('statsBtn').textContent = processed + "/" + matches.length;
                    if (processed === matches.length) {
                        callback();
                    }
                });
            }, index * 100);
        });
    }

    // 获取赔率数据
    function fetchOddsData(matchId, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://txt.titan007.com/1x2/${matchId}.js`,
            onload: function(response) {
                if (response.status === 200 && response.responseText) {
                    callback(parseOddsData(response.responseText));
                } else {
                    alert(`获取比赛 ${matchId} 赔率数据失败：${response.status}`);
                    callback(null);
                }
            },
            onerror: function(error) {
                alert(`获取比赛 ${matchId} 赔率数据出错：${error.message}`);
                callback(null);
            }
        });
    }

    // 解析赔率数据 - 严格使用指定的正则表达式
    function parseOddsData(data) {
        // 使用指定的正则表达式提取比赛时间
        const matchTimeMatch = data.match(/MatchTime="([\s\S]*?)";/);
        if (!matchTimeMatch) return null;
        const matchTimeStr = matchTimeMatch[1];

        // 使用指定的正则表达式提取game数据
        const gameMatch = data.match(/game=Array\(([\s\S]*?)\);/);
        if (!gameMatch) return null;
        const gameContent = gameMatch[1];

        // 解析公司信息
        const companyData = gameContent.split(',').map(item => {
            const parts = item.replace(/"/g, '').split('|');
            return {
                id: parts[1],
                name: parts[2]
            };
        });

        // 使用指定的正则表达式提取gameDetail数据
        const gameDetailMatch = data.match(/gameDetail=Array\(([\s\S]*?)\);/);
        if (!gameDetailMatch[1]) {
            alert('没有欧赔数据');
            return null;
        }
        const gameDetailContent = gameDetailMatch[1];

        // 解析详细赔率数据
        const oddsData = gameDetailContent.split(',').map(item => {
            const parts = item.replace(/"/g, '').split('^');
            const companyId = parts[0];
            const oddsEntries = parts[1].split(';').filter(Boolean);

            const oddsList = oddsEntries.map(entry => {
                const entryParts = entry.split('|');
                return {
                    winOdds: parseFloat(entryParts[0]),
                    drawOdds: parseFloat(entryParts[1]),
                    loseOdds: parseFloat(entryParts[2]),
                    time: entryParts[3],
                    year: entryParts[7] || matchTimeStr.split(',')[0]
                };
            });

            // 找到对应的公司名称
            const company = companyData.find(c => c.id === companyId);

            return {
                companyId,
                companyName: company ? company.name : `未知(${companyId})`,
                oddsList
            };
        });

        return {
            matchTime: parseMatchTime(matchTimeStr),
            oddsData
        };
    }

    // 解析比赛时间（UTC+0转换为本地时间）
    function parseMatchTime(timeStr) {
        const parts = timeStr.split(',');
        // 创建UTC时间
        const date = new Date(
            parseInt(parts[0]),
            parseInt(parts[1]) - 1,
            parseInt(parts[2]),
            parseInt(parts[3]),
            parseInt(parts[4]),
            parseInt(parts[5])
        );
        date.setHours(date.getHours() + 8);
        // 返回本地时间
        return date;
    }

    // 计算误差
    function calculateErrors(match, oddsData, preMatchTime) {
        // 计算赔率截止时间
        const oddsTime = new Date(oddsData.matchTime);
        oddsTime.setHours(oddsTime.getHours() - preMatchTime);

        // 确定比赛结果类型
        let resultType;
        const homeScore = match.homeScore;
        const guestScore = match.guestScore;

        if (homeScore > guestScore) {
            resultType = 'win';
        } else if (homeScore < guestScore) {
            resultType = 'lose';
        } else {
            resultType = 'draw';
        }

        // 收集各公司在截止时间前的最新赔率
        const companyOdds = [];

        oddsData.oddsData.forEach(company => {
            // 找到截止时间前的最新赔率
            let latestOdds = null;
            let latestTime = null;

            company.oddsList.forEach(odds => {
                const oddsDateTime = new Date(`${odds.year}-${odds.time.replace(' ', 'T')}`);
                if (oddsDateTime <= oddsTime) {
                    if (!latestTime || oddsDateTime > latestTime) {
                        latestTime = oddsDateTime;
                        latestOdds = odds;
                    }
                }
            });

            if (latestOdds) {
                // 计算概率
                const probabilities = calculateProbabilities(
                    latestOdds.winOdds,
                    latestOdds.drawOdds,
                    latestOdds.loseOdds
                );

                companyOdds.push({
                    name: company.companyName,
                    odds: latestOdds,
                    probabilities
                });
            }
        });

        if (companyOdds.length === 0) return;

        // 确定标准概率
        let standardProbability;

        if (resultType === 'draw') {
            // 平局：找到平概率最高的公司
            standardProbability = Math.max(...companyOdds.map(co => co.probabilities.draw));
        } else {
            const goalDifference = Math.abs(homeScore - guestScore);
            const targetProb = resultType === 'win' ?
                companyOdds.map(co => co.probabilities.win) :
                companyOdds.map(co => co.probabilities.lose);

            if (goalDifference === 1) {
                // 净胜1球：找到最接近60%的概率
                standardProbability = findClosestValue(targetProb, 0.6);
            } else if (goalDifference === 2) {
                // 净胜2球：找到最接近80%的概率
                standardProbability = findClosestValue(targetProb, 0.8);
            } else {
                // 净胜2球以上：找到最高概率
                standardProbability = Math.max(...targetProb);
            }
        }

        // 计算各公司误差并保存
        const stats = JSON.parse(localStorage.getItem('euroStats') || '{}');

        companyOdds.forEach(co => {
            const actualProb = resultType === 'win' ? co.probabilities.win :
                              resultType === 'draw' ? co.probabilities.draw :
                              co.probabilities.lose;

            const error = standardProbability - actualProb;

            if (!stats[co.name]) {
                stats[co.name] = {};
            }
            stats[co.name][match.id] = error;
        });

        localStorage.setItem('euroStats', JSON.stringify(stats));
    }

    // 计算概率（归一化）
    function calculateProbabilities(winOdds, drawOdds, loseOdds) {
        // 计算反赔率
        const winProb = 1 / winOdds;
        const drawProb = 1 / drawOdds;
        const loseProb = 1 / loseOdds;

        // 计算总和
        const total = winProb + drawProb + loseProb;

        // 归一化得到概率
        return {
            win: winProb / total,
            draw: drawProb / total,
            lose: loseProb / total,
            returnRate: 1 / total
        };
    }

    // 找到最接近目标值的值
    function findClosestValue(values, target) {
        return values.reduce((prev, curr) => {
            return Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev;
        });
    }

    // 生成表格
    function generateTable(preMatchTime) {
        const matchId = scheduleId;

        fetchOddsData(matchId, (oddsData) => {
            if (!oddsData) return;

            const stats = JSON.parse(localStorage.getItem('euroStats') || '{}');

            const oddsTime = new Date(oddsData.matchTime);
            oddsTime.setHours(oddsTime.getHours() - preMatchTime);

            const tableRows = [];

            oddsData.oddsData.forEach(company => {
                // 找到截止时间前的最新赔率
                let latestOdds = null;
                let latestTime = null;

                company.oddsList.forEach(odds => {
                    const oddsDateTime = new Date(`${odds.year}-${odds.time.replace(' ', 'T')}`);
                    if (oddsDateTime <= oddsTime) {
                        if (!latestTime || oddsDateTime > latestTime) {
                            latestTime = oddsDateTime;
                            latestOdds = odds;
                        }
                    }
                });

                // 计算统计数据
                let openCount = 0;
                let totalError = 0;

                if (stats[company.companyName]) {
                    const matchErrors = stats[company.companyName];
                    openCount = Object.keys(matchErrors).length;
                    totalError = Object.values(matchErrors).reduce((sum, error) => sum + Math.abs(error), 0);
                }

                const avgError = openCount > 0 ? totalError / openCount : 0;

                // 保存到全局变量
                tableData[company.companyName] = {
                    openCount,
                    avgError,
                    probabilities: latestOdds ? calculateProbabilities(
                        latestOdds.winOdds,
                        latestOdds.drawOdds,
                        latestOdds.loseOdds
                    ) : null
                };

                // 添加行数据
                tableRows.push({
                    companyName: company.companyName,
                    openCount,
                    avgError,
                    latestOdds
                });
            });

            // 按平均误差排序
            tableRows.sort((a, b) => a.avgError - b.avgError);

            // 创建表格
            createTable(tableRows);
        });
    }

    // 创建表格
    function createTable(rows) {
        // 检查是否已有表格，如有则删除
        const existingTable = document.getElementById('oddsTable');
        if (existingTable) {
            existingTable.remove();
        }

        // 找出最多的开盘次数
        const maxOpenCount = Math.max(...rows.map(row => row.openCount));

        const tableDiv = document.createElement('div');
        tableDiv.id = 'oddsTable';
        tableDiv.style.overflowX = 'auto';

        const table = document.createElement('table');
        table.style.margin = '0 auto';
        table.style.borderCollapse = 'collapse';
        table.style.textAlign = 'center';
        table.style.fontSize = '16px';
        table.style.whiteSpace = 'nowrap';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.style.backgroundColor = '#ddf';

        const headers = ['公司', '开盘', '平均误差', '胜概率', '平概率', '负概率', '返还率', '选'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.border = '1px solid #888';
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        rows.forEach(row => {
            const tr = document.createElement('tr');

            // 公司名称
            const td1 = document.createElement('td');
            td1.textContent = row.companyName;
            td1.style.border = '1px solid #888';
            tr.appendChild(td1);

            // 开盘次数
            const td2 = document.createElement('td');
            td2.textContent = row.openCount;
            td2.style.border = '1px solid #888';
            // 最多开盘次数高亮显示
            if (row.openCount === maxOpenCount) {
                td2.style.background = '#fdd';
            }
            tr.appendChild(td2);

            // 平均误差
            const td3 = document.createElement('td');
            td3.textContent = (row.avgError * 100).toFixed(4);
            td3.style.border = '1px solid #888';
            td3.style.background = '#ffd';
            tr.appendChild(td3);

            // 胜平负概率
            if (row.latestOdds) {
                const probs = calculateProbabilities(
                    row.latestOdds.winOdds,
                    row.latestOdds.drawOdds,
                    row.latestOdds.loseOdds
                );

                const td4 = document.createElement('td');
                td4.textContent = (probs.win * 100).toFixed(2);
                td4.style.border = '1px solid #888';
                tr.appendChild(td4);

                const td5 = document.createElement('td');
                td5.textContent = (probs.draw * 100).toFixed(2);
                td5.style.border = '1px solid #888';
                td5.style.background = '#ffd';
                tr.appendChild(td5);

                const td6 = document.createElement('td');
                td6.textContent = (probs.lose * 100).toFixed(2);
                td6.style.border = '1px solid #888';
                tr.appendChild(td6);

                const rerateTd = document.createElement('td');
                rerateTd.textContent = (probs.returnRate * 100).toFixed(2);
                rerateTd.style.border = '1px solid #888';
                rerateTd.style.backgroundColor = '#dfd';
                tr.appendChild(rerateTd);
            } else {
                // 没有开盘数据
                for (let i = 0; i < 4; i++) {
                    const td = document.createElement('td');
                    td.textContent = '没开盘';
                    td.style.border = '1px solid #888';
                    tr.appendChild(td);
                }
            }

            // 复选框
            const td7 = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `select_${row.companyName.replace(/\s/g, '_')}`;
            checkbox.style.position = 'initial';
/*
            if (row.openCount === maxOpenCount) {
                checkbox.checked = true;
            }
*/
            td7.appendChild(checkbox);
            tr.appendChild(td7);

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        tableDiv.appendChild(table);

        const controlContainer = document.getElementById('statsBtn').closest('div');
        controlContainer.appendChild(tableDiv);
    }

    // 预测结果
    function predictResult() {
        const selectedCompanies = [];
        const checkboxes = document.querySelectorAll('#oddsTable input[type="checkbox"][id^="select_"]:checked');

        checkboxes.forEach(checkbox => {
            const companyName = checkbox.id.replace('select_', '').replace(/_/g, ' ');
            if (tableData[companyName] && tableData[companyName].probabilities) {
                selectedCompanies.push({
                    name: companyName,
                    data: tableData[companyName]
                });
            }
        });

        if (selectedCompanies.length < 2) {
            alert('请至少选择两个公司');
            return;
        }

        // 按平均误差排序
        selectedCompanies.sort((a, b) => a.data.avgError - b.data.avgError);

        // 分组
        let group1 = []; // 误差偏小
        let group2 = []; // 误差偏大

        if (selectedCompanies.length % 2 === 1) {
            // 单数，去掉中间的
            const middleIndex = Math.floor(selectedCompanies.length / 2);
            group1 = selectedCompanies.slice(0, middleIndex);
            group2 = selectedCompanies.slice(middleIndex + 1);
        } else {
            // 双数，平均分成两组
            const middleIndex = selectedCompanies.length / 2;
            group1 = selectedCompanies.slice(0, middleIndex);
            group2 = selectedCompanies.slice(middleIndex);
        }

        // 计算各组平均概率
        const resultDiv = document.createElement('div');

        const title = document.createElement('div');
        title.textContent = '对比概率，让1球60%，让2球80%';
        title.style.padding = '5px';
        title.style.background = '#eee';
        resultDiv.appendChild(title);

        const calcGroupAvg = (group) => {
            if (group.length === 0) return null;

            let winSum = 0, drawSum = 0, loseSum = 0;

            group.forEach(company => {
                winSum += company.data.probabilities.win;
                drawSum += company.data.probabilities.draw;
                loseSum += company.data.probabilities.lose;
            });

            return {
                win: winSum / group.length,
                draw: drawSum / group.length,
                lose: loseSum / group.length
            };
        };

        const group1Avg = calcGroupAvg(group1);
        const allAvg = calcGroupAvg(selectedCompanies);
        const group2Avg = calcGroupAvg(group2);

        const resultTable = document.createElement('table');
        resultTable.style.margin = '0 auto';
        resultTable.style.borderCollapse = 'collapse';
        resultTable.style.textAlign = 'center';
        resultTable.style.fontSize = '16px';

        const resultThead = document.createElement('thead');
        const resultHeaderRow = document.createElement('tr');
        resultHeaderRow.style.backgroundColor = '#ddf';

        const resultHeaders = ['公司分类', '平均胜', '平均平', '平均负'];
        resultHeaders.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.border = '1px solid #888';
            resultHeaderRow.appendChild(th);
        });
        resultThead.appendChild(resultHeaderRow);
        resultTable.appendChild(resultThead);

        const resultTbody = document.createElement('tbody');

        if (group1Avg) {
            const row1 = document.createElement('tr');
            const td1 = document.createElement('td');
            td1.textContent = group1.length + '家误差小';
            td1.style.border = '1px solid #888';
            row1.appendChild(td1);

            const td2 = document.createElement('td');
            td2.textContent = (group1Avg.win * 100).toFixed(2);
            td2.style.border = '1px solid #888';
            row1.appendChild(td2);

            const td3 = document.createElement('td');
            td3.textContent = (group1Avg.draw * 100).toFixed(2);
            td3.style.border = '1px solid #888';
            row1.appendChild(td3);

            const td4 = document.createElement('td');
            td4.textContent = (group1Avg.lose * 100).toFixed(2);
            td4.style.border = '1px solid #888';
            row1.appendChild(td4);

            resultTbody.appendChild(row1);
        }

        if (allAvg) {
            const row2 = document.createElement('tr');
            row2.style.background = '#ffd';
            const td1 = document.createElement('td');
            td1.textContent = selectedCompanies.length + '家已选择';
            td1.style.border = '1px solid #888';
            row2.appendChild(td1);

            const td2 = document.createElement('td');
            td2.textContent = (allAvg.win * 100).toFixed(2);
            td2.style.border = '1px solid #888';
            row2.appendChild(td2);

            const td3 = document.createElement('td');
            td3.textContent = (allAvg.draw * 100).toFixed(2);
            td3.style.border = '1px solid #888';
            row2.appendChild(td3);

            const td4 = document.createElement('td');
            td4.textContent = (allAvg.lose * 100).toFixed(2);
            td4.style.border = '1px solid #888';
            row2.appendChild(td4);

            resultTbody.appendChild(row2);
        }

        if (group2Avg) {
            const row3 = document.createElement('tr');
            const td1 = document.createElement('td');
            td1.textContent = group2.length + '家误差大';
            td1.style.border = '1px solid #888';
            row3.appendChild(td1);

            const td2 = document.createElement('td');
            td2.textContent = (group2Avg.win * 100).toFixed(2);
            td2.style.border = '1px solid #888';
            row3.appendChild(td2);

            const td3 = document.createElement('td');
            td3.textContent = (group2Avg.draw * 100).toFixed(2);
            td3.style.border = '1px solid #888';
            row3.appendChild(td3);

            const td4 = document.createElement('td');
            td4.textContent = (group2Avg.lose * 100).toFixed(2);
            td4.style.border = '1px solid #888';
            row3.appendChild(td4);

            resultTbody.appendChild(row3);
        }

        resultTable.appendChild(resultTbody);
        resultDiv.appendChild(resultTable);

        const existingResult = document.getElementById('predictionResult');
        if (existingResult) {
            existingResult.replaceWith(resultDiv);
        } else {
            const table = document.getElementById('oddsTable');
            table.parentNode.insertBefore(resultDiv, table);
        }
        resultDiv.id = 'predictionResult';
    }

    if (/\/info\/fixture\/|\/info\/cupmatch|\/analy\/shijian\/|\/analy\/analysis\//i.test(location.href)) {
        insertControls();
    }
})();