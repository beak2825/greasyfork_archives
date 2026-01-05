// ==UserScript==
// @id             www.weibo.com-c53e41ab-a0ae-463a-82a4-f2584743a9f0@scriptish
// @name           Weibo6 Styles
// @version        0.2.2
// @namespace      me.fts.weibo
// @author         fanthos
// @description    Change the style of nav panel of weibo v6
// @include        http://*.weibo.com/*
// @include        http://weibo.com/*
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/6126/Weibo6%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/6126/Weibo6%20Styles.meta.js
// ==/UserScript==
// ==/UserScript==
(function(){

myproc=function(){
	obj1=document.getElementsByClassName("WB_left_nav")[0];
	obj2=document.getElementsByClassName("WB_main_c")[0];
	if(!obj1 || !obj2)
	{
		setTimeout(myproc, 10);
		return;
	}
	obj1.style.borderRadius="2px";
	obj1.style.textShadow="1px 0 #444, 0 1px #444, -1px 0 #444, 0 -1px #444";

}

myproc();

})();
