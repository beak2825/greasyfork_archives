// ==UserScript==
// @name         Ave Mujica / 推し旅 GPS Spoofer (V6.1 修正版)
// @namespace    http://tampermonkey.net/
// @version      6.1
// @description  Ave Mujica 活动专用。修复语法错误。包含：多路线+随机起终点+非匀速移动(模拟加减速)+GPS信号抖动。
// @author       Gemini
// @match        https://orange-system.jr-central.co.jp/*
// @match        https://dev-orange-system.jr-central.co.jp/*
// @match        https://oshi-tabi.voistock.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/558858/Ave%20Mujica%20%20%E6%8E%A8%E3%81%97%E6%97%85%20GPS%20Spoofer%20%28V61%20%E4%BF%AE%E6%AD%A3%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558858/Ave%20Mujica%20%20%E6%8E%A8%E3%81%97%E6%97%85%20GPS%20Spoofer%20%28V61%20%E4%BF%AE%E6%AD%A3%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const win = unsafeWindow;
    const RealGeolocation = win.navigator.geolocation;

    // ================= 全局状态 =================
    win.__GPS_SPOOF_ACTIVE = false;
    
    // 运动状态机
    let state = {
        running: false,
        startTime: 0,
        lastUpdateTime: 0,
        currentProgress: 0, // 0.0 ~ 1.0
        currentRoute: null,
        currentSpeed: 75,   // m/s
    };

    // ================= 基础路线库 =================
    const BASE_ROUTES = [
        { name: "东京 ➜ 新横滨", start: { lat: 35.681236, lng: 139.767125 }, end: { lat: 35.507456, lng: 139.617585 } },
        { name: "静冈 ➜ 挂川",   start: { lat: 34.971710, lng: 138.388840 }, end: { lat: 34.769758, lng: 138.014928 } },
        { name: "名古屋 ➜ 岐阜", start: { lat: 35.170915, lng: 136.881537 }, end: { lat: 35.315705, lng: 136.685593 } },
        { name: "京都 ➜ 新大阪", start: { lat: 34.985849, lng: 135.758767 }, end: { lat: 34.733480, lng: 135.500109 } },
        { name: "丰桥 ➜ 三河安城", start: { lat: 34.762956, lng: 137.381653 }, end: { lat: 34.968972, lng: 137.060737 } }
    ];

    // ================= 辅助工具 =================
    function randomizeCoord(coord) {
        // 起终点随机偏移 (±300m)
        const jitter = 0.003; 
        return {
            lat: coord.lat + (Math.random() - 0.5) * jitter,
            lng: coord.lng + (Math.random() - 0.5) * jitter
        };
    }

    function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
        const R = 6371; 
        const dLat = (lat2-lat1) * (Math.PI/180); 
        const dLon = (lon2-lon1) * (Math.PI/180); 
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
        // 修复点：确保这里括号闭合正确
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    }

    function initNewRun() {
        const base = BASE_ROUTES[Math.floor(Math.random() * BASE_ROUTES.length)];
        const route = {
            name: base.name,
            start: randomizeCoord(base.start),
            end: randomizeCoord(base.end)
        };
        // 计算总距离(米)
        route.totalDistMeters = getDistanceFromLatLonInKm(route.start.lat, route.start.lng, route.end.lat, route.end.lng) * 1000;
        
        state = {
            running: true,
            startTime: Date.now(),
            lastUpdateTime: Date.now(),
            currentProgress: 0,
            currentRoute: route,
            currentSpeed: 60 + Math.random() * 20, // 初始速度
        };
        return state;
    }

    // ================= 核心：物理引擎 =================
    function getFakePosition() {
        if (!state.running || !state.currentRoute) return null;

        const now = Date.now();
        // 计算距离上次更新过去了多久 (秒)
        let deltaTime = (now - state.lastUpdateTime) / 1000;
        if (deltaTime > 5) deltaTime = 5; 
        if (deltaTime < 0) deltaTime = 0;

        // 1. 动态速度模拟 (Speed Breathing)
        // 使用正弦波模拟自然的加速减速循环
        const timeFactor = (now - state.startTime) / 1000;
        const targetSpeed = 75 + Math.sin(timeFactor / 3) * 15;
        
        // 平滑插值
        state.currentSpeed += (targetSpeed - state.currentSpeed) * 0.1;

        // 2. 计算这一帧移动的距离
        const stepDist = state.currentSpeed * deltaTime;
        
        // 3. 更新进度
        const stepProgress = stepDist / state.currentRoute.totalDistMeters;
        state.currentProgress += stepProgress;
        if (state.currentProgress > 1) state.currentProgress = 1;

        state.lastUpdateTime = now;

        // 4. 计算理想直线坐标
        let lat = state.currentRoute.start.lat + (state.currentRoute.end.lat - state.currentRoute.start.lat) * state.currentProgress;
        let lng = state.currentRoute.start.lng + (state.currentRoute.end.lng - state.currentRoute.start.lng) * state.currentProgress;

        // 5. 添加 GPS 噪点 (Lateral Noise)
        const noiseAmt = 0.00005; 
        lat += (Math.random() - 0.5) * noiseAmt;
        lng += (Math.random() - 0.5) * noiseAmt;

        // 6. 构造返回对象
        const fakeAccuracy = 15 + Math.abs(Math.sin(now/1000)) * 15;
        
        return {
            coords: {
                latitude: lat,
                longitude: lng,
                accuracy: fakeAccuracy,
                altitude: 50 + Math.random(),
                altitudeAccuracy: 10,
                heading: 240 + (Math.random()-0.5)*5,
                speed: state.currentSpeed,
            },
            timestamp: now
        };
    }

    // ================= 核心：中间人代理 =================
    const ProxyGeolocation = {
        getCurrentPosition: function(success, error, options) {
            if (win.__GPS_SPOOF_ACTIVE) {
                setTimeout(() => success(getFakePosition()), 100 + Math.random() * 200);
            } else {
                return RealGeolocation.getCurrentPosition.apply(RealGeolocation, arguments);
            }
        },
        watchPosition: function(success, error, options) {
            if (win.__GPS_SPOOF_ACTIVE) {
                success(getFakePosition());
                const intervalId = setInterval(() => {
                    success(getFakePosition());
                }, 1000);
                return intervalId;
            } else {
                return RealGeolocation.watchPosition.apply(RealGeolocation, arguments);
            }
        },
        clearWatch: function(id) {
            try { clearInterval(id); } catch(e) {}
            return RealGeolocation.clearWatch.apply(RealGeolocation, arguments);
        }
    };

    // ================= 注入劫持 =================
    try {
        Object.defineProperty(win.navigator, 'geolocation', {
            value: ProxyGeolocation,
            configurable: false,
            writable: false
        });
    } catch (e) { console.error(e); }

    // ================= UI 界面 =================
    function createUI() {
        const btn = document.createElement('button');
        btn.innerHTML = '🔴 GPS 模拟: OFF';
        Object.assign(btn.style, {
            position: 'fixed', bottom: '15%', right: '10px', zIndex: '9999999',
            padding: '10px 15px', borderRadius: '50px', border: 'none',
            color: 'white', fontWeight: 'bold', cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.4)', background: '#444',
            fontSize: '12px', textAlign: 'center', opacity: '0.9',
            fontFamily: 'monospace'
        });

        // 实时更新按钮上的速度显示
        setInterval(() => {
            if (win.__GPS_SPOOF_ACTIVE && state.running && state.currentRoute) {
                const speedKmh = (state.currentSpeed * 3.6).toFixed(0);
                // 修复点：使用简单的字符串拼接防止模板字符串出错
                btn.innerHTML = '🚄 <b>' + speedKmh + ' km/h</b><br><span style="font-size:10px">' + state.currentRoute.name + '</span>';
                
                const glow = 10 + Math.random() * 10;
                btn.style.boxShadow = '0 0 ' + glow + 'px #e91e63';
            }
        }, 500);

        btn.onclick = () => {
            win.__GPS_SPOOF_ACTIVE = !win.__GPS_SPOOF_ACTIVE;
            if (win.__GPS_SPOOF_ACTIVE) {
                initNewRun();
                btn.style.background = '#e91e63'; 
                console.log('[GPS] 模拟启动: ' + state.currentRoute.name);
            } else {
                state.running = false;
                btn.innerHTML = '🔴 GPS 模拟: OFF';
                btn.style.background = '#444';
                btn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.4)';
            }
        };

        document.body.appendChild(btn);
    }

    const checkBody = setInterval(() => {
        if (document.body) { createUI(); clearInterval(checkBody); }
    }, 200);

})(); 
// END OF SCRIPT - 确保复制到这里
