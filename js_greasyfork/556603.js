// ==UserScript==
// @name        HackerNews Inline Ads
// @description Remove inline ads.
// @version     1.0
// @namespace   https://greasyfork.org/users/1376767
// @author      C89sd
// @match       https://news.ycombinator.com/*
// @exclude     https://news.ycombinator.com/item*
// @downloadURL https://update.greasyfork.org/scripts/556603/HackerNews%20Inline%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/556603/HackerNews%20Inline%20Ads.meta.js
// ==/UserScript==

"use strict";

// remove ads
{
  let links = document.getElementsByClassName('athing')
  for (let i = 0; i< links.length; i++) {
    let link = links[i]
    let votes = link.querySelector(':scope > .votelinks')
    if (!votes) {
      link.remove()
    }
  }
}

// renumber
{
  let links = document.getElementsByClassName('athing')
  for (let i = 0; i< links.length; i++) {
    let link = links[i]
    link.querySelector('.rank').textContent = (i+1) + '.';
  }
}