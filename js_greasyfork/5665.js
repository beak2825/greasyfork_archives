// ==UserScript==
// @name           Blip.tv Links Updater
// @namespace      http://www.smallapple.net/
// @description    Updates Blip.tv Links. Not meant to be used directly.
// @author         Ng Hun Yang
// @include        http://*.blip.tv/*
// @version        1.05
// @downloadURL https://update.greasyfork.org/scripts/5665/Bliptv%20Links%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/5665/Bliptv%20Links%20Updater.meta.js
// ==/UserScript==

ujsBtLinks.chkVerCallback([
  { ver: 10500, ts: 2014101200, desc: "Change link to Greasy Fork" },
  { ver: 10400, ts: 2014010100, desc: "Use page protocol (HTTP/HTTPS) to check for update" },
  { ver: 10300, ts: 2013012500, desc: "Fixed link sorting bug" },
  { ver: 10200, ts: 2013012400, desc: "Display in sorted order" },
  { ver: 10100, ts: 2011081900, desc: "Minor code refactoring" },
  { ver: 10000, ts: 2011081800, desc: "Initial release" }
  ]);
