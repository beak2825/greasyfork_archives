// ==UserScript==
// @name          网页字体加粗
// @description   将宽度小于500的字体加粗
// @namespace     https://www.tampermonkey.net/
// @version       1.0
// @author        Gemini
// @match         *://*/*
// @grant         none
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/561967/%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E5%8A%A0%E7%B2%97.user.js
// @updateURL https://update.greasyfork.org/scripts/561967/%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E5%8A%A0%E7%B2%97.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const config = {
    weight: 500,
    chunk_size: 500,
    excluded_tags: new Set([
      'AREA', 'AUDIO', 'BASE', 'BR', 'CANVAS', 'COL', 'COLGROUP', 
      'EMBED', 'HEAD', 'HR', 'IFRAME', 'IMG', 'LINK', 'MAP', 
      'META', 'NOSCRIPT', 'OBJECT', 'PARAM', 'PICTURE', 'SCRIPT', 
      'SLOT', 'SOURCE', 'STYLE', 'TEMPLATE', 'TITLE', 'TRACK', 
      'VIDEO', 'WBR', 'SVG', 'MATH', 'PORTAL', 
      'PROGRESS', 'METER', 'DATALIST', 'OPTGROUP'
    ])
  };

  const selector = Array.from(config.excluded_tags).join(',');

  const state = {
    check_queue: [],
    modify_pool: [],
    processed: new WeakSet(),
    cache: new WeakMap(),
    is_running: false,
    mode: 'read'
  };

  const engine = {
    enqueue_tree(root) {
      if (root?.nodeType !== 1) return;

      if (state.cache.get(root) === true || root.matches(selector)) return;

      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_ELEMENT,
        {
          acceptNode: (node) => {
            const cached = state.cache.get(node);
            if (cached !== undefined) {
              return cached ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
            }

            const isExcluded = !!node.closest(selector);
            state.cache.set(node, isExcluded);
            return isExcluded ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      let currentNode = root;
      while (currentNode) {
        if (!state.processed.has(currentNode)) {
          state.check_queue.push(currentNode);
          state.processed.add(currentNode);
        }
        currentNode = walker.nextNode();
      }
      this.request_tick();
    },

    request_tick() {
      if (state.is_running) return;
      state.is_running = true;
      window.requestAnimationFrame(() => this.tick());
    },

    tick() {
      try {
        if (state.mode === 'read') {
          this.do_read();
          state.mode = state.modify_pool.length ? 'write' : 'read';
        } else {
          this.do_write();
          state.mode = state.check_queue.length ? 'read' : 'write';
        }
      } catch (e) {
        state.mode = 'read';
      }

      if (state.check_queue.length || state.modify_pool.length) {
        window.requestAnimationFrame(() => this.tick());
      } else {
        state.is_running = false;
        state.mode = 'read';
      }
    },

    do_read() {
      let count = 0;
      const { check_queue, modify_pool } = state;

      while (check_queue.length && count < config.chunk_size) {
        const el = check_queue.pop();
        if (el?.isConnected) {
          const style = window.getComputedStyle(el);
          const weight = style.fontWeight;
          if (weight && parseInt(weight) <= config.weight) {
            modify_pool.push(el);
          }
        }
        count++;
      }
    },

    do_write() {
      let count = 0;
      const { modify_pool } = state;
      const target = config.weight.toString();

      while (modify_pool.length && count < config.chunk_size) {
        const el = modify_pool.pop();
        if (el?.isConnected) {
          el.style.setProperty('font-weight', target, 'important');
        }
        count++;
      }
    }
  };

  const server = {
    init() {
      const mutation = new MutationObserver(mutations => {
        for (const { addedNodes } of mutations) {
          for (const node of addedNodes) {
            if (node.nodeType === 1) engine.enqueue_tree(node);
          }
        }
      });
      mutation.observe(document, { childList: true, subtree: true });
    }
  };

  server.init();
  engine.enqueue_tree(document.documentElement);
})();