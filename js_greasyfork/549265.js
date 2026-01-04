// ==UserScript==
// @name         Twitch Portrait Mode — Vertical Layout + Wheel Volume
// @namespace    https://github.com/Fahaddz/browser-scripts
// @version      1.1.0
// @description  Portrait/tall layout for Twitch on narrow windows. Draggable player height + mouse-wheel volume and middle-click mute. Volume wheel step is configurable.
// @author       Fahaddz
// @match        https://www.twitch.tv/*
// @match        https://clips.twitch.tv/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @homepageURL  https://github.com/Fahaddz/browser-scripts
// @downloadURL https://update.greasyfork.org/scripts/549265/Twitch%20Portrait%20Mode%20%E2%80%94%20Vertical%20Layout%20%2B%20Wheel%20Volume.user.js
// @updateURL https://update.greasyfork.org/scripts/549265/Twitch%20Portrait%20Mode%20%E2%80%94%20Vertical%20Layout%20%2B%20Wheel%20Volume.meta.js
// ==/UserScript==

(function() {
	'use strict';
	const STORAGE_KEYS = {enabled:'tp_enabled',invert:'tp_invert',threshold:'tp_threshold',compact:'tp_compact'};
	const DEFAULTS = {enabled:true,invert:false,threshold:1.25,compact:false};
	let state = {enabled:read('enabled',DEFAULTS.enabled),invert:read('invert',DEFAULTS.invert),threshold:readNumber('threshold',DEFAULTS.threshold),compact:read('compact',DEFAULTS.compact),isPortraitActive:false,isTheaterMode:false,isResizing:false,overrideHeightPx:null,resizeHandleEl:null,playerBoxEl:null,volApi:null,volEl:null,volTimer:null};
	let menuIds = [];
	let disconnectors = [];
	let resizeRaf = null;
	let cssNode = null;
	const PORTRAIT_ROUTES = new Set(['user','video','user-video','user-clip','user-videos','user-clips','user-collections','user-events','user-followers','user-following']);

	function read(key,fallback){try{const v=GM_getValue(STORAGE_KEYS[key]);return typeof v==='undefined'?fallback:!!v;}catch{return fallback;}}
	function readNumber(key,fallback){try{const v=GM_getValue(STORAGE_KEYS[key]);if(v==null)return fallback;const n=parseFloat(v);return Number.isFinite(n)&&n>0?n:fallback;}catch{return fallback;}}
	function write(key,value){try{GM_setValue(STORAGE_KEYS[key],value);}catch{}}
	function addStyle(id,css){let node=document.getElementById(id);if(!node){node=document.createElement('style');node.id=id;node.type='text/css';document.documentElement.appendChild(node);}node.textContent=css;return node;}
	function onResize(){if(resizeRaf)return;resizeRaf=requestAnimationFrame(()=>{resizeRaf=null;updateActivation();updateVariables();positionHandle();});}
	function onLocationChange(){updateActivation();updateVariables();positionHandle();attachVolume();}
	function observeLocation(){let last=location.href;const obs=new MutationObserver(()=>{if(location.href!==last){last=location.href;onLocationChange();}});obs.observe(document,{subtree:true,childList:true});disconnectors.push(()=>obs.disconnect());}
	function observePlayer(){const obs=new MutationObserver(()=>attachVolume());obs.observe(document.body,{subtree:true,childList:true});disconnectors.push(()=>obs.disconnect());}
	function currentRouteName(){const h=location.host;const p=location.pathname.replace(/^\/+/,'');if(h==='clips.twitch.tv')return'user-clip';if(p==='')return null;const parts=p.split('/');if(parts.length===1)return'user';if(parts[0]==='videos')return'user-videos';if(parts[0]==='clips')return'user-clips';if(parts[0]==='collections')return'user-collections';if(parts[0]==='events')return'user-events';if(parts[0]==='followers')return'user-followers';if(parts[0]==='following')return'user-following';if(parts[0]==='video')return'video';return'user';}
	function isWatchParty(){return false;}
	function isFullscreen(){return !!document.fullscreenElement;}
	function detectTheaterMode(){const body=document.body;if(!body)return false;return body.classList.contains('theatre-mode')||!!document.querySelector('.persistent-player--theatre,.channel-page__video-player--theatre-mode');}
	function updateActivation(){const route=currentRouteName();const size={width:window.innerWidth,height:window.innerHeight};const ratio=size.width/size.height;state.isTheaterMode=detectTheaterMode();const shouldUsePortrait=state.enabled&&!isWatchParty()&&!!route&&PORTRAIT_ROUTES.has(route)&&ratio<=state.threshold;togglePortrait(shouldUsePortrait);toggleInvert(state.invert&&shouldUsePortrait);toggleCompact(state.compact&&shouldUsePortrait);ensureResizer();attachVolume();}
	function togglePortrait(on){state.isPortraitActive=on;document.documentElement.classList.toggle('tp--portrait',on);}
	function toggleInvert(on){document.body.classList.toggle('tp--portrait-invert',on);}
	function toggleCompact(on){document.body.classList.toggle('tp--portrait-compact',on);}
	function updateVariables(){if(!state.isPortraitActive)return;const extra=computePortraitExtras();document.documentElement.style.setProperty('--tp-portrait-extra-height',`${extra.height}rem`);document.documentElement.style.setProperty('--tp-portrait-extra-width',`${extra.width}rem`);}
	function computePortraitExtras(){let height=0;if(isFullscreen())return{height:0,width:0};if(state.isTheaterMode){if(hasMinimalTopNav())height+=1;if(hasWhispers()&&!theatreNoWhispers())height+=4;}else{height+=hasMinimalTopNav()?1:5;if(hasWhispers())height+=4;if(hasSquadBar())height+=6;height+=isNewChannelHeader()?1:5;}return{height,width:0};}
	function hasMinimalTopNav(){return !!document.querySelector('[data-test-selector="top-nav-bar"]');}
	function hasWhispers(){return !!document.querySelector('.whispers,.whispers--theatre-mode');}
	function theatreNoWhispers(){return false;}
	function hasSquadBar(){return !!document.querySelector('[data-test-selector="squad-stream-bar"]');}
	function isNewChannelHeader(){return !!document.querySelector('[data-a-target="core-channel-header"],[data-a-target="channel-header"]');}
	function buildCSS(){return`:root{--tp-player-width:calc(100vw - var(--tp-portrait-extra-width));--tp-player-height-default:calc(calc(var(--tp-player-width) * 0.5625) + var(--tp-portrait-extra-height));--tp-player-height:var(--tp-player-height-override, var(--tp-player-height-default));--tp-theatre-height-default:calc(calc(100vw * 0.5625) + var(--tp-portrait-extra-height));--tp-theatre-height:var(--tp-theatre-height-override, var(--tp-theatre-height-default));--tp-chat-height:calc(100vh - var(--tp-player-height));--tp-portrait-extra-height:0rem;--tp-portrait-extra-width:0rem;}
.tp--portrait .chat-shell .ffz--chat-card{--width:max(30rem, min(50%, calc(1.5 * var(--ffz-chat-width, 34rem))));width:var(--width);margin-left:min(2rem, calc(100% - calc(4rem + var(--width))));}
.tp--portrait body>div#root>div:first-child>div[class^="Layout-sc"]{height:var(--tp-player-height)!important;}
.tp--portrait.tp--portrait-invert body>div#root>div:first-child>div[class^="Layout-sc"]{position:absolute;left:0;right:0;bottom:0;top:var(--tp-chat-height)!important;}
.tp--portrait .channel-root__player--with-chat{max-height:var(--tp-player-height)!important;}
.tp--portrait .persistent-player.persistent-player__border--mini{pointer-events:none;}
.tp--portrait body:not(.tp--portrait-invert) .persistent-player.persistent-player__border--mini{bottom:var(--tp-chat-height)!important;}
.tp--portrait .persistent-player.persistent-player__border--mini>*{pointer-events:auto;}
.tp--portrait .picture-by-picture-player{position:absolute;z-index:100;top:0;right:5rem;height:20vh;width:calc(20vh * calc(16 / 9))!important;}
.tp--portrait .persistent-player.persistent-player--theatre{left:0!important;right:0!important;height:var(--tp-theatre-height)!important;width:100%!important;}
.tp--portrait.tp--portrait-invert .persistent-player.persistent-player--theatre{top:unset!important;bottom:0!important;}
.tp--portrait body:not(.tp--portrait-invert) .persistent-player.persistent-player--theatre{top:0!important;bottom:unset!important;}
.tp--portrait .whispers--theatre-mode{bottom:0!important;right:0!important;}
.tp--portrait .channel-root__right-column--expanded{min-height:unset!important;}
.tp--portrait .right-column{display:unset!important;position:fixed!important;z-index:2000;bottom:0!important;left:0!important;right:0!important;height:var(--tp-chat-height)!important;width:unset!important;}
.tp--portrait body:not(.tp--portrait-invert) .right-column{top:unset!important;bottom:0!important;border-top:1px solid var(--color-border-base);}
.tp--portrait.tp--portrait-invert .right-column{top:0!important;bottom:unset!important;border-bottom:1px solid var(--color-border-base);}
.tp--portrait .right-column>.tw-full-height{width:100%!important;}
.tp--portrait .right-column.right-column--theatre{height:calc(100vh - var(--tp-theatre-height))!important;}
.tp--portrait .right-column.right-column--theatre .emote-picker__nav-content-overflow,.tp--portrait .right-column.right-column--theatre .emote-picker__tab-content{max-height:calc(calc(100vh - var(--tp-theatre-height)) - 26rem);}
.tp--portrait .video-chat{flex-basis:unset;}
.tp--portrait .video-watch-page__right-column,.tp--portrait .clips-watch-page__right-column,.tp--portrait .channel-videos__right-column,.tp--portrait .channel-clips__sidebar,.tp--portrait .channel-events__sidebar,.tp--portrait .channel-follow-listing__right-column,.tp--portrait .channel-root__right-column,.tp--portrait .channel-page__right-column{width:100%!important;}
.tp--portrait .video-watch-page__right-column>div,.tp--portrait .clips-watch-page__right-column>div,.tp--portrait .channel-videos__right-column>div,.tp--portrait .channel-clips__sidebar>div,.tp--portrait .channel-events__sidebar>div,.tp--portrait .channel-follow-listing__right-column>div,.tp--portrait .channel-root__right-column>div,.tp--portrait .channel-page__right-column>div{border-left:none!important;}
.tp--portrait.tp--portrait-compact .chat-input>div:last-child{display:flex;}
.tp--portrait.tp--portrait-compact .chat-input>div:last-child>div{flex-grow:3;align-self:flex-end;}
.tp--portrait.tp--portrait-compact .chat-input>div:last-child .chat-input__buttons-container{flex-grow:1;margin-top:0!important;margin-bottom:0.5rem;margin-left:1rem;}
.tp--portrait.tp--portrait-compact .right-column:not(.right-column--collapsed) .right-column__toggle-visibility{top:0;}
.tp--portrait.tp--portrait-compact .chat-viewers__header,.tp--portrait.tp--portrait-compact .stream-chat-header{height:3rem!important;}
.tp--portrait .tp--playerbox{position:relative;}
.tp--portrait .tp-resize-handle{position:absolute;left:0;right:0;width:100%;height:2px;bottom:0;cursor:ns-resize;background:rgba(255,255,255,0.04);border-radius:4px 4px 0 0;z-index:3000;}
.tp--portrait .tp-resize-handle:hover{height:6px;background:rgba(255,255,255,0.25);}`;}
	function rebuildStyles(){const css=buildCSS();cssNode=addStyle('tp-portrait-style',css);updateVariables();}
	function registerMenus(){clearMenus();menuIds.push(GM_registerMenuCommand(`[${state.enabled?'✓':' '}] Enable Portrait Mode`,()=>{state.enabled=!state.enabled;write('enabled',state.enabled);updateActivation();updateVariables();registerMenus();}));menuIds.push(GM_registerMenuCommand(`[${state.invert?'✓':' '}] Invert (Chat on Top)`,()=>{state.invert=!state.invert;write('invert',state.invert);updateActivation();updateVariables();registerMenus();}));menuIds.push(GM_registerMenuCommand(`Set Threshold (current: ${state.threshold})`,()=>{const val=prompt('Portrait Mode Threshold (Width / Height). Default 1.25',String(state.threshold));if(val===null)return;const n=parseFloat(val);if(!Number.isFinite(n)||n<=0)return;state.threshold=n;write('threshold',n);updateActivation();updateVariables();registerMenus();}));menuIds.push(GM_registerMenuCommand(`[${state.compact?'✓':' '}] Compact Chat in Portrait`,()=>{state.compact=!state.compact;write('compact',state.compact);updateActivation();updateVariables();registerMenus();}));menuIds.push(GM_registerMenuCommand(`Reset Player Size`,()=>{state.overrideHeightPx=null;applyHeightOverride();updateVariables();}));}
	function clearMenus(){try{for(const id of menuIds)GM_unregisterMenuCommand(id);}catch{}menuIds=[];}
	function init(){rebuildStyles();registerMenus();window.addEventListener('resize',onResize,{passive:true});disconnectors.push(()=>window.removeEventListener('resize',onResize));observeLocation();observePlayer();updateActivation();updateVariables();ensureResizer();attachVolume();}
	function ensureResizer(){if(!state.isPortraitActive)return removeResizer();const box=document.querySelector('body>div#root>div:first-child>div[class^="Layout-sc"]');if(!box)return;if(state.playerBoxEl&&state.playerBoxEl!==box)removeResizer();state.playerBoxEl=box;box.classList.add('tp--playerbox');if(!state.resizeHandleEl){const handle=document.createElement('div');handle.className='tp-resize-handle';handle.addEventListener('mousedown',startResize,{passive:false});handle.addEventListener('dblclick',()=>{state.overrideHeightPx=null;applyHeightOverride();updateVariables();positionHandle();});box.appendChild(handle);state.resizeHandleEl=handle;}positionHandle();}
	function removeResizer(){if(state.resizeHandleEl&&state.resizeHandleEl.parentNode)state.resizeHandleEl.parentNode.removeChild(state.resizeHandleEl);state.resizeHandleEl=null;if(state.playerBoxEl)state.playerBoxEl.classList.remove('tp--playerbox');state.playerBoxEl=null;}
	function positionHandle(){if(!state.resizeHandleEl||!state.playerBoxEl||!state.isPortraitActive)return;state.resizeHandleEl.style.left='0px';state.resizeHandleEl.style.right='0px';state.resizeHandleEl.style.width='100%';state.resizeHandleEl.style.height='';state.resizeHandleEl.style.bottom='0px';state.resizeHandleEl.style.top='';state.resizeHandleEl.style.transform='none';state.resizeHandleEl.style.zIndex='3000';}
	function startResize(e){e.preventDefault();if(!state.playerBoxEl)return;state.isResizing=true;document.body.style.userSelect='none';document.body.style.cursor='ns-resize';const startY=e.clientY;const rect=state.playerBoxEl.getBoundingClientRect();const startH=rect.height;const onMove=ev=>{if(!state.isResizing)return;const dy=ev.clientY-startY;let newH=Math.round(startH+dy);const minH=Math.round(window.innerHeight*0.2);const maxH=Math.round(window.innerHeight*0.95);if(newH<minH)newH=minH;if(newH>maxH)newH=maxH;state.overrideHeightPx=newH;applyHeightOverride();updateVariables();positionHandle();};const onUp=()=>{state.isResizing=false;document.body.style.userSelect='';document.body.style.cursor='';document.removeEventListener('mousemove',onMove);document.removeEventListener('mouseup',onUp);};document.addEventListener('mousemove',onMove);document.addEventListener('mouseup',onUp);}
	function applyHeightOverride(){const root=document.documentElement;if(state.overrideHeightPx&&state.overrideHeightPx>0){root.style.setProperty('--tp-player-height-override',state.overrideHeightPx+'px');root.style.setProperty('--tp-theatre-height-override',state.overrideHeightPx+'px');}else{root.style.removeProperty('--tp-player-height-override');root.style.removeProperty('--tp-theatre-height-override');}}
	function getPlayerApi(){const sel='div[data-a-target="player-overlay-click-handler"], .video-player';const el=document.querySelector(sel);if(!el)return null;let inst;for(const k in el){if(k.startsWith('__reactFiber$')||k.startsWith('__reactInternalInstance$')){inst=el[k];break;}}if(!inst)return null;let p=inst.return;for(let i=0;i<80&&p;i++){const m=p.memoizedProps&&p.memoizedProps.mediaPlayerInstance;if(m&&m.core)return m.core;p=p.return;}return null;}
	function slider(){return document.querySelector('[data-a-target="player-volume-slider"]');}
	function showVolUI(){const s=slider();if(!s)return;s.dispatchEvent(new Event('focusin',{bubbles:true}));clearTimeout(state.volTimer);state.volTimer=setTimeout(()=>s.dispatchEvent(new Event('mouseout',{bubbles:true})),1000);}
	function attachVolume(){const api=getPlayerApi();const catcher=document.querySelector('.video-ref');if(!api||!catcher)return;if(state.volEl===catcher&&state.volApi===api)return;if(state.volEl){state.volEl.removeEventListener('wheel',onWheel);state.volEl.removeEventListener('mousedown',onMouseDown);}state.volApi=api;state.volEl=catcher;state.volEl.addEventListener('wheel',onWheel);state.volEl.addEventListener('mousedown',onMouseDown);}
	function onWheel(e){e.preventDefault();e.stopImmediatePropagation();if(!state.volApi)return;const up=e.deltaY<0;let v=state.volApi.getVolume();if(state.volApi.isMuted()&&up)state.volApi.setMuted(false);v+=up?0.05:-0.05;if(v<0)v=0;if(v>1)v=1;state.volApi.setVolume(v);showVolUI();}
	function onMouseDown(e){if(e.button!==1||!state.volApi)return;e.preventDefault();state.volApi.setMuted(!state.volApi.isMuted());showVolUI();}
	if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init,{once:true});}else{init();}
})();