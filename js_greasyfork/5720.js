// ==UserScript==
// @name     	 Black Shadow Username Changer
// @namespace     Roger Waters
// @description    Jesus
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @include      *hackforums.net/showthread.php?tid=* 
// @include      *hackforums.net/member.php?action=profile&uid=* 
// @version      1.0
// @downloadURL https://update.greasyfork.org/scripts/5720/Black%20Shadow%20Username%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/5720/Black%20Shadow%20Username%20Changer.meta.js
// ==/UserScript==

original="Black Shadow";
newUserName="Jesus";
if(window.location.href.indexOf("hackforums.net/showthread.php?tid=") >= 1) {

    var usernames=$(".group0");
    
    for(var i=0;i<usernames.length;i++) {
    	var meep = usernames[i].innerHTML;
        if(meep==original) {
            usernames[i].innerHTML = newUserName;
        }
    }
}
if(window.location.href.indexOf("hackforums.net/member.php?action=profile&uid=") >= 1) {

    var usernames=$(".group0");
    
    for(var i=0;i<usernames.length;i++) {
    	var meep = usernames[i].innerHTML;
        if(meep==original) {
            usernames[i].innerHTML = newUserName;
        }
    }
}