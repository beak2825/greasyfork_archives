// ==UserScript==
// @name         Top Reply
// @version      0.1
// @description  Add reply box at the top of the page on mturkgrind.com (Xenforo)
// @author       Kerek
// @namespace    Kerek
// @include      http://www.mturkgrind.com/*
// @include      http://mturkgrind.com/*
// @downloadURL https://update.greasyfork.org/scripts/7684/Top%20Reply.user.js
// @updateURL https://update.greasyfork.org/scripts/7684/Top%20Reply.meta.js
// ==/UserScript==

$('div.pageNavLinkGroup').append($('div.quickReply.message'));