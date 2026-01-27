// ==UserScript==
// @name         国服英雄榜坐骑收藏
// @namespace    https://greasyfork.org/zh-CN/users/1502715
// @version      1.2.7
// @license      MIT
// @description  在魔兽世界国服英雄榜页面展示类似于MCL插件的坐骑收藏面板
// @author       电视卫士
// @match        https://wow.blizzard.cn/character/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      webapi.blizzard.cn
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554696/%E5%9B%BD%E6%9C%8D%E8%8B%B1%E9%9B%84%E6%A6%9C%E5%9D%90%E9%AA%91%E6%94%B6%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/554696/%E5%9B%BD%E6%9C%8D%E8%8B%B1%E9%9B%84%E6%A6%9C%E5%9D%90%E9%AA%91%E6%94%B6%E8%97%8F.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const HOST_API_PREFIX = 'https://webapi.blizzard.cn/wow-armory-server/api/';

  const href = location.href;
  if (
    href === 'https://wow.blizzard.cn/character/#/' ||
    href === 'https://wow.blizzard.cn/character/404/' ||
    href.startsWith('https://wow.blizzard.cn/character/#/search?q=') ||
    href.startsWith('https://wow.blizzard.cn/character/classic/')
  ) return;

  GM_addStyle(`
/* entry button */
#wow-mounts-btn { position: fixed; right:18px; bottom:100px; z-index:999999; background: linear-gradient(#2b4960,#16232b); color:#fff; border-radius:8px; padding:8px 12px; box-shadow:0 6px 18px rgba(0,0,0,0.45); cursor:pointer; font-weight:600; font-family:"Microsoft YaHei", Arial; border:1px solid rgba(255,255,255,0.04);}

/* panel */
#wow-mounts-panel {position: fixed; top:80px; right:20px; width:460px; height:640px; background:#0f1620; border:1px solid #2b3b48; color:#eaf1f6; z-index:999998; border-radius:8px; display:flex; flex-direction:column; box-shadow:0 8px 28px rgba(0,0,0,0.6); overflow:hidden; font-family:"Microsoft YaHei", Arial;}
/* header */
#wow-mounts-panel .hdr {display:flex; flex-direction:column; gap:6px; padding:10px 12px; border-bottom:1px solid #16222b; background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);}
#wow-mounts-panel .hdr .summary-row { display:flex; align-items:center; justify-content:space-between; gap:8px; }
#wow-mounts-panel .hdr .summary { font-size:15px; font-weight:700; color:#a0c0d0; }
#wow-mounts-panel .hdr .login-time { font-size:13px; color:#9fb0bd; cursor:pointer; }

/* fixed search bar */
#wow-mounts-panel .fixed-controls { display:flex; gap:8px; align-items:center; padding:8px 12px; border-bottom:1px solid #16222b; background: rgba(11,18,24,0.6); z-index:6; flex-shrink:0; }
.fixed-controls input[type="text"] { flex:1; padding:6px 8px; border-radius:6px; border:1px solid #23323d; background:#071016; color:#eaf1f6; }
.fixed-controls label { font-size:13px; user-select:none; cursor:pointer; display:flex; align-items:center; gap:6px; color:#c7d7df; }

/* body */
#wow-mounts-panel .body {display:flex; flex:1; min-height:0; overflow:hidden;}
#wow-mounts-panel .cats {width:140px; border-right:1px solid #16222b; overflow:auto; padding:8px;}
.cat-item { padding:8px 6px; cursor:pointer; border-radius:6px; margin-bottom:6px; font-size:13px; color:#d7e7ef;}
.cat-item.active { background:#1f2f3a; color:#fff; }
#wow-mounts-panel .list-wrap { flex:1; padding:8px 10px; overflow:auto; position:relative; }
.mount-row { display:flex; align-items:flex-start; padding:8px; border-radius:6px; margin-bottom:8px; background: linear-gradient(180deg, rgba(255,255,255,0.01), transparent); border:1px solid rgba(255,255,255,0.02); font-size:13px;}
.mount-row img { width:44px; height:44px; border-radius:6px; object-fit:cover; margin-right:10px; flex-shrink:0;}
.mount-info { display:flex; flex-direction:column; gap:4px; }
.mount-name { font-weight:700; color:#eaf1f6; font-size:14px; }
.mount-tags { font-size:12px; color:#9fb0bd; }
.label-uncollected { background:transparent; color:#f39c9c; padding:0; border-radius:0; }
.label-unusable { background:transparent; color:#b7b7c6; padding:0; border-radius:0; }
.small-muted { font-size:12px; color:#86a0ad;}
/* close button */
#wow-mounts-panel #mounts-close { font-size:16px; font-weight:700; color:#fff; background:none; border:none; cursor:pointer; padding:4px; border-radius:4px; }
`);

  function gmFetchJson(url) {
    return new Promise((resolve,reject)=>{
      if(!/^https:\/\/webapi\.blizzard\.cn\/wow-armory-server\/api\//.test(url)) { reject(new Error('URL 不安全: '+url)); return; }
      GM_xmlhttpRequest({
        method:'GET', url,
        headers:{'Accept':'application/json'},
        onload: resp=>{
          if(resp.status>=200 && resp.status<300){
            try{ resolve(JSON.parse(resp.responseText)); }
            catch(e){ reject(new Error('JSON解析失败:'+e.message));}
          }
          else reject(new Error(`HTTP ${resp.status}`));
        },
        onerror: ()=>reject(new Error('网络请求失败')),
        ontimeout: ()=>reject(new Error('请求超时')),
        timeout:15000
      });
    });
  }

  function parseCharacterFromUrl(){
    try{ const h=location.hash||''; const parts=h.split('?')[0].replace(/^#\/?/,'').split('/'); if(parts.length>=2) return { realm_slug: decodeURIComponent(parts[0]), role_name: decodeURIComponent(parts[1]) }; }catch(e){} return null;
  }

  async function fetchIndex(realm_slug,role_name){
    const url=`${HOST_API_PREFIX}index?realm_slug=${encodeURIComponent(realm_slug)}&role_name=${encodeURIComponent(role_name)}`;
    const j=await gmFetchJson(url);
    if(!j||!j.data||!j.data.token) throw new Error('未获取到角色 token');
    const faction=(j.data.character_summary?.faction?.type)||'ALLIANCE';
    return { token:j.data.token, faction, indexData: j.data };
  }

  async function fetchMounts(token,faction){
    const url=`${HOST_API_PREFIX}do?api=mounts&token=${encodeURIComponent(token)}&attr=${encodeURIComponent(faction)}`;
    const j=await gmFetchJson(url);
    const mountsArr=(j.data && Array.isArray(j.data.mounts))?j.data.mounts:[];
    return mountsArr;
  }

  function createEntryButton(){
    if(document.getElementById('wow-mounts-btn')) return;
    const btn=document.createElement('div'); btn.id='wow-mounts-btn'; btn.textContent='坐骑收藏'; document.body.appendChild(btn);
    btn.addEventListener('click', togglePanel);
  }

  let panelCreated=false;
  async function togglePanel(){
    const existing=document.getElementById('wow-mounts-panel');
    if(existing){
      existing.style.display = existing.style.display === 'none' ? 'flex' : 'none';
      return;
    }
    if(!panelCreated) await createPanelAndLoad();
  }

  let currentMounts=[]; let mountsByCat={}; let currentCat=null;
  let lastIndexData = null;

  async function createPanelAndLoad(){
    panelCreated=true;
    const panel=document.createElement('div'); panel.id='wow-mounts-panel';
    panel.innerHTML=`
      <div class="hdr">
        <div class="summary-row">
          <div class="summary" id="mounts-summary">准备中…</div>
          <div class="controls"><button id="mounts-close">✕</button></div>
        </div>
        <div class="login-time" id="mounts-login-time" title="点击后隐藏">角色上次登录：获取中…</div>
      </div>

      <div class="fixed-controls">
         <input type="text" id="mounts-search" placeholder="搜索坐骑名称">
         <label><input type="checkbox" id="mounts-only-uncollected"> 仅显示未收集</label>
      </div>

      <div class="body">
        <div class="cats" id="mounts-cats">加载中…</div>
        <div class="list-wrap">
          <div id="mounts-list" style="min-height:100px; padding-bottom:12px;">请稍候，正在加载坐骑数据…</div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    panel.querySelector('#mounts-close').addEventListener('click', ()=>panel.style.display='none');
    panel.querySelector('#mounts-search').addEventListener('input', applyFilters);
    panel.querySelector('#mounts-only-uncollected').addEventListener('change', applyFilters);

    const statusEl=panel.querySelector('#mounts-summary');
    const loginEl = panel.querySelector('#mounts-login-time');

    try{
      const role=parseCharacterFromUrl(); if(!role) throw new Error('未解析到角色信息');
      statusEl.textContent='获取 token…';
      const {token,faction,indexData}=await fetchIndex(role.realm_slug,role.role_name);
      lastIndexData = indexData;

      const loginTs = indexData?.character_summary?.last_login_timestamp;
      let showFull = true;
      const fullText = loginTs ? `${formatDate(loginTs)} ${formatRelativeTime(loginTs)}` : '无法获取';
      loginEl.innerHTML = `角色上次登录：<span id="login-toggle" style="cursor:pointer;" title="点击后隐藏">${fullText}</span>`;

      const span = document.getElementById('login-toggle');
      span.addEventListener('click', () => {
        showFull = !showFull;
        span.textContent = showFull ? fullText : '****';
        span.title = showFull ? '点击后隐藏' : '点击以展示';
      });

      statusEl.textContent='获取坐骑数据…';
      const mountsArr=await fetchMounts(token,faction);
      if(!mountsArr.length){ statusEl.textContent='未获取到坐骑数据'; document.getElementById('mounts-list').innerHTML='<div class="small-muted">无数据</div>'; return;}
      prepareAndRender(mountsArr);
    }catch(e){
      console.error(e);
      statusEl.textContent='加载失败:'+(e.message||e);
      loginEl.textContent='角色上次登录：无法获取';
      document.getElementById('mounts-list').innerHTML='<div class="small-muted">加载失败</div>';
    }
  }

  // 其余逻辑保持不变
  function prepareAndRender(mountsArr){
    currentMounts=mountsArr.map((entry,idx)=>{
      const mm=entry.mount||{};
      let label='';
      if(!entry.is_useable && !mm.is_owned) label='uncollected';
      else if(!entry.is_useable && mm.is_owned) label='unusable';
      return { id:mm.id||(`_m_${idx}_${Math.random().toString(36).slice(2)}`), name:mm.name||'未知坐骑', icon:mm.icon||'', label, raw:entry };
    });
    mountsByCat={};
    for(const m of currentMounts){
      const cat=(m.raw.mount.type||m.raw.mount.category||'其他');
      if(!mountsByCat[cat]) mountsByCat[cat]=[];
      mountsByCat[cat].push(m);
    }
    renderCats(Object.keys(mountsByCat));
    const first=Object.keys(mountsByCat)[0];
    if(first) switchToCategory(first);
  }

  function renderCats(catKeys){
    const node=document.getElementById('mounts-cats'); node.innerHTML='';
    for(const k of catKeys){
      const n=document.createElement('div'); n.className='cat-item'; n.textContent=`${k} (${mountsByCat[k].length})`; n.dataset.cat=k;
      n.addEventListener('click',()=>switchToCategory(k,n)); node.appendChild(n);
    }
  }

  function switchToCategory(catKey,domItem){
    if(!mountsByCat[catKey]) return;
    currentCat=catKey;
    document.querySelectorAll('#mounts-cats .cat-item').forEach(el=>el.classList.remove('active'));
    if(domItem) domItem.classList.add('active');
    else{ const el=document.querySelector(`#mounts-cats .cat-item[data-cat="${catKey}"]`); if(el) el.classList.add('active');}
    applyFilters();
  }

  function applyFilters(){
    const listNode=document.getElementById('mounts-list');
    const searchText=document.getElementById('mounts-search').value.trim().toLowerCase();
    const onlyUncol=document.getElementById('mounts-only-uncollected').checked;
    if(!currentCat || !mountsByCat[currentCat]){ listNode.innerHTML='<div class="small-muted">无数据</div>'; updateSummary(); return; }
    let filtered=mountsByCat[currentCat];
    if(searchText) filtered=filtered.filter(m=>m.name.toLowerCase().includes(searchText));
    if(onlyUncol) filtered=filtered.filter(m=>m.label==='uncollected');
    if(!filtered.length){ listNode.innerHTML='<div class="small-muted">无匹配坐骑</div>'; updateSummary(); return; }
    updateSummary();
    listNode.innerHTML='';
    for(const m of filtered){
      const row=document.createElement('div'); row.className='mount-row';
      const img=document.createElement('img'); img.src=m.icon||''; img.alt=m.name;
      const info=document.createElement('div'); info.className='mount-info';
      const nameDiv=document.createElement('div'); nameDiv.className='mount-name'; nameDiv.innerHTML=escapeHtml(m.name);
      const tagsDiv=document.createElement('div'); tagsDiv.className='mount-tags';
      const tags=[];
      if(!m.raw.mount.is_owned) tags.push('<span class="label-uncollected">未收集</span>');
      if(m.label==='unusable' || (m.raw.mount.is_owned && !m.raw.is_useable)) tags.push('<span class="label-unusable">不可用</span>');
      tagsDiv.innerHTML = tags.join(' / ');
      info.appendChild(nameDiv); info.appendChild(tagsDiv);
      row.appendChild(img); row.appendChild(info); listNode.appendChild(row);
    }
  }

  function updateSummary(){
    const summaryEl = document.getElementById('mounts-summary');
    if(!currentCat || !mountsByCat[currentCat]){ summaryEl.textContent='进度：0/0（可用：0）'; return; }
    const all = mountsByCat[currentCat].length;
    const owned = mountsByCat[currentCat].filter(m => m.raw.mount && m.raw.mount.is_owned).length;
    const usable = mountsByCat[currentCat].filter(m => m.raw.is_useable).length;
    summaryEl.textContent = `进度：${owned}/${all}（可用：${usable}）`;
  }

  function escapeHtml(s){ if(s===null||s===undefined) return ''; return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function formatDate(ts){ try{ const d=new Date(Number(ts)); return isNaN(d)?'-':d.toLocaleString(); }catch(e){ return '-'; } }
  function formatRelativeTime(ts){
    if(!ts) return ''; const now=Date.now(); const diffMin=Math.floor((now-Number(ts))/(1000*60));
    if(diffMin<60) return `(${diffMin}分钟前)`; const diffH=Math.floor(diffMin/60);
    if(diffH<24) return `(${diffH}小时前)`; const diffD=Math.floor(diffH/24);
    return `(${diffD}天前)`;
  }

  createEntryButton();

  // 当 hash 变动时，自动尝试刷新面板数据（如果已打开）
  window.addEventListener('hashchange', ()=> {
    const panel = document.getElementById('wow-mounts-panel');
    if(panel && panel.style.display!=='none'){
      panel.remove();
      panelCreated=false;
      setTimeout(()=>{ if(!panelCreated) createPanelAndLoad(); }, 200);
    }
  });

})();
