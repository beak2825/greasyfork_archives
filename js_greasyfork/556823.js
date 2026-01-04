// ==UserScript==
// @name         The Climb Auto Quest Loop
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically completes quest cycles, sleeps optimally, and loops indefinitely.
// @author       Demonwolfies
// @match        https://tomlipo.github.io/the-climb/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556823/The%20Climb%20Auto%20Quest%20Loop.user.js
// @updateURL https://update.greasyfork.org/scripts/556823/The%20Climb%20Auto%20Quest%20Loop.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // === Global control flags ===
    let running = false;
    let paused = false;

    // === Helper Functions ===
    function logStatus(msg) {
        console.log(`%c[The Climb Bot]%c ${msg}`, 'color: #1abc9c; font-weight: bold;', 'color: white;');
    }

    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const interval = 200;
            let elapsed = 0;
            const check = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(check);
                    resolve(el);
                }
                elapsed += interval;
                if (elapsed >= timeout) {
                    clearInterval(check);
                    reject(`Timeout waiting for ${selector}`);
                }
            }, interval);
        });
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function clickSelector(selector, delay = 1000) {
        const el = await waitForElement(selector);
        el.click();
        await sleep(delay);
    }

    async function waitWhilePaused() {
        while (paused) {
            await sleep(500);
        }
    }

    // === Core Steps ===
    async function collectQuests() {
        await waitWhilePaused();
        logStatus("Collecting quests...");
        const questDivs = document.querySelectorAll('.quest.G, .quest.F');
        questDivs.forEach(q => q.click());
        logStatus(`Clicked ${questDivs.length} quests!`);
        await sleep(1000);
    }

    async function getNextContractTime() {
        await waitWhilePaused();
        const contractEl = document.querySelector('span.reset');
        if (!contractEl) return null;
        const fullText = contractEl.innerText;
        const contractTime = fullText.replace("Next contracts at: ", "").trim();
        logStatus("Next contract time: " + contractTime);
        return contractTime;
    }

    async function completeQuests() {
        await waitWhilePaused();
        logStatus("Completing quests...");
        await clickSelector('div.option.leave'); // Leave job board
        await clickSelector('div.option.enter img[src="/the-climb/img/reception.png"]');
        await clickSelector('.btn.cancel.complete-all');
        await clickSelector('div.option.leave img[src="/the-climb/img/leave.png"]');
        await clickSelector('div.option.leave img[src="/the-climb/img/leave.png"]');
        logStatus("Finished all quests!");
    }

    async function sleepUntilMorning(contractTime) {
        await waitWhilePaused();
        logStatus("Heading home to sleep...");
        await clickSelector('div.option.enter img[src="/the-climb/img/home.png"]');
        await clickSelector('div.option.enter img[src="/the-climb/img/sleep.png"]');

        // === Helper: Compare game dates properly ===
        function isAfterOrEqual(current, target) {
            const [curDate, curTime = "00:00"] = current.split(' ');
            const [tarDate, tarTime = "00:00"] = target.split(' ');

            const [curY, curM, curD] = curDate.split('/').map(Number);
            const [tarY, tarM, tarD] = tarDate.split('/').map(Number);

            const [curH, curMin] = curTime.split(':').map(Number);
            const [tarH, tarMin] = tarTime.split(':').map(Number);

            if (curY !== tarY) return curY > tarY;
            if (curM !== tarM) return curM > tarM;
            if (curD !== tarD) return curD > tarD;
            if (curH !== tarH) return curH > tarH;
            return curMin >= tarMin;
        }

        // === Step 1: Sleep until morning if button is available ===
        while (true) {
            await waitWhilePaused();
            if (!running) return;

            const sleepMorningBtn = document.querySelector('div.option.leave img[src="/the-climb/img/sleep.png"]');
            const timeEl = document.querySelector('.datetime');
            const currentTime = timeEl ? timeEl.innerText : null;

            if (sleepMorningBtn && currentTime && !isAfterOrEqual(currentTime, contractTime)) {
                logStatus("Sleeping until morning...");
                sleepMorningBtn.click();
                await sleep(3000); // give the game time to process
                break;
            }

            if (currentTime && isAfterOrEqual(currentTime, contractTime)) {
                logStatus("Reached contract time during night, skipping sleep-until-morning.");
                break;
            }

            await sleep(2000);
        }

        // === Step 2: Stay in bed until contract reset ===
        logStatus("Still resting... waiting for contract reset time to arrive.");
        while (true) {
            await waitWhilePaused();
            if (!running) return;

            const timeEl = document.querySelector('.datetime');
            const currentTime = timeEl ? timeEl.innerText : null;

            if (currentTime && isAfterOrEqual(currentTime, contractTime)) {
                logStatus("Contract time reached — time to get up!");
                break;
            }

            const sleepAgainBtn = document.querySelector('div.option.leave img[src="/the-climb/img/sleep.png"]');
            if (sleepAgainBtn) {
                sleepAgainBtn.click();
                logStatus("Slept until next morning...");
                await sleep(3000);
            }

            await sleep(2000);
        }

        // === Step 3: Wake up and leave home ===
        const getUpBtn = document.querySelector('div.option.leave img[src="/the-climb/img/leave.png"]');
        if (getUpBtn) {
            logStatus("Getting up...");
            getUpBtn.click();
            await sleep(1500);
        }

        const leaveHomeBtn = document.querySelector('div.option.leave img[src="/the-climb/img/leave.png"]');
        if (leaveHomeBtn) {
            logStatus("Leaving home...");
            leaveHomeBtn.click();
            await sleep(1500);
        }
    }





    async function goToJobBoard() {
        await waitWhilePaused();
        logStatus("Returning to Adventurers' Guild...");
        await clickSelector('div.option.enter img[src="/the-climb/img/adventurers_guild.png"]');
        await clickSelector('div.option.enter img[src="/the-climb/img/job_board.png"]');
    }

    // === Main Loop ===
    async function mainLoop() {
        running = true;
        logStatus("Automation started! Press 'P' to pause/resume, 'X' to stop.");

        while (running) {
            try {
                await waitWhilePaused();
                await collectQuests();
                const nextTime = await getNextContractTime();
                await completeQuests();
                await sleepUntilMorning(nextTime);
                await goToJobBoard();
                logStatus("Cycle complete — restarting...");
                await sleep(2000);
            } catch (err) {
                logStatus(`Error: ${err}`);
                await sleep(3000);
            }
        }

        logStatus("Automation stopped.");
    }

    // === Hotkey Controls ===
    document.addEventListener('keydown', e => {
        const key = e.key.toUpperCase();

        if (key === 'S') {
            if (!running) {
                mainLoop();
            } else {
                logStatus("Already running!");
            }
        } else if (key === 'P') {
            paused = !paused;
            logStatus(paused ? "Paused." : "Resumed.");
        } else if (key === 'X') {
            running = false;
            paused = false;
            logStatus("Stopped.");
        }
    });

    logStatus("Script loaded. Press 'S' to start automation.");

})();