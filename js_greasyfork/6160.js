// ==UserScript==
// @name             Qkam Counter
// @namespace    https://qkam.dubizzle.com/qkam/
// @version           1.22
// @description     Counting dubizzle Qkam ads ( approve - delete - move )
// @author             dubizzle
// @match             https://qkam.dubizzle.com/*
// @require            http://code.jquery.com/jquery-2.0.3.min.js
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/6160/Qkam%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/6160/Qkam%20Counter.meta.js
// ==/UserScript==

 var script = document.createElement("script");
      script.setAttribute("type","text/javascript");
      script.setAttribute("src", "https://kraken.dubizzlelab.com/static/qkam.counter.js");
      document.getElementsByTagName("body")[0].appendChild(script)
 
var css = document.createElement('link');
      css.setAttribute("href","https://kraken.dubizzlelab.com/static/qkam.css");
      css.setAttribute("rel", "stylesheet");
      document.getElementsByTagName("head")[0].appendChild(css);