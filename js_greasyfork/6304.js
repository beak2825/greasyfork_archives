// ==UserScript==
// @name        hintable new tweets for vimperator
// @namespace   https://twitter.com/
// @description this script makes twitter new tweets bar hintable for vimperator/vimium, just hit `f` and you'll see
// @include     https://twitter.com/*
// @include     https://www.twitter.com/*
// @grant       none
// @version 0.0.1.20141107025146
// @downloadURL https://update.greasyfork.org/scripts/6304/hintable%20new%20tweets%20for%20vimperator.user.js
// @updateURL https://update.greasyfork.org/scripts/6304/hintable%20new%20tweets%20for%20vimperator.meta.js
// ==/UserScript==

window.addEventListener('DOMContentLoaded', function() {
  var parent = document.getElementsByClassName('stream-container')[0];
  var action_link = document.createElement('a')
  action_link.setAttribute('href', '#');
  action_link.setAttribute('style', 'width: 0px; height: 0px; display: block;');
  action_link.addEventListener('click', function() {
    document.getElementsByClassName('new-tweets-bar')[0].click();
    return false;
  });
  
  parent.insertBefore(action_link, parent.firstChild);
});

