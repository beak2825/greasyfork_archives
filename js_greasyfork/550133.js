// ==UserScript==
// @name         idcflare.com 等级查看
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @description  一个idcflare.com论坛的小插件，可查询用户等级和升级到下一级的要求
// @author       Reno, Hua, NullUser
// @icon         https://www.google.com/s2/favicons?domain=idcflare.com
// @match        https://idcflare.com/*
// @connect      connect.idcflare.com
// @grant       GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550133/idcflarecom%20%E7%AD%89%E7%BA%A7%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/550133/idcflarecom%20%E7%AD%89%E7%BA%A7%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const StyleManager = {
        styles: `
            @keyframes breathAnimation {
                0%, 100% { transform: scale(1); box-shadow: 0 0 10px rgba(0,0,0,0.15); }
                50% { transform: scale(1.1); box-shadow: 0 0 20px rgba(0,0,0,0.3); }
            }
            .breath-animation {
                animation: breathAnimation 3s ease-in-out infinite;
            }
            .minimized {
                border-radius: 50%;
                cursor: pointer;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                width: 50px;
                height: 50px;
                display: flex;
                justify-content: center;
                align-items: center;
                background: var(--minimized-bg);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .minimized:hover {
                transform: scale(1.1);
                box-shadow: 0 0 15px rgba(0,0,0,0.3);
            }
            .idcflareLevelPopup {
                position: fixed;
                width: 360px;
                height: auto;
                background: var(--popup-bg);
                box-shadow: 0 8px 30px rgba(0,0,0,0.1);
                padding: 15px;
                z-index: 10000;
                font-size: 14px;
                border-radius: 15px;
                cursor: move;
                transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
            }
            .idcflareLevelPopup.hidden {
                opacity: 0;
                visibility: hidden;
            }
            .idcflareLevelPopup:hover {
                box-shadow: 0 12px 40px rgba(0,0,0,0.2);
            }
            .idcflareLevelPopup input,
            .idcflareLevelPopup button {
                width: 100%;
                background: transparent;
                margin-top: 8px;
                padding: 10px;
                border-radius: 6px;
                border: 1px solid var(--input-border);
                box-sizing: border-box;
                font-size: 14px;
                transition: border-color 0.3s ease, box-shadow 0.3s ease;
            }
            .idcflareLevelPopup input:focus,
            .idcflareLevelPopup button:focus {
                outline: none;
                border-color: #007BFF;
                box-shadow: 0 0 5px rgba(0,123,255,0.5);
            }
            .idcflareLevelPopup button {
                background-color: var(--button-bg);
                color: var(--button-color);
                border: none;
                cursor: pointer;
                transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
            }
            .idcflareLevelPopup button:hover {
                background-color: var(--button-hover-bg);
                transform: translateY(-2px);
                box-shadow: 0 6px 15px rgba(0,0,0,0.1);
            }
            .minimizeButton {
                position: absolute;
                top: 5px;
                right: 5px;
                background: transparent;
                border: none;
                cursor: pointer;
                width: 25px;
                height: 25px;
                font-size: 16px;
                color: var(--minimize-btn-color);
                transition: color 0.3s ease;
            }
            .minimizeButton:hover {
                color: var(--minimize-btn-hover-color);
            }
            .summary-table {
                width: 100%;
                border-collapse: collapse;
                animation: fadeIn 0.5s ease-in-out;
                font-size: 14px;
            }
            .summary-table td {
                padding: 4px;
                text-align: left;
                border-bottom: none;
                white-space: nowrap;
            }
            .progress-bar {
                position: relative;
                height: 10px;
                background-color: var(--progress-bg);
                border-radius: 5px;
                overflow: hidden;
                width: 50%;
                display: inline-block;
                vertical-align: middle;
                margin-right: 10px;
            }
            .progress-bar-fill {
                height: 100%;
                background-color: #28a745;
                text-align: right;
                line-height: 10px;
                color: white;
                transition: width 0.4s ease-in-out;
                padding-right: 5px;
                border-radius: 5px 0 0 5px;
            }
            .progress-bar-fill::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-image: linear-gradient(90deg, transparent 10%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0.2) 15%, transparent 15%);
                background-size: 30px 10px;
                z-index: 1;
            }
            .progress-text {
                display: inline-block;
                vertical-align: middle;
                font-size: 13px;
                visibility: hidden;
                position: absolute;
                top: -25px; /* Adjust position */
                left: 0;
                background-color: #f39c12;
                color: #fff;
                border: 1px solid #e67e22;
                padding: 2px 5px;
                border-radius: 4px;
                box-shadow: 0px 0px 5px rgba(0,0,0,0.1);
                z-index: 1000;
            }
            .summary-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 5px;
                position: relative;
            }
            .summary-row:hover .progress-text {
                visibility: visible;
            }
            .progress-percentage {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 12px;
                font-weight: bold;
            }
            @media (prefers-color-scheme: dark) {
                :root {
                    --minimized-bg: #2c2c2c;
                    --popup-bg: #333;
                    --input-border: #555;
                    --button-bg: #444;
                    --button-color: #f0f0f0;
                    --button-hover-bg: #555;
                    --minimize-btn-color: #888;
                    --minimize-btn-hover-color: #fff;
                    --progress-bg: #3d3d3d;
                }
                .progress-percentage {
                    color: #fff;
                }
            }
            @media (prefers-color-scheme: light) {
                :root {
                    --minimized-bg: #f0f0f0;
                    --popup-bg: #fff;
                    --input-border: #ddd;
                    --button-bg: #e0e0e0;
                    --button-color: #333;
                    --button-hover-bg: #d5d5d5;
                    --minimize-btn-color: #888;
                    --minimize-btn-hover-color: #333;
                    --progress-bg: #f3f3f3;
                }
                .progress-percentage {
                    color: #000;
                }
            }
        `,

        injectStyles: function() {
            const styleSheet = document.createElement('style');
            styleSheet.type = 'text/css';
            styleSheet.innerText = this.styles;
            document.head.appendChild(styleSheet);
        }
    };

    const DataManager = {
        Config: {
            BASE_URL: 'https://idcflare.com',
            PATHS: {
                ABOUT: '/about.json',
                USER_SUMMARY: '/u/{username}/summary.json',
                USER_DETAIL: '/u/{username}.json',
            },
        },

        levelRequirements: {
            0: { 'topics_entered': 5, 'posts_read_count': 30, 'time_read': 600 },
            1: { 'days_visited': 15, 'likes_given': 1, 'likes_received': 1, 'post_count': 3, 'topics_entered': 20, 'posts_read_count': 100, 'time_read': 3600 },
            2: { 'days_visited': 50, 'likes_given': 30, 'likes_received': 20, 'post_count': 10 },
        },

        levelDescriptions: {
            0: "新用户 🌱",
            1: "基本用户 ⭐ ",
            2: "成员 ⭐⭐",
            3: "活跃用户 ⭐⭐⭐",
            4: "领导者 🏆"
        },

        fetch: async function(url, options = {}) {
            try {
                const response = await fetch(url, {
                    ...options,
                    headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0" },
                    method: options.method || "GET",
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return await response.json();
            } catch (error) {
                console.error(`Error fetching data from ${url}:`, error);
                throw error;
            }
        },

        fetchAboutData: function() {
            const url = this.buildUrl(this.Config.PATHS.ABOUT);
            return this.fetch(url);
        },

        fetchSummaryData: function(username) {
            const url = this.buildUrl(this.Config.PATHS.USER_SUMMARY, { username });
            return this.fetch(url);
        },

        fetchUserData: function(username) {
            const url = this.buildUrl(this.Config.PATHS.USER_DETAIL, { username });
            return this.fetch(url);
        },

        buildUrl: function(path, params = {}) {
            let url = this.Config.BASE_URL + path;
            Object.keys(params).forEach(key => {
                url = url.replace(`{${key}}`, encodeURIComponent(params[key]));
            });
            return url;
        },
    };

    const UIManager = {
        initPopup: async function() {
            this.popup = this.createElement('div', { id: 'idcflareLevelPopup', class: 'idcflareLevelPopup' });
            this.content = this.createElement('div', { id: 'idcflareLevelPopupContent' }, '欢迎使用 IDC Flare 等级增强插件');
            this.searchBox = this.createElement('input', { placeholder: '请输入用户名...', type: 'text', class: 'searchBox' });
            this.searchButton = this.createElement('button', { class: 'searchButton' }, '搜索');
            this.minimizeButton = this.createElement('button', { }, '隐藏');
            this.popup.style.bottom = '20px'; // 示例：距离顶部20px
            this.popup.style.right = '20px'; // 示例：距离左侧20px
            this.popup.style.width = '360px'; // 初始化宽度
            this.popup.style.height = 'auto'; // 高度自适应内容
            this.searchButton.classList.add('btn', 'btn-icon-text', 'btn-default')
            this.minimizeButton.classList.add('btn', 'btn-icon-text', 'btn-default')

            this.popup.append(this.content, this.searchBox, this.searchButton, this.minimizeButton);
            document.body.appendChild(this.popup);

            this.minimizeButton.addEventListener('click', () => this.togglePopupSize());
            this.searchButton.addEventListener('click', () => EventHandler.handleSearch());
            // 添加输入框的回车键事件监听器
            this.searchBox.addEventListener('keypress', (event) => {
                // 检查是否按下了回车键并且弹窗不处于最小化状态
                if (event.key === 'Enter' && !this.popup.classList.contains('minimized')) {
                    EventHandler.handleSearch();
                }
            });
            try {
               const userName = await getUserName();
               this.searchBox.value = userName;
            } catch (e) {
               console.log(e);
            }

        },

        createElement: function(tag, attributes, text) {
            const element = document.createElement(tag);
            for (const attr in attributes) {
                if (attr === 'class') {
                    element.classList.add(attributes[attr]);
                } else {
                    element.setAttribute(attr, attributes[attr]);
                }
            }
            if (text) element.textContent = text;
            return element;
        },

        async updatePopupContent(userSummary, user, userDetail, status, username) {
			if (!userSummary || !user || !userDetail) {
				return;
			}

			let content = `<strong>信任等级🏅：</strong>${DataManager.levelDescriptions[user.trust_level]}<br>`;

			if (userDetail.gamification_score) {
				content += `<strong>你的点数🪙：</strong><span style="color: green;">${userDetail.gamification_score}</span><br>`;
			}

			content += `<strong>最近活跃🕒：</strong>${formatTimestamp(userDetail.last_seen_at)}<br>`;


			if (user.trust_level === 2 && user.username === username) {
				content += await fetchConnect();
			} else if (user.trust_level > 2) {
				if (userSummary.top_categories) {
					content += analyzeAbility(userSummary.top_categories);
				}
			} else {
				content += summaryRequired(DataManager.levelRequirements[user.trust_level] || {}, userSummary, UIManager.translateStat.bind(UIManager));
			}

			this.content.innerHTML = content;
		},

        togglePopupSize: function() {
            if (this.popup.classList.contains('minimized')) {
                this.popup.classList.remove('minimized');
                this.popup.style.width = '360px';
                this.popup.style.height = 'auto';
                this.content.style.display = 'block';
                this.searchBox.style.display = 'block';
                this.searchButton.style.display = 'block';
                this.minimizeButton.textContent = '隐藏';
                this.minimizeButton.style.color = 'black';
                this.popup.classList.remove('breath-animation');
            } else {
                this.popup.classList.add('minimized');
                this.popup.style.width = '50px';
                this.popup.style.height = '50px';
                this.content.style.display = 'none';
                this.searchBox.style.display = 'none';
                this.searchButton.style.display = 'none';
                this.minimizeButton.textContent = '显示';
                this.popup.classList.add('breath-animation');

                // 调用 updatePercentage 函数并更新按钮文本
                updatePercentage().then(percentage => {
                    if (this.popup.classList.contains('minimized')) {
                        let color;
                        // 根据百分比设置颜色
                        if (percentage > 50) {
                            color = 'purple';
                        } else if (percentage > 30) {
                            color = 'red';
                        } else {
                            color = 'green';
                        }

                        // 更新按钮的文本和文本颜色
                        this.minimizeButton.textContent = `${percentage.toFixed(2)}%`;
                        this.minimizeButton.style.color = color; // 设置文本颜色
                    }
                }).catch(error => {
                    console.error('Error calculating percentage:', error);
                    // 出错时保持原有文本
                    this.minimizeButton.textContent = '展开';
                    this.minimizeButton.style.color = 'black';
                });
            }

            // 自动校正窗口位置
            addDraggableFeature(this.popup);
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const popupWidth = this.popup.offsetWidth;
            const popupHeight = this.popup.offsetHeight;
            const popupTop = parseInt(this.popup.style.top);
            const popupLeft = parseInt(this.popup.style.left);

            // 初始化新的位置
            let newTop = popupTop;
            let newLeft = popupLeft;

            // 上下边界同时检查
            newTop = Math.min(Math.max(70, popupTop), windowHeight - popupHeight);

            // 左右边界同时检查
            newLeft = Math.min(Math.max(5, popupLeft), windowWidth - popupWidth - 20);

            this.popup.style.top = newTop + 'px';
            this.popup.style.left = newLeft + 'px';
        },

        displayError: function(message) {
            this.content.innerHTML = `<strong>错误：</strong>用户隐藏信息或不存在`;
        },

        translateStat: function(stat) {
            const translations = {
                'days_visited': '访问天数',
                'likes_given': '给出的赞',
                'likes_received': '收到的赞',
                'post_count': '帖子数量',
                'posts_read_count': '已读帖子',
                'topics_entered': '已读主题',
                'time_read': '阅读时间(秒)'
            };
            return translations[stat] || stat;
        }
    };

    const EventHandler = {
        handleSearch: async function() {

            const username = UIManager.searchBox.value.trim();
            if (!username) return;

            try {
                UIManager.searchButton.textContent = '搜索中，请稍等！';
                UIManager.searchButton.disabled = true;

                const [aboutData, summaryData, userData] = await Promise.all([
                    DataManager.fetchAboutData(),
                    DataManager.fetchSummaryData(username),
                    DataManager.fetchUserData(username)
                ]);
                if (summaryData && userData && aboutData) {
                    await UIManager.updatePopupContent(summaryData.user_summary, summaryData.users ? summaryData.users[0] : { 'trust_level': 0 }, userData.user, aboutData.about.stats, username);
                }
            } catch (error) {
                console.error(error);
                UIManager.displayError('Failed to load data');
            }

            UIManager.searchButton.textContent = '搜索';
            UIManager.searchButton.disabled = false;

        },
        // 更新拖动状态
        handleDragEnd: function() {
            UIManager.updateDragStatus(true);
        }
    };



    // 2级以上添加技能分析
    function analyzeAbility(topCategories) {
        let resultStr = "<strong>技能分析🎯：</strong><br>";
        const icons = {
            "常规话题": "🌐",
            "wiki": "📚",
            "快问快答": "❓",
            "人工智能": "🤖",
            "周周热点": "🔥",
            "精华神贴": "✨",
            "高阶秘辛": "🔮",
            "读书成诗": "📖",
            "配置调优": "⚙️",
            "网络安全": "🔒",
            "软件分享": "💾",
            "软件开发": "💻",
            "嵌入式": "🔌",
            "机器学习": "🧠",
            "代码审查": "👀",
            "new-api": "🆕",
            "一机难求": "📱",
            "速来拼车": "🚗",
            "网络记忆": "💭",
            "非我莫属": "🏆",
            "赏金猎人": "💰",
            "搞七捻三": "🎲",
            "碎碎碎念": "🗨️",
            "金融经济": "💹",
            "新闻": "📰",
            "旅行": "✈️",
            "美食": "🍽️",
            "健身": "🏋️",
            "音乐": "🎵",
            "游戏": "🎮",
            "羊毛": "🐑",
            "树洞": "🌳",
            "病友": "🤒",
            "职场": "💼",
            "断舍离": "♻️",
            "二次元": "🎎",
            "运营反馈": "🔄",
            "老干部疗养院": "🛌",
            "活动": "🎉",
        };
        const totalScore = topCategories.reduce((sum, category) => sum + (category.topic_count * 2) + (category.post_count * 1), 0);
        topCategories.sort((a, b) => a.name.length - b.name.length);
        topCategories.forEach((category, index) => {
            const score = (category.topic_count * 2) + (category.post_count * 1);
            const percentage = ((score / totalScore) * 100).toFixed(1) + "%";
            let numStars;
            if (score >= 999) {
                numStars = 7; // 满分7颗红星
            } else {
                numStars = Math.round((score / 999) * 7); // 其他按比例显示
            }
            const stars = "❤️".repeat(numStars) + "🤍".repeat(7 - numStars); // 显示红星和空星
            let icon = icons[category.name] || "❓"; // 如果没有找到图标，显示默认图标
            resultStr += `
                <div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; opacity: 0; animation: fadeIn 0.5s forwards; animation-delay: ${index * 0.1}s; font-size: 13px;'>
                    <div style='flex: 0 0 20px; text-align: center;'>${icon}</div>
                    <div style='flex: 2; text-align: left;'>${category.name}</div>
                    <div style='flex: 4; text-align: left;'>${stars}</div>
                    <div style='flex: 1; text-align: right;'>${percentage}</div>
                </div>`;
        });

        resultStr += `
            <style>
                @keyframes fadeIn {
                    to { opacity: 1; }
                }
            </style>
        `;

        return resultStr;
    }

    // 2级添加Connect数据
    async function fetchConnect() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://connect.idcflare.com',
                onload: (response) => {
                    const bodyRegex = /<body[^>]*>([\s\S]+?)<\/body>/i;
                    const match = bodyRegex.exec(response.responseText);


                    if (match) {
                        const doc = new DOMParser().parseFromString(match[1], 'text/html');
                        let summary = '<strong>升级进度🌟：</strong><br><div class="summary-table">';
                        let violationExists = false;
                        let violationStats = []; // 违规项名称

                        const rows = doc.querySelectorAll('tr');

                        rows.forEach((row, index) => {
                            if (row) {
                                const cells = Array.from(row.querySelectorAll('td'), cell => cell.innerText.trim());
                                if (cells.length >= 3) {
                                    const stat = cells[0];
                                    const curMatches = cells[1].match(/(\d+)/);
                                    const reqMatches = cells[2].match(/(\d+)/);

                                    const curValue = curMatches ? parseInt(curMatches[0]) : 0;
                                    const reqValue = reqMatches ? parseInt(reqMatches[0]) : 0;

                                    // 检查是否存在违规
                                    if ([7, 8, 13, 14].includes(index) && curValue > reqValue) {
                                        violationExists = true;
                                        violationStats.push(stat); // 添加违规项名称
                                    }

                                    // 选择性添加到摘要
                                    if ([1, 2, 3,4, 5,6, 9, 10,11,12].includes(index)) {
                                        const percentage = Math.min((curValue / reqValue) * 100, 100);
                                        let color = curValue >= reqValue ? '#28a745' : '#dc3545';
                                        summary += `
                                            <div class="summary-row">
                                                <div>${stat}</div>
                                                <div class="progress-bar" title="${curValue}/${reqValue}">
                                                    <div class="progress-bar-fill" style="width: ${percentage}%; background-color: ${color};"></div>
                                                    <div class="progress-percentage">${Math.round(percentage)}%</div>
                                                </div>
                                                <div class="progress-text">${curValue}/${reqValue}</div>
                                            </div>`;
                                    }
                                }
                            }
                        });

                        if (violationExists) {
                            summary += `<div style="color: red;">用户存在违规行为：${violationStats.join(', ')}</div>`;
                        } else {
                            summary += '<div style="color: green;">用户不存在违规行为</div>';
                        }

                        summary += '</div>';
                        resolve(summary);
                    } else {
                        reject(new Error("No content extracted from response."));
                    }
                },
                onerror: (error) => {
                    reject(error);
                }
            });
        });
    }

    async function getUserName() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://connect.idcflare.com',
                onload: (response) => {
                    const bodyRegex = /<body[^>]*>([\s\S]+?)<\/body>/i;
                    const match = bodyRegex.exec(response.responseText);
                    if (match) {
                        const doc = new DOMParser().parseFromString(match[1], 'text/html');
                        if(doc){
                            const userNameDom = doc.querySelector('h1');
                            if(userNameDom){
                                const text = doc.querySelector('h1').textContent;
                                resolve(extractUserName(text));
                            }
                        }
                    } else {
                        reject(new Error("No content extracted from response."));
                    }
                },
                onerror: (error) => {
                    reject(error);
                }
            });
        });
    }

    // 2级以下添加升级进度功能
    function summaryRequired(required, current, translateStat) {
        let summary = '<strong>升级进度🌟：</strong><br>';

        summary += '<div class="summary-table">';

        for (const stat in required) {
            if (required.hasOwnProperty(stat) && current.hasOwnProperty(stat)) {
                const reqValue = required[stat];
                const curValue = current[stat] || 0; // 使用 || 0 确保未定义的情况下使用0
                const percentage = Math.min((curValue / reqValue) * 100, 100); // 计算百分比
                let color = curValue >= reqValue ? '#28a745' : '#dc3545'; // 使用绿色或红色

                summary += `
                    <div class="summary-row">
                        <div>${translateStat(stat)}</div>
                        <div class="progress-bar" title="${curValue}/${reqValue}">
                            <div class="progress-bar-fill" style="width: ${percentage}%; background-color: ${color};"></div>
                            <div class="progress-percentage">${Math.round(percentage)}%</div>
                        </div>
                        <div class="progress-text">${curValue}/${reqValue}</div>
                    </div>`;
            }
        }

        summary += '</div>';
        return summary;
    }

    // 添加含水率
    function updatePercentage() {
        return new Promise((resolve, reject) => {
            let badIds = [11, 16, 34, 17, 18, 19, 29, 36, 35, 22, 26, 25];
            const badScore = [];
            const goodScore = [];
            const urls = [
                'https://idcflare.com/latest.json?order=created',
                'https://idcflare.com/new.json',
                'https://idcflare.com/top.json?period=daily'
            ];

            Promise.all(urls.map(url => fetch(url).then(resp => resp.json())))
                .then(data => {
                data.forEach(({ topic_list: { topics } }) => {
                    topics.forEach(topic => {
                        const score = topic.posts_count + topic.like_count + topic.reply_count;
                        (badIds.includes(topic.category_id) ? badScore : goodScore).push(score);
                    });
                });

                const badTotal = badScore.reduce((acc, curr) => acc + curr, 0);
                const goodTotal = goodScore.reduce((acc, curr) => acc + curr, 0);
                const percentage = (badTotal / (badTotal + goodTotal)) * 100;

                resolve(percentage);
            })
                .catch(reject);
        });
    };

    // 添加时间格式化
    function formatTimestamp(lastSeenAt) {
        // 解析时间戳并去除毫秒
        let timestamp = new Date(lastSeenAt);

        // 使用Intl.DateTimeFormat格式化时间为上海时区
        let formatter = new Intl.DateTimeFormat('zh-CN', {
            timeZone: 'Asia/Shanghai',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        });

        // 获取格式化后的字符串
        let formattedTimestamp = formatter.format(timestamp);

        return formattedTimestamp;
    }

    // 添加拖动功能
    function addDraggableFeature(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let isDragging = false;

        const dragMouseDown = function(e) {
            // 检查事件的目标是否是输入框，按钮或其他可以忽略拖动逻辑的元素
            if (e.target.tagName.toUpperCase() === 'INPUT' || e.target.tagName.toUpperCase() === 'TEXTAREA' || e.target.tagName.toUpperCase() === 'BUTTON') {
                return; // 如果是，则不执行拖动逻辑
            }

            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            isDragging = true;
        };

        const elementDrag = function(e) {
            if (!isDragging) return;
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // 使用requestAnimationFrame优化拖动
            requestAnimationFrame(() => {
                element.style.top = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, element.offsetTop - pos2)) + "px";
                element.style.left = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, element.offsetLeft - pos1)) + "px";
                // 为了避免与拖动冲突，在此移除bottom和right样式
                element.style.bottom = '';
                element.style.right = '';
            });
        };

        const closeDragElement = function() {
            document.onmouseup = null;
            document.onmousemove = null;
            isDragging = false;
            // 在拖动结束时更新拖动状态
            EventHandler.handleDragEnd();
        };

        element.onmousedown = dragMouseDown;
    }

    // 提取用户名
    function extractUserName(input) {
        const regex = /\((.*?)\)/;
        const match = input.match(regex);
        return match ? match[1] : null;
    }

    const init = () => {
        StyleManager.injectStyles();
        UIManager.initPopup();
        addDraggableFeature(document.getElementById('idcflareLevelPopup')); // 确保已设置该ID
        UIManager.togglePopupSize(); // 初始最小化
    };

    init();

})();