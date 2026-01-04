// ==UserScript==
// @name         四川学法练习题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  打开练习题页面使用
// @author       kimi
// @match        https://www.scxfks.com/study/activity/question*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555680/%E5%9B%9B%E5%B7%9D%E5%AD%A6%E6%B3%95%E7%BB%83%E4%B9%A0%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/555680/%E5%9B%9B%E5%B7%9D%E5%AD%A6%E6%B3%95%E7%BB%83%E4%B9%A0%E9%A2%98.meta.js
// ==/UserScript==

(function(){
    'use strict';
    function getAnswer(){
        const scripts=document.querySelectorAll("script");
        const script=scripts[scripts.length-1];
        if(script){
            const answer=script.textContent.match(/answer = '.+'/)[0].match(/[A-Z]/g);
            // ['A']  ['A','B'] ['V'] ['X']
            console.log(answer);
            //alert(answer);
            return answer;
        }else{
            setTimeout(1000,getAnswer);
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async  function selectAnswer(answer){
        const answersDom=document.querySelector('.questions').querySelector('.options').querySelector('.options').querySelectorAll('label');
        console.log("answersDom:",answersDom);
        const options=['A','B','C','D','E','F','G']
        let select=[]
        if(answer.length==1&&(answer[0]=='V'||answer[0]=='X')){
            if(answer[0]=='V'){select=[0]}
            if(answer[0]=='X'){select=[1]}
        }else{
            select=answer.map(ch=>options.indexOf(ch));
        }
        console.log("select:",select)
        for(let i=0;i<select.length;i++){
            answersDom[select[i]].click()
        }
        document.querySelector('.question-btn').querySelector('.confirm').click()
        const nextbtn=document.querySelector('.question-btn').querySelector('.next')
        await sleep(1000)
        if(nextbtn.style.display=='inline'){nextbtn.click()}
    }

    window.addEventListener('load', () => {
        const answer=getAnswer()
        selectAnswer(answer);
    })
})();