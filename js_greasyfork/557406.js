// ==UserScript==
// @name         安徽专业技术人员继续教育在线刷课秒完成 - 蔡较瘦版
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  解除倍速限制，支持动态调整，增加“瞬间完成”测试功能。
// @author       Youyang Studios
// @license      MIT
// @match        *://www.zjzx.ah.cn/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557406/%E5%AE%89%E5%BE%BD%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%E5%88%B7%E8%AF%BE%E7%A7%92%E5%AE%8C%E6%88%90%20-%20%E8%94%A1%E8%BE%83%E7%98%A6%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/557406/%E5%AE%89%E5%BE%BD%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%E5%88%B7%E8%AF%BE%E7%A7%92%E5%AE%8C%E6%88%90%20-%20%E8%94%A1%E8%BE%83%E7%98%A6%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function injectedScript() {
        console.log("%c 🚀 安徽专技在线加速插件(V4.4 瞬移版) 已挂载 ", "background: #e60012; color: white; font-size: 14px; padding: 4px; border-radius: 4px;");

        // --- 全局状态变量 ---
        let currentSpeed = 1.0;     // 当前设定的速度
        let isEngineActive = false; // 是否开启了加速引擎

        // --- 1. 覆写心跳检测 (防掉线) ---
        const originalKeepAlive = window.requestKeepAlive;
        if (typeof originalKeepAlive === 'function' || window.location.href.indexOf('keepAlive') > -1 || document.querySelector('script[src*="smart.js"]')) {
            window.requestKeepAlive = function() {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', '/keepAlive.html', true);
                xhr.withCredentials = true;
                xhr.setRequestHeader('Accept', '*/*');
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        setTimeout(window.requestKeepAlive, 30000);
                    }
                };
                xhr.send();
            };
        }

        // --- 2. 拦截弹窗 ---
        window.alert = function(msg) { console.log("🛡️ 拦截Alert:", msg); return true; };
        window.confirm = function(msg) { console.log("🛡️ 拦截Confirm:", msg); return true; };
        window.prompt = function(msg) { console.log("🛡️ 拦截Prompt:", msg); return null; };

        // --- 3. 核心加速引擎 ---
        setInterval(() => {
            // 每次循环都获取当前的 video
            const video = document.querySelector('video');
            if (!video) return;

            // 防休眠音频
            try {
                if(!window.audioCtxFake) {
                    window.audioCtxFake = new (window.AudioContext || window.webkitAudioContext)();
                    let osc = window.audioCtxFake.createOscillator();
                    let gain = window.audioCtxFake.createGain();
                    gain.gain.value = 0.0001;
                    osc.connect(gain);
                    gain.connect(window.audioCtxFake.destination);
                    osc.start();
                }
            } catch(e) {}

            // 初始化劫持
            if (!video._isHijacked) {
                console.log("🔧 检测到新视频，正在注入加速钩子...");
                const nativeSetter = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'playbackRate').set;
                Object.defineProperty(video, 'playbackRate', {
                    get: function() { return 1.0; },
                    set: function(val) {
                        if (val === 0) nativeSetter.call(video, 0);
                        else nativeSetter.call(video, currentSpeed);
                    }
                });
                video.addEventListener('ratechange', function(event) {
                    event.stopImmediatePropagation();
                    event.stopPropagation();
                }, true);
                video._isHijacked = true;
                video.muted = true;
            }

            // 只有当引擎激活时，才强制锁定速度
            if (isEngineActive) {
                const nativeSetter = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'playbackRate').set;

                // 智能收尾：最后2秒降回1倍速
                if (video.duration && video.currentTime > video.duration - 2) {
                    if (Math.abs(video.playbackRate - 1.0) > 0.1) {
                        nativeSetter.call(video, 1.0);
                        console.log("🏁 收尾中(1.0x) - 等待网页自动切换...");
                        updateStatus("收尾中...等待结算");
                    }
                }
                // 正常加速
                else if (!video.paused && Math.abs(video.playbackRate - currentSpeed) > 0.1) {
                    nativeSetter.call(video, currentSpeed);
                    if (!video.muted) video.muted = true;
                }
            }

        }, 500);

        // --- 4. 启动函数 ---
        function activateSpeed(targetSpeed) {
            currentSpeed = parseFloat(targetSpeed);
            isEngineActive = true;
            console.log(`🚀 加速指令已下达: ${currentSpeed}x`);
            updateStatus(`运行中: ${currentSpeed}x`);
        }

        // --- [新增] 瞬移功能函数 ---
        function instantFinish() {
            const video = document.querySelector('video');
            if (!video) {
                alert("未检测到视频元素！");
                return;
            }
            if (isNaN(video.duration)) {
                alert("视频数据尚未加载，请稍等...");
                return;
            }

            console.log("⚡ 正在尝试绕过检测并瞬移...");
            
            // 1. 临时解锁原生控件，防止无法seek
            video.controls = true;
            
            // 2. 将速度重置为1.0，模拟正常结束前的状态，减少被检测概率
            currentSpeed = 1.0; 
            const nativeSetter = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'playbackRate').set;
            nativeSetter.call(video, 1.0);

            // 3. 执行瞬移：跳到总时长 - 5秒
            video.currentTime = video.duration - 5;
            
            // 4. 确保视频处于播放状态
            video.play();
            
            updateStatus("⚡ 已瞬移至末尾 (慎用)");
        }

        // --- 5. GUI 界面构建 ---
        function createGUI() {
            if (document.getElementById('nuclear-speed-panel')) return;

            const div = document.createElement('div');
            div.id = 'nuclear-speed-panel';
            div.style.cssText = `
                position: fixed; top: 60px; left: 20px; z-index: 999999;
                background: rgba(0, 0, 0, 0.85); color: #fff; padding: 12px;
                border-radius: 8px; font-family: sans-serif; font-size: 12px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.5); min-width: 140px;
                text-align: center; border: 1px solid #555;
            `;

            div.innerHTML = `
                <div style="margin-bottom:8px; font-weight:bold; color:#ff4757; font-size:13px;">🚀 启明启动 (测试版)</div>
                <div id="nuclear-status" style="color:#2ed573; margin-bottom:8px;">等待启动...</div>

                <div style="display:flex; justify-content:center; align-items:center; margin-bottom:8px;">
                    <input type="number" id="nuclear-input" value="6" style="width:40px; padding:4px; text-align:center; border-radius:4px; border:none; margin-right:5px;">
                    <button id="nuclear-btn" style="cursor:pointer; background:#3742fa; color:white; border:none; padding:4px 10px; border-radius:4px; font-weight:bold;">启动</button>
                </div>

                <div style="margin-top:5px; border-top:1px solid #555; padding-top:5px; display:flex; justify-content:space-around;">
                    <button id="nuclear-btn-4" style="background:#555; color:white; border:none; padding:3px 6px; border-radius:3px; cursor:pointer;">4x</button>
                    <button id="nuclear-btn-8" style="background:#555; color:white; border:none; padding:3px 6px; border-radius:3px; cursor:pointer;">8x</button>
                    <button id="nuclear-btn-16" style="background:#555; color:white; border:none; padding:3px 6px; border-radius:3px; cursor:pointer;">16x</button>
                </div>

                <!-- 新增：危险操作区 -->
                <div style="margin-top:8px; border-top:1px solid #555; padding-top:5px;">
                    <button id="nuclear-btn-jump" style="width:100%; background:#c0392b; color:white; border:none; padding:5px; border-radius:3px; cursor:pointer; font-weight:bold;">⚡ 瞬移至结尾 (慎用)</button>
                </div>
            `;

            document.body.appendChild(div);

            // 绑定事件
            document.getElementById('nuclear-btn').onclick = () => activateSpeed(document.getElementById('nuclear-input').value);
            document.getElementById('nuclear-btn-4').onclick = () => { document.getElementById('nuclear-input').value = 4; activateSpeed(4); };
            document.getElementById('nuclear-btn-8').onclick = () => { document.getElementById('nuclear-input').value = 8; activateSpeed(8); };
            document.getElementById('nuclear-btn-16').onclick = () => { document.getElementById('nuclear-input').value = 16; activateSpeed(16); };
            
            // 绑定瞬移事件
            document.getElementById('nuclear-btn-jump').onclick = instantFinish;
        }

        function updateStatus(text) {
            const el = document.getElementById('nuclear-status');
            if (el) el.innerText = text;
        }

        const initTimer = setInterval(() => {
            if (document.body) {
                createGUI();
                clearInterval(initTimer);
            }
        }, 1000);
    }

    const script = document.createElement('script');
    script.textContent = '(' + injectedScript.toString() + ')();';
    (document.head || document.documentElement).appendChild(script);

})();