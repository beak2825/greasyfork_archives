// ==UserScript==
// @name           Title Youtube Locations
// @namespace      TYTLs
// @description    Puts the video title in the location bar of all YouTube video pages.  Now with extra features add scrollbars, animate thumbnails, reduce font sizes and un-float the header.
// @version        1.3.0
// @downstreamURL  http://userscripts.org/scripts/source/87416.user.js
// @include        http://*.youtube.*/*
// @include        http://youtube.*/*
// @include        https://*.youtube.*/*
// @include        https://youtube.*/*
//// YouTube thumbnails almost certainly appear if you do a video search:
// @include        https://www.google.co.uk/search?*&tbm=vid&*
//// YouTube thumbnails occasionally appear in normal Google search results:
// @include        https://www.google.co.uk/search*
// @grant          GM_addStyle
// @grant          GM_log
// @downloadURL https://update.greasyfork.org/scripts/7674/Title%20Youtube%20Locations.user.js
// @updateURL https://update.greasyfork.org/scripts/7674/Title%20Youtube%20Locations.meta.js
// ==/UserScript==

// TODO: In case for some reason YouTube or another script redirects us to
// another URL which has lost the title param we added, we will re-run forever.
// To avoid this we should have a fallback.  E.g. if the title we want to set
// is the same as the last one we did set (via GM_set/getValue) then do not try
// again.
// This has never happened so far.  :)

// If you are interested in YouTube images:
// Thumbnails url looks like http://img.youtube.com/vi/8aYQ_wjmriQ/2.jpg
// Youtube generates 4 thumbnails: 0.jpg at 320x240, and 1.jpg, 2.jpg, 3.jpg
// Also large: hqdefault.jpg (480x360) and sometimes but not always hq1.jpg, hq2.jpg, hq3.jpg



var addTitleToLocation = false; // Oh dear, the primary feature of this plugin has started causing annoying reloads.  TODO Perhaps we can do it with pushState instead...
var reduceFontSizes    = true;
var addScrollbars      = true;
var scrollDownToVideo  = false; // YouTube's header ("masthead") is now floating.  Setting this true will un-float it, then scroll down to hide it.  But scrolling containers should then be enlarged.
var animateThumbnails  = true;
var unfloatTheHeader   = true;



if (addTitleToLocation) {

	// NOTE: This code is deprecated, as I now use the userscripts URLs_Need_Titles

	setTimeout(function(){
		if (document.location.pathname == "/watch") {

			var title = document.title.replace(/ - YouTube$/,'')
				|| null;

			if (title)
				title = title.replace(/ /g,'_').replace(/^[\r\n_]*/,'').replace(/[\r\n_]*$/,''); // "_"s paste better into IRC, since " "s become "%20"s which are hard to read.  The second and third parts trim "_"s and newlines from the start and end of the string.

			if (title) {
				if (!document.location.hash) {
					document.location.replace(document.location.href + '#' + title); // Does not alter browser history
					// document.location.hash = title; // Crashes Chrome less often
				}
			}
		}
	},5000); // This is what really stops the crashing!

}



if (reduceFontSizes) {
	// == Reduce font size of thumbnail titles ==
	GM_addStyle(".yt-tile-default.video-list-item a .title, #watch-sidebar .video-list-item .title { font-size: 11px; line-height: 10px; }");
	// Defaults are font-size: 13px; and line-height: 15px; which show only two lines in my browser.
}



if (addScrollbars) {

	// == Scrollbars on comments and related vids, to keep the video in view. ==
	setTimeout(function(){
		// We could alternatively act on watch-panel but that includes the video navigation buttons!
		// BUG: Interferes with YouTube's lazy-loading of thumbnails for related video.
		if (document.location.href.indexOf("/all_comments?") >= 0) {
			return;   // Leave the full comments page alone.
		}

		// The top of watch7-content has become very large, so put a scrollbar on the whole lot.
		var watchDiscussion = /* document.getElementById("watch-discussion") || */ document.getElementById("watch7-content");
		if (watchDiscussion) {
			var toSubtract = 464;     // Small video screen
			//var toSubtract = 544;   // Medium size video screen
			var roomForComments = window.innerHeight - toSubtract;
			if (roomForComments < 200) {
				roomForComments = 200;
			}
			watchDiscussion.style.overflow = "auto";
			watchDiscussion.style.maxHeight = roomForComments+"px"; /* For a video height 360p */
			GM_addStyle(" #watch7-content { border: 1px solid; border-color: #c8c8c8 #dddddd #dddddd #c8c8c8; margin-top: 5px; } #watch-header { margin-top: 0px; margin-bottom: 0px; } ");
		}

		var watchSidebar = document.getElementById("watch-sidebar") || document.getElementById("watch7-sidebar");
		if (watchSidebar) {
			watchSidebar.style.overflow = "auto";
			watchSidebar.style.maxHeight = (window.innerHeight - 69)+"px";
			// May 2012 - fixes below no longer needed.
			// Now the text wraps because of the scrollbar, so we widen the element:
			// watchSidebar.style.width = (320+24)+"px";
			// watchSidebar.style.width = '300px';
			// And we must widen its container also:
			// TODO BUG: Why does this work in the console, but not from the userscript?
			// document.getElementById("watch-main").style.width = (960+24)+"px";
			GM_addStyle(" #watch-sidebar, #watch7-sidebar { border: 1px solid; border-color: #c8c8c8 #dddddd #dddddd #c8c8c8; } ");
			// Without this, the Google notifications dropdown will appear behind our sidebar.
			// But with it, the sidebar is not clickable!  :-(
			//GM_addStyle(" #watch-sidebar, #watch7-sidebar { z-index: -20; } ");
		}

		if (scrollDownToVideo) {
			// Un-float the header:
			GM_addStyle(" #masthead-positioner { position: initial; } #masthead-positioner-height-offset { height: 0px; } ");
			//// Title text
			// document.getElementById("eow-title").scrollIntoView();
			//// Uploader info and videolist popdown.
			// document.getElementById("watch-headline-user-info").scrollIntoView();
			//// The author's video list (was supposed to be a small gap above the video when collapsed, but it's not)
			// document.getElementById("watch-more-from-user").scrollIntoView();
			//// The video
			// document.getElementsByTagName("embed")[0].scrollIntoView();
			//// The video
			var watchVideo = document.getElementById("movie_player") || document.getElementById("player-api");
			if (watchVideo) {
				watchVideo.scrollIntoView();
			}
			//// Slight gap above the video (I prefer that)
			// var watchContainer = document.getElementById("watch7-container");
			// if (watchContainer) {
			// 	watchContainer.scrollIntoView();
			// }
		}

		// ~ October 2014
		// This feels like a bug in Chrome 38.  The element is given position:absolute but it does not move up when its parent does!  We can fix it anyway:
		GM_addStyle(" #watch8-secondary-actions { position: initial; } ");
	},1000);

}



if (animateThumbnails) {

	// == Thumbnail animation ==
	// TODO: This is working fine on "related videos" thumbnails, but not on queue
	// thumbnails, even if I have the queue open when I load the page.
	// Perhaps we are responding to a mouseout event from a child element, because
	// we are not checking the event target like we should do.
	function initThumbnailAnimator() {
		// function createThumbnailAnimatorEvent(thumbImage) {
		var filenameRE = /\/([^/]*)\.(jpg|webp)(\?.*|$)/;
		var thumbImage    = null;
		var originalHref  = null;
		var timer  = null;
		//var frames = ["1.jpg","2.jpg","3.jpg"];   // "default.jpg",
		var frames = ["1","2","3"];
		var frameI = 0;
		function changeFrame() {
			frameI = (frameI + 1) % frames.length;
			var match = originalHref.match(filenameRE);
			var extension = match[2];
			var filename = frames[frameI] + '.' + extension;
			thumbImage.src = originalHref.replace(filenameRE, '/' + filename);
		}
		function startAnimation() {
			// Because there was a bug that the running animation would not stop!
			if (timer) {
				clearInterval(timer);
			}
			originalHref = thumbImage.src;
			if (originalHref.match(/^data:/)) {
				return;
			}
			// We make this check quite late, due to lazy loading
			if (originalHref.match(filenameRE)) {
				// logElem("Starting animation",thumbImage);
				timer = setInterval(changeFrame,600);
			}
		}
		function stopAnimation() {
			if (timer) {
				// logElem("Stopping animation",thumbImage);
				clearInterval(timer);
				timer = null;
				// This isn't really neccessary, except to ensure the check for default\.jpg above works next time!
				//thumbImage.src = thumbImage.src.replace(/\/[^/]*$/,'') + '/' + "default.jpg";
				thumbImage.src = originalHref;
			}
		}
		function logElem(name,elem) {
			report = "<"+elem.tagName+" id="+elem.id+" class="+elem.className+" src="+elem.src+" />";
			GM_log(name+" = "+report);
		}
		function check(fn) {
			return function(evt) {
				// logElem("["+evt.type+"] evt.target",evt.target);
				var elemToCheck = evt.target || evt.srcElement;
				if (elemToCheck.tagName == "IMG") {
					thumbImage = elemToCheck;
					return fn();
				} else if (elemToCheck.className=='screen') {
					var seekImg = elemToCheck.parentNode.getElementsByTagName("img")[0];
					if (seekImg) {
						thumbImage = seekImg;
						return fn();
					}
				// } else {
					// var imgCount = elemToCheck.getElementsByTagName("img").length;
					// if (imgCount == 1) {
						// thumbImage = elemToCheck.getElementsByTagName("img")[0];
						// // logElem("["+evt.type+"] checking sub-image",thumbImage);
						// logElem("Whilst checking",elemToCheck);
						// logElem("  Animating elem",thumbImage);
						// logElem("  with parent",thumbImage.parentNode);
						// logElem("  whilst currentTarget",evt.currentTarget);
						// logElem("  and srcElement",evt.srcElement);
						// return fn();
					// }
				}
			};
		}
		//// Unfortunately these do not fire on any HTMLImageElements when browsing the queue.
		document.body.addEventListener("mouseover",check(startAnimation),false);
		document.body.addEventListener("mouseout",check(stopAnimation),false);
		// var videoList = document.getElementById("watch-sidebar"); // or watch-module or watch-module-body or watch-related or watch-more-related
		// var videoList = document.getElementsByClassName("video-list")[0]; // can be 4 of these!
		// var thumbs = document.getElementsByTagName("img");
		// for (var i=0;i<thumbs.length;i++) {
			// createThumbnailAnimatorEvent(thumbs[i]);
		// }
	}
	setTimeout(initThumbnailAnimator,1000);

}



if (unfloatTheHeader) {
	GM_addStyle("#masthead-positioner { position: static; }");
	var gapElement = document.getElementById("masthead-positioner-height-offset");
	if (gapElement) {
		gapElement.parentNode.removeChild(gapElement);
	}
}

