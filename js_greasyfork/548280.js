// ==UserScript==
// @name         Alternate Style Sheet Support
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.1
// @license      AGPL v3
// @author       jcunews
// @description  All Alternate Style Sheet support for web browsers which don't or no longer support it. e.g. Safari, Chromium, Edge, etc. Select style via GM menu.
// @match        *://*/*
// @include      *:*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/548280/Alternate%20Style%20Sheet%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/548280/Alternate%20Style%20Sheet%20Support.meta.js
// ==/UserScript==

//When a site provides Alternative Style Sheets, a short notification at top-right on the web page will be displayed for 3 seconds once for the current tab.

((as, ds, md, a, i) => {
  function updateMenus() {
    ds.forEach((s, n) => {
      if (md[n]) GM_unregisterMenuCommand(md[n]);
      md[n] = GM_registerMenuCommand(ds[n] + (n === i ? " (current)" : ""), () => {
        if (n === i) return;
        if (n) {
          as[0].disabled = true;
          if (a) a.remove();
          (a = document.createElement("link")).rel = "stylesheet";
          a.href = as[n].href;
          as[n].insertAdjacentElement("afterend", a)
        } else {
          as[0].disabled = false;
          if (a) a.remove()
        }
        i = n;
        updateMenus()
      })
    })
  }
  if (!(as = Array.from(document.querySelectorAll('link[rel="alternate stylesheet"]'))).length) return;
  a = document.querySelectorAll('link[rel="stylesheet"][title]');
  for (i = a.length - 1; i >= 0; i--) {
    if (a[i].compareDocumentPosition(as[0]) === 4) {
      ds = a[i];
      break
    }
  }
  if (!ds) return;
  as.unshift(ds);
  ds = as.map((e, i) => e.title || (!i ? "Default style" : "Alternate style #" + i));
  md = ds.map(() => "");
  i = 0;
  a = null;
  updateMenus();
  if (!sessionStorage.getItem("ass_ujs")) {
    sessionStorage.setItem("ass_ujs", 1);
    document.body.insertAdjacentHTML("afterend", `\
<div id=asn>
  <style>
    #asn { position: fixed; z-index: 999999999; top: 0; right: 0; box-sizing: border-box; border: .2em solid #aaa; padding-inline: .3em; background: #777; color: #fff; font: 12pt/1.4 sans-serif }
  </style>
  Alternate Style Sheets is available
</div>`);
    setTimeout(() => document.getElementById("asn").remove(), 3000)
  }
})()
