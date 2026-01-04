// ==UserScript==
// @name         YouTube Livechat Emote Copy Paste Fix
// @description  This script fixes copy-pasting Youtube custom emoji issues by modifying the alt attributes and replacing them with proper ones.
// @namespace    YouTubeCopyEmoteFix
// @version      1.0
// @match        https://www.youtube.com/live_chat*
// @author       JustRinDesu
// @license      MIT
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548781/YouTube%20Livechat%20Emote%20Copy%20Paste%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/548781/YouTube%20Livechat%20Emote%20Copy%20Paste%20Fix.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function fixEmotes(root) {
    root.querySelectorAll("yt-live-chat-text-message-renderer img").forEach(img => {
      const tooltip = img.getAttribute("shared-tooltip-text");
      const emoteId = img.getAttribute("data-emoji-id");
      if (tooltip && emoteId) img.setAttribute("alt", tooltip);
    });
  }

  fixEmotes(document);

  new MutationObserver(muts => {
    muts.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType === 1) fixEmotes(n);
    }));
  }).observe(document.body, { childList: true, subtree: true });
})();
