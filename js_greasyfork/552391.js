// ==UserScript==
// @name         Evades.io - NipachuMod
// @namespace    https://evades.io/
// @version      1.0.0
// @description  HUD (H): Zoom+Reset, Anti-AFK, Tracers, Time Travel (-2.24s projected), Rainbow Aura (slider), Avoid (clearance < 25), Invites highlighter, LB/Chat/ChatH toggles, Region filter, Tryhard toggle
// @match        https://evades.io/*
// @match        https://*.evades.io/*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/552391/Evadesio%20-%20NipachuMod.user.js
// @updateURL https://update.greasyfork.org/scripts/552391/Evadesio%20-%20NipachuMod.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ---------- Styles ----------
  GM_addStyle(`
    @keyframes nmRainbow{0%{color:red;}16.666%{color:orange;}33.333%{color:yellow;}50%{color:green;}66.666%{color:blue;}83.333%{color:indigo;}100%{color:violet;}}
    #e_hud{position:fixed;left:28px;top:28px;z-index:2147483647;background:rgba(18,18,18,.94);color:#fff;padding:12px;border-radius:10px;border:1px solid #585858;box-shadow:0 8px 22px rgba(0,0,0,.55);font:14px system-ui,Segoe UI,Roboto,Arial;user-select:none;min-width:560px;display:none}
    #e_hud .hdr{cursor:move;display:flex;gap:10px;align-items:center;margin-bottom:10px}
    #e_hud .hdr .title{font-weight:700;font-size:18px;animation:nmRainbow 4s linear infinite}
    #e_hud .sub{font-size:11px;color:#aaa;margin-left:8px}
    #e_hud .row{display:flex;gap:8px;align-items:center}
    #e_hud .row.wrap{flex-wrap:wrap}
    #e_hud .section{border-top:1px solid #2f2f2f;margin:10px 0}
    .nm-btn{background:#030303;border:1px solid #2a2a2a;color:#fff;padding:6px 10px;border-radius:8px;cursor:pointer;transition:background .2s,transform .06s}
    .nm-btn:hover{background:#121212}.nm-btn:active{transform:translateY(1px)}.nm-btn:disabled{opacity:.6;cursor:default}
    #e_hud input[type="range"]{flex:1;height:6px;background:#4a5568;border-radius:999px;accent-color:#63b3ed}
    #e_hud input[type="text"]{flex:1;min-width:180px;background:#0e0e0e;border:1px solid #2a2a2a;color:#fff;padding:6px 8px;border-radius:8px}
    #nm_changelog{width:100%;max-height:220px;color:#fff;border:1px solid #585858;border-radius:5px;overflow:auto;background:rgba(0,0,0,.55);padding:10px;display:none}
    #nm_changelog h3{margin:0 0 6px;font-weight:700;font-size:16px}
    #nm_changelog .entry{font-size:13px;color:#ddd;margin:6px 0}
    canvas#nm_tracer{position:fixed;left:0;top:0;pointer-events:none;z-index:2147483646}

    /* Invite chips + leaderboard glow */
    .nm-chip{display:inline-flex;align-items:center;gap:6px;background:#111;border:1px solid #3a3a3a;border-radius:999px;padding:2px 8px;margin:2px 4px 0 0}
    .nm-chip .x{cursor:pointer;color:#bbb}
    .nm-lb-glow{box-shadow:0 0 12px rgba(0,200,255,.8); outline:1px solid rgba(0,200,255,.7)}
  `);

  // ---------- Storage / defaults ----------
  const STORE='evades_nipachumod', POSL='hud_left', POST='hud_top';
  let hudLeft=num(GM_getValue(POSL,28),28), hudTop=num(GM_getValue(POST,28),28);
  const PRESETS_LB=[0.8,1.0,1.2,1.4], PRESETS_CHAT=[0.8,1.0,1.2,1.4], PRESETS_CH=[150,200,260,320];

  const defaults={
    leaderboardScale:1.0, chatScale:1.0, chatHeight:200, hideUI:false, filterEnabled:false,
    zoom:1.0, antiAfk:false, antiAfkSeconds:45,
    tracersEnabled:true, tracerLine:2, tracerShowDist:true, tracerFont:'12px Arial',
    tracerLabelOffsetX:4, tracerLabelOffsetY:-4, tracerFallbackRadius:20,
    ttiEnabled:true,
    auraEnabled:true, auraRadius:200,
    showChangelog:true,
    avoidEnabled:false,
    invitesEnabled:true,
    invites:[] // array of names (string)
  };
  let st=load(STORE,defaults);

  // ---------- Game access helpers ----------
  function getCamera(){
    const q=document.querySelector('div.quests-launcher'); if(!q) return null;
    const rk=Object.keys(q).find(k=>k.startsWith('__reactFiber$'));
    return rk ? q[rk]?.memoizedProps?.children?._owner?.stateNode?.renderer?.camera : null;
  }
  function refs(){
    const el=document.querySelector('div.quests-launcher'); if(!el) return null;
    const fb=Object.keys(el).find(k=>k.startsWith('__reactFiber$'));
    const sn=el[fb]?.memoizedProps?.children?._owner?.stateNode; if(!sn) return null;
    const g=sn.gameState, cam=sn.renderer?.camera, me=g?.areaInfo?.self?.entity; if(!(g?.entities&&me&&cam)) return null;
    return {g,cam,me};
  }
  function refsLight(){
    const el=document.querySelector('div.quests-launcher'); if(!el) return null;
    const fb=Object.keys(el).find(k=>k.startsWith('__reactFiber$'));
    const sn=el[fb]?.memoizedProps?.children?._owner?.stateNode; if(!sn) return null;
    const g=sn.gameState, me=g?.areaInfo?.self?.entity; if(!(g?.entities&&me)) return null; return {g,me};
  }

  // ---------- Zoom ----------
  function setZoom(v){ const cam=getCamera(); if(cam) cam.scale=v; }
  setInterval(()=>{ if(document.querySelector('canvas')) setZoom(clamp(st.zoom,0.1,2)); },500);

  // ---------- Anti-AFK ----------
  let antiTimer=null;
  function startAntiAfk(){ stopAntiAfk(); antiTimer=setInterval(()=>{ tapShift(); wiggleCanvas(); }, Math.max(5, st.antiAfkSeconds|0)*1000); }
  function stopAntiAfk(){ if(antiTimer){ clearInterval(antiTimer); antiTimer=null; } }
  function applyAntiAfk(){ st.antiAfk?startAntiAfk():stopAntiAfk(); }
  function tapShift(){ const ke=(type)=>new KeyboardEvent(type,{key:'Shift',code:'ShiftLeft',bubbles:true}); [window,document,document.body].forEach(t=>{t.dispatchEvent(ke('keydown'));t.dispatchEvent(ke('keyup'));}); }
  function wiggleCanvas(){ const c=document.querySelector('canvas'); if(!c) return; const r=c.getBoundingClientRect(); const x=(r.left+r.width/2)|0, y=(r.top+r.height/2)|0; c.dispatchEvent(new MouseEvent('mousemove',{clientX:x+1,clientY:y,bubbles:true})); c.dispatchEvent(new MouseEvent('mousemove',{clientX:x,clientY:y,bubbles:true})); }

  // ---------- Overlay canvas ----------
  let dpr=window.devicePixelRatio||1, tcv=null, tctx=null, lastW=0,lastH=0;
  function ensureCanvas(){
    if(!tcv){ tcv=document.createElement('canvas'); tcv.id='nm_tracer'; document.documentElement.appendChild(tcv); tctx=tcv.getContext('2d'); }
    const w=window.innerWidth,h=window.innerHeight;
    if(w!==lastW||h!==lastH){ lastW=w; lastH=h; tcv.style.width=w+'px'; tcv.style.height=h+'px'; tcv.width=Math.floor(w*dpr); tcv.height=Math.floor(h*dpr); tctx.setTransform(dpr,0,0,dpr,0,0); }
  }
  function clearOverlay(){ if(!tcv||!tctx) return; tctx.clearRect(0,0,tcv.width/dpr,tcv.height/dpr); }

  // ---------- Time Travel Indicator (projected) ----------
  const TTI_MS=2240, SELF_MAX_MS=6000, SELF_BUF_CAP=1200;
  const selfBuf=[]; let lastSelf=null;

  function pushSelfSample(t,x,y){
    if(lastSelf){
      const jump=Math.hypot(x-lastSelf.x,y-lastSelf.y);
      if(jump>1200) selfBuf.length=0; // ignore big teleports
    }
    selfBuf.push({t,x,y}); lastSelf={t,x,y};
    const cut=t-SELF_MAX_MS;
    while(selfBuf.length&&selfBuf[0].t<cut) selfBuf.shift();
    if(selfBuf.length>SELF_BUF_CAP) selfBuf.splice(0,selfBuf.length-SELF_BUF_CAP);
  }
  function findIdxAt(time){ let lo=0,hi=selfBuf.length-1,ans=-1; while(lo<=hi){ const m=(lo+hi)>>1; if(selfBuf[m].t<=time){ ans=m; lo=m+1;} else hi=m-1;} return ans; }
  function sampleSelfAt(time){
    if(!selfBuf.length) return null;
    if(time<=selfBuf[0].t) return {x:selfBuf[0].x,y:selfBuf[0].y};
    if(time>=selfBuf[selfBuf.length-1].t) return {x:selfBuf[selfBuf.length-1].x,y:selfBuf[selfBuf.length-1].y};
    const i=findIdxAt(time); if(i<0||i>=selfBuf.length-1) return null;
    const A=selfBuf[i],B=selfBuf[i+1]; const dt=Math.max(1,B.t-A.t); const u=(time-A.t)/dt;
    return {x:A.x+(B.x-A.x)*u,y:A.y+(B.y-A.y)*u};
  }
  function estimatePastSelf(now){
    const n=selfBuf.length; if(n<4) return null;
    const latest=selfBuf[n-1];
    const refTime=now-180; // recent window for stable velocity
    const ref=sampleSelfAt(refTime);
    if(!ref) return sampleSelfAt(now-TTI_MS);
    const dt=Math.max(1,latest.t-refTime);
    const vx=(latest.x-ref.x)/dt, vy=(latest.y-ref.y)/dt;
    const speed=Math.hypot(vx,vy);
    if(!Number.isFinite(speed)||speed>5) return sampleSelfAt(now-TTI_MS);
    return {x:latest.x-vx*TTI_MS, y:latest.y-vy*TTI_MS};
  }

  // ---------- Threat detection ----------
  function isThreatLike(e, me){
    if(!e) return false;
    if(e.id === me.id) return false;
    if(e.dead || e.removed) return false;
    if(e.isItem || e.collectible) return false;
    const r = typeof e.radius === 'number' ? e.radius : 0;
    if(r <= 2) return false; // tiny dots
    if (e.isEnemy || e.isHazard || e.hazard || e.isProjectile) return true;
    if (typeof e.damage === 'number' && e.damage > 0) return true;
    if (typeof e.damageRadius === 'number' && e.damageRadius > 0) return true;
    return true; // treat unknown solids as threat
  }

  // ---------- Invite helpers ----------
  function norm(s){ return (s||'').trim().toLowerCase(); }
  function invitedSet(){ const set=new Set(); for(const n of st.invites) set.add(norm(n)); return set; }
  function entityName(e){ return typeof e.name === 'string' ? e.name : (e.username || e.playerName || null); }

  // best-effort glow in leaderboard DOM
  function applyInviteDomHighlights(){
    const lb=document.getElementById('leaderboard'); if(!lb) return;
    const L = invitedSet();
    for(const node of lb.children){
      const t=(node.textContent||'').trim().toLowerCase();
      node.classList.toggle('nm-lb-glow', L.size && [...L].some(n=>t.includes(n)));
    }
  }
  setInterval(applyInviteDomHighlights, 1000);

  // ---------- Rendering + main loop ----------
  function draw(){
    ensureCanvas();
    const ctx=tctx; if(!ctx) return;

    const R=refs();
    const W=tcv.width/dpr,H=tcv.height/dpr;
    ctx.clearRect(0,0,W,H);
    if(!R) return;

    const {g,cam,me}=R;
    const cvs=document.querySelector('canvas'); if(!cvs) return;
    const rect=cvs.getBoundingClientRect();
    const offX=rect.left, offY=rect.top;
    const scale=(typeof cam.originalGameScale==='number')?cam.originalGameScale:(cam.scale||1);
    const left=cam.left, top=cam.top;
    const cx=offX+rect.width/2, cy=offY+rect.height/2;
    const now=performance.now();

    // record your history
    pushSelfSample(now, me.x, me.y);

    ctx.save();
    ctx.font=st.tracerFont;

    // Aura (soft radial + rainbow ring)
    if(st.auraEnabled){
      const sx=offX+(me.x-left)*scale, sy=offY+(me.y-top)*scale, r=Math.max(4, st.auraRadius*scale);
      const rg=ctx.createRadialGradient(sx,sy,0,sx,sy,r); rg.addColorStop(0,'rgba(255,255,255,0.06)'); rg.addColorStop(1,'rgba(255,255,255,0)');
      ctx.fillStyle=rg; ctx.beginPath(); ctx.arc(sx,sy,r,0,Math.PI*2); ctx.fill();
      if(ctx.createConicGradient){ const cg=ctx.createConicGradient(0,sx,sy);
        cg.addColorStop(0/6,'#ff0000'); cg.addColorStop(1/6,'#ffa500'); cg.addColorStop(2/6,'#ffff00'); cg.addColorStop(3/6,'#00ff00'); cg.addColorStop(4/6,'#0000ff'); cg.addColorStop(5/6,'#4b0082'); cg.addColorStop(6/6,'#ff00ff'); ctx.strokeStyle=cg;
      } else ctx.strokeStyle='#fff';
      ctx.lineWidth=Math.max(2,r*0.02); ctx.beginPath(); ctx.arc(sx,sy,r,0,Math.PI*2); ctx.stroke();
    }

    // Tracers to threats
    if(st.tracersEnabled){
      for(const e of Object.values(g.entities)){
        if(!isThreatLike(e,me)) continue;
        const sx=offX+(e.x-left)*scale, sy=offY+(e.y-top)*scale; const rr=(typeof e.radius==='number'?e.radius:20)*scale;
        ctx.lineWidth=st.tracerLine; ctx.strokeStyle=e.color||'#ff0';
        const a=Math.atan2(sy-cy,sx-cx), ax=sx-Math.cos(a)*rr, ay=sy-Math.sin(a)*rr;
        ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(ax,ay); ctx.stroke();
        if(st.tracerShowDist){
          ctx.fillStyle=e.color||'#ff0';
          const d=Math.hypot(e.x-me.x,e.y-me.y);
          ctx.fillText(Math.round(d), ax+st.tracerLabelOffsetX, ay+st.tracerLabelOffsetY);
        }
      }
    }

    // Invited players highlight
    if(st.invitesEnabled && st.invites.length){
      const L = invitedSet();
      for(const e of Object.values(g.entities)){
        const nm = entityName(e);
        if(!nm) continue;
        if(!L.has(norm(nm))) continue;

        // world -> screen
        const sx=offX+(e.x-left)*scale, sy=offY+(e.y-top)*scale;
        const r=(Math.max(10, (e.radius||10))*scale);
        const pulse = 0.5 + 0.5*Math.sin(now/220); // 0..1
        const c1 = `rgba(0,200,255,${0.25+0.35*pulse})`;
        const c2 = `rgba(255,0,200,${0.25+0.35*(1-pulse)})`;

        // dual ring
        ctx.lineWidth = 2 + 2*pulse;
        ctx.strokeStyle = c1;
        ctx.beginPath(); ctx.arc(sx,sy, r+10+6*pulse, 0, Math.PI*2); ctx.stroke();

        ctx.strokeStyle = c2;
        ctx.beginPath(); ctx.arc(sx,sy, r+18+6*(1-pulse), 0, Math.PI*2); ctx.stroke();

        // label
        ctx.fillStyle='rgba(0,0,0,0.65)';
        ctx.fillRect(sx-30, sy-(r+34), 60, 18);
        ctx.strokeStyle='rgba(0,200,255,0.9)';
        ctx.strokeRect(sx-30, sy-(r+34), 60, 18);
        ctx.fillStyle='#8ff';
        ctx.textAlign='center';
        ctx.textBaseline='middle';
        ctx.font='12px monospace';
        ctx.fillText('INVITE', sx, sy-(r+25));
      }
    }

    // Time travel indicator (your -2.24s projected position)
    if(st.ttiEnabled){
      const ghost=estimatePastSelf(now);
      if(ghost){
        const px=offX+(ghost.x-left)*scale, py=offY+(ghost.y-top)*scale;
        ctx.strokeStyle='rgba(80,200,255,0.9)'; ctx.fillStyle='rgba(80,200,255,0.25)';
        ctx.beginPath(); ctx.arc(px,py,8,0,Math.PI*2); ctx.fill(); ctx.stroke();
        const sx=offX+(me.x-left)*scale, sy=offY+(me.y-top)*scale;
        ctx.setLineDash([6,6]); ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(sx,sy); ctx.stroke(); ctx.setLineDash([]);
      }
    }

    ctx.restore();
  }

  function mainLoop(){
    requestAnimationFrame(mainLoop);
    if(!st.tracersEnabled && !st.ttiEnabled && !st.auraEnabled && !(st.invitesEnabled && st.invites.length)){ clearOverlay(); return; }
    try{ draw(); }catch{}
    try{ avoidanceTick(); }catch{}
  }
  requestAnimationFrame(mainLoop);

  // ---------- Avoidance (clearance-based, nearest threat) ----------
  const AVOID_CLEARANCE_THRESHOLD = 25; // how close is "too close" after subtracting radii
  const held={w:false,a:false,s:false,d:false};

  function sendKey(code,type){
    const key=code.replace(/^Key/,'').toUpperCase();
    const ev=new KeyboardEvent(type,{key,code,keyCode:key.charCodeAt(0),which:key.charCodeAt(0),bubbles:true});
    const targets=[document.activeElement, document.querySelector('canvas'), document.body, document, window].filter(Boolean);
    for(const t of targets) t.dispatchEvent(ev);
  }
  function pressKey(k,down){
    if(held[k]===down && down){ sendKey({w:'KeyW',a:'KeyA',s:'KeyS',d:'KeyD'}[k],'keydown'); return; }
    if(held[k]===down) return;
    held[k]=down; const code={w:'KeyW',a:'KeyA',s:'KeyS',d:'KeyD'}[k]; if(!code) return;
    sendKey(code, down?'keydown':'keyup');
  }
  function releaseAll(){ ['w','a','s','d'].forEach(k=>pressKey(k,false)); }
  function uiActive(){ const el=document.activeElement; return el && /^(input|textarea)$/i.test(el.tagName); }

  function refsLightSafe(){
    try { return refsLight(); } catch { return null; }
  }

  function avoidanceTick(){
    if(!st.avoidEnabled){ releaseAll(); return; }
    if(uiActive()){ releaseAll(); return; }
    const R=refsLightSafe(); if(!R){ releaseAll(); return; }
    const {g,me}=R;

    const myR = typeof me.radius==='number' ? me.radius : 8;

    let nearest=null, bestClearance=Infinity, bestD=Infinity;
    for(const e of Object.values(g.entities)){
      if(!isThreatLike(e,me)) continue;
      const ex=e.x, ey=e.y;
      const d = Math.hypot(me.x-ex, me.y-ey);
      const er = typeof e.radius==='number' ? e.radius : 0;
      const clearance = d - (myR + er);
      if (clearance <= AVOID_CLEARANCE_THRESHOLD) {
        if (clearance < bestClearance || (clearance === bestClearance && d < bestD)) {
          bestClearance = clearance; bestD = d; nearest = e;
        }
      }
    }

    if(!nearest){ releaseAll(); return; }

    // Move away from the nearest threat
    const dx = me.x - nearest.x;
    const dy = me.y - nearest.y;
    const m = Math.hypot(dx, dy) || 1;
    const nx = dx / m;
    const ny = dy / m;
    const thr = 0.03;

    if(Math.abs(nx)>thr){
      if(nx>0){ pressKey('d',true); pressKey('a',false);} else { pressKey('a',true); pressKey('d',false); }
    } else { pressKey('a',false); pressKey('d',false); }

    if(Math.abs(ny)>thr){
      if(ny>0){ pressKey('s',true); pressKey('w',false);} else { pressKey('w',true); pressKey('s',false); }
    } else { pressKey('w',false); pressKey('s',false); }
  }

  // ---------- HUD ----------
  let hud;
  function buildHUD(){
    hud=document.createElement('div'); hud.id='e_hud'; hud.style.left=hudLeft+'px'; hud.style.top=hudTop+'px';
    hud.innerHTML=`
      <div class="hdr"><span class="title">NipachuMod</span><span class="sub">Press H to toggle HUD</span></div>

      <!-- Zoom -->
      <div class="row" style="margin-bottom:6px">
        <span class="sub">Zoom</span>
        <button class="nm-btn" id="zDec">-</button>
        <input id="zRange" type="range" min="0.1" max="2" step="0.01">
        <button class="nm-btn" id="zInc">+</button>
        <button class="nm-btn" id="zReset">Reset</button>
      </div>

      <div class="section"></div>

      <!-- Anti-AFK -->
      <div class="row"><button class="nm-btn" id="afkToggle"></button></div>

      <div class="section"></div>

      <!-- Tracers + TimeTravel -->
      <div class="row wrap" style="margin-bottom:6px">
        <button class="nm-btn" id="trToggle"></button>
        <button class="nm-btn" id="trDist"></button>
        <button class="nm-btn" id="ttiToggle"></button><span class="sub">(you -2.24s)</span>
      </div>

      <div class="section"></div>

      <!-- Aura -->
      <div class="row wrap" style="margin-bottom:6px">
        <button class="nm-btn" id="auraToggle"></button>
        <span class="sub">Aura</span>
        <input id="auraRange" type="range" min="20" max="600" step="5" style="width:240px">
        <span id="auraVal" class="sub"></span>
      </div>

      <div class="section"></div>

      <!-- Avoid -->
      <div class="row wrap" style="margin-bottom:6px">
        <button class="nm-btn" id="avoidToggle"></button>
        <span class="sub">Clearance threshold: 25</span>
      </div>

      <div class="section"></div>

      <!-- Invites -->
      <div class="row wrap" style="margin-bottom:6px">
        <button class="nm-btn" id="invToggle"></button>
        <input id="invInput" type="text" placeholder="Player name (case-insensitive)">
        <button class="nm-btn" id="invAdd">+ Add</button>
        <div id="invChips" class="row wrap" style="margin-top:6px"></div>
      </div>

      <div class="section"></div>

      <!-- UI tweaks -->
      <div class="row wrap" style="margin-bottom:6px">
        <button class="nm-btn" id="lbCycle">LB 1.00x</button>
        <button class="nm-btn" id="chatCycle">Chat 1.00x</button>
        <button class="nm-btn" id="chCycle">ChatH 200</button>
        <button class="nm-btn" id="filterRegion">Filter My Region</button>
        <button class="nm-btn" id="tryhardBtn">Tryhard</button>
        <button class="nm-btn" id="toggleChangelog">Changelog</button>
      </div>

      <div id="nm_changelog">
        <h3>Changelog</h3>
        <div class="entry">v1.0.0 - Invites highlighter (pulsing ring + label), Avoid uses clearance < 25 vs nearest threat, projected TimeTravel, Aura slider, Tryhard hides icons+leaderboard+chat.</div>
      </div>
    `;
    document.documentElement.appendChild(hud);
    drag(hud, hud.querySelector('.hdr'));

    // Zoom controls
    const zRange=gid('zRange');
    const applyZoom=v=>{
      const vv=clamp(parseFloat(v)||1,0.1,2);
      st.zoom=vv; save(STORE,st); setZoom(vv);
    };
    zRange.value=(st.zoom||1).toFixed(2);
    zRange.addEventListener('input',()=>applyZoom(zRange.value));
    gid('zDec').onclick=()=>applyZoom((parseFloat(zRange.value)-0.01).toFixed(2));
    gid('zInc').onclick=()=>applyZoom((parseFloat(zRange.value)+0.01).toFixed(2));
    gid('zReset').onclick=()=>applyZoom(1.00);

    // Anti-AFK
    const afkBtn=gid('afkToggle');
    const paintAfk=()=>{ afkBtn.textContent=st.antiAfk?'Anti-AFK: On':'Anti-AFK: Off'; };
    paintAfk();
    afkBtn.onclick=()=>{
      st.antiAfk=!st.antiAfk; save(STORE,st); paintAfk(); applyAntiAfk();
    };
    applyAntiAfk();

    // Tracers
    const paintTr=()=>{
      gid('trToggle').textContent=st.tracersEnabled?'Tracers: On':'Tracers: Off';
      gid('trDist').textContent='Distance: ' + (st.tracerShowDist?'On':'Off');
    };
    paintTr();
    gid('trToggle').onclick=()=>{
      st.tracersEnabled=!st.tracersEnabled; save(STORE,st); paintTr();
      if(!st.tracersEnabled && !st.ttiEnabled && !st.auraEnabled && !(st.invitesEnabled && st.invites.length)) clearOverlay();
    };
    gid('trDist').onclick=()=>{
      st.tracerShowDist=!st.tracerShowDist; save(STORE,st); paintTr();
    };

    // Time travel
    const ttiBtn=gid('ttiToggle');
    const paintTTI=()=>{ ttiBtn.textContent=st.ttiEnabled?'TimeTravel: On':'TimeTravel: Off'; };
    paintTTI();
    ttiBtn.onclick=()=>{
      st.ttiEnabled=!st.ttiEnabled; save(STORE,st); paintTTI();
      if(!st.tracersEnabled && !st.ttiEnabled && !st.auraEnabled && !(st.invitesEnabled && st.invites.length)) clearOverlay();
    };

    // Aura
    const auraRange=gid('auraRange'), auraVal=gid('auraVal');
    const aurBtn=gid('auraToggle');
    const paintAuraVals=()=>{ auraRange.value=st.auraRadius; auraVal.textContent=String(st.auraRadius); };
    const paintAura=()=>{ aurBtn.textContent = st.auraEnabled ? 'Aura: On' : 'Aura: Off'; };
    paintAuraVals(); paintAura();
    aurBtn.onclick=()=>{
      st.auraEnabled=!st.auraEnabled; save(STORE,st); paintAura();
      if(!st.tracersEnabled && !st.ttiEnabled && !st.auraEnabled && !(st.invitesEnabled && st.invites.length)) clearOverlay();
    };
    auraRange.addEventListener('input',()=>{
      st.auraRadius=Math.max(20, Math.min(600, parseInt(auraRange.value,10)||200));
      paintAuraVals(); save(STORE,st);
    });

    // Avoid
    const avT=gid('avoidToggle');
    const paintAvoid=()=>{ avT.textContent=st.avoidEnabled?'Avoid: On':'Avoid: Off'; };
    paintAvoid();
    avT.onclick=()=>{
      st.avoidEnabled=!st.avoidEnabled; save(STORE,st); paintAvoid();
      if(!st.avoidEnabled) releaseAll();
    };

    // Invites
    const invBtn = gid('invToggle');
    const invInput = gid('invInput');
    const invAdd = gid('invAdd');
    const invChips = gid('invChips');

    const paintInvToggle = () => { invBtn.textContent = st.invitesEnabled ? 'Invites: On' : 'Invites: Off'; };
    const paintChips = () => {
      invChips.innerHTML = '';
      st.invites.forEach((name, idx) => {
        const chip = document.createElement('div');
        chip.className = 'nm-chip';
        chip.innerHTML = `<span>${escapeHtml(name)}</span><span class="x" title="Remove">✖</span>`;
        chip.querySelector('.x').onclick = () => {
          st.invites.splice(idx,1); save(STORE,st); paintChips(); applyInviteDomHighlights();
        };
        invChips.appendChild(chip);
      });
    };
    function addInvite(name){
      name = (name||'').trim();
      if(!name) return;
      if(!st.invites.some(n=>norm(n)===norm(name))){
        st.invites.push(name);
        save(STORE,st);
        paintChips();
        applyInviteDomHighlights();
      }
      invInput.value='';
    }

    paintInvToggle();
    paintChips();
    invBtn.onclick = () => {
      st.invitesEnabled = !st.invitesEnabled;
      save(STORE,st);
      paintInvToggle();
      if(!st.tracersEnabled && !st.ttiEnabled && !st.auraEnabled && !(st.invitesEnabled && st.invites.length)) clearOverlay();
    };
    invAdd.onclick = () => addInvite(invInput.value);
    invInput.addEventListener('keydown', e => { if(e.key==='Enter') addInvite(invInput.value); });

    // LB/Chat/ChatH cycles
    const lbBtn=gid('lbCycle'), chatBtn=gid('chatCycle'), chBtn=gid('chCycle');
    const cycle=(arr,cur)=>arr[(Math.max(0,arr.findIndex(v=>Math.abs(v-cur)<1e-6))+1)%arr.length];
    const paintLB=()=>{ lbBtn.textContent=`LB ${st.leaderboardScale.toFixed(2)}x`; };
    const paintChat=()=>{ chatBtn.textContent=`Chat ${st.chatScale.toFixed(2)}x`; };
    const paintCH=()=>{ chBtn.textContent=`ChatH ${st.chatHeight}`; };
    const applyScales=()=>{
      const lb=document.getElementById('leaderboard'), ch=document.getElementById('chat');
      if(lb) lb.style.zoom=st.leaderboardScale===1?'':st.leaderboardScale;
      if(ch) ch.style.zoom=st.chatScale===1?'':st.chatScale;
      applyChatHeight(st.chatHeight);
    };
    lbBtn.onclick=()=>{ st.leaderboardScale=cycle(PRESETS_LB,st.leaderboardScale); save(STORE,st); paintLB(); applyScales(); };
    chatBtn.onclick=()=>{ st.chatScale=cycle(PRESETS_CHAT,st.chatScale); save(STORE,st); paintChat(); applyScales(); };
    chBtn.onclick=()=>{ st.chatHeight=cycle(PRESETS_CH,st.chatHeight); save(STORE,st); paintCH(); applyScales(); };
    paintLB(); paintChat(); paintCH(); applyScales();

    // Region filter toggle
    gid('filterRegion').onclick = toggleRegionFilter;

    // Tryhard
    const tryBtn=gid('tryhardBtn');
    const paintTry=()=>{ tryBtn.textContent=st.hideUI?'Tryhard: On':'Tryhard: Off'; };
    tryBtn.onclick=()=>{ st.hideUI=!st.hideUI; save(STORE,st); applyUIVisibility(); paintTry(); };
    paintTry();

    // Changelog panel
    const clBtn=gid('toggleChangelog'), clBox=gid('nm_changelog');
    clBtn.onclick=()=>{ st.showChangelog=!st.showChangelog; save(STORE,st); clBox.style.display=st.showChangelog?'block':'none'; };
    clBox.style.display=st.showChangelog?'block':'none';

    applyUIVisibility();
    if(st.filterEnabled) startRegionObserver();
  }

  // HUD toggle
  window.addEventListener('keydown', e=>{
    if((e.key||'').toLowerCase()==='h' && !e.repeat){
      const t=document.activeElement && /^(input|textarea)$/i.test(document.activeElement.tagName); if(t) return;
      if(!hud) buildHUD();
      hud.style.display=(hud.style.display==='none'||!hud.style.display)?'block':'none';
    }
  }, true);

  // ---------- UI/region-filter utilities ----------
  let leaderboard=null, chatBox=null, regionMO=null;
  const uiSelectors=['.settings-launcher','.quests-launcher','.mod-tools-launcher','#leaderboard','#chat'];
  function refreshRefs(){ const lb=document.getElementById('leaderboard'); const ch=document.getElementById('chat'); if(lb) leaderboard=lb; if(ch) chatBox=ch; }
  function applyChatHeight(h){ const win=document.getElementById('chat-window'); const input=document.getElementById('chat-input'); refreshRefs(); if(!chatBox||!win||!input) return; chatBox.style.height=h+'px'; win.style.height=(h-10)+'px'; input.style.top=h+'px'; }
  function applyUIVisibility(){ uiSelectors.forEach(s=>{ document.querySelectorAll(s).forEach(el=>{ el.style.display=st.hideUI?'none':''; el.style.pointerEvents=st.hideUI?'none':''; }); }); }
  function toggleRegionFilter(){ st.filterEnabled=!st.filterEnabled; save(STORE,st); if(st.filterEnabled) startRegionObserver(); else { stopRegionObserver(); showFullLB(); } }
  function startRegionObserver(){ refreshRefs(); if(!leaderboard) return; if(regionMO) regionMO.disconnect(); regionMO=new MutationObserver(()=>filterLB()); regionMO.observe(leaderboard,{childList:true,subtree:true}); filterLB(); }
  function stopRegionObserver(){ regionMO&&regionMO.disconnect(); regionMO=null; }
  function myRegion(){ refreshRefs(); if(!leaderboard) return null; let cur=null,my=null; for(const ch of leaderboard.children){ if(ch.classList?.contains('leaderboard-title-break')) cur=ch.textContent.trim(); else if(ch.querySelector('b,strong')){ my=cur; break; } } return my; }
  function filterLB(){ refreshRefs(); if(!leaderboard) return; const mr=myRegion(); if(!mr) return; let inReg=false; for(const c of leaderboard.children){ if(c.classList?.contains('leaderboard-title-break')){ const nm=c.textContent.trim(); inReg=(mr==='Ancient Abyss')?(nm==='Ancient Abyss'||nm==='Vast Void'):(nm.toLowerCase()===mr.toLowerCase()); c.style.display=inReg?'':'none'; } else c.style.display=inReg?'':'none'; } }
  function showFullLB() {
  refreshRefs();
  if (!leaderboard) return;
  const els = Array.from(leaderboard.children);
  els.forEach(c => { c.style.display = ''; });
}

  // ---------- tiny helpers ----------
  function gid(id){ return document.getElementById(id); }
  function drag(el,handle){ let go=false,ox=0,oy=0; handle.addEventListener('mousedown',e=>{ go=true; ox=e.clientX-el.offsetLeft; oy=e.clientY-el.offsetTop; e.preventDefault(); }); document.addEventListener('mouseup',()=>{ if(!go) return; go=false; hudLeft=el.offsetLeft; hudTop=el.offsetTop; GM_setValue(POSL,hudLeft); GM_setValue(POST,hudTop); }); document.addEventListener('mousemove',e=>{ if(!go) return; el.style.left=(e.clientX-ox)+'px'; el.style.top=(e.clientY-oy)+'px'; }); }
  function clamp(v,lo,hi){ return Math.max(lo, Math.min(hi,v)); }
  function num(v,d){ const n=Number(v); return Number.isFinite(n)?n:d; }
  function load(k,def){ try{ const raw=GM_getValue(k,null); return raw?{...def,...JSON.parse(raw)}:{...def}; }catch{ return {...def}; } }
  function save(k,obj){ try{ GM_setValue(k, JSON.stringify(obj)); }catch{} }
  function escapeHtml(s){ return s.replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }

})();
