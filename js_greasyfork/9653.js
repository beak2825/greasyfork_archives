// ==UserScript==
// @name           One Click Userscripts
// @namespace      OCU
// @description    Don't use Greasemonkey to load your userscripts, use this lighter interface instead!  Also works as a bookmarklet.
// @version        1.0.0
// @include        *
// @downloadURL https://update.greasyfork.org/scripts/9653/One%20Click%20Userscripts.user.js
// @updateURL https://update.greasyfork.org/scripts/9653/One%20Click%20Userscripts.meta.js
// ==/UserScript==

// == TODO ==
// Respect Include/Exclude rules.
// Could be renamed: All My Userscripts
// TODO: If it detects it is running as a userscript, it should load itself as a normal page script, then exit (i.e. run the latest version).  This should be done very carefully (e.g. with a pause and a warning marker set as a global) since we don't want to create an infinite loop!



// == Config ==

var allowBrowserToCacheScripts = false;

/*
var defaultScripts = [
	"https://greasyfork.org/scripts/7662-fallbackgmapi/code/FallbackGMAPI.user.js",
	"https://greasyfork.org/scripts/7676-wikiindent/code/WikiIndent.user.js",
];
*/

function hwiScript(scriptName) {
	return "https://github.com/joeytwiddle/code/tree/master/other/gm_scripts/" + scriptName + "/" + scriptName + ".user.js";
}

var defaultScripts = map([
	// "fastjslogger",   DONE in sequence below, since these are opened in parallel.
	"auto_scroll_mouse",
	"auto_scroll_keys",
	"table_of_contents_everyw",
	"faviconizetheweb",
	"Related_Links_Pager",
	"hibernate_idle_tabs",
	"wikiindent",
	"wikimedia",
	// "make_bookmarklet_from_us",
	"title_youtube_locations",
	"google_preview_pane",
	// "tocmonkey",
	/*
	"powermonkey"
	*/
	"delicious_link_tooltop"
],hwiScript);

var loadScriptsSequentially = false;

// Emergency Shims:
if (!document.evaluate) {
	defaultScripts.unshift("http://hwi.ath.cx/javascript/xpath.js");
}



// == Library functions ==

// We need logging to work, at least until fastjslogger loads.
function log(str) {
	if (typeof GM_log == 'function') {
		GM_log(str);
	} else if (this.console && console.log) {
		console.log(str);
	}
}

// For older browsers (Konqueror 3.5):

function map(list,fn) {
	var newList = [];
	for (var i=0;i<list.length;i++) {
		newList.push( fn(list[i]) );
	}
	return newList;
}

function forEach(list,fn) {
	for (var i=0;i<list.length;i++) {
		fn(list[i],i);
	}
}



// == Main ==

function loadUserscripts() {

	var scriptsToLoad;

	try {
		// scriptsToLoad = JSON.parse(GM_getValue("OCU_scriptList",null));
		// log("[OCU] Loaded config: "+scriptsToLoad);
	} catch (e) { }

	if (!scriptsToLoad || !scriptsToLoad.length) {
		log("[OCU] No config found, falling back to default script list.");
		scriptsToLoad = defaultScripts;
		// Some sites (e.g. wikitravel) replace the default JSON with an incomplete implementation.
		if (this.JSON && JSON.stringify && typeof GM_setValue == 'function') {
			GM_setValue("OCU_scriptList",JSON.stringify(scriptsToLoad));
		}
	}

	if (loadScriptsSequentially) {

		// Slow but useful for debugging.
		function doOne() {
			if (scriptsToLoad.length) {
				var script = scriptsToLoad.shift();
				loadScript(script,doOne);
			} else {
				GM_log("[OCU] Finished loading scripts.");
			}
		}
		doOne();

	} else {

	forEach(scriptsToLoad,considerScript);

	}

}

function loadScript(url,thenCallFn) {
	log("[OCU] Loading: "+url);
	var scr = document.createElement("script");
	if (!allowBrowserToCacheScripts) {
		var sep = ( url.indexOf('?')>=0 ? '&' : '?' );
		url = url + sep+"dummy="+Math.random(100000);
	}
	scr.src = url;
	scr.type = "text/javascript";   // Konqueror 3.5 needs this!
	if (thenCallFn) {
		// Fixed: scr.onload=thenCallFn fails in Greasemonkey with "Component is not available"
		var called = false;
		function onceOnlyCallback(evt) {
			if (!called) {
				called = true;
				thenCallFn(evt);
			}
		}
		function errorCallback(evt) {
			log("[OCU] Failed to load: "+url,evt);
			onceOnlyCallback(evt);
		}
		scr.addEventListener('load',onceOnlyCallback,false);
		scr.addEventListener('error',errorCallback,false);
		// Fallback in case above events unsupported by browser (e.g. Konq 3.5)
		setTimeout(onceOnlyCallback,5000);
	}
	document.body.appendChild(scr);
}

function considerScript(url) {
	// TODO: Check includes/excludes
	// But don't do it every time, at least cache the data for occasional update.
	if (true) {
		loadScript(url);
	}
}



// == Load fallback GM API library in case we need it. ==

loadScript(hwiScript("fallbackgmapi"),function(){
	loadScript(hwiScript("fastjslogger"),loadUserscripts);
});
