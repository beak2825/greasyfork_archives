// ==UserScript==
// @name         DPStream.net Unbriding
// @namespace    DPStream.net Unbriding
// @version      0.3
// @description  This script will help unbriding movies/series
// @author       Kursion
// @grant        none
// @match 		 http://www.dpstream.net/serie-*
// @match 		 http://mondebrideur.com/pureapi.php?id=*
// @require		 http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/6765/DPStreamnet%20Unbriding.user.js
// @updateURL https://update.greasyfork.org/scripts/6765/DPStreamnet%20Unbriding.meta.js
// ==/UserScript==

$(document).ready(function() {
  console.log("DPStream.net Unbriding started");
  var interval = undefined;
  var getLinks = function(){
    console.log("Executing getLinks()")
    // The div containing links
    var container = $("<div/>");
    
    var countLinks = 0;
    $("a").each(function(i){
      var link = $(this).attr("href");
      if(link.indexOf("purevid.com/v/") > 0){
        link = link.replace("http://www.purevid.com/v/", "").slice(0,-1)
        var ahref = $("<a/>", {
          href: "http://mondebrideur.com/pureapi.php?id="+link+"&java=0",
          text: link,
          target: "_blank",
        });
        var div = $("<div/>").html(ahref);
        container.append(div);
        countLinks++;
      }
    });
    if(countLinks > 0){
      container.css({
        position: "absolute",
        width: "350px",
        backgroundColor: "#333333",
        color: "#efefef",
        margin: "auto",
        left: 0,
        right: 0,
        top: "10px",
        padding: "10px",
        borderRadius: "10px"
      });
      $("body").append(container);
      $("body").scrollTop(0);
      clearInterval(interval);
    }
  };
  
  interval = setInterval(getLinks, 2000);
  
});