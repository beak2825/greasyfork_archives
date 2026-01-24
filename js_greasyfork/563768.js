// ==UserScript==
// @name         SN's GLB Skill Point Page Enhancer (v6.3.5)
// @namespace    SeattleNiner
// @description  v6.3.5: Improved "High Contrast Heatmap" coloring for better readability.
// @version      6.3.5
// @match        https://glb.warriorgeneral.com/game/skill_points.pl?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563768/SN%27s%20GLB%20Skill%20Point%20Page%20Enhancer%20%28v635%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563768/SN%27s%20GLB%20Skill%20Point%20Page%20Enhancer%20%28v635%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const colorMajor = '#a03c19';
    const colorMinor = '#a000a0';
    const colorOther = '#606060';
    const colorCapOK = '#17b51e';

    const physNames = ["Strength", "Speed", "Agility", "Jumping", "Stamina", "Vision", "Confidence"];
    const skillNames = ["Blocking", "Tackling", "Throwing", "Catching", "Carrying", "Kicking", "Punting"];

    let lastHoveredSkill = "";
    let currentTipContent = "";
    let globalBuildData = null;
    let globalLevel = 1;

    const getBuilds = (pos) => {
        switch(pos) {
            case 'FB': return [['No Archetype','Str,Agi,Blo,Car','Sta,Vis,Con,Tac,Cat'],['Rusher','Agi,Car,Con,Str','Blo,Spe,Sta,Vis'],['Blocker','Agi,Blo,Str,Vis','Car,Con,Spe,Sta'],['Combo Back','Agi,Blo,Car,Str,Vis','Cat,Con,Jum,Spe'],['Scat Back','Agi,Cat,Spe,Vis','Blo,Car,Con,Jum'],['Special Teamer','Agi,Blo,Spe,Sta,Tac','Con,Str,Vis']];
            case 'QB': return [['No Archetype','Str,Sta,Vis,Con,Thr','Spe,Agi,Jum,Cat,Car'],['Pocket Passer','Con,Thr,Vis','Agi,Sta,Str,Car'],['Deep Passer','Str,Thr,Vis','Agi,Con,Sta,Car'],['Scrambler','Agi,Thr,Vis','Con,Spe,Str,Car']];
            case 'HB': return [['No Archetype','Str,Spe,Agi,Vis,Con,Car','Jum,Sta,Blo,Thr,Cat'],['Power Back','Agi,Car,Con,Str','Jum,Spe,Sta,Vis'],['Elusive Back','Agi,Car,Spe,Vis','Cat,Con,Str'],['Scat Back','Agi,Car,Cat,Spe','Con,Jum,Sta,Vis'],['Combo Back','Car,Con,Spe,Str,Vis','Agi,Cat,Jum,Sta'],['Returner','Agi,Car,Spe,Sta,Vis','Con,Jum,Str'],['Special Teamer','Agi,Blo,Spe,Sta,Tac','Con,Str,Vis']];
            case 'WR': return [['No Archetype','Spe,Agi,Jum,Sta,Vis','Con,Car'],['Speedster','Agi,Cat,Spe,Vis','Car,Con,Jum,Sta'],['Possession Rec','Agi,Cat,Jum,Vis','Car,Con,Spe,Sta'],['Power Rec','Agi,Car,Cat,Str','Con,Spe,Sta,Vis'],['Returner','Agi,Car,Spe,Sta,Vis','Con,Jum,Str'],['Special Teamer','Agi,Blo,Spe,Sta,Tac','Con,Str,Vis']];
            case 'TE': return [['No Archetype','Str,Vis,Blo,Cat','Spe,Agi,Sta,Con,Tac,Car'],['Blocker','Agi,Blo,Con,Str,Vis','Cat,Spe,Sta'],['Power Rec','Agi,Car,Con,Cat,Str','Blo,Spe,Sta'],['Receiver','Agi,Car,Cat,Spe,Vis','Blo,Sta,Str'],['Dual Threat','Agi,Blo,Cat,Str,Vis','Con,Jum,Spe'],['Special Teamer','Agi,Blo,Spe,Sta,Tac','Con,Str,Vis']];
            case 'C':  return [['No Archetype','Str,Blo','Agi,Sta,Vis,Con,Tac'],['Pass Blocker','Agi,Blo,Con,Vis','Spe,Sta,Str'],['Run Blocker','Blo,Con,Str,Vis','Agi,Spe,Sta'],['Special Teamer','Agi,Blo,Spe,Sta,Tac','Con,Str,Vis']];
            case 'G':  return [['No Archetype','Str,Con,Blo','Agi,Sta,Vis,Tac'],['Pass Blocker','Agi,Blo,Con,Vis','Spe,Sta,Str'],['Run Blocker','Blo,Con,Str,Vis','Agi,Spe,Sta'],['Special Teamer','Agi,Blo,Spe,Sta,Tac','Con,Str,Vis']];
            case 'OT': return [['No Archetype','Str,Agi,Vis,Con,Blo','Sta,Tac'],['Pass Blocker','Agi,Blo,Con,Vis','Spe,Sta,Str'],['Run Blocker','Blo,Con,Str,Vis','Agi,Spe,Sta'],['Special Teamer','Agi,Blo,Spe,Sta,Tac','Con,Str,Vis']];
            case 'DT': return [['No Archetype','Str,Agi,Tac','Spe,Sta,Vis,Con,Blo'],['Run Stuffer','Agi,Str,Tac,Vis','Con,Spe,Sta'],['Pass Rusher','Agi,Spe,Tac,Vis','Con,Sta,Str'],['Combo Tackle','Spe,Str,Tac,Vis','Agi,Con,Sta'],['Special Teamer','Agi,Blo,Spe,Sta,Tac','Con,Str,Vis']];
            case 'DE': return [['No Archetype','Str,Spe,Agi,Tac','Jum,Sta,Vis,Con,Blo'],['Run Stuffer','Agi,Str,Tac,Vis','Con,Spe,Sta'],['Pass Rusher','Agi,Spe,Tac,Vis','Con,Sta,Str'],['Combo End','Spe,Str,Tac,Vis','Agi,Con,Sta'],['Special Teamer','Agi,Blo,Spe,Sta,Tac','Con,Str,Vis']];
            case 'LB': return [['No Archetype','Str,Agi,Sta,Vis,Con,Tac','Spe,Jum,Blo,Cat'],['Coverage LB','Agi,Jum,Spe,Vis','Con,Sta,Str,Tac'],['Blitzer','Agi,Jum,Spe,Tac','Con,Sta,Str,Vis'],['Hard Hitter','Agi,Str,Tac,Vis','Con,Jum,Spe,Sta'],['Combo LB','Agi,Con,Spe,Tac,Vis','Jum,Sta,Str'],['Special Teamer','Agi,Blo,Spe,Sta,Tac','Con,Str,Vis']];
            case 'CB': return [['No Archetype','Spe,Agi,Jum,Sta,Vis,Cat','Str,Con,Tac,Car'],['Man Specialist','Agi,Jum,Spe,Vis','Cat,Con,Sta,Tac'],['Zone Specialist','Agi,Spe,Tac,Vis','Cat,Con,Jum,Sta'],['Hard Hitter','Spe,Str,Tac,Vis','Agi,Con,Jum,Sta'],['Combo Corner','Agi,Spe,Str,Tac','Con,Jum,Sta,Vis'],['Returner','Agi,Car,Spe,Sta,Vis','Con,Jum,Str'],['Special Teamer','Agi,Blo,Spe,Sta,Tac','Con,Str,Vis']];
            case 'SS': return [['No Archetype','Str,Spe,Sta,Vis,Tac','Agi,Jum,Con,Blo,Cat,Car'],['Man Specialist','Agi,Jum,Spe,Vis','Cat,Con,Sta,Tac'],['Zone Specialist','Agi,Spe,Tac,Vis','Cat,Con,Jum,Sta'],['Hard Hitter','Spe,Str,Tac,Vis','Agi,Con,Jum,Sta'],['Combo Safety','Agi,Spe,Str,Tac','Con,Jum,Sta,Vis'],['Special Teamer','Agi,Blo,Spe,Sta,Tac','Con,Str,Vis']];
            case 'FS': return [['No Archetype','Spe,Sta,Vis,Tac,Cat','Str,Agi,Jum,Con,Blo,Car'],['Man Specialist','Agi,Jum,Spe,Vis','Cat,Con,Sta,Tac'],['Zone Specialist','Agi,Spe,Tac,Vis','Cat,Con,Jum,Sta'],['Hard Hitter','Spe,Str,Tac,Vis','Agi,Con,Jum,Sta'],['Combo Safety','Agi,Spe,Str,Tac','Con,Jum,Sta,Vis'],['Special Teamer','Agi,Blo,Spe,Sta,Tac','Con,Str,Vis']];
            case 'K':  return [['No Archetype','Con,Kic','Str,Spe,Agi,Jum,Vis,Thr'],['Boomer','Con,Kic,Str','Agi,Jum,Vis'],['Technician','Con,Kic,Vis','Agi,Jum,Str']];
            case 'P':  return [['No Archetype','Con,Pun','Str,Spe,Agi,Jum,Vis,Thr'],['Boomer','Con,Pun,Str','Agi,Jum,Vis'],['Technician','Con,Pun,Vis','Agi,Jum,Str']];
            default: return [];
        }
    };

    function BuildData(args) {
        this.name = args && args[0] ? args[0] : "No Archetype";
        this.affectedAtts = {};
        this.counts = { 1: 0, 2: 0 };
        if (args && args[1]) args[1].split(',').forEach(s => { let sn = s.trim().substring(0,3); this.affectedAtts[sn] = 2; this.counts[2]++; });
        if (args && args[2]) args[2].split(',').forEach(s => { let sn = s.trim().substring(0,3); this.affectedAtts[sn] = 1; this.counts[1]++; });
    }

    function getPlayerId() { const u = new URLSearchParams(window.location.search); return u.get('player_id'); }

    const style = document.createElement('style');
    style.innerHTML = `
        #sn_main_wrapper { display: flex; gap: 0px; width: 600px; margin-top: 10px; font-family: arial; }
        #sn_left_col { display: flex; flex-direction: column; width: 255px; }
        #sn_right_col { display: flex; flex-direction: column; width: 250px; margin-left: 5px; }
        .sn_header {
            background: #a3522b linear-gradient(#b74e27, #65250d) !important;
            color: #FFFFFF !important; height: 24px; line-height: 24px; text-align: center;
            font-size: 12px; font-weight: bold; border: 1px solid #000; text-transform: uppercase; box-sizing: border-box;
        }
        .sn_body { background-color: #616161 !important; border: 1px solid #000; border-top: none; padding: 4px; border-radius: 0 0 5px 5px; }
        .attribute_container {
            width: 245px !important; margin: 2px auto !important;
            background: #eee linear-gradient(#ffffff, #cccccc) !important;
            border: 1px solid #444 !important; border-radius: 12px !important;
            display: flex !important; align-items: center !important;
            justify-content: space-between; padding: 0 0 0 4px !important;
            height: 22px !important; box-sizing: border-box !important;
        }
        .sn_planner_table { width: 100%; border-collapse: collapse; background: #EFEFEF; border: 1px solid #000; table-layout: fixed; }
        .sn_planner_table td { padding: 0 4px; text-align: center; border: 1px solid #ccc; height: 26px; box-sizing: border-box; width: 33.333% !important; }
        .sn_goal_input { width: 45px; text-align: center; font-size: 11px; padding: 1px; }
        .sn_proj_val { font-weight: bold; color: #333; font-size: 11px; }
        .sn_diff_val { font-weight: bold; font-size: 11px; }
        #attribute_list > table.attributes, #attribute_list > br { display: none !important; }
        .plus_minus { display: flex !important; align-items: center !important; justify-content: flex-end !important; margin: 0 !important; }
        .plus_minus img { display: block !important; margin: 0 !important; }
        .sn_detect_badge { font-weight: bold; margin-left: 5px; color: #a03c19; font-size: 0.9em; }
    `;
    document.head.appendChild(style);

    function calcALG(startLvl, mm, buildData) {
        if (startLvl >= 79) return 0;
        let l = startLvl, out = 0, divisor = buildData.counts[mm] || 1;
        while (l < 79) {
            let decay = (l <= 20) ? 1.0 : (l <= 28) ? 0.75 : (l <= 36) ? 0.5625 : 0.421875;
            let gain = (mm * decay) / divisor;
            out += gain;
            out = Math.floor(out * 1000) / 1000;
            l++;
        }
        return out;
    }

    function updatePlannerRow(row, baseVal) {
        if (!globalBuildData) return;
        let statName = row.dataset.stat, goalInput = row.querySelector('.sn_goal_input'), projCell = row.querySelector('.sn_proj_val'), diffCell = row.querySelector('.sn_diff_val');
        let goal = parseFloat(goalInput.value) || 0, shortName = statName.substring(0,3);
        let mm = globalBuildData.affectedAtts[shortName] || 0, totalGain = (mm === 0) ? 0 : calcALG(globalLevel, mm, globalBuildData);
        let projected = Math.round((baseVal + totalGain) * 100) / 100;
        projCell.textContent = projected.toFixed(2);

        // -- High Contrast Graduated Coloring --
        let diff = projected - goal;
        if (goal === 0) {
            diffCell.textContent = "-";
            diffCell.style.color = "#333";
        } else {
            diffCell.textContent = (diff >= 0 ? "+" : "") + diff.toFixed(2);
            if (diff >= -0.01) {
                diffCell.style.color = "#008800"; // Dark Green (Goal Met)
            } else if (diff >= -1.5) {
                diffCell.style.color = "#B07D00"; // Dark Amber (Very Close) - Readable against grey
            } else if (diff >= -4.0) {
                diffCell.style.color = "#D35400"; // Burnt Orange (Progressing)
            } else {
                diffCell.style.color = "#C0392B"; // Dark Red (Far)
            }
        }
        localStorage.setItem("glb_planner_" + getPlayerId() + "_" + statName, goalInput.value);
    }

    function createPlannerRow(statName, map) {
        let row = document.createElement('tr');
        row.dataset.stat = statName;
        let saved = localStorage.getItem("glb_planner_" + getPlayerId() + "_" + statName) || "";
        let valDiv = map[statName].querySelector('.attribute_value');
        let baseVal = parseFloat(valDiv.textContent.split('(')[0]);
        row.innerHTML = `<td><input type="text" class="sn_goal_input" value="${saved}"></td><td class="sn_proj_val">...</td><td class="sn_diff_val"></td>`;
        row.querySelector('input').addEventListener('input', () => updatePlannerRow(row, baseVal));
        setTimeout(() => updatePlannerRow(row, baseVal), 10);
        return row;
    }

    function initLayout() {
        const root = document.getElementById('attribute_list');
        const items = document.querySelectorAll('.attribute_container');
        if (!root || items.length === 0 || document.getElementById('sn_main_wrapper')) return;

        const map = {};
        items.forEach(item => { const link = item.querySelector('.attribute_name a'); if (link) map[link.textContent.trim()] = item; });

        globalBuildData = new BuildData(["No Archetype", "", ""]);

        const wrapper = document.createElement('div'); wrapper.id = 'sn_main_wrapper';
        wrapper.innerHTML = `
            <div id="sn_left_col" class="sn_column">
                <div class="sn_header">Physical Attributes</div>
                <div id="sn_phys_body" class="sn_body"></div>
                <div class="sn_header" style="border-top:none; margin-top:5px;">Football Skills</div>
                <div id="sn_skill_body" class="sn_body"></div>
            </div>
            <div id="sn_right_col" class="sn_column">
                <div class="sn_header"><table width="100%"><tr><td width="33%">GOAL</td><td width="33%">PROJ</td><td width="33%">+/-</td></tr></table></div>
                <div class="sn_body"><table class="sn_planner_table" id="sn_phys_table"></table></div>
                <div class="sn_header" style="border-top:none; margin-top:5px;">&nbsp;</div>
                <div class="sn_body"><table class="sn_planner_table" id="sn_skill_table"></table></div>
            </div>`;

        physNames.forEach(n => { if (map[n]) { wrapper.querySelector('#sn_phys_body').appendChild(map[n]); wrapper.querySelector('#sn_phys_table').appendChild(createPlannerRow(n, map)); } });
        skillNames.forEach(n => { if (map[n]) { wrapper.querySelector('#sn_skill_body').appendChild(map[n]); wrapper.querySelector('#sn_skill_table').appendChild(createPlannerRow(n, map)); } });

        const headerTitle = root.querySelector('.medium_head');
        if (headerTitle) {
            headerTitle.innerHTML += ` <span class="sn_detect_badge" id="sn_status_badge">[Loading Player Data...]</span>`;
            headerTitle.after(wrapper);
        }
        updateUI();
        fetchPlayerData();
    }

    function fetchPlayerData() {
        fetch("/game/player.pl?player_id=" + getPlayerId()).then(r => r.text()).then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            let level = 1, pos = "QB", archName = "No Archetype";

            const lvlRow = doc.querySelector('.player_points_value');
            if (lvlRow) { const firstCell = lvlRow.querySelector('td'); if (firstCell) level = parseInt(firstCell.textContent.trim()) || 1; }
            const posEl = doc.querySelector('.position');
            if (posEl) pos = posEl.textContent.trim();
            const archImg = doc.querySelector('.large_title_bar img[src*="/archetypes/"]');
            if (archImg) { const tipText = archImg.getAttribute('onmouseover'); const match = tipText.match(/set_tip\s*\(\s*'([^']+)'/); if (match) archName = match[1]; }
            archName = archName.replace('Linebacker', 'LB').replace(' Receiver', ' Rec');

            globalLevel = level;
            let builds = getBuilds(pos);
            globalBuildData = new BuildData(builds.find(b => b[0] === archName) || builds[0]);

            const badge = document.getElementById('sn_status_badge');
            if (badge) badge.textContent = ` [Lvl ${level} ${pos} | ${archName}]`;

            document.querySelectorAll('#sn_main_wrapper tr[data-stat]').forEach(row => {
                const statName = row.dataset.stat;
                const containers = document.querySelectorAll('.attribute_container');
                let baseVal = 0;
                containers.forEach(c => {
                    const link = c.querySelector('.attribute_name a');
                    if (link && link.textContent.trim() === statName) baseVal = parseFloat(c.querySelector('.attribute_value').textContent);
                });
                updatePlannerRow(row, baseVal);
            });
        });
    }

    function getCapData(name) {
        const containers = document.querySelectorAll('.attribute_container');
        let skillValue = 0;
        containers.forEach(c => { const link = c.querySelector('.attribute_name a'); if (link && link.textContent.trim() === name) skillValue = parseFloat(c.querySelector('.attribute_value').textContent.replace(/[^\d.]/g, '')) || 0; });
        const spElement = document.getElementById('skill_points'), availableSP = spElement ? (parseInt(spElement.innerText.match(/\d+/)) || 0) : 0;
        let val = skillValue, currentCost = Math.floor(Math.exp(0.0003 * Math.pow(val, 2))), capsFound = 0, totalSP = 0, tip = '', toFirst = 0;
        for (let i = 0; i < 500; i++) {
            let nextVal = Math.round((val + 1) * 100) / 100, nextCost = Math.floor(Math.exp(0.0003 * Math.pow(nextVal, 2)));
            totalSP += currentCost;
            if (nextCost > currentCost) { capsFound++; if (capsFound === 1) toFirst = totalSP; tip += (tip ? '<br />' : '') + "<b>" + nextVal + " (" + currentCost + " Cap) = " + totalSP + " Skill Points</b>"; if (capsFound === 2) break; }
            val = nextVal; currentCost = nextCost; if (val > 200) break;
        }
        if (availableSP >= toFirst && toFirst > 0) tip += '<br /><span style="color:#00FF00 !important; font-weight:bold;">Next Cap reachable for ' + toFirst + ' SP</span>';
        return tip;
    }

    function updateUI() {
        const spElement = document.getElementById('skill_points'), availableSP = spElement ? (parseInt(spElement.innerText.match(/\d+/)) || 0) : 0;
        document.querySelectorAll('.attribute_container').forEach(item => {
            const link = item.querySelector('.attribute_name a'), valDiv = item.querySelector('.attribute_value'), pm = item.querySelector('.plus_minus'), star = item.querySelector('img[src*="ability.png"]');
            if (!link || !valDiv || !pm) return;
            const skillName = link.textContent.trim();
            link.style.color = star ? (star.src.includes('primary') ? colorMajor : colorMinor) : colorOther;
            const curVal = parseFloat(valDiv.textContent.replace(/[^\d.]/g, ''));
            let currentCost = Math.floor(Math.exp(0.0003 * Math.pow(curVal, 2))), tempVal = curVal, spToCap = 0;
            for(let i=0; i<200; i++) {
                let nv = Math.round((tempVal + 1)*100)/100, nc = Math.floor(Math.exp(0.0003 * Math.pow(nv, 2)));
                spToCap += currentCost; if(nc > currentCost) break;
                tempVal = nv; currentCost = nc;
            }
            valDiv.style.color = (availableSP >= spToCap && spToCap > 0) ? colorCapOK : '#000000';
            const trig = () => { if (window.set_tip) window.set_tip("<b>" + skillName + "</b>"); }, h = () => { if (window.unset_tip) window.unset_tip(); };
            valDiv.onmouseover = trig; valDiv.onmouseout = h; pm.onmouseover = trig; pm.onmouseout = h;
        });
    }

    const origSet = window.set_tip;
    window.set_tip = function (text, ...args) {
        let newText = text;
        const nameMatch = text.match(/^<b>(.*?)<\/b>$/);
        if (text.includes("Skill Points Needed") || (nameMatch && (physNames.includes(nameMatch[1]) || skillNames.includes(nameMatch[1])))) { if (lastHoveredSkill) newText = getCapData(lastHoveredSkill); }
        if (newText === currentTipContent && !nameMatch) return;
        currentTipContent = newText;
        return origSet.apply(this, [newText, ...args]);
    };

    document.addEventListener('mouseover', (e) => { const container = e.target.closest('.attribute_container'); if (container) { const link = container.querySelector('.attribute_name a'); if (link) lastHoveredSkill = link.textContent.trim(); } }, true);

    initLayout();
    const obs = new MutationObserver(updateUI);
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
})();