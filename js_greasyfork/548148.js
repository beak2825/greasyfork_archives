// ==UserScript==
// @name         追剧查评分-豆瓣
// @namespace    http://tampermonkey.net/
// @version      1.6.0
// @description  打开豆瓣影视页面，将展示该影视的三位小数评分、历史折线图。
// @author       interest2
// @match        https://movie.douban.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      www.ratetend.com
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/548148/%E8%BF%BD%E5%89%A7%E6%9F%A5%E8%AF%84%E5%88%86-%E8%B1%86%E7%93%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/548148/%E8%BF%BD%E5%89%A7%E6%9F%A5%E8%AF%84%E5%88%86-%E8%B1%86%E7%93%A3.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("ai script, start");

    /******************************************************************************
     * ═══════════════════════════════════════════════════════════════════════
     * ║                                                                      ║
     * ║  🔧 1、脚本初始化与常量配置                                          ║
     * ║                                                                      ║
     * ═══════════════════════════════════════════════════════════════════════
     ******************************************************************************/

    const version = "1.6.0";
    const API_HOST = "https://www.ratetend.com";
    // const API_HOST = "http://localhost:2001";

    const TOOL_PREFIX = "ratetend_";
    const rateCss = '.rating_self strong';
    const UUID_KEY = TOOL_PREFIX + 'uuid';
    const STORED_API_KEY = TOOL_PREFIX + "api_key";
    const SHARE_FIRST_TIME_KEY = TOOL_PREFIX + "shareFirstTime";
    const YYYY_TO_MINUTE = "yyyy-MM-dd hh:mm";
    const SCORE = [10, 8, 6, 4, 2]; // 星级 → 分值

    let latestDate = "";
    let history;
    let echartsLoaded = false; // 标记ECharts是否已加载完成
    let dataReady = false; // 标记数据是否已准备完成
    let isObserving = false; // 防止重复启动监听器
    let hasExecuted = false; // 防止重复执行handleMovieData
    let fetchDataPromise = null; // 跟踪fetchShareData的Promise
    let fetchDataError = false; // 标记fetchShareData是否失败

    // 首次运行检测
    function checkFirstRun() {
        const uuid = localStorage.getItem(UUID_KEY);

        if (!uuid) {
            const uuid = generateUUID();
            localStorage.setItem(UUID_KEY, uuid);
        }

        const NOT_FIRST_RUN_KEY = TOOL_PREFIX + "notFirstRun";
        let notFirstRun = localStorage.getItem(NOT_FIRST_RUN_KEY);
        if(isEmpty(notFirstRun) || notFirstRun !== "true"){
            // 显示首次运行提示弹窗
            localStorage.setItem(NOT_FIRST_RUN_KEY, "true");
            showFirstRunPopup();
        }
    }

    // 首次运行提示弹窗
    function showFirstRunPopup() {
        const popup = createPopup();
        const content = popup.querySelector('.popup-content');

        content.innerHTML = FIRST_RUN_TEMPLATE();

        document.body.appendChild(popup);

        // 关闭按钮事件
        content.querySelector('.popup-close').onclick = () => {
            document.body.removeChild(popup);
        };

        // 点击遮罩关闭
        popup.onclick = (e) => {
            if (e.target === popup) {
                document.body.removeChild(popup);
            }
        };
    }

    checkFirstRun();

    // 立即尝试检测（脚本开始执行时）
    if (document.readyState === 'loading') {
        // 如果DOM还在加载中，等待 DOMContentLoaded
        console.log('DOM还在加载中，等待DOMContentLoaded事件');
    } else if (document.readyState === 'interactive') {
        // 如果DOM已加载完成但资源还在加载
        console.log('DOM已加载完成，立即检测');
        if (document.querySelector(rateCss)) {
            console.log('立即检测到评分元素');
            setTimeout(() => handleMovieData(), 0); // 异步执行，确保其他初始化完成
        }
    } else if (document.readyState === 'complete') {
        // 如果页面完全加载完成
        console.log('页面完全加载完成，立即检测');
        if (document.querySelector(rateCss)) {
            console.log('立即检测到评分元素');
            setTimeout(() => handleMovieData(), 0);
        }
    }

    loadECharts(() => {});

    /******************************************************************************
     * ║  🔧 2、DOM监听与资源加载                                            ║
     ******************************************************************************/

    // 使用MutationObserver监听DOM变化，尽早检测 rateEl 元素
    function startObserving() {
        if (isObserving) {
            console.log('监听器已在运行中');
            return;
        }

        isObserving = true;
        console.log('启动DOM监听器');

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    // 检查新添加的节点中是否包含目标元素
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查新节点本身
                            if (node.matches && node.matches(rateCss)) {
                                console.log('MutationObserver检测到评分元素');
                                observer.disconnect(); // 找到后立即停止监听
                                isObserving = false;
                                if (!hasExecuted) {
                                    handleMovieData();
                                }
                                return;
                            }
                            // 检查新节点的子元素
                            if (node.querySelector && node.querySelector(rateCss)) {
                                console.log('MutationObserver检测到评分元素');
                                observer.disconnect(); // 找到后立即停止监听
                                isObserving = false;
                                if (!hasExecuted) {
                                    handleMovieData();
                                }
                                return;
                            }
                        }
                    }
                }
            }
        });

        // 开始监听
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 设置超时，避免无限等待
        setTimeout(() => {
            if (isObserving) {
                observer.disconnect();
                isObserving = false;
                console.log('DOM监听超时，尝试直接检测');
                // 超时后尝试直接检测
                if (document.querySelector(rateCss)) {
                    handleMovieData();
                }
            }
        }, 10000); // 10秒超时

        return observer;
    }

    // 尽早检测评分元素
    function tryHandleMovieData() {
        if (hasExecuted) {
            console.log('handleMovieData已经执行过，跳过');
            return true;
        }

        if (document.querySelector(rateCss)) {
            console.log('检测到评分元素，触发handleMovieData');
            // 如果正在监听，立即停止
            if (isObserving) {
                console.log('停止DOM监听器');
                isObserving = false;
            }
            handleMovieData();
            return true;
        }
        return false;
    }

    // DOM内容加载完成时就开始检测
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOMContentLoaded');

        if (!tryHandleMovieData()) {
            console.log('DOMContentLoaded时未找到评分元素，开始监听');
            startObserving();
        }
    });

    window.onload = function() {
        console.log("onload");

        // 再次尝试检测（以防DOMContentLoaded时还没加载完成）
        if (!tryHandleMovieData()) {
            console.log('onload时仍未找到评分元素，继续监听');
            // 如果DOMContentLoaded时已经开始监听，这里就不需要重复启动
        }
    };

    // 使用 Cache API 进行缓存管理
    async function loadECharts(callback) {
        if (typeof echarts !== 'undefined') {
            echartsLoaded = true;
            callback();
            return;
        }

        const ECHARTS_URL = 'https://cdn.staticfile.org/echarts/4.3.0/echarts.min.js';
        const CACHE_NAME = 'userscript-echarts-cache';

        try {
            // 检查 Cache API 支持
            if ('caches' in window) {
                const cache = await caches.open(CACHE_NAME);
                let response = await cache.match(ECHARTS_URL);
                
                if (!response) {
                    // 缓存中没有，从网络获取并缓存
                    console.log('ECharts 首次加载，正在缓存...');
                    await cache.add(ECHARTS_URL);
                    response = await cache.match(ECHARTS_URL);
                } else {
                    console.log('ECharts 从缓存加载');
                }
                
                // 创建 script 标签加载
                const script = document.createElement('script');
                const blob = await response.blob();
                const objectURL = URL.createObjectURL(blob);
                
                script.src = objectURL;
                script.onload = () => {
                    URL.revokeObjectURL(objectURL);
                    echartsLoaded = true;
                    callback();
                };
                document.head.appendChild(script);
                
            } else {
                // 降级到普通加载
                loadEChartsNormal(callback);
            }
        } catch (error) {
            console.warn('Cache API 加载失败，降级到普通加载:', error);
            loadEChartsNormal(callback);
        }
    }

    // 普通加载方式（降级方案）
    function loadEChartsNormal(callback) {
        const script = document.createElement('script');
        script.src = 'https://cdn.staticfile.org/echarts/4.3.0/echarts.min.js';
        script.onload = () => {
            console.log('ECharts 普通方式加载完成');
            echartsLoaded = true;
            callback();
        };
        document.head.appendChild(script);
    }

    /******************************************************************************
     * ║  🔧 3、数据解析与服务器交互                                          ║
     ******************************************************************************/

    // 解析、提交、获取
    async function handleMovieData(){
        // 防重复执行
        if (hasExecuted) {
            console.log('handleMovieData 已经执行过，跳过');
            return;
        }

        hasExecuted = true;
        console.log('开始执行 handleMovieData');

        // 确保停止DOM监听器，避免重复触发
        if (isObserving) {
            console.log('handleMovieData执行，停止DOM监听器');
            isObserving = false;
        }

        let data = parsePageRate();
        addRateButtons(data.tag, data.year);

        // 提交数据（失败不阻塞后续逻辑）
        try {
            const commitResponse = await commitRateData(data);
            console.log('数据提交完成');
            let responseData;
            try {
                responseData = JSON.parse(commitResponse.responseText);
            } catch (e) {
                console.error('解析响应数据失败:', e);
                responseData = {};
            }
            let anonymousTagId = responseData.data;
            const HANDLED_MOVIEID_KEY = "handledMovieid";
            let handledMovieidList = localStorage.getItem(TOOL_PREFIX + HANDLED_MOVIEID_KEY);
            let movieidNotHandled = isEmpty(handledMovieidList) || handledMovieidList.indexOf(extractMovieid()) === -1;
            if (anonymousTagId > 0 && movieidNotHandled) {
                showTagChoicePopup(anonymousTagId, data.tag);
                localStorage.setItem(TOOL_PREFIX + HANDLED_MOVIEID_KEY, (handledMovieidList || "") + "," + extractMovieid());
            }
        } catch (e) {
            console.error('提交评分失败，改用本地/当前数据继续:', e);
        }

        // 拉取远端历史（失败则为空）
        let fetchRet = { saves: [], latestDate: null };
        fetchDataError = false;
        try {
            let fetchData = {
                "movieid": extractMovieid(),
                "uuid": localStorage.getItem(UUID_KEY)
            };
            // 保存Promise供按钮点击时等待
            fetchDataPromise = fetchShareData(fetchData);
            fetchRet = await fetchDataPromise;
        } catch (e) {
            console.error('拉取历史失败:', e);
            fetchDataError = true;
        } finally {
            // 完成后清除Promise引用
            fetchDataPromise = null;
        }

        history = fetchRet.saves || [];
        latestDate = fetchRet.latestDate ? commonFormatDate(fetchRet.latestDate, "MM-dd hh:mm") : "";
        console.log('数据获取完成，历史数据条数:', history ? history.length : 0);

        // 等待ECharts加载完成
        if (!echartsLoaded) {
            console.log('等待ECharts加载...');
            await new Promise((resolve) => {
                const checkEcharts = () => {
                    if (echartsLoaded) {
                        resolve();
                    } else {
                        setTimeout(checkEcharts, 100);
                    }
                };
                checkEcharts();
            });
            console.log('ECharts终于加载完成');
        }

        dataReady = true;
        console.log('所有数据准备完成，可以显示图表');
    }

    function parsePageRate() {
        var rateEl = document.querySelector(rateCss);
        var people = document.querySelector('.rating_people span');
        var stars = document.querySelectorAll('.ratings-on-weight .rating_per');

        let titleEl = document.querySelector('h1 [property="v:itemreviewed"]');
        if (!titleEl) return; // Not a movie page
        let title = titleEl.textContent;
        let yearEl = document.querySelector('h1 .year');
        let yearMatch = yearEl.textContent.match(/\d+/);
        let year = yearMatch[0];
        let initialReleaseDateEl = document.querySelector('#info [property="v:initialReleaseDate"]');
        let initialDate = extractDate(initialReleaseDateEl.textContent);

        const spanEpisodes = [...document.querySelectorAll('#info span.pl')]
            .find(span => span.textContent.trim().indexOf('集数') > -1);

        let episodeNum = 0;
        if (spanEpisodes) {
            const textNode = spanEpisodes.nextSibling;
            episodeNum = parseInt(textNode.textContent.trim(), 10);
        }

        let actors = [...document.querySelectorAll('a[rel="v:starring"]')]
            .map(a => a.textContent.trim()).slice(0, 4).join(' / ');

        let hasValidData = people && stars.length === 5 && rateEl;
        if(!hasValidData) return;

        var rateSum = 0;
        var starSum = 0;
        let starArray = [];

        for (var i = 0; i < stars.length; i++) {
            var star = parseFloat(stars[i].innerText);
            rateSum += SCORE[i] * star;
            starSum += star;
            starArray.push(star);
        }

        let rate = rateEl.textContent;
        let rateAvg = rateSum / 100.0;
        let rateDetail = correctRealRate(starSum, rateAvg);
        const detailSpan = document.createElement('span');
        detailSpan.className = 'rate-detail';
        detailSpan.textContent = ' (' + rateDetail + ')';
        rateEl.appendChild(detailSpan);

        let apiKey = localStorage.getItem(STORED_API_KEY);
        if(isEmpty(apiKey)) apiKey = "";

        let recordDate = (new Date()).format(YYYY_TO_MINUTE);
        const uuid = localStorage.getItem(UUID_KEY);

        return {
            "type": 4,
            "tag": title,
            "movieid": extractMovieid(),
            "year": year,
            "initialDate": initialDate,
            "episodeNum": episodeNum,
            "actors": actors,
            "star": starArray.toString(),
            "rate": rate,
            "rateDetail": rateDetail,
            "people": people.textContent,
            "date": recordDate,
            "apiKey": apiKey,
            "uuid": uuid,
            "version": version
        };
    }

    /******************************************************************************
     * ║  🔧 4、图表渲染与数据可视化                                          ║
     ******************************************************************************/
    async function showChartsPopup(title, year) {
        console.log("展示折线图");

        // 等待fetchShareData完成（如果正在进行）
        if (fetchDataPromise) {
            console.log('等待fetchShareData完成...');
            try {
                await fetchDataPromise;
                console.log('fetchShareData完成');
            } catch (e) {
                console.error('fetchShareData失败，继续使用已有数据:', e);
                fetchDataError = true;
            }
        }

        // 检查ECharts是否已加载，如果未加载则等待加载完成
        if (!echartsLoaded || typeof echarts === 'undefined') {
            console.log('ECharts未加载完成，等待加载...');
            alert('资源加载中，请稍候...');
            await new Promise((resolve) => {
                const checkEcharts = () => {
                    if (echartsLoaded && typeof echarts !== 'undefined') {
                        console.log('ECharts加载完成，继续执行');
                        resolve();
                    } else {
                        setTimeout(checkEcharts, 100);
                    }
                };
                checkEcharts();
            });
        }

        // 检查数据是否已准备完成
        if (!dataReady) {
            console.log('数据尚未准备完成，等待...');
            await new Promise((resolve) => {
                const checkDataReady = () => {
                    if (dataReady) {
                        console.log('数据准备完成，继续执行');
                        resolve();
                    } else {
                        setTimeout(checkDataReady, 100);
                    }
                };
                checkDataReady();
            });
        }

        if (!history || history.length === 0) {
            if (fetchDataError) {
                alert('服务器异常，请稍后重试');
            } else {
                alert('暂无历史数据');
            }
            return;
        }

        // 保存历史数据供切换时使用
        window.currentHistory = history;

        const popup = createPopup();
        const content = popup.querySelector('.popup-content');

        content.innerHTML = CHART_POPUP_TEMPLATE(title, year, latestDate);

        document.body.appendChild(popup);

        // 一次性渲染所有图表
        setTimeout(() => {
            ratingChart(history, 'day');
            starChart(history, 'day');
            peopleChart(history, 'day');
        }, 10);

        // 添加时间维度切换事件
        const timeTabs = content.querySelectorAll('.time-tab');
        timeTabs.forEach(tab => {
            tab.onclick = () => switchTimeTab(tab.dataset.time, timeTabs);
        });

        // 添加选项卡切换事件
        const tabs = content.querySelectorAll('.chart-tab');
        tabs.forEach(tab => {
            tab.onclick = () => switchChartTab(tab.dataset.chart, tabs);
        });

        // 关闭按钮事件
        content.querySelector('.popup-close').onclick = () => {
            try {
                chartInstances.rating && chartInstances.rating.dispose();
                chartInstances.star && chartInstances.star.dispose();
                chartInstances.people && chartInstances.people.dispose();
            } catch (e) {}
            chartInstances = { rating: null, star: null, people: null };
            document.body.removeChild(popup);
        };

        // 点击遮罩关闭
        popup.onclick = (e) => {
            if (e.target === popup) {
                try {
                    chartInstances.rating && chartInstances.rating.dispose();
                    chartInstances.star && chartInstances.star.dispose();
                    chartInstances.people && chartInstances.people.dispose();
                } catch (e) {}
                chartInstances = { rating: null, star: null, people: null };
                document.body.removeChild(popup);
            }
        };
    }

    // 新增时间维度切换函数
    function switchTimeTab(timeType, timeTabs) {
        // 移除所有时间选项卡的active类
        timeTabs.forEach(tab => tab.classList.remove('active'));
        
        // 激活当前时间选项卡
        const activeTimeTab = document.querySelector(`[data-time="${timeType}"]`);
        activeTimeTab.classList.add('active');
        
        // 重新渲染当前显示的图表
        const activeChartTab = document.querySelector('.chart-tab.active');
        const chartType = activeChartTab.dataset.chart;
        
        // 获取历史数据
        const history = window.currentHistory;
        
        // 重新渲染对应的图表
        setTimeout(() => {
            if (chartType === 'rating') {
                ratingChart(history, timeType);
            } else if (chartType === 'star') {
                starChart(history, timeType);
            } else if (chartType === 'people') {
                peopleChart(history, timeType);
            }
        }, 10);
    }

    // 选项卡切换函数
    function switchChartTab(chartType, tabs) {
        // 移除所有选项卡的active类
        tabs.forEach(tab => tab.classList.remove('active'));

        // 隐藏所有图表（不使用display: none，避免宽度为0）
        document.getElementById('ratingChart').classList.add('hidden-chart');
        document.getElementById('starChart').classList.add('hidden-chart');
        document.getElementById('peopleChart').classList.add('hidden-chart');

        // 激活当前选项卡
        const activeTab = document.querySelector(`[data-chart="${chartType}"]`);
        activeTab.classList.add('active');

        // 显示对应图表
        const targetId = chartType + 'Chart';
        const targetChart = document.getElementById(targetId);
        targetChart.classList.remove('hidden-chart');

        // 获取当前时间维度
        const activeTimeTab = document.querySelector('.time-tab.active');
        const timeType = activeTimeTab ? activeTimeTab.dataset.time : 'day';
        
        // 重新渲染图表
        const history = window.currentHistory;
        setTimeout(() => {
            if (chartType === 'rating') {
                ratingChart(history, timeType);
            } else if (chartType === 'star') {
                starChart(history, timeType);
            } else if (chartType === 'people') {
                peopleChart(history, timeType);
            }
            
            // 触发resize
            const chartInstance = chartInstances[chartType];
            if (chartInstance) {
                chartInstance.resize();
            }
        }, 10);
    }

    // 缓存图表实例，切换时触发 resize
    let chartInstances = { rating: null, star: null, people: null };

    // 创建series的工具函数，自动应用公共配置
    function createSeries(oneFlag, seriesConfig, commonConfig = {}) {
        const chartType = oneFlag ? 'bar' : 'line';

        const defaultConfig = {
            symbol: 'none',
            type: chartType,
            ...commonConfig
        };

        if (Array.isArray(seriesConfig)) {
            return seriesConfig.map(config => ({ ...defaultConfig, ...config }));
        }
        return { ...defaultConfig, ...seriesConfig };
    }

    // 基础option配置生成器
    function createBaseOption(legendData, dates, customTooltip = null) {
        // 计算interval值：当数据点超过10个时，动态调整显示密度
        const dataLength = dates.length;
        let interval = 'auto';
        if (dataLength > 10) {
            // 计算interval，使显示的标签数量控制在10个左右
            interval = Math.floor(dataLength / 10);
            if (interval < 1) interval = 1;
        }

        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross' }
            },
            legend: { data: legendData, top: 30 },
            grid: {
                left: '3%', right: '4%', bottom: '3%', top: '20%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: dates,
                axisLabel: {
                    rotate: 45,
                    fontSize: 14,
                    interval: interval
                }
            }
        };

        if (customTooltip) {
            option.tooltip = { ...option.tooltip, ...customTooltip };
        }

        return option;
    }
    // 评分图表
    function ratingChart(history, timeType = 'day') {
        const chartContainer = document.getElementById('ratingChart');
        if (!chartContainer || typeof echarts === 'undefined') return;

        try { chartInstances.rating && chartInstances.rating.dispose(); } catch (e) {}
        const myChart = echarts.init(chartContainer);
        chartInstances.rating = myChart;

        // 根据时间维度处理数据
        let processedHistory, dates, rates, rateDetails;
        
        if (timeType === 'day') {
            // 按天聚合数据
            processedHistory = aggregateByDay(history);
            dates = formatDates(processedHistory);
            rates = processedHistory.map(item => parseFloat(item.rate));
            rateDetails = processedHistory.map(item => parseFloat(item.rateDetail));
        } else {
            // 按小时显示数据
            processedHistory = history.sort((a, b) => new Date(a.recordDate) - new Date(b.recordDate));
            dates = formatDatesHour(processedHistory);
            rates = processedHistory.map(item => parseFloat(item.rate));
            rateDetails = processedHistory.map(item => parseFloat(item.rateDetail));
        }

        const minRate = Math.min(...rates, ...rateDetails);
        const maxRate = Math.max(...rates, ...rateDetails);
        const delta = 0.05;
        const dynamicMin = Math.max(0, minRate - delta);
        const dynamicMax = maxRate + delta;

        const option = createBaseOption(['评分', '小分'], dates);

        option.yAxis = {
            type: 'value', name: '评分',
            min: dynamicMin.toFixed(2), max: dynamicMax.toFixed(2),
            minInterval: 0.05,
            axisLabel: { textStyle: { fontSize: 14 } },
            splitLine: { show: false }
        };

        option.series = createSeries(dates.length === 1, [
            { name: '评分', data: rates, lineStyle: { color: "#275fe6", width: 3 }, itemStyle: { color: "#275fe6" } },
            { name: '小分', data: rateDetails, lineStyle: { color: "#eb3c10", width: 2 }, itemStyle: { color: "#eb3c10" } }
        ]);

        myChart.setOption(option);
        myChart.resize();
    }

    // 星级图表
    function starChart(history, timeType = 'day') {
        const chartContainer = document.getElementById('starChart');
        if (!chartContainer || typeof echarts === 'undefined') return;

        try { chartInstances.star && chartInstances.star.dispose(); } catch (e) {}
        const myChart = echarts.init(chartContainer);
        chartInstances.star = myChart;

        // 根据时间维度处理数据
        let processedHistory, dates;
        
        if (timeType === 'day') {
            processedHistory = aggregateByDay(history);
            dates = formatDates(processedHistory);
        } else {
            processedHistory = history.sort((a, b) => new Date(a.recordDate) - new Date(b.recordDate));
            dates = formatDatesHour(processedHistory);
        }

        const starData = [[], [], [], [], []];
        processedHistory.forEach(item => {
            const starsArray = item.star ? item.star.split(',').map(s => parseFloat(s.trim())) : [0, 0, 0, 0, 0];
            starData.forEach((arr, index) => arr.push(starsArray[index] || 0));
        });

        const starColors = ["#fc4646", "#fc8132", "#c0c0c0", "#60aaf9", "#0bb73b"];
        const starNames = ['五星', '四星', '三星', '二星', '一星'];

        const option = createBaseOption(starNames, dates);

        option.yAxis = {
            type: 'value', name: '单位（%）', min: 0, minInterval: 0.05,
            axisLabel: { formatter: '{value}', textStyle: { fontSize: 14 } },
            splitLine: { show: false }
        };

        option.series = createSeries(dates.length === 1,
            starData.map((data, index) => ({
                name: starNames[index], data: data,
                lineStyle: { color: starColors[index], width: 2 },
                itemStyle: { color: starColors[index] }
            }))
        );

        myChart.setOption(option);
        myChart.resize();
    }

    // 人数图表
    function peopleChart(history, timeType = 'day') {
        const chartContainer = document.getElementById('peopleChart');
        if (!chartContainer || typeof echarts === 'undefined') return;

        try { chartInstances.people && chartInstances.people.dispose(); } catch (e) {}
        const myChart = echarts.init(chartContainer);
        chartInstances.people = myChart;

        // 根据时间维度处理数据
        let processedHistory, dates;
        
        if (timeType === 'day') {
            processedHistory = aggregateByDay(history);
            dates = formatDates(processedHistory);
        } else {
            processedHistory = history.sort((a, b) => new Date(a.recordDate) - new Date(b.recordDate));
            dates = formatDatesHour(processedHistory);
        }

        const originalPeople = processedHistory.map(item => {
            const peopleStr = item.people.toString();
            const match = peopleStr.match(/\d+/);
            return match ? parseInt(match[0]) : 0;
        });

        const people = originalPeople.map(num => num / 1000);
        const minPeople = Math.min(...people);
        const maxPeople = Math.max(...people);
        let delta = maxPeople - minPeople;
        delta = delta < 1 ? 1 : delta;

        let dynamicMin, dynamicMax;
        if (delta < maxPeople / 10) {
            dynamicMin = Math.round(maxPeople - delta * 10);
            dynamicMax = Math.round(maxPeople + delta);
        } else {
            dynamicMin = 0;
            dynamicMax = undefined;
        }

        const customTooltip = {
            formatter: function(params) {
                const dataIndex = params[0].dataIndex;
                const date = params[0].axisValue;
                const originalValue = originalPeople[dataIndex];
                return `${date}<br/>评分人数: ${originalValue.toLocaleString()}人`;
            }
        };

        const option = createBaseOption(['评分人数'], dates, customTooltip);

        option.yAxis = {
            type: 'value', name: '单位：千人',
            min: dynamicMin, max: dynamicMax, minInterval: 1,
            axisLabel: { textStyle: { fontSize: 14 } },
            splitLine: { show: false }
        };

        option.series = createSeries(dates.length === 1, {
            name: '评分人数', data: people,
            lineStyle: { color: "#275fe6", width: 3 },
            itemStyle: { color: "#275fe6" },
            areaStyle: {
                color: {
                    type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: 'rgba(39, 95, 230, 0.3)' },
                        { offset: 1, color: 'rgba(39, 95, 230, 0.1)' }
                    ]
                }
            }
        });

        myChart.setOption(option);
        myChart.resize();
    }

    /******************************************************************************
     * ═══════════════════════════════════════════════════════════════════════
     * ║                                                                      ║
     * ║  🔧 5、UI交互与弹窗管理                                              ║
     * ║                                                                      ║
     * ═══════════════════════════════════════════════════════════════════════
     ******************************************************************************/

    function createPopup() {
        const popup = document.createElement('div');
        popup.className = 'popup-overlay';
        popup.innerHTML = '<div class="popup-content"></div>';
        return popup;
    }

    function addRateButtons(title, year) {
        // 检查是否已经添加过按钮
        if (document.querySelector('.chart-buttons')) return;

        var rate = document.querySelector('.rating_self strong');

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'chart-buttons';

        const chartBtn = document.createElement('button');
        chartBtn.className = 'rate-btn';
        chartBtn.textContent = '折线图';
        chartBtn.onclick = async () => await showChartsPopup(title, year);

        const tableBtn = document.createElement('button');
        tableBtn.className = 'rate-btn';
        tableBtn.textContent = '表格';
        tableBtn.onclick = async () => await showTablePopup(title, year);

        // 新增API Key设置按钮
        const apiKeyBtn = document.createElement('button');
        apiKeyBtn.className = 'rate-btn';
        apiKeyBtn.textContent = '设置';
        apiKeyBtn.onclick = () => showApiKeyPopup();

        // 新增分享按钮
        const shareBtn = document.createElement('button');
        shareBtn.className = 'rate-btn';
        shareBtn.textContent = '分享';
        shareBtn.onclick = () => handleShareClick();

        buttonsContainer.appendChild(chartBtn);
        buttonsContainer.appendChild(tableBtn);
        buttonsContainer.appendChild(apiKeyBtn);
        // buttonsContainer.appendChild(shareBtn);

        rate.insertAdjacentElement('afterend', buttonsContainer);
    }

    async function showTablePopup(title, year) {
        // 等待fetchShareData完成（如果正在进行）
        if (fetchDataPromise) {
            console.log('等待fetchShareData完成...');
            try {
                await fetchDataPromise;
                console.log('fetchShareData完成');
            } catch (e) {
                console.error('fetchShareData失败，继续使用已有数据:', e);
                fetchDataError = true;
            }
        }

        // 检查数据是否已准备完成
        if (!dataReady) {
            console.log('数据尚未准备完成，等待...');
            await new Promise((resolve) => {
                const checkDataReady = () => {
                    if (dataReady) {
                        console.log('数据准备完成，继续执行');
                        resolve();
                    } else {
                        setTimeout(checkDataReady, 100);
                    }
                };
                checkDataReady();
            });
        }

        if (history === undefined || history.length === 0) {
            if (fetchDataError) {
                alert('服务器异常，请稍后重试');
            } else {
                alert('暂无历史数据');
            }
            return;
        }
        const popup = createPopup();
        const content = popup.querySelector('.popup-content');

        // 按时间倒序排列，最新的记录在前面
        const sortedHistory = [...history].sort((a, b) => new Date(b.recordDate) - new Date(a.recordDate));
        content.innerHTML = TABLE_TEMPLATE(sortedHistory, title, year);

        document.body.appendChild(popup);

        // 关闭按钮事件
        content.querySelector('.popup-close').onclick = () => {
            document.body.removeChild(popup);
        };

        // 点击遮罩关闭
        popup.onclick = (e) => {
            if (e.target === popup) {
                document.body.removeChild(popup);
            }
        };
    }

    function showApiKeyPopup() {
        const popup = createPopup();
        const content = popup.querySelector('.popup-content');

        const currentApiKey = localStorage.getItem(STORED_API_KEY) || '';

        content.innerHTML = API_KEY_TEMPLATE(currentApiKey);

        document.body.appendChild(popup);

        // 保存API Key函数
        function saveApiKey() {
            const apiKey = document.getElementById('apiKeyInput').value.trim();
            if (apiKey) {
                localStorage.setItem(STORED_API_KEY, apiKey);
                alert('API Key 保存成功！');
                document.body.removeChild(popup);
            } else {
                alert('请输入有效的API Key！');
            }
        }

        // 绑定事件监听器
        content.querySelector('#saveBtn').onclick = saveApiKey;
        content.querySelector('#cancelBtn').onclick = () => {
            document.body.removeChild(popup);
        };
        content.querySelector('#showFirstRunBtn').onclick = () => {
            document.body.removeChild(popup);
            showFirstRunPopup();
        };

        // 关闭按钮事件
        content.querySelector('.popup-close').onclick = () => {
            document.body.removeChild(popup);
        };

        // 点击遮罩关闭
        popup.onclick = (e) => {
            if (e.target === popup) {
                document.body.removeChild(popup);
            }
        };

        // 聚焦输入框
        setTimeout(() => {
            document.getElementById('apiKeyInput').focus();
        }, 100);

        // 支持回车键保存
        document.getElementById('apiKeyInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveApiKey();
            }
        });
    }

    function showTagChoicePopup(anonymousTagId, title) {
        const popup = createPopup();
        const content = popup.querySelector('.popup-content');

        content.innerHTML = TAG_CHOICE_TEMPLATE(title);

        document.body.appendChild(popup);

        // 绑定按钮事件
        content.querySelector('#createAndShareBtn').onclick = () => {
            sendChoiceToServer(1, anonymousTagId);
            document.body.removeChild(popup);
        };

        content.querySelector('#createNotShareBtn').onclick = () => {
            sendChoiceToServer(2, anonymousTagId);
            document.body.removeChild(popup);
        };

        content.querySelector('#notCreateBtn').onclick = () => {
            sendChoiceToServer(3, anonymousTagId);
            document.body.removeChild(popup);
        };

        // 关闭按钮事件
        content.querySelector('.popup-close').onclick = () => {
            // 默认选择不创建
            sendChoiceToServer(3, anonymousTagId);
            document.body.removeChild(popup);
        };

        // 点击遮罩关闭（默认选择不创建）
        popup.onclick = (e) => {
            if (e.target === popup) {
                sendChoiceToServer(3, anonymousTagId);
                document.body.removeChild(popup);
            }
        };
    }

    function showResultPopup(type, message) {
        const popup = createPopup();
        const content = popup.querySelector('.popup-content');

        content.innerHTML = RESULT_POPUP_TEMPLATE(type, message);

        document.body.appendChild(popup);

        // 自动关闭
        setTimeout(() => {
            if (document.body.contains(popup)) {
                document.body.removeChild(popup);
            }
        }, 3000);

        // 关闭按钮事件
        content.querySelector('.popup-close').onclick = () => {
            document.body.removeChild(popup);
        };

        // 确定按钮事件
        content.querySelector('.result-btn').onclick = () => {
            document.body.removeChild(popup);
        };

        // 点击遮罩关闭
        popup.onclick = (e) => {
            if (e.target === popup) {
                document.body.removeChild(popup);
            }
        };
    }

    function handleShareClick() {
        const isFirstTime = localStorage.getItem(SHARE_FIRST_TIME_KEY);
        
        if (isEmpty(isFirstTime) || isFirstTime !== "true") {
            // 首次点击，显示介绍弹窗
            localStorage.setItem(SHARE_FIRST_TIME_KEY, "true");
            showShareIntroPopup();
        } else {
            // 非首次点击，直接请求分享接口
            requestShareData();
        }
    }

    function showShareIntroPopup() {
        const popup = createPopup();
        const content = popup.querySelector('.popup-content');

        content.innerHTML = SHARE_INTRO_TEMPLATE();

        document.body.appendChild(popup);

        // 关闭按钮事件
        content.querySelector('.popup-close').onclick = () => {
            document.body.removeChild(popup);
        };

        // 确定按钮事件
        content.querySelector('#shareConfirmBtn').onclick = () => {
            document.body.removeChild(popup);
            requestShareData();
        };

        // 点击遮罩关闭
        popup.onclick = (e) => {
            if (e.target === popup) {
                document.body.removeChild(popup);
            }
        };
    }

    function handleShareResponse(data) {
        let message = '';
        let type = 'success';
        
        switch(data) {
            case 1:
                message = '分享成功！';
                break;
            case 2:
                message = '分享失败，请稍后重试';
                type = 'error';
                break;
            case 3:
                message = '该内容已分享过';
                type = 'error';
                break;
            default:
                message = '未知响应，请稍后重试';
                type = 'error';
        }
        
        showResultPopup(type, message);
    }

    /******************************************************************************
     * ═══════════════════════════════════════════════════════════════════════
     * ║                                                                      ║
     * ║  🔧 6、工具函数、样式与模板                                          ║
     * ║                                                                      ║
     * ═══════════════════════════════════════════════════════════════════════
     ******************************************************************************/

    // 生成简单的UUID
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function isEmpty(item) {
        if (item === null || item === undefined || item.length === 0 || item === "null") {
            return true;
        } else {
            return false;
        }
    }

    /* 
     *  时间相关函数 
    */
    // 格式化日期
    Date.prototype.format = function(format) {
        var o = {
            "M+" : this.getMonth() + 1, // month
            "d+" : this.getDate(), // day
            "h+" : this.getHours(), // hour
            "m+" : this.getMinutes(), // minute
            "s+" : this.getSeconds(), // second
            "q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
            "S" : this.getMilliseconds()
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
        }
        for ( var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    };

    // 提取日期
    function extractDate(str){
        const dateMatch = str.match(/\d{4}-\d{2}-\d{2}/);

        if (dateMatch) {
            const dateStr = dateMatch[0];
            console.log(dateStr);
            return dateStr;
        } else {
            console.log("未找到日期");
            return "";
        }
    }

    // 格式化日期列表
    function formatDates(history) {
        return history.map(item => {
            return commonFormatDate(item.recordDate, "MM-dd");
        });
    }

    // 格式化单个日期
    function commonFormatDate(dateStr, template) {
        return yearPrefix(dateStr) + new Date(dateStr).format(template);
    }

    function yearPrefix(dateStr) {
        const date = new Date(dateStr);
        const currentYear = new Date().getFullYear();
        const dateYear = date.getFullYear();

        return dateYear === currentYear ? "" : dateYear + "-";
    }

    // 判断是否为当天数据
    function isToday(dateStr) {
        const date = new Date(dateStr);
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    // 按天聚合数据，每天只保留最晚的记录
    function aggregateByDay(history) {
        const dailyMap = new Map();

        history.forEach(item => {
            const date = new Date(item.recordDate);
            const dayKey = date.toISOString().split('T')[0]; // 获取 YYYY-MM-DD 格式的日期

            if (!dailyMap.has(dayKey) || new Date(item.recordDate) > new Date(dailyMap.get(dayKey).recordDate)) {
                dailyMap.set(dayKey, item);
            }
        });

        // 转换为数组并按日期排序
        return Array.from(dailyMap.values()).sort((a, b) => new Date(a.recordDate) - new Date(b.recordDate));
    }

    // 按小时格式化日期
    function formatDatesHour(history) {
        return history.map(item => {
            const date = new Date(item.recordDate);
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hour = String(date.getHours()).padStart(2, '0');
            
            // 统一显示月-日 小时格式
            return `${month}-${day} ${hour}点`;
        });
    }

    // 普通工具函数
    function extractMovieid(){
        let url = window.location.href;
        const parts = url.split('/');
        const index = parts.indexOf('subject');
        return index !== -1 ? parts[index + 1] : '';
    }

    function correctRealRate(starSum, rate) {
        starSum = starSum.toFixed(1) * 10
        var rM;
        switch (starSum){
            case 999:
                rM = rate + 0.006;
                break;
            case 998:
                rM = rate + 0.012;
                break;
            case 1001:
                rM = rate - 0.006;
                break;
            case 1002:
                rM = rate - 0.012;
                break;
            default:
                rM = rate;
        }
        return rM.toFixed(3);
    }


    function fetchShareData(data){
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: API_HOST + "/web/browserSaves",
                data: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function(response) {
                    // 检查HTTP状态码，非2xx视为服务器异常
                    if (response.status < 200 || response.status >= 300) {
                        console.error('服务器返回错误状态码:', response.status);
                        reject(response);
                        return;
                    }
                    try {
                        const ret = JSON.parse(response.responseText) || {};
                        // 兼容多种返回格式：{saves, latestDate} 或 {data:{saves, latestDate}} 或 data为数组
                        const payload = ret.data ? ret.data : ret;
                        const saves = Array.isArray(payload) ? payload : (payload.saves || payload.data || []);
                        const latestDate = payload.latestDate || ret.latestDate;
                        resolve({
                            saves: Array.isArray(saves) ? saves : [],
                            latestDate: latestDate
                        });
                    } catch (e) {
                        console.error('解析响应失败:', e);
                        reject(e);
                    }
                },
                onerror: function(error) {
                    console.error('请求失败:', error);
                    reject(error);
                }
            });
        });
    }

    function commitRateData(data){
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: API_HOST + "/web/commitRateData",
                data: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function(response) {
                    console.log(response.responseText);
                    resolve(response);
                },
                onerror: function(error) {
                    console.error('请求失败:', error);
                    reject(error);
                }
            });
        });
    }

    // 服务器请求函数
    function sendChoiceToServer(choice, anonymousTagId) {
        const choiceData = {
            choice: choice,
            anonymousTagId: anonymousTagId,
            apiKey: localStorage.getItem(STORED_API_KEY) || ""
        };
        console.log(choiceData);

        GM_xmlhttpRequest({
            method: "POST",
            url: API_HOST + "/web/receiveChoice",
            data: JSON.stringify(choiceData),
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                console.log('选择结果发送成功:', response.responseText);
                try {
                    const result = JSON.parse(response.responseText);
                    if(result.data === "1"){
                        showResultPopup('success', "操作完成");
                    } else {
                        showResultPopup('error', '操作失败');
                    }
                } catch (e) {
                    if(response.responseText === 'true' || response.responseText.includes('success')){
                        showResultPopup('success', "操作完成");
                    } else {
                        showResultPopup('error', '操作失败');
                    }
                }
            },
            onerror: function(error) {
                console.error('发送选择结果失败:', error);
                showResultPopup('error', '网络请求失败，请检查网络连接');
            }
        });
    }

    function requestShareData() {
        const shareData = {
            uuid: localStorage.getItem(UUID_KEY),
            apikey: localStorage.getItem(STORED_API_KEY) || "",
            movieid: extractMovieid()
        };

        console.log('请求分享数据:', shareData);

        GM_xmlhttpRequest({
            method: "POST",
            url: API_HOST + "/web/share",
            data: JSON.stringify(shareData),
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                console.log('分享请求响应:', response.responseText);
                try {
                    const result = JSON.parse(response.responseText);
                    handleShareResponse(result.data);
                } catch (e) {
                    console.error('解析分享响应失败:', e);
                    showResultPopup('error', '分享请求失败，请稍后重试');
                }
            },
            onerror: function(error) {
                console.error('分享请求失败:', error);
                showResultPopup('error', '网络请求失败，请检查网络连接');
            }
        });
    }

    // 添加弹窗样式
    GM_addStyle(`
        /* ========== 弹窗基础样式 ========== */
        .popup-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 10000; }
        .popup-content { background: white; padding: 20px; border-radius: 8px; max-width: 1500px; min-width: 600px; max-height: 90vh; overflow-y: auto; position: relative; }
        .popup-close { position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer; color: #999; }
        .popup-close:hover { color: #333; }
        
        /* ========== 按钮样式 ========== */
        .chart-buttons { margin-left: 10px; display: inline-block; }
        .rate-btn { background: #ec7258; color: white; border: none; padding: 3px; margin: 3px; border-radius: 4px; cursor: pointer; font-size: 12px; }
        .rate-btn:hover { background: #369647; }
        .popup-buttons { text-align: right; margin-top: 20px; }
        .popup-btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; margin-left: 10px; }
        .popup-btn-primary { background: #ec7258; color: white; }
        .popup-btn-primary:hover { background: #369647; }
        .popup-btn-secondary { background: #f5f5f5; color: #333; }
        .popup-btn-secondary:hover { background: #e0e0e0; }
        .choice-buttons { margin-top: 30px; text-align: center; }
        .choice-btn { padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; margin: 0 10px; min-width: 120px; }
        .choice-btn-primary { background: #ec7258; color: white; font-weight: bold; box-shadow: 0 2px 4px rgba(236, 114, 88, 0.3); }
        .choice-btn-primary:hover { background: #d85a3f; transform: translateY(-1px); box-shadow: 0 4px 8px rgba(236, 114, 88, 0.4); }
        .choice-btn-secondary { background: #f5f5f5; color: #666; border: 1px solid #ddd; }
        .choice-btn-secondary:hover { background: #e8e8e8; color: #333; }
        
        /* ========== 图表相关样式 ========== */
        .chart-container { width: 100%; height: 400px; margin-top: 2px; border: 1px solid #ddd; }
        .chart-stack { position: relative; width: 100%; height: 400px; margin-top: 20px; }
        .chart-stack .chart-container { position: absolute; top: 0; left: 0; right: 0; bottom: 0; margin-top: 0; }
        .hidden-chart { visibility: hidden; position: absolute; left: -99999px; }
        .chart-tabs { display: flex; margin-top: 2px; margin-bottom: 15px; gap: 8px; }
        .chart-tab, .time-tab { background: white; cursor: pointer; transition: all 0.3s ease; outline: none; }
        .chart-tab { width: 100px; border: 1px solid #ec7258; padding: 4px 10px; font-size: 14px; color: #ec7258; border-radius: 20px; }
        .chart-tab:hover { border-color: #ec7258; color: #ec7258; background: #fff5f3; }
        .chart-tab.active { background: #ec7258; color: white; border-color: #ec7258; font-weight: normal; }
        .time-tabs { display: flex; margin-top: 5px; margin-bottom: 15px; gap: 8px; }
        .time-tab { border: 1px solid #4a90e2; padding: 6px 16px; font-size: 13px; color: #222; border-radius: 15px; }
        .time-tab:hover { border-color: #4a90e2; color: #4a90e2; }
        .time-tab.active { background: #4a90e2; color: white; border-color: #4a90e2; font-weight: normal; }
        
        /* ========== 表格样式 ========== */
        .popup-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .popup-table th, .popup-table td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; font-size: 13px; }
        .popup-table th { background-color: #f5f5f5; font-weight: bold; color: #666; }
        .popup-table tr:nth-child(even) { background-color: #fafafa; }
        .popup-table .star-col { text-align: center; min-width: 50px; }
        
        /* ========== 内容区域样式 ========== */
        .first-run-content { line-height: 1.6; }
        .first-run-content ul { margin: 10px 0; padding-left: 20px; }
        .first-run-content li { margin: 5px 0; }
        .first-run-section .popup-buttons { text-align: left; }
        .api-key-input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; margin: 10px 0; box-sizing: border-box; }
        .api-key-content { display: flex; flex-direction: column; }
        .api-key-section { margin-bottom: 20px; }
        .tag-choice-content { line-height: 1.6; text-align: center; padding: 20px 0; }
        .tag-choice-content p { margin: 10px 0; font-size: 16px; }
        .result-popup-content { text-align: center; padding: 20px; }
        .result-icon-success, .result-icon-error { width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: bold; margin: 0 auto 20px; color: white; }
        .result-icon-success { background: #52c41a; }
        .result-icon-error { background: #ff4d4f; }
        .result-message { font-size: 16px; color: #333; margin: 15px 0; line-height: 1.5; }
        .share-intro-content { line-height: 1.6; padding: 20px 0; }
        .share-intro-text { margin: 20px 0; }
        .share-intro-text ul { margin: 10px 0; padding-left: 20px; }
        .share-intro-text li { margin: 5px 0; }
        
        /* ========== 工具类样式 ========== */
        .margin-left { margin-left: 15px; }
        .divider { height: 1px; background-color: #e0e0e0; margin: 2px 0; }
        .rate-detail { color: #ec7258; }
        
        @media (max-width: 900px) {
            .popup-content { width: 95%; min-width: 300px; max-width: none; }
        }
    `);

// HTML模板常量函数
    function CHART_POPUP_TEMPLATE(title, year, updatedAt) {
        return `
    <button class="popup-close">&times;</button>
    <h2>${title} (${year}) 折线图</h2>
    <span style="font-size: 16px">更新于 ${updatedAt}</span>
    <div class="chart-tabs">
        <button class="chart-tab active" data-chart="rating">评分</button>
        <button class="chart-tab" data-chart="star">星级</button>
        <button class="chart-tab" data-chart="people">人数</button>
    </div>
    <div class="time-tabs">
        <button class="time-tab active" data-time="day">按天</button>
        <button class="time-tab" data-time="hour">按小时</button>
    </div>
    <div class="chart-stack">
        <div id="ratingChart" class="chart-container"></div>
        <div id="starChart" class="chart-container hidden-chart"></div>
        <div id="peopleChart" class="chart-container hidden-chart"></div>
    </div>
`;
    }

// HTML模板常量函数
    function FIRST_RUN_TEMPLATE() {
        return `
    <button class="popup-close">&times;</button>
    <h2>欢迎使用追剧查评分脚本！</h2>
    <div class="first-run-content">
        <p>🎬 功能：</p>
        <ul>
            <li>每次打开或刷新页面，展示三位小数的评分，并帮您记录到云端；</li>
            <li>在云端与其他用户的数据汇聚，从而“众筹”得到评分折线图，展示在本页面。</li>
        </ul>
        <br>
        <div>💡 记录的数据是否公开？视情况而定：</div>
        <ul>
            <li>1、若您没有为本脚本设置 API Key，则是公开的；</li>
            <li>2、若设置了 API Key：</li>
                <div class="margin-left">1）若您在<a href="https://www.ratetend.com/web/mySave" target="_blank"> 工具网站 </a>已创建过与影视剧名字完全相同的标签，且未分享，则本脚本记录的数据同样是仅自己可见；</div>
                <div class="margin-left">2）若您没创建过、且别人也未分享过，则大致上对于非冷门的国内影视，会在首次访问时弹窗，让您自行决定是否公开数据。</div>
            <li></li>
        </ul>

        <br>
        <div>📌 其他说明</div>
        <ul>
            <li>本弹窗只出现一次，如需再次查看，可后续点击页面上的“设置”按钮；API Key 的设置同样在该处。</li>
            <li>若使用过程觉得有问题，可在 <a href="https://www.ratetend.com/web/msgBoard" target="_blank"> 工具网站 </a>留言。</li>
        </ul>
        <div class="popup-buttons">
            <button class="popup-btn popup-btn-primary" onclick="this.closest('.popup-overlay').remove()">开始使用</button>
        </div>
    </div>
`;
    }

    function API_KEY_TEMPLATE(currentApiKey) {
        return `
    <button class="popup-close">&times;</button>
    <h2>API Key 设置</h2>
    <div class="api-key-content">
        <div class="api-key-section">
            <p>API Key 是指您在"追剧查评分"网站的身份凭证，<br>
            填写它后，后续打开或刷新本网页，评分数据就能关联到您账号下创建的对应影视。<br>
            获取方式：在 <a href="https://www.ratetend.com/web/mySettings" target="_blank">该网站</a> 登录后，在"账号设置"菜单界面获取。</p>
            <input type="text" id="apiKeyInput" class="api-key-input" placeholder="请填写api key" value="${currentApiKey}">
            <div class="popup-buttons">
                <button class="popup-btn popup-btn-secondary" id="cancelBtn">取消</button>
                <button class="popup-btn popup-btn-primary" id="saveBtn">保存</button>
            </div>
        </div>
        <div class="divider"></div>
        <div class="first-run-section">
            <h2>查看脚本首次运行的弹窗内容</h2>
            <div class="popup-buttons">
                <button class="popup-btn popup-btn-primary" id="showFirstRunBtn">查看</button>
            </div>
        </div>
    </div>
`;
    }

    // 结果弹窗模板
    function RESULT_POPUP_TEMPLATE(type, message) {
        const isSuccess = type === 'success';
        const iconClass = isSuccess ? 'result-icon-success' : 'result-icon-error';
        const iconSymbol = isSuccess ? '✓' : '✗';
        const titleText = isSuccess ? '操作成功' : '操作失败';
        
        return `
    <button class="popup-close">&times;</button>
    <div class="result-popup-content">
        <div class="${iconClass}">${iconSymbol}</div>
        <h2>${titleText}</h2>
        <p class="result-message">${message}</p>
        <div class="popup-buttons">
            <button class="popup-btn popup-btn-primary result-btn">确定</button>
        </div>
    </div>
`;
    }

    function TABLE_TEMPLATE(history, title, year) {
        return `
    <button class="popup-close">&times;</button>
    <h2>${title} (${year}) 评分历史记录</h2>
    <table class="popup-table">
        <thead>
            <tr>
                <th>时间</th>
                <th>评分</th>
                <th>小分</th>
                <th>人数</th>
                <th class="star-col">五星</th>
                <th class="star-col">四星</th>
                <th class="star-col">三星</th>
                <th class="star-col">二星</th>
                <th class="star-col">一星</th>
                <th class="star-col">合计</th>
            </tr>
        </thead>
        <tbody>
            ${history.map(item => {
            const starsArray = item.star ? item.star.split(',').map(s => parseFloat(s.trim())) : [0, 0, 0, 0, 0];
            // 计算五星到一星的总和，保留一位小数
            const total = starsArray.reduce((sum, star) => sum + star, 0).toFixed(1);
            // 处理日期显示逻辑
            const displayDate = commonFormatDate(item.recordDate, "MM-dd hh点");
            // 判断是否为当天数据，如果是则添加红色样式
            const timeStyle = isToday(item.recordDate) ? 'style="color: #eb3c10;"' : '';
            return `
                <tr>
                    <td ${timeStyle}>${displayDate}</td>
                    <td>${item.rate}</td>
                    <td>${item.rateDetail}</td>
                    <td>${item.people}</td>
                    <td class="star-col">${starsArray[0] || 0}</td>
                    <td class="star-col">${starsArray[1] || 0}</td>
                    <td class="star-col">${starsArray[2] || 0}</td>
                    <td class="star-col">${starsArray[3] || 0}</td>
                    <td class="star-col">${starsArray[4] || 0}</td>
                    <td class="star-col">${total}</td>
                </tr>
                `;
        }).join('')}
        </tbody>
    </table>
`;
    }

    function TAG_CHOICE_TEMPLATE(title) {
        return `
    <button class="popup-close">&times;</button>
    <div class="tag-choice-content">
        <p>系统可自动为您创建<b>「${title}」</b>的标签，方便您后续在自己账号查看历史记录；</p>
        <p>该标签的数据可选择公开（好处：可自动吸纳其他人贡献的合理数据）。</p>
        
        <div class="choice-buttons">
            <button class="choice-btn choice-btn-primary" id="createAndShareBtn">创建 (公开)</button>
            <button class="choice-btn choice-btn-secondary" id="createNotShareBtn">创建 (不公开)</button>
            <button class="choice-btn choice-btn-secondary" id="notCreateBtn">不创建</button>
        </div>
    </div>
`;
    }

    // 分享介绍弹窗模板
    function SHARE_INTRO_TEMPLATE() {
        return `
    <button class="popup-close">&times;</button>
    <div class="share-intro-content">
        <h2>🎬 分享功能</h2>
        <div class="share-intro-text">
            <p>点击分享可将当前影视的评分数据分享到云端，让更多人看到这部作品的最新评分变化。</p>
            <p>分享后，您的数据将与其他用户的数据汇聚，形成更完整的评分趋势图。</p>
            <br>
            <p><strong>注意：</strong></p>
            <ul>
                <li>需填写 apiKey</li>
            </ul>
        </div>
        <div class="popup-buttons">
            <button class="popup-btn popup-btn-secondary" onclick="this.closest('.popup-overlay').remove()">取消</button>
            <button class="popup-btn popup-btn-primary" id="shareConfirmBtn">确定分享</button>
        </div>
    </div>
`;
    }

})();