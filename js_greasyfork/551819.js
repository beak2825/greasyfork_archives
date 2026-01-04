// ==UserScript==
// @name         territorial-block-propaganda
// @namespace    http://tampermonkey.net/
// @version      2025-10-07
// @description  block stupid propaganda popups
// @author       barfy
// @match        https://territorial.io/*
// @match        https://fxclient.github.io/FXclient/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=territorial.io
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551819/territorial-block-propaganda.user.js
// @updateURL https://update.greasyfork.org/scripts/551819/territorial-block-propaganda.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const addHooks = (function () {
    const orig = window.WebSocket;
    WebSocket = new Proxy(orig, { // eslint-disable-line
      construct: function (target, args) {
        return new Proxy(new target(args[0]), {
          get: function (target, prop) {
            let value = target[prop];
            if (prop === 'send') {
              value = function (data) {
                if (!data || data.length !== 2 || data[0] !== 30 || data[1] !== 40) {
                  target.send(data);
                }
              };
            } else if (typeof value === 'function') {
              value = value.bind(target);
            }
            return value;
          },
          set: function (target, prop, value) {
            target[prop] = value;
            return true;
          },
        });
      },
    });
  });
  const observer = new MutationObserver(function () {
    if (document.head) {
      observer.disconnect();
      const scriptTag = document.createElement('script');
      scriptTag.innerHTML = `(${addHooks})();`;
      document.head.appendChild(scriptTag);
      scriptTag.remove();
      console.log('blocking propaganda');
    }
  });
  observer.observe(document, { subtree: true, childList: true });
})();
