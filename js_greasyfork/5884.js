// ==UserScript==
// @name        steamgifts.com sync tracker
// @namespace   Barefoot Monkey
// @description When visiting the SteamGifts.com sync page this script informs you of any new or missing games or groups
// @include     http://www.steamgifts.com/sync
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/5884/steamgiftscom%20sync%20tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/5884/steamgiftscom%20sync%20tracker.meta.js
// ==/UserScript==

try {

	var now = (new Date()).valueOf()

	// determine username
	var user_e = document.querySelector('a[href^="/user/"]')
	if (user_e) {
		var username = user_e.getAttribute('href').replace('/user/', '')
	} else throw "Username could not be determined"

	// retrieve data from storage
	var info = JSON.parse(GM_getValue(username, '{ "games": {}, "groups": {} }'))

	// scan games and groups
	var games = $('.invites .code, .invites .heading')

	var scanning = 0
	for (var i = 0; i < games.length; i += 1) {
		var title = $(games[i]).text().trim()
		if ($(games[i]).attr('class') == 'heading') {
			if (title == 'Games in Your Account') scanning = 1
			else if (/^You're a Member of [0-9]+ Groups?$/.test(title)) scanning = 2
			else scanning = 0
		} else {
			var list = [undefined, info.games, info.groups][scanning]
			if (list !== undefined) {
				var item = list[title]
				if (item === undefined) {
					list[title] = {
						first_seen: now,
						last_seen: now
					}
				} else {
					item.last_seen = now
					if (item.missing_since) {
						delete item.missing_since
						item.rediscovered = now
					}
				}
			}
		}
	}

	// check for missing games and groups
	for (var i in info.games) {
		var game = info.games[i]
		if (game.last_seen != now && game.missing === undefined) game.missing = now
	}
	for (var i in info.groups) {
		var group = info.groups[i]
		if (group.last_seen != now && group.missing === undefined) group.missing = now
	}


	// save data
	GM_setValue(username, JSON.stringify(info))


	// prepare to display changes in game list
	var games_added = [], games_removed = []
	var groups_added = [], groups_removed = []

	for (var i in info.games) {
		var game = info.games[i]
		if (game.missing == now) games_removed.push(i)
		if (game.first_seen == now || game.rediscovered == now) games_added.push(i)
	}

	for (var i in info.groups) {
		var group = info.groups[i]
		if (group.missing == now) groups_removed.push(i)
		if (group.first_seen == now || group.rediscovered == now) groups_added.push(i)
	}


	// display changes in game list
	if (games_added.length > 0 || games_removed.length > 0 || groups_added.length > 0 || groups_removed.length > 0) {
		var parent = $('<div>').insertBefore($('.invites .heading:first'))
		
		function toggle_function(element) {
			return function() {
				element.slideToggle()
			}
		}

		var lists = [
			{items: games_removed, colour: '#DD7070', plural: " games are missing", singular: "1 game is missing"},
			{items: games_added, colour: '#68924E', plural: " new games were discovered", singular: "1 new game was discovered"},
			{items: groups_removed, colour: '#DD7070', plural: " groups are missing", singular: "1 group is missing"},
			{items: groups_added, colour: '#68924E', plural: " new groups were discovered", singular: "1 new group was discovered"},
		]

		for (var i in lists) {
			var list = lists[i]

			if (list.items.length > 0) {
				var list_e = $('<ul>').css({
					'list-style-position': 'inside',
					'color': list.colour,
					'font-size': '12px'
				})
				.hide()
				.appendTo(parent)
			
				list.items.forEach(function(item) {
					list_e.append($('<li>').text(item))
				})
			
				var heading = $('<p>').css({
					'margin': '1em 0 0.5em',
					'color': list.colour,
					'cursor': 'pointer',
					'font-size': '12px'
				})
				.click(toggle_function(list_e))
				.text(list.items.length > 1 ? (list.items.length + list.plural) : list.singular)
				.insertBefore(list_e)
			}
		}
	}

} catch (exception) {
	console.log('steamgifts.com sync tracker:', exception)
}
