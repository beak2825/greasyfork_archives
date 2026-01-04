// ==UserScript==
// @name         PT 站点活跃度预警系统 (最终修复版)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  基于剩余天数主动预警PT站点的活跃度，UI分级高亮，并在最后一天弹窗警告。
// @author       Gemini & YourName
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559465/PT%20%E7%AB%99%E7%82%B9%E6%B4%BB%E8%B7%83%E5%BA%A6%E9%A2%84%E8%AD%A6%E7%B3%BB%E7%BB%9F%20%28%E6%9C%80%E7%BB%88%E4%BF%AE%E5%A4%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559465/PT%20%E7%AB%99%E7%82%B9%E6%B4%BB%E8%B7%83%E5%BA%A6%E9%A2%84%E8%AD%A6%E7%B3%BB%E7%BB%9F%20%28%E6%9C%80%E7%BB%88%E4%BF%AE%E5%A4%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

// --- 1. 用户配置 ---
    const siteSettings = [
        // --- 重要的网站 ---
        { domain: 'pterclub.net', days: 58, name: '猫站', important: true },
        { domain: 'open.cd', days: 88, name: '皇后', important: true },
        { domain: 'ourbits.club', days: 148, name: '我堡', important: true },
        { domain: 'hdhome.org', days: 58, name: '家园', important: true },
        { domain: 'chdbits.xyz', days: 43, name: 'CHD', important: true },
        { domain: 'audiences.me', days: 98, name: '观众', important: true },   //根据用户等级修改！！！
        { domain: 'hhanclub.top', days: 28, name: '憨憨', important: true },
        { domain: 'pt.keepfrds.com', days: 33, name: '朋友', important: true },
        { domain: 'totheglory.im', days: 80, name: 'TTG', important: true },    //12周
        { domain: 'ob.m-team.cc', days: 38, name: '馒头', important: true },
        // --- 其他网站 ---
        { domain: 'kufei.org', days: 148, name: '库非' },
        { domain: 'hdtime.org', days: 148, name: 'HD时光' }, 
        { domain: '1ptba.com', days: 148, name: '1PT' },
        { domain: 'ptcafe.club', days: 178, name: '咖啡' },
        { domain: 'rousi.zip', days: 148, name: '肉丝' },
        { domain: 'ptlgs.org', days: 28, name: '劳改所' }, //超过30天不活跃的账号将被系统自动封禁。 活跃判定方法：当有未读公告时，需手动确认公告已读才算活跃；当没有未读公告时，需访问首页才算活跃。
        { domain: 'hdfans.org', days: 88, name: '红豆饭' },
        { domain: 'sunnypt.top', days: 148, name: 'Sunny' },
        { domain: 'www.agsvpt.com', days: 148, name: '末日' },
        { domain: 'qingwapt.com', days: 88, name: '青蛙' },
        { domain: 'xingtan.one', days: 58, name: '杏坛' },
        { domain: 'u2.dmhy.org', days: 88, name: 'U2动漫' },
        { domain: 'zmpt.cc', days: 43, name: '织梦' },
        { domain: 'hdkyl.in', days: 178, name: '麒麟' },
        { domain: 'ubits.club', days: 58, name: '你堡' }
    ];
    // --------------------


    // --- 2. 脚本核心逻辑 ---
    const STORAGE_KEY = 'pt_tracker_data';
    const GLOBAL_ALERT_KEY = 'pt_tracker_global_alert_date';

    async function loadData(key, defaultValue) { return await GM_getValue(key, defaultValue); }
    async function saveData(key, value) { await GM_setValue(key, value); }

    async function checkAndUpdateCurrentSite() {
        const storedData = await loadData(STORAGE_KEY, {});
        const currentHost = window.location.hostname;
        for (const site of siteSettings) {
            if (currentHost === site.domain || currentHost.endsWith('.' + site.domain)) {
                const now = new Date().toISOString();
                if (storedData[site.domain] !== now) {
                    storedData[site.domain] = now;
                    await saveData(STORAGE_KEY, storedData);
                    console.log(`[PT Tracker] 已刷新站点: ${site.name || site.domain}`);
                }
                return;
            }
        }
    }

    // --- 3. UI 创建与更新 (已修复) ---
    function createUI() {
        GM_addStyle(`
            #pt-tracker-container { position: fixed; top: 300px; right: 10px; z-index: 2147483647; }
            #pt-tracker-ui { padding: 2px 8px; min-width: 20px; height: 20px; background-color: #f0f0f0; border: 1px solid #ccc; border-radius: 4px; display: flex; justify-content: center; align-items: center; font-size: 12px; font-family: monospace; cursor: pointer; box-shadow: 0 0 5px rgba(0,0,0,0.2); }
            #pt-tracker-tooltip { visibility: hidden; position: absolute; top: 100%; right: 0; padding-top: 5px; background-color: transparent; opacity: 0; transition: opacity 0.3s, visibility 0.3s; pointer-events: none; }
            #pt-tracker-tooltip-content { background-color: white; color: black; padding: 10px; border-radius: 4px; font-size: 12px; font-family: sans-serif; white-space: nowrap; text-align: left; border: 1px solid #ddd; max-height: 80vh; overflow-y: auto; pointer-events: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
            #pt-tracker-tooltip-content a { text-decoration: none; }
            #pt-tracker-tooltip-content a:hover { text-decoration: underline; }
            #pt-tracker-container:hover #pt-tracker-tooltip { visibility: visible; opacity: 1; }
            #pt-tracker-open-all { display: block; margin-top: 8px; padding: 4px; background-color: #007bff; color: white; text-align: center; border-radius: 3px; cursor: pointer; font-weight: bold;}
            #pt-tracker-open-all:hover { background-color: #0056b3; }
        `);

        const container = document.createElement('div');
        container.id = 'pt-tracker-container';
        const uiCounter = document.createElement('div');
        uiCounter.id = 'pt-tracker-ui';
        const tooltip = document.createElement('div');
        tooltip.id = 'pt-tracker-tooltip';
        tooltip.innerHTML = `<div id="pt-tracker-tooltip-content"></div>`;
        container.appendChild(uiCounter);
        container.appendChild(tooltip);
        document.body.appendChild(container);

        return {
            uiCounter: uiCounter,
            tooltipContent: tooltip.querySelector('#pt-tracker-tooltip-content')
        };
    }

    async function updateUI({ uiCounter, tooltipContent }) {
        const storedData = await loadData(STORAGE_KEY, {});
        const now = new Date();
        const siteStates = [];

        for (const site of siteSettings) {
            const lastVisitStr = storedData[site.domain];
            let state = { ...site, tier: 'green', statusText: '', daysRemaining: Infinity };
            if (lastVisitStr) {
                const daysSinceVisit = Math.floor((now - new Date(lastVisitStr)) / (1000 * 60 * 60 * 24));
                const daysRemaining = site.days - daysSinceVisit;
                state.daysRemaining = daysRemaining;
                if (daysRemaining <= 3) state.tier = 'red';
                else if (daysRemaining <= 6) state.tier = 'pink';
                state.statusText = daysRemaining >= 0 ? `(剩余安全期: ${daysRemaining}天)` : `(已过期: ${-daysRemaining}天)`;
            } else {
                state.tier = 'red';
                state.statusText = `(从未访问过)`;
            }
            siteStates.push(state);
        }

        const greenSites = siteStates.filter(s => s.tier === 'green').sort((a, b) => b.daysRemaining - a.daysRemaining);
        const pinkSites = siteStates.filter(s => s.tier === 'pink').sort((a,b) => a.daysRemaining - b.daysRemaining);
        const redSites = siteStates.filter(s => s.tier === 'red').sort((a,b) => a.daysRemaining - b.daysRemaining);

        let contentHTML = '';
        const atRiskDomains = [];

        const renderSite = (site) => {
            const displayName = site.name || site.domain;
            const nameColor = site.important ? 'red' : 'black';
            let statusColor = 'grey';
            if (site.tier === 'red') statusColor = 'red';
            else if (site.tier === 'pink') statusColor = 'hotpink';
            else if (site.tier === 'green') statusColor = 'green';
            return `<div><a href="https://${site.domain}" target="_blank" style="color:${nameColor}; font-weight:${site.important ? 'bold' : 'normal'};">${displayName}</a> <span style="color:${statusColor};">${site.statusText}</span></div>`;
        };

        redSites.forEach(s => { contentHTML += renderSite(s); atRiskDomains.push(s.domain); });
        pinkSites.forEach(s => { contentHTML += renderSite(s); atRiskDomains.push(s.domain); });
        if ((redSites.length > 0 || pinkSites.length > 0) && greenSites.length > 0) {
            contentHTML += '<hr style="margin: 5px 0; border: none; border-top: 1px solid #eee;">';
        }
        greenSites.forEach(s => { contentHTML += renderSite(s); });
        if (atRiskDomains.length > 0) {
            contentHTML += `<div id="pt-tracker-open-all">一键打开 ${atRiskDomains.length} 个风险站点</div>`;
        }

        uiCounter.innerHTML = `
            <span style="color: green; font-weight: bold;">${greenSites.length}</span>
            <span style="margin: 0 2px;">/</span>
            <span style="color: hotpink; font-weight: bold;">${pinkSites.length}</span>
            <span style="margin: 0 2px;">/</span>
            <span style="color: red; font-weight: bold;">${redSites.length}</span>
        `;

        tooltipContent.innerHTML = contentHTML;

        const openAllButton = document.getElementById('pt-tracker-open-all');
        if (openAllButton) {
            openAllButton.addEventListener('click', () => {
                atRiskDomains.forEach(domain => GM_openInTab(`https://${domain}`, { active: false }));
            });
        }
    }

    async function checkAndShowAlerts() {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const lastAlertDate = await loadData(GLOBAL_ALERT_KEY, '');
        if (lastAlertDate === todayStr) { return; }
        const storedData = await loadData(STORAGE_KEY, {});
        let needsAlert = false;
        for (const site of siteSettings) {
            const lastVisitStr = storedData[site.domain];
            let daysRemaining = -1;
            if (lastVisitStr) {
                daysRemaining = site.days - Math.floor((now - new Date(lastVisitStr)) / (1000 * 60 * 60 * 24));
            }
            if (daysRemaining <= 1) {
                needsAlert = true;
                break;
            }
        }
        if (needsAlert) {
            alert('您有PT站点不活跃，即将封禁！');
            await saveData(GLOBAL_ALERT_KEY, todayStr);
        }
    }

    async function main() {
        const uiElements = createUI();
        await checkAndUpdateCurrentSite();
        await updateUI(uiElements);
        await checkAndShowAlerts();
    }

    if (document.readyState === 'complete') { main(); }
    else { window.addEventListener('load', main); }

})();