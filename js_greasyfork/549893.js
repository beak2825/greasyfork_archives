// ==UserScript==
// @name         Tesla Inventory Reporter (特斯拉库存检测推送器 v4.9 面板可收起 • 可填Pushover • 颜色/内饰/轮毂/驱动识别)
// @namespace    https://github.com/DaybreakCoCone/Tesla-inventory-userscript-CN-
// @version      4.9.1
// @description  读取特斯拉库存（外/内/轮/驱动），Pushover 推送到手机；面板可收起；固定邀请码一键复制；支持填写/保存你的 Pushover 凭证；随机自动刷新；仅有车才推送
// @license      MIT
// @match        *://*.tesla.com/*
// @match        *://tesla.com/*
// @match        *://*.tesla.cn/*
// @match        *://tesla.cn/*
// @icon         https://www.tesla.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.pushover.net
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/549893/Tesla%20Inventory%20Reporter%20%28%E7%89%B9%E6%96%AF%E6%8B%89%E5%BA%93%E5%AD%98%E6%A3%80%E6%B5%8B%E6%8E%A8%E9%80%81%E5%99%A8%20v49%20%E9%9D%A2%E6%9D%BF%E5%8F%AF%E6%94%B6%E8%B5%B7%20%E2%80%A2%20%E5%8F%AF%E5%A1%ABPushover%20%E2%80%A2%20%E9%A2%9C%E8%89%B2%E5%86%85%E9%A5%B0%E8%BD%AE%E6%AF%82%E9%A9%B1%E5%8A%A8%E8%AF%86%E5%88%AB%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549893/Tesla%20Inventory%20Reporter%20%28%E7%89%B9%E6%96%AF%E6%8B%89%E5%BA%93%E5%AD%98%E6%A3%80%E6%B5%8B%E6%8E%A8%E9%80%81%E5%99%A8%20v49%20%E9%9D%A2%E6%9D%BF%E5%8F%AF%E6%94%B6%E8%B5%B7%20%E2%80%A2%20%E5%8F%AF%E5%A1%ABPushover%20%E2%80%A2%20%E9%A2%9C%E8%89%B2%E5%86%85%E9%A5%B0%E8%BD%AE%E6%AF%82%E9%A9%B1%E5%8A%A8%E8%AF%86%E5%88%AB%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const INVITE_URL = 'https://ts.la/xuan634381';
  const INVENTORY_URL = 'https://www.tesla.com/inventory/new/my?referral=xuan634381&redirect=no&range=200&PaymentType=lease';

  const KS = {
    report : 'tir49_report',
    rf_on  : 'tir49_rf_on',
    rf_min : 'tir49_rf_min',
    rf_max : 'tir49_rf_max',
    panel_min: 'tir49_panel_min',
    push_user: 'tir49_push_user',
    push_token:'tir49_push_token'
  };

  function getPushCred(){
    const user  = (GM_getValue(KS.push_user, '') || '').trim();
    const token = (GM_getValue(KS.push_token,'') || '').trim();
    return { user, token };
  }

  const sleep = ms => new Promise(r=>setTimeout(r,ms));
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const pad2=n=>String(n).padStart(2,'0');
  const nowStr=()=>{const d=new Date();return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;};
  function randRefreshSec(min,max){ let base=Math.random()*(max-min)+min; base+=base*(Math.random()*0.3-0.15); if(Math.random()<0.12) base+=30+Math.random()*90; return Math.max(10,Math.floor(base)); }

  function notify({ title, message, url, url_title }) {
    const cred = getPushCred();
    if (!cred.user || !cred.token) return;
    const data = new URLSearchParams({
      token: cred.token,
      user:  cred.user,
      title: title || 'Tesla 库存',
      message: message || '',
      priority: '0'
    });
    if (url) data.append('url', url);
    if (url_title) data.append('url_title', url_title);
    GM_xmlhttpRequest({
      method:'POST',
      url:'https://api.pushover.net/1/messages.json',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      data:data.toString()
    });
  }

  let reportSec = +GM_getValue(KS.report, 60) || 60;
  let rfOn      = GM_getValue(KS.rf_on,'1') === '1';
  let rfMin     = +GM_getValue(KS.rf_min,45) || 45;
  let rfMax     = +GM_getValue(KS.rf_max,180) || 180;
  let panelMin  = GM_getValue(KS.panel_min,'0') === '1';
  let reportTimer=null, running=true, refreshTimer=null, etaTimer=null, nextAt=0;
  let __reporting=false;

  const EXT_CN = {'Stealth Grey':'灰','Pearl White Multi-Coat':'白','Deep Blue Metallic':'蓝','Diamond Black':'黑','Quicksilver':'银','Ultra Red':'红'};
  const INT_CN = {'All Black Interior':'黑','Black and White Interior':'白'};
  const canon = (s)=>s||'';

  function getCards(){
    let nodes = Array.from(document.querySelectorAll('article[class*="result"]'));
    if (nodes.length === 0) nodes = Array.from(document.querySelectorAll('li[class*="result"]'));
    const topOnly = nodes.filter(n => !nodes.some(o => o !== n && o.contains(n)));
    const vis = topOnly.filter(el => {
      const r = el.getBoundingClientRect();
      return r.width>150 && r.height>150 && el.offsetParent!==null;
    });
    return Array.from(new Set(vis));
  }

  const SELECTED_SEL = [
    '[aria-selected="true"]','[aria-checked="true"]','[aria-pressed="true"]',
    '[data-selected="true"]','[data-state="selected"]','[data-checked="true"]',
    '.selected','.is-selected','.tds--is-selected','[aria-current="true"]',
    'input[type="radio"]:checked','[role="radio"][aria-checked="true"]'
  ].join(',');
  const GROUPS = {
    paint: /\b(Paint|Exterior|外观|车漆|颜色)\b/i,
    interior: /\b(Interior|内饰)\b/i,
    wheels: /\b(Wheels?|轮毂|轮圈|车轮)\b/i,
  };
  function findLabel(card, re){
    return Array.from(card.querySelectorAll('*')).find(n=>{
      const t=(n.textContent||'').trim(); return t && re.test(t);
    });
  }
  function groupScope(card, re){
    const label = findLabel(card, re);
    const scope = label ? (label.closest('section,div,li,article')||card) : card;
    return {label, scope};
  }
  function findSelectedInGroup(card, re){
    const {scope} = groupScope(card, re);
    if(!scope) return null;
    let selected = scope.querySelector(SELECTED_SEL) ||
                   scope.querySelector('button[aria-pressed="true"],[role="radio"][aria-checked="true"]');
    return selected||null;
  }
  function attrOrText(el){
    if(!el) return '';
    const attrs=['aria-label','title','alt','data-label','data-tooltip','data-tip'];
    for(const a of attrs){ const v=el.getAttribute&&el.getAttribute(a); if(v) return v.trim(); }
    const t=(el.innerText||el.textContent||'').trim(); if(t) return t;
    const p=el.parentElement; if(p){ const s=(p.innerText||p.textContent||'').trim(); if(s) return s; }
    return '';
  }
  function snapshotTooltips(){
    const set=new Set();
    document.querySelectorAll('[role="tooltip"], .tds-tooltip, .tds-tooltip__content, [data-popover], .popover, .tds-popover, .tds-tooltip-content')
      .forEach(n=>set.add(n));
    return set;
  }
  function newTooltipsSince(before){
    const arr=[];
    const all=document.querySelectorAll('[role="tooltip"], .tds-tooltip, .tds-tooltip__content, [data-popover], .popover, .tds-popover, .tds-tooltip-content');
    all.forEach(n=>{ if(!before.has(n)) arr.push(n); });
    all.forEach(n=>{
      const cs=getComputedStyle(n);
      if(cs.visibility!=='hidden' && cs.display!=='none' && !arr.includes(n)) arr.push(n);
    });
    return arr;
  }
  async function openTooltipAndRead(trigger, timeoutMs=850){
    if(!trigger) return '';
    const before=snapshotTooltips();
    try { trigger.dispatchEvent(new Event('pointerenter',{bubbles:true})); } catch{}
    try { trigger.dispatchEvent(new Event('mouseenter',{bubbles:true})); } catch{}
    try { trigger.dispatchEvent(new Event('mouseover',{bubbles:true})); } catch{}
    try { trigger.focus?.(); trigger.dispatchEvent(new Event('focusin',{bubbles:true})); } catch{}
    const start=Date.now(); let text='';
    while(Date.now()-start<timeoutMs){
      await sleep(60);
      const tips=newTooltipsSince(before);
      if(tips.length){
        for(const tip of tips){
          const t=(tip.innerText||tip.textContent||'').trim();
          if(t) text += (text?'\n':'') + t;
        }
        if(text) break;
      }
    }
    try { trigger.dispatchEvent(new Event('mouseleave',{bubbles:true})); } catch{}
    try { trigger.dispatchEvent(new Event('pointerleave',{bubbles:true})); } catch{}
    try { trigger.blur?.(); trigger.dispatchEvent(new Event('focusout',{bubbles:true})); } catch{}
    return text;
  }
  function findLabelAndTrigger(card, re){
    const labelNode = findLabel(card, re);
    if(!labelNode) return null;
    const scope=labelNode.closest('section,div,li,article')||labelNode.parentElement||card;
    const triggers=[...scope.querySelectorAll('button,[role="button"],[tabindex],svg,[class*="swatch"],[class*="chip"],[data-qa*="paint"],[data-qa*="interior"],[data-qa*="wheel"],[data-qa*="wheels"]')];
    return triggers.find(el=>{
      const r=el.getBoundingClientRect(); const cs=getComputedStyle(el);
      return r.width>8 && r.height>8 && cs.visibility!=='hidden' && cs.display!=='none';
    })||null;
  }

  function parseOptionsFromCard(card){
    const img = card.querySelector('img.result-image.full[src*="options="]') ||
                card.querySelector('img[src*="options="]') ||
                card.querySelector('img[class*="result"][src*="options="]');
    if(!img) return { codes:[], map:{} };
    const m = img.src.match(/options=([^&]+)/);
    if(!m) return { codes:[], map:{} };
    const raw = decodeURIComponent(m[1]);
    const codes = raw.split(',').map(s=>s.trim()).filter(Boolean);
    const map = Object.fromEntries(codes.map(c=>[c,1]));
    return { codes, map, imgSrc: img.src };
  }
  function decodeByCodes(map){
    let interior = map['$IPW8'] ? 'Black and White Interior' : 'All Black Interior';
    let wheel = map['$WY20'] ? '20' : map['$WY19'] ? '19' : map['$WY18'] ? '18' : '';
    let exterior = '';
    if (map['$PN01'] || map['$PPSW']) exterior = 'Pearl White Multi-Coat';
    else if (map['$PR01'] || map['$PPMR']) exterior = 'Ultra Red';
    else if (map['$PMNG'] || map['$PMNG1']) exterior = 'Quicksilver';
    else if (map['$PB01'] || map['$PPSB']) exterior = 'Deep Blue Metallic';
    else if (map['$PMSG'] || map['$PMNG2'] || map['$PS01']) exterior = 'Stealth Grey';
    else if (map['$PN00'] || map['$PBSB'] || map['$PMBL']) exterior = 'Diamond Black';
    return { exterior, interior, wheel };
  }

  function normalizeExterior(s){
    const t=(s||'').toLowerCase();
    if (/quicksilver/.test(t)) return 'Quicksilver';
    if (/ultra\s*red/.test(t)) return 'Ultra Red';
    if (/\bstealth\b|\bgray\b|\bgrey\b/.test(t)) return 'Stealth Grey';
    if (/\bpearl\b.*\bwhite\b/.test(t)) return 'Pearl White Multi-Coat';
    if (/\bdeep\b.*\bblue\b/.test(t)) return 'Deep Blue Metallic';
    if (/\bblack\b/.test(t)) return 'Diamond Black';
    return '';
  }
  function normalizeInterior(s){
    const t=(s||'').toLowerCase();
    if (/black\s*(?:&|and|\/)\s*white/.test(t)) return 'Black and White Interior';
    return 'All Black Interior';
  }
  async function readExterior(card){
    const sel = findSelectedInGroup(card, GROUPS.paint);
    const t1 = canon(attrOrText(sel));
    if (t1 && /grey|gray|white|blue|black|quicksilver|ultra\s*red/i.test(t1)) return normalizeExterior(t1);
    const tip = await openTooltipAndRead(findLabelAndTrigger(card, GROUPS.paint), 950);
    if (tip) {
      const line = tip.split('\n').find(x=>/grey|gray|white|blue|black|quicksilver|ultra\s*red/i.test(x));
      if(line) return normalizeExterior(line);
    }
    const {map} = parseOptionsFromCard(card);
    return decodeByCodes(map).exterior || '';
  }
  async function readInterior(card){
    const sel = findSelectedInGroup(card, GROUPS.interior);
    const t1 = canon(attrOrText(sel));
    if (t1 && /(all\s*black|black\s*(?:&|and|\/)\s*white)/i.test(t1)) return normalizeInterior(t1);
    const tip = await openTooltipAndRead(findLabelAndTrigger(card, GROUPS.interior), 950);
    if (tip) {
      const line = tip.split('\n').find(x=>/(all\s*black|black\s*(?:&|and|\/)\s*white)/i.test(x));
      if(line) return normalizeInterior(line);
    }
    const {map} = parseOptionsFromCard(card);
    return decodeByCodes(map).interior || '';
  }
  async function readWheels(card){
    const sel = findSelectedInGroup(card, GROUPS.wheels);
    const t1 = canon(attrOrText(sel));
    let m = t1 && t1.match(/\b(18|19|20)\b/); if(m) return m[1];
    const tip = await openTooltipAndRead(findLabelAndTrigger(card, GROUPS.wheels), 850);
    m = tip && tip.match(/\b(18|19|20)\b/); if(m) return m[1];
    const {map} = parseOptionsFromCard(card);
    return decodeByCodes(map).wheel || '';
  }

  function readDrivetrain(card){
    const txt = (card.innerText||card.textContent||'').replace(/\s+/g,' ').toLowerCase();
    if (/\ball[\W_]*wheel\s*drive\b/.test(txt) || /\bdual\s*motor\b/.test(txt)) return 'AWD';
    if (/\brear[\W_]*wheel\s*drive\b/.test(txt)) return 'RWD';
    return '';
  }

  async function extractOne(card){
    const [exterior, interior, wheel] = await Promise.all([
      readExterior(card), readInterior(card), readWheels(card)
    ]);
    const dt = readDrivetrain(card);
    return { exterior, interior, wheel, dt };
  }

  async function reportOnce(){
    if (__reporting) return;
    __reporting = true;
    try{
      window.scrollTo({top:0,behavior:'instant'}); await sleep(120);
      window.scrollBy({top:Math.min(1200, Math.floor(window.innerHeight*0.9))}); await sleep(220);
      window.scrollTo({top:0,behavior:'instant'}); await sleep(120);

      const cards = getCards();
      const rows=[];
      for(const c of cards){
        const r = await extractOne(c);
        if (r.exterior || r.interior || r.wheel) rows.push(r);
      }

      if(rows.length>0){
        const line = r => {
          const tag = r.dt ? `【${r.dt}】` : '';
          const ext = EXT_CN[r.exterior] || '—';
          const intr= INT_CN[r.interior] || '—';
          const wh  = r.wheel || '—';
          return `${tag}外：${ext} 内：${intr} 轮：${wh}`;
        };
        const body = rows.map((r,i)=>`${i+1}. ${line(r)}`).join('\n');
        pushChunked(`当前有 ${rows.length} 辆`, body);
      }
      const el=document.getElementById('tir-cars'); if(el) el.textContent=String(rows.length);
    } finally { __reporting=false; }
  }
  function pushChunked(title, text){
    const MAX=900;
    if(text.length<=MAX){ notify({title, message:text, url:location.href, url_title:'打开库存页'}); return; }
    const lines=text.split('\n'); let buf='',idx=1;
    for(const ln of lines){
      if((buf+ln+'\n').length>MAX){
        notify({title:`${title}（${idx}）`, message:buf.trimEnd(), url:location.href, url_title:'打开库存页'}); buf=''; idx++;
      }
      buf += ln+'\n';
    }
    if(buf) notify({title:`${title}（${idx}）`, message:buf.trimEnd(), url:location.href, url_title:'打开库存页'});
  }

  function schedRefresh(){
    if(!rfOn){ clearTimeout(refreshTimer); clearInterval(etaTimer); refreshTimer=etaTimer=null; nextAt=0; updETA(); return; }
    clearTimeout(refreshTimer); clearInterval(etaTimer);
    const s=randRefreshSec(rfMin, rfMax); nextAt=Date.now()+s*1000; updETA();
    refreshTimer=setTimeout(()=>{ if(running && !document.hidden) location.reload(); else schedRefresh(); }, s*1000);
    etaTimer=setInterval(updETA, 1000);
  }
  function updETA(){ const el=document.getElementById('tir-refresh-eta'); if(!el) return; el.textContent = nextAt? Math.max(0,Math.floor((nextAt-Date.now())/1000))+'s' : '—'; }

  function panel(){
    GM_addStyle(`
      .tir-panel{position:fixed;right:16px;bottom:16px;z-index:2147483647;background:rgba(255,255,255,.97);color:#111;padding:12px;border-radius:12px;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;box-shadow:0 10px 30px rgba(0,0,0,.18);width:360px;border:1px solid #e5e7eb;transition:transform .2s ease, opacity .2s ease}
      .tir-panel h4{margin:0 0 8px;font-size:14px;font-weight:800;color:#111;display:flex;align-items:center;justify-content:space-between}
      .tir-row{display:flex;align-items:center;justify-content:space-between;margin:8px 0;font-size:12px;color:#111;gap:8px}
      .tir-row input{width:120px;padding:6px 8px;border-radius:8px;border:1px solid #d1d5db;background:#fff;color:#111}
      .tir-btn{display:inline-flex;align-items:center;justify-content:center;border:1px solid #d1d5db;padding:7px 12px;border-radius:10px;background:#f3f4f6;color:#111;cursor:pointer;font-size:12px}
      .tir-btn:hover{background:#e5e7eb}
      .tir-badge{font-weight:800}
      .tir-col{display:flex;gap:6px;align-items:center}
      .tir-muted{color:#6b7280;font-size:12px;line-height:1.4}
      .tir-minibar{position:fixed;right:16px;bottom:16px;z-index:2147483647;background:rgba(255,255,255,.97);border:1px solid #e5e7eb;border-radius:999px;padding:8px 12px;box-shadow:0 10px 30px rgba(0,0,0,.18);cursor:pointer;font-size:12px;color:#111;display:none;align-items:center;gap:8px}
      .tir-minibar-show{display:inline-flex}
      .tir-icon-btn{border:none;background:transparent;cursor:pointer;padding:4px 8px;border-radius:8px}
      .tir-icon-btn:hover{background:#f3f4f6}
      .tir-input-wide{width:210px}
      .tir-ref-box{display:flex;align-items:center;gap:8px}
      .tir-ref-url{font-size:12px;color:#111;word-break:break-all}
    `);

    const box=document.createElement('div');
    box.className='tir-panel';
    box.innerHTML=`
      <h4>
        <span>特斯拉库存播报（颜色+轮毂+AWD/RWD）</span>
        <button id="tir-collapse" class="tir-icon-btn" title="收起/展开">—</button>
      </h4>

      <div class="tir-row"><span>状态</span><span id="tir-status" class="tir-badge">运行中</span></div>

      <div class="tir-row"><span>播报间隔（秒）</span><span class="tir-col"><input id="tir-sec" type="number" min="10" step="5" value="${reportSec}"><button id="tir-apply" class="tir-btn">应用</button></span></div>

      <div class="tir-row"><span class="tir-col"><label for="tir-rf">自动刷新</label><input id="tir-rf" type="checkbox" ${rfOn?'checked':''}></span><span>下次刷新：<span id="tir-refresh-eta" class="tir-badge">—</span></span></div>

      <div class="tir-row"><span>刷新范围（秒）</span><span class="tir-col"><input id="tir-min" type="number" min="10" step="5" value="${rfMin}"><input id="tir-max" type="number" min="20" step="5" value="${rfMax}"><button id="tir-rf-apply" class="tir-btn">应用</button></span></div>

      <div class="tir-row"><span>最近解析数量</span><span id="tir-cars" class="tir-badge">-</span></div>

      <div class="tir-row" style="align-items:flex-start;">
        <span>支持作者</span>
        <div style="display:flex;flex-direction:column;gap:6px;max-width:240px;">
          <div class="tir-muted">如果插件对你有帮助，希望能使用我的邀请码下单，可以领取额外三个月FSD（价值297美元）。</div>
          <div class="tir-ref-box">
            <span class="tir-ref-url">${INVITE_URL}</span>
            <button id="tir-copy" class="tir-btn">复制邀请码</button>
          </div>
        </div>
      </div>

      <div class="tir-row"><span>Pushover User</span><span class="tir-col"><input id="tir-user" class="tir-input-wide" type="text" placeholder="必填：你的 User Key"></span></div>
      <div class="tir-row"><span>Pushover Token</span><span class="tir-col"><input id="tir-token" class="tir-input-wide" type="text" placeholder="必填：你的 API Token/Key"></span></div>
      <div class="tir-row"><span></span><span class="tir-col"><button id="tir-save-push" class="tir-btn">保存推送配置</button></span></div>

      <div class="tir-row" style="gap:8px;">
        <button id="tir-toggle" class="tir-btn" style="flex:1;">暂停</button>
        <button id="tir-now" class="tir-btn" style="flex:1;">立即播报</button>
        <button id="tir-openinv" class="tir-btn" style="flex:1;">打开库存页</button>
      </div>
    `;
    document.body.appendChild(box);

    const mini=document.createElement('div');
    mini.className='tir-minibar'; mini.id='tir-mini';
    mini.innerHTML=`<span>库存播报</span><button id="tir-expand" class="tir-btn">展开</button>`;
    document.body.appendChild(mini);

    const savedUser  = GM_getValue(KS.push_user,'');
    const savedToken = GM_getValue(KS.push_token,'');
    if(savedUser)  document.getElementById('tir-user').value  = savedUser;
    if(savedToken) document.getElementById('tir-token').value = savedToken;

    document.getElementById('tir-apply').addEventListener('click', ()=>{
      const v=+document.getElementById('tir-sec').value;
      if(isFinite(v)&&v>=10){ reportSec=Math.floor(v); GM_setValue(KS.report,String(reportSec)); if(running){ clearInterval(reportTimer); reportTimer=setInterval(()=>reportOnce(), Math.max(10,reportSec)*1000); } }
    });
    document.getElementById('tir-rf').addEventListener('change', e=>{ rfOn=e.target.checked; GM_setValue(KS.rf_on, rfOn?'1':'0'); schedRefresh(); });
    document.getElementById('tir-rf-apply').addEventListener('click', ()=>{
      const a=clamp(Math.floor(+document.getElementById('tir-min').value||10),10,3600);
      const b=clamp(Math.floor(+document.getElementById('tir-max').value||30),20,7200);
      rfMin=Math.min(a,b-5); rfMax=Math.max(b,rfMin+5);
      GM_setValue(KS.rf_min,String(rfMin)); GM_setValue(KS.rf_max,String(rfMax)); schedRefresh();
    });
    document.getElementById('tir-toggle').addEventListener('click', ()=>{
      running=!running; document.getElementById('tir-status').textContent=running?'运行中':'已暂停';
      if(running){ reportTimer=setInterval(()=>reportOnce(), Math.max(10,reportSec)*1000); schedRefresh(); }
      else { clearInterval(reportTimer); clearTimeout(refreshTimer); clearInterval(etaTimer); }
    });
    document.getElementById('tir-now').addEventListener('click', ()=>reportOnce());

    document.getElementById('tir-openinv').addEventListener('click', ()=>{
      window.open(INVENTORY_URL, '_blank');
    });

    document.getElementById('tir-copy').addEventListener('click', async ()=>{
      try{
        if(navigator.clipboard && navigator.clipboard.writeText){ await navigator.clipboard.writeText(INVITE_URL); }
        else { const ta=document.createElement('textarea'); ta.value=INVITE_URL; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
        toast('邀请码已复制✅');
      }catch(e){ toast('复制失败，请手动选择复制'); }
    });

    document.getElementById('tir-save-push').addEventListener('click', ()=>{
      const u = (document.getElementById('tir-user').value||'').trim();
      const t = (document.getElementById('tir-token').value||'').trim();
      GM_setValue(KS.push_user, u);
      GM_setValue(KS.push_token, t);
      toast('Pushover 配置已保存。后续推送将使用该配置。');
    });

    function applyCollapseUI(){
      const box = document.querySelector('.tir-panel');
      if(panelMin){
        box.style.opacity='0'; box.style.pointerEvents='none'; box.style.transform='translateY(10px)';
        mini.classList.add('tir-minibar-show');
      }else{
        box.style.opacity='1'; box.style.pointerEvents='auto'; box.style.transform='translateY(0)';
        mini.classList.remove('tir-minibar-show');
      }
    }
    document.getElementById('tir-collapse').addEventListener('click', ()=>{
      panelMin = !panelMin; GM_setValue(KS.panel_min, panelMin?'1':'0'); applyCollapseUI();
    });
    document.getElementById('tir-expand').addEventListener('click', ()=>{
      panelMin=false; GM_setValue(KS.panel_min,'0'); applyCollapseUI();
    });
    applyCollapseUI();
  }

  function toast(msg){
    const t=document.createElement('div');
    t.style.cssText='position:fixed;right:16px;bottom:16px;z-index:2147483647;background:rgba(17,17,17,.9);color:#fff;padding:10px 14px;border-radius:10px;font-size:12px;box-shadow:0 10px 30px rgba(0,0,0,.25)';
    t.textContent=msg;
    document.body.appendChild(t);
    setTimeout(()=>{ t.style.transition='opacity .2s ease'; t.style.opacity='0'; setTimeout(()=>t.remove(),200); }, 1400);
  }

  function bootNotifyOnce(){
    const KEY='tir_boot_notified_once';
    if (sessionStorage.getItem(KEY) === '1') return;
    sessionStorage.setItem(KEY, '1');
    notify({ title:'插件已启动', message:`时间：${nowStr()}\n页面：${location.pathname}${location.search}`, url:location.href, url_title:'打开库存页' });
  }

  function init(){
    if(!/\/inventory\//i.test(location.pathname)) return;
    panel();
    bootNotifyOnce();
    setTimeout(()=>reportOnce(), 800);
    reportTimer=setInterval(()=>reportOnce(), Math.max(10,reportSec)*1000);
    schedRefresh();
    let last=location.href;
    setInterval(()=>{ if(location.href!==last){ last=location.href; setTimeout(()=>reportOnce(),800); schedRefresh(); } }, 800);
    document.addEventListener('visibilitychange', schedRefresh);
  }

  if(document.readyState==='complete'||document.readyState==='interactive') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
