// ==UserScript==
// @name         Heistora – Crafting rarity Chances Panel
// @namespace    https://heistora.com/
// @version      1.2.0
// @description  Crafting rarity chances panel with auto skill detection (Weaponsmith / Armorer)
// @match        https://www.heistora.com/game/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/561548/Heistora%20%E2%80%93%20Crafting%20rarity%20Chances%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/561548/Heistora%20%E2%80%93%20Crafting%20rarity%20Chances%20Panel.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ===================== CONFIG ===================== */
    const STORAGE_KEY = 'heistora_drop_chances_v1';

    const BASE = {
        MASTERPIECE: 0.1,
        EXCEPTIONAL: 0.9,
        SUPERIOR: 4,
        FINE: 7,
        ROUGH: 6,
        STANDARD: 82
    };

    const LVL100 = {
        MASTERPIECE: 2.1,
        EXCEPTIONAL: 7.9,
        SUPERIOR: 19.9,
        FINE: 29.3,
        ROUGH: 8.1,
        STANDARD: 32.7
    };

    /* ===================== STYLES ===================== */
    GM_addStyle(`
        #dc-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #101828;
            border: 1px solid rgba(255,255,255,0.15);
            color: #f59e0b;
            padding: 6px 12px;
            border-radius: 8px;
            cursor: pointer;
            z-index: 99999;
            font-size: 13px;
        }

        #dc-panel {
            position: fixed;
            bottom: 70px;
            right: 20px;
            width: 280px;
            background: #101828;
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 12px;
            color: #e5e5e5;
            font-family: Inter, sans-serif;
            z-index: 99999;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }

        #dc-panel.hidden { display: none; }

        #dc-header {
            padding: 10px 12px;
            cursor: move;
            font-weight: 600;
            color: #f59e0b;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        #dc-tabs {
            display: flex;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .dc-tab {
            flex: 1;
            padding: 6px;
            font-size: 12px;
            text-align: center;
            cursor: pointer;
            color: #9ca3af;
        }

        .dc-tab.active {
            color: #f59e0b;
            border-bottom: 2px solid #f59e0b;
        }

        #dc-content {
            padding: 10px;
            font-size: 12px;
        }

        #dc-content input {
            width: 100%;
            background: #0b1220;
            border: 1px solid rgba(255,255,255,0.15);
            color: #fff;
            padding: 6px;
            border-radius: 6px;
            margin-bottom: 8px;
        }

        #dc-table div {
            display: flex;
            justify-content: space-between;
            padding: 3px 0;
        }
    `);

    /* ===================== DOM ===================== */
    const toggle = document.createElement('div');
    toggle.id = 'dc-toggle';
    toggle.textContent = 'Craft rarity %';

    const panel = document.createElement('div');
    panel.id = 'dc-panel';
    panel.classList.add('hidden');
    panel.innerHTML = `
        <div id="dc-header">Crafting Rarity Chances</div>
        <div id="dc-tabs">
            <div class="dc-tab active" data-tab="manual">Manual</div>
            <div class="dc-tab" data-tab="weaponsmith">Weaponsmith</div>
            <div class="dc-tab" data-tab="armorer">Armorer</div>
        </div>
        <div id="dc-content">
            <input type="number" min="1" max="100" id="dc-level">
            <div id="dc-table"></div>
        </div>
    `;

    document.body.append(toggle, panel);

    /* ===================== STATE ===================== */
    const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    let activeTab = 'manual';

    /* ===================== DETECTION ===================== */
    function detectSkillLevel(skill) {
        const selectors = {
            weaponsmith: 'aside nav div:nth-child(2) a:nth-child(2) span.text-amber-400',
            armorer: 'aside nav div:nth-child(2) a.bg-gray-800 span.text-blue-400'
        };
        const el = document.querySelector(selectors[skill]);
        if (!el) return null;
        const v = parseInt(el.textContent.trim(), 10);
        return Number.isFinite(v) ? v : null;
    }

    /* ===================== LOGIC ===================== */
    function interpolate(min, max, lvl) {
        return min + (max - min) * ((lvl - 1) / 99);
    }

    function update(level) {
        const table = panel.querySelector('#dc-table');
        table.innerHTML = '';
        Object.keys(BASE).forEach(k => {
            const v = interpolate(BASE[k], LVL100[k], level).toFixed(2);
            table.innerHTML += `<div><span>${k}</span><span>${v} %</span></div>`;
        });
    }

    function setLevel(lvl) {
        panel.querySelector('#dc-level').value = lvl;
        update(lvl);
        state[activeTab] = lvl;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    /* ===================== EVENTS ===================== */
    toggle.onclick = () => panel.classList.toggle('hidden');

    panel.querySelectorAll('.dc-tab').forEach(tab => {
        tab.onclick = () => {
            panel.querySelectorAll('.dc-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeTab = tab.dataset.tab;

            let lvl = null;
            if (activeTab !== 'manual') lvl = detectSkillLevel(activeTab);
            if (lvl == null) lvl = state[activeTab] || 1;

            setLevel(lvl);
        };
    });

    panel.querySelector('#dc-level').oninput = e => {
        setLevel(Number(e.target.value));
    };

    /* ===================== DRAG ===================== */
    let drag = false, ox = 0, oy = 0;
    panel.querySelector('#dc-header').onmousedown = e => {
        drag = true;
        ox = e.clientX - panel.offsetLeft;
        oy = e.clientY - panel.offsetTop;
    };
    document.onmousemove = e => {
        if (!drag) return;
        panel.style.left = e.clientX - ox + 'px';
        panel.style.top = e.clientY - oy + 'px';
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
    };
    document.onmouseup = () => drag = false;

})();
