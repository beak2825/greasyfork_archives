// ==UserScript==
// @name Greasy Client
// @namespace http://tampermonkey.net/
// @version V1.0
// @description Official v1.0 - HUD, Keystrokes, and Draggable UI.
// @author ykCole - Miniblox
// @license MIT
// @match https://miniblox.io/*
// @grant none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/560760/Greasy%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/560760/Greasy%20Client.meta.js
// ==/UserScript==

(function() {
'use strict';

const defaultSettings = {
showFPS: true,
showCPS: true,
showKeystrokes: true,
positions: {
'greasy-main-title': { top: '15px', left: '15px' },
'fps-wrap': { top: '70px', left: '15px' },
'cps-wrap': { top: '110px', left: '15px' },
'keys-wrap': { top: '160px', left: '15px' }
}
};

let settings = JSON.parse(localStorage.getItem('greasyClientSettings')) || defaultSettings;
const save = () => localStorage.setItem('greasyClientSettings', JSON.stringify(settings));

const style = document.createElement('style');
style.innerHTML = `
#greasy-main-title { position: fixed; font-family: Arial, sans-serif; font-size: 38px; font-weight: bold; color: #2ecc71; z-index: 10001; pointer-events: none; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); white-space: nowrap; }
.draggable-hud { position: fixed; pointer-events: none; font-family: 'Segoe UI', sans-serif; z-index: 10000; color: white; text-shadow: 2px 2px 2px black; }
.menu-open .draggable-hud, .menu-open #greasy-main-title { pointer-events: auto !important; cursor: move !important; outline: 1px dashed #2ecc71; background: rgba(46, 204, 113, 0.1); }
.hud-item { background: rgba(0,0,0,0.6); padding: 6px 14px; border-radius: 4px; font-weight: bold; border-left: 3px solid #2ecc71; margin-bottom: 5px; }
.key { width: 45px; height: 45px; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; border-radius: 4px; font-weight: bold; }
.key.active { background: #2ecc71; color: black; box-shadow: 0 0 10px #2ecc71; }
#client-menu { position: fixed; background: #111; border: 2px solid #2ecc71; padding: 20px; color: white; z-index: 10002; border-radius: 12px; display: none; min-width: 250px; transform: translate(-50%, -50%); font-family: sans-serif; }
.menu-header { border-bottom: 1px solid #333; margin-bottom: 15px; padding-bottom: 10px; font-size: 20px; text-align: center; color: #2ecc71; font-weight: bold; cursor: move; }
.menu-row { display: flex; justify-content: space-between; margin-bottom: 10px; align-items: center; }
.toggle-btn { cursor: pointer; padding: 6px 14px; border-radius: 4px; border: none; background: #444; color: white; font-weight: bold; font-size: 12px; }
.toggle-on { background: #2ecc71; color: black; }
img[src*="logo"], .logo, .brand, a[href="/"] svg, .miniblox-logo, .title-text { display: none !important; }
`;

document.addEventListener('DOMContentLoaded', () => {
document.head.appendChild(style);

const mainTitle = document.body.appendChild(document.createElement('div'));
mainTitle.id = 'greasy-main-title';
mainTitle.innerText = 'GREASY CLIENT';
const titlePos = settings.positions['greasy-main-title'] || { top: '15px', left: '15px' };
mainTitle.style.top = titlePos.top;
mainTitle.style.left = titlePos.left;

function createHUD(id, html, show, defPos) {
const el = document.body.appendChild(document.createElement('div'));
el.id = id;
el.className = 'draggable-hud';
const pos = settings.positions[id] || defPos;
el.style.top = pos.top;
el.style.left = pos.left;
el.style.display = show ? 'block' : 'none';
el.innerHTML = html;
return el;
}

const fpsW = createHUD('fps-wrap', '<div id="fps-display" class="hud-item">FPS: 0</div>', settings.showFPS, { top: '70px', left: '15px' });
const cpsW = createHUD('cps-wrap', '<div id="cps-display" class="hud-item">CPS: 0</div>', settings.showCPS, { top: '110px', left: '15px' });
const keysW = createHUD('keys-wrap', `
<div id="keystrokes-container" style="display:flex;flex-direction:column;align-items:center;">
<div style="display:flex;gap:4px;margin-bottom:4px;"><div id="key-W" class="key">W</div></div>
<div style="display:flex;gap:4px;margin-bottom:4px;"><div id="key-A" class="key">A</div><div id="key-S" class="key">S</div><div id="key-D" class="key">D</div></div>
<div id="key-Space" class="key" style="width:143px;height:25px;font-size:10px;">SPACE</div>
</div>`, settings.showKeystrokes, { top: '160px', left: '15px' });

const menu = document.body.appendChild(document.createElement('div'));
menu.id = 'client-menu';
menu.style.top = '50%';
menu.style.left = '50%';
menu.innerHTML = `
<div class="menu-header" id="menu-drag">GREASY SETTINGS</div>
<div class="menu-row"><span>FPS Counter</span><button id="toggle-fps" class="toggle-btn ${settings.showFPS?'toggle-on':''}">TOGGLE</button></div>
<div class="menu-row"><span>CPS Counter</span><button id="toggle-cps" class="toggle-btn ${settings.showCPS?'toggle-on':''}">TOGGLE</button></div>
<div class="menu-row"><span>Keystrokes</span><button id="toggle-keys" class="toggle-btn ${settings.showKeystrokes?'toggle-on':''}">TOGGLE</button></div>
<p style="font-size:10px;color:#666;text-align:center;margin-top:10px;">Press R-SHIFT to close.</p>
`;

function makeDraggable(el, handleId) {
let p1=0,p2=0,p3=0,p4=0;
const h = handleId ? document.getElementById(handleId) : el;
h.onmousedown = e => {
if(el.id!=='client-menu' && !document.body.classList.contains('menu-open')) return;
p3=e.clientX;p4=e.clientY;
document.onmouseup = () => { document.onmouseup=null; document.onmousemove=null; settings.positions[el.id]={top:el.style.top,left:el.style.left}; save(); };
document.onmousemove = e => { p1=p3-e.clientX;p2=p4-e.clientY;p3=e.clientX;p4=e.clientY; el.style.top=(el.offsetTop-p2)+'px'; el.style.left=(el.offsetLeft-p1)+'px'; };
};
}

[mainTitle,fpsW,cpsW,keysW].forEach(el=>makeDraggable(el));
makeDraggable(menu,'menu-drag');

const setupToggle = (btnId,settingKey,wrapId) => {
document.getElementById(btnId).onclick = e => {
settings[settingKey] = !settings[settingKey];
e.target.classList.toggle('toggle-on',settings[settingKey]);
document.getElementById(wrapId).style.display = settings[settingKey]?'block':'none';
save();
};
};
setupToggle('toggle-fps','showFPS','fps-wrap');
setupToggle('toggle-cps','showCPS','cps-wrap');
setupToggle('toggle-keys','showKeystrokes','keys-wrap');

window.addEventListener('keydown', e => {
const keyEl = document.getElementById(`key-${e.code==='Space'?'Space':e.key.toUpperCase()}`);
if(keyEl) keyEl.classList.add('active');
if(e.code==='ShiftRight') {
const isVisible = menu.style.display==='block';
menu.style.display = isVisible?'none':'block';
document.body.classList.toggle('menu-open',!isVisible);
if(!isVisible) document.exitPointerLock?.();
}
});

window.addEventListener('keyup', e => {
const keyEl = document.getElementById(`key-${e.code==='Space'?'Space':e.key.toUpperCase()}`);
if(keyEl) keyEl.classList.remove('active');
});

let frames=0,lastTime=performance.now(),clicks=[];
window.addEventListener('mousedown',()=>{if(!document.body.classList.contains('menu-open')) clicks.push(Date.now());});

function update() {
frames++;
const now = performance.now();
if(now-lastTime>=1000){
if(document.getElementById('fps-display')) document.getElementById('fps-display').innerText=`FPS: ${frames}`;
frames=0; lastTime=now;
}
clicks = clicks.filter(t=>Date.now()-t<1000);
if(document.getElementById('cps-display')) document.getElementById('cps-display').innerText=`CPS: ${clicks.length}`;
requestAnimationFrame(update);
}
update();
});
})();
