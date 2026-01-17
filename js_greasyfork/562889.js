// ==UserScript==
// @name         SN's GLB Roster Value Engine
// @namespace    SeattleNiner
// @description  PV and EQ columns with gray color-coding for closed/hidden builds (0.0).
// @version      1.9.0
// @match        https://glb.warriorgeneral.com/game/roster.pl?team_id=*
// @grant        GM_xmlhttpRequest
// @connect      glb.warriorgeneral.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562889/SN%27s%20GLB%20Roster%20Value%20Engine.user.js
// @updateURL https://update.greasyfork.org/scripts/562889/SN%27s%20GLB%20Roster%20Value%20Engine.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const PV_HIGH = 2100;   // Green
    const PV_MID  = 2000;   // Blue
    const COLOR_CLOSED = '#999999'; // Subtle Gray for 0.0 values

    const CAPS_THRESHOLDS = [87.6, 85.58, 83.25, 80.53, 77.28, 73.24, 67.97, 60.51, 48.06, 10.00];
    const PERCENT_BONUSES = ['Break tackle chance','Fake chance','Hold block chance','Pass distance','Pass quality','Catch ball chance','Break block chance','Make tackle chance','Force fumble chance','Avoid fake chance','Deflect ball chance','Interception chance'];
    const SA_TABLE = {'0':[0,0],'1':[1,2],'2':[2,4],'3':[4,7],'4':[6,10],'5':[9,14],'6':[12,18],'7':[16,23],'8':[20,28],'9':[25,34],'10':[30,40]};

    function injectUI() {
        document.querySelectorAll('th.player_trade_head').forEach((pvHead) => {
            pvHead.innerText = 'PV';
            pvHead.style.width = '40px';
            pvHead.style.cursor = 'pointer';
            pvHead.onclick = () => sortTable(pvHead, 0);

            if (!pvHead.nextElementSibling || pvHead.nextElementSibling.innerText !== 'EQ') {
                const eqHead = document.createElement('th');
                eqHead.innerText = 'EQ';
                eqHead.className = 'player_trade_head';
                eqHead.style.width = '40px';
                eqHead.style.cursor = 'pointer';
                eqHead.onclick = () => sortTable(eqHead, 1);
                pvHead.parentNode.insertBefore(eqHead, pvHead.nextSibling);
            }
        });

        document.querySelectorAll('.medium_head').forEach(header => {
            if (header.innerText.includes("Roster") && !header.querySelector('.sn_calc_btn')) {
                const btn = document.createElement('button');
                btn.className = 'sn_calc_btn edit_team_needs';
                btn.innerText = 'Calc PV/EQ';
                btn.style.float = 'right'; btn.style.fontSize = '10px'; btn.style.padding = '2px 5px';
                btn.onclick = calculateAll;
                header.appendChild(btn);
            }
        });

        document.querySelectorAll('table.players tbody tr').forEach(tr => {
            const pvCell = tr.querySelector('.player_trade');
            if (pvCell && !tr.querySelector('.sn_eq_cell')) {
                const eqCell = document.createElement('td');
                eqCell.className = 'player_trade sn_eq_cell';
                eqCell.style.textAlign = 'center';
                pvCell.parentNode.insertBefore(eqCell, pvCell.nextSibling);

                const playerId = getPlayerIdFromRow(tr);
                if (playerId) {
                    pvCell.id = `pv_cell_${playerId}`;
                    eqCell.id = `eq_cell_${playerId}`;
                }
            }
        });
    }

    function sortTable(header, type) {
        const table = header.closest('table');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const isAscending = header.getAttribute('data-order') === 'asc';

        rows.sort((a, b) => {
            let valA, valB;
            if (type === 0) {
                valA = parseFloat(a.querySelector('[id^="pv_cell_"]')?.innerText) || 0;
                valB = parseFloat(b.querySelector('[id^="pv_cell_"]')?.innerText) || 0;
            } else {
                valA = parseInt(a.querySelector('[id^="eq_cell_"]')?.innerText) || 0;
                valB = parseInt(b.querySelector('[id^="eq_cell_"]')?.innerText) || 0;
            }
            return isAscending ? valA - valB : valB - valA;
        });

        header.setAttribute('data-order', isAscending ? 'desc' : 'asc');
        rows.forEach(row => tbody.appendChild(row));
    }

    async function calculateAll() {
        const buttons = document.querySelectorAll('.sn_calc_btn');
        buttons.forEach(b => { b.innerText = '...'; b.disabled = true; });

        const tasks = Array.from(document.querySelectorAll('table.players tbody tr')).map(row => {
            const playerId = getPlayerIdFromRow(row);
            return playerId ? processPlayer(playerId) : Promise.resolve();
        });

        await Promise.all(tasks);
        calculateAndInjectAverages();
        buttons.forEach(b => { b.innerText = 'Calc PV/EQ'; b.disabled = false; });
    }

    function processPlayer(id) {
        return new Promise((resolve) => {
            const pvCell = document.getElementById(`pv_cell_${id}`);
            const eqCell = document.getElementById(`eq_cell_${id}`);
            if (!pvCell) return resolve();

            GM_xmlhttpRequest({
                method: "GET",
                url: `https://glb.warriorgeneral.com/game/player.pl?player_id=${id}`,
                onload: function(response) {
                    const doc = new DOMParser().parseFromString(response.responseText, "text/html");
                    const data = runFullAnalysis(doc);
                    pvCell.innerHTML = formatPV(data.pv);
                    eqCell.innerHTML = formatEQ(data.eqBonus);
                    resolve();
                }
            });
        });
    }

    function runFullAnalysis(doc) {
        let stats = { Strength:0, Speed:0, Agility:0, Jumping:0, Stamina:0, Vision:0, Confidence:0, Blocking:0, Tackling:0, Throwing:0, Catching:0, Carrying:0, Kicking:0, Punting:0 };
        let eqBonusTotal = 0;

        // If profile is closed, this query will likely yield empty stats
        const statRows = doc.querySelectorAll('#normalStats .stat_head_tall, .player_stats_table .stat_head_tall');
        if (statRows.length === 0) return { pv: 0, eqBonus: 0 };

        statRows.forEach(row => {
            let name = row.textContent.replace(':', '').trim();
            if (stats.hasOwnProperty(name) && row.nextElementSibling) {
                let valText = row.nextElementSibling.textContent;
                stats[name] = parseFloat(valText.split('(')[0].trim());
                let bonusMatch = valText.match(/\(([\d\+]+)\)/);
                if (bonusMatch) eqBonusTotal += parseInt(bonusMatch[1].replace('+', ''));
            }
        });

        let statValue = 0;
        for (let s in stats) {
            let currentVal = stats[s];
            for (let i = 0; i < CAPS_THRESHOLDS.length; i++) {
                let threshold = (CAPS_THRESHOLDS[i] === 10.00) ? 0 : CAPS_THRESHOLDS[i];
                if (currentVal > threshold) {
                    let diff = (threshold === 0) ? currentVal : Math.floor(currentVal - threshold);
                    statValue += (diff * (10 - i));
                    currentVal -= diff;
                }
            }
        }

        let vpCount = 0;
        doc.querySelectorAll('#vet_skills_box .skill_level').forEach(el => vpCount += parseInt(el.textContent));
        let pctCount = 0;
        const bonusHead = Array.from(doc.querySelectorAll('.medium_head')).find(el => el.textContent.includes("Current Bonuses"));
        if (bonusHead && bonusHead.nextElementSibling) {
            bonusHead.nextElementSibling.querySelectorAll('tr').forEach(r => {
                let td1 = r.querySelector('td:first-child');
                if (td1 && PERCENT_BONUSES.includes(td1.textContent)) {
                    pctCount += parseFloat(r.querySelector('td:nth-child(2)').textContent.replace('%', ''));
                }
            });
        }

        let saValue = 0;
        doc.querySelectorAll('#skill_trees_content .subhead').forEach(subhead => {
            let count = 0, current = subhead.nextElementSibling;
            while (current && current.classList.contains('skill_button')) {
                count++;
                let lvlEl = current.querySelector('.skill_level');
                if (lvlEl) {
                    let num = parseInt(lvlEl.textContent), isLast = (count === 5);
                    saValue += (num > 10) ? (isLast ? (40 + (num - 10) * 6) : (30 + (num - 10) * 5)) : SA_TABLE[num][isLast ? 1 : 0];
                }
                current = current.nextElementSibling;
            }
        });

        return { pv: statValue + saValue + (vpCount / 10) + (pctCount * 3), eqBonus: eqBonusTotal };
    }

    function formatPV(val) {
        if (val <= 0) return `<span style="color:${COLOR_CLOSED}; font-weight:normal; font-size:10pt;">0.0</span>`;

        let color = '#FF8C00'; // Orange
        if (val >= PV_HIGH) color = '#008000'; // Green
        else if (val >= PV_MID) color = '#0000FF'; // Blue
        return `<span style="color:${color}; font-weight:bold; font-size:11pt;">${val.toFixed(1)}</span>`;
    }

    function formatEQ(bonus) {
        if (bonus <= 0) return `<span style="color:${COLOR_CLOSED}; font-weight:normal; font-size:10pt;">0</span>`;

        let color = '#FF8C00'; // Orange (< 55)
        if (bonus === 55) color = '#0000FF'; // Blue (= 55)
        else if (bonus > 55) color = '#008000'; // Green (> 55)
        return `<span style="color:${color}; font-weight:bold; font-size:11pt;">${bonus}</span>`;
    }

    function getPlayerIdFromRow(row) {
        const link = row.querySelector('a[href*="player_id="]');
        return link ? link.href.split('player_id=')[1] : null;
    }

    function calculateAndInjectAverages() {
        let totalSum = 0, totalCount = 0, offSum = 0, offCount = 0, defSum = 0, defCount = 0;
        const findTable = (text) => Array.from(document.querySelectorAll('.medium_head')).find(h => h.textContent.includes(text))?.nextElementSibling;

        const offTable = findTable('Offense Roster');
        if (offTable) offTable.querySelectorAll('[id^="pv_cell_"] span').forEach(s => {
            let v = parseFloat(s.textContent); if (v > 0) { offSum += v; offCount++; }
        });

        const defTable = findTable('Defense Roster');
        if (defTable) defTable.querySelectorAll('[id^="pv_cell_"] span').forEach(s => {
            let v = parseFloat(s.textContent); if (v > 0) { defSum += v; defCount++; }
        });

        document.querySelectorAll('[id^="pv_cell_"] span').forEach(span => {
            const val = parseFloat(span.textContent);
            if (val > 0) { totalSum += val; totalCount++; }
        });

        const avgTot = totalCount > 0 ? (totalSum / totalCount).toFixed(1) : "0.0";
        const avgOff = offCount > 0 ? (offSum / offCount).toFixed(1) : "0.0";
        const avgDef = defCount > 0 ? (defSum / defCount).toFixed(1) : "0.0";

        const targetCol = document.querySelectorAll('.content_container > div[style*="float: left"]')[2];
        if (targetCol) {
            let container = document.getElementById('sn_avg_container') || document.createElement('div');
            container.id = 'sn_avg_container';
            container.style.marginTop = '4px';
            container.innerHTML = `<div class="small_head" style="margin-bottom: 2px;">Avg Team / Offense / Defense</div><div style="font-weight:bold; font-size:11pt;">${avgTot} / ${avgOff} / ${avgDef}</div>`;
            targetCol.appendChild(container);
        }
    }

    setTimeout(injectUI, 500);
})();