// ==UserScript==
// @name DelugeRPG Auto Battler!
// @namespace http://tampermonkey.net/
// @version 1.0
// @description Automates trainer battles using a move with your lead Pokémon (set as shiny mega houndoom, using water spout as lead for mine :D).
// @match https://www.delugerpg.com/battle/*
// @icon https://www.delugerpg.com/images/items/pokeball.png
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/555990/DelugeRPG%20Auto%20Battler%21.user.js
// @updateURL https://update.greasyfork.org/scripts/555990/DelugeRPG%20Auto%20Battler%21.meta.js
// ==/UserScript==
// DISCLAIMER: YOU MAY GET BANNED FOR THIS, USE AT YOUR OWN DISCRETION.
(function() {
    'use strict';
    const intervalTime = 1500; // interval between each action - keep 1500 as minimum!

    setInterval(() => {
        // Priority 0: CAPTCHA "Return to Game" button - auto checks the 'not a robot' captcha
        const captchaReturnBtn = document.querySelector('input.btn.btn-primary[type="submit"][name="clickhere"][value="Return to Game"]');
        if (captchaReturnBtn) {
            captchaReturnBtn.click();
            return;
        }

        // Priority 1: Initial "Start Battle" button
        const startBattleBtn = document.querySelector('input.btn-battle_action[type="submit"][name="Start Battle"][value="Start Battle"]');
        if (startBattleBtn) {
            startBattleBtn.click();
            return;
        }

        // Priority 2: Notify continue/repeat buttons after full battle win (try Repeat first)
        let notifyBtn = document.querySelector("#battle > div.notify_done > a.btn.btn-primary");
        if (notifyBtn) {
            notifyBtn.click();
            return;
        }
        notifyBtn = document.querySelector("#battle > div.notify_done > a.btn.btn-default");
        if (notifyBtn) {
            notifyBtn.click();
            return;
        }
        notifyBtn = document.querySelector("#battle > div.notify_done > a:nth-child(5)");
        if (notifyBtn) {
            notifyBtn.click();
            return;
        }

        // Priority 3: Battle "Continue" after all enemy Pokémon faint
        const battleContinueBtn = document.querySelector('input.btn-battle_action[type="submit"][name="continue_"][value=" Continue "]');
        if (battleContinueBtn) {
            battleContinueBtn.click();
            return;
        }

        // Priority 4: "Skip Pokemon Selection" after single enemy faint
        const skipBtn = document.querySelector('input.btn-battle_action[type="submit"][name="skip_"][value=" Skip Pokemon Selection "]');
        if (skipBtn) {
            skipBtn.click();
            return;
        }

        // Priority 5: "Continue" button after handling single enemy faint (when Continue was clicked instead of Skip)
        const postFaintContinueBtn = document.querySelector('input.btn-battle_action[type="submit"][name="Continue"][value="Continue"]');
        if (postFaintContinueBtn) {
            postFaintContinueBtn.click();
            return;
        }

        // Priority 6: "Normal Battle", "Repeat", or "Fight this trainer again." on trainer dashboard (win/loss) - battles the trainer again in a normal battle
        const battleBtns = document.querySelectorAll('a.btn.btn-primary[href*="/battle/trainer/"]');
        for (let btn of battleBtns) {
            const text = btn.textContent.trim();
            if (text === 'Normal Battle' ||
                text.includes('Normal Battle') ||
                text === 'Repeat' ||
                text.includes('Repeat') ||
                text === 'Fight this trainer again.' ||
                text.includes('Fight this trainer again')) {
                btn.click();
                return;
            }
        }

        // Priority 7: Pokémon selection/start (first option, no modal open)
        if (!document.querySelector(".modal-open")) {
            const pokeStartBtn = document.querySelector("#attack > div.cardif > form > div.buttoncenter > input:nth-child(1)");
            if (pokeStartBtn) {
                pokeStartBtn.click();
                return;
            }
        }

        // Priority 8: "Attack" button to enter move selection
        const attackBtn = document.querySelector('input.btn-battle_action[type="submit"][name="attack_"]');
        if (attackBtn) {
            attackBtn.click();
            return;
        }

        // Priority 9: move used - change as per your head move.
        const waterSpoutBtn = document.querySelector('#battle > form > div.center > input[value="Water Spout"]');
        if (waterSpoutBtn) {
            waterSpoutBtn.click();
            return;
        }
    }, intervalTime);
})();