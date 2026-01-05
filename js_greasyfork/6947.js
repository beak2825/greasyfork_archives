// ==UserScript==
// @id          BrokenStones - Auto-Show Forum Thread Notes
// @name        BrokenStones - Auto-Show Forum Thread Notes
// @description Auto-shows the Thread Notes on forum pages (if you have the privileges to see them)
// @version     0.6.5
// @icon        https://brokenstones.club/favicon.ico
// @namespace   techietrash_brokenstones_threadnotes
// @homepage    https://greasyfork.org/en/scripts/6947-brokenstones-auto-show-forum-thread-notes
// @author      techietrash
// @include     http*://*brokenstones.me/forums.php?action=viewthread*
// @include     http*://*brokenstones.club/forums.php?action=viewthread*
// @require     https://code.jquery.com/jquery-1.11.1.min.js
// @update      January 25 2016
// @since       December 11 2014
// @downloadURL https://update.greasyfork.org/scripts/6947/BrokenStones%20-%20Auto-Show%20Forum%20Thread%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/6947/BrokenStones%20-%20Auto-Show%20Forum%20Thread%20Notes.meta.js
// ==/UserScript==

(function(){
  $('#thread_notes_table').toggleClass('hidden');
})();