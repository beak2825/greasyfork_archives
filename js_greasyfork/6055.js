// ==UserScript==
// @name		[Konachan] Front Page: Tag Completion
// @namespace	Zolxys
// @description	Adds tag completion to the search box on the front page.
// @include		/^https?://konachan\.com/?($|\?|#)/
// @include		/^https?://konachan\.net/?($|\?|#)/
// @version		1.2
// @downloadURL https://update.greasyfork.org/scripts/6055/%5BKonachan%5D%20Front%20Page%3A%20Tag%20Completion.user.js
// @updateURL https://update.greasyfork.org/scripts/6055/%5BKonachan%5D%20Front%20Page%3A%20Tag%20Completion.meta.js
// ==/UserScript==
new window.TagCompletionBox(document.getElementById('tags'));
if (window.TagCompletion)
	window.TagCompletion.observe_tag_changes_on_submit(document.getElementById('tags').up('form'), document.getElementById('tags'), null);
