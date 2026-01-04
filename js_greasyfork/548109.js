// ==UserScript==
// @name         Neopets: Grarrl Keno Helper
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.3.0
// @description  Adds a button to Grarrl Keno that allows you to play with 10 random eggs with one click instead of five clicks plus typing. Change const bet to your bet amount.
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @match        https://www.neopets.com/prehistoric/keno.phtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/548109/Neopets%3A%20Grarrl%20Keno%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/548109/Neopets%3A%20Grarrl%20Keno%20Helper.meta.js
// ==/UserScript==

const bet = 1;
const style = "display:block;padding:1em;";

const show_winners = () => {
    egg_counter = 10;
    let greenEggs = 0;
    for (let i = 0; i < 9; i++) {
        const eggMatch = egg_arr.find(egg => egg === winners[i]);
        show_match_chart(winners[i]);
        const eggImage = eggMatch ? "green_egg" : "red_egg";
        if(eggMatch) greenEggs++;
        document.getElementById(`td${winners[i]}`).style.backgroundImage = `url("//images.neopets.com/prehistoric/${eggImage}.gif")`;
    }
    show_final_results();
    document.querySelector(".content b").innerText += ` ${greenEggs} right guess${greenEggs === 1 ? '' : 'es'}`;
}

const onSelect = () => {
    const button = document.createElement("button");
    button.style = style;
    button.innerText = "Just Play";
    button.onclick = (e) => {
        document.getElementsByName('bet')[0].value = bet;
        random_eggs(10);
        document.querySelector("form[name='keno']").submit();
    }
    return button;
}

const onResult = () => {
    // If you don't want instant results, comment out the next like (put a // in front of it)
    show_winners();
    const form = document.querySelector("form[action='keno.phtml']");
    form.children[0].style = style;
    return form;
}

(function() {
    'use strict';
    document.querySelector(".content b").prepend(document.getElementsByName('bet').length > 0 ? onSelect() : onResult());
})();
