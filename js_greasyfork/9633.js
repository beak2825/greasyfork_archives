// ==UserScript==
// @name        HindustanTimes - fetch lazy-load images immediately
// @description Fetch lazy-load images immediately at document load
// @include     http://www.hindustantimes.com/*
// @version     1.0.1
// @namespace   wOxxOm.scripts
// @author      wOxxOm
// @license     MIT License
// @run-at      document-start
// @grant       none
// @require     https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @downloadURL https://update.greasyfork.org/scripts/9633/HindustanTimes%20-%20fetch%20lazy-load%20images%20immediately.user.js
// @updateURL https://update.greasyfork.org/scripts/9633/HindustanTimes%20-%20fetch%20lazy-load%20images%20immediately.meta.js
// ==/UserScript==

setMutationHandler(document, 'img.lazy', function(nodes) {
  nodes.forEach(function(n) {
    n.src = n.dataset.original;
    n.classList.remove('lazy');
  });
  return true;
});
