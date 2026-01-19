// ==UserScript==
// @name         Autodarts Chat Macro – Overlay Panel v4.5
// @namespace    v4.5 @frankomio @ dart-base.de
// @version      4.5
// @description  An Overlay for adding up to 15 new predefined Texts to chat per Hotkey or Mouse
// @match        https://play.autodarts.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562681/Autodarts%20Chat%20Macro%20%E2%80%93%20Overlay%20Panel%20v45.user.js
// @updateURL https://update.greasyfork.org/scripts/562681/Autodarts%20Chat%20Macro%20%E2%80%93%20Overlay%20Panel%20v45.meta.js
// ==/UserScript==

(function () {
'use strict';

/* ================= CONFIG ================= */

const SCRIPT_VERSION = '4.5';
const CHAT_BUTTON_SELECTOR = '.chakra-button.css-amgk2y';
const CHAT_INPUT_SELECTOR  = 'input.chakra-input.css-145kn5z';
const STORE_KEY = 'autodarts_macro_v43_final';
const COOLDOWN_MS = 990;

const SNAP_POINTS = ['br','b','bl','l','tl','t','tr','r'];

/* ===== Dart-Base Logo ===== */
const DARTBASE_LOGO =
"https://dart-base.de/ext/planetstyles/flightdeck/store/Logo_007_924x924_rot_gruen_schwarz_transparent.png";

/* ================= UI ENHANCEMENTS ================= */

//const BTN_STYLE = ` font-size:17px; padding:10px 16px; min-height:44px; cursor:pointer;`;
// button touchtauglich//
    const BTN_STYLE = `
 font-size:18px;          /* gut lesbar auf Touch */
 padding:12px 18px;       /* große Klickfläche */
 min-height:48px;         /* Finger-Zielgröße (UX Standard) */
 border-radius:10px;      /* angenehm rund */
 line-height:1.2;
 cursor:pointer;
 touch-action:manipulation;
`;


const ICON_STYLE = `
 font-size:20px;
 cursor:pointer;
 user-select:none;
 padding:4px;
`;

const HOVER_CSS = `
 .macro-btn:hover { filter:brightness(1.15); }
 .icon-btn:hover  { transform:scale(1.15); }
 .preset-active   { outline:2px solid #2cff2c; }

.rebind-active {
  outline: 2px dashed #ffd400;
  background: rgba(255, 212, 0, 0.08);
  border-radius: 6px;
}


 .preview-outline {
   position:fixed;
   pointer-events:none;
   border:2px dashed rgba(255,255,255,0.9);
   border-radius:12px;
   z-index:9998;
   opacity:0;
   transition: opacity .25s ease;
   animation: dashMove 1.2s linear infinite;
 }

 .preview-outline.visible {
   opacity:1;
 }

 .preview-label {
   position:absolute;
   top:-18px;
   left:6px;
   font-size:11px;
   padding:2px 6px;
   border-radius:6px;
   background:rgba(0,0,0,0.75);
   color:#fff;
   pointer-events:none;
   white-space:nowrap;
 }

 @keyframes dashMove {
   from { border-dashoffset:0; }
   to   { border-dashoffset:16; }
 }
`;


/* ================= DEFAULT PRESET ================= */

function defaultPreset(){
 return {
  hotkeys:{
    6:'Wanna know more about good cam pictures? VISIT www.dart-base.de',
    7:'Auf www.dart-base.de helfen wir Dir, Dein Setup zu optimieren',
    8:'Für eine bessere Erkennung und Bildqualität, besuche www.dart-base.de',
    9:'Session will be recorded 📹',
    0:'Schönes, faires Spiel 👍🤝'
  },
  snap:null,
  x:null,y:null,
  scale:1,
  opacity:0.5,
  locked:false,
  bg:'#215294',
  text:'#ffffff',
  btn:'#2d2d2d',
  theme:'dark',
  sound:true
 };
}

/* ================= STATE ================= */

let mainOverlayRect = null;
let overlay, lastTrigger=0, lastReadyBeep=true, waitingRebind=null;
let ledState='ready';
let drag=null, moved=false;

let state={
 activePreset:0,
 minimized:true,
 hidden:false,
 settingsOpen:false,
 presets:[defaultPreset(),defaultPreset(),defaultPreset()]
};

/* ================= STORAGE ================= */

function load(){
 const s=localStorage.getItem(STORE_KEY);
 if(s) state=JSON.parse(s);
}
function save(){
 localStorage.setItem(STORE_KEY,JSON.stringify(state));
}

/* ================= UTILS ================= */

const sleep=ms=>new Promise(r=>setTimeout(r,ms));

function waitForElement(sel,t=5000){
 return new Promise((res,rej)=>{
  const s=Date.now(),i=setInterval(()=>{
   const e=document.querySelector(sel);
   if(e){clearInterval(i);res(e);}
   else if(Date.now()-s>t){clearInterval(i);rej();}
  },120);
 });
}

function simulateKey(key){
 document.dispatchEvent(new KeyboardEvent('keydown',{key,code:'Key'+key.toUpperCase(),bubbles:true}));
 document.dispatchEvent(new KeyboardEvent('keyup',{key,code:'Key'+key.toUpperCase(),bubbles:true}));
}

function findSendButton(){
 return [...document.querySelectorAll('button')]
   .find(b=>b.textContent?.trim().toLowerCase()==='send');
}

function clickHuman(el){
 ['mousedown','mouseup','click'].forEach(t=>
   el.dispatchEvent(new MouseEvent(t,{bubbles:true}))
 );
}

/* ================= SOUND ================= */

function beep(){
 try{
  const ctx=new AudioContext();
  const o=ctx.createOscillator(),g=ctx.createGain();
  o.frequency.value=880;
  g.gain.value=.05;
  o.connect(g);
  g.connect(ctx.destination);
  o.start();
  setTimeout(()=>o.stop(),120);
 }catch(e){}
}

/* ================= LED ================= */

function setLED(s){ledState=s;updateLED();}
function updateLED(){
 let c='#2cff2c';
 if(ledState==='send') c='#ffd400';
 if(ledState==='cooldown') c='#ff3030';
 document.querySelectorAll('.macro-led').forEach(el=>{
  el.style.background=c;
  el.style.boxShadow=`0 0 8px ${c}`;
 });
}

/* ================= SEND ================= */

async function sendChat(text){
 try{
  setLED('send');
  await waitForElement(CHAT_BUTTON_SELECTOR,2000);
  simulateKey('c');
  await sleep(150);

  const input = await waitForElement(CHAT_INPUT_SELECTOR,3000);
  input.focus();

  const setter = Object.getOwnPropertyDescriptor(
     HTMLInputElement.prototype,'value'
  ).set;

  setter.call(input, text);
  input.dispatchEvent(new InputEvent('input',{bubbles:true}));

  await sleep(120);

  const form = input.closest('form');
  if(form) form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));

  await sleep(120);

  if(input.value){
    input.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
    input.dispatchEvent(new KeyboardEvent('keyup',{key:'Enter',bubbles:true}));
  }

  await sleep(120);

  if(input.value){
    const btn = findSendButton();
    if(btn) clickHuman(btn);
  }

 }catch(e){
  console.warn('Chat send failed',e);
 }
}

function trigger(text){
 if(!text) return;
 const n=Date.now();
 if(n-lastTrigger<COOLDOWN_MS) return;
 lastTrigger=n;
 lastReadyBeep=false;
 setLED('cooldown');
 sendChat(text);
}

/* ================= POSITION ================= */

function clamp(x,y){
 const r=overlay.getBoundingClientRect();
 const pad=8;
 return {
  x:Math.min(Math.max(pad,x),window.innerWidth-r.width-pad),
  y:Math.min(Math.max(pad,y),window.innerHeight-r.height-pad)
 };
}

function applyPosition(){
 const p = state.presets[state.activePreset];
 overlay.style.transform=`scale(${p.scale})`;

 let left, top;

 if(p.snap===null){
  if(p.x===null){
   left=(window.innerWidth-overlay.offsetWidth)/2;
   top =window.innerHeight-overlay.offsetHeight-20;
  }else{
   left=p.x; top=p.y;
  }
 }else{
  const r=overlay.getBoundingClientRect(), pad=8;
  const w=r.width, h=r.height, vw=window.innerWidth, vh=window.innerHeight;
  const s=SNAP_POINTS[p.snap];
  if(s==='tl'){left=pad;top=pad;}
  if(s==='t'){left=(vw-w)/2;top=pad;}
  if(s==='tr'){left=vw-w-pad;top=pad;}
  if(s==='l'){left=pad;top=(vh-h)/2;}
  if(s==='r'){left=vw-w-pad;top=(vh-h)/2;}
  if(s==='bl'){left=pad;top=vh-h-pad;}
  if(s==='b'){left=(vw-w)/2;top=vh-h-pad;}
  if(s==='br'){left=vw-w-pad;top=vh-h-pad;}
 }

 const c=clamp(left,top);
 overlay.style.left=c.x+'px';
 overlay.style.top =c.y+'px';

 if(p.snap===null){
  p.x=c.x;
  p.y=c.y;
 }
}

/* ================= OVERLAY ================= */

function createOverlay(){
 load();
 overlay=document.createElement('div');
 Object.assign(overlay.style,{
  position:'fixed',
  zIndex:9999,
  padding:'10px',
  borderRadius:'12px',
  fontFamily:'Arial',
  fontSize:'13px',
  minWidth:'320px',
  boxShadow:'0 4px 12px rgba(0,0,0,.4)',
  transition:'transform .25s ease, opacity .25s ease'
 });
 document.body.appendChild(overlay);
    // Inject hover css once
if(!document.getElementById('macro-ui-style')){
 const st=document.createElement('style');
 st.id='macro-ui-style';
 st.textContent=HOVER_CSS;
 document.head.appendChild(st);
}

 applyPosition();
 applyStyle();
 update();
 startClock();
 watchChat();
}


/* ================= PRESET PREVIEW ================= */

const PREVIEW_DELAY = 180;
const PREVIEW_FADE  = 250;

const PREVIEW_COLORS = [
 'rgba(0,255,120,0.18)',   // A
 'rgba(0,140,255,0.18)',   // B
 'rgba(255,160,0,0.18)'    // C
];

let previewBox = null;
let previewTimer = null;

function hidePreview(){
 if(previewTimer){
   clearTimeout(previewTimer);
   previewTimer = null;
 }

 if(previewBox){
   const el = previewBox;
   el.classList.remove('visible');
   setTimeout(()=>el.remove(), PREVIEW_FADE);
   previewBox = null;
 }
}

function showPresetPreview(idx){
 hidePreview();

 previewTimer = setTimeout(()=>{
   const p = state.presets[idx];
   if(!p) return;

   // --- Größe vom echten Overlay ---
   const base = mainOverlayRect || overlay.getBoundingClientRect();
   const w = base.width;
   const h = base.height;

   const pad = 8;
   const vw = window.innerWidth;
   const vh = window.innerHeight;

   let left, top;

   // --- gleiche Logik wie applyPosition() ---
   if(p.snap === null){
     if(p.x !== null){
       left = p.x;
       top  = p.y;
     }else{
       left = (vw - w)/2;
       top  = vh - h - 20;
     }
   } else {
     const s = SNAP_POINTS[p.snap];
     if(s==='tl'){left=pad;top=pad;}
     if(s==='t'){left=(vw-w)/2;top=pad;}
     if(s==='tr'){left=vw-w-pad;top=pad;}
     if(s==='l'){left=pad;top=(vh-h)/2;}
     if(s==='r'){left=vw-w-pad;top=(vh-h)/2;}
     if(s==='bl'){left=pad;top=vh-h-pad;}
     if(s==='b'){left=(vw-w)/2;top=vh-h-pad;}
     if(s==='br'){left=vw-w-pad;top=vh-h-pad;}
   }

   // --- Preview Box ---
   const box = document.createElement('div');
   box.className = 'preview-outline';
   box.style.left   = left + 'px';
   box.style.top    = top  + 'px';
   box.style.width  = w + 'px';
   box.style.height = h + 'px';
   box.style.background = PREVIEW_COLORS[idx] || 'rgba(255,255,255,0.15)';

   // --- Label ---
   const label = document.createElement('div');
   label.className = 'preview-label';
   label.textContent = `Preset ${['A','B','C'][idx]}`;
   box.appendChild(label);

   document.body.appendChild(box);

   requestAnimationFrame(()=>{
     box.classList.add('visible');
   });

   previewBox = box;

 }, PREVIEW_DELAY);
}


/* ================= STYLE ================= */

function applyStyle(){
 const p=state.presets[state.activePreset];
 overlay.style.opacity=p.opacity;
 overlay.style.background=p.bg;
 overlay.style.color=p.text;
}

/* ================= CLOCK ================= */

function startClock(){
 setInterval(()=>{
  const c=overlay?.querySelector('#clock');
  if(c) c.textContent=new Date().toLocaleTimeString();

  const left=Math.max(0,COOLDOWN_MS-(Date.now()-lastTrigger));
  if(left===0){
   if(!lastReadyBeep){
    if(state.presets[state.activePreset].sound) beep();
    lastReadyBeep=true;
   }
   setLED('ready');
  }
 },300);
}

/* ================= CHAT VISIBILITY ================= */

function watchChat(){
 setInterval(()=>{
  const ok=!!document.querySelector(CHAT_BUTTON_SELECTOR);
  overlay.style.display=(!state.hidden && ok)?'block':'none';
 },400);
}

/* ================= FILE IMPORT ================= */

const presetFileInput = document.createElement('input');
presetFileInput.type = 'file';
presetFileInput.accept = 'application/json';
presetFileInput.style.display = 'none';
document.body.appendChild(presetFileInput);

presetFileInput.addEventListener('change', e=>{
 const file = e.target.files[0];
 if(!file) return;

 const reader = new FileReader();
 reader.onload = ev=>{
  try{
   const p = JSON.parse(ev.target.result);
   if(Array.isArray(p) && p.length===3){
    state.presets = p;
    save();
    applyPosition();
    applyStyle();
    update();
    alert('✅ Presets erfolgreich importiert');
   }else{
    alert('❌ Ungültiges Preset-Format');
   }
  }catch(err){
   alert('❌ Datei ist kein gültiges JSON');
  }
 };
 reader.readAsText(file);
});

/* ================= UI ================= */

function update(){
 if(!overlay) return;
 if(state.hidden){overlay.style.display='none';return;}
 const p=state.presets[state.activePreset];

 /* ===== SETTINGS MODE ===== */
 if(state.settingsOpen){

  overlay.innerHTML = `
   <div style="display:flex;justify-content:space-between;align-items:center">
     <b>⚙️ Einstellungen</b>
     <button id="back">⬅️ Zurück</button>
   </div>

   <div style="margin-top:10px">
     Size <input id="scale" type="range" min="0.85" max="1.2" step="0.01" value="${p.scale}">
     Opacity <input id="opa" type="range" min="0.3" max="1" step="0.05" value="${p.opacity}">
   </div>

   <div style="margin-top:10px">
     BG <input id="bg" type="color" value="${p.bg}">
     Text <input id="tx" type="color" value="${p.text}">
     Btn <input id="bt" type="color" value="${p.btn}">
   </div>

   <div style="margin-top:10px">
     Preset:
     <button data-pr="0"
 title="Preset A (Shift+7)"
 class="${state.activePreset===0?'preset-active':''}"
 style="${BTN_STYLE}">A</button>

<button data-pr="1"
 title="Preset B (Shift+8)"
 class="${state.activePreset===1?'preset-active':''}"
 style="${BTN_STYLE}">B</button>

<button data-pr="2"
 title="Preset C (Shift+9)"
 class="${state.activePreset===2?'preset-active':''}"
 style="${BTN_STYLE}">C</button>

   </div>

   <div style="margin-top:10px; display:flex; gap:8px;">
     <button id="export">Export</button>
     <button id="import">Import</button>
   </div>
  `;

  overlay.style.maxHeight = '75vh';
  overlay.style.overflowY = 'auto';

  overlay.querySelector('#back').onclick = ()=>{
 hidePreview();        // 👈 hinzufügen
 state.settingsOpen = false;
 update();
};


  overlay.querySelector('#scale').oninput=e=>{p.scale=+e.target.value;applyPosition();};
  overlay.querySelector('#opa').oninput=e=>{p.opacity=+e.target.value;applyStyle();};
  overlay.querySelector('#bg').oninput=e=>{p.bg=e.target.value;applyStyle();};
  overlay.querySelector('#tx').oninput=e=>{p.text=e.target.value;applyStyle();update();};
  overlay.querySelector('#bt').oninput=e=>{p.btn=e.target.value;update();};

  overlay.querySelectorAll('button[data-pr]').forEach(b=>{
 const idx = +b.dataset.pr;

 // 🎨 aktive Markierung
 if(idx === state.activePreset){
   b.style.background = '#2cff2c';
   b.style.color = '#000';
   b.style.fontWeight = 'bold';
 }else{
   b.style.background = p.btn;
   b.style.color = p.text;
   b.style.fontWeight = 'normal';
 }

 // ✅ PREVIEW ON HOVER
 b.onmouseenter = () => {
   showPresetPreview(idx);
 };

 b.onmouseleave = () => {
   hidePreview();
 };

 b.onclick = ()=>{
   hidePreview();
   state.activePreset = idx;
   applyPosition();
   applyStyle();
   update();
   save();
 };
});


  overlay.querySelector('#export').onclick = ()=>{
   const json = JSON.stringify(state.presets, null, 2);
   const blob = new Blob([json], {type:'application/json'});
   const url = URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = 'autodarts_presets.json';
   a.click();
   URL.revokeObjectURL(url);
  };

  overlay.querySelector('#import').onclick = ()=>{
   presetFileInput.value='';
   presetFileInput.click();
  };

  return;
 }

 /* ===== MINI MODE ===== */
 if(state.minimized){

  overlay.style.padding='0';
  overlay.style.background='transparent';
  overlay.style.boxShadow='none';
  overlay.style.borderRadius='0';

  overlay.innerHTML=`
   <div id="miniWrap" style="position:relative;width:48px;height:48px;cursor:pointer">
     <img src="${DARTBASE_LOGO}" style="width:48px;height:48px;display:block">
     <div class="macro-led" style="position:absolute;right:4px;top:4px;width:10px;height:10px;border-radius:50%;border:1px solid #000"></div>
   </div>`;

  const mini=overlay.querySelector('#miniWrap');

  mini.onmousedown=e=>{
   moved=false;
   drag={dx:e.clientX-overlay.offsetLeft,dy:e.clientY-overlay.offsetTop};
   document.onmousemove=ev=>{
    moved=true;
    p.snap=null;
    p.x=ev.clientX-drag.dx;
    p.y=ev.clientY-drag.dy;
    applyPosition();
   };
   document.onmouseup=()=>{
    document.onmousemove=null;
    drag=null;
    save();
   };
  };

  mini.onclick=()=>{
   if(!moved){
    state.minimized=false;
    applyPosition();
    update();
   }
  };

  updateLED();
  return;
 }

 /* ===== NORMAL MODE ===== */

 overlay.style.padding='10px';
 overlay.style.borderRadius='12px';
 overlay.style.boxShadow='0 4px 12px rgba(0,0,0,.4)';
 applyStyle();

 const snapIcon=(p.snap===null?'📍':'📌');

 let html=`
 <div class="macro-header" style="display:flex;justify-content:space-between;cursor:${p.locked?'default':'move'}">
  <b>🎯 Autodarts Chat Panel ${SCRIPT_VERSION}</b>
  <span id="clock" style="opacity:.8"></span>
  <span class="macro-led" style="width:10px;height:10px;border-radius:50%;border:1px solid #000"></span>
 </div>

 <div style="display:grid;gap:8px;margin:8px 0;">`;

 for(const k in p.hotkeys){
  html+=`
  <div style="display:flex;gap:6px">
    <button
 data-k="${k}"
 class="macro-btn"
 title="Hotkey: [${k}] – Klick zum Senden"
 style="
   flex:1;
   background:${p.btn};
   color:${p.text};
   ${BTN_STYLE}
 ">
 [${k}] ${p.hotkeys[k]}
</button>

  <span data-edit="${k}"  class="icon-btn" title="Text bearbeiten" style="${ICON_STYLE}">✏️</span>
  <span data-rebind="${k}" class="icon-btn" title="Hotkey neu binden" style="${ICON_STYLE}">🔢</span>
  <span data-del="${k}"   class="icon-btn" title="Eintrag löschen" style="${ICON_STYLE}">🗑</span>


  </div>`;
 }
 html+=`</div>

 <div style="display:flex;flex-wrap:wrap;gap:8px">
  <button id="save"  class="macro-btn" title="Speichern" style="${BTN_STYLE}" >💾</button>
  <button id="snap" class="macro-btn" title="Snap Position" style="${BTN_STYLE}">${snapIcon}</button>
  <button id="sound" class="macro-btn" title="Sound an / aus" style="${BTN_STYLE}">${p.sound?'🔔':'🔕'}</button>
  <button id="lock" class="macro-btn" title="Overlay sperren" style="${BTN_STYLE}">${p.locked?'🔒':'🔓'}</button>
  <button id="theme" class="macro-btn" title="Hell / Dunkel" style="${BTN_STYLE}">🌗</button>
  <button id="settings" class="macro-btn" title="Settings" style="${BTN_STYLE}">⚙️</button>
  <button id="reset" class="macro-btn" title="Reset" style="${BTN_STYLE}">♻</button>
  <button id="min"class="macro-btn" title="Minimieren" style="${BTN_STYLE}" >⬇️</button>

<!-- 🎯 Preset Buttons -->
<div style="display:flex;gap:6px;margin-left:6px">
  <button data-main-pr="0" class="macro-btn" title="Preset A (Shift+7)" style="${BTN_STYLE}">A</button>
  <button data-main-pr="1" class="macro-btn" title="Preset B (Shift+8)" style="${BTN_STYLE}">B</button>
  <button data-main-pr="2" class="macro-btn" title="Preset C (Shift+9)" style="${BTN_STYLE}">C</button>
</div>
</div>


 <a href="https://www.dart-base.de" target="_blank"
    style="display:flex;justify-content:center;gap:8px;margin-top:10px;text-decoration:none;color:inherit">
   <img src="${DARTBASE_LOGO}" style="width:26px;height:26px">
   <span>www.dart-base.de</span>
 </a>`;

 overlay.innerHTML=html;
 updateLED();

 /* ---- HEADER DRAG ---- */
 const header=overlay.querySelector('.macro-header');
 header.onmousedown=e=>{
  if(p.locked) return;
  moved=false;
  drag={dx:e.clientX-overlay.offsetLeft,dy:e.clientY-overlay.offsetTop};
  document.onmousemove=ev=>{
   moved=true;
   p.snap=null;
   p.x=ev.clientX-drag.dx;
   p.y=ev.clientY-drag.dy;
   applyPosition();
  };
  document.onmouseup=()=>{
   document.onmousemove=null;
   drag=null;
   save();
  };
 };

 /* ---- EVENTS ---- */

 if(!p.locked){
  overlay.querySelectorAll('button[data-k]').forEach(b=>b.onclick=()=>trigger(p.hotkeys[b.dataset.k]));
  overlay.querySelectorAll('[data-del]').forEach(s=>s.onclick=()=>{p.hotkeys[s.dataset.del]='';update();});

overlay.querySelectorAll('[data-rebind]').forEach(s=>{
  s.onclick = ()=>{
    waitingRebind = s.dataset.rebind;

    // 🎯 alle anderen Markierungen entfernen
    overlay.querySelectorAll('.rebind-active')
      .forEach(el=>el.classList.remove('rebind-active'));

    // ✨ aktuelle Zeile markieren
    const row = s.closest('div');
    if(row){
      row.classList.add('rebind-active');
      row.title = 'Taste drücken… (ESC = Abbruch)';
    }

    s.textContent = '⌨️';
  };
});


  overlay.querySelectorAll('[data-edit]').forEach(editIcon=>{
  editIcon.onclick = () => {
    const k = editIcon.dataset.edit;
    const row = editIcon.parentElement;

    // 🎯 finde den eigentlichen Text-Button sicher
    const textButton = row.querySelector('button[data-k]');
    if(!textButton) return;   // Sicherheit – verhindert Crash

    const input = document.createElement('input');
    input.value = p.hotkeys[k];

    /* ✅ exakt gleiche Optik wie Button */
    Object.assign(input.style,{
      flex: '1',
      background: p.btn,
      color: p.text,
      border: '1px solid rgba(255,255,255,0.25)',
      borderRadius: '6px',
      fontSize: '15px',
      padding: '7px 12px',
      minHeight: '36px',
      outline: 'none'
    });

    // Button durch Input ersetzen (nur den Button, nicht die ganze Zeile)
    row.replaceChild(input, textButton);

    input.focus();
    input.select();

    const finish = (save=true) => {
      if(save){
        p.hotkeys[k] = input.value;
      }
      update();   // baut die Zeile sauber neu auf
    };

    input.onblur = () => finish(true);

    input.onkeydown = e => {
      if(e.key === 'Enter') input.blur();
      if(e.key === 'Escape') finish(false);
    };
  };
});


 }


 overlay.querySelector('#save').onclick=save;
 overlay.querySelector('#snap').onclick=showSnapMenu;
 overlay.querySelector('#sound').onclick=()=>{p.sound=!p.sound;update();};
 overlay.querySelector('#lock').onclick=()=>{p.locked=!p.locked;save();update();};
 overlay.querySelector('#theme').onclick=()=>{
  if(p.theme==='dark'){p.bg='#eee';p.text='#000';p.btn='#ccc';p.theme='light';}
  else{p.bg='#215294';p.text='#fff';p.btn='#2d2d2d';p.theme='dark';}
  applyStyle();update();
 };

overlay.querySelector('#settings').onclick=()=>{
  // ✅ aktuelle Größe des Hauptoverlays sichern
  mainOverlayRect = overlay.getBoundingClientRect();

  state.settingsOpen = true;
  update();
};



 overlay.querySelector('#reset').onclick=()=>{
  if(confirm('Alles zurücksetzen?')){
   state={
    activePreset:0,
    minimized:true,
    hidden:false,
    settingsOpen:false,
    presets:[defaultPreset(),defaultPreset(),defaultPreset()]
   };
   save();
   update();
  }
 };
 overlay.querySelector('#min').onclick=()=>{
  state.minimized=true;
  applyPosition();
  update();
 };
// 🎯 Preset Buttons im Hauptoverlay
overlay.querySelectorAll('[data-main-pr]').forEach(btn=>{
 const idx = +btn.dataset.mainPr;

 // visuelle Markierung
 if(idx === state.activePreset){
   btn.style.background = '#2cff2c';
   btn.style.color = '#000';
   btn.style.fontWeight = 'bold';
 }else{
   btn.style.background = p.btn;
   btn.style.color = p.text;
   btn.style.fontWeight = 'normal';
 }

 // Wechsel
 btn.onclick = ()=>{
   hidePreview();
   state.activePreset = idx;
   applyPosition();
   applyStyle();
   update();
   save();
 };

 // 👁️ Preview
 btn.addEventListener('mouseenter', ()=>showPresetPreview(idx));
 btn.addEventListener('mouseleave', hidePreview);
});

}

/* ================= SNAP MENU ================= */

function showSnapMenu(){
 const p=state.presets[state.activePreset];
 if(p.locked) return;

 document.querySelectorAll('.snap-menu').forEach(e=>e.remove());

 const menu=document.createElement('div');
 menu.className='snap-menu';
 Object.assign(menu.style,{
  position:'fixed',
  zIndex:10000,
  background:'#111',
  border:'1px solid #555',
  borderRadius:'10px',
  padding:'8px',
  display:'grid',
  gridTemplateColumns:'repeat(3,34px)',
  gap:'6px',
  boxShadow:'0 4px 12px rgba(0,0,0,.5)'
 });

 const r=overlay.getBoundingClientRect();
 let left=r.left+30, top=r.top-130;
 left=Math.max(8,Math.min(left,window.innerWidth-140));
 top =Math.max(8,Math.min(top ,window.innerHeight-140));
 menu.style.left=left+'px';
 menu.style.top =top +'px';

 const map=[
  ['tl','↖'],['t','↑'],['tr','↗'],
  ['l','←'], ['off','✖'],['r','→'],
  ['bl','↙'],['b','↓'], ['br','↘']
 ];

 map.forEach(([pos,label])=>{
  const active = (pos!=='off' && p.snap===SNAP_POINTS.indexOf(pos)) ||
                 (pos==='off' && p.snap===null);
  const b=document.createElement('button');
  b.textContent=label;
  Object.assign(b.style,{
    width:'34px',
    height:'28px',
    background: active ? '#2cff2c' : '#2d2d2d',
    color: active ? '#000' : '#fff',
    border:'1px solid #555',
    borderRadius:'6px',
    cursor:'pointer'
  });
  b.onclick=()=>{
    if(pos==='off'){
      const rr=overlay.getBoundingClientRect();
      p.snap=null; p.x=rr.left; p.y=rr.top;
    }else{
      p.snap=SNAP_POINTS.indexOf(pos); p.x=null; p.y=null;
    }
    save();
    update();
    setTimeout(applyPosition,0);
    menu.remove();
  };
  menu.appendChild(b);
 });

 document.body.appendChild(menu);

 setTimeout(()=>{
  const close=e=>{
    if(!menu.contains(e.target)){
      menu.remove();
      document.removeEventListener('mousedown',close);
    }
  };
  document.addEventListener('mousedown',close);
 },0);
}

/* ================= HOTKEY ================= */

document.addEventListener('keydown',e=>{

if(waitingRebind){
  const p = state.presets[state.activePreset];

  // ❌ ESC → Abbruch
  if(e.key === 'Escape'){
    waitingRebind = null;
    overlay.querySelectorAll('.rebind-active')
      .forEach(el=>el.classList.remove('rebind-active'));
    update();
    return;
  }

  const newKey = e.key;
  const oldKey = waitingRebind;

  // ⛔ nur Einzelzeichen erlauben
  if(newKey.length !== 1){
    alert('❌ Bitte nur eine einzelne Taste verwenden.');
    return;
  }

  // ✅ gleiche Taste erneut → nichts ändern
  if(newKey === oldKey){
    waitingRebind = null;
    overlay.querySelectorAll('.rebind-active')
      .forEach(el=>el.classList.remove('rebind-active'));
    update();
    return;
  }

  // ⚠️ Kollision
  if(p.hotkeys[newKey]){
    alert(`❌ Taste "${newKey}" ist bereits belegt.`);
    waitingRebind = null;
    overlay.querySelectorAll('.rebind-active')
      .forEach(el=>el.classList.remove('rebind-active'));
    update();
    return;
  }

  // ✅ Rebind durchführen
  p.hotkeys[newKey] = p.hotkeys[oldKey];
  delete p.hotkeys[oldKey];

  waitingRebind = null;
  overlay.querySelectorAll('.rebind-active')
    .forEach(el=>el.classList.remove('rebind-active'));

  // 🔔 Erfolgs-Beep
  if(p.sound) beep();

  save();
  update();
  return;
}



 if(e.shiftKey && e.code==='Digit7'){state.activePreset=0;applyPosition();applyStyle();update();save();return;}
 if(e.shiftKey && e.code==='Digit8'){state.activePreset=1;applyPosition();applyStyle();update();save();return;}
 if(e.shiftKey && e.code==='Digit9'){state.activePreset=2;applyPosition();applyStyle();update();save();return;}

 if(e.shiftKey && e.key.toLowerCase()==='h'){
  state.hidden=!state.hidden;
  save();
  return;
 }

 if(e.shiftKey && e.code==='Digit0'){
  if(confirm('Alles zurücksetzen?')){
   state={
    activePreset:0,
    minimized:true,
    hidden:false,
    settingsOpen:false,
    presets:[defaultPreset(),defaultPreset(),defaultPreset()]
   };
   save();
   update();
   return;
  }
 }

 if(e.target.tagName==='INPUT') return;

 const p=state.presets[state.activePreset];
 if(p.hotkeys[e.key]){
  e.preventDefault();
  trigger(p.hotkeys[e.key]);
 }
});

document.addEventListener('mousedown', hidePreview);
window.addEventListener('blur', hidePreview);

/* ================= INIT ================= */

const t=setInterval(()=>{
 if(document.body){
  createOverlay();
  clearInterval(t);
 }
},300);

window.addEventListener('resize', applyPosition);
document.addEventListener('fullscreenchange', applyPosition);

})();
