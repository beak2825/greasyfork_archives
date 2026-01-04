// ==UserScript==
//
// @name         Imgur Images Unblocker
// @version      1.7
// @namespace    https://github.com/Purfview/Imgur-Images-Unblocker
// @description  Loads images from Imgur in the blocked countries
// @icon         https://proxy.duckduckgo.com/iu/?u=https://imgur.com/favicon.ico
// @license      MIT
//
// @homepage     https://github.com/Purfview/Imgur-Images-Unblocker
// @supportURL   https://github.com/Purfview/Imgur-Images-Unblocker/issues
//
// @match        *://*/*
// @run-at       document-start
//
// @downloadURL https://update.greasyfork.org/scripts/558123/Imgur%20Images%20Unblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/558123/Imgur%20Images%20Unblocker.meta.js
// ==/UserScript==
/*=========================  Version History  ==================================

1.7 -    Performance: Removed jQuery dependency.

1.6 -    Fix: On some sites Violentmonkey failed with "$(...) is null" error.

1.5 -    Fix: The script sometimes didn't execute.

1.4 -    Prevent code running if Imgur images not found in a site's source code.
         [Note: Some dynamic site would need an option disabling that]

1.3 -    Mitigate multiple unblock() executions

1.2 -    Fix: Wasn't working on doom9.

1.1 -    Added support for http links.

1.0 -    First public release.

==============================================================================*/

(function() {
  'use strict';
  const from1 = 'https://i.imgur.com';
  const from2 = 'http://i.imgur.com';
  const to = 'https://proxy.duckduckgo.com/iu/?u=https://i.imgur.com';
  let onTimeout = false;
  let isStarted = false;

  function unblock() {
    const $$ = document.querySelectorAll.bind(document);
    $$('img, a').forEach(el => {
      ['src', 'href'].forEach(a => {
        const v = el[a];
        if (v && v.startsWith(from1)) {
          el[a] = v.replace(from1, to);
        } else if (v && v.startsWith(from2)) {
          el[a] = v.replace(from2, to);
        }
      });
    });
  }

  function startObserver() {
    let timer = null;
    const observer = new MutationObserver(() => {
      if (!onTimeout) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          console.log("Imgur Images Unblocker: Mutation unblock() is executed!");
          unblock();
        }, 70); // debounce: time to wait after last mutation before calling unblock()
      } else {
          // console.log("Imgur Images Unblocker: Mutation unblock() is on timeout!");
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function mainFunc() {
    if (!document.documentElement.innerHTML.includes("//i.imgur.com")) {
      console.log("Imgur Images Unblocker: Unblock not running: Imgur images not found!");
      return;
    } else {
      isStarted = true;
      onTimeout = true;
      console.log("Imgur Images Unblocker: readyState unblock() is executed!");
      unblock();

      setTimeout(() => {
        onTimeout = false;
      }, 300); // timeout length for subsequent unblock() on mutations

      if (document.readyState === "complete") {
        startObserver();
      } else {
        document.addEventListener('DOMContentLoaded', startObserver);
      }
    }
  }

  document.onreadystatechange = function() {
    if (!isStarted) {
      if (document.readyState === "interactive" || document.readyState === "complete") {
        mainFunc();
      }
    }
  };
})();

