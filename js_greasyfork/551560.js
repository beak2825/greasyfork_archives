// ==UserScript==
// @name         GPT-5 Thinking Autoselect
// @description  Automatically select GPT-5 Thinking model in new chats.
// @version      1.11
// @author       C89sd
// @namespace    https://greasyfork.org/users/1376767
// @match        https://chatgpt.com/*
// @run-at       document-body
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/551560/GPT-5%20Thinking%20Autoselect.user.js
// @updateURL https://update.greasyfork.org/scripts/551560/GPT-5%20Thinking%20Autoselect.meta.js
// ==/UserScript==

'use strict';

const QUERY = '?model=gpt-5-thinking' // &effort=extended

// console.log('BEFORE', location, location.search)
if (location.pathname === '/' && location.search !== QUERY) {
  location.search = QUERY;
}

// Log prev/next for SPA navigations
const _pushState = history.pushState;
const _replaceState = history.replaceState;

function wrap(orig) {
  return function (state, title, url) {
    const prev = new URL(location.href);
    const next = url ? new URL(url, prev) : prev;
    const ret = orig.call(this, state, title, url);
    //console.log(orig.name, 'prev:', prev.href, 'next:', next.href, 'current:', location.href);
    if (next.pathname === '/' && prev.pathname !== '/') {
      location.search = QUERY;
    }
    return ret;
  };
}

history.pushState = wrap(_pushState);
history.replaceState = wrap(_replaceState);
