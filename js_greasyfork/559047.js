// ==UserScript==
// @name         新球体育网欧赔对比
// @namespace    http://dol.freevar.com/
// @version      0.4
// @description  揾出边间公司揸fit！
// @author       Dolphin
// @match        https://m.titan007.com/info/*
// @match        https://m.titan007.com/Analy/Analysis/*
// @match        https://m.titan007.com/analy/Analysis/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559047/%E6%96%B0%E7%90%83%E4%BD%93%E8%82%B2%E7%BD%91%E6%AC%A7%E8%B5%94%E5%AF%B9%E6%AF%94.user.js
// @updateURL https://update.greasyfork.org/scripts/559047/%E6%96%B0%E7%90%83%E4%BD%93%E8%82%B2%E7%BD%91%E6%AC%A7%E8%B5%94%E5%AF%B9%E6%AF%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 当前比赛欧赔缓存
    let currentOddsCache = {};

    // 工具函数
    const utils = {
        // 解析比赛时间
        parseMatchTime: function(timeStr) {
            const parts = timeStr.split(',');
            const date = new Date(
                parseInt(parts[0]),
                parseInt(parts[1]) - 1,
                parseInt(parts[2]),
                parseInt(parts[3]),
                parseInt(parts[4]),
                parseInt(parts[5])
            );
            date.setHours(date.getHours() + 8);
            return date;
        },

        // 解析赔率数据
        parseOddsData: function(gameDetailStr, gameStr, oddsTime) {
            const companies = {};

            // 解析公司信息
            const companyMatch = gameStr.match(/Array\(([\s\S]*?)\);/);
            if (companyMatch && companyMatch[1]) {
                const companyData = companyMatch[1].slice(1, -1).split('","');
                companyData.forEach(item => {
                    const fields = item.split('|');
                    if (fields.length >= 3) {
                        companies[fields[1]] = fields[2];
                    }
                });
            }

            // 解析详细赔率
            const detailMatch = gameDetailStr.match(/Array\(([\s\S]*?)\);/);
            if (!detailMatch || !detailMatch[1]) return {};

            const result = {};
            const detailData = detailMatch[1].slice(1, -1).split('","');

            detailData.forEach(item => {
                if (!item.includes('^')) return;

                const [companyId, oddsStr] = item.split('^');
                const oddsList = oddsStr.split(';').filter(odds => odds);

                let latestOdds = null;
                let latestTime = null;

                // 找出不超过oddsTime的最新赔率
                for (const oddsItem of oddsList) {
                    const oddsFields = oddsItem.split('|');
                    if (oddsFields.length < 8) continue;

                    const monthDayTime = oddsFields[3];
                    const year = oddsFields[7] || 2025;
                    const [monthDay, hourMinute] = monthDayTime.split(' ');
                    const [month, day] = monthDay.split('-');
                    const [hour, minute] = hourMinute.split(':');

                    const oddsDateTime = new Date(
                        parseInt(year),
                        parseInt(month) - 1,
                        parseInt(day),
                        parseInt(hour),
                        parseInt(minute)
                    );

                    if (oddsDateTime <= oddsTime && (!latestTime || oddsDateTime > latestTime)) {
                        latestTime = oddsDateTime;
                        latestOdds = {
                            win: parseFloat(oddsFields[0]),
                            draw: parseFloat(oddsFields[1]),
                            lose: parseFloat(oddsFields[2]),
                            time: oddsDateTime
                        };
                    }
                }

                if (latestOdds) {
                    const companyName = companies[companyId] || companyId;
                    result[companyName] = latestOdds;
                }
            });

            return result;
        },

        // 计算概率
        calculateProbabilities: function(win, draw, lose) {
            const winProb = (1 / win) / (1 / win + 1 / draw + 1 / lose);
            const drawProb = (1 / draw) / (1 / win + 1 / draw + 1 / lose);
            const loseProb = (1 / lose) / (1 / win + 1 / draw + 1 / lose);

            return {
                win: winProb,
                draw: drawProb,
                lose: loseProb
            };
        },

        // 计算准确度
        calculateAccuracy: function(probabilities, homeScore, guestScore) {
            const scoreDiff = homeScore - guestScore;

            if (scoreDiff === 0) {
                return probabilities.draw;
            } else if (Math.abs(scoreDiff) === 1) {
                const targetProb = scoreDiff > 0 ? probabilities.win : probabilities.lose;
                return 1 - Math.abs(targetProb - 0.6);
            } else if (Math.abs(scoreDiff) === 2) {
                const targetProb = scoreDiff > 0 ? probabilities.win : probabilities.lose;
                return 1 - Math.abs(targetProb - 0.8);
            } else {
                const targetProb = scoreDiff > 0 ? probabilities.win : probabilities.lose;
                return targetProb;
            }
        },

        // 获取赔率数据
        fetchOddsData: function(scheduleId, preMatchHour) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://txt.titan007.com/1x2/${scheduleId}.js`,
                    timeout: 10000,
                    onload: function(response) {
                        if (response.status !== 200) {
                            reject(new Error(`请求失败，状态码: ${response.status}`));
                            return;
                        }

                        if (!response.responseText) {
                            reject(new Error('没有公司开盘'));
                            return;
                        }

                        try {
                            const responseText = response.responseText;
                            const matchTimeMatch = responseText.match(/MatchTime="([\s\S]*?)";/);
                            if (!matchTimeMatch[1]) {
                                reject(new Error('没有比赛时间'));
                                return;
                            }

                            const matchTime = utils.parseMatchTime(matchTimeMatch[1]);
                            const oddsTime = new Date(matchTime);
                            oddsTime.setHours(oddsTime.getHours() - preMatchHour);

                            const gameMatch = responseText.match(/game=Array\(([\s\S]*?)\);/);
                            const gameDetailMatch = responseText.match(/gameDetail=Array\(([\s\S]*?)\);/);

                            if (!gameMatch[1] || !gameDetailMatch[1]) {
                                reject(new Error('没有欧赔数据'));
                                return;
                            }

                            const oddsData = utils.parseOddsData(gameDetailMatch[0], gameMatch[0], oddsTime);
                            if (Object.keys(oddsData).length === 0) {
                                reject(new Error('在你指定的时间前没有公司开盘'));
                                return;
                            }

                            resolve(oddsData);
                        } catch (error) {
                            alert(error.message);
                            reject(error);
                        }
                    },
                    onerror: function(error) {
                        alert('网络请求失败: ' + error);
                        reject(new Error('网络请求失败: ' + error));
                    }
                });
            });
        }
    };

    // UI组件
    const UI = {
        // 创建按钮
        createButton: function(id, text, color) {
            const button = document.createElement('button');
            button.id = id;
            button.textContent = text;
            button.style.cssText = `
                margin: 5px 5px 0 0;
                padding: 2px 6px;
                font-size: 16px;
                background: ${color};
                color: white;
                cursor: pointer;
            `;
            return button;
        },

        // 创建输入框
        createInput: function() {
            const input = document.createElement('input');
            input.type = 'number';
            input.id = 'preMatchHour';
            input.value = localStorage.getItem('preMatchHour') || 24;
            input.style.cssText = `
                font-size: 18px;
                width: 50px;
                border: 1px solid #0170CA;
                text-align: center;
                margin: 0 5px 5px 0;
            `;
            return input;
        },

        // 创建控制面板
        createControlPanel: function() {
            const contentDiv = document.getElementById('content');
            if (!contentDiv || document.getElementById('controlPanel')) return;

            const panel = document.createElement('div');
            panel.id = 'controlPanel';
            panel.style.textAlign = 'right';

            // 创建组件
            const clearBtn = this.createButton('clearBtn', '清除', '#ff6b6b');
            const statsBtn = this.createButton('statsBtn', '统计', '#4CAF50');
            const input = this.createInput();

            // 标签
            const label = document.createElement('span');
            label.textContent = '赛前小时:';

            panel.appendChild(clearBtn);
            panel.appendChild(label);
            panel.appendChild(input);
            panel.appendChild(statsBtn);

            // 分析页面额外按钮
            if (location.href.includes('/Analysis/')) {
                const oddsBtn = this.createButton('oddsBtn', '欧赔', '#2196F3');
                const compareBtn = this.createButton('compareBtn', '对比', '#FF9800');
                panel.appendChild(oddsBtn);
                panel.appendChild(compareBtn);
            }

            // 插入到页面
            contentDiv.insertBefore(panel, contentDiv.firstChild);

            // 绑定事件
            this.bindEvents();
        },

        // 绑定事件
        bindEvents: function() {
            document.getElementById('clearBtn')?.addEventListener('click', Stats.clear);
            document.getElementById('statsBtn')?.addEventListener('click', Stats.start);
            document.getElementById('oddsBtn')?.addEventListener('click', Stats.getOdds);
            document.getElementById('compareBtn')?.addEventListener('click', Stats.compare);
        }
    };

    // 统计功能
    const Stats = {
        // 清除数据
        clear: function() {
            if (confirm('确定删除所有已统计数据？')) {
                localStorage.removeItem('euroStats');
                localStorage.removeItem('preMatchHour');
            }
        },

        // 开始统计
        start: async function() {
            const btn = document.getElementById('statsBtn');
            const preMatchHour = parseInt(document.getElementById('preMatchHour').value);

            if (isNaN(preMatchHour)) {
                alert('请输入需要统计赛前多少小时的欧赔');
                return;
            }

            // 保存设置
            localStorage.setItem('preMatchHour', preMatchHour);

            // 禁用按钮
            btn.disabled = true;
            btn.textContent = '0/0';

            try {
                const matches = Stats.getMatches();
                if (matches.length === 0) {
                    alert('没有完场的比赛');
                    return;
                }

                // 获取现有数据
                let euroStats = JSON.parse(localStorage.getItem('euroStats') || '{}');

                // 处理每场比赛
                for (let i = 0; i < matches.length; i++) {
                    const match = matches[i];
                    btn.textContent = `${i + 1}/${matches.length}`;

                    try {
                        const oddsData = await utils.fetchOddsData(match.scheduleId, preMatchHour);

                        // 计算每个公司的准确度
                        Object.entries(oddsData).forEach(([companyName, odds]) => {
                            const probabilities = utils.calculateProbabilities(odds.win, odds.draw, odds.lose);
                            const accuracy = utils.calculateAccuracy(probabilities, match.homeScore, match.guestScore);

                            // 保存数据
                            if (!euroStats[companyName]) {
                                euroStats[companyName] = {};
                            }
                            euroStats[companyName][match.scheduleId] = accuracy;
                        });
                    } catch (error) {
                        alert(`处理比赛 ${match.scheduleId} 时出错: ${error.message}`);
                    }
                }

                // 保存统计结果
                localStorage.setItem('euroStats', JSON.stringify(euroStats));

                if (matches.length > 1) {
                    alert(`已统计 ${matches.length} 场比赛`);
                }
            } catch (error) {
                alert('统计过程中出错: ' + error.message);
            } finally {
                btn.disabled = false;
                btn.textContent = '统计';
            }
        },

        // 获取比赛数据
        getMatches: function() {
            if (location.href.includes('/info/')) {
                // 信息页面：获取所有比赛
                const matches = [];
                const redSpans = document.querySelectorAll('span[style*="color:red"], span.red');

                redSpans.forEach(span => {
                    const tr = span.closest('tr');
                    if (!tr) return;

                    // 获取比分
                    const scoreText = span.textContent.trim();
                    const scoreMatch = scoreText.match(/(\d+):(\d+)/);
                    if (!scoreMatch) return;

                    const homeScore = parseInt(scoreMatch[1]);
                    const guestScore = parseInt(scoreMatch[2]);

                    // 获取比赛ID
                    const onclickAttr = tr.getAttribute('onclick');
                    const match = onclickAttr?.match(/ToAnaly\((\d+)/);
                    const scheduleId = match ? match[1] : null;

                    if (scheduleId) {
                        matches.push({ scheduleId, homeScore, guestScore });
                    }
                });

                return matches;
            } else {
                // 分析页面：获取当前比赛
                const homeScoreEl = document.getElementById('homeScore');
                const guestScoreEl = document.getElementById('guestScore');

                if (!homeScoreEl || !guestScoreEl) {
                    alert('没有比分！');
                    return [];
                }

                const homeScore = parseInt(homeScoreEl.textContent);
                const guestScore = parseInt(guestScoreEl.textContent);

                if (!isNaN(homeScore) && !isNaN(guestScore)) {
                    return [{ scheduleId, homeScore, guestScore }];
                }

                return [];
            }
        },

        // 获取欧赔数据
        getOdds: async function() {
            const btn = document.getElementById('oddsBtn');
            const preMatchHour = parseInt(document.getElementById('preMatchHour').value);

            if (typeof scheduleId === 'undefined') {
                alert('未找到比赛ID');
                return;
            }

            if (isNaN(preMatchHour)) {
                alert('请输入需要获取赛前多少小时的欧赔');
                return;
            }

            btn.disabled = true;
            btn.textContent = '加载中';

            try {
                const oddsData = await utils.fetchOddsData(scheduleId, preMatchHour);

                // 计算概率并缓存
                currentOddsCache = {};
                Object.entries(oddsData).forEach(([companyName, odds]) => {
                    currentOddsCache[companyName] = utils.calculateProbabilities(odds.win, odds.draw, odds.lose);
                });

                // 显示表格
                Stats.displayOddsTable(oddsData);
            } catch (error) {
                alert('获取欧赔数据时出错: ' + error.message);
            } finally {
                btn.disabled = false;
                btn.textContent = '欧赔';
            }
        },

        // 显示欧赔表格
        displayOddsTable: function(oddsData) {
            // 移除旧表格
            document.getElementById('oddsTable')?.remove();

            // 创建表格
            const table = document.createElement('table');
            table.id = 'oddsTable';
            table.style.cssText = `
                margin: 0px auto;
                border-collapse: collapse;
                text-align: center;
                font-size: 16px;
            `;

            // 表头
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr style="background: #4CAF50; color: white;">
                    <th style="border: 1px solid #888;">公司</th>
                    <th style="border: 1px solid #888;">胜概率</th>
                    <th style="border: 1px solid #888;">平概率</th>
                    <th style="border: 1px solid #888;">负概率</th>
                    <th style="border: 1px solid #888;">时间</th>
                </tr>
            `;
            table.appendChild(thead);

            // 表格内容
            const tbody = document.createElement('tbody');

            Object.entries(oddsData).forEach(([companyName, odds]) => {
                const probabilities = currentOddsCache[companyName];
                const month = odds.time.getMonth() + 1;
                const day = odds.time.getDate();
                const hours = odds.time.getHours().toString().padStart(2, '0');
                const minutes = odds.time.getMinutes().toString().padStart(2, '0');
                const timeStr = `${month}/${day} ${hours}:${minutes}`;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td style="border: 1px solid #888;">${companyName}</td>
                    <td style="border: 1px solid #888;">${(probabilities.win * 100).toFixed(2)}</td>
                    <td style="border: 1px solid #888;">${(probabilities.draw * 100).toFixed(2)}</td>
                    <td style="border: 1px solid #888;">${(probabilities.lose * 100).toFixed(2)}</td>
                    <td style="border: 1px solid #888;">${timeStr}</td>
                `;
                tbody.appendChild(row);
            });

            table.appendChild(tbody);

            // 插入到页面
            const controlPanel = document.getElementById('controlPanel');
            controlPanel.parentNode.insertBefore(table, controlPanel.nextSibling);
        },

        // 对比功能
        compare: function() {
            const btn = document.getElementById('compareBtn');
            const euroStats = JSON.parse(localStorage.getItem('euroStats') || '{}');

            if (Object.keys(euroStats).length === 0) {
                alert('暂无统计数据，请先进行统计');
                return;
            }

            btn.disabled = true;
            btn.textContent = '计算中';

            try {
                // 获取所有公司
                const companies = Object.keys(euroStats);

                // 计算组合
                const combinations = [];

                for (let i = 0; i < companies.length; i++) {
                    for (let j = i + 1; j < companies.length; j++) {
                        const company1 = companies[i];
                        const company2 = companies[j];

                        let count1 = 0; // 公司1比公司2准的次数
                        let count2 = 0; // 公司2比公司1准的次数
                        let commonMatches = 0; // 共同开盘场次

                        const matches1 = euroStats[company1];
                        const matches2 = euroStats[company2];

                        // 统计共同开盘的比赛
                        Object.keys(matches1).forEach(matchId => {
                            if (matches2[matchId] !== undefined) {
                                commonMatches++;
                                if (matches1[matchId] > matches2[matchId]) {
                                    count1++;
                                } else if (matches2[matchId] > matches1[matchId]) {
                                    count2++;
                                }
                            }
                        });

                        // 只保留有共同开盘且一方优势明显的组合
                        if (commonMatches > 0 && count1 !== count2) {
                            if (count1 > count2) {
                                combinations.push({
                                    company1,
                                    company2,
                                    winCount: count1,
                                    commonMatches,
                                    winner: company1
                                });
                            } else {
                                combinations.push({
                                    company1: company2,
                                    company2: company1,
                                    winCount: count2,
                                    commonMatches,
                                    winner: company2
                                });
                            }
                        }
                    }
                }

                // 排序并取前10
                combinations.sort((a, b) => b.winCount - a.winCount);
                const topCombinations = combinations.slice(0, 10);

                if (topCombinations.length === 0) {
                    alert('没有找到有效的对比数据');
                    return;
                }

                // 显示对比表格
                Stats.displayCompareTable(topCombinations);
            } catch (error) {
                alert('对比过程中出错: ' + error.message);
            } finally {
                btn.disabled = false;
                btn.textContent = '对比';
            }
        },

        // 显示对比表格
        displayCompareTable: function(combinations) {
            // 移除旧表格
            document.getElementById('compareTable')?.remove();

            // 创建表格
            const table = document.createElement('table');
            table.id = 'compareTable';
            table.style.cssText = `
                margin: 5px auto;
                border-collapse: collapse;
                text-align: center;
                font-size: 16px;
            `;

            // 表头
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr style="background: #0170CA; color: white;">
                    <th style="border: 1px solid #888;">公司</th>
                    <th style="border: 1px solid #888;">胜概率</th>
                    <th style="border: 1px solid #888;">平概率</th>
                    <th style="border: 1px solid #888;">负概率</th>
                    <th style="border: 1px solid #888;">准</th>
                    <th style="border: 1px solid #888;">共</th>
                    <th style="border: 1px solid #888;">准确率</th>
                </tr>
            `;
            table.appendChild(thead);

            // 表格内容
            const tbody = document.createElement('tbody');

            combinations.forEach((combo, index) => {
                // 获取概率数据
                const prob1 = currentOddsCache[combo.company1];
                const prob2 = currentOddsCache[combo.company2];

                // 计算胜率
                const winRate = ((combo.winCount / combo.commonMatches) * 100).toFixed(2);

                // 第一行：公司1
                const row1 = document.createElement('tr');

                // 概率较高的单元格设置背景色
                let winProbStyle1 = '';
                let drawProbStyle1 = '';
                let loseProbStyle1 = '';
                if (prob1 && prob2) {
                    if (prob1.win > prob2.win) {
                        winProbStyle1 = 'background-color: #fdd;';
                    }
                    if (prob1.draw > prob2.draw) {
                        drawProbStyle1 = 'background-color: #fdd;';
                    }
                    if (prob1.lose > prob2.lose) {
                        loseProbStyle1 = 'background-color: #fdd;';
                    }
                }

                row1.innerHTML = `
                    <td style="border: 1px solid #888;">${combo.company1}</td>
                    <td style="border: 1px solid #888; ${winProbStyle1}">${prob1 ? (prob1.win * 100).toFixed(2) : '没开盘'}</td>
                    <td style="border: 1px solid #888; ${drawProbStyle1}">${prob1 ? (prob1.draw * 100).toFixed(2) : '没开盘'}</td>
                    <td style="border: 1px solid #888; ${loseProbStyle1}">${prob1 ? (prob1.lose * 100).toFixed(2) : '没开盘'}</td>
                    <td style="border: 1px solid #888;" rowspan="2">${combo.winCount}</td>
                    <td style="border: 1px solid #888;" rowspan="2">${combo.commonMatches}</td>
                    <td style="border: 1px solid #888;" rowspan="2">${winRate}%</td>
                `;
                tbody.appendChild(row1);

                // 第二行：公司2
                const row2 = document.createElement('tr');
                row2.innerHTML = `
                    <td style="border: 1px solid #888;">${combo.company2}</td>
                    <td style="border: 1px solid #888;">${prob2 ? (prob2.win * 100).toFixed(2) : '没开盘'}</td>
                    <td style="border: 1px solid #888;">${prob2 ? (prob2.draw * 100).toFixed(2) : '没开盘'}</td>
                    <td style="border: 1px solid #888;">${prob2 ? (prob2.lose * 100).toFixed(2) : '没开盘'}</td>
                `;
                tbody.appendChild(row2);
            });

            table.appendChild(tbody);

            // 插入到页面
            const controlPanel = document.getElementById('controlPanel');
            controlPanel.parentNode.insertBefore(table, controlPanel.nextSibling);
        }
    };
    UI.createControlPanel();
})();