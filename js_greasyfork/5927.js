// ==UserScript==
// @name         Autostrife
// @namespace    http://gigapause.com/
// @version      1.1
// @description  Automatically strifes on the Overseer project.
// @author       capableResistor
// @grant        none
// @match        http://*.theoverseerproject.com/*
// @match        http://92.222.26.236/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @require      https://greasyfork.org/scripts/5995-overseer-enhanced/code/Overseer%20Enhanced.js?version=22511
// @downloadURL https://update.greasyfork.org/scripts/5927/Autostrife.user.js
// @updateURL https://update.greasyfork.org/scripts/5927/Autostrife.meta.js
// ==/UserScript==

function strife(){
    var pathArray = window.location.pathname.split( '/' );
    var pathLength = pathArray.length -1;
    var currPath = pathArray[pathLength];
    createInput();
    if(currPath == "dreamtransition.php") {
        printcon("Switching dreamstates, cookie cleansed.");
        unsetCookie('autostrife');
    }
    if($('#aspect').length){
        var healthcontainer = $('#banner > div.intercross > span > div.pined');
        var encountercontainer = $('#banner > div.intercross > div.lefy > span');
        var health = healthcontainer.html();
        var encounters = encountercontainer.html();
        health = health.replace( /^\D+/g, '');
        health = health.replace('%','');
        encounters = encounters.replace( /^\D+/g, '');
        
        document.title = "H: " + Number(health) + "%" + " E: " + Number(encounters) + ". Overseer";
        
        if (getCookie('autostrife') == "") {
            printcon("Autostrife cookie not set. Not autostrifing.");
        } else if (getCookie('autostrife') == "doStrife") {
            if(Number(health) < 20 ) {
                //abscond();
                printcon("Too dangerous to autostrife (Health below 20%). Manual intervention required.");
            } else {
                setTimeout(attack, 3000);
            } 
        } 
    } else if ($('#canner a').length > 0 && $.trim($('#canner a').text()) == "Strife again" && getCookie('autostrife') == "doStrife") {
        printcon("Strife concluded.");
        unsetCookie('autostrife');
    } else {
        printcon("Idle.");
    }
}

function setCookie(cname, cvalue, exdays){
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function unsetCookie(cname){
    document.cookie = cname + "=; expires=-90019001";
}

function getCookie(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
}

function createInput(){
    var atbutton = $('input[type="submit"][value="Abscond"]');
    var userinfo = $('#banner > div.intercross > span > div.lined > a');
    var mainbox = $('#banner');
    var buttonbox = $('#strifebuttons');
    if (mainbox.length > 0){
        if ($('#stop').length > 0){
            printcon("Stop button already exists. Not creating.");
        } else {
            buttonbox.append($('<span class="rhyme slam astop" id="stop">STOPAUTO</span>'));
            buttonbox.append($('<style>#stop {\ncolor: #000;\nmargin-left: 5px;\nmargin-right: 10px;\nmargin-top: 5px;\n}\n#stop:active {\nbackground-color: #444;\ncolor: #FFF;\n}\n#stop:hover {\noutline: thin red solid\n}\n</style>'));
            document.getElementById('stop').addEventListener("click", stop, false);
        }
    }
    if(atbutton.length > 0){
        var buttonbox = $('#strifebuttons');
        buttonbox.append($('<span class="rhyme slam aautos" id="astrife">AUTOSTRIFE</span>'));
        buttonbox.append($('<style>#astrife {\ncolor: #000;\nmargin-left: auto;\nmargin-right: 10px;\nmargin-top: 5px;\n}\n#astrife:active {\nbackground-color: #444;\ncolor: #FFF;\n}\n#astrife:hover {\noutline: thin red solid\n}\n</style>'));
        document.getElementById('astrife').addEventListener("click", autoStrife, false);
    }
}

function attack(){
    printcon("Attacking.");
    var atbutton = $('input[type="submit"][value="Attack"]');
    atbutton.trigger("click");
}

function abscond(){
    printcon("Absconding.");
    var abbutton = $('input[type="submit"][value="Abscond"]');
    abbutton.trigger("click");
}

function initiate(){
    printcon("Initiating strife.");
    var lastbutton = $('input[type="submit"][value="Fight these enemies again!"]');
    lastbutton.trigger("click"); 
}

function autoStrife(){
    printcon("Autostrifing.");
    setCookie('autostrife', 'doStrife', '1');
    window.location.href = 'strife.php';
}

function stop(){
    if (getCookie('autostrife') === ""){
        printcon("Cookie isn't even set. No need to keep pressing this.");
    } else {
        printcon("Unsetting autostrife cookie.");
        unsetCookie('autostrife');
    }
}

function printcon(data){
    var mainconsole = $('#strifeconsole');
    mainconsole.append($('<div style="color: #FFF; background-color: rgba(0,0,0,.20);">[AUTOSTRIFE]====> ' + data + '</div>'));
    mainconsole.scrollTop(($('#strifeconsole').height()*2));
}

strife();