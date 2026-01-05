// ==UserScript==
// @name           YouTube Popcorn
// @namespace      http://youtube.com/channel/UC_bMljS4sETid3es1d_nqzw
// @homepageURL    http://youtube.com/channel/UC_bMljS4sETid3es1d_nqzw
// @description    Show Quality on Pop in corner Image, and possibility direct download.
// @author         Yorotiba
// @oujs:author    Yorotiba
// @version        1.2
// @supporturl     mailto:yorotiba@gmx.fr
// @copyright      2014 , Yorotiba
// @include        http://*.youtube.com/*
// @include        http://youtube.com/*
// @include        https://*.youtube.com/*
// @include        https://youtube.com/*
// @match          *://*.youtube.com/*
// @match          *://*.googlevideo.com/*
// @match          *://s.ytimg.com/yts/jsbin/*
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/5552/YouTube%20Popcorn.user.js
// @updateURL https://update.greasyfork.org/scripts/5552/YouTube%20Popcorn.meta.js
// ==/UserScript==

/* This is based & remake on YouTube Links 1.62 */

/* Tested on Firefox 2+ Chrome 2+ and Opera 1+ */

	(function() {

	// =============================================================================

	var win = typeof(unsafeWindow) !== "undefined" ? unsafeWindow : window;
	var doc = win.document;
	var loc = win.location;

	if(win.top != win.self)	
	  return;

	var unsafeWin = win;

	// Hack to get unsafe window in Chrome
	(function() {

	var isChrome = navigator.userAgent.toLowerCase().indexOf("chrome") >= 0;

	if(!isChrome)
	  return;

	// Chrome 27 fixed this exploit, but luckily, its unsafeWin now works for us
	try {
	  var div = doc.createElement("div");
	  div.setAttribute("onclick", "return window;");
	  unsafeWin = div.onclick();
	} catch(e) {
	  }

	}) ();

	// =============================================================================

    var SCRIPT_NAME = "YouTube popcorn";
    
    var relInfo = {
        ver: 10100,
        ts: 2015030700,
        desc: "Fix bug, add 4 -sig, more set quality "
    };
    
    var SCRIPT_UPDATE_LINK = loc.protocol + "//greasyfork.org/scripts/5552-youtube-popcorn/code/YouTube Popcorn.user.js";
    var SCRIPT_LINK = loc.protocol + "//greasyfork.org/scripts/5552-youtube-popcorn/code/YouTube Popcorn.user.js";

	// =============================================================================

	var dom = {};

	dom.gE = function(id) {
	  return doc.getElementById(id);
	  };

	dom.gT = function(dom, tag) {
	  if(arguments.length == 1) {
		tag = dom;
		dom = doc;
		}

	  return dom.getElementsByTagName(tag);
	  };

	dom.cE = function(tag) {
	  return document.createElement(tag);
	  };

	dom.cT = function(s) {
	  return doc.createTextNode(s);
	  };

	dom.attr = function(obj, k, v) {
	  if(arguments.length == 2)
		return obj.getAttribute(k);

	  obj.setAttribute(k, v);
	  };

	dom.prepend = function(obj, child) {
	  obj.insertBefore(child, obj.firstChild);
	  };

	dom.append = function(obj, child) {
	  obj.appendChild(child);
	  };

	dom.offset = function(obj) {
	  var x = 0;
	  var y = 0;

	  if(obj.getBoundingClientRect) {
		var box = obj.getBoundingClientRect();
		var owner = obj.ownerDocument;

		x = box.left + Math.max(owner.documentElement.scrollLeft, owner.body.scrollLeft) - owner.documentElement.clientLeft;
		y = box.top + Math.max(owner.documentElement.scrollTop, owner.body.scrollTop) - owner.documentElement.clientTop;

		return { left: x, top: y };
		}

	  if(obj.offsetParent) {
		do {
		  x += obj.offsetLeft - obj.scrollLeft;
		  y += obj.offsetTop - obj.scrollTop;
		  obj = obj.offsetParent;
		} while(obj);
		}

	  return { left: x, top: y };
	  };

	dom.inViewport = function(el) {
	  var rect = el.getBoundingClientRect();

	  return rect.bottom >= 0 &&
	   rect.right >= 0 &&
	   rect.top < (win.innerHeight || doc.documentElement.clientHeight) &&
	   rect.left < (win.innerWidth || doc.documentElement.clientWidth);
	  };

	dom.html = function(obj, s) {
	  if(arguments.length == 1)
		return obj.innerHTML;

	  obj.innerHTML = s;
	  };

	dom.emitHtml = function(tag, attrs, body) {
	  if(arguments.length == 2) {
		if(typeof(attrs) == "string") {
		  body = attrs;
		  attrs = {};
		  }
		}

	  var list = [];

	  for(var k in attrs) {
		list.push(k + "='" + attrs[k].replace(/'/g, "\\'") + "'");
		}

	  var s = "<" + tag + " " + list.join(" ") + ">";

	  if(body != null)
		s += body + "</" + tag + ">";

	  return s;
	  };

	dom.emitCssStyles = function(styles) {
	  var list = [];

	  for(var k in styles) {
		list.push(k + ": " + styles[k] + ";");
		}

	  return " { " + list.join(" ") + " }";
	  };

	dom.ajax = function(opts) {
	  function newXhr() {
		if(window.ActiveXObject) {
		  try {
			return new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) {
			  }

		  try {
			return new ActiveXObject("Microsoft.XMLHTTP");
			} catch(e) {
			  return null;
			  }
		  }

		if(window.XMLHttpRequest)
		  return new XMLHttpRequest();

		return null;
		}

	  function nop() {
		}

	  // Entry point
	  var xhr = newXhr();

	  opts = addProp({
		type: "GET",
		async: true,
		success: nop,
		error: nop,
		complete: nop
		}, opts);

	  xhr.open(opts.type, opts.url, opts.async);

	  xhr.onreadystatechange = function() {
		if(xhr.readyState == 4) {
		  var status = +xhr.status;

		  if(status >= 100 && status < 300) {
			opts.success(xhr.responseText, "success", xhr);
			}
		  else {
			opts.error(xhr, "error");
			}

		  opts.complete(xhr);
		  }
		};

	  xhr.send("");
	  };

	dom.crossAjax = function(opts) {
	  function wrapXhr(xhr) {
		var headers = xhr.responseHeaders.replace("\r", "").split("\n");

		var obj = {};

		forEach(headers, function(idx, elm) {
		  var nv = elm.split(":");
		  if(nv[1] != null)
			obj[nv[0].toLowerCase()] = nv[1].replace(/^\s+/, "").replace(/\s+$/, "");
		  });

		var responseXML = null;

		if(opts.dataType == "xml")
		  responseXML = new DOMParser().parseFromString(xhr.responseText, "text/xml");

		return {
		  responseText: xhr.responseText,
		  responseXML: responseXML,
		  status: xhr.status,

		  getAllResponseHeaders: function() {
			return xhr.responseHeaders;
			},

		  getResponseHeader: function(name) {
			return obj[name.toLowerCase()];
			}
		  };
		}

	  function nop() {
		}

	  // Entry point
	  opts = addProp({
		type: "GET",
		async: true,
		success: nop,
		error: nop,
		complete: nop
		}, opts);

	  if(typeof GM_xmlhttpRequest === "undefined") {
		setTimeout(function() {
		  var xhr = {};
		  opts.error(xhr, "error");
		  opts.complete(xhr);
		  }, 0);
		return;
		}

	  GM_xmlhttpRequest({
		method: opts.type,
		url: opts.url,
		synchronous: !opts.async,

		onload: function(xhr) {
		  xhr = wrapXhr(xhr);

		  if(xhr.status >= 100 && xhr.status < 300)
			opts.success(xhr.responseXML || xhr.responseText, "success", xhr);
		  else
			opts.error(xhr, "error");

		  opts.complete(xhr);
		  },

		onerror: function(xhr) {
		  xhr = wrapXhr(xhr);
		  opts.error(xhr, "error");
		  opts.complete(xhr);
		  }
		});
	  };

	dom.addEvent = function(e, type, fn) {
	  function mouseEvent(event) {
		if(this != event.relatedTarget && !dom.isAChildOf(this, event.relatedTarget))
		  fn.call(this, event);
		}

	  // Entry point
	  if(e.addEventListener) {
		var effFn = fn;

		if(type == "mouseenter") {
		  type = "mouseover";
		  effFn = mouseEvent;
		  }
		else if(type == "mouseleave") {
		  type = "mouseout";
		  effFn = mouseEvent;
		  }

		e.addEventListener(type, effFn, /*capturePhase*/ false);
		}
	  else
		e.attachEvent("on" + type, function() { fn(win.event); });
	  };

	dom.insertCss = function (styles) {
	  var ss = dom.cE("style");
	  dom.attr(ss, "type", "text/css");

	  var hh = dom.gT("head") [0];
	  dom.append(hh, ss);
	  dom.append(ss, dom.cT(styles));
	  };

	dom.isAChildOf = function(parent, child) {
	  if(parent === child)
		return false;

	  while(child && child !== parent) {
		child = child.parentNode;
		}

	  return child === parent;
	  };

	// -----------------------------------------------------------------------------

	function timeNowInSec() {
	  return Math.round(+new Date() / 1000);
	  }

	function forLoop(opts, fn) {
	  opts = addProp({ start: 0, inc: 1 }, opts);

	  for(var idx = opts.start; idx < opts.num; idx += opts.inc) {
		if(fn.call(opts, idx, opts) === false)
		  break;
		}
	  }

	function forEach(list, fn) {
	  forLoop({ num: list.length }, function(idx) {
		return fn.call(list[idx], idx, list[idx]);
		});
	  }

	function addProp(dest, src) {
	  for(var k in src) {
		if(src[k] != null)
		  dest[k] = src[k];
		}

	  return dest;
	  }

	function inArray(elm, array) {
	  for(var i = 0; i < array.length; ++i) {
		if(array[i] === elm)
		  return i;
		}

	  return -1;
	  }

	function unescHtmlEntities(s) {
	  return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
	  }

	function logMsg(s) {
	  win.console.log(s);
	  }

	function cnvSafeFname(s) {
	  s = s.replace(/:/g, "-").replace(/"/g, "'").replace(/[\\/|*?]/g, "_");
	  return encodeURIComponent(s).replace(/'/g, "%27");
	  }

	function getVideoName(s) {
	  var list = [
		{ name: "MOB", codec: "video/3gpp" },
            { name: "FLV", codec: "video/x-flv" },
            { name: "M4V", codec: "video/x-m4v" },
            { name: "MP3", codec: "audio/mpeg" },
            { name: "MP4", codec: "video/mp4" },
            { name: "M4A", codec: "audio/mp4" },
            { name: "QT", codec: "video/quicktime" },
            { name: "WEB", codec: "audio/webm" },
            { name: "WEB", codec: "video/webm" },
            { name: "WMV", codec: "video/ms-wmv" }
		];

	  var name = "?";

	  forEach(list, function(idx, elm) {
		if(s.match("^" + elm.codec)) {
		  name = elm.name;
		  return false;
		  }
		});

	  return name;
	  }

	function snapToStdRes(res) {
        var horzResList = [ 3840, 2048, 1440, 960, 640, 480 ];
        var horzWideResList = [ 2880, 1920, 1280, 854, 640 ];
        var vertResList = [ 2160, 1536, 1080, 720, 480, 360 ];

	  if(!res.match(/^(\d+)x(\d+)/))
		return res;

	  var wd = +RegExp.$1;
	  var ht = +RegExp.$2;
	  var foundIdx;

	  // Snap to the nearest vert res first
	  forEach(vertResList, function(idx, elm) {
		var tolerance = elm * 0.1;
		if(ht >= elm - tolerance && ht <= elm + tolerance) {
		  foundIdx = idx;
		  return false;
		  }
		});

	  if(!foundIdx)
		return res;

	  var aspectRatio = wd >= ht ? wd / ht : ht / wd;

	  ht = vertResList[foundIdx];
	  wd = Math.round(ht * aspectRatio);

	  // Snap to the nearest horz res
	  forEach(aspectRatio < 1536 ? horzResList : horzWideResList, function(idx, elm) {
		var tolerance = elm * 0.1;
		if(wd >= elm - tolerance && wd <= elm + tolerance) {
		  wd = elm;
		  return false;
		  }
		});

	  return wd + "x" + ht;
	  }

	function cnvResName(res) {
	  var resMap = {
		"audio": "Audio"
		};

	  if(resMap[res])
		return resMap[res];

	  if(!res.match(/^(\d+)x(\d+)/))
		return res;

	  var wd = +RegExp.$1;
	  var ht = +RegExp.$2;

	  var vertResMap = {

		};

	  if(vertResMap[ht])
		return vertResMap[ht];

	  var aspectRatio = wd >= ht ? wd / ht : ht / wd;

	  return String(ht) + (aspectRatio < 1.5 ? " " : " ");
	  }

	function mapResToQuality(res) {
	  if(!res.match(/^[0-9]+x([0-9]+)$/))
		return res;

	  var resList = [
 { res: 2160, q : "2160" },
            { res: 1536, q : "1536" },
            { res: 1080, q : "1080" },
            { res: 720, q : "720" },
            { res: 480, q : "480" },
            { res: 360, q : "360" }
		];

	  var res = +RegExp.$1;

	  for(var i = 0; i < resList.length; ++i) {
		if(res >= resList[i].res)
		  return resList[i].q;
		}

	  return "small";
	  }

	function getQualityIdx(quality) {
	  var list = [ "small", "360", "480", "720", "1080", "1536", "2160" ];

	  for(var i = 0; i < list.length; ++i) {
		if(list[i] == quality)
		  return i;
		}

	  return -1;
	  }

	// =============================================================================

	RegExp.escape = function(s) {
	  return String(s).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	  };

	var decryptSig = {
	  store: {}
	  };

	(function () {

	var SIG_STORE_ID = "ujsYtLinksSig";

	var CHK_SIG_INTERVAL = 3 * 86400;

	decryptSig.load = function() {
	  var obj = localStorage[SIG_STORE_ID];
	  if(obj == null)
		return;

	  decryptSig.store = JSON.parse(obj);
	  };

	decryptSig.save = function() {
	  localStorage[SIG_STORE_ID] = JSON.stringify(decryptSig.store);
	  };

	decryptSig.extractScriptUrl = function(data) {
	  if(data.match(/ytplayer.config\s*=.*\"assets"\s*:\s*{.*"js"\s*:\s*(".+?")/))
		return JSON.parse(RegExp.$1);
	  else
		return false;
	  };

	decryptSig.getScriptName = function(url) {
	  if(url.match(/\/yts\/jsbin\/html5player-(.*)\/html5player\.js$/))
		return RegExp.$1;

	  if(url.match(/\/html5player-(.*)\.js$/))
		return RegExp.$1;

	  return url;
	  };

	decryptSig.fetchScript = function(scriptName, url) {
	  function success(data) {
		if(!data.match(/\.signature\s*=\s*(\w+)\(\w+\)/) && !data.match(/\.set\(\"signature\",(\w+)\(\w+\)\)/) )
		  return;

		//console.log(scriptName + " sig fn: " + RegExp.$1);

		if(!data.match(new RegExp("function " + RegExp.$1 + '\\s*\\((\\w+)\\)\\s*{(\\w+=\\w+\\.split\\(""\\);.+?;return \\w+\\.join\\(""\\))')))
		  return;

		var fnParam = RegExp.$1;
		var fnBody = RegExp.$2;

		var fnHlp = {};
		var objHlp = {};

		//console.log("param: " + fnParam);
		//console.log(fnBody);

		fnBody = fnBody.split(";");

		forEach(fnBody, function(idx, elm) {
		  // its own property
		  if(elm.match(new RegExp("^" + fnParam + "=" + fnParam + "\\.")))
			return;

		  // global fn
		  if(elm.match(new RegExp("^" + fnParam + "=([a-zA-Z_$][a-zA-Z0-9_$]*)\\("))) {
			var name = RegExp.$1;
			//console.log("fnHlp: " + name);

			if(fnHlp[name])
			  return;

			if(data.match(new RegExp("(function " + RegExp.escape(RegExp.$1) + ".+?;return \\w+})")))
			  fnHlp[name] = RegExp.$1;

			return;
			}

		  // object fn
		  if(elm.match(new RegExp("^([a-zA-Z_$][a-zA-Z0-9_$]*)\.([a-zA-Z_$][a-zA-Z0-9_$]*)\\("))) {
			var name = RegExp.$1;
			//console.log("objHlp: " + name);

			if(objHlp[name])
			  return;

			if(data.match(new RegExp("(var " + RegExp.escape(RegExp.$1) + "={.+?};)")))
			  objHlp[name] = RegExp.$1;

			return;
			}
		  });

		//console.log(fnHlp);
		//console.log(objHlp);

		var fnHlpStr = "";

		for(var k in fnHlp)
		  fnHlpStr += fnHlp[k];

		for(var k in objHlp)
		  fnHlpStr += objHlp[k];

		var fullFn = "function(" + fnParam + "){" + fnHlpStr + fnBody.join(";") + "}";
		//console.log(fullFn);

		decryptSig.store[scriptName] = { ver: relInfo.ver, ts: timeNowInSec(), fn: fullFn };
		//console.log(decryptSig);

		decryptSig.save();
		}

	  // Entry point
	  dom.crossAjax({ url: url, success: success });
	  };

	decryptSig.condFetchScript = function(url) {
	  var scriptName = decryptSig.getScriptName(url);
	  var store = decryptSig.store[scriptName];
	  var now = timeNowInSec();

	  if(store && now - store.ts < CHK_SIG_INTERVAL && store.ver == relInfo.ver)
		return;

	  decryptSig.fetchScript(scriptName, url);
	  };

	}) ();

	function deobfuscateVideoSig(scriptName, sig) {
	  if(!decryptSig.store[scriptName])
		return sig;

	  //console.log(decryptSig.store[scriptName].fn);

	  try {
		sig = eval("(" + decryptSig.store[scriptName].fn + ") (\"" + sig + "\")");
	  } catch(e) {
		}

	  return sig;
	  }

	// =============================================================================

	function parseStreamMap(map, value) {
	  var fmtUrlList = [];

	  forEach(value.split(","), function(idx, elm) {
		var elms = elm.replace(/\\\//g, "/").replace(/\\u0026/g, "&").split("&");
		var obj = {};

		forEach(elms, function(idx, elm) {
		  var kv = elm.split("=");
		  obj[kv[0]] = decodeURIComponent(kv[1]);
		  });

		obj.itag = +obj.itag;

		if(obj.conn != null && obj.conn.match(/^rtmpe:\/\//))
		  obj.isDrm = true;

		if(obj.s != null && obj.sig == null) {
		  var sig = deobfuscateVideoSig(map.scriptName, obj.s);
		  if(sig != obj.s) {
			obj.sig = sig;
			delete obj.s;
			}
		  }

		fmtUrlList.push(obj);
		});

	  //logMsg(fmtUrlList);

	  map.fmtUrlList = fmtUrlList;
	  }

	function parseAdaptiveStreamMap(map, value) {
	  var fmtUrlList = [];

	  forEach(value.split(","), function(idx, elm) {
		var elms = elm.replace(/\\\//g, "/").replace(/\\u0026/g, "&").split("&");
		var obj = {};

		forEach(elms, function(idx, elm) {
		  var kv = elm.split("=");
		  obj[kv[0]] = decodeURIComponent(kv[1]);
		  });

		obj.itag = +obj.itag;

		if(obj.bitrate != null)
		  obj.bitrate = +obj.bitrate;

		if(obj.clen != null)
		  obj.clen = +obj.clen;

		if(obj.fps != null)
		  obj.fps = +obj.fps;

		//logMsg(obj);
		//logMsg(map.videoId + ": " + obj.index + " " + obj.init + " " + obj.itag + " " + obj.size + " " + obj.bitrate + " " + obj.type);

		if(obj.type.match(/^video\/mp4/))
		  obj.effType = "video/x-m4v";

		if(obj.type.match(/^audio\//))
		  obj.size = "audio";

		var stdRes = snapToStdRes(obj.size);
		obj.quality = mapResToQuality(stdRes);

		if(obj.s != null && obj.sig == null) {
		  var sig = deobfuscateVideoSig(map.scriptName, obj.s);
		  if(sig != obj.s) {
			obj.sig = sig;
			delete obj.s;
			}
		  }

		fmtUrlList.push(obj);

		map.fmtMap[obj.itag] = { res: cnvResName(stdRes) };
		});

	  map.fmtUrlList = map.fmtUrlList.concat(fmtUrlList);
	  }

	function parseFmtList(map, value) {
	  var list = value.split(",");
	  var fmtMap = {};

	  forEach(list, function(idx, elm) {
		var elms = elm.replace(/\\\//g, "/").split("/");

		var fmtId = elms[0];
		var res = elms[1];
		elms.splice(/*idx*/ 0, /*rm*/ 2);

		fmtMap[fmtId] = { res: cnvResName(res), vars: elms };
		});

	  map.fmtMap = fmtMap;
	  }

	function getExt(elm) {
	  return "";
	  }

	function getVideoInfo(url, callback) {
	  function success(data) {
		var map = {};

		if(data.match(/<div\s+id="verify-details">/)) {
		  logMsg("Skipping " + url);
		  return;
		  }

		if(data.match(/<h1\s+id="unavailable-message">/)) {
		  logMsg("Not avail " + url);
		  return;
		  }

		if(data.match(/"t":\s?"(.+?)"/))
		  map.t = RegExp.$1;

		if(data.match(/"video_id":\s?"(.+?)"/))
		  map.videoId = RegExp.$1;

		map.scriptUrl = decryptSig.extractScriptUrl(data);
		if(map.scriptUrl) {
		  //logMsg(map.videoId + " script: " + map.scriptUrl);
		  map.scriptName = decryptSig.getScriptName(map.scriptUrl);
		  decryptSig.condFetchScript(map.scriptUrl);
		  }

		if(data.match(/<meta\s+itemprop="name"\s*content="(.+)"\s*>\s*\n/))
		  map.title = unescHtmlEntities(RegExp.$1);

		if(map.title == null && data.match(/<meta\s+name="title"\s*content="(.+)"\s*>/))
		  map.title = unescHtmlEntities(RegExp.$1);

		if(data.match(/"url_encoded_fmt_stream_map":\s?"(.+?)"/))
		  parseStreamMap(map, RegExp.$1);

		if(data.match(/"fmt_list":\s?"(.+?)"/))
		  parseFmtList(map, RegExp.$1);

		if(data.match(/"adaptive_fmts":\s?"(.+?)"/))
		  parseAdaptiveStreamMap(map, RegExp.$1);

		if(data.match(/"dashmpd":\s?"(.+?)"/))
		  map.dashmpd = decodeURIComponent(RegExp.$1.replace(/\\\//g, "/"));

		if(userConfig.filteredFormats.length > 0) {
		  for(var i = 0; i < map.fmtUrlList.length; ++i) {
			if(inArray(getVideoName(map.fmtUrlList[i].effType || map.fmtUrlList[i].type), userConfig.filteredFormats) >= 0) {
			  map.fmtUrlList.splice(i, /*len*/ 1);
			  --i;
			  continue;
			  }
			}
		  }

		var hasHighRes = false;
		var hasHighAudio = false;
		var HIGH_AUDIO_BPS = 96 * 1024;

		forEach(map.fmtUrlList, function(idx, elm) {
		  hasHighRes |= elm.quality == "720" || elm.quality == "1080";

		  if(elm.quality == "audio")
			hasHighAudio |= elm.bitrate >= HIGH_AUDIO_BPS;
		  });

		if(hasHighRes) {
		  for(var i = 0; i < map.fmtUrlList.length; ++i) {
			if(map.fmtUrlList[i].quality == "small") {
			  map.fmtUrlList.splice(i, /*len*/ 1);
			  --i;
			  continue;
			  }
			}
		  }

		if(hasHighAudio) {
		  for(var i = 0; i < map.fmtUrlList.length; ++i) {
			if(map.fmtUrlList[i].quality == "audio" && map.fmtUrlList[i].bitrate < HIGH_AUDIO_BPS) {
			  map.fmtUrlList.splice(i, /*len*/ 1);
			  --i;
			  continue;
			  }
			}
		  }

		map.fmtUrlList.sort(cmpUrlList);

		callback(map);
		}

	  // Entry point
	  dom.ajax({ url: url, success: success });
	  }

	function cmpUrlList(a, b) {
	  var diff = getQualityIdx(b.quality) - getQualityIdx(a.quality);
	  if(diff != 0)
		return diff;

	  var aRes = (a.size || "").match(/^(\d+)x(\d+)/);
	  var bRes = (b.size || "").match(/^(\d+)x(\d+)/);

	  if(aRes == null) aRes = [ 0, 0, 0 ];
	  if(bRes == null) bRes = [ 0, 0, 0 ];

	  return +bRes[2] - +aRes[2];
	  }

	// -----------------------------------------------------------------------------

var CSS_PREFIX = "ujs-";
    
    var HDR_LINKS_HTML_ID = CSS_PREFIX + "hdr-links-div";
    var LINKS_HTML_ID = CSS_PREFIX + "links-cls";
    var LINKS_TP_HTML_ID = CSS_PREFIX + "links-tp-div";
    var UPDATE_HTML_ID = CSS_PREFIX + "update-div";
    var VID_FMT_BTN_ID = CSS_PREFIX + "vid-fmt-btn";
    
    /* The !important attr is to override the page's specificity. */
    var CSS_STYLES =
        "#" + VID_FMT_BTN_ID + dom.emitCssStyles({
            "margin": "0 0.333em"
        }) + "\n" +
        "#" + UPDATE_HTML_ID + dom.emitCssStyles({
            "background-color": "#f00",
            "border-radius": "2px",
            "color": "#fff",
            "padding": "5px",
            "text-align": "center",
            "text-decoration": "none",
            "position": "fixed",
            "top": "0.5em",
            "right": "5em",
            "z-index": "100"
        }) + "\n" +
        "#" + UPDATE_HTML_ID + ":hover" + dom.emitCssStyles({
            "background-color": "#0d0"
        }) + "\n" +
        "#" + HDR_LINKS_HTML_ID + dom.emitCssStyles({
            "font-size": "100%",
        }) + "\n" +
        "#" + HDR_LINKS_HTML_ID + " ." + CSS_PREFIX + "group" + dom.emitCssStyles({
            "background-color": "#fff",
            "color": "#000 !important",
            "border": "#ccc 1px solid",
            "border-radius": "3px",
            "display": "inline-block",
            "margin": "3px",
        }) + "\n" +
        "#" + HDR_LINKS_HTML_ID + " a" + dom.emitCssStyles({
            "display": "table-cell",
            "padding": "3px",
            "text-decoration": "none"
        }) + "\n" +
        "#" + HDR_LINKS_HTML_ID + " a:hover" + dom.emitCssStyles({
            "background-color": "#d1e1fa"
        }) + "\n" +
        "div." + LINKS_HTML_ID + dom.emitCssStyles({
            "border-radius": "3px",
            "font-size": "80%",
            "position": "absolute",
            "left": "0",
            "top": "0.2em",
            "z-index": "100"
        }) + "\n" +
        "#" + LINKS_TP_HTML_ID + dom.emitCssStyles({
            "background-color": "#eee",
            "border": "#aaa 1px solid",
            "padding": "3px 0",
            "text-decoration": "none",
            "white-space": "nowrap",
            "z-index": "100"
        }) + "\n" +
        "div." + LINKS_HTML_ID + " a" + dom.emitCssStyles({
            "display": "inline-block",
            "margin": "1px",
            "text-decoration": "none"
        }) + "\n" +
        "div." + LINKS_HTML_ID + " ." + CSS_PREFIX + "video" + dom.emitCssStyles({
            "display": "inline-block",
            "text-align": "center",
            "width": "3em"
        }) + "\n" +
        "div." + LINKS_HTML_ID + " ." + CSS_PREFIX + "quality" + dom.emitCssStyles({
            "display": "inline-block",
            "text-align": "center",
            "width": "3em"
        }) + "\n" +
        "." + CSS_PREFIX + "video" + dom.emitCssStyles({
            "color": "#fff !important",
            "padding": "2.5px 10px",
            "text-align": "center"
        }) + "\n" +
        "." + CSS_PREFIX + "quality" + dom.emitCssStyles({
            "color": "#000 !important",
            "padding": "4px 3px",
            "vertical-align": "middle"
        }) + "\n" +
        "." + CSS_PREFIX + "filesize" + dom.emitCssStyles({
            "font-size": "90%",
            "margin-top": "2px",
            "padding": "1px 3px",
            "text-align": "center"
        }) + "\n" +
        "." + CSS_PREFIX + "filesize-err" + dom.emitCssStyles({
            "color": "#f00",
            "font-size": "90%",
            "margin-top": "2px",
            "padding": "1px 3px",
            "text-align": "center"
        }) + "\n" +
        "." + CSS_PREFIX + "not-avail" + dom.emitCssStyles({
            "background-color": "#700",
            "color": "#fff",
            "padding": "3px",
        }) + "\n" +
        "." + CSS_PREFIX + "mob" + dom.emitCssStyles({
            "background-color": "#956D03"
        }) + "\n" +
        "." + CSS_PREFIX + "flv" + dom.emitCssStyles({
            "background-color": "#0dd"
        }) + "\n" +
        "." + CSS_PREFIX + "m4a" + dom.emitCssStyles({
            "background-color": "#07e"
        }) + "\n" +
        "." + CSS_PREFIX + "m4v" + dom.emitCssStyles({
            "background-color": "#07e"
        }) + "\n" +
        "." + CSS_PREFIX + "mp3" + dom.emitCssStyles({
            "background-color": "#7ba"
        }) + "\n" +
        "." + CSS_PREFIX + "mp4" + dom.emitCssStyles({
            "background-color": "#777"
        }) + "\n" +
        "." + CSS_PREFIX + "qt" + dom.emitCssStyles({
            "background-color": "#f08"
        }) + "\n" +
        "." + CSS_PREFIX + "web" + dom.emitCssStyles({
            "background-color": "#e0e"
        }) + "\n" +
        "." + CSS_PREFIX + "wmv" + dom.emitCssStyles({
            "background-color": "#c75"
        }) + "\n" +
        "." + CSS_PREFIX + "small" + dom.emitCssStyles({
            "color": "#888 !important",
        }) + "\n" +
        "." + CSS_PREFIX + "360" + dom.emitCssStyles({
            "color": "#fff !important",
            "background-color": "#0d0"
        }) + "\n" +
        "." + CSS_PREFIX + "480" + dom.emitCssStyles({
            "color": "#fff !important",
            "background-color": "#00d",
            "background-image": "linear-gradient(to right, #00d, #00a)"
        }) + "\n" +
        "." + CSS_PREFIX + "720" + dom.emitCssStyles({
            "color": "#fff !important",
            "background-color": "#f90",
            "background-image": "linear-gradient(to right, #f90, #d70)"
        }) + "\n" +
        "." + CSS_PREFIX + "1080" + dom.emitCssStyles({
            "color": "#fff !important",
            "background-color": "#f00",
            "background-image": "linear-gradient(to right, #f00, #c00)"
        }) + "\n" +
        "." + CSS_PREFIX + "1536" + dom.emitCssStyles({
            "color": "#fff !important",
            "background-color": "#c0f",
        }) + "\n" +
        "." + CSS_PREFIX + "2160" + dom.emitCssStyles({
            "color": "#fff !important",
            "background-color": "#000",
        }) + "\n" +
        "." + CSS_PREFIX + "audio" + dom.emitCssStyles({
            "color": "#fff !important",
            "background-color": "#909600",
        }) + "\n" +
        "." + CSS_PREFIX + "pos-rel" + dom.emitCssStyles({
            "position": "relative"
        }) + "\n" +
        "";

	function condInsertHdr(divId) {
	  if(dom.gE(HDR_LINKS_HTML_ID))
		return true;

	  var insertPtNode = dom.gE(divId);
	  if(!insertPtNode)
		return false;

	  var divNode = dom.cE("div");
	  divNode.id = HDR_LINKS_HTML_ID;

	  insertPtNode.parentNode.insertBefore(divNode, insertPtNode);
	  return true;
	  }

	function condInsertTooltip() {
	  if(dom.gE(LINKS_TP_HTML_ID))
		return true;

	  var toolTipNode = dom.cE("div");
	  toolTipNode.id = LINKS_TP_HTML_ID;

	  dom.attr(toolTipNode, "class", LINKS_HTML_ID);
	  dom.attr(toolTipNode, "style", "display: none;");

	  dom.append(doc.body, toolTipNode);

	  dom.addEvent(toolTipNode, "mouseleave", function(event) {
		//logMsg("mouse leave");
		dom.attr(toolTipNode, "style", "display: none;");
		});
	  }

	function condInsertUpdateIcon() {
	  if(dom.gE(UPDATE_HTML_ID))
		return;

	  var divNode = dom.cE("a");
	  divNode.id = UPDATE_HTML_ID;
	  dom.append(doc.body, divNode);
	  }

	// -----------------------------------------------------------------------------

	var STORE_ID = "ujsYtLinks";
	var JSONP_ID = "ujsYtLinks";

	var userConfig = {
	  filteredFormats: [],
	  showVideoFormats: true,
	  showVideoSize: true,
	  tagLinks: true
	  };

	var videoInfoCache = {};

	var TAG_LINK_NUM_PER_BATCH = 5;
	var INI_TAG_LINK_DELAY_MS = 100;
	var SUB_TAG_LINK_DELAY_MS = 150;

	// -----------------------------------------------------------------------------

	function Links() {
	  }

	Links.prototype.init = function() {
	  };

	Links.prototype.getPreferredFmt = function(map) {
	  var selElm = map.fmtUrlList[0];

	  forEach(map.fmtUrlList, function(idx, elm) {
		if(getVideoName(elm.type).toLowerCase() != "webm") {
		  selElm = elm;
		  return false;
		  }
		});

	  return selElm;
	  };

	Links.prototype.parseDashManifest = function(map) {
	  function parse(xml) {
		//logMsg(xml);

		var dashList = [];

		var adaptationSetDom = xml.getElementsByTagName("AdaptationSet");
		//logMsg(adaptationSetDom);

		forEach(adaptationSetDom, function(i, adaptationElm) {
		  var mimeType = adaptationElm.getAttribute("mimeType");
		  //logMsg(i + " " + mimeType);

		  var representationDom = adaptationElm.getElementsByTagName("Representation");
		  forEach(representationDom, function(j, repElm) {
			var dashElm = { mimeType: mimeType };

			forEach([ "codecs" ], function(idx, elm) {
			  var v = repElm.getAttribute(elm);
			  if(v != null)
				dashElm[elm] = v;
			  });

			forEach([ "audioSamplingRate", "bandwidth", "frameRate", "height", "id", "width" ], function(idx, elm) {
			  var v = repElm.getAttribute(elm);
			  if(v != null)
				dashElm[elm] = +v;
			  });

			var baseUrlDom = repElm.getElementsByTagName("BaseURL");
			dashElm.len = +baseUrlDom[0].getAttribute("yt:contentLength");
			dashElm.url = baseUrlDom[0].textContent;

			dashList.push(dashElm);
			});
		  });

		//logMsg(map);
		//logMsg(dashList);

		var maxBitRateMap = {};

		forEach(dashList, function(idx, dashElm) {
		  if(dashElm.mimeType != "video/mp4" && dashElm.mimeType != "video/webm")
			return;

		  var id = [ dashElm.mimeType, dashElm.width, dashElm.height, dashElm.frameRate ].join("|");

		  if(maxBitRateMap[id] == null || maxBitRateMap[id] < dashElm.bandwidth)
			maxBitRateMap[id] = dashElm.bandwidth;
		  });

		forEach(dashList, function(idx, dashElm) {
		  var foundIdx;

		  forEach(map.fmtUrlList, function(idx, mapElm) {
			if(dashElm.id == mapElm.itag) {
			  foundIdx = idx;
			  return false;
			  }
			});

		  if(foundIdx != null)
			return;

		  //logMsg(dashElm);

		  if((dashElm.mimeType == "video/mp4" || dashElm.mimeType == "video/webm") && (dashElm.width >= 1000 || dashElm.height >= 1000)) {
			var id = [ dashElm.mimeType, dashElm.width, dashElm.height, dashElm.frameRate ].join("|");

			if(maxBitRateMap[id] == null || dashElm.bandwidth < maxBitRateMap[id])
			  return;

			var size = dashElm.width + "x" + dashElm.height;
			var stdRes = snapToStdRes(size);

			if(map.fmtMap[dashElm.id] == null) {
			  map.fmtMap[dashElm.id] = { res: cnvResName(stdRes) };
			  }

			map.fmtUrlList.push({
			  bitrate: dashElm.bandwidth,
			  effType: dashElm.mimeType == "video/mp4" ? "video/x-m4v" : null,
			  filesize: dashElm.len,
			  fps: dashElm.frameRate,
			  itag: dashElm.id,
			  quality: mapResToQuality(stdRes),
			  size: size,
			  type: dashElm.mimeType + ";+codecs=\"" + dashElm.codecs + "\"",
			  url: dashElm.url
			  });
			}
		  else if(dashElm.mimeType == "audio/mp4" && dashElm.audioSamplingRate >= 44100) {
			if(map.fmtMap[dashElm.id] == null) {
			  map.fmtMap[dashElm.id] = { res: "Audio" };
			  }

			map.fmtUrlList.push({
			  bitrate: dashElm.bandwidth,
			  filesize: dashElm.len,
			  itag: dashElm.id,
			  quality: "audio",
			  type: dashElm.mimeType + ";+codecs=\"" + dashElm.codecs + "\"",
			  url: dashElm.url
			  });
			}
		  });

		if(condInsertHdr("page"))
		  dom.html(dom.gE(HDR_LINKS_HTML_ID), me.emitLinks(map));
		}

	  // Entry point
	  var me = this;

	  if(!map.dashmpd)
		return;

	  //logMsg(map.dashmpd);

	  if(map.dashmpd.match(/\/s\/([a-zA-Z0-9.]+)\//)) {
		var sig = deobfuscateVideoSig(map.scriptName, RegExp.$1);
		map.dashmpd = map.dashmpd.replace(/\/s\/[a-zA-Z0-9.]+\//, "/signature/" + sig + "/");
		}

	  dom.crossAjax({
		url: map.dashmpd,
		dataType: "xml",

		success: function(data, status, xhr) {
		  parse(data);
		  },

		error: function(xhr, status) {
		  },

		complete: function(xhr) {
		  }
		});
	  };

	Links.prototype.checkFmts = function(forceFlag) {
	  var me = this;

	  if(!userConfig.showVideoFormats)
		return;

	  if(!forceFlag && userConfig.showVideoFormats == "btn") {
		if(dom.gE(VID_FMT_BTN_ID))
		  return;

		var btn = dom.cE("button");
		dom.attr(btn, "id", VID_FMT_BTN_ID);
		dom.attr(btn, "class", "yt-uix-button yt-uix-button-default");
		btn.innerHTML = "VidFmts";

		var mastH = dom.gE("yt-masthead-signin") || dom.gE("yt-masthead-user");
		if(!mastH)
		  return;

		dom.prepend(mastH, btn);

		dom.addEvent(btn, "click", function(event) {
		  me.checkFmts(/*force*/ true);
		  });

		return;
		}

	  if(!loc.href.match(/watch\?v=([a-zA-Z0-9_-]*)/))
		return false;

	  var videoId = RegExp.$1;

	  var url = loc.protocol + "//" + loc.host + "/watch?v=" + videoId;

	  getVideoInfo(url, function(map) {
		me.parseDashManifest(map);
		me.showLinks("page", map);
		});
	  };

	Links.prototype.genUrl = function(map, elm) {
	  var url = elm.url + "&title=" + cnvSafeFname(map.title + getExt(elm));

	  if(elm.sig != null)
		url += "&signature=" + elm.sig;

	  return url;
	  };

	Links.prototype.emitLinks = function(map) {
	  function fmtSize(size, units) {
		if(!units)
		  units = [ "kB", "MB", "GB" ];

		for(var idx = 0; idx < units.length; ++idx) {
		  size /= 1024;

		  if(size < 10)
			return Math.round(size * 100) / 100 + units[idx];

		  if(size < 100)
			return Math.round(size * 10) / 10 + units[idx];

		  if(size < 1024 || idx == units.length - 1)
			return Math.round(size) + units[idx];
		  }
		}

	  function fmtBitrate(size) {
		return fmtSize(size, [ "kbps", "Mbps", "Gbps" ]);
		}

	  // Entry point
	  var me = this;
	  var s = [];

	  var resMap = {};

	  map.fmtUrlList.sort(cmpUrlList);

	  forEach(map.fmtUrlList, function(idx, elm) {
		var fmtMap = map.fmtMap[elm.itag];

		if(!resMap[fmtMap.res]) {
		  resMap[fmtMap.res] = [];
		  resMap[fmtMap.res].quality = elm.quality;
		  }

		resMap[fmtMap.res].push(elm);
		});

	  for(var res in resMap) {
		var qFields = [];

		qFields.push(dom.emitHtml("div", { "class": CSS_PREFIX + "quality " + CSS_PREFIX + resMap[res].quality }, res));

		forEach(resMap[res], function(idx, elm) {
		  var fields = [];
		  var fmtMap = map.fmtMap[elm.itag];
		  var videoName = getVideoName(elm.effType || elm.type);

		  var addMsg = [ elm.itag, elm.type, elm.size || elm.quality ];

		  if(elm.fps != null)
			addMsg.push(elm.fps + "fps");

		  var varMsg = "";

		  if(elm.bitrate != null)
			varMsg = fmtBitrate(elm.bitrate);
		  else if(fmtMap.vars != null)
			varMsg = fmtMap.vars.join();

		  addMsg.push(varMsg);

		  if(elm.s != null)
			addMsg.push("sig-" + elm.s.length);

		  if(elm.filesize != null && elm.filesize >= 0)
			addMsg.push(fmtSize(elm.filesize));

		  var vidSuffix = "";

		  if(inArray(elm.itag, [ 5, 17, 18, 22, 36, 43, 171, 141 ]) >= 0)
			vidSuffix = " * ";
		  else if(elm.fps != null && elm.fps >= 45)
			vidSuffix = " (6x)";

		  fields.push(dom.emitHtml("div", { "class": CSS_PREFIX + "video " + CSS_PREFIX + videoName.toLowerCase() }, videoName + vidSuffix));

		  if(elm.filesize != null) {
			if(elm.filesize >= 0) {
			  fields.push(dom.emitHtml("div", { "class": CSS_PREFIX + "filesize" }, fmtSize(elm.filesize)));
			  }
			else {
			  var msg;

			  if(elm.isDrm)
				msg = "DRM";
			  else if(elm.s != null)
				msg = "sig-" + elm.s.length;
			  else
				msg = "Err";

			  fields.push(dom.emitHtml("div", { "class": CSS_PREFIX + "filesize-err" }, msg));
			  }
			}

		  var url;

		  if(elm.isDrm)
			url = elm.conn + "?" + elm.stream;
		  else
			url = me.genUrl(map, elm);

		  var ahref = dom.emitHtml("a", {
			href: url,
			title: addMsg.join(" | ")
			}, fields.join(""));

		  qFields.push(ahref);
		  });

		s.push(dom.emitHtml("div", { "class": CSS_PREFIX + "group" }, qFields.join("")));
		}

	  return s.join("");
	  };

	var INI_SHOW_FILESIZE_DELAY_MS = 100;
	var SUB_SHOW_FILESIZE_DELAY_MS = 150;

	Links.prototype.showLinks = function(divId, map) {
	  function updateLinks() {
		//!! Hack to update file size
		if(condInsertHdr(divId))
		  dom.html(dom.gE(HDR_LINKS_HTML_ID), me.emitLinks(map));
		}

	  // Entry point
	  var me = this;

	  // video is not avail
	  if(!map.fmtUrlList)
		return;

	  //logMsg(JSON.stringify(map));

	  if(!condInsertHdr(divId))
		return;

	  dom.html(dom.gE(HDR_LINKS_HTML_ID), me.emitLinks(map));

	  if(!userConfig.showVideoSize)
		return;

	  forEach(map.fmtUrlList, function(idx, elm) {
		//logMsg(elm.itag + " " + elm.url);

		// We just fail outright for protected/obfuscated videos
		if(elm.isDrm || elm.s != null) {
		  elm.filesize = -1;
		  updateLinks();
		  return;
		  }

		if(elm.clen != null) {
		  elm.filesize = elm.clen;
		  updateLinks();
		  return;
		  }

		setTimeout(function() {
		  dom.crossAjax({
			type: "HEAD",
			url: me.genUrl(map, elm),

			success: function(data, status, xhr) {
			  var filesize = xhr.getResponseHeader("Content-Length");
			  if(filesize == null)
				return;

			  //logMsg(map.title + " " + elm.itag + ": " + filesize);
			  elm.filesize = +filesize;

			  updateLinks();
			  },

			error: function(xhr, status) {
			  //logMsg(map.fmtMap[elm.itag].res + " " + getVideoName(elm.type) + ": " + xhr.status);

			  if(xhr.status != 403)
				return;

			  elm.filesize = -1;

			  updateLinks();
			  },

			complete: function(xhr) {
			  //logMsg(map.title + ": " + xhr.getAllResponseHeaders());
			  }
			});
		   }, INI_SHOW_FILESIZE_DELAY_MS + idx * SUB_SHOW_FILESIZE_DELAY_MS);
		});
	  };

	Links.prototype.tagLinks = function() {
	  var SCANNED = 1;
	  var REQ_INFO = 2;
	  var ADDED_INFO = 3;

	  function prepareTagHtml(node, map) {
		var elm = me.getPreferredFmt(map);
		var fmtMap = map.fmtMap[elm.itag];

		dom.attr(node, "class", LINKS_HTML_ID + " " + CSS_PREFIX + "quality " + CSS_PREFIX + elm.quality);

		dom.addEvent(node, "mouseenter", function(event) {
		  //logMsg("mouse enter " + map.videoId);
		  var pos = dom.offset(node);
		  //logMsg("mouse enter: x " + pos.left + ", y " + pos.top);

		  var toolTipNode = dom.gE(LINKS_TP_HTML_ID);

		  dom.attr(toolTipNode, "style", "position: absolute; left: " + pos.left + "px; top: " + pos.top + "px");

		  dom.html(toolTipNode, me.emitLinks(map));
		  });

		node.href = elm.url + "&title=" + cnvSafeFname(map.title + getExt(elm));

		return fmtMap.res;
		}

	  function addTag(hNode, map) {
		//logMsg(dom.html(hNode));
		//logMsg("hNode " + dom.attr(hNode, "class"));
		//var img = dom.gT(hNode, "img") [0];
		//logMsg(dom.attr(img, "src"));
		//logMsg(dom.attr(img, "class"));

		dom.attr(hNode, CSS_PREFIX + "processed", ADDED_INFO);

		var node = dom.cE("div");

		if(map.fmtUrlList) {
		  tagHtml = prepareTagHtml(node, map);
		  }
		else {
		  dom.attr(node, "class", LINKS_HTML_ID + " " + CSS_PREFIX + "not-avail");
		  tagHtml = "NA";
		  }

		var parentNode;
		var insNode;

		var cls = dom.attr(hNode, "class") || "";
		var isVideoWallStill = cls.match(/videowall-still/);
		if(isVideoWallStill) {
		  parentNode = hNode;
		  insNode = hNode.firstChild;
		  }
		else {
		  parentNode = hNode.parentNode;
		  insNode = hNode;
		  }

		var parentCssPositionStyle = window.getComputedStyle(parentNode, null).getPropertyValue("position");

		if(parentCssPositionStyle != "absolute" && parentCssPositionStyle != "relative")
		  dom.attr(parentNode, "class", dom.attr(parentNode, "class") + " " + CSS_PREFIX + "pos-rel");

		parentNode.insertBefore(node, insNode);

		dom.html(node, tagHtml);
		}

	  function getFmt(videoId, hNode) {
		if(videoInfoCache[videoId]) {
		  addTag(hNode, videoInfoCache[videoId]);
		  return;
		  }

		var url;

		if(videoId.match(/.+==$/))
		  url = loc.protocol + "//" + loc.host + "/cthru?key=" + videoId;
		else
		  url = loc.protocol + "//" + loc.host + "/watch?v=" + videoId;

		getVideoInfo(url, function(map) {
		  videoInfoCache[videoId] = map;
		  addTag(hNode, map);
		  });
		}

	  // Entry point
	  var me = this;

	  var list = [];

	  forEach(dom.gT("a"), function(idx, hNode) {
		if(dom.attr(hNode, CSS_PREFIX + "processed"))
		  return;

		if(!dom.inViewport(hNode))
		  return;

		dom.attr(hNode, CSS_PREFIX + "processed", SCANNED);

		if(!hNode.href.match(/watch\?v=([a-zA-Z0-9_-]*)/) &&
		 !hNode.href.match(/watch_videos.+?&video_ids=([a-zA-Z0-9_-]*)/))
		  return;

		var videoId = RegExp.$1;

		var cls = dom.attr(hNode, "class") || "";
		if(!cls.match(/videowall-still/)) {
		  if(cls == "yt-button" || cls.match(/yt-uix-button/))
			return;

		  if(dom.attr(hNode.parentNode, "class") == "video-time")
			return;

		  if(dom.html(hNode).match(/video-logo/i))
			return;

		  var img = dom.gT(hNode, "img");
		  if(img == null || img.length == 0)
			return;

		  img = img[0];

		  var imgSrc = dom.attr(img, "src") || "";
		  if(imgSrc.indexOf("ytimg.com") < 0)
			return;

		  var tnSrc = dom.attr(img, "thumb") || "";

		  if(imgSrc.match(/.+?\/([a-zA-Z0-9_-]*)\/default\.jpg$/))
			videoId = RegExp.$1;
		  else if(tnSrc.match(/.+?\/([a-zA-Z0-9_-]*)\/default\.jpg$/))
			videoId = RegExp.$1;
		  }

		//logMsg(idx + " " + hNode.href);
		//logMsg("videoId: " + videoId);

		list.push({ videoId: videoId, hNode: hNode });

		dom.attr(hNode, CSS_PREFIX + "processed", REQ_INFO);
		});

	  forLoop({ num: list.length, inc: TAG_LINK_NUM_PER_BATCH, batchIdx: 0 }, function(idx) {
		var batchIdx = this.batchIdx++;
		var batchList = list.slice(idx, idx + TAG_LINK_NUM_PER_BATCH);

		setTimeout(function() {
		  forEach(batchList, function(idx, elm) {
			//logMsg(batchIdx + " " + idx + " " + elm.hNode.href);
			getFmt(elm.videoId, elm.hNode);
			});
		  }, INI_TAG_LINK_DELAY_MS + batchIdx * SUB_TAG_LINK_DELAY_MS);
		});
	  };

	Links.prototype.periodicTagLinks = function(delayMs) {
	  function poll() {
		me.tagLinks();
		me.tagLinksTimerId = setTimeout(poll, 3000);
		}

	  // Entry point
	  if(!userConfig.tagLinks)
		return;

	  var me = this;

	  delayMs = delayMs || 0;

	  if(me.tagLinksTimerId != null) {
		clearTimeout(me.tagLinksTimerId);
		delete me.tagLinksTimerId;
		}

	  setTimeout(poll, delayMs);
	  };

	// -----------------------------------------------------------------------------

	Links.prototype.loadSettings = function() {
	  var obj = localStorage[STORE_ID];
	  if(obj == null)
		return;

	  obj = JSON.parse(obj);

	  this.lastChkReqTs = +obj.lastChkReqTs;
	  this.lastChkTs = +obj.lastChkTs;
	  this.lastChkVer = +obj.lastChkVer;
	  };

	Links.prototype.storeSettings = function() {
	  localStorage[STORE_ID] = JSON.stringify({
		lastChkReqTs: this.lastChkReqTs,
		lastChkTs: this.lastChkTs,
		lastChkVer: this.lastChkVer
		});
	  };

	// -----------------------------------------------------------------------------

	var UPDATE_CHK_INTERVAL = 5 * 86400;
	var FAIL_TO_CHK_UPDATE_INTERVAL = 14 * 86400;

	Links.prototype.chkVer = function(forceFlag) {
	  if(this.lastChkVer > relInfo.ver) {
		this.showNewVer({ ver: this.lastChkVer });
		return;
		}

	  var now = timeNowInSec();

	  //logMsg("lastChkReqTs " + this.lastChkReqTs + ", diff " + (now - this.lastChkReqTs));
	  //logMsg("lastChkTs " + this.lastChkTs);
	  //logMsg("lastChkVer " + this.lastChkVer);

	  if(this.lastChkReqTs == null || now < this.lastChkReqTs) {
		this.lastChkReqTs = now;
		this.storeSettings();
		return;
		}

	  if(now - this.lastChkReqTs < UPDATE_CHK_INTERVAL)
		return;

	  if(this.lastChkReqTs - this.lastChkTs > FAIL_TO_CHK_UPDATE_INTERVAL)
		logMsg("Failed to check ver for " + ((this.lastChkReqTs - this.lastChkTs) / 86400) + " days");

	  this.lastChkReqTs = now;
	  this.storeSettings();

	  unsafeWin[JSONP_ID] = this;

	  var script = dom.cE("script");
	  script.type = "text/javascript";
	  script.src  = SCRIPT_UPDATE_LINK;
	  dom.append(doc.body, script);
	  };

	Links.prototype.chkVerCallback = function(data) {
	  delete unsafeWin[JSONP_ID];

	  this.lastChkTs = timeNowInSec();
	  this.storeSettings();

	  //logMsg(JSON.stringify(data));

	  var latestElm = data[0];

	  if(latestElm.ver <= relInfo.ver)
		return;

	  this.showNewVer(latestElm);
	  };

	Links.prototype.showNewVer = function(latestElm) {
	  function getVerStr(ver) {
		var verStr = "" + ver;

		var majorV = verStr.substr(0, verStr.length - 4) || "0";
		var minorV = verStr.substr(verStr.length - 4, 2);
		return majorV + "." + minorV;
		}

	  // Entry point
	  this.lastChkVer = latestElm.ver;
	  this.storeSettings();

	  condInsertUpdateIcon();

	  var aNode = dom.gE(UPDATE_HTML_ID);

	  aNode.href = SCRIPT_LINK;

	  if(latestElm.desc != null)
		dom.attr(aNode, "title", latestElm.desc);

	  dom.html(aNode, dom.emitHtml("b", SCRIPT_NAME + " " + getVerStr(relInfo.ver)) +
	   "<br>Click to update to " + getVerStr(latestElm.ver));
	  };

	// -----------------------------------------------------------------------------

	var inst = new Links();

	inst.init();
	inst.loadSettings();
	decryptSig.load();

	dom.insertCss(CSS_STYLES);

	condInsertTooltip();

	if(loc.pathname.match(/\/watch/)) {
	  inst.checkFmts();
	  }

	inst.periodicTagLinks();

	var scrollTop = win.pageYOffset || doc.documentElement.scrollTop;

	dom.addEvent(win, "scroll", function(e) {
	  var newScrollTop = win.pageYOffset || doc.documentElement.scrollTop;

	  if(Math.abs(newScrollTop - scrollTop) < 100)
		return;

	  //logMsg("scroll by " + (newScrollTop - scrollTop));

	  scrollTop = newScrollTop;

	  inst.periodicTagLinks(200);
	  });

	inst.chkVer();

	// -----------------------------------------------------------------------------

	/* YouTube reuses the current page when the user clicks on a new video. We need
	 to detect it and reload the formats. */

	(function() {

	var PERIODIC_CHK_VIDEO_URL_MS = 100;

	var curVideoUrl = loc.toString();

	function periodicChkVideoUrl() {
	  var newVideoUrl = loc.toString();

	  if(curVideoUrl != newVideoUrl) {
		//logMsg(curVideoUrl + " -> " + newVideoUrl);

		curVideoUrl = newVideoUrl;

		if(loc.pathname.match(/\/watch/))
		  inst.checkFmts();
		}

	  setTimeout(periodicChkVideoUrl, PERIODIC_CHK_VIDEO_URL_MS);
	  }

	periodicChkVideoUrl();

	}) ();

	// -----------------------------------------------------------------------------

	}) ();
