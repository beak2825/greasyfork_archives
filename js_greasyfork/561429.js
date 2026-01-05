// ==UserScript==
// @name         YouTube Cyberpunk Theme PRO + Auto1080p
// @namespace    http://tampermonkey.net/
// @version      7.1
// @description  Cyberpunk YouTube + szybkie filtry + auto1080p + pełna kontrola 🚀
// @author       ChatGPT
// @match        *://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561429/YouTube%20Cyberpunk%20Theme%20PRO%20%2B%20Auto1080p.user.js
// @updateURL https://update.greasyfork.org/scripts/561429/YouTube%20Cyberpunk%20Theme%20PRO%20%2B%20Auto1080p.meta.js
// ==/UserScript==

(function() {
'use strict';
// --- Dodane: blokada Cyberpunka po resecie ---
if (localStorage.getItem('cyberpunkResetPending') === 'true') {
localStorage.removeItem('cyberpunkResetPending');
return; // KONIEC SKRYPTU - nie wstrzykujemy motywu
}
// --------- [ Ustawienia domyślne ] ----------
const defaultColors = { main: '#00ffe5', topBar: '#0d0d0d' };
const defaultFont = 'Orbitron';
const googleFonts = ['Orbitron', 'Roboto', 'Poppins', 'Open Sans', 'Lobster', 'Pacifico', 'Oswald', 'Anton', 'Bebas Neue', 'Comic Sans MS'];
let colors = JSON.parse(localStorage.getItem('cyberpunkColors')) || { ...defaultColors };
let fontFamily = localStorage.getItem('cyberpunkFont') || defaultFont;
let effects = JSON.parse(localStorage.getItem('cyberpunkEffects')) || { boom: true, border: true };
let auto1080p = JSON.parse(localStorage.getItem('cyberpunkAuto1080p')) ?? true;

function saveSettings() {  
    localStorage.setItem('cyberpunkColors', JSON.stringify(colors));  
    localStorage.setItem('cyberpunkFont', fontFamily);  
    localStorage.setItem('cyberpunkEffects', JSON.stringify(effects));  
    localStorage.setItem('cyberpunkAuto1080p', JSON.stringify(auto1080p));  
}  

function resetColors() {  
    colors = { ...defaultColors };  
    saveSettings();  
    applyTheme();  
}  

function resetAll() {  
    localStorage.clear();  
    localStorage.setItem('cyberpunkResetPending', 'true');  
    colors = { ...defaultColors };  
    fontFamily = defaultFont;  
    effects = { boom: true, border: true };  
    auto1080p = true;  
    const styleTag = document.getElementById('cyberpunk-theme');  
    if (styleTag) styleTag.remove();  
    const settingsButton = document.getElementById('cyberpunk-settings-button');  
    if (settingsButton) {  
        settingsButton.style.background = '#ffffff';  
        settingsButton.style.color = '#000000';  
        const menu = settingsButton?.nextSibling;  
        if (menu) menu.style.display = 'none';  
    }  
    setTimeout(() => {  
        location.reload();  
    }, 100);  
}  

function applyTheme() {  
    let styleContent = `body, ytd-app {background-color: #0d0d0d !important;color: ${colors.main} !important;font-family: '${fontFamily}', 'Segoe UI', sans-serif !important;}a, h1, h2, h3, h4, h5, h6, yt-formatted-string, span, div {color: ${colors.main} !important;font-family: '${fontFamily}', 'Segoe UI', sans-serif !important;font-weight: 600 !important;letter-spacing: 0.5px;}#masthead-container, ytd-masthead, .ytd-masthead {background-color: ${colors.topBar} !important;}.video-thumbnail, ytd-thumbnail {border: ${effects.border ? `3px solid ${colors.main}` : 'none'} !important;transition: transform 0.2s ease-in-out, border 0.2s ease-in-out;}.video-thumbnail:hover, ytd-thumbnail:hover {transform: ${effects.boom ? 'scale(1.05)' : 'scale(1)'} !important;}`;  
    let styleTag = document.getElementById('cyberpunk-theme');  
    if (!styleTag) {  
        styleTag = document.createElement('style');  
        styleTag.id = 'cyberpunk-theme';  
        document.head.appendChild(styleTag);  
    }  
    styleTag.innerText = styleContent;  
    loadFont(fontFamily);  
}  

function loadFont(font) {  
    if (!font || document.getElementById(`font-${font}`)) return;  
    if (googleFonts.includes(font)) {  
        const link = document.createElement('link');  
        link.id = `font-${font}`;  
        link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}&display=swap`;  
        link.rel = 'stylesheet';  
        document.head.appendChild(link);  
    }  
}  

function createPanel() {  
    const openMenuButton = document.createElement('button');  
    openMenuButton.id = 'cyberpunk-settings-button';  
    openMenuButton.innerHTML = '⚙️';  
    openMenuButton.style.all = 'unset';  
    openMenuButton.style.width = '36px';  
    openMenuButton.style.height = '36px';  
    openMenuButton.style.borderRadius = '50%';  
    openMenuButton.style.background = colors.main;  
    openMenuButton.style.color = '#0d0d0d';  
    openMenuButton.style.fontSize = '18px';  
    openMenuButton.style.cursor = 'pointer';  
    openMenuButton.style.display = 'flex';  
    openMenuButton.style.alignItems = 'center';  
    openMenuButton.style.justifyContent = 'center';  

    const menu = document.createElement('div');  
    menu.style.display = 'none';  
    menu.style.flexDirection = 'column';  
    menu.style.position = 'absolute';  
    menu.style.top = '50px';  
    menu.style.right = '0';  
    menu.style.background = '#0d0d0d';  
    menu.style.padding = '10px';  
    menu.style.borderRadius = '10px';  
    menu.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.8)';  
    menu.style.gap = '8px';  
    menu.style.minWidth = '220px';  
    menu.style.maxHeight = '400px';  
    menu.style.overflowY = 'auto';  

    ['main', 'topBar'].forEach(section => {  
        const label = document.createElement('label');  
        label.style.color = colors.main;  
        label.style.fontSize = '12px';  
        label.style.display = 'flex';  
        label.style.flexDirection = 'column';  
        label.textContent = ({ main: 'Główny Kolor', topBar: 'Pasek Górny' })[section];  
        const input = document.createElement('input');  
        input.type = 'color';  
        input.value = colors[section];  
        input.addEventListener('input', (e) => {  
            colors[section] = e.target.value;  
            applyTheme();  
        });  
        label.appendChild(input);  
        menu.appendChild(label);  
    });  

    const fontLabel = document.createElement('label');  
    fontLabel.style.color = colors.main;  
    fontLabel.style.fontSize = '12px';  
    fontLabel.style.marginTop = '8px';  
    fontLabel.textContent = 'Czcionka:';  
    menu.appendChild(fontLabel);  

    googleFonts.forEach(f => {  
        const btn = document.createElement('button');  
        btn.innerText = f;  
        btn.style.fontFamily = f;  
        btn.style.background = '#222';  
        btn.style.color = colors.main;  
        btn.style.border = '1px solid ' + colors.main;  
        btn.style.padding = '4px';  
        btn.style.cursor = 'pointer';  
        btn.style.fontSize = '12px';  
        btn.style.borderRadius = '5px';  
        btn.addEventListener('click', () => {  
            fontFamily = f;  
            applyTheme();  
        });  
        menu.appendChild(btn);  
    });  

    const customFontInput = document.createElement('input');  
    customFontInput.type = 'text';  
    customFontInput.placeholder = 'Własna czcionka...';  
    customFontInput.style.marginTop = '8px';  
    customFontInput.style.padding = '5px';  
    customFontInput.style.borderRadius = '5px';  
    customFontInput.style.border = '1px solid ' + colors.main;  
    customFontInput.style.background = '#222';  
    customFontInput.style.color = colors.main;  
    customFontInput.addEventListener('change', (e) => {  
        fontFamily = e.target.value;  
        applyTheme();  
    });  
    menu.appendChild(customFontInput);  

    const boomToggle = document.createElement('button');  
    boomToggle.innerText = effects.boom ? 'Boom: ON' : 'Boom: OFF';  
    boomToggle.style.background = '#333';  
    boomToggle.style.color = colors.main;  
    boomToggle.style.border = '1px solid ' + colors.main;  
    boomToggle.style.borderRadius = '5px';  
    boomToggle.style.padding = '5px';  
    boomToggle.addEventListener('click', () => {  
        effects.boom = !effects.boom;  
        boomToggle.innerText = effects.boom ? 'Boom: ON' : 'Boom: OFF';  
        applyTheme();  
    });  
    menu.appendChild(boomToggle);  

    const borderToggle = document.createElement('button');  
    borderToggle.innerText = effects.border ? 'Ramka: ON' : 'Ramka: OFF';  
    borderToggle.style.background = '#333';  
    borderToggle.style.color = colors.main;  
    borderToggle.style.border = '1px solid ' + colors.main;  
    borderToggle.style.borderRadius = '5px';  
    borderToggle.style.padding = '5px';  
    borderToggle.addEventListener('click', () => {  
        effects.border = !effects.border;  
        borderToggle.innerText = effects.border ? 'Ramka: ON' : 'Ramka: OFF';  
        applyTheme();  
    });  
    menu.appendChild(borderToggle);  

    const auto1080pToggle = document.createElement('button');  
    auto1080pToggle.innerText = auto1080p ? 'Auto1080p: ON' : 'Auto1080p: OFF';  
    auto1080pToggle.style.background = '#333';  
    auto1080pToggle.style.color = colors.main;  
    auto1080pToggle.style.border = '1px solid ' + colors.main;  
    auto1080pToggle.style.borderRadius = '5px';  
    auto1080pToggle.style.padding = '5px';  
    auto1080pToggle.addEventListener('click', () => {  
        auto1080p = !auto1080p;  
        auto1080pToggle.innerText = auto1080p ? 'Auto1080p: ON' : 'Auto1080p: OFF';  
        saveSettings();  
    });  
    menu.appendChild(auto1080pToggle);  

    const okButton = document.createElement('button');  
    okButton.innerText = 'Zapisz';  
    okButton.style.background = colors.main;  
    okButton.style.color = '#0d0d0d';  
    okButton.style.fontWeight = 'bold';  
    okButton.style.padding = '5px';  
    okButton.style.borderRadius = '5px';  
    okButton.addEventListener('click', () => {  
        saveSettings();  
        menu.style.display = 'none';  
    });  
    menu.appendChild(okButton);  

    const resetButton = document.createElement('button');  
    resetButton.innerText = 'Resetuj Kolory';  
    resetButton.style.background = '#ff0033';  
    resetButton.style.color = '#ffffff';  
    resetButton.style.fontWeight = 'bold';  
    resetButton.style.padding = '5px';  
    resetButton.style.borderRadius = '5px';  
    resetButton.addEventListener('click', () => {  
        resetColors();  
        menu.style.display = 'none';  
    });  
    menu.appendChild(resetButton);  

    const resetAllButton = document.createElement('button');  
    resetAllButton.innerText = 'Resetuj Wszystko';  
    resetAllButton.style.background = '#ff0033';  
    resetAllButton.style.color = '#ffffff';  
    resetAllButton.style.fontWeight = 'bold';  
    resetAllButton.style.padding = '5px';  
    resetAllButton.style.borderRadius = '5px';  
    resetAllButton.addEventListener('click', () => {  
        resetAll();  
    });  
    menu.appendChild(resetAllButton);  

    openMenuButton.addEventListener('click', () => {  
        menu.style.display = (menu.style.display === 'none') ? 'flex' : 'none';  
    });  

    const masthead = document.querySelector('#end');  
    if (masthead) {  
        const wrapper = document.createElement('div');  
        wrapper.style.position = 'relative';  
        wrapper.style.display = 'flex';  
        wrapper.style.alignItems = 'center';  
        wrapper.style.marginRight = '10px';  
        wrapper.appendChild(openMenuButton);  
        wrapper.appendChild(menu);  
        masthead.insertBefore(wrapper, masthead.firstChild);  
    }  
}  

document.addEventListener('fullscreenchange', () => {  
    const btn = document.getElementById('cyberpunk-settings-button');  
    if (!btn) return;  
    btn.style.display = document.fullscreenElement ? 'none' : 'flex';  
});  

applyTheme();  
createPanel();  

function quickFilters() {  
    const container = document.querySelector('ytd-feed-filter-chip-bar-renderer');  
    if (!container) return setTimeout(quickFilters, 500);  
    const bar = document.createElement('div');  
    bar.style.display = 'flex';  
    bar.style.justifyContent = 'center';  
    bar.style.gap = '10px';  
    bar.style.margin = '10px';  
    bar.innerHTML = `<button style="padding:5px 10px; background:${colors.main}; border:none; color:#0d0d0d; border-radius:20px; font-weight:bold; cursor:pointer;">🎬 Nowe</button><button style="padding:5px 10px; background:${colors.main}; border:none; color:#0d0d0d; border-radius:20px; font-weight:bold; cursor:pointer;">🔥 Najpopularniejsze</button><button style="padding:5px 10px; background:${colors.main}; border:none; color:#0d0d0d; border-radius:20px; font-weight:bold; cursor:pointer;">🎯 Na żywo</button>`;  
    const buttons = bar.querySelectorAll('button');  
    buttons[0].onclick = () => window.location.href = '/feed/subscriptions';  
    buttons[1].onclick = () => window.location.href = '/feed/trending';  
    buttons[2].onclick = () => window.location.href = '/live';  
    container.parentElement.insertBefore(bar, container);  
}  

function forceQuality() {  
    if (!auto1080p) return;  
    const player = document.querySelector('video');  
    if (!player) return setTimeout(forceQuality, 1000);  
    const qualityChange = () => {  
        const settingsButton = document.querySelector('.ytp-settings-button');  
        if (settingsButton) settingsButton.click();  
        setTimeout(() => {  
            const qualityMenuItems = [...document.querySelectorAll('.ytp-menuitem')].filter(e => e.innerText.includes('Jakość'));  
            if (qualityMenuItems.length) {  
                qualityMenuItems[0].click();  
                setTimeout(() => {  
                    const options = [...document.querySelectorAll('.ytp-quality-menu .ytp-menuitem')];  
                    const prefer = options.find(el => el.innerText.includes('1080'));  
                    const fallback = options.find(el => el.innerText.includes('480'));  
                    if (prefer) prefer.click();  
                    else if (fallback) fallback.click();  
                }, 300);  
            }  
        }, 300);  
    };  
    player.addEventListener('play', qualityChange);  
    qualityChange();  
}  

quickFilters();  
setTimeout(forceQuality, 3000);

})();