// ==UserScript==
// @name         Neopets: Favorite Battledome Opponent
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.0.0
// @description  Allows you to favorite Battledome opponents so they'll be shown first in the list
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @homepage     https://github.com/saahphire/NeopetsUserscripts
// @match        *://*.neopets.com/dome/fight.phtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        GM.setValue
// @grant        GM.getValue
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/557430/Neopets%3A%20Favorite%20Battledome%20Opponent.user.js
// @updateURL https://update.greasyfork.org/scripts/557430/Neopets%3A%20Favorite%20Battledome%20Opponent.meta.js
// ==/UserScript==

/*
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•
..................................................................................................................
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆
    This script does the following:
    1. Adds a "favorite" (heart) button next to each PvE Battledome opponent's name
    2. Allows you to click that button to toggle between favoriting and unfavoriting that opponent
    3. Adds a filter (shield, at the top of the page) for favorited opponents
       (Just like other shields, to turn it off, select the empty shield instead)
    4. Allows you to make it so the filter is applied by default when starting a fight by changing a variable

    No more scrolling for years to reach the Mutant Walein or the Obelisk opponents!
    ✦ ⌇ saahphire
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆
..................................................................................................................
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•
*/

// Change this to true if you want to see only favorites whenever you start a fight.
// Leave it as false if you want to see all opponents whenever you start a fight.
const filterByFavoritesByDefault = true;

const removeFromArray = (arr, i) => arr.slice(0, i).concat(arr.slice(i + 1, arr.length));

const toggleFavorite = async (event) => {
    let favorites = await GM.getValue("favorites", []);
    const id = parseInt(event.target.dataset.id);
    const index = favorites.findIndex(e => e === id);
    const row = document.querySelector(`tr[data-oppid="${id}"]`);
    console.log(id, index);
    if(index !== -1) {
        favorites = removeFromArray(favorites, index);
        row.dataset.saahfav = false;
    }
    else {
        favorites.push(id);
        row.dataset.saahfav = true;
    }
    GM.setValue("favorites", favorites.sort((a, b) => a - b));
}

const addButton = opponent => {
    const button = document.createElement("button");
    button.role = "button";
    button.addEventListener("click", toggleFavorite);
    button.classList.add("saah-favorite");
    button.dataset.id = opponent.dataset.oppid;
    opponent.getElementsByClassName("name")[0].appendChild(button);
}

const filter = (event) => {
    BDFight.step3.unselectNpc();
    document.querySelectorAll("div.domeIconImg").forEach(img => img.classList.remove("selected"));
    document.getElementById("domeTitle").removeAttribute("class");
    (event.target ?? event).classList.add("selected");
    BDFight.pve.domeId = 0;
    document.getElementById("domeTitle").classList.add("domeTitleSaahFav");
    if(!document.querySelector('.npcRow[data-saahfav="true"]')) {
        BDFight.pve.domeId = 42;
        BDFight.step3.updateNpcTable();
        return;
    }
    const npcTable = document.getElementById("npcTable");
    npcTable.style.display = "table";
    document.getElementsByClassName("tableEmpty")[0].style.display = "none";
    const fightTable = document.getElementById("bdFight");
    fightTable.style.minHeight = window.getComputedStyle(npcTable).height + 257;
    const containerHeight = window.getComputedStyle(fightTable).height;
    document.getElementById("bdFightStepContainer").style.minHeight = containerHeight - 60;
    document.getElementById("bdFightStep3").style.minHeight = containerHeight - 63;
    document.getElementById("bdFightBorderExpansion").style.minHeight = containerHeight - 263;
    document.getElementById("bdFightBorderBottom").style.minHeight = containerHeight - 18;
}

const addFilterShield = () => {
    const div = document.createElement("div");
    div.classList.add("domeIconImg", "saah-fav-shield");
    div.addEventListener("click", filter);
    document.querySelector(".filters .label").insertAdjacentElement("afterEnd", div);
}

const rowTreatment = async () => {
    const favorites = await GM.getValue("favorites");
    document.querySelectorAll(".npcRow").forEach(row => {
        addButton(row);
        if(favorites.find(fav => fav === parseInt(row.dataset.oppid))) row.dataset.saahfav = true;
    });
}

const init = async () => {
    document.getElementById("bdFightStep3UI").insertAdjacentHTML("afterBegin", css);
    addFilterShield();
    await rowTreatment();
    if(filterByFavoritesByDefault) filter(document.getElementsByClassName("saah-fav-shield")[0]);
}

const css = `<style>

.domeTitleSaahFav {
    background: url(data:image/png;base64,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);
    border-left: 2px solid black;
    height: 30px;
    width: 400px;
}

.domeTitleSaahFav + .npcContainer tr[data-saahfav="true"] {
    display: table-row!important;
}

.domeTitleSaahFav + .npcContainer tr:not([data-saahfav="true"]) {
    display: none!important;
}

.saah-favorite {
    appearance: none;
    height: 15px;
    width: 17px;
    border: 0;
    cursor: pointer;
}
.saah-favorite, tr[data-saahfav="true"] .saah-favorite:hover {
    background-image: url("https://images.neopets.com/themes/h5/basic/images/fav-icon-false.svg");
}
.saah-favorite:hover, tr[data-saahfav="true"] .saah-favorite {
    background-image: url("https://images.neopets.com/themes/h5/basic/images/fav-icon-true.svg")
}

div.saah-fav-shield {
    background-image: url("data:image/gif;base64,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");
}

div.saah-fav-shield:hover {
    background-position: 0 92px;
}

div.saah-fav-shield.selected {
    background-position: 0 46px;
}
</style>`;

(function() {
    'use strict';
    init();
})();
