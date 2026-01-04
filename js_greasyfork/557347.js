// ==UserScript==
// @name         SoundCloud Mobile-Style Desktop
// @namespace    https://github.com/pooiod7
// @version      1.4
// @description  Mobile-like layout, bottom player, hide upgrade button, redirect Discover → Likes. Author: pooiod7
// @author       pooiod7
// @match        https://soundcloud.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557347/SoundCloud%20Mobile-Style%20Desktop.user.js
// @updateURL https://update.greasyfork.org/scripts/557347/SoundCloud%20Mobile-Style%20Desktop.meta.js
// ==/UserScript==
(function(){
if(location.pathname==="/"||location.pathname==="/discover")location.href="/you/likes";
const CSS=`
body{display:flex;justify-content:center}
#sc-mobile-shell{box-sizing:border-box;width:100%;max-width:420px;min-height:100vh;padding-bottom:90px}
header,[role="banner"]{position:fixed;top:0;left:50%;transform:translateX(-50%);max-width:420px;width:100%;z-index:9999;height:56px;display:flex;align-items:center;padding:8px 12px}
aside,[class*="Sidebar"],[id*="sidebar"],[role="complementary"],.listen-sidebar,.listenHero__right{display:none!important}
button[href="/go"],a[href="/go"],[data-testid="upsell"],[class*="upgrade"],[href="/pro"]{display:none!important}
[class*="grid"],[class*="Grid"],[class*="row"],.soundList,.tracks,.collection,.cards,.sc-list{display:flex!important;flex-direction:column!important;gap:10px!important;width:100%}
[class*="column"],.l-container,.content,main,#content,.application__container{width:100%!important;max-width:420px!important;margin:60px 0 0 0!important;padding:0 8px!important}
.sc-artwork,.sc-thumbnail,.image{max-width:100%!important;height:auto!important}
article,.soundList__item,.trackItem,.sc-track,.sound__header{padding:10px 0!important;border-bottom:1px solid rgba(0,0,0,.06)!important}
#sc-mobile-player{position:fixed;left:50%;transform:translateX(-50%);bottom:8px;z-index:10000;width:calc(420px - 24px);max-width:100%;height:72px;border-radius:12px;display:flex;align-items:center;padding:8px;background:#fff}
main,#content{padding-bottom:100px!important}
`;
const style=document.createElement('style');style.textContent=CSS;document.documentElement.appendChild(style);
function wrap(){
 if(document.getElementById('sc-mobile-shell'))return;
 const shell=document.createElement('div');shell.id='sc-mobile-shell';
 while(document.body.firstChild)shell.appendChild(document.body.firstChild);
 document.body.appendChild(shell);
}
function ensurePlayer(){
 if(document.getElementById('sc-mobile-player'))return document.getElementById('sc-mobile-player');
 const p=document.createElement('div');p.id='sc-mobile-player';document.body.appendChild(p);return p;
}
function movePlayer(){
 const p=ensurePlayer();
 const sel=['[data-testid="player"]','.playControls__main','.playControls','footer','[class*="player"]'];
 let f=null;
 for(const s of sel){const e=document.querySelector(s);if(e&&e.offsetParent!==null){f=e;break}}
 if(!f)return;
 if(f.parentElement!==p){p.innerHTML='';p.appendChild(f)}
}
function apply(){wrap();movePlayer()}
const obs=new MutationObserver(apply);
document.addEventListener('readystatechange',()=>{apply();if(document.readyState==='complete')obs.observe(document.body,{childList:true,subtree:true})});
apply();
})();