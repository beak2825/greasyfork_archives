// ==UserScript==
// @name        r3 wiki remove upgrade warnings
// @description remove long list of warnings when logged in as admin
// @author      ruru4143
// @namespace   ruru4143-r3-remove-admin-warning
// @version     1.0
// @license     MIT
// @match       https://realraum.at/wiki/*
// @include     https://realraum.at/wiki/*
// @icon        https://realraum.at/wiki/lib/tpl/bootstrap3/images/favicon.ico
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/550577/r3%20wiki%20remove%20upgrade%20warnings.user.js
// @updateURL https://update.greasyfork.org/scripts/550577/r3%20wiki%20remove%20upgrade%20warnings.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document
        .querySelectorAll('div.alert.alert-warning')
        .forEach( (el) => {
            el.remove();
        });

lnks
})();


