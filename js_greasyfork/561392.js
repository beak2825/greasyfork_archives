// ==UserScript==
// @name         Wakfuli to Gearfu - v1.0
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Permet d'exporter un build wakfuli vers gearfu
// @author       Plantim
// @match        https://wakfuli.com/builder/*
// @grant        none
// @license      Copyright Plantim - All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/561392/Wakfuli%20to%20Gearfu%20-%20v10.user.js
// @updateURL https://update.greasyfork.org/scripts/561392/Wakfuli%20to%20Gearfu%20-%20v10.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let itemDatabase = null;
    const JSON_URL = "https://raw.githubusercontent.com/Plantim/Wakfu_database/refs/heads/main/items_wakfu_propre.json?t=" + Date.now();

    // --- INITIALISATION DES PARAMÈTRES ---
    const getSettings = () => {
        const saved = localStorage.getItem('gfu_settings');
        return saved ? JSON.parse(saved) : { level: true, classe: true, aptitudes: true, debug: false };
    };
    let settings = getSettings();

    const saveSettings = (newSettings) => {
        settings = newSettings;
        localStorage.setItem('gfu_settings', JSON.stringify(newSettings));
    };

    const classMap = {
        "feca": 1, "osamodas": 2, "enutrof": 3, "sram": 4, "xelor": 5,
        "ecaflip": 6, "eniripsa": 7, "iop": 8, "cra": 9, "sadida": 10,
        "sacrieur": 11, "pandawa": 12, "roublard": 13, "zobal": 14,
        "ouginak": 15, "steamer": 16, "eliotrope": 18, "huppermage": 19
    };

    const rarityMap = {
        'BORDER-COMMON': 'inhabituel', 'BORDER-RARE': 'rare',
        'BORDER-MYTHICAL': 'mythique', 'BORDER-LEGENDARY': 'legendaire',
        'BORDER-EPIC': 'epique', 'BORDER-RELIC': 'relique', 'BORDER-MEMORY': 'souvenir'
    };

    function loadDB() {
        fetch(JSON_URL).then(r => r.json()).then(data => {
            itemDatabase = data;
            const btn = document.getElementById('gfu-final-btn');
            if(btn) { btn.style.background = "#22c55e"; btn.innerHTML = "🚀 EXPORT GEARFU"; }
        });
    }

    async function exportToGearfu() {
        if (!itemDatabase) return alert("Base non chargée.");

        let errors = [];
        let successLog = [];

        // 1. NIVEAU
        let levelFound = 230;
        if (settings.level) {
            const levelButton = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Niveau'));
            if (levelButton) {
                const match = levelButton.textContent.match(/\d+/);
                if (match) levelFound = match[0];
            }
        }

        // 2. CLASSE
        let classId = 1;
        if (settings.classe) {
            const classElement = document.querySelector('span.capitalize.cursor-pointer[class*="bagnard"]');
            if (classElement) {
                const className = classElement.textContent.toLowerCase().trim();
                if (classMap[className]) classId = classMap[className];
                else errors.push(`⚠️ Classe "${className}" non reconnue, ID 1 utilisé.`);
            }
        }

        // 3. APTITUDES
        let aptiCode = "";
        if (settings.aptitudes) {
            const elements = Array.from(document.querySelectorAll('a, span, button'));
            const ongletAptitudes = elements.find(el => el.textContent.toLowerCase().trim() === 'aptitudes');
            if (ongletAptitudes) {
                ongletAptitudes.click();
                await new Promise(resolve => setTimeout(resolve, 350));
            }
            const aptiInput = document.querySelector('input[readonly][value*=":"]');
            if (aptiInput) aptiCode = aptiInput.value;
            else if (settings.aptitudes) errors.push("⚠️ Code Aptitudes non trouvé.");
        }

        // 4. ITEMS
        const slots = document.querySelectorAll('div.group.relative.h-13.w-13');
        let gearfuIds = [];
        slots.forEach((slot, idx) => {
            const imgItem = slot.querySelector('img[src*="/items/"]');
            const imgBorder = slot.querySelector('img[src*="/rarity/"]');
            if (imgItem) {
                const gfxId = imgItem.src.match(/\/(\d+)\./)?.[1];
                let rarityKey = "inhabituel";
                if (imgBorder) {
                    const url = imgBorder.src.toUpperCase();
                    for (const [key, value] of Object.entries(rarityMap)) {
                        if (url.includes(key)) { rarityKey = value; break; }
                    }
                }
                const match = itemDatabase.find(i => i.search_key === `${gfxId}-${rarityKey}`);
                if (match) {
                    gearfuIds.push(match.id);
                    successLog.push(`Slot ${idx+1}: ${match.nom}`);
                } else {
                    const fallback = itemDatabase.find(i => String(i.id_image) === String(gfxId));
                    if (fallback) {
                        gearfuIds.push(fallback.id);
                        errors.push(`⚠️ Slot ${idx+1}: Rareté ${rarityKey} non trouvée (ID ${fallback.id} pris).`);
                    } else {
                        errors.push(`❌ Slot ${idx+1}: Item (Gfx ${gfxId}) introuvable.`);
                    }
                }
            }
        });

        // 5. URL
        let finalUrl = `https://naquos.github.io/Gearfu/aptitudes#itemsId=${gearfuIds.join(',')}&level=${levelFound}&classe=${classId}`;
        if (aptiCode) finalUrl += `&aptitudes=${aptiCode}`;

        // 6. GESTION POPUP (Debug ou Erreurs)
        if (settings.debug || errors.length > 0) {
            let msg = errors.length > 0 ? "🚨 ALERTES / ERREURS :\n" + errors.join('\n') + "\n\n" : "✅ EXPORT OK (Mode Debug)\n\n";
            msg += `Niveau : ${levelFound} | Classe ID : ${classId}\n`;
            msg += `Aptitudes : ${aptiCode || "N/A"}\n\n`;
            msg += `🔗 URL GÉNÉRÉE :\n${finalUrl}`;
            alert(msg);
        }

        window.open(finalUrl, '_blank');
    }

    function toggleMenu() {
        const menu = document.getElementById('gfu-settings-menu');
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }

    function inject() {
        if (document.getElementById('gfu-container')) return;

        const container = document.createElement('div');
        container.id = 'gfu-container';
        container.style.cssText = "position:fixed; bottom:20px; right:20px; z-index:9999; display:flex; flex-direction:column; gap:8px; align-items:flex-end; font-family: sans-serif;";

        const menu = document.createElement('div');
        menu.id = 'gfu-settings-menu';
        menu.style.cssText = "background:#111827; color:white; padding:15px; border-radius:10px; border:1px solid #374151; display:none; margin-bottom:5px; font-size:13px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); width:220px;";
        menu.innerHTML = `<b style="display:block;margin-bottom:10px;color:#10b981">⚙️ RÉGLAGES EXPORT</b>`;

        const createCheckbox = (label, key, color = "white") => {
            const div = document.createElement('div');
            div.style.cssText = `margin-bottom:8px; color:${color}`;
            div.innerHTML = `<label style="cursor:pointer; display:flex; align-items:center; gap:8px;">
                <input type="checkbox" id="gfu-check-${key}" ${settings[key] ? 'checked' : ''}> ${label}
            </label>`;
            div.querySelector('input').onchange = (e) => {
                settings[key] = e.target.checked;
                saveSettings(settings);
            };
            return div;
        };

        menu.appendChild(createCheckbox("Récupérer le Niveau", "level"));
        menu.appendChild(createCheckbox("Récupérer la Classe", "classe"));
        menu.appendChild(createCheckbox("Récupérer les Aptitudes", "aptitudes"));
        menu.appendChild(document.createElement('hr')).style.cssText = "border:0; border-top:1px solid #374151; margin:10px 0;";
        menu.appendChild(createCheckbox("Mode Debug (Popups)", "debug", "#fbbf24"));

        const btnSet = document.createElement('button');
        btnSet.innerHTML = "⚙️ Paramètres";
        btnSet.style.cssText = "padding:6px 14px; background:#374151; color:#d1d5db; font-size:11px; border-radius:6px; border:none; cursor:pointer; transition:0.2s;";
        btnSet.onclick = toggleMenu;

        const btnExp = document.createElement('button');
        btnExp.id = 'gfu-final-btn';
        btnExp.innerHTML = "🚀 EXPORT GEARFU";
        btnExp.style.cssText = "padding:12px 24px; background:#059669; color:white; font-weight:bold; border-radius:8px; border:none; cursor:pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.3);";
        btnExp.onclick = exportToGearfu;

        container.appendChild(menu);
        container.appendChild(btnSet);
        container.appendChild(btnExp);
        document.body.appendChild(container);
    }

    inject();
    loadDB();
    setInterval(inject, 2000);
})();