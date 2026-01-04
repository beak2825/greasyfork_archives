// ==UserScript==
// @name         Tournament Inviter
// @namespace    http://tampermonkey.net/
// @version      2025-12-14
// @description  Provides context menu commands for inviting players (from a clan) to a tournament
// @author       JK_3
// @match        https://www.warzone.com/MultiPlayer/Tournaments/Forward?ID=*
// @icon         https://icons.duckduckgo.com/ip2/warzone.com.ico
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/558443/Tournament%20Inviter.user.js
// @updateURL https://update.greasyfork.org/scripts/558443/Tournament%20Inviter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getNextButton() {
        let iterator = document.querySelector("div[id^='ujs_PagingContainer']")?.querySelectorAll(".ujsBtn")
        if (iterator)
        {
            for (let btn of iterator) {
                if (btn.textContent.includes("Next")) {
                    return btn.querySelector("[id$='_btn']")
                }
            }
        }

        return null
    }

    function inviteAllPlayers() {
        for (let btn of document.querySelectorAll("[id^='ujs_InviteBtn_'][id$='_btn']")) {
            btn.click()
        }

        let nextBtn = getNextButton()
        if (nextBtn) {
            nextBtn.click()
            inviteAllPlayers()
        }
    }

    function inviteActivePlayers() {
        for (let img of document.querySelectorAll("[id^='ujs_OnlineImage'][id$='img']")) {
            if (img.checkVisibility()) {
                img.parentElement?.parentElement?.parentElement?.querySelector("[id^='ujs_InviteBtn_'][id$='_btn']")?.click()
            }
        }

        let nextBtn = getNextButton()
        if (nextBtn) {
            nextBtn.click()
            inviteActivePlayers()
        }
    }

    GM_registerMenuCommand("Invite all", inviteAllPlayers)
    GM_registerMenuCommand("Invite active players only", inviteActivePlayers)
})();
