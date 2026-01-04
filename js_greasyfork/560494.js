// ==UserScript==
// @name         ChatGPT Veterans Claim 强制 US/USD
// @namespace    https://chatgpt.com/
// @version      0.1.0
// @description  将 /backend-api/payments/checkout 的 billing_details.country/currency 强制改为 US/USD（仅 veterans-claim 页面）
// @author       schweigen
// @match        https://chatgpt.com/veterans-claim*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560494/ChatGPT%20Veterans%20Claim%20%E5%BC%BA%E5%88%B6%20USUSD.user.js
// @updateURL https://update.greasyfork.org/scripts/560494/ChatGPT%20Veterans%20Claim%20%E5%BC%BA%E5%88%B6%20USUSD.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const TARGET_COUNTRY = "US";
  const TARGET_CURRENCY = "USD";
  const DEBUG_LOG = false;

  const CHECKOUT_PATH = "/backend-api/payments/checkout";
  const originalFetch = window.fetch;

  function log(...args) {
    if (!DEBUG_LOG) return;
    // eslint-disable-next-line no-console
    console.log("[VeteransClaim US/USD]", ...args);
  }

  function isCheckoutUrl(inputUrl) {
    try {
      const url = new URL(String(inputUrl), location.href);
      return url.origin === location.origin && url.pathname === CHECKOUT_PATH;
    } catch {
      return false;
    }
  }

  function patchBillingDetailsDeep(value, visited = new Set(), depth = 0) {
    if (!value || typeof value !== "object") return 0;
    if (visited.has(value)) return 0;
    if (depth > 8) return 0;
    visited.add(value);

    let patchedCount = 0;
    if (
      Object.prototype.hasOwnProperty.call(value, "billing_details") &&
      value.billing_details &&
      typeof value.billing_details === "object"
    ) {
      value.billing_details.country = TARGET_COUNTRY;
      value.billing_details.currency = TARGET_CURRENCY;
      patchedCount += 1;
    }

    for (const key of Object.keys(value)) {
      patchedCount += patchBillingDetailsDeep(value[key], visited, depth + 1);
    }

    return patchedCount;
  }

  function tryPatchJsonBody(bodyText) {
    if (typeof bodyText !== "string") return null;
    const trimmed = bodyText.trim();
    if (!trimmed) return null;
    if (!(trimmed.startsWith("{") || trimmed.startsWith("["))) return null;

    try {
      const json = JSON.parse(bodyText);
      const patchedCount = patchBillingDetailsDeep(json);
      if (!patchedCount) return null;
      return JSON.stringify(json);
    } catch {
      return null;
    }
  }

  function shouldPatchCheckout(url, method) {
    if (!isCheckoutUrl(url)) return false;
    return String(method || "GET").toUpperCase() === "POST";
  }

  window.fetch = async function (input, init) {
    try {
      const url = input instanceof Request ? input.url : input;
      const method =
        (init && init.method) || (input instanceof Request ? input.method : "GET");

      if (shouldPatchCheckout(url, method)) {
        if (init && typeof init.body === "string") {
          const patched = tryPatchJsonBody(init.body);
          if (patched) {
            log("patched fetch(init.body)", { from: init.body, to: patched });
            const nextInit = { ...init, body: patched };
            return originalFetch.call(this, input, nextInit);
          }
        }

        if (input instanceof Request) {
          const cloned = input.clone();
          const originalText = await cloned.text().catch(() => null);
          if (typeof originalText === "string") {
            const patched = tryPatchJsonBody(originalText);
            if (patched) {
              log("patched fetch(Request.body)", { from: originalText, to: patched });
              const nextRequest = new Request(input, { body: patched });
              return originalFetch.call(this, nextRequest, init);
            }
          }
        }
      }
    } catch (err) {
      log("fetch hook error", err);
    }

    return originalFetch.call(this, input, init);
  };

  const originalXhrOpen = XMLHttpRequest.prototype.open;
  const originalXhrSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    try {
      this.__veteransClaimCheckoutMethod = method;
      this.__veteransClaimCheckoutUrl = url;
    } catch {
      // ignore
    }
    return originalXhrOpen.call(this, method, url, ...rest);
  };

  XMLHttpRequest.prototype.send = function (body) {
    try {
      if (shouldPatchCheckout(this.__veteransClaimCheckoutUrl, this.__veteransClaimCheckoutMethod)) {
        if (typeof body === "string") {
          const patched = tryPatchJsonBody(body);
          if (patched) {
            log("patched XHR(body)", { from: body, to: patched });
            return originalXhrSend.call(this, patched);
          }
        }
      }
    } catch (err) {
      log("XHR hook error", err);
    }
    return originalXhrSend.call(this, body);
  };
})();
