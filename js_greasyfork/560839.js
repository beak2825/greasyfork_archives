// ==UserScript==
// @name         Soyjak Party thread watcher
// @namespace    soyjak-thread-watcher
// @version      1.0.2
// @description  thread watcher for soyjak.st
// @match        https://soyjak.st/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560839/Soyjak%20Party%20thread%20watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/560839/Soyjak%20Party%20thread%20watcher.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const STORE_KEY = 'threadwatcher';
  const POS_KEY   = 'threadwatcher_pos';
  const VISIBLE_KEY = 'threadwatcher_hidden';
  const DEFAULT_POS = { x: 50, y: 50 };
  const LABEL_MAX = 30;

  if (
    location.pathname === '/' ||
    location.pathname === '/index.php' ||
    location.pathname === '/poll.php' ||
    location.pathname === '/bans.php' ||
    location.pathname === '/post.php' ||
    location.pathname === '/pass.php' ||
    location.pathname === '/banned.php' ||
    location.pathname === '/rules.html' ||
    location.pathname === '/b3.php'
  ) return;

  const state = loadState();
  const currentBoard = getBoardFromPath();
  const currentThread = getThreadFromPath();
  const currentKey = currentBoard && currentThread
    ? makeKey(currentBoard, currentThread)
    : null;

  injectCSS();

  const table = createWindow();
  render();
  updateVisibility();

  addToggleButton();

  addWatchButtons();

  if (currentKey) {
    hookPostClicks(currentKey);
    hookTinyboardInterop(currentKey);
    hookAutoReload(currentKey);
  }

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveState() {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  }

  function makeKey(board, thread) {
    return `${board}.${thread}`;
  }

  function getBoardFromPath() {
    return location.pathname.split('/').filter(Boolean)[0] || null;
  }

  function getThreadFromPath() {
    const m = location.pathname.match(/\/thread\/(\d+)\.html$/);
    return m ? Number(m[1]) : null;
  }

  function isVisible() {
    const stored = localStorage.getItem(VISIBLE_KEY);
    return stored === null ? true : stored === 'true';
  }

  function setVisible(visible) {
    localStorage.setItem(VISIBLE_KEY, visible.toString());
    updateVisibility();
  }

  function updateVisibility() {
    const visible = isVisible();
    table.style.display = visible ? '' : 'none';
  }

  function injectCSS() {
    const css = `
#twtable{position:fixed;background:#d6daf0;border:1px solid #b7c5d9;border-left:0;border-top:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;max-width:300px;z-index:99999;border-spacing:0px}#twtable th{line-height:0;text-align:center;user-select:none;cursor:move;padding:0;border-bottom:1px solid #d0c8c8}#twtable th.refresh{width:18px;cursor:default}#twtable td{line-height:14px;padding:2px 4px}#twtable .remove{text-align:center;cursor:pointer;color:#989898}.tw-watch-btn{margin-left:6px;cursor:pointer}.tw-toggle-btn{cursor:pointer;margin-right:6px}#twtable a{text-decoration:none}#twtable .count{font-weight:700}#twtable .remove:hover{color:#8b0000}`;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function createWindow() {
    const pos = JSON.parse(localStorage.getItem(POS_KEY)) || DEFAULT_POS;

    const t = document.createElement('table');
    t.id = 'twtable';
    t.style.left = pos.x + 'px';
    t.style.top  = pos.y + 'px';

    t.innerHTML = `
<tr>
  <th class="label">Thread Watcher</th>
  <th class="refresh">
    <img src="https://soyjak.st/x/src/1767059688067u-1.png" width="18" height="18">
  </th>
</tr>
<tbody id="twbody"></tbody>
`;

    document.body.appendChild(t);
    makeDraggable(t);
    t.querySelector('.refresh img').onclick = refreshAll;
    return t;
  }

  function makeDraggable(el) {
    let drag = false, ox = 0, oy = 0;

    el.querySelectorAll('th').forEach(th => {
      th.addEventListener('mousedown', e => {
        drag = true;
        ox = e.clientX - el.offsetLeft;
        oy = e.clientY - el.offsetTop;
        e.preventDefault();
      });
    });

    document.addEventListener('mousemove', e => {
      if (!drag) return;
      el.style.left = (e.clientX - ox) + 'px';
      el.style.top  = (e.clientY - oy) + 'px';
    });

    document.addEventListener('mouseup', () => {
      if (!drag) return;
      drag = false;
      localStorage.setItem(POS_KEY, JSON.stringify({
        x: el.offsetLeft,
        y: el.offsetTop
      }));
    });
  }

  function addToggleButton() {
    const boardlistSpan = document.querySelector('.boardlist .sub[data-description="0"]');

    if (!boardlistSpan) {
      return;
    }

    const toggleLink = document.createElement('a');
    toggleLink.textContent = 'tw';
    toggleLink.href = 'javascript:void(0)';
    toggleLink.title = 'Toggle Thread Watcher';
    toggleLink.onclick = (e) => {
      e.preventDefault();
      setVisible(!isVisible());
    };

    boardlistSpan.appendChild(document.createTextNode(' [ '));
    boardlistSpan.appendChild(toggleLink);
    boardlistSpan.appendChild(document.createTextNode(' ] '));
  }

  async function watchThread(board, thread) {
    const key = makeKey(board, thread);
    if (state[key]) return;

    let json;
    try {
      json = await fetchJSON(board, thread);
    } catch {}

    const latest = getLatestNo(json) || thread;

    state[key] = {
      board,
      thread,
      lastSeen: latest,
      latest,
      unread: 0,
      label: extractLabel(json) || `/${board}/${thread}`,
      order: Object.keys(state).length
    };

    saveState();
    render();
  }

  async function refreshAll() {
    const refreshImg = table.querySelector('.refresh img');

    refreshImg.src = 'https://soyjak.st/x/src/1767066253133r.gif';

    for (const key in state) {
      const t = state[key];

      if (key === currentKey) {
        const posts = document.querySelectorAll('.post.reply');
        if (posts.length > 0) {
          const lastPost = posts[posts.length - 1];
          const postNo = parseInt(lastPost.id.replace('reply_', ''));
          t.latest = Math.max(t.latest, postNo);
          t.lastSeen = t.latest;
        }
        t.unread = 0;
        continue;
      }

      try {
        const json = await fetchJSON(t.board, t.thread);
        const latest = getLatestNo(json);
        t.latest = latest;

        let unread = 0;
        for (const p of json.posts) {
          if (p.no > t.lastSeen) unread++;
        }

        t.unread = Math.max(0, unread);
      } catch {}
    }
    saveState();
    render();

    refreshImg.src = 'https://soyjak.st/x/src/1767059688067u-1.png';
  }

  function markThreadRead(key) {
    const t = state[key];
    if (!t) return;

    const posts = document.querySelectorAll('.post.reply');
    if (posts.length > 0) {
      const lastPost = posts[posts.length - 1];
      const postNo = parseInt(lastPost.id.replace('reply_', ''));
      t.latest = Math.max(t.latest, postNo);
    }

    t.lastSeen = t.latest;
    t.unread = 0;
    saveState();
  }

  function hookPostClicks(key) {
    document.addEventListener('click', e => {
      if (!e.target.closest('.post')) return;
      markThreadRead(key);
      render();
    }, true);
  }

  function hookTinyboardInterop(key) {
    document.addEventListener('new_post', () => {
      const t = state[key];
      if (!t) return;

      const posts = document.querySelectorAll('.post.reply');
      if (posts.length > 0) {
        const lastPost = posts[posts.length - 1];
        const postNo = parseInt(lastPost.id.replace('reply_', ''));
        if (postNo > t.latest) {
          t.latest = postNo;
        }
      }

      markThreadRead(key);
      render();
    });
  }

  function hookAutoReload(key) {
    const updateThread = document.getElementById('update_thread');
    if (updateThread) {
      const originalPoll = window.poll;
      const observer = new MutationObserver(() => {
        const t = state[key];
        if (!t) return;

        const posts = document.querySelectorAll('.post.reply');
        if (posts.length > 0) {
          const lastPost = posts[posts.length - 1];
          const postNo = parseInt(lastPost.id.replace('reply_', ''));
          if (postNo > t.latest) {
            t.latest = postNo;
            saveState();
            render();
          }
        }
      });

      const form = document.querySelector('form[name="postcontrols"]');
      if (form) {
        observer.observe(form, { childList: true, subtree: true });
      }
    }
  }

  function render() {
    const body = document.getElementById('twbody');
    body.innerHTML = '';

    const entries = Object.values(state);

    if (!entries.length) {
      body.innerHTML = `<tr><td colspan="2"></td></tr>`;
      return;
    }

    entries.forEach((t, i) => {
      if (t.order === undefined) {
        t.order = i;
      }
    });

    entries.sort((a, b) => a.order - b.order);

    for (const t of entries) {
      const tr = document.createElement('tr');

      const td1 = document.createElement('td');
      const a = document.createElement('a');
      a.href = `/` + t.board + `/thread/` + t.thread + `.html#` + t.latest;

      a.onclick = () => {
        t.lastSeen = t.latest;
        t.unread = 0;
        saveState();
      };

      a.innerHTML = t.unread
        ? `<span class="count">(${t.unread})</span> ${escapeHTML(formatLabel(t.board, t.label))}`
        : escapeHTML(formatLabel(t.board, t.label));

      td1.appendChild(a);

      const td2 = document.createElement('td');
      td2.className = 'remove';
      td2.textContent = 'x';
      td2.onclick = () => {
        delete state[makeKey(t.board, t.thread)];
        saveState();
        render();
      };

      tr.append(td1, td2);
      body.appendChild(tr);
    }
  }

  function addWatchButtons() {
    document.querySelectorAll('.thread[id^="thread_"]').forEach(div => {
      if (div.querySelector('.tw-watch-btn')) return;

      const id = Number(div.id.replace('thread_', ''));
      const board = div.dataset.board;
      if (!board || !id) return;

      const btn = document.createElement('a');
      btn.textContent = '[Watch Thread]';
      btn.className = 'tw-watch-btn';
      btn.onclick = () => watchThread(board, id);

      div.querySelector('.intro')?.appendChild(btn);
    });
  }

  async function fetchJSON(board, thread) {
    const res = await fetch(`/${board}/thread/${thread}.json`);
    if (!res.ok) throw 0;
    return res.json();
  }

  function getLatestNo(json) {
    if (!json?.posts) return null;
    return Math.max(...json.posts.map(p => p.no));
  }

  function extractLabel(json) {
    const op = json?.posts?.find(p => !p.resto);
    if (!op?.___body_nomarkup) return null;

    let text = op.___body_nomarkup
      .replace(/^[=>#]+/gm, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (text.length > LABEL_MAX)
      text = text.slice(0, LABEL_MAX - 1) + '…';

    return text || null;
  }

  function formatLabel(board, label) {
    const prefix = `/${board}/ - `;
    const maxContent = LABEL_MAX - prefix.length;

    if (label && label.match(/^\/\w+\/ - /)) {
      return label;
    }

    if (!label || label.match(/^\/\w+\/\d+$/)) {
      return label || `/${board}/`;
    }

    if (label.length > maxContent) {
      return prefix + label.slice(0, maxContent - 1) + '…';
    }

    return prefix + label;
  }

  function escapeHTML(s) {
    return s.replace(/[&<>"']/g, c =>
      ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])
    );
  }

})();