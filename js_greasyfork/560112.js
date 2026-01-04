// ==UserScript==
// @name Falke products
// @description Remove duplicate product entries from product listings
// @namespace https://greasyfork.org/users/1552101
// @license MIT
// @icon https://www.google.com/s2/favicons?sz=64&domain=falke.com
// @match https://www.falke.com/*
// @grant none
// @version 0.1
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/560112/Falke%20products.user.js
// @updateURL https://update.greasyfork.org/scripts/560112/Falke%20products.meta.js
// ==/UserScript==

/**
 * - intercepts client-side API requests and removes variants of already visible products for each category
 */
(function () {
  "use strict";

  const originalFetch = window.fetch;
  const categoryCache = new Map();

  function filterElements(seenProductKeys, elements) {
    const uniqueElements = [];

    for (const element of elements) {
      const productId = element.data.id.split("_")[0];

      if (!seenProductKeys.has(productId)) {
        seenProductKeys.add(productId);

        uniqueElements.push(element);
      }
    }

    return uniqueElements;
  }

  async function processResponse(seenProductKeys, response) {
    const data = await response.json();

    data.elementsList = filterElements(seenProductKeys, data.elementsList);

    return new Response(JSON.stringify(data), response);
  }

  window.fetch = async function (...args) {
    const [url] = args;

    const u = new URL(url);
    const path = u.pathname;
    const params = u.searchParams;

    if (
      u.hostname === "www.falke.com" &&
      params.get("ajax") === "true"
    ) {

      if (!categoryCache.has(path)) {
        categoryCache.set(path, new Set());
      }

      const seenProductKeys = categoryCache.get(path);

      if (seenProductKeys) {
        const response = await originalFetch(...args);
        return processResponse(seenProductKeys, response.clone());
      }
    }

    return originalFetch(...args);
  };
})();
