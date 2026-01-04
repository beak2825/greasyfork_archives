// ==UserScript==
// @name         SOOP 도네창 변경
// @namespace    soop-gift-qol
// @version      1.9.8
// @description  Alt+드래그로 모달 레이어 이동. 쓰기/잠금 토글
// @match        https://play.sooplive.co.kr/*
// @match        https://www.sooplive.co.kr/*
// @run-at       document-end
// @grant        none
// @license      All rights reserved
// @downloadURL https://update.greasyfork.org/scripts/550146/SOOP%20%EB%8F%84%EB%84%A4%EC%B0%BD%20%EB%B3%80%EA%B2%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/550146/SOOP%20%EB%8F%84%EB%84%A4%EC%B0%BD%20%EB%B3%80%EA%B2%BD.meta.js
// ==/UserScript==
(() => {
  'use strict';

  const VER = '1.9.8';
  // 모달 루트(바깥 상자) 셀렉터 — 이 요소가 움직여야 함
  const GIFT_ROOT_SELECTOR = '#layerStarGiftNew.modal-layer.pop_stargift, #layerStarGift.modal-layer.pop_stargift, .modal-layer.pop_stargift';
  const DIM_KEY = 'sgGiftDimMode'; // 'lock' | 'write'
  const DEFAULT_DIM = localStorage.getItem(DIM_KEY) || 'write';

  // ── 과거 남은 스타일/툴바 정리
  ['sg-theme-style-191','_sg_gift_style_192','_sg_min_toolbar_style_194','_sg_toolbar_style_195','_sg_toolbar_style_196','_sg_toolbar_style_197'].forEach(id=>document.getElementById(id)?.remove());

  // ── 최소 스타일(툴바만)
  const STYLE_ID = '_sg_toolbar_style_198';
  if(!document.getElementById(STYLE_ID)){
    const s = document.createElement('style'); s.id = STYLE_ID; s.textContent = `
      /* 기본(루트 우상단 절대배치) */
      ._sg-toolbar{position:absolute;top:8px;right:8px;z-index:2147483000;display:inline-flex;gap:6px;align-items:center}
      ._sg-btn{height:24px;padding:0 10px;border-radius:999px;border:1px solid rgba(0,0,0,.18);background:rgba(255,255,255,.85);font-size:12px;line-height:22px;cursor:pointer}
      html.dark ._sg-btn{border-color:rgba(255,255,255,.22);background:rgba(32,35,40,.78);color:#e5e7eb}
      /* 힌트: 어떤 배경에서도 보이도록 고대비 필(라이트/다크 분기) */
      ._sg-hint{font-size:12px;margin-left:6px;padding:0 8px;line-height:20px;border-radius:999px;background:rgba(17,24,39,.64);color:#fff;border:1px solid rgba(0,0,0,.2);text-shadow:0 1px 0 rgba(0,0,0,.25)}
      html.dark ._sg-hint{background:rgba(255,255,255,.16);color:#f3f4f6;border-color:rgba(255,255,255,.24)}
      ._sg-dragging{user-select:none}
      /* 헤더 안에 붙었을 때는 인라인 배치 */
      .modal-layer .title-area ._sg-toolbar, .modal-layer .title_area ._sg-toolbar{position:static;margin-left:10px}
      .modal-layer .title-area ._sg-btn, .modal-layer .title_area ._sg-btn{height:22px;line-height:20px}
    `; document.head.appendChild(s);
  }

  const qs  = (sel,root=document) => root.querySelector(sel);
  const qsa = (sel,root=document) => Array.from(root.querySelectorAll(sel));

  // 루트는 항상 모달 레이어
  const getRoot  = (from=document) => qs(GIFT_ROOT_SELECTOR, from);
  // 헤더 핸들 (없는 경우도 대비)
  const getHeader= (root) => root?.querySelector('.title-area, .title_area, .pop-title, .pop_title, .layer_title, .modal-header, .header, h3, h2');

  // ── 딤/오버레이 제어
  function setDimMode(mode){
    localStorage.setItem(DIM_KEY, mode);
    // 1) 모달 내부 dim 요소(여러개 있을 수 있음)
    const dims = qsa('.modal-dim, .dim');
    dims.forEach(d => {
      if(!('sgPrevStyle' in d.dataset)) d.dataset.sgPrevStyle = d.getAttribute('style') || '';
      if(mode === 'write'){
        d.setAttribute('style', (d.dataset.sgPrevStyle? d.dataset.sgPrevStyle+';':'') + 'opacity:0;visibility:hidden;pointer-events:none');
      } else {
        const prev = d.dataset.sgPrevStyle || '';
        if(prev) d.setAttribute('style', prev); else d.removeAttribute('style');
        delete d.dataset.sgPrevStyle;
      }
    });

    // 2) 전역 모달 래퍼의 dimed 클래스 (배경 클릭 막는 주범)
    const wrap = document.getElementById('modal') || qs('._Modal_UI_Wrap');
    if(wrap){
      if(mode === 'write'){
        // 원래 dimed가 있었는지 저장하고 제거
        if(wrap.classList.contains('dimed')) wrap.dataset.sgHadDimed = '1';
        wrap.classList.remove('dimed');
      } else {
        if(wrap.dataset.sgHadDimed === '1') wrap.classList.add('dimed');
        delete wrap.dataset.sgHadDimed;
      }
    }
  }

  function restoreDimIfNoGift(){ if(!getRoot()) setDimMode('lock'); }

  // ── 드래그: 루트(.modal-layer.pop_stargift)를 이동해야 함
  function bindDrag(root){
    const panel = root; // 이동 대상은 항상 모달 루트!
    const dragArea = getHeader(root) || root; // 헤더 우선
    let dragging=false,sx=0,sy=0,tx=0,ty=0,raf=0,mx=0,my=0;
    const readT = ()=>{ tx=Number(panel.dataset.sgTx||0); ty=Number(panel.dataset.sgTy||0); };
    const onDown = (e)=>{
      if(!e.altKey) return;
      const tag = (e.target?.tagName||'').toLowerCase();
      if(tag==='button' || tag==='input' || tag==='textarea' || tag==='select' || e.target?.closest('a,button,[role="button"],.btn')) return;
      readT(); dragging=true; sx=e.clientX; sy=e.clientY; panel.classList.add('_sg-dragging');
      const move = (ev)=>{ if(!dragging) return; mx=ev.clientX; my=ev.clientY; if(!raf){ raf=requestAnimationFrame(()=>{ raf=0; const nx=tx+(mx-sx), ny=ty+(my-sy); panel.style.transform=`translate(${nx}px,${ny}px)`; panel.dataset.sgTx=nx; panel.dataset.sgTy=ny; }); } };
      const up = ()=>{ dragging=false; panel.classList.remove('_sg-dragging'); window.removeEventListener('mousemove',move,true); window.removeEventListener('mouseup',up,true); if(raf){ cancelAnimationFrame(raf); raf=0; } };
      window.addEventListener('mousemove',move,true); window.addEventListener('mouseup',up,true);
      e.preventDefault();
    };
    dragArea.addEventListener('mousedown', onDown);
  }

  // ── 툴바(제목 옆 우선 배치, 없으면 루트 우상단)
  function addToolbar(root){
    root.querySelectorAll('._sg-toolbar').forEach(n=>n.remove());
    const bar = document.createElement('span'); bar.className = '_sg-toolbar';
    const dimBtn = document.createElement('button'); dimBtn.className = '_sg-btn';
    const hint = document.createElement('span'); hint.className = '_sg-hint'; hint.textContent = 'Alt+드래그 – 창 이동';

    function paint(){ const m = localStorage.getItem(DIM_KEY) || DEFAULT_DIM; dimBtn.textContent = (m==='lock') ? '🔒 잠금' : '✍️ 쓰기'; }
    function toggle(){ const cur = localStorage.getItem(DIM_KEY) || DEFAULT_DIM; const next = (cur==='lock')?'write':'lock'; setDimMode(next); paint(); }
    setDimMode(localStorage.getItem(DIM_KEY) || DEFAULT_DIM);
    paint(); dimBtn.addEventListener('click', toggle);

    // 헤더 안으로 넣기 시도
    const header = getHeader(root);
    if(header){
      bar.appendChild(dimBtn); bar.appendChild(hint);
      // strong 다음으로 넣되, btn-reaction 앞쪽에 위치시키기
      const reactBtn = header.querySelector('.btn-reaction');
      if(reactBtn){ header.insertBefore(bar, reactBtn); }
      else {
        const strong = header.querySelector('strong, h2, h3');
        if(strong && strong.nextSibling) header.insertBefore(bar, strong.nextSibling);
        else header.appendChild(bar);
      }
    } else {
      // 헤더가 없으면 루트 우상단 고정
      const computedPos = getComputedStyle(root).position;
      if(computedPos === 'static') root.style.position = 'relative';
      bar.appendChild(dimBtn); bar.appendChild(hint);
      root.appendChild(bar);
    }
  }

  // ── 장착
  function enhance(root){
    if(!root || root.dataset._sg_bound === '1') return;
    root.dataset._sg_bound = '1';
    addToolbar(root);
    bindDrag(root);
    console.info('[SOOP QoL]', VER, 'enhanced on', root.id || root.className);
  }

  // ── 부트 & 감시
  const boot = ()=>{ const r=getRoot(); if(r) enhance(r); };
  boot();

  const mo = new MutationObserver(muts=>{
    let touched=false;
    for(const m of muts){
      for(const n of m.addedNodes){ if(n.nodeType!==1) continue; const el=n; const r = el.matches?.(GIFT_ROOT_SELECTOR)? el : el.querySelector?.(GIFT_ROOT_SELECTOR); if(r){ enhance(r); touched=true; } }
      for(const n of m.removedNodes){ if(n.nodeType!==1) continue; const el=n; if(el.matches?.(GIFT_ROOT_SELECTOR) || el.querySelector?.(GIFT_ROOT_SELECTOR)) touched=true; }
    }
    if(touched) restoreDimIfNoGift();
  });
  mo.observe(document.body || document.documentElement, { childList:true, subtree:true });

  // ── 단축키: Alt+Shift+D → 쓰기/잠금 토글
  window.addEventListener('keydown', (e)=>{ if(e.altKey && e.shiftKey && e.code==='KeyD'){ const cur = localStorage.getItem(DIM_KEY) || DEFAULT_DIM; setDimMode(cur==='lock'?'write':'lock'); } }, {passive:true});

  console.log(`[SOOP QoL ${VER}] 로드됨: Alt+드래그(모달 이동), ✍️/🔒 토글(버튼 또는 Alt+Shift+D)`);
})();
