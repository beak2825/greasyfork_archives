// ==UserScript==
// @name        DuoFarmer 499xp lite
// @namespace   https://ob-buff.dev/
// @version     1.3-lite
// @match       https://*.duolingo.com/*
// @grant       none
// @description 499 XP every 100ms (English learning only)
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/557052/DuoFarmer%20499xp%20lite.user.js
// @updateURL https://update.greasyfork.org/scripts/557052/DuoFarmer%20499xp%20lite.meta.js
// ==/UserScript==

(() => {
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  const decode = (b64) =>
    decodeURIComponent(
      atob(b64.replace(/-/g, "+").replace(/_/g, "/"))
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  const getJwt = () => {
    const found = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("jwt_token="));
    return found ? found.slice("jwt_token=".length) : null;
  };

  const ui = (() => {
    const wrap = document.createElement("div");
    wrap.innerHTML = `
<style>
#df-box{
  position:fixed;bottom:14px;right:14px;min-width:240px;
  padding:18px 20px;border-radius:18px;
  background:rgba(10,20,20,.55);
  border:1px solid #32ff9c77;
  backdrop-filter:blur(12px) saturate(220%);
  box-shadow:0 0 25px #32ff9c55, 0 0 60px #000d inset;
  font:13px/1.5 'Segoe UI',sans-serif;
  color:#d9ffe8;z-index:999999;
}
#df-title{
  font-size:15px;font-weight:900;
  color:#b5ffd7;letter-spacing:1px;
  text-shadow:0 0 6px #32ff9c99;
  margin-bottom:10px;
}
#df-badge{
  display:inline-block;padding:3px 8px;margin-left:6px;
  font-size:10px;font-weight:700;
  background:#32ff9c22;border:1px solid #32ff9c88;
  border-radius:8px;color:#32ff9c;
  box-shadow:0 0 8px #32ff9c55 inset;
}
#df-status, #df-http, #df-gain{
  margin:6px 0;color:#b8ffcf;font-weight:600;
}
#df-warn{
  margin-top:6px;padding:8px 12px;border-radius:10px;
  background:#ff444422;border:1px solid #ff7777aa;
  color:#ffdede;font-weight:700;text-align:center;
  box-shadow:0 0 10px #ff555544 inset;
}
#df-btn{
  margin-top:14px;width:100%;padding:10px 0;
  border-radius:12px;border:1px solid #32ff9c88;
  background:#0f2620;color:#32ff9c;font-weight:900;
  letter-spacing:1px;cursor:pointer;
  box-shadow:0 6px 18px #32ff9c44;
  transition:all .15s ease;
}
#df-btn:hover{ background:#163c30; }
#df-btn:active{ transform:translateY(1px); }
#df-btn:disabled{ opacity:.45;cursor:not-allowed;box-shadow:none; }
#df-foot{
  margin-top:10px;font-size:10px;color:#8affb6;
  text-align:right;font-weight:700;letter-spacing:.4px;
}
</style>

<div id="df-box">
  <div id="df-title">DuoFarmer <span id="df-badge">MADE BY OB_BUFF</span></div>
  <div id="df-warn">Learning language must be English</div>
  <div id="df-status">Ready…</div>
  <div id="df-http">HTTP ok/fail: 0/0</div>
  <div id="df-gain">Total XP: 0</div>
  <button id="df-btn">Start</button>
  <div id="df-foot">MY WEBSITE: OB-BUFF.DEV</div>
</div>
`;
    document.body.appendChild(wrap);
    return {
      status: wrap.querySelector("#df-status"),
      gain: wrap.querySelector("#df-gain"),
      http: wrap.querySelector("#df-http"),
      btn: wrap.querySelector("#df-btn"),
      setStatus(t) { this.status.textContent = t; },
      setGain(v) { this.gain.textContent = `Total XP: ${v}`; },
      setHttp(a,b) { this.http.textContent = `HTTP ok/fail: ${a}/${b}`; },
      setRunning(r) { this.btn.textContent = r ? "Stop" : "Start"; },
      onToggle(fn){ this.btn.addEventListener("click",fn); },
      disable(msg){ this.btn.disabled=true; this.status.textContent=msg; }
    };
  })();

  let running=false, stopFlag=false, gained=0, ok=0, fail=0;

  const farmLoop = async () => {
    const jwt=getJwt();
    if(!jwt) return ui.disable("JWT missing, please login");

    const headers={
      "Content-Type":"application/json",
      Authorization:`Bearer ${jwt}`,
      "User-Agent":navigator.userAgent,
    };

    const sub=JSON.parse(decode(jwt.split(".")[1]||"")).sub;
    const userInfo=await fetch(
      `https://www.duolingo.com/2017-06-30/users/${sub}?fields=fromLanguage,learningLanguage`,
      {headers}
    ).then(r=>r.json());

    const from=userInfo.fromLanguage;
    const learn=userInfo.learningLanguage;

    if(learn!=="en") return ui.disable("Set learning language to English");

    const storyId=`en-${from}-the-passport`;
    const url=`https://stories.duolingo.com/api2/stories/${storyId}/complete`;

    ui.setStatus(`Using: ${from} → ${learn}`);

    while(!stopFlag){
      const start=Math.floor(Date.now()/1000);
      const payload={
        awardXp:true,
        completedBonusChallenge:true,
        mode:"READ",
        isLegendaryMode:true,
        fromLanguage:from,
        learningLanguage:learn,
        startTime:start,
        hasXpBoost:false,
        happyHourBonusXp:449
      };

      try{
        const res=await fetch(url,{
          method:"POST",
          headers,
          body:JSON.stringify(payload)
        });

        res.ok?ok++:fail++;
        const data=await res.json().catch(()=>({}));
        gained+=data.awardedXp||data.xpGain||0;

        ui.setGain(gained);
        ui.setHttp(ok,fail);
      }catch(e){
        fail++;
        ui.setHttp(ok,fail);
        ui.setStatus("Request error, retrying…");
      }

      await delay(100);
    }

    ui.setStatus("Stopped");
  };

  const start=()=>{
    if(running) return;
    stopFlag=false;
    running=true;
    ui.setRunning(true);
    ui.setStatus("Running…");
    farmLoop().finally(()=>{
      running=false;
      ui.setRunning(false);
    });
  };

  const stop=()=>{ stopFlag=true; };

  ui.onToggle(()=> running?stop():start());
  window.addEventListener("beforeunload", stop);
})();
