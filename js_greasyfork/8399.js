// ==UserScript==
// @name        迅雷快传显示全部下载链接
// @namespace   https://greasyfork.org/zh-CN/scripts/8399
// @author      天涯倦客
// @supportURL http://t.qq.com/HeartBlade
// @description 文件列表下面插入一个文本框，显示所有文件的下载链接（包括没勾选的）
// @include     http://kuai.xunlei.com/d/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8399/%E8%BF%85%E9%9B%B7%E5%BF%AB%E4%BC%A0%E6%98%BE%E7%A4%BA%E5%85%A8%E9%83%A8%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/8399/%E8%BF%85%E9%9B%B7%E5%BF%AB%E4%BC%A0%E6%98%BE%E7%A4%BA%E5%85%A8%E9%83%A8%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
(function(){
	var urls = '',i;
	var fname=document.querySelectorAll(".file_name");
	var flength=fname.length;
	for (i=0;i<flength;i++){
		urls+=fname[i].href+'\n';
	}
	var txt=document.createElement("textarea");
	txt.value=urls;
	txt.id="down_links";
	txt.style="width:677px;height:300px;";
	document.querySelectorAll(".file_w")[0].appendChild(txt);
	txt.focus();
	txt.select();
})();
