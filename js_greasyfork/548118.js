// ==UserScript==
// @name         宇宙收集放置-助手
// @name:en     Cosmic Idle Helper
// @namespace    LemonNoCry
// @license      MIT
// @version      1.10.2
// @description 自动点击黑洞、购卡、时钟，解放双手！
// @description:en Auto click black hole, buy cards, and time crunch. Save your hands!
// @author       LemonNoCry
// @match        https://gltyx.github.io/cosmic-collection/*
// @match        https://cosmic-collection.g8hh.com.cn/*
// @match        https://kuzzigames.com/cosmic_collection/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548118/%E5%AE%87%E5%AE%99%E6%94%B6%E9%9B%86%E6%94%BE%E7%BD%AE-%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/548118/%E5%AE%87%E5%AE%99%E6%94%B6%E9%9B%86%E6%94%BE%E7%BD%AE-%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /** 存储的 key 名称 */
    const STORAGE_KEY = "cosmic_helper_settings";

    /** 控制打洞功能的开关 */
    let holeEnabled = true;
    /** 控制批量购卡功能的开关 */
    let buyEnabled = true;
    /** 控制单卡购买功能的开关 */
    let singleCardEnabled = true;
    /** 控制时钟功能的开关 */
    let clockEnabled = true;
    /** 控制黑洞加速功能的开关 */
    let holeSpeedEnabled = true;
    /**控制卡片加倍功能的开关 */
    let cardDoubleEnabled = true;

    /** UI 引用，便于后续刷新文本 */
    const UI = {
        holeBtn: null,
        buyBtn: null,
        singleCardBtn: null,
        clockBtn: null,
        holeSpeedBtn: null,
        cardDoubleBtn: null
    };

    /** 从 localStorage 加载设置 */
    function loadSettings() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (saved) {
                holeEnabled = saved.holeEnabled ?? false;
                buyEnabled = saved.buyEnabled ?? false;
                singleCardEnabled = saved.singleCardEnabled ?? false;
                clockEnabled = saved.clockEnabled ?? false;
                holeSpeedEnabled = saved.holeSpeedEnabled ?? false;
                cardDoubleEnabled = saved.cardDoubleEnabled ?? false;
                console.log("✅ 设置加载成功");
            }
        } catch (e) {
            console.warn("⚠️ 设置加载失败，使用默认值");
        }
    }

    /** 保存设置到 localStorage */
    function saveSettings() {
        const settings = {
            holeEnabled,
            buyEnabled,
            singleCardEnabled,
            clockEnabled,
            holeSpeedEnabled,
            cardDoubleEnabled
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }

    /** —— 工具：按钮文本刷新 —— */
    function refreshButtonTexts() {
        if (UI.holeBtn) UI.holeBtn.textContent = holeEnabled ? "自动打洞✅" : "自动打洞❌";
        if (UI.buyBtn) UI.buyBtn.textContent = buyEnabled ? "自动购卡✅" : "自动购卡❌";
        if (UI.singleCardBtn) UI.singleCardBtn.textContent = singleCardEnabled ? "自动单卡购买✅" : "自动单卡购买❌";
        if (UI.clockBtn) UI.clockBtn.textContent = clockEnabled ? "自动时钟✅" : "自动时钟❌";
        if (UI.holeSpeedBtn) UI.holeSpeedBtn.textContent = holeSpeedEnabled ? "自动黑洞加速✅" : "自动黑洞加速❌";
        if (UI.cardDoubleBtn) UI.cardDoubleBtn.textContent = cardDoubleEnabled ? "卡片加倍✅" : "卡片加倍❌";
    }

    /**
     * 创建用于自动化各种游戏功能的切换按钮，并将它们添加到导航栏中。
     * 
     * 此函数创建三个切换按钮：
     * - 自动打洞：切换 holeEnabled 标志
     * - 自动购卡：切换 buyEnabled 标志
     * - 自动时钟操作：切换 clockEnabled 标志
     * 
     * 每个按钮通过对勾（启用）或叉号（禁用）直观地显示其当前状态，
     * 并在控制台记录状态变化。这些按钮会被添加到 #tabs 容器中。
     * 
     * @returns {void} 不返回任何内容
     * @note 如果找不到 #tabs 元素，会在控制台记录警告而不会抛出错误。
     */
    function createToggleButtons() {
        const nav = document.querySelector("#tabs");
        if (!nav) {
            console.warn("未找到 #tabs 容器，按钮未创建");
            return;
        }

        // 打洞按钮
        const holeBtn = document.createElement("button");
        holeBtn.id = "auto-hole-btn";
        holeBtn.className = "tab-btn";
        holeBtn.innerText = "自动打洞✅";
        holeBtn.addEventListener("click", () => {
            holeEnabled = !holeEnabled;
            holeBtn.innerText = holeEnabled ? "自动打洞✅" : "自动打洞❌";
            saveSettings();
            refreshButtonTexts();
            console.log(holeEnabled ? "✅ 自动打洞已启用" : "⏸ 自动打洞已禁用");
        });
        nav.appendChild(holeBtn);
        UI.holeBtn = holeBtn;

        // 购卡按钮
        const buyBtn = document.createElement("button");
        buyBtn.id = "auto-buy-btn";
        buyBtn.className = "tab-btn";
        buyBtn.addEventListener("click", () => {
            buyEnabled = !buyEnabled;
            buyBtn.innerText = buyEnabled ? "自动购卡✅" : "自动购卡❌";
            saveSettings();
            refreshButtonTexts();
            console.log(buyEnabled ? "✅ 自动购卡已启用" : "⏸ 自动购卡已禁用");
        });
        nav.appendChild(buyBtn);
        UI.buyBtn = buyBtn;

        // 单卡购买按钮
        const singleCardBtn = document.createElement("button");
        singleCardBtn.id = "auto-single-card-btn";
        singleCardBtn.className = "tab-btn";
        singleCardBtn.addEventListener("click", () => {
            singleCardEnabled = !singleCardEnabled;
            singleCardBtn.innerText = singleCardEnabled ? "自动单卡购买✅" : "自动单卡购买❌";
            saveSettings();
            refreshButtonTexts();
            console.log(singleCardEnabled ? "✅ 自动单卡购买已启用" : "⏸ 自动单卡购买已禁用");
        });
        nav.appendChild(singleCardBtn);
        UI.singleCardBtn = singleCardBtn;

        // 时钟按钮
        const clockBtn = document.createElement("button");
        clockBtn.id = "auto-clock-btn";
        clockBtn.className = "tab-btn";
        clockBtn.addEventListener("click", () => {
            clockEnabled = !clockEnabled;
            clockBtn.innerText = clockEnabled ? "自动时钟✅" : "自动时钟❌";
            saveSettings();
            refreshButtonTexts();
            console.log(clockEnabled ? "✅ 自动时钟已启用" : "⏸ 自动时钟已禁用");
        });
        nav.appendChild(clockBtn);
        UI.clockBtn = clockBtn;

        // 黑洞加速按钮
        const holeSpeedBtn = document.createElement("button");
        holeSpeedBtn.id = "auto-hole-speed-btn";
        holeSpeedBtn.className = "tab-btn";
        holeSpeedBtn.innerText = "自动黑洞加速✅";
        holeSpeedBtn.addEventListener("click", () => {
            holeSpeedEnabled = !holeSpeedEnabled;
            holeSpeedBtn.innerText = holeSpeedEnabled ? "自动黑洞加速✅" : "自动黑洞加速❌";
            saveSettings();
            refreshButtonTexts();
            console.log(holeSpeedEnabled ? "✅ 自动黑洞加速已启用" : "⏸ 自动黑洞加速已禁用");
        });
        nav.appendChild(holeSpeedBtn);
        UI.holeSpeedBtn = holeSpeedBtn;

        // 卡片加倍按钮
        const cardDoubleBtn = document.createElement("button");
        cardDoubleBtn.id = "auto-card-double-btn";
        cardDoubleBtn.className = "tab-btn";
        cardDoubleBtn.innerText = "卡片加倍✅";
        cardDoubleBtn.addEventListener("click", () => {
            cardDoubleEnabled = !cardDoubleEnabled;
            cardDoubleBtn.innerText = cardDoubleEnabled ? "卡片加倍✅" : "卡片加倍❌";
            saveSettings();
            refreshButtonTexts();
            console.log(cardDoubleEnabled ? "✅ 卡片加倍已启用" : "⏸ 卡片加倍已禁用");
        });
        nav.appendChild(cardDoubleBtn);
        UI.cardDoubleBtn = cardDoubleBtn;

        // 初始化按钮文本
        refreshButtonTexts();
    }

    /**
     * 触发卡片的鼠标悬停事件
     * 遍历抽卡区域的所有卡片，为每张卡片触发 mouseenter 事件
     * @returns {void}
     */
    function triggerCardMouseEnter() {
        const cards = document.querySelectorAll('.draw-area .card-outer');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const mouseEnterEvent = new MouseEvent('mouseenter', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: rect.left + rect.width / 2,
                clientY: rect.top + rect.height / 2
            });
            card.dispatchEvent(mouseEnterEvent);
        });
    }

    /**
     * 判断按钮是否可见
     * 检查按钮的显示状态，包括 display、visibility、opacity 和 hidden 属性
     * @param {HTMLElement} btn - 要检查的按钮元素
     * @returns {boolean} 如果按钮可见返回 true，否则返回 false
     */
    function isButtonVisible(btn) {
        if (!btn) return false;
        const style = window.getComputedStyle(btn);
        return (
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            style.opacity !== "0" &&
            !btn.hidden
        );
    }

    /**
     * 点击批量购买按钮
     * 查找并点击商人的批量购买按钮（如果可见）
     * @returns {void}
     */
    function tryClickBulkBuy() {
        if (!buyEnabled) return;
        const btn = document.getElementById("merchant-bulkbuy-btn");
        if (btn && isButtonVisible(btn)) {
            btn.click();
            console.log("✅ 批量购买按钮点击成功");
        }
    }

    /**
     * 点击单卡购买按钮
     * 查找所有可购买的单卡购买按钮并逐一点击
     * @returns {void}
     */
    function tryClickSingleBuys() {
        if (!singleCardEnabled) return;
        const bulkBuyBtn = document.getElementById("merchant-bulkbuy-btn");
        //如果存在批量购买按钮且可见，则跳过单卡购买
        if (bulkBuyBtn && isButtonVisible(bulkBuyBtn)) return;

        const btns = document.querySelectorAll(".offer-buy-btn:not(.unaffordable)");
        btns.forEach(btn => {
            if (bulkBuyBtn && isButtonVisible(bulkBuyBtn)) return;
            if (isButtonVisible(btn)) {
                btn.click();
                console.log("🃏 单卡购买按钮点击成功");
            }
        });
    }

    /**
     * 点击打洞按钮并触发卡片悬停
     * 点击打洞按钮，成功后触发所有卡片的鼠标悬停事件
     * @returns {void}
     */
    function tryClickHole() {
        if (!holeEnabled) return;
        const btn = document.getElementById("hole-button");
        if (btn && isButtonVisible(btn)) {
            btn.click();
            console.log("🔨 打洞按钮点击成功");
            triggerCardMouseEnter();
        }
    }

    /**
     * 点击时钟按钮
     * 查找并点击时间压缩按钮（如果可见）
     * @returns {void}
     */
    function tryClickClock() {
        if (!clockEnabled) return;
        const btn = document.getElementById("time-crunch-button");
        if (btn && isButtonVisible(btn) && btn.className == "time-crunch-button ready") {
            btn.click();
            console.log("⏰ 时钟按钮点击成功");
        }
    }

    /**
     * 点击黑洞加速按钮
     * 查找并点击黑洞加速按钮（如果可见）
     * @returns {void}
     */
    function tryClickHoleSpeed() {
        if (!holeSpeedEnabled) return;
        const btn = document.getElementById("harvester-button");
        if (btn && isButtonVisible(btn)) {
            const ev = new MouseEvent("click", { bubbles: true, cancelable: true, view: window });
            btn.dispatchEvent(ev);
            console.log("🕳️ 黑洞加速按钮点击成功");
        }
    }

    /**
     * 点击卡片加倍按钮
     * 查找并点击卡片加倍按钮（如果可见）
     * @returns {void}
     */
    function tryClickCardDouble() {
        if (!cardDoubleEnabled) return;
        const btn = document.getElementById("absorber-button");
        if (btn && isButtonVisible(btn) && btn.className == "absorber-button maxed") {
            btn.click();
            console.log("🔄 卡片加倍按钮点击成功");
        }
    }

    /**
     * 主循环管理器
     * 设置定时器来自动执行各种游戏操作：
     * - 每秒执行：打洞、批量购卡、时钟操作
     * - 每2秒执行：单卡购买
     * @returns {void}
     */
    function autoClickManager() {
        // 每秒尝试：打洞 + 批量购卡 + 时钟
        setInterval(() => { tryClickHole(); }, 1000);
        setInterval(() => { tryClickBulkBuy(); }, 1000);
        setInterval(() => { tryClickSingleBuys(); }, 1000);
        setInterval(() => { tryClickClock(); }, 1000);
        setInterval(() => { tryClickCardDouble(); }, 1000);

        // 每2秒尝试：黑洞加速
        setInterval(() => { tryClickHoleSpeed(); }, 2000);
    }

    // 脚本启动入口
    loadSettings();
    createToggleButtons();
    autoClickManager();
    console.log("🚀 自动购卡 / 打洞 / 时钟 / 黑洞加速 脚本已启动（按钮集成到 tab 导航栏 / 支持记忆功能）");
})();
