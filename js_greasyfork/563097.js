// ==UserScript==
// @name         悬浮精准时间显示（秒杀助手）
// @name:en      Precision Floating Clock (Synchronized)
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  在网页右上角显示带有毫秒的精准北京时间，支持自动与苏宁、淘宝服务器同步，确保秒杀不掉链子。支持拖拽、亮暗色自动切换及自定义颜色。
// @description:en Display high-precision network time (including milliseconds) on any webpage. Supports synchronization with Tmall and Suning servers, perfect for flash sales. Features include drag-and-drop, dark mode support, and customizable colors.
// @author       l_greasy
// @match        *://*/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @connect      suning.com
// @connect      taobao.com
// @downloadURL https://update.greasyfork.org/scripts/563097/%E6%82%AC%E6%B5%AE%E7%B2%BE%E5%87%86%E6%97%B6%E9%97%B4%E6%98%BE%E7%A4%BA%EF%BC%88%E7%A7%92%E6%9D%80%E5%8A%A9%E6%89%8B%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/563097/%E6%82%AC%E6%B5%AE%E7%B2%BE%E5%87%86%E6%97%B6%E9%97%B4%E6%98%BE%E7%A4%BA%EF%BC%88%E7%A7%92%E6%9D%80%E5%8A%A9%E6%89%8B%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let config = GM_getValue('clockConfig_v5_7', {
        bgColor: '#ffffff',
        textColor: '#000000',
        bgOpacity: 0.45,
        pos: { top: '30px', left: (window.innerWidth - 250) + 'px' }
    });

    let timeOffset = 0;
    let clockDiv, settingsPanel;

    // --- 样式定义 ---
    function updateStyles() {
        const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const displayTextColor = config.textColor === 'auto'
            ? (isDarkMode ? '#ffffff' : '#000000')
            : config.textColor;

        const css = `
            @keyframes glassFlow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }

            #tm-precise-clock-v5-7 {
                position: fixed !important;
                top: ${config.pos.top};
                left: ${config.pos.left};
                right: auto !important;
                width: 230px !important;
                height: 62px !important;
                display: flex !important;
                align-items: center;
                justify-content: center;
                padding: 0 !important;
                z-index: 2147483647 !important;
                font-family: "SF Pro Display", "SF Pro", -apple-system, BlinkMacSystemFont, sans-serif !important;
                font-variant-numeric: tabular-nums !important;
                font-weight: 200 !important;
                font-size: 32px !important;
                letter-spacing: -0.2px !important;
                -webkit-font-smoothing: antialiased;
                background: linear-gradient(135deg,
                    rgba(255, 255, 255, ${config.bgOpacity}),
                    rgba(255, 255, 255, ${config.bgOpacity + 0.15})) !important;
                background-size: 200% 200% !important;
                animation: glassFlow 8s ease infinite !important;
                color: ${displayTextColor} !important;
                border-radius: 22px !important;
                cursor: move !important;
                user-select: none !important;
                border: 0.5px solid rgba(255, 255, 255, 0.5) !important;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08) !important;
                backdrop-filter: blur(25px) saturate(190%) !important;
                -webkit-backdrop-filter: blur(25px) saturate(190%) !important;
                overflow: hidden;
                transition: transform 0.2s cubic-bezier(0.2, 0, 0.2, 1), color 0.4s ease;
            }

            #tm-precise-clock-v5-7::before {
                content: '';
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background: radial-gradient(circle at var(--x, 50%) var(--y, 50%),
                            rgba(255, 255, 255, 0.45) 0%,
                            transparent 60%);
                opacity: 0;
                transition: opacity 0.3s;
                pointer-events: none;
            }

            #tm-precise-clock-v5-7:hover::before { opacity: 1; }
            #tm-precise-clock-v5-7:active { transform: scale(0.96); }

            .tm-ms-v5-7 {
                font-size: 0.55em;
                margin-left: 6px;
                opacity: 0.5;
                font-weight: 300;
                width: 1.2em;
                display: inline-block;
            }

            #tm-settings-v5-7 {
                position: fixed !important;
                background: rgba(255, 255, 255, 0.95) !important;
                backdrop-filter: blur(30px) !important;
                border-radius: 24px !important;
                padding: 20px !important;
                z-index: 2147483647 !important;
                width: 180px !important;
                display: none;
                box-shadow: 0 20px 50px rgba(0,0,0,0.15) !important;
                border: 1px solid rgba(255,255,255,0.7) !important;
                font-family: -apple-system, sans-serif;
            }
            .s-item { margin-bottom: 18px; }
            .s-item label { display: flex; justify-content: space-around; align-items: center; }
            #cfg-ok-v5 {
                width: 100%; background: #007AFF; color: #fff; border: none;
                padding: 10px; border-radius: 14px; cursor: pointer; font-weight: 600;
            }
            .color-dot {
                width: 28px; height: 28px; border-radius: 50%; border: 2px solid transparent; cursor: pointer;
                transition: 0.2s;
            }
            .dot-active { border-color: #007AFF !important; transform: scale(1.15); }
        `;
        const existingStyle = document.getElementById('tm-clock-style-v5');
        if (existingStyle) existingStyle.remove();
        const s = document.createElement('style');
        s.id = 'tm-clock-style-v5';
        s.textContent = css;
        document.head.appendChild(s);
    }

    // --- 核心对时逻辑 ---
    function syncTime() {
        const startTime = Date.now();
        // 优先使用苏宁接口
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://quan.suning.com/getSysTime.do",
            timeout: 3000,
            onload: (res) => {
                try {
                    const endTime = Date.now();
                    const rtt = endTime - startTime; // 计算网络往返延迟
                    const data = JSON.parse(res.responseText);
                    // 假设服务器处理时间极短，服务器时间 = 返回时间 - (延迟/2)
                    const serverTime = new Date(data.sysTime2.replace(/-/g, '/')).getTime();
                    timeOffset = (serverTime + (rtt / 2)) - endTime;
                    console.log(`[Clock] 校准成功 (Suning), 延迟: ${rtt}ms, 偏移: ${timeOffset}ms`);
                } catch (e) {
                    syncTimeBackup(); // 主接口解析失败则尝试备用
                }
            },
            onerror: () => syncTimeBackup()
        });
    }

    function syncTimeBackup() {
        const startTime = Date.now();
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp",
            timeout: 3000,
            onload: (res) => {
                try {
                    const endTime = Date.now();
                    const rtt = endTime - startTime;
                    const data = JSON.parse(res.responseText);
                    const serverTime = parseInt(data.data.t);
                    timeOffset = (serverTime + (rtt / 2)) - endTime;
                    console.log(`[Clock] 备用校准成功 (Taobao), 延迟: ${rtt}ms`);
                } catch (e) {}
            }
        });
    }

    // --- 刷新逻辑 ---
    function updateClock() {
        if (!clockDiv) return;
        const now = new Date(Date.now() + timeOffset);
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0'); // 取两位毫秒

        // 直接操作 DOM 提升性能
        clockDiv.innerHTML = `${h}:${m}:${s}<span class="tm-ms-v5-7">${ms}</span>`;
        requestAnimationFrame(updateClock);
    }

    // --- 初始化 ---
    function init() {
        if (document.getElementById('tm-precise-clock-v5-7')) return;

        clockDiv = document.createElement('div');
        clockDiv.id = 'tm-precise-clock-v5-7';
        settingsPanel = document.createElement('div');
        settingsPanel.id = 'tm-settings-v5-7';

        (document.body || document.documentElement).appendChild(clockDiv);
        (document.body || document.documentElement).appendChild(settingsPanel);

        updateStyles();

        // 鼠标随动光影
        clockDiv.addEventListener('mousemove', (e) => {
            const rect = clockDiv.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            clockDiv.style.setProperty('--x', `${x}%`);
            clockDiv.style.setProperty('--y', `${y}%`);
        });

        // 亮暗色切换监听
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateStyles);

        // 拖拽与设置弹出逻辑
        let isDragging = false, hasMoved = false, ox, oy, startX, startY;
        clockDiv.onmousedown = (e) => {
            if (e.button !== 0) return;
            isDragging = true; hasMoved = false;
            startX = e.clientX; startY = e.clientY;
            const rect = clockDiv.getBoundingClientRect();
            ox = e.clientX - rect.left; oy = e.clientY - rect.top;
        };
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            if (Math.abs(e.clientX - startX) > 2 || Math.abs(e.clientY - startY) > 2) hasMoved = true;
            config.pos.left = (e.clientX - ox) + 'px';
            config.pos.top = (e.clientY - oy) + 'px';
            clockDiv.style.left = config.pos.left;
            clockDiv.style.top = config.pos.top;
        });
        document.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            if (!hasMoved) showSettings(e.clientX, e.clientY);
            else GM_setValue('clockConfig_v5_7', config);
        });

        updateClock();
        syncTime();
        // 每 5 分钟自动校准一次
        setInterval(syncTime, 300000);
    }

    function showSettings(x, y) {
        settingsPanel.innerHTML = `
            <div style="font-weight:600; margin-bottom:15px; font-size:15px; color:#1d1d1f; text-align:center;">Appearance</div>
            <div class="s-item">
                <label>
                    <div class="color-dot" data-col="auto" style="background: linear-gradient(135deg, #000 50%, #fff 50%); border: 1px solid #ddd;" title="Auto"></div>
                    <div class="color-dot" data-col="#000000" style="background: #000;" title="Dark Text"></div>
                    <div class="color-dot" data-col="#ffffff" style="background: #fff; border: 1px solid #eee;" title="Light Text"></div>
                </label>
            </div>
            <button id="cfg-ok-v5">Done</button>
        `;

        settingsPanel.style.display = 'block';
        settingsPanel.style.left = Math.min(x, window.innerWidth - 200) + 'px';
        settingsPanel.style.top = Math.min(y, window.innerHeight - 150) + 'px';

        settingsPanel.querySelectorAll('.color-dot').forEach(dot => {
            if(dot.dataset.col === config.textColor) dot.classList.add('dot-active');
            dot.onclick = () => {
                settingsPanel.querySelectorAll('.color-dot').forEach(d => d.classList.remove('dot-active'));
                dot.classList.add('dot-active');
                config.textColor = dot.dataset.col;
                updateStyles();
            };
        });

        settingsPanel.querySelector('#cfg-ok-v5').onclick = () => {
            GM_setValue('clockConfig_v5_7', config);
            settingsPanel.style.display = 'none';
        };
    }

    document.addEventListener('mousedown', (e) => {
        if (settingsPanel && !settingsPanel.contains(e.target) && e.target !== clockDiv) {
            settingsPanel.style.display = 'none';
        }
    });

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();