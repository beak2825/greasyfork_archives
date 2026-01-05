// ==UserScript==
// @name           Zippyshare Auto Download 1.0 (2022)
// @namespace      Zippyshare Auto Download
// @grant none
// @description    Automatically starts downloads hosted by Zippyshare
// @include        http*://www*.zippyshare.com/*
// @version 1.0
// @downloadURL https://update.greasyfork.org/scripts/6981/Zippyshare%20Auto%20Download%2010%20%282022%29.user.js
// @updateURL https://update.greasyfork.org/scripts/6981/Zippyshare%20Auto%20Download%2010%20%282022%29.meta.js
// ==/UserScript==
document.getElementById('dlbutton').click();
setTimeout("window.close();", 2000);