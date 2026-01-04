// ==UserScript==
// @name          Torn - NPCtags/BazaarGlows1 by srsbsns
// @namespace     http://torn.com/
// @version       2.6.9
// @description   NPC tags on items/Bazaar glowing deals!
// @author        srsbsns
// @match         *://www.torn.com/bazaar.php*
// @match         *://www.torn.com/imarket.php*
// @match         *://www.torn.com/page.php?sid=ItemMarket*
// @grant         GM_addStyle
// @grant         GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560911/Torn%20-%20NPCtagsBazaarGlows1%20by%20srsbsns.user.js
// @updateURL https://update.greasyfork.org/scripts/560911/Torn%20-%20NPCtagsBazaarGlows1%20by%20srsbsns.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- SHARED DATA ---
    const S_KEY = 'torn_arbiter_api_key';
    const S_CAT = 'torn_arbiter_catalog';
    const S_TS  = 'torn_arbiter_ts';
    let igniteSettings = JSON.parse(localStorage.getItem('igniteSettings')) || {
        yellow: 3, yellowEnabled: true,
        orange: 10, orangeEnabled: true,
        red: 20, redEnabled: true,
        rainbowEnabled: true
    };

    const isBazaar = window.location.href.includes('bazaar.php');

    // --- CSS STYLES ---
    GM_addStyle(`
        .npc-tag {
            background: rgba(0, 0, 0, 0.85) !important;
            color: #76c776 !important;
            font-size: 10px !important;
            padding: 1px 4px !important;
            border-radius: 2px !important;
            position: absolute !important;
            top: 2px !important;
            left: 2px !important;
            z-index: 10 !important;
            border: 1px solid rgba(118, 199, 118, 0.5) !important;
            pointer-events: none !important;
        }

        @keyframes neonPulse {
            0% { box-shadow: 0 0 5px #66FF00; border-color: #66FF00; }
            50% { box-shadow: 0 0 15px #66FF00; border-color: #fff; }
            100% { box-shadow: 0 0 5px #66FF00; border-color: #66FF00; }
        }

        .profit-glow .npc-tag {
            background: #004400 !important;
            color: #fff !important;
            animation: neonPulse 1.2s infinite ease-in-out !important;
            font-weight: bold !important;
        }

        .profit-glow { outline: 2px solid rgba(102, 255, 0, 0.8) !important; z-index: 5 !important; }

        @keyframes inner-flicker {
            0% { box-shadow: inset 0 0 15px var(--fire-color); }
            50% { box-shadow: inset 0 0 25px var(--fire-color); }
            100% { box-shadow: inset 0 0 18px var(--fire-color); }
        }

        @keyframes rainbow-flow {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
        }

        @keyframes star-sparkle {
            0% { opacity: 0.3; transform: scale(0.7) rotate(0deg); filter: drop-shadow(0 0 2px gold); }
            50% { opacity: 1; transform: scale(1.1) rotate(20deg); filter: drop-shadow(0 0 8px yellow); }
            100% { opacity: 0.3; transform: scale(0.7) rotate(0deg); filter: drop-shadow(0 0 2px gold); }
        }

        .sparkle-star {
            position: absolute !important;
            right: 15px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            font-size: 24px !important;
            animation: star-sparkle 1.5s infinite ease-in-out;
            pointer-events: none !important;
            z-index: 15 !important;
        }

        .ignite-active { position: relative; overflow: hidden !important; border-radius: 4px; z-index: 1; }
        .ignite-yellow { --fire-color: rgba(255, 255, 0, 0.4); border: 2px solid #ffff00 !important; box-shadow: inset 0 0 15px var(--fire-color); }
        .ignite-orange { --fire-color: rgba(255, 140, 0, 0.5); border: 2px solid #ff8c00 !important; box-shadow: inset 0 0 15px var(--fire-color); }
        .ignite-red { --fire-color: rgba(255, 0, 0, 0.7); border: 2px solid #ff0000 !important; animation: inner-flicker 1.5s infinite alternate ease-in-out; }

        .ignite-rainbow {
            border: none !important;
            background: linear-gradient(90deg,
                rgba(255, 0, 0, 0.3),
                rgba(255, 165, 0, 0.3),
                rgba(255, 255, 0, 0.3),
                rgba(0, 255, 0, 0.3),
                rgba(0, 0, 255, 0.3),
                rgba(75, 0, 130, 0.3),
                rgba(238, 130, 238, 0.3),
                rgba(255, 0, 0, 0.3)) !important;
            background-size: 200% 100% !important;
            animation: rainbow-flow 6s linear infinite !important;
            box-shadow: inset 0 0 25px rgba(0,0,0,0.5) !important;
            z-index: 10 !important;
        }

        /* REMOVED OPACITY/BACKING FROM TEXT */
        .ignite-rainbow span, .ignite-rainbow p, .ignite-rainbow div {
            color: #fff !important;
            background: transparent !important; /* Ensures no background box */
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5) !important; /* Subtle shadow for readability only */
            font-weight: bold !important;
        }

        .rainbow-label {
            background: linear-gradient(to right, #ff4444, #ff8c00, #ffff00, #44ff44, #4444ff, #8a2be2, #ff4444);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: bold;
        }

        #ignite-menu { position: fixed; bottom: 45px; left: 20px; z-index: 999999; background: #222; color: #ccc; border: 1px solid #444; border-radius: 5px; font-family: Tahoma, Arial, sans-serif; width: 160px; box-shadow: 0 0 10px #000; }
        #ignite-header { padding: 6px; cursor: pointer; background: #333; border-radius: 5px; font-weight: bold; font-size: 11px; text-align: center; color: #fff; }
        #ignite-content { display: none; padding: 8px; border-top: 1px solid #444; }
        .ignite-row { margin-bottom: 6px; display: flex; align-items: center; gap: 5px; font-size: 10px; }
        .ignite-row input[type="number"] { width: 32px; background: #000; color: #fff; border: 1px solid #555; text-align: center; border-radius: 2px; margin-left: auto; font-size: 10px; padding: 1px; }
        #ignite-save { width: 100%; cursor: pointer; background: #ce1111; color: #fff; border: none; padding: 5px; border-radius: 3px; font-weight: bold; font-size: 10px; margin-top: 4px; }
    `);

    // Logic remains exactly as before
    async function fetchCatalog(force = false) {
        const key = GM_getValue(S_KEY, '');
        const lastFetch = GM_getValue(S_TS, 0);
        const now = Date.now();
        if (!force && lastFetch && (now - lastFetch < 12 * 3600 * 1000)) return;
        if (!key) return;
        GM_xmlhttpRequest({
            method: 'GET', url: `https://api.torn.com/torn/?selections=items&key=${key}`,
            onload: (res) => {
                try {
                    const data = JSON.parse(res.responseText);
                    if (data.items) {
                        const catalog = {};
                        for (const id in data.items) { catalog[data.items[id].name.toLowerCase()] = data.items[id].sell_price; }
                        GM_setValue(S_CAT, JSON.stringify(catalog));
                        GM_setValue(S_TS, now);
                    }
                } catch (e) { console.error('API Error', e); }
            }
        });
    }

    function runNpcLogic(items) {
        if (window.location.hash.includes('add') || window.location.href.includes('manage') ||
            document.querySelector('.bazaar-main-wrap') || document.querySelector('.add-items-wrap')) return;
        const catalog = JSON.parse(GM_getValue(S_CAT, '{}'));
        items.forEach(item => {
            if (item.closest('#search-container, .search-results, .search-dropdown, .ui-autocomplete, #header-root')) return;
            if (item.querySelector('[class*="lock"], i[class*="fa-lock"]') || item.innerHTML.includes('lock')) return;
            const text = item.innerText; if (!text) return;

            const spans = item.querySelectorAll('span, p, div');
            const isOneDollar = Array.from(spans).some(el => el.textContent.trim() === '$1');
            if (isOneDollar) {
                const existingTag = item.querySelector('.npc-tag');
                if (existingTag) existingTag.remove();
                return;
            }

            const lines = text.split('\n').map(l => l.trim().toLowerCase());
            for (let i = 0; i < Math.min(lines.length, 3); i++) {
                const name = lines[i].replace(/ x\d+$/, '').replace(/^stock /, '');
                if (catalog[name]) {
                    const floor = catalog[name]; if (floor <= 1) return;
                    if (!item.querySelector('.npc-tag')) {
                        const tag = document.createElement('div');
                        tag.className = 'npc-tag'; tag.innerText = `NPC: $${floor.toLocaleString()}`;
                        item.style.position = 'relative'; item.appendChild(tag);
                    }
                    const priceMatch = text.replace(/,/g, '').match(/\$([\d,]+)/);
                    if (priceMatch) {
                        const currentPrice = parseInt(priceMatch[1].replace(/,/g, ''));
                        if (currentPrice < floor) item.classList.add('profit-glow');
                        else item.classList.remove('profit-glow');
                    }
                    break;
                }
            }
        });
    }

    function runIgniteLogic(items) {
        if (!isBazaar) return;
        items.forEach(item => {
            item.classList.remove('ignite-active', 'ignite-yellow', 'ignite-orange', 'ignite-red', 'ignite-rainbow');
            if (item.querySelector('svg[class*="lock"], img[src*="lock"], [class*="locked"]')) return;

            if (igniteSettings.rainbowEnabled) {
                const spans = item.querySelectorAll('span, p, div');
                if (Array.from(spans).some(el => el.textContent.trim() === '$1')) {
                    item.classList.add('ignite-active', 'ignite-rainbow');
                    if (!item.querySelector('.sparkle-star')) {
                        const star = document.createElement('span');
                        star.className = 'sparkle-star';
                        star.innerText = '⭐';
                        item.appendChild(star);
                    }
                    return;
                }
            }

            const possibleNodes = item.querySelectorAll('span, font');
            possibleNodes.forEach(node => {
                const text = node.textContent; const match = text.match(/(\d+)%/);
                if (match) {
                    const style = window.getComputedStyle(node);
                    const rgb = style.color.match(/\d+/g);
                    if (rgb && rgb.length >= 3) {
                        const r = parseInt(rgb[0]), g = parseInt(rgb[1]), b = parseInt(rgb[2]);
                        if ((g > (r + 40)) && (g > (b + 40))) {
                            const percent = parseInt(match[1]);
                            if (percent >= igniteSettings.red && igniteSettings.redEnabled) item.classList.add('ignite-active', 'ignite-red');
                            else if (percent >= igniteSettings.orange && igniteSettings.orangeEnabled) item.classList.add('ignite-active', 'ignite-orange');
                            else if (percent >= igniteSettings.yellow && igniteSettings.yellowEnabled) item.classList.add('ignite-active', 'ignite-yellow');
                        }
                    }
                }
            });
        });
    }

    function masterUpdate() {
        const items = document.querySelectorAll('li, [class*="bazaar-card"], [class*="item_"], [class*="item___"], .market-main-wrap .row');
        runNpcLogic(items);
        runIgniteLogic(items);
    }

    GM_registerMenuCommand('Set API Key', () => {
        const key = prompt('Enter your Torn API Key:', GM_getValue(S_KEY, ''));
        if (key !== null) { GM_setValue(S_KEY, key.trim()); fetchCatalog(true); }
    });

    if (isBazaar) {
        const menu = document.createElement('div');
        menu.id = 'ignite-menu';
        menu.innerHTML = `<div id="ignite-header">🔥 Sniper Settings</div>
            <div id="ignite-content">
                <div class="ignite-row"><input type="checkbox" id="check-rainbow" ${igniteSettings.rainbowEnabled ? 'checked' : ''}><label class="rainbow-label">Rainbow $1</label></div>
                <div class="ignite-row"><input type="checkbox" id="check-red" ${igniteSettings.redEnabled ? 'checked' : ''}><label style="color:#ff4444;">Red %</label><input type="number" id="in-red" value="${igniteSettings.red}"></div>
                <div class="ignite-row"><input type="checkbox" id="check-orange" ${igniteSettings.orangeEnabled ? 'checked' : ''}><label style="color:orange;">Orange %</label><input type="number" id="in-orange" value="${igniteSettings.orange}"></div>
                <div class="ignite-row"><input type="checkbox" id="check-yellow" ${igniteSettings.yellowEnabled ? 'checked' : ''}><label style="color:yellow;">Yellow %</label><input type="number" id="in-yellow" value="${igniteSettings.yellow}"></div>
                <button id="ignite-save">Save & Apply</button>
            </div>`;
        document.body.appendChild(menu);
        document.getElementById('ignite-header').onclick = () => {
            const c = document.getElementById('ignite-content');
            c.style.display = (c.style.display === 'block') ? 'none' : 'block';
        };
        document.getElementById('ignite-save').onclick = () => {
            igniteSettings.rainbowEnabled = document.getElementById('check-rainbow').checked;
            igniteSettings.redEnabled = document.getElementById('check-red').checked;
            igniteSettings.orangeEnabled = document.getElementById('check-orange').checked;
            igniteSettings.yellowEnabled = document.getElementById('check-yellow').checked;
            igniteSettings.red = parseFloat(document.getElementById('in-red').value);
            igniteSettings.orange = parseFloat(document.getElementById('in-orange').value);
            igniteSettings.yellow = parseFloat(document.getElementById('in-yellow').value);
            localStorage.setItem('igniteSettings', JSON.stringify(igniteSettings));
            location.reload();
        };
    }

    fetchCatalog();
    const observer = new MutationObserver(masterUpdate);
    observer.observe(document.body, { childList: true, subtree: true });
    masterUpdate();
})();