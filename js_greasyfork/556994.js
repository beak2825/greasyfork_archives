// ==UserScript==
// @name         Vencord Loader (fetches official build)
// @namespace    https://github.com/yourname/vencord-loader
// @version      1.0.0
// @description  Loads the Vencord build into Discord Web by injecting the official raw build URL. This keeps the exact same features as the remote build (you still download/execute the original build).
// @author       You
// @match        https://discord.com/*
// @match        https://*.discord.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556994/Vencord%20Loader%20%28fetches%20official%20build%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556994/Vencord%20Loader%20%28fetches%20official%20build%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // RAW URL of the Vencord build to load. Change this if you want a different build.
  const REMOTE_BUILD = 'https://raw.githubusercontent.com/Vencord/builds/main/Vencord.user.js';

  // Create a regular <script> tag that points to the raw build.
  // This approach executes the *exact* remote build (so feature parity is preserved).
  function injectRemoteScript(url) {
    try {
      const s = document.createElement('script');
      s.src = url;
      s.type = 'text/javascript';
      s.async = false; // keep execution order predictable
      s.onload = () => {
        // Optional: a tiny marker shown in console so you know it loaded
        console.debug('[Vencord Loader] remote build injected:', url);
      };
      s.onerror = (e) => console.error('[Vencord Loader] failed to load remote build:', e);
      // Prefer head, fallback to documentElement
      (document.head || document.documentElement).appendChild(s);
    } catch (err) {
      console.error('[Vencord Loader] injection error:', err);
    }
  }

  // Only inject when on the web app (prevents running on unrelated discord pages)
  // You can tweak this test if you want it to run only on /app or a specific subpath.
  if (location.hostname.endsWith('discord.com')) {
    injectRemoteScript(REMOTE_BUILD);
  }
})();
