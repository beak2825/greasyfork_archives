// ==UserScript==
// @name         CS Group Maker
// @namespace    cs-tools
// @version      1.0
// @description  Create Chicken Smoothie groups with trading setting
// @match        https://chickensmoothie.com/*
// @match        https://www.chickensmoothie.com/*
// @run-at       document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/555448/CS%20Group%20Maker.user.js
// @updateURL https://update.greasyfork.org/scripts/555448/CS%20Group%20Maker.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CFG = {
    WAIT_AFTER_SUBMIT_MS: 8000,
    FORM_READY_RETRIES: 60,
    FORM_READY_INTERVAL: 200,
    DELAY_BETWEEN_GROUPS_MS: 200,
    DEFAULT_USER_ID: '299578',
    VERSION: '1.0',
  };

  const SS = window.sessionStorage;
  const qs = (sel, root=document) => root.querySelector(sel);
  const qsa = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const sleep = (ms)=> new Promise(r=>setTimeout(r,ms));
  const norm = (s)=> (s||'').replace(/\s+/g,' ').trim().toLowerCase();
  const onCreatePage = () => /\/accounts\/creategroup\.php\b/i.test(location.pathname);
  const createUrl = () => 'https://www.chickensmoothie.com/accounts/creategroup.php';

  let logEl = null;
  const log = (msg) => {
    const t = new Date().toLocaleTimeString();
    if (logEl) {
      logEl.textContent += `[${t}] ${msg}\n`;
      logEl.scrollTop = logEl.scrollHeight;
    }
  };

  const SKEY = {
    running:'csgm_running', queue:'csgm_queue', userId:'csgm_user',
    current:'csgm_current', attempts:'csgm_attempts', trade:'csgm_trade'
  };
  const getRunning = ()=> SS.getItem(SKEY.running) === '1';
  const setRunning = (b)=> SS.setItem(SKEY.running, b ? '1' : '0');
  const getQueue = ()=> { try { return JSON.parse(SS.getItem(SKEY.queue)||'[]'); } catch { return []; } };
  const setQueue = (arr)=> SS.setItem(SKEY.queue, JSON.stringify(arr||[]));
  const getUserId = ()=> SS.getItem(SKEY.userId) || '';
  const setUserId = (v)=> SS.setItem(SKEY.userId, v||'');
  const getCurrent = ()=> SS.getItem(SKEY.current) || '';
  const setCurrent = (v)=> SS.setItem(SKEY.current, v||'');
  const getAttempts = ()=> { try { return JSON.parse(SS.getItem(SKEY.attempts)||'{}'); } catch { return {}; } };
  const setAttempts= (obj)=> SS.setItem(SKEY.attempts, JSON.stringify(obj||{}));
  const getAttempt = (name)=> getAttempts()[name] || 0;
  const incAttempt = (name)=> { const a=getAttempts(); a[name]=(a[name]||0)+1; setAttempts(a); return a[name]; };
  const clearAttempt = (name)=> { const a=getAttempts(); if(name in a){ delete a[name]; setAttempts(a); } };
  const getTrade = ()=> SS.getItem(SKEY.trade) || 'disable';
  const setTrade = (v)=> SS.setItem(SKEY.trade, v || 'disable');

  // ---------------- Site messages ----------------
  function duplicateErrorPresent(expectedName){
    const want = norm(expectedName);
    const redSpans = qsa('span[style*="color:red"]');
    const pool = redSpans.length ? redSpans.map(n => n.innerText || '') : [ (document.body?.innerText || '') ];
    const re = /A\s+group\s+with\s+the\s+name\s+['"'‘’“”]([^"'‘’“”]+)['"'‘’“”]\s+already\s+exists\./i;
    for (const txt of pool) {
      const m = (txt || '').match(re);
      if (m && (!expectedName || norm(m[1]) === want)) return true;
    }
    return false;
  }

  function creationSuccessPresent(expectedName){
    const txt = document.body?.innerText || '';
    const m = txt.match(/A\s+new\s+group\s+called\s+['"'‘’“”]([^"'‘’“”]+)['"'‘’“”]\s+has\s+been\s+created\./i);
    if (!m) return false;
    return !expectedName || norm(m[1]) === norm(expectedName);
  }

  function waitForOutcome(prevURL, expectedName, timeout=CFG.WAIT_AFTER_SUBMIT_MS){
    return new Promise(resolve=>{
      let done=false; const finish=v=>{ if(!done){ done=true; resolve(v); } };
      const start=Date.now();
      (function tick(){
        if (location.href !== prevURL) return finish('navigated');
        if (duplicateErrorPresent(expectedName)) return finish('duplicate');
        if (creationSuccessPresent(expectedName)) return finish('created-inline');
        if (Date.now()-start >= timeout) return finish('timeout');
        setTimeout(tick,150);
      })();
      window.addEventListener('load', ()=>finish('navigated'), { once:true });
    });
  }

  async function waitForCreateFormReady(){
    for (let i=0;i<CFG.FORM_READY_RETRIES;i++){
      if (creationSuccessPresent()) return 'success-page';
      const nameInput = qs('input#groupname, input[name="groupname"], input[name="name"]');
      if (nameInput){
        const form = nameInput.closest('form') ||
          qs('form[action*="creategroup"]') || qs('form');
        if (form){
          const selectEl  = qs('#tradingsettings, select[name="tradingsettings"], select[name="trading"], select[id*="trading"]', form);
          const submitBtn = qs('#submit-button, button[type="submit"], input[type="submit"], input[name="submit"]', form);
          if (selectEl && submitBtn) return { nameInput, selectEl, submitBtn, form };
        }
      }
      await sleep(CFG.FORM_READY_INTERVAL);
    }
    return null;
  }

  // ---------------- UI ----------------
  if (typeof GM_addStyle === 'function') {
    GM_addStyle([
      '.csgm-toggle{position:fixed;left:10px;top:10px;z-index:999999;padding:6px 10px;background:#111;color:#fff;border-radius:6px;cursor:pointer;font:12px/1 ui-monospace,monospace;opacity:.9}',
      '.csgm-toggle:hover{opacity:1}',
      '.csg-panel{position:fixed;right:16px;bottom:16px;width:340px;z-index:999998;background:#fff;border:1px solid #ccc;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.18);font:13px/1.35 system-ui,sans-serif}',
      '.csg-header{padding:10px 12px;font-weight:700;background:#f7f7f7;border-bottom:1px solid #e5e5e5;display:flex;justify-content:space-between;align-items:center;border-radius:10px 10px 0 0}',
      '.csg-body{padding:10px 12px}',
      '.csg-row{margin-bottom:8px}',
      '.csg-row input[type="text"], .csg-row select{width:100%;padding:6px 8px;border:1px solid #ccc;border-radius:6px}',
      '.csg-row textarea{width:100%;height:140px;padding:8px;border:1px solid #ccc;border-radius:6px;resize:vertical;font-family:ui-monospace,monospace}',
      '.csg-actions{display:flex;gap:8px;margin-top:10px}',
      '.csg-actions button{flex:1;padding:8px 10px;border:1px solid #bbb;border-radius:8px;cursor:pointer;background:#fafafa}',
      '.csg-actions button:hover{background:#f0f0f0}',
      '.csg-log{background:#0b1220;color:#d4e0ff;font-family:ui-monospace,monospace;font-size:12px;padding:8px;border-radius:8px;max-height:160px;overflow:auto;white-space:pre-wrap}',
      '.csg-close{cursor:pointer;color:#666}',
      '.csg-hidden{display:none!important}'
    ].join(''));
  }

  function el(tag, cls, text){
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  const toggle = el('button','csgm-toggle','CSGM');
  toggle.title = 'Toggle CS Group Maker';
  document.documentElement.appendChild(toggle);

  const panel = el('div','csg-panel csg-hidden');
  const header = el('div','csg-header');
  const title = el('div','', 'CS Group Maker ');
  const ver = el('span',''); ver.style.fontSize='11px'; ver.style.color='#777'; ver.textContent='v'+CFG.VERSION;
  title.appendChild(ver);
  const closeBtn = el('div','csg-close','✕'); closeBtn.title = 'Hide';
  header.appendChild(title); header.appendChild(closeBtn);
  panel.appendChild(header);

  const body = el('div','csg-body');
  const uidInput = el('input');
    uidInput.type='text';
    uidInput.placeholder='User ID (e.g., 299578)';
    uidInput.id='csg-userid';
    // save id
    uidInput.value = getUserId() || CFG.DEFAULT_USER_ID;

    uidInput.addEventListener('change', () => setUserId(uidInput.value.trim()));
    uidInput.addEventListener('input', () => setUserId(uidInput.value.trim()));

  const namesTA = el('textarea'); namesTA.placeholder='Group Name 1\nGroup Name 2'; namesTA.id='csg-names';
  const tradeSel = el('select'); tradeSel.id='csg-trade';
  [['enable','Everybody (default)'],
   ['wishlist-any','Wishlist: pets or items'],
   ['wishlist-pets','Wishlist: pets'],
   ['wishlist-items','Wishlist: items'],
   ['friends','Friends only'],
   ['disable','Nobody']].forEach(([v,t])=>{
     const o = el('option'); o.value=v; o.textContent=t; tradeSel.appendChild(o);
  });

  function row(label, node){ const r = el('div','csg-row'); if (label) r.appendChild(el('label','',label)); r.appendChild(node); return r; }
  body.appendChild(row('User ID', uidInput));
  body.appendChild(row('Group names (one per line)', namesTA));
  body.appendChild(row('Trading setting', tradeSel));

  const actions = el('div','csg-actions');
  const startBtn = el('button','', 'Start');
  const stopBtn = el('button','', 'Stop');
  actions.appendChild(startBtn); actions.appendChild(stopBtn);
  body.appendChild(actions);

  logEl = el('div','csg-log');
  body.appendChild(row('', logEl));

  panel.appendChild(body);
  document.documentElement.appendChild(panel);

  const show = ()=>panel.classList.remove('csg-hidden');
  const hide = ()=>panel.classList.add('csg-hidden');
  toggle.addEventListener('click', ()=> panel.classList.contains('csg-hidden') ? show() : hide());
  closeBtn.addEventListener('click', hide);
  setTimeout(()=>toggle.click(), 600); // show once

  // persist trade choice
  tradeSel.value = getTrade();
  tradeSel.addEventListener('change', ()=> setTrade(tradeSel.value));

  // ---------------- Controls & Flow ----------------
  async function resume(){
    if (!getRunning()) return;

    let current = getCurrent();
    let queue = getQueue();

    if (!current){
      current = (queue.shift() || '');
      setQueue(queue);
      setCurrent(current);
      if (!current){
        log('All groups created.');
        setRunning(false);
        setAttempts({});
        return;
      }
      log(`Working on: ${current}`);
    }

    if (!onCreatePage()){ location.href = createUrl(); return; }

    const ready = await waitForCreateFormReady();

    if (ready === 'success-page') {
      log('Continuing to next group');
      setCurrent('');
      await sleep(CFG.DELAY_BETWEEN_GROUPS_MS);
      location.href = createUrl();
      return;
    }

    if (!ready){
      const tries = incAttempt(current);
      if (tries <= 2){
        log('Form not ready');
        location.href = createUrl();
        return;
      }
      log('Skipping this name due to error.');
      clearAttempt(current);
      setCurrent('');
      setTimeout(resume, 50);
      return;
    }

    await createGroup(current, ready);
  }

  async function createGroup(groupName, { nameInput, selectEl, submitBtn, form }){
    incAttempt(groupName);

    // Fill names
    nameInput.value = '';
    for (const ch of groupName){ nameInput.value += ch; nameInput.dispatchEvent(new Event('input',{bubbles:true})); }
    nameInput.dispatchEvent(new Event('change',{bubbles:true}));

    // Set trading
    const pref = norm(getTrade() || 'disable');
    let opt = Array.from(selectEl.options || []).find(o => norm(o.value||'') === pref);
    if (!opt) {
      const map = { enable:'everybody', 'wishlist-any':'wishlist', 'wishlist-pets':'wishlist', 'wishlist-items':'wishlist', friends:'friends', disable:'nobody' };
      const hint = map[pref] || pref;
      opt = Array.from(selectEl.options || []).find(o => norm(o.textContent||'').includes(hint));
    }
    if (opt){ selectEl.value = opt.value; selectEl.dispatchEvent(new Event('change',{bubbles:true})); }

    const prevURL = location.href;
    try { (typeof form.requestSubmit === 'function') ? form.requestSubmit(submitBtn) : submitBtn.click(); }
    catch { submitBtn.click(); }

    const outcome = await waitForOutcome(prevURL, groupName, CFG.WAIT_AFTER_SUBMIT_MS);

    if (outcome === 'duplicate') {
      log(`Duplicate: "${groupName}" skipping`);
      clearAttempt(groupName);
      setCurrent('');
      await sleep(CFG.DELAY_BETWEEN_GROUPS_MS);
      setTimeout(resume, 50);
      return;
    }

    if (outcome === 'created-inline' || !onCreatePage()) {
      log(`✅ Created: ${groupName} (trade=${pref})`);
      clearAttempt(groupName);
      setCurrent('');
      await sleep(CFG.DELAY_BETWEEN_GROUPS_MS);
      location.href = createUrl(); // always start next
      return;
    }

    // Still on create page with no outcome then retry
    if (outcome === 'timeout' && onCreatePage()) {
      const tries = getAttempt(groupName);
      if (tries <= 1) {
        log('No navigation after submit retrying once.');
        location.href = createUrl();
      } else {
        log('Still on create page - skipping this name.');
        clearAttempt(groupName);
        setCurrent('');
        await sleep(CFG.DELAY_BETWEEN_GROUPS_MS);
        setTimeout(resume, 50);
      }
    }
  }

  async function start(){
    if (getRunning()) return;
    const userId = (uidInput.value || '').trim() || CFG.DEFAULT_USER_ID;
    const names = (namesTA.value || '').split('\n').map(s=>s.trim()).filter(Boolean);
    if (!names.length){ log('No group names.'); return; }
    setUserId(userId);
    setTrade(tradeSel.value || getTrade());
    setQueue(names);
    setCurrent('');
    setAttempts({});
    setRunning(true);
    log(`Starting… (${names.length} names), trading=${getTrade()}`);
    await resume();
  }
  function stop(){ setRunning(false); setCurrent(''); log('Stopping after current step...'); }

  startBtn.addEventListener('click', start);
  stopBtn.addEventListener('click', stop);

  (function bootstrap(){
    // Don’t run on login pages, you have to log in
    if (qs('input[type="password"]')) { setRunning(false); setCurrent(''); return; }
    setTimeout(resume, 150);
  })();

})();
