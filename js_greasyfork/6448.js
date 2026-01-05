
// ==UserScript==
// @name        dA_Channel_Footer
// @namespace   dA_Channel_Footer
// @description displays a channel as footer on all pages
// @match     *://*.deviantart.com/*
// @exclude   *.deviantart.com/submit/*
// @version     1.6
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM.xmlHttpRequest
// @grant       GM.getValue
// @grant       GM.setValue
// @require  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @downloadURL https://update.greasyfork.org/scripts/6448/dA_Channel_Footer.user.js
// @updateURL https://update.greasyfork.org/scripts/6448/dA_Channel_Footer.meta.js
// ==/UserScript==

var settingsForm=null;
var disablescroll=false;
var scrollByPage=true;
var barHeight=150;
var step=1;
var scrolInt;
// var DelayPerScroll=30;
var DelayOnRow=3000;
// var channel=3;
var el;
var defaultsite="http://www.deviantart.com/dailydeviations/"
var site=defaultsite;

var parrowright="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAOCAYAAADE84fzAAAAtklEQVQ4jdXUvQ6CMBQF4D4Sg0tBKPIPhTYKii46+PYdOvQFjgOBGHFBaaI36fqdk+bmEodR2HrEYRQ0T0CLBG6Zwi1TeFUGj2fY1jn8poAvCgSyBNtXCA8cYcux62pExwbRqUHcC8S9QHKWSC4S8t7/EK6Mtosro+3iymi7uDL6D5sv/vNNFKy2LfzWwRfpgBNChvYr7fnUehyHUWzi4Gt81vo5YAxZilfXdkJn8LuQjw7VyzwAJ99H0kJrFxkAAAAASUVORK5CYII=";
var parrowleft="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAOCAYAAADE84fzAAAAs0lEQVQ4jdXUvQ6CMBQF4D4SA0tBfoQChUIbBa0uOvj2DAy8wHEw9X9RaKI36fqdk5ubEieisPWIE1GokwbbK7CdQqolUi2RbBskmwbLrkbcCsRrgWhVIVQlAskRNByLuoAvcvhVDq/M4JUZKGegBftBvB8HO3g/DnZwA8+O38P/1XzSzgOZQRy72a7FTcILTgi5tZ/pzq+wwU37qbibho+4CTAh1aH9GDfoC/wu5KuP6mnOpi1H0rwh70QAAAAASUVORK5CYII="
var aktpos=0;
var sscroll;

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
function scrollto(el,startP,endP,time){
	var t=0;
	var dt=(endP-startP)>0?1:(endP==startP)?0:-1;
	clearInterval(sscroll);
	
	sscroll=setInterval(function(){

		if(t<time){
			var fac1=(endP-startP)/2.0;
			var fac2=2.0*t/time;
			el.scrollLeft=fac1*(fac2<1?Math.pow(fac2,3):+1*(Math.pow(fac2-2,3)+2))+startP;
			t++;
		}

		if(t>=time||(dt==1&&el.scrollLeft>=endP)||(dt==-1&&el.scrollLeft<=endP)){
			// console.log(el.scrollLeft,endP,fac1,fac2,dt);
			clearInterval(sscroll);
		}
	},20);
}
function scroller(){
	if(disablescroll){return;};
	var ul = el.getElementsByClassName('tt-a');
	if(ul.length==0)return;
	scrollto(el,el.scrollLeft,ul[aktpos].offsetLeft,50);//50 ticks, 20ms per tick -> 1s per animation
	// console.log(aktpos,step,el.scrollLeft,ul[aktpos].offsetLeft);
	if(ul[aktpos-0].offsetLeft>=el.scrollWidth-el.clientWidth)step=-1;
	if(aktpos==0)step=1;
	aktpos+=step;
}
function AddStyle(tex){
	var sty=document.getElementById("dA_Channel_Footer_Style")
	if(sty===null){
		sty=document.createElement("style");
		sty.id="dA_Channel_Footer_Style";
		sty.innerHTML=tex;
		document.head.appendChild(sty);
	}else{
		sty.innerHTML+="\n"+tex;
	}
}

AddStyle("#dA_Channel_Footer {padding-top:3px;height: "+barHeight+"px; overflow-y: hidden; overflow-x: hidden;text-align:left;white-space: nowrap; }"+
"#dA_Channel_Wrapper img.buts{position:absolute;cursor:pointer;position: absolute;margin-top:3px;}"+
"#dA_Channel_Wrapper img.leftbut{left:10px;}"+
"#dA_Channel_Wrapper img.rightbut{right:10px;}"+
"#dA_Channel_Wrapper div.tt-a{display: inline-flex;vertical-align: middle;}"+
// "#dA_Channel_Wrapper div.tt-a a.thumb img{height:120px;width:auto;}"+
"#dA_Channel_Wrapper div.channelHeader>a, #dA_Channel_Wrapper div.channelHeader>div {display:inline-block;float:none; margin-top:3px;}"+
"#dA_Channel_Footer div.stream>div{width:200px;white-space: normal;}"+
"#dA_Channel_Footer a.thumb{margin:auto!important;}"+


"div#output footer#depths div#dA_Channel_Wrapper div#dA_Channel_Footer div.tt-a.huge.tt-ismature.ta span.tt-w span.shadow a.thumb.ismature div.thumb_agegate{white-space: normal;}"+
"div#output footer#depths div#dA_Channel_Wrapper div#dA_Channel_Footer div.tt-a.sq.tt-freeform span.tt-w span.shadow a.thumb.lit{white-space: normal; height:"+(barHeight-10)+"px; }"+
"#dA_Channel_Footer_scrolling,#dA_Channel_Footer_Ch{cursor:pointer;}"+
"#dA_Channel_Footer_Setting_wrapper{display:none;position:fixed; left:0;top:0;bottom:0;right:0;z-index:99999;}"+
"#dA_Channel_Footer_Setting{position:absolute;width:300px;height:220px; margin:auto auto;  left:0;top:0;bottom:0; right:0;background-color:#fff;border-radius:15px;padding:15px; border:1px solid green;}"+
"#dA_Channel_Footer_Setting dl{display:flex;flex-wrap:wrap;line-height:3em;}"+
"#dA_Channel_Footer_Setting dl dt{width:40%;}"+
"#dA_Channel_Footer_Setting dl dd{width:55%;margin-left:auto;}"+
"#dA_Channel_Footer_Setting dl dd input[type='text']{width:100%;}"+
"#dA_Channel_Footer_Setting div.buttons{display:flex;}"+
"#dA_Channel_Footer_Setting div.buttons div{user-select:none;cursor:pointer;flex:1;margin:0 20px;border:1px solid green; border-radius:5px; background-color:#dfd;text-align:center;padding:5px;}"+
"#dA_Channel_Footer_Setting div.buttons div:hover{background-color:#bfb}"+
"#dA_Channel_Footer_Setting div.buttons div:active{background-color:#ded}"+
"");

function showSettingsWindow(){
	settingsForm=document.getElementById("dA_Channel_Footer_Setting_wrapper");
	if(!settingsForm)return;
	
	settingsForm.getElementsByClassName("cb_scrolling")[0].checked=!disablescroll;
	settingsForm.getElementsByClassName("cb_scrollByPage")[0].checked=scrollByPage;
	settingsForm.getElementsByClassName("edit_height")[0].value=barHeight;
	settingsForm.getElementsByClassName("edit_channel")[0].value=site;	
	
	settingsForm.style.display="block";
}

function start(data){	
	var text=data.responseText;
	var channels=[]; //0: garbage. after that: index
	var Pos=text.indexOf('<div class="channelHeader"');
	
	var virtWrap=document.createElement("div");
	virtWrap.innerHTML=text;
	var imgs=virtWrap.querySelectorAll(".thumb");
	var zwitab="";
	var remEl;
  	console.log(imgs);
	for(var i=0;i<imgs.length;i++){
  	console.log(i);
    remEl=imgs[i].querySelector("span.info");
    if(remEl!=null && remEl.parentNode!= null)remEl.parentNode.removeChild(remEl);
		//if(imgs[i].className.indexOf("stash-tt-a")!=-1)continue;
		//remEl=imgs[i].querySelector(".tt-bb");
		//if(remEl!=null)remEl.parentNode.removeChild(remEl);
    imgs[i].style.width="auto";
		imgs[i].querySelector("img").style='height:'+(barHeight-10)+'px;width:auto;'; //DDs    
		zwitab+=" <div class='tt-a'>"+imgs[i].outerHTML+"</div>";
	}
	channels.push(zwitab);
	
	//---------------------------
	
	el=document.createElement("div");
	el.id="dA_Channel_Footer";		
	el.innerHTML=channels[0];
	var ul = el.getElementsByClassName('tt-a');
	if(ul.length>0&&typeof ul[0].parentNode!="undefined")
		for (var i = ul.length; i >= 0; i--) {
			ul[0].parentNode.appendChild(ul[Math.floor(Math.random() * ul.length)]);
		}	
	
	var wel=document.createElement("div");
	wel.id="dA_Channel_Wrapper";
	var channelheader=el.getElementsByClassName("channelHeader")[0];
	var img;
	img=document.createElement("a");
	img.id="dA_Channel_Footer_scrolling";
	img.onclick="return false;";
	img.innerHTML="Settings";//disablescroll?"enable scrolling":"disable scrolling";
    if(typeof channelheader=="undefined"){channelheader=document.createElement("div");channelheader.className="channelHeader";}
	channelheader.appendChild(img);
	img.addEventListener("click", showSettingsWindow,false);
	
	img=document.createElement("img");
	img.className='leftbut buts';
	img.src=parrowleft;
	channelheader.appendChild(img);
	img.addEventListener("click",function(){
			if(typeof ul[aktpos]=="undefined")return;
			
			if(scrollByPage){
				var curpos=aktpos;
				while(aktpos>0 && Math.abs(ul[aktpos].offsetLeft-ul[curpos].offsetLeft)<el.clientWidth){
					// console.log(ul[aktpos].offsetLeft, ul[aktpos].clientLeft, ul[aktpos].scrollLeft);
					--aktpos;
				}
				++aktpos;
			}else{
				if(aktpos>0)aktpos--;				
			}
			step=-1;
			disablescroll=true;
			GM.setValue("disablescroll",disablescroll);
			scrollto(el,el.scrollLeft,ul[aktpos].offsetLeft,25); //25 ticks, 20ms/tick = 0.5s animation
		},false);
	img=document.createElement("img");
	img.className='rightbut buts';
	img.src=parrowright;
	channelheader.appendChild(img);
	img.addEventListener("click",function(){
    console.log("right");
			if(scrollByPage){
				var curpos=aktpos;
				while(aktpos<ul.length-1 && ul[aktpos].offsetLeft-ul[curpos].offsetLeft<el.clientWidth){
					++aktpos;
				}
				--aktpos;
			}else{
				if(aktpos<ul.length-1)++aktpos;				
			}
			if(typeof ul[aktpos]=="undefined")return;
			step=1;
			disablescroll=true;
			 GM.setValue("disablescroll",disablescroll);
			scrollto(el,el.scrollLeft,ul[aktpos].offsetLeft,25);
		},false);
	
	wel.appendChild(channelheader);		
	wel.appendChild(el);
	document.getElementById("depths").insertBefore(wel,document.getElementById("depths").firstChild);

	scrolInt=setInterval(scroller,DelayOnRow);
	 
	 
	settingsForm=document.createElement("div");
	settingsForm.id="dA_Channel_Footer_Setting_wrapper";
	settingsForm.innerHTML="<div id='dA_Channel_Footer_Setting'><h1>Settings</h1>"+
		"<dl>"+
		"<dt>Scrolling</dt><dd><input type='checkbox' class='cb_scrolling'/></dd>"+
		"<dt>Scroll by page</dt><dd><input type='checkbox' class='cb_scrollByPage'/></dd>"+
		"<dt>Height (px)</dt><dd><input type='text' class='edit_height'/></dd>"+
		"<dt>Channel</dt><dd><input type='text' class='edit_channel'/></dd>"+
		"</dl>"+
		"<div class='buttons'>"+
		"<div class='save'>Save</div>"+
		"<div class='cancel'>Cancel</div>"+
		"</div></div>";
	document.body.appendChild(settingsForm);
	settingsForm.getElementsByClassName("cancel")[0].addEventListener("click",function(){
		document.getElementById("dA_Channel_Footer_Setting_wrapper").style.display="none";
	},false);
	settingsForm.getElementsByClassName("save")[0].addEventListener("click",function(){
		disablescroll=!settingsForm.getElementsByClassName("cb_scrolling")[0].checked;
		scrollByPage=settingsForm.getElementsByClassName("cb_scrollByPage")[0].checked;
		barHeight=settingsForm.getElementsByClassName("edit_height")[0].value;
		site=settingsForm.getElementsByClassName("edit_channel")[0].value;
		
		if(site=="")site=defaultsite;
		
		//a
		GM.setValue("site",site);
		GM.setValue("disablescroll",disablescroll);
		GM.setValue("scrollByPage",scrollByPage);
		GM.setValue("barHeight",barHeight);
		
		
		document.getElementById("dA_Channel_Footer").style.height=barHeight+"px";
		
		AddStyle("div#output footer#depths div#dA_Channel_Wrapper div#dA_Channel_Footer div.tt-a.sq.tt-freeform span.tt-w span.shadow a.thumb.lit{white-space: normal; height:"+(barHeight-10)+"px;");
		
		var timg=document.querySelectorAll("#dA_Channel_Footer div.tt-a a.thumb img");
		for(var i=0;i<timg.length;++i)timg[i].style='height:'+(barHeight-10)+'px;width:auto;'; //DDs
		
		
		document.getElementById("dA_Channel_Footer_Setting_wrapper").style.display="none";
	},false);
	
	document.getElementById("dA_Channel_Footer").style.height=barHeight+"px";
}


async function load(){
if(typeof await GM.getValue("site")!="undefined")site=await GM.getValue("site");
if(typeof await GM.getValue("disablescroll")!="undefined")disablescroll=await GM.getValue("disablescroll");
if(typeof await GM.getValue("scrollByPage")!="undefined")scrollByPage=await GM.getValue("scrollByPage");
if(typeof await GM.getValue("barHeight")!="undefined")barHeight=await GM.getValue("barHeight");
// if(typeof GM_getValue("channel")!="undefined")channel=GM_getValue("channel");
  console.log(site);
// (async function(){
	GM.xmlHttpRequest({
		url:site,
		method: "get",
		onload:start,
		onerror:function(err){console.log(err);}
	});
 };
load();//catch(function(err){console.log(err);)
