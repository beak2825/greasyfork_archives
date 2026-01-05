// ==UserScript==
// @name TPT Syntax Highlighted Code Boxes
// @version 1.3.0
// @description Syntax highlights <code> boxes on the powder toy forums.
// @author boxmein
// @match *://powdertoy.co.uk/Discussions/Thread/*
// @namespace http://boxmein.net
// @downloadURL https://update.greasyfork.org/scripts/6727/TPT%20Syntax%20Highlighted%20Code%20Boxes.user.js
// @updateURL https://update.greasyfork.org/scripts/6727/TPT%20Syntax%20Highlighted%20Code%20Boxes.meta.js
// ==/UserScript==
// last updated: Tue Dec 02 2014 21:16:57 GMT+0200 (FLE Standard Time)

/*
Note to moderators / anyone interested:
=====

The following libraries are served off of a well-known provider of Javascript 
libraries called [cdnjs][1], which happens to be in your whitelist of usable
CDNs.

I have refrained from using @require in the script manifest in order to fully 
support Google Chrome, a browser used by more than half of Internet users [(StatCounter Oct 2014)][2]. 
This is a [known issue][3] which means that @require support has been willingly
left out of Chrome. I hope that this is more than enough reasons to 'break' the
rules of having to use @require.

~boxmein

[1]: http://cdnjs.cloudflare.com
[2]: http://gs.statcounter.com/#desktop-browser-ww-monthly-201410-201410-bar
[3]: http://www.chromium.org/developers/design-documents/user-scripts
*/


// Highlight.js is the highlighting library.
var HLJS = "//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/highlight.min.js";

// Language support for Lua isn't included in ^that distribution by default
var LUA = "//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/languages/lua.min.js";

// Highlight.js only slaps on class names, you also need to style the classes! 
var HL_STYLE = "//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/styles/github.min.css";


(function() {
  'use strict';

  // Don't run inside iframes (Looking at you GreaseMonkey + TinyMCE)
  if (window.top !== window.self) return; 

  // Runs a function in the document. Basically like a Content Script.
  // http://wiki.greasespot.net/Content_Script_Injection
  function contentEval(source) {

    // Check for function input.
    if ('function' == typeof source) {
      // Execute this function with no arguments, by adding parentheses.
      // One set around the function, required for valid syntax, and a
      // second empty set calls the surrounded function.
      source = '(' + source + ')();'
    }

    // Create a script node holding this  source code.
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = source;

    // Insert the script node into the page, so it will run, and immediately
    // remove it to clean up.
    document.body.appendChild(script);
    //document.body.removeChild(script);
  }


  // Given a src attribute, makes a <script> tag into the end of <body>
  function contentScript(source) {
    var tag = document.createElement('script');
    tag.setAttribute('type', 'application/javascript');
    tag.src = source;

    document.body.appendChild(tag);
    //document.body.removeChild(tag);
    return tag;
  }

  var hl = contentScript(HLJS);

  hl.onload = function() {

    // Set an ID, because after *that* loads, hljs is finally ready to highlight
    // Lua as well as C++.
    var lu = contentScript(LUA);
    lu.id = "luaapi";


    // Add the CSS for good measure too
    var st = document.createElement('link');
    st.type = 'text/css';
    st.rel = 'stylesheet';
    st.href = HL_STYLE;
    document.head.appendChild(st);

    contentEval(function() {

      hljs.configure({useBR: true});

      function highlightCode(){
        // by default hljs highlights <pre><code>, have to override
        var ds = document.querySelectorAll('code');
        for(var d = 0; d < ds.length; d++)
          window.hljs.highlightBlock(ds[d]);  
      }
      
      window.highlightCode = highlightCode;

      document.getElementById('luaapi').onload = highlightCode;
    });

  };
})();
