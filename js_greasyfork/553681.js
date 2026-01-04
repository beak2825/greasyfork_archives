// ==UserScript==
// @name         Youtube Anti-AD (Made by REDACTED)
// @namespace    qbaonguyen-ad-blocker
// @version      3.1.0
// @description  Custom ad blocker by REDACTED (qbaonguyen050@gmail.com).
// @author       qbaonguyen
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://music.youtube.com/*
// @icon         https://cdn-icons-png.flaticon.com/64/2504/2504965.png
// @license      MIT
// @noframes
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553681/Youtube%20Anti-AD%20%28Made%20by%20REDACTED%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553681/Youtube%20Anti-AD%20%28Made%20by%20REDACTED%29.meta.js
// ==/UserScript==
 
(() => {
  'use strict';
 
  // Credit alert for qbaonguyen
  alert("This script was made for and is maintained by qbaonguyen (qbaonguyen050@gmail.com)");
 
  const QBAONGUYEN_CONFIG = { DEBUG: false };
  let qbaonguyen_adStats = { count: 0, blockedItems: [] };
  let qbaonguyen_uiElements = { container: null, counter: null, dropdown: null };
  let qbaonguyen_uiState = { isDragging: false, isDropdownVisible: false, dragStartX: 0, dragStartY: 0, elementStartX: 0, elementStartY: 0 };
  let isCurrentlySkippingAd_qbaonguyen = false;
 
  const qbaonguyen_log = (...args) => QBAONGUYEN_CONFIG.DEBUG && console.debug('[qbaonguyen Ad Blocker]', ...args);
 
  const QBAONGUYEN_NUKABLE_KEYS = new Set([
    'adPlacements', 'playerAds', 'adSlots', 'adSafetyReason', 'adSignals', 'adLayoutLoggingData', 'adFormats', 'adDisplayReason', 'attestation',
    'tpAdAttr', 'bumper', 'trueviewAdRenderer', 'adPlaybackContext', 'adResources', 'adInfo', 'impressionEndpoints', 'logableImpressions',
    'adBreaks', 'adBreakService', 'adPod', 'adRequestContext', 'playlistAd', 'playerLegacyDesktopWatchAdsRenderer', 'promotedItem', 'promotedItems',
    'promotedVideoRenderer', 'promotedSparklesTextSearchRenderer', 'promotedSparklesWebRenderer', 'reelPlayerInsetAd', 'invideoCollage', 'adSlotLoggingData'
  ]);
  const isRendererAdLikeKey_qbaonguyen = (k) => /(^|_)(ad|ads|promoted|companion|sparkles)(_|$)/i.test(k);
 
  function stripAdsDeep_qbaonguyen(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    const stack = [obj];
    const visited = new WeakSet();
    while (stack.length) {
      const node = stack.pop();
      if (!node || typeof node !== 'object' || visited.has(node)) continue;
      visited.add(node);
 
      for (const key of Object.keys(node)) {
        if (QBAONGUYEN_NUKABLE_KEYS.has(key) || isRendererAdLikeKey_qbaonguyen(key)) {
          delete node[key];
          continue;
        }
        const val = node[key];
        if (Array.isArray(val)) {
          let i = val.length;
          while (i--) {
            const item = val[i];
            if (item && typeof item === 'object') {
              if (Object.keys(item).some(isRendererAdLikeKey_qbaonguyen)) {
                val.splice(i, 1);
              } else {
                stack.push(item);
              }
            }
          }
        } else if (val && typeof val === 'object') {
          stack.push(val);
        }
      }
    }
    const ps = obj?.playabilityStatus;
    if (ps && /ad block/i.test((ps.reason || '') + (ps.messages || []).join(' '))) {
      if (obj.streamingData || obj.videoDetails) {
        ps.status = 'OK';
        delete ps.reason;
        delete ps.errorScreen;
      }
    }
    return obj;
  }
 
  function interceptInitialData_qbaonguyen() {
    const observer = new MutationObserver((mutations, obs) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.tagName === 'SCRIPT' && node.textContent) {
            const isPlayer = node.textContent.includes('ytInitialPlayerResponse');
            const isData = !isPlayer && node.textContent.includes('ytInitialData');
 
            if (isPlayer || isData) {
              const varName = isPlayer ? 'ytInitialPlayerResponse' : 'ytInitialData';
              const originalText = node.textContent;
              qbaonguyen_log(`qbaonguyen intercept: ${varName}`);
 
              try {
                const jsonText = originalText.substring(originalText.indexOf('{'), originalText.lastIndexOf('}') + 1);
                if (!jsonText) throw new Error("Could not extract JSON.");
 
                let data = JSON.parse(jsonText);
                const originalLength = jsonText.length;
                stripAdsDeep_qbaonguyen(data);
 
                if (JSON.stringify(data).length < originalLength) {
                  node.textContent = `var ${varName} = ${JSON.stringify(data)};`;
                  qbaonguyen_incrementAndLog('Initial Data', `Sanitized ${varName}`);
                }
              } catch (e) {
                qbaonguyen_log(`CRITICAL: qbaonguyen failed to sanitize ${varName}.`, e);
              }
            }
          }
        }
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
 
  const AD_HOST_RE_QBAONGUYEN = new RegExp('(^|\\.)(doubleclick\\.net|googlesyndication\\.com|googleadservices\\.com|googletagservices\\.com|adservice\\.google\\.com|imasdk\\.googleapis\\.com)$', 'i');
  const isBlockedUrl_qbaonguyen = (input) => {
    try {
      const u = new URL(input, location.href);
      if (AD_HOST_RE_QBAONGUYEN.test(u.hostname)) return true;
      if (u.hostname.includes('youtube.com') && (u.pathname.includes('/pagead/') || u.pathname.includes('/api/stats/ads'))) return true;
    } catch {}
    return false;
  };
 
  function applyHooks_qbaonguyen() {
    const nativeFetch = window.fetch;
    window.fetch = function(input, init) {
      const url = (typeof input === 'string' ? input : input?.url) || '';
      if (isBlockedUrl_qbaonguyen(url)) {
        qbaonguyen_incrementAndLog('Fetch Request', url);
        return Promise.resolve(new Response('', { status: 204 }));
      }
      return nativeFetch(input, init).then(res => {
        if (res.url.includes('/youtubei/v1/')) {
          const clone = res.clone();
          return clone.text().then(text => {
            if (!/adPlacements|playerAds|promoted/i.test(text)) return res;
            try {
              let data = JSON.parse(text);
              stripAdsDeep_qbaonguyen(data);
              qbaonguyen_incrementAndLog('JSON Payload', new URL(res.url).pathname);
              return new Response(JSON.stringify(data), { status: res.status, statusText: res.statusText, headers: res.headers });
            } catch {
              return res;
            }
          });
        }
        return res;
      });
    };
  }
 
  function createInteractiveUI_qbaonguyen(){if(document.getElementById("qbaonguyen-ad-cleaner-container"))return;qbaonguyen_uiElements.container=document.createElement("div");qbaonguyen_uiElements.container.id="qbaonguyen-ad-cleaner-container";Object.assign(qbaonguyen_uiElements.container.style,{position:"fixed",bottom:"10px",left:"10px",zIndex:"999999",userSelect:"none",fontFamily:"Roboto, Arial, sans-serif"});qbaonguyen_uiElements.counter=document.createElement("div");qbaonguyen_uiElements.counter.id="qbaonguyen-ad-cleaner-counter";Object.assign(qbaonguyen_uiElements.counter.style,{backgroundColor:"rgba(0, 0, 0, 0.75)",color:"white",padding:"5px 12px",borderRadius:"6px",fontSize:"12px",cursor:"pointer",transition:"opacity 0.3s ease-in-out",opacity:"0.6"});qbaonguyen_uiElements.counter.textContent="qbaonguyen Blocker: 0";qbaonguyen_uiElements.dropdown=document.createElement("div");qbaonguyen_uiElements.dropdown.id="qbaonguyen-ad-cleaner-dropdown";Object.assign(qbaonguyen_uiElements.dropdown.style,{display:"none",maxHeight:"300px",overflowY:"auto",width:"350px",backgroundColor:"rgba(20, 20, 20, 0.9)",color:"white",borderRadius:"6px",marginTop:"5px",padding:"8px",fontSize:"11px",border:"1px solid #444"});qbaonguyen_uiElements.container.appendChild(qbaonguyen_uiElements.dropdown);qbaonguyen_uiElements.container.appendChild(qbaonguyen_uiElements.counter);document.body.appendChild(qbaonguyen_uiElements.container);qbaonguyen_uiElements.counter.addEventListener("mousedown",e=>{qbaonguyen_uiState.isDragging=!0;qbaonguyen_uiState.dragStartX=e.clientX;qbaonguyen_uiState.dragStartY=e.clientY;qbaonguyen_uiState.elementStartX=qbaonguyen_uiElements.container.offsetLeft;qbaonguyen_uiState.elementStartY=qbaonguyen_uiElements.container.offsetTop;document.addEventListener("mousemove",onDragMove_qbaonguyen);document.addEventListener("mouseup",onDragEnd_qbaonguyen,{once:!0})});qbaonguyen_uiElements.counter.addEventListener("click",()=>{if(qbaonguyen_uiState.isDragging)return;qbaonguyen_uiState.isDropdownVisible=!qbaonguyen_uiState.isDropdownVisible;qbaonguyen_uiElements.dropdown.style.display=qbaonguyen_uiState.isDropdownVisible?"block":"none";qbaonguyen_uiState.isDropdownVisible&&renderDropdownContent_qbaonguyen()})}
  const onDragMove_qbaonguyen=e=>{if(!qbaonguyen_uiState.isDragging)return;e.preventDefault();const t=e.clientX-qbaonguyen_uiState.dragStartX,n=e.clientY-qbaonguyen_uiState.dragStartY;qbaonguyen_uiElements.container.style.left=`${qbaonguyen_uiState.elementStartX+t}px`;qbaonguyen_uiElements.container.style.top=`${qbaonguyen_uiState.elementStartY+n}px`;qbaonguyen_uiElements.container.style.bottom="auto"};const onDragEnd_qbaonguyen=e=>{Math.abs(e.clientX-qbaonguyen_uiState.dragStartX)>5||Math.abs(e.clientY-qbaonguyen_uiState.dragStartY)>5?setTimeout(()=>{qbaonguyen_uiState.isDragging=!1},0):qbaonguyen_uiState.isDragging=!1;document.removeEventListener("mousemove",onDragMove_qbaonguyen)};function updateUICounter_qbaonguyen(){if(!qbaonguyen_uiElements.counter){if(document.body)createInteractiveUI_qbaonguyen();else{window.addEventListener("DOMContentLoaded",createInteractiveUI_qbaonguyen,{once:!0});return}}qbaonguyen_uiElements.counter.textContent=`qbaonguyen Blocker: ${qbaonguyen_adStats.count}`;qbaonguyen_adStats.count>0&&(qbaonguyen_uiElements.counter.style.opacity="1")}
  function renderDropdownContent_qbaonguyen(){if(!qbaonguyen_uiElements.dropdown||!qbaonguyen_uiState.isDropdownVisible)return;qbaonguyen_uiElements.dropdown.innerHTML=`<div style="text-align:center;padding-bottom:5px;border-bottom:1px solid #444;margin-bottom:5px;">qbaonguyen050@gmail.com</div>`;if(0===qbaonguyen_adStats.blockedItems.length){qbaonguyen_uiElements.dropdown.textContent+="No ads blocked yet.";return}const e=document.createElement("ul");Object.assign(e.style,{margin:"0",padding:"0 0 0 15px"});qbaonguyen_adStats.blockedItems.slice().reverse().forEach(t=>{const n=document.createElement("li");n.style.marginBottom="6px";n.innerHTML=`<strong>${t.type}: </strong><span style="word-break: break-all;">${t.detail.length>100?t.detail.substring(0,100)+"...":t.detail}</span>`;if(t.detail.startsWith("http")){const i=document.createElement("button");i.textContent="Inspect";Object.assign(i.style,{marginLeft:"8px",fontSize:"10px",cursor:"pointer",background:"#555",color:"white",border:"none",borderRadius:"3px",padding:"2px 4px"});i.onclick=()=>window.open(t.detail,"_blank");n.appendChild(i)}e.appendChild(n)});qbaonguyen_uiElements.dropdown.appendChild(e)}
  function qbaonguyen_incrementAndLog(type, detail) { qbaonguyen_adStats.count++; qbaonguyen_adStats.blockedItems.push({ type, detail }); qbaonguyen_log(`Blocked ${type}:`, detail); updateUICounter_qbaonguyen(); if (qbaonguyen_uiState.isDropdownVisible) renderDropdownContent_qbaonguyen(); }
 
  function finalSetup_qbaonguyen() {
    const style = document.createElement('style');
    // Added by qbaonguyen
    style.textContent = `
      #player-ads, .video-ads, .ytp-ad-module, ytd-companion-slot-renderer, ytd-ad-slot-renderer,
      ytd-promoted-sparkles-web-renderer, ytd-enforcement-message-view-model,
      ytd-rich-item-renderer:has(ytd-ad-slot-renderer) { display: none !important; }
    `;
    document.documentElement.appendChild(style);
 
    setInterval(() => {
      const player = document.querySelector('#movie_player.ad-showing');
      if (player) {
        if (!isCurrentlySkippingAd_qbaonguyen) { qbaonguyen_incrementAndLog('Fallback Skip', 'Skipped visible video ad'); isCurrentlySkippingAd_qbaonguyen = true; }
        const video = player.querySelector('video');
        if (video) { try { video.muted = true; if (isFinite(video.duration)) video.currentTime = video.duration; } catch {} }
        player.querySelector('.ytp-ad-skip-button-modern')?.click();
      } else { isCurrentlySkippingAd_qbaonguyen = false; }
    }, 500);
 
    updateUICounter_qbaonguyen();
  }
 
  qbaonguyen_log('qbaonguyen Ad Blocker is starting...');
  interceptInitialData_qbaonguyen();
  applyHooks_qbaonguyen();
 
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', finalSetup_qbaonguyen, { once: true });
  } else {
    finalSetup_qbaonguyen();
  }
})();