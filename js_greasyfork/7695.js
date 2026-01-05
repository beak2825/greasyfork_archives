// ==UserScript==
// @name        InoReader Colorful ListView
// @name:en        InoReader Colorful ListView
// @namespace   https://greasyfork.org/zh-CN/scripts/7695
// @version     20170628
// @description 按来源为条目设置不同的背景颜色
// @description:en Set different background colors to article header based on article sources
// @author         http://t.qq.com/HeartBlade
// @include        http*://www.inoreader.com/*
// @include        http*://inoreader.com/*
// @include        http*://beta.inoreader.com/*
// @grant            GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/7695/InoReader%20Colorful%20ListView.user.js
// @updateURL https://update.greasyfork.org/scripts/7695/InoReader%20Colorful%20ListView.meta.js
// ==/UserScript==
(function() {
document.getElementById("reader_pane").addEventListener("DOMNodeInserted",function (){
	var article=document.getElementsByClassName("article_header");
	for(var i=0;i<article.length;i++){
		var hue=article[i].parentNode.attributes["data-suid"].value*10%360;
		if (/article_unreaded/.test(article[i].parentNode.className)){
			article[i].parentNode.setAttribute("style","background-color:hsl("+hue+",70%,80%);");
			article[i].childNodes[3].childNodes[1].setAttribute("style","background-color:hsl("+hue+",70%,80%);");
		}else if(/\barticle\b/.test(article[i].parentNode.className)){
			article[i].parentNode.style.background="";
			article[i].childNodes[3].childNodes[1].setAttribute("style","background-color:#f2f2f2");
		}
	}
},false);

var css= ".ar {   position:relative!important;margin:0!important; } .article_header_text{   padding-left:58px;   min-width:0px!important; } .ar .arrow_div{   position:static!important;   float:left!important; } .ar .arrow_div .header_buttons{   position:absolute!important;   left:20px!important;   top:6px!important;   right:auto!important; }  .ar .arrow_div .header_date{   position:absolute!important;   z-index:99!important;   color:#000!important;   right:0px !important;   top:-5px;   width:auto!Important;   padding:9px 0px 9px 10px!important;   opacity:1!important; }  .article_current .header_date{background:none!important;}.ar:hover,.ar:hover .header_date{background:#A5FFE8!important;}.article_header .feed_favicon{margin-top:4px!important;}.block_article_ad,.ad_title,.inner_ad,#sinner_container{display: none!important;}#sb_rp_tools,#sb_rp_notifications,#sb_rp_gear{margin-right:-60px!important;}#sb_rp_upgrade_button{display: none!important;}#reader_pane.reader_pane_sinner{padding-right:0px!important;}";
GM_addStyle(css);
})();