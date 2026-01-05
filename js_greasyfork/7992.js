// ==UserScript==
// @name        Steam - always expand reviews
// @description Expands all reviews on a Steam game's description page
// @namespace   valacar
// @include     /^https?://store.steampowered.com/app//
// @version     0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7992/Steam%20-%20always%20expand%20reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/7992/Steam%20-%20always%20expand%20reviews.meta.js
// ==/UserScript==

function ExpandAllReviews(p) {
    var viewMoreLinks = p.querySelectorAll('.view_more a[onclick]');
    if (viewMoreLinks)
    {
        for (var i = 0; i < viewMoreLinks.length; i++) {
            viewMoreLinks[i].click();
        }
    }
}

// Handle dynamically created reviews
var callback = function(allmutations) {
    allmutations.map(function(mr) {
        for (var i = 0; i < mr.addedNodes.length; i++) {
            if (mr.addedNodes[i].id.match(/^Reviews/)) {
                ExpandAllReviews(mr.addedNodes[i]);
            }
        }
    });
}

var observer = new MutationObserver(callback);
var options = {
    'childList': true, // observe additions or deletion of child nodes
    'subtree': true    // observe addition or deletion of "grandchild" nodes
}

var targetNode = document.querySelector('#Reviews_summary');

// Watch for dynamically added reviews
observer.observe(targetNode, options);

// Expand static reviews
ExpandAllReviews(targetNode);
