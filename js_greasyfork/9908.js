// ==UserScript==
// @name        网页翻译
// @namespace   what
// @include     
// @version     1
// @grant       none
// @description:en youdao2.0
// @description youdao2.0
// @downloadURL https://update.greasyfork.org/scripts/9908/%E7%BD%91%E9%A1%B5%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/9908/%E7%BD%91%E9%A1%B5%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==
(
  function () 
  { 
   //alert("Hello I'm GreaseMonkey!");    
   var element=document.createElement('script');
       element.id='outfox_seed_js';
       element.charset='utf-8';
       //element.setAttribute("src","http://fanyi.youdao.com/web2/seed.js?"Date.parse(new Date()));
    element.setAttribute('src','http://fanyi.youdao.com/web2/seed.js?');
   document.body.appendChild(element);
   //alert("Hello I'm GreaseMonkey22222!"); 
  }
  ()
);
