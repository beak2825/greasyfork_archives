// ==UserScript==
// @name		[Konachan] Delete Post: Increase "Reason" Box Length
// @namespace	Zolxys
// @description	Increases the size of the text input box when deleting a post. This also increases the size of the auto-completion dropdown list.
// @include		/^https?://konachan\.(com|net)/post/delete/\d+/?($|\?|#)/
// @version		1.0
// @downloadURL https://update.greasyfork.org/scripts/6052/%5BKonachan%5D%20Delete%20Post%3A%20Increase%20%22Reason%22%20Box%20Length.user.js
// @updateURL https://update.greasyfork.org/scripts/6052/%5BKonachan%5D%20Delete%20Post%3A%20Increase%20%22Reason%22%20Box%20Length.meta.js
// ==/UserScript==
document.getElementById('reason').size = 85;
