// ==UserScript==
// @name         Word Reference Ad Remover
// @icon         http://www.google.com/s2/favicons?domain=http://wordreference.com/
// @version      0.4
// @namespace    https://greasyfork.org/en/users/4072-benjamin-grant
// @description  Remove ads on Word Reference
// @author       GRA0007
// @match        http://www.wordreference.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8592/Word%20Reference%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/8592/Word%20Reference%20Ad%20Remover.meta.js
// ==/UserScript==

$( "#ad1_holder" ).remove();
$( "#ad1" ).remove();
$( "#adrighttop" ).remove();
$( "#centercolumn" ).css('width', 'auto');
$( "#rightcolumn" ).remove();