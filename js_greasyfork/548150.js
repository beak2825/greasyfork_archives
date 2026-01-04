// ==UserScript==
// @name         Setting - Modify all [Auto-Sell / Auto-Salvage] at once
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  HV 设置：一次性修改所有的【自动出售/自动拆解】
// @author       ssnangua
// @match        https://hentaiverse.org/?s=Character&ss=se
// @match        https://hentaiverse.org/isekai/?s=Character&ss=se
// @match        https://alt.hentaiverse.org/?s=Character&ss=se
// @match        https://alt.hentaiverse.org/isekai/?s=Character&ss=se
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hentaiverse.org
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548150/Setting%20-%20Modify%20all%20%5BAuto-Sell%20%20Auto-Salvage%5D%20at%20once.user.js
// @updateURL https://update.greasyfork.org/scripts/548150/Setting%20-%20Modify%20all%20%5BAuto-Sell%20%20Auto-Salvage%5D%20at%20once.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sell_selects = document.querySelectorAll("#settings_autosalvage td:nth-child(2)>select");
    const salvage_selects = document.querySelectorAll("#settings_autosalvage td:nth-child(3)>select");
    const first_tr = document.querySelector("#settings_autosalvage tr");
    const all_tr = first_tr.cloneNode(true);
    all_tr.id = "__modify_all__";
    const all_label = all_tr.querySelector("td:nth-child(1)");
    const [all_sell_select, all_salvage_select] = all_tr.querySelectorAll("select");
    all_label.textContent = first_tr.querySelector("td:nth-child(1)").textContent === "短剑" ? "全部" : "All";
    all_sell_select.name = "as_c_all";
    all_salvage_select.name = "as_s_all";
    all_sell_select.addEventListener("change", () => {
        sell_selects.forEach((select) => {
            select.value = all_sell_select.value;
        });
    });
    all_salvage_select.addEventListener("change", () => {
        salvage_selects.forEach((select) => {
            select.value = all_salvage_select.value;
        });
    });
    first_tr.parentNode.insertBefore(all_tr, first_tr);

    GM_addStyle(`#__modify_all__ {
      td, select {
        font-weight: bold;
      }
    }`);
})();