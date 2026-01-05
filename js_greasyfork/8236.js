// ==UserScript==
// @name        Add stuff to Text area in MAL comments
// @description Pre-fills the comment box on MAL club pages with pre-defined text.
// @namespace   http://myanimelist.net/profile/Kingorgg
// @include     http://myanimelist.net/clubs.php?cid=39921*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8236/Add%20stuff%20to%20Text%20area%20in%20MAL%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/8236/Add%20stuff%20to%20Text%20area%20in%20MAL%20comments.meta.js
// ==/UserScript==

(function() { if (typeof jQuery == 'undefined') $ = unsafeWindow.$;

//Replace Long Live Steins;Gate! with whatever you want.
// \n = new line
             var text = '\n\nLong Live Steins;Gate!';

$('.textarea').val(text);

})();