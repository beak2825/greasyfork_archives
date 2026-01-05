// ==UserScript==
// @name        Auto refresh D2L.com/wait.html
// @namespace   autoRefreshD2L
// @description Automatically refresh wait.html on d2l
// @include     http://dota2lounge.com/wait.html
// @version     final
// @grant       none
// @author      Endzior
// @downloadURL https://update.greasyfork.org/scripts/6670/Auto%20refresh%20D2Lcomwaithtml.user.js
// @updateURL https://update.greasyfork.org/scripts/6670/Auto%20refresh%20D2Lcomwaithtml.meta.js
// ==/UserScript==

function changePage()
{
  window.location = "http://dota2lounge.com";
  window.location = "http://dota2lounge.com/mybets"
  //window.location = "http://dota2lounge.com/myprofile";
}

numberOfMSToWait = 0;
setTimeout(changePage(), numberOfMSToWait);