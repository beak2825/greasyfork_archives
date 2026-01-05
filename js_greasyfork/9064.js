// ==UserScript==
// @name         Youtube Scrolling Comments Layout 2017
// @namespace    YFVP3
// @website      https://greasyfork.org/en/users/10118-drhouse
// @version      16.0
// @description  Modern layout for 1080p res, lets you watch videos while being able to scroll and read the entire comments section, by pinning the YouTube video to the left-side page. Plus, a sleek 'More Videos by same user' playlist feed is auto-generated for the current channel and 2 very useful quicklinks are added: 'Most Popular' and 'Newest' sorted user videos. See screenshot for preview.
// @author       drhouse
// @contributor  Ronny John
// @include      http://www.youtube.com/*
// @include      https://www.youtube.com/*
// @exclude      http://www.youtube.com/embed/*
// @exclude      https://www.youtube.com/embed/*
// @require 	 http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @resource spfremove https://greasyfork.org/scripts/16935-disable-spf-youtube/code/Disable%20SPF%20Youtube.user.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @icon         https://s.ytimg.com/yts/img/favicon-vfldLzJxy.ico
// @downloadURL https://update.greasyfork.org/scripts/9064/Youtube%20Scrolling%20Comments%20Layout%202017.user.js
// @updateURL https://update.greasyfork.org/scripts/9064/Youtube%20Scrolling%20Comments%20Layout%202017.meta.js
// ==/UserScript==

var theurl = document.URL;
var links = document.getElementById('body-container').getElementsByTagName('a');

if (location.href.toString().indexOf("list") == -1 && parent.location.href.toString().indexOf("watch") != -1 && parent.location.href.toString().indexOf("feed") == -1 && parent.location.href.toString().indexOf("watch_") == -1)
	window.location.href = (theurl + "&list=UL&");

for(var i=0 ; i<links.length ; i++){
	if (links[i].href.toString().indexOf("watch") != -1 && links[i].href.toString().indexOf("list") <= -1 && links[i].href.toString().indexOf("feed") == -1 && links[i].href.toString().indexOf("watch_") == -1)
		links[i].setAttribute('href', links[i].getAttribute('href').split('&')[0] + '&list=UL&');
}

$(document).ready(function () {

	var bot = $('#page-container').css('height');
	$('#watch-appbar-playlist').css('height', bot);
	$('#watch-appbar-playlist').css('height', '-=1993px').css('top','60px').css('bottom','300px').css('right','0px').css('left','1605px').css('position','fixed');

	eval(GM_getResourceText("spfremove"));

	var dest = '#watch7-user-header > div > a';
	var channel = $(dest).attr('href');
	var link = 'https://www.youtube.com' + channel + '/videos?view=0&sort=p&flow=grid';
	var link2 = "'" + link + "'";
	var dest2 = $('#action-panel-overflow-button > span');
	var linkdd = 'https://www.youtube.com' + channel + '/videos?view=0&sort=dd&flow=grid';
	var linkdd2 = "'" + linkdd + "'";
	$('<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-has-icon no-icon-markup pause-resume-autoplay yt-uix-menu-triggerx yt-uix-tooltip addto-button" type="button" onclick="window.open(' + link2 + ')" title="More actions" aria-pressed="false" id="popular" role="button" aria-haspopup="false" data-tooltip-text="Popular videos" aria-labelledby="yt-uix-tooltip93-arialabel"><span class="yt-uix-button-content"><a href="' + link + '">Most popular videos</a></span></button>').insertAfter(dest2).css('color', '#666');
	$('<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-has-icon no-icon-markup pause-resume-autoplay yt-uix-menu-triggerx yt-uix-tooltip addto-button" type="button" onclick="window.open(' + linkdd2 + ')" title="More actions" aria-pressed="false" id="popular" role="button" aria-haspopup="false" data-tooltip-text="Newest videos" aria-labelledby="yt-uix-tooltip93-arialabel"><span class="yt-uix-button-content"><a href="' + linkdd + '">Newest videos</a></span></button>').insertAfter(dest2).css('color', '#666');


// code below created by Ronny John | http://ronnyjohn.work | Youtube Comments Sidebar | https://greasyfork.org/en/scripts/21391-youtube-comments-sidebar
	(function() {
		'use strict';

		var mutationObserver = window.MutationObserver || window.WebKitMutationObserver;
		var watchModeObserver, sidebarAdObserver, page, sidebar, ads, related, relatedParent, relatedWrapper, comments, footer;
		var onResizeFunc = function() { setPositions(); setHeights(); console.log('resize'); };
		var onScrollFunc = function() { setHeights(); };
		var modificationDone = false;

		if (typeof mutationObserver === 'undefined') return;

		// a little style adjustment
		if (typeof(GM_addStyle) === typeof(Function)) {
			GM_addStyle('#watch7-sidebar-contents.sidebar-comments { position: fixed; z-index: 1; } #watch-discussion.sidebar-comments { position: fixed; padding: 0 6px; overflow: hidden; overflow-y: auto; z-index: 2; } #watch-discussion.sidebar-comments .comment-section-renderer-paginator { margin: 0; } #watch7-sidebar { -moz-transition: all 0s !important; -webkit-transition: all 0s !important; -o-transition: all 0s !important; transition: all 0s !important; }');
		}

		initialize();

		var contentObserver = createContentObserver();
		contentObserver.observe(document.getElementById('content'), {childList: true, subtree: true});

		function initialize() {
			page = document.getElementById('page');
			sidebar = document.getElementById('watch7-sidebar-contents');
			related = document.getElementById('watch-related');
			comments = document.getElementById('watch-discussion');
			footer = document.getElementById('footer-container');

			// if modification is already done, stop initialization (can be cached on browser navigate back and forward)
			if (related && comments && related.parentNode.parentNode == comments.parentNode) {
				return;
			}

			removeListeners();
			if (watchModeObserver) watchModeObserver.disconnect();
			if (sidebarAdObserver) sidebarAdObserver.disconnect();

			// skip if no video is shown or playlist is open
			if (!sidebar || !comments || !related) {
				return;
			}

			relatedParent = related.parentNode;

			watchModeObserver = createWatchModeObserver();
			watchModeObserver.observe(page, {attributes: true});

			// if stage mode is active, do not run modifications
			if (page.classList.contains('watch-stage-mode')) {
				return;
			}

			runModifications();

			// if ads are inserted in the sidebar, the position of the comments must be updated
			ads = document.getElementById('google_companion_ad_div');
			if (ads) {
				sidebarAdObserver = createSidebarAdObserver();
				sidebarAdObserver.observe(ads, {childList: true});
			}
		}

		function runModifications() {
			// move ads and related
			relatedWrapper = document.createElement('div');
			relatedWrapper.className = comments.className;
			relatedWrapper.appendChild(related);
			comments.parentNode.insertBefore(relatedWrapper, comments);

			// comments node can't be moved, because loading of replies is not working properly then
			sidebar.classList.add('sidebar-comments');
			comments.className = 'sidebar-comments';

			window.addEventListener('resize', onResizeFunc);
			window.addEventListener('scroll', onScrollFunc);

			onResizeFunc();
			modificationDone = true;
		}

		function revertModifications() {
			sidebar.classList.remove('sidebar-comments');
			sidebar.style.width = 'auto';
			sidebar.style.height = 'auto';
			relatedParent.appendChild(related);
			comments.className = relatedWrapper.className;
			comments.style.width = 'auto';
			comments.style.height = 'auto';
			relatedWrapper.remove();

			removeListeners();

			modificationDone = false;
		}

		function removeListeners() {
			window.removeEventListener('resize', onResizeFunc);
			window.removeEventListener('scroll', onScrollFunc);
		}

		function setPositions() {        
			var sidebarParentRect = sidebar.parentNode.getBoundingClientRect();
			sidebar.style.top = (sidebarParentRect.top + scrollY) + 'px';
			sidebar.style.left = sidebarParentRect.left + 'px';
			sidebar.style.width = (sidebarParentRect.right - sidebarParentRect.left) + 'px';

			var containerRect = relatedParent.getBoundingClientRect();
			comments.style.top = containerRect.bottom + 'px';
			comments.style.left = containerRect.left + 'px';
			comments.style.width = (containerRect.right - containerRect.left) + 'px';

		}

		function setHeights() {
			var sidebarRect = sidebar.getBoundingClientRect();
			var containerRect = relatedParent.getBoundingClientRect();
			var footerRect = footer.getBoundingClientRect();
			var bottom = document.documentElement.clientHeight;

			if (footerRect.top < bottom) {
				bottom = footerRect.top;   
			}

			var commentsHeight = bottom - containerRect.bottom - 20;
			sidebar.style.height = (containerRect.bottom - sidebarRect.top + commentsHeight + 10) + 'px';
			comments.style.height = commentsHeight + 'px';
		}

		function createContentObserver() {
			return new mutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					if (mutation.addedNodes !== null) {
						for (var i=0; i < mutation.addedNodes.length; i++) {
							var node = mutation.addedNodes[i];
							if (node.id == 'watch7-container' || node.id == 'watch7-main-container') {
								initialize();
								break;
							}
						}
					}
				});
			});
		}

		function createWatchModeObserver() {
			return new mutationObserver(function(mutations) {
				for (var i=0; i<mutations.length; i++) {
					if (mutations[i].attributeName === "class") {
						if (page.classList.contains('watch-stage-mode') && modificationDone) {
							revertModifications();
						} else if (!page.classList.contains('watch-stage-mode') && !modificationDone) {
							runModifications();   
						}
					}
				}
			});
		}

		function createSidebarAdObserver() {
			return new mutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					if (mutation.addedNodes !== null) {
						onResizeFunc();
					}
				});
			});
		}
	})();
});