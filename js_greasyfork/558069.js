// ==UserScript==
// @name         Answer Grabber
// @namespace    http://tampermonkey.net/
// @version      2024-09-20
// @description  Revel answers to questions on your Ximera homework
// @author       PsychedelicPalimpsest
// @match        *://ximera.osu.edu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=osu.edu
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558069/Answer%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/558069/Answer%20Grabber.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let lastInputCount = -1;

    const old_log = console.log;
    console.log = (arg) =>{
        old_log(arg);
        if (arg != "Recorded gradebook") return;
        let c = document.querySelectorAll("input[type=text]").length;
        if (c == lastInputCount) return;
        lastInputCount = c;


        document.head.innerHTML += "<style>.correct{background-color: green;}</style>";
        function stripr(str){
            let parcount = 0;
            for (let index in str){
                let c = str[index];
                if (c == "{")
                    parcount++;
                else if(c == "}")
                    parcount--;
                if (parcount == -1)
                    return str.substring(0, index);
            }
        }

        let texs = document.querySelectorAll("script[type='math/tex; mode=display']")
                .values()
                .toArray()
                .concat(
                    document.querySelectorAll("script[type='math/tex']")
                            .values()
                            .toArray()
                );
        for (let tex of texs){
            let answers = tex.innerText.matchAll(/\\answer/g).toArray();
            if (document.getElementById(tex.id + "-Frame") == undefined) continue;
            let boxes = document.getElementById(tex.id + "-Frame").querySelectorAll("input[type=text]")


            for (let i in answers){

                let astr = tex.innerText.substring(answers[i].index);
                let a = stripr(astr.substring(astr.match(/\{/).index+1));
                if (boxes[i] == undefined) break;
                boxes[i].value = a
            }
        }
    }


})();