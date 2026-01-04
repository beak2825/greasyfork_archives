// ==UserScript==
// @name         Gelbooru Robust Infinite Scroll + Save State
// @namespace    vm/gelbooru-autopager-robust-save
// @version      2.1
// @description  Надёжный автопейджер для классических страниц Gelbooru (pid, теги) + сохранение/восстановление позиции и загруженных постов.
// @match        https://gelbooru.com/index.php?page=post&s=list*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/548971/Gelbooru%20Robust%20Infinite%20Scroll%20%2B%20Save%20State.user.js
// @updateURL https://update.greasyfork.org/scripts/548971/Gelbooru%20Robust%20Infinite%20Scroll%20%2B%20Save%20State.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const PAGE_SIZE = 42;
  const AUTO_LOAD = true; // автоподгрузка при прокрутке
  const SCROLL_THRESHOLD_PX = 800;

  // ---- helpers для обнаружения контейнера и постов ----
  function findPostsContainer(doc = document) {
    const candidates = [
      'ul#post-list-posts',
      '#post-list-posts',
      '#posts',
      '.thumbnail-container',
      '.thumbs',
      '.post-list',
      '#post-list',
      '#content #posts',
      'div#post-list-posts',
      'div.thumb-list'
    ];
    for (const s of candidates) {
      const el = doc.querySelector(s);
      if (el) return el;
    }
    // fallback: найдём множество ссылок на просмотр поста и возьмём их общий контейнер
    const anchors = doc.querySelectorAll('a[href*="index.php?page=post&s=view&id="], a[href*="/post/show/"], a[href*="/post/"]');
    if (anchors.length) {
      let p = anchors[0].closest('ul,div,section') || document.body;
      return p;
    }
    return null;
  }

  function getPostNodes(root) {
    const trySelectors = [
      'ul#post-list-posts > li',
      '#post-list-posts > li',
      '#posts > article',
      '#posts > div',
      '.thumbs > li',
      '.thumbs > div',
      '.thumb',
      'article.post-preview',
      'li[id^="p"]',
      '#post-list-posts li',
      '.post-preview'
    ];
    for (const sel of trySelectors) {
      const nodes = root.querySelectorAll(sel);
      if (nodes && nodes.length) return Array.from(nodes);
    }
    // супер-фолбэк: взять элементы по ссылкам на просмотр поста
    const anchors = Array.from(root.querySelectorAll('a[href*="index.php?page=post&s=view&id="], a[href*="/post/show/"], a[href*="/post/"]'));
    if (anchors.length) {
      return anchors.map(a => a.closest('li') || a.closest('div') || a);
    }
    return [];
  }

  function extractPostId(node) {
    if (!node) return null;
    // data attributes
    const ds = node.dataset?.postId || node.dataset?.id || node.getAttribute('data-id');
    if (ds && /\d/.test(ds)) return String(ds).match(/\d+/)[0];

    // id attribute like "p123"
    if (node.id) {
      const m = node.id.match(/\d+/);
      if (m) return m[0];
    }

    // ссылки внутри
    const a = node.querySelector('a[href*="index.php?page=post&s=view&id="], a[href*="/post/show/"], a[href*="/post/"]');
    if (a && a.href) {
      const m1 = a.href.match(/id=(\d+)/);
      if (m1) return m1[1];
      const m2 = a.href.match(/post\/show\/(\d+)/);
      if (m2) return m2[1];
      const m3 = a.href.match(/\/post\/(\d+)/);
      if (m3) return m3[1];
    }

    // src миниатюры / пути с цифрами
    const img = node.querySelector('img[src], img[data-src]');
    if (img && img.src) {
      const m = img.src.match(/\/(\d+)[^\d]/);
      if (m) return m[1];
    }

    return null;
  }

  function absolutize(node, baseHref) {
    const base = new URL(baseHref, location.origin);
    // обычные ссылки
    node.querySelectorAll('a[href]').forEach(a => {
      try { a.href = new URL(a.getAttribute('href'), base).href; } catch(e) {}
    });
    // img: если lazy (data-src) — перенести
    node.querySelectorAll('img').forEach(img => {
      const ds = img.getAttribute('data-src') || img.getAttribute('data-original') || img.getAttribute('data-lazy-src');
      if (ds) {
        try { img.src = new URL(ds, base).href; } catch(e) {}
      } else if (img.getAttribute('src')) {
        try { img.src = new URL(img.getAttribute('src'), base).href; } catch(e) {}
      }
      // srcset
      const ss = img.getAttribute('srcset');
      if (ss) {
        const parts = ss.split(',').map(s => s.trim()).map(entry => {
          const [url, dpr] = entry.split(/\s+/);
          try { return new URL(url, base).href + (dpr ? ' ' + dpr : ''); } catch(e) { return entry; }
        });
        img.setAttribute('srcset', parts.join(', '));
      }
    });
  }

  // ---- начальная логика ----
  const container = findPostsContainer(document);
  if (!container) {
    console.warn('[Gelbooru Autopager] контейнер не найден — возможно нестандартная тема');
    return;
  }

  // сформируем ключ для localStorage: URL *без* pid (чтобы хранить по тегам/поиску)
  const curUrl = new URL(location.href);
  const paramsNoPid = new URLSearchParams(curUrl.searchParams);
  paramsNoPid.delete('pid');
  const STORAGE_KEY = 'gelbooru_autopager:' + curUrl.origin + curUrl.pathname + '?' + paramsNoPid.toString();

  // прочитаем pid из url (если есть)
  let pid = parseInt(curUrl.searchParams.get('pid') || '0', 10) || 0;
  let loading = false;
  let ended = false;

  // восстановление состояния (если есть)
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved && saved.html && !isNaN(Number(saved.pid))) {
        // подменяем содержимое контейнера и восстанавливаем скролл
        try {
          container.innerHTML = saved.html;
          pid = Number(saved.pid);
          // небольшая задержка чтобы страница успела отрисоваться
          setTimeout(() => { window.scrollTo(0, saved.scroll || 0); }, 80);
          console.log('[Gelbooru Autopager] restored state, pid=', pid, ' scroll=', saved.scroll);
        } catch (e) {
          console.warn('[Gelbooru Autopager] restore failed', e);
        }
      }
    }
  } catch (e) {
    console.warn('[Gelbooru Autopager] error reading saved state', e);
  }

  // Собираем уже видимые id, чтобы не дублировать
  const initialPosts = getPostNodes(container);
  const seen = new Set(initialPosts.map(n => extractPostId(n)).filter(Boolean));
  console.log('[Gelbooru Autopager] found container with', initialPosts.length, 'items, seen=', seen.size);

  // UI: статус и кнопка
  const panel = document.createElement('div');
  panel.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:99999;background:rgba(0,0,0,0.6);color:#fff;padding:10px;border-radius:10px;font:13px/1.1 system-ui;box-shadow:0 6px 18px rgba(0,0,0,0.4)';
  const status = document.createElement('div');
  status.textContent = 'Autopager ready';
  status.style.marginBottom = '6px';
  const btn = document.createElement('button');
  btn.textContent = 'Load more';
  btn.style.cssText = 'cursor:pointer;border:none;padding:6px 10px;border-radius:8px;font-weight:600';
  const toggleAuto = document.createElement('button');
  toggleAuto.textContent = AUTO_LOAD ? 'Auto: ON' : 'Auto: OFF';
  toggleAuto.style.cssText = 'margin-left:6px;border-radius:8px;padding:6px 8px;border:none;background:#666;color:#fff';
  const clearBtn = document.createElement('button');
  clearBtn.textContent = 'Clear saved';
  clearBtn.style.cssText = 'margin-left:6px;border-radius:8px;padding:6px 8px;border:none;background:#b33;color:#fff';
  panel.appendChild(status);
  panel.appendChild(btn);
  panel.appendChild(toggleAuto);
  panel.appendChild(clearBtn);
  document.body.appendChild(panel);

  btn.addEventListener('click', () => loadNext());
  let autoEnabled = AUTO_LOAD;
  toggleAuto.addEventListener('click', () => { autoEnabled = !autoEnabled; toggleAuto.textContent = autoEnabled ? 'Auto: ON' : 'Auto: OFF'; });
  clearBtn.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    status.textContent = 'Saved cleared';
    console.log('[Gelbooru Autopager] cleared saved state for', STORAGE_KEY);
  });

  // автоподгрузка
  if (AUTO_LOAD) window.addEventListener('scroll', onScroll, { passive: true });

  function onScroll() {
    if (!autoEnabled || loading || ended) return;
    const remain = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
    if (remain < SCROLL_THRESHOLD_PX) loadNext();
    // регулярно сохраняем позицию/контент
    saveState();
  }

  async function loadNext() {
    if (loading || ended) return;
    loading = true;
    status.textContent = 'Loading...';
    pid += PAGE_SIZE;

    const next = new URL(location.href);
    next.searchParams.set('pid', String(pid));

    try {
      const resp = await fetch(next.href, { credentials: 'include' });
      if (!resp.ok) {
        console.error('[Gelbooru Autopager] HTTP', resp.status);
        status.textContent = 'HTTP ' + resp.status;
        loading = false;
        return;
      }
      const text = await resp.text();
      const doc = new DOMParser().parseFromString(text, 'text/html');

      // на странице может быть метка "no results"
      const newContainer = findPostsContainer(doc);
      const newNodes = newContainer ? getPostNodes(newContainer) : [];

      if (!newNodes || newNodes.length === 0) {
        // попробуем найти rel=next — если нет, значит конец
        const rel = doc.querySelector('a[rel="next"], link[rel="next"]');
        if (!rel) {
          ended = true;
          status.textContent = 'No more posts';
          console.log('[Gelbooru Autopager] no more posts.');
          window.removeEventListener('scroll', onScroll);
        } else {
          status.textContent = 'No items parsed from page';
        }
        loading = false;
        return;
      }

      let appended = 0;
      const frag = document.createDocumentFragment();
      for (const nd of newNodes) {
        const cloned = document.importNode(nd, true);
        const id = extractPostId(cloned);
        if (id && seen.has(id)) continue;
        if (id) seen.add(id);

        absolutize(cloned, next.href);
        frag.appendChild(cloned);
        appended++;
      }

      if (appended > 0) {
        // разделитель
        const sep = document.createElement('div');
        sep.textContent = `— page pid=${pid} —`;
        sep.style.cssText = 'text-align:center;margin:12px 0;opacity:.6;font-size:12px';
        container.appendChild(sep);
        container.appendChild(frag);
        status.textContent = `Loaded pid=${pid} (+${appended})`;

        // обновим URL без создания новой записи в истории (чтобы Back возвращал на нужный pid)
        try {
          history.replaceState(null, '', next.pathname + next.search);
        } catch (e) { /* ignore */ }

        // сохраним состояние после успешной загрузки
        saveState();
      } else {
        status.textContent = 'No new posts (duplicates)';
      }
      // small delay to let images start loading
      setTimeout(() => { loading = false; }, 300);
    } catch (err) {
      console.error('[Gelbooru Autopager] error', err);
      status.textContent = 'Error (see console)';
      loading = false;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        html: container.innerHTML,
        pid: pid,
        scroll: window.scrollY,
        ts: Date.now()
      }));
    } catch (e) {
      console.warn('[Gelbooru Autopager] save failed', e);
    }
  }

  // если страница короткая — подгрузим сразу пару страниц
  setTimeout(() => {
    if (autoEnabled) onScroll();
  }, 900);
})();