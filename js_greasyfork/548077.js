// ==UserScript==
// @name         GC Garden Keyboard Controls
// @namespace    https://greasyfork.org/en/users/1257536-zzzzzooted
// @version      1.1
// @description  Adds keyboard controls for guild gardens on GC.
// @author       zoops
// @match        https://www.grundos.cafe/guilds/guild/*
// @match        https://www.grundos.cafe/safetydeposit/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @downloadURL https://update.greasyfork.org/scripts/548077/GC%20Garden%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/548077/GC%20Garden%20Keyboard%20Controls.meta.js
// ==/UserScript==

var pick = document.querySelector("input[value='Pick an item']")
var tend = document.querySelector("input[value='Tend to Garden']");
var donate = document.querySelector("input[value='Give Bert Supplies']")
var give = document.querySelector("input[value='Give to Bert']")
var max = document.querySelector('.sdb-remove-max-text')
var all = document.querySelector('#select-all-top')
var next = document.querySelector("input[value='Check Next Guild Garden']")

window.addEventListener('keydown', function(e) {
  if(e.keyCode == 32 && e.target == document.body) {
    e.preventDefault();
  }
});
document.addEventListener("keydown", (event) => {
    if ( !$('input:focus').length > 0 ) {
      if (event.keyCode == 13) {
        if (pick != null) {
            pick.click();
        } else if (give != null) {
            give.click();
        } else if (next != null) {
            next.click();
        }
      }
      if (event.keyCode == 68) {
        if (donate != null) {
            donate.click();
        }
      }
      if (event.keyCode == 77) {
        if (max != null) {
            max.click();
        }
      }
      if (event.keyCode == 84) {
        if (tend != null) {
            tend.click();
        }
      }
      if (event.keyCode == 32) {
        if (all != null) {
            all.click();
        }
      }
     }
    });