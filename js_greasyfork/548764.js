// ==UserScript==
// @name         Miniblox.io HUD + Panel + Fondo + KeyViz + MS + Coordenadas + Modo Nocturno (v2.0.0)
// @namespace    https://tampermonkey.net/
// @version      2.0.0
// @description  HUD FPS/CPS/MAX/MS, batería en tiempo real, hora; panel (H) movible; Key-Visualizer (K) movible; fondo realista (under/overlay, auto-fase, lobby-only); crosshair; metrónomo; timer; coordenadas (auto/cursor/canvas/Δ); Modo nocturno con fuerza/calidez y "Forzar oscuro UI"; persistencia.
// @match        https://miniblox.io/*
// @match        https://*.miniblox.io/*
// @run-at       document-end
// @grant        none
// @noframes
// @compatible   chrome
// @downloadURL https://update.greasyfork.org/scripts/548764/Minibloxio%20HUD%20%2B%20Panel%20%2B%20Fondo%20%2B%20KeyViz%20%2B%20MS%20%2B%20Coordenadas%20%2B%20Modo%20Nocturno%20%28v200%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548764/Minibloxio%20HUD%20%2B%20Panel%20%2B%20Fondo%20%2B%20KeyViz%20%2B%20MS%20%2B%20Coordenadas%20%2B%20Modo%20Nocturno%20%28v200%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---- Compatibilidad (Chromium: Chrome/Brave) ----
  const ua = navigator.userAgent || '';
  const isChromium = !!window.chrome && /Chrome\/\d+/.test(ua);
  const isBrave = typeof navigator.brave !== 'undefined' || /Brave\//.test(ua);
  const isChrome = /Chrome\/\d+/.test(ua) && !/Edg\//.test(ua) && !/OPR\//.test(ua);
  if (!(isChromium && (isBrave || isChrome))) return;

  // ---- Persistencia ----
  const STORE = 'mbx_prefs_v200';
  const defaults = {
    hud:{visible:true,x:null,y:null},
    panel:{visible:false,x:null,y:null},
    toggles:{showFPS:true,showCPS:true,showMAX:true,showMS:true,showBattery:true,showClock:true,showCoords:true},
    autoTheme:true,
    manualPhase:'day',
    tintStrength:1,
    keyviz:{enabled:true,x:null,y:null},
    cross:{enabled:true,size:12,thick:2,opacity:0.9,gap:6},
    metro:{enabled:false,bpm:120,volume:0.2},
    timer:{visible:false},
    coords:{ enabled:true, mode:'auto', rel:{x:0,y:0}, lastCursor:{x:0,y:0} },
    night:{ enabled:false, forceDark:false, strength:0.6, warmth:0.15 },
    bg:{
      enabled:true, mode:'overlay', blend:'multiply', overlayOpacity:0.28,
      autoPhase:true,
      photos:{
        day:[
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1920&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1920&auto=format&fit=crop'
        ],
        sunset:[
          'https://images.unsplash.com/photo-1501973801540-537f08ccae7b?q=80&w=1920&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1508739826987-b79cd8b7da12?q=80&w=1920&auto=format&fit=crop'
        ],
        night:[
          'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1920&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1920&auto=format&fit=crop'
        ]
      },
      hours:{ day:{start:7,end:18}, sunset:{start:18,end:20}, night:{start:20,end:7} },
      dim:{ day:0.00, sunset:0.08, night:0.22 },
      currentPhase:null, currentUrl:null,
      onlyInLobby:true
    }
  };
  let prefs = load();
  function load(){ try{const raw=localStorage.getItem(STORE); if(!raw) return structuredClone(defaults); return deepMerge(structuredClone(defaults), JSON.parse(raw)); }catch{ return structuredClone(defaults); } }
  function save(){ try{ localStorage.setItem(STORE, JSON.stringify(prefs)); }catch{} }
  function deepMerge(a,b){ for(const k in b){ if (b[k] && typeof b[k]==='object' && !Array.isArray(b[k])) a[k]=deepMerge(a[k]??{}, b[k]); else a[k]=b[k]; } return a; }
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const clamp01=v=>clamp(v,0,1);
  const pick=arr=>arr[Math.floor(Math.random()*arr.length)];
  const inRange=(h,{start,end})=>(start<=end)?(h>=start && h<end):(h>=start || h<end);
  const pad=n=>n<10?('0'+n):''+n;

  // ---- Estilos ----
  const css = `
    /* HUD */
    #mbx-bar{position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:2147483646;padding:6px 12px;background:rgba(18,18,20,.85);color:#e9eef5;border:1px solid rgba(255,255,255,.1);border-radius:999px;font:12px/1 system-ui,Segoe UI,Roboto,Arial;backdrop-filter:blur(6px);box-shadow:0 6px 24px rgba(0,0,0,.25);user-select:none;white-space:nowrap;cursor:grab}
    #mbx-bar .sep{display:inline-block;width:6px;height:6px;border-radius:50%;margin:0 8px;opacity:.6;vertical-align:middle;background:#8e8e93}
    #mbx-bar .fps,#mbx-bar .cps,#mbx-bar .max,#mbx-bar .ms,#mbx-bar .pos{font-weight:700}
    #mbx-bar .good{color:#25d366}.warn{color:#e8a317}.bad{color:#ff6b6b}
    #mbx-bar .muted{opacity:.75} #mbx-bar.mbx-hidden{display:none!important}
    @media(prefers-color-scheme:light){#mbx-bar{background:rgba(245,246,248,.95);color:#1a1b1e;border-color:rgba(0,0,0,.08)}}

    /* Tinte horario */
    #mbx-tint{position:fixed;inset:0;z-index:2147483645;pointer-events:none;transition:background-color .6s,backdrop-filter .6s,opacity .6s}
    .mbx-theme-day #mbx-tint{background-color:rgba(255,255,255,calc(0*var(--mbx-tint)));backdrop-filter:none}
    .mbx-theme-sunset #mbx-tint{background-color:rgba(255,140,0,calc(.08*var(--mbx-tint)));backdrop-filter:brightness(calc(1-.02*var(--mbx-tint))) saturate(calc(1+.02*var(--mbx-tint)))}
    .mbx-theme-night #mbx-tint{background-color:rgba(10,16,28,calc(.25*var(--mbx-tint)));backdrop-filter:brightness(calc(1-.10*var(--mbx-tint)))}

    /* Panel */
    #mbx-panel{position:fixed;right:14px;top:14px;z-index:2147483647;width:380px;background:rgba(20,20,24,.95);color:#e9eef5;border:1px solid rgba(255,255,255,.1);border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.35);backdrop-filter:blur(8px);font:13px/1.35 system-ui,Segoe UI,Roboto,Arial;display:none;cursor:move}
    #mbx-panel.visible{display:block}
    #mbx-panel .hdr{padding:10px 12px;font-weight:700;border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:space-between}
    #mbx-panel .body{padding:10px 12px; cursor:auto}
    #mbx-panel .row{display:flex;align-items:center;justify-content:space-between;margin:8px 0;gap:8px;flex-wrap:wrap}
    #mbx-panel .btn{background:#2b2f3a;border:1px solid rgba(255,255,255,.1);color:#e9eef5;padding:6px 10px;border-radius:8px;cursor:pointer}
    #mbx-panel input[type="range"], #mbx-panel select{width:180px}
    #mbx-panel .muted{opacity:.75}

    /* KeyViz */
    #mbx-keyviz{position:fixed;left:14px;bottom:14px;z-index:2147483646;display:flex;gap:6px;flex-wrap:wrap;max-width:260px;background:rgba(18,18,20,.55);border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:8px;backdrop-filter:blur(6px);cursor:move}
    #mbx-keyviz .k{width:52px;height:52px;border-radius:10px;background:rgba(18,18,20,.6);border:1px solid rgba(255,255,255,.12);box-shadow:0 6px 16px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;color:#e9eef5;font:13px/1.1 system-ui,Segoe UI,Roboto,Arial;position:relative}
    #mbx-keyviz .k .t{position:absolute;bottom:6px;left:0;right:0;text-align:center;font-size:10px;opacity:.8}
    #mbx-keyviz .on{background:rgba(46,204,113,.85)}
    @media(prefers-color-scheme:light){
      #mbx-keyviz{background:rgba(245,246,248,.65);border-color:rgba(0,0,0,.08)}
      #mbx-keyviz .k{background:rgba(245,246,248,.9);color:#1a1b1e;border-color:rgba(0,0,0,.08)}
      #mbx-keyviz .on{background:rgba(46,204,113,.9)}
    }

    /* Crosshair */
    #mbx-cross{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2147483644;pointer-events:none;opacity:0.9}

    /* Timer */
    #mbx-timer{position:fixed;right:50%;bottom:14px;transform:translateX(50%);z-index:2147483646;background:rgba(18,18,20,.75);color:#e9eef5;border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:6px 10px;font:13px/1 system-ui,Segoe UI,Roboto,Arial;display:none}
    #mbx-timer .laps{margin-top:6px;max-height:120px;overflow:auto;font-size:12px;opacity:.9}

    /* Fondo */
    #mbx-bg-under{position:fixed;inset:0;z-index:0;pointer-events:none;background-position:center center;background-size:cover;background-repeat:no-repeat;opacity:1;transition:opacity .4s ease,filter .4s ease}
    #mbx-bg-overlay{position:fixed;inset:0;z-index:2147483643;pointer-events:none;background-position:center center;background-size:cover;background-repeat:no-repeat;opacity:0;transition:opacity .3s ease;mix-blend-mode:multiply}

    /* Modo nocturno overlays */
    #mbx-night-dark{position:fixed;inset:0;z-index:2147483642;pointer-events:none;background:rgba(0,0,0,0);mix-blend-mode:multiply;opacity:0;transition:opacity .25s ease, background .25s ease}
    #mbx-night-warm{position:fixed;inset:0;z-index:2147483642;pointer-events:none;background:rgba(255,140,0,0);mix-blend-mode:overlay;opacity:0;transition:opacity .25s ease, background .25s ease}

    /* Forzar oscuro UI (no afecta canvas/img/video ni nuestros HUDs) */
    html.mbx-force-dark :not(canvas):not(video):not(img):not(#mbx-bar):not(#mbx-panel):not(#mbx-keyviz):not(#mbx-cross):not(#mbx-timer):not(#mbx-bg-under):not(#mbx-bg-overlay):not(#mbx-night-dark):not(#mbx-night-warm){
      filter: invert(1) hue-rotate(180deg) contrast(0.98) saturate(0.9);
    }

    html,body{background:transparent!important}
  `;
  const st = document.createElement('style'); st.textContent = css; document.documentElement.appendChild(st);

  // ---- Utils ----
  function makeDrag(handle,onStop,box){
    let dragging=false,sx=0,sy=0,sl=0,st=0,target=box||handle;
    const down=e=>{ if(e.button!==0) return; dragging=true; sx=e.clientX; sy=e.clientY; const r=target.getBoundingClientRect(); sl=r.left; st=r.top; document.addEventListener('mousemove',move); document.addEventListener('mouseup',up); target.style.transform='none'; };
    const move=e=>{ if(!dragging) return; const dx=e.clientX-sx, dy=e.clientY-sy; let nx=sl+dx, ny=st+dy; nx=Math.max(0,Math.min(nx,window.innerWidth-target.offsetWidth)); ny=Math.max(0,Math.min(ny,window.innerHeight-target.offsetHeight)); target.style.left=nx+'px'; target.style.top=ny+'px'; target.style.right='auto'; };
    const up=()=>{ dragging=false; document.removeEventListener('mousemove',move); document.removeEventListener('mouseup',up); const r=target.getBoundingClientRect(); onStop && onStop(r.left,r.top,target); };
    handle.addEventListener('mousedown',down);
  }
  function waitForBody(maxMs=10000){ return new Promise((res,rej)=>{ const t0=performance.now(); (function tick(){ if(document.body) return res(); if(performance.now()-t0>maxMs) return rej(new Error('Timeout <body>')); requestAnimationFrame(tick); })(); }); }

  // ---- Init ----
  waitForBody().then(init).catch(e=>console.error('[HUD v2.0.0] no inició',e));

  function init(){
    const root=document.documentElement;

    // Tinte horario
    const tint=document.createElement('div'); tint.id='mbx-tint'; root.appendChild(tint);
    root.style.setProperty('--mbx-tint', String(prefs.tintStrength));

    // Fondo
    const under=document.createElement('div'); under.id='mbx-bg-under';
    const over =document.createElement('div'); over.id ='mbx-bg-overlay';
    document.body.appendChild(under); document.body.appendChild(over);

    // Modo nocturno overlays
    const nmDark=document.createElement('div'); nmDark.id='mbx-night-dark';
    const nmWarm=document.createElement('div'); nmWarm.id='mbx-night-warm';
    document.body.appendChild(nmDark); document.body.appendChild(nmWarm);

    // ---- HUD ----
    const bar=document.createElement('div'); bar.id='mbx-bar';
    bar.innerHTML=`
      <span data-k="fps" class="fps"><b>FPS:</b> <span id="mbx-fps">--</span></span>
      <span class="sep"></span>
      <span data-k="ms"  class="ms"><b>MS:</b> <span id="mbx-ms">--</span></span>
      <span class="sep"></span>
      <span data-k="cps" class="cps"><b>CPS:</b> <span id="mbx-cps">--</span></span>
      <span class="sep"></span>
      <span data-k="max" class="max"><b>MAX:</b> <span id="mbx-max">--</span></span>
      <span class="sep"></span>
      <span data-k="pos" class="pos"><b>POS:</b> <span id="mbx-pos">--</span></span>
      <span class="sep"></span>
      <span data-k="bat"><span>🔋</span> <span id="mbx-battery" class="muted">--%</span></span>
      <span class="sep"></span>
      <span data-k="clk"><span>🕒</span> <span id="mbx-clock">--:--</span></span>
    `;
    document.body.appendChild(bar);
    if(prefs.hud.x!=null&&prefs.hud.y!=null){ bar.style.left=prefs.hud.x+'px'; bar.style.top=prefs.hud.y+'px'; bar.style.transform='none'; }
    bar.classList.toggle('mbx-hidden', !prefs.hud.visible);
    makeDrag(bar,(x,y)=>{ prefs.hud.x=x; prefs.hud.y=y; save(); });

    const fpsEl=bar.querySelector('#mbx-fps');
    const msEl =bar.querySelector('#mbx-ms');
    const cpsEl=bar.querySelector('#mbx-cps');
    const maxEl=bar.querySelector('#mbx-max');
    const posEl=bar.querySelector('#mbx-pos');
    const battEl=bar.querySelector('#mbx-battery');
    const clockEl=bar.querySelector('#mbx-clock');

    function syncHud(){
      bar.querySelector('[data-k="fps"]').style.display = prefs.toggles.showFPS?'':'none';
      bar.querySelector('[data-k="ms"]').style.display  = prefs.toggles.showMS?'':'none';
      bar.querySelector('[data-k="cps"]').style.display = prefs.toggles.showCPS?'':'none';
      bar.querySelector('[data-k="max"]').style.display = prefs.toggles.showMAX?'':'none';
      bar.querySelector('[data-k="pos"]').style.display = (prefs.toggles.showCoords && prefs.coords.enabled)?'':'none';
      bar.querySelector('[data-k="bat"]').style.display = prefs.toggles.showBattery?'':'none';
      bar.querySelector('[data-k="clk"]').style.display = prefs.toggles.showClock?'':'none';
    }
    syncHud();

    // ---- Panel ----
    const panel=document.createElement('div'); panel.id='mbx-panel';
    panel.innerHTML=`
      <div class="hdr">
        <span>Panel Miniblox HUD</span>
        <div style="display:flex;gap:8px">
          <button class="btn" id="btn-close">Cerrar (H)</button>
        </div>
      </div>
      <div class="body">

        <div class="row">
          <label><input type="checkbox" id="opt-hud"> Mostrar HUD</label>
          <button class="btn" id="btn-reset-max">Reset MAX</button>
        </div>

        <div class="row">
          <label><input type="checkbox" id="opt-auto"> Auto-Tema (Día/Atardecer/Noche)</label>
          <div class="muted">F9: ON/OFF · F10: rotar (si Auto OFF)</div>
        </div>
        <div class="row">
          <span class="muted">Tema manual:</span>
          <div>
            <label><input type="radio" name="th" value="day"> Día</label>
            <label><input type="radio" name="th" value="sunset"> Atardecer</label>
            <label><input type="radio" name="th" value="night"> Noche</label>
          </div>
        </div>
        <div class="row">
          <label>Tinte HUD</label>
          <input type="range" id="rng-tint" min="0" max="100">
        </div>

        <hr style="opacity:.2">

        <div class="row"><b>Modo nocturno</b> <label><input type="checkbox" id="nm-enabled"> Activar</label></div>
        <div class="row"><span>Intensidad</span><input type="range" id="nm-strength" min="0" max="100"></div>
        <div class="row"><span>Calidez</span><input type="range" id="nm-warmth" min="0" max="100"></div>
        <div class="row"><label><input type="checkbox" id="nm-forcedark"> Forzar oscuro UI</label></div>
        <div class="row muted">Atajo: N (Nocturno ON/OFF) · Shift+N (Forzar oscuro)</div>

        <hr style="opacity:.2">

        <div class="row"><b>Elementos HUD</b></div>
        <div class="row" style="gap:12px">
          <label><input type="checkbox" id="tg-fps"> FPS</label>
          <label><input type="checkbox" id="tg-ms"> MS</label>
          <label><input type="checkbox" id="tg-cps"> CPS</label>
          <label><input type="checkbox" id="tg-max"> MAX</label>
          <label><input type="checkbox" id="tg-pos"> Coordenadas</label>
          <label><input type="checkbox" id="tg-bat"> Batería</label>
          <label><input type="checkbox" id="tg-clk"> Hora</label>
        </div>

        <div class="row">
          <span>Modo coordenadas</span>
          <select id="pos-mode">
            <option value="auto">Auto (experimental)</option>
            <option value="cursor">Cursor (pantalla)</option>
            <option value="canvas">Cursor (canvas)</option>
            <option value="relative">Δ relativo (pointer-lock)</option>
          </select>
          <button class="btn" id="pos-reset" title="Reset Δ relativo (Alt+R)">Reset Δ</button>
        </div>

        <hr style="opacity:.2">

        <div class="row"><b>Key-Visualizer</b> <label><input type="checkbox" id="tg-keyviz"> Activo</label></div>
        <div class="row muted">K: mostrar/ocultar · arrastra el recuadro para mover (se guarda)</div>

        <div class="row"><b>Crosshair</b> <label><input type="checkbox" id="tg-cross"> Activo</label></div>
        <div class="row"><span>Tamaño</span><input type="range" id="cr-size" min="4" max="40"></div>
        <div class="row"><span>Grosor</span><input type="range" id="cr-thick" min="1" max="6"></div>
        <div class="row"><span>Gap</span><input type="range" id="cr-gap" min="0" max="20"></div>
        <div class="row"><span>Opacidad</span><input type="range" id="cr-op" min="10" max="100"></div>

        <hr style="opacity:.2">

        <div class="row"><b>Metrónomo</b> <label><input type="checkbox" id="tg-metro"> Activo</label></div>
        <div class="row"><span>BPM</span><input type="range" id="mt-bpm" min="40" max="240"></div>
        <div class="row"><span>Volumen</span><input type="range" id="mt-vol" min="0" max="100"></div>

        <hr style="opacity:.2">

        <div class="row"><b>Timer</b> <label><input type="checkbox" id="tg-timer"> Visible</label></div>
        <div class="row muted">T: Start/Pause · Y: Lap · U: Reset</div>

        <hr style="opacity:.2">

        <div class="row"><b>Fondo (BG)</b> <label><input type="checkbox" id="bg-enabled"> Activo</label></div>
        <div class="row"><span>Modo</span>
          <select id="bg-mode">
            <option value="under">Detrás</option>
            <option value="overlay">Superposición</option>
          </select>
        </div>
        <div class="row"><span>Mezcla (overlay)</span>
          <select id="bg-blend">
            <option value="multiply">multiply</option>
            <option value="screen">screen</option>
            <option value="overlay">overlay</option>
          </select>
        </div>
        <div class="row"><span>Opacidad (overlay)</span><input type="range" id="bg-op" min="0" max="100"></div>
        <div class="row"><label><input type="checkbox" id="bg-auto"> Auto-fase (día/atardecer/noche)</label>
          <button class="btn" id="bg-next">Cambiar foto</button>
        </div>
        <div class="row">
          <label><input type="checkbox" id="bg-onlylobby"> Solo en lobby (ocultar en servidores)</label>
        </div>
        <div class="row muted">Atajos BG: B ON/OFF · V modo · [ ] opacidad · M mezcla</div>

      </div>
    `;
    document.body.appendChild(panel);
    if(prefs.panel.x!=null&&prefs.panel.y!=null){ panel.style.left=prefs.panel.x+'px'; panel.style.top=prefs.panel.y+'px'; panel.style.right='auto'; }
    panel.classList.toggle('visible', !!prefs.panel.visible);
    makeDrag(panel, ()=>{ const r=panel.getBoundingClientRect(); prefs.panel.x=r.left; prefs.panel.y=r.top; prefs.panel.visible=true; save(); }, panel);

    const $ = s=>panel.querySelector(s);
    $('#opt-hud').checked = !!prefs.hud.visible;
    $('#opt-auto').checked = !!prefs.autoTheme;
    panel.querySelectorAll('input[name="th"]').forEach(r=> r.checked = (r.value===prefs.manualPhase));
    $('#rng-tint').value = Math.round((prefs.tintStrength??1)*100);
    $('#tg-fps').checked=prefs.toggles.showFPS; $('#tg-ms').checked=prefs.toggles.showMS; $('#tg-cps').checked=prefs.toggles.showCPS; $('#tg-max').checked=prefs.toggles.showMAX; $('#tg-bat').checked=prefs.toggles.showBattery; $('#tg-clk').checked=prefs.toggles.showClock; $('#tg-pos').checked=prefs.toggles.showCoords;
    $('#pos-mode').value = prefs.coords.mode;

    // Modo nocturno UI init
    $('#nm-enabled').checked = !!prefs.night.enabled;
    $('#nm-forcedark').checked = !!prefs.night.forceDark;
    $('#nm-strength').value = Math.round(clamp01(prefs.night.strength)*100);
    $('#nm-warmth').value  = Math.round(clamp01(prefs.night.warmth)*100);

    // ---- Key-Visualizer (movible) ----
    const keyviz=document.createElement('div'); keyviz.id='mbx-keyviz';
    keyviz.innerHTML = `${['W','A','S','D','Space','Shift','Ctrl'].map(k=>`<div class="k" data-k="${k}"><span>${k==='Space'?'Space':k}</span><div class="t">0ms</div></div>`).join('')}`;
    document.body.appendChild(keyviz);
    if (prefs.keyviz.x!=null && prefs.keyviz.y!=null) { keyviz.style.left=prefs.keyviz.x+'px'; keyviz.style.top=prefs.keyviz.y+'px'; keyviz.style.right='auto'; keyviz.style.bottom='auto'; }
    keyviz.style.display = prefs.keyviz.enabled ? '' : 'none';
    makeDrag(keyviz, (x,y)=>{ prefs.keyviz.x=x; prefs.keyviz.y=y; save(); }, keyviz);

    const keyMap = { 'KeyW':'W','KeyA':'A','KeyS':'S','KeyD':'D','Space':'Space','ShiftLeft':'Shift','ShiftRight':'Shift','ControlLeft':'Ctrl','ControlRight':'Ctrl' };
    const downAt = {};
    function setKeyState(code,down){
      const name = keyMap[code]; if(!name) return;
      const el = keyviz.querySelector(`.k[data-k="${name}"]`); if(!el) return;
      if(down){ downAt[name]=performance.now(); el.classList.add('on'); }
      else{
        const t=downAt[name]; const ms = t?Math.round(performance.now()-t):0;
        el.classList.remove('on'); el.querySelector('.t').textContent = ms+'ms';
        delete downAt[name];
      }
    }
    window.addEventListener('keydown',e=>{ const t=e.target; if(t && (t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.isContentEditable)) return; setKeyState(e.code,true); },{passive:true});
    window.addEventListener('keyup',e=>{ setKeyState(e.code,false); },{passive:true});

    $('#tg-keyviz').checked = prefs.keyviz.enabled;
    $('#tg-keyviz').addEventListener('change', e=>{ prefs.keyviz.enabled=e.target.checked; keyviz.style.display=prefs.keyviz.enabled?'':'none'; save(); });

    // ---- Crosshair ----
    const cross=document.createElement('canvas'); cross.id='mbx-cross'; document.body.appendChild(cross);
    function drawCross(){
      cross.width = Math.ceil((prefs.cross.size+prefs.cross.gap)*2 + 20);
      cross.height = cross.width;
      const ctx = cross.getContext('2d');
      ctx.clearRect(0,0,cross.width,cross.height);
      ctx.globalAlpha = clamp(prefs.cross.opacity,0,1);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = clamp(prefs.cross.thick,1,6);
      const cx = cross.width/2, cy = cross.height/2, s = clamp(prefs.cross.size,4,40), g = clamp(prefs.cross.gap,0,20);
      ctx.beginPath();
      ctx.moveTo(cx - g - s, cy); ctx.lineTo(cx - g, cy);
      ctx.moveTo(cx + g + s, cy); ctx.lineTo(cx + g, cy);
      ctx.moveTo(cx, cy - g - s); ctx.lineTo(cx, cy - g);
      ctx.moveTo(cx, cy + g + s); ctx.lineTo(cx, cy + g);
      ctx.stroke();
    }
    function syncCrossVisibility(){ cross.style.display = prefs.cross.enabled ? '' : 'none'; if (prefs.cross.enabled) drawCross(); }
    syncCrossVisibility();

    // ---- Metrónomo ----
    let metroTimer=null;
    const audio = new (window.AudioContext||window.webkitAudioContext)();
    function tick(){ const o=audio.createOscillator(); const g=audio.createGain(); o.type='square'; o.frequency.value=1000; g.gain.value=clamp(prefs.metro.volume??0.2,0,1); o.connect(g); g.connect(audio.destination); o.start(); setTimeout(()=>o.stop(),60); }
    function startMetro(){ stopMetro(); const interval = Math.max(250, Math.round(60000/Math.max(40,Math.min(240,prefs.metro.bpm)))); metroTimer=setInterval(tick, interval); }
    function stopMetro(){ if(metroTimer){ clearInterval(metroTimer); metroTimer=null; } }
    if (prefs.metro.enabled) startMetro();

    // ---- Timer ----
    const tbox=document.createElement('div'); tbox.id='mbx-timer';
    tbox.innerHTML = `<div><span id="tm-main">00:00.000</span></div><div class="laps" id="tm-laps"></div>`;
    document.body.appendChild(tbox);
    tbox.style.display = prefs.timer.visible ? '' : 'none';
    let tStart=null, tElapsed=0, tRunning=false, rafId=null;
    const $tm = id=>tbox.querySelector(id);
    function fmt(ms){ const m=Math.floor(ms/60000), s=Math.floor((ms%60000)/1000), x=ms%1000; return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(x).padStart(3,'0')}`; }
    function loop(){ if(!tRunning) return; const now=performance.now(); const total=tElapsed+(now-tStart); $tm('#tm-main').textContent=fmt(total); rafId=requestAnimationFrame(loop); }
    function tmStartPause(){ if(!tRunning){ tRunning=true; tStart=performance.now(); rafId=requestAnimationFrame(loop); } else { tRunning=false; tElapsed+=performance.now()-tStart; cancelAnimationFrame(rafId); } }
    function tmLap(){ const txt=$tm('#tm-main').textContent; const div=document.createElement('div'); div.textContent='Lap: '+txt; $tm('#tm-laps').prepend(div); }
    function tmReset(){ tRunning=false; tElapsed=0; $tm('#tm-main').textContent='00:00.000'; $tm('#tm-laps').innerHTML=''; if(rafId) cancelAnimationFrame(rafId); }

    // ---- FPS / MS / CPS / Batería / Reloj ----
    let last=performance.now(), frames=0, running=true;
    const ftSamples = []; const FT_N = 60;
    let prevRAF = performance.now();
    function fpsLoop(now){
      if(!running){ requestAnimationFrame(fpsLoop); return; }
      const dt = now - prevRAF; prevRAF = now;
      ftSamples.push(dt); if(ftSamples.length>FT_N) ftSamples.shift();
      const avgMs = Math.round(ftSamples.reduce((a,b)=>a+b,0)/ftSamples.length);
      if (prefs.toggles.showMS){ msEl.textContent = String(avgMs); msEl.className = 'ms ' + (avgMs<=8?'good':avgMs<=20?'warn':'bad'); }
      frames++;
      if(now>=last+1000){
        const fps=frames; frames=0; last=now;
        if(prefs.toggles.showFPS){ fpsEl.textContent=String(fps); fpsEl.className = 'fps ' + (fps>=55?'good':fps>=30?'warn':'bad'); }
      }
      requestAnimationFrame(fpsLoop);
    }
    requestAnimationFrame(fpsLoop);
    document.addEventListener('visibilitychange',()=>{ running=!document.hidden; });

    // CPS
    const clickTimes=[]; let maxCps=0;
    function prune(n){ while(clickTimes.length && n-clickTimes[0]>1000) clickTimes.shift(); }
    function updateCps(n){ prune(n); const cps=clickTimes.length; if(cps>maxCps){ maxCps=cps; if(prefs.toggles.showMAX) maxEl.textContent=String(maxCps); } if(prefs.toggles.showCPS){ cpsEl.textContent=String(cps); } }
    window.addEventListener('pointerdown',e=>{ if(e.isPrimary===false) return; const n=performance.now(); clickTimes.push(n); updateCps(n); },{passive:true});
    setInterval(()=>updateCps(performance.now()),100);

    // Batería
    function renderBattery(level,charging){
      if(!prefs.toggles.showBattery) return;
      if(level==null){ battEl.textContent='N/A'; return; }
      const pct=Math.round(level*100);
      battEl.textContent = (charging?'⚡ ':'') + pct + '%';
      battEl.classList.remove('good','warn','bad');
      battEl.classList.add(pct>=60?'good':pct>=25?'warn':'bad');
    }
    if ('getBattery' in navigator && typeof navigator.getBattery==='function') {
      navigator.getBattery().then(b=>{
        renderBattery(b.level,b.charging);
        b.addEventListener('levelchange', ()=>renderBattery(b.level,b.charging));
        b.addEventListener('chargingchange', ()=>renderBattery(b.level,b.charging));
        setInterval(()=>renderBattery(b.level,b.charging), 5000);
      }).catch(()=>renderBattery(null,false));
    } else {
      renderBattery(null,false);
      const tryOnce = setInterval(()=>{
        if ('getBattery' in navigator && typeof navigator.getBattery==='function') { clearInterval(tryOnce);
          navigator.getBattery().then(b=>{ renderBattery(b.level,b.charging); setInterval(()=>renderBattery(b.level,b.charging),5000); });
        }
      }, 10000);
    }

    // Reloj
    function clk(){ if(!prefs.toggles.showClock) return; const d=new Date(); clockEl.textContent=`${pad(d.getHours())}:${pad(d.getMinutes())}`; }
    clk(); setInterval(clk,1000);

    // ---- Tema horario ----
    function phaseFromHour(h){ if (h>=7 && h<18) return 'day'; if (h>=18 && h<20) return 'sunset'; return 'night'; }
    function applyPhase(p){
      root.classList.remove('mbx-theme-day','mbx-theme-sunset','mbx-theme-night');
      root.classList.add(p==='day'?'mbx-theme-day':p==='sunset'?'mbx-theme-sunset':'mbx-theme-night');
    }
    function tickTheme(){ const p = prefs.autoTheme ? phaseFromHour(new Date().getHours()) : prefs.manualPhase; applyPhase(p); }
    tickTheme(); setInterval(tickTheme, 60*1000);

    // ---- Fondo (con “Solo en lobby”) ----
    const inGameplay = ()=> {
      if (document.pointerLockElement) return true;
      if (document.fullscreenElement) return true;
      const bigCanvas = Array.from(document.querySelectorAll('canvas')).some(c=>{
        const r = c.getBoundingClientRect();
        return r.width >= window.innerWidth*0.8 && r.height >= window.innerHeight*0.8;
      });
      return bigCanvas;
    };
    const bgAllowed = ()=> prefs.bg.enabled && (!prefs.bg.onlyInLobby || !inGameplay());
    function applyBgVisibility(){
      const allowed = bgAllowed();
      if (!allowed){ under.style.opacity='0'; over.style.opacity='0'; return; }
      if (prefs.bg.mode==='under'){ under.style.opacity='1'; over.style.opacity='0'; }
      else { under.style.opacity='0'; over.style.opacity=String(prefs.bg.overlayOpacity); }
    }
    const currentBgPhase = ()=>{
      if (!prefs.bg.autoPhase && prefs.manualPhase) return prefs.manualPhase;
      const h=new Date().getHours(), H=prefs.bg.hours;
      if(inRange(h,H.day)) return 'day'; if(inRange(h,H.sunset)) return 'sunset'; return 'night';
    };
    const applyUnderFilters = (phase)=>{ const dim=prefs.bg.dim?.[phase] ?? 0.1; under.style.filter=`brightness(${1-dim})`; };
    const setOverlayOpacity = (v)=>{ prefs.bg.overlayOpacity=clamp01(v); over.style.opacity=String(prefs.bg.overlayOpacity); };
    const setBlend=(m)=>{ prefs.bg.blend=m; over.style.mixBlendMode=m; };
    const chooseUrl=(phase)=>{ const list=prefs.bg.photos?.[phase]||[]; return list.length?pick(list):''; };
    const preload=(url)=> new Promise(res=>{ if(!url) return res(); const img=new Image(); img.crossOrigin='anonymous'; img.onload=res; img.onerror=res; img.src=url; });

    async function setBackground(force=false){
      if(!prefs.bg.enabled){ applyBgVisibility(); return; }
      const phase=currentBgPhase();
      let url=prefs.bg.currentUrl;
      if(force || !prefs.bg.currentPhase || prefs.bg.currentPhase!==phase || !url) url=chooseUrl(phase);
      if(!url) return;
      await preload(url);
      under.style.backgroundImage=`url("${url}")`;
      over.style.backgroundImage =`url("${url}")`;
      applyUnderFilters(phase);
      prefs.bg.currentPhase=phase; prefs.bg.currentUrl=url; save();
      applyBgVisibility();
    }
    setBlend(prefs.bg.blend); setOverlayOpacity(prefs.bg.overlayOpacity); setBackground(true);
    setInterval(()=>setBackground(false), 60*1000);

    // Mantener html/body transparentes
    const moKeep=new MutationObserver(()=>{ document.documentElement.style.setProperty('background','transparent','important'); document.body.style.setProperty('background','transparent','important'); });
    moKeep.observe(document.documentElement,{attributes:true,attributeFilter:['style','class']});
    moKeep.observe(document.body,{attributes:true,attributeFilter:['style','class']});

    function checkBgContext(){ applyBgVisibility(); }
    (function(){
      const _ps = history.pushState;
      history.pushState = function(...a){ const r=_ps.apply(this,a); setTimeout(checkBgContext,0); return r; };
      const _rs = history.replaceState;
      history.replaceState = function(...a){ const r=_rs.apply(this,a); setTimeout(checkBgContext,0); return r; };
      window.addEventListener('popstate', checkBgContext);
    })();
    ['pointerlockchange','fullscreenchange','resize','orientationchange','visibilitychange']
      .forEach(ev => window.addEventListener(ev, checkBgContext, {passive:true}));
    const moBg = new MutationObserver(()=>{ checkBgContext(); });
    moBg.observe(document.body, {childList:true,subtree:true});
    setInterval(checkBgContext, 2000);

    // ---- Coordenadas ----
    let cursor = {x:0,y:0}, canvasRef=null;
    function findMainCanvas(){
      const cs = Array.from(document.querySelectorAll('canvas'));
      if (!cs.length) return null;
      cs.sort((a,b)=> (b.width*b.height) - (a.width*a.height));
      return cs[0] || null;
    }
    function updateCanvasRef(){ canvasRef = findMainCanvas(); }
    updateCanvasRef();
    const moCanvas = new MutationObserver(()=>updateCanvasRef());
    moCanvas.observe(document.body,{childList:true,subtree:true});
    window.addEventListener('pointermove', (e)=>{
      cursor.x = e.clientX; cursor.y = e.clientY;
      if (document.pointerLockElement && prefs.coords.mode === 'relative') {
        prefs.coords.rel.x += e.movementX||0; prefs.coords.rel.y += e.movementY||0;
      }
    }, {passive:true});
    const tryAutoDetect=()=>{
      const nodes = Array.from(document.querySelectorAll('div,span,p,small,b'));
      for (const el of nodes) {
        const txt = (el.innerText||'').trim(); if (!txt || txt.length>80) continue;
        const m = txt.match(/x\s*[:=]\s*(-?\d+(\.\d+)?)\D+y\s*[:=]\s*(-?\d+(\.\d+)?)(?:\D+z\s*[:=]\s*(-?\d+(\.\d+)?))?/i);
        if (m) return {x:+m[1], y:+m[3], z:m[5]!=null?+m[5]:null};
      } return null;
    };
    function renderCoords(){
      if (!(prefs.toggles.showCoords && prefs.coords.enabled)) return;
      let out='--'; const mode=prefs.coords.mode;
      if (mode==='cursor') out = `${Math.round(cursor.x)},${Math.round(cursor.y)}`;
      else if (mode==='canvas' && canvasRef){ const r=canvasRef.getBoundingClientRect(); out = `${Math.round(cursor.x-r.left)},${Math.round(cursor.y-r.top)}`; }
      else if (mode==='relative') out = `Δ${Math.round(prefs.coords.rel.x)},${Math.round(prefs.coords.rel.y)}`;
      else { const got=tryAutoDetect(); out = got ? (got.z==null?`${got.x},${got.y}`:`${got.x},${got.y},${got.z}`) : '—'; }
      posEl.textContent = out;
    }
    setInterval(renderCoords, 100);

    // ---- Modo nocturno (lógica) ----
    function applyNight(){
      const on = !!prefs.night.enabled;
      const strength = clamp01(prefs.night.strength);
      const warmth  = clamp01(prefs.night.warmth);
      // Oscurecer
      nmDark.style.opacity = on ? '1' : '0';
      nmDark.style.background = `rgba(0,0,0, ${on ? strength : 0})`;
      // Calidez
      nmWarm.style.opacity = on && warmth>0 ? '1' : '0';
      nmWarm.style.background = `rgba(255,140,0, ${on ? warmth*0.25 : 0})`;
      // Forzar oscuro UI
      document.documentElement.classList.toggle('mbx-force-dark', on && !!prefs.night.forceDark);
    }
    applyNight();

    // ---- Eventos Panel ----
    $('#btn-close').addEventListener('click', ()=>togglePanel(false));
    function togglePanel(force){ const show=(typeof force==='boolean')?force:!panel.classList.contains('visible'); panel.classList.toggle('visible',show); prefs.panel.visible=show; save(); }

    $('#opt-hud').addEventListener('change', e=>{ prefs.hud.visible=e.target.checked; bar.classList.toggle('mbx-hidden', !prefs.hud.visible); save(); });
    $('#btn-reset-max').addEventListener('click', ()=>{ maxCps=0; if(prefs.toggles.showMAX) maxEl.textContent='--'; });

    $('#opt-auto').addEventListener('change', e=>{ prefs.autoTheme=e.target.checked; save(); tickTheme(); });
    panel.querySelectorAll('input[name="th"]').forEach(r=> r.addEventListener('change', e=>{ if(!prefs.autoTheme && e.target.checked){ prefs.manualPhase=e.target.value; save(); tickTheme(); setBackground(true); } }));
    $('#rng-tint').addEventListener('input', e=>{ prefs.tintStrength=clamp(Number(e.target.value)/100,0,1); root.style.setProperty('--mbx-tint', String(prefs.tintStrength)); save(); tickTheme(); });

    // Night panel
    $('#nm-enabled').addEventListener('change', e=>{ prefs.night.enabled=e.target.checked; save(); applyNight(); });
    $('#nm-forcedark').addEventListener('change', e=>{ prefs.night.forceDark=e.target.checked; save(); applyNight(); });
    $('#nm-strength').addEventListener('input', e=>{ prefs.night.strength = clamp(Number(e.target.value)/100,0,1); save(); applyNight(); });
    $('#nm-warmth').addEventListener('input', e=>{ prefs.night.warmth  = clamp(Number(e.target.value)/100,0,1); save(); applyNight(); });

    // HUD toggles
    $('#tg-fps').addEventListener('change',e=>{ prefs.toggles.showFPS=e.target.checked; save(); syncHud(); });
    $('#tg-ms').addEventListener('change', e=>{ prefs.toggles.showMS=e.target.checked; save(); syncHud(); });
    $('#tg-cps').addEventListener('change',e=>{ prefs.toggles.showCPS=e.target.checked; save(); syncHud(); });
    $('#tg-max').addEventListener('change',e=>{ prefs.toggles.showMAX=e.target.checked; save(); syncHud(); });
    $('#tg-bat').addEventListener('change',e=>{ prefs.toggles.showBattery=e.target.checked; save(); syncHud(); });
    $('#tg-clk').addEventListener('change',e=>{ prefs.toggles.showClock=e.target.checked; save(); syncHud(); });
    $('#tg-pos').addEventListener('change',e=>{ prefs.toggles.showCoords=e.target.checked; save(); syncHud(); });

    // Coordenadas
    $('#pos-mode').addEventListener('change',e=>{ prefs.coords.mode = e.target.value; save(); renderCoords(); });
    $('#pos-reset').addEventListener('click', ()=>{ prefs.coords.rel.x=0; prefs.coords.rel.y=0; save(); renderCoords(); });

    // Crosshair
    $('#tg-cross').addEventListener('change',e=>{ prefs.cross.enabled=e.target.checked; save(); syncCrossVisibility(); });
    $('#cr-size').addEventListener('input',e=>{ prefs.cross.size=Number(e.target.value); save(); drawCross(); });
    $('#cr-thick').addEventListener('input',e=>{ prefs.cross.thick=Number(e.target.value); save(); drawCross(); });
    $('#cr-gap').addEventListener('input',e=>{ prefs.cross.gap=Number(e.target.value); save(); drawCross(); });
    $('#cr-op').addEventListener('input',e=>{ prefs.cross.opacity=clamp(Number(e.target.value)/100,0.1,1); save(); drawCross(); });

    // Metro
    $('#tg-metro').addEventListener('change',e=>{ prefs.metro.enabled=e.target.checked; save(); if(prefs.metro.enabled){ startMetro(); } else { stopMetro(); } });
    $('#mt-bpm').addEventListener('input',e=>{ prefs.metro.bpm=Number(e.target.value); save(); if(metroTimer) startMetro(); });
    $('#mt-vol').addEventListener('input',e=>{ prefs.metro.volume=clamp(Number(e.target.value)/100,0,1); save(); if(metroTimer) startMetro(); });

    // Timer
    $('#tg-timer').addEventListener('change',e=>{ prefs.timer.visible=e.target.checked; tbox.style.display=prefs.timer.visible?'':'none'; save(); });

    // BG
    $('#bg-enabled').addEventListener('change',e=>{ prefs.bg.enabled=e.target.checked; save(); applyBgVisibility(); });
    $('#bg-mode').addEventListener('change',e=>{ prefs.bg.mode=e.target.value; save(); applyBgVisibility(); });
    $('#bg-blend').addEventListener('change',e=>{ setBlend(e.target.value); save(); });
    $('#bg-op').addEventListener('input',e=>{ setOverlayOpacity(Number(e.target.value)/100); save(); });
    $('#bg-auto').addEventListener('change',e=>{ prefs.bg.autoPhase=e.target.checked; save(); setBackground(true); });
    $('#bg-next').addEventListener('click',()=>{ prefs.bg.currentUrl=null; setBackground(true); });
    $('#bg-onlylobby').checked = !!prefs.bg.onlyInLobby;
    $('#bg-onlylobby').addEventListener('change', e=>{ prefs.bg.onlyInLobby = e.target.checked; save(); applyBgVisibility(); });

    // ---- Hotkeys ----
    window.addEventListener('keydown', e=>{
      const t=e.target; if(t && (t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.isContentEditable)) return;
      if(e.code==='KeyH'){ e.preventDefault(); const show=!panel.classList.contains('visible'); panel.classList.toggle('visible',show); prefs.panel.visible=show; save(); }
      else if(e.code==='ShiftRight'){ e.preventDefault(); prefs.hud.visible=!prefs.hud.visible; bar.classList.toggle('mbx-hidden', !prefs.hud.visible); $('#opt-hud').checked=prefs.hud.visible; save(); }
      else if(e.code==='F8'){ e.preventDefault(); maxCps=0; if(prefs.toggles.showMAX) maxEl.textContent='--'; }
      else if(e.code==='F9'){ e.preventDefault(); prefs.autoTheme=!prefs.autoTheme; $('#opt-auto').checked=prefs.autoTheme; save(); tickTheme(); setBackground(true); }
      else if(e.code==='F10'){ if(!prefs.autoTheme){ e.preventDefault(); prefs.manualPhase = prefs.manualPhase==='day'?'sunset':(prefs.manualPhase==='sunset'?'night':'day'); panel.querySelectorAll('input[name="th"]').forEach(r=> r.checked=(r.value===prefs.manualPhase)); save(); tickTheme(); setBackground(true); } }
      // Fondo
      else if(e.code==='KeyB'){ prefs.bg.enabled=!prefs.bg.enabled; $('#bg-enabled').checked=prefs.bg.enabled; save(); applyBgVisibility(); }
      else if(e.code==='KeyV'){ prefs.bg.mode = (prefs.bg.mode==='under')?'overlay':'under'; $('#bg-mode').value=prefs.bg.mode; save(); applyBgVisibility(); }
      else if(e.code==='BracketLeft'){ if(prefs.bg.mode==='overlay'){ prefs.bg.overlayOpacity = clamp01(prefs.bg.overlayOpacity-0.05); $('#bg-op').value=Math.round(prefs.bg.overlayOpacity*100); save(); over.style.opacity=String(prefs.bg.overlayOpacity); } }
      else if(e.code==='BracketRight'){ if(prefs.bg.mode==='overlay'){ prefs.bg.overlayOpacity = clamp01(prefs.bg.overlayOpacity+0.05); $('#bg-op').value=Math.round(prefs.bg.overlayOpacity*100); save(); over.style.opacity=String(prefs.bg.overlayOpacity); } }
      else if(e.code==='KeyM'){ const order=['multiply','screen','overlay']; const i=order.indexOf(prefs.bg.blend); const nxt=order[(i+1)%order.length]; prefs.bg.blend=nxt; $('#bg-blend').value=nxt; save(); over.style.mixBlendMode=nxt; }
      // Key-Visualizer
      else if(e.code==='KeyK'){ prefs.keyviz.enabled=!prefs.keyviz.enabled; keyviz.style.display=prefs.keyviz.enabled?'':'none'; $('#tg-keyviz').checked=prefs.keyviz.enabled; save(); }
      // Coordenadas
      else if(e.code==='KeyC'){ prefs.coords.enabled=!prefs.coords.enabled; $('#tg-pos').checked=prefs.coords.enabled; save(); syncHud(); }
      else if(e.code==='KeyR' && e.altKey){ prefs.coords.rel.x=0; prefs.coords.rel.y=0; save(); }
      // Nocturno
      else if(e.code==='KeyN' && !e.shiftKey){ prefs.night.enabled=!prefs.night.enabled; $('#nm-enabled').checked=prefs.night.enabled; save(); applyNight(); }
      else if(e.code==='KeyN' && e.shiftKey){ prefs.night.forceDark=!prefs.night.forceDark; $('#nm-forcedark').checked=prefs.night.forceDark; save(); applyNight(); }
      else if(e.code==='Backspace' && e.ctrlKey && e.altKey){ e.preventDefault(); if(confirm('¿Borrar preferencias?')){ localStorage.removeItem(STORE); location.reload(); } }
    }, {passive:false});

    console.log('[Miniblox HUD v2.0.0] N nocturno · Shift+N forzar oscuro · H panel · K keyviz · Shift der HUD · F8 MAX · F9 AutoTema · F10 Tema · B/V/[ ]/M BG');
  }
})();
