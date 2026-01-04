// ==UserScript==
// @name         Comic-Walker Manga Downloader
// @namespace    julisx.comicwalker.downloader
// @version      2.2.1
// @description  Comic-Walker downloader with draggable dark UI, format cards, safe range, battery-style progress bar
// @author       JulisX
// @license      MIT
// @icon         https://cdn.comic-walker.com/_next/static/media/AppLogo.f4f6096f.svg
// @match        http*://comic-walker.com/detail/*
// @require      https://cdn.jsdelivr.net/npm/@zip.js/zip.js@2.7.34/dist/zip.min.js
// @downloadURL https://update.greasyfork.org/scripts/557576/Comic-Walker%20Manga%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/557576/Comic-Walker%20Manga%20Downloader.meta.js
// ==/UserScript==

(() => {
"use strict";

/* ================= STYLE ================= */

const style = document.createElement("style");
style.textContent = `
.cw-btn{
  background:#4B6EF6;color:#fff;border:none;
  padding:4px 10px;border-radius:6px;
  font-size:12px;font-weight:700;cursor:pointer;
}

/* popup */
.cw-popup{
  position:fixed;
  left:50%;top:50%;
  transform:translate(-50%,-50%);
  background:#1e1f26;color:#eaeaf0;
  width:360px;border-radius:16px;
  box-shadow:0 24px 60px rgba(0,0,0,.7);
  z-index:99999;font-family:system-ui;
}
.cw-header{
  padding:12px 16px;
  font-weight:700;
  cursor:move;
  background:#262833;
  border-bottom:1px solid #333;
  border-radius:16px 16px 0 0;
  display:flex;
  justify-content:space-between;
  align-items:center;
}
.cw-close{cursor:pointer;font-size:18px;color:#aaa}
.cw-close:hover{color:#fff}
.cw-body{padding:16px}
.cw-muted{color:#a0a4c0;font-size:12px}

/* cards */
.cw-section{margin-top:16px}
.cw-cards{display:flex;gap:12px;margin-top:8px}
.cw-card{
  flex:1;border:2px solid #333;border-radius:12px;
  padding:12px 10px;text-align:center;
  cursor:pointer;background:#20222c;
}
.cw-card:hover{border-color:#4B6EF6}
.cw-card.active{border-color:#4B6EF6;background:#2a2f45}
.cw-card-title{font-weight:800;font-size:14px}

/* range */
.cw-range input{
  width:72px;padding:5px 7px;border-radius:6px;
  border:1px solid #444;background:#2a2c38;color:#fff;
}
.cw-error{
  color:#ff6b6b;font-size:12px;
  font-weight:700;margin-top:6px;
}

/* download */
.cw-download{
  margin-top:18px;width:100%;
  background:#4CAF50;color:#fff;border:none;
  padding:11px;border-radius:12px;
  font-weight:800;font-size:14px;cursor:pointer;
}
.cw-download:hover{background:#43a047}

/* ===== battery progress ===== */
.cw-battery{
  position:fixed;
  right:20px;bottom:20px;
  width:280px;
  background:#1e1f26;
  border-radius:14px;
  box-shadow:0 12px 30px rgba(0,0,0,.6);
  padding:10px 12px;
  color:#fff;
  z-index:99999;
}
.cw-battery-text{
  font-size:13px;font-weight:700;
  margin-bottom:6px;
  display:flex;justify-content:space-between;
}
.cw-battery-bar{
  height:8px;background:#333;
  border-radius:999px;overflow:hidden;
}
.cw-battery-fill{
  height:100%;width:0%;
  background:#4B6EF6;
  transition:width .15s linear, background-color .2s linear;
}
`;
document.head.appendChild(style);

/* ================= BATTERY PROGRESS ================= */

function showBattery(total){
  removeBattery();
  const el=document.createElement("div");
  el.className="cw-battery";
  el.innerHTML=`
    <div class="cw-battery-text">
      <span>Downloading…</span>
      <span id="cw-battery-count">0 / ${total}</span>
    </div>
    <div class="cw-battery-bar">
      <div class="cw-battery-fill" id="cw-battery-fill"></div>
    </div>`;
  document.body.appendChild(el);
}

function updateBattery(done,total){
  const percent=Math.round(done/total*100);
  const fill=document.getElementById("cw-battery-fill");
  const text=document.getElementById("cw-battery-count");
  if(!fill||!text)return;

  fill.style.width=percent+"%";
  text.textContent=`${done} / ${total}`;

  if(percent<30) fill.style.background="#e55353";
  else if(percent<60) fill.style.background="#f6c344";
  else if(percent<90) fill.style.background="#4B6EF6";
  else fill.style.background="#4CAF50";
}

function removeBattery(){
  document.querySelector(".cw-battery")?.remove();
}

/* ================= BUTTON IN LIST ================= */

function injectButtons(){
  document.querySelectorAll("[class^=EpisodeThumbnail_episodeThumbnail]").forEach(card=>{
    if(card.querySelector(".cw-btn"))return;
    if(!card.href)return;

    const titleEl=card.querySelector("[class^=EpisodeThumbnail_title_]");
    const name=titleEl.textContent.trim();
    const episodeCode=new URL(card.href).pathname.split("/").pop();

    const btn=document.createElement("button");
    btn.textContent="Download";
    btn.className="cw-btn";
    btn.onclick=e=>{
      e.preventDefault();
      e.stopPropagation();
      openPopup(name,episodeCode);
    };

    titleEl.appendChild(btn);
  });
}

/* ================= POPUP ================= */

async function openPopup(name,episodeCode){
  document.querySelector(".cw-popup")?.remove();

  const pages=await getImageSData(episodeCode);
  const total=pages.length;
  let format="jpg";

  const popup=document.createElement("div");
  popup.className="cw-popup";
  popup.innerHTML=`
    <div class="cw-header">
      Comic-Walker Downloader
      <span class="cw-close">✕</span>
    </div>
    <div class="cw-body">
      <div style="font-weight:700">${name}</div>
      <div class="cw-muted">Total pages: ${total}</div>

      <div class="cw-section">
        <div style="font-weight:700">Select image format</div>
        <div class="cw-cards">
          <div class="cw-card active" data-fmt="jpg">
            <div class="cw-card-title">JPG</div>
            <div class="cw-muted">Lossy • Smaller</div>
          </div>
          <div class="cw-card" data-fmt="png">
            <div class="cw-card-title">PNG</div>
            <div class="cw-muted">Lossless • Large</div>
          </div>
        </div>
      </div>

      <div class="cw-section cw-range">
        <div style="font-weight:700">Image range</div>
        <input id="from" type="number" min="1" max="${total}" placeholder="From">
        →
        <input id="to" type="number" min="1" max="${total}" placeholder="To">
        <div id="counter" class="cw-muted">Full chapter</div>
        <div id="err" class="cw-error" style="display:none"></div>
      </div>

      <button class="cw-download">Download</button>
    </div>`;
  document.body.appendChild(popup);

  /* ===== draggable popup ===== */
  const header=popup.querySelector(".cw-header");
  let dragging=false, ox=0, oy=0;

  header.addEventListener("mousedown",e=>{
    dragging=true;
    ox=e.clientX-popup.offsetLeft;
    oy=e.clientY-popup.offsetTop;
    document.body.style.userSelect="none";
  });
  document.addEventListener("mousemove",e=>{
    if(!dragging)return;
    popup.style.left=e.clientX-ox+"px";
    popup.style.top=e.clientY-oy+"px";
    popup.style.transform="none";
  });
  document.addEventListener("mouseup",()=>{
    dragging=false;
    document.body.style.userSelect="";
  });

  popup.querySelector(".cw-close").onclick=()=>popup.remove();

  popup.querySelectorAll(".cw-card").forEach(c=>{
    c.onclick=()=>{
      popup.querySelectorAll(".cw-card").forEach(x=>x.classList.remove("active"));
      c.classList.add("active");
      format=c.dataset.fmt;
    };
  });

  const fromI=popup.querySelector("#from");
  const toI=popup.querySelector("#to");
  const counter=popup.querySelector("#counter");
  const err=popup.querySelector("#err");

  function update(){
    err.style.display="none";
    let f=+fromI.value,t=+toI.value;
    if(f>total){f=total;fromI.value=total}
    if(t>total){t=total;toI.value=total}
    if(!fromI.value&&!toI.value){
      counter.textContent="Full chapter";
      return;
    }
    if(!f||!t||f>t)return;
    counter.textContent=`Selected ${t-f+1} / ${total}`;
  }
  fromI.oninput=update;
  toI.oninput=update;

  popup.querySelector(".cw-download").onclick=()=>{
    const f=+fromI.value||1;
    const t=+toI.value||total;
    if((fromI.value&&!toI.value)||(!fromI.value&&toI.value))
      return showErr("Both From and To required",err);
    if(f<1||t>total||f>t)
      return showErr(`Range must be 1–${total}`,err);

    popup.remove();
    startDownload(name,pages,f,t,format);
  };
}

function showErr(msg,el){
  el.textContent=msg;
  el.style.display="block";
}

/* ================= DOWNLOAD ================= */

async function startDownload(name,pages,from,to,format){
  pages=pages.slice(from-1,to);
  const total=pages.length;
  showBattery(total);

  let done=0;

  if(total===1){
    const img=await downloadSingleImage(format)(pages[0]);
    updateBattery(1,1);
    setTimeout(()=>{
      save(img.content,`${name}_${from}.${format}`);
      removeBattery();
    },300);
    return;
  }

  const zw=new zip.ZipWriter(new zip.BlobWriter("application/zip"));

  for(const p of pages){
    const img=await downloadSingleImage(format)(p);
    done++;
    updateBattery(done,total);
    await zw.add(
      `${String(p.id).padStart(String(total).length,"0")}.${format}`,
      new zip.BlobReader(img.content)
    );
  }

  save(await zw.close(),`${name}_${from}-${to}.zip`);
  setTimeout(removeBattery,300);
}

/* ================= API ================= */

async function getImageSData(episodeCode){
  const id=await fetch(
    `https://comic-walker.com/api/contents/details/episode?episodeCode=${episodeCode}&workCode=0&episodeType=first`
  ).then(r=>r.json()).then(j=>j.episode.id);

  return fetch(
    `https://comic-walker.com/api/contents/viewer?episodeId=${id}&imageSizeType=width%3A1284`
  ).then(r=>r.json()).then(j=>
    j.manuscripts.map((m,i)=>({
      id:i+1,
      drmMode:m.drmMode,
      drmHash:m.drmHash,
      url:m.drmImageUrl
    }))
  );
}

function downloadSingleImage(format){
  return async item=>{
    const res=await fetch(item.url);
    let blob;
    if(item.drmMode==="raw") blob=await res.blob();
    else{
      const enc=new Uint8Array(await res.arrayBuffer());
      blob=new Blob([xor(enc,generateKey(item.drmHash))],{type:"image/webp"});
    }
    return {id:item.id,content:await convertImage(blob,format)};
  };
}

async function convertImage(webp,format){
  return new Promise(res=>{
    const img=new Image();
    img.onload=()=>{
      const c=document.createElement("canvas");
      c.width=img.width;c.height=img.height;
      c.getContext("2d").drawImage(img,0,0);
      c.toBlob(res,format==="png"?"image/png":"image/jpeg",1);
    };
    img.src=URL.createObjectURL(webp);
  });
}

function generateKey(h){
  const e=h.slice(0,16).match(/[\da-f]{2}/gi);
  return new Uint8Array(e.map(x=>parseInt(x,16)));
}
function xor(d,k){return d.map((b,i)=>b^k[i%k.length]);}

function save(blob,name){
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=name;
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ================= OBSERVE ================= */

new MutationObserver(injectButtons).observe(document.body,{childList:true,subtree:true});
injectButtons();

})();