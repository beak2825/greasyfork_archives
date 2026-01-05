// ==UserScript==
// @name        ROMS43 3DS Downloader
// @namespace   roms43_3ds_downloader
// @description A simple script that let you get a direct download link from ROMS43's 3DS section
// @license     GPL; https://www.gnu.org/licenses/gpl.html
// @version     1.16
// @grant       GM_xmlhttpRequest
// @match       http://www.roms43.com/download/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/8727/ROMS43%203DS%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/8727/ROMS43%203DS%20Downloader.meta.js
// ==/UserScript==
/*
*
* ROMS43 3DS Downloader
* A simple script that let you get a direct download link from ROMS43's 3DS section.
* Licensed under the GPL license.
* https://www.gnu.org/licenses/gpl.html
* 
* Made by / aka slash
*
* Feel free to report these bugs as well as any idea to improve this script.
* https://greasyfork.org/en/scripts/8727-roms43-3ds-downloader/feedback
* Have fun
*
*/

link = "http://www.instantshare.net";

breadcrumb = document.getElementById("breadcrumb").innerHTML;

baseTitle = document.querySelectorAll(".topbar.orange")[0].innerHTML.slice(4,-5);
title = baseTitle.replace("Patched - ", "").replace(/ /g, "%20").replace("&amp;","and");

if(breadcrumb.search("3ds")!=-1){
    if(breadcrumb.search("/3ds/")!=-1){link = link + "/3DS/" + title}
    else if(breadcrumb.search("/3dscia/")!=-1){link = link + "/3DSCIA/" + title}
    else if(breadcrumb.search("/3dsvc/")!=-1){link = link + "/3DSVC/" + title}  
    else if(breadcrumb.search("/3ds-patched/")!=-1){link = link + "/3DS-onlinepatched/" + title}
    
    GM_xmlhttpRequest({
      synchronous:true,
      method: "POST",
      url: "http://roms43-3ds-downloader.comeze.com/check.php",
      data:"par="+link,
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      onload: function(output) {
                    if(output.response!=""){
                        link = output.response.slice(0,output.response.search("<!-- Hosting24 Analytics Code -->")).replace(/ /g, "%20");
                        downloading = "<div style='text-align:center'><a style='font-size:50px' href='"+link+"'>Download</a></div><p style='font-size:10px'>Feel free to report any bug or non covered rom <a style='font-size:10px' href='https://greasyfork.org/en/scripts/8727-roms43-3ds-downloader/feedback'>there.</a></p>";
                        document.querySelectorAll(".full-wrapper")[1].innerHTML = downloading;
                        window.open(link);
                    }
                  }
    });
}