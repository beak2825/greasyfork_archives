// ==UserScript==
// @name         Hide Instuctions
// @namespace    https://greasyfork.org/users/11580
// @version      1.3.0
// @description  Hides instructions on HITs
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      /^https://(www|s3)\.(mturkcontent|amazonaws)\.com/
// @grant        GM_log
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/9997/Hide%20Instuctions.user.js
// @updateURL https://update.greasyfork.org/scripts/9997/Hide%20Instuctions.meta.js
// ==/UserScript==

// Creates button and hides instructions.
$('.panel.panel-primary').hide().before('<div><button id="toggle" type="button">Show Instructions</button></div>');

// Toggles instructions and changes toggle text.
$('#toggle').click(function () {
  $(this).text($(this).text() === 'Show Instructions' ? 'Hide Instructions' : 'Show Instructions');
  $('.panel.panel-primary').toggle();
});