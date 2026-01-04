// ==UserScript==
// @name        AO3: Tracking
// @description Track any filterable listing.
// @namespace   https://greasyfork.org/en/scripts/551417-ao3-tracking
// @author	Melissa Pham
// @version	1.6.1
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @include     http*://*archiveofourown.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551417/AO3%3A%20Tracking.user.js
// @updateURL https://update.greasyfork.org/scripts/551417/AO3%3A%20Tracking.meta.js
// ==/UserScript==


(function($) {

	if (typeof(Storage) !== 'undefined') {

		var tracked_list = '';
		var tracked_array = [];

		loadList();

		addCss();
		addTrackedMenu();

		var main = $('#main');

		// if it's a listing of works or bookmarks
		if (main.hasClass('works-index') || main.hasClass('bookmarks-index')) {

			var is_tracked = false;
			var is_first_page = true;

			// get page url
			var location_url = location.href;

			// check if page is already tracked
			var array_index = tracked_array.indexOf(location_url);
			if (array_index > -1) {
				is_tracked = true;

				checkOpen();
			}

			// make sure it's the first page of the listing
			var current_page = main.find('ol.pagination:first span.current');
			if (current_page.length && current_page.text() !== '1') {
				is_first_page = false;
			}

			if (is_first_page) { addTrackButton(); }
		}

		// add "Mark all as vieved" button when all listing get checked
		$(document).ajaxStop(function() {
			if ($('#tracked-box').length && !$('#button-check').length) {
				$('#button-mark').css('visibility', 'visible');
			}
		});
	}

	// load the saved list
	function loadList() {

		tracked_list = localStorage.getItem('ao3tracking_list');
		if (!tracked_list) { tracked_list = ''; }

		// make an array of the list
		if (tracked_list.length) {
			tracked_array = tracked_list.split(',,,');
		}
	}

	// add current page to tracked listings
	function addToTracked() {

		var added = false;

		loadList();

		// if there's less than 75 tracked
		if (tracked_array.length < 75) {

			// ask for name
			var heading = main.find('h2.heading:first');
			var heading_link = heading.find('a');

			if (heading_link.length) {
				var suggest = heading_link.text();
			}
			else {
				var suggest = heading.text().replace(/\n/g, '').replace(/^\s+/, '').replace(/(.+of )?\d+ /, '');
			}

			var listing_name = prompt('Name for the tracked listing:', suggest);

			if (listing_name !== '' && listing_name !== null) {

				// remove characters we don't want in the names
				listing_name = listing_name.replace(/,,,/g, ' ');

				var listing_count = heading.text().replace(/\n/g, '').replace(/^\s+/, '').replace(/.*\d+ - \d+ of /, '').replace(/(\d+)(.+)/, '$1');
                var now = new Date().getTime();

				// add name, url, count
				tracked_array.push(listing_name, location_url, listing_count, now);
				tracked_list = tracked_array.join(',,,');

				// save the updated list
				localStorage.setItem('ao3tracking_list', tracked_list);

				added = true;
			}
		}
		else {
			alert("You're already tracking 75 listings. Remove some first.");
		}

		return added;
	}

	// remove a given url from tracked listings
	function removeFromTracked(url) {

		var removed = false;

		loadList();

		var index = tracked_array.indexOf(url);

		// if the url is on the saved list
		if (index > -1) {

			// ask for confirmation
			var confirmed = confirm('Sure you want to remove "' + tracked_array[index-1] + '"?');

			if (confirmed) {
				// remove name, url, count
				tracked_array.splice(index-1, 4);
				tracked_list = tracked_array.join(',,,');

				// save the updated list
				localStorage.setItem('ao3tracking_list', tracked_list);

				removed = true;
			}
		}

		return removed;
	}

    function getLastChecked(){
        var last_check = localStorage.getItem('ao3tracking_lastcheck');
        return !last_check ? 0 : parseInt(last_check);
    }

	// check open page for new works
	function checkOpen() {
		var heading = main.find('h2.heading:first');

		// get a count of new works
		var current_count = getCountFromHeading(heading.text());
		var saved_count = parseInt(tracked_array[array_index+1]);
		var new_count = current_count - saved_count;
        var last_check = new Date(parseInt(tracked_array[array_index+2]));

        heading.after(' <div id="last-checked">Last checked: ' + last_check.toLocaleDateString() + '</div>');

		if (new_count !== 0) {

			heading.append(' <span id="new-works">(' + new_count + ' new)</span> <a id="mark-viewed">[mark viewed]</a>');

			$('#mark-viewed').click(function() {

				loadList();

				var array_index = tracked_array.indexOf(location_url);
                var now = new Date().getTime();
				if (array_index > -1) {
					// update the count
					tracked_array[array_index+1] = current_count;
                    tracked_array[array_index+2] = now;
					tracked_list = tracked_array.join(',,,');

					// save the updated list
					localStorage.setItem('ao3tracking_list', tracked_list);

                    $('#last-checked').html('Last Checked: ' + new Date(now).toLocaleDateString());
				}

				$('#new-works').detach();
				$(this).detach();
			});
		}
	}

	// check the tracked listings for new works
	function checkForNew() {

		// check if it's more than 8 hours since last check
		var last_check = getLastChecked();

		var now = new Date();
		now = now.getTime();
		var wait = 2880000 - (now - last_check);

		if (wait < 0) {

			localStorage.setItem('ao3tracking_lastcheck', now);

			// for each tracked listing
			$('#tracked-box li.tracked-listing').each(function() {

				var tracked_url = $(this).find('a').attr('href');
				var listing_id = $(this).attr('id');

				tracked_url += ' #main h2.heading:first';

				// load heading of the tracked page
				$(this).find('span.tracked-current').load(tracked_url, function() {

					var listing = $('#' + listing_id);

					// get a count of new works
					var current_count = getCountFromHeading(listing.find('span.tracked-current').text());
					listing.find('span.tracked-current').html(current_count);
					var saved_count = parseInt(listing.find('span.tracked-saved').text());
					var new_count = current_count - saved_count;

					listing.find('span.tracked-new').text('(' + new_count + ' new) Last checked: ' + new Date(last_check).toLocaleDateString());

					if (new_count !== 0) {
						listing.find('span.tracked-new').addClass('new-stuff');
						listing.parent().prepend(listing);
					}
					else {
						listing.find('span.tracked-new').addClass('no-new-stuff');
					}
				});
			});
		}
		else {
			var hours = Math.floor(wait/3600000);
			var minutes = Math.ceil((wait%3600000)/60000);

			var warning = $('<p style="color: #990000;"></p>');

			if (hours > 0) {
				warning.html('<strong>Please be kind to the AO3 servers!</strong> Wait ' + hours + ' hour(s) and ' + minutes + ' minute(s) more before another check.');
			}
			else {
				warning.html('<strong>Please be kind to the AO3 servers!</strong> Wait ' + minutes + ' more minute(s) before another check.');
			}

			$('#tracked-box p.actions').after(warning);
		}
	}

	// add the 'Track This' button
	function addTrackButton() {

		var work_filters = $('form.filters, form.old-filters').find('dd.submit.actions:first');

		var track_this_button = $('<input type="button" value="Track This" class="track-this"></input>');
		track_this_button.click(function() {
			var added = addToTracked();
			if (added) {
				track_this_button.detach();
				work_filters.prepend(untrack_this_button);
			}
		});

		var untrack_this_button = $('<input type="button" value="Untrack This" class="track-this"></input>');
		untrack_this_button.click(function() {
			var removed = removeFromTracked(location_url);
			if (removed) {
				untrack_this_button.detach();
				work_filters.prepend(track_this_button);
			}
		});

		// if the page is already tracked
		if (is_tracked) {
			work_filters.prepend(untrack_this_button);
		}
		// if it's not tracked
		else {
			work_filters.prepend(track_this_button);
		}
	}

	// rearrange things on the list
	function editList() {

		var box_list = $('#box-list');

		box_list.find('li.tracked-listing').each(function() {
			$(this).prepend('<span class="up-arrow clickable">&uarr;</span> <span class="down-arrow clickable">&darr;</span> <span class="cross clickable">&cross;</span> ');
		});

		box_list.on('click', 'span.up-arrow', function() {
			$(this).parent().prev().before($(this).parent());
		});

		box_list.on('click', 'span.down-arrow', function() {
			$(this).parent().next().after($(this).parent());
		});

		box_list.on('click', 'span.cross', function() {
			$(this).parent().detach();
		});
	}

	// save list after edits
	function saveList() {

		tracked_array = [];

		// get name, url, count for all listings
		$('#tracked-box li.tracked-listing').each(function() {

			var name = $(this).find('a').text();
			var url = $(this).find('a').attr('href');
			var count = $(this).find('span.tracked-saved').text();
            var last_check = $(this).find('span.tracked-last-checked') ? new Date($(this).find('span.tracked-last-checked').text()).getTime() : new Date().getTime();

			tracked_array.push(name, url, count, last_check);
		});

		// update and save the new list
		tracked_list = tracked_array.join(',,,');
		localStorage.setItem('ao3tracking_list', tracked_list);

		// reload the box
		$('#tracked-box').detach();
		$('#tracked-bg').detach();
		showBox();
	}

	// update the listings counts
	function markAllViewed() {

		loadList();

		// get the current count for all listings
		$('#tracked-box li.tracked-listing').each(function() {

			var url = $(this).find('a').attr('href');
			var current_count = $(this).find('span.tracked-current').text();

			var index = tracked_array.indexOf(url);
			if (index > -1) {
				tracked_array[index+1] = current_count;
                tracked_array[index+2] = new Date().getTime();
			}
		});

		// update and save the new list
		tracked_list = tracked_array.join(',,,');
		localStorage.setItem('ao3tracking_list', tracked_list);

		// reload the box
		$('#tracked-box').detach();
		$('#tracked-bg').detach();
		showBox();
	}

	// show the box with tracked listings
	function showBox() {

		var tracked_bg = $('<div id="tracked-bg"></div>');

		var tracked_box = $('<div id="tracked-box"></div>');

		var box_buttons = $('<p class="actions"></p>');

		var box_button_check = $('<input type="button" id="button-check" value="Check for new"></input>');
		box_button_check.click(function() {
			box_button_edit.after(box_button_mark);
			checkForNew();
			box_button_edit.detach();
			box_button_check.detach();
		});

		var box_button_edit = $('<input type="button" id="button-edit" value="Edit list"></input>');
		box_button_edit.click(function() {
			editList();
			box_button_edit.after(box_button_save, box_button_cancel);
			box_button_check.detach();
			box_button_edit.detach();
		});

		var box_button_save = $('<input type="button" id="button-save" value="Save list"></input>');
		box_button_save.click(function() { saveList(); });

		var box_button_cancel = $('<input type="button" id="button-cancel" value="Cancel edits"></input>');
		box_button_cancel.click(function() {
			tracked_box.detach();
			tracked_bg.detach();
			showBox();
		});

		var box_button_mark = $('<input type="button" id="button-mark" style="visibility: hidden;" value="Mark all as viewed"></input>');
		box_button_mark.click(function() { markAllViewed(); });

		var box_button_close = $('<input type="button" id="button-close" value="Close"></input>');
		box_button_close.click(function() {
			tracked_box.detach();
			tracked_bg.detach();
		});

		var box_header = $('<h3></h3>').text('Tracked listings [' + tracked_array.length/4 + '/75]:');
		var box_list = $('<ul id="box-list"></ul>');

		tracked_box.append(box_buttons, box_header, box_list);

		// if there are saved listings
		if (tracked_array.length > 2) {
			for (var i = 0; i < tracked_array.length; i += 4) {

				var listing = $('<li id="tracked-listing-' + i/4 + '" class="tracked-listing"></li>').html('<a href="' + tracked_array[i+1] + '">' + tracked_array[i] + '</a> <span class="tracked-new"></span> <span class="tracked-saved">' + tracked_array[i+2] + '</span> <span class="tracked-current"></span><span class="tracked-last-checked">' + new Date(parseInt(tracked_array[i+3])).toLocaleDateString() + '</span>');
				box_list.append(listing);
			}
		}
		else {
			var no_listings = $('<li style="opacity: 0.5; font-style: oblique;"></li>').html("you're not tracking anything yet!");
			box_list.append(no_listings);

			box_button_check.css('visibility', 'hidden');
			box_button_edit.css('visibility', 'hidden');
		}

		box_buttons.append(box_button_check, box_button_edit, box_button_close);

		$('body').append(tracked_bg, tracked_box);
	}

	// attach the menu
	function addTrackedMenu() {

		// get the header menu
		var header_menu = $('ul.primary.navigation.actions');

		// create and insert menu button
		var tracked_button = $('<input class="button" type="button" value="Tracked"></input>');
		header_menu.find('#search').prepend(tracked_button);
		tracked_button.click(function() {
			if ($('#tracked-box').length == 0) {
				loadList();
				showBox();
			}
		});
	}

	// parse heading for works count
	function getCountFromHeading(heading_text) {
		try {
			return parseInt(heading_text.replace(/\n/g, '').replace(/^\s+/, '').replace(/,/g, '').replace(/.*\d+ - \d+ of /, '').replace(/(\d+)(.+)/, '$1'));
		}
		catch (e) {
			return 0;
		}
	}

	// add css rules to page head
	function addCss() {
		var style = $('<style type="text/css"></style>').appendTo($('head'));

		var css = '#tracked-box {position: fixed; top: 0px; bottom: 0px; left: 0px; right: 0px; width: 60%; height: 80%; max-width: 800px; margin: auto; overflow-y: auto; border: 10px solid #eee; box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2); padding: 0 20px; background-color: #ffffff; z-index: 999;}\
			#tracked-bg {position: fixed; width: 100%; height: 100%; background-color: #000000; opacity: 0.7; z-index: 998;}\
			input[type="button"] {height: auto;}\
			.filters input.track-this {margin-bottom: 0; width: 100%;}\
			.old-filters input.track-this {margin-bottom: 10px;}\
			#tracked-box p.actions {float: none; text-align: left;}\
			#button-save {font-weight: bold;}\
			#button-close {float: right;}\
			#tracked-box li span.tracked-new.new-stuff {font-weight: bold;}\
			#tracked-box li span.tracked-new.no-new-stuff {opacity: 0.5;}\
			#tracked-box li span.tracked-current, #tracked-box li span.tracked-saved {display: none;}\
			#tracked-box li .clickable {cursor: pointer; margin-right: 7px;}\
			#new-works {font-weight: bold;}';

		style.append(css);
	}
})(jQuery);
