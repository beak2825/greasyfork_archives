// ==UserScript==
// @name         ge.globo
// @namespace    http://tampermonkey.net/
// @description  Přesměrování do live url globo
// @author       Daniel Tomáš
// @license      MIT
// @version      1.1
// @match        https://ge.globo.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564226/geglobo.user.js
// @updateURL https://update.greasyfork.org/scripts/564226/geglobo.meta.js
// ==/UserScript==

(function () {
  const currentUrl = window.location.href;
  if (
    currentUrl.includes("ge.globo.com") &&
    currentUrl.includes("jogo") &&
    !currentUrl.startsWith("https://blank.org/#")
  ) {
    const newUrl = "https://blank.org/#" + currentUrl;
    window.location.replace(newUrl);
  }
})();