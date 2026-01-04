// ==UserScript==
// @name         Reddit Delete Chat Messages
// @namespace    http://tampermonkey.net/
// @version      3.0.2
// @description  Add UI to auto-mark and delete Reddit chat messages (with username awareness)
// @author       mrrobot
// @match        https://chat.reddit.com/*
// @match        https://www.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555025/Reddit%20Delete%20Chat%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/555025/Reddit%20Delete%20Chat%20Messages.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ============================== Config ==============================
  const CLICK_DELAY_MS = 800;              // pacing between actions
  const MENU_WAIT_MS = 350;
  const DIALOG_OPEN_WAIT_MS = 250;         // pause after clicking Delete before dialog search/confirm
  const HOVER_REVEAL_RETRIES = 10;
  const HOVER_REVEAL_INTERVAL_MS = 150;
  const PRE_MENU_EXTRA_WAIT_MS = 400;
  const BATCH_SIZE_DEFAULT = 10;

  // Auto-confirm dialog behavior
  const AUTO_CONFIRM_ENABLED = true;
  const AUTO_CONFIRM_COOLDOWN_MS = 900;    // min gap between auto-confirms
  const OBSERVER_TICK_MS = 80;             // throttle observer reaction
  const DIALOG_DISAPPEAR_TIMEOUT_MS = 8000;
  const NODE_REMOVAL_TIMEOUT_MS = 8000;

  // Continuous sweep tuning
  const SWEEP_BATCH_SIZE = 10;             // max deletes per sweep cycle
  const SWEEP_IDLE_PAUSE_MS = 500;         // pause between cycles
  const SCROLL_STEP_PX = 1200;             // upward scroll step to load older messages
  const SCROLL_SETTLE_MS = 650;            // wait after scrolling for virtualization to render
  const TOP_STALL_MAX = 4;                 // consecutive "at top & nothing new" cycles before stopping

  // LocalStorage key for saved username (avoid collisions across versions)
  const LS_KEY_USERNAME = 'rc_username_v30_public';

  // ============================ UI Panel =============================
  const panel = document.createElement('div');
  Object.assign(panel.style, {
    position:'fixed', right:'16px', bottom:'16px', zIndex:2147483647,
    background:'rgba(17,17,17,.96)', color:'#fff', padding:'12px', borderRadius:'12px',
    fontFamily:'ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial',
    fontSize:'12px', boxShadow:'0 8px 24px rgba(0,0,0,.35)', maxWidth:'600px'
  });
  const savedName = localStorage.getItem(LS_KEY_USERNAME) || '';
  panel.innerHTML = `
    <div style="font-weight:700;margin-bottom:6px">Reddit Chat — Username Aware v3.0.2</div>

    <div style="display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;margin-bottom:8px">
      <input id="rc-username" type="text" placeholder="Your Reddit username (no u/)"
             value="${savedName.replace(/"/g, '&quot;')}"
             style="padding:6px 8px;border-radius:8px;border:1px solid #444;background:#111;color:#fff;outline:none">
      <button id="rc-save" style="padding:6px 8px;border:none;border-radius:8px;cursor:pointer">Save Username</button>
    </div>

    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px">
      <button id="rc-pick">Pick Container</button>
      <button id="rc-parent">Select Parent</button>
      <button id="rc-auto-you">Auto-Mark "You said"</button>
      <button id="rc-auto-user">Auto-Mark by Username</button>
      <button id="rc-mark">Toggle Mark Mode</button>
      <button id="rc-clear">Clear Marks</button>
      <button id="rc-del-one" style="background:#ef4444;color:#fff">Delete One Marked</button>
      <button id="rc-del-batch" style="background:#ef4444;color:#fff">Delete ${BATCH_SIZE_DEFAULT} Marked</button>
      <button id="rc-menulog">Toggle Menu Log</button>
      <button id="rc-dump">Debug Dump</button>
    </div>

    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px">
      <button id="rc-sweep-start" style="background:#10b981;color:#001">Start Continuous Sweep</button>
      <button id="rc-sweep-stop"  style="background:#f59e0b;color:#001">Stop Sweep</button>
      <span id="rc-sweep-status" style="align-self:center;opacity:.9"></span>
    </div>

    <div style="opacity:.9;margin-bottom:6px">
      Tip: Save your username → <b>Pick Container</b> → Start Continuous Sweep (or manual: Auto-Mark + Delete).
      Auto-confirm is ${AUTO_CONFIRM_ENABLED ? '<b>ON</b>' : '<b>OFF</b>'}.
    </div>
    <div id="rc-log" style="max-height:360px;overflow:auto;white-space:pre-wrap;line-height:1.25"></div>
  `;
  for (const b of panel.querySelectorAll('button')) {
    Object.assign(b.style, { padding:'6px 8px', border:'none', borderRadius:'8px', cursor:'pointer' });
  }
  document.documentElement.appendChild(panel);

  const logEl = panel.querySelector('#rc-log');
  logEl.style.maxHeight = '50px';
  logEl.style.overflowY = 'auto';
  const statusEl = panel.querySelector('#rc-sweep-status');
  const inpUser = panel.querySelector('#rc-username');
  const btnSave = panel.querySelector('#rc-save');
  const btnPick = panel.querySelector('#rc-pick');
  const btnParent = panel.querySelector('#rc-parent');
  const btnAutoYou = panel.querySelector('#rc-auto-you');
  const btnAutoUser = panel.querySelector('#rc-auto-user');
  const btnMark = panel.querySelector('#rc-mark');
  const btnClear = panel.querySelector('#rc-clear');
  const btnDelOne = panel.querySelector('#rc-del-one');
  const btnDelBatch = panel.querySelector('#rc-del-batch');
  const btnMenu = panel.querySelector('#rc-menulog');
  const btnDump = panel.querySelector('#rc-dump');
  const btnSweepStart = panel.querySelector('#rc-sweep-start');
  const btnSweepStop = panel.querySelector('#rc-sweep-stop');

  const log = (m)=>{ const t=new Date().toLocaleTimeString(); logEl.textContent = `[${t}] ${m}\n` + (logEl.textContent||''); };

  // ============================ Utilities ============================
  function* deepNodes(root){
    yield root;
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null);
    while (tw.nextNode()){
      const el = tw.currentNode;
      yield el;
      if (el.shadowRoot){ yield el.shadowRoot; yield* deepNodes(el.shadowRoot); }
      if (el.tagName === 'IFRAME'){
        try{ if (el.contentDocument){ yield el.contentDocument; yield* deepNodes(el.contentDocument); } }catch(_){}
      }
    }
  }
  function deepQueryAll(sel, scope=document){
    const out = [];
    for (const n of deepNodes(scope)) if (n.querySelectorAll) { try { out.push(...n.querySelectorAll(sel)); } catch(_) {} }
    return Array.from(new Set(out));
  }
  function localQuery(scope, sel){
    const out = [];
    (function walk(n){
      if (!n) return;
      if (n.querySelectorAll) { try { out.push(...n.querySelectorAll(sel)); } catch(_) {} }
      if (n.shadowRoot) walk(n.shadowRoot);
      for (const c of n.children || []) walk(c);
    })(scope);
    return out[0] || null;
  }
  function outline(el, css='2px solid #f59e0b'){ if (el){ el.style.outline=css; el.style.outlineOffset='0'; } }
  const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
  function isVisible(el){ if(!el) return false; const cs=getComputedStyle(el); const r=el.getBoundingClientRect(); return cs.display!=='none' && cs.visibility!=='hidden' && cs.opacity!=='0' && r.width>0 && r.height>0; }
  function pressEsc(){ document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',code:'Escape',keyCode:27,which:27,bubbles:true})); }

  // ====================== Container & Node Access =====================
  let selectedContainer=null;
  function countEvents(scope){ return deepQueryAll('rs-timeline-event', scope).length; }
  function getEvents(scope){ return deepQueryAll('rs-timeline-event', scope).filter(isVisible); }
  function bubbleToTimelineContainer(node){
    let cur=node, best=null, bestCount=0;
    for(let i=0;i<12 && cur;i++){
      const cnt = countEvents(cur);
      if (cnt>bestCount){ best=cur; bestCount=cnt; }
      cur = cur.parentNode instanceof ShadowRoot ? cur.parentNode.host : cur.parentElement;
    }
    return best||node;
  }
  function pickElementOnce(){
    return new Promise(res=>{
      panel.style.pointerEvents='none';
      const onKey=e=>{ if(e.key==='Escape') cleanup(null); };
      const onClick=e=>{ e.preventDefault(); e.stopPropagation(); const t=e.composedPath?e.composedPath()[0]:e.target; cleanup(t); };
      function cleanup(v){
        document.removeEventListener('click', onClick, true);
        document.removeEventListener('keydown', onKey, true);
        panel.style.pointerEvents=''; res(v);
      }
      document.addEventListener('click', onClick, true);
      document.addEventListener('keydown', onKey, true);
      log('Pick mode: click the message list (Esc cancels)…');
    });
  }

  // ======================== Scrolling Helpers ========================
  function getScrollable(){
    // Prefer inner virtual scroll container if present
    const vs = selectedContainer && localQuery(selectedContainer, 'rs-virtual-scroll-dynamic, rs-virtual-scroll, [class*="virtual-scroll"], [data-testid*="virtual"]');
    if (vs) return vs;
    // Otherwise, nearest ancestor that scrolls
    let cur = selectedContainer;
    for (let i=0; i<10 && cur; i++){
      const el = cur instanceof ShadowRoot ? cur.host : cur;
      const cs = getComputedStyle(el);
      if ((cs.overflowY==='auto' || cs.overflowY==='scroll') && el.scrollHeight > el.clientHeight) return el;
      cur = el.parentNode instanceof ShadowRoot ? el.parentNode.host : el.parentElement;
    }
    // Fallback to main/document
    const main = document.querySelector('main');
    if (main && main.scrollHeight > main.clientHeight) return main;
    return document.scrollingElement || document.documentElement || document.body;
  }
  function atTop(scrollEl){ return !scrollEl ? true : (scrollEl.scrollTop <= 2); }
  async function nudgeUp(scrollEl){
    if (!scrollEl) return;
    if (scrollEl.scrollTop > 0){
      scrollEl.scrollTop = Math.max(0, scrollEl.scrollTop - SCROLL_STEP_PX);
    } else {
      scrollEl.scrollTop = 1; await sleep(30); scrollEl.scrollTop = 0;
    }
    await sleep(SCROLL_SETTLE_MS);
  }

  // ==================== Marked ID Set (virtualization) ====================
  const markedIdSet = new Set();
  function getEventId(evt){
    const id = evt.getAttribute && evt.getAttribute('data-id');
    if (id) return id;
    const child = localQuery(evt, '[data-id]');
    return child ? child.getAttribute('data-id') : null;
  }
  function ensureMarksFromIdSet(){
    if (!selectedContainer || !markedIdSet.size) return;
    for (const evt of getEvents(selectedContainer)){
      const id = getEventId(evt);
      if (id && markedIdSet.has(id)){
        if (evt.dataset.rcMarked!=='true'){ setMarked(evt,true); }
      }
    }
  }

  // ====================== Marking & Ownership ======================
  let markMode=false;
  function setMarked(evt,on){
    if (on){ evt.dataset.rcMarked='true'; evt.style.boxShadow='0 0 0 2px #22c55e inset'; evt.style.outline='2px solid #22c55e'; }
    else { delete evt.dataset.rcMarked; evt.style.boxShadow=''; evt.style.outline=''; }
  }
  function toggleMark(evt){
    const on = !(evt.dataset.rcMarked==='true');
    setMarked(evt, on);
    const id = getEventId(evt);
    if (id){
      if (on) markedIdSet.add(id); else markedIdSet.delete(id);
    }
  }
  function attachMarkHandlers(container){
    for (const evt of getEvents(container)){
      if (evt._rcBound) continue;
      evt._rcBound = true;
      evt.addEventListener('click',(e)=>{
        if (!markMode) return;
        e.preventDefault(); e.stopPropagation();
        toggleMark(evt);
      }, true);
    }
  }
  function isAriaYouSaid(evt){
    const m = localQuery(evt, '.room-message[aria-label]');
    const aria = m ? (m.getAttribute('aria-label')||'') : '';
    return /^you said\b/i.test(aria.trim());
  }
  function isByUsername(evt, username){
    if (!username) return false;
    const uname = String(username).trim().toLowerCase();
    const m = localQuery(evt, '.room-message[aria-label]');
    const aria = m ? (m.getAttribute('aria-label')||'') : '';
    if (new RegExp(`^${uname}\\s+said\\b`, 'i').test(aria.trim())) return true;
    const n = localQuery(evt, '.user-name, [class*="user-name"], [data-testid="message-author"]');
    if (n){
      const txt = (n.innerText || n.textContent || '').trim().toLowerCase();
      if (txt === uname) return true;
    }
    return false;
  }
  function autoMarkYouSaid(){
    if (!selectedContainer){ log('Pick a container first.'); return 0; }
    let count=0;
    for (const evt of getEvents(selectedContainer)){
      if (isAriaYouSaid(evt)){
        setMarked(evt,true);
        const id = getEventId(evt); if (id) markedIdSet.add(id);
        count++;
      }
    }
    log(`Auto-Mark "You said": marked ${count}.`);
    return count;
  }
  function autoMarkByUsername(username){
    if (!selectedContainer){ log('Pick a container first.'); return 0; }
    if (!username){ log('No username set. Enter it above and click Save Username.'); return 0; }
    let count=0;
    for (const evt of getEvents(selectedContainer)){
      if (isByUsername(evt, username)){
        setMarked(evt,true);
        const id = getEventId(evt); if (id) markedIdSet.add(id);
        count++;
      }
    }
    log(`Auto-Mark by Username (“${username}”): marked ${count}.`);
    return count;
  }

  // =================== Action Bar / Menu Access ===================
  async function prepareForActions(evt){
    evt.scrollIntoView({block:'center'});
    evt.focus?.();
    evt.dispatchEvent(new MouseEvent('mouseenter',{bubbles:true}));
    await sleep(120);
    const inner = localQuery(evt,'[data-testid], rs-message, rs-bubble, div, span') || evt;
    inner.dispatchEvent(new MouseEvent('mouseenter',{bubbles:true}));
    await sleep(PRE_MENU_EXTRA_WAIT_MS);
  }
  async function openActions(evt){
    for (let i=0;i<HOVER_REVEAL_RETRIES;i++){
      await prepareForActions(evt);

      // direct trash
      let trash = localQuery(evt, [
        '[aria-label="Delete"]','[title="Delete"]','[data-testid="delete-message"]',
        'button:has(svg[aria-label="delete"])','rs-icon-button[icon="trash"]','rs-icon-button[icon="delete"]','rs-button[aria-label="Delete"]'
      ].join(','));
      if (trash && isVisible(trash)) return { directDelete: trash };

      // 3-dots
      let more = localQuery(evt, [
        '[aria-label="More options"]','[aria-label="More"]','[title="More"]',
        'button[aria-haspopup="menu"]','[role="button"][aria-haspopup="menu"]',
        'button:has(svg[aria-label="more"])','rs-icon-button[icon="more"]'
      ].join(','));
      if (more && isVisible(more)){
        more.click();
        await sleep(MENU_WAIT_MS);
        return { openedMenu: true };
      }

      // context menu fallback
      evt.dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,cancelable:true,button:2}));
      await sleep(MENU_WAIT_MS);
      const anyMenu = deepQueryAll('[role="menuitem"], rs-menu-item, rs-dropdown-item').length;
      if (anyMenu) return { openedMenu: true };

      await sleep(HOVER_REVEAL_INTERVAL_MS);
    }
    return {};
  }

  // ========================= Menu Helpers =========================
  let MENU_LOG = true;  // single declaration (no duplicates)
  function listMenuItems(){
    if(!MENU_LOG) return [];
    const items = deepQueryAll('[role="menuitem"], rs-menu-item, rs-dropdown-item');
    const lines = items.slice(0,40).map((el,i)=>`${i+1}. ${(el.getAttribute('aria-label')||'').trim()} "${(el.innerText||el.textContent||'').trim()}"`).join('\n');
    if(lines) log('Menu items:\n'+lines);
    return items;
  }
  function findDeleteMenuItem(){
    const items = deepQueryAll('[role="menuitem"], rs-menu-item, rs-dropdown-item');
    for(const el of items){
      const aria=(el.getAttribute('aria-label')||'').toLowerCase();
      const txt=(el.innerText||el.textContent||'').toLowerCase();
      if(aria.includes('delete') || txt.includes('delete')) return el;
      if(aria.includes('remove') || txt.includes('remove message') || txt.includes('remove')) return el;
    }
    return null;
  }

  // =================== Dialog Auto-Confirm (safe) ===================
  let confirmLock = false;
  let lastConfirmTs = 0;
  let activeDialog = null;
  let activeDialogVisible = false;
  let observerPending = false;

  function findVisibleDeleteDialog(){
    const rsDlg = deepQueryAll('rs-delete-message-modal rpl-dialog').find(isVisible);
    if (rsDlg) return rsDlg;
    const candidates = deepQueryAll('rpl-dialog, [role="dialog"], div').filter(isVisible);
    return candidates.find(el => {
      const txt = (el.innerText || '').toLowerCase();
      return txt.includes('delete this message?') || (txt.includes('delete') && txt.includes("you can't undo"));
    }) || null;
  }
  function clickYesDelete(dlg){
    const btns = deepQueryAll('button, [role="button"]', dlg);
    const yes = btns.find(b => /yes,\s*delete/i.test((b.innerText || b.textContent || '').trim()));
    if (yes){ yes.click(); return 'yes'; }
    const fallback = btns.find(b => /delete|confirm|yes/i.test((b.innerText||b.textContent||'').trim()));
    if (fallback){ fallback.click(); return 'fallback'; }
    return null;
  }
  async function waitDialogGone(timeoutMs=DIALOG_DISAPPEAR_TIMEOUT_MS){
    const start=performance.now();
    while(performance.now()-start<timeoutMs){
      const d = findVisibleDeleteDialog();
      if (!d){
        activeDialog = null;
        activeDialogVisible = false;
        return true;
      }
      await sleep(80);
    }
    return false;
  }
  async function tryAutoConfirm(reason='observer'){
    if (!AUTO_CONFIRM_ENABLED) return;
    if (confirmLock) return;
    const now = performance.now();
    if (now - lastConfirmTs < AUTO_CONFIRM_COOLDOWN_MS) return;

    const dlg = findVisibleDeleteDialog();
    if (!dlg){ activeDialog = null; activeDialogVisible = false; return; }
    if (dlg === activeDialog && activeDialogVisible) return;

    activeDialog = dlg;
    activeDialogVisible = true;

    confirmLock = true;
    try {
      const which = clickYesDelete(dlg);
      if (which){
        lastConfirmTs = performance.now();
        log(`Auto-confirm (${reason}): clicked ${which === 'yes' ? '"Yes, Delete"' : 'fallback confirm'}.`);
        await waitDialogGone();
      } else {
        log('Auto-confirm: confirm button not found.');
      }
    } catch (e){
      log('Auto-confirm error: ' + (e && e.message ? e.message : e));
    } finally {
      confirmLock = false;
    }
  }
  const modalObserver = new MutationObserver(() => {
    if (observerPending) return;
    observerPending = true;
    setTimeout(() => {
      observerPending = false;
      tryAutoConfirm('observer');
    }, OBSERVER_TICK_MS);
  });
  modalObserver.observe(document.documentElement, {subtree:true, childList:true});

  // ========================== Delete Core ==========================
  async function waitNodeRemoved(node, timeoutMs=NODE_REMOVAL_TIMEOUT_MS){
    const start = performance.now();
    while (performance.now() - start < timeoutMs){
      if (!node.isConnected) return true;
      await sleep(80);
    }
    return false;
  }
  async function deleteEvent(evt){
    const id = getEventId(evt);
    const open = await openActions(evt);

    if(open.directDelete){
      log('Clicking direct Delete…');
      open.directDelete.click();
      await sleep(DIALOG_OPEN_WAIT_MS);
      await tryAutoConfirm('direct');
      await waitDialogGone();
      await waitNodeRemoved(evt);
      if (id) markedIdSet.delete(id);
      pressEsc();
      await sleep(CLICK_DELAY_MS);
      return true;
    }

    listMenuItems();
    const del = findDeleteMenuItem();
    if(!del){ log('No Delete/Remove in menu (might not be your message, or thread is persistent).'); return false; }
    del.click();
    await sleep(DIALOG_OPEN_WAIT_MS);
    await tryAutoConfirm('menu');
    await waitDialogGone();
    await waitNodeRemoved(evt);
    if (id) markedIdSet.delete(id);
    pressEsc();
    await sleep(CLICK_DELAY_MS);
    return true;
  }

  // ============================ Buttons ============================
  btnSave.addEventListener('click', ()=>{
    const name = (inpUser.value || '').trim();
    localStorage.setItem(LS_KEY_USERNAME, name);
    log(name ? `Saved username: ${name}` : 'Username cleared.');
  });

  btnPick.addEventListener('click', async ()=>{
    const picked = await pickElementOnce();
    if(!picked){ log('Pick cancelled.'); return; }
    selectedContainer = bubbleToTimelineContainer(picked) || picked;
    outline(selectedContainer);
    attachMarkHandlers(selectedContainer);
    ensureMarksFromIdSet();
    log(`Picked container. ~${countEvents(selectedContainer)} timeline events.`);
  });

  btnParent.addEventListener('click', ()=>{
    if(!selectedContainer){ log('Pick a container first.'); return; }
    const parent = selectedContainer.parentNode instanceof ShadowRoot ? selectedContainer.parentNode.host : selectedContainer.parentElement;
    if(!parent){ log('No parent to select.'); return; }
    selectedContainer = bubbleToTimelineContainer(parent) || parent;
    outline(selectedContainer);
    attachMarkHandlers(selectedContainer);
    ensureMarksFromIdSet();
    log(`Selected parent. ~${countEvents(selectedContainer)} timeline events.`);
  });

  btnAutoYou.addEventListener('click', ()=> { autoMarkYouSaid(); ensureMarksFromIdSet(); });
  btnAutoUser.addEventListener('click', ()=>{
    const name = (inpUser.value || '').trim();
    autoMarkByUsername(name);
    ensureMarksFromIdSet();
  });

  btnMark.addEventListener('click', ()=>{
    if(!selectedContainer){ log('Pick a container first.'); return; }
    markMode = !markMode;
    btnMark.textContent = markMode ? 'Mark Mode (ON)' : 'Toggle Mark Mode';
    if(markMode){ attachMarkHandlers(selectedContainer); log('Mark Mode ON: click bubbles to toggle.'); }
    else { log('Mark Mode OFF.'); }
  });

  btnClear.addEventListener('click', ()=>{
    if(!selectedContainer){ log('Pick a container first.'); return; }
    for(const evt of getEvents(selectedContainer)) setMarked(evt,false);
    markedIdSet.clear();
    log('Cleared marks.');
  });

  btnDelOne.addEventListener('click', async ()=>{
    if(!selectedContainer){ log('Pick a container first.'); return; }
    ensureMarksFromIdSet();
    const targets = getEvents(selectedContainer).filter(e=>e.dataset.rcMarked==='true');
    if(!targets.length){ log('No marked messages. Use Auto-Mark or Mark Mode.'); return; }
    const t = targets[0];
    const ok = await deleteEvent(t);
    if(ok) { setMarked(t,false); log('Deleted one marked.'); } else { log('Delete failed for that bubble.'); }
  });

  btnDelBatch.addEventListener('click', async ()=>{
    if(!selectedContainer){ log('Pick a container first.'); return; }
    let success=0, fail=0;
    for (let i=0; i<BATCH_SIZE_DEFAULT; i++){
      ensureMarksFromIdSet();
      const targets = getEvents(selectedContainer).filter(e=>e.dataset.rcMarked==='true');
      if (!targets.length) break;
      const t = targets[0];
      try{
        const r = await deleteEvent(t);
        if (r){ setMarked(t,false); success++; } else { fail++; }
      }catch(e){
        log('Delete error: ' + (e && e.message ? e.message : e));
        fail++;
      }
    }
    log(`Batch done. Success: ${success}, Fail: ${fail}.`);
  });

  btnMenu.addEventListener('click', ()=>{
    MENU_LOG = !MENU_LOG;
    log('Menu Log ' + (MENU_LOG ? 'ENABLED' : 'DISABLED'));
  });

  btnDump.addEventListener('click', ()=>{
    ensureMarksFromIdSet();
    const events = selectedContainer ? getEvents(selectedContainer).slice(0,8) : [];
    const info = {
      url: location.href,
      hasSelectedContainer: !!selectedContainer,
      approxEventCount: selectedContainer ? countEvents(selectedContainer) : 0,
      sampleIds: events.map(e => getEventId(e)),
      sampleAria: events.map(e => {
        const m = localQuery(e, '.room-message[aria-label]');
        return m ? m.getAttribute('aria-label') : null;
      }),
      sampleAuthors: events.map(e => {
        const n = localQuery(e, '.user-name, [class*="user-name"], [data-testid="message-author"]');
        return n ? (n.innerText || n.textContent || '').trim() : null;
      })
    };
    log('DEBUG:\n' + JSON.stringify(info,null,2));
  });

  // ======================= Continuous Sweep =======================
  let sweepRunning = false;
  function setStatus(txt){ statusEl.textContent = txt || ''; }

  async function markVisiblePass(){
    const uname = (inpUser.value || '').trim();
    let n=0;
    if (uname){ n += autoMarkByUsername(uname); }
    n += autoMarkYouSaid(); // also try aria variant
    ensureMarksFromIdSet();
    return n;
  }
  async function deleteSomeMarked(maxCount=SWEEP_BATCH_SIZE){
    let success=0, fail=0;
    for (let i=0; i<maxCount; i++){
      ensureMarksFromIdSet();
      const targets = getEvents(selectedContainer).filter(e=>e.dataset.rcMarked==='true');
      if (!targets.length) break;
      const t = targets[0];
      try{
        const r = await deleteEvent(t);
        if (r){ setMarked(t,false); success++; } else { fail++; }
      }catch(e){
        log('Delete error: ' + (e && e.message ? e.message : e));
        fail++;
      }
    }
    return {success, fail};
  }
  async function sweepLoop(){
    if (!selectedContainer){ log('Pick a container first.'); setStatus('Pick container first'); return; }
    if (sweepRunning) return;
    sweepRunning = true;
    setStatus('Sweeping…');
    log('Continuous Sweep started.');

    let topStalls = 0;
    let totalDeleted = 0;

    while (sweepRunning){
      attachMarkHandlers(selectedContainer);
      ensureMarksFromIdSet();

      const newlyMarked = await markVisiblePass();
      if (newlyMarked > 0){
        const {success, fail} = await deleteSomeMarked(SWEEP_BATCH_SIZE);
        totalDeleted += success;
        log(`Sweep cycle: deleted ${success}, failed ${fail}, total so far ${totalDeleted}.`);
        topStalls = 0;
        await sleep(SWEEP_IDLE_PAUSE_MS);
        continue;
      }

      // No marked visible — scroll up to load more
      const scrollEl = getScrollable();
      if (!scrollEl){ log('No scrollable element found; stopping sweep.'); break; }
      const wasAtTop = atTop(scrollEl);
      await nudgeUp(scrollEl);
      attachMarkHandlers(selectedContainer);
      ensureMarksFromIdSet();

      const afterScrollMarked = await markVisiblePass();
      if (afterScrollMarked > 0){ topStalls = 0; continue; }

      if (wasAtTop && atTop(scrollEl)){
        topStalls++;
        log(`No more messages above (top stall ${topStalls}/${TOP_STALL_MAX}).`);
        if (topStalls >= TOP_STALL_MAX){
          log('Reached top with no more deletable messages. Stopping sweep.');
          break;
        }
      }
      await sleep(SWEEP_IDLE_PAUSE_MS);
    }

    sweepRunning = false;
    setStatus('');
    log('Continuous Sweep stopped.');
  }

  btnSweepStart.addEventListener('click', ()=>{ if (!sweepRunning) sweepLoop(); });
  btnSweepStop.addEventListener('click', ()=>{ sweepRunning = false; setStatus('Stopping…'); });

  // =================== SPA Navigation & Reapply ===================
  let lastUrl = location.href;
  new MutationObserver(()=>{
    if(location.href!==lastUrl){
      lastUrl=location.href; selectedContainer=null; log('URL changed — pick container again.');
      sweepRunning = false; setStatus('');
    }
  }).observe(document,{subtree:true, childList:true});

  const reapplyObserver = new MutationObserver(()=>{
    if (!selectedContainer) return;
    ensureMarksFromIdSet();
  });
  reapplyObserver.observe(document.body, {subtree:true, childList:true});

  log('Loaded v3.0.2. Continuous Sweep available — Start/Stop to auto-scroll up and remove your messages.');
})();