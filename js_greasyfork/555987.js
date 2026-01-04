// ==UserScript==
// @name         MWI Level-Up Timer + Target Level Input
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Time-to-Level-Up mit Wochen/Tagen/Stunden/Minuten/Sekunden, Number-Input für Ziel-Level, nur sichtbar wenn BattlePanel geöffnet
// @match        *://milkywayidle.com/*
// @match        *://*.milkywayidle.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555987/MWI%20Level-Up%20Timer%20%2B%20Target%20Level%20Input.user.js
// @updateURL https://update.greasyfork.org/scripts/555987/MWI%20Level-Up%20Timer%20%2B%20Target%20Level%20Input.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SKILL_NAMES = ["Stamina","Intelligence","Attack","Defense","Melee","Ranged","Magic"];
    let intervalId = null;

    // XP-Tabelle 1-200 (reale Werte)
    const XP_TABLE = [
        0,33,76,132,202,286,386,503,637,791,964,1159,1377,1620,1891,2192,2525,2893,3300,3750,
        4247,4795,5400,6068,6805,7618,8517,9508,10604,11814,13151,14629,16262,18068,20064,22271,
        24712,27411,30396,33697,37346,41381,45842,50773,56222,62243,68895,76242,84355,93311,103195,
        114100,126127,139390,154009,170118,187863,207403,228914,252584,278623,307256,338731,373318,411311,453030,
        498824,549074,604193,664632,730881,803472,882985,970050,1065351,1169633,1283701,1408433,1544780,1693774,1856536,
        2034279,2228321,2440088,2671127,2923113,3197861,3497335,3823663,4179145,4566274,4987741,5446463,5945587,6488521,
        7078945,7720834,8418485,9176537,10000000,11404976,12904567,14514400,16242080,18095702,20083886,22215808,24501230,
        26950540,29574787,32385721,35395838,38618420,42067584,45758332,49706603,53929328,58444489,63271179,68429670,73941479,
        79829440,86117783,92832214,100000000,114406130,130118394,147319656,166147618,186752428,209297771,233962072,260939787,
        290442814,322702028,357968938,396517495,438646053,484679494,534971538,589907252,649905763,715423218,786955977,865044093,
        950275074,1043287971,1144777804,1255500373,1376277458,1508002470,1651646566,1808265285,1979005730,2165114358,2367945418,
        2588970089,2829786381,3092129857,3377885250,3689099031,4027993033,4396979184,4798675471,5235923207,5711805728,6229668624,
        6793141628,7406162301,8073001662,8798291902,9587056372,10444742007,11377254401,12390995728,13492905745,14690506120,
        15991948361,17406065609,18942428633,20611406335,22424231139,24393069640,26531098945,28852589138,31372992363,34109039054,
        37078841860,40302007875,43799759843,47595067021,51712786465,56179815564,61025256696,66280594953,71979889960,78159982881,
        84860719814,92125192822,100000000000
    ];

    function parseSkills() {
        const skills = {};
        document.querySelectorAll(".NavigationBar_subSkills__37qWb .NavigationBar_nav__3uuUl").forEach(nav => {
            const nameEl = nav.querySelector(".NavigationBar_label__1uH-y");
            const percentEl = nav.querySelector(".insertedSpan");
            const levelEl = nav.querySelector(".NavigationBar_level__3C7eR");
            if(nameEl && percentEl && levelEl){
                const name = nameEl.textContent.trim();
                const percent = parseFloat(percentEl.textContent.replace("%","").replace(",","").trim());
                const level = parseInt(levelEl.textContent.replace(/\./g,""),10);
                skills[name] = { level, percent };
            }
        });
        return skills;
    }

    function parseBattleXP(){
        const xpData = {};
        document.querySelectorAll(".BattlePanel_skillExp__2uMMD").forEach(div=>{
            const svg = div.querySelector("use");
            if(!svg) return;
            const skillNameFromHref = svg.getAttribute("href").split("#")[1];
            let xpText = div.textContent.trim().replace(/\./g,"").replace("K","000").replace("M","000000").replace(",","");
            const xp = parseInt(xpText);
            if(!isNaN(xp)){
                xpData[skillNameFromHref.toLowerCase()] = xp;
            }
        });
        return xpData;
    }

    function parseCombatInfo() {
        const infoDiv = document.querySelector(".BattlePanel_combatInfo__sHGCe");
        if(!infoDiv) return { combatSec:0, battles:0 };

        const text = infoDiv.textContent;
        const dayMatch = text.match(/(\d+)d/);
        const hourMatch = text.match(/(\d+)h/);
        const minMatch = text.match(/(\d+)m/);
        const secMatch = text.match(/(\d+)s/);
        const battlesMatch = text.match(/Battles:\s*(\d+)/);

        const days = dayMatch ? parseInt(dayMatch[1]) : 0;
        const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
        const minutes = minMatch ? parseInt(minMatch[1]) : 0;
        const seconds = secMatch ? parseInt(secMatch[1]) : 0;
        const battles = battlesMatch ? parseInt(battlesMatch[1]) : 1;

        return { combatSec: days*86400 + hours*3600 + minutes*60 + seconds, battles };
    }

    function xpToNextLevel(level, percent){
        const currentXP = XP_TABLE[level-1] || 0;
        const nextXP = XP_TABLE[level] || currentXP*1.1;
        const remaining = (1 - percent/100) * (nextXP - currentXP);
        return remaining;
    }

    function xpToTargetLevel(level, targetLevel, percent){
        let currentXP = XP_TABLE[level-1] || 0;
        currentXP += percent/100 * (XP_TABLE[level] - currentXP);
        let total = 0;
        for(let l = level; l < targetLevel; l++){
            const nextXP = XP_TABLE[l] || (XP_TABLE[l-1]*1.1);
            if(l === level){
                total += nextXP - currentXP;
            } else {
                total += nextXP - XP_TABLE[l-1];
            }
        }
        return total;
    }

    function formatTimeWithSeconds(hours){
        let totalSeconds = Math.floor(hours * 3600);
        const weeks = Math.floor(totalSeconds / (7*24*3600));
        totalSeconds %= 7*24*3600;
        const days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        const h = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;

        let result = "";
        if(weeks > 0) result += `${weeks}w `;
        if(days > 0) result += `${days}d `;
        result += `${h}h ${m}m ${s}s`;
        return result;
    }

    let skillTargetLevels = {};

    function updateTimer(){
        const skills = parseSkills();
        const battleXP = parseBattleXP();
        const {combatSec, battles} = parseCombatInfo();
        if(combatSec <= 0 || battles <= 0) return;

        const combatHours = combatSec / 3600;

        let box = document.getElementById("mwi_levelup_timer_box");
        if(!box){
            box = document.createElement("div");
            box.id = "mwi_levelup_timer_box";
            box.style = `
                position: fixed;
                bottom: 10px;
                right: 10px;
                background: rgba(0,0,0,0.8);
                color: #fff;
                padding: 8px;
                border-radius: 5px;
                font-size: 14px;
                max-height: 80vh;
                overflow-y: auto;
                z-index: 9999;
            `;
            document.body.appendChild(box);
        }

        let html = "<b>Time-to-Level-Up (Current XP)</b><br>";

        for(const skill of SKILL_NAMES){
            const sk = skills[skill];
            if(!sk) continue;

            const skillKey = skill.toLowerCase();
            const gainedXP = battleXP[skillKey];
            if(!gainedXP) continue;

            const xpPerHour = gainedXP / combatHours;
            const xpPerBattle = gainedXP / battles;
            const remXP = xpToNextLevel(sk.level, sk.percent);
            const hours = remXP / xpPerHour;
            const neededBattles = Math.ceil(remXP / xpPerBattle);

            html += `${skill}: ~${formatTimeWithSeconds(hours)} (~${neededBattles} Battles)<br>`;
        }

        html += "<br><b>Target Level Preview</b><br>";

        for(const skill of SKILL_NAMES){
            const sk = skills[skill];
            if(!sk) continue;
            const skillKey = skill.toLowerCase();
            const gainedXP = battleXP[skillKey];
            if(!gainedXP) continue;

            if(!skillTargetLevels[skill]) skillTargetLevels[skill] = sk.level + 1;
            const inputId = `target_level_${skillKey}`;

            html += `${skill}: <input type="number" id="${inputId}" min="${sk.level+1}" max="200" value="${skillTargetLevels[skill]}" style="width:50px"> → Time: <span id="time_${skillKey}"></span><br>`;
        }

        box.innerHTML = html;

        for(const skill of SKILL_NAMES){
            const sk = skills[skill];
            if(!sk) continue;
            const skillKey = skill.toLowerCase();
            const inputEl = document.getElementById(`target_level_${skillKey}`);
            const timeEl = document.getElementById(`time_${skillKey}`);
            if(!inputEl || !timeEl) continue;

            const gainedXP = battleXP[skillKey];
            const xpPerHour = gainedXP / combatHours;

            function updateTargetTime(){
                let targetLevel = parseInt(inputEl.value);
                if(isNaN(targetLevel)) targetLevel = sk.level+1;
                skillTargetLevels[skill] = targetLevel;
                const remXP = xpToTargetLevel(sk.level, targetLevel, sk.percent);
                const hours = remXP / xpPerHour;
                timeEl.textContent = formatTimeWithSeconds(hours);
            }

            inputEl.addEventListener("input", updateTargetTime);
            updateTargetTime();
        }
    }

    const observer = new MutationObserver(() => {
        const panel = document.querySelector(".BattlePanel_combatInfo__sHGCe");
        const boxExists = !!document.getElementById("mwi_levelup_timer_box");

        if(panel && !boxExists){
            updateTimer();
            intervalId = setInterval(updateTimer, 2000);
        } else if(!panel && boxExists){
            document.getElementById("mwi_levelup_timer_box").remove();
            clearInterval(intervalId);
            intervalId = null;
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
