// ==UserScript==
// @name         淘金币红包自动领取
// @namespace    http://tampermonkey.net/
// @version      11.0
// @description  自动检索淘金币兑换按钮并点击
// @author       mattpower
// @match        https://huodong.taobao.com/wow/z/tbhome/pc-growth/tao-coin*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557006/%E6%B7%98%E9%87%91%E5%B8%81%E7%BA%A2%E5%8C%85%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/557006/%E6%B7%98%E9%87%91%E5%B8%81%E7%BA%A2%E5%8C%85%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================================
    // 配置参数
    // ============================================================================
    const START_DELAY = 100; // 启动延迟时间（毫秒）
    const CONFIRM_SELECTOR = '#ice-container > div > div.tbpc-layout > div.gold-content > div.feeds > div > div.tbpc-row > div:nth-child(1) > div > div.bubble-container > div > div.operate > div.btn.confirm'; // 确认按钮选择器
    const RECEIVE_SELECTOR = 'body > div:nth-child(46) > div > div > div:nth-child(2) > div > div > div'; // 领取按钮选择器

    // 执行时间范围（北京时间）
    const TIME_START_SECONDS = 9 * 3600 + 59 * 60 + 53;  // 9:59:53
    const TIME_END_SECONDS = TIME_START_SECONDS + 15;   // 10:00:08

    // 需要移除的元素类名列表（用于资源拦截）
    const REMOVE_CLASSES = [
        'add-cart',           // 加入购物车按钮
        'goods-info',         // 商品信息
        'goods-deduction-gold', // 淘金币抵扣信息
        'wrapper--h_eReLLM',  // 挑战小游戏的金币
        'task',               // 任务元素
        'gold-sign-wrapper'   // 签到包装器
    ];

    // ============================================================================
    // 全局变量
    // ============================================================================
    const scriptStartTime = performance.now(); // 记录脚本开始执行时间
    let logDisplay; // 日志显示实例（将在初始化时创建）

    // ============================================================================
    // 工具函数 - 时间相关
    // ============================================================================

    /**
     * 获取北京时间（UTC+8）
     * @returns {Date} 返回北京时间对象
     */
    function getBeijingTime() {
        const now = new Date();
        const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
        const beijingTime = new Date(utcTime + (8 * 3600000));
        return beijingTime;
    }

    /**
     * 智能时间检测 - 根据时间范围返回不同的检查间隔
     * @returns {Object} {shouldExecute: boolean, nextCheckMs: number, reason: string}
     */
    function smartTimeCheck() {
        const beijingTime = getBeijingTime();
        const hours = beijingTime.getHours();
        const minutes = beijingTime.getMinutes();
        const seconds = beijingTime.getSeconds();
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;

        // 在执行时间范围内
        if (totalSeconds >= TIME_START_SECONDS && totalSeconds <= TIME_END_SECONDS) {
            return {
                shouldExecute: true,
                nextCheckMs: 0,
                reason: '在指定时间内，立即执行'
            };
        }

        // 计算距离开始时间还有多久
        let secondsUntilStart;
        if (totalSeconds < TIME_START_SECONDS) {
            secondsUntilStart = TIME_START_SECONDS - totalSeconds;
        } else {
            secondsUntilStart = (24 * 3600 - totalSeconds) + TIME_START_SECONDS;
        }

        // 根据距离设定不同的检查间隔
        let nextCheckMs;
        let reason;

        if (secondsUntilStart <= 20) {
            nextCheckMs = 3000; // 3秒
            reason = `距离执行时间还有 ${Math.floor(secondsUntilStart)} 秒，3秒后重新检查`;
        } else if (secondsUntilStart <= 60) {
            nextCheckMs = 15000; // 15秒
            reason = `距离执行时间还有 ${Math.floor(secondsUntilStart)} 秒，15秒后重新检查`;
        } else if (secondsUntilStart <= 300) {
            nextCheckMs = 30000; // 30秒
            reason = `距离执行时间还有 ${Math.floor(secondsUntilStart)} 秒，30秒后重新检查`;
        } else {
            nextCheckMs = 180000; // 3分钟
            reason = `距离执行时间还有 ${Math.floor(secondsUntilStart)} 秒，3分钟后重新检查`;
        }

        return {
            shouldExecute: false,
            nextCheckMs: nextCheckMs,
            reason: reason
        };
    }

    // ============================================================================
    // 工具函数 - DOM操作
    // ============================================================================

    /**
     * 通用按钮查找器
     * @param {string} selector CSS选择器
     * @returns {Element|null} 返回匹配的元素，未找到返回 null
     */
    function findButton(selector) {
        return document.querySelector(selector);
    }

    /**
     * 查找所有包含"兑换"文字的 .goods-num 元素
     * @returns {Element[]} 返回匹配的元素数组（反向遍历顺序）
     */
    function findAllExchangeButtons() {
        const elements = document.querySelectorAll('.goods-num');
        const result = [];

        // 收集所有包含"兑换"的元素（正向遍历）
        for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            if (el.textContent.includes('兑换')) {
                result.push(el);
            }
        }
        return result;
    }

    // ============================================================================
    // 业务逻辑函数 - 按钮处理
    // ============================================================================

    /**
     * 处理单个兑换按钮：点击 -> 点击确认 -> 点击领取
     * @param {Element} exchangeBtn 兑换按钮元素
     * @param {Function} callback 处理完成后的回调函数
     */
    function processExchangeButton(exchangeBtn, callback) {
        logDisplay.log('[淘金币脚本] 点击兑换按钮...');
        exchangeBtn.click();

        // 等待弹窗出现后点击确认按钮
        setTimeout(() => {
            const confirmBtn = findButton(CONFIRM_SELECTOR);

            if (confirmBtn) {
                logDisplay.log('[淘金币脚本] 找到确认按钮，点击中...');
                confirmBtn.click();

                // 等待后查找领取按钮
                setTimeout(() => {
                    const receiveBtn = findButton(RECEIVE_SELECTOR);
                    if (receiveBtn) {
                        logDisplay.log('[淘金币脚本] 找到领取按钮，点击中...');
                        receiveBtn.click();
                    } else {
                        logDisplay.log('[淘金币脚本] 未找到领取按钮...');
                    }
                }, 100);
            } else {
                logDisplay.log('[淘金币脚本] 未找到确认按钮...');
            }

            // 执行回调，处理下一个
            setTimeout(callback, 100);
        }, 100);
    }

    /**
     * 依次处理所有兑换按钮
     * @param {Element[]} buttons 兑换按钮数组
     * @param {number} index 当前处理的索引
     */
    function processAllButtons(buttons, index) {
        if (index >= buttons.length) {
            logDisplay.log('[淘金币脚本] 所有按钮处理完毕，刷新页面...');
            location.reload();
            return;
        }

        logDisplay.log(`[淘金币脚本] 处理第 ${index + 1}/${buttons.length} 个按钮...`);
        processExchangeButton(buttons[index], () => {
            processAllButtons(buttons, index + 1);
        });
    }

    /**
     * 主执行逻辑
     */
    async function main() {
        logDisplay.log('[淘金币脚本] 开始执行...');

        // 查找所有兑换按钮
        const exchangeButtons = findAllExchangeButtons();

        if (exchangeButtons.length === 0) {
            logDisplay.log('[淘金币脚本] 未找到兑换按钮，刷新页面...');
            location.reload();
            return;
        }

        logDisplay.log(`[淘金币脚本] 找到 ${exchangeButtons.length} 个兑换按钮，开始依次处理...`);
        processAllButtons(exchangeButtons, 0);
    }

    // ============================================================================
    // 功能模块 - 日志系统
    // ============================================================================

    /**
     * 自定义日志系统 - 在页面右下角显示最新3条日志
     */
    class LogDisplay {
        constructor() {
            this.logs = [];
            this.maxLogs = 3;
            this.init();
        }

        init() {
            this.container = document.createElement('div');
            this.container.id = 'taocoin-log-container';
            this.container.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                font-family: monospace;
                font-size: 12px;
                padding: 10px;
                border-radius: 5px;
                max-width: 400px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                pointer-events: none;
            `;

            if (document.body) {
                document.body.appendChild(this.container);
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    document.body.appendChild(this.container);
                });
            }
        }

        log(message) {
            this.logs.unshift(`[${new Date().toLocaleTimeString()}] ${message}`);

            if (this.logs.length > this.maxLogs) {
                this.logs = this.logs.slice(0, this.maxLogs);
            }

            this.updateDisplay();
        }

        updateDisplay() {
            if (!this.container) return;

            this.container.innerHTML = '';
            const fragment = document.createDocumentFragment();

            this.logs.forEach((log, index) => {
                const logElement = document.createElement('div');
                logElement.textContent = log;
                logElement.style.cssText = `
                    margin-bottom: 5px;
                    word-wrap: break-word;
                    opacity: ${1 - index * 0.2};
                `;
                fragment.appendChild(logElement);
            });

            this.container.appendChild(fragment);
        }
    }

    // ============================================================================
    // 功能模块 - 资源拦截
    // ============================================================================

    /**
     * 阻止资源加载 - 使用MutationObserver拦截元素创建
     * 在元素添加到DOM时立即处理，真正阻止资源加载
     */
    function blockResourceLoading() {
        // 处理单个元素 - 移除背景图片和不需要的元素
        function processElement(element) {
            if (!element.classList) return;

            // 移除商品图片的背景图片，阻止图片加载
            if (element.classList.contains('goods-img')) {
                element.style.backgroundImage = 'none';
                element.style.backgroundColor = '#f0f0f0';
            }

            // 直接移除不需要的元素
            for (const className of REMOVE_CLASSES) {
                if (element.classList.contains(className)) {
                    element.remove();
                    return;
                }
            }

            // 递归处理子元素
            if (element.children) {
                Array.from(element.children).forEach(processElement);
            }
        }

        // 创建MutationObserver监听DOM变化
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        processElement(node);
                    }
                }
            }
        });

        // 开始监听DOM变化
        const startObserver = () => {
            if (document.body) {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                logDisplay.log('[淘金币脚本] 资源加载拦截已启动');
            } else {
                setTimeout(startObserver, 10);
            }
        };

        startObserver();

        // 处理页面中已存在的元素
        if (document.body) {
            processElement(document.body);
        }
    }

    // ============================================================================
    // 初始化与执行入口
    // ============================================================================

    /**
     * 启动主执行逻辑
     */
    function startMainExecution() {
        if (document.readyState === 'complete') {
            const loadTime = (performance.now() - scriptStartTime).toFixed(2);
            logDisplay.log(`[淘金币脚本] 页面加载耗时: ${loadTime}ms`);
            setTimeout(() => main(), START_DELAY);
        } else {
            window.addEventListener('load', function() {
                const loadTime = (performance.now() - scriptStartTime).toFixed(2);
                logDisplay.log(`[淘金币脚本] 页面加载耗时: ${loadTime}ms`);
                setTimeout(() => main(), START_DELAY);
            });
        }
    }

    /**
     * 时间检查和等待函数
     */
    function checkTimeAndExecute() {
        const timeCheck = smartTimeCheck();
        logDisplay.log(`[淘金币脚本] ${timeCheck.reason}`);

        if (timeCheck.shouldExecute) {
            blockResourceLoading();
            logDisplay.log('[淘金币脚本] 启用资源拦截优化性能');
            startMainExecution();
        } else {
            logDisplay.log(`[淘金币脚本] ${timeCheck.nextCheckMs / 1000}秒后重新检查时间`);
            setTimeout(checkTimeAndExecute, timeCheck.nextCheckMs);
        }
    }

    // ============================================================================
    // 脚本入口
    // ============================================================================

    // 初始化日志系统
    logDisplay = new LogDisplay();

    // 开始时间检查
    checkTimeAndExecute();

})();
