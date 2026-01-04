// ==UserScript==
// @name         YTyping kpm → 打/秒
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  kpmを打/秒に変更
// @author       You
// @match        https://ytyping.net/*
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ytyping.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550839/YTyping%20kpm%20%E2%86%92%20%E6%89%93%E7%A7%92.user.js
// @updateURL https://update.greasyfork.org/scripts/550839/YTyping%20kpm%20%E2%86%92%20%E6%89%93%E7%A7%92.meta.js
// ==/UserScript==
let flag = false;

function a(){
    console.log("kpm → 打/秒");
    let content = document.getElementById("typing_card")?.children[1];

    if(content){
        let contentObserver = new MutationObserver(() => {
            if(!document.getElementById("line_speed")){
                let line_kpm = document.getElementById("playing_notify").nextElementSibling.children[0];
                let type_kpm = document.getElementById("kpm").children[2];
                let next_kpm = document.getElementById("next_kpm");

                line_kpm.style.display = "none";
                type_kpm.style.display = "none";
                next_kpm.style.display = "none";

                line_kpm.nextElementSibling.style.display = "none";

                document.getElementById("kpm").children[0].textContent = "kps";

                line_kpm.insertAdjacentHTML("afterend", "<span id='line_speed'>0.00打/秒</span>");
                type_kpm.insertAdjacentHTML("afterend", "<span id='type_speed'>0.00</span>");
                next_kpm.insertAdjacentHTML("afterend", `<span id='next_speed' style='font-size: 90%'>${(next_kpm.textContent.replace(/\D/g,"") / 60).toFixed(2) !== "0.00" ? "NEXT: " + (next_kpm.textContent.replace(/\D/g,"") / 60).toFixed(2) + "打/秒" : ""}</span>`);



                let lineObserver = new MutationObserver(()=>{
                    let lineSpeed = (line_kpm.textContent / 60).toFixed(2);
                    document.getElementById("line_speed").textContent = lineSpeed + "打/秒";
                });

                lineObserver.observe(line_kpm, {characterData: true, subtree: true});

                let typeObserver = new MutationObserver(()=>{
                    let typeSpeed = (type_kpm.textContent / 60).toFixed(2);
                    document.getElementById("type_speed").textContent = typeSpeed;
                })

                typeObserver.observe(type_kpm,{characterData: true, subtree: true});

                let nextObserver = new MutationObserver(()=>{
                    let typeSpeed = (next_kpm.textContent.replace(/\D/g,"") / 60).toFixed(2);
                    document.getElementById("next_speed").textContent = typeSpeed !== "0.00" ? "NEXT: " + typeSpeed + "打/秒" : "";
                })

                nextObserver.observe(next_kpm,{characterData: true, subtree: true});
            }
        })

        contentObserver.observe(content,{childList: true});
    }
}

a();



const originalPushState = history.pushState;
history.pushState = function (...args) {
    originalPushState.apply(this, args);

    let flag = false;
    let intervalCount = 0;
    const interval = setInterval(()=>{
        if(intervalCount < 10){
            if(!flag && !document.getElementById("line_speed") && document.getElementById("typing_card")?.children[1]){
                a();
                flag = true;
            }
            intervalCount++
        } else {
            clearInterval(interval);
        }
    },100)
};