// ==UserScript==
// @name        Nexus Clash Bullhorn Safety
// @namespace   http://userscripts.org/users/125692
// @description Disables bullhorn button until something is typed in bullhorn speech box.
// @include     http://www.nexusclash.com/modules.php?name=Game*
// @include     http://nexusclash.com/modules.php?name=Game*
// @exclude        http://nexusclash.com/modules.php?name=Game&op=disconnect
// @exclude        http://www.nexusclash.com/modules.php?name=Game&op=disconnect
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8423/Nexus%20Clash%20Bullhorn%20Safety.user.js
// @updateURL https://update.greasyfork.org/scripts/8423/Nexus%20Clash%20Bullhorn%20Safety.meta.js
// ==/UserScript==
(function() {
 var bullhornform= document.evaluate("//form[@name='bullhorn']", document, null,
	    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null); 
  if (bullhornform.snapshotLength > 0){
    //we have a bullhorn so preceed
    
    bullhornform=bullhornform.snapshotItem(0);//assume bullhorn form we want is first one.
    var bullhornbutton=bullhornform.firstElementChild;
    bullhornbutton.disabled=true;
    var bullhornspeechbox=bullhornbutton.nextElementSibling;
    var enablebullhorn=function(e) {
        var button=e.target.previousElementSibling;
        if (e.target.value!=""){
            button.disabled=false;
        }
        else{
            button.disabled=true;
        }
    }
    //bullhornspeechbox.addEventListener("keyup",enablebullhorn,false);
    bullhornspeechbox.addEventListener("input",enablebullhorn,false);
    
  }
//EOF
})();