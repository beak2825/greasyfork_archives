// ==UserScript==
// @name         Comic-Trail Manga Downloader
// @namespace    julisx.comictrail.downloader
// @version      3.3.1
// @description  Comic-Trail downloader with draggable dark UI, format cards, safe range, battery-style progress bar
// @author       JulisX
// @license      GPL-3.0
// @icon         https://cdn.comic-trail.com/images/apple-touch-icon.png
// @match        https://comic-trail.com/*
// @match        https://comic-days.com/*/*
// @match        https://shonenjumpplus.com/*/*
// @match        https://kuragebunch.com/*/*
// @match        https://www.sunday-webry.com/*/*
// @match        https://comicbushi-web.com/*/*
// @match        https://tonarinoyj.jp/*/*
// @match        https://comic-gardo.com/*/*
// @match        https://comic-zenon.com/*/*
// @match        https://comic-action.com/*/*
// @match        https://magcomi.com/*/*
// @match        https://viewer.heros-web.com/*/*
// @match        https://feelweb.jp/*/*
// @match        https://comicborder.com/*/*
// @match        https://comic-ogyaaa.com/*/*
// @match        https://comic-earthstar.com/*/*
// @match        https://comic-seasons.com/*/*
// @match        https://ichicomi.com/*/*
// @require      https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/@zip.js/zip.js@2.7.34/dist/zip.min.js
// @downloadURL https://update.greasyfork.org/scripts/557817/Comic-Trail%20Manga%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/557817/Comic-Trail%20Manga%20Downloader.meta.js
// ==/UserScript==

(() => {
"use strict";

/* ================= STYLE ================= */

const style = document.createElement("style");
style.textContent = `
.ct-btn{
  background:#4B6EF6;color:#fff;border:none;
  padding:6px 14px;border-radius:8px;
  font-size:13px;font-weight:700;cursor:pointer;
}

/* popup */
.ct-popup{
  position:fixed;
  left:50%;top:50%;
  transform:translate(-50%,-50%);
  background:#1e1f26;color:#eaeaf0;
  width:360px;border-radius:16px;
  box-shadow:0 24px 60px rgba(0,0,0,.7);
  z-index:99999;
  font-family:system-ui;
}
.ct-header{
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
.ct-close{cursor:pointer;font-size:18px;color:#aaa}
.ct-close:hover{color:#fff}
.ct-body{padding:16px}
.ct-muted{color:#a0a4c0;font-size:12px}

/* cards */
.ct-section{margin-top:16px}
.ct-cards{display:flex;gap:12px;margin-top:8px}
.ct-card{
  flex:1;border:2px solid #333;border-radius:12px;
  padding:12px 10px;text-align:center;
  cursor:pointer;background:#20222c;
}
.ct-card:hover{border-color:#4B6EF6}
.ct-card.active{border-color:#4B6EF6;background:#2a2f45}
.ct-card-title{font-weight:800;font-size:14px}

/* range */
.ct-range input{
  width:72px;padding:5px 7px;border-radius:6px;
  border:1px solid #444;background:#2a2c38;color:#fff;
}
.ct-error{
  color:#ff6b6b;font-size:12px;
  font-weight:700;margin-top:6px;
}

/* download */
.ct-download{
  margin-top:18px;width:100%;
  background:#4CAF50;color:#fff;border:none;
  padding:11px;border-radius:12px;
  font-weight:800;font-size:14px;cursor:pointer;
}
.ct-download:hover{background:#43a047}

/* ===== battery progress ===== */
.ct-battery{
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
.ct-battery-text{
  font-size:13px;font-weight:700;
  margin-bottom:6px;
  display:flex;justify-content:space-between;
}
.ct-battery-bar{
  height:8px;background:#333;
  border-radius:999px;overflow:hidden;
}
.ct-battery-fill{
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
  el.className="ct-battery";
  el.innerHTML=`
    <div class="ct-battery-text">
      <span>Downloading…</span>
      <span id="ct-battery-count">0 / ${total}</span>
    </div>
    <div class="ct-battery-bar">
      <div class="ct-battery-fill" id="ct-battery-fill"></div>
    </div>`;
  document.body.appendChild(el);
}

function updateBattery(done,total){
  const percent=Math.round(done/total*100);
  const fill=document.getElementById("ct-battery-fill");
  const text=document.getElementById("ct-battery-count");
  if(!fill||!text)return;

  fill.style.width=percent+"%";
  text.textContent=`${done} / ${total}`;

  if(percent<30) fill.style.background="#e55353";
  else if(percent<60) fill.style.background="#f6c344";
  else if(percent<90) fill.style.background="#4B6EF6";
  else fill.style.background="#4CAF50";
}

function removeBattery(){
  document.querySelector(".ct-battery")?.remove();
}

/* ================= BUTTON IN LIST ================= */

function injectButtons(){
  document.querySelectorAll("li").forEach(li=>{
    if(li.querySelector(".ct-btn"))return;
    const h4=li.querySelector("h4");
    if(!h4)return;

    const url=li.querySelector("a")?.href||location.href;
    h4.parentElement.style.position="relative";

    const btn=document.createElement("button");
    btn.textContent="Download";
    btn.className="ct-btn";
    btn.style.position="absolute";
    btn.style.right="12px";
    btn.style.top="50%";
    btn.style.transform="translateY(-50%)";

    btn.onclick=e=>{
      e.preventDefault();
      e.stopPropagation();
      openPopup(url,h4.textContent.trim());
    };

    h4.parentElement.appendChild(btn);
  });
}

/* ================= POPUP ================= */

async function openPopup(url,title){
  document.querySelector(".ct-popup")?.remove();

  const pages=await fetchPages(url);
  const total=pages.length;
  let format="jpg";

  const popup=document.createElement("div");
  popup.className="ct-popup";
  popup.innerHTML=`
    <div class="ct-header">
      Comic-Trail Downloader
      <span class="ct-close">✕</span>
    </div>
    <div class="ct-body">
      <div style="font-weight:700">${title}</div>
      <div class="ct-muted">Total pages: ${total}</div>

      <div class="ct-section">
        <div style="font-weight:700">Select image format</div>
        <div class="ct-cards">
          <div class="ct-card active" data-fmt="jpg">
            <div class="ct-card-title">JPG</div>
            <div class="ct-muted">Lossy • Smaller</div>
          </div>
          <div class="ct-card" data-fmt="png">
            <div class="ct-card-title">PNG</div>
            <div class="ct-muted">Lossless • Large</div>
          </div>
        </div>
      </div>

      <div class="ct-section ct-range">
        <div style="font-weight:700">Image range</div>
        <input id="from" type="number" min="1" max="${total}" placeholder="From">
        →
        <input id="to" type="number" min="1" max="${total}" placeholder="To">
        <div id="counter" class="ct-muted">Full chapter</div>
        <div id="err" class="ct-error" style="display:none"></div>
      </div>

      <button class="ct-download">Download</button>
    </div>`;
  document.body.appendChild(popup);

  /* ===== draggable popup ===== */
  const header=popup.querySelector(".ct-header");
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

  popup.querySelector(".ct-close").onclick=()=>popup.remove();

  popup.querySelectorAll(".ct-card").forEach(c=>{
    c.onclick=()=>{
      popup.querySelectorAll(".ct-card").forEach(x=>x.classList.remove("active"));
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

  popup.querySelector(".ct-download").onclick=()=>{
    const f=+fromI.value||1;
    const t=+toI.value||total;
    if((fromI.value&&!toI.value)||(!fromI.value&&toI.value))
      return showErr("Both From and To required",err);
    if(f<1||t>total||f>t)
      return showErr(`Range must be 1–${total}`,err);

    popup.remove();
    startDownload(title,pages,f,t,format);
  };
}

function showErr(msg,el){
  el.textContent=msg;
  el.style.display="block";
}

/* ================= FETCH & DOWNLOAD ================= */

async function fetchPages(url){
  const html=await axios.get(url).then(r=>r.data);
  const doc=new DOMParser().parseFromString(html,"text/html");
  const json=JSON.parse(doc.querySelector("#episode-json").dataset.value);
  return json.readableProduct.pageStructure.pages.filter(p=>p.src);
}

async function decodeImage(url){
  const buf=await axios.get(url,{responseType:"arraybuffer"}).then(r=>r.data);
  if(!/\/\d\/\d+-[0-9a-f]{32}/.test(url)) return new Blob([buf]);

  return new Promise(res=>{
    const img=new Image();
    img.src=URL.createObjectURL(new Blob([buf]));
    img.onload=()=>{
      const c=document.createElement("canvas");
      c.width=img.width;
      c.height=img.height;
      c.getContext("2d").drawImage(img,0,0);
      c.toBlob(res,"image/jpeg",1);
    };
  });
}

async function startDownload(title,pages,from,to,fmt){
  pages=pages.slice(from-1,to);
  const total=pages.length;
  showBattery(total);

  let done=0;

  if(total===1){
    const b=await decodeImage(pages[0].src);
    updateBattery(1,1);
    setTimeout(()=>{
      save(b,`${title}_${from}.${fmt}`);
      removeBattery();
    },300);
    return;
  }

  const zw=new zip.ZipWriter(new zip.BlobWriter("application/zip"));
  const pad=total.toString().length;

  for(let i=0;i<pages.length;i++){
    const b=await decodeImage(pages[i].src);
    done++;
    updateBattery(done,total);
    await zw.add(
      `${String(i+from).padStart(pad,"0")}.${fmt}`,
      new zip.BlobReader(b)
    );
  }

  save(await zw.close(),`${title}_${from}-${to}.zip`);
  setTimeout(removeBattery,300);
}

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