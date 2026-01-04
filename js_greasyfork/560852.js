// ==UserScript==
// @name         新球体育网欧赔分析
// @namespace    http://dol.freevar.com/
// @version      0.1
// @description  新球体育网（球探）手机端网页，比赛的分析页面里按开盘顺序列出所有公司，选择所需的公司列出各个时间点的欧赔作对比。
// @author       Dolphin
// @match        https://m.titan007.com/analy/Analysis/*
// @match        https://m.titan007.com/Analy/Analysis/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560852/%E6%96%B0%E7%90%83%E4%BD%93%E8%82%B2%E7%BD%91%E6%AC%A7%E8%B5%94%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/560852/%E6%96%B0%E7%90%83%E4%BD%93%E8%82%B2%E7%BD%91%E6%AC%A7%E8%B5%94%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 检查必要的变量是否存在
    if (typeof scheduleId === 'undefined') {
        alert('没有比赛scheduleId');
        return;
    }

    // 获取上一场比赛时间
    let homePrevMatchTime = null;
    let awayPrevMatchTime = null;
    if (jsonData.nearMatches.homeMatches.matches.length > 0) {
        homePrevMatchTime = parseInt(jsonData.nearMatches.homeMatches.matches[0].matchTime) * 1000;
    }

    if (jsonData.nearMatches.awayMatches.matches.length > 0) {
        awayPrevMatchTime = parseInt(jsonData.nearMatches.awayMatches.matches[0].matchTime) * 1000;
    }

    // 获取赔率数据
    fetchOddsData(scheduleId, homePrevMatchTime, awayPrevMatchTime);

    function fetchOddsData(scheduleId, homePrevMatchTime, awayPrevMatchTime) {
        const url = `https://txt.titan007.com/1x2/${scheduleId}.js`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    processOddsData(response.responseText, homePrevMatchTime, awayPrevMatchTime);
                } else {
                    alert('请求失败:', response.status);
                }
            },
            onerror: function(error) {
                alert('请求出错:', error);
            }
        });
    }

    function processOddsData(data, homePrevMatchTime, awayPrevMatchTime) {
        // 解析比赛时间
        const matchTimeMatch = data.match(/MatchTime="([\s\S]*?)";/);
        if (!matchTimeMatch[1]) {
            alert('没有比赛时间');
            return;
        }

        // 解析比赛时间并加上8小时
        const matchTimeStr = matchTimeMatch[1];
        const matchTimeParts = matchTimeStr.split(',');
        const year = parseInt(matchTimeParts[0]);
        const monthDay = matchTimeParts[1].split('-');
        const month = parseInt(monthDay[0]);
        const day = parseInt(matchTimeParts[2]);
        const hour = parseInt(matchTimeParts[3]);
        const minute = parseInt(matchTimeParts[4]);
        const second = parseInt(matchTimeParts[5] || 0);

        const matchTime = new Date(year, month - 1, day, hour, minute, second);
        matchTime.setHours(matchTime.getHours() + 8); // 加上8小时

        // 解析公司信息
        const gameMatch = data.match(/game=Array\("([\s\S]*?)"\);/);
        if (!gameMatch[1]) {
            alert('没有欧赔数据');
            return;
        }

        // 解析公司数据
        const companyData = {};
        const companies = [];
        const companyEntries = gameMatch[1].split('","');

        companyEntries.forEach(entry => {
            const fields = entry.split('|');
            if (fields.length > 2) {
                const companyId = fields[1];
                const companyName = fields[2];
                companyData[companyId] = companyName;
                companies.push({
                    id: companyId,
                    name: companyName,
                    firstOddsTime: null
                });
            }
        });

        // 解析赔率详情
        const gameDetailMatch = data.match(/gameDetail=Array\("([\s\S]*?)"\);/);
        if (!gameDetailMatch[1]) {
            alert('没有即时欧赔数据');
            return;
        }

        const oddsDetail = {};
        const detailEntries = gameDetailMatch[1].split('","');

        detailEntries.forEach(entry => {
            const parts = entry.split('^');
            if (parts.length === 2) {
                const companyId = parts[0];
                const oddsListStr = parts[1];

                if (companyData[companyId]) {
                    const oddsRecords = [];
                    const oddsItems = oddsListStr.split(';').filter(item => item.trim() !== '');

                    oddsItems.forEach((item, index) => {
                        const fields = item.split('|');
                        if (fields.length > 6) {
                            const winOdds = parseFloat(fields[0]);
                            const drawOdds = parseFloat(fields[1]);
                            const loseOdds = parseFloat(fields[2]);
                            const timeStr = fields[3];
                            const yearStr = fields[7] || matchTime.getFullYear().toString();

                            // 解析时间
                            const timeMatch = timeStr.match(/(\d+)-(\d+)\s+(\d+):(\d+)/);
                            if (timeMatch) {
                                const month = parseInt(timeMatch[1]);
                                const day = parseInt(timeMatch[2]);
                                const hour = parseInt(timeMatch[3]);
                                const minute = parseInt(timeMatch[4]);
                                const year = parseInt(yearStr);

                                const recordTime = new Date(year, month - 1, day, hour, minute, 0);

                                // 计算概率和返还率
                                const total = 1/winOdds + 1/drawOdds + 1/loseOdds;
                                const returnRate = (1 / total) * 100;
                                const winProb = (1 / winOdds) / total * 100;
                                const drawProb = (1 / drawOdds) / total * 100;
                                const loseProb = (1 / loseOdds) / total * 100;

                                oddsRecords.push({
                                    time: recordTime,
                                    winOdds: winOdds,
                                    drawOdds: drawOdds,
                                    loseOdds: loseOdds,
                                    winProb: winProb,
                                    drawProb: drawProb,
                                    loseProb: loseProb,
                                    returnRate: returnRate,
                                    duration: null // 稍后计算
                                });
                            }
                        }
                    });

                    // 按时间排序
                    oddsRecords.sort((a, b) => a.time - b.time);

                    // 计算持续时间
                    for (let i = 0; i < oddsRecords.length - 1; i++) {
                        const currentTime = oddsRecords[i].time.getTime();
                        const nextTime = oddsRecords[i + 1].time.getTime();
                        const durationMs = nextTime - currentTime;
                        oddsRecords[i].duration = durationMs;
                    }

                    // 记录公司最早赔率时间
                    if (oddsRecords.length > 0) {
                        const company = companies.find(c => c.id === companyId);
                        if (company) {
                            company.firstOddsTime = oddsRecords[0].time;
                        }
                    }

                    oddsDetail[companyId] = oddsRecords;
                }
            }
        });

        // 按公司最早赔率时间排序
        companies.sort((a, b) => {
            if (!a.firstOddsTime && !b.firstOddsTime) return 0;
            if (!a.firstOddsTime) return 1;
            if (!b.firstOddsTime) return -1;
            return a.firstOddsTime - b.firstOddsTime;
        });

        // 创建UI
        createUI(companies, oddsDetail, matchTime, homePrevMatchTime, awayPrevMatchTime);
    }

    function createUI(companies, oddsDetail, matchTime, homePrevMatchTime, awayPrevMatchTime) {
        // 找到content div
        const contentDiv = document.getElementById('content');
        if (!contentDiv) {
            alert('没有content div');
            return;
        }

        // 公司列表
        const companyList = document.createElement('div');
        companyList.id = 'compList';
        companyList.style.display = 'flex';
        companyList.style.flexWrap = 'wrap';
        companyList.style.gap = '5px';
        companyList.style.fontSize = '16px';
        companyList.style.textAlign = 'center';

        // 存储选中的公司
        const selectedCompanies = new Set();

        // 红色字体公司列表
        const redCompanies = ['Pinnacle', '1xBet', 'Marathonbet', '18Bet', 'Bet365', 'EasyBets', 'Wewbet', '188Bet', 'HK Jockey Club', 'Vcbet', 'Interwetten', '10BET', '12bet', 'Sbobet'];

        companies.forEach(company => {
            if (!company.name) return;

            const companySpan = document.createElement('span');
            companySpan.style.border = '1px dashed #0170CA';
            companySpan.textContent = company.name;
            companySpan.style.cursor = 'pointer';

            // 检查是否为红色字体公司
            const isRedCompany = redCompanies.includes(company.name);

            if (isRedCompany) {
                companySpan.style.color = '#ff0000';
            }

            // 点击事件
            companySpan.addEventListener('click', function() {
                if (selectedCompanies.has(company.id)) {
                    selectedCompanies.delete(company.id);
                    companySpan.style.backgroundColor = '';
                } else {
                    selectedCompanies.add(company.id);
                    companySpan.style.backgroundColor = '#ffc';
                }
            });

            companyList.appendChild(companySpan);
        });

        // 对比按钮
        const compareBtn = document.createElement('button');
        compareBtn.textContent = '对比选中公司';
        compareBtn.style.padding = '4px 8px';
        compareBtn.style.backgroundColor = '#4CAF50';
        compareBtn.style.color = 'white';
        compareBtn.style.border = 'none';
        compareBtn.style.borderRadius = '4px';
        compareBtn.style.cursor = 'pointer';
        compareBtn.style.fontSize = '16px';

        compareBtn.addEventListener('click', function() {
            if (selectedCompanies.size === 0) {
                alert('请至少选择一家公司');
                return;
            }

            // 移除旧的表格（如果存在）
            const oldTable = document.getElementById('euroTable');
            if (oldTable) {
                oldTable.remove();
            }

            // 创建新表格
            createOddsTable(Array.from(selectedCompanies), companies, oddsDetail, matchTime, homePrevMatchTime, awayPrevMatchTime);
        });

        companyList.appendChild(compareBtn);

        // 插入到content div的第一个元素前
        if (contentDiv.firstChild) {
            contentDiv.insertBefore(companyList, contentDiv.firstChild);
        } else {
            contentDiv.appendChild(companyList);
        }
    }

    function createOddsTable(selectedCompanyIds, allCompanies, oddsDetail, matchTime, homePrevMatchTime, awayPrevMatchTime) {
        // 收集所有赔率记录
        let allRecords = [];

        selectedCompanyIds.forEach(companyId => {
            const company = allCompanies.find(c => c.id === companyId);
            const records = oddsDetail[companyId] || [];

            records.forEach(record => {
                allRecords.push({
                    companyId: companyId,
                    companyName: company ? company.name : companyId,
                    ...record
                });
            });
        });

        // 按时间排序
        allRecords.sort((a, b) => a.time - b.time);

        // 创建表格容器
        const tableContainer = document.createElement('div');
        tableContainer.id = 'euroTable';
        tableContainer.style.overflowX = 'auto';
        tableContainer.style.textAlign = 'center';
        tableContainer.style.fontSize = '16px';

        // 创建表格
        const table = document.createElement('table');
        table.style.margin = '0 auto';
        table.style.borderCollapse = 'collapse';
        table.style.whiteSpace = 'nowrap';

        // 表头
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.style.backgroundColor = '#0170CA';
        headerRow.style.color = 'white';

        const headers = ['公司', '持续时间', '胜概率', '平概率', '负概率', '胜赔', '平赔', '负赔', '返还率', '时间'];

        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.border = '1px solid #888';
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // 表格主体
        const tbody = document.createElement('tbody');

        // 为不同公司分配颜色
        const colorMap = {};
        const colors = [
            '#000000', '#FF0000', '#BBBB00', '#06D6A0', '#118AB2',
            '#EF476F', '#073B4C', '#7209B7', '#F72585', '#3A86FF'
        ];

        selectedCompanyIds.forEach((companyId, index) => {
            colorMap[companyId] = colors[index % colors.length];
        });

        // 插入上一场比赛时间标记
        const specialTimes = [];

        if (homePrevMatchTime) {
            const homeStartTime = new Date(homePrevMatchTime);
            const homeEndTime = new Date(homePrevMatchTime + 2 * 60 * 60 * 1000);
            specialTimes.push({
                time: homeStartTime,
                type: 'home_start',
                label: '主队上一场比赛开始'
            });
            specialTimes.push({
                time: homeEndTime,
                type: 'home_end',
                label: '主队上一场比赛结束'
            });
        }

        if (awayPrevMatchTime) {
            const awayStartTime = new Date(awayPrevMatchTime);
            const awayEndTime = new Date(awayPrevMatchTime + 2 * 60 * 60 * 1000);
            specialTimes.push({
                time: awayStartTime,
                type: 'away_start',
                label: '客队上一场比赛开始'
            });
            specialTimes.push({
                time: awayEndTime,
                type: 'away_end',
                label: '客队上一场比赛结束'
            });
        }

        // 按时间顺序插入所有行（包括特殊时间标记和赔率记录）
        const allTimePoints = [
            ...specialTimes.map(st => ({ ...st, isSpecial: true })),
            ...allRecords.map(record => ({ ...record, isSpecial: false }))
        ];

        // 按时间排序
        allTimePoints.sort((a, b) => a.time.getTime() - b.time.getTime());

        // 生成表格行
        allTimePoints.forEach((item, index) => {
            const row = document.createElement('tr');

            if (item.isSpecial) {
                // 特殊时间标记行
                row.style.backgroundColor = '#ffe';

                const td = document.createElement('td');
                td.colSpan = headers.length;
                td.textContent = `${item.label}: ${formatDate(item.time)}`;
                td.style.border = '1px solid #888';
                row.appendChild(td);
            } else {
                // 赔率数据行
                const companyColor = colorMap[item.companyId];
                row.style.color = companyColor;

                // 公司名
                const companyTd = document.createElement('td');
                companyTd.textContent = item.companyName;
                companyTd.style.border = '1px solid #888';
                row.appendChild(companyTd);

                // 持续时间
                const durationTd = document.createElement('td');
                if (item.duration) {
                    const hours = Math.floor(item.duration / (1000 * 60 * 60));
                    const minutes = Math.floor((item.duration % (1000 * 60 * 60)) / (1000 * 60));

                    let durationText = '';
                    if (hours > 0) durationText += `${hours}时`;
                    if (minutes > 0 || hours === 0) durationText += `${minutes}分`;

                    durationTd.textContent = durationText;
                } else {
                    durationTd.textContent = '';
                }
                durationTd.style.border = '1px solid #888';
                row.appendChild(durationTd);

                // 胜平负概率
                const winProbTd = document.createElement('td');
                winProbTd.textContent = item.winProb.toFixed(2);
                winProbTd.style.border = '1px solid #888';
                row.appendChild(winProbTd);

                const drawProbTd = document.createElement('td');
                drawProbTd.textContent = item.drawProb.toFixed(2);
                drawProbTd.style.border = '1px solid #888';
                row.appendChild(drawProbTd);

                const loseProbTd = document.createElement('td');
                loseProbTd.textContent = item.loseProb.toFixed(2);
                loseProbTd.style.border = '1px solid #888';
                row.appendChild(loseProbTd);

                // 胜平负赔率
                const winOddsTd = document.createElement('td');
                winOddsTd.textContent = item.winOdds;
                winOddsTd.style.border = '1px solid #888';
                row.appendChild(winOddsTd);

                const drawOddsTd = document.createElement('td');
                drawOddsTd.textContent = item.drawOdds;
                drawOddsTd.style.border = '1px solid #888';
                row.appendChild(drawOddsTd);

                const loseOddsTd = document.createElement('td');
                loseOddsTd.textContent = item.loseOdds;
                loseOddsTd.style.border = '1px solid #888';
                row.appendChild(loseOddsTd);

                // 返还率
                const returnRateTd = document.createElement('td');
                returnRateTd.textContent = item.returnRate.toFixed(2) + '%';
                returnRateTd.style.border = '1px solid #888';
                row.appendChild(returnRateTd);

                // 时间
                const timeTd = document.createElement('td');
                timeTd.textContent = formatDate(item.time);
                timeTd.style.border = '1px solid #888';
                row.appendChild(timeTd);

                // 检查是否在上一场比赛期间
                if (isDuringPreviousMatches(item.time, homePrevMatchTime, awayPrevMatchTime)) {
                    row.style.backgroundColor = '#ffe';
                }
            }

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        tableContainer.appendChild(table);

        // 插入到compList下面
        const compListDiv = document.getElementById('compList');
        if (compListDiv) {
            compListDiv.parentNode.insertBefore(tableContainer, compListDiv.nextSibling);
        }
    }

    function formatDate(date) {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${month}/${day} ${hours}:${minutes}`;
    }

    function isDuringPreviousMatches(checkTime, homePrevMatchTime, awayPrevMatchTime) {
        const checkTimeMs = checkTime.getTime();

        // 检查是否在主队上一场比赛期间
        if (homePrevMatchTime) {
            const homeStart = homePrevMatchTime;
            const homeEnd = homePrevMatchTime + 2 * 60 * 60 * 1000;

            if (checkTimeMs >= homeStart && checkTimeMs <= homeEnd) {
                return true;
            }
        }

        // 检查是否在客队上一场比赛期间
        if (awayPrevMatchTime) {
            const awayStart = awayPrevMatchTime;
            const awayEnd = awayPrevMatchTime + 2 * 60 * 60 * 1000;

            if (checkTimeMs >= awayStart && checkTimeMs <= awayEnd) {
                return true;
            }
        }

        return false;
    }
})();