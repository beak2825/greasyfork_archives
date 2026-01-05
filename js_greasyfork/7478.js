// ==UserScript==
// @name         WK But No Cigar
// @namespace    http*//www.wanikani.com/review/session
// @version      0.10.0
// @description  Stops Wanikani from marking answers that are 'a bit off' as correct, makes you try again until you are right or wrong.
// @author       Ethan
// @include        http*://www.wanikani.com/review/session*
// @include        http*://www.wanikani.com/lesson/session*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7478/WK%20But%20No%20Cigar.user.js
// @updateURL https://update.greasyfork.org/scripts/7478/WK%20But%20No%20Cigar.meta.js
// ==/UserScript==

function main(){

    // Toggle console outputs
    var logOutput = false;
    var log = function(){
        if (logOutput){
            return console.log.apply(console, arguments);
        }
    };

var alertText = "Close, but no cigar! Please try again";

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    wrapAnswerCheckerEvaluate();
    
    function logMutations(){
        
        var observer = new MutationObserver(function (mutations) {
            // iterate over mutations..
            mutations.forEach(function (mutation) {
                if (mutation.addedNodes.length>0){
                    if(mutation.addedNodes.item(0).classList){
                        if(mutation.addedNodes.item(0).classList.contains("answer-exception-form")){
                            mutation.addedNodes.item(0).innerHTML=mutation.addedNodes.item(0).innerHTML.replace(/WaniKani is looking for the [a-zA-Z']+ reading/, alertText);
             observer.disconnect();
                            
                        }}
                }
                
                
                
            });
                           
            var highLanders = document.querySelectorAll("#answer-exception");
            if (highLanders.length > 1){ // There can be only one!!!
                for (var hL=1; hL<highLanders.length; hL++){
                    highLanders[hL].parentNode.removeChild(highLanders[hL])
                }
            }
            
            
        });
        
        var settings = { 
            childList: true, subtree: true, attributes: false, characterData: false 
        }
        
        observer.observe(document.body, settings);
    }
    
    // select the target node

    /** Wraps the answerChecker's evaluate method in a shim
    */
    function wrapAnswerCheckerEvaluate(){
        answerChecker.oldEvaluate = answerChecker.evaluate;
        //stops the code from submitting the answer
        log("wrap answerChecker.evaluate");
        answerChecker.evaluate = function(e,t,n){
            var result = answerChecker.oldEvaluate(e,t,n);
            if (result.passed === !0 && result.accurate === !1){
                result.exception = !0;
                
                logMutations();
                
            }
            return result;
        };
        
    }    
    
    
}      

var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ main +')();'));
(document.body || document.head || document.documentElement).appendChild(script);