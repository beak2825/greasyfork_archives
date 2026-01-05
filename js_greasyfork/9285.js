// ==UserScript==
// @name           translate.google tooltip
// @namespace      trespassersW
// @author      trespassersW
// @copyright   trespassersW
// @license     MIT
// @description    Translates selected text into a `tooltip' via Google translate 
// @include        *
//  about:config -> greasemonkey.fileIsGreaseable <- true
// /homepahe https://github.com/trespassersW/UserScripts/blob/master/show/translate.google_tooltip.md
// @version 19.09.16
//* This is a descendant of lazyttrick's  http://userscripts.org/scripts/show/36898.
// 19.09.16 * tiny fix
// 19.09.11 * encodeURIComponent( translated_txt )
// 19.04.02 * TTS in detected language
// 18.11.30 * changes in GT API
// 18.01.15 ++ TTS buttons for source  and translation
// 17.03.11 + keep text formatting 
// 16.10.26 + phonetic transcription
// 16.09.01 + 'previous translation' button; [*] top of tooltip at top of client window
// 16.08.26 + option for left/right tooltip position; keeps tooltip position after dragging
// 16.08.16 + Word Definition is shown when source_language == target_language
// 16.03.09   + bookmarlets interface -- javascript:postMessage('tgtooltip/auto/fr','*')
// 16.01.17-2 *+ translation from input/textarea fields
// 16.01.16.1 + alternative translation
// 3.7.2 2015-04-20 * TTS: alt-select text inside tooltip and [ctrl/shift]-click language icon below
//   * [shift] tts window in IFRAME 
//   * [ctrl] tts window in new tab
// 3.0.0  - national flags icons -- from www.senojflags.com
// 2.3  - new editable 'source text' field
// 2.2.2  - backward translation - select text inside tooltip and click the icon under your selection.
// 2.2.1  - Ctrl-Alt-click removes item from the history of translations
//  - Ability to change translation in the history -
//    select desired translation in the tooltip window using ctrl or alt -
//    which one is checked in your settings - then click on the icon below the selection.
// 2.0.0c Alt key option added
// If something goes wrong:
// Tools->SQLite manager-> Database-> Connect_database->
//  %YourBrowserProfile%\gm_scripts\translate.google_tooltip.db ->
//  scriptvals->  alt/ctrl <- false
// 2.0.0b 
// - exit by ESC
// - 1k letters limit -- don't strain your Google
//*/
// /require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant GM_info
// @grant GM_getValue
// @grant GM_openInTab
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @grant GM_registerMenuCommand
// @grant GM_setClipboard
// @connect translate.google.com
// @connect cdn.rawgit.com
// @icon  data:image/jpg;base64, R0lGODlhIAARALP/AAAAAP///xMYfAqf////Zv/qDuCeH8VmB8DAwAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAgALAAAAAAgABEAQASdEMlJgb00awkMKQZYjB8RBsE4AtLQvtt0sXHcEcT1pbxK0hsXRmYIGUUgA3DiQjQtssInRAjglMsa4ibtlqSGgECQymmaAwDYUhSFfKoQDQ3LdA6Hoh6qbW4sJHpFWTUAOEA3Vj1WZjF+HQU9X18oPxl0Wx4kXoFiZF1zMEJgbW8qJnAHoU4takocpW5IIISYGh1HRlh9hRZ4eIRaEQA7
//
// @downloadURL https://update.greasyfork.org/scripts/9285/translategoogle%20tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/9285/translategoogle%20tooltip.meta.js
// ==/UserScript==

if(document.body){ 

var main = function (){ "use strict";

var   GTsuffix=".com"; // ".fr" ".de" ".ru" ".com"
//{[ hacks
var UA = navigator.userAgent;
0 && (UA="Mozilla/5.0 (Windows NT 5.1; rv:39.0) Gecko/20100101 Firefox/39.0");
//]}
var isChrome= (navigator.userAgent.indexOf("AppleWebKit")>0);
var moz=isChrome? "-webkit-": "-moz-";

var   GTurl= "https://translate.google"+GTsuffix+"/?"; 
//var dictURL= "https://translate.google"+GTsuffix+"/translate_a/t?client=t";
var dictURL= "https://translate.google"+GTsuffix+"/translate_a/single?client=webapp";
var  ttsURL= "https://translate.google.com/translate_tts?client=t";

var HREF_NO = 'javascript:void(0)';

var llii=1, _log = function(){ /* * /
 for (var s=++llii +':', li=arguments.length, i = 0; i<li; i++) 
  s+=' ' + arguments[i];
 console.log(s)
/* */
},_i=function(){};
//_log=console.log.bind(console);
//_i=console.info.bind(console);
console.log("tgTT..19.09.16 1900");
var URL='*'; var tURL;
var GT_tl='auto';
var autoLang;
var body;

// http://www.senojflags.com/
var senop="https://cdn.rawgit.com",
 seno="/trespassersW/UserScripts/master/Flags/",
 senox="index.html?gtrantoltip#",
 senoj=senop+seno+senox,
 senojflags = [seno, "http://lh/Flags/" ],
 senoext=".png";
//

var res_dict='gt-res-dict'; //'gt_res_dict';
var  languagesGoogle, isInited=false;
var rtl_langs="ar fa iw ur";
var inTextArea= null;
var maxHT=20, maxWC=3;
var sourceBH = 3, sourceDP =10;
var ht=null;  // history table, 

var imgForw,imgBack,imgSay,imgSaY,imgSwap,imgUse,imgSave,imgFlags,imgForwSrc,imgBackSrc,imgClip,imgGoGo,imgWayBack,imgFmt;
var saySrc, sayDst;
var txtSel,txtSelO; // text selected
var currentURL, Qtxt='***'; var e6 =999999;
var TKK;// = Math.round(Math.random()*e6)+"."+Math.round(Math.random()*e6);
var gt_sl_gms, gt_tl_gms, gt_sl, gt_tl;
var formatted;
var sT;
var noMup=0;
var _G = (isChrome?'':moz)+"linear-gradient",_T='transparent';
var G_ ='rgba(0,0,0,.1)',W_='rgba(255,255,255,.1)';
var FG={
t:  ['#000'   ,'#000'    ,'#000'   ,'#000'   ,'#eec'   ,'#000'   ,'#000'   ], // text 
l:  ['#047'   ,'#047'    ,'#047'   ,'#052'   ,'#7CF'   ,'#047'   ,'#670000'], // links
g:  ['#404040','#404040' ,'#404040','#404040','#ccb'   ,'#404040','#404040']  // greyed txt
};

var BG={
t:  ["yellow" ,"grey"    ,"blue"   ,"green"  ,"dark"   ,"striped", "pink"  ], // titles
C:  ['#FFFFE1','#D1D1D1' ,'#D3ECEC','#C4FFC4','#333'  , // bg Color
    _G+'(-45deg, #DDD, #AAA )'    ,'#FFE6E6'], /* */
A:  ['#DFDFAE','#BBB'    ,'#9ED4D5','#82f381'  ,'#666'  , // bg Color 4 alt tran
     _G+'(45deg, #DDD, #AAA )'    ,'#FFCBCC'],/* */
T:  [_G+"(to right,#FFFFE1,#DDDDAA)", _G+"(to right,#D1D1D1,#A0A097)", // buttons
     _G+"(to right,#D3ECED,#8CCCCE)", _G+"(to right,#C4FFC4,#6BEF69)",
     _G+"(to right,#777,#373737)"   , _G+"(to right,#CCC, #888)",
     _G+"(to right,#FFE6E6,#FFC6C8)"  ],
H:  [_T,_T,_T,_T,_T, // dictionary items
     _G+'(to bottom ,rgba(127,127,127,.0),rgba(127,127,127,.15))', _T],
F:  [G_,G_,G_,G_,W_,G_,G_], // historic phrases
E:  ['#F4F4E8','#EEEEEE','#E8E8F4','#E8F4E8','#777777','#DDDDDD','#FFF2F2'] // Edit box
}

function bgClick(e){
  css(e.target.paletteN);
}

function mousedownCleaning(evt){
	var divDic = getId('divDic');
	var divLookup = getId('divLookup');
  var dU = getId('divUse');
  var t=evt.target;
  noMup=0; // patch :/
	if(divDic)	{
		if(!clickedInsideID(evt.target,'divDic')){
      evt.preventDefault(),evt.stopPropagation(); 
      if(dU && clickedInsideID(t,'divUse')){
        if(clickedInsideID(t,'divGetback')) forwLookup(evt); else
        if(clickedInsideID(t,'divGetforw')) backLookup(evt); else
        if(clickedInsideID(t,'imgUse')) useClick(evt); else 
        _log('x3 click');
        return;
      } 
      else 
       cleanUp('MC');
	  }	else killId(dU);
  }
	killId(divLookup);
		
}

var documentcontentEditable=false;
var documentdesignMode  = '';
var divExtract;

var escHnd;
function setEscHnd(){
  if(!escHnd) escHnd=
   document.addEventListener('keydown', escCleanup, false); 
}

function cleanUp(s){
 _log(s);
 var d=getId('divSourcetext');
 if(d) sT= d.value;
 killId('divDic');
 killId('divExtract'); 
 killId('divLookup'); 
 killId('divUse'); 
 killId('divBack'); 
 killId('divSelflag'); 
 killId('divTtsIfr');

 // finally fixed :/
 if(documentcontentEditable)
    document.contentEditable=documentcontentEditable,
    documentcontentEditable = false;
 if(documentdesignMode == 'on')
    document.designMode='on',
    documentdesignMode=null;
}

function useClick(e){
  killId('divUse');
  if(e.shiftKey)  ht[0][1] += '\n'+txtSel;
  else  ht[0][1] = txtSel;
  GM_setValue('hist',JSON.stringify(ht));
  if(getId('divHist')){
   killId('divHist');
   history();
  }
}
var last_tl, last_sl,_l_="/";
function backLookup(e){
    if(e.shiftKey || e.ctrlKey) { 
    noMup=1;
    ttsRequest(txtSel,gt_tl, e.ctrlKey!=0);
    return;
    }
    killId('divUse');
    gtRequest(txtSel,gt_sl,gt_tl);
   	currentURL = GTurl +  "/" + gt_sl + _l_ + gt_tl + _l_ + escAp(txtSel);
}
//GET https://translate.google.com/?langpair=en|ru&text=Varnish
//POST https://translate.google.com/translate_a/t?client=t&hl=ru&sl=en&tl=ru&text=Varnish
function forwLookup(e){
    if(e.shiftKey || e.ctrlKey)  { 
    noMup=1;
    ttsRequest(txtSel,gt_sl, e.ctrlKey!=0);
    return;
    }
    killId('divUse');
    var t=gt_tl; gt_tl=gt_sl; gt_sl=t;
    gtRequest(txtSel,gt_sl,gt_tl);
   	currentURL = GTurl +  "/" + gt_sl + _l_ + gt_tl + _l_ + escAp(txtSel);
}
 var Gctrl, Galt;
 Gctrl=GM_getValue('ctrl',false), Galt=GM_getValue('alt',true);
 var sayTip="\n[shift / ctrl] listen (";
function showLookupIcon(evt){
	if((!evt.ctrlKey && Gctrl)
	 ||(!evt.altKey && Galt)
//  to avoid collision
	 ||(evt.ctrlKey && !Gctrl)
	 ||(evt.altKey && !Galt)
   ||(evt.button!==0) // * 2016-01-03
   ) return;
  evt.preventDefault(),evt.stopPropagation(); 

	var divDic = getId('divDic');
	var divLookup = getId('divLookup');
	txtSel = getSelection(evt.target)+'';

  if(txtSel.length>1024){  
   return;  
  }
	//exit if no text is selected
	if(!txtSel || txtSel===""){
    _log('S:notext ')
		if(divDic)		{
			if(!clickedInsideID(evt.target,'divDic'))
				cleanUp('no sel');
		}
		if(divLookup){
			killId(divLookup);
    }
    return;
	}
	//possible cleanup
	if(divDic){
		if(!clickedInsideID(evt.target,'divDic'))
			{cleanUp('!divdic');		return; }
  // inside divDic:
    var dU=getId('divUse');
    if(dU){
      if(!clickedInsideId('divUse')){
        killId(dU);
      } return;        
	  }
    try{
    var p= belowCursor(evt,10,10,'r');
    var divUse= buildEl('div', {id:'divUse',
    style:'z-index:110000; border: none'+
    ';top:'  + p.t  +';left:' + p.l  +';right:' + p.r +';bottom: auto;'
    },  null, null );

    var iTo = getFlagSrc(gt_tl,'to');
    var divForw=buildEl('span', {id:'divGetforw', // 'class': 'gootranslink', href: HREF_NO,
    //border: 0, src: iTo,
    title: gt_sl_gms + '\u2192 '+gt_tl_gms +sayTip+gt_tl+')'},
    null, imgH+iTo+imgT);
//   	['mousedown', forwLookup], imgH+iTo+imgT); 
    divUse.appendChild(divForw);
    
    var iFrom = getFlagSrc(gt_sl,'from');
    var divBack=buildEl('span', {id:'divGetback', //'class': 'gootranslink',  href: HREF_NO,
    //border: 0, src: iFrom,
    title: gt_tl_gms + '\u2192 '+gt_sl_gms +sayTip+gt_sl+')'},
    null, imgH+iFrom+imgT);
//   	['mousedown', backLookup], imgH+iFrom+imgT);
    if(gt_sl!='auto' && gt_sl!=gt_tl) divUse.appendChild(divBack); 

    addEl(divUse,'img',{id: 'imgUse', border: 0, 
    title: 'use in history\n[shift] add to history', src: imgUse}, 
    null,null);

    body.appendChild(divUse);
    }catch(e){console.log('use hist\n'+e)}
    return;
  }
  // inside page
  if(!isInited) {css(-1); isInited=true; }
	//remove div if exists
	if(divLookup)
		killId(divLookup);
	//div container
  p = belowCursor(evt,10,10);
	divLookup = buildEl('div', {id:'divLookup', style: 'z-index:100000'+
   ';border: none;' +
   ';top:'  + p.t  +';left:' + p.l  +';right:' + p.r  +';bottom: auto'
  }, null, null);

  iTo = getFlagSrc(GM_getValue('to'),'to');
  var iForw=buildEl('img', {'border':0, id:"imgLookForw", style: 'padding-left: 5px',
  src: iTo},  ['mouseover', lookup],null);
  var sl=GM_getValue('from','auto'),tl=GM_getValue('to','auto');
  iFrom = getFlagSrc(sl,'from');
  var iBack=buildEl('img', {'border':0, id:"imgLookBack",  style: 'padding-left: 5px',
  src: iFrom},
  ['mouseover', lookup], null); 
   
  if(p.r == 'auto' ){ // left half
	 divLookup.appendChild(iForw);
	 if(sl != 'auto' && (sl!=tl)) divLookup.appendChild(iBack);
  }else{ // right half
	 if(sl != 'auto' && (sl!=tl)) divLookup.appendChild(iBack);
	 divLookup.appendChild(iForw);
  }
  
	body.appendChild(divLookup);
}
function escCleanup(e){
	if(!e.shiftKey && !e.ctrlKey && !e.altKey && e.keyCode==27 ){
   cleanUp('esc'); 
   document.removeEventListener('keydown', escCleanup,false);
   escHnd=null;
  }
}

function lookup(evt,aS,aT){
 	var divResult = null;
	var divDic = getId('divDic');
	var divLookup = getId('divLookup');
	var top = divLookup.style.top;
 
	var left = divLookup.style.left;
	var rite = divLookup.style.right;
  var txtS = txtSel; // 2012-08-20
	if(evt) txtSel = getSelection(inTextArea? inTextArea: evt.target)+'';
  if(!txtSel) txtSel = txtS;
  if(txtSel.length>1024){  
   return;  
  }
	//exit if no text is selected
	if(!txtSel || txtSel==""){
    _log('L:notext')
		if(divDic)		{
			if(!clickedInsideID(evt.target,'divDic'))
				killId(divDic);
		}
		killId('divLookup');
		killId('divDic');
	
		return;
	}	
	//cleanup divs
	killId('divDic');
	killId('divLookup');
	//div container document.body.clientHeight/Width 
	divDic = buildEl('div', 
  {id:'divDic', style: 'top:'+top+';left:'+left+';right:'+rite+
   ';position:absolute!important;z-index:110000!important;'
  });
	divDic.addEventListener('mousedown', dragHandler, false);
  setEscHnd();
	body.appendChild(divDic);
  // patch gmail

  if(document.contentEditable)
    documentcontentEditable = document.contentEditable,
    document.contentEditable = false;
  if(document.designMode == 'on')
    documentdesignMode='on',
    document.designMode='off';

	//div result
	divResult = buildEl('div', 
  {id:'divResult'}, null, 'Loading...');
	divDic.appendChild(divResult);		
/**/ 
  // history
  var divBottom = buildEl('div',{id:'divBottom', align: 'bottom'},null,null);
	addEl(divBottom,'a', 
  {'class':"gootransbutt gootranslink gtlPassive", id:'historyLink', title: 'Translation history',  
   align: 'left', href:HREF_NO}, 
  ['click', history], 'History');
  
	addEl(divBottom,'a', 
  {'class':"gootransbutt gootranslink gtlPassive", id:'sourceLink', title: 'Source', href:HREF_NO}, 
  ['click', source],'Source');
  
	//options link
	addEl(divBottom,'a', 
  {'class':"gootransbutt gootranslink gtlPassive", id:'optionsLink', title: 'Settings', href:HREF_NO},
  ['click', options], 'Options');
  divDic.appendChild(divBottom);
/**/
	//lookup
		gt_sl = GM_getValue('from', 'auto');
		GT_tl = (gt_tl = GM_getValue('to',GT_tl));
    if( evt && evt.target.id== 'imgLookBack' ){
     var t=gt_tl; gt_tl=gt_sl; gt_sl=t;
    }
    if(aT){gt_tl=aT; gt_sl=aS;}
    gtRequest(txtSel,gt_sl,gt_tl);
}

var IFR;
function eStop(e){e.preventDefault(),e.stopPropagation()}
function openInFrame(url){
  killId('divTtsIfr');
  var dD=getId('divDic');
  var IFR=buildEl('div',{id:'divTtsIfr'},null,null);
  var IFH=addEl(IFR,'div',{id:'divTtsIfh'},null,null);
  addEl(IFH, 'span',{'class':"gootransbutt gootranslink",style: 'color:red!important;'},
  ['click', function(e){killId('divTtsIfr')}],'&#x2716;');
  addEl(IFH, 'a',{'class':"gootransbutt gootranslink", id: 'divTtsLnk',
  href: url, target:"_blank", title: 'play in tab'},
  ['click',
     function(e)
       {eStop(e);GM_openInTab(e.target.href)}
  ],
  '');
  addEl(IFH, 'span', {},[],deURI(url));
//  addEl(IFR, 'br');
  var BFR=
  addEl(IFR, 'iframe',{
  width: "100%", height: "48", frameborder: "0",scrolling:"auto", marginheight:"0", marginwidth:"0",
  style:'padding-top:3px;overflow-x:hidden;',
  src: 'about:blank'
  },
  null,null);
  insAfter(IFR,getId('divBottom'));
  BFR.contentWindow.location.href=url;
/*
*/
}
var soundSL=null,dictSL=null;
function ttsRequest(txt,t,e){
//
  txt=txt.split(' ').slice(0,19).join(' ');
  var tk=googleTK(txt,soundSL);
  soundSL=tk.SL;
  var etxt = escAp(txt);
    etxt=ttsURL + "&ie=utf-8&tl="	+ t + "&tk="+tk.tk+ "&q=" + etxt;
  _log('tts> '+etxt);
  if(e)
    GM_openInTab(etxt);
  else
    openInFrame(etxt);
  //GM_openInTab(etxt);
  // sorry, firefox' decodeAudioData() does NOT support mp3
}
//
function squashTxt(t,n){
  t=escAp(t); n=n || 10;
  t=t.split(/%20|\s|\.|;|,/).slice(0,n).join('%20');
  return t.substr(0,(n*110));
}
function stayOnTop(){  /*160901*/
 var divDic = getId('divDic');
 if(!divDic) return;
 var yo=parseInt(divDic.style.top); 
 if(divDic && (yo < pageYOffset)) {
   divDic.style.top=(pageYOffset+5)+'px';
}}

function gtRequest(txt,s,t){
  if( !wayBack[1] || (wayBack[1].t!=s || wayBack[1].t!=t || wayBack[1].txt!=txt))
   wayBack[0]=wayBack[1], wayBack[1]={txt:txt,s:s,t:t};
  var etxt = squashTxt(txt);

  etxt=GTurl + "#"	+ s + _l_ + t + _l_ + etxt;
  currentURL = etxt ;

  if(!divExtract){
    divExtract = '';
    Request(etxt);
  }else{
 	  extractResult(null);
  }
  last_sl = s; last_tl = t;
}
function Request(url,cb){
  var Url=url, meth=(1 && cb)? 'POST': 'GET'; 
  var Data='';
  var Hdr= {	    
        "User-Agent": UA 
       ,"Accept":  "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
       ,"Accept-Encoding":  "gzip, deflate"
       //,"Host": "www.google.com"
      }
  if(1 && cb){ 
    var Q=url.split('&q=');
    Url=Q[0];
    Data='&q='+Q[1];
    Hdr["Content-Length"]=Data.length+'';
    Hdr["Content-Type"]="application/x-www-form-urlencoded; charset=UTF-8"
  }

  GM_xmlhttpRequest({
			method: meth,
			url: Url,
      data: Data,
      headers: Hdr,
      synchronous: false, /* 17.11.30 */
			onload: function(resp) {
          if(cb)
           cb(resp.responseText)
          else
					 extractResult(resp.responseText);
        }
		});	
}

function quickLookup(){
  gt_sl=getId('optSelLangFrom').value;
  gt_tl=getId('optSelLangTo').value;
  GT_tl=gt_tl;
  saveIt();
  gtRequest(txtSel,gt_sl,gt_tl);
}
function histLookup(e){
  try{
  var txt=e.target.textContent, ix=-1;
                //.innerHTML?? 
  e.preventDefault();
  var ha = getTag('a',getId('divHist'));
//  ix=ha.indexOf(e.target);
/**/
  for(var i=0,l=ha.length; i<l; i++)
   if(e.target == ha[i]){ ix=i; break; }
/**/
  if(ix<0) return;
  if(e.ctrlKey && e.altKey){ //remove itemm
    if(ix==0) return;
    killId('divHist');
    ht.splice(ix,1);
    GM_setValue('hist',JSON.stringify(ht));
    history();
    return;
  }
  var lang = ht[ix][2].match(/([a-zA-Z-]+)[\|\/]([a-zA-Z-]+)/);
  gt_sl=lang[1]; gt_tl=lang[2];
  txtSelO=txtSel = txt; 
	getId('divResult').innerHTML = 'Loading...';
  gtRequest(txtSel,gt_sl,gt_tl);
  } catch(e){console.log('broken history\n'+e)}
}

function fastSwap(){
    if(gt_sl != 'auto' && gt_sl != gt_tl ){
    var t= gt_sl; gt_sl=gt_tl; gt_tl=t;
    gtRequest(txtSel,gt_sl,gt_tl);
    }
}

function badResponce(html,e){
 var dr=getId('divResult')
 dr.innerHTML = '';
 var br=addEl(dr,'a',{'class':'gootranslink'},null,'Bad Google response- '+(e?e:'?!1'));
 br.href=currentURL.substr(0,100);
 var m=html.match(/\<title\>[\s\S]*?\<\/title\>/);
 if(m && m[1])
  addEl(dr,'p',{},null,m[1]);
 //id="captcha"
 m=html.match(/(<img\s.*?\>)/);
 if(m && m[1])
  addEl(dr,'p',{},null,m[1]);
 //_log(html);
 return;
}
function goGoogle(e){
  e.preventDefault(), e.stopPropagation();
   var q=GTurl + "#"	+ last_sl + _l_ + last_tl + _l_ + squashTxt(txtSel,22);
 GM_openInTab(q);
}
function toggleFormat(e){
  e.preventDefault(), e.stopPropagation();
  formatted= !formatted;
  GM_setValue('formatted', formatted);
  gtRequest(formatted?txtSelO:txtSel,gt_sl,gt_tl);
}
var wayBack =[null,null];
function goBack(e){
  e.preventDefault(), e.stopPropagation();
  if(wayBack[0]){
   killId('divUse');
   gtRequest(txtSel=wayBack[0].txt,gt_sl=wayBack[0].s,gt_tl=wayBack[0].t);
  }
}

var ex_sl , ex_tl;
function extractResult(html){
 if(html){
	var html2 = html.match(/\<body[^\>]*\>([\s\S]+)\<\/body\>/);//[1];//select body content
  if(!html2){ // too many lettters!!!11
    badResponce(html);   return;
  }
  //-----------------------------------------------------------------------------------
	if(!TKK){ 
// tkk:'427857.2665959115'
// TKK='427882.1140482906'
 var res = /tkk\:'(.*?)'/.exec(html);
 if (!res) res=/TKK\='(.*?)'/.exec(html);

  if(res && res[1]) TKK=res[1];
	if (!TKK) {
/**** /
		var res2 = /var a=(.*?);.*?var b=(.*?);.*?return (\d+)/i.exec(res[1].replace(/\\x3d/g, '='));
		if (res2 != null) {
			TKK = Number(res2[3]) + '.' + (Number(res2[1]) + Number(res2[2]));
		}
/****/ 
/**** / 
  var iH=html;
  iH=iH.replace(/\</g,'&lt;').replace(/&/g,'&amp;');
  getId('divResult').innerHTML = '<pre>'+iH+'</pre>';
/****/
  }  }
  if(!TKK) {console.log("gttp: ERROR - can't get TKK!!!"); stopScript();}  
//  else console.log('TKK:'+TKK);

//-----------------------------------------------------------------------------------
	  html2 = html2[1].replace(/\<script[^\<]+\<\/script\>/g, '');//remove script tags...
	  killId('divExtract');
    divExtract = (new DOMParser()).parseFromString(html2, "text/html");
// !!!
    
    ex_sl= gt_sl, ex_tl=gt_tl;
  }
 //!!! try{ 	//gather info
// 2013-10-20
	var _sl = detectedLang(gt_sl);
	var _tl = detectedLang(gt_tl);
/* ?!11 150415  _log('**',_sl+'>'+_tl) */
    if( 1 || ex_sl !== gt_sl ) 
      gt_sl_gms = _sl, gt_tl_gms =_tl; 
    else 
      gt_sl_gms = _tl, gt_tl_gms = _sl; /* ?!11 */
  
  getId('divBottom').removeChild(getId('optionsLink'));
  var oL= buildEl('div', {id:'optionsLink', title: 'Settings', 'class':''},
  null, null);
  addEl(oL,'a',{id:'gtplaySrc','class':'gootransbutt gootranslink',  title: 'TTS '+gt_sl}, 
  ['mousedown', saySrc] ,  imgSay); 
  addEl(oL,'a',{id:'optionsFrom','class':'gootransbutt gootranslink'},  
  ['click', options],  gt_sl_gms +' '); 
  addEl(oL,'a',{id:'optionsFast','class':'gootransbutt gootranslink', 
  title: 'swap languages'}, ['click', fastSwap], imgSwap);
  addEl(oL,'a',{id:'optionsTo','class':'gootransbutt gootranslink ' + (getId('divOpt') ? 'gtlActive':'gtlPassive')},  
  ['click', options],  gt_tl_gms );
  addEl(oL,'a',{id:'gtplayDst','class':'gootransbutt gootranslink',  title: 'TTS '+gt_tl}, 
  ['mousedown', sayDst] ,  imgSaY); 
 // addEl(oL,'a',{id:'gtpsaySrc','class':'gootransbutt gootranslink'},  
 // ['click', sayDst] ,  imgSay); 
  if(wayBack[0])
   addEl(oL,'a',{id: 'gtpGoBack','class':'gootransbutt gootranslink',
   title: 'previous translation', style: 'margin-left:9px;'
   }, ['click', goBack], imgWayBack);
//  addEl(oL,'a',{id: 'gtpFormat','class':'gootransbutt gootranslink',
//  title: 'format on/off', style: 'margin-left:6px;'
//  }, ['click', toggleFormat], 
//  "<img border=0 style="+'"margin: 0 0 -3px 0;opacity:'+
//  (GM_getValue('formatted',false)?'1':'0.33')+'!important;"'+
//  "src='data:image/png;base64,"+imgFmt+"'>")
;
  addEl(oL,'a',{id: 'gtpGoogle','class':'gootransbutt gootranslink',
  title: GTurl+'#'+gt_sl + _l_ + gt_tl +'/ %s', style: 'margin-left:12px;'
  }, ['click', goGoogle], imgGoGo);
    
  getId('divBottom').appendChild(oL);
//!!!  }catch(e){ console.log('gather\n'+e); }
//	var translation = getXId("result_box").textContent;
// first run: resolve tl = auto
  if(GT_tl == 'auto')try{
    GT_tl=getXId("gt-tl").value;
  	if(GT_tl) GM_setValue('to', GT_tl);
    else GT_tl='en';
    gt_tl=GT_tl;
  }catch(e){console.log('auto?\n'+e)}

	//parse info 
  stayOnTop();
  var dR=getId('divResult');
  var tx='translating..';
 /* //!!!  
  try{
   tx=getXId("result_box").textContent

  }catch(e){tx=e;console.log("result_box\n"+e)} 
  */
	dR.innerHTML = '<div id=gdptrantxt>'+
  (tx||'Reading...') + '</div>';
 setTxtDir(dR,GT_tl);
  dict();
}
function setTxtDir(dR,tl){
  dR.style.textAlign = rtl_langs.indexOf(tl) < 0? 'left':'right';
  dR.style.direction = rtl_langs.indexOf(tl) < 0? 'ltr' :  'rtl';
  dR.lang=tl;
}
function getSelection(t){
	var txt = '';
	if (window.getSelection){
		txt = window.getSelection();
	}else if (document.getSelection)	{
		txt = document.getSelection();
	}else if (document.selection)	{
		txt = document.selection.createRange().text;
	}
  if(!t)
   t= document.activeElement;
  inTextArea= ( t&& t.type&&  (/^(text|search)/i).test(t.type)) ? t : null;
  if(inTextArea){ 
   txt=t.value.substr(t.selectionStart,t.selectionEnd-t.selectionStart);
  }
  txtSel=ltAmp(txt+'');
  txtSelO=txtSel;
	return txtSel;
}
function swapLang(){
    var to=getId('optSelLangTo').value,from=getId('optSelLangFrom').value;
//    if(from!='auto'){
		 getId('optSelLangTo').value = from;
		 getId('optSelLangFrom').value = to;
     quickLookup();
//    }
}

function saveIt(){
 var bs =getId('gtp-save');
 bs && (bs.className ='gootranslink goounsaved');
}

function options(evt){
	var dO = getId('divOpt');
	if(!dO){//show options
	 dO = buildEl('div', {id:'divOpt' });
   var oL=getId('optionsLink');
   oL.title='Hide settings';
   //
   var dA=getId('divHist');
   if(dA){
  	 insAfter(dO,dA);
   }else if(( dA=getId('divSourceshow')) ){
 		 insAfter(dO,dA);
   }else{
     insAfter(dO,getId('divResult'));
   }
		//from
    addEl(dO,'a',{'class':'gootransbutt gootranslink',
    target:'_blank', href:senoj, title: 'choose country flag icon'},
    ['click',function(e){
     e.preventDefault(); GM_openInTab(senoj); cleanUp(); return false;}], 
    imgH+imgFlags['AN']+imgT);
		addEl(dO,'span', null, null,' From: ');
    var gt_slist = getXId("gt-sl");
    gt_slist= gt_slist ? gt_slist.innerHTML+'' : languagesGoogle; 

    var oF =dO.appendChild(buildEl('select', {id:'optSelLangFrom'}, null, gt_slist));
		oF.value =  GM_getValue('from', "auto");
		oF.addEventListener('change', quickLookup, false);
    // swap
		addEl(dO,'span', null, null,'&nbsp');
		addEl(dO,'a', {id:'opSelectLangSwap',href:HREF_NO, 'class':"gootranslink",
    title:'Swap languages',}, ['click', swapLang], imgSwap);
		//to
		addEl(dO,'span', null, null,' To:');
    var gt_tlist = getXId("gt-tl");
    gt_tlist= gt_tlist ? gt_tlist.innerHTML+'' : languagesGoogle;
    var oT =dO.appendChild(buildEl('select', {id:'optSelLangTo'}, null, gt_tlist));
		oT.value = GM_getValue('to', "auto");
		oT.addEventListener('change', quickLookup, false);
		//use ctrl 
		addEl(dO,'br');
		addEl(dO,'span', null, null,'Use with: ');
		var d=addEl(dO,'input', {id:'checkCtrl', type:'checkbox'},
    ['change', saveIt],  null  );
		addEl(dO,'span', null, null,' Ctrl &nbsp;&nbsp; ');
		d.checked = GM_getValue('ctrl',false);
    // use alt
		d=addEl(dO,'input', {id:'checkAlt', type:'checkbox', 
    title:'using Alt is highly recommended'},
    ['change', saveIt],  null);
		addEl(dO,'span', null, 
    null,' Alt &nbsp;&nbsp;&nbsp; History:&nbsp;');
		d.checked = GM_getValue('alt',true);
//		history depth
		d=addEl(dO,'input', {id:'histSize', type:'textbox',  maxlength: 2,
    style: "width:2em; ", title: "set to 0 to clear history"});
		addEl(dO,'span', null, null,' items &nbsp; of ');
		d.value = maxHT;
// max # words in phrase 
		d=addEl(dO,'input', {id:'histWc', type:'textbox',  maxlength: 1,
    style: "width:1em; ", title: "max # of words in phrase"});
		addEl(dO,'span', null, null,' words');
		d.value = maxWC;
		//save
    var oS=
		addEl(dO,'span', {id:'gtp-save', 'class':'gootranslink gootransbutt',
    title: "save changes"}, 
    ['click', saveOptions], 'save');
    if(!GM_getValue('from'))
      saveIt();
// source box params
		addEl(dO,'br');
		addEl(dO,'span', null, null,'Source box: &nbsp;');
		d=addEl(dO,'input', {id:'sourceBH', type:'textbox',  maxlength: 1,
    style: "width:1em; ", title: "box height"});
    d.value = sourceBH;

		addEl(dO,'span', null, null,' height &nbsp; ');

		d=addEl(dO,'input', {id:'sourceDP', type:'textbox',  maxlength: 2,
    style: "width:2em; ", title: "# of lines to keep"});
		addEl(dO,'span', null, null,' depth &nbsp; ');
    d.value = sourceDP;

		addEl(dO,'span', null, null," No flags:");
		d=addEl(dO,'input', {id:'checkNoflags', type:'checkbox',
    title: "don't show country flag icons"});
    d.checked = GM_getValue('noFlags');
// colours
    for(var b,li=BG.C.length,ii=0;ii<li;ii++){
		 b=addEl(dO,'span',{'class':'gtBGColor', title:BG.t[ii],
     style: 'background:'+ BG.C[ii]+'!important;' +
     (ii==0?'margin-left:6px' :'')
     }, null,'&nbsp;');
     b.paletteN=ii;
     b.addEventListener('click',bgClick,false); 
    }
    /* 160826 */
    b=addEl(dO,'label');
    d=addEl(b,'input',{id:"gtpwPos", type:"checkbox", style:"display:none"},['change', 
    function(e){GM_setValue('gtpwPos',e.target.checked)}], null);
    addEl(b,'span',{'class':"gtptogl",title:"position of tooltip window"});
    d.checked=GM_getValue('gtpwPos',false);
    getId('optionsTo').className='gootransbutt gootranslink gtlActive';
		//cancel
	}
	else{//hide options
		killId(dO);
    getId('optionsLink').title = 'Settings';
    var oTL = getId('optionsTo');
    oTL.className='gootransbutt gootranslink gtlPassive';
	}
}
function showTrans(){
try{ 
 var hOs = GM_getValue('showTrans',false) !== true;
 var shhi = hOs?'gtp-trans gtp-block':'gtp-trans gtp-hide';
 var tds= document.getElementsByClassName('gtp-trans');
 for(var i=0, il=tds.length; i<il; i++){
  tds[i].className=shhi;
 }
 getId('gtp_transOnOff').innerHTML = hOs?"&laquo;&laquo;":"&raquo;&raquo;";
 GM_setValue('showTrans',hOs)
} catch(e){console.log('showTrans\n'+e)}
}

function detectedLang(da){
 if(!da) return '';
 var gt_slist = getXId("gt-sl");

 gt_slist= gt_slist ? gt_slist.innerHTML+'' : languagesGoogle;
 var re= new RegExp('ion value="'+da+'">(.*?)<\/opt');
 var ma= gt_slist.match(re);
 if(ma && ma[1]) return ma[1]; return da;
}
var txr;
function ltAmp(s){ 
//s=s.replace(/\s(\s*)/g,'\n$1');
return trim(s.replace(/&/g,'\u00E6').replace(/</g,'\u227A').replace(/\+/g,'\u271B')); 
}
function altListClick(e){
 e.preventDefault, e.stopPropagation;
 var t=e.target;
 if(t.nodeName && t.nodeName==='LI') try{
  var o=outerNode(t,'SPAN').childNodes[0];
  if(o.textContent==t.textContent) return;
  o.textContent=t.textContent;
  // addSource??? addHist???
  var a=outerNode(o,'DIV').getElementsByTagName('I');
  txr=''; 
  for(var i=0,il=a.length;i<il;i++)
    txr+=(i?' ':'')+a[i].textContent;
 }catch(e){console.warn('aLC err:\n'+e);}
}
function txtClip(e){
  if(txr) GM_setClipboard(txr);
}
function extractDict(txt){

var i,j,k,il,jl,kl,tr,sr,tx,sx,sp;
try{
 if(!txt) return;
 if(txt.substr(0,1) !== '[')
   throw 'Bad Google responce!!1' +'\n' +txt.substr(0,15);
 txt=txt.replace(/,(?=,)/g,',""');
 txt=txt.replace(/\[(?=,)/g,'[""');
 var dA=JSON.parse(txt);
 var dL='';
 var punctRE=/^[\s\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]+$/;
//translation
 var A= dA[5];
 sp='',sx='', tx='', txr="", tr="";
 formatted=GM_getValue('formatted',true);
 try{ 
 if(A) {
  // console.log(JSON.stringify(A));
 for( j=0,jl=A.length; j<jl; j++){
     if( !A[j][2] || !A[j][2][0] ){
      tr+=A[j][0].replace('\n','<br>').replace('\s','&nbsp;');
     continue;
     }
    tx=A[j][2][0][0],sx=A[j][0];
    if((kl=A[j][2].length)<1) throw 'No Datta!!1';
//    tx=ltAmp(tx);  sx=ltAmp(tx);
    txr+=sp+tx;
    if(kl==1 && punctRE.test(tx)){
     tr+=sp+'<i>'+tx+'</i> ';
    }else{
     tr+=sp+'<span><i>'+tx+'</i><ul>'; 
     for( k=1; k<kl; k++){
      tr+='<li>'+ A[j][2][k][0]+'</li>';
     }
     tr+='<li>'+ tx + '</li><li class=gtpcmmt>'+sx+'</l></ul></span> ';
     sp=' ';
 }} //for

 } 
  else // !A
   tr=txr=dA[0][0][0];
  }catch(e){console.warn(e+'\nBAD RESP\n'+txt); throw 'BAD RESP!!1';};
  
  var puRE=/\s+([.,?!;:])/g;
  if(!formatted)
    tr=tr.replace(puRE,"$1"),
    txr=txr.replace(puRE,"$1"); 
  if(!txr) { getId('divResult').innerHTML='Google returns nothing!'; return; }
  var dR=getId('divResult');
  dR.childNodes[0].innerHTML=tr;
  dR.childNodes[0].addEventListener('click',altListClick,false);
  var LtR=rtl_langs.indexOf(gt_tl)<0;
  dR.style.textAlign = LtR? 'left':'right';
  dR.style.direction = LtR? 'ltr' :  'rtl';
  dR.lang=GT_tl;
  addHistory(txtSel,txr);
  killId('gtptxtClip');
  addEl(getId('divDic'),'img',
  {id:'gtptxtClip',src: imgClip,'class': 'gootransbutt', style:
  'position:absolute;right:1px;top:0;cursor:pointer',
  title: 'copy translation','z-index':'100505'
  },
  ['click',txtClip],'');
  
// detected lang
  
 if(gt_sl=='auto' && dA[2] && (autoLang=dA[2])){
   var oF = getId("optionsFrom");
   oF.textContent= oF.textContent+' - '+detectedLang(dA[2]) +' ';
  }
  var da,db, dc, dfn, t;
  if(dA && dA[1] && dA[1][0]) 
    da=dA[1];
  else if(dA && dA[12] && dA[12][0])
    da=dA[12],dfn=1,db=dA[11];
  if(da){
     dL=buildEl('div',{id: 'gtp_dict'});
     var dT=addEl(dL,'table');
     var dB=addEl(dT,'tbody');
     var showT = 'gtp-trans gtp-hide',showI = "&raquo;&raquo;"
     if(GM_getValue('showTrans',false) === true)
      showT = 'gtp-trans gtp-block', showI = "&laquo;&laquo;"
    var trs = dA[0][1];
    if(trs && trs[3]){
     trs = trs[3] + (trs[2]? '&nbsp; &#x25B9; ' + trs[2]: '');
       tr=addEl(dB,'tr');
       addEl(tr,'td',{'class': 'gtp-pos gtp-trs', colspan:2}, null, trs);
    }
     for( i=0,il=da.length; i<il; i++){
       tr=addEl(dB,'tr');
       addEl(tr,'td',{'class': 'gtp-pos', colspan:2}, null, da[i][0]);
       var d2=dfn? da[i][1]: da[i][2];
       for(var td,j=0,jl=d2.length; j<jl; j++){
        td=addEl(dB,'tr');
        var d2t=d2[j][0];
        if(dfn && d2[j][2]) d2t+='<br><i>"'+d2[j][2]+'"</i>';

//        if(j==0&&dfn&&(t=db[i])&&(t=t[1])&&(t=t[0])&&(t=t[0])&&t[0])// && dc[1][0])
        if(dfn && db && (t=db[i])&&(t=t[1])&&(t=t[j])&&(t=t[0])&&t[0])// && dc[1][0])
          d2t+='<br><i><span>synonyms:</span> '+t.join(", ")+'</i>';         
          addEl(td,'td',{'class': 'gtp-word'}, null, d2t);
        !dfn && d2[j][1] &&
        addEl(td,'td',{'class': showT}, null, d2[j][1].join(', '));
       }
     }
     var gtdir = (getId('divResult').style.direction=='rtl') ? 'left' : 'right';
     addEl(dL,'a',{'class': 'gootransbutt gootranslink', id: 'gtp_transOnOff',
       style: 'position: absolute; top: -.5em; '+gtdir+': 1px;'
       },['click', showTrans],showI);
      killId('gtp_dict');
     if(dL) getId('divResult').appendChild(dL);
  }

  killId('divSourceshow');
  killId('divHist');

  if(GM_getValue('sourceShow',true))
     source();
  if(GM_getValue('histShow',false))
     history();
  if(!GM_getValue('histWc') && !getId('divOpt')) // no settings?
     options(); // show options
     
} catch(e){   console.warn('errexDict: '+e+'\n');   badResponce(txt,e);}
}
/** /
function encode_utf8(s) {
  return unescape(encodeURIComponent(s));
}
function decode_utf8(s) {
  return decodeURIComponent(escape(s));
}
/**/
function onTimerDict(){
 formatted=GM_getValue("formatted",false);
 var tx=txtSel,
 tk=googleTK(tx,dictSL);
 dictSL=tk.SL; 
 _i("_tk_\n"+tk.tk);
 var q = dictURL + 
 "&hl="+ GM_getValue('to','auto') + 
 "&sl=" + gt_sl + "&tl=" + gt_tl + 
"&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&ssel=5&tsel=5&kc=1"+
 "&tk="+tk.tk+
 "&q="+ encodeURIComponent(tx);
 _log('?dict\n'+q);
 Request(q, extractDict);
}

function dict(){
// var dR=getId('divResult');
    killId('gtp_dict');
//    var dD=buildEl('div',{id:"gtp_dict"},null,dict)
//    dR.appendChild(dD);
    setZeroTimeout(onTimerDict);
}

function saveSource(){
  try{
  sT = getId('divSourcetext').value;
  GM_setValue('sourceText',JSON.stringify(sT));
  }catch(e){console.log('saveSource\n'+e)}
}

function source(){
 var divSource = getId('divSourceshow');
 try{
 if(divSource){
   killId(divSource);
   var sL = getId('sourceLink');
   sL.innerHTML = 'Source';
   sL.className = 'gootransbutt gootranslink gtlPassive'
   sL.title = 'Show source';
   killId('imgSourcesave');
   GM_setValue('sourceShow',false);
   return;
 }
 GM_setValue('sourceShow',true);
 divSource= buildEl('form', {id:'divSourceshow'}, null, null);

 var tS= txtSel + ' \u2192 ' + trim(txr);
 if(sT){
  var sTa= sT.split('\n'); 
  if(tS != sTa[0]){
   while(sTa.length >= sourceDP) sTa.pop(); 
   sT=  tS + '\n' + sTa.join('\n');
  }
 }else sT=tS;
 if(!getId('imgSourcesave'))
 insAfter(
  buildEl('img',{id: 'imgSourcesave', title: 'save source', src: imgSave,
  style: 'margin-bottom: -3px;'},  
  ['click', saveSource], null)
  ,getId('sourceLink'));
 addEl(divSource,'textarea', 
 { id:'divSourcetext', rows: sourceDP, 
  style: "font-family: Tahoma,sans-serif !important; height:"
         +(sourceBH+1)+"em;"
 }, null, sT),
 getId('divBottom');
 sL=getId('sourceLink');
 sL.innerHTML = 'Source';
 sL.className= 'gootransbutt gootranslink gtlActive';
 sL.title = 'Hide source';
 
 }catch(e){console.log('Sourceshow\n'+e)};
 insAfter(divSource,getId('divResult'));
}
// ht: [from, to, langpair, hitCount]

function history(){
 var divHist = getId('divHist');
 try{
 if(divHist){
   killId(divHist);
   var hL = getId('historyLink');
   hL.innerHTML = 'History'; hL.className= 'gootransbutt gootranslink gtlPassive';
   hL.title = 'Translation history';
   GM_setValue('histShow',false);
   return;
 }
  if(!maxHT) return;
  GM_setValue('histShow',true);
	divHist = buildEl('div', {id:'divHist'},['click', histLookup], null );
//	
  for(var i=0, l=ht.length; i<l; i++){
    var bkg = ht[i][0].indexOf(' ')>0 ? ' goohistlink' : '';
    addEl(divHist,'a', {href:HREF_NO, 'class': 'gootranslink'+bkg, 'titel': ht[i][1]+
    ((ht[i][3]>1) ? '\u00A0'+ '['+ht[i][3]+']' : '')},
    null, ht[i][0]);
    if(i < l-1)
    divHist.appendChild(document.createTextNode(' '));
  }
	//addEl(divHist,'span',null,null,'<br>&nbsp;');
  if(getId('divSourceshow'))
   insAfter(divHist,getId('divSourceshow'));
  else
   insAfter(divHist,getId('divResult'));
  hL=getId('historyLink')
//  hl.textContent = 'X';
  hL.title= 'Hide history';
  hL.innerHTML = 'History'; hL.className = 'gootransbutt gootranslink gtlActive';
  }catch(e){console.log('hist problem\n'+e)}
}

function saveOptions(evt){
  try{
	var from = getId('optSelLangFrom').value;
	var to = getId('optSelLangTo').value;
	var ctrl = getId('checkCtrl').checked;
	var alt = getId('checkAlt').checked;
  var mh = parseInt(getId('histSize').value);
  var wc = parseInt(getId('histWc').value);
  var nf = getId('checkNoflags').checked;
  if(0<= mh && mh <=99 && mh<maxHT){
    while(ht && ht.length>mh)  ht.pop();
    GM_setValue('hist',ht? JSON.stringify(ht):'');
    if(getId('divHist')){
     killId('divHist');
     history();
    }
  }
  maxHT=mh;
  var bh = parseInt(getId('sourceBH').value);
  if( 0< bh && bh <10) sourceBH = bh;
  var dp = parseInt(getId('sourceDP').value);
  if( 0< dp && dp <100) sourceDP = dp;
  if(1<= wc && wc <=9) maxWC=wc;
  GM_setValue('histSize',maxHT)
  GM_setValue('histWc',maxWC);
	GM_setValue('from', from);
	GM_setValue('to', to);
	GM_setValue('ctrl', Gctrl=ctrl);
	GM_setValue('alt', Galt=alt);
	GM_setValue('sourceBH', sourceBH);
	GM_setValue('sourceDP', sourceDP);
  GM_setValue('noFlags',nf);
	getId('divDic').removeChild(getId('divOpt'));
	getId('optionsLink').title='Settings';
  return;
  }catch(e){console.log('saveOpnions\n'+e);}
}

function addHistory(src,trt){
 if (!maxHT) return;
 try{
 var hts=GM_getValue("hist");
 if( !hts ){
   ht=[["google translator","Der Ubersetzer","en|de",0]];
   hts=JSON.stringify(ht);
 }
 ht=JSON.parse(hts);
 var st=trim(src+''); var tt = trim(trt+'');
 var wc = (st.split(' ')).length;
 if(wc>maxWC) return;
 //var lang=currentURL.match(/langpair=([a-zA-Z-\|]+)/)[1];
  var lang=last_sl+_l_+last_tl;
  var ix=-1;  // find word in hist
 for(var i=0, l=ht.length; i<l; i++)
    if(st==ht[i][0]){ ix=i; break; }
 //if(ix==0) return; // nothing to do
 var hits=0;
 if(ix>=0){
  hits=ht[ix][3];
  if( (gt_sl+'|'+gt_tl) == ht[ix][2] && tt != ht[ix][1]) {
   tt = ht[ix][1]; // don't touch my translasion
  }
  ht.splice(ix,1);
 }
// if(hits<4) 
 hits++; // delete it by your own hands
 if (ht.length>maxHT){
  var minHit=99999; // which item shoud i remove?
  for(i=ht.length-1;i>0;i--)
   if(minHit>ht[i][3]) minHit=ht[i][3]
  ix=ht.length-1;
  for(var i=ix; i>0; i--)
   if(minHit==ht[i][3]){  ix=i; break; }
  ht.splice(ix,1);
 }
 ht.unshift([st,tt,lang,hits]);
 GM_setValue('hist',JSON.stringify(ht));
 } catch(e){console.log('addHist\n'+e);}
}
var senFlag = '';
function selFlag(e){
 if(!isInited) {css(-1); isInited=true; }
 killId('divSelflag');
 setEscHnd();
 var p = belowCursor(e,10,10);
 var dsf = buildEl('div',{id:'divSelflag', style:
  ';top:'+p.t+';left:'+p.l+';right:'+p.r  +';bottom: auto'});
 var sel=addEl(dsf,'select',{id: 'optSelFlag'},
 null,languagesGoogle);
 sel.value = GM_getValue('to',' en');
 addEl(dsf,'span',null,null,'<br><br>');
 addEl(dsf,'a', {href:HREF_NO, style:'padding: 3px 12px; margin-right: 2em;',
 'class':'gootransbutt gootranslink', title: "use icon"},
 ['click',  function(){saveFlag(true)}], '<b>OK</b>');
 addEl(dsf,'a', {href:HREF_NO,  style:'padding: 3px 4px;',
 'class':'gootransbutt gootranslink'},  
 ['click', function(){saveFlag(false)}], 
 '<b>Cancel</b>');
 //
  senFlag = e.target.src+'';
  var sm = senFlag.match(/.+\/(.+)\.png/);
  if(sm && sm[1]) senFlag= sm[1];
  _log(senFlag);
	if(senFlag) body.appendChild(dsf);
}
function saveFlag(tf){
 if(tf && senFlag){
   var s= 'l-'+getId('optSelFlag').value;
   GM_setValue(s,senFlag);
   _log(s+': '+senFlag );
 }else _log('cant save flags' );
 killId('divSelflag'); return;
}
var fCSS;
function flagClick(e){
 e.preventDefault();
 if(e.target.nodeName == 'IMG'){
  _log('hit on: ' + e.target.alt);
  selFlag(e);
 }else (killId('divSelflag'));
}
function belowCursor(evt,ho,vo,lr){
  var p={t:'', l:'auto', r:'auto'};
  p.t=(evt.clientY+window.pageYOffset+vo)+'px';
  var l=(evt.clientX+window.pageXOffset+ho)+'px';
  if(lr && lr=='r')
  { p.l=l; return  p; }
  var w = window.innerWidth;
  var r=(w-(evt.clientX+window.pageXOffset)+ho);
// Q: How to detect visibility & thickess of vertical scrollbar?
  r-=8; // 
  if(r<0) r= w/4;
  r+='px';
  if(lr && lr=='l')
  { p.r=r; return  p; }
  if(evt.clientX < w/2)
   p.l=l;
  else
   p.r=r;
  return p;
}
var flagLang;
function getFlagSrc(lng, where){
  if(!where) where = 'to';
  if(GM_getValue('noFlags')) return imgFlags[where];
  var fl='l-'+lng;
  var flag = GM_getValue(fl,'');
  if(!flag){
    flag=imgFlags[lng];
    if(!flag) return flag = imgFlags[where];
  }
  if(flag.indexOf('http')==0
   //flag.indexOf('file') ==0
   ||flag.indexOf('data:') ==0)
   return flag;
  flagLang=fl;
//  flag= 'http .. /Flags/Panama.png;'
  flag=  senop+seno+flag+senoext;
  flagRequest(flag);
  return flag;
}
function flagRequest(f){
 _log('load '+f);
 GM_xmlhttpRequest({
	method: 'GET',
	url: f,
  //binary: true,
  overrideMimeType: "text/plain; charset=x-user-defined",
  synchronous: false, /* 17.11.30 */
  headers: {	    
    "User-Agent": UA
   ,"Accept":  "image/png,image/*;q=0.8,*/*;q=0.5"
   ,"Accept-Encoding":  "gzip, deflate"
  },
	onload: function(resp) {
		try{
       flagStore(resp.responseText,f);
		}catch(e){console.log('FlagRqst\n'+e);}
	}
 });	
}
function flagStore(r,url){
 if(r.indexOf("<head")>=0)
  {
   console.log("Banned!\n"+url);
   GM_setValue(flagLang,url);
  }
 else
  GM_setValue(flagLang,"data:image/png;base64," + b2b64(r));
}

function trim(s){
 return (txtSelO=s+'').replace(/\s+/g,' ').replace(/^\s/,'').replace(/\s$/,'');
}

function killId(nod){
 if(!nod) return;
 var n = nod;
 if(typeof n == 'string'){
  n= getId(nod); 
 }
 if(!n) return;
 if(n.parentNode) n.parentNode.removeChild(n);
 else  _log('cant kill: '+nod)
}

function addEl(to,type, attrArray, eL, html){
 return to.appendChild(buildEl(type, attrArray, eL, html));
}

function buildEl(type, attrArray, eL, html)
{
	var node = document.createElement(type);
	for (var attr in attrArray) if (attrArray.hasOwnProperty(attr)){
		node.setAttribute(attr, attrArray[attr]);
	}
	if(eL){
		node.addEventListener(eL[0], eL[1], eL[2]?true:false);
	} 
	if(html) 
		node.innerHTML = html;
	return node;
}

function getId(id, parent){
  if(!parent)
		return document.getElementById(id);
	return parent.getElementById(id);	
}

/* */
function getXId(id){
   var r=divExtract.getElementById(id);
   if(r) return r;
   // console.log("no ID: "+ id); // !!!
   // throw "Xel bug " + id; // !!!
   return null;
}

function getTag(name, parent){
	if(!parent)
		return window.document.getElementsByTagName(name);
	return parent.getElementsByTagName(name);
}
/*
 * Drag and drop support adapted fom http://www.hunlock.com/blogs/Javascript_Drag_and_Drop
 */
var savedTarget=null;                           // The target layer (effectively vidPane)
var orgCursor=null;                             // The original mouse style so we can restore it
var dragOK=false;                               // True if we're allowed to move the element under mouse
var dragXoffset=0;                              // How much we've moved the element on the horozontal
var dragYoffset=0;                              // How much we've moved the element on the verticle
var didDrag=false;								//set to true when we do a drag
var dragX, dragY;
function moveHandler(e){
	if (e == null) return;// { e = window.event } 
	if ( e.button<=1 && dragOK ){ var x,y;
		savedTarget.style.left = (x=e.clientX - dragXoffset) + 'px';
		savedTarget.style.top = (y=e.clientY - dragYoffset) + 'px';
    dragX=x-pageXOffset;
    dragY=y-pageYOffset; if(dragY<=0)dragY=0;
		return false;
	}
}
function dragCleanup(e) {
	document.removeEventListener('mousemove',moveHandler,false);
	document.removeEventListener('mouseup',dragCleanup,false);
	savedTarget.style.cursor=orgCursor;
	dragOK=false; //its been dragged now
	didDrag=true;
}
function dragHandler(e){
	var htype=moz+'grabbing';
	if (e == null) return;//
	var target = e.target;// != null ? e.target : e.srcElement;
	orgCursor=target.style.cursor;
	if(target.nodeName!='DIV' )	
 	 return;
  if( e.ctrlKey || e.altKey || e.shiftKey)
    return; // enable selection inside
	else if(clickedInsideID(target, res_dict))
		return;
	if (target = clickedInsideID(target, 'divDic')) {
		savedTarget=target;       
		target.style.cursor=htype;
		dragOK=true;
		dragXoffset = e.clientX-target.offsetLeft;
		dragYoffset = e.clientY-target.offsetTop;
		//set the left before removing the right
		target.style.left = e.clientX - dragXoffset + 'px';
		target.style.right = null;
		document.addEventListener('mousemove',moveHandler,false);
		document.addEventListener('mouseup',dragCleanup,false);
		return false;
	}
}
function clickedInsideID(target, id) {
	if (target.getAttribute('id')==id)
		return target;
	if (target.parentNode) {
		while (target = target.parentNode) {
			try{
				if (target.getAttribute('id')==id)
					return target;
			}catch(e){}
		}
	}
	return null;
}
//end drag code
function b2b64(inp) { // binary data --> base64
  var output = [], c1, c2, c3, e1, e2, e3, e4, i = 0;
  var k="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var len = inp.length;
  while( i < len ){
    c1 = inp.charCodeAt(i++); c2 = inp.charCodeAt(i++); c3 = inp.charCodeAt(i++);
    e1 = (c1&255) >> 2; 
    e2 = ((c1 & 3) << 4) | ((c2&255) >> 4);
    e3 = ((c2 & 15) << 2) | ((c3&255) >> 6);  
    e4 = c3 & 63;
    if( isNaN(c3)) e4 = 64;
    if( isNaN(c2)) e3 = 64;
    output.push( k.charAt(e1) + k.charAt(e2) + k.charAt(e3) + k.charAt(e4));
  }  return output.join("");
}


function ttrans( s, ttab ){
  for( var c, cc, t='', il=s.length, i=0; i<il; i++ )
    t += (c=ttab[cc=s.charAt(i)]) ? c : cc;
  return t;
}
//var tabUrlEsc = { '#':'%23', '%':'%25', '&':'%26', '.':'%2e', '/':'%2f', '?':'%3f' };
function escAp(s){
 return encodeURI(s);
 //return ttrans( s, tabUrlEsc );
}
// &tk=[
function googleTK(text, SL) {
	// view-source:https://translate.google.com/translate/releases/twsfe_w_20151214_RC03/r/js/desktop_module_main.js && TKK from HTML
	var uM = TKK ; // 160513 '406423.4167013162'; //
	var cb="&";
	var k="";
	var Gf="=";
	var Vb="+-a^+6";
	var t="a";
	var Yb="+";
	var Zb="+-3^+b+-f";
	var jd=".";
	var sM=function(a){return function(){return a}}
	var tM=function(a,b){for(var c=0;c<b.length-2;c+=3){var d=b.charAt(c+2),d=d>=t?d.charCodeAt(0)-87:Number(d),d=b.charAt(c+1)==Yb?a>>>d:a<<d;a=b.charAt(c)==Yb?a+d&4294967295:a^d}return a};
	var vM=function(a){
		var b;
		if(null!==uM) {
			b=uM; 
		}else{
			b=sM(String.fromCharCode(84));var c=sM(String.fromCharCode(75));b=[b(),b()];
			b[1]=c();
			b=(uM=window[b.join(c())]||k)||k
		}
		var d=sM(String.fromCharCode(116)),c=sM(String.fromCharCode(107)),d=[d(),d()];
		d[1]=c();
		c=cb+d.join(k)+Gf;
		d=b.split(jd);
		b=Number(d[0])||0;
	
		for(var e=[],f=0,g=0;g<a.length;g++){
			var m=a.charCodeAt(g);
			128>m?e[f++]=m:(2048>m?e[f++]=m>>6|192:(55296==(m&64512)&&g+1<a.length&&56320==(a.charCodeAt(g+1)&64512)?(m=65536+((m&1023)<<10)+(a.charCodeAt(++g)&1023),e[f++]=m>>18|240,e[f++]=m>>12&63|128):e[f++]=m>>12|224,e[f++]=m>>6&63|128),e[f++]=m&63|128)
		}
		a=b||0;
		for(f=0;f<e.length;f++) { a+=e[f],a=tM(a,Vb)};
		a=tM(a,Zb);
		a^=Number(d[1])||0;
		0>a&&(a=(a&2147483647)+2147483648);
		a%=1E6;
//		return c+(a.toString()+jd+(a^b))
		return a.toString()+jd+(a^b);
	};

	return { 'tk' : vM(text), 'SL' : uM };
}
// ]&tk=
function stickStyle(css){
 var s=document.createElement("style"); s.type="text/css";
 s.appendChild(document.createTextNode(css));
 return (document.head||document.documentElement).appendChild(s);
}
function css(n){
  var k,i=0;
  _log('cssN:',n);
  if(-1 === n){ try{ 
    k= +(GM_getValue('backG',0)); 
    if(0<=k && k< BG.C.length) i=k;
  } catch(e){};}
  else GM_setValue('backG', +(i=+n) );
  try{
    if(window.gttpCSS) window.gttpCSS.parentNode.removeChild(window.gttpCSS);
  }catch(e){console.log('cssX:\n'+e)};
  _log('cssS:'+i,BG.C[i]);
  window.gttpCSS=
stickStyle(
'#divDic, #divDic div, #divDic span, #divDic a, #divDic img, #divLookup, #divUse  {padding: 0; margin:0; \
width: auto;height: auto; border: none; border-radius: 0; background: none; box-shadow: none\}'+
'#divResult {overflow: visible !important; padding:3px !important; margin: 0 5px 3px 0 !important; '+
'position: relative; z-index: auto !important;}'+
'#gtp_dict {max-height: 480px !important; overflow: auto !important;}'+
'#divResult table *{ line-height: 1 !important}'+
'#divDic, #divDic *, #divSelflag, #divSelflag *{\
font-family: Tahoma, sans-serif!important;\
font-size:medium!important;\
font-style: normal!important;\
font-weight: normal!important;\
font-stretch: normal!important;\
letter-spacing: normal!important;\
line-height: 1.1;\
color:'+FG.t[i]+'\
}'+
'#divDic,#divSelflag {position: absolute; background:'+BG.C[i]+'!important; color:'+FG.t[i]+
'!important; opacity: 1'+
';padding:5px !important; margin:0; border-radius:5px; border: thin solid  gray'+
';text-align: left !important;}'+
'#divDic{ max-width:50%; padding: 3px; margin: 0;}'+
'#divSelflag{ max-width: 180px; }'+
'.gootranslink, #divDic .gootranslink ,#divSelflag .gootranslink\
{color:'+FG.l[i]+'!important; text-decoration: none !important;\
font: normal medium Tahoma,sans-serif !important;'+
'cursor:pointer !important; }'  +  
'#divDic a.gootranslink:visited,\
 #divDic a.gootranslink:hover,\
 #divDic a.gootranslink:active\
 {color:'+FG.l[i]+'!important; text-decoration: none !important;}' +
'#gtp_dict table{background:'+BG.C[i]+'!important;}'+
'#gtp_dict tbody {background: transparent !important;}'+
'#gtp_dict tr {background:'+BG.H[i]+'!important;line-height:1;}'+
'#gtp_dict tr>td{font-size:1em !important; line-height:1!important;\
 background:transparent!important;'+
'}'+
'#divDic a.goohistlink {background:'+BG.F[i] +'!important;}'+
'#gtp_dict {margin: 0; position: relative;}'+
'#gtp_dict ol {padding: 0 .5em 0 0; margin-left: 0.2em;}'+
'#gtp_dict li {list-style: square inside; display: list-item;}'+
'div#gtp_dict tr>td {padding-left: .25em; vertical-align:top; border: none; color:'+FG.t[i]+'!important; }'+
'#optSelLangFrom,#optSelLangTo {max-width: 150px; text-align: left !important; \
height:1.5em!important; min-height:1.5em!important;\
}'+
'#divDic input, #divDic select, #divDic img {vertical-align: baseline !important;}'+
'#divDic input[type="checkbox"]{vertical-align: text-bottom !important;}'+
'#divOpt span {color:'+FG.t[i]+'!important;}'+
'#optSelLangFrom,#optSelLangTo,#divDic input[type="textbox"]{background:'+BG.E[i]+'!important;\
color:'+FG.t[i]+'!important;\
}'+
'#divExtract{word-spacing: normal !important;}'+
'#divBottom {position: relative; width: 100%; font-size:medium; text-decoration:none; }'+    
'#divBottom #historyLink {display: inline; position: relative; font-size:medium; text-decoration:none;}'+
'#divBottom #sourceLink {display: inline; position: relative; margin-left: .5em;  font-size:medium; text-decoration:none;}'+
'#divBottom #imgSourcesave {display: inline; position: relative; margin-left:2px;\
cursor:pointer;}'+
'#divBottom #optionsLink {display: inline; position: relative; margin-left: 1em; font-size:medium !important; text-decoration:none !important;}'+
'#divBottom #optionsLink [id^="options"] {margin-right: 2px; padding-left: 2px;}'+
'#divDic #divOpt {position: relative; padding: 5px;'+
'border-top: thin solid grey!important;}'+ 
'#divLookup, #divOpt, #divBottom,#divSourcetext,#divHist,#divuse {direction: ltr !important;}'+
'#divDic #divHist {background:'+BG.C[i]+'!important;; position:relative; padding:5px; text-align:left !important;'+
'border-top: thin solid grey!important; color:'+FG.t[i]+'!important;}'+ 
'#divResult #gtp_dict {background:'+BG.C[i]+'!important;color:'+FG.t[i]+'!important;\
 padding:3px!important; border-radius:3px;'+
'margin-bottom: .1em!important; overflow-y:auto !important; overflow-x:hidden; font-size:medium;}'+
'#divDic #divOpt {background:'+BG.C[i]+'!important; position:relative; padding:5px; text-align:left !important;}'+
'#divLookup, #divUse {background-color:transparent !important; position:absolute;\
 padding: 3px; margin: 0;}'+
'#divDic>#divSourceshow {\
border: none; padding: 0 0 4px 0; margin: 0;}'+
'#divSourceshow>#divSourcetext{ width:97%; height: 3em; line-height: 1.2; overflow: auto !important;\
padding: 0 0 0 4px; margin: 0; border: none; border-top: 1px solid #AAA}' + 
'.gtlPassive:before{ content:"\u2193";}'+
'.gtlActive:before{ content:"\u2191" !important;}'+
'#imgUse, #divGetback, #divGetforw {margin-left: 5px !important; cursor: pointer;}'+
'#divSourcetext {background:'+BG.E[i]+'!important; color:'+FG.t[i]+'!important;}'+
'#divSelflag .gootransbutt, #divDic .gootransbutt {background:'+BG.T[i]+'!important;'+
'border-radius: 3px; margin-top: 5px; }'+
'#divDic .goounsaved {background-color: #EF9024!important;'+
'border-radius: 3px; margin-top: 5px; }'+
'#gtp_dict td.gtp-pos { color:'+FG.g[i]+'!important; font-style: italic !important;  text-align: left; }'+
'#gtp_dict td.gtp-pos:before{ content:"\u25BE "; font-style: normal!important; color:'+FG.g[i]+'!important;}'+
'#gtp_dict td.gtp-word {color:'+FG.t[i]+'!important; padding-left: 5px; padding-right: 10px;'+
'vertical-align: top; white-space: normal;}'+
'#gtp_dict .gtp-word i,'+
'#gtp_dict .gtp-word i span{color:'+FG.g[i]+'!important;}'+
'#gtp_dict .gtp-word i { padding-left:10px;}'+
'#gtp_dict .gtp-word i span {font-style:italic!important;}'+
'#gtp_dict td.gtp-trans {/*overflow-x: hidden;*/ vertical-align: top; white-space: normal;'+
' width: 100%; color:'+FG.g[i]+'!important}'+
'#gtp_dict td.gtp-pos, #gtp_dict td.gtp-word, #gtp_dict td.gtp-trans {padding-bottom: 1px !important;}'+
'#gtp_dict td.gtp-pos.gtp-trs:before {content: "\u25C3 " !important;}'+
'#gtp_dict td.gtp-pos.gtp-trs {font-style: normal !important;}'+
'#gtp_dict .gtp-hide {display: none}'+
'#gtp_dict .gtp-block {display: block}'+
'#divTtsIfr{position: relative;padding: 0!important;margin:3px 0 0 0!important;\
background:'+ BG.C[i] +'!important; color:'+FG.t[i]+'!important;}'+
'#gdptrantxt {font-size: 1em !important; line-height: 1;\
 position: relative;\
 z-index:100500 !important;\
 margin: 0 auto 4px auto  !important;\
 overflow: visible!important;\
 display: block;\
}\
\
#gdptrantxt  >span { \
 position: relative;  \
 z-index:auto !important;\
 display: inline-block;\
 cursor: default;\
}\
#gdptrantxt  i {\
 font-style: normal !important;\
}\
#gdptrantxt  >span >ul {\
 display: block; \
 visibility: hidden;\
 position: absolute;\
 z-index:100500 !important;\
  color: '+FG.l[i]+'!important;\
 list-style: none none outside;\
 bottom: auto !important; top: 0 !important;\
 left: -1em !important;  right: auto !important;\
 background:'+BG.A[i]+'!important;\
 opacity: 1;\
 max-width: none;\
 overflow: visible;\
 border: thin dotted ' + FG.g[i] + ' !important;\
 border-radius: 5px !important;\
 border-width: 0 1px 1px 1px !important;\
 padding: .5em !important;\
 margin:  1.1em 0 0 0 !important;\
 transition: visibility .0s linear .2s;\
}\
#gdptrantxt >span >ul >li{ -moz-hyphens:none !important; hyphens: none !important;}\
#gdptrantxt  >span:hover > ul{\
 visibility: visible;\
 transition-delay:  400ms ;\
}\
/**/\
#gdptrantxt  >span:last-of-type > ul {\
 left:auto !important; right: 0 !important;\
 border-radius:  5px 0 5px 5px !important;\
}/**/\
#gdptrantxt  >span:first-of-type ul {\
 left: 0 !important; right: auto !important;\
 border-radius: 0 5px 5px 5px !important;\
}\
#gdptrantxt >span  ul li {\
 white-space: normal;\
 color:'+FG.l[i]+'!important;\
}\
#gdptrantxt >span  ul li:hover {\
 background-color:'+BG.E[i]+'!important;\
 cursor: pointer;\
}\
#gdptrantxt  >span:hover  {  background:' + BG.A[i]+ '!important;color:'+FG.l[i]+'!important;}\
#gdptrantxt .gtpcmmt {\
    border-top: 2px groove '+FG.g[i]+' !important;\
    margin-top: 0.5em;\
    color:'+FG.g[i]+'!important;\
}\
.gtptogl{  position: relative;  display: inline-block;\
  cursor: pointer;font-weight:bold!important; }\
.gtptogl:before {position: absolute; bottom: -4px;\
 background:' + '#EEE' + '!important;color:'+'#007FFF'+'!important;\
 content: "L"; font-weight:bold!important;\
 border: solid grey; border-width: 1px 8px 1px 1px;\
 margin: 0 0 0 2px; padding:0;}\
input#gtpwPos:checked + .gtptogl:before{content: "R";\
border-width: 1px 1px 1px 8px; }\
');

if(-1 !== n) return;
stickStyle(
'#divDic, #divDic textarea, #divDic iframe {resize: both !important; }'+
'#divDic *::'+(isChrome?'':moz)+'selection {background: #047 !important; color: #FC8 !important; }'+
'#divUse img, #divDic img, #divLookup img {display: inline; width: auto; height: auto;\
margin: 0; padding:0; vertical-align: baseline !important;}'+ 
'#divTtsLnk:after{ content:url('+imgPlay+');}'+
'#divTtsLnk {padding: 0 2px; margin: 0 2px 0 2px !important;}'+
'#divTtsIfh {width: 100%;overflow-x:hidden;\
background-color: rgba(127,127,127,.25); padding: 3px 0 !important;\
}'+
'#divResult, #divResult div, #divResult table, #divResult tr, #divResult tr td,\
#divResult a, #divBottom, \
#divOpt select, #divOpt input, .gootranslink, \
#divDic img, #divDic input, #divDic textarea, #divDic label, #divDic li\
{ padding:0 0 0 0; margin: 0 0 0 0; background: none repeat scroll 0 0 transparent;\
  border: none; line-height: 1.2; float: none}'+
'#divOpt input { padding: 4px 0 !important;}\
div#divBottom{padding-top: 3px;}\
.gootransbutt#optionsLink{margin-top:0; padding-top: 3px; padding-bottom: 1px;}\
#divOpt .gtBGColor{ border:thin solid blue !important; cursor: pointer;\
padding-right:6px; margin-right: 2px;}\
.gootranslink[titel]{position: relative;}\
.gootranslink[titel]:after {\
color: #050;\
content: attr(titel);\
position: absolute;\
visibility: hidden;\
z-index: 100509;\
opacity: 1;\
	left: 16px;\
top: 32px;\
min-width: 0px;\
width: auto;\
white-space: pre !important;\
-moz-hyphens: none !important;\
text-decoration: none !important;\
border: 1px #aaa solid;\
border-radius: 6px;\
background-color: #dfd;\
padding: 1px 4px;\
font-size:medium; line-height:1;\
-webkit-transition: visibility .2s linear .2s;\
transition: visibility .2s linear .2s;\
}\
.gootranslink[titel]:hover:after {\
visibility: visible;\
-webkit-transition: visibility .5s linear .7s;\
transition: visibility .5s linear .7s;\
}\
#divOpt #gtp-save{\
margin-left: 2.5em;\
font-weight: bold; cursor: pointer;\
display: inline-block;\
z-index: 100511;\
}\
#divDic img:active {\
-moz-transform: translateY(2px);\
-webkit-transform: translateY(2px);\
transform: translateY(2px);\
}\
');
}
function insAfter(n,e){
  if(e.nextElementSibling){
   e.parentNode.insertBefore(n,e.nextElementSibling);
  }else{
   e.parentNode.appendChild(n);
  } 
}
function insBefore(n,e){
   e.parentNode.insertBefore(n,e);
}
function outerNode(target, node) {
 var t=target;
 if (t.nodeName==node) return t;
  if (t.parentNode) 
  while (t = t.parentNode){
   if (t.nodeName && t.nodeName==node)
    return t;
  }
 return null;
}
var imgH='<img border=0  src="' , imgD='data:image/png;base64,',imgT='">';
var imgPlay=imgD+
'iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAI1JREFUeNpj+H9h4v//D7YRh4FqGf6vsvuPF4PAnnQ4n+H/At3/WDEIgOjTvQg2EDP8ny7/HwWDAIy+sxnBvr0RzGb43y/0H45hAMR+fAQrm+F/B/t/DAASe3gQK5vhfwsDpgaQ2IP9WNkQDTBMsgaYJhgNcgqMfWUZDg3oGveUINh4NSBrnGdGggY0DAAAy70TuBaoTgAAAABJRU5ErkJggg=='
;

//http://www.senojflags.com/images/national-flag-icons/Portugal-Flag.png
imgForwSrc= imgD+
'R0lGODlhEAAQAIQfAAFYsQJkw15iWgRz3AeN0Xl8c2mBiQma5B6W1h+b3yqh4BKp+kWk0pudlDC2/0y79X+4z1fC/7q6r3DK/4rN7a3Kz8fKwc/Uyr3c5N7dzuTi1Ofl1enm2O3r3/b06////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAB8ALAAAAAAQABAAAAWf4OeNXmdyX6qKpNSc25p6TVEIgl1osljntxxPNrIILhrDZBl5OBaLj6mTa1CWk+YTOpXgsBEM5gFdmDLBiJrC2VCgB85lYJFcmg+MPAPnDP4aGg4ODxsVFBkPBwd/jRuDFBoQDxkVix+NHwBQSBmeFwoEHwEDAQEAAJQVDAwQFxCipqeoABkMiwcWFqKjpqgEBLjAwDIAHwoJyQkIzB8hADs=';
imgForw = imgH+imgForwSrc+imgT;

imgBackSrc= imgD+
'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IArs4c6QAAAGBQTFRFEgAAAVixAmTDXmJaBHPcB43ReXxzaYGJCZrkHpbWH5vfKqHgEqn6RaTSm52UMLb/TLv1f7jPV8L/urqvcMr/is3trcrPx8rBz9TKvdzk3t3O5OLU5+XV6ebY7evf9vTrdcYePwAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAoklEQVQY003PWxKDIAwF0CCPYouCKIIB7f532UTttPfvnkkyE4Ar+3Ecb8pdoRGM859UY4yUxow/4CpPcM6HuCzLoxaZacV9IY1G0mWGsG0sUs4M1rnU9hRjpCt4AZZ9CyGWOauyg7UB09qC97UqpRhWDFNN3jfFAf0qiFiLcwK4g57KNAw0JUTXqY4gZ2vtgEKwMFBItL47QN/3T8oLxPnVB4gUDOnY6pKLAAAAAElFTkSuQmCC';
imgBack = imgH+imgBackSrc+imgT;

imgSaY = "<img border=0 style="+'"margin-bottom: -3px;"'+
"src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAC4jAAAuIwF4pT92AAAA+ElEQVR42sXTMYiBYRzH8XfhupIurHRZrrAoRlLKyOSUblE3qNtuuk0xn0EpjEwGm1E2u+ViMJk4DOJKKXyfepTevG8vpwyf5fk//Z73/3+eV3Hm98p/KLcMsJ7Z4EbISEAGSzycFE2YY4cOXrQCXPjDO4IIy6Ide6TRxQYFPKoDiujBgRlyMJ8E+OXmN0ywxgIjxEVhiCy+8IMIVvCoAoQnvCKFqjhQLG7loFr4Rh2NM1+gFhV1RfYmTm2ihBrasiVDAX184gNjBDCAT6OFpFQ5tpCTvVvlYMqqW9AbYkIUbPhFHs/wXnqNQgxTWK55SHoMP+X7/Y0Hq9jeA/Cgqm4AAAAASUVORK5CYII='>";
imgSay = "<img border=0 style="+'"margin-bottom: -3px;"'+
"src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAC4jAAAuIwF4pT92AAAA90lEQVR42r3TIWgCURzH8VdUBJGhVkUsgloEjY7BwKhJBbEIC4LNZDvQ7MJA0MWZDGvGsWZfERdMJp0ziArCYPo9+AsXbqgTDZ9w7/3vx//9753y1rbqHOrSAQkETNadhwKCeMMvvmEx7NmwQNEswI46NnhHHlu4Zf8WcTxgDZ++mMIIc6wwQUFeiBoCrNAwgwd9PCpZaCOHLG4MHe0DQljiDgNUUcKnkoL7P2Zh7KCDFzTwKgP+OTZAb7mHZzyhK91s9kdoISPMjhDBEDGMUUYFH3pR+sgh6s9NqXXKLLRTP2MYftTwBdd/LpIDUyTPucrX+5kO2gFZJd4DreYhRQAAAABJRU5ErkJggg=='>";
imgSwap = "<img border=0 style="+'"margin-bottom: -3px;"'+
"src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAQCAYAAAD52jQlAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAGFJREFUOMu1kkESwCAIAxM+7vTlevJipYKkOWeWQAB2ar2jIFMD31ABEACYBj5kLKkooX9TGTSwUqZQusbToOnd+CxbQiQxXeMccPEVrNzOA//YvkKp9SNnWQo2ZcK6PgocHMgoj3uaTsAAAAAASUVORK5CYII='>";
imgGoGo="<img border=0 style="+'"margin: 0 0 -3px 0;"'+
"src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAC4jAAAuIwF4pT92AAADCElEQVR42o2TWU8TURiGxyv/hv/ERCOylAKFC0CNXBgIqLhFixi2sEhpyyb7EkBklwIFZDHQsmgLBYFCFwqURgqaiJGZM+XOvJ4z0IJ4US+eZDKZ75n3e88Ml1D6oyeuTDiOLSNQnBJTShCtJZBr+O8pqr6rubm5XDA4KvHFlYuILfdBwSjzIYYSXeqDXEt+J6mMKf8lYknOS86LorQiEoo8LcrststBRSfrnAkCEklE76sPv+Y3LVSOjU+9NBpnM2ZmZpUMo3FGaTAYMwwGwzPKfU5RSgKSh60E1eMC6iYEPGihHVGRXCMir2MPy2tb8Hr3cXBwgP39fQmv14u9vT0JjhXLJE/eEoxYeOgXeQwtHEGjF2gqEZEaH+7V/sTwjAtu964k8uMXMjh2OmyVrjkedZMC7UvE03aCQh1BarMIGRVF0lRvdG5YrXZ8sixj1eb4VxSlIVIXg2Ye+f2CtI6appm3HaFzlodM7ZN4VO9Bt34Kr8oboG3pxuSciWKG+cuatCIn15x0UTYiYHSJR4FOQG6fgA/0WjUkIIJKGAr1N+Q3jKGlT48u/TheN7SjqqMfBrPlTMR6uF0tQmfiseP9BTdlgCa8VSUGRDI1QXajCYNj07Cu21DfNYD5xWWpaEkUSR9gPTDu1orI7CbI6iFIqj2RhJeIEmGUxzVWaBu7UPPuPZp7B2F3OOHxeE5OTVZCAj3ITt9+USChEpFcfYCsyk6kF1SgfWAULpcLOzs7koyLoCL/cMTp8EUBI5QSUXwIVdtnDE8YUU1TDX80YGtri34WbnBhxfxRuIrQYUIHzgj1U0wkCeNmsYiKfg9WVzcwPW9Cm24Ezs1NKRUXn2NKTyywtCcWLvX6SfBTsNSryHGshCjdCFHu4saLXRS1btLvyQab3YHlVWtgvaB/dVpmU3x44ujx9bhR3EmbhE5vwcaGHQ5a9CZNw1bb3t4OLnqerb2iSNUNxCdPoKPXTNeywmazUZFDErFETBY8UU7OpWtp9XnKvGksLKzQtdZht9vhdDr/Ev0Byz5/VV64nnQAAAAASUVORK5CYII='>";
//imgFmt="iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA0klEQVQ4y6WSPQoCMRCFPyXN3kDB2lJ7G0tLQSzWqwgOGn8uYmOxjScQwQso7h30AIsgg1i4gkhiVn1VwoRv3ptMiadE68AIiHBriTVrvBJdIlrx1GJEU0R776XyyznCmpO/AxOg8w4pU1wtYAvMEe1+C9gAO+Caz2ngypkU9iK6+iWCU8ZBbwBDz/sp1qSfAdYcgPgfB1Wg7R2mNefPALgB6gHcwg4eHZJ/IjTzv3ZpjDXHkIM90C/q4HUPLvkAQ0tUAzKXgwmwQDQKIDJg9rzcAbW2Oj2CkYeiAAAAAElFTkSuQmCC";
imgWayBack="<img border=0 style="+'"margin: 0 0 -3px 0;"'+
"src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAjklEQVR42mOwqf/PQAlmGNQGcAGxHbkGcAPxfiD+S44BPEB8CIj/QzFJBvAC8VEkzSD8CIhnALEiIQP4gPg4mmZk/AWIAwkZcAyPASD8C4jNCHnhMAFDjhIKRFAMHEDSwArESkCcAsTXoGIKhKIRlAb2APEfNHE2IF4ExF7EJCQOILbEIs4CxMpDIy8QhQEekOZZucV1OQAAAABJRU5ErkJggg=='>";
imgUse = imgD+ 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACQklEQVR42mNkoBAwgoiwykntQCoeTW7hqva8SmINeGZv7yCJLHHw4IHnQAOkCBoQXjdnJpBOI9MHsxhDa2b9z4v2xir7/z8QgyCU/gdi/GMA00CKYc7qnQyMwdUz/icGuSFp+s/w+cs3hqPHzzK8fPUGzBcVE2EwMzVk4OTkhGgG4X//GTbtPsTAGFgx5X9iiCfYFpDE+/cfGTZv28Ogr6vJ8A7ItjQ3ZLhy/Q7DxUvXGVxcHRj4+PgY/kIN2LH3IAOjX8mE//Gh3gz/oU7bu+8wg4S4CIOBnjbDlFmLGRLiIxnYWJgYzl+4wvD0+WsGSxtLhr///kPVHmBg9Cns+R8d7At32rJlaxnCw/0Y/vxjYli2dBVDaEQI2DZmoA0r12xg8A30hxgAxIcPAg3wzOv4HxrgDRb4C/TGmtXrGbx9PBmYWFgZVq9YA4wnRoa/f/4xeAf4MOzYsp3B3dcH7oVTR4FecMtq+e/r7QExAIhPnzzFwMsnwKCkqsIgwM0OVgwKnzPnrjB8/PCeQdPAEO7aCyeOMDC6pDf8d3V1AQv8BcXN758Mu3YfZJBXUmQQl5YCGszA8OzJE4ZH9+4z2DnYMPxkZAGrBYXZtbPHGBgdk2v+2zo6AQX+g21jY2FmALqZ4cyZCwxv3rwFKmZgEBYWYjAw1GP4zcDE8O3nb4gBQPFb508wMNonVv7XNzYFGwBzGgsTEwMvFwfI+8DkAzQPGDgfvn1n+PHrLzhdwMDDG5cYGK0iC/8zUABAmcmAEgMA4i8z829X6pgAAAAASUVORK5CYII=';

imgSave= imgD+
'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACgklEQVR42mNkAIL4tTeX/P36xnpBtCXDolN3GYS42Bn8dGUYGBkZGWBg/+0XDFOOPfzDxSOw8enZg5X729N/g8TBKuJWX/v++d0TjnVprgx2vZsY1MT4GebE2jMgg93XnzBMPnKXgYdPhOE/A8OiFRE68XADolZc+v7u+V2O7QUBDMbNyxg0JAQZlqZ6ohiw/fIDhr6DNxgEhSTB/P///9euiTFsARsQtuTs96ePb3PsLgpmOPfoJQM3GyuDgZwYigErHxQw3P/wnoGVhR2kmeH05aivt/bsFQEbELjg5PfHT+5y/Pj5i4GZiYkBG0iIqGZgYvwH5x89O4Xh1t6zCmADPGce+s7LycrBAPIdDmBuHAkM1L8IA870AQ04DzHAdere70CKgwEPcLFNAboAYcCR050Md/ZDDXCcuJMIA7IYGJmQvHCqieHugQsQA2z7tnzXEBfgEOXBbQa7VBSQRDLgdA0Dw4fDEAMsuzZ835nrxfH/zx+GP38QzvwP1DD3VjDDp7+PcZl7AWyAadua7weK/Tm+ff3G8Ov3HxQV7//eYVh8O5Xh3/+/KOL//jEzvHvBaw02wLBp+fcj5cEcL16+Y/j67QeGNZe/rmE4+XYxitj9Rw4Ml7Z9h3hBp27x95NV4RwvXmE34C/Q9lUPKhne/rkL5qsKGzIcOefLcGbXFogBmtXzvx9JUeHgYsWeiEDg1dcnDB3Xe4Bpn5GhUquUIXPzL4azB/YpMLb0T+E6+o1nryLrI2Nmhn8gEyBZEJkEhScwjX3geQMS+s//RfjfvV9Sz0x4/xszLlmyRAmUFIBYGogFgZgbmiZYgJgZFmZADMq+P4H4CxB/AOKnQHwQALc2/z+3odafAAAAAElFTkSuQmCC';
imgClip=imgD+'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAQCAYAAAAvf+5AAAAACXBIWXMAAAsTAAALEwEAmpwYAAAArklEQVR42mNgIBeI1v4+LVrz87dY7W9/rAqE63+ZABU1iNb9/i9c8/s8kD4gXPerGK5ArP53AMgE0bpflSBFKLjm50eRut/tQANOMsBMEa39uRnMRsJgRXU/34HkEQoJ4MGkULju5w5QSADpHzgVghSJ1P7uAAZLgljtrwxkxWgKf62BBBUoaH49ALLP4HcjFjHiFQKtqCas8OcvBonKf6JgxcjRB0wQyHzh2t++ACFkSePupdPoAAAAAElFTkSuQmCC';
imgFlags= {
 'AN': imgD+
'iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAYAAAAMJL+VAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAABANJREFUOMutlEtsVHUUh797//c10955F2hKM7QUEUgNoRAqSUGJESO6ACSyIKgJwSXGGFJ2mhijG2JE3WgiiSaCAQlVeagIhAYID4GIgKU4lGdbhs5MZ+bemft0UXGBukF/y7M4X07OOR/8T9n84eebNm3ZuvPBuvJgYcvOg8r573a0zF62uqP/zM/JUdvX8T1f1fRqV+vkQu74gXsqoaUaRlSbt2zaxby1UJs2e929WR1tSzqSdH/15RMnThw7fL+ftP7tj41hueG5eDK12GzJLp3a0vxoImaKCyNlLuWrnBvKU8oXWZoKKVoOZ4suoSyBAIQGWpSIEaFnWoLH2zOkhs9d2Lh8aed9gBh7ZuOVk+acDeVU68JEzJwUNxQ5Kgc4rk/ZsqnYNWJBnZ+eb+bZVp3V0xvoTAvSIkTyXUZqPh4SrqSQ1AQzOmdNsq/8Ovr7wOXTALJ3sX8/jkXZsig7PlU3oFGRWTA5QlRT8YRKBQULQdEDTYKeKRF6uzJ8s7yZBSkBnsvtksXVgs1vt0qse++Dd2a2t6UARFs2Gx/p6FkVeh7pRp2kJpBkyJoqm+el6Zli0Ds3jl338fwAz/MJQvDCEMsL6Z6kkxtzGbICbARJTZBpyhiPTElmDu/t6xNJr3LN6V652XJdYoZOKqKS0AS2H7B9sMqqbBQ5CHA9nyCcAIRB8OcGwdRkNnQm2X/D5nrFQ1NVTEWma1H3vKuH9v0g8oWC0/TYoqfHjUSrUASZBp2ELohrMhU/ZElLFE1iAuD7BEGA7/oTABlCwPF9xj2J4yMOViBIGAIzFiXmFg0B0JROTy1ku54kDCYAhoqpyUQViU8vV2iOSnTEBL7nI4UBvj8xRQhIEmgyHLxR5XzJpx4CqkG6fu/uZ6+99LICYFZG9ymq9pZVsynaDhUnQs0LSRgyqajgzXPjtGs+cxs87oxZxHGYGQlpMWUCwJBlTt2pQKACUaxisbC994W1lmUNCIDh3MDtzOIVr1cCWddVhUxUJxZRiGkybgDjTsipuzbbLxU5ervKj9fKhI7DyvZGnCBkz1CFHTkL3TRpvXn6THHrq2uK+ZF+IPzrk7XBk31M71lbsuqUa3UsR8cxQkxFolETxKMGRmMES5ZBM9hVrPP93hKBW8coj461DJ057p7e/8X1awPfBlD5myoy1uiRm0JdW7FrlGp1qnWXWqBiGhpNTREKnkz5yvnB6i/HLgS3ruYoDef0ejnnDudy+bHSTQfKQPCvLiod2bXbnP/iJ2XbpWg5WEInlPAv9W070r/n692DJ48esF33hqmKetn1w4cyYnPvtrO8ezSc8f6h4vxVr2yNRiJz/kmID53ZK9a/MfWpNR9FFJGduPL/nj8ActPaP8mCkKMAAAAASUVORK5CYII='
,'en': imgD+
'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAJJSURBVHjapJNdSJNRGMd/Z3u3OTXXhx8xjRLDFWIk0jAk6WYYfaAZSUWGZkFdRNRFYAYFXhkI2gpKqISC1IsIUiKIchUEUQiuj4uiMT8m0wbNr+n2vu/p4l2K3Yn/m3Pg8Pye8/wf/kJKyWokACuQnjxXojgwowCOwPW2iS37y3k0bOfJwwHmYzFePK5n7Oxl0FRyH9zicGM3CZOFBhccypMox2tJdWZnK0Bay/AGmr+McmJvKUXbaul79hmTzYJ9x3bQdEw2C2V7XOzLUdmVZ2PWvZvm1lcAaQpg/vY9xL2NRdRMvqHUlYmzoRw9oREPjICqoic0qtIiFGVmECp20+kd4IPPD2AWQMFMcOSnxWZDavqyIcfOXARVJ7fLu9w4s4nEwgLpmzdtVQB+HW0kNcOBFo3Cv6VICWYTSEmw6hSYBOjGo7LOwdz0lHEHiMVimCciaNEpRLIWqSMUxWCpKgiBEAIJqI4M5tLtS4Cs++3kZGUlK5cUcFciEwkKBl//t3xBeHIS3KWYAEo87biruxiKWkh568N/447RWZdI3fAlMG8l5Z2PT00deOq6KfHcBjAA+YVO+p6eo8zXy/P+r9R9tCcbCQQCgIMHOuh3llFx2kNn/jjFhWuXAN6rFay/66XtZZjG9zrh0KjxVasCNgsAs9N/OHnkJq0/HLjOH+NadmjRg7jW00tnWOPKQGRxzEH/EOM7XUhNI+of4nckCEDThRaCl2qor66E/p64ABxALrBmhVmYBsYEYE4GybxCgAbExWrj/HcACIPUyGtYcDcAAAAASUVORK5CYII='
,'fr': imgD+
'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAFESURBVHjapJM7TsNAEIa/9RqjKECEkGgoKOgoaHKCdByBc3APDsIRaHID01ASRTxEgxI5zsvetb1DkcSJCUaKMtJqZzSrb2f/nVEiwj6mgAA4Wu67mAWmPtDqdB6+f2e73ftK3L+92yJcPT2e+0CzKBzt9uW/1zVurpc1KxBh/vwC0PQBbW3BeJwyHE5rAebto/T9s1MkywC0D2CMJYpmRNG8FuBG49IvPE1u0wUMIEkMg8GMOJ5T9yn5KC59AWxiNgEJvV5GHCf1kvffS1+3Tkh9bw1I0wSRBs65ehU3cpJlpJnbBBi0PsS5+qaSFUBAihyTWwC8hYgG50ApVa6tjlvlPAVOSIxdV2CtJQiEIPDrnxAcVKoxdi2iFSmYTD4r58MwrMSvcfSntgpoARfA8Y6zMAG+FKCXg6R3BBSAVfuO888AocKXohfLXWQAAAAASUVORK5CYII='
,'ru': imgD+
'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAADkSURBVHjapJM5TgNBEEVfzeZlQIOE5ARxClLOxC04CzFX4ArERAhZsoTEyDDurqa7SGxsIYJZKqnov9p+iZkxJQSogLN9HhIKfBZAY2abUdVFVhlQT5igzoB8AiDPAGKMg5UHTQFwc/fI6rKh/VLsz4b/u9FFXbF5b4+AnXe8rIW2C72qN8uSwtwJoHMwm5NSP0+EbyP4E8DD0z3XZUnqdr0A2XLBawjcHgBOPZYXINILYMlw6o8deFVsvoCq7AewhFf9BWg047n9GOMDFaABroDzgeIt8CZ7J1YjHBkBlanv/DMAwHdYum9dlZQAAAAASUVORK5CYII='
,'zh-CN': imgD+
'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAFbSURBVHjapJO/SgNBEIe/vduLCSaKFhb6DCnFzs4XsMgjWlj4AD6BFhYKFqKgTSzSaBLN7f+xuJM7RSHRHywLy8w3Oz9mlIjwHymgA/TrexU54E0Dm+Pj0QSACGRADt39gLnQTZkftHd2uqOBdYmR3uGQYjfhnzPSXJHeYTCK2Lu8AquGJYC9vgFY10AupUdvTekdTYgnGvdYVQ5P0nTa+kW+vYV4D5BrgGAt9nZOmCzwDxlxkqG60D0ImCsN/msbKs+J1gKgAXww+Kcp5nKBKgQ0rA09i/Oi8iR880HAGdMATFnSuX8kzWZ8vvqHJvi7idnGBibPGkBZlvSzDJFURfj6FC1ISyl4SpcagDUWVRRISi2ngPTL8PiArUysW3AW0RqUWmqCRATjWiZaa6HbQxXFcjOYUpVTA1wU4eb15S+r4BSwCewBgxWT58BY1XZ16nsVRcCp/67zxwDGd5ld8bkQAQAAAABJRU5ErkJggg=='
,'ar': imgD+'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAIvSURBVHjapJPNSxRxHMY/M/Ob3bXddV3DBTUh8yJdCiHwIIV0DXqB7nWLDv0NBt06Rt3q0E0PGaFBmGSGUCZKQR6ENV8wddfVfZ35zW/mN9NByd4u4nP5Hr7wgYfneYwoijiODCAGpA7uUaSAugAyN0aHCn9//TAg0BoAYZrYlv0P4cX1oZwAkjrUnMv1ABBFEX6oaU+1cibbARGsVbZZrxWxTRPDMAH4UsgDJAVg+WFATTmUZBWtNVd7L3Ktux9ZaxBvShDriTO2/InhxSlMA042NeOHAYAlADzfpyIbFBplLp/u42bnBRzHYWVjHa01bdlWrnT0sV4t8mppBmFYeL4PgAkgPUnJq9LQHpdyvbizn9koFgl8n3gsxlZ5D39+gcFsDwrNjqwiPXkIcKVHvrxJwa3SIgOcmRkCIUil0+yUSkTxOLsfpmltKHaVQ778A1d6vwMcwlBTk3W2kzaJ5VWyc/Ns1euYmWbK468xZ+cpZBJU3CphqHGls58QgJQSO2njKo+RlY8M3L3Dzq3bdHSdoimdRn9bpO3xEx5tLrDn1MidaMGX8hCgpIeIkqTsBCMLb+gebOfe2Cjm+ASh72M+uM9T1ng28ZKUnSCKQtSBhf0UlCJBREzY2Jbg4fvnTHadpX/gPKZpMLc0zOzqV2xLYBkmIRGeUr8AKtIh5fzmHy2b/v6Oyam3YIDAIi5s5H/qbAAZoBNIH3ELNWDDAKyDIVlHBGhAGced888BANVaBfgg0AbGAAAAAElFTkSuQmCC'
,"af":"Namibia" //
,"sq":"Albania"
,"am":"Ethiopia"
//,"ar":"United-Arab-Emirates"
,"hy":"Armenia"
,"az":"Azerbaijan"
,"eu":"Spain"
,"be":"Belarus"
,"bn":"Bangladesh"
,"bs":"Bosnian"
,"bg":"Bulgaria"
,"ca":"Spain"
,"ceb":"Philippines"
,"ny":"Mozambique"
/* ,"zh-CN":"Chinese"*/
,"co":"Italy"
,"hr":"Croatia"
,"cs":"Czech-Republic"
,"da":"Denmark"
,"nl":"Netherlands"
/*, "en":"English"*/
,"eo":"United-Nations"
,"et":"Estonia"
,"tl":"Philippines"
,"fi":"Finland"
/* ,"fr":"France"*/
,"fy":"Netherlands"
,"gl":"Ukraine"
,"ka":"Georgia"
,"de":"Germany"
,"el":"Greece"
,"gu":"India"
,"ht":"Haiti"
,"ha":"Nigeria"
,"iw":"Israel"
,"hi":"India"
,"hmn":"Laos"
,"hu":"Hungary"
,"is":"Iceland"
,"ig":"Nigeria"
,"id":"Indonezia"
,"ga":"Ireland"
,"it":"Italy"
,"ja":"Japan"
,"jw":"Japan"
,"kn":"India"
,"kk":"Kazakhstan"
,"km":"Cambodia"
,"ko":"North-Korea"
,"ky":"Kyrgyzstan"
,"lo":"Laos"
,"la":"Vatican-City"
,"lv":"Latvia"
,"lt":"Lithuania"
,"mk":"Macedonia"
,"mg":"Madagascar"
,"ms":"Malaysia"
,"ml":"India"
,"mt":"Malta"
,"mi":"New-Zealand"
,"mr":"India"
,"mn":"Mongolia"
,"my":"Burma" //absent
,"ne":"Nepal"
,"no":"Norway"
,"fa":"Iran"
,"pl":"Poland"
,"pt":"Brazil"
,"pa":"Pakistan"
,"ro":"Romania" 
/*, "ru":"Russia"*/
,"sr":"Serbia"
,"st":"Lesotho"
,"si":"Sri-Lanka"
,"sk":"Slovakia"
,"sl":"Slovenia"
,"so":"Somalia"
,"es":"Spain"
,"su":"Sudan"
,"sw":"Mozambique"
,"sv":"Sweden"
,"tg":"Tajikistan"
,"ta":"India"
,"te":"India"
,"th":"Thailand"
,"tr":"Turkey"
,"uk":"Ukraine"
,"ur":"Pakistan"
,"uz":"Uzbekistan"
,"vi":"Viet-Nam"
,"cy":"Wales"
,"yi":"Israel"
,"yo":"Nigeria"
,"zu":"South-Africa"
};
imgFlags['zh-TW'] = imgFlags['zh-CN'];
imgFlags['to'] = imgForwSrc; imgFlags['from'] = imgBackSrc;

languagesGoogle='</option><option value="auto">Detect language</option></option><option value="af">Afrikaans</option><option value="sq">Albanian</option><option value="am">Amharic</option><option value="ar">Arabic</option><option value="hy">Armenian</option><option value="az">Azerbaijani</option><option value="eu">Basque</option><option value="be">Belarusian</option><option value="bn">Bengali</option><option value="bs">Bosnian</option><option value="bg">Bulgarian</option><option value="ca">Catalan</option><option value="ceb">Cebuano</option><option value="ny">Chichewa</option><option value="zh-CN">Chinese</option><option value="co">Corsican</option><option value="hr">Croatian</option><option value="cs">Czech</option><option value="da">Danish</option><option value="nl">Dutch</option><option value="en">English</option><option value="eo">Esperanto</option><option value="et">Estonian</option><option value="tl">Filipino</option><option value="fi">Finnish</option><option value="fr">French</option><option value="fy">Frisian</option><option value="gl">Galician</option><option value="ka">Georgian</option><option value="de">German</option><option value="el">Greek</option><option value="gu">Gujarati</option><option value="ht">Haitian Creole</option><option value="ha">Hausa</option><option value="haw">Hawaiian</option><option value="iw">Hebrew</option><option value="hi">Hindi</option><option value="hmn">Hmong</option><option value="hu">Hungarian</option><option value="is">Icelandic</option><option value="ig">Igbo</option><option value="id">Indonesian</option><option value="ga">Irish</option><option value="it">Italian</option><option value="ja">Japanese</option><option value="jw">Javanese</option><option value="kn">Kannada</option><option value="kk">Kazakh</option><option value="km">Khmer</option><option value="ko">Korean</option><option value="ku">Kurdish (Kurmanji)</option><option value="ky">Kyrgyz</option><option value="lo">Lao</option><option value="la">Latin</option><option value="lv">Latvian</option><option value="lt">Lithuanian</option><option value="lb">Luxembourgish</option><option value="mk">Macedonian</option><option value="mg">Malagasy</option><option value="ms">Malay</option><option value="ml">Malayalam</option><option value="mt">Maltese</option><option value="mi">Maori</option><option value="mr">Marathi</option><option value="mn">Mongolian</option><option value="my">Myanmar (Burmese)</option><option value="ne">Nepali</option><option value="no">Norwegian</option><option value="ps">Pashto</option><option value="fa">Persian</option><option value="pl">Polish</option><option value="pt">Portuguese</option><option value="pa">Punjabi</option><option value="ro">Romanian</option><option value="ru">Russian</option><option value="sm">Samoan</option><option value="gd">Scots Gaelic</option><option value="sr">Serbian</option><option value="st">Sesotho</option><option value="sn">Shona</option><option value="sd">Sindhi</option><option value="si">Sinhala</option><option value="sk">Slovak</option><option value="sl">Slovenian</option><option value="so">Somali</option><option value="es">Spanish</option><option value="su">Sundanese</option><option value="sw">Swahili</option><option value="sv">Swedish</option><option value="tg">Tajik</option><option value="ta">Tamil</option><option value="te">Telugu</option><option value="th">Thai</option><option value="tr">Turkish</option><option value="uk">Ukrainian</option><option value="ur">Urdu</option><option value="uz">Uzbek</option><option value="vi">Vietnamese</option><option value="cy">Welsh</option><option value="xh">Xhosa</option><option value="yi">Yiddish</option><option value="yo">Yoruba</option><option value="zu">Zulu</option>';

/* */
try{
body=
 window.document.body;

maxHT=GM_getValue('histSize'); 
if(!maxHT) maxHT=20;
maxWC=GM_getValue('histWc');
if(!maxWC) maxWC=3;
sourceBH = GM_getValue('sourceBH',3);
sourceDP = GM_getValue('sourceDP',10);
if(!sourceDP) sourceDP = 10;

sT=GM_getValue('sourceText');
if (sT){ 
 try{
  sT=JSON.parse(sT);
 }catch(e){console.log('broken source\n'+e)} ;
} else sT='';

// gmail spoils my timeout -- workaround
// borrowed from dbaron.org/log/20100309-faster-timeouts :
var setZeroTimeout,handleMessage,
    timeouts = [],
    messageName = "zero-timeout-160309";
// Like setTimeout, but only takes a function argument.  There's
// no time argument (always zero) and no arguments (you have to
// use a closure).
setZeroTimeout= function(fn) {
          timeouts.push(fn);
          window.postMessage(messageName, "*");
      },
handleMessage= function(event) {
          if (typeof event.data==='string' && event.data === messageName) {
              event.stopPropagation();
              if (timeouts.length > 0) {
                  var fn = timeouts.shift();
                  fn();
      }   }    }
//}

window.addEventListener("message", handleMessage, true);
// Add the one thing we want added to the window object.
//window.setZeroTimeout = setZeroTimeout;
//  })();

document.addEventListener('mouseup', showLookupIcon, false);
document.addEventListener('mousedown', mousedownCleaning, false);
// http://www.senojflags.com/#flags16
if(  location.href.indexOf(senojflags[0])>-1
   ||location.href.indexOf(senojflags[1])>-1
){try{
  var f16=getId('flags16');
  if(f16){
   if(!fCSS)  fCSS=
   'div#flags16 img {cursor: pointer !important}'+
   'div#flags48,div#flags32 {display:none; visibility: hidden}';
   stickStyle(fCSS);
   _log('inside\n' + location.href);
   insBefore(buildEl('div',{style:'font: bold italic 100% sans-serif; color:red;',
   align:'left'},null,'&nbsp;&nbsp;<u>Click on a country flag icon then choose the language</u>'),
   f16);
   f16.addEventListener('click',flagClick,false);
  }
 }catch(e){console.log('senojflags\n'+e)}
}
}catch(e){console.log('nobody\n'+e); }

function deURI(u,m){
  if(!m) m= "&q=";
  var x = u.indexOf(m);
  if(x>=0) u=u.substr(x + m.length);
  return decodeURIComponent(u).split(' ').slice(0,9).join(' ');
}
 var uq=location.href.match(/^https:\/\/translate\.google\.[a-z]{2,3}\/translate_tts\?client\=t\&.+?(\&q\=.+)/);
 if(uq && uq[1]) 
  window.document.title=deURI(uq[1]);

function cmdGT(aS,aT){ 
  txtSel = getSelection(null) || txtSel;
  if(!isInited) {css(-1); isInited=true; }
  /* 16.08.25 */
  if(!txtSel) txtSel="Google Translator";
  if(aT&& getId('divResult')){
   killId('divUse');    
   getId('divResult').innerHTML = 'Loading...'
   gtRequest(formatted?txtSelO:txtSel,gt_sl=aS,gt_tl=aT);
   return;
  }
  
  var p = {t: pageYOffset+5+"px",l: pageXOffset+10+"px", r:"auto" };
  if(savedTarget) // was dragged
    p.t=dragY+pageYOffset +"px", p.l=dragX+pageXOffset+"px";
  else if(GM_getValue('gtpwPos',false)) /* 160905 */
        p.l = 'auto', p.r=(10-pageXOffset)+'px';

  var divLookup = getId('divLookup') ||
  buildEl('div', {id:'divLookup', style: 'z-index:100000'+
   ';border: none;' +
   ';top:'  + p.t  +';left:' + p.l  +';right:' + p.r  +';bottom: auto'
  }, null, null);
  body.appendChild(divLookup);
  if(aT){
    lookup(null,aS,aT); 
  } else  lookup(); 
}

function playTTS(lang, text) {
  try{
    text = text.replace(/[«»'"]/g, ' ');
    var tk=googleTK(text,soundSL);
    soundSL=tk.SL;
    var Url = ttsURL + "&ie=UTF-8&total=1&idx=0" +
        "&tl=" + lang +
        "&textlen=" + text.length +
        "&tk=" + tk.tk+
        "&q=" + text;
    var AuCtx=  window.AudioContext || window.webkitAudioContext;
    var context = new AuCtx();
    var source = context.createBufferSource();

    var soundRequest = GM_xmlhttpRequest({
        method: "GET",
        url: Url,
        responseType: 'arraybuffer',
        onload: function(response) {
            try {
                    context.decodeAudioData(response.response, function(buffer) {
                        source.buffer = buffer;
                        source.connect(context.destination);
                        source.start(0);
                    });
            } catch(e) {console.log(e)}
        }
    });
  }catch(e){console.log(e)}
}

saySrc= function (evt){
  evt.preventDefault(),evt.stopPropagation(); 
   playTTS(gt_sl=='auto'? autoLang : gt_sl, txtSel||txtselO);
}
sayDst=function (evt){
  evt.preventDefault(),evt.stopPropagation(); 
 txr&&  playTTS(gt_tl,txr);
}
// postMessage('tgtooltip auto|en','*')
function wMsg(e){
 //event.source!=window in Chrome
 if(!(typeof e.data==='string' && e.data.substr(0,9)==='tgtooltip')) return;
 e.stopPropagation();
 var m=e.data.match(/tgtooltip[\s\?/|#]*([a-zA-Z-]+)[\|\/]([a-zA-Z-]+)/);
 if (m && m[2]) cmdGT(m[1],m[2]);
 else cmdGT();
}

 GM_registerMenuCommand("translate.google tootip", function(){cmdGT()} );
 window.addEventListener("message", wMsg, false);
}
main();
}
