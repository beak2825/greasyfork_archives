// ==UserScript==
// @name         챈문게 복사기
// @namespace    http://tampermonkey.net/
// @version      1.0
// @match        https://arca.live/*
// @grant        none
// @license MIT
// @description 챈문게 URL 복사기

// @downloadURL https://update.greasyfork.org/scripts/560025/%EC%B1%88%EB%AC%B8%EA%B2%8C%20%EB%B3%B5%EC%82%AC%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/560025/%EC%B1%88%EB%AC%B8%EA%B2%8C%20%EB%B3%B5%EC%82%AC%EA%B8%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ---------------------------------
       URL 제한
    --------------------------------- */
  if (!location.href.startsWith('https://arca.live/b/whyiblocked')) return;

  /* ---------------------------------
       설정
    --------------------------------- */
  const rowSelector = '.list-table.table > a.vrow.column';
  const selected = new Set();

  let isDragging = false;
  let startIndex = null;
  let dragMode = 'select'; // select | deselect

  /* ---------------------------------
       스타일 (선택 표시)
    --------------------------------- */
  const style = document.createElement('style');
  style.textContent = `
        a.vrow.column.tm-selected {
            background: rgba(0, 128, 255, 0.2) !important;
            outline: 2px solid #0080ff;
        }
        body.tm-dragging, body.tm-dragging * {
            user-select: none !important;
            -webkit-user-select: none !important;
        }
    `;
  document.head.appendChild(style);

  /* ---------------------------------
       유틸
    --------------------------------- */
  function getRows() {
    return Array.from(document.querySelectorAll(rowSelector));
  }

  function selectRow(el) {
    if (selected.has(el)) return;
    selected.add(el);
    el.classList.add('tm-selected');
  }

  function deselectRow(el) {
    if (!selected.has(el)) return;
    selected.delete(el);
    el.classList.remove('tm-selected');
  }

  /* ---------------------------------
       드래그 시작
    --------------------------------- */
  document.addEventListener(
    'mousedown',
    (e) => {
      if (e.button !== 0) return;

      const row = e.target.closest('a.vrow.column');
      if (!row) return;

      const rows = getRows();
      startIndex = rows.indexOf(row);
      if (startIndex === -1) return;

      isDragging = true;
      document.body.classList.add('tm-dragging');

      // 시작 row 상태로 모드 결정
      dragMode = selected.has(row) ? 'deselect' : 'select';

      // 시작 지점 즉시 반영
      dragMode === 'select' ? selectRow(row) : deselectRow(row);

      e.preventDefault(); // 링크 이동 방지
    },
    true
  );

  /* ---------------------------------
       드래그 중
    --------------------------------- */
  document.addEventListener(
    'mousemove',
    (e) => {
      if (!isDragging || startIndex === null) return;

      const row = e.target.closest('a.vrow.column');
      if (!row) return;

      const rows = getRows();
      const currentIndex = rows.indexOf(row);
      if (currentIndex === -1) return;

      const from = Math.min(startIndex, currentIndex);
      const to = Math.max(startIndex, currentIndex);

      rows.forEach((el, idx) => {
        const inRange = idx >= from && idx <= to;
        if (!inRange) return;

        dragMode === 'select' ? selectRow(el) : deselectRow(el);
      });
    },
    true
  );

  /* ---------------------------------
       드래그 종료
    --------------------------------- */
  document.addEventListener(
    'mouseup',
    () => {
      isDragging = false;
      startIndex = null;
      document.body.classList.remove('tm-dragging');
    },
    true
  );

  /* ---------------------------------
       버튼 삽입
    --------------------------------- */
  function insertButton() {
    const container = document
      .querySelector('.btns-board')
      ?.querySelector('.float-right');
    if (!container) return false;
    if (container.querySelector('.tm-export-btn')) return true;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-sm btn-arca tm-export-btn';
    btn.textContent = '선택 href 추출';

    btn.addEventListener('click', () => {
      const hrefs = [...selected].map((el) => el.href).filter(Boolean);
      console.log('[TM] selected hrefs:', hrefs);
      alert(`선택된 개수: ${hrefs.length}\n콘솔에서 배열 확인`);
    });

    container.appendChild(btn);
    return true;
  }

  /* ---------------------------------
       SPA 대응
    --------------------------------- */
  const observer = new MutationObserver(() => {
    insertButton();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  insertButton();
})();
