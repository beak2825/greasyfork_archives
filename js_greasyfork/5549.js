// ==UserScript==
// @name        Djordje Session
// @namespace   djordje.kladionica
// @description Session Keeper
// @include     http://www.sportplus.ba/*
// @version     1
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/5549/Djordje%20Session.user.js
// @updateURL https://update.greasyfork.org/scripts/5549/Djordje%20Session.meta.js
// ==/UserScript==

var i = setInterval(function() {

              GM_xmlhttpRequest({method: 'GET',
	    	url: location.href,
     	headers: {'Cookie': document.cookie},
	    	onload: function(responseDetails) {
	    		
          //	alert('ok');
	    	}});
        }, 60000);