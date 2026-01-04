// ==UserScript==
// @name         Chat Deck — 5x3 (images)
// @namespace    aravvn.tools
// @version      3.4.0
// @description  5x3 square deck;
// @author       aravvn
// @match        https://chaturbate.com/*
// @match        https://*.chaturbate.com/*
// @match        https://www.testbed.cb.dev/*
// @exclude      https://chaturbate.com/
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @icon         https://chaturbate.com/favicon.ico
// @license      CC-BY-NC-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/551397/Chat%20Deck%20%E2%80%94%205x3%20%28images%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551397/Chat%20Deck%20%E2%80%94%205x3%20%28images%29.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /* ---------- storage keys ---------- */
  const K_ROOMS  = 'chatdeck.rooms.v3'; // bump: now includes {img}
  const K_UI     = 'chatdeck.ui.v3';
  const K_KEYS   = 'chatdeck.keys.v1';

  /* ---------- utils ---------- */
  const S = {
    get: (k,d)=>Promise.resolve(GM_getValue(k,d)),
    set: (k,v)=>Promise.resolve(GM_setValue(k,v)),
    el: (t,o={})=>Object.assign(document.createElement(t), o),
    clamp:(n,a,b)=>Math.max(a,Math.min(b,n)),
    nowTime:()=>new Date().toLocaleTimeString()
  };
  const qs = (sel,root=document)=>root.querySelector(sel);
  const esc = (s)=> (s??'').toString().replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const EMPTY15 = () => Array.from({length:15}, ()=>({label:'', text:'', img:''}));

  /* ---------- image helpers ---------- */
  async function fileToDataUrl(file){
    const buf = await file.arrayBuffer();
    const blob = new Blob([buf], {type: file.type || 'application/octet-stream'});
    return await new Promise(res=>{
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.readAsDataURL(blob);
    });
  }
  async function resizeImageDataURL(dataURL, maxSide=320, quality=0.85){
    // draw to canvas and export JPEG (unless original is webp and smaller side)
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const p = new Promise((resolve, reject)=>{
      img.onload = () => resolve();
      img.onerror = reject;
    });
    img.src = dataURL;
    await p;
    const {width:w, height:h} = img;
    const scale = Math.min(1, maxSide / Math.max(w,h));
    const tw = Math.max(1, Math.round(w * scale));
    const th = Math.max(1, Math.round(h * scale));
    const can = document.createElement('canvas');
    can.width = tw; can.height = th;
    const ctx = can.getContext('2d', {alpha: false});
    ctx.drawImage(img, 0, 0, tw, th);
    // prefer JPEG to keep size tiny; if you want WebP, switch mime below
    return can.toDataURL('image/jpeg', quality);
  }
  async function fileToSmallDataUrl(file){
    const raw = await fileToDataUrl(file);
    // if already tiny (<150KB), keep; else downscale
    const estSize = Math.ceil((raw.length * 3) / 4); // base64 to bytes approx
    if (estSize < 150 * 1024) return raw;
    return await resizeImageDataURL(raw, 320, 0.85);
  }

  /* ---------- defaults ---------- */
  const DEFAULT_UI = {
    x: 20, y: 80,
    opacity: 0.20,
    hoverOpacity: 0.99,
    zIndex: 2147483646,
    gap: 6,
    cellMin: 96,
    fontSize: 12,
    minimized: false,
    idleScale: 0.90,
    hoverScale: 1.00,
    hotkeysEnabled: true
  };
  const DEFAULT_KEYS = Array.from({ length: 15 }, () => null);

  /* ---------- state ---------- */
  let UI, ROOMS, KEYS, ROOM, DATA, HOTKEYS;
  let root, shadow;

  /* ---------- hotkey helpers ---------- */
  function hk(code, ctrl=false, alt=false, shift=false, meta=false){
    return { code, ctrl, alt, shift, meta };
  }
  function codeToHuman(code){ if(!code) return ''; return code.replace(/^Key/,'').replace(/^Digit/,''); }
  function hotkeyToText(h){
    if(!h) return '—';
    const mods=[];
    if(h.ctrl) mods.push('Ctrl');
    if(h.alt) mods.push('Alt');
    if(h.shift) mods.push('Shift');
    if(h.meta) mods.push(navigator.platform.includes('Mac')?'⌘':'Meta');
    const base = h.code ? codeToHuman(h.code) : '';
    return (mods.concat([base]).filter(Boolean)).join('+') || '—';
  }
  function matchHotkey(e, h){
    if(!h) return false;
    return (
      !!e.code && e.code === h.code &&
      (!!e.ctrlKey)  === !!h.ctrl &&
      (!!e.altKey)   === !!h.alt &&
      (!!e.shiftKey) === !!h.shift &&
      (!!e.metaKey)  === !!h.meta
    );
  }

  /* ---------- room detection ---------- */
  function detectRoom(){
    const parts = location.pathname.replace(/^\/+|\/+$/g, '').split('/');
    if (!parts[0]) return '';
    if (parts[0]==='b') return parts[1]||'';
    return parts[0];
  }

  /* ---------- CSRF + username ---------- */
  function getCSRF(){
    const m = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
    if (m) return decodeURIComponent(m[1]);
    const inp = document.querySelector('input[name="csrfmiddlewaretoken"]');
    if (inp?.value) return inp.value;
    const meta = document.querySelector('meta[name="csrf-token"], meta[name="csrfmiddlewaretoken"]');
    if (meta?.content) return meta.content;
    return '';
  }
  function getUsername(){
    const cookieMap = Object.fromEntries(document.cookie.split(';').map(s=>{
      const i=s.indexOf('='); if(i<0) return [s.trim(),''];
      return [decodeURIComponent(s.slice(0,i).trim()), decodeURIComponent(s.slice(i+1))];
    }));
    for (const k of ['username','cb_username','cb_user']) if (cookieMap[k]) return cookieMap[k];
    try{
      const w=window;
      if (w.CB?.user?.username) return String(w.CB.user.username);
      if (w.user?.username) return String(w.user.username);
      if (w.username) return String(w.username);
      if (w.currentUser?.username) return String(w.currentUser.username);
    }catch{}
    const el = document.querySelector('[data-username],[data-user-name]');
    if (el?.dataset?.username) return el.dataset.username;
    if (el?.dataset?.userName) return el.dataset.userName;
    return '';
  }

  /* ---------- API send (push_service only) ---------- */
  async function sendMessage(text){
    if (!text) return;
    const csrf = getCSRF();
    ROOM = detectRoom();
    if (!ROOM) { alert('ChatDeck: cannot detect room from URL.'); return; }
    if (!csrf) { alert('ChatDeck: CSRF token not found.'); return; }

    const body = new URLSearchParams();
    body.set('room', ROOM);
    body.set('message', JSON.stringify({ m: text.replace(/\{time\}/g, S.nowTime()) }));
    const user = getUsername(); if (user) body.set('username', user);
    body.set('csrfmiddlewaretoken', csrf);

    const res = await fetch('/push_service/publish_chat_message_live/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-CSRFToken': csrf,
        'X-Requested-With': 'XMLHttpRequest',
      },
      body
    });
    if (!res.ok){
      const t=await res.text().catch(()=>String(res.status));
      alert('ChatDeck: push_service error: ' + res.status);
      console.error('[ChatDeck] push_service error:', res.status, t?.slice(0,300));
    }
  }

  /* ---------- UI ---------- */
  function ensureUI(){
    if (root) return;
    root=S.el('div'); root.attachShadow({mode:'open'}); shadow=root.shadowRoot; document.documentElement.appendChild(root);
    const style=S.el('style'); shadow.append(style);

    const wrap=S.el('div',{id:'deck'}); shadow.append(wrap);
    const fab=S.el('button',{id:'fab', title:'Open Chat Deck'}); fab.textContent='Chat Deck';
    shadow.append(fab);

    wrap.innerHTML = `
      <div id="hdr">
        <span class="title">Chat Deck</span>
        <div class="actions">
          <button id="hotkeysBtn" title="Edit hotkeys for this room">Hotkeys</button>
          <button id="editRoom"   title="Edit labels/texts/images for this room">Edit Room</button>
          <button id="copyDefault" title="Copy default into this room">Copy Default Here</button>
          <button id="saveDefault" title="Use this room setup as default">Use as Default</button>
          <button id="minBtn"     title="Minimize">—</button>
        </div>
      </div>
      <div id="grid"></div>
    `;

    wireDrag(wrap, qs('#hdr', shadow));

    // handlers
    qs('#hotkeysBtn', shadow).onclick = openHotkeyEditor;
    qs('#editRoom',   shadow).onclick = openEditorForRoom;
    qs('#copyDefault',shadow).onclick = copyDefaultHere;
    qs('#saveDefault',shadow).onclick = saveAsDefault;
    qs('#minBtn',     shadow).onclick = minimize;
    fab.onclick = restore;

    renderAll();
    applyMinimized();
    registerMenu();
    window.addEventListener('keydown', onKeyDown, true);
  }

  function css(){
    const u=UI, gap=u.gap, fs=u.fontSize, cellMin=u.cellMin;
    return `
:host{ all:initial }
#deck{
  position:fixed; top:${u.y}px; left:${u.x}px;
  z-index:${u.zIndex};
  font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;
  color:#e5e7eb; user-select:none;
  border-radius:12px;
  opacity:${u.opacity};
  transform: scale(${u.idleScale});
  transform-origin: top left;
  background: rgba(0,0,0,.06);
  border: 1px dashed rgba(255,255,255,.14);
  transition: opacity .14s ease, transform .14s ease, box-shadow .14s ease, background .14s ease, border-color .14s ease;
}
#deck:hover{
  opacity:${u.hoverOpacity};
  transform: scale(${u.hoverScale});
  background: rgba(0,0,0,.65);
  border-color: rgba(255,255,255,.22);
  box-shadow: 0 16px 44px rgba(0,0,0,.38);
}
:host([data-min]) #deck{ display:none; }

/* FAB */
#fab{
  position:fixed; right:16px; bottom:16px;
  display:none;
  padding:8px 12px; font-size:12px;
  background: rgba(0,0,0,.70);
  color:#e5e7eb; border:1px solid rgba(255,255,255,.28);
  border-radius:999px; cursor:pointer; z-index:${u.zIndex};
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
}
#fab:hover{ background: rgba(0,0,0,.84); }
:host([data-min]) #fab{ display:block; }

/* Header */
#hdr{
  display:flex; align-items:center; justify-content:space-between;
  padding:6px 8px; margin-bottom:${gap}px;
  background: rgba(0,0,0,.14);
  border: 1px solid rgba(255,255,255,.12);
  border-radius:10px;
  cursor:move;
}
#deck:hover #hdr{
  background: rgba(255,255,255,.06);
  border-color: rgba(255,255,255,.24);
}

/* Controls */
#hdr .actions button{
  margin-left:6px; padding:3px 8px; font-size:12px;
  background: rgba(0,0,0,.35); color:#e5e7eb;
  border:1px solid rgba(255,255,255,.18); border-radius:8px; cursor:pointer;
}
#hdr .actions button:hover{ background: rgba(0,0,0,.55); }

/* Grid */
#grid{
  display:grid;
  grid-template-columns: repeat(5, minmax(${cellMin}px, 1fr));
  gap:${gap}px;
  padding:${gap}px;
  background: rgba(255,255,255,.04);
  border: 1px dashed rgba(255,255,255,.12);
  border-radius:12px;
  width: max-content;
  max-width: 95vw;
  transition: background .14s ease, border-color .14s ease;
}
#deck:hover #grid{
  background: rgba(255,255,255,.08);
  border-color: rgba(255,255,255,.22);
}

/* Buttons */
.btn{
  position:relative;
  display:flex; align-items:center; justify-content:center;
  aspect-ratio: 1 / 1;
  min-width:${cellMin}px;
  font-size:${fs}px; text-align:center;
  background: rgba(51,65,85,.22);
  color:#f1f5f9;
  border:1px solid rgba(255,255,255,.12);
  border-radius:10px;
  padding:6px; box-sizing:border-box;
  cursor:pointer;
  transition: background .12s ease, border-color .12s ease, transform .06s, box-shadow .12s ease;
  overflow:hidden;
  -webkit-mask-image:-webkit-radial-gradient(white, black);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
#deck:hover .btn{
  background-color: rgba(51,65,85,.34);
  border-color: rgba(255,255,255,.20);
}
.btn:hover{
  background-color: rgba(51,65,85,.78);
  border-color: rgba(255,255,255,.42);
  box-shadow: 0 6px 16px rgba(0,0,0,.35);
}
.btn:active{ transform: scale(.98); }

.btn.hasimg{
  color:#f8fafc;
}
.btn::before{
  content:"";
  position:absolute; inset:0;
  background: linear-gradient(to top, rgba(0,0,0,.55), rgba(0,0,0,.10));
  pointer-events:none;
  opacity:0; transition:opacity .12s ease;
}
#deck:hover .btn.hasimg::before{ opacity:1; }

.btn .name{
  position:relative;
  z-index:1;
  pointer-events:none;
  display:block;
  line-height:1.15;
  max-width:100%;
  max-height:90%;
  word-break:break-word;
  overflow:hidden;
  text-shadow: 0 1px 2px rgba(0,0,0,.6);
}

/* Modal (shared) */
.modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:2147483647}
.modal{ width:min(920px,96vw);max-height:90vh;overflow:auto;background:#0b1324;color:#e5e7eb;border:1px solid #334155;border-radius:12px;padding:16px }
.modal h2{margin:0 0 10px}
.modal .grid15{ display:grid; grid-template-columns: repeat(5, 1fr); gap:8px; }
.tile{ background:#0b1426; border:1px solid #1f2940; border-radius:10px; padding:8px; }
.tile label{ display:block; font-size:11px; opacity:.8; margin-bottom:4px }
.tile input, .tile textarea{ width:100%; box-sizing:border-box; background:#091021; color:#e5e7eb; border:1px solid #334155; border-radius:8px; padding:6px 8px; font-family:inherit }
.tile input{ margin-bottom:6px }
.tile textarea{ height:64px; resize:vertical }
.modal .actions{display:flex;gap:8px;justify-content:flex-end;margin-top:12px}
.modal button{background:#0b1324;color:#e5e7eb;border:1px solid #334155;border-radius:8px;padding:6px 10px;cursor:pointer}
.modal .danger{border-color:#7f1d1d;color:#fecaca}

/* Hotkey editor */
.hkrow{ display:flex; align-items:center; justify-content:space-between; background:#0b1426; border:1px solid #1f2940; border-radius:10px; padding:8px; }
.hkname{ font-weight:600; opacity:.9 }
.hklabel{ font-family:monospace; background:#111827; border:1px solid #374151; border-radius:6px; padding:4px 8px; font-size:12px; }

/* Image picker in tiles */
.imgpick{ display:flex; align-items:center; gap:6px; margin-top:6px; }
.imgpick input[type="file"]{ padding:4px 6px; }
.thumb{ width:100%; height:72px; object-fit:cover; border:1px solid #334155; border-radius:8px; background:#0a0f1e; }
.clearbtn{ margin-left:auto; }
`;
  }

  function ensureDataShape(arr){
    if (!Array.isArray(arr)) return EMPTY15();
    if (arr.length !== 15) arr = Array.from({length:15}, (_,i)=>arr[i] ?? {label:'', text:'', img:''});
    if (typeof arr[0] === 'string'){
      return arr.map((t,i)=>({label: t ? `Button ${i+1}` : '', text: String(t), img:''}));
    }
    return arr.map((o,i)=>({
      label: o?.label ?? (o?.text ? `Button ${i+1}` : ''),
      text:  o?.text ?? '',
      img:   o?.img ?? ''
    }));
  }
  function ensureKeysShape(arr){
    if (!Array.isArray(arr)) return Array.from({length:15}, (_,i)=>DEFAULT_KEYS[i] ?? null);
    const out = Array.from({length:15}, (_,i)=>arr[i] ?? null);
    return out.map(h=>{
      if (!h) return null;
      if (typeof h.code !== 'string') return null;
      return { code: h.code, ctrl:!!h.ctrl, alt:!!h.alt, shift:!!h.shift, meta:!!h.meta };
    });
  }

  function renderAll(){
    const style = qs('style', shadow); style.textContent = css();
    const deck = qs('#deck', shadow);
    deck.style.top = UI.y+'px';
    deck.style.left= UI.x+'px';
    renderGrid();
  }

  function renderGrid(){
    const grid = qs('#grid', shadow); grid.innerHTML='';
    DATA.forEach((it, i)=>{
      const el=S.el('div',{className:'btn', title:`${hotkeyToText(HOTKEYS[i])} — Click=send • Shift+Click=edit`});
      const span=S.el('span',{className:'name'});
      span.textContent = it.label || `Button ${i+1}`;

      if (it.img){
        el.classList.add('hasimg');
        // two-layer bg: gradient handled by ::before, here we just set the image
        el.style.backgroundImage = `url(${it.img})`;
      }else{
        el.style.backgroundImage = '';
      }

      el.append(span);
      el.addEventListener('click', (e)=>{
        if (e.shiftKey){ openSingleEditor(i); return; }
        sendMessage(it.text);
      });
      grid.append(el);
    });
  }

  /* ---------- modal base ---------- */
  function modal(){
    const back=S.el('div',{className:'modal-backdrop'});
    const box=S.el('div',{className:'modal'});
    back.append(box);
    return { box, mount(){ shadow.append(back); }, unmount(){ back.remove(); } };
  }

  /* ---------- single editor ---------- */
  function openSingleEditor(idx){
    const {box, mount, unmount} = modal();
    const it = DATA[idx] || {label:'', text:'', img:''};
    box.innerHTML = `
      <h2>Edit Button ${idx+1} — Room “${esc(ROOM)}”</h2>
      <div class="tile">
        <label>Label (shown on button)</label>
        <input id="lbl" value="${esc(it.label)}" placeholder="Button ${idx+1}">
        <label>Text to send (supports {time})</label>
        <textarea id="txt" rows="4" placeholder="Enter message...">${esc(it.text)}</textarea>
        <label>Background image (optional, stored locally)</label>
        <img id="thumb" class="thumb" src="${it.img?esc(it.img):''}" alt="">
        <div class="imgpick">
          <input id="file" type="file" accept="image/*">
          <button id="clearImg" class="danger clearbtn" ${it.img?'':'disabled'}>Clear Image</button>
        </div>
      </div>
      <div class="actions">
        <button id="cancel">Cancel</button>
        <button id="save">Save</button>
      </div>
    `;
    mount();

    const $file = box.querySelector('#file');
    const $thumb= box.querySelector('#thumb');
    const $clear= box.querySelector('#clearImg');
    let newImg = it.img || '';

    $file.onchange = async (e)=>{
      const f = e.target.files?.[0];
      if (!f) return;
      try{
        const small = await fileToSmallDataUrl(f);
        newImg = small;
        $thumb.src = small;
        $clear.disabled = false;
      }catch(err){
        alert('Failed to load image');
        console.error(err);
      }
    };
    $clear.onclick = ()=>{
      newImg = '';
      $thumb.removeAttribute('src');
      $clear.disabled = true;
    };

    box.querySelector('#cancel').onclick = unmount;
    box.querySelector('#save').onclick = async ()=>{
      const lbl = box.querySelector('#lbl').value.trim();
      const txt = box.querySelector('#txt').value;
      DATA[idx] = { label: lbl, text: txt, img: newImg };
      ROOMS[ROOM] = DATA.slice();
      await S.set(K_ROOMS, ROOMS);
      renderGrid(); unmount();
    };
  }

  /* ---------- room editor ---------- */
  function openEditorForRoom(){
    const {box, mount, unmount} = modal();
    const tiles = DATA.map((it,i)=>`
      <div class="tile" data-i="${i}">
        <label>Button ${i+1} — Label</label>
        <input data-k="label" value="${esc(it.label)}" placeholder="Button ${i+1}">
        <label>Text (supports {time})</label>
        <textarea data-k="text" placeholder="Message to send...">${esc(it.text)}</textarea>
        <label>Background image (optional)</label>
        <img class="thumb" data-role="thumb" src="${it.img?esc(it.img):''}" alt="">
        <div class="imgpick">
          <input type="file" accept="image/*" data-role="file">
          <button class="danger clearbtn" data-role="clear" ${it.img?'':'disabled'}>Clear</button>
        </div>
      </div>
    `).join('');
    box.innerHTML = `
      <h2>Edit Room “${esc(ROOM)}”</h2>
      <div class="grid15">${tiles}</div>
      <div class="actions">
        <button id="cancel">Cancel</button>
        <button id="clear" class="danger">Clear All</button>
        <button id="save">Save</button>
      </div>
    `;
    mount();

    // image handlers per tile
    box.querySelectorAll('.tile').forEach(tile=>{
      const i = +tile.dataset.i;
      const file = tile.querySelector('[data-role="file"]');
      const clear= tile.querySelector('[data-role="clear"]');
      const thumb= tile.querySelector('[data-role="thumb"]');

      file.onchange = async (e)=>{
        const f = e.target.files?.[0];
        if (!f) return;
        try{
          const small = await fileToSmallDataUrl(f);
          thumb.src = small;
          clear.disabled = false;
          // keep in temp Data until Save
          DATA[i] = {...DATA[i], img: small};
        }catch(err){
          alert('Failed to load image');
          console.error(err);
        }
      };
      clear.onclick = ()=>{
        thumb.removeAttribute('src');
        clear.disabled = true;
        DATA[i] = {...DATA[i], img: ''};
      };
    });

    box.querySelector('#cancel').onclick = unmount;
    box.querySelector('#clear').onclick = ()=> {
      box.querySelectorAll('input[data-k="label"]').forEach(i=>i.value='');
      box.querySelectorAll('textarea[data-k="text"]').forEach(t=>t.value='');
      box.querySelectorAll('[data-role="thumb"]').forEach(img=>img.removeAttribute('src'));
      box.querySelectorAll('[data-role="clear"]').forEach(b=>b.disabled=true);
      DATA = DATA.map(()=>({label:'', text:'', img:''}));
    };
    box.querySelector('#save').onclick = async ()=>{
      const next = DATA.map(x=>({...x}));
      box.querySelectorAll('.tile').forEach(tile=>{
        const i = +tile.dataset.i;
        const lbl = tile.querySelector('input[data-k="label"]').value.trim();
        const txt = tile.querySelector('textarea[data-k="text"]').value;
        const imgEl = tile.querySelector('[data-role="thumb"]');
        next[i].label = lbl;
        next[i].text  = txt;
        next[i].img   = imgEl?.getAttribute('src') || next[i].img || '';
      });
      DATA = next;
      ROOMS[ROOM] = DATA.slice();
      await S.set(K_ROOMS, ROOMS);
      renderGrid(); unmount();
    };
  }

  /* ---------- hotkey editor ---------- */
  function openHotkeyEditor(){
    const {box, mount, unmount} = modal();
    const rows = HOTKEYS.map((h,i)=>`
      <div class="hkrow" data-i="${i}">
        <span class="hkname">Btn ${i+1}</span>
        <span class="hklabel" data-role="label">${esc(hotkeyToText(h))}</span>
        <span>
          <button data-role="set">Set</button>
          <button data-role="clr">Clear</button>
        </span>
      </div>
    `).join('');
    box.innerHTML = `
      <h2>Hotkeys — Room “${esc(ROOM)}”</h2>
      <div class="grid15">${rows}</div>
      <div class="actions">
        <button id="cancel">Close</button>
        <button id="defaults">Use Default Mapping</button>
        <button id="save">Save</button>
      </div>
      <div class="small" style="opacity:.8;margin-top:6px">
        Tip: Hold modifiers (Ctrl/Alt/Shift/${navigator.platform.includes('Mac')?'⌘':'Meta'}) and press a key. Press Esc to cancel capture.
      </div>
    `;
    mount();

    let capturing = null;
    function onCapKey(e){
      if (!capturing) return;
      e.preventDefault(); e.stopPropagation();
      const {row, label} = capturing;
      if (e.key === 'Escape'){ stopCap(); return; }
      if (/^(Shift|Control|Alt|Meta)/.test(e.code)) return;
      const h = { code: e.code, ctrl:e.ctrlKey, alt:e.altKey, shift:e.shiftKey, meta:e.metaKey };
      HOTKEYS[row] = h;
      label.textContent = hotkeyToText(h);
      stopCap();
    }
    function stopCap(){
      window.removeEventListener('keydown', onCapKey, true);
      capturing = null;
    }

    box.querySelectorAll('.hkrow').forEach(rowEl=>{
      const i = +rowEl.dataset.i;
      const setBtn = rowEl.querySelector('[data-role="set"]');
      const clrBtn = rowEl.querySelector('[data-role="clr"]');
      const label  = rowEl.querySelector('[data-role="label"]');
      setBtn.onclick = ()=>{
        if (capturing) return;
        capturing = { row: i, label };
        label.textContent = 'Press keys… (Esc cancel)';
        window.addEventListener('keydown', onCapKey, true);
      };
      clrBtn.onclick = ()=>{
        HOTKEYS[i] = null;
        label.textContent = '—';
      };
    });

    box.querySelector('#defaults').onclick = ()=>{
      HOTKEYS = DEFAULT_KEYS.slice();
      box.querySelectorAll('.hkrow').forEach((rowEl,idx)=>{
        rowEl.querySelector('[data-role="label"]').textContent = hotkeyToText(HOTKEYS[idx]);
      });
    };

    box.querySelector('#cancel').onclick = ()=>{ stopCap(); unmount(); };
    box.querySelector('#save').onclick = async ()=>{
      stopCap();
      KEYS[ROOM] = HOTKEYS.slice();
      await S.set(K_KEYS, KEYS);
      renderGrid();
      unmount();
    };
  }

  /* ---------- default copy/save ---------- */
  async function copyDefaultHere(){
    const defData = ensureDataShape(ROOMS._default ?? EMPTY15());
    const defKeys = ensureKeysShape(KEYS._default ?? DEFAULT_KEYS);

    ROOMS[ROOM] = defData.slice();
    DATA = ensureDataShape(ROOMS[ROOM]);

    KEYS[ROOM]  = defKeys.slice();
    HOTKEYS = ensureKeysShape(KEYS[ROOM]);

    await S.set(K_ROOMS, ROOMS);
    await S.set(K_KEYS,  KEYS);
    renderGrid();
  }
  async function saveAsDefault(){
    ROOMS._default = DATA.slice();
    KEYS._default  = HOTKEYS.slice();
    await S.set(K_ROOMS, ROOMS);
    await S.set(K_KEYS,  KEYS);
    alert('Saved this room as default (labels/texts/images + hotkeys).');
  }

  /* ---------- hotkey runtime ---------- */
  function onKeyDown(e){
    if (!UI?.hotkeysEnabled) return;
    const t = e.target;
    const insideShadow = shadow && shadow.contains(t);
    const isEditable = t?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/i.test(t?.tagName||'');
    if (isEditable && !insideShadow) return;

    for (let i=0;i<15;i++){
      const h = HOTKEYS[i];
      if (h && matchHotkey(e, h)){
        e.preventDefault(); e.stopPropagation();
        const it = DATA[i];
        if (it) sendMessage(it.text);
        break;
      }
    }
  }

  /* ---------- minimize / restore ---------- */
  function minimize(){ UI.minimized = true;  saveUI(); applyMinimized(); }
  function restore(){  UI.minimized = false; saveUI(); applyMinimized(); }
  function applyMinimized(){
    if (UI.minimized) shadow.host.setAttribute('data-min','');
    else shadow.host.removeAttribute('data-min');
  }

  /* ---------- drag move ---------- */
  function wireDrag(container, handle){
    let sx=0, sy=0, ox=0, oy=0, dragging=false;
    handle.addEventListener('mousedown', e=>{
      dragging=true; sx=e.clientX; sy=e.clientY; ox=UI.x; oy=UI.y; e.preventDefault();
    });
    window.addEventListener('mousemove', e=>{
      if(!dragging) return;
      UI.x = S.clamp(ox+(e.clientX-sx), 0, window.innerWidth-100);
      UI.y = S.clamp(oy+(e.clientY-sy), 0, window.innerHeight-60);
      const deck = qs('#deck', shadow);
      deck.style.left = UI.x+'px';
      deck.style.top  = UI.y+'px';
    });
    window.addEventListener('mouseup', async()=>{ if(dragging){ dragging=false; await saveUI(); } });
  }

  /* ---------- storage ---------- */
  async function loadAll(){
    UI    = await S.get(K_UI, DEFAULT_UI);
    // migrate old rooms without img to new shape
    const oldRooms = await S.get('chatdeck.rooms.v2', null);
    const fallback = oldRooms ? ensureDataShape(oldRooms) : EMPTY15();
    ROOMS = await S.get(K_ROOMS, { _default: fallback });
    KEYS  = await S.get(K_KEYS,  { _default: DEFAULT_KEYS.slice() });

    ROOM  = detectRoom() || '_site';
    DATA  = ensureDataShape(ROOMS[ROOM] ?? ROOMS._default ?? EMPTY15());
    HOTKEYS = ensureKeysShape(KEYS[ROOM] ?? KEYS._default ?? DEFAULT_KEYS);

    // if we migrated, persist v3 so we stop reading v2 next time
    if (oldRooms && !await S.get(K_ROOMS, null)) {
      await S.set(K_ROOMS, { _default: fallback, [ROOM]: DATA });
    }
  }
  async function saveUI(){ await S.set(K_UI, UI); }

  /* ---------- menu ---------- */
  function registerMenu(){
    try{
      GM_registerMenuCommand('Show Chat Deck', ()=>{ UI.minimized=false; applyMinimized(); }, 's');
      GM_registerMenuCommand('Edit current room', ()=>openEditorForRoom(), 'e');
      GM_registerMenuCommand('Edit hotkeys', ()=>openHotkeyEditor(), 'h');
      GM_registerMenuCommand('Use this room as default', ()=>saveAsDefault(), 'd');
      GM_registerMenuCommand('Copy default here', ()=>copyDefaultHere(), 'c');

      GM_registerMenuCommand(UI.hotkeysEnabled?'Disable hotkeys':'Enable hotkeys', async()=>{
        UI.hotkeysEnabled = !UI.hotkeysEnabled; await saveUI();
        alert('Hotkeys ' + (UI.hotkeysEnabled?'enabled':'disabled'));
      }, 'k');

      GM_registerMenuCommand('Idle scale 0.85', async()=>{ UI.idleScale=0.85; await saveUI(); renderAll(); }, '5');
      GM_registerMenuCommand('Idle scale 0.90', async()=>{ UI.idleScale=0.90; await saveUI(); renderAll(); }, '6');
      GM_registerMenuCommand('Idle scale 0.95', async()=>{ UI.idleScale=0.95; await saveUI(); renderAll(); }, '7');

      GM_registerMenuCommand('Squares 90px',  async()=>{ UI.cellMin=90;  await saveUI(); renderAll(); }, '1');
      GM_registerMenuCommand('Squares 96px',  async()=>{ UI.cellMin=96;  await saveUI(); renderAll(); }, '2');
      GM_registerMenuCommand('Squares 110px', async()=>{ UI.cellMin=110; await saveUI(); renderAll(); }, '3');

      GM_registerMenuCommand('Increase idle opacity', async()=>{ UI.opacity = S.clamp(UI.opacity+0.05, 0.05, 1); await saveUI(); renderAll(); }, '+');
      GM_registerMenuCommand('Decrease idle opacity', async()=>{ UI.opacity = S.clamp(UI.opacity-0.05, 0.05, 1); await saveUI(); renderAll(); }, '-');
    }catch{}
  }

  /* ---------- init ---------- */
  (async function init(){
    await loadAll();
    ensureUI();
  })();

})();
