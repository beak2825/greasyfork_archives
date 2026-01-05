// ==UserScript==
// @name         Overseer Enhanced
// @namespace    http://gigapause.com/
// @version      0.6
// @author       capableResistor
// @match        http://*.theoverseerproject.com/*
// @match        http://92.222.26.236/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// ==/UserScript==

oeconsole();

function oeconsole (){
    if($('#strifeconsole').length > 0){
        return;
    } else {
        var mainbox = $('#banner');
        if (mainbox.length > 0){
            mainbox.after($('<div id="strifeconsole" style="background-color: #AAAAAA; overflow-y: scroll; border: 5px solid #c6c6c6; height: 75px;"></div>'));
            mainbox.after($('<div id="strifebuttons" style="background-color: #AAAAAA; border: 5px solid #c6c6c6; height: 35px;"></div>'));
        }
    }
}
