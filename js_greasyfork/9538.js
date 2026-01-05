// ==UserScript==
// @name           脚本转书签
// @namespace      MBFU
// @description    静若脱兔，动若处子
// @include        https://*greasyfork.org/*
// @include        http://*userscripts-mirror.org/*
// @include        https://*openuserjs.org/*
// @exclude        http://neuralyte.org/~joey/gm_scripts/joeys_userscripts_and_bookmarklets_overview.html
// @grant          none
// @version 0.0.1.20150530151702
// @downloadURL https://update.greasyfork.org/scripts/9538/%E8%84%9A%E6%9C%AC%E8%BD%AC%E4%B9%A6%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/9538/%E8%84%9A%E6%9C%AC%E8%BD%AC%E4%B9%A6%E7%AD%BE.meta.js
// ==/UserScript==

// BUG: We had (i%32) in a userscript (DLT) but when this was turned into a bookmarklet and dragged into Chrome, the debugger showed it had become (i2), causing the script to error with "i2 is not defined".  Changing the code to (i % 32) worked around the problem.

// TODO: All links with using dummy=random should change the value on mouseover/mousemove/click, so they can be re-used live without refreshing the page.
//       Static bookmarklets could timeout and re-build after ... 10 seconds?  ^^

// Most people will NOT want the NoCache version.  It's only useful for script developers.

// Firefox/Greasemonkey does not like to install scripts ending ".user.js?dummy=123"
// But in Chrome it is a useful way to prevent the script from being cached when you are developing it.
var inGoogleChrome = window && window.navigator && window.navigator.vendor.match(/Google/);

var preventBrowserFromCachingBookmarklets = inGoogleChrome;

// Sometimes Chrome refuses to acknowledge that a script has been updated, and repeatedly installs an old version from its cache!
var preventCachingOfInstallScripts = inGoogleChrome;
// BUG: Chrome sometimes installs a new instance of an extension for each click, rather than overwriting (upgrading) the old.  However disabling preventBrowserFromCachingBookmarklets does not fix that.  It may have been the name "Wikimedia+"?

var addGreasemonkeyLibToBookmarklets = true;

// DONE: All bookmarklets optionally preload the Fallback GMAPI.
// DONE: All bookmarklets optionally load in non-caching fashion (for changing scripts).

// DONE: Use onload event to ensure prerequisite scripts are loaded before dependent scripts.

// DONE via FBGMAPI: We could provide neat catches for GM_ API commands so they won't fail entirely.

// TODO: Provide extra feature, which allows the Bookmarks to actually trigger
// the userscript properly-running inside Greasemonkey, if this userscript is
// present to handle the request, otherwise (with warning) load outside GM.

// TODO: Support @include/@excude and @require meta rules?
// This requires parsing the script's header using XHR before creating each bookmarklet.

// DONE: Optionally create static bookmarklet, with all code inline, rather than loaded from a URL.
//       // comments will need to be removed or converted to /*...*/ comments

var addDateToStaticBookmarklets = true;

var defaultScripts = [];
var includeGMCompat = addGreasemonkeyLibToBookmarklets;
if (includeGMCompat) {
	// defaultScripts.push("https://greasyfork.org/scripts/7662-fallbackgmapi/code/FallbackGMAPI.user.js;
}


function buildLiveBookmarklet(link) {
	var neverCache = preventBrowserFromCachingBookmarklets;

	var scriptsToLoad = defaultScripts.slice(0);

	scriptsToLoad.push(link.href);

	var neverCacheStr = ( neverCache ? "+'?dummy='+new Date().getTime()" : "" );

	/*
	var toRun = "(function(){\n";
	for (var i=0;i<scriptsToLoad.length;i++) {
		var script = scriptsToLoad[i];
		toRun += "  var newScript = document.createElement('script');\n";
		toRun += "  newScript.src = '" + script + "'" + neverCacheStr + ";\n";
		toRun += "  document.body.appendChild(newScript);\n";
	}
	toRun += "})();";
	*/

	var toRun = "(function(){\n";
	// Chrome has no .toSource() or uneval(), so we use JSON.  :f
	toRun += "var scriptsToLoad="+JSON.stringify(scriptsToLoad)+";\n";
	toRun += "function loadNext() {\n";
	toRun += "  if (scriptsToLoad.length == 0) { return; }\n";
	toRun += "  var next = scriptsToLoad.shift();\n";
	toRun += "  var newScript = document.createElement('script');\n";
	toRun += "  newScript.src = next"+neverCacheStr+";\n";
	toRun += "  newScript.onload = loadNext;\n";
	toRun += "  newScript.onerror = function(e){ console.error('Problem loading script: '+next,e); };\n";
	toRun += "  document.body.appendChild(newScript);\n";
	toRun += "}\n";
	toRun += "loadNext();\n";
	toRun += "})(); (void 0);";

	var name = getNameFromFilename(link.href);
	/*
	if (neverCache) {
		name = name + " (NoCache)";
	}
	if (includeGMCompat) {
		name = name + " (FBAPI)";
	}
	*/

	var newLink = document.createElement("A");
	newLink.href = "javascript:" + toRun;
	newLink.textContent = name;
	newLink.title = newLink.href;

	var newContainer = document.createElement("div");
	// newContainer.style.whiteSpace = 'nowrap';
	newContainer.appendChild(document.createTextNode("(Live Bookmarklet: "));
	newContainer.appendChild(newLink);
	var extraString = ( neverCache || includeGMCompat ? neverCache && includeGMCompat ? " (no-caching, with GM fallbacks)" : neverCache ? " (no-caching)" : " (with GM fallbacks)" : "" );
	// DISABLED HERE:
	extraString = "";
	if (extraString) {
		// newContainer.appendChild(document.createTextNode(extraString));
		// var extraText = document.createElement("span");
		// extraText.style.fontSize = '80%';
		var extraText = document.createElement("small");
		extraText.textContent = extraString;
		newContainer.appendChild(extraText);
	}
	newContainer.appendChild(document.createTextNode(")"));
	newContainer.style.paddingLeft = '8px';
	// link.parentNode.insertBefore(newContainer,link.nextSibling);
	return newContainer;
}

function reportMessage(msg) {
	console.log(msg);
}

function reportWarning(msg) {
	console.warn(msg);
}

function reportError(msg) {
	console.error(msg);
}

function doesItCompile(code) {
	try {
		var f = new Function(code);
	} catch (e) {
		return false;
	}
	return true;
}

/* For more bugs try putting (function(){ ... })(); wrapper around WikiIndent! */

function fixComments(line) {

	//// Clear // comment line
	line = line.replace(/^[ \t]*\/\/.*/g,'');

	//// Wrap // comment in /*...*/ (Dangerous! if comment contains a */ !)
	// line = line.replace(/^([ \t]*)\/\/(.*)/g,'$1/*$2*/');

	//// Clear trailing comment (after a few chars we deem sensible)
	//// This still doesn't handle some valid cases.
	var trailingComment = /([;{}()\[\],\. \t])\s*\/\/.*/g;
	//// What might break: An odd number of "s or 's, any /*s or */s
	var worrying = /(["']|\/\*|\*\/)/;
	// Here is a breaking example:
	// var resNodes = document.evaluate("//div[@id='res']//li", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	// var hasTrailingComment = line.match(trailingComment);
	var hasTrailingComment = trailingComment.exec(line);
	if (hasTrailingComment) {
		/*
		if (line.match(worrying)) {
			reportWarning("Warning: trailingComment matches: "+hasTrailingComment);
		}
		*/
		var compiledBefore = doesItCompile(line);
		var newLine = line.replace(trailingComment,'$1');
		var compilesAfter = doesItCompile(newLine);
		if (compiledBefore && !compilesAfter) {
			reportWarning("Aborted // stripping on: "+line);
		} else {
			// Accept changes
			line = newLine;
		}
	}
	return line;

}

function cleanupSource(source) {
	// console.log("old length: "+source.length);
	var lines = source.split('\n');
	// console.log("lines: "+lines.length);
	for (var i=0;i<lines.length;i++) {
		lines[i] = fixComments(lines[i]);
	}
	// source = lines.join('\n');
	source = lines.join(' ');
	// console.log("new length: "+source.length);
	//// For Bookmarklet Builder's reformatter:
	source = source.replace("(function","( function",'g');
	return source;
}

// We could cache urls, at least during this one page visit
// Specifically the ones we request repeatedly for statis bmls (fbgmapi).
var sourcesLoaded = {};

// My first "promise":
function getSourceFor(url) {

	var handler;

	function handlerFn(res) {
		var source = res.responseText;
		if (handler) {
			handler(source);
		}
	}

	function onErrorFn(res) {
		reportError("Failed to load "+url+": HTTP "+res.status);
	}

	// I found this was needed one time on Chrome!
	// It probably doesn't need to be linked to preventCachingOfInstallScripts or preventBrowserFromCachingBookmarklets.
	url += "?dummy="+Math.random();
	console.log("Loading "+url);
	getURLThen(url,handlerFn,onErrorFn);

	return {
		then: function(handleResponse){
			handler = handleResponse;
			// TODO: return next promise
		}
	};
}

/* To avoid a multitude of premature network requests, the bookmarklet is not actually "compiled" until mouseover. */
function buildStaticBookmarklet(link) {

	var newLink = document.createElement("a");
	newLink.textContent = getNameFromFilename(link.href);

	var newContainer = document.createElement("div");
	// newContainer.style.whiteSpace = 'nowrap';
	// Experimental:
	newContainer.appendChild(document.createTextNode("(Static Bookmarklet: "));
	newContainer.appendChild(newLink);
	newContainer.appendChild(document.createTextNode(")"));
	newContainer.style.paddingLeft = '8px';

	newLink.style.textDecoration = 'underline';
	// newLink.style.color = '#000080';
	newLink.style.color = '#333366';

	// link.parentNode.insertBefore(newContainer,link.nextSibling);

	// The href may change before we fire (e.g. if dummy is appended) so we make a copy.
	var href = link.href;

	// setTimeout(function(){
	// ,2000 * staticsRequested);
	newLink.onmouseover = function(){
		getStaticBookmarkletFromUserscript(href,whenGot);
		newLink.style.color = '#ff7700';
		newLink.onmouseover = null; // once
	};

	function whenGot(staticSrc) {

		// Does it parse?
		try {
			var testFn = new Function(staticSrc);
			newLink.style.color = '';  // Success!  Color like a normal link
		} catch (e) {
			var msg = "PARSE FAILED";
			// Firefox has this:
			if (e.lineNumber) {
				msg += " on line "+e.lineNumber;
			}
			msg += ":";
			console.log("["+href+"] "+msg,e);
			newLink.title = msg+" "+e;
			newLink.style.color = 'red'; // color as error
			window.lastParseError = e;
			// return;
		}

		newLink.href = "javascript:" + staticSrc;

		if (addDateToStaticBookmarklets) {
			var d = new Date();
			//var dateStr = d.getFullYear()+"."+(d.getMonth()+1)+"."+d.getDate();
			var dateStr = d.toISOString().substring(0,10);
			newLink.textContent = newLink.textContent + " ("+dateStr+")";
		}

		// Just in case the browser is dumb, force it to re-analyse the link.
		newLink.parentNode.insertBefore(newLink,newLink.nextSibling);
	}

	return newContainer;

}

function getStaticBookmarkletFromUserscript(href,callback) {

	var scriptsToLoad = defaultScripts.slice(0);
	scriptsToLoad.push(href);

	var scriptSources = [];
	var numLoaded = 0;

	function loadSourceIntoArray(i) {
		getSourceFor(scriptsToLoad[i]).
		then(function(source){
			if (!source) {
				reportError("Failed to acquire source for: "+href);
			}
			scriptSources[i] = source;
			numLoaded++;
			if (numLoaded == scriptsToLoad.length) {
				allSourcesLoaded();
			}
		});
	}

	for (var i=0;i<scriptsToLoad.length;i++) {
		loadSourceIntoArray(i);
	}

	function allSourcesLoaded() {

		var toRun = "";

		for (var i=0;i<scriptSources.length;i++) {
			if (!scriptSources[i]) {
				reportError("Expected contents of "+scriptsToLoad[i]+" but got: "+scriptSources[i]);
			}
			var cleaned = cleanupSource(scriptSources[i]);
			toRun += "(function(){\n";
			toRun += cleaned;
			toRun += "})();\n";
		}
		toRun += "(void 0);";

		callback(toRun);

	}

}

// In this case, link points to a folder containing a userscript.
// We guess the userscript's name from the folder's name.
function addQuickInstall(link) {
	if (link.parentNode.tagName == 'TD') {
		link.parentNode.style.width = '60%';
	}
	var br2 = document.createElement("br");
	link.parentNode.insertBefore(br2,link.nextSibling);
	var br = document.createElement("br");
	link.parentNode.insertBefore(br,link.nextSibling.nextSibling);
	var name = link.href.match(/([^\/]*)\/$/)[1];
	var newLink = document.createElement("A");
	newLink.href = link.href + name+".user.js";
	newLink.textContent = "Install Userscript"; // name+".user.js";
	var newContainer = document.createElement("span");
	newContainer.appendChild(document.createTextNode("      ["));
	newContainer.appendChild(newLink);
	newContainer.appendChild(document.createTextNode("]"));
	newContainer.style.paddingLeft = '8px';
	link.parentNode.insertBefore(newContainer,br);
	link.style.color = 'black';
	link.style.fontWeight = 'bold';
	newContainer.appendChild(buildLiveBookmarklet(newLink));
	newContainer.appendChild(buildStaticBookmarklet(newLink));
	newContainer.appendChild(buildLiveUserscript(newLink));
	popupSourceOnHover(newLink);
	// Do this after the other two builders have used the .href
	if (preventCachingOfInstallScripts) {
		newLink.href = newLink.href + '?dummy='+new Date().getTime();
	}
}

function getURLThen(url,handlerFn,onErrorFn) {
	var req = new XMLHttpRequest();
	req.open("get", url, true);
	req.onreadystatechange = function (aEvt) {
		if (req.readyState == 4) {
			if(req.status == 200) {
				// Got it
				handlerFn(req);
			} else {
				var msg = ("XHR failed with status "+req.status+"\n");
				window.status = msg;
				onErrorFn(req);
				console.warn(msg);
			}
		}
	};
	req.send(null);
}

var frame = null;

function loadSourceViewer(url, newLink, evt) {

	// window.lastEVT = evt;

	if (frame && frame.parentNode) {
		frame.parentNode.removeChild(frame);
	}
	frame = document.createElement("div");

	function reportToFrame(msg) {
		frame.appendChild( document.createTextNode(msg) );
	}

	// This doesn't work.  Loading it directly into the iframe triggers Greasemonkey to install it!
	//frame.src = url;
	// What we need to do is get the script with an XHR, then place it into the div.

	// This seems to fire immediately in Firefox!
	var cleanup = function(evt) {
		frame.parentNode.removeChild(frame);
		document.body.removeEventListener("click",cleanup,false);
		// frame.removeEventListener("mouseout",cleanup,false);
	};
	document.body.addEventListener("click",cleanup,false);

	getURLThen(url, function(res){
		// We were using pre instead of div to get monospace like <tt> or <code>
		// However since we are commonly reading the description, sans seems better.
		var displayDiv = document.createElement("div");
		displayDiv.style.fontSize = '0.8em';
		displayDiv.style.whiteSpace = "pre-wrap";
		var displayCode = document.createElement("pre");
		displayCode.textContent = res.responseText;
		displayCode.style.maxHeight = "100%";
		displayCode.style.overflow = "auto";
		displayDiv.appendChild(displayCode);
		while (frame.firstChild) {
			frame.removeChild(frame.firstChild);
		}
		frame.appendChild(displayDiv);
		if (typeof Rainbow != null) {
			/*
			// Works fine in Chrome, but in Firefox it causes Rainbow to fail with "too much recursion".
			Rainbow.extend('javascript', [
				{
					'name': 'importantcomment',
					'pattern': /(\/\/|\#) @(name|description|include) [\s\S]*?$/gm
				},
			], false);
			*/
			setTimeout(function(){
				displayCode.setAttribute('data-language', "javascript");
				displayCode.style.fontSize = '100%';
				Rainbow.color(displayCode.parentNode, function(){
					console.log("Rainbow finished.");
				});
			},50);
		}
		// frame.addEventListener("mouseout",cleanup,false);
		// newLink.title = res.responseText;
		var lines = res.responseText.split("\n");
		for (var i=0;i<lines.length;i++) {
			var line = lines[i];
			if (line.match(/@description\s/)) {
				var descr = line.replace(/.*@description\s*/,'');
				newLink.title = descr;
				break;
			}
		}
	}, function(res){
		reportToFrame("Failed to load "+url+": HTTP "+res.status);
	});

	/*
	frame.style.position = 'fixed';
	frame.style.top = evt.clientY+4+'px';
	frame.style.left = evt.clientX+4+'px';
	*/
	// frame.style.position = 'absolute';
	// frame.style.top = evt.layerY+12+'px';
	// frame.style.left = evt.layerX+12+'px';
	// frame.style.top = evt.layerY - window.innerHeight*35/100 + 'px';
	// frame.style.left = evt.layerX + 64 + 'px';
	// frame.style.width = "70%";
	// frame.style.height = "70%";
	frame.style.position = 'fixed';
	frame.style.right = '2%';
	frame.style.width = '50%';
	frame.style.top = '10%';
	frame.style.height = '80%';
	frame.style.backgroundColor = 'white';
	frame.style.color = 'black';
	frame.style.padding = '8px';
	frame.style.border = '2px solid #555555';
	document.body.appendChild(frame);

	reportToFrame("Loading...");

}

function buildSourceViewer(link) {
	var newLink = document.createElement("A");
	// newLink.href = '#';
	newLink.textContent = "Source";

	newLink.addEventListener('click',function(e) {
		loadSourceViewer(link.href,newLink,e);
	},false);

	// TODO: Problem with .user.js files and Chrome:
	// In Chrome, opens an empty iframe then the statusbar says it wants to install an extension.
	// For Chrome we could try: frame.src = "view-source:"+...;
	var extra = document.createElement("span");
	extra.appendChild(document.createTextNode("["));
	extra.appendChild(newLink);
	extra.appendChild(document.createTextNode("]"));
	extra.style.paddingLeft = '8px';

	// link.parentNode.insertBefore(extra,link.nextSibling);
	return extra;
}

function popupSourceOnHover(link) {
	var hoverTimer = null;
	function startHover(evt) {
		stopHover(evt);
		hoverTimer = setTimeout(function(){
			loadSourceViewer(link.href, link, evt);
			stopHover(evt);
			// link.removeEventListener("mouseover",startHover,false);
			// link.removeEventListener("mouseout",stopHover,false);
		},1500);
	}
	function stopHover(evt) {
		clearTimeout(hoverTimer);
		hoverTimer = null;
	}
	link.addEventListener("mouseover",startHover,false);
	link.addEventListener("mouseout",stopHover,false);
	// If they click on it before waiting to hover, they probably don't want the popup:
	link.addEventListener("click",stopHover,false);
}

function buildLiveUserscript(link) {
	//// This isn't working any more.  data:// lost its power circa 2006 due to abuse.
	//// Create a clickable link that returns a sort-of file to the browser using the "data:" protocol.
	//// That file would be a new userscript for installation.
	//// We can generate the contents of this new userscript at run-time.
	//// The current one we generate runs (no @includes), and loads the latest userscript from its website via script injection.
	/* DISABLED
	// BUG: data:{...}.user.js does not interest my Chromium
	var name = getNameFromFilename(link.href)+" Live!";
	var name = "Install LiveLoader";
	var whatToRun = '(function(){\n'
		+ '  var ns = document.createElement("script");\n'
		+ '  ns.src = "' + encodeURI(getCanonicalUrl(link.href)) + '";\n'
		+ '  document.getElementsByTagName("head")[0].appendChild(ns);\n'
		+ '})();\n';
	var newLink = document.createElement("a");
	newLink.textContent = name;
	newLink.href = "data:text/javascript;charset=utf-8,"
		+ "// ==UserScript==%0A"
		+ "// @namespace LiveLoader%0A"
		+ "// @name " + name + " LIVE%0A"
		+ "// @description Loads " +name+ " userscript live from " + link.href + "%0A"
		+ "// ==/UserScript==%0A"
		+ "%0A"
		+ encodeURIComponent(whatToRun) + "%0A"
		+ "//.user.js";
	var extra = document.createElement("span");
	extra.appendChild(document.createTextNode("["));
	extra.appendChild(newLink);
	extra.appendChild(document.createTextNode("]"));
	extra.style.paddingLeft = '8px';
	link.parentNode.insertBefore(extra,link.nextSibling);
	*/
	return document.createTextNode("");
}

function getCanonicalUrl(url) {
	if (url.substring(0,1)=="/") {
		url = document.location.protocol + "://" + document.location.domain + "/" + url;
	}
	if (!url.match("://")) {
		url = document.location.href.match("^[^?]*/") + url;
	}
	return url;
}

function getNameFromFilename(href) {
	var isUserscript = href.match(/\.user\.js$/);
	// Remove any leading folders and trailing ".user.js"
	var name = href.match(/[^\/]*$/)[0].replace(/\.user\.js$/,'');

	name = decodeURIComponent(name);

	// The scripts on userscripts-mirror.org do not have their name in the filename,
	// but we can get the name from the page title!
	if (document.location.host=="userscripts-mirror.org" && document.location.pathname=="/scripts/show/"+name) {
		var scriptID = name;
		name = document.title.replace(/ for Greasemonkey/,'');
		// Optionally, include id in name:
		name += " ("+scriptID+")";
	}

	if (isUserscript) {
		var words = name.split("_");
		for (var i=0;i<words.length;i++) {
			if (words[i].length) {
				var c = words[i].charCodeAt(0);
				if (c>=97 && c<=122) {
					c = 65 + (c - 97);
					words[i] = String.fromCharCode(c) + words[i].substring(1);
				}
			}
		}
		name = words.join(" ");
	} else {
		// It's just a Javascript file
		name = "Load "+name;
	}
	return name;
}

var links = document.getElementsByTagName("A");
//// We used to process backwards (for less height recalculation).
//// But this was messing up maxStaticsToRequest.
//// But now backwards processing is restored, to avoid producing multiple bookmarks!
for (var i=links.length;i--;) {
//for (var i=0;i<links.length;i++) {
	var link = links[i];

	if (link.getAttribute('data-make-bookmarklet') === 'false') {
		continue;
	}

	// If we see a direct link to a user script, create buttons for it.
	if (link.href.match(/\.js$/)) { // \.user\.js
		var where = link;
		function insert(newElem) {
			where.parentNode.insertBefore(newElem,where.nextSibling);
			where = newElem;
		}
		insert(buildLiveBookmarklet(link));
		insert(buildStaticBookmarklet(link));
		insert(buildLiveUserscript(link));
		insert(buildSourceViewer(link));
	}

	// If the current page looks like a Greasemonkey Userscript Folder, then
	// create an installer for every subfolder (assuming a script is inside it).
	if (document.location.pathname.match(/\/(gm_scripts|userscripts)\//)) {
		if (link.href.match(/\/$/) && link.textContent!=="Parent Directory") {
			addQuickInstall(link);
		}
	}

}

/*
var promise(getURLThen,url) {
	var handler;

	getURLThen(url,handlerFn,handlerFn);

	function handlerFn(res) {
		var source = res.responseText;
		if (handler) {
			handler(source);
		} else {
			reportError("No handler set for: "+
		}
	}

	return {
		then: function(handleResponse){
			handler = handleResponse;
		}
	};
}
*/
