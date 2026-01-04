// ==UserScript==
// @name         GitHub Starred Time
// @namespace    https://github.com/
// @version      1.0
// @author       ゆそら
// @match        https://github.com/*?tab=stars*
// @run-at       document-idle
// @grant        none
// @description show you starred time
// @downloadURL https://update.greasyfork.org/scripts/556079/GitHub%20Starred%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/556079/GitHub%20Starred%20Time.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CACHE_KEY_PREFIX = 'gh_starred_cache_';
  const CACHE_TTL = 1000 * 60 * 60 * 24 * 30; // 1个月

  function log(...args) { console.info('[GH-stars-time]', ...args); }

  function extractUsername() {
    const path = location.pathname.replace(/^\/|\/$/g, '');
    const parts = path.split('/');
    if (parts.length >= 1 && parts[0]) return parts[0];
    return null;
  }

  function formatStarredTime(iso) {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let text = '';
    if (diffDays === 0) text = 'Starred today';
    else if (diffDays === 1) text = 'Starred yesterday';
    else if (diffDays < 7) text = `Starred ${diffDays} days ago`;
    else if (diffDays < 14) text = 'Starred last week';
    else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      text = `Starred ${weeks} weeks ago`;
    } else {
      const options = { month: 'short', day: 'numeric' };
      text = 'Starred on ' + date.toLocaleDateString(undefined, options);
    }

    // 拼一手时间字符串
    const utc8 = new Date(date.getTime() + 8 * 60 * 60 * 1000);
    const yyyy = utc8.getFullYear();
    const mm = String(utc8.getMonth() + 1).padStart(2, '0');
    const dd = String(utc8.getDate()).padStart(2, '0');
    const hh = String(utc8.getHours()).padStart(2, '0');
    const min = String(utc8.getMinutes()).padStart(2, '0');
    const ss = String(utc8.getSeconds()).padStart(2, '0');
    const fullTime = `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss} UTC+8`;

    return { text, fullTime };
  }

  function annotatePage(starMap) {
    const anchors = Array.from(document.querySelectorAll('a[href^="/"]'));
    const repoAnchors = anchors.filter(a => {
      const href = a.getAttribute('href').split('#')[0].split('?')[0];
      const fragments = href.replace(/^\/|\/$/g, '').split('/');
      return fragments.length === 2 && fragments[0] && fragments[1];
    });

    repoAnchors.forEach(a => {
      const href = a.getAttribute('href').split('#')[0].split('?')[0];
      const full = href.replace(/^\/|\/$/g, '');
      if (!starMap.has(full)) return;
      const starredAt = starMap.get(full);
      if (!starredAt) return;

      const container = a.closest('div') || a.parentElement;
      if (!container) return;
      if (container.querySelector(`[data-gh-star-time="${full}"]`)) return;

      const span = document.createElement('span');
      span.setAttribute('data-gh-star-time', full);
      span.style.marginLeft = '8px';
      span.style.fontSize = '12px';
      span.style.color = '#6a737d';
      span.style.verticalAlign = 'middle';

      const { text, fullTime } = formatStarredTime(starredAt);
      span.textContent = text;
      span.title = fullTime;

      if (a.nextSibling) a.parentNode.insertBefore(span, a.nextSibling);
      else a.parentNode.appendChild(span);
    });
  }

  async function fetchAllStarred(username) {
    const perPage = 100;
    let page = 1;
    let all = [];
    while (true) {
      const url = `https://api.github.com/users/${encodeURIComponent(username)}/starred?per_page=${perPage}&page=${page}`;
      const resp = await fetch(url, { headers: { 'Accept': 'application/vnd.github.v3.star+json' } });
      if (resp.status !== 200) throw new Error(`API 返回 ${resp.status}`); // 你没资格啊你没资格
      const data = await resp.json();
      if (!Array.isArray(data) || data.length === 0) break;
      all = all.concat(data);
      if (data.length < perPage) break;
      page++;
      if (page > 50) break;
    }
    return all;
  }

  function makeStarMap(apiList) {
    const map = new Map();
    apiList.forEach(item => {
      if (!item || !item.repo) return;
      const full = item.repo.full_name;
      const at = item.starred_at || item.starredAt || null;
      if (at) map.set(full, at);
    });
    return map;
  }

  function saveCache(username, starMap) {
    const data = { ts: Date.now(), list: Array.from(starMap.entries()) };
    localStorage.setItem(CACHE_KEY_PREFIX + username, JSON.stringify(data));
  }

  function loadCache(username) {
    try {
      const dataRaw = localStorage.getItem(CACHE_KEY_PREFIX + username);
      if (!dataRaw) return null;
      const data = JSON.parse(dataRaw);
      if (!data.ts || !data.list) return null;
      if (Date.now() - data.ts > CACHE_TTL) return null;
      return new Map(data.list);
    } catch (e) { return null; }
  }

  function addRefreshButton(onClick) {
    const container = document.querySelector('.my-3.d-flex.flex-justify-between.flex-items-center > .d-flex');
    if (!container) return;
    if (document.querySelector('#gh-star-refresh-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'gh-star-refresh-btn';
    btn.textContent = 'Refresh starred cache';
    btn.className = 'Button--secondary Button--medium Button mr-2';
    btn.style.cursor = 'pointer';
    btn.onclick = onClick;

    const sortDiv = container.querySelector('.mr-2');
    if (sortDiv) container.insertBefore(btn, sortDiv); // Sort 左边
    else container.appendChild(btn);
  }

  async function main() {
    const username = extractUsername();
    if (!username) return;

    let latestMap = loadCache(username);

    async function refreshCache() {
      try {
        const apiList = await fetchAllStarred(username);
        latestMap = makeStarMap(apiList);
        saveCache(username, latestMap);
        annotatePage(latestMap);
      } catch (e) { console.error('[GH-stars-time] 刷新缓存失败：', e); }
    }

    if (latestMap) annotatePage(latestMap);
    else await refreshCache();

    addRefreshButton(() => refreshCache());

    const observer = new MutationObserver(() => {
      if (latestMap) annotatePage(latestMap);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('beforeunload', () => observer.disconnect());
  }

  setTimeout(() => main().catch(err => console.error('[GH-stars-time] 错误：', err)), 800);
})();
