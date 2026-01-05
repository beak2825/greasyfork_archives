// ==UserScript==
// @name         lecFix
// @namespace    lecFix
// @version      0.1.4
// @description  Fix [l=c] link created by RES.
// @author       kusotool
// @include      http://*.reddit.com/*
// @include      https://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8767/lecFix.user.js
// @updateURL https://update.greasyfork.org/scripts/8767/lecFix.meta.js
// ==/UserScript==

var lastpage = 0;
var regex = /page-(\d{1,4})/;

function lecFix(){
    var page = findLastPage();
    
    if(lastpage != page){
        var e = document.getElementsByTagName("span");
        for(var i = 0; i < e.length; i++){
            if(e[i].innerHTML === "[l=c]"){
                e[i].setAttribute("thisComments", decodeURI(e[i].getAttribute("thisComments")));
            }
        }
        lastpage = page;
    }    

    setTimeout(lecFix, 1000);
}

function findLastPage(){
    var n = 1;
    var es = document.getElementsByTagName("div");
    for(var i = es.length - 1; i >= 0; i--){
        if(es[i].getAttribute("class") === "NERPageMarker"){
            if(regex.test(es[i].id)){
                n = parseInt(es[i].id.replace(regex, "$1"));
                break;
            }
        }
    }
    return n;
}

lecFix();
