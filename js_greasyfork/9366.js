// ==UserScript==
// @name        sig easy copy
// @author      Nick Hall
// @namespace   http://soitgo.es
// @include     https://soitgo.es/
// @include     https://soitgo.es/?*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @version     1.2.5
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @description easy copying on sig
// @downloadURL https://update.greasyfork.org/scripts/9366/sig%20easy%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/9366/sig%20easy%20copy.meta.js
// ==/UserScript==
$(document).ready(function()
{
	if ($('#login').length === 0)
	{
		easycopy.init();
	}
});

var easycopy = {
	init: function()
	{
		easycopy.loadSettings();
		console.log(easycopy.settings);

		// Add x and + links
		$('#links .date').append('<span class="easycopy"><a href="#" class="ezc-links">x</a> <a href="#" class="ezc-thumbs">+</a></span>');
		$('.easycopy a.ezc-links').click(easycopy.handleClick);
		$('.easycopy a.ezc-thumbs').click(easycopy.thumbsClick);

		// Link box, loading box
		$('#links').before('<div id="ezc-textcontainer" style="height: 100px; clear: both; margin: 0 20px 20px 20px; padding: 0 !important;"><textarea id="easycopytext" style="width: 922px; height: 98px; padding: 0 !important; margin: 0 !important; z-index: 10;" placeholder="Click the x to the right of each link to get started."></textarea></div><div id="ezc-loading" style="position: fixed; bottom: 0; right: 0;">Loading...</div>');
		$('#ezc-loading').hide();
		$('#easycopytext').focus(function() {$(this).select();});

		//Comment this out if you don't want the top link I guess
		$('body').append('<div id="toTheTop" style="position: fixed; left: 5px; bottom: 5px;"><a href="#">top</a></div>');
		$('#toTheTop').click(function(e)
		{
			e.preventDefault();
			window.scrollTo(0, 0);
		});

		// Settings page
		var settingsIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAJ2SURBVDhPjVVJixNBFC69qD9BVBwVFQ+DN/EPCIoHYYbxrqC3HHKc5BAIgWxGzB6ym5iNNGTS2ZeLiKcR5uBfEBM3RNwHpP2eqeeUPR31g0dXV73vq7dUdYu/weFwHK1Wq497vd6Lbrf7sl6vP3U6nSfl8v/B5/OtyqEIBAJXx+OxQTYajYzJZGIEg8E1uSy8Xu9FObRGMpncHAwG3zOZTLJYLBYQ1cfhcGiohrlP5YflR/B5gMh30+m0W9L/wIFwOLxJEXAkPDYLmten06kRi8U8pLGQAtxu9yo7W5E5batN6J3M4/FcknJCuFyuw9lsNkEEdiQBXdc/IPVsKpW6i3LcKRQKqXa7/U71o3EulyvZ7fYjUm6BYqGYY0d6NpvN52qDGH6//7zW1J6pvqVSqSmXhcAxOAHiFRT4C4ePwr9HGS5Il30A51Rnq/OGuw//b9C4hkxXBJ0zXuAdkX5GcpcC3b1HDSEOcUmj0WhsC0Q2YzEWTCQStyVvKaLR6DqJME9G+ooE52bBeDx+S/KWIhKJrFkIvhZ0nbjALJjP55OStxRI2WvmoVk7VOAzuGI3qLC0C1lH77ylecndBxT/eKvVmilN2Q2FQuuYPycMIYxlhiNyVmr8Bu7vSq1We8LR0bNcLm/JZbBUEYLyTpHi0IZwtW6iURvovl9v6XNzqrjXWZvNduifgpQOESg1MhrTHIuRcZlw9S7vCVpBCqpkFiBhFqeziOjvo34H9wTZpBBbv9//bBbEMftaqVTaKEUO7z+oJL+EGKqAWRAf0+ucEhmljW5uSCp9jBdpqlAFzIZfwDGtoW0j0hlsrmnaDlI7LakWEOIn6cMDH2scnnQAAAAASUVORK5CYII=';
		$('body').append('<div id="ezc-settings-div" style="position: fixed; width: 800px; max-height: 500px; top: 50%; left: 50%; margin-left: -400px; margin-top: -250px; background-color: ' + $('body').css('background-color') + '; border: 2px solid ' + $('body').css('color') + '; border-radius: 10px; padding: 10px;">\
							<h2>Settings</h2>\
							<p><label>Show link box by default <input type="checkbox" id="ezc-settings-linkbox" /></label></p>\
							<button id="ezc-settings-save">Save</button>\
							<p><a href="#" class="ezc-settings-open">Close</a></p>\
							</div>');
		$('#ezc-settings-div').hide();
		$('#ezc-settings-save').click(easycopy.saveSettings);
		$('nav .ten.columns.omega').append('<a href="#" class="ezc-settings-open"><img src="' + settingsIcon + '" style="height: 20px; width: 20px; margin-bottom: 5px;" /></a>');
		$('.ezc-settings-open').click(function(e) {e.preventDefault(); $('#ezc-settings-div').toggle('fast');});
		if(easycopy.settings.showLinkBox) $('#ezc-settings-linkbox').prop('checked', true);

		// Another div for status messages
		$('body').append('<div id="ezc-status" style="position: fixed; right: 5px; top: 5px; background-color: #191919 !important; color: white !important; padding: 5px !important;">This should never be seen</div>');
		$('#ezc-status').hide();

		MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
		var observer = new MutationObserver(function(mutations)
		{
			mutations.forEach(function(mutation)
			{
				if (typeof mutation.addedNodes == "object")
				{
					$(mutation.addedNodes).find('.date').each(function()
						{
							$(this).append(' <span class="easycopy"><a href="#" class="ezc-links">x</a> <a href="#" class="ezc-thumbs">+</a></span>');
							$(this).find('.ezc-links').click(easycopy.handleClick);
							$(this).find('.ezc-thumbs').click(easycopy.thumbsClick);
						});
				}
			});
		});

		// define what element should be observed by the observer
		observer.observe(document, {
			subtree: true,
			childList: true
		});

		// Set up moving the text area on scroll
		var textareaInitialPosition = $('#easycopytext').offset().top - 10;
		$(window).scroll(function()
		{
			if ($(window).scrollTop() > textareaInitialPosition)
			{
				$('#easycopytext').css('position', 'fixed');
				$('#easycopytext').css('top', '10px');
			}
			else
			{
				$('#easycopytext').css('position', '');
				$('#easycopytext').css('top', '');
			}
		});

		// Throw in some custom inline CSS for voting links (since we need to use !important)
		$('head').append('<style type="text/css">\
			.ezc-flood {\
				color: orange !important;\
			}\
			.ezc-voted {\
				color: green !important;\
			}\
			.ezc-alreadyvoted {\
				color: red !important;\
			}\
			.easycopy button {\
				margin: 0 !important;\
			}\
			</style>');

		// Show/hide the link box if we want
		$('#middlebar > a:nth-child(4)').after('<button id="ezc-linkToggle">Link Box</button>');
		$('#ezc-linkToggle').click(function(e)
		{
			$('#ezc-textcontainer').toggle('fast');
		});
		if (!easycopy.settings.showLinkBox) $('#ezc-textcontainer').hide();
	},

	handleClick: function(event)
	{
		event.preventDefault();
		var url = $(this).parent().parent().prev().find('.title').parent().attr('href'); // This was being really finnicky
		$(this).parent().parent().prev().find('.title').css("cssText", "color: #FF0000 !important;");
		easycopy.enqueue();
		$.get(url, easycopy.populateURLBox);
		$(this).remove();
	},

	thumbsClick: function(event)
	{
		event.preventDefault();
		var linkID = $(this).parent().parent().prev().find('.title').parent().attr('href').split(':');
		var currentLink = $(this);
		if (currentLink.hasClass('ezc-alreadyvoted') || currentLink.hasClass('ezc-voted'))
		{
			easycopy.displayMessage("Already voted");
			return; // Don't pester the server if we've already voted
		}
		easycopy.enqueue('vote');
		$.ajax('ajax.php?i=link&thank=' + linkID[1]).done(function (msg)
			{
				currentLink.removeClass('ezc-flood');
				currentLink.removeClass('ezc-voted');
				currentLink.removeClass('ezc-alreadyvoted');
				if (msg == 'flood')
				{
					currentLink.addClass('ezc-flood');
					easycopy.displayMessage("Please wait");
					console.log("FLOOD!!!");
				}
				else if (msg)
				{
					easycopy.displayMessage("Vote successful");
					currentLink.addClass('ezc-voted');
					console.log("VOTED");
				} 
				else
				{
					easycopy.displayMessage("Already voted");
					currentLink.addClass('ezc-alreadyvoted');
					console.log("Already voted");
				}
				easycopy.dequeue();
			}
			);
	},

	populateURLBox: function(data)
	{
		var linkData = "";
		var password = $(data).find('#password').text();
		linkData += $(data).find('#title').text() + ' [password: ' + password + ']\n';
		$(data).find('#links_mega a').each(function() { linkData += $(this).attr('href') + '\n\n'; });
		$('#easycopytext').val($('#easycopytext').val() + linkData);
		easycopy.dequeue();
	},

	loadingCount: 0,

	enqueue: function(type)
	{
		easycopy.loadingCount++;
		if (type !== 'vote')
		{
			$('#easycopytext').prop('disabled', true);
			$('#easycopytext').css('user-select', 'none');
		}
		$('#ezc-loading').show('fast');
	},

	dequeue: function(type)
	{
		easycopy.loadingCount--;
		if (easycopy.loadingCount === 0)
		{
			if (type !== 'vote')
			{
				$('#easycopytext').prop('disabled', false);
				$('#easycopytext').css('user-select', 'all');
			}
			$('#ezc-loading').hide('slow');
		}
	},

	displayMessage: function(message)
	{
		$('#ezc-status').text(message);
		$('#ezc-status').show('fast').delay(3000).fadeOut();
	},

	settings: [],

	saveSettings: function()
	{
		GM_setValue('showLinkBox', $('#ezc-settings-linkbox').is(':checked'));
		easycopy.displayMessage("Settings saved");
	},

	loadSettings: function()
	{
		var settings = GM_listValues();
		if (settings.length === 0)
		{
			easycopy.runFirstTime(); // Run if we haven't saved anything yet
			settings = GM_listValues(); // Reload
		}
		for (var i = 0; i < settings.length; i++)
		{
			easycopy.settings[settings[i]] = GM_getValue(settings[i]);
		}
	},

	runFirstTime: function()
	{
		console.log('Running initial setup...');
		console.log('Defaulting link box display to true');
		GM_setValue('showLinkBox', true);
	}
};