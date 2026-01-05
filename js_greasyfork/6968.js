// ==UserScript==
// @name           Juick AdBlock
// @description    Вырезка пустого блока рекламы
// @icon           https://lh5.ggpht.com/6QKa9iWVq9KDYAJB1ZtL1mh-xR6x-U5UO7sR37b9LLtpkAK0tcAE1XBx83gLz168Qhg=w300
// @include        http://juick.com/*
// @grant          none
// @version 0.0.1.20141212220857
// @namespace https://greasyfork.org/users/7568
// @downloadURL https://update.greasyfork.org/scripts/6968/Juick%20AdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/6968/Juick%20AdBlock.meta.js
// ==/UserScript==

//var div = document.getElementsByClassName('title2')[0]; // получаем див
//div.parentNode.removeChild(div.nextSibling.nextSibling);

var div = document.getElementById('yandex_ad_728'); // получаем див
div.parentNode.removeChild(div);