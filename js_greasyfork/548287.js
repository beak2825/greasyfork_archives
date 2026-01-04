// ==UserScript==
// @name        Haraedo - Remove particles.js
// @namespace   Violentmonkey Scripts
// @match       https://haraedo.forumpolish.com/*
// @grant       none
// @version     1.0
// @license     MIT
// @author      nal
// @description 04/09/2025, 02:44:43
// @downloadURL https://update.greasyfork.org/scripts/548287/Haraedo%20-%20Remove%20particlesjs.user.js
// @updateURL https://update.greasyfork.org/scripts/548287/Haraedo%20-%20Remove%20particlesjs.meta.js
// ==/UserScript==

$("#particles-js").css("display", "none");
$("#particles-js").remove();