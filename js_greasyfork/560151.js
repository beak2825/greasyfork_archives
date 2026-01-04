// ==UserScript==
// @name         ChatGPT Anti-Lag Safe Turn Pruner (Hardened + UI Protected)
// @namespace    chatgpt-antilag-turnprune-hardened-safe
// @version      1.0
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        none
// @description  It functions as a anti-lag for slow computers that lag if the conversation gets too long.
// @license GPL-3.0

// @downloadURL https://update.greasyfork.org/scripts/560151/ChatGPT%20Anti-Lag%20Safe%20Turn%20Pruner%20%28Hardened%20%2B%20UI%20Protected%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560151/ChatGPT%20Anti-Lag%20Safe%20Turn%20Pruner%20%28Hardened%20%2B%20UI%20Protected%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const KEEP_LAST = 3; // prunes until there is three blocks of text left (between assistant and user)
  const PRUNE_INTERVAL = 1500; // How fast it prunes

  /* ---------- REGION GUARDS ---------- */

  function isVisible(el) {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  // NEVER prune here
  function isSidebar(el) {
    return el.closest('#stage-slideover-sidebar') !== null;
  }

  function isChatHistory(el) {
    return el.closest('nav[aria-label="Chat history"]') !== null;
  }

  function isHeaderUI(el) {
    return el.closest('header,[data-testid="top-bar"]') !== null;
  }

  function isHistoryContainer(el) {
  return el.id === 'history' || el.closest('#history') !== null;
}


  function isComposer(el) {
    if (!el) return false;
    if (el.querySelector?.('textarea,[role="textbox"]')) return true;
    const tid = el.getAttribute?.('data-testid') || '';
    if (tid.includes('composer')) return true;
    return false;
  }

  function isConversationTurn(el) {
    return el?.matches?.('article[data-testid^="conversation-turn"]');
  }

  /* ---------- STREAMING + STATE ---------- */

  function isStreamingTurn(article) {
    if (!article) return false;

    if (article.querySelector('[data-testid="typing-loader"]')) return true;
    if (article.querySelector('[data-state="streaming"]')) return true;

    const hasMsg = article.querySelector('[data-message-id]');
    const hasToolbar = article.querySelector('button');

    if (hasMsg && !hasToolbar) return true;

    return false;
  }

  function hasToolbar(article) {
    return !!article.querySelector('button');
  }

  /* ---------- GHOST TURN CLEANUP (SAFE REGION ONLY) ---------- */

  const THREAD_ROOT = '[data-testid="conversation-turns"]';

function removeGhostEmptyTurns() {
  const root = document.querySelector(THREAD_ROOT);
  if (!root) return;

  const turns = root.querySelectorAll(
    'article[data-testid^="conversation-turn"]'
  );

  for (const el of turns) {
    if (!isVisible(el)) continue;
    if (isComposer(el)) continue;
    if (isStreamingTurn(el)) continue;

    // real message? keep
    if (el.querySelector('[data-message-id]')) continue;

    const text = (el.innerText || '').trim();
    if (text.length > 0) continue;

    el.remove();
  }
}


  /* ---------- OUTER SPACER CLEANUP (STRICT SCOPE) ---------- */

  function removeOuterSpacers() {
  const root = document.querySelector(THREAD_ROOT);
  if (!root) return;

  const blocks = root.querySelectorAll('div,section');

  for (const el of blocks) {
    if (!isVisible(el)) continue;

    // NEVER prune inside turns or composer
    if (el.closest?.('article[data-testid^="conversation-turn"]')) continue;
    if (el.closest?.('[data-testid*="composer"]')) continue;
    if (isComposer(el)) continue;

    // content? keep
    if (el.querySelector('[data-message-id]')) continue;

    // toolbar / actions? keep
    if (el.querySelector('button')) continue;

    const text = (el.innerText || '').trim();
    if (text.length > 0) continue;

    const r = el.getBoundingClientRect();
    if (r.height > 12) continue;

    el.remove();
  }
}


  /* ---------- CORE TURN PRUNER (UNCHANGED) ---------- */

  function pruneTurns() {
    const allTurns = [...document.querySelectorAll(
      'article[data-testid^="conversation-turn"]'
    )].filter(isVisible);

    if (allTurns.length <= KEEP_LAST) {
      removeGhostEmptyTurns();
      removeOuterSpacers();
      return;
    }

    const ordered = allTurns.sort(
      (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
    );

    const committed = [];

    for (const turn of ordered) {

      if (isComposer(turn)) continue;
      if (isStreamingTurn(turn)) continue;

      // finished turn only
      if (!hasToolbar(turn)) continue;

      committed.push(turn);
    }

    if (committed.length > KEEP_LAST) {

      const removeCount = committed.length - KEEP_LAST;
      const toRemove = committed.slice(0, removeCount);

      for (const turn of toRemove) {
        if (isConversationTurn(turn)) {
          turn.remove();
        }
      }
    }

    removeGhostEmptyTurns();
    removeOuterSpacers();
  }

  /* ---------- LOOP ---------- */

  setInterval(() => {
    try {
      pruneTurns();
    } catch (_) {}
  }, PRUNE_INTERVAL);

})();
