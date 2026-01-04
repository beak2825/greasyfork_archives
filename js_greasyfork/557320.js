// ==UserScript==
// @name         考研倒计时增强版
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  功能丰富的考研倒计时，支持天气显示、拖拽定位、样式自定义
// @author       xiuming (lzmpt@qq.com)
// @match        http*://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      ipapi.co
// @connect      www.bing.com
// @license      CC BY-NC-SA 4.0
// @downloadURL https://update.greasyfork.org/scripts/557320/%E8%80%83%E7%A0%94%E5%80%92%E8%AE%A1%E6%97%B6%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/557320/%E8%80%83%E7%A0%94%E5%80%92%E8%AE%A1%E6%97%B6%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 计算考研时间（当年12月倒数第二个周末的周六）
    const calculateExamDate = (year) => {
        // 12月最后一天
        const lastDay = new Date(year, 11, 31);
        const lastDayOfWeek = lastDay.getDay(); // 0=周日, 6=周六

        // 计算12月最后一个周六
        let daysToSubtract = (lastDayOfWeek + 1) % 7; // 从最后一天往前推到周六
        let lastSaturday = 31 - daysToSubtract;

        // 倒数第二个周六（再往前推7天）
        const examDay = lastSaturday - 7;

        return { year, month: 12, day: examDay };
    };

    const currentYear = new Date().getFullYear();
    const now = new Date();

    // 计算今年的考研日期
    const thisYearExam = calculateExamDate(currentYear);
    const thisYearExamDate = new Date(thisYearExam.year, thisYearExam.month - 1, thisYearExam.day);

    // 如果今年考研日期已过，则使用明年的
    const targetYear = now > thisYearExamDate ? currentYear + 1 : currentYear;
    const nextExamDate = calculateExamDate(targetYear);

    // 默认配置
    const defaultConfig = {
        examYear: nextExamDate.year,
        examMonth: nextExamDate.month,
        examDay: nextExamDate.day,
        examHour: 8,
        showWeather: true,
        showDate: true,
        showProgress: true,
        showMotivation: true,
        backgroundColor: '#f0f4f8',
        textColor: '#2d3748',
        accentColor: '#ff6b6b',
        opacity: 0.95,
        fontSize: 14,
        position: { x: 'auto', y: 100, right: 20 },
        minimized: false,
        location: ''
    };

    let config = { ...defaultConfig, ...GM_getValue('countdownConfig', {}) };
    let weatherData = null;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    // 辅助函数：将hex颜色转换为rgba
    const hexToRgba = (hex, alpha = 1) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    // 创建主容器
    const createMainContainer = () => {
        const container = document.createElement('div');
        container.id = 'postgrad-countdown-container';
        container.innerHTML = `
            <div class="countdown-header">
                <span class="drag-handle">⋮⋮</span>
                <span class="countdown-title">考研倒计时</span>
                <button class="minimize-btn">${config.minimized ? '□' : '−'}</button>
                <button class="settings-btn">⚙</button>
            </div>
            <div class="countdown-content" style="display: ${config.minimized ? 'none' : 'block'}">
                <div class="countdown-main">
                    <div class="days-display">
                        <span class="days-number">0</span>
                        <span class="days-label">天</span>
                    </div>
                    <div class="time-display">00:00:00</div>
                </div>
                ${config.showProgress ? '<div class="progress-bar"><div class="progress-fill"></div></div>' : ''}
                <div class="current-time">加载中...</div>
                ${config.showDate ? '<div class="exam-date">考试时间: 加载中...</div>' : ''}
                ${config.showWeather ? '<div class="weather-info">天气加载中...</div>' : ''}
                ${config.showMotivation ? '<div class="motivation-text">💪 加载励志语...</div>' : ''}
                <div class="author-info">作者: xiuming | lzmpt@qq.com</div>
            </div>
            <div class="settings-panel" style="display: none;">
                <div class="settings-content">
                    <h3>设置面板</h3>

                    <div class="setting-group">
                        <label>考试年份（每年12月倒数第二个周末）</label>
                        <input type="number" id="exam-year" placeholder="年份" value="${config.examYear}">
                        <input type="number" id="exam-hour" placeholder="考试开始小时" value="${config.examHour}" min="0" max="23" style="width: calc(50% - 8px);">
                    </div>

                    <div class="setting-group">
                        <label>显示选项</label>
                        <label><input type="checkbox" id="show-weather" ${config.showWeather ? 'checked' : ''}> 显示天气</label>
                        <label><input type="checkbox" id="show-date" ${config.showDate ? 'checked' : ''}> 显示考试日期</label>
                        <label><input type="checkbox" id="show-progress" ${config.showProgress ? 'checked' : ''}> 显示进度条</label>
                        <label><input type="checkbox" id="show-motivation" ${config.showMotivation ? 'checked' : ''}> 显示励志语</label>
                    </div>

                    <div class="setting-group">
                        <label>外观设置</label>
                        <div class="color-setting">
                            <span>背景色:</span>
                            <input type="color" id="bg-color" value="${config.backgroundColor}">
                        </div>
                        <div class="color-setting">
                            <span>文字色:</span>
                            <input type="color" id="text-color" value="${config.textColor}">
                        </div>
                        <div class="color-setting">
                            <span>强调色:</span>
                            <input type="color" id="accent-color" value="${config.accentColor}">
                        </div>
                        <div class="slider-setting">
                            <span>透明度: <span id="opacity-value">${config.opacity}</span></span>
                            <input type="range" id="opacity" min="0.3" max="1" step="0.05" value="${config.opacity}">
                        </div>
                        <div class="slider-setting">
                            <span>字体大小: <span id="fontsize-value">${config.fontSize}px</span></span>
                            <input type="range" id="fontsize" min="10" max="24" step="1" value="${config.fontSize}">
                        </div>
                    </div>

                    <div class="setting-group">
                        <label>城市定位 (如: 北京)</label>
                        <input type="text" id="location" placeholder="自动定位" value="${config.location}">
                        <small style="opacity: 0.7; display: block; margin-top: 4px;">留空自动定位，或手动输入城市名</small>
                    </div>

                    <div class="setting-group">
                        <label>考研日期计算规则</label>
                        <small style="opacity: 0.7; display: block;">自动计算为每年12月倒数第二个周末的周六</small>
                    </div>

                    <div class="setting-buttons">
                        <button class="save-btn">保存设置</button>
                        <button class="reset-btn">恢复默认</button>
                        <button class="close-btn">关闭</button>
                    </div>
                </div>
            </div>
        `;

        applyStyles(container);
        document.body.appendChild(container);
        return container;
    };

    // 应用样式
    const applyStyles = (container) => {
        // 先移除旧样式
        const oldStyle = document.getElementById('postgrad-countdown-style');
        if (oldStyle) {
            oldStyle.remove();
        }

        const style = document.createElement('style');
        style.id = 'postgrad-countdown-style';
        style.textContent = `
            #postgrad-countdown-container {
                position: fixed;
                top: ${config.position.y}px;
                right: ${config.position.right}px;
                background: ${config.backgroundColor};
                color: ${config.textColor};
                border-radius: 12px;
                padding: 0;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                z-index: 999999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                width: 300px;
                max-width: 300px;
                opacity: ${config.opacity};
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
                font-size: ${config.fontSize}px;
            }

            #postgrad-countdown-container:hover {
                box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
            }

            .countdown-header {
                display: flex;
                align-items: center;
                padding: 12px 16px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 12px 12px 0 0;
                cursor: move;
                user-select: none;
            }

            .drag-handle {
                margin-right: 8px;
                opacity: 0.5;
                cursor: grab;
                font-size: 16px;
            }

            .drag-handle:active {
                cursor: grabbing;
            }

            .countdown-title {
                flex: 1;
                font-weight: 600;
                font-size: 1.1em;
            }

            .minimize-btn, .settings-btn {
                background: none;
                border: none;
                color: ${config.textColor};
                font-size: 18px;
                cursor: pointer;
                padding: 4px 8px;
                margin-left: 4px;
                border-radius: 4px;
                opacity: 0.7;
                transition: all 0.2s;
            }

            .minimize-btn:hover, .settings-btn:hover {
                opacity: 1;
                background: rgba(255, 255, 255, 0.1);
            }

            .countdown-content {
                padding: 20px;
            }

            .countdown-main {
                text-align: center;
                margin-bottom: 16px;
            }

            .days-display {
                display: flex;
                align-items: baseline;
                justify-content: center;
                margin-bottom: 12px;
            }

            .days-number {
                font-size: 3.5em;
                font-weight: 700;
                color: ${config.accentColor};
                text-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
                line-height: 1;
            }

            .days-label {
                font-size: 1.5em;
                margin-left: 8px;
                opacity: 0.8;
            }

            .time-display {
                font-size: 1.8em;
                font-weight: 500;
                letter-spacing: 2px;
                font-family: 'Courier New', monospace;
            }

            .progress-bar {
                width: 100%;
                height: 6px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;
                overflow: hidden;
                margin: 16px 0;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, ${config.accentColor}, #ee5a6f);
                border-radius: 3px;
                transition: width 0.3s ease;
                box-shadow: 0 0 10px ${config.accentColor};
            }

            .exam-date, .weather-info, .current-time {
                text-align: center;
                padding: 8px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 6px;
                margin-top: 8px;
                font-size: 0.9em;
                opacity: 0.9;
            }

            .current-time {
                font-size: 1em;
                font-weight: 500;
                letter-spacing: 0.5px;
                font-family: 'Courier New', monospace;
                background: rgba(255, 255, 255, 0.08);
            }

            .motivation-text {
                text-align: center;
                padding: 12px;
                background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(238, 90, 111, 0.1));
                border-radius: 8px;
                margin-top: 8px;
                font-size: 0.95em;
                font-weight: 500;
                line-height: 1.6;
                border-left: 3px solid ${config.accentColor};
                font-style: italic;
                cursor: pointer;
                transition: all 0.3s ease;
                word-wrap: break-word;
                word-break: break-word;
                overflow-wrap: break-word;
                white-space: normal;
            }

            .motivation-text:hover {
                background: linear-gradient(135deg, rgba(255, 107, 107, 0.15), rgba(238, 90, 111, 0.15));
                transform: translateX(2px);
            }

            .author-info {
                text-align: center;
                padding: 6px;
                margin-top: 8px;
                font-size: 0.75em;
                opacity: 0.5;
                font-family: 'Courier New', monospace;
            }

            .weather-info {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 12px;
            }

            .settings-panel {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: ${config.backgroundColor};
                border-radius: 12px;
                overflow-y: auto;
                max-height: 600px;
                width: 300px;
                max-width: 300px;
            }

            .settings-content {
                padding: 20px;
            }

            .settings-content h3 {
                margin: 0 0 20px 0;
                font-size: 1.3em;
                border-bottom: 2px solid ${config.accentColor};
                padding-bottom: 10px;
                color: ${config.textColor};
            }

            .setting-group {
                margin-bottom: 20px;
            }

            .setting-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                opacity: 0.9;
                color: ${config.textColor};
            }

            .setting-group input[type="number"],
            .setting-group input[type="text"] {
                width: calc(25% - 8px);
                padding: 8px;
                margin-right: 8px;
                background: rgba(0, 0, 0, 0.05);
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 6px;
                color: ${config.textColor};
                font-size: 0.9em;
            }

            .setting-group input[type="text"] {
                width: calc(100% - 16px);
            }

            .setting-group input[type="checkbox"] {
                margin-right: 8px;
            }

            .setting-group small {
                color: ${config.textColor};
            }

            .color-setting, .slider-setting {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 12px;
            }

            .color-setting input[type="color"] {
                width: 50px;
                height: 30px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }

            .slider-setting input[type="range"] {
                flex: 1;
                margin-left: 12px;
            }

            .setting-buttons {
                display: flex;
                gap: 10px;
                margin-top: 20px;
            }

            .setting-buttons button {
                flex: 1;
                padding: 10px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s;
            }

            .save-btn {
                background: ${config.accentColor};
                color: white;
            }

            .save-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
            }

            .reset-btn {
                background: rgba(0, 0, 0, 0.1);
                color: ${config.textColor};
            }

            .reset-btn:hover {
                background: rgba(0, 0, 0, 0.15);
            }

            .close-btn {
                background: rgba(0, 0, 0, 0.05);
                color: ${config.textColor};
            }

            .close-btn:hover {
                background: rgba(0, 0, 0, 0.1);
            }
        `;
        document.head.appendChild(style);
    };

    // 更新倒计时
    const updateCountdown = () => {
        const examDate = new Date(config.examYear, config.examMonth - 1, config.examDay, config.examHour);
        const now = new Date();
        const diff = examDate - now;

        // 更新当前时间显示
        const currentTimeEl = document.querySelector('.current-time');
        if (currentTimeEl) {
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            const weekday = weekdays[now.getDay()];

            currentTimeEl.textContent = `${year}-${month}-${day} ${weekday} ${hours}:${minutes}:${seconds}`;
        }

        if (diff <= 0) {
            document.querySelector('.days-number').textContent = '0';
            document.querySelector('.time-display').textContent = '00:00:00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.querySelector('.days-number').textContent = days;
        document.querySelector('.time-display').textContent =
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // 更新进度条
        if (config.showProgress) {
            const startDate = new Date(config.examYear - 1, 8, 1); // 假设从前一年9月1日开始准备
            const totalDays = (examDate - startDate) / (1000 * 60 * 60 * 24);
            const passedDays = (now - startDate) / (1000 * 60 * 60 * 24);
            const progress = Math.min((passedDays / totalDays) * 100, 100);
            const progressFill = document.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = `${progress}%`;
            }
        }

        // 更新考试日期显示
        if (config.showDate) {
            const dateEl = document.querySelector('.exam-date');
            if (dateEl) {
                const examDateObj = new Date(config.examYear, config.examMonth - 1, config.examDay);
                const examWeekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
                const examWeekday = examWeekdays[examDateObj.getDay()];
                dateEl.textContent = `考试时间: ${config.examYear}年${config.examMonth}月${config.examDay}日 ${examWeekday} ${String(config.examHour).padStart(2, '0')}:00`;
            }
        }
    };

    // 获取励志语（通过必应搜索）
    const getMotivation = async () => {
        if (!config.showMotivation) return;

        const motivationEl = document.querySelector('.motivation-text');
        if (!motivationEl) return;

        // 本地励志语库（备用）
        const localMotivations = [
            '星光不问赶路人，时光不负有心人！',
            '你的努力，终将成就更好的自己！',
            '天道酬勤，功不唐捐！',
            '不是井里没有水，而是你挖的不够深！',
            '成功的路上并不拥挤，因为坚持的人不多！',
            '每一个不曾起舞的日子，都是对生命的辜负！',
            '越努力，越幸运！',
            '不要让未来的你，讨厌现在的自己！'
        ];

        try {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://www.bing.com/search?q=' + encodeURIComponent('考研励志语 加油 鼓励'),
                timeout: 8000,
                onload: function(response) {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');

                        const quotes = [];

                        // 从搜索结果中提取励志语
                        const results = doc.querySelectorAll('.b_algo p, .b_caption p, .b_snippet');
                        results.forEach(el => {
                            const text = el.textContent.trim();
                            // 匹配包含励志内容的句子
                            const matches = text.match(/[^。！？]*[努力|加油|坚持|梦想|奋斗|拼搏|成功|胜利][^。！？]*[。！]/g);
                            if (matches) {
                                matches.forEach(match => {
                                    const cleaned = match.trim();
                                    if (cleaned.length > 10 && cleaned.length < 50 && !cleaned.includes('http')) {
                                        quotes.push(cleaned);
                                    }
                                });
                            }
                        });

                        // 如果找到了励志语，随机选择一条
                        if (quotes.length > 0) {
                            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                            motivationEl.textContent = '💪 ' + randomQuote;
                        } else {
                            // 否则使用本地励志语
                            const randomLocal = localMotivations[Math.floor(Math.random() * localMotivations.length)];
                            motivationEl.textContent = '💪 ' + randomLocal;
                        }
                    } catch (error) {
                        console.error('解析励志语失败:', error);
                        const randomLocal = localMotivations[Math.floor(Math.random() * localMotivations.length)];
                        motivationEl.textContent = '💪 ' + randomLocal;
                    }
                },
                onerror: function() {
                    const randomLocal = localMotivations[Math.floor(Math.random() * localMotivations.length)];
                    motivationEl.textContent = '💪 ' + randomLocal;
                },
                ontimeout: function() {
                    const randomLocal = localMotivations[Math.floor(Math.random() * localMotivations.length)];
                    motivationEl.textContent = '💪 ' + randomLocal;
                }
            });
        } catch (error) {
            console.error('励志语功能错误:', error);
            const randomLocal = localMotivations[Math.floor(Math.random() * localMotivations.length)];
            if (motivationEl) {
                motivationEl.textContent = '💪 ' + randomLocal;
            }
        }
    };
    // 获取天气信息（通过必应搜索）
    const getWeather = async () => {
        if (!config.showWeather) return;

        const weatherEl = document.querySelector('.weather-info');
        if (!weatherEl) return;

        try {
            let location = config.location;

            // 如果没有设置位置，尝试自动定位
            if (!location) {
                try {
                    const ipResponse = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: 'https://ipapi.co/json/',
                            timeout: 5000,
                            onload: response => {
                                try {
                                    resolve(JSON.parse(response.responseText));
                                } catch (e) {
                                    reject(e);
                                }
                            },
                            onerror: reject,
                            ontimeout: reject
                        });
                    });
                    location = ipResponse.city || '北京';
                } catch (e) {
                    console.log('IP定位失败，使用默认城市');
                    location = '北京';
                }
            }

            // 使用必应搜索获取天气
            weatherEl.innerHTML = `📍 ${location} | 🔄 加载中...`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://www.bing.com/search?q=${encodeURIComponent(location + '天气')}`,
                timeout: 10000,
                onload: function(response) {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');

                        // 尝试多种选择器来获取天气信息
                        let weatherText = '';
                        let temp = '';
                        let condition = '';

                        // 方法1：查找天气卡片
                        const weatherCard = doc.querySelector('.wtr_currTemp') ||
                                          doc.querySelector('[class*="weather"]') ||
                                          doc.querySelector('.b_focusTextLarge');

                        if (weatherCard) {
                            temp = weatherCard.textContent.trim();
                        }

                        // 方法2：查找天气描述
                        const conditionEl = doc.querySelector('.wtr_condition') ||
                                          doc.querySelector('[class*="condition"]') ||
                                          doc.querySelector('.b_focusTextSmall');

                        if (conditionEl) {
                            condition = conditionEl.textContent.trim();
                        }

                        // 方法3：从搜索结果中提取
                        if (!temp || !condition) {
                            const searchResults = doc.querySelectorAll('.b_algo, .b_caption');
                            for (let result of searchResults) {
                                const text = result.textContent;
                                // 匹配温度模式
                                const tempMatch = text.match(/(\d+)\s*°C?|(\d+)\s*度/);
                                const condMatch = text.match(/(晴|多云|阴|雨|雪|雾|霾)/);

                                if (tempMatch && !temp) {
                                    temp = (tempMatch[1] || tempMatch[2]) + '°C';
                                }
                                if (condMatch && !condition) {
                                    condition = condMatch[1];
                                }

                                if (temp && condition) break;
                            }
                        }

                        // 生成天气图标
                        let weatherIcon = '🌤️';
                        if (condition.includes('晴')) weatherIcon = '☀️';
                        else if (condition.includes('云')) weatherIcon = '☁️';
                        else if (condition.includes('阴')) weatherIcon = '☁️';
                        else if (condition.includes('雨')) weatherIcon = '🌧️';
                        else if (condition.includes('雪')) weatherIcon = '❄️';
                        else if (condition.includes('雾') || condition.includes('霾')) weatherIcon = '🌫️';

                        if (temp && condition) {
                            weatherEl.innerHTML = `📍 ${location} | ${weatherIcon} ${condition} ${temp}`;
                        } else if (temp) {
                            weatherEl.innerHTML = `📍 ${location} | 🌡️ ${temp}`;
                        } else {
                            weatherEl.innerHTML = `📍 ${location} | 🌤️ 天气良好`;
                        }
                    } catch (error) {
                        console.error('解析天气信息失败:', error);
                        weatherEl.innerHTML = `📍 ${location} | 🌤️ 天气信息获取中`;
                    }
                },
                onerror: function(error) {
                    console.error('获取天气失败:', error);
                    weatherEl.innerHTML = `📍 ${location} | 🌡️ 天气获取失败`;
                },
                ontimeout: function() {
                    console.error('获取天气超时');
                    weatherEl.innerHTML = `📍 ${location} | 🌡️ 网络超时`;
                }
            });
        } catch (error) {
            console.error('天气功能错误:', error);
            if (weatherEl) {
                weatherEl.innerHTML = '📍 位置未知 | 🌡️ 天气信息不可用';
            }
        }
    };

    // 绑定事件
    const bindEvents = (container) => {
        // 拖拽功能
        const header = container.querySelector('.countdown-header');
        header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('minimize-btn') ||
                e.target.classList.contains('settings-btn')) return;

            isDragging = true;
            dragOffset.x = e.clientX - container.offsetLeft;
            dragOffset.y = e.clientY - container.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const x = e.clientX - dragOffset.x;
            const y = e.clientY - dragOffset.y;
            container.style.left = `${x}px`;
            container.style.top = `${y}px`;
            container.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                config.position.x = container.offsetLeft;
                config.position.y = container.offsetTop;
                GM_setValue('countdownConfig', config);
            }
            isDragging = false;
        });

        // 最小化按钮
        container.querySelector('.minimize-btn').addEventListener('click', () => {
            const content = container.querySelector('.countdown-content');
            const btn = container.querySelector('.minimize-btn');
            config.minimized = !config.minimized;
            content.style.display = config.minimized ? 'none' : 'block';
            btn.textContent = config.minimized ? '□' : '−';
            GM_setValue('countdownConfig', config);
        });

        // 设置按钮
        container.querySelector('.settings-btn').addEventListener('click', () => {
            const panel = container.querySelector('.settings-panel');
            const isShowing = panel.style.display !== 'none';
            panel.style.display = isShowing ? 'none' : 'block';

            // 打开设置面板时，重置颜色选择器为默认值
            if (!isShowing) {
                const bgColorInput = panel.querySelector('#bg-color');
                const textColorInput = panel.querySelector('#text-color');
                const accentColorInput = panel.querySelector('#accent-color');

                if (bgColorInput) bgColorInput.value = defaultConfig.backgroundColor;
                if (textColorInput) textColorInput.value = defaultConfig.textColor;
                if (accentColorInput) accentColorInput.value = defaultConfig.accentColor;
            }
        });

        // 设置面板事件
        const settingsPanel = container.querySelector('.settings-panel');

        // 实时更新透明度和字体大小显示
        settingsPanel.querySelector('#opacity').addEventListener('input', (e) => {
            settingsPanel.querySelector('#opacity-value').textContent = e.target.value;
        });

        settingsPanel.querySelector('#fontsize').addEventListener('input', (e) => {
            settingsPanel.querySelector('#fontsize-value').textContent = e.target.value + 'px';
        });

        // 保存设置
        settingsPanel.querySelector('.save-btn').addEventListener('click', () => {
            // 重新计算考研日期
            const inputYear = parseInt(settingsPanel.querySelector('#exam-year').value);
            const autoCalcDate = calculateExamDate(inputYear);

            config.examYear = autoCalcDate.year;
            config.examMonth = autoCalcDate.month;
            config.examDay = autoCalcDate.day;
            config.examHour = parseInt(settingsPanel.querySelector('#exam-hour').value);
            config.showWeather = settingsPanel.querySelector('#show-weather').checked;
            config.showDate = settingsPanel.querySelector('#show-date').checked;
            config.showProgress = settingsPanel.querySelector('#show-progress').checked;
            config.showMotivation = settingsPanel.querySelector('#show-motivation').checked;
            config.backgroundColor = settingsPanel.querySelector('#bg-color').value;
            config.textColor = settingsPanel.querySelector('#text-color').value;
            config.accentColor = settingsPanel.querySelector('#accent-color').value;
            config.opacity = parseFloat(settingsPanel.querySelector('#opacity').value);
            config.fontSize = parseInt(settingsPanel.querySelector('#fontsize').value);
            config.location = settingsPanel.querySelector('#location').value;

            GM_setValue('countdownConfig', config);

            const examDateObj = new Date(config.examYear, config.examMonth - 1, config.examDay);
            const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            const weekday = weekdays[examDateObj.getDay()];

            alert(`考研日期已自动计算为: ${config.examYear}年${config.examMonth}月${config.examDay}日 ${weekday}`);
            location.reload(); // 重新加载页面以应用新样式
        });

        // 恢复默认
        settingsPanel.querySelector('.reset-btn').addEventListener('click', () => {
            if (confirm('确定要恢复默认设置吗？')) {
                GM_setValue('countdownConfig', defaultConfig);
                location.reload();
            }
        });

        // 关闭设置面板
        settingsPanel.querySelector('.close-btn').addEventListener('click', () => {
            settingsPanel.style.display = 'none';
        });

        // 点击励志语刷新
        const motivationEl = container.querySelector('.motivation-text');
        if (motivationEl) {
            motivationEl.addEventListener('click', () => {
                motivationEl.textContent = '💪 正在刷新...';
                getMotivation();
            });
        }
    };

    // 初始化
    const init = () => {
        const container = createMainContainer();
        bindEvents(container);
        updateCountdown();
        getWeather();
        getMotivation();

        // 每秒更新倒计时
        setInterval(updateCountdown, 1000);

        // 每30分钟更新一次天气
        setInterval(getWeather, 30 * 60 * 1000);

        // 每2小时更新一次励志语
        setInterval(getMotivation, 2 * 60 * 60 * 1000);
    };

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();