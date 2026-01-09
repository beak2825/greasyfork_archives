// ==UserScript==
// @name         Torn Territory Wall Helper 
// @namespace    https://torn.com/
// @version      01.09.2026.11.00
// @description  Territory wall helper. 14 total spots. Shows current hold, max-attack outcome, seats needed to win or hold. Cream UI. No bold.
// @author       KillerCleat [2842410]
// @match        https://www.torn.com/factions.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561996/Torn%20Territory%20Wall%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/561996/Torn%20Territory%20Wall%20Helper.meta.js
// ==/UserScript==



const MY_FACTION_ID = 0;   // change if you change factions
const TOTAL_SPOTS = 14;

(function () {
  'use strict';

  /* ---------- helpers ---------- */
  const $ = s => document.querySelector(s);

  function num(v){ return Number(String(v).replace(/[^\d]/g,'')); }
  function fmt(n){ return Math.round(n).toLocaleString(); }

  function secondsFromText(t){
    if(!t) return null;
    const d = /(\d+)\s*days?/.exec(t)?.[1] ?? 0;
    const h = /(\d+)\s*hours?/.exec(t)?.[1] ?? 0;
    const m = /(\d+)\s*minutes?/.exec(t)?.[1] ?? 0;
    const s = /(\d+)\s*seconds?/.exec(t)?.[1] ?? 0;
    return d*86400 + h*3600 + m*60 + +s;
  }

  function ddhhmmss(sec){
    sec = Math.max(0, Math.floor(sec));
    const d = Math.floor(sec/86400); sec%=86400;
    const h = Math.floor(sec/3600);  sec%=3600;
    const m = Math.floor(sec/60);
    const s = sec%60;
    return `${String(d).padStart(2,'0')}:${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  function isWar(){
    return location.hash.startsWith('#/war/');
  }

  /* ---------- style ---------- */
  if(!$('#kc-wall-style')){
    const st = document.createElement('style');
    st.id = 'kc-wall-style';
    st.textContent = `
#kc-wall-box{
  margin-top:8px;
  padding:10px 12px;
  background:#f3efe4;
  border:1px solid #d8d3c7;
  border-radius:6px;
  font-size:13.5px;
  line-height:1.5;
  color:#111;
  pointer-events:none;
}
#kc-wall-box .row{margin:3px 0;}
#kc-wall-box .section{margin-top:8px;padding-top:8px;border-top:1px solid #d8d3c7;}
#kc-wall-box .safe{color:#1b5e20;}
#kc-wall-box .danger{color:#b71c1c;}
`;
    document.head.appendChild(st);
  }

  /* ---------- main render ---------- */
  function render(){
    if(!isWar()){
      $('#kc-wall-box')?.remove();
      return;
    }

    const header = $('.faction-war-info');
    if(!header) return;

    let box = $('#kc-wall-box');
    if(!box){
      box = document.createElement('div');
      box.id = 'kc-wall-box';
      header.after(box);
    }

    const atk = num($('.enemy-count')?.innerText);
    const def = num($('.your-count')?.innerText);
    const empty = Math.max(0, TOTAL_SPOTS - atk - def);

    const scoreTxt = $('.score')?.innerText;
    const [cur, tgt] = scoreTxt?.split('/')?.map(num) ?? [];
    const left = tgt - cur;

    const timerTxt = $('.faction-war-info')?.innerText;
    const secsLeft = secondsFromText(timerTxt);

    if(!atk && atk!==0 || !def && def!==0 || !secsLeft){
      box.innerHTML = `<div class="row">Waiting for war data…</div>`;
      return;
    }

    const rate = atk - def;
    const needRate = Math.ceil(left / secsLeft);

    const yourFactionSafe = rate < needRate;

    /* ---- calculations ---- */
    const maxAtkWinTime = left / TOTAL_SPOTS;

    const seatsNeededToWin = rate >= needRate ? 0 :
      Math.ceil((needRate - rate + 1) / 2);

    const seatsNeededToHold = rate < needRate ? 0 :
      Math.ceil((rate - needRate + 1) / 2);

    box.innerHTML = `
<div class="row">SEATS: ATTACKERS ${atk} | DEFENDERS ${def} | EMPTY ${empty} (TOTAL 14)</div>
<div class="row">SCORE: ${fmt(cur)} / ${fmt(tgt)}</div>
<div class="row">TIMER: ${ddhhmmss(secsLeft)}</div>
<div class="row ${yourFactionSafe ? 'safe':'danger'}">
  YOUR FACTION: ${yourFactionSafe ? 'SAFE':'IN DANGER'}
</div>

<div class="section">
  <div class="row">
    CURRENT PACE: ${rate >= needRate ? 
      `ATTACKERS WIN IN ${ddhhmmss(left / rate)}` :
      `DEFENDERS HOLD`}
  </div>
</div>

<div class="section">
  <div class="row">
    IF ATTACKERS TAKE ALL 14: ${maxAtkWinTime <= secsLeft ?
      `WIN IN ${ddhhmmss(maxAtkWinTime)}` :
      `NOT POSSIBLE`}
  </div>
  <div class="row">
    TO WIN: ${seatsNeededToWin === 0 ?
      'ATTACKERS ALREADY HAVE ENOUGH SEATS' :
      `ATTACKERS MUST GAIN ${seatsNeededToWin} SEATS`}
  </div>
  <div class="row">
    TO HOLD: ${seatsNeededToHold === 0 ?
      'DEFENDERS ALREADY HOLD' :
      `DEFENDERS MUST GAIN ${seatsNeededToHold} SEATS`}
  </div>
</div>`;
  }

  render();
  setInterval(render, 2000);
  window.addEventListener('hashchange', render);
})();
