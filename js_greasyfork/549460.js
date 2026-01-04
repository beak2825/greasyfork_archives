// ==UserScript==
// @name        Seamless PixelDrain Bypasser
// @namespace   Violentmonkey Scripts
// @match       https://pixeldrain.com/u/*
// @match       https://pixeldrain.com/l/*
// @version     1.0
// @author      internetenjoyer
// @license     GPL-3.0-or-later
// @description Bypass rate-limiting using pd.cybar.xyz
// @run-at      document-start
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @top-level-await
// @downloadURL https://update.greasyfork.org/scripts/549460/Seamless%20PixelDrain%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/549460/Seamless%20PixelDrain%20Bypasser.meta.js
// ==/UserScript==

function waitForElement(selector, callback) {
  const observer = new MutationObserver((mutations, obs) => {
    const element = document.querySelector(selector);
    if (element) {
      obs.disconnect();
      callback(element);
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  const existingElement = document.querySelector(selector);
  if (existingElement) {
    observer.disconnect();
    callback(existingElement);
  }
}

let svelte;

waitForElement("script[src^='/res/svelte/']", (el) => {
  svelte = el;
  el.remove();

  GM_xmlhttpRequest({
    url: "https://pd.cybar.xyz/",
    onload: data => {
      unsafeWindow.api_endpoint = URL.parse(data.finalUrl).origin + "/api"
      document.head.appendChild(svelte);
    }
  });

  if (unsafeWindow.viewer_data.type === "file") {
    unsafeWindow.viewer_data.api_response.allow_video_player = 1;
    unsafeWindow.viewer_data.api_response.show_ads = 0;
  } else {
    for (const file of unsafeWindow.viewer_data.api_response.files) {
      file.allow_video_player = 1;
      file.show_ads = 0;
    }
  }
});