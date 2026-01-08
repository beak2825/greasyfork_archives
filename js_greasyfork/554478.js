// ==UserScript==
// @name         Puzzle duel: Share message
// @namespace    http://tampermonkey.net/
// @version      2026-01-08
// @description  Add a share button in the pop-up modal after finishing a puzzle.
// @author       WYXkk
// @match        https://puzzleduel.club/
// @match        https://puzzleduel.club/single/*
// @icon         https://puzzleduel.club/images/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554478/Puzzle%20duel%3A%20Share%20message.user.js
// @updateURL https://update.greasyfork.org/scripts/554478/Puzzle%20duel%3A%20Share%20message.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addButton(puzzle){
        let voteSave=document.querySelector(puzzle.controls.voteSave);
        const shareButton=document.createElement('button');
        shareButton.type='button';
        shareButton.className='btn btn-info';
        shareButton.textContent='Share';
        voteSave.before(shareButton);
        let error=0;
        let originalError=puzzle.showError;
        puzzle.showError=function(...args){
            error+=1;
            return originalError.apply(this,args);
        }
        function generateShareMessage(){
            let context=puzzle.controls.card.slice(1,-8);
            if(context) context=`[${context[0].toUpperCase()}${context.slice(1)}] `;
            let puzzleType=document.querySelector(puzzle.controls.card).children[0].children[0].innerText;
            let size=puzzle.dimension;
            let time=document.querySelector(puzzle.controls.timer).innerText;
            let err=error==0?"":` (${error} error${error==1?'':'s'})`;
            let link=window.location.href;
            return `${context}${puzzleType} (${size}): ${time}${err}\n${link}`;
        }
        shareButton.addEventListener('click',()=>{
            let message=generateShareMessage();
            navigator.clipboard.writeText(message);
            shareButton.innerText='Copied!';
            setTimeout(()=>{shareButton.innerText='Share';},1500);
        })
    }

    function prework(){
        let originalStart=basePuzzle.prototype.start;
        basePuzzle.prototype.start=function(...args){
            addButton(this);
            return originalStart.apply(this,args);
        }
    }
    let timer=setInterval(()=>{
        if(basePuzzle){
            if(basePuzzle.prototype.start){
                clearInterval(timer);
                prework();
            }
        }
    },100);
})();