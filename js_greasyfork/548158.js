// ==UserScript==
// @name Auto Claim Faucet CoinADster 2025
// @namespace FXVNPRo Scripts
// @match https://coinadster.com/*
// @grant none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version 1.0
// @description Auto claim faucet with captcha sloved
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548158/Auto%20Claim%20Faucet%20CoinADster%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/548158/Auto%20Claim%20Faucet%20CoinADster%202025.meta.js
// ==/UserScript==

window.onload = function() {
    
    setTimeout(function() {
        
        var observer = new MutationObserver(function(mutationsList, observer) {
            
            var claimButton = document.querySelector('button[name="claim_faucet"]');
            
            if (claimButton) {
                
                claimButton.click();
                
                
                
                observer.disconnect();
            }
        });

        
        observer.observe(document.body, { childList: true, subtree: true });

        
        var claimButton = document.querySelector('button.btn.btn-primary.btn-lg.btn-block.mt-3');
        
        if (claimButton) {
            claimButton.click();
            
        } else {
            console.log("Not found");
        }
    }, 15000);
};