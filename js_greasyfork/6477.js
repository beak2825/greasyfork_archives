// ==UserScript==
// @id          BrokenStones :: Last PM Inbox Link
// @name        BrokenStones :: Last PM Inbox Link
// @author      techietrash
// @description Will make you go automatically to the last Private Message of the conversation
// @include     http*://*brokenstones.me/inbox.php?action=viewconv*
// @include     http*://*brokenstones.club/inbox.php?action=viewconv*
// @version     2.0.7
// @icon        https://brokenstones.club/favicon.ico
// @namespace   techietrash_brokenstones_lastpm
// @homepage    https://greasyfork.org/en/scripts/6477-brokenstones-last-pm-inbox-link
// @update      January 25 2016
// @since       November 15 2014
// Modified for Brokenstones.clubs
// @downloadURL https://update.greasyfork.org/scripts/6477/BrokenStones%20%3A%3A%20Last%20PM%20Inbox%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/6477/BrokenStones%20%3A%3A%20Last%20PM%20Inbox%20Link.meta.js
// ==/UserScript==

(function(){
  // $('.box.vertical_space:last-of-type').get(0).scrollIntoView();
  document.querySelectorAll('.box.vertical_space:last-of-type')[0].scrollIntoView();
  // Focus to the reply if possible
  document.querySelector("#quickpost").focus();
}());
