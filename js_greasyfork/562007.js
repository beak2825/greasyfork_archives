// ==UserScript==
// @name         Gems iPhone Bot
// @match        *://https://tronpick.io/gems.php*
// @grant        none
// ==/UserScript==

(function () {
  alert("✅ Gems Bot geladen");

  let running = false;
  let bet = 0.0001;

  function delay(ms){ return new Promise(r=>setTimeout(r,ms)); }

  async function loop(){
    while(running){
      const i=document.getElementById("bet_amount");
      if(i){
        i.value=bet.toFixed(8);
        i.dispatchEvent(new Event("input",{bubbles:true}));
      }

      document.querySelector("#start_game_gems")?.click();
      await delay(3000);

      document.querySelector("#ce00")?.click();
      await delay(3000);

      if(document.querySelector("#stop_game_gems")){
        document.querySelector("#stop_game_gems").click();
        bet=0.0001;
      }else{
        bet*=1.2;
      }

      await delay(2000);
    }
  }

  const b=document.createElement("button");
  b.textContent="▶ START BOT";
  b.style="position:fixed;bottom:20px;right:20px;z-index:99999;padding:14px;background:black;color:white";
  b.onclick=()=>{
    running=!running;
    b.textContent=running?"⏹ STOP BOT":"▶ START BOT";
    if(running) loop();
  };
  document.body.appendChild(b);
})();
