// ==UserScript==
// @name         YouTube Avatars Fix
// @version      0.4
// @description  Исправляет отображение аватарок на YouTube
// @author       frz
// @run-at       document-start
// @namespace    https://greasyfork.org/users/681286
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match        https://*.youtube.com/*
// @match        https://studio.youtube.com/*
// @match        https://yt3.googleusercontent.com/*
// @match        https://yt4.ggpht.com/*
// @match        https://yt4.googleusercontent.com/*
// @match        https://vidiq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550297/YouTube%20Avatars%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/550297/YouTube%20Avatars%20Fix.meta.js
// ==/UserScript==
 
(function () {
  "use strict";
 
  function fixAvatar(img) {
    if (!img || !img.src) return;
    if (img.src.includes("yt3.ggpht.com")) {
      img.src = img.src.replace("yt3.ggpht.com", "yt4.ggpht.com");
    }
    if (img.src.includes("yt3.googleusercontent.com")) {
      img.src = img.src.replace("yt3.googleusercontent.com", "yt4.googleusercontent.com");
    }
  }
 
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes" && mutation.attributeName === "src") {
        fixAvatar(mutation.target);
      }
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach(node => {
          if (node.tagName === "IMG") fixAvatar(node);
          if (node.querySelectorAll) node.querySelectorAll("img").forEach(fixAvatar);
        });
      }
    }
  });
 
  observer.observe(document.documentElement, {
    subtree: true,
    attributes: true,
    attributeFilter: ["src"],
    childList: true,
  });
 
  document.querySelectorAll("img").forEach(fixAvatar);
})();