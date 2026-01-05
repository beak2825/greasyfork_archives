// ==UserScript==
// @name       Hide Promoted Hits
// @author	   jawz
// @version    1.2
// @description  Hides the promoted HITs that appear at the top of mturk pages.
// @match      https://www.mturk.com/*
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/7979/Hide%20Promoted%20Hits.user.js
// @updateURL https://update.greasyfork.org/scripts/7979/Hide%20Promoted%20Hits.meta.js
// ==/UserScript==

$('div:contains("Requesters: Interested in promoting your HITs? Inquire")').hide();