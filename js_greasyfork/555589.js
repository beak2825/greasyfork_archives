// ==UserScript==
// @name         Universal Structure Logger (All Websites)
// @namespace    https://markg.dev/userscripts/universal-structure-logger
// @version      2.0.0
// @description  Capture HTML + sniff JSON/API on ANY website. GUI always visible. Saves one JSON file for analysis.
// @author       You
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555589/Universal%20Structure%20Logger%20%28All%20Websites%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555589/Universal%20Structure%20Logger%20%28All%20Websites%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const captured = { html:{timestamp:null,title:null,url:null,main:null,scripts:[]}, network:[] };

  /** ---------- utilities ---------- **/
  const tryJSON = s => { try { return JSON.parse(s); } catch { return (s||'').slice(0,4000); } };
  const copy = t => { const ta=document.createElement('textarea');ta.value=t;ta.style.position='fixed';ta.style.right='-9999px';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove(); };
  const flash = msg => { let f=document.getElementById('uFlash'); if(!f){f=document.createElement('div');f.id='uFlash';Object.assign(f.style,{position:'fixed',bottom:'100px',right:'18px',background:'#12b886',color:'#04110e',padding:'8px 10px',borderRadius:'8px',fontWeight:'700',zIndex:2147483647});document.body.appendChild(f);} f.textContent=msg;f.style.display='block';setTimeout(()=>f.style.display='none',1200); };
  const addStyles = () => { if(document.getElementById('uCSS')) return; const s=document.createElement('style');s.id='uCSS';s.textContent=`
    #uHandle{position:fixed;right:14px;bottom:14px;background:#182037;color:#fff;padding:7px 10px;border-radius:10px;cursor:pointer;z-index:2147483647;box-shadow:0 6px 24px rgba(0,0,0,.35);font-family:system-ui,Arial;font-weight:700}
    #uPanel{position:fixed;right:14px;bottom:54px;background:#0b1220;color:#fff;border:1px solid #2b3550;border-radius:12px;padding:10px;width:280px;box-shadow:0 6px 24px rgba(0,0,0,.35);z-index:2147483647;font-family:system-ui,Arial}
    #uPanel .row{display:flex;gap:6px;margin-top:6px;flex-wrap:wrap}
    #uPanel button{flex:1;border:none;padding:8px 10px;border-radius:8px;background:#22305a;color:#fff;cursor:pointer}
    #uPanel button:hover{background:#2d3b7a}
    #uPanel .mini{margin-top:6px;font-size:12px;opacity:.8}
    @media(max-width:600px){#uPanel{width:92vw;left:4vw;right:4vw}#uHandle{right:10px;bottom:10px}}`;document.head.appendChild(s); };

  /** ---------- network hooks ---------- **/
  const _fetch = window.fetch;
  window.fetch = async function(input, init){ const res=await _fetch(input,init); try{handleFetch(input,res.clone());}catch(_){} return res; };
  const _open=XMLHttpRequest.prototype.open,_send=XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open=function(m,u){this.__u=u;return _open.apply(this,arguments);};
  XMLHttpRequest.prototype.send=function(b){this.addEventListener('load',function(){try{handleXHR(this.__u,this);}catch(_){}});return _send.apply(this,arguments);};

  async function handleFetch(input,res){
    const url=(typeof input==='string')?input:(input&&input.url)||'';
    const ct=res.headers.get('content-type')||'';
    const txt=ct.includes('json')?await res.text():'';
    if(shouldKeep(url,txt)){
      captured.network.push({type:'fetch',url,contentType:ct,time:new Date().toISOString(),data:ct.includes('json')?tryJSON(txt):'[non-json]'});
      updCount();
    }
  }
  function handleXHR(url,xhr){
    const ct=(xhr.getResponseHeader&&xhr.getResponseHeader('content-type'))||'';
    const txt=xhr.responseText||'';
    if(shouldKeep(url,txt)){
      captured.network.push({type:'xhr',url,contentType:ct,time:new Date().toISOString(),data:ct.includes('json')?tryJSON(txt):'[non-json]'});
      updCount();
    }
  }
  const shouldKeep=(url,b='')=>/(api|json|media|video|review|data|product|detail)/i.test(url||'') || /(image|video|media|review|asin|variant|data)/i.test(b.slice(0,2000));

  /** ---------- HTML capture ---------- **/
  function captureHTML(){
    const D=document;
    captured.html.timestamp=new Date().toISOString();
    captured.html.title=D.title;
    captured.html.url=location.href;
    captured.html.main=D.body?D.body.outerHTML.slice(0,500000):null;
    captured.html.scripts=Array.from(D.querySelectorAll('script[type="application/json"],script[data-a-state]')).slice(0,40).map((s,i)=>({id:s.id||`json_${i}`,text:(s.textContent||'').slice(0,8000)}));
    flash('HTML captured');
  }

  /** ---------- save ---------- **/
  function saveFile(){
    if(!captured.html.timestamp) captureHTML();
    const blob=new Blob([JSON.stringify(captured,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;a.download=`page_capture_${Date.now()}.json`;
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);
    flash('Saved JSON');
  }

  /** ---------- GUI ---------- **/
  function buildUI(){
    addStyles();
    if(!document.getElementById('uHandle')){
      const h=document.createElement('div');
      h.id='uHandle';h.textContent='CAPTURE • SHOW/HIDE';
      h.onclick=()=>{const p=document.getElementById('uPanel');if(!p){panel();return;}p.style.display=p.style.display==='none'?'':'none';};
      document.body.appendChild(h);
    }
    panel();
  }
  function panel(){
    if(document.getElementById('uPanel')) return;
    const p=document.createElement('div');p.id='uPanel';
    p.innerHTML=`<div style="font-weight:800;letter-spacing:.3px;margin-bottom:6px;font-size:14px">Universal Logger</div>
    <div class="row"><button id="capH">CAPTURE HTML</button><button id="saveJ">SAVE JSON</button></div>
    <div class="row"><button id="copyC">COPY COUNTS</button><button id="copyU">COPY URL</button></div>
    <div class="mini">Intercepted: <span id="netCount">0</span></div>`;
    document.body.appendChild(p);
    p.querySelector('#capH').onclick=captureHTML;
    p.querySelector('#saveJ').onclick=saveFile;
    p.querySelector('#copyC').onclick=()=>{copy(`network: ${captured.network.length}, scripts: ${captured.html.scripts.length}`);flash('Counts copied');};
    p.querySelector('#copyU').onclick=()=>{copy(location.href);flash('URL copied');};
    setInterval(updCount,700);
  }
  const updCount=()=>{const n=document.getElementById('netCount');if(n)n.textContent=String(captured.network.length);};

  /** ---------- boot ---------- **/
  const boot=()=>{if(!document.body)return setTimeout(boot,200);buildUI();};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.addEventListener('load',()=>setTimeout(boot,200),{once:true});
  const _ps=history.pushState,_rs=history.replaceState;
  history.pushState=function(){const r=_ps.apply(this,arguments);setTimeout(boot,200);return r;};
  history.replaceState=function(){const r=_rs.apply(this,arguments);setTimeout(boot,200);return r;};
  new MutationObserver(()=>{if(!document.getElementById('uHandle')||!document.getElementById('uPanel'))boot();}).observe(document.documentElement,{childList:true,subtree:true});

})();
