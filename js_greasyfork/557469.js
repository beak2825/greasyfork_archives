// ==UserScript==
// @name        4chan flag counter (Flaggot v2)
// @description Flag counter for 4chan
// @version     2.0.0
// @author      wolffgang
// @namespace   wolffgang
// @match       *://boards.4chan.org/*
// @match       *://boards.4channel.org/*
// @grant       GM_setValue
// @grant       GM_getValue
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/557469/4chan%20flag%20counter%20%28Flaggot%20v2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557469/4chan%20flag%20counter%20%28Flaggot%20v2%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Browser compatibility check
  if (!window.MutationObserver || !document.querySelector) {
    console.log('Browser not supported');
    return;
  }

  // Modern DOM utilities using const/let
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // State management
  const state = {
    enabled: GM_getValue('flaggot_enabled', true),
    showingUnique: GM_getValue('flaggot_showing_unique', false),
    hasSetup: false,
    anyUserIds: false,
    flags: new Map(),
    posts: new Map(),
    lastHighlighted: null,
    scrollIgnoreTimer: null
  };

  // UI nodes
  const ui = {
    header: null,
    flagContainer: null,
    modeStatus: null
  };

  // Post processing queue with requestIdleCallback
  class PostQueue {
    constructor() {
      this.queue = [];
      this.processing = false;
    }

    add(posts) {
      this.queue.push(...posts);
      this.process();
    }

    async process() {
      if (this.processing || this.queue.length === 0) return;

      this.processing = true;
      const batch = this.queue.splice(0, 25);
      const updates = new Map();

      for (const post of batch) {
        this.processPost(post, updates);
      }

      if (updates.size > 0) {
        updateFlagCounting(updates);
        updateFlagOrder();

        if (!state.anyUserIds && [...updates.values()].some(f => f.userIds.size > 0)) {
          state.anyUserIds = true;
          updateDisplayStatus();
        }
      }

      // Continue processing with idle callback
      if (this.queue.length > 0) {
        requestIdleCallback(() => {
          this.processing = false;
          this.process();
        }, { timeout: 250 });
      } else {
        this.processing = false;
      }
    }

    processPost(post, updates) {
      const id = getPostId(post);
      const flag = getFlag(post);

      if (!id || state.posts.has(id) || !flag) return;

      state.posts.set(id, flag);

      if (!state.hasSetup) setup();

      const key = getFlagKey(flag);
      let flagData = state.flags.get(key);

      if (!flagData) {
        flagData = {
          type: flag[0],
          name: flag[1],
          posts: [id],
          userIds: new Map(),
          nodes: createFlagStat(flag[0], flag[1], key)
        };
        state.flags.set(key, flagData);
        ui.flagContainer.appendChild(flagData.nodes.container);
      } else {
        flagData.posts.push(id);
      }

      const userId = getUserId(post);
      if (userId) {
        state.anyUserIds = true;
        if (!flagData.userIds.has(userId)) {
          flagData.userIds.set(userId, []);
        }
        flagData.userIds.get(userId).push(id);
      }

      updates.set(key, flagData);
    }
  }

  const postQueue = new PostQueue();

  // Extract data from posts using modern methods
  const getUserId = (container) => {
    const node = $('.nameBlock > .posteruid > .hand', container);
    return node?.textContent.trim() || null;
  };

  const getPostId = (container) => {
    const id = container.id || container.querySelector('[id]')?.id;
    return id?.match(/\d+/)?.[0] || null;
  };

  const getFlag = (container) => {
    const node = $('.nameBlock > .flag', container);
    const match = node?.className.match(/\bflag-([\w\-_]+)/);
    return match ? [match[1], node.getAttribute('title') || ''] : null;
  };

  const getFlagKey = (flag) => flag[1] || flag[0];

  // Modern CSS-in-JS
  const injectStyles = () => {
    const styles = `
      .flaggot_header {
        position: fixed;
        left: 0;
        max-width: 100%;
        top: 0;
        box-sizing: border-box;
        padding: 0.5em;
        margin: 0;
        white-space: normal !important;
        pointer-events: none;
        transition: padding 0.25s ease-in-out, font-size 0.25s ease-in-out;
      }
      .flaggot_header.flaggot_disabled {
        padding: 0;
        font-size: 0.8em;
      }
      .flaggot_header.flaggot_header_standard {
        z-index: 1;
      }
      .flaggot_header.flaggot_header_in_4chanx_header {
        position: absolute;
        top: 100%;
      }
      div.flaggot_header_bg.post.reply {
        display: block !important;
        margin: 0 !important;
        padding: 0 !important;
        border-radius: 0 !important;
        border: 0 !important;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 0 !important;
        opacity: 0 !important;
        transition: width 0s ease-in-out 0.25s, opacity 0.25s linear;
        overflow: visible !important;
      }
      .flaggot_header:not(.flaggot_disabled):hover > div.flaggot_header_bg.post.reply {
        width: 100% !important;
        opacity: 0.9 !important;
        transition: width 0.25s ease-in-out, opacity 0s linear;
      }
      .flaggot_table {
        position: relative;
        display: table;
        max-width: 100%;
        box-sizing: border-box;
        pointer-events: auto;
      }
      .flaggot_row { display: table-row; }
      .flaggot_cell {
        display: table-cell;
        vertical-align: top;
        width: 100%;
      }
      .flaggot_cell:first-of-type {
        width: 0;
        white-space: nowrap !important;
      }
      .flaggot_header.flaggot_disabled .flaggot_flags {
        display: none;
      }
      .flaggot_enabled, .flaggot_enabled + .riceCheck {
        vertical-align: middle;
        padding: 0;
        margin: 0 0.25em 0 0;
        transition: margin 0.25s ease-in-out;
      }
      .flaggot_header.flaggot_disabled .flaggot_enabled,
      .flaggot_header.flaggot_disabled .flaggot_enabled + .riceCheck {
        margin-right: 0;
      }
      .flaggot_label {
        margin: 0;
        padding: 0;
        cursor: pointer;
      }
      .flaggot_label_text {
        font-weight: bold;
        vertical-align: middle;
      }
      .flaggot_header.flaggot_disabled .flaggot_label_text {
        opacity: 0.375;
      }
      .flaggot_label_text_enabled {
        font-weight: bold;
        vertical-align: middle;
        display: none;
      }
      .flaggot_enabled:checked ~ .flaggot_label_text_enabled {
        display: inline;
      }
      .flaggot_stat {
        display: inline-block;
        text-align: center;
        vertical-align: top;
        margin: 0 0 0 0.125em;
        border: 1px solid transparent;
        cursor: pointer;
        border-radius: 0.125em;
      }
      .flaggot_stat:hover {
        background-color: rgba(0, 0, 0, 0.125);
        border-color: rgba(255, 255, 255, 0.125);
      }
      .flaggot_stat_inner {
        display: block;
        vertical-align: center;
        margin-bottom: -0.5em;
      }
      .flaggot_flag {
        margin: 0 0.375em;
      }
      .flaggot_count {
        display: inline-block;
        position: relative;
        top: -0.5em;
        font-size: 0.8em;
      }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
  };

  const createFlagStat = (type, title, key) => {
    const container = document.createElement('span');
    container.className = 'flaggot_stat';
    container.title = title;
    container.addEventListener('click', (e) => onFlagClick(e, key));

    const inner = document.createElement('span');
    inner.className = 'flaggot_stat_inner';

    const flag = document.createElement('span');
    flag.className = `flaggot_flag flag flag-${type}`;

    const count = document.createElement('span');
    count.className = 'flaggot_count';

    inner.append(flag, document.createElement('br'), count);
    container.appendChild(inner);

    return { container, count };
  };

  const updateFlagCounting = (updates) => {
    for (const [, flagData] of updates) {
      const count = (state.showingUnique && state.anyUserIds)
        ? flagData.userIds.size
        : flagData.posts.length;
      flagData.nodes.count.textContent = count;
      flagData.nodes.container.dataset.count = count;
    }
  };

  const updateFlagOrder = () => {
    const nodes = [...ui.flagContainer.children].sort((a, b) =>
      (parseInt(b.dataset.count) || 0) - (parseInt(a.dataset.count) || 0)
    );
    ui.flagContainer.append(...nodes);
  };

  const updateDisplayStatus = () => {
    if (state.enabled) {
      ui.header.classList.remove('flaggot_disabled');
      ui.modeStatus.textContent = (state.showingUnique && state.anyUserIds) ? 'Unique' : 'Flags';
    } else {
      ui.header.classList.add('flaggot_disabled');
      ui.modeStatus.textContent = 'Flags';
    }
  };

  const onEnabledChange = (checkbox) => {
    if (state.enabled) {
      if (state.showingUnique) {
        state.showingUnique = false;
        state.enabled = false;
      } else {
        state.showingUnique = state.anyUserIds;
        if (!state.anyUserIds) state.enabled = false;
      }
      updateFlagCounting(state.flags);
    } else {
      state.enabled = true;
      state.showingUnique = false;
    }

    checkbox.checked = state.enabled;
    updateDisplayStatus();

    GM_setValue('flaggot_enabled', state.enabled);
    GM_setValue('flaggot_showing_unique', state.showingUnique);
  };

  const getHeaderHeight = () => {
    const header = $('#header-bar') || $('#boardNavMobile');
    return header?.getBoundingClientRect().height || 0;
  };

  const onFlagClick = (event, type) => {
    if (event.which && event.which !== 1) return;

    const headerHeight = getHeaderHeight();
    const posts = $$('.postContainer');
    if (posts.length === 0) return;

    let startIdx = 0;
    if (state.lastHighlighted) {
      startIdx = posts.indexOf(state.lastHighlighted) + 1;
    }

    for (let i = 0; i < posts.length; i++) {
      const idx = (startIdx + i) % posts.length;
      const post = posts[idx];
      const flag = getFlag(post);

      if (flag && getFlagKey(flag) === type) {
        const y = window.pageYOffset;
        const rect = post.getBoundingClientRect();
        window.scrollTo(0, y + rect.top - headerHeight);
        state.lastHighlighted = post;
        break;
      }
    }
  };

  const setup = () => {
    if (state.hasSetup) return;
    state.hasSetup = true;

    injectStyles();

    const header = document.createElement('div');
    header.className = 'flaggot_header';
    ui.header = header;

    const bg = document.createElement('div');
    bg.className = 'flaggot_header_bg post reply';
    header.appendChild(bg);

    const table = document.createElement('div');
    table.className = 'flaggot_table';

    const row = document.createElement('div');
    row.className = 'flaggot_row';

    const cell1 = document.createElement('div');
    cell1.className = 'flaggot_cell';

    const label = document.createElement('label');
    label.className = 'flaggot_label';

    const checkbox = document.createElement('input');
    checkbox.className = 'flaggot_enabled';
    checkbox.type = 'checkbox';
    checkbox.checked = state.enabled;
    checkbox.addEventListener('change', () => onEnabledChange(checkbox));

    const riceCheck = document.createElement('span');
    riceCheck.className = 'riceCheck';

    ui.modeStatus = document.createElement('span');
    ui.modeStatus.className = 'flaggot_label_text';

    const enabledText = document.createElement('span');
    enabledText.className = 'flaggot_label_text_enabled';
    enabledText.textContent = ':';

    label.append(checkbox, riceCheck, ui.modeStatus, enabledText);
    cell1.appendChild(label);

    const cell2 = document.createElement('div');
    cell2.className = 'flaggot_cell';

    ui.flagContainer = document.createElement('div');
    ui.flagContainer.className = 'flaggot_flags';
    cell2.appendChild(ui.flagContainer);

    row.append(cell1, cell2);
    table.appendChild(row);
    header.appendChild(table);

    updateDisplayStatus();

    const headerBar = $('#header-bar');
    if (headerBar) {
      header.classList.add('flaggot_header_in_4chanx_header');
      headerBar.appendChild(header);
    } else {
      header.classList.add('flaggot_header_standard');
      document.body.appendChild(header);
    }
  };

  const observeBody = (records) => {
    const newPosts = [];

    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;

        if (node.matches?.('.postContainer, .post.inlined, #quote-preview')) {
          newPosts.push(node);
        } else if (node.id === 'qp' || node.classList.contains('thread') || node.classList.contains('inline')) {
          newPosts.push(...$$('.postContainer, .post.inlined, #quote-preview', node));
        }
      }
    }

    if (newPosts.length > 0) {
      postQueue.add(newPosts);
    }
  };

  const init = () => {
    const hasFlags = $("link[href*='4cdn.org/css/flags']");
    if (!hasFlags) return;

    const initialPosts = $$('.postContainer');
    if (initialPosts.length > 0) {
      postQueue.add(initialPosts);
    }

    new MutationObserver(observeBody).observe(document.body, {
      childList: true,
      subtree: true
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 1000));
  } else {
    setTimeout(init, 1000);
  }

})();