// ==UserScript==
// @name         TikTok Boosted Materials - Full Suite with Automation
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  【稳定重构版】以v2.6为基础，恢复了被破坏的复选框功能，并重新正确集成了自动化删除模块。确保所有功能稳定共存。
// @author       You & Gemini
// @match        https://ads.tiktok.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      ads.tiktok.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549534/TikTok%20Boosted%20Materials%20-%20Full%20Suite%20with%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/549534/TikTok%20Boosted%20Materials%20-%20Full%20Suite%20with%20Automation.meta.js
// ==/UserScript==

(function() {
    'use strict';
    try { console.log('[BOOT] userscript IIFE entered'); } catch (e) {}
    let hasInitialized = false;
    window.addEventListener('error', function(e){
        try { console.error('[ERROR] window', e.error || e.message || e); } catch(_) {}
    });

    // --- 全局变量 ---
    const ITEMS_PER_PAGE = 20;
    let selectedVidsForBoosting = new Set();
    let globalBoostedVidSet = new Set();
    let globalBoostingVidSet = new Set();
    let globalPeriodicCheckInterval = null;
    let tableObserver = null;
    let autoDeleteIntervalId = null; // 用于存储自动化定时器的ID

    // --- 核心功能 1: UI与通知 ---
    function showNotification(message, type = 'info', duration = 3000) {
        console.log(`[Notify:${type}]`, message);
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: ${type === 'error' ? '#ff4757' : (type === 'success' ? '#2ed573' : (type === 'warning' ? '#ffbe76' : '#4a69bd'))};
            color: white; padding: 12px 24px; border-radius: 6px; z-index: 10001;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: opacity 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    // --- 任务注册表与全域定时器管理 ---
    const REGISTRY_KEY = 'autoDeleteTaskRegistry';
    const taskTimers = new Map(); // key => { intervalId, settings }

    // --- URL检测与面板显示控制 ---
    function shouldDisplayTaskPanel() {
        const currentUrl = window.location.href;
        // 检查是否在GMV Max路径下（包括所有子页面）
        const gmvMaxPattern = /https:\/\/ads\.tiktok\.com\/i18n\/gmv-max\//;
        return gmvMaxPattern.test(currentUrl);
    }

    function getTaskKeyFromParams(params) {
        if (!params || !params.campaign_id || !params.product_id) return null;
        return `${params.campaign_id}:${params.product_id}`;
    }

    function renderTaskOverview() {
        // 只有在应该显示面板的页面才渲染任务总览
        if (!shouldDisplayTaskPanel()) {
            console.log('[UI] 非GMV Max产品页面，跳过任务总览渲染');
            return;
        }

        const container = document.getElementById('task-overview-container');
        if (!container) return;
        const registry = loadTaskRegistry();
        const entries = Object.values(registry);
        if (entries.length === 0) {
            container.innerHTML = '<div style="color:#6c757d">暂无已登记的自动化任务。在产品详情页保存设置后将出现在此处。</div>';
            return;
        }
        container.innerHTML = '';
        // 按 campaign 分组
        const grouped = entries.reduce((acc, t) => {
            const key = t.campaign_id || 'unknown';
            if (!acc[key]) acc[key] = [];
            acc[key].push(t);
            return acc;
        }, {});
        Object.keys(grouped).forEach(async campaignId => {
            const groupDiv = document.createElement('div');
            groupDiv.style.cssText = 'border:1px solid #e9ecef;border-radius:6px;padding:10px;margin-bottom:8px;background:#fff;';
            const header = document.createElement('details');
            header.open = true;
            header.style.cssText = 'font-weight:bold;margin-bottom:6px;';
            const summary = document.createElement('summary');
            summary.style.cssText = 'cursor:pointer;';
            // 优先显示广告系列名称（如有），否则显示ID
            const firstTask = grouped[campaignId][0];
            let campaignDisplayName = (firstTask && firstTask.campaign_name) ? firstTask.campaign_name : null;
            if (!campaignDisplayName) {
                try {
                    const csrf = getCsrfToken();
                    const url = `https://ads.tiktok.com/api/oec_shopping/v1/creation/all_ad_data/detail?locale=en&language=en&oec_seller_id=${firstTask.oec_seller_id}&aadvid=${firstTask.aadvid}&bc_id=${firstTask.bc_id}&campaign_id=${campaignId}`;
                    const resp = await sendGetRequest(url, csrf);
                    if (resp && resp.code === 0 && resp.data && resp.data.campaign_info && resp.data.campaign_info.campaign_name) {
                        campaignDisplayName = resp.data.campaign_info.campaign_name;
                        // 回写到注册表缓存
                        const registry = loadTaskRegistry();
                        grouped[campaignId].forEach(t => { t.campaign_name = campaignDisplayName; if (registry[t.key]) registry[t.key].campaign_name = campaignDisplayName; });
                        saveTaskRegistry(registry);
                        // 立即更新标题显示
                        summary.textContent = campaignDisplayName;
                    }
                } catch (e) { console.warn('[CampaignName] 获取失败', campaignId, e); }
            }
            summary.textContent = campaignDisplayName || `Campaign: ${campaignId}`;
            header.appendChild(summary);
            groupDiv.appendChild(header);

            const contentWrap = document.createElement('div');
            contentWrap.style.cssText = 'margin-top:6px;';
            header.appendChild(contentWrap); // 内容放入 details 内部，才能被折叠

            grouped[campaignId].forEach(t => {
                const nextRunText = t.metrics && t.metrics.nextRunAt ? new Date(t.metrics.nextRunAt).toLocaleString() : '—';
                const lastRunText = t.metrics && t.metrics.lastRunAt ? new Date(t.metrics.lastRunAt).toLocaleString() : '—';
                const lastDel = t.metrics && typeof t.metrics.lastDeletedCount === 'number' ? t.metrics.lastDeletedCount : 0;
                const err = t.metrics && t.metrics.lastError ? t.metrics.lastError : '';
                const createdAtText = t.createdAt ? new Date(t.createdAt).toLocaleString() : '—';
                const runCountText = t.metrics && typeof t.metrics.runCount === 'number' ? t.metrics.runCount : 0;
                const row = document.createElement('div');
                row.style.cssText = 'display:flex;flex-direction:column;gap:6px;align-items:flex-start;border-top:1px dashed #eee;padding-top:8px;margin-top:8px;';
                row.innerHTML = `
                    <div style="font-weight:600">Campaign: ${campaignId}</div>
                    <div>Product: ${t.product_id}</div>
                    <div>enabled: ${t.settings.enabled ? 'Yes' : 'No'}</div>
                    <div>下次运行: ${nextRunText}</div>
                    <div>周期: ${t.settings.hours}h ${t.settings.minutes}m</div>
                    <div>上次运行: ${lastRunText}</div>
                    <div>创建时间: ${createdAtText}</div>
                    <div>总运行次数: ${runCountText}</div>
                    <div>阈值: ${t.settings.costThreshold}</div>
                    <div>上次删除: ${lastDel}</div>
                    <div style="color:${err ? '#dc3545' : '#6c757d'};font-size:12px;max-width:100%;">${err ? ('错误: ' + err) : '无错误'}</div>
                    <div style="display:flex;gap:6px;margin-top:6px;">
                        <button data-action="toggle" data-key="${t.key}" style="padding:6px 10px;background:${t.settings.enabled ? '#ffc107' : '#28a745'};color:#fff;border:none;border-radius:4px;cursor:pointer;">${t.settings.enabled ? '停止' : '启动'}</button>
                        <button data-action="refresh" data-key="${t.key}" style="padding:6px 10px;background:#17a2b8;color:#fff;border:none;border-radius:4px;cursor:pointer;">立即运行</button>
                        <button data-action="remove" data-key="${t.key}" style="padding:6px 10px;background:#6c757d;color:#fff;border:none;border-radius:4px;cursor:pointer;">移除</button>
                    </div>
                `;
                contentWrap.appendChild(row);
            });
            container.appendChild(groupDiv);
        });

        container.querySelectorAll('button[data-action]').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const key = e.currentTarget.getAttribute('data-key');
                const action = e.currentTarget.getAttribute('data-action');
                const registry = loadTaskRegistry();
                const t = registry[key];
                if (!t) return;
                if (action === 'toggle') {
                    t.settings.enabled = !t.settings.enabled;
                    saveTaskRegistry(registry);
                    if (t.settings.enabled) startTaskTimer(t); else stopTaskTimer(key);
                    renderTaskOverview();
                } else if (action === 'refresh') {
                    await runAutoDeleteCycleForTask(t);
                    renderTaskOverview();
                } else if (action === 'remove') {
                    stopTaskTimer(key);
                    delete registry[key];
                    saveTaskRegistry(registry);
                    renderTaskOverview();
                }
            });
        });
    }

    function bootstrapAllTaskTimers() {
        const registry = loadTaskRegistry();
        Object.values(registry).forEach(t => {
            if (t.settings && t.settings.enabled) {
                // 检查定时器是否已存在，避免重复启动
                if (!taskTimers.has(t.key)) {
                    startTaskTimer(t);
                } else {
                    console.log('[Bootstrap] 定时器已存在，跳过:', t.key);
                }
            }
        });
    }

    function loadTaskRegistry() {
        const registry = GM_getValue(REGISTRY_KEY, {});
        return registry && typeof registry === 'object' ? registry : {};
    }

    function saveTaskRegistry(registry) {
        GM_setValue(REGISTRY_KEY, registry || {});
    }

    function upsertTaskIntoRegistry(task) {
        const registry = loadTaskRegistry();
        const existing = registry[task.key];
        registry[task.key] = {
            key: task.key,
            aadvid: task.aadvid,
            oec_seller_id: task.oec_seller_id,
            bc_id: task.bc_id,
            campaign_id: task.campaign_id,
            product_id: task.product_id,
            campaign_name: task.campaign_name || (existing && existing.campaign_name) || undefined,
            settings: task.settings || { enabled: false, hours: 4, minutes: 0, costThreshold: 1.0 },
            createdAt: (existing && existing.createdAt) || Date.now(),
            metrics: task.metrics || (existing && existing.metrics) || { lastRunAt: null, nextRunAt: null, lastDeletedCount: 0, lastError: null, runCount: 0 }
        };
        saveTaskRegistry(registry);
        return registry[task.key];
    }

    function updateTaskMetrics(taskKey, updater) {
        const registry = loadTaskRegistry();
        const task = registry[taskKey];
        if (!task) return;
        task.metrics = { ...(task.metrics || {}), ...updater };
        saveTaskRegistry(registry);
    }

    function incrementTaskRunCount(taskKey) {
        const registry = loadTaskRegistry();
        const task = registry[taskKey];
        if (!task) return;
        const metrics = task.metrics || {};
        metrics.runCount = (metrics.runCount || 0) + 1;
        task.metrics = metrics;
        saveTaskRegistry(registry);
    }

    // --- 核心功能 2: 参数与缓存管理 ---
    function getUrlParams() {
        try { console.log('[Init] getUrlParams from', window.location.href); } catch (e) {}
        const urlParams = new URLSearchParams(window.location.search);
        return {
            aadvid: urlParams.get('aadvid'), oec_seller_id: urlParams.get('oec_seller_id'),
            bc_id: urlParams.get('bc_id'), campaign_id: urlParams.get('campaign_id'),
            product_id: urlParams.get('product_id'), list_start_date: urlParams.get('list_start_date'),
            list_end_date: urlParams.get('list_end_date')
        };
    }

    function getCsrfToken() {
        const match = document.cookie.match(/csrftoken=([^;]+)/);
        console.log('[Init] csrftoken found:', !!match);
        return match ? match[1] : null;
    }

    function getCacheKey() {
        const params = getUrlParams();
        if (params.campaign_id && params.product_id) {
            return `boost_status_cache_${params.campaign_id}_${params.product_id}`;
        }
        return null;
    }

    function saveDataToCache(data) {
        const cacheKey = getCacheKey();
        if (cacheKey) {
            console.log('[Cache] save', cacheKey, data);
            sessionStorage.setItem(cacheKey, JSON.stringify(data));
        }
    }

    function loadDataFromCache() {
        const cacheKey = getCacheKey();
        if (cacheKey) {
            const cachedData = sessionStorage.getItem(cacheKey);
            console.log('[Cache] load', cacheKey, !!cachedData);
            if (cachedData) { return JSON.parse(cachedData); }
        }
        return null;
    }

    // --- 核心功能 3: API请求模块 ---
    function sendApiRequest(url, requestBody, csrfToken) {
        return new Promise((resolve, reject) => {
            console.log('[API] POST', url, requestBody);
            GM_xmlhttpRequest({
                method: "POST", url: url,
                headers: {
                    "accept": "application/json, text/plain, */*", "content-type": "application/json; charset=UTF-8",
                    "x-csrftoken": csrfToken, "referrer": window.location.href,
                },
                data: JSON.stringify(requestBody),
                onload: function(response) {
                    console.log('[API] RESP', url, response.status);
                    if (response.status >= 200 && response.status < 300) {
                        try { resolve(JSON.parse(response.responseText)); } catch (e) { reject(new Error("JSON解析失败: " + e.message)); }
                    } else { reject(new Error(`HTTP错误 ${response.status}: ${response.responseText}`)); }
                },
                onerror: (error) => { console.error('[API] ERROR', url, error); reject(new Error("网络错误: " + error.statusText)); },
                ontimeout: () => { console.error('[API] TIMEOUT', url); reject(new Error("请求超时")); }
            });
        });
    }

    // GET 简易封装（复用 GM_xmlhttpRequest），用于取 campaign 名称
    function sendGetRequest(url, csrfToken) {
        return new Promise((resolve, reject) => {
            console.log('[API] GET', url);
            GM_xmlhttpRequest({
                method: 'GET', url,
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'x-csrftoken': csrfToken,
                    'referrer': window.location.href
                },
                onload: function(response) {
                    console.log('[API] RESP', url, response.status);
                    if (response.status >= 200 && response.status < 300) {
                        try { resolve(JSON.parse(response.responseText)); } catch (e) { reject(new Error('JSON解析失败: ' + e.message)); }
                    } else { reject(new Error(`HTTP错误 ${response.status}: ${response.responseText}`)); }
                },
                onerror: (error) => { console.error('[API] ERROR', url, error); reject(new Error('网络错误: ' + error.statusText)); },
                ontimeout: () => { console.error('[API] TIMEOUT', url); reject(new Error('请求超时')); }
            });
        });
    }

    function getDateRange(params) {
        let startTime, endTime;
        if (params.list_start_date && params.list_end_date) {
            startTime = new Date(parseInt(params.list_start_date)).toISOString().split('T')[0];
            endTime = new Date(parseInt(params.list_end_date)).toISOString().split('T')[0];
        } else {
            const today = new Date();
            const defaultStart = new Date();
            defaultStart.setDate(today.getDate() - 30);
            const defaultEnd = new Date();
            defaultEnd.setDate(today.getDate() + 30);
            startTime = defaultStart.toISOString().split('T')[0];
            endTime = defaultEnd.toISOString().split('T')[0];
        }
        return { startTime, endTime };
    }

    async function queryMaterials(params, csrfToken, boostStatusList, notificationMsg, consoleMsg) {
        const { startTime, endTime } = getDateRange(params);
        const baseUrl = `https://ads.tiktok.com/api/oec_shopping/v1/oec/stat/post_creative_list?locale=en&language=en&oec_seller_id=${params.oec_seller_id}&aadvid=${params.aadvid}&bc_id=${params.bc_id}`;
        let allMaterials = [], currentPage = 1, totalPages = 1;
        if (notificationMsg) showNotification(`${notificationMsg} (第 1 页)...`, 'info');
        try {
            const requestBodyTemplate = {
                query_list: ["item_delivery_secondary_status", "material_name", "material_video_info", "tt_account_name", "item_id", "mixed_real_cost", "roi2_show_cnt", "roi2_click_cnt"],
                start_time: startTime, end_time: endTime, order_field: "mixed_real_cost", order_type: 1, page: currentPage,
                page_size: ITEMS_PER_PAGE, campaign_id: params.campaign_id, spu_id_list: [params.product_id],
                api_version: 2, item_delivery_status_list: [], item_boost_status_list: boostStatusList
            };
            const firstResponse = await sendApiRequest(baseUrl, requestBodyTemplate, csrfToken);
            console.log('[Query] first page done');
            if (firstResponse?.data?.pagination) {
                const totalCount = firstResponse.data.pagination.total_count || 0;
                totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;
                allMaterials = allMaterials.concat(firstResponse.data.table || []);
            } else { return []; }
            for (currentPage = 2; currentPage <= totalPages; currentPage++) {
                if (notificationMsg) showNotification(`${notificationMsg} (第 ${currentPage}/${totalPages} 页)...`, 'info');
                const subsequentRequestBody = { ...requestBodyTemplate, page: currentPage };
                const subsequentResponse = await sendApiRequest(baseUrl, subsequentRequestBody, csrfToken);
                if (subsequentResponse?.data?.table) allMaterials = allMaterials.concat(subsequentResponse.data.table);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            return allMaterials;
        } catch (error) {
            console.error('[Query] fail', consoleMsg, error);
            if (notificationMsg) showNotification(`查询 ${consoleMsg} 素材失败: ` + error.message, 'error');
            return [];
        }
    }

    // --- 核心功能 4: 页面DOM操作与渲染 ---
    // ★★★ 已恢复的、功能正常的processTableRow函数 ★★★
    function processTableRow(row) {
        if (!row || !row.querySelector) { console.warn('[DOM] skip invalid row'); return; }
        if (!row || !row.querySelector) return;
        const vidSpan = row.querySelector('.sub-title-Smyy');
        const vidMatch = vidSpan ? vidSpan.textContent.match(/Video:\s*(\d+)/) : null;
        if (!vidMatch) { /* console.debug('[DOM] no vid in row'); */ return; }
        const vid = vidMatch[1];

        if (!vidSpan.dataset.highlighted) {
             const oldClickListener = vidSpan.__customClickListener;
            if (oldClickListener) vidSpan.removeEventListener('click', oldClickListener);
            vidSpan.style.color = '';
            vidSpan.style.fontWeight = 'normal';
            vidSpan.style.cursor = 'default';
            if (globalBoostedVidSet.has(vid)) {
                vidSpan.style.color = 'red';
                vidSpan.style.fontWeight = 'bold';
                vidSpan.style.cursor = 'pointer';
            } else if (globalBoostingVidSet.has(vid)) {
                vidSpan.style.color = 'green';
                vidSpan.style.fontWeight = 'bold';
                vidSpan.style.cursor = 'pointer';
            }
            const newClickListener = (event) => {
                event.stopPropagation();
                showSessionInfoBubble(vidSpan, vid);
            };
            vidSpan.addEventListener('click', newClickListener);
            vidSpan.__customClickListener = newClickListener;
            vidSpan.dataset.highlighted = 'true';
        }

        const avatarContainer = row.querySelector('div[data-tid="m4b_avatar"]');
        if (avatarContainer && !avatarContainer.dataset.checkboxInjected) {
            // console.log('[DOM] inject checkbox for vid', vid);
            const imageSpan = avatarContainer.querySelector('.theme-m4b-avatar-image');
            const maskDiv = avatarContainer.querySelector('.theme-m4b-avatar-image-mask');
            if(imageSpan) imageSpan.style.display = 'none';
            if(maskDiv) maskDiv.style.display = 'none';
            avatarContainer.style.position = 'relative';
            const checkboxWrapper = document.createElement('div');
            checkboxWrapper.className = 'boosting-checkbox-container';
            checkboxWrapper.style.cssText = `position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; cursor: pointer; background-color: rgba(240, 242, 245, 0.8); border-radius: 50%;`;
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = vid;
            checkbox.checked = selectedVidsForBoosting.has(vid);
            checkbox.className = 'boosting-checkbox';
            checkbox.style.cssText = `cursor: pointer; width: 16px; height: 16px; accent-color: #007bff; margin: 0;`;
            checkbox.addEventListener('change', () => {
                console.log('[Select] change', vid, checkbox.checked);
                if (checkbox.checked) selectedVidsForBoosting.add(vid); else selectedVidsForBoosting.delete(vid);
            });
            checkboxWrapper.addEventListener('click', (e) => {
                if (e.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            });
            checkboxWrapper.appendChild(checkbox);
            avatarContainer.appendChild(checkboxWrapper);
            avatarContainer.dataset.checkboxInjected = 'true';
        }
    }

    function activatePageElementProcessing() {
        // 立即处理一次现有行
        const tableBody = document.querySelector('.theme-arco-table-body');
        if (tableBody) {
            tableBody.querySelectorAll('.theme-arco-table-tr.creative-table-row-UWxp').forEach(processTableRow);
        }
        // 启动基于 MutationObserver 的监听，替代 1s 轮询
        if (tableObserver) { try { tableObserver.disconnect(); } catch(_) {} }
        tableObserver = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.type === 'childList') {
                    m.addedNodes && m.addedNodes.forEach(node => {
                        if (node && node.nodeType === 1) {
                            if (node.classList && node.classList.contains('theme-arco-table-tr') && node.classList.contains('creative-table-row-UWxp')) {
                                processTableRow(node);
                            } else {
                                // 可能是容器级别变化，做一次局部扫描
                                const rows = node.querySelectorAll ? node.querySelectorAll('.theme-arco-table-tr.creative-table-row-UWxp') : [];
                                rows && rows.forEach(processTableRow);
                            }
                        }
                    });
                }
            }
        });
        if (tableBody) {
            tableObserver.observe(tableBody, { childList: true, subtree: true });
            console.log('[DOM] table observer started');
        }

        // 添加定期检查，确保复选框不会因为筛选而消失
        if (globalPeriodicCheckInterval) clearInterval(globalPeriodicCheckInterval);
        globalPeriodicCheckInterval = setInterval(() => {
            const tableBody = document.querySelector('.theme-arco-table-body');
            if (tableBody) {
                tableBody.querySelectorAll('.theme-arco-table-tr.creative-table-row-UWxp').forEach(processTableRow);
            }
        }, 2000); // 每2秒检查一次
    }

    async function showSessionInfoBubble(targetElement, vid) {
        document.querySelectorAll('.session-info-bubble').forEach(bubble => bubble.remove());
        showNotification(`正在获取 VID ${vid} 的会话信息 (过去30天)...`, 'info');
        const params = getUrlParams();
        const csrfToken = getCsrfToken();
        if (!csrfToken) { showNotification('无法获取CSRF token', 'error'); return; }
        const endDate = new Date(), startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);
        const requestBody = {
            "query_list": ["session_info", "mixed_real_cost"], "start_time": startDate.toISOString().split('T')[0], "end_time": endDate.toISOString().split('T')[0],
            "page": 1, "page_size": 100, "spu_id_list": [params.product_id], "campaign_id": params.campaign_id,
            "gmv_max_bid_type": 3, "item_id": [vid]
        };
        const sessionApiUrl = `https://ads.tiktok.com/api/oec_shopping/v1/oec/stat/post_session_list?locale=en&language=en&oec_seller_id=${params.oec_seller_id}&aadvid=${params.aadvid}&bc_id=${params.bc_id}`;
        try {
            const response = await sendApiRequest(sessionApiUrl, requestBody, csrfToken);
            if (response?.data?.table && response.data.table.length > 0) {
                let sessionsHtml = response.data.table.map(sessionData => {
                    const sessionInfo = sessionData.session_info;
                    let statusText = '未知', statusColor = '#6c757d';
                    if (sessionInfo.status === 1) { statusText = '活跃中'; statusColor = '#28a745'; }
                    else if (sessionInfo.status === 0) { statusText = '已过期'; statusColor = '#6c757d'; }
                    return `<div style="margin-bottom: 8px; border-bottom: 1px dashed #eee; padding-bottom: 5px;">
                                <p style="margin: 0;"><strong>会话ID:</strong> ${sessionData.gmv_max_session_id || 'N/A'}</p>
                                <p style="margin: 0;"><strong>状态:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
                                <p style="margin: 0;"><strong>花费:</strong> ${sessionData.mixed_real_cost || 'N/A'}</p>
                           </div>`;
                }).join('');
                const bubble = document.createElement('div');
                bubble.className = 'session-info-bubble';
                bubble.style.cssText = `position: absolute; background-color: white; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 15px; max-width: 300px; z-index: 10003; font-size: 13px; line-height: 1.5; color: #333;`;
                bubble.innerHTML = `<div style="font-weight: bold; margin-bottom: 10px;">会话信息 (VID: ${vid})</div>${sessionsHtml}<button class="close-bubble-button" style="position: absolute; top: 5px; right: 5px; background: none; border: none; font-size: 18px; cursor: pointer;">×</button>`;
                document.body.appendChild(bubble);
                const rect = targetElement.getBoundingClientRect();
                bubble.style.top = `${rect.top + window.scrollY}px`;
                bubble.style.left = `${rect.left + window.scrollX - bubble.offsetWidth - 20}px`;
                bubble.querySelector('.close-bubble-button').onclick = () => bubble.remove();
                document.addEventListener('click', function closeBubble(event) {
                    if (!bubble.contains(event.target) && event.target !== targetElement) {
                        bubble.remove(); document.removeEventListener('click', closeBubble);
                    }
                }, { once: true });
            } else { showNotification(`未找到 VID ${vid} 的会话信息。`, 'warning'); }
        } catch (error) { showNotification(`获取会话信息失败: ${error.message}`, 'error'); }
    }


    // --- 核心功能 5: 手动批量操作 ---
    async function sendBoostingRequest() {
        console.log('[Bulk] boosting start, selected=', Array.from(selectedVidsForBoosting));
        if (selectedVidsForBoosting.size === 0) { showNotification('请先选择至少一个素材进行 Boosting。', 'warning'); return; }
        const params = getUrlParams();
        const csrfToken = getCsrfToken();
        if (!csrfToken || !params.campaign_id || !params.product_id) { showNotification('参数不完整或Token缺失，无法发起请求。', 'error'); return; }
        const scheduleEndTime = Math.floor((new Date().getTime() + 4 * 3600 * 1000) / 1000);
        let successCount = 0;
        const totalCount = selectedVidsForBoosting.size;
        showNotification(`开始为 ${totalCount} 个素材进行Boosting...`, 'info');
        for (const vid of selectedVidsForBoosting) {
            const requestBody = {
                "campaign_id": parseInt(params.campaign_id),
                "session": { "id": -1, "campaign_id": parseInt(params.campaign_id), "session_type": 3, "product_list": [{"spu_id": params.product_id}], "item_id": vid, "budget": 10, "schedule_end_time": scheduleEndTime, "schedule_type": 2 }
            };
            const boostingApiUrl = `https://ads.tiktok.com/api/oec_shopping/v1/session/create?locale=en&language=en&oec_seller_id=${params.oec_seller_id}&aadvid=${params.aadvid}&bc_id=${params.bc_id}`;
            try {
                const response = await sendApiRequest(boostingApiUrl, requestBody, csrfToken);
                if (response?.code === 0) {
                    successCount++;
                    showNotification(`VID ${vid} Boosting成功! (${successCount}/${totalCount})`, 'success');
                } else { console.error('[Bulk] boosting api non-zero code', response); throw new Error(response?.msg || '未知错误'); }
            } catch (error) {
                showNotification(`VID ${vid} Boosting失败: ${error.message}`, 'error');
                console.error(`Boosting VID ${vid} 失败:`, error);
            }
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        showNotification(`批量Boosting完成! 成功 ${successCount} / ${totalCount}。`, 'info');
        selectedVidsForBoosting.clear();
        document.querySelectorAll('.boosting-checkbox').forEach(cb => cb.checked = false);
        await fetchAndProcessAllData();
    }

    async function handleBulkDelete() {
        console.log('[Bulk] delete start, selected=', Array.from(selectedVidsForBoosting));
        if (selectedVidsForBoosting.size === 0) {
            showNotification('请先选择至少一个素材来删除其Boosting。', 'warning');
            return;
        }
        if (!window.confirm(`您确定要为选中的 ${selectedVidsForBoosting.size} 个素材删除“活跃中”的Boosting会话吗？此操作不可撤销。`)) {
            return;
        }

        const params = getUrlParams();
        const csrfToken = getCsrfToken();
        let successCount = 0, failCount = 0, notFoundCount = 0;
        const totalCount = selectedVidsForBoosting.size;
        showNotification(`开始批量删除 ${totalCount} 个素材的Boosting...`, 'info');
        for (const vid of selectedVidsForBoosting) {
            try {
                showNotification(`正在处理 VID: ${vid} (${successCount + failCount + notFoundCount + 1}/${totalCount})`, 'info');
                const activeSession = await findActiveSession(vid, params, csrfToken);
                if (activeSession && activeSession.gmv_max_session_id) {
                    await deleteSession(activeSession.gmv_max_session_id, params, csrfToken);
                    successCount++;
                    showNotification(`✅ VID ${vid} 的活跃会话 (ID: ${activeSession.gmv_max_session_id}) 已成功删除。`, 'success');
                } else {
                    notFoundCount++;
                    showNotification(`⚠️ VID ${vid} 未找到活跃中的会话，无需删除。`, 'warning');
                }
            } catch (error) {
                failCount++;
                console.error(`删除VID ${vid} 的会话失败:`, error);
                showNotification(`❌ 删除 VID ${vid} 的会话失败: ${error.message}`, 'error');
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        showNotification(`批量删除完成！成功: ${successCount}, 失败: ${failCount}, 无需操作: ${notFoundCount}。`, 'info');
        selectedVidsForBoosting.clear();
        document.querySelectorAll('.boosting-checkbox').forEach(cb => cb.checked = false);
        await fetchAndProcessAllData();
    }


    // --- 核心功能 6: 自动删除模块 ---
    async function findActiveSession(vid, params, csrfToken) {
        const endDate = new Date(), startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);
        const requestBody = {
            "query_list": ["session_info", "mixed_real_cost"],
            "start_time": startDate.toISOString().split('T')[0], "end_time": endDate.toISOString().split('T')[0],
            "page": 1, "page_size": 100, "spu_id_list": [params.product_id],
            "campaign_id": params.campaign_id, "gmv_max_bid_type": 3, "item_id": [vid]
        };
        const sessionApiUrl = `https://ads.tiktok.com/api/oec_shopping/v1/oec/stat/post_session_list?locale=en&language=en&oec_seller_id=${params.oec_seller_id}&aadvid=${params.aadvid}&bc_id=${params.bc_id}`;
        try {
            const response = await sendApiRequest(sessionApiUrl, requestBody, csrfToken);
            if (response?.data?.table) {
                return response.data.table.find(s => s.session_info && s.session_info.status === 1) || null;
            }
            return null;
        } catch (error) {
            console.error(`[自动删除] 获取VID ${vid} 的会话信息失败:`, error);
            return null;
        }
    }

    async function deleteSession(sessionId, params, csrfToken) {
        const deleteApiUrl = `https://ads.tiktok.com/api/oec_shopping/v1/session/delete?locale=en&language=en&oec_seller_id=${params.oec_seller_id}&aadvid=${params.aadvid}&bc_id=${params.bc_id}`;
        const requestBody = { "campaign_id": parseInt(params.campaign_id), "session_id": parseInt(sessionId), "session_type": 3 };
        console.log('[Delete] request', requestBody);
        const response = await sendApiRequest(deleteApiUrl, requestBody, csrfToken);
        console.log('[Delete] response', response);
        if (response.code !== 0) { throw new Error(response.msg ? `${response.msg}` : `删除失败: ${JSON.stringify(response)}`); }
        return response;
    }

    async function runAutoDeleteCycleForTask(task) {
        console.log(`[自动删除] 周期任务开始于: ${new Date().toLocaleString()} - key=${task.key}`);
        const csrfToken = getCsrfToken();
        const params = {
            aadvid: task.aadvid,
            oec_seller_id: task.oec_seller_id,
            bc_id: task.bc_id,
            campaign_id: task.campaign_id,
            product_id: task.product_id
        };
        const settings = task.settings;

        if (!settings.enabled || !params.campaign_id || !csrfToken) {
            console.log(`[自动删除] 功能未开启或缺少关键参数，任务中止。key=${task.key}`);
            return;
        }

        const boostingMaterials = await queryMaterials(params, csrfToken, [2], null, 'Boosting中(自动任务)');
        if (!boostingMaterials || boostingMaterials.length === 0) {
            console.log(`[自动删除] 未发现Boosting中的素材，任务结束。key=${task.key}`);
            updateTaskMetrics(task.key, { lastRunAt: Date.now(), lastDeletedCount: 0, lastError: null });
            incrementTaskRunCount(task.key);
            return;
        }

        let deletedCount = 0;
        for (const material of boostingMaterials) {
            const vid = material.item_id;
            const secondaryStatus = material.item_delivery_secondary_status;
            try {
                let shouldDelete = false;
                let reason = '';
                const activeSession = await findActiveSession(vid, params, csrfToken);
                if (!activeSession) continue;
                const statusIsThree = String(secondaryStatus) === '3';
                if (statusIsThree) {
                    shouldDelete = true;
                    reason = `状态为3`;
                } else if (parseFloat(activeSession.mixed_real_cost) > settings.costThreshold) {
                    shouldDelete = true;
                    reason = `花费 ${activeSession.mixed_real_cost} > 阈值 ${settings.costThreshold}`;
                }
                if (shouldDelete) {
                    // 删除前再校验是否仍为活跃
                    if (!(activeSession.session_info && activeSession.session_info.status === 1)) {
                        console.log('[自动删除] 跳过，因为会话不再活跃', vid);
                        continue;
                    }
                    await deleteSession(activeSession.gmv_max_session_id, params, csrfToken);
                    deletedCount++;
                    console.log(`[自动删除] ✅ VID ${vid} 已被删除。原因: ${reason} key=${task.key}`);
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            } catch (error) {
                console.error(`[自动删除] 处理 VID ${vid} 时出错:`, error);
                updateTaskMetrics(task.key, { lastError: String(error && error.message || error) });
            }
        }
        updateTaskMetrics(task.key, { lastRunAt: Date.now(), lastDeletedCount: deletedCount, lastError: null });
        incrementTaskRunCount(task.key);
    }

    function startTaskTimer(task) {
        const key = task.key;
        const settings = task.settings;
        if (!settings.enabled) { stopTaskTimer(key); return; }
        let intervalMs = (settings.hours * 3600 + settings.minutes * 60) * 1000;
        if (intervalMs < 60000) { intervalMs = 60000; }
        stopTaskTimer(key);
        // 立即跑一次
        runAutoDeleteCycleForTask(task).catch(() => {});
        const intervalId = setInterval(() => runAutoDeleteCycleForTask(task).catch((e) => console.error('[Timer] run error', e)), intervalMs);
        taskTimers.set(key, { intervalId, settings });
        updateTaskMetrics(key, { nextRunAt: Date.now() + intervalMs });
        console.log('[Timer] started', key, intervalMs);
    }

    function stopTaskTimer(taskKey) {
        const timer = taskTimers.get(taskKey);
        if (timer && timer.intervalId) { clearInterval(timer.intervalId); }
        taskTimers.delete(taskKey);
        console.log('[Timer] stopped', taskKey);
    }


    // --- 核心功能 7: 初始化与事件绑定 ---
    async function fetchAndProcessAllData() {
        showNotification('正在查询 boosted 和 boosting 素材...', 'info');
        const params = getUrlParams();
        const csrfToken = getCsrfToken();
        if (!params.campaign_id || !params.product_id || !csrfToken) {
            showNotification('页面参数不完整或Token缺失，无法查询。', 'error'); return;
        }
        try {
            const [boostedMaterials, boostingMaterials] = await Promise.all([
                queryMaterials(params, csrfToken, [1], '正在查询已Boosted素材', '已Boosted'),
                queryMaterials(params, csrfToken, [2], '正在查询Boosting中素材', 'Boosting中')
            ]);
            globalBoostedVidSet = new Set(boostedMaterials.map(m => String(m.item_id)));
            globalBoostingVidSet = new Set(boostingMaterials.map(m => String(m.item_id)));
            saveDataToCache({ boosted: Array.from(globalBoostedVidSet), boosting: Array.from(globalBoostingVidSet) });
            showNotification('状态获取并缓存成功！正在渲染页面...', 'success');
            activatePageElementProcessing();
        } catch (error) {
            console.error("获取素材状态时发生顶层错误:", error);
            showNotification("获取素材状态失败，请检查控制台。", "error");
        }
    }

    function initializeFromCache() {
        console.log('脚本初始化/URL变更，尝试从缓存加载...');
        const cachedData = loadDataFromCache();
        globalBoostedVidSet.clear();
        globalBoostingVidSet.clear();
        selectedVidsForBoosting.clear();
        if (cachedData) {
            globalBoostedVidSet = new Set(cachedData.boosted);
            globalBoostingVidSet = new Set(cachedData.boosting);
            showNotification('已从本地缓存加载素材状态。', 'info');
        } else {
            showNotification('无本地缓存，请点击按钮获取最新状态。', 'warning');
        }
        activatePageElementProcessing();
    }

    function createActionButtonsAndPanel() {
        console.log('[UI] createActionButtonsAndPanel');

        // 检查是否应该显示面板（仅在GMV Max产品页面显示）
        const shouldShowPanel = shouldDisplayTaskPanel();
        console.log('[UI] shouldShowPanel:', shouldShowPanel);

        let buttonContainer = document.getElementById('gemini-action-container');
        if (!buttonContainer) {
            buttonContainer = document.createElement('div');
            buttonContainer.id = 'gemini-action-container';
            buttonContainer.style.cssText = `position: fixed; bottom: 20px; left: 20px; z-index: 10002; display: flex; flex-direction: column; gap: 10px;`;
            document.body.appendChild(buttonContainer);
        }
        buttonContainer.innerHTML = '';

        // 只有在GMV Max产品页面才显示任务总览面板
        if (!shouldShowPanel) {
            console.log('[UI] 非GMV Max产品页面，不显示任务总览面板');
            return;
        }

        const controlsPanel = document.createElement('div');
        controlsPanel.style.cssText = `margin-top: 0; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 10px 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); font-size: 13px; width: 312px;`;
        const manualButtons = document.createElement('div');
        manualButtons.style.cssText = 'display: flex; gap: 10px;';
        controlsPanel.appendChild(manualButtons);
        buttonContainer.appendChild(controlsPanel);

        const getStatusButton = document.createElement('button');
        getStatusButton.textContent = '获取Boosting状态';
        getStatusButton.style.cssText = `padding: 10px 15px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);`;
        getStatusButton.onclick = fetchAndProcessAllData;
        manualButtons.appendChild(getStatusButton);

        const bulkBoostingButton = document.createElement('button');
        bulkBoostingButton.textContent = '批量发送Boosting';
        bulkBoostingButton.style.cssText = `padding: 10px 15px; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);`;
        bulkBoostingButton.onclick = sendBoostingRequest;
        manualButtons.appendChild(bulkBoostingButton);

        const bulkDeleteButton = document.createElement('button');
        bulkDeleteButton.id = 'bulk-delete-button';
        bulkDeleteButton.textContent = '批量删除Boosting';
        bulkDeleteButton.style.cssText = `padding: 10px 15px; background-color: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);`;
        bulkDeleteButton.onclick = handleBulkDelete;
        manualButtons.appendChild(bulkDeleteButton);

        const panel = document.createElement('div');
        panel.style.cssText = `margin-top: 10px; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); font-size: 13px; width: 312px;`;
        panel.innerHTML = `
            <details open>
                <summary style="font-weight: bold; cursor: pointer; margin-bottom: 10px;">📋 任务总览（全站）</summary>
                <div style="max-height: 300px; overflow-y: auto; border: 1px solid #e9ecef; border-radius: 4px; padding: 8px; background: #fff; margin-top: 10px;">
                    <div id="task-overview-container" style="display: flex; flex-direction: column; gap: 8px;"></div>
                </div>
            </details>
            <details open>
                <summary style="font-weight: bold; cursor: pointer; margin: 10px 0 10px;">⚙️ 自动化删除设置（仅本详情页生效）</summary>
                <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <label for="auto-delete-enabled">启用自动删除:</label>
                        <input type="checkbox" id="auto-delete-enabled" style="height: 16px; width: 16px;">
                    </div>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <label>运行周期:</label>
                        <div><input type="number" id="auto-delete-hours" min="0" style="width: 50px; padding: 4px;"> 小时 <input type="number" id="auto-delete-minutes" min="0" max="59" style="width: 50px; padding: 4px;"> 分钟</div>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <label for="auto-delete-cost">当花费 > X 时删除 (USD):</label>
                        <input type="number" id="auto-delete-cost" min="0" step="0.1" style="width: 120px; padding: 4px;">
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                         <button id="save-auto-settings" style="background-color: #17a2b8; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">保存设置</button>
                         <span id="auto-delete-status" style="font-style: italic; color: #6c757d;">已禁用</span>
                    </div>
                </div>
            </details>
        `;
        buttonContainer.appendChild(panel);
        document.getElementById('save-auto-settings').addEventListener('click', () => {
            const settings = {
                enabled: document.getElementById('auto-delete-enabled').checked,
                hours: parseInt(document.getElementById('auto-delete-hours').value) || 0,
                minutes: parseInt(document.getElementById('auto-delete-minutes').value) || 0,
                costThreshold: parseFloat(document.getElementById('auto-delete-cost').value) || 1.0
            };
            GM_setValue('autoDeleteSettings', settings);
            showNotification('自动化设置已保存!', 'success');
            const params = getUrlParams();
            if (params && params.campaign_id && params.product_id) {
                const key = getTaskKeyFromParams(params);
                const task = upsertTaskIntoRegistry({
                    key,
                    aadvid: params.aadvid,
                    oec_seller_id: params.oec_seller_id,
                    bc_id: params.bc_id,
                    campaign_id: params.campaign_id,
                    product_id: params.product_id,
                    settings
                });
                if (task.settings.enabled) startTaskTimer(task); else stopTaskTimer(task.key);
                const statusSpan = document.getElementById('auto-delete-status');
                if (statusSpan) statusSpan.textContent = task.settings.enabled ? `运行中，每 ${settings.hours}h ${settings.minutes}m 检查一次。` : '已禁用';
                renderTaskOverview();
            }
        });
    }

    function initializeAutoDelete() {
        // 详情页配置入口：仅当 URL 含有 product 参数时渲染和读取
        const params = getUrlParams();
        const hasProductContext = !!(params && params.product_id && params.campaign_id);
        const panelExists = document.getElementById('auto-delete-enabled');
        if (!panelExists) return;
        const defaultSettings = { enabled: false, hours: 4, minutes: 0, costThreshold: 1.0 };
        const settings = GM_getValue('autoDeleteSettings', defaultSettings);
        document.getElementById('auto-delete-enabled').checked = settings.enabled;
        document.getElementById('auto-delete-hours').value = settings.hours;
        document.getElementById('auto-delete-minutes').value = settings.minutes;
        document.getElementById('auto-delete-cost').value = settings.costThreshold;

        if (hasProductContext) {
            const key = getTaskKeyFromParams(params);
            const registry = loadTaskRegistry();
            const existingTask = registry[key];

            // 如果任务已存在，只更新显示状态，不重新创建任务
            if (existingTask) {
                console.log('[Init] 任务已存在，仅更新显示状态:', key);
                const statusSpan = document.getElementById('auto-delete-status');
                if (statusSpan) {
                    statusSpan.textContent = existingTask.settings.enabled ?
                        `运行中，每 ${existingTask.settings.hours}h ${existingTask.settings.minutes}m 检查一次。` : '已禁用';
                }
                return; // 不重新创建任务，避免重复启动定时器
            }

            // 只有在任务不存在且用户有保存过设置时才创建新任务
            // 这里不自动创建任务，让用户主动保存时才创建
            console.log('[Init] 详情页加载，等待用户保存设置:', key);
            const statusSpan = document.getElementById('auto-delete-status');
            if (statusSpan) statusSpan.textContent = '未配置，请保存设置后启用';
        }
    }

    function initializeScript() {
        if (hasInitialized) {
            console.log('[Init] skip re-init, only refresh UI');
            // 即使已初始化，也要刷新UI和任务总览
            renderTaskOverview();
            // 确保复选框处理仍然活跃（仅在详情页）
            if (shouldDisplayTaskPanel()) {
                activatePageElementProcessing();
            }
            return;
        }
        hasInitialized = true;
        try {
            console.log('[Init] initializeScript');
            createActionButtonsAndPanel();
            initializeFromCache();
            initializeAutoDelete();
            renderTaskOverview();
            bootstrapAllTaskTimers();
            // 确保复选框处理被激活（仅在详情页）
            if (shouldDisplayTaskPanel()) {
                activatePageElementProcessing();
            }
        } catch (e) {
            console.error('[ERROR] initializeScript', e);
        }
    }

    // --- 启动逻辑 ---
    try { console.log('[BOOT] document.readyState=', document.readyState); } catch (e) {}
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { try { console.log('[BOOT] DOMContentLoaded'); } catch(e) {}; initializeScript(); });
    } else {
        initializeScript();
    }

    let currentUrl = window.location.href;
    const urlChangeObserver = new MutationObserver(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            console.log('URL变更，重新初始化脚本。');
            // 重置初始化标志，允许重新初始化
            hasInitialized = false;
            setTimeout(initializeScript, 1500);
        }
    });
    // 只监听URL变化，而不是所有DOM变化
    urlChangeObserver.observe(document, { childList: true, subtree: true });

})();