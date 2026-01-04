// ==UserScript==
// @name         ChatGPT Bulk Deleter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Delete all chats with visible log that shows while running and hides when done. Auto remounts UI on changes.
// @author       Kes
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        GM_addStyle
// @license      MIT
// @noframes
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552456/ChatGPT%20Bulk%20Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/552456/ChatGPT%20Bulk%20Deleter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // single supervisor object that can remount as needed
  window.__BD_SUP__ = window.__BD_SUP__ || {
    mounted: false,
    running: false,
    armed: false,
    logStore: [],
    ensureTimer: null,
    lastUrl: location.href
  };
  const S = window.__BD_SUP__;

  // ---------- UI ----------
  GM_addStyle(`
    #bd-btn{position:fixed;top:12px;left:12px;z-index:2147483647;padding:10px 14px;border:none;border-radius:10px;background:#ef4444;color:#fff;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.35)}
    #bd-btn[disabled]{opacity:.6;cursor:not-allowed}
    #bd-log{position:fixed;bottom:12px;left:12px;width:460px;max-height:55vh;overflow:auto;border:1px solid #2e2e2e;background:#111;color:#ddd;border-radius:10px;z-index:2147483647;box-shadow:0 8px 24px rgba(0,0,0,.35);font:12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;display:none}
    #bd-log header{display:flex;justify-content:space-between;align-items:center;padding:8px 10px;border-bottom:1px solid #2e2e2e;background:#181818;border-top-left-radius:10px;border-top-right-radius:10px}
    #bd-log header b{font-size:12px}
    #bd-log header button{background:#333;border:1px solid #444;color:#eee;border-radius:6px;padding:4px 8px;cursor:pointer}
    #bd-log pre{white-space:pre-wrap;margin:0;padding:10px;line-height:1.35}
  `);

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const base = () => window.location.origin;
  const get = sel => document.querySelector(sel);

  function getCookie(name){
    return document.cookie.split('; ').find(r => r.startsWith(name + '='))?.split('=')[1];
  }

  function showLog(show){
    const el = get('#bd-log');
    if (el) el.style.display = show ? 'block' : 'none';
  }

  function log(...a){
    const line = a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' ');
    S.logStore.push(line);
    const pre = get('#bd-pre');
    if (pre) pre.textContent = S.logStore.join('\n');
    console.log('[BulkDeleter]', ...a);
  }

  async function getBearer(){
    try{
      const res = await fetch(`${base()}/api/auth/session`, { credentials:'include', cache:'no-store' });
      if (!res.ok) return null;
      const j = await res.json();
      if (j && j.accessToken){
        log('token ok');
        return j.accessToken;
      }
    }catch(e){}
    log('no bearer');
    return null;
  }

  async function http(method, url, body, bearer){
    const csrfCookie = getCookie('csrfToken');
    const csrf = csrfCookie ? decodeURIComponent(csrfCookie) : '';
    const did  = getCookie('oai-did') || '';

    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrf,
      'OAI-Device-Id': did
    };
    if (bearer) headers['Authorization'] = `Bearer ${bearer}`;

    const opts = { method, headers, credentials: 'include', mode: 'same-origin' };
    if (body !== undefined) opts.body = JSON.stringify(body);

    try{
      const res = await fetch(url, opts);
      const text = await res.text().catch(()=> '');
      const ok = res.ok || res.status === 204 || res.status === 404;
      return { ok, status: res.status, text, url };
    }catch(e){
      return { ok:false, status:0, text:String(e), url };
    }
  }

  async function listPage(offset, limit, bearer){
    const tries = [
      `${base()}/backend-api/conversations?offset=${offset}&limit=${limit}&order=updated`,
      `${base()}/api/conversations?offset=${offset}&limit=${limit}&order=updated`,
      `${base()}/backend-api/conversations?cursor=${offset}&limit=${limit}&order=updated`
    ];
    for (const u of tries){
      try{
        const res = await fetch(u, { credentials:'include', cache:'no-store', headers: bearer ? { Authorization: `Bearer ${bearer}` } : undefined });
        if (!res.ok) continue;
        const j = await res.json();
        const items = j.items || j.conversations || j.data || [];
        const ids = [];
        for (const it of items){
          const id = it.id || it.conversation_id || it.conversationId;
          if (id) ids.push(id);
        }
        const total = Number(j.total ?? j.total_conversations ?? j.count ?? ids.length);
        const hasMore = Boolean(j.has_more ?? (offset + ids.length < total));
        return { ids, total, hasMore };
      }catch(e){}
    }
    return { ids: [], total: 0, hasMore: false };
  }

  async function listAllIds(bearer){
    const page = 100;
    let offset = 0;
    const all = new Set();

    const first = await listPage(0, page, bearer);
    first.ids.forEach(id => all.add(id));
    log(`found ${all.size} on first page total ${first.total || all.size}`);

    while (first.hasMore && all.size < (first.total || 999999)){
      offset += page;
      const next = await listPage(offset, page, bearer);
      next.ids.forEach(id => all.add(id));
      log(`page offset ${offset} added ${next.ids.length}`);
      if (!next.hasMore || next.ids.length === 0) break;
      await sleep(120);
    }
    return Array.from(all);
  }

  async function delSoftHard(id, bearer){
    const urls = [
      `${base()}/backend-api/conversation/${id}`,
      `${base()}/backend-api/conversations/${id}`,
      `${base()}/api/conversations/${id}`,
      `${base()}/api/conversation/${id}`
    ];
    for (const u of urls){
      const r = await http('PATCH', u, { is_visible:false }, bearer);
      log(r.ok ? `soft ok ${id} ${r.status}` : `soft fail ${id} ${r.status} ${u}`);
      if (r.ok) return true;
    }
    {
      const r = await http('POST', `${base()}/backend-api/conversations/delete`, { conversation_ids:[id] }, bearer);
      log(r.ok ? `bulk soft ok ${id} ${r.status}` : `bulk soft fail ${id} ${r.status}`);
      if (r.ok) return true;
    }
    for (const u of urls){
      const r = await http('DELETE', u, undefined, bearer);
      log(r.ok ? `hard ok ${id} ${r.status}` : `hard fail ${id} ${r.status} ${u}`);
      if (r.ok) return true;
    }
    return false;
  }

  async function delGraphQL(id, bearer){
    try{
      const payloads = [
        {
          operationName: 'deleteConversation',
          variables: { conversationId: id },
          query: 'mutation deleteConversation($conversationId:ID!){deleteConversation(conversationId:$conversationId){id}}'
        },
        {
          operationName: 'DeleteConversationMutation',
          variables: { id },
          query: 'mutation DeleteConversationMutation($id:ID!){conversationDelete(id:$id){success}}'
        }
      ];
      for (const p of payloads){
        const r = await http('POST', `${base()}/backend-api/graphql`, p, bearer);
        log(r.ok ? `gql ok ${id} ${r.status}` : `gql fail ${id} ${r.status}`);
        if (r.ok) return true;
      }
    }catch(e){
      log('gql error ' + e);
    }
    return false;
  }

  async function deleteOne(id, bearer){
    if (await delSoftHard(id, bearer)) return true;
    if (await delGraphQL(id, bearer)) return true;
    return false;
  }

  // ---------- Mount and resilience ----------
  function mountUI(){
    // create or refresh button
    let btn = get('#bd-btn');
    if (!btn){
      btn = document.createElement('button');
      btn.id = 'bd-btn';
      btn.textContent = 'Delete All Chats';
      btn.addEventListener('click', onButtonClick, { passive: true });
      document.body.appendChild(btn);
    }
    // create or refresh log
    let box = get('#bd-log');
    if (!box){
      box = document.createElement('div');
      box.id = 'bd-log';
      box.innerHTML = `
        <header>
          <b>Bulk Deleter Log</b>
          <div>
            <button id="bd-copy">Copy</button>
            <button id="bd-clear">Clear</button>
          </div>
        </header>
        <pre id="bd-pre"></pre>
      `;
      document.body.appendChild(box);
    }
    // hook actions
    const clearBtn = get('#bd-clear');
    const copyBtn  = get('#bd-copy');
    if (clearBtn && !clearBtn.__bdHooked){
      clearBtn.__bdHooked = true;
      clearBtn.onclick = () => { S.logStore.length = 0; const pre = get('#bd-pre'); if (pre) pre.textContent = ''; };
    }
    if (copyBtn && !copyBtn.__bdHooked){
      copyBtn.__bdHooked = true;
      copyBtn.onclick = () => navigator.clipboard.writeText(S.logStore.join('\n')).catch(()=>{});
    }

    S.mounted = true;
  }

  function ensureUI(){
    if (!document.body) return;
    if (!get('#bd-btn') || !get('#bd-log')) mountUI();
  }

  function hookSPARouteChanges(){
    // detect URL changes and try remount
    const origPush = history.pushState;
    const origReplace = history.replaceState;
    function onChange(){
      if (S.lastUrl !== location.href){
        S.lastUrl = location.href;
        setTimeout(ensureUI, 50);
        setTimeout(ensureUI, 300);
        setTimeout(ensureUI, 1200);
      }
    }
    history.pushState = function(...args){ const r = origPush.apply(this, args); onChange(); return r; };
    history.replaceState = function(...args){ const r = origReplace.apply(this, args); onChange(); return r; };
    window.addEventListener('popstate', onChange);
    new MutationObserver(() => ensureUI()).observe(document.documentElement, { childList: true, subtree: true });
  }

  // rescue hotkey: Ctrl Alt D remounts, Shift L D toggles log
  window.addEventListener('keydown', e => {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'd'){ ensureUI(); }
    if (e.shiftKey && e.key.toLowerCase() === 'd'){
      const el = get('#bd-log');
      if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
    }
  });

  // button logic with two click arm
  async function onButtonClick(){
    if (S.running) return;
    const btn = get('#bd-btn');

    // first click scans and arms
    if (!S.armed){
      S.running = true;
      showLog(true);
      btn.disabled = true;
      log('starting');
      const bearer = await getBearer();
      btn.textContent = 'Scanning...';
      const ids = await listAllIds(bearer);
      window.__BD_IDS__ = ids;
      btn.disabled = false;
      S.running = false;
      showLog(false);

      if (!ids.length){
        btn.textContent = 'Delete All Chats';
        log('no ids found');
        return;
      }
      S.armed = true;
      btn.textContent = `Click again to delete ${ids.length} chats`;
      log(`armed with ${ids.length} ids`);
      return;
    }

    // second click executes
    if (S.armed){
      S.armed = false;
      S.running = true;
      showLog(true);
      const bearer = await getBearer();
      const ids = Array.isArray(window.__BD_IDS__) ? window.__BD_IDS__ : [];
      btn.disabled = true;

      let ok = 0, fail = 0;
      for (let i = 0; i < ids.length; i++){
        const id = ids[i];
        btn.textContent = `Deleting ${i + 1}/${ids.length}...`;
        const good = await deleteOne(id, bearer);
        if (good) ok++; else fail++;
        await sleep(120);
      }

      log(`done ok ${ok} fail ${fail}`);
      btn.textContent = 'Delete All Chats';
      btn.disabled = false;
      S.running = false;
      showLog(false);
      if (ok > 0) setTimeout(() => location.replace('https://chatgpt.com/?new'), 1200);
    }
  }

  // wait for body then mount and keep it alive
  function boot(){
    if (!document.body){ requestAnimationFrame(boot); return; }
    ensureUI();
    hookSPARouteChanges();
    if (!S.ensureTimer){
      S.ensureTimer = setInterval(ensureUI, 1500);
    }
  }

  boot();
})();
