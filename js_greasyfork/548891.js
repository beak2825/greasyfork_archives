// ==UserScript==
// @name         工匠放置小工具之1：事件提醒
// @namespace    http://tampermonkey.net/
// @version      1.13
// @description  工匠提醒 + 下一个事件 + 商人/商船提醒 + 物资不足提醒 + 可隐藏 + 等级阈值缓存 + 面板可拖动 + 输入格式化
// @author       Stella (modified by Gemini)
// @match        https://idleartisan.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      CC-BY-NC-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/548891/%E5%B7%A5%E5%8C%A0%E6%94%BE%E7%BD%AE%E5%B0%8F%E5%B7%A5%E5%85%B7%E4%B9%8B1%EF%BC%9A%E4%BA%8B%E4%BB%B6%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/548891/%E5%B7%A5%E5%8C%A0%E6%94%BE%E7%BD%AE%E5%B0%8F%E5%B7%A5%E5%85%B7%E4%B9%8B1%EF%BC%9A%E4%BA%8B%E4%BB%B6%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const COOLDOWN = 60 * 1000;
    let cooldownUntil = 0;

    // 默认配置
    const defaultConfig = {
        CB: true,
        Siege: true,
        TS: true,
        M: true,
        GLOBAL: true,
        IDLE: false,
        MERCHANT_LEVEL: 3,
        RESOURCE_REMINDER: true,
        WOOD_THRESHOLD: 100000,
        IRON_THRESHOLD: 100000,
        GOLD_THRESHOLD: 1000000
    };

    const config = {};
    for (let k in defaultConfig) {
        config[k] = GM_getValue(k, defaultConfig[k]);
    }

    // 中英文事件表
    const eventDict = {
        "Mining Bonus": "采矿加成",
        "Woodcutting Bonus": "伐木加成",
        "Thief": "盗贼",
        "Battling Bonus": "战斗加成",
        "Crafting Bonus": "制作加成",
        "Merchant": "商人",
        "Purchasing Agent": "采购代理",
        "Tax Season": "税收季节",
        "Distant war drums": "遥远的战鼓",
        "Goblin Siege": "哥布林围攻",
        "Boss Fight": "Boss对抗",
        "Ancient Treant": "远古树人",
        "Runic Golem": "符文魔像",
        "Trade ship": "贸易船"
    };

    const eventOrder = Object.keys(eventDict);

    function getLangMode(text) {
        return /^[\x00-\x7F]*$/.test(text) ? "en" : "zh";
    }

    function getEventName(enName, lang) {
        return lang === "en" ? enName : (eventDict[enName] || enName);
    }

    // --- 新增：数字格式化帮助函数 ---
    function formatNumber(num) {
        if (num === null || num === undefined) return '';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function parseNumber(str) {
        if (typeof str !== 'string') str = String(str);
        return parseInt(str.replace(/,/g, ''), 10) || 0;
    }


    // ========== UI面板 ==========
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.bottom = '20px';
    panel.style.right = '20px';
    panel.style.background = 'rgba(0,0,0,0.8)';
    panel.style.color = 'white';
    panel.style.padding = '12px';
    panel.style.borderRadius = '10px';
    panel.style.zIndex = 9999;
    panel.style.fontFamily = 'sans-serif';
    panel.style.fontSize = '14px';
    panel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';

    // --- 新增：面板拖动逻辑 ---
    const dragHandle = document.createElement('div');
    dragHandle.textContent = '⚙️ 事件提醒助手';
    dragHandle.style.cursor = 'move';
    dragHandle.style.textAlign = 'center';
    dragHandle.style.padding = '5px';
    dragHandle.style.background = '#333';
    dragHandle.style.borderTopLeftRadius = '10px';
    dragHandle.style.borderTopRightRadius = '10px';
    dragHandle.style.marginBottom = '8px';
    dragHandle.style.userSelect = 'none'; // 防止拖动时选中文本
    panel.appendChild(dragHandle);

    dragHandle.onmousedown = function(e) {
        e.preventDefault();
        let shiftX = e.clientX - panel.getBoundingClientRect().left;
        let shiftY = e.clientY - panel.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            panel.style.left = pageX - shiftX + 'px';
            panel.style.top = pageY - shiftY + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        }

        function onMouseMove(e) {
            moveAt(e.pageX, e.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);
        dragHandle.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            dragHandle.onmouseup = null;
        };
    };
    dragHandle.ondragstart = () => false;


    // 隐藏按钮单独一排
    const hideContainer = document.createElement('div');
    hideContainer.style.textAlign = 'right';
    hideContainer.style.marginBottom = '8px';
    const closeBtn = document.createElement('span');
    closeBtn.textContent = '❌';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => {
        panel.style.display = 'none';
        bulb.style.display = 'block';
    };
    hideContainer.appendChild(closeBtn);
    dragHandle.appendChild(hideContainer); // 将关闭按钮放到标题栏中

    function createSwitch(labelText, key) {
        const container = document.createElement('div');
        container.style.marginBottom = '8px';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'space-between';
        const label = document.createElement('span');
        label.textContent = labelText;
        const switchContainer = document.createElement('div');
        switchContainer.style.width = '50px';
        switchContainer.style.height = '24px';
        switchContainer.style.background = config[key] ? '#4caf50' : '#ccc';
        switchContainer.style.borderRadius = '12px';
        switchContainer.style.position = 'relative';
        switchContainer.style.cursor = 'pointer';
        switchContainer.style.transition = 'background 0.3s';
        const knob = document.createElement('div');
        knob.style.width = '20px';
        knob.style.height = '20px';
        knob.style.background = '#fff';
        knob.style.borderRadius = '50%';
        knob.style.position = 'absolute';
        knob.style.top = '2px';
        knob.style.left = config[key] ? '28px' : '2px';
        knob.style.transition = 'left 0.3s';
        switchContainer.appendChild(knob);
        switchContainer.addEventListener('click', () => {
            config[key] = !config[key];
            GM_setValue(key, config[key]);
            switchContainer.style.background = config[key] ? '#4caf50' : '#ccc';
            knob.style.left = config[key] ? '28px' : '2px';
        });
        container.appendChild(label);
        container.appendChild(switchContainer);
        panel.appendChild(container);
    }

    // --- 更新：创建带千分位格式化的数字输入框 ---
    function createFormattedNumericInput(labelText, key) {
        const container = document.createElement('div');
        container.style.marginBottom = '8px';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'space-between';

        const label = document.createElement('span');
        label.textContent = labelText;

        const input = document.createElement('input');
        input.type = 'text'; // 使用文本输入框以允许逗号
        input.value = formatNumber(config[key]); // 初始化时显示格式化的数字
        input.style.width = '90px';
        input.style.marginLeft = '6px';
        input.style.border = '1px solid #555';
        input.style.background = '#333';
        input.style.color = 'white';
        input.style.borderRadius = '4px';
        input.style.textAlign = 'right';

        input.addEventListener('input', () => {
            // 在输入时实时更新配置值
            const value = parseNumber(input.value);
            config[key] = value;
            GM_setValue(key, config[key]);
        });

        input.addEventListener('focus', () => {
            // 聚焦时，显示原始数字以便编辑
            input.value = config[key];
        });

        input.addEventListener('blur', () => {
            // 失焦时，格式化数字以便阅读
            const value = parseNumber(input.value);
            config[key] = value; // 确保最终值被保存
            GM_setValue(key, config[key]);
            input.value = formatNumber(value);
        });

        container.appendChild(label);
        container.appendChild(input);
        panel.appendChild(container);
    }

    createSwitch('制作提醒', 'CB');
    createSwitch('围攻提醒', 'Siege');
    createSwitch('商船提醒', 'TS');
    createSwitch('商人提醒', 'M');
    createFormattedNumericInput('商人提醒等级', 'MERCHANT_LEVEL');

    panel.appendChild(document.createElement('hr'));

    createSwitch('物资提醒', 'RESOURCE_REMINDER');
    createFormattedNumericInput('木头阈值', 'WOOD_THRESHOLD');
    createFormattedNumericInput('铁矿阈值', 'IRON_THRESHOLD');
    createFormattedNumericInput('金币阈值', 'GOLD_THRESHOLD');

    panel.appendChild(document.createElement('hr'));
    createSwitch('全局开关', 'GLOBAL');
    createSwitch('摸鱼模式', 'IDLE');

    document.body.appendChild(panel);

    // 灯泡按钮
    const bulb = document.createElement('div');
    bulb.textContent = '💡';
    bulb.style.position = 'fixed';
    bulb.style.bottom = '20px';
    bulb.style.right = '20px';
    bulb.style.fontSize = '24px';
    bulb.style.cursor = 'move';
    bulb.style.zIndex = 10000;
    bulb.style.display = 'none';
    document.body.appendChild(bulb);

    bulb.addEventListener('click', () => {
        bulb.style.display = 'none';
        panel.style.display = 'block';
    });

    bulb.onmousedown = function(e) {
        let shiftX = e.clientX - bulb.getBoundingClientRect().left;
        let shiftY = e.clientY - bulb.getBoundingClientRect().top;
        function moveAt(pageX, pageY) {
            bulb.style.left = pageX - shiftX + 'px';
            bulb.style.top = pageY - shiftY + 'px';
            bulb.style.right = 'auto';
            bulb.style.bottom = 'auto';
        }
        function onMouseMove(e) {
            moveAt(e.pageX, e.pageY);
        }
        document.addEventListener('mousemove', onMouseMove);
        bulb.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            bulb.onmouseup = null;
        };
    };
    bulb.ondragstart = () => false;

    // 请求通知权限
    if (Notification.permission !== "granted") Notification.requestPermission();

    // ========== 定时提醒 ==========
    setInterval(() => {
        if (!config.GLOBAL) return;
        const now = Date.now();
        if (now < cooldownUntil) return;
        const title = document.title.trim();
        const langMode = getLangMode(title);

        const notify = (msg) => {
            if (config.IDLE) msg = langMode === "en" ? "Windows Update Reminder" : "Windows 更新提醒";
            new Notification(config.IDLE ? (langMode === "en" ? "Windows Update" : "Windows 更新") : "Idle Artisan", {
                body: msg,
                icon: "https://idleartisan.com/favicon.ico"
            });
            cooldownUntil = now + COOLDOWN;
        };

        // 事件提醒
        if (config.CB && (title.includes("CB") || title.includes("制作") || title.includes("Crafting"))) {
            notify(langMode === "en" ? "Crafting Bonus!" : "制作加成来了！");
            return;
        } else if (config.Siege && (title.includes("Siege") || title.includes("围攻"))) {
            notify(langMode === "en" ? "Prepare for Siege!" : "准备 BOSS 战斗！");
            return;
        } else if (config.TS && (title.includes("TS") || title.includes("商船") || title.includes("Trade ship"))) {
            const marketplaceTab = document.getElementById("Marketplace");
            const marketFilter = document.getElementById("marketItemFilter");
            if (marketplaceTab) marketplaceTab.style.display = "block";
            if (marketFilter) {
                marketFilter.value = "all";
                if (typeof updateMarketDisplay === "function") updateMarketDisplay();
            }

            setTimeout(() => {
                const rows = document.querySelectorAll("#marketListingsDisplay tbody tr");
                for (let row of rows) {
                    const seller = row.cells[3]?.textContent || "";
                    if (seller.includes("[NPC]贸易船") || seller.includes("[NPC] Trade ship")) {
                        const itemName = row.cells[0]?.textContent.trim() || "";
                        const price = row.cells[2]?.textContent.trim() || "";
                        notify(`船来！${itemName}@${price}`);
                        break;
                    }
                }
            }, 300);
            return;

        } else if (config.M && (title === "Idle Artisan - M" || title.includes("商人") || title.includes("Merchant"))) {
            const logDisplay = document.getElementById("statusLogDisplay");
            if (logDisplay) {
                const lastLine = logDisplay.innerHTML.split("<br>").reverse().find(line => line.includes("商人来了") || line.includes("Merchant arrived"));
                if (lastLine) {
                    const match = lastLine.match(/\((\d+)级\)/) || lastLine.match(/level (\d+)\)/);
                    const level = match ? parseInt(match[1], 10) : 0;
                    if (level >= config.MERCHANT_LEVEL) {
                        notify(langMode === "en" ? `Merchant arrived! Item Level: ${level}` : `商人来了！物品等级: ${level}`);
                        return;
                    }
                }
            }
        }

        // 物资不足提醒
        if(config.RESOURCE_REMINDER) {
            const wood = parseFloat((document.getElementById('myLogsTop')?.textContent || '0').replace(/,/g, ''));
            const iron = parseFloat((document.getElementById('myIronOreTop')?.textContent || '0').replace(/,/g, ''));
            const gold = parseFloat((document.getElementById('myGoldTop')?.textContent || '0').replace(/,/g, ''));

            let lowResources = [];
            if (wood < config.WOOD_THRESHOLD) {
                lowResources.push(langMode === "en" ? "Wood" : "木头");
            }
            if (iron < config.IRON_THRESHOLD) {
                lowResources.push(langMode === "en" ? "Iron Ore" : "铁矿石");
            }
            if (gold < config.GOLD_THRESHOLD) {
                lowResources.push(langMode === "en" ? "Gold" : "金币");
            }

            if (lowResources.length > 0) {
                const message = (langMode === "en" ? "Low on: " : "物资不足: ") + lowResources.join(', ');
                notify(message);
                return;
            }
        }

    }, 10000);

    // ========== 下一个事件显示 ==========
    const nextEventLabel = document.createElement('div');
    nextEventLabel.style.marginLeft = "15px";
    nextEventLabel.style.color = "#ff4d4d";
    nextEventLabel.style.fontWeight = "bold";
    nextEventLabel.style.fontSize = "14px";
    nextEventLabel.textContent = "Next Event: ...";

    const eventWrapper = document.getElementById("event-wrapper");
    if (eventWrapper && eventWrapper.parentNode) {
        eventWrapper.parentNode.insertBefore(nextEventLabel, eventWrapper.nextSibling);
    }

    setInterval(() => {
        const currentNameElem = document.getElementById("event-name");
        if (!currentNameElem) return;
        const currentEventRaw = currentNameElem.textContent.trim();
        const langMode = getLangMode(currentEventRaw);
        let currentEn = Object.keys(eventDict).find(en => en === currentEventRaw || eventDict[en] === currentEventRaw);
        if (!currentEn) return;
        const idx = eventOrder.findIndex(e => e === currentEn);
        if (idx >= 0) {
            const nextEventEn = eventOrder[(idx + 1) % eventOrder.length];
            nextEventLabel.textContent = langMode === "en" ? "Next Event: " + getEventName(nextEventEn, langMode) : "下一个事件: " + getEventName(nextEventEn, langMode);
        } else nextEventLabel.textContent = langMode === "en" ? "Next Event: Unknown" : "下一个事件: 未知";
    }, 2000);

})();