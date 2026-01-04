// ==UserScript==
// @name         ibon_list_goto_area
// @namespace    ibon_list_goto_area_cc
// @version      0.0.0
// @description  IBON：選擇場次
// @author       cilegann
// @match        https://ticket.ibon.com.tw/ActivityInfo/Details/*
// @license      MIT

// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/548055/ibon_list_goto_area.user.js
// @updateURL https://update.greasyfork.org/scripts/548055/ibon_list_goto_area.meta.js
// ==/UserScript==


(function() {
    'use strict';
    //param
    var target_date = '09/19';
    //param end

    var target_unit = target_date.replaceAll(/\s/g,'');
    const waitForLib = setInterval(() => {
        try {
            var evt_list = document.querySelector("div[id='divGameInfo']").querySelector("app-game").shadowRoot.querySelectorAll("div.grid");
            for (var evt_i = 0; evt_i < evt_list.length; evt_i++) {
                var evt = evt_list[evt_i];
                if (evt.textContent.replace(/\s+/g, '').includes(target_unit)) {
                    clearInterval(waitForLib);
                    evt.querySelector("button").click();
                }

            }
        } catch {

        }
    }, 10);
})();