// ==UserScript==
// @name         1 your turn
// @namespace    http://tampermonkey.net/
// @version      0.4.3
// @description  Ваш ход в бою, но звук более мягкий. Нужно активировать каждый раз по еле заметной кнопке слева сверху. Кулдаун на срабатывание звука 15 сек
// @author       Something begins
// @license      bumfuck licensing
// @match        https://www.heroeswm.ru/war*
// @match        https://my.lordswm.com/war*
// @match        https://www.lordswm.com/war*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lordswm.com
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/561564/1%20your%20turn.user.js
// @updateURL https://update.greasyfork.org/scripts/561564/1%20your%20turn.meta.js
// ==/UserScript==

const ctx = new AudioContext();
let unlocked = false;

// ================= BUTTON =================

const btn = document.createElement('button');
btn.textContent = '🔒 Ваш ход';
btn.style.zIndex = 9999;
btn.style.padding = '8px 12px';
btn.style.background = 'rgb(255,0,0)';
btn.style.color = 'white';
btn.style.border = 'none';
btn.style.borderRadius = '5px';
btn.style.cursor = 'pointer';
btn.style.fontSize = '14px';
btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
btn.style.opacity = '0.1';

btn.addEventListener('click', async () => {
    try {
        await ctx.resume();
        unlocked = ctx.state === 'running';

        if (unlocked) {
            btn.textContent = '🔓 Звук активирован';
            btn.disabled = true;
            btn.style.background = '#28a745';
            setTimeout(() => { btn.remove(); }, 1000);
        } else {
            btn.textContent = '🔒 Ваш ход';
        }

        console.log('Audio unlocked:', unlocked);
    } catch (e) {
        console.error('Failed to unlock audio:', e);
    }
});

// ================= INSERT BUTTON =================

let settings_interval = setInterval(() => {
    try {
        if (Object.keys(unsafeWindow.stage.pole.obj).length !== 0) {
            clearInterval(settings_interval);
            if (battle_ended || !playero) throw new Error("finished");
            document.querySelector(".toolbar_TopLeft").append(btn);
            console.log("battle_ended", battle_ended, playero);
        }
    } catch (e) {}
}, 300);

// ================= LOGIC =================

let lastTurn, played;

function conditionMet() {
    console.log(lastTurn, nowturn, activeobj);

    if (nowturn === lastTurn) {
        if (played) return false;
        else {
            if (activeobj) {
                played = true;
                console.log("played");
                return true;
            } else return false;
        }
    }

    lastTurn = nowturn;
    played = false;
    return false;
}

// ================= SOUND =================

function playMildTone() {
    const o = ctx.createOscillator();
    const g = ctx.createGain();

    o.type = 'sine';
    o.frequency.value = 520;

    const now = ctx.currentTime;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(1, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    o.connect(g).connect(ctx.destination);
    o.start(now);
    o.stop(now + 0.25);
}

// ================= COOLDOWN =================

const COOLDOWN = 15000; // 15 seconds
let lastPlay = 0;

function canPlay() {
    const now = Date.now();
    if (now - lastPlay < COOLDOWN) return false;
    lastPlay = now;
    return true;
}

// ================= MAIN LOOP =================

setInterval(() => {
    if (!fast_battle_off && unlocked && conditionMet() && canPlay()) {
        playMildTone();
    }
}, 100);
