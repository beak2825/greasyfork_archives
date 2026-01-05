// ==UserScript==
// @name        GmailHTMl
// @namespace   ag
// @description gmail html redirect
// @include     https://mail.google.com/mail/u/0/h/*&v=om
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8698/GmailHTMl.user.js
// @updateURL https://update.greasyfork.org/scripts/8698/GmailHTMl.meta.js
// ==/UserScript==

//var a=/(.*\<)([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)(\>.*)/i
//var b="From: <noreply@freepaisa.co>";
//var e = /(.*\<)([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)(\>.*)/igm

//var g=document.body.innerHTML.toString();
//var b=/^Return-Path:.*?<?(\S+@\S+?)>?\s*$/gm
//var e=g.match(b);
//alert(b);
var d=document.body.innerHTML.toString();
//var b=/From:\s(.*\<)([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)(\>.*)/
//var a=/\bFrom:\s\<\b/
//var f = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(\>.*)/g
//var g= /\bFrom:(\s)?(\<)/
var a=/^From:.*?<?(\S+@\S+?)>?\s*$/gim
var c=d.match(a);
//alert(c);
var g=document.body.innerHTML.toString();
var b=/^Return-Path:.*?<?(\S+@\S+?)>?\s*$/gim
var e=d.match(b);
//alert(e);

var str1=c.toString();
var expr1=/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi
var str2=str1.match(expr1);
//alert(str2);
var str3=e.toString();
var str4=str3.match(expr1);
//alert(str4);

var s5=str2.toString();
var s6=str4.toString();

var res=s5.localeCompare(s6);
if(res===0)
  {alert("Mail is Original");
  var url1=document.URL;
var url2=document.URL+"&checked=1";
document.location.href=url2;
  }
else{
  alert("Mail is Fake");
  var url1=document.URL;
var url2=document.URL+"&checked=2";
document.location.href=url2;
}
