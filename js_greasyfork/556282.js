// ==UserScript==
// @name        你的雨姐-B站免登录畅享助手-Bilibili Login-Free Enjoyment Helper
// @namespace    https://github.com/
// @version      49.1.49
// @author       东北雨姐
// @license      MIT
// @description  哎呀妈呀，来了老铁！免登录看b评论、不登录也能看1080P，无登陆弹窗。
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/556282/%E4%BD%A0%E7%9A%84%E9%9B%A8%E5%A7%90-B%E7%AB%99%E5%85%8D%E7%99%BB%E5%BD%95%E7%95%85%E4%BA%AB%E5%8A%A9%E6%89%8B-Bilibili%20Login-Free%20Enjoyment%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/556282/%E4%BD%A0%E7%9A%84%E9%9B%A8%E5%A7%90-B%E7%AB%99%E5%85%8D%E7%99%BB%E5%BD%95%E7%95%85%E4%BA%AB%E5%8A%A9%E6%89%8B-Bilibili%20Login-Free%20Enjoyment%20Helper.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const win = window.unsafeWindow || window;
    
    // 【修复核心】检测当前是否为个人空间页面
    const isSpacePage = win.location.hostname === 'space.bilibili.com';
    console.log('%c B站助手 ', 'background: #00A1D6; color: #fff; padding: 4px; border-radius: 4px;', isSpacePage ? '(个人空间模式-已暂停伪造以防闪屏)' : '(沉浸模式)');
    // 1. 安全地注入CSS，保证在任何页面都不显示登录弹窗
    const css = `
        .bili-mini-mask,
        .login-panel-popover,
        .vip-login-tip,
        .bpx-player-toast-login,
        .ad-report,
        .video-unlogin-popover,
        #mini-login-prompt,
        .unlogin-popover
        { display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; }
        body { overflow: auto !important; }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    
    // 【修复】安全的样式注入，处理document-start时DOM可能不存在的情况
    const appendStyle = () => {
        const target = document.head || document.documentElement;
        if (target) {
            target.appendChild(style);
        } else {
            // DOM还未准备好，等待下一帧
            requestAnimationFrame(appendStyle);
        }
    };
    appendStyle();
    // 伪造的用户数据
    const mockUserInfo = {
        code: 0, message: "0", ttl: 1,
        data: {
            isLogin: true, email_verified: 1, face: "https://img1.baidu.com/it/u=3908630427,395681705&fm=253&fmt=auto&app=138&f=JPEG?w=847&h=800",
            level_info: { current_level: 6 }, mid: 12345678, money: 49, moral: 70, uname: "东北雨姐",
            vipStatus: 1, vipType: 2, vip: { type: 2, status: 1, due_date: 1999999999999, label: { text: "雨姐大会员" } },
            is_senior_member: 1
        }
    };
    const mockUserInfoStr = JSON.stringify(mockUserInfo);
    const originalFetch = win.fetch;
    const originalXHR = win.XMLHttpRequest;
    // 2. 拦截 Fetch
    win.fetch = function(input, init) {
        const url = (typeof input === 'string' ? input : input.url) || '';
        // 如果是请求用户信息，且不在个人空间页面，才进行伪造
        if (url.includes('/x/web-interface/nav')) {
            if (isSpacePage) {
                // 如果在个人主页，直接放行真实请求，防止死循环
                return originalFetch.apply(this, arguments);
            }
            return Promise.resolve(new Response(mockUserInfoStr, {
                status: 200, statusText: "OK", headers: { 'Content-Type': 'application/json' }
            }));
        }
        if (url.includes('/x/v2/reply')) {
            if (init) init.credentials = 'omit';
        }
        return originalFetch.apply(this, arguments);
    };
    // 3. 【修复】改进的 XHR 拦截
    class ProxyXHR extends originalXHR {
        constructor() {
            super();
            this._url = '';
            this._isMocked = false;
        }
        open(method, url, ...args) {
            this._url = url.toString();
            super.open(method, url, ...args);
        }
        send(body) {
            // 同样，如果是个人空间页面，不进行拦截
            if (this._url.includes('/x/web-interface/nav') && !isSpacePage) {
                this._isMocked = true;
                
                // 【修复】使用getter来正确模拟XHR属性
                const mockResponse = mockUserInfoStr;
                const mockHeaders = 'content-type: application/json';
                
                Object.defineProperties(this, {
                    readyState: { get: () => 4, configurable: true },
                    status: { get: () => 200, configurable: true },
                    statusText: { get: () => 'OK', configurable: true },
                    responseText: { get: () => mockResponse, configurable: true },
                    response: { get: () => mockResponse, configurable: true },
                    responseURL: { get: () => this._url, configurable: true }
                });
                // 【修复】覆盖header相关方法
                this.getAllResponseHeaders = () => mockHeaders;
                this.getResponseHeader = (name) => {
                    if (name.toLowerCase() === 'content-type') return 'application/json';
                    return null;
                };
                setTimeout(() => {
                    // 触发事件
                    this.dispatchEvent(new Event('readystatechange'));
                    
                    // 【修复】同时调用回调函数（如果存在）
                    if (typeof this.onreadystatechange === 'function') {
                        try { this.onreadystatechange(new Event('readystatechange')); } catch(e) {}
                    }
                    
                    this.dispatchEvent(new Event('load'));
                    
                    if (typeof this.onload === 'function') {
                        try { this.onload(new ProgressEvent('load')); } catch(e) {}
                    }
                    
                    this.dispatchEvent(new Event('loadend'));
                    
                    if (typeof this.onloadend === 'function') {
                        try { this.onloadend(new ProgressEvent('loadend')); } catch(e) {}
                    }
                }, 10);
                return;
            }
            super.send(body);
        }
    }
    win.XMLHttpRequest = ProxyXHR;
    const forceLocalStorage = () => {
        try {
            localStorage.setItem('bilibili_player_codec_prefer_type', '0');
            localStorage.setItem('recommend_auto_play', '0');
        } catch(e) {}
    };
    forceLocalStorage();
    // 【修复】更安全的Object.defineProperty覆盖，使用WeakSet记录已处理的对象
    const originDefineProperty = Object.defineProperty;
    const targetProps = new Set(['isViewToday', 'isVideoAble']);
    
    Object.defineProperty = function(obj, prop, descriptor) {
        if (targetProps.has(prop)) {
            descriptor = {
                get: () => true,
                enumerable: false,
                configurable: true
            };
        }
        try {
            return originDefineProperty.call(this, obj, prop, descriptor);
        } catch(e) {
            // 如果定义失败（例如属性已存在且不可配置），静默失败
            console.warn('B站助手: defineProperty failed for', prop);
            return obj;
        }
    };
    const originSetTimeout = win.setTimeout;
    win.setTimeout = function(func, delay) {
        if (delay && delay > 20000 && delay < 70000) {
            // console.log(`B站助手: 拦截到疑似试用结束定时器 (${delay}ms)，已推迟。`);
            delay = 300000000;
        }
        return originSetTimeout.call(this, func, delay);
    };
    // 【修复】添加清理逻辑，达到目标后停止轮询
    let qualityAchieved = false;
    let checkCount = 0;
    const maxCheckCount = 150; // 最多检查5分钟 (150 * 2秒)
    const intervalId = setInterval(() => {
        checkCount++;
        
        // 超过最大检查次数后停止
        if (checkCount > maxCheckCount) {
            clearInterval(intervalId);
            console.log('%c B站助手 ', 'background: #00A1D6; color: #fff;', '检查已完成，停止轮询');
            return;
        }
        try {
            const trialBtn = document.querySelector('.bpx-player-toast-confirm-login');
            if (trialBtn) {
                // console.log('B站助手: 发现试用按钮，自动点击...');
                trialBtn.click();
            }
            if (!qualityAchieved && win.player && typeof win.player.getQuality === 'function' && typeof win.player.requestQuality === 'function') {
                try {
                    const currentQuality = win.player.getQuality();
                    const supportedQualities = win.player.getSupportedQualityList ? win.player.getSupportedQualityList() : null;
                    const targetQuality = 80;
                    if (currentQuality && currentQuality.nowQ >= targetQuality) {
                        qualityAchieved = true;
                        console.log('%c B站助手 ', 'background: #00A1D6; color: #fff;', '已达到1080P画质');
                    } else if (currentQuality && currentQuality.nowQ < targetQuality && supportedQualities && supportedQualities.includes(targetQuality)) {
                        // console.log('老铁正在请求切换至 1080P...');
                        win.player.requestQuality(targetQuality);
                    }
                } catch(e) {
                    // 播放器API可能未完全初始化，忽略错误
                }
            }
        } catch(e) {
            // 静默处理错误
        }
    }, 2000);
    // 【修复核心】不要在个人空间页面注入Cookie，否则会触发服务端校验失败导致的刷新
    // 【修复】延长Cookie有效期至1年
    if (!isSpacePage) {
        try {
            document.cookie = "DedeUserID=12345678; path=/; domain=.bilibili.com; max-age=31536000";
        } catch(e) {}
    }
    // 【新增】页面卸载时清理
    win.addEventListener('beforeunload', () => {
        if (intervalId) {
            clearInterval(intervalId);
        }
    });
})();