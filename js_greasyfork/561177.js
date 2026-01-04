// ==UserScript==
// @name         PBE Quiz Engine Script
// @namespace    http://tampermonkey.net/
// @version      2026-01-03
// @description  Making PBE Quiz Engine use smoother
// @author       You
// @match        https://pbequizengine.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pbequizengine.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561177/PBE%20Quiz%20Engine%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/561177/PBE%20Quiz%20Engine%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    pbeqe.keyboardEvent=null;
    pbeqe.gestureEvent=null;
    window.addEventListener("beforeunload", (e) => {
        e.preventDefault();
        e.returnValue="";
    });
    var nums=[1,2,3,4,5,6,7,8,9,0];
    function numTrickS(){
        document.activeElement.value="";
        for(var i=0; i<(document.activeElement.maxLength/2); i++){
            if(i<10){
                document.activeElement.value+=nums[i];
            }else{
                document.activeElement.value+=nums[i-10];
            };
        };
    };
    function numTrickA(){
        var div=document.createElement("div");
        div.innerHTML="&nbsp"+(document.activeElement.maxLength/2)+" Letters&nbsp";
        div.style.position="fixed";
        div.style.backgroundColor="gray";
        div.style.border="solid";
        div.style.opacity="0.9px";
        div.style.left=(document.activeElement.offsetLeft+document.getElementById("testBLOCK").offsetLeft)+"px";
        div.style.top=(document.activeElement.offsetTop+document.getElementById("testBLOCK").offsetTop)+"px";
        document.body.appendChild(div);
        setTimeout(()=>{document.body.removeChild(div)}, 2000)
    };
    var triggered=false;
    document.addEventListener("keydown", (e)=>{
        if(e.key=="n"&&e.altKey&&triggered==false){
            e.preventDefault();
            numTrickS();
            numTrickA();
            triggered=true;
        };
    });
    document.addEventListener("keyup", (e)=>{
        if(e.key=="n"){
            e.preventDefault();
            triggered=false;
        };
    });
})();