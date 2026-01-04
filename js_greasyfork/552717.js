// ==UserScript==
// @name GPX+: Autoclicker
// @description Clicks eggs and Pokémon on GPX+
// @include *gpx.plus/info/*
// @include *azureserv.com/info/*
// @include *.*.*.*/info/*
// @version      1.0.0
// @license      MIT
// @grant        none
// @namespace Squornshellous Beta
// @downloadURL https://update.greasyfork.org/scripts/552717/GPX%2B%3A%20Autoclicker.user.js
// @updateURL https://update.greasyfork.org/scripts/552717/GPX%2B%3A%20Autoclicker.meta.js
// ==/UserScript==

if (window.top !== window.self) {
    document.head.insertAdjacentHTML("beforeend",`<style>
    #infoTable {
        position:fixed;
        top:0;
        left:0;
        margin:0;
    }
    :not(:has(#infoTable), #infoTable, #infoTable *) {
        display:none;
    }
    html {
        overflow:hidden !important;
    }
    html, body, #main, #contentContainer {
        background:transparent !important;
    }
    </style>`);
}

function clickEgg() {
    var debug=false;
    var info=document.querySelector("#infoInteract");
    var button=info.querySelector(".infoInteractButton[name='berry'], .infoInteractButton[type='submit']");
    var flavors=["NULL","Sour","Spicy","Dry","Sweet","Bitter"];
    var berries=["NULL","Aspear","Cheri","Chesto","Pecha","Rawst"];
    if (info) {
        var us=info.getElementsByTagName("u");
        if (us.length>0) {
            var clicked=0;
            for (var i=0;i<us.length;i++) {
                for (var a=1;a<6;a++) {
                    if (us[i].innerHTML.search(flavors[a].toLowerCase())!=-1) {
                        //console.log(flavors[a]);
                        var bName=info.querySelector(".infoInteractButton:is([data-tooltip*='"+berries[a]+"'],[data-tooltip*='"+flavors[a]+"'])");
                        var nName=info.querySelector(".infoInteractButton[value='"+a+"']");
                        //console.log(bName,nName);
                        if (bName) {
                            if (debug) bName.style.outline="10px solid red";
                            else bName.click();
                            clicked=1;
                        }
                        else if (nName) {
                            if (debug) nName.style.outline="10px solid blue";
                            else nName.click();
                            clicked=1;
                        }
                    }
                }
            }
            if (clicked==0) if (button) {
                if (debug) button.style.outline="10px solid green";
                else button.click();
            }
        }
        else if (info.innerHTML.search("cannot interact with it")==-1) {
            if (button) {
                if (debug) button.style.outline="10px solid cyan";
                else button.click();
            }
        }
    }
}
var gpx=setInterval(function() {clickEgg();},500);