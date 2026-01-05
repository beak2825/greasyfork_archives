// ==UserScript==
// @name       Fuck you kindly
// @namespace  http://ackwell.com/
// @version    0.2.1
// @description  Because nobody actually thanks you ever
// @include    http://*
// @include    https://*
// @copyright  2014+, ackwell
// @grant      none
// @downloadURL https://update.greasyfork.org/scripts/5730/Fuck%20you%20kindly.user.js
// @updateURL https://update.greasyfork.org/scripts/5730/Fuck%20you%20kindly.meta.js
// ==/UserScript==

// Defining this as an array up here so I can make it configurable later.
// It's defined as `'newValue' => [/oldValue/, ...]` so that I can include regex objects here, so that they don't need to be rebuilt
var replacements = {
  'fuck': [ 
    /\bthank/gi
  ]
};

// Generates a version of newValue that honors the casing of oldValue as best it can.
function updateStringKeepCase(newValue, oldValue) {
  var output = '',
      allCaps = true;

  for (var i = 0; i < newValue.length; i++) {
    var newChar = newValue.charAt(i);

    // If we have exceeded the length of the old string, assume lower case unless it has been allCaps so far.
    if (i >= oldValue.length) {
      if (allCaps) {
        output += newChar.toUpperCase();
      } else {
        outut += newChar.toLowerCase();
      }
      continue;
    }

    // Otherwise, copy the case of the original onto the new.
    var oldChar = oldValue.charAt(i);
    if (oldChar.toUpperCase() == oldChar) {
      output += newChar.toUpperCase();
    } else {
      allCaps = false;
      output += newChar.toLowerCase();
    }
  }
  
  return output;
}

// Thanks to sixthgear on stack overflow
function recursiveReplace(element) {
  if (!element) {
    element = document.body;
  }
  
  // Ignore some troublesome tag types and so on
  if (element.nodeType == Node.COMMENT_NODE) { return; }
  if (element.tagName) {
    var tagName = element.tagName.toLowerCase();
    if (tagName == 'script' || tagName == 'style') { return; }
  }
  
  var nodes = element.childNodes;
  
  // Recurse over tree, running replace on all text nodes found.
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].nodeType == Node.TEXT_NODE) {
      // It's a text node, run checks

      // Loop over all replacement regexes
      for (var newValue in replacements) {
        regexes = replacements[newValue];

        for (var j = 0; j < regexes.length; j++) {
          // Using passthrough for extra param
          nodes[i].textContent = nodes[i].textContent.replace(regexes[j], function(match) {
            return updateStringKeepCase(newValue, match);
          });
        }
      }
      
      // nodes[i].textContent = nodes[i].textContent.replace(regex, caseSensitiveFuck);
      
    } else {
      // It's not a text node, recurse
      recursiveReplace(nodes[i]);
    }
  }
}

// Call once on full document
recursiveReplace(document);

// Setup a new observer to get notified of changes to the DOM
var observer = new MutationObserver(function(mutations) {
  // Loop over mutations observed, and only enact our fuckery on the nodes that were changed.
  mutations.forEach(function(mutation) {
    recursiveReplace(mutation.target);
  });
});

// Start observing for mutations
observer.observe(document, {
  childList: true,
  characterData: true,
  subtree: true
});
