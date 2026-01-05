// ==UserScript==
// @id             pastebin-linkize
// @name           pastebin link formatter
// @version        1.0
// @namespace      hax
// @author         
// @description    Turns URL patterns in pastebin pages into actual links. (see code for examples)
// @include        http://pastebin.com/*
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/8260/pastebin%20link%20formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/8260/pastebin%20link%20formatter.meta.js
// ==/UserScript==

/*
syntax: <contents> link (on one line)
=> <a href="link">contents</a>

ommitting [] will make
=> <a href="link">link</a>

-<contents> link (to leave the text plain)
=> <contents> link

contents may not include right angle brackets or % by itself.
(is unescaped though so %3e will become > and %25 will become %)
(and %51 will become Q if you don't want to type Q for some reason)

examples:

---<reddit>https://reddit.com/
=> --<reddit> https://reddit.com/
=> -<reddit> https://reddit.com/
=> <reddit> https://reddit.com/
-<hell> http://4chan.us/
=> <hell> http://4chan.us/
--https://github.com/ 
=> -https://github.com/
-<meetup> http://meetup.com
=> <meetup> http://meetup.com
-<no site %3e this one> https://pastebin.com
=> <no site %3e this one> https://pastebin.com/

*/

var urlpatt = new RegExp('(-)?(?:<([^>]*)>\\s*)?(https?://[^ ]+)','g');

function reformatOne(t) {
  var pieces = t.nodeValue.split(urlpatt);
  if(pieces.length == 1) {
    return 0;
  }
  var lastTextNode = null;
  function addtext(text) {
    console.log('add '+text);
    if(!text) return;
    if(lastTextNode==null) {
      lastTextNode = document.createTextNode(text);
      t.parentNode.insertBefore(lastTextNode,t);
    } else {
      lastTextNode.nodeValue += text;
    }
  }
  var islink = false;
  var i;
  console.log('pieces');
  console.log(t.nodeValue);
  console.log(pieces);
  for(i=0; i < pieces.length; ++i) {
    var piece = pieces[i];
    if(islink) {      
      // a ()? capture returns undefined instead of omitting the capture
      var skip = piece;
      var contents = pieces[++i];
      var href = pieces[++i];
      if(skip) {
        if(contents == undefined)
          contents = href;
        else
          contents = '<' + contents + '> ' + href;
        addtext(contents);
        islink = false;
        continue;
      }
      if(contents == undefined) {
        contents = href;
      } else {
        contents = unescape(contents);
      }
      
      var link = document.createElement('a');
      link.setAttribute('href',href);
      link.appendChild(document.createTextNode(contents));
      t.parentNode.insertBefore(link,t);
      lastTextNode = null;
      islink = false;
    } else {
      addtext(piece);
      islink = true;
    }
  }
  t.parentNode.removeChild(t);
  return i + 1;
}

function reformat(e) {
  if (e.nodeValue) {
    reformatOne(e);
  } else if(e.childNodes.length > 0) {
    // do NOT iterate and SAVE the next step
    // otherwise we descend into the links we created!
    var cur = e.childNodes[0];
    while(cur) {
      var next = cur.nextSibling;
      reformat(cur);
      cur = next;
    }    
  }
}

var div = document.getElementById('selectable');
if(div)
  reformat(div);