// ==UserScript==
// @name         FxForumNewTab
// @namespace    http://openuserjs.org/users/ardiman
// @description  Opens posted links in new tabs.
// @description:de-DE Öffnet Links in Beiträgen im neuen Tab.
// @grant        none
// @homepage     https://github.com/ardiman/userscripts/tree/master/fxforumnewtab
// @icon         https://raw.githubusercontent.com/ardiman/userscripts/master/scriptlogo.gif
// @include      https://www.camp-firefox.de/forum/*
// @license      CC-BY-NC-SA-3.0; https://creativecommons.org/licenses/by-nc-sa/3.0/legalcode
// @license      MIT; https://opensource.org/licenses/MIT
// @supportURL   https://github.com/ardiman/userscripts/issues
// @version      1.0.7
// @date         2017-11-19
// @downloadURL https://update.greasyfork.org/scripts/6392/FxForumNewTab.user.js
// @updateURL https://update.greasyfork.org/scripts/6392/FxForumNewTab.meta.js
// ==/UserScript==

var res = document.evaluate("//a[@class='postlink-local']|//a[@class='postlink']", document, null,
                            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE , null);
for(var i = 0; i < res.snapshotLength; i++) {
  var elem = res.snapshotItem(i);
  elem.target = "_blank";
}
