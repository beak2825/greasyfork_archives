// ==UserScript==
// @name        Clarin LTA
// @namespace   clarin
// @include     http://www.clarin.com/*
// @version     1
// @description:es  Saltear la ventana de login en clarin.com
// @description:en  Skip the login-wall at clarin.com
// @grant       none
// @description Saltear la ventana de login en clarin.com
// @downloadURL https://update.greasyfork.org/scripts/8019/Clarin%20LTA.user.js
// @updateURL https://update.greasyfork.org/scripts/8019/Clarin%20LTA.meta.js
// ==/UserScript==

$('#cboxOverlay').remove();
setTimeout(function(){ $('iframe.cboxIframe').remove(); }, 1500);
