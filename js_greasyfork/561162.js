// ==UserScript==
// @name         My_Names
// @namespace    kupi_scripts
// @match        https://chaturbate.com/*
// @version      0.03
// @author       kupiajvr
// @description  Highlight
// @license      GPL-3.0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaturbate.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561162/My_Names.user.js
// @updateURL https://update.greasyfork.org/scripts/561162/My_Names.meta.js
// ==/UserScript==

const listOfModels = ["kiri_is_all", "lina_owl", "mayzzi", "sofishine11", "ruthless_111", "wild_silk_desire", "sammytimelove", "alicehariss", "ollie_baird",
                      "ameliamiless", "yoki_shizuko", "emmawarren", "jiaalisaa", "silascollins", "veryveryvery_shy", "vanessa_joy_", "eva_cramer",
                      "dream_mari", "giacale", "kimforman", "hungry_kitty66", "luna_lure11", "_miss_kira_", "hotty_girls_here", "_snow_queen__",
                      "lullyfox", "aprilfarrow", "emilia_loki", "blondie_xoxoxo", "lady_killer_kris", "sexy_chatt", "scarlettwave", "honey_yani",
                      "cherry__kiss", "charlywines", "lexihoward", "miss_angelina_", "melissacharm_","tinabrook", "linda_s_", "innalovely", "mmoreon",
                      "hotmusex", "naomi_tara", "temptressweet", "avery_flores", "darina_m_", "divine_kim", "michellemilerr", "elle_drift", "utopian_demon",
                      "bekkareyes", "bellamwah", "amanda_bright_", "jessii_pinkman", "magic_katarina_", "gentlemuse1", "purrdiablo", "sport_tall_karina",
                      "kiramystery", "jessika_pinkman", "scarlettharrison09", "", "", "", ""];


(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        document.querySelectorAll("h2").forEach(h2 => {
            if(h2.textContent.includes("Community Controlled Shows")) markModels();
            if(h2.textContent.includes("Showing users running")) toMarkModels();
        });
    });

    observer.observe(document.body, { attributes: true, subtree: true });

})();


function markModels(){
    var roomsGroup = document.querySelectorAll("#roomlist_root > div.roomlist_container > ul.list")[1];
    var roomsList = roomsGroup.querySelectorAll("li.roomCard > div.details > div.title a");
    roomsList.forEach(room => {
        if(listOfModels.includes(room.text)){
            room.parentElement.parentElement.style.backgroundColor = "#11FF1177";
        }
    });
}
function toMarkModels(){
    var roomsGroup = document.querySelectorAll("#roomlist_root > div.roomlist_container > ul.list")[0];
    var roomsList = roomsGroup.querySelectorAll("li.roomCard > div.details > div.title a");
    roomsList.forEach(room => {
        if(listOfModels.includes(room.text)){
            room.parentElement.parentElement.style.backgroundColor = "#55996677";
        }
    });
}