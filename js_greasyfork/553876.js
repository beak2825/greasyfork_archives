// ==UserScript==
// @name         Fix Diep.io death screen score
// @name:cs      Oprav čitelnost skóre v Diep.io
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add commas in the diep.io game over score text to make it readable again
// @description:cs Přidejte čárky do textu skóre ve hře diep.io, aby text byl opět čitelný.
// @author       <Eclipsia discord@cz_eclipsia>
// @match        https://diep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553876/Fix%20Diepio%20death%20screen%20score.user.js
// @updateURL https://update.greasyfork.org/scripts/553876/Fix%20Diepio%20death%20screen%20score.meta.js
// ==/UserScript==

(function() {
    const consoleLog = console.log;
    var e, f, c;
    const id = setInterval(() => {
        if (!f && window.input) {
            // force predict_movement off, bring back latency statistic 
            window.input.set_convar("ren_latency", true);
            window.input.set_convar("net_predict_movement", false);
            f=WebAssembly;
        }
        let a;
        if (!e && (a = document.getElementById("game-over-screen"))) {
            // remove blurry deathscreen background
            a.style.setProperty("backdrop-filter", "none", "important");
            e={};
        }
        let b;
        if (!c && (b = document.getElementById("game-over-stats-player-score"))) {
            // unfuck the score
            let oldValue = b.textContent;
            const callback = () => {
                let newValue = b.textContent;
                if (newValue == oldValue) return;
                b.textContent = b.textContent.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                oldValue = newValue;
            }
            new MutationObserver(callback).observe(b, {
                childList: true,
                subtree: true,
                characterData: true
            })
            c=Math.PI
        }
        e && f && c && (() => {clearInterval(id); consoleLog(`Finished unfucking job.`)})();
    }, 1000);
})();