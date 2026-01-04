// ==UserScript==
// @name         kktix_event_goto_registration_below
// @namespace    kktix_event_goto_registration_below_cc
// @version      0.0.1
// @description  KKTIX：購票選張數 (某區以下版)、點同意、focus on validate (if any)
// @author       cg
// @match        https://*.kktix.com/events/*/registrations/*
// @license      MIT

// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547757/kktix_event_goto_registration_below.user.js
// @updateURL https://update.greasyfork.org/scripts/547757/kktix_event_goto_registration_below.meta.js
// ==/UserScript==


(function() {
  'use strict';
  //param
  var target_unit = '特4';
  var target_quant = 2;
  //param end

  const exclude_unit = '身障';
  target_unit = target_unit.replaceAll(/\s/g,'');
  setTimeout(function() {
    document.querySelector("#person_agree_terms").click();
    var units = null;
    do {
        units = document.querySelectorAll(".ticket-unit");
        if (!units) {
            continue;
        }
        var start_search = false;
        console.log(units);
        for (var i = 0; i < units.length; i++) {
            var unit = units[i];
            var q_input = null;
            var unit_text = unit.textContent.replace(/\s+/g, '');
            if (unit_text.includes(exclude_unit)) {
                continue;
            }
            if(unit_text.includes(target_unit)) {
                console.log("Y");
                start_search = true;
            }

            if (!start_search) {
                continue;
            }

            var q_plus = unit.querySelector(".plus");
            if (q_plus) {
                for (var q = 0; q < target_quant; q++) {
                    q_plus.click();
                }
                break;
            }
        }
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
    }while(1);

  }, 150);
})();