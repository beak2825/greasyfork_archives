// ==UserScript==
// @name         Skeb 悬停展示接稿信息
// @name:zh-cn   Skeb 悬停展示接稿信息
// @name:en      Skeb Creator Hover Info
// @name:ja      Skeb クリエイター情報ホバー表示
// @namespace    https://greasyfork.org/zh-CN/users/1497660-rde9
// @version      2025-09-01-fix
// @author       rde9
// @description 光标悬停显示 Skeb 创作者接稿信息，包括作品数、各类稿件价格、完成率和接稿状态，支持缓存与自动清理。
// @description:zh-cn 光标悬停显示 Skeb 创作者接稿信息，包括作品数、各类稿件价格、完成率和接稿状态，支持缓存与自动清理。
// @description:en Display Skeb creator info on hover: works count, prices by genre, completion rate, and commission status. Supports caching and auto cleanup.
// @description:ja カーソルをホバーすると Skeb クリエイターの情報が表示され、作品数、各ジャンルの依頼価格、締切厳守率、受付状況を確認できます。キャッシュと自動クリア機能あり。
// @license      MIT License
// @match        https://skeb.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=skeb.jp
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/548014/Skeb%20%E6%82%AC%E5%81%9C%E5%B1%95%E7%A4%BA%E6%8E%A5%E7%A8%BF%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/548014/Skeb%20%E6%82%AC%E5%81%9C%E5%B1%95%E7%A4%BA%E6%8E%A5%E7%A8%BF%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

;(function() {
  'use strict';

  const HOVER_DELAY = 1000; // 悬停延迟：1000ms
  const CACHE_EXPIRE = 12 * 60 * 60 * 1000; // 缓存有效期：12h
  const CACHE_PREFIX = 'creator_';
  let hoverTimer = null;
  let hoveredElement = null;
  let hoverBox = null;

  GM_addStyle(`
    #skeb-creator-hover-box {
        position: fixed;
        z-index: 9999;
        background: #fff;
        border: 1px solid #ccc;
        padding: 8px;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        max-width: 216px;
        font-size: 14px;
        line-height: 1.4;
        display: none;
    }
    #skeb-creator-hover-box .skeb-box-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        word-break: break-all;
    }
    #skeb-creator-hover-box .skeb-box-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    #skeb-creator-hover-box .skeb-row {
        display: flex;
        justify-content: space-between;
    }
    #skeb-creator-hover-box .skeb-value {
        font-weight: bold;
    }
    #skeb-creator-hover-box .skeb-label-acc {
        color: green;
    }
    #skeb-creator-hover-box .skeb-label-not-acc {
        color: red;
    }
    a.skeb-hover-transition {
        transition: box-shadow 0.8s ease-in-out;
    }
    a.skeb-hover-target {
        box-shadow: 0 0 0 2px red !important;
    }
        `);

  // 创建悬浮框节点并清理过期缓存
  async function init() {
    const keys = await GM_listValues();
    const now = Date.now();
    for (const key of keys) {
      if (!key.startsWith(CACHE_PREFIX)) continue;
      const raw = await GM_getValue(key);
      if (!raw) { await GM_deleteValue(key); continue; }
      try {
        const obj = JSON.parse(raw);
        if (now - obj.ts > CACHE_EXPIRE) await GM_deleteValue(key);
      } catch {
        await GM_deleteValue(key);
      }
    }
    hoverBox = document.createElement('div');
    hoverBox.id = 'skeb-creator-hover-box';
    document.body.appendChild(hoverBox);
  }

  init();

  const container = document.querySelector('main') || document.body;
  container.addEventListener('mouseover', (e) => {
    const a = e.target.closest('a[href^="/@"]');
    if (a) onMouseOver(e);
  }, false);

  container.addEventListener('mouseout', (e) => {
    const a = e.target.closest('a[href^="/@"]');
    if (a) onMouseOut(e);
  }, false);

  function onMouseOver(e) {
      const a = e.target.closest('a[href]');
      if (!a) return;

      // 提取 @用户名
      // 示例："/@username/works/4", "/@username"
      const match = a.getAttribute('href').match(/^\/@([^\/]+)/);
      if (!match) return;

      const username = match[1];

      // 添加高亮动画类
      a.classList.add('skeb-hover-transition', 'skeb-hover-target');

      clearTimeout(hoverTimer);
      hoveredElement = a;
      hoverTimer = setTimeout(() => {
          fetchAndShowCreatorInfo(username, e);
      }, HOVER_DELAY);
  }

  function onMouseOut(e) {
      if (!hoveredElement) return;
      const related = e.relatedTarget;
      if (related && (hoveredElement.contains(related))) return;

      // 移除高亮动画类
      hoveredElement.classList.remove('skeb-hover-transition', 'skeb-hover-target');

      clearTimeout(hoverTimer);
      hoveredElement = null;
      setTimeout(hideFloatingBox, 200);
  }

  async function fetchAndShowCreatorInfo(username, event) {
    try {
      let data = await getCreatorCache(username);
      if (!data) {
        const json = await fetchFromAPI(username);
        if (!json.creator) return; // 仅展示 Creator
        data = formatCreatorData(json);
        await setCreatorCache(username, data);
      }
      showFloatingBox(data, event);
    } catch (err) {
      console.error('fetchAndShowCreatorInfo error:', err);
      hoverBox.innerHTML = '<div class="skeb-box-content">fetchAndShowCreatorInfoError: ' + err.message + '</div>';
      hoverBox.style.display = 'block';
    }
  }

  async function fetchFromAPI(username) {
    const url = `https://skeb.jp/api/users/${username}`;
    const headers = {
      'accept': 'application/json',
      'authorization': `Bearer null`,
      'user-agent': navigator.userAgent
    };
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`fetchFromAPI error: ${res.status}`);
    return res.json();
  }

  function formatCreatorData(json) {
    const genreMap = {
      art: 'art/イラスト',
      comic: 'comic/コミック',
      voice: 'voice/ボイス',
      novel: 'novel/テキスト',
      video: 'movie/ムービー',
      music: 'music/ミュージック',
      correction: 'advice/アドバイス',
    };
    const skills = {};
    (json.skills || []).forEach(s => {
      const label = genreMap[s.genre] || s.genre;
      skills[label] = s.default_amount;
    });
    return {
      screen_name: json.screen_name,
      name: json.name,
      avatar_url: json.avatar_url,
      received_works_count: json.received_works_count,
      complete_rate: json.complete_rate,
      acceptable: json.acceptable,
      skills
    };
  }

  async function getCreatorCache(username) {
    const key = `${CACHE_PREFIX}${username}`;
    const raw = await GM_getValue(key);
    if (!raw) return null;
    let obj;
    try { obj = JSON.parse(raw); } catch { return null; }
    if (Date.now() - obj.ts > CACHE_EXPIRE) {
      await GM_deleteValue(key);
      return null;
    }
    return obj.data;
  }

  async function setCreatorCache(username, data) {
    const key = `creator_${username}`;
    const value = { ts: Date.now(), data };
    await GM_setValue(key, JSON.stringify(value));
  }

  function showFloatingBox(data, event) {
    const rate = data.complete_rate != null ? (data.complete_rate * 100).toFixed(0) + '%' : '--';
    let html = `<div class="skeb-box-header"><img src="${data.avatar_url}" style="width:32px;height:32px;border-radius:50%;margin-right:8px;"><strong>${data.name} (@${data.screen_name})</strong></div>`;
    html += `<div class="skeb-box-content">`;
    html += `<div class="skeb-row"><span class="skeb-label">Total/作品数:</span><span class="skeb-value">${data.received_works_count}</span></div>`;
    html += `<div class="skeb-row"><span class="skeb-label">Comp. rate/締切厳守率:</span><span class="skeb-value">${rate}</span></div>`;
    Object.entries(data.skills).forEach(([label, amt]) => {
      html += `<div class="skeb-row"><span class="skeb-label-${data.acceptable ? 'acc' : 'not-acc'}">${label}:</span><span class="skeb-value">¥${amt}</span></div>`;
    });
    html += `</div>`;
    hoverBox.innerHTML = html;
    hoverBox.style.display = 'block';

    // 位置调整
    const x = event.clientX + 10;
    const y = event.clientY + 10;
    const { innerWidth, innerHeight, scrollX, scrollY } = window;
    const bw = hoverBox.offsetWidth;
    const bh = hoverBox.offsetHeight;
    hoverBox.style.left = (x + bw > innerWidth ? innerWidth - bw - 10 : x) + 'px';
    hoverBox.style.top  = (y + bh > innerHeight ? innerHeight - bh - 10 : y) + 'px';
  }

  function hideFloatingBox() {
    if (hoverBox) hoverBox.style.display = 'none';
  }

})();