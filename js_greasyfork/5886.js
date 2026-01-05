// ==UserScript==
// @name        steamgifts.com shortcut keys
// @namespace   Barefoot Monkey
// @description Adds helpful keyboard shortcut keys to steamgifts.com
// @include     http://www.steamgifts.com/*
// @include     https://www.steamgifts.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @version     2.2
// @grant       GM_setValue
// @grant       GM_getValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/5886/steamgiftscom%20shortcut%20keys.user.js
// @updateURL https://update.greasyfork.org/scripts/5886/steamgiftscom%20shortcut%20keys.meta.js
// ==/UserScript==
var version = '2.2'

add_menu_entry()

$('<style>')
.text(
	'.BarefootMonkey-popup-bg {'
	+'	background: #3C424D;'
	+'	position: fixed;'
	+'	top: 0;'
	+'	bottom: 0;'
	+'	left: 0;'
	+'	right: 0;'
	+'	opacity: 0.85;'
	+'	z-index: 9988;'
	+'	cursor: pointer;'
	+'}'

	+'.BarefootMonkey-popup ul {'
	+'	list-style: inside;'
	+'}'
	
	+'.BarefootMonkey-popup p {'
	+'	margin: 0.7em 0;'
	+'}'

	+'.BarefootMonkey-popup h1 i {'
	+'	font-size: 0.5em;'
	+'	font-weight: bold;'
	+'}'

	+'.BarefootMonkey-popup a {'
	+'	color: #4B72D4;'
	+'	font-weight: bold;'
	+'}'
	+'.BarefootMonkey-popup h1 {'
	+'	font-size: 1.5em;'
	+'	margin: 0px 0px 0.5em;'
	+'	border-bottom: 1px solid #6B7A8C;'
	+'	padding-bottom: 0.5em;'
	+'}'
	+'.BarefootMonkey-popup key, .BarefootMonkey-popup b {'
	+'	font-weight: bold;'
	+'}'
	
	+'.BarefootMonkey-popup {'
	+'	background: #F0F2F5 none repeat scroll 0% 0%;'
	+'	z-index: 9999;'
	+'	position: fixed;'
	+'	left: calc(50vw - 18em);'
	+'	top: 20vh;'
	+'	border-radius: 4px;'
	+'	color: #6B7A8C;'
	+'	font: 300 17px "Open Sans",sans-serif;'
	+'	padding: 1em;'
	+'	width: 36em;'
	+'	max-height: calc(80vh - 3em);'
	+'	overflow: auto;'
	+'}'
)
.appendTo(document.head)

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

function close_popup() {
	$('.BarefootMonkey-popup-bg, .BarefootMonkey-popup').fadeOut(500, function() { $(this).remove() })
}
function open_popup() {
	var bg = $('<div class="BarefootMonkey-popup-bg">')
	.hide()
	.appendTo(document.body)
	.click(close_popup)

	var popup = $('<aside class="BarefootMonkey-popup">')
	.hide()
	.html('<h1>steamgifts.com shortcut keys <i>version '+version+'</i></h1>'
		+"<p>A userscript which adds several helpful keyboard shortcuts to steamgifts.com</p>"
		+"<p>On the main page or giveaway list search results:</p>"
		+"<ul>"
		+"<li><key>Ctrl</key> + <key>E</key>: focus on the search box</li>"
		+"<li><key>Ctrl</key> + <key>Right</key>: next page</li>"
		+"<li><key>Ctrl</key> + <key>Left</key>: previous page</li>"
		+"</ul>"
		+"<p>On a giveaway:</p>"
		+"<ul>"
		+"<li><key>Ctrl</key> + <key>E</key>: enter the giveaway</li>"
		+"<li><key>Ctrl</key> + <key>Shift</key> + <key>E</key>: remove your entry</li>"
		+"</ul>"
		+"<p>On a comment, support or discussion page:</p>"
		+"<ul>"
		+"<li><key>Ctrl</key> + <key>Space</key>: focus on the \"new comment\" text area</li>"
		+"<li><key>Ctrl</key> + <key>Enter</key>: submit your comment</li>"
		+"<li><key>Alt</key> + <key>R</key> or <key>Alt</key> + <key>R</key>: Insert the name of the user to whom you typing a reply</li>"
		+"<li><key>Alt</key> + <key>O</key>: Insert the name of the user who created this discussion or giveaway</li>"
		+"</ul>"
		+'<p>This popup appears the first time you load steamgifts.com after <a href="https://greasyfork.org/en/scripts/5886-steamgifts-com-shortcut-keys" target="_blank">steamgifts.com shortcut keys</a> is installed or updated. To see it again, look in your <b>Account</b> menu at the top-right of the page.</p>'
		+"<h1>latest changes</h1>"
		+"<ul>"
		+"<li>Added support for HTTPS</li>"
		+"<li>Tidied up the list of shortcut keys</li>"
		+"</ul>"
	)
	.appendTo(document.body)

	$('.BarefootMonkey-popup-bg, .BarefootMonkey-popup').fadeIn(500)
}

// in progress
function add_menu_entry() {
	var menu = document.querySelector('[href="/account"] ~ .nav__relative-dropdown .nav__absolute-dropdown')
	var row = document.createElement('a')
	row.setAttribute('class', 'nav__row')
	
	var child
	
	child = document.createElement('i')
	child.setAttribute('class', 'fa fa-fw')
	row.appendChild(child)

	var summary = document.createElement('div')
	summary.setAttribute('class', 'nav__row__summary')
	row.appendChild(summary)

	child = document.createElement('p')
	child.setAttribute('class', 'nav__row__summary__name')
	child.textContent = 'steamgifts.com shortcut keys'
	summary.appendChild(child)

	child = document.createElement('p')
	child.setAttribute('class', 'nav__row__summary__description')
	child.textContent = 'Configure this user script'
	summary.appendChild(child)

	menu.appendChild(row)
	row.style.cursor = 'pointer'
	row.addEventListener('click', open_popup)
}

try {
	var OP_name
	var is_giveaway, is_forum, is_support

	// determine where on the site we are visiting
	var path_matches = location.pathname.match(/^\/([^\/]*)\/([^\/]*)\/.*/)
	if (path_matches) {
		switch (path_matches[1]) {
			case 'giveaway': is_giveaway = true; break
			// case 'support': is_support = true; break
			case 'discussion': is_forum = true; break
		}
	}

	// discover the name of the author of the thread/giveaway
	if (is_giveaway) {
		var name_element = document.querySelector('.featured__summary .featured__column a')
		if (name_element) {
			OP_name = name_element.textContent.trim()
		}
	} else if (is_forum) {
		var name_element = document.querySelector('.comment__username>a')
		if (name_element) {
			OP_name = name_element.textContent.trim()
		}
	}

	// catch keypress events
	document.addEventListener("keydown", function(event) {
	
		try {

			// ctrl shortcut keys to focus or submit the textbox
			if (event.ctrlKey && !event.repeat) {

				// ctrl+enter
				if (event.which == 13) {
					var active = document.activeElement

					if (active && active === document.querySelector('.comment--submit div.comment__description>form>textarea[name=description]')) {
						var button = document.querySelector('.comment--submit .comment__submit-button')
						if (button) {
							if (button.click) button.click()
							else {
								button.dispatchEvent(
									new MouseEvent('click', {
										'view': window,
										'bubbles': true,
										'cancelable': true
									})
								)
							}
							event.preventDefault()
						}
					}
				}

				// ctrl+space
				else if (event.which == 32) {
					// find the comment textarea
					var textbox = document.querySelector('.comment--submit div.comment__description>form>textarea[name=description]')

					// give focus to the comment textarea
					if (textbox) {
						textbox.focus()
						event.preventDefault()
					}
				}
			}

			if (!event.repeat) {

				// ignore case
				var which = event.which|32
				var search_page_regexp = '^\\?(?:.*&)?page=([0-9]+)(?:&.*)?$'

				// left
				if (event.ctrlKey && which == 37) {
					if (location.pathname == '/giveaways/search') {
						var regexp = new RegExp(search_page_regexp)
						var matches = regexp.exec(location.search)
						if (matches.length > 1) {
							page = parseInt(matches[1])
							if (!isNaN(page) && page > 1) {
								location = '/giveaways/search?page='+(page-1)
							}
						}
					}
				
				// right
				} else if (event.ctrlKey && which == 39) {
					if (location.pathname == '/') {
						location = '/giveaways/search?page=2'
					} else if (location.pathname == '/giveaways/search') {
						var regexp = new RegExp(search_page_regexp)
						var matches = regexp.exec(location.search)
						if (matches.length > 1) {
							page = parseInt(matches[1])
							if (!isNaN(page)) {
								location = '/giveaways/search?page='+(page+1)
							}
						}
					}
				
				// ctrl+e
				} else if (event.ctrlKey &&  which == 101) {
					if (is_giveaway) {
						var button

						if (event.shiftKey) {
							button = document.querySelector('.sidebar__entry-delete:not(.is-hidden)')
						} else {
							button = document.querySelector('.sidebar__entry-insert:not(.is-hidden)')
						}

						if (button) {
							if (button.click) button.click()
							else {
								button.dispatchEvent(
									new MouseEvent('click', {
										'view': window,
										'bubbles': true,
										'cancelable': true
									})
								)
							}
						}
						event.preventDefault()
					} else {
						var offset = 100

						var search = document.querySelector('.sidebar__search-input')
						if (search) {
							search.focus()
							search.select()
							window.scroll(0, search.offsetTop - offset)
						}
						event.preventDefault()
					}
	
				// handle comment-editing shortcuts
				} else {

					var active = document.activeElement

					if (active && active === document.querySelector('.comment--submit div.comment__description>form>textarea[name=description]')) {

						// alt+o = original poster's name
						if (event.altKey && which == 111) {

							// insert OP's name it into the comment
							if (OP_name) {

								// take note of the cursor position
								var cursor_pos = active.selectionStart

								// insert the name
								var text = active.value
								active.value = (text.substring(0, cursor_pos) + OP_name + text.substring(active.selectionEnd))

								// move the cursor
								cursor_pos += OP_name.length
								active.setSelectionRange(cursor_pos, cursor_pos)

								// prevent the browser from handling this event
								event.preventDefault()
							}

						// alt+p or alt+r = parent poster's name
						} else if (event.altKey && (which == 112 || which == 114)) {

							// prevent ctrl+alt+p because of reported conflict with Puush
							if (event.ctrlKey && event.altKey && which == 112) return;

							// traverse up the DOM tree to find name of the parent post's author
							var PP_name = OP_name
							{
								var parent = active
								while (parent = parent.parentNode) {
									if (parent.classList && parent.classList.contains('comment') && !parent.classList.contains('comment--submit')) {
										var name_e = parent.querySelector('.comment__username>a')
										if (name_e) PP_name = name_e.textContent.trim()
										break
									}
								}
							}

							// insert PP's name it into the comment
							if (PP_name) {

								// take note of the cursor position
								var cursor_pos = active.selectionStart

								// insert the name
								var text = active.value
								active.value = (text.substring(0, cursor_pos) + PP_name + text.substring(active.selectionEnd))

								// move the cursor
								cursor_pos += PP_name.length
								active.setSelectionRange(cursor_pos, cursor_pos)

								// prevent the browser from handling this event
								event.preventDefault()
							}
						}
					}
				}
			}
		} catch (exception) { console.log(exception) }

	}, true)

} catch (exception) { console.log(exception) }

// version check
var prev_version = GM_getValue('prev_version', null)
if (prev_version != version) {
	GM_setValue('prev_version', version)
	open_popup()
}
