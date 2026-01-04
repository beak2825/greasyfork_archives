// ==UserScript==
// @name         Good2Dou
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  Extract Goodreads metadata to help add a new subject to Douban
// @author       cccccc
// @match        *://*.goodreads.com/book/show/*
// @match        *://book.douban.com/new_subject*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      *
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554760/Good2Dou.user.js
// @updateURL https://update.greasyfork.org/scripts/554760/Good2Dou.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const STORAGE_KEY = 'douban_book_meta_global';

  const storage = {
    async get(key) {
      const v = GM_getValue(key);
      try {
        return v ? JSON.parse(v) : null;
      } catch (_e) {
        return v || null;
      }
    },
    async set(obj) {
      // store as JSON string to preserve objects
      for (const k of Object.keys(obj)) {
        const val = obj[k] === undefined ? null : obj[k];
        try {
          GM_setValue(k, JSON.stringify(val));
        } catch (e) {
          // fallback: store primitive as-is
          GM_setValue(k, val);
        }
      }
    }
  };

  const readStored = async () => storage.get(STORAGE_KEY);
  const saveGlobal = async meta => {
    if (!meta) return;
    await storage.set({ [STORAGE_KEY]: meta });
    console.info('Saved metadata globally:', meta);
  };

  async function extractGoodreadsMeta() {
    try {
      const nextDataEl = document.querySelector('#__NEXT_DATA__');
      if (!nextDataEl) return null;
      const json = JSON.parse(nextDataEl.textContent);
      const apollo = json?.props?.pageProps?.apolloState || {};
      const objects = { Book: [], Work: [], Series: [], Contributor: [] };
      for (const v of Object.values(apollo)) {
        const t = v.__typename;
        if (t && objects[t]) objects[t].push(v);
      }
      const b = objects.Book.find(x => x.title);
      if (!b) return null;

      const data = {};
      data.title = b.title || '';
      data.description = (b.description || '')
        .replace(/<br\s*\/?\>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .trim();
      data.author = objects.Contributor.filter(c => c.name).map(c => c.name);
      data.cover = b.imageUrl || '';
      data.pages = b.details?.numPages || null;
      data.binding = b.details?.format || '';
      data.format = normalizeFormat(data.binding);
      data.publisher = b.details?.publisher || '';
      data.isbn = b.details?.isbn13 || b.details?.isbn || null;

      const full_title = (data.title || '').trim();
      if (full_title.includes(':')) {
        const [left, ...rest] = full_title.split(':');
        data.main_title = left.trim();
        data.subtitle = rest.join(':').trim() || '';
      } else {
        data.main_title = full_title;
        data.subtitle = null;
      }

      const pubTime = b.details?.publicationTime || null;
      if (pubTime) {
        const dt = new Date(pubTime);
        data.pub_year = dt.getFullYear();
        data.pub_month = dt.getMonth() + 1;
        data.pub_day = dt.getDate();
      }

      await saveGlobal(data);
      console.log('Extracted Goodreads Metadata:', data);
      return data;
    } catch (e) {
      console.error('extractGoodreadsMeta error', e);
      return null;
    }
  }

  const normalizeFormat = binding => {
    if (!binding) return '';
    const lower = binding.toLowerCase();
    if (lower.includes('paperback')) return 'Paperback';
    if (lower.includes('hardcover') || lower.includes('hardback')) return 'Hardcover';
    if (lower.includes('ebook')) return 'eBook';
    if (lower.includes('audiobook')) return 'Audiobook';
    return binding;
  };

  async function saveCover() {
    const meta = await readStored();
    try {
      if (!meta || !meta.cover) {
        console.warn('No cover image found.');
        return null;
      }

      // use GM_xmlhttpRequest to avoid CORS when necessary
      return new Promise((resolve) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: meta.cover,
          responseType: 'blob',
          onload(res) {
            try {
              const blob = res.response;
              const reader = new FileReader();
              reader.onload = () => {
                const a = document.createElement('a');
                a.href = reader.result;
                a.download = `${meta.main_title}.jpg`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                resolve(meta.cover);
              };
              reader.readAsDataURL(blob);
            } catch (e) {
              console.error('saveCover read error', e);
              resolve(null);
            }
          },
          onerror() { resolve(null); }
        });
      });
    } catch (e) {
      console.error('saveCover error', e);
      return null;
    }
  }

  async function parseAndRedirect() {
    try {
      const meta = await extractGoodreadsMeta();
      setTimeout(() => window.open('https://book.douban.com/new_subject', '_blank'), 300);
      return meta;
    } catch (e) {
      console.error('parseAndRedirect error', e);
      return null;
    }
  }

  // Small DOM helpers
  const setValue = (selector, value) => {
    if (!value) return false;
    const el = document.querySelector(selector);
    if (!el) return false;
    el.value = value;
    return true;
  };

  const setSelectValue = (selector, value) => {
    if (value == null) return false;
    const el = document.querySelector(selector);
    if (!el) return false;
    el.value = value;
    el.dispatchEvent(new Event('change'));
    return true;
  };

  const setTextarea = (selector, value) => {
    if (!value) return false;
    const el = document.querySelector(selector);
    if (!el) return false;
    el.value = value;
    return true;
  };

  async function fillDoubanPage1() {
    const meta = await readStored();
    if (!meta) return;
    setValue('#p_title', meta.title) || setValue('input[name="p_title"]', meta.title);
    setValue('#uid', meta.isbn) || setValue('input[name="p_uid"]', meta.isbn);
    console.info('Filled Douban page 1.');
  }

  async function fillDoubanPage2() {
    const meta = await readStored();
    if (!meta) return;

    const fieldMap = {
      '#p_2': 'main_title',
      '#p_42': 'subtitle',
      '#p_6': 'publisher',
      '#p_58_other': 'format',
      '#p_9': 'isbn',
      '#p_10': 'pages'
    };

    for (const [selector, metaKey] of Object.entries(fieldMap)) {
      if (meta[metaKey] != null) setValue(selector, meta[metaKey]);
    }

    setTextarea('textarea[name="p_3_other"]', meta.description);

    if (Array.isArray(meta.author)) {
        const addLink = document.querySelector("ul li:last-child .add");
        meta.author.forEach((name, i) => {
            const selector = `#p_5_${i}`;
            setValue(selector, name) || (addLink.click(), setValue(selector, name));
            
        });
    }

    setSelectValue('#p_7_selectYear', meta.pub_year);
    // chain month/day after a short delay to allow any dynamic select population
    setTimeout(() => setSelectValue('#p_7_selectMonth', meta.pub_month), 300);
    setTimeout(() => setSelectValue('#p_7_selectDay', meta.pub_day), 600);

    console.info('Filled Douban page 2.');
  }

  // Create toolbar element and attach appropriate buttons
  function createToolbarElement() {
    const toolbar = document.createElement('div');
    toolbar.id = 'douban-helper-toolbar';
    toolbar.style.zIndex = 9999;
    toolbar.style.position = 'relative';

    const makeButton = (label, cb, color = '#28a745') => {
      const b = document.createElement('button');
      b.textContent = label;
      b.type = 'button';
      b.style.cssText = `padding:6px 5px;margin:3px;border-radius:4px;border:none;background:${color};color:#fff;cursor:pointer;font-weight:300;`;
      b.onclick = cb;
      return b;
    };

    const host = location.hostname || '';
    if (/goodreads/i.test(host)) {
      toolbar.appendChild(makeButton('Add to Douban', parseAndRedirect));
    } else if (/douban\.com/i.test(host)) {
      const isPage1 = !!document.querySelector('#p_title');
      const isPage2 = !!document.querySelector('#p_2');
      const isPage3 = !!document.querySelector('input[name="img_submit"]');
      if (isPage1) toolbar.appendChild(makeButton('ISBN & Title', fillDoubanPage1));
      if (isPage2) toolbar.appendChild(makeButton('Autofill More', fillDoubanPage2));
      if (isPage3) toolbar.appendChild(makeButton('Download Cover', saveCover));
    }

    return toolbar;
  }

  // Ensure toolbar exists and re-insert if removed by site re-renders
  function ensureToolbar() {
    if (document.getElementById('douban-helper-toolbar')) return;

    const toolbar = createToolbarElement();
    const h1 = document.querySelector('h1');
    if (h1 && h1.parentNode) h1.insertAdjacentElement('afterend', toolbar);
    else document.body.appendChild(toolbar);
  }

  // Observe DOM mutations and re-insert toolbar if it's removed
  function installToolbarObserver() {
    if (window.__douban_toolbar_observer_installed) return;
    window.__douban_toolbar_observer_installed = true;

    const observer = new MutationObserver(() => {
      if (!document.getElementById('douban-helper-toolbar')) ensureToolbar();
    });
    observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

    // listen for navigation events (single-page-app style)
    window.addEventListener('popstate', () => setTimeout(ensureToolbar, 200));
    window.addEventListener('pushstate', () => setTimeout(ensureToolbar, 200));
    // catch common libraries firing pushstate via history API
    const _pushState = history.pushState;
    history.pushState = function () { const r = _pushState.apply(this, arguments); window.dispatchEvent(new Event('pushstate')); return r; };
  }

  // Initialize toolbar resiliently
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { ensureToolbar(); installToolbarObserver(); });
  } else {
    ensureToolbar();
    installToolbarObserver();
  }
})();