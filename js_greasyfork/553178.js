// ==UserScript==
// @name        Open Slack archive links on web
// @namespace   Violentmonkey Scripts
// @match       *://*.slack.com/archives/*
// @grant       none
// @run-at      document-body
// @version     1.0
// @author      CyrilSLi
// @description Automatically open Slack archive links on web without showing the redirect dialog
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/553178/Open%20Slack%20archive%20links%20on%20web.user.js
// @updateURL https://update.greasyfork.org/scripts/553178/Open%20Slack%20archive%20links%20on%20web.meta.js
// ==/UserScript==

const area = document.createElement("textarea");
area.innerHTML = document.getElementById("props_node").dataset.props;
window.location.href = JSON.parse(area.value).webUrl;