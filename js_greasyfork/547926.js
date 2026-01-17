var _____WB$wombat$assign$function_____=function(name){return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name))||self[name];};if(!self.__WB_pmw){self.__WB_pmw=function(obj){this.__WB_source=obj;return this;}}{
let window = _____WB$wombat$assign$function_____("window");
let self = _____WB$wombat$assign$function_____("self");
let document = _____WB$wombat$assign$function_____("document");
let location = _____WB$wombat$assign$function_____("location");
let top = _____WB$wombat$assign$function_____("top");
let parent = _____WB$wombat$assign$function_____("parent");
let frames = _____WB$wombat$assign$function_____("frames");
let opens = _____WB$wombat$assign$function_____("opens");
// ==UserScript==
// @name 4chan [s4s] colored text
// @description For funposting on [s4s]
// @include *//boards.4chan.org/s4s/*
// @version 0.0.1.20260117014130
// @namespace https://greasyfork.org/users/1510523
// @downloadURL https://update.greasyfork.org/scripts/547926/4chan%20%5Bs4s%5D%20colored%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/547926/4chan%20%5Bs4s%5D%20colored%20text.meta.js
// ==/UserScript==
postmass=document.getElementsByClassName('postContainer')
postmes=document.getElementsByClassName('postMessage')
for(i=0;i<postmes.length;i++){
if(postmass[i].getElementsByClassName('name')[0].innerHTML.toLowerCase()=='kek'){
	postmes[i].setAttribute('class',postmes[i].getAttribute('class')+' papyrus')
}
postmessy=postmes[i].innerHTML.replace('<span class="fortune"','<br><span class="fortune"')
checkora=postmessy.split('<br>')
for(j=0;j<checkora.length;j++){
	temp=checkora[j].replace('\n','')
	if(temp.length-temp.lastIndexOf('&lt;')==4&&temp.indexOf('&lt;')!=-1){
		checkora[j]='<span style="color:orange">'+checkora[j]+'</span>'
	}
	if(temp.length-temp.lastIndexOf('&gt;')==4&&temp.indexOf('&gt;')!=-1){
		checkora[j]='<span style="color:pink">'+checkora[j]+'</span>'
	}
	if(temp.indexOf('&lt;')==0){
		checkora[j]='<span style="color:red">'+checkora[j]+'</span>'
	}
	if(temp.length-temp.lastIndexOf(')')==1&&temp.indexOf(')')!=-1&&temp.indexOf('(')==0){
		checkora[j]='<span style="color:red;font-weight:bold">'+checkora[j]+'</span>'
	}
	if(temp.length-temp.lastIndexOf(' ]')==2&&temp.indexOf(' ]')!=-1&&temp.indexOf('[ ')==0){
		checkora[j]='<span style="color:blue;font-family:monospace;font-weight:bold">'+checkora[j]+'</span>'
	}
	if(temp.length-temp.lastIndexOf(' }')==2&&temp.indexOf(' }')!=-1&&temp.indexOf('{ ')==0){
		checkora[j]='<span style="color:purple;font-family:monospace;font-weight:bold">'+checkora[j]+'</span>'
	}
	if(temp.indexOf('[spoiler]')+1&&temp.indexOf('[/spoiler]')&&(temp.indexOf('[spoiler]')<temp.indexOf('[/spoiler]'))){
		checkora[j]=checkora[j].replace('[spoiler]','<span class="spoiler">')
		checkora[j]=checkora[j].replace('[/spoiler]','</span>')
	}
}
checkorb=checkora.join('<br>').replace('<br><span class="fortune"','<span class="fortune"')
postmes[i].innerHTML=checkorb
}
document.head.appendChild(newcss=document.createElement('style'))
newcss.innerHTML='@font-face{font-family:Papyrus;src:local(Papyrus),url(\'http://www.stben.net/fonts/papyrus.woff\') format(\'woff\')}.papyrus{font-family:Papyrus!important}'

}
/*
     FILE ARCHIVED ON 02:40:12 Nov 04, 2013 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 01:41:29 Jan 17, 2026.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.929
  exclusion.robots: 0.059
  exclusion.robots.policy: 0.045
  esindex: 0.012
  cdx.remote: 50.341
  LoadShardBlock: 295.482 (3)
  PetaboxLoader3.resolve: 380.139 (3)
  PetaboxLoader3.datanode: 134.366 (4)
  load_resource: 319.901
*/