// ==UserScript==
// @name         ScoopsMeatland add download attribute
// @namespace    http://your.homepage/
// @version      1
// @description  Adds the download attribute to http://scoopsmeatland.blogspot.com/ links for easy downloading
// @author       KMC
// @match        http://scoopsmeatland.blogspot.com/
// @run-at       document-end
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7581/ScoopsMeatland%20add%20download%20attribute.user.js
// @updateURL https://update.greasyfork.org/scripts/7581/ScoopsMeatland%20add%20download%20attribute.meta.js
// ==/UserScript==
var element = $("a[href]");
element.each(function(index, value) {
    if($(element[index]).attr("href").split('.').pop() == "mp3"){
        $(element[index]).attr("download", "");
    }
});