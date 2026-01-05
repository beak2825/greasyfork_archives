// ==UserScript==
// @name		[Konachan] Profile: Prevent Overlap
// @namespace	Zolxys
// @description	When non-breaking text (such as IPv6) forces the left column to widen, this will move the right column along with it to prevent overlap.
// @include		/http://konachan\.(com|net)/user/show/\d+/?($|\?|#)/
// @version		1.0
// @downloadURL https://update.greasyfork.org/scripts/6058/%5BKonachan%5D%20Profile%3A%20Prevent%20Overlap.user.js
// @updateURL https://update.greasyfork.org/scripts/6058/%5BKonachan%5D%20Profile%3A%20Prevent%20Overlap.meta.js
// ==/UserScript==
var a = document.getElementById('content').childElements()[1];
var w = a.style.width;
a.style.width = '';
a.firstElementChild.style.width = w;
