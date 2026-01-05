// ==UserScript==
// @name           Fixed Stack Exchange Top Bar
// @author         Cameron Bernhardt (AstroCB)
// @version        2.2
// @namespace  https://github.com/AstroCB
// @description  Fixes the top bar of Stack Exchange sites so that it remains at the top with scrolling
// @include        http://*.stackexchange.com/*
// @include        http://stackoverflow.com/*
// @include        http://meta.stackoverflow.com/*
// @include        http://serverfault.com/*
// @include        http://meta.serverfault.com/*
// @include        http://superuser.com/*
// @include        http://meta.superuser.com/*
// @include        http://askubuntu.com/*
// @include        http://meta.askubuntu.com/*
// @include        http://stackapps.com/*
// @downloadURL https://update.greasyfork.org/scripts/6467/Fixed%20Stack%20Exchange%20Top%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/6467/Fixed%20Stack%20Exchange%20Top%20Bar.meta.js
// ==/UserScript==
var bar = document.getElementsByClassName("topbar")[0];
bar.style.position = "fixed";
bar.style.backgroundColor = "black";
bar.style.zIndex = "12345";
document.getElementById("header").style.paddingTop = "34px";