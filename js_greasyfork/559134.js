// ==UserScript==
// @name         AUTOsda4a (smart safe + pleasant sound + random time v0.8)
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Автосдача таска с рандомным временем (15–50 сек), если есть прогресс (не 0/x). Приятный звук 🔔
// @author       Deonator
// @match        *://*/Admin/MyCurrentTask/Active
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559134/AUTOsda4a%20%28smart%20safe%20%2B%20pleasant%20sound%20%2B%20random%20time%20v08%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559134/AUTOsda4a%20%28smart%20safe%20%2B%20pleasant%20sound%20%2B%20random%20time%20v08%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let taskSubmitted = false;
    const randomTarget = Math.floor(Math.random() * (50 - 15 + 1)) + 15; // 🎲 случайное число от 15 до 50

    console.log(`🎯 Авто-сдача запланирована на ~${randomTarget} секунд до конца`);

    // 🔔 Приятный двойной сигнал
    function playSound() {
        const ctx = new AudioContext();

        function beep(frequency, startTime, duration) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(frequency, startTime);
            gain.gain.setValueAtTime(0.08, startTime);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + duration);
        }

        const now = ctx.currentTime;
        beep(660, now, 0.25);
        beep(880, now + 0.3, 0.3);
    }

    function hasProgress() {
        const text = document.title || document.body.innerText;
        const match = text.match(/(\d+)\s*\/\s*(\d+)/);
        if (!match) return false;

        const done = parseInt(match[1]);
        const total = parseInt(match[2]);
        console.log(`📊 Прогресс: ${done}/${total}`);
        return done > 0 && total > 0;
    }

    function getRemainingSeconds(timerText) {
        const match = timerText.match(/(\d{2}):(\d{2}):(\d{2})/);
        if (!match) return null;
        const [_, h, m, s] = match.map(Number);
        return h * 3600 + m * 60 + s;
    }

    function checkTimer() {
        if (taskSubmitted) return;

        const timer = document.getElementById('countdown');
        if (!timer) return;

        const timeText = timer.textContent.trim();
        const seconds = getRemainingSeconds(timeText);
        if (seconds === null) return;

        if (seconds <= randomTarget) {
            console.log(`⏳ Осталось ${seconds} секунд (цель: ${randomTarget})`);

            if (hasProgress()) {
                const doneBtn = document.getElementById('done-task');
                if (doneBtn) {
                    console.log("✅ Есть прогресс — сдаём таск");
                    window.confirm = () => true;
                    doneBtn.click();
                    playSound();
                    taskSubmitted = true;
                }
            } else {
                console.log("⚠️ Прогресса нет (0/x) — таск не сдаём");
            }
        }
    }

    setInterval(checkTimer, 1000);
})();