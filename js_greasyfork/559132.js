// ==UserScript==
// @name         Darkest Age EXP Tracker
// @namespace    darkestage-exp-tracker
// @version      2.6
// @description  EXP Tracker 
// @match        https://darkestage.net/game/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559132/Darkest%20Age%20EXP%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/559132/Darkest%20Age%20EXP%20Tracker.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const POLL = 400;

  let totalGain = 0;
  let lastExp = null;
  let lastLevel = null;
  let startTime = Date.now();
  let maxExp = 0;

  let mode = "normal";
  let showTimer = true;
  let showRate = true;
  let showLog = true;
  let showETA = true;

  /* ================= STYLE ================= */
  const style = document.createElement("style");
  style.textContent = `
  #daExpCard{
    position:fixed;
    top:120px;left:12px;
    width:300px;
    background:#1e293b;
    color:#e5e7eb;
    font-family:system-ui,-apple-system,Segoe UI,Roboto;
    font-size:13px;
    border-radius:14px;
    box-shadow:0 12px 30px rgba(0,0,0,.45);
    z-index:999999;
    touch-action:none;
  }

  #daExpHeader{
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:10px 12px;
    font-weight:700;
    cursor:move;
    background:#0f172a;
    border-radius:14px 14px 0 0;
  }

  .mini-btn{
    width:22px;height:22px;
    display:flex;
    align-items:center;
    justify-content:center;
    border:1px solid #475569;
    border-radius:4px;
    cursor:pointer;
    background:#1e293b;
    color:#e5e7eb;
    transition:.15s;
    user-select:none;
  }
  .mini-btn:hover{background:#334155}
  .mini-btn.active{
    background:#2563eb;
    border-color:#60a5fa;
    color:#fff;
  }

  #daContent{padding:12px}

  #daContent hr{
    border:none;
    border-top:1px solid #334155;
    margin:8px 0;
  }

  input{
    background:#0f172a;
    color:#e5e7eb;
    border:1px solid #334155;
    border-radius:6px;
    padding:4px;
  }

  .daRow{
    display:flex;
    justify-content:space-between;
    margin:4px 0;
  }

  .daBtn{
    padding:4px 8px;
    border-radius:6px;
    border:1px solid #334155;
    background:#0f172a;
    color:#e5e7eb;
    cursor:pointer;
    font-size:12px;
  }
  .daBtn.active{
    background:#2563eb;
    border-color:#60a5fa;
    color:white;
  }

  #daLog{
    max-height:90px;
    overflow:auto;
    font-size:11px;
    background:#0f172a;
    padding:6px;
    border-radius:8px;
    border:1px solid #334155;
  }

  #daExpCard.mini #daContent{display:none}
  #daExpCard.simple #normalBlock{display:none}
  #daExpCard.simple #simpleBlock{display:block}
  #simpleBlock{display:none}
  
  /* ETA specific styles */
  .eta-infinite {
    color: #fbbf24;
    font-style: italic;
  }
  .eta-zero {
    color: #10b981;
  }
  `;
  document.head.appendChild(style);

  /* ================= WAIT GAME ================= */
  function waitGame(){
    if(!document.querySelector(".exp[data-value]")){
      setTimeout(waitGame,1000); return;
    }
    init();
  }

  function init(){
    const card=document.createElement("div");
    card.id="daExpCard";
    card.innerHTML=`
      <div id="daExpHeader">
        <span>EXP Tracker</span>
        <div id="miniBtn" class="mini-btn">_</div>
      </div>

      <div id="daContent">
        <div id="normalBlock">
          Max EXP
          <input id="maxExp" type="number" style="width:100%;margin:6px 0">

          <div class="daRow">
            <button class="daBtn active" id="tTimer">Timer</button>
            <button class="daBtn active" id="tRate">Exp/Min</button>
            <button class="daBtn active" id="tETA">ETA</button>
            <button class="daBtn active" id="tLog">Log</button>
            <button class="daBtn" id="resetBtn">Reset</button>
          </div>

          <hr>

          <div class="daRow"><span>Current</span><span id="cur">0</span></div>
          <div class="daRow"><span>Gained</span><span id="gain">0</span></div>
          <div class="daRow"><span>Need</span><span id="need">-</span></div>
          <div class="daRow"><span>Progress</span><span id="prog">0%</span></div>
          <div class="daRow" id="rateRow"><span>Exp/min</span><span id="rate">0</span></div>
          <div class="daRow" id="timeRow"><span>Time</span><span id="time">00:00:00</span></div>
          <div class="daRow" id="etaRow"><span>ETA Level-up</span><span id="eta">--:--:--</span></div>

          <hr>
          <div id="daLog"></div>
        </div>

        <div id="simpleBlock">
          <div class="daRow"><b>Progress</b><b id="sProg">0%</b></div>
          <div class="daRow"><b>Need EXP</b><b id="sNeed">-</b></div>
          <div class="daRow"><b>Gained</b><b id="sGain">0</b></div>
          <div class="daRow"><b>ETA Level-up</b><b id="sETA">--:--:--</b></b></div>
        </div>

        <hr>
        <button class="daBtn" id="simpleBtn">Simple</button>
      </div>
    `;
    document.body.appendChild(card);

    /* ===== MAX EXP ===== */
    const maxInput=card.querySelector("#maxExp");
    maxInput.value=localStorage.getItem("da_max_exp")||"";
    maxExp=+maxInput.value||0;
    maxInput.onchange=()=>{
      maxExp=+maxInput.value||0;
      localStorage.setItem("da_max_exp",maxExp);
    };

    /* ===== MINI / SIMPLE ===== */
    const miniBtn=card.querySelector("#miniBtn");
    const simpleBtn=card.querySelector("#simpleBtn");

    miniBtn.onclick=()=>{
      const on=mode!=="mini";
      mode=on?"mini":"normal";
      card.classList.toggle("mini",on);
      card.classList.remove("simple");
      miniBtn.classList.toggle("active",on);
    };

    simpleBtn.onclick=()=>{
      mode=mode==="simple"?"normal":"simple";
      card.classList.toggle("simple",mode==="simple");
      card.classList.remove("mini");
      miniBtn.classList.remove("active");
    };

    toggle("tTimer",v=>showTimer=v);
    toggle("tRate",v=>showRate=v);
    toggle("tETA",v=>showETA=v);
    toggle("tLog",v=>showLog=v);

    card.querySelector("#resetBtn").onclick = () => {
      totalGain = 0;
      startTime = Date.now();

      const expEl = document.querySelector(".exp[data-value]");
      if (expEl) lastExp = +expEl.dataset.value;

      card.querySelector("#gain").textContent = "0";
      card.querySelector("#sGain").textContent = "0";

      const logBox = card.querySelector("#daLog");
      if (logBox) logBox.innerHTML = "";
    };

    /* ===== DRAG PC + MOBILE ===== */
    let drag=false,ox=0,oy=0;
    const head=card.querySelector("#daExpHeader");

    const start=(x,y)=>{drag=true;ox=x-card.offsetLeft;oy=y-card.offsetTop};
    const move=(x,y)=>{if(drag){card.style.left=x-ox+"px";card.style.top=y-oy+"px"}};

    head.onmousedown=e=>start(e.clientX,e.clientY);
    document.onmousemove=e=>move(e.clientX,e.clientY);
    document.onmouseup=()=>drag=false;

    head.addEventListener("touchstart",e=>{
      const t=e.touches[0];start(t.clientX,t.clientY);
    });
    document.addEventListener("touchmove",e=>{
      if(!drag)return;
      const t=e.touches[0];move(t.clientX,t.clientY);
    },{passive:false});
    document.addEventListener("touchend",()=>drag=false);

    /* ===== MAIN LOOP ===== */
    setInterval(loop,POLL);

    function loop(){
      const el=document.querySelector(".exp[data-value]");
     
      if(!el)return;

      const cur=+el.dataset.value;

      if(lastExp!==null){
        // LEVEL UP DETECT (EXP RESET)
        if(cur < lastExp){
          totalGain = 0;
          startTime = Date.now();
          if(showLog) log("Level Up!");
        }
        // EXP GAIN NORMAL
        else if(cur > lastExp){
          const diff = cur - lastExp;
          totalGain += diff;
          if(showLog) log(`+${diff} EXP`);
        }
      }
      lastExp = cur;

      const need=maxExp?Math.max(0,maxExp-cur):0;
      const prog=maxExp?((cur/maxExp)*100).toFixed(1):"0";

      card.querySelector("#cur").textContent=cur;
      card.querySelector("#gain").textContent=totalGain;
      card.querySelector("#need").textContent=need;
      card.querySelector("#prog").textContent=prog+"%";

      card.querySelector("#sProg").textContent=prog+"%";
      card.querySelector("#sNeed").textContent=need;
      card.querySelector("#sGain").textContent=totalGain;

      // Calculate rate and ETA
      const min=(Date.now()-startTime)/60000;
      const rate=min?Math.floor(totalGain/min):0;

      // ETA Calculation
      let etaText = "--:--:--";
      let sEtaText = "--:--:--";
      
      if (showETA && maxExp > 0 && need > 0 && rate > 0) {
        const secondsRemaining = Math.floor((need / rate) * 60);
        if (secondsRemaining < 86400) { // Less than 24 hours (86400 seconds)
          etaText = formatSeconds(secondsRemaining);
          sEtaText = etaText;
        } else {
          etaText = '<span class="eta-infinite">∞</span>';
          sEtaText = "∞";
        }
      } else if (need === 0) {
        etaText = '<span class="eta-zero">READY</span>';
        sEtaText = "READY";
      }

      // Display rate
      card.querySelector("#rateRow").style.display=showRate?"flex":"none";
      card.querySelector("#rate").textContent=rate;

      // Display timer
      card.querySelector("#timeRow").style.display=showTimer?"flex":"none";
      card.querySelector("#time").textContent=format(Date.now()-startTime);

      // Display ETA
      card.querySelector("#etaRow").style.display=showETA?"flex":"none";
      card.querySelector("#eta").innerHTML=etaText;
      card.querySelector("#sETA").innerHTML=sEtaText;

      // Display log
      card.querySelector("#daLog").style.display=showLog?"block":"none";
    }

    function log(t){
      const l=card.querySelector("#daLog");
      const ts=new Date().toLocaleTimeString();
      l.innerHTML=`[${ts}] ${t}<br>`+l.innerHTML;
    }

    function toggle(id,cb){
      const b=card.querySelector("#"+id);
      b.onclick=()=>{
        b.classList.toggle("active");
        cb(b.classList.contains("active"));
      };
    }
  }

  function format(ms){
    let sec = Math.floor(ms / 1000);
    let h = Math.floor(sec / 3600);
    let m = Math.floor((sec % 3600) / 60);
    let s = sec % 60;

    return (
      String(h).padStart(2,"0") + ":" +
      String(m).padStart(2,"0") + ":" +
      String(s).padStart(2,"0")
    );
  }

  function formatSeconds(totalSeconds) {
    if (totalSeconds <= 0) return "00:00:00";
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return (
      String(hours).padStart(2,"0") + ":" +
      String(minutes).padStart(2,"0") + ":" +
      String(seconds).padStart(2,"0")
    );
  }

  waitGame();
})();