// ==UserScript== 
// @author      Schimon Jehudah, Adv.
// @description Add mailto navigation URIs to FreeLists, to subscribe or unsubscribe via an Email client, instead of HTML interface.
// @copyright   2025, Schimon Jehudah (http://schimon.i2p)
// @license     MIT
// @name        FreeLists Email Controllers
// @namespace   i2p.schimon.freelists
// @match       http://freelists.org/list/*
// @match       http://www.freelists.org/list/*
// @match       https://freelists.org/list/*
// @match       https://www.freelists.org/list/*
// @tag         mailing-list
// @version     2025.12.29
// @homepageURL https://greasyfork.org/scripts/560597-freelists-email-controllers
// @supportURL  https://greasyfork.org/scripts/560597-freelists-email-controllers/feedback
// @downloadURL https://update.greasyfork.org/scripts/560597/FreeLists%20Email%20Controllers.user.js
// @updateURL https://update.greasyfork.org/scripts/560597/FreeLists%20Email%20Controllers.meta.js
// ==/UserScript==

var mailingList = location.pathname.split("/").pop();
var elementUl = document.querySelector("div.container > div.row > div > ul");
var actions = [
  { text: "Subscribe by email", subject: "subscribe" },
  { text: "Unsubscribe by email", subject: "unsubscribe" }
];

for (var i = 0; i < actions.length; i++) {
  var listItem = document.createElement("li");
  var anchor = document.createElement("a");

  anchor.textContent = actions[i].text;
  anchor.href = "mailto:" + mailingList + "-request@freelists.org?Subject=" + actions[i].subject;

  listItem.appendChild(document.createTextNode("» "));
  listItem.appendChild(anchor);
  elementUl.appendChild(listItem);
}
