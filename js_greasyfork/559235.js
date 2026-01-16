// ==UserScript==
// @name         Facebook PWA -> Messenger only
// @namespace    local
// @version      1.1
// @description  Forces Facebook PWA windows to stay in Messenger by redirecting any non-Messenger navigation back to the Messages view, without affecting regular browser tabs.
// @author       Dobolus
// @license      MIT
// @match        https://www.facebook.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559235/Facebook%20PWA%20-%3E%20Messenger%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/559235/Facebook%20PWA%20-%3E%20Messenger%20only.meta.js
// ==/UserScript==


(() => {
  'use strict';

  const MESSAGES_URL = 'https://www.facebook.com/messages/';
  const ALLOWED_PATH_PREFIXES = ['/messages', '/messenger_media', '/groupcall'];
  const MQ_STANDALONE = '(display-mode: standalone)';
  const MQ_MINIMAL_UI = '(display-mode: minimal-ui)';

  const isPWAWindow = () =>
    window.matchMedia(MQ_STANDALONE).matches ||
    window.matchMedia(MQ_MINIMAL_UI).matches;

  if (!isPWAWindow()) return;

  const isAllowedPath = (path) =>
    ALLOWED_PATH_PREFIXES.some(prefix => path.startsWith(prefix));

  const enforce = () => {
    if (!isAllowedPath(location.pathname)) {
      location.replace(MESSAGES_URL);
    }
  };

  const wrapHistoryMethod = (methodName) => {
    const original = history[methodName];
    if (typeof original !== 'function') return;
    history[methodName] = function (...args) {
      const result = original.apply(this, args);
      enforce();
      return result;
    };
  };

  enforce();
  wrapHistoryMethod('pushState');
  wrapHistoryMethod('replaceState');
  addEventListener('popstate', enforce, { passive: true });
})();
