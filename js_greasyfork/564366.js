// ==UserScript==
// @name         Firefox v138+ link colors bug workaround
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.1
// @license      AGPL v3
// @author       jcunews
// @description  Workaround for Firefox v138+ link colors bug
// @match        *://*/*
// @include      *:*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/564366/Firefox%20v138%2B%20link%20colors%20bug%20workaround.user.js
// @updateURL https://update.greasyfork.org/scripts/564366/Firefox%20v138%2B%20link%20colors%20bug%20workaround.meta.js
// ==/UserScript==

//Firefox version 138+ have a bug where the default link colors have been changed to be difficult to differentiate
//between each other, and the browser settings for the default link colors have been made ineffective.
//
//https://connect.mozilla.org/t5/discussions/ff-138-messed-up-changing-link-colors/m-p/96051
//
//This script works around that bug by adding a low priority CSS override into the web page without affecting site-defined CSS.
//Change the `unvisitedColor` and `visitedColor` variable values in the script code as needed.

((a) => {
  //===CONFIG BEGIN===
  let unvisitedColor = "#00e";
  let visitedColor   = "#528";
  //===CONFIG END===

  if (!document.contentType.endsWith("/xml")) {
    (a = document.createElement("STYLE")).id = "firefox-bug-workaround";
    a.innerHTML = `
@layer firefox-bug-workaround;
@layer firefox-bug-workaround {
  a:link { color: ${unvisitedColor} }
  a:visited { color: ${visitedColor} }
}`;
    (function wh() {
      if (document.head) {
        document.head.insertBefore(a, document.head.firstChild)
      } else setTimeout(wh, 0)
    })()
  }
})()
