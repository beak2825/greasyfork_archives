// ==UserScript==
// @name             Neopets: Wheel of Monotony Timer and Beeper
// @namespace        kmtxcxjx
// @version          1.0
// @description      Shows a count-up timer below the Wheel of Monotony, and beeps when it finishes
// @match            *://www.neopets.com/prehistoric/monotony/monotony.phtml
// @grant            none
// @run-at           document-end
// @icon             https://images.neopets.com/games/aaa/dailydare/2012/post/theme-icon.png
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/553138/Neopets%3A%20Wheel%20of%20Monotony%20Timer%20and%20Beeper.user.js
// @updateURL https://update.greasyfork.org/scripts/553138/Neopets%3A%20Wheel%20of%20Monotony%20Timer%20and%20Beeper.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // Change this to false if you don't want it to beep when the wheel is done
    const beepWhenDone = true;

    function beep() {
        const ctx = new AudioContext();
        for (let i = 0; i < 2; i++) { // Two low tones
            const osc = ctx.createOscillator();
            osc.frequency.value = 300;
            osc.connect(ctx.destination);
            osc.start(ctx.currentTime + i * 0.1); // 0.1s apart
            osc.stop(ctx.currentTime + i * 0.1 + 0.05); // 0.05s duration per beep
        }
    }

    const wheelDiv = document.getElementById('wheelbox');
    const spinButton = document.getElementById('wheelButtonSpin');
    if (!wheelDiv || !spinButton) return;

    // Canvas isn't always ready right away - wait until it is in that case
    async function getWheelCanvas() {
        let wheelCanvas = document.querySelector('canvas');
        while (!wheelCanvas) {
            await new Promise(r => setTimeout(r, 100));
            wheelCanvas = document.querySelector('canvas');
        }
        return wheelCanvas;
    }
    const wheelCanvas = await getWheelCanvas();

    let wheelTimer = null;
    function startTimer() {
        // Do nothing if the timer has already started
        if (wheelTimer) return;

        const clickToShowPrizeDiv = document.getElementById('clickToShowPrize');
        const wheelDonePopupDiv = document.getElementById('wheelDonePopup');
        const wheelPrizePopupDiv = document.getElementById('wheelPrizePopup');
        if (clickToShowPrizeDiv.style.display !== 'none' ||
            wheelDonePopupDiv.style.display !== 'none' ||
            wheelPrizePopupDiv.style.display !== 'none') return;

        let timerP = document.getElementById('wheelTimer');
        if (!timerP) {
            // Add the timer below the wheel
            timerP = document.createElement('p');
            timerP.id = 'wheelTimer';
            timerP.style.fontWeight = 'bold';
            wheelDiv.parentNode.insertBefore(timerP, wheelDiv.nextSibling);
        }
        timerP.textContent = '00:00:00';
        document.title = '00:00:00';

        let seconds = 0;
        wheelTimer = setInterval(() => {
            // Wheel doesn't spin when the tab isn't active
            if (document.hidden) return;
            if (clickToShowPrizeDiv.style.display !== 'none' ||
                wheelDonePopupDiv.style.display !== 'none') {
                // Change title back
                document.title = 'Neopets - The Wheel of Monotony';
                // Keep the timer there, as a record of how long it took
                //timerP.remove();
                if (beepWhenDone) {
                    beep();
                }
                clearInterval(wheelTimer);
                wheelTimer = null;
                return;
            }
            seconds++;
            const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
            const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
            const secs = String(seconds % 60).padStart(2, '0');
            const timeText = `${hrs}:${mins}:${secs}`;
            timerP.textContent = timeText;
            document.title = timeText;
        }, 1000);
    }

    // Event listeners for the wheel spinning
    // mousedown for wheelCanvas because any type of click on it starts the wheel
    if (wheelCanvas) wheelCanvas.addEventListener('mousedown', startTimer);
    if (spinButton) spinButton.addEventListener('click', startTimer);
})();
