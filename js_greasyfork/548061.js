// ==UserScript==
// @name         kktix_event_goto_registration_list
// @namespace    kktix_event_goto_registration_list_cc
// @version      0.0.1
// @description  KKTIX：購票選張數 (清單版)、點同意、focus on validate (if any)
// @author       cg
// @match        https://*.kktix.com/events/*/registrations/*
// @license      MIT

// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/548061/kktix_event_goto_registration_list.user.js
// @updateURL https://update.greasyfork.org/scripts/548061/kktix_event_goto_registration_list.meta.js
// ==/UserScript==


(function() {
    'use strict';
    //param
    var target = "二樓座位+全區站席" //逗號分隔關鍵字，加號分隔不同組。例如 B1,6800+A2,7800 會先找有 B1、6800 的那區，再找 A2、7800 那區，請移除任何空格、逗號
    var target_quant = 2;
    //param end

    const targets = target.split('+').map(pair => {
        const parts = pair.split(',');
        return parts;
    });

setTimeout(function() {
    const waitFor = setInterval(() => {
        var units = null;
        var searching = 1;
        do {
            const blks = document.querySelectorAll(".ticket-unit");
            if (!blks) {
                continue;
            }
            if (target=="") {
                searching = 0;
            }

            for (var target_i = 0; target_i < targets.length && searching; target_i++) {
                var kws = targets[target_i];
                for (var blk_i = 0; blk_i < blks.length && searching; blk_i++) {
                    var found = 1;
                    var blk = blks[blk_i];
                    var blk_txt = blk.textContent.replaceAll(/[\s,]/g,'');
                    if (blk_txt.includes("已售完")) {
                        continue;
                    }
                    if (blk_txt.includes("結束販售")) {
                        continue;
                    }
                    var q_plus = blk.querySelector(".plus");
                    if (!q_plus) {
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
                    searching = 0;
                    for (var q = 0; q < target_quant; q++) {
                        q_plus.click();
                    }
                    clearInterval(waitFor);
                    break;

                }
            }

            if (!searching) {
                document.querySelector("#person_agree_terms").click();
                var qualify = document.querySelector('div[ng-if="hasQualifications && ticketModel.quantity > 0"');
                if (!qualify) {
                    qualify = document.querySelector('.custom-captcha');
                }
                if (qualify) {
                    qualify.querySelector('input[type="text"]').focus();
                    break;
                } else {
                    var assign_by_computer = document.querySelector('button[ng-click="challenge(1)"]')
                    if (assign_by_computer)
                        assign_by_computer.click();
                    else
                        document.querySelector('button[ng-click="challenge()"]').click();
                    break;
                }
            }
        } while(0);

    }, 10);
      }, 150);
  })();