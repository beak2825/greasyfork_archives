// ==UserScript==
// @name         Gemini 网页版上下文进度条 (Context Ring)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  在 Gemini 网页版 (gemini.google.com) 显示一个透明悬浮的圆环上下文进度条，默认 50w Token 上限，支持拖拽和颜色预警。
// @author       YourName
// @license      MIT
// @match        https://gemini.google.com/*
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561470/Gemini%20%E7%BD%91%E9%A1%B5%E7%89%88%E4%B8%8A%E4%B8%8B%E6%96%87%E8%BF%9B%E5%BA%A6%E6%9D%A1%20%28Context%20Ring%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561470/Gemini%20%E7%BD%91%E9%A1%B5%E7%89%88%E4%B8%8A%E4%B8%8B%E6%96%87%E8%BF%9B%E5%BA%A6%E6%9D%A1%20%28Context%20Ring%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区域 ---
    const MAX_TOKENS = 500000;    // 上限 50万 (可根据你的模型版本自行调整)
    const WARN_THRESHOLD = 250000; // 25万变色 (橙)
    const CRITICAL_THRESHOLD = 450000; // 45万变色 (红)
    const EST_RATIO = 1.2;        // 估算倍率 (1字符 ≈ 1.2 Token)

    const RADIUS = 28;
    const STROKE = 6;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

    let elValueText = null;
    let elLabelText = null;
    let elProgressCircle = null;

    function createRingPanel() {
        if (document.getElementById('gemini-ring-panel')) return;

        // 1. 面板容器
        const panel = document.createElement('div');
        panel.id = 'gemini-ring-panel';
        panel.style.cssText = `
            position: fixed !important;
            top: 100px;
            right: 20px;
            z-index: 999999;
            width: 90px;
            height: 90px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: move;
            user-select: none;
            background-color: transparent;
        `;

        // 恢复上次位置
        const savedTop = localStorage.getItem('gemini_ring_top');
        const savedLeft = localStorage.getItem('gemini_ring_left');
        if (savedTop && savedLeft) {
            panel.style.top = savedTop;
            panel.style.left = savedLeft;
        }

        // 2. SVG 圆环绘制
        const svgNs = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNs, "svg");
        svg.setAttribute("width", "70");
        svg.setAttribute("height", "70");
        svg.style.transform = "rotate(-90deg)";
        svg.style.filter = "drop-shadow(0 2px 3px rgba(0,0,0,0.5))";

        // 底环
        const bgCircle = document.createElementNS(svgNs, "circle");
        bgCircle.setAttribute("cx", "35");
        bgCircle.setAttribute("cy", "35");
        bgCircle.setAttribute("r", RADIUS);
        bgCircle.setAttribute("stroke", "rgba(0,0,0,0.4)");
        bgCircle.setAttribute("stroke-width", STROKE);
        bgCircle.setAttribute("fill", "none");
        svg.appendChild(bgCircle);

        // 进度环
        elProgressCircle = document.createElementNS(svgNs, "circle");
        elProgressCircle.setAttribute("cx", "35");
        elProgressCircle.setAttribute("cy", "35");
        elProgressCircle.setAttribute("r", RADIUS);
        elProgressCircle.setAttribute("stroke", "#4caf50");
        elProgressCircle.setAttribute("stroke-width", STROKE);
        elProgressCircle.setAttribute("fill", "none");
        elProgressCircle.setAttribute("stroke-linecap", "round");
        elProgressCircle.setAttribute("stroke-dasharray", CIRCUMFERENCE);
        elProgressCircle.setAttribute("stroke-dashoffset", CIRCUMFERENCE);
        elProgressCircle.style.transition = "stroke-dashoffset 0.5s ease, stroke 0.3s";
        svg.appendChild(elProgressCircle);

        panel.appendChild(svg);

        // 3. 文字显示
        const textContainer = document.createElement('div');
        textContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            text-shadow: 0 1px 3px rgba(0,0,0,0.8);
        `;

        elValueText = document.createElement('div');
        elValueText.textContent = "0%";
        elValueText.style.color = "#fff";
        elValueText.style.fontWeight = "bold";
        elValueText.style.fontSize = "14px";
        elValueText.style.fontFamily = "monospace";

        elLabelText = document.createElement('div');
        elLabelText.textContent = "0k";
        elLabelText.style.color = "#eee";
        elLabelText.style.fontSize = "10px";
        elLabelText.style.marginTop = "2px";

        textContainer.appendChild(elValueText);
        textContainer.appendChild(elLabelText);
        panel.appendChild(textContainer);
        document.body.appendChild(panel);

        // 4. 拖拽逻辑
        let isDown = false, offset = [0,0];
        panel.addEventListener('mousedown', function(e) {
            isDown = true;
            offset = [panel.offsetLeft - e.clientX, panel.offsetTop - e.clientY];
            panel.style.opacity = '0.7';
        });
        document.addEventListener('mouseup', function() {
            if(isDown) {
                isDown = false;
                panel.style.opacity = '1';
                localStorage.setItem('gemini_ring_top', panel.style.top);
                localStorage.setItem('gemini_ring_left', panel.style.left);
            }
        });
        document.addEventListener('mousemove', function(e) {
            if (isDown) {
                e.preventDefault();
                panel.style.left = (e.clientX + offset[0]) + 'px';
                panel.style.top  = (e.clientY + offset[1]) + 'px';
            }
        });
    }

    function updateLogic() {
        // 防丢检测
        if (!document.getElementById('gemini-ring-panel')) {
            createRingPanel();
        }

        const mainContent = document.querySelector('main');
        if (!mainContent) return;

        // 使用 textContent 抓取所有加载的文本
        const text = mainContent.textContent || "";
        const estimatedTokens = Math.floor(text.length * EST_RATIO);
        
        let percent = estimatedTokens / MAX_TOKENS;
        if (percent > 1) percent = 1;

        // 更新圆环
        const offset = CIRCUMFERENCE * (1 - percent);
        if (elProgressCircle) {
            elProgressCircle.setAttribute("stroke-dashoffset", offset);
            
            // 颜色判断
            if (estimatedTokens > CRITICAL_THRESHOLD) {
                elProgressCircle.setAttribute("stroke", "#f44336"); // 红
            } else if (estimatedTokens > WARN_THRESHOLD) {
                elProgressCircle.setAttribute("stroke", "#ff9800"); // 橙
            } else {
                elProgressCircle.setAttribute("stroke", "#4caf50"); // 绿
            }
        }

        // 更新文字
        if (elValueText) {
            elValueText.textContent = (percent * 100).toFixed(0) + "%";
        }
        if (elLabelText) {
            const kVal = (estimatedTokens / 1000).toFixed(0);
            elLabelText.textContent = kVal + "k";
        }
    }

    // 每秒刷新一次
    setInterval(updateLogic, 1000);

    // 菜单命令：万一拖没了可以重置
    GM_registerMenuCommand("重置面板位置", () => {
        const p = document.getElementById('gemini-ring-panel');
        if (p) {
            p.style.top = '100px';
            p.style.left = '100px';
            localStorage.removeItem('gemini_ring_top');
            localStorage.removeItem('gemini_ring_left');
        }
    });

})();