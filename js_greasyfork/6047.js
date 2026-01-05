// ==UserScript==
// @name         tmbo open in new tab
// @namespace    cantcode.com
// @description  all tmbo images open in a new tab
// @author       jared miller
// @version      1.0
// @match        https://thismight.be/offensive/?c=thumbs
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/6047/tmbo%20open%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/6047/tmbo%20open%20in%20new%20tab.meta.js
// ==/UserScript==

$(".grid_thumbs").find("a").attr("target", "_blank");
