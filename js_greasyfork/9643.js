// ==UserScript==
// @name        ORLY.db no xxx releases
// @description Remove xxx-tagged records in the release log
// @include     http://www.orlydb.com/*
// @include     http://orlydb.com/*
// @version     1.0.4
// @namespace   wOxxOm.scripts
// @author      wOxxOm
// @license     MIT License
// @run-at      document-start
// @require     https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @downloadURL https://update.greasyfork.org/scripts/9643/ORLYdb%20no%20xxx%20releases.user.js
// @updateURL https://update.greasyfork.org/scripts/9643/ORLYdb%20no%20xxx%20releases.meta.js
// ==/UserScript==

processNodes([].slice.call(document.querySelectorAll('a[href*="/xxx"]')));
setMutationHandler(document, 'a[href*="/xxx"]', processNodes);

function processNodes(nodes) {
  nodes.forEach(function(n) {
    if (n.parentNode.id != 'logo')
      n.parentNode.parentNode.remove();
  });
  return true;
}
