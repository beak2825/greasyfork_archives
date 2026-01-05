// ==UserScript==
// @name         Jump to latest Google App Engine Console Page
// @namespace    http://erlichmen.gde
// @version      0.3
// @description  Whenever you are on an old Google App Engine Console page, this extesion will jump you to the new one.
// @author       erlichmen
// @match        https://appengine.google.com/*
// @match        https://console.developers.google.com/project/*
// @grant        none
// @locale en
// @downloadURL https://update.greasyfork.org/scripts/7202/Jump%20to%20latest%20Google%20App%20Engine%20Console%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/7202/Jump%20to%20latest%20Google%20App%20Engine%20Console%20Page.meta.js
// ==/UserScript==
function redirectFromOldToNew() {
    var newConsoleInvite = document.querySelectorAll(".ae-appbar-new-console-invite a");
    
    if (newConsoleInvite.length > 0) {
        newConsoleInvite = newConsoleInvite[0];
    } else {
        newConsoleInvite = null;
    }
    
    if (newConsoleInvite) {
        function launch(seconds, text, newConsoleInvitecallback, callback) {
            var updateCaption = function() {
                newConsoleInvite.text = text + " (" + seconds + ")"; 		        
            };
            
            var countDownId = setInterval(function() {
                updateCaption();    
                if (seconds === 0){
                    clearInterval(countDownId);
                    callback();          
                }
                seconds--;
            }, 1000);
            
            updateCaption();        
            
            return countDownId;
        }
        
        var originalText = newConsoleInvite.text;
        countDownId = launch(5, newConsoleInvite.text, newConsoleInvite, function() {
            window.location.href = newConsoleInvite.href;
        });
        
        var cancelBtn  = document.createElement ("a");
        cancelBtn.href = "javascript:void(0)";
        cancelBtn.text = "Cancel";
        
        newConsoleInvite.parentNode.appendChild(cancelBtn);    
        
        cancelBtn.onclick = function(e) {            
            clearInterval(countDownId);
            newConsoleInvite.text = originalText;
            newConsoleInvite.parentNode.removeChild(cancelBtn);    
            return false;
        };    
    }
}

function tryBetterDocumentTitle() {
    function changeDocTitle(event) {      
        console.log(event);
        var re = /^.*?console.developers.google.com\/project\/(.*?)\/.*$/,
            match = re.exec(window.location.href);
        
        if (match) {
            document.title = match[1] + " - " + document.title;        
        } else {
            var re = /^.*?console.developers.google.com\/project\/(.*)$/,
                match = re.exec(window.location.href);

            if (match) {
                document.title = match[1] + " - " + document.title;        
            }
        }
    }
    
    changeDocTitle();
}

redirectFromOldToNew();
tryBetterDocumentTitle();