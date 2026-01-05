// ==UserScript==
// @name           Johnny Cash ++
// @version        4.2
// @namespace      johnwu@radio.blmurphy.net
// @description    replaces chat text for users with random texts (selected by player ID)
// @include        http://chat.pardus.at/chattext.php*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/6931/Johnny%20Cash%20%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/6931/Johnny%20Cash%20%2B%2B.meta.js
// ==/UserScript==

var hijack = function(){
 var chatWnd = document.getElementById("ChatWnd");
 var chatDivCount = 1;
 var profileReplacements = [
   { profile: "172947", rname: "James The Wicked", name: "James", repl: "drip drip"},
   { profile: "N/A", repl: "N/A"}
 ];

 function processChat() {
   var chatDivs = chatWnd.childNodes;

   for (; chatDivCount < chatDivs.length; chatDivCount += 2) {
     var lineDiv = chatDivs[chatDivCount];
     var start = lineDiv.innerHTML.indexOf("profile.php?id=");
     var crop = lineDiv.innerHTML.substring(start + 15);
     var profileId = crop.substring(0,crop.indexOf(" ") - 1);

     for (var j = 0; j < profileReplacements.length; j += 1) {
       if (profileReplacements[j].profile == profileId) {
         lineDiv.getElementsByTagName("span")[1].innerHTML =
                 "<a style=\"color:#C0D0FF\" href=\"javascript:sendmsg('" +
                 profileReplacements[j].rname + "')\"><b>" +
                 profileReplacements[j].name + "</b></a>: " +
                 profileReplacements[j].repl;
         lineDiv.getElementsByTagName("span")[1].style.color = "#C0D0FF";
       }
     }
   }
 }
 processChat();

 var originalAjaxCallback = window.ajaxCallback;
 window.ajaxCallback = function(result, errors) {
   originalAjaxCallback(result, errors);
   processChat();
 }
};

var script = document.createElement("script");
script.textContent = "(" + hijack.toString() + ")()";
document.body.appendChild(script);
