// ==UserScript==
// @name         Torn Profile + Crimes Helper (Unified)
// @namespace    https://www.torn.com/
// @version      1.1
// @description  Profile names clear + Crimes progress bar enhancer
// @author       SuperGogu[3580072]
// @match        https://www.torn.com/*
// @run-at       document-end
// @license      Apache-2.0
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556886/Torn%20Profile%20%2B%20Crimes%20Helper%20%28Unified%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556886/Torn%20Profile%20%2B%20Crimes%20Helper%20%28Unified%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const PROFILE_SETTINGS_KEY = 'pnc_settings_v3';
  const PROFILE_DEFAULTS = {
    fontSource: 'system',
    googleFamily: '',
    fontFamily: 'Tahoma, serif',
    fontSize: 12,
    bold: false,
    color: '#ffffff',
    align: 'left',
    panel: { x: 24, y: 80, visible: true }
  };

  const CRIME_SETTINGS_KEY = 'tmCrimeBarSettings';
  const CRIME_DEFAULTS = {
    fontFamily: 'Arial, sans-serif',
    fontSize: 14,
    barHeight: 20,
    enabled: true,
    fontSource: 'system',
    googleFamily: ''
  };

  const SYSTEM_FONT_CANDIDATES = ['Arial','Verdana','Tahoma','Trebuchet MS','Segoe UI','Calibri','Cambria','Georgia','Times New Roman','Courier New','Consolas','Menlo','Monaco','Lucida Console','Lucida Sans Unicode','Helvetica Neue','Helvetica','Ubuntu','Cantarell','Roboto','Noto Sans','Noto Serif','Source Sans Pro','Inter'];
  const GOOGLE_FONTS = ['Inter','Roboto','Open Sans','Lato','Montserrat','Poppins','Nunito','Raleway','Oswald','Merriweather','Playfair Display','Source Sans 3','Noto Sans','Noto Serif','Rubik','Quicksand','Work Sans','IBM Plex Sans'];

  const clamp = (n,a,b) => Math.max(a, Math.min(b, n));
  const isMobile = () => /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
  const normHex = c => { if(!c) return '#ffffff'; c=c.trim(); if(!c.startsWith('#')) c='#'+c; return /^#([0-9a-fA-F]{6})$/.test(c)?c:'#ffffff'; };

  let storedProfile = null;
  try { storedProfile = JSON.parse(localStorage.getItem(PROFILE_SETTINGS_KEY)); } catch {}
  let profileSettings = Object.assign({}, PROFILE_DEFAULTS, storedProfile || {});
  if (!storedProfile) {
    try { localStorage.setItem(PROFILE_SETTINGS_KEY, JSON.stringify(profileSettings)); } catch {}
  }

  function saveProfileSettings() {
    try { localStorage.setItem(PROFILE_SETTINGS_KEY, JSON.stringify(profileSettings)); } catch {}
  }

  function loadCrimeSettings() {
    let saved;
    try { saved = GM_getValue(CRIME_SETTINGS_KEY, {}); } catch { saved = {}; }
    if (!saved || typeof saved !== 'object') saved = {};
    return Object.assign({}, CRIME_DEFAULTS, saved);
  }

  let crimeSettings = loadCrimeSettings();

  function saveCrimeSettings() {
    try { GM_setValue(CRIME_SETTINGS_KEY, crimeSettings); } catch {}
  }

  function ensureLink(id, href, rel, crossorigin){
    if (document.getElementById(id)) return;
    const l=document.createElement('link');
    l.id=id;
    l.rel=rel;
    l.href=href;
    if (crossorigin) l.crossOrigin='anonymous';
    document.head.appendChild(l);
  }

  let loadedGoogleFonts = [];

  function loadGoogleFont(family){
    if (!family) return;
    const name = family.trim();
    if (!name) return;
    if (!loadedGoogleFonts.includes(name)) loadedGoogleFonts.push(name);
    ensureLink('pnc-preconnect-gf1','https://fonts.googleapis.com','preconnect');
    ensureLink('pnc-preconnect-gf2','https://fonts.gstatic.com','preconnect', true);
    let link=document.getElementById('pnc-google-font');
    if(!link){
      link=document.createElement('link');
      link.id='pnc-google-font';
      link.rel='stylesheet';
      document.head.appendChild(link);
    }
    const params = loadedGoogleFonts.map(f => 'family=' + encodeURIComponent(f).replace(/%20/g,'+')).join('&');
    link.href=`https://fonts.googleapis.com/css2?${params}&display=swap`;
  }

  function isFontPresent(font){
    const testStr='mmmmmmmmmmlliWWWWW', bases=['monospace','sans-serif','serif'];
    const body=document.body||document.documentElement, def={}, spans={};
    bases.forEach(base=>{ const s=document.createElement('span'); s.style.position='absolute'; s.style.left='-9999px'; s.style.fontSize='72px'; s.style.fontFamily=base; s.textContent=testStr; body.appendChild(s); def[base]=s.getBoundingClientRect().width; spans[base]=s; });
    let ok=false;
    bases.forEach(base=>{ spans[base].style.fontFamily=`"${font}", ${base}`; if (spans[base].getBoundingClientRect().width!==def[base]) ok=true; });
    bases.forEach(base=>spans[base].remove());
    return ok;
  }

  function injectCSS(){
    const css = `
    :root {
      --tm-crime-bar-font-family: ${crimeSettings.fontFamily};
      --tm-crime-bar-font-size: ${crimeSettings.fontSize}px;
      --tm-crime-bar-height: ${crimeSettings.barHeight}px;
    }

    .pnc-panel, .pnc-panel * { box-sizing: border-box; }
    .pnc-panel{
      position:fixed;
      top:${profileSettings.panel.y}px;
      left:${profileSettings.panel.x}px;
      width:320px;
      background:#1e2227;
      color:#eaecef;
      border:1px solid #3a3f45;
      border-radius:10px;
      box-shadow:0 12px 30px rgba(0,0,0,.35);
      z-index:2147483647;
      font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Arial,Helvetica Neue,Noto Sans,Emoji;
    }
    .pnc-panel.hidden{ display:none; }
    .pnc-panel-header{
      padding:10px 12px;
      border-bottom:1px solid #2e3338;
      font-size:14px;
      font-weight:600;
      cursor:move;
      display:flex;
      align-items:center;
      justify-content:space-between;
      user-select:none;
      gap:8px;
    }
    .pnc-header-left{
      display:flex;
      align-items:center;
      gap:8px;
    }
    .pnc-tabs{
      display:flex;
      gap:4px;
    }
    .pnc-tab-btn{
      padding:4px 8px;
      border-radius:6px;
      border:1px solid #3a4047;
      background:#262b31;
      color:#eaecef;
      font-size:11px;
      cursor:pointer;
    }
    .pnc-tab-btn.active{
      background:#3a3f45;
    }
    .pnc-close{
      cursor:pointer;
      padding:2px 8px;
      border-radius:6px;
      background:#2b2f36;
    }
    .pnc-panel-body{
      padding:12px;
      display:grid;
      gap:12px;
      font-size:13px;
    }
    .pnc-field label{
      display:block;
      margin-bottom:6px;
      color:#b7c0cc;
      font-size:12px;
    }
    .pnc-select, .pnc-input{
      width:100%;
      max-width:100%;
      padding:8px 10px;
      background:#262b31;
      border:1px solid #3a4047;
      color:#eaecef;
      border-radius:8px;
      outline:none;
    }
    .pnc-row{ display:grid; grid-template-columns:1fr auto; gap:8px; align-items:center; }
    .pnc-seg{ display:grid; grid-template-columns:repeat(3,1fr); gap:6px; }
    .pnc-seg button{
      padding:6px 8px;
      background:#262b31;
      border:1px solid #3a4047;
      color:#eaecef;
      border-radius:8px;
      cursor:pointer;
    }
    .pnc-seg button.active{ background:#3a3f45; }
    .pnc-color{
      appearance:none;
      -webkit-appearance:none;
      width:32px;
      height:32px;
      padding:0;
      border:1px solid #3a4047;
      border-radius:999px;
      background:conic-gradient(red, yellow, lime, cyan, blue, magenta, red);
      cursor:pointer;
    }
    .pnc-color::-webkit-color-swatch-wrapper { padding:0; border-radius:999px; }
    .pnc-color::-webkit-color-swatch { border:none; border-radius:999px; }
    .pnc-gear-btn{
      position:fixed;
      bottom:16px;
      left:16px;
      right:auto;
      width:36px;
      height:36px;
      line-height:36px;
      text-align:center;
      border-radius:50%;
      background:#2b2f36;
      color:#fff;
      cursor:pointer;
      z-index:2147483647;
      font-weight:700;
      box-shadow:0 4px 12px rgba(0,0,0,.3);
      user-select:none;
    }
    .pnc-row-left{
      display:flex;
      align-items:center;
      justify-content:flex-start;
      gap:8px;
    }
    .pnc-row-left input[type="checkbox"]{ margin:0; }
    .pnc-button{
      padding:6px 8px;
      background:#262b31;
      border:1px solid #3a4047;
      color:#eaecef;
      border-radius:8px;
      cursor:pointer;
      width:100%;
    }
    .pnc-button:hover{
      background:#3a3f45;
    }

    .honor-text-wrap .honor-text-svg{
      position:absolute !important;
      left:0 !important;
      right:0 !important;
      width:100% !important;
      top:50% !important;
      transform:translateY(-50%) !important;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      padding:0 2px;
    }
    .honor-text-wrap .honor-text-svg + .honor-text{ display:none !important; }

    body.tm-crime-enabled .tm-crime-progress-label{
      position:absolute;
      left:50%;
      top:50%;
      transform:translate(-50%, -50%);
      pointer-events:none;
      font-family:var(--tm-crime-bar-font-family);
      font-size:var(--tm-crime-bar-font-size);
      font-weight:bold;
      color:#fff;
      text-shadow:0 0 3px #000, 0 0 5px #000;
      white-space:nowrap;
      z-index:2;
      display:block;
    }
    body:not(.tm-crime-enabled) .tm-crime-progress-label{
      display:none !important;
    }
    body.tm-crime-enabled .tm-crime-progress-track{
      height:var(--tm-crime-bar-height) !important;
    }
    body.tm-crime-enabled .tm-crime-progress-fill{
      height:var(--tm-crime-bar-height) !important;
    }
    `;
    GM_addStyle(css);
  }

  function styleHonor(el){
    el.style.fontFamily = profileSettings.fontFamily;
    el.style.fontSize   = `${parseInt(profileSettings.fontSize,10)||12}px`;
    el.style.fontWeight = profileSettings.bold ? '700' : '400';
    el.style.color      = normHex(profileSettings.color);
    el.style.textAlign  = profileSettings.align;
    el.style.borderRadius = '5px';
    if (isMobile()) el.style.textShadow='2px 2px 3px #000';
    else el.style.textShadow='4px 4px 5px #000';
  }

  function processHonor(){
    const list = document.querySelectorAll('.honor-text-svg');
    list.forEach(el=>{
      if(!el.dataset.cleaned){
        const spans=el.querySelectorAll('span[data-char]');
        if(spans.length){
          let t=''; spans.forEach(s=> t += s.getAttribute('data-char'));
          el.textContent=t;
        }
        el.dataset.cleaned='true';
      }
      const sib = el.nextElementSibling;
      if (sib && sib.classList.contains('honor-text')) sib.style.display='none';
      styleHonor(el);
    });
  }

  function extractCrimeLabelFromAria(aria) {
    if (!aria) return '';
    const m = aria.match(/Crime skill:\s*([\d,]+)\s*\((\d+)%\)/i);
    if (m) return `Crime level ${m[1]} - ${m[2]}%`;
    return aria;
  }

  function updateCrimeCssVars() {
    document.documentElement.style.setProperty('--tm-crime-bar-font-family', crimeSettings.fontFamily);
    document.documentElement.style.setProperty('--tm-crime-bar-font-size', crimeSettings.fontSize + 'px');
    document.documentElement.style.setProperty('--tm-crime-bar-height', crimeSettings.barHeight + 'px');
  }

  function applyCrimeEnabledState() {
    if (crimeSettings.enabled) document.body.classList.add('tm-crime-enabled');
    else document.body.classList.remove('tm-crime-enabled');
  }

  function enhanceCrimeProgressBar(bar) {
    if (!bar || bar.dataset.tmCrimeEnhanced === '1') return;
    const track = bar.querySelector('div[class^="progressTrack___"], div[class*=" progressTrack___"]');
    const fill = bar.querySelector('div[aria-label^="Crime skill"]');
    if (!track || !fill) return;
    bar.dataset.tmCrimeEnhanced = '1';
    track.classList.add('tm-crime-progress-track');
    fill.classList.add('tm-crime-progress-fill');
    if (getComputedStyle(bar).position === 'static') {
      bar.style.position = 'relative';
    }
    const label = document.createElement('div');
    label.className = 'tm-crime-progress-label';
    label.textContent = extractCrimeLabelFromAria(fill.getAttribute('aria-label'));
    bar.appendChild(label);
    const observer = new MutationObserver(() => {
      label.textContent = extractCrimeLabelFromAria(fill.getAttribute('aria-label'));
    });
    observer.observe(fill, { attributes: true, attributeFilter: ['aria-label'] });
  }

  function enhanceAllCrimeBars() {
    if (!/page\.php\?sid=crimes/.test(location.href)) return;
    const bars = document.querySelectorAll('div[class^="progressBar___"], div[class*=" progressBar___"]');
    bars.forEach(enhanceCrimeProgressBar);
  }

  let panelRef=null;

  function makeMovable(box, handle){
    let sx=0, sy=0, sl=0, st=0, drag=false;
    const down=e=>{ drag=true; sx=e.clientX; sy=e.clientY; const r=box.getBoundingClientRect(); sl=r.left; st=r.top; document.addEventListener('pointermove', move); document.addEventListener('pointerup', up, {once:true}); };
    const move=e=>{ if(!drag) return; box.style.left=`${sl+(e.clientX-sx)}px`; box.style.top=`${st+(e.clientY-sy)}px`; };
    const up=()=>{ drag=false; document.removeEventListener('pointermove', move); const r=box.getBoundingClientRect(); profileSettings.panel.x=Math.round(r.left); profileSettings.panel.y=Math.round(r.top); saveProfileSettings(); };
    handle.style.touchAction='none';
    handle.addEventListener('pointerdown', down);
  }

  function openPanel(){
    if (!panelRef) return;
    profileSettings.panel.visible=true;
    saveProfileSettings();
    panelRef.classList.remove('hidden');
  }

  function applyProfileNow(){
    document.querySelectorAll('.honor-text-svg').forEach(styleHonor);
  }

  function createUI(){
    const gear=document.createElement('div');
    gear.className='pnc-gear-btn';
    gear.title='Settings';
    gear.textContent='⚙️';
    gear.addEventListener('click', openPanel);
    document.body.appendChild(gear);

    const panel=document.createElement('div');
    panel.className='pnc-panel'+(profileSettings.panel.visible?'':' hidden');
    panel.innerHTML=`
      <div class="pnc-panel-header" id="pnc-drag">
        <div class="pnc-header-left">
          <span>TORN Helper</span>
          <div class="pnc-tabs">
            <button type="button" class="pnc-tab-btn active" data-tab="profile">Profile</button>
            <button type="button" class="pnc-tab-btn" data-tab="crime">Crimes</button>
          </div>
        </div>
        <span class="pnc-close" id="pnc-close">✕</span>
      </div>
      <div class="pnc-panel-body">
        <div id="pnc-tab-profile">
          <div class="pnc-field">
            <label for="pnc-font-select">Font</label>
            <select id="pnc-font-select" class="pnc-select"></select>
          </div>
          <div class="pnc-field" id="pnc-custom-wrap" style="display:none;">
            <label for="pnc-font-custom">Custom</label>
            <input id="pnc-font-custom" class="pnc-input" type="text" placeholder='"Tahoma, serif"'>
          </div>
          <div class="pnc-field">
            <label for="pnc-size">Size</label>
            <div class="pnc-row"><input id="pnc-size" class="pnc-input" type="number" min="8" max="48" step="1"></div>
          </div>
          <div class="pnc-field">
            <label>Bold</label>
            <div class="pnc-row-left"><input id="pnc-bold" type="checkbox"></div>
          </div>
          <div class="pnc-field">
            <label>Color</label>
            <input id="pnc-color" class="pnc-color" type="color">
          </div>
          <div class="pnc-field">
            <label>Align</label>
            <div class="pnc-seg" id="pnc-align">
              <button type="button" data-align="left">Left</button>
              <button type="button" data-align="center">Center</button>
              <button type="button" data-align="right">Right</button>
            </div>
          </div>
        </div>
        <div id="pnc-tab-crime" style="display:none;">
          <div class="pnc-field">
            <label for="th-crime-font-select">Font</label>
            <select id="th-crime-font-select" class="pnc-select"></select>
          </div>
          <div class="pnc-field" id="th-crime-custom-wrap" style="display:none;">
            <label for="th-crime-font-custom">Custom</label>
            <input id="th-crime-font-custom" class="pnc-input" type="text" placeholder='"Arial, sans-serif"'>
          </div>
          <div class="pnc-field">
            <label for="th-crime-size">Font size (px)</label>
            <input id="th-crime-size" class="pnc-input" type="number" min="8" max="40">
          </div>
          <div class="pnc-field">
            <label for="th-crime-height">Bar height (px)</label>
            <input id="th-crime-height" class="pnc-input" type="number" min="8" max="50">
          </div>
          <div class="pnc-field">
            <button type="button" id="th-crime-reset" class="pnc-button">Reset to default</button>
          </div>
          <div class="pnc-field">
            <label class="pnc-row-left">
              <input id="th-crime-enabled" type="checkbox">
              Crime bar script ON
            </label>
          </div>
        </div>
      </div>`;
    document.body.appendChild(panel);
    panelRef=panel;

    const titleDrag = panel.querySelector('#pnc-drag');
    const fontSelect=panel.querySelector('#pnc-font-select');
    const customWrap=panel.querySelector('#pnc-custom-wrap');
    const customInput=panel.querySelector('#pnc-font-custom');
    const sizeInput=panel.querySelector('#pnc-size');
    const boldInput=panel.querySelector('#pnc-bold');
    const colorInput=panel.querySelector('#pnc-color');
    const alignSeg=panel.querySelector('#pnc-align');
    const closeBtn = panel.querySelector('#pnc-close');

    const tabButtons = panel.querySelectorAll('.pnc-tab-btn');
    const tabProfile = panel.querySelector('#pnc-tab-profile');
    const tabCrime = panel.querySelector('#pnc-tab-crime');

    const crimeFontSelect = panel.querySelector('#th-crime-font-select');
    const crimeCustomWrap = panel.querySelector('#th-crime-custom-wrap');
    const crimeCustomInput = panel.querySelector('#th-crime-font-custom');
    const crimeSizeInput = panel.querySelector('#th-crime-size');
    const crimeHeightInput = panel.querySelector('#th-crime-height');
    const crimeEnabledInput = panel.querySelector('#th-crime-enabled');
    const crimeResetBtn = panel.querySelector('#th-crime-reset');

    function activateTab(name) {
      tabButtons.forEach(b => b.classList.toggle('active', b.dataset.tab === name));
      tabProfile.style.display = name === 'profile' ? 'block' : 'none';
      tabCrime.style.display = name === 'crime' ? 'block' : 'none';
    }

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        activateTab(btn.dataset.tab);
      });
    });

    (function buildSystemProfile(){
      const available=SYSTEM_FONT_CANDIDATES.filter(isFontPresent);
      const og=document.createElement('optgroup');
      og.label='System';
      available.forEach(n=>{ const o=document.createElement('option'); o.value=`sys:${n}`; o.textContent=n; og.appendChild(o); });
      if(!available.length){ const o=document.createElement('option'); o.disabled=true; o.textContent='(none detected)'; og.appendChild(o); }
      fontSelect.appendChild(og);
    })();
    (function buildGoogleProfile(){
      const og=document.createElement('optgroup');
      og.label='Google';
      GOOGLE_FONTS.forEach(n=>{ const o=document.createElement('option'); o.value=`g:${n}`; o.textContent=n; og.appendChild(o); });
      fontSelect.appendChild(og);
    })();
    (function buildCustomProfile(){
      const og=document.createElement('optgroup');
      og.label='Other';
      const opt=document.createElement('option');
      opt.value='custom';
      opt.textContent='Custom';
      og.appendChild(opt);
      fontSelect.appendChild(og);
    })();

    (function buildSystemCrime(){
      const available=SYSTEM_FONT_CANDIDATES.filter(isFontPresent);
      const og=document.createElement('optgroup');
      og.label='System';
      available.forEach(n=>{ const o=document.createElement('option'); o.value=`sys:${n}`; o.textContent=n; og.appendChild(o); });
      if(!available.length){ const o=document.createElement('option'); o.disabled=true; o.textContent='(none detected)'; og.appendChild(o); }
      crimeFontSelect.appendChild(og);
    })();
    (function buildGoogleCrime(){
      const og=document.createElement('optgroup');
      og.label='Google';
      GOOGLE_FONTS.forEach(n=>{ const o=document.createElement('option'); o.value=`g:${n}`; o.textContent=n; og.appendChild(o); });
      crimeFontSelect.appendChild(og);
    })();
    (function buildCustomCrime(){
      const og=document.createElement('optgroup');
      og.label='Other';
      const opt=document.createElement('option');
      opt.value='custom';
      opt.textContent='Custom';
      og.appendChild(opt);
      crimeFontSelect.appendChild(og);
    })();

    sizeInput.value=parseInt(profileSettings.fontSize,10);
    boldInput.checked=!!profileSettings.bold;
    colorInput.value=normHex(profileSettings.color);

    function setInitialFontSelection(){
      if (profileSettings.fontSource==='google' && profileSettings.googleFamily){
        fontSelect.value=`g:${profileSettings.googleFamily}`;
        customWrap.style.display='none';
      } else if (profileSettings.fontSource==='system'){
        const first=(profileSettings.fontFamily||PROFILE_DEFAULTS.fontFamily).split(',')[0].replace(/["']/g,'').trim();
        const sysVal=`sys:${first}`;
        if ([...fontSelect.options].some(o=>o.value===sysVal)){
          fontSelect.value=sysVal;
          customWrap.style.display='none';
        } else {
          fontSelect.value='custom';
          customWrap.style.display='';
        }
      } else {
        fontSelect.value='custom';
        customWrap.style.display='';
      }
      customInput.value=profileSettings.fontFamily;
    }
    setInitialFontSelection();

    function updateAlignUI(){
      alignSeg.querySelectorAll('button').forEach(b=> b.classList.toggle('active', b.dataset.align===profileSettings.align));
    }
    updateAlignUI();

    fontSelect.addEventListener('change', ()=>{
      const v=fontSelect.value;
      if (v.startsWith('sys:')){
        const n=v.slice(4);
        profileSettings.fontSource='system';
        profileSettings.googleFamily='';
        profileSettings.fontFamily=`"${n}", sans-serif`;
        customWrap.style.display='none';
      } else if (v.startsWith('g:')){
        const f=v.slice(2);
        profileSettings.fontSource='google';
        profileSettings.googleFamily=f;
        profileSettings.fontFamily=`"${f}", sans-serif`;
        customWrap.style.display='none';
        loadGoogleFont(f);
      } else {
        profileSettings.fontSource='custom';
        customWrap.style.display='';
      }
      saveProfileSettings();
      applyProfileNow();
    });

    customInput.addEventListener('input', ()=>{
      profileSettings.fontSource='custom';
      profileSettings.fontFamily=(customInput.value||PROFILE_DEFAULTS.fontFamily).trim();
      saveProfileSettings();
      applyProfileNow();
    });

    sizeInput.addEventListener('input', ()=>{
      profileSettings.fontSize=clamp(parseInt(sizeInput.value,10)||PROFILE_DEFAULTS.fontSize,8,48);
      saveProfileSettings();
      applyProfileNow();
    });

    boldInput.addEventListener('change', ()=>{
      profileSettings.bold=!!boldInput.checked;
      saveProfileSettings();
      applyProfileNow();
    });

    colorInput.addEventListener('input', ()=>{
      profileSettings.color=normHex(colorInput.value);
      saveProfileSettings();
      applyProfileNow();
    });

    alignSeg.querySelectorAll('button').forEach(btn=>
      btn.addEventListener('click', ()=>{
        profileSettings.align=btn.dataset.align;
        saveProfileSettings();
        updateAlignUI();
        applyProfileNow();
      })
    );

    function setInitialCrimeFontSelection(){
      if (crimeSettings.fontSource==='google' && crimeSettings.googleFamily){
        crimeFontSelect.value=`g:${crimeSettings.googleFamily}`;
        crimeCustomWrap.style.display='none';
      } else if (crimeSettings.fontSource==='system'){
        const first=(crimeSettings.fontFamily||CRIME_DEFAULTS.fontFamily).split(',')[0].replace(/["']/g,'').trim();
        const sysVal=`sys:${first}`;
        if ([...crimeFontSelect.options].some(o=>o.value===sysVal)){
          crimeFontSelect.value=sysVal;
          crimeCustomWrap.style.display='none';
        } else {
          crimeFontSelect.value='custom';
          crimeCustomWrap.style.display='';
        }
      } else {
        crimeFontSelect.value='custom';
        crimeCustomWrap.style.display='';
      }
      crimeCustomInput.value=crimeSettings.fontFamily;
    }
    setInitialCrimeFontSelection();

    crimeFontSelect.addEventListener('change', ()=>{
      const v=crimeFontSelect.value;
      if (v.startsWith('sys:')){
        const n=v.slice(4);
        crimeSettings.fontSource='system';
        crimeSettings.googleFamily='';
        crimeSettings.fontFamily=`"${n}", sans-serif`;
        crimeCustomWrap.style.display='none';
      } else if (v.startsWith('g:')){
        const f=v.slice(2);
        crimeSettings.fontSource='google';
        crimeSettings.googleFamily=f;
        crimeSettings.fontFamily=`"${f}", sans-serif`;
        crimeCustomWrap.style.display='none';
        loadGoogleFont(f);
      } else {
        crimeSettings.fontSource='custom';
        crimeCustomWrap.style.display='';
      }
      saveCrimeSettings();
      updateCrimeCssVars();
    });

    crimeCustomInput.addEventListener('input', ()=>{
      crimeSettings.fontSource='custom';
      crimeSettings.fontFamily=(crimeCustomInput.value||CRIME_DEFAULTS.fontFamily).trim();
      saveCrimeSettings();
      updateCrimeCssVars();
    });

    crimeSizeInput.value = parseInt(crimeSettings.fontSize, 10);
    crimeHeightInput.value = parseInt(crimeSettings.barHeight, 10);
    crimeEnabledInput.checked = !!crimeSettings.enabled;

    crimeSizeInput.addEventListener('input', () => {
      const v = parseInt(crimeSizeInput.value, 10);
      crimeSettings.fontSize = clamp(v || CRIME_DEFAULTS.fontSize, 8, 40);
      saveCrimeSettings();
      updateCrimeCssVars();
    });

    crimeHeightInput.addEventListener('input', () => {
      const v = parseInt(crimeHeightInput.value, 10);
      crimeSettings.barHeight = clamp(v || CRIME_DEFAULTS.barHeight, 8, 50);
      saveCrimeSettings();
      updateCrimeCssVars();
    });

    crimeEnabledInput.addEventListener('change', () => {
      crimeSettings.enabled = !!crimeEnabledInput.checked;
      saveCrimeSettings();
      applyCrimeEnabledState();
    });

    crimeResetBtn.addEventListener('click', () => {
      crimeSettings = Object.assign({}, CRIME_DEFAULTS);
      crimeFontSelect.value = 'sys:Arial';
      crimeCustomWrap.style.display = 'none';
      crimeCustomInput.value = crimeSettings.fontFamily;
      crimeSizeInput.value = crimeSettings.fontSize;
      crimeHeightInput.value = crimeSettings.barHeight;
      crimeEnabledInput.checked = crimeSettings.enabled;
      saveCrimeSettings();
      updateCrimeCssVars();
      applyCrimeEnabledState();
    });

    closeBtn.addEventListener('click', ()=>{
      profileSettings.panel.visible=false;
      saveProfileSettings();
      panel.classList.add('hidden');
    });

    makeMovable(panel, titleDrag);

    if (typeof GM_registerMenuCommand==='function'){
      GM_registerMenuCommand('TORN Helper: Open Settings', openPanel);
    }

    if (!profileSettings.panel.visible) panel.classList.add('hidden');
  }

  function start(){
    if (!document.body) { setTimeout(start, 50); return; }
    injectCSS();
    createUI();
    processHonor();
    if (profileSettings.fontSource==='google' && profileSettings.googleFamily) {
      loadGoogleFont(profileSettings.googleFamily);
    }
    if (crimeSettings.fontSource==='google' && crimeSettings.googleFamily) {
      loadGoogleFont(crimeSettings.googleFamily);
    }
    const obs=new MutationObserver(processHonor);
    obs.observe(document.body, { childList:true, subtree:true });

    updateCrimeCssVars();
    applyCrimeEnabledState();
    if (/page\.php\?sid=crimes/.test(location.href)) {
      enhanceAllCrimeBars();
      const crimeObs = new MutationObserver(enhanceAllCrimeBars);
      crimeObs.observe(document.body, { childList:true, subtree:true });
    }
  }

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
