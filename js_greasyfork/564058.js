// ==UserScript==
// @name         Mini board with engine (use for chess.com)
// @namespace    chess-mini-wood
// @version      2.0.0
// @description  Mini board with engine, flip, promotions, and full chess move support
// @match        https://www.chess.com/*
// @grant        none
// @license      CC BY-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/564058/Mini%20board%20with%20engine%20%28use%20for%20chesscom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564058/Mini%20board%20with%20engine%20%28use%20for%20chesscom%29.meta.js
// ==/UserScript==

(() => {

/* ================= CONSTANTS ================= */

const PIECES = {
  wp:"♙", wn:"♘", wb:"♗", wr:"♖", wq:"♕", wk:"♔",
  bp:"♟", bn:"♞", bb:"♝", br:"♜", bq:"♛", bk:"♚"
};

const PROMO_MAP = { q:"Queen", r:"Rook", b:"Bishop", n:"Knight" };

const LIGHT="#f0d9b5";
const DARK="#b58863";
const SIZE=200;
const SQ=SIZE/8;

/* ================= STATE ================= */

let lastBoard={};
let arrow=null;
let retryCount=0;
let isFlipped=false;

/* ================= UI ================= */

const ui=document.createElement("div");
ui.style.cssText=`
  position:fixed;top:80px;right:20px;
  background:#1b1b1b;border-radius:8px;
  z-index:999999;box-shadow:0 0 12px #000;
  user-select:none;font-family:Arial;
  color:white;padding:6px;width:220px;
`;

ui.innerHTML=`
  <div id="dragBar" style="cursor:move;text-align:center;background:#111;padding:6px;border-radius:6px;">
    ♟ Mini Board
  </div>

  <button id="flipBtn" style="width:100%;margin:6px 0;padding:6px;background:#444;color:#fff;border:none;border-radius:6px;">
    🔄 Flip Board
  </button>

  <canvas id="boardCanvas"></canvas>

  <button id="engineBtn" disabled style="width:100%;margin-top:6px;padding:6px;background:#333;color:#aaa;border:none;border-radius:6px;">
    🔒 Engine
  </button>

  <div id="engineOut" style="margin-top:6px;font-size:12px;line-height:1.4;"></div>
`;

document.body.appendChild(ui);

const canvas=ui.querySelector("#boardCanvas");
const ctx=canvas.getContext("2d");
canvas.width=canvas.height=SIZE;

const engineBtn=ui.querySelector("#engineBtn");
const engineOut=ui.querySelector("#engineOut");
const flipBtn=ui.querySelector("#flipBtn");

/* ================= DRAG ================= */

let drag=false,dx=0,dy=0;
ui.querySelector("#dragBar").onmousedown=e=>{
  drag=true;dx=e.clientX-ui.offsetLeft;dy=e.clientY-ui.offsetTop;
};
document.onmouseup=()=>drag=false;
document.onmousemove=e=>{
  if(!drag)return;
  ui.style.left=(e.clientX-dx)+"px";
  ui.style.top=(e.clientY-dy)+"px";
  ui.style.right="auto";
};

/* ================= FLIP ================= */

flipBtn.onclick=()=>{
  isFlipped=!isFlipped;
  drawBoard(lastBoard);
};

/* ================= DRAW BOARD ================= */

function drawBoard(pieces){
  lastBoard=pieces;
  ctx.clearRect(0,0,SIZE,SIZE);

  for(let r=0;r<8;r++){
    for(let f=0;f<8;f++){
      const dr=isFlipped?7-r:r;
      const df=isFlipped?7-f:f;

      ctx.fillStyle=(r+f)%2===0?LIGHT:DARK;
      ctx.fillRect(df*SQ,dr*SQ,SQ,SQ);

      const key=`${f+1}${8-r}`;
      if(!pieces[key])continue;

      ctx.font=`${SQ*0.8}px serif`;
      ctx.textAlign="center";
      ctx.textBaseline="middle";
      ctx.fillStyle="#000";
      ctx.fillText(PIECES[pieces[key]],df*SQ+SQ/2,dr*SQ+SQ/2+2);
    }
  }

  if(arrow) drawArrow(arrow);
}

/* ================= BETTER ARROW ================= */

function drawArrow(a){
  ctx.strokeStyle="rgba(255,0,0,0.85)";
  ctx.lineWidth=1.6;
  ctx.lineCap="round";

  ctx.beginPath();
  ctx.moveTo(a.fx,a.fy);
  ctx.lineTo(a.tx,a.ty);
  ctx.stroke();

  const ang=Math.atan2(a.ty-a.fy,a.tx-a.fx);
  const h=7;

  ctx.beginPath();
  ctx.moveTo(a.tx,a.ty);
  ctx.lineTo(a.tx-h*Math.cos(ang-Math.PI/7),a.ty-h*Math.sin(ang-Math.PI/7));
  ctx.lineTo(a.tx-h*Math.cos(ang+Math.PI/7),a.ty-h*Math.sin(ang+Math.PI/7));
  ctx.fillStyle="rgba(255,0,0,0.85)";
  ctx.fill();
}

/* ================= SQUARE → CANVAS ================= */

function squareToCoord(sq){
  const f=sq.charCodeAt(0)-97;
  const r=8-parseInt(sq[1]);
  const df=isFlipped?7-f:f;
  const dr=isFlipped?7-r:r;
  return {x:df*SQ+SQ/2,y:dr*SQ+SQ/2};
}

/* ================= SCAN BOARD ================= */

function scanBoard(){
  const map={};
  document.querySelectorAll(".piece").forEach(el=>{
    const cls=[...el.classList];
    const piece=cls.find(c=>PIECES[c]);
    const sq=cls.find(c=>c.startsWith("square-"));
    if(!piece||!sq)return;
    const n=sq.replace("square-","");
    map[`${n[0]}${n[1]}`]=piece;
  });
  drawBoard(map);
}

/* ================= FEN ================= */

function buildFEN(){
  let fen="";
  for(let r=8;r>=1;r--){
    let e=0;
    for(let f=1;f<=8;f++){
      const p=lastBoard[`${f}${r}`];
      if(!p)e++;
      else{
        if(e){fen+=e;e=0;}
        fen+=p[0]==="w"?p[1].toUpperCase():p[1];
      }
    }
    if(e)fen+=e;
    if(r>1)fen+="/";
  }
  return fen+(isFlipped?" b - - 0 1":" w - - 0 1");
}

/* ================= ENGINE (PROMOTIONS SAFE) ================= */

engineBtn.onclick=async()=>{
  engineOut.textContent="Analyzing best moves…";
  const fen=buildFEN();

  try{
    const res=await fetch("https://chess-api.com/v1",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({fen})
    });

    const data=await res.json();
    if(!data?.move){
      engineOut.textContent="No analysis available.";
      return;
    }

    const move=data.move;
    const from=move.slice(0,2);
    const to=move.slice(2,4);
    const promo=move[4];

    const a=squareToCoord(from);
    const b=squareToCoord(to);
    arrow=a&&b?{fx:a.x,fy:a.y,tx:b.x,ty:b.y}:null;

    engineOut.innerHTML=`
      <b>Best move:</b> ${from} → ${to}${promo ? " = "+PROMO_MAP[promo] : ""}<br>
      <b>Eval:</b> ${data.eval}<br>
      <b>Info:</b> ${data.text}
    `;

    clearTimeout(window.bestMoveTimeout);
    window.bestMoveTimeout=setTimeout(()=>{
      arrow=null;
      engineOut.textContent="";
      drawBoard(lastBoard);
    },5000);

  }catch{
    engineOut.textContent="Engine error.";
  }
};

/* ================= LOOP ================= */

setInterval(()=>{
  scanBoard();
  engineBtn.disabled=false;
  engineBtn.textContent="🧠 Analyze Position";
  engineBtn.style.background="#2a7";
  engineBtn.style.color="#fff";
},300);

})();
