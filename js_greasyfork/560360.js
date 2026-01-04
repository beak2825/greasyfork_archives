// ==UserScript==
// @name         StudyGo 30 second preview bypass
// @name:nl      StudyGo 30 seconden-preview bypasser
// @license      MIT
// @namespace    https://greasyfork.org/nl/users/1552919-dandandev
// @version      1.0.1
// @description  Opens StudyGo videos with controls enabled in a new tab
// @description:nl Opent StudyGo videos met controls aan in een nieuw tabblad
// @match        https://studygo.com/*
// @match        https://www.studygo.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560360/StudyGo%2030%20second%20preview%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/560360/StudyGo%2030%20second%20preview%20bypass.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const VIMEO_HOST = "player.vimeo.com";

  function handleVimeoIframe(iframe) {
    if (!iframe.src || !iframe.src.includes(VIMEO_HOST)) return;
    window.open(iframe.src.replace("controls=0", "controls=1"), "_blank");
    document.querySelector(".media-modal-close-btn")?.click();
  }

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        if (node.tagName === "IFRAME") handleVimeoIframe(node);
        node.querySelectorAll?.("iframe").forEach(handleVimeoIframe);
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
