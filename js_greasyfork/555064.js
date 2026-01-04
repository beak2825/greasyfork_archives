// ==UserScript==
// @name         Lunar Client
// @namespace    https://deadshot.io/
// @version      1.0
// @description  Lunar Client with draggable title bars, crosshair editor, selectable stats (OS, CPU, FPS, Ping), autosave, glow, etc.
// @author       Aguy123
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555064/Lunar%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/555064/Lunar%20Client.meta.js
// ==/UserScript==

(function(){
'use strict';
if(window.lunarClientLoaded) return;
window.lunarClientLoaded = true;

const d=document, L=localStorage;

// --- Default state ---
const defaultState = {
  style:'Circle', overlay:'Dot', size:60, glow:10, color:'#00eaff',
  enabled:true, editorX:null, editorY:null, uiX:null, uiY:null
};
let state = JSON.parse(L.getItem('lc_state')) || defaultState;
function saveState(){ L.setItem('lc_state', JSON.stringify(state)); }

// --- Canvas for Crosshair ---
const canvas=d.createElement('canvas');
canvas.style=`position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2147483646;`;
d.body.appendChild(canvas);
const ctx=canvas.getContext('2d');
function resizeCanvas(){canvas.width=innerWidth;canvas.height=innerHeight;}
addEventListener('resize',resizeCanvas);resizeCanvas();

// --- Primary UI ---
const ui=d.createElement('div');
ui.style=`
  position:fixed;top:${state.uiY ?? 10}px;left:${state.uiX ?? 10}px;
  background:rgba(10,10,15,0.95);color:#00eaff;font-family:sans-serif;
  border-radius:10px;padding:6px;min-width:160px;max-width:160px;z-index:2147483647;position:relative;
`;
ui.innerHTML=`
  <div id="uiTitle" style="text-align:center;cursor:grab;margin-bottom:5px;font-weight:bold;">Lunar Client</div>
  <button id="btnEditor" style="width:100%;margin-bottom:3px;padding:4px;font-size:13px;">Crosshair Editor</button>
  <button id="btnStats" style="width:100%;margin-bottom:3px;padding:4px;font-size:13px;">Show Stats</button>
  <button id="btnStatsSettings" style="width:100%;margin-bottom:3px;padding:4px;font-size:13px;">Stats Settings</button>
  <button id="btnHide" style="width:100%;padding:4px;font-size:13px;">Hide UI</button>
`;
d.body.appendChild(ui);

// --- Crosshair Editor ---
const editor=d.createElement('div');
editor.style=`
  position:fixed;top:${state.editorY ?? 10}px;left:${state.editorX ?? (innerWidth-240)}px;
  background:rgba(20,20,30,0.95);color:#00eaff;font-family:sans-serif;
  border-radius:10px;padding:10px;min-width:220px;z-index:2147483647;
  cursor:default;display:none;
`;
editor.innerHTML=`
  <div id="editorTitle" style="text-align:center;cursor:grab;margin-bottom:6px;font-weight:bold;">Crosshair Editor</div>
  <div><label>Enabled:</label> <input type="checkbox" id="chToggle"></div>
  <div><label>Style:</label>
    <select id="chStyle">
      <option>None</option><option>Square</option><option>Circle</option>
      <option>Triangle</option><option>Pentagon</option><option>Four Corners</option>
    </select>
  </div>
  <div><label>Overlay:</label>
    <select id="chOverlay">
      <option>Dot</option><option>Plus</option><option>Cross</option><option>None</option>
    </select>
  </div>
  <div><label>Size: <span id="sizeVal">${state.size}</span></label><input type="range" id="chSize" min="5" max="200" style="width:100%;"></div>
  <div><label>Glow: <span id="glowVal">${state.glow}</span></label><input type="range" id="chGlow" min="0" max="50" style="width:100%;"></div>
  <div><label>Color:</label> <input type="color" id="chColor"></div>
  <button id="btnReset" style="width:100%;padding:5px;margin-top:5px;">Reset</button>
`;
d.body.appendChild(editor);

// --- Stats Panel ---
const stats=d.createElement('div');
stats.style=`
  position:fixed;right:10px;top:10px;background:rgba(0,0,0,0.6);color:#00eaff;
  padding:4px 6px;border-radius:6px;font-family:monospace;font-size:14px;
  z-index:2147483647;display:none;white-space:pre;
`;
stats.innerText='Stats:\n';
d.body.appendChild(stats);

// --- Show UI Button ---
const showBtn=d.createElement('button');
showBtn.textContent='Show UI';
showBtn.style=`
  position:fixed;top:10px;left:10px;background:rgba(20,20,30,0.9);
  color:#00eaff;border:none;border-radius:6px;padding:4px 8px;
  font-family:sans-serif;z-index:2147483647;display:none;
`;
d.body.appendChild(showBtn);

// --- Stats Settings Panel ---
const statsSettings=d.createElement('div');
statsSettings.style=`
  position:fixed;top:50px;left:10px;background:rgba(20,20,30,0.95);color:#00eaff;
  border-radius:10px;padding:10px;min-width:200px;z-index:2147483647;display:none;
`;
statsSettings.innerHTML=`
  <h4 style="text-align:center;margin:0 0 10px;">Stats Settings</h4>
  <div><input type="checkbox" id="selOS"> OS</div>
  <div><input type="checkbox" id="selCPU"> CPU</div>
  <div><input type="checkbox" id="selFPS"> FPS</div>
  <div><input type="checkbox" id="selPing"> Ping</div>
`;
d.body.appendChild(statsSettings);

// --- Draggable by title bars ---
function makeTitleDraggable(titleEl, targetEl, saveX, saveY){
 let drag=false, offX=0, offY=0;
 const start=e=>{
   const p=e.touches?e.touches[0]:e;
   drag=true; offX=p.clientX-targetEl.offsetLeft; offY=p.clientY-targetEl.offsetTop;
   titleEl.style.cursor='grabbing';
 };
 const move=e=>{
   if(!drag) return;
   const p=e.touches?e.touches[0]:e;
   let x=p.clientX-offX, y=p.clientY-offY;
   targetEl.style.left=x+'px'; targetEl.style.top=y+'px';
   saveX(x); saveY(y);
 };
 const stop=()=>{if(drag){drag=false;titleEl.style.cursor='grab'; saveState();}};
 titleEl.addEventListener('mousedown',start); titleEl.addEventListener('touchstart',start);
 addEventListener('mousemove',move); addEventListener('touchmove',move);
 addEventListener('mouseup',stop); addEventListener('touchend',stop);
}
makeTitleDraggable(d.getElementById('uiTitle'), ui, x=>state.uiX=x, y=>state.uiY=y);
makeTitleDraggable(d.getElementById('editorTitle'), editor, x=>state.editorX=x, y=>state.editorY=y);

// --- Button actions ---
d.getElementById('btnEditor').onclick=()=>editor.style.display=editor.style.display==='none'?'block':'none';
d.getElementById('btnStats').onclick=()=>stats.style.display=stats.style.display==='none'?'block':'none';
d.getElementById('btnStatsSettings').onclick=()=>statsSettings.style.display=statsSettings.style.display==='none'?'block':'none';
d.getElementById('btnHide').onclick=()=>{
 ui.style.display='none'; editor.style.display='none'; statsSettings.style.display='none';
 showBtn.style.display='block'; stats.style.display='block';
};
showBtn.onclick=()=>{ui.style.display='block'; showBtn.style.display='none';};

// --- Crosshair Inputs ---
const chToggle=d.getElementById('chToggle'),chStyle=d.getElementById('chStyle'),
chOverlay=d.getElementById('chOverlay'),chSize=d.getElementById('chSize'),
chGlow=d.getElementById('chGlow'),chColor=d.getElementById('chColor'),
sizeVal=d.getElementById('sizeVal'),glowVal=d.getElementById('glowVal'),
btnReset=d.getElementById('btnReset');

chToggle.checked=state.enabled;chStyle.value=state.style;chOverlay.value=state.overlay;
chSize.value=state.size;chGlow.value=state.glow;chColor.value=state.color;

function update(fn){fn();saveState();drawCrosshair();}
chToggle.onchange=()=>update(()=>state.enabled=chToggle.checked);
chStyle.onchange=()=>update(()=>state.style=chStyle.value);
chOverlay.onchange=()=>update(()=>state.overlay=chOverlay.value);
chSize.oninput=()=>update(()=>{state.size=+chSize.value;sizeVal.textContent=state.size;});
chGlow.oninput=()=>update(()=>{state.glow=+chGlow.value;glowVal.textContent=state.glow;});
chColor.oninput=()=>update(()=>state.color=chColor.value);
btnReset.onclick=()=>{state={...defaultState,editorX:editor.offsetLeft,editorY:editor.offsetTop,uiX:ui.offsetLeft,uiY:ui.offsetTop};saveState();location.reload();};

// --- Draw Crosshair ---
function drawCrosshair(){
 ctx.clearRect(0,0,canvas.width,canvas.height);
 if(!state.enabled)return;
 ctx.save();
 ctx.translate(canvas.width/2,canvas.height/2);
 ctx.strokeStyle=ctx.fillStyle=state.color;
 ctx.lineWidth=Math.max(1,Math.min(3,state.size/50));
 if(state.glow>0){ctx.shadowColor=state.color;ctx.shadowBlur=state.glow;}
 const s=state.size, cLen=Math.min(15,s/4);
 switch(state.style){
  case'Square':ctx.strokeRect(-s/2,-s/2,s,s);break;
  case'Circle':ctx.beginPath();ctx.arc(0,0,s/2,0,2*Math.PI);ctx.stroke();break;
  case'Triangle':ctx.beginPath();ctx.moveTo(0,-s/2);ctx.lineTo(s*Math.sqrt(3)/4,s/4);ctx.lineTo(-s*Math.sqrt(3)/4,s/4);ctx.closePath();ctx.stroke();break;
  case'Pentagon':ctx.beginPath();for(let i=0;i<5;i++){let a=i*2*Math.PI/5-Math.PI/2;let x=Math.cos(a)*s/2,y=Math.sin(a)*s/2;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.stroke();break;
  case'Four Corners':
    ctx.beginPath();
    [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([x,y])=>{
      let sx=s/2*x,sy=s/2*y;
      ctx.moveTo(sx,sy);ctx.lineTo(sx-cLen*x,sy);
      ctx.moveTo(sx,sy);ctx.lineTo(sx,sy-cLen*y);
    });
    ctx.stroke();break;
 }
 ctx.shadowBlur=0;ctx.lineWidth=2;
 const oLen=Math.min(s/2,12);
 switch(state.overlay){
  case'Dot':ctx.beginPath();ctx.arc(0,0,2,0,2*Math.PI);ctx.fill();break;
  case'Plus':ctx.beginPath();ctx.moveTo(-oLen,0);ctx.lineTo(oLen,0);ctx.moveTo(0,-oLen);ctx.lineTo(0,oLen);ctx.stroke();break;
  case'Cross':ctx.beginPath();ctx.moveTo(-oLen,-oLen);ctx.lineTo(oLen,oLen);ctx.moveTo(oLen,-oLen);ctx.lineTo(-oLen,oLen);ctx.stroke();break;
 }
 ctx.restore();
}
requestAnimationFrame(function loop(){drawCrosshair();requestAnimationFrame(loop);});

// --- Stats / FPS / Ping ---
let frames=[], currentFPS=0, currentPing=0, lastPing=0;

// --- Stats selection (no Server) ---
let selectedStats = JSON.parse(L.getItem('lc_selectedStats')) || {OS:true, CPU:true, FPS:true, Ping:true};
for(const key in selectedStats){
    const cb=d.getElementById('sel'+key);
    if(cb) cb.checked=selectedStats[key];
    if(cb) cb.onchange=()=>{selectedStats[key]=cb.checked; L.setItem('lc_selectedStats',JSON.stringify(selectedStats));};
}

// --- Update Stats ---
function updateStats(){
    let lines=[];
    if(selectedStats.OS) lines.push(`OS: ${navigator.platform}`);
    if(selectedStats.CPU) lines.push(`CPU: ${navigator.hardwareConcurrency||'Unknown'} cores`);
    if(selectedStats.FPS) lines.push(`FPS: ${currentFPS}`);
    if(selectedStats.Ping) lines.push(`Ping: ${currentPing} ms`);
    stats.innerText = 'Stats:\n'+lines.join('\n');
}

// --- Stats Loop ---
(async function statsLoop(){
 const now=performance.now();frames.push(now);
 if(frames.length>60)frames.shift();
 currentFPS=Math.round((frames.length-1)/(frames[frames.length-1]-frames[0])*1000);

 if(now-lastPing>2000){
   lastPing=now;
   const start=now;
   try{await fetch('https://www.google.com/generate_204',{mode:'no-cors',cache:'no-store'}); currentPing=Math.round(performance.now()-start);}catch{currentPing='∞';}
 }
 updateStats();
 requestAnimationFrame(statsLoop);
})();
})();
