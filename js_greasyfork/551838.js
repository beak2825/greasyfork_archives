// ==UserScript==
// @name         Torn — Recent Mug Warning 
// @namespace    https://torn.com/
// @version      1.92
// @description  shows mug warnings. settings accessible from items.
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551838/Torn%20%E2%80%94%20Recent%20Mug%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/551838/Torn%20%E2%80%94%20Recent%20Mug%20Warning.meta.js
// ==/UserScript==

(async function() {
'use strict';

// --------------------
// Own Profile Highlight
// --------------------
const OWN_API_KEY_STORAGE = 'torn_self_highlight_api_key';
const API_USER_URL = 'https://api.torn.com/user/?selections=basic&key=';

async function getOwnId() {
    let apiKey = localStorage.getItem(OWN_API_KEY_STORAGE);
    if (!apiKey) {
        apiKey = prompt("Enter your Torn API key for self-profile highlight:");
        if (!apiKey) return null;
        localStorage.setItem(OWN_API_KEY_STORAGE, apiKey);
    }
    try {
        const resp = await fetch(API_USER_URL + encodeURIComponent(apiKey), { cache: 'no-store' });
        if (!resp.ok) return null;
        const data = await resp.json();
        return data && (data.player_id || data.user_id) ? String(data.player_id || data.user_id) : null;
    } catch { return null; }
}

function getProfileIdFromUrl() {
    try {
        const u = new URL(window.location.href);
        return u.searchParams.get('XID') || u.searchParams.get('ID') || null;
    } catch { return null; }
}

const ownId = await getOwnId();
const profileId = getProfileIdFromUrl();

if (profileId && ownId && profileId === ownId) {
    // Own profile code: badge and STOP
    const badge = document.createElement('div');
    badge.innerText = '✅ This is you';
    Object.assign(badge.style, {
        backgroundColor: 'green',
        color: 'white',
        fontWeight: '700',
        padding: '4px 8px',
        borderRadius: '6px',
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: '999999',
        fontSize: '14px'
    });
    document.body.appendChild(badge);
    return; // STOP here: do not run mug warning script
}

// --------------------
// Mug Warning Script (runs only if NOT on own profile)
// --------------------
const STORE_KEY='torn_api_mug_warn_v3';
const IGNORED_KEY='torn_api_mug_ignore_profiles';
const MUG_INFO_KEY='torn_api_mug_info';
const COLOR_BG_KEY='torn_api_mug_color_bg';
const COLOR_TXT_KEY='torn_api_mug_color_txt';
const HOURS_KEY='torn_api_mug_hours';
const DEFAULT_HOURS=24;

// Settings menu colors
const SETTINGS_BG_KEY='torn_settings_bg';
const SETTINGS_TXT_KEY='torn_settings_txt';
const BUTTON_TXT_KEY='torn_settings_btn_txt';

const API_MUG_URL='https://api.torn.com/user/?selections=attacks&key=';

// ---- Helper functions ----
function getStoredKey(){ try{return localStorage.getItem(STORE_KEY);}catch{return null;} }
function getIgnoredProfiles(){ try{ return JSON.parse(localStorage.getItem(IGNORED_KEY))||{}; }catch{return {};} }
function ignoreProfile(id){ const s=getIgnoredProfiles(); s[id]=true; localStorage.setItem(IGNORED_KEY,JSON.stringify(s)); }
function unignoreProfile(id){ const s=getIgnoredProfiles(); delete s[id]; localStorage.setItem(IGNORED_KEY,JSON.stringify(s)); }
function isIgnored(id){ return !!getIgnoredProfiles()[id]; }
function safeParseInt(n){ const v=parseInt(n); return Number.isFinite(v)?v:null; }
function getAttackTargetIdFromUrl(){ try{const u=new URL(window.location.href);return u.searchParams.get('user2ID')||null;}catch{return null;} }
function isProfilePage(){ return /profiles\.php|profile\.php|pda\.php/.test(location.pathname+location.search); }
function isAttackPage(){ return /loader\.php/.test(location.pathname) && getAttackTargetIdFromUrl(); }

function getColorSettings(){
  return {
    bg: localStorage.getItem(COLOR_BG_KEY) || '#ff4d4d',
    txt: localStorage.getItem(COLOR_TXT_KEY) || '#ffffff'
  };
}
function getHoursSetting(){ return parseInt(localStorage.getItem(HOURS_KEY)) || DEFAULT_HOURS; }
function getSettingsMenuColors(){
  return {
    bg: localStorage.getItem(SETTINGS_BG_KEY) || '#2b2b2b',
    txt: localStorage.getItem(SETTINGS_TXT_KEY) || '#ffffff',
    btnTxt: localStorage.getItem(BUTTON_TXT_KEY) || '#ffffff'
  };
}

// ---- Modal Warning ----
function showModalWarning(profileId, whenIso){
  if(!profileId || isIgnored(profileId)) return;
  if(document.getElementById('api-mug-modal')) return;

  const { bg, txt } = getColorSettings();
  const HOURS=getHoursSetting();

  const overlay=document.createElement('div');
  overlay.id='api-mug-modal';
  Object.assign(overlay.style,{position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999999,padding:'10px',boxSizing:'border-box'});

  const modal=document.createElement('div');
  Object.assign(modal.style,{background:bg,color:txt,padding:'16px',borderRadius:'10px',textAlign:'center',width:'90%',maxWidth:'400px',fontWeight:'700',boxShadow:'0 6px 20px rgba(0,0,0,0.6)',lineHeight:'1.4'});

  const now=Date.now();
  let timeText='unknown';
  let timeColor='#000000';
  if(whenIso){
    const mugTime=Date.parse(whenIso);
    if(!isNaN(mugTime)){
      const diffMs=Math.max(0,now-mugTime);
      const diffHrs=Math.floor(diffMs/3600000);
      const diffMins=Math.floor((diffMs%3600000)/60000);
      timeText=`${diffHrs}h ${diffMins}m ago`;
      if(diffHrs>=12 && diffHrs<HOURS) timeColor='#00ff00';
    }
  }

  modal.innerHTML=`
    <div style="font-size:18px;margin-bottom:8px">⚠️ WARNING</div>
    <div style="font-size:14px;font-weight:600;margin-bottom:10px">You mugged this player within the last ${HOURS} hours</div>
    <div style="font-size:14px">Time since last mug: <span style="font-weight:700;color:${timeColor}">${timeText}</span></div>
  `;

  const buttons=document.createElement('div');
  Object.assign(buttons.style,{display:'flex',justifyContent:'center',marginTop:'16px',gap:'10px'});
  const b1=document.createElement('button'); b1.innerText='Set MugTarget';
  const b2=document.createElement('button'); b2.innerText='Dismiss';
  [b1,b2].forEach(b=>{
    const btnColors=getSettingsMenuColors();
    Object.assign(b.style,{padding:'8px 14px',border:'2px solid '+btnColors.btnTxt,borderRadius:'6px',background:'transparent',color:btnColors.btnTxt,fontWeight:'700',cursor:'pointer'});
    b.onmouseover=()=>{b.style.background=btnColors.btnTxt;b.style.color=btnColors.bg;};
    b.onmouseout=()=>{b.style.background='transparent';b.style.color=btnColors.btnTxt;};
  });
  b1.onclick=()=>{ignoreProfile(profileId);overlay.remove();};
  b2.onclick=()=>overlay.remove();
  buttons.append(b1,b2);
  modal.appendChild(buttons);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

// ---- Mug detection ----
function attackIndicatesMug(a,targetId,selfId){
  if(!a)return false;
  const tid=String(targetId);
  try{
    const text=JSON.stringify(a).toLowerCase();
    if(/mug(g?ed|ging)/.test(text)&&text.includes(tid))return true;
  }catch{}
  return false;
}
function extractTimestampFromAttack(a){
  try{
    if(!a)return null;
    const fields=['time','timestamp','timestamp_ended'];
    for(const f of fields){if(a[f]!==undefined){const t=safeParseInt(a[f]);if(t)return new Date(t*1000).toISOString();}}
  }catch{}
  return null;
}

async function checkProfileWithApi(targetIdOptional){
  const key=getStoredKey(); if(!key)return;
  const HOURS=getHoursSetting();
  const MS_THRESHOLD=HOURS*3600*1000;
  const profileId=targetIdOptional||getProfileIdFromUrl(); if(!profileId)return;

  try{
    const resp=await fetch(API_MUG_URL+encodeURIComponent(key),{cache:'no-store'});
    if(!resp.ok)return;
    const data=await resp.json();
    if(!data||data.error)return;
    const selfId=String(data.player_id||data.user_id||'');
    const attacks=data.attacks?Object.values(data.attacks):[];
    const cutoff=Date.now()-MS_THRESHOLD;
    for(const a of attacks){
      const iso=extractTimestampFromAttack(a);
      const ts=iso?Date.parse(iso):null;
      if(ts && ts>=cutoff && attackIndicatesMug(a,profileId,selfId)){
        showModalWarning(profileId,iso);
        return;
      }
    }
  }catch{}
}

// ---- Mug Targets Modal (matches settings modal styling) ----
function showMugTargetsModal(onClose){
  const { bg, txt, btnTxt } = getSettingsMenuColors();
  const overlay=document.createElement('div');
  Object.assign(overlay.style,{
    position:'fixed',top:0,left:0,width:'100%',height:'100%',
    background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',
    justifyContent:'center',zIndex:9999999
  });

  const box=document.createElement('div');
  Object.assign(box.style,{
    background:bg,
    color:txt,
    padding:'20px',
    borderRadius:'12px',
    width:'350px',
    fontSize:'14px',
    lineHeight:'1.5',
    boxShadow:'0 6px 20px rgba(0,0,0,0.5)',
    textAlign:'center'
  });
  box.innerHTML='<h3 style="margin-top:0;">🗂️ Mug Targets</h3>';

  const list=document.createElement('div');
  Object.assign(list.style,{maxHeight:'200px',overflowY:'auto',marginBottom:'10px',textAlign:'left'});

  function refreshList(){
    list.innerHTML='';
    const data=getIgnoredProfiles();
    const ids = Object.keys(data);
    if(ids.length === 0){
      const empty = document.createElement('div');
      empty.innerText = 'No mug targets saved.';
      list.appendChild(empty);
      return;
    }
    ids.forEach(id=>{
      const row = document.createElement('div');
      row.style.margin = '6px 0';
      // link
      const link = document.createElement('a');
      link.href = 'https://www.torn.com/profiles.php?XID='+id;
      link.target = '_blank';
      link.innerText = id;
      link.style.color = txt;
      link.style.fontWeight = '700';
      // remove button
      const removeBtn = document.createElement('button');
      removeBtn.innerText = 'Remove';
      Object.assign(removeBtn.style,{
        marginLeft:'8px',padding:'4px 8px',cursor:'pointer',
        color:btnTxt,border:'2px solid '+btnTxt,borderRadius:'6px',background:'transparent'
      });
      removeBtn.onmouseover = ()=>{ removeBtn.style.background = btnTxt; removeBtn.style.color = bg; };
      removeBtn.onmouseout = ()=>{ removeBtn.style.background = 'transparent'; removeBtn.style.color = btnTxt; };
      removeBtn.onclick = ()=>{ unignoreProfile(id); refreshList(); };
      row.append(link, removeBtn);
      list.appendChild(row);
    });
  }

  refreshList();
  box.appendChild(list);

  const addInput=document.createElement('input');
  addInput.placeholder='Add ID manually';
  addInput.style.width='100%';
  addInput.style.marginBottom='8px';
  addInput.style.boxSizing='border-box';
  box.appendChild(addInput);

  const addBtn=document.createElement('button');
  addBtn.innerText='Add';
  const closeBtn=document.createElement('button');
  closeBtn.innerText='Close';
  closeBtn.style.marginLeft='6px';

  [addBtn, closeBtn].forEach(b=>{
    Object.assign(b.style,{
      padding:'6px 12px',border:'2px solid '+btnTxt,borderRadius:'6px',
      background:'transparent',color:btnTxt,cursor:'pointer',marginTop:'8px'
    });
    b.onmouseover=()=>{b.style.background=btnTxt;b.style.color=bg;};
    b.onmouseout=()=>{b.style.background='transparent';b.style.color=btnTxt;};
  });

  addBtn.onclick=()=>{
    const val=addInput.value.trim();
    if(!val) return;
    const s = getIgnoredProfiles();
    s[val] = true;
    localStorage.setItem(IGNORED_KEY, JSON.stringify(s));
    addInput.value = '';
    refreshList();
  };

  closeBtn.onclick=()=>{
    overlay.remove();
    if(typeof onClose === 'function') onClose();
  };

  box.append(addBtn, document.createElement('br'), closeBtn);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

// ---- Settings ----
function styleButtons(btns, color='#ffffff'){
  btns.forEach(b=>{
    Object.assign(b.style,{
      padding:'6px 12px',
      border:'2px solid '+color,
      borderRadius:'6px',
      cursor:'pointer',
      color:color,
      background:'transparent'
    });
    b.onmouseover=()=>{b.style.background=color;b.style.color='#2b2b2b';};
    b.onmouseout=()=>{b.style.background='transparent';b.style.color=color;};
  });
}

function showSettingsModal(){
  const { bg, txt, btnTxt } = getSettingsMenuColors();
  const HOURS=getHoursSetting();
  const currentKey=getStoredKey()||'';

  const overlay=document.createElement('div');
  Object.assign(overlay.style,{position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999999});

  const box=document.createElement('div');
  Object.assign(box.style,{background:bg,color:txt,padding:'20px',borderRadius:'12px',width:'350px',fontSize:'14px',lineHeight:'1.5',boxShadow:'0 6px 20px rgba(0,0,0,0.5)',textAlign:'center'});

  box.innerHTML=`
    <h3 style="margin-top:0;">⚙️ Mug Warning Settings</h3>
    <label>API Key:</label><br>
    <input type="text" id="apiKeyInput" value="${currentKey}" style="width:100%;margin-bottom:8px;"><br>
    <label>Hours Threshold:</label><br>
    <input type="number" id="hoursInput" value="${HOURS}" style="width:100%;margin-bottom:8px;"><br>
    <label>Modal Background Color:</label><br>
    <input type="color" id="bgColorInput" value="${localStorage.getItem(COLOR_BG_KEY)||'#ff4d4d'}" style="width:100%;margin-bottom:8px;"><br>
    <label>Modal Text Color:</label><br>
    <input type="color" id="txtColorInput" value="${localStorage.getItem(COLOR_TXT_KEY)||'#ffffff'}" style="width:100%;margin-bottom:8px;"><br>
    <label>Settings Menu Background:</label><br>
    <input type="color" id="settingsBgInput" value="${bg}" style="width:100%;margin-bottom:8px;"><br>
    <label>Settings Menu Text:</label><br>
    <input type="color" id="settingsTxtInput" value="${txt}" style="width:100%;margin-bottom:8px;"><br>
    <label>Button Text Color:</label><br>
    <input type="color" id="buttonTxtInput" value="${btnTxt}" style="width:100%;margin-bottom:8px;"><br>
    <hr style="margin:10px 0;">
    <button id="manageTargetsBtn" style="margin-bottom:8px;">Manage Mug Targets</button><br>
    <button id="saveSettingsBtn" style="margin-right:10px;">Save</button>
    <button id="closeSettingsBtn">Close</button>
  `;

  styleButtons(box.querySelectorAll('button'), btnTxt);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  box.querySelector('#saveSettingsBtn').onclick=()=>{ 
      const key=box.querySelector('#apiKeyInput').value.trim();
      if(key) localStorage.setItem(STORE_KEY,key); else localStorage.removeItem(STORE_KEY);
      localStorage.setItem(HOURS_KEY,box.querySelector('#hoursInput').value);
      localStorage.setItem(COLOR_BG_KEY,box.querySelector('#bgColorInput').value);
      localStorage.setItem(COLOR_TXT_KEY,box.querySelector('#txtColorInput').value);
      localStorage.setItem(SETTINGS_BG_KEY, box.querySelector('#settingsBgInput').value);
      localStorage.setItem(SETTINGS_TXT_KEY, box.querySelector('#settingsTxtInput').value);
      localStorage.setItem(BUTTON_TXT_KEY, box.querySelector('#buttonTxtInput').value);
      alert('Settings saved!');
      overlay.remove();
  };
  box.querySelector('#closeSettingsBtn').onclick=()=>overlay.remove();
  box.querySelector('#manageTargetsBtn').onclick=()=>{
    // hide settings overlay, open targets modal; restore settings overlay when targets closed
    overlay.style.display = 'none';
    showMugTargetsModal(()=>{ overlay.style.display = 'flex'; });
  };
}

function insertItemPageSettings(){
  if(!/item\.php/i.test(window.location.href)) return;
  if(document.getElementById('torn-item-settings')) return;
  const btn=document.createElement('button');
  btn.id='torn-item-settings';
  btn.innerText='⚙️ Mug Settings';
  Object.assign(btn.style,{position:'fixed',right:'14px',bottom:'70px',zIndex:9999999,background:'#222',color:'#fff',border:'2px solid #fff',borderRadius:'6px',padding:'6px 12px',cursor:'pointer',fontSize:'14px'});
  btn.onmouseover=()=>{btn.style.background='#fff';btn.style.color='#000';};
  btn.onmouseout=()=>{btn.style.background='#222';btn.style.color='#fff';};
  btn.onclick=showSettingsModal;
  document.body.appendChild(btn);
}

(function ensureSettingsButton(){
  try{ insertItemPageSettings(); }catch{}
  try{
    const mo=new MutationObserver(()=>{ insertItemPageSettings(); });
    mo.observe(document.body,{childList:true,subtree:true});
  }catch{}
  window.addEventListener('popstate',()=>insertItemPageSettings());
  window.addEventListener('hashchange',()=>insertItemPageSettings());
  let lastHref=location.href;
  setInterval(()=>{ if(location.href!==lastHref){ lastHref=location.href; insertItemPageSettings(); lastHref=location.href; } },1000);
})();

// ---- Bootstrap Mug Detection ----
try{
  if(isProfilePage()){
    const observer=new MutationObserver((mutations,obs)=>{
      if(getProfileIdFromUrl()){ checkProfileWithApi(); obs.disconnect(); }
    });
    observer.observe(document.body,{childList:true,subtree:true});
  } else if(isAttackPage()){
    const targetId=getAttackTargetIdFromUrl();
    if(targetId) setTimeout(()=>checkProfileWithApi(targetId),300);
  }
}catch{}
})();
