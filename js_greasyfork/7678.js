// ==UserScript==
// @name          Wikipedia Inline Article Viewer [adopted]
// @namespace     http://projects.apathyant.com/wikipediainline/
// @description   Adds a hover event to internal article links on wikipedia pages which, opens the article inline in a dhtml frame.
// @version       1.2.21
//// http:
// @include       http://*wiki*
// @include       http://wikipedia.org/*
// @include       http://*.wikipedia.org/*
// @include       http://wiktionary.org/*
// @include       http://*.wiktionary.org/*
// @include       http://*/wiki/*
//// https:
// @include       https://*wiki*
// @include       https://wikipedia.org/*
// @include       https://*.wikipedia.org/*
// @include       https://wiktionary.org/*
// @include       https://*.wiktionary.org/*
// @include       https://*/wiki/*
// @grant         GM_log
// @grant         GM_xmlhttpRequest
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/7678/Wikipedia%20Inline%20Article%20Viewer%20%5Badopted%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/7678/Wikipedia%20Inline%20Article%20Viewer%20%5Badopted%5D.meta.js
// ==/UserScript==

// Wikipedia Inline Article Viewer
// version 0.1.5
// 2007-07-17
// Copyright (c) 2005, Brent Charbonneau
// Released under the GPL license
// http://www.gnu.org/copyleft/gpl.html
//
// --------------------------------------------------------------------
//
// This is a Greasemonkey user script.
//
// To install, you need Greasemonkey: http://greasemonkey.mozdev.org/
// Then restart Firefox and revisit this script.
// Under Tools, there will be a new menu item to "Install User Script".
// Accept the default configuration and install.
//
// To uninstall, go to Tools/Manage User Scripts,
// select "Wikipedia Inline Article Viewer", and click Uninstall.
//
// --------------------------------------------------------------------

/* Joey's version, instead of adding an image-button after every link,
 * activates on mouse hover.  This does not slow down page load!
 *
 * An alternative might be: on link hover, float up an image-button the user
 * can click for inline preview.  Hide the button on unhover.
 *
 * For FF I renamed document.width to document.body.clientWidth.
 */

// BUG: Works fine under in Chrome, but not in Firefox!

// FIXED: When opening a window for some articles, such as "The Wawona Tree" on page "Yosemite", "Coordinates" appeared placed in the inline window's header, obscuring the "close" button.

// FIXED: Now when an inline article is scrolled, and a link in it is hovered, the second new window sometimes appears in the wrong place.

// 1.2.11: Now works better on links on the search results page.  (It would often fail because the user would mouse over the "matching text" <span> instead of the enclosing <a>.)

var allowPreviewsInPreviews = true;   // If false, feature is not available for links inside previewed articles.

var removeTOC = true;

var inlineWindowCount = 0;

var stylePreviewedLinks = true;

/*
var icon = document.createElement('img');
icon.src = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%0A%00%"+
			"00%00%0A%08%06%00%00%00%8D2%CF%BD%00%00%00%04gAMA%00%00%AF%C87%05%8"+
			"A%E9%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%00%"+
			"92IDATx%DAb%FC%FF%FF%3F%03%0C%AC_%BF%1E%C1A%03%2C%E8%02%81%81'1%14%"+
			"AD_o%CE%C0%84M7H%E2%CC%19a%141%B0%C23g%CE%FCGV%24%2B%7B%87AZZ%0FE1%"+
			"13%CC%5D0%1A%A4%C8%C4%E4-%C3%D3%A7%97%18%1E%3FVAu%A3%89%89%09%94%BB"+
			"%1F%AC%08d%12H%11%B2%7B%E1%9E%81(6%01*%EA%86%9B%04r%06N_308%02%F1c%"+
			"A0i%81%8C%18%9EA%06%20%93eeeQ%3C%087%11%E8%11%06%CC%F0D5%11%20%C0%0"+
			"0%E5Z9%1E%A6%8Fq%17%00%00%00%00IEND%AEB%60%82";
icon.style.border = 'none';
icon.width = 10;
icon.height = 10;

function rewriteLinks() {
	// This function grabs all the links within the page's #content div and 
	// sends them off to be modified
	
	var links, currentLink;
	
	// XPath to select all anchor tags with an href that begins with /wiki/
	links = document.evaluate(
		'//div[@id="content"]//a[starts-with(@href,"/wiki/")]',
		document,
		null,
		XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
		null);
	
	for (var i = 0; i < links.snapshotLength; i++) {
		currentLink = links.snapshotItem(i);

		// do something with thisLink
		if ( currentLink.getAttribute('inlineviewappended') != 'true' 
				&& currentLink.getAttribute('inlineviewlink') != 'true'
				&& currentLink.className != 'image' ) {
			appendInlineButton(currentLink);
		}
	}
	// hide link icons in the print style sheet
	// GM_log(document.styleSheets);
	for (var i=0; i<document.styleSheets.length; i++) {
		//GM_log(document.styleSheets[i].media.mediaText);
		if (/\bprint\b/.test (document.styleSheets[i].media.mediaText)) {
			document.styleSheets[i].insertRule ('.inlinelink {display:none}', 0);
			break;
		}
	}
}

function appendInlineButton(link) {
	// Create the new element to hold all that we're doing...
	var container = document.createElement('span');

	// This will prevent the view inline icon from breaking away from the last word of the
	// article link
	container.style.whiteSpace = 'nowrap';

	// We want the link to wrap normally though, and only hold the new icon to the last word
	// so we should explicitly set normal wrap on the link element
	link.style.whiteSpace = 'normal';
	
	// Add a new anchor inside the new button
	// We use innerHTML because it's quicker than writing out the style properties
	// one by one with javascript
	container.innerHTML = '<a class="inlinelink" href="' + link.pathname + '" inlineviewlink="true" inlinewindow="' + (inlineWindowCount++) + '" style="text-decoration: none; margin-left: 0.3em;"></a>';
	
	// Pull out our innerHTML generated anchor element...
	var newLink = container.firstChild;

	// Add a click event listener to our new link
	// this event handler is where the inline page will be fetched
	newLink.addEventListener('click', inlineViewClickHandler, true); 
	newLink.appendChild(icon.cloneNode(false));

	// Insert the new container before the current link...
	link.parentNode.insertBefore(container,link);
	
	// Now move the link inside the container before the new link
	// (FYI: this dance here is for the whitepace break stuff we implemented earlier)
	container.insertBefore(link, newLink);

	// Experienced some weird multiple-appendings... this was added
	// to attempt to stop this behavior...
	link.setAttribute('inlineviewappended','true');
	return true;
	
}

function inlineViewClickHandler(event) {
	// Event handler which takes clicks from our injected inline view icon links...
	var href, link;
	
	// Create the new dhtml frame
	if ( event.target.tagName.toLowerCase() == 'a' ) {
		// user managed to click the actual anchor and not the icon
		href = event.target.pathname;
		link = event.target;

	}	else if ( event.target.tagName.toLowerCase() == 'img' ) { 
		// user clicked the icon
		href = event.target.parentNode.pathname;
		link = event.target.parentNode;

	}else{
		// No idea how this function was launched, so we cannot proceed.
		GM_log('inlineViewClickHandler triggered from unknown element. Cannot proceed.');
		return false;
	}

	windowID = link.getAttribute('inlinewindow');		
	// check to see if the window is open and if so close it, otherwise pop a new window
	var openWindow = document.getElementById('inlineWindow-' + windowID);
	if(openWindow) {
		openWindow.parentNode.removeChild(openWindow);
	} else {
		inlineWindow = createNewInlineWindow(event, href, link, windowID);
	}
	
	event.preventDefault();
	return true;
}
*/

function createNewInlineWindow(event, href, link, windowID){
	// Close all previous inline windows...
	//closeInlineWindows();
	
	// Setup some constants for use in creating the inline window...
	var windowWidth = Math.round(document.body.clientWidth * 0.70);
	var windowHeight = Math.round(window.innerHeight * 0.55);
	var windowPadding = 13;
	var windowTextPadding = 10;
	var windowFontSize = 10;
	var windowBorderSize = 1;
	var windowButtonHeight = 12;
	var windowButtonTextSize = 11;
	
	var windowFullID = 'inlineWindow-' + windowID;
	
	// stop the window before getting this close to the left/right/top/bottom of the screen
	var pageBoundPadding = 10;
	
	var xpos, ypos;
	
	// get the position of the element that was clicked on...
	var elementTop = getElementOffset(link,'Top');
	var elementLeft = getElementOffset(link,'Left');
	//var elementTop = $(link).offset().top;
	//var elementLeft = $(link).offset().left;
	var elementHeight = parseInt(window.getComputedStyle(link,"").getPropertyValue('line-height'));
	// Sometimes (I don't know why), getPropertyValue("line-height") produces NaN.
	elementHeight = elementHeight || link.clientHeight;
	// But then clientHeight produces 0.
	// Fortunately we can use jQuery to find the height.
	elementHeight = elementHeight || $(link).height();
	//GM_log("elementHeight="+elementHeight);

	GM_addStyle(".inline-window #coordinates { position: initial; }");

	
	// setup the x-position of the inline window...
	// check to see if the left 1/3 of the window will overlap the left page bound..
	if ( elementLeft - (windowWidth/3) < pageBoundPadding ) {
		xpos = pageBoundPadding;
	} 
	// check to see if the right 2/3 of the window will overlap the right page bound...
	else if ( elementLeft + (windowWidth*2/3) > document.body.clientWidth - pageBoundPadding ) {
		xpos = document.body.clientWidth - pageBoundPadding - windowWidth;
	}
	else {
		// if we're not going to hit either wall, set the window to be offset
		// by 1/3 to the left of where we clicked (looks better than centering
		xpos = elementLeft - (windowWidth/3);
	}
	
	// setup the y-positioning of the inline window...

	var windowAppearsOnSide;

	// check to see if the window goes beyond the bottom of the viewport...
	if ( elementTop + windowHeight + pageBoundPadding > window.pageYOffset + window.innerHeight ) {
		ypos = elementTop - windowHeight;
		windowAppearsOnSide = 'Top';
	} else { 
		ypos = elementTop + elementHeight;
		windowAppearsOnSide = 'Bottom';
	}
	// If we put it above the element, make sure we didn't go off the top.
	if (ypos < 4) {
		ypos = 4;
	}

	var container = document.createElement('div');
	container.id = windowFullID;
	container.className = "inline-window";

	var cssBoxWidth = Math.round((windowWidth - (windowPadding+windowBorderSize)*2)/document.body.clientWidth*100);
	var cssBoxHeight = windowHeight - (windowPadding+windowBorderSize*2);

	// Some sites (especially Wikia) set a custom background colour.
	// Let's try to copy the colour that the site is using, otherwise fall back to white.
	var backgroundElement = document.querySelector('.WikiaPageBackground') || document.querySelector('.WikiaPageContentWrapper') || document.querySelector('div#content') || link;
	var backgroundColor = getComputedStyle(backgroundElement).backgroundColor;
	if (backgroundColor === 'rgba(0, 0, 0, 0)') {
		backgroundColor = 'white';
	}
	// If it has alpha, remove it.  Converts blah(1,2,3,4) -> blah(1,2,3)
	backgroundColor = backgroundColor.replace(/\(([0-9.]+,\s*[0-9.]+,\s*[0-9.]+),\s*[0-9.]+\)/, '($1)');

	container.innerHTML = '<div style="' +
		'position: absolute; '+
		// We can position with top/left.
		'top: ' + ypos + 'px;' +
		'left: ' + xpos + 'px; ' +
		// Or using margin.
		//'margin: ' + ypos + 'px 0 0 ' + xpos + 'px; ' +
		// We only need the following if we aren't adding to the top of the page.
		//'top: 0px; left: 0px; ' +
		'padding: ' + Math.round((windowPadding-windowButtonHeight)/2) +'px ' + windowPadding + 'px ' + windowPadding + 'px; ' +
		'width: ' + cssBoxWidth + '%; ' +
		'height: '+ cssBoxHeight + 'px; ' +
		//'background-color: #FFFFE0; '+
		//'border: ' + windowBorderSize + 'px solid #E0E0E0; '+
		'background: ' + backgroundColor + '; '+
		'border: ' + windowBorderSize + 'px solid #0004; '+
		//'border-radius: 5px; '+
		//'box-shadow: 0 4px 16px 0 #0004; '+
		// Attempt to match Wikipedia's own popups
		//'box-shadow: 0 16px 50px 0 #00000028; '+
		// Match what Wikipedia is using for its own .mwe-popups
		'box-shadow: 0 30px 90px -20px rgba(0,0,0,0.3); '+
		'z-index: 999; '+
		//'opacity: 0.95; '+
		'font-size: ' + windowFontSize + 'pt; '+
		'">'+
			'<div style="'+
				'float: right; '+
				//'background-color: #DDD; '+
				//'background-color: #0003; '+
				'margin: 0 3px ' + Math.round((windowPadding-windowButtonHeight)/2) +'px; '+
				'padding: 0 3px; '+
				'-moz-border-radius: 2px; '+
				'height: ' + windowButtonHeight + 'px; '+
				'font-size: ' + windowButtonTextSize + 'px; '+
				'line-height: ' + windowButtonTextSize + 'px; '+
				'font-weight: bold'+
			'"><a href="#" onClick="innerWindow = this.parentNode.parentNode.parentNode; innerWindow.parentNode.removeChild(innerWindow); return false;" style="text-decoration: none;">close</a></div>'+
			'<div style="'+
				'float: right; '+
				//'background-color: #DDD; '+
				//'background-color: #0003; '+
				'margin: 0 3px ' + Math.round((windowPadding-windowButtonHeight)/2) +'px; '+
				'padding: 0 3px; '+
				'-moz-border-radius: 2px; '+
				'height: ' + windowButtonHeight + 'px; '+
				'font-size: ' + windowButtonTextSize + 'px; '+
				'line-height: ' + windowButtonTextSize + 'px; '+
				'font-weight: bold'+
			'"><a href="' + href + '" style="text-decoration: none;">go to full article</a></div>'+
			'<div id="innerWindowCont-' + windowID + '" style="'+
				//'border: 1px dashed #0006; '+
				'border: 1px solid #0002; '+
				//'background: ' + backgroundColor + '; '+
				'padding: ' + windowTextPadding + 'px; '+
				'overflow: auto; '+
				'clear: both; '+
				'height: ' + (windowHeight - (windowTextPadding+windowPadding+windowBorderSize)*2) + 'px; ' +
			'">loading<span style="text-decoration: blink">...</span></div>'+	
		'</div>';
	// Always inserting at the top of the tree means that windows opened later would appear below windows opened earlier!
	//document.body.insertBefore(container, document.body.firstChild);
	// This requires us to perform positioning with top,left rather than margin in styling above.
	// It is also used after a click event to display the window on the top (see below).
	document.body.appendChild(container);
	// New method:
	/*
	var existingWindows = document.getElementsByClassName("inline-window");
	var insertTarget;
	if (existingWindows.length > 0) {
		var lastWindow = existingWindows[existingWindows.length - 1];
		insertTarget = lastWindow.nextSibling;
	} else {
		insertTarget = document.body.firstChild;
	}
	document.body.insertBefore(container, insertTarget);
	*/

	// When clicking anywhere on an innerWindow, bring it to the top.
	container.addEventListener("click", function(){
		document.body.appendChild(container);
	}, true);

	if (stylePreviewedLinks) {
		link.style.backgroundColor = '#FFFFE0';
		link.style.padding = '2px';
		link.style.border = '1px solid #E0E0E0';
		link.style["border"+windowAppearsOnSide] = '1px transparent';
		// The margin compensates for the padding and the border
		link.style.margin = '-3px';
		container.previewedLink = link;   // naughty
	}

	populateInnerWindow(href,windowID);
}

function populateInnerWindow(href,windowID) {
	
	var printHref = document.location.protocol + '//' + document.location.host + (document.location.port ? ':' + document.location.port : '');
	printHref += href + (href.indexOf('?') > -1 ? '&' : '?' ) + 'printable=yes';

	GM_xmlhttpRequest({
		method:'GET',
		url: printHref,
		onload:function(response) {
			var headings, header, content;
			var innerWindowContentBox = document.getElementById('innerWindowCont-' + windowID);
			var xmlDoc;
			// Pre 0.6.4 Method...
			//var parser = new DOMParser();
			// Post 0.6.4 Method...   joey disabled it, not working in FF GM
			if (false && typeof(XPCNativeWrapper) == "function") {
				var dp = new XPCNativeWrapper(window, "DOMParser()");
				var parser = new dp.DOMParser();
				xmlDoc = parser.parseFromString(response.responseText, "application/xhtml+xml");
			} else {
				// xmlDoc = document.createDocumentFragment(); // does not have getElementsByTagName!
				xmlDoc = document.createElement("div");
				xmlDoc.innerHTML = response.responseText;
				// xmlDoc = xmlDoc.firstChild;
			}

			if(!xmlDoc) {
				if (innerWindowContentBox) innerWindowContentBox.innerHTML = 'Error loading page.';
			}
			
			headings = xmlDoc.getElementsByTagName('h1');
			for(var i=0; i < headings.length; i++) if ( headings[i].className == 'firstHeading' ) {
				header = headings[i].firstChild.data; 
				break;
			}
			
			content = findElementById(xmlDoc,'mw-content-text'); // Cuts out some of the unwanted stuff
			content = content || findElementById(xmlDoc,'bodyContent');
			content = content || findElementById(xmlDoc,'content'); // What we used previously

			if (removeTOC) {
				var toc = findElementById(xmlDoc,'toc');
				if (toc) {
					toc.parentNode.removeChild(toc);
				}
			}

			if (innerWindowContentBox) {
				if (content && content.hasChildNodes()) {
					while(innerWindowContentBox.hasChildNodes()) innerWindowContentBox.removeChild(innerWindowContentBox.childNodes[0]);
					
					var head = document.createElement('h1');
					head.appendChild(document.createTextNode(header));
					//innerWindowContentBox.appendChild(head);

//					for(var childCount = 0; childCount <= content.childNodes.length; childCount++){
						content.id = '';
						innerWindowContentBox.appendChild(content);
//					}
					//innerWindowContentBox.innerHTML = (header?'<h1>' + header + '</h1>' : '') + content.innerHTML;
				} else {
					innerWindowContentBox.innerHTML = 'Error loading page.';
				}
			}else{
				GM_log("Couldn't find a window '" + windowID + "' to populate content for '" + href + "'");
			}
		} /*,
		onerror:function(err){
			GM_log("Error loading "+printHref+": "+err);
			console.error(err);
		} */
	});
}

function findElementById(node, id) {
	if (node.id == id) {
		return node;
	}
	if (node.childNodes) {
		for (var i=0;i<node.childNodes.length;i++) {
			var found = findElementById(node.childNodes[i],id);
			if (found)
				return found;
		}
	}
	return null;
}

function findParentInlineWindow(node) {
	while (node) {
		if (node.id && node.id.indexOf("inlineWindow-")==0) {
			return node;
		}
		node = node.parentNode;
	}
	return null;
}

function closeInlineWindows(){
	for(var i = 0; i < inlineWindowCount; i++) {
		closeInlineWindow('inlineWindow-' + i);
	}
	// Do not reset inlineWindowCount.  Even though we closed the windows, we didn't clear the indexes on the hovered links.  And these will be re-used if they are encountered again!  It is simpler if we just keep increasing inlineWindowCount so it is unique for every hovered link, and covers all previously opened window IDs (including any which have been closed and re-opened again by a second hover).
	//inlineWindowCount = 0;
}

function closeInlineWindow(id){ 
	var inlineWindow = document.getElementById(id);
	
	if ( inlineWindow ) {
		inlineWindow.style.display = 'none';
		inlineWindow.parentNode.removeChild(inlineWindow);
		if (stylePreviewedLinks && inlineWindow.previewedLink) {
			var link = inlineWindow.previewedLink;
			link.style.backgroundColor = '';
			link.style.padding = '';
			link.style.margin = '';
			link.style.border = '';
			link.style.borderTop = '';
			link.style.borderBottom = '';
		}
	}
	
}

function getElementOffset(element,whichCoord) {
	var count = 0
	while (element!=null) {
		//GM_log("Getting offset"+whichCoord+" from "+element.tagName+"#"+element.id+": "+element['offset'+whichCoord]);
	 	count += element['offset' + whichCoord];
		// Iterate upwards until we find element.offsetParent, removing any scrollTop encountered on the way.
		var scrollParent = element;
		while (scrollParent !== null) {
			// But ignore scrollTop of <body> element - we want to keep that!
			if (scrollParent.offsetParent !== null) {
				count -= scrollParent['scroll' + whichCoord];
			}
			scrollParent = scrollParent.parentElement;
			if (scrollParent === element.offsetParent) {
				break;
			}
		}
		element = element.offsetParent;
	}
	return count;
}

// Begin the action
//setTimeout(rewriteLinks,4000);

function findMatchingParent(elem, seekTagName) {
	if (!elem || typeof elem.tagName !== 'string') return null;
	if (elem.tagName.toLowerCase() === seekTagName.toLowerCase()) {
		return elem;
	} else {
		return findMatchingParent(elem.parentNode, seekTagName);
	}
}

// Joey's hover detection:
// BUG TODO: Can fire when the user scrolls the page and that causes a link to appear under the mouse.  This is annoying!
//           Could be avoided by only checking for hover recently after a 'mousemove' event.
//           Or conversely, by not checking recently after a 'scroll' event.
var hoverTimer, hoverTarget;
function isSuitableLink(evt) {
	var target = evt.target || evt.sourceElement;
	target = findMatchingParent(target, "A");
	// Most MediaWikis use /wiki/ArticleName but some (e.g. ArchWiki) use /index.php/ArticleName
	return (target && target.href && target.href.match("(/wiki/|/index.php/)"));
	// Alternative: '//div[@id="content"]//a[starts-with(@href,"/wiki/")]',
}
function onMouseOver(evt) {
	if (isSuitableLink(evt)) {
		hoverTarget = evt.target || evt.sourceElement;
		hoverTimer = setTimeout(hoverDetected, 2000);
	}
}
function onMouseOut(evt) {
	if (isSuitableLink(evt)) {
		if (hoverTimer) {
			clearTimeout(hoverTimer);
			hoverTimer = null;
		}
	}
}
function onClick(evt) {
	// The user has clicked on a link, so the browser should go there.
	// Equivalent behaviour to mouse out - cancel any hover detection.
	onMouseOut(evt);
}
function hoverDetected() {
	hoverTarget = findMatchingParent(hoverTarget, "A");
	if (!allowPreviewsInPreviews && findParentInlineWindow(hoverTarget)) {
		return;
	}
	// If we are using a previously hovered link then we will re-use his index.  If not, we will create a new index.
	if (!hoverTarget.getAttribute('inlinewindow')) {
		hoverTarget.setAttribute('inlinewindow',inlineWindowCount++);
	}
	var windowID = hoverTarget.getAttribute('inlinewindow');
	// check to see if the window is open and if so close it, otherwise pop a new window
	var openWindow = document.getElementById('inlineWindow-' + windowID);
	if(openWindow) {
		// openWindow.parentNode.removeChild(openWindow);
	} else {
		createNewInlineWindow(null, hoverTarget.pathname, hoverTarget, windowID);
	}
}
document.body.addEventListener("mouseover",onMouseOver,true);
document.body.addEventListener("mouseout",onMouseOut,true);
document.body.addEventListener("click",onClick,true);

// Easier close, just click anywhere outside the inlineWindow to close it.
document.body.addEventListener("click",function(evt){
	var node = evt.target || evt.sourceElement;
	var parentWindow = findParentInlineWindow(node);
	if (!parentWindow) {
		closeInlineWindows();
	}
},true);
