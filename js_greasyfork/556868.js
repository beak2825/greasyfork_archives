// ==UserScript==
// @name         PSO2SA shortcut
// @namespace    http://tampermonkey.net/
// @version      1.1
// @match        https://wikiwiki.jp/pso2sa/*
// @grant        none
// @description wikiwiki シンボルアートの展覧室と保管庫をショートカットで移動できるようにする
// @downloadURL https://update.greasyfork.org/scripts/556868/PSO2SA%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/556868/PSO2SA%20shortcut.meta.js
// ==/UserScript==

(function() {
    const MAX_TN = 999;
    const MIN_TN = 1;
    const MAX_SA = 999;
    const MIN_SA = 1;

    const path = location.pathname;
    const tnMatch = path.match(/tn(\d+)/i);
    const saMatch = path.match(/sa(\d+)/i);

    let mode = null;
    let cur = null;
    let max = null;
    let min = null;

    if (tnMatch) {
        mode = "tn";
        cur = parseInt(tnMatch[1], 10);
        max = MAX_TN;
        min = MIN_TN;
    } else if (saMatch) {
        mode = "sa";
        cur = parseInt(saMatch[1], 10);
        max = MAX_SA;
        min = MIN_SA;
    } else {
        return;
    }

    window.addEventListener("keydown", (e) => {
        if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;

        if (e.key === "ArrowLeft" && cur > min) {
            const to = cur - 1;
            location.href = path.replace(new RegExp(mode + "\\d+", "i"), mode + to);
        }

        if (e.key === "ArrowRight" && cur < max) {
            const to = cur + 1;
            location.href = path.replace(new RegExp(mode + "\\d+", "i"), mode + to);
        }
    });
})();
