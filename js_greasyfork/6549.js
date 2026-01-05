// ==UserScript==
// @name        Guardian [Reload Page in Classic View] button
// @namespace   
// @description Adds a button to the bottom of theGuardian.com's web pages. The button reloads the page in Classic View.
// @include     http://www.theguardian.com/*
// @include     http*://*.theguardian.com/*
// @version     0.1
// @grant       lellel
// @icon	http://static.guim.co.uk/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/6549/Guardian%20%5BReload%20Page%20in%20Classic%20View%5D%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/6549/Guardian%20%5BReload%20Page%20in%20Classic%20View%5D%20button.meta.js
// ==/UserScript==




var input=document.createElement("input");
input.type="button";
input.value="Reload Page in Classic View";
input.onclick = showAlert;
document.body.appendChild(input);
 
function showAlert()
{
   
  window.location.search += '?view=classic';
}

