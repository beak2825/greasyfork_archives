// ==UserScript==
// @name         抖音瀑布优化
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  优化抖音瀑布体验
// @author       JMRY
// @match        https://www.douyin.com/*
// @match        https://*.douyin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552135/%E6%8A%96%E9%9F%B3%E7%80%91%E5%B8%83%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/552135/%E6%8A%96%E9%9F%B3%E7%80%91%E5%B8%83%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

/*
1.1 20251009
- 加入自定义css功能。
1.0
- 实现基本功能。
*/

let customStyles=`
#video-info-wrap{
	display:none !important;
}
input[data-e2e='searchbar-input']::placeholder{
	color:transparent !important;
	text-shadow:none !important;
}
div:has(+ input[data-e2e='searchbar-input']){
	opacity:0 !important;
}
.immersive-player-switch-on-hide-interaction-area{
    display:none !important;
}
`;

(function() {
    'use strict';
    let isRunning=false;
    let timeout;
    async function wait(s){
        clearTimeout(timeout);
        return new Promise(resolve=>{
            timeout=setTimeout(()=>resolve(),s);
        });
    }
    let interval;
    async function waitElement(elid){
        clearInterval(interval);
        return new Promise((resolve)=>{
            interval=setInterval(()=>{
                let el=document.querySelector(elid);
                if(el){
                    console.log(`Found Element.`);
                    resolve(el);
                    clearInterval(interval);
                }
            },500);
        });
    }
    async function main(){
        await waitElement(`#waterFallScrollContainer`);
        let div=document.querySelectorAll(`div`);
        for(let i=0; i<div.length; i++){
            let cur=div[i];
            if(cur && cur.id && cur.id.startsWith(`waterfall_item_`) && !cur.binded){
                let vid=cur.id.split(`_`).at(-1);
                let url=`https://www.douyin.com/video/${vid}`;
                cur.addEventListener(`mousedown`,function(e){
                    if (e.button === 1) {
                        window.open(url);
                    }
                });
                cur.binded=true;
            }
        }
        console.log(`inserted.`);
    }
    function insertStyles(){
        let styleEl=document.querySelector(`#style`);
        try{
            if(styleEl){
                document.head.removeChild(styleEl);
            }
        }catch(e){}
        styleEl=document.createElement(`style`);
        styleEl.id=`style`;
        styleEl.innerHTML=customStyles;
        document.head.appendChild(styleEl);
        console.log(`Style applied.`);
    }
    async function run(){
        if(!isRunning){
            isRunning=true;
            while(true){
                await main();
                await wait(1000);
            }
        }
    }
    window.onload=async function(){
        insertStyles();
        run();
    }
    run();
})();