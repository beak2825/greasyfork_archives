// ==UserScript==
// @name         Auto Send Link By Ngrok
// @match        https://nreer.com/*
// @grant        none
// @run-at       document-idle
// @version      1.1.19
// @author Dang Cong Vu
// @namespace https://tampermonkey.net/
// @description Auto NR - Build mới từ đầu
// @downloadURL https://update.greasyfork.org/scripts/555470/Auto%20Send%20Link%20By%20Ngrok.user.js
// @updateURL https://update.greasyfork.org/scripts/555470/Auto%20Send%20Link%20By%20Ngrok.meta.js
// ==/UserScript==

(function(){
  'use strict';

  /***************** CONFIG - CHỈ SỬA CHỖ NÀY *****************/
  const WS_URL = 'wss://5d492c6b234f.ngrok-free.app/';
  const SECRET_TOKEN = 'MY_SECRET_TOKEN_ChangeMe'; // optional (không bắt buộc client-side)
  const XPATH = "//*[contains(concat( ' ', @class, ' ' ), concat( ' ', 'form-control-lg', ' ' ))]"; // XPath mục tiêu
  /*********************************************************/

  // UI elements
  let panel, btn, statusEl, logEl, inputId;

  // websocket state
  let ws = null;
  let agentId = null;
  let reconnectTimer = null;
  let lastState = '';

  function log(msg){
    const t = (new Date()).toLocaleTimeString();
    if(!logEl) return console.log(`[Agent UI] ${msg}`);
    const line = document.createElement('div');
    line.style.padding = '4px 6px';
    line.style.borderBottom = '1px solid rgba(0,0,0,0.06)';
    line.style.fontSize = '12px';
    line.textContent = `${t} — ${msg}`;
    logEl.prepend(line);
    // limit lines
    while(logEl.childElementCount > 50) logEl.removeChild(logEl.lastChild);
  }

  function getStoredAgentId(){ try { return localStorage.getItem('nreer_agent_id'); } catch(e){ return null; } }
  function setStoredAgentId(v){ try { localStorage.setItem('nreer_agent_id', String(v)); } catch(e){} }
  function removeStoredAgentId(){ try { localStorage.removeItem('nreer_agent_id'); } catch(e){} }

  function createUI(){
    // floating button
    btn = document.createElement('button');
    btn.textContent = 'NR';
    btn.title = 'Nreer Agent';
    Object.assign(btn.style, {
      position:'fixed', right:'12px', bottom:'14px', zIndex:2147483647,
      width:'22px', height:'22px', borderRadius:'50%', border:'none', background:'#17a2b8',
      color:'white', fontWeight:'600',fontSize: '10px', boxShadow:'0 6px 18px rgba(0,0,0,0.2)', cursor:'pointer'
    });
    document.body.appendChild(btn);

    // panel
    panel = document.createElement('div');
    Object.assign(panel.style, {
      position:'fixed', right:'12px', bottom:'70px', width:'320px', zIndex:2147483647,
      background:'#ffffff', border:'1px solid rgba(0,0,0,0.12)', borderRadius:'8px', boxShadow:'0 8px 30px rgba(0,0,0,0.15)',
      padding:'12px', display:'none', fontFamily:'Arial, sans-serif', fontSize:'13px'
    });

    panel.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <strong style="font-size:14px">Nreer Agent</strong>
        <button id="ui-close" style="background:transparent;border:none;cursor:pointer;font-size:16px">✕</button>
      </div>
      <div style="margin-bottom:8px">
        <label style="font-size:12px;color:#333">Agent ID (1..18)</label>
        <input id="agent-id-input" type="text" placeholder="Nhập ID" style="width:100%;padding:6px;margin-top:6px;border:1px solid #ddd;border-radius:4px;font-size:13px" />
        <div style="margin-top:6px;display:flex;gap:6px">
          <button id="ui-save" style="flex:1;padding:8px;border-radius:4px;background:#28a745;border:none;color:white;cursor:pointer">Lưu</button>
          <button id="ui-clear" style="padding:8px;border-radius:4px;background:#dc3545;border:none;color:white;cursor:pointer">Xoá</button>
        </div>
      </div>

      <div style="margin-bottom:8px">
        <div style="display:flex;align-items:center;justify-content:space-between">
          <div><small style="color:#666">WS:</small> <span id="ws-status" style="font-weight:600">-</span></div>
          <button id="ui-ping" style="padding:6px 8px;border-radius:4px;background:#007bff;border:none;color:white;cursor:pointer">Ping</button>
        </div>
      </div>

      <div style="margin-bottom:8px">
        <small style="color:#666">Last registered:</small>
        <div id="last-registered" style="font-weight:600">-</div>
      </div>

      <div style="margin-top:6px;border-top:1px dashed #eee;padding-top:8px">
        <div style="font-size:12px;color:#666;margin-bottom:6px">Log</div>
        <div id="ui-log" style="max-height:160px;overflow:auto;background:#fafafa;border:1px solid #f0f0f0;padding:6px;border-radius:4px"></div>
      </div>
    `;
    document.body.appendChild(panel);

    // references
    statusEl = panel.querySelector('#ws-status');
    logEl = panel.querySelector('#ui-log');
    inputId = panel.querySelector('#agent-id-input');

    // load stored
    const stored = getStoredAgentId();
    if(stored) inputId.value = stored;
    panel.querySelector('#last-registered').textContent = stored ? stored : '-';

    // events
    btn.addEventListener('click', ()=> { panel.style.display = panel.style.display === 'none' ? 'block' : 'none'; });
    panel.querySelector('#ui-close').addEventListener('click', ()=> panel.style.display = 'none');

    panel.querySelector('#ui-save').addEventListener('click', ()=>{
      const v = (inputId.value||'').trim();
      if(!v) return alert('Nhập ID (1..18)');
      if(!/^\d+$/.test(v)) return alert('ID phải là số nguyên');
      setStoredAgentId(v);
      panel.querySelector('#last-registered').textContent = v;
      log(`Saved Agent ID = ${v}`);
      // update agentId in running client and re-register
      agentId = v;
      registerAgentNow();
    });

    panel.querySelector('#ui-clear').addEventListener('click', ()=>{
      if(!confirm('Xoá Agent ID cho profile này?')) return;
      removeStoredAgentId();
      inputId.value = '';
      panel.querySelector('#last-registered').textContent = '-';
      log('Cleared Agent ID');
      agentId = null;
      // optional: close ws or re-register without id
    });

    panel.querySelector('#ui-ping').addEventListener('click', ()=>{
      if(ws && ws.readyState === WebSocket.OPEN){
        ws.send(JSON.stringify({ type:'ping', ts: Date.now() }));
        log('Sent ping');
      } else {
        alert('WS chưa mở. Hãy đảm bảo server/ngrok và kết nối.');
      }
    });

    // click outside closes panel (small)
    document.addEventListener('click', (ev) => {
      if(!panel.contains(ev.target) && ev.target !== btn) {
        // don't auto-close for convenience; comment out if undesired
        // panel.style.display = 'none';
      }
    });
  }

  // WebSocket connect + auto-register
  function connectWS(){
    try {
      ws = new WebSocket(WS_URL);
    } catch(e){
      log('WS ctor failed: ' + (e && e.message ? e.message : e));
      updateStatus('error');
      scheduleReconnect();
      return;
    }

    updateStatus('connecting');

    ws.onopen = () => {
      log('WS open');
      updateStatus('open');
      // read stored id and register
      const stored = getStoredAgentId();
      if(stored) {
        agentId = stored;
        try {
          ws.send(JSON.stringify({ type: 'register', agentId: String(agentId) }));
          log(`Sent register ${agentId}`);
          const lastEl = panel ? panel.querySelector('#last-registered') : null;
          if (lastEl) lastEl.textContent = agentId;
        } catch(e){ log('Register send failed'); }
      } else {
        log('No Agent ID set (use popup to set)');
      }
    };

    ws.onmessage = (ev) => {
      // handle server messages
      console.log('[WS] Message received:', ev.data);
      let data = null;
      try { data = JSON.parse(ev.data); } catch(e){
        console.error('[WS] Failed to parse message:', e);
      }
      if(!data) return;
      console.log('[WS] Parsed data:', data);
      
      if(data.type === 'registered'){
        log(`Server ack registered agent ${data.agentId}`);
        console.log('[WS] Agent registered successfully:', data.agentId);
        const el = panel ? panel.querySelector('#last-registered') : null;
        if(el) el.textContent = data.agentId;
      } else if(data.type === 'pong'){
        log('Pong from server');
        console.log('[WS] Pong received');
      } else if(data.type === 'auto-fill'){
        console.log('🔵 [AUTO-FILL START] Link received:', data.link);
        log('Auto-fill received, filling...');
        try { 
          fillValue(String(data.link||'')); 
        } catch(e){ 
          console.error('[AUTO-FILL] Fill error:', e);
          log('Fill error'); 
        }
      } else {
        log('Msg: ' + JSON.stringify(data).slice(0,200));
      }
    };

    ws.onclose = (e) => {
      log('WS closed');
      updateStatus('closed');
      scheduleReconnect();
    };

    ws.onerror = (e) => {
      log('WS error');
      updateStatus('error');
      try{ ws.close(); }catch(e){}
    };
  }

  function scheduleReconnect(){
    if(reconnectTimer) return;
    reconnectTimer = setTimeout(()=>{
      reconnectTimer = null;
      log('Attempt reconnect...');
      connectWS();
    }, 10_000 + Math.floor(Math.random()*5000));
  }

  function updateStatus(s){
    lastState = s;
    if(!statusEl) return;
    const map = {
      connecting: { text:'Connecting', color:'#f39c12' },
      open: { text:'Open', color:'#28a745' },
      closed: { text:'Closed', color:'#6c757d' },
      error: { text:'Error', color:'#dc3545' }
    };
    const m = map[s] || { text: s, color:'#333' };
    statusEl.textContent = m.text;
    statusEl.style.color = m.color;
  }

  function registerAgentNow(){
    try {
      const id = getStoredAgentId();
      if(!id) return log('No id to register');
      agentId = id;
      if(ws && ws.readyState === WebSocket.OPEN){
        ws.send(JSON.stringify({ type:'register', agentId: String(agentId) }));
        log('Re-sent register ' + agentId);
        const lastEl = panel ? panel.querySelector('#last-registered') : null;
        if (lastEl) lastEl.textContent = agentId;
      } else {
        log('WS not open; will register after connect');
      }
    } catch(e){ log('registerAgentNow error'); }
  }

  // fill logic with improved timing
  function getByXPath(xp, root=document){
    try {
      return document.evaluate(xp, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    } catch(e){
      console.warn('XPath error', e);
      return null;
    }
  }
  function fillValue(v){
    if(!v) {
      console.warn('[FILL] Empty value, aborting');
      return;
    }
    console.log('[FILL] Looking for input element...');
    const el = getByXPath(XPATH);
    if(!el){
      console.warn('[FILL] Input not found, retry in 600ms');
      setTimeout(()=> fillValue(v), 600);
      return;
    }
    console.log('[FILL] Input element found:', el);
    try {
      // Add random delay to avoid pattern detection (2-4s)
      const randomDelay = 2000 + Math.floor(Math.random() * 2000);
      console.log(`🔵 [FILL] Will fill after ${randomDelay}ms delay...`);
      console.log(`🔵 [FILL] Link to fill: "${v}"`);
      
      setTimeout(() => {
        console.log('🟢 [FILL] Now filling input...');
        el.focus && el.focus();
        if('value' in el) el.value = v; else el.textContent = v;
        el.dispatchEvent(new Event('input', {bubbles:true}));
        el.dispatchEvent(new Event('change', {bubbles:true}));
        console.log('🟢 [FILL] Input filled successfully!');
        console.log('🟢 [FILL] Current input value:', el.value);
        console.log('⏳ [FILL] Waiting for Auto NR script to submit...');
        log(`[Agent ${agentId}] Filled: ${v} (will auto-submit after delay)`);
      }, randomDelay);
    } catch(e){ 
      console.error('[FILL] Error during fill:', e);
      log('fillValue error'); 
    }
  }

  // init UI + connect
  createUI();
  connectWS();

  // expose small helper to console for debugging
  window.__nreer_agent = {
    wsUrl: WS_URL,
    getAgentId: () => getStoredAgentId(),
    setAgentId: (v) => { setStoredAgentId(v); agentId = v; registerAgentNow(); },
    resetAgentId: () => { removeStoredAgentId(); agentId = null; },
    sendPing: () => { if(ws && ws.readyState === WebSocket.OPEN){ ws.send(JSON.stringify({ type:'ping' })); } else log('WS not open'); }
  };

  log('Agent UI loaded. Click NR button bottom-right to open panel.');

})();
