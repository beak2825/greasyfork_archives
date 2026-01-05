// ==UserScript==
// @name Ice Public панель плагинов 
// @namespace	
// @version 2.0
// @description by VrgS & Bufford
// @include http://*.oldbk.com/*
// @match http://*.oldbk.com/*
// @downloadURL https://update.greasyfork.org/scripts/7331/Ice%20Public%20%D0%BF%D0%B0%D0%BD%D0%B5%D0%BB%D1%8C%20%D0%BF%D0%BB%D0%B0%D0%B3%D0%B8%D0%BD%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/7331/Ice%20Public%20%D0%BF%D0%B0%D0%BD%D0%B5%D0%BB%D1%8C%20%D0%BF%D0%BB%D0%B0%D0%B3%D0%B8%D0%BD%D0%BE%D0%B2.meta.js
// ==/UserScript==
var called = false;
function ready() {
	if (called == false) {
		called = true;		
		if (document.URL.indexOf("Default12345.aspx") != -1 || document.URL.indexOf("/battle.php") != -1)  
			init_panel();
		else {
			var html_doc = document.getElementsByTagName("head");
			if (html_doc.length > 0)
				html_doc = html_doc[0];
			else
				html_doc = document.body;
			var js_raise_event = document.createElement("script");
			js_raise_event.setAttribute("type", "text/javascript");
			js_raise_event.setAttribute("src", "http://plugins.old-ice.ru/free/resources/js/LoadEvent.js");
			js_raise_event.setAttribute("charset", "utf-8");
			html_doc.appendChild(js_raise_event);
		}				
	}   
}
function init_panel() {
			document.getElementsByName("main")[0].outerHTML = '<frameset id="plfs" framespacing="0" border="0" frameborder="0" cols="*,0">' +
			'	<frame name="main" src="main.php?top=' + Math.random() + '">' +
			'	<frame name="plfr" src="refreshed.html">' +
			'</frameset>';
		BuildEmptyFrame(document.getElementsByName("plfr")[0]);
        var b = document.body;
        b.setAttribute("rows", "27,0,0,*,38");
        var f = document.createElement("frame");
        f.setAttribute("name","plugin");
        f.src = "refreshed.html";
        b.insertBefore(f, b.firstChild);
        BuildFrame(f);  
    }
		function BuildEmptyFrame(f) {
		var doc = null;
		if (f.contentDocument)
			doc = f.contentDocument;
		else if (f.contentWindow.document)
			doc = f.contentWindow.document;
		if (doc) {
			var CW = f.contentWindow;
			doc.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' +
				'<html><head>' +
				'<body bgcolor=#d7d7d7></body>' +
				'</html>');
		} else {
			setTimeout(function() { BuildEmptyFrame(f); }, 500);
		}
	}
    function BuildFrame(f) {
	if (f.contentDocument) {
		var CW = f.contentWindow;
		doc = f.contentDocument;
		doc.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'+
				'<html><head><script type="text/javascript">'+
				'var Initialized=false;'+
				'function Initialize(){if(!Initialized){Initialized=true;var html_doc = document.getElementsByTagName("head")[0];'+
				'var js_init = document.createElement("script");'+
				'js_init.setAttribute("type", "text/javascript");'+
				'js_init.setAttribute("src", "http://plugins.old-ice.ru/free/Create_panel.js?" + Math.random());'+
				'js_init.setAttribute("charset", "utf-8");'+
				'html_doc.appendChild(js_init);}}'+
				'<\/script></head>'+
				'<body bgcolor=#e2e0e0><a href="javascript:Initialize()">Строим панель...</a></body>'+
				'<script type="text/javascript">'+
				'var html_doc = document.getElementsByTagName("head")[0];'+
				'var js_jquery = document.createElement("script");'+
				'js_jquery.setAttribute("type", "text/javascript");'+
				'if(js_jquery.addEventListener){'+
				'js_jquery.addEventListener("load",function(){Initialize();},false)'+
				'}else if(js_jquery.attachEvent){'+
				'js_jquery.attachEvent("onreadystatechange", function(){if(js_jquery.readyState == "complete"||js_jquery.readyState == "loaded") {Initialize();}}) }'+
				'js_jquery.setAttribute("src", "http://plugins.old-ice.ru/free/resources/js/jquery-1.8.3.js");'+
				'html_doc.appendChild(js_jquery);'+
				'var js_jstorage = document.createElement("script");'+
				'js_jstorage.setAttribute("type", "text/javascript");'+
				'js_jstorage.setAttribute("src", "http://plugins.old-ice.ru/free/resources/js/jstorage.min.js");'+
				'setTimeout(function(){html_doc.appendChild(js_jstorage);},2000);'+
				'<\/script></html>');
	} else {
		setTimeout(function() { BuildFrame(f); }, 500);
	}
}
if (document.addEventListener) {
	document.addEventListener("DOMContentLoaded", function() {
		ready();
	}, false);
} else if (document.attachEvent) {
	if (document.documentElement.doScroll && window == window.top) {
		function tryScroll() {
			if (called) return;
			if (!document.body) return;
			try {
				document.documentElement.doScroll("left");
				ready();
			} catch (e) {
				setTimeout(tryScroll, 0);
			}
		}
		tryScroll();
	}
	window.attachEvent("onload", ready);
	document.attachEvent("onreadystatechange", function() {
		if (document.readyState === "complete") {
			ready();
		}
	});
}
if (window.addEventListener)
	window.addEventListener('load', ready, false);

