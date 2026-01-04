// ==UserScript==
// @name         Torn: Hospital Time v1.1
// @author       Rescender + -Danny- [2241825]
// @match        https://www.torn.com/*.php*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @version      1.1.1
// @description  Hospital timer, highlights best medical item, independent blood bag exclusions with GUI
// @namespace https://greasyfork.org/users/543667
// @downloadURL https://update.greasyfork.org/scripts/557943/Torn%3A%20Hospital%20Time%20v11.user.js
// @updateURL https://update.greasyfork.org/scripts/557943/Torn%3A%20Hospital%20Time%20v11.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

const bloodBagIDs = ["739","738","737","736","735","734","733","732"];
const bloodBagNames = {
    "739":"O-","738":"O+","737":"AB-","736":"AB+",
    "735":"B-","734":"B+","733":"A-","732":"A+"
};
const bloodBagReductionMs = 120*60*1000; // 120 min

let settingSvg = `<svg fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14px" height="14px"><path d="M..."/></svg>`;
let hospitalSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="plus_img" stroke="transparent" fill="#b3382c" width="13" height="13" viewBox="0 1 16 16"><polygon points="6 1 6 7 0 7 0 11 6 11 6 17 10 17 10 11 16 11 16 7 10 7 10 1 6 1"></polygon></svg>`;

// Convert ms → D:HH:MM:SS
function msToTime(duration){
    var seconds = Math.floor((duration/1000)%60),
        minutes = Math.floor((duration/(1000*60))%60),
        hours = Math.floor((duration/(1000*60*60))%24),
        days = Math.floor(duration/(1000*60*60*24));
    return (days>0?days+":":"")+
           (hours>0||days>0?((hours<10?"0":"")+hours+":"):"")+
           (minutes<10?"0":"")+minutes+":"+
           (seconds<10?"0":"")+seconds;
}

// Floating gear button GUI
function openExclusionGUI() {
    const excluded = GM_getValue("exclude_bags", []);
    document.querySelector("#bagSettingsModal")?.remove();

    const modal = document.createElement("div");
    modal.id = "bagSettingsModal";
    modal.innerHTML = `<div id="bagSettingsBox">
        <h2>Hospital Settings</h2>
        <label>Medical Bonus:</label><br>
        <label><input type="radio" name="eff" value="0" ${GM_getValue("med_effectiveness",0)==0?"checked":""}>0%</label><br>
        <label><input type="radio" name="eff" value="10" ${GM_getValue("med_effectiveness",0)==10?"checked":""}>10%</label><br>
        <label><input type="radio" name="eff" value="20" ${GM_getValue("med_effectiveness",0)==20?"checked":""}>20%</label><br><br>
        <label>Exclude Blood Bags:</label>
        <div id="bagList">${bloodBagIDs.map(id=>`<label><input type="checkbox" class="bagCheck" value="${id}" ${excluded.includes(id)?"checked":""}> ${bloodBagNames[id]}</label><br>`).join("")}</div>
        <button id="saveBagSettings">Save</button>
        <button id="cancelBagSettings">Cancel</button>
    </div>`;
    document.body.appendChild(modal);

    document.querySelector("#saveBagSettings").onclick=()=>{
        const eff = parseInt(document.querySelector("input[name='eff']:checked").value);
        const newExcluded = [...document.querySelectorAll(".bagCheck:checked")].map(el=>el.value);
        GM_setValue("med_effectiveness",eff);
        GM_setValue("exclude_bags",newExcluded);
        modal.remove();
    };
    document.querySelector("#cancelBagSettings").onclick=()=>modal.remove();
}

// Add floating gear button
function addSettingsButton(){
    if(document.querySelector("#hospitalSettingsBtn")) return;
    const btn = document.createElement("div");
    btn.id="hospitalSettingsBtn";
    btn.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 24 24" width="24" height="24">
        <path d="M12 8a4 4 0 100 8 4 4 0 000-8zm9.4 3l-2.1-.3c-.2-.7-.5-1.3-.9-1.9l1.2-1.9-1.5-1.5-1.9 1.2c-.6-.4-1.2-.7-1.9-.9l-.3-2.1h-2l-.3 2.1c-.7.2-1.3.5-1.9.9L7.4 5.6 5.9 7.1l1.2 1.9c-.4.6-.7 1.2-.9 1.9l-2.1.3v2l2.1.3c.2.7.5 1.3.9 1.9l-1.2 1.9 1.5 1.5 1.9-1.2c.6.4 1.2.7 1.9.9l.3 2.1h2l.3-2.1c.7-.2 1.3-.5 1.9-.9l1.9 1.2 1.5-1.5-1.2-1.9c.4-.6.7-1.2.9-1.9l2.1-.3v-2z"/>
    </svg>`;
    btn.title="Hospital Settings";
    btn.addEventListener("click",openExclusionGUI);
    document.body.appendChild(btn);
}

// Countdown display
function showCountdown(time){
    if(!document.querySelector(".hospitalTime1")){
        let node=document.createElement("div");
        let node2=document.createElement("div");
        node.className="hospitalTime1 t-clear m-icon";
        node2.className="hospitalTime2 t-clear";
        document.querySelector("#skip-to-content").appendChild(node);
        document.querySelector('a[class*="life___"] [class^="bar-descr"]').replaceWith(node2);
        document.querySelector(".hospitalTime1").innerHTML=`<div class="wrapper">${hospitalSvg}<div class="hospTime1">${msToTime(time)}</div></div>`;
        document.querySelector(".hospitalTime2").innerHTML=`<div class="wrapper">${hospitalSvg}<div class="hospTime2">${msToTime(time)}</div></div>`;
    } else {
        document.querySelector(".hospTime1").innerHTML=msToTime(time);
        document.querySelector(".hospTime2").innerHTML=msToTime(time);
    }
}

// Highlight logic
function removeAnimations(){document.querySelectorAll('.animate-health').forEach(e=>e.classList.remove('animate-health'));}
function highlightID(id){
    document.querySelectorAll(`[data-id="${id}"]`).forEach(el => el.classList.add('animate-health'));
    document.querySelectorAll(`li[data-rowkey="g${id}"]`).forEach(e=>e.classList.add('animate-health'));
    document.querySelectorAll(`[data-item="${id}"]`)[0]?.classList.add('animate-health');
    document.querySelectorAll(`[data-itemid="${id}"]`)[0]?.closest('li')?.classList.add('animate-health');
}

// Show best medical option
function showBestOption(time){
    const eff = GM_getValue("med_effectiveness",0);
    const effmult = 1+eff/100;
    const excluded = GM_getValue("exclude_bags",[]);

    removeAnimations();

    if(time<20*60*1000*effmult) highlightID("68");         // Small Kit
    else if(time<40*60*1000*effmult) highlightID("67");    // First Aid
    else if(time<120*60*1000*effmult){                     // Blood Bags
        let any=false;
        bloodBagIDs.forEach(id=>{
            if(!excluded.includes(id)){
                highlightID(id);
                any=true;
            }
        });
        if(!any) highlightID("66"); // Morphine fallback
    } else highlightID("66");      // Morphine
}

// Get sidebar data
function getSidebarData(){
    let key=Object.keys(sessionStorage).find(k=>/sidebarData\d+/.test(k));
    return JSON.parse(sessionStorage.getItem(key));
}

// CSS
GM_addStyle(`
.hospitalTime1,.hospitalTime2{position:relative;font-size:initial;display:inline-block;}
.hospitalTime1 .wrapper{border:2px solid #b3382c;padding:0 4px;border-radius:6px;}
.hospitalTime2 .wrapper{font-size:12px;right:-12px;position:relative;}
.hospTime1,.hospTime2{display:inline-block;}
.plus_img{top:1px;position:relative;margin-right:2px;}
.animate-health{animation:healthpulse 1s infinite;}
@keyframes healthpulse{0%{transform:scale(0.95);box-shadow:0 0 0 0 rgba(248,5,5,0.85);}70%{transform:scale(1);box-shadow:0 0 0 10px rgba(0,0,0,0);}100%{transform:scale(0.95);box-shadow:0 0 0 0 rgba(0,0,0,0);}}
#hospitalSettingsBtn{position:fixed;top:50%;right:12px;transform:translateY(-50%);background:#b3382c;padding:6px;border-radius:50%;cursor:pointer;z-index:99998;box-shadow:0 0 5px #0007;}
#hospitalSettingsBtn:hover{background:#d9453a;}
#bagSettingsModal{position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.55);display:flex;align-items:center;justify-content:center;z-index:99999;}
#bagSettingsBox{background:#222;color:#fff;padding:20px;width:350px;border-radius:8px;box-shadow:0 0 10px #000;font-family:Arial,sans-serif;}
#bagSettingsBox h2{margin-top:0;font-size:18px;}
#bagList{max-height:200px;overflow-y:auto;border:1px solid #444;padding:8px;background:#111;}
#bagSettingsBox button{margin-top:12px;padding:6px 12px;border:none;cursor:pointer;border-radius:4px;}
#saveBagSettings{background:#4caf50;color:#fff;}
#cancelBagSettings{background:#888;color:#fff;float:right;}
`);

// Main loop
(function(){
    'use strict';
    addSettingsButton();
    setInterval(()=>{
        const sd=getSidebarData();
        if(sd?.statusIcons?.icons?.hospital){
            let millis=(sd.statusIcons.icons.hospital.timerExpiresAt-Date.now()/1000)*1200;
            showCountdown(millis);
            showBestOption(millis);
        }else{
            removeAnimations();
            document.querySelectorAll('[class^="hospitalTime"]').forEach(e=>e.remove());
        }
    },1000);
})();


