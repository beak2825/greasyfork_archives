// ==UserScript==
// @name         Torn Faction Shared Enemy List
// @namespace    https://mayhemhub.net/
// @version      1.5
// @author       IAMAPEX [2523988]
// @description  Draggable, resizable faction enemy list with live status.
// @match        https://www.torn.com/*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlHttpRequest
// @grant        GM.xmlHttpRequest
// @connect      mayhemhub.net
// @connect      api.torn.com
// @connect      lol-manager.com
// @downloadURL https://update.greasyfork.org/scripts/554016/Torn%20Faction%20Shared%20Enemy%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/554016/Torn%20Faction%20Shared%20Enemy%20List.meta.js
// ==/UserScript==

(function(){'use strict';const RELAY_URL='https://mayhemhub.net/enemies/relay.php';const PAGE_SIZE_HARD_MAX=5;let PAGE_SIZE=Math.min(PAGE_SIZE_HARD_MAX,parseInt(GM_getValue('tfe_page_size',PAGE_SIZE_HARD_MAX),10)||PAGE_SIZE_HARD_MAX);const REFRESH_MS=60_000;const BSP_CACHE_TTL=30*24*60*60*1000;const BSP_IDENTIFIER='FactionEnemyList';const Z_BASE=2147482000;const GMX=(typeof GM_xmlHttpRequest==='function')?GM_xmlHttpRequest:(typeof GM!=='undefined'&&typeof GM.xmlHttpRequest==='function')?GM.xmlHttpRequest:null;function gmFetch(url,opts={}){return new Promise((resolve,reject)=>{if(!GMX)return reject(new Error('GM XHR unavailable'));const method=(opts.method||'GET').toUpperCase();const headers=Object.assign({'Accept':'application/json, text/plain;q=0.9, */*;q=0.8','Referer':location.href,'Origin':'https://www.torn.com'},(opts.headers||{}));let data=null;if(opts.body!=null){if(opts.body instanceof URLSearchParams){data=opts.body.toString();headers['Content-Type']='application/x-www-form-urlencoded;charset=UTF-8'}else if(typeof opts.body==='string'){data=opts.body}else if(typeof opts.body==='object'){data=JSON.stringify(opts.body);headers['Content-Type']='application/json;charset=UTF-8'}}
GMX({url:(typeof url==='string'?url:url.toString()),method,headers,data,responseType:'text',timeout:opts.timeout||15000,onload:(res)=>resolve({ok:res.status>=200&&res.status<300,status:res.status,text:()=>Promise.resolve(res.responseText),json:()=>Promise.resolve().then(()=>{try{return JSON.parse(res.responseText)}catch{return null}}),}),onerror:()=>reject(new Error('GMXHR error')),ontimeout:()=>reject(new Error('GMXHR timeout')),onabort:()=>reject(new Error('GMXHR abort')),})})}
const K_API_KEY='tfe_api_key';const K_ENEMIES_LOCAL='tfe_local_enemies';const K_BSP_CACHE='tfe_bsp_cache';const K_MINIMIZED='tfe_minimized';const K_PANEL_W='tfe_panel_w';const K_PANEL_H='tfe_panel_h';const K_PANEL_X='tfe_panel_x';const K_PANEL_Y='tfe_panel_y';const K_AUTH_ID='tfe_auth_id';const K_IS_AUTH='tfe_is_auth';const K_EDIT_MODE='tfe_edit_mode';const K_CSRF='tfe_csrf_cached';function loadLocalJSON(key,defVal){try{const raw=GM_getValue(key,'');return raw?JSON.parse(raw):defVal}catch{return defVal}}
function saveLocalJSON(key,val){try{GM_setValue(key,JSON.stringify(val))}catch{}}
function getApiKey(){return(GM_getValue(K_API_KEY,'')||'').trim()}
function setApiKey(v){GM_setValue(K_API_KEY,(v||'').trim())}
function getAuthId(){return parseInt(GM_getValue(K_AUTH_ID,0),10)||0}
function setAuthId(id){GM_setValue(K_AUTH_ID,parseInt(id||0,10)||0)}
function GM_GetOr(k,def){try{const v=GM_getValue(k);return(v===undefined?def:v)}catch{return def}}
function getIsAuth(){return!!GM_GetOr(K_IS_AUTH,!1)}
function setIsAuth(b){GM_setValue(K_IS_AUTH,!!b)}
function getEditMode(){return!!GM_getValue(K_EDIT_MODE,!1)}
function setEditMode(b){GM_setValue(K_EDIT_MODE,!!b)}
function getMinimized(){return!!GM_getValue(K_MINIMIZED,!1)}
function setMinimized(b){GM_SetValueSafe(K_MINIMIZED,!!b)}
function GM_SetValueSafe(k,v){try{GM_setValue(k,v)}catch{}}
function getPanelSize(){const w=Math.max(380,parseInt(GM_getValue(K_PANEL_W,520),10)||520);const h=Math.max(180,parseInt(GM_getValue(K_PANEL_H,320),10)||320);return{w,h}}
function setPanelSize(w,h){GM_setValue(K_PANEL_W,Math.max(380,Math.min(w,window.innerWidth-12)));GM_setValue(K_PANEL_H,Math.max(180,Math.min(h,window.innerHeight-12)))}
function getPanelPos(){const x=parseInt(GM_getValue(K_PANEL_X,16),10)||16;const y=parseInt(GM_getValue(K_PANEL_Y,16),10)||16;return{x,y}}
function setPanelPos(x,y){GM_setValue(K_PANEL_X,Math.max(6,Math.min(x,window.innerWidth-200)));GM_setValue(K_PANEL_Y,Math.max(6,Math.min(y,window.innerHeight-60)))}
GM_addStyle(`
    .tfe-panel { position: fixed; z-index:${Z_BASE};
      background: rgba(18,18,18,.88); color: #eaeaea; border: 1px solid rgba(255,255,255,.08);
      border-radius: 12px; backdrop-filter: blur(4px); box-shadow: 0 6px 18px rgba(0,0,0,.35);
      font: 13px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Inter,sans-serif; overflow: hidden; }
    .tfe-h { padding: 10px 12px; cursor: move; border-bottom: 1px solid rgba(255,255,255,.07);
      display: grid; grid-template-columns: 1fr auto auto auto; gap: 8px; align-items: center; }
    .tfe-title { font-weight: 700; letter-spacing: .2px; user-select: none; }
    .tfe-iconbtn { cursor: pointer; user-select: none; opacity: .9; padding: 2px 6px; border-radius: 6px; }
    .tfe-iconbtn:hover { opacity: 1; background: rgba(255,255,255,.06); }
    .tfe-iconbtn[data-nodrag="1"] { cursor: pointer; }
    .tfe-b { padding: 10px 12px; display: grid; gap: 10px; }
    .tfe-row { display: grid; grid-template-columns: 1fr auto auto auto; gap: 8px; align-items: center; padding: 6px 8px;
      border: 1px solid rgba(255,255,255,.06); border-radius: 10px; background: rgba(28,28,28,.72); }
    .tfe-name a { color: #fff; text-decoration: none; font-weight: 700; }
    .tfe-name a:hover { text-decoration: underline; }
    .tfe-chip { padding: 4px 8px; border-radius: 999px; font-weight: 700; font-size: 12px; text-align: center; min-width: 90px; }
    .tfe-chip.ok { background: #183b2b; color: #42e2a8; border: 1px solid #1c5f46; }
    .tfe-chip.hosp { background: #3b1818; color: #ff7a7a; border: 1px solid #5f1c1c; }
    .tfe-chip.travel { background: #182b3b; color: #7ac6ff; border: 1px solid #1c465f; }
    .tfe-desc { color: #cfcfcf; font-size: 12px; }
    .tfe-desc.full { grid-column: 1 / -1; }
    .tfe-topbar { display: grid; grid-template-columns: 1fr auto auto; gap: 8px; align-items: center; }
    .tfe-btn, .tfe-input, .tfe-select { padding: 6px 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,.12);
      background: rgba(38,38,38,.85); color: #eee; font-weight: 600; }
    .tfe-btn { cursor: pointer; }
    .tfe-btn:hover { background: rgba(58,58,58,.85); }
    .tfe-select { width: 160px; }
    .tfe-pager { display: flex; gap: 8px; justify-content: flex-end; padding: 0 12px 12px; }
    .tfe-muted { color: #a9a9a9; font-size: 12px; }

    .tfe-badge { font-size: 11px; padding: 3px 6px; border-radius: 999px; border: 1px solid rgba(255,255,255,.12); }
    .tfe-badge.ok { background: #19281f; color: #9cf2c8; border-color: #2a6b52; }
    .tfe-badge.no { background: #2b1a1a; color: #ffa0a0; border-color: #5c2727; }

    .tfe-panel.tfe-min { height: 38px !important; width: 280px !important; }
    .tfe-panel.tfe-min .tfe-h { cursor: pointer; }
    .tfe-panel.tfe-min .tfe-b, .tfe-panel.tfe-min .tfe-pager { display: none; }
    .tfe-panel.tfe-min .tfe-h { border-bottom: none; }
    .tfe-panel.tfe-min .tfe-title { text-align: center; width: 100%; }

    .tfe-modal{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:2147483600;display:flex;align-items:center;justify-content:center}
    .tfe-card{min-width:420px;max-width:560px;background:rgba(20,20,20,.96);color:#eee;border:1px solid rgba(255,255,255,.08);border-radius:12px;box-shadow:0 10px 28px rgba(0,0,0,.55);overflow:hidden}
    .tfe-card .hd{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.07);font-weight:700}
    .tfe-card .bd{padding:12px 14px}
    .tfe-card .ft{display:flex;gap:8px;justify-content:flex-end;padding:12px 14px;border-top:1px solid rgba(255,255,255,.07)}
    .tfe-formgrid{display:grid;grid-template-columns:160px 1fr;gap:10px;align-items:center}
    .tfe-formgrid label{color:#cfcfcf}
    .tfe-input,.tfe-select{width:100%}

    .tfe-resizer { position: absolute; z-index: ${Z_BASE+1}; }
    .tfe-r-n, .tfe-r-s { left: 6px; right: 6px; height: 8px; cursor: ns-resize; }
    .tfe-r-e, .tfe-r-w { top: 6px; bottom: 6px; width: 8px; cursor: ew-resize; }
    .tfe-r-n { top: -2px; }
    .tfe-r-s { bottom: -2px; }
    .tfe-r-e { right: -2px; }
    .tfe-r-w { left: -2px; }
    .tfe-r-ne, .tfe-r-se, .tfe-r-sw, .tfe-r-nw { width: 12px; height: 12px; position: absolute; background: transparent; }
    .tfe-r-ne { right: -4px; top: -4px; cursor: nesw-resize; }
    .tfe-r-se { right: -4px; bottom: -4px; cursor: nwse-resize; }
    .tfe-r-sw { left: -4px; bottom: -4px; cursor: nesw-resize; }
    .tfe-r-nw { left: -4px; top: -4px; cursor: nwse-resize; }
  `);let enemiesShared=[];let enemiesLocal=loadLocalJSON(K_ENEMIES_LOCAL,[]);let bspCache=loadLocalJSON(K_BSP_CACHE,{});let currentPage=0;let filterMode='All';let refreshTimer=null;let CSRF_TOKEN='';function el(tag,attrs,...kids){const n=document.createElement(tag);if(attrs)for(const[k,v]of Object.entries(attrs)){if(k==='class')n.className=v;else if(k==='style'&&typeof v==='object')Object.assign(n.style,v);else n.setAttribute(k,v)}
for(const k of kids){if(k==null)continue;n.appendChild(typeof k==='string'?document.createTextNode(k):k)}
return n}
function bringToFront(node){node.style.zIndex=String((parseInt(node.style.zIndex||Z_BASE,10)||Z_BASE)+1)}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function makeDraggable(box,handle){let dragging=!1,ox=0,oy=0,sx=0,sy=0;const onDown=e=>{if(e.target&&e.target.closest('[data-nodrag="1"]'))return;dragging=!0;sx=e.clientX;sy=e.clientY;const r=box.getBoundingClientRect();ox=r.left;oy=r.top;handle.setPointerCapture?.(e.pointerId);e.preventDefault()};const onMove=e=>{if(!dragging)return;const nx=clamp(ox+(e.clientX-sx),6,window.innerWidth-box.offsetWidth-6);const ny=clamp(oy+(e.clientY-sy),6,window.innerHeight-box.offsetHeight-6);box.style.left=nx+'px';box.style.top=ny+'px'};const onUp=e=>{if(!dragging)return;dragging=!1;handle.releasePointerCapture?.(e.pointerId);const r=box.getBoundingClientRect();setPanelPos(Math.round(r.left),Math.round(r.top))};handle.addEventListener('pointerdown',onDown);window.addEventListener('pointermove',onMove);window.addEventListener('pointerup',onUp)}
function makeResizable(panel){const dirs=['n','e','s','w','ne','se','sw','nw'];const resizers={};dirs.forEach(d=>{const r=el('div',{class:'tfe-resizer tfe-r-'+d,'data-nodrag':'1'});resizers[d]=r;panel.appendChild(r)});const MIN_W=380,MIN_H=180;let resizing=null;let startX=0,startY=0,startW=0,startH=0,startL=0,startT=0;function onDown(dir,e){e.preventDefault();e.stopPropagation();const rect=panel.getBoundingClientRect();resizing=dir;startX=e.clientX;startY=e.clientY;startW=rect.width;startH=rect.height;startL=rect.left;startT=rect.top;document.addEventListener('pointermove',onMove);document.addEventListener('pointerup',onUp,{once:!0})}
function onMove(e){if(!resizing)return;let w=startW,h=startH,l=startL,t=startT;const dx=e.clientX-startX;const dy=e.clientY-startY;if(resizing.includes('e'))w=clamp(startW+dx,MIN_W,window.innerWidth-12);if(resizing.includes('s'))h=clamp(startH+dy,MIN_H,window.innerHeight-12);if(resizing.includes('w')){w=clamp(startW-dx,MIN_W,window.innerWidth-12);l=clamp(startL+dx,6,startL+startW-MIN_W)}
if(resizing.includes('n')){h=clamp(startH-dy,MIN_H,window.innerHeight-12);t=clamp(startT+dy,6,startT+startH-MIN_H)}
panel.style.width=w+'px';panel.style.height=h+'px';panel.style.left=l+'px';panel.style.top=t+'px'}
function onUp(){document.removeEventListener('pointermove',onMove);if(resizing){const rect=panel.getBoundingClientRect();setPanelSize(rect.width,rect.height);setPanelPos(Math.round(rect.left),Math.round(rect.top))}
resizing=null}
Object.entries(resizers).forEach(([dir,node])=>{node.addEventListener('pointerdown',onDown.bind(null,dir))})}
function mergeEnemySources(){const byId=new Map();for(const e of enemiesShared)byId.set(String(e.id),e);for(const e of enemiesLocal)if(!byId.has(String(e.id)))byId.set(String(e.id),e);return Array.from(byId.values());}
function saveLocalEnemies(list){enemiesLocal=list||[];saveLocalJSON(K_ENEMIES_LOCAL,enemiesLocal)}
function saveBspLocal(pid,payload){bspCache[String(pid)]=payload;saveLocalJSON(K_BSP_CACHE,bspCache)}
function getBspLocal(pid){const e=bspCache[String(pid)];if(!e)return null;if(Date.now()-(e.ts||0)>BSP_CACHE_TTL)return null;return e}
function parseStatus(profile){const st=profile?.status||{};const desc=String(st.description||'Unknown');if(/^Okay$/i.test(desc))return{type:'ok',text:'Okay',until:null};if(/In hospital/.test(desc)){const until=(st.until?Number(st.until)*1000:null);return{type:'hosp',text:desc.replace(/^In hospital for\s*/,'').trim(),until}}
if(/Traveling|Returning/i.test(desc)){return{type:'travel',text:desc,until:(st.until?Number(st.until)*1000:null)}}
return{type:'other',text:desc,until:(st.until?Number(st.until)*1000:null)}}
function statusChip(s){const span=el('span',{class:'tfe-chip '+(s.type==='ok'?'ok':s.type==='hosp'?'hosp':s.type==='travel'?'travel':'')});const tick=()=>{if(s.type==='hosp'||s.type==='travel'){if(s.until&&s.until>Date.now()){const ms=s.until-Date.now();const mm=Math.floor(ms/60000);const ss=Math.floor((ms%60000)/1000);span.textContent=(s.type==='hosp'?'Hospital ':'Travel ')+`${mm}:${String(ss).padStart(2,'0')}`}else{span.textContent=(s.type==='hosp'?'Hospital':'Travel')}}else if(s.type==='ok'){span.textContent='Okay'}else{span.textContent=s.text||'Unknown'}};tick();const int=setInterval(tick,1000);span._stop=()=>clearInterval(int);return span}
function loadCachedCsrf(){try{CSRF_TOKEN=GM_getValue(K_CSRF,'')||''}catch{CSRF_TOKEN=''}}
async function relayHello(){try{const u=new URL(RELAY_URL);u.searchParams.set('action','hello');const r=await gmFetch(u.toString(),{method:'GET'});const j=await r.json();if(j&&j.ok&&j.token){CSRF_TOKEN=j.token;GM_setValue(K_CSRF,CSRF_TOKEN);return!0}}catch{}
return!1}
async function relayPostJSON(payloadObj){try{const headers={'Content-Type':'application/json;charset=UTF-8'};if(!CSRF_TOKEN){loadCachedCsrf();if(!CSRF_TOKEN)await relayHello();}
if(CSRF_TOKEN)headers['X-CSRF-Token']=CSRF_TOKEN;const r=await gmFetch(RELAY_URL,{method:'POST',headers,body:JSON.stringify(payloadObj||{})});let j=await r.json()||{ok:!1};if(!j.ok&&j.err==='csrf'){const ok=await relayHello();if(ok&&CSRF_TOKEN){headers['X-CSRF-Token']=CSRF_TOKEN;const r2=await gmFetch(RELAY_URL,{method:'POST',headers,body:JSON.stringify(payloadObj||{})});j=await r2.json()||{ok:!1}}}
return j}catch{return{ok:!1}}}
async function relayAuth(api_key){return await relayPostJSON({action:'auth',api_key})}
async function relayFetchAll(api_key){try{return await relayPostJSON({action:'list',api_key})}catch{return{ok:!1}}}
async function relayAddEnemy(id,desc,api_key){return await relayPostJSON({action:'add',api_key,enemy:{id:Number(id),name:'',desc:String(desc||'')}})}
async function relayUpdateDesc(id,desc,api_key){return await relayPostJSON({action:'edit',api_key,enemy:{id:Number(id),desc:String(desc||'')}})}
async function relayRemove(id,api_key){return await relayPostJSON({action:'remove',api_key,id:Number(id)})}
async function relayUpsertName(id,name){return await relayPostJSON({action:'upsert_name',id:Number(id),name:String(name||'')})}
async function relayPushBsp(id,tbs,tbs_bal){return await relayPostJSON({action:'push_bsp',id:Number(id),tbs:(tbs??''),tbs_bal:(tbs_bal??'')})}
async function getBasicByKey(key){const url=`https://api.torn.com/v2/user/basic?striptags=true&key=${encodeURIComponent(key)}`;try{const r=await gmFetch(url,{method:'GET',timeout:12000});const j=await r.json();return j?.profile||null}catch{return null}}
async function getBasic(pid,key){const url=`https://api.torn.com/v2/user/${pid}/basic?striptags=true&key=${encodeURIComponent(key)}`;try{const r=await gmFetch(url,{method:'GET',timeout:12000});const j=await r.json();return j?.profile||null}catch{return null}}
async function getBsp(pid,key){const cached=getBspLocal(pid);if(cached)return cached;const url=`http://www.lol-manager.com/api/battlestats/${encodeURIComponent(key)}/${encodeURIComponent(pid)}/${encodeURIComponent(BSP_IDENTIFIER)}`;try{const r=await gmFetch(url,{method:'GET',timeout:10000});const j=await r.json();if(!j||typeof j!=='object')return null;if([1,2,3,5,6].includes(j.Result)){const payload={tbs:j.TBS??null,tbs_bal:j.TBS_Balanced??null,ts:Date.now()};saveBspLocal(pid,payload);relayPushBsp(pid,payload.tbs,payload.tbs_bal).catch(()=>{});return payload}
return null}catch{return null}}
const{w:initW,h:initH}=getPanelSize();const{x:initX,y:initY}=getPanelPos();const panel=el('div',{class:'tfe-panel',style:`left:${initX}px;top:${initY}px;width:${initW}px;height:${initH}px;`});const head=el('div',{class:'tfe-h'});const title=el('div',{class:'tfe-title'},'Faction Enemy List');const authBadge=el('span',{class:'tfe-badge '+(getIsAuth()?'ok':'no'),title:'Auth to edit'},getIsAuth()?'Editor':'Viewer');const gear=el('button',{class:'tfe-iconbtn',title:'Settings',type:'button','data-nodrag':'1'},'⚙️');const mini=el('button',{class:'tfe-iconbtn',title:'Minimize',type:'button','data-nodrag':'1'},'−');head.append(title,authBadge,gear,mini);panel.appendChild(head);const body=el('div',{class:'tfe-b'});const topbar=el('div',{class:'tfe-topbar'});const filterSel=el('select',{class:'tfe-select',title:'Filter','data-nodrag':'1'},el('option',null,'All'),el('option',null,'Okay'),el('option',null,'Hospital'),el('option',null,'Traveling'));const addBtn=el('button',{class:'tfe-btn',type:'button','data-nodrag':'1'},'➕ Add Enemy');topbar.append(el('div',{class:'tfe-muted'},'Live statuses refresh every 60s.'),filterSel,addBtn);const rowsWrap=el('div',null);body.append(topbar,rowsWrap);panel.appendChild(body);const pager=el('div',{class:'tfe-pager'});const prevBtn=el('button',{class:'tfe-btn',type:'button','data-nodrag':'1'},'◀ Prev');const pageInfo=el('div',{class:'tfe-muted'},'Page 1/1');const nextBtn=el('button',{class:'tfe-btn',type:'button','data-nodrag':'1'},'Next ▶');pager.append(prevBtn,pageInfo,nextBtn);panel.appendChild(pager);document.body.appendChild(panel);makeDraggable(panel,head);makeResizable(panel);bringToFront(panel);function applyMinimized(min){panel.classList.toggle('tfe-min',!!min);mini.textContent=min?'+':'−';mini.title=min?'Expand':'Minimize'}
applyMinimized(!!GM_GetOr(K_MINIMIZED,!1));head.addEventListener('click',(e)=>{if(!panel.classList.contains('tfe-min'))return;GM_SetValueSafe(K_MINIMIZED,!1);applyMinimized(!1);e.stopPropagation()});gear.addEventListener('click',(e)=>{e.stopPropagation();openSettings()});mini.addEventListener('click',(e)=>{e.stopPropagation();const now=!GM_GetOr(K_MINIMIZED,!1);GM_SetValueSafe(K_MINIMIZED,now);applyMinimized(now)});addBtn.onclick=async()=>{if(!getIsAuth()){alert('You are not authorized to add enemies.');return}
openAddModal()};prevBtn.onclick=()=>{currentPage=Math.max(0,currentPage-1);render()};nextBtn.onclick=()=>{currentPage=currentPage+1;render()};filterSel.onchange=()=>{filterMode=filterSel.value;currentPage=0;render()};function stopRowTimers(){for(const node of rowsWrap.querySelectorAll('.tfe-chip')){if(typeof node._stop==='function'){try{node._stop()}catch{}}}}
function filtered(enemies,statusesById){if(filterMode==='All')return enemies;return enemies.filter(e=>{const s=statusesById.get(String(e.id));if(!s)return!1;if(filterMode==='Okay')return s.type==='ok';if(filterMode==='Hospital')return s.type==='hosp';if(filterMode==='Traveling')return s.type==='travel';return!0})}
function formatNum(n){if(n==null)return'';const x=Number(n);if(!isFinite(x))return String(n);return x.toLocaleString()}
async function render(){stopRowTimers();rowsWrap.innerHTML='';const all=mergeEnemySources();const key=getApiKey();const start=currentPage*PAGE_SIZE;const slice=all.slice(start,start+PAGE_SIZE);const statuses=new Map();const names=new Map();const bspView=new Map();for(const enemy of slice){const pid=enemy.id;if(key){const prof=await getBasic(pid,key);if(prof){names.set(String(pid),prof.name);const st=parseStatus(prof);statuses.set(String(pid),st);if(enemy.name!==prof.name)relayUpsertName(pid,prof.name).catch(()=>{})}}
const shared=bspCache[String(pid)]||null;if(shared){bspView.set(String(pid),shared)}else{const live=key?(await getBsp(pid,key)):null;if(live)bspView.set(String(pid),live);}}
const stitched=all.map(e=>{const name=names.get(String(e.id))||e.name||`[${e.id}]`;const st=statuses.get(String(e.id))||null;const bsp=bspView.get(String(e.id))||getBspLocal(e.id)||null;return{...e,name,_status:st,_bsp:bsp}});const statusMap=new Map(stitched.map(x=>[String(x.id),x._status].filter(Boolean)));const vis=filtered(stitched,statusMap);const totalPages=Math.max(1,Math.ceil(vis.length/PAGE_SIZE));currentPage=Math.min(currentPage,totalPages-1);const vStart=currentPage*PAGE_SIZE;const vSlice=vis.slice(vStart,vStart+PAGE_SIZE);const canEdit=getIsAuth()&&getEditMode();for(const e of vSlice){const nameLink=el('div',{class:'tfe-name'},el('a',{href:`https://www.torn.com/loader.php?sid=attack&user2ID=${e.id}`,target:'_blank'},`${e.name} [${e.id}]`));const status=e._status?statusChip(e._status):el('span',{class:'tfe-chip'},'—');const bspText=(e._bsp&&(e._bsp.tbs||e._bsp.tbs_bal))?`BSP: ${e._bsp.tbs ? formatNum(e._bsp.tbs) : '-'}${e._bsp.tbs && e._bsp.tbs_bal ? ' • ' : ''}${e._bsp.tbs_bal ? formatNum(e._bsp.tbs_bal) : ''}`:'BSP: —';const bsp=el('div',{class:'tfe-bsp'},bspText);const rightBtns=el('div',{style:'display:flex; gap:6px; align-items:center;'});if(canEdit){const editBtn=el('button',{class:'tfe-btn','data-nodrag':'1',title:'Edit description'},'✏️');const delBtn=el('button',{class:'tfe-btn','data-nodrag':'1',title:'Remove enemy'},'🗑');editBtn.onclick=async(ev)=>{ev.stopPropagation();const cur=(e.desc||'');const next=prompt(`Edit description for ${e.name} [${e.id}]`,cur);if(next==null)return;const api_key=getApiKey();const res=await relayUpdateDesc(e.id,next,api_key);if(!res||!res.ok){const loc=(enemiesLocal||[]).map(x=>x.id===e.id?{...x,desc:next}:x);saveLocalEnemies(loc)}
await hydrate();render()};delBtn.onclick=async(ev)=>{ev.stopPropagation();if(!confirm(`Remove ${e.name} [${e.id}] from the list?`))return;const api_key=getApiKey();const res=await relayRemove(e.id,api_key);if(!res||!res.ok){const loc=(enemiesLocal||[]).filter(x=>x.id!==e.id);saveLocalEnemies(loc)}
await hydrate();render()};rightBtns.append(editBtn,delBtn)}
const desc=el('div',{class:'tfe-desc full'},e.desc||'');const row=el('div',{class:'tfe-row'},nameLink,status,bsp,rightBtns,desc);rowsWrap.appendChild(row)}
pageInfo.textContent=`Page ${totalPages ? (currentPage + 1) : 1}/${totalPages || 1}`;if(refreshTimer)clearTimeout(refreshTimer);if(!GM_GetOr(K_MINIMIZED,!1)){refreshTimer=setTimeout(()=>{render()},REFRESH_MS)}}
function openSettings(){const apiKey=getApiKey();const editOn=getEditMode();const modal=el('div',{class:'tfe-modal'});const card=el('div',{class:'tfe-card'});const hd=el('div',{class:'hd'},el('div',null,'Settings'),el('button',{class:'tfe-btn',type:'button'},'✖'));const apiHelp='Your personal Torn API key (local only) for name/status lookups and editor verification.';const bd=el('div',{class:'bd'},el('div',{class:'tfe-formgrid'},el('label',null,'API Key'),el('input',{class:'tfe-input',type:'password',value:apiKey,placeholder:'Torn API key'}),el('div',{class:'tfe-muted',style:'grid-column: 1 / -1;'},apiHelp),el('label',null,'Edit Mode'),el('select',{class:'tfe-select'},el('option',{value:'off',selected:!editOn},'Off'),el('option',{value:'on',selected:editOn},'On')),el('div',{class:'tfe-muted',style:'grid-column: 1 / -1;'},'Requires authorization.'),el('label',null,'Rows per page'),(function(){const sel=el('select',{class:'tfe-select'});for(let i=1;i<=PAGE_SIZE_HARD_MAX;i++){sel.appendChild(el('option',{value:String(i),selected:i===PAGE_SIZE},String(i)))}
return sel})(),el('div',{class:'tfe-muted',style:'grid-column: 1 / -1;'},`Max ${PAGE_SIZE_HARD_MAX}.`)));const ft=el('div',{class:'ft'},el('button',{class:'tfe-btn',type:'button'},'Save'),el('button',{class:'tfe-btn',type:'button'},'Close'));card.append(hd,bd,ft);modal.append(card);document.body.appendChild(modal);const nodes=bd.querySelectorAll('input, select');const apiInput=nodes[0];const editSelect=nodes[1];const pageSel=nodes[2];const[saveBtn,closeBtn]=ft.querySelectorAll('button');const xBtn=hd.querySelector('button');function closeModal(){try{document.body.removeChild(modal)}catch{}}
saveBtn.onclick=async()=>{const key=apiInput.value.trim();setApiKey(key);let allowed=!1;let meId=0;if(key){const me=await getBasicByKey(key);if(me&&me.id){meId=Number(me.id);setAuthId(meId);const auth=await relayAuth(key);allowed=!!(auth&&auth.ok)}}
setIsAuth(allowed);const wantEdit=editSelect.value==='on';setEditMode(allowed&&wantEdit);const newSz=Math.min(PAGE_SIZE_HARD_MAX,Math.max(1,parseInt(pageSel.value,10)||PAGE_SIZE_HARD_MAX));PAGE_SIZE=newSz;GM_setValue('tfe_page_size',PAGE_SIZE);authBadge.className='tfe-badge '+(allowed?'ok':'no');authBadge.textContent=allowed?'Editor':'Viewer';closeModal();await hydrate();render()};closeBtn.onclick=closeModal;xBtn.onclick=closeModal;modal.addEventListener('click',(e)=>{if(e.target===modal)closeModal();});document.addEventListener('keydown',function esc(e){if(e.key==='Escape'){closeModal();document.removeEventListener('keydown',esc)}})}
function openAddModal(){const modal=el('div',{class:'tfe-modal'});const card=el('div',{class:'tfe-card'});const hd=el('div',{class:'hd'},el('div',null,'Add Enemy'),el('button',{class:'tfe-btn',type:'button'},'✖'));const bd=el('div',{class:'bd'},el('div',{class:'tfe-formgrid'},el('label',null,'Enemy ID'),el('input',{class:'tfe-input',type:'text',placeholder:'e.g., 2523988'}),el('label',null,'Description'),el('input',{class:'tfe-input',type:'text',placeholder:'Optional notes…'}),el('div',{class:'tfe-muted',style:'grid-column: 1 / -1;'},'Saved to server; falls back to local if offline.')));const ft=el('div',{class:'ft'},el('button',{class:'tfe-btn',type:'button'},'Add'),el('button',{class:'tfe-btn',type:'button'},'Cancel'));card.append(hd,bd,ft);modal.append(card);document.body.appendChild(modal);const[idInput,descInput]=bd.querySelectorAll('input');const[addBtn,cancelBtn]=ft.querySelectorAll('button');const xBtn=hd.querySelector('button');function closeModal(){try{document.body.removeChild(modal)}catch{}}
cancelBtn.onclick=closeModal;xBtn.onclick=closeModal;modal.addEventListener('click',(e)=>{if(e.target===modal)closeModal();});document.addEventListener('keydown',function esc(e){if(e.key==='Escape'){closeModal();document.removeEventListener('keydown',esc)}});addBtn.onclick=async()=>{const id=parseInt((idInput.value||'').trim(),10);const desc=(descInput.value||'').trim();if(!id||id<=0){alert('Please enter a valid numeric ID.');return}
const api_key=getApiKey();const r=await relayAddEnemy(id,desc,api_key);if(!r||!r.ok){const cur=mergeEnemySources();if(!cur.find(e=>+e.id===+id)){const newItem={id,desc,ts:Date.now()};const newLocal=(enemiesLocal||[]).concat([newItem]);saveLocalEnemies(newLocal)}}
closeModal();await hydrate();render()}}
async function hydrate(){try{const api_key=getApiKey();const shared=await relayFetchAll(api_key);if(shared&&shared.ok){enemiesShared=Array.isArray(shared.data?.enemies)?shared.data.enemies:(Array.isArray(shared.enemies)?shared.enemies:[]);const sbsp=shared.bsp||shared.data?.bsp||{};for(const[pid,obj]of Object.entries(sbsp)){const local=bspCache[pid];if(!local||(obj.ts&&obj.ts>(local.ts||0))){bspCache[pid]=obj}}
saveLocalJSON(K_BSP_CACHE,bspCache)}else{enemiesShared=[]}}catch{enemiesShared=[]}}(async()=>{loadCachedCsrf();if(!CSRF_TOKEN)await relayHello();await hydrate();render()})()})()