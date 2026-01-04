// ==UserScript==
// @name         MJAI Bad Move Analyzer (CSS fix)
// @namespace    mjai-ekyu
// @version      1.0
// @match        https://mjai.ekyu.moe/*
// @grant        GM_addStyle
// @description   MJAI Bad Move Analyzer 
// @license      1
// @downloadURL https://update.greasyfork.org/scripts/561196/MJAI%20Bad%20Move%20Analyzer%20%28CSS%20fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561196/MJAI%20Bad%20Move%20Analyzer%20%28CSS%20fix%29.meta.js
// ==/UserScript==

/* ===== index.css (필수) ===== */
GM_addStyle(`
details.entry {
  position: relative;
}

details .add-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
  position: absolute;
  right: 10px;
  top: 4px;
  z-index: 10;
}

details .add-info .info-text {
  font-weight: normal;
  color: #f55;
}

details .add-info > button {
  display: flex;
  padding: 3px 5px;
  border-radius: 4px;
  border: 1px solid #aaa;
  background: #fff;
  cursor: pointer;
}

details .add-info > button:hover {
  background-color: #d7d7d7;
  border: 1px solid #999;
}

details .add-info > button > svg {
  fill: #666;
  height: 20px;
  width: 20px;
}
`);

/* ===== index.js (당신이 올린 코드 그대로) ===== */
(()=>{
  /* 🔴 여기 안에 */
    (()=>{var B=(t,c)=>()=>(c||t((c={exports:{}}).exports,c),c.exports);var $=B((st,H)=>{function G(t,c){let e=Object.freeze({east:0,south:1,west:2,north:3}),o=Object.freeze({eastTsumo:1,eastDahai:2,southTsumo:3,southDahai:4,westTsumo:5,westDahai:6,northTsumo:7,northDahai:8}),n={east:[],south:[],west:[],north:[]},s={east:[],south:[],west:[],north:[]},r={},i=1,h=1;switch(c){case 1:n.east=t[1],s.east=t[2],n.south=t[4],s.south=t[5],n.west=t[7],s.west=t[8],n.north=t[10],s.north=t[11];break;case 2:n.east=t[4],s.east=t[5],n.south=t[7],s.south=t[8],n.west=t[10],s.west=t[11],n.north=t[1],s.north=t[2];break;case 3:n.east=t[7],s.east=t[8],n.south=t[10],s.south=t[11],n.west=t[1],s.west=t[2],n.north=t[4],s.north=t[5];break;case 4:n.east=t[10],s.east=t[11],n.south=t[1],s.south=t[2],n.west=t[4],s.west=t[5],n.north=t[7],s.north=t[8];break}for(;!(N(n)&&N(s));){let a;switch(h){case o.eastTsumo:a=n.east.shift(),r[i]={wind:e.east,type:v(a)?"naki":"tsumo",hai:a};break;case o.eastDahai:a=s.east.shift(),a=a===0?s.east.shift():a,a=a===60?r[i-1].hai:a,r[i]={wind:e.east,type:"dahai",hai:a},h=g(a,r[i].wind,n,e,o),h=q(a)?o.eastTsumo:h;break;case o.southTsumo:a=n.south.shift(),r[i]={wind:e.south,type:v(a)?"naki":"tsumo",hai:a};break;case o.southDahai:a=s.south.shift(),a=a===0?s.south.shift():a,a=a===60?r[i-1].hai:a,r[i]={wind:e.south,type:"dahai",hai:a},h=g(a,r[i].wind,n,e,o),h=q(a)?o.southTsumo:h;break;case o.westTsumo:a=n.west.shift(),r[i]={wind:e.west,type:v(a)?"naki":"tsumo",hai:a};break;case o.westDahai:a=s.west.shift(),a=a===0?s.west.shift():a,a=a===60?r[i-1].hai:a,r[i]={wind:e.west,type:"dahai",hai:a},h=g(a,r[i].wind,n,e,o),h=q(a)?o.westTsumo:h;break;case o.northTsumo:a=n.north.shift(),r[i]={wind:e.north,type:v(a)?"naki":"tsumo",hai:a};break;case o.northDahai:a=s.north.shift(),a=a===0?s.north.shift():a,a=a===60?r[i-1].hai:a,r[i]={wind:e.north,type:"dahai",hai:a},h=g(a,r[i].wind,n,e,o),h=q(a)?o.northTsumo:h;break}switch(r[i].type){case"tsumo":case"naki":String(r[i].hai).includes("m")||(h+=1);break;case"dahai":String(a).includes("r")&&(i+=1,r[i]={wind:r[i-1].wind,type:"dahai",hai:r[i-1].hai});break}i+=1}return r}function N(t){return Object.values(t).every(c=>c.length===0)}function g(t,c,e,o,n){let s;switch(c){case o.east:String(e.south[0])[0]==="p"&&u(e.south[0],t)?s=n.southTsumo:String(e.west[0])[2]==="p"&&u(e.west[0],t)?s=n.westTsumo:String(e.north[0])[4]==="p"&&u(e.north[0],t)?s=n.northTsumo:String(e.south[0])[0]==="m"&&d(e.south[0],t)?s=n.southTsumo:String(e.west[0])[2]==="m"&&d(e.west[0],t)?s=n.westTsumo:String(e.north[0])[6]==="m"&&d(e.north[0],t)?s=n.northTsumo:s=n.southTsumo;break;case o.south:String(e.west[0])[0]==="p"&&u(e.west[0],t)?s=n.westTsumo:String(e.north[0])[2]==="p"&&u(e.north[0],t)?s=n.northTsumo:String(e.east[0])[4]==="p"&&u(e.east[0],t)?s=n.eastTsumo:String(e.west[0])[0]==="m"&&d(e.west[0],t)?s=n.westTsumo:String(e.north[0])[2]==="m"&&d(e.north[0],t)?s=n.northTsumo:String(e.east[0])[6]==="m"&&d(e.east[0],t)?s=n.eastTsumo:s=n.westTsumo;break;case o.west:String(e.north[0])[0]==="p"&&u(e.north[0],t)?s=n.northTsumo:String(e.east[0])[2]==="p"&&u(e.east[0],t)?s=n.eastTsumo:String(e.south[0])[4]==="p"&&u(e.south[0],t)?s=n.southTsumo:String(e.north[0])[0]==="m"&&d(e.north[0],t)?s=n.northTsumo:String(e.east[0])[2]==="m"&&d(e.east[0],t)?s=n.eastTsumo:String(e.south[0])[6]==="m"&&d(e.south[0],t)?s=n.southTsumo:s=n.northTsumo;break;case o.north:String(e.east[0])[0]==="p"&&u(e.east[0],t)?s=n.eastTsumo:String(e.south[0])[2]==="p"&&u(e.south[0],t)?s=n.southTsumo:String(e.west[0])[4]==="p"&&u(e.west[0],t)?s=n.westTsumo:String(e.east[0])[0]==="m"&&d(e.east[0],t)?s=n.eastTsumo:String(e.south[0])[2]==="m"&&d(e.south[0],t)?s=n.southTsumo:String(e.west[0])[6]==="m"&&d(e.west[0],t)?s=n.westTsumo:s=n.eastTsumo;break}return s}function u(t,c){let e=[],o=String(t).replace("p",""),n=String(c).replace("r","");for(let s=0;s<o.length;s+=2)e.push(o.substring(s,s+2));return e.includes(n)}function d(t,c){let e=[],o=String(t).replace("m",""),n=String(c).replace("r","");for(let s=0;s<o.length;s+=2)e.push(o.substring(s,s+2));return e.includes(n)}function v(t){return String(t).includes("c")||String(t).includes("p")}function q(t){return String(t).includes("k")||String(t).includes("a")}H.exports=G});var K=B((nt,z)=>{var Q={ja:{metaData:"\u30E1\u30BF\u30C7\u30FC\u30BF",dealIn:"\u653E\u9283",badMove:"\u60AA\u624B",badMoveRate:"\u60AA\u624B\u7387",aiMatchRate:"AI\u4E00\u81F4\u7387",through:"\u30D7\u30EC\u30A4\u30E4\u30FC: \u30B9\u30EB\u30FC",ron:"\u30D7\u30EC\u30A4\u30E4\u30FC: \u30ED\u30F3",tsumo:"\u30D7\u30EC\u30A4\u30E4\u30FC: \u30C4\u30E2"},en:{metaData:"Metadata",dealIn:"Deal-in",badMove:"Bad move",badMoveRate:"Bad move rate",aiMatchRate:"matches/total",through:"Player: Skip",ron:"Player: Ron",tsumo:"Player: Tsumo"},"zh-CN":{metaData:"\u5143\u6570\u636E",dealIn:"\u51FA\u724C",badMove:"\u574F\u68CB",badMoveRate:"\u574F\u68CB\u7387",aiMatchRate:"AI \u4E00\u81F4\u7387",through:"\u73A9\u5BB6: \u8DF3\u8FC7",ron:"\u73A9\u5BB6: \u548C",tsumo:"\u73A9\u5BB6: \u81EA\u6478"},ko:{metaData:"\uBA54\uD0C0\uB370\uC774\uD130",dealIn:"\uD328\uB97C \uBC84\uB9AC\uB2E4",badMove:"\uB098\uC05C \uC218",badMoveRate:"\uB098\uC05C \uC218\uC758 \uBE44\uC728",aiMatchRate:"AI \uC77C\uCE58\uC728",through:"\uC791\uC0AC: \uC2A4\uD0B5",ron:"\uC791\uC0AC: \uB860",tsumo:"\uC791\uC0AC: \uCBD4\uBAA8"},ru:{metaData:"Metadata",dealIn:"\u0432\u044B\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u0443",badMove:"\u043F\u043B\u043E\u0445\u043E\u0439 \u0445\u043E\u0434",badMoveRate:"\u043A\u043E\u044D\u0444\u0444\u0438\u0446\u0438\u0435\u043D\u0442 \u043F\u043B\u043E\u0445\u0438\u0445 \u0445\u043E\u0434\u043E\u0432",aiMatchRate:"matches/total",through:"Player: Skip",ron:"Player: Ron",tsumo:"Player: Tsumo"}};z.exports=Q});var E=window.location.href;!E.includes("report")&&!E.includes("progress")?document.querySelector('select[name="ui"]').value="classic":E.includes("report")&&X();function X(){let t=$(),c=K(),e=document.documentElement.getAttribute("lang"),o=c[e];document.querySelector('input[value="horizontal"]').click(),Array.from(document.querySelectorAll("summary")).find(l=>l.textContent===o.metaData).parentElement.open=!0;let n=0,s=0;document.querySelectorAll("section").forEach((l,J)=>{let R=l.querySelector("iframe"),M=new URL(R.src),k=parseInt(new URLSearchParams(M.search).get("tw")),Z=l.querySelector("h1[id^='kyoku-']").id,A=Y(parseInt(Z.match(/kyoku-(\d+)/)[1])+1),L=l.querySelector("textarea").textContent,F=JSON.parse(L).log[0].slice(4,16),V=t(F,A),P=j(V,_(k,A)),x=!1,D=[...[...JSON.parse(L).log].pop()].pop()[2];if(D&&(x=D[0]!==k&&D[1]===k,x)){let C=document.querySelectorAll(".end-status-item")[J].querySelector(".end-status");C.textContent+=`\uFF08${o.dealIn}\uFF09`,l.querySelector(".end-status").textContent+=`\uFF08${o.dealIn}\uFF09`}let T=l.querySelectorAll("details.entry");T.forEach((w,C)=>{n+=1;let b=document.createElement("div");if(b.classList.add("add-info"),C===T.length-1&&P.length===1&&x){let f=document.createElement("div");f.textContent=o.dealIn,f.classList.add("info-text"),b.appendChild(f),w.open=!0}let O=w.querySelector(".order-loss");if(O){let f=parseInt(O.textContent.trim().replace("#","")),S=w.querySelector("details table").rows[f].cells[2];if(parseInt(S.querySelector(".int").textContent)<5){s+=1;let m=document.createElement("div");m.textContent=o.badMove,m.classList.add("info-text"),b.appendChild(m)}}let W=w.querySelector("ul + span").textContent;if(![o.through,o.ron,o.tsumo].includes(W.trim())){let f=document.createElement("button");f.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M160-160v-80h110l-16-14q-52-46-73-105t-21-119q0-111 66.5-197.5T400-790v84q-72 26-116 88.5T240-478q0 45 17 87.5t53 78.5l10 10v-98h80v240H160Zm400-10v-84q72-26 116-88.5T720-482q0-45-17-87.5T650-648l-10-10v98h-80v-240h240v80H690l16 14q49 49 71.5 106.5T800-482q0 111-66.5 197.5T560-170Z"/></svg>';let p=0;try{let S=P.shift();p=parseInt(S[0]),S[1].type!=="naki"&&(p-=1)}catch(S){console.log(S)}f.addEventListener("click",function(S){let y={tw:k,ts:0,tj:p,timestamp:new Date().getTime()};M.search=new URLSearchParams(y).toString(),R.src=M;let m=l.querySelector("details.collapse");m.open||(m.open=!0)}),b.append(f)}w.insertBefore(b,w.firstChild)})});let r=document.querySelector("dl"),h=Array.from(r.querySelectorAll("dt")).find(l=>l.textContent===o.aiMatchRate).nextElementSibling,a=document.createElement("dt");a.textContent=o.badMoveRate;let I=document.createElement("dd"),U=(s/n*100).toFixed(3);I.textContent=`${s}/${n} = ${U}%`,h.parentNode.insertBefore(a,h.nextSibling),h.parentNode.insertBefore(I,a.nextSibling)}function Y(t){return(t-1)%4+1}function _(t,c){let e=(t-(c-1))%4;return e<0&&(e+=4),e}function j(t,c){return Object.entries(t).filter(([e,o])=>{if(o.wind===c&&o.type!=="tsumo")return!0})}})();

  /* 👉 당신이 올린 긴 JS 코드 전체를 그대로 붙여넣으면 됨 */
})();

// === Bad move rate 숨기기 (확정판) ===
(function hideBadMoveRate() {
  const TARGETS = [
    "나쁜 수의 비율",
   // "Bad move rate",
   // "悪手率",
 //   "坏棋率"
  ];

  function apply() {
    document.querySelectorAll("dt").forEach(dt => {
      const text = dt.textContent.trim();
      if (TARGETS.includes(text)) {
        const dd = dt.nextElementSibling;
        dt.style.display = "none";
        if (dd && dd.tagName === "DD") {
          dd.style.display = "none";
        }
      }
    });
  }

  // 최초 1회
  apply();

  // 동적 DOM 대응
  new MutationObserver(apply).observe(document.body, {
    childList: true,
    subtree: true
  });
})();
