// ==UserScript==
// @name         PD-CP出款&充值统计
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @description  自动捕获 Authorization/fingerprint/x-trace-id 并用 GM_xmlhttpRequest 请求 CP 出款接口 + 充值统计（简洁面板，可收起/展开）
// @author       Cisco
// @match        https://admin2-397-c1f073.j-d-0-q.com/*
// @match        https://admin3-593-3ad612.m-b-d-1.com/*
// @match        https://admin-325-76eeb3.j-d-0-q.com/*
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556373/PD-CP%E5%87%BA%E6%AC%BE%E5%85%85%E5%80%BC%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/556373/PD-CP%E5%87%BA%E6%AC%BE%E5%85%85%E5%80%BC%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const NS = 'cpWithdrawGM';

    // 基础配置（会被动态覆盖）
    let CONFIG = {
        apiBaseUrl: '', // 初始为空，会动态获取
        withdrawalPath: '/api/backend/trpc/withdrawal.allReviewedList',
        payPath: '/api/backend/trpc/payRecord.list',
        tenantInfoPath: '/api/backend/trpc/tenant.info',
        tenantWithdrawChannelPath: '/api/backend/trpc/tenantWithdrawChannel.list',
        tenantId: null, // 初始为空，会动态获取
        withdrawalChannels: null, // 初始为空，会动态获取coinpay的ID
        pageSize: 50,
        refreshInterval: 10000, 
        amountIsCents: true, 
        maxPagesParallel: 6, 
        cacheTTL: 10000
    };

    // 当前标签页的唯一标识（域名 + 时间戳）
    const currentTabId = `${window.location.hostname}_${Date.now()}`;
    let currentDomain = window.location.hostname;
    
    // 存储当前标签页的配置键
    const CAPTURE_KEY = `${NS}_capturedHeaders_${currentTabId}`;
    const CONFIG_KEY = `${NS}_config_${currentTabId}`;

    GM_addStyle(`
        .${NS}-panel { position: fixed; top:20px; right:20px; width:320px; z-index:99999; background:#fff; border:1px solid #ddd; border-radius:6px; padding:12px; box-shadow:0 6px 18px rgba(0,0,0,0.08); font-family:Arial, sans-serif; transition: all 0.25s ease; }
        .${NS}-panel.${NS}_collapsed { width:44px; height:44px; padding:6px; overflow:hidden; }
        .${NS}-toggle { position:absolute; top:8px; right:8px; width:30px; height:30px; border-radius:50%; border:none; background:#f0f0f0; cursor:pointer; display:flex; align-items:center; justify-content:center; }
        .${NS}-header { color:#409EFF; font-weight:700; font-size:15px; margin-bottom:10px; }
        .${NS}-stat-row { display:flex; justify-content:space-between; align-items:center; padding:8px; margin-bottom:8px; background:#fafafa; border-radius:6px; border-left:3px solid #409EFF; }
        .${NS}-stat-row span { font-size:13px; color:#444; }
        .${NS}-stat-row .value { font-weight:700; background:#fff; padding:4px 8px; border-radius:4px; min-width:70px; text-align:center; }
        .${NS}-btn { width:100%; padding:9px; border-radius:6px; border:none; color:#fff; font-weight:700; cursor:pointer; margin-bottom:8px; }
        .${NS}-btn.start { background:#67C23A; } .${NS}-btn.stop{ background:#F56C6C; } .${NS}-btn.clear{ background:#909399; }
        .${NS}-btn:disabled { background:#ccc !important; cursor:not-allowed; }
        .${NS}-meta { font-size:12px; color:#666; border-top:1px dashed #eee; padding-top:8px; margin-top:6px; }
        .${NS}-loading { color:#E6A23C; }
        .${NS}-error { color:#F56C6C; }
        .${NS}-success { color:#67C23A; }
        .${NS}-debug { font-size:11px; color:#888; border-top:1px dashed #eee; padding-top:8px; margin-top:6px; display:none; }
        .${NS}-tabid { font-size:10px; color:#999; margin-top:4px; }
        .${NS}-cp-id { font-size:10px; color:#409EFF; margin-top:2px; }
    `);

    let apiCache = {};
    let dataHistory = GM_getValue(`${NS}_dataHistory`, []) || [];
    let autoInterval = null;
    let isRunning = false;
    let headersCaptured = false;
    let isConfigReady = false;
    let debugMode = false;

    // 清理过期的标签页数据（避免存储泄漏）
    function cleanupExpiredTabs() {
        try {
            const allKeys = GM_listValues ? GM_listValues() : [];
            const now = Date.now();
            const maxAge = 3600000; // 1小时
            
            allKeys.forEach(key => {
                if (key.startsWith(`${NS}_capturedHeaders_`) || key.startsWith(`${NS}_config_`)) {
                    // 提取时间戳
                    const match = key.match(/_(\d+)$/);
                    if (match) {
                        const timestamp = parseInt(match[1], 10);
                        if (now - timestamp > maxAge) {
                            console.log('清理过期标签页数据:', key);
                            GM_deleteValue(key);
                        }
                    }
                }
            });
        } catch (e) {
            // 某些环境可能不支持 GM_listValues
            console.log('无法列出所有键值，跳过清理');
        }
    }

    // 加载当前标签页的配置
    function loadTabConfig() {
        const savedConfig = GM_getValue(CONFIG_KEY, null);
        if (savedConfig) {
            CONFIG.apiBaseUrl = savedConfig.apiBaseUrl || '';
            CONFIG.tenantId = savedConfig.tenantId || null;
            CONFIG.withdrawalChannels = savedConfig.withdrawalChannels || null;
            console.log('加载标签页配置:', {
                apiBaseUrl: CONFIG.apiBaseUrl,
                tenantId: CONFIG.tenantId,
                withdrawalChannels: CONFIG.withdrawalChannels,
                tabId: currentTabId
            });
            return true;
        }
        return false;
    }

    // 保存当前标签页的配置
    function saveTabConfig() {
        const configToSave = {
            apiBaseUrl: CONFIG.apiBaseUrl,
            tenantId: CONFIG.tenantId,
            withdrawalChannels: CONFIG.withdrawalChannels,
            savedAt: new Date().toISOString(),
            tabId: currentTabId
        };
        GM_setValue(CONFIG_KEY, configToSave);
        console.log('保存标签页配置:', configToSave);
    }

    // 从请求URL中提取API基础URL
    function extractApiBaseUrlFromRequest(url) {
        try {
            if (url && url.includes('/api/backend/')) {
                const urlObj = new URL(url);
                const baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;
                console.log('从URL提取API基础URL:', url, '->', baseUrl);
                return baseUrl;
            }
        } catch (e) {
            console.warn('提取API基础URL失败:', e);
        }
        return '';
    }

    // 获取tenantId
    async function fetchTenantId() {
        try {
            const url = `${CONFIG.apiBaseUrl}${CONFIG.tenantInfoPath}?input=${encodeURIComponent(JSON.stringify({json:null,meta:{values:["undefined"],v:1}}))}`;
            console.log('正在获取tenantId，URL:', url);
            
            const json = await gmFetchJson(url, 10000, 0);
            console.log('tenantInfo响应:', json);
            
            // 解析tenantId
            const tenantId = json?.result?.data?.json?.tenant?.id;
            
            if (tenantId) {
                console.log('成功获取tenantId:', tenantId);
                CONFIG.tenantId = tenantId;
                return tenantId;
            } else {
                console.warn('无法从响应中提取tenantId，响应:', json);
                throw new Error('无法获取tenantId，响应结构不符预期');
            }
        } catch (e) {
            console.error('获取tenantId失败:', e);
            throw e;
        }
    }

    // 获取coinpay的withdrawalChannels ID
    async function fetchCoinpayChannelId() {
        try {
            if (!CONFIG.tenantId) {
                throw new Error('需要先获取tenantId');
            }
            
            const payload = {
                json: {
                    page: 1,
                    pageSize: 50,
                    regionId: 1,
                    tenantId: CONFIG.tenantId
                }
            };
            
            const url = `${CONFIG.apiBaseUrl}${CONFIG.tenantWithdrawChannelPath}?input=${encodeURIComponent(JSON.stringify(payload))}`;
            console.log('正在获取提现渠道列表，URL:', url);
            
            const json = await gmFetchJson(url, 10000, 0);
            console.log('提现渠道响应:', json);
            
            // 查找coinpay渠道
            const pageData = json?.result?.data?.json?.List?.pageData || [];
            console.log('渠道列表:', pageData);
            
            // 尝试多种匹配方式
            for (const channel of pageData) {
                const channelName = (channel.channelName || '').toLowerCase();
                const paymentName = (channel.paymentName || '').toLowerCase();
                const tenantPaymentName = (channel.tenantPaymentName || '').toLowerCase();
                
                console.log('检查渠道:', {
                    id: channel.id,
                    channelName: channel.channelName,
                    paymentName: channel.paymentName,
                    tenantPaymentName: channel.tenantPaymentName
                });
                
                // 检查是否包含coinpay关键词
                if (channelName.includes('coinpay') || 
                    paymentName.includes('coinpay') || 
                    tenantPaymentName.includes('coinpay')) {
                    console.log('找到coinpay渠道ID:', channel.id);
                    return channel.id;
                }
            }
            
            // 如果没有找到coinpay，返回第一个可用的渠道ID
            if (pageData.length > 0) {
                console.warn('未找到coinpay渠道，使用第一个渠道:', pageData[0].id);
                return pageData[0].id;
            }
            
            throw new Error('未找到可用的提现渠道');
        } catch (e) {
            console.error('获取coinpay渠道ID失败:', e);
            throw e;
        }
    }

    // 检查headers是否已捕获
    function checkHeadersCaptured() {
        const stored = GM_getValue(CAPTURE_KEY, null);
        const hasHeaders = !!(stored && stored.useful && (stored.useful.authorization || stored.useful['fingerprint-id'] || stored.useful['x-trace-id'] || stored.useful.cookie));
        
        if (hasHeaders !== headersCaptured) {
            console.log('headersCaptured状态变化:', headersCaptured, '->', hasHeaders, '标签页:', currentTabId);
            headersCaptured = hasHeaders;
        }
        
        return headersCaptured;
    }

    // 初始化配置（动态获取API基础URL、tenantId和withdrawalChannels）
    async function initConfig() {
        if (isConfigReady) {
            console.log('配置已就绪，跳过初始化');
            return true;
        }
        
        console.log('开始初始化配置，标签页:', currentTabId);
        
        // 检查headers是否已捕获
        if (!checkHeadersCaptured()) {
            console.log('headers尚未捕获，等待中...');
            updateStatus('等待捕获headers...', 'loading');
            return false;
        }
        
        // 尝试加载已保存的配置
        const hasSavedConfig = loadTabConfig();
        
        if (hasSavedConfig && CONFIG.apiBaseUrl && CONFIG.tenantId && CONFIG.withdrawalChannels) {
            console.log('使用已保存的配置:', {
                apiBaseUrl: CONFIG.apiBaseUrl,
                tenantId: CONFIG.tenantId,
                withdrawalChannels: CONFIG.withdrawalChannels
            });
            isConfigReady = true;
            updateStatus('配置就绪 ✓', 'success');
            updateConfigDisplay();
            return true;
        }
        
        // 如果API基础URL为空，尝试从最近捕获的请求中提取
        if (!CONFIG.apiBaseUrl) {
            const storedHeaders = GM_getValue(CAPTURE_KEY, null);
            console.log('检查存储的headers:', storedHeaders);
            if (storedHeaders && storedHeaders.lastRequestUrl) {
                const extracted = extractApiBaseUrlFromRequest(storedHeaders.lastRequestUrl);
                if (extracted) {
                    CONFIG.apiBaseUrl = extracted;
                    console.log('从最近请求中提取API基础URL:', CONFIG.apiBaseUrl);
                    updateConfigDisplay();
                }
            }
        }
        
        // 如果仍然没有API基础URL，需要等待
        if (!CONFIG.apiBaseUrl) {
            updateStatus('等待API请求以确定基础URL...', 'loading');
            return false;
        }
        
        try {
            // 获取tenantId
            if (!CONFIG.tenantId) {
                updateStatus('正在获取tenantId...', 'loading');
                const tenantId = await fetchTenantId();
                
                if (!tenantId) {
                    throw new Error('获取tenantId返回空值');
                }
            }
            
            // 获取coinpay渠道ID
            if (!CONFIG.withdrawalChannels) {
                updateStatus('正在获取coinpay渠道ID...', 'loading');
                const channelId = await fetchCoinpayChannelId();
                
                if (!channelId) {
                    throw new Error('获取coinpay渠道ID返回空值');
                }
                
                CONFIG.withdrawalChannels = channelId;
            }
            
            // 保存配置
            saveTabConfig();
            
            isConfigReady = true;
            updateStatus('配置就绪 ✓', 'success');
            updateConfigDisplay();
            return true;
        } catch (e) {
            console.error('配置初始化失败:', e);
            updateStatus(`配置失败: ${e.message}`, 'error');
            return false;
        }
    }

    function getUTC03Range() {
        const now = new Date();
        const y = now.getUTCFullYear(), m = now.getUTCMonth(), d = now.getUTCDate();
        let start = new Date(Date.UTC(y,m,d,3,0,0,0));
        if (now.getTime() < start.getTime()) start = new Date(start.getTime() - 24*3600*1000);
        const end = new Date(start.getTime() + 24*3600*1000 - 1000);
        return { startISO: start.toISOString(), endISO: end.toISOString(), text: `${start.toISOString()} → ${end.toISOString()}` };
    }

    function formatAmount(raw) {
        if (raw === null || raw === undefined || isNaN(Number(raw))) return '--';
        return Math.floor(Number(raw) / 100);
    }

    function addPanel() {
        if (document.getElementById(`${NS}_panel`)) return;
        const panel = document.createElement('div');
        panel.id = `${NS}_panel`;
        panel.className = `${NS}-panel`;
        panel.innerHTML = `
            <button class="${NS}-toggle" id="${NS}_toggle">×</button>
            <div class="${NS}-header">📊 CP 出款&充值统计</div>
            <div class="${NS}-meta">
                <div>API: <span id="${NS}_apiUrl">${CONFIG.apiBaseUrl || '--'}</span></div>
                <div>TenantID: <span id="${NS}_tenantId">${CONFIG.tenantId || '--'}</span></div>
                <div class="${NS}-cp-id">CoinPay渠道ID: <span id="${NS}_cpChannelId">${CONFIG.withdrawalChannels || '--'}</span></div>
                <div class="${NS}-tabid">标签页ID: ${currentTabId.substring(0, 20)}...</div>
            </div>

            <!-- 充值统计 -->
            <div class="${NS}-stat-row"><span>充值总额</span><span class="value" id="${NS}_payTotal">--</span></div>
            <div class="${NS}-stat-row"><span>充值人数</span><span class="value" id="${NS}_payUsers">--</span></div>

            <!-- 出款统计 -->
            <div class="${NS}-stat-row"><span>今日提现总金额</span><span class="value" id="${NS}_totalAmount">--</span></div>
            <div class="${NS}-stat-row"><span>今日CP出款比列</span><span class="value" id="${NS}_cpRatio">--</span></div>
            <div class="${NS}-stat-row"><span>今日充提差</span><span class="value" id="${NS}_chargeWithdrawDiff">--</span></div>

            <div style="margin-top:8px;">
                <button id="${NS}_start" class="${NS}-btn start">开始统计</button>
                <button id="${NS}_stop" class="${NS}-btn stop" style="display:none">停止统计</button>
                <button id="${NS}_clear" class="${NS}-btn clear">清理缓存</button>
            </div>

            <div class="${NS}-meta">
                <div>状态: <span id="${NS}_status" class="${NS}-loading">初始化中...</span></div>
                <div>最后更新: <span id="${NS}_last">--</span> &nbsp; 下次更新: <span id="${NS}_next">--</span></div>
            </div>
            
            <div class="${NS}-debug" id="${NS}_debug">
                <div>调试信息</div>
                <div id="${NS}_debugInfo"></div>
            </div>
        `;
        document.body.appendChild(panel);
        
        // 绑定事件
        document.getElementById(`${NS}_toggle`).addEventListener('click', togglePanel);
        document.getElementById(`${NS}_start`).addEventListener('click', start);
        document.getElementById(`${NS}_stop`).addEventListener('click', stop);
        document.getElementById(`${NS}_clear`).addEventListener('click', clearAll);
        
        // 双击header切换调试模式
        const headerEl = document.querySelector(`.${NS}-header`);
        if (headerEl) {
            headerEl.addEventListener('dblclick', function() {
                debugMode = !debugMode;
                document.getElementById(`${NS}_debug`).style.display = debugMode ? 'block' : 'none';
                console.log('调试模式:', debugMode ? '开启' : '关闭');
            });
        }
        
        updateHeaderStatus();
        updateConfigDisplay();
        
        // 初始禁用开始按钮
        const startBtn = document.getElementById(`${NS}_start`);
        if (startBtn) {
            startBtn.disabled = true;
        }
    }

    function togglePanel() {
        const p = document.getElementById(`${NS}_panel`);
        const isCollapsed = p.classList.toggle(`${NS}_collapsed`);
        const btn = document.getElementById(`${NS}_toggle`);
        btn.innerText = isCollapsed ? '≡' : '×';
    }

    function updateConfigDisplay() {
        const apiUrlEl = document.getElementById(`${NS}_apiUrl`);
        const tenantIdEl = document.getElementById(`${NS}_tenantId`);
        const cpChannelEl = document.getElementById(`${NS}_cpChannelId`);
        
        if (apiUrlEl) apiUrlEl.textContent = CONFIG.apiBaseUrl || '--';
        if (tenantIdEl) tenantIdEl.textContent = CONFIG.tenantId || '--';
        if (cpChannelEl) cpChannelEl.textContent = CONFIG.withdrawalChannels || '--';
    }

    function updateStatus(text, type = '') {
        const el = document.getElementById(`${NS}_status`);
        if (!el) return;
        
        el.textContent = text;
        el.className = '';
        if (type) el.classList.add(`${NS}-${type}`);
        
        // 更新调试信息
        if (debugMode) {
            updateDebugInfo(`状态更新: ${text} (${type || 'normal'})`);
        }
    }

    function updateDebugInfo(info) {
        const debugEl = document.getElementById(`${NS}_debugInfo`);
        if (!debugEl) return;
        
        const timestamp = new Date().toLocaleTimeString();
        debugEl.innerHTML = `<div>[${timestamp}] ${info}</div>` + debugEl.innerHTML;
        
        // 限制调试信息数量
        const items = debugEl.querySelectorAll('div');
        if (items.length > 20) {
            for (let i = 20; i < items.length; i++) {
                items[i].remove();
            }
        }
    }

    function renderStats(res) {
        const cpRatio = (res.cpUserCount && res.payUsers) ? ((res.cpUserCount / res.payUsers) * 100).toFixed(2) + '%' : '--';
        const chargeWithdrawDiff = (res.totalAmount && res.cpAmount && res.payTotal) 
            ? (((res.totalAmount - res.cpAmount) / res.payTotal) * 100).toFixed(2) + '%' 
            : '--';

        document.getElementById(`${NS}_totalAmount`).textContent = res.totalAmount ?? '--';
        document.getElementById(`${NS}_cpRatio`).textContent = cpRatio;
        document.getElementById(`${NS}_chargeWithdrawDiff`).textContent = chargeWithdrawDiff;

        document.getElementById(`${NS}_payTotal`).textContent = res.payTotal ?? '--';
        document.getElementById(`${NS}_payUsers`).textContent = res.payUsers ?? '--';

        document.getElementById(`${NS}_last`).textContent = new Date().toLocaleTimeString();
    }

    function updateHeaderStatus() {
        const s = document.getElementById(`${NS}_status`);
        const hasHeaders = checkHeadersCaptured();
        
        // 更新按钮状态
        const startBtn = document.getElementById(`${NS}_start`);
        if (startBtn) {
            startBtn.disabled = !hasHeaders;
            if (!hasHeaders) {
                startBtn.title = '请先触发API请求捕获headers（如点击页面上的数据查询）';
            } else {
                startBtn.title = '';
            }
        }
        
        if (s && !s.textContent.includes('初始化') && !isRunning) {
            s.textContent = hasHeaders ? '准备就绪' : '等待捕获头...';
            s.className = hasHeaders ? `${NS}-success` : `${NS}-loading`;
        }
    }

    function updateNextText() {
        const el = document.getElementById(`${NS}_next`);
        if (!el) return;
        el.textContent = isRunning ? new Date(Date.now() + CONFIG.refreshInterval).toLocaleTimeString() : '--';
    }

    /* ---------- 自动捕获 headers ---------- */
    function setupAutoCapture() {
        if (window.__cp_capture_installed) return;
        window.__cp_capture_installed = true;

        const nativeFetch = window.fetch;
        window.fetch = function(input, init) {
            try { 
                const req = new Request(input, init); 
                const headers = Object.fromEntries(req.headers.entries());
                const url = req.url;
                attemptCapture(headers, url);
            } catch(e){}
            return nativeFetch.apply(this, arguments);
        };

        const origOpen = XMLHttpRequest.prototype.open;
        const origSet = XMLHttpRequest.prototype.setRequestHeader;
        const origSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url) { 
            this.__cp_headers = {}; 
            this.__cp_url = url;
            return origOpen.apply(this, arguments); 
        };
        
        XMLHttpRequest.prototype.setRequestHeader = function(k,v){ 
            this.__cp_headers[k.toLowerCase()]=v; 
            return origSet.apply(this, arguments); 
        };
        
        XMLHttpRequest.prototype.send = function(){ 
            attemptCapture(this.__cp_headers, this.__cp_url); 
            return origSend.apply(this, arguments); 
        };
        
        console.log('headers捕获器已安装，标签页:', currentTabId);
    }

    function attemptCapture(headers, url) {
        if (!headers) return;
        
        const useful = {};
        if (headers['authorization']) useful['authorization']=headers['authorization'];
        if (headers['fingerprint-id']) useful['fingerprint-id']=headers['fingerprint-id'];
        if (headers['x-trace-id']) useful['x-trace-id']=headers['x-trace-id'];
        if (headers['cookie']) useful['cookie']=headers['cookie'];
        
        if (Object.keys(useful).length>0) {
            console.log('捕获到headers，标签页:', currentTabId, useful);
            const stored = {
                capturedAt: new Date().toISOString(),
                useful,
                all: headers,
                lastRequestUrl: url,
                tabId: currentTabId,
                domain: currentDomain
            };
            GM_setValue(CAPTURE_KEY, stored);
            
            // 如果URL中包含API路径，尝试提取API基础URL
            if (url && url.includes('/api/backend/')) {
                const extracted = extractApiBaseUrlFromRequest(url);
                if (extracted && extracted !== CONFIG.apiBaseUrl) {
                    CONFIG.apiBaseUrl = extracted;
                    console.log('捕获到新的API基础URL:', CONFIG.apiBaseUrl);
                    updateConfigDisplay();
                    
                    // 清除旧的配置，因为API域名变了
                    CONFIG.tenantId = null;
                    CONFIG.withdrawalChannels = null;
                    GM_deleteValue(CONFIG_KEY);
                    updateConfigDisplay();
                    isConfigReady = false;
                    updateStatus('API域名已变更，需要重新获取配置', 'loading');
                }
            }
            
            // 更新按钮状态
            updateHeaderStatus();
            
            // 如果之前配置未就绪，现在尝试初始化
            if (!isConfigReady) {
                initConfig().then(ready => {
                    if (ready) {
                        console.log('捕获headers后自动初始化配置成功');
                    }
                });
            }
        }
    }

    /**
     * 通用请求函数，使用当前标签页的headers
     */
    function gmFetchJson(url, timeout = 20000, maxRetries = 1) {
        return new Promise((resolve, reject) => {
            let attempt = 0;

            const doRequest = () => {
                attempt++;
                
                // 使用当前标签页的headers
                const stored = GM_getValue(CAPTURE_KEY, null);
                const headers = {'accept':'*/*','content-type':'application/json'};
                if (stored && stored.useful) {
                    Object.assign(headers, stored.useful);
                    console.log(`使用标签页 ${currentTabId} 的headers进行请求`);
                } else {
                    console.warn('当前标签页没有捕获到headers');
                }
                
                console.log(`请求 ${url} (尝试 ${attempt}/${maxRetries+1}) 标签页: ${currentTabId}`);
                
                try {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        headers: headers,
                        responseType: 'text',
                        timeout: timeout,
                        onload: function(res) {
                            console.log(`请求响应: ${res.status} ${url} 标签页: ${currentTabId}`);
                            
                            if (res.status === 401 || res.status === 403) {
                                console.warn('请求返回未授权:', res.status, '标签页:', currentTabId);
                                console.warn('使用的headers:', headers);
                                reject(new Error(`未授权（${res.status}），可能是token被其他标签页覆盖`));
                                return;
                            }

                            if (!(res.status >= 200 && res.status < 300)) {
                                const err = new Error(`HTTP ${res.status}`);
                                console.warn('请求失败:', res.status, url);
                                if (attempt <= maxRetries) {
                                    setTimeout(doRequest, 1000 * attempt);
                                } else {
                                    reject(err);
                                }
                                return;
                            }

                            try {
                                const parsed = JSON.parse(res.responseText);
                                resolve(parsed);
                            } catch (e) {
                                const err = new Error('响应 JSON 解析失败: ' + (e.message || e));
                                console.error('JSON解析失败:', e, '响应文本:', res.responseText.substring(0, 200));
                                if (attempt <= maxRetries) {
                                    setTimeout(doRequest, 1000 * attempt);
                                } else {
                                    reject(err);
                                }
                            }
                        },
                        onerror: function(err) {
                            console.error('GM_xmlhttpRequest 网络错误:', err, '标签页:', currentTabId);
                            const e = new Error('GM_xmlhttpRequest 网络错误');
                            if (attempt <= maxRetries) {
                                setTimeout(doRequest, 1000 * attempt);
                            } else {
                                reject(e);
                            }
                        },
                        ontimeout: function() {
                            console.error('GM_xmlhttpRequest 超时:', url, '标签页:', currentTabId);
                            const e = new Error('GM_xmlhttpRequest 超时');
                            if (attempt <= maxRetries) {
                                setTimeout(doRequest, 1000 * attempt);
                            } else {
                                reject(e);
                            }
                        }
                    });
                } catch (e) {
                    console.error('GM_xmlhttpRequest 调用异常:', e);
                    reject(new Error('GM_xmlhttpRequest 调用异常: ' + (e.message || e)));
                }
            };

            doRequest();
        });
    }

    /* ---------- 构造URL ---------- */
    function buildUrlForTotalWithdraw(page=1) {
        const range=getUTC03Range();
        const payload={json:{page,pageSize:CONFIG.pageSize,status:"success",queryTimeType:"completeTime",regionId:1,tenantId:CONFIG.tenantId,startTime:range.startISO,endTime:range.endISO,startTimeUTC:range.startISO,endTimeUTC:range.endISO}};
        return `${CONFIG.apiBaseUrl}${CONFIG.withdrawalPath}?input=${encodeURIComponent(JSON.stringify(payload))}`;
    }
    
    function buildUrlForWithdraw(page=1) {
        const range=getUTC03Range();
        const payload={json:{page,pageSize:CONFIG.pageSize,status:"success",queryTimeType:"completeTime",regionId:1,tenantId:CONFIG.tenantId,withdrawalChannels:CONFIG.withdrawalChannels,startTime:range.startISO,endTime:range.endISO,startTimeUTC:range.startISO,endTimeUTC:range.endISO}};
        return `${CONFIG.apiBaseUrl}${CONFIG.withdrawalPath}?input=${encodeURIComponent(JSON.stringify(payload))}`;
    }
    
    function buildUrlForPay() {
        const range = getUTC03Range();
        const payload={json:{queryType:'statistics',page:1,pageSize:50,status:'PAID',timeType:'createTime',regionId:1,tenantId:CONFIG.tenantId,startTime:range.startISO,endTime:range.endISO,tableType:'all'}};
        return `${CONFIG.apiBaseUrl}${CONFIG.payPath}?input=${encodeURIComponent(JSON.stringify(payload))}`;
    }

    /* ---------- 获取充值数据 ---------- */
    async function fetchPayData() {
        if (!isConfigReady) {
            console.warn('配置未就绪，跳过获取充值数据');
            return { payTotal: '--', payCount: '--', payUsers: '--' };
        }
        
        try {
            const url = buildUrlForPay();
            const json = await gmFetchJson(url);

            const totalInfo = json?.result?.data?.json?.totalInfo
                || json?.data?.json?.totalInfo
                || json?.result?.data?.totalInfo
                || json?.result?.data?.json?.total
                || null;

            if (!totalInfo) {
                console.warn('fetchPayData: 未在响应中找到 totalInfo', json);
                return { payTotal: '--', payCount: '--', payUsers: '--' };
            }
            
            const possibleAmountFields = ['totalPayAmount', 'totalAmount', 'amount', 'payAmount', 'totalPay'];
            let totalPayRaw = 0;
            
            for (const field of possibleAmountFields) {
                if (totalInfo[field] !== undefined) {
                    totalPayRaw = Number(totalInfo[field]);
                    break;
                }
            }
            
            const totalCount = Number(totalInfo.total ?? totalInfo.count ?? totalInfo.payCount ?? 0);
            const totalUsers = Number(totalInfo.totalUser ?? totalInfo.userCount ?? totalInfo.payUsers ?? 0);

            const safeTotalPay = isNaN(totalPayRaw) ? 0 : totalPayRaw;
            const safeCount = isNaN(totalCount) ? 0 : totalCount;
            const safeUsers = isNaN(totalUsers) ? 0 : totalUsers;

            return {
                payTotal: formatAmount(safeTotalPay),
                payCount: safeCount,
                payUsers: safeUsers
            };
        } catch (e) {
            console.warn('拉取充值失败:', e);
            return { payTotal: '--', payCount: '--', payUsers: '--' };
        }
    }

    /* ---------- 聚合今日coinpay出款统计 ---------- */
    async function fetchWithdrawData() {
        if (!isConfigReady) {
            console.warn('配置未就绪，跳过获取出款数据');
            return { totalAmount: '--', cpAmount: '--', cpUserCount: '--' };
        }
        
        try {
            const range = getUTC03Range();

            async function fetchTotalWithdraw() {
                let page = 1;
                let totalAmountRaw = 0;
                const pageSize = CONFIG.pageSize;

                while (true) {
                    const payload = {
                        json: {
                            page,
                            pageSize,
                            status: "success",
                            queryTimeType: "completeTime",
                            regionId: 1,
                            tenantId: CONFIG.tenantId,
                            startTime: range.startISO,
                            endTime: range.endISO,
                            startTimeUTC: range.startISO,
                            endTimeUTC: range.endISO
                        }
                    };

                    const url = `${CONFIG.apiBaseUrl}${CONFIG.withdrawalPath}?input=${encodeURIComponent(JSON.stringify(payload))}`;
                    const json = await gmFetchJson(url);
                    const items = json?.result?.data?.json?.queryData ?? [];

                    for (const it of items) {
                        totalAmountRaw += Number(it.actualWithdrawals ?? it.amount ?? 0);
                    }

                    if (items.length < pageSize) break;
                    page++;
                }

                return totalAmountRaw;
            }

            async function fetchCoinPayWithdraw() {
                let page = 1;
                let cpAmountRaw = 0;
                const cpUsers = new Set();
                const pageSize = CONFIG.pageSize;

                while (true) {
                    const payload = {
                        json: {
                            page,
                            pageSize,
                            status: "success",
                            queryTimeType: "completeTime",
                            regionId: 1,
                            tenantId: CONFIG.tenantId,
                            withdrawalChannels: CONFIG.withdrawalChannels,
                            startTime: range.startISO,
                            endTime: range.endISO,
                            startTimeUTC: range.startISO,
                            endTimeUTC: range.endISO
                        }
                    };

                    const url = `${CONFIG.apiBaseUrl}${CONFIG.withdrawalPath}?input=${encodeURIComponent(JSON.stringify(payload))}`;
                    const json = await gmFetchJson(url);
                    const items = json?.result?.data?.json?.queryData ?? [];

                    for (const it of items) {
                        cpAmountRaw += Number(it.actualWithdrawals ?? it.amount ?? 0);
                        if (it.userId) cpUsers.add(String(it.userId));
                    }

                    if (items.length < pageSize) break;
                    page++;
                }

                return { cpAmountRaw, cpUsers };
            }

            const totalAmountRaw = await fetchTotalWithdraw();
            const { cpAmountRaw, cpUsers } = await fetchCoinPayWithdraw();

            return {
                totalAmount: formatAmount(totalAmountRaw),
                cpAmount: formatAmount(cpAmountRaw),
                cpUserCount: cpUsers.size
            };

        } catch (e) {
            console.warn('拉取出款失败', e);
            return { totalAmount: '--', cpAmount: '--', cpUserCount: '--' };
        }
    }

    async function collectAndCompute() {
        if (!isConfigReady) {
            console.warn('配置未就绪，跳过数据收集');
            return { result: {}, range: '--' };
        }
        
        const [withdraw,pay] = await Promise.all([fetchWithdrawData(), fetchPayData()]);
        const result = {...withdraw,...pay};
        
        dataHistory.push({ts:Date.now(),range:getUTC03Range().text,data:result});
        GM_setValue(`${NS}_dataHistory`, dataHistory.slice(-50));
        return {result, range:getUTC03Range().text};
    }

    async function autoRefresh() {
        if(!headersCaptured) {
            updateStatus('等待捕获headers...', 'loading');
            return;
        }
        
        if (!isConfigReady) {
            const ready = await initConfig();
            if (!ready) {
                updateStatus('配置初始化失败', 'error');
                return;
            }
        }
        
        updateNextText();
        try{
            updateStatus('正在更新数据...', 'loading');
            const {result,range} = await collectAndCompute();
            renderStats(result,range);
            updateStatus('数据已更新 ✓', 'success');
        }catch(e){ 
            console.error('自动刷新失败',e);
            updateStatus('更新失败', 'error');
        }
    }

    async function start() {
        console.log('点击开始统计按钮，标签页:', currentTabId);
        
        // 检查headers是否已捕获
        if(!checkHeadersCaptured()){ 
            alert('请先触发任意 API 请求以捕获头信息（如点击页面上的数据查询）'); 
            return; 
        }
        
        if(isRunning) {
            console.log('已经在运行中');
            return;
        }
        
        // 初始化配置
        updateStatus('初始化配置...', 'loading');
        const ready = await initConfig();
        if (!ready) {
            alert('配置初始化失败，请刷新页面后重试');
            return;
        }
        
        isRunning = true;
        
        const startBtn = document.getElementById(`${NS}_start`);
        const stopBtn = document.getElementById(`${NS}_stop`);
        
        if (startBtn) startBtn.style.display = 'none';
        if (stopBtn) stopBtn.style.display = 'block';
        
        // 立即执行一次
        await autoRefresh();
        
        // 设置定时器
        autoInterval = setInterval(autoRefresh, CONFIG.refreshInterval);
    }

    function stop() {
        if(!isRunning) return;
        isRunning = false;
        
        if (autoInterval) {
            clearInterval(autoInterval);
            autoInterval = null;
        }
        
        const startBtn = document.getElementById(`${NS}_start`);
        const stopBtn = document.getElementById(`${NS}_stop`);
        
        if (startBtn) startBtn.style.display = 'block';
        if (stopBtn) stopBtn.style.display = 'none';
        
        updateNextText();
        updateStatus('已停止', '');
    }

    function clearAll() {
        if (confirm('确定要清除所有缓存数据吗？\n这包括：\n- 数据历史记录\n- 当前标签页的配置\n- 当前标签页的Headers')) {
            apiCache = {};
            dataHistory = [];
            GM_deleteValue(`${NS}_dataHistory`);
            
            // 清除当前标签页的配置
            GM_deleteValue(CAPTURE_KEY);
            GM_deleteValue(CONFIG_KEY);
            
            // 重置配置
            CONFIG.apiBaseUrl = '';
            CONFIG.tenantId = null;
            CONFIG.withdrawalChannels = null;
            isConfigReady = false;
            headersCaptured = false;
            
            renderStats({ totalAmount:'--', cpAmount:'--', cpUserCount:'--', payTotal:'--', payCount:'--', payUsers:'--' }, '--');
            updateConfigDisplay();
            updateHeaderStatus();
            updateStatus('缓存已清除', 'success');
            
            // 重新启用按钮
            const startBtn = document.getElementById(`${NS}_start`);
            if (startBtn) {
                startBtn.disabled = true;
            }
        }
    }

    // 初始化函数
    function init() {
        console.log('脚本初始化，标签页:', currentTabId);
        
        // 清理过期的标签页数据
        cleanupExpiredTabs();
        
        addPanel();
        setupAutoCapture();
        
        // 检查初始状态
        setTimeout(() => {
            const hasHeaders = checkHeadersCaptured();
            if (hasHeaders) {
                console.log('检测到已有headers');
                updateHeaderStatus();
                
                // 尝试自动初始化配置
                initConfig().then(ready => {
                    if (ready) {
                        const startBtn = document.getElementById(`${NS}_start`);
                        if (startBtn) {
                            startBtn.disabled = false;
                        }
                        updateStatus('准备就绪 ✓', 'success');
                    }
                });
            } else {
                console.log('尚未捕获headers');
                updateStatus('等待捕获headers...', 'loading');
            }
        }, 500);
    }

    // 启动脚本
    init();
})();