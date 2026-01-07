// ==UserScript==
// @name         华中农业大学体育场馆自动预约
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  自动预约华农体育场馆
// @author       zskfree
// @match        https://zhcg.hzau.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hzau.edu.cn
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      qyapi.weixin.qq.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561678/%E5%8D%8E%E4%B8%AD%E5%86%9C%E4%B8%9A%E5%A4%A7%E5%AD%A6%E4%BD%93%E8%82%B2%E5%9C%BA%E9%A6%86%E8%87%AA%E5%8A%A8%E9%A2%84%E7%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/561678/%E5%8D%8E%E4%B8%AD%E5%86%9C%E4%B8%9A%E5%A4%A7%E5%AD%A6%E4%BD%93%E8%82%B2%E5%9C%BA%E9%A6%86%E8%87%AA%E5%8A%A8%E9%A2%84%E7%BA%A6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ================= 常量配置 =================
    const APP_ID = "1497016617475903488";
    const SECRET_KEY = "57325972627c40bd8c77296d39293705";
    const BASE_URL = "https://zhcg.hzau.edu.cn";

    // 场馆配置
    const VENUE_CONFIG = {
        pingpong: {
            name: "乒乓球",
            sceneUuid: "6c34a7fb0d9047b3a41a59b6400435b2",
            devKindUuid: "be367c54bb804653a74870c5cfa34dbc",
            classTypeUuid: "b6b6e26e241044969c9a03111800db41"
        },
        badminton: {
            name: "羽毛球",
            sceneUuid: "492f6b87ffda42879b152d31e9581c78",
            devKindUuid: "be367c54bb804653a74870c5cfa34dbc",
            classTypeUuid: "1dfbda10a25c4930a967880877d31705"
        },
        // 室内网球馆
        tennis_indoor: {
            name: "室内网球馆",
            sceneUuid: "58e95c0ebd17458aa399fb5450bc28c4",
            devKindUuid: "be367c54bb804653a74870c5cfa34dbc",
            classTypeUuid: "39b99ec8a99247f2b75b9ad6786663a1"
        },
        // 室外网球场
        tennis_outdoor: {
            name: "室外网球场",
            sceneUuid: "0fdf1891c72e4b89b21b4d1fd17a7e0b",
            devKindUuid: "be367c54bb804653a74870c5cfa34dbc",
            classTypeUuid: "c6f735560a5c43969fae101ddfcd5464"
        }
    };

    // 固定的表单参数
    const FORM_PARAM = {
        formId: "e9a36ebac3c249879b2bc3a168128fd9",
        deployUuid: "74befd44889d4885b4bbb3ad986e6bb3",
        variables: {},
        chooseCandidates: {}
    };

    // 时段选项 (08:00 - 22:00)
    const TIME_SLOTS = [];
    for (let h = 8; h < 22; h++) {
        const start = `${h.toString().padStart(2, '0')}:00`;
        const end = `${(h + 1).toString().padStart(2, '0')}:00`;
        TIME_SLOTS.push({ start, end, label: `${start} - ${end}` });
    }

    // ================= 状态变量 =================
    let isRunning = false;
    let isBookingInProgress = false; // 防止并发
    let pollingTimer = null;
    let countdownTimer = null;
    let userId = null;
    let userName = null;
    let userOrgName = null;
    let siteCache = [];
    let successfulSlots = []; // 已成功预约的时段
    let bookingSessionId = 0; // 用于标识当前预约会话

    // ================= 优化新增变量 =================
    let targetSiteCache = []; // 预加载的目标场地缓存（盲打用）
    let preloadedTimeSlots = []; // 预加载时选择的时段
    let serverTimeOffset = 0; // 服务器时间偏移量(ms)
    let cachedToken = null; // Token缓存
    let lastLogTime = 0; // 上次日志时间，用于节流

    // 计时基准：默认使用本机时间（避免“看起来提前”）；可切换为服务器校准时间
    let scheduleUseServerTime = false;

    // ================= 企业微信推送（与 SZU 一致） =================
    const WeChatNotifier = {
        url: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=4a1965fb-7559-4229-95ab-cc5a34066b6b',
        enabled: true,

        async sendSuccess(info) {
            if (!this.enabled || typeof GM_xmlhttpRequest === 'undefined') return false;

            const message = `🎉 华农体育场馆预约成功！\n\n` +
                `👤 姓名: ${info.userName || 'Unknown'}\n` +
                `🏫 学院: ${info.userOrgName || 'Unknown'}\n` +
                `🆔 用户ID: ${info.userId || 'Unknown'}\n` +
                `📅 ${info.date} | 🏟️ ${info.venueName || ''}\n` +
                `📍 ${info.siteName || ''}\n` +
                `⏰ ${info.timeSlotsText || ''}`;

            return new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: this.url,
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify({ msgtype: 'text', text: { content: message } }),
                    timeout: 10000,
                    onload: (res) => resolve(res.status === 200),
                    onerror: () => resolve(false),
                    ontimeout: () => resolve(false)
                });
            });
        }
    };

    // ================= 配置管理 =================

    // 保存用户配置
    function saveUserConfig() {
        const config = {
            venueType: document.getElementById('hzau-venue').value,
            date: document.getElementById('hzau-date').value,
            interval: document.getElementById('hzau-interval').value,
            startTime: document.getElementById('hzau-start-time').value,
            scheduleUseServerTime: !!document.getElementById('hzau-use-server-time')?.checked,
            selectedTimeSlots: [],
            selectedSites: []
        };

        document.querySelectorAll('.hzau-time-btn.selected').forEach(btn => {
            config.selectedTimeSlots.push({
                start: btn.dataset.start,
                end: btn.dataset.end
            });
        });

        document.querySelectorAll('.hzau-site-btn.selected').forEach(btn => {
            config.selectedSites.push(parseInt(btn.dataset.index));
        });

        GM_setValue('hzau_booking_config', config);
        console.log('[配置] 已保存:', config);
    }

    // 恢复用户配置
    function loadUserConfig() {
        const config = GM_getValue('hzau_booking_config', null);
        if (!config) {
            console.log('[配置] 无保存的配置');
            return;
        }

        console.log('[配置] 正在恢复:', config);

        if (config.venueType) {
            document.getElementById('hzau-venue').value = config.venueType;
        }

        if (config.date) {
            const savedDate = new Date(config.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (savedDate >= today) {
                document.getElementById('hzau-date').value = config.date;
            }
        }

        if (config.interval) {
            document.getElementById('hzau-interval').value = config.interval;
        }

        if (config.startTime) {
            document.getElementById('hzau-start-time').value = config.startTime;
        }

        if (typeof config.scheduleUseServerTime === 'boolean') {
            scheduleUseServerTime = config.scheduleUseServerTime;
            const checkbox = document.getElementById('hzau-use-server-time');
            if (checkbox) checkbox.checked = scheduleUseServerTime;
        }

        if (config.selectedTimeSlots && config.selectedTimeSlots.length > 0) {
            setTimeout(() => {
                config.selectedTimeSlots.forEach(slot => {
                    const btn = document.querySelector(`.hzau-time-btn[data-start="${slot.start}"]`);
                    if (btn) {
                        btn.classList.add('selected');
                    }
                });
                updateTimeSlotCounter();
                addStatus(`已恢复 ${config.selectedTimeSlots.length} 个时段选择`, 'info');
            }, 100);
        }

        if (config.selectedSites && config.selectedSites.length > 0) {
            setTimeout(async () => {
                await refreshSiteList();
                setTimeout(() => {
                    config.selectedSites.forEach(index => {
                        const btn = document.querySelector(`.hzau-site-btn[data-index="${index}"]`);
                        if (btn) {
                            btn.classList.add('selected');
                        }
                    });
                    if (config.selectedSites.length > 0) {
                        addStatus(`已恢复 ${config.selectedSites.length} 个场地选择`, 'info');
                    }
                }, 200);
            }, 200);
        }

        addStatus('✅ 已恢复上次配置', 'success');
    }

    // ================= 工具函数 =================

    function getSignedParams() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let nonce = '';
        for (let i = 0; i < 32; i++) {
            nonce += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const timeStamp = Date.now().toString();
        const rawStr = `appId=${APP_ID}&nonce=${nonce}&timeStamp=${timeStamp}&key=${SECRET_KEY}`;
        const sign = md5(rawStr);
        return `appId=${APP_ID}&timeStamp=${timeStamp}&nonce=${nonce}&sign=${sign}`;
    }

    function getToken() {
        // 优先使用缓存的Token
        if (cachedToken) {
            return cachedToken;
        }
        let token = localStorage.getItem('token') || localStorage.getItem('unifoundToken');
        if (token) {
            token = token.replace(/^["']|["']$/g, '').trim();
            cachedToken = token; // 缓存Token
        }
        return token;
    }

    // 刷新Token缓存（用于401错误后重新获取）
    function refreshTokenCache() {
        cachedToken = null;
        return getToken();
    }

    // 验证Token是否有效
    async function validateToken() {
        try {
            const token = getToken();
            if (!token) {
                addStatus('⚠️ Token不存在，请先登录', 'error');
                return false;
            }

            // 尝试获取用户信息来验证Token
            const url = `${BASE_URL}/site/system/login/getLoginUser`;
            const result = await apiRequest(url, 'GET', null, 0); // 不重试

            if (result.success && result.data) {
                addStatus('✅ Token验证有效', 'success');
                return true;
            } else {
                addStatus('⚠️ Token已失效', 'warning');
                return false;
            }
        } catch (e) {
            if (e.message.includes('Token已过期') || e.message.includes('401')) {
                addStatus('⚠️ Token已过期', 'warning');
                return false;
            }
            // 网络错误等其他情况，假定Token有效
            addStatus(`验证请求异常: ${e.message}`, 'warning');
            return true;
        }
    }

    // 自动刷新页面（Token失效时）
    function autoRefreshPage(reason = 'Token已失效') {
        addStatus(`🔄 ${reason}，3秒后自动刷新页面...`, 'warning');
        setTimeout(() => {
            location.reload();
        }, 3000);
    }

    // 定期Token检查（每5分钟检查一次）
    let tokenCheckTimer = null;
    function startTokenCheck() {
        if (tokenCheckTimer) return;

        tokenCheckTimer = setInterval(async () => {
            if (!isRunning) return; // 只在运行时检查

            const isValid = await validateToken();
            if (!isValid) {
                stopBooking();
                autoRefreshPage();
            }
        }, 5 * 60 * 1000); // 5分钟
    }

    function stopTokenCheck() {
        if (tokenCheckTimer) {
            clearInterval(tokenCheckTimer);
            tokenCheckTimer = null;
        }
    }

    // 同步服务器时间（禁用缓存 + 多次采样取最小RTT）
    async function syncServerTime(samples = 5) {
        try {
            let best = null;

            for (let i = 0; i < samples; i++) {
                const startPerf = performance.now();

                // 加随机参数避免 CDN/浏览器缓存命中
                const url = `${BASE_URL}/?_ts=${Date.now()}_${Math.random().toString(16).slice(2)}`;

                const response = await fetch(url, {
                    method: 'HEAD',
                    cache: 'no-store', // 关键：不要用缓存
                });

                const endPerf = performance.now();
                const rtt = endPerf - startPerf;

                const serverDateStr = response.headers.get('date') || response.headers.get('Date');
                if (!serverDateStr) continue;

                const serverTime = new Date(serverDateStr).getTime();
                const clientReceiveTime = Date.now();

                const offset = serverTime + (rtt / 2) - clientReceiveTime;

                if (!best || rtt < best.rtt) {
                    best = { rtt, offset };
                }

                // 小睡一下，避免同一秒内 Date 变化不明显
                await new Promise(r => setTimeout(r, 50));
            }

            if (!best) {
                addStatus('时间同步失败: 未获取到 Date 响应头', 'warning');
                return false;
            }

            serverTimeOffset = best.offset;
            addStatus(`服务器时间同步完成，偏移: ${serverTimeOffset.toFixed(0)}ms (best RTT=${best.rtt.toFixed(1)}ms)`, 'success');
            return true;
        } catch (e) {
            addStatus(`时间同步失败: ${e.message}`, 'warning');
            return false;
        }
    }

    // 获取校准后的当前时间
    function getCalibratedTime() {
        return new Date(Date.now() + serverTimeOffset);
    }

    function getScheduleNow() {
        return scheduleUseServerTime ? getCalibratedTime() : new Date();
    }

    async function apiRequest(url, method = 'GET', payload = null, retryCount = 2) {
        const token = getToken();
        if (!token) {
            throw new Error('未找到Token，请先登录');
        }

        const options = {
            method,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'token': token,
                'x-api-version': '2.0.0',
                'Language-Set': 'CN'
            }
        };

        if (payload) {
            options.body = JSON.stringify(payload);
        }

        const fullUrl = `${url}?${getSignedParams()}`;

        for (let attempt = 0; attempt <= retryCount; attempt++) {
            try {
                const response = await fetch(fullUrl, options);

                // 401错误时刷新Token缓存并自动刷新页面
                if (response.status === 401) {
                    refreshTokenCache();
                    // 如果正在运行抢票，自动刷新页面
                    if (isRunning) {
                        stopBooking();
                        autoRefreshPage('Token已过期');
                    }
                    throw new Error('Token已过期，请重新登录');
                }

                // 5xx错误时重试
                if (response.status >= 500 && attempt < retryCount) {
                    await new Promise(r => setTimeout(r, 100 * (attempt + 1)));
                    continue;
                }

                return response.json();
            } catch (err) {
                // 网络错误时重试
                if (attempt < retryCount && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError'))) {
                    await new Promise(r => setTimeout(r, 100 * (attempt + 1)));
                    continue;
                }
                throw err;
            }
        }
    }

    async function fetchUserId() {
        const url = `${BASE_URL}/site/system/login/getLoginUser`;
        const result = await apiRequest(url, 'GET');
        if (result.success && result.data) {
            userId = result.data.id;
            userName = result.data.name || result.data.nickName || null;
            userOrgName = result.data.orgName || null;
            return userId;
        }
        throw new Error('获取用户信息失败');
    }

    async function fetchVenues(venueType, date) {
        const config = VENUE_CONFIG[venueType];
        const url = `${BASE_URL}/site/api/reserve/current/page`;
        const payload = {
            sceneUuid: config.sceneUuid,
            resvKind: "CURRENT_RESERVE",
            devKindUuid: config.devKindUuid,
            siteType: "DEV",
            searchValue: "",
            siteKindId: "",
            classTypeEnum: "ROOM",
            classTypeUuid: config.classTypeUuid,
            reserveDate: date,
            sceneUseType: "SPORT_GROUP",
            pageSize: 999,
            pageNum: 1
        };

        const result = await apiRequest(url, 'POST', payload);
        if (result.success) {
            return result.data || [];
        }
        throw new Error(result.message || '查询场地失败');
    }

    async function submitReservation(venueType, siteData, date, timeSlots) {
        const config = VENUE_CONFIG[venueType];
        const url = `${BASE_URL}/site/api/reserve/addMultiReserve`;

        // 过滤掉无效的 slot 请求
        const siteSessionReserve = timeSlots.map(slot => {
            let sessionUuid = null;

            // 优先从缓存找
            if (siteData._cachedSessions && siteData._cachedSessions[slot.start]) {
                sessionUuid = siteData._cachedSessions[slot.start];
            }
            // 其次从原始数据找
            else if (siteData.sessionVo) {
                const matched = siteData.sessionVo.find(s => s.beginTime === slot.start);
                if (matched) sessionUuid = matched.uuid;
            }

            if (!sessionUuid) {
                // 增加详细日志，方便调试
                console.error(`[预约] 无法获取 Session UUID: ${slot.start}, 场地: ${siteData.siteName}`);
                return null;
            }

            return {
                sessionDetailUuid: sessionUuid,
                reserveTime: {
                    startTime: `${date} ${slot.start}:00`,
                    endTime: `${date} ${slot.end}:00`
                }
            };
        }).filter(item => item !== null); // 移除无效项

        if (siteSessionReserve.length === 0) {
            throw new Error("无法构建有效的预约请求参数");
        }

        const payload = {
            sceneUuid: config.sceneUuid,
            multiSiteSessionReserve: [{
                siteUuid: siteData.uuid,
                siteType: "DEV",
                resvKind: "CURRENT_RESERVE",
                sceneUseType: "SPORT_GROUP",
                siteSessionReserve
            }],
            resvMember: [userId],
            payType: "PAY_ONLINE",
            purchaseUuid: "",
            formParam: FORM_PARAM,
            captcha: "",
            sysNo: "100"
        };

        const result = await apiRequest(url, 'POST', payload);
        return result;
    }

    function formatDate(date) {
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    function getTomorrowDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return formatDate(tomorrow);
    }

    // ================= 预加载功能（盲打策略） =================

    // 预加载目标场地信息
    async function preloadTargetSites() {
        const venueType = document.getElementById('hzau-venue').value;
        const date = document.getElementById('hzau-date').value;

        // 获取选中的场地索引
        const selectedSiteIndexes = [];
        document.querySelectorAll('.hzau-site-btn.selected').forEach(btn => {
            selectedSiteIndexes.push(parseInt(btn.dataset.index));
        });

        // 获取选中的时段
        preloadedTimeSlots = [];
        document.querySelectorAll('.hzau-time-btn.selected').forEach(btn => {
            preloadedTimeSlots.push({
                start: btn.dataset.start,
                end: btn.dataset.end
            });
        });

        if (preloadedTimeSlots.length === 0) {
            addStatus('⚠️ 请先选择时段', 'warning');
            return false;
        }

        try {
            const sites = await fetchVenues(venueType, date);
            siteCache = sites;

            // 如果指定了场地，只缓存选中的场地；否则缓存所有可用场地
            if (selectedSiteIndexes.length > 0) {
                targetSiteCache = selectedSiteIndexes.map(i => sites[i]).filter(Boolean);
            } else {
                targetSiteCache = sites.filter(s => s.openState === 1);
            }

            if (targetSiteCache.length === 0) {
                addStatus('⚠️ 未找到可用场地', 'warning');
                return false;
            }

            // 预解析每个场地的 sessionUuid
            targetSiteCache.forEach(site => {
                if (site.sessionVo) {
                    site._cachedSessions = {};
                    site.sessionVo.forEach(session => {
                        site._cachedSessions[session.beginTime] = session.uuid;
                    });
                }
            });

            addStatus(`✅ 已预加载 ${targetSiteCache.length} 个场地，${preloadedTimeSlots.length} 个时段，准备盲打`, 'success');
            return true;
        } catch (e) {
            addStatus(`❌ 预加载失败: ${e.message}`, 'error');
            return false;
        }
    }

    // ================= UI 界面 =================

    function createUI() {
        GM_addStyle(`
            #hzau-booking-panel {
                position: fixed;
                top: 80px;
                right: 20px;
                width: 360px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                z-index: 99999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                overflow: hidden;
            }
            #hzau-booking-panel * {
                box-sizing: border-box;
            }
            .hzau-header {
                background: rgba(255,255,255,0.15);
                padding: 16px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
            }
            .hzau-header h3 {
                margin: 0;
                color: #fff;
                font-size: 16px;
                font-weight: 600;
            }
            .hzau-minimize-btn {
                background: rgba(255,255,255,0.2);
                border: none;
                color: #fff;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 16px;
                transition: all 0.2s;
            }
            .hzau-minimize-btn:hover {
                background: rgba(255,255,255,0.3);
                transform: scale(1.1);
            }
            .hzau-body {
                padding: 20px;
                background: #fff;
                max-height: 500px;
                overflow-y: auto;
            }
            .hzau-body.collapsed {
                display: none;
            }
            .hzau-section {
                margin-bottom: 16px;
            }
            .hzau-section label {
                display: block;
                color: #374151;
                font-size: 13px;
                font-weight: 600;
                margin-bottom: 8px;
            }
            .hzau-select, .hzau-input {
                width: 100%;
                padding: 10px 12px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 14px;
                transition: border-color 0.2s;
            }
            .hzau-select:focus, .hzau-input:focus {
                outline: none;
                border-color: #667eea;
            }
            .hzau-time-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
                max-height: 150px;
                overflow-y: auto;
                padding: 4px;
            }
            .hzau-time-btn {
                padding: 8px 4px;
                border: 2px solid #e5e7eb;
                border-radius: 6px;
                background: #fff;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
            }
            .hzau-time-btn:hover {
                border-color: #667eea;
            }
            .hzau-time-btn.selected {
                background: #667eea;
                border-color: #667eea;
                color: #fff;
            }
            .hzau-time-btn.unavailable {
                background: #f3f4f6;
                color: #9ca3af;
                cursor: not-allowed;
                text-decoration: line-through;
            }
            .hzau-site-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 6px;
                max-height: 120px;
                overflow-y: auto;
                padding: 4px;
            }
            .hzau-site-btn {
                padding: 8px 4px;
                border: 2px solid #e5e7eb;
                border-radius: 6px;
                background: #fff;
                cursor: pointer;
                font-size: 11px;
                transition: all 0.2s;
                text-align: center;
            }
            .hzau-site-btn:hover {
                border-color: #667eea;
            }
            .hzau-site-btn.selected {
                background: #667eea;
                border-color: #667eea;
                color: #fff;
            }
            .hzau-btn-primary {
                width: 100%;
                padding: 12px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #fff;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                margin-top: 8px;
            }
            .hzau-btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }
            .hzau-btn-primary:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
            .hzau-btn-primary.running {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            }
            .hzau-status-box {
                background: #f9fafb;
                border-radius: 8px;
                padding: 12px;
                margin-top: 12px;
                max-height: 300px;  /* 从 120px 改为 300px */
                overflow-y: auto;
            }
            .hzau-status-item {
                font-size: 12px;
                padding: 4px 0;
                border-bottom: 1px solid #e5e7eb;
            }
            .hzau-status-item:last-child {
                border-bottom: none;
            }
            .hzau-status-item.success { color: #059669; }
            .hzau-status-item.error { color: #dc2626; }
            .hzau-status-item.info { color: #6b7280; }
            .hzau-status-item.warning { color: #d97706; }
            .hzau-countdown {
                text-align: center;
                padding: 12px;
                background: #fef3c7;
                border-radius: 8px;
                margin-bottom: 12px;
                font-weight: 600;
                color: #92400e;
            }
            .hzau-row {
                display: flex;
                gap: 12px;
            }
            .hzau-row > * {
                flex: 1;
            }
            .hzau-quick-btns {
                display: flex;
                gap: 8px;
                margin-top: 8px;
            }
            .hzau-quick-btn {
                flex: 1;
                padding: 6px;
                border: 1px solid #e5e7eb;
                border-radius: 6px;
                background: #fff;
                cursor: pointer;
                font-size: 11px;
            }
            .hzau-quick-btn:hover {
                background: #f3f4f6;
            }
        `);

        const panel = document.createElement('div');
        panel.id = 'hzau-booking-panel';
        panel.innerHTML = `
            <div class="hzau-header">
                <h3>🏸 场馆自动预约</h3>
                <button class="hzau-minimize-btn" id="hzau-minimize">−</button>
            </div>
            <div class="hzau-body" id="hzau-body">
                <div id="hzau-countdown" class="hzau-countdown" style="display:none;"></div>

                <div class="hzau-section">
                    <label>🏟️ 选择场馆</label>
                    <select class="hzau-select" id="hzau-venue">
                        <option value="pingpong">乒乓球</option>
                        <option value="badminton">羽毛球</option>
                        <option value="tennis_indoor">室内网球馆</option>
                        <option value="tennis_outdoor">室外网球场</option>
                    </select>
                </div>

                <div class="hzau-section">
                    <label>📅 预约日期</label>
                    <input type="date" class="hzau-input" id="hzau-date" value="${getTomorrowDate()}">
                </div>

                <div class="hzau-section">
                    <label>⏰ 选择时段 <span style="color:#6b7280;font-weight:normal;">(已选0/2，可多选)</span></label>
                    <div class="hzau-time-grid" id="hzau-time-grid">
                        ${TIME_SLOTS.map((slot, i) => `
                            <button class="hzau-time-btn" data-index="${i}" data-start="${slot.start}" data-end="${slot.end}">
                                ${slot.label}
                            </button>
                        `).join('')}
                    </div>
                    <div class="hzau-quick-btns">
                        <button class="hzau-quick-btn" id="hzau-select-evening">选晚间(19-21)</button>
                        <button class="hzau-quick-btn" id="hzau-select-all">全选</button>
                        <button class="hzau-quick-btn" id="hzau-select-none">清空</button>
                    </div>
                </div>

                <div class="hzau-section">
                    <label>🎯 选择场地 <span style="color:#6b7280;font-weight:normal;">(点击刷新加载)</span></label>
                    <div class="hzau-site-grid" id="hzau-site-grid">
                        <div style="grid-column: 1/-1; text-align:center; color:#9ca3af; padding:20px;">
                            点击下方按钮加载场地列表
                        </div>
                    </div>
                    <button class="hzau-quick-btn" id="hzau-refresh-sites" style="width:100%;margin-top:8px;">
                        🔄 刷新场地列表
                    </button>
                </div>

                <div class="hzau-section">
                    <div class="hzau-row">
                        <div style="flex: 1;">
                            <label>🕐 开抢时间</label>
                            <input type="time" class="hzau-input" id="hzau-start-time" value="16:00">
                        </div>
                        <div style="flex: 1;">
                            <label>⚙️ 轮询间隔 (ms)</label>
                            <input type="number" class="hzau-input" id="hzau-interval" value="500" min="100" max="5000">
                        </div>
                    </div>
                </div>

                <div class="hzau-section">
                    <div class="hzau-row">
                        <div style="flex: 1;">
                            <label>⏱️ 提前量 (ms)</label>
                            <input type="number" class="hzau-input" id="hzau-advance" value="300" min="0" max="2000" title="提前发送请求的毫秒数">
                        </div>
                        <div style="flex: 1;">
                            <label>🔄 同步时间</label>
                            <button class="hzau-quick-btn" id="hzau-sync-time" style="width:100%;height:42px;margin-top:0;">
                                同步服务器
                            </button>
                        </div>
                    </div>
                </div>

                <div class="hzau-section">
                    <label>🧭 计时基准</label>
                    <div style="display:flex; align-items:center; gap:8px; font-size:12px; color:#374151;">
                        <input type="checkbox" id="hzau-use-server-time" style="width:14px;height:14px;">
                        <span>使用服务器校准时间触发（不勾选=按本机时间）</span>
                    </div>
                </div>

                <button class="hzau-btn-primary" id="hzau-preload-btn" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); margin-bottom: 8px;" title="手动预加载场地信息，开抢前60秒会自动预加载">
                    📦 手动预加载（可选，自动触发）
                </button>
                <button class="hzau-btn-primary" id="hzau-start-btn">
                    🚀 开始抢票 (定时自动开抢)
                </button>
                <button class="hzau-btn-primary" id="hzau-now-btn" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                    ⚡ 立即抢票
                </button>

                <div class="hzau-status-box" id="hzau-status-box">
                    <div class="hzau-status-item info">等待操作...</div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        initUIEvents();
        makeDraggable(panel);
    }

    // 节流日志 - 对于重复的轮询日志进行节流
    let pendingLogs = [];
    let logFlushTimer = null;

    function addStatus(message, type = 'info', throttle = false) {
        const now = Date.now();

        // 对于轮询类日志，使用节流
        if (throttle && now - lastLogTime < 500) {
            return;
        }
        lastLogTime = now;

        const box = document.getElementById('hzau-status-box');
        if (!box) return;

        const formatClock = (d) => d.toLocaleTimeString(undefined, { hour12: false });
        const localClock = new Date();
        let time = formatClock(localClock);
        // 如果做过服务器时间校准且偏移较大，展示“校准时间|本机时间”，避免误判为“提前开抢”
        if (Math.abs(serverTimeOffset) > 1000) {
            const calibratedClock = getCalibratedTime();
            time = `${formatClock(calibratedClock)}(校准) | ${formatClock(localClock)}(本机)`;
        }
        const item = document.createElement('div');
        item.className = `hzau-status-item ${type}`;
        item.textContent = `[${time}] ${message}`;
        box.appendChild(item);

        // 限制消息数量
        while (box.children.length > 50) {
            box.removeChild(box.firstChild);
        }

        // 自动滚动到底部
        box.scrollTop = box.scrollHeight;
    }

    function initUIEvents() {
        document.getElementById('hzau-minimize').addEventListener('click', () => {
            const body = document.getElementById('hzau-body');
            const btn = document.getElementById('hzau-minimize');
            body.classList.toggle('collapsed');
            btn.textContent = body.classList.contains('collapsed') ? '+' : '−';
        });

        document.getElementById('hzau-time-grid').addEventListener('click', (e) => {
            if (e.target.classList.contains('hzau-time-btn') && !e.target.classList.contains('unavailable')) {
                const isSelected = e.target.classList.contains('selected');

                if (isSelected) {
                    e.target.classList.remove('selected');
                    updateTimeSlotCounter();
                } else {
                    const selectedCount = document.querySelectorAll('.hzau-time-btn.selected').length;
                    if (selectedCount >= 2) {
                        addStatus('⚠️ 最多只能选择2个时段', 'warning');
                        return;
                    }
                    e.target.classList.add('selected');
                    updateTimeSlotCounter();
                }
                saveUserConfig();
            }
        });

        document.getElementById('hzau-select-evening').addEventListener('click', () => {
            document.querySelectorAll('.hzau-time-btn').forEach(btn => btn.classList.remove('selected'));
            let count = 0;
            document.querySelectorAll('.hzau-time-btn').forEach(btn => {
                const hour = parseInt(btn.dataset.start);
                if (hour >= 19 && hour < 22 && !btn.classList.contains('unavailable') && count < 2) {
                    btn.classList.add('selected');
                    count++;
                }
            });
            updateTimeSlotCounter();
            saveUserConfig();
        });

        document.getElementById('hzau-select-all').addEventListener('click', () => {
            document.querySelectorAll('.hzau-time-btn').forEach(btn => btn.classList.remove('selected'));
            let count = 0;
            document.querySelectorAll('.hzau-time-btn:not(.unavailable)').forEach(btn => {
                if (count < 2) {
                    btn.classList.add('selected');
                    count++;
                }
            });
            updateTimeSlotCounter();
            addStatus('已选择前2个可用时段', 'info');
            saveUserConfig();
        });

        document.getElementById('hzau-select-none').addEventListener('click', () => {
            document.querySelectorAll('.hzau-time-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            updateTimeSlotCounter();
            saveUserConfig();
        });

        document.getElementById('hzau-refresh-sites').addEventListener('click', refreshSiteList);

        // 场地选择：只绑定一次事件委托，避免 refreshSiteList() 重复绑定导致“点了没反应”（toggle两次抵消）
        const siteGrid = document.getElementById('hzau-site-grid');
        if (siteGrid) {
            siteGrid.addEventListener('click', (e) => {
                const btn = e.target.closest?.('.hzau-site-btn');
                if (!btn) return;
                btn.classList.toggle('selected');
                saveUserConfig();
            });
        }

        document.getElementById('hzau-venue').addEventListener('change', () => {
            saveUserConfig();
            refreshSiteList();
        });

        document.getElementById('hzau-date').addEventListener('change', saveUserConfig);
        document.getElementById('hzau-interval').addEventListener('change', saveUserConfig);

        document.getElementById('hzau-start-time').addEventListener('change', () => {
            saveUserConfig();
            updateStartButtonText();
        });

        // 同步服务器时间按钮
        document.getElementById('hzau-sync-time').addEventListener('click', async () => {
            document.getElementById('hzau-sync-time').disabled = true;
            document.getElementById('hzau-sync-time').textContent = '同步中...';
            await syncServerTime();
            document.getElementById('hzau-sync-time').disabled = false;
            document.getElementById('hzau-sync-time').textContent = '同步服务器';
        });

        // 计时基准切换
        const useServerTimeCheckbox = document.getElementById('hzau-use-server-time');
        if (useServerTimeCheckbox) {
            useServerTimeCheckbox.checked = scheduleUseServerTime;
            useServerTimeCheckbox.addEventListener('change', () => {
                scheduleUseServerTime = !!useServerTimeCheckbox.checked;
                saveUserConfig();
                addStatus(`计时基准已切换为: ${scheduleUseServerTime ? '服务器校准时间' : '本机时间'}`, 'info');
            });
        }

        // 预加载按钮
        document.getElementById('hzau-preload-btn').addEventListener('click', async () => {
            const btn = document.getElementById('hzau-preload-btn');
            btn.disabled = true;
            btn.textContent = '📦 预加载中...';
            const success = await preloadTargetSites();
            btn.disabled = false;
            if (success) {
                btn.textContent = `📦 已预加载 (${targetSiteCache.length}场地)`;
                btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            } else {
                btn.textContent = '📦 手动预加载（可选，自动触发）';
            }
        });

        document.getElementById('hzau-start-btn').addEventListener('click', toggleScheduledBooking);
        document.getElementById('hzau-now-btn').addEventListener('click', toggleImmediateBooking);
    }

    function updateStartButtonText() {
        const btn = document.getElementById('hzau-start-btn');
        const startTime = document.getElementById('hzau-start-time').value;
        if (!isRunning) {
            btn.textContent = `🚀 开始抢票 (${startTime}自动开抢)`;
        }
    }

    function updateTimeSlotCounter() {
        const selectedCount = document.querySelectorAll('.hzau-time-btn.selected').length;
        const label = document.querySelector('.hzau-section label span');
        if (label) {
            label.textContent = `(已选${selectedCount}/2，可多选)`;
            label.style.color = selectedCount >= 2 ? '#dc2626' : '#6b7280';
        }
    }

    async function refreshSiteList() {
        const venueType = document.getElementById('hzau-venue').value;
        const date = document.getElementById('hzau-date').value;
        const grid = document.getElementById('hzau-site-grid');

        grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:#9ca3af; padding:20px;">加载中...</div>';

        try {
            const sites = await fetchVenues(venueType, date);
            siteCache = sites;

            if (sites.length === 0) {
                grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:#9ca3af; padding:20px;">无可用场地</div>';
                return;
            }

            grid.innerHTML = sites.map((site, i) => `
                <button class="hzau-site-btn" data-index="${i}" data-uuid="${site.uuid}">
                    ${site.siteName}
                </button>
            `).join('');

            addStatus(`加载了 ${sites.length} 个场地`, 'success');
        } catch (err) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color:#dc2626; padding:20px;">${err.message}</div>`;
            addStatus(err.message, 'error');
        }
    }

    function toggleScheduledBooking() {
        const btn = document.getElementById('hzau-start-btn');

        if (isRunning) {
            stopBooking();
            updateStartButtonText();
            btn.classList.remove('running');
        } else {
            startScheduledBooking();
            btn.textContent = '⏹️ 停止抢票';
            btn.classList.add('running');
        }
    }

    async function startScheduledBooking() {
        isRunning = true;
        bookingSessionId++; // 新会话

        // 先验证Token是否有效
        addStatus('🔐 验证Token...', 'info');
        const tokenValid = await validateToken();
        if (!tokenValid) {
            stopBooking();
            autoRefreshPage('Token已失效，需要重新登录');
            return;
        }

        try {
            userId = await fetchUserId();
            addStatus(`用户ID: ${userId}`, 'success');
        } catch (err) {
            addStatus(`获取用户ID失败: ${err.message}`, 'error');
            stopBooking();
            return;
        }

        // 启动定期Token检查
        startTokenCheck();

        startCountdown();
    }

    // 新增：自动预加载定时器
    let autoPreloadTimer = null;
    let preloadTriggered = false; // 防止重复触发

    function startCountdown() {
        const countdownEl = document.getElementById('hzau-countdown');
        countdownEl.style.display = 'block';

        const startTime = document.getElementById('hzau-start-time').value;
        const [targetHour, targetMinute] = startTime.split(':').map(Number);
        const advanceMs = parseInt(document.getElementById('hzau-advance').value) || 0;
        const currentSession = bookingSessionId;

        // 重置预加载状态
        preloadTriggered = false;

        const checkAndStart = () => {
            // 检查会话是否过期
            if (currentSession !== bookingSessionId || !isRunning) {
                clearInterval(countdownTimer);
                return;
            }

            // 使用选定的计时基准（本机/服务器校准）
            const now = getScheduleNow();
            const target = new Date(now.getTime());
            target.setHours(targetHour, targetMinute, 0, 0);

            // 考虑提前量：实际触发时间 = 目标时间 - 提前量
            const effectiveTarget = new Date(target.getTime() - advanceMs);

            // ========== 自动预加载逻辑 ==========
            // 在开抢前1分钟自动预加载（如果还没预加载过）
            const timeToStart = effectiveTarget - now;
            if (!preloadTriggered && targetSiteCache.length === 0 && timeToStart > 0 && timeToStart <= 60000) {
                preloadTriggered = true;
                triggerAutoPreload();
            }

            if (now >= effectiveTarget) {
                const diff = now - effectiveTarget;
                if (diff < 300000) {
                    clearInterval(countdownTimer);
                    countdownEl.textContent = '🔥 正在抢票中...';
                    addStatus(`${startTime}到达（${scheduleUseServerTime ? '校准' : '本机'}，提前${advanceMs}ms），开始抢票！`, 'warning');
                    startPolling();
                    return true;
                }
                target.setDate(target.getDate() + 1);
            }

            const diff = target.getTime() - advanceMs - now.getTime();
            const hours = Math.floor(diff / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            const ms = diff % 1000;

            // 最后10秒显示毫秒
            if (diff <= 10000) {
                countdownEl.textContent = `⏰ 距离开抢: ${seconds}.${ms.toString().padStart(3, '0')}秒`;
            } else if (diff <= 60000) {
                // 最后1分钟，显示盲打状态
                const blindStatus = targetSiteCache.length > 0 ? '✅盲打就绪' : '📦准备预加载';
                countdownEl.textContent = `⏰ ${seconds}秒 | ${blindStatus}`;
            } else {
                countdownEl.textContent = `⏰ 距离${startTime}开抢: ${hours}时${minutes}分${seconds}秒`;
            }

            if (diff <= 0) {
                clearTimeout(countdownTimer);
                countdownEl.textContent = '🔥 正在抢票中...';
                addStatus(`${startTime}到达（${scheduleUseServerTime ? '校准' : '本机'}，提前${advanceMs}ms），开始抢票！`, 'warning');
                startPolling();
                return true;
            }

            return false;
        };

        if (checkAndStart()) {
            return;
        }

        // 最后5秒使用更精确的间隔
        const updateInterval = () => {
            const now = getScheduleNow();
            const target = new Date(now.getTime());
            target.setHours(targetHour, targetMinute, 0, 0);
            const diff = target.getTime() - advanceMs - now.getTime();
            return diff <= 5000 ? 50 : 1000; // 最后5秒每50ms更新
        };

        const dynamicCheck = () => {
            if (checkAndStart()) return;
            countdownTimer = setTimeout(dynamicCheck, updateInterval());
        };

        countdownTimer = setTimeout(dynamicCheck, updateInterval());
    }

    // 自动预加载触发函数
    async function triggerAutoPreload() {
        addStatus('📦 自动预加载开始（开抢前1分钟）...', 'info');

        const btn = document.getElementById('hzau-preload-btn');
        if (btn) {
            btn.disabled = true;
            btn.textContent = '📦 自动预加载中...';
        }

        const success = await preloadTargetSites();

        if (btn) {
            btn.disabled = false;
            if (success) {
                btn.textContent = `📦 已自动预加载 (${targetSiteCache.length}场地)`;
                btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                addStatus(`✅ 自动预加载完成，盲打模式已就绪`, 'success');
            } else {
                btn.textContent = '📦 手动预加载（可选，自动触发）';
                addStatus('⚠️ 自动预加载失败，将使用普通模式', 'warning');
            }
        }
    }

    function toggleImmediateBooking() {
        const btn = document.getElementById('hzau-now-btn');

        if (isRunning) {
            stopBooking();
            btn.textContent = '⚡ 立即抢票';
            btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        } else {
            startImmediateBooking();
            btn.textContent = '⏹️ 停止运行';
            btn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        }
    }

    async function startImmediateBooking() {
        if (isRunning) {
            addStatus('已在运行中', 'warning');
            return;
        }

        isRunning = true;
        bookingSessionId++; // 新会话
        document.getElementById('hzau-start-btn').disabled = true;
        document.getElementById('hzau-countdown').style.display = 'block';
        document.getElementById('hzau-countdown').textContent = '🔥 正在抢票中...';

        try {
            userId = await fetchUserId();
            addStatus(`用户ID: ${userId}`, 'success');
            startPolling();
        } catch (err) {
            addStatus(`获取用户ID失败: ${err.message}`, 'error');
            stopBooking();
        }
    }

    function startPolling() {
        const baseInterval = parseInt(document.getElementById('hzau-interval').value) || 100;
        const currentSession = bookingSessionId;

        // 计算带随机抖动的间隔（防检测）
        const getRandomizedInterval = () => {
            const jitter = Math.floor(Math.random() * 150); // 0-150ms 随机抖动
            return baseInterval + jitter;
        };

        // 使用 setTimeout 递归代替 setInterval，确保上一次完成后才开始下一次
        const poll = async () => {
            // 检查会话是否过期
            if (currentSession !== bookingSessionId || !isRunning) {
                console.log('[轮询] 会话已过期，停止轮询');
                return;
            }

            await tryBooking(currentSession);

            // 再次检查，预约完成后不再继续
            if (currentSession === bookingSessionId && isRunning) {
                pollingTimer = setTimeout(poll, getRandomizedInterval());
            }
        };

        // 立即执行第一次
        poll();
    }

    // 尝试预约 - 支持盲打模式和并发请求
    async function tryBooking(sessionId) {
        // 检查会话是否有效
        if (sessionId !== bookingSessionId || !isRunning) {
            return;
        }

        // 防止并发执行
        if (isBookingInProgress) {
            return;
        }
        isBookingInProgress = true;

        try {
            const venueType = document.getElementById('hzau-venue').value;
            const date = document.getElementById('hzau-date').value;

            // 获取选中的时段（优先使用预加载的时段）
            let selectedTimeSlots = preloadedTimeSlots.length > 0 ? [...preloadedTimeSlots] : [];
            if (selectedTimeSlots.length === 0) {
                document.querySelectorAll('.hzau-time-btn.selected').forEach(btn => {
                    selectedTimeSlots.push({
                        start: btn.dataset.start,
                        end: btn.dataset.end
                    });
                });
            }

            if (selectedTimeSlots.length === 0) {
                addStatus('请先选择时段', 'error');
                stopBooking();
                return;
            }

            // 计算剩余时段
            const remainingSlots = selectedTimeSlots.filter(slot => {
                return !successfulSlots.some(s => s.start === slot.start && s.end === slot.end);
            });

            // 检查是否全部完成
            if (remainingSlots.length === 0) {
                const successMsg = successfulSlots.map(s => s.start + '-' + s.end).join(', ');
                addStatus(`🎉 全部 ${successfulSlots.length} 个时段预约完成: ${successMsg}`, 'success');
                stopBooking();
                return;
            }

            // 使用节流日志
            addStatus(`[轮询] 待预约: ${remainingSlots.map(s => s.start).join(', ')} (${remainingSlots.length}个时段)`, 'info', true);

            // 决定使用盲打模式还是普通模式
            let sitesToProcess = [];
            const useBlindMode = targetSiteCache.length > 0;

            if (useBlindMode) {
                // 盲打模式：直接使用预加载的场地数据
                sitesToProcess = targetSiteCache;
                console.log('[盲打] 使用预加载数据，跳过场地查询');
            } else {
                // 普通模式：查询最新场地状态
                const selectedSiteIndexes = [];
                document.querySelectorAll('.hzau-site-btn.selected').forEach(btn => {
                    selectedSiteIndexes.push(parseInt(btn.dataset.index));
                });

                const sites = await fetchVenues(venueType, date);

                // 再次检查会话
                if (sessionId !== bookingSessionId || !isRunning) {
                    return;
                }

                sitesToProcess = selectedSiteIndexes.length > 0
                    ? selectedSiteIndexes.map(i => sites[i]).filter(Boolean)
                    : sites.filter(s => s.openState === 1);
            }

            // ========== 并发请求策略 ==========
            // 收集所有可以提交的预约请求
            const bookingPromises = [];

            for (const site of sitesToProcess) {
                if (!site) continue;

                // 盲打模式不检查openState
                if (!useBlindMode && site.openState !== 1) continue;

                // 检查是否已全部完成
                const currentRemaining = selectedTimeSlots.filter(slot => {
                    return !successfulSlots.some(s => s.start === slot.start && s.end === slot.end);
                });

                if (currentRemaining.length === 0) break;

                let slotsToBook = currentRemaining;

                // 非盲打模式下检查可用时段
                if (!useBlindMode) {
                    const availableRanges = site.reserveStatus?.availableRange || [];
                    slotsToBook = currentRemaining.filter(slot => {
                        return availableRanges.some(range => {
                            return slot.start >= range.startTime && slot.end <= range.endTime;
                        });
                    });
                }

                if (slotsToBook.length > 0 && (site.sessionVo?.length > 0 || site._cachedSessions)) {
                    // 创建预约请求Promise
                    const bookingPromise = submitReservation(venueType, site, date, slotsToBook)
                        .then(result => ({
                            site,
                            slots: slotsToBook,
                            result,
                            error: null
                        }))
                        .catch(error => ({
                            site,
                            slots: slotsToBook,
                            result: null,
                            error
                        }));

                    bookingPromises.push(bookingPromise);

                    // 盲打模式只对选中的场地并发，限制并发数
                    if (useBlindMode && bookingPromises.length >= 3) break;
                }
            }

            if (bookingPromises.length === 0) {
                addStatus(`暂无可用场地，继续轮询...`, 'info', true);
                return;
            }

            addStatus(`并发提交 ${bookingPromises.length} 个预约请求...`, 'info');

            // 并发执行所有预约请求
            const results = await Promise.all(bookingPromises);

            // 再次检查状态
            if (sessionId !== bookingSessionId || !isRunning) {
                return;
            }

            // 处理所有结果
            for (const { site, slots, result, error } of results) {
                if (error) {
                    const errMsg = error.message || String(error);
                    if (errMsg.includes('over limit') || errMsg.includes('人数过多')) {
                        addStatus(`⚡ ${site.siteName} 服务繁忙...`, 'warning');
                    } else {
                        addStatus(`⚠️ ${site.siteName} 异常: ${errMsg}`, 'warning');
                    }
                    continue;
                }

                if (result.success) {
                    // 标记成功的时段（只对“本次新成功”的时段推送一次）
                    const newlyBookedSlots = slots.filter(slot => {
                        return !successfulSlots.some(s => s.start === slot.start && s.end === slot.end);
                    });

                    newlyBookedSlots.forEach(slot => successfulSlots.push(slot));
                    addStatus(`✅ ${site.siteName} 预约 ${slots.length} 个时段成功！`, 'success');

                    if (newlyBookedSlots.length > 0) {
                        const venueName = VENUE_CONFIG[venueType]?.name || venueType;
                        const timeSlotsText = newlyBookedSlots.map(s => `${s.start}-${s.end}`).join(', ');
                        WeChatNotifier.sendSuccess({
                            userId,
                            userName,
                            userOrgName,
                            date,
                            venueName,
                            siteName: site.siteName,
                            timeSlotsText
                        });
                    }

                    // 检查是否全部完成
                    if (successfulSlots.length >= selectedTimeSlots.length) {
                        const successMsg = successfulSlots.map(s => s.start + '-' + s.end).join(', ');
                        addStatus(`🎉 全部 ${successfulSlots.length} 个时段预约完成: ${successMsg}`, 'success');
                        stopBooking();
                        return;
                    }
                } else {
                    const errorCode = result.errorCode;
                    const errorMsg = result.message || '未知错误';

                    if (errorCode === 40100077) {
                        // 冲突 = 已预约
                        slots.forEach(slot => {
                            if (!successfulSlots.some(s => s.start === slot.start && s.end === slot.end)) {
                                successfulSlots.push(slot);
                            }
                        });
                        addStatus(`✓ ${site.siteName} ${slots.length} 个时段已存在预约`, 'success');

                        if (successfulSlots.length >= selectedTimeSlots.length) {
                            const successMsg = successfulSlots.map(s => s.start + '-' + s.end).join(', ');
                            addStatus(`🎉 全部 ${successfulSlots.length} 个时段预约完成: ${successMsg}`, 'success');
                            stopBooking();
                            return;
                        }
                    } else if (errorCode === 40100064) {
                        addStatus(`⏳ ${site.siteName}: ${errorMsg}`, 'warning');
                    } else if (errorMsg.includes('over limit') || errorMsg.includes('人数过多')) {
                        addStatus(`⚡ ${site.siteName} 服务繁忙`, 'warning');
                    } else {
                        addStatus(`❌ ${site.siteName}: ${errorMsg}`, 'error');
                    }
                }
            }

            // 本轮结束统计
            const finalRemaining = selectedTimeSlots.length - successfulSlots.length;
            if (finalRemaining > 0 && sessionId === bookingSessionId && isRunning) {
                addStatus(`本轮结束，成功${successfulSlots.length}个，剩余${finalRemaining}个`, 'info');
            }
        } catch (err) {
            const errMsg = err.message || String(err);
            if (errMsg.includes('over limit') || errMsg.includes('人数过多')) {
                addStatus(`⚡ 服务繁忙，下一轮...`, 'warning');
            } else {
                addStatus(`⚠️ 异常: ${errMsg}`, 'warning');
            }
        } finally {
            isBookingInProgress = false;
        }
    }

    function stopBooking() {
        const wasRunning = isRunning;
        isRunning = false;
        isBookingInProgress = false;
        bookingSessionId++; // 使旧会话失效

        if (pollingTimer) {
            clearTimeout(pollingTimer); // 改为 clearTimeout
            pollingTimer = null;
        }

        if (countdownTimer) {
            clearTimeout(countdownTimer); // 统一使用 clearTimeout
            countdownTimer = null;
        }

        // 停止Token检查
        stopTokenCheck();

        // 清理自动预加载状态
        if (autoPreloadTimer) {
            clearTimeout(autoPreloadTimer);
            autoPreloadTimer = null;
        }
        preloadTriggered = false;

        // 只在真正运行过时才重置成功列表
        if (wasRunning) {
            successfulSlots = [];
            // 清理预加载缓存
            targetSiteCache = [];
            preloadedTimeSlots = [];
        }

        document.getElementById('hzau-start-btn').disabled = false;
        updateStartButtonText();
        document.getElementById('hzau-start-btn').classList.remove('running');

        const nowBtn = document.getElementById('hzau-now-btn');
        nowBtn.textContent = '⚡ 立即抢票';
        nowBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

        // 重置预加载按钮
        const preloadBtn = document.getElementById('hzau-preload-btn');
        if (preloadBtn) {
            preloadBtn.textContent = '📦 手动预加载（可选，自动触发）';
            preloadBtn.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
            preloadBtn.disabled = false;
        }

        document.getElementById('hzau-countdown').style.display = 'none';

        if (wasRunning) {
            addStatus('已停止', 'warning');
        }
    }

    function makeDraggable(element) {
        const header = element.querySelector('.hzau-header');
        let isDragging = false;
        let offsetX, offsetY;

        header.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            isDragging = true;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
            header.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            element.style.left = (e.clientX - offsetX) + 'px';
            element.style.top = (e.clientY - offsetY) + 'px';
            element.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            header.style.cursor = 'move';
        });
    }

    // ================= 初始化 =================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', async () => {
            createUI();
            setTimeout(loadUserConfig, 300);
            // 自动同步服务器时间
            setTimeout(syncServerTime, 500);
        });
    } else {
        createUI();
        setTimeout(loadUserConfig, 300);
        // 自动同步服务器时间
        setTimeout(syncServerTime, 500);
    }

})();