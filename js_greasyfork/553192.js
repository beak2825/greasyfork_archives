// ==UserScript==
// @name         YouTube Live Chat Resurrection
// @namespace    yt-autofix
// @version      1.1
// @description  Fixes missing live chat on YouTube livestreams. Reloads once, then forces chat to appear instantly on every stream. Fixed for archived livestreams
// @author       KiyoshiNatsumi
// @match        https://www.youtube.com/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553192/YouTube%20Live%20Chat%20Resurrection.user.js
// @updateURL https://update.greasyfork.org/scripts/553192/YouTube%20Live%20Chat%20Resurrection.meta.js
// ==/UserScript==

(function() {
'use strict';

let lastVideoId = null;
let reloadedThisSession = false;
let chatReady = false;
let reloadCount = 0;

function getVideoId() {
  return new URL(location.href).searchParams.get('v');
}

function isLivestream() {
  const meta = document.querySelector('meta[itemprop="isLiveBroadcast"]');
  if (meta && meta.content === "true") return true;
  return location.href.includes('/watch') && location.href.includes('live');
}

function isLiveArchive() {
  const meta = document.querySelector('meta[itemprop="isLiveBroadcast"]');
  return meta && meta.content === "false";
}

function forceChatLoad(retry = 0) {
  if (chatReady) return;
  const vid = getVideoId();
  if (!vid) return;
  const chatFrame = document.querySelector('iframe#chatframe');
  if (!chatFrame) {
    if (retry < 15) setTimeout(() => forceChatLoad(retry + 1), 1000);
    return;
  }

  const src = chatFrame.getAttribute('src') || '';
  if (!src.includes('live_chat')) {
    chatFrame.src = `https://www.youtube.com/live_chat?v=${vid}&is_popout=1`;
    return;
  }

  try {
    const doc = chatFrame.contentDocument;
    const hasChat = doc?.querySelector('#chat');
    if (hasChat) {
      chatReady = true;
      return;
    }

    if (!hasChat && reloadCount < 2 && isLivestream()) {
      reloadCount++;
      setTimeout(() => {
        chatFrame.src = chatFrame.src;
        forceChatLoad();
      }, 1500);
    }
  } catch (e) {}
}

function handleVideoChange() {
  const vid = getVideoId();
  if (!vid || vid === lastVideoId) return;
  lastVideoId = vid;
  chatReady = false;
  reloadCount = 0;

  if (isLivestream() && !reloadedThisSession) {
    reloadedThisSession = true;
    console.log('[Live Chat Resurrection] Detected LIVE → reloading once...');
    setTimeout(() => location.reload(), 1200);
  } else {
    setTimeout(() => forceChatLoad(), 2000);
  }
}

const observer = new MutationObserver(() => handleVideoChange());
observer.observe(document.body, { childList: true, subtree: true });

setTimeout(() => {
  const vid = getVideoId();
  if (!vid) return;
  if (isLivestream() && !reloadedThisSession) {
    console.log('[Live Chat Resurrection] First live detected → reload once');
    reloadedThisSession = true;
    setTimeout(() => location.reload(), 1200);
  } else {
    forceChatLoad();
  }
}, 2000);
})();
