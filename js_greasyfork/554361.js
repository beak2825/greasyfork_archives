// ==UserScript==
// @name          GGn Forums Last Page Reminder
// @namespace     https://gazellegames.net/
// @version       1.0
// @description   Highlight when you are not on the last page of a forum thread
// @author        monkeys
// @license       MIT
// @match         https://gazellegames.net/forums.php*
// @icon          https://gazellegames.net/favicon.ico
// @homepage      https://greasyfork.org/en/scripts/554361-ggn-forums-last-page-reminder
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/554361/GGn%20Forums%20Last%20Page%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/554361/GGn%20Forums%20Last%20Page%20Reminder.meta.js
// ==/UserScript==

(function () {
  ("use strict");
  const linkBoxBar = document.getElementsByClassName('linkbox linkbox_bottom')[0];
  if (linkBoxBar.innerText.includes('Last')) {
      document.getElementById('quickpost').style.background = 'grey';
      linkBoxBar.lastElementChild.lastElementChild.style.color = 'red'
  } else {
      // console.log('Last page');
  }
})();
