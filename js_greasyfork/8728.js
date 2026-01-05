// ==UserScript==
// @name        Hummingbird soundtrack
// @namespace   Hummingbird soundtrack
// @include     http*://hummingbird.me/*
// @version     1
// @grant       none
// @description Soundtrack for hummingbird
// @downloadURL https://update.greasyfork.org/scripts/8728/Hummingbird%20soundtrack.user.js
// @updateURL https://update.greasyfork.org/scripts/8728/Hummingbird%20soundtrack.meta.js
// ==/UserScript==
$("<audio autoplay='autoplay' style='display:none;' controls='controls'><source src='https://a.pomf.se/ssxqii.ogg' /></audio>").appendTo('body');