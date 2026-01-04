// ==UserScript==
// @name         GC Donny's Toy Repair Keyboard Controls
// @namespace    https://greasyfork.org/en/users/1257536-zzzzzooted
// @version      1.0
// @description  Adds simple keyboard controls for repairing toys on GC.
// @author       zoops
// @match        https://www.grundos.cafe/winter/brokentoys/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @downloadURL https://update.greasyfork.org/scripts/550101/GC%20Donny%27s%20Toy%20Repair%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/550101/GC%20Donny%27s%20Toy%20Repair%20Keyboard%20Controls.meta.js
// ==/UserScript==

var repair = document.querySelector(".inv-item a")
var pay = document.querySelector("input[value='Yes, go ahead and repair it']");
var repeat = document.querySelector("input[value='Fix another item']")

document.addEventListener("keydown", (event) => {
    if ( !$('input:focus').length > 0 ) {
      if (event.keyCode == 13) {
        if (repair != null) {
            repair.click();
        } else if (pay != null) {
            pay.click();
        } else if (repeat != null) {
            repeat.click();
        }
      }
     }
    });