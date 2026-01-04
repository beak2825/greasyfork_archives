// ==UserScript==
// @name         WPlace – Contrast Tile Black or White
// @namespace    wplace.blackout.response
// @version      1.0.0
// @description  Adds contrast, black/white. To better see where to place your pixel.
// @match        https://wplace.live/*
// @run-at       document-start
// @grant        none
// @all-frames   true
// @inject-into  page
// @downloadURL https://update.greasyfork.org/scripts/547850/WPlace%20%E2%80%93%20Contrast%20Tile%20Black%20or%20White.user.js
// @updateURL https://update.greasyfork.org/scripts/547850/WPlace%20%E2%80%93%20Contrast%20Tile%20Black%20or%20White.meta.js
// ==/UserScript==

(function(){
  'use strict';

  // --- réglages ---
  const TILE_RE = /^https:\/\/backend\.wplace\.live\/files\/.+\.png(?:\?.*)?$/i;
  const getMode  = () => localStorage.getItem('tile_blackout') || 'off';       // 'off' | 'on'
  const getColor = () => localStorage.getItem('tile_blackout_color') || 'black'; // 'black' | 'white'

  // --- util: compose blob -> blob (fond uni + image d'origine) ---
  async function composePngWithBackground(origBlob){
    const img = await createImageBitmap(origBlob);
    const cnv = document.createElement('canvas');
    cnv.width = img.width; cnv.height = img.height;
    const ctx = cnv.getContext('2d');
    ctx.fillStyle = (getColor()==='white') ? '#ffffff' : '#000000';
    ctx.fillRect(0,0,cnv.width,cnv.height);
    ctx.drawImage(img,0,0);
    return new Promise(res => cnv.toBlob(b => res(b || origBlob), 'image/png'));
  }

  // --- patch Response.blob / arrayBuffer ---
  const processedResponses = new WeakSet();
  const origBlob = Response.prototype.blob;
  const origArrayBuffer = Response.prototype.arrayBuffer;

  Response.prototype.blob = function(...args){
    // si déjà traité ou pas une tuile → passe
    try {
      const url = (this && this.url) || '';
      const on = getMode()==='on';
      if (!on || !TILE_RE.test(url) || processedResponses.has(this)) {
        return origBlob.apply(this, args);
      }
      const ct = (this.headers && this.headers.get && this.headers.get('content-type'))?.toLowerCase() || '';
      // on ne retouche que du PNG
      if (ct && !ct.includes('image/png')) {
        return origBlob.apply(this, args);
      }
      return origBlob.apply(this, args).then(async (b)=>{
        try{
          const newBlob = await composePngWithBackground(b);
          processedResponses.add(this);
          return newBlob || b;
        }catch(e){
          return b;
        }
      });
    } catch(e) {
      return origBlob.apply(this, args);
    }
  };

  Response.prototype.arrayBuffer = function(...args){
    try {
      const url = (this && this.url) || '';
      const on = getMode()==='on';
      if (!on || !TILE_RE.test(url) || processedResponses.has(this)) {
        return origArrayBuffer.apply(this, args);
      }
      const ct = (this.headers && this.headers.get && this.headers.get('content-type'))?.toLowerCase() || '';
      if (ct && !ct.includes('image/png')) {
        return origArrayBuffer.apply(this, args);
      }
      // on part du blob pour recomposer puis on renvoie un ArrayBuffer
      return origBlob.apply(this, args).then(async (b)=>{
        try{
          const newBlob = await composePngWithBackground(b);
          processedResponses.add(this);
          return newBlob.arrayBuffer();
        }catch(e){
          return b.arrayBuffer();
        }
      });
    } catch(e){
      return origArrayBuffer.apply(this, args);
    }
  };

  // --- mini panneau (facultatif) ---
  function addPanel(){
    if (document.getElementById('__tile_blackout_panel2')) return;
    const wrap = document.createElement('div');
    wrap.id='__tile_blackout_panel2';
    wrap.innerHTML = `
      <div style="position:fixed;left:12px;top:12px;z-index:2147483647;background:rgba(0,0,0,.85);color:#eee;border:1px solid rgba(255,255,255,.15);border-radius:10px;box-shadow:0 6px 18px rgba(0,0,0,.35);padding:8px;min-width:220px;font:12px system-ui;user-select:none;cursor:default">
        <div id="__tb_title" style="font-weight:600;margin-bottom:6px;text-align:center;cursor:move">Constrat Tile</div>
        <div style="display:flex;gap:6px;margin:6px 0">
          <button data-k="tile_blackout" data-v="off">OFF</button>
          <button data-k="tile_blackout" data-v="on">ON</button>
          <button data-k="tile_blackout_color" data-v="black">Black</button>
          <button data-k="tile_blackout_color" data-v="white">White</button>
        </div>
        <div id="__tb_hint" style="opacity:.9;min-height:14px;text-align:center"></div>
      </div>`;
    document.documentElement.appendChild(wrap);
    wrap.querySelectorAll('button').forEach(b=>{
      Object.assign(b.style,{flex:'1',padding:'6px 8px',borderRadius:'8px',border:'1px solid rgba(255,255,255,.2)',background:'rgba(255,255,255,.08)',color:'#eee',cursor:'pointer'});
      b.onmouseenter=()=>b.style.background='rgba(255,255,255,.15)';
      b.onmouseleave=()=>b.style.background='rgba(255,255,255,.08)';
    });
    const root = wrap.firstElementChild, title=root.querySelector('#__tb_title');
    const hint = root.querySelector('#__tb_hint');
    const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
    let drag=null;
    title.addEventListener('mousedown', e=>{ drag={dx:e.clientX-root.offsetLeft, dy:e.clientY-root.offsetTop}; e.preventDefault(); });
    document.addEventListener('mousemove', e=>{ if(!drag) return; const x=clamp(e.clientX-drag.dx,0,window.innerWidth-root.offsetWidth); const y=clamp(e.clientY-drag.dy,0,window.innerHeight-root.offsetHeight); root.style.left=x+'px'; root.style.top=y+'px'; });
    document.addEventListener('mouseup', ()=>drag=null);
    function refresh(){ hint.textContent = `Etat: ${(localStorage.getItem('tile_blackout')||'off').toUpperCase()} • Couleur: ${(localStorage.getItem('tile_blackout_color')||'black').toUpperCase()} — pan/zoom pour recharger.`; }
    root.addEventListener('click', e=>{ const btn=e.target.closest('button'); if(!btn) return; localStorage.setItem(btn.getAttribute('data-k'), btn.getAttribute('data-v')); refresh(); });
    refresh();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', addPanel); else addPanel();

})();
