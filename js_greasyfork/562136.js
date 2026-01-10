// ==UserScript==
// @name         Training Companion
// @namespace    http://tampermonkey.net/
// @version      2026-01-10
// @description  IQRPG XP Panel using Vue expRemaining + +XP lines + 100-action rolling buffer + 6s actions + soft reset per skill
// @author       Timpp0
// @match        https://iqrpg.com/*
// @match        https://www.iqrpg.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562136/Training%20Companion.user.js
// @updateURL https://update.greasyfork.org/scripts/562136/Training%20Companion.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /******************************
     * XP TABLE (1–213)
     ******************************/
    const XP_TABLE = {
        1:0,2:100,3:227,4:394,5:619,6:919,7:1313,8:1822,9:2469,10:3277,
        11:4272,12:5481,13:6930,14:8651,15:10674,16:13032,17:15761,18:18896,19:22478,20:26548,
        21:31148,22:36327,23:42134,24:48622,25:55847,26:63870,27:72758,28:82579,29:93409,30:105329,
        31:118429,32:132802,33:148553,34:165794,35:184647,36:205246,37:227736,38:252276,39:279040,40:308220,
        41:340023,42:374680,43:412443,44:453588,45:498421,46:547278,47:600529,48:658583,49:721888,50:790944,

        51:866297,52:948555,53:1038387,54:1136533,55:1243810,56:1361125,57:1489478,58:1629975,59:1783841,60:1952432,
        61:2137247,62:2339946,63:2562367,64:2806542,65:3074724,66:3369402,67:3693337,68:4049581,69:4441516,70:4872883,
        71:5347825,72:5870929,73:6447271,74:7082469,75:7782746,76:8554984,77:9406806,78:10346644,79:11383832,80:12528701,
        81:13792681,82:15188422,83:16729919,84:18432660,85:20313776,86:22392224,87:24688973,88:27227219,89:30032621,90:33133558,
        91:36561419,92:40350918,93:44540445,94:49172452,95:54293881,96:59956635,97:66218102,98:73141725,99:80797645,100:89263397,

        101:98624687,102:108976251,103:120422796,104:133080048,105:147075899,106:162551684,107:179663586,108:198584182,109:219504158,110:242634200,
        111:268207076,112:296479941,113:327736879,114:362291704,115:400491058,116:442717830,117:489394919,118:540989403,119:598017121,120:661047750,
        121:730710383,122:807699709,123:892782810,124:986806676,125:1090706485,126:1205514744,127:1332371377,128:1472534840,129:1627394400,130:1798483667,
        131:1987495525,132:2196298605,133:2426955451,134:2681742554,135:2963172457,136:3274918125,137:3617339831,138:3996514801,139:4415269909,140:4877717734,
        141:5388396319,142:5952313018,143:6574992846,144:7262531786,145:8021655577,146:8859784529,147:9785104985,148:10806648118,149:11934376801,150:13179281384,

        151:14553485283,152:16070361386,153:17744660384,154:19592652241,155:21632282139,156:23883342392,157:26367661940,158:29104315232,159:32134852462,160:35473553353,
        161:39157706873,162:43222919534,163:47708455192,164:52657609549,165:58118122899,166:64142635007,167:70789186422,168:78121770942,169:86210944438,170:95134495779,
        171:104978186178,172:115836563909,173:127813862070,174:141024987833,175:155596612489,176:171668372525,177:189394193019,178:208943745790,179:230504055989,180:254281272193,
        181:280502616644,182:309418533876,183:341305057915,184:376466420203,185:415237922694,186:457989103025,187:505127221373,188:557101101658,189:614405362994,190:677585080974,
        191:747240922355,192:824034801128,193:908696108812,

        194:1002055157748,195:1104271780031,196:1215801228975,197:1337448253329,198:1470077096801,
        199:1614615474026,200:1772060202753,201:1943482422481,202:2129933658848,203:2332554029810,
        204:2552571865043,205:2791314869489,206:3050212154096,207:3330806404622,208:3634760706548,
        209:3963876823491,210:4320115342468,211:4705607600000,212:5122667782800,213:5573816506920
    };

    /******************************
     * XP TRACKING STATE
     ******************************/
    let lastSkill = null;

    let xpBuffer = [];
    const BUFFER_SIZE = 100;

    let lastXpEventKey = null;

    /*******************************
     * PANEL BUILDER
     *******************************/
    function buildPanel(anchor) {
        if (document.querySelector('#training-companion-panel')) return;

        const wrapper = document.createElement("div");
        wrapper.className = "main-section";
        wrapper.id = "training-companion-panel";
        wrapper.style.marginTop = "3px";

        wrapper.innerHTML = `
          <div class="main-section__title clickable"
               style="cursor:pointer; display:flex; justify-content:center; align-items:center; gap:0.5rem;">
            <p>Training Companion</p>
            <span class="grey-text" style="font-size:0.9rem"></span>
          </div>
          <div class="main-section__body" style="display:block">
            <div style="text-align:center; font-size:12px; line-height:1.2; color:#aaa; padding:4px 8px;">
              <div>Skill: <span class="skill-field" style="color:#3c3">-</span></div>
              <div>Remaining XP: <span class="remainingxp" style="color:#3c3">-</span></div>
              <div>Avg XP/100 Actions: <span class="avgxp" style="color:#3c3">-</span></div>
              <div>Actions Needed: <span class="actionsneeded" style="color:#3c3">-</span></div>
              <div>ETA: <span class="eta" style="color:#3c3">-</span></div>
              <div>Avg XP/Hr: <span class="xphr" style="color:#3c3">-</span></div>
            </div>
          </div>
        `;

        const title = wrapper.querySelector('.main-section__title');
        const body = wrapper.querySelector('.main-section__body');
        const state = title.querySelector('span.grey-text');

        title.addEventListener("click", () => {
            const isVisible = body.style.display === "block";
            body.style.display = isVisible ? "none" : "block";
            state.textContent = isVisible ? "(Collapsed)" : "";
        });

        anchor.insertAdjacentElement("afterend", wrapper);
    }

    /*******************************
     * ACTIVE SKILL BAR TEXT
     *******************************/
    function getActiveSkillBarText() {
        const el = document.querySelector('.main-skill-bar .progress__text');
        return el ? el.textContent.trim() : null;
    }

    function getSkillLevelPercent() {
        const text = getActiveSkillBarText();
        if (!text || !text.includes("Level") || !text.includes("%")) return null;

        const levelMatch = text.match(/Level\s+(\d+)/);
        const percentMatch = text.match(/\(([\d.]+)%\)/);

        if (!levelMatch || !percentMatch) return null;

        return {
            skill: text.match(/^([A-Za-z]+)/)?.[1] || null,
            level: parseInt(levelMatch[1], 10),
            percent: parseFloat(percentMatch[1])
        };
    }

    /*******************************
     * READ +XP [Skill Exp] EVENT
     *******************************/
    function getLastXpEvent() {
        const container = document.querySelector('.main-section.main-game-section');
        if (!container) return null;

        const expSpans = container.querySelectorAll('p .exp-text');
        if (!expSpans.length) return null;

        const span = expSpans[expSpans.length - 1];
        const p = span.closest('p');
        if (!p) return null;

        const rawText = p.textContent.trim();
        const amountMatch = rawText.match(/\+([\d,]+)/);
        if (!amountMatch) return null;

        const xpAmount = parseInt(amountMatch[1].replace(/,/g, ''), 10);

        return {
            xp: xpAmount,
            rawText
        };
    }

    /*******************************
     * PANEL UPDATERS
     *******************************/
    function updateSkillDisplay(skill) {
        const panel = document.querySelector('#training-companion-panel');
        if (!panel) return;
        panel.querySelector('.skill-field').textContent = skill || "-";
    }

    function updateRemainingXP(xpRemaining) {
        const panel = document.querySelector('#training-companion-panel');
        if (!panel) return;

        if (xpRemaining == null || isNaN(xpRemaining)) {
            panel.querySelector('.remainingxp').textContent = "-";
            return;
        }

        panel.querySelector('.remainingxp').textContent =
            Math.round(xpRemaining).toLocaleString();
    }

    function updateXPAction(avgXp) {
        const panel = document.querySelector('#training-companion-panel');
        if (!panel) return;
        panel.querySelector('.avgxp').textContent =
            avgXp == null ? "-" : Math.round(avgXp).toLocaleString();
    }

    function updateXPHour(avgXp) {
        const panel = document.querySelector('#training-companion-panel');
        if (!panel) return;
        const xpHr = avgXp == null ? null : avgXp * 600; // 6s per action
        panel.querySelector('.xphr').textContent =
            xpHr == null ? "-" : Math.round(xpHr).toLocaleString();
    }

    function updateActionsNeeded(xpRemaining, avgXp) {
        const panel = document.querySelector('#training-companion-panel');
        if (!panel) return;

        if (avgXp == null || avgXp <= 0 || xpRemaining == null || xpRemaining <= 0) {
            panel.querySelector('.actionsneeded').textContent = "-";
            return;
        }

        const actions = xpRemaining / avgXp;
        panel.querySelector('.actionsneeded').textContent =
            Math.ceil(actions).toLocaleString();
    }

    function updateETA(actionsNeeded) {
        const panel = document.querySelector('#training-companion-panel');
        if (!panel) return;

        if (actionsNeeded == null || actionsNeeded <= 0) {
            panel.querySelector('.eta').textContent = "-";
            return;
        }

        const seconds = actionsNeeded * 6;
        const minutes = Math.round(seconds / 60);

        if (minutes < 1) {
            panel.querySelector('.eta').textContent = "<1 min";
            return;
        }

        const h = Math.floor(minutes / 60);
        const m = minutes % 60;

        panel.querySelector('.eta').textContent =
            h > 0 ? `${h}h ${m}m` : `${m}m`;
    }

    /*******************************
     * XP TRACKING ENGINE
     *******************************/
    function processTick() {
        const data = getSkillLevelPercent();
        if (!data) return;

        const { skill, level, percent } = data;

        // Detect skill change → soft reset
        if (skill !== lastSkill) {
            lastSkill = skill;
            xpBuffer = [];
            lastXpEventKey = null;

            updateSkillDisplay(skill);
            updateXPAction(null);
            updateXPHour(null);
            updateETA(null);
            updateActionsNeeded(null, null);
        }

        // Vue-based Remaining XP
        let xpRemaining = null;
        const skillBarEl = document.querySelector('.main-skill-bar');
        const vue = skillBarEl && skillBarEl.__vue__;
        if (vue && typeof vue.expRemaining === 'number') {
            xpRemaining = vue.expRemaining;
        }

        // Fallback if Vue somehow missing (should rarely happen)
        if (xpRemaining == null) {
            const xpCurrent = XP_TABLE[level];
            const xpNext = XP_TABLE[level + 1];
            if (xpCurrent != null && xpNext != null) {
                const xpNeeded = xpNext - xpCurrent;
                const xpInto = xpNeeded * (percent / 100);
                xpRemaining = xpNeeded - xpInto;
            }
        }

        // Read latest +XP event for XP/action buffer
        const xpEvent = getLastXpEvent();
        if (xpEvent) {
            const { xp, rawText } = xpEvent;

            if (rawText !== lastXpEventKey) {
                lastXpEventKey = rawText;

                xpBuffer.push(xp);
                if (xpBuffer.length > BUFFER_SIZE) xpBuffer.shift();
            }
        }

        // Compute average XP/action
        let avgXp = null;
        if (xpBuffer.length > 0) {
            const total = xpBuffer.reduce((a, b) => a + b, 0);
            avgXp = total / xpBuffer.length;
        }

        const actionsNeeded =
            avgXp && xpRemaining && xpRemaining > 0
                ? Math.ceil(xpRemaining / avgXp)
                : null;

        // Update panel
        updateSkillDisplay(skill);
        updateRemainingXP(xpRemaining);
        updateXPAction(avgXp);
        updateXPHour(avgXp);
        updateActionsNeeded(xpRemaining, avgXp);
        updateETA(actionsNeeded);
    }

    /*******************************
     * PANEL INJECTION LOOP
     *******************************/
    let gridObserverAttached = false;

    const injectInterval = setInterval(() => {
        const anchor = [...document.querySelectorAll('div.grey-text')]
            .find(el => el.textContent.includes("Total Level"));

        if (!anchor) return;

        if (!document.querySelector('#training-companion-panel')) {
            buildPanel(anchor);
        }

        if (!gridObserverAttached) {
            attachGameGridObserver();q
            gridObserverAttached = true;
        }

        clearInterval(injectInterval);
    }, 500);

    /*******************************
     * GAME-GRID OBSERVER (autos tick)
     *******************************/
    function attachGameGridObserver() {
        function tryAttach() {
            const grid = document.querySelector('.game-grid');
            if (!grid) {
                setTimeout(tryAttach, 500);
                return;
            }

            const observer = new MutationObserver(() => {
                clearTimeout(window._companionTick);
                window._companionTick = setTimeout(processTick, 50);
            });

            observer.observe(grid, { childList: true, subtree: true });
        }

        tryAttach();
    }
// By Timpp0
})();
