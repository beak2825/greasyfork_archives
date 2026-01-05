// ==UserScript==
// @name         magnet kinozal.tv
// @namespace    
// @version      0.2
// @description  magnet maker for kinozal.tv
// @include      http://kinozal.tv/details.php* 
// @include      http://kinozal.tv/comment.php*
// @run-at       document-end
// @grant        none
// @copyright    2014, kvark
// @downloadURL https://update.greasyfork.org/scripts/9983/magnet%20kinozaltv.user.js
// @updateURL https://update.greasyfork.org/scripts/9983/magnet%20kinozaltv.meta.js
// ==/UserScript==
var rplintrID;
function rplhe() {
    var el = document.getElementById('containerdata');
    var rplstr = el.innerHTML;
    if (rplstr.length>15) {
        el.innerHTML = rplstr.replace(/Инфо хеш:\s(.*?)</, 'Magnet-ссылка: <a href=magnet:?xt=urn:btih:$1>magnet:?xt=urn:btih:$1</a><');
        clearInterval(rplintrID);
    }
}
window.startrplhe = function(){rplintrID = setInterval(rplhe, 50)};

var link = document.querySelector('a[onclick*="Список файлов"]');
link.setAttribute('onclick',link.getAttribute('onclick').replace(/(.*?)(return false)/,'$1startrplhe();$2'));

if (document.getElementsByClassName('bx1 justify')[0].innerHTML.match(/Раздача заблокирована/)){link.click()};