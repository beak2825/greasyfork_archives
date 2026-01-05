// ==UserScript==
// @name         Microsoft Rewards Dashboard
// @namespace    http://tampermonkey.net/
// @version      2.0.8
// @description  自动完成Microsoft Rewards每日搜索任务,显示今日积分获取进度,自动计算搜索次数
// @author       MIANKRAM
// @icon         https://seikan.lat/api/Rewards Asset/favicon.ico
// @icon64       https://seikan.lat/api/Rewards Asset/bing.png
// @match        https://www.bing.com/*
// @match        https://cn.bing.com/*
// @match        https://rewards.bing.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558646/Microsoft%20Rewards%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/558646/Microsoft%20Rewards%20Dashboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const API_URL = "https://rewards.bing.com/api/getuserinfo?type=1&X-Requested-With=XMLHttpRequest&";

    // 样式
    const styles = `
        #mr-dashboard-container {
            position: fixed;
            top: 20%;
            right: 0;
            z-index: 9999;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            align-items: flex-start;
            transition: transform 0.3s ease;
        }
        
        #mr-dashboard-toggle {
            background-color: #0078d4;
            color: white;
            padding: 10px 5px;
            cursor: pointer;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
            writing-mode: vertical-rl;
            text-orientation: mixed;
            font-size: 14px;
            box-shadow: -2px 2px 5px rgba(0,0,0,0.2);
        }

        #mr-dashboard-panel {
            background-color: white;
            width: 280px;
            padding: 15px;
            box-shadow: -2px 2px 10px rgba(0,0,0,0.2);
            border-bottom-left-radius: 5px;
            display: none; /* 默认隐藏 */
            color: #333;
        }

        #mr-dashboard-container.expanded #mr-dashboard-panel {
            display: block;
        }

        .mr-section {
            margin-bottom: 15px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }

        .mr-section:last-child {
            border-bottom: none;
        }

        .mr-title {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 10px;
            color: #0078d4;
        }

        .mr-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 14px;
        }

        .mr-progress-bar {
            height: 6px;
            background-color: #e0e0e0;
            border-radius: 3px;
            margin-top: 2px;
            overflow: hidden;
        }

        .mr-progress-fill {
            height: 100%;
            background-color: #0078d4;
            width: 0%;
            transition: width 0.5s ease;
        }

        .mr-loading {
            text-align: center;
            padding: 20px;
            color: #666;
        }
    `;

    GM_addStyle(styles);

    // 搜索配置
    const SEARCH_CONFIG = {
        maxPoints: 90,
        pointsPerSearch: 3,
        pc: {
            minDelay: 60000, // 60秒
            maxDelay: 120000 // 120秒
        },
        mobile: {
            minDelay: 25000, // 25秒
            maxDelay: 50000  // 50秒
        }
    };

    let searchWindow = null;
    let g_remainingSearches = Math.ceil(SEARCH_CONFIG.maxPoints / SEARCH_CONFIG.pointsPerSearch);
    let g_maxSearches = Math.ceil(SEARCH_CONFIG.maxPoints / SEARCH_CONFIG.pointsPerSearch);
    let g_searchStatusText = '';

    // 生成随机搜索词
    function generateRandomQuery() {
        const keywords = ["weather", "news", "sports", "finance", "movies", "tech", "food", "travel", "music", "art", "history", "science", "nature", "space", "cars", "games", "books", "fashion", "health", "fitness"];
        const keyword = keywords[Math.floor(Math.random() * keywords.length)];
        const randomString = Math.random().toString(36).substring(7);
        return `${keyword} ${randomString}`;
    }

    // 开始搜索任务
    function startSearchTask() {
        const deviceType = getDeviceType();
        
        // 动态计算搜索次数
        let totalSearches = g_remainingSearches;
        
        let currentSearch = 0;
        const btn = document.getElementById('mr-start-search');
        
        function setStatus(text) {
            g_searchStatusText = text;
            let statusEl = document.getElementById('mr-search-timer');
            if(statusEl) statusEl.innerText = text;
        }

        if(btn) btn.disabled = true;
        setStatus(`准备...`);

        // 移动端不设置窗口大小，避免被识别为桌面弹窗
        let windowFeatures = 'width=500,height=500';
        if (deviceType === "手机" || deviceType === "平板") {
            searchWindow = window.open('https://www.bing.com', '_blank');
        } else {
            searchWindow = window.open('https://www.bing.com', '_blank', windowFeatures);
        }
        
        if (!searchWindow) {
            alert('请允许弹出窗口以进行自动搜索');
            if(btn) btn.disabled = false;
            return;
        }

        function doSearch() {
            if (currentSearch >= totalSearches) {
                setStatus('完成');
                if(btn) btn.disabled = false;
                if(searchWindow) searchWindow.close();
                return;
            }

            currentSearch++;
            const query = generateRandomQuery();
            setStatus(`搜索中...`);
            
            if(searchWindow && !searchWindow.closed) {
                try {
                    const doc = searchWindow.document;
                    const input = doc.getElementById('sb_form_q');
                    const form = doc.getElementById('sb_form');

                    if (input && form) {
                        input.value = query;
                        const event = new Event('input', { bubbles: true });
                        input.dispatchEvent(event);
                        
                        const submitBtn = doc.getElementById('sb_form_go');
                        if (submitBtn) {
                            submitBtn.click();
                        } else {
                            form.submit();
                        }
                    }
                } catch (e) {
                    console.error("搜索出错", e);
                }
            } else {
                setStatus('停止');
                if(btn) btn.disabled = false;
                return;
            }

            // 根据设备类型设置延迟
            let minDelay, maxDelay;
            if (deviceType === "手机" || deviceType === "平板") {
                minDelay = SEARCH_CONFIG.mobile.minDelay;
                maxDelay = SEARCH_CONFIG.mobile.maxDelay;
            } else {
                minDelay = SEARCH_CONFIG.pc.minDelay;
                maxDelay = SEARCH_CONFIG.pc.maxDelay;
            }

            const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
            
            // 倒计时逻辑
            let remainingSeconds = Math.ceil(delay / 1000);
            const updateStatus = () => {
                setStatus(`等待 ${remainingSeconds}秒`);
            };
            updateStatus();

            const timer = setInterval(() => {
                if (!searchWindow || searchWindow.closed) {
                    clearInterval(timer);
                    setStatus('停止');
                    if(btn) btn.disabled = false;
                    return;
                }

                remainingSeconds--;
                if (remainingSeconds <= 0) {
                    clearInterval(timer);
                    doSearch();
                } else {
                    updateStatus();
                }
            }, 1000);
        }

        // 首次延迟执行
        setTimeout(doSearch, 2000);
    }

    // UI 构建
    function createUI() {
        const container = document.createElement('div');
        container.id = 'mr-dashboard-container';
        
        const toggle = document.createElement('div');
        toggle.id = 'mr-dashboard-toggle';
        toggle.innerText = 'Rewards';
        toggle.onclick = () => {
            container.classList.toggle('expanded');
        };

        const panel = document.createElement('div');
        panel.id = 'mr-dashboard-panel';

        // 内容区域
        const content = document.createElement('div');
        content.id = 'mr-dashboard-content';
        panel.appendChild(content);

        // 控制区域
        const controls = document.createElement('div');
        controls.className = 'mr-section';
        controls.style.marginTop = '10px';
        controls.style.borderTop = '1px solid #eee';
        controls.style.paddingTop = '10px';

        const btn = document.createElement('button');
        btn.id = 'mr-start-search';
        btn.innerText = '开始自动搜索';
        btn.style.width = '100%';
        btn.style.padding = '8px';
        btn.style.backgroundColor = '#0078d4';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.onclick = startSearchTask;

        controls.appendChild(btn);
        panel.appendChild(controls);

        container.appendChild(toggle);
        container.appendChild(panel);
        document.body.appendChild(container);
    }

    // 数据获取
    function fetchData() {
        const content = document.getElementById('mr-dashboard-content');
        // 仅在首次加载或无内容时显示 loading，避免自动刷新闪烁
        if (!content.querySelector('.mr-section')) {
            content.innerHTML = '<div class="mr-loading">加载中...</div>';
        }

        const timestamp = new Date().getTime();
        const url = `${API_URL}&_=${timestamp}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            },
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    renderData(data);
                } catch (e) {
                    console.error("解析 Rewards 数据失败", e);
                    content.innerHTML = `<div style="color:red">数据解析失败: ${e.message}</div>`;
                }
            },
            onerror: function(err) {
                console.error("获取 Rewards 数据失败", err);
                content.innerHTML = '<div style="color:red">网络请求失败</div>';
            }
        });
    }

    // 检测设备类型
    function getDeviceType() {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return "平板";
        }
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return "手机";
        }
        return "电脑";
    }

    // 数据渲染
    function renderData(data) {
        const content = document.getElementById('mr-dashboard-content');
        const dashboard = data.dashboard || data;
        
        // 获取设备类型
        const deviceType = getDeviceType();

        // 1. 积分等级
        let levelName = "未知";
        let totalPoints = 0;
        let todayPoints = 0;
        
        if (dashboard.userStatus) {
            totalPoints = dashboard.userStatus.availablePoints || 0;
            if (dashboard.userStatus.levelInfo) {
                levelName = dashboard.userStatus.levelInfo.activeLevel || dashboard.userStatus.levelInfo.level || "未知";
            }
        }

        // 2. 每日积分进度
        let pcSearchCurrent = 0, pcSearchMax = 0;
        let mobileSearchCurrent = 0, mobileSearchMax = 0;

        // 解析 Counters
        if (dashboard.userStatus && dashboard.userStatus.counters) {
            const counters = dashboard.userStatus.counters;
            
            // 电脑搜索
            if (counters.pcSearch && counters.pcSearch.length > 0) {
                counters.pcSearch.forEach(item => {
                    pcSearchCurrent += item.pointProgress || 0;
                    pcSearchMax += item.pointMax || item.pointProgressMax || 0;
                });
            }
            
            // 移动搜索
            if (counters.mobileSearch && counters.mobileSearch.length > 0) {
                counters.mobileSearch.forEach(item => {
                    mobileSearchCurrent += item.pointProgress || 0;
                    mobileSearchMax += item.pointMax || item.pointProgressMax || 0;
                });
            }
        }

        // 计算今日总分
        todayPoints = pcSearchCurrent + mobileSearchCurrent;
        let todayMaxPoints = pcSearchMax + mobileSearchMax;

        // 计算剩余搜索次数
        let currentTypePoints = 0;
        let maxTypePoints = 0;
        if (deviceType === "电脑") {
            currentTypePoints = pcSearchCurrent;
            maxTypePoints = pcSearchMax;
        } else {
            currentTypePoints = mobileSearchCurrent;
            maxTypePoints = mobileSearchMax;
        }
        
        const remainingPoints = Math.max(0, maxTypePoints - currentTypePoints);
        const remainingSearches = Math.ceil(remainingPoints / SEARCH_CONFIG.pointsPerSearch);
        g_remainingSearches = remainingSearches;
        const totalSearchesNeeded = Math.ceil(maxTypePoints / SEARCH_CONFIG.pointsPerSearch);
        g_maxSearches = totalSearchesNeeded;
        const searchProgress = totalSearchesNeeded > 0 ? ((totalSearchesNeeded - remainingSearches) / totalSearchesNeeded) * 100 : 0;

        // 构建 HTML
        let html = `
            <div class="mr-section">
                <div class="mr-title">仪表盘</div>
                <div class="mr-item"><span>当前设备</span> <span>${deviceType}</span></div>
                <div class="mr-item"><span>当前等级</span> <span>${levelName}</span></div>
                <div class="mr-item"><span>总积分</span> <span>${totalPoints}</span></div>
                
                <div class="mr-item"><span>今日获取</span> <span>${todayPoints} / ${todayMaxPoints}</span></div>
                <div class="mr-progress-bar"><div class="mr-progress-fill" style="width: ${(todayMaxPoints > 0 ? todayPoints/todayMaxPoints*100 : 0)}%"></div></div>
                
                <div class="mr-item" style="margin-top: 8px;"><span>剩余搜索次数</span> <span>${remainingSearches} <span id="mr-search-timer" style="margin-left: 8px; color: #0078d4;">${g_searchStatusText}</span></span></div>
                <div class="mr-progress-bar"><div class="mr-progress-fill" style="width: ${searchProgress}%"></div></div>
                
                <div style="margin-top: 8px; padding-left: 10px; border-left: 2px solid #eee;">
                    <div class="mr-item" style="font-size: 12px; color: #666;"><span>电脑搜索</span> <span>${pcSearchCurrent} / ${pcSearchMax}</span></div>
                    <div class="mr-progress-bar" style="height: 4px;"><div class="mr-progress-fill" style="width: ${(pcSearchMax > 0 ? pcSearchCurrent/pcSearchMax*100 : 0)}%"></div></div>
                    
                    <div class="mr-item" style="font-size: 12px; color: #666; margin-top: 4px;"><span>移动搜索</span> <span>${mobileSearchCurrent} / ${mobileSearchMax}</span></div>
                    <div class="mr-progress-bar" style="height: 4px;"><div class="mr-progress-fill" style="width: ${(mobileSearchMax > 0 ? mobileSearchCurrent/mobileSearchMax*100 : 0)}%"></div></div>
                </div>
            </div>
        `;

        content.innerHTML = html;
    }

    // 初始化
    window.addEventListener('load', () => {
        createUI();
        fetchData();
        setInterval(fetchData, 30000);
    });

})();
