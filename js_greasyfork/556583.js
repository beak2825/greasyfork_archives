// ==UserScript==
// @name         Chat Cleaner
// @namespace    aravvn.tools
// @version      1.9.3
// @description  Cleans up Chaturbate chat: hides system rows and non-tip notices, keeps messages and tip notices, adds timestamps, and logs removed items in a movable "Show Deleted" panel opened from the chat input.
// @author       aravvn
// @license      CC-BY-NC-SA-4.0
// @match        https://chaturbate.com/*
// @match        https://*.chaturbate.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/556583/Chat%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/556583/Chat%20Cleaner.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const CONTAINER_SEL       = '.msg-list-fvm.message-list';
  const CHAT_MSG_SEL        = 'div[data-testid="chat-message"]';
  const ROOM_NOTICE_SEL     = '[data-testid="room-notice"]';
  const NON_TIP_NOTICE_SEL  = `${ROOM_NOTICE_SEL}:not(.isTip)`;
  const MAX_LOG_ITEMS       = 10000;
  const SNIPPET_LEN         = 3000;

  const INJECT_RETRY_MS     = 500;
  const INJECT_MAX_RETRIES  = 80;

  try {
    GM_addStyle(`
      ${CONTAINER_SEL} > :not(${CHAT_MSG_SEL}) { display: none !important; }
      ${CONTAINER_SEL} > ${CHAT_MSG_SEL}:has(${NON_TIP_NOTICE_SEL}) { display: none !important; }
      ${CONTAINER_SEL} > ${CHAT_MSG_SEL}[ts="r"] { display: none !important; }
      ${CONTAINER_SEL} > ${CHAT_MSG_SEL}:has([data-testid="new-line-text"]) { display: none !important; }

      ${CHAT_MSG_SEL} { display: block !important; }
      ${CHAT_MSG_SEL} ${ROOM_NOTICE_SEL}.isTip {
        display: inline-flex !important;
        width: auto !important;
        max-width: calc(100% - 8px) !important;
        left: 0 !important;
        margin-top: 1px !important;
        padding: 2px 4px !important;
        border-radius: 4px !important;
        overflow: visible !important;
        box-sizing: border-box !important;
      }
      ${CHAT_MSG_SEL} ${ROOM_NOTICE_SEL}.isTip [data-testid="room-notice-viewport"] {
        flex: initial !important;
        display: inline-block !important;
        max-width: 100% !important;
        overflow: visible !important;
      }
      ${CHAT_MSG_SEL} ${ROOM_NOTICE_SEL}.isTip > div[style*="align-self"] { display: none !important; }

      .cc-ts {
        display: inline-block !important;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace !important;
        font-size: 11px !important;
        line-height: 1 !important;
        opacity: .85 !important;
        background: rgba(0,0,0,.35) !important;
        color: #fff !important;
        border-radius: 3px !important;
        padding: 2px 4px !important;
        margin-right: 6px !important;
        vertical-align: middle !important;
        user-select: none !important;
        white-space: nowrap !important;
      }

      .cc-log-panel{
        position:fixed; z-index:2147483000;
        display:none; flex-direction:column;
        width:560px; max-width:95vw; height:58vh; max-height:680px;
        border-radius:14px; border:1px solid rgba(255,255,255,.08);
        background:linear-gradient(180deg,rgba(18,18,18,.92),rgba(12,12,12,.92));
        backdrop-filter: blur(10px);
        box-shadow:0 10px 40px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.05);
        overflow:hidden; resize:both;
      }
      .cc-log-panel.open{display:flex;}
      .cc-log-head{
        flex:0 0 auto; display:flex; align-items:center; gap:10px;
        padding:10px 12px; border-bottom:1px solid rgba(255,255,255,.06);
        background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.02));
        cursor:grab; user-select:none;
      }
      .cc-log-head:active{cursor:grabbing;}
      .cc-title{font-weight:600; font-size:13px; letter-spacing:.2px;}
      .cc-count{opacity:.85; margin-left:6px;}
      .cc-spacer{flex:1 1 auto;}
      .cc-btn, .cc-close{
        font-size:12px; padding:6px 10px; border-radius:8px;
        border:1px solid rgba(255,255,255,.09); background:#1a1a1a; color:#eee; cursor:pointer;
      }
      .cc-btn:hover, .cc-close:hover{background:#232323;}
      .cc-close{background:#2a2a2a;}

      .cc-log-body{
        flex:1 1 auto; overflow:auto; padding:10px 12px; font-size:12px; line-height:1.35;
        scrollbar-width:thin; scrollbar-color:#4a4a4a transparent;
      }
      .cc-log-body::-webkit-scrollbar{width:10px;}
      .cc-log-body::-webkit-scrollbar-thumb{background:#4a4a4a; border-radius:10px;}
      .cc-log-body::-webkit-scrollbar-track{background:transparent;}

      .cc-item{border:1px solid rgba(255,255,255,.06); border-radius:10px; padding:8px 10px; margin:8px 0; background:rgba(255,255,255,.02);}
      .cc-meta{color:#bbb; font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono",monospace; font-size:11px; display:flex; align-items:center; gap:8px;}
      .cc-type{display:inline-block; padding:0 6px; border-radius:6px; border:1px solid rgba(255,255,255,.12); color:#ddd; font-size:10px; letter-spacing:.3px;}
      .cc-item[data-type*="system-row"] .cc-type{background:rgba(255,99,71,.15); border-color:rgba(255,99,71,.25);}
      .cc-item[data-type*="room-notice"] .cc-type{background:rgba(255,206,86,.15); border-color:rgba(255,206,86,.25);}
      .cc-item[data-type*="non-chat"] .cc-type{background:rgba(147,112,219,.15); border-color:rgba(147,112,219,.25);}
      .cc-item[data-type="filtered"] .cc-type{background:rgba(135,206,250,.15); border-color:rgba(135,206,250,.25);}

      .cc-snippet{
        margin-top:6px; color:#eee; word-break:break-word;
        white-space: pre-wrap;
      }

      .cc-inline-wrap{min-width:0; display:inline-flex; align-items:center;}

      .cc-inline-toggle{
        margin-left:8px !important;
        font-size:12px !important;
        font-weight:600 !important;
        padding:3px 8px !important;
        border-radius:5px !important;
        background:linear-gradient(180deg,#ffd700,#ffb700) !important;
        border:0px solid rgba(0,0,0,.25) !important;
        color:#000 !important;
        text-shadow:0 1px 0 rgba(255,255,255,.4) !important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.5),0 2px 4px rgba(0,0,0,.25) !important;
        cursor:pointer !important;
        transition:all .15s ease-in-out !important;
      }
      .cc-inline-toggle:hover{
        background:linear-gradient(180deg,#ffe44a,#ffcd00) !important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.6),0 3px 6px rgba(0,0,0,.3) !important;
      }
      .cc-inline-toggle:active{
        transform:translateY(0) !important;
        background:linear-gradient(180deg,#ffcd00,#e2b200) !important;
        box-shadow:inset 0 1px 1px rgba(0,0,0,.2) !important;
      }
    `);
  } catch {}

  const isEl = (n) => n && n.nodeType === 1;
  const isChatMessage = (el) => isEl(el) && el.matches(CHAT_MSG_SEL);
  const hasNonTipNotice = (el) => isEl(el) && !!el.querySelector(NON_TIP_NOTICE_SEL);

  function isSystemRow(el) {
    if (!isEl(el)) return false;
    if (el.getAttribute('ts') === 'r') return true;
    if (el.querySelector?.('[data-testid="new-line-text"]')) return true;
    const brandBlocks = el.querySelectorAll?.('.brandColor');
    if (brandBlocks && brandBlocks.length >= 1) {
      for (const b of brandBlocks) {
        const st = (b.getAttribute('style') || '').toLowerCase();
        if (st.includes('border-bottom') || st.includes('width: 100%')) return true;
      }
    }
    return false;
  }

  const pad2 = (n) => (n < 10 ? '0' + n : '' + n);
  function formatTime(tsMs) {
    const d = new Date(Number(tsMs) || Date.now());
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
  }
  function extractTs(el) {
    let ts = el && el.getAttribute ? el.getAttribute('data-ts') : null;
    if (!ts && isEl(el)) {
      const cand = el.querySelector?.('[data-ts]');
      ts = cand ? cand.getAttribute('data-ts') : null;
    }
    return Number(ts) || Date.now();
  }

  function addTimestampPill(el){
    try{
      if (!isEl(el)) return;

      let pill = el.querySelector('.cc-ts');
      if (!pill) {
        const ts = extractTs(el);
        pill = document.createElement('span');
        pill.className = 'cc-ts';
        pill.textContent = `[${formatTime(ts)}]`;
      }

      const notice = el.querySelector('[data-testid="room-notice"].isTip');
      if (notice) {
        const viewport = notice.querySelector('[data-testid="room-notice-viewport"]');
        if (viewport) {
          if (pill.parentNode !== notice || pill.nextSibling !== viewport) {
            notice.insertBefore(pill, viewport);
          }
        } else if (pill.parentNode !== notice) {
          notice.insertBefore(pill, notice.firstChild);
        }
        el.setAttribute('data-cc-ts-added','1');
        return;
      }

      const usernameSpan = el.querySelector('[data-testid="username"]');
      if (usernameSpan && usernameSpan.parentNode) {
        if (pill.parentNode !== usernameSpan.parentNode || pill.nextSibling !== usernameSpan) {
          usernameSpan.parentNode.insertBefore(pill, usernameSpan);
        }
      } else if (pill.parentNode !== el || pill !== el.firstChild) {
        el.firstChild ? el.insertBefore(pill, el.firstChild) : el.appendChild(pill);
      }

      el.setAttribute('data-cc-ts-added','1');
    } catch {}
  }

  function snippetFromNode(node) {
    try {
      let t = (node.textContent || '').trim();
      t = t.replace(/Notice:\s*/g, '\n');
      t = t.replace(/[^\S\r\n]+/g, ' ');
      t = t.replace(/\n{3,}/g, '\n\n');
      return t.length > SNIPPET_LEN ? t.slice(0, SNIPPET_LEN) + '…' : t;
    } catch { return ''; }
  }

  const logState = { items: [], panel: null, body: null, countSpan: null, inlineBtn: null };

  function ensurePanel(){
    if (logState.panel) return;
    const panel = document.createElement('div'); panel.className='cc-log-panel';

    const head = document.createElement('div'); head.className='cc-log-head';
    const title = document.createElement('div'); title.className='cc-title'; title.textContent='Deleted elements';
    const count = document.createElement('span'); count.className='cc-count'; count.textContent='(0)';
    const spacer = document.createElement('div'); spacer.className='cc-spacer';

    const btnExport = document.createElement('button'); btnExport.className='cc-btn'; btnExport.textContent='Export JSON';
    btnExport.addEventListener('click', ()=>exportJson());

    const btnClear = document.createElement('button'); btnClear.className='cc-btn'; btnClear.textContent='Clear';
    btnClear.addEventListener('click', ()=>clearLog());

    const btnClose = document.createElement('button'); btnClose.className='cc-close'; btnClose.textContent='Close';
    btnClose.addEventListener('click', ()=>closePanel());

    head.append(title, count, spacer, btnExport, btnClear, btnClose);

    const body = document.createElement('div'); body.className='cc-log-body';
    panel.append(head, body);
    document.documentElement.appendChild(panel);

    enableDrag(panel, head);
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closePanel(); }, {passive:true});

    logState.panel = panel; logState.body = body; logState.countSpan = count;
  }

  function updateInlineCount(){
    const n = logState.items.length;
    if (logState.inlineBtn) logState.inlineBtn.textContent = `Show Deleted (${n})`;
    if (logState.countSpan) logState.countSpan.textContent = `(${n})`;
  }

  function appendLogItem(item) {
    ensurePanel();
    logState.items.push(item);
    if (logState.items.length > MAX_LOG_ITEMS) {
      logState.items.splice(0, logState.items.length - MAX_LOG_ITEMS);
      renderAll(); updateInlineCount(); return;
    }
    try {
      const div = document.createElement('div');
      div.className = 'cc-item';
      div.setAttribute('data-type', item.type);
      div.innerHTML = `<div class="cc-meta">[${item.timeStr}] <span class="cc-type">${item.type}</span></div><div class="cc-snippet"></div>`;
      div.querySelector('.cc-snippet').textContent = item.snippet;
      logState.body?.appendChild(div);
    } catch {}
    updateInlineCount();
    try {
      if (logState.panel?.classList.contains('open')) {
        logState.body.scrollTop = logState.body.scrollHeight;
      }
    } catch {}
  }

  function renderAll() {
    ensurePanel();
    try {
      if (logState.body) {
        logState.body.textContent = '';
        for (const item of logState.items) {
          const div = document.createElement('div');
          div.className = 'cc-item';
          div.setAttribute('data-type', item.type);
          div.innerHTML = `<div class="cc-meta">[${item.timeStr}] <span class="cc-type">${item.type}</span></div><div class="cc-snippet"></div>`;
          div.querySelector('.cc-snippet').textContent = item.snippet;
          logState.body.appendChild(div);
        }
      }
      updateInlineCount();
    } catch {}
  }

  function clearLog() {
    logState.items = [];
    renderAll();
  }

  function exportJson() {
    try {
      const blob = new Blob([JSON.stringify(logState.items, null, 2)], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.download = `deleted-log-${new Date().toISOString().replace(/[:.]/g,'-')}.json`;
      a.href = url;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch {}
  }

  function openPanelAnchored() {
    ensurePanel();
    if (!logState.panel || !logState.inlineBtn) return;
    const p = logState.panel;

    p.style.visibility = 'hidden';
    p.classList.add('open');

    const rectBtn = logState.inlineBtn.getBoundingClientRect();
    const panelW = Math.min(parseInt(getComputedStyle(p).width,10)||560, window.innerWidth * 0.95);
    const panelH = Math.min(parseInt(getComputedStyle(p).height,10)|| (window.innerHeight*0.58), 600);

    let left = rectBtn.right - panelW;
    let top  = rectBtn.top - panelH - 8;

    if (left < 8) left = 8;
    if (left + panelW > window.innerWidth - 8) left = window.innerWidth - 8 - panelW;
    if (top < 8) { top = rectBtn.bottom + 8; }

    p.style.width = panelW + 'px';
    p.style.height = panelH + 'px';
    p.style.left = Math.round(left) + 'px';
    p.style.top  = Math.round(top)  + 'px';

    p.style.visibility = 'visible';

    requestAnimationFrame(() => {
      try { logState.body.scrollTop = logState.body.scrollHeight; } catch {}
    });

    window.addEventListener('resize', repositionIfOpen, { passive: true });
    window.addEventListener('scroll', repositionIfOpen, { passive: true });
  }

  function closePanel() {
    if (!logState.panel) return;
    logState.panel.classList.remove('open');
    window.removeEventListener('resize', repositionIfOpen);
    window.removeEventListener('scroll', repositionIfOpen);
  }

  function repositionIfOpen() {
    if (!logState.panel || !logState.panel.classList.contains('open')) return;
    if (!logState.inlineBtn) return;
    openPanelAnchored();
  }

  function findTargetInputDiv() {
    const all = document.querySelectorAll('.inputDiv');
    for (const div of all) {
      if (div.querySelector?.('[data-testid="send-button"]') && div.querySelector?.('[data-testid="chat-input"]')) {
        return div;
      }
    }
    return null;
  }

  function injectInlineButtonIntoInputDiv() {
    try {
      const inputDiv = findTargetInputDiv();
      if (!inputDiv) return false;

      const rightArea = inputDiv.querySelector('div[ts="a"]') || inputDiv.querySelector('div[style*="align-items: center"]');
      if (!rightArea) return false;

      if (rightArea.querySelector('.cc-inline-toggle')) return true;

      const sendBtn = rightArea.querySelector('[data-testid="send-button"]');
      if (!sendBtn) return false;

      const wrap = document.createElement('span');
      wrap.className = 'cc-inline-wrap';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'Button ButtonSize-small ButtonColor-gray cc-inline-toggle';
      btn.title = 'Show Deleted';
      btn.textContent = `Show Deleted (${logState.items.length})`;
      btn.addEventListener('click', () => {
        if (!logState.panel || !logState.panel.classList.contains('open')) {
          openPanelAnchored();
        } else {
          closePanel();
        }
      });

      wrap.appendChild(btn);
      const sendWrapper = sendBtn.parentElement || sendBtn;
      rightArea.insertBefore(wrap, sendWrapper);

      logState.inlineBtn = btn;
      return true;
    } catch {
      return false;
    }
  }

  function scheduleInlineInjection() {
    let tries = 0;
    const iv = setInterval(() => {
      if (injectInlineButtonIntoInputDiv()) { clearInterval(iv); return; }
      tries++;
      if (tries >= INJECT_MAX_RETRIES) clearInterval(iv);
    }, INJECT_RETRY_MS);
  }

  function logDeletion(node, type) {
    try {
      const timeMs = extractTs(node);
      appendLogItem({ timeMs, timeStr: formatTime(timeMs), type, snippet: snippetFromNode(node) });
    } catch {}
  }

  function shouldKeep(el) {
    if (!isChatMessage(el)) return false;
    if (isSystemRow(el)) return false;
    if (hasNonTipNotice(el)) return false;
    return true;
  }

  function deleteNodeWithLog(node, type = 'removed') {
    logDeletion(node, type);
    try { node.remove(); } catch {}
  }

  function purge(container) {
    if (!container) return;
    for (const n of Array.from(container.childNodes)) {
      if (!isEl(n))                 { deleteNodeWithLog(n, 'non-element'); continue; }
      if (!isChatMessage(n))        { deleteNodeWithLog(n, 'non-chat');     continue; }
      if (!shouldKeep(n))           {
        const reason = isSystemRow(n) ? 'system-row (New/divider)'
                    : hasNonTipNotice(n) ? 'room-notice (non-tip)'
                    : 'filtered';
        deleteNodeWithLog(n, reason); continue;
      }
      addTimestampPill(n);
    }
  }

  function handleAddedNode(node) {
    injectInlineButtonIntoInputDiv();

    if (!isEl(node))                 { deleteNodeWithLog(node, 'non-element'); return; }
    if (!isChatMessage(node))        { deleteNodeWithLog(node, 'non-chat');     return; }
    if (!shouldKeep(node))           {
      const reason = isSystemRow(node) ? 'system-row (New/divider)'
                  : hasNonTipNotice(node) ? 'room-notice (non-tip)'
                  : 'filtered';
      deleteNodeWithLog(node, reason); return;
    }
    addTimestampPill(node);
  }

  let container = null, containerObs = null, docObs = null;

  function observeContainer(el) {
    try { containerObs?.disconnect(); } catch {}
    purge(el);
    try {
      containerObs = new MutationObserver((ml) => {
        for (const m of ml) if (m.type === 'childList') for (const a of m.addedNodes) handleAddedNode(a);
      });
      containerObs.observe(el, { childList: true, subtree: false });
    } catch {}
  }

  function attach() {
    try {
      const el = document.querySelector(CONTAINER_SEL);
      if (!el) return false;
      container = el;
      observeContainer(container);
      for (const msg of container.querySelectorAll(CHAT_MSG_SEL)) {
        if (shouldKeep(msg)) addTimestampPill(msg);
        else {
          const reason = isSystemRow(msg) ? 'system-row (New/divider)'
                      : hasNonTipNotice(msg) ? 'room-notice (non-tip)'
                      : 'filtered';
          deleteNodeWithLog(msg, reason);
        }
      }
      return true;
    } catch { return false; }
  }

  function observeDoc() {
    if (docObs) return;
    try {
      docObs = new MutationObserver(() => {
        injectInlineButtonIntoInputDiv();
        if (!container || !document.contains(container)) {
          if (attach()) return;
        } else {
          purge(container);
        }
      });
      docObs.observe(document.documentElement || document.body, { childList: true, subtree: true });
    } catch {}
  }

  function enableDrag(panel, handle){
    let ox=0, oy=0, dragging=false;
    handle.addEventListener('mousedown', (e)=>{
      dragging=true; const r=panel.getBoundingClientRect();
      ox=e.clientX - r.left; oy=e.clientY - r.top; e.preventDefault();
    });
    window.addEventListener('mousemove', (e)=>{
      if(!dragging) return;
      let L = e.clientX - ox, T = e.clientY - oy;
      const W = panel.offsetWidth, H = panel.offsetHeight;
      const maxL = window.innerWidth - W - 4, maxT = window.innerHeight - H - 4;
      panel.style.left = Math.max(4, Math.min(L, maxL))+'px';
      panel.style.top  = Math.max(4, Math.min(T, maxT))+'px';
    }, {passive:true});
    window.addEventListener('mouseup', ()=>{ dragging=false; }, {passive:true});
  }

  function init() {
    ensurePanel();
    attach();
    injectInlineButtonIntoInputDiv();
    scheduleInlineInjection();
    observeDoc();

    window.addEventListener('load', () => {
      try {
        if (container) purge(container);
        injectInlineButtonIntoInputDiv();
      } catch {}
    });
  }

  init();
})();
