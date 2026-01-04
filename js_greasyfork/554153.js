// ==UserScript==
// @name         Torn Bounties — Smart Group & Sort
// @namespace    https://mayhemhub.net/
// @version      1.0.2
// @author       IAMAPEX [2523988]
// @description  Reorders the bounties list: OKAY (by highest bounty), Hospital (by time left), Travelling/Abroad at bottom or hidden; live countdown that replaces 'Hospital' text.
// @match        https://www.torn.com/bounties.php*
// @icon         https://www.torn.com/favicon.ico
// @run-at       document-end
// @connect      api.torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554153/Torn%20Bounties%20%E2%80%94%20Smart%20Group%20%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/554153/Torn%20Bounties%20%E2%80%94%20Smart%20Group%20%20Sort.meta.js
// ==/UserScript==

(function(){'use strict';const LS_KEY='torn_bounties_v2_api_key';const LS_HIDE_TRAVEL='torn_bounties_hide_travel';const LS_AUTO_REFRESH='torn_bounties_auto_refresh';const API_BASE='https://api.torn.com/v2';const FETCH_DELAY_MS=650;const AUTO_REFRESH_MS=30_000;let autoRefreshTimer=null;let countdownTimer=null;function createControlPanel(){const panel=document.createElement('div');panel.id='bounty-sorter-panel';panel.innerHTML=`
      <div class="bsp-header">
        <strong>Bounty Sorter</strong>
        <div class="bsp-actions">
          <button class="bsp-btn" id="bsp-minimize" title="Minimize">–</button>
          <button class="bsp-btn" id="bsp-close" title="Close">✕</button>
        </div>
      </div>
      <div class="bsp-body">
        <label class="bsp-row">
          <span>API Key:</span>
          <input id="bsp-api" type="password" placeholder="Enter Torn API key (v2)" />
        </label>
        <div class="bsp-row small">
          <label><input type="checkbox" id="bsp-hide-travel" /> Hide Travelling / Abroad</label>
        </div>
        <div class="bsp-row small">
          <label><input type="checkbox" id="bsp-auto-refresh" /> Auto refresh every 30s</label>
        </div>
        <div class="bsp-row">
          <button id="bsp-save" class="bsp-primary">Save Key</button>
          <button id="bsp-sort">Sort Now</button>
          <button id="bsp-reset">Reset Page</button>
        </div>
        <div class="bsp-tip">OK sorted by bounty (desc). Hospital by time remaining. Travel at bottom.</div>
      </div>
    `;const style=document.createElement('style');style.textContent=`
      #bounty-sorter-panel{position:fixed;top:90px;right:20px;z-index:99999;width:300px;background:#121212;color:#e6e6e6;border:1px solid #2a2a2a;border-radius:10px;box-shadow:0 6px 18px rgba(0,0,0,.35);font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:13px}
      #bounty-sorter-panel .bsp-header{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:#1b1b1b;border-bottom:1px solid #2a2a2a;border-radius:10px 10px 0 0;cursor:move}
      #bounty-sorter-panel .bsp-actions{display:flex;gap:6px}
      #bounty-sorter-panel .bsp-btn{border:1px solid #3a3a3a;background:#232323;color:#ccc;padding:2px 8px;border-radius:6px;cursor:pointer}
      #bounty-sorter-panel .bsp-btn:hover{background:#2b2b2b}
      #bounty-sorter-panel .bsp-body{padding:10px 12px}
      #bounty-sorter-panel .bsp-row{display:flex;align-items:center;gap:8px;margin:8px 0}
      #bounty-sorter-panel .bsp-row.small{font-size:12px;color:#cfcfcf}
      #bounty-sorter-panel input#bsp-api{flex:1;padding:6px 8px;background:#0f0f0f;color:#e6e6e6;border:1px solid #2a2a2a;border-radius:6px}
      #bounty-sorter-panel button{border:1px solid #3a3a3a;background:#232323;color:#eaeaea;padding:6px 10px;border-radius:8px;cursor:pointer}
      #bounty-sorter-panel button:hover{background:#2b2b2b}
      #bounty-sorter-panel .bsp-primary{background:#2f6fed;border-color:#2f6fed}
      #bounty-sorter-panel .bsp-primary:hover{filter:brightness(1.1)}
      #bounty-sorter-panel .bsp-tip{font-size:11px;color:#aaa;margin-top:6px}
      .bsp-group-title-li{list-style:none;margin:6px 0}
      .bsp-group-title{padding:8px 10px;font-weight:700;background:#191919;border:1px solid #262626;border-radius:8px;color:#ddd}
      .bsp-min{display:none}
    `;document.body.appendChild(style);document.body.appendChild(panel);panel.querySelector('#bsp-api').value=localStorage.getItem(LS_KEY)||'';panel.querySelector('#bsp-hide-travel').checked=localStorage.getItem(LS_HIDE_TRAVEL)==='1';panel.querySelector('#bsp-auto-refresh').checked=localStorage.getItem(LS_AUTO_REFRESH)==='1';makePanelDraggable(panel,panel.querySelector('.bsp-header'));panel.querySelector('#bsp-save').addEventListener('click',()=>{const key=panel.querySelector('#bsp-api').value.trim();if(key)localStorage.setItem(LS_KEY,key);alert(key?'API key saved.':'Please enter a key.')});panel.querySelector('#bsp-sort').addEventListener('click',runSort);panel.querySelector('#bsp-reset').addEventListener('click',()=>location.reload());panel.querySelector('#bsp-hide-travel').addEventListener('change',(e)=>{localStorage.setItem(LS_HIDE_TRAVEL,e.target.checked?'1':'0');runSort()});panel.querySelector('#bsp-auto-refresh').addEventListener('change',(e)=>{const on=e.target.checked;localStorage.setItem(LS_AUTO_REFRESH,on?'1':'0');setupAutoRefresh(on)});panel.querySelector('#bsp-close').addEventListener('click',()=>{teardownTimers();panel.remove()});panel.querySelector('#bsp-minimize').addEventListener('click',()=>{panel.querySelector('.bsp-body').classList.toggle('bsp-min')});setupAutoRefresh(panel.querySelector('#bsp-auto-refresh').checked)}
function makePanelDraggable(container,handle){let isDown=!1,startX,startY,startLeft,startTop;handle.addEventListener('mousedown',(e)=>{if(e.target.closest('.bsp-actions'))return;isDown=!0;startX=e.clientX;startY=e.clientY;const r=container.getBoundingClientRect();startLeft=r.left;startTop=r.top;document.addEventListener('mousemove',onMove);document.addEventListener('mouseup',onUp)});function onMove(e){if(!isDown)return;container.style.left=(startLeft+e.clientX-startX)+'px';container.style.top=(startTop+e.clientY-startY)+'px';container.style.right='auto';container.style.bottom='auto'}
function onUp(){isDown=!1;document.removeEventListener('mousemove',onMove);document.removeEventListener('mouseup',onUp)}}
function setupAutoRefresh(on){if(autoRefreshTimer)clearInterval(autoRefreshTimer);autoRefreshTimer=on?setInterval(runSort,AUTO_REFRESH_MS):null}
function teardownTimers(){if(autoRefreshTimer)clearInterval(autoRefreshTimer);if(countdownTimer)clearInterval(countdownTimer);autoRefreshTimer=null;countdownTimer=null}
function getListRoot(){return document.querySelector('.bounties-cont .bounties-list')}
function collectItems(){const root=getListRoot();if(!root)return[];return Array.from(root.querySelectorAll(':scope > li')).filter(li=>li.querySelector('ul.item'))}
function parseMoneyToNumber(txt){return Number(String(txt||'').replace(/[^0-9.]/g,''))||0}
function getBountyAmount(item){const el=item.querySelector('.b-info-wrap.head .reward');return parseMoneyToNumber(el?el.textContent:'0')}
function getStatusText(item){const el=item.querySelector('.b-info-wrap .status span:last-child');return el?el.textContent.trim():''}
function extractUserId(item){const attackLink=item.querySelector('.b-info-wrap.head .target a[href*="user2ID="]');if(attackLink){const m=attackLink.href.match(/user2ID=(\d+)/);if(m)return m[1]}
const profileLink=item.querySelector('.b-info-wrap.head a[href*="profiles.php?XID="], .confirm.cclaim .msg a[href*="profiles.php?XID="]');if(profileLink){const m=profileLink.href.match(/XID=(\d+)/);if(m)return m[1]}
return null}
async function fetchHospitalUntilEpoch(userId,key){const url=`${API_BASE}/user/${userId}/basic?striptags=true&key=${encodeURIComponent(key)}`;const res=await fetch(url,{credentials:'omit'});if(!res.ok)throw new Error(`HTTP ${res.status}`);const data=await res.json();const until=data?.profile?.status?.until;if(!until||typeof until!=='number')throw new Error('No until in response');return until}
async function throttleAll(ids,key,onProgress){const results={};for(let i=0;i<ids.length;i++){const id=ids[i];try{results[id]=await fetchHospitalUntilEpoch(id,key)}catch(e){results[id]=null;console.warn('ETA failed',id,e)}
if(onProgress)onProgress(i+1,ids.length);if(i<ids.length-1)await new Promise(r=>setTimeout(r,FETCH_DELAY_MS));}
return results}
function makeGroupTitleLi(text){const li=document.createElement('li');li.className='bsp-group-title-li';const div=document.createElement('div');div.className='bsp-group-title';div.textContent=text;li.appendChild(div);return li}
function secondsToHMS(s){s=Math.max(0,Math.floor(s));const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;if(h>0)return `${h}h ${m}m ${sec}s`;if(m>0)return `${m}m ${sec}s`;return `${sec}s`}
function attachCountdown(item,untilEpoch){if(!untilEpoch)return;const statusWrap=item.querySelector('.b-info-wrap .status');if(!statusWrap)return;const valueSpan=statusWrap.querySelector('.user-red-status, .user-green-status, .user-blue-status')||statusWrap.querySelector('span:not(.t-show)');if(valueSpan)valueSpan.style.display='none';let cd=statusWrap.querySelector('.bsp-countdown');if(!cd){cd=document.createElement('span');cd.className='bsp-countdown';cd.style.marginLeft='6px';cd.style.fontWeight='700';cd.style.color='#ff7a7a';statusWrap.appendChild(cd)}
function update(){const now=Math.floor(Date.now()/1000);const left=Math.max(0,untilEpoch-now);cd.textContent=secondsToHMS(left);if(left<=0){cd.textContent='0s';cd.style.color='#9fe59f'}}
update();item._bspUpdate=update}
function startCountdownLoop(items){if(countdownTimer)clearInterval(countdownTimer);countdownTimer=setInterval(()=>{items.forEach(li=>{if(typeof li._bspUpdate==='function')li._bspUpdate();})},1000)}
async function runSort(){teardownTimers();const root=getListRoot();if(!root){console.warn('[BountySorter] No .bounties-list found');return}
const items=collectItems();if(items.length===0){console.warn('[BountySorter] No items found under .bounties-list');return}
const hideTravel=localStorage.getItem(LS_HIDE_TRAVEL)==='1';const key=(localStorage.getItem(LS_KEY)||'').trim();const okItems=[];const hospItems=[];const travelItems=[];const hospIds=[];for(const li of items){const status=getStatusText(li).toLowerCase();if(/hospital/.test(status)){hospItems.push(li);const uid=extractUserId(li);if(uid)hospIds.push(uid);}else if(/abroad|travel/.test(status)){travelItems.push(li)}else{okItems.push(li)}}
okItems.sort((a,b)=>getBountyAmount(b)-getBountyAmount(a));let idToUntil={};if(hospItems.length&&key){const uniqueIds=[...new Set(hospIds)];idToUntil=await throttleAll(uniqueIds,key)}
const leftSec=(li)=>{const uid=extractUserId(li);const until=uid?idToUntil[uid]:null;return until?Math.max(0,until-Math.floor(Date.now()/1000)):Number.POSITIVE_INFINITY};if(key){hospItems.sort((a,b)=>leftSec(a)-leftSec(b))}
const frag=document.createDocumentFragment();frag.appendChild(makeGroupTitleLi(`Okay (${okItems.length}) — highest bounty first`));okItems.forEach(li=>frag.appendChild(li));frag.appendChild(makeGroupTitleLi(`In Hospital (${hospItems.length}) — soonest out first${key?'':' (save API key for timers)'}`));hospItems.forEach(li=>frag.appendChild(li));if(!hideTravel){frag.appendChild(makeGroupTitleLi(`Travelling / Abroad (${travelItems.length})`));travelItems.forEach(li=>frag.appendChild(li))}else{travelItems.forEach(li=>li.remove())}
if(key){hospItems.forEach(li=>{const uid=extractUserId(li);const until=uid?idToUntil[uid]:null;if(until)attachCountdown(li,until);});startCountdownLoop(hospItems)}
const clearNode=root.querySelector(':scope > li.clear');Array.from(root.querySelectorAll(':scope > li')).forEach(li=>{if(li!==clearNode)li.remove();});if(clearNode){root.insertBefore(frag,clearNode)}else{root.appendChild(frag)}}
function waitForList(){return new Promise(resolve=>{const tryNow=()=>{const root=getListRoot();const hasItems=root&&root.querySelector('li ul.item');if(hasItems)resolve(root);else setTimeout(tryNow,300)};tryNow()})}(async function init(){createControlPanel();await waitForList();runSort();const root=getListRoot();if(root){const obs=new MutationObserver((muts)=>{if(muts.some(m=>m.addedNodes&&m.addedNodes.length)){if(init._debounce)clearTimeout(init._debounce);init._debounce=setTimeout(runSort,500)}});obs.observe(root,{childList:!0})}})()})()