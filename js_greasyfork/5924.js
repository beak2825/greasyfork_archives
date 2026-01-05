// ==UserScript==
// @name         Set Google Form RB to Zero
// @version      0.4
// @description  Set all radiobuttons on google form
// @include      https://docs.google.com/spreadsheet/viewform?usp=drive_web&formkey=dFhjcjJtazdtYmF3M3V4TUtUSHh4T2c6MQ
// @author       mxgoncharov
// @license      WTFPL
// @namespace https://greasyfork.org/users/6219
// @downloadURL https://update.greasyfork.org/scripts/5924/Set%20Google%20Form%20RB%20to%20Zero.user.js
// @updateURL https://update.greasyfork.org/scripts/5924/Set%20Google%20Form%20RB%20to%20Zero.meta.js
// ==/UserScript==
function setToZero(){
  var buttons = document.getElementsByClassName('ss-q-radio');
  for (var i = 0; i < buttons.length; i++) {
      if (buttons[i].value == '0') {
        buttons[i].checked = true;
      }
  }
}

setToZero();
