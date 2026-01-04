// ==UserScript==
// @name         Word shortener
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Type abbreviations & press the right shift to run the script.
// @author       Cvetocheckcactus
// @match        https://*.bloxd.io/*
// @icon         none
// @grant        none
// @license      CCO
// @downloadURL https://update.greasyfork.org/scripts/555342/Word%20shortener.user.js
// @updateURL https://update.greasyfork.org/scripts/555342/Word%20shortener.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let definitions=[{"letters":{"r":"Red ","b":"Blue ","y":"Yellow ","g":"Green "},"paths":[{"letters":{"a":"is at the base","m":"is in the map center","l":"is low"}}]}]
    let chatEl;
    console.log("XD")
    let listenerEl=document
    listenerEl.addEventListener("keydown", (e)=>{
        if (e.code=="ShiftRight") {
            chatEl=document.querySelector(".ChatInput")
            convert(chatEl.value,chatEl)


        }
    },true)
    function convert(t,chat){
        console.log("Chat element passed is ", chat)
        console.log("Text passed is", t)
        if (t.length<1) return
        let fs = "" //final string
        let ready=false
        let symbol=0
        let cur=definitions
        while (!ready){
            let possible = cur.filter(el => Object.keys(el.letters).includes(t[symbol]));
            console.log("possible elements:",possible)
            if (possible.length>0){
                fs+=possible[0].letters[t[symbol]]

            } else return
            if (t.length==symbol || !possible[0].paths) ready = true
            cur=possible[0].paths ? possible[0].paths : null
            symbol+=1
        }
        chat.value=fs



    }
})();