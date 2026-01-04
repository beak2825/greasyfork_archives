// ==UserScript==
// @name         淘金币红包自动领取
// @namespace    http://tampermonkey.net/
// @version      9.0
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

    // 记录脚本开始执行时间
    const scriptStartTime = performance.now();

    // 自定义日志系统 - 在页面右下角显示最新3条日志
    class LogDisplay {
        constructor() {
            this.logs = []; // 存储日志消息的数组
            this.maxLogs = 3; // 最大显示日志条数
            this.init(); // 初始化日志显示容器
        }

        init() {
            // 创建日志容器
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

            // 确保在DOM加载后才添加容器
            if (document.body) {
                document.body.appendChild(this.container);
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    document.body.appendChild(this.container);
                });
            }
        }

        log(message) {
            // 添加新日志到数组开头
            this.logs.unshift(`[${new Date().toLocaleTimeString()}] ${message}`);

            // 保持最多3条日志
            if (this.logs.length > this.maxLogs) {
                this.logs = this.logs.slice(0, this.maxLogs);
            }

            // 更新显示
            this.updateDisplay();
        }

        updateDisplay() {
            if (!this.container) return;

            // 清空容器内容
            this.container.innerHTML = '';

            // 创建文档片段以提高性能
            const fragment = document.createDocumentFragment();

            // 添加所有日志
            this.logs.forEach((log, index) => {
                const logElement = document.createElement('div');
                logElement.textContent = log;
                logElement.style.cssText = `
                    margin-bottom: 5px;
                    word-wrap: break-word;
                    opacity: ${1 - index * 0.2}; /* 越新的日志越不透明 */
                `;
                fragment.appendChild(logElement);
            });

            this.container.appendChild(fragment);
        }
    }

    // 创建全局日志实例
    const logDisplay = new LogDisplay();

    /**
     * 阻止资源加载 - 使用MutationObserver拦截元素创建
     * 在元素添加到DOM时立即处理，真正阻止资源加载
     */
    function blockResourceLoading() {
        // 需要移除的元素类名列表
        const REMOVE_CLASSES = [
            'add-cart',           // 加入购物车按钮
            'goods-info',         // 商品信息
            'goods-deduction-gold', // 淘金币抵扣信息
            'wrapper--h_eReLLM',  // 挑战小游戏的金币
            'task',               // 任务元素
            'gold-sign-wrapper'   // 签到包装器
        ];

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
                // 处理新添加的节点
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // 元素节点
                        processElement(node);
                    }
                }
            }
        });

        // 开始监听DOM变化
        const startObserver = () => {
            if (document.body) {
                observer.observe(document.body, {
                    childList: true,  // 监听子节点的添加和删除
                    subtree: true     // 监听所有后代节点
                });
                logDisplay.log('[淘金币脚本] 资源加载拦截已启动');
            } else {
                // 如果body还没有创建，等待后重试
                setTimeout(startObserver, 10);
            }
        };

        // 立即启动监听
        startObserver();

        // 处理页面中已存在的元素
        if (document.body) {
            processElement(document.body);
        }
    }

    // 立即执行所有拦截功能
    blockResourceLoading();    // 拦截DOM元素和背景图片

    // 配置参数
    const START_DELAY = 100; // 启动延迟时间（毫秒）
    const CONFIRM_SELECTOR = '#ice-container > div > div.tbpc-layout > div.gold-content > div.feeds > div > div.tbpc-row > div:nth-child(1) > div > div.bubble-container > div > div.operate > div.btn.confirm'; // 确认按钮选择器
    const RECEIVE_SELECTOR = 'body > div:nth-child(46) > div > div > div:nth-child(2) > div > div > div'

    /**
     * 查找所有包含"兑换"文字的 .goods-num 元素
     * @returns {Element[]} 返回排序后的匹配元素数组
     */
    function findAllExchangeButtons() {
        const elements = document.querySelectorAll('.goods-num'); // 获取所有 goods-num 类的元素
        const result = []; // 存储匹配的元素

        // 收集所有包含"兑换"的元素（反向遍历）
        for (let i = elements.length - 1; i >= 0; i--) {
            const el = elements[i];
            if (el.textContent.includes('兑换')) { // 检查文字是否包含"兑换"
                result.push(el); // 添加到结果数组
            }
        }
        return result; // 返回排序后的元素数组
    }

    /**
     * 获取北京时间（UTC+8）
     * @returns {Date} 返回北京时间对象
     */
    function getBeijingTime() {
        const now = new Date();  // 获取当前时间
        const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);  // 转换为UTC时间戳
        const beijingTime = new Date(utcTime + (8 * 3600000));  // 加上8小时得到北京时间
        return beijingTime;
    }

    /**
     * 检查当前时间是否在指定时间范围内（北京时间9:59:30-10:00:30）
     * 如果不在时间范围内，等待15秒后重新检测，直到进入时间范围
     * @returns {Promise<boolean>} Promise对象，resolve时表示已进入时间范围
     */
    function isWithinTimeRange() {
        return new Promise((resolve) => {
            const checkTime = () => {
                const beijingTime = getBeijingTime();  // 获取北京时间
                const hours = beijingTime.getHours();  // 获取小时
                const minutes = beijingTime.getMinutes();  // 获取分钟
                const seconds = beijingTime.getSeconds();  // 获取秒数
                const totalSeconds = hours * 3600 + minutes * 60 + seconds;  // 转换为总秒数

                const startSeconds = 9 * 3600 + 59 * 60 + 30;  // 9:59:30
                const endSeconds = 10 * 3600 + 0 * 60 + 30;  // 10:00:30

                const isWithinRange = totalSeconds >= startSeconds && totalSeconds <= endSeconds;  // 判断是否在范围内

                if (isWithinRange) {
                    logDisplay.log(`[淘金币脚本] 在运行时间内，开始执行兑换任务...`);
                    resolve(true);  // 进入时间范围，resolve Promise
                } else {
                    logDisplay.log(`[淘金币脚本] 不在运行时间内（9:59:40-10:00:15）`);
                    setTimeout(checkTime, 15000);  // 15秒后重新检测
                }
            };

            checkTime();  // 立即开始第一次检测
        });
    }

    /**
     * 通用按钮查找器
     * @param {string} selector CSS选择器
     * @returns {Element|null} 返回匹配的元素，未找到返回 null
     */
    function findButton(selector) {
        return document.querySelector(selector); // 使用 CSS 选择器查找元素
    }

    /**
     * 处理单个兑换按钮：点击 -> 点击确认
     * @param {Element} exchangeBtn 兑换按钮元素
     * @param {Function} callback 处理完成后的回调函数
     */
    function processExchangeButton(exchangeBtn, callback) {
        logDisplay.log('[淘金币脚本] 点击兑换按钮...');
        exchangeBtn.click(); // 点击兑换按钮

        // 等待弹窗出现后点击确认按钮
        setTimeout(() => {
            const confirmBtn = findButton(CONFIRM_SELECTOR);

            if (confirmBtn) {
                logDisplay.log('[淘金币脚本] 找到确认按钮，点击中...');
                confirmBtn.click(); // 点击确认按钮
                
                // 等待后查找领取按钮
                setTimeout(() => {
                    const receiveBtn = findButton(RECEIVE_SELECTOR);
                    if (receiveBtn) {
                        logDisplay.log('[淘金币脚本] 找到领取按钮，点击中...');
                        receiveBtn.click();
                    } else {
                        logDisplay.log('[淘金币脚本] 未找到领取按钮...');
                    }
                }, 100); // 等待确认按钮点击后的弹窗
            } else {
                logDisplay.log('[淘金币脚本] 未找到确认按钮...');
            }

            // 执行回调，处理下一个
            setTimeout(callback, 100);
        }, 100); // 短暂延迟以等待弹窗出现
    }

    /**
     * 依次处理所有兑换按钮
     * @param {Element[]} buttons 兑换按钮数组
     * @param {number} index 当前处理的索引
     */
    function processAllButtons(buttons, index) {
        if (index >= buttons.length) {
            // 所有按钮处理完毕，刷新页面
            logDisplay.log('[淘金币脚本] 所有按钮处理完毕，刷新页面...');
            location.reload();
            return;
        }

        logDisplay.log(`[淘金币脚本] 处理第 ${index + 1}/${buttons.length} 个按钮...`);
        processExchangeButton(buttons[index], () => {
            processAllButtons(buttons, index + 1); // 处理下一个按钮
        });
    }

    /**
     * 主执行逻辑
     */
    async function main() {
        logDisplay.log('[淘金币脚本] 开始执行...');

        // 时间检测：只在北京时间9:59:30-10:00:30之间运行，如果不在范围内会等待15秒后重新检测
        await isWithinTimeRange();

        // 第一步：查找所有兑换按钮
        const exchangeButtons = findAllExchangeButtons();

        if (exchangeButtons.length === 0) {
            // 未找到兑换按钮，立即刷新页面
            logDisplay.log('[淘金币脚本] 未找到兑换按钮，刷新页面...');
            location.reload();
            return;
        }

        logDisplay.log(`[淘金币脚本] 找到 ${exchangeButtons.length} 个兑换按钮，开始依次处理...`);
        processAllButtons(exchangeButtons, 0); // 从第一个按钮开始处理
    }

    // 等待页面完全加载后再执行
    // 如果页面已加载完成，直接执行；否则等待 load 事件
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

})();

