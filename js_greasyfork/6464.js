// ==UserScript==
// @id ReverseYouTubeWatchLaterlist
// @name       Reverse YouTube Watch Later List
// @namespace  http://kjung.ca
// @version    0.2
// @description  Reverses the list order for the Youtube Watch Later page
// @match      https://www.youtube.com/*
// @match      http://www.youtube.com/*
// @copyright  2014+, Kevin Jung
// @require https://code.jquery.com/jquery-latest.min.js
// @require https://greasyfork.org/scripts/1003-wait-for-key-elements/code/Wait%20for%20key%20elements.js?version=2765
// @downloadURL https://update.greasyfork.org/scripts/6464/Reverse%20YouTube%20Watch%20Later%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/6464/Reverse%20YouTube%20Watch%20Later%20List.meta.js
// ==/UserScript==

waitForKeyElements ("#pl-video-table", reverseYouTubeWatchLaterlist);

function reverseYouTubeWatchLaterlist () {
	$('html, body').css('display', 'none');

	// Set variables.
	var wishListRows = [],
		reversedList = '';

	// Loop through watch later table rows.
	$('#pl-video-table > tbody  > tr').each(function() {
		var video = $(this);

		// Push each video into the array.
		wishListRows.push(video[0]);

		video.remove();
	});

	// Reverse the item order of the array.
	wishListRows = wishListRows.reverse();

	// Loop through each video.
	$.each(wishListRows, function(index, video) {

		// Append the HTML contents of the video into a string.
		reversedList += video.outerHTML;
	});

	// Append the string with all video HTML DOM into the watch later table.
	$('#pl-load-more-destination').append(reversedList);

	$('html, body').css('display', 'block');
}