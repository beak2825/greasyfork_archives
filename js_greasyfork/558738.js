// ==UserScript==
// @name         Chess.com Player Editor
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Spoofs player information
// @match        https://www.chess.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558738/Chesscom%20Player%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/558738/Chesscom%20Player%20Editor.meta.js
// ==/UserScript==

(function () {
'use strict';
const state={white:{title:false,diamond:false,name:'',rating:''},black:{title:false,diamond:false,name:'',rating:''}};
const original=new WeakMap();
function getPlayerColor(userBlock){
const player=userBlock.closest('.player-component');
if(!player)return null;
if(player.querySelector('.clock-top.clock-white, .clock-bottom.clock-white'))return'white';
if(player.querySelector('.clock-top.clock-black, .clock-bottom.clock-black'))return'black';
return null;
}
function getUsernameEl(block){return block.querySelector('.cc-user-username-component');}
function getRatingEl(block){return block.querySelector('[data-cy="user-tagline-rating"]');}
function rememberOriginal(block){
if(original.has(block))return;
original.set(block,{name:getUsernameEl(block)?.textContent||'',rating:getRatingEl(block)?.textContent||''});
}
function ensureTitle(block,enabled){
let t=block.querySelector('.cc-user-title-component');
if(enabled&&!t){t=document.createElement('div');t.className='cc-user-title-component cc-text-x-small-bold';t.textContent='GM';block.insertBefore(t,block.firstChild);}
if(!enabled&&t)t.remove();
}
function ensureDiamond(block,enabled){
let f=block.querySelector('.flair-rpc-component');
if(enabled&&!f){
const img=document.createElement('img');
img.className='flair-rpc-component flair-rpc-small';
img.width=16;
img.height=16;
img.src='https://images.chesscomfiles.com/chess-flair/membership_icons/diamond_traditional.svg';
block.appendChild(img);
}
if(!enabled&&f)f.remove();
}
function setText(el,value){
if(!el||!value)return;
if(el.textContent!==value)el.textContent=value;
}
function restore(block){
const o=original.get(block);
if(!o)return;
setText(getUsernameEl(block),o.name);
setText(getRatingEl(block),o.rating);
}
function apply(){
document.querySelectorAll('.cc-user-block-component').forEach(block=>{
const color=getPlayerColor(block);
if(!color)return;
rememberOriginal(block);
const cfg=state[color];
ensureTitle(block,cfg.title);
ensureDiamond(block,cfg.diamond);
if(cfg.name)setText(getUsernameEl(block),cfg.name);
if(cfg.rating)setText(getRatingEl(block),`(${cfg.rating})`);
if(!cfg.name&&!cfg.rating)restore(block);
});
}
let scheduled=false;
const observer=new MutationObserver(()=>{
if(scheduled)return;
scheduled=true;
requestAnimationFrame(()=>{scheduled=false;apply();});
});
observer.observe(document.documentElement,{childList:true,subtree:true});
function createGUI(){
const gui=document.createElement('div');
gui.style='position:fixed;top:80px;right:20px;background:#111;color:#fff;padding:12px;border-radius:8px;z-index:999999;font-size:12px;width:200px;';
gui.innerHTML='<b>Chess Spoofer</b><br><br>\
<label><input id="wt" type="checkbox"> GM White</label><br>\
<label><input id="bt" type="checkbox"> GM Black</label><br><br>\
<label><input id="wd" type="checkbox"> Diamond White</label><br>\
<label><input id="bd" type="checkbox"> Diamond Black</label><br><br>\
White name:<input id="wn" style="width:100%"><br>\
Black name:<input id="bn" style="width:100%"><br><br>\
White rating:<input id="wr" style="width:100%"><br>\
Black rating:<input id="br" style="width:100%">';
document.body.appendChild(gui);
gui.querySelector('#wt').onchange=e=>state.white.title=e.target.checked;
gui.querySelector('#bt').onchange=e=>state.black.title=e.target.checked;
gui.querySelector('#wd').onchange=e=>state.white.diamond=e.target.checked;
gui.querySelector('#bd').onchange=e=>state.black.diamond=e.target.checked;
gui.querySelector('#wn').oninput=e=>state.white.name=e.target.value;
gui.querySelector('#bn').oninput=e=>state.black.name=e.target.value;
gui.querySelector('#wr').oninput=e=>state.white.rating=e.target.value;
gui.querySelector('#br').oninput=e=>state.black.rating=e.target.value;
}
window.addEventListener('load',createGUI);
})();
