// ==UserScript==
// @name         避免下单已拥有的游戏,导致订单发不了,必须得退款,但是手续费不退,导致群主亏钱的脚本
// @namespace    steamredsync
// @version      0.1.1
// @description  同步Steam拥有列表并在站内搜索结果/版本列表中高亮已拥有内容
// @match        https://steam.red/*
// @grant        GM_xmlhttpRequest
// @connect      store.steampowered.com
// @downloadURL https://update.greasyfork.org/scripts/563214/%E9%81%BF%E5%85%8D%E4%B8%8B%E5%8D%95%E5%B7%B2%E6%8B%A5%E6%9C%89%E7%9A%84%E6%B8%B8%E6%88%8F%2C%E5%AF%BC%E8%87%B4%E8%AE%A2%E5%8D%95%E5%8F%91%E4%B8%8D%E4%BA%86%2C%E5%BF%85%E9%A1%BB%E5%BE%97%E9%80%80%E6%AC%BE%2C%E4%BD%86%E6%98%AF%E6%89%8B%E7%BB%AD%E8%B4%B9%E4%B8%8D%E9%80%80%2C%E5%AF%BC%E8%87%B4%E7%BE%A4%E4%B8%BB%E4%BA%8F%E9%92%B1%E7%9A%84%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/563214/%E9%81%BF%E5%85%8D%E4%B8%8B%E5%8D%95%E5%B7%B2%E6%8B%A5%E6%9C%89%E7%9A%84%E6%B8%B8%E6%88%8F%2C%E5%AF%BC%E8%87%B4%E8%AE%A2%E5%8D%95%E5%8F%91%E4%B8%8D%E4%BA%86%2C%E5%BF%85%E9%A1%BB%E5%BE%97%E9%80%80%E6%AC%BE%2C%E4%BD%86%E6%98%AF%E6%89%8B%E7%BB%AD%E8%B4%B9%E4%B8%8D%E9%80%80%2C%E5%AF%BC%E8%87%B4%E7%BE%A4%E4%B8%BB%E4%BA%8F%E9%92%B1%E7%9A%84%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var syncBtnEl = document.querySelector('#steam-sync');
  var installEl = document.querySelector('#steam-install');
  if (!syncBtnEl && !installEl) return;

  (function () {
    var s = document.createElement('script');
    s.textContent = 'window.__STEAM_REDSYNC__={version:' + JSON.stringify('0.1.0') + '};window.dispatchEvent(new CustomEvent("steamredsync:installed"));';
    (document.head || document.documentElement).appendChild(s);
    s.parentNode.removeChild(s);
  })();

  if (syncBtnEl) syncBtnEl.style.display = 'inline-block';
  if (installEl) installEl.style.display = 'none';

  var STORAGE_KEYS = {
    ownedApps: 'steam_owned_apps',
    ownedPackages: 'steam_owned_packages',
    wishlist: 'steam_wishlist',
    syncedAt: 'steam_sync_ts'
  };

  var SELECTORS = {
    syncBtn: '#steam-sync',
    status: '#steam-sync-status',
    gameList: '#searchgamelist',
    selectedGame: '#searchgame',
    versionList: '#searchgameversion'
  };

  function safeJsonParseArray(text) {
    try {
      var data = JSON.parse(text);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function readArray(key) {
    var raw = window.localStorage.getItem(key);
    if (!raw) return [];
    return safeJsonParseArray(raw);
  }

  function writeArray(key, arr) {
    window.localStorage.setItem(key, JSON.stringify(arr));
  }

  function setStatus(text, isError) {
    var el = document.querySelector(SELECTORS.status);
    if (!el) return;
    el.textContent = text;
    el.style.color = isError ? '#ff6b6b' : '#8f98a0';
  }

  function toNumberSet(list) {
    var set = new Set();
    for (var i = 0; i < list.length; i++) {
      var n = Number(list[i]);
      if (Number.isFinite(n)) set.add(n);
    }
    return set;
  }

  function getOwnedSets() {
    var ownedApps = readArray(STORAGE_KEYS.ownedApps);
    var ownedPackages = readArray(STORAGE_KEYS.ownedPackages);
    var wishlist = readArray(STORAGE_KEYS.wishlist);
    return {
      ownedAppSet: toNumberSet(ownedApps),
      ownedPackageSet: toNumberSet(ownedPackages),
      wishlistSet: toNumberSet(wishlist)
    };
  }

  function ensureStyle() {
    if (document.getElementById('tm-steam-owned-style')) return;
    var style = document.createElement('style');
    style.id = 'tm-steam-owned-style';
    style.textContent = [
      '.tm-steam-owned { background: #1f7a1f !important; }',
      '.tm-steam-owned-package { background: #1f7a1f !important; }',
      '.tm-steam-owned-selected { background: #1f7a1f !important; }'
    ].join('\n');
    document.head.appendChild(style);
  }

  function applyHighlights() {
    ensureStyle();
    var sets = getOwnedSets();

    var gameList = document.querySelector(SELECTORS.gameList);
    if (gameList) {
      var links = gameList.querySelectorAll('a.match[data-ds-appid]');
      for (var i = 0; i < links.length; i++) {
        var a = links[i];
        var appid = Number(a.getAttribute('data-ds-appid'));
        if (Number.isFinite(appid) && sets.ownedAppSet.has(appid)) {
          a.classList.add('tm-steam-owned');
        } else {
          a.classList.remove('tm-steam-owned');
        }
      }
    }

    var selectedGame = document.querySelector(SELECTORS.selectedGame);
    if (selectedGame) {
      var selectedLink = selectedGame.querySelector('a.match[data-ds-appid]');
      var selectedAppId = selectedLink ? Number(selectedLink.getAttribute('data-ds-appid')) : NaN;
      if (Number.isFinite(selectedAppId) && sets.ownedAppSet.has(selectedAppId)) {
        selectedGame.classList.add('tm-steam-owned-selected');
      } else {
        selectedGame.classList.remove('tm-steam-owned-selected');
      }
    }

    var versionList = document.querySelector(SELECTORS.versionList);
    if (versionList) {
      var items = versionList.querySelectorAll('.version-item[data-packageid]');
      for (var j = 0; j < items.length; j++) {
        var item = items[j];
        var packageId = Number(item.getAttribute('data-packageid'));
        if (Number.isFinite(packageId) && sets.ownedPackageSet.has(packageId)) {
          item.classList.add('tm-steam-owned-package');
        } else {
          item.classList.remove('tm-steam-owned-package');
        }
      }
    }
  }

  function debounce(fn, waitMs) {
    var t = 0;
    return function () {
      if (t) window.clearTimeout(t);
      t = window.setTimeout(fn, waitMs);
    };
  }

  var applyHighlightsDebounced = debounce(applyHighlights, 150);

  function observeContainer(selector) {
    var el = document.querySelector(selector);
    if (!el || typeof MutationObserver === 'undefined') return;
    var observer = new MutationObserver(function () {
      applyHighlightsDebounced();
    });
    observer.observe(el, { childList: true, subtree: true });
  }

  function syncSteamOwned() {
    var btn = document.querySelector(SELECTORS.syncBtn);
    if (btn) btn.disabled = true;
    setStatus('正在同步Steam拥有列表…', false);

    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://store.steampowered.com/dynamicstore/userdata/?_=' + Date.now(),
      timeout: 20000,
      onload: function (resp) {
        try {
          var data = JSON.parse(resp.responseText);
          if (!data || typeof data !== 'object') throw new Error('invalid json');

          var ownedApps = Array.isArray(data.rgOwnedApps) ? data.rgOwnedApps : [];
          var ownedPackages = Array.isArray(data.rgOwnedPackages) ? data.rgOwnedPackages : [];
          var wishlist = Array.isArray(data.rgWishlist) ? data.rgWishlist : [];

          writeArray(STORAGE_KEYS.ownedApps, ownedApps);
          writeArray(STORAGE_KEYS.ownedPackages, ownedPackages);
          writeArray(STORAGE_KEYS.wishlist, wishlist);
          window.localStorage.setItem(STORAGE_KEYS.syncedAt, String(Date.now()));

          applyHighlights();
          setStatus('同步成功：App ' + ownedApps.length + '，Sub ' + ownedPackages.length + '，愿望单 ' + wishlist.length, false);
        } catch (e) {
          setStatus('同步失败：请先登录 Steam 商店后再点同步', true);
        } finally {
          if (btn) btn.disabled = false;
        }
      },
      onerror: function () {
        if (btn) btn.disabled = false;
        setStatus('同步失败：网络错误', true);
      },
      ontimeout: function () {
        if (btn) btn.disabled = false;
        setStatus('同步失败：请求超时', true);
      }
    });
  }

  function bindSyncButton() {
    var btn = document.querySelector(SELECTORS.syncBtn);
    if (!btn) return false;
    btn.addEventListener('click', function () {
      syncSteamOwned();
    });
    return true;
  }

  function init() {
    var bound = bindSyncButton();
    if (!bound) return;

    observeContainer(SELECTORS.gameList);
    observeContainer(SELECTORS.selectedGame);
    observeContainer(SELECTORS.versionList);
    applyHighlights();

    var tsRaw = window.localStorage.getItem(STORAGE_KEYS.syncedAt);
    var ts = tsRaw ? Number(tsRaw) : 0;
    if (Number.isFinite(ts) && ts > 0) {
      var dt = new Date(ts);
      setStatus('上次同步：' + dt.toLocaleString(), false);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
