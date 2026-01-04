// ==UserScript==
// @name         VJudge 比赛显示原题链接
// @namespace    https://vjudge.net/
// @version      0.1
// @description  在 VJudge 比赛题目页添加原题链接
// @match        https://vjudge.net/contest/*
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549459/VJudge%20%E6%AF%94%E8%B5%9B%E6%98%BE%E7%A4%BA%E5%8E%9F%E9%A2%98%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/549459/VJudge%20%E6%AF%94%E8%B5%9B%E6%98%BE%E7%A4%BA%E5%8E%9F%E9%A2%98%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const ANCHOR_CONTAINER_ID = 'vjudge-original-link-container';
  const DEBOUNCE_MS = 120;

  let titleObserver = null;
  let bodyObserver = null;
  let debounceTimer = null;
  let lastDataJsonRaw = null;

  function getProblemLetterFromHash() {
    const m = location.hash.match(/#problem\/([^/?&]+)/);
    return m ? m[1] : null;
  }

  function parseDataJsonSafely() {
    const ta = document.querySelector('textarea[name="dataJson"]');
    if (!ta) return null;
    const raw = ta.value || ta.textContent || ta.innerText || '';
    if (!raw) return null;
    if (raw === lastDataJsonRaw) return JSON.parse(raw);
    try {
      const parsed = JSON.parse(raw);
      lastDataJsonRaw = raw;
      return parsed;
    } catch (e) {
      console.warn('vjudge-original-link: JSON parse failed', e);
      return null;
    }
  }

  function simpleObjHash(obj) {
    try {
      return String(JSON.stringify(obj));
    } catch (e) {
      return String(obj);
    }
  }

  function ensureLinkContainerForProblem(problem, letter) {
    const titleEl = document.getElementById('prob-title-contest');
    if (!titleEl) return;

    const existing = document.getElementById(ANCHOR_CONTAINER_ID);

    const targetHash = problem ? simpleObjHash({ oj: problem.oj, pid: problem.pid, num: problem.num, title: problem.title }) : '';
    const wantLetter = letter || '';

    if (existing) {
      if (existing.dataset.letter === wantLetter && existing.dataset.targetHash === targetHash) {
        return; // nothing to do
      }
      existing.remove();
    }

    if (!problem) return;

    const container = document.createElement('div');
    container.id = ANCHOR_CONTAINER_ID;
    container.style.marginTop = '6px';
    container.style.fontSize = '14px';
    container.style.lineHeight = '1.4';

    container.dataset.letter = wantLetter;
    container.dataset.targetHash = targetHash;

    const oj = (problem.oj || '').toString().toLowerCase();
    const title = problem.title || '';
    let a = document.createElement('a');
    a.style.textDecoration = 'none';
    a.style.fontWeight = '500';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';

    if (oj.includes('luogu') || oj.includes('洛谷') || oj.includes('luogu.com')) {
      const probNum = problem.probNum || problem.probID || problem.pid || null;
      if (probNum) {
        a.href = `https://www.luogu.com.cn/problem/${encodeURIComponent(probNum)}`;
        a.textContent = `原题：洛谷 ${probNum}`;
      } else {
        a.removeAttribute('href');
        a.textContent = '原题：暂不支持';
        a.style.cursor = 'default';
      }
    } else if (oj.includes('qoj')) {
      const q = encodeURIComponent(title || '');
      a.href = `https://qoj.ac/problems?search=${q}`;
      a.textContent = '原题：QOJ（点击搜索）';
    } else if (oj.includes('codeforces')) {
      const q = encodeURIComponent(title || '');
      a.href = `https://www.luogu.com.cn/problem/list?keyword=${q}&type=CF&page=1`;
      a.textContent = '原题：Codeforces（点击搜索）';
    } else if (oj.includes('atcoder')) {
      const probNum = problem.probNum || problem.probID || problem.pid || null;
      const contestId = probNum.slice(0, probNum.lastIndexOf("_"));
      a.href = `https://atcoder.jp/contests/${contestId}/tasks/${probNum}`;
      a.textContent = `原题：AtCoder ${probNum}`;
    } else if (oj.includes('uva')) {
      const q = encodeURIComponent(title || '');
      a.href = `https://www.luogu.com.cn/problem/list?keyword=${q}&type=UVA&page=1`;
      a.textContent = '原题：UVA（点击搜索）';
    } else if (oj.includes('universaloj')) {
      const q = encodeURIComponent(title || '');
      a.href = `https://uoj.ac/problems?search=${q}`;
      a.textContent = '原题：UOJ（点击搜索）';
    } else if (oj.includes('libreoj')) {
      const q = encodeURIComponent(title || '');
      a.href = `https://loj.ac/p?keyword=${q}`;
      a.textContent = '原题：LOJ（点击搜索）';
    } else {
      a.removeAttribute('href');
      a.textContent = `原题：来自 ${oj}，暂不支持查找`;
      a.style.cursor = 'default';
    }

    container.appendChild(a);

    try {
      titleEl.appendChild(container);
    } catch (e) {
      console.warn('vjudge-original-link: insert failed', e);
    }
  }

  // 主要更新逻辑（防抖）
  function handleUpdate() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      try {
        const letter = getProblemLetterFromHash();
        if (!letter) {
          const ex = document.getElementById(ANCHOR_CONTAINER_ID);
          if (ex) ex.remove();
          return;
        }
        const data = parseDataJsonSafely();
        if (!data || !Array.isArray(data.problems)) {
          const ex2 = document.getElementById(ANCHOR_CONTAINER_ID);
          if (ex2) ex2.remove();
          return;
        }
        const target = data.problems.find(p => {
          if (!p) return false;
          if (p.num && String(p.num).toUpperCase() === String(letter).toUpperCase()) return true;
          if (p.num && String(p.num).toUpperCase().includes(String(letter).toUpperCase())) return true;
          return false;
        }) || null;

        ensureLinkContainerForProblem(target, letter);
      } catch (err) {
        console.error('vjudge-original-link: handleUpdate error', err);
      }
    }, DEBOUNCE_MS);
  }

  function startTitleObserver() {
    stopTitleObserver();

    const titleEl = document.getElementById('prob-title-contest');
    if (!titleEl) return;

    titleObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.addedNodes) {
          for (const n of m.addedNodes) {
            if (n && n.id === ANCHOR_CONTAINER_ID) {
              return;
            }
            if (n && n.querySelector && n.querySelector(`#${ANCHOR_CONTAINER_ID}`)) {
              return;
            }
          }
        }
      }
      handleUpdate();
    });

    titleObserver.observe(titleEl, { childList: true, subtree: true, characterData: true });
  }

  function stopTitleObserver() {
    if (titleObserver) {
      try { titleObserver.disconnect(); } catch (e) {}
      titleObserver = null;
    }
  }

  function startBodyObserver() {
    if (bodyObserver) return;
    bodyObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.addedNodes) {
          for (const n of m.addedNodes) {
            if (n && n.querySelector && n.querySelector('#prob-title-contest')) {
              setTimeout(() => {
                startTitleObserver();
                handleUpdate();
              }, 20);
              return;
            }
            if (n && n.id === 'prob-title-contest') {
              setTimeout(() => {
                startTitleObserver();
                handleUpdate();
              }, 20);
              return;
            }
          }
        }
      }
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });
  }

  function stopBodyObserver() {
    if (bodyObserver) {
      try { bodyObserver.disconnect(); } catch (e) {}
      bodyObserver = null;
    }
  }

  function tryInit(retries = 10) {
    const titleEl = document.getElementById('prob-title-contest');
    if (titleEl) {
      startTitleObserver();
      startBodyObserver();
      handleUpdate();
    } else if (retries > 0) {
      setTimeout(() => tryInit(retries - 1), 300);
    } else {
      startBodyObserver();
    }
  }

  window.addEventListener('hashchange', () => {
    setTimeout(handleUpdate, 80);
  });

  // run
  tryInit();

  window.__vjudge_original_link_cleanup = function () {
    stopTitleObserver();
    stopBodyObserver();
    const ex = document.getElementById(ANCHOR_CONTAINER_ID);
    if (ex) ex.remove();
    console.info('vjudge-original-link: cleaned up');
  };

})();
