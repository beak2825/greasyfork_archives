// ==UserScript==
// @name          CSS: uakino.best
// @description   Corrections to UI of uakino.best
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         *://uakino.best/*
// @match         *://*.uakino.best/*
// @match         *://uakino.me/*
// @match         *://*.uakino.me/*
// @icon          https://uakino.best/templates/uakino/images/icons/favicon-32x32.png
// @version       1.0.0
// @license       MIT
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/551191/CSS%3A%20uakinobest.user.js
// @updateURL https://update.greasyfork.org/scripts/551191/CSS%3A%20uakinobest.meta.js
// ==/UserScript==

(function() {
  'use strict';

  //Workaround: This document requires 'TrustedHTML' assignment
  if (window.trustedTypes && trustedTypes.createPolicy) {
    if (!trustedTypes.defaultPolicy) {
      const passThroughFn = (x) => x;
      trustedTypes.createPolicy('default', {
        createHTML: passThroughFn,
        createScriptURL: passThroughFn,
        createScript: passThroughFn,
      });
    }
  }

  //CSS for any mode
  var css = `
  /*Change color of episodes*/
  .playlists-items li.watched:not(.active) {
    border-color: #562318 !important;
    color: #888888 !important;
  }
  .playlists-items li.watched:not(.active) > span {
    opacity: 0.5 !important;
  }
  .playlists-items li.notwatched:not(.active) {
    background-color: #3F1810 !important;
  }
  .playlists-items li.notwatched:not(.active) > span {
    opacity: 0.2 !important;
  }
  .playlists-items li:not(.active):hover {
    background-color: #6B2B1D !important;
  }
  `;

  const rootCallback = function (mutationsList, observer) {
    //Add classes to episodes
    document.querySelectorAll(".playlists-items li:not(.watched) > span.watched").forEach(makeWatched);
    document.querySelectorAll(".playlists-items li:not(.notwatched) > span:not(.watched)").forEach(makeNotWatched);
  }

  const rootNode = document.querySelector("body");
  if (rootNode != null) {
    const rootObserver = new MutationObserver(rootCallback);
    rootObserver.observe(rootNode, {childList: true, subtree: true, attributes: true, characterData: false});
  }

  function makeWatched(link) { //Mark episodes as watched
    link.parentElement.className = link.parentElement.className.replace( /(?:^|\s)watched(?!\S)/g , '' );
    link.parentElement.className = link.parentElement.className.replace( /(?:^|\s)notwatched(?!\S)/g , '' );
    link.parentElement.className += " watched";
  }

  function makeNotWatched(link) { //Mark episodes as not watched
    link.parentElement.className = link.parentElement.className.replace( /(?:^|\s)watched(?!\S)/g , '' );
    link.parentElement.className = link.parentElement.className.replace( /(?:^|\s)notwatched(?!\S)/g , '' );
    link.parentElement.className += " notwatched";
  }

  if (typeof GM_addStyle != 'undefined') {
    GM_addStyle(css);
  } else if (typeof PRO_addStyle != 'undefined') {
    PRO_addStyle(css);
  } else if (typeof addStyle != 'undefined') {
    addStyle(css);
  } else {
    var node = document.createElement('style');
    node.type = 'text/css';
    node.appendChild(document.createTextNode(css));
    document.documentElement.appendChild(node);
  }

})();
