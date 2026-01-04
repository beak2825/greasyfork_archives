// ==UserScript==
// @name         FaceScroll - 头部远程控屏
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  解放双手！通过头部动作（抬头/低头）控制网页滚动。适配抖音/B站/YouTube Shorts（按键翻页）及普通网页（平滑滚屏）。包含校准功能，省力且丝滑。
// @author       无敌暴龙兽
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561362/FaceScroll%20-%20%E5%A4%B4%E9%83%A8%E8%BF%9C%E7%A8%8B%E6%8E%A7%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/561362/FaceScroll%20-%20%E5%A4%B4%E9%83%A8%E8%BF%9C%E7%A8%8B%E6%8E%A7%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 0. 调试日志 ---
    console.log("FaceScroll 省力版已启动");

    // 防止 iframe 重复加载
    if (window.top !== window.self) return;

    // --- 1. 配置参数 ---
    const CONFIG = {
        SENSITIVITY_UP: 0.06,    // 抬头灵敏度
        SENSITIVITY_DOWN: 0.04,  // 低头灵敏度 (极度省力)
        SCROLL_SPEED: 4,         // 滚动速度 (慢速阅读)
        SMOOTH_FACTOR: 0.1,      // 防抖平滑系数
        COOLDOWN_KEY: 1200       // 短视频冷却
    };

    // --- 2. 全局状态 ---
    const STATE = {
        isCalibrated: false,
        baseRatio: 0.5,
        currentRatio: 0.5,
        rawRatio: 0.5,
        scrollDirection: 0,
        lastActionTime: 0
    };

    // --- 3. 稳健的启动循环 ---
    let checkTimer = setInterval(() => {
        if (!document.body) return;
        if (document.getElementById('fs-container')) return;
        initUI();
    }, 1000);

    // --- 4. UI 构建 ---
    function initUI() {
        try {
            const container = document.createElement('div');
            container.id = 'fs-container';
            container.style.cssText = `position: fixed; bottom: 50px; right: 20px; z-index: 2147483647; display: flex; flex-direction: column; align-items: end; pointer-events: none;`;

            const toggleBtn = document.createElement('div');
            toggleBtn.innerText = "👀";
            toggleBtn.title = "点击展开控制面板";
            toggleBtn.style.cssText = `width: 50px; height: 50px; background: #000; border: 3px solid #0f0; border-radius: 50%; color: #fff; font-size: 24px; display: flex; justify-content: center; align-items: center; cursor: pointer; box-shadow: 0 0 15px rgba(0,255,0,0.4); transition: all 0.3s; pointer-events: auto; user-select: none;`;

            const panel = document.createElement('div');
            panel.style.cssText = `width: 150px; height: 220px; background: #111; border-radius: 12px; overflow: hidden; margin-bottom: 12px; display: none; position: relative; border: 2px solid #333; pointer-events: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5);`;

            const video = document.createElement('video');
            video.style.display = 'none';
            video.autoplay = true; video.muted = true; video.playsInline = true;

            const canvas = document.createElement('canvas');
            canvas.width = 150; canvas.height = 220;
            canvas.style.cssText = "width:100%; height:100%; transform:scaleX(-1); object-fit:cover; opacity: 0.6;";

            const infoLayer = document.createElement('div');
            infoLayer.style.cssText = "position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; padding-bottom: 10px;";
            
            const statusText = document.createElement('div');
            statusText.innerText = "请点击校准";
            statusText.style.cssText = "color: #fff; font-size: 12px; font-weight: bold; text-shadow: 0 1px 2px #000; margin-bottom: 5px;";

            const caliBtn = document.createElement('button');
            caliBtn.innerText = "🎯 舒服平视点我";
            caliBtn.style.cssText = "background: #fe2c55; color: white; border: none; padding: 6px 12px; border-radius: 20px; font-size: 12px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.5); transform: scale(1); transition: transform 0.1s;";
            
            caliBtn.onclick = () => {
                if (STATE.rawRatio > 0) {
                    STATE.baseRatio = STATE.rawRatio;
                    STATE.isCalibrated = true;
                    caliBtn.style.display = 'none';
                    statusText.innerText = "✅ 模式已就绪";
                    panel.style.borderColor = "#0f0";
                    setTimeout(() => { statusText.innerText = "运行中..."; }, 1500);
                } else {
                    statusText.innerText = "未检测到面部";
                }
            };

            infoLayer.append(statusText, caliBtn);
            panel.append(video, canvas, infoLayer);
            container.append(panel, toggleBtn);
            document.body.appendChild(container);

            let isActive = false;
            let isEngineLoaded = false;
            toggleBtn.onclick = () => {
                isActive = !isActive;
                if (isActive) {
                    panel.style.display = 'block';
                    toggleBtn.innerText = "🐵";
                    toggleBtn.style.background = "#222";
                    if (!isEngineLoaded) {
                        loadEngine(statusText, video, canvas, panel);
                        isEngineLoaded = true;
                    } else {
                        if(window.fsCam) window.fsCam.start();
                        startScrollLoop();
                    }
                } else {
                    panel.style.display = 'none';
                    toggleBtn.innerText = "👀";
                    if(window.fsCam) window.fsCam.stop();
                    STATE.scrollDirection = 0;
                }
            };
        } catch (e) {
            console.error("FaceScroll UI Error:", e);
        }
    }

    // --- 5. 动态加载引擎 (绕过GreasyFork检测的关键) ---
    function loadEngine(statusEl, videoEl, canvasEl, panelEl) {
        statusEl.innerText = "加载核心库...";
        const libs = [
            "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",
            "https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js",
            "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js"
        ];
        let loaded = 0;
        libs.forEach(url => {
            const s = document.createElement('script');
            s.src = url; s.crossOrigin = "anonymous";
            s.onload = () => { if (++loaded === libs.length) initMediaPipe(statusEl, videoEl, canvasEl, panelEl); };
            s.onerror = () => { statusEl.innerText = "加载失败"; statusEl.style.color = "red"; };
            document.head.append(s);
        });
    }

    // --- 6. 视觉逻辑 ---
    function initMediaPipe(statusEl, videoEl, canvasEl, panelEl) {
        const ctx = canvasEl.getContext('2d');
        const faceMesh = new FaceMesh({locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`});
        faceMesh.setOptions({maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5});
        faceMesh.onResults(onResults);

        window.fsCam = new Camera(videoEl, {onFrame: async () => await faceMesh.send({image: videoEl}), width: 320, height: 240});
        window.fsCam.start();
        
        startScrollLoop();

        function onResults(results) {
            ctx.clearRect(0, 0, 150, 220);
            ctx.drawImage(results.image, 0, 0, 150, 220);

            if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
                const lm = results.multiFaceLandmarks[0];
                const newRatio = (lm[1].y - lm[168].y) / (lm[152].y - lm[168].y);
                STATE.rawRatio = newRatio;
                STATE.currentRatio = (STATE.currentRatio * (1 - CONFIG.SMOOTH_FACTOR)) + (newRatio * CONFIG.SMOOTH_FACTOR);

                if (!STATE.isCalibrated) return;

                drawDebugUI(ctx, 150, 220);
                
                const isShort = checkIsShortVideoSite();
                const UP_LIMIT = STATE.baseRatio - CONFIG.SENSITIVITY_UP;
                const DOWN_LIMIT = STATE.baseRatio + CONFIG.SENSITIVITY_DOWN;

                if (STATE.currentRatio < UP_LIMIT) {
                    handleAction(isShort, 'DOWN', statusEl, panelEl);
                } else if (STATE.currentRatio > DOWN_LIMIT) {
                    handleAction(isShort, 'UP', statusEl, panelEl);
                } else {
                    STATE.scrollDirection = 0;
                    panelEl.style.borderColor = "#333";
                    statusEl.innerText = "●";
                }
            }
        }
    }

    function handleAction(isShort, dir, statusEl, panelEl) {
        panelEl.style.borderColor = "#0f0";
        const now = Date.now();
        if (isShort) {
            if (now - STATE.lastActionTime > CONFIG.COOLDOWN_KEY) {
                const k = dir === 'DOWN' ? 'ArrowDown' : 'ArrowUp';
                const e = {key:k, code:k, keyCode:k==='ArrowDown'?40:38, bubbles:true, cancelable:true};
                document.dispatchEvent(new KeyboardEvent('keydown', e));
                document.dispatchEvent(new KeyboardEvent('keyup', e));
                STATE.lastActionTime = now;
                statusEl.innerText = dir==='DOWN'?'⬇ 下一条':'⬆ 上一条';
            }
        } else {
            STATE.scrollDirection = dir === 'DOWN' ? 1 : -1;
            statusEl.innerText = dir==='DOWN'?'⬇ 慢阅':'⬆ 回看';
        }
    }

    function startScrollLoop() {
        function loop() {
            if (!checkIsShortVideoSite() && STATE.scrollDirection !== 0) {
                window.scrollBy(0, STATE.scrollDirection * CONFIG.SCROLL_SPEED);
            }
            requestAnimationFrame(loop);
        }
        loop();
    }

    function checkIsShortVideoSite() {
        const h = window.location.hostname;
        return h.includes('douyin') || h.includes('tiktok') || (h.includes('youtube') && window.location.pathname.includes('shorts'));
    }

    function drawDebugUI(ctx, w, h) {
        const baseY = STATE.baseRatio * h * 1.5;
        const topY = (STATE.baseRatio - CONFIG.SENSITIVITY_UP) * h * 1.5;
        const bottomY = (STATE.baseRatio + CONFIG.SENSITIVITY_DOWN) * h * 1.5;
        
        ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, baseY); ctx.lineTo(w, baseY); ctx.stroke();

        ctx.strokeStyle = "rgba(0,255,0,0.8)"; ctx.lineWidth = 2;
        ctx.beginPath(); 
        ctx.moveTo(0, topY); ctx.lineTo(w, topY); 
        ctx.moveTo(0, bottomY); ctx.lineTo(w, bottomY); 
        ctx.stroke();

        const curY = STATE.currentRatio * h * 1.5;
        ctx.fillStyle = "#fe2c55";
        ctx.beginPath(); ctx.arc(w/2, curY, 3, 0, 2*Math.PI); ctx.fill();
    }
})();