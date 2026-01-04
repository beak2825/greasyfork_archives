// ==UserScript==
// @name         zhihu_salt_analysis
// @namespace    http://tampermonkey.net/
// @version      2025-09-28_6
// @description  auto get salt data based CreatorRangePicker-PopoverContent
// @author       Archimon@zhihu
// @match        https://www.zhihu.com/creator/knowledge-income
// @icon         https://picx.zhimg.com/v2-1de07498cdef102d69ed02e275c51ba9_xll.jpg?source=32738c0c&needBackground=1
// @require      https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550926/zhihu_salt_analysis.user.js
// @updateURL https://update.greasyfork.org/scripts/550926/zhihu_salt_analysis.meta.js
// ==/UserScript==

function formatDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const yesterday = String(date.getDate()-1); // 去掉补零
    return `${yesterday}`;
}

// 等待元素加载的辅助函数
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
    });
}

// 等待指定时间的辅助函数
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 检测元素消失的辅助函数
function waitForElementDisappear(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (!element) {
            resolve();
            return;
        }

        const observer = new MutationObserver(() => {
            const currentElement = document.querySelector(selector);
            if (!currentElement) {
                observer.disconnect();
                resolve();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} still exists after ${timeout}ms`));
        }, timeout);
    });
}

// 监控日期选择器变化的函数（支持多次选择）
function monitorDatePickerChanges(callback) {
    console.log('开始监控日期选择器变化...');

    const datePickerSelector = 'div[class*="CreatorRangePicker-PopoverContent"]';
    let isMonitoring = true;

    const observer = new MutationObserver(() => {
        if (!isMonitoring) return;

        const datePicker = document.querySelector(datePickerSelector);

        if (datePicker) {
            console.log('日期选择器出现，开始监控消失...');

            // 监控日期选择器消失
            const disappearObserver = new MutationObserver(() => {
                const currentPicker = document.querySelector(datePickerSelector);
                if (!currentPicker) {
                    disappearObserver.disconnect();
                    console.log('日期选择器消失，执行回调...');

                    // 等待页面稳定后执行回调
                    setTimeout(async () => {
                        try {
                            await waitForPageLoad();
                            if (callback && typeof callback === 'function') {
                                await callback();
                            }
                        } catch (error) {
                            console.warn('回调执行失败:', error.message);
                        }
                    }, 500);
                }
            });

            disappearObserver.observe(document.body, {
                childList: true,
                subtree: true
            });

            // 设置超时，避免无限监控
            setTimeout(() => {
                disappearObserver.disconnect();
            }, 15000);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 返回停止监控的函数
    return () => {
        isMonitoring = false;
        observer.disconnect();
        console.log('停止监控日期选择器变化');
    };
}

// 检测页面是否加载完成的函数
function waitForPageLoad(timeout = 5000) {
    return new Promise((resolve, reject) => {
        // 检查页面是否已经加载完成
        if (document.readyState === 'complete') {
            resolve();
            return;
        }

        // 监听页面加载完成事件
        window.addEventListener('load', () => {
            resolve();
        });

        // 设置超时
        setTimeout(() => {
            reject(new Error('Page load timeout'));
        }, timeout);
    });
}

async function set_date(date, callback = null){
    let next_button = null;
    const buttons = document.querySelectorAll(`
            input[type="button"],
            button[type="button"]
        `);

    for (const button of buttons) {
        if (button.className.includes("CreatorRangePicker-Button")){
            button.click();
            await wait(100);

            // 等待日期选择器弹出
            const CreatorRangePicker = await waitForElement('div[class*="CreatorRangePicker-PopoverContent"]');

            // 检查今天是否是1号
            const today = new Date();
            const isFirstDayOfMonth = today.getDate() === 1;
            
            let days_all;
            let targetDate = date;
            
            if (isFirstDayOfMonth) {
                // 如果是1号，使用左边的日期选择器部分，并选择上个月的最后一天
                days_all = CreatorRangePicker.childNodes[0].childNodes[1].childNodes[0].childNodes[1].childNodes;
                          
                
                // 计算上个月的最后一天
                const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
                targetDate = String(lastMonth.getDate()); // 去掉补零
                console.log(`今天是1号，自动选择上个月最后一天:${today} \n${lastMonth} ${targetDate}`);
            } else {
                // 如果不是1号，使用右边的日期选择器部分，选择昨天
                days_all = CreatorRangePicker.childNodes[1].childNodes[1].childNodes[0].childNodes[1].childNodes;
                console.log(`今天不是1号，选择昨天: ${targetDate}`);
            }
            console.log(CreatorRangePicker.childNodes[0].childNodes[1].tbody);
            let dateFound = false;
            for (const row of days_all) {
                const days_row = row.childNodes;
                for (const day of days_row) {
                    if (day.textContent.trim()  === targetDate){
                        // 双击选择日期
                        day.click();
                        await wait(120);
                        day.click();
                        
                        dateFound = true;

                        // 日期选择后，等待选择器消失
                        console.log('日期已选择，等待日期选择器消失...');
                        try {
                            await waitForElementDisappear('div[class*="CreatorRangePicker-PopoverContent"]');
                            console.log('日期选择器已消失，等待页面加载...');

                            // 等待页面加载完成
                            await waitForPageLoad();
                            console.log('页面加载完成');

                            // 如果有回调函数，执行回调
                            if (callback && typeof callback === 'function') {
                                console.log('执行回调函数...');
                                await callback();
                            }
                        } catch (error) {
                            console.warn('日期选择器消失检测超时:', error.message);
                        }
                        
                        break; // 找到日期后跳出循环
                    }
                }
                if (dateFound) break;
            }
            
            if (!dateFound) {
                console.warn(`未找到日期: ${targetDate}，请手动选择`);
            }
        } else if (button.className.includes("CreatorPagination-nextButton")){
            next_button = button;
        }
    }

    const benqishouyi = document.querySelectorAll('th[class*=CreatorTable-tableHead--hasSorter]');
    for (const th of benqishouyi) {
        await wait(240);
        th.click();
    }

    return next_button;
}

function parseRow(row) {
    const cells = row.querySelectorAll('td, th');
    return Array.from(cells)
        .map(cell => {
            const text = cell.textContent.trim();

            // 获取cell元素中的链接a href
            let linkHref = null;
            const linkElement = cell.querySelector('a');
            if (linkElement && linkElement.href) {
                linkHref = linkElement.href;
            }

            return {
                text: text === '' ? null : text,
                linkHref: linkHref,
                rowspan: cell.rowSpan || 1,
                colspan: cell.colSpan || 1
            };
        })
        .filter(cell => cell.text !== null && cell.text !== ''); // 过滤掉text为null或空字符串的单元格
}

function prepareChartData(rows) {
    const fullData = [];
    rows.forEach((row, index) => {
        // 从链接中提取回答ID
        let ans_url = null;
        if (row[0].linkHref) {
            const match = row[0].linkHref.match(/answer\/([^\/\?]+)/);
            if (match) {
                ans_url = match[1];
            }
        }

        fullData.push({
            ans_names:row[0].text,
            ans_types:row[1].text,
            ans_times:row[2].text,
            ans_local_reads:parseInt(row[3].text.replace(/,/g, '')) || 0,
            ans_local_salts:parseInt(row[4].text.replace(/,/g, '')) || 0,
            ans_all_reads:parseInt(row[5].text.replace(/,/g, '')) || 0,
            ans_all_salts:parseInt(row[6].text.replace(/,/g, '')) || 0,
            ans_url:ans_url
        });
    });
    return fullData;
    }

// 解析回答时间字符串为Date对象
function parseAnswerTime(timeStr) {
    if (!timeStr) return null;
    
    // 处理各种时间格式
    if (timeStr.includes('今天')) {
        return new Date();
    } else if (timeStr.includes('昨天')) {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return date;
    } else if (timeStr.includes('前天')) {
        const date = new Date();
        date.setDate(date.getDate() - 2);
        return date;
    } else if (timeStr.includes('分钟前') || timeStr.includes('小时前')) {
        return new Date(); // 近似处理为今天
    } else {
        // 尝试解析标准日期格式
        const date = new Date(timeStr);
        return isNaN(date.getTime()) ? null : date;
    }
}

// 按时间分类准备饼图数据
function prepareTimeCategoryPieChartData(fullData) {
    const now = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const twoDayMs = 2 * oneDayMs;
    const sevenDaysMs = 7 * oneDayMs;
    const oneMonthMs = 30 * oneDayMs; // 近似处理
    
    const categories = {
        '1天以内': { salt: 0, count: 0, reads: 0 },
        '1天-7天': { salt: 0, count: 0, reads: 0 },
        '7天-1个月': { salt: 0, count: 0, reads: 0 },
        '1个月以上': { salt: 0, count: 0, reads: 0 }
    };
    
    fullData.forEach(item => {
        const answerTime = parseAnswerTime(item.ans_times);
        if (!answerTime) return;
        
        const timeDiff = now - answerTime;
        // console.log(`回答时间: ${item.ans_times}, 解析后: ${answerTime}, 时间差: ${timeDiff}ms`);
        let category = '';
        
        if (timeDiff <= twoDayMs) {
            category = '1天以内';
        } else if (timeDiff <= sevenDaysMs) {
            category = '1天-7天';
        } else if (timeDiff <= oneMonthMs) {
            category = '7天-1个月';
        } else {
            category = '1个月以上';
        }
        
        categories[category].salt += item.ans_local_salts;
        categories[category].count += 1;
        categories[category].reads += item.ans_local_reads;
    });
    
    const totalSalt = Object.values(categories).reduce((sum, cat) => sum + cat.salt, 0);
    const totalCount = Object.values(categories).reduce((sum, cat) => sum + cat.count, 0);
    
    const pieData = Object.entries(categories)
        .filter(([_, cat]) => cat.salt > 0) // 只包含有盐粒的类别
        .map(([name, cat]) => ({
            name: `${name} (${cat.count}个回答)`,
            value: cat.salt,
            percentage: totalSalt > 0 ? ((cat.salt / totalSalt) * 100).toFixed(2) : '0.00',
            salt_read_ratio: cat.reads > 0 ? (cat.salt / cat.reads).toFixed(2) : '0.00',
            answer_count: cat.count,
            read_count: cat.reads
        }));
    
    // 添加总统计数据
    pieData.total_salt = totalSalt;
    pieData.total_count = totalCount;
    pieData.total_read = Object.values(categories).reduce((sum, cat) => sum + cat.reads, 0);
    pieData.total_salt_read_ratio = pieData.total_read > 0 ? (totalSalt / pieData.total_read).toFixed(2) : '0.00';
    
    return pieData;
}

// 创建饼图数据
function preparePieChartData(fullData) {
    const salt_all_yesterday = fullData.reduce((sum, item) => sum + item.ans_local_salts, 0);
    const read_all_yesterday = fullData.reduce((sum, item) => sum + item.ans_local_reads, 0);

    // 筛选盐粒占比超过1%的元素
    const significantData = fullData.filter(item => {
        const percentage = (item.ans_local_salts / salt_all_yesterday) * 100;
        return percentage >= 1;
    });

    // 取盐粒占比超过1%的元素，或前7个，取最大值
    const maxCount = Math.max(significantData.length, 7);
    const topData = fullData.slice(0, maxCount);
    const otherData = fullData.slice(maxCount);

    // 计算其他数据的盐粒和阅读数
    const otherSalt = otherData.reduce((sum, item) => sum + item.ans_local_salts, 0);
    const otherRead = otherData.reduce((sum, item) => sum + item.ans_local_reads, 0);
    const otherCount = otherData.length;

    const pieData = topData.map((item, index) => ({
        name: item.ans_names.length > 15 ? item.ans_names.substring(0, 15) + '...' : item.ans_names,
        value: item.ans_local_salts,
        percentage: ((item.ans_local_salts / salt_all_yesterday) * 100).toFixed(2),
        salt_read_ratio: (item.ans_local_salts / item.ans_local_reads).toFixed(2),
        read_count: item.ans_local_reads
    }));

    // 如果有其他数据，添加"其他"项
    if (otherSalt > 0) {
        pieData.push({
            name: `其他 (${otherCount}个回答)`,
            value: otherSalt,
            percentage: ((otherSalt / salt_all_yesterday) * 100).toFixed(2),
            salt_read_ratio: (otherSalt / otherRead).toFixed(2),
            answer_count: otherCount,
            read_count: otherRead
        });
    }

    // 添加总阅读量信息
    pieData.total_salt = salt_all_yesterday;
    pieData.total_read = read_all_yesterday;
    pieData.total_salt_read_ratio = (salt_all_yesterday / read_all_yesterday).toFixed(2);

    return pieData;
}

// 获取日期选择器的时间信息
function getDateRangeText() {
    // 查找日期选择器按钮，使用类名选择器，忽略动态生成的类名部分
    const datePickerButton = document.querySelector('button[class*="CreatorRangePicker-Button"]');
    if (datePickerButton) {
        // 获取按钮的文本内容，去除SVG图标等非文本内容
        const textContent = datePickerButton.textContent.trim();
        // 提取日期范围信息
        const dateMatch = textContent.match(/(\d{4}\/\d{2}\/\d{2})[^]*?(\d{4}\/\d{2}\/\d{2})/);
        if (dateMatch) {
            return `${dateMatch[1]} - ${dateMatch[2]}`;
        }
    }
    return '未知日期';
}

// 创建时间分类饼图
function createTimeCategoryPieChart(pieData, containerId = 'time-category-pie-chart') {
    // 创建容器
    const chartContainer = document.createElement('div');
    chartContainer.id = containerId;
    chartContainer.style.cssText = `
        width: 1016px;
        height: 400px;
        margin: 20px auto;
        border: 1px solid #e8e8e8;
        border-radius: 8px;
        padding: 20px;
        background: #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `;

    // 初始化图表
    const chart = echarts.init(chartContainer);

    // 获取日期范围
    const dateRange = getDateRangeText();

    // 使用从prepareTimeCategoryPieChartData传递过来的统计数据
    const totalSalt = pieData.total_salt || pieData.reduce((sum, item) => sum + item.value, 0);
    const totalCount = pieData.total_count || pieData.reduce((sum, item) => sum + item.answer_count, 0);
    const totalRead = pieData.total_read || pieData.reduce((sum, item) => sum + (item.read_count || 0), 0);
    const totalSaltReadRatio = pieData.total_salt_read_ratio || (totalRead > 0 ? (totalSalt / totalRead).toFixed(2) : '0.00');

    // 配置项
    const option = {
        title: {
            text: `盐粒时间分布图\n${dateRange}\n共${totalCount}个回答 | 总盐粒: ${totalSalt} | 总盐粒阅读比: ${totalSaltReadRatio}`,
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                return `${params.name}<br/>盐粒: ${params.value}<br/>占比: ${params.data.percentage}%<br/>盐粒阅读比: ${params.data.salt_read_ratio}<br/>回答数: ${params.data.answer_count}`;
            }
        },
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            type: 'scroll',
            pageTextStyle: {
                color: '#666'
            }
        },
        series: [
            {
                name: '时间分布',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['40%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 18,
                        fontWeight: 'bold',
                        formatter: '{b}\n{c}盐粒\n({d}%)'
                    }
                },
                labelLine: {
                    show: false
                },
                data: pieData.map(item => ({
                    name: item.name,
                    value: item.value,
                    percentage: item.percentage,
                    salt_read_ratio: item.salt_read_ratio,
                    answer_count: item.answer_count
                }))
            }
        ],
        color: [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4',
            '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'
        ]
    };

    // 设置配置项并渲染
    chart.setOption(option);

    // 响应窗口大小变化
    window.addEventListener('resize', function() {
        chart.resize();
    });

    return chartContainer;
}

// 创建ECharts饼图
function createPieChart(pieData, fullDataLength, containerId = 'salt-pie-chart') {
    // 创建容器
    const chartContainer = document.createElement('div');
    chartContainer.id = containerId;
    chartContainer.style.cssText = `
        width: 1016px;
        height: 400px;
        margin: 20px auto;
        border: 1px solid #e8e8e8;
        border-radius: 8px;
        padding: 20px;
        background: #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `;

    // 初始化图表
    const chart = echarts.init(chartContainer);

    // 获取日期范围
    const dateRange = getDateRangeText();

    // 使用从preparePieChartData传递过来的总盐粒量和总盐粒阅读比
    const totalSalt = pieData.total_salt || pieData.reduce((sum, item) => sum + item.value, 0);
    const totalRead = pieData.total_read || pieData.reduce((sum, item) => sum + (item.read_count || 0), 0);
    const totalSaltReadRatio = pieData.total_salt_read_ratio || (totalRead > 0 ? (totalSalt / totalRead).toFixed(2) : '0.00');

    // 配置项
    const option = {
        title: {
            text: `盐粒来源分布图\n${dateRange}\n共${fullDataLength}个回答 | 总盐粒: ${totalSalt} | 总盐粒阅读比: ${totalSaltReadRatio}`,
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                return `${params.name}<br/>盐粒: ${params.value}<br/>占比: ${params.data.percentage}%<br/>盐粒阅读比: ${params.data.salt_read_ratio}`;
            }
        },
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            type: 'scroll',
            pageTextStyle: {
                color: '#666'
            }
        },
        series: [
            {
                name: '盐粒分布',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['40%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 18,
                        fontWeight: 'bold',
                        formatter: '{b}\n{c}盐粒\n({d}%)'
                    }
                },
                labelLine: {
                    show: false
                },
                data: pieData.map(item => ({
                    name: item.name,
                    value: item.value,
                    percentage: item.percentage,
                    salt_read_ratio: item.salt_read_ratio
                }))
            }
        ],
        color: [
            '#5470c6', '#91cc75', '#fac858', '#ee6666',
            '#73c0de', '#3ba272', '#fc8452', '#9a60b4',
            '#ea7ccc'
        ]
    };

    // 设置配置项并渲染
    chart.setOption(option);

    // 响应窗口大小变化
    window.addEventListener('resize', function() {
        chart.resize();
    });

    return chartContainer;
}

function createDataTable(fullData) {
    let tableHtml = `<div style="position:relative;left:20px;top:30px">
    <table class="CreatorTable-table ToolsRecommendList-Table" cellspacing="0" cellpadding="0">
        <thead>
            <tr class="CreatorTable-tableRow">
                <th class="CreatorTable-tableHead css-0" width="140" data-tooltip-classname="CreatorTable-Tooltip" data-tooltip-position="bottom" style="text-align: center;">内容</th>
                <th class="CreatorTable-tableHead css-0" width="140" data-tooltip-classname="CreatorTable-Tooltip" data-tooltip-position="bottom" style="text-align: center;">本期盐粒</th>
                <th class="CreatorTable-tableHead css-0" width="140" data-tooltip-classname="CreatorTable-Tooltip" data-tooltip-position="bottom" style="text-align: center;">收益占比</th>
                <th class="CreatorTable-tableHead css-0" width="140" data-tooltip-classname="CreatorTable-Tooltip" data-tooltip-position="bottom" style="text-align: center;">盐粒阅读比</th>
            </tr>
        </thead>
    <tbody>
        `;
    const salt_all_range = fullData.reduce((sum, item) => sum + item.ans_local_salts, 0);
    const read_all_yesterday = fullData.reduce((sum, item) => sum + item.ans_local_reads, 0);
    tableHtml += `<tr>
                    <td class="CreatorTable-tableData css-0" style="text-align: center;">${fullData.length}个回答</td>
                    <td class="CreatorTable-tableData css-0" style="text-align: center;">${salt_all_range}</td>
                    <td class="CreatorTable-tableData css-0" style="text-align: center;">100%</td>
                    <td class="CreatorTable-tableData css-0" style="text-align: center;">${(salt_all_range/read_all_yesterday).toFixed(2)}</td>
                </tr>
            `;
    fullData.forEach((item,index) => {
        const percentage = ((item.ans_local_salts / salt_all_range) * 100).toFixed(2);
        tableHtml += `<tr>
                    <td class="CreatorTable-tableData css-0" style="text-align: center;"><div class="css-13zgqlo"><a href="https://www.zhihu.com/answer/${item.ans_url}" target="_blank" rel="noopener noreferrer" style="font-size: 14px; color: rgb(25, 27, 31); font-weight: 500; display: -webkit-box; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 3; -webkit-box-orient: vertical; white-space: pre-wrap;">${item.ans_names}</a></div></td>
                    <td class="CreatorTable-tableData css-0" style="text-align: center;">${item.ans_local_salts}</td>
                    <td class="CreatorTable-tableData css-0" style="text-align: center;">${percentage}%</td>
                    <td class="CreatorTable-tableData css-0" style="text-align: center;">${(item.ans_local_salts/item.ans_local_reads).toFixed(2)}</td>
                </tr>
            `;
        });

        tableHtml += `
                </tbody>
            </table></div>
        `;

        return tableHtml;
    }

async function get_data_draw(next_page_button){
    const table_data = {
        headers: [],
        rows: [],
        };

    const page_num = document.querySelector('div[class*="CreatorPagination-pageNumber"]');
    const end_page = parseInt(page_num.textContent.split('/')[1].trim());

    for (let i = 1; i <= end_page; i++) {
        // 等待页面稳定
        await wait(500);

        let table = document.querySelector('table[class*=ToolsRecommendList-Table]');
        if (!table) {
            console.warn(`第 ${i} 页表格未找到，等待重试...`);
            await wait(1000);
            table = document.querySelector('table[class*=ToolsRecommendList-Table]');
        }

        if (table) {
            let thead = table.childNodes[0];
            table_data.headers = parseRow(thead);
            let data_rows = table.childNodes[1].querySelectorAll('tr');
            let parsed_rows = Array.from(data_rows).map(row => parseRow(row));
            table_data.rows = Array.from(table_data.rows).concat(parsed_rows).filter(row => row.length !== 0);
            // console.log(table_data.rows);
        }

        if (i < end_page && next_page_button) {
            next_page_button.click();
            // 等待页面加载完成
            await waitForElement('table[class*=ToolsRecommendList-Table]');
        }
    }

    await wait(500);

    const all_data = prepareChartData(Array.from(table_data.rows));
    const salt_all_range = all_data.reduce((sum, item) => sum + item.ans_local_salts, 0);

    // 输出控制台信息
    all_data.sort((a,b) => b.ans_local_salts- a.ans_local_salts).forEach(item => {
        const percentage = ((item.ans_local_salts / salt_all_range) * 100).toFixed(2);
        console.log(`${String(item.ans_local_salts).padStart(8,' ')} ${String(percentage).padStart(6,' ')}% ${item.ans_names} `);
    });

    // 创建可视化界面
    await createVisualization(all_data);
}

// 创建可视化界面（饼图 + 表格）
async function createVisualization(all_data) {
    // 准备饼图数据
    const pieData = preparePieChartData(all_data);
    const timeCategoryData = prepareTimeCategoryPieChartData(all_data);

    // 创建主容器
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        max-height: 90vh;
        overflow-y: auto;
        min-width: 800px;
    `;

    // 创建关闭按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    closeButton.onclick = () => container.remove();

    // 创建标题
    const title = document.createElement('h2');
    title.textContent = '知乎盐粒收益分析';
    title.style.cssText = `
        text-align: center;
        margin-bottom: 20px;
        color: #1890ff;
        font-size: 18px;
    `;

    // 创建盐粒来源饼图
    const pieChart = createPieChart(pieData, all_data.length);
    // 创建时间分类饼图
    const timeCategoryPieChart = createTimeCategoryPieChart(timeCategoryData);

    // 创建表格
    const tableHtml = createDataTable(all_data);
    const tableContainer = document.createElement('div');
    tableContainer.innerHTML = tableHtml;

    // 组装所有元素
    container.appendChild(closeButton);
    container.appendChild(title);
    container.appendChild(pieChart);
    container.appendChild(timeCategoryPieChart);
    container.appendChild(tableContainer);

    // 添加到页面
    document.body.appendChild(container);

    // 添加ESC键关闭功能
    const handleKeydown = (e) => {
        if (e.key === 'Escape') {
            container.remove();
            document.removeEventListener('keydown', handleKeydown);
        }
    };
    document.addEventListener('keydown', handleKeydown);

    // 点击背景关闭
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
    `;
    overlay.onclick = () => {
        container.remove();
        overlay.remove();
        document.removeEventListener('keydown', handleKeydown);
    };
    document.body.appendChild(overlay);
}

(async function() {
    'use strict';

    console.log(`🚀 Archimon@zhihu.com say hello!`);

    // 等待页面完全加载
    if (document.readyState === 'loading') {
        await new Promise(resolve => {
            document.addEventListener('DOMContentLoaded', resolve);
        });
    }

    // 添加样式
    // 获取昨天日期
    const yesterday_str = formatDate();

    // 点击进入『内容收益明细』
    const clickableDivs = document.querySelectorAll('div[class*="clickable"]');
    for (const div of clickableDivs) {
        const textContent = div.textContent.trim();
        if (textContent.includes('内容收益明细')) {
            div.click();
            break; // 只点击第一个匹配的元素
        }
    }

    // 等待页面跳转完成
    await wait(500);

    // 定义回调函数，在日期选择完成后执行
    const dataDrawCallback = async () => {
        console.log('回调函数执行：开始获取数据并绘制图表...');

        // 重新获取下一页按钮（因为页面可能已刷新）
        const next_button = document.querySelector('button[class*="CreatorPagination-nextButton"]');

        if (next_button) {
            await wait(720);
            await get_data_draw(next_button);
        } else {
            console.error('未找到下一页按钮，尝试直接获取数据...');
            await get_data_draw(null);
        }
    };

    // 初始设置日期
    await set_date(yesterday_str, dataDrawCallback);

    // 启动日期选择器变化监控（支持第二次及后续的时间选择）
    console.log('启动日期选择器变化监控...');
    const stopMonitoring = monitorDatePickerChanges(dataDrawCallback);

    // 页面卸载时停止监控
    window.addEventListener('beforeunload', () => {
        stopMonitoring();
    });

    // 添加停止监控的全局函数（用于调试）
    window.stopDatePickerMonitoring = stopMonitoring;
})();
