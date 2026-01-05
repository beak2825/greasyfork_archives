// ==UserScript==
// @name		[Konachan] Tag Completion: Fix Tag Colors
// @namespace	Zolxys
// @description	Fixes the colors for circle and style tags in the tag completion boxes.
// @include		/^https?://konachan\.com//
// @include		/^https?://konachan\.net//
// @exclude		/^[^#?]+\.\w+($|\?|#])/
// @version		1.3
// @downloadURL https://update.greasyfork.org/scripts/6060/%5BKonachan%5D%20Tag%20Completion%3A%20Fix%20Tag%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/6060/%5BKonachan%5D%20Tag%20Completion%3A%20Fix%20Tag%20Colors.meta.js
// ==/UserScript==
var ne = document.createElement('script');
ne.setAttribute('type','text/javascript');
ne.innerHTML='Post.tag_type_names[5] = "style";\nPost.tag_type_names[6] = "circle";';
document.head.appendChild(ne);
