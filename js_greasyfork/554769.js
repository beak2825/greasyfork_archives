// ==UserScript==
// @name         WaniKani Kanji On'yomi Only
// @author       SiLeVoL
// @match        https://www.wanikani.com/*
// @match        http://www.wanikani.com/*
// @description  A userscript for wanikani that makes you able to write on'yomi for kanji that normally test for kun'yomi.
// @version      0.1.2
// @run-at       document-end
// @grant        none
// @license      GPL v3.0
// @namespace kanjionyomionly


// @downloadURL https://update.greasyfork.org/scripts/554769/WaniKani%20Kanji%20On%27yomi%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/554769/WaniKani%20Kanji%20On%27yomi%20Only.meta.js
// ==/UserScript==
(function() {
    //'use strict';
    /*
    */
    const alsoAcceptKunyomi = false;

    /* global Stimulus */
    function newPageLoaded(pageLoadEvent) {

        var uri;
        if (pageLoadEvent) {
            uri = pageLoadEvent.target.baseURI;
        } else {
            uri = document.URL;
        }
        console.log('onyomi found new page:' +uri);
        if (/subjects\/review/.test(uri) || /subject-lessons.*\/quiz/.test(uri) || /extra_study/.test(uri) || /recent-mistakes/.test(uri)) {
            console.log('kunyomi quiz page');
            // ***************** QUIZ *****************
            var isCurrentQuestionKunyomi = false;
            var isCurrentQuestionKanji = false;
            var currentKunyomi = [];
            var currentOnyomi = [];
            var isFirstRun = true;
            var newQuestion = function (e) {
                if (isFirstRun) {
                    console.log('kunyomi first run on quiz page, inserting data')
                    isFirstRun = false;
                    if (alsoAcceptKunyomi) {
                        let answerChecker = Stimulus.controllers.find(c => c.answerChecker).answerChecker;
                        answerChecker.oldOldEvaluate = answerChecker.evaluate;
                        answerChecker.evaluate = function({questionType: qtype, response: answer, item: subject, userSynonyms: synonyms, inputChars: inputs}) {
                            if(isCurrentQuestionKunyomi && currentOnyomi.length !== 0) {
                                if (currentOnyomi.some(e => e.text == answer)) {
                                    console.log("accepted onyomi in kunyomi quiz");
                                    return answerChecker.oldOldEvaluate({questionType: qtype, response: currentKunyomi[0].text, item: subject, userSynonyms: synonyms, inputChars: inputs});
                                }
                            }
                            return answerChecker.oldOldEvaluate({questionType: qtype, response: answer, item: subject, userSynonyms: synonyms, inputChars: inputs});
                        };
                    }
                } // end first run

                if (e.detail.subject.type == 'Kanji') {
                    isCurrentQuestionKanji = true;
                    if (e.detail.subject.primary_reading_type == "kunyomi" && e.detail.questionType == "reading") {
                        isCurrentQuestionKunyomi = true;
                        currentKunyomi = e.detail.subject.readings.filter(reading => (reading.kind == "primary" || reading.kind == "alternative") && reading.type == "kunyomi");
                        currentOnyomi = e.detail.subject.readings.filter(reading => (reading.kind == "primary" || reading.kind == "alternative") && reading.type == "onyomi");
                        if (!alsoAcceptKunyomi && currentOnyomi.length !== 0) {
                            e.detail.subject.primary_reading_type = "onyomi";
                        }
                        console.log("kunyomi for current question");
                    } else {
                        isCurrentQuestionKunyomi = false;
                    }
                } else {
                    isCurrentQuestionKanji = false;
                    isCurrentQuestionKunyomi = false;
                }
            }

            window.addEventListener('willShowNextQuestion', newQuestion);
            //window.addEventListener('turbo:frame-load', itemInfoExpand);
            //window.addEventListener('didAnswerQuestion', newQuestion);

            // ********* END QUIZ *****************
        }
    } // main function end

    document.addEventListener('turbo:before-render', newPageLoaded);
    //-- Helper functions --//

    function replaceAt(s, n, t)
    {
        return s.substring(0, n) + t + s.substring(n + 1);
    }

    function observeDOM() {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
            eventListenerSupported = window.addEventListener;
        return function(obj, callback){
            if( MutationObserver ) {
                // define a new observer
                var obs = new MutationObserver(function(mutations, observer) {
                    if( mutations[0].addedNodes.length ) {
                        callback();
                    }
                });
                // have the observer observe foo for changes in children
                if (obj) {
                    obs.observe( obj, {childList:true, subtree:true, attributes:false });
                } else {
                    console.trace('Unable to observe changes in DOM for Kanji Onyomi Only');
                }
            }
            else if( eventListenerSupported ) {
                obj.addEventListener('DOMNodeInserted', callback, false);
                obj.addEventListener('DOMNodeRemoved', callback, false);
            }
        };
    }

    function observeDOMForAttributes() {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
            eventListenerSupported = window.addEventListener;
        return function(obj, callback){
            if( MutationObserver ) {
                // define a new observer
                var obs = new MutationObserver(function(mutations, observer) {
                    callback();
                });
                // have the observer observe foo for changes in children
                if (obj) {
                    obs.observe( obj, {childList:true, subtree:true, attributes:true });
                } else {
                    console.trace('Unable to observe changes in DOM for Kanji Onyomi Only');
                }
            }
            else if( eventListenerSupported ) {
                obj.addEventListener('DOMNodeInserted', callback, false);
                obj.addEventListener('DOMNodeRemoved', callback, false);
            }
        };
    }
    newPageLoaded();
})();