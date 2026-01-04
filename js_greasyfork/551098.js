// ==UserScript==
// @name         PirateMatts Poxel Client
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Fully collapsible settings menu with draggable gear, crosshair, Tweaks (FPS+RoomID, Performance, Keystrokes), LSD + Grayscale toggles, auto-premium bypass
// @author       You
// @license MIT
// @match        *://poxel.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551098/PirateMatts%20Poxel%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/551098/PirateMatts%20Poxel%20Client.meta.js
// ==/UserScript==

(function(){
    "use strict";

    // ===== STYLES =====
    const style=document.createElement("style");
    style.textContent=`
        .poxel-menu {position: fixed; top:100px; left:100px; width:250px; background:rgba(20,20,20,0.9); color:white; font-family:Arial,sans-serif; border-radius:12px; border:1px solid rgba(255,255,255,0.3); box-shadow:0px 4px 12px rgba(0,0,0,0.4); z-index:9999; cursor:default; user-select:none; overflow:hidden; transition: all 0.2s ease; text-align:center;}
        .poxel-menu.collapsed {width:45px; height:45px; border-radius:50%; background: rgba(20,20,20,0.7); display:flex; justify-content:center; align-items:center; cursor:grab;}
        .poxel-menu-header {display:flex; justify-content:center; align-items:center; font-size:16px; font-weight:bold; padding:8px 10px; background: rgba(255,255,255,0.05); border-bottom:1px solid rgba(255,255,255,0.2); cursor:move; gap:8px;}
        .poxel-menu.collapsed .poxel-menu-header span:first-child, .poxel-menu.collapsed .poxel-menu-content {display:none !important;}
        .poxel-menu-gear {cursor:pointer; font-size:20px; transition:transform 0.3s ease;}
        .poxel-menu.collapsed .poxel-menu-gear {transform:rotate(-90deg); font-size:22px;}
        .poxel-menu button, .poxel-menu select {width:90%; margin:6px auto; padding:8px; background: rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.3); color:white; border-radius:8px; font-size:14px; cursor:pointer; display:block; text-align:center; transition: background 0.2s, border 0.2s, transform 0.1s;}
        .poxel-menu button:hover, .poxel-menu select:hover {background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.5); transform: scale(1.03);}
        .section-header {display:flex; justify-content:center; align-items:center; cursor:pointer; padding:6px 2px; font-weight:bold; margin-top:8px; user-select:none; gap:5px;}
        .section-arrow {transition: transform 0.2s ease;}
        .section-content {display:none; margin-top:5px; padding:4px;}
        .fps-box {position:fixed; bottom:15px; left:15px; background:rgba(0,0,0,0.7); color:#fff !important; font-family:Arial,sans-serif !important; font-size:14px; font-weight:bold; padding:6px 10px; border-radius:8px; box-shadow:0px 2px 6px rgba(0,0,0,0.5); z-index:9999; display:none; min-width:80px; text-align:left; line-height:1.4;}
        .keystroke-box {position:fixed; bottom:80px; left:15px; background:rgba(0,0,0,0.7); color:white; font-family:Arial,sans-serif; font-weight:bold; font-size:16px; padding:8px 10px; border-radius:8px; box-shadow:0px 2px 6px rgba(0,0,0,0.5); z-index:9999; display:none; text-align:center; line-height:1.2;}
        .keystroke-row {display:flex; justify-content:center; margin:2px 0;}
        .keystroke-key {display:inline-block; margin:0 4px; padding:4px 6px; border:1px solid white; border-radius:4px; min-width:20px; transition:all 0.1s ease;}
    `;
    document.head.appendChild(style);

    // ===== MENU =====
    const menu=document.createElement("div"); menu.className="poxel-menu";
    const header=document.createElement("div"); header.className="poxel-menu-header";
    header.innerHTML=`<span>PirateMatts Poxel Client</span><span class="poxel-menu-gear">⚙</span>`;
    menu.appendChild(header);
    const content=document.createElement("div"); content.className="poxel-menu-content"; menu.appendChild(content);
    document.body.appendChild(menu);

    const gear=header.querySelector(".poxel-menu-gear");
    gear.addEventListener("click", e=>{ e.stopPropagation(); menu.classList.toggle("collapsed"); });

    function addSection(title){
        const sectionHeader=document.createElement("div"); sectionHeader.className="section-header";
        sectionHeader.innerHTML=`<span>${title}</span><span class="section-arrow">▶</span>`;
        const sectionContent=document.createElement("div"); sectionContent.className="section-content";
        sectionHeader.addEventListener("click", ()=>{
            const isOpen=sectionContent.style.display==="block";
            sectionContent.style.display=isOpen?"none":"block";
            sectionHeader.querySelector(".section-arrow").style.transform=isOpen?"rotate(0deg)":"rotate(90deg)";
        });
        content.appendChild(sectionHeader);
        content.appendChild(sectionContent);
        return sectionContent;
    }

    // ===== DRAG =====
    let isDragging=false, offsetX, offsetY;
    menu.addEventListener("mousedown", e=>{ if(e.target===gear)return; isDragging=true; offsetX=e.clientX-menu.offsetLeft; offsetY=e.clientY-menu.offsetTop; menu.style.cursor="grabbing"; });
    document.addEventListener("mousemove", e=>{ if(isDragging){ menu.style.left=e.clientX-offsetX+"px"; menu.style.top=e.clientY-offsetY+"px"; } });
    document.addEventListener("mouseup", ()=>{ isDragging=false; menu.style.cursor = menu.classList.contains("collapsed")?"grab":"default"; });

    // ===== CROSSHAIR =====
    const crosshair=document.createElement("div"); crosshair.style.position="fixed"; crosshair.style.top="50%"; crosshair.style.left="50%"; crosshair.style.transform="translate(-50%,-50%)"; crosshair.style.zIndex="9999"; crosshair.style.pointerEvents="none"; crosshair.style.display="none"; document.body.appendChild(crosshair);
    const crosshairs={Dot:"8px solid red", Cross:"1px solid lime", X:"2px dashed white", Circle:"2px solid yellow"};
    const crosshairSection=addSection("🎯 Crosshair");
    const select=document.createElement("select");
    for(const name in crosshairs){ const option=document.createElement("option"); option.value=name; option.textContent=name; select.appendChild(option);}
    crosshairSection.appendChild(select);
    const toggleCrosshairBtn=document.createElement("button"); toggleCrosshairBtn.textContent="Toggle Crosshair"; toggleCrosshairBtn.addEventListener("click",()=>{ crosshair.style.display=crosshair.style.display==="none"?"block":"none"; }); crosshairSection.appendChild(toggleCrosshairBtn);
    select.addEventListener("change", ()=>{ const style=crosshairs[select.value]; crosshair.style.width="12px"; crosshair.style.height="12px"; crosshair.style.border=style; crosshair.style.borderRadius=select.value==="Circle"?"50%":"0";});
    select.dispatchEvent(new Event("change"));

    // ===== FPS & Room ID =====
    const fpsBox=document.createElement("div"); fpsBox.className="fps-box"; fpsBox.innerHTML=`<strong>FPS: 0<br>Room: ${window.location.hash.substring(1)||"N/A"}</strong>`; document.body.appendChild(fpsBox);
    let showFPS=false, frameCount=0, lastFrame=performance.now();
    function updateFPS(){ const now=performance.now(); frameCount++; if(now-lastFrame>=1000){ fpsBox.innerHTML=`<strong>FPS: ${frameCount}<br>Room: ${window.location.hash.substring(1)||"N/A"}</strong>`; frameCount=0; lastFrame=now; } requestAnimationFrame(updateFPS); }
    requestAnimationFrame(updateFPS);

    // ===== TWEAKS =====
    const tweaksSection=addSection("📊 Tweaks");
    const toggleFPSBtn=document.createElement("button"); toggleFPSBtn.textContent="Toggle Stats"; toggleFPSBtn.addEventListener("click", ()=>{ showFPS=!showFPS; fpsBox.style.display=showFPS?"block":"none"; }); tweaksSection.appendChild(toggleFPSBtn);

    const performanceBtn=document.createElement("button"); performanceBtn.textContent="Toggle Performance Mode"; performanceBtn.addEventListener("click",()=>{ document.body.style.imageRendering=document.body.style.imageRendering==="pixelated"? "":"pixelated"; }); tweaksSection.appendChild(performanceBtn);

    // ===== KEYSTROKES =====
    const keystrokeBox=document.createElement("div"); keystrokeBox.className="keystroke-box";
    keystrokeBox.innerHTML=`
        <div class="keystroke-row"><div class="keystroke-key" data-key="w">W</div></div>
        <div class="keystroke-row"><div class="keystroke-key" data-key="a">A</div><div class="keystroke-key" data-key="s">S</div><div class="keystroke-key" data-key="d">D</div></div>
        <div class="keystroke-row"><div class="keystroke-key" data-key="shift">Shift</div><div class="keystroke-key" data-key=" ">Space</div><div class="keystroke-key" data-key="mouse0">LMB</div></div>
    `;
    document.body.appendChild(keystrokeBox);
    let keystrokeEnabled=false;
    const toggleKeystrokeBtn=document.createElement("button"); toggleKeystrokeBtn.textContent="Toggle Keystrokes"; toggleKeystrokeBtn.addEventListener("click",()=>{ keystrokeEnabled=!keystrokeEnabled; keystrokeBox.style.display=keystrokeEnabled?"block":"none"; });
    tweaksSection.appendChild(toggleKeystrokeBtn);

    document.addEventListener("keydown",(e)=>{ if(!keystrokeEnabled) return; const key=e.key.toLowerCase(); const keyDiv=keystrokeBox.querySelector(`.keystroke-key[data-key="${key}"]`); if(keyDiv){ keyDiv.style.background="white"; keyDiv.style.color="black"; }});
    document.addEventListener("keyup",(e)=>{ if(!keystrokeEnabled) return; const key=e.key.toLowerCase(); const keyDiv=keystrokeBox.querySelector(`.keystroke-key[data-key="${key}"]`); if(keyDiv){ keyDiv.style.background="transparent"; keyDiv.style.color="white"; }});
    document.addEventListener("mousedown",(e)=>{ if(!keystrokeEnabled) return; if(e.button===0){ const mouseDiv=keystrokeBox.querySelector(`.keystroke-key[data-key="mouse0"]`); if(mouseDiv){ mouseDiv.style.background="white"; mouseDiv.style.color="black"; } }});
    document.addEventListener("mouseup",(e)=>{ if(!keystrokeEnabled) return; if(e.button===0){ const mouseDiv=keystrokeBox.querySelector(`.keystroke-key[data-key="mouse0"]`); if(mouseDiv){ mouseDiv.style.background="transparent"; mouseDiv.style.color="white"; } }});

    // ===== WONKY EFFECTS =====
    const effectsSection=addSection("🎨 Wonky Effects");

    // LSD Toggle
    const toggleLSDBtn=document.createElement("button"); toggleLSDBtn.textContent="Toggle LSD Effect";
    let lsdOverlay, lsdRunning=false, cancelLSD=null;
    toggleLSDBtn.addEventListener("click", ()=>{
        if(!lsdRunning){
            const canvas=document.querySelector("canvas");
            let time=0, running=true;
            function filterLoop(){ if(!running) return; time+=0.02; if(canvas) canvas.style.filter=`hue-rotate(${time*100}deg) saturate(${1+0.5*Math.sin(time*5)}) invert(${0.5+0.5*Math.sin(time*3)}) contrast(150%) brightness(120%)`; requestAnimationFrame(filterLoop);}
            filterLoop();
            lsdOverlay=document.createElement("div");
            lsdOverlay.style.position="fixed"; lsdOverlay.style.top=0; lsdOverlay.style.left=0; lsdOverlay.style.width="100vw"; lsdOverlay.style.height="100vh"; lsdOverlay.style.pointerEvents="none"; lsdOverlay.style.zIndex=9999; lsdOverlay.style.mixBlendMode="hue"; lsdOverlay.style.opacity="0.4"; lsdOverlay.style.background=`repeating-linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)`; lsdOverlay.style.backgroundSize="400% 400%"; lsdOverlay.style.animation="tripAnim 10s linear infinite alternate";
            document.body.appendChild(lsdOverlay);
            const keyframes=document.createElement("style"); keyframes.innerHTML=`@keyframes tripAnim{0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}`; document.head.appendChild(keyframes);
            cancelLSD=()=>{ running=false; if(canvas)canvas.style.filter=""; if(lsdOverlay)lsdOverlay.remove(); keyframes.remove(); lsdRunning=false;};
            lsdRunning=true;
        } else cancelLSD();
    });
    effectsSection.appendChild(toggleLSDBtn);

    // Grayscale Toggle (static)
    const toggleGrayBtn=document.createElement("button"); toggleGrayBtn.textContent="Toggle Grayscale";
    let grayRunning=false;
    toggleGrayBtn.addEventListener("click", ()=>{
        const canvas=document.querySelector("canvas");
        if(!canvas) return;
        if(!grayRunning){ canvas.style.filter=(canvas.style.filter||"").replace(/grayscale\(.*?\)/,"")+" grayscale(40%)"; grayRunning=true;}
        else{ canvas.style.filter=(canvas.style.filter||"").replace(/grayscale\(.*?\)/,""); grayRunning=false;}
    });
    effectsSection.appendChild(toggleGrayBtn);

    // ===== AUTO PREMIUM =====
    (function(){ const originalFetch=window.fetch; window.fetch=async function(input,init){ const url=typeof input==="string"? input: input.url; if(/poxel\.io\/api\/accounts\/profile$/.test(url)){ const response=await originalFetch(input,init); const clone=response.clone(); const text=await clone.text(); const data=JSON.parse(text); data.premiumEnds="2031-01-01T00:00:00.000Z"; return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:response.headers});} return originalFetch(input,init);};})();
})();
