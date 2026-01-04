// ==UserScript==
// @name         유동시청자(vph) 표시기 (Soop/Chzzk 통합)
// @description  숲/치지직 VOD의 누적 조회수 ÷ 방송시간 → 시간당 유동시청자수(vph) 계산 표시
// @namespace    https://tampermonkey.net/
// @version      1.0.0
// @license      MIT
// @match        *://www.sooplive.co.kr/*
// @match        *://www.chzzk.naver.com/*
// @match        *://chzzk.naver.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.sooplive.co.kr
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554351/%EC%9C%A0%EB%8F%99%EC%8B%9C%EC%B2%AD%EC%9E%90%28vph%29%20%ED%91%9C%EC%8B%9C%EA%B8%B0%20%28SoopChzzk%20%ED%86%B5%ED%95%A9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554351/%EC%9C%A0%EB%8F%99%EC%8B%9C%EC%B2%AD%EC%9E%90%28vph%29%20%ED%91%9C%EC%8B%9C%EA%B8%B0%20%28SoopChzzk%20%ED%86%B5%ED%95%A9%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /** 공통 유틸 **/
  const num = (t) => {
    const m = (t || '').toString().replace(/[^\d]/g, '');
    return m ? parseInt(m, 10) : 0;
  };
  const fmt = (n) => (typeof n === 'number' ? n.toLocaleString() : n);
  const parseHMS = (txt) => {
    if (!txt) return 0;
    const parts = txt.trim().split(':').map((v) => parseInt(v, 10));
    if (parts.some((v) => Number.isNaN(v))) return 0;
    let h = 0, m = 0, s = 0;
    if (parts.length === 3) [h, m, s] = parts;
    else if (parts.length === 2) [m, s] = parts;
    else if (parts.length === 1) [s] = parts;
    const hours = h + m / 60 + s / 3600;
    return hours;
  };

  /** 사이트 분기 **/
  const isSoop = location.hostname.includes('sooplive.co.kr');
  const isChzzk = location.hostname.includes('chzzk.naver.com');

  /** Soop 구현 **/
  function processSoopOnce(root) {
    const viewerBlocks = (root || document).querySelectorAll('div[class*="ThumbnailMoreInfo-module__viewer"]');
    viewerBlocks.forEach((blk) => {
      const card = blk.closest('div[class*="__soopui__ThumbnailInfo-module__info"]');
      if (!card) return;
      if (card.dataset.vphProcessed === '1') return;

      const countDiv = blk.querySelector('div[class*="__soopui__ThumbnailMoreInfo-module__md"]');
      const totalViews = num(countDiv?.textContent);
      if (!totalViews) return;

      const timeBadge = card
        .closest('div[class*="__soopui__Layout-module__bottom"]')
        ?.querySelector('div[class*="__Badge-module__vodTime"] .__soopui__Badge-module__text___m0zu8')
        || card.parentElement?.querySelector('div[class*="__Badge-module__vodTime"] .__soopui__Badge-module__text___m0zu8')
        || document.querySelector('div[class*="__Badge-module__vodTime"] .__soopui__Badge-module__text___m0zu8');

      const durationTxt = timeBadge?.textContent?.trim() || '';
      const hours = parseHMS(durationTxt);
      if (!hours || !isFinite(hours) || hours <= 0) return;

      const vph = Math.round(totalViews / hours);

      if (countDiv && !countDiv.dataset.vphAdded) {
        countDiv.textContent = `${fmt(totalViews)} (${fmt(vph)} vph)`;
        countDiv.dataset.vphAdded = '1';
        card.dataset.vphProcessed = '1';
      }
    });
  }

  /** Chzzk 구현 **/
  function processChzzkOnce(root) {
    const cards = (root || document).querySelectorAll('.video_card_container__urjO6');
    cards.forEach(card => {
      if (card.dataset.vphProcessed === '1') return;

      // “시청된 라이브” 문구가 포함된 span만 선택
      const desc = Array.from(card.querySelectorAll('.video_card_description__2sUfw span'))
                        .find(el => el.textContent.includes('시청된 라이브'));
      const time = card.querySelector('.video_card_time__NAWm6');
      if (!desc || !time) return;

      const viewsText = desc.textContent || '';
      const timeText = time.textContent || '';

      // 숫자 변환 (1.5천, 19.6만 대응)
      let v = viewsText.trim();
      let totalViews = 0;
      if (v.includes('만')) totalViews = parseFloat(v) * 10000;
      else if (v.includes('천')) totalViews = parseFloat(v) * 1000;
      else return; // 단위 없는 경우 계산 제외

      const hours = parseHMS(timeText);
      if (!hours || !isFinite(hours) || hours <= 0) return;

      const vph = Math.round(totalViews / hours);

      // “시청된 라이브” 문구 제거 + vph 추가
      let replaced = viewsText.replace(/시청된\s*라이브/, '').trim();
      replaced = replaced.replace(/(\s*회)/, `$1 (${fmt(vph)} vph)`);
      desc.textContent = replaced;

      card.dataset.vphProcessed = '1';
    });
  }

  /** 옵저버 **/
  const obs = new MutationObserver((muts) => {
    const added = muts.some((m) => [...m.addedNodes].some((n) => n.nodeType === 1));
    if (!added) return;
    if (isSoop) processSoopOnce(document);
    else if (isChzzk) processChzzkOnce(document);
  });

  obs.observe(document.body, { childList: true, subtree: true });
  if (isSoop) processSoopOnce(document);
  else if (isChzzk) processChzzkOnce(document);

})();
