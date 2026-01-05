// ==UserScript==
// @name        HTTP REQ TEST
// @namespace   www.pardus.at
// @description HttpRequestScript
// @include     http*://*.pardus.at/*
// @version     3
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/7420/HTTP%20REQ%20TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/7420/HTTP%20REQ%20TEST.meta.js
// ==/UserScript==

GM_xmlhttpRequest({
  method: "GET",
  data: "Hello World, sorry devs, hopefully your server ignores the body of a GET request!",
  url: "http://www.pardus.at/index.php",
  upload: {
    onload: function(response) {
      alert("Sent request payload!");
    }
  },
  onload: function(response) {  
    alert(response.finalUrl + ":" + response.responseText);
  }
});