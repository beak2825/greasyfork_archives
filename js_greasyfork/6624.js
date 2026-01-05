// ==UserScript==
// @name         CyperHackedChecker
// @namespace    http://cypher.extremecast.com/
// @version      1.0
// @description  Checks if the user has been hacked
// @author       CobraAn
// @match        http://cypher.extremecast.com/main/main.php
// @require 	 http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant    	 GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/6624/CyperHackedChecker.user.js
// @updateURL https://update.greasyfork.org/scripts/6624/CyperHackedChecker.meta.js
// ==/UserScript==

// ALFA VERSION

var myTimer = null;

$(document).ready(function() {
    $('body').append('<input type="button" value="Begin" id="CP">')
      $("#CP").css("position", "fixed").css("top", 0).css("left", 0);
      $('#CP').click(function(){ 
          myTimer = setInterval(function() {
            $.ajax ( {
                type:       'GET',
                url:        window.location.href,
                dataType:   'HTML',
                success:    function (apiJson) {
                    var resultObj = apiJson;
                    var str = apiJson.search("trace not completed");
                    if (str != -1 && readCookie('hackedstrcookie') == null) {
                        alert (
                           'HACKED!'
                        );
                        document.cookie = 'hackedstrcookie=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/'
                        document.cookie = 'hackedstrcookie='+str+'; expires=Thu, 2 Aug 2020 20:47:11 UTC; path=/'
                        
                    } 
                    
                }
            } );
        }, 5000);
      });
    $('body').append('<input type="button" value="Stop" id="CS">')
      $("#CS").css("position", "fixed").css("top", 20).css("left", 0);
      $('#CS').click(function(){ 
          clearInterval(myTimer);
      });
});

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
	var c = ca[i];
	while (c.charAt(0)==' ') c = c.substring(1,c.length);
	if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
};