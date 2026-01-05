// ==UserScript==
// @name        Behance - fetch lazy-load images immediately
// @description Fetch lazy-load images immediately at document load
// @include     https://www.behance.net/*
// @version     1.0.5
// @namespace   wOxxOm.scripts
// @author      wOxxOm
// @license     MIT License
// @run-at      document-start
// @require     https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @downloadURL https://update.greasyfork.org/scripts/5815/Behance%20-%20fetch%20lazy-load%20images%20immediately.user.js
// @updateURL https://update.greasyfork.org/scripts/5815/Behance%20-%20fetch%20lazy-load%20images%20immediately.meta.js
// ==/UserScript==

window.addEventListener('DOMContentLoaded', function(e) {
  processNodes([].slice.call(document.querySelectorAll('.js-picture-lazy')));
  setMutationHandler(document.body, '.js-picture-lazy', processNodes);
});

function processNodes(nodes) {
  nodes.forEach(function(n) {
    if (img = n.querySelector('img')) {
      img.src = img.dataset.src;
      img.removeAttribute('width');
      img.removeAttribute('height');
      img.removeAttribute('style');
    }
    var picture = document.createElement('picture');
    while (n.firstElementChild)
      picture.appendChild(n.removeChild(n.firstElementChild));
    n.parentNode.replaceChild(picture, n);
    n.remove();
  });
}
