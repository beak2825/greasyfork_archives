// ==UserScript==
// @name        3xpert alert
// @namespace   http://zawardo.it
// @description los tres ladrones
// @include     https://social.tre.it/expert
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @version     1.1
// @grant       GM_log
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/8755/3xpert%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/8755/3xpert%20alert.meta.js
// ==/UserScript==


if(unsafeWindow.console){
   var GM_log = unsafeWindow.console.log;
}

var testo = $("#current-ticket h1").html();
window.setInterval(function(){
   if ($("#current-ticket h1").html()!=testo) {
     if ($("#current-ticket h1").html()!="@Federico Casavecchia, non ci sono domande per te") {
     console.log("DOMANDA!!!");
     var domanda = $("td[data-title='Anteprima']").html();
     domanda=encodeURIComponent(domanda);
     GM_xmlhttpRequest({
			  method: "POST",
			  url: "http://www.zawardo.it/automail/mandamail.php",
        data: "username=zawardo&password=intermerda&domanda="+domanda,
        headers: {
         "Content-Type": "application/x-www-form-urlencoded"
        },
			  onload: function(response) {
			    var risposta=response.responseText;
			    if (risposta=="ko") console.log("ERRORE MAIL");
			  }
			});    
   testo = $("#current-ticket h1").html();
   } else { 
     //console.log("nada....");
   }
   } else { 
     //console.log("nada....");
   }
} ,10000);