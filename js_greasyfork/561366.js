// ==UserScript==
// @name         Waves Echo Tier Favorites Reorder (hide originals)
// @namespace    https://tampermonkey.net/
// @version      1.2.0
// @description  즐겨찾기 캐릭터를 위쪽에 재배치하고, 기존 리스트에서는 display:none 으로 숨김
// @match        https://www.wavesgacha.com/echo-tier*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561366/Waves%20Echo%20Tier%20Favorites%20Reorder%20%28hide%20originals%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561366/Waves%20Echo%20Tier%20Favorites%20Reorder%20%28hide%20originals%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ★ 원하는 순서대로 입력 ★
  // href 가 /echo-tier/치사 라면 '치사' 라고 적으면 됨.
  const FAVORITES = [
    '플로로',
    '치사',
    '카르티시아'
  ];

  const LOG_PREFIX = '[EchoTierFav]';
  const log = (...args) => console.log(LOG_PREFIX, ...args);

  const GRID_SELECTOR = '.CharCard_echo-calc-page__grid__WJ6Qb';
  const CARD_SELECTOR = 'a.CharCard_card-link__gdMgL';
  const FAV_WRAPPER_CLASS = 'wg-fav-wrapper';
  const HIDE_CLASS = 'wg-fav-hidden';

  function injectStyles() {
    if (document.getElementById('wg-echo-tier-fav-style')) return;

    const style = document.createElement('style');
    style.id = 'wg-echo-tier-fav-style';
    style.textContent = `
      .${FAV_WRAPPER_CLASS} {
        margin-bottom: 16px;
      }
      .${FAV_WRAPPER_CLASS} .wg-fav-title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 8px;
      }
      /* 기존 리스트에서 즐겨찾기 카드는 그냥 숨기기 */
      .${HIDE_CLASS} {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function getCharacterNameFromHref(href) {
    try {
      const url = href.startsWith('http')
        ? new URL(href)
        : new URL(href, window.location.origin);

      const parts = url.pathname.split('/').filter(Boolean);
      const last = parts[parts.length - 1] || '';
      return decodeURIComponent(last);
    } catch (e) {
      log('href 파싱 실패:', href, e);
      return '';
    }
  }

  function buildFavorites(grid) {
    if (!grid) return;
    if (document.querySelector('.' + FAV_WRAPPER_CLASS)) {
      log('즐겨찾기 영역 이미 생성됨');
      return;
    }

    const cards = Array.from(grid.querySelectorAll(CARD_SELECTOR));
    if (!cards.length) {
      log('카드를 찾을 수 없음');
      return;
    }

    // name => card
    const cardMap = new Map();
    cards.forEach(card => {
      const name = getCharacterNameFromHref(card.getAttribute('href') || '');
      if (!name) return;
      if (!cardMap.has(name)) cardMap.set(name, card);
    });

    // 즐겨찾기 카드 수집(순서 보장)
    const favoriteCards = [];
    FAVORITES.forEach(want => {
      for (const [name, card] of cardMap.entries()) {
        if (name === want || name.includes(want)) {
          favoriteCards.push({ name, card });
          break;
        }
      }
    });

    if (!favoriteCards.length) {
      log('즐겨찾기 매칭 없음');
      return;
    }

    // 즐겨찾기 영역 생성
    const wrapper = document.createElement('section');
    wrapper.className = FAV_WRAPPER_CLASS;

    const title = document.createElement('h2');
    title.className = 'wg-fav-title';
    title.textContent = '즐겨찾기';

    const favGrid = document.createElement('div');
    favGrid.className = grid.className;

    favoriteCards.forEach(({ card }) => {
      // 위쪽 즐겨찾기 영역에 복제 추가
      const clone = card.cloneNode(true);
      favGrid.appendChild(clone);

      // ★ 원래 그리드에서는 DOM을 지우지 말고 숨기기만 함 ★
      card.classList.add(HIDE_CLASS);
    });

    wrapper.appendChild(title);
    wrapper.appendChild(favGrid);

    // 원래 grid 위에 추가
    grid.parentElement.insertBefore(wrapper, grid);

    log('즐겨찾기 분리 + 원본 숨김 완료:', favoriteCards.length);
  }

  function trySetup() {
    const grid = document.querySelector(GRID_SELECTOR);
    if (!grid) return false;
    injectStyles();
    buildFavorites(grid);
    return true;
  }

  function observe() {
    const observer = new MutationObserver(() => {
      if (document.querySelector('.' + FAV_WRAPPER_CLASS)) return;
      if (trySetup()) observer.disconnect();
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function init() {
    if (!document.body) {
      window.addEventListener('DOMContentLoaded', init, { once: true });
      return;
    }
    if (!trySetup()) observe();
  }

  init();
})();
