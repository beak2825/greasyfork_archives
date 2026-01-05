// ==UserScript==
// @name          mTurk survey highlight words
// @description   Proof that word highlighting makes easy attention checks obvious
// @namespace     http://wtwf.com/
// @include       http://*.qualtrics.com/*
// @include       https://www.surveymonkey.com/*
// @include       https://docs.google.com/forms/*
// @version	  1.1
// @grant       none

// @downloadURL https://update.greasyfork.org/scripts/8093/mTurk%20survey%20highlight%20words.user.js
// @updateURL https://update.greasyfork.org/scripts/8093/mTurk%20survey%20highlight%20words.meta.js
// ==/UserScript==

(function() {

// key: word to match, value a dictionary of style elements to apply
// to blocks containing that word.

// all keywords MUST be lower case, no capitals at all!
// replace "example words" and "keywords" with new keywords you want to highlight, and just copy those which are already there to add additional keywords
// if you add more keywords, make sure that only the last one has no comma after the color
// note that the entire sentence the word is found in will be highlighted in the colour you choose, ensuring you don't miss it

const COLOR_MAP = {
   "ignore": {"color": "red"},
   "attention": {"color": "red"},
   "instructions": {"color": "red"},
   "reading": {"color": "red"}

};

function highlightText() {

  var allTextNodes = document.evaluate('//text()', document, null,
                                       

XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                       null);

  for (var i = 0; i < allTextNodes.snapshotLength; i++) {
    var ele = allTextNodes.snapshotItem(i);
    for (var key in COLOR_MAP) {
      if (ele.nodeValue.toLowerCase().indexOf(key) != -1) {
        // TODO(ark) perhaps make it only highlight the word?
        var span = document.createElement("span");
        ele.parentNode.replaceChild(span, ele);
        span.appendChild(ele);
        for (var css in COLOR_MAP[key]) {
          span.style[css] = COLOR_MAP[key][css];
        }
      }
    }
  }
}

  highlightText();
})();