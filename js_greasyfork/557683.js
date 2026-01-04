// ==UserScript==
// @name        'ruBlock Origin
// @namespace   Violentmonkey Scripts
// @match       https://soybooru.com/*
// @grant       none
// @version     2.0.1
// @author      xerox
// @license     MIT+SKIBIDI
// @description originally made 02/12/2025, 16:06:33
// [dec 2, not feb 12 btw]
// @downloadURL https://update.greasyfork.org/scripts/557683/%27ruBlock%20Origin.user.js
// @updateURL https://update.greasyfork.org/scripts/557683/%27ruBlock%20Origin.meta.js
// ==/UserScript==
var comments = document.getElementsByClassName("username");
console.log("hi");
var users = [
  "trevor",
  // "sample",
  // "Chud<sup",
  // "this is how you add new ones",
];
for(var i = 0; i < comments.length; i++) {
  console.log("comment found");
  for(var j = 0; j < users.length; j++) {
    if(comments[i].innerHTML.includes(users[j])) {
      comments[i].parentElement.parentElement.remove();
      i--;
      break;
    }
  }
}
