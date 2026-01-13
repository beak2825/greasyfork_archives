// ==UserScript==
// @name         Replace x with xcancel
// @namespace    http://tampermonkey.net/
// @version      2026-01-11
// @description  Hacky solution to replace all x.com links with xcancel.
// @author       For You
// @match        https://www.destiny.gg/bigscreen
// @icon         https://www.google.com/s2/favicons?sz=64&domain=destiny.gg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562290/Replace%20x%20with%20xcancel.user.js
// @updateURL https://update.greasyfork.org/scripts/562290/Replace%20x%20with%20xcancel.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const ORIGINAL_DOMAIN = "x.com";
  const REPLACEMENT_DOMAIN = "xcancel.com";

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.querySelector) {
          const link = node.querySelector(".text a");
          replaceLink(link);
        }
      }
    }
  });

  function replaceLink(element) {
    if (!element?.innerText) return;

    element.innerText = element.innerText.replaceAll(ORIGINAL_DOMAIN, REPLACEMENT_DOMAIN);

    const href = element.getAttribute("href");
    if (href) {
      element.setAttribute("href", href.replace(ORIGINAL_DOMAIN, REPLACEMENT_DOMAIN));
    }
  }

  function register() {
    const chatFrame = document.querySelector("#chat-wrap > iframe");
    const chatDoc = chatFrame?.contentDocument;
    const chat = chatDoc?.querySelector("#chat");

    if (!chat) {
      // Dog ass loop to register the observer
      setTimeout(register, 1000);
      return;
    }

    chatDoc.querySelectorAll(".text a").forEach(replaceLink);

    observer.observe(chat, {
      subtree: true,
      childList: true,
    });
  }

  register();
})();