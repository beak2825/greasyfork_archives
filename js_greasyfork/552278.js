// ==UserScript==
// @name         ✈️ Travel Points Maker (Inventory-Correct + Abroad Info)
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Correct Torn travel points tracker: inventory-only sets & points, abroad shown for planning only
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/552278/%E2%9C%88%EF%B8%8F%20Travel%20Points%20Maker%20%28Inventory-Correct%20%2B%20Abroad%20Info%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552278/%E2%9C%88%EF%B8%8F%20Travel%20Points%20Maker%20%28Inventory-Correct%20%2B%20Abroad%20Info%29.meta.js
// ==/UserScript==

(function () {
'use strict';

/* ================= CONFIG ================= */
const PANEL_ID = 'travel_pts_fixed';
const POLL = 45000;
const PRE_PTS=25, FLO_PTS=10, PLU_PTS=10, MET_PTS=15, FOS_PTS=20;
const YATA_URL='https://yata.yt/api/v1/travel/export/';
const PROM_URL='https://api.prombot.co.uk/api/travel';

/* ================= DATA ================= */
const GROUPS = {
 Prehistoric:{
  pts:PRE_PTS,
  items:{
   "Quartz Point":{s:"Quartz",loc:"CA 🇨🇦"},
   "Chalcedony Point":{s:"Chalcedony",loc:"AR 🇦🇷"},
   "Basalt Point":{s:"Basalt",loc:"HW 🏝️"},
   "Quartzite Point":{s:"Quartzite",loc:"SA 🇿🇦"},
   "Chert Point":{s:"Chert",loc:"UK 🇬🇧"},
   "Obsidian Point":{s:"Obsidian",loc:"MX 🇲🇽"}
  }
 },
 Flowers:{
  pts:FLO_PTS,
  items:{
   "Dahlia":{s:"Dahlia",loc:"MX 🇲🇽"},
   "Orchid":{s:"Orchid",loc:"HW 🏝️"},
   "African Violet":{s:"Violet",loc:"SA 🇿🇦"},
   "Cherry Blossom":{s:"Cherry",loc:"JP 🇯🇵"},
   "Peony":{s:"Peony",loc:"CN 🇨🇳"},
   "Ceibo Flower":{s:"Ceibo",loc:"AR 🇦🇷"},
   "Edelweiss":{s:"Edel",loc:"CH 🇨🇭"},
   "Crocus":{s:"Crocus",loc:"CA 🇨🇦"},
   "Heather":{s:"Heather",loc:"UK 🇬🇧"},
   "Tribulus Omanense":{s:"Tribulus",loc:"AE 🇦🇪"},
   "Banana Orchid":{s:"Banana",loc:"KY 🇰🇾"}
  }
 },
 Plushies:{
  pts:PLU_PTS,
  items:{
   "Sheep Plushie":{s:"Sheep",loc:"B.B"},
   "Teddy Bear Plushie":{s:"Teddy",loc:"B.B"},
   "Kitten Plushie":{s:"Kitten",loc:"B.B"},
   "Jaguar Plushie":{s:"Jaguar",loc:"MX 🇲🇽"},
   "Wolverine Plushie":{s:"Wolv",loc:"CA 🇨🇦"},
   "Nessie Plushie":{s:"Nessie",loc:"UK 🇬🇧"},
   "Red Fox Plushie":{s:"Fox",loc:"UK 🇬🇧"},
   "Monkey Plushie":{s:"Monkey",loc:"AR 🇦🇷"},
   "Chamois Plushie":{s:"Chamois",loc:"CH 🇨🇭"},
   "Panda Plushie":{s:"Panda",loc:"CN 🇨🇳"},
   "Lion Plushie":{s:"Lion",loc:"SA 🇿🇦"},
   "Camel Plushie":{s:"Camel",loc:"AE 🇦🇪"},
   "Stingray Plushie":{s:"Stingray",loc:"KY 🇰🇾"}
  }
 }
};

/* ================= STYLE ================= */
GM_addStyle(`
#${PANEL_ID}{
 position:fixed;top:84px;right:8px;width:235px;
 background:#0e1116;color:#e6e6e6;
 font:10.5px system-ui;border:1px solid #2a2f3a;
 border-radius:8px;z-index:999999;max-height:70vh;
 display:flex;flex-direction:column
}
#${PANEL_ID} .h{padding:5px 8px;font-weight:700;cursor:pointer;background:#151a22}
#${PANEL_ID} .s{padding:4px 8px;background:#10151d;font-weight:700}
#${PANEL_ID} .b{overflow:auto}
#${PANEL_ID} .a{
 background:#2a1414;border-left:3px solid #ff4d4d;
 margin:2px 6px;padding:2px 5px;font-weight:700;border-radius:3px
}
#${PANEL_ID} .t{
 padding:3px 8px;background:#111723;color:#aabaff;
 font-weight:700;border-top:1px solid #1f2530
}
#${PANEL_ID} .r{
 padding:1px 8px;line-height:1.05;
 display:flex;justify-content:space-between
}
#${PANEL_ID} .r span{white-space:nowrap}
`);

/* ================= PANEL ================= */
const p=document.createElement('div');
p.id=PANEL_ID;
p.innerHTML=`<div class="h">✈️ Travel Pts</div><div class="s"></div><div class="b"></div>`;
document.body.appendChild(p);

const sum=p.querySelector('.s');
const body=p.querySelector('.b');
body.style.display=sum.style.display='none';

p.querySelector('.h').onclick=()=>{
 const c=body.style.display==='none';
 body.style.display=sum.style.display=c?'block':'none';
};

/* ================= FETCH ================= */
async function localItems(){
 const k=GM_getValue('tornAPIKey'); if(!k) return {};
 const r=await fetch(`https://api.torn.com/user/?selections=display,inventory&key=${k}`).then(r=>r.json());
 const o={};[...(r.display||[]),...(r.inventory||[])].forEach(i=>o[i.name]=(o[i.name]||0)+i.quantity);
 return o;
}

function gmJSON(url){
 return new Promise(res=>{
  GM_xmlhttpRequest({method:'GET',url,onload:r=>{try{res(JSON.parse(r.responseText))}catch{res({})}},onerror:()=>res({})});
 });
}

async function abroadItems(){
 const [y,p]=await Promise.all([gmJSON(YATA_URL),gmJSON(PROM_URL)]);
 const map={};
 [y?.stocks,y].forEach(src=>{
  Object.values(src||{}).forEach(c=>(c?.stocks||[]).forEach(i=>map[i.name]=(map[i.name]||0)+(i.quantity||i.qty||0)));
 });
 return map;
}

/* ================= LOGIC ================= */
function calcSet(inv,items){
 const vals=Object.keys(items).map(k=>inv[k]||0);
 const s=vals.length?Math.min(...vals):0;
 const r={};Object.keys(items).forEach(k=>r[items[k].s]=(inv[k]||0)-s);
 return{s,r};
}

function lowest(rem,items){
 const m=Math.min(...Object.values(rem));
 const k=Object.keys(rem).find(x=>rem[x]===m);
 const v=Object.values(items).find(i=>i.s===k);
 return m>=0&&v?`Low ${k} → Fly ${v.loc}`:null;
}

/* ================= RENDER ================= */
async function render(){
 const inv=await localItems();
 const abr=await abroadItems();

 let totalSets=0,totalPts=0,html='';

 for(const g of Object.values(GROUPS)){
  const c=calcSet(inv,g.items);
  totalSets+=c.s;
  totalPts+=c.s*g.pts;
  const warn=lowest(c.r,g.items); if(warn) html+=`<div class="a">${warn}</div>`;
  html+=`<div class="t">${Object.keys(g.items)[0].includes('Plushie')?'Plushies':' '}</div>`;
  Object.entries(g.items).forEach(([n,v])=>{
   html+=`<div class="r"><span>${v.s}</span><span>${inv[n]||0}</span><span>${abr[n]||0}</span><span>${v.loc}</span></div>`;
  });
 }

 const met=inv["Meteorite Fragment"]||0,fos=inv["Patagonian Fossil"]||0;
 totalPts+=met*MET_PTS+fos*FOS_PTS;

 html+=`
 <div class="t">Meteorite</div>
 <div class="r"><span>Meteor</span><span>${met}</span><span>${abr["Meteorite Fragment"]||0}</span><span>AR 🇦🇷</span></div>
 <div class="t">Fossil</div>
 <div class="r"><span>Fossil</span><span>${fos}</span><span>${abr["Patagonian Fossil"]||0}</span><span>AR 🇦🇷</span></div>
 `;

 sum.textContent=`Sets ${totalSets} • ${totalPts} pts`;
 body.innerHTML=html;
}

/* ================= LOOP ================= */
(async function loop(){await render();setTimeout(loop,POLL);})();
})();