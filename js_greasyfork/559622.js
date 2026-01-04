// ==UserScript==
// @name        Hide Luna button on Twitch
// @namespace   Violentmonkey Scripts
// @match       https://www.twitch.tv/*
// @grant       GM_addStyle
// @version     1.0
// @author      b263
// @description Hides the Amazon Luna button in the Twitch header.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/559622/Hide%20Luna%20button%20on%20Twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/559622/Hide%20Luna%20button%20on%20Twitch.meta.js
// ==/UserScript==

GM_addStyle('div.top-nav__prime { display: none !important; }');
