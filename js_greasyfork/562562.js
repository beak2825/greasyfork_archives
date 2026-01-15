// ==UserScript==
// @name         Torn Tactical Target HUD
// @namespace    Gemini.Torn.Target.HUD
// @version      1.1
// @description  Persistent sniper HUD with health, activity, H:M:S timers, and profile injector.
// @author       TornPlayer
// @license      MIT
// @match        https://www.torn.com/*
// @connect      api.torn.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562562/Torn%20Tactical%20Target%20HUD.user.js
// @updateURL https://update.greasyfork.org/scripts/562562/Torn%20Tactical%20Target%20HUD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let API_KEY = GM_getValue("torn_hud_apikey", "");
    let targets = GM_getValue("stalker_sniper_v2", []);
    let targetData = {};

    const style = document.createElement('style');
    style.innerHTML = `
        #stalker-hud { 
            position: fixed !important; top: 135px !important; right: 20px !important; 
            width: 260px !important; background: #000 !important; border: 1px solid #444 !important; 
            border-radius: 6px !important; color: #fff !important; z-index: 999999 !important;
            font-family: 'Courier New', monospace !important; pointer-events: auto !important;
            box-shadow: 0 0 15px rgba(0,0,0,0.8) !important;
        }
        .hud-hdr { background: #222; padding: 8px; text-align: center; font-weight: bold; border-radius: 6px 6px 0 0; cursor: pointer; font-size: 11px; border-bottom: 1px solid #333; letter-spacing: 1px; font-family: sans-serif; }
        .hud-inner { padding: 8px; max-height: 400px; overflow-y: auto; }
        .setup-box { display: flex; flex-direction: column; gap: 5px; padding: 5px; }
        .setup-box input { background: #111; border: 1px solid #444; color: #fff; padding: 5px; font-size: 11px; }
        .input-row { display: flex; gap: 4px; margin-bottom: 8px; }
        input#id-in { background: #111; border: 1px solid #444; color: #fff; padding: 4px; width: 45%; border-radius: 3px; font-size: 11px; }
        .btn-sm { background: #333; color: #fff; border: 1px solid #444; padding: 4px; cursor: pointer; font-size: 9px; flex-grow: 1; border-radius: 3px; font-weight: bold; font-family: sans-serif; }
        .btn-sm:hover { background: #444; border-color: #666; }
        
        .card { background: #0a0a0a; padding: 6px 8px; margin-bottom: 5px; border-left: 3px solid #333; position: relative; border-radius: 3px; border: 1px solid #1a1a1a; }
        .pname-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; line-height: 1; }
        .pname { color: #fff; text-decoration: none; font-weight: bold; font-size: 12px; font-family: sans-serif; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 130px; }
        .plevel { color: #888; font-size: 10px; font-family: sans-serif; }
        
        .health-bg { background: #222; height: 3px; width: 100%; border-radius: 1px; margin-bottom: 5px; overflow: hidden; }
        .health-fill { height: 100%; transition: width 0.3s; }

        .status-line { display: flex; justify-content: space-between; align-items: center; height: 18px; }
        .ptag { font-size: 9px; padding: 1px 4px; border-radius: 2px; text-transform: uppercase; font-family: sans-serif; font-weight: bold; }
        .tag-okay { background: #27ae60; }
        .tag-hospital { background: #c0392b; }
        .tag-abroad, .tag-traveling { background: #2980b9; }
        
        .activity-text { font-size: 9px; color: #666; font-family: sans-serif; margin-top: 1px; }
        .live-timer { font-weight: bold; color: #f1c40f; font-size: 12px; }
        
        .quick-links { display: flex; background: #111; border-radius: 0 0 6px 6px; }
        .nav-btn { flex: 1; text-align: center; padding: 7px; color: #bbb; text-decoration: none; font-size: 10px; border-top: 1px solid #333; font-family: sans-serif; font-weight: bold; }
        .nav-btn:hover { color: #fff; background: #222; }
        .remove-target { position: absolute; right: 4px; top: 0px; cursor: pointer; color: #333; font-size: 14px; }
        .remove-target:hover { color: #e74c3c; }

        .hud-add-profile-btn {
            background: #333; color: #fff; border: 1px solid #444; 
            padding: 2px 8px; cursor: pointer; font-size: 12px; 
            border-radius: 4px; margin-left: 10px; font-family: sans-serif;
            vertical-align: middle; display: inline-block;
        }
        .hud-add-profile-btn:hover { background: #27ae60; border-color: #2ecc71; }
    `;
    document.head.appendChild(style);

    function update(id) {
        if (!API_KEY) return;
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/user/${id}?selections=profile&key=${API_KEY}`,
            onload: function(r) {
                try {
                    const d = JSON.parse(r.responseText);
                    if (d && d.name) {
                        targetData[id] = { 
                            id: id, name: d.name, level: d.level,
                            hp: d.life.current, hpMax: d.life.max,
                            state: d.status.state, until: d.status.until,
                            lastAction: d.last_action.relative
                        };
                        render();
                    }
                } catch(e) { console.error("HUD Update Error", e); }
            }
        });
    }

    function render() {
        const hud = document.getElementById('stalker-hud');
        if (!hud) return;
        const inner = hud.querySelector('.hud-inner');
        
        if (!API_KEY) {
            inner.innerHTML = `<div class="setup-box"><div style="font-size:10px; color:#aaa; margin-bottom:5px;">Enter API Key:</div><input type="text" id="api-input" placeholder="Paste Key Here"><button id="save-api-btn" class="btn-sm">SAVE KEY</button></div>`;
            const sbtn = document.getElementById('save-api-btn');
            if(sbtn) sbtn.onclick = () => {
                const val = document.getElementById('api-input').value.trim();
                if (val.length > 10) { GM_setValue("torn_hud_apikey", val); location.reload(); }
            };
            return;
        }

        if (!inner.querySelector('#hud-list')) {
            inner.innerHTML = `<div class="input-row"><input type="number" id="id-in" placeholder="ID"><button id="add-btn" class="btn-sm">ADD</button><button id="sort-btn" class="btn-sm">SORT</button></div><div id="hud-list"></div><div style="text-align:right; margin-top:5px;"><span id="reset-api" style="font-size:8px; color:#444; cursor:pointer;">Reset API</span></div>`;
            document.getElementById('add-btn').onclick = () => {
                const val = document.getElementById('id-in').value;
                if (val) addTarget(val);
            };
            document.getElementById('sort-btn').onclick = sortTargets;
            document.getElementById('reset-api').onclick = () => { GM_setValue("torn_hud_apikey", ""); location.reload(); };
        }

        const list = document.getElementById('hud-list');
        list.innerHTML = '';
        targets.forEach(t => {
            const data = targetData[t.id] || { name: "...", level: "..", hp: 0, hpMax: 100, state: "Wait", until: 0, lastAction: "" };
            const hpPct = Math.max(0, Math.min(100, Math.floor((data.hp / data.hpMax) * 100)));
            const hpColor = hpPct < 30 ? "#c0392b" : (hpPct < 70 ? "#d35400" : "#27ae60");
            const div = document.createElement('div');
            div.className = 'card';
            div.innerHTML = `
                <span class="remove-target" data-id="${t.id}">×</span>
                <div class="pname-row"><a href="/loader.php?sid=attack&user2ID=${t.id}" class="pname">${data.name}</a><span class="plevel">Lvl ${data.level}</span></div>
                <div class="health-bg"><div class="health-fill" style="width: ${hpPct}%; background: ${hpColor};"></div></div>
                <div class="status-line"><div><span class="ptag tag-${data.state.toLowerCase()}">${data.state}</span><div class="activity-text">${data.lastAction}</div></div><span class="live-timer" id="timer-${t.id}"></span></div>
            `;
            list.appendChild(div);
        });

        document.querySelectorAll('.remove-target').forEach(btn => {
            btn.onclick = () => {
                const id = parseInt(btn.getAttribute('data-id'));
                targets = targets.filter(x => x.id !== id);
                GM_setValue("stalker_sniper_v2", targets);
                render();
            };
        });
    }

    function addTarget(id) {
        id = parseInt(id);
        if (!id || targets.some(t => t.id === id)) return;
        targets.push({id: id});
        GM_setValue("stalker_sniper_v2", targets);
        update(id);
        const input = document.getElementById('id-in');
        if(input) input.value = '';
    }

    function injectProfileButton() {
        try {
            if (!window.location.href.includes("profiles.php")) return;
            const nameContainer = document.querySelector('.profile-wrapper .name');
            if (nameContainer && !document.getElementById('hud-quick-add')) {
                const params = new URLSearchParams(window.location.search);
                const playerID = params.get('XID') || params.get('user2ID');
                if(!playerID) return;

                const btn = document.createElement('button');
                btn.id = 'hud-quick-add';
                btn.className = 'hud-add-profile-btn';
                btn.innerText = '+ HUD';
                btn.onclick = () => { addTarget(playerID); btn.innerText = 'ADDED'; btn.style.background = '#27ae60'; };
                nameContainer.appendChild(btn);
            }
        } catch(e) {}
    }

    function sortTargets() {
        const now = Math.floor(Date.now() / 1000);
        targets.sort((a, b) => {
            const d1 = targetData[a.id], d2 = targetData[b.id];
            if (!d1 || !d2) return 0;
            const t1 = Math.max(0, d1.until - now), t2 = Math.max(0, d2.until - now);
            if (t1 === 0 && d1.state !== "Okay") return -1;
            if (t2 === 0 && d2.state !== "Okay") return 1;
            return t1 - t2;
        });
        render();
    }

    function tick() {
        const now = Math.floor(Date.now() / 1000);
        targets.forEach(t => {
            const data = targetData[t.id];
            if (!data || !data.until) return;
            const el = document.getElementById(`timer-${t.id}`);
            if (!el) return;
            const diff = data.until - now;
            if (diff > 0) {
                const h = Math.floor(diff / 3600);
                const m = Math.floor((diff % 3600) / 60);
                const s = diff % 60;
                let display = (h > 0 ? h + ":" : "") + m.toString().padStart(h > 0 ? 2 : 1, '0') + ":" + s.toString().padStart(2, '0');
                el.innerText = display;
                el.style.color = (diff <= 180) ? "#2ecc71" : "#f1c40f";
            } else {
                el.innerText = data.state === "Okay" ? "" : "OUT!";
                el.style.color = "#2ecc71";
            }
        });
    }

    const hud = document.createElement('div');
    hud.id = 'stalker-hud';
    hud.innerHTML = `<div class="hud-hdr" id="hud-refresh">TARGET HUD</div><div class="hud-inner"></div><div class="quick-links"><a href="/factions.php?step=your#/tab=armory" class="nav-btn">ARMORY</a><a href="/item.php" class="nav-btn">INVENTORY</a></div>`;
    document.body.appendChild(hud);
    
    document.getElementById('hud-refresh').onclick = () => targets.forEach(t => update(t.id));

    render();
    setInterval(injectProfileButton, 2000);

    if (API_KEY) {
        targets.forEach(t => update(t.id));
        setInterval(tick, 1000);
        setInterval(() => targets.forEach(t => update(t.id)), 30000);
    }
})();