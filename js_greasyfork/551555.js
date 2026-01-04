// ==UserScript==
// @name         TikTok Unfollow Non-Muts (V2)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Unfollow accounts on TikTok that are not mutuals. Adds safer delays (none calls)
// @match        https://www.tiktok.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551555/TikTok%20Unfollow%20Non-Muts%20%28V2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551555/TikTok%20Unfollow%20Non-Muts%20%28V2%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ------- CONFIG --------
  const MIN_DELAY_MS = 1500; // minimum delay between unfollow attempts
  const MAX_DELAY_MS = 3500; // maximum delay between unfollow attempts
  const MAX_UNFOLLOWS = 500; // safety cap (set to null for no cap)
  const MUTUAL_KEYWORDS = ['Friends', 'Mutual', 'Following each other']; // phrases that indicate mutuals
  // -----------------------

  let running = false;
  let unfollowed = 0;
  let stopRequested = false;

  function randDelay() {
    return MIN_DELAY_MS + Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1));
  }

  function textHasMutual(parentText) {
    if (!parentText) return false;
    const t = parentText.replace(/\s+/g, ' ');
    return MUTUAL_KEYWORDS.some(k => t.includes(k));
  }

  function createUI() {
    if (document.querySelector('#tmUnfollowNonMutuals')) return;

    const wrap = document.createElement('div');
    wrap.id = 'tmUnfollowNonMutuals';
    wrap.style.position = 'fixed';
    wrap.style.right = '20px';
    wrap.style.top = '20px';
    wrap.style.zIndex = '10000';
    wrap.style.fontFamily = 'Arial, sans-serif';
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.gap = '8px';

    const btn = document.createElement('button');
    btn.innerText = 'Start Unfollow Non-Mutuals';
    btn.style.padding = '8px 10px';
    btn.style.border = 'none';
    btn.style.borderRadius = '6px';
    btn.style.cursor = 'pointer';
    btn.style.background = '#ff5b5b';
    btn.style.color = '#fff';
    btn.onclick = () => {
      if (!running) startProcess();
      else requestStop();
    };

    const status = document.createElement('div');
    status.id = 'tmUnfollowStatus';
    status.style.padding = '6px 8px';
    status.style.background = 'rgba(0,0,0,0.6)';
    status.style.color = '#fff';
    status.style.borderRadius = '6px';
    status.style.fontSize = '12px';
    status.innerText = 'Idle';

    const note = document.createElement('div');
    note.style.fontSize = '11px';
    note.style.color = '#222';
    note.style.background = '#fff';
    note.style.padding = '6px 8px';
    note.style.borderRadius = '6px';
    note.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    note.innerText = 'Will skip accounts whose surrounding text contains: ' + MUTUAL_KEYWORDS.join(', ');

    wrap.appendChild(btn);
    wrap.appendChild(status);
    wrap.appendChild(note);
    document.body.appendChild(wrap);
  }

  async function clickConfirmIfShown() {
    // After clicking "Following" TikTok may open a small dropdown/modal with an "Unfollow" button.
    // Try to detect and click it.
    for (let i = 0; i < 6; i++) {
      // Look for commonly-labeled unfollow confirmations
      const btns = Array.from(document.querySelectorAll('button'));
      const unfollowBtn = btns.find(b => {
        const t = (b.innerText || '').trim();
        return /unfollow/i.test(t) || /取消关注|取消關注/.test(t); // include some common translations
      });
      if (unfollowBtn) {
        try {
          unfollowBtn.click();
          return true;
        } catch (e) {
          // ignore
        }
      }
      await new Promise(r => setTimeout(r, 300));
    }
    return false;
  }

  function getCandidateButtons() {
    // Collect visible buttons that appear to be "Following" controls.
    const allButtons = Array.from(document.querySelectorAll('button'));
    const candidates = allButtons.filter(b => {
      if (!b.offsetParent) return false; // not visible
      const text = (b.innerText || '').trim();
      const aria = (b.getAttribute('aria-label') || '').trim();
      const lower = (text + ' ' + aria).toLowerCase();
      if (!lower) return false;
      // Common labels containing "following"
      if (/\bfollowing\b/i.test(text) || /following/i.test(aria) || /\b已关注\b|正在关注/.test(text)) {
        return true;
      }
      return false;
    });
    // De-duplicate by element reference and keep order
    return [...new Set(candidates)];
  }

  async function unfollowNonMutualsLoop() {
    const statusEl = document.getElementById('tmUnfollowStatus');
    if (!statusEl) return;

    while (!stopRequested) {
      const candidates = getCandidateButtons();
      if (candidates.length === 0) {
        statusEl.innerText = `No "Following" buttons found. Scroll the Following list or visit your profile's Following tab. Unfollowed: ${unfollowed}`;
        // wait a bit then try again
        await new Promise(r => setTimeout(r, 1500));
        continue;
      }

      let progressed = false;

      for (const btn of candidates) {
        if (stopRequested) break;
        // Skip if we've reached cap
        if (MAX_UNFOLLOWS !== null && unfollowed >= MAX_UNFOLLOWS) {
          statusEl.innerText = `Reached safety cap of ${MAX_UNFOLLOWS} unfollows. Stopping.`;
          stopRequested = true;
          break;
        }

        // Check parent/nearby text for mutual indicators
        const parent = btn.closest('div,li,article') || btn.parentElement;
        const surroundingText = parent ? parent.innerText : btn.innerText;
        if (textHasMutual(surroundingText)) {
          // skip mutuals
          continue;
        }

        // Additional guard: ensure button still says Following
        const btnText = (btn.innerText || '').trim();
        if (!/\bfollowing\b/i.test(btnText) && !/已关注|正在关注/.test(btnText)) continue;

        try {
          // Scroll into view and click
          btn.scrollIntoView({ block: 'center', behavior: 'auto' });
          await new Promise(r => setTimeout(r, 200));
          btn.click();

          // Click the confirmation if TikTok shows one
          await clickConfirmIfShown();

          unfollowed++;
          progressed = true;
          statusEl.innerText = `Unfollowed: ${unfollowed}. Next in ${MIN_DELAY_MS}-${MAX_DELAY_MS}ms...`;

          // Random delay
          await new Promise(r => setTimeout(r, randDelay()));
        } catch (err) {
          console.error('Error unfollowing:', err);
        }
      }

      if (!progressed) {
        // nothing to do right now, wait a bit to allow more items to load
        statusEl.innerText = `No eligible non-mutuals found in current view. Unfollowed: ${unfollowed}`;
        await new Promise(r => setTimeout(r, 1800));
      }
    }

    statusEl.innerText = `Stopped. Total unfollowed: ${unfollowed}`;
    running = false;
    stopRequested = false;
  }

  function startProcess() {
    if (running) return;
    const btn = document.querySelector('#tmUnfollowNonMutuals button');
    if (btn) {
      btn.innerText = 'Stop';
      btn.style.background = '#555';
    }
    running = true;
    stopRequested = false;
    unfollowed = 0;
    unfollowNonMutualsFlow();
  }

  function requestStop() {
    stopRequested = true;
    const btn = document.querySelector('#tmUnfollowNonMutuals button');
    if (btn) {
      btn.innerText = 'Stopping...';
      btn.style.background = '#f39c12';
    }
  }

  async function unfollowNonMutualsFlow() {
    // Extra confirmation to prevent accidental mass unfollowing
    const ok = confirm('This will attempt to unfollow accounts that do not appear to be mutuals. Proceed?');
    const btn = document.querySelector('#tmUnfollowNonMutuals button');
    if (!ok) {
      if (btn) {
        btn.innerText = 'Start Unfollow Non-Mutuals';
        btn.style.background = '#ff5b5b';
      }
      running = false;
      return;
    }

    if (btn) {
      btn.innerText = 'Stop';
      btn.style.background = '#555';
    }

    await unfollowNonMutualsLoop();

    if (btn) {
      btn.innerText = 'Start Unfollow Non-Mutuals';
      btn.style.background = '#ff5b5b';
    }
  }

  // Create UI on page load
  function waitForBody() {
    if (document.body) createUI();
    else setTimeout(waitForBody, 300);
  }
  waitForBody();

})();
