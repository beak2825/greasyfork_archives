// ==UserScript==
// @name         Autochecks MedSIS Survey Buttons
// @namespace    n/a
// @version      0.9
// @description  ^
// @author       Haran Yogasundaram
// @include	 *medsis.med.ualberta.ca*
// @downloadURL https://update.greasyfork.org/scripts/6256/Autochecks%20MedSIS%20Survey%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/6256/Autochecks%20MedSIS%20Survey%20Buttons.meta.js
// ==/UserScript==

(function()
 {
    var inputElements = new Array();
    inputElements = document.getElementsByTagName('input');

    for (var i=0; i<inputElements.length; i++)
    {
        if (inputElements[i].type == 'radio') 
        {
            inputElements[i].checked = true;
        }
    }
 }
)
();