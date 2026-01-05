// ==UserScript==
// @name		[Konachan / yande.re / LB] Tag Completion: Keep Focus After Click
// @namespace	Zolxys
// @description	Keeps the focus in the edit box after clicking on a tag in the completion box.
// @include		/^https?://konachan\.com//
// @include		/^https?://konachan\.net//
// @include		/^https?://yande\.re//
// @include		/^https?://lolibooru\.moe//
// @version		1.1
// @downloadURL https://update.greasyfork.org/scripts/9179/%5BKonachan%20%20yandere%20%20LB%5D%20Tag%20Completion%3A%20Keep%20Focus%20After%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/9179/%5BKonachan%20%20yandere%20%20LB%5D%20Tag%20Completion%3A%20Keep%20Focus%20After%20Click.meta.js
// ==/UserScript==
if (TagCompletion) {
	var s = String(TagCompletionBox.prototype.set_current_word).trim();
	eval('TagCompletionBox.prototype.set_current_word = '+ s.substr(0, s.length - 1) +'; this.input_field.focus();}');
}
