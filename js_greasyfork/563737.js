// ==UserScript==
// @name         Torn RR Mug View - Mobile Version
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Changes RR to Card view on mobile for mugging
// @author       bap
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563737/Torn%20RR%20Mug%20View%20-%20Mobile%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/563737/Torn%20RR%20Mug%20View%20-%20Mobile%20Version.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let apiKey = GM_getValue('torn_api_key_v3', '');
    let mugThreshold = parseInt(GM_getValue('tm_mug_threshold', 20000000)) || 20000000;
    let minPot = parseInt(GM_getValue('tm_min_pot', 0)) || 0;
    let hideHosp = GM_getValue('tm_hide_hosp', false);
    let autoSort = GM_getValue('tm_auto_sort', false);

    const mugPercent = 0.10;
    const playerCache = {};
    const gameTimers = {};

    GM_addStyle(`
        /* 1. Remove the Join Icon Entirely */
        .joinIcon___pCi7J { display: none !important; }

        @media screen and (max-width: 600px) {
            .row___CHcax {
                height: auto !important;
                min-height: 140px !important;
                display: block !important;
                padding: 10px !important;
                margin-bottom: 10px !important;
                background: #222 !important;
                border: 1px solid #444 !important;
                overflow: visible !important;
            }

            .topSection___BVsS0 {
                display: grid !important;
                grid-template-columns: 1.2fr 1fr !important;
                grid-template-rows: auto auto !important;
                gap: 10px !important;
                height: auto !important;
            }

            .userInfoBlock___VJvck { grid-area: 1 / 1 / 2 / 2 !important; width: 100% !important; font-size: 16px !important; }
            .betBlock___wz9ED { grid-area: 2 / 1 / 3 / 2 !important; width: 100% !important; color: #ff8e35 !important; font-size: 14px !important; text-align: left !important; }

            /* Intel Container */
            .tm-intel-container {
                grid-area: 1 / 2 / 3 / 3 !important;
                display: flex;
                flex-direction: column;
                justify-content: center;
                background: rgba(0,0,0,0.4);
                padding: 8px;
                border-radius: 5px;
                gap: 3px;
            }

            .tm-data-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 2px; }
            .tm-lbl { font-size: 8px; color: #999; text-transform: uppercase; }
            .tm-val { font-size: 11px; font-weight: bold; font-family: monospace; }

            .tm-atk-btn {
                display: block !important;
                background: #441111;
                color: #ff4444;
                text-align: center;
                padding: 6px 0;
                margin-top: 5px;
                border-radius: 3px;
                text-decoration: none;
                font-weight: bold;
                font-size: 12px;
                border: 1px solid #662222;
                text-transform: uppercase;
            }

            .columnsWrap___WW3tH, .statusBlock___j4JSQ { display: none !important; }
            .tm-row-hidden { display: none !important; }
        }

        /* Nav and Header Fixes */
        .title-black.top-round { position: relative !important; }
        .tm-header-refresh { position: absolute !important; right: 10px; top: 50%; transform: translateY(-50%); font-size: 22px; cursor: pointer; color: #ff8e35; z-index: 10; }
        .tm-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 999999; display: none; align-items: center; justify-content: center; }
        .tm-modal { background: #222; padding: 20px; border-radius: 10px; width: 85%; max-width: 320px; border: 1px solid #444; color: #eee; }
        .tm-modal input { width: 100%; background: #000; color: #fff; border: 1px solid #444; padding: 8px; margin: 8px 0; border-radius: 4px; }
        .tm-save-btn { background: #4caf50; color: #fff; width: 100%; padding: 12px; border: none; font-weight: bold; border-radius: 4px; margin-top: 10px; cursor: pointer; }
        .tm-mug-high { color: #a3ff00 !important; text-shadow: 0 0 5px #a3ff0066; }
    `);

    function updateTimers() {
        const now = Date.now();
        document.querySelectorAll('.tm-timer-val').forEach(el => {
            const startTime = parseInt(el.getAttribute('data-start'));
            const elapsed = Math.floor((now - startTime) / 1000);
            const remaining = (15 * 60) - elapsed;
            if (remaining <= 0) {
                el.textContent = "0:00";
            } else {
                const mins = Math.floor(remaining / 60);
                const secs = remaining % 60;
                el.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
            }
        });
    }

    function injectHeader() {
        const header = document.querySelector('.title-black.top-round');
        if (header && !document.querySelector('.tm-header-refresh')) {
            header.insertAdjacentHTML('beforeend', `<span class="tm-header-refresh">🔄</span>`);
            document.querySelector('.tm-header-refresh').onclick = () => location.reload();
        }
        const nav = document.querySelector('.linksContainer___LiOTN');
        if (nav && !document.querySelector('.tm-settings-link')) {
            nav.insertAdjacentHTML('beforeend', `<a class="linkContainer___X16y4 tm-settings-link" style="cursor:pointer"><span class="iconWrapper___x3ZLe">⚙️</span><span class="linkTitle____NPyM">Settings</span></a>`);
            document.querySelector('.tm-settings-link').onclick = () => document.querySelector('.tm-modal-overlay').style.display = 'flex';
        }
    }

    function createSettingsModal() {
        if (document.querySelector('.tm-modal-overlay')) return;
        const modal = document.createElement('div');
        modal.className = 'tm-modal-overlay';
        modal.innerHTML = `<div class="tm-modal"><h3>RR Settings</h3><label>API KEY</label><input type="text" id="set-api" value="${apiKey}"><label>MIN POT ($)</label><input type="number" id="set-min" value="${minPot}"><label>MUG GLOW ($)</label><input type="number" id="set-mug" value="${mugThreshold}"><div style="display:flex; justify-content:space-between; margin:10px 0;"><span>Hide Hosp</span><input type="checkbox" id="set-hosp" ${hideHosp ? 'checked' : ''}></div><div style="display:flex; justify-content:space-between; margin:10px 0;"><span>Auto Sort</span><input type="checkbox" id="set-sort" ${autoSort ? 'checked' : ''}></div><button class="tm-save-btn">SAVE & RELOAD</button></div>`;
        document.body.appendChild(modal);
        modal.onclick = (e) => { if(e.target === modal) modal.style.display = 'none'; };
        modal.querySelector('.tm-save-btn').onclick = () => {
            GM_setValue('torn_api_key_v3', document.getElementById('set-api').value);
            GM_setValue('tm_min_pot', document.getElementById('set-min').value);
            GM_setValue('tm_mug_threshold', document.getElementById('set-mug').value);
            GM_setValue('tm_hide_hosp', document.getElementById('set-hosp').checked);
            GM_setValue('tm_auto_sort', document.getElementById('set-sort').checked);
            location.reload();
        };
    }

    async function getPlayerData(xid) {
        if (playerCache[xid]) return playerCache[xid];
        return new Promise(res => {
            GM_xmlhttpRequest({
                method: 'GET', url: `https://api.torn.com/v2/user/${xid}/profile?key=${apiKey}`,
                onload: (r) => {
                    const p = JSON.parse(r.responseText);
                    playerCache[xid] = { hosp: p.profile.status.state === 'Hospital', act: p.profile.last_action.timestamp, online: p.profile.last_action.status.toLowerCase() === 'online' };
                    res(playerCache[xid]);
                }
            });
        });
    }

    function process() {
        const rows = Array.from(document.querySelectorAll('.row___CHcax'));
        rows.forEach(row => {
            if (row.hasAttribute('data-tm-processed')) return;
            const top = row.querySelector('.topSection___BVsS0');
            const userLink = row.querySelector('a[href*="profiles.php"]');
            const betEl = row.querySelector('.betBlock___wz9ED');
            if (!top || !userLink || !betEl) return;

            const xid = userLink.href.match(/XID=(\d+)/)[1];
            const bet = parseInt(betEl.textContent.replace(/[^0-9]/g, '')) || 0;
            const mugVal = Math.floor((bet * 2) * mugPercent);

            if (minPot > 0 && (bet * 2) < minPot) { row.classList.add('tm-row-hidden'); return; }

            const gameID = `${xid}-${bet}`;
            if (!gameTimers[gameID]) gameTimers[gameID] = Date.now();

            top.insertAdjacentHTML('beforeend', `
                <div class="tm-intel-container">
                    <div class="tm-data-row"><span class="tm-lbl">Act</span><span class="tm-val act-${xid}">...</span></div>
                    <div class="tm-data-row"><span class="tm-lbl">Mug</span><span class="tm-val mug-${xid} ${mugVal >= mugThreshold ? 'tm-mug-high' : ''}">$${(mugVal/1000000).toFixed(1)}m</span></div>
                    <div class="tm-data-row"><span class="tm-lbl">Hosp</span><span class="tm-val hosp-${xid}">-</span></div>
                    <div class="tm-data-row"><span class="tm-lbl">Time</span><span class="tm-val tm-timer-val" data-start="${gameTimers[gameID]}">15:00</span></div>
                    <a href="/loader.php?sid=attack&user2ID=${xid}" class="tm-atk-btn">ATTACK ⚔️</a>
                </div>
            `);

            row.setAttribute('data-tm-processed', 'true');
            getPlayerData(xid).then(data => {
                if (hideHosp && data.hosp) row.classList.add('tm-row-hidden');
                const actEl = row.querySelector(`.act-${xid}`);
                const hospEl = row.querySelector(`.hosp-${xid}`);
                if (actEl) {
                    const diff = Math.floor(Date.now()/1000) - data.act;
                    actEl.textContent = diff < 60 ? `${diff}s` : `${Math.floor(diff/60)}m`;
                    actEl.style.color = data.online ? '#44ff44' : '#ffff44';
                }
                // Updated Icon Logic: 🏥 if in Hospital, ❌ if NOT in Hospital
                if (hospEl) hospEl.textContent = data.hosp ? '🏥' : '❌';
            });
        });
    }

    setInterval(() => { injectHeader(); createSettingsModal(); process(); updateTimers(); }, 1000);
})();