// ==UserScript==
// @name 🔊 Cristal Volume Control
// @description Take full control of volume. Boost up to 200%, sync across tabs, and never lose your settings.
// @license MIT
// @namespace CVC
// @version 3.6
// @match *://*/*
// @grant none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/562693/%F0%9F%94%8A%20Cristal%20Volume%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/562693/%F0%9F%94%8A%20Cristal%20Volume%20Control.meta.js
// ==/UserScript==

(function(){
	'use strict';

	const STEP=0.05;
	const MAX=2.0;
	const STORAGE_KEY_VOL='CVC_volume_local_'+location.hostname;
	const STORAGE_KEY_IS_GLOBAL='CVC_mode_is_global';
	const BC_NAME='CVC_vol_channel';

	// STATES
	let audioCtx,gainNode,limiterNode;
	let channel=new BroadcastChannel(BC_NAME);
	let knownMediaElements=new Set();
	let audioContextReady=false;
	let titleObserver=null;
	let savedLocalVolume=parseFloat(localStorage.getItem(STORAGE_KEY_VOL));
	if(isNaN(savedLocalVolume))savedLocalVolume=1.0;
	let isGlobal=localStorage.getItem(STORAGE_KEY_IS_GLOBAL)==='true';
	let currentVolume=savedLocalVolume;

	// UI STYLES
	const style=document.createElement('style');
	style.textContent=`
.vol-morph{
	position:absolute;top:4px;right:4px;height:48px;width:48px;
	border-radius:24px;background:rgba(0,0,0,0.75);opacity:0;
	transition:opacity 0.2s,width 0.25s ease;z-index:99999;
	display:flex;align-items:center;justify-content:flex-start;
	overflow:hidden;
	padding: 0 10px 0 14px;
	box-sizing:border-box;
}
.vol-morph.visible{opacity:0.85;}
.vol-morph:hover,.vol-morph.expanded{opacity:1;width:146px;}
.vol-morph svg{fill:white;min-width:24px;width:24px;height:24px;flex-shrink:0;transition:fill 0.3s ease;}
.vol-morph.global svg{fill:#ff9800;}
.vol-morph input{
	-webkit-appearance:none;appearance:none;background:transparent;
	width:0;opacity:0;margin-left:8px;transition:width 0.25s,opacity 0.2s;cursor:pointer;
}
.vol-morph:hover input,.vol-morph.expanded input{width:85px;opacity:1;}
.vol-morph input::-webkit-slider-runnable-track{height:6px;background:rgba(255,255,255,0.3);border-radius:3px;}
.vol-morph input::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;background:#7c3aed;border-radius:50%;margin-top:-4px;}
.vol-morph input::-moz-range-track{height:6px;background:rgba(255,255,255,0.3);border-radius:3px;border:none;}
.vol-morph input::-moz-range-thumb{width:14px;height:14px;background:#7c3aed;border-radius:50%;border:none;}
	`;

	// BROADCAST COMMUNICATION
	channel.onmessage=(ev)=>{
		const msg=ev.data;
		if(!msg || !msg.type)return;
		if(msg.type==='VOL_UPDATE' && isGlobal){
			currentVolume=msg.value;
			applyVolume(false);
		}
		if(msg.type==='QUERY_GLOBAL' && isGlobal){channel.postMessage({type:'ANS_GLOBAL',value:currentVolume});}
		if(msg.type==='ANS_GLOBAL'){
			isGlobal=true;
			currentVolume=msg.value;
			localStorage.setItem(STORAGE_KEY_IS_GLOBAL,'true');
			applyVolume(false);
		}
	};

	// AUDIO ENGINE
	function initAudioContext(){
		if(audioContextReady && audioCtx){if(audioCtx.state==='suspended')audioCtx.resume();return;}
		try{
			audioCtx=new(window.AudioContext || window.webkitAudioContext)();
			gainNode=audioCtx.createGain();
			limiterNode=audioCtx.createDynamicsCompressor();

			limiterNode.threshold.value=-3;
			limiterNode.knee.value=0;
			limiterNode.ratio.value=20;
			limiterNode.attack.value=0.001;
			limiterNode.release.value=0.1;

			gainNode.connect(limiterNode);
			limiterNode.connect(audioCtx.destination);

			audioContextReady=true;
			knownMediaElements.forEach(hookMedia);
			applyVolume(false);
		}catch(e){/* Blocked by browser policy */}
	}

	function hookMedia(el){
		if(!audioContextReady || !audioCtx || el._volumeHooked)return;
		try{
			const source=audioCtx.createMediaElementSource(el);
			source.connect(gainNode);
			el._volumeHooked=true;
			el.addEventListener('play',()=>{if(audioCtx && audioCtx.state==='suspended')audioCtx.resume();});
		}catch(e){}
	}

	function applyVolume(shouldBroadcast=true){
		if(gainNode && audioContextReady){gainNode.gain.value=currentVolume;}

		if(!isGlobal){
			savedLocalVolume=currentVolume;
			localStorage.setItem(STORAGE_KEY_VOL,savedLocalVolume);
		}
		else if(shouldBroadcast){channel.postMessage({type:'VOL_UPDATE',value:currentVolume});}

		updateTitle();
		updateUI();
	}

	function toggleGlobalMode(){
		isGlobal=!isGlobal;
		localStorage.setItem(STORAGE_KEY_IS_GLOBAL,isGlobal);

		if(isGlobal){channel.postMessage({type:'QUERY_GLOBAL'});}else{currentVolume=savedLocalVolume;}
		applyVolume(true);
	}

	// UTILITIES
	function updateTitle(){
		if(!document.title)return;

		const clean=document.title.replace(/^(⚓\s*)?(?:\[\d+%\]|\d+%)\s*/,'');

		const pct=Math.round(currentVolume*100);

		if(pct===100 && !isGlobal){if(document.title!==clean)document.title=clean;return;}

		let prefix='';
		if(isGlobal) prefix+='⚓ ';
		prefix+=pct+'% ';

		const newTitle=prefix+clean;
		if(document.title!==newTitle)document.title=newTitle;
	}

	function updateUI(){
		document.querySelectorAll('.vol-morph').forEach(m=>{
			if(isGlobal)m.classList.add('global');
			else m.classList.remove('global');

			const input=m.querySelector('input');
			if(input && parseFloat(input.value)!==currentVolume)input.value=currentVolume;
		});
	}

	function snapToStep(val){return Math.round(val/STEP)*STEP;}

	// CORE
	function createVolumeUI(media){
		if(media._volUI)return;
		knownMediaElements.add(media);

		initAudioContext();
		if(audioContextReady)hookMedia(media);

		const parent=media.parentElement;
		if(!parent)return;
		if(getComputedStyle(parent).position==='static'){parent.style.position='relative';}

		const morph=document.createElement('div');
		morph.className='vol-morph';
		if(isGlobal)morph.classList.add('global');

		morph.innerHTML=`
<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
<input type="range" min="0" max="${MAX}" step="${STEP}" value="${currentVolume}">
		`;

		const slider=morph.querySelector('input');
		parent.appendChild(morph);

		// Visual Events
		media.addEventListener('mouseenter',()=>morph.classList.add('visible'));
		media.addEventListener('mouseleave',()=>{if(!morph.matches(':hover'))morph.classList.remove('visible');});
		morph.addEventListener('mouseleave',()=>morph.classList.remove('visible'));

		// Audio Init Trigger (Backup)
		morph.addEventListener('mouseenter',initAudioContext);
		
		// Disabled click on source
		morph.addEventListener('click',(e)=>{e.stopPropagation();});

		// Input Logic
		slider.addEventListener('input',()=>{
			currentVolume=snapToStep(parseFloat(slider.value));
			applyVolume(true);
		});
		slider.addEventListener('contextmenu',(e)=>{
			e.preventDefault();
			e.stopPropagation();
			currentVolume=1.0;
			applyVolume(true);
		});
		slider.addEventListener('wheel',(e)=>{
			e.preventDefault();
			initAudioContext();
			const delta=e.deltaY<0 ? STEP : -STEP;
			currentVolume=Math.max(0,Math.min(MAX,snapToStep(currentVolume+delta)));
			applyVolume(true);
		},{passive:false});

		// Toggle Mode
		morph.addEventListener('mousedown',(e)=>{
			if(e.button===1){
				e.preventDefault();e.stopPropagation();
				initAudioContext();
				toggleGlobalMode();
				return false;
			}
		});

		media._volUI=true;
	}

	function init(){
		document.head.appendChild(style);

		// Global Initial Query
		if(isGlobal)channel.postMessage({type:'QUERY_GLOBAL'});

		// Medias Observer
		const mediaObs=new MutationObserver(()=>{document.querySelectorAll('audio,video').forEach(createVolumeUI);});
		if(document.body){
			mediaObs.observe(document.body,{childList:true,subtree:true});
			document.querySelectorAll('audio,video').forEach(createVolumeUI);
		}

		// Title Observer
		const titleNode=document.querySelector('title');
		if(titleNode){
			titleObserver=new MutationObserver(updateTitle);
			titleObserver.observe(titleNode,{childList: true});
		}

		// Audio Unlocker (Global fallback)
		['click','keydown','touchstart'].forEach(evt=>{document.addEventListener(evt,initAudioContext,{once:true,capture:true});});

		// Refresh Tab
		document.addEventListener('visibilitychange',()=>{
			if(document.visibilityState==='visible'){
				updateUI();
				updateTitle();
				if(isGlobal)channel.postMessage({type:'QUERY_GLOBAL'});
			}
		});
	}

	// KEYBOARD SHORTCUTS
	document.addEventListener('keydown',(e)=>{
		if(!e.ctrlKey)return;

		if(e.key==='F9'){
			e.preventDefault();
			initAudioContext();
			toggleGlobalMode();
		}
		if(e.key==='F10' || e.key==='F11'){
			e.preventDefault();
			initAudioContext();
			const delta=(e.key==='F11')? STEP : -STEP;
			currentVolume=Math.max(0,Math.min(MAX,snapToStep(currentVolume+delta)));
			applyVolume(true);
		}
	});

	if(document.body)init();
	else document.addEventListener('DOMContentLoaded',init);

})();