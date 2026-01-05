// ==UserScript==
// @name         IndieRoyale: Show only owned bundles and enable search by name
// @namespace    lainverse_indieroyale_show_only_owned_bundles
// @version      0.2
// @description  I have no idea how IR considers their library useful for their customers. -_- So, here is my attempt to fix it.
// @author       lainverse
// @match        http://www.indieroyale.com/collection
// @match        https://www.indieroyale.com/collection
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8142/IndieRoyale%3A%20Show%20only%20owned%20bundles%20and%20enable%20search%20by%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/8142/IndieRoyale%3A%20Show%20only%20owned%20bundles%20and%20enable%20search%20by%20name.meta.js
// ==/UserScript==

var bdy = document.querySelector('.deal');
if (!bdy) return; bdy = bdy.parentNode;

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = ''+
    ' .body .deal {height:266px!important;margin:0!important;padding:10px 15px!important}'+
    ' .body .deal > a, .body .deal > div, .body .deal > div > a:first-child {height:266px!important}'+
    ' .body .deal > a, .body .deal > div > a:first-child {position:relative!important}'+
    ' .body .deal > div > a:first-child {display:block!important;height:100%!important}'+
    ' .body hr {height:12px;border:0;box-shadow:inset 0 12px 12px -12px rgba(0,0,0,0.5)}'+
    ' .body img {display:block;margin:auto;position:absolute;bottom:18px;left:0;right:0}'+
    ' .body span {display:block;width:100%;position:absolute;bottom:0}';
console.log(style);
bdy.insertBefore(style,bdy.querySelector(':first-child'));

bdy.appendChild(document.createElement('hr'));

[].forEach.call(document.querySelectorAll('.deal'),function(i){
    if(i.querySelector('.wantbundle')) bdy.appendChild(i);
    i.classList.remove('dealalt');
    i.querySelector('a').appendChild((function(i){
        var t = document.createElement('span');
        t.innerHTML = i.querySelector('img').getAttribute('alt');
        return t;
    })(i));
});