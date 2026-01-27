// ==UserScript==
// @name         Mangago Backup – by eppy
// @namespace    mangago.manga.backup.only.fulldeep
// @version      1.1.0
// @description  Fully backs up Mangago manga lists (Want To Read, Reading, Already Read) with complete pagination into a CSV file.
// @author       Epsit Ghodke (eppy)
// @license      MIT
// @match        https://www.mangago.me/home/people/*
// @match        https://www.mangago.me/home/people/*/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564274/Mangago%20Backup%20%E2%80%93%20by%20eppy.user.js
// @updateURL https://update.greasyfork.org/scripts/564274/Mangago%20Backup%20%E2%80%93%20by%20eppy.meta.js
// ==/UserScript==

(function () {
'use strict';

/********************************************************************
 * HARD DEPENDENCY CHECK
 ********************************************************************/
if (!window.jQuery) {
  console.warn('Mangago backup: jQuery not found');
  return;
}
const $ = window.jQuery;

/********************************************************************
 * STORAGE KEYS
 ********************************************************************/
const KEY_DATA  = 'MGG_ONLY_MANGA_DATA';
const KEY_STATE = 'MGG_ONLY_MANGA_STATE';
const KEY_LOCK  = 'MGG_ONLY_MANGA_LOCK';

/********************************************************************
 * BASIC UTILITY HELPERS
 ********************************************************************/
const sleep = ms => new Promise(r => setTimeout(r, ms));

const load = key => {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null');
  } catch (e) {
    return null;
  }
};

const save = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const del = key => {
  localStorage.removeItem(key);
};

const esc = value => {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
};

/********************************************************************
 * URL / PAGE HELPERS
 ********************************************************************/
const getUserId = () => {
  const parts = location.pathname.split('/');
  const idx = parts.indexOf('people');
  return idx !== -1 ? parts[idx + 1] : null;
};

const getTotalPages = () => {
  const el = $('.pagination');
  if (!el.length) return 1;
  const total = el.attr('total');
  return total ? parseInt(total, 10) : 1;
};

/********************************************************************
 * STATUS / TAB HELPERS
 ********************************************************************/
function statusFromTab(tab) {
  if (tab === 1) return 'WantToRead';
  if (tab === 2) return 'Reading';
  if (tab === 3) return 'AlreadyRead';
  return '';
}

function tabPath(tab, uid) {
  return `/home/people/${uid}/manga/${tab}/?page=1`;
}

/********************************************************************
 * CORE EXTRACTION LOGIC
 ********************************************************************/
function extractMangaRows(status) {
  const rows = [];

  $('.manga').each((_, el) => {
    const $m = $(el);
    const $a = $m.find('.title a');

    let rating = '';
    const starFill = $m.find('.stars9 .stars9').css('width');
    if (starFill) {
      const px = parseInt(starFill.replace('px',''), 10);
      if (!isNaN(px)) rating = Math.round(px / 11);
    }

    const authorText = $m.find('.title').next().text();
    let author = '';
    if (authorText && authorText.includes('|')) {
      author = authorText.split('|')[1].trim();
    }

    const dateMatch = $m.text().match(/\d{4}-\d{2}-\d{2}/);

    rows.push({
      Type: 'Manga',
      Title: $a.text().trim(),
      Author: author,
      Link: $a.attr('href') || '',
      Thumbnail: $m.find('img').data('src') || '',
      Date: dateMatch ? dateMatch[0] : '',
      Rating: rating,
      ReadingStatus: status
    });
  });

  return rows;
}

/********************************************************************
 * ENGINE – STATE MACHINE (UNCHANGED, STABLE)
 ********************************************************************/
const Engine = {

  start() {
    if (localStorage.getItem(KEY_LOCK)) return;

    save(KEY_DATA, []);
    save(KEY_STATE, {
      tab: 1,
      page: 1,
      total: null,
      visited: []
    });
    save(KEY_LOCK, true);

    location.href = tabPath(1, getUserId());
  },

  async resume() {
    const state = load(KEY_STATE);
    if (!state) return;

    const url = location.href;
    if (state.visited.includes(url)) {
      this.advanceTab();
      return;
    }

    state.visited.push(url);
    save(KEY_STATE, state);

    if (state.total === null) {
      state.total = getTotalPages();
      save(KEY_STATE, state);
    }

    const rows = extractMangaRows(statusFromTab(state.tab));
    if (rows.length) {
      save(KEY_DATA, (load(KEY_DATA) || []).concat(rows));
    }

    if (state.page < state.total) {
      state.page++;
      save(KEY_STATE, state);
      await sleep(1000);
      location.href = location.pathname + `?page=${state.page}`;
    } else {
      this.advanceTab();
    }
  },

  advanceTab() {
    const state = load(KEY_STATE);

    if (state.tab < 3) {
      state.tab++;
      state.page = 1;
      state.total = null;
      save(KEY_STATE, state);
      location.href = tabPath(state.tab, getUserId());
    } else {
      Exporter.finish();
    }
  }
};

/********************************************************************
 * EXPORTER
 ********************************************************************/
const Exporter = {

  finish() {
    const rows = load(KEY_DATA) || [];
    if (!rows.length) {
      this.cleanup();
      return;
    }

    const headers = Object.keys(rows[0]).join(',');
    const body = rows.map(r => Object.values(r).map(esc).join(','));
    const csv = [headers, ...body].join('\n');

    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `mangago-manga-backup-${getUserId()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    this.cleanup();
  },

  cleanup() {
    del(KEY_DATA);
    del(KEY_STATE);
    del(KEY_LOCK);
  }
};

/********************************************************************
 * UI INJECTION
 ********************************************************************/
function injectUI() {
  const $h1 = $('.user-profile h1');
  if (!$h1.length) return;

  // Backup button
  $('<button>')
    .text('📚 Backup Manga')
    .css({
      marginLeft: '10px',
      padding: '8px 12px',
      background: '#0069ed',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px'
    })
    .on('click', () => Engine.start())
    .appendTo($h1);

  // Twitter link (Eppy, blue, Twitter icon — not X)
  $('<a>')
    .attr({
      href: 'https://twitter.com/epppyyy',
      target: '_blank',
      title: 'Reach out to eppy on Twitter'
    })
    .css({
      marginLeft: '14px',
      color: '#1DA1F2',
      fontWeight: '600',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '14px'
    })
    .html('<img src="https://abs.twimg.com/favicons/twitter.ico" width="18"> eppy')
    .appendTo($h1);
}

/********************************************************************
 * DIALOG SUPPRESSION (BEST EFFORT)
 ********************************************************************/
(function suppressDialogs() {
  window.alert   = function () {};
  window.confirm = function () { return true; };
  window.prompt  = function () { return null; };
})();

/********************************************************************
 * BOOTSTRAP
 ********************************************************************/
injectUI();

if (load(KEY_STATE)) {
  Engine.resume();
}

})();