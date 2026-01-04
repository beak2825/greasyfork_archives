// ==UserScript==
// @name         Remove TCRF pride
// @namespace    https://tcrf.net/
// @version      1.2
// @description  Replaces the pride crud from the logo of The Cutting Room Floor
// @license      GNU GPLv3
// @match        https://tcrf.net/*
// @match        http://tcrf.net/*
// @match        https://www.tcrf.net/*
// @match        http://www.tcrf.net/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556969/Remove%20TCRF%20pride.user.js
// @updateURL https://update.greasyfork.org/scripts/556969/Remove%20TCRF%20pride.meta.js
// ==/UserScript==

(function(){
'use strict';
const DECEMBER_IMAGE = 'https://cdn.discordapp.com/attachments/1440694335829184594/1446153240625287288/-.png?ex=6932f2a8&is=6931a128&hm=959dba94556a34a89072c16d1d04347081254afd3ccc46f1a1c1002da16af773&';
const DEFAULT_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/d/d1/TCRFLogo.png';
const IMAGE_URL = (new Date().getMonth() === 11) ? DECEMBER_IMAGE : DEFAULT_IMAGE;
const TARGET_SIZE_PX = 160;
const AGGRESSIVE_INTERVAL_MS = 50;
const AGGRESSIVE_DURATION_MS = 8000;
const SLOWER_INTERVAL_MS = 300;
const SLOWER_DURATION_MS = 12000;
const TOTAL_DURATION_MS = AGGRESSIVE_DURATION_MS + SLOWER_DURATION_MS;
(function(){
try{
if(document.getElementById('tcrf-fast-replacer-css')) return;
const css = `a.mw-wiki-logo{visibility:hidden!important;background-image:none!important;background:none!important;width:${TARGET_SIZE_PX}px!important;height:${TARGET_SIZE_PX}px!important;display:inline-block!important;overflow:hidden!important}a.mw-wiki-logo>*{display:none!important}a.mw-wiki-logo.tcrf-revealed{visibility:visible!important}a.mw-wiki-logo.tcrf-revealed>img.tcrf-replacer{display:block!important}img.tcrf-replacer{width:${TARGET_SIZE_PX}px!important;height:${TARGET_SIZE_PX}px!important;max-width:${TARGET_SIZE_PX}px!important;max-height:${TARGET_SIZE_PX}px!important;object-fit:contain!important;display:none!important}`;
const style = document.createElement('style');
style.id = 'tcrf-fast-replacer-css';
style.appendChild(document.createTextNode(css));
const parent = (document.head || document.documentElement);
parent.insertBefore(style, parent.firstChild);
}catch(e){console.error('tcrf replacer css injection failed',e)}
})();
function createLogoImg(anchor){
const img = document.createElement('img');
img.className = 'tcrf-replacer';
img.src = IMAGE_URL;
img.alt = anchor.title || 'TCRF logo';
img.loading = 'eager';
img.decoding = 'sync';
img.style.width = `${TARGET_SIZE_PX}px`;
img.style.height = `${TARGET_SIZE_PX}px`;
img.style.objectFit = 'contain';
img.style.display = 'block';
return img;
}
function replaceAnchor(anchor){
try{
if(!anchor || !(anchor instanceof Element)) return false;
if(anchor.classList.contains('tcrf-revealed')) return true;
try{anchor.style.background='none';anchor.style.backgroundImage='none'}catch(e){}
while(anchor.firstChild) anchor.removeChild(anchor.firstChild);
const img = createLogoImg(anchor);
anchor.appendChild(img);
anchor.classList.add('tcrf-revealed');
anchor.style.width = `${TARGET_SIZE_PX}px`;
anchor.style.height = `${TARGET_SIZE_PX}px`;
anchor.style.display = 'inline-block';
anchor.style.overflow = 'visible';
return true;
}catch(err){console.error('tcrf replacer error on anchor',err);return false}
}
function replaceAllLogos(){
try{
const anchors = document.querySelectorAll('a.mw-wiki-logo');
if(!anchors || anchors.length === 0) return false;
let any = false;
anchors.forEach(a => { if(replaceAnchor(a)) any = true });
return any;
}catch(e){console.error('replaceAllLogos error',e);return false}
}
replaceAllLogos();
let replaced = false;
const start = Date.now();
let intervalId = null;
function startAggressivePolling(){
if(intervalId) return;
intervalId = setInterval(()=>{
const now = Date.now();
const ok = replaceAllLogos();
if(ok) replaced = true;
if(now - start >= AGGRESSIVE_DURATION_MS){
clearInterval(intervalId);
startSlowerPolling();
intervalId = null;
}
},AGGRESSIVE_INTERVAL_MS);
}
let slowerIntervalId = null;
function startSlowerPolling(){
if(slowerIntervalId) return;
const slowStart = Date.now();
slowerIntervalId = setInterval(()=>{
const ok = replaceAllLogos();
if(ok) replaced = true;
const elapsed = Date.now() - slowStart;
if(elapsed >= SLOWER_DURATION_MS){
clearInterval(slowerIntervalId);
slowerIntervalId = null;
}
},SLOWER_INTERVAL_MS);
}
startAggressivePolling();
const observer = new MutationObserver(()=>{replaceAllLogos()});
try{observer.observe(document.documentElement || document.body || document,{childList:true,subtree:true})}catch(e){}
document.addEventListener('DOMContentLoaded',()=>{replaceAllLogos()},{once:true});
(function(history){const push = history.pushState;const replace = history.replaceState;history.pushState = function(){const ret = push.apply(this,arguments);window.dispatchEvent(new Event('tcrf-locationchange'));return ret};history.replaceState = function(){const ret = replace.apply(this,arguments);window.dispatchEvent(new Event('tcrf-locationchange'));return ret}})(window.history);
window.addEventListener('tcrf-locationchange',()=>{replaceAllLogos();startAggressivePolling()});
window.addEventListener('popstate',()=>{replaceAllLogos();startAggressivePolling()});
setTimeout(()=>{try{observer.disconnect()}catch(e){}try{if(intervalId) clearInterval(intervalId)}catch(e){}try{if(slowerIntervalId) clearInterval(slowerIntervalId)}catch(e){}},TOTAL_DURATION_MS+1000);
})();