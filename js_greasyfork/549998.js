// ==UserScript==
// @name         Last Epoch Tools KO Float (DB + Skills + Ailments + Minions)
// @namespace    https://github.com/McCommi/letools-ko-float
// @version      1.7.2
// @description  LastEpochTools EN 페이지 우측에 KO 미러 패널을 띄웁니다. /db/*, /skills/*, /ailments/*, /minions/* 지원. (스킬은 Hover/Scroll Sync 옵션 유지) • 패널 투명도 조절.
// @author       McCommi
// @license      MIT
// @match        https://www.lastepochtools.com/*
// @run-at       document-start
// @noframes
// @icon         https://www.lastepochtools.com/img/favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/549998/Last%20Epoch%20Tools%20KO%20Float%20%28DB%20%2B%20Skills%20%2B%20Ailments%20%2B%20Minions%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549998/Last%20Epoch%20Tools%20KO%20Float%20%28DB%20%2B%20Skills%20%2B%20Ailments%20%2B%20Minions%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
  if (window.top !== window) return;

  // ---------- helpers ----------
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const url  = () => new URL(location.href);
  const path = () => url().pathname;

  const starts = (seg) => path().startsWith(seg);
  const inKo   = (seg) => path().startsWith(seg + 'ko/');
  const isDbSection       = () => starts('/db/')       && !inKo('/db/');
  const isSkillsSection   = () => starts('/skills/')   && !inKo('/skills/');
  const isAilmentsSection = () => starts('/ailments/') && !inKo('/ailments/');
  const isMinionsSection  = () => starts('/minions/')  && !inKo('/minions/');

  function titleFor(seg, fallback='') {
    const parts = path().split('/').filter(Boolean);
    // parts[0] === seg without leading slash
    const i = (parts[1] === 'ko') ? 2 : 1;
    return parts[i] || fallback;
  }

  function buildKoUrl() {
    const U = url();
    if (isDbSection()) {
      const rest = U.pathname.slice('/db'.length);
      return `https://www.lastepochtools.com/db/ko${rest}${U.search}${U.hash}`;
    }
    if (isSkillsSection()) {
      const rest = U.pathname.slice('/skills'.length);
      return `https://www.lastepochtools.com/skills/ko${rest}${U.search}${U.hash}`;
    }
    if (isAilmentsSection()) {
      const rest = U.pathname.slice('/ailments'.length);
      return `https://www.lastepochtools.com/ailments/ko${rest}${U.search}${U.hash}`;
    }
    if (isMinionsSection()) {
      const rest = U.pathname.slice('/minions'.length);
      return `https://www.lastepochtools.com/minions/ko${rest}${U.search}${U.hash}`;
    }
    return null;
  }

  // SPA 네비 감지
  const notifyNav = () => window.dispatchEvent(new Event('letools:navigate'));
  (function hookHistory(){
    const push = history.pushState, replace = history.replaceState;
    history.pushState = function(){ const r = push.apply(this, arguments); notifyNav(); return r; };
    history.replaceState = function(){ const r = replace.apply(this, arguments); notifyNav(); return r; };
    window.addEventListener('popstate', notifyNav);
  })();

  // ---------- UI ----------
  let panel, iframe, css, opacityInput;
  const OP_KEY = 'letools-ko-opacity';

  function getOpacity() {
    const v = +localStorage.getItem(OP_KEY);
    return isFinite(v) && v >= 0.2 && v <= 1 ? v : 1;
  }
  function setOpacity(v) {
    v = Math.min(1, Math.max(0.2, +v || 1));
    localStorage.setItem(OP_KEY, String(v));
    if (panel) panel.style.opacity = String(v);
    if (opacityInput) opacityInput.value = String(v);
  }

  function appendOnce(node) {
    if (!node || node.isConnected) return;
    (document.body || document.documentElement).appendChild(node);
  }

  function ensurePanel() {
    if (!css) {
      css = document.createElement('style');
      css.textContent = `
        #letools-ko-panel{position:fixed; top:80px; right:24px; width:440px; height:72vh; z-index:999999;
          background:#0b0b0bcc; border:1px solid #333; border-radius:16px; overflow:hidden; color:#eee;
          box-shadow:0 10px 30px rgba(0,0,0,.45); font-family:ui-sans-serif,system-ui,Roboto,Noto Sans KR;}
        #letools-ko-panel .lekof-head{display:flex; align-items:center; justify-content:space-between;
          padding:10px 12px; background:linear-gradient(180deg,#1a1a1acc,#111111cc); cursor:move; user-select:none;}
        #letools-ko-panel .lekof-title{font-weight:700; max-width:50%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;}
        #letools-ko-panel .lekof-btns{display:flex; align-items:center; gap:8px;}
        #letools-ko-panel .lekof-btns button{background:#1f1f1f; border:1px solid #2e2e2e; color:#ddd; border-radius:8px; padding:4px 8px; cursor:pointer;}
        #letools-ko-panel .lekof-btns button:hover{background:#2a2a2a;}
        #letools-ko-panel .lekof-btns .active{outline:2px solid #5fb3ff;}
        #letools-ko-panel .lekof-op-slider{width:110px; height:20px; accent-color:#5fb3ff;}
        #letools-ko-panel .lekof-frame{width:100%; height:calc(100% - 46px); border:0; background:transparent;}
        #letools-ko-panel .lekof-resize{position:absolute; width:12px; height:12px; right:0; bottom:0; cursor:nwse-resize;
          background:linear-gradient(135deg, transparent 0 50%, #555 50% 100%);}
        #letools-ko-panel.pinned{ border-color:#5fb3ff; box-shadow:0 0 0 2px rgba(95,179,255,.25), 0 12px 32px rgba(0,0,0,.5); }
        @media (max-width:1200px){ #letools-ko-panel{ width:min(92vw, 480px); right:8px; height:60vh; } }
      `;
    }

    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'letools-ko-panel';
      panel.innerHTML = `
        <div class="lekof-head">
          <div class="lekof-title">KO 뷰</div>
          <div class="lekof-btns">
            <span title="투명도(𝛂)"><small>𝛂</small></span>
            <input class="lekof-op-slider" type="range" min="0.2" max="1" step="0.05" value="1">
            <button class="lekof-sync" title="(스킬 전용) Hover/Scroll Sync 토글">🔄</button>
            <button class="lekof-refresh" title="새로고침">⟳</button>
            <button class="lekof-pin" title="고정">📌</button>
            <button class="lekof-close" title="닫기">✕</button>
          </div>
        </div>
        <iframe class="lekof-frame"
          sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          referrerpolicy="no-referrer"></iframe>
        <div class="lekof-resize"></div>
      `;

      // 드래그
      (function drag(){
        let sx=0,sy=0,ox=0,oy=0,d=false;
        panel.addEventListener('mousedown',e=>{
          if (e.target && (e.target.classList?.contains('lekof-op-slider'))) return;
          if (!e.target.closest('.lekof-head')) return;
          d=true; sx=e.clientX; sy=e.clientY; const r=panel.getBoundingClientRect(); ox=r.left; oy=r.top; e.preventDefault();
        });
        window.addEventListener('mousemove',e=>{
          if(!d) return; const dx=e.clientX-sx, dy=e.clientY-sy;
          panel.style.left=`${Math.max(4,ox+dx)}px`; panel.style.top=`${Math.max(4,oy+dy)}px`; panel.style.right='auto';
        });
        window.addEventListener('mouseup',()=> d=false);
      })();

      // 리사이즈
      (function resize(){
        const handle = panel.querySelector('.lekof-resize');
        let sw=0,sh=0,sx=0,sy=0,r=false;
        handle.addEventListener('mousedown',e=>{
          r=true; sx=e.clientX; sy=e.clientY; const b=panel.getBoundingClientRect(); sw=b.width; sh=b.height; e.preventDefault();
        });
        window.addEventListener('mousemove',e=>{
          if(!r) return; const dx=e.clientX-sx, dy=e.clientY-sy;
          panel.style.width=`${Math.max(320,sw+dx)}px`; panel.style.height=`${Math.max(360,sh+dy)}px`;
        });
        window.addEventListener('mouseup',()=> r=false);
      })();

      // 버튼 & 슬라이더
      panel.querySelector('.lekof-close').addEventListener('click', ()=>{ panel.remove(); panel=null; iframe=null; });
      panel.querySelector('.lekof-pin').addEventListener('click', ()=> panel.classList.toggle('pinned'));
      panel.querySelector('.lekof-refresh').addEventListener('click', ()=> loadKo(true));
      panel.querySelector('.lekof-sync').addEventListener('click', ()=> toggleHoverSync());

      opacityInput = panel.querySelector('.lekof-op-slider');
      opacityInput.addEventListener('input', (e)=>{
        e.stopPropagation();
        setOpacity(e.target.value);
      });

      iframe = panel.querySelector('.lekof-frame');
      try { iframe.setAttribute('credentialless',''); } catch(e) {}
    }

    if (document.readyState === 'loading') {
      if (!css._appended) {
        document.addEventListener('DOMContentLoaded', () => { appendOnce(css); appendOnce(panel); applyOpacity(); });
        css._appended = true;
      }
    } else {
      appendOnce(css); appendOnce(panel); applyOpacity();
    }
    return panel;
  }

  function applyOpacity() { setOpacity(getOpacity()); }

  function setTitle() {
    if (!panel) return;
    const t = panel.querySelector('.lekof-title');
    if (!t) return;

    if (isDbSection())          t.textContent = `KO DB • ${titleFor('db','db')}`;
    else if (isSkillsSection()) t.textContent = `KO 스킬 • ${titleFor('skills','목록')}`;
    else if (isAilmentsSection()) t.textContent = `KO Ailments • ${titleFor('ailments','index')}`;
    else if (isMinionsSection())  t.textContent = `KO Minions • ${titleFor('minions','index')}`;
    else t.textContent = `KO 뷰`;
  }

  function shouldShow(){
    return isDbSection() || isSkillsSection() || isAilmentsSection() || isMinionsSection();
  }

  function loadKo(force=false){
    if (!shouldShow()) {
      if (panel && !panel.classList.contains('pinned')) { panel.remove(); panel=null; iframe=null; }
      return;
    }
    ensurePanel();
    setTitle();
    const target = buildKoUrl();
    if (!target) return;
    if (force || !iframe || iframe.src !== target) {
      iframe.src = target;
      if (isSkillsSection()) {
        iframe.addEventListener('load', setupIframeReceiverForSkills, { once:true });
      }
    }
  }

  async function maybeStart(){ await sleep(80); loadKo(); }
  window.addEventListener('letools:navigate', maybeStart);
  maybeStart();

  // -------- Hover/Scroll Sync (스킬 전용) --------
  let syncEnabled = true;
  function toggleHoverSync(){
    syncEnabled = !syncEnabled;
    panel?.querySelector('.lekof-sync')?.classList.toggle('active', syncEnabled);
  }

  function extractNodeKey(el){
    if (!el) return null;
    const node = el.closest?.('[class*="node"], [class*="Node"], [class*="skill-node"], [class*="SkillNode"]');
    if (!node) return null;
    const ds = node.dataset || {};
    const dataId = ds.nodeId || ds.id || ds.node || null;
    if (dataId) return { type:'data', value:String(dataId) };
    const a = node.querySelector('a[href*="node="]') || node.closest('a[href*="node="]');
    if (a) {
      try { const u = new URL(a.href, location.href); const q = u.searchParams.get('node'); if (q) return { type:'query', value:q }; } catch {}
    }
    if (node.id && /node[-_]/i.test(node.id)) return { type:'id', value:node.id.replace(/^.*?node[-_]/i,'') };
    const img = node.querySelector('img[src]');
    if (img) { try { return { type:'icon', value:new URL(img.src).pathname }; } catch {} }
    return null;
  }

  (function startSkillBroadcaster(){
    const sendScroll = ()=>{
      if (!syncEnabled || !isSkillsSection() || !iframe?.contentWindow) return;
      const doc = document.documentElement;
      const max = (doc.scrollHeight - doc.clientHeight) || 1;
      iframe.contentWindow.postMessage({ type:'LE_SYNC_DOC_SCROLL', pct: doc.scrollTop / max }, '*');
    };
    window.addEventListener('scroll', sendScroll, { passive:true });

    document.addEventListener('mouseover', (e)=>{
      if (!syncEnabled || !isSkillsSection() || !iframe?.contentWindow) return;
      if (panel && panel.contains(e.target)) return;
      const key = extractNodeKey(e.target);
      if (!key) return;
      iframe.contentWindow.postMessage({ type:'LE_SYNC_NODE_KEY', key }, '*');
    }, true);
  })();

  function setupIframeReceiverForSkills(){
    if (!iframe?.contentWindow) return;
    try {
      const w = iframe.contentWindow;
      const d = w.document;
      if (w.__le_id_sync_installed__) return;
      w.__le_id_sync_installed__ = true;

      function findByKey(key){
        if (!key) return null;
        const { type, value } = key;
        if (type === 'data') {
          const s = `[data-node-id="${CSS.escape(value)}"], [data-id="${CSS.escape(value)}"], [data-node="${CSS.escape(value)}"]`;
          return d.querySelector(s);
        }
        if (type === 'query') {
          const a = d.querySelector(`a[href*="node=${CSS.escape(value)}"]`);
          return a ? (a.closest('[class*="node"], [class*="Node"], [class*="skill-node"], [class*="SkillNode"]') || a) : null;
        }
        if (type === 'id') {
          return d.getElementById(`node-${value}`) || d.getElementById(`node_${value}`) || d.getElementById(value);
        }
        if (type === 'icon') {
          let imgs = Array.from(d.querySelectorAll(`img[src$="${CSS.escape(value)}"]`));
          if (!imgs.length) imgs = Array.from(d.querySelectorAll(`img[src*="${CSS.escape(value.split('/').pop()||'')}"]`));
          const nodes = imgs.map(img => img.closest('[class*="node"], [class*="Node"], [class*="skill-node"], [class*="SkillNode"]') || img);
          return nodes[0] || null;
        }
        return null;
      }

      w.addEventListener('message', (ev)=>{
        const msg = ev.data || {};
        if (msg.type === 'LE_SYNC_DOC_SCROLL') {
          const doc = d.documentElement;
          const max = (doc.scrollHeight - doc.clientHeight) || 1;
          doc.scrollTop = msg.pct * max;
          return;
        }
        if (msg.type === 'LE_SYNC_NODE_KEY') {
          const node = findByKey(msg.key);
          if (!node) return;
          node.scrollIntoView({ block:'nearest', inline:'nearest', behavior:'auto' });
          const r = node.getBoundingClientRect();
          const x = Math.round(r.left + r.width/2);
          const y = Math.round(r.top  + r.height/2);
          const move = new w.MouseEvent('mousemove', {bubbles:true, clientX:x, clientY:y});
          const over = new w.MouseEvent('mouseover', {bubbles:true, clientX:x, clientY:y});
          node.dispatchEvent(move); node.dispatchEvent(over);
        }
      });
    } catch {}
  }
})();
