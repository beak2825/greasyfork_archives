// ==UserScript==
// @name        Gitlab open with Rider
// @namespace   Violentmonkey Scripts
// @match       https://gitlab.com/tikaiz/dotnet-demo/-/tree/master*
// @grant       none
// @version     1.0
// @author      Tikaiz
// @description 12/30/2025, 2:03:43 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560783/Gitlab%20open%20with%20Rider.user.js
// @updateURL https://update.greasyfork.org/scripts/560783/Gitlab%20open%20with%20Rider.meta.js
// ==/UserScript==

const Text = 'Jetbrains Rider';

// Not sure if this is the best way of navigating to the correct DOM Location, but it works
var openWithList = document.getElementById('gl-disclosure-dropdown-group-62').nextSibling.nextSibling;

var openWithRiderList = openWithList.lastChild.cloneNode(true);
var openWithRiderText = openWithRiderList.firstChild;
openWithRiderText.innerText = Text;

var RiderBtnGroup = openWithRiderList.lastChild;
var SshBtn = RiderBtnGroup.firstChild;
var HttpsBtn = RiderBtnGroup.lastChild;

SshBtn.href = SshBtn.href.replace('idea','rider');
HttpsBtn.href = HttpsBtn.href.replace('idea','rider');

openWithList.appendChild(openWithRiderList);