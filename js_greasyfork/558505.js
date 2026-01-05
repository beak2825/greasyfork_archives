// ==UserScript==
// @name         JR GPS Spoofer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  劫持定位
// @author       none
// @match        https://oshi-tabi.voistock.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/558505/JR%20GPS%20Spoofer.user.js
// @updateURL https://update.greasyfork.org/scripts/558505/JR%20GPS%20Spoofer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const win = unsafeWindow;
    const RealGeolocation = win.navigator.geolocation;

    win.__GPS_SPOOF_ACTIVE = false; 
    let startTime = Date.now();

    const CONFIG = {
        start: { lat: 35.681236, lng: 139.767125 }, // 东京
        end:   { lat: 35.507456, lng: 139.617585 }, // 新横滨
        duration: 180, // 秒
    };

    function getFakePosition() {
        const now = Date.now();
        let progress = (now - startTime) / (CONFIG.duration * 1000);
        if (progress > 1) progress = 1;

        const currentLat = CONFIG.start.lat + (CONFIG.end.lat - CONFIG.start.lat) * progress;
        const currentLng = CONFIG.start.lng + (CONFIG.end.lng - CONFIG.start.lng) * progress;
        
        const fakeAccuracy = 16 + Math.random() * 9;

        return {
            coords: {
                latitude: currentLat,
                longitude: currentLng,
                accuracy: fakeAccuracy,
                altitude: null,
                altitudeAccuracy: null,
                heading: 240,
                speed: 75, // ~270km/h
            },
            timestamp: now
        };
    }

    const ProxyGeolocation = {
        getCurrentPosition: function(success, error, options) {
            if (win.__GPS_SPOOF_ACTIVE) {
                console.log("[GPS Proxy] 拦截单次请求 -> 返回伪造数据");
                setTimeout(() => success(getFakePosition()), 100);
            } else {
                return RealGeolocation.getCurrentPosition.apply(RealGeolocation, arguments);
            }
        },

        watchPosition: function(success, error, options) {
            if (win.__GPS_SPOOF_ACTIVE) {
                console.log("[GPS Proxy] 拦截连续监听 -> 启动虚拟列车");
                success(getFakePosition());
                const intervalId = setInterval(() => {
                    success(getFakePosition());
                }, 1000);
                return intervalId; // 返回定时器ID作为 watchId
            } else {
                return RealGeolocation.watchPosition.apply(RealGeolocation, arguments);
            }
        },

        clearWatch: function(id) {
            try {
                clearInterval(id); 
            } catch(e) {}
            return RealGeolocation.clearWatch.apply(RealGeolocation, arguments);
        }
    };

    try {
        Object.defineProperty(win.navigator, 'geolocation', {
            value: ProxyGeolocation,
            configurable: false,
            writable: false
        });
        console.log("%c [GPS Proxy] 注入成功！app.js 将使用代理对象。", "color: green; font-weight: bold;");
    } catch (e) {
        console.error("注入失败，浏览器可能禁止覆盖 navigator", e);
    }

    function createUI() {
        const btn = document.createElement('button');
        btn.id = 'gps-proxy-btn';
        btn.innerHTML = '🛑 GPS 模拟: OFF';
        Object.assign(btn.style, {
            position: 'fixed', bottom: '20px', right: '20px', zIndex: '999999',
            padding: '12px 24px', borderRadius: '8px', border: 'none',
            color: 'white', fontWeight: 'bold', cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)', background: '#c0392b',
            fontSize: '14px'
        });

        btn.onclick = () => {
            win.__GPS_SPOOF_ACTIVE = !win.__GPS_SPOOF_ACTIVE;
            if (win.__GPS_SPOOF_ACTIVE) {
                startTime = Date.now(); // 重置发车时间
                btn.innerHTML = '🚄 GPS 模拟: ON (运行中)';
                btn.style.background = '#27ae60';
                btn.style.boxShadow = '0 0 15px #2ecc71';
                console.log("模拟已开启，虚拟时间重置");
            } else {
                btn.innerHTML = '🛑 GPS 模拟: OFF';
                btn.style.background = '#c0392b';
                btn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
                console.log("模拟已关闭");
            }
        };
        
        document.body.appendChild(btn);
    }

    const checkBody = setInterval(() => {
        if (document.body) {
            createUI();
            clearInterval(checkBody);
        }
    }, 200);

})();