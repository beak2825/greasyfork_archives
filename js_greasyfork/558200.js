// ==UserScript==
// @name         微信读书沉浸式进度显示
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  微信读书沉浸式进度显示。
// @author       levonfly & BotGem
// @match        https://weread.qq.com/web/reader/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558200/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E6%B2%89%E6%B5%B8%E5%BC%8F%E8%BF%9B%E5%BA%A6%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/558200/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E6%B2%89%E6%B5%B8%E5%BC%8F%E8%BF%9B%E5%BA%A6%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 配置 ---
    const FLOAT_ID = 'botgem-progress-float';

    // --- 核心状态 ---
    const state = {
        // 核心数据
        domProgress: null,      // 微信侧边栏显示的“基准”进度
        baseScrollY: 0,         // 获取到基准进度时的 Y 轴位置

        // 动态计算参数
        pixelsPerPercent: 1000,

        // 显示缓动相关
        targetVal: 0,           // 目标显示数值
        currentDisplayVal: 0,   // 当前屏幕上画的数值（用于做动画）

        // 学习相关
        lastValidProgress: null,
        lastValidScroll: 0
    };

    /**
     * 获取微信读书原本的进度 (DOM)
     */
    function getDomProgressValue() {
        const catalogEl = document.querySelector('.readerCatalog_list_item_meta_progress > div');
        if (catalogEl) {
            const match = catalogEl.innerText.match(/(\d+(\.\d+)?)%/);
            if (match && match[1]) return parseFloat(match[1]);
        }
        return null; // 没获取到
    }

    /**
     * 渲染 UI (带简单的动画平滑处理)
     */
    function drawUI(val) {
        // 保留1位小数
        const textStr = val.toFixed(1) + '%';

        let floatEl = document.getElementById(FLOAT_ID);
        if (!floatEl) {
            floatEl = document.createElement('div');
            floatEl.id = FLOAT_ID;
            floatEl.style.cssText = `
                position: fixed; bottom: 15px; right: 20px; z-index: 2147483647;
                font-size: 13px; color: #333; font-weight: 500; opacity: 0.8;
                pointer-events: none; font-family: -apple-system, sans-serif;
                text-shadow: 1px 1px 0px rgba(255,255,255,1);
                transition: opacity 0.3s;
            `;
            document.body.appendChild(floatEl);
        }
        floatEl.innerText = textStr;
    }

    /**
     * 核心逻辑循环
     */
    function loop() {
        // A. 获取数据
        const currentScrollY = window.scrollY;
        const realDomVal = getDomProgressValue();

        // B. 处理基准值更新 (关键逻辑)
        // 只有当获取到真实的 DOM 值，且这个值和我们上次记录的不一样时，才进行“校准”
        if (realDomVal !== null) {

            // 如果是第一次，或者进度发生了“整章跳变” (比如从 20% 变到了 25%)
            if (state.domProgress === null || Math.abs(realDomVal - state.domProgress) > 0.05) {

                // === 智能学习算法 ===
                // 如果我们之前记录过一个旧的位置，我们就可以计算刚才这一段“到底是多少像素 = 1%”
                if (state.domProgress !== null && currentScrollY > state.baseScrollY) {
                    const deltaScroll = currentScrollY - state.baseScrollY;
                    const deltaPercent = realDomVal - state.domProgress;

                    // 只有当变化量合理时（防止章节跳转导致计算错误）
                    if (deltaPercent > 0.1 && deltaPercent < 15) {
                        const calculatedPPP = deltaScroll / deltaPercent;

                        // 修正系数：为了防止波动过大，我们采用加权平均
                        // 新的系数 = 旧系数的60% + 新计算系数的40%
                        state.pixelsPerPercent = (state.pixelsPerPercent * 0.6) + (calculatedPPP * 0.4);

                        // 限制一下边界，防止因为某些 bug 导致系数无穷大
                        if (state.pixelsPerPercent < 300) state.pixelsPerPercent = 300;
                        if (state.pixelsPerPercent > 4000) state.pixelsPerPercent = 4000;
                    }
                }

                // 更新基准点
                state.domProgress = realDomVal;
                state.baseScrollY = currentScrollY;
            }
        }

        // C. 计算目标进度
        let calculated = 0;

        if (state.domProgress !== null) {
            // 公式： 当前进度 = 基准进度 + (滚动的距离 / 系数)
            const addOn = (currentScrollY - state.baseScrollY) / state.pixelsPerPercent;

            // 限制模拟增量的最大值，防止还没翻页，进度条已经跑太远了
            // 限制为最多模拟增加 3.5%
            const maxAdd = 3.5;
            calculated = state.domProgress + Math.min(addOn, maxAdd);
        } else {
            // 降级方案：如果没有基准值，按页面高度估算
            const docH = document.body.scrollHeight - window.innerHeight;
            if (docH > 0) {
                calculated = (currentScrollY / docH) * 100;
            }
        }

        // 边界保护
        if (calculated > 100) calculated = 100;
        if (calculated < 0) calculated = 0;

        // D. 视觉平滑处理 (缓动)
        // 让 currentDisplayVal 慢慢接近 calculated，而不是瞬间跳过去
        state.targetVal = calculated;

        // 距离目标的差值
        const diff = state.targetVal - state.currentDisplayVal;

        if (Math.abs(diff) > 0.005) {
            // 逼近速度：每次补距离的 10%，形成减速动画
            // 如果差距很大（说明换章了，例如21%跳25%），速度加倍以便快速跟上
            const speed = Math.abs(diff) > 1.0 ? 0.2 : 0.08;
            state.currentDisplayVal += diff * speed;
        } else {
            state.currentDisplayVal = state.targetVal;
        }

        // E. 绘制
        drawUI(state.currentDisplayVal);

        window.requestAnimationFrame(loop);
    }

    // --- 启动 ---
    function init() {
        // 先手动触发一次循环
        window.requestAnimationFrame(loop);
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }

})();
