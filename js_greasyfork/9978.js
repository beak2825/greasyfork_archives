// ==UserScript==
// @name         FaK+
// @namespace    http://alphaoverall.com
// @version      0.1
// @description  Ever wanted to be K+? This adds a K+ on your screen... no private chats... and not on other screens... FUN!!!
// @author       AlphaOverall
// @include      http://www.kongregate.com/games/*/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/9978/FaK%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/9978/FaK%2B.meta.js
// ==/UserScript==

function init() {
    var checkIfLoaded = setInterval(function(){check()}, 100);
    var i = 100;
    function check(){
        var youser = document.getElementsByClassName("chat_avatar");
        if (youser.length != 0){clearInterval(checkIfLoaded);setTimeout(kplus, 800);}
        else { i--;}
        if (i<=0) { console.log("Chat not found!");clearInterval(checkIfLoaded);}
    }
    holodeck.addChatCommand("kplus", function(l,n){
        check();
        return false;
    });
    function kplus() {
        var windows = document.getElementsByClassName("chat_room_template");
        var you = [];
        for (var j=0; j<windows.length; j++){
            if (!windows[j].style.display){
                you = windows[j].getElementsByClassName("user_row")[0];
            }
        }
        var kicon = document.createElement("span");
        kicon.className = "spritesite premium_icon clickable";
        kicon.title = "Kongregate Plus";
        kicon.innerText = "Kongregate Plus";
        you.insertBefore(kicon, you.childNodes[you.childNodes.length - 2]);
        holodeck._active_dialogue.kongBotMessage("You are now a Pseudo Premium Kongregate user! If not, or you want more K+, use the /kplus command...")
    }
}

setTimeout(init, 1000);