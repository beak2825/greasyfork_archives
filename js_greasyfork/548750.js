// ==UserScript==
// @name         Niconico Allegation Script
// @namespace    https://greasyfork.org/users/prozent55
// @version      1.0.0
// @description  NGボタン右に「通報」「タグ通報」を追加
// @match        https://www.nicovideo.jp/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548750/Niconico%20Allegation%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/548750/Niconico%20Allegation%20Script.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    .nrn-title-ng-button + .tm-rpt-group{
      display:inline-flex; align-items:center; gap:0;
      margin-left:0; padding-left:0; vertical-align:middle; color:#fff;
      --tm-rpt-h: 1em;
    }
    .tm-rpt-button{
      position:relative; display:flex; align-items:center; line-height:1;
      color:inherit; cursor:pointer; user-select:none;
      margin-left:5px; padding-left:5px;
    }
    .tm-rpt-button::before{
      content:""; position:absolute; left:0; top:50%;
      transform:translateY(-50%); height:var(--tm-rpt-h);
      border-left:1px solid currentColor;
    }
    .tm-rpt-button:hover{ text-decoration:underline; }
  `;
  document.head.appendChild(style);

  const qs  = (s, r=document) => r.querySelector(s);

  const getMovieId = (pane, anchorBtn) => {
    const d = anchorBtn?.dataset;
    if (d?.movieId) return d.movieId;
    const any = pane.querySelector('[data-movie-id]');
    if (any?.dataset?.movieId) return any.dataset.movieId;
    const a = pane.closest('*')?.querySelector('a[href*="/watch/"]');
    const m = a?.getAttribute('href')?.match(/sm\d+/);
    return m ? m[0] : null;
  };

  const btn = (label, onClick) => {
    const x = document.createElement('span');
    x.className = 'tm-rpt-button';
    x.textContent = label;
    x.addEventListener('click', e => { e.stopPropagation(); e.preventDefault(); onClick(); });
    return x;
  };

  const syncHeight = (group, titleBtn) => {
    const h = titleBtn?.offsetHeight || group.offsetHeight || 0;
    if (h) group.style.setProperty('--tm-rpt-h', `${h}px`);
  };

  const add = (pane) => {
    if (!pane || pane.dataset.tmRptAdded) return;
    const titleBtn = qs('.nrn-title-ng-button', pane);
    if (!titleBtn) return;

    const group = document.createElement('span');
    group.className = 'tm-rpt-group';

    const report = btn('通報', () => {
      const id = getMovieId(pane, titleBtn);
      if (id) {
        const num = id.replace(/\D/g, '');
        window.open(`https://garage.nicovideo.jp/allegation/${num}`, '_blank', 'noopener');
      }
    });

    const tagReport = btn('タグ通報', () => {
      const id = getMovieId(pane, titleBtn);
      if (id) {
        window.open(`https://www.nicovideo.jp/comment_allegation/${id}`, '_blank', 'noopener');
      }
    });

    group.appendChild(report);
    group.appendChild(tagReport);
    titleBtn.insertAdjacentElement('afterend', group);
    syncHeight(group, titleBtn);
    pane.dataset.tmRptAdded = '1';
  };

  document.querySelectorAll('.nrn-action-pane').forEach(add);

  new MutationObserver(ms => {
    for (const m of ms) {
      for (const n of m.addedNodes) {
        if (n.nodeType !== 1) continue;
        if (n.classList?.contains('nrn-action-pane')) add(n);
        else n.querySelectorAll?.('.nrn-action-pane').forEach(add);
      }
    }
  }).observe(document.body, { childList: true, subtree: true });
})();
