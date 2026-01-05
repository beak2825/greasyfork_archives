// ==UserScript==
// @name         Twitter Unfollower
// @version      0.5
// @description  Automatic Twitter unfollower tool. Last Update: 11-22-2014
// @author       ekin@gmx.us
// @namespace    https://greasyfork.org/en/users/6473-ekin
// @match        https://twitter.com/following
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/6579/Twitter%20Unfollower.user.js
// @updateURL https://update.greasyfork.org/scripts/6579/Twitter%20Unfollower.meta.js
// ==/UserScript==

window.onload = function () {
    
    var config = {
        loadingTime: 1000,
        intervalTime: 2000,
        debug: true
    };
    
    $(".UserActions-editButton").before('<button type="button" id="unfollowBtn" class="edit-button btn"><span class="button-text unfollow-text">Start Unfollowing</span></button> ');
    
    function unfollowAll() {
        log("Clicked unfollow buttons.");
        $(".user-actions").each(function() {
            if (/not-following/i.test($(this).attr("class")) == false) {
                $(this).children(".follow-button").trigger("click");
            }
        });
    }
    
    function unfollowInit() {
        setInterval(function() {
            if ($(window).scrollTop() + $(window).height() == $(document).height() == false) {
                unfollowAll();
                setTimeout(function() {
                    log("Go scroll bottom.");
                    $("html, body").animate({ scrollTop: $(document).height() }, 500);
                }, config.loadingTime);
            }
        }, config.intervalTime);
    }
    
    $("#unfollowBtn").click(function() {
        log("Clicked start button.");
        unfollowInit();
    });
    
    function log(text) {
        delete console.log;
        if (config.debug) {
            console.log(Date() + ": " + text + "\n"); 
        }
    }
    
    log("Twitter Unfollower is ready.");
    
};