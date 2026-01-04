// ==UserScript==
// @name         BiliSpeedUp
// @name:zh-CN   B站视频倍速工具
// @namespace    https://github.com/timerring/BiliSpeedUp
// @version      1.0.0
// @description  提供B站多倍速播放功能，支持自定义记忆播放速度、鼠标滚轮调节、触控板调节、记忆倍速
// @author       timerring
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @grant        none
// @license      MIT
// @homepage     https://github.com/timerring/BiliSpeedUp
// @supportURL   https://github.com/timerring/BiliSpeedUp/issues
// @downloadURL https://update.greasyfork.org/scripts/556631/BiliSpeedUp.user.js
// @updateURL https://update.greasyfork.org/scripts/556631/BiliSpeedUp.meta.js
// ==/UserScript==

(function() {
    'use strict';

(function () {
    'use strict';

    /**
     * 配置常量
     */
    const CONFIG = {
        STORAGE_KEY: 'bilibili_custom_speed',
        DEFAULT_SPEED: 1.0,
        MIN_SPEED: 0.07,
        MAX_SPEED: 10.0,
        SPEED_STEP: 0.01,
        CHECK_INTERVAL: 1000,
        MAX_RETRIES: 30,
        // 引导功能版本控制，修改版本号重新显示引导
        TOUR_VERSION: '1.0.0'
    };

    /**
     * 滚轮和触控板配置
     */
    const WHEEL_CONFIG = {
        MOUSE_STEP: 0.1,           // 鼠标滚轮步进
        TOUCHPAD_STEP: 0.02,       // 触控板步进
        TOUCHPAD_THRESHOLD: 30,    // 触控板累积阈值
        TOUCHPAD_DELTA_LIMIT: 50   // 触控板判断阈值
    };

    /**
     * 选择器常量
     */
    const SELECTORS = {
        VIDEO: 'video',
        PLAYBACK_RATE_BTN: '.bpx-player-ctrl-btn.bpx-player-ctrl-playbackrate',
        PLAYBACK_RATE_MENU: '.bpx-player-ctrl-playbackrate-menu',
        PLAYBACK_RATE_RESULT: '.bpx-player-ctrl-playbackrate-result',
        MENU_ITEM: '.bpx-player-ctrl-playbackrate-menu-item',
        CUSTOM_SPEED_INPUT: '#custom-speed-input',
        CUSTOM_SPEED_ITEM: '.custom-speed-item'
    };

    /**
     * 本地存储管理模块
     */

    /**
     * 获取保存的倍速
     * @returns {number} 保存的倍速值
     */
    function getSavedSpeed() {
        try {
            const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
            return saved ? parseFloat(saved) : CONFIG.DEFAULT_SPEED;
        } catch (e) {
            console.error('获取保存的倍速失败:', e);
            return CONFIG.DEFAULT_SPEED;
        }
    }

    /**
     * 保存倍速
     * @param {number} speed - 倍速值
     */
    function saveSpeed(speed) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, speed.toString());
        } catch (e) {
            console.error('保存倍速失败:', e);
        }
    }

    /**
     * 检查引导是否已显示
     * @param {string} version - 引导版本号
     * @returns {boolean}
     */
    function isTourShown(version) {
        const key = `bilibili_speed_tour_shown_v${version}`;
        return !!localStorage.getItem(key);
    }

    /**
     * 标记引导已显示
     * @param {string} version - 引导版本号
     */
    function markTourShown(version) {
        const key = `bilibili_speed_tour_shown_v${version}`;
        localStorage.setItem(key, 'true');
    }

    /**
     * 倍速控制核心模块
     */

    /**
     * 设置视频播放速度
     * @param {number} speed - 倍速值
     */
    function setVideoSpeed(speed) {
        const video = document.querySelector(SELECTORS.VIDEO);
        if (video) {
            video.playbackRate = speed;
            saveSpeed(speed);
            updateSpeedDisplay(speed);
        }
    }

    /**
     * 更新倍速显示
     * @param {number} speed - 倍速值
     */
    function updateSpeedDisplay(speed) {
        const resultDiv = document.querySelector(SELECTORS.PLAYBACK_RATE_RESULT);
        if (resultDiv) {
            resultDiv.textContent = speed === 1 ? '倍速' : `${speed.toFixed(2)}x`;
        }

        // 更新菜单项的激活状态
        const menuItems = document.querySelectorAll(SELECTORS.MENU_ITEM);
        menuItems.forEach(item => {
            const itemValue = parseFloat(item.getAttribute('data-value'));
            if (Math.abs(itemValue - speed) < 0.001) {
                item.classList.add('bpx-state-active');
            } else {
                item.classList.remove('bpx-state-active');
            }
        });

        // 更新自定义输入框的值
        const customInput = document.querySelector(SELECTORS.CUSTOM_SPEED_INPUT);
        if (customInput) {
            customInput.value = speed.toFixed(2);
        }
    }

    /**
     * 应用保存的倍速
     */
    function applySavedSpeed() {
        const savedSpeed = getSavedSpeed();
        if (savedSpeed !== CONFIG.DEFAULT_SPEED) {
            const video = document.querySelector(SELECTORS.VIDEO);
            if (video) {
                video.playbackRate = savedSpeed;
                updateSpeedDisplay(savedSpeed);
                console.log(`已应用保存的倍速: ${savedSpeed}x`);
            }
        }
    }

    /**
     * 限制倍速范围
     * @param {number} speed - 倍速值
     * @returns {number} 限制后的倍速值
     */
    function clampSpeed(speed) {
        return Math.max(CONFIG.MIN_SPEED, Math.min(CONFIG.MAX_SPEED, speed));
    }

    /**
     * 视频监听模块
     */

    /**
     * 启动视频监听
     * 监听视频元素变化，自动应用保存的倍速
     */
    function startVideoMonitor() {
        const observer = new MutationObserver(() => {
            applySavedSpeed();
        });

        const video = document.querySelector(SELECTORS.VIDEO);
        if (video && video.parentElement) {
            observer.observe(video.parentElement, {
                childList: true,
                subtree: true
            });
        }

        return observer;
    }

    /**
     * 倍速输入框组件
     */

    /**
     * 创建自定义倍速输入框
     * @returns {HTMLElement}
     */
    function createSpeedInput() {
        const input = document.createElement('input');
        input.type = 'number';
        input.id = 'custom-speed-input';
        input.min = CONFIG.MIN_SPEED;
        input.max = CONFIG.MAX_SPEED;
        input.step = CONFIG.SPEED_STEP;
        input.value = getSavedSpeed().toFixed(2);
        input.style.cssText = `
        width: 52px;
        padding: 4px 6px;
        border: 1px solid #3a3a3a;
        border-radius: 4px;
        font-size: 14px;
        text-align: center;
        color: #fff;
        background: #212121;
        appearance: textfield;
        -moz-appearance: textfield;
        -webkit-appearance: none;
    `;

        // 悬停效果
        input.onmouseover = () => {
            input.style.background = '#3a3a3a';
        };
        input.onmouseout = () => {
            input.style.background = '#212121';
        };

        // 应用倍速
        const applySpeed = () => {
            let speed = parseFloat(input.value);
            if (isNaN(speed)) {
                speed = CONFIG.DEFAULT_SPEED;
            }
            speed = clampSpeed(speed);
            input.value = speed.toFixed(2);
            setVideoSpeed(speed);
        };

        // 回车应用
        input.onkeypress = (e) => {
            if (e.key === 'Enter') {
                e.stopPropagation();
                applySpeed();
            }
        };

        // 失焦应用
        input.onblur = applySpeed;

        return input;
    }

    /**
     * 创建自定义倍速控制容器
     * @returns {HTMLElement}
     */
    function createCustomSpeedControl() {
        const customItem = document.createElement('li');
        customItem.className = 'bpx-player-ctrl-playbackrate-menu-item custom-speed-item';
        customItem.style.cssText = `
        padding: 8px 10px;
        cursor: default;
        background: transparent;
        margin-top: 0;
        border-top: none;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

        const controlsContainer = document.createElement('div');
        controlsContainer.style.cssText = 'display: flex; flex-direction: column; gap: 6px;';

        const headerRow = document.createElement('div');
        headerRow.style.cssText = 'display: flex; align-items: center; gap: 6px; justify-content: center;';

        const input = createSpeedInput();
        headerRow.appendChild(input);
        controlsContainer.appendChild(headerRow);
        customItem.appendChild(controlsContainer);

        // 阻止点击事件冒泡
        customItem.onclick = (e) => {
            e.stopPropagation();
        };

        return customItem;
    }

    /**
     * 设备识别工具
     */

    /**
     * 判断是否为触控板
     * @param {WheelEvent} event - 滚轮事件
     * @returns {boolean}
     */
    function isTouchpad(event) {
        // deltaMode === 0 (DOM_DELTA_PIXEL) 通常是触控板
        // deltaMode === 1 (DOM_DELTA_LINE) 通常是鼠标滚轮
        return event.deltaMode === 0 && Math.abs(event.deltaY) < WHEEL_CONFIG.TOUCHPAD_DELTA_LIMIT;
    }

    /**
     * 获取滚动方向
     * @param {number} deltaY - 滚动增量
     * @returns {number} 1 表示向下，-1 表示向上
     */
    function getScrollDirection(deltaY) {
        return deltaY > 0 ? 1 : -1;
    }

    /**
     * 滚轮和触控板处理模块
     */

    /**
     * 为倍速按钮添加滚轮事件监听
     */
    function attachWheelHandler() {
        const playbackBtn = document.querySelector(SELECTORS.PLAYBACK_RATE_BTN);
        if (!playbackBtn || playbackBtn.dataset.customWheelBound) {
            return;
        }

        playbackBtn.dataset.customWheelBound = 'true';
        let touchpadDeltaAccum = 0;

        playbackBtn.addEventListener('wheel', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const video = document.querySelector(SELECTORS.VIDEO);
            if (!video) return;

            let speed = video.playbackRate || CONFIG.DEFAULT_SPEED;
            const isTouch = isTouchpad(e);

            if (isTouch) {
                // 触控板：累积阈值 + 细腻步进
                touchpadDeltaAccum += e.deltaY;
                
                if (Math.abs(touchpadDeltaAccum) < WHEEL_CONFIG.TOUCHPAD_THRESHOLD) {
                    return;
                }

                const direction = getScrollDirection(touchpadDeltaAccum);
                touchpadDeltaAccum -= direction * WHEEL_CONFIG.TOUCHPAD_THRESHOLD;
                speed += direction * WHEEL_CONFIG.TOUCHPAD_STEP;
                
                // 触控板四舍五入到 0.02 精度
                speed = Math.round(speed * 50) / 50;
            } else {
                // 鼠标滚轮：直接步进（方向反转：向上增加，向下减少）
                const direction = getScrollDirection(e.deltaY);
                speed -= direction * WHEEL_CONFIG.MOUSE_STEP;  // 使用减法反转方向
                
                // 鼠标滚轮四舍五入到 0.1 精度
                speed = Math.round(speed * 10) / 10;
            }

            speed = clampSpeed(speed);
            setVideoSpeed(speed);
        }, { passive: false });
    }

    /**
     * 菜单增强模块
     */

    /**
     * 增强倍速菜单
     * @returns {boolean} 是否成功增强
     */
    function enhanceSpeedMenu() {
        const menu = document.querySelector(SELECTORS.PLAYBACK_RATE_MENU);
        if (!menu) return false;

        // 检查是否已经添加过自定义控件
        if (menu.querySelector(SELECTORS.CUSTOM_SPEED_ITEM)) {
            return true;
        }

        // 添加自定义倍速控制
        const customControl = createCustomSpeedControl();
        const twoXItem = menu.querySelector('.bpx-player-ctrl-playbackrate-menu-item[data-value="2"]');
        const firstItem = menu.querySelector('.bpx-player-ctrl-playbackrate-menu-item:not(.custom-speed-item)');
        
        if (twoXItem) {
            menu.insertBefore(customControl, twoXItem);
        } else if (firstItem) {
            menu.insertBefore(customControl, firstItem);
        } else {
            menu.appendChild(customControl);
        }

        // 为现有的倍速选项添加点击事件
        const menuItems = menu.querySelectorAll('.bpx-player-ctrl-playbackrate-menu-item:not(.custom-speed-item)');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const speed = parseFloat(item.getAttribute('data-value'));
                setVideoSpeed(speed);
            });
        });

        // 为倍速按钮添加滚轮调节事件
        attachWheelHandler();

        console.log('B站倍速增强已加载');
        return true;
    }

    /**
     * 引导动画样式
     */

    /**
     * 获取引导系统的 CSS 样式
     * @returns {string}
     */
    function getTourStyles() {
        return `
        .tour-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6); z-index: 99999; pointer-events: none; transition: opacity 0.3s; }
        .tour-highlight { position: absolute; box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6); z-index: 99998; border-radius: 4px; pointer-events: none; transition: all 0.3s ease; border: 2px solid #00aeec; }
        .tour-tooltip { position: absolute; background: #212121; color: #fff; padding: 16px; border-radius: 8px; width: 280px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); z-index: 100000; font-size: 14px; line-height: 1.6; border: 1px solid #3a3a3a; transition: all 0.3s ease; pointer-events: none; }
        .tour-tooltip h3 { margin: 0 0 8px 0; color: #00aeec; font-size: 16px; font-weight: bold; }
        .tour-tooltip p { margin: 0 0 16px 0; color: #e0e0e0; }
        .tour-footer { display: flex; justify-content: flex-end; gap: 10px; pointer-events: auto; }
        .tour-btn { padding: 6px 12px; border-radius: 4px; cursor: pointer; border: none; font-size: 12px; transition: background 0.2s; pointer-events: auto; }
        .tour-btn-skip { background: transparent; color: #999; }
        .tour-btn-skip:hover { color: #ccc; }
        .tour-btn-next { background: #00aeec; color: #fff; }
        .tour-btn-next:hover { background: #008bbd; }

        /* 动画样式 */
        .anim-container { display: flex; gap: 20px; margin-bottom: 15px; justify-content: center; }
        .anim-box { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .anim-label { font-size: 12px; color: #999; }
        
        /* 鼠标图标 */
        .anim-mouse {
            width: 24px; height: 38px;
            border: 2px solid #fff; border-radius: 12px;
            position: relative;
        }
        .anim-scroll {
            width: 4px; height: 6px; background: #00aeec;
            border-radius: 2px; position: absolute;
            left: 50%; transform: translateX(-50%);
            top: 6px;
            animation: scroll-wheel 1.5s infinite;
        }
        @keyframes scroll-wheel {
            0% { top: 6px; opacity: 1; }
            100% { top: 20px; opacity: 0; }
        }

        /* 触控板图标 */
        .anim-touchpad {
            width: 38px; height: 38px;
            border: 2px solid #fff; border-radius: 4px;
            position: relative; overflow: hidden;
        }
        .anim-finger {
            width: 8px; height: 8px; background: #00aeec;
            border-radius: 50%; position: absolute;
            left: 50%; top: 60%;
            transform: translate(-50%, -50%);
            animation: scroll-touch 1.5s infinite;
            box-shadow: 0 0 0 4px rgba(0, 174, 236, 0.3);
        }
        @keyframes scroll-touch {
            0% { top: 70%; opacity: 0; }
            20% { top: 70%; opacity: 1; }
            80% { top: 30%; opacity: 1; }
            100% { top: 30%; opacity: 0; }
        }

        /* 强制显示菜单样式 */
        .tour-force-show {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
    `;
    }

    /**
     * DOM 工具函数
     */


    /**
     * 创建样式元素
     * @param {string} css - CSS 内容
     * @returns {HTMLStyleElement}
     */
    function createStyle(css) {
        const style = document.createElement('style');
        style.textContent = css;
        return style;
    }

    /**
     * 检查页面是否为 B站视频页面
     * @returns {boolean}
     */
    function isBilibiliVideoPage() {
        return location.hostname.includes('bilibili.com') && 
               (location.pathname.includes('/video/') || location.pathname.includes('/bangumi/play/'));
    }

    /**
     * 首次使用引导系统
     */

    class TourGuide {
        constructor() {
            this.steps = [];
            this.currentStep = 0;
            this.overlay = null;
            this.tooltip = null;
            this.highlight = null;
        }

        /**
         * 启动引导
         */
        start() {
            if (isTourShown(CONFIG.TOUR_VERSION)) return;
            
            this.initStyles();
            this.createOverlay();
            this.createTooltip();
            this.defineSteps();
            
            setTimeout(() => this.showStep(0), 1000);
        }

        /**
         * 初始化样式
         */
        initStyles() {
            const style = createStyle(getTourStyles());
            document.head.appendChild(style);
        }

        /**
         * 创建遮罩层
         */
        createOverlay() {
            this.highlight = document.createElement('div');
            this.highlight.className = 'tour-highlight';
            document.body.appendChild(this.highlight);
        }

        /**
         * 创建提示框
         */
        createTooltip() {
            this.tooltip = document.createElement('div');
            this.tooltip.className = 'tour-tooltip';
            document.body.appendChild(this.tooltip);
        }

        /**
         * 定义引导步骤
         */
        defineSteps() {
            this.steps = [
                {
                    element: SELECTORS.PLAYBACK_RATE_BTN,
                    title: '倍速控制增强',
                    content: '👋 欢迎使用倍速增强脚本！<br>这里是倍速控制入口，支持悬停查看菜单。',
                    position: 'top'
                },
                {
                    element: SELECTORS.CUSTOM_SPEED_INPUT,
                    title: '自定义倍速',
                    content: '🔢 在这里直接输入任意倍速 (0.07 - 10.0)。<br>支持 0.01 精度，输入后回车即可应用。',
                    position: 'right',
                    action: () => {
                        const menu = document.querySelector(SELECTORS.PLAYBACK_RATE_MENU);
                        if (menu) {
                            menu.style.display = 'block';
                            menu.style.visibility = 'visible';
                            menu.style.opacity = '1';
                        }
                        const input = document.querySelector(SELECTORS.CUSTOM_SPEED_INPUT);
                        if (input) input.focus();
                    }
                },
                {
                    element: SELECTORS.PLAYBACK_RATE_MENU,
                    title: '滚轮与触控板调节',
                    content: `
                    <div class="anim-container">
                        <div class="anim-box">
                            <div class="anim-mouse"><div class="anim-scroll"></div></div>
                            <span class="anim-label">鼠标滚轮</span>
                        </div>
                        <div class="anim-box">
                            <div class="anim-touchpad"><div class="anim-finger"></div></div>
                            <span class="anim-label">触控板滑动</span>
                        </div>
                    </div>
                    上滑/滚动增加倍速，下滑/滚动减少倍速。<br><br>
                    🖱️ <b>鼠标滚轮：</b>在按钮或菜单上滚动，快速调节 (±0.1)。<br>
                    👆 <b>触控板：</b>在按钮或菜单上上下滑动，细腻微调 (±0.02)。<br>
                    💾 <b>自动记忆：</b>您的倍速设置会自动保存，下次观看自动恢复。
                `,
                    position: 'left',
                    action: () => {
                        const menu = document.querySelector(SELECTORS.PLAYBACK_RATE_MENU);
                        if (menu) {
                            menu.style.display = 'block';
                            menu.style.visibility = 'visible';
                            menu.style.opacity = '1';
                        }
                    },
                    isLast: true
                }
            ];
        }

        /**
         * 显示指定步骤
         * @param {number} index - 步骤索引
         */
        showStep(index) {
            if (index >= this.steps.length) {
                this.end();
                return;
            }

            this.currentStep = index;
            const step = this.steps[index];
            if (step.action) step.action();

            let target = step.element;
            if (typeof target === 'string') target = document.querySelector(target);

            if (!target && !step.isLast) {
                this.showStep(index + 1);
                return;
            }

            // 强制保持菜单显示
            if (step.element === SELECTORS.PLAYBACK_RATE_MENU || step.element === SELECTORS.CUSTOM_SPEED_INPUT) {
                const menu = document.querySelector(SELECTORS.PLAYBACK_RATE_MENU);
                if (menu) {
                    menu.style.display = 'block !important';
                    menu.style.visibility = 'visible !important';
                    menu.style.opacity = '1 !important';
                    menu.classList.add('tour-force-show');
                }
            }

            if (step.position === 'center') {
                this.highlight.style.display = 'none';
                this.tooltip.style.top = '50%';
                this.tooltip.style.left = '50%';
                this.tooltip.style.transform = 'translate(-50%, -50%)';
            } else {
                const rect = target.getBoundingClientRect();
                const scrollY = window.scrollY;
                const scrollX = window.scrollX;

                this.highlight.style.display = 'block';
                this.highlight.style.width = `${rect.width}px`;
                this.highlight.style.height = `${rect.height}px`;
                this.highlight.style.top = `${rect.top + scrollY}px`;
                this.highlight.style.left = `${rect.left + scrollX}px`;

                this.positionTooltip(step.position, rect, scrollY, scrollX);
            }

            this.renderTooltip(step);
        }

        /**
         * 定位提示框
         */
        positionTooltip(position, rect, scrollY, scrollX) {
            if (position === 'top') {
                this.tooltip.style.top = `${rect.top + scrollY - 160}px`;
                this.tooltip.style.left = `${rect.left + scrollX - 100}px`;
                this.tooltip.style.transform = 'none';
            } else if (position === 'right') {
                this.tooltip.style.top = `${rect.top + scrollY}px`;
                this.tooltip.style.left = `${rect.right + scrollX + 20}px`;
                this.tooltip.style.transform = 'none';
            } else if (position === 'left') {
                this.tooltip.style.top = `${rect.top + scrollY}px`;
                this.tooltip.style.left = `${rect.left + scrollX - 320}px`;
                this.tooltip.style.transform = 'none';
            }
        }

        /**
         * 渲染提示框内容
         */
        renderTooltip(step) {
            this.tooltip.innerHTML = `
            <h3>${step.title}</h3>
            <p>${step.content}</p>
            <div class="tour-footer">
                <button class="tour-btn tour-btn-skip" id="tour-skip">跳过</button>
                <button class="tour-btn tour-btn-next" id="tour-next">
                    ${step.isLast ? '完成' : '下一步'}
                </button>
            </div>
        `;

            document.getElementById('tour-next').onclick = () => this.showStep(this.currentStep + 1);
            document.getElementById('tour-skip').onclick = () => this.end();
        }

        /**
         * 结束引导
         */
        end() {
            if (this.highlight) this.highlight.remove();
            if (this.tooltip) this.tooltip.remove();
            markTourShown(CONFIG.TOUR_VERSION);
            
            // 清理强制显示的样式和类名
            const menu = document.querySelector(SELECTORS.PLAYBACK_RATE_MENU);
            if (menu) {
                menu.classList.remove('tour-force-show');
                menu.style.display = '';
                menu.style.visibility = '';
                menu.style.opacity = '';
            }
            
            // 确保菜单关闭
            const btn = document.querySelector(SELECTORS.PLAYBACK_RATE_BTN);
            if (btn) btn.dispatchEvent(new MouseEvent('mouseout'));
        }
    }

    /**
     * B站倍速播放增强 - 主入口
     * @author timerring
     * @version 1.0.0
     */


    /**
     * 初始化脚本
     */
    function init() {
        let retries = 0;
        
        const checkAndInit = setInterval(() => {
            retries++;
            
            // 尝试增强菜单
            if (enhanceSpeedMenu()) {
                // 应用保存的倍速
                setTimeout(applySavedSpeed, 500);
                
                // 启动引导（如果是首次）
                setTimeout(() => new TourGuide().start(), 1500);
                
                clearInterval(checkAndInit);
                
                // 启动视频监听
                startVideoMonitor();
            }
            
            // 超过最大重试次数则停止
            if (retries >= CONFIG.MAX_RETRIES) {
                clearInterval(checkAndInit);
                console.warn('B站倍速增强加载失败：未找到播放器控制元素');
            }
        }, CONFIG.CHECK_INTERVAL);
    }

    /**
     * 主函数
     */
    function main() {
        // 检查是否在B站视频页面
        if (isBilibiliVideoPage()) {
            console.log('开始加载 B站倍速增强...');
            init();
        } else {
            console.warn('请在 B站视频页面运行此脚本');
        }
    }

    // 启动脚本
    main();

})();

})();
