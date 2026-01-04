// ==UserScript==
// @name         치지직 스크린샷
// @namespace    https://your.namespace
// @version      3.5.0
// @description  영상 위에 마우스를 올릴 때만 하단 중앙에 스크린샷 버튼 표시. S 단축키 지원.
// @match        https://chzzk.naver.com/live/*
// @match        https://chzzk.naver.com/video/*
// @icon         https://i.imgur.com/vDb6wAm.png
// @run-at       document-idle
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551783/%EC%B9%98%EC%A7%80%EC%A7%81%20%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/551783/%EC%B9%98%EC%A7%80%EC%A7%81%20%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const Y_OFFSET_TWEAK = 0;   // 세로 위치 미세 조정 (예: -2, +2)

  GM_addStyle(`
    .chzzk-ss-fixed {
      position: fixed;
      z-index: 2147483647;
      transform: translate(-50%, -50%);
      opacity: 0;
      pointer-events: none;
      transition: opacity .18s ease;
    }
    .chzzk-ss-fixed.show { opacity: 1; }
    .chzzk-ss-btn {
      width: 44px; height: 44px;
      border: none; border-radius: 999px;
      display: inline-flex; align-items: center; justify-content: center;
      cursor: pointer; pointer-events: auto;
      background: rgba(20,20,24,0.6);
      backdrop-filter: blur(6px);
      box-shadow: 0 6px 18px rgba(0,0,0,.35);
      transition: background-color .15s, transform .05s;
    }
    .chzzk-ss-btn:hover { background: rgba(255,255,255,0.18); }
    .chzzk-ss-btn:active { transform: scale(0.96); }
    .chzzk-ss-icon { width: 22px; height: 22px; opacity: .95; pointer-events: none; filter: drop-shadow(0 1px 1px rgba(0,0,0,.28)); }
  `);

  const camURI = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
       <path d="M9 4a1 1 0 0 0-.894.553L7.382 6H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-2.382l-.724-1.447A1 1 0 0 0 15 4H9zm3 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10z"/>
     </svg>`
  );

  function getMainVideo(){
    const vids=[...document.querySelectorAll('video')].filter(v=>v.videoWidth&&v.videoHeight);
    return vids.sort((a,b)=>(b.videoWidth*b.videoHeight)-(a.videoWidth*a.videoHeight))[0] || document.querySelector('video');
  }

  async function capture(){
    const v=getMainVideo(); if(!v) return;
    const c=document.createElement('canvas');
    c.width=v.videoWidth; c.height=v.videoHeight;
    c.getContext('2d').drawImage(v,0,0,c.width,c.height);
    c.toBlob(blob=>{
      const a=document.createElement('a');
      a.href=URL.createObjectURL(blob);
      a.download=`screenshot_${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    }, 'image/png');
  }

  let holder;
  function ensureButton(){
    if(holder && document.body.contains(holder)) return holder;
    holder = document.createElement('div');
    holder.className = 'chzzk-ss-fixed';
    const btn = document.createElement('button');
    btn.className = 'chzzk-ss-btn'; btn.title = '스크린샷 (S)';
    const img = document.createElement('img');
    img.className = 'chzzk-ss-icon'; img.src = camURI; img.alt='screenshot';
    btn.appendChild(img);
    btn.addEventListener('click', capture);
    holder.appendChild(btn);
    document.body.appendChild(holder);
    return holder;
  }

  function getControlsRect(){
    const sels = ['.pzp-pc_bottom-buttons', '.pzp-pc_bottom', '.pzp-controls', '[class*="bottom-buttons"]', '[class*="Controls"]'];
    for(const s of sels){
      const el = document.querySelector(s);
      if(!el) continue;
      const r = el.getBoundingClientRect();
      if(r.width>0 && r.height>0) return r;
    }
    return null;
  }

  function placeAtCenter(){
    const v = getMainVideo(); if(!v){ holder?.classList.remove('show'); return; }
    const vrect = v.getBoundingClientRect();
    if(vrect.width<=0 || vrect.height<=0){ holder?.classList.remove('show'); return; }

    const crect = getControlsRect();
    const x = vrect.left + vrect.width/2;
    const y = crect ? (crect.top + crect.height/2 + Y_OFFSET_TWEAK) : (vrect.bottom - 40);

    const h = ensureButton();
    h.style.left = `${x}px`;
    h.style.top  = `${y}px`;
  }

  let hoverTimer=null;
  function onMouseMove(e){
    const v=getMainVideo(); if(!v) return;
    const r=v.getBoundingClientRect();
    const inside= e.clientX>=r.left && e.clientX<=r.right && e.clientY>=r.top && e.clientY<=r.bottom;
    ensureButton();
    if(inside){
      holder.classList.add('show');
      clearTimeout(hoverTimer);
      hoverTimer=setTimeout(()=>holder.classList.remove('show'),1200);
    }
  }

  // 루프 & 이벤트
  (function loop(){ placeAtCenter(); requestAnimationFrame(loop); })();
  window.addEventListener('mousemove', onMouseMove, true);
  window.addEventListener('keydown', e=>{
    if(e.key?.toLowerCase()==='s'){ e.preventDefault(); capture(); }
  }, true);
})();
