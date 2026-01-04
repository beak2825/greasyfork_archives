// ==UserScript==
// @name         SOOP 닉네임(아이디) 복사 버튼
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.sooplive.co.kr
// @author       oioi
// @namespace    sooplive-nick-id-copier
// @version      2.0
// @description  SOOP 라이브 채팅창 닉네임 클릭 시 기능 메뉴에 '닉네임(아이디) 복사' 기능 추가
// @match        https://play.sooplive.co.kr/*
// @run-at       document-idle
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/551841/SOOP%20%EB%8B%89%EB%84%A4%EC%9E%84%28%EC%95%84%EC%9D%B4%EB%94%94%29%20%EB%B3%B5%EC%82%AC%20%EB%B2%84%ED%8A%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/551841/SOOP%20%EB%8B%89%EB%84%A4%EC%9E%84%28%EC%95%84%EC%9D%B4%EB%94%94%29%20%EB%B3%B5%EC%82%AC%20%EB%B2%84%ED%8A%BC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* =============== 스타일 =============== */
  // 토스트만 최소 스타일. 버튼은 사이트 CSS(.chatIct-card .menu-list > li button)를 그대로 상속.
  GM_addStyle(`
    .__nickid_toast__{
      position: fixed; left: 50%; top: 12%;
      transform: translateX(-50%);
      background: rgba(30,30,30,.9); color: #fff;
      padding: 10px 14px; border-radius: 8px;
      font-size: 12px; z-index: 999999; pointer-events: none;
      opacity: 0; transition: opacity .15s ease;
    }
    .__nickid_toast__.on{ opacity: 1; }

    /* 아이콘만 살짝 정렬(사이트 버튼 높이/패딩은 상속) */
    .__nickid_btn_icon__{ display:inline-block; width:16px; height:16px; margin-right:8px; }
  `);

  /* =============== 상수/유틸 =============== */
  const MENU_TEXT_HINTS = ["선물하기","쪽지 보내기","귓속말 보내기","채팅 안보기","채팅 신고하기"];
  // 영/숫자 시작 허용 + . _ - 포함, 끝의 (숫자) 허용 (멀티창 suffix)
  const idRegexAllowSuffix = /^[a-zA-Z0-9][a-zA-Z0-9._-]{1,63}(?:\(\d+\))?$/;

  const toast = (msg) => {
    const el = document.createElement('div');
    el.className = '__nickid_toast__';
    el.textContent = msg;
    document.body.appendChild(el);
    void el.offsetHeight; el.classList.add('on');
    setTimeout(() => { el.classList.remove('on'); setTimeout(() => el.remove(), 180); }, 900);
  };

  const copyText = async (text) => {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position='fixed'; ta.style.left='-9999px';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    }
    toast('복사됨: ' + text);
  };

  const countHints = (t) => MENU_TEXT_HINTS.reduce((c,h)=>c+(t.includes(h)?1:0),0);
  const isBefore = (a,b) => !!(a && b && (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING));

  function getDirectChildOf(container, el) {
    let cur = el;
    while (cur && cur.parentElement !== container) cur = cur.parentElement;
    return cur && cur.parentElement === container ? cur : null;
  }

  /* =============== 닉네임/아이디 추출 =============== */
  function extractNameAndId(popupRoot) {
    const full = popupRoot.innerText || '';

    // 메뉴 시작 전까지만 사용
    let firstMenuIndex = Infinity;
    for (const hint of MENU_TEXT_HINTS) {
      const idx = full.indexOf(hint);
      if (idx !== -1 && idx < firstMenuIndex) firstMenuIndex = idx;
    }
    const header = firstMenuIndex === Infinity ? full : full.slice(0, firstMenuIndex);

    const lines = header.split('\n').map(s => s.trim()).filter(Boolean);
    if (!lines.length) return null;

    // 아이디 후보 수집
    const idIdxList = [];
    lines.forEach((l, i) => { if (idRegexAllowSuffix.test(l)) idIdxList.push(i); });
    if (!idIdxList.length) return null;

    // 1순위: (숫자) 접미사 붙은 줄, 2순위: 가장 아래쪽 후보(메뉴와 가장 가까움)
    let idIdx = idIdxList.find(i => /\(\d+\)\s*$/.test(lines[i]));
    if (idIdx === undefined) idIdx = idIdxList[idIdxList.length - 1];

    const rawUserId = lines[idIdx];
    const userId = rawUserId.replace(/\(\d+\)\s*$/, '');

    // 닉네임은 보통 아이디 바로 위 줄. 같다면 한 줄 더 위 시도
    let nickname = idIdx > 0 ? lines[idIdx - 1] : lines[0];
    if (nickname === userId && idIdx > 1) nickname = lines[idIdx - 2];

    if (!nickname || !userId) return null;
    return { nickname, userId };
  }

  /* =============== 버튼 주입 =============== */
  function injectButton(menuContainer, firstMenuEl, nickname, userId) {
    // 이미 주입했으면 패스
    if (menuContainer.dataset.nickidInjected === '1') return;
    if (menuContainer.querySelector('.__nickid_btn__')) return;

    // menu-list(ul) 찾기
    // 팝업 구조: .chatIct-card .menu-list > li > button
    let menuList = menuContainer.querySelector('.menu-list');
    if (!menuList) {
      // 혹시 컨테이너가 menu-list일 수도 있음
      if (menuContainer.classList && menuContainer.classList.contains('menu-list')) {
        menuList = menuContainer;
      } else {
        // 메뉴 버튼이 있는 곳을 기준으로 상위에서 menu-list를 찾는다
        const candidate = firstMenuEl && firstMenuEl.closest('.menu-list');
        if (candidate) menuList = candidate;
      }
    }
    // menu-list가 없으면 컨테이너 바로 아래에 넣되, 사이트 스타일을 최대한 맞춤
    const useFallback = !menuList;

    // 엘리먼트 생성: li > button (사이트 기본 스타일을 그대로 상속)
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = '__nickid_btn__';
    btn.setAttribute('aria-label', '닉네임 아이디 복사');
    // 아이콘 + 텍스트
    const icon = document.createElement('span');
    icon.className = '__nickid_btn_icon__';
    icon.textContent = '📄';
    btn.appendChild(icon);
    btn.appendChild(document.createTextNode('닉네임(아이디) 복사'));

    const handler = (e) => { e.preventDefault(); e.stopPropagation(); copyText(`${nickname}(${userId})`); };
    btn.addEventListener('click', handler);
    btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') handler(e); });

    li.appendChild(btn);

    if (!useFallback) {
      // 구독 배지(문구)가 menu-list 밖에 있는 경우가 많으므로, menu-list의 맨 앞에 삽입
      // (사이트 기본 스타일대로 height/패딩/색 모두 자동 적용)
      menuList.insertBefore(li, menuList.firstChild);
    } else {
      // fallback: menuContainer 맨 앞에 삽입 (스타일 상속 최대화)
      if (menuContainer.firstChild) menuContainer.insertBefore(li, menuContainer.firstChild);
      else menuContainer.appendChild(li);
    }

    menuContainer.dataset.nickidInjected = '1';
  }

  /* =============== 후보 노드 처리 =============== */
  function tryProcessRoot(root) {
    if (!(root instanceof HTMLElement)) return;

    const text = root.innerText || '';
    // 메뉴 텍스트 힌트가 최소 2개 이상일 때만 후보(채팅 영역 오탐 방지)
    if (countHints(text) < 2) return;

    const firstMenuEl = Array.from(root.querySelectorAll('*')).find(el =>
      el && el.textContent && MENU_TEXT_HINTS.includes(el.textContent.trim())
    );
    if (!firstMenuEl) return;

    const menuContainer = firstMenuEl.parentElement || root;
    if (menuContainer.dataset.nickidInjected === '1' || menuContainer.querySelector('.__nickid_btn__')) return;

    const info = extractNameAndId(root);
    if (!info) return;

    injectButton(menuContainer, firstMenuEl, info.nickname, info.userId);
  }

  /* =============== 감시 시작 + 초기 스캔 =============== */
  const observer = new MutationObserver((muts) => {
    for (const m of muts) {
      for (const node of m.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        tryProcessRoot(node);
        node.querySelectorAll && node.querySelectorAll('*').forEach(tryProcessRoot);
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  setTimeout(() => {
    document.querySelectorAll('body *').forEach(tryProcessRoot);
  }, 600);
})();
