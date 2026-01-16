// ==UserScript==
// @name         Kahooter
// @namespace    http://tampermonkey.net/
// @version      2026-01-15
// @description  f - find, q - load, h - highlight, a - alert
// @author       Max
// @match        *://kahoot.it/*
// @icon         data:image/vnd.microsoft.icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAACMuAAAjLgAAAAAAAAAAAACeADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/nQA1/58FOf+hCT3/nQA0/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+oGkr/04uj/+Gwwf+4Q2v/oAQ6/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANf+dADP/nQA0/50ANP+dADX/ngA2/54ANv+eADb/ngA2/54ANf+dADT/nQA0/50ANP+eADb/ngA2/54ANv+eADX/ogo+/96pvP////////////Hb4/+sI1L/nQA0/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+dADT/rCVU/8t2k//Of5r/0omi/8RjhP+fAzj/ngA2/54ANv+dADT/ry5a/9SOpf/VkKf/1I2l/68tWv+dADT/ngA2/54ANv+eATb/1I2l////////////5brI/6ILP/+eADX/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/5wAM/++VHj//v39////////////4rLC/6AEOf+eADb/ngA2/50ANP/Of5r////////////36e7/sC5b/50ANP+eADb/ngA2/50ANP+wMVz/47XE/+fAzf/BXX//nQA0/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/nAAz/75TeP/+/f3////////////hsMH/oAQ5/54ANv+eADX/ogo+/+W7yf///////////+e/zP+iDD//ngA1/54ANv+eADb/ngA2/54BN/+hCT3/ogo+/58EOP+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+cADP/vlN4//79/f///////////+GvwP+fBDn/ngA2/50ANP+vLFj/9ufs////////////0YWf/50ANP+eADb/ngA2/54ANv+eADb/ngA2/58CN/+rIlD/nwQ5/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/5wAM/++U3j//v39////////////4K6//58EOf+eADb/nAAz/8Njg//+/v7///////z3+f+6SnD/nQAz/54ANv+eADb/ngA2/54ANv+eADb/ogs//8lxj/+jDED/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/nAAz/75TeP/+/f3////////////grb7/nwM5/54ANv+fAjj/26G1////////////8dri/6kdTf+dADX/ngA2/54ANv+eADb/ngA2/50ANP+rIVD/4rPD/6gZSv+dADX/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+cADP/vlN4//79/f///////////+Ctv/+fBDj/nQA0/6gaSv/v1t7////////////eqrv/oAQ5/54ANv+eADb/ngA2/54ANv+eADb/nQAz/7lGbf/z4ef/ry1a/50ANP+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/5wAM/++U3j//v39////////////8+Dn/7dDav+cADH/uUhu//z2+P///////////8htjP+dADP/ngA2/54ANv+eADb/ngA2/54ANv+dADP/y3aT//36+/+6SXD/nAAz/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/nAAz/75TeP/+/f3/////////////////8t3k/7hFbP/QhJ7////////////57vL/szdh/50ANP+eADb/ngA2/54ANv+eADb/ngA2/58DOf/eqLr//////8Zqif+cADP/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+cADP/vlN4//79/f//////////////////////9OLo//Ph5////////////+rJ1P+kEUP/ngA1/54ANv+eADb/ngA2/54ANv+dADX/phZH/+7S3P//////04yl/50ANP+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/5wAM/++U3j//v39////////////////////////////////////////////1pKp/54ANv+eADb/ngA2/54ANv+eADb/ngA2/50AM/+zOGL/+fDz///////grr//oAQ6/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/nAAz/75TeP/+/f3///////////////////////////////////////37/P++VXj/nAAz/54ANv+eADb/ngA2/54ANv+eADb/nAAz/8Rmhv///////////+vM1/+kEUP/ngA1/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+cADP/vlN4//79/f////////////fq7//47PD//////////////////fr7/8VoiP+dADT/ngA2/54ANv+eADb/ngA2/54ANv+eADb/2Jmu////////////9OPp/6wkUv+dADT/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/5wAM/++U3j//v39////////////47TE/8Jfgf/26O3/////////////////9ufs/7xOc/+dADT/ngA2/54ANv+eADb/ngA1/6QPQv/pxtL////////////78/b/tT5m/50AM/+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/nAAz/75TeP/+/f3////////////issL/nwY5/75TeP/15Or/////////////////8t7l/7ZAaP+dADT/ngA2/54ANv+dADT/rixY//bo7f////////////79/v/BXX//nAAz/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+cADP/vlN4//79/f///////////+Kzw/+gBDn/nQA1/7tMcv/z4Ob/////////////////7tPd/7EzXv+dADT/ngA2/5wAM/+/Vnr//vv8/////////////////85/mv+dADT/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/5wAM/++U3j//v39////////////4rPD/6AEOv+eADb/nQA0/7hFbP/x2+P/////////////////6sjU/64pV/+dADX/nQA0/9KJov//////////////////////3KK2/58BN/+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/nAAz/75TeP/+/f3////////////is8P/oAQ6/54ANv+eADb/nQA0/7U/Z//v1t/////////////+/P3/1pOq/6AGO/+hCDz/5brI///////////////////////nwc7/ogs//54ANf+eADb/ngA2/54ANv+eADb/ngA2/54ANv+cADL/vlR4//79/f///////////+Kzw/+gBDr/ngA2/54ANv+eADb/nQA0/7M5Yv/ows//4K2//8Faff+pHEz/ngA1/6shUP/z4Ob///////////////////////Hb4/+pHEz/nQA1/54ANv+eADb/ngA2/54ANv+eADb/ngA2/50ANP+0OWP/6cbS//js8P//////4rPD/6AFOv+eADb/ngA2/54ANv+eADb/nQE1/6USRP+hCDv/nQAz/50ANf+dADP/uUhv//z3+f//////////////////////+e/y/7I1X/+dADT/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54BN/+kD0L/sTBc/8Rkhf/EZIX/nwM5/54ANv+eADb/ngA2/54ANv+eADb/nQA1/54ANv+eADb/ngA2/50ANP/Mepb//////////////v7/+/P2//Pf5v/lusn/sTFd/50ANP+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANf+dADT/nAAz/54ANf+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/nwM4/9KKov/kusj/1I6m/8Rkhf+2Pmf/qh9P/6ILPv+eATf/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eATf/pBBC/6EIPP+dADX/nAAz/50AM/+dADT/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADX/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/ngA2/54ANv+eADb/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562809/Kahooter.user.js
// @updateURL https://update.greasyfork.org/scripts/562809/Kahooter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var code = "";
    var el = window;
    var eventName = 'keypress';
    var data;

    if (el.addEventListener) {
        el.addEventListener(eventName, keyListener, false);
    } else if (el.attachEvent) {
        el.attachEvent('on'+eventName, keyListener);
    }

    function keyListener(event){
        event = event || window.event;
        var key = event.key || event.which || event.keyCode;
        //console.log(key);
        if(key=="q"){
            loadQuiz();
        } else if((key=="a" || key=="h") && code!=""){
            try{
                findAnswer(key=="h");
            } catch {
                alert("No answer found");
            }
        } else if(key=="f"){
            var link =new URL("https://create.kahoot.it/search-results/kahoots?orderBy=relevance&inventoryItemId=ANY");
            link.searchParams.set('query', prompt("Name of your kahoot",""));
            window.open(link,"_blank").focus();
        }
    }

    async function loadQuiz(){
        code = prompt("Please enter quiz ID", code);
        const request = await fetch("https://create.kahoot.it/rest/kahoots/"+code+"/card/?includeKahoot=true");
        if(request.status==404){
            alert("Kahoot not found");
            code = "";
        } else {
            data = await request.json();
            console.log(data);
            alert("Loaded Kahoot: "+data.card.title);
        }
    }

    function findAnswer(highlight=false){
        const question = document.querySelectorAll('[data-functional-selector="question-index-counter"]')[0].innerHTML;
        const options = data.kahoot.questions[question-1].choices;
        var answers = [];
        var answerIDs = [];
        for(var id in options){
            var opt = options[id];
            if(opt.correct){
                console.log(opt.answer);
                answers.push(opt.answer);
                answerIDs.push(id);
            }
        }
        if(highlight){
            try{
                const buttons = document.querySelectorAll('button[data-functional-selector^="answer-"]');
                buttons[answerIDs[0]].style.border = "10px solid black";
            } catch {
                console.log("could not highlight");
                alert(answers[0]);
            }
        } else {
            alert(answers[0]);
        }
    }
})();