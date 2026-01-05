// ==UserScript==
// @name         mTurk Title Bar Timer
// @author       antithought
// @version      1.0.1
// @description  Displays time remaining for HIT in title bar.
// @include      https://www.mturk.com/mturk/accept*
// @include      https://www.mturk.com/mturk/previewandaccept*
// @include      https://www.mturk.com/mturk/continue*
// @include      https://www.mturk.com/mturk/submit*
// @namespace    https://greasyfork.org/users/6438
// @downloadURL https://update.greasyfork.org/scripts/6151/mTurk%20Title%20Bar%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/6151/mTurk%20Title%20Bar%20Timer.meta.js
// ==/UserScript==

var original_title = document.title;
var st = unsafeWindow.serverTimestamp;
var et = unsafeWindow.endTime;
var timer_id;
var offset;

if (st && et) {
	timer_id = setInterval(function() {
		if (!offset) { offset = (new Date()).getTime() - st; }
		var left = Math.floor((et.getTime() - (new Date()).getTime() + offset) / 1000);
		var days = Math.floor(left / (86400));
		var hours = Math.floor(left / 3600) % 24;
		var mins = Math.floor(left / 60) % 60;
		var secs = left % 60;
		document.title = original_title + ": " + days + ":" + hours + ":" + ("0" +mins).slice(-2) + ":" + ("0" +secs).slice(-2);
	}, 1000);
}