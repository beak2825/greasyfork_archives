// ==UserScript==
// @name        Disable HWZ forums background ad
// @namespace   hwz
// @description Stops the irritating background ad on the HardwareZone Forums from being clickable. You'll still see it, but you won't accidentally click on the ad any more.
// @include     http://forums.hardwarezone.com.sg/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8226/Disable%20HWZ%20forums%20background%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/8226/Disable%20HWZ%20forums%20background%20ad.meta.js
// ==/UserScript==

document.body.onclick = null;