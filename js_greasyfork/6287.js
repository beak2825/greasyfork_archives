// ==UserScript==
// @name        AO3: Kudos/chapters ratio
// @description Hide works with low kudos/chapters ratio.
// @namespace	
// @author	Min
// @version	1.0
// @grant       none
// @include     http://archiveofourown.org/*
// @include     https://archiveofourown.org/*
// @downloadURL https://update.greasyfork.org/scripts/6287/AO3%3A%20Kudoschapters%20ratio.user.js
// @updateURL https://update.greasyfork.org/scripts/6287/AO3%3A%20Kudoschapters%20ratio.meta.js
// ==/UserScript==

// ~~ SETTINGS ~~ //

// minimum kudos per chapter
var set_ratio = 100;

// ~~ END OF SETTINGS ~~ //



// STUFF HAPPENS BELOW //

(function($) {

	// for each work blurb
	$('li.work.blurb').each(function() {
		
		var found_kudos = false;
		
		// get all label elements
		var stat_labels = $(this).find('dl.stats dt');
		
		// search labels for kudos
		for (var i = 0; i < stat_labels.length; i++) {
			
			if (stat_labels.eq(i).text() == 'Kudos:') {
				var kudos_value = stat_labels.eq(i).next();
				found_kudos = true;
			}
		}

		// if kudos were found
		if (found_kudos) {

			var chapters_value = $(this).find('dl.stats dd:nth-of-type(3)');
			
			// get counts
			var chapters_count = parseFloat(chapters_value.text());
			var kudos_count = parseFloat(kudos_value.text());
			
			// count ratio
			var ratio = kudos_count/chapters_count;
			
			if (ratio < set_ratio) {
				$(this).css('display', 'none');
			}
		}
	});
	
	// for each bookmark blurb
	$('li.bookmark.blurb').each(function() {
		
		var found_kudos = false;
		
		// get all label elements
		var stat_labels = $(this).find('dl.stats dt');
		
		// search labels for kudos
		for (var i = 0; i < stat_labels.length; i++) {
			
			if (stat_labels.eq(i).text() == 'Kudos:') {
				var kudos_value = stat_labels.eq(i).next();
				found_kudos = true;
			}
		}

		// if kudos were found
		if (found_kudos) {

			var chapters_value = $(this).find('dl.stats dd:nth-of-type(3)');
			
			// get counts
			var chapters_count = parseFloat(chapters_value.text());
			var kudos_count = parseFloat(kudos_value.text());
			
			// count ratio
			var ratio = kudos_count/chapters_count;
			
			if (ratio < set_ratio) {
				$(this).css('display', 'none');
			}
		}
	});
			
})(jQuery);
