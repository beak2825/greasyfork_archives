// ==UserScript==
// @name         ibon_select_area
// @namespace    ibon_select_area_cc
// @version      0.0.0
// @description  IBON：選擇區域
// @author       cg
// @match        https://orders.ibon.com.tw/application/*
// @license      MIT

// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547792/ibon_select_area.user.js
// @updateURL https://update.greasyfork.org/scripts/547792/ibon_select_area.meta.js
// ==/UserScript==


(function() {
    'use strict';
    //param
    var target = "2280+1980" //逗號分隔關鍵字，加號分隔不同組。例如 B1,6800+A2,7800 會先找有 B1、6800 的那區，再找 A2、7800 那區
    //param end

    const blks = document.querySelector("div.col-md-5").querySelector("div").shadowRoot.querySelectorAll("tr");

    const targets = target.split('+').map(pair => {
        const parts = pair.split(',');
        return parts;
    });

    var stop_searching = false;
    var final_blk_i = 999;


    for (var target_i = 0; target_i < targets.length && !stop_searching; target_i++) {
        var kws = targets[target_i];
        for (var blk_i = 0; blk_i < blks.length && !stop_searching; blk_i++) {
            var found = 1;
            var blk = blks[blk_i];
            var blk_txt = blk.textContent.replaceAll(/[,\s]/g,'');
            console.log(blk_txt);
            if (blk_txt.includes("已售完")) {
                continue;
            }
            for (var kw_i = 0; kw_i < kws.length; kw_i++) {
                if (!blk_txt.includes(kws[kw_i])) {
                    found = 0;
                    break;
                }
            }
            if (!found) {
                continue;
            }
            stop_searching = 1;
            final_blk_i = blk_i;
        }
    }


    setTimeout(function() {
        if (final_blk_i != 999) {
            console.log(final_blk_i);
            document.querySelector("div.col-md-5").querySelector("div").shadowRoot.querySelectorAll("tr")[final_blk_i].click();
        }
    }, 0);

  })();