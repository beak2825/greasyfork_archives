// ==UserScript==
// @name Google 試算表水平移動
// @description 試算表水平移動
// @version 1.0.12
// @match https://docs.google.com/spreadsheets/*
// @ 註解中…目前系統預設為：grant unsafeWindow(沙盒模式，高階API可用)，全域變數用unsafeWindow.age=48；若設定grant none(無沙盒，高階API不可用)，全域變數用window.age=48。不管哪種模式，全域變數直接用age=48亦可，tampermonkey會自己調適。
// @namespace https://greasyfork.org/users/857147
// @downloadURL https://update.greasyfork.org/scripts/549828/Google%20%E8%A9%A6%E7%AE%97%E8%A1%A8%E6%B0%B4%E5%B9%B3%E7%A7%BB%E5%8B%95.user.js
// @updateURL https://update.greasyfork.org/scripts/549828/Google%20%E8%A9%A6%E7%AE%97%E8%A1%A8%E6%B0%B4%E5%B9%B3%E7%A7%BB%E5%8B%95.meta.js
// ==/UserScript==
let direction=.8,moving=true
setTimeout(()=>{
 const pause=document.querySelector('.grid-fixed-wrapper')
 const column0=document.querySelector('.grid-scrollable-wrapper').firstElementChild
 pause.textContent='移動中';pause.style.color='red';pause.style.backgroundColor=column0.style.backgroundColor="rgba(255,0,0,.3)"
 column0.onclick=pause.onclick=()=>{moving=!moving;if(moving)pause.textContent='移動中';else pause.textContent='已暫停'}
 document.getElementById("docs-chrome").style.display="none"
 document.querySelector('div[role="navigation"]').style.display="none"
 const scrollbar=document.querySelector('.native-scrollbar.native-scrollbar-x')
 setInterval(()=>{if(!moving)return
  scrollbar.scrollLeft+=direction
  if(scrollbar.scrollLeft+scrollbar.clientWidth>=scrollbar.scrollWidth-1)delay(-1)
  else if(scrollbar.scrollLeft<=1)delay(.8)
 },40)
},3000)

function delay(d){//邊緣延遲
 direction=0
 setTimeout(()=>direction=d,d<0?15000:5000)
}