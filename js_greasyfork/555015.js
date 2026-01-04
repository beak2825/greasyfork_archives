// ==UserScript==
// @name         PICheat+
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Cheat for pasja-informatyki.pl tests – shows answers + auto-fills via click simulation. Based off of  nyxiereal's PICheat (https://greasyfork.org/pl/scripts/529427-picheat)
// @author       caret
// @match        https://pasja-informatyki.pl/*/test/*
// @match        https://pasja-informatyki.pl/*/egzamin/*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/555015/PICheat%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/555015/PICheat%2B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.PICheatLoaded) return;
    window.PICheatLoaded = true;

    // --- Extract answers from inline script ---
    const scriptText = Array.from(document.scripts)
        .map(s => s.textContent)
        .join('');
    const ansMatches = scriptText.match(/ans\[(\d+)\]\s*=\s*"([a-d])";/g);
    if (!ansMatches) return;

    const ansArray = ansMatches.map(m => {
        const match = m.match(/ans\[\d+\]\s*=\s*"([a-d])"/);
        return match ? match[1] : null;
    }).filter(Boolean);

    // --- Build UI ---
    const container = document.createElement('div');
    container.id = 'picheat-container';
    container.style.cssText = `
        position:fixed; top:50px; left:0; width:85px; background:#f8f9fa;
        z-index:9999; padding:10px; box-shadow:0 4px 12px rgba(0,0,0,.15);
        border-radius:0 8px 8px 0; overflow-y:auto; max-height:90vh;
        transition:transform .2s ease-out; transform:translateX(-100%);
        display:none; font-family:sans-serif; font-size:13px;
    `;

    const title = document.createElement('div');
    title.textContent = 'Answers';
    title.style.cssText = 'font-weight:bold; margin-bottom:8px; color:#333;';

    const list = document.createElement('ol');
    list.style.cssText = 'margin:0; padding-left:20px;';
    ansArray.forEach((letter, i) => {
        const li = document.createElement('li');
        li.textContent = (i + 1) + ': ' + letter.toUpperCase();
        li.style.cssText = 'margin-bottom:3px; font-family:monospace;';
        list.appendChild(li);
    });

    const autoBtn = document.createElement('button');
    autoBtn.textContent = 'Auto-Fill All';
    autoBtn.style.cssText = `
        width:100%; padding:7px; margin:8px 0 4px; background:#28a745;
        color:white; border:none; border-radius:4px; cursor:pointer; font-size:12px; font-weight:bold;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.cssText = `
        width:100%; padding:7px; background:#dc3545;
        color:white; border:none; border-radius:4px; cursor:pointer; font-size:12px;
    `;

    container.append(title, list, autoBtn, closeBtn);
    document.body.appendChild(container);

    // --- Auto-Fill: Simulate Click ---
    autoBtn.onclick = () => {
        ansArray.forEach((letter, idx) => {
            const q = idx + 1;
            const inputId = `ans${letter}${q}`;
            const input = document.getElementById(inputId);
            if (input && !input.checked) {
                input.click(); // Triggers zmianaX(q) and updates UI
            }
        });
        alert('All answers filled! Click "Sprawdź test!"');
    };

    // --- Toggle Panel ---
    const toggle = () => {
        if (container.style.display === 'none') {
            container.style.display = 'block';
            requestAnimationFrame(() => container.style.transform = 'translateX(0)');
        } else {
            container.style.transform = 'translateX(-100%)';
            setTimeout(() => container.style.display = 'none', 210);
        }
    };
    closeBtn.onclick = toggle;

    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.shiftKey && e.key === 'H') {
            e.preventDefault();
            toggle();
        }
    });

    // --- Optional Hint ---
    setTimeout(() => {
        if (container.style.display === 'none') {
            const hint = document.createElement('div');
            hint.textContent = 'Ctrl+Shift+H → cheat';
            hint.style.cssText = `
                position:fixed; bottom:20px; right:20px; background:rgba(0,0,0,.85);
                color:#fff; padding:9px 14px; border-radius:6px; font-size:13px;
                z-index:10000; pointer-events:none; opacity:0; transition:opacity .4s;
            `;
            document.body.appendChild(hint);
            requestAnimationFrame(() => hint.style.opacity = '1');
            setTimeout(() => {
                hint.style.opacity = '0';
                setTimeout(() => hint.remove(), 400);
            }, 3000);
        }
    }, 1000);

})();