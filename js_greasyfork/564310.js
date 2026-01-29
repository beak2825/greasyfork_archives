// ==UserScript==
// @name         X/Twitter 手动标记与返回
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @author       chengdu
// @description  在 X/Twitter 时间线上手动标记推文位置，支持跳转返回和按日期跳转
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/564310/XTwitter%20%E6%89%8B%E5%8A%A8%E6%A0%87%E8%AE%B0%E4%B8%8E%E8%BF%94%E5%9B%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/564310/XTwitter%20%E6%89%8B%E5%8A%A8%E6%A0%87%E8%AE%B0%E4%B8%8E%E8%BF%94%E5%9B%9E.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const KEY_PREFIX = 'tw-marker:';
  const MARKERS_KEY = `${KEY_PREFIX}markers`;
  let currentPath = location.pathname;
  let dateTimer = null;
  let restoreTimer = null;

  function isTimelinePath() {
    const p = location.pathname;
    if (p.includes('/status/')) return false;
    if (p.startsWith('/i/') ||
        p.startsWith('/messages') ||
        p.startsWith('/notifications') ||
        p.startsWith('/explore') ||
        p.startsWith('/search') ||
        p.startsWith('/settings') ||
        p.startsWith('/compose') ||
        p.startsWith('/intent')) return false;
    return true;
  }

  function getTimelineUserFromPath() {
    const raw = location.pathname.replace(/^\/+/, '');
    if (!raw) return '首页';
    const first = raw.split('/')[0];
    if (!first || first === 'home') return '首页';
    return '@' + decodeURIComponent(first);
  }

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function formatMarkerTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return '';
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  }

  function loadMarkers() {
    try {
      const raw = localStorage.getItem(MARKERS_KEY);
      if (!raw) return [];
      const list = JSON.parse(raw);
      if (!Array.isArray(list)) return [];
      return list.filter((item) => item && item.id);
    } catch {
      return [];
    }
  }

  function saveMarkers(list) {
    try {
      localStorage.setItem(MARKERS_KEY, JSON.stringify(list));
      return true;
    } catch {
      return false;
    }
  }

  function getTweetId(article) {
    const link = article.querySelector('a[href*="/status/"]');
    if (!link) return null;
    const m = link.getAttribute('href').match(/\/status\/(\d+)/);
    return m ? m[1] : null;
  }

  function isPinnedTweet(article) {
    const text = article.textContent || '';
    if (text.includes('Pinned') || text.includes('已置顶')) return true;
    const svg = article.querySelector('svg[data-testid="icon-pinned"]');
    if (svg) return true;
    return false;
  }

  function findTopVisibleTweet(skipPinned = false) {
    const tweets = document.querySelectorAll('article[data-testid="tweet"]');
    for (const t of tweets) {
      const rect = t.getBoundingClientRect();
      if (rect.bottom > 0) {
        if (skipPinned && isPinnedTweet(t)) continue;
        return t;
      }
    }
    return null;
  }

  function getCurrentVisibleTweetTs(skipPinned = false) {
    const topTweet = findTopVisibleTweet(skipPinned);
    if (!topTweet) return null;
    const t = parseTweetDate(topTweet);
    return t ? t.getTime() : null;
  }

  function getMarkerTweetTime(article) {
    const t = parseTweetDate(article);
    return t ? t.getTime() : null;
  }

  function saveMarker() {
    const topTweet = findTopVisibleTweet();
    if (!topTweet) return false;
    const id = getTweetId(topTweet);
    if (!id) return false;
    const item = {
      id,
      url: location.href,
      user: getTimelineUserFromPath(),
      markedTs: Date.now(),
      tweetTs: getMarkerTweetTime(topTweet),
    };
    const list = loadMarkers();
    const deduped = list.filter((m) => m && m.id && m.id !== id);
    deduped.unshift(item);
    const next = deduped.slice(0, 20);
    return saveMarkers(next);
  }

  function loadMarker() {
    const list = loadMarkers();
    return list.length ? list[0] : null;
  }

  function findTweetEl(id) {
    return document.querySelector(`a[href*="/status/${id}"]`)?.closest('article');
  }

  function parseTweetDate(article) {
    const timeEl = article.querySelector('time');
    if (!timeEl) return null;
    const iso = timeEl.getAttribute('datetime');
    if (!iso) return null;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d;
  }

  function parseInputDate(str) {
    const s = (str || '').trim();
    if (!s) return null;
    const m = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if (!m) return null;
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
    const startOfDay = new Date(y, mo - 1, d, 0, 0, 0, 0);
    if (startOfDay.getFullYear() !== y || startOfDay.getMonth() !== mo - 1 || startOfDay.getDate() !== d) {
      return null;
    }
    const endOfDay = new Date(y, mo - 1, d, 23, 59, 59, 999);
    return { startOfDay, endOfDay };
  }

  function findDateTarget(startOfDay, endOfDay) {
    const articles = document.querySelectorAll('article[data-testid="tweet"]');
    for (const a of articles) {
      const t = parseTweetDate(a);
      if (!t) continue;
      if (t >= startOfDay && t <= endOfDay) {
        return a;
      }
    }
    return null;
  }

  function stopAllScrolling() {
    if (dateTimer) {
      clearInterval(dateTimer);
      dateTimer = null;
    }
    if (restoreTimer) {
      clearInterval(restoreTimer);
      restoreTimer = null;
    }
  }

  function jumpToDate(dateStr, onDone) {
    stopAllScrolling();

    const target = parseInputDate(dateStr);
    if (!target) {
      if (onDone) onDone(false, '日期无效');
      return false;
    }

    const { startOfDay, endOfDay } = target;

    const currentTs = getCurrentVisibleTweetTs(true);
    let dir = 1;
    let dirDetermined = false;
    if (typeof currentTs === 'number') {
      dirDetermined = true;
      if (currentTs < startOfDay.getTime()) {
        dir = -1;
      } else if (currentTs > endOfDay.getTime()) {
        dir = 1;
      } else {
        const el = findDateTarget(startOfDay, endOfDay);
        if (el) {
          el.scrollIntoView({ block: 'start' });
          if (onDone) onDone(true, '已找到');
          return true;
        }
        dir = 1;
      }
    }

    if (dirDetermined && dir === -1 && window.scrollY < 100) {
      if (onDone) onDone(false, '已到顶部');
      return false;
    }

    let lastScrollY = window.scrollY;
    let stuckCount = 0;
    const SCROLL_STEP = 1000;
    const SCROLL_INTERVAL = 300;
    const MAX_STUCK = 3;

    dateTimer = setInterval(() => {
      const el = findDateTarget(startOfDay, endOfDay);
      if (el) {
        el.scrollIntoView({ block: 'start' });
        clearInterval(dateTimer);
        dateTimer = null;
        if (onDone) onDone(true, '已找到');
        return;
      }

      if (!dirDetermined) {
        const ts = getCurrentVisibleTweetTs(true);
        if (typeof ts === 'number') {
          dirDetermined = true;
          if (ts < startOfDay.getTime()) {
            dir = -1;
          } else if (ts > endOfDay.getTime()) {
            dir = 1;
          }
        }
      }

      window.scrollBy(0, SCROLL_STEP * dir);
      if (Math.abs(window.scrollY - lastScrollY) < 10) {
        stuckCount++;
        if (stuckCount >= MAX_STUCK) {
          clearInterval(dateTimer);
          dateTimer = null;
          if (onDone) onDone(false, '已到边界');
          return;
        }
      } else {
        stuckCount = 0;
      }
      lastScrollY = window.scrollY;
    }, SCROLL_INTERVAL);

    return true;
  }

  function restoreMarkerById(marker, onDone) {
    if (!marker?.id) {
      if (onDone) onDone(false, '无标记');
      return false;
    }

    stopAllScrolling();

    const currentTs = getCurrentVisibleTweetTs(true);
    let dir = 1;
    let dirDetermined = false;
    if (typeof currentTs === 'number' && typeof marker.tweetTs === 'number') {
      dirDetermined = true;
      dir = marker.tweetTs > currentTs ? -1 : 1;
    }

    if (dirDetermined && dir === -1 && window.scrollY < 100) {
      if (onDone) onDone(false, '已到顶部');
      return false;
    }

    let lastScrollY = window.scrollY;
    let stuckCount = 0;
    const SCROLL_STEP = 800;
    const SCROLL_INTERVAL = 250;
    const MAX_STUCK = 3;

    restoreTimer = setInterval(() => {
      const el = findTweetEl(marker.id);
      if (el) {
        el.scrollIntoView({ block: 'start' });
        clearInterval(restoreTimer);
        restoreTimer = null;
        if (onDone) onDone(true, '已找到');
        return;
      }

      if (!dirDetermined && typeof marker.tweetTs === 'number') {
        const ts = getCurrentVisibleTweetTs(true);
        if (typeof ts === 'number') {
          dirDetermined = true;
          dir = marker.tweetTs > ts ? -1 : 1;
        }
      }

      window.scrollBy(0, SCROLL_STEP * dir);
      if (Math.abs(window.scrollY - lastScrollY) < 10) {
        stuckCount++;
        if (stuckCount >= MAX_STUCK) {
          clearInterval(restoreTimer);
          restoreTimer = null;
          if (onDone) onDone(false, '已到边界');
          return;
        }
      } else {
        stuckCount = 0;
      }
      lastScrollY = window.scrollY;
    }, SCROLL_INTERVAL);

    return true;
  }

  function restoreMarker() {
    const marker = loadMarker();
    return restoreMarkerById(marker);
  }

  function updateMarkerPanel() {
    if (!markerPanel) return;
    const list = loadMarkers();
    markerList.innerHTML = '';
    if (!list.length) {
      markerEmpty.textContent = '无标记';
      markerEmpty.style.display = 'block';
      return;
    }

    markerEmpty.style.display = 'none';
    for (const marker of list) {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:6px;padding:4px 0;border-top:1px solid rgba(0,0,0,.06);';

      const info = document.createElement('div');
      info.style.cssText = 'flex:1;min-width:0;color:#222;';
      const user = marker.user || '未知';
      const timeText = formatMarkerTime(marker.tweetTs) || '未知';
      info.textContent = `${user} · ${timeText}`;

      const btnWrap = document.createElement('div');
      btnWrap.style.cssText = 'display:flex;gap:6px;flex-shrink:0;';

      const btnJump = createButton('跳转', () => {
        btnJump.textContent = '跳转中';
        restoreMarkerById(marker, (ok, msg) => {
          btnJump.textContent = msg;
          setTimeout(() => { btnJump.textContent = '跳转'; }, 1500);
        });
      });
      btnJump.style.position = 'static';
      btnJump.style.padding = '3px 6px';
      btnJump.style.fontSize = '11px';
      btnJump.style.minWidth = '46px';

      const btnRemove = createButton('移除', () => {
        const ok = removeMarkerById(marker.id);
        btnRemove.textContent = ok ? '已移除' : '失败';
        setTimeout(() => { btnRemove.textContent = '移除'; }, 1200);
        if (ok) updateMarkerPanel();
      });
      btnRemove.style.position = 'static';
      btnRemove.style.padding = '3px 6px';
      btnRemove.style.fontSize = '11px';
      btnRemove.style.minWidth = '46px';
      btnRemove.style.background = '#aaa';

      btnWrap.appendChild(btnJump);
      btnWrap.appendChild(btnRemove);

      row.appendChild(info);
      row.appendChild(btnWrap);
      markerList.appendChild(row);
    }
  }

  function createButton(text, onClick) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.style.cssText = `
      position: fixed;
      right: 16px;
      z-index: 99999;
      padding: 6px 10px;
      border: none;
      border-radius: 999px;
      background: #1d9bf0;
      color: #fff;
      font-size: 11px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,.18);
      min-width: 56px;
    `;
    btn.addEventListener('click', onClick);
    return btn;
  }

  let btnSave;
  let btnPanelToggle;
  let btnDate;
  let btnStop;
  let datePanel;
  let markerPanel;
  let markerEmpty;
  let markerList;

  function removeMarkerById(id) {
    if (!id) return false;
    const list = loadMarkers();
    const next = list.filter((m) => m && m.id && m.id !== id);
    if (next.length === list.length) return false;
    return saveMarkers(next);
  }

  function mountButtons() {
    if (btnSave && btnPanelToggle && datePanel && markerPanel) return;

    btnSave = createButton('标记', () => {
      const ok = saveMarker();
      btnSave.textContent = ok ? '已标记' : '标记失败';
      setTimeout(() => { btnSave.textContent = '标记'; }, 1200);
      if (ok) updateMarkerPanel();
    });
    btnSave.style.bottom = '88px';

    btnPanelToggle = createButton('标记列表', () => {
      const isHidden = markerPanel.style.display === 'none';
      markerPanel.style.display = isHidden ? 'block' : 'none';
    });
    btnPanelToggle.style.bottom = '32px';
    btnPanelToggle.style.minWidth = '64px';

    btnDate = createButton('跳转日期', () => {
      const isHidden = datePanel.style.display === 'none';
      datePanel.style.display = isHidden ? 'block' : 'none';
    });
    btnDate.style.bottom = '140px';

    btnStop = createButton('停止跳转', () => {
      stopAllScrolling();
      btnStop.textContent = '已停止';
      setTimeout(() => { btnStop.textContent = '停止跳转'; }, 1200);
    });
    btnStop.style.bottom = '192px';
    btnStop.style.background = '#f4212e';

    datePanel = document.createElement('div');
    datePanel.style.cssText = `
      position: fixed;
      right: 16px;
      bottom: 228px;
      z-index: 99999;
      padding: 10px 12px;
      border-radius: 10px;
      background: #fff;
      box-shadow: 0 8px 20px rgba(0,0,0,.18);
      display: none;
    `;

    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.style.cssText = `
      padding: 6px 8px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 12px;
      margin-right: 6px;
    `;

    const btnJump = createButton('跳转', () => {
      btnJump.textContent = '跳转中';
      const started = jumpToDate(dateInput.value, (ok, msg) => {
        btnJump.textContent = msg;
        setTimeout(() => { btnJump.textContent = '跳转'; }, 1500);
      });
      if (started) {
        datePanel.style.display = 'none';
      }
    });
    btnJump.style.position = 'static';
    btnJump.style.marginRight = '6px';

    const btnClose = createButton('关闭', () => {
      datePanel.style.display = 'none';
    });
    btnClose.style.position = 'static';

    datePanel.appendChild(dateInput);
    datePanel.appendChild(btnJump);
    datePanel.appendChild(btnClose);

    markerPanel = document.createElement('div');
    markerPanel.style.cssText = `
      position: fixed;
      right: 16px;
      top: 16px;
      z-index: 99999;
      padding: 10px 12px;
      border-radius: 12px;
      background: #fff;
      color: #111;
      font-size: 12px;
      line-height: 1.4;
      box-shadow: 0 10px 24px rgba(0,0,0,.18);
      min-width: 220px;
      max-width: 280px;
      display: none;
    `;

    const markerTitle = document.createElement('div');
    markerTitle.textContent = '标记列表';
    markerTitle.style.cssText = 'font-weight: 600;margin-bottom: 6px;font-size:12px;';

    markerEmpty = document.createElement('div');
    markerEmpty.style.cssText = 'color:#666;';

    markerList = document.createElement('div');
    markerList.style.cssText = 'max-height: 180px;overflow-y:auto;';

    markerPanel.appendChild(markerTitle);
    markerPanel.appendChild(markerEmpty);
    markerPanel.appendChild(markerList);

    document.body.appendChild(btnSave);
    document.body.appendChild(btnPanelToggle);
    document.body.appendChild(btnDate);
    document.body.appendChild(btnStop);
    document.body.appendChild(datePanel);
    document.body.appendChild(markerPanel);

    updateMarkerPanel();
  }

  function setButtonsVisible(visible) {
    const display = visible ? 'block' : 'none';
    if (btnSave) btnSave.style.display = display;
    if (btnPanelToggle) btnPanelToggle.style.display = display;
    if (btnDate) btnDate.style.display = display;
    if (btnStop) btnStop.style.display = display;
    if (!visible) {
      if (datePanel) datePanel.style.display = 'none';
      if (markerPanel) markerPanel.style.display = 'none';
    }
  }

  function setup() {
    if (!isTimelinePath()) {
      setButtonsVisible(false);
      return;
    }
    mountButtons();
    setButtonsVisible(true);
  }

  function hookHistory() {
    const push = history.pushState;
    const replace = history.replaceState;
    history.pushState = function () {
      push.apply(this, arguments);
      window.dispatchEvent(new Event('locationchange'));
    };
    history.replaceState = function () {
      replace.apply(this, arguments);
      window.dispatchEvent(new Event('locationchange'));
    };
    window.addEventListener('popstate', () => {
      window.dispatchEvent(new Event('locationchange'));
    });
  }

  hookHistory();
  window.addEventListener('locationchange', () => {
    if (location.pathname !== currentPath) {
      currentPath = location.pathname;
      setup();
    }
  });

  setup();
})();
