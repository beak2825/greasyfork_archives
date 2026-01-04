// ==UserScript==
// @name        Reddit Auto Expand Replies v1
// @namespace   Reddit Auto Expand Replies v1
// @match       *://reddit.com/*
// @grant       none
// @version     1.0.0
// @author      brian6932
// @license     MPL-2.0
// @description Reddit seems to have added a `[show replies]` button on threads.
// @downloadURL https://update.greasyfork.org/scripts/555226/Reddit%20Auto%20Expand%20Replies%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/555226/Reddit%20Auto%20Expand%20Replies%20v1.meta.js
// ==/UserScript==
// jshint esversion: 11
for (const selector of globalThis.document.querySelectorAll('.showreplies'))
	selector.click()