// ==UserScript==
// @name           Keep Autoaccept Box Checked
// @include        https://www.mturk.com/mturk/*
// @author         bluewanders
// @namespace      bluewanders
// @version        1
// @description    Ensure your "Automatically Accept Next Hit" box is checked while working on MTurk.
// @downloadURL https://update.greasyfork.org/scripts/7595/Keep%20Autoaccept%20Box%20Checked.user.js
// @updateURL https://update.greasyfork.org/scripts/7595/Keep%20Autoaccept%20Box%20Checked.meta.js
// ==/UserScript==

var checkboxes = document.getElementsByName('autoAcceptEnabled');

for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked=true;
}