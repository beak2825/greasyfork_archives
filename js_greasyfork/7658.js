// ==UserScript==
// @name           Auto scroll keys [adopted]
// @namespace      http://userscripts.org/users/44573
// @version        1.1.4
// @license        MIT
// @description    Read articles hands-free!  Pres Ctrl-Down or Opt-Down to start slowly scrolling the page.  Press again to adjust speed.  Escape or Space to stop.
// @grant          none
// @include        *
// @downloadURL https://update.greasyfork.org/scripts/7658/Auto%20scroll%20keys%20%5Badopted%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/7658/Auto%20scroll%20keys%20%5Badopted%5D.meta.js
// ==/UserScript==

// This script is a derivative of http://userscripts-mirror.org/scripts/show/70300 by PaC1250

// Options:

var initialSpeed = 10;     // Pixels per second

var maxPerSecond = 60;     // Target FPS

var resetThreshold = 10;   // If the user scrolls the page manually by more pixels than this value, then we will start scrolling from the new position.

// When zoomed in, a page pixel will be larger than a screen pixel.  Enabling this will shift by fractions of a page pixel, rather than whole page pixels, so that the text won't make multi-pixel jumps.
var attemptSubPixelScrolling = false;

// But at default zoom, sub-pixel scrolling may look a little bit jittery, so this option will enable sub-pixel zooming only when it's needed.
// (Although personally in Chrome I found sub-pixel zooming looked preferable even at zoom 100%.)
// This overwrites the value of attemptSubPixelScrolling when scrolling begins.
var attemptSubPixelScrollingOnlyIfZoomedIn = true;

// The user may perform normal scrolling actions during auto-scroll (e.g. by pressing Up or PageUp or using the scroll bar).  We will detect and ackowledge these (update realy) if we see a difference of more than this many pixels.
// If the threshold is set too low, the script's own scrolling will trigger it, especially on slower machines or under heavy load.
// But if set too high, the threshold may fail to fire if, when the user presses Up to scroll back a little, the browser performs that with a smooth scroll of lots of small movements, rather than one larger jump.

// BUG: When zoomed in, jumping by a whole (unzoomed) pixel it too coarse, because we see the text move by more than one screen pixel.  But we cannot control that: we give the browser a float for scrolling but it rounds it to an int!
// A possible workaround would be to perform some scrolling (perhaps just the remainder part before rounding) as a transform on the page.  This might not work in all browsers.

// 2012/10/09  Now runs at 60fps or whatever the machine can handle

// Constants:

var DOM_VK_DOWN   = 40;
var DOM_VK_UP     = 38;
var DOM_VK_ESCAPE = 27;
var DOM_VK_SPACE  = 32;
var DOM_VK_ENTER  = 13;

// Runtime:

var u44573_go = false;
var scrollSpeed = 0;

var lastTime;
var realx, realy;   // We store scroll position as floats; basing scrolling on a float is smoother than the browser's int-rounded scrollTop.  But we may need to keep realy in sync with scrollTop, if the user changes the later during auto-scroll.

window.addEventListener('keydown', u44573_handler, true);

var transformBeforeScrolling;

function u44573_handler(e) {
	var change = 0.60;   // Probably could be lowered a bit if we make scrollSpeed truly analogue.
	var upDelta, downDelta; // The acceleration of each key

	if (scrollSpeed === 0 || !u44573_go) {
		upDelta = initialSpeed;
		downDelta = initialSpeed;
	} else {
		if (Math.abs(scrollSpeed) < 0.1) {
			scrollSpeed = 0.1 * sgn(scrollSpeed);
		}
		downDelta = Math.abs(scrollSpeed)*change;
		upDelta = Math.abs(scrollSpeed)*change/(1+change);
		if (scrollSpeed < 0) {
			var tmpDelta = downDelta;
			downDelta = upDelta;
			upDelta = tmpDelta;
		}
	}

	// Scroll downwards with CTRL-Down_Arrow or Opt-Down_Arrow on Mac
	if((e.altKey || e.ctrlKey) && e.keyCode == DOM_VK_DOWN) {
		scrollSpeed += downDelta;
		e.preventDefault();
	}
	// Scroll upwards with CTRL-Up_Arrow or Opt-Up_Arrow on Mac
	if((e.altKey || e.ctrlKey) && e.keyCode == DOM_VK_UP) {
		scrollSpeed -= upDelta;
		e.preventDefault();
	}

	if(!u44573_go && scrollSpeed != 0) {
		startScroller();
	}

	// Stop (ESCAPE or ENTER or SPACE)
	if (e.keyCode == DOM_VK_ESCAPE || e.keyCode == DOM_VK_ENTER || e.keyCode == DOM_VK_SPACE) {
		if (u44573_go) {
			u44573_go = false;
			scrollSpeed = 0;

			if (attemptSubPixelScrolling) {
				document.body.style.transform = transformBeforeScrolling;
			}

			// Do not pass keydown event to page:
			e.preventDefault(); // Most browsers
			return false; // IE
		}
	}
}

function sgn(x) {
	return ( x>0 ? +1 : x<0 ? -1 : 0 );
}

var abs = Math.abs;

function startScroller() {
	u44573_go = true;
	var s = u44573_getScrollPosition();
	realx = s[0];
	realy = s[1];
	lastTime = new Date().getTime();
	transformBeforeScrolling = document.body.style.transform;

	if (attemptSubPixelScrollingOnlyIfZoomedIn) {
		// This technique find the zoom level in Chrome
		// For other browser, see https://github.com/tombigel/detect-zoom or http://stackoverflow.com/questions/1713771
		var screenCssPixelRatio = window.outerWidth / window.innerWidth;
		console.log("Detected zoom: "+screenCssPixelRatio);
		var isZoomedIn = (screenCssPixelRatio >= 1.05);
		attemptSubPixelScrolling = isZoomedIn;
	}

	u44573_goScroll();
}

function queueNextFrame(callback, duration) {
	if (typeof window.requestAnimationFrame === 'function') {
		window.requestAnimationFrame(callback);
	} else {
		setTimeout(callback, duration);
	}
}

function u44573_goScroll() {

	if (u44573_go) {

		// Check if the user has scrolled the page with a key since we last scrolled.
		// If so, update our realx,realy.
		// BUG: Argh the check isn't working in Firefox 90% of the time!
		//      Hold down the key to beat those odds.
		var s = u44573_getScrollPosition();
		if ( abs(s[0]-realx) > resetThreshold || abs(s[1]-realy) > resetThreshold ) {
			realx = s[0];
			realy = s[1];
		}

		var timeNow = new Date().getTime();
		var elapsed = timeNow - lastTime;
		var jumpPixels = abs(scrollSpeed) * elapsed/1000;
		var timeToNext = 1000/maxPerSecond;

		// Rather than running at a fixed FPS, at slow speeds the approaches below would delay the next callback until it was time to move to the next pixel.  This was more efficient on slow machines.
		/*
		// The browser can only jump a whole number of pixels, and it rounds down.
		// We had to do the following anyway for jumpPixels<1 but by doing it for
		// small numbers (<5) we workaround the analogue/digital bug.  (5*1.2=6)
		if (jumpPixels < 3) {
			timeToNext /= jumpPixels;
			// jumpPixels /= jumpPixels;
			jumpPixels = 1;
		}
		*/
		/*
		var timeToNext = 1000/abs(scrollSpeed);
		if (timeToNext < 1000/maxPerSecond) {
			jumpPixels = abs(scrollSpeed)/maxPerSecond;
			timeToNext = 1000/maxPerSecond;
		} else {
			jumpPixels = 1;
		}
		*/

		realy += jumpPixels*sgn(scrollSpeed);

		//var inty = Math.round(realy);
		var inty = Math.floor(realy);

		if (attemptSubPixelScrolling) {
			var remaindery = realy - inty;
			var transform = transformBeforeScrolling + " translate(0px, "+(-remaindery)+"px)";
			document.body.style.transform = transform;
		}

		window.scroll(realx, inty); // Leave it to browser to round real values to ints

		lastTime = timeNow;

		if (scrollSpeed == 0) {
			u44573_go = false;
		} else {
			queueNextFrame(u44573_goScroll, timeToNext);
		}

	}

}

function u44573_getScrollPosition() {
	return Array((document.documentElement && document.documentElement.scrollLeft) || window.pageXOffset || self.pageXOffset || document.body.scrollLeft,(document.documentElement && document.documentElement.scrollTop) || window.pageYOffset || self.pageYOffset || document.body.scrollTop);
}

