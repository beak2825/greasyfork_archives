// ==UserScript==
// @name         Duolingo Extractor v3.9
// @namespace    http://tampermonkey.net/
// @version      3.9
// @license MIT
// @description  Capture Duolingo sentences, export XLSX with dynamic unit title, DeepL/Google links, session counting, draggable UI, auto-clear, and manual update
// @match        https://www.duolingo.com/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/555063/Duolingo%20Extractor%20v39.user.js
// @updateURL https://update.greasyfork.org/scripts/555063/Duolingo%20Extractor%20v39.meta.js
// ==/UserScript==

(function(){
'use strict';

/* -------------------------
   STORAGE / CONFIG
-------------------------*/
const STORAGE_KEY = 'duo_sents_v39';
const CONFIG_KEY  = 'duo_sents_cfg_v39';
const SESSION_KEY = 'duo_sess_ids_v39';
const TITLE_KEY   = 'duo_unit_title_v39';

let collectedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let config = JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}');
if(typeof config.lessons !== 'number') config.lessons = 5;
if(typeof config.locked === 'undefined') config.locked = false;

let lessonCounter = 0;
let lessonSessions = new Set(JSON.parse(localStorage.getItem(SESSION_KEY) || '[]'));
let currentUnitTitle = localStorage.getItem(TITLE_KEY) || null;

const DEEPL_SUPPORTED = new Set(['de','en','fr','es','it','nl','pl','pt','ru','ja','zh']);

/* -------------------------
   UTILS
-------------------------*/
function saveAll(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collectedData));
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  localStorage.setItem(SESSION_KEY, JSON.stringify([...lessonSessions]));
  if(currentUnitTitle) localStorage.setItem(TITLE_KEY, currentUnitTitle);
}

function cleanFilename(name){
  // replace camelcase, remove invalid chars, trim
  return name.replace(/([a-z])([A-Z])/g,'$1 $2')
             .replace(/[<>:"/\\|?*\x00-\x1F]/g,'')
             .trim()
             .slice(0,200);
}

function detectLangs(){
  const guide = document.querySelector('div.PsNCe a[href*="/guidebook/"]');
  let learn = 'de';
  if(guide && guide.href){
    const m = guide.href.match(/\/guidebook\/([a-z]{2})\//i);
    if(m) learn = m[1].toLowerCase();
  }
  const ui = (document.documentElement.lang || navigator.language || 'en').slice(0,2).toLowerCase();
  return { source: learn, target: ui };
}

function translateLink(src,tgt,text){
  const enc = encodeURIComponent(text);
  return DEEPL_SUPPORTED.has(src)&&DEEPL_SUPPORTED.has(tgt)
    ? `https://www.deepl.com/translator#${src}/${tgt}/${enc}`
    : `https://translate.google.com/?sl=${src}&tl=${tgt}&text=${enc}&op=translate`;
}

function ttsLink(src,text){
  const t = encodeURIComponent(text);
  return DEEPL_SUPPORTED.has(src)
    ? `https://www.deepl.com/translator#${src}/${src}/${t}`
    : `https://translate.google.com/?sl=${src}&tl=${src}&text=${t}&op=translate`;
}

/* -------------------------
   EXPORT XLSX
-------------------------*/
function exportXLSX(autoClear=false){
  if(!window.XLSX) return alert('❌ XLSX library not loaded.');
  if(!collectedData.length) return alert('⚠️ No sentences captured yet.');

  const langs = detectLangs();
  const rows = [['Source','Target','Translate 🌐','Listen 🔊']];
  collectedData.forEach(s=>{
    const linkT = translateLink(langs.source,langs.target,s.source);
    const linkL = ttsLink(langs.source,s.source);
    rows.push([s.source,s.target,{f:`HYPERLINK("${linkT}","🌐 Translate")`},{f:`HYPERLINK("${linkL}","🔊 Listen")`}]);
    rows.push(['','','','']);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = rows[0].map((_,i)=>({wch:Math.max(...rows.map(r=>(r[i]?.length||10)))+2}));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,'Duolingo');

  // filename with space between section/unit and title
  const filename = cleanFilename(currentUnitTitle || 'Unit') + '.xlsx';
  XLSX.writeFile(wb,filename);
  if(autoClear){ collectedData=[]; lessonCounter=0; lessonSessions.clear(); saveAll(); updateUI(); }
}

/* -------------------------
   NETWORK HOOK
-------------------------*/
function handleSessionData(data){
  if(!data?.challenges) return;
  const id = data.sessionId || data.id || Math.random().toString(36).slice(2);
  if(lessonSessions.has(id)) return;
  lessonSessions.add(id);

  data.challenges.forEach(c=>{
    if(c.prompt && c.correctSolutions?.length)
      collectedData.push({session_id:id,source:c.prompt,target:c.correctSolutions.join(' / ')});
    else if(c.displayTokens && c.correctTokens)
      collectedData.push({session_id:id,source:c.displayTokens.map(t=>t.text).join(' '),target:c.correctTokens.map(t=>t.text).join(' ')});
  });

  lessonCounter = lessonSessions.size;
  saveAll();
  updateUI();
  if(config.locked && lessonCounter >= config.lessons) exportXLSX(true);
}

const origFetch = window.fetch;
window.fetch = (...args)=>origFetch(...args).then(r=>{
  try{if(r.url.includes('/sessions')) r.clone().json().then(handleSessionData).catch(()=>{});}catch{}
  return r;
});

const origOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(...args){
  this.addEventListener('load',()=>{
    try{if(this.responseURL.includes('/sessions')) handleSessionData(JSON.parse(this.responseText));}catch{}
  });
  return origOpen.apply(this,args);
};

/* -------------------------
   UNIT TITLE
-------------------------*/
function refreshUnitTitle(){
  const containers = [...document.querySelectorAll('div.PsNCe')];
  let container = containers.find(c=>c.querySelector('h1._3WYpp') && c.querySelector('span.U_xpg'));
  if(!container) return;

  const h1 = container.querySelector('h1._3WYpp');
  const span = container.querySelector('span.U_xpg');
  if(!h1 || !span) return;

  const sectionUnitMatch = h1.innerText.match(/SECTION\s*(\d+),\s*UNIT\s*(\d+)/i);
  const su = sectionUnitMatch ? `S${sectionUnitMatch[1]}U${sectionUnitMatch[2]}` : 'Unit';

  // add spaces between words for readability
  let titleText = span.innerText
                     .replace(/[\s<>:"/\\|?*\x00-\x1F]/g,'')   // remove invalid chars
                     .replace(/([a-z])([A-Z])/g,'$1 $2')       // separate camelCase
                     .replace(/([A-Z]{2,})([A-Z][a-z])/g,'$1 $2') // separate consecutive uppercase
                     .trim();
  currentUnitTitle = `${su} ${titleText}`;
  localStorage.setItem(TITLE_KEY,currentUnitTitle);
}

/* -------------------------
   UI
-------------------------*/
let ui=null;
function createUI(){
  if(ui) return;
  ui=document.createElement('div');
  ui.id='duo-logger-ui';
  Object.assign(ui.style,{
    position:'fixed',top:'20px',left:'20px',zIndex:'999999',minWidth:'240px',
    background:'rgba(18,18,18,0.95)',color:'#fff',borderRadius:'10px',
    padding:'10px',fontFamily:'Inter,Arial,sans-serif',fontSize:'13px',
    boxShadow:'0 6px 18px rgba(0,0,0,0.4)'
  });
  ui.innerHTML=`
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
      <strong>Duolingo Extractor</strong>
      <button id="duo-lock" title="${config.locked?'Auto-export locked':'Auto-export unlocked'}" style="margin-left:auto;padding:4px 6px;border-radius:6px;cursor:pointer;font-size:16px;">${config.locked?'🛑':'✅'}</button>
    </div>
    <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
      <label>Lessons</label>
      <input id="duo-lessons" type="number" min="1" value="${config.lessons}" style="flex:1;padding:6px;border-radius:6px;border:none;background:#111;color:#fff"/>
    </div>
    <div style="display:flex;gap:8px;margin-bottom:8px;">
      <button id="duo-export" style="flex:1;padding:8px;border:none;border-radius:8px;background:#2d8f2d;cursor:pointer">⬇ Export</button>
      <button id="duo-clear" style="padding:8px;border:none;border-radius:8px;background:#b33;cursor:pointer">🧹 Clear</button>
      <button id="duo-update" style="padding:8px;border:none;border-radius:8px;background:#448aff;cursor:pointer">🔁 Title</button>
    </div>
    <div id="duo-info" style="font-size:12px;color:#ccc;">
      Unit: ${currentUnitTitle||'-'}<br>Lessons done: ${lessonCounter} / ${config.lessons}<br>Captured: ${collectedData.length}
    </div>
  `;
  document.body.appendChild(ui);

  const lockBtn = document.getElementById('duo-lock');
  lockBtn.onclick=()=>{ config.locked=!config.locked; saveAll(); lockBtn.textContent=config.locked?'🛑':'✅'; lockBtn.title=config.locked?'Auto-export locked':'Auto-export unlocked'; };
  document.getElementById('duo-lessons').onchange=()=>{ config.lessons=Number(document.getElementById('duo-lessons').value)||1; saveAll(); };
  document.getElementById('duo-export').onclick=()=>exportXLSX(true);
  document.getElementById('duo-clear').onclick=()=>{ if(confirm('Clear all captured sentences?')){ collectedData=[]; lessonCounter=0; lessonSessions.clear(); saveAll(); updateUI(); } };
  document.getElementById('duo-update').onclick=()=>{ refreshUnitTitle(); updateUI(); };

  // draggable
  let drag=false,startX=0,startY=0,startL=0,startT=0;
  ui.addEventListener('mousedown',e=>{ if(['BUTTON','INPUT'].includes(e.target.tagName)) return; drag=true; startX=e.clientX; startY=e.clientY; const rect=ui.getBoundingClientRect(); startL=rect.left; startT=rect.top; ui.style.transition='none'; });
  window.addEventListener('mousemove',e=>{if(!drag) return; ui.style.left=Math.max(6,startL+e.clientX-startX)+'px'; ui.style.top=Math.max(6,startT+e.clientY-startY)+'px';});
  window.addEventListener('mouseup',()=>{drag=false; ui.style.transition='';});
}

function updateUI(){
  refreshUnitTitle();
  const info = document.getElementById('duo-info');
  if(info) info.innerHTML=`Unit: ${currentUnitTitle||'-'}<br>Lessons done: ${lessonCounter} / ${config.lessons}<br>Captured: ${collectedData.length}`;
}

/* -------------------------
   INIT
-------------------------*/
setTimeout(createUI,1200);
setInterval(()=>{ if(!document.getElementById('duo-logger-ui')) createUI(); updateUI(); },2000);

console.log('✅ Duolingo Extractor v3.9 loaded — dynamic unit, XLSX export, manual update, session capture.');
})();
