// ==UserScript==
// @name        AutoSaveDiv
// @namespace   AutoSaveDiv
// @description save and restores div.contenteditable texts
// @include     *
// @exclude		https://docs.google.com/*
// @version     1.04
// @grant    GM.getValue
// @grant    GM.setValue
// @grant    GM_getValue
// @grant    GM_setValue
// @require  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @author		Dediggefedde
// @downloadURL https://update.greasyfork.org/scripts/7084/AutoSaveDiv.user.js
// @updateURL https://update.greasyfork.org/scripts/7084/AutoSaveDiv.meta.js
// ==/UserScript==

var active=false;
var isCtrl=false;
var isShift=false;
var isAlt=false;
var name="";
var altstil;
var img=document.createElement("div");

// GM_registerMenuCommand("Clear stored Formular Fiels", function(){
    // var arrs=GM_listValues();
    // var i=0;
   // for (i = 0; i < cars.length; i++) { 
        // GM_deleteValue(arrs[i]);
    // }
// }, "c" );

img.addEventListener("contextmenu",function(e){
	restore(img.previousSibling);
	e.preventDefault();
	return false;
},false);

img.addEventListener("click",function(e){
	e.preventDefault();
	if(e.which==1)listenView(img.previousSibling);
	// else if(e.which==3)
	return false;
},true);
		
function save(el){
	if(el.tagName=="DIV")
		GM.setValue(name,document.activeElement.innerHTML);
	else if(el.tagName=="TEXTAREA")
		GM.setValue(name,document.activeElement.value);
}
async function restore(el){
	if(el.tagName=="DIV")
		el.innerHTML=await GM.getValue(name);
	else if(el.tagName=="TEXTAREA")
		el.value=await GM.getValue(name);
}
async function getVal(n){
	return await GM.getValue(n);
}
function listenView(el){	
	active=!active;
	if(active){
		img.style.backgroundColor="red";
		altstil=el.style.border;
		el.style.border="1px solid red";
	}else {
		img.style.backgroundColor="blue";
		el.style.border=altstil;
	}
}

document.addEventListener("click",function(e){
  if(this==img||active)return false;
  if((document.activeElement.tagName=="DIV"&&document.activeElement.getAttribute("contenteditable"))||document.activeElement.tagName=="TEXTAREA"){
    (async function() {
      name=location.host+"::"+document.activeElement.tagName+"_"+location.pathname;
      img.setAttribute("style","width:20px;height:20px;position:relative;margin-top:-20px;opacity:0.5;border:1px solid blue;background-color:blue;border-top-right-radius:15px;");
      img.title="leftclick: de-/activate capturing text!\nrightclick: restore last text!\nstored:\n"+await GM.getValue(name);
      document.activeElement.parentNode.insertBefore(img, document.activeElement.nextSibling);
    })();
  }	
},true);

document.addEventListener("keydown",function(e){
  switch(e.which){
    case 17:isCtrl=true;break;
    case 16:isShift=true;break;
    case 18:isAlt=true;break;
    default:
                };
},true);

document.addEventListener("keyup",function(e){
  switch(e.which){
    case 17:isCtrl=false;break;
    case 16:isShift=false;break;
    case 18:isAlt=false;break;
    case 68: //d
      if(isShift&&isCtrl&&isAlt){
        listenView(document.activeElement);
      }			
      break;
    case 83: //s
      if(!active&&isShift&&isCtrl&&isAlt)restore(document.activeElement);
      break;
    default:
                };
  if(active){
    (async function(){
    	save(document.activeElement);
    	img.title="leftclick: de-/activate capturing text!\nrightclick: restore last text!\nstored:\n"+ (await GM.getValue(name));
    })();
  }
},true);