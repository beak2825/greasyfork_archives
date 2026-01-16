// ==UserScript==
// @name         Kornet Panel + Goruda V2 Theme
// @namespace    kornet.panel.ui
// @version      5.1
// @description  Kornet panel with Apple-style controls, pages, animated minimize, and Goruda V2 theme
// @match        https://kornet.lat/*
// @match        https://www.kornet.lat/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562793/Kornet%20Panel%20%2B%20Goruda%20V2%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/562793/Kornet%20Panel%20%2B%20Goruda%20V2%20Theme.meta.js
// ==/UserScript==

(function () {
  'use strict';
  if (document.getElementById("kornet-panel")) return;

  /* ---------------- STYLE ---------------- */
  const style = document.createElement("style");
  style.textContent = `
#kornet-panel *{box-sizing:border-box;font-family:Segoe UI,Roboto,Arial}
#kornet-panel{
  position:fixed;top:70px;left:70px;
  width:640px;height:460px;
  min-width:560px;min-height:360px;
  background:#0b0f15;border:1px solid #1f2937;
  box-shadow:0 0 45px rgba(0,0,0,.85);
  display:flex;flex-direction:column;
  resize:both;overflow:hidden;
  z-index:99999999;color:#e5e7eb;
}
#kornet-header{
  height:34px;background:linear-gradient(#111827,#0b1220);
  display:flex;align-items:center;justify-content:space-between;
  padding:0 10px;cursor:move;
  user-select:none;border-bottom:1px solid #1f2937;
  font-size:12px;font-weight:600
}
#kornet-controls{display:flex;gap:6px;align-items:center}
.k-apple-btn{
  width:12px;height:12px;border-radius:50%;
  display:inline-block;cursor:pointer;
  border:1px solid rgba(0,0,0,0.2);
}
.k-apple-close{background:#ff5f56;}
.k-apple-minimize{background:#ffbd2e;}
#kornet-body{flex:1;display:flex}
#kornet-sidebar{
  width:160px;background:#0a0e14;
  border-right:1px solid #1f2937
}
.k-tab{
  padding:9px 12px;font-size:11px;
  cursor:pointer;border-bottom:1px solid #111827
}
.k-tab:hover{background:#111827}
.k-tab.active{background:#1f2937}
#kornet-content{
  flex:1;padding:12px;font-size:11px;overflow:auto
}
.k-page{display:none}
.k-page.active{display:block;opacity:1;transition:opacity 0.25s ease;}
.k-page.fade-out{opacity:0;}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
button{
  background:#111827;border:1px solid #1f2937;
  color:#e5e7eb;padding:6px;font-size:10px;
  cursor:pointer;position:relative;overflow:hidden;
  transition:transform .08s,box-shadow .08s,background .15s;
}
button:hover {
  background:#1f2937;
  box-shadow: 0 0 8px #3b82f6;
  transform: scale(1.02);
}
button:active{
  transform:translateY(1px) scale(.98);
  box-shadow:inset 0 0 6px rgba(0,0,0,.6)
}
button::after{
  content:"";position:absolute;inset:0;
  background:rgba(255,255,255,.06);
  opacity:0;transition:opacity .15s
}
button:active::after{opacity:1}
button.danger{background:#220a0a;border-color:#7f1d1d}
button.danger:hover{background:#7f1d1d}
#k-log{
  margin-top:10px;background:#05070b;
  border:1px solid #1f2937;
  height:90px;overflow:auto;
  padding:6px;font-size:10px;color:#9ca3af
}
.k-bar-input {
  width:100%;
  padding:6px 10px;
  margin:4px 0;
  border-radius:4px;
  border:1px solid #1f2937;
  background:#1f2937;
  color:#e5e7eb;
  font-size:11px;
}
.k-bar-input:focus{
  outline:none;
  border-color:#3b82f6;
  box-shadow:0 0 3px #3b82f6;
}
/* Corrupt overlay */
#k-corrupt{
  position: fixed;
  inset: 0;
  background: repeating-conic-gradient(
    #ff69b4 0% 25%,
    #000 0% 50%
  );
  background-size: 80px 80px;
  display: none;
  z-index: 999999999;
}
#k-minimized-bar{
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#e5e7eb;
  font-size:12px;
  background:#0b0f15;
  border:1px solid #1f2937;
  position:fixed;
  z-index:99999999;
}

`;
  document.head.appendChild(style);

  /* ---------------- PANEL ---------------- */
  const panel = document.createElement("div");
  panel.id = "kornet-panel";
  panel.innerHTML = `
<div id="k-corrupt"></div>
<div id="kornet-header">
  <div id="kornet-controls">
    <span class="k-apple-btn k-apple-close"></span>
    <span class="k-apple-btn k-apple-minimize"></span>
  </div>
  <div>KORNET — Internal Administration</div>
</div>
<div id="kornet-body">
  <div id="kornet-sidebar">
    ${["Overview","Players","Assets","Moderation","Servers","Security","Danger Zone","Themes"]
      .map((t,i)=>`<div class="k-tab ${i===0?"active":""}" data-tab="${t.toLowerCase().replace(" ","")}">${t}</div>`).join("")}
  </div>

  <div id="kornet-content">
    <div class="k-page active" id="overview">
      Status: <span id="status">Online</span><br>
      Registered Players: 0<br>
      Active Players: 0
      <div id="k-log"></div>
    </div>

    <div class="k-page" id="players">
      <div class="grid">
        <button data-log="Player kicked">Kick Player</button>
        <button data-log="Player banned">Ban Player</button>
        <button data-log="Character reset">Reset Character</button>
        <button data-log="Forced rejoin">Force Rejoin</button>
      </div>
      <input class="k-bar-input" placeholder="Player Name" value="JohnDoe">
    </div>

    <div class="k-page" id="assets">
      <div class="grid">
        <button class="danger" data-log="All hats deleted">Delete Hats</button>
        <button class="danger" data-log="All shirts deleted">Delete Shirts</button>
        <button data-log="Assets reindexed">Reindex Assets</button>
        <button data-log="Cache rebuilt">Rebuild Cache</button>
      </div>
      <input class="k-bar-input" placeholder="Hat Name" value="CoolCap">
    </div>

    <div class="k-page" id="moderation">
      <div class="grid">
        <button id="lockBtn">Toggle Lockdown</button>
        <button data-log="Chat disabled">Disable Chat</button>
        <button data-log="Reports cleared">Clear Reports</button>
        <button data-log="Punishments reset">Reset Punishments</button>
      </div>
    </div>

    <div class="k-page" id="servers">
      <div class="grid">
        <button data-log="Server restarting">Restart Server</button>
        <button data-log="Server shutdown queued">Shutdown Server</button>
        <button data-log="Config reloaded">Reload Config</button>
        <button data-log="Update forced">Force Update</button>
      </div>
    </div>

    <div class="k-page" id="security">
      <div class="grid">
        <button data-log="Keys rotated">Rotate Keys</button>
        <button data-log="Sessions invalidated">Invalidate Sessions</button>
        <button data-log="Audit completed">Audit Logs</button>
        <button data-log="MFA enforced">Force MFA</button>
      </div>
      <input class="k-bar-input" placeholder="Player Name" value="JohnDoe">
    </div>

    <div class="k-page" id="dangerzone">
      <div class="grid">
        <button class="danger" data-log="Places deleted">Delete Places</button>
        <button class="danger" data-log="Accounts removed">Delete Accounts</button>
        <button class="danger" id="corruptBtn">Corrupt Page</button>
        <button class="danger" id="deleteWebsiteBtn" data-log="Website deletion queued">Delete Website</button>
      </div>
    </div>

<div class="k-page" id="themes">
  <p>Custom background image:</p>

  <input
    id="bg-url"
    class="k-bar-input"
    placeholder="Paste image URL here"
  >

  <button id="apply-bg">Apply Background</button>
  <button id="clear-bg">Clear Background</button>
<p>Background blur:</p>
<input
  id="bg-blur"
  type="range"
  min="0"
  max="20"
  value="0"
>

</div>
  </div>
</div>`;
  document.body.appendChild(panel);
// === LOAD SAVED BACKGROUND ===
const savedBg = localStorage.getItem("kornet-bg");
if (savedBg) {
  panel.style.backgroundImage = `url("${savedBg}")`;
  panel.style.backgroundSize = "cover";
  panel.style.backgroundPosition = "center";
  panel.style.backgroundRepeat = "no-repeat";
  panel.style.backgroundColor = "rgba(0,0,0,0.55)";
  panel.style.backgroundBlendMode = "overlay";
}

// === LOAD SAVED BLUR ===
const savedBlur = localStorage.getItem("kornet-blur");
if (savedBlur) {
  panel.style.backdropFilter = `blur(${savedBlur}px)`;

  const blurSlider = document.getElementById("bg-blur");
  if (blurSlider) blurSlider.value = savedBlur;
}

  /* ---------------- LOGIC ---------------- */
  const logBox = document.getElementById("k-log");
  const corruptOverlay = document.getElementById("k-corrupt");

  function logAction(text){
    const time = new Date().toLocaleTimeString();
    logBox.innerHTML += `[${time}] ${text}<br>`;
    logBox.scrollTop = logBox.scrollHeight;
    alert(text);
  }

  // Tabs with fade animation
  document.querySelectorAll(".k-tab").forEach(tab=>{
    tab.onclick=()=>{
      document.querySelectorAll(".k-tab").forEach(t=>t.classList.remove("active"));
      const currentPage = document.querySelector(".k-page.active");
      if(currentPage) {
        currentPage.classList.add("fade-out");
        setTimeout(() => {
          currentPage.classList.remove("active","fade-out");
          const nextPage = document.getElementById(tab.dataset.tab);
          nextPage.classList.add("active");
        }, 200);
      } else {
        document.querySelectorAll(".k-page").forEach(p=>p.classList.remove("active"));
        document.getElementById(tab.dataset.tab).classList.add("active");
      }
      tab.classList.add("active");
    };
  });

  // Dynamic buttons logs
  const dynamicSections = ["players","assets","security"];
  dynamicSections.forEach(section=>{
    document.querySelectorAll(`#${section} button[data-log]`).forEach(btn=>{
      btn.onclick = ()=>{
        const inputValue = document.querySelector(`#${section} .k-bar-input`).value;
        logAction(`${btn.dataset.log} → ${inputValue}`);
      };
    });
  });

  // Corrupt Page
  document.getElementById("corruptBtn").onclick=()=>{
    if(confirm("This action is irreversible. Continue?")){
      corruptOverlay.style.display="block";
      logAction("Page corrupted");
    }
  };

  // Delete Website
  document.getElementById("deleteWebsiteBtn").onclick = () => {
    logAction("Website deletion queued");
    alert("Page deleted!");
    document.body.innerHTML = "";
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "repeating-conic-gradient(#ff69b4 0% 25%, #000 0% 50%)";
    overlay.style.backgroundSize = "80px 80px";
    overlay.style.zIndex = "999999999";
    document.body.appendChild(overlay);
  };

  // Lockdown
  document.getElementById("lockBtn").onclick=()=>{
    const s=document.getElementById("status");
    s.textContent = s.textContent==="Online"?"Lockdown":"Online";
    logAction("Status changed to "+s.textContent);
  };

  // Drag
  let dx,dy,drag=false;
  const header=document.getElementById("kornet-header");
  header.onmousedown=e=>{
    drag=true;dx=e.clientX-panel.offsetLeft;dy=e.clientY-panel.offsetTop;
  };
  document.onmouseup=()=>drag=false;
  document.onmousemove=e=>{
    if(!drag)return;
    panel.style.left=e.clientX-dx+"px";
    panel.style.top=e.clientY-dy+"px";
  };

  // Apple buttons
  document.querySelector(".k-apple-close").onclick = ()=>panel.remove();
// Custom background image
const bgInput = document.getElementById("bg-url");
const applyBgBtn = document.getElementById("apply-bg");
const clearBgBtn = document.getElementById("clear-bg");
const blurSlider = document.getElementById("bg-blur");

// Apply blur
blurSlider.oninput = () => {
  const blur = blurSlider.value;
  panel.style.backdropFilter = `blur(${blur}px)`;
  panel.style.backgroundColor = `rgba(0,0,0,${0.55 + blur * 0.01})`;

  // SAVE
  localStorage.setItem("kornet-blur", blur);
};


applyBgBtn.onclick = () => {
  const url = bgInput.value.trim();
  if (!url) {
    alert("Paste an image URL first");
    return;
  }

  panel.style.backgroundImage = `url("${url}")`;
  panel.style.backgroundSize = "cover";
  panel.style.backgroundPosition = "center";
  panel.style.backgroundRepeat = "no-repeat";
  panel.style.backgroundColor = "rgba(0,0,0,0.55)";
  panel.style.backgroundBlendMode = "overlay";

  // SAVE
  localStorage.setItem("kornet-bg", url);
};


clearBgBtn.onclick = () => {
  panel.style.backgroundImage = "none";
  panel.style.backgroundColor = "#0b0f15";
  panel.style.backgroundBlendMode = "normal";

  // CLEAR SAVE
  localStorage.removeItem("kornet-bg");
};



  // Minimize → animated shrink
  document.querySelector(".k-apple-minimize").onclick = () => {
    const panelHeight = panel.offsetHeight;
    const headerHeight = 34;
    const width = panel.offsetWidth;
    const left = panel.offsetLeft;
    const top = panel.offsetTop;

    let bar = document.getElementById("k-minimized-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "k-minimized-bar";
      bar.style.left = left + "px";
      bar.style.top = top + panelHeight - headerHeight + "px";
      bar.style.width = width + "px";
      bar.style.height = headerHeight + "px";
      bar.textContent = "KORNET — Panel Minimized";
      document.body.appendChild(bar);

      bar.onclick = () => {
        panel.style.display = "flex";
        panel.style.transition = "all 0.25s ease";
        requestAnimationFrame(() => {
          panel.style.height = "460px";
          panel.style.top = top + "px";
        });
        setTimeout(() => {
          panel.style.transition = "";
        }, 300);
        bar.remove();
      };
    }

    panel.style.transition = "all 0.25s ease";
    requestAnimationFrame(() => {
      panel.style.height = headerHeight + "px";
      panel.style.top = top + panelHeight - headerHeight + "px";
    });
    setTimeout(() => {
      panel.style.display = "none";
      panel.style.transition = "";
    }, 250);
  };

  // Theme buttons
  document.getElementById("theme-default").onclick = () => {
    panel.style.background = "#0b0f15";
    panel.style.border = "1px solid #1f2937";
    panel.style.color = "#e5e7eb";
    panel.style.backdropFilter = "none";
    panel.style.boxShadow = "0 0 45px rgba(0,0,0,.85)";
  };

  document.getElementById("theme-goruda").onclick = () => {
    panel.style.background = "rgba(15,15,20,0.95)";
    panel.style.border = "1px solid #3b3f50";
    panel.style.color = "#a0c0ff";
    panel.style.backdropFilter = "blur(15px) saturate(180%)";
    panel.style.boxShadow = "0 0 45px rgba(0,0,50,.6)";
  };

})();
