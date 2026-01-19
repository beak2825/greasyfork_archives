// ==UserScript==
// @name         悬浮精准时间显示（秒杀助手）
// @name:en      Precision Floating Clock (Synchronized)
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  在网页右上角显示带有毫秒的精准北京时间，支持自动与京东、淘宝服务器同步，确保秒杀不掉链子。支持拖拽、亮暗色自动切换及自定义颜色。
// @description:en Display high-precision network time (including milliseconds) on any webpage. Supports synchronization with Tmall and Suning servers, perfect for flash sales. Features include drag-and-drop, dark mode support, and customizable colors.
// @author       l_greasy
// @match        *://*/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @connect      jd.com
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
                z-index: 2147483647 !important;
                font-family: "SF Pro Display", "SF Pro", -apple-system, BlinkMacSystemFont, sans-serif !important;
                font-variant-numeric: tabular-nums !important;
                font-weight: 200 !important;
                font-size: 32px !important;
                background: linear-gradient(135deg, rgba(255,255,255,${config.bgOpacity}), rgba(255,255,255,${config.bgOpacity + 0.15})) !important;
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
                transition: transform 0.2s cubic-bezier(0.2, 0, 0.2, 1);
            }
            .tm-ms-v5-7 { font-size: 0.55em; margin-left: 6px; opacity: 0.5; font-weight: 300; width: 1.2em; display: inline-block; }
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
                font-family: -apple-system, sans-serif;
            }
            .s-item { margin-bottom: 18px; }
            .s-item label { display: flex; justify-content: space-around; align-items: center; }
            #cfg-ok-v5 { width: 100%; background: #007AFF; color: #fff; border: none; padding: 10px; border-radius: 14px; cursor: pointer; font-weight: 600; }
            .color-dot { width: 28px; height: 28px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; transition: 0.2s; }
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
        const fetchTaobao = new Promise((resolve, reject) => {
            const start = Date.now();
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp",
                timeout: 2000,
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        const serverTime = parseInt(data.data.t);
                        if (isNaN(serverTime)) throw new Error();
                        resolve({ serverTime, rtt: Date.now() - start, source: 'Taobao' });
                    } catch (e) { reject(); }
                },
                onerror: reject
            });
        });

        const fetchJD = new Promise((resolve, reject) => {
            const start = Date.now();
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://a.jd.com//ajax/queryServerData.html",
                timeout: 2000,
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        const serverTime = parseFloat(data.serverTime);
                        if (isNaN(serverTime)) throw new Error();
                        resolve({ serverTime, rtt: Date.now() - start, source: 'JD' });
                    } catch (e) { reject(); }
                },
                onerror: reject
            });
        });

        // 竞争机制：哪家先回用哪家
        Promise.any([fetchTaobao, fetchJD]).then(res => {
            const endTime = Date.now();
            // 修正后的偏移计算
            const offset = (res.serverTime + (res.rtt / 2)) - endTime;
            if (!isNaN(offset)) {
                timeOffset = offset;
                console.log(`[Clock] 校准成功 (${res.source}), 偏移: ${timeOffset}ms`);
            }
        }).catch(() => {
            console.warn("[Clock] 接口请求失败，维持当前偏移");
        });
    }

    // --- 刷新逻辑 ---
    function updateClock() {
        if (!clockDiv) return;
        const localNow = Date.now();
        const adjustedNow = new Date(localNow + timeOffset);

        // 极致容错：如果计算结果非法，强制显示本地时间
        const h = String(isNaN(adjustedNow.getTime()) ? new Date().getHours() : adjustedNow.getHours()).padStart(2, '0');
        const m = String(isNaN(adjustedNow.getTime()) ? new Date().getMinutes() : adjustedNow.getMinutes()).padStart(2, '0');
        const s = String(isNaN(adjustedNow.getTime()) ? new Date().getSeconds() : adjustedNow.getSeconds()).padStart(2, '0');
        const ms = String(Math.floor((isNaN(adjustedNow.getTime()) ? new Date().getMilliseconds() : adjustedNow.getMilliseconds()) / 10)).padStart(2, '0');

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

        // 交互逻辑
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
            if (!hasMoved) {
                syncTime(); // 点击时强制同步
                showSettings(e.clientX, e.clientY);
            } else {
                GM_setValue('clockConfig_v5_7', config);
            }
        });

        updateClock();
        syncTime();
        setInterval(syncTime, 300000);
    }

    function showSettings(x, y) {
        settingsPanel.innerHTML = `
            <div style="font-weight:600; margin-bottom:15px; font-size:14px; color:#1d1d1f; text-align:center;">Settings</div>
            <div class="s-item">
                <label>
                    <div class="color-dot" data-col="auto" style="background: linear-gradient(135deg, #000 50%, #fff 50%); border: 1px solid #ddd;"></div>
                    <div class="color-dot" data-col="#000000" style="background: #000;"></div>
                    <div class="color-dot" data-col="#ffffff" style="background: #fff; border: 1px solid #eee;"></div>
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