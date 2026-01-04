// ==UserScript==
// @name         RT Critics Averages
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Shows actual critic scores instead of just percentages
// @match        https://www.rottentomatoes.com/m/*
// @match        https://www.rottentomatoes.com/tv/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/549975/RT%20Critics%20Averages.user.js
// @updateURL https://update.greasyfork.org/scripts/549975/RT%20Critics%20Averages.meta.js
// ==/UserScript==

(() => {
  let injected = false;

  function getScores() {
    const scripts = [...document.querySelectorAll('script')];

    for (let script of scripts) {
      const text = script.textContent;
      if (!text.includes('criticsAll')) continue;

      const allMatch = text.match(/"criticsAll"[^}]*"averageRating"\s*:\s*"([\d.]+)"/);
      const topMatch = text.match(/"criticsTop"[^}]*"averageRating"\s*:\s*"([\d.]+)"/);

      if (allMatch || topMatch) {
        return {
          all: allMatch?.[1],
          top: topMatch?.[1]
        };
      }
    }
    return null;
  }

  function injectScores() {
    if (injected) return;

    const scores = getScores();
    if (!scores) return;

    const box = document.createElement('div');
    box.style.cssText = `
      background: #1f2123;
      padding: 20px;
      border-radius: 12px;
      margin: 20px 0;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif;
      font-weight: 500;
      color: #fff;
      line-height: 1.5;
    `;

    let html = '<div style="font-weight: 600; margin-bottom: 12px; font-size: 17px; color: #60a5fa;">Critics Average</div>';
    if (scores.all) html += `<div style="margin-bottom: 6px; font-size: 15px;"><span style="color: #aaa;">All Critics:</span> <span style="font-weight: 700; color: #4ade80;">${scores.all}/10</span></div>`;
    if (scores.top) html += `<div style="font-size: 15px;"><span style="color: #aaa;">Top Critics:</span> <span style="font-weight: 700; color: red;">${scores.top}/10</span></div>`;

    box.innerHTML = html;

    const target = document.querySelector('#score-details') ||
                   document.querySelector('.media-scorecard') ||
                   document.querySelector('[data-qa="score-panel"]');

    if (target) {
      target.after(box);
      injected = true;
    }
  }

  // try a few times since RT loads stuff async
  setTimeout(injectScores, 500);
  setTimeout(injectScores, 1500);
  setTimeout(injectScores, 3000);

  // also try when DOM changes
  const observer = new MutationObserver(() => {
    if (!injected) {
      injectScores();
    } else {
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();