// ==UserScript==
// @name         ウェブ魚拓 Clicker
// @namespace    http://tampermonkey.net/
// @version      2025-09-18_14h53m
// @description  Click 「取得」 Button
// @author       Jeff Huang
// @match        https://megalodon.jp/pc/main?url=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549910/%E3%82%A6%E3%82%A7%E3%83%96%E9%AD%9A%E6%8B%93%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/549910/%E3%82%A6%E3%82%A7%E3%83%96%E9%AD%9A%E6%8B%93%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let next = GetTarget(document.querySelectorAll('.row.pt-3'), 'h4', " 取得済みの魚拓");
    next = next.nextElementSibling;
    if (next && next.classList.contains('row') && !next.querySelector('a')){
        console.log("Ready to archive this");
        let btn = document.getElementById("submitButton1");
        let flag = true;
        let intervalId = setInterval(() => {
            if(btn && !btn.disabled && flag)
            {
                   flag = false;
                   btn.click();
            }
            if(!flag)
            {
                clearInterval(intervalId);
                console.log("Processing eliminated!");
            }
        }, 500);
    }
    console.log("This page has been archived!");

    function GetTarget(elem, child, txt){
        for(const el of elem){
            let ch = el.querySelector(child);
            if(!ch) continue;
            if(ch.textContent !== txt) continue;
            //console.log("Find text: " + ch.textContent);
            return el;
        }
    }
})();