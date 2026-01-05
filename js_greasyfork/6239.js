// ==UserScript==
// @name        DOM Blocker
// @namespace   DOM Blocker
// @include     *
// @version     1
// @grant       none
// @description blank
// @downloadURL https://update.greasyfork.org/scripts/6239/DOM%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/6239/DOM%20Blocker.meta.js
// ==/UserScript==


RegExp.escape= function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};
function escapeRegExp(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
window.addEventListener ("DOMContentLoaded", Greasemonkey_main, false);
function Greasemonkey_main ()
{
var mod = "gi"
var search = "youarebad"
var search2 = "Hello World"
var replace = "youarebad"
var regex = "t"
if (regex == "t")
{
search = new RegExp(search, mod);
//alert(search);
}
else
{
//search = '/'+search2+'/gi'
//search = /Hello World/gi
search = new RegExp(escapeRegExp(search), mod);
//alert(search);
}

document.documentElement.innerHTML = document.documentElement.innerHTML.replace( search, replace);

}