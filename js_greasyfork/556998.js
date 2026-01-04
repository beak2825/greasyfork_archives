// ==UserScript==
// @name         ChatGPT Chat bulk delete (drag to trash + fast retry)
// @namespace    soeren.tools
// @author       soeren
// @version      1.3.1
// @description  Multi-select chats and delete them in bulk via drag-to-trash with fast parallel delete + retry
// @match        https://chatgpt.com/*
// @connect      chatgpt.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556998/ChatGPT%20Chat%20bulk%20delete%20%28drag%20to%20trash%20%2B%20fast%20retry%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556998/ChatGPT%20Chat%20bulk%20delete%20%28drag%20to%20trash%20%2B%20fast%20retry%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const MAX_DELETE_ATTEMPTS = 2;
  const RETRY_DELAY_MS = 700; // ms between retries
  const RETRYABLE_STATUSES = [429, 500, 502, 503, 504];

  GM_addStyle(`
    #history a.__menu-item.tm-selected {
      position: relative;
      background-color: rgba(200, 200, 200, 0.18);
      outline: 2px solid var(--theme-user-msg-bg);
      outline-offset: -1px;
    }

    #history a.__menu-item.tm-selected::before {
      content: "";
      position: absolute;
      left: 0;
      top: 4px;
      bottom: 4px;
      width: 3px;
      border-radius: 999px;
      background-color: var(--theme-user-msg-bg);
    }

    #history a.__menu-item.tm-selected .truncate span {
      font-weight: 600;
    }

    #history a.__menu-item.tm-delete-failed {
      outline: 2px solid rgba(239, 68, 68, 0.95) !important;
      background-color: rgba(248, 113, 113, 0.12);
    }

    /* Trash zone bottom-left */
    #tm-trash-zone {
      position: fixed;
      left: 16px;
      bottom: 50px;
      width: 48px;
      height: 48px;
      border-radius: 999px;
      border: 1px solid rgba(239, 68, 68, 0.7);
      background: rgba(248, 113, 113, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      cursor: default;
      z-index: 999999;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
      opacity: 0;
      transform: translateY(16px);
      pointer-events: none;
      transition:
        opacity 0.15s ease-out,
        transform 0.15s ease-out,
        box-shadow 0.15s ease-out,
        background 0.15s ease-out,
        border-color 0.15s ease-out;
    }

    #tm-trash-zone.tm-visible {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    #tm-trash-zone.tm-hover {
      background: rgba(248, 113, 113, 0.3);
      border-color: rgba(239, 68, 68, 1);
      box-shadow: 0 6px 22px rgba(239, 68, 68, 0.55);
    }

    #tm-trash-zone .tm-trash-count {
      position: absolute;
      right: -4px;
      top: -4px;
      min-width: 18px;
      height: 18px;
      border-radius: 999px;
      background: rgba(239, 68, 68, 0.95);
      color: white;
      font-size: 11px;
      line-height: 18px;
      text-align: center;
      padding: 0 4px;
      box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.9);
    }
  `);

  let authToken = null;
  let dragItems = null; // currently dragged links (array)

  async function getAuthToken() {
    if (authToken) return authToken;

    try {
      const response = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: 'https://chatgpt.com/api/auth/session',
          onload: resolve,
          onerror: reject,
        });
      });

      const data = JSON.parse(response.responseText);
      if (data && data.accessToken) {
        authToken = data.accessToken;
        return authToken;
      }
      throw new Error('accessToken not found');
    } catch (err) {
      console.error('bulk delete error (getAuthToken):', err);
      return null;
    }
  }

  function getAllHistoryItems() {
    return Array.from(document.querySelectorAll('#history a.__menu-item'));
  }

  function getHistoryLinkFromTarget(target) {
    if (!(target instanceof Element)) return null;
    const link = target.closest('a.__menu-item');
    if (!link) return null;
    if (!link.closest('#history')) return null;
    return link;
  }

  function getSelectedLinks() {
    return Array.from(
      document.querySelectorAll('#history a.__menu-item.tm-selected')
    );
  }

  function addSelected(link) {
    link.classList.add('tm-selected');
  }

  function removeSelected(link) {
    link.classList.remove('tm-selected');
  }

  function clearSelection() {
    getSelectedLinks().forEach((el) => {
      el.classList.remove('tm-selected', 'tm-delete-failed');
    });
    lastAnchorIndex = null;
    updateSelectionUI();
  }

  function getChatIdFromLink(link) {
    const href = link.getAttribute('href') || '';
    const m = href.match(/\/c\/([^/]+)/);
    return m ? m[1] : null;
  }

  function log(...args) {
    console.debug('bulk delete', ...args);
  }

  let lastAnchorIndex = null;

  function handleSelectionClick(link, event) {
    const items = getAllHistoryItems();
    const idx = items.indexOf(link);
    if (idx === -1) return;

    if (event.shiftKey && lastAnchorIndex !== null && lastAnchorIndex >= 0) {
      const start = Math.min(lastAnchorIndex, idx);
      const end = Math.max(lastAnchorIndex, idx);
      for (let i = start; i <= end; i++) {
        addSelected(items[i]);
      }
      lastAnchorIndex = idx;
    } else {
      if (link.classList.contains('tm-selected')) {
        removeSelected(link);
      } else {
        addSelected(link);
      }
      lastAnchorIndex = idx;
    }

    updateSelectionUI();
  }

  function getOrCreateTrashZone() {
    let trash = document.getElementById('tm-trash-zone');
    if (trash) return trash;

    trash = document.createElement('div');
    trash.id = 'tm-trash-zone';
    trash.innerHTML = `
      <span aria-hidden="true">🗑️</span>
      <span class="tm-trash-count" style="display:none;">0</span>
    `;
    document.body.appendChild(trash);

    const countEl = trash.querySelector('.tm-trash-count');

    trash.addEventListener('dragenter', (e) => {
      e.preventDefault();
      e.stopPropagation();
      trash.classList.add('tm-hover');
    });

    trash.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
      }
    });

    trash.addEventListener('dragleave', (e) => {
      if (!trash.contains(e.relatedTarget)) {
        trash.classList.remove('tm-hover');
      }
    });

    trash.addEventListener('drop', async (e) => {
      e.preventDefault();
      trash.classList.remove('tm-hover');
      if (!dragItems || !dragItems.length) return;

      await runBulkDelete(dragItems);

      dragItems = null;
      updateSelectionUI();
    });

    trash._countEl = countEl;
    return trash;
  }

  function updateTrashZone(count) {
    const trash = getOrCreateTrashZone();
    const countEl = trash._countEl;

    if (count > 0) {
      trash.classList.add('tm-visible');
      if (countEl) {
        countEl.style.display = 'block';
        countEl.textContent = String(count);
      }
    } else {
      trash.classList.remove('tm-visible');
      if (countEl) {
        countEl.style.display = 'none';
      }
    }
  }

  function updateSelectionUI() {
    const count = getSelectedLinks().length;
    updateTrashZone(count);
  }

  function patchHideConversation(conversationId, token) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'PATCH',
        url: `https://chatgpt.com/backend-api/conversation/${conversationId}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify({ is_visible: false }),
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) {
            resolve(res);
          } else {
            const err = new Error(`Status ${res.status}`);
            err.status = res.status;
            err.responseText = res.responseText;
            reject(err);
          }
        },
        onerror: (err) => {
          const e = err instanceof Error ? err : new Error('Network error');
          e.status = null;
          reject(e);
        },
      });
    });
  }

  async function runBulkDelete(linksOverride, attempt = 1) {
    const linksBase =
      linksOverride && linksOverride.length
        ? Array.from(linksOverride)
        : getSelectedLinks();

    if (!linksBase.length) return;

    const token = await getAuthToken();
    if (!token) {
      console.error('no auth token');
      return;
    }

    // Reset failure styling for this attempt
    linksBase.forEach((link) => {
      link.classList.remove('tm-delete-failed');
    });

    const items = linksBase
      .map((link) => ({ link, id: getChatIdFromLink(link) }))
      .filter((x) => !!x.id);

    if (!items.length) return;

    log(`Delete attempt ${attempt}, items: ${items.length}`);

    const promises = items.map(({ id }) => patchHideConversation(id, token));
    const results = await Promise.allSettled(promises);

    let success = 0;
    let fail = 0;
    let nonRetryable = 0;
    const retryLinks = [];

    results.forEach((result, idx) => {
      const { link, id } = items[idx];

      if (result.status === 'fulfilled') {
        link.remove();
        success++;
        return;
      }

      fail++;
      const err = result.reason || {};
      const status =
        typeof err.status === 'number' ? err.status : null;
      const retryable =
        status === null || RETRYABLE_STATUSES.includes(status);

      console.error(
        'failed to delete',
        id,
        `(status=${status})`,
        err
      );

      link.classList.add('tm-delete-failed', 'tm-selected');

      if (retryable) {
        retryLinks.push(link);
      } else {
        nonRetryable++;
      }
    });

    log(
      `Attempt ${attempt} finished: Success: ${success}, Failed: ${fail}, Retryable: ${retryLinks.length}, Non-retryable: ${nonRetryable}`
    );

    updateSelectionUI();

    if (retryLinks.length && attempt < MAX_DELETE_ATTEMPTS) {
      setTimeout(() => {
        runBulkDelete(retryLinks, attempt + 1);
      }, RETRY_DELAY_MS);
      return;
    }

    if (!retryLinks.length && fail === 0) {
      clearSelection();
    } else if (!retryLinks.length) {
      // we hit permanent failures; keep them red + selected
      log(
        `Giving up on ${fail} items after ${attempt} attempts (all non-retryable or exhausted attempts)`
      );
    }
  }

  // Click selection
  document.addEventListener(
    'click',
    (e) => {
      const link = getHistoryLinkFromTarget(e.target);
      if (link) {
        e.preventDefault();
        e.stopPropagation();
        handleSelectionClick(link, e);
        return;
      }
      clearSelection();
    },
    true
  );

  // Double-click to open
  document.addEventListener(
    'dblclick',
    (e) => {
      const link = getHistoryLinkFromTarget(e.target);
      if (!link) return;

      e.preventDefault();
      e.stopPropagation();

      const href = link.getAttribute('href');
      if (href) window.location.assign(href);
    },
    true
  );

  // Ensure draggable on mousedown
  document.addEventListener(
    'mousedown',
    (e) => {
      const history = document.getElementById('history');
      if (!history) return;

      const link = getHistoryLinkFromTarget(e.target);
      if (!link) return;
      if (!link.hasAttribute('draggable')) {
        link.setAttribute('draggable', 'true');
      }
    },
    true
  );

  document.addEventListener(
    'dragstart',
    (e) => {
      const link = getHistoryLinkFromTarget(e.target);
      if (!link) return;

      const selected = getSelectedLinks();

      if (!selected.length) {
        addSelected(link);
        updateSelectionUI();
      }

      dragItems = getSelectedLinks();

      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', 'chatgpt-history-drag');
      }
    },
    true
  );

  document.addEventListener(
    'dragend',
    () => {
      dragItems = null;
      // selection stays; user can drag again
    },
    true
  );

  // Keep trash zone in sync + warm up token early
  const interval = setInterval(() => {
    const history = document.getElementById('history');
    if (history) {
      getOrCreateTrashZone();
      updateSelectionUI();
      // cheap enough to leave running, but we can also warm auth once
      getAuthToken();
    }
  }, 200);
})();
