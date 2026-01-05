// ==UserScript==
// @name          Hacker Fresh
// @version       0.0.4
// @namespace     http://userscripts.psbarrett.com
// @description	  Highlights fresh comments on HN.
// @include       https://news.ycombinator.com/item*
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/6955/Hacker%20Fresh.user.js
// @updateURL https://update.greasyfork.org/scripts/6955/Hacker%20Fresh.meta.js
// ==/UserScript==
'use strict'

// Workaround Backwards Incompatible Change
if (typeof GM_addStyle == 'undefined') {
  var GM_addStyle = (aCss) => {
    'use strict';
    let head = document.getElementsByTagName('head')[0];
    if (head) {
      let style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.textContent = aCss;
      head.appendChild(style);
      return style;
    }
    return null;
  };
}

GM_addStyle(
`td.vote-box {
  border-radius: 5px 0px 0px 5px;
}
.fresh-item {
  background-color: #FF944D;
}`);

function get_comment_id(vote_box) {
  var item_link_ele = vote_box.parentElement.querySelector('.comhead > .age > a');
  
  // Check for Deleted Comment
  if (item_link_ele === null) {
    return null;
  }
  
  var link = new URL(item_link_ele.href);
  return link.searchParams.get('id');
  
}

var all_vote_box = document.querySelectorAll('tbody > tr > td[valign=top]');

for (var e of all_vote_box) {
  e.classList.add("vote-box");
  
  var item_id = get_comment_id(e);
  if (item_id !== null) {
    var status = localStorage.getItem(item_id)

    if (status === null) {
      e.classList.add("fresh-item");
      localStorage.setItem(item_id, "seen")
    }
  }
}