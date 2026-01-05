// ==UserScript==
// @name           Hibernate Idle Tabs
// @namespace      HIT
// @description    If a tab is unused for a long time, it switches to a light holding page until the tab is focused again.  This helps the browser to recover memory, and can speed up the re-opening of large sessions.
// @version        1.3.0
// @downstreamURL  http://userscripts.org/scripts/source/123252.user.js
// @include        *
// @downloadURL https://update.greasyfork.org/scripts/7667/Hibernate%20Idle%20Tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/7667/Hibernate%20Idle%20Tabs.meta.js
// ==/UserScript==


/* +++ Config +++ */

var hibernateIfIdleForMoreThan = 36*60*60; // 36 hours
var restoreTime = 0.5; // in seconds

// We need an always-available basically blank HTML page we can navigate to
// when we hibernate a tab.  The userscript will run on that page, and await
// re-activation.
//
// This page is not really ideal, since it provides an image and unneeded CSS.
//
// Also NOTE FOR SECURITY that whatever page you navigate to, the server admin
// will be able to see which page you hibernated, in their logfile!
//
// If you have a blank page somewhere on the net, belonging to an admin you
// trust, I recommend using that instead.
//
var holdingPage = "https://www.google.com/hibernated_tab";
// Throws error: Not allowed to navigate top frame to data URL
//var holdingPage = "data:text/html,<html><head><title>Hibernate Idle Tabs</title></head><body></body></html>";

// If you do change the holding, put the old one here, so that any existing
// hibernated tabs still on the old page will be able to unhibernate.
//
var oldHoldingPages = ["http://neuralyte.org/~joey/hibernated_tab.html", "http://www.google.com/hibernated_tab", "https://www.google.com/hibernated_tab"];

var passFaviconToHoldingPage = true;
var fadeHibernatedFavicons = true;

var forceHibernateWhenRunTwice = true;



/* +++ Documentation +++ */
//
// On a normal page, checks to see if the user goes idle.  (Mouse movements,
// key actions and page focus reset the idle timer.)  If the page is left idle
// past the timeout, then the window navigates to a lighter holding page,
// hopefully freeing up memory in the browser.
//
// On a holding page, if the user focuses the window, the window navigates back
// to the original page.  (This can be cancelled in Chrome by clicking on
// another tab, but not by paging to another tab with the keyboard!)
//
// I think single-click is also a cancellation now.
//
// In order for the tab of the holding page to present the same favicon as the
// original page, we must capture this image before leaving the original page,
// and pass it to the holding page as a CGI parameter.
//
// (A simpler alternative might be to aim for a 404 on the same domain and use
// that as the holding page.)
//
// If you use Google Chrome or Chromium, then I would recommend using this
// extension instead, which provides exactly the same functionality, but with
// better security and probaly better performance too:
//
// https://chrome.google.com/webstore/detail/the-great-suspender/klbibkeccnjlkjkiokjodocebajanakg


// (TODO: This aforementioned security concern could probably be fixed by passing data to the target page using # rather than ? - although it would only prevent the data from being passed over HTTP, but Javascript running on the target page could still read it.)
//
// Sadly, userscripts do not run on about:blank in Firefox 6.0 or Chromium 2011.  I doubt a file:///... URL would work either.

// BUG: Sometimes when un-hibernating, the webserver of the page we return to
// complains that the referrer URL header is too long!

// TODO: Some users may want the hibernated page to restore immediately when the tab is *refocused*, rather than waiting for a mouseover.

// TESTING: Expose a function to allow a bookmarklet to force-hibernate the current tab?

// CONSIDER: If we forget about fading the favicon, couldn't we simplify things by just sending the favicon URL rather than its image data?  I think I tested this, and although I could load the favicon into the document, I was not successful at getting it into the browser's title tab by adding a new <link rel="icon">.



/* +++ Main +++ */

var onHoldingPage = document.location.href.match(holdingPage+"?") != null;

// If you change holding page, this keeps the old one working for a while, for
// the sake of running browsers or saved sessions.
oldHoldingPages.forEach(oldHoldingPage => {
	if (document.location.href.match(oldHoldingPage+"?")) {
		onHoldingPage = true;
	}
});

function handleNormalPage() {

	whenIdleDo(hibernateIfIdleForMoreThan,hibernatePage);

	function hibernatePage() {

		var params = {
			title: document.title,
			url: document.location.href
		};

		function processFavicon(canvas) {
			document.body.appendChild(canvas);
			if (canvas) {
				try {
					if (fadeHibernatedFavicons) {
						makeCanvasMoreTransparent(canvas);
					}
					var faviconDataURL = canvas.toDataURL("image/png");
					params.favicon_data = faviconDataURL;
				} catch (e) {
					var extra = ( window != top ? " (running in frame or iframe)" : "" );
					console.error("[HIT] Got error"+extra+": "+e+" doc.loc="+document.location.href);
					// We get "Error: SECURITY_ERR: DOM Exception 18" (Chrome) if
					// the favicon is from a different host.
				}
			}
			reallyHibernatePage();
		}

		function reallyHibernatePage() {
			var queryString = buildQueryParameterString(params);
			document.location = holdingPage + "?" + queryString;
		}

		if (passFaviconToHoldingPage) {
			// I don't know how to grab the contents of the current favicon, so we
			// try to directly load a copy for ourselves.
			var url = document.location.href;
			var targetHost = url.replace(/.*:\/\//,'').replace(/\/.*/,'');
			loadFaviconIntoCanvas(targetHost,processFavicon);
		} else {
			reallyHibernatePage();
		}

	}

	function makeCanvasMoreTransparent(canvas) {
		var wid = canvas.width;
		var hei = canvas.height;
		var ctx = canvas.getContext("2d");
		var img = ctx.getImageData(0,0,wid,hei);
		var data = img.data;
		var len = 4*wid*hei;
		for (var ptr=0;ptr<len;ptr+=4) {
			data[ptr+3] /= 4;  // alpha channel
		}
		// May or may not be needed:
		ctx.putImageData(img,0,0);
	}



	if (forceHibernateWhenRunTwice) {
		if (window.hibernate_idle_tabs_loaded) {
			hibernatePage();
		}
		window.hibernate_idle_tabs_loaded = true;
	}


}

function handleHoldingPage() {

	var params = getQueryParameters();

	// setHibernateStatus("Holding page for " + params.title + "\n with URL: "+params.url);
	// var titleReport = params.title + " (Holding Page)";
	var titleReport = "(" + (params.title || params.url) + " :: Hibernated)";
	setWindowTitle(titleReport);

	var mainReport = titleReport;
	if (params.title) {
		/*
		statusElement.appendChild(document.createElement("P"));
		var div = document.createElement("tt");
		div.style.fontSize = "0.8em";
		div.appendChild(document.createTextNode(params.url));
		statusElement.appendChild(div);
		*/
		mainReport += "\n" + params.url;
	}

	setHibernateStatus(mainReport);

	try {
		var faviconDataURL = params.favicon_data;
		if (!faviconDataURL) {
			// If we do not have a favicon, it is preferable to present an empty/transparent favicon, rather than let the browser show the favicon of the holding page site!
			faviconDataURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAEklEQVQ4jWNgGAWjYBSMAggAAAQQAAF/TXiOAAAAAElFTkSuQmCC";
		}
		writeFaviconFromDataString(faviconDataURL);
	} catch (e) {
		console.error(""+e);
	}

	function restoreTab(evt) {
		var url = decodeURIComponent(params.url);
		setHibernateStatus("Returning to: "+url);
		document.location.replace(url);
		/*
		// Alternative; preserves "forward"
		window.history.back();  // TESTING!  With the fallback below, this seemed to work 90% of the time?
		// Sometimes it doesn't work.  So we fallback to old method:
		setTimeout(function(){
			setHibernateStatus("window.history.back() FAILED - setting document.location");
			setTimeout(function(){
				document.location.replace(url);   // I once saw this put ':'s when it should have put '%35's or whatever.  (That broke 'Up' bookmarklet.)
			},1000);
		},2500);
		*/
		evt.preventDefault();   // Accept responsibility for the double-click.
		return false;   // Prevent browser from doing anything else with it (e.g. selecting the word under the cursor).
	}

	checkForActivity();

	function checkForActivity() {

		var countdownTimer = null;

		// listen(document.body,'mousemove',startCountdown); // In Firefox this ignore mousemove on empty space (outside the document content), so trying window...
		listen(window,'mousemove',startCountdown); // Likewise for click below!
		// listen(document.body,'blur',clearCountdown); // Does not fire in Chrome?
		listen(window,'blur',clearCountdown); // For Chrome
		//listen(window,'mouseout',clearCountdown); // Firefox appears to be firing this when my mouse is still over the window, preventing navigation!  Let's just rely on 'blur' instead.
		// listen(document.body,'click',clearCountdown);
		listen(window,'click',clearCountdown);
		listen(window,'dblclick',restoreTab);

		function startCountdown(e) {
			if (countdownTimer != null) {
				// There is already a countdown running - do not start.
				return;
			}
			var togo = restoreTime*1000;
			function countDown() {
				setHibernateStatus(mainReport +
						'\n' + "Tab will restore in "+(togo/1000).toFixed(1)+" seconds." +
						'  ' + "Click or defocus to pause." +
						'  ' + "Or double click to restore now!"
						);
				if (togo <= 0) {
					restoreTab();
				} else {
					togo -= 1000;
					if (countdownTimer)
						clearTimeout(countdownTimer);
					countdownTimer = setTimeout(countDown,1000);
				}
			}
			countDown();
		}

		function clearCountdown(ev) {
			if (countdownTimer) {
				clearTimeout(countdownTimer);
			}
			countdownTimer = null;
			var evReport = "";
			if (ev) {
				evReport = " by "+ev.type+" on "+this;
			}
			var report = mainReport + '\n' + "Paused" + evReport + "";
			setHibernateStatus(report);
		}

	}

}

if (onHoldingPage) {
	handleHoldingPage();
} else {
	handleNormalPage();
}



/* +++ Library Functions +++ */

function listen(target,eventType,handler,capture) {
	target.addEventListener(eventType,handler,capture);
}

function ignore(target,eventType,handler,capture) {
	target.removeEventListener(eventType,handler,capture);
}

// Given an object, encode its properties and values into a URI-ready CGI query string.
function buildQueryParameterString(params) {
	return Object.keys(params).map( function(key) { return key+"="+encodeURIComponent(params[key]); } ).join("&");
}

// Returns an object whose keys and values match those of the CGI query string of the current document.
function getQueryParameters() {
	var queryString = document.location.search;
	var params = {};
	queryString.replace(/^\?/,'').split("&").map( function(s) {
		var part = s.split("=");
		var key = part[0];
		var value = decodeURIComponent(part[1]);
		params[key] = value;
	});
	return params;
}

function whenIdleDo(idleTimeoutSecs,activateIdleEvent) {

	var timer = null;
	var pageLastUsed = new Date().getTime();

	function setNotIdle() {
		pageLastUsed = new Date().getTime();
	}

	function checkForIdle() {
		var msSinceLastUsed = new Date().getTime() - pageLastUsed;
		if (msSinceLastUsed > idleTimeoutSecs * 1000) {
			activateIdleEvent();
		}
		setTimeout(checkForIdle,idleTimeoutSecs/5*1000);
	}

	setTimeout(checkForIdle,idleTimeoutSecs*1000);

	listen(document.body,'mousemove',setNotIdle);
	listen(document.body,'focus',setNotIdle);
	listen(document.body,'keydown',setNotIdle);

}



/* +++ Local Convenience Functions +++ */

var statusElement = null;
function checkStatusElement() {
	if (!statusElement) {
		while (document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
		}
		statusElement = document.createElement("div");
		document.body.insertBefore(statusElement,document.body.firstChild);
		statusElement.style.textAlign = "center";
	}
}

function setWindowTitle(msg) {
	msg = ""+msg;
	document.title = msg;
}

function setHibernateStatus(msg) {
	msg = ""+msg;
	checkStatusElement();
	statusElement.textContent = msg;
	statusElement.innerText   = msg;   // IE
	// Currently '\n' works in Chrome, but not in Firefox.
}






/* +++ Favicon, Canvas and DataURL Magic +++ */

function loadFaviconForHost(targetHost,callback) {

	// Try to load a favicon image for the given host, and pass it to callback.
	// Except: If there is a link with rel="icon" in the page, with host
	// matching the current page location, load that image file instead of
	// guessing the extension!

	var favicon = document.createElement('img');
	favicon.addEventListener('load',function() {
		callback(favicon);
	});

	var targetProtocol = document.location.protocol || "http:";

	// If there is a <link rel="icon" ...> in the current page, then I think that overrides the site-global favicon.
	// NOTE: This is not appropriate if a third party targetHost was requested, only if they really wanted the favicon for the current page!
	var foundLink = null;
	var linkElems = document.getElementsByTagName("link");
	for (var i=0;i<linkElems.length;i++) {
		var link = linkElems[i];
		if (link.rel === "icon" || link.rel === "shortcut icon") {
			// Since we can't read the image data of images from third-party hosts, we skip them and keep searching.
			if (link.host == document.location.host) {
				foundLink = link;
				break;
			}
		}
	}
	if (foundLink) {
		favicon.addEventListener('error',function(){ callback(favicon); });
		favicon.src = foundLink.href;   // Won't favicon.onload cause an additional callback to the one below?
		// NOTE: If we made the callback interface pass favicon as 'this' rather than an argument, then we wouldn't need to wrap it here (the argument may be evt).
		favicon = foundLink;
		callback(favicon);
		return;
	}

	var extsToTry = ["jpg","gif","png","ico"];   // iterated in reverse order
	function tryNextExtension() {
		var ext = extsToTry.pop();
		if (ext == null) {
			console.log("Ran out of extensions to try for "+targetHost+"/favicon.???");
			// We run the callback anyway!
			callback(null);
		} else {
			favicon.src = targetProtocol+"//"+targetHost+"/favicon."+ext;
		}
	}
	favicon.addEventListener('error',tryNextExtension);
	tryNextExtension();
	// When the favicon is working we can remove the canvas, but until then we may as well keep it visible!
}

function writeFaviconFromCanvas(canvas) {
	var faviconDataURL = canvas.toDataURL("image/png");
	// var faviconDataURL = canvas.toDataURL("image/x-icon;base64");
	// console.log("Got data URL: "+faviconDataURL.substring(0,10+"... (length "+faviconDataURL.length+")");
	writeFaviconFromDataString(faviconDataURL);
}

function writeFaviconFromDataString(faviconDataURL) {

	var d = document, h = document.getElementsByTagName('head')[0];

	// Create this favicon
	var ss = d.createElement('link');
	ss.rel = 'shortcut icon';
	ss.type = 'image/x-icon';
	ss.href = faviconDataURL;
	/*
	// Remove any existing favicons
	var links = h.getElementsByTagName('link');
	for (var i=0; i<links.length; i++) {
		if (links[i].href == ss.href) return;
		if (links[i].rel == "shortcut icon" || links[i].rel=="icon")
			h.removeChild(links[i]);
	}
	*/
	// Add this favicon to the head
	h.appendChild(ss);

	// Force browser to acknowledge
	// I saw this trick somewhere.  I don't know what browser requires it.  But I just left it in!
	var shim = document.createElement('iframe');
	shim.width = shim.height = 0;
	document.body.appendChild(shim);
	shim.src = "icon";
	document.body.removeChild(shim);

}

function loadFaviconIntoCanvas(targetHost,callback) {

	// console.log("Getting favicon for: "+targetHost);

	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');

	loadFaviconForHost(targetHost,gotFavicon);

	function gotFavicon(favicon) {
		if (favicon) {
			// console.log("Got favicon from: "+favicon.src);
			canvas.width = favicon.width;
			canvas.height = favicon.height;
			ctx.drawImage( favicon, 0, 0 );
		}
		callback(canvas);
	}

}

/* This throws a security error from canvas.toDataURL(), I think because we are
trying to read something from a different domain than the script!
In Chrome: "SECURITY_ERR: DOM Exception 18"
*/
// loadFaviconIntoCanvas(document.location.host,writeFaviconFromCanvas);

