// ==UserScript==
// @name         GC - Hide Non-Battlers
// @namespace    https://greasyfork.org/en/users/1511116-smallgamedev
// @version      0.2
// @description  In the dropdown which allows you to select a pet to battle with, hides every pet except your battler.
// @author       Goblin / bunnymonarch
// @match        https://www.grundos.cafe/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/548129/GC%20-%20Hide%20Non-Battlers.user.js
// @updateURL https://update.greasyfork.org/scripts/548129/GC%20-%20Hide%20Non-Battlers.meta.js
// ==/UserScript==

(function() {
    'use strict';
      const select = document.getElementById("petname");
      //Change PetA etc to your battlers name for the script to work. 
         const searchValue = "PetA";
 
    //This will then go through the list of pets, and every pet that has a different name will be hidden from the dropdown.
   for (let option of select.options) {
     if (option.text.toLowerCase().includes(searchValue.toLowerCase())) {
       option.hidden = false;
     } else {
       option.hidden = true;
     }
   }
})();
