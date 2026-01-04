// ==UserScript==
// @name        Arrow key release navigation
// @namespace   RateYourMusic
// @match       https://rateyourmusic.com/release/*
// @license MIT
// @version     1.1
// @author      AnotherBubblebath
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rateyourmusic.com
// @description Arrow key navigation on RateYourMusic
// @downloadURL https://update.greasyfork.org/scripts/559309/Arrow%20key%20release%20navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/559309/Arrow%20key%20release%20navigation.meta.js
// ==/UserScript==

document.addEventListener("keydown", keyNavigation);

function keyNavigation(e) {
  if (e.code == "ArrowLeft") {
    let link = document.querySelector(".release_navigation_links > .prev_link > a");
    if (link && link.href) {
      window.location.href = link.href;
    }
  }
  else if (e.code == "ArrowRight") {
    let link = document.querySelector(".release_navigation_links > .next_link > a");
    if (link && link.href) {
      window.location.href = link.href;
    }
  }
}