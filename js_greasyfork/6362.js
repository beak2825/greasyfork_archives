// ==UserScript==
// @name         tcgirl request script
// @version      0.1
// @description  Changes a few column widths
// @author       You
// @match        https://snap.groupon.com/web/mturk/*
// @grant        none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/6362/tcgirl%20request%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/6362/tcgirl%20request%20script.meta.js
// ==/UserScript==

$('.col-md-4').attr('style','width: 60%;');
$('.col-md-8').attr('style','width: 40%;');