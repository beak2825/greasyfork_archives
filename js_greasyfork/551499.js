// ==UserScript==
// @name         NamuWiki Realtime Text -> "-" (search-disable like Namu Hot Now)
// @namespace    https://ulick.example/namu-mask-ref
// @version      1.3.0
// @description  실시간/인기 검색어를 "-"로 바꾸되, 검색/자동완성 중엔 비활성화
// @match        https://namu.wiki/*
// @run-at       document-idle
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/551499/NamuWiki%20Realtime%20Text%20-%3E%20%22-%22%20%28search-disable%20like%20Namu%20Hot%20Now%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551499/NamuWiki%20Realtime%20Text%20-%3E%20%22-%22%20%28search-disable%20like%20Namu%20Hot%20Now%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const DASH = "-";
  const MASK_ATTR = "data-namu-masked";

  // ----------------------------------------------------------------
  // 레퍼런스 스크립트와 동일 아이디어: "검색 중엔 전체 로직 비활성화"
  // ----------------------------------------------------------------
  const SEARCH_SCOPE_SEL = [
    'form[role="search"]',
    'header form',
    '.search-box',
    '.Search',
    '.search',
  ].join(',');

  const AUTOCOMPLETE_SEL = [
    // 자동완성/서제스트 컨테이너로 자주 쓰일만한 것들
    '.suggest',
    '.suggest-list',
    '.autocomplete',
    '.auto-complete',
    '.autoComplete',
    '[data-suggest]',
    '[data-autocomplete]',
    '[role="listbox"]',
    '[role="combobox"]',
  ].join(',');

  function getSearchInput() {
    return (
      document.querySelector('form[role="search"] input[type="search"]') ||
      document.querySelector('header form input[type="search"]') ||
      document.querySelector('input[type="search"]') ||
      document.querySelector('form[role="search"] input[name="search"], form[role="search"] input[name="query"]')
    );
  }

  function isAutocompleteOpen() {
    // 자동완성 컨테이너가 존재하고 보이는 경우 true
    const box = document.querySelector(AUTOCOMPLETE_SEL);
    if (!box) return false;
    // display/visibility 체크(간단)
    const style = window.getComputedStyle(box);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    // 내부에 항목이 있는지 (listbox면 option/li 등)
    if (box.childElementCount > 0) return true;
    // 여러 개가 있을 수 있으니 넓게 스캔
    return !!document.querySelector(`${AUTOCOMPLETE_SEL} *`);
  }

  function isSearchActive() {
    const inp = getSearchInput();
    const focused = (document.activeElement === inp);
    const hasValue = !!(inp && (inp.value || '').trim().length > 0);
    return (focused && hasValue) || isAutocompleteOpen();
  }

  // 엘리먼트가 검색/자동완성 UI 내부인지
  function isInsideSearchUI(el) {
    if (!el) return false;
    return !!(el.closest(SEARCH_SCOPE_SEL) || el.closest(AUTOCOMPLETE_SEL));
  }

  // ----------------------------------------------------------------
  // 원본 유틸/선택자 로직
  // ----------------------------------------------------------------
  let previousSpansContent = "";

  function getSpansContent() {
    const spans = Array.from(document.querySelectorAll('#app ul>li>a>span')).slice(0, 10);
    return spans.map((s) => s && s.textContent ? s.textContent : "").join("").trim();
  }

  function checkMobileHotkewordOpened() {
    const anchor = document.querySelector('a[title="아무 문서로 이동"]');
    if (!anchor || !anchor.parentElement) return false;
    const aTags = Array.from(anchor.parentElement.querySelectorAll('a'));
    return aTags.length > 10;
  }

  function setDash(el) {
    if (!el) return;
    // 검색 UI 내부는 절대 변경하지 않음
    if (isInsideSearchUI(el)) return;
    const txt = (el.textContent || "").trim();
    if (!txt || txt === DASH) return;
    el.textContent = DASH;
    el.setAttribute(MASK_ATTR, "1");
  }

  // PC 실검
  function maskPCRealtime(root = document) {
    const spans = Array.from(root.querySelectorAll('#app ul>li>a>span')).slice(0, 10);
    spans.forEach(setDash);
  }

  // 모바일 실검
  function maskMobileRealtime(root = document) {
    const anchor = root.querySelector('a[title="아무 문서로 이동"]');
    if (!anchor || !anchor.parentElement) return;
    const aTags = Array.from(anchor.parentElement.querySelectorAll('a'));
    if (aTags.length === 0) return;
    const mobileList = aTags.length > 10 ? aTags.slice(-10) : aTags;
    mobileList.forEach(setDash);
  }

  // 사이드바 인기/실시간
  function maskSidebarTrending(root = document) {
    const itemTitles = root.querySelectorAll("aside .item-title");
    itemTitles.forEach((titleEl) => {
      const title = (titleEl.textContent || "").trim();
      if (title === "인기검색어" || title === "실시간 검색어") {
        const list = titleEl.parentElement ? titleEl.parentElement.querySelector(".link-list") : null;
        if (!list) return;
        list.querySelectorAll("a").forEach((a) => {
          if (isInsideSearchUI(a)) return; // 검색 UI 예외
          const txt = (a.textContent || "").trim();
          if (txt && txt !== DASH) {
            a.textContent = DASH;
            a.title = DASH;
            a.setAttribute(MASK_ATTR, "1");
          }
        });
      }
    });
  }

  function maskAll(root = document) {
    // 검색 또는 자동완성이 활성화되어 있으면 전체 마스킹을 **스킵**
    if (isSearchActive()) return;
    maskPCRealtime(root);
    maskSidebarTrending(root);
    if (checkMobileHotkewordOpened()) {
      maskMobileRealtime(root);
    }
  }

  // ----------------------------------------------------------------
  // 실행 흐름: 레퍼런스처럼 "변화 감지 시"만 동작 + 검색 중엔 비활성화
  // ----------------------------------------------------------------

  // 초기 1회(검색 중이면 자동으로 noop)
  maskAll();

  // 레퍼런스에 있던 poll(저주기) + 내용 변화 감지
  // - PC 실검 텍스트 스냅샷이 바뀔 때만 마스킹 시도
  // - 검색/자동완성 열린 상태에선 전체 스킵
  setInterval(() => {
    if (isSearchActive()) return; // ★ 검색 비활성화 가드 (핵심)
    const now = getSpansContent();
    if (now && now !== previousSpansContent) {
      previousSpansContent = now;
      maskPCRealtime();
    }
    // 사이드/모바일은 SPA 갱신/패널 토글 대응용으로 가볍게 재시도
    maskSidebarTrending();
    if (checkMobileHotkewordOpened()) {
      maskMobileRealtime();
    }
  }, 150);

  // DOM 변화에도 반응 (하지만 검색 중이면 스킵)
  let scheduled = false;
  const schedule = (root = document) => {
    if (scheduled) return;
    scheduled = true;
    const run = () => {
      scheduled = false;
      maskAll(root);
    };
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(run, { timeout: 200 });
    } else {
      requestAnimationFrame(run);
    }
  };

  const observer = new MutationObserver(() => {
    if (isSearchActive()) return; // ★ 검색 비활성화 가드
    schedule(document);
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });

  // 히스토리/URL 변경에도 반응(검색 중엔 스킵)
  window.addEventListener("popstate", () => { if (!isSearchActive()) schedule(document); }, { passive: true });

  let lastHref = location.href;
  setInterval(() => {
    if (location.href !== lastHref) {
      lastHref = location.href;
      if (!isSearchActive()) schedule(document);
    }
  }, 1000);

  // 입력 포커스/값 변경 시 즉시 상태 갱신 → 다음 틱에서 마스킹 스킵/재개
  const inputUpdate = () => {/* no-op: isSearchActive()가 매번 직접 체크 */};
  document.addEventListener('input', inputUpdate, true);
  document.addEventListener('focusin', inputUpdate, true);
  document.addEventListener('focusout', inputUpdate, true);
})();
