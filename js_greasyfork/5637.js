// ==UserScript==
// @name           hideWC
// @namespace      tag://kongregate
// @description    Reload Kongregate games without refreshing their page.
// @author         
// @version        
// @date           
// @include        http://www.kongregate.com/games/*/*
// @downloadURL https://update.greasyfork.org/scripts/5637/hideWC.user.js
// @updateURL https://update.greasyfork.org/scripts/5637/hideWC.meta.js
// ==/UserScript==


var d=document,s=d.createElement("script");
if (top===self&&/^(?:https?:\/\/)?(?:www\.)?kongregate\.com\/games\/[^\s\\\/]+\/[^\s\\\/]+$/i.test(d.location.href)) {
	s.type="text/javascript";
	d.head.appendChild(s.appendChild(d.createTextNode('('+function(){
        reload4Kong=function(a){
            var b,d=document;
            if(holodeck&&activateGame&&(b=d.getElementById("quicklinks"))!==null){
                a=d.createElement('li');
                a.innerHTML='<a href="" onclick="SRDotDX.gui.hideWC(false); return false;">Show/Hide WC</a>';
                b.insertBefore(a,b.firstChild);
                holodeck.addChatCommand(

function(init) {
 	var offset;
	if(init) offset = SRDotDX.config.hideWChat?-265:0;
 	else {
 		offset = SRDotDX.config.hideWChat?265:-265;
 		SRDotDX.config.hideWChat = !SRDotDX.config.hideWChat;
 		document.getElementById('hideWCtxt').innerHTML = SRDotDX.config.hideWChat?'Show World Chat':'Hide World Chat';
 	}
 	var gmWidth = document.getElementById('gameholder').offsetWidth + offset;
 	document.getElementById('gameholder').style.width = gmWidth + "px";
 	document.getElementById('game').style.width = gmWidth + "px";
 	this.chatResize();
 }
);
                setTimeout(function(){delete reload4Kong},1)
            }
            else if(a){setTimeout(function(b){reload4Kong(b)},10000,a--)}
            else{setTimeout(function(){delete reload4Kong},1)}
        }
        reload4Kong(10);
	}+')()')).parentNode);
}