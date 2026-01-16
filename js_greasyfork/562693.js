// ==UserScript==
// @name 🔊 Cristal Volume Control
// @description Take full control of volume. Boost up to 200%, sync across tabs, and never lose your settings.
// @license MIT
// @namespace CVC
// @version 5.2
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
	const HIDE_DELAY=3750;
	const STORAGE_KEY_LAST_MODE='CVC_last_known_mode_global';
	const BC_NAME='CVC_vol_channel';

	// ICONS PATHS (Material Design)
	const ICONS={
		MUTE:'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z',
		LOW:'M7 9v6h4l5 5V4l-5 5H7z',
		MED:'M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z',
		HIGH:'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'
	};

	// STATES
	let audioCtx,gainNode,limiterNode;
	let channel=new BroadcastChannel(BC_NAME);
	let knownMediaElements=new Set();
	let audioContextReady=false;
	let titleObserver=null;

	// INIT
	let isGlobal=localStorage.getItem(STORAGE_KEY_LAST_MODE)==='true';
	let currentVolume=1.0;

	// UI STYLES
	const style=document.createElement('style');
	style.textContent=`
.vol-morph{
	position:absolute;top:48px;right:48px;height:48px;width:48px;
	border-radius:24px;background:rgba(0,0,0,0.4);opacity:0;
	transition:opacity 0.3s,width 0.3s ease;z-index:99999;
	display:flex;align-items:center;justify-content:flex-start;
	overflow:hidden;
	padding:0 12px;
	box-sizing:border-box;
	pointer-events:auto;
}
.vol-morph.visible{opacity:0.85;}
.vol-morph:hover,.vol-morph.expanded{opacity:1;width:146px;}
.speaker-box{
	width:24px;height:24px;min-width:24px;
	display:flex;align-items:center;justify-content:center;
	cursor:pointer;
	margin-right:2px;
}
.vol-morph svg{
	fill:white;width:24px;height:24px;
	transition:fill 0.3s ease;
	pointer-events:none;
}
.vol-morph.global svg{fill:#ff9800;}
.vol-morph input{
	-webkit-appearance:none;appearance:none;background:transparent;
	width:0;opacity:0;margin-left:6px;transition:width 0.3s,opacity 0.3s;cursor:pointer;
}
.vol-morph:hover input,.vol-morph.expanded input{width:85px;opacity:1;}
.vol-morph input::-webkit-slider-runnable-track{height:6px;background:rgba(255,255,255,0.3);border-radius:3px;}
.vol-morph input::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;background:#7c3aed;border-radius:50%;margin-top:-4px;}
.vol-morph input::-moz-range-track{height:6px;background:rgba(255,255,255,0.3);border-radius:3px;border:none;}
.vol-morph input::-moz-range-thumb{width:14px;height:14px;background:#7c3aed;border-radius:50%;border:none;}
.slider-wrap{
    position:relative;
    display:flex;
    align-items:center;
}
.vol-label{
    position:absolute;
    top:-17px;
    left:50%;
    transform:translateX(-50%);
    font-size:12px;
    color:rgba(255,255,255,0.55);
    font-family:system-ui,sans-serif;
    opacity:0;
    transition:opacity 0.3s;
    pointer-events:none;
    white-space:nowrap;
}
.vol-morph:hover .vol-label,
.vol-morph.expanded .vol-label{opacity:1;}
	`;

	// BROADCAST COMMUNICATION
	channel.onmessage=(ev)=>{
		const msg=ev.data;
		if(!msg || !msg.type)return;

		if(isGlobal){
			if(msg.type==='VOL_UPDATE'){
				currentVolume=msg.value;
				applyVolume(false);
			}
			if(msg.type==='QUERY_GLOBAL'){channel.postMessage({type:'ANS_GLOBAL',value:currentVolume});}
			if(msg.type==='ANS_GLOBAL'){
				currentVolume=msg.value;
				applyVolume(false);
			}
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
		}catch(e){}
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
		if(isGlobal && shouldBroadcast){channel.postMessage({type:'VOL_UPDATE',value:currentVolume});}

		updateTitle();
		updateUI();
	}

	function toggleGlobalMode(){
		isGlobal=!isGlobal;
		localStorage.setItem(STORAGE_KEY_LAST_MODE,isGlobal);

		if(isGlobal){channel.postMessage({type:'QUERY_GLOBAL'});}
		applyVolume(true);
	}

	// UTILITIES
	function updateTitle(){
		if(!document.title)return;
		const clean=document.title.replace(/^(?:⚓\s*|%\s*|\d+%\s*)+/,'');
		const pct=Math.round(currentVolume*100);

		if(pct===100 && !isGlobal){if(document.title!==clean)document.title=clean;return;}

		let prefix='';
		if(isGlobal){
			prefix+='⚓ ';
			if(!document.hidden) prefix+=pct+'% ';
		}
		else{
			if(!document.hidden){prefix+=pct+'% ';}
			else{prefix+='% ';}
		}

		const newTitle=prefix+clean;
		if(document.title!==newTitle)document.title=newTitle;
	}

	function updateUI(){
		let iconPath=ICONS.MED;
		if(currentVolume<=0) iconPath=ICONS.MUTE;
		else if(currentVolume<1.0) iconPath=ICONS.LOW;
		else if(currentVolume>1.0) iconPath=ICONS.HIGH;

		document.querySelectorAll('.vol-morph').forEach(m=>{
			if(isGlobal)m.classList.add('global');
			else m.classList.remove('global');

			const input=m.querySelector('input');
			if(input && parseFloat(input.value)!==currentVolume)input.value=currentVolume;

			const path=m.querySelector('path');
			if(path) path.setAttribute('d', iconPath);
			if(m._label)m._label.textContent=Math.round(currentVolume*100)+'%';
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
<div class="speaker-box"><svg viewBox="0 0 24 24"><path d="${ICONS.MED}"/></svg></div>
<div class="slider-wrap">
<input type="range" min="0" max="${MAX}" step="${STEP}" value="${currentVolume}">
<span class="vol-label"></span>
</div>
		`;

		const slider=morph.querySelector('input');
		morph._label=morph.querySelector('.vol-label');
		parent.appendChild(morph);

		updateUI();

		// AUTO-HIDE SYSTEM
		let morphHideTimer=null;

		function showMorph(){
			morph.classList.add('visible');
			if(morphHideTimer)clearTimeout(morphHideTimer);
			morphHideTimer=setTimeout(()=>{if(!morph.matches(':hover'))morph.classList.remove('visible');},HIDE_DELAY);
		}

		function hideMorph(){
			if(morphHideTimer)clearTimeout(morphHideTimer);
			morphHideTimer=null;
			morph.classList.remove('visible');
		}

		// Visual Events
		media.addEventListener('mouseenter',showMorph);
		media.addEventListener('mousemove',showMorph);
		media.addEventListener('mouseleave',()=>{if(!morph.matches(':hover'))hideMorph();});
		morph.addEventListener('mouseleave',()=>{if(!media.matches(':hover'))hideMorph();});
		morph.addEventListener('mouseenter',()=>{if(morphHideTimer)clearTimeout(morphHideTimer);});

		// Audio Init
		morph.addEventListener('mouseenter',initAudioContext);

		// CLICK EVENTS
		morph.addEventListener('click',(e)=>{
			e.stopPropagation();
			if(e.target.closest('.speaker-box')){
				initAudioContext();
				toggleGlobalMode();
			}
		});

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

		// Toggle Mode (Middle Click)
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
			titleObserver.observe(titleNode,{childList:true});
		}

		// Audio Unlocker
		['click','keydown','touchstart'].forEach(evt=>{document.addEventListener(evt,initAudioContext,{once:true,capture:true});});

		// Visibility Change
		document.addEventListener('visibilitychange',()=>{
			updateTitle();
			if(document.visibilityState==='visible'){
				updateUI();
				if(isGlobal)channel.postMessage({type:'QUERY_GLOBAL'});
			}
		});
	}

	// SHOW ALL MORPHS (for keyboard shortcuts)
	let globalHideTimer=null;

	function showAllMorphsExpanded(){
		if(globalHideTimer)clearTimeout(globalHideTimer);
		
		document.querySelectorAll('.vol-morph').forEach(m=>{m.classList.add('visible','expanded');});
		
		globalHideTimer=setTimeout(()=>{document.querySelectorAll('.vol-morph').forEach(m=>{m.classList.remove('visible','expanded');});},HIDE_DELAY);
	}

	// KEYBOARD SHORTCUTS
	document.addEventListener('keydown',(e)=>{
		if(!e.ctrlKey)return;

		if(e.key==='F9'){
			e.preventDefault();
			initAudioContext();
			showAllMorphsExpanded();
			toggleGlobalMode();
		}
		if(e.key==='F10' || e.key==='F11'){
			e.preventDefault();
			initAudioContext();
			showAllMorphsExpanded();
			const delta=(e.key==='F11') ? STEP : -STEP;
			currentVolume=Math.max(0,Math.min(MAX,snapToStep(currentVolume+delta)));
			applyVolume(true);
		}
	});

	if(document.body)init();
	else document.addEventListener('DOMContentLoaded',init);

})();
