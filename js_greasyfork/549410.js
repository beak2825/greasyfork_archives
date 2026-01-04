// ==UserScript==
// @name         One-Click Faucet Launcher — Anti-CAPTCHA settings (UA UI)
// @namespace    https://example.com
// @version      1.2.1
// @description  Панель кранів: автоматичний реферал, затримки, послідовне відкривання, виключення доменів, виявлення CAPTCHA. Український інтерфейс. Не вирішує reCAPTCHA/hCaptcha.
// @author       You
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549410/One-Click%20Faucet%20Launcher%20%E2%80%94%20Anti-CAPTCHA%20settings%20%28UA%20UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549410/One-Click%20Faucet%20Launcher%20%E2%80%94%20Anti-CAPTCHA%20settings%20%28UA%20UI%29.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  // ---------- Настройки и ключи хранения ----------
  const PANEL_ID = 'oc-panel';
  const STORAGE = {
    faucets: 'oc_faucets_v1',
    wallet: 'oc_wallet_v1',
    options: 'oc_options_v121',
    layoutPos: 'oc_panel_pos_v1',
    layoutSize: 'oc_panel_size_v1',
    layoutCollapsed: 'oc_panel_collapsed_v1'
  };

  const DEFAULT_FAUCETS_TEXT = `ShortlinksFaucet|https://shortlinksfaucet.xyz/?p=instantpayingfaucets
ClaimFreeCoins BTC|https://claimfreecoins.io
beefaucet (основний)|https://beefaucet.org
kiddypay TRX|https://kiddypay.xyz/trx
is2btc BTC|https://is2btc.xyz`;

  const DEFAULT_OPTIONS = {
    referral: 'sstels215@gmail.com',
    delayMs: 800,
    openInSameTab: false,
    excludedDomains: [],
    oneClickMode: true
  };

  // ---------- Утилиты хранения ----------
  async function saveItem(key, value) { try { await GM_setValue(key, value); } catch(e){} }
  async function getItem(key, fallback = null) { try { const v = await GM_getValue(key); return v === undefined ? fallback : v; } catch (e) { return fallback; } }

  // ---------- Стили UI ----------
  GM_addStyle(`
    #${PANEL_ID} { position: fixed; right: 10px; bottom: 10px; width: 520px; max-width: calc(100% - 20px); background: #0b1220; color:#e6eef8; border-radius:10px;
      z-index:2147483647; box-shadow:0 10px 30px rgba(2,6,23,0.6); font-family: Arial, sans-serif; font-size:13px; resize: both; overflow:auto; min-width:220px; min-height:54px; }
    #${PANEL_ID} .oc-header { padding:8px 10px; cursor: move; display:flex; align-items:center; justify-content:space-between; user-select:none; gap:8px; }
    #${PANEL_ID} .oc-body { padding:10px; }
    #${PANEL_ID} input, #${PANEL_ID} textarea, #${PANEL_ID} select { width:100%; padding:6px; border-radius:6px; border:1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); color:inherit; box-sizing:border-box; }
    #${PANEL_ID} button { padding:6px 8px; border-radius:6px; border:none; cursor:pointer; background: rgba(255,255,255,0.06); color:inherit; font-weight:700; }
    #${PANEL_ID} .faucet-item { padding:8px; border-radius:6px; margin-bottom:8px; background: rgba(255,255,255,0.02); display:flex; justify-content:space-between; align-items:center; gap:8px; }
    #${PANEL_ID} .faucet-item .meta { max-width: 68%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    #${PANEL_ID} .ua-badge { position: absolute; left: 12px; top: 10px; background: #0057b7; color: #ffd700; padding:4px 8px; border-radius:6px; font-weight:700; font-size:12px; }
    #oc-notif { position: fixed; right: 12px; bottom: 70px; z-index:2147483648; background:#bbf7d0; color:#000; padding:8px 10px; border-radius:6px; font-weight:700; box-shadow:0 6px 18px rgba(2,6,23,0.3); }
    #${PANEL_ID} .controls { display:flex; gap:6px; align-items:center; }
    #${PANEL_ID} .small { padding:4px 6px; font-size:12px; }
    #${PANEL_ID} label.small { font-size:12px; }
  `);

  // ---------- Защита от дублей панели ----------
  if (document.getElementById(PANEL_ID)) {
    const existing = document.getElementById(PANEL_ID);
    existing.style.boxShadow = '0 0 0 3px rgba(96,165,250,0.6)';
    setTimeout(()=> existing.style.boxShadow = '', 1200);
    notify('Панель вже відкрита');
    return;
  }

  // ---------- Создание DOM панели ----------
  const panel = document.createElement('div');
  panel.id = PANEL_ID;
  panel.innerHTML = `
    <div class="oc-header">
      <div style="display:flex;gap:8px;align-items:center;">
        <strong>One-Click Faucet Launcher</strong>
        <div class="ua-badge">🇺🇦 Зроблено в Україні</div>
      </div>
      <div class="controls">
        <button id="oc-collapse" class="small">—</button>
        <button id="oc-pin" class="small" title="Зберегти позицію">📌</button>
        <button id="oc-close" class="small">✕</button>
      </div>
    </div>
    <div class="oc-body">
      <div style="margin-bottom:8px;">
        <label style="font-weight:700;">Реферальний параметр (email або код):</label>
        <input id="oc-referral" placeholder="sstels215@gmail.com" />
      </div>

      <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
        <label class="small"><input type="checkbox" id="oc-open-same" /> Відкривати в тій же вкладці (послідовно)</label>
        <label style="margin-left:auto" class="small">Затримка між відкриттями (мс): <input id="oc-delay" type="number" value="800" style="width:80px; margin-left:6px;" /></label>
      </div>

      <div style="margin-bottom:8px;">
        <label style="font-weight:700;">Виключити домени (не додавати реферальний параметр):</label>
        <input id="oc-exclude" placeholder="example.com, sub.example.com" />
        <div style="font-size:12px;color:#9aa4b2;margin-top:4px;">Введіть домени через кому (наприклад: faucetpay.io)</div>
      </div>

      <div style="margin-top:6px;">
        <label style="font-weight:700;">Адреса гаманця (для автопідстановки):</label>
        <input id="oc-wallet" placeholder="Вставте адресу гаманця" />
        <div style="display:flex;gap:8px;margin-top:6px;">
          <button id="oc-save-wallet" class="small">Зберегти адресу</button>
          <button id="oc-paste-wallet" class="small">Вставити з буфера</button>
        </div>
      </div>

      <div style="margin-top:8px;">
        <label style="font-weight:700;">Список кранів (Назва|URL, по одному на рядок):</label>
        <textarea id="oc-list" rows="6" placeholder="Назва|https://..."></textarea>
        <div style="display:flex;gap:8px;margin-top:6px;">
          <button id="oc-import" class="small">Імпортувати/Оновити список</button>
          <button id="oc-reset" class="small">Скинути</button>
          <button id="oc-open-all" class="small">Відкрити всі</button>
        </div>
      </div>

      <div style="margin-top:12px;">
        <label style="font-weight:700;">Знайдені крани:</label>
        <div id="oc-list-container" style="margin-top:8px;"></div>
      </div>

      <div style="margin-top:10px; font-size:12px; color:#9aa4b2;">
        <div>Примітка: скрипт не обходить reCAPTCHA/hCaptcha і не автоматизує їх рішення. Якщо CAPTCHA виявлена — автоматичні дії зупиняться.</div>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  // ---------- UI: notifications и layout ----------
  function notify(msg, ms = 2600) {
    try { const old = document.getElementById('oc-notif'); if (old) old.remove(); } catch(e){}
    const n = document.createElement('div'); n.id = 'oc-notif'; n.textContent = msg;
    Object.assign(n.style, { position:'fixed', right:'12px', bottom:'70px', zIndex:2147483648, background:'#bbf7d0', color:'#000', padding:'8px 10px', borderRadius:'6px', fontWeight:'700', boxShadow:'0 6px 18px rgba(2,6,23,0.3)' });
    document.body.appendChild(n);
    setTimeout(()=>{ try { n.remove(); } catch(e){} }, ms);
  }

  function saveLayoutPos(left, top) { try { localStorage.setItem(STORAGE.layoutPos, JSON.stringify({ left, top })); } catch(e){} }
  function loadLayoutPos() { try { const s = localStorage.getItem(STORAGE.layoutPos); return s ? JSON.parse(s) : null; } catch(e){ return null; } }
  function saveLayoutSize(w,h) { try { localStorage.setItem(STORAGE.layoutSize, JSON.stringify({ width:w, height:h })); } catch(e){} }
  function loadLayoutSize() { try { const s = localStorage.getItem(STORAGE.layoutSize); return s ? JSON.parse(s) : null; } catch(e){ return null; } }
  function saveCollapsed(v) { try { localStorage.setItem(STORAGE.layoutCollapsed, v ? '1' : '0'); } catch(e){} }
  function loadCollapsed() { try { return localStorage.getItem(STORAGE.layoutCollapsed) === '1'; } catch(e){ return false; } }

  // close / collapse / pin buttons
  document.getElementById('oc-close').addEventListener('click', ()=>{ panel.remove(); notify('Панель закрита'); });
  document.getElementById('oc-collapse').addEventListener('click', ()=> {
    const body = panel.querySelector('.oc-body');
    if (body.style.display === 'none') { body.style.display = ''; document.getElementById('oc-collapse').textContent = '—'; saveCollapsed(false); }
    else { body.style.display = 'none'; document.getElementById('oc-collapse').textContent = '+'; saveCollapsed(true); }
  });
  document.getElementById('oc-pin').addEventListener('click', () => {
    const r = panel.getBoundingClientRect(); saveLayoutPos(r.left, r.top); saveLayoutSize(Math.round(r.width), Math.round(r.height)); notify('Збережено позицію та розмір');
  });

  // drag support
  (function(){
    const header = panel.querySelector('.oc-header');
    let isDown=false, sx=0, sy=0, sl=0, st=0;
    header.addEventListener('mousedown', e=>{ if(e.button!==0) return; isDown=true; sx=e.clientX; sy=e.clientY; const r=panel.getBoundingClientRect(); sl=r.left; st=r.top; panel.style.right='auto'; panel.style.bottom='auto'; panel.style.position='fixed'; document.body.style.userSelect='none'; });
    window.addEventListener('mouseup', ()=>{ if(!isDown) return; isDown=false; document.body.style.userSelect=''; const r=panel.getBoundingClientRect(); saveLayoutPos(r.left, r.top); });
    window.addEventListener('mousemove', e=>{ if(!isDown) return; const dx=e.clientX-sx, dy=e.clientY-sy; panel.style.left = (sl+dx) + 'px'; panel.style.top = (st+dy) + 'px'; });
  })();

  // restore layout
  (function(){
    const sz = loadLayoutSize(); if(sz && sz.width) { panel.style.width = sz.width + 'px'; if(sz.height) panel.style.height = sz.height + 'px'; }
    const pos = loadLayoutPos(); if(pos && typeof pos.left === 'number') { panel.style.left = pos.left + 'px'; panel.style.top = pos.top + 'px'; panel.style.right='auto'; panel.style.bottom='auto'; panel.style.position='fixed'; }
    if(loadCollapsed()){ panel.querySelector('.oc-body').style.display = 'none'; panel.querySelector('#oc-collapse').textContent = '+'; }
  })();

  // ---------- Функции по списку кранов и реферальному URL ----------
  function parseFaucetsFromText(text) {
    return (text||'').split(/\r?\n/).map(l=>l.trim()).filter(l=>l && !l.startsWith('#')).map(line=>{
      const parts = line.split('|').map(p=>p.trim());
      return { name: parts[0] || parts[1] || 'Без назви', url: parts[1] || parts[0] || '' };
    }).filter(x=>x.url);
  }
  function escapeHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function renderList(faucets){
    const container = panel.querySelector('#oc-list-container'); container.innerHTML = '';
    faucets.forEach(f=>{
      const item = document.createElement('div'); item.className='faucet-item';
      const meta = document.createElement('div'); meta.className='meta'; meta.title=f.url;
      meta.innerHTML = `<div style="font-weight:700;">${escapeHtml(f.name)}</div>
                        <div style="font-size:12px;opacity:0.85;">${escapeHtml(f.url)}</div>`;
      const controls = document.createElement('div'); controls.style.display='flex'; controls.style.gap='6px';
      const btnOpen = document.createElement('button'); btnOpen.textContent='Відкрити'; btnOpen.addEventListener('click', ()=>openFaucet(f));
      const btnOpenBg = document.createElement('button'); btnOpenBg.textContent='Відкрити(bg)'; btnOpenBg.addEventListener('click', ()=>openFaucet(f,{active:false}));
      const btnCopy = document.createElement('button'); btnCopy.textContent='Копіювати'; btnCopy.addEventListener('click', ()=>{ navigator.clipboard.writeText(withReferral(f.url)).then(()=>notify('Скопійовано URL з рефералом')); });
      controls.appendChild(btnOpen); controls.appendChild(btnOpenBg); controls.appendChild(btnCopy);
      item.appendChild(meta); item.appendChild(controls); container.appendChild(item);
    });
  }

  function shouldExcludeDomain(url, excludedList){
    try{ const h = new URL(url).hostname; return excludedList.some(d=> h === d || h.endsWith('.'+d)); } catch(e){ return false; }
  }

  function getOptionsFromUI(){
    return {
      referral: (panel.querySelector('#oc-referral').value || DEFAULT_OPTIONS.referral).trim(),
      delayMs: Math.max(100, parseInt(panel.querySelector('#oc-delay').value||DEFAULT_OPTIONS.delayMs,10)),
      openInSameTab: !!panel.querySelector('#oc-open-same').checked,
      excluded: (panel.querySelector('#oc-exclude').value||'').split(',').map(s=>s.trim()).filter(Boolean),
      oneClickMode: true
    };
  }

  function withReferral(url){
    try{
      if(!url) return url;
      const opts = getOptionsFromUI();
      if(shouldExcludeDomain(url, opts.excluded)) return url;
      const parts = url.split('#'); const before = parts[0]; const hash = parts.length>1 ? '#' + parts.slice(1).join('#') : '';
      if (/[?&]r=.*?([&]|$)/i.test(before)) return url;
      const sep = before.includes('?') ? '&' : '?';
      return before + sep + 'r=' + encodeURIComponent(opts.referral) + hash;
    } catch(e){ return url; }
  }

  // ---------- Детектор CAPTCHA ----------
  function detectCaptchaOnPage(doc = document){
    try {
      if (doc.querySelector('iframe[src*="recaptcha"]') || doc.querySelector('.g-recaptcha') || doc.querySelector('[data-sitekey]')) return true;
      if (doc.querySelector('iframe[src*="hcaptcha"]') || doc.querySelector('.h-captcha')) return true;
      const texts = Array.from(doc.querySelectorAll('div')).map(d=>d.innerText||'').join(' ');
      if (/recaptcha|I am not a robot|Я не робот|hcaptcha/i.test(texts)) return true;
      return false;
    } catch(e){ return false; }
  }

  // ---------- Open logic (single and "open all") ----------
  async function openFaucet(faucet, opts = { active:true }){
    const options = getOptionsFromUI();
    await saveItem(STORAGE.options, options);
    const url = withReferral(faucet.url);
    try {
      if (options.openInSameTab) {
        // navigate current tab
        location.href = url;
      } else {
        try { GM_openInTab ? GM_openInTab(url, opts) : window.open(url, opts.active ? '_blank' : '_blank'); }
        catch(e){ window.open(url, '_blank'); }
      }
      notify(`Відкрито: ${faucet.name}`);
    } catch(e){ console.error(e); notify('Помилка відкриття'); }
  }

  function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

  panel.querySelector('#oc-open-all').addEventListener('click', async ()=>{
    if(!confirm('Відкрити всі крани послідовно (повільно)?')) return;
    const faucets = parseFaucetsFromText(panel.querySelector('#oc-list').value || '');
    const opts = getOptionsFromUI();
    if (opts.openInSameTab) {
      if (faucets.length) location.href = withReferral(faucets[0].url);
    } else {
      for (let i=0;i<faucets.length;i++){
        const f = faucets[i];
        openFaucet(f, { active:true });
        await sleep(opts.delayMs);
      }
    }
  });

  // ---------- Автоподстановка кошелька при заходе на страницу крана (тільки same origin) ----------
  async function tryAutofillOnSameOrigin(url){
    try {
      const u = new URL(url);
      if (location.hostname !== u.hostname) return;
      if (detectCaptchaOnPage(document)) { notify('CAPTCHA виявлено — автопідстановка призупинена', 5000); return; }
      const wallet = await getItem(STORAGE.wallet, '');
      if (!wallet) return;
      const selectors = ["input[name*='wallet']","input[id*='wallet']","input[name*='address']","input[id*='address']",
        "input[placeholder*='wallet']","input[placeholder*='address']","input[type='text']","textarea"];
      let filled = false;
      for (const s of selectors) {
        const nodes = Array.from(document.querySelectorAll(s));
        for (const n of nodes) {
          try {
            if (!n) continue;
            const val = (n.value || '').trim();
            if (!val || val.length < 8) {
              n.focus(); n.value = wallet;
              n.dispatchEvent(new Event('input',{bubbles:true})); n.dispatchEvent(new Event('change',{bubbles:true}));
              n.style.outline = '3px solid #60a5fa';
              filled = true;
            }
          } catch(e){}
        }
        if (filled) break;
      }
      if (filled) notify('Адреса гаманця автопідставлена');
    } catch(e){}
  }

  // Если пользователь попадает на страницу крана (совпадает hostname) — попытка autofill
  (async function autoFillOnLoadIfFaucet(){
    const text = await getItem(STORAGE.faucets, DEFAULT_FAUCETS_TEXT);
    const faucets = parseFaucetsFromText(text);
    const hostMatches = faucets.filter(f => { try { return new URL(f.url).hostname === location.hostname; } catch(e){ return false; } });
    if (!hostMatches.length) return;
    const opts = await getItem(STORAGE.options, DEFAULT_OPTIONS);
    if (!opts.oneClickMode) return;
    if (detectCaptchaOnPage(document)) { notify('CAPTCHA виявлено на сторінці — автопідстановка призупинена', 6000); return; }
    await tryAutofillOnSameOrigin(location.href);
  })();

  // ---------- Кнопки: save/import/reset/paste wallet ----------
  panel.querySelector('#oc-save-wallet').addEventListener('click', async ()=>{
    const v = panel.querySelector('#oc-wallet').value.trim();
    await saveItem(STORAGE.wallet, v);
    notify('Адресу збережено');
  });
  panel.querySelector('#oc-paste-wallet').addEventListener('click', async ()=> {
    try { const txt = await navigator.clipboard.readText(); panel.querySelector('#oc-wallet').value = txt; notify('Буфер вставлено'); } catch(e){ alert('Не вдалось прочитати буфер'); }
  });

  panel.querySelector('#oc-import').addEventListener('click', async ()=>{
    const t = panel.querySelector('#oc-list').value.trim();
    if(!t) return alert('Список порожній');
    await saveItem(STORAGE.faucets, t);
    renderList(parseFaucetsFromText(t));
    notify('Список імпортовано');
  });

  panel.querySelector('#oc-reset').addEventListener('click', async ()=>{
    if(!confirm('Скинути список кранів до стандартного?')) return;
    await saveItem(STORAGE.faucets, DEFAULT_FAUCETS_TEXT);
    panel.querySelector('#oc-list').value = DEFAULT_FAUCETS_TEXT;
    renderList(parseFaucetsFromText(DEFAULT_FAUCETS_TEXT));
    notify('Список скинуто');
  });

  // ---------- Инициализация UI значений ----------
  (async function initUI(){
    const faucetsText = await getItem(STORAGE.faucets, DEFAULT_FAUCETS_TEXT);
    panel.querySelector('#oc-list').value = faucetsText;
    panel.querySelector('#oc-list').dispatchEvent(new Event('input'));
    panel.querySelector('#oc-list').value = faucetsText;
    const wallet = await getItem(STORAGE.wallet, '');
    panel.querySelector('#oc-wallet').value = wallet;
    const opts = await getItem(STORAGE.options, DEFAULT_OPTIONS);
    panel.querySelector('#oc-referral').value = opts.referral || DEFAULT_OPTIONS.referral;
    panel.querySelector('#oc-delay').value = opts.delayMs || DEFAULT_OPTIONS.delayMs;
    panel.querySelector('#oc-open-same').checked = !!opts.openInSameTab;
    panel.querySelector('#oc-exclude').value = (opts.excluded || []).join(', ');
    renderList(parseFaucetsFromText(faucetsText));
  })();

  // keyboard toggle Ctrl+Shift+F
  window.addEventListener('keydown', (e)=>{ if (e.ctrlKey && e.shiftKey && e.code === 'KeyF') { const body = panel.querySelector('.oc-body'); if (body.style.display === 'none'){ body.style.display=''; notify('Панель показана'); } else { body.style.display='none'; notify('Панель схована'); } } });

  // GM menu toggle
  try { GM_registerMenuCommand && GM_registerMenuCommand('One-Click: Показати/сховати панель', ()=>{ panel.style.display = panel.style.display === 'none' ? '' : 'none'; }); } catch(e){}

  // немного самозащиты: удаление маленьких оставшихся блоков слева (heuristic)
  try {
    Array.from(document.querySelectorAll('div')).forEach(d => {
      try { const r = d.getBoundingClientRect(); if (r.width <= 220 && r.height <= 220 && r.left < 20 && r.top > 30 && d.id !== PANEL_ID && d.id !== 'oc-notif') { if (d.innerText && d.innerText.includes('Відкрити')) d.remove(); } } catch(e){}
    });
  } catch(e){}

})();
