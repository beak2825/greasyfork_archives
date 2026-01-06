// ==UserScript==
// @name         "Your turn" sound - enhanced
// @namespace    http://tampermonkey.net/
// @version      0.5.0.3
// @description  Звук `ваш ход`. Не срабатывает в цепочке ходов своих существ. Громкость регулировать на 16 строке. Активация по прозрачной кнопке слева сверху.
// @author       Something begins
// @license      bumfuck licensing
// @match       https://www.heroeswm.ru/war*
// @match       https://my.lordswm.com/war*
// @match       https://www.lordswm.com/war*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lordswm.com
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/561564/%22Your%20turn%22%20sound%20-%20enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/561564/%22Your%20turn%22%20sound%20-%20enhanced.meta.js
// ==/UserScript==

// СНИЗУ МОЖНО МЕНЯТЬ ГРОМКОСТЬ от 0.1 до 1 (можно до ~2, но возможны искажения)
const volume = 1;
const ctx = new AudioContext();
let unlocked = false;

// Create floating unlock button
const btn = document.createElement('button');
btn.textContent = '🔒 Ваш ход'; // initial locked state
btn.style.zIndex = 9999;
btn.style.padding = '8px 12px';
btn.style.background = 'rgb(255,0,0)';
btn.style.color = 'white';
btn.style.border = 'none';
btn.style.borderRadius = '5px';
btn.style.cursor = 'pointer';
btn.style.fontSize = '14px';
btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
btn.style.opacity = '0.2';

// Audio unlock logic
btn.addEventListener('click', async () => {
    try {
        await ctx.resume(); // unlock AudioContext
        unlocked = ctx.state === 'running';

        if (unlocked) {
            // Change emoji and text when unlocked
            btn.textContent = '🔓 Звук активирован';
            btn.disabled = true; // optional: prevent further clicks
            btn.style.background = '#28a745'; // optional: green to indicate unlocked
            setTimeout(()=>{btn.remove()}, 1000);
        } else {
            btn.textContent = '🔒 Ваш ход';
        }

    } catch (e) {
    }
});

let settings_interval = setInterval(() => {
    if (Object.keys(unsafeWindow.stage.pole.obj).length !== 0) {
        clearInterval(settings_interval)
        if (battle_ended || !playero) throw new Error("finished");
        document.querySelector(".toolbar_TopLeft").append(btn);

    }
}, 300);

 ;
let lastATB, played, lastActive;
function conditionMet() {
    if (atb[0] === lastATB) {
        if (played) return false;
        else {
            if (activeobj) {
                if (lastActive) return false;
                played = true;
                lastActive = true;
                return true;
            }
            else {lastActive = false; return false};
        }
    }
    lastATB = atb[0];
    played = false;
    return false;
}
function playMildTone() {
    const o = ctx.createOscillator();
    const g = ctx.createGain();

    o.type = 'sine';          // softest waveform
    o.frequency.value = 520; // pleasant mid-range tone

    // Gentle fade in/out
    const now = ctx.currentTime;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(volume, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    o.connect(g).connect(ctx.destination);
    o.start(now);
    o.stop(now + 0.25);
}

let lastPlay = 0;

function canPlay(ms = 600) {
    const now = Date.now();
    if (now - lastPlay < ms) return false;
    lastPlay = now;
    return true;
}

setInterval(() => {
    if (!fast_battle_off && unlocked && conditionMet() && canPlay() ) {
        playMildTone();
    }
}, 100);
