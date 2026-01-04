// ==UserScript==
// @name         Turecko volejbal
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Přiřazuje funkce s unikátním ID
// @author       Michal
// @match        https://fikstur.tvf.org.tr/MacTakvim/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558124/Turecko%20volejbal.user.js
// @updateURL https://update.greasyfork.org/scripts/558124/Turecko%20volejbal.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        MAX_MATCHES: 100,
        PANEL_CHECK_INTERVAL: 500,
        PANEL_DEBOUNCE: 2000,
        USE_STRICT_MATCH: true,
        AUTO_DATE_CHECK: true
    };

    let currentMatches = [];
    let lastPanelCheck = 0;

    const checkAndFixURLDate = () => {
        if (!CONFIG.AUTO_DATE_CHECK) return;

        const currentURL = window.location.href;
        const urlMatch = currentURL.match(/\/MacTakvim\/(\d{8})/);

        const today = new Date();
        const todayStr = today.getFullYear() +
                        String(today.getMonth() + 1).padStart(2, '0') +
                        String(today.getDate()).padStart(2, '0');

        const urlDate = urlMatch ? urlMatch[1] : null;

        if (!urlDate || urlDate !== todayStr) {
            showDateDialog(urlDate, todayStr);
        }
    };

    const showDateDialog = (currentDate, suggestedDate) => {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 99999999;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            padding: 20px;
            border: 1px solid #ccc;
            max-width: 400px;
            width: 90%;
            font-family: Arial, sans-serif;
        `;

        const formatDate = (dateStr) => {
            if (!dateStr || dateStr.length !== 8) return 'N/A';
            return `${dateStr.substring(6, 8)}.${dateStr.substring(4, 6)}.${dateStr.substring(0, 4)}`;
        };

        dialog.innerHTML = `
            <div style="font-size: 16px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                URL Date Check
            </div>

            <table style="width: 100%; margin-bottom: 15px; font-size: 13px;">
                <tr>
                    <td style="padding: 5px 0; color: #666;">Current URL date:</td>
                    <td style="padding: 5px 0; text-align: right;">${formatDate(currentDate)}</td>
                </tr>
                <tr>
                    <td style="padding: 5px 0; color: #666;">Today:</td>
                    <td style="padding: 5px 0; text-align: right; font-weight: bold;">${formatDate(suggestedDate)}</td>
                </tr>
            </table>

            <div style="margin-bottom: 15px;">
                <div style="margin-bottom: 5px; font-size: 13px; color: #666;">Date (YYYYMMDD):</div>
                <input
                    id="date-input"
                    type="text"
                    value="${suggestedDate}"
                    maxlength="8"
                    style="width: 100%; padding: 8px; font-size: 14px; border: 1px solid #ccc; box-sizing: border-box;"
                >
                <div id="date-preview" style="margin-top: 5px; font-size: 12px; color: #666;">
                    Preview: ${formatDate(suggestedDate)}
                </div>
            </div>

            <div style="display: flex; gap: 10px;">
                <button id="btn-ok" style="flex: 1; padding: 10px; background: #4a90e2; color: white; border: none; font-size: 14px; cursor: pointer;">
                    Redirect
                </button>
                <button id="btn-cancel" style="flex: 1; padding: 10px; background: #999; color: white; border: none; font-size: 14px; cursor: pointer;">
                    Cancel
                </button>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        const input = document.getElementById('date-input');
        const preview = document.getElementById('date-preview');
        const btnOk = document.getElementById('btn-ok');
        const btnCancel = document.getElementById('btn-cancel');

        input.addEventListener('input', (e) => {
            const value = e.target.value.replace(/\D/g, '').substring(0, 8);
            e.target.value = value;
            preview.textContent = value.length === 8 ? `Preview: ${formatDate(value)}` : 'Enter 8 digits';
        });

        btnOk.onclick = () => {
            const newDate = input.value.trim();
            if (newDate.length === 8 && /^\d{8}$/.test(newDate)) {
                window.location.href = `https://fikstur.tvf.org.tr/MacTakvim/${newDate}#`;
            } else {
                alert('Invalid date format');
            }
        };

        btnCancel.onclick = () => overlay.remove();

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') btnOk.click();
        });

        setTimeout(() => input.select(), 100);
    };

    const createMatchID = (team1, team2) => {
        const clean = (str) => str.toUpperCase()
            .replace(/[^A-Z0-9]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
        return `${clean(team1)}_vs_${clean(team2)}`;
    };

    const extractLogoID = (logoSrc) => {
        const match = logoSrc.match(/(\d+)\.png/);
        return match ? match[1] : null;
    };

    const getAllMatches = () => {
        const matches = [];
        const mainTable = document.querySelector('#icerik_Gvcanliskor');
        if (!mainTable) return [];

        let index = 0;
        while (true) {
            const team1El = document.getElementById(`icerik_Gvcanliskor_takim1_${index}`);
            const team2El = document.getElementById(`icerik_Gvcanliskor_takim2_${index}`);

            if (!team1El || !team2El) break;

            const timeEl = document.getElementById(`icerik_Gvcanliskor_saat_${index}`);
            const score1El = document.getElementById(`icerik_Gvcanliskor_skor1_${index}`);
            const score2El = document.getElementById(`icerik_Gvcanliskor_skor2_${index}`);
            const logo1El = document.getElementById(`icerik_Gvcanliskor_takim1logo_${index}`);
            const logo2El = document.getElementById(`icerik_Gvcanliskor_takim2logo_${index}`);

            const logo1ID = logo1El ? extractLogoID(logo1El.src) : null;
            const logo2ID = logo2El ? extractLogoID(logo2El.src) : null;

            matches.push({
                index,
                time: timeEl?.textContent.trim() || 'N/A',
                team1: team1El.textContent.trim(),
                team2: team2El.textContent.trim(),
                score: `${score1El?.textContent.trim() || '0'}:${score2El?.textContent.trim() || '0'}`,
                uniqueID: createMatchID(team1El.textContent.trim(), team2El.textContent.trim()),
                logoID: logo1ID && logo2ID ? `${logo1ID}_${logo2ID}` : null
            });

            index++;
        }
        return matches;
    };

    const generateHomeTeamFunction = (uniqueID, logoID) => {
        const matchLogic = CONFIG.USE_STRICT_MATCH ? '&&' : '||';
        return `/.*/(function(){const p='icerik_Gvcanliskor_';function c(a,b){const x=a.toUpperCase().replace(/[^A-Z0-9]/g,'_').replace(/_+/g,'_').replace(/^_|_$/g,'');const y=b.toUpperCase().replace(/[^A-Z0-9]/g,'_').replace(/_+/g,'_').replace(/^_|_$/g,'');return x+'_vs_'+y;}const k='${uniqueID}';const L='${logoID}';for(let i=0;i<100;i++){const a=document.getElementById(p+'takim1_'+i);const b=document.getElementById(p+'takim2_'+i);if(!a||!b)break;const n=c(a.textContent.trim(),b.textContent.trim())===k;const x=document.getElementById(p+'takim1logo_'+i);const y=document.getElementById(p+'takim2logo_'+i);const g=s=>s.match(/(\\d+)\\.png/)[1];const l=x&&y?g(x.src)+'_'+g(y.src)===L:0;if(n${matchLogic}l)return a.textContent.trim();}return " ";})`;
    };

    const generateSetFunction = (uniqueID, logoID, setNumber, isHome) => {
        const setIdx = setNumber - 1;
        const grpIdx = isHome ? 1 : 2;
        const matchLogic = CONFIG.USE_STRICT_MATCH ? '&&' : '||';

        return `/.*/(function(){const p='icerik_Gvcanliskor_';function c(a,b){const x=a.toUpperCase().replace(/[^A-Z0-9]/g,'_').replace(/_+/g,'_').replace(/^_|_$/g,'');const y=b.toUpperCase().replace(/[^A-Z0-9]/g,'_').replace(/_+/g,'_').replace(/^_|_$/g,'');return x+'_vs_'+y;}const k='${uniqueID}';const L='${logoID}';for(let i=0;i<100;i++){const a=document.getElementById(p+'takim1_'+i);const b=document.getElementById(p+'takim2_'+i);if(!a||!b)break;const n=c(a.textContent.trim(),b.textContent.trim())===k;const x=document.getElementById(p+'takim1logo_'+i);const y=document.getElementById(p+'takim2logo_'+i);const g=s=>s.match(/(\\d+)\\.png/)[1];const l=x&&y?g(x.src)+'_'+g(y.src)===L:0;if(n${matchLogic}l){const s=document.getElementById(p+'setsonuc_'+i);if(!s)return " ";const r=/(\\d+)-(\\d+)/g;const m=[];let h;while(h=r.exec(s.textContent))m.push(h);return m[${setIdx}]&&m[${setIdx}][${grpIdx}]?m[${setIdx}][${grpIdx}]:" ";}}return " ";})`;
    };

    const generateMatchStartFunction = (uniqueID, logoID) => {
        const matchLogic = CONFIG.USE_STRICT_MATCH ? '&&' : '||';

        return `/.*/(function(){const p='icerik_Gvcanliskor_';function c(a,b){const x=a.toUpperCase().replace(/[^A-Z0-9]/g,'_').replace(/_+/g,'_').replace(/^_|_$/g,'');const y=b.toUpperCase().replace(/[^A-Z0-9]/g,'_').replace(/_+/g,'_').replace(/^_|_$/g,'');return x+'_vs_'+y;}const k='${uniqueID}';const L='${logoID}';for(let i=0;i<100;i++){const a=document.getElementById(p+'takim1_'+i);const b=document.getElementById(p+'takim2_'+i);if(!a||!b)break;const n=c(a.textContent.trim(),b.textContent.trim())===k;const x=document.getElementById(p+'takim1logo_'+i);const y=document.getElementById(p+'takim2logo_'+i);const g=s=>s.match(/(\\d+)\\.png/)[1];const l=x&&y?g(x.src)+'_'+g(y.src)===L:0;if(n${matchLogic}l){const s=document.getElementById(p+'setsonuc_'+i);if(!s)return " ";return /[1-9]/.test(s.textContent)?"Start zápasu":" ";}}return " ";})`;
    };

    const createMatchSelector = () => {
        const panel = document.createElement('div');
        panel.id = 'match-selector-panel';
        panel.style.cssText = `
            background: #f9f9f9;
            border: 1px solid #ddd;
            padding: 10px;
            margin: 10px 0;
            max-height: 300px;
            overflow-y: auto;
            font-family: Arial, sans-serif;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            font-weight: bold;
            font-size: 13px;
            margin-bottom: 10px;
            color: #333;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        `;
        header.textContent = `Select Match (${currentMatches.length})`;
        panel.appendChild(header);

        const listContainer = document.createElement('div');

        currentMatches.forEach((match, idx) => {
            const matchDiv = document.createElement('div');
            matchDiv.style.cssText = `
                padding: 8px;
                margin: 5px 0;
                background: white;
                border: 1px solid #ddd;
                cursor: pointer;
                font-size: 12px;
            `;

            matchDiv.onmouseover = () => {
                matchDiv.style.background = '#f0f0f0';
            };

            matchDiv.onmouseout = () => {
                matchDiv.style.background = 'white';
            };

            matchDiv.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                selectMatch(match);
            };

            matchDiv.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 3px;">
                    ${idx + 1}. ${match.time} | ${match.score}
                </div>
                <div style="color: #666;">
                    ${match.team1} vs ${match.team2}
                </div>
            `;

            listContainer.appendChild(matchDiv);
        });

        panel.appendChild(listContainer);
        return panel;
    };

    const selectMatch = (match) => {
        console.log('[TVF] Selected:', match.team1, 'vs', match.team2);
        console.log('[TVF] UniqueID:', match.uniqueID);
        console.log('[TVF] LogoID:', match.logoID || 'N/A');

        const regexInputs = [];
        for (let i = 0; i < 20; i++) {
            const input = document.getElementById(`picker-name-input-regex${i}`);
            if (input) regexInputs.push(input);
        }

        let filled = 0;

        const setMapping = [
            { setNum: 1, isHome: true },
            { setNum: 1, isHome: false },
            { setNum: 2, isHome: true },
            { setNum: 2, isHome: false },
            { setNum: 3, isHome: true },
            { setNum: 3, isHome: false },
            { setNum: 4, isHome: true },
            { setNum: 4, isHome: false },
            { setNum: 5, isHome: true },
            { setNum: 5, isHome: false }
        ];

        setMapping.forEach((config, idx) => {
            if (regexInputs[idx]) {
                regexInputs[idx].value = generateSetFunction(match.uniqueID, match.logoID, config.setNum, config.isHome);
                regexInputs[idx].dispatchEvent(new Event('input', { bubbles: true }));
                regexInputs[idx].dispatchEvent(new Event('change', { bubbles: true }));
                filled++;
            }
        });

        if (regexInputs[10]) {
            regexInputs[10].value = generateHomeTeamFunction(match.uniqueID, match.logoID);
            regexInputs[10].dispatchEvent(new Event('input', { bubbles: true }));
            regexInputs[10].dispatchEvent(new Event('change', { bubbles: true }));
            filled++;
        }

        if (regexInputs[11]) {
            regexInputs[11].value = generateMatchStartFunction(match.uniqueID, match.logoID);
            regexInputs[11].dispatchEvent(new Event('input', { bubbles: true }));
            regexInputs[11].dispatchEvent(new Event('change', { bubbles: true }));
            filled++;
        }

        console.log('[TVF] Filled:', filled, 'inputs');

        const panel = document.getElementById('match-selector-panel');
        if (panel) {
            setTimeout(() => panel.style.display = 'none', 400);
        }

        showSuccessMessage(match, filled);
    };

    const showSuccessMessage = (match, count) => {
        const msg = document.createElement('div');
        msg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            color: #333;
            padding: 15px 20px;
            border: 1px solid #ddd;
            font-size: 13px;
            z-index: 9999999;
            font-family: Arial, sans-serif;
        `;
        msg.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">Match Selected</div>
            <div>${match.team1} vs ${match.team2}</div>
            <div style="color: #666; margin-top: 5px;">${count} fields updated</div>
        `;
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 2000);
    };

    const isVisible = (el) => !!(el?.offsetWidth || el?.offsetHeight || el?.getClientRects().length);

    const checkAndShowPanel = () => {
        const formBox = document.getElementById("kvido-main-form-box");

        if (!formBox || !isVisible(formBox)) return;

        const existingPanel = document.getElementById('match-selector-panel');
        if (existingPanel && existingPanel.style.display !== 'none') return;

        const now = Date.now();
        if (now - lastPanelCheck < CONFIG.PANEL_DEBOUNCE) return;

        lastPanelCheck = now;

        if (existingPanel) existingPanel.remove();

        currentMatches = getAllMatches();
        if (currentMatches.length === 0) return;

        const panel = createMatchSelector();

        if (formBox.firstChild) {
            formBox.insertBefore(panel, formBox.firstChild);
        } else {
            formBox.appendChild(panel);
        }
    };

    const init = () => {
        setTimeout(checkAndFixURLDate, 500);
        const observer = new MutationObserver(checkAndShowPanel);
        observer.observe(document.body, { childList: true, subtree: true });
        setInterval(checkAndShowPanel, CONFIG.PANEL_CHECK_INTERVAL);
        console.log('[TVF] Initialized');
    };

    init();
})();