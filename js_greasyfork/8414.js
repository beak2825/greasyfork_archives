// ==UserScript==
// @name            kuban.ru
// @include	        *kuban.ru/f*
// @grant
// @description     Доработка форума kuban.ru
// @version         15.03.06.0310
// @homepageURL     https://greasyfork.org/ru/scripts/8414
// @supportURL      https://greasyfork.org/ru/scripts/8414
// @icon            http://forums.kuban.ru/img/favicon.ico
// @namespace https://greasyfork.org/users/9550
// @downloadURL https://update.greasyfork.org/scripts/8414/kubanru.user.js
// @updateURL https://update.greasyfork.org/scripts/8414/kubanru.meta.js
// ==/UserScript==

//var n;

function r(e){
  p=e.parentNode;
  p.removeChild(e);
}

//	удалить все <script>
//	http://stackoverflow.com/a/14003661
n=document.getElementsByTagName('noscript');	//	NodeList
while(n[0])n[0].parentNode.removeChild(n[0]);

n=document.getElementsByTagName('script');	//	NodeList
while(n[0])n[0].parentNode.removeChild(n[0]);

n=document.getElementsByTagName('br');	//	NodeList
//n[0].parentNode.removeChild(n[0]);
//n[0].parentNode.removeChild(n[0]);
r(n[0]);
r(n[0]);

n=document.getElementsByTagName('table');
//n[0].parentNode.removeChild(n[0]);
r(n[0]);

n=document.querySelectorAll('div[style="padding-right: 65px"][align="right"]');	//	NodeList
//n[0].parentNode.removeChild(n[0]);
r(n[0]);

n=document.getElementsByTagName('center');	//	NodeList
//n[1].parentNode.removeChild(n[1]);
//n[1].parentNode.removeChild(n[1]);
r(n[1]);
r(n[1]);

n=document.getElementsByTagName('br');	//	NodeList
//n[1].parentNode.removeChild(n[1]);
//n[1].parentNode.removeChild(n[1]);
r(n[1]);
r(n[1]);

n=document.querySelectorAll('div[style="width:90%; margin: 0 auto;"]');	//	NodeList
//n[0].parentNode.removeChild(n[0]);
r(n[0]);

n=document.querySelectorAll('div[style="z-index:3"]');	//	NodeList
//n[0].parentNode.removeChild(n[0]);
r(n[0]);

n=document.getElementsByTagName('br');
n[n.length-1].parentNode.removeChild(n[n.length-1]);
n[n.length-1].parentNode.removeChild(n[n.length-1]);

n=document.getElementsByTagName('table');
//n[n.length-1].parentNode.removeChild(n[n.length-1]);
//n[n.length-1].parentNode.removeChild(n[n.length-1]);
r(n[n.length-1]);
r(n[n.length-1]);

n=document.querySelectorAll('div[id="banners"]');	//	NodeList
//n[0].parentNode.removeChild(n[0]);
r(n[0]);

n=document.querySelectorAll('div[align="center"]');	//	NodeList
//n[0].parentNode.removeChild(n[0]);
r(n[0]);

n=document.getElementsByTagName('br');
n[n.length-1].parentNode.removeChild(n[n.length-1]);
n[n.length-1].parentNode.removeChild(n[n.length-1]);


//alert(n.length);
//alert(n[0].innerHTML);

//iframe