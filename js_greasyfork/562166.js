// ==UserScript==
// @name DGG hide new chatters
// @namespace zeul
// @description Hides messages from new users in destiny.gg chat
// @match https://www.destiny.gg/embed/chat*
// @version 1.1
// @license MIT
// @run-at document-end
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/562166/DGG%20hide%20new%20chatters.user.js
// @updateURL https://update.greasyfork.org/scripts/562166/DGG%20hide%20new%20chatters.meta.js
// ==/UserScript==

(function(){GM_addStyle('.msg-chat.flair58{display:none!important;}');})();