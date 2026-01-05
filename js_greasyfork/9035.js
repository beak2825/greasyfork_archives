// ==UserScript==
// @name         Better HollywoodTuna
// @namespace    betterhollywoodtune.dekart25.com
// @version      0.3
// @description  This script will load all the pictures that belong to the same series and show them below the page.
// @author       dekart25
// @match        http://www.hollywoodtuna.com/?page_id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9035/Better%20HollywoodTuna.user.js
// @updateURL https://update.greasyfork.org/scripts/9035/Better%20HollywoodTuna.meta.js
// ==/UserScript==

var firstImage = $("#page div:first-child")[3];
var divComTodasAsImagens = $(firstImage).parent();

divComTodasAsImagens.find("div").css("width","").css("height","");

divComTodasAsImagens.find("img").removeAttr("width").removeAttr("height");

divComTodasAsImagens.find("img").each(function(index,elem) { 
    elem.src = elem.src.replace("images3","images3/bigimages3");
})