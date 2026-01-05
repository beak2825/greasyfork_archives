// ==UserScript==
// @id          feedlyCtrlF5
// @name        Feedly: partial refresh by R in any keyboard layout
// @name:ru     Feedly: обновление списка по R в любом регистре
// @version     14.2017.11.8
// @description Refresh by "R" in any national keyboard layout, add styles, date of refresh and floating title of opened article
// @description:ru Обновляет по "R", исправляет стили, добавляет время обновления и висячий заголовок открытой статьи 
// @namespace   github.com/spmbt
// @include     http://feedly.com/*
// @include     https://feedly.com/*
// @update 12 hide #popupPart
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/5915/Feedly%3A%20partial%20refresh%20by%20R%20in%20any%20keyboard%20layout.user.js
// @updateURL https://update.greasyfork.org/scripts/5915/Feedly%3A%20partial%20refresh%20by%20R%20in%20any%20keyboard%20layout.meta.js
// ==/UserScript==

//(en) In the site feedly.com there are many keyboard shortcuts, for example, "R" - is "Refresh" of part of page, renewing of list of records. Unfortunately, there is bug in any national keyboard layout. It catch keyboard letter, but not key code. Script fix it and add such partial refresh by Ctrl-F5 or Shift-F5.

//Userstyles added to script as bonus. Styles make table more compact and remove unneeded buttons such as Twitter etc. It may to disable userstyles by CSS_ON =0.

// Additions of 20, Oct 2014:
// * show date-time of page loading or partial refresh by "R").
// * author and title in floating block on top;
// * styles fixing

//(ru) На сайте  feedly.com есть много клавиатурных сокращений, в частности, R - это "Refresh" части страницы, а именно - обновление списка записей. К сожалению, есть недоработка: в иной национальной раскладке клавиша перестаёт действовать. Ловится клавиша не по ней самой, а по символу на ней. Расширение исправляет недоработку. И добавляет возможность частичного обновления по Ctrl-F5 или Shift-F5. конечно, не мешало бы добавить и исправление этого недостатка для других клавиш, если ими пользуются.

//Как бонус, добавляются стили, относящиеся к сайту, чтобы не добавлять их в юзер-стилях. Делают таблицу компактнее и убирают лишние кнопки (Твиттер и прочие). Отключить стили можно переменной CSS_ON в скрипте, установов в 0.

(function(userCss){
	var CSS_ON =1; //user CSS enable

var win = typeof unsafeWindow !='undefined'? unsafeWindow : (function(){return this})()
	,wcl = win.console.log
	,$q = function(q, el){return (el||document).querySelector(q)}
	,ff
	,Tout = function(h){
		(function(){
			if((h.dat = h.check(h.t) )) //wait of positive result, then occcurense
				h.occur();
			else if(h.i-- >0) //next slower step
				win.setTimeout(arguments.callee, (h.t *= h.m) );
		})();
	}, tOuttime;
new Tout({t:320, i:7, m: 1.6
	,check: function(){
		return document && $q('#pageActionRefresh');
	}
	,occur: function(){
		var $flBarL, $flBarR, $timeFloat = document.createElement('div');
		document.addEventListener('keydown',ff = function(ev){
			var refroButt = $q('#pageActionRefresh')
				,key = ev.keyCode || ev.which;
			//wcl(4, ev.keyCode, ev.which, ev.type)
			if(key ==82 || key ==116 && (ev.ctrlKey || ev.shiftKey) ){
				refroButt.click();
				var t = ev.target;
				while(t.tagName !='INPUT' && t.tagName !='TEXTAREA' && t.tagName !=null)
					t = t.parentNode;
				if(t.tagName !='INPUT' && t.tagName !='TEXTAREA' ){
					win.setTimeout(function(){new Tout(tOuttime)}, 900);
					ev.preventDefault();}}
				ev.stopPropagation();
		},!1);
		new Tout(tOuttime = {t:520, i:6, m: 1.6
			,check: function(){
				return $q('.header.row .extra >.actions-and-details-container');
			},occur: function($){
				$flBarR = $q('#headerBarFX div.right-col');
				$flBarL = $q('#headerBarFX .header.row h1');

				var NOW = new Date(), NOWmins = NOW.getMinutes()
					,now ='<i class="timeFloat">'+NOW.getFullYear() +'-'+ (NOW.getMonth() +1) +'-'+ NOW.getDate() +', '+ NOW.getHours() +':'+ (NOWmins>9?'':0) + NOWmins +'</i>';
				(!$ && this.dat || $.parentNode).insertAdjacentHTML('beforeend', now);

				if($flBarL && !$q('.title', $flBarL))
					$flBarL.insertAdjacentHTML('beforeend','<div class="lineTitleFloat"><span class=author title=""></span> <b class=title></b></div>');
			}
		});
		document.addEventListener('keyup',ff);
		setInterval(function(){
			var $inFrm = $q('.inlineFrame');
			$flBarR = $q('#headerBarFX div.right-col');
			$flBarL = $q('#headerBarFX .header.row h1');
			$pgBarR = $q('#feedlyPageFX div.right-col');
				if($flBarL && !$q('.title', $flBarL))
					$flBarL.insertAdjacentHTML('beforeend','<div class="lineTitleFloat"><span class=author title=""></span> <b class=title></b></div>');
			if(!$flBarL) return;
			NOW = new Date(), NOWmins = NOW.getMinutes()
				,now ='<i class="timeFloat">'+NOW.getFullYear() +'-'+ (NOW.getMonth() +1) +'-'+ NOW.getDate() +', '+ NOW.getHours() +':'+ (NOWmins>9?'':0) + NOWmins +'</i>';
			if($flBarR && !$q('.timeFloat', $flBarR)){
				$flBarR.insertAdjacentHTML('beforeend', now);}
			if($pgBarR && !$q('.timeFloat', $pgBarR)){
				$pgBarR.insertAdjacentHTML('beforeend', now);}
			if($inFrm)
				var author = $q('.metadata .sourceTitle', $inFrm)
					,title = $q('.entryHeader .title', $inFrm);
			var $timeHead = $q('.timeFloat');
			//wcl(13, $q('.author', $flBarL), $q('.title', $flBarL), $timeFloat && $timeHead && $timeHead.innerHTML =='','\n')
			if($timeFloat && $timeHead && $timeHead.innerHTML =='')
				tOuttime.occur($timeHead);
			$q('.author', $flBarL).innerHTML = author && author.innerHTML ||'';
			$q('.author', $flBarL).title = author && author.innerHTML ||'';
			$q('.title', $flBarL).innerHTML = title && title.innerHTML ||'';
	document.title = ((author && author.innerHTML ||'') +(author || title ?' / ':'')+ (title && title.innerHTML ||'')).replace(/&nbsp;/,' ') || !author &&  !title &&  $q('#headerBarFX .header').innerText;
		}, 999);
	}
});
(function(css){ //addRules
	if(typeof addStyle !='undefined') addStyle(css);
	else{
		var heads = document.getElementsByTagName('head'), node = document.createElement('style');
		node.type ='text/css';
		node.appendChild(document.createTextNode(css));
		heads[0] && heads[0].appendChild(node);
	}
})('body{overflow:auto!important}#notifications{display:none!important}'
  +'#headerBarFX,.floatingBar{height: auto; padding:0 0 4px; background: #f8f8f8}'
  +'#headerBarFX{margin-left:-41px}'
  +'.pageActionBar{height: 18px!important}'
  +'#headerBarFX .pageActionBar{margin-right: 145px}'
  +'#section0 .label >div{height: 1.3em!important; text-align: right; font-size: 11px; font-style: italic; color: #a3a3a2}'
  +'.lineTitleFloat{line-height: 16px; margin:0 -70px -1px -6px; padding:0 3px; border-bottom: 2px solid #f8f8f8;font-weight:normal}'
  +'.header.row .timeFloat{position: absolute; display: block; right: 25px; bottom: -.5em; color: #a3a3a2;}'
  +'#searchBarFX{height: auto; padding: 4px 0;}'
  +'#searchBarFX button.pro{width: 7px; min-width:7px; opacity:.24;}'
  +'#searchBarFX button.pro:hover{width: auto;}'
		+'.fx .button.primary.pro, .fx button.primary.pro, .fx-button.primary.pro{left:-34px; background-color: #ecc}'
  +'.lineTitleFloat .author{display: inline-block; float: left; min-width: 87px; padding-right: 1em; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; font-size: 13px;}.lineTitleFloat .title{font-size: 13px;}'
  +'#headerBarFX.title-only header{padding-right:5px; padding-left:1px}'
  +'#headerBarFX h1{align-items: normal}'
  +'.timeFloat{float: right; line-height: 18px; margin: 0 -28px 0 -18px; color: #a3a3a2}'
  + (CSS_ON? userCss :'') );

})(
' #feedlyTabsHolder{width: 240px!important}'
  +'#feedlyTabs{padding: 0 2px 0 0!important}'
  +'#mainBarFX{margin: 0 0 0 -42px; padding: 24px 0}'
  +'#mainBar, #feedlyPage{width:auto!important}'
  +'#feedlyPageFX{padding: 0 10px 0 12px}'
  +'#feedlyPageFX.title-only, #searchBarFX.title-only .container{padding: 0 18px 0 11px}'
  +'a[style*="images/condensed-twitter-black"], a[style*="images/condensed-sharing-facebook"]{display:none!important}'
  +'#feedlyMessageBar, .feedly-logo, #popupPart{display:none!important}'
  +'.profileMore{margin-right:38px!important}'
  +'#feedlyTitleBar{margin-left: 11px!important}'
    +'#feedlyPart0{padding-left: 6px!important}'
	+'.fx button.full-width, .fx-button.full-width{width:94%}'
  +'#feedlyPart{padding-right: 6px!important}'
  +'.u0Entry .condensedTools{width: auto!important}'
  +'.u0Entry .condensedTools img {padding:0!important}'
  +'.u0Entry .condensedTools a:first-child{margin: 0 -5px 0 6px}'
  +'.u0Entry .lastModified{padding-left: 2px!important}'
  +'.u0EntryList{margin-top: 0!important}'
	+'.u100Entry .title{font-size:16px!important}'
	+'.u100Frame .u100Entry .title, .inlineFrame .u100Entry .title{margin-bottom: 1rem!important; line-height: 1.2rem!important}'
	+'.u100Frame .u100Entry .title:hover, .inlineFrame .u100Entry .title:hover, .entryholder .fx-button.secondary.visitWebsiteButton:hover{background-color: #f8f8f8!important}'
	+'.pinContainer span{opacity:0!important}'
  +'.list-entries .inlineFrame{padding: 20px 10px 18px 12px}'
  +'.visitWebsiteButton, .tagsHolder{margin-top:-8px!important}.visitWebsiteButton{padding: 4px 0 2px; border: 1px solid #f4f4f4!important}'
    +'.frameActionsTop{height: 18px!important; line-height: 20px!important; margin-top:-20px!important}'
    +'.entryholder{padding-bottom: 0.5rem!important}'
	  +'.websiteCallForAction, .secondaryCallForAction{margin-top: 20px!important}'
  +'.slabserif .entryBody{font-family: "Verdana","Slab Serif",Helvetica,sans-serif!important; font-size: 14px; line-height: 1.5em!important;}'
);
