// ==UserScript==
// @name        Loginless instagram.com
// @namespace   Violentmonkey Scripts
// @match       https://www.instagram.com/*/*
// @grant       none
// @version     1.0
// @author      -
// @description 1/6/2026, 6:09:55 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562090/Loginless%20instagramcom.user.js
// @updateURL https://update.greasyfork.org/scripts/562090/Loginless%20instagramcom.meta.js
// ==/UserScript==




window.onload = () => {
// view posts without being logged in
  document.querySelectorAll("a[role=link]").forEach((el) => el.onmousedown = () => location.href = el.href)

  // when a post is opened, on click open the pic
  let image = document.querySelector("div:not([class]):not([id]):not([style])>div>div>img[src]")
  if (image) {
    image.parentElement.parentElement.onmousedown = () => {location.href = image.src}
  }
}