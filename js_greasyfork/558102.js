// ==UserScript==
// @name         Bloxd.io Keyboard visualizer
// @namespace    https://github.com/code-copilot
// @version      1.4.0
// @description  A custom keyboard visualizer. Alt + M can custom keyboard.
// @match        *://*.bloxd.io/*
// @run-at       document-idle
// @noframes
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/558102/Bloxdio%20Keyboard%20visualizer.user.js
// @updateURL https://update.greasyfork.org/scripts/558102/Bloxdio%20Keyboard%20visualizer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- 持久化設定 ----------
  const STORE = 'bloxd_keystrokes_i18n_v1';
  const DEF = {
    show: true,
    uiScale: 1.0,
    hudPos: { x: 100, y: 100 },
    panelPos: { x: 80, y: 60 },
    cpsWindowMs: 1000,
    baseColor: '#808080', baseAlpha: 0.75,
    activeColor: '#ffffff', activeAlpha: 0.28,
    outlineColor: '#000000', outlineAlpha: 0.25, outlineWidth: 1,
    rounded: false, radius: 0,
    lang: 'auto', // 新增
  };
  let S = load(); function load(){ try{ const v=GM_getValue(STORE); if(v&&typeof v==='object') return {...DEF, ...v}; }catch{} return {...DEF}; }
  function save(p){ S={...S,...p}; try{ GM_setValue(STORE,S);}catch{} }
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  const toRGBA=(hex,a)=>{ const h=hex.replace('#',''); const n=h.length===3?h.split('').map(c=>c+c).join(''):h; const r=parseInt(n.slice(0,2),16),g=parseInt(n.slice(2,4),16),b=parseInt(n.slice(4,6),16); return `rgba(${r},${g},${b},${clamp(a,0,1)})`; };

  // ---------- 多語系 ----------
  const T = {
    'zh-TW': {
      title: '模組介面',
      toggle_keyboard: '鍵盤顯示器',
      base_color: '鍵帽底色',
      active_color: '按下覆蓋色',
      outline_color: '外框顏色',
      outline_width: '外框粗細（px）',
      rounded: '是否圓弧',
      radius: '圓角大小（px）',
      current_scale: '目前縮放',
      hint: '提示：Alt+M 面板；Enter+滾輪縮放（穩定）。右鍵不彈出選單以統計 RMB。',
      reset_pos: '重置位置',
      close: '關閉',
      lmb: '左鍵',
      rmb: '右鍵',
      cps: '次/秒',
      language: '語言',
      auto: '自動',
    },
    'zh-CN': {
      title: '模组界面',
      toggle_keyboard: '键盘显示器',
      base_color: '按键底色',
      active_color: '按下覆盖色',
      outline_color: '外框颜色',
      outline_width: '外框粗细（px）',
      rounded: '是否圆角',
      radius: '圆角大小（px）',
      current_scale: '当前缩放',
      hint: '提示：Alt+M 面板；Enter+滚轮缩放（稳定）。右键不弹出菜单以统计 RMB。',
      reset_pos: '重置位置',
      close: '关闭',
      lmb: '左键',
      rmb: '右键',
      cps: '次/秒',
      language: '语言',
      auto: '自动',
    },
    'en': {
      title: 'Module Panel',
      toggle_keyboard: 'Keyboard HUD',
      base_color: 'Key Base Color',
      active_color: 'Pressed Overlay',
      outline_color: 'Outline Color',
      outline_width: 'Outline Width (px)',
      rounded: 'Rounded Corners',
      radius: 'Corner Radius (px)',
      current_scale: 'Current Scale',
      hint: 'Tips: Alt+M panel; Enter+wheel to scale (stable). Context menu disabled for RMB.',
      reset_pos: 'Reset Position',
      close: 'Close',
      lmb: 'LMB',
      rmb: 'RMB',
      cps: 'CPS',
      language: 'Language',
      auto: 'Auto',
    },
    'ja': {
      title: 'モジュールパネル',
      toggle_keyboard: 'キーボードHUD',
      base_color: 'キー基色',
      active_color: '押下オーバーレイ',
      outline_color: '枠線色',
      outline_width: '枠線太さ（px）',
      rounded: '角丸',
      radius: '角丸サイズ（px）',
      current_scale: '現在スケール',
      hint: 'ヒント: Alt+M パネル、Enter+ホイールで拡大縮小（安定）。RMBのためにコンテキストメニュー無効。',
      reset_pos: '位置をリセット',
      close: '閉じる',
      lmb: '左ボタン',
      rmb: '右ボタン',
      cps: '回/秒',
      language: '言語',
      auto: '自動',
    },
    'ko': {
      title: '모듈 패널',
      toggle_keyboard: '키보드 HUD',
      base_color: '키 기본 색상',
      active_color: '눌림 오버레이',
      outline_color: '외곽선 색상',
      outline_width: '외곽선 두께 (px)',
      rounded: '라운드 처리',
      radius: '라운드 크기 (px)',
      current_scale: '현재 배율',
      hint: '팁: Alt+M 패널, Enter+휠로 배율 조정(안정). RMB 집계를 위해 컨텍스트 메뉴 비활성화.',
      reset_pos: '위치 초기화',
      close: '닫기',
      lmb: '좌클릭',
      rmb: '우클릭',
      cps: '회/초',
      language: '언어',
      auto: '자동',
    },
  };
  function resolveLang(){
    if (S.lang !== 'auto') return S.lang;
    const nav = (navigator.language || '').toLowerCase();
    if (nav.includes('zh') && (nav.includes('hant') || nav.includes('tw') || nav.includes('hk'))) return 'zh-TW';
    if (nav.includes('zh')) return 'zh-CN';
    if (nav.startsWith('ja')) return 'ja';
    if (nav.startsWith('ko')) return 'ko';
    return 'en';
  }
  function t(key){ const lang = resolveLang(); const dict = T[lang] || T['en']; return dict[key] ?? key; }

  // ---------- 樣式 ----------
  GM_addStyle(`
    :root{
      --ks-size: 50px; --ks-gap: 8px; --ks-bg: rgba(128,128,128,.75);
      --ks-active: rgba(255,255,255,.28); --ks-border-color: rgba(0,0,0,.25);
      --ks-border-width: 1px; --ks-radius: 0px; --ks-z: 2147483000;
    }
    .ks-hidden{ display:none!important; } .ks-noselect{ user-select:none; -webkit-user-select:none; }
    #visualizer{ position: fixed; z-index: var(--ks-z); top: 100px; left: 100px; display:flex; flex-direction:column; gap:var(--ks-gap); background:transparent; transform-origin: top left; }
    .row{ display:flex; justify-content:center; gap:var(--ks-gap); }
    .key{
      width:var(--ks-size); height:var(--ks-size); background-color:var(--ks-bg); color:#fff; font-weight:bold; font-size:16px;
      border-radius:var(--ks-radius); display:flex; flex-direction:column; align-items:center; justify-content:center;
      border:var(--ks-border-width) solid var(--ks-border-color); box-shadow:0 4px 0 rgba(0,0,0,.25); position:relative; text-align:center;
    }
    .key.active::after{ content:""; position:absolute; inset:0; border-radius:var(--ks-radius); background:var(--ks-active); }
    #key-lmb,#key-rmb{ width: calc(var(--ks-size)*1.5 + var(--ks-gap)); }
    #key-lmb{ margin-left: calc(-1 * (var(--ks-size)*0.5) - var(--ks-gap)/2); }
    #key-rmb{ margin-right: calc(-1 * (var(--ks-size)*0.5) - var(--ks-gap)/2); }
    #key-space{ width: calc(var(--ks-size)*3 + var(--ks-gap)*2); }
    .cps{ font-size:12px; margin-top:2px; color:#fff; }

    #ks-panel{
      position:fixed; z-index:var(--ks-z); min-width:380px; padding:12px; background:rgba(18,18,22,.96); color:#eaeaea;
      border:1px solid rgba(255,255,255,.12); border-radius:12px; left:80px; top:60px;
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "PingFang TC", "Microsoft JhengHei", Arial, sans-serif;
    }
    #ks-panel-header{ display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; cursor:move; }
    .ks-title{ font-size:14px; font-weight:700; }
    .ks-btn{ padding:6px 10px; border-radius:8px; border:1px solid rgba(255,255,255,.12); background:transparent; color:#eaeaea; cursor:pointer; font-size:12px; }
    .ks-btn:hover{ background:rgba(255,255,255,.08); }
    .ks-grid{ display:grid; grid-template-columns: 1fr 1fr; gap:10px 12px; }
    .ks-field{ display:flex; align-items:center; gap:8px; }
    .ks-field label{ font-size:12px; width:140px; opacity:.9; }
    .ks-field .ks-inline{ display:flex; gap:8px; align-items:center; }
    .ks-range{ width:120px; } .ks-row{ display:flex; align-items:center; justify-content:space-between; margin-top:8px; }
    .ks-note{ font-size:11px; opacity:.8; margin-top:6px; }
    .ks-switch{ width:42px; height:24px; border-radius:12px; background:#666; border:1px solid rgba(255,255,255,.12); position:relative; cursor:pointer; }
    .ks-switch::after{ content:""; position:absolute; top:2px; left:2px; width:18px; height:18px; border-radius:9px; background:#ddd; transition:left .15s ease, background .15s ease; }
    .ks-switch.on{ background:#2a7a2a; } .ks-switch.on::after{ left:22px; background:#fff; }
    select.ks-select{ padding:4px 8px; background:transparent; color:#eaeaea; border:1px solid rgba(255,255,255,.2); border-radius:8px; }
  `);

  // ---------- HUD ----------
  const visualizer = document.createElement('div'); visualizer.id='visualizer';
  visualizer.innerHTML = `
    <div class="row"><div class="key" id="key-w">W</div></div>
    <div class="row"><div class="key" id="key-a">A</div><div class="key" id="key-s">S</div><div class="key" id="key-d">D</div></div>
    <div class="row"><div class="key" id="key-lmb"><div id="lbl-lmb"></div><div class="cps" id="cps-lmb">0</div></div><div class="key" id="key-rmb"><div id="lbl-rmb"></div><div class="cps" id="cps-rmb">0</div></div></div>
    <div class="row"><div class="key" id="key-space">␣</div></div>
  `;
  document.body.appendChild(visualizer);

  // ---------- 面板 ----------
  const panel = buildPanel(); document.body.appendChild(panel);

  // ---------- 初始套用 ----------
  setPos(visualizer, S.hudPos); setPos(panel, S.panelPos);
  applyThemeVars(); applyScale(S.uiScale); applyLocale();
  visualizer.classList.toggle('ks-hidden', !S.show);
  panel.classList.add('ks-hidden');

  // ---------- 互動：拖曳 / 夾取 ----------
  enableDrag(visualizer, visualizer, (pos)=> save({ hudPos: pos }));
  enableDrag(panel, panel.querySelector('#ks-panel-header'), (pos)=> save({ panelPos: pos }));
  window.addEventListener('resize', ()=>{ clampToViewport(visualizer); clampToViewport(panel); });

  // ---------- 穩定縮放（Enter+滾輪） ----------
  let enterDown=false;
  window.addEventListener('keydown', (e)=>{ if(e.code==='Enter') enterDown=true; if(e.altKey && e.code==='KeyM'){ e.preventDefault(); panel.classList.toggle('ks-hidden'); } }, true);
  window.addEventListener('keyup',   (e)=>{ if(e.code==='Enter') enterDown=false; }, true);
  window.addEventListener('wheel', (e)=>{
    if(!enterDown) return;
    e.preventDefault();
    const step = 0.05 * (e.deltaY>0 ? -1 : 1);
    const next = clamp(parseFloat((S.uiScale + step).toFixed(2)), 0.7, 1.6);
    if (next !== S.uiScale) applyScaleStable(next);
  }, { passive:false });

  // ---------- 鍵盤 / 滑鼠 / CPS ----------
  const keySet = new Set(['KeyW','KeyA','KeyS','KeyD','Space']);
  window.addEventListener('keydown', (e)=>{ if(e.repeat) return; if(keySet.has(e.code)) setActive(e.code,true); }, true);
  window.addEventListener('keyup',   (e)=>{ if(keySet.has(e.code)) setActive(e.code,false); }, true);
  const clicksL=[]; const clicksR=[];
  window.addEventListener('mousedown',(e)=>{ if(e.button===0){ setActive('MouseLeft',true); clicksL.push(performance.now()); } if(e.button===2){ setActive('MouseRight',true); clicksR.push(performance.now()); } }, true);
  window.addEventListener('mouseup',  (e)=>{ if(e.button===0) setActive('MouseLeft',false); if(e.button===2) setActive('MouseRight',false); }, true);
  window.addEventListener('contextmenu', (e)=>{ e.preventDefault(); }, true);
  requestAnimationFrame(function loop(t){ updateCps(t); requestAnimationFrame(loop); });
  function prune(now){ const win=S.cpsWindowMs; while(clicksL.length&&now-clicksL[0]>win) clicksL.shift(); while(clicksR.length&&now-clicksR[0]>win) clicksR.shift(); }
  function updateCps(now){
    prune(now);
    const unit = t('cps');
    setText('cps-lmb', `${(clicksL.length/(S.cpsWindowMs/1000)).toFixed(0)} ${unit}`);
    setText('cps-rmb', `${(clicksR.length/(S.cpsWindowMs/1000)).toFixed(0)} ${unit}`);
  }

  // ---------- 面板構建 ----------
  function buildPanel(){
    const p = document.createElement('div'); p.id='ks-panel';
    p.innerHTML = `
      <div id="ks-panel-header"><div class="ks-title" id="i18n-title"></div><div><button class="ks-btn" id="ks-close"></button></div></div>

      <div class="ks-row">
        <div id="i18n-toggle"></div>
        <div id="ks-switch" class="ks-switch ${S.show?'on':''}"></div>
      </div>

      <div class="ks-field">
        <label id="i18n-language"></label>
        <div class="ks-inline">
          <select id="ks-lang" class="ks-select">
            <option value="auto">${T['zh-TW'].auto}</option>
            <option value="zh-TW">繁體中文</option>
            <option value="zh-CN">简体中文</option>
            <option value="en">English</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
          </select>
        </div>
      </div>

      <div class="ks-grid">
        <div class="ks-field"><label id="i18n-base"></label><div class="ks-inline"><input id="baseColor" type="color" value="${S.baseColor}"><input id="baseAlpha" class="ks-range" type="range" min="0" max="1" step="0.01" value="${S.baseAlpha}"><span id="baseAlphaVal">${S.baseAlpha}</span></div></div>
        <div class="ks-field"><label id="i18n-active"></label><div class="ks-inline"><input id="activeColor" type="color" value="${S.activeColor}"><input id="activeAlpha" class="ks-range" type="range" min="0" max="1" step="0.01" value="${S.activeAlpha}"><span id="activeAlphaVal">${S.activeAlpha}</span></div></div>
        <div class="ks-field"><label id="i18n-outline"></label><div class="ks-inline"><input id="outlineColor" type="color" value="${S.outlineColor}"><input id="outlineAlpha" class="ks-range" type="range" min="0" max="1" step="0.01" value="${S.outlineAlpha}"><span id="outlineAlphaVal">${S.outlineAlpha}</span></div></div>
        <div class="ks-field"><label id="i18n-width"></label><div class="ks-inline"><input id="outlineWidth" class="ks-range" type="range" min="0" max="8" step="1" value="${S.outlineWidth}"><span id="outlineWidthVal">${S.outlineWidth}</span></div></div>
        <div class="ks-field"><label id="i18n-rounded"></label><div class="ks-inline"><div id="rounded" class="ks-switch ${S.rounded?'on':''}"></div></div></div>
        <div class="ks-field"><label id="i18n-radius"></label><div class="ks-inline"><input id="radius" class="ks-range" type="range" min="0" max="16" step="1" value="${S.radius}"><span id="radiusVal">${S.radius}</span></div></div>
      </div>

      <div class="ks-row"><div id="i18n-scale"></div><div id="scaleVal">${S.uiScale.toFixed(2)}</div></div>
      <div class="ks-row"><div></div><button class="ks-btn" id="resetPos"></button></div>
      <div class="ks-note" id="i18n-hint"></div>
    `;

    // 語言下拉
    p.querySelector('#ks-lang').value = S.lang;
    p.querySelector('#ks-lang').addEventListener('change', (e)=>{
      save({ lang: e.target.value });
      applyLocale();
    });

    // HUD 開關
    p.querySelector('#ks-switch').addEventListener('click', ()=>{
      const tgl = p.querySelector('#ks-switch'); const on = !tgl.classList.contains('on');
      tgl.classList.toggle('on', on);
      save({ show: on });
      visualizer.classList.toggle('ks-hidden', !on);
    });

    // 顏色/透明度
    bindColorAlpha(p,'baseColor','baseAlpha','baseAlphaVal', (color,alpha)=> saveAndApply({ baseColor:color, baseAlpha:alpha }));
    bindColorAlpha(p,'activeColor','activeAlpha','activeAlphaVal', (color,alpha)=> saveAndApply({ activeColor:color, activeAlpha:alpha }));
    bindColorAlpha(p,'outlineColor','outlineAlpha','outlineAlphaVal', (color,alpha)=> saveAndApply({ outlineColor:color, outlineAlpha:alpha }));

    // 外框粗細
    p.querySelector('#outlineWidth').addEventListener('input', (e)=>{
      const v = parseInt(e.target.value,10)||0; p.querySelector('#outlineWidthVal').textContent = v;
      saveAndApply({ outlineWidth: v });
    });

    // 圓角
    p.querySelector('#rounded').addEventListener('click', ()=>{
      const tgl = p.querySelector('#rounded'); const on = !tgl.classList.contains('on');
      tgl.classList.toggle('on', on);
      const rad = on ? S.radius : 0;
      saveAndApply({ rounded:on, radius:rad });
      p.querySelector('#radius').value = String(rad);
      p.querySelector('#radiusVal').textContent = rad;
    });
    p.querySelector('#radius').addEventListener('input', (e)=>{
      const v = parseInt(e.target.value,10)||0; p.querySelector('#radiusVal').textContent = v;
      saveAndApply({ radius: v });
    });

    // 重置位置
    p.querySelector('#resetPos').addEventListener('click', ()=>{
      save({ hudPos:{...DEF.hudPos}, panelPos:{...DEF.panelPos} });
      setPos(visualizer, S.hudPos); setPos(panel, S.panelPos);
      clampToViewport(visualizer); clampToViewport(panel);
    });

    // 關閉
    p.querySelector('#ks-close').addEventListener('click', ()=> p.classList.add('ks-hidden'));
    return p;
  }

  // ---------- 語系套用 ----------
  function applyLocale(){
    setTextContent('i18n-title', t('title'));
    setTextContent('ks-close', t('close'));
    setTextContent('i18n-toggle', t('toggle_keyboard'));
    setTextContent('i18n-language', t('language'));
    setTextContent('i18n-base', t('base_color'));
    setTextContent('i18n-active', t('active_color'));
    setTextContent('i18n-outline', t('outline_color'));
    setTextContent('i18n-width', t('outline_width'));
    setTextContent('i18n-rounded', t('rounded'));
    setTextContent('i18n-radius', t('radius'));
    setTextContent('i18n-scale', t('current_scale'));
    setTextContent('resetPos', t('reset_pos'));
    setTextContent('i18n-hint', t('hint'));
    setTextContent('lbl-lmb', t('lmb'));
    setTextContent('lbl-rmb', t('rmb'));
    updateScaleHint();
    // 更新下拉內 "Auto" 顯示文字
    const optAuto = panel.querySelector('#ks-lang option[value="auto"]');
    if (optAuto) optAuto.textContent = t('auto');
    // 更新 CPS 尾碼
    const unit = t('cps');
    setText('cps-lmb', withUnit(getNum('cps-lmb'), unit));
    setText('cps-rmb', withUnit(getNum('cps-rmb'), unit));
  }
  function withUnit(textOrNum, unit){
    const n = typeof textOrNum === 'number' ? textOrNum : parseFloat(String(textOrNum)) || 0;
    return `${n} ${unit}`;
  }
  function getNum(id){
    const el = document.getElementById(id);
    if (!el) return 0;
    const m = String(el.textContent||'').match(/[\d.]+/);
    return m ? parseFloat(m[0]) : 0;
  }

  // ---------- 穩定縮放 ----------
  function applyScaleStable(next){
    const before = visualizer.getBoundingClientRect();
    applyScale(next);
    const after = visualizer.getBoundingClientRect();
    const dx = after.left - before.left, dy = after.top - before.top;
    const curLeft = parseFloat(visualizer.style.left || '0');
    const curTop  = parseFloat(visualizer.style.top  || '0');
    visualizer.style.left = `${curLeft - dx}px`;
    visualizer.style.top  = `${curTop  - dy}px`;
    save({ uiScale: next });
    updateScaleHint();
    clampToViewport(visualizer);
  }
  function applyScale(v){ visualizer.style.transform = `scale(${v})`; }
  function updateScaleHint(){ const el = document.getElementById('scaleVal'); if (el) el.textContent = S.uiScale.toFixed(2); }

  // ---------- 主題 ----------
  function saveAndApply(patch){ save(patch); applyThemeVars(); }
  function applyThemeVars(){
    const root = document.documentElement.style;
    root.setProperty('--ks-bg', toRGBA(S.baseColor, S.baseAlpha));
    root.setProperty('--ks-active', toRGBA(S.activeColor, S.activeAlpha));
    root.setProperty('--ks-border-color', toRGBA(S.outlineColor, S.outlineAlpha));
    root.setProperty('--ks-border-width', `${S.outlineWidth}px`);
    root.setProperty('--ks-radius', `${S.rounded ? S.radius : 0}px`);
  }

  // ---------- 共用 ----------
  function setActive(code,on){
    const id = code==='Space' ? 'key-space' :
               code==='KeyW' ? 'key-w' :
               code==='KeyA' ? 'key-a' :
               code==='KeyS' ? 'key-s' :
               code==='KeyD' ? 'key-d' :
               code==='MouseLeft' ? 'key-lmb' : 'key-rmb';
    const n = document.getElementById(id); if(n) n.classList.toggle('active', !!on);
  }
  function bindColorAlpha(root, colorId, alphaId, labelId, onChange){
    const c = root.querySelector('#'+colorId), a = root.querySelector('#'+alphaId), l = root.querySelector('#'+labelId);
    const apply = ()=>{ const color=c.value; const alpha=parseFloat(a.value)||0; l.textContent = alpha.toFixed(2); onChange(color, alpha); };
    c.addEventListener('input', apply); a.addEventListener('input', apply);
  }
  function setText(id, text){ const n=document.getElementById(id); if(n) n.textContent=text; }
  function setTextContent(id, text){ const n=panel.querySelector('#'+id) || document.getElementById(id); if(n) n.textContent=text; }
  function setPos(el, pos){ if(!el||!pos) return; el.style.left=`${pos.x}px`; el.style.top=`${pos.y}px`; }
  function clampToViewport(node){
    if(!node) return; const r=node.getBoundingClientRect();
    const nx = clamp(r.left,0,Math.max(0,window.innerWidth - r.width));
    const ny = clamp(r.top ,0,Math.max(0,window.innerHeight- r.height));
    node.style.left=`${nx}px`; node.style.top=`${ny}px`;
  }
  function enableDrag(box, handle, onDone){
    let dragging=false,sx=0,sy=0,bx=0,by=0;
    handle.addEventListener('pointerdown',(e)=>{ if(e.button!==0) return; dragging=true; sx=e.clientX; sy=e.clientY; const rr=box.getBoundingClientRect(); bx=rr.left; by=rr.top; handle.setPointerCapture(e.pointerId); });
    handle.addEventListener('pointermove',(e)=>{ if(!dragging) return; const nx=clamp(bx+(e.clientX-sx),0,window.innerWidth - box.getBoundingClientRect().width); const ny=clamp(by+(e.clientY-sy),0,window.innerHeight - box.getBoundingClientRect().height); box.style.left=`${nx}px`; box.style.top=`${ny}px`; });
    handle.addEventListener('pointerup',()=>{ if(!dragging) return; dragging=false; const nx=parseFloat(box.style.left||'0'), ny=parseFloat(box.style.top||'0'); onDone?.({x:nx,y:ny}); });
  }
})();
