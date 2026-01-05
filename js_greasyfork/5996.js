// ==UserScript==
// @name         Autogrind
// @namespace    http://gigapause.com/
// @version      1.1
// @description  Automatically grinds on the Overseer project.
// @author       capableResistor
// @grant        none
// @match        http://*.theoverseerproject.com/*
// @match        http://92.222.26.236/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @require      https://greasyfork.org/scripts/5995-overseer-enhanced/code/Overseer%20Enhanced.js?version=22511
// @downloadURL https://update.greasyfork.org/scripts/5996/Autogrind.user.js
// @updateURL https://update.greasyfork.org/scripts/5996/Autogrind.meta.js
// ==/UserScript==

function grind() {
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
        
        if (getCookie('autostrife') == "doGrind"){
            if (Number(health) < 5 ) {
                printcon("Looks like you're in trouble. Get healed above 5% before you attempt grinding and be sure you're taking on enemies you're very sure you can defeat easily.");
                abscond();
            } else {
                setTimeout(attack, 3000);
            }
        } 
    } else if ($('#canner a').length > 0 && $.trim($('#canner a').text()) == "Strife again" && getCookie('autostrife') == "doGrind") {
        printcon("Strife concluded, but grind mode is on.");
        window.location.href = 'strife.php';
    } else if ($('input[type="submit"][value="Fight these enemies again!"]').length && getCookie('autostrife') == "doGrind") {
        printcon("On strife init page, and autoGrind is on.");
        var encountercontainer2 = $('#banner > div.intercross > div.lefy > span');
        var encounters2 = encountercontainer2.html();
        encounters2 = encounters2.replace( /^\D+/g, '');
        if (Number(encounters2) === 0) {
            printcon("However, there are no encounters left. Grinding is over.");
            unsetCookie('autostrife');
        } else  {
            printcon("We have " + Number(encounters2) + " enounter(s) to work with.");
            initiate();
        }
    } else {
        printcon("Idle.");
        var encountercontainer3 = $('#banner > div.intercross > div.lefy > span');
        var encounters3 = encountercontainer3.html();
        encounters3 = encounters3.replace( /^\D+/g, '');
        if (Number(encounters3) === 0 && getCookie('autostrife') == "doGrind" ) {
            printcon("There are no encounters left. Grinding is over.");
            unsetCookie('autostrife');
        }
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
        buttonbox.append($('<span class="rhyme slam aautog" id="agrind">AUTOGRIND</span>'));
        buttonbox.append($('<style>#agrind {\ncolor: #000;\nmargin-left: auto;\nmargin-right: 10px;\nmargin-top: 5px;\n}\n#agrind:active {\nbackground-color: #444;\ncolor: #FFF;\n}\n#agrind:hover {\noutline: thin red solid\n}\n</style>'));
        document.getElementById('agrind').addEventListener("click", autoGrind, false);
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

function autoGrind(){
    printcon("Autogrinding.");
    setCookie('autostrife', 'doGrind', '7');
    window.location.href = 'strife.php';
}

function initiate(){
    printcon("Initiating strife.");
    var lastbutton = $('input[type="submit"][value="Fight these enemies again!"]');
    lastbutton.trigger("click"); 
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
    mainconsole.append($('<div style="color: #FFF; background-color: rgba(0,0,0,.20);">[AUTOGRIND]====> ' + data + '</div>'));
    mainconsole.scrollTop(($('#strifeconsole').height()*2));
}

grind();