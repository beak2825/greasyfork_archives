// ==UserScript==
// @name         SOOP null: 방종후 채팅가능
// @namespace    https://play.sooplive.co.kr/
// @version      1.3.0
// @description  null 페이지
// @author       해인
// @license      MIT
// @match        https://play.sooplive.co.kr/*/null*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/549556/SOOP%20null%3A%20%EB%B0%A9%EC%A2%85%ED%9B%84%20%EC%B1%84%ED%8C%85%EA%B0%80%EB%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/549556/SOOP%20null%3A%20%EB%B0%A9%EC%A2%85%ED%9B%84%20%EC%B1%84%ED%8C%85%EA%B0%80%EB%8A%A5.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const isNullPage = () =>
    location.hostname === 'play.sooplive.co.kr' &&
    /^\/[^/]+\/null(?:[/?#]|$)/.test(location.pathname);
  if (!isNullPage()) return;

  // ===== 유틸 =====
  const $  = (s, r=document)=>r.querySelector(s);
  const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));
  const on = (el, ev, cb, opt)=>el&&el.addEventListener(ev, cb, opt);

  // ===== 작성자 닉네임 관리 =====
  const NICK_KEY = 'soop_user_nick_cache';

  function getCachedNick(){
    try { return localStorage.getItem(NICK_KEY) || ''; } catch { return ''; }
  }
  function setCachedNick(n){
    if (!n) return;
    try { localStorage.setItem(NICK_KEY, n); } catch {}
  }

  // 닉네임을 DOM에서 추정
  function findNickFromDOM(){
    // 닉네임이 들어있을 법한 후보들 (폭넓게 커버)
    const candidates = $$('.nick, .nickname .nick, .my_info .nick, .user_profile .nick, #profileModal .nick, .profile_layer .nick, .profile .nick');
    for (const el of candidates){
      const t = (el.textContent || '').trim();
      if (t && t.length <= 24) return t;
    }
    return '';
  }

  // 프로필을 클릭했을 때(모달 열릴 때) 닉네임 새로 고침
  function watchProfileForNick(){
    // 프로필 이미지/버튼 후보
    const triggers = $$('.profile-img, .btn_my, .btn_profile, .avatar, .my_profile, .btn_mypage');
    for (const t of triggers){
      on(t, 'click', () => {
        // 모달 DOM이 붙을 시간을 조금 준 뒤 스캔
        setTimeout(updateNickFromDOM, 100);
      });
    }
    // DOM 변화에도 항상 갱신
    new MutationObserver(() => updateNickFromDOM())
      .observe(document.documentElement, {childList:true, subtree:true});
  }
  function updateNickFromDOM(){
    const nick = findNickFromDOM();
    if (nick) setCachedNick(nick);
  }

  // 현재 표시할 작성자 텍스트
  function resolveAuthorText(){
    const nick = getCachedNick();
    if (nick) return nick;
    // 닉네임 캐시가 없으면 경로 1세그먼트(스트리머 아이디)를 임시로 사용
    const pathId = (location.pathname.split('/')[1]||'').trim();
    return pathId || '게스트';
  }

  // ===== 이모티콘 버튼 아이콘 항상 보이게 =====
  const ACTIVE_SMILE_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='33' viewBox='0 0 32 33'%3E%3Ccircle cx='16' cy='16.5' r='13.5' fill='none' stroke='%23222' stroke-width='2'/%3E%3Ccircle cx='12' cy='13.5' r='1.8' fill='%23222'/%3E%3Ccircle cx='20' cy='13.5' r='1.8' fill='%23222'/%3E%3Cpath d='M10 19.5c1.4 2.2 3.4 3.2 6 3.2s4.6-1 6-3.2' fill='none' stroke='%23222' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`;
  const style = document.createElement('style');
  style.textContent = `
    #btn_emo.btn_emoticon {
      background-image: ${ACTIVE_SMILE_SVG} !important;
      background-repeat:no-repeat !important;
      background-position:center !important;
      background-size:22px 22px !important;
      filter:none !important; opacity:1 !important; cursor:pointer !important;
    }
    .chatbox .actionbox .chat_write .btn_emoticon.off{ filter:none !important; opacity:1 !important; cursor:pointer !important; }

    /* 이모티콘 3줄 고정 + 내부 스크롤 */
    #emoticonContainer, #emoticonBox, #emoticonContainer .layer_inner { overflow:hidden !important; }
    #emoticonContainer .emoticon_item{
      display:grid !important;
      --emo:46px; --gap:8px;
      grid-template-columns:repeat(auto-fill, minmax(var(--emo),1fr));
      grid-auto-rows:var(--emo);
      gap:var(--gap); padding:var(--gap); box-sizing:border-box;
      height:calc(var(--emo)*3 + var(--gap)*2) !important;
      max-height:calc(var(--emo)*3 + var(--gap)*2) !important;
      overflow-y:auto !important; overscroll-behavior:contain; scrollbar-gutter:stable both-edges;
    }
    #emoticonContainer .emoticon_item > span{ width:100%; height:100%; display:grid; place-items:center; }
    #emoticonContainer .emoticon_item img{ max-width:100%; max-height:100%; object-fit:contain; vertical-align:middle; }

    /* 구독 모달 차단 */
    #customAlert.basic_alert.sub-modal{ display:none !important; visibility:hidden !important; pointer-events:none !important; }
    body.modal-open{ overflow:auto !important; }
  `;
  document.head.appendChild(style);

  // ===== 구독 모달 생겨도 즉시 제거 =====
  const killModal = () => {
    const m = $('#customAlert.basic_alert.sub-modal');
    if (m && m.parentNode) m.parentNode.removeChild(m);
    document.body.classList.remove('modal-open');
  };
  new MutationObserver(() => killModal())
    .observe(document.documentElement, {childList:true, subtree:true});

  // ===== 입력칸 활성화 & Enter 가짜 전송 =====
  function enableWriteAndEnterToChat() {
    const write = $('#write_area');
    const chat  = $('#chat_area');
    if (!write || !chat) return false;

    write.setAttribute('contenteditable','true');
    write.removeAttribute('disabled'); write.removeAttribute('aria-disabled');
    write.tabIndex = 0;

    new MutationObserver(() => {
      if (write.getAttribute('contenteditable') !== 'true') write.setAttribute('contenteditable','true');
      if (write.hasAttribute('disabled')) write.removeAttribute('disabled');
      if (write.hasAttribute('aria-disabled')) write.removeAttribute('aria-disabled');
    }).observe(write, { attributes:true });

    on(write,'keydown',(e)=>{
      if (e.key !== 'Enter' || e.shiftKey) return;
      e.preventDefault();
      const html = write.innerHTML.trim();
      if (!html) return;

      const authorText = resolveAuthorText();

      const item = document.createElement('div');
      item.className = 'chatting-list-item';
      item.innerHTML = `
        <div class="message-container">
          <div class="username"><span class="author">${authorText}</span></div>
          <div class="message-text"><p class="msg">${html}</p></div>
        </div>`;
      chat.appendChild(item);
      chat.scrollTop = chat.scrollHeight;
      write.innerHTML = '';
    });
    return true;
  }

  // ===== 이모티콘 버튼 토글 =====
  function activateEmoButtonAndLayer() {
    const btn = $('#btn_emo.btn_emoticon');
    const cont = $('#emoticonContainer');
    const box  = $('#emoticonBox');
    if (!btn) return false;

    btn.classList.remove('off');
    btn.setAttribute('aria-pressed','true');
    btn.style.pointerEvents = 'auto';
    new MutationObserver(() => {
      if (btn.classList.contains('off')) btn.classList.remove('off');
      if (btn.getAttribute('aria-pressed') !== 'true') btn.setAttribute('aria-pressed','true');
    }).observe(btn, { attributes:true, attributeFilter:['class','aria-pressed'] });

    on(btn,'click',(e)=>{
      e.preventDefault();
      if (cont){ cont.classList.add('on'); cont.style.display='block'; }
      if (box ){ box.style.display='block'; }
      const write = $('#write_area'); write && write.focus();
    });

    const closeBtn = $('#emoticonContainer .btn_close');
    on(closeBtn,'click',(e)=>{
      e.preventDefault();
      if (cont){ cont.classList.remove('on'); cont.style.display='none'; }
      if (box ){ box.style.display='none'; }
    });
    return true;
  }

  // ===== 이모티콘 중복 방지 + 모달 차단 삽입 =====
  function hookEmoticonClicks() {
    const write = $('#write_area');
    const cont  = $('#emoticonContainer');
    if (!write || !cont) return false;

    cont.addEventListener('click', (e) => {
      const el = e.target instanceof Element ? e.target.closest('a, img') : null;
      if (!el || !el.closest('.emoticon_item')) return;

      e.preventDefault();
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();

      const img = el.tagName === 'IMG' ? el : el.querySelector('img');
      const node = img
        ? (()=>{ const c = img.cloneNode(true); c.style.verticalAlign='middle'; c.style.maxHeight='24px'; return c; })()
        : document.createTextNode((el.getAttribute('title') || el.textContent || '').trim());

      insertAtCaret(write, node);
      write.focus();
      killModal();
    }, { capture:true });

    return true;
  }

  // ===== 커서 삽입 유틸 =====
  function insertAtCaret(editable, node){
    editable.focus();
    const sel = getSelection();
    if (!sel || sel.rangeCount===0) {
      editable.appendChild(node);
      placeCaretEnd(editable);
      return;
    }
    const r = sel.getRangeAt(0);
    r.deleteContents();
    r.insertNode(node);
    r.setStartAfter(node);
    r.setEndAfter(node);
    sel.removeAllRanges();
    sel.addRange(r);
  }
  function placeCaretEnd(el){
    const r = document.createRange();
    r.selectNodeContents(el);
    r.collapse(false);
    const s = getSelection();
    s.removeAllRanges();
    s.addRange(r);
  }

  // ===== 부팅 =====
  function boot() {
    watchProfileForNick();      // 닉네임 감시 시작(먼저 캐시될 수 있게)
    updateNickFromDOM();        // 처음에도 한 번 시도

    let tries = 0;
    const iv = setInterval(()=>{
      tries++;
      const a = enableWriteAndEnterToChat();
      const b = activateEmoButtonAndLayer();
      const c = hookEmoticonClicks();
      if (a && b && c) clearInterval(iv);
      else if (tries > 25) clearInterval(iv); // ~5초
    }, 200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once:true });
  } else {
    boot();
  }
})();
