// ==UserScript==
// @run-at           document-start
// @name             GlobalJS
// @description      My GlobalJS
// @version          0.0
// @include          *
// @namespace https://greasyfork.org/users/5192
// @downloadURL https://update.greasyfork.org/scripts/9321/GlobalJS.user.js
// @updateURL https://update.greasyfork.org/scripts/9321/GlobalJS.meta.js
// ==/UserScript==


//GLOBAL VAR
var GLOBALDELAYGM = 2000;

function TextToLink() {
var excludedTags, filter, linkMixInit, linkPack, linkify, observePage, observer, setHttp, setLink, url_regexp, xpath;

url_regexp = /((https?:\/\/|www\.)[\x21-\x7e]+[\w\/]|(\w[\w._-]+\.(com|cn|org|net|info|tv|cc))(\/[\x21-\x7e]*[\w\/])?|ed2k:\/\/[\x21-\x7e]+\|\/|thunder:\/\/[\x21-\x7e]+=)/gi;

setHttp = function(event) {
  var url;
  url = event.target.getAttribute("href");
  if (url.indexOf("http") !== 0 && url.indexOf("ed2k://") !== 0 && url.indexOf("thunder://") !== 0) {
    return event.target.setAttribute("href", "http://" + url);
  }
};

if (typeof exportFunction !== "undefined" && exportFunction !== null) {
  exportFunction(setHttp, unsafeWindow, {
    defineAs: "setHttp"
  });
} else {
  unsafeWindow.setHttp = setHttp;
}

setLink = function(candidate) {
  var span, text;
  if ((candidate == null) || candidate.parentNode.className.indexOf("texttolink") !== -1 || candidate.nodeName === "#cdata-section") {
    return;
  }
  text = candidate.textContent.replace(url_regexp, '<a href="$1" target="_blank" class="texttolink" onmouseover="setHttp(event);">$1</a>');
  if (candidate.textContent.length === text.length) {
    return;
  }
  span = document.createElement("span");
  span.innerHTML = text;
  return candidate.parentNode.replaceChild(span, candidate);
};

excludedTags = "a,svg,canvas,applet,input,button,area,pre,embed,frame,frameset,head,iframe,img,option,map,meta,noscript,object,script,style,textarea,code".split(",");

xpath = "//text()[not(ancestor::" + (excludedTags.join(') and not(ancestor::')) + ")]";

filter = new RegExp("^(" + (excludedTags.join('|')) + ")$", "i");

linkPack = function(result, start) {
  var i, j, k, ref, ref1, ref2, ref3;
  if (start + 10000 < result.snapshotLength) {
    for (i = j = ref = start, ref1 = start + 10000; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
      setLink(result.snapshotItem(i));
    }
    setTimeout(function() {
      return linkPack(result, start + 10000);
    }, 15);
  } else {
    for (i = k = ref2 = start, ref3 = result.snapshotLength; ref2 <= ref3 ? k <= ref3 : k >= ref3; i = ref2 <= ref3 ? ++k : --k) {
      setLink(result.snapshotItem(i));
    }
  }
};

linkify = function(doc) {
  var result;
  result = document.evaluate(xpath, doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  return linkPack(result, 0);
};

linkify(document.body);
}
 

var ticks, lastTick, d = document, wn = window;
        function NextPageFunction() {

		return go('next', /^\s*(\u25BA|>|»)\s*$|^\W*((next|older)( (page|posts|entries))?|more|vorwärts|weiter|nächste\s+seite|suivant|siguiente)\W*$/i);

	}

	function BackPageFunction() {

		return go('prev', /^\s*(\u25C4|<|«)\s*$|^\W*((prev(ious)?|newer)( (page|posts|entries))?|zurück|vorherige\s+seite|précédent|anterior)\W*$/i);

	}

	function go(rel, regexp) {

		var link = d.querySelector('*[rel~="' + rel + '"]');
		if(link) {
			if(link.href)
				location.href = link.href;
			else {
				link.click();
				lock(true);
			}
			return true;
		}

		var links = d.body.querySelectorAll('a[href]');

		for(var i = links.length; i-- && (link = links[i]);) {

			if(!regexp.test(link.textContent) && !regexp.test(link.title)) continue;

			if(link.href.indexOf(location.protocol + '//' + location.hostname) != 0) continue;

			link.click();
			lock(true);
			return true;

		}

	}

	function lock(set) {

		if(set) return lock.until = Date.now() + 300;
		if(!lock.until) return;
		if(lock.until < Date.now()) lock.until = 0;
		return lock.until;

	}


function dragtoresizeimage() {
// ==UserScript==
// @name          Drag to Resize
// @namespace 	  http://kylej.name/
// @description	  Drag to resize images, based on code in the RES.
// @author        Kabaka
// @include       *
// @exclude       http://www.chess.com/*
// @exclude       http://chess.com/*
// ==/UserScript==

/* 
 * Drag to Resize - Drag images to resize them no matter where you are.
 * 
 * The image resizing code was extracted from honestbleeps's
 * (steve@honestbleeps.com) Reddit Enhancement Suite, a GPL
 * Greasemonkey script. The idea was, as far as I know, all his. What
 * I've done is duplicated that feature in this script and started
 * adding on things to make it useful in different contexts.
 *
 * Because it now runs everywhere, it will likely break some web
 * sites. And it definitely opens up doors for some silliness such as
 * making images hilariously gigantic. If this script causes you to
 * lose data, money, or time, don't hold me responsible!
 *
 *
 * Instructions:
 *
 *   To resize an image, hold the left mouse button and drag. Down and to the
 *   right will expand. Up and to the left will shrink. Images aligned to the
 *   right will expand in an unusual way. Sorry.
 *
 *   To reset an image to original size, right-click it.
 *
 *   To make an image fit the screen (by height), double-click.
 *
 *   To drag an image without resizing (as if the script were not installed),
 *   hold control (or command on Mac) and drag.
 *
 *
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var imageData = Array();

/*
 * Find all img elements on the page and feed them to makeImageZoomable().
 * Also, record the image's original width in imageData[] in case the user
 * wants to restore size later.
 */
function findAllImages()
{
  var imgs = document.getElementsByTagName('img');
  
  for (i=0; i<imgs.length; i++)
  {
    // We will populate this as the user interacts with the image, if they
    // do at all.
    imageData[imgs[i]] = {};
    imageData[imgs[i]].resized = false;

    makeImageZoomable(imgs[i]);
  }

}

/*
 * Calculate the drag size for the event. This is taken directly from
 * honestbleeps's Reddit Enhancement Suite.
 *
 * @param e mousedown or mousemove event.
 * @return Size for image resizing.
 */
function getDragSize(e)
{
		return (p = Math.pow)(p(e.clientX - (rc = e.target.getBoundingClientRect()).left, 2) + p(e.clientY - rc.top, 2), .5);
}

/*
 * Get the viewport's vertical size. This should work in most browsers. We'll
 * use this when making images fit the screen by height.
 *
 * @return Viewport size.
 */
function getHeight() {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

/*
 * Set up events for the given img element to make it zoomable via
 * drag to zoom. Most of this is taken directly from honestbleeps's
 * Reddit Enhancement Suite. Event functions are currently written
 * inline. For readability, I may move them. But the code is small
 * enough that I don't yet care.
 *
 * @param imgTag Image element.
 */
function makeImageZoomable(imgTag)
{
  dragTargetData = {};

  imgTag.addEventListener('mousedown', function(e)
  {
    if(e.ctrlKey != 0)
      return true;

    /*
     * This is so we can support the command key on Mac. The combination of OS
     * and browser changes how the key is passed to JavaScript. So we're just
     * going to catch all of them. This means we'll also be catching meta keys
     * for other systems. Oh well! Patches are welcome.
     */
    if(e.metaKey != null) // Can be on some platforms
      if(e.metaKey != 0)
        return true;


    if(e.button == 0)
    {
      // Store some data about the image in case we want to restore size later.
    
      // This would be easier if we could just keep imgs[i].style and set it
      // directly, but that doesn't seem to work.
      if(imageData[e.target].position ==  null)
      {
        imageData[e.target].zIndex = e.target.style.zIndex;
        imageData[e.target].width = e.target.style.width;
        imageData[e.target].height = e.target.style.height;
        imageData[e.target].position = e.target.style.position;
      }

      dragTargetData.iw = e.target.width;
      dragTargetData.d = getDragSize(e);
      dragTargetData.dr = false;

      e.preventDefault();
    }

  }, true);

  imgTag.addEventListener('contextmenu', function(e){
    if(imageData[e.target].resized)
    {
      imageData[e.target].resized = false;
      e.target.style.zIndex = imageData[e.target].zIndex;
      e.target.style.maxWidth = e.target.style.width = imageData[e.target].width;
      e.target.style.maxHeight = e.target.style.height = imageData[e.target].height;
      e.target.style.position = imageData[e.target].position;

      // Prevent the context menu from actually appearing.
      e.preventDefault();
      e.returnValue = false;
      e.stopPropagation();
      return false;
    }
  
  }, true);
  imgTag.addEventListener('dblclick', function(e)
  {
    if(e.ctrlKey != 0)
      return true;

    if(e.metaKey != null) // Can be on some platforms
      if(e.metaKey != 0)
        return true;


    if(imageData[e.target].resized)
    {
      // If we've already resized it, we have to set this back to the
      // original value. Otherwise, the max size image will keep the
      // original width. Dunno why!
      e.target.style.maxWidth = e.target.style.width = imageData[e.target].width;
    }

    e.target.style.position = "fixed";
    e.target.style.zIndex = 1000;
    e.target.style.top = 0;
    e.target.style.left = 0;
    e.target.style.maxWidth = e.target.style.width = "auto";
    e.target.style.maxHeight = e.target.style.height = getHeight() + "px";
      
    imageData[e.target].resized = true;

    // Most browsers will want to save the image or something. Prevent that.
    e.preventDefault();
    e.returnValue = false;
    e.stopPropagation();
    return false;

  }, true);
  imgTag.addEventListener('mousemove', function(e)
  {
    if (dragTargetData.d){
      e.target.style.maxWidth = e.target.style.width = ((getDragSize(e)) * dragTargetData.iw / dragTargetData.d) + "px";
      e.target.style.maxHeight = '';
      e.target.style.height = 'auto';
      e.target.style.zIndex = 1000; // Make sure the image is on top.

      if(e.target.style.position == '')
      {
        e.target.style.position = 'relative';
      }

      dragTargetData.dr = true;
      imageData[e.target].resized = true;
    }
  }, false);

  imgTag.addEventListener('mouseout', function(e)
  {
    dragTargetData.d = false;
      if (dragTargetData.dr) return false;
  }, false);

  imgTag.addEventListener('mouseup', function(e)
  {
    dragTargetData.d = false;
    if (dragTargetData.dr) return false;

  }, true);

  imgTag.addEventListener('click', function(e)
  {
    if(e.ctrlKey != 0)
      return true;

    if(e.metaKey != null) // Can be on some platforms
      if(e.metaKey != 0)
        return true;

    dragTargetData.d = false;
    if (dragTargetData.dr) {
      e.preventDefault();
      return false;
    }
    if(imageData[e.target].resized)
    {
      // Prevent the context menu from actually appearing.
      e.preventDefault();
      e.returnValue = false;
      e.stopPropagation();
      return false;
    }
  }, false);

}

findAllImages();
document.addEventListener('dragstart', function() {return false}, false);
}

function JST() {
with(window.open("", "_blank", "width=" + screen.width * .6 + ",left=" + screen.width * .35 + ",height=" + screen.height * .9 + ",resizable,scrollbars=yes")) {
    document.write("<head><title>JavaScript Development Environment 2.0.1</title><!-- about:blank confuses opera.. --></head><frameset rows=\"25,*,*\">\n\n  <frame name=\"toolbarFrame\" src=\"about:blank\" noresize=\"noresize\">\n\n  <frame name=\"inputFrame\" src=\"about:blank\">\n\n  <frame name=\"outputFrame\" src=\"about:blank\">\n\n</frameset>\n\n");
    document.close();
    frames[0].document.write("<head><!-- no doctype - it makes IE ignore the height: 100%. --><title>toolbarFrame</title>\n\n\n\n<style type=\"text/css\">\nhtml,body { width: 100%; height: 100%; border: none; margin: 0px; padding: 0px; }\nbutton { height: 100%; }\n</style>\n\n<script type=\"text/javascript\">\n\nvar outputFrame = parent.outputFrame;\nvar inputFrame = parent.inputFrame;\nvar framesetElement = parent.document.documentElement.getElementsByTagName(\"frameset\")[0];\n\nvar savedRows;\n\n\n// Need to use C-style comments in handleError() and print() \n// because IE retains them when decompiling a function.\n\n\n\nfunction print(s, c) {\n  var outputFrame = parent.outputFrame; /* duplicated here in case this function is elsewhere */\n  var doc = outputFrame.document;\n\n  var newdiv = doc.createElement(\"div\");\n  newdiv.appendChild(doc.createTextNode(s));\n  if (c)\n    newdiv.style.color = c;\n  doc.body.appendChild(newdiv);\n}\n\nfunction handleError(er, file, lineNumber) \n{\n  print(\"Error on line \" + lineNumber + \": \" + er, \"red\"); \n    \n  /* Find the character offset for the line */\n  /* (code adapted from blogidate xml well-formedness bookmarklet) */\n  var ta = inputFrame.document.getElementById(\"input\");\n  var lines = ta.value.split(\"\\n\");\n  var cc = 0; \n  var i;\n  for(i=0; i < (lineNumber - 1); ++i) \n    cc += lines[i].length + 1;\n\n  /* Hacky(?) workaround for IE's habit of including \\r's in strings */\n  if (ta.value.split(\"\\r\").length > 1)\n    cc -= lineNumber - 1;\n\n  /* Select the line */\n  if(document.selection) { \n    /* IE (Leonard Lin gave me this code) */\n    var sel = ta.createTextRange(); \n    sel.moveStart(\"character\", cc); \n    sel.collapse(); \n    sel.moveEnd(\"character\", lines[i].length); \n    sel.select();\n  } else { \n    /* Mozilla */\n    ta.selectionStart = cc; \n    ta.selectionEnd = cc + lines[i].length; \n  }\n \n  /* return true; */ /* nah, let the error go through to IE's js consolish thing! */\n}\n\n\n\n\n\nfunction showHideOutput()\n{\n  if (outputFrame.document.body.clientHeight > 100) {\n    // hide\n    savedRows = framesetElement.rows;    \n    framesetElement.rows = \"25,*,0\";\n  }\n  else {\n    // show. use the previous size, if possible\n    if (savedRows) {\n      framesetElement.rows = savedRows;\n      savedRows = null;\n    }\n    else {\n      framesetElement.rows = \"25,*,*\";\n    }\n  }\n}\n\nfunction refocus()\n{\n  inputFrame.document.getElementById(\"input\").focus();\n}\n\n\nfunction clearOutput()\n{\n  var b = outputFrame.document.body;\n  while(b.firstChild)\n    b.removeChild(b.firstChild);\n}\n\nfunction stripLineBreaks(s)\n{\n  return s.replace(/\\n/g, \"\").replace(/\\r/g, \"\"); // stripping \\r is for IE\n}\n\nfunction execute()\n{\n  var js = inputFrame.document.getElementById(\"input\").value;\n\n  var useOpener = parent.opener && !parent.opener.closed;\n  var oldStyle = !! document.all; // lame but meh.\n  \n  print(\"Running\" + (useOpener ? \" in bookmarklet mode\" : \"\") + (oldStyle ? \" in make-IE-happy mode\" : \"\") + \"...\", \"orange\");\n\n  if (useOpener)\n    executeWithJSURL(js, parent.opener); // only way to execute against another frame\n  else if (oldStyle)\n    executeWithDW(js, execFrame); // only way to get line numbers in IE\n  else\n    executeWithJSURL(js, execFrame); // faster in Mozilla  \n}\n\n// Advantages: can get line numbers in IE.\nfunction executeWithDW(js, win)\n{\n  win.document.open();\n  win.inputFrame = inputFrame;\n  win.outputFrame = outputFrame;\n  win.document.write(\n    stripLineBreaks(\n        '<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01//EN\" \"http://www.w3.org/TR/html4/strict.dtd\">' +\n        '<html><head><title>execFrame<\\/title><script type=\"text/javascript\">'\n      + print         // yay for decompilation!\n      + handleError \n      + \"window.onerror = handleError;\"\n      + \"<\\/script><\\/head>\"\n      ) \n    + '<body><script type=\"text/javascript\">'\n    + js         // should escape it a little to remove the string <\\/script> at least...\n    + \"<\\/script><\\/body><\\/html>\"\n    );\n  win.document.close();\n}\n\n// Advantages: can be used to inject a script into another window, faster in Mozilla.\nfunction executeWithJSURL(js, win)\n{\n  // isolate scope\n  js = \"(function(){ \" + js + \" \\n })()\";\n\n  win.print = print;\n  win.onerror = handleError;\n\n  // double encodeURIComponent because javascript: URLs themselves are encoded!\n  win.location.href = 'javascript:eval(decodeURIComponent(\"' + encodeURIComponent(encodeURIComponent(js)) + '\")); void 0;';\n  \n  refocus();\n}\n\n// Other ideas I haven't tried lately: create a <script> element, eval.\n\n\nfunction makeUserScript(userScriptLink)\n{\n    userScriptLink.href = \n        \"data:text/javascript;charset=utf-8,\" + \n        encodeURIComponent(inputFrame.document.getElementById(\"input\").value + \"//.user.js\");\n}\n\n</scr" + "ipt></head><body>\n\n<button accesskey=\"E\" onclick=\"execute(); refocus();\"><u>E</u>xecute</button>\n<!-- <button accesskey=\"R\" onclick=\"reloadAndExecute(); refocus();\"><u>R</u>eload and execute</button> -->\n<button accesskey=\"C\" onclick=\"clearOutput(); refocus();\"><u>C</u>lear output</button>\n<button accesskey=\"S\" onclick=\"showHideOutput(); refocus();\"><u>S</u>how/hide output</button>\n<!-- <button accesskey=\"H\" onclick=\"help(); refocus();\"><u>H</u>elp</button> -->\n\n<a href=\"data:text/html,...\" onfocus=\"makeUserScript(this);\" onmouseover=\"makeUserScript(this);\" target=\"_blank\">Install as user script</a>\n\n<div style=\"visibility: hidden;\">\n<iframe name=\"execFrame\" src=\"about:blank\" height=\"5\" width=\"5\"></iframe>\n</div>\n\n</body>");
    frames[0].document.close();
    frames[1].document.write("<head><!-- no doctype - it makes IE ignore the height: 100%. --><title>inputFrame</title>\n\n\n\n\n\n<style type=\"text/css\">\n\nhtml,body,form,textarea { width: 100%; height: 100%; border: none; margin: 0px; padding: 0px; }\nhtml,body { overflow: hidden; }\n\n</style></head><body onload=\"document.getElementById('input').select();\">\n<textarea style=\"background-color: rgb(221, 238, 255);\" id=\"input\">// ==UserScript==\n// @namespace     http://www.squarefree.com/jsenv/autogenerated\n// @name          Unnamed script\n// @description   Undescribed script\n// ==/UserScript==\n\nprint(\"Squares of numbers 0 through 4:\");\nfor (var i = 0; i &lt; 5; ++i)\n  print(i * i);\n\nthis.statement.causes(an.error);\n</textarea>\n</body>");
    frames[1].document.close();
}
}

function CSST() {
(function() {
    function init() {
        var newline = unescape("%" + "0A"),
            importCount = 0,
            L = [];
        dead = false;
        oldCSS = null;
        x = opener;
        ta = document.f.ta;
        ta.select();
        if (x.editStyles) {
            ta.value = x.editStyles.innerHTML;
            update();
            return;
        }
        ta.value = "/* Type CSS rules here and they will be applied" + newline + "to pages from '" + location.host + "'" + newline + "immediately as long as you keep this window open. */" + newline + newline;

        function add(s) {
            if (!s.disabled) {
                var y = {
                    sheet: s,
                    readable: true,
                    label: "Imported",
                    inline: false,
                    shorturl: "",
                    fulltext: ""
                };
                try {
                    for (var k = 0, m; m = s.cssRules[k]; ++k)
                        if (m.type == 3) add(m.styleSheet);
                } catch (er) {
                    y.readable = false;
                }
                L.push(y);
                if (s.ownerNode) {
                    y.label = s.ownerNode.tagName.toUpperCase() + "-tag";
                    if (!s.ownerNode.getAttribute("src") && !s.ownerNode.href) y.inline = true;
                }
                if (y.inline) {
                    y.label = "Inline " + y.label;
                    y.fulltext = fix(s.ownerNode.innerHTML);
                } else if (s.href.substr(0, 13) == "data:text/css") {
                    y.shorturl = " contained in a data: URL";
                    y.fulltext = fix(unescape(s.href.slice(14)));
                } else {
                    ++importCount;
                    y.importtext = "@import \"" + s.href + "\";";
                    y.shorturl = " " + s.href.split('/').reverse()[0];
                    if (!y.readable) {
                        y.fulltext = "/* Out-of-domain; imported above. */";
                    } else if (s.href.substr(0, 5) != "http:") {
                        y.fulltext = "/* Non-http; imported above. */";
                    } else {
                        var loadingText = "/* Loading (" + (L.length - 1) + ") */";
                        y.fulltext = loadingText;
                        var p = new XMLHttpRequest();
                        p.onload = function(e) {
                            ta.value = ta.value.replace(y.importtext + newline, "");
                            y.fulltext = p.responseText;
                            ta.value = ta.value.replace(loadingText, fix(y.fulltext));
                            ta.value = ta.value.replace(firstNote + newline, "");
                        };
                        p.open("GET", s.href);
                        p.send(null);
                    }
                }
            }
        }

        function fix(s) {
            while ((s[0] == newline) && s.length > 1) s = s.slice(1);
            while ((s[s.length - 1] == newline) && s.length > 1) s = s.substr(0, s.length - 1);
            s = s.replace(/@import.*;/ig, function() {
                return "/* " + RegExp.lastMatch + " */";
            });
            return s;
        }
        for (var i = 0, ss; ss = x.document.styleSheets[i]; ++i) add(ss);
        var imports = "",
            main = "";
        var firstNote = "/**** Style sheets whose contents could be loaded were ****/" + newline + "/**** imported instead.  Rule order may be incorrect   ****/" + newline + "/**** as a result. ****/" + newline;
        if (importCount) {
            ta.value += firstNote;
        }
        for (var i = 0; ss = L[i]; ++i) {
            if (ss.importtext) {
                imports += ss.importtext + newline;
            }
            main += "/**** " + ss.label + " style sheet" + ss.shorturl + " ****/" + newline;
            main += newline;
            main += ss.fulltext;
            main += newline;
            main += newline;
            main += newline;
        }
        ta.value += imports + newline + main;
        update();
    }

    function update() {
        try {
            if (!x || x.closed) {
                ta.style.backgroundColor = "#ddd";
                return;
            }
            x.editStyles;
        } catch (er) {
            ta.style.backgroundColor = "#fdc";
            setTimeout(update, 150);
            dead = true;
            return;
        }
        if (dead) {
            dead = false;
            ta.style.backgroundColor = "";
            oldCSS = null;
        }
        if (!x.editStyles) {
            var newSS;
            newSS = x.document.createElement("style");
            newSS.type = "text/css";
            x.document.getElementsByTagName("head")[0].appendChild(newSS);
            x.editStyles = newSS;
            oldCSS = null;
            for (var i = 0, ss; ss = x.document.styleSheets[i]; ++i) ss.disabled = true;
        }
        if (oldCSS != ta.value) {
            oldCSS = ta.value;
            x.editStyles.innerHTML = ta.value;
        }
        setTimeout(update, 150);
    }
    y = open('', '', 'resizable,scrollbars=yes,width=550,height=520');
    y.document.write('<title>Edit Styles</title><style>.ec { width: 100%; height: 100%; border: none; margin: 0px; padding: 0px; }</style><body class="ec"><form name="f" style="margin: 0px;" class="ec"><textarea name="ta" wrap="soft" style="margin: 0px; border: 0px; width:100%; height:100%;" class="ec"></textarea><script>' + update + init + 'init();<' + '/script>');
    y.document.close();
})();
}

function ElementHidingHelper () {

document.body.addEventListener('mouseover', handlemouseover);
document.body.addEventListener('mouseout', handlemouseout);
document.body.addEventListener('mousedown', handlemousedown);
/*
document.body.addEventListener('click', handleclick);

   function handleclick (e){
     var c = getUniqueSelector(e.target);
         //var  element = document.querySelector(c);
          //console.log(element);
              //alert(c);
    //document.querySelector(c).style.outline = "2px dotted black";
      if (window.confirm("Inject to file? " + c) == true) {
	  //cc = c.replace(/ /g, "_");
      cc = c.replace(/#/g, "ESCAPEDANCHOR");
      ele = document.createElement("img");
      ele.src = "https://127.0.0.1:12345/php/1.php?domain=" + document.domain +  "&selector=" + cc;
      document.body.appendChild(ele);
      document.body.removeChild(ele);
	  document.querySelector(c).style.outline = "none";document.body.removeEventListener("mousedown", handlemousedown);document.body.removeEventListener("mouseover", handlemouseover);document.body.removeEventListener("mouseoout", handlemouseout);
	  document.querySelector(c).outerHTML = "";
      }
    //setTimeout(function (){
	document.body.removeEventListener("mousedown", handlemousedown);document.body.removeEventListener("click", handlemousedown);document.body.removeEventListener("mouseover", handlemouseover);document.body.removeEventListener("mouseoout", handlemouseout);
	//}, 1000);
      //alert(c);
        //element.style.color = "red"
   }
*/
   function handlemousedown (e){
     var cc = getUniqueSelector(e.target);
         //var  element = document.querySelector(c);
          //console.log(element);
              //alert(c);
    //document.querySelector(c).style.outline = "2px dotted black";
	var c = window.prompt("Inject to file? ", cc);
      if (c == null) {
	  document.body.removeEventListener("mousedown", handlemousedown);document.body.removeEventListener("click", handlemousedown);document.body.removeEventListener("mouseover", handlemouseover);document.body.removeEventListener("mouseoout", handlemouseout);
	  }
	  else {
	  //cc = c.replace(/ /g, "_");
      cc = c.replace(/#/g, "ESCAPEDANCHOR");
      ele = document.createElement("img");
      ele.src = "https://127.0.0.1:12345/php/1.php?domain=" + document.domain +  "&selector=" + cc;
      document.body.appendChild(ele);
      document.body.removeChild(ele);
	  document.querySelector(c).style.outline = "none";document.body.removeEventListener("mousedown", handlemousedown);document.body.removeEventListener("mouseover", handlemouseover);document.body.removeEventListener("mouseoout", handlemouseout);
	  document.querySelector(c).outerHTML = "";
      }
    //setTimeout(function (){
	document.body.removeEventListener("mousedown", handlemousedown);document.body.removeEventListener("click", handlemousedown);document.body.removeEventListener("mouseover", handlemouseover);document.body.removeEventListener("mouseoout", handlemouseout);
	//}, 1000);
      //alert(c);
        //element.style.color = "red"
   }
      function handlemouseover (e){
     var c = getUniqueSelector(e.target);
         //var  element = document.querySelector(c);
          //console.log(element);
              //alert(c);
    document.querySelector(c).style.outline = "2px solid red";
    	//setTimeout(function (){document.querySelector(c).style.outline = "none";}, 1000);
      //console.log(c);
        //element.style.color = "red"

   }
   
   function handlemouseout (e){
     var c = getUniqueSelector(e.target);
         //var  element = document.querySelector(c);
          //console.log(element);
              //alert(c);
    document.querySelector(c).style.outline = "none";
    	//setTimeout(function (){document.querySelector(c).style.outline = "none";}, 1000);
      //console.log(c);
        //element.style.color = "red"

   }
   //document.body.removeEventListener("mouseover", getselector);

}


function ElementRemovingHelper () {

document.body.addEventListener('mouseover', handlemouseover);
document.body.addEventListener('mouseout', handlemouseout);
document.body.addEventListener('mousedown', handlemousedown);
   
   function handlemousedown (e){
     var cc = getUniqueSelector(e.target);
         //var  element = document.querySelector(c);
          //console.log(element);
              //alert(c);
    //document.querySelector(c).style.outline = "2px dotted black";
	//window.prompt("Inject to file? ", cc);
	var c = window.prompt("Inject to file? ", cc);
      if (c == null) {
	  document.body.removeEventListener("mousedown", handlemousedown);document.body.removeEventListener("click", handlemousedown);document.body.removeEventListener("mouseover", handlemouseover);document.body.removeEventListener("mouseoout", handlemouseout);
	  }
	  else {	  //cc = c.replace(/ /g, "_");
      cc = c.replace(/#/g, "ESCAPEDANCHOR");
      ele = document.createElement("img");
      ele.src = "https://127.0.0.1:12345/php/2.php?domain=" + document.domain +  "&selector=" + cc;
      document.body.appendChild(ele);
      document.body.removeChild(ele);
	  document.querySelector(c).style.outline = "none";document.body.removeEventListener("mousedown", handlemousedown);document.body.removeEventListener("mouseover", handlemouseover);document.body.removeEventListener("mouseoout", handlemouseout);
	  document.querySelector(c).outerHTML = "";
      }
    //setTimeout(function (){
	document.body.removeEventListener("mousedown", handlemousedown);document.body.removeEventListener("mouseover", handlemouseover);document.body.removeEventListener("mouseoout", handlemouseout);
	//}, 1000);
      //alert(c);
        //element.style.color = "red"
   }
      function handlemouseover (e){
     var c = getUniqueSelector(e.target);
         //var  element = document.querySelector(c);
          //console.log(element);
              //alert(c);
    document.querySelector(c).style.outline = "2px solid red";
    	//setTimeout(function (){document.querySelector(c).style.outline = "none";}, 1000);
      //console.log(c);
        //element.style.color = "red"

   }
   
   function handlemouseout (e){
     var c = getUniqueSelector(e.target);
         //var  element = document.querySelector(c);
          //console.log(element);
              //alert(c);
    document.querySelector(c).style.outline = "none";
    	//setTimeout(function (){document.querySelector(c).style.outline = "none";}, 1000);
      //console.log(c);
        //element.style.color = "red"

   }
   //document.body.removeEventListener("mouseover", getselector);

}











function getIndex(node){
    var i=1;
    var tagName = node.tagName;

    while(node.previousSibling){
    node = node.previousSibling;
        if(node.nodeType === 1 && (tagName.toLowerCase() == node.tagName.toLowerCase())){
            i++;
        }
    }
    return i;
}

function positionInNodeList(element, nodeList) {
for (var i = 0; i < nodeList.length; i++) {
if (element === nodeList[i]) {
return i;
}
}
return - 1;
}
 
function getUniqueSelector(element) {
var tagName = element.localName,
selector, index, matches;
// document.querySelectorAll("#id") returns multiple if elements share an ID
if (element.id && document.querySelectorAll('#' + element.id).length === 1) {
return '#' + element.id;
}
// Inherently unique by tag name
if (tagName === 'html') {
return 'html';
}
if (tagName === 'head') {
return 'head';
}
if (tagName === 'body') {
return 'body';
}

//console.log(element);
if (element.attributes.length > 1) {
var attribute = "";
var num = 0;
for (var i = 0; i < element.attributes.length; i++) {
//if ((element.attributes[i].name == "width") || (element.attributes[i].name == "title") || (element.attributes[i].name == "height") || (element.attributes[i].name == "valign")) {
//if ((element.attributes[i].name != "style")) {
if ((element.attributes[i].name == "style")) {
num = num + 0;
//attribute += '[style]';
}
else {
num = num + 1;
attribute += '[' + element.attributes[i].name + '="' + element.attributes[i].value + '"]';
}
}
//alert(attribute);
if (num == 1) { attribute = ""; selector = 0; }
selector = element.localName + attribute;
//console.log(element.localName + attribute);
matches = document.querySelectorAll(selector);
if (matches.length === 1) {
return selector;
}
}
 
// We might be able to find a unique class name
 if (element.classList.length > 0) {
for (var i = 0; i < element.classList.length; i++) {
// Is this className unique by itself?
selector = '.' + element.classList.item(i);
}
matches = document.querySelectorAll(selector);
 if (matches.length === 1) {
return selector;
}
// Maybe it's unique with a tag name?
selector = tagName + selector;
matches = document.querySelectorAll(selector);
 if (matches.length === 1) {
return selector;
}
// Maybe it's unique using a tag name and nth-child
index = positionInNodeList(element, element.parentNode.children) + 1;
selector = selector + ':nth-child(' + index + ')';
matches = document.querySelectorAll(selector);
 if (matches.length === 1) {
return selector;
}
}

// Not unique enough yet. As long as it's not a child of the document,
// continue recursing up until it is unique enough.
 if (element.parentNode !== document) {
index = positionInNodeList(element, element.parentNode.children) + 1;
selector = getUniqueSelector(element.parentNode) + ' > ' +
tagName + ':nth-child(' + index + ')';
}
return selector;






}


function getUniqueSelector0999999(element) {
var tagName = element.localName,
selector, index, matches;
// document.querySelectorAll("#id") returns multiple if elements share an ID
if (element.id && document.querySelectorAll('#' + element.id).length === 1) {
return '#' + element.id;
}
// Inherently unique by tag name
if (tagName === 'html') {
return 'html';
}
if (tagName === 'head') {
return 'head';
}
if (tagName === 'body') {
return 'body';
}

//console.log(element);
if (element.attributes.length > 2) {
var attribute = "";
var num = 0;
for (var i = 0; i < element.attributes.length; i++) {
//if ((element.attributes[i].name == "width") || (element.attributes[i].name == "title") || (element.attributes[i].name == "height") || (element.attributes[i].name == "valign")) {
if ((element.attributes[i].name != "style")) {
num = num + 0;
//attribute += '[' + element.attributes[i].name + '="' + element.attributes[i].value + '"]';
}
}
//alert(attribute);
if (num == 1) { attribute = ""; selector = 0; }
selector = element.localName + attribute;
//console.log(element.localName + attribute);
matches = document.querySelectorAll(selector);
if (matches.length === 1) {
return selector;
}
}
 
// We might be able to find a unique class name
 if (element.classList.length > 0) {
for (var i = 0; i < element.classList.length; i++) {
// Is this className unique by itself?
selector = '.' + element.classList.item(i);
}
matches = document.querySelectorAll(selector);
 if (matches.length === 1) {
return selector;
}
// Maybe it's unique with a tag name?
selector = tagName + selector;
matches = document.querySelectorAll(selector);
 if (matches.length === 1) {
return selector;
}
// Maybe it's unique using a tag name and nth-child
index = positionInNodeList(element, element.parentNode.children) + 1;
selector = selector + ':nth-child(' + index + ')';
matches = document.querySelectorAll(selector);
 if (matches.length === 1) {
return selector;
}
}

// Not unique enough yet. As long as it's not a child of the document,
// continue recursing up until it is unique enough.
 if (element.parentNode !== document) {
index = positionInNodeList(element, element.parentNode.children) + 1;
selector = getUniqueSelector(element.parentNode) + ' > ' +
tagName + ':nth-child(' + index + ')';
}
return selector;






}

// CONTAIN BLOCKER

function EHH(selector) {
         //document.querySelector(selector).outerHTML = document.querySelector(selector).outerHTML.replace(/src/gi, "");
         document.querySelector(selector).outerHTML = "";
         //document.querySelector(selector).style = "display:none";
}

function containwordsblock(tag, string) 
{
var count = 0;
var array = string.split(" ");
var ele = document.getElementsByTagName(tag);
for (var i =  ele.length - 1; i >= 0; i--) {
for (var i2 = array.length - 1; i2 >= 0; i2--) 
{
if (ele[i].innerHTML.indexOf(array[i2]) > -1) 
{
count+=1
}
}
if (count == array.length - 1) {
count=0;
}
}
}

function containblockinsert(string) 
{
    window.addEventListener('DOMNodeInserted', function(event) 
    {
    var ele = event.target;
    var count = 0;
    var array = string.split(" ");
    for (var i2 =  array.length - 1; i2 >= 0; i2--) 
    {
    if (ele.outerHTML.indexOf(array[i2]) > -1) 
    {
    count+=1
    }
    }
    if (count == array.length - 1) 
    {
    count=0;
    ele.parentNode.removeChild(ele);
    }
    });
}

function containblock(tag,key)
{
for(var i = 0; i < document.getElementsByTagName(tag).length; i++) 
{
     if (document.getElementsByTagName(tag)[i].outerHTML.indexOf(key) !== -1) 
     {
         document.getElementsByTagName(tag)[i].src = "";
         document.getElementsByTagName(tag)[i].style = "display:none";
     }
}
}

function containblockid(tag,key)
{
for(var i = 0; i < document.getElementsByTagName(tag).length; i++) 
{
     if (document.getElementsByTagName(tag)[i].id.indexOf(key) !== -1) 
     {
         document.getElementsByTagName(tag)[i].src = "";
         document.getElementsByTagName(tag)[i].style = "display:none";
     }
}
}

function containblockclass(tag,key)
{
for(var i = 0; i < document.getElementsByTagName(tag).length; i++) 
{
     if (document.getElementsByTagName(tag)[i].className.indexOf(key) !== -1) 
     {
         document.getElementsByTagName(tag)[i].src = "";
         document.getElementsByTagName(tag)[i].style = "display:none";
     }
}
}
//ENDCONTAIN BLOCKER

    function toggle_visibility(id) {
       var e = document.getElementById(id);
       if(e.style.display == 'block')
          e.style.display = 'none';
       else
          e.style.display = 'block';
    }

function htmlEscape(s) {
        s = s.replace(/&/g, '&amp;');
        s = s.replace(/>/g, '&gt;');
        s = s.replace(/</g, '&lt;');
        return s;
    }

//alert(htmlEscape(document.documentElement.innerHTML));
function getsource()
{
    var c = [function () {
        return new ActiveXObject("Microsoft.XMLHTTP")
    }, function () {
        return new XMLHttpRequest
    }];

    function d() {
        for (var b = !1, a = c.length; 0 <= --a;) try {
            b = c[a]();
            break
        } catch (e) {}
        return b
    }(function (b) {
        var a = d();
        if (!1 === a) return !1;
        a.open("GET", window.location.href, !0);
        a.onreadystatechange = function () {
            4 === a.readyState && (delete a.onreadystatechange, b(a.responseText))
        };
        a.send(null)
    })(function (b) {
        //alert(b)
        document.getElementById("floatta").innerHTML = htmlEscape(b);
    });
}
//getsource()
//document.getElementById("floatta").innerHTML = htmlEscape(document.documentElement.innerHTML);

function myFunction(id) {
    var d=document.getElementById(id);

    if (d.style.display=='none'){
         d.style.display='';
    } else {
        d.style.display='none';
    }
}

/*jslint browser: true */

//Copyright (c) 2008 Lewis Linn White Jr.
//Author: Lewis Linn White Jr.

//Permission is hereby granted, free of charge, to any person
//obtaining a copy of this software and associated documentation
//files (the "Software"), to deal in the Software without
//restriction, including without limitation the rights to use,
//copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the
//Software is furnished to do so, subject to the following
//conditions:

//The above copyright notice and this permission notice shall be
//included in all copies or substantial portions of the Software.
//Except as contained in this notice, the name(s) of the above 
//copyright holders shall not be used in advertising or otherwise 
//to promote the sale, use or other dealings in this Software without 
//prior written authorization.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
//EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
//OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
//HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
//WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
//OTHER DEALINGS IN THE SOFTWARE.

//Icons used in this project are graciously provided by the Silk icons set:
//http://www.famfamfam.com/lab/icons/silk/

function DOMAlert(settings)
{
	var that, modalWindow, iframe, alertWindow, titleBar, title, ricon, licon, contentArea, buttonArea, okButton, cancelButton, defaultCallback, okCallback, cancelCallback;
	
	//create version of ourself for use in closures
	that = this;
	
	//Create our settings
	this.settings = settings;
	
	//Create a namespae object to hold our html elements
	this.html = {};
	
	//ie6 test.  what a crappy browser
	this.isIE6 = (document.all && window.external && (typeof document.documentElement.style.maxHeight === 'undefined')) ? true : false;	
	
	// use the Default skin if none was provided
	this.settings.skin = this.settings.skin ? this.settings.skin : 'default';
	
	// Set up a default for OK setting
	if (!this.settings.ok)
	{
		defaultCallback = function ()
		{
			that.close();
		};
		this.settings.ok = {text: 'Ok', value: true, onclick: defaultCallback};
	}
	
	//Create our modal background
	modalWindow = document.createElement('div');
	modalWindow.style.height = ((document.documentElement.clientHeight > document.documentElement.scrollHeight) ? document.documentElement.clientHeight : document.documentElement.scrollHeight) + 'px';
	modalWindow.style.width = document.documentElement.scrollWidth + 'px';
	if (!this.isIE6)
	{
		modalWindow.style.background = 'url(http://config.privoxy.org/user-manual/tp2.png)';  //transparent png with low opacity.  Provides a similar effect as opacy/filter settings, but without the memory leaks
	}
	modalWindow.style.position = 'absolute';
	modalWindow.style.left = '0px';
	modalWindow.style.top = '0px';
	modalWindow.style.zIndex = 998;
	modalWindow.style.visibility = 'hidden';
	document.body.appendChild(modalWindow);
	this.html.modalWindow = modalWindow;
	
	//shoehorn a iframe to cover our select elemtns for ie6.  what a crappy browser....
	if (this.isIE6)
	{
		iframe = document.createElement('iframe');
		iframe.style.position = 'absolute';
		iframe.style.visibility = 'hidden';
		iframe.style.zIndex = 997;
		iframe.frameBorder = 0;
		iframe.style.position = 'absolute';
		document.body.appendChild(iframe);
		this.html.iframe = iframe;
		
		//also, need to add an alpha image loader for ie6 transparency affect.  again, style.filter has a huge memory leak
		modalWindow.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='http://config.privoxy.org/user-manual/tp2.png', sizingMethod='scale', enabled=true)";
	}
	
	//Create our alert window
	alertWindow = document.createElement('div');
	alertWindow.className = this.settings.skin + '_alertWindow';
	alertWindow.style.position = this.isIE6 ? 'absolute' : 'fixed';
	alertWindow.style.zIndex = 999;
	if (this.settings.width)
	{
		alertWindow.style.width = this.settings.width + 'px';
	}
	document.body.appendChild(alertWindow);
	alertWindow.style.visibility = 'hidden';
	this.html.alertWindow = alertWindow;
	
	//Create out title bar
	titleBar = document.createElement('div');
	titleBar.className = this.settings.skin + '_titleBar';
	alertWindow.appendChild(titleBar);
	this.html.titleBar = titleBar;
	
	//Create our right Icon
	ricon = document.createElement('div');
	ricon.className = this.settings.skin + '_titleBarRightIcon';
	ricon.style.cssFloat = 'right';
	ricon.style.styleFloat = 'right';
	titleBar.appendChild(ricon);
	this.html.ricon = ricon;
	
	//Create our Left Icon
	licon = document.createElement('div');
	licon.className = this.settings.skin + '_titleBarLeftIcon';
	licon.style.cssFloat = 'left';
	licon.style.styleFloat = 'left';
	titleBar.appendChild(licon);
	this.html.licon = licon;
	
	//Create our span that goes in our title
	title = document.createElement('span');
	title.innerHTML = this.settings.title;
	titleBar.appendChild(title);
	this.html.title = title;
	
	//Create our main content area
	contentArea = document.createElement('div');
	contentArea.className = this.settings.skin + '_contentArea';
	contentArea.innerHTML = this.settings.text;
	if (this.settings.height)
	{
		contentArea.style.height = this.settings.height + 'px';
	}
	alertWindow.appendChild(contentArea);
	this.html.contentArea = contentArea;
	
	//Create out button area
	buttonArea = document.createElement('div');
	buttonArea.className = this.settings.skin + '_buttonArea';
	alertWindow.appendChild(buttonArea);
	this.html.buttonArea = buttonArea;
	
	//Draw an OK button
	okButton = document.createElement('input');
	okButton.type = 'button';
	okButton.className = this.settings.skin + '_okButton';
	okButton.value = this.settings.ok.text;
	okCallback = function ()
	{
		that.settings.ok.onclick(that, that.settings.ok.value);
	};
	okButton.onclick = okCallback;
	buttonArea.appendChild(okButton);
	this.html.okButton = okButton;
	
	//Draw a cancel button, if present
	if (this.settings.cancel)
	{
		cancelButton = document.createElement('input');
		cancelButton.type = 'button';
		cancelButton.className = this.settings.skin + '_cancelButton';
		cancelButton.value = this.settings.cancel.text || 'Cancel';
		cancelCallback = function ()
		{
			that.settings.cancel.onclick(that, that.settings.cancel.value);
		};
		cancelButton.onclick = cancelCallback;
		buttonArea.appendChild(cancelButton);
		this.html.cancelButton = cancelButton;
	}
	
	//Center our alert box on the screen
	this.center();

}
DOMAlert.prototype.show = function (titleText, contentText)
{
	if (contentText)
	{
		this.html.title.innerHTML = titleText;
		this.html.contentArea.innerHTML = contentText;
	}
	if (titleText && !contentText)
	{
		this.html.contentArea.innerHTML = titleText;
	}
	
	this.html.modalWindow.style.visibility = 'visible';
	this.html.alertWindow.style.visibility = 'visible';
	if (this.html.iframe)
	{
		this.html.iframe.style.height = this.html.alertWindow.offsetHeight;
		this.html.iframe.style.width = this.html.alertWindow.offsetWidth;
		this.html.iframe.style.visibility = 'visible';
	}
	if (this.html.cancelButton)
	{
		this.html.cancelButton.focus();
	}
	else
	{
		this.html.okButton.focus();
	}	
};
DOMAlert.prototype.hide = function ()
{
	this.html.modalWindow.style.visibility = 'hidden';
	this.html.alertWindow.style.visibility = 'hidden';
	if (this.html.iframe)
	{
		this.html.iframe.style.visibility = 'hidden';
	}
};
DOMAlert.prototype.close = function ()
{
	var obj, prop;
	
	//make sure our DOM objects are deleted and our onclick statements are nulled
	for (obj in this.html)
	{
		if (this.html[obj].parentNode)
		{
			if (this.html[obj].onclick)
			{
				this.html[obj].onclick = null;
			}
			this.html[obj].parentNode.removeChild(this.html[obj]);
			delete this.html[obj];
		}
	}
		
	//remove object properties
	for (prop in this)
	{
		if (this[prop])
		{
			this[prop] = null;
			delete this[prop];
		}
	}
};
DOMAlert.prototype.center = function ()
{
	var alertWindow, scrollT, scrollL, iframe;
	alertWindow = this.html.alertWindow;
	if (alertWindow.style.position === 'absolute')
	{
		scrollT = window.pageYOffset || document.documentElement.scrollTop;
		scrollL = window.pageXOffset || document.documentElement.scrollLeft;
		alertWindow.style.left = (self.innerWidth || (document.documentElement.clientWidth || document.body.clientWidth)) / 2 + scrollL - alertWindow.offsetWidth / 2 + 'px';
		alertWindow.style.top = (self.innerHeight || (document.documentElement.clientHeight || document.body.clientHeight)) / 2 + scrollT - alertWindow.offsetHeight / 2 + 'px';
		if (this.html.iframe)
		{
			this.html.iframe.style.left = alertWindow.style.left;
			this.html.iframe.style.top = alertWindow.style.top;
		}
	}
	else
	{
		alertWindow.style.left = (self.innerWidth || (document.documentElement.clientWidth || document.body.clientWidth)) / 2 - alertWindow.offsetWidth / 2 + 'px';
		alertWindow.style.top = (self.innerHeight || (document.documentElement.clientHeight || document.body.clientHeight)) / 2 - alertWindow.offsetHeight / 2 + 'px';
	}
};














// ==UserScript==
// @name Fit to Width
// @namespace http://www.greasespot.net/
// @include http*
// @exclude http://custombuttons.mozdev.org/*
// ==/UserScript==
function fittowidth(){

function ftw(filter) {
  var root = document;
  var whatToShow = 1; // NodeFilter.SHOW_ELEMENT
  var entityReferenceExpansion = false;
  var nodeIterator = document.createNodeIterator(
    root, whatToShow, filter, entityReferenceExpansion);
  while (nodeIterator.nextNode()) {}
}
ftw(function (node) {
  var left = node.offsetLeft;
  var parent = node.offsetParent;
  while (parent != null) {
    left += parent.offsetLeft;
    parent = parent.offsetParent;
  }
  var width = document.documentElement.clientWidth - left;
  if (node.style.marginLeft) width -= node.style.marginLeft;
  if (node.style.marginRight) width -= node.style.marginRight;
  if (node.style.paddingLeft) width -= node.style.paddingLeft;
  if (node.style.paddingRight) width -= node.style.paddingRight;
  if (node.style.borderWidth) width -= node.style.borderWidth;
  width -= document.defaultView.innerWidth;
  width += document.documentElement.offsetWidth;
  if (node.tagName == "IMG") {
    var height = node.clientHeight * width / node.clientWidth;
    node.style.maxHeight = height;
  }
  node.style.maxWidth = width + "px";
});
}


// HOTKEY FOR ALL

/**
 * http://www.openjs.com/scripts/events/keyboard_shortcuts/
 * Version : 2.01.B
 * By Binny V A
 * License : BSD
 */
shortcut = {
	'all_shortcuts':{},//All the shortcuts are stored in this array
	'add': function(shortcut_combination,callback,opt) {
		//Provide a set of default options
		var default_options = {
			'type':'keydown',
			'propagate':false,
			'disable_in_input':false,
			'target':document,
			'keycode':false
		}
		if(!opt) opt = default_options;
		else {
			for(var dfo in default_options) {
				if(typeof opt[dfo] == 'undefined') opt[dfo] = default_options[dfo];
			}
		}

		var ele = opt.target;
		if(typeof opt.target == 'string') ele = document.getElementById(opt.target);
		var ths = this;
		shortcut_combination = shortcut_combination.toLowerCase();

		//The function to be called at keypress
		var func = function(e) {
			e = e || window.event;
			
			if(opt['disable_in_input']) { //Don't enable shortcut keys in Input, Textarea fields
				var element;
				if(e.target) element=e.target;
				else if(e.srcElement) element=e.srcElement;
				if(element.nodeType==3) element=element.parentNode;

				if(element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return;
			}
	
			//Find Which key is pressed
			if (e.keyCode) code = e.keyCode;
			else if (e.which) code = e.which;
			var character = String.fromCharCode(code).toLowerCase();
			
			if(code == 188) character=","; //If the user presses , when the type is onkeydown
			if(code == 190) character="."; //If the user presses , when the type is onkeydown

			var keys = shortcut_combination.split("+");
			//Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
			var kp = 0;
			
			//Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
			var shift_nums = {
				"`":"~",
				"1":"!",
				"2":"@",
				"3":"#",
				"4":"$",
				"5":"%",
				"6":"^",
				"7":"&",
				"8":"*",
				"9":"(",
				"0":")",
				"-":"_",
				"=":"+",
				";":":",
				"'":"\"",
				",":"<",
				".":">",
				"/":"?",
				"\\":"|"
			}
			//Special Keys - and their codes
			var special_keys = {
				'esc':27,
				'escape':27,
				'tab':9,
				'space':32,
				'return':13,
				'enter':13,
				'backspace':8,
	
				'scrolllock':145,
				'scroll_lock':145,
				'scroll':145,
				'capslock':20,
				'caps_lock':20,
				'caps':20,
				'numlock':144,
				'num_lock':144,
				'num':144,
				
				'pause':19,
				'break':19,
				
				'insert':45,
				'home':36,
				'delete':46,
				'end':35,
				
				'pageup':33,
				'page_up':33,
				'pu':33,
	
				'pagedown':34,
				'page_down':34,
				'pd':34,
	
				'left':37,
				'up':38,
				'right':39,
				'down':40,
	
				'f1':112,
				'f2':113,
				'f3':114,
				'f4':115,
				'f5':116,
				'f6':117,
				'f7':118,
				'f8':119,
				'f9':120,
				'f10':121,
				'f11':122,
				'f12':123
			}
	
			var modifiers = { 
				shift: { wanted:false, pressed:false},
				ctrl : { wanted:false, pressed:false},
				alt  : { wanted:false, pressed:false},
				meta : { wanted:false, pressed:false}	//Meta is Mac specific
			};
                        
			if(e.ctrlKey)	modifiers.ctrl.pressed = true;
			if(e.shiftKey)	modifiers.shift.pressed = true;
			if(e.altKey)	modifiers.alt.pressed = true;
			if(e.metaKey)   modifiers.meta.pressed = true;
                        
			for(var i=0; k=keys[i],i<keys.length; i++) {
				//Modifiers
				if(k == 'ctrl' || k == 'control') {
					kp++;
					modifiers.ctrl.wanted = true;

				} else if(k == 'shift') {
					kp++;
					modifiers.shift.wanted = true;

				} else if(k == 'alt') {
					kp++;
					modifiers.alt.wanted = true;
				} else if(k == 'meta') {
					kp++;
					modifiers.meta.wanted = true;
				} else if(k.length > 1) { //If it is a special key
					if(special_keys[k] == code) kp++;
					
				} else if(opt['keycode']) {
					if(opt['keycode'] == code) kp++;

				} else { //The special keys did not match
					if(character == k) kp++;
					else {
						if(shift_nums[character] && e.shiftKey) { //Stupid Shift key bug created by using lowercase
							character = shift_nums[character]; 
							if(character == k) kp++;
						}
					}
				}
			}
			
			if(kp == keys.length && 
						modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
						modifiers.shift.pressed == modifiers.shift.wanted &&
						modifiers.alt.pressed == modifiers.alt.wanted &&
						modifiers.meta.pressed == modifiers.meta.wanted) {
				callback(e);
	
				if(!opt['propagate']) { //Stop the event
					//e.cancelBubble is supported by IE - this will kill the bubbling process.
					e.cancelBubble = true;
					e.returnValue = false;
	
					//e.stopPropagation works in Firefox.
					if (e.stopPropagation) {
						e.stopPropagation();
						e.preventDefault();
					}
					return false;
				}
			}
		}
		this.all_shortcuts[shortcut_combination] = {
			'callback':func, 
			'target':ele, 
			'event': opt['type']
		};
		//Attach the function with the event
		if(ele.addEventListener) ele.addEventListener(opt['type'], func, false);
		else if(ele.attachEvent) ele.attachEvent('on'+opt['type'], func);
		else ele['on'+opt['type']] = func;
	},

	//Remove the shortcut - just specify the shortcut and I will remove the binding
	'remove':function(shortcut_combination) {
		shortcut_combination = shortcut_combination.toLowerCase();
		var binding = this.all_shortcuts[shortcut_combination];
		delete(this.all_shortcuts[shortcut_combination])
		if(!binding) return;
		var type = binding['event'];
		var ele = binding['target'];
		var callback = binding['callback'];

		if(ele.detachEvent) ele.detachEvent('on'+type, callback);
		else if(ele.removeEventListener) ele.removeEventListener(type, callback, false);
		else ele['on'+type] = false;
	}
}

function inithotkey() {

shortcut.add("Ctrl+Alf+F",function() {
//var tagname = "textarea"
//var search = prompt("Search", "");
//var replace = prompt("Replace", "");
//var regexsearch = new RegExp(search,"gi");
//for(i=0;i<10;i++) 
//{
//var string = document.getElementsByTagName(tagname)[i].value;
//var replacedString = string.replace(regexsearch, replace);
//document.getElementsByTagName(tagname)[i].value = replacedString;
//
var regexModifier = "ig"
var search = prompt("Search", "");
var replace = prompt("Replace", "");
var useRegex = prompt("RegEx", "false");
if (useRegex != "false") regexModifier = prompt("RegexModifier", "ig");
if (useRegex = "false") search = escapeRegExp(search);
var regexsearch = new RegExp(search, regexModifier);
var textareaArray = document.getElementsByTagName('textarea');
var textareaArrayLen = textareaArray.length;
for (i = 0; i < textareaArrayLen; i++) 
{
var oldString = textareaArray[i].value;
var newString = oldString.replace(regexsearch, replace);
textareaArray[i].value = newString;
}
function escapeRegExp(s) 
{
return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
});



shortcut.add("Ctrl+Alt+Z",function() {
alert("Hi there!");
delete open;
open=window.BACKUPFUNCTIONopen;
});



shortcut.add("Ctrl+Alt+X",function() {
var BACKUPFUNCTIONXMLHttpRequest=XMLHttpRequest;
var XMLHttpRequestpromptvar = "c";
function NoXMLHttpRequest(e){return 1}
XMLHttpRequest = (function() {
    var proxy = XMLHttpRequest;
    return function(evt, evt2, evt3) {
	//if (window.confirm("Allow XMLHttpRequest, sure ? [" + evt + evt2 + evt3 + "]") == true)
	//XMLHttpRequestpromptvar = "c";
	varprompt = window.prompt("Allow XMLHttpRequest, sure ? [" + evt + evt2 + "]", window['XMLHttpRequestpromptvar']);
	if (varprompt == "c")
	   {
	    window['XMLHttpRequestpromptvar'] = varprompt;
        return proxy.apply(this, arguments);
        }
        else if (varprompt == "s")
        {
		window['XMLHttpRequestpromptvar'] = "s";
	    return 0;
        }
		else if (varprompt == "cc")
		{
		window['XMLHttpRequestpromptvar'] = varprompt;
		XMLHttpRequest = BACKUPFUNCTIONXMLHttpRequest;
        return proxy.apply(this, arguments);
		}
		else
		{
		window['XMLHttpRequestpromptvar'] = varprompt;
		XMLHttpRequest = NoXMLHttpRequest;
		}
    }
})();
});


shortcut.add("Ctrl+Alt+C",function() {
ondemandimgload();
});



shortcut.add("Ctrl+Alt+V",function() {
function getHTMLOfSelection() {
    var range;
    if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        return range.htmlText;
    } else if (window.getSelection) {
        var selection = window.getSelection();
        if (selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
            var clonedSelection = range.cloneContents();
            var div = document.createElement('div');
            div.appendChild(clonedSelection);
            return div.innerHTML;
        } else {
            return '';
        }
    } else {
        return '';
    }
}
alert(getHTMLOfSelection());
});


shortcut.add("Ctrl+Alt+B",function() {
document.getElementById("fixeddiv").style.display="block";
});

shortcut.add("Ctrl+Alt+N",function() {
window.removeEventListener("visibilitychange", onnotfocusfunc);
alert("Disabled onnotfocus");
});

shortcut.add("Ctrl+Alt+M",function() {
for (var i =  document.getElementsByTagName("style").length - 1; i >= 0; i--) {
    document.getElementsByTagName("style")[i].type = "text/css"
}
for (var i =  document.getElementsByTagName("link").length - 1; i >= 0; i--) {
    document.getElementsByTagName("link")[i].rel = "stylesheet"
    document.getElementsByTagName("link")[i].type = "text/css"
}
});

shortcut.add("Ctrl+Alt+A",function() {
ondemandstyleload();
});

shortcut.add("Ctrl+Alt+G",function() {
document.body.addEventListener('mousedown', function getselector (e){
     var c = getUniqueSelector(e.target);
         var  element = document.querySelector(c);
          //console.log(element);
              //alert(c);
    document.querySelector(c).style.outline = "2px dotted black";
	setTimeout(function (){document.querySelector(c).style.outline = "none";document.body.removeEventListener("mousedown", getselector);}, 5000);
      alert(c);
        //element.style.color = "red"
   });
   
});













}


function ondemandimgload() {
for (var i =  document.getElementsByTagName("img").length - 1; i >= 0; i--) {
if (document.getElementsByTagName("img")[i].hasAttribute("data-src")) {
document.getElementsByTagName("img")[i].src = document.getElementsByTagName("img")[i].getAttribute("data-src");
}
}
}

function ondemandstyleload() {
for (var i =  document.getElementsByTagName("style").length - 1; i >= 0; i--) {
    document.getElementsByTagName("style")[i].type = "text/css"
}
for (var i =  document.getElementsByTagName("link").length - 1; i >= 0; i--) {
    document.getElementsByTagName("link")[i].rel = "stylesheet"
    document.getElementsByTagName("link")[i].type = "text/css"
}
/*for (var i =  document.getElementsByTagName("*").length - 1; i >= 0; i--) {
    document.getElementsByTagName("*")[i].innerHTML = document.getElementsByTagName("*")[i].innerHTML.replace(/delayedstyle=/g, "style=");
}*/
}


window.addEventListener ("DOMContentLoaded", Greasemonkey_main99, false);
function Greasemonkey_main99 ()
{
inithotkey();
}


































var count = 0
var timer    
var timeout = 1000;
window.addEventListener99999("click", function (evt) {
count++
timer = setTimeout(function () {
if (count == 2) 
{
 //nothing yet
}
if (count == 7) 
{
for(var i = 0; i < document.getElementsByTagName("img").length; i++) {
document.getElementsByTagName("img")[i].src = document.getElementsByTagName("img")[i].getAttribute("data-src");
}
//document.documentElement.innerHTML = document.documentElement.innerHTML.replace(/shitimg/gi, "img");
}
/*
if (count == 4)
{
document.documentElement.innerHTML = document.documentElement.innerHTML.replace(/shitiframe/gi, "iframe");
document.documentElement.innerHTML = document.documentElement.innerHTML.replace(/shitobject/gi, "object");
document.documentElement.innerHTML = document.documentElement.innerHTML.replace(/shitembed/gi, "embed");
document.documentElement.innerHTML = document.documentElement.innerHTML.replace(/shitvideo/gi, "video");
document.documentElement.innerHTML = document.documentElement.innerHTML.replace(/shitapplet/gi, "applet");
for(var i = 0; i < document.getElementsByTagName("style").length; i++) {
    document.getElementsByTagName("style")[i].type = "text/css"
}
for(var i = 0; i < document.getElementsByTagName("link").length; i++) {
    document.getElementsByTagName("link")[i].type = "text/css"
}*/
/*for(var i = 0; i <= window.frames.length; i++)
{
document.documentElement.innerHTML = document.documentElement.innerHTML.replace(/shitimg/gi, "img");
document.documentElement.innerHTML = document.documentElement.innerHTML.replace(/shitiframe/gi, "iframe");
document.documentElement.innerHTML = document.documentElement.innerHTML.replace(/shitobject/gi, "object");
document.documentElement.innerHTML = document.documentElement.innerHTML.replace(/shitembed/gi, "embed");
document.documentElement.innerHTML = document.documentElement.innerHTML.replace(/shitvideo/gi, "video");
document.documentElement.innerHTML = document.documentElement.innerHTML.replace(/shitapplet/gi, "applet");    
}*/
//document.documentElement.innerHTML = document.documentElement.innerHTML.replace(/shitscript/gi, "script");
//document.documentElement.innerHTML = document.documentElement.innerHTML.replace(/shitstyle/gi, "style");
//document.documentElement.innerHTML = document.documentElement.innerHTML.replace(/shitlink/gi, "link");
//}
/*
if (count == 5)
{
document.documentElement.innerHTML = document.documentElement.innerHTML.replace(/shitobject/gi, "object");
}

if (count == 6)
{
document.documentElement.innerHTML = document.documentElement.innerHTML.replace(/shitembed/gi, "embed");
}

if (count == 7)
{
document.documentElement.innerHTML = document.documentElement.innerHTML.replace(/shitvideo/gi, "video");
}

if (count == 8)
{
document.documentElement.innerHTML = document.documentElement.innerHTML.replace(/shitapplet/gi, "applet");
}

if (count == 9)
{
document.documentElement.innerHTML = document.documentElement.innerHTML.replace(/shitscript/gi, "script");
}

if (count == 10)
{
document.documentElement.innerHTML = document.documentElement.innerHTML.replace(/shitstyle/gi, "style");
document.documentElement.innerHTML = document.documentElement.innerHTML.replace(/shitlink/gi, "link");
*/

count = 0;
clearTimeout(timer);
timer = null;
}, timeout);
});