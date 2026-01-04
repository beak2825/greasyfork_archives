// ==UserScript==
// @name         Torn Chain Timer Panic Alerts (no API)
// @namespace    https://mayhemhub.net/
// @version      1.3.2
// @author       IAMAPEX [2523988]
// @description  Watches the on-page chain timer and fires obnoxious alerts at low timer.
// @match        https://www.torn.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/553831/Torn%20Chain%20Timer%20Panic%20Alerts%20%28no%20API%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553831/Torn%20Chain%20Timer%20Panic%20Alerts%20%28no%20API%29.meta.js
// ==/UserScript==

(function(){'use strict';const LS_KEY='torn_chain_alert_cfg_v130';const defaultCfg={thresholds:[30],enableSound:!0,enableFlash:!0,volume:0.8,snoozeMinutes:2,panel:{x:16,y:120,minimized:!1}};let cfg=loadCfg();function loadCfg(){try{const raw=localStorage.getItem(LS_KEY);if(!raw)return{...defaultCfg};const parsed=JSON.parse(raw);return{...defaultCfg,...parsed,panel:{...defaultCfg.panel,...(parsed.panel||{})}}}catch(e){return{...defaultCfg}}}
function saveCfg(){localStorage.setItem(LS_KEY,JSON.stringify(cfg))}
const panel=document.createElement('div');panel.id='chainAlertPanel';panel.innerHTML=`
    <div class="cap-header">
      <span class="cap-title">⚠️ Chain Alerts</span>
      <div class="cap-actions">
        <button class="cap-btn cap-test" title="Test alert">Test</button>
        <button class="cap-btn cap-stop" title="Stop alert">Stop</button>
        <button class="cap-btn cap-min" title="Minimize/Expand">—</button>
        <button class="cap-btn cap-hide" title="Hide panel">✕</button>
      </div>
    </div>
    <div class="cap-body">
      <label class="cap-row">
        <span>Thresholds (sec):</span>
        <input type="text" class="cap-input cap-thresholds" placeholder="45,30,15">
      </label>
      <label class="cap-row">
        <span>Volume:</span>
        <input type="range" min="0" max="1" step="0.05" class="cap-input cap-volume">
        <span class="cap-vol-val"></span>
      </label>
      <div class="cap-row cap-toggles">
        <label><input type="checkbox" class="cap-checkbox cap-sound"> Sound</label>
        <label><input type="checkbox" class="cap-checkbox cap-flash"> Flash</label>
      </div>
      <div class="cap-row">
        <span>Snooze (min):</span>
        <input type="number" min="1" max="30" class="cap-input cap-snooze">
        <button class="cap-btn cap-snooze-btn">Snooze</button>
      </div>
      <div class="cap-note">Alerts when chain time ≤ any threshold. Auto re-arms when timer jumps up.</div>
    </div>
  `;document.body.appendChild(panel);GM_addStyle(`
    #chainAlertPanel {
      position: fixed; z-index: 999999; width: 310px; background: #0b0f14; color: #e9f1ff;
      border: 1px solid #24303d; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      font: 13px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Arial; user-select: none;
    }
    #chainAlertPanel .cap-header {
      background: #101926; padding: 8px 10px; border-bottom: 1px solid #24303d; cursor: move;
      display:flex; align-items:center; justify-content:space-between; border-top-left-radius:10px; border-top-right-radius:10px;
    }
    #chainAlertPanel.min .cap-header { border-bottom: none; }
    #chainAlertPanel .cap-title { font-weight: 600; }
    #chainAlertPanel .cap-actions .cap-btn { margin-left: 6px; }
    #chainAlertPanel .cap-body { padding: 10px; }
    #chainAlertPanel.min .cap-body { display: none; }
    #chainAlertPanel .cap-row { display:flex; align-items:center; gap:8px; margin: 8px 0; }
    #chainAlertPanel .cap-input { flex: 1; padding:6px 8px; border:1px solid #2a3b4d; background:#0f1622; color:#e9f1ff; border-radius:6px; }
    #chainAlertPanel .cap-volume { flex:1; }
    #chainAlertPanel .cap-vol-val { width:34px; text-align:right; }
    #chainAlertPanel .cap-checkbox { transform: translateY(1px); }
    #chainAlertPanel .cap-btn {
      padding: 5px 8px; background:#1a2a3b; color:#e9f1ff; border:1px solid #2d4158; border-radius:6px; cursor:pointer;
    }
    #chainAlertPanel .cap-btn:hover { background:#233a54; }
    #chainAlertPanel .cap-hide { background:#3a1620; border-color:#5d2230; }
    #chainAlertPanel .cap-hide:hover { background:#561a27; }
    #chainAlertPanel .cap-note { opacity:0.75; font-size:12px; }
    #chainAlertPanel .cap-toggles { justify-content: space-between; }
  `);function placePanel(){panel.style.left=(cfg.panel.x||16)+'px';panel.style.top=(cfg.panel.y||120)+'px';panel.classList.toggle('min',!!cfg.panel.minimized)}
placePanel();const inputThresholds=panel.querySelector('.cap-thresholds');const inputVolume=panel.querySelector('.cap-volume');const spanVolVal=panel.querySelector('.cap-vol-val');const cbSound=panel.querySelector('.cap-sound');const cbFlash=panel.querySelector('.cap-flash');const inputSnooze=panel.querySelector('.cap-snooze');inputThresholds.value=cfg.thresholds.join(',');inputVolume.value=cfg.volume.toString();spanVolVal.textContent=Math.round(cfg.volume*100);cbSound.checked=cfg.enableSound;cbFlash.checked=cfg.enableFlash;inputSnooze.value=cfg.snoozeMinutes;inputThresholds.addEventListener('change',()=>{cfg.thresholds=inputThresholds.value.split(',').map(s=>parseInt(s.trim(),10)).filter(n=>!isNaN(n)&&n>0).sort((a,b)=>b-a);saveCfg()});inputVolume.addEventListener('input',()=>{cfg.volume=Math.max(0,Math.min(1,parseFloat(inputVolume.value||'0')));spanVolVal.textContent=Math.round(cfg.volume*100);setGain(cfg.volume);saveCfg()});cbSound.addEventListener('change',()=>{cfg.enableSound=cbSound.checked;saveCfg()});cbFlash.addEventListener('change',()=>{cfg.enableFlash=cbFlash.checked;saveCfg()});inputSnooze.addEventListener('change',()=>{const v=parseInt(inputSnooze.value,10);cfg.snoozeMinutes=(!isNaN(v)&&v>0)?v:defaultCfg.snoozeMinutes;inputSnooze.value=cfg.snoozeMinutes;saveCfg()});(function makeDraggable(){const header=panel.querySelector('.cap-header');let dragging=!1,startX=0,startY=0,startLeft=0,startTop=0;header.addEventListener('mousedown',(e)=>{const tgt=e.target;if(tgt&&typeof tgt.closest==='function'&&tgt.closest('.cap-actions'))return;dragging=!0;startX=e.clientX;startY=e.clientY;const rect=panel.getBoundingClientRect();startLeft=rect.left;startTop=rect.top;e.preventDefault()});window.addEventListener('mousemove',(e)=>{if(!dragging)return;const dx=e.clientX-startX,dy=e.clientY-startY;panel.style.left=(startLeft+dx)+'px';panel.style.top=(startTop+dy)+'px'});window.addEventListener('mouseup',()=>{if(dragging){dragging=!1;const rect=panel.getBoundingClientRect();cfg.panel.x=Math.max(0,Math.min(window.innerWidth-rect.width,rect.left));cfg.panel.y=Math.max(0,Math.min(window.innerHeight-rect.height,rect.top));saveCfg()}})})();panel.querySelector('.cap-test').addEventListener('click',()=>triggerAlerts('TEST'));panel.querySelector('.cap-stop').addEventListener('click',stopAlerts);panel.querySelector('.cap-hide').addEventListener('click',()=>panel.style.display='none');panel.querySelector('.cap-min').addEventListener('click',toggleMinimize);panel.querySelector('.cap-snooze-btn').addEventListener('click',()=>snooze(cfg.snoozeMinutes));function toggleMinimize(){cfg.panel.minimized=!cfg.panel.minimized;panel.classList.toggle('min',cfg.panel.minimized);saveCfg()}
let flashEl=null,flashTimer=null;function ensureFlashEl(){if(flashEl)return;flashEl=document.createElement('div');flashEl.id='chainFlashOverlay';flashEl.style.cssText=`
      position: fixed; inset: 0; z-index: 999998; pointer-events:none; opacity:0;
      background: repeating-linear-gradient(45deg, rgba(255,255,255,0.9) 0 20px, rgba(200,0,0,0.9) 20px 40px);
      mix-blend-mode: screen; transition: opacity .12s linear;`;document.body.appendChild(flashEl)}
function startFlash(){if(!cfg.enableFlash)return;ensureFlashEl();let on=!1;if(flashTimer)clearInterval(flashTimer);flashTimer=setInterval(()=>{on=!on;flashEl.style.opacity=on?'0.85':'0.2'},120)}
function stopFlash(){if(flashTimer)clearInterval(flashTimer);flashTimer=null;if(flashEl)flashEl.style.opacity='0'}
let audioCtx=null,osc=null,gainNode=null,sirenTimer=null;function ensureAudio(){if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();if(!gainNode){gainNode=audioCtx.createGain();gainNode.gain.value=cfg.volume;gainNode.connect(audioCtx.destination)}
if(!osc){osc=audioCtx.createOscillator();osc.type='square';osc.frequency.value=600;osc.connect(gainNode);try{osc.start()}catch(_){}}}
function setGain(v){if(gainNode)gainNode.gain.value=v}
function startSiren(){if(!cfg.enableSound)return;ensureAudio();let high=!1;if(sirenTimer)clearInterval(sirenTimer);sirenTimer=setInterval(()=>{high=!high;if(!osc)return;const target=high?1200:400;try{osc.frequency.setTargetAtTime(target,audioCtx.currentTime,0.03)}catch(_){osc.frequency.value=target}},250)}
function stopSiren(){if(sirenTimer)clearInterval(sirenTimer);sirenTimer=null;if(gainNode)gainNode.gain.value=0.0001}
let active=!1,lastTimerValue=null,triggeredFor=new Set(),snoozedUntil=0;function triggerAlerts(){if(Date.now()<snoozedUntil)return;active=!0;if(cfg.enableSound){setGain(cfg.volume);startSiren()}if(cfg.enableFlash)startFlash();}
function stopAlerts(){active=!1;stopSiren();stopFlash()}
function snooze(minutes=2){stopAlerts();snoozedUntil=Date.now()+Math.max(1,minutes|0)*60*1000}
function findChainTimerEl(){const candidates=Array.from(document.querySelectorAll('a[href*="/war/chain"], a[class*="chain-bar"]'));for(const a of candidates){const p=a.querySelector('p[class*="bar-time"], p, span');if(!p)continue;const txt=(p.textContent||'').trim();if(/^\d{1,2}:\d{2}$/.test(txt))return p;const t=(a.innerText||'').match(/\b\d{1,2}:\d{2}\b/);if(t)return p}
const blocks=Array.from(document.querySelectorAll('p, span, div'));for(const el of blocks){const txt=(el.textContent||'').trim();if(/^Chain:$/i.test(txt)){const parent=el.closest('a, div, section')||el.parentElement;if(!parent)continue;const timer=Array.from(parent.querySelectorAll('p, span')).find(n=>/^\d{1,2}:\d{2}$/.test((n.textContent||'').trim()));if(timer)return timer}}
return null}
function parseTimeToSeconds(text){const m=(text||'').trim().match(/^(\d{1,2}):(\d{2})$/);if(!m)return null;const mm=parseInt(m[1],10),ss=parseInt(m[2],10);if(isNaN(mm)||isNaN(ss))return null;return mm*60+ss}
function handleTimerProgress(secondsNow){if(lastTimerValue==null){lastTimerValue=secondsNow;return}
if(secondsNow>lastTimerValue+2){triggeredFor.clear();stopAlerts()}
lastTimerValue=secondsNow}
let timerEl=null;const obs=new MutationObserver(()=>{if(!timerEl||!document.contains(timerEl)){timerEl=findChainTimerEl()}});obs.observe(document.documentElement,{childList:!0,subtree:!0});setInterval(()=>{if(!timerEl||!document.contains(timerEl)){timerEl=findChainTimerEl();return}
let txt=(timerEl.textContent||'').trim();if(!/^\d{1,2}:\d{2}$/.test(txt)){const a=timerEl.closest('a');if(a){const m=(a.innerText||'').match(/\b\d{1,2}:\d{2}\b/);if(m)txt=m[0]}}
const sec=parseTimeToSeconds(txt);if(sec==null)return;handleTimerProgress(sec);if(Date.now()<snoozedUntil)return;for(const th of cfg.thresholds){if(!triggeredFor.has(th)&&sec<=th){triggeredFor.add(th);triggerAlerts()}}},250);window.addEventListener('keydown',(e)=>{if(e.ctrlKey&&e.altKey&&e.key.toLowerCase()==='a'){if(active)stopAlerts();else triggerAlerts()}
if(e.ctrlKey&&e.altKey&&e.key.toLowerCase()==='s'){snooze(cfg.snoozeMinutes)}
if(e.ctrlKey&&e.altKey&&e.key.toLowerCase()==='p'){panel.style.display='block'}
if(e.ctrlKey&&e.altKey&&e.key.toLowerCase()==='m'){toggleMinimize()}});stopSiren()})()