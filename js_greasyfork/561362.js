// ==UserScript==
// @name         FaceScroll - 头部控制网页滚动 (CN畅通版)
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  解放双手！头部控制滚动。支持随时重置校准，已集成 zzko/eleme 双重加速源。仅在网页使用，不会上传数据。
// @author       无敌暴龙兽
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561362/FaceScroll%20-%20%E5%A4%B4%E9%83%A8%E6%8E%A7%E5%88%B6%E7%BD%91%E9%A1%B5%E6%BB%9A%E5%8A%A8%20%28CN%E7%95%85%E9%80%9A%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561362/FaceScroll%20-%20%E5%A4%B4%E9%83%A8%E6%8E%A7%E5%88%B6%E7%BD%91%E9%A1%B5%E6%BB%9A%E5%8A%A8%20%28CN%E7%95%85%E9%80%9A%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 0. 调试日志 ---
    console.log("%c FaceScroll v1.1.3 随时校准版启动 ", "background: #ff0055; color: white; padding: 4px; border-radius: 4px;");

    if (window.top !== window.self) return;

    // --- 1. 配置参数 ---
    const CONFIG = {
        SENSITIVITY_UP: 0.06,
        SENSITIVITY_DOWN: 0.04,
        SCROLL_SPEED: 4,
        SMOOTH_FACTOR: 0.1,
        COOLDOWN_KEY: 1200
    };

    const STATE = { isCalibrated: false, baseRatio: 0.5, currentRatio: 0.5, rawRatio: 0.5, scrollDirection: 0, lastActionTime: 0 };

    let checkTimer = setInterval(() => {
        if (!document.body) return;
        if (document.getElementById('fs-container')) return;
        initUI();
    }, 1000);

    function initUI() {
        try {
            const container = document.createElement('div');
            container.id = 'fs-container';
            container.style.cssText = `position: fixed; bottom: 50px; right: 20px; z-index: 2147483647; display: flex; flex-direction: column; align-items: end; pointer-events: none;`;

            const toggleBtn = document.createElement('div');
            toggleBtn.innerText = "👀";
            toggleBtn.title = "点击展开/重置校准";
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
                    caliBtn.style.display = 'none'; // 校准完隐藏按钮
                    statusText.innerText = "✅ 模式已就绪";
                    panel.style.borderColor = "#0f0";
                    setTimeout(() => { 
                        if(STATE.isCalibrated) statusText.innerText = "运行中..."; 
                    }, 1500);
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
            
            // 🔥🔥🔥 核心修改逻辑 🔥🔥🔥
            toggleBtn.onclick = () => {
                isActive = !isActive;
                if (isActive) {
                    // --- 开启时：强制重置状态 ---
                    STATE.isCalibrated = false;       // 重置为未校准
                    STATE.scrollDirection = 0;        // 停止滚动
                    caliBtn.style.display = 'block';  // 把按钮显示出来
                    statusText.innerText = "请点击校准"; // 提示文字复原
                    panel.style.borderColor = "#333"; // 边框颜色复原
                    
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
                    // --- 关闭时 ---
                    panel.style.display = 'none';
                    toggleBtn.innerText = "👀";
                    if(window.fsCam) window.fsCam.stop();
                    STATE.scrollDirection = 0;
                }
            };
        } catch (e) {
            console.error(e);
        }
    }

    // --- 5. 动态加载 (双源保险) ---
    function loadEngine(statusEl, videoEl, canvasEl, panelEl) {
        const PRIMARY_CDN = "https://jsd.cdn.zzko.cn/npm";
        const BACKUP_CDN = "https://npm.elemecdn.com";
        let currentBase = PRIMARY_CDN; 

        statusEl.innerText = "正在连接加速源...";
        
        const loadScript = (baseUrl) => {
            const libs = [
                `${baseUrl}/@mediapipe/camera_utils/camera_utils.js`,
                `${baseUrl}/@mediapipe/control_utils/control_utils.js`,
                `${baseUrl}/@mediapipe/face_mesh/face_mesh.js`
            ];

            let loaded = 0;
            let hasError = false;

            libs.forEach(url => {
                const s = document.createElement('script');
                s.src = url; s.crossOrigin = "anonymous";
                s.onload = () => { 
                    if (!hasError && ++loaded === libs.length) initMediaPipe(statusEl, videoEl, canvasEl, panelEl, baseUrl); 
                };
                s.onerror = () => {
                    if (!hasError) {
                        hasError = true;
                        if (baseUrl === PRIMARY_CDN) {
                            console.warn("首选源失败，切换到备选源...");
                            statusEl.innerText = "切换备用线路...";
                            loadScript(BACKUP_CDN);
                        } else {
                            statusEl.innerText = "所有线路被拦截";
                            statusEl.style.color = "red";
                        }
                    }
                };
                document.head.append(s);
            });
        };
        loadScript(currentBase);
    }

    // --- 6. 视觉逻辑 ---
    function initMediaPipe(statusEl, videoEl, canvasEl, panelEl, cdnBase) {
        const ctx = canvasEl.getContext('2d');
        const faceMesh = new FaceMesh({
            locateFile: (file) => `${cdnBase}/@mediapipe/face_mesh/${file}`
        });

        faceMesh.setOptions({maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5});
        faceMesh.onResults(onResults);

        window.fsCam = new Camera(videoEl, {onFrame: async () => await faceMesh.send({image: videoEl}), width: 320, height: 240});
        
        window.fsCam.start().then(()=>statusEl.innerText="摄像头就绪").catch(e=>statusEl.innerText="权限拒绝");
        
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

                if (STATE.currentRatio < UP_LIMIT) handleAction(isShort, 'DOWN', statusEl, panelEl);
                else if (STATE.currentRatio > DOWN_LIMIT) handleAction(isShort, 'UP', statusEl, panelEl);
                else {
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