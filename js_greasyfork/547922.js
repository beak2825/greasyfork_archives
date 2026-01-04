// ==UserScript==
// @name         AO3 Karma
// @namespace    http://lithiumdoll
// @version      0.1
// @description  Track kudos & comments with score, icons, reset & stats
// @match        https://archiveofourown.org/*
// @run-at       document-idle
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/547922/AO3%20Karma.user.js
// @updateURL https://update.greasyfork.org/scripts/547922/AO3%20Karma.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(async function () {
  'use strict';

  const CONFIG = {
    BOX_ID: 'ao3-karma-box',
    KUDOS_POINTS: 1,
    COMMENT_POINTS: 10,
    STORAGE_KEYS: { SCORE: 'score', KUDOS: 'kudos', COMMENT: 'comment', POS: 'pos' },
    TIME_RANGES: {
      Day: 86400000,
      Week: 604800000,
      Month: 2592000000,
      Year: 31536000000
    }
  };

  // One time only
  if (window.__ao3_karma_initialized) {
    window.__ao3_karma_refresh?.();
    return;
  }

  const store = {
    get: (key, def) => GM.getValue(CONFIG.STORAGE_KEYS[key], def),
    set: (key, val) => GM.setValue(CONFIG.STORAGE_KEYS[key], val)
  };

  function injectStyles() {
    const css = `
      #${CONFIG.BOX_ID} {
        position: fixed; top: 10px; right: 10px;
        width: 160px; height: 160px;
        background: #e0e0e0; color: #000;
        font: bold 48px sans-serif;
        display: flex; align-items: center; justify-content: center;
        border-radius: 12px; z-index: 999999;
        box-shadow: 0 2px 6px rgba(0,0,0,.2);
        cursor: grab; user-select: none;
        transition: transform .2s;
      }
      #${CONFIG.BOX_ID} .karma-action {
        position: absolute; cursor: pointer; color: gray;
        transition: color .2s, transform .1s;
      }
      #${CONFIG.BOX_ID} .karma-action:hover { transform: scale(1.1); }
    `;
    document.head.appendChild(Object.assign(document.createElement('style'), { textContent: css }));
  }

  class AO3Karma {
    constructor() {
      this.score = 0;
      this.kudosLog = {};
      this.commentLog = {};
    }

    async init() {
      injectStyles();
      await this.load();
      this.createUI();
      this.bindEvents();
      this.updateUI();
      window.__ao3_karma_refresh = () => this.refresh();
      window.__ao3_karma_initialized = true;
    }

    async load() {
      this.score = await store.get('SCORE', 0);
      this.kudosLog = await store.get('KUDOS', {}) || {};
      this.commentLog = await store.get('COMMENT', {}) || {};
    }

    async save() {
      await Promise.all([
        store.set('SCORE', this.score),
        store.set('KUDOS', this.kudosLog),
        store.set('COMMENT', this.commentLog)
      ]);
    }

    createUI() {
      document.getElementById(CONFIG.BOX_ID)?.remove();
      this.box = Object.assign(document.createElement('div'), { id: CONFIG.BOX_ID });

      this.scoreLabel = Object.assign(document.createElement('div'), { style: 'pointer-events:none' });
      this.box.appendChild(this.scoreLabel);

      const btn = (txt, pos, handler) => {
        const b = Object.assign(document.createElement('div'), { className: 'karma-action', textContent: txt });
        b.style.cssText = pos;
        b.onclick = e => { e.stopPropagation(); handler(); };
        return b;
      };

      this.heart = btn('♡', 'top:6px;left:8px;font-size:24px', () =>
        document.querySelector('#kudo_submit')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      );
      this.comment = btn('💬', 'top:6px;right:8px;font-size:22px', () =>
        document.querySelector('input[id^="comment_submit_for_"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      );
      const reset = btn('🔄', 'bottom:6px;left:8px;font-size:18px', () => this.reset());
      const stats = btn('📊', 'bottom:6px;right:8px;font-size:18px', () => this.stats());

      [this.heart, this.comment, reset, stats].forEach(b => this.box.appendChild(b));
      document.body.appendChild(this.box);

      this.makeDraggable();
      this.restorePos();
    }

    makeDraggable() {
      let dragging = false, offsetX = 0, offsetY = 0;
      this.box.addEventListener('mousedown', e => {
        if (e.target.classList.contains('karma-action')) return;
        dragging = true;
        this.box.style.cursor = 'grabbing';
        const r = this.box.getBoundingClientRect();
        offsetX = e.clientX - r.left;
        offsetY = e.clientY - r.top;
      });
      document.addEventListener('mousemove', e => {
        if (!dragging) return;
        const x = Math.min(window.innerWidth - this.box.offsetWidth, Math.max(0, e.clientX - offsetX));
        const y = Math.min(window.innerHeight - this.box.offsetHeight, Math.max(0, e.clientY - offsetY));
        Object.assign(this.box.style, { left: x + 'px', top: y + 'px', right: 'auto' });
      });
      document.addEventListener('mouseup', async () => {
        if (!dragging) return;
        dragging = false;
        this.box.style.cursor = 'grab';
        await store.set('POS', { top: this.box.style.top, left: this.box.style.left });
      });
    }

    async restorePos() {
      const pos = await store.get('POS', null);
      if (pos) Object.assign(this.box.style, pos, { right: 'auto' });
    }

    bindEvents() {
      document.addEventListener('click', e => {
        if (e.target?.id === 'kudo_submit') this.add('kudos', CONFIG.KUDOS_POINTS);
        if (e.target?.id?.startsWith('comment_submit_for_')) this.add('comment', CONFIG.COMMENT_POINTS, true);
      }, true);
      document.addEventListener('submit', e => {
        if (e.target?.querySelector('#kudo_commentable_id')) this.add('kudos', CONFIG.KUDOS_POINTS);
        if (e.target?.querySelector('input[id^="comment_submit_for_"]')) this.add('comment', CONFIG.COMMENT_POINTS, true);
      }, true);
    }

    getWorkId() { return document.querySelector('#kudo_commentable_id')?.value || null; }

    async add(type, points, requireText = false) {
      const id = this.getWorkId();
      if (!id) return;
      if (requireText) {
        const txt = document.querySelector('textarea[id^="comment_content_for_"]')?.value.trim();
        if (!txt) return;
      }
      const log = this[`${type}Log`];
      if (log[id]) return;
      log[id] = new Date().toISOString();
      this.score += points;
      await this.save();
      this.updateUI();
    }

    updateUI() {
      this.scoreLabel.textContent = this.score;
      const id = this.getWorkId();
      this.heart.textContent = (id && this.kudosLog[id]) ? '❤️' : '♡';
      this.heart.style.color = (id && this.kudosLog[id]) ? 'red' : 'gray';
      this.comment.style.color = (id && this.commentLog[id]) ? 'green' : 'gray';
    }

    async reset() {
      if (!confirm('Reset karma?')) return;
      this.score = 0; this.kudosLog = {}; this.commentLog = {};
      await this.save();
      this.updateUI();
    }

    stats() {
      const now = Date.now();
      const count = (log, ms) => Object.values(log).filter(ts => now - Date.parse(ts) <= ms).length;
      let msg = '⭐ Stats ⭐\n\n' +
        Object.entries(CONFIG.TIME_RANGES).map(([p, ms]) => {
          const k = count(this.kudosLog, ms), c = count(this.commentLog, ms);
          return `${p}: ${(k + c * CONFIG.COMMENT_POINTS)} points (❤️ ${k}, 💬 ${c})`;
        }).join('\n');
      msg += `\n\nAll-time: ${this.score} points (❤️ ${Object.keys(this.kudosLog).length}, 💬 ${Object.keys(this.commentLog).length})`;
      alert(msg);
    }

    async refresh() { await this.load(); this.updateUI(); }
  }

  new AO3Karma().init();
})();
