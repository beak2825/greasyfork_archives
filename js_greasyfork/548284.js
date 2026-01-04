// ==UserScript==
// @name        Haraedo - No Pop-Up Login
// @namespace   Violentmonkey Scripts
// @match       https://haraedo.forumpolish.com/*
// @grant       none
// @version     1.0
// @author      nal
// @license     MIT
// @description 04/09/2025, 01:57:34
// @downloadURL https://update.greasyfork.org/scripts/548284/Haraedo%20-%20No%20Pop-Up%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/548284/Haraedo%20-%20No%20Pop-Up%20Login.meta.js
// ==/UserScript==

$("#login_popup").css("display", "none");
$("#login_popup").remove();