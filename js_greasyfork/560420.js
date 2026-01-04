// ==UserScript==
// @name         Remove sponsored posts from Reddit
// @namespace    https://github.com/b263/user-scripts
// @version      1.0.0
// @description  Removes sponsored posts from Reddit using modern DOM observation.
// @author       Bastian Bräu
// @match        https://www.reddit.com/*
// @grant        none
// @license      ISC
// @homepageURL  https://github.com/b263/user-scripts
// @supportURL   https://github.com/b263/user-scripts/issues
// @downloadURL https://update.greasyfork.org/scripts/560420/Remove%20sponsored%20posts%20from%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/560420/Remove%20sponsored%20posts%20from%20Reddit.meta.js
// ==/UserScript==

const AD_CONTAINER = 'shreddit-ad-post';

let observer = null;

function removeAds() {
  const ads = document.querySelectorAll(AD_CONTAINER);
  ads.forEach(ad => {
    try {
      ad.remove();
    } catch (error) {}
  });
}

function shouldProcessMutation(mutation) {
  if (mutation.type !== 'childList' || mutation.addedNodes.length === 0) {
    return false;
  }

  return Array.from(mutation.addedNodes).some(node => {
    if (node.nodeType !== Node.ELEMENT_NODE) return false;

    if (node.matches?.(AD_CONTAINER)) {
      return true;
    }

    if (node.querySelector) {
      return !!node.querySelector(AD_CONTAINER);
    }

    return false;
  });
}

function handleMutations(mutations) {
  const relevantMutations = mutations.filter(mutation =>
    shouldProcessMutation(mutation)
  );

  if (relevantMutations.length > 0) {
    removeAds();
  }
}

function setupObserver() {
  observer = new MutationObserver(handleMutations);

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function init() {
  removeAds();
  setupObserver();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
