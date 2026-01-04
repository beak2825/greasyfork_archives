// ==UserScript==
// @name         StudentVUE Login Delay Bypass
// @description  skips post request that takes too long
// @match        https://*.edupoint.com/*
// @version      1
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/1549288
// @downloadURL https://update.greasyfork.org/scripts/559285/StudentVUE%20Login%20Delay%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/559285/StudentVUE%20Login%20Delay%20Bypass.meta.js
// ==/UserScript==

(function () {
  const TARGET =
    "RTCommunication.asmx/XMLDoRequest?PORTAL=StudentVUE";

  function hookJQuery() {
    if (!window.jQuery || !jQuery.ajax) return false;

    const originalAjax = jQuery.ajax;

    jQuery.ajax = function (opts) {
      const url =
        typeof opts === "string"
          ? opts
          : opts && opts.url;

      if (url && url.includes(TARGET)) {
        console.warn("[StudentVUE] Blocked RTCommunication POST");

        // Simulate a successful response structure
        const fakeResponse = { d: { Response: [] } };

        // Match callWebMethod's expectations
        if (opts && typeof opts.success === "function") {
          setTimeout(() => opts.success(fakeResponse), 0);
        }

        // Return a resolved jqXHR-like object
        return jQuery.Deferred()
          .resolve(fakeResponse)
          .promise();
      }

      return originalAjax.apply(this, arguments);
    };

    return true;
  }

  // jQuery may load after document-start
  const timer = setInterval(() => {
    if (hookJQuery()) clearInterval(timer);
  }, 10);
})();
