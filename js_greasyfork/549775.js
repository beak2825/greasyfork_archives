// ==UserScript==
// @name         Kick xQc + Twitch Chat (7TV emotes)
// @namespace    https://github.com/yourname
// @version      1.2.0
// @description  Adds a left column on kick.com/xqc showing Twitch chat via IRC, with 7TV emotes rendered inline.
// @author       you
// @match        https://kick.com/xqc*
// @match        https://www.kick.com/xqc*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/549775/Kick%20xQc%20%2B%20Twitch%20Chat%20%287TV%20emotes%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549775/Kick%20xQc%20%2B%20Twitch%20Chat%20%287TV%20emotes%29.meta.js
// ==/UserScript==

(() => {
  'use strict';
  if (window.top !== window.self) return;

  // --- channel + service constants ---
  const TWITCH_CHANNEL_LOGIN = 'xqc';
  const TWITCH_CHANNEL_ID = '71092938'; // Twitch user ID for xQc (static) :contentReference[oaicite:1]{index=1}
  const WS_URL = 'wss://irc-ws.chat.twitch.tv:443';
  const PANEL_ID = 'tm-twitch-chat-panel';
  const DEFAULT_WIDTH = GM_getValue('panelWidth', 380);
  const MIN_WIDTH = 260, MAX_WIDTH = 620;

  // --- 7TV cache (12h) ---
  const SEVENTV_CACHE_KEY = 'tm-7tv-emotes-cache';
  const SEVENTV_CACHE_MS = 12 * 60 * 60 * 1000;

  // --- quick route check (Kick is SPA) ---
  const onXqc = () => /^\/xqc(\/|$|\?)/i.test(location.pathname);

  // --- styles ---
  GM_addStyle(`
    #${PANEL_ID}{
      position:fixed;left:0;top:0;height:100vh;width:${DEFAULT_WIDTH}px;display:flex;flex-direction:column;
      background:#0f1113;color:#fff;z-index:2147483646;border-right:1px solid rgba(255,255,255,.08);
      box-shadow:2px 0 10px rgba(0,0,0,.35);font:13px/1.4 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;
    }
    #${PANEL_ID}.collapsed{width:42px!important}
    #${PANEL_ID} .tm-head{height:42px;display:flex;align-items:center;justify-content:space-between;padding:0 10px;gap:8px;background:#14171a;border-bottom:1px solid rgba(255,255,255,.06);user-select:none}
    #${PANEL_ID} .tm-title{font-weight:600;opacity:.9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    #${PANEL_ID} .tm-actions{display:flex;gap:6px}
    #${PANEL_ID} .tm-btn{border:1px solid rgba(255,255,255,.14);background:transparent;color:#e8e8e8;padding:4px 8px;font-size:12px;border-radius:6px;cursor:pointer}
    #${PANEL_ID} .tm-btn:hover{border-color:rgba(255,255,255,.28);background:rgba(255,255,255,.06)}
    #${PANEL_ID} .tm-body{position:relative;flex:1 1 auto;min-height:0;overflow:hidden}
    #${PANEL_ID} .tm-list{position:absolute;inset:0;overflow:auto;padding:8px 10px 14px;scrollbar-width:thin}
    #${PANEL_ID} .msg{margin-bottom:6px;word-break:break-word}
    #${PANEL_ID} .name{font-weight:600;margin-right:.35em}
    #${PANEL_ID} .system{opacity:.75;font-style:italic}
    #${PANEL_ID} .tm-foot{padding:6px 8px;border-top:1px solid rgba(255,255,255,.06);display:flex;align-items:center;gap:8px;color:#cfcfcf}
    #${PANEL_ID} .tm-resize{position:absolute;right:-4px;top:0;width:8px;height:100%;cursor:ew-resize}
    /* emotes */
    #${PANEL_ID} .emote{vertical-align:middle;display:inline-block;width:28px;height:28px;image-rendering:auto}
    @media(max-width:1200px){html.tm-with-twitch body{margin-left:0!important}#${PANEL_ID}{display:none!important}}
  `);

  // --- panel helpers ---
  const setWidth = (px) => {
    const w = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, Math.round(px)));
    const el = document.getElementById(PANEL_ID);
    if (el) el.style.width = w + 'px';
    document.documentElement.style.setProperty('--tm-twitch-panel-width', w + 'px');
    GM_setValue('panelWidth', w);
  };

  let ui = { panel:null, list:null, status:null };

  const createPanel = () => {
    if (document.getElementById(PANEL_ID)) return;
    const panel = document.createElement('aside');
    panel.id = PANEL_ID;
    panel.style.width = (GM_getValue('panelWidth', DEFAULT_WIDTH) || DEFAULT_WIDTH) + 'px';

    const head = document.createElement('div'); head.className='tm-head';
    const title = document.createElement('div'); title.className='tm-title'; title.textContent = `Twitch Chat — ${TWITCH_CHANNEL_LOGIN}`;
    const actions = document.createElement('div'); actions.className='tm-actions';

    const btnPop = document.createElement('button'); btnPop.className='tm-btn'; btnPop.textContent='Pop-out';
    btnPop.addEventListener('click', () => window.open(`https://www.twitch.tv/popout/${TWITCH_CHANNEL_LOGIN}/chat?popout=`, '_blank','width=420,height=700'));

    const btnCollapse = document.createElement('button'); btnCollapse.className='tm-btn'; btnCollapse.textContent='Collapse';
    btnCollapse.addEventListener('click', ()=>{ panel.classList.toggle('collapsed'); btnCollapse.textContent = panel.classList.contains('collapsed')?'Expand':'Collapse'; });

    actions.append(btnPop, btnCollapse);
    head.append(title, actions);

    const body = document.createElement('div'); body.className='tm-body';
    const list = document.createElement('div'); list.className='tm-list';
    const status = document.createElement('div'); status.className='tm-foot'; status.textContent='Connecting to Twitch chat…';

    const resizer = document.createElement('div'); resizer.className='tm-resize';
    let drag=false,sx=0,sw=0;
    resizer.addEventListener('mousedown', (e)=>{
      drag=true; sx=e.clientX; sw=panel.getBoundingClientRect().width;
      document.body.style.cursor='ew-resize';
      const move=(ev)=>{ if(!drag) return; setWidth(sw+(ev.clientX-sx)); };
      const up=()=>{ drag=false; document.body.style.cursor=''; document.removeEventListener('mousemove',move); document.removeEventListener('mouseup',up); };
      document.addEventListener('mousemove',move); document.addEventListener('mouseup',up); e.preventDefault();
    });

    body.append(list, resizer);
    panel.append(head, body, status);
    document.body.append(panel);
    document.documentElement.classList.add('tm-with-twitch');
    setWidth(panel.getBoundingClientRect().width);
    ui = { panel, list, status };
  };

  const removePanel = () => {
    const el = document.getElementById(PANEL_ID);
    if (el) el.remove();
    document.documentElement.classList.remove('tm-with-twitch');
    document.documentElement.style.removeProperty('--tm-twitch-panel-width');
  };

  const ensurePanel = () => onXqc() ? createPanel() : removePanel();

  // --- tiny IRC client ---
  let ws, reconnectTimer=0, backoff=1000;
  const send = (l)=>{ try{ ws && ws.readyState===1 && ws.send(l+'\r\n'); }catch(_){} };
const addLine = (html, cls = 'msg') => {
  if (!ui.list) return;
  const bottom =
    ui.list.scrollTop + ui.list.clientHeight >= ui.list.scrollHeight - 6;

  const div = document.createElement('div');
  div.className = cls;
  div.innerHTML = html;
  ui.list.append(div);

  // --- prune old messages after 250 ---
  const maxMessages = 250;
  while (ui.list.childNodes.length > maxMessages) {
    ui.list.removeChild(ui.list.firstChild);
  }

  if (bottom) ui.list.scrollTop = ui.list.scrollHeight;
};

  const escapeHTML = (s)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  // --- 7TV: fetch + build replacer ---
  let sevenTV = { map:new Map(), regex:null };

  const fetchSevenTV = async (twitchId) => {
    // 1) Get 7TV user by Twitch ID -> emote_set id (v3)
    // 2) Fetch the emote set -> list of emotes
    // 3) Build name->URL map using cdn.7tv.app/emote/<id>/<scale>.webp (animated WEBP/AVIF supported) :contentReference[oaicite:2]{index=2}
    const now = Date.now();
    try {
      const cached = GM_getValue(SEVENTV_CACHE_KEY);
      if (cached) {
        const obj = JSON.parse(cached);
        if (obj.twitchId === twitchId && (now - obj.time) < SEVENTV_CACHE_MS) {
          sevenTV.map = new Map(obj.entries);
          sevenTV.regex = buildRegex([...sevenTV.map.keys()]);
          return;
        }
      }
    } catch(_) {}

    // users/twitch/<id>
    const u = await fetch(`https://7tv.io/v3/users/twitch/${encodeURIComponent(twitchId)}`).then(r=>r.ok?r.json():null);
    const setId = u?.emote_set?.id || (u?.emote_sets && u.emote_sets[0]?.id);
    if (!setId) return;

    // emote set
    const set = await fetch(`https://api.7tv.app/v3/emote-sets/${encodeURIComponent(setId)}`).then(r=>r.ok?r.json():null);
    const entries = [];
    if (set?.emotes?.length) {
      for (const e of set.emotes) {
        const name = e.name;
        const id = e.id || e?.data?.id || e?.emote?.id || e?.id_object; // tolerate shapes
        if (!name || !id) continue;
        const url = `https://cdn.7tv.app/emote/${id}/3x.webp`; // 3x looks crisp in 28px; 4x also fine. :contentReference[oaicite:3]{index=3}
        entries.push([name, url]);
      }
    }
    sevenTV.map = new Map(entries);
    sevenTV.regex = buildRegex([...sevenTV.map.keys()]);

    // cache
    try {
      GM_setValue(SEVENTV_CACHE_KEY, JSON.stringify({ time: now, twitchId, entries }));
    } catch(_) {}
  };

  const escapeRegex = (s)=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const buildRegex = (names)=>{
    // Match emote tokens as standalone (surrounded by start/space/end or punctuation)
    const sorted = names.slice().sort((a,b)=>b.length-a.length).map(escapeRegex);
    return sorted.length ? new RegExp(`(^|\\s)(?:${sorted.join('|')})(?=$|\\s|[.,!?;:])`,'g') : null;
  };

  const emoteify = (text) => {
    if (!sevenTV.regex || sevenTV.map.size === 0) return text;
    return text.replace(sevenTV.regex, (m, lead) => {
      const token = m.slice(lead.length); // actual word matched
      const url = sevenTV.map.get(token);
      return url ? `${lead}<img class="emote" alt="${token}" title="${token}" src="${url}">` : m;
    });
  };

  // --- parse IRC messages + render ---
  const decodeTag = (v='')=>v.replace(/\\s/g,' ').replace(/\\:/g,';').replace(/\\\\/g,'\\').replace(/\\r/g,'\r').replace(/\\n/g,'\n');
  const parseTags = (s='')=>{
    const out={}; s.split(';').forEach(kv=>{ const i=kv.indexOf('='); if(i===-1) out[kv]=''; else out[kv.slice(0,i)]=decodeTag(kv.slice(i+1)); }); return out;
  };

  const onIRC = (raw) => {
    raw.split(/\r\n/).forEach(line=>{
      if(!line) return;
      if (line.startsWith('PING')) { send('PONG :tmi.twitch.tv'); return; }

      // mini parser
      let rest=line, tags={}, prefix='', cmd='', params=[];
      if (rest[0]==='@'){ const i=rest.indexOf(' '); tags=parseTags(rest.slice(1,i)); rest=rest.slice(i+1); }
      if (rest[0]===':'){ const i=rest.indexOf(' '); prefix=rest.slice(1,i); rest=rest.slice(i+1); }
      const ti = rest.indexOf(' :'); let trail=''; if (ti!==-1){ trail=rest.slice(ti+2); rest=rest.slice(0,ti); }
      const parts = rest.split(' '); cmd=parts.shift()||''; params=parts;

      if (cmd === 'PRIVMSG') {
        const user = (prefix.split('!')[0]||'').replace(/^:/,'');
        const name = tags['display-name'] || user;
        const color = tags['color'] || '#adadb8';
        const safe = escapeHTML(trail);
        const withEmotes = emoteify(safe);
        addLine(`<span class="name" style="color:${color}">${name}</span><span class="text">${withEmotes}</span>`);
      } else if (['NOTICE','USERNOTICE','ROOMSTATE'].includes(cmd)) {
        addLine(`<span class="system">${cmd.toLowerCase()} — ${escapeHTML(trail||'')}</span>`,'msg system');
      } else if (cmd === 'RECONNECT') {
        addLine(`<span class="system">Server asked to reconnect…</span>`,'msg system');
        try { ws.close(); } catch(_) {}
      }
    });
  };

  const connect = () => {
    try { if (ws) ws.close(); } catch(_) {}
    ws = new WebSocket(WS_URL);
    ws.addEventListener('open', () => {
      ui.status && (ui.status.textContent = 'Connected. Joining #'+TWITCH_CHANNEL_LOGIN+'…');
      send('CAP REQ :twitch.tv/tags twitch.tv/commands');
      const nick = 'justinfan' + Math.floor(Math.random()*1e8);
      send('PASS SCHMOOPIIE'); // arbitrary
      send(`NICK ${nick}`);
      send(`JOIN #${TWITCH_CHANNEL_LOGIN}`);
      backoff = 1000;
    });
    ws.addEventListener('message', (ev)=>onIRC(ev.data));
    ws.addEventListener('close', ()=>reconnect('Disconnected.'));
    ws.addEventListener('error', ()=>reconnect('Connection error.'));
  };
  const reconnect = (msg)=>{
    if (ui.status) ui.status.textContent = `${msg} Reconnecting…`;
    clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(connect, backoff);
    backoff = Math.min(backoff*1.8, 30000);
  };

  // --- init / SPA nav hooks ---
  const hookHistory = ()=>{
    const p=history.pushState, r=history.replaceState;
    history.pushState=function(){ const ret=p.apply(this,arguments); window.dispatchEvent(new Event('tm:loc')); return ret; };
    history.replaceState=function(){ const ret=r.apply(this,arguments); window.dispatchEvent(new Event('tm:loc')); return ret; };
    window.addEventListener('popstate',()=>window.dispatchEvent(new Event('tm:loc')));
    window.addEventListener('tm:loc', ensurePanel);
  };

  const boot = async ()=>{
    hookHistory();
    ensurePanel();

    // Load 7TV emotes and connect to IRC
    await fetchSevenTV(TWITCH_CHANNEL_ID);  // 7TV v3: users->emote_set, then emote-sets->emotes. :contentReference[oaicite:4]{index=4}
    if (ui.status) ui.status.textContent = ui.status.textContent.replace('Connecting', 'Connecting (7TV ready)');

    // Start IRC after panel exists
    const tryStart = ()=>{ if (document.getElementById(PANEL_ID) && !ws) connect(); else setTimeout(tryStart, 150); };
    tryStart();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ()=>boot());
  } else {
    boot();
  }
})();
