// ==UserScript==
// @name         Nitro Type auto typer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Lets you type anything and still types correctly on Nitro Type. Extended version with extra features.
// @author       King's group
// @license      MIT
// @match        https://www.nitrotype.com/race*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552185/Nitro%20Type%20auto%20typer.user.js
// @updateURL https://update.greasyfork.org/scripts/552185/Nitro%20Type%20auto%20typer.meta.js
// ==/UserScript==

(function(){
  const VERSION = "2025-09-18-HUMAN-FOREVER";

  try { if(window.NT_autotyper && window.NT_autotyper.stop) window.NT_autotyper.stop(); } catch(e){}

  let config = {
    wpmDayMin: 40, wpmDayMax: 50,
    wpmNightMin: 30, wpmNightMax: 40,
    accuracyPercent: 97,
    humanize: true,
    autoRaceLoop: true,
    maxElementScan: 1500,
    recoveryInterval: 500,
    pausePerRace: 5 + Math.floor(Math.random()*3), // 5–7 pauses per race
    pauseTimesDay: [200,700],
    pauseTimesNight: [400,1200],
    wpmVariation: 0.05,
    mouseSimulate: true,
    mouseMoveChance: 0.02
  };

  let t = null;
  let state = { running:true, timerId:null, recoveryId:null, pausesLeft:config.pausePerRace };

  function msPerChar(wpm){ return Math.max(5, Math.round(12000/wpm)); }
  function jitter(ms){ return Math.max(8, Math.round(ms*(0.8+Math.random()*0.4))); }
  function randomRange(min,max){ return Math.floor(Math.random()*(max-min+1)+min); }

  function findTypingNode(){
    try{
      let container = document.querySelector("div.dash-copyContainer");
      if(container){
        for(let v of Object.values(container)){
          if(v && v.children && v.children._owner && v.children._owner.stateNode) return v.children._owner.stateNode;
        }
      }
      let scanned=0;
      for(let el of document.querySelectorAll('body *')){
        scanned++; if(scanned>config.maxElementScan) break;
        for(let v of Object.values(el)){
          if(!v) continue;
          if(v.children && v.children._owner && v.children._owner.stateNode) return v.children._owner.stateNode;
          if(v._owner && v._owner.stateNode) return v._owner.stateNode;
          if(v._reactInternalFiber && v._reactInternalFiber.stateNode) return v._reactInternalFiber.stateNode;
          if(v.stateNode && v.props && v.props.lessonContent) return v.stateNode;
          if(v.props && v.props.lessonContent && typeof v.handleKeyPress==='function') return v;
        }
      }
    }catch(e){}
    return null;
  }

  function safeKeyPress(node,char){
    if(!node) return;
    try{ node.handleKeyPress("character", new KeyboardEvent("keypress",{key:char})); return; }catch(e){}
    try{ node.handleKeyPress("character",{key:char}); return; }catch(e){}
    try{ (document.activeElement||document.body).dispatchEvent(new KeyboardEvent("keydown",{key:char,bubbles:true,cancelable:true})); return; }catch(e){}
  }

  function clickPlayAgain(){
    try{
      let btn = document.querySelector("button.playAgainBtn, button.PlayAgainBtn, button.play-again, .play-again-button");
      if(btn){ btn.click(); return true; }
    }catch(e){}
    return false;
  }

  function getLessonContent(node){
    if(!node||!node.props) return [];
    if(Array.isArray(node.props.lessonContent)) return node.props.lessonContent;
    if(typeof node.props.lessonContent==="string") return node.props.lessonContent.split('');
    return [];
  }

  function getMode(){ let h = new Date().getHours(); return (h>=8 && h<22)?"day":"night"; }

  function simulateMouseMovement(){
    if(!config.mouseSimulate) return;
    let elements = Array.from(document.querySelectorAll('button, .play-again-button, input, .dash-copyContainer'));
    if(elements.length===0) return;
    let el = elements[randomRange(0,elements.length-1)];
    let rect = el.getBoundingClientRect();
    let x = rect.left + Math.random()*rect.width;
    let y = rect.top + Math.random()*rect.height;
    document.dispatchEvent(new MouseEvent("mousemove", {clientX:x, clientY:y,bubbles:true}));
  }

  function typedStep(){
    if(!state.running) return;

    if(!t || !t.props || !t.handleKeyPress){
      t = findTypingNode();
      if(!t){ state.timerId = setTimeout(typedStep, config.recoveryInterval); return; }
    }

    let mode = getMode();
    let idx = typeof t.typedIndex==='number'?t.typedIndex:(t.props && typeof t.props.typedIndex==='number'?t.props.typedIndex:0);
    let content = getLessonContent(t);

    if(!content || content.length===0 || idx >= content.length){
      if(config.autoRaceLoop){
        setTimeout(()=>{
          safeKeyPress(t,"\n");
          clickPlayAgain();
          t = findTypingNode();
          state.pausesLeft = 5 + Math.floor(Math.random()*3); // reset pauses for next race
          state.timerId = setTimeout(typedStep, jitter(msPerChar(randomRange(mode==="night"?config.wpmNightMin:config.wpmDayMin,mode==="night"?config.wpmNightMax:config.wpmDayMax))));
        }, randomRange(500,2000));
      }
      return;
    }

    // Human-like pauses
    if(state.pausesLeft > 0 && Math.random() < 0.02){
      let pauseRange = mode==="night"?config.pauseTimesNight:config.pauseTimesDay;
      let pause = randomRange(pauseRange[0],pauseRange[1]);
      state.pausesLeft--;
      state.timerId = setTimeout(typedStep, pause);
      return;
    }

    if(config.mouseSimulate && Math.random() < config.mouseMoveChance){
      simulateMouseMovement();
    }

    let correctChar = content[idx];
    let isCorrect = Math.random()*100 < config.accuracyPercent;
    let charWpm = mode==="night"?randomRange(config.wpmNightMin,config.wpmNightMax):randomRange(config.wpmDayMin,config.wpmDayMax);
    let charDelay = msPerChar(charWpm)*(1 + (Math.random()*2-1)*config.wpmVariation);

    if(!isCorrect){
      safeKeyPress(t,"$");
      setTimeout(()=>{ safeKeyPress(t,"\b"); setTimeout(()=>{ safeKeyPress(t,correctChar); }, jitter(50)); }, jitter(50));
    } else { safeKeyPress(t,correctChar); }

    state.timerId = setTimeout(typedStep, jitter(charDelay));
  }

  // Recovery loop
  state.recoveryId = setInterval(()=>{
    if(!state.running) return;
    if(!t || !t.props || !t.handleKeyPress) t = findTypingNode();
  }, config.recoveryInterval);

  // Auto restart after "Play Again" / Enter
  document.addEventListener("click", (e)=>{
    if(e.target && (e.target.matches(".play-again-button, button.playAgainBtn, button.play-again"))){
      setTimeout(()=>{ t = findTypingNode(); typedStep(); }, 800);
    }
  });
  document.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
      setTimeout(()=>{ t = findTypingNode(); typedStep(); },800);
    }
  });

  // Kickstart
  let initialWpm = getMode()==="night"?randomRange(config.wpmNightMin,config.wpmNightMax):randomRange(config.wpmDayMin,config.wpmDayMax);
  state.timerId = setTimeout(typedStep, jitter(msPerChar(initialWpm)));

  window.NT_autotyper = {
    stop:function(){ state.running=false; clearTimeout(state.timerId); clearInterval(state.recoveryId); console.log("NT_autotyper stopped"); },
    start:function(){
      if(!state.running){
        state.running=true;
        state.timerId = setTimeout(typedStep,jitter(msPerChar(initialWpm)));
        console.log("NT_autotyper started");
      }
    }
  };

  console.log("NT_autotyper HUMAN-FOREVER injected — stays active, auto restarts each race, 5–7 pauses, human rhythm.");
})();

