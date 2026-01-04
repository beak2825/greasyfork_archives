// ==UserScript==
// @name         【夸克百科】提交状态对比工具
// @namespace    http://tampermonkey.net/
// @version      2025/12/02-01:43:50
// @description  对比输入的词条数据与已通过/待审核词条的差异
// @author       Your Name
// @match        https://baike.quark.cn/dashboard/contents?status=tools
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_notification
// @connect      baike.quark.cn
// @license      All rights reserved
// @downloadURL https://update.greasyfork.org/scripts/548691/%E3%80%90%E5%A4%B8%E5%85%8B%E7%99%BE%E7%A7%91%E3%80%91%E6%8F%90%E4%BA%A4%E7%8A%B6%E6%80%81%E5%AF%B9%E6%AF%94%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/548691/%E3%80%90%E5%A4%B8%E5%85%8B%E7%99%BE%E7%A7%91%E3%80%91%E6%8F%90%E4%BA%A4%E7%8A%B6%E6%80%81%E5%AF%B9%E6%AF%94%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 清空当前页面内容
    document.body.innerHTML = '';

    // 创建冻结的顶部区域
    const header = document.createElement('div');
    header.style.position = 'fixed';
    header.style.top = '0';
    header.style.left = '0';
    header.style.width = '100%';
    header.style.backgroundColor = '#fff';
    header.style.zIndex = '9999';
    header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    header.style.padding = '10px 20px';
    header.style.display = 'flex';
    header.style.flexWrap = 'wrap';
    header.style.alignItems = 'center';
    header.style.gap = '10px';
    header.style.fontSize = '16px';

    // 创建时间输入区域
    const timeContainer = document.createElement('div');
    timeContainer.style.display = 'flex';
    timeContainer.style.gap = '10px';
    timeContainer.style.alignItems = 'center';
    timeContainer.style.marginBottom = '10px';
    timeContainer.style.width = '100%';

    // 计算默认时间
    const now = new Date();
    const isAfter11th = now.getDate() >= 11;
    const startDate = new Date(now);
    if (isAfter11th) {
        startDate.setDate(11);
    } else {
        startDate.setMonth(now.getMonth() - 1);
        startDate.setDate(11);
    }

    const endDate = new Date(now);

    // 格式化日期为yyyymmdd
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }

    const defaultStartTime = formatDate(startDate);
    const defaultEndTime = formatDate(endDate);

    // 开始时间输入
    const startTimeLabel = document.createElement('label');
    startTimeLabel.textContent = '开始时间:';
    startTimeLabel.style.fontWeight = 'bold';

    const startTimeInput = document.createElement('input');
    startTimeInput.type = 'text';
    startTimeInput.value = defaultStartTime;
    startTimeInput.placeholder = 'yyyymmdd';
    startTimeInput.style.width = '100px';
    startTimeInput.style.padding = '5px';

    // 结束时间输入
    const endTimeLabel = document.createElement('label');
    endTimeLabel.textContent = '结束时间:';
    endTimeLabel.style.fontWeight = 'bold';

    const endTimeInput = document.createElement('input');
    endTimeInput.type = 'text';
    endTimeInput.value = defaultEndTime;
    endTimeInput.placeholder = 'yyyymmdd';
    endTimeInput.style.width = '100px';
    endTimeInput.style.padding = '5px';

    timeContainer.appendChild(startTimeLabel);
    timeContainer.appendChild(startTimeInput);
    timeContainer.appendChild(endTimeLabel);
    timeContainer.appendChild(endTimeInput);

    const textarea = document.createElement('textarea');
    textarea.placeholder = '需要登录夸克百科账号\n每行输入格式为：词条名\t义项名（可缺）';
    textarea.rows = 3;
    textarea.style.width = '600px';
    textarea.style.fontSize = '16px';
    textarea.style.resize = 'none';

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '确认输入';
    confirmBtn.style.height = '40px';
    confirmBtn.style.fontSize = '18px';
    confirmBtn.style.backgroundColor = '#007BFF';
    confirmBtn.style.color = '#fff';
    confirmBtn.style.border = 'none';
    confirmBtn.style.borderRadius = '4px';
    confirmBtn.style.minWidth = '100px';

    const clearBtn = document.createElement('button');
    clearBtn.textContent = '清空输入';
    clearBtn.style.height = '40px';
    clearBtn.style.fontSize = '18px';
    clearBtn.style.backgroundColor = '#6c757d';
    clearBtn.style.color = '#fff';
    clearBtn.style.border = 'none';
    clearBtn.style.borderRadius = '4px';
    clearBtn.style.minWidth = '100px';

    const copyAllBtn = document.createElement('button');
    copyAllBtn.textContent = '复制链接';
    copyAllBtn.style.height = '40px';
    copyAllBtn.style.fontSize = '18px';
    copyAllBtn.style.backgroundColor = '#28a745';
    copyAllBtn.style.color = '#fff';
    copyAllBtn.style.border = 'none';
    copyAllBtn.style.borderRadius = '4px';
    copyAllBtn.style.minWidth = '140px';

    header.appendChild(timeContainer);
    header.appendChild(textarea);
    header.appendChild(confirmBtn);
    header.appendChild(clearBtn);
    header.appendChild(copyAllBtn);
    document.body.appendChild(header);

    // 内容容器（偏移顶部高度）
    const contentContainer = document.createElement('div');
    contentContainer.style.marginTop = '180px';
    contentContainer.style.padding = '20px';
    document.body.appendChild(contentContainer);

    // 存储最终结果
    let finalResults = [];

    // 存储原始输入行信息
    let originalInputs = [];

    // 清空按钮事件
    clearBtn.addEventListener('click', () => {
        textarea.value = '';
        contentContainer.innerHTML = '';
        finalResults = [];
        originalInputs = [];
    });

    // 确认按钮事件
    confirmBtn.addEventListener('click', async () => {
        const inputText = textarea.value.trim();
        if (!inputText) {
            alert('请输入数据');
            return;
        }

        const startTime = startTimeInput.value.trim();
        const endTime = endTimeInput.value.trim();

        // 验证时间格式
        if (!/^\d{8}$/.test(startTime) || !/^\d{8}$/.test(endTime)) {
            alert('时间格式错误，请使用yyyymmdd格式');
            return;
        }

        // 解析输入数据
        const inputLines = inputText.split('\n');
        const inputData = [];

        for (let i = 0; i < inputLines.length; i++) {
            const line = inputLines[i].trim();
            if (!line || line === '词条名\t义项' || line === '\t') continue;

            const [lemma, sense] = line.split('\t');
            if (lemma && lemma.trim()) {
                inputData.push({
                    lemma: lemma.trim(),
                    sense: sense ? sense.trim() : '',
                    originalIndex: i
                });
            }
        }

        if (inputData.length === 0) {
            alert('没有有效的输入数据');
            return;
        }

        originalInputs = inputData;

        // 显示加载中提示
        contentContainer.innerHTML = '<div style="text-align: center; padding: 20px; font-size: 18px;">正在获取数据，请稍候...</div>';

        try {
            // 获取已通过和待审核的词条数据
            const [passedData, pendingData] = await Promise.all([
                fetchAllLemmaData('my_passed_list', startTime, endTime),
                fetchAllLemmaData('my_pending_list', startTime, endTime)
            ]);

            // 合并数据
            const allLemmaData = [...passedData, ...pendingData];

            // 对比数据
            compareData(inputData, allLemmaData);
        } catch (error) {
            contentContainer.innerHTML = `<div style="color: red; text-align: center; padding: 20px; font-size: 18px;">获取数据失败: ${error.message}</div>`;
        }
    });

    // 复制按钮事件
    copyAllBtn.addEventListener('click', () => {
        if (finalResults.length === 0) {
            alert('没有可复制的内容');
            return;
        }

        const textToCopy = finalResults.map(item => `${item.lemma}\t${item.sense}`).join('\n');
        GM_setClipboard(textToCopy);
        GM_notification({
            text: '内容已复制到剪贴板',
            timeout: 2000
        });
    });

    // 获取所有词条数据
    async function fetchAllLemmaData(status, startTime, endTime) {
        const allData = [];
        let page = 1;
        const size = 1000;
        let hasMoreData = true;

        // 将时间字符串转换为时间戳
        const startTimestamp = convertToTimestamp(startTime, 'start');
        const endTimestamp = convertToTimestamp(endTime, 'end');

        while (hasMoreData) {
            try {
                const data = await fetchLemmaPage(status, page, size);
                if (!data || !data.data || data.data.length === 0) {
                    break;
                }

                // 检查是否有数据在时间范围之前
                const earliestTime = Math.min(...data.data.map(item => item.submit_time));
                if (earliestTime < startTimestamp) {
                    hasMoreData = false;
                    // 只添加在时间范围内的数据
                    data.data.forEach(item => {
                        if (item.submit_time >= startTimestamp && item.submit_time <= endTimestamp) {
                            allData.push(item);
                        }
                    });
                } else {
                    // 添加所有数据
                    data.data.forEach(item => {
                        if (item.submit_time >= startTimestamp && item.submit_time <= endTimestamp) {
                            allData.push(item);
                        }
                    });
                    page++;
                }

                // 如果获取的数据量小于请求的数量，说明没有更多数据了
                if (data.data.length < size) {
                    hasMoreData = false;
                }
            } catch (error) {
                console.error(`获取${status}数据失败:`, error);
                hasMoreData = false;
            }
        }

        return allData;
    }

    // 获取单页词条数据
    function fetchLemmaPage(status, page, size) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://baike.quark.cn/api/lemma/list?status=${status}&page=${page}&size=${size}`,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data);
                        } catch (e) {
                            reject(new Error('解析JSON失败'));
                        }
                    } else {
                        reject(new Error(`HTTP错误: ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // 将yyyymmdd格式转换为时间戳
    function convertToTimestamp(dateStr, type) {
        const year = parseInt(dateStr.substring(0, 4));
        const month = parseInt(dateStr.substring(4, 6)) - 1;
        const day = parseInt(dateStr.substring(6, 8));

        const date = new Date(year, month, day);
        if (type === 'start') {
            return date.getTime();
        } else {
            // 结束时间设置为当天的23:59:59
            date.setHours(23, 59, 59, 999);
            return date.getTime();
        }
    }

    // 对比数据
    function compareData(inputData, lemmaData) {
        // 创建输入数据的映射（考虑重复项）
        const inputMap = new Map();
        inputData.forEach(item => {
            const key = `${item.lemma}|${item.sense}`.toLowerCase();
            if (!inputMap.has(key)) {
                inputMap.set(key, []);
            }
            inputMap.get(key).push(item);
        });

        // 创建lemma数据的映射
        const lemmaMap = new Map();
        lemmaData.forEach(item => {
            const key = `${item.lemma_name}|${item.lemma_sense || ''}`.toLowerCase();
            if (!lemmaMap.has(key)) {
                lemmaMap.set(key, []);
            }
            lemmaMap.get(key).push(item);
        });

        // 找出输入有但对比数据没有的
        const onlyInInput = [];
        for (const [key, items] of inputMap.entries()) {
            const lemmaItems = lemmaMap.get(key) || [];
            // 计算需要保留的数量
            const keepCount = Math.max(0, items.length - lemmaItems.length);
            if (keepCount > 0) {
                onlyInInput.push(...items.slice(0, keepCount));
            }
        }

        // 找出对比数据有但输入没有的
        const onlyInLemma = [];
        for (const [key, items] of lemmaMap.entries()) {
            const inputItems = inputMap.get(key) || [];
            // 计算需要保留的数量
            const keepCount = Math.max(0, items.length - inputItems.length);
            if (keepCount > 0) {
                onlyInLemma.push(...items.slice(0, keepCount));
            }
        }

        // 存储最终结果
        finalResults = onlyInInput;

        // 显示结果
        displayResults(onlyInInput, onlyInLemma);
    }

    // 显示对比结果
    function displayResults(onlyInInput, onlyInLemma) {
        contentContainer.innerHTML = '';

        // 创建两栏布局
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.gap = '20px';

        // 左侧：输入有但对比数据没有的
        const leftColumn = document.createElement('div');
        leftColumn.style.flex = '1';
        leftColumn.style.border = '1px solid #ccc';
        leftColumn.style.borderRadius = '5px';
        leftColumn.style.padding = '10px';

        const leftTitle = document.createElement('h3');
        leftTitle.textContent = `【输入】有【提交】没有： (${onlyInInput.length}项)`;
        leftTitle.style.marginTop = '0';
        leftColumn.appendChild(leftTitle);

        if (onlyInInput.length > 0) {
            const leftList = document.createElement('div');
            leftList.style.maxHeight = '500px';
            leftList.style.overflowY = 'auto';

            onlyInInput.forEach(item => {
                const div = document.createElement('div');
                div.style.padding = '5px';
                div.style.borderBottom = '1px solid #eee';
                div.textContent = `${item.lemma}\t${item.sense}`;
                leftList.appendChild(div);
            });

            leftColumn.appendChild(leftList);
        } else {
            const noData = document.createElement('div');
            noData.textContent = '无数据';
            noData.style.color = '#999';
            leftColumn.appendChild(noData);
        }

        // 右侧：对比数据有但输入没有的
        const rightColumn = document.createElement('div');
        rightColumn.style.flex = '1';
        rightColumn.style.border = '1px solid #ccc';
        rightColumn.style.borderRadius = '5px';
        rightColumn.style.padding = '10px';

        const rightTitle = document.createElement('h3');
        rightTitle.textContent = `【输入】没有【提交】有： (${onlyInLemma.length}项)`;
        rightTitle.style.marginTop = '0';
        rightColumn.appendChild(rightTitle);

        if (onlyInLemma.length > 0) {
            const rightList = document.createElement('div');
            rightList.style.maxHeight = '500px';
            rightList.style.overflowY = 'auto';

            onlyInLemma.forEach(item => {
                const div = document.createElement('div');
                div.style.padding = '5px';
                div.style.borderBottom = '1px solid #eee';
                div.textContent = `${item.lemma_name}\t${item.lemma_sense || ''}`;
                rightList.appendChild(div);
            });

            rightColumn.appendChild(rightList);
        } else {
            const noData = document.createElement('div');
            noData.textContent = '无数据';
            noData.style.color = '#999';
            rightColumn.appendChild(noData);
        }

        container.appendChild(leftColumn);
        container.appendChild(rightColumn);
        contentContainer.appendChild(container);

        // 添加复制按钮说明
        const copyNote = document.createElement('div');
        copyNote.style.marginTop = '20px';
        copyNote.textContent = '点击顶部"复制链接"按钮可复制左侧栏的内容';
        copyNote.style.color = '#666';
        contentContainer.appendChild(copyNote);
    }
})();