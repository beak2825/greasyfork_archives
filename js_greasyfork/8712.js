// ==UserScript==
// @name        福利吧网盘自动补全
// @namespace   https://greasyfork.org/zh-CN/scripts/8712
// @author      ShawnMew
// @description 自动补全页面中的网盘地址（支持百度网盘和115礼包）
// @include     http://fuli.ba/*
// @include     http://fuliba.mobi/*
// @include     http://fuliba.asia/*
// @include     http://api.uyan.cc/v4/comment/?uid=1701916*
// @version     1.1.0.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8712/%E7%A6%8F%E5%88%A9%E5%90%A7%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E8%A1%A5%E5%85%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/8712/%E7%A6%8F%E5%88%A9%E5%90%A7%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E8%A1%A5%E5%85%A8.meta.js
// ==/UserScript==

(function(){
     var strHTML=window.document.body.innerHTML;
	
	//用于匹配的正则表达式
	var strMatch={
        bd:/\/?s\/(\w{8})(?:\s+(\w{4}))?/g,  //度娘 类型：s/1i31aCbb /s/1i31aCbb
        yyw:/(\/?lb\/)?(5lb[a-zA-Z0-9]{8,12})/g  //115礼包：lb/5lbeo3p8eh02 /lb/5lbeo3p8eh02
	};
    
	//用于替换的链接
	var strURL=[]; 
	strURL.bd="http://pan.baidu.com/s/$1";
	strURL.yyw="http://u.115.com/lb/$2";
	
 	//预处理：将原有的链接删除；
	strHTML=strHTML.replace("http://pan.baidu.com/s/","/s/");
	strHTML=strHTML.replace("http://115.com/lb/","/lb/");

 	//预处理：将原有的链接删除(一般出现在评论)；
	strHTML=strHTML.replace("pan.baidu.com/s/","/s/");
	strHTML=strHTML.replace("115.com/lb/","/lb/");
	
	//替换网盘
	strHTML = strHTML.replace(strMatch.bd,strURL.bd);//百度
	strHTML = strHTML.replace(strMatch.yyw,strURL.yyw);//115
    
    window.document.body.innerHTML=strHTML;
})();