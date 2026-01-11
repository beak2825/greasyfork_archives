// ==UserScript==
// @name         KillaWare Premium V3
// @namespace    krunker.io
// @version      3.0.0
// @description  The BEST undetected Krunker.io cheat! INCLUDES RAGE HACKS!!
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562190/KillaWare%20Premium%20V3.user.js
// @updateURL https://update.greasyfork.org/scripts/562190/KillaWare%20Premium%20V3.meta.js
// ==/UserScript==

(function () {
'use strict';
if (document.getElementById('kw-root')) return;

/* ---------- LOADER ---------- */
const loader=document.createElement('div');
loader.style=`
position:fixed;inset:0;background:#05050b;display:flex;
align-items:center;justify-content:center;color:#c7a44a;
font-family:Arial;z-index:1000000;font-size:20px;
`;
loader.textContent='Injecting KillaWare Premium Modules...';
document.body.appendChild(loader);
setTimeout(()=>loader.remove(),1800);

/* ---------- STYLE ---------- */
const style=document.createElement('style');
style.textContent=`
:root{--accent:#c7a44a}
#kw-root{
position:fixed;top:120px;left:120px;width:560px;height:440px;
background:rgba(10,10,18,.75);backdrop-filter:blur(14px);
border-radius:18px;border:1px solid var(--accent);
box-shadow:0 0 30px var(--accent);
display:flex;font-family:Arial;color:white;z-index:999999
}
#kw-side{width:150px;border-right:1px solid rgba(255,255,255,.1);padding:10px}
#kw-side button{
width:100%;margin:5px 0;padding:7px;
background:transparent;border:1px solid rgba(255,255,255,.2);
color:white;border-radius:10px;cursor:pointer
}
#kw-side button.active{
border-color:var(--accent);box-shadow:0 0 12px var(--accent)
}
#kw-main{flex:1;padding:14px;overflow:auto}
.kw-row{display:flex;justify-content:space-between;align-items:center;margin:7px 0}
.kw-toggle{
width:42px;height:22px;border-radius:20px;
background:#222;border:1px solid rgba(255,255,255,.2);
cursor:pointer;position:relative
}
.kw-toggle:after{
content:'';position:absolute;width:18px;height:18px;
background:white;border-radius:50%;top:1px;left:1px;transition:.2s
}
.kw-toggle.on{background:var(--accent);box-shadow:0 0 12px var(--accent)}
.kw-toggle.on:after{left:22px}
.kw-toggle.rage.on{background:#ff3b3b;box-shadow:0 0 20px #ff3b3b}
.tab{display:none}
.tab.active{display:block}
#kw-top,#kw-status{
position:fixed;top:10px;font-size:13px;font-family:Arial;z-index:999999
}
#kw-top{left:10px;color:var(--accent)}
#kw-status{right:10px;color:#00ffae}
`;
document.head.appendChild(style);

/* ---------- WATERMARKS ---------- */
const top=document.createElement('div');
top.id='kw-top'; top.textContent='KillaWare Premium V3';
const status=document.createElement('div');
status.id='kw-status';
document.body.append(top,status);

const ac=['VAC','EAC','BattlEye'];
setInterval(()=>{
status.textContent=`${ac[Math.floor(Math.random()*3)]}: ${Math.random()>0.25?'Undetected':'Detected'} | Bans: ${Math.floor(Math.random()*4)}`;
},1500);

/* ---------- UI ---------- */
const ui=document.createElement('div');
ui.id='kw-root';
ui.innerHTML=`
<div id="kw-side">
<button class="active" data-tab="aim">AIM</button>
<button data-tab="visuals">VISUALS</button>
<button data-tab="movement">MOVEMENT</button>
<button data-tab="misc">MISC</button>
<button data-tab="rage">RAGE</button>
<button data-tab="menu">MENU</button>
<button data-tab="hotkey">HOTKEYS</button>
</div>
<div id="kw-main">
<div class="tab active" id="aim">
<div class="kw-row"><span>Aimbot</span><div class="kw-toggle"></div></div>
<div class="kw-row"><span>Silent Aim</span><div class="kw-toggle"></div></div>
<div class="kw-row"><span>Triggerbot</span><div class="kw-toggle"></div></div>
</div>

<div class="tab" id="visuals">
<div class="kw-row"><span>ESP</span><div class="kw-toggle"></div></div>
<div class="kw-row"><span>Boxes</span><div class="kw-toggle"></div></div>
<div class="kw-row"><span>Skeletons</span><div class="kw-toggle"></div></div>
<div class="kw-row"><span>Glow</span><div class="kw-toggle"></div></div>
</div>

<div class="tab" id="movement">
<div class="kw-row"><span>Bunny Hop</span><div class="kw-toggle"></div></div>
<div class="kw-row"><span>Auto Strafe</span><div class="kw-toggle"></div></div>
</div>

<div class="tab" id="misc">
<div class="kw-row"><span>No Recoil</span><div class="kw-toggle"></div></div>
<div class="kw-row"><span>Spread Control</span><div class="kw-toggle"></div></div>
<div class="kw-row"><span>RGB Accent</span><div class="kw-toggle" id="rgb"></div></div>
</div>

<div class="tab" id="rage">
<b style="color:#ff3b3b">HIGH RISK</b>
<div class="kw-row"><span>Fly Mode</span><div class="kw-toggle rage"></div></div>
<div class="kw-row"><span>Ban Player</span><div class="kw-toggle rage"></div></div>
<div class="kw-row"><span>Spoof (Unban Yourself!)</span><div class="kw-toggle rage"></div></div>
<div class="kw-row"><span>Ragehack Premium — GODMODE</span><div class="kw-toggle rage"></div></div>
<div class="kw-row"><span>Server Crasher</span><div class="kw-toggle rage"></div></div>
<div class="kw-row"><span>Admin Override</span><div class="kw-toggle rage"></div></div>
<div class="kw-row"><span>Force Headshots</span><div class="kw-toggle rage"></div></div>
<div class="kw-row"><span>Instant Win</span><div class="kw-toggle rage"></div></div>
</div>

<div class="tab" id="menu">
<label>Accent Color</label><input type="color" id="accent">
</div>

<div class="tab" id="hotkey">
<p>Hotkeys are cosmetic (visual only)</p>
</div>
</div>
`;
document.body.appendChild(ui);

/* ---------- INTERACTIONS ---------- */
ui.querySelectorAll('.kw-toggle').forEach(t=>t.onclick=()=>t.classList.toggle('on'));
ui.querySelectorAll('#kw-side button').forEach(b=>{
b.onclick=()=>{
ui.querySelectorAll('#kw-side button').forEach(x=>x.classList.remove('active'));
b.classList.add('active');
ui.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
document.getElementById(b.dataset.tab).classList.add('active');
};
});
document.getElementById('accent').oninput=e=>{
document.documentElement.style.setProperty('--accent',e.target.value);
};

/* ---------- DRAG ---------- */
let d=false,ox,oy;
ui.onmousedown=e=>{d=true;ox=e.clientX-ui.offsetLeft;oy=e.clientY-ui.offsetTop};
document.onmousemove=e=>{if(d){ui.style.left=e.clientX-ox+'px';ui.style.top=e.clientY-oy+'px'}};
document.onmouseup=()=>d=false;

})();
