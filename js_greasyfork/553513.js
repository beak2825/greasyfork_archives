// ==UserScript==
// @name         新球体育网亚盘分析
// @namespace    http://dol.freevar.com/
// @version      0.6
// @description  新球体育网（球探）手机端网页，比赛的分析页面根据开盘时间列出各家公司，勾选所需公司后点击按钮生成表格，通过各家公司的让球走势分析赛果。
// @author       Dolphin
// @match        https://m.titan007.com/Analy/Analysis/*
// @match        https://m.titan007.com/analy/Analysis/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553513/%E6%96%B0%E7%90%83%E4%BD%93%E8%82%B2%E7%BD%91%E4%BA%9A%E7%9B%98%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/553513/%E6%96%B0%E7%90%83%E4%BD%93%E8%82%B2%E7%BD%91%E4%BA%9A%E7%9B%98%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 公司映射
    const companyMap = {
        '澳门': 1,
        'Bet365': 8,
        '易胜博': 12,
        '伟德': 14,
        '明陞': 17,
        '金宝博': 23,
        '12Bet': 24,
        '利记': 31,
        '盈禾': 35,
        '18Bet': 42,
        '平博': 47,
        '香港': 48,
        '威廉': 9,
        'Inter': 19,
        '1xBet': 50
    };

    // 选中的公司数组
    let selectedComp = [];
    // 存储所有公司的赔率数据
    let allCompanyOdds = {};

    // 主函数
    async function main() {
        try {
            // 获取所有公司的赔率数据
            await fetchAllCompanyOdds();

            // 计算每个公司最早的开盘时间
            const earliestTimes = calculateEarliestTimes();

            // 创建并插入公司表格
            createCompanyTable(earliestTimes);

            // 添加对比按钮
            addCompareButton();
        } catch (error) {
            console.error('脚本执行出错:', error);
        }
    }

    // 获取所有公司的赔率数据
    async function fetchAllCompanyOdds() {
        const promises = [];

        for (const [companyName, companyId] of Object.entries(companyMap)) {
            const promise = fetchCompanyOdds(companyId, companyName)
                .then(data => {
                    if (data && data.length > 0) {
                        // 只保留"HappenTime":""的数据
                        const filteredData = data.filter(item => item.HappenTime === "");

                        if (filteredData.length > 0) {
                            // 为每条数据添加持续时间
                            const dataWithDuration = calculateDurationForCompany(filteredData);
                            allCompanyOdds[companyName] = dataWithDuration;
                        }
                    }
                })
                .catch(error => {
                    console.error(`获取${companyName}数据失败:`, error);
                    alert(`获取${companyName}数据失败: ${error.message}`);
                });

            promises.push(promise);
        }

        await Promise.all(promises);
    }

    // 获取单个公司的赔率数据
    async function fetchCompanyOdds(companyId, companyName) {
        const url = `/HandicapDataInterface.ashx?scheid=${scheduleId}&type=3&oddskind=0&companyid=${companyId}&isHalf=0`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    // 为单个公司的赔率数据计算持续时间
    function calculateDurationForCompany(oddsData) {
        if (!oddsData || oddsData.length === 0) return [];

        // 按时间升序排序（最旧的在前面）
        const sortedData = [...oddsData].sort((a, b) => {
            const timeA = parseModifyTime(a.ModifyTime);
            const timeB = parseModifyTime(b.ModifyTime);
            return timeA - timeB;
        });

        // 为每条数据计算持续时间（最后一条没有持续时间）
        for (let i = 0; i < sortedData.length - 1; i++) {
            const currentTime = parseModifyTime(sortedData[i].ModifyTime);
            const nextTime = parseModifyTime(sortedData[i + 1].ModifyTime);

            if (currentTime && nextTime) {
                const durationMs = nextTime - currentTime; // 较新时间减去较旧时间
                const hours = Math.floor(durationMs / (1000 * 60 * 60));
                const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

                sortedData[i].Duration = { hours, minutes };
            }
        }

        // 按时间降序返回（最新的在前面）
        return sortedData.reverse();
    }

    // 解析ModifyTime字符串为Date对象
    function parseModifyTime(timeStr) {
        if (!timeStr || timeStr.length !== 14) return null;

        const year = parseInt(timeStr.substring(0, 4));
        const month = parseInt(timeStr.substring(4, 6)) - 1;
        const day = parseInt(timeStr.substring(6, 8));
        const hour = parseInt(timeStr.substring(8, 10));
        const minute = parseInt(timeStr.substring(10, 12));
        const second = parseInt(timeStr.substring(12, 14));

        return new Date(year, month, day, hour, minute, second);
    }

    // 计算每个公司最早的开盘时间
    function calculateEarliestTimes() {
        const earliestTimes = {};

        for (const [companyName, oddsData] of Object.entries(allCompanyOdds)) {
            if (oddsData && oddsData.length > 0) {
                // 由于数据已经是时间降序，最后一条是最早的
                const earliestOdds = oddsData[oddsData.length - 1];
                if (earliestOdds && earliestOdds.ModifyTime) {
                    earliestTimes[companyName] = parseModifyTime(earliestOdds.ModifyTime);
                }
            }
        }

        return earliestTimes;
    }

    // 获取比赛时间
    function getMatchTimes() {
        const matchTimes = [];

        try {
            // 主队上一场比赛时间
            if (jsonData.nearMatches.homeMatches.matches[0].matchTime) {
                const homeMatchTime = parseInt(jsonData.nearMatches.homeMatches.matches[0].matchTime);
                if (homeMatchTime) {
                    matchTimes.push({
                        type: 'home_start',
                        time: new Date(homeMatchTime * 1000),
                        label: '主队比赛开始'
                    });

                    matchTimes.push({
                        type: 'home_end',
                        time: new Date(homeMatchTime * 1000 + 2 * 60 * 60 * 1000),
                        label: '主队比赛结束'
                    });
                }
            }

            // 客队上一场比赛时间
            if (jsonData.nearMatches.awayMatches.matches[0].matchTime) {
                const awayMatchTime = parseInt(jsonData.nearMatches.awayMatches.matches[0].matchTime);
                if (awayMatchTime) {
                    matchTimes.push({
                        type: 'away_start',
                        time: new Date(awayMatchTime * 1000),
                        label: '客队比赛开始'
                    });

                    matchTimes.push({
                        type: 'away_end',
                        time: new Date(awayMatchTime * 1000 + 2 * 60 * 60 * 1000),
                        label: '客队比赛结束'
                    });
                }
            }
        } catch (error) {
            console.error('获取比赛时间失败:', error);
        }

        return matchTimes;
    }

    // 检查时间是否在比赛期间内
    function isInMatchPeriod(time) {
        const matchTimes = getMatchTimes();

        for (const matchTime of matchTimes) {
            if (matchTime.type.includes('start')) {
                const startTime = matchTime.time;
                const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);

                if (time >= startTime && time <= endTime) {
                    return true;
                }
            }
        }

        return false;
    }

    // 格式化日期为"月/日 时:分"
    function formatDateToDMHM(date) {
        if (!date) return '';
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${month}/${day} ${hours}:${minutes}`;
    }

    // 格式化持续时间为"x时x分"
    function formatDuration(duration) {
        if (!duration) return '';
        if (duration.hours === 0) {
            return `${duration.minutes}分`;
        }
        return `${duration.hours}时${duration.minutes}分`;
    }

    // 创建公司表格
    function createCompanyTable(earliestTimes) {
        const contentDiv = document.querySelector('div#content');
        if (!contentDiv) return;

        // 获取所有时间点
        const allTimePoints = [];

        // 添加公司时间点
        for (const [companyName, time] of Object.entries(earliestTimes)) {
            allTimePoints.push({
                type: 'company',
                time: time,
                company: companyName
            });
        }

        // 添加比赛时间点
        const matchTimes = getMatchTimes();
        matchTimes.forEach(matchTime => {
            allTimePoints.push({
                type: 'match_event',
                time: matchTime.time,
                label: matchTime.label
            });
        });

        // 按时间降序排序
        allTimePoints.sort((a, b) => b.time - a.time);

        // 创建表格容器
        const container = document.createElement('div');
        container.style.textAlign = 'center';
        container.id = 'compListDiv';

        // 创建表格
        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.style.fontSize = '16px';
        table.style.margin = '0 auto';

        // 创建表格行
        allTimePoints.forEach(point => {
            const row = table.insertRow();

            // 检查是否在比赛期间内
            if (isInMatchPeriod(point.time)) {
                row.style.backgroundColor = '#ffd';
            }

            // 时间单元格
            const timeCell = row.insertCell();
            timeCell.style.border = '1px solid #888';
            timeCell.textContent = formatDateToDMHM(point.time);

            if (point.type === 'company') {
                // 公司单元格
                const companyCell = row.insertCell();
                companyCell.style.border = '1px solid #888';
                companyCell.textContent = point.company;

                // 复选框单元格
                const checkboxCell = row.insertCell();
                checkboxCell.style.border = '1px solid #888';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.style.position = 'initial';

                checkbox.addEventListener('change', function() {
                    if (this.checked) {
                        if (!selectedComp.includes(point.company)) {
                            selectedComp.push(point.company);
                        }
                    } else {
                        const index = selectedComp.indexOf(point.company);
                        if (index > -1) {
                            selectedComp.splice(index, 1);
                        }
                    }
                });

                checkboxCell.appendChild(checkbox);
            } else {
                // 比赛事件行
                const eventCell = row.insertCell();
                eventCell.style.border = '1px solid #888';
                eventCell.colSpan = 2;
                eventCell.textContent = point.label;
            }
        });

        container.appendChild(table);
        contentDiv.insertBefore(container, contentDiv.firstChild);
    }

    // 添加对比按钮
    function addCompareButton() {
        const contentDiv = document.querySelector('div#compListDiv');
        if (!contentDiv) return;

        const compareButton = document.createElement('button');
        compareButton.textContent = '对比选中公司';
        compareButton.style.padding = '4px 8px';
        compareButton.style.fontSize = '16px';
        compareButton.style.cursor = 'pointer';
        compareButton.style.backgroundColor = '#4CAF50';
        compareButton.style.color = 'white';
        compareButton.style.border = 'none';
        compareButton.style.borderRadius = '4px';
        compareButton.style.margin = '5px';

        compareButton.addEventListener('click', function() {
            if (selectedComp.length === 0) {
                alert('请先勾选要对比的公司');
                return;
            }

            // 移除已存在的对比表格
            const existingTable = document.getElementById('oddsComparisonTable');
            if (existingTable) {
                existingTable.remove();
            }

            // 创建对比表格
            createComparisonTable();
        });

        contentDiv.appendChild(compareButton);
    }

    // 创建对比表格
    function createComparisonTable() {
        // 收集所有时间点
        const allTimePoints = [];

        // 收集所有公司的赔率时间点
        for (const companyName of selectedComp) {
            const oddsData = allCompanyOdds[companyName];
            if (oddsData) {
                oddsData.forEach(odd => {
                    if (odd.ModifyTime) {
                        const time = parseModifyTime(odd.ModifyTime);
                        if (time) {
                            const timeKey = time.getTime();
                            if (!allTimePoints[timeKey]) {
                                allTimePoints[timeKey] = {
                                    time: time,
                                    data: {}
                                };
                            }
                            allTimePoints[timeKey].data[companyName] = odd;
                        }
                    }
                });
            }
        }

        // 添加比赛时间点
        const matchTimes = getMatchTimes();
        matchTimes.forEach(matchTime => {
            const timeKey = matchTime.time.getTime();
            if (!allTimePoints[timeKey]) {
                allTimePoints[timeKey] = {
                    time: matchTime.time,
                    data: {},
                    matchEvent: matchTime.label
                };
            }
        });

        // 将时间点转换为数组并按时间降序排序
        const sortedTimePoints = Object.values(allTimePoints).sort((a, b) => b.time - a.time);

        // 创建滚动容器
        const scrollContainer = document.createElement('div');
        scrollContainer.id = 'oddsComparisonTable';
        scrollContainer.style.overflowX = 'auto';
        scrollContainer.style.textAlign = 'center';
        scrollContainer.style.fontSize = '16px';

        // 创建表格
        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.style.whiteSpace = 'nowrap';
        table.style.margin = '0 auto';

        // 创建表头
        const thead = document.createElement('thead');
        const headerRow = thead.insertRow();
        headerRow.style.backgroundColor = '#def';

        // 添加时间列
        const timeHeader = document.createElement('th');
        timeHeader.textContent = '时间';
        timeHeader.style.border = '1px solid #888';
        headerRow.appendChild(timeHeader);

        // 添加持续时间列（只针对第一个选择的公司）
        if (selectedComp.length > 0) {
            const firstCompany = selectedComp[0];
            const durationHeader = document.createElement('th');
            durationHeader.textContent = `${firstCompany}持续`;
            durationHeader.style.border = '1px solid #888';
            headerRow.appendChild(durationHeader);
        }

        // 为每个选中的公司添加两列：让球数和差值
        selectedComp.forEach(companyName => {
            // 让球数列
            const panKouHeader = document.createElement('th');
            panKouHeader.textContent = `${companyName}让球`;
            panKouHeader.style.border = '1px solid #888';
            headerRow.appendChild(panKouHeader);

            // AwayOdds-HomeOdds差值列
            const oddsDiffHeader = document.createElement('th');
            oddsDiffHeader.textContent = `${companyName}水差`;
            oddsDiffHeader.style.border = '1px solid #888';
            headerRow.appendChild(oddsDiffHeader);
        });

        table.appendChild(thead);

        // 创建表格主体
        const tbody = document.createElement('tbody');

        // 创建表格行
        sortedTimePoints.forEach((timePoint, index) => {
            const row = tbody.insertRow();

            // 检查是否在比赛期间内
            if (isInMatchPeriod(timePoint.time)) {
                row.style.backgroundColor = '#ffd';
            }

            // 时间单元格
            const timeCell = row.insertCell();
            timeCell.style.border = '1px solid #888';
            timeCell.textContent = formatDateToDMHM(timePoint.time);

            // 持续时间单元格（只针对第一个选择的公司）
            if (selectedComp.length > 0) {
                const firstCompany = selectedComp[0];
                const durationCell = row.insertCell();
                durationCell.style.border = '1px solid #888';

                const companyData = timePoint.data[firstCompany];
                if (companyData && companyData.Duration) {
                    durationCell.textContent = formatDuration(companyData.Duration);
                }
            }

            // 为每个选中的公司添加数据单元格
            selectedComp.forEach(companyName => {
                const companyData = timePoint.data[companyName];

                // 让球数单元格
                const panKouCell = row.insertCell();
                panKouCell.style.border = '1px solid #888';
                if (companyData && companyData.PanKou) {
                    panKouCell.textContent = companyData.PanKou + '⚽';
                }

                // 差值单元格
                const oddsDiffCell = row.insertCell();
                oddsDiffCell.style.border = '1px solid #888';
                if (companyData && companyData.AwayOdds && companyData.HomeOdds) {
                    const awayOdds = parseFloat(companyData.AwayOdds);
                    const homeOdds = parseFloat(companyData.HomeOdds);
                    if (!isNaN(awayOdds) && !isNaN(homeOdds)) {
                        const diff = awayOdds - homeOdds;
                        oddsDiffCell.textContent = diff.toFixed(2);
                    }
                }
            });
        });

        table.appendChild(tbody);
        scrollContainer.appendChild(table);

        // 插入到对比按钮后面
        const buttonContainer = document.querySelector('div#compListDiv');
        buttonContainer.parentNode.insertBefore(scrollContainer, buttonContainer.nextSibling);
    }

    main();
})();