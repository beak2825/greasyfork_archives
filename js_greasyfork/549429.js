// ==UserScript==
// @name         NYT Plus
// @namespace    neilnagpaul.github.io
// @license      MIT
// @version      1.0
// @description  Bypasses paywall on NYT games
// @match        https://www.nytimes.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/549429/NYT%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/549429/NYT%20Plus.meta.js
// ==/UserScript==

JSON.parse = new Proxy(JSON.parse, {
  apply(...args) {
    const data = Reflect.apply(...args);
    data?.data?.user?.userInfo?.subscriptions?.push?.("XWD");
    return data;
  },
});