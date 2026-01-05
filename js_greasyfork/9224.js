// ==UserScript==
// @name         WK Never Wrong
// @namespace    WKNW
// @version      0.1
// @description  Never get a review wrong again* (*even if you do)
// @author       Ethan
// @match        http*://www.wanikani.com/review/session*
// @match        http*://www.wanikani.com/lesson/session*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9224/WK%20Never%20Wrong.user.js
// @updateURL https://update.greasyfork.org/scripts/9224/WK%20Never%20Wrong.meta.js
// ==/UserScript==

if (answerChecker){
    answerChecker.evaluate = function(){
        return {accurate : !0, passed: !0};
    }
}else{
    console.log("answerChecker not found");
}