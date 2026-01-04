// ==UserScript==
// @name         Torn PDA Dashboard
// @namespace    http://tampermonkey.net/
// @version      4.6
// @description  Painel completo de cooldowns com timers e valores (Bank CD atualizado do Dashboard - CD Timers)
// @author       Você
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/549712/Torn%20PDA%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/549712/Torn%20PDA%20Dashboard.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const API_KEY = 'CYMRDDN0Cuq2odBP';
    const UPDATE_INTERVAL = 60000;

    const cooldowns = {
        drug:      { value: 0, label: 'Drug CD',     link: 'https://www.torn.com/item.php#drugs-items' },
        medical:   { value: 0, label: 'Med CD',      link: 'https://www.torn.com/factions.php?step=your&type=1#/tab=armoury' },
        booster:   { value: 0, label: 'Booster CD',  link: 'https://www.torn.com/item.php?cat=14#candy-items' },
        travel:    { value: 0, label: 'Flight',      link: 'https://www.torn.com/page.php?sid=travel' },
        education: { value: 0, label: 'Education',   link: 'https://www.torn.com/page.php?sid=education' },
        bank:      { value: 0, label: 'Bank Invest', link: 'https://www.torn.com/bank.php' },
        energy:    { value: 0, label: 'E Refill',    link: 'https://www.torn.com/points.php' },
        oc:        { value: 0, label: 'OC',          link: 'https://www.torn.com/factions.php?step=your#/tab/crimes' }
    };

    let panelVisible = false;
    let energyRefillUsed = false;

    function init() {
        waitForDOM();
        setInterval(fetchAPIData, UPDATE_INTERVAL);
        fetchAPIData();
        setInterval(updateCounters, 1000);
    }

    function waitForDOM() {
        const sidebarroot = document.getElementById('sidebarroot');
        const pointsContainer = document.querySelector('.points-mobile___gpalH');
        if (sidebarroot && pointsContainer) {
            createToggleButton(pointsContainer);
            createPanel(sidebarroot);
        } else {
            setTimeout(waitForDOM, 300);
        }
    }

    function createToggleButton(container) {
        const toggleBtn = document.createElement('a');
        toggleBtn.className = 'point-block__rQyUK mobile__c7NBK';
        toggleBtn.href = '#';
        toggleBtn.innerHTML = '📊 <span style="font-weight:700;">Dashboard</span>';
        toggleBtn.style.cssText = 'cursor:pointer;display:flex;align-items:center;gap:5px;text-decoration:none;color:white;';
        toggleBtn.onclick = e => {
            e.preventDefault();
            togglePanel();
        };
        container.insertBefore(toggleBtn, container.firstChild);
    }

    function createPanel(sidebar) {
        const panel = document.createElement('div');
        panel.id = 'cd-main-panel';
        panel.style.cssText = `
            display: none;
            padding: 15px;
            background: #1e1e1e;
            color: white;
            border-bottom: 1px solid #333;
            width: 100%;
            box-sizing: border-box;
        `;

        const container = document.createElement('div');
        container.id = 'cd-container';
        container.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 12px;
        `;

        Object.entries(cooldowns).forEach(([key, data]) => {
            const item = document.createElement('a');
            item.href = data.link;
            item.dataset.key = key;
            item.style.cssText = `
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background: rgba(255,255,255,0.08);
                padding: 12px;
                border-radius: 10px;
                color: white;
                text-decoration: none;
                text-align: center;
                font-size: 14px;
            `;
            item.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 6px;">${data.label}</div>
                <div id="cd-${key}" style="font-family: monospace; font-size: 14px; margin-bottom: 4px;">--</div>
                <div id="cd-${key}-end" style="font-family: monospace; font-size: 11px; color:#aaa;">--</div>
            `;
            container.appendChild(item);
        });

        panel.appendChild(container);
        sidebar.parentNode.insertBefore(panel, sidebar.nextSibling);
    }

    function togglePanel() {
        const panel = document.getElementById('cd-main-panel');
        if (!panel) return;
        panelVisible = !panelVisible;
        panel.style.display = panelVisible ? 'block' : 'none';
        adjustContentPosition(panelVisible ? panel.offsetHeight : 0);
    }

    function adjustContentPosition(offset) {
        const wrapper = document.querySelector('#content-wrapper');
        if (wrapper) wrapper.style.marginTop = offset ? `${offset}px` : '';
    }

    function formatTime(seconds) {
        if (seconds <= 0) return '<span style="color:red;">Ready!</span>';
        const d = Math.floor(seconds / 86400);
        const h = Math.floor((seconds % 86400) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        const parts = [];
        if (d) parts.push(`${d}d`);
        if (h) parts.push(`${h}h`);
        if (m) parts.push(`${m}m`);
        parts.push(`${s}s`);

        if (seconds <= 14400) {
            return `<span style="color:yellow;">${parts.join(' ')}</span>`;
        } else {
            return `<span style="color:green;">${parts.join(' ')}</span>`;
        }
    }

    function formatEndTime(seconds) {
        if (seconds <= 0) return '';
        const end = new Date(Date.now() + seconds * 1000);
        return end.toLocaleString('it-IT', {
            timeZone: 'Europe/Rome',
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
        .replace(',', '')
        .replace(/\//g, '.');
    }

    function updateUI() {
        const container = document.getElementById('cd-container');
        if (!container) return;

        const timerItems = Object.entries(cooldowns)
            .map(([key, data]) => ({
                key,
                seconds: key === 'energy'
                    ? (energyRefillUsed ? 86400 - (new Date().getUTCHours() * 3600 + new Date().getUTCMinutes() * 60 + new Date().getUTCSeconds()) : 0)
                    : data.value
            }));

        timerItems.sort((a, b) => a.seconds - b.seconds);
        const newOrder = [...timerItems.map(item => item.key)];

        newOrder.forEach(k => {
            const element = container.querySelector(`[data-key="${k}"]`);
            if (element) {
                container.appendChild(element);
            }
        });

        Object.entries(cooldowns).forEach(([key, data]) => {
            const el = document.getElementById(`cd-${key}`);
            const elEnd = document.getElementById(`cd-${key}-end`);
            if (!el || !elEnd) return;
            el.innerHTML = formatTime(data.value);
            elEnd.innerHTML = formatEndTime(data.value);
        });
    }

    function updateCounters() {
        ['drug', 'medical', 'booster', 'travel', 'education', 'bank', 'oc'].forEach(k => {
            if (cooldowns[k].value > 0) cooldowns[k].value--;
        });
        updateRefillTimers();
        updateUI();
    }

    function updateRefillTimers() {
        const now = new Date();
        const utcSec = now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds();
        cooldowns.energy.value = energyRefillUsed ? 86400 - utcSec : 0;
    }

    function fetchAPIData() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.torn.com/user/?selections=cooldowns,travel,education,refills&key=${API_KEY}`,
            onload: res => {
                try {
                    const data = JSON.parse(res.responseText);
                    cooldowns.drug.value = data.cooldowns?.drug || 0;
                    cooldowns.medical.value = data.cooldowns?.medical || 0;
                    cooldowns.booster.value = data.cooldowns?.booster || 0;
                    cooldowns.travel.value = data.travel?.time_left || 0;
                    cooldowns.education.value = data.education_timeleft || 0;
                    energyRefillUsed = data.refills?.energy_refill_used || false;
                    updateRefillTimers();
                    updateUI();
                } catch (e) {
                    console.error('Error parsing cooldowns:', e);
                }
            }
        });

        // Bank cooldown usando o código do Dashboard - CD Timers
        GM_xmlhttpRequest({
            method:'GET',
            url: `https://api.torn.com/v2/user/personalstats?cat=investments&stat=&key=${API_KEY}&_=${Date.now()}`,
            headers: { 'Cache-Control': 'no-cache' },
            onload: res=>{
                try{
                    const json=JSON.parse(res.responseText);
                    const apiRem = json.personalstats?.investments?.bank?.time_remaining || 0;
                    cooldowns.bank.value = apiRem;
                    updateUI();
                }catch(e){console.error('bank fetch error', e);}
            }
        });

        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.torn.com/v2/user/organizedcrime?key=${API_KEY}`,
            onload: res => {
                try {
                    const data = JSON.parse(res.responseText);
                    const now = Math.floor(Date.now() / 1000);
                    let ready = data.organizedCrime?.ready_at || 0;
                    let missing = Array.isArray(data.organizedCrime?.slots)
                        ? data.organizedCrime.slots.filter(slot => slot.user === null).length
                        : data.organizedCrime.members?.filter(m => !m.user).length || 0;
                    ready += missing * 86400;
                    cooldowns.oc.value = Math.max(ready - now, 0);
                    updateUI();
                } catch (e) {
                    console.error('Error parsing OC data:', e);
                }
            }
        });
    }

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', init)
        : init();
})();
