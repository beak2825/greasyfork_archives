// ==UserScript==
// @name           (indev) Barefoot Essentials for GOG.com
// @namespace      http://userscripts.org/users/274735
// @description    Enhances the GOG.com website
// @include        https://www.gog.com/*
// @include        http://www.gog.com/*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @version        2.3.3
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/860/%28indev%29%20Barefoot%20Essentials%20for%20GOGcom.user.js
// @updateURL https://update.greasyfork.org/scripts/860/%28indev%29%20Barefoot%20Essentials%20for%20GOGcom.meta.js
// ==/UserScript==

/*
key codes on Chrome
q17 y25 i9 b2 enter-10 \28 ]29
*/

/*-- constants --*/
var version = '2.3.3'
var default_prev_version = '2.2.2'	// On first use, all versions after this will be shown in the chanelog
var branch = 'Barefoot_Monkey/GreaseMonkey'	// author/platform. If you fork this then please change this as appropriate. Please also change the @namespace to your own.

var config = {
	'Changelog': [
	],
	'Navigation bar': [
		{ type: 'choice', options: ['normal', 'new and colourful', 'new with old logo', 'old-school'], def: 'new and colourful', key: 'navbar-style', label: 'Navigation bar style' },
		{ type: 'choice', options: ['fixed (normal)', 'absolute'], def: 'fixed (normal)', key: 'navbar-position', label: 'Navigation bar position' },
		{ type: 'choice', options: ['normal', 'red', 'green'], def: 'red', key: 'navbar-notification-style', label: 'Notification style' },
		{ type: 'range', min: 0, max: 1, step: 0.1, def: 1, key: 'navbar-opacity', label: 'Fadeout opacity' },
		{ type: 'multibool', options: { 'games': true, 'movies': true}, key:'navbar-show-sections', label:'Show sections in navigation bar'},
		{ type: 'multibool', options: { 'game updates': true, 'forum replies': true, 'new messages': true }, key:'navbar-show-alerts', label:'Show notifications on the navigation bar'},
		// { type: 'bool', def: true, key: 'navbar-library-links', label: 'Direct links to your game list and shelf in the menu' },
		// { type: 'bool', def: true, key: 'navbar-fix-search-button', label: 'Allow the search button to work throughout the site' },
		{ type: 'choice', options: ['top', 'bottom'], def: 'top', key: 'navbar-essentials-position', label: 'Position of "Essentials" menu item' },
	],
	'Forums': [
		{ type: 'bool', def: true, key: 'forum-username-link', label: 'make usernames link to GOGWiki' },
		{ type: 'bool', def: true, key: 'forum-avatar-zoom', label: 'click on avatars to view at original size' },
		{ type: 'bool', def: true, key: 'forum-title-settings', label: 'click on own title to change forum settings' },
		{ type: 'bool', def: true, key: 'forum-move-edit-note', label: 'restyle "post edited" note on edited posts' },
		{ type: 'choice', options: ['normal', 'distinct', 'clear'], def: 'distinct', key: 'forum-quotation-style', label: 'quotation style' },
		{ type: 'bool', def: true, key: 'forum-post-preview', label: 'preview on post/reply window' },
		{ type: 'bool', def: true, key: 'forum-quick-post', label: 'enable quick post' },
		{ type: 'bool', def: true, key: 'forum-hide-spoilers', label: 'hide spoilers' },
		{ type: 'bool', def: true, key: 'forum-bold-text', label: 'enhanced bold text' },
		{ type: 'choice', options: ['leave as they are', 'group and collapse', 'group and expand', 'group below other topics', 'hide'], def: 'group below other topics', key: 'forum-group-giveaways', label: 'giveaway topics (page refresh required)' },
		{ type: 'bool', def: false, key: 'forum-show-hover-elements', label: 'Always show on-hover elements in forum posts', comment: 'Online/Offline status, PM button, and post link number' },
		{ type: 'bool', def: false, key: 'forum-collapsible-footer', label: 'Collapsible footer in forum topics' },
		{ type: 'bool', def: false, key: 'bugfix-footer-spacer', label: 'Smaller spacer before the footer', comment: 'Corrects the large space which appears above the footer in some browsers. Leave this unchecked if you do not experience this problem.' },
	],
	'Misc': [
		{ type: 'choice', options: ['light'], def: 'light', key: 'BE-style', label: 'Barefoot Essentials style' },
		{ type: 'choice', options: ['current', 'v1', 'v2', 'v3'], def: 'v1', key: 'favicon', label: 'Favicon' },
		{ type: 'bool', def: true, key: 'gamecard-show-descriptions', label: 'Automatically expand game and movie descriptions' },
		{ type: 'bool', def: true, key: 'gamecard-gogwiki-link', label: 'Gamecards: Show GOGWiki link' },
		{ type: 'bool', def: true, key: 'library-always-show-count', label: 'Always show total games/movies in library' },
		{ type: 'bool', def: false, key: 'catalogue-hide-owned', label: 'Hide owned games and movies in catalogue' },
		{ type: 'bool', def: true, key: 'catalogue-show-hide-owned-toggle', label: 'Add "hide owned" toggle switch to catalogues' },
		{ type: 'bool', def: true, key: 'redeem-shortcut-keys', label: 'Shortcut keys on the redeem page' },
	],
	'Share on GOGWiki': [
		// { type: 'multibool', options: { 'games': true, 'movies': true, 'wishlist': true, 'birth date': true}, key:'share-on-gogwiki', label:'Send following information to GOGWiki when syncinc'},
	]
}

var changelog = [
	{
		version: '2.3.2',
		date: '2015-07-06',
		changes: [
			"<small>2.3.3</small> fixed games being sent to gogwiki in the wrong order",
			"<small>2.3.2</small> Temporarily removed the feature to add icons below the LIBRARY item of the ACCOUNT menu, as the pages linked no longer apply",
			"<small>2.3.2</small> Implemented a workaround to whatever was keeping the ESSENTIALS menu item from workin in non-legacy pages",
			"<small>2.3.1</small> Corrected the date in the previous changelog entry (thanks, mrkgnao)",
			"<small>2.3.1</small> Bugfix: corrected issue that may have prevented fresh installs of the script from running correctly",
			"Compatibility fix: Share on GOGWiki is back",
			"Compatibility fix: click-to-zoom on forum avatars",
			"Overall better compatibility with post-Galaxy GOG website",
			"New feature: Shortcut keys on the redeem page - when there are multiple pages of items you can now use the left/right arrow keys to change pages",
			// "New feature: make the search button on the navigation bar work throughout the site",
		]
	},
	{
		version: '2.2',
		date: '2014-11-15',
		changes: [
			"<small>2.2.2</small> Fixed: collapsible footer appearing too high in certain cases (Act 2)",
			"<small>2.2.2</small> Old favicons are back",
			"<small>2.2.1</small> Fixed: collapsible footer appearing too high in certain cases",
			"Shortcut keys in the forum restored for Chrome users",
			"Fixed: navigation bar transparency not being applied in the catalogue",
		]
	},
	{
		version: '2.1.10',
		date: '2014-11-08',
		changes: [
			"The collapsible-footer feature is back, and now affects the forum topic lists too",
			"Custom icon added for the giveaways topic group",
		]
	},
	{
		version: '2.1.9.1',
		date: '2014-11-07',
		changes: [
			"This is mainly a compatibility update so that the script copes with some recent changes to the gog.com website",
			"GOGWiki links on gamecards are restored",
			"The collapsible-footer feature is temporarily disabled",
			"Icon added to \"gifts\" button in account menu",
		]
	},
	{
		version: '2.1.9',
		date: '2014-11-04',
		changes: [
			"New feature: collapsible footer (default: off)",
			"New feature: Fix the huge space that appears before the footer in forum topics on some browsers (default: off)",
			"Fixed: \"hide owned games and movies in catalogue\" not working when filtering games by genre",
			"Fixed: \"Click here to sync with GOGWiki again\" not working reliably",
			"Account menu now get a \"gifts\" button alongside the \"shelf\" and \"list\" buttons. The blank icon is temporary - I'll add an icon later.",
		]
	},
	{
		version: '2.1.8',
		date: '2014-10-04',
		changes: [
			"New feature: toggle visibility of owned games/movies directly from the catalogue",
			"Restored feature: Hide specific navigation bar notifications (new/updated games, forum replies, new private messages)",
		]
	},
	{
		version: '2.1.7',
		date: '2014-09-26',
		changes: [
			"New feature: option to hide owned games and movies from the catalogue",
			"New feature: option to always show Online/Offline status, PM button, and post link number in forum topics",
		]
	},
	{
		version: '2.1.6',
		date: '2014-09-25',
		changes: [
			"Improved styling for absolute navigation bar position",
			"Fixed old-school navigation bar style when logged out"
		]
	},
	{
		version: '2.1.5',
		date: '2014-09-20',
		changes: [
			"New feature: Navigation bar position, which allows you to pin the navigation bar to the top of the page",
			"Compatiblity with Violent Monkey and Tampermonkey restored",
		]
	},
	{
		version: '2.1.4',
		date: '2014-09-17',
		changes: [
			"Fixed incorrect URLs on account menu shelf/list icons",
			"Restored feature: always show total games/movies in library",
		]
	},
	{
		version: '2.1.3',
		date: '2014-09-17',
		changes: [
			"Quotes are properly styled inside post previews",
			"Post previews no longer obstruct the button to attach images to posts",
		]
	},
	{
		version: '2.1.2',
		date: '2014-09-17',
		changes: [
			"Fixed: forum enhancements not being applied when the URL points to any specific post",
			"Fixed: account menu library icons not appearing in HTTPS pages",
			"\"Automatically expand descriptions\" feature now applies to both movie and game cards",
		]
	},
	{
		version: '2.1.1',
		date: '2014-09-17',
		changes: [
			'Fixed: In the settings, checkboxes initially set to default instead of actual setting',
			'Feature restored: extra-bold bold text in forums',
			'Feature restored: quick reply',
			'Feature restored: spoilers',
			'New option for green account notifications in the navigation bar',
			'Position of the "Essentials" account menu item can now be either "top" or "bottom"',
			'Fixed: duplicating the summary paragraph when expanding gamecard descriptions',
		]
	},
	{
		version: '2.1',
		date: '2014-09-16',
		changes: [
			'Compatible with 2014 GOG website redesign.',
			'COLOUR',
			'Complete rewrite of the Barefoot Essentials UI. I think it looks better than before, but there will be additional themes for this too.',
			'*All* features are now optional, and can be toggled without requiring a page refresh.',
			'The navigation bar links "GAMES" and "MOVIES" can be hidden if you so desire.',
			'The old favicon is back!',
			'Alternate navigation bar styles.',
			'Direct links to your shelf and game list in the account menu are now presented as compact icons.',
			'Descriptions on gamecards can be automatically expanded.',
			'The feature to suppress notification for new/updated games, forum replies or messages is temporarily removed. I\'ll re-add this when I can.',
			'The feature to force your library to display your game count even when there are no games new/updates is also temporarily removed',
		]
	},
	{
		version: '2.0',
		date: '2014-05-11',
		changes: [
			'New feature: Discrete "Post edited" notes in forum (enabled by default).',
			'Keyboard shortcuts are now displayed next to the quick post area.',
			'The configuration now uses HTML 5 input boxes. What this means is that mouse-users can edit numbers without needing to reach for their keyboards.',
			'Fixed minor css issue from previous version, which had been causing the Edit / Add new post page to be slightly larger than the window displaying it.'
		]
	},
	{
		version: '1.11',
		date: '2014-03-27',
		changes: [
			'In Reply/New Post/New Topic popup windows, the preview area now occupies all available space instead of having a fixed height.'
		]
	},
	{
		version: '1.10',
		date: '2013-12-11',
		changes: [
			"New feature: Ability to group together giveaway threads on forums.",
			"<small>1.10.1</small> The experimental \"Always display shelf/list game count \" feature should now be working correctly. This option requires browser features added in Firefox 14, Chrome 26 and Opera 15, and will have no effect on browsers older than that.",
			"<small>1.10.2</small> Fixed: game count on shelf was incorrectly rounding up to the nearest 5 when \"Always display shelf/list game count \" is enabled.",
			"<small>1.10.3</small> Syncing to GOGWiki now takes into account the sort-order selection in your wishlist",
			"<small>1.10.4</small> In the forums you can now click on your forum title to go to your settings page.",
			"<small>1.10.5</small> Fixed issue with some users not being able to sync since GOGWiki's PHP update.",
			"<small>1.10.6</small> Added option to share your birthday on GOGWiki. If you have this option enabled when syncing then you will be listed on the wiki's new Special:Birthdays page when it is your birthday.",
			'<small>1.10.6</small> "Always display shelf/list game count" is no longer marked as experimental.'
		]
	},
	{
		version: '1.9',
		date: '2013-10-27',
		changes: [
			"Options added to ignore game updates, private messages and/or forum replies.",
			"(All that this does is prevent the \"ignored\" updates from counting toward the number in the alert displayed next to \"My Account\" on the top bar. You will still be able to see the updates in the dropdown menu.)",
			"<small>1.9.1</small> Wiki links in game cards now correctly handle titles containing \"en\" dashes",
			"<small>1.9.2</small> Fixed: bug causing wishlists sent to gogwiki to be limited to 50 items",
			"<small>1.9.3</small> Fixed: notifications not being correctly hidden on pages with delayed top navigation bar",
			"<small>1.9.4</small> New feature: On the game list and shelf pages, always display the counter indicating the total games and the number of games new/updated. This feature is off by default and marked as experimental for now because I haven't yet had an opportunity to test when there are updates."
		]
	},
	{
		version: '1.8.1',
		date: '2013-10-09',
		changes: [
			"Cursors to indicate that avatars are clickable",
			'"Full-size" avatars now have a limit of 420 pixels in height, and their z-index is raised so that they don\'t go underneath the bottom bookend thingy on the forum',
			"Now clicking on an avatar will also shrink any currently-enlarged avatars back to normal size"
		]
	},
	{
		version: '1.8',
		date: '2013-10-08',
		changes: [
			"Click on an avatar in the forum to view it full-size",
			"3 forum quote styles are available to choose between",
			"Blank lines in and around spoilers are now trimmed",
			"Deeply-nested spoilers now have significantly less padding"
		]
	},
	{
		version: '1.7.1',
		date: '2013-08-22',
		changes: [
			"Fixed: wishlist images on the wiki.",
			"Fixed: wiki links appear on game pages again.",
			"Thanks to adambiser for the patch to handle the recent changes to gog.com"
		]
	},
	{
		version: '1.7',
		date: '2013-07-21',
		changes: [
			"Spoilers! Hotkey Ctrl+L",
			"Fixed: promo link on gamecards used to be unclickable during promotions."
		]
	},
	{
		version: '1.6',
		date: '2013-05-23',
		changes: [
			"Restyle of forum quotes is now optional.",
			"Fixed: wrong preview text colour in new/edit post window when using light forum style."
		]
	},
	{
		version: '1.5',
		date: '2013-05-10',
		changes: [
			"Shortcut keys from quick posts are now also supported in regular post/edit windows",
			"Quick-posting a reply to another post now properly causes a forum reply notification. Due to technical limitations, only the first quote in a quick post generates a notification.",
			"Submit quick post button is now disabled during post, and has a new \"disabled\" style.",
			"Varius CSS changes. Some fixes to changes in light theme, quoted text in dark theme is now closer to its regular colour, and the preview in post/reply window has been reorganised.",
		]
	},
	{
		version: '1.4',
		date: '2013-04-07',
		changes: [
			"This changelog now automatically appears once after each update so that you know when new features are available. Don't worry - I'll add an option to disable this in a future version in case you'd rather not have it keep appearing.",
			'Quick reply added.',
			"New shortcut: ctrl+space to jump to quick post.",
			"New shortcuts: ctrl+I, ctrl+B, ctrl+U and ctrl+Y in quick post to add [i], [b], [u] and [url] tags. (Y is for hYperlink - all the more obvious letters conflicted with some-or-other browser hotkey.)",
			"New shortcut: ctrl+enter in quick post to submit your post.",
			'Style change to quotes and bold text in forum posts. This change will become optional once in the next version.',
			'New, improved parser for generating better previews. Now handles quotes and nested tags, and points out missing/incorrect closing tags.',
			"Improvements to changelog.",
		]
	},
	{
		version: '1.3',
		date: '2013-02-27',
		changes: [
			'Brand new UI system added, along with this changelog. This looks better, and also allow some functions to be moved out of the over-long "My Account" menu.',
			'Username links are now coloured appropriately when using the light colour scheme',
			'Wishlist is now sent to GOGWiki in alphabetical order',
			'Default settings for hiding the navigation bar have been changed (I found that the sliding effect gets old)',
			'Navigation bar no longer hides when you move the mouse away while typing in the search box',
			'Wiki links no longer disappear, due to better handling of elements that appear only after pageload (thanks, adambiser)',
			'<small>1.3.2</small> Live preview when writing a forum post.',
			'<small>1.3.3</small> Fixed wiki link on KKnD2 gamecard.',
			'<small>1.3.5</small> Inline "Quick Post" feature added.',
			'<small>1.3.5.2</small> Changed textbox shrinking behaviour on "Quick Post" to avoid the post button having to be clicked twice.',
			'<small>1.3.5.3</small> Fixed ajax regression in wiki sync.'
		]
	}
]


/*-- global variables - don't judge me --*/
var forum_skin = null
var gog_sync_element = null
var sync_status_account = null
var sync_status_movies = null
var sync_status_games = null
var sync_status_wishlist = null
var sync_status_progress = null
var sync_status_start = null
var sync_status_restart = null
var sync_status_send = null
var sync_status_output = null


/*-- utility functions --*/
function to_css(rules) {
	var text = ''
	for (var i = 0; i+1 < rules.length; i += 2) {
		var selectors = rules[i], declarations = rules[i+1]
		text += selectors + '{'
		for (var j in declarations) {
			text += declarations[j] + ';'
		}
		text += '}'
	}
	return text
}

function cmpVersion(a, b) {
	var i, cmp, len, re = /(\.0)+[^\.]*$/;
	a = (a + '').replace(re, '').split('.');
	b = (b + '').replace(re, '').split('.');
	len = Math.min(a.length, b.length);
	for( i = 0; i < len; i++ ) {
		cmp = parseInt(a[i], 10) - parseInt(b[i], 10);
		if( cmp !== 0 ) {
			return cmp;
		}
	}
	return a.length - b.length;
}

var popup = {
	show: function(section) {
		var popup = $('aside.BE-popup')
		if (popup.length == 0) {
			popup = $('<aside class="BE-popup"><div>')

			var nav = $('<nav>').appendTo(popup)
			var navlist = $('<ul>').appendTo(nav)

			// close button
			$('<li>')
			.text('Close')
			.click(function() { $('.BE-popup').remove() } )
			.prependTo(navlist)

			// dynamic sections
			for (var section_name in config) {
				$('<li>').appendTo(navlist).text(section_name).click(this.show_section.bind(this, section_name))
			}

			popup.appendTo(document.body)
		}

		this.show_section(section)
	},
	checkbox_change_event: function(key, subkey, e) {
		var setting = settings.get(key)
		setting[subkey] = e.target.checked
		settings.onchange(key)
	},
	change_event: function(key, e) {
		if (e.target.type == 'checkbox') settings.set(key, e.target.checked)
		else settings.set(key, e.target.value)
	},
	show_section: function(section) {
		var popup = $('aside.BE-popup')
		var root = popup.find('>div')
		root.empty()

		popup.find('>nav>ul>li').removeClass('active').each(function() {
			if (this.textContent == section) $(this).addClass('active')
		})

		$('<h1>').text('Barefoot Essentials - '+section).appendTo(root)

		switch (section) {
			case 'Share on GOGWiki':
				root.append(gog_sync_element)
				break
			case 'Changelog': {
				var old_versions = $('<div class="BE-older-changes">').hide()

				changelog.forEach(function(entry) {
					var p = $('<h2>')
					.text("Version " + entry.version)
					.append($('<small>').text(" - released on " + entry.date))
					
					var list = $('<ul>').addClass('BE-changelog')
					
					entry.changes.forEach(function(change) {
						$('<li>').html(change).appendTo(list)
					})
					
					var entry 
					if (entry.version == version || cmpVersion(last_BE_version, entry.version) < 0) {
						root.append(p, list)
					} else {
						old_versions.append(p, list)
					}
				})
				if (old_versions.children().length > 0) {
					var older = $('<p>').append($('<a>').html('older changes&hellip;').click(function() { old_versions.toggle() }))
					root.append(older, old_versions)
				}
				break;
			}
			default:
				var fields = config[section]
				for (var i in fields) {
					var field = fields[i]
					var p = $('<p>')
					$('<label>').text(field.label).appendTo(p)

					switch (field.type) {
						case 'range': {

							var e = $('<input type="range">')
							.attr('min', field.min)
							.attr('max', field.max)
							.attr('step', field.step)
							.val(settings.get(field.key))
							.appendTo(p)

							e.on('input', this.change_event.bind(this, field.key))

							break
						}
						case 'multibool': {
							var group = $('<div class="BE-multibool">')

							var value = settings.get(field.key)
							for (var option in field.options) {
								$('<label>')
								.text(option)
								.prepend(
									$('<input type="checkbox">')
									.prop('checked', value[option])
									.on('change', this.checkbox_change_event.bind(this, field.key, option))
								)
								.appendTo(group)
							}
							group.appendTo(p)
							break
						}
						case 'bool': {
							$('<input type="checkbox">')
							.prop('checked', settings.get(field.key))
							.on('change', this.change_event.bind(this, field.key))
							.appendTo(p)
							break
						}
						case 'choice': {

							var select = $('<select>')
							var value = settings.get(field.key)

							for (var i in field.options) {
								$('<option>')
								.text(field.options[i])
								.appendTo(select)
							}

							select.val(value)
							select.appendTo(p)

							select.on('change', this.change_event.bind(this, field.key))

							break
						}
					}

					if (field.comment !== undefined) {
						$('<small>').text(field.comment).appendTo(p)
					}

					p.appendTo(root)
				}
		}

		root.focus()
	}
}



var settings = {
	get: function(key) {
		var setting = this.settings[key]
		if (setting) return setting.value
		else return undefined
	},
	set: function(key, value) {
		var setting = this.settings[key]

		if (setting) {
			if (setting.value != value) {
				setting.value = value
				this.save()

				for (var i in setting.onchange) {
					setting.onchange[i](value)
				}
			}
		}
	},
	save: function() {
		var saved_settings = {}
		for (var key in this.settings) {
			saved_settings[key] = this.settings[key].value
		}
		GM_setValue('settings', JSON.stringify(saved_settings))
	},
	onchange: function(key, callback) {
		var setting = this.settings[key]
		if (setting) {
			if (callback) {
				setting.onchange.push(callback)
				callback(setting.value)
			} else {
				this.save()

				for (var i in setting.onchange) {
					var callback = setting.onchange[i]
					callback(setting.value)
				}
			}
		}
	},

	initialise: function(initial_values, done) {

		var saved_settings = {}
		try {
			var s = GM_getValue('settings')
			if (s !== undefined) saved_settings = JSON.parse(s)
		} catch (exception) {
			console.log(exception)
			GM_deleteValue('settings')
		}
		if (!saved_settings) saved_settings = {}

		if (saved_settings['bugfix-collapsible-footer']) {
			saved_settings['bugfix-footer-spacer'] = saved_settings['bugfix-collapsible-footer']
			delete saved_settings['bugfix-collapsible-footer']
		}

		for (var section_name in initial_values) {
			for (var i in initial_values[section_name]) {
				var item = initial_values[section_name][i]

				var setting = {
					onchange: [],
					value: (saved_settings[item.key] !== undefined) ? saved_settings[item.key] : item.def
				}

				// for "choice" items, verify that the selected value is a valid option
				if (item.type == 'choice') {
					var valid = false
					for (var j in item.options) {
						var option = item.options[j]
						if (option == setting.value) valid = true
					}
					if (!valid) setting.value = item.def
				}
				
				if (item.type == 'multibool' && setting.value === undefined) setting.value = item.options

				this.settings[item.key] = setting
			}
		}

		if (done) done()
	},

	settings: {}
}



function detect_forum_skin() {
	if (document.head.querySelector('link[href*="forum_carbon"]')) forum_skin = 0
	else forum_skin = 1
}


/*-- Quick post/post preview --*/
function submit_quick_post() {
	if (location.pathname == "/forum/ajax/popUp") {
		$('.kontent>.submit>div.gog_btn:first-child').click()
	} else {
		var post_text_e = $('.quick_post textarea')
	
		if (post_text_e.length < 1 || post_text_e.val() == '') return
	
		var post_text = post_text_e.val()
		var reply_to = post_text.match(/\[quote_([0-9]+)\]/)
		var reply_to_pid = (reply_to === null) ? undefined : reply_to[1]
					
		$('.submit-quick-post')[0].disabled = true
					
		// submit the post
		$.ajax({
			type:"POST",
			url:"/forum/ajax",
			timeout:15000,
			data:{
				a:"addPost",
				f:$("#f").val(),
				f_arr:$("#f_arr").val(),
				w:$("#w").val(),
				pid:reply_to_pid,
				text:post_text,
				added_images_ids:"",
				added_images_names:"",
				kap:undefined,
				guest_name:undefined,
				btn:"0"
			}
		})
		.done(function(data, textStatus, jqXHR){
			var response = JSON.parse(data)
			if (response.error) {
				alert("A problem occurred while submitting this Quick Post. Try again using a regular post.")
				console.log(data)
				$('.submit-quick-post')[0].disabled = false
			} else {
				window.location = response.result
			}
		})
		.fail(function(data, textStatus, jqXHR){
			$('.submit-quick-post')[0].disabled = false
			alert("A problem occurred while submitting this Quick Post. Try again using a regular post.")
		})
	}
}
function tag_input_text(input, begin_tag, end_tag) {
	var start = input.selectionStart, end = input.selectionEnd
	input.value = (
		input.value.substring(0, start) 
		+ begin_tag
		+ input.value.substring(start, end)
		+ end_tag
		+ input.value.substring(end)
	)
						
	input.selectionStart = start + begin_tag.length
	input.selectionEnd = end + begin_tag.length
}

function parse_node(node) {
	switch (node.nodeType) {
		case 3: { // text node
			return node.nodeValue
		}
		case 1: { // element
			
			var result = ""
			var after = ""
			
			if (node.tagName == 'BR') return "\n"
			else if (node.tagName == 'DIV') {
				if (node.classList.contains('post_text_c')) {
				} else return ""
			} else if (node.tagName == 'A') {
				result = "[url="+encodeURI(node.getAttribute('href'))+"]"
				after = "[/url]"
			} else if (node.tagName == 'I') {
				result = "[i]"
				after = "[/i]"
			} else if (node.tagName == 'SPAN') {
				if (node.classList.contains('podkreslenie')) {
					result = "[u]"
					after = "[/u]"
				} else if (node.classList.contains('bold')) {
					result = "[b]"
					after = "[/b]"
				} else return ""
			} else return ""
			
			
			var child = node.firstChild
			while (!!child) {
				result += parse_node(child)
				child = child.nextSibling
			}
			
			return result + after
		}
	}
	return ""
}

function parse_post(post) {
	return parse_node(post.find('.post_text_c')[0])
}
function post_keydown_handler(event) {
	if (event.ctrlKey) {
		switch (event.which) {
			case 66:
			case 98: if (!event.repeat) tag_input_text(this, '[b]', '[/b]'); event.preventDefault(); break
					
			case 85:
			case 117: if (!event.repeat) tag_input_text(this, '[u]', '[/u]'); event.preventDefault(); break
					
			case 73:
			case 105: if (!event.repeat) tag_input_text(this, '[i]', '[/i]'); event.preventDefault(); break
					
			case 76:
			case 108: if (!event.repeat) tag_input_text(this, '\n\n[spoiler]\n\n\n\n', '\n\n\n\n[/spoiler]\n\n'); event.preventDefault(); break
					
			case 81:
			case 113: if (!event.repeat) tag_input_text(this, '[quote]', '[/quote]'); event.preventDefault(); break
					
			case 89:
			case 121: {
				if (!event.repeat) {
					var selected_text = this.value.substring(this.selectionStart, this.selectionEnd)
							
					var url = prompt("Enter the URL for the link", selected_text)
					if (!!url) {
						tag_input_text(this, '[url='+encodeURI(url)+']', '[/url]')
					}
				}
				event.preventDefault()
				break
			}
					
			case 13: {
				if (!event.repeat) submit_quick_post();
				event.preventDefault()
				break
			}
					
			default: return true
		}
		
		event.stopPropagation();
		show_preview()
				
		return false
	}
}
function post_preview_html(source) {
	var tokenexp = /\[\/?(?:[ibu]|(?:url(?:=[^\n\]]*)?|quote(?:_[0-9]*)?))\]/g
	
	var text_tokens = source.split(tokenexp)
	if (!text_tokens) text_tokens = []
	var tag_tokens = source.match(tokenexp)
	if (!tag_tokens) tag_tokens = []
	
	var text_i = 0, tag_i = 0
	var tag_stack = []
	var preview = ""
	var top_tag = null
	var ignore_first_linebreak = false;
	
	while (true) {
		if (text_i < text_tokens.length) {
		
			var text_token = text_tokens[text_i++]
			.replace(/&/g, '&amp;')
			.replace(/\>/g, '&gt;')
			.replace(/\</g, '&lt;')
			.replace(/\n/g, '<br/>')
			
			preview += ignore_first_linebreak ? text_token.replace(/^<br\/>/, '') : text_token
			
		} else break;
		
		if (tag_i < tag_tokens.length) {
		
			var tag = tag_tokens[tag_i++].match(/^\[(\/?)([^=_\]]*)(?:[=_](.*))?\]/)			
			if (tag[2] === undefined) continue
			
			ignore_first_linebreak = false
			
			if (tag[1] == '/') {
			
				if (!!top_tag) {
					preview += top_tag.closing
					
					if (top_tag.tag == 'quote') ignore_first_linebreak = true
					
					if (tag[2] != top_tag.tag)
					preview += '<span class="syntax-warning">[/'+top_tag.tag+']</span>';
					
					top_tag = tag_stack.pop()
				}
				
			} else {
				tag_stack.push(top_tag)
				switch (tag[2]) {
					case 'i': {
						preview += '<i>'
						top_tag = {
							tag: tag[2],
							closing: '</i>'
						}
					} break;
					case 'b': {
						preview += '<b>'
						top_tag = {
							tag: tag[2],
							closing: '</b>'
						}
					} break;
					case 'u': {
						preview += '<u>'
						top_tag = {
							tag: tag[2],
							closing: '</u>'
						}
					} break;
					case 'quote': {
						preview += '<blockquote>';
						ignore_first_linebreak = true
						top_tag = {
							tag: tag[2],
							closing: '</blockquote>'
						}
					} break;
					case 'url': {
						preview +=  (tag[3] === undefined)? '<a href="">' : ('<a href="'+encodeURI(tag[3])+'">');
						top_tag = {
							tag: tag[2],
							closing: '</a>'
						}
					} break;
					default: top_tag = tag_stack.pop();
				}
			}
		}
	}

	while (!!top_tag) {
		preview += top_tag.closing
		preview += '<span class="syntax-warning">[/'+top_tag.tag+']</span>';
		top_tag = tag_stack.pop()
	}

	return preview
}
function show_preview() {
	$('.BE-preview').html(post_preview_html($('.quick_post textarea, form#f_text>textarea#text').val()))
}

/*-- Feature functions --*/

function feature_navbar_style() {
	function on_update(value) {
		switch (value) {
			case 'new and colourful':
				style.text(to_css([
					'nav.top-nav', [
						'background: linear-gradient(to bottom, #E5E5E5, #DEDEDE) no-repeat scroll 1080px 0px transparent',
					],
					'.top-nav__inner:after', [
						'display: none',
					],
					'.top-nav__logo:hover:before', [
						'background-color: #000',
						'box-shadow: 0px 0px 5px -1px #0C0A32'
					],
					'.top-nav__logo:before', [
						'display: block',
						'z-index: 0',
						'background: transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAqCAYAAAD1T9h6AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAADiUlEQVRYw+1XPWsdRxQ95+6ujCxhEgV3MtnSlSCuLRRIaSuCNHZljKWfoMa/II1/gnEMVuE0Aa3dBRMH17JBhqDyyQg3xh9F1Czs3BQzq7ezb9/MSk8mzR4Q6N05c+d+zL07FxgwYMCAATOAocVf/+aPAJ4AWJ5COQJw5/6a/uX4PwF4HOHfvb+mL86ivwsS8e43esrZ8Jmwa3zU2PLQGsOJ6Lidy7QcK6PVz1YcefKTywQehWxMg4siOaAAsLG9agr3PwDgwSv5GeAuoHkty0RyUAGl46ODjxyorH4yd55tbF/XDj52AebNc0+VgUyITARtYwBge7UqMiFSEZ9PwfZq1cE3RSpEJmzwxeq/bjr59foMGWCwSFKymW/HZyAgMhGgUBnGzo86EPM+SzoMUgYzSi8AEmwjcyLQwPXp54Bq0CDvNyV4KdsRbe/v4kcaZbwG0kSwsze/Pr1G6PNFsLM3f7PN3dmbv1HXSDNAqRBP9i6uT3MgI2fIADFSMAdZPH294LW5Wz8c016BcYbSRA4BfA/g2dPXCyfBIwCo6yWC0fgKcqRgTqD4/c1FqNKSFbh97ZixjEYzkCbJvSzhUSZEloz/Uhd1G9Gk4TA3M+H7jOLWbIZSEqnd+y4jtxpN4F4mPEpd5rJEvKy2u9a5o3h7SYu3l/Rr6d/dj+tPZzkgFQL69QI01yP6Z3bgz3++WQfo1cB5oq/+oAMvD5ZUARDqPlh1JY4jo+DorEa+PFhSAFD7/HD22hNBhSpBYDTTl9h/tLLdlg8BbM50Bdt66ckOAW5iwID/aSI7PrgcnLAWrn5gH149iS1c/fDC8dfcJHalj5H1Oaf+Eo8nrChivGU0JjHn7JXzyECwC2lp6mlrY3HlYzGdV+W2yXKC9+/+d26yQh7Se7y/VL97NxZXPhV271L0IyNhBypoaRAy3vIUZgpvceVjoaWBlsbTixZfS+NknzyZljpTBnqlUcsqXE5l5b04rFFmIggTppYm+lIJPyV6KOjjaHvdOuzDdMrMbCNlNLINR0MwbT1dgenQ0ecGSOxua1nhy/MLN/vUShfvy/MLN1AaoBFhy686dMRlp83AyHWPZ5//mHMD9niu/faXki5SJ5NYzSMIhcKUah+DjUffWNbM0qTsHDJgtrQ0R7Yb2M4BFxX1Imo2tTTvmzyfb95pWW15Rd02rlNmejeSAQMGDBhwJvwH8oConHoXBU4AAAAASUVORK5CYII)',
						'height: 42px',
						'margin: 7px 0',
						'border-radius: 3px'
					],
					'.top-nav__logo', [
						'background: rgba(0, 0, 0, 0.45) url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAA4CAYAAAC7UXvqAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAuUlEQVRo3u3awQnCQBSE4T9LjkZSwF4FS7AAsYBUYwOCNUkKSAmCMKeXu9hAPGgN6sP5Lnudeeye9jXzPC8k1i5L6vwUknMBF/j3Au37vAFHYKy1Pn45cESsgT1wBjZNRFyBXa31nmnyEdEDExExZL0+ETEUYEz8BC6YmZmZmZmZmZmZmZnZp0laJ86+Kry+LLM6FOAkqU84/R44FWALTJIGSV2C4J2kAZiAbSMp9cKQlz1cwAVc4Luew0I6oOEnYF8AAAAASUVORK5CYII);',
					],
					'.top-nav__logo:hover', [
					],
				]))
				break
			case 'new with old logo':
				style.text(to_css([
					'nav.top-nav', [
						'background: linear-gradient(to bottom, #E5E5E5, #DEDEDE) no-repeat scroll 1080px 0px transparent',
					],
					'.top-nav__inner:after', [
						'display: none',
					],
					'.top-nav__home', [
						'margin-left: -45px',
						'padding: 0',
						'background: linear-gradient(to bottom, #E5E5E5, #DEDEDE)',
					],
					'.top-nav__logo', [
						'background: url(https://secure.gog.com/www/default/-img/_nav.38808059.png) no-repeat 0 -54px',
						'width: 98px',
						'height: 22px',
						'margin-top: 19px'
					]
				]))
				break
			case 'old-school':
				style.text(to_css([
					'.top-nav__dd-items', [
						'background-color: #C3C3C3'
					],
					'.is-anonymous .top-nav__login', [
						'background: transparent',
					],
					'.top-nav__login-inner', [
						'height: 47px',
					],
					'.top-nav__login-content', [
						'border-right: none',
					],
					'body > nav.top-nav, body .universe nav.top-nav', [
						'background: linear-gradient(#c3c3c3, #a2a2a2) no-repeat scroll 1080px 0px transparent',
					],
					'.top-nav__inner:after', [
						'display: none',
					],
					'.top-nav__home', [
						'margin-left: -45px',
						'padding: 0',
					],
					'.top-nav__home, .top-nav-extras-search-holder, .top-nav__extras, nav.top-nav, .top-nav__item', [
						'background: transparent',
						'height: 47px',
					],
					'.top-nav__logo', [
						'background: url(https://secure.gog.com/www/default/-img/_nav.38808059.png) no-repeat 0 -54px',
						'width: 98px',
						'height: 22px',
						'margin-top: 15px'
					],
					'.top-nav__item', [
						'line-height: 47px',
						'padding: 0 20px',
						'width: 17%',
						'border-right: none',
						'text-transform: lowercase'
					],
					'.top-nav__item:first-child', [
						'border-left: none',
					],
					'.top-nav__inner:before, .top-nav__container, .top-nav__inner', [
						'background: linear-gradient(#c3c3c3, #a2a2a2)',
						'background-repeat: repeat-x;',
					],
					'.top-nav__item ._dropdown__toggle:hover, .top-nav__item:hover:not(.is-expanded):not(.top-nav__login)', [
						'background: #C3C3C3',
					],
					'.top-nav__item.is-active', [
						'background: #A1A1A1',
					],
					'.top-nav__item.is-expanded', [
						'padding: 0',
					],
					'.top-nav__item.is-expanded>a._dropdown__toggle', [
						'background: #C3C3C3',
						'padding: 0 20px'
					],
					'.top-nav__dd-item', [
						'background: #C3C3C3',
						'border-top: none !important',
					],
					'.top-nav__dd-item:hover', [
						'background: #B3B3B3',
					],
					'.top-nav__cart, .top-nav__social, .top-nav-extras-search-holder', [
						'line-height: 47px',
					]
				]))
				break
			default:
				style.text(to_css([
					'nav.top-nav', [
						'background: linear-gradient(to bottom, #E5E5E5, #DEDEDE) no-repeat scroll 1080px 0px transparent',
					],
					'.top-nav__inner:after', [
						'display: none',
					],
				]))
		}
	}

	var style = $('<style>').appendTo(document.head)

	settings.onchange('navbar-style', on_update)
}

function feature_navbar_opacity() {
	function on_update(value) {
		style.text(to_css([
			'body nav.top-nav', [
				'opacity: '+value,
				'transition: opacity 0.5s linear'
			],
			'body nav.top-nav:hover', [
				'opacity: 1',
			],
		]))
	}

	var style = $('<style>').appendTo(document.head)

	settings.onchange('navbar-opacity', on_update)
}

function feature_notification_style() {
	function on_update(value) {
		switch (value) {
			case 'red':
				style.text(to_css([
					'.top-nav__item-count', [
						'background: #BF0B0B',
						'padding-bottom: 1px',
					],
				]))
				break;
			case 'green':
				style.text(to_css([
					'.top-nav__item-count', [
						'background: #008500',
						'padding-bottom: 1px',
					],
				]))
				break;
			default:
				style.text('')
		}
	}

	var style = $('<style>').appendTo(document.head)

	settings.onchange('navbar-notification-style', on_update)
}

function feature_BE_style() {
	function on_update(value) {
		switch (value) {
			default:
				style.text(to_css([
					'.BE-error', [
						'color: #B80000',
						'font-weight: bold',
					],
					'.BE-in-progress', [
						'color: #808000',
						'font-weight: bold',
					],
					'.BE-success', [
						'color: #006000',
						'font-weight: bold',
					],
					'.BE-sync-progress>p', [
						'margin: 1em 0',
					],
					'.BE-sync-progress p>span:nth-child(1)', [
						'display: inline-block',
						'text-align: right',
						'margin-right: 0.5em',
						'min-width: 25%',
					],
					'.BE-popup h2', [
						'font-size: 14px',
						'font-weight: bold',
						'margin: 1.5em 0 0.5em',
					],
					'.BE-popup .BE-changelog + p', [
						'margin: 1em',
						'font-style: italic',
						'-moz-user-select: none',
						'user-select: none',
					],
					'.BE-older-changes', [
						'padding-top: 1px',
					],
					'.BE-changelog li:before', [
						'content: "•"',
						'margin-left: -1em',
						'position: absolute',
					],
					'.BE-changelog li small', [
						'font-weight: bold',
						'font-family: monospace',
						'color: #000',
						'display: inline-block'
					],
					'.BE-changelog li', [
						'margin: 0.3em 0',
						'display: block',
						'padding-left: 1em',
						'line-height: 1.4',
						'position: relative',
					],
					'.BE-changelog', [
						'list-style: disc inside none',
						'font-size: 12px',
						'display: block',
						'margin-right: 2em',
					],
					'.BE-popup a', [
						'cursor: pointer',
						'color: blue',
					],
					'.BE-popup a:hover', [
						'text-decoration: underline'
					],
					'.BE-popup input[type=checkbox]', [
						'width: auto',
						'margin: 2px 0 0 6px',
					],
					'.BE-popup .BE-multibool input[type=checkbox]', [
						'vertical-align: middle',
						'margin: 0 0.5em 0 0',
						'line-height: 1'
					],
					'.BE-popup .BE-multibool label', [
						'float: none',
						'width: auto',
						'text-align: left',
						'line-height: 1',
						'margin-bottom: 0.2em'
					],
					'.BE-popup .BE-multibool', [
						'overflow: hidden',
						'padding: 0 0 0 0.5em',
						'border-left: 1px solid #676767',
						'margin-top: 5px',
					],
					'.BE-popup input[type=range]::-moz-focus-outer', [
						'border: none',
						'border-right: 2px solid #808080',
						'border-left: 2px solid #808080',
					],
					'.BE-popup input[type=range]', [
						'padding: 0 4px',
						'margin-top: 2px',
						'border: none',
					],
					'.BE-popup select', [
						'border: 1px solid #808080',
						'font-family: "Lucida Grande",Arial,Verdana,sans-serif',
					],
					'.BE-popup select, .BE-popup input, .BE-popup .BE-multibool', [
						'font-size: 11px',
						'width: 20em',
						'max-width: 70%',
						'box-sizing: border-box',
					],
					'.BE-popup p small', [
						'display: block',
						'font-style: italic',
						'clear: both',
					],
					'.BE-popup p', [
						'margin: 0.5em 0',
						'overflow: hidden',
						'padding-bottom: 2px',
					],
					'.BE-popup label', [
						'float: left',
						'display: block',
						'width: 40%',
						'clear: both',
						'text-align: right',
						'margin-right: 1em',
						'line-height: 1.8em',
						'cursor: default',
						'-moz-user-select: none'
					],
					'.BE-popup h1', [
						'font-size: 14pt',
						'font-weight: normal',
						'padding: 0.5em 0 .3em 2em',
						'margin: 0 0 0.7em',
						'line-height: normal',
						'border-bottom: 1px solid #676767',
					],
					'.BE-popup', [
						'background: #E1E1E1',
						'width: 850px',
						'position: fixed',
						'top: 10%',
						'height: 85%',
						'right: calc(50% - 425px)',
						'z-index: 600',
						'box-shadow: 1px 1px 10px 0 black',
						'box-sizing: border-box',
						'display: flex',
						'font-size: 11px',
						'font-family: "Lucida Grande",Arial,Verdana,sans-serif',
						'color: #212121',
					],
					'.BE-popup>div', [
						'flex: 1 1 auto',
						'padding: 1em',
						'overflow: auto',
					],
					'.BE-popup>nav>ul>li:hover', [
						'color: inherit',
					],
					'.BE-popup>nav>ul>li+li', [
						'border-top: 1px solid #676767',
					],
					'.BE-popup>nav>ul>li.active', [
						'background: #E1E1E1',
						'color: #4A4A4A'
					],
					'.BE-popup>nav>ul>li:not(.active):hover', [
						'color: #fff',
						'text-shadow: 1px 1px 0px black',
						'background: #606060',
					],
					'.BE-popup>nav>ul>li', [
						'padding: 1em 2em',
						'cursor: pointer',
						'line-height: 1',
						'color: #ffffff',
					],
					'.BE-popup>nav>ul', [
						'margin: 0',
						'padding: 0',
						'display: block',
					],
					'.BE-popup>nav', [
						'background: #4A4A4A',
						'color: #E1E1E1',
						'font-size: 11px',
						'font-family: "Lucida Grande",Arial,Verdana,sans-serif',
						'min-width: 134px',
					]
				]))
				break;
		}
	}

	var style = $('<style>').appendTo(document.head)

	settings.onchange('BE-style', on_update)
}

function feature_cart_style() {
	function on_update(value) {
		switch (value) {
			case 'green':
				style.text(to_css([
					'.top-nav__count', [
						'background-color: #008500',
						'font-size: 10px',
						'border-radius: 2px',
						'vertical-align: middle',
						'line-height: 1',
						'color: #FFF',
						'padding: 3px 3px 3px 4px',
						'margin-bottom: 4px',
					]
				]))
				break;
			default:
				style.text('')
		}
	}

	var style = $('<style>').appendTo(document.head)

	settings.onchange('navbar-cart-style', on_update)
}


/*-- sync functions --*/
	function shelf_url(page, order, timestamp) { return "https://www.gog.com/account/ajax?a=gamesShelfMore&p="+page+"&s="+order+"&q=&t="+timestamp }
	function list_url(page, order, timestamp) { return "https://www.gog.com/account/ajax?a=gamesListMore&p="+page+"&s="+order+"&q=&t="+timestamp }
	function wishlist_url(page, order, timestamp) { return "https://www.gog.com/account/ajax?a=wishlistSearch&p="+page+"&s="+order+"&q=&t="+timestamp }


	function get_account_information(job) {
		sync_status_account.attr('class', 'BE-in-progress').text("Starting...")
		GM_xmlhttpRequest({
			method: "GET",
			url:'https://www.gog.com/account/settings/personal',
			context: job,
			onload:function(response) {
				var job = this.context
				var html = $(response.responseText.replace(/src=/g, "alt="))

				job.avatar_url = html.find('.avatar').attr('srcset').match(/https\:\/\/images.gog.com\/([^\.]*)_avm\.jpg/)[1] + '_forum_avatar.jpg'
				job.gogname = html.find('.settings-item__value.settings-item__section')[3].textContent
				job.days = html.find('.days span').text()

				var bday_e = html.find('.settings-item--bday')
				job.birthday = 0.001 * Date.parse(
					bday_e.find('input.input--day').val()
					+ ' ' + bday_e.find('input.input--month').val()
					+ ' ' + bday_e.find('input.input--year').val()
					+ ' GMT'
				)

				sync_status_account.attr('class', 'BE-success').text("Done")
				this.context.count_down()
			},
			onerror:function(response) {
				sync_status_account.attr('class', 'BE-error').text("Error").addClass('error')
				this.context.errors = true
				this.context.count_down()
			}
		})
	}

	function getgame(id, games) {
		var game = games[id]
		if (game === undefined) {
			game = {id:id}
			games[id] = game
		}
		return game
	}

	function write_fragment(fragment, element) {
		switch (typeof(fragment)) {
			case 'string': {
				element.append(fragment)
				break;
			}
			case 'object': {
				if (fragment instanceof Array) {
					for (var i = 0; i < fragment.length; i += 1) {
						write_fragment(fragment[i], element)
					}
				} else {
					var link = fragment.link
					var text = fragment.text
					if (link && text) element.append(
						$('<a>').attr('href', link).attr('target', '_blank').text(text)
					)
				}
				break;
			}
		}
	}
	function write(paragraphs, container) {
		for (var i = 0; i < paragraphs.length; i += 1) {
			var p = $('<p>').appendTo(container)
			write_fragment(paragraphs[i], p)
		}
	}

	function purge_user_page(job) {
		// status_purging.text("In Progress")
		GM_xmlhttpRequest({
			url:'http://www.gogwiki.com/wiki/Special:GOGUser/'+escape(job.gogname)+'/purge',
			method:'POST',
			// data: $.param(data),
			// headers: { "Content-Type": "application/x-www-form-urlencoded" },
			onload: function(response) {
				// status_purging.text("Done")
			},
			onerror:function() {
				// status_purging.text("Error (not serious)").addClass('error')
			}
		})
	}

	function send_to_gogwiki(job) {
		sync_status_send.text("Sending...")

		var data = {
			version: version,
			branch: branch,
			games: [],
			movies: [],
			wishlist: job.wishlist,
			avatar_url: job.avatar_url,
			birthday: job.birthday,
			gogname: job.gogname,
			compatibility: 1436119202
		}
		for  (var i in job.games) {
			data.games.push(job.games[i])
		}
		for  (var i in job.movies) {
			data.movies.push(job.movies[i])
		}

		GM_xmlhttpRequest({
			url:'http://www.gogwiki.com/wiki/Special:GOGSync',
			method:'POST',
			context: job,
			data: $.param({data: JSON.stringify(data)}),
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			onload: function(response) {
				sync_status_send.text("Done").attr('class', 'BE-success')
				purge_user_page(this.context)
				try {
					sync_status_output.empty()
					write(JSON.parse(response.responseText), sync_status_output)
					// sync_status_output.text(JSON.parse(response.responseText))
				} catch (exception) {
					console.log(exception)
					console.log(response.responseText)
					sync_status_output.html("<p>Oops - it looks like some kind of server error happened. Your data was sent but we cannot tell whether GOGWiki stored it correctly.</p>")
				}

				this.context.count_down()
			},
			onerror:function(response) {
				sync_status_send.text("Error").attr('class', 'BE-error')
				this.context.count_down()
				response.erros = true
			}
		})
	}

	function collect_wishlist(job) {
		sync_status_wishlist.text("Starting...").attr('class', 'BE-in-progress')

		// read the wishlist page
		GM_xmlhttpRequest({
			method: "GET",
			url:"https://www.gog.com/account/wishlist",
			context: job,
			onload:function(response) {
				var gogData_src = /var gogData = (\{.*\});/.exec(response.responseText)[1]
				var gogData = JSON.parse(gogData_src)
				this.context.wishlist = Array(gogData.totalProducts)
				for (var i = 0; i < gogData.products.length; i += 1) {
					var product = gogData.products[i]
					var title = product.title.replace(/ ?[\u00AE\u2122]/g, '')
					var wish = {
						image: product.image,
						url: product.url,
						shelf_pos: i,
						title: title.replace(/^(.*), The$/, 'The $1'),
						sort_title: title.replace(/^The (.*)$/, '$1, The'),
						slug: product.slug,
						id: product.id
					}
					this.context.wishlist[(gogData.page - 1) * gogData.productsPerPage + i] = wish
				}
				sync_status_wishlist.text("Done").attr('class', 'BE-success')
				this.context.count_down()
			},
			onerror:function(response) {
				sync_wishlist_shelf.text("Error").attr('class', 'BE-error')
				this.context.errors = true
				this.context.count_down()
			}
		})
	}

	function collect_movies(job) {	
		sync_status_movies.text("Starting...").attr('class', 'BE-in-progress')
		var position = 0


		GM_xmlhttpRequest({
			method: "GET",
			url:"https://www.gog.com/account/movies",
			context: job,
			onload:function(response) {
				var gogData_src = /var gogData = (\{.*\});/.exec(response.responseText)[1]
				var gogData = JSON.parse(gogData_src)
				this.context.movies = Array(gogData.totalProducts)
				for (var i = 0; i < gogData.products.length; i += 1) {
					// read current page
					var product = gogData.products[i]
					var title = product.title.replace(/ ?[\u00AE\u2122]/g, '')
					var movie = {
						image: product.image,
						url: product.url,
						shelf_pos: i,
						title: title.replace(/^(.*), The$/, 'The $1'),
						sort_title: title.replace(/^The (.*)$/, '$1, The'),
						slug: product.slug,
						id: product.id
					}
					this.context.movies[(gogData.page - 1) * gogData.productsPerPage + i] = movie
				}

				// read other pages
				this.context.movie_pages_to_read = gogData.totalPages - 1
				this.context.movie_list_errors = false
				function complete(job) {
					job.movie_pages_to_read -= 1
					if (job.movie_pages_to_read <= 0) {
						if (job.movie_list_errors) {
							job.errors = true
							sync_status_movies.text("Error").attr('class', 'BE-error')
						} else {
 							sync_status_movies.text("Done").attr('class', 'BE-success')
						}
						job.count_down()
					}
				}
				for (var page = 1; page <= gogData.totalPages; page += 1) {
					if (page != gogData.page) {
						GM_xmlhttpRequest({
							method: 'GET',
							url: 'https://www.gog.com/account/getFilteredProducts?hasHiddenProducts=false&hiddenFlag=0&isUpdated=0&mediaType=2&page='+encodeURIComponent(page)+'&sortBy='+encodeURIComponent(gogData.sortBy)+'&totalPages='+encodeURIComponent(gogData.totalPages),
							context: job,
							onload:function(response) {
								var result = JSON.parse(response.responseText)
								for (var i = 0; i < result.products.length; i += 1) {
									var product = result.products[i]
									var title = product.title.replace(/ ?[\u00AE\u2122]/g, '')
									var movie = {
										image: product.image,
										url: product.url,
										shelf_pos: i,
										title: title.replace(/^(.*), The$/, 'The $1'),
										sort_title: title.replace(/^The (.*)$/, '$1, The'),
										slug: product.slug,
										id: product.id
									}
									this.context.movies[(result.page - 1) *result.productsPerPage + i] = movie
								}

								complete(this.context)

							},
							onerror:function(response) {
								console.log("error", response)
								this.contenxt.movie_list_errors = true
								complete(this.context)
							}
						})
					}
				}
				if (gogData.totalPages <= 1) complete(this.context)
			},
			onerror:function(response) {
				sync_status_movies.text("Error").attr('class', 'BE-error')
				this.context.errors = true
				this.context.count_down()
			}
		})
	}

	function collect_games(job) {	
		sync_status_games.text("Starting...").attr('class', 'BE-in-progress')
		var position = 0


		GM_xmlhttpRequest({
			method: "GET",
			url:"https://www.gog.com/account",
			context: job,
			onload:function(response) {
				var gogData_src = /var gogData = (\{.*\});/.exec(response.responseText)[1]
				var gogData = JSON.parse(gogData_src)
				this.context.games = Array(gogData.totalProducts)
				for (var i = 0; i < gogData.products.length; i += 1) {
					// read current page
					var product = gogData.products[i]
					var title = product.title.replace(/ ?[\u00AE\u2122]/g, '')
					var game = {
						image: product.image,
						url: product.url,
						shelf_pos: i,
						title: title.replace(/^(.*), The$/, 'The $1'),
						sort_title: title.replace(/^The (.*)$/, '$1, The'),
						slug: product.slug,
						id: product.id
					}
					this.context.games[(gogData.page - 1) * gogData.productsPerPage + i] = game
				}

				// read other pages
				this.context.game_pages_to_read = gogData.totalPages - 1
				this.context.game_list_errors = false
				function complete(job) {
					job.game_pages_to_read -= 1
					if (job.game_pages_to_read <= 0) {
						if (job.game_list_errors) {
							job.errors = true
							sync_status_games.text("Error").attr('class', 'BE-error')
						} else {
 							sync_status_games.text("Done").attr('class', 'BE-success')
						}
						job.count_down()
					}
				}
				for (var page = 1; page <= gogData.totalPages; page += 1) {
					if (page != gogData.page) {
						GM_xmlhttpRequest({
							method: 'GET',
							url: 'https://www.gog.com/account/getFilteredProducts?hasHiddenProducts=false&hiddenFlag=0&isUpdated=0&mediaType=1&page='+encodeURIComponent(page)+'&sortBy='+encodeURIComponent(gogData.sortBy)+'&totalPages='+encodeURIComponent(gogData.totalPages),
							context: job,
							onload:function(response) {
								var result = JSON.parse(response.responseText)
								for (var i = 0; i < result.products.length; i += 1) {
									var product = result.products[i]
									var title = product.title.replace(/ ?[\u00AE\u2122]/g, '')
									var game = {
										image: product.image,
										url: product.url,
										shelf_pos: i,
										title: title.replace(/^(.*), The$/, 'The $1'),
										sort_title: title.replace(/^The (.*)$/, '$1, The'),
										slug: product.slug,
										id: product.id
									}
									this.context.games[(result.page - 1) *result.productsPerPage + i] = game
								}

								complete(this.context)

							},
							onerror:function(response) {
								console.log("error", response)
								this.contenxt.game_list_errors = true
								complete(this.context)
							}
						})
					}
				}
				if (gogData.totalPages <= 1) complete(this.context)
			},
			onerror:function(response) {
				sync_status_games.text("Error").attr('class', 'BE-error')
				this.context.errors = true
				this.context.count_down()
			}
		})
	}


function feature_forum_username_link() {
	function on_update(value) {
		switch (value) {
			case true:
				$('.big_user_info .b_u_name').each(function() {
					var div = $(this)
					var name = div.text()
					div.text("")
					
					$("<a>")
					.text(name)
					.attr("href", "http://www.gogwiki.com/wiki/Special:GOGUser/"+escape(name))
					.attr("target", "_blank")
					.appendTo(div)
				})
				break;
			default:
				$('.big_user_info .b_u_name>a').each(function() {
					var a = $(this)
					var div = a.parent()
					var name = a.text()
					div.empty().text(name)
				})
				break;
		}
	}


	$('<style>')
	.text(to_css([
		'.b_u_name>a', [
			'color: inherit'
		]
	]))
	.appendTo(document.head)

	settings.onchange('forum-username-link', on_update)
}

function feature_forum_group_giveaways() {
	function on_update(value) {

		if (value == 'group below other topics') {
			giveaway_topics.remove().insertAfter($('#t_norm'))
			.find('.list_bar_h')
			.click(function() {
				$(this).siblings('.list_row_h').slideToggle()
			})
			$('.list_bottom_bg').remove().appendTo(giveaway_topics)
		} else {
			giveaway_topics.remove().insertBefore($('#t_norm'))
			.find('.list_bar_h')
			.click(function() {
				$(this).siblings('.list_row_h').slideToggle()
			})
			$('.list_bottom_bg').remove().appendTo($('#t_norm'))
		}

		switch (value) {
			case 'hide':
				style.text(to_css([
					'.BE-giveaway-topics, .BE-giveaway-topic', [
						'display: none'
					]
				]))
				break
			case 'group and collapse':
				style.text(to_css([
					'.BE-giveaway-topics', [
						'display: block'
					],
					'.BE-giveaway-topic', [
						'display: none'
					],
				]))
				giveaway_topics.children('.list_row_h').hide()
				break
			case 'group and expand':
			case 'group below other topics':
				style.text(to_css([
					'.BE-giveaway-topics', [
						'display: block'
					],
					'.BE-giveaway-topic', [
						'display: none'
					],
				]))
				giveaway_topics.children('.list_row_h').show()
				break
			default:
				style.text(to_css([
					'.BE-giveaway-topics', [
						'display: none'
					],
					'.BE-giveaway-topic', [
						'display: block'
					],
				]))
		}
	}

	var setting = settings.get('forum-group-giveaways')
	
	var giveaway_topics = $('<div class="favourite_h BE-giveaway-topics">')

	var list = $('<div class="list_row_h">')

	var giveaway_count = 0

	$('#t_norm').find('div.topic_s>a').each(function() {
		if (/giveaway[^/]*$/.test(this.getAttribute('href'))) {
			var row = $(this).closest('.list_row_odd')
			row.clone().appendTo(list)
			row.addClass('BE-giveaway-topic')
			giveaway_count += 1
		}
	})

	if (giveaway_count > 0) {

		var bar = $('<div class="list_bar_h">')
		.append(
			$('<div class="lista_icon_3">').attr('style', 'background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADREAAA0RARg5FhkAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAEWSURBVDhPfdC7SoNBEAXg+cHCUrzgK+RB8iKKhCARERTSiHYWCikCpkgRSJPOYCliYyEWgoriC3hB8hLHc342ywozKT427Nk5ycQA2Nxs0xrUodN0NpTxc5O6SbOcqYcZLNGIPmmYCnR+0Te901nyxvOWljU7L9gpL4tftMf7GbWKO33ZlNplQTsoOEgF9eOiRAWdskCtk7TCIK2gUyv80kuxwvO/FXrXFSJ8CFn0xs6vKkR+Ngyy6E291/aJwTNdMUiU5//g6NLgeVgzSJTnguNxBc/HukGiPBd0RxU8rxyWKM8Fh0OD54nDEuW5YH9g8DyuGiTKc8Fu3+C557BEeS5o9QyeOw5LlOeCrQuD54bDEuUq+AOV2hZAAh3hiwAAAABJRU5ErkJggg==") no-repeat scroll 0px 0px transparent'),
			$('<div class="lista_bar_text">').text("Topics which appear to be giveaways ("+giveaway_count+")")
		)
		.css('cursor', 'pointer')
	
		giveaway_topics
		.append(bar, list)
	}

	var style = $('<style>').appendTo(document.head)

	settings.onchange('forum-group-giveaways', on_update)
}

function feature_hide_alerts() {
	function on_update(value) {

		var total_element = $('._dropdown__toggle>.top-nav__item-count')
		if (total_element.length > 0) {
			var total = 0
			
			if (value["game updates"]) {
				var c = parseInt($('.top-nav__dd-items a[href$="/account"]>.top-nav__item-count').text())
				if (c > 0) total += c
			}
			if (value["forum replies"]) {
				var c = parseInt($('.top-nav__dd-items a[href$="/myrecentposts"]>.top-nav__item-count').text())
				if (c > 0) total += c
			}
			if (value["new messages"]) {
				var c = parseInt($('.top-nav__dd-items a[href$="/messages"]>.top-nav__item-count').text())
				if (c > 0) total += c
			}

			if (total > 0) {
				total_element.text(total)
				total_element.show()
			} else total_element.hide()
		}

	}

	setTimeout(settings.onchange.bind(settings, 'navbar-show-alerts', on_update), 1)
}

function feature_show_sections() {
	function on_update(value) {
		$('.top-nav__items>.top-nav__dropdown--games>a[href="/games"]').parent().toggle(value.games)
		$('.top-nav__items>.top-nav__item[href="/movies"]').toggle(value.movies)
	}

	settings.onchange('navbar-show-sections', on_update)
}

function feature_favicon() {
	function on_update(value) {
		favicon.remove()
		switch (value) {
			case 'v1':
				favicon.attr('href', 'data:image/vnd.microsoft.icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxMTG4MTEx/y8vL/8wMDD/MTEx/zAwMP8vLy//Ly8v/zExMf8xMTH/MTEx/zExMf8xMTH/MTEx/zExMf8xMTG4MTEx/y0tLf8rKyv/LS0t/y4uLv8sLCz/Kysr/ysrK/8sLCz/Li4u/y0tLf8tLS3/LS0t/y4uLv8uLi7/MDAw/zAwMP8im8L/Ksb9/yrG/f8qQEf/I6LM/yrG/f8qxv3/IpvC/ywsLP8qxv3/KDQ3/yi+8f8sLCz/KL7x/y8vL/8wMDD/KMDq/yszNP8wMDD/Li4u/yrK9/8qNDb/KTY4/ynG8v8sLCz/K8/+/yczNv8pxvH/Kioq/ynG8v8vLy//MTEx/yrL6P8qLS3/LS0t/y4uLv8s1vT/Ki8w/yovMP8r0/L/Li4u/y3e/v8oOTz/LNX0/ykuL/8r0/L/MDAw/zIyMv8qydj/MOz//zDs//8sR0n/K8/f/zDs//8w7P//KsnY/zExMf8r0+T/MOz//zDs//8w7P//LuHz/zIyMv8yMjL/MDAw/y8vL/8vLy//MTEx/zIyMv8zMzP/MzMz/zMzM/8zMzP/MjIy/zAwMP8vLy//Ly8v/zExMf8yMjL/MTEx/y0tLf8rKyv/Kysr/ywsLP8xMTH/MzMz/zMzM/8zMzP/MzMz/zExMf8tLS3/Kysr/ysrK/8sLCz/MTEx/zExMf8et4P/HreD/x63g/8cmXD/Ly8v/zAwMP8vLy//Ly8v/zAwMP8wMDD/Hq9+/x63g/8et4P/HJdv/zAwMP8wMDD/LCws/ywsLP8rNDL/IcKQ/y0tLf8sLCz/Kysr/yoqKv8sLCz/Li4u/ywsLP8sLCz/KT03/yC5iv8vLy//Ly8v/yG0jv8l0aP/Kzg1/yXRo/8rKyv/IbSO/yXRo/8l0aP/Ir6V/ysuLf8hsIv/JMic/ys4Nf8kyJz/Ly8v/y8vL/8p4rn/KjUz/ywsLP8p4rn/LCws/yniuf8qMjH/KjIx/yjbtP8pNzT/KNex/yk9Of8pNzT/KNex/y8vL/8wMDD/LfLM/yk0Mv8pMjH/LfLM/y4uLv8t8sz/KTIx/ykxMP8s68b/Kzo3/yvmw/8oPjr/Jz05/yvmw/8xMTH/MjIy/yrYvP8w/dr/MP3a/yrYvP8xMTH/Kti8/zD92v8w/dr/LOXG/zAzM/8p0bb/MP3a/zD92v8q1Lj/MjIy/zMzM/8zMzP/MzMz/zMzM/8zMzP/MzMz/zMzM/8zMzP/MzMz/zMzM/8zMzP/MzMz/zMzM/8zMzP/MzMz/zMzM/8xMTG9MzMz/zMzM/8zMzP/MzMz/zMzM/8zMzP/MzMz/zMzM/8zMzP/MzMz/zMzM/8zMzP/MzMz/zMzM/8xMTG9AAAAAAAAAAAAAFQAAAAAAAAAW0gAAHQgAABjQgAAay0AAG8tAABsbwAAbF0AAFNlAABlcgAAYW4AAEJhAAAEAA==').appendTo(document.head)
				break
			case 'v2':
				favicon.attr('href', 'data:image/vnd.microsoft.icon;base64,AAABAAIAICAAAAEAIACoEAAAJgAAABAQAAABACAAaAQAAM4QAAAoAAAAIAAAAEAAAAABACAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAJiYm2SYmJtkAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/JiYm2SYmJtkmJibZJiYm2QAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8mJibZJiYm2QAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/////////////////////////////////wAAAP8AAAD///////////////////////////////////////////8AAAD/AAAA////////////AAAA/wAAAP///////////wAAAP8AAAD///////////8AAAD/AAAA/wAAAP8AAAD/////////////////////////////////AAAA/wAAAP///////////////////////////////////////////wAAAP8AAAD///////////8AAAD/AAAA////////////AAAA/wAAAP///////////wAAAP8AAAD/AAAA/wAAAP///////////wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA////////////AAAA/wAAAP8AAAD/AAAA////////////AAAA/wAAAP///////////wAAAP8AAAD///////////8AAAD/AAAA////////////AAAA/wAAAP8AAAD/AAAA////////////AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD///////////8AAAD/AAAA/wAAAP8AAAD///////////8AAAD/AAAA////////////AAAA/wAAAP///////////wAAAP8AAAD///////////8AAAD/AAAA/wAAAP8AAAD///////////8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP///////////wAAAP8AAAD/AAAA/wAAAP///////////wAAAP8AAAD///////////8AAAD/AAAA////////////AAAA/wAAAP///////////wAAAP8AAAD/AAAA/wAAAP///////////wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA////////////AAAA/wAAAP8AAAD/AAAA////////////AAAA/wAAAP///////////wAAAP8AAAD///////////8AAAD/AAAA////////////AAAA/wAAAP8AAAD/AAAA/////////////////////////////////wAAAP8AAAD///////////////////////////////////////////8AAAD/AAAA//////////////////////////////////////////////////////8AAAD/AAAA/wAAAP8AAAD/////////////////////////////////AAAA/wAAAP///////////////////////////////////////////wAAAP8AAAD//////////////////////////////////////////////////////wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA////////////////////////////////////////////AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD///////////////////////////////////////////8AAAD/AAAA/wAAAP8AAAD///////////////////////////////////////////8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP///////////////////////////////////////////wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP///////////wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA////////////AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA////////////AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD///////////8AAAD/AAAA/wAAAP8AAAD//////////////////////wAAAP8AAAD///////////8AAAD/AAAA////////////////////////////////////////////AAAA/wAAAP//////////////////////AAAA/wAAAP///////////wAAAP8AAAD/AAAA/wAAAP//////////////////////AAAA/wAAAP///////////wAAAP8AAAD///////////////////////////////////////////8AAAD/AAAA//////////////////////8AAAD/AAAA////////////AAAA/wAAAP8AAAD/AAAA////////////AAAA/wAAAP8AAAD/AAAA////////////AAAA/wAAAP///////////wAAAP8AAAD/AAAA/wAAAP///////////wAAAP8AAAD///////////8AAAD/AAAA/wAAAP8AAAD///////////8AAAD/AAAA/wAAAP8AAAD///////////8AAAD/AAAA/wAAAP8AAAD///////////8AAAD/AAAA////////////AAAA/wAAAP8AAAD/AAAA////////////AAAA/wAAAP///////////wAAAP8AAAD/AAAA/wAAAP///////////wAAAP8AAAD/AAAA/wAAAP///////////wAAAP8AAAD/AAAA/wAAAP///////////wAAAP8AAAD///////////8AAAD/AAAA/wAAAP8AAAD///////////8AAAD/AAAA////////////AAAA/wAAAP8AAAD/AAAA////////////AAAA/wAAAP8AAAD/AAAA////////////AAAA/wAAAP8AAAD/AAAA////////////AAAA/wAAAP///////////wAAAP8AAAD/AAAA/wAAAP///////////wAAAP8AAAD///////////8AAAD/AAAA/wAAAP8AAAD///////////8AAAD/AAAA/wAAAP8AAAD///////////////////////////////////////////8AAAD/AAAA////////////////////////////////////////////AAAA/wAAAP///////////////////////////////////////////wAAAP8AAAD/AAAA/wAAAP///////////////////////////////////////////wAAAP8AAAD///////////////////////////////////////////8AAAD/AAAA////////////////////////////////////////////AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/ICAg3iAgIN4AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/JiYm2SYmJtkgICDeICAg3gAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8mJibZJiYm2QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAAABAAAAAgAAAAAQAgAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAACYmJtkAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/yYmJtkAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/////////////////wAAAP//////////////////////AAAA//////8AAAD//////wAAAP//////AAAA/wAAAP//////AAAA/wAAAP8AAAD//////wAAAP8AAAD//////wAAAP//////AAAA//////8AAAD//////wAAAP8AAAD//////wAAAP8AAAD/AAAA//////8AAAD/AAAA//////8AAAD//////wAAAP//////AAAA//////8AAAD/AAAA/////////////////wAAAP//////////////////////AAAA////////////////////////////AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA//////////////////////8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP//////////////////////AAAA/wAAAP8AAAD/AAAA/wAAAP//////AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD//////wAAAP8AAAD///////////8AAAD//////wAAAP//////////////////////AAAA////////////AAAA//////8AAAD/AAAA//////8AAAD/AAAA//////8AAAD//////wAAAP8AAAD//////wAAAP//////AAAA/wAAAP//////AAAA/wAAAP//////AAAA/wAAAP//////AAAA//////8AAAD/AAAA//////8AAAD//////wAAAP8AAAD//////wAAAP8AAAD//////////////////////wAAAP//////////////////////AAAA//////////////////////8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/yAgIN4AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/yYmJtkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA').appendTo(document.head)
				break
			case 'v3':
				favicon.attr('href', 'data:image/vnd.microsoft.icon;base64,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').appendTo(document.head)
				break
			default:
				favicon.attr('href', favicon_url).appendTo(document.head)
		}
	}

	var favicon = $('head link[rel=icon]')
	if (favicon.length == 0) favicon = $('<link rel="icon" type="image/vnd.microsoft.icon" href="/favicon.ico" />')
	var favicon_url = favicon.attr('href')

	settings.onchange('favicon', on_update)
}

function feature_gamecard_show_descriptions() {
	function on_update(value) {
		if (value) {
			style.text(to_css([
				'.description__text a.description__more', [
					'display: none'
				],
				'.description__text[ng-hide=showAll]', [
					'display: none !important'
				],
				'.description__text[ng-show=showAll]', [
					'display: block !important'
				],
			]))
		} else {
			style.text('')
		}
	}

	var style = $('<style>').appendTo(document.head)
	settings.onchange('gamecard-show-descriptions', on_update)
}

function feature_navbar_library_links() {
	function on_update(value) {
		if (value) {
			style.text(to_css([
				'.BE-navbar-library-links:hover', [
					// 'background: #c3c3c3'
				],
				'.top-nav__dd-item._dropdown__item:hover + .BE-navbar-library-links', [
					// 'background: #B3B3B3'
				],
				'.is-contracted .BE-navbar-library-links', [
					'display: none',
				],
				'.BE-navbar-library-links', [
					'cursor: default',
					'height: 25px !important',
					'text-align: center',
					'border-top: none !important',
					'margin-bottom: 5px'
				],
				'.BE-navbar-library-links a', [
					'width: 16px',
					'height: 12px',
					'display: inline-block',
					'margin: 0px 9px',
					'border: 1px solid #A1A1A1',
					'padding: 5px',
					'background-clip: content-box, padding-box',
					'vertical-align: top',
					'border-radius: 3px',
					'background-image: url("/www/default/-img/acc_sprt.2b08c763.png"), linear-gradient(to bottom, #E6E6E6, #CCC)',
				],
				'.BE-navbar-library-links a:hover', [
					'background-image: url("/www/default/-img/acc_sprt.2b08c763.png"), linear-gradient(to bottom, #666, #939393)',
				],
				'.BE-navbar-library-links a:nth-child(1)', [
					'background-position: -11px -52px, 0 0',
				],
				'.BE-navbar-library-links a:nth-child(2)', [
					'background-position: -11px -64px, 0 0',
				],
				'.BE-navbar-library-links a:nth-child(3)', [
					'background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAMCAYAAACEJVa/AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADREAAA0RARg5FhkAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAABSSURBVDhPY/j//z8DOi4pKfkPwyA5dD66epwGYNOMbDCyQXgNgRkE04DXEGTnorPRXYRNHuwSqhiCLXBJEYOHCS7X4HMpzKJRQ1BTMyhcqBImALz+Fw+lXh8rAAAAAElFTkSuQmCC") no-repeat, linear-gradient(to bottom, #E6E6E6, #CCC) repeat-x',
					'background-position: center 4px, 0 0'
				],

				'.BE-navbar-library-links a:nth-child(1):hover', [
					'background-position: 5px -52px, 0 0',
				],
				'.BE-navbar-library-links a:nth-child(2):hover', [
					'background-position: 5px -65px, 0 0',
				],
				'.BE-navbar-library-links a:nth-child(3):hover', [
					'background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAMCAYAAACEJVa/AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADREAAA0RARg5FhkAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAACFSURBVDhPnZExCsAgEAT9/8MsbGy0EAv9yYYNKPFyOSXFgOcsi3gOgJP03jGgk7PMvwpqrSAMjrOctyU5Z5ARlOfnPDL3S2KM+OLE3yUhBHxx4l9/on307m6WtNagwQLL0c+SUgo0GLLcUpJSggZDlltK/mxnWbG1gZ1bXuK9hwZDlqO/ABlumP/ZvW7rAAAAAElFTkSuQmCC") no-repeat, linear-gradient(to bottom, #666, #939393) repeat-x',
					'background-position: center 4px, 0 0'
				],
			]))
		} else {
			style.text(to_css([
				'.BE-navbar-library-links', [
					'display: none'
				],
			]))
		}
	}

	$('<div class="top-nav__dd-item _dropdown__item BE-navbar-library-links">')
	.append($('<a href="https://www.gog.com/account/games/shelf">'))
	.append($('<a href="https://www.gog.com/account/games/list">'))
	.append($('<a href="https://www.gog.com/account/gifts">'))
	.insertAfter($('.top-nav__dropdown--account .top-nav__dd-item._dropdown__item[href$="/account"]'))

	var style = $('<style>').appendTo(document.head)
	settings.onchange('navbar-library-links', on_update)
}

function feature_gamecard_gogwiki_link() {
	function on_update(value) {
		if (value) {
			$('div.product-details')
			.append(row)
		} else {
			row.remove()
		}
	}

	var row = $('<div class="product-details-row">')
	
	$('<div class="product-details__category">').text("GOGWiki").appendTo(row)

	var title = (unsafeWindow?unsafeWindow:window).gogData.gameProductData.title
		.replace(/[\u2122\u00ae\u2018]/g, '')
		.replace("\u2019", "'")
		.replace("\u2013", "-")
		.replace(/^(.*), The/, 'The $1')
			
	$('<div class="product-details__data">')
	.appendTo(row)
	.append(
		$('<a target="_blank" class="un">')
		.attr('href', "http://www.gogwiki.com/wiki/"+escape(title))
		.text(title)
	)

	var style = $('<style>').appendTo(document.head)
	settings.onchange('gamecard-gogwiki-link', on_update)
}

function feature_avatar_zoom() {
	var zoom_on_click

	function on_update(value) {
		zoom_on_click = value
		if (value) {
			style.text(to_css([
				'.spot_h:first-child+.BE-fullsize-avatar', [
					'margin-top: 13px',
				],
				'.BE-fullsize-avatar', [
					'box-shadow: 1px 1px 3px 0px #000000',
					'z-index: 101',
					'margin-left: 12px',
					'margin-top: 30px',
					'max-height: 420px',
					'cursor: zoom-out',
					'position: absolute'
				],
				'.b_p_avatar_h img', [
					'cursor: zoom-in'
				],
			]))
		} else {
			style.text('')
			$('.BE-fullsize-avatar').click()
		}
	}

	$('.b_p_avatar_h img').click(function() {
		if (!zoom_on_click) return

		var img = $(this)
		var src = img.attr('src')

		if (!img.data('BE-zoomed')) {
		
			img.data('BE-zoomed', true)
			
			// clear all fullsize avatars
			$('.BE-fullsize-avatar').data('BE-thumb', null).remove()
			$('.b_p_avatar_h img').data('BE-zoomed', false)
		
			var post = img.closest('.spot_h')
			
			var fullsize = $('<img alt="" class="BE-fullsize-avatar">')
			.attr('src', src.replace(/_forum_avatar\.jpg$/, '.jpg'))
			.insertBefore(post)
			.one('click', function() {
				$(this).data('BE-thumb').data('BE-zoomed', false)
				$(this).data('BE-thumb', null)
				$(this).remove()
			})
			
			fullsize.data('BE-thumb', img)
			
		}
	})

	var style = $('<style>').appendTo(document.head)

	settings.onchange('forum-avatar-zoom', on_update)
}


function feature_forum_quick_post() {
	function on_update(value) {
		if (value) {
			style.text(to_css([
				'.quick_post .BE-hints p', [
					'margin: 7px 0'
				],
				'.quick_post .BE-hints key', [
					'border: 1px solid',
					'margin: 0 1px',
					'padding: 1px 4px',
					'border-radius: 4px',
					'font-family: serif'
				],
				'.quick_post.BE-focus .BE-hints.BE-focus', [
					'opacity: 1'
				],
				'.quick_post.BE-focus .BE-hints', [
					'opacity: 0'
				],
				'.quick_post .BE-hints.BE-focus', [
					'opacity: 0'
				],
				'.quick_post .BE-hints', [
					'color: ' + ((forum_skin==0)?'#aaa': '#878787'),
					'position: absolute',
					'margin-top: 13px'
				],
				'.quick_post textarea:invalid', [
					'box-shadow: none',
					'height: 30px'
				],
				'.quick_post > textarea:invalid ~ *', [
					'opacity: 0'
				],
				'.quick_post > *', [
					'transition: opacity ease 0.5s'
				],
				'.quick_post', [
					'background: url("'+((forum_skin==0)?"/www/forum_carbon/-img/post_bg.851b4700.gif": "/www/forum_alu/-img/post_bg.b7d2258c.gif")+'") repeat-x scroll 0 -161px transparent',
					'border-radius: 5px 5px 5px 5px',
					'margin: 0 auto',
					'min-height: 90px',
					'overflow: hidden',
					'padding: 2px 12px',
					'width: 926px'
				],
				'.quick_post h1', [
					'color: ' + ((forum_skin==0)?'#aaa': '#878787'),
					'font-family: "Lucida Grande",Arial,Verdana,sans-serif',
					'font-size: 10px',
					'font-weight: normal',
					'margin: 10px 0 0 58px',
					'clear: both'
				],
				'.quick_post textarea:focus, .quick_post textarea:hover', [
					'border: 1px solid '+((forum_skin==0)?'#DBDBDB': '#4C4C4C')
				],
				'.quick_post textarea:focus', [
					'height: 150px'
				],
				'.quick_post textarea', [
					'background: none repeat scroll 0 0 '+((forum_skin==0)?'#676767': '#D1D1D1'),
					'border: 1px solid '+((forum_skin==0)?'#929292': '#929292'),
					'color: ' + ((forum_skin==0)?'#DBDBDB':'#4C4C4C'),
					'height: 150px',
					'transition: height 0.5s ease 0s',
					'margin: 0 0 5px 168px',
					'padding: 2px',
					'width: 751px',
					'font-family: Arial',
					'font-size: 12px'
				],
				'button.BE-button::-moz-focus-inner,'+
				'button.submit-quick-post::-moz-focus-inner', [
					'border: none'
				],
				'button.BE-button:focus,'+
				'button.submit-quick-post:focus', [
					'color: #ffffff'
				],
				'button.BE-button:hover,'+
				'button.submit-quick-post:hover', [
					'background: linear-gradient(#303030, #393939) repeat scroll 0 0 transparent',
					'background: ' + ((forum_skin==0)?"-webkit-linear-gradient(#303030, #393939)": "-webkit-linear-gradient(#959595, #646464)")+' repeat scroll 0 0 transparent',
					'background: ' + ((forum_skin==0)?"linear-gradient(#303030, #393939)": "linear-gradient(#959595, #646464)")+' repeat scroll 0 0 transparent'
				],
				'button.BE-button:active,'+
				'button.submit-quick-post:active', [
					'background: ' + ((forum_skin==0)?"#4c4c4c": "")
				],
				'button.BE-button:disabled,'+
				'button.submit-quick-post:disabled', [
					'background: linear-gradient(#757575, #828282) repeat scroll 0 0 transparent',
					'box-shadow: none',
					'color: #525252'
				],
				'button.BE-button,'+
				'button.submit-quick-post', [
					'background: ' + ((forum_skin==0)?"-webkit-linear-gradient(#393939, #434343)": "-webkit-linear-gradient(#646464, #959595)")+' repeat scroll 0 0 transparent',
					'background: ' + ((forum_skin==0)?"linear-gradient(#393939, #434343)": "linear-gradient(#646464, #959595)")+" repeat scroll 0 0 transparent",
					'border: medium none',
					'border-radius: 12px 12px 12px 12px',
					'color: ' + ((forum_skin==0)?"#BEBEBE": "#F0F0F0"),
					'font-family: arial, sans-serif',
					'font-size: 11px',
					'font-weight: normal',
					'line-height: 25px',
					'cursor: pointer',
					'margin: 10px 0',
					'display: block',
					'padding: 0 15px',
					'vertical-align: middle',
					'transition: color 0.3s ease'
				],
				'.quick_post div.submit', [
					'float: right',
					'clear: none',
					'overflow: visible',
					'padding: 11px 3px 0 0'
				],
				'.big_post_h:hover .BE-quick-reply', [
					'display: inline-block'
				],
				'.BE-quick-reply', [
					'background: ' + ((forum_skin==0)?"-webkit-linear-gradient(#656566, rgba(101, 101, 102, 0))": "-webkit-linear-gradient(#E5E5E5, rgba(229, 229, 229, 0))"),
					'background: ' + ((forum_skin==0)?"linear-gradient(#656566, rgba(101, 101, 102, 0))": "linear-gradient(#E5E5E5, rgba(229, 229, 229, 0))"),
					'border-radius: 3px 3px 3px 3px',
					'color: ' + ((forum_skin==0)?"#E0E0E0": "#606060"),
					'display: none',
					'height: 23px',
					'margin: 8px 0 0',
					'padding-top: 4px',
					'text-align: center',
					'text-shadow: ' + ((forum_skin==0)?"0px 1px 1px #333333": "none"),
					'width: 60px',
					'cursor: pointer'
				],
			]))

			$('.p_button_right_h').each(function() {
				$('<div class="BE-quick-reply">')
				.text('quick reply')
				.appendTo(this)
				.click(function() {
				
					window.scrollTo(0, $('.quick_post').position().top - Math.round(window.innerHeight*0.4))
					
					var textarea = $('.quick_post textarea').focus()
					
					var quoted = $(this).closest('.big_post_h')
					var quote_nr = quoted.find('.post_nr').text()
					
					var val = textarea.val()
					textarea.val(
						((val.length==0)?"":(val+"\n\n"))
						+ '[quote_'+quote_nr+']'
						+ parse_post(quoted)
						+'[/quote]\n'
					)
					
					show_preview()
				})
			})

		} else {
			$('.BE-quick-reply').remove()

			style.text(to_css([
				'.quick_post', [
					'display: none'
				],
			]))
		}
	}

	var last_post = $('.spot_h:last')
	if (last_post.length > 0) {
		var new_post = $('<textarea required>')
		var preview = $('<p class="BE-preview">')
		var post_button = $('<button class="submit-quick-post">').text('submit quick post')

		$('<div class="quick_post">')
		.append(
			$('<h1>').text('Quick Post'),

			'<div class="BE-hints"><p>Shortcut: <key>Ctrl</key> <key>Space</key></p></div>',
			'<div class="BE-hints BE-focus">'
			+'<p><key>Ctrl</key> <key>I</key>: Italic</p>'
			+'<p><key>Ctrl</key> <key>B</key>: Bold</p>'
			+'<p><key>Ctrl</key> <key>U</key>: Underline</p>'
			+'<p><key>Ctrl</key> <key>Y</key>: Hyperlink</p>'
			+'<p><key>Ctrl</key> <key>L</key>: Spoiler</p>'
			+'<p><key>Ctrl</key> <key>Enter</key>: Submit</p>'
			+'</div>',

			new_post,
			
			$('<div class="submit">')
			.append(
				post_button
			),
			
			$('<h1>').text('Preview'),
			preview
		)
		.insertAfter(last_post)

		// hints respond to focus
		new_post
		.focus( function() { $(this).closest('.quick_post').addClass('BE-focus') } )
		.blur( function() { $(this).closest('.quick_post').removeClass('BE-focus') } )

		// handle shortcut keys in quick post
		new_post.keydown(post_keydown_handler)
		
		// refresh the preview on quic post input
		new_post[0].addEventListener('input', show_preview)
		
		post_button.click(submit_quick_post)
	}

	$(document).keydown(function(event) {
		if (event.ctrlKey && !event.repeat && event.which == 32) {
			window.scrollTo(0, $('.quick_post').position().top - Math.round(window.innerHeight*0.4))
			$('.quick_post textarea').focus()
			return false
		}
	})

	var style = $('<style>').appendTo(document.head)

	settings.onchange('forum-quick-post', on_update)
}

function feature_post_preview() {
	function on_update(value) {
		if (value) {
			style.text(to_css([
				'.text_1, .text_1_bad', [
					'height: 180px',
				],
				'div.files', [
					'z-index: 1',
				],
				'div.submit', [
					'float: right',
					'clear: none',
					'overflow: visible',
					'padding: 11px 3px 0 0'
				],
				'html', [
					'height: 100%',
					'overflow: auto',
				],
				'div.files', [
					'float: left',
					'width: 460px',
					'overflow: hidden',
					'height: auto'
				],
				'.zawartosc', [
					'height: 100%'
				],
				'.zawartosc .kontent', [
					'height: initial'
				],
			]))

			var message = document.getElementById('text')
			var preview = $('<p class="BE-preview">').insertAfter($('.kontent>.submit'))
		
			var refresh_preview = function() {
				var text = post_preview_html(message.value)
			
				preview.html(text)
			}

			// capture the offset of the preview and make it absolute
			preview.css({
				'position': 'absolute',
				'bottom': '0px',
				'height': 'auto',
				'top': preview.offset().top + 'px'
			})
		
			$(message).keydown(post_keydown_handler)
			message.addEventListener('input', refresh_preview)
		
			$('.btn_h>.btn').click(refresh_preview)

			refresh_preview()
		} else {
			$('.BE-preview').remove()
			style.text('')
		}
	}

	var style = $('<style>').appendTo(document.head)
	
	settings.onchange('forum-post-preview', on_update)
}

function add_preview_styles() {
	var style = $('<style>')
	.text(to_css([
		'.BE-preview a', [
			'background: url("'+((forum_skin==0)?"/www/forum_carbon/-img/post_un.a8689b98.gif":"http://static.gog.com/www/forum_alu/-img/zig_underl.8b625731.gif")+'") repeat-x scroll center bottom transparent',
			'color: ' + ((forum_skin==0)?'#DBDBDB':'#4C4C4C')
		],
		'.quick_post .BE-preview', [
			'margin: 0 0 0 168px',
			'padding: 3px',
			'width: 751px',
			'height: auto',
			'overflow: hidden'
		],
		'.BE-preview', [
			'height: 150px',
			'overflow: auto',
			'margin: 0 0 0 143px',
			'padding: 5px',
			'clear: both',
			'width: 650px',
			'word-wrap: break-word',
			'color: ' + ((forum_skin==0)?'#DBDBDB':'#4C4C4C'),
			'transition: height 0.5s ease 0s',
			'font-family: Arial',
			'font-size: 12px'
		],
		'.BE-preview .syntax-warning', [
			'background: #6F3E3E',
			'border-radius: 5px 5px 5px 5px',
			'color: #DBDBDB',
			'display: inline-block',
			'font-size: 11px',
			'font-weight: normal',
			'font-style: normal',
			'font-family: monospace, sans-serif',
			'margin: 0 5px',
			'padding: 0 2px'
		],
		'.BE-preview blockquote', [
			'border-left: 1px solid #929292',
			'padding: 0 0 0 8px',
			'margin: 0'
		],
	]))
	.appendTo(document.head)
}

function feature_click_own_title() {
	function on_update(value) {
		if (value) {
			$('.edit_h_EN').each(function() {
			  var post = $(this).closest('.big_post_main')
			  if (post) {
				var stat = post.find('.b_u_stat')
				if (stat) {
					var stat_text = stat.text()
					stat.empty().append($('<a href="/forum/mysettings" title="Click here to change your forum title">').text(stat_text))
				}
			  }
			})
		} else {
			$('.b_u_stat>a').each(function() {
				var parent = $(this).parent()
				$(this).remove()
				parent.text($(this).text())
			})
		}
	}

	$('<style>').text('.b_u_stat>a { color: inherit; }').appendTo(document.head)

	settings.onchange('forum-title-settings', on_update)
}

function feature_forum_move_edit_note() {
	function on_update(value) {
		if (value) {
			style.text(to_css([
				'.big_post_main:hover .BE-edit-note .pencil_text', [
					'visibility: visible'
				],
				'.BE-edit-note .pencil_text', [
					'visibility: hidden'
				],
				'.BE-edit-note', [
					'padding-top: 4px',
					'left: 180px',
					'position: absolute'
				],
			]))
			$('.post_attaczments .pencil_text').each(
				function() {
					var element = $(this).parent()

					var edit_note = $('<div class="BE-edit-note">')

					element.closest('.big_post_main').find('.post_header_h .p_button_left_h')
					.after(edit_note)

					element.remove()
					element.appendTo(edit_note)
				}
			)
		} else {
			style.text('')
			$('.BE-edit-note .post_attaczments').each(
				function() {
					var element = $(this)
					var parent = element.parent()
					element.remove()

					parent.closest('.big_post_main').find('.post_text')
					.after(element)

					parent.remove()
				}
			)
		}
	}

	var style = $('<style>').appendTo(document.head)

	settings.onchange('forum-move-edit-note', on_update)
}

function feature_forum_quotation_style() {
	function on_update(value) {
		switch (value) {
			case 'distinct':
				style.text(to_css([
					'.post_text_c div.quot', [
						'font-style: normal'
					],
					'.post_text_c div.quot:not(.gog_color),'
					+'.post_text_c div.quot:not(.gog_color) a,'
					+'.post_text_c div.quot:not(.gog_color) span.bold,'
					+'.BE-preview blockquote,'
					+'.BE-preview blockquote a', [
						'color: ' + ((forum_skin==0)?'#A8A8A8':'#686868')
					]
				]))
				break;
			case 'clear':
				style.text(to_css([
					'.post_text_c div.quot div.quot', [
						'background: transparent'
					],
					'.post_text_c div.quot', [
						'font-style: normal',
						'padding: 2px 5px 2px 7px',
						'background: ' + ((forum_skin==0)?'rgba(0, 0, 0, 0.1)':'rgba(255, 255, 255, 0.2)')
					],
					'.post_text_c div.quot:not(.gog_color),'
					+'.post_text_c div.quot:not(.gog_color) a,'
					+'.post_text_c div.quot:not(.gog_color) span.bold,'
					+'.BE-preview blockquote,'
					+'.BE-preview blockquote a', [
						'font-size: 12px'
					]
				]))
				break;
			default:
				style.text('')
		}
	}

	var style = $('<style>').appendTo(document.head)

	settings.onchange('forum-quotation-style', on_update)
}

function feature_wiki_sync() {

	function collect_data() {
		var data = {
			wishlist: [],
			games: {},
			movies: {},
			errors: false,
			countdown: 4,
			timestamp: (new Date()).getTime(),
			count_down: function() {
				this.countdown -= 1
				if (this.countdown == 0) {
					if (this.errors) {
						sync_status_output
						.html("<p>It seems that there were problems collecting information from your account. Try again later - it might just be temporary issue. If you keep having this problem then <a href=\"https://www.gog.com/forum/general/barefoot_essentials_2_gogcom_enhancement\" target=\"blank\">let me know</a>.</p>")
						.show()
					
						sync_status_send.text('Stopped').attr('class', 'BE-error')
						sync_status_restart.show()//.appendTo(gog_sync_element)
					} else {
						send_to_gogwiki(this)
					}
				} else if (this.countdown < 0) {
					sync_status_restart.show()//.appendTo(gog_sync_element)
					sync_status_output.show()
				}
			}
		}

		get_account_information(data)
		collect_wishlist(data)
		collect_games(data)
		collect_movies(data)
		sync_status_send.text('Waiting...').attr('class', 'BE-in-progress')

		sync_status_start.remove()
		sync_status_restart.hide()
		sync_status_output.hide()
		sync_status_progress.show()
	}

	gog_sync_element = $('<div>')

	sync_status_start = $('<p><a>Click here to share your library and wishlist on GOGWiki</a></p>')
	.click(collect_data)
	.appendTo(gog_sync_element)

	sync_status_progress = $('<div class="BE-sync-progress">')
	.hide()
	.appendTo(gog_sync_element)
	.append(
		'<h2>Sync progress</h2>',
		$('<p><span>Loading your GOG account:</span>').append(sync_status_account = $('<span>')),
		$('<p><span>Reading your game collection:</span>').append(sync_status_games = $('<span>')),
		$('<p><span>Reading your movie collection:</span>').append(sync_status_movies = $('<span>')),
		$('<p><span>Reading your wishlist:</span>').append(sync_status_wishlist = $('<span>')),
		$('<p><span>Sending to GOGWiki:</span>').append(sync_status_send = $('<span>'))
	)

	sync_status_output = $('<div>')
	.hide()
	.appendTo(gog_sync_element)

	sync_status_restart = $('<p><a>Click here to try to send to GOGWiki again</a></p>')
	.click(collect_data)
	.hide()
	.appendTo(gog_sync_element)
}


function feature_enhance_bold_text() {
	function on_update(value) {
		if (value) style.text(to_css([
			'.post_text span.bold, .BE-preview b', [
				'font-weight: 800'
			],
		]))
		else style.text('')
	}
	var style = $('<style>').appendTo(document.head)
	
	settings.onchange('forum-bold-text', on_update)
}

function feature_hide_spoilers() {
	if (!settings.get('forum-hide-spoilers')) return

	var style = $('<style>').appendTo(document.head)
	style.text(to_css([
		'.BE-spoiler', [
			'height: 0',
			'display: none'
		],
		'.BE-spoiler.BE-visible', [
			'height: auto',
			'display: block',
			'border: 1px solid '+((forum_skin==0)?"#676767": "#9a9a9a"),
			'padding: 1em',
			'margin: 1em',
			'background: ' + ((forum_skin==0)?"#585858": "#D7D7D7"),
			'border-radius: 0.5em'
		],
		'.BE-spoiler .BE-spoiler .BE-spoiler.BE-visible', [
			'padding: 1em 5px',
			'margin: 1em 1px'
		],
	]))


	function traverse_to_hide_spoilers(parent) {
		function toggle_spoiler() {
			var visible = !$(this).data('visible')
			$(this).data('visible', visible)
			if (visible) {
				$(this).text("hide spoiler")
				.next("div.BE-spoiler").addClass('BE-visible')
			} else {
				$(this).text("show spoiler")
				.next("div.BE-spoiler").removeClass('BE-visible')
			}
		}
		var openings = []
		for (var n = parent.firstChild; n !== null; n = n.nextSibling) {
			if (n.nodeType == 3) {
				
				if (/^\s*\[spoiler\]\s*$/.test(n.nodeValue)) {
					openings.push(n)
				} else if (/^\s*\[\/spoiler\]\s*$/.test(n.nodeValue)) {
					var opening = openings.pop()
					if (opening === null) continue
					
					var spoiler_button = $('<button class="BE-button">')
					.text("show spoiler")
					.click(toggle_spoiler)
					.insertBefore(opening)
					var spoiler_content = $('<div class="BE-spoiler">')
					.insertAfter(spoiler_button)
					
					var next = opening.nextSibling
					for (nn = opening; nn !== null; nn = next) {
						next = nn.nextSibling
						parent.removeChild(nn)
						if (nn !== opening && nn !== n) spoiler_content.append(nn)
						if (nn === n) break
					}
					
					n = spoiler_content.get(0)
				}
			} else if (n.nodeType == 1) {
				traverse_to_hide_spoilers(n)
			}
		}
	}

	$('.post_text_c').each(function() {
		if (0 <= this.textContent.indexOf('[spoiler]')) {
			traverse_to_hide_spoilers(this)
		}
	})
	
	// remove all extra linebreaks around spoilers
	$('.BE-button').each(function() {
		for (var prev = this.previousSibling; prev; prev = this.previousSibling) {
		
			if (prev.nodeType == 1) {
				if (prev.nodeName != 'BR') break
			} else if (prev.nodeType == 3) {
				if (!/^[\s]*$/.test(prev.nodeValue)) break
			} else break
			this.parentElement.removeChild(prev)
		}
	})
	$('.BE-spoiler').each(function() {
	
		// strip after the spoiler
		for (var next = this.nextSibling; next; next = this.nextSibling) {
		
			if (next.nodeType == 1) {
				if (next.nodeName != 'BR') break
			} else if (next.nodeType == 3) {
				if (!/^[\s]*$/.test(next.nodeValue)) break
			} else break
			this.parentElement.removeChild(next)
		}
		
		// strip the front
		for (var next = this.firstChild; next; next = this.firstChild) {
			if (next.nodeType == 1) {
				if (next.nodeName != 'BR') break
			} else if (next.nodeType == 3) {
				if (!/^[\s]*$/.test(next.nodeValue)) break
			} else break
			this.removeChild(next)
		}
		// strip the tail
		for (var next = this.lastChild; next; next = this.lastChild) {
			if (next.nodeType == 1) {
				if (next.nodeName != 'BR') break
			} else if (next.nodeType == 3) {
				if (!/^[\s]*$/.test(next.nodeValue)) break
			} else break
			this.removeChild(next)
		}
	})
}


function feature_add_essentials_link() {
	function on_update(value) {
		$('.BE-essentials-menu-item').remove()

		var menu = $('.top-nav__dropdown--account .top-nav__dd-items._dropdown__items')

		var item = $('<a href="javascript:document.getElementById(\'BE-essentials-menu-item-workaround\').click()" class="top-nav__dd-item _dropdown__item BE-essentials-menu-item">')
		.text('ESSENTIALS')

		switch (value) {
			case 'bottom':
				menu.append(item)
				break;
			default:
				menu.prepend(item)
		}
	}
	var style = $('<style>').appendTo(document.head)

	$('<div id="BE-essentials-menu-item-workaround">')
	.css({background: 'red', height: '1px', width: '1px', position: 'absolute', top: '0px', left: '0px', 'z-index': -1000})
	.click(popup.show.bind(popup, 'Changelog'))
	.appendTo(document.body)
	// TEMP workaround
	
	settings.onchange('navbar-essentials-position', on_update)
}

function feature_library_always_show_count() {
	if (settings.get('library-always-show-count')) {
		try {
			var observer = new MutationObserver(function(mutations) {
	
				mutations.forEach(function(mutation) {
				
					var target = mutation.target
				
					if (mutation.attributeName == 'class') switch (target.className) {
						case 'middle_btns': {
							if (!(target.childElementCount > 0)) {
						
								// count games
								var num_games = document.querySelectorAll('#shelfGamesList .shelf_game:not(.empty), #hiddenGamesList .shelf_game:not(.empty)').length
		
								// display game count
								document.querySelector('#tagButtons').innerHTML = '<span class="shelf_btn css3pie new tag-btn">NEW &amp; UPDATED <span class="count">0</span></span><span class="shelf_btn css3pie all active tag-btn">ALL <span class="count">'+num_games+'</span></span>'
							}
						} break;
						case 'list_header': {
							if (!(target.childElementCount > 0)) {
						
								// count games
								var num_games = document.querySelectorAll('#gamesList .game-item, #hiddenGamesList .game-item').length
						
								// display game count
								document.querySelector('#tagButtons').innerHTML = 'My collection <span class="list_btn css3pie new tag-btn">NEW &amp; UPDATED <span class="count">0</span></span><span class="list_btn css3pie all active tag-btn">ALL <span class="count">'+num_games+'</span></span>'
							}
						} break;
					}
				})
		
			})
			observer.observe(document.querySelector('#tagButtons'), {attributes: true})
		} catch (exception) {
			// no action necessary
		}
	}
}

function feature_navbar_position() {
	function on_update(value) {
		switch (value) {
			case 'absolute':
				style.text(to_css([
					'.top-nav', [
						'position: absolute',
					],
				]))
				break;
			default:
				style.text('')
		}
	}
	var style = $('<style>').appendTo(document.head)
	
	settings.onchange('navbar-position', on_update)
}

function feature_catalogue_hide_owned() {
	function on_update(value) {
		if (value) {
			style.text(to_css([
				'.product-row.is-owned', [
					'display: none'
				]
			]))
		} else {
			style.text('')
		}
	}
	var style = $('<style>').appendTo(document.head)

	settings.onchange('catalogue-hide-owned', on_update)
}

function feature_catalogue_add_hide_owned_toggle() {
	function on_update(value) {
		toggle.toggle(value)
	}
	function on_show_or_hide(value) {
		state.text(value ? 'HIDDEN' : 'SHOWN')
	}
	var toggle = $('<div class="header__switch">')
	.text('OWNED: ')

	var state = $('<span class="header__dropdown module-header-dd _dropdown is-contracted">')
	.text('SHOW')
	.click(function() {
		settings.set('catalogue-hide-owned', !settings.get('catalogue-hide-owned'))
	})
	.appendTo(toggle)

	toggle.appendTo($('.header__switches'))

	settings.onchange('catalogue-show-hide-owned-toggle', on_update)
	settings.onchange('catalogue-hide-owned', on_show_or_hide)
}

function feature_forum_show_hover_elements() {
	function on_update(value) {
		if (value) {
			style.text(to_css([
				'div.on_off_stat, div.p_button_left_h', [
					'display: block'
				],
				'.BE-edit-note .pencil_text', [
					'visibility: visible'
				]
			]))
		} else {
			style.text('')
		}
	}
	var style = $('<style>').appendTo(document.head)

	settings.onchange('forum-show-hover-elements', on_update)
}

function feature_topic_collapsible_footer() {
	function on_update(value) {
		if (value) {
			style.text(to_css([
				'.main-footer__dark-footer', [
					'position: absolute',
					'left: 0',
					'right: 0',
					'bottom: 16px',
				],
				'.main-footer', [
					'min-height: 0',
					'height: 98px',
					'transition: height 0.5s linear, margin-top 0.5s linear',
					'position: absolute',
					'left: 0',
					'right: 0',
				],
				'.main-footer:hover', [
					'height: 410px',
					'margin-top: -312px',
				],
				'body', [
					'height: 100%',
					'height: calc(100% - 103px)',
				],
				'html', [
					'height: auto',
					'min-height: 100%',
				],
				'div.sta_container', [
					'overflow: hidden'
				]
			]))
		} else {
			style.text('')
		}
	}
	var style = $('<style>').appendTo(document.head)

	settings.onchange('forum-collapsible-footer', on_update)
}

function feature_forum_collapsible_footer() {
	function on_update(value) {
		if (value) {
			style.text(to_css([
				'.main-footer__dark-footer', [
					'position: absolute',
					'left: 0',
					'right: 0',
					'bottom: 16px',
				],
				'.main-footer', [
					'min-height: 0',
					'height: 98px',
					'transition: height 0.5s linear, margin-top 0.5s linear',
					'position: absolute',
					'left: 0',
					'right: 0',
				],
				'.main-footer:hover', [
					'height: 410px',
					'margin-top: -312px',
				],
				'.footer-spacer', [
					'height: 102px',
				],
				'.content', [
					'margin-bottom: -97px'
				]
			]))
		} else {
			style.text('')
		}
	}
	var style = $('<style>').appendTo(document.head)

	settings.onchange('forum-collapsible-footer', on_update)
}

function feature_reduce_footer_spacer() {
	function on_update(value) {
		if (value) {
			style.text(to_css([
				'.footer-spacer', [
					'height: 150px',
				]
			]))
		} else {
			style.text('')
		}
	}
	var style = $('<style>').appendTo(document.head)

	settings.onchange('bugfix-footer-spacer', on_update)
}

function feature_navbar_fix_search() {
	return
	var search_holder = $('a.top-nav-extras-search-holder')

	if (search_holder.length == 1) {
		search_holder
		.after(
			$('<div class="top-nav-extras-search-holder">')
			.append(
				$('<div class="a.top-nav-extras-search" ng-click="onSearchOpen()" gog-dropdown-toggle="navSearchDropdown">')
				.html('<i class="ic icon-search top-nav-extras-search-icon"></i> Search <div class="_dropdown__pointer--top"></div>')
			)
		)
		.remove()
		
		$('.top-nav__items')

		.before($('<div class="_dropdown top-nav__results is-contracted top-nav__results--search" ng-cloak="" ng-controller="navSearchCtrl" gog-nav-search-key="" gog-dropdown="" gog-dropdown-group="navSearchDropdown" gog-dropdown-offcanvas="1" gog-css-data="" ng-click="$event.stopPropagation()"><var class="css-data-holder"></var><div class="_dropdown__item--unobtrusive"><div class="top-nav-search-holder"><div class="top-nav-search _search" gog-search="searchTerm" ng-class="{ \'is-spinning\' : is_loading }"><input class="top-nav-search__input _search__input js-nav-search-input" ng-model="searchTerm" gog-focus-me="navSearchOpen" ng-focus="topNav.setTopNavState(4)" ng-model-options="{ debounce: {\'default\': 300} }" type="search"><i class="ic icon-search _search__icon top-nav-search__icon"></i><i class="ic icon-clear _search__clear no-hl top-nav-search__clear"></i><i class="spinner _search__spinner show-on-off-canvas"></i><i class="spinner _search__spinner hide-on-off-canvas"></i></div></div><div class="top-nav-res__category-holder"><!-- micro ng --><div class="product-row top-nav-res__item js-is-focusable product-row--micro" gog-product="{{ searchProduct.id }}" ng-repeat="searchProduct in results | limitTo: maxResultsToShow" ng-class="{\'is-owned\' : product.isOwned, \'product-row--has-card\': product.url, \'product-row--free\': product.price.isFree, \'is-buyable\' : product.isPriceVisible }"><div class="product-row__price product-row__alignment"><div class="price-btn ng-cloak" ng-if="!product.isPriceVisible"><span class="price-btn__text">TBA</span></div><div ng-if="::product.isPriceVisible" class="price-btn price-btn--active" ng-click="blockCartFlash(); productCtrl.addToCart()" ng-class="{\'price-btn--in-cart\' : product.inCart, \'price-btn--free\': product.price.isFree }"><span ng-show="product.inCart" class="price-btn__text ng-cloak"><i class="ic icon-cart"></i></span><span ng-if="!product.inCart" class="price-btn__text"><span class="price-btn__text--owned" ng-cloak="" ng-show="product.isOwned">owned</span><span ng-show="product.price.isFree" ng-cloak=""> Free </span><span ng-show="!product.price.isFree"><span class="curr-symbol" ng-bind="::product.price.symbol"></span><span ng-bind="product.price.amount"></span></span></span></div></div><a href="" ng-href="{{ ::product.url }}" class="product-row__link"><div class="product-row__discount product-row__alignment" ng-if="product.price.isDiscounted &amp;&amp; product.price.discount != 100" ng-cloak=""><span class="price-text--discount"><span ng-bind="product.price.discountPercentage">0</span>% </span></div><div class="product-row__text"><div class="product-row__content"><div class="product-row__content-in"><div class="product-row__title"><div class="product-title" ng-if="!product.isComingSoon &amp;&amp; !product.isWishlisted"><span class="product-title__text" ng-bind="::product.title | uppercase"></span></div><div class="product-title product-title--flagged" ng-if="product.isComingSoon || product.isWishlisted" ng-cloak="" gog-labeled-title="{&quot;maxLineNumber&quot;: 2, &quot;title&quot;: &quot;{{ ::product.title | uppercase }}&quot; }"><span class="product-title__text" ng-bind="::product.title | uppercase"></span><span class="product-title__flags"><i ng-if="product.isWishlisted" class="_product-flag product-title__icon ic icon-heart"></i><span ng-if="product.isComingSoon" class="_product-flag product-title__flag">Soon</span></span></div></div></div></div></div></a></div></div><!-- nav-results__category-holder --><a ng-href="/games##search={{ searchTerm | ommitAngularEncoding | encodeURIComponent }}" class="top-nav-res__category top-nav-res__item top-nav-res__item--all _dropdown__force-toggle js-is-focusable js-nav-search-link" ng-show="showGamesLink()"> all games ({{totalGames}}) </a><a ng-href="/movies##search={{ searchTerm | ommitAngularEncoding | encodeURIComponent }}" class="top-nav-res__category top-nav-res__item top-nav-res__item--all _dropdown__force-toggle js-is-focusable js-nav-search-link" ng-show="showMoviesLink()"> ALL MOVIES ({{totalMovies}}) </a><div class="top-nav-res__category top-nav-res__item top-nav-res__item--none" ng-show="showNoResults()"> No results found. </div><a href="/games" class="top-nav-res__category top-nav-res__item top-nav-res__item--none js-is-focusable" ng-show="showNoResults()"> BROWSE ALL GAMES </a><a href="/movies" class="top-nav-res__category top-nav-res__item top-nav-res__item--none js-is-focusable" ng-show="showNoResults()"> BROWSE ALL MOVIES </a></div></div>'))
	} else console.log($('.top-nav__results--search')[0].outerHTML)
}

function feature_redeem_shortcut_keys() {
	feature_redeem_shortcut_keys.callback = function(event) {
		switch (event.key) {
			case 'Left': {
				var element = document.querySelector('.pagin__prev')
				if (element) element.click()
				break;
			}
			case 'Right': {
				var element = document.querySelector('.pagin__next')
				if (element) element.click()
				break;
			}
		}
	}
	function on_update(value) {
		if (value) {
			document.addEventListener('keypress', feature_redeem_shortcut_keys.callback)
		} else {
			document.removeEventListener('keypress', feature_redeem_shortcut_keys.callback)
		}
	}

	settings.onchange('redeem-shortcut-keys', on_update)
}

try {
	settings.initialise(config, function() {

		feature_favicon()
		feature_BE_style()
		feature_wiki_sync()

		// navbar
		feature_navbar_position()
		feature_navbar_style()
		feature_navbar_opacity()
		feature_notification_style()
		feature_cart_style()
		feature_hide_alerts()
		feature_show_sections()
		// feature_navbar_library_links()
		feature_add_essentials_link()
		// feature_navbar_fix_search()

		// 404
		if (document.title == "404 - Page not found - GOG.com") {
		}
		
		// forum
		else if (/^\/forum/.test(window.location.pathname)) {
	
			detect_forum_skin()
			add_preview_styles()

			// forum section
			if (/^\/forum\/[^/]*(?:\/(?:page[0-9]+)?)?$/.test(window.location.pathname)) {
				feature_forum_group_giveaways()
				feature_forum_collapsible_footer()
			}

			// forum popup
			else if (location.pathname == "/forum/ajax/popUp") {
				feature_post_preview()
			}

			// forum topic
			else if (/^\/forum\/[^/]*\/[^/]*(?:\/(?:page[0-9]+|post[0-9]+)?)?$/.test(window.location.pathname)) {
				feature_forum_username_link()
				feature_avatar_zoom()
				feature_forum_quick_post()
				feature_click_own_title()
				feature_forum_move_edit_note()
				feature_forum_quotation_style()
				feature_enhance_bold_text()
				feature_hide_spoilers()
				feature_forum_show_hover_elements()
				feature_topic_collapsible_footer()
				feature_reduce_footer_spacer()
			}
		}

		// moviecard
		else if (/^\/movie\/[^/]*$/.test(window.location.pathname)) {
			feature_gamecard_show_descriptions()
		}
		// gamecard
		else if (/^\/game\/[^/]*$/.test(window.location.pathname)) {
			feature_gamecard_show_descriptions()
			feature_gamecard_gogwiki_link()
		}
		// library
		else if ((new RegExp("^/account(?:/(?:games|movies)(?:/(?:shelf|list))?)?$")).test(window.location.pathname)) {
			feature_library_always_show_count()
		}
		// catalogue
		else if ((new RegExp('^/(?:games|movies)(?:/.*)?$')).test(window.location.pathname)) {
			feature_catalogue_hide_owned()
			feature_catalogue_add_hide_owned_toggle()
		}
		else if (/^\/redeem\/.*$/.test(window.location.pathname)) {
			feature_redeem_shortcut_keys()
		}


	})

	// check version, and show changelog if new
	var last_BE_version = GM_getValue('last_BE_version')
	if (last_BE_version === undefined) last_BE_version = default_prev_version
	else if (cmpVersion(last_BE_version, version) < 0) {
		popup.show('Changelog')
	}
	GM_setValue('last_BE_version', version)

} catch (exception) { console.error(exception)}
