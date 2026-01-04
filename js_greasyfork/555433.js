// ==UserScript==
// @name         Hide New User Flair Messages
// @match        https://www.destiny.gg/*
// @grant        GM_addStyle
// @description  A userscript for hiding messages from new chatters in DGG chat.
// @version 0.0.1.20251110165622
// @namespace https://greasyfork.org/users/1494673
// @downloadURL https://update.greasyfork.org/scripts/555433/Hide%20New%20User%20Flair%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/555433/Hide%20New%20User%20Flair%20Messages.meta.js
// ==/UserScript==

(function(){
  GM_addStyle('.msg-chat.flair58 { display: none !important; }');
  // catch any already-rendered messages before the style took effect
  document.querySelectorAll('.msg-chat.flair58').forEach(e => e.style.display = 'none');
})();
