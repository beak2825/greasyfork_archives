// ==UserScript==
// @name         Let it Snow!
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Google AI Studio 下雪算法移植版
// @author       Snowballl11, Gemini 3 Pro Preview
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/559223/Let%20it%20Snow%21.user.js
// @updateURL https://update.greasyfork.org/scripts/559223/Let%20it%20Snow%21.meta.js
// ==/UserScript==

/**
 * ⚠️ 说明 / Credits:
 * 本脚本核心下雪算法 (Canvas/Physics) 移植自 Google AI Studio 网站彩蛋。
 * 拖拽 UI 与交互逻辑由 Snowballl11 原创开发。
 * 代码仅供学习与交流使用。
 * 
 * 1.1 更新日志：
 * - 修复了在包含 iframe 的网页中出现多个按钮的问题 (添加 @noframes)。
 */

(function() {
    'use strict';

    // 双重保险：如果在 iframe 中运行（window.top !== window.self），直接停止
    if (window.top !== window.self) return;

    /**
     * 核心类：SnowEffect
     * 负责 Canvas 渲染循环、粒子状态管理和物理运动计算。
     */
    class SnowEffect {
        constructor() {
            // 使用数组存储所有粒子对象，相比 DOM 操作，JS 对象在大量数据下的性能更优
            this.particles = [];
            this.canvas = null;
            this.ctx = null;
            // 获取设备像素比 (Device Pixel Ratio)，用于在高分屏上渲染清晰图像
            this.dpr = window.devicePixelRatio || 1;
            
            // 动画状态控制
            // 默认 isRunning 为 false，确保初始化时不自动开始
            this.isRunning = false;
            
            // 透明度控制变量，用于实现渐入渐出效果
            // targetOpacity: 目标状态 (1为显示，0为隐藏)
            // currentOpacity: 当前实际渲染的 alpha 值
            this.targetOpacity = 0;
            this.currentOpacity = 0;
            
            // 时间增量计算相关变量
            this.lastTime = 0;
            this.width = 0;
            this.height = 0;
        }

        /**
         * 初始化 Canvas 和粒子池
         */
        init() {
            if (this.canvas) return;

            // 创建全屏 Canvas 元素
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'google-snow-canvas';
            
            // 设置 CSS 样式
            // pointer-events: none 确保雪花不会阻挡用户点击网页下方的元素
            this.canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 2147483647; /* 保证层级最高 */
                opacity: 0; /* 初始 CSS 透明度 */
                transition: opacity 0.2s;
            `;
            document.body.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
            
            // 将 Canvas 的 CSS 透明度锁定在 0.5，与原网站效果一致
            // 这意味着 globalAlpha = 1 时，视觉上也只有 50% 亮度，避免过亮
            requestAnimationFrame(() => this.canvas.style.opacity = '0.5');

            // 初始化 2000 个粒子
            // 2000 是原网站使用的数值，兼顾视觉密度和运行性能
            for (let i = 0; i < 2000; i++) {
                this.particles.push({
                    x: Math.random(),       // 横坐标 (0.0 - 1.0)
                    y: Math.random(),       // 纵坐标 (0.0 - 1.0)
                    vx: Math.random() - 0.5, // 水平速度分量
                    vy: (1 + Math.random() * 10) / 10, // 垂直速度分量
                    freqx: 1 + Math.random() * 5,      // X轴震荡频率
                    freqy: 1 + Math.random() * 5,      // Y轴震荡频率
                    size: 0.1 + Math.random() * 1.4,   // 粒子半径
                    phasex: Math.random() * 2 * Math.PI, // 相位偏移
                    phasey: Math.random() * 2 * Math.PI
                });
            }

            // 处理窗口大小变化
            this.resize();
            window.addEventListener('resize', () => this.resize());
        }

        /**
         * 调整 Canvas 尺寸以适应窗口
         */
        resize() {
            if (!this.canvas) return;
            this.dpr = window.devicePixelRatio || 1;
            // 物理分辨率 = 逻辑分辨率 * DPR
            this.canvas.width = window.innerWidth * this.dpr;
            this.canvas.height = window.innerHeight * this.dpr;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
        }

        /**
         * 检测是否为深色模式
         */
        isDarkMode() {
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }

        /**
         * 渲染每一帧
         * @param {number} currentTime - performance.now() 提供的时间戳
         */
        render(currentTime) {
            // 优化：当完全看不见且目标是关闭时，停止渲染循环以节省 CPU
            const shouldRender = (Math.abs(this.currentOpacity) > 0.000001) || (this.targetOpacity !== 0);

            if (!shouldRender) {
                this.isRunning = false;
                this.ctx.clearRect(0, 0, this.width, this.height);
                return;
            }

            // 使用线性插值 (Lerp) 算法平滑过渡透明度
            this.currentOpacity += (this.targetOpacity - this.currentOpacity) * 0.05;
            this.ctx.globalAlpha = this.currentOpacity;

            // 计算时间增量 (Delta Time)，基于 60FPS (16ms) 标准化
            const dt = (currentTime - this.lastTime) / 16;
            this.lastTime = currentTime;
            const w = this.width;
            const h = this.height;

            // 清空画布
            this.ctx.clearRect(0, 0, w, h);
            
            // 根据主题设置颜色
            this.ctx.fillStyle = this.isDarkMode() ? "white" : "lightblue";

            // 遍历并更新每一个粒子
            for (const f of this.particles) {
                // 根据屏幕尺寸归一化速度
                const k = 2 * f.vx / f.size / w;
                const l = 2 * f.vy / f.size / h;

                this.ctx.beginPath();
                
                // 使用正弦函数模拟空气阻力产生的飘动效果
                const xOscillation = w / 200 * Math.sin(f.freqx * currentTime * l + f.phasex);
                const yOscillation = h / 200 * Math.sin(f.freqy * currentTime * k + f.phasey);
                
                // 绘制圆形粒子
                this.ctx.arc(
                    f.x * w + xOscillation, 
                    f.y * h + yOscillation, 
                    f.size * this.dpr, 
                    0, 2 * Math.PI
                );
                this.ctx.fill();

                // 更新物理位置
                f.x += k * dt;
                f.y += l * dt;
                
                // 边界处理：使用取模运算实现循环效果
                // 当粒子移除屏幕边缘时，自动从另一侧出现
                f.x %= 1; 
                f.y %= 1;
                // JS 取模对负数可能返回负结果，需修正
                if (f.x < 0) f.x += 1;
            }

            // 请求下一帧动画
            requestAnimationFrame((t) => this.render(t));
        }

        start() {
            this.init();
            this.targetOpacity = 1;
            if (!this.isRunning) {
                this.isRunning = true;
                this.lastTime = performance.now();
                requestAnimationFrame((t) => this.render(t));
            }
        }

        stop() {
            this.targetOpacity = 0; // 只需设置目标透明度，render 函数会处理渐隐
        }

        toggle() {
            if (this.targetOpacity === 0) {
                this.start();
                return true;
            } else {
                this.stop();
                return false;
            }
        }
    }

    /**
     * UI 模块：创建可拖动按钮
     */
    function createDraggableUI(snowInstance) {
        // 防止 DOM 中已存在按钮 (例如单页应用重载时)
        if (document.getElementById('let-it-snow-button')) return;

        const button = document.createElement('div');
        button.id = 'let-it-snow-button';
        button.textContent = '❄️';
        button.title = 'Let it snow';
        
        Object.assign(button.style, {
            position: 'fixed',
            bottom: '20px',
            left: '16px',
            zIndex: '9999',
            fontSize: '20px',
            cursor: 'pointer',
            backgroundColor: '#444',
            color: '#fff',
            width: '44px',
            height: '44px',
            borderRadius: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            // 禁止用户选中按钮文本，防止拖动时变蓝
            userSelect: 'none',
            webkitUserSelect: 'none',
            touchAction: 'none' // 优化触摸设备体验
        });

        document.body.appendChild(button);

        // 拖拽逻辑状态
        let isDragging = false;
        let hasMoved = false; // 用于区分点击和拖拽
        let startX, startY, initialLeft, initialTop;

        const onMouseDown = (e) => {
            if (e.type === 'mousedown' && e.button !== 0) return;
            isDragging = true;
            hasMoved = false;
            
            // 兼容 MouseEvent 和 TouchEvent
            const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
            startX = clientX;
            startY = clientY;

            const rect = button.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            
            button.style.cursor = 'grabbing';
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;

            const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
            const dx = clientX - startX;
            const dy = clientY - startY;

            // 只有移动超过阈值才视为拖拽
            if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
                hasMoved = true;
            }

            // 切换为绝对定位跟随鼠标
            button.style.bottom = 'auto'; 
            button.style.left = `${initialLeft + dx}px`;
            button.style.top = `${initialTop + dy}px`;
        };

        const onMouseUp = () => {
            if (!isDragging) return;
            isDragging = false;
            button.style.cursor = 'pointer';
        };

        // 绑定事件 (支持鼠标和触摸)
        button.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        button.addEventListener('touchstart', onMouseDown, { passive: false });
        document.addEventListener('touchmove', onMouseMove, { passive: false });
        document.addEventListener('touchend', onMouseUp);

        // 点击事件处理
        button.addEventListener('click', (e) => {
            // 如果刚刚进行了拖拽，则拦截点击事件
            if (hasMoved) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            const isOn = snowInstance.toggle();
            button.style.backgroundColor = isOn ? '#666' : '#444';
        });
    }

    function init() {
        const snow = new SnowEffect();
        // 默认不调用 start()，保持关闭状态
        createDraggableUI(snow);
    }

    if (document.readyState !== 'loading') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

})();