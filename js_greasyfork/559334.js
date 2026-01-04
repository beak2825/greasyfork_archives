// ==UserScript==
// @name         🍭 Smart Auto-Use Items
// @namespace    anon
// @version      2.8
// @description Smart scan-first auto-use with v2.5 carousel UI design (mobile centered, arrow fixed, subtle blur)
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/Items/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559334/%F0%9F%8D%AD%20Smart%20Auto-Use%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/559334/%F0%9F%8D%AD%20Smart%20Auto-Use%20Items.meta.js
// ==/UserScript==

(function () {
'use strict';

/* ================= CONFIG ================= */
const PAGE_WIDTH = 120;
const DELAY_BEFORE_CLICK = 300;
const MAX_RETRIES = 3;

const RETRY_KEY = "autouse-retry-count";
const STEP_KEY_COMBO1 = "autouse-step";
const USED_KEY_COMBO2 = "autouse-used-items";
const CHOCO_LOOP_KEY = "choco-loop";

/* ================= MOBILE ================= */
const isMobile = () => window.innerWidth <= 768;

/* ================= CHOCOLATE ================= */
const CHOCO_KEYWORDS = [
    "kalp şeklinde kutulanmış çikolata",
    "heart shaped box of chocolates"
];

/* ================= COMBO 1 ================= */
const COMBO1_ITEMS = [
    { keywords:["snowglobe of kadath","kadath'ın kar küresi"], emoji:"❄️", status:"Using Snowglobe", color:"#333366", step:"snow" },
    { keywords:["rubik","rubik küpü"], emoji:"🧩", status:"Using Rubik's Cube", color:"#9933cc", step:"rubik" },
    { keywords:["microphone","mikrofon"], emoji:"🎤", status:"Using Microphone", color:"#0066cc", step:"mic" },
    { keywords:["anti-stress ball","stres topu"], emoji:"🟠", status:"Using Anti-Stress Ball", color:"#cc6600", step:"ball" },
    { keywords:["skateboard","kaykay"], emoji:"🛹", status:"Using Skateboard", color:"#cc3399", step:"skate" },
    { keywords:["illuminati puzzle pyramid","illuminati piramit bulmacası"], emoji:"🔺", status:"Using Pyramid", color:"#c0d018", step:"pyramid" },
    { keywords:["drums","davul"], emoji:"🥁", status:"Tuning Drums", color:"#8b0000", step:"drums" },
    { keywords:["electric guitar","akustik gitar","elektrogitar"], emoji:"🎸", status:"Tuning Guitar", color:"#1a1a1a", step:"guitar" },
    { keywords:["keyboard","klavye"], emoji:"🎹", status:"Tuning Keyboard", color:"#444444", step:"keyboard" },
    { keywords:["violin","keman"], emoji:"🎻", status:"Tuning Violin", color:"#663300", step:"violin" },
    { keywords:["bass guitar","basgitar"], emoji:"🎸", status:"Tuning Bass", color:"#2b2b2b", step:"bass" },
    { keywords:["piano","piyano"], emoji:"🎹", status:"Tuning Piano", color:"#000000", step:"piano" },
    { keywords:["cuddly grinch","grinch bebeği"], emoji:"🦖", status:"Cuddling Grinch", color:"#32cd32", step:"grinch" },
    { keywords:["cuddly santa","pelüş noel baba"], emoji:"🎅", status:"Cuddling Santa", color:"#ff0000", step:"santa" },
    { keywords:["cuddly snowman","sevimli kardan adam"], emoji:"⛄", status:"Cuddling Snowman", color:"#ededed", step:"snowman" }
];

/* ================= COMBO 2 ================= */
const COMBO2_ITEMS = [
    { name:"Pom-Poms", keywords:["pom-poms","ponponlar"], emoji:"🎀", color:"#ff8591" },
    { name:"Captain Slippers", keywords:["captain's dancing slippers","kaptan'ın dans ayakkabıları"], emoji:"🩰", color:"#A491D3" },
    { name:"Joke", keywords:["joke","fıkra"], emoji:"🎭", color:"#33ccff" },
    { name:"Teenage Diary", keywords:["teenage diary","ergen günlüğü"], emoji:"📓", color:"#3C6997" },
    { name:"Tickle Me Elvis", keywords:["tickle me elvis"], emoji:"🐣", color:"#ff9933" },
    { name:"Meal", keywords:["meal","yemek"], emoji:"🍉", color:"#3aaf98" }
];

/* ================= ITEM SCAN ================= */
const normalize = t => t?.toLowerCase().replace(/\s+/g,' ').trim() || "";
let CACHE = [];

function scanItems(){
    CACHE = [];
    document.querySelectorAll("tr").forEach(r=>{
        const txt = normalize(r.textContent);
        const btn = r.querySelector('input[title="Use"],input[title="Tune"],input[id*="btnUse"]');
        if(txt && btn) CACHE.push({txt,btn});
    });
}

const findItem = keywords =>
    CACHE.find(i => keywords.some(k => i.txt.includes(normalize(k))));

/* ================= CORE ================= */
function canRetry(){
    const r = +sessionStorage.getItem(RETRY_KEY)||0;
    if(r>=MAX_RETRIES) return false;
    sessionStorage.setItem(RETRY_KEY,r+1);
    return true;
}

function delayed(fn,status,color,emoji){
    if(!canRetry()) return;
    showStatus(`${emoji} ${status}...`,color);
    setTimeout(()=>{
        if(fn()){
            sessionStorage.removeItem(RETRY_KEY);
            setTimeout(()=>location.reload(),500);
        }
    },DELAY_BEFORE_CLICK);
}

/* ================= COMBOS ================= */
function runChoco(){
    const i = findItem(CHOCO_KEYWORDS);
    if(!i){ sessionStorage.removeItem(CHOCO_LOOP_KEY); return; }
    sessionStorage.setItem(CHOCO_LOOP_KEY,"1");
    delayed(()=>{i.btn.click();return true;},"Eating Chocolate","#cc3366","🍫");
}

function runCombo1(){
    const step = sessionStorage.getItem(STEP_KEY_COMBO1) || COMBO1_ITEMS[0].step;
    let start=false;
    for(let i=0;i<COMBO1_ITEMS.length;i++){
        const item = COMBO1_ITEMS[i];
        if(start || item.step===step){
            start=true;
            const found = findItem(item.keywords);
            if(!found) continue;
            sessionStorage.setItem(STEP_KEY_COMBO1,COMBO1_ITEMS[i+1]?.step||"done");
            delayed(()=>{found.btn.click();return true;},item.status,item.color,item.emoji);
            return;
        }
    }
    sessionStorage.removeItem(STEP_KEY_COMBO1);
}

function runCombo2(){
    let used = JSON.parse(sessionStorage.getItem(USED_KEY_COMBO2)||"[]");
    for(const item of COMBO2_ITEMS){
        if(used.includes(item.name)) continue;
        const found = findItem(item.keywords);
        if(!found) continue;
        used.push(item.name);
        sessionStorage.setItem(USED_KEY_COMBO2,JSON.stringify(used));
        delayed(()=>{found.btn.click();return true;},`Using ${item.name}`,item.color,item.emoji);
        return;
    }
    sessionStorage.removeItem(USED_KEY_COMBO2);
}

/* ================= STATUS ================= */
function showStatus(txt,color){
    let b=document.getElementById("autouse-status");
    if(!b){
        b=document.createElement("div");
        b.id="autouse-status";
        b.style.cssText=`
            position:fixed;top:20px;right:10px;
            padding:10px 14px;
            background:${color||'#333'};
            color:#fff;font-weight:bold;
            border-radius:6px;
            box-shadow:0 0 10px rgba(0,0,0,.3);
            z-index:9999;font-size:14px;
        `;
        document.body.appendChild(b);
    }
    b.style.background=color||'#333';
    b.innerHTML=txt;
}

/* ================= CAROUSEL (with blur) ================= */
let currentPage = 1;

function setupCarousel(){
    scanItems();

    const hasChoco = !!findItem(CHOCO_KEYWORDS);

    const page1 = [
        ...(hasChoco ? [{ text:"🍫", action:runChoco, color:"#cc3366" }] : []),
        { text:"🛹", action:runCombo1, color:"#339966" }
    ];
    const page2 = [{ text:"🍭", action:runCombo2, color:"#d94672" }];

    const wrapper = document.createElement("div");
    wrapper.style.cssText = `
        position:fixed;
        bottom:20px;
        ${isMobile() ? "left:50%;transform:translateX(-50%);" : "right:20px;"}
        display:flex;
        align-items:center;
        z-index:9999;
        background:rgba(255,255,255,0.75);
        backdrop-filter:blur(6px);
        -webkit-backdrop-filter:blur(6px);
        border-radius:10px;
        padding:4px;
        border:1px solid rgba(255,255,255,0.35);
    `;
    document.body.appendChild(wrapper);

    const makeArrow = (symbol, dir) => {
        const b=document.createElement("button");
        b.textContent=symbol;
        b.onclick=()=>navigate(dir);
        b.style.cssText=`
            width:20px;height:40px;
            background:rgba(255,255,255,0.6);
            backdrop-filter:blur(6px);
            -webkit-backdrop-filter:blur(6px);
            border:none;
            border-radius:6px;
            color:#7c8f99;
            cursor:pointer;
            font-weight:bold;
            transition:opacity .2s;
        `;
        return b;
    };

    const prev = makeArrow("<",-1);
    const next = makeArrow(">",1);

    const container=document.createElement("div");
    container.style.cssText=`width:${PAGE_WIDTH}px;height:54px;overflow:hidden;`;

    const pages=document.createElement("div");
    pages.style.cssText=`display:flex;transition:.3s;width:${PAGE_WIDTH*2}px;`;

    const mkPage = btns => {
        const d=document.createElement("div");
        d.style.cssText=`width:${PAGE_WIDTH}px;display:flex;justify-content:space-around;align-items:center;`;
        btns.forEach(c=>d.appendChild(btn(c)));
        return d;
    };

    pages.append(mkPage(page1),mkPage(page2));
    container.appendChild(pages);
    wrapper.append(prev,container,next);

    function update(){
        prev.style.opacity = currentPage === 1 ? "0.35" : "1";
        prev.style.pointerEvents = currentPage === 1 ? "none" : "auto";
        next.style.opacity = currentPage === 2 ? "0.35" : "1";
        next.style.pointerEvents = currentPage === 2 ? "none" : "auto";
        pages.style.transform = `translateX(${-(currentPage-1)*PAGE_WIDTH}px)`;
    }

    function navigate(d){
        currentPage = Math.min(2, Math.max(1, currentPage + d));
        update();
    }

    update();
}

function btn(c){
    const d=document.createElement("div");
    d.textContent=c.text;
    d.onclick=c.action;
    d.style.cssText=`
        width:50px;height:50px;
        border-radius:50%;
        border:2px solid ${c.color};
        background:#fff;
        font-size:28px;
        line-height:50px;
        text-align:center;
        cursor:pointer;
        box-shadow:0 0 10px rgba(0,0,0,.2);
    `;
    return d;
}

/* ================= INIT ================= */
if(location.href.includes("/Character/Items/")){
    setupCarousel();
    if(sessionStorage.getItem(CHOCO_LOOP_KEY)) runChoco();
    if(sessionStorage.getItem(STEP_KEY_COMBO1)) runCombo1();
    if(JSON.parse(sessionStorage.getItem(USED_KEY_COMBO2)||"[]").length) runCombo2();
}

})();
