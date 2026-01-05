// ==UserScript==
// @name         WK Do You Even Kana?
// @namespace    WKDYEK
// @version      0.12.1
// @description  check that the okurigana matches the answer.
// @author       Ethan
// @include      http*://www.wanikani.com/subjects/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/9826/WK%20Do%20You%20Even%20Kana.user.js
// @updateURL https://update.greasyfork.org/scripts/9826/WK%20Do%20You%20Even%20Kana.meta.js
// ==/UserScript==


//patchy patch. 9-5-2023



var alertText = "Bro, Do you even Kana?";

// Hook into App Store
try { $('.app-store-menu-item').remove(); $('<li class="app-store-menu-item"><a href="https://community.wanikani.com/t/there-are-so-many-user-scripts-now-that-discovering-them-is-hard/20709">App Store</a></li>').insertBefore($('.navbar .dropdown-menu .nav-header:contains("Account")')); window.appStoreRegistry = window.appStoreRegistry || {}; window.appStoreRegistry[GM_info.script.uuid] = GM_info; localStorage.appStoreRegistry = JSON.stringify(appStoreRegistry); } catch (e) {}

//Create regex profiles (katakana matches need hiragana counterparts included)
/** Prepends Hiragana counterpart to any Katakana string input
* @param {String} char - A one character long string that may be a Katakana character
* @returns {String} A single character if the input is Hiragana or "ー"; A two character string of (hopefully) Hiragana-Katakana pairs in square brackets (that can form a regex) if not.
* @bug Will attempt to pair any character that is not Hiragana or "ー"
*/
function pairKatakana(char){
    if (/^[\u3040-\u309fー]$/.test(char)){//is char hiragana or "ー"?
        return char;
    }else{
        //set up pairs
        var offset = -6*16; //katakana block: 30a0-30ff
        var katakana = String.fromCharCode(char.charCodeAt(0) + offset);
        return "["+char+katakana+"]";
    }
}

/** Returns true if the character is Kana
*/
function isKana(char){
    return /^[\u3040-\u30ff]$/.test(char);
}

/** Creates regex from a vocabulary item that matches the Kana in that item.

*/
function makeRegex(cV){
    var r = "^"; //start the regex string
    for (var c = 0; c < cV.length; c++){
        if (isKana(cV[c])){
            r += pairKatakana(cV[c]);
        }
        else{//we have a non-kana character
            if (cV[c] !== "〜"){ //I doubt WK will be adding Kana suffixes but just covering all the bases to be safe.
                r += "(.+)"; // unknown number of characters in reading (corresponding to kanji), capturing in groups for versatility
                while ((c < cV.length)&&!isKana(cV[c+1])){
                    c++;//skip non-kana characters (already have ".+" in our regex, do not need to add more)
                }
            }
        }
    }
    r += "$";// End of regex
    return new RegExp(r);
}

//Get answerChecker Object
//Stimulus.controllers.filter((x)=>{return x.answerChecker;})[0]
var getAnswerChecker = function(timeout) {
    var start = Date.now();

    function waitForAnswerChecker(resolve, reject) {
        if (typeof Stimulus !=='undefined' && Stimulus.controllers.filter((x)=>{return x.answerChecker;})[0]){
            var answerChecker = Stimulus.controllers.filter((x)=>{return x.answerChecker;})[0].answerChecker;
            resolve(answerChecker);
        }
        else if (timeout && (Date.now() - start) >= timeout)
            reject(new Error("timeout"));
        else
            setTimeout(waitForAnswerChecker.bind(this, resolve, reject), 30);
    }



    return new Promise(waitForAnswerChecker);


};


/** @typedef Evaluation
* @property {boolean} [accurate] - If true, the answer matched one of the possible answers
* @property {boolean} [exception] - If true, the exception animation will run and the answer will not be processed.
* @property {boolean} [multipleAnswers] - If true, Wanikani has more than one correct answer for the ReviewItem, a notification will be shown saying this.
* @property {boolean} [passed] - If true, The answer is determined to be close enough to pass. In the case that accurate is false, the answer will pass with a notification to check your answer.
*/
/** Can be either a meaning or a reading
* @typedef Assignment
* @property {string}
*/
var dyek = function(answerChecker){
    //console.log("main function loading");
    //Get the answerChecker object out of Stimulus Controllers
    //var quizController = Stimulus.controllers.filter((x)=>{return x.answerChecker;})[0];
    //var answerChecker = quizController&&quizController.answerChecker;

    //Boy, I do love to wrap this function don't I?
    answerChecker.oldEvaluate = answerChecker.evaluate.bind(answerChecker);
    /** New evaluate function to send an exception if it doesn't meet our requirements
* @param
* @param
* @returns {Evaluation}
*/

    /* April 2023 evaluate now takes an object as its only argument
    {
            questionType: this.currentQuestionType,
            response: e,
            item: this.currentSubject,
            userSynonyms: t,
            inputChars: this.inputChars
        }
    */
    answerChecker.evaluate = function(e,n,i,t){

        var getQuestionType = function(){
            return e.questionType; //this.currentQuestionType?
            //return $(".quiz-input__question-type").innerHTML.toLowerCase();
        };
        var getQuestionCategory = function(){
            return e.item.type.toLowerCase();
            //return i.subject_category.toLowerCase();
            //return $(".quiz-input__question-category").innerHTML.toLowerCase();
        };
        var isVoc = (() => {return getQuestionCategory() === 'vocabulary';})();

        var getCurrentItem = function(){
            return e.item.characters;
            //return answerChecker.currentSubject.characters;
        };

        var getResponse = function(){
            return e.response;
        };

        //jStorage no longer used in WaniKani
        /** @type {string} */
        var questionType = getQuestionType();
        /** @type {ReviewItem} */
        var cI = getCurrentItem();
        // If cI is vocabulary
        if (isVoc&&
            // is a reading
            questionType === "reading"&&
            // and doesn't pass regex
            !makeRegex(cI).test(getResponse())){
            //If it's a reading and it doesn't pass regex
            return {
              action: 'retry',
              message: {
                text: alertText,
                type: 'answerException',
              },
            };
        }else{
            return answerChecker.oldEvaluate(e,n,i,t);
        }
    };

};

getAnswerChecker(60000).then(dyek);

//import('lib/answer_checker/answer_checker').then(dyek);

//window.addEventListener('load', dyek, false);