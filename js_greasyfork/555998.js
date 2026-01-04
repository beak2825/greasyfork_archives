// ==UserScript==
// @name         Universal Subtitle Overlay (Responsive)
// @namespace    https://greasyfork.org/users/1356925
// @version      20.0
// @description  Load .srt or .vtt subtitles on any online video. Works on desktop, laptop, tablet, and mobile. Drag, sync, resize, overlay subtitles.
// @author       You
// @match        *://*/*
// @license      MIT
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555998/Universal%20Subtitle%20Overlay%20%28Responsive%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555998/Universal%20Subtitle%20Overlay%20%28Responsive%29.meta.js
// ==/UserScript==

(() => {
'use strict';

/* ---------- STYLE (UI + Toast + Overlay) ---------- */
if (!document.getElementById('usub-style')) {
  const st = document.createElement('style');
  st.id = 'usub-style';
  st.textContent = `
    @import url("https://fonts.googleapis.com/css2?family=PT+Sans+Caption:wght@400;700&display=swap");
    :root { --primary-color:#adcaff; --background-color:#222f4d; --toast-bg:#1e2436ea; --toast-color:var(--primary-color); }
    .usub-over{
      position:fixed; left:50%; transform:translate(-50%,0); max-width:90vw;
      font-family:"PT Sans Caption",sans-serif; font-weight:700; line-height:1.28;
      color:#fff; text-shadow:0 2px 8px #000b,0 0 3px #000; z-index:2147483646!important;
      pointer-events:auto; text-align:center; white-space:pre-wrap; user-select:none;
    }
    #usub-loadbtn{
      position:fixed; bottom:2vh; right:2vw; background:var(--background-color)!important;
      color:var(--primary-color)!important; font-size:1.4rem!important; font-weight:600!important;
      padding:1rem 2rem!important; border-radius:1rem!important; border:none!important;
      cursor:pointer!important; z-index:2147483647!important; box-shadow:0 3px 8px rgba(0,0,0,.3)!important;
      touch-action: manipulation;
    }
    #usub-toast{
      position:fixed; left:50%; bottom:10vh; transform:translate(-50%,0);
      background:var(--toast-bg); color:var(--toast-color);
      font-size:1rem; padding:11px 23px; border-radius:12px;
      z-index:2147483647!important; opacity:0; transition:opacity .3s ease;
      white-space:normal; max-width:90vw; word-break:break-word; pointer-events:none; user-select:none;
    }
    #usub-toast.show{opacity:1;}
  `;
  document.head.appendChild(st);
}

/* ---------- CONFIG ---------- */
const CONFIG = {
  STORAGE_KEY:'usub-state-'+location.hostname+location.pathname,
  UI_GLOBAL_KEY:'usub-ui-visibility-global',
  BASE_VIDEO_WIDTH:640,
  MIN_FONT_SIZE:10,
  MAX_FONT_SIZE:60
};

/* ---------- STATE ---------- */
let state = {
  show:true,fontSize:18,bottom:10,x:50,sync:0,ui:true,
  raw:'',ext:'',fontWeight:700
};
let subs=[], overlay=null, video=null, toastEl=null;
let resizeThrottle=null, vidResizeObs=null, domObserver=null, mutationDebounce=null;
let eventListeners=[];

/* ---------- STORAGE ---------- */
const saveState = ()=>{ try{localStorage.setItem(CONFIG.STORAGE_KEY,JSON.stringify(state));}catch{} };
const loadState = ()=>{ try{Object.assign(state,JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY))) }catch{} };
const loadGlobalUIState = ()=>{ try{let s=localStorage.getItem(CONFIG.UI_GLOBAL_KEY); if(s!==null) state.ui=s==='true';}catch{} };
const saveGlobalUIState = ()=>{ try{localStorage.setItem(CONFIG.UI_GLOBAL_KEY,String(state.ui));}catch{} };

/* ---------- TOAST ---------- */
let toastTimer=null;
const showToast = (msg,dur=3000)=>{
  if(!toastEl){ toastEl=document.createElement('div'); toastEl.id='usub-toast'; document.body.appendChild(toastEl); }
  toastEl.textContent=msg;
  toastEl.classList.remove('show'); void toastEl.offsetWidth;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toastEl.classList.remove('show'),dur);
};

/* ---------- SUB PARSER ---------- */
const parseTimestamp = ts=>{
  const m = ts.trim().match(/(\d+):(\d{2}):(\d{2})[.,](\d{3})/);
  return m ? (+m[1])*3600 + (+m[2])*60 + (+m[3]) + (+m[4])/1000 : 0;
};
const parseSubtitles = raw=>{
  raw = raw.replace(/^\uFEFF/,'');
  return raw.split(/\n{2,}/).reduce((acc,blk)=>{
    const lines = blk.trim().split(/\r?\n/);
    const idx = lines.findIndex(l=>l.includes('-->'));
    if(idx<0) return acc;
    const [start,end] = lines[idx].split('-->').map(s=>s.trim());
    const st=parseTimestamp(start), et=parseTimestamp(end);
    if(!st || !et || st>=et) return acc;
    const text = lines.slice(idx+1).join('\n')
      .replace(/\{\\i1\}/g,'<em>').replace(/\{\\i0\}/g,'</em>')
      .replace(/<i>/g,'<em>').replace(/<\/i>/g,'</em>');
    acc.push({start:st,end:et,text});
    return acc;
  },[]);
};

/* ---------- VIDEO LOCATOR ---------- */
const findVideo=()=>{
  const vids=[...document.querySelectorAll('video')].filter(v=>{
    if(!v.currentSrc||!document.body.contains(v)) return false;
    const r=v.getBoundingClientRect();
    if(r.width<100||r.height<80||r.bottom<=0||r.top>=innerHeight) return false;
    const s=getComputedStyle(v);
    return s.visibility!=='hidden' && s.display!=='none';
  });
  if(!vids.length) return null;
  vids.sort((a,b)=>b.offsetWidth*b.offsetHeight - a.offsetWidth*a.offsetHeight);
  return vids[0];
};

/* ---------- OVERLAY ---------- */
const cleanupListeners=()=>{
  for(const o of eventListeners){
    o.el.removeEventListener('pointerdown',o.down);
    o.el.removeEventListener('pointermove',o.move);
    o.el.removeEventListener('pointerup',o.up);
    o.el.removeEventListener('pointercancel',o.up);
  }
  eventListeners=[];
};
const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));

const enableDrag = el=>{
  let dragging=false,sx,sy,startX,startBottom;
  const down=e=>{
    dragging=true; sx=e.clientX; sy=e.clientY;
    startX=state.x; startBottom=state.bottom;
    document.body.style.userSelect='none';
    el.setPointerCapture(e.pointerId); e.preventDefault();
  };
  const move=e=>{
    if(!dragging||!video) return;
    const r=video.getBoundingClientRect();
    state.x = clamp(startX + ((e.clientX-sx)/r.width)*100,5,95);
    state.bottom = clamp(startBottom - ((e.clientY-sy)/r.height)*100,0,60);
    updateOverlayStyle();
  };
  const up=e=>{
    if(!dragging) return;
    dragging=false; document.body.style.userSelect='';
    el.releasePointerCapture(e.pointerId); saveState();
    showToast('Position saved');
  };
  el.addEventListener('pointerdown',down);
  el.addEventListener('pointermove',move);
  el.addEventListener('pointerup',up);
  el.addEventListener('pointercancel',up);
  eventListeners.push({el,down,move,up});
};

const createOverlay=()=>{
  if(overlay){ overlay.remove(); cleanupListeners(); }
  overlay=document.createElement('div'); overlay.className='usub-over';
  document.body.appendChild(overlay); enableDrag(overlay);
};

/* ---------- OVERLAY UPDATE ---------- */
const updateOverlayStyle=()=>{
  if(!overlay||!video) return;
  overlay.style.fontWeight=state.fontWeight;
  let size = state.fontSize * Math.min(video.offsetWidth/CONFIG.BASE_VIDEO_WIDTH, window.innerWidth/CONFIG.BASE_VIDEO_WIDTH) * window.devicePixelRatio;
  overlay.style.fontSize=clamp(size,CONFIG.MIN_FONT_SIZE,CONFIG.MAX_FONT_SIZE)+'px';
  const r=video.getBoundingClientRect();
  overlay.style.left = (r.left + r.width*state.x/100)+'px';
  overlay.style.bottom = (innerHeight - r.bottom + r.height*state.bottom/100)+'px';
  overlay.style.transform='translateX(-50%)';
  overlay.style.display = (state.show && subs.length>0 && !document.getElementById('usub-guide-overlay'))?'block':'none';
};

const updateSubtitles=()=>{
  if(!video||!overlay||!state.show){ if(overlay) overlay.style.display='none'; return; }
  const t=video.currentTime+state.sync;
  const sub=subs.find(s=>t>=s.start&&t<=s.end);
  const text=sub?sub.text:'';
  if(overlay.innerHTML!==text) overlay.innerHTML=text;
  updateOverlayStyle();
};

/* ---------- FILE LOADER ---------- */
const handleFileInput=e=>{
  const f=e.target.files[0];
  if(!f) return showToast('No file selected');
  const ext=f.name.split('.').pop().toLowerCase();
  if(!['srt','vtt'].includes(ext)) return showToast('Select .srt or .vtt');
  const r=new FileReader();
  r.onload=ev=>{
    state.raw=ev.target.result; state.ext=ext; saveState();
    subs=parseSubtitles(state.raw);
    showToast(`Loaded: ${f.name}`);
    updateSubtitles();
  };
  r.readAsText(f,'UTF-8');
};

/* ---------- UI ---------- */
const initializeUI=()=>{
  loadGlobalUIState();
  let btn=document.getElementById('usub-loadbtn');
  if(!btn){
    btn=document.createElement('button');
    btn.id='usub-loadbtn'; btn.textContent='Load Subtitle';
    document.body.appendChild(btn);
  }
  btn.style.display=state.ui?'block':'none';
  let input=document.getElementById('usub-file-input');
  if(!input){
    input=document.createElement('input');
    input.id='usub-file-input'; input.type='file';
    input.accept='.srt,.vtt'; input.style.display='none';
    document.body.appendChild(input);
  }
  btn.onclick=()=>{ input.value=''; input.click(); };
  input.onchange=handleFileInput;
};

/* ---------- MENU COMMANDS ---------- */
const registerCommands=()=>{
  if(typeof GM_registerMenuCommand!=='function') return;
  GM_registerMenuCommand('UI Button ON/OFF',()=>{
    state.ui=!state.ui;
    document.getElementById('usub-loadbtn').style.display=state.ui?'block':'none';
    saveGlobalUIState();
  });
  GM_registerMenuCommand('Subtitles ON/OFF',()=>{
    state.show=!state.show; saveState(); updateSubtitles();
  });
  GM_registerMenuCommand('Sync Offset',()=>{
    const v=parseFloat(prompt('Offset in seconds:',state.sync));
    if(!isNaN(v)){ state.sync=v; saveState(); }
  });
  GM_registerMenuCommand('Vertical Position (%)',()=>{
    const v=parseFloat(prompt('0–60%',state.bottom));
    if(!isNaN(v)){ state.bottom=clamp(v,0,60); saveState(); }
  });
  GM_registerMenuCommand('Font Size (px)',()=>{
    const v=parseInt(prompt('10–60px',state.fontSize));
    if(!isNaN(v)){ state.fontSize=clamp(v,10,60); saveState(); }
  });
  GM_registerMenuCommand('Font Weight (400/700)',()=>{
    const v=parseInt(prompt('400 or 700',state.fontWeight));
    if(v===400||v===700){ state.fontWeight=v; saveState(); }
  });
  GM_registerMenuCommand('Clear All Subtitle Data',()=>{
    if(confirm('Clear subtitles and reset settings?')){
      Object.assign(state,{show:true,fontSize:18,bottom:10,x:50,sync:0,ui:true,raw:'',ext:'',fontWeight:700});
      saveState(); subs=[]; if(overlay) overlay.innerHTML=''; updateOverlayStyle();
    }
  });
};

/* ---------- INIT ---------- */
const observeVideo=vid=>{
  if(vidResizeObs) vidResizeObs.disconnect();
  vidResizeObs=new ResizeObserver(()=>{
    if(resizeThrottle) return;
    resizeThrottle=setTimeout(()=>{
      updateOverlayStyle(); updateSubtitles(); resizeThrottle=null;
    },100);
  });
  vidResizeObs.observe(vid);
};

const init=()=>{
  video=findVideo();
  if(!video) return;
  createOverlay(); observeVideo(video);
  video.addEventListener('timeupdate',updateSubtitles);
  updateOverlayStyle(); updateSubtitles();
};

const monitorFullscreen = () => {
    document.addEventListener('fullscreenchange', () => {
        const fs = document.fullscreenElement;
        if (fs && overlay) {
            fs.appendChild(overlay);
        } else if (overlay) {
            document.body.appendChild(overlay);
        }
        updateOverlayStyle();
    });
};
monitorFullscreen();

/* ---------- DOM OBSERVER ---------- */
domObserver=new MutationObserver(()=>{
  clearTimeout(mutationDebounce);
  mutationDebounce=setTimeout(()=>{
    if(!video||!document.body.contains(video)) init();
  },150);
});
domObserver.observe(document.body,{childList:true,subtree:true});

/* ---------- WINDOW EVENTS ---------- */
window.addEventListener('resize', ()=>{ updateOverlayStyle(); updateSubtitles(); });
window.addEventListener('orientationchange', ()=>{ updateOverlayStyle(); updateSubtitles(); });

/* ---------- STARTUP ---------- */
loadState(); loadGlobalUIState();
initializeUI(); registerCommands();
if(state.raw) subs=parseSubtitles(state.raw);
init();

})();