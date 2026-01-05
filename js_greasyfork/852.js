// ==UserScript==
// @name           Keep Mturk Autoaccept Box Checked
// @namespace      Keep Autoaccept Box Checked
// @version        1.0.1
// @description    Keeps the autoaccept box always checked while working on hits on mturk.
// @include        https://www.mturk.com/mturk/*
// @downloadURL https://update.greasyfork.org/scripts/852/Keep%20Mturk%20Autoaccept%20Box%20Checked.user.js
// @updateURL https://update.greasyfork.org/scripts/852/Keep%20Mturk%20Autoaccept%20Box%20Checked.meta.js
// ==/UserScript==

var checkboxes = document.getElementsByName('autoAcceptEnabled');

for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked=true;
}