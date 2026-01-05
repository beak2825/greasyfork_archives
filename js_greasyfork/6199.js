// ==UserScript==
// @name Automatic Gelbooru Fullwindow Image Preview
// @author ElDoRado1239
// @version 0.1
// @description Shows the original versions of images in a full-window size. This preview will disappear upon clicking.
// @include *gelbooru.com*view*
// @namespace https://greasyfork.org/users/6103
// @downloadURL https://update.greasyfork.org/scripts/6199/Automatic%20Gelbooru%20Fullwindow%20Image%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/6199/Automatic%20Gelbooru%20Fullwindow%20Image%20Preview.meta.js
// ==/UserScript==

var img;
var a = document.getElementsByTagName('a');
for(var i=0;i<a.length;i++) if(a[i].innerHTML=='Original image'){img=a[i].href;break;}
document.body.innerHTML += '<div style="position:absolute;left:0px;top:0px;width:100%;height:100%;background-image:url('+img+');background-size:contain;background-repeat:no-repeat;background-position:center center;" onclick="this.parentElement.removeChild(this);"></div>';