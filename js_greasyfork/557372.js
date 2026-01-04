// ==UserScript==
// @name         Duolingo Master
// @namespace    http://tampermonkey.net/
// @version      v4.0
// @description  Duolingo Farm Gems, XP, Streaks
// @author       DUOS
// @match        https://www.duolingo.com/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545356/Duolingo%20Master.user.js
// @updateURL https://update.greasyfork.org/scripts/545356/Duolingo%20Master.meta.js
// ==/UserScript==

(() => {
    'use strict';
    const STORAGE_KEYS = { POSITION: 'duo_easy_position', THEME: 'duo_easy_theme', MINIMIZED: 'duo_easy_minimized', XP_AMOUNT: 'duo_easy_xp_amount', STATS: 'duo_easy_stats', MAX_ENABLED: 'duo_easy_max_enabled' };
    const CONFIG = { GEM_DELAY: 100, XP_DELAY: 500, STREAK_DELAY: 50, GEM_BATCH_SIZE: 1, DISCORD_URL: 'https://discord.gg/ufBrcGemBH' };
    const URL_MAX_SUPER = /https?:\/\/(?:[a-zA-Z0-9-]+\.)?duolingo\.[a-zA-Z]{2,6}(?:\.[a-zA-Z]{2})?\/\d{4}-\d{2}-\d{2}\/users\/.+/;
    const CUSTOM_SHOP_ITEMS = { gold_subscription: { itemName: "gold_subscription", subscriptionInfo: { vendor: "STRIPE", renewing: true, isFamilyPlan: true, expectedExpiration: 900000000 } } };

    let jwt, sub, userInfo, headers;
    let activeTask = null;
    let isMinimized = localStorage.getItem(STORAGE_KEYS.MINIMIZED) === 'true';
    let isDarkMode = localStorage.getItem(STORAGE_KEYS.THEME) !== 'light';
    let xpAmount = parseInt(localStorage.getItem(STORAGE_KEYS.XP_AMOUNT)) || 499;
    let maxEnabled = localStorage.getItem(STORAGE_KEYS.MAX_ENABLED) !== 'false';
    let stats = JSON.parse(localStorage.getItem(STORAGE_KEYS.STATS)) || { gems: 0, xp: 0, streak: 0 };

    const interceptFetch = () => { const originalFetch = window.fetch; window.fetch = function (resource, options) { const url = resource instanceof Request ? resource.url : resource; const method = (resource instanceof Request) ? resource.method : (options?.method || 'GET'); const shouldIntercept = maxEnabled && method.toUpperCase() === 'GET' && URL_MAX_SUPER.test(url) && !url.includes('/shop-items'); if (shouldIntercept) { return originalFetch.apply(this, arguments).then(async (response) => { try { const cloned = response.clone(); const jsonText = await cloned.text(); const data = JSON.parse(jsonText); data.hasPlus = true; data.trackingProperties = data.trackingProperties || {}; data.trackingProperties.has_item_gold_subscription = true; data.shopItems = { ...(data.shopItems || {}), ...CUSTOM_SHOP_ITEMS }; const modified = JSON.stringify(data); const hdrs = new Headers(response.headers); return new Response(modified, { status: response.status, statusText: response.statusText, headers: hdrs }); } catch (e) { return response; } }).catch(err => originalFetch.apply(this, arguments)); } return originalFetch.apply(this, arguments); }; };

    const interceptXHR = () => { const originalXhrOpen = XMLHttpRequest.prototype.open; const originalXhrSend = XMLHttpRequest.prototype.send; XMLHttpRequest.prototype.open = function (method, url, ...args) { this._method = method; this._url = url; originalXhrOpen.call(this, method, url, ...args); }; XMLHttpRequest.prototype.send = function () { const shouldIntercept = maxEnabled && this._method && this._method.toUpperCase() === 'GET' && URL_MAX_SUPER.test(this._url) && !this._url.includes('/shop-items'); if (shouldIntercept) { const originalOnReadyStateChange = this.onreadystatechange; const xhr = this; this.onreadystatechange = function () { if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) { try { const data = JSON.parse(xhr.responseText); data.hasPlus = true; data.trackingProperties = data.trackingProperties || {}; data.trackingProperties.has_item_gold_subscription = true; data.shopItems = { ...(data.shopItems || {}), ...CUSTOM_SHOP_ITEMS }; const modifiedText = JSON.stringify(data); Object.defineProperty(xhr, 'responseText', { writable: true, value: modifiedText }); Object.defineProperty(xhr, 'response', { writable: true, value: modifiedText }); } catch (e) { } } if (originalOnReadyStateChange) originalOnReadyStateChange.apply(this, arguments); }; } originalXhrSend.apply(this, arguments); }; };

    const utils = { getJWT: () => { const match = document.cookie.match(/jwt_token=([^;]+)/); return match ? match[1] : null; }, decodeJWT: (token) => { try { const payload = token.split('.')[1]; const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/')); return JSON.parse(decodeURIComponent(escape(decoded))); } catch (e) { return null; } }, formatHeaders: (jwt) => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwt}`, 'User-Agent': navigator.userAgent, 'X-Request-ID': `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 'Accept-Language': 'en-US,en;q=0.9' }), delay: ms => new Promise(r => setTimeout(r, ms)), request: async (url, options = {}) => { try { return await fetch(url, { ...options, headers: { ...headers, ...options.headers } }); } catch (e) { return null; } }, saveStats: () => { localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats)); }, randomDelay: (min, max) => Math.random() * (max - min) + min };

    const api = { getUserInfo: async () => { const url = `https://www.duolingo.com/2017-06-30/users/${sub}?fields=id,username,fromLanguage,learningLanguage,streak,totalXp,gems,streakData,hasPlus,timezone`; const res = await utils.request(url); return res?.json(); }, farmGems: async () => { const rewardIds = ["SKILL_COMPLETION_BALANCED-dd2495f4_d44e_3fc3_8ac8_94e2191506f0-2-GEMS", "SKILL_COMPLETION_BALANCED-dd2495f4_d44e_3fc3_8ac8_94e2191506f0-1-GEMS"]; for (const rewardId of rewardIds) { try { const url = `https://www.duolingo.com/2017-06-30/users/${sub}/rewards/${rewardId}`; const data = { consumed: true, learningLanguage: userInfo.learningLanguage, fromLanguage: userInfo.fromLanguage }; const res = await utils.request(url, { method: 'PATCH', body: JSON.stringify(data) }); if (res?.ok) return res; } catch (e) { continue; } } return null; }, farmXP: async () => { const stories = ["fr-en-le-passeport", "en-es-la-fiesta", "de-en-das-abenteuer"]; const story = stories[Math.floor(Math.random() * stories.length)]; const url = `https://stories.duolingo.com/api2/stories/${story}/complete`; const data = { awardXp: true, completedBonusChallenge: true, fromLanguage: "en", hasXpBoost: false, illustrationFormat: "svg", isFeaturedStoryInPracticeHub: true, isLegendaryMode: true, isV2Redo: false, isV2Story: false, learningLanguage: "fr", masterVersion: true, maxScore: 0, score: 0, happyHourBonusXp: xpAmount - 30, startTime: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 300), endTime: Math.floor(Date.now() / 1000) }; return utils.request(url, { method: 'POST', body: JSON.stringify(data) }); }, farmSessionOnce: async (startTime, endTime) => { try { const challengeTypes = ["assist", "select", "translate", "match", "listen"]; const sessionPayload = { challengeTypes: challengeTypes, fromLanguage: userInfo.fromLanguage, isFinalLevel: false, isV2: true, juicy: true, learningLanguage: userInfo.learningLanguage, smartTipsVersion: 2, type: "GLOBAL_PRACTICE" }; const sessionRes = await utils.request("https://www.duolingo.com/2017-06-30/sessions", { method: 'POST', body: JSON.stringify(sessionPayload) }); if (!sessionRes?.ok) return null; const sessionData = await sessionRes.json(); if (!sessionData?.id) return null; const updatePayload = { ...sessionData, heartsLeft: 0, startTime: startTime, enableBonusPoints: false, endTime: endTime, failed: false, maxInLessonStreak: Math.floor(Math.random() * 10 + 5), shouldLearnThings: true }; const updateRes = await utils.request(`https://www.duolingo.com/2017-06-30/sessions/${sessionData.id}`, { method: 'PUT', body: JSON.stringify(updatePayload) }); return updateRes?.ok ? await updateRes.json() : null; } catch (error) { return null; } }, activateTrial: async () => { const url = `https://www.duolingo.com/2017-06-30/users/${sub}/shop-items`; const data = { itemName: "immersive_subscription", productId: "com.duolingo.immersive_free_trial_subscription" }; return utils.request(url, { method: 'POST', body: JSON.stringify(data) }); } };

    const farming = { async gems() { while (activeTask === 'gems') { const res = await api.farmGems(); if (res?.ok) { userInfo.gems = (userInfo.gems || 0) + 30; stats.gems += 30; ui.updateStats(); utils.saveStats(); } await utils.delay(CONFIG.GEM_DELAY + utils.randomDelay(-20, 20)); } }, async xp() { while (activeTask === 'xp') { const res = await api.farmXP(); if (res?.ok) { userInfo.totalXp = (userInfo.totalXp || 0) + xpAmount; stats.xp += xpAmount; ui.updateStats(); utils.saveStats(); } await utils.delay(CONFIG.XP_DELAY + utils.randomDelay(-100, 100)); } }, async streak() { const hasStreak = userInfo.streakData?.currentStreak; const startDate = hasStreak ? userInfo.streakData.currentStreak.startDate : new Date(); let currentTimestamp = Math.floor(new Date(startDate).getTime() / 1000) - 86400; while (activeTask === 'streak') { try { const sessionRes = await api.farmSessionOnce(currentTimestamp, currentTimestamp + 300); if (sessionRes) { currentTimestamp -= 86400; userInfo.streak = (userInfo.streak || 0) + 1; stats.streak += 1; ui.updateStats(); utils.saveStats(); await utils.delay(CONFIG.STREAK_DELAY + utils.randomDelay(-10, 10)); } else { await utils.delay(CONFIG.STREAK_DELAY * 2); } } catch (error) { await utils.delay(CONFIG.STREAK_DELAY * 3); } } }, stop() { activeTask = null; ui.updateFarmingButtons(); } };

    const ui = {
        create() {
            const savedPos = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSITION));
            const container = document.createElement('div');
            container.id = 'duo-easy-hub';
            container.className = isDarkMode ? 'dark' : 'light';
            if (isMinimized) container.classList.add('minimized');
            if (savedPos) { container.style.top = savedPos.top; container.style.left = savedPos.left; container.style.right = 'auto'; container.style.bottom = 'auto'; }
            container.innerHTML = `
                <div class="hub-header">
                    <div class="hub-brand">
                        <img src="https://blog.duolingo.com/content/images/2023/02/Duo---Blog-Asset--1-.png" alt="Duo">
                        <span>Duolingo Master</span>
                    </div>
                    <div class="hub-controls">
                        <button class="control-btn theme-btn" title="Toggle theme"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg></button>
                        <button class="control-btn min-btn" title="Minimize"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                        <button class="control-btn close-btn" title="Close"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                    </div>
                </div>
                <div class="hub-body">
                    <div class="discord-banner">
                        <div class="discord-content">
                            <span class="discord-title">🎮 Join Community</span>
                            <a href="${CONFIG.DISCORD_URL}" target="_blank" rel="noopener noreferrer" class="discord-btn">Discord</a>
                        </div>
                    </div>
                    <div class="credit-info">
                        <small>By DUOS</small>
                    </div>
                    <div class="stats-container">
                        <div class="stat-item" data-type="streak">
                            <div class="stat-label">Streak</div>
                            <div class="stat-value" id="val-streak">0</div>
                        </div>
                        <div class="stat-item" data-type="gems">
                            <div class="stat-label">Gems</div>
                            <div class="stat-value" id="val-gems">0</div>
                        </div>
                        <div class="stat-item" data-type="xp">
                            <div class="stat-label">XP</div>
                            <div class="stat-value" id="val-xp">0</div>
                        </div>
                    </div>
                    <div class="xp-config">
                        <label>XP per Claim</label>
                        <input type="number" class="xp-input" value="${xpAmount}" min="1" max="10000">
                    </div>
                    <div class="action-container">
                        <button class="action-item max-btn" id="max-toggle" title="Toggle Duolingo Max"><span>${maxEnabled ? '✓ Max ON' : '✕ Max OFF'}</span></button>
                        <button class="action-item" data-action="trial"><span>Super Trial</span></button>
                    </div>
                </div>
                <div class="hub-minimized-icon"><img src="https://blog.duolingo.com/content/images/2023/02/Duo---Blog-Asset--1-.png" alt="Duo"></div>
                <div class="notification-container"></div>
            `;
            const styles = `#duo-easy-hub{position:fixed;top:20px;right:20px;width:360px;border-radius:16px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,0.5);z-index:999999;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);user-select:none;background:linear-gradient(135deg,#1a1a1a 0%,#0d0d0d 100%);border:2px solid #2a2a2a}#duo-easy-hub.minimized{width:60px;height:60px;border-radius:50%;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,0.4)}#duo-easy-hub.minimized .hub-header,#duo-easy-hub.minimized .hub-body{display:none}#duo-easy-hub:not(.minimized) .hub-minimized-icon{display:none}.hub-header{padding:18px 20px;display:flex;justify-content:space-between;align-items:center;cursor:move;border-bottom:2px solid #2a2a2a;background:linear-gradient(135deg,#2a2a2a 0%,#1a1a1a 100%)}.hub-brand{display:flex;align-items:center;gap:14px}.hub-brand img{width:36px;height:36px;border-radius:10px;filter:drop-shadow(0 2px 8px rgba(255,255,255,0.1))}.hub-brand span{font-size:16px;font-weight:800;letter-spacing:-0.5px;color:#ffffff;text-shadow:0 2px 4px rgba(0,0,0,0.3)}.hub-controls{display:flex;gap:10px}.control-btn{width:36px;height:36px;border:2px solid #3a3a3a;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s ease;background:linear-gradient(135deg,#2a2a2a 0%,#1a1a1a 100%);color:#ffffff;box-shadow:0 4px 12px rgba(0,0,0,0.3)}.control-btn:hover{transform:scale(1.15) translateY(-2px);background:linear-gradient(135deg,#3a3a3a 0%,#2a2a2a 100%);border-color:#4a4a4a;box-shadow:0 6px 16px rgba(0,0,0,0.4)}.hub-body{padding:20px}.discord-banner{background:linear-gradient(135deg,#000000 0%,#1a1a1a 100%);border-radius:14px;padding:18px;margin-bottom:16px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:12px;border:2px solid #2a2a2a;box-shadow:0 8px 24px rgba(0,0,0,0.4)}.discord-content{display:flex;flex-direction:column;width:100%;gap:10px}.discord-title{font-size:15px;font-weight:800;color:#ffffff;text-shadow:0 2px 4px rgba(0,0,0,0.3);letter-spacing:0.5px}.discord-btn{background:linear-gradient(135deg,#2a2a2a 0%,#1a1a1a 100%);color:#ffffff;border:2px solid #3a3a3a;padding:12px 20px;border-radius:10px;font-weight:800;font-size:13px;text-decoration:none;cursor:pointer;transition:all 0.2s ease;text-transform:uppercase;letter-spacing:1px;display:inline-block;box-shadow:0 4px 12px rgba(0,0,0,0.3)}.discord-btn:hover{background:linear-gradient(135deg,#3a3a3a 0%,#2a2a2a 100%);border-color:#4a4a4a;transform:scale(1.08) translateY(-2px);box-shadow:0 6px 16px rgba(0,0,0,0.4)}.credit-info{text-align:center;font-size:10px;opacity:0.8;margin-bottom:16px;font-weight:800;line-height:1.4;color:#ffffff;text-shadow:0 1px 2px rgba(0,0,0,0.3)}.credit-info a{color:inherit;opacity:1}.stats-container{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:18px}.stat-item{padding:16px;border-radius:14px;cursor:pointer;transition:all 0.2s ease;border:2px solid #2a2a2a;background:linear-gradient(135deg,#1a1a1a 0%,#0d0d0d 100%);box-shadow:0 4px 12px rgba(0,0,0,0.3)}.stat-item:hover{transform:translateY(-3px) scale(1.03);background:linear-gradient(135deg,#2a2a2a 0%,#1a1a1a 100%);border-color:#3a3a3a;box-shadow:0 8px 20px rgba(0,0,0,0.4)}.stat-item.active{animation:pulse-stat 1.5s infinite;background:linear-gradient(135deg,rgba(76,175,80,0.25) 0%,rgba(56,142,60,0.25) 100%);border-color:rgba(76,175,80,0.5);box-shadow:0 8px 24px rgba(76,175,80,0.3)}@keyframes pulse-stat{0%,100%{opacity:1;transform:translateY(0)}50%{opacity:0.85;transform:translateY(-2px)}}.stat-label{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;opacity:0.7;color:#ffffff}.stat-value{font-size:24px;font-weight:900;letter-spacing:-0.8px;color:#ffffff;text-shadow:0 2px 4px rgba(0,0,0,0.3)}.xp-config{margin-bottom:18px}.xp-config label{display:block;font-size:11px;font-weight:800;margin-bottom:10px;text-transform:uppercase;letter-spacing:1px;opacity:0.7;color:#ffffff}.xp-input{width:100%;padding:13px 15px;border-radius:12px;border:2px solid #2a2a2a;font-size:15px;font-weight:700;transition:all 0.2s ease;box-sizing:border-box;background:linear-gradient(135deg,#1a1a1a 0%,#0d0d0d 100%);color:#ffffff;box-shadow:inset 0 2px 6px rgba(0,0,0,0.3)}.xp-input:focus{outline:none;border-color:rgba(76,175,80,0.6);background:linear-gradient(135deg,#2a2a2a 0%,#1a1a1a 100%);box-shadow:0 0 0 4px rgba(76,175,80,0.15),inset 0 2px 6px rgba(0,0,0,0.3)}.action-container{display:grid;gap:12px}.action-item{width:100%;padding:15px 18px;border:2px solid #2a2a2a;border-radius:12px;cursor:pointer;font-size:14px;font-weight:800;transition:all 0.2s ease;text-decoration:none;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1a1a1a 0%,#0d0d0d 100%);color:#ffffff;text-transform:uppercase;letter-spacing:0.5px;box-shadow:0 4px 12px rgba(0,0,0,0.3)}.action-item:hover{transform:translateY(-2px) scale(1.02);background:linear-gradient(135deg,#2a2a2a 0%,#1a1a1a 100%);border-color:#3a3a3a;box-shadow:0 6px 16px rgba(0,0,0,0.4)}.action-item.max-btn.on{background:linear-gradient(135deg,rgba(76,175,80,0.3) 0%,rgba(56,142,60,0.3) 100%);border-color:rgba(76,175,80,0.6);color:#4caf50;box-shadow:0 6px 20px rgba(76,175,80,0.3)}.action-item.max-btn.off{background:linear-gradient(135deg,rgba(244,67,54,0.3) 0%,rgba(211,47,47,0.3) 100%);border-color:rgba(244,67,54,0.6);color:#f44336;box-shadow:0 6px 20px rgba(244,67,54,0.3)}.hub-minimized-icon{width:100%;height:100%;display:flex;align-items:center;justify-content:center;cursor:pointer}.hub-minimized-icon img{width:40px;height:40px;filter:drop-shadow(0 2px 8px rgba(255,255,255,0.2))}.notification-container{position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:9999999;pointer-events:none}.notification{padding:16px 28px;border-radius:12px;margin-bottom:14px;font-size:14px;font-weight:800;pointer-events:auto;animation:slideDown 0.3s cubic-bezier(0.4,0,0.2,1);border:2px solid;box-shadow:0 8px 24px rgba(0,0,0,0.4);backdrop-filter:blur(10px)}@keyframes slideDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}.notification.success{background:linear-gradient(135deg,rgba(76,175,80,0.25) 0%,rgba(56,142,60,0.25) 100%);color:#4caf50;border-color:rgba(76,175,80,0.5)}.notification.error{background:linear-gradient(135deg,rgba(244,67,54,0.25) 0%,rgba(211,47,47,0.25) 100%);color:#f44336;border-color:rgba(244,67,54,0.5)}.notification.info{background:linear-gradient(135deg,rgba(33,150,243,0.25) 0%,rgba(21,101,192,0.25) 100%);color:#2196f3;border-color:rgba(33,150,243,0.5)}@media (max-width:768px){#duo-easy-hub{width:calc(100% - 40px);max-width:360px}}@media (max-width:480px){#duo-easy-hub{top:10px;right:10px;width:calc(100% - 20px);max-width:none}.stats-container{grid-template-columns:1fr 1fr}}`;
            document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);
            document.body.appendChild(container);
            this.setupEvents(container);
            this.makeDraggable(container);
        },
        setupEvents(container) {
            container.querySelector('.min-btn').onclick = () => this.toggleMinimize();
            container.querySelector('.close-btn').onclick = () => container.remove();
            container.querySelector('.hub-minimized-icon').onclick = () => this.toggleMinimize();
            container.querySelector('.theme-btn').onclick = () => this.toggleTheme();
            const xpInput = container.querySelector('.xp-input');
            xpInput.onchange = () => { const val = parseInt(xpInput.value) || 499; xpAmount = Math.max(1, Math.min(10000, val)); xpInput.value = xpAmount; localStorage.setItem(STORAGE_KEYS.XP_AMOUNT, xpAmount); };
            container.querySelectorAll('.stat-item').forEach(item => { item.onclick = () => { const type = item.dataset.type; if (activeTask === type) { farming.stop(); } else { farming.stop(); activeTask = type; farming[type](); this.updateFarmingButtons(); } }; });
            container.querySelector('#max-toggle').onclick = () => { maxEnabled = !maxEnabled; localStorage.setItem(STORAGE_KEYS.MAX_ENABLED, maxEnabled); const btn = container.querySelector('#max-toggle'); btn.classList.toggle('on', maxEnabled); btn.classList.toggle('off', !maxEnabled); btn.innerHTML = maxEnabled ? '<span>✓ Max ON</span>' : '<span>✕ Max OFF</span>'; ui.showNotification(maxEnabled ? 'Max: ON ✓' : 'Max: OFF ✕', 'info'); };
            container.querySelector('[data-action="trial"]').onclick = async () => { if (userInfo.hasPlus) { this.showNotification('Already have Super', 'error'); return; } const res = await api.activateTrial(); if (res?.ok) { const data = await res.json(); if (data.purchaseId) { this.showNotification('Super Trial activated', 'success'); userInfo.hasPlus = true; } else { this.showNotification('Activation failed', 'error'); } } else { this.showNotification('Activation failed', 'error'); } };
        },
        makeDraggable(el) { let pos = { x: 0, y: 0, startX: 0, startY: 0 }; const header = el.querySelector('.hub-header'); const dragStart = (e) => { if (e.target.closest('.hub-controls')) return;pos.startX = e.clientX; pos.startY = e.clientY; document.onmousemove = drag; document.onmouseup = dragEnd; el.style.transition = 'none'; }; const drag = (e) => { e.preventDefault(); pos.x = pos.startX - e.clientX; pos.y = pos.startY - e.clientY; pos.startX = e.clientX; pos.startY = e.clientY; el.style.top = (el.offsetTop - pos.y) + 'px'; el.style.left = (el.offsetLeft - pos.x) + 'px'; el.style.right = 'auto'; el.style.bottom = 'auto'; }; const dragEnd = () => { document.onmouseup = null; document.onmousemove = null; el.style.transition = ''; localStorage.setItem(STORAGE_KEYS.POSITION, JSON.stringify({ top: el.style.top, left: el.style.left })); }; header.onmousedown = dragStart; },
        toggleMinimize() { isMinimized = !isMinimized; const hub = document.getElementById('duo-easy-hub'); hub.classList.toggle('minimized', isMinimized); localStorage.setItem(STORAGE_KEYS.MINIMIZED, isMinimized); },
        toggleTheme() { isDarkMode = !isDarkMode; const hub = document.getElementById('duo-easy-hub'); hub.className = isDarkMode ? 'dark' : 'light'; if (isMinimized) hub.classList.add('minimized'); localStorage.setItem(STORAGE_KEYS.THEME, isDarkMode ? 'dark' : 'light'); },
        updateStats() { if (!userInfo) return; document.getElementById('val-streak').textContent = userInfo.streak || 0; document.getElementById('val-gems').textContent = userInfo.gems || 0; document.getElementById('val-xp').textContent = (userInfo.totalXp || 0).toLocaleString(); },
        updateFarmingButtons() { document.querySelectorAll('.stat-item').forEach(item => { item.classList.toggle('active', activeTask === item.dataset.type); }); },
        showNotification(message, type = 'info') { const container = document.querySelector('.notification-container'); const notif = document.createElement('div'); notif.className = `notification ${type}`; notif.textContent = message; container.appendChild(notif); setTimeout(() => notif.remove(), 3000); },
        injectMaxBanner: () => {
            if (!location.pathname.includes('/settings/super')) return;
            if (document.getElementById('extension-banner')) return;
            const refElement = document.querySelector('.MGk8p');
            if (!refElement) return;
            const ul = document.createElement('ul');
            ul.className = 'Y6o36';
            const newLi = document.createElement('li');
            newLi.id = 'extension-banner';
            newLi.className = '_17J_p';
            newLi.innerHTML = `<div class='thPiC'><img class='_1xOxM' src='https://d35aaqx5ub95lt.cloudfront.net/vendor/43ae4670b321ea3e5807b2a983864d18.svg' style='border-radius:100px'></div><div class='_3jiBp'><h4 class='qyEhl'>Duolingo Master</h4></div><div class='_36kJA'><div><a href='https://discord.gg/ufBrcGemBH' target='_blank'><button class='_1ursp _2V6ug _2paU5 _3gQUj _7jW2t rdtAy'><span class='_9lHjd' style='color:#ffffff'>Join Discord</span></button></a></div></div>`;
            ul.appendChild(newLi);
            refElement.parentNode.insertBefore(ul, refElement.nextSibling);
        },
        removeManageSubscription: () => { document.querySelectorAll('section._3f-te').forEach(section => { const h2 = section.querySelector('h2._203-l'); if (h2?.textContent.trim() === 'Manage subscription') section.remove(); }); }
    };

    const init = async () => {
        if (!location.hostname.includes('duolingo.com')) return;
        jwt = utils.getJWT();
        if (!jwt) return;
        const decoded = utils.decodeJWT(jwt);
        if (!decoded) return;
        sub = decoded.sub;
        headers = utils.formatHeaders(jwt);
        try {
            userInfo = await api.getUserInfo();
            interceptFetch();
            interceptXHR();
            ui.create();
            const maxBtn = document.querySelector('#max-toggle');
            if (maxBtn) { maxBtn.classList.toggle('on', maxEnabled); maxBtn.classList.toggle('off', !maxEnabled); }
            ui.updateStats();
            ui.showNotification(maxEnabled ? 'Duolingo Master loaded! Max: ON' : 'Duolingo Master loaded! Max: OFF', 'success');
            ui.injectMaxBanner();
            const bannerObserver = new MutationObserver(() => {
                ui.injectMaxBanner();
                ui.removeManageSubscription();
            });
            bannerObserver.observe(document.documentElement, { childList: true, subtree: true });
            ui.removeManageSubscription();
        } catch (error) {
            console.error('Init failed:', error);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }
})();