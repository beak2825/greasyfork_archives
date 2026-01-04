// ==UserScript==
// @name         Puzzle duel: Share message
// @namespace    http://tampermonkey.net/
// @version      2025-11-24
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

    function addButton(startButton){
        let frame=startButton.parentElement.parentElement.parentElement.parentElement;
        let voteModal=startButton.previousElementSibling;
        let voteFooter=voteModal.children[0].children[0].children[2];
        voteFooter.innerHTML='<button type="button" class="btn btn-info">Share</button>'+voteFooter.innerHTML;
        let shareButton=voteFooter.children[0];
        let errorCount=-1;
        let checkButton=startButton.parentElement.parentElement.nextElementSibling.nextElementSibling.children[0].children[0];
        checkButton.addEventListener('click',()=>{errorCount+=1;})
        function generateShareMessage(){
            let context=frame.id.replace('Controls','');
            if(context) context=`[${context[0].toUpperCase()}${context.slice(1)}] `;
            let puzzleType=frame.children[0].children[0].innerText;
            let size=frame.nextElementSibling.nextElementSibling.nextElementSibling.innerText.match(/dimension\: \"(.*)\"/)[1];
            let time=frame.children[2].children[2].children[0].children[1].innerText;
            let err=errorCount==0?"":` (${errorCount} error${errorCount==1?'':'s'})`;
            let link=window.location.href;
            return `${context}${puzzleType} (${size}): ${time}${err}\n${link}`;
        }
        shareButton.onclick=()=>{
            let message=generateShareMessage();
            navigator.clipboard.writeText(message);
            shareButton.innerText='Copied!';
            setTimeout(()=>{shareButton.innerText='Share';},1500);
        }
    }
    let interval=1000,tries=20;
    function tryAddButton(remain){
        if(remain==0) return;
        let arr=document.getElementsByName('startBtn');
        if(arr.length>0){
            for(let i of arr) addButton(i);
        }
        else setTimeout(()=>{tryAddButton(remain-1);},interval);
    }
    tryAddButton(tries);
})();