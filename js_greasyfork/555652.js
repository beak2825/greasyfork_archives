// ==UserScript==
// @name         Naver Cafe 글쓰기 — "글감" 플로팅 메뉴 숨기기
// @namespace    hide-se-floating-material-menu
// @description  카페 글쓰기 페이지에서 에디터 하단의 "글감" 플로팅 메뉴(.se-floating-material-menu)를 감춤
// @match        https://cafe.naver.com/ca-fe/cafes/*/menus/*/articles/write
// @match        https://cafe.naver.com/ca-fe/cafes/*/menus/*/articles/write?*
// @run-at       document-start
// @version      2025-11-13
// @license      All rights reserved
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555652/Naver%20Cafe%20%EA%B8%80%EC%93%B0%EA%B8%B0%20%E2%80%94%20%22%EA%B8%80%EA%B0%90%22%20%ED%94%8C%EB%A1%9C%ED%8C%85%20%EB%A9%94%EB%89%B4%20%EC%88%A8%EA%B8%B0%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/555652/Naver%20Cafe%20%EA%B8%80%EC%93%B0%EA%B8%B0%20%E2%80%94%20%22%EA%B8%80%EA%B0%90%22%20%ED%94%8C%EB%A1%9C%ED%8C%85%20%EB%A9%94%EB%89%B4%20%EC%88%A8%EA%B8%B0%EA%B8%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CSS = `
    .se-floating-material-menu { display: none !important; visibility: hidden !important; }
  `;

  function injectStyles(doc) {
    if (!doc) return;
    // 이미 주입되었다면 스킵
    if (doc.getElementById('__hide_se_floating_material_menu__')) return;
    const s = doc.createElement('style');
    s.id = '__hide_se_floating_material_menu__';
    s.textContent = CSS;
    doc.documentElement.appendChild(s);
  }

  function removeMenus(root) {
    root.querySelectorAll?.('.se-floating-material-menu')?.forEach(el => {
      try { el.remove(); } catch {}
    });
  }

  function scrubDocument(doc) {
    injectStyles(doc);
    removeMenus(doc);

    // 이후 동적으로 생겨도 제거
    const mo = new MutationObserver(mutations => {
      for (const m of mutations) {
        for (const n of m.addedNodes) {
          if (n.nodeType !== 1) continue; // ELEMENT_NODE
          // 메뉴가 직접/자식으로 추가되는 경우
          if (n.matches?.('.se-floating-material-menu')) {
            try { n.remove(); } catch {}
          } else {
            n.querySelectorAll?.('.se-floating-material-menu')?.forEach(el => {
              try { el.remove(); } catch {}
            });
          }
          // 새 iframe에도 스타일 주입
          if (n.tagName === 'IFRAME') {
            hookIframe(n);
          }
        }
      }
    });
    mo.observe(doc, { childList: true, subtree: true });

    // 이미 존재하는 iframe 처리
    doc.querySelectorAll('iframe').forEach(hookIframe);
  }

  function hookIframe(iframe) {
    // 동일 출처 iframe만 처리 가능
    const tryInject = () => {
      try {
        if (!iframe.contentDocument) return;
        injectStyles(iframe.contentDocument);
        removeMenus(iframe.contentDocument);
      } catch {
        // cross-origin이면 무시
      }
    };
    tryInject();
    iframe.addEventListener('load', tryInject, { passive: true });
  }

  // 최상위 문서 처리
  scrubDocument(document);

  // DOMContentLoaded/Late load 대비
  window.addEventListener('DOMContentLoaded', () => scrubDocument(document), { once: true });
  window.addEventListener('load', () => scrubDocument(document), { once: true });
})();
