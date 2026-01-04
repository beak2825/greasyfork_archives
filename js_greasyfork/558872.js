// ==UserScript==
// @name         多游戏适配-自动收获+转生+钻石阈值输入框（最终版）
// @namespace    http://tampermonkey.net/
// @version      7.4.6
// @description  多游戏适配 | 钻石元素存在时显示右下角输入框 | 自动收获 | 转生弹窗自动确认 | 无控制台报错
// @author       EchoYuuu
// @match        https://yanhanye-idle.netlify.app/*
// @match        https://idle-game-34d.pages.dev/*
// @match        https://idle-world.pages.dev/
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/558872/%E5%A4%9A%E6%B8%B8%E6%88%8F%E9%80%82%E9%85%8D-%E8%87%AA%E5%8A%A8%E6%94%B6%E8%8E%B7%2B%E8%BD%AC%E7%94%9F%2B%E9%92%BB%E7%9F%B3%E9%98%88%E5%80%BC%E8%BE%93%E5%85%A5%E6%A1%86%EF%BC%88%E6%9C%80%E7%BB%88%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558872/%E5%A4%9A%E6%B8%B8%E6%88%8F%E9%80%82%E9%85%8D-%E8%87%AA%E5%8A%A8%E6%94%B6%E8%8E%B7%2B%E8%BD%AC%E7%94%9F%2B%E9%92%BB%E7%9F%B3%E9%98%88%E5%80%BC%E8%BE%93%E5%85%A5%E6%A1%86%EF%BC%88%E6%9C%80%E7%BB%88%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 初始转生数 + 实时变量 ==========
    let rebirthDiamondNum = 100; // 初始值
    let diamondInputBox = null; // 输入框实例

    // ========== 检测钻石元素是否存在（多游戏适配核心） ==========
    function isDiamondElementExist() {
        // 匹配包含“钻石”文字/钻石图标相关的元素（兼容多款游戏）
        const diamondText = document.body.innerText.includes('钻石');
        const diamondIcon = document.querySelector('[class*="diamond"], [src*="diamond"], [alt*="钻石"]');
        const rebirthBtn = document.querySelector('.btn-prestige'); // 转生按钮（钻石相关）
        return diamondText || diamondIcon || rebirthBtn;
    }

    // ========== 仅钻石元素存在时创建输入框（右下角） ==========
    function createDiamondInputBox() {
        // 先检测钻石元素，不存在则不创建
        if (!isDiamondElementExist()) return;

        const input = document.createElement('input');
        input.type = 'number';
        input.value = rebirthDiamondNum;
        input.min = 0;
        input.style.position = 'fixed';
        input.style.right = '10px'; // 右下角
        input.style.bottom = '10px';
        input.style.width = '80px';
        input.style.height = '30px';
        input.style.zIndex = '999999'; // 置顶显示
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '4px';
        input.style.padding = '0 5px';
        input.style.background = '#fff';
        input.style.outline = 'none';
        input.style.boxShadow = '0 0 2px rgba(0,0,0,0.2)'; // 轻微阴影，更易识别

        // 输入实时生效（失去焦点/回车都生效）
        input.addEventListener('change', () => {
            const num = parseInt(input.value) || 0;
            rebirthDiamondNum = num;
            console.log(`[实时生效] 转生钻石数改为：${num}`);
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const num = parseInt(input.value) || 0;
                rebirthDiamondNum = num;
                console.log(`[实时生效] 转生钻石数改为：${num}`);
                input.blur(); // 失去焦点
            }
        });

        document.body.appendChild(input);
        diamondInputBox = input; // 保存实例，方便后续销毁
    }

    // ========== 定时检测钻石元素（适配游戏动态加载） ==========
    function checkDiamondElementAndCreateInput() {
        // 已创建输入框 → 检测钻石元素是否消失，消失则删除输入框
        if (diamondInputBox) {
            if (!isDiamondElementExist()) {
                diamondInputBox.remove();
                diamondInputBox = null;
                console.log('[输入框] ❌ 钻石元素消失，隐藏输入框');
            }
        } else {
            // 未创建输入框 → 检测钻石元素是否出现，出现则创建
            if (isDiamondElementExist()) {
                createDiamondInputBox();
                console.log('[输入框] ✅ 检测到钻石元素，显示输入框');
            }
        }
    }

    // ========== 7.4原版弹窗劫持（一字未改） ==========
    const originalConfirm = window.confirm;
    window.confirm = function(message) {
        console.log('[原生弹窗拦截] 检测到confirm弹窗，内容：', message);
        if (message.includes('确定要转生吗？') || message.includes('转生')) {
            console.log('[原生弹窗拦截] ✅ 自动确认转生弹窗');
            return true;
        }
        return originalConfirm.call(window, message);
    };

    const originalAlert = window.alert;
    window.alert = function(message) {
        console.log('[原生弹窗拦截] 自动关闭alert弹窗，内容：', message);
        return true;
    };

    // ========== 配置：多游戏适配（修复收获按钮选择器） ==========
    const CONFIG = {
        mainBtnText: '点击',
        randomCoinSelector: '.golden-coin',
        clickInterval: 100,
        randomCoinInterval: 500,
        initDelay: 2000,
        rebirthBtnSelector: '.btn-prestige',
        harvestBtnSelector: 'button.btn.btn-success', // 修复：仅保留合法CSS选择器
        harvestInterval: 100, // 自动点击收获按钮的间隔
        diamondCheckInterval: 1000 // 检测钻石元素的间隔（1秒）
    };

    // ========== 全局状态（新增钻石检测定时器） ==========
    let isRunning = true;
    let mainClickTimer = null;
    let buyTimer = null;
    let randomCoinTimer = null;
    let rebirthTimer = null;
    let harvestTimer = null;
    let diamondCheckTimer = null; // 新增：钻石元素检测定时器

    // ========== 7.4原版抗节流定时器（一字未改） ==========
    function createNoThrottleTimer(callback, interval) {
        if (!window.MessageChannel) return setInterval(callback, interval);
        const channel = new MessageChannel();
        const port1 = channel.port1;
        const port2 = channel.port2;
        let lastExec = Date.now();
        port1.onmessage = () => {
            if (Date.now() - lastExec >= interval) {
                callback();
                lastExec = Date.now();
            }
            port2.postMessage('');
        };
        port2.postMessage('');
        return { stop: () => { port1.close(); port2.close(); } };
    }

    // ========== 7.4原版元素检查（一字未改） ==========
    function isElementVisibleAndValid(elem) {
        if (!elem) return false;
        const elemStyle = getComputedStyle(elem);
        if (elemStyle.display === 'none' || elem.disabled || elemStyle.opacity === '0' || elemStyle.visibility === 'hidden') return false;
        let parent = elem.parentElement;
        while (parent && parent !== document.body) {
            const parentStyle = getComputedStyle(parent);
            if (parentStyle.display === 'none' || parentStyle.visibility === 'hidden') return false;
            parent = parent.parentElement;
        }
        return true;
    }

    // ========== 7.4原版主按钮点击（一字未改） ==========
    function autoClickMain() {
        const mainBtn = Array.from(document.querySelectorAll('button')).find(btn =>
            btn.textContent.includes(CONFIG.mainBtnText) && isElementVisibleAndValid(btn)
        );
        if (mainBtn) mainBtn.click();
    }

    // ========== 7.4原版自动购买（一字未改） ==========
    function autoBuyVisibleCanBuy() {
        const allCanBuyBtns = document.querySelectorAll('button.can-buy');
        allCanBuyBtns.forEach(btn => {
            if (isElementVisibleAndValid(btn)) btn.click();
        });
    }

    // ========== 7.4原版随机奖励（一字未改） ==========
    function autoClickRandomCoin() {
        const coin = document.querySelector(CONFIG.randomCoinSelector);
        if (coin && isElementVisibleAndValid(coin)) coin.click();
    }

    // ========== 优化：自动点击收获按钮（修复语法错误，多游戏适配） ==========
    function autoClickHarvest() {
        // 1. 匹配样式选择器的收获按钮
        const harvestStyleBtns = document.querySelectorAll(CONFIG.harvestBtnSelector);
        harvestStyleBtns.forEach(btn => {
            if (isElementVisibleAndValid(btn)) {
                btn.click();
                console.log('[收获操作] ✅ 点击收获按钮（样式匹配）');
            }
        });
        // 2. 匹配包含“收获”文字的按钮（兼容所有游戏，替代:contains语法）
        const harvestTextBtns = Array.from(document.querySelectorAll('button')).filter(btn =>
            btn.textContent.includes('收获') && isElementVisibleAndValid(btn)
        );
        harvestTextBtns.forEach(btn => {
            btn.click();
            console.log('[收获操作] ✅ 点击收获按钮（文字匹配）');
        });
    }

    // ========== 转生逻辑（改为实时变量，无钻石元素时跳过） ==========
    function autoRebirthWhenEnoughDiamond() {
        // 无钻石元素时，跳过转生检测
        if (!isDiamondElementExist()) return;

        try {
            let diamondNum = 0;
            const rebirthBtn = document.querySelector(CONFIG.rebirthBtnSelector);

            if (rebirthBtn && isElementVisibleAndValid(rebirthBtn)) {
                const btnVisibleText = rebirthBtn.innerText.trim();
                const diamondMatch = btnVisibleText.match(/(\d+)\s*钻\s*\(下周目\s*\+/);
                if (diamondMatch && diamondMatch[1]) {
                    diamondNum = Number(diamondMatch[1]);
                } else {
                    const fallbackMatch = btnVisibleText.match(/(\d+)\s*钻/);
                    if (fallbackMatch && fallbackMatch[1]) {
                        diamondNum = Number(fallbackMatch[1]);
                    }
                }
            }

            diamondNum = isNaN(diamondNum) ? 0 : Math.floor(diamondNum);
            if (diamondNum >= rebirthDiamondNum) {
                if (rebirthBtn && isElementVisibleAndValid(rebirthBtn)) {
                    rebirthBtn.click();
                    console.log('[转生操作] ✅ 点击转生按钮（钻石数：', diamondNum, '当前阈值：', rebirthDiamondNum, '）');
                }
            }
        } catch (e) {
            console.error('[转生检测] ❌ 出错：', e);
        }
    }

    // ========== 启动逻辑（新增钻石检测定时器） ==========
    function startLoop() {
        if (!isRunning) return;
        mainClickTimer = createNoThrottleTimer(autoClickMain, CONFIG.clickInterval);
        buyTimer = createNoThrottleTimer(autoBuyVisibleCanBuy, 200);
        randomCoinTimer = createNoThrottleTimer(autoClickRandomCoin, CONFIG.randomCoinInterval);
        rebirthTimer = createNoThrottleTimer(autoRebirthWhenEnoughDiamond, 300);
        harvestTimer = createNoThrottleTimer(autoClickHarvest, CONFIG.harvestInterval);
        // 新增：定时检测钻石元素，动态显示/隐藏输入框
        diamondCheckTimer = setInterval(checkDiamondElementAndCreateInput, CONFIG.diamondCheckInterval);

        // 首次检测钻石元素
        checkDiamondElementAndCreateInput();
        console.log(`✅ 多游戏适配版启动 | 初始转生钻石数：${rebirthDiamondNum} | 自动收获已开启`);
    }

    // ========== 停止逻辑（新增钻石检测定时器停止） ==========
    function stopLoop() {
        isRunning = false;
        [mainClickTimer, buyTimer, randomCoinTimer, rebirthTimer, harvestTimer].forEach(timer => {
            if (timer?.stop) timer.stop();
        });
        // 停止钻石检测定时器
        clearInterval(diamondCheckTimer);
        // 移除输入框
        if (diamondInputBox) diamondInputBox.remove();

        window.confirm = originalConfirm;
        window.alert = originalAlert;
    }

    // ========== 初始化（兼容多游戏，无mainBtn也启动收获逻辑） ==========
    function waitPageLoad() {
        const mainBtn = Array.from(document.querySelectorAll('button')).find(btn =>
            btn.textContent.includes(CONFIG.mainBtnText)
        );
        // 有主按钮 或 有收获按钮 或 有钻石元素 → 启动脚本
        if (mainBtn || document.querySelector(CONFIG.harvestBtnSelector) || isDiamondElementExist() || Array.from(document.querySelectorAll('button')).some(btn => btn.textContent.includes('收获'))) {
            startLoop();
        } else {
            setTimeout(waitPageLoad, 500);
        }
    }

    setTimeout(waitPageLoad, CONFIG.initDelay);
    window.addEventListener('beforeunload', stopLoop);

})();