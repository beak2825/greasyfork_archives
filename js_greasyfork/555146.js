// ==UserScript==
// @name         Tim_Veneraka прворка объём шрифта размера и так далее 
// @namespace    http://tampermonkey.net/
// @version      30.0
// @description  Tim_Venera обновление выбор устройства, улучшена проверка шрифтов, исправлен размер >15, объём, фото, интерфейс ✨
// @author       Tim_Venerka
// @match        https://forum.blackrussia.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555146/Tim_Veneraka%20%D0%BF%D1%80%D0%B2%D0%BE%D1%80%D0%BA%D0%B0%20%D0%BE%D0%B1%D1%8A%D1%91%D0%BC%20%D1%88%D1%80%D0%B8%D1%84%D1%82%D0%B0%20%D1%80%D0%B0%D0%B7%D0%BC%D0%B5%D1%80%D0%B0%20%D0%B8%20%D1%82%D0%B0%D0%BA%20%D0%B4%D0%B0%D0%BB%D0%B5%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/555146/Tim_Veneraka%20%D0%BF%D1%80%D0%B2%D0%BE%D1%80%D0%BA%D0%B0%20%D0%BE%D0%B1%D1%8A%D1%91%D0%BC%20%D1%88%D1%80%D0%B8%D1%84%D1%82%D0%B0%20%D1%80%D0%B0%D0%B7%D0%BC%D0%B5%D1%80%D0%B0%20%D0%B8%20%D1%82%D0%B0%D0%BA%20%D0%B4%D0%B0%D0%BB%D0%B5%D0%B5.meta.js
// ==/UserScript==

(function () {
'use strict';

const ALLOWED_FONTS = ['verdana', 'times new roman'];
const LS_KEY = 'br_check_v30_clean';

const TEMPLATE_PHRASES = [
    "Имя и фамилия персонажа", "Укажите полное имя", "можно придумать необычное", "но реалистичное",
    "Пол", "Мужской", "Женский",
    "Возраст", "Реалистичный возраст", "соответствующий опыту и занятиям персонажа",
    "Национальность", "Укажите страну или народ", "к которому принадлежит персонаж",
    "Образование", "Опишите, где и чему учился персонаж", "школа, колледж, университет, курсы или самообразование",
    "Описание внешности", "Рост, телосложение, цвет волос, глаз, особенности", "шрамы, татуировки, манера одеваться",
    "Характер", "Опишите сильные и слабые стороны, темперамент, привычки",
    "Пример", "общительный и открытый, но быстро вспыхивает", "спокойный и расчётливый, склонен к упрямству",
    "Детство", "Кратко опишите семью, условия жизни, важные события в ранние годы", "бедность, переезд, утрата, дружба",
    "Настоящее время", "Чем персонаж занимается сейчас", "работа, место жительства, социальный статус, круг общения",
    "Итог", "Опишите, какие качества и цели сформировались у персонажа после всех событий", "Это подводит итог всей биографии"
];

const settings = Object.assign({
    checkFont: true,
    checkSize: true,
    checkVolume: true,
    checkPhoto: true,
    showNotif: true,
    explosion: true,
    deviceMode: 'pc'
}, JSON.parse(localStorage.getItem(LS_KEY) || '{}'));

let lastTopicId = null;
let notifTimeout = null;

function saveSettings() { localStorage.setItem(LS_KEY, JSON.stringify(settings)); }

const style = document.createElement('style');
style.textContent = `
    .br-ui-element { font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif; box-sizing: border-box; }
    @keyframes br-fade-up { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
    @keyframes br-scale-in { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

    .br-gear {
        position: fixed; top: 20px; right: 20px; z-index: 99999;
        width: 44px; height: 44px;
        background: rgba(28, 28, 30, 0.6);
        backdrop-filter: blur(20px) saturate(180%);
        color: #fff; font-size: 22px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; border: 1px solid rgba(255,255,255,0.1);
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .br-gear:hover { transform: rotate(90deg); background: rgba(50, 50, 50, 0.8); }

    .br-settings {
        position: fixed; z-index: 99998; display: none;
        background: rgba(30, 30, 30, 0.85);
        backdrop-filter: blur(35px) saturate(180%);
        border: 1px solid rgba(255,255,255,0.15);
        box-shadow: 0 20px 50px rgba(0,0,0,0.6);
        padding: 20px; color: #fff;
        animation: br-scale-in 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .br-settings.show { display: block; }
    .br-mode-pc .br-settings { top: 80px; right: 20px; width: 280px; border-radius: 18px; }
    .br-mode-mobile .br-settings { bottom: 20px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 400px; border-radius: 24px; animation: br-fade-up 0.4s; }
    
    .br-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .br-title { font-weight: 600; font-size: 17px; }
    .br-close { color: #8e8e93; cursor: pointer; font-size: 24px; padding: 5px; }

    .br-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 4px 0; }
    .br-label { font-size: 15px; font-weight: 400; }

    .br-switch { position: relative; display: inline-block; width: 42px; height: 24px; }
    .br-switch input { opacity: 0; width: 0; height: 0; }
    .br-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #3a3a3c; transition: .4s; border-radius: 24px; }
    .br-slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; }
    input:checked + .br-slider { background-color: #30d158; }
    input:checked + .br-slider:before { transform: translateX(18px); }

    .br-notif {
        position: fixed; left: 50%; bottom: 40px; transform: translate(-50%, 20px);
        opacity: 0; transition: all 0.5s;
        background: rgba(28, 28, 30, 0.9); backdrop-filter: blur(20px);
        color: #fff; padding: 12px 24px; border-radius: 50px;
        border: 1px solid rgba(255,255,255,0.1); font-weight: 600; z-index: 100000;
        pointer-events: none; text-align: center;
    }
    .br-notif.show { opacity: 1; transform: translate(-50%, 0); }
    .br-notif.good { border-color: #30d158; color: #30d158; }
    .br-notif.bad { border-color: #ff453a; color: #ff453a; }

    .br-indicator {
        position: absolute; top: 10px; right: 10px; padding: 8px 12px;
        border-radius: 12px; font-size: 12px; font-weight: 600; color: #fff;
        background: rgba(0,0,0,0.5); backdrop-filter: blur(12px);
        display: flex; flex-direction: column; align-items: flex-end; gap: 4px; z-index: 50;
        border: 1px solid rgba(255,255,255,0.1);
    }
    .br-indicator .ok { color: #30d158; }
    .br-indicator .err { color: #ff453a; }
`;
document.head.appendChild(style);

const gear = document.createElement('div'); gear.className='br-gear br-ui-element'; gear.innerHTML='⚙️';
document.body.appendChild(gear);

const settingsPanel = document.createElement('div'); settingsPanel.className='br-settings br-ui-element';

function createToggle(id, label, checked) {
    return `
    <div class="br-row">
        <span class="br-label">${label}</span>
        <label class="br-switch">
            <input type="checkbox" id="${id}" ${checked ? 'checked' : ''}>
            <span class="br-slider"></span>
        </label>
    </div>`;
}

settingsPanel.innerHTML = `
    <div class="br-header"><span class="br-title">Настройки</span><span class="br-close">✕</span></div>
    <div class="br-row">
        <select id="deviceSelector" style="width:100%; padding:8px; border-radius:8px; background:#1c1c1e; color:white; border:none;">
            <option value="pc">🖥️ PC</option>
            <option value="mobile">📱 Mobile</option>
        </select>
    </div>
    ${createToggle('fontCheck', 'Шрифт', settings.checkFont)}
    ${createToggle('sizeCheck', 'Размер', settings.checkSize)}
    ${createToggle('volCheck', 'Объём (200-600)', settings.checkVolume)}
    ${createToggle('photoCheck', 'Фото / Ссылки', settings.checkPhoto)}
    <div style="border-top:1px solid rgba(255,255,255,0.1); margin:15px 0;"></div>
    ${createToggle('notifCheck', 'Уведомления', settings.showNotif)}
    ${createToggle('explosionCheck', 'Салют', settings.explosion)}
`;
document.body.appendChild(settingsPanel);

function applyMode() {
    document.body.classList.remove('br-mode-pc', 'br-mode-mobile');
    document.body.classList.add('br-mode-' + settings.deviceMode);
}

gear.onclick = (e) => { e.stopPropagation(); settingsPanel.classList.toggle('show'); };
settingsPanel.querySelector('.br-close').onclick = () => settingsPanel.classList.remove('show');
document.addEventListener('click', (e) => {
    if (!settingsPanel.contains(e.target) && e.target !== gear) settingsPanel.classList.remove('show');
});

const devSel = document.getElementById('deviceSelector');
devSel.value = settings.deviceMode;
devSel.onchange = () => { settings.deviceMode = devSel.value; saveSettings(); applyMode(); };

settingsPanel.onchange = (e) => {
    if(e.target.tagName === 'SELECT') return;
    settings.checkFont = document.getElementById('fontCheck').checked;
    settings.checkSize = document.getElementById('sizeCheck').checked;
    settings.checkVolume = document.getElementById('volCheck').checked;
    settings.checkPhoto = document.getElementById('photoCheck').checked;
    settings.showNotif = document.getElementById('notifCheck').checked;
    settings.explosion = document.getElementById('explosionCheck').checked;
    saveSettings();
    runCheck();
};
applyMode();

let notifEl = null;
function notify(htmlMsg, type) {
    if(!settings.showNotif) return;
    if(!notifEl){ notifEl=document.createElement('div'); notifEl.className='br-notif br-ui-element'; document.body.appendChild(notifEl); }
    if (notifEl.innerHTML === htmlMsg && notifEl.classList.contains('show')) return;
    notifEl.innerHTML = htmlMsg; notifEl.className=`br-notif br-ui-element ${type} show`;
    clearTimeout(notifTimeout); notifTimeout = setTimeout(()=> { notifEl.classList.remove('show'); }, 5000);
}

function calculateVolume(element) {
    const clone = element.cloneNode(true);
    const scriptUI = clone.querySelectorAll('.br-indicator, .br-gear, .br-notif');
    scriptUI.forEach(el => el.remove());
    let rawText = clone.textContent;
    let cleanText = rawText.replace(/[\u00A0\t\n\r]/g, ' ').replace(/\s+/g, ' ');
    TEMPLATE_PHRASES.forEach(phrase => {
        let escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+');
        let re = new RegExp(escaped, 'gi');
        cleanText = cleanText.replace(re, ' ');
    });
    const wordsArray = cleanText.match(/[а-яА-ЯёЁa-zA-Z]+/g);
    return wordsArray ? wordsArray.length : 0;
}

function analyzeTopPost() {
    const wrapper = document.querySelector('.bbWrapper');
    if (!wrapper) return;

    let resultHTML = "";
    let allPassed = true;
    let problems = [];

    if (settings.checkFont) {
        const comp = getComputedStyle(wrapper);
        const fonts = (comp.fontFamily || '').toLowerCase();
        let fontOK = ALLOWED_FONTS.some(f => fonts.includes(f));
        if (!fontOK) {
             const innerFontEl = wrapper.querySelector('[style*="font-family"]');
             if(innerFontEl && ALLOWED_FONTS.some(f => innerFontEl.style.fontFamily.toLowerCase().includes(f))) fontOK = true;
        }
        resultHTML += `<span class="${fontOK?'ok':'err'}">${fontOK?'✅':'❌'} Шрифт</span>`;
        if (!fontOK) { allPassed = false; problems.push("Шрифт"); }
    }

    if (settings.checkSize) {
        const textEl = wrapper.querySelector('[style*="font-size"]') || wrapper; 
        const size = parseFloat(getComputedStyle(textEl).fontSize);
        let sizeOK = (size >= 14.5);
        resultHTML += `<span class="${sizeOK?'ok':'err'}">${sizeOK?'✅':'❌'} Размер (${Math.round(size)}px)</span>`;
        if (!sizeOK) { allPassed = false; problems.push("Размер < 15px"); }
    }

    let wordCount = 0;
    if (settings.checkVolume) {
        wordCount = calculateVolume(wrapper);
        let volOK = (wordCount >= 200 && wordCount <= 600);
        resultHTML += `<span class="${volOK?'ok':'err'}">${volOK?'✅':'❌'} Объём: ${wordCount}</span>`;
        if (!volOK) { allPassed = false; problems.push("Объём"); }
    }

    if (settings.checkPhoto) {
        const hasImg = wrapper.querySelector('img[src*="http"]'); 
        const hasLink = Array.from(wrapper.querySelectorAll('a')).some(a => (a.href && a.href.includes('http')));
        let photoOK = !!(hasImg || hasLink);
        resultHTML += `<span class="${photoOK?'ok':'err'}">${photoOK?'✅':'❌'} Фото/Ссылки</span>`;
        if (!photoOK) { allPassed = false; problems.push("Нет фото"); }
    }

    let ind = wrapper.querySelector('.br-indicator');
    if (!ind) {
        ind = document.createElement('div'); ind.className='br-indicator br-ui-element';
        if(getComputedStyle(wrapper).position === 'static') wrapper.style.position='relative';
        wrapper.appendChild(ind);
    }
    ind.innerHTML = resultHTML;

    if (allPassed) {
        notify("✅ Био одобрена.", "good");
        const topicId = location.pathname;
        if (settings.explosion && lastTopicId !== topicId) {
            lastTopicId = topicId;
            createFireworks();
        }
    } else {
        notify("❌ Исправьте: " + problems.join(", "), "bad");
    }
}

function createFireworks() {
    const colors = ['#30d158', '#ffd60a', '#ff453a', '#0a84ff', '#fff'];
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:100002;';
    document.body.appendChild(container);
    for (let i=0; i<40; i++) {
        const p = document.createElement('div');
        p.style.cssText = `position:absolute;top:50%;left:50%;width:6px;height:6px;border-radius:50%;background:${colors[Math.floor(Math.random()*colors.length)]};transition:1s ease-out;`;
        container.appendChild(p);
        const angle = Math.random() * Math.PI * 2;
        const dist = 100 + Math.random() * 300;
        requestAnimationFrame(()=>{
            p.style.transform = `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px) scale(0)`;
            p.style.opacity = 0;
        });
    }
    setTimeout(()=>container.remove(), 1200);
}

function runCheck(){ analyzeTopPost(); }

let obsTimer;
const observer = new MutationObserver((mutations)=>{
    let shouldRun = false;
    for(let m of mutations) {
        if(m.target.className && typeof m.target.className === 'string' && m.target.className.includes('br-')) continue;
        if(m.target.closest && m.target.closest('.br-indicator')) continue;
        shouldRun = true;
    }
    if(shouldRun) {
        clearTimeout(obsTimer);
        obsTimer=setTimeout(runCheck, 2000);
    }
});

setTimeout(() => {
    observer.observe(document.body, {childList:true, subtree:true});
    runCheck();
}, 2000);

})();