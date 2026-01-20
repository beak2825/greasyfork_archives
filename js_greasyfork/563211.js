// ==UserScript==
// @name         Generic JSON.stringify Payload Spoofer
// @version      1.0.2
// @description  Spoofs and adds a generic spoof attribute to any object passed to JSON.stringify (demo only)
// @match        *://*/*
// @run-at       document-start
// @license      MIT
// @namespace https://greasyfork.org/users/1562248
// @downloadURL https://update.greasyfork.org/scripts/563211/Generic%20JSONstringify%20Payload%20Spoofer.user.js
// @updateURL https://update.greasyfork.org/scripts/563211/Generic%20JSONstringify%20Payload%20Spoofer.meta.js
// ==/UserScript==

(function () {
  const originalStringify = JSON.stringify;

  JSON.stringify = function (value, replacer, space) {
    if (value !== null && typeof value === "object") {
      try {
        const cloned = structuredClone ? structuredClone(value) : JSON.parse(originalStringify(value));
        
        cloned.spoof = "Payload is spoofed";
        console.log("Payload is spoofed"); 
        return originalStringify.call(this, cloned, replacer, space);
      } catch (e) {}
    }

    return originalStringify.call(this, value, replacer, space);
  };
})();
