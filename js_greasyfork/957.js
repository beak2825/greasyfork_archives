// ==UserScript==
// @name        DinoRPG Faster
// @namespace   e78e44fc24cf93fab2271d8996cfa6fa
// @description Making DinoRPG faster
// @include     http://en.dinorpg.com/*
// @include     http://www.dinorpg.com/*
// @include     http://es.dinorpg.com/*
// @include     http://www.dinorpg.de/*
// @version     2.23
// @author      LazyBastard (based on sunn0's script)
// @downloadURL https://update.greasyfork.org/scripts/957/DinoRPG%20Faster.user.js
// @updateURL https://update.greasyfork.org/scripts/957/DinoRPG%20Faster.meta.js
// ==/UserScript==

// Create array contains function
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

/* Show answers directly */
if (document.getElementById("answers")) {
    document.getElementById("answers").style.display = 'block';
}

/* Show fightresults directly */
if (document.getElementById("debrief")) {
    var results = document.getElementById("debrief");
    var newresult = document.createElement("div");
    newresult.style = "float:left;position:relative;margin-left: 285px;margin-top:58px;";
    var resultlink = document.createElement("a");
    resultlink.setAttribute('href', '#');
    resultlink.addEventListener("click", function () {
            if (document.getElementById("debrief").style.display == 'block') {
                document.getElementById("debrief").style.display = 'none';
            }
            else {
                document.getElementById("debrief").style.display = 'block';
            }
    }, false);
    var linktext = document.createTextNode('Show/Hide fight results');
    resultlink.appendChild(linktext);
    newresult.appendChild(resultlink);
    results.parentNode.appendChild(newresult);
}

/* Hide View Image */
var views = document.getElementsByClassName("view");
if (views.length) {
    views[0].style.display = "none";
}

/* Hide notifications */
var notification = document.getElementById("notification");
if (notification) {
    document.body.removeChild(notification);
}
/* section for status items - needed for multiple actions below */
var centerContent = document.getElementById('centerContent');

/* Water charm script */

var baofanaction = document.getElementById("act_dialog_wcharm");
if (baofanaction && baofanaction.id && centerContent.childNodes[1].childNodes[17].innerHTML.indexOf('Bao Charm') < 0) {
    var wnode = baofanaction.cloneNode(true);
    wnode.id = "act_dialog_wcharm2";
    wnode.children[0].children[0].children[1].childNodes[0].nodeValue = "\n            Water charm\n        ";
    var btr = wnode.children[0].children[0];
    var onclick = btr.getAttribute("onClick");
    var re = /\/(\d+)\/act\/dialog\/wcharm/.exec(onclick);
    if (re) {
        dinoId = re[1];
        userId = onclick.substr(-7, 5);
        btr.setAttribute("onClick", "");
        btr.setAttribute("onMouseOver", "mt.js.Tip.show(this,'<div class=\"header\"><div class=\"footer\"><h1>Bao's Fan</h1> <div class=\"content\">You can get a water charm with this action</div></div></div>',null)")
        btr.addEventListener("click", function () {
            if (document.getElementById("tooltip")) {
                document.getElementById("tooltip").style.display = "none";
            }
            btr.style.cursor = "wait";
            var tds = btr.getElementsByTagName("td");
            for (var k = 0; k < tds.length; k++) {
                var td = tds[k];
                td.style.cursor = "wait";
                td.style.color = "#ffffff";
                td.style.backgroundColor = "transparent";
            }
            var label = btr.getElementsByClassName("label")[0];
            label.innerHTML = "Clicked!";
            var res = performAction(dinoId, 'act/dialog/wcharm?sk=' + userId, 'dino/' + dinoId);
            label.innerHTML = "Uh... Yes, I suppose!";
            res = performAction(dinoId, 'act/dialog/wcharm?goto=ok;sk=' + userId, 'dino/' + dinoId + '/act/dialog/wcharm');
            label.innerHTML = "Wow, that is impressive!";
            res = performAction(dinoId, 'act/dialog/wcharm?goto=wah;sk=' + userId, 'dino/' + dinoId + '/act/dialog/wcharm');
            label.innerHTML = "Ok!";
            res = performAction(dinoId, 'act/dialog/wcharm?goto=yes;sk=' + userId, 'dino/' + dinoId + '/act/dialog/wcharm');
            label.innerHTML = "Did you mean spiritual?";
            res = performAction(dinoId, 'act/dialog/wcharm?goto=spirit;sk=' + userId, 'dino/' + dinoId + '/act/dialog/wcharm');
            label.innerHTML = "Have to go!";
            res = performAction(dinoId, 'act/dialog/wcharm?goto=thanks;sk=' + userId, 'dino/' + dinoId + '/act/dialog/wcharm');
            res = performAction(dinoId, 'dialogCancel', 'dino/' + dinoId + '/');
            document.location = '/dino/' + dinoId + '/setTab?t=map';
        },
            false
        );
        btr.children[0].children[0].setAttribute("src", "/img/icons/elem_2.gif");
    }
    baofanaction.parentNode.appendChild(wnode);
}

/* Focus @ Bao Bob script */
/* You won't start focussing until you've got the korgon fins from Diane Korgsey */
if (baofanaction && baofanaction.id && centerContent.childNodes[1].childNodes[17].innerHTML.indexOf('Korgon Fins') > 0 && centerContent.childNodes[1].childNodes[17].innerHTML.indexOf('Blacksylva Key') < 0) {

    var focusaction = document.getElementById("act_dialog_bob");
    var cnode = focusaction.cloneNode(true);
    cnode.id = "act_dialog_bob2";
    cnode.children[0].children[0].children[1].childNodes[0].nodeValue = "\n            Focus!\n        ";
    var ctr = cnode.children[0].children[0];
    var onclick = ctr.getAttribute("onClick");
    var re = /\/(\d+)\/act\/dialog\/bob/.exec(onclick);
    if (re) {
        dinoId = re[1];
        userId = onclick.substr(-7, 5);
        ctr.setAttribute("onClick", "");
        ctr.setAttribute("onMouseOver", "mt.js.Tip.show(this,'<div class=\"header\"><div class=\"footer\"><h1>Bao Bob</h1> <div class=\"content\">You can start focussing with this action</div></div></div>',null)")
        ctr.addEventListener("click", function () {
            if (document.getElementById("tooltip")) {
                document.getElementById("tooltip").style.display = "none";
            }
            ctr.style.cursor = "wait";
            var tds = ctr.getElementsByTagName("td");
            for (var k = 0; k < tds.length; k++) {
                var td = tds[k];
                td.style.cursor = "wait";
                td.style.color = "#ffffff";
                td.style.backgroundColor = "transparent";
            }
            var label = ctr.getElementsByClassName("label")[0];
            label.innerHTML = "Clicked!";
            var res = performAction(dinoId, 'act/dialog/bob?sk=' + userId, 'dino/' + dinoId);
            label.innerHTML = "I've got a question for you";
            res = performAction(dinoId, 'act/dialog/bob?goto=question;sk=' + userId, 'dino/' + dinoId + '/act/dialog/bob');
            label.innerHTML = "What about my question?";
            res = performAction(dinoId, 'act/dialog/bob?goto=quest3;sk=' + userId, 'dino/' + dinoId + '/act/dialog/bob');
            label.innerHTML = "Where?";
            res = performAction(dinoId, 'act/dialog/bob?goto=where;sk=' + userId, 'dino/' + dinoId + '/act/dialog/bob');
            label.innerHTML = "What do I need to do?";
            res = performAction(dinoId, 'act/dialog/bob?goto=how;sk=' + userId, 'dino/' + dinoId + '/act/dialog/bob');
            label.innerHTML = "I want my dinoz to focus!";
            res = performAction(dinoId, 'act/dialog/bob?goto=concen;sk=' + userId, 'dino/' + dinoId + '/act/dialog/bob');
            label.innerHTML = "Ok";
            res = performAction(dinoId, 'act/dialog/bob?goto=ok;sk=' + userId, 'dino/' + dinoId + '/act/dialog/bob');
            label.innerHTML = "Focusing";
            //res = performAction(dinoId, 'dialogCancel', 'dino/' + dinoId + '/');
            document.location = '/dino/' + dinoId;
        },
            false
        );
        ctr.children[0].children[0].setAttribute("src", "/img/icons/act_default.gif");
    }
    focusaction.parentNode.appendChild(cnode);
}


/* Fire charm script */
// Won't give you charm unless you unlocked it at the Venerable
var shamanaction = document.getElementById("act_dialog_shaman");

if (shamanaction && shamanaction.id && centerContent.childNodes[1].childNodes[17].innerHTML.indexOf('Fire Charm') < 0) {
    var fnode = shamanaction.cloneNode(true);
    fnode.id = "act_dialog_shaman2";
    fnode.children[0].children[0].children[1].childNodes[0].nodeValue = "\n            Fire charm\n        ";
    var htr = fnode.children[0].children[0];
    var onclick = htr.getAttribute("onClick");
    var re = /\/(\d+)\/act\/dialog\/shaman/.exec(onclick);
    if (re) {
        dinoId = re[1];
        userId = onclick.substr(-7, 5);
        htr.setAttribute("onClick", "");
        htr.setAttribute("onMouseOver", "mt.js.Tip.show(this,'<div class=\"header\"><div class=\"footer\"><h1>Soft Shaman</h1> <div class=\"content\">You can get a fire charm with this action</div></div></div>',null)")
        htr.addEventListener("click", function () {
            if (document.getElementById("tooltip")) {
                document.getElementById("tooltip").style.display = "none";
            }
            htr.style.cursor = "wait";
            var tds = htr.getElementsByTagName("td");
            for (var k = 0; k < tds.length; k++) {
                var td = tds[k];
                td.style.cursor = "wait";
                td.style.color = "#ffffff";
                td.style.backgroundColor = "transparent";
            }
            var label = htr.getElementsByClassName("label")[0];
            label.innerHTML = "Clicked!";
            var res = performAction(dinoId, 'act/dialog/shaman?sk=' + userId, 'dino/' + dinoId);
            label.innerHTML = "Someone told me...";
            res = performAction(dinoId, 'act/dialog/shaman?goto=charm;sk=' + userId, 'dino/' + dinoId + '/act/dialog/shaman');
            label.innerHTML = "Accept the charm";
            res = performAction(dinoId, 'act/dialog/shaman?goto=boost;sk=' + userId, 'dino/' + dinoId + '/act/dialog/shaman');
            res = performAction(dinoId, 'dialogCancel', 'dino/' + dinoId + '/');
            document.location = '/dino/' + dinoId + '/setTab?t=map';
        },
            false
        );
        htr.children[0].children[0].setAttribute("src", "/img/icons/elem_0.gif");
    }
    shamanaction.parentNode.appendChild(fnode);
}

/* Shovel automation */
var mineaction = document.getElementById("act_dialog_mine");

if (mineaction && mineaction.id && (centerContent.childNodes[1].childNodes[17].innerHTML.indexOf('Broken Shovel') > 0 || centerContent.childNodes[1].childNodes[17].innerHTML.indexOf('Shovel') < 0)) {
    var mnode = mineaction.cloneNode(true);
    mnode.id = "act_dialog_mine2";
    mnode.children[0].children[0].children[1].childNodes[0].nodeValue = "\n            Get/Repair Shovel\n        ";
    var itr = mnode.children[0].children[0];
    var onclick = itr.getAttribute("onClick");
    var re = /\/(\d+)\/act\/dialog\/mine/.exec(onclick);
    if (re) {
        dinoId = re[1];
        userId = onclick.substr(-7, 5);
        itr.setAttribute("onClick", "");
        itr.setAttribute("onMouseOver", "mt.js.Tip.show(this,'<div class=\"header\"><div class=\"footer\"><h1>Forger</h1> <div class=\"content\">You can get a free shovel repair with this action</div></div></div>',null)")
        itr.addEventListener("click", function () {
            if (document.getElementById("tooltip")) {
                document.getElementById("tooltip").style.display = "none";
            }
            itr.style.cursor = "wait";
            var tds = itr.getElementsByTagName("td");
            for (var k = 0; k < tds.length; k++) {
                var td = tds[k];
                td.style.cursor = "wait";
                td.style.color = "#ffffff";
                td.style.backgroundColor = "transparent";
            }
            var label = itr.getElementsByClassName("label")[0];
            label.innerHTML = "Clicked!";
            var res = performAction(dinoId, 'act/dialog/mine?sk=' + userId, 'dino/' + dinoId);
            label.innerHTML = "Yes";
            res = performAction(dinoId, 'act/dialog/mine?goto=repair;sk=' + userId, 'dino/' + dinoId + '/act/dialog/mine');
            res = performAction(dinoId, 'act/dialog/mine?goto=yes;sk=' + userId, 'dino/' + dinoId + '/act/dialog/mine');
            label.innerHTML = "Thanks";
            res = performAction(dinoId, 'act/dialog/mine?goto=thanks;sk=' + userId, 'dino/' + dinoId + '/act/dialog/mine');
            res = performAction(dinoId, 'dialogCancel', 'dino/' + dinoId + '/');
            document.location = '/dino/' + dinoId + '/setTab?t=map';
        },
            false
        );
        itr.children[0].children[0].setAttribute("src", "/img/icons/act_dig.gif");
    }
    mineaction.parentNode.appendChild(mnode);
}

/* Forger automation */
var forgeraction = document.getElementById("act_dialog_forgeron");

if (forgeraction && forgeraction.id && centerContent.childNodes[1].childNodes[17].innerHTML.indexOf('Broken Shovel') > 0) {
    var bnode = forgeraction.cloneNode(true);
    bnode.id = "act_dialog_forgeron2";
    bnode.children[0].children[0].children[1].childNodes[0].nodeValue = "\n            Repair Shovel\n        ";
    var btr = bnode.children[0].children[0];
    var onclick = btr.getAttribute("onClick");
    var re = /\/(\d+)\/act\/dialog\/forgeron/.exec(onclick);
    if (re) {
        dinoId = re[1];
        userId = onclick.substr(-7, 5);
        btr.setAttribute("onClick", "");
        btr.setAttribute("onMouseOver", "mt.js.Tip.show(this,'<div class=\"header\"><div class=\"footer\"><h1>Forger</h1> <div class=\"content\">This repair action costs 100 <img src=\"http://en.dinorpg.com/img/icons/small_gold.gif\"></div></div></div>',null)")
        btr.addEventListener("click", function () {
            if (document.getElementById("tooltip")) {
                document.getElementById("tooltip").style.display = "none";
            }
            btr.style.cursor = "wait";
            var tds = btr.getElementsByTagName("td");
            for (var k = 0; k < tds.length; k++) {
                var td = tds[k];
                td.style.cursor = "wait";
                td.style.color = "#ffffff";
                td.style.backgroundColor = "transparent";
            }
            var label = btr.getElementsByClassName("label")[0];
            label.innerHTML = "Clicked!";
            var res = performAction(dinoId, 'act/dialog/forgeron?sk=' + userId, 'dino/' + dinoId);
            label.innerHTML = "Could you please repair my shovel?";
            res = performAction(dinoId, 'act/dialog/forgeron?goto=repair;sk=' + userId, 'dino/' + dinoId + '/act/dialog/forgeron');
            label.innerHTML = "Of course I will Ma'am!";
            res = performAction(dinoId, 'dialogCancel', 'dino/' + dinoId + '/');
            document.location = '/dino/' + dinoId + '/setTab?t=map';
        },
            false
        );
        btr.children[0].children[0].setAttribute("src", "/img/icons/act_dig.gif");
    }
    forgeraction.parentNode.appendChild(bnode);
}


/* Merguez automation */

var merguezaction = document.getElementById("act_dialog_merguez");

if (merguezaction && merguezaction.id) {
    var gnode = merguezaction.cloneNode(true);
    gnode.id = "act_dialog_merguez2";
    gnode.children[0].children[0].children[1].childNodes[0].nodeValue = "\n            Get Merquez\n        ";
    //var trs = merguezaction.getElementsByTagName("tr");
    var mtr = gnode.children[0].children[0];
    var onclick = mtr.getAttribute("onClick");
    var re = /\/(\d+)\/act\/dialog\/merguez/.exec(onclick);
    if (re) {
        dinoId = re[1];
        userId = onclick.substr(-7, 5);
        mtr.setAttribute("onClick", "");
        mtr.setAttribute("onMouseOver", "mt.js.Tip.show(this,'<div class=\"header\"><div class=\"footer\"><h1>Forger</h1> <div class=\"content\">You can get a 5 fatty merquez with this action</div></div></div>',null)")
        mtr.addEventListener("click", function () {
            if (document.getElementById("tooltip")) {
                document.getElementById("tooltip").style.display = "none";
            }
            mtr.style.cursor = "wait";
            var tds = mtr.getElementsByTagName("td");
            for (var k = 0; k < tds.length; k++) {
                var td = tds[k];
                td.style.cursor = "wait";
                td.style.color = "#ffffff";
                td.style.backgroundColor = "transparent";
            }
            var label = mtr.getElementsByClassName("label")[0];
            label.innerHTML = "Clicked!";
            var res = performAction(dinoId, 'act/dialog/merguez', 'dino/' + dinoId);
            label.innerHTML = "Ah!";
            res = performAction(dinoId, 'act/dialog/merguez?goto=ah;sk=' + userId, 'dino/' + dinoId + '/act/dialog/merguez');
            label.innerHTML = "Ok!";
            res = performAction(dinoId, 'act/dialog/merguez?goto=ok;sk=' + userId, 'dino/' + dinoId + '/act/dialog/merguez');
            label.innerHTML = "Thanks!";
            res = performAction(dinoId, 'act/dialog/merguez?goto=thanks;sk=' + userId, 'dino/' + dinoId + '/act/dialog/merguez');
            res = performAction(dinoId, 'dialogCancel', 'dino/' + dinoId + '/');
            document.location = '/dino/' + dinoId + '/setTab?t=inv';
        },
            false
        );
        mtr.children[0].children[0].setAttribute("src", "/img/icons/obj_mergz.gif");
    }
    merguezaction.parentNode.appendChild(gnode);
}

/* Double skill script */
// Won't give you double skill unless you've actually unlocked it

var madamxaction = document.getElementById("act_dialog_mmex");
if (madamxaction && madamxaction.id) {
    var xnode = madamxaction.cloneNode(true);
    xnode.id = "act_dialog_mmex2";
    xnode.children[0].children[0].children[1].childNodes[0].nodeValue = "\n            Double skill\n        ";
    var xtr = xnode.children[0].children[0];
    var onclick = xtr.getAttribute("onClick");
    var re = /\/(\d+)\/act\/dialog\/mmex/.exec(onclick);
    if (re) {
        dinoId = re[1];
        userId = onclick.substr(-7, 5);
        xtr.setAttribute("onClick", "");
        xtr.setAttribute("onMouseOver", "mt.js.Tip.show(this,'<div class=\"header\"><div class=\"footer\"><h1>Forger</h1> <div class=\"content\">You can unlock double skill with this action</div></div></div>',null)")
        xtr.addEventListener("click", function () {
            if (document.getElementById("tooltip")) {
                document.getElementById("tooltip").style.display = "none";
            }
            xtr.style.cursor = "wait";
            var tds = xtr.getElementsByTagName("td");
            for (var k = 0; k < tds.length; k++) {
                var td = tds[k];
                td.style.cursor = "wait";
                td.style.color = "#ffffff";
                td.style.backgroundColor = "transparent";
            }
            var label = xtr.getElementsByClassName("label")[0];
            label.innerHTML = "Clicked!";
            var res = performAction(dinoId, 'act/dialog/mmex?sk=' + userId, 'dino/' + dinoId);
            label.innerHTML = "Talk to her";
            res = performAction(dinoId, 'act/dialog/mmex?goto=talk;sk=' + userId, 'dino/' + dinoId + '/act/dialog/mmex');
            label.innerHTML = "...";
            res = performAction(dinoId, 'act/dialog/mmex?goto=talk2;sk=' + userId, 'dino/' + dinoId + '/act/dialog/mmex');
            label.innerHTML = "But who are you?";
            res = performAction(dinoId, 'act/dialog/mmex?goto=question;sk=' + userId, 'dino/' + dinoId + '/act/dialog/mmex');
            label.innerHTML = "So who are you?";
            res = performAction(dinoId, 'act/dialog/mmex?goto=question2;sk=' + userId, 'dino/' + dinoId + '/act/dialog/mmex');
            label.innerHTML = "Oh?";
            res = performAction(dinoId, 'act/dialog/mmex?goto=double;sk=' + userId, 'dino/' + dinoId + '/act/dialog/mmex');
            label.innerHTML = "Yes!";
            res = performAction(dinoId, 'act/dialog/mmex?goto=double2;sk=' + userId, 'dino/' + dinoId + '/act/dialog/mmex');
            label.innerHTML = "!!!";
            res = performAction(dinoId, 'act/dialog/mmex?goto=double3;sk=' + userId, 'dino/' + dinoId + '/act/dialog/mmex');
            label.innerHTML = "How do I learn it?";
            res = performAction(dinoId, 'act/dialog/mmex?goto=learn;sk=' + userId, 'dino/' + dinoId + '/act/dialog/mmex');
            label.innerHTML = "Huh???";
            if (res.indexOf('goto=learn1') > -1) { res = performAction(dinoId, 'act/dialog/mmex?goto=learn1;sk=' + userId, 'dino/' + dinoId + '/act/dialog/mmex'); }
            if (res.indexOf('goto=learn2') > -1) { res = performAction(dinoId, 'act/dialog/mmex?goto=learn2;sk=' + userId, 'dino/' + dinoId + '/act/dialog/mmex'); }
            if (res.indexOf('goto=learn3') > -1) { res = performAction(dinoId, 'act/dialog/mmex?goto=learn3;sk=' + userId, 'dino/' + dinoId + '/act/dialog/mmex'); }
            if (res.indexOf('goto=learn4') > -1) { res = performAction(dinoId, 'act/dialog/mmex?goto=learn4;sk=' + userId, 'dino/' + dinoId + '/act/dialog/mmex'); }
            if (res.indexOf('goto=learn5') > -1) { res = performAction(dinoId, 'act/dialog/mmex?goto=learn5;sk=' + userId, 'dino/' + dinoId + '/act/dialog/mmex'); }
            res = performAction(dinoId, 'dialogCancel', 'dino/' + dinoId + '/');
            document.location = '/dino/' + dinoId + '/setTab?t=details';
        },
            false
        );
        xtr.children[0].children[0].setAttribute("src", "/img/icons/elem_5.gif");
    }
    madamxaction.parentNode.appendChild(xnode);
}

/* To Nimbao script */
// Will get you to Nimboa from Klutz's workshop without fail

var klutzaction = document.getElementById("act_dialog_broc__2");
if (klutzaction && klutzaction.id) {
    var knode = klutzaction.cloneNode(true);
    knode.id = "act_dialog_broc__3";
    knode.children[0].children[0].children[1].childNodes[0].nodeValue = "\n            Go to Nimbao!\n        ";
    var ktr = knode.children[0].children[0];
    var onclick = ktr.getAttribute("onClick");
    var re = /\/(\d+)\/act\/dialog\/broc__2/.exec(onclick);
    if (re) {
        dinoId = re[1];
        userId = onclick.substr(-7, 5);
        ktr.setAttribute("onClick", "");
        ktr.setAttribute("onMouseOver", "mt.js.Tip.show(this,'<div class=\"header\"><div class=\"footer\"><h1>Forger</h1> <div class=\"content\">You can get to Nimbao with this action</div></div></div>',null)")
        ktr.addEventListener("click", function () {
            if (document.getElementById("tooltip")) {
                document.getElementById("tooltip").style.display = "none";
            }
            ktr.style.cursor = "wait";
            var tds = ktr.getElementsByTagName("td");
            for (var k = 0; k < tds.length; k++) {
                var td = tds[k];
                td.style.cursor = "wait";
                td.style.color = "#ffffff";
                td.style.backgroundColor = "transparent";
            }
            var label = ktr.getElementsByClassName("label")[0];
            label.innerHTML = "Clicked!";
            var correctRoute = 0;
            while (correctRoute == 0) {
                var res = performAction(dinoId, 'act/dialog/broc__2?sk=' + userId, 'dino/' + dinoId);
                label.innerHTML = "Could you take us to Nimbao?";
                res = performAction(dinoId, 'act/dialog/broc__2?goto=voyage2;sk=' + userId, 'dino/' + dinoId + '/act/dialog/broc__2');
                if (res.indexOf('goto=depart_5') > -1) { correctRoute = 1 }
                if (correctRoute != 1) {
                    label.innerHTML = "Wrong route!";
                    res = performAction(dinoId, 'act/dialog/broc__2?goto=noroute;sk=' + userId, 'dino/' + dinoId + '/act/dialog/broc__2');
                    res = performAction(dinoId, 'dialogCancel', 'dino/' + dinoId + '/');
                }
            }
            //               res = performAction(dinoId, 'act/dialog/broc__2?goto=depart_5;sk=' + userId, 'dino/' + dinoId + '/act/dialog/broc__2');

            //document.location = '/dino/' + dinoId + '/setTab?t=map';
            label.innerHTML = "Nimbao here we come!";
            document.location = '/dino/' + dinoId + '/act/dialog/broc__2?goto=depart_5;sk=' + userId;
        },
            false
        );
        ktr.children[0].children[0].setAttribute("src", "/img/icons/elem_4.gif");
    }
    klutzaction.parentNode.appendChild(knode);
}

/* To Skully missionslist */
// Will open Skully's missionlist without you misclicking 3 times...

var skullyaction = document.getElementById("act_dialog_skull");
if (skullyaction && skullyaction.id) {
    var ynode = skullyaction.cloneNode(true);
    ynode.id = "act_dialog_skull2";
    ynode.children[0].children[0].children[1].childNodes[0].nodeValue = "\n            Missions list\n        ";
    var ytr = ynode.children[0].children[0];
    var onclick = ytr.getAttribute("onClick");
    var re = /\/(\d+)\/act\/dialog\/skull/.exec(onclick);
    if (re) {
        dinoId = re[1];
        userId = onclick.substr(-7, 5);
        ytr.setAttribute("onClick", "");
        ytr.setAttribute("onMouseOver", "mt.js.Tip.show(this,'<div class=\"header\"><div class=\"footer\"><h1>Forger</h1> <div class=\"content\">You can see Skully's mission list with this action</div></div></div>',null)")
        ytr.addEventListener("click", function () {
            if (document.getElementById("tooltip")) {
                document.getElementById("tooltip").style.display = "none";
            }
            ytr.style.cursor = "wait";
            var tds = ytr.getElementsByTagName("td");
            for (var k = 0; k < tds.length; k++) {
                var td = tds[k];
                td.style.cursor = "wait";
                td.style.color = "#ffffff";
                td.style.backgroundColor = "transparent";
            }
            var label = ytr.getElementsByClassName("label")[0];
            label.innerHTML = "Clicked!";
            var res = performAction(dinoId, 'act/dialog/skull?sk=' + userId, 'dino/' + dinoId);
            label.innerHTML = "Argh! Ah ghost!";
            res = performAction(dinoId, 'act/dialog/skull?goto=arg;sk=' + userId, 'dino/' + dinoId + '/act/dialog/skull');
            label.innerHTML = "You!";
            res = performAction(dinoId, 'act/dialog/skull?goto=arg2;sk=' + userId, 'dino/' + dinoId + '/act/dialog/skull');
            label.innerHTML = "What's the difference?";
            res = performAction(dinoId, 'act/dialog/skull?goto=diff;sk=' + userId, 'dino/' + dinoId + '/act/dialog/skull');
            label.innerHTML = "Almost free?";
            res = performAction(dinoId, 'act/dialog/skull?goto=free;sk=' + userId, 'dino/' + dinoId + '/act/dialog/skull');
            label.innerHTML = "So you do haunt this place?";
            res = performAction(dinoId, 'act/dialog/skull?goto=haunt;sk=' + userId, 'dino/' + dinoId + '/act/dialog/skull');
            label.innerHTML = "Like what?";
            res = performAction(dinoId, 'act/dialog/skull?goto=do;sk=' + userId, 'dino/' + dinoId + '/act/dialog/skull');
            label.innerHTML = "Mmmm...";
            res = performAction(dinoId, 'act/dialog/skull?goto=uhm;sk=' + userId, 'dino/' + dinoId + '/act/dialog/skull');
            label.innerHTML = "A curse?";
            res = performAction(dinoId, 'act/dialog/skull?goto=bonne;sk=' + userId, 'dino/' + dinoId + '/act/dialog/skull');
            label.innerHTML = "It's not very helpfull is it?";
            res = performAction(dinoId, 'act/dialog/skull?goto=next;sk=' + userId, 'dino/' + dinoId + '/act/dialog/skull');
            label.innerHTML = "Maybe I can help you.";
            res = performAction(dinoId, 'act/dialog/skull?goto=help;sk=' + userId, 'dino/' + dinoId + '/act/dialog/skull');
            label.innerHTML = "Yes! definitely!";
            res = performAction(dinoId, 'act/dialog/skull?goto=accept;sk=' + userId, 'dino/' + dinoId + '/act/dialog/skull');
            label.innerHTML = "What should I do now?";
            res = performAction(dinoId, 'act/dialog/skull?goto=missions;sk=' + userId, 'dino/' + dinoId + '/act/dialog/skull');
            document.location = '/dino/' + dinoId + '/act/mission/list?sk=' + userId;
        },
            false
        );
    }
    skullyaction.parentNode.appendChild(ynode);
}


/* Check if double skill is needed */

var skillstable = document.getElementById("dinozDetails");

if (skillstable && skillstable.id) {
    var trs = skillstable.children[0].getElementsByTagName("tr");
    var skill = '';
    var skillsarray = [];
    var getDouble = 0;

    for (var j = 0; j < trs.length; j++) {
        var tr = trs[j];
        if (tr.children[1].className == 'type') {
            skill = tr.children[0].childNodes[1].childNodes[2].nodeValue.replace(/\s/g, '');
            skillsarray.push(skill);

        }
    }

    if (skillsarray.indexOf("Double-Skill") == -1) {
        if (skillsarray.indexOf("Marsh") != -1 && skillsarray.indexOf("Lightning") != -1) {
            getDouble = 1;
        }
        if (skillsarray.indexOf("AbsoluteZero") != -1 && skillsarray.indexOf("Combustion") != -1) {
            getDouble = 1;
        }
        if (skillsarray.indexOf("Elasticity") != -1 && skillsarray.indexOf("Adrenaline") != -1) {
            getDouble = 1;
        }
        if (skillsarray.indexOf("EjectorPalms") != -1 && skillsarray.indexOf("WildInstinct") != -1) {
            getDouble = 1;
        }
        if (skillsarray.indexOf("PrimalState") != -1 && skillsarray.indexOf("GaïaPath") != -1) {
            getDouble = 1;
        }
        if (skillsarray.indexOf("Cocoon") != -1 && skillsarray.indexOf("Waïkikidô") != -1) {
            getDouble = 1;
        }
        if (skillsarray.indexOf("KaosPath") != -1 && skillsarray.indexOf("Kamikaze") != -1) {
            getDouble = 1;
        }
        if (skillsarray.indexOf("Sapper") != -1 && skillsarray.indexOf("VaporousForm") != -1) {
            getDouble = 1;
        }
        if (skillsarray.indexOf("Vengeance") != -1 && skillsarray.indexOf("Achilles'Heel") != -1) {
            getDouble = 1;
        }
        if (skillsarray.indexOf("AqueousClone") != -1 && skillsarray.indexOf("MagicResistance") != -1) {
            getDouble = 1;
        }
        if (getDouble == 1) {
            var node = trs[trs.length - 1].cloneNode(true);
            node.children[0].childNodes[1].childNodes[2].nodeValue = " !!! Get Double Skill !!!";
            node.children[2].childNodes[1].children[0].attributes[0].nodeValue = '';
            node.children[2].childNodes[1].attributes[0].nodeValue = '';
            node.children[2].childNodes[1].attributes[1].nodeValue = '';
            //node.setAttribute("class","off");
            trs[1].parentNode.insertBefore(node, trs[1]);
            //node.setAttribute("class","off");
            //trs[1].parentNode.appendChild(node);
        }
    }

    /* Check for Invocator */
    if (skillsarray.indexOf("Invocator") == -1) {
        var avatarobj = document.getElementsByClassName("avatar");
        var avatarMO = "" + avatarobj[0].onmouseover;
        var dinozRace = avatarMO.substring(avatarMO.indexOf("<h1>") + 4, avatarMO.indexOf("</h1>"));
        //alert(dinozRace);
        var getInovator = 0;
        var getAt = '';
        switch (dinozRace) {
            case 'Moueffe':
                if (skillsarray.indexOf("LavaFlow") != -1 && skillsarray.indexOf("DiamondFangs") != -1) {
                    getInovator = 1;
                    getAt = "Venerable's Lair (Lavapit) - Venerable";
                }
                break;
            case 'Softpig':
                if (skillsarray.indexOf("Fireball") != -1 && skillsarray.indexOf("FaroeHeritage") != -1) {
                    getInovator = 1;
                    getAt = 'Lavapit (Lavapit) - Soft Shaman';
                }
                break;
            case 'Winks':
                if (skillsarray.indexOf("MasterFisherman") != -1 && skillsarray.indexOf("Adrenaline") != -1) {
                    getInovator = 1;
                    getAt = 'Mutant Falls (Atlantean Islands) - Atlantean Huard';
                }
                break;
            case 'Glidwings':
                if (skillsarray.indexOf("Lightning") != -1 && skillsarray.indexOf("Elasticity") != -1) {
                    getInovator = 1;
                    getAt = 'Lavapit (Lavapit) - Elemental Master';
                }
                break;
            case 'Castivorous':
                if (skillsarray.indexOf("WildInstinct") != -1 && skillsarray.indexOf("VivaciousWind") != -1) {
                    getInovator = 1;
                    getAt = 'Market Place (Dinoland) - Isabella';
                }
                break;
            case 'Rocky':
                if (skillsarray.indexOf("ElementalFission") != -1 && skillsarray.indexOf("IncandescentAura") != -1) {
                    getInovator = 1;
                    getAt = "King's Citadel (Magnetic Steppes) - Rocky King";
                }
                break;
            case 'Pteroz':
                if (skillsarray.indexOf("BurningBreath") != -1 && skillsarray.indexOf("FetidBreath") != -1) {
                    getInovator = 1;
                    getAt = "University (Dinoland) - Professor Eugene";
                }
                break;
            case 'Cloudoz':
                if (skillsarray.indexOf(" LightningDance") != -1 && skillsarray.indexOf("VacuumDisk") != -1) {
                    getInovator = 1;
                    getAt = "Bruteforce (Dinoland) - Madam X";
                }
                break;
            case 'Sirain':
                if (skillsarray.indexOf("WithoutMercy") != -1 && skillsarray.indexOf("Vengeance") != -1) {
                    getInovator = 1;
                    getAt = "Dinotown Clinic (Dinoplaza) - Anna Tomie";
                }
                break;
            case 'Hippoclamp':
                if (skillsarray.indexOf("MartialArts") != -1 && skillsarray.indexOf("Concentration") != -1 && skillsarray.indexOf("Awakening") != -1) {
                    getInovator = 1;
                    getAt = "Mutant Falls (Atlantean Islands) - Master Hydragol";
                }
                break;
            case 'Gorilloz':
                if (skillsarray.indexOf("PrimalState") != -1 && skillsarray.indexOf("BurningHeart") != -1) {
                    getInovator = 1;
                    getAt = "Dinotown (Dinoland) - Michael The Guide";
                }
                break;
            case 'Wanwan':
                if (skillsarray.indexOf("Gathering") != -1 && skillsarray.indexOf("ForestKeeper") != -1) {
                    getInovator = 1;
                    getAt = "Blacksylva Door (Grumhel Forest) - Forest Warden";
                }
                break;
            case 'Santaz':
                if (skillsarray.indexOf("Tenacity") != -1 && skillsarray.indexOf("FetidBreath") != -1 && skillsarray.indexOf("TrickyHits") != -1) {
                    getInovator = 1;
                    getAt = "Klutz' Workshop (Atlantean Islands) - Klutz";
                }
                break;
            case 'Feroz':
                if ((skillsarray.indexOf("BlowtorchPalm") != -1 || skillsarray.indexOf("Vigilance") != -1) && skillsarray.indexOf("FatalHit") != -1) {
                    getInovator = 1;
                    getAt = "Mr Bao Bob's House (Atlantean Islands) - Mr Bao Bob";
                }
                break;
            case 'Kabuki':
                if (skillsarray.indexOf("Awakening") != -1 && skillsarray.indexOf("Combustion") != -1) {
                    getInovator = 1;
                    getAt = "Totem Island (Atlantean Islands) - Yakuzi";
                }
                break;
            case 'Mahamuti':
                if (skillsarray.indexOf("Tornado") != -1 && skillsarray.indexOf("AcidBlood") != -1) {
                    getInovator = 1;
                    getAt = "Grandpa Joe's House (Dinoland) - Grandpa Joe";
                }
                break;
            case 'Tofufu':
                if (skillsarray.indexOf("Charisma") != -1 && skillsarray.indexOf("LightningDance") != -1) {
                    getInovator = 1;
                    getAt = "Bruteforce (Dinoland) - Master Zenith";
                }
                break;
            case 'Etherwasp':
                if (skillsarray.indexOf("PrecociousSpring") != -1 && skillsarray.indexOf("VivaciousWind") != -1) {
                    getInovator = 1;
                    getAt = "Observatory (Nimbao) - Sage Menthos";
                }
                break;
            case 'Smog':
                if (skillsarray.indexOf("CorrosiveArchangel") != -1 && skillsarray.indexOf("VaporousForm") != -1) {
                    getInovator = 1;
                    getAt = 'Island Head (Nimbao) - Old Robot';
                }
                break;
            case 'Tricerithumps':
                   getAt = 'Deep Gorges (Lavapit) - Popotholeler';
                break;
        }

        if (getInovator == 1) {
            var node = trs[trs.length - 1].cloneNode(true);
            node.children[0].childNodes[1].childNodes[1].attributes[1].nodeValue = '/img/icons/elem_5.gif';
            node.children[0].childNodes[1].childNodes[2].nodeValue = " !!! Get Invocator Skill !!!";
            node.children[0].childNodes[1].attributes[1].nodeValue = "mt.js.Tip.show(this,'<div class=\\'header\\'><div class=\\'footer\\'><h1>Invocator</h1> <div class=\\'content\\'>Get Invocator at:<div>\\n<strong>" + getAt + "</strong></div>\\n</div></div></div>',null)";
            node.children[1].childNodes[1].childNodes[0].nodeValue = 'S';
            node.children[1].childNodes[1].attributes[1].nodeValue = "mt.js.Tip.show(this,'<div class=\\'header\\'><div class=\\'footer\\'><h1>Special</h1> <div class=\\'content\\'>This skill has a <strong>particular effect</strong></div></div></div>',null)";
            node.children[2].childNodes[1].children[0].attributes[0].nodeValue = '';
            node.children[2].childNodes[1].attributes[0].nodeValue = '';
            node.children[2].childNodes[1].attributes[1].nodeValue = '';


            //node.setAttribute("class","off");
            trs[1].parentNode.insertBefore(node, trs[1]);
        }
    }
}

/* Tournament opponent info  */

var tournamentheader = document.getElementById("swf_title_BrutForce Tournament");

if (tournamentheader && tournamentheader.id) {
    var tourframe = tournamentheader.parentNode.parentNode;
    var divClear = document.createElement("div");
    divClear.className = 'clear';
    divClear.style.height = '10px';
    var divskills = document.createElement("div");
    divskills.className = 'right';

    divskills.appendChild(tourframe.childNodes[5].childNodes[3].childNodes[5].cloneNode(true));
    var dinolevel = divskills.childNodes[0].childNodes[3].innerHTML.slice(-2);
    divskills.childNodes[0].removeChild(divskills.childNodes[0].childNodes[3]);

    var skillslist = document.createElement("div");
    skillslist.className = 'help';
    skillslist.innerHTML = '<b>Details:</b> <br/><img src="http://en.dinorpg.com/img/icons/small_life_en.gif">'

    switch (dinolevel) {
        case ' 6': //HP Confirmed
            skillslist.innerHTML += ' 100<br/>Focus<br/>Perception<br/>'
            break;
        case ' 7': //HP Confirmed
            skillslist.innerHTML += ' 100<br/>Mistral<br/>Perception<br/>'
            break;
        case ' 8': //HP Confirmed
            skillslist.innerHTML += ' 130<br/>Focus<br/>'
            break;
        case ' 9': //HP Confirmed
            skillslist.innerHTML += ' 100<br/>Focus<br/>Perception<br/>Water Cannon<br/>Wrath<br/>'
            break;
        case '10': //HP Confirmed
            skillslist.innerHTML += ' 130<br/>Burning Breath<br/>Concentration<br/>Perception<br/>Water Cannon<br/>Wrath<br/>'
            break;
        case '11': //HP Confirmed
            skillslist.innerHTML += ' 120<br/>Focus<br/>Korgon Reinforcements<br/>Perception<br/>Wrath<br/>'
            break;
        case '12': //HP Confirmed
            skillslist.innerHTML += ' 130<br/>Cold Shower<br/>Focus<br/>Perception<br/>Tricky Hits<br/>Water Cannon<br/>'
            break;
        case '13': //HP Confirmed
            skillslist.innerHTML += ' 130<br/>Focus<br/>Water Cannon<br/>Wrath<br/>'
            break;
        case '14': //HP Confirmed
            skillslist.innerHTML += ' 130<br/>Focus<br/>Mistral<br/>Perception<br/>Water Cannon<br/>Wrath<br/>'
            break;
        case '15': //HP Confirmed
            skillslist.innerHTML += ' 150<br/>Mistral<br/>Korgon Reinforcement<br/>Water Cannon<br/>'
            break;
        case '16': //HP Confirmed
            skillslist.innerHTML += ' 150<br/>Korgon Reinforcement<br/>Mistral<br/>Water Cannon<br/>Wrath<br/>'
            break;
        case '17': //HP Confirmed
            skillslist.innerHTML += ' 130<br/>Burning Breath<br/>Focus<br/>Water Cannon<br/>Wrath<br/>'
            break;
        case '18': //HP Confirmed
            skillslist.innerHTML += ' 120<br/>Burning Breath<br/>Fire Ball<br/>Lava Flow<br/>Waïkikidô<br/>Water Cannon<br/>Wrath<br/>'
            break;
        case '19': //HP Confirmed
            skillslist.innerHTML += ' 120<br/>Korgon Reinforcement<br/>Magic Resistance<br/>Vines<br/>Water Cannon<br/>'
            break;
        case '20': //HP Confirmed
            skillslist.innerHTML += ' 150<br/>Korgon Reinforcement<br/>Mistral<br/>Vines<br/>Water Cannon<br/>'
            break;
        case '21': //HP Confirmed
            skillslist.innerHTML += ' 100<br/>Double Hit<br/>Concentration<br/>Focus<br/>Wrath<br/>'
            break;
        case '22': //HP Confirmed
            skillslist.innerHTML += ' 130<br/>Double Hit<br/>Flight<br/>Focus<br/>Mistral<br/>Tricky Hits<br/>Water Cannon<br/>'
            break;
        case '23': //HP Confirmed
            skillslist.innerHTML += ' 130<br/>Blowtorch Palm<br/>Burning Breath<br/>Jump<br/>Mistral<br/>Vengeance<br/>Wrath<br/>'
            break;
        case '24': //HP Confirmed
            skillslist.innerHTML += ' 120<br/>Focus<br/>Korgon Reinforcement<br/>Primal State<br/>Vines<br/>Wrath<br/>'
            break;
        case '25': //HP Confirmed
            skillslist.innerHTML += ' 130<br/>Double Hit<br/>Flight<br/>Focus<br/>Mistral<br/>Water Cannon<br/>Wrath<br/>'
            break;
        case '26': //HP Confirmed
            skillslist.innerHTML += ' 150<br/>Burning Breath<br/>Fire Ball<br/>Focus<br/>Nap<br/>Vengeance<br/>Water Cannon<br/>Wrath<br/>'
            break;
        case '27': //HP Confirmed
            skillslist.innerHTML += ' 150<br/>Cold Shower<br/>Fatal Hit<br/>Focus<br/>Gel<br/>Marsh<br/>Mistral<br/>Tricky Hits<br/>Water Cannon<br/>Wrath<br/>'
            break;
        case '28': //HP Confirmed
            skillslist.innerHTML += ' 130<br/>Burning Breath<br/>Dodge<br/>Flight<br/>Focus<br/>Mistral<br/>Water Cannon<br/>Wrath<br/>'
            break;
        case '29': //HP Confirmed
            skillslist.innerHTML += ' 130<br/>Double Hit<br/>Flight<br/>Focus<br/>Hermetic Aura<br/>Lightning<br/>Mistral<br/>Water Cannon<br/>Wrath<br/>'
            break;
        case '30': //HP Confirmed
            skillslist.innerHTML += ' 150<br/>Cold Shower<br/>Focus<br/>Mistral<br/>Perception<br/>Water Cannon<br/>Wrath<br/>Tricky Hits<br/>'
            break;
        case '31': //HP Confirmed
            skillslist.innerHTML += ' 150<br/>Burning Breath<br/>Combustion<br/>Fire Ball<br/>Lava Flow<br/>Mistral<br/>Vengeance<br/>Vines<br/>Water Cannon<br/>Wrath<br/>'
            break;
        case '32': //HP Confirmed
            skillslist.innerHTML += ' 130<br/>Burning Breath<br/>Combustion<br/>Fire Ball<br/>Lava Flow<br/>Mistral<br/>Nap<br/>Vengeance<br/>Vines<br/>Water Cannon<br/>Wrath<br/>'
            break;
        case '33': //HP Confirmed
            skillslist.innerHTML += ' 140<br/>Dodge<br/>Double Hit<br/>Cold Shower<br/>Flight<br/>Focus<br/>Gel<br/>Mistral<br/>Tornado<br/>Tricky Hits<br/>Water Cannon<br/>'
            break;
        case '34': //HP Confirmed
            skillslist.innerHTML += ' 150<br/>Burning Breath<br/>Cold Shower<br/>Double Hit<br/>Focus<br/>Gel<br/>Jump<br/>Mistral<br/>Vines<br/>Water Cannon<br/>Wrath<br/>Tricky Hits<br/>'
            break;
        case '35': //HP Confirmed
            skillslist.innerHTML += ' 150<br/>Cold Shower<br/>Dodge<br/>Focus<br/>Korgon Reinfocement<br/>Magic Resistance<br/>Mistral<br/>Precocious Spring<br/>Primal State<br/>Tricky Hits<br/>Vines<br/>Water Cannon<br/>'
            break;
        case '36': //HP Confirmed
            skillslist.innerHTML += ' 120<br/>Blowtorch Palm<br/>Burning Breath<br/>Dodge<br/>Flight<br/>Focus<br/>Jump<br/>Korgon Reinforcement<br/>Mistral<br/>Water Cannon<br/>Wrath<br/>'
            break;
        case '37': //HP Confirmed
            skillslist.innerHTML += ' 150<br/>Double Hit<br/>Flight<br/>Focus<br/>Hermetic Aura<br/>Mistral<br/>Saving Puree<br/>Water Cannon<br/>Wrath<br/>'
            break;
        case '38': //HP Confirmed
            skillslist.innerHTML += ' 150<br/>Cold Shower<br/>Double Hit<br/>Focus<br/>Gel<br/>Korgon Reinfocement<br/>Mistral<br/>Tricky Hits<br/>Vines<br/>Water Cannon<br/>Wrath<br/>'
            break;
        case '39': //HP Confirmed
            skillslist.innerHTML += ' 190<br/>Blowtorch Palm<br/>Combustion<br/>Fire Ball<br/>Focus<br/>Korgon Reinforcement<br/>Lava Flow</br>Mistral<br/>Vengeance<br/>Vines<br/>Water Cannon<br/>Wrath<br/>'
            break;
        case '40': //HP Confirmed
            skillslist.innerHTML += ' 170<br/>Dodge<br/>Focus</br>Gorriloz Spirit<br/>Korgon Reinforcement<br/>Precocious Spring<br/>Primal State<br/>Magic Resistance<br/>Vines<br/>Water Cannon<br/>Wrath<br/>'
            break;
        case '41': //HP Confirmed
            skillslist.innerHTML += ' 170<br/>Blowtorch Palm<br/>Burning Breath<br/>Cold Shower<br/>Combustion<br/>Fire Ball<br/>Focus<br/>Lava Flow<br/>Nap<br/>Torch<br/>Tricky Hits<br/>Vengeance<br/>Water Cannon<br/>Wrath<br/>'
            break;
        case '42': //HP Confirmed
            skillslist.innerHTML += ' 170<br/>Blowtorch Palm<br/>Burning Breath<br/>Combustion<br/>Fire Ball<br/>Focus<br/>Jump<br/>Nap<br/>Perception<br/>Self Control<br/>Tricky Hits<br/>Vengeance<br/>Water Cannon<br/>Wrath<br/>'
            break;
        case '43': //HP Partially Confirmed
            skillslist.innerHTML += ' ~180<br/>Focus<br/>Gorilloz Spirit<br/>Korgon Reinforcement<br/>Magic Resistance<br/>Mistral<br/>Precocious Spring<br/>Primal State<br/>Vines<br/>Water Cannon<br/>Wrath<br/>'
            break;
        case '44': //HP Confirmed
            skillslist.innerHTML += ' 130<br/>Dodge<br/>Double Hit<br/>Flight<br/>Focus<br/>Hermetic Aura<br/>Lightning<br/>Lightning Dance<br/>Mistral<br/>Perception<br/>Tornado<br/>Water Cannon<br/>'
            break;
        case '45': //HP Confirmed
            skillslist.innerHTML += ' 130<br/>Cold Shower<br/>Dodge<br/>Double Hit<br/>Flight<br/>Focus<br/>Gel<br/>Mistral<br/>Perception<br/>Tornado<br/>Tricky Hits<br/>Water Cannon<br/>Wrath<br/>'
            break;

    }

    divskills.appendChild(skillslist);

    tourframe.childNodes[5].appendChild(divClear);
    tourframe.childNodes[5].appendChild(divskills);

}

/* Mission info */

var missionheader = document.getElementById("swf_title_Mission:");
if (missionheader && missionheader.id) {
    var missioncontrol = missionheader.parentNode.nextElementSibling;
}

if (missionheader && missionheader.id && missioncontrol.className == 'briefing') {

    var missionframe = missionheader.parentNode.parentNode;
    var missionscript = missionframe.childNodes[1].children[1].childNodes[0].data;
    var rewardbox = document.createElement("p");
    //rewardbox.className = 'story'
    //var rewardbox = missionframe.childNodes[3].childNodes[9].nodeValue;
    var mission = missionscript.substring(missionscript.indexOf(';sub=') + 5, missionscript.indexOf('");', missionscript.indexOf(';sub=')));
    var rewards = '<b>Rewards:</b>';
    switch (mission) {
        /* Grandpa Joe */
        case "Fresh Fish":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 20 experience points.</li></ul>';
            break;
        case "The Lost Dog":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 15 experience points.</li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_angel.gif">1 of this item:<strong>Angel Potion</strong></div></li></ul>';
            break;
        case "The Hills' Smashrooms":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 30 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 500 gold coins.</li></ul>';
            break;
        case "Wolf Hunting":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 30 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 2000 gold coins.</li></ul>';
            break;
        case "The Rose Bush in danger":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 20 experience points.</li></ul>';
            break;
        case "The Recipe Book":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 20 experience points.</li></ul>';
            break;
        case "The Stamps":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 20 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/collec_msg.gif">Official Dinoland Stamps</li></ul>';
            break;
        case "The Confidential Letter":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 20 experience points.</li></ul>';
            break;
        case "A Strange Monster":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 30 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 500 gold coins.</li></ul>';
            break;
        case "The Giants":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 100 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 5000 gold coins.</li></ul>';
            break;
        case "The Month Exploit":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 200 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 8000 gold coins.</li></ul>';
            break;
            /* Madam X */
        case "The Black Briefcase":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 10 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 300 gold coins.</li></ul>';
            break;
        case "The Merchant Traitor":
            rewards += '<ul><li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_ration.gif">1 of this item:<strong>Battle Ration</strong></div></li></ul>';
            break;
        case "Police Chase":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 50 gold coins.</li></ul>';
            break;
        case "Island it's Cool":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 30 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 1000 gold coins.</li>' +
                '<li><b>Needed for mission:</b><div><img class="item" src="http://data.en.dinorpg.com/img/icons/fx_bouee.gif">Buoy</div></li></ul>';
            break;
        case "The Ashpouk Conspiracy":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 30 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 1000 gold coins.</li>' +
                '<li><b>Needed for mission:</b><div><img class="item" src="http://data.en.dinorpg.com/img/icons/fx_matesc.gif">Climbing Gear</div></li></ul>';
            break;
            /* Skully */
        case "Prologue":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 10 experience points.</li></ul>';
            break;
        case "On Moulder's Trail":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 20 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 1000 gold coins.</li></ul>';
            break;
        case "Miss Bao":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 10 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 500 gold coins.</li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/fx_skull.gif">Skully Souvenir</div></li></ul>';
            break;
        case "The Annoying Tourists":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 40 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 2000 gold coins.</li></ul>';
            break;
        case "Napalm Shrimp":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 30 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 5000 gold coins.</li></ul>' +
                '<li><b>Needed for mission:</b><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_tix.gif">3 of this item:<strong>Treasury Note</strong></div>' +
                '<br/><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_flamch.gif">5 of this item:<strong>Rescue Flamelet</strong></div></li></ul>';
            break;
        case "The Reunion":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 10 experience points.</li>' +
                '<li><img src="http://data.en.dinorpg.com/img/icons/collec_pda.gif">Diamantite Pebble</li></ul>';
            break;
            /* Anna Tomie */
        case "First Prescription":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 10 experience points.</li>' +
                '<li><b>Needed for mission:</b><div><img class="item" src="http://data.en.dinorpg.com/img/icons/ingr_fruitc.gif">10 of this item:<strong>Pelinae Leaves</strong></div></li></ul>';
            break;
        case "Mushroom Medicine":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 20 experience points.</li>' +
                '<li><b>Needed for mission:</b><div><img class="item" src="http://data.en.dinorpg.com/img/icons/ingr_fruitu.gif">5 of this item:<strong>White Mushrooms</strong></div></li></ul>';
            break;
        case "Bizarre Biotherapy":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 30 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 500 gold coins.</li>' +
                '<li><b>Needed for mission:</b><div><img class="item" src="http://data.en.dinorpg.com/img/icons/ingr_fruit1.gif">1 of this item:<strong>Whimsical Orchid</strong></div></li></ul>';

            break;
        case "Nasty Neighbours":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 10 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 500 gold coins.</li></ul>';
            break;
        case "Monster Invasion":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 10 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 600 gold coins.</li></ul>';
            break;
        case "First Aid":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 20 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 500 gold coins.</li></ul>';
            break;
        case "Curiosity Killed The Cat":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 20 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 500 gold coins.</li></ul>';
            break;
            /* Soft Shaman */
        case "The Testing Ordeal":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 20 experience points.</li></ul>';
            break;
        case "The Archelionscarer":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 60 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/fx_amulst.gif">The Strategy in 130 lessons</li></ul>';
            break;
        case "Fire!":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 40 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 2000 gold coins.</li></ul>';
            break;
        case "The Crazy Barbecue":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 40 experience points.</li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_flamch.gif">1 of this item:<strong>Rescue Flamelet</strong></div></li></ul>';
            break;
        case "Quarrel":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 30 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 1500 gold coins.</li></ul>';
            break;
        case "Defend The Forges":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 60 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 4000 gold coins.</li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_hotpan.gif">1 of this item:<strong>Authentic Warm Bread</strong></div></li></ul>';
            break;
        case "The Disappearing Package":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 25 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 1000 gold coins.</li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_angel.gif">1 of this item:<strong>Angel Potion</strong></div></li></ul>';
            break;
        case "(Un)Fair Trade":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 20 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 3500 gold coins.</li></ul>';
            break;
        case "Ridiculous Ritual":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 50 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 1500 gold coins.</li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_ppoiv.gif">1 of this item:<strong>Small Pepper</strong></div></li></ul>';
            break;
        case "Hieroglyphics":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 20 experience points.</li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_burger.gif">1 of this item:<strong>Cloud Burger</strong></div></li>' +
                '<li><b>Needed for mission:</b><div><img class="item" src="http://data.en.dinorpg.com/img/icons/fx_lantrn.gif">Lantern</div></li></ul>';
            break;
        case "Carrier Pigeon":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 100 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 5500 gold coins.</li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_hotpan.gif">1 of this item:<strong>Authentic Warm Bread</strong></div></li></ul>';
            break;
            /* Mr Bao Bob */
        case "Birthday Present":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 30 experience points.</li></ul>';
            break;
        case "Barter in the Atlanteid Islands":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 100 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 2000 gold coins.</li></ul>';
            break;
        case "Kazkadine Hunt":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 30 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 2000 gold coins.</li></ul>';
            break;
        case "Eeloz With Vinegar": //replaced in - With 30-10-14
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 50 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 5000 gold coins.</li></ul>';
            break;
        case "The Huge Hunt":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 150 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 1500 gold coins.</li></ul>';
            break;
        case "The Sardine Rally":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 10 experience points.</li></ul>';
            break;
        case "The Fishes Rally":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 20 experience points.</li></ul>';
            break;
        case "The Sharks Rally":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 30 experience points.</li></ul>';
            break;
        case "The Whales Rally":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 40 experience points.</li></ul>';
            break;
        case "The Dinoland Tour":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 100 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/collec_tour.gif">Dinoland Tour</li></ul>';
            break;
            /* Nicolas Mulot */
        case "The Perilous Road":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 40 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 1500 gold coins.</li></ul>';
            break;
        case "Allergies":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 20 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 1500 gold coins.</li></ul>';
            break;
        case "Cartography":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 60 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 2500 gold coins.</li></ul>';
            break;
        case "Remedy":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 60 experience points.</li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_angel.gif">1 of this item:<strong>Angel Potion</strong></div></li></ul>';
            break;
        case "Adventurer's Kit":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 40 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/fx_bckpck.gif">Very Usefull Backpack</li></ul>';
            break;
            /* Strange Prowler */
        case "The Amnesiac Rice":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 5000 gold coins.</li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_riz.gif">1 of this item:<strong>Amnesiac Rice</strong></div></li></ul>';
            break;
        case "The Dark Dinoz":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 250 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 5000 gold coins.</li></ul>';
            break;
            /* Elemental Master */
        case "The Master's Shopping":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 20 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 500 gold coins.</li></ul>';
            break;
        case "Lesson 1 - Lightning":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 30 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 1000 gold coins.</li></ul>';
            break;
        case "Lesson 2 - Fire":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 30 experience points.</li></ul>';
            break;
        case "Lesson 3 - Wood":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 2000 gold coins.</li>' +
                '<li><b>Needed for mission:</b><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_odemon.gif">1 of this item:<strong>Devil Ointment</strong>' +
                'to cure the curse ( costs 6000 <img src="http://en.dinorpg.com/img/icons/small_gold.gif">)</div></li></ul>';
            break;
        case "Lesson 4 - Air":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 10000 gold coins.</li></ul>';
            break;
        case "Lesson 5 - Water":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 20 experience points.</li>' +
                '<li><b>Afterwards claim your reward from the master:<br/>' +
                '<img src="http://data.en.dinorpg.com/img/icons/obj_spher5.gif"> OR ' +
                '<img src="http://data.en.dinorpg.com/img/icons/obj_spher4.gif"> OR ' +
                '<img src="http://data.en.dinorpg.com/img/icons/obj_spher3.gif"> OR ' +
                '<img src="http://data.en.dinorpg.com/img/icons/obj_spher2.gif"> OR ' +
                '<img src="http://data.en.dinorpg.com/img/icons/obj_spher1.gif"></li></ul>';
            break;
            /* Dian Korgsey */
        case "Like a Korgon To Water":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 20 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/fx_palmes.gif">Korgon Fins</li></ul>';
            break;
        case "Northern Korgons, Southern Korgons":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 40 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 2000 gold coins.</li></ul>';
            break;
        case "Wood Steak":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 40 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 2000 gold coins.</li></ul>';
            break;
        case "Korgon Rivalry":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 100 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 3500 gold coins.</li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_hotpan.gif">1 of this item:<strong>Authentic Warm Bread</strong></div></li></ul>';
            break;
            /* Forest Warden */
        case "The Forest Warden":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 110 experience points.</li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_fruit.gif">3 of this item:<strong>Grapeboom</strong></div></li>';
            break;
        case "The Green Thumb":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 30 experience points.</li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_fruit.gif">1 of this item:<strong>Grapeboom</strong></div></li></ul>';
            break;
        case "Right to cut":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 40 experience points.</li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_fruit.gif">3 of this item:<strong>Grapeboom</strong></div></li></ul>';
            break;
        case "The King of the Jungle":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 35 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 2500 gold coins.</li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_fruit.gif">1 of this item:<strong>Grapeboom</strong></div></li></ul>';
            break;
        case "Make a Wish":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 60 experience points.</li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_fruit.gif">4 of this item:<strong>Grapeboom</strong></div></li></ul>';
            break;
        case "A Jack For The Forest":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 75 experience points.</li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_fruit.gif">2 of this item:<strong>Grapeboom</strong></div></li></ul>';
            break;
        case "Monkey Money":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 5 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/fx_gshop.gif">Flourishing Branch of the Warden</li></ul>';
            break;
            /* Request Office */
        case "Secure The Road":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 70 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 1500 gold coins.</li></ul>';
            break;
        case "Western Caravan":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 100 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 3000 gold coins.</li></ul>';
            break;
        case "Zest of Scorpwink":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 80 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 2000 gold coins.</li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_antip.gif">2 of this item:<strong>Poisonite Injection</strong></div></li>';
            break;
        case "Secure The Crossroads":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 80 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 3000 gold coins.</li></ul>';
            break;
        case "The Greedy Thief":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 80 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 2500 gold coins.</li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_ration.gif">3 of this item:<strong>Battle Ration</strong></div></li>';
            break;
        case "Dewormer":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 100 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 2500 gold coins.</li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_monoch.gif">1 of this item:<strong>Monochromatic</strong></div></li>';
            break;
        case "Wanted: Sahalami The Slicer":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 80 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 2500 gold coins.</li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_hotpan.gif">1 of this item:<strong>Authentic Warm Bread</strong></div></li>';
            break;
        case "Wanted: Trip The Wimp":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 90 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 3000 gold coins.</li></ul>';
            break;
        case "Wanted: Boukanee The Immortal":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 90 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 3500 gold coins.</li></ul>';
            break;
        case "Wanted: Cervelah The Poisoner":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 90 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 3500 gold coins.</li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_antip.gif">2 of this item:<strong>Poisonite Injection</strong></div></li></ul>';
            break;
        case "A Mysterious Pendant":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 90 experience points.</li></ul>';
            break;
            /* Al Zaimeur */
        case "Al's Party":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 80 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 3000 gold coins.</li></ul>';
            break;
        case "Merguez or Nothing":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 40 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 1000 gold coins.</li></ul>';
            break;
        case "Al Cool":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 40 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 1000 gold coins.</li>' +
                '<li><b>Needed for mission:</b><div><img class="item" src="http://data.en.dinorpg.com/img/icons/ingr_art.gif">3 of this item:<strong>Sharpened Flint</strong></div><br/>' +
                '<img class="item" src="http://data.en.dinorpg.com/img/icons/fx_pelle.gif">Lucky Shovel</li></ul>';
            break;
        case "Licence To Party":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 20 experience points.</li></ul>';
            break;
        case "Magnetic Excess":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 100 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 1000 gold coins.</li></ul>';
            break;
            /* Chen - there might be a difference in titles after completing the Quetzu Mission, still looking into this */
        case "S.O.S":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 80 experience points.</li></ul>'
            break;
        case "The Archdorogon's Tomb":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 50 experience points.</li></ul>'
            break;
        case "Ingredients Hunt":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 10000 gold coins.</li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_remed2.gif">1 of this item:<strong>Elixer</strong></div></li></ul>';
            break;
        case "Ingredient Hunt":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 10000 gold coins.</li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_remed2.gif">1 of this item:<strong>Elixer</strong></div></li></ul>';
            break;
        case "Letter to the children":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 50 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 2000 gold coins.</li></ul>';
            break;
        case "Visit the children":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 50 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 2000 gold coins.</li></ul>';
            break;
        case "Tracking Morg":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 60 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 1500 gold coins.</li></ul>';
            break;
            /* Golum - unconfirmed texts*/
        case "Clear the campsite":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 40 experience points.</li></ul>';
            break;
        case "Master, where are you?":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 1000 gold coins.</li></ul>';
            break;
        case "Haunted place":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 40 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 500 gold coins.</li></ul>';
            break;
        case "The Dark Tower":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 50 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 2000 gold coins.</li></ul>';
            break;
        case "Candela":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 60 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 6000 gold coins.</li>' +
                '<li><b>Needed for mission:</b><div><img class="item" src="http://data.en.dinorpg.com/img/icons/ingr_enfeu.gif">3 of this item:<strong>Fire Energy</strong></div></li>' +
                '<li>Afterwards talk to Golum to get <img src="http://en.dinorpg.com/img/icons/fx_morsso.gif"><br/>This allows you to enter and exit the Dark World</li></ul>';
            break;
            /* Sgt Pepper - unconfirmed texts*/
        case "Warrior Training":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 40 experience points.</li></ul>';
            break;
        case "Mine Field":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 50 experience points.</li>' +
                '<li><b>Needed for mission:</b><div><img class="item" src="http://en.dinorpg.com/img/icons/obj_danger.gif">1 of this item:<strong>Danger Detector</strong><br/>' +
                '<img class="item" src="http://data.en.dinorpg.com/img/icons/obj_zippo.gif">1 of this item:<strong>Lighter</strong></div><br/></ul>';

            break;
        case "Mouktization":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 3000 gold coins.</li></ul>';
            break;
        case "Initiation":
            rewards += '<ul><li>none</li></ul>';
            break;
        case "Capturer's Glove":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 100 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/fx_mcapt.gif">Capturer\'s Glove</li></ul>';
            break;
            /* Cassandra */
        case "Act One":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 50 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 3000 gold coins.</li></ul>';
            break;
        case "Act Two":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 30 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 5000 gold coins.</li></ul>';
            break;
        case "Act Three":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 60 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 18000 gold coins.</li>' +
                '<li><b>Needed for mission:</b><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 11000 gold coins.</li></ul>';
            break;
        case "Act Four":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 50 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 3000 gold coins.</li></ul>';
            break;
        case "Act Five":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 20 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 1000 gold coins.</li></ul>';
            break;
        case "Act Six":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 40 experience points.</li>' +
                '<li><img src="http://en.dinorpg.com/img/icons/small_gold.gif"> 6000 gold coins.</li>' +
                '<li><b>Needed for mission:</b><div><img class="item" src="http://data.en.dinorpg.com/img/icons/ingr_fruit1.gif">1 of this item:<strong>Whimsical Orchid</strong></div></li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/ingr_enair.gif">1 of this item:<strong>Air Energy</strong></div></li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/ingr_chas5.gif">3 of this item:<strong>Radioactive Rock</strong></div></li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/ingr_fruit5.gif">5 of this item:<strong>Ethereal Spore</strong></div></li></ul>';
            break;
            /* Captain of the Guard - Unconfirmed texts and rewards */
        case "The Exorbitant Exodus":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 50 experience points.</li></ul>';
            break;
        case "Mana Leak":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 80 experience points.</li>' +
                '<li><b>Needed for mission:</b><div><img class="item" src="http://data.en.dinorpg.com/img/icons/ingr_fish.gif">4 of this item:<strong>Lujidanee Grouper</strong></div></li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/ingr_enfdr.gif">2 of this item:<strong>Lightning Energy</strong></div></li></ul>';
            break;
        case "Man-a-ctive Lichen":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 100 experience points.</li></ul>';
            break;
        case "History of the Dark World":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 100 experience points.</li>' +
                '<li><b>Needed for mission:</b><div><img class="item" src="http://data.en.dinorpg.com/img/icons/ingr_fruita.gif">1 of this item:<strong>Dark Shoot</strong></div></li></ul>';
            break;
        case "History of the Dark World 2":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 80 experience points.</li></ul>';
            break;
        case "Visit to the Dark World":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 200 experience points.</li></ul>';
            break;
            /* Sage Rhubabao'riley - unconfirmed texts + rewards */
        case "ET Foam Home":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/obj_tix.gif"> 20 treasury notes.</li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/ingr_art2.gif">1 of this item:<strong>Fine-cut Chalice</strong></div></li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/ingr_art1.gif">1 of this item:<strong>Gold Bracelet</strong></div></li></ul>';
            break;
        case "A little drop of ether":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/obj_tix.gif"> 30 treasury notes.</li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/ingr_art3.gif">1 of this item:<strong>Karat Necklace</strong></div></li></ul>';
            break;
        case "Lodestone Shard":
            rewards += '<ul><li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/ingr_artr2.gif">1 of this item:<strong>Gold Crown</strong></div></li>' +
                '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/ingr_artr1.gif">1 of this item:<strong>Flawless Brooch</strong></div></li></ul>';
            break;
        case "What has become of Dinoland":
            rewards += '<ul><li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/ingr_dgrain.gif">1 of this item:<strong>Devourer Seeds</strong></div></li></ul>';
            break;
        case "Meditation":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 80 experience points.</li></ul>';
            break;
        case "Spiritual Combat":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/obj_tix.gif"> 50 treasury notes.</li>' +
                "<li>Afterwards talk to Rhubabao'riley to get " + '<img class="item" src="http://data.en.dinorpg.com/img/icons/fx_lvlup2.gif"> and unlock level 70</li></ul>';
            break;
            /* A Shady Man */
        case "A Shady Affair":
            rewards += '<ul><li><img src="http://en.dinorpg.com/img/icons/small_xp.gif"> 5 experience points.</li>' +
                '<li>And access to the <b>Monster Island Sewer System Labyrinth</b></li></ul>';
            break;
    }

    rewardbox.innerHTML = '\n' + rewards;
    missionframe.childNodes[3].insertBefore(rewardbox, missionframe.childNodes[3].childNodes[9]);
    //missionframe.childNodes[3].childNodes[9].nodeValue = '\n ' + rewards;

}

/* Missing reward info */

var rewardheader = document.getElementById("swf_title_Mission Completed!");

if (rewardheader && rewardheader.id) {

    var rewardframe = rewardheader.parentNode.parentNode;
    var rewardscript = rewardframe.childNodes[3].childNodes[1].childNodes[0].data;
    var rewardbox2 = document.createElement("p");
    //rewardbox.className = 'story'
    //var rewardbox = missionframe.childNodes[3].childNodes[9].nodeValue;
    var missionreward = rewardscript.substring(rewardscript.indexOf('completed "') + 11, rewardscript.indexOf('"!', rewardscript.indexOf('completed "')));
    var rewards = '';
    switch (missionreward) {
        /* Grandpa Joe */
        case "the Lost Dog":
            rewards += '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_angel.gif">1 of this item:<strong>Angel Potion</strong></div></li>';
            break;
        case "The Stamps":
            rewards += '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/collec_msg.gif">Official Dinoland Stamps</div></li>';
            break;
            /* Madam X */
        case "The Merchant Traitor":
            rewards += '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_ration.gif">1 of this item:<strong>Battle Ration</strong></div></li>';
            break;
            /* Skully */
        case "The Reunion":
            rewards += '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/collec_pda.gif">Diamantite Pebble</div></li>';
            break;
            /* Anna Tomie */
            /* Soft Shaman */
        case "The Crazy Barbecue":
            rewards += '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_flamch.gif">1 of this item:<strong>Rescue Flamelet</strong></div></li>';
            break;
        case "Defend The Forges":
            rewards += '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_hotpan.gif">1 of this item:<strong>Authentic Warm Bread</strong></div></li>';
            break;
        case "The Disappearing Package":
            rewards += '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_angel.gif">1 of this item:<strong>Angel Potion</strong></div></li>';
            break;
        case "Ridiculous Ritual":
            rewards += '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_ppoiv.gif">1 of this item:<strong>Small Pepper</strong></div></li>';
            break;
        case "Hieroglyphics":
            rewards += '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_burger.gif">1 of this item:<strong>Cloud Burger</strong></div></li>';
            break;
        case "Carrier Pigeon":
            rewards += '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_hotpan.gif">1 of this item:<strong>Authentic Warm Bread</strong></div></li>';
            break;
            /* Mr Bao Bob */
        case "The Dinoland Tour":
            rewards += '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/collec_tour.gif">Dinoland Tour</div></li>';
            break;
            /* Nicolas Mulot */
        case "Remedy":
            rewards += '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_angel.gif">1 of this item:<strong>Angel Potion</strong></div></li>';
            break;
            /* Strange Prowler */
        case "The Amnesiac Rice":
            rewards += '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_riz.gif">1 of this item:<strong>Amnesiac Rice</strong></div></li>';
            break;
            /* Elemental Master */
        case "Lesson 5 - Water":
            rewards += '<li>Claim your reward from the master:<br/><div>' +
                '<img class="item" src="http://data.en.dinorpg.com/img/icons/obj_spher5.gif"> OR ' +
                '<img class="item" src="http://data.en.dinorpg.com/img/icons/obj_spher4.gif"> OR ' +
                '<img class="item" src="http://data.en.dinorpg.com/img/icons/obj_spher3.gif"> OR ' +
                '<img class="item" src="http://data.en.dinorpg.com/img/icons/obj_spher2.gif"> OR ' +
                '<img class="item" src="http://data.en.dinorpg.com/img/icons/obj_spher1.gif"></div></li>';
            break;
            /* Dian Korgsey */
        case "Korgon Rivalry":
            rewards += '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_hotpan.gif">1 of this item:<strong>Authentic Warm Bread</strong></div></li>';
            break;
            /* Forest Warden */
        case "The Forest Warden":
            rewards += '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_fruit.gif">3 of this item:<strong>Grapeboom</strong></div></li>';
            break;
        case "The Green Thumb":
            rewards += '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_fruit.gif">1 of this item:<strong>Grapeboom</strong></div></li>';
            break;
        case "Right to cut":
            rewards += '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_fruit.gif">3 of this item:<strong>Grapeboom</strong></div></li>';
            break;
        case "The King of the Jungle":
            rewards += '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_fruit.gif">1 of this item:<strong>Grapeboom</strong></div></li>';
            break;
        case "Make a Wish":
            rewards += '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_fruit.gif">4 of this item:<strong>Grapeboom</strong></div></li>';
            break;
        case "A Jack For The Forest":
            rewards += '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_fruit.gif">2 of this item:<strong>Grapeboom</strong></div></li>';
            break;
            /* Request Office */
        case "Zest of Scorpwink":
            rewards += '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_antip.gif">2 of this item:<strong>Poisonite Injection</strong></div></li>';
            break;
        case "The Greedy Thief":
            rewards += '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_ration.gif">3 of this item:<strong>Battle Ration</strong></div></li>';
            break;
        case "Dewormer":
            rewards += '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_monoch.gif">1 of this item:<strong>Monochromatic</strong></div></li>';
            break;
        case "Wanted: Sahalami The Slicer":
            rewards += '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_hotpan.gif">1 of this item:<strong>Authentic Warm Bread</strong></div></li>';
            break;
        case "Wanted: Cervelah The Poisoner":
            rewards += '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_antip.gif">2 of this item:<strong>Poisonite Injection</strong></div></li>';
            break;
            /* Al Zaimeur */
            /* Chen */
        case "Ingredient Hunt":
            rewards += '<li><div><img class="item" src="http://data.en.dinorpg.com/img/icons/obj_remed2.gif">1 of this item:<strong>Elixir</strong></div></li>';
            break;
            /* Sgt Pepper */
            //            case "The Capturer's Glove":
            //               rewards += '<br/><img src="http://en.dinorpg.com/img/icons/fx_mcapt.gif"><br/>';
            //          break;
    }

    rewardbox2.innerHTML = rewards;
    rewardframe.childNodes[3].insertBefore(rewardbox2, rewardframe.childNodes[3].childNodes[9]);

}

/* Sticky swamp roadsign */

var stickyheader = document.getElementById("swf_map");
if (stickyheader && stickyheader.id) {
    var stickycontrol = stickyheader.parentNode.children[2];
    var mapframe = document.getElementById("menu");
}

if (stickyheader && stickyheader.id && (stickycontrol.innerHTML == 'Sticky Swamp' || stickycontrol.innerHTML == 'Mutant Falls' || stickycontrol.innerHTML == 'Coral Mines' || stickycontrol.innerHTML == 'Waïkiki Island' || stickycontrol.innerHTML == "Klutz' Workshop") && mapframe.id) {
    var swampcontainer = document.createElement("div");
    var swampheader = document.createElement("div");
    swampheader.className = "header";
    swampcontainer.appendChild(swampheader);
    var swampbox = document.createElement("div");
    swampbox.className = "bg";
    //swampbox.className='mission help';
    swampbox.style = 'cursor:default;';
    var swampfooter = document.createElement("div");
    swampfooter.className = "footer";

    var swamplist = document.createElement("ul");
    var swampboxrow = document.createElement("p");
    swampboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;color:#8e3e26;text-decoration:underline;";
    swampboxrow.innerHTML = 'Swamp Roadsign:'
    swamplist.appendChild(swampboxrow);
    var curDate = new Date();
    var curDay = curDate.getDay();
    var weekday = new Array(8);
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    weekday[7] = "Sunday";
    for (var i = 1; i < 8; i++) {
        var swampboxrow = document.createElement("p");

        if (curDay == i || (curDay == 0 && i == 7)) {
            var style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #FBDAA7;color:#8e3e26;margin:0px;"
        }
        else {
            var style = "font-variant:small-caps;font-weight:bold;font-size:9pt;color:#8e3e26;margin:0px;"
        }
        swampboxrow.style = style;
        swampboxrow.innerHTML = weekday[i];
        swamplist.appendChild(swampboxrow);

        var swampboxrow = document.createElement("p");
        swampboxrow.style = style;
        if (i == 1) { swampboxrow.innerHTML = '<img src="http://en.dinorpg.com/img/icons/act_move.gif"> <img src="http://en.dinorpg.com/img/icons/act_fight.gif">'; }
        if (i == 2) { swampboxrow.innerHTML = '<img src="http://en.dinorpg.com/img/icons/act_move.gif"> <img src="http://en.dinorpg.com/img/icons/act_fight.gif">'; }
        if (i == 3) { swampboxrow.innerHTML = '<img src="http://en.dinorpg.com/img/icons/act_move.gif"> <label style="color:red;font-size:26px;font-weight:bold;">No</label>'; }
        if (i == 4) { swampboxrow.innerHTML = '<label style="color:red;font-size:26px;font-weight:bold;">No</label> <img src="http://en.dinorpg.com/img/icons/act_fight.gif">'; }
        if (i == 5) { swampboxrow.innerHTML = '<img src="http://en.dinorpg.com/img/icons/act_move.gif"> <img src="http://en.dinorpg.com/img/icons/act_fight.gif">'; }
        if (i == 6) { swampboxrow.innerHTML = '<label style="color:red;font-size:26px;font-weight:bold;">No</label> <img src="http://en.dinorpg.com/img/icons/act_fight.gif">'; }
        if (i == 7) { swampboxrow.innerHTML = '<img src="http://en.dinorpg.com/img/icons/act_move.gif"> <label style="color:red;font-size:26px;font-weight:bold;">No</label>'; }

        swamplist.appendChild(swampboxrow);
    }

    swampfooter.appendChild(swamplist);
    swampbox.appendChild(swampfooter);
    swampcontainer.appendChild(swampbox);
    mapframe.appendChild(swampcontainer);
}

/* Gravity Rock roadsign */
if (stickyheader && stickyheader.id && (stickycontrol.innerHTML == 'Gravity Rock' || stickycontrol.innerHTML == 'Submerged Technodome' || stickycontrol.innerHTML == 'Entryway to the Pyramid' || stickycontrol.innerHTML == 'Ethereal Well' || stickycontrol.innerHTML == "Caushemesh Acropolis") && mapframe.id) {
    var currTime= new Date();
    var currMins = currTime.getMinutes();
    var first = "";
    var second = "";
    var third = "";
    var fourth = "";
    var first2 = "";
    var second2 = "";
    var third2 = "";
    var fourth2 = "";
   
    if (currMins < 15) { first = "background-color: #FBDAA7;border: 1.8px solid #8e3e26;"; first2 = "border: 1.8px solid #8e3e26;border-bottom:0px;"; }
    if (currMins >= 15 && currMins < 30) { second = "background-color: #FBDAA7;border: 1.8px solid #8e3e26;border-bottom:0px;"; second2 = "border: 1.8px solid #8e3e26;"; }
    if (currMins >= 30 && currMins < 45) { third = "background-color: #FBDAA7; border: 1.8px solid #8e3e26;border-bottom:0px;"; third2 = "border: 1.8px solid #8e3e26;"; }
    if (currMins >= 45 && currMins <= 59) { fourth = "background-color: #FBDAA7;border: 1.8px solid #8e3e26;border-bottom:0px;"; fourth2 = "border: 1.8px solid #8e3e26;"; }
       
    var gravitycontainer = document.createElement("div");
    var gravityheader = document.createElement("div");
    gravityheader.className = "header";
    gravitycontainer.appendChild(gravityheader);
    var gravitybox = document.createElement("div");
    gravitybox.className = "bg";
    //gravitybox.className='mission help';
    gravitybox.style = 'cursor:default;';
    var gravityfooter = document.createElement("div");
    gravityfooter.className = "footer";

    var gravitylist = document.createElement("ul");
    gravitylist.style = 'line-height: 2em;margin: 0;padding: 0;'
    var gravityboxrow = document.createElement("p");
    gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;color:#8e3e26;text-decoration:underline;text-align:center; border-bottom: 2px solid #8e3e26; padding-bottom:5px;margin: 0;";
    gravityboxrow.innerHTML = 'Gravity Rock Roadsign:'
    gravitylist.appendChild(gravityboxrow);
    var curDate = new Date();
    var curDay = curDate.getDay();
    var weekday = new Array(8);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    weekday[7] = "Sunday";
    var gravityboxrow = document.createElement("p");
    gravityboxrow.innerHTML = weekday[curDay];
    gravityboxrow.style = "margin: 0;padding-left: 4px;line-height: 2em;color:#8e3e26;font-size:9pt;text-align:center;border-bottom: 2px solid #8e3e26;background-color: #FBDAA7;";
    gravitylist.appendChild(gravityboxrow);

    var gravityboxrow = document.createElement("td");
    gravityboxrow.style = "margin: 0;color:black;font-size:9pt;padding-left:5px;"+first;
    gravityboxrow.innerHTML = '00-15:';
    gravitylist.appendChild(gravityboxrow);
    var gravityboxrow = document.createElement("p");

    switch (curDay) {
        case 0: //Sunday
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #C6D780;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+first2;
            gravityboxrow.innerHTML = 'Ethereal Well';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("td");
            gravityboxrow.style = "padding:0;margin: 0;color:black;font-size:9pt;padding-left:5px;"+second;
            gravityboxrow.innerHTML = '15-30:';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("p");
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #F37F7F;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+second2;
            gravityboxrow.innerHTML = 'Acropolis';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("td");
            gravityboxrow.style = "padding:0;margin: 0;color:black;font-size:9pt;padding-left:5px;"+third;
            gravityboxrow.innerHTML = '30-45:';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("p");
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #89CCF5;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+third2;
            gravityboxrow.innerHTML = 'Technodome';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("td");
            gravityboxrow.style = "padding:0;margin: 0;color:black;font-size:9pt;padding-left:5px;"+fourth;
            gravityboxrow.innerHTML = '45-00:';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("p");
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #FFDC7F;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+fourth2;
            gravityboxrow.innerHTML = 'Pyramid';
            gravitylist.appendChild(gravityboxrow);
            break;
        case 1: // Monday
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #F37F7F;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+first2;
            gravityboxrow.innerHTML = 'Acropolis';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("td");
            gravityboxrow.style = "padding:0;margin: 0;color:black;font-size:9pt;padding-left:5px;"+second;
            gravityboxrow.innerHTML = '15-30:';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("p");
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #FFDC7F;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+second2;
            gravityboxrow.innerHTML = 'Pyramid';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("td");
            gravityboxrow.style = "padding:0;margin: 0;color:black;font-size:9pt;padding-left:5px;"+third;
            gravityboxrow.innerHTML = '30-45:';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("p");
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #C6D780;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+third2;
            gravityboxrow.innerHTML = 'Ethereal Well';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("td");
            gravityboxrow.style = "padding:0;margin: 0;color:black;font-size:9pt;padding-left:5px;"+fourth;
            gravityboxrow.innerHTML = '45-00:';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("p");
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #89CCF5;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+fourth2;
            gravityboxrow.innerHTML = 'Technodome';
            gravitylist.appendChild(gravityboxrow);
            break;
        case 2: //Tuesday
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #FFDC7F;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+first2;
            gravityboxrow.innerHTML = 'Pyramid';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("td");
            gravityboxrow.style = "padding:0;margin: 0;color:black;font-size:9pt;padding-left:5px;"+second;
            gravityboxrow.innerHTML = '15-30:';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("p");
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #C6D780;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+second2;
            gravityboxrow.innerHTML = 'Ethereal Well';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("td");
            gravityboxrow.style = "padding:0;margin: 0;color:black;font-size:9pt;padding-left:5px;"+third;
            gravityboxrow.innerHTML = '30-45:';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("p");
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #89CCF5;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+third2;
            gravityboxrow.innerHTML = 'Technodome';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("td");
            gravityboxrow.style = "padding:0;margin: 0;color:black;font-size:9pt;padding-left:5px;"+fourth;
            gravityboxrow.innerHTML = '45-00:';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("p");
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #F37F7F;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+fourth2;
            gravityboxrow.innerHTML = 'Acropolis';
            gravitylist.appendChild(gravityboxrow);
            break;
        case 3: //Wednesday
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #C6D780;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+first2;
            gravityboxrow.innerHTML = 'Ethereal Well';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("td");
            gravityboxrow.style = "padding:0;margin: 0;color:black;font-size:9pt;padding-left:5px;"+second;
            gravityboxrow.innerHTML = '15-30:';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("p");
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #89CCF5;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+second2;
            gravityboxrow.innerHTML = 'Technodome';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("td");
            gravityboxrow.style = "padding:0;margin: 0;color:black;font-size:9pt;padding-left:5px;"+third;
            gravityboxrow.innerHTML = '30-45:';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("p");
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #FFDC7F;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+third2;
            gravityboxrow.innerHTML = 'Pyramid';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("td");
            gravityboxrow.style = "padding:0;margin: 0;color:black;font-size:9pt;padding-left:5px;"+fourth;
            gravityboxrow.innerHTML = '45-00:';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("p");
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #F37F7F;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+fourth2;
            gravityboxrow.innerHTML = 'Acropolis';
            gravitylist.appendChild(gravityboxrow);
            break;
        case 4: //Thursday
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #C6D780;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+first2;
            gravityboxrow.innerHTML = 'Ethereal Well';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("td");
            gravityboxrow.style = "padding:0;margin: 0;color:black;font-size:9pt;padding-left:5px;"+second;
            gravityboxrow.innerHTML = '15-30:';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("p");
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #89CCF5;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+second2;
            gravityboxrow.innerHTML = 'Technodome';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("td");
            gravityboxrow.style = "padding:0;margin: 0;color:black;font-size:9pt;padding-left:5px;"+third;
            gravityboxrow.innerHTML = '30-45:';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("p");
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #F37F7F;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+third2;
            gravityboxrow.innerHTML = 'Acropolis';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("td");
            gravityboxrow.style = "padding:0;margin: 0;color:black;font-size:9pt;padding-left:5px;"+fourth;
            gravityboxrow.innerHTML = '45-00:';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("p");
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #FFDC7F;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+fourth2;
            gravityboxrow.innerHTML = 'Pyramid';
            gravitylist.appendChild(gravityboxrow);
            break;
        case 5: //Friday
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #F37F7F;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+first2;
            gravityboxrow.innerHTML = 'Acropolis';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("td");
            gravityboxrow.style = "padding:0;margin: 0;color:black;font-size:9pt;padding-left:5px;"+second;
            gravityboxrow.innerHTML = '15-30:';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("p");
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #C6D780;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+second2;
            gravityboxrow.innerHTML = 'Ethereal Well';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("td");
            gravityboxrow.style = "padding:0;margin: 0;color:black;font-size:9pt;padding-left:5px;"+third;
            gravityboxrow.innerHTML = '30-45:';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("p");
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #FFDC7F;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+third2;
            gravityboxrow.innerHTML = 'Pyramid';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("td");
            gravityboxrow.style = "padding:0;margin: 0;color:black;font-size:9pt;padding-left:5px;"+fourth;
            gravityboxrow.innerHTML = '45-00:';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("p");
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #89CCF5;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+fourth2;
            gravityboxrow.innerHTML = 'Technodome';
            gravitylist.appendChild(gravityboxrow);
            break;
        case 6: //Saturday
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #C6D780;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+first2;
            gravityboxrow.innerHTML = 'Ethereal Well';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("td");
            gravityboxrow.style = "padding:0;margin: 0;color:black;font-size:9pt;padding-left:5px;"+second;
            gravityboxrow.innerHTML = '15-30:';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("p");
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #FFDC7F;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+second2;
            gravityboxrow.innerHTML = 'Pyramid';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("td");
            gravityboxrow.style = "padding:0;margin: 0;color:black;font-size:9pt;padding-left:5px;"+third;
            gravityboxrow.innerHTML = '30-45:';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("p");
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #F37F7F;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+third2;
            gravityboxrow.innerHTML = 'Acropolis';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("td");
            gravityboxrow.style = "padding:0;margin: 0;color:black;font-size:9pt;padding-left:5px;"+fourth;
            gravityboxrow.innerHTML = '45-00:';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("p");
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #89CCF5;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+fourth2;
            gravityboxrow.innerHTML = 'Technodome';
            gravitylist.appendChild(gravityboxrow);
            break;
       case 7: //Sunday
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #C6D780;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+first2;
            gravityboxrow.innerHTML = 'Ethereal Well';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("td");
            gravityboxrow.style = "padding:0;margin: 0;color:black;font-size:9pt;padding-left:5px;"+second;
            gravityboxrow.innerHTML = '15-30:';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("p");
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #F37F7F;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+second2;
            gravityboxrow.innerHTML = 'Acropolis';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("td");
            gravityboxrow.style = "padding:0;margin: 0;color:black;font-size:9pt;padding-left:5px;"+third;
            gravityboxrow.innerHTML = '30-45:';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("p");
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #89CCF5;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+third2;
            gravityboxrow.innerHTML = 'Technodome';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("td");
            gravityboxrow.style = "padding:0;margin: 0;color:black;font-size:9pt;padding-left:5px;"+fourth;
            gravityboxrow.innerHTML = '45-00:';
            gravitylist.appendChild(gravityboxrow);
            var gravityboxrow = document.createElement("p");
            gravityboxrow.style = "font-variant:small-caps;font-weight:bold;font-size:9pt;background-color: #FFDC7F;color:#000000;line-height: 2em; padding-left:5px;margin: 0;"+fourth2;
            gravityboxrow.innerHTML = 'Pyramid';
            gravitylist.appendChild(gravityboxrow);
            break;
    }
   
    gravityfooter.appendChild(gravitylist);
    gravitybox.appendChild(gravityfooter);
    gravitycontainer.appendChild(gravitybox);
    mapframe.appendChild(gravitycontainer);
   
}
/* Transfor old stone into ashpouk totem */
if (stickyheader && stickyheader.id && stickycontrol.innerHTML == 'The University') {

    /* Old Stone in posession check */
    if (centerContent.childNodes[1].childNodes[17].innerHTML.indexOf('Old Stone') > 0) {
        var profaction = document.getElementById("act_dialog_prof");
        if (profaction && profaction.id) {

            var pnode = profaction.cloneNode(true);
            pnode.id = "act_dialog_prof2";
            pnode.children[0].children[0].children[1].childNodes[0].nodeValue = "\n            Get Ashpouk Totem\n        ";
            var ptr = pnode.children[0].children[0];
            var onclick = ptr.getAttribute("onClick");
            var re = /\/(\d+)\/act\/dialog\/prof/.exec(onclick);
            if (re) {
                dinoId = re[1];
                userId = onclick.substr(-7, 5);
                ptr.setAttribute("onClick", "");
                ptr.setAttribute("onMouseOver", "mt.js.Tip.show(this,'<div class=\"header\"><div class=\"footer\"><h1>Forger</h1> <div class=\"content\">You can transform you found Old Stone into an Ashpouk Totem!</div></div></div>',null)")
                ptr.addEventListener("click", function () {
                    if (document.getElementById("tooltip")) {
                        document.getElementById("tooltip").style.display = "none";
                    }
                    ptr.style.cursor = "wait";
                    var tds = ptr.getElementsByTagName("td");
                    for (var k = 0; k < tds.length; k++) {
                        var td = tds[k];
                        td.style.cursor = "wait";
                        td.style.color = "#ffffff";
                        td.style.backgroundColor = "transparent";
                    }
                    var label = ptr.getElementsByClassName("label")[0];
                    label.innerHTML = "Clicked!";
                    var res = performAction(dinoId, 'act/dialog/prof?sk=' + userId, 'dino/' + dinoId);
                    label.innerHTML = "Professor Eugene";
                    res = performAction(dinoId, 'act/dialog/prof?goto=talk;sk=' + userId, 'dino/' + dinoId + '/act/dialog/prof');
                    label.innerHTML = "Ask A Question";
                    res = performAction(dinoId, 'act/dialog/prof?goto=question;sk=' + userId, 'dino/' + dinoId + '/act/dialog/prof');
                    label.innerHTML = "This Old Stone?";
                    res = performAction(dinoId, 'act/dialog/prof?goto=stone;sk=' + userId, 'dino/' + dinoId + '/act/dialog/prof');
                    label.innerHTML = "Of course, here it is.";
                    res = performAction(dinoId, 'act/dialog/prof?goto=stone_yes;sk=' + userId, 'dino/' + dinoId + '/act/dialog/prof');
                    res = performAction(dinoId, 'dialogCancel', 'dino/' + dinoId + '/');
                    document.location = '/dino/' + dinoId + '/setTab?t=map';

                },
                    false
                );
                ptr.children[0].children[0].setAttribute("src", "/img/icons/fx_totem.gif");
                ptr.children[0].children[0].style = "width:25px;";
            }
            profaction.parentNode.appendChild(pnode);
        }
    }
}
//Get dinozrace and switch case thru it fill variables, add inode to table on levelup screen
// Unfortunately there is no reference to race on the levelup screen...
/*var avatarobj = document.getElementsByClassName("avatar");
var avatarMO = "" + avatarobj[0].onmouseover;
var dinozRace = avatarMO.substring(avatarMO.indexOf("<h1>")+4,avatarMO.indexOf("</h1>"));
var invoc_image = "http://imgup.motion-twin.com/dinorpg/b/7/8270bbc2_1875.jpg";
var invoc_getat_img = "http://data.en.dinorpg.com/img/pnj/elmaster.swf?v=0";
var invoc_getat_name = "Elemental Master";
var invoc_getat_loc = "Big-All-Hot Vulcano (Lavapit)";
var invoc_name = "Raijin";
var invoc_power = 'Attacks all enemies with a power of 20 <img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="">';
var invoc_skills = '<img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="">Lightning <br/>+<br/> <img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt=""> Elasticity';

var inode = document.createElement("div");
inode.innerHTML = '<div style="float:left; width:100%;"><table><tr>' +
    '<td rowspan="6"><img src=' + invoc_image + ' alt=""></td>' +
    '<td>'+ dinozRace + '</td>' +
    '<td rowspan="4"><embed scale="noscale" menu="false" flashvars="frame=speak&amp;background=1" allowscriptaccess="always" quality="high" src=' + invoc_getat_img + ' type="application/x-shockwave-flash" height="100" width="100">' +
    '</emded></td></tr><tr><td nowrap>' + invoc_getat_name + '</td></tr><tr><td>' + invoc_getat_loc + '</td></tr><tr><td>' + invoc_name + '</td></tr>' +
    '<tr><td>' + invoc_power + '</td></tr>' +
    '<tr><td nowrap>' + invoc_skills + '</td></tr>';
   
    trs[1].parentNode.parentNode.appendChild(inode); */

/* Level-up info in test fase, currently only a link to Rianon's DinoRPG page, but the intention is to list all the skills below the levelupbox */
var levelupheader = document.getElementsByClassName("lup");
//toggleView();
/*for(var propertyName in levelupheader[0]) {
    alert(propertyName + ' - ' + levelupheader[0][propertyName]);
   
}*/

if (levelupheader[0] && levelupheader[0].className == "lup") {
    var skillselect = document.getElementsByClassName('result');
    //alert(skillselect[0].childNodes[1].childNodes[1].childNodes[1].src);
    var node = document.createElement("div");
    node.id = "skills_div";
    //node.innerHTML += '<div style="background-color:#E70000 !important; border-color:#fff; color:#fff;"> <img src="http://en.dinorpg.com/img/icons/elem_0.gif"/> <strong>TEST</strong>' + 
    //skillselect[0].childNodes[1].childNodes[2].childNodes[1].childNodes[1].src + '</div>';
    switch (skillselect[0].childNodes[1].childNodes[1].childNodes[1].src) {
        case "http://en.dinorpg.com/img/icons/elem_0.gif": /* Fire skills */
            node.innerHTML = '<div style="background-color:#E70000 !important; border-color:#fff; color:#fff;"> <img src="http://en.dinorpg.com/img/icons/elem_0.gif"/> <strong>FIRE</strong>' +
'<div style="float:left; width:100%;"><table><tr>' +
'<table><tr><th style="background-color:#E70000 !important; border-color:#fff; color:#fff;">&nbsp;Level 1</th>' +
'<th style="background-color:#E70000 !important; border-color:#fff; color:#fff;">&nbsp;Level 2</th>' +
'<th style="background-color:#E70000 !important; border-color:#fff; color:#fff;">&nbsp;Level 3</th>' +
'<th style="background-color:#E70000 !important; border-color:#fff; color:#fff;">&nbsp;Level 4</th>' +
'<th style="background-color:#E70000 !important; border-color:#fff; color:#fff;">&nbsp;Level 5</th></tr>' +
'<tr><td rowspan="7" style="background-color:#F37F7F !important; border-color:#fff; color:#333;">Strength</td>' +
'<td rowspan="4" style="background-color:#F37F7F !important; border-color:#fff; color:#333;">Martial Arts</td>' +
'<td style="background-color:#F59999 !important; border-color:#fff; color:#D30000;">Blowtorch palm</td>' +
'<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="background-color:#F59999 !important; border-color:#fff; color:#333;">Vigilance</td>' +
'<td style="background-color:#F7A6A6 !important; border-color:#fff; color:#333;">Warlord</td>' +
'<td style="border:none; background-color:transparent;></td><td style="border:none; background-color:transparent;></td></tr>' +
'<tr><td style="margin-bottom: 20px;line-height: 1.6em;background-color:#F59999 !important; border-color:#fff; color:#333;">Waikikido</td>' +
'<td style="background-color:#605f5f !important; border-color:#fff; color:#bababa;">Bazalt Armor</td>' +
'<td style="border:none; background-color:transparent;"></td></tr> <tr><td style="background-color:#D2D2D2 !important; border-color:#fff; color:#333;">Buddha</td>' +
'<td style="border:none; background-color:transparent;></td><td style="border:none; background-color:transparent;></td></tr>' +
'<tr><td rowspan="2" style="background-color:#F48C8C !important; border-color:#fff; color:#333;">Charge</td>' +
'<td rowspan="2" style="background-color:#F59999 !important; border-color:#fff; color:#D30000;">Kamikaze</td>' +
'<td style="background-color:#F7A6A6 !important; border-color:#fff; color:#333;">Ram</td>' +
'<td style="border:none; background-color:transparent;"></td></tr> <tr>' +
'<td style="background-color:#605f5f !important; color:#bababa">Sprint</td>' +
'<td style="border:none; background-color:transparent;"></td></tr>' +
'<tr><td style="background-color:#D2D2D2 !important; border-color:#fff; color:#333;">Divine Propulsion</td>' +
'<td style="background-color:#D8D8D8 !important; border-color:#fff; color:#E50099">Infernal Talons</td></tr>' +
'<tr><td rowspan="7" style="color:#363636; background-color:#F48C8C !important;">Burning Claws</td>' +
'<td rowspan="2" style="color:#267F00; background-color:#F59999 !important;">Smashroom Hunter</td>' +
'<td style="color:#267F00; background-color:#F7A6A6 !important;">Giant Hunter</td>' +
'<td style="color:#267F00; background-color:#F8B2B2 !important;">Dragon Hunter</td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#D30000; background-color:#F7A6A6 !important;">Lava Flow</td>' +
'<td style="color:#333333; background-color:#D8D8D8 !important;">Vulcan</td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td rowspan="5" style="color:#D30000; background-color:#F59999 !important;">Burning Breath</td>' +
'<td rowspan="3" style="background-color:#F7A6A6 !important;">Combustion</td>' +
'<td style="color:#E50099; background-color:#F8B2B2 !important;">Torch</td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#BBBBBB;background-color:#666666 !important;">Elementary Teacher</td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#333333; background-color:#D8D8D8 !important;">Flying Totem</td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#D30000; background-color:#F7A6A6 !important;">Fire Ball</td>' +
'<td style="color:#333333; background-color:#D8D8D8 !important;">Armor of Ifrit</td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#333333; background-color:#D2D2D2 !important;">Dijin</td>' +
'<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td rowspan="6" style="background-color:#F37F7F !important;color:#4F92C1;">Wrath</td>' +
'<td rowspan="4" style="color:#363636; background-color:#F48C8C !important;">Fury</td>' +
'<td rowspan="2" style="color:#363636; background-color:#F59999 !important;">Incandescent Aura</td>' +
'<td style="color:#D30000; background-color:#F7A6A6 !important;">Meteors</td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#333333; background-color:#D2D2D2 !important;">Golem</td>' +
'<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td rowspan="2" style="color:#363636; background-color:#F59999 !important;">Vengeance</td>' +
'<td style="color:#BBBBBB;background-color:#666666 !important;">Vendetta</td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#333333; background-color:#D2D2D2 !important;">Odine</td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#363636; background-color:#F48C8C !important;" rowspan="2">Warm Blood</td>' +
'<td style="color:#D30000; background-color:#F59999 !important;">Nap</td>' +
'<td style="color:#E50099; background-color:#F7A6A6 !important;">Self-Control</td>' +
'<td style="color:#E50099; background-color:#F8B2B2 !important;">Brave</td>' +
'</tr><tr><td style="color:#363636; background-color:#F59999 !important;">Burning Heart</td>' +
'<td style="color:#333333; background-color:#D2D2D2 !important;">Blessing of the Fairies</td>' +
'<td style="border:none; background-color:transparent;"></td></tr>' +
'<tr><td colspan="5"><a href="http://dinorpg.novasoftware.pl/Skills/Fire" target="_blank" style="target-new: tab;">Fire skills</a></td></table></div>' +
'<div style="float:left; width:100%;"><table><tr>' +
       '<th colspan="5" style="background-color:#E70000 !important; color:#fff;">&nbsp;<strong>FIRE 50+</strong></th></tr><tr>' +
        '<th style="background-color:#E70000 !important; border-color:#fff; color:#fff; font-variant:small-caps;">&nbsp;Level 1</th>' +
        '<th style="background-color:#E70000 !important; border-color:#fff; color:#fff; font-variant:small-caps;">&nbsp;Level 2</th>' +
        '<th style="background-color:#E70000 !important; border-color:#fff; color:#fff; font-variant:small-caps;">&nbsp;Level 3</th>' +
        '<th style="background-color:#E70000 !important; border-color:#fff; color:#fff; font-variant:small-caps;">&nbsp;Level 4</th>' +
        '<th style="background-color:#E70000 !important; border-color:#fff; color:#fff; font-variant:small-caps;">&nbsp;Level 5</th></tr>' +
        '<tr><td rowspan="5" style="background-color:#F37F7F !important; border-color:#fff; color:#393939;">Dinoz Max-Protein</td>' +
        '<td rowspan="3" style="background-color:#F48C8C !important; border-color:#fff; color:#D30000;">Attenuator</td>' +
        '<td rowspan="3" style="background-color:#F59999 !important; border-color:#fff; color:#393939;">Magma Shell</td>' +
        '<td style="background-color:#F7A6A6 !important; border-color:#fff; color:#393939;">Burning Fever</td>' +
        '<td style="background-color:#F8B2B2 !important; border-color:#fff; color:#4F92C1;">Ember Country</td></tr><tr>' +
        '<td rowspan="2" style="background-color:#F7A6A6 !important; border-color:#fff; color:#393939;">Artemesian Prayer</td>' +
        '<td style="background-color:#F8B2B2 !important; border-color:#fff; color:#D30000;">Rocky Receptacle</td></tr><tr>' +
        '<td style="background-color:#F8B2B2 !important; border-color:#fff; color:#4F92C1;">Phoenix Feather</td></tr><tr>' +
        '<td rowspan="2" style="background-color:#F48C8C !important; border-color:#fff; color:#393939;">Deep Red</td>' +
        '<td rowspan="2" style="background-color:#F59999 !important; border-color:#4F92C1; color:#363636;">Battle Cry</td>' +
        '<td style="background-color:#F7A6A6 !important; border-color:#fff; color:#393939;">Flaming Armour</td>' +
        '<td style="background-color:#F8B2B2 !important; border-color:#fff; color:#393939;">Brazier Fist</td></tr><tr>' +
        '<td style="background-color:#F7A6A6 !important; border-color:#fff; color:#393939;">Joker</td>' +
        '<td style="background-color:#F8B2B2 !important; border-color:#fff; color:#4F92C1;">Frat Party</td></tr><tr>' +
        '<tr><td colspan="5"><a href="http://dinorpg.novasoftware.pl/Skills/Level50" target="_blank" style="target-new: tab;">Level 50 skills</a></td></table></div>' +
'<div style="float:left; width:100%;"><table><tr>' +
'<th colspan="5" style="background-color:#E70000 !important; color:#fff;">&nbsp;DOUBLE SKILLS</th>' +
'</tr><tr><td style="color:#BBBBBB;background-color:#666666 !important;">Basalt Armor</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_1.gif" alt="Wood" /> Cocoon<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Waikikido</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#DFDFDF !important;">Increases the armor of the Dinoz by 3.</td>' +
'<td style="background-color:#C5C5C5 !important;">-</td></tr><tr>' +
'<td style="color:#BBBBBB;background-color:#666666 !important;">Sprint </td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" /> Chaos Path<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Kamikaze</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#DFDFDF !important;">Increases the initiative by 6.</td>' +
'<td style="background-color:#C5C5C5 !important;">-</td></tr><tr>' +
'<td style="color:#BBBBBB;background-color:#666666 !important;">Elementary Teacher</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_2.gif" alt="Water" /> Absolute Zero<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Combustion</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#DFDFDF !important;">Increase of 2 elements Water and Fire</td>' +
'<td style="background-color:#C5C5C5 !important;">-</td></tr><tr>' +
'<td style="color:#BBBBBB;background-color:#666666 !important;">Vendetta  </td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Vengeance<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Achilles Heel</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#DFDFDF !important;">Increases the chance of counter-attacks by 20%.</td>' +
'<td style="background-color:#C5C5C5 !important;">-</td></tr></table></div>' +
'<div style="float:left; width:100%;"><table><tr>' +
'<th colspan="5" style="background-color:#E70000 !important; color:#fff;">&nbsp;INVOCATIONS</th>' +
'</tr><tr><td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=996Dk2Gj03gOU000&amp;chk=40070414"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style=" background-color:#D2D2D2 !important;">Buddha</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Awakening <br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" /> Concentration <br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Martial Arts</td>' +
'<td style="background-color:#DFDFDF !important;">+10 defense to each element on each dinoz on the team<br />' +
'<span style="color:red;font-size:11px;font-weight:bold;">Hippoclam only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td>' +
'</tr><tr><td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=09bgZuey1UGFZ000&amp;chk=3524596"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style=" background-color:#D2D2D2 !important;">Vulcan</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" /> Diamond Fangs <br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Lava Flow</td>' +
'<td style="background-color:#DFDFDF !important;">Attack all enemies with a power of 20<img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /><br  />' +
'<span style="color:red;font-size:11px;font-weight:bold;">Moueffe only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td>' +
'</tr><tr><td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=E9dgDKeTT9bq3000&amp;chk=193913480"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style=" background-color:#D2D2D2 !important;">Flying Totem</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Awakening<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Combustion </td>' +
'<td style="background-color:#DFDFDF !important;">Attacks an enemy with a strength of 30<img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" />' +
'<br /><span style="color:red;font-size:11px;font-weight:bold;">Kabuki only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td>' +
'</tr><tr><td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=194j1tF6tlGm6000&amp;chk=155735376"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style=" background-color:#D2D2D2 !important;">Armor of Ifrit</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_1.gif" alt="Wood" /> Faroe Heritage<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Fireball </td>' +
'<td style="background-color:#DFDFDF !important;">Improve <img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> ' +
' element defense by 20 points for the whole team.<br />' +
'<span style="color:red;font-size:11px;font-weight:bold;">Softpig only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td>' +
'</tr><tr><td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=69aHSFJbl3vx1000&amp;chk=90560808"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style=" background-color:#D2D2D2 !important;">Dijin</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Fetid Breath <br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Burning Breath</td>' +
'<td style="background-color:#DFDFDF !important;">Attacks all enemies with an <img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" />' +
' invocation of strength x20<br /><span style="color:red;font-size:11px;font-weight:bold;">Pteroz only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td>' +
'</tr><tr><td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=593gzrKTAgcvD000&amp;chk=107161356"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style=" background-color:#D2D2D2 !important;">Golem</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Incandescent aura<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" /> Elemental Fission</td>' +
'<td style="background-color:#DFDFDF !important;">Increase +20<img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" /> ' +
' defense for all Dinoz in your group<br /><span style="color:red;font-size:11px;font-weight:bold;">Rocky only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td>' +
'</tr><tr><td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=89IzFQnzOCWTW000&amp;chk=256395228"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style=" background-color:#D2D2D2 !important;">Odine</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Vengeance <br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_2.gif" alt="Water" /> No Mercy</td>' +
'<td style="background-color:#DFDFDF !important;">Attacks an enemy with a strength of 30<img src="http://en.dinorpg.com/img/icons/elem_2.gif" alt="Water" />' +
'<br /><span style="color:red;font-size:11px;font-weight:bold;">Sirain only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td>' +
'</tr><tr><td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=A9XB6utlJYdV0000&amp;chk=198040964"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style=" background-color:#D2D2D2 !important;">Blessing of the Fairies</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Burning Heart<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_1.gif" alt="Wood" /> Primal State</td>' +
'<td style="background-color:#DFDFDF !important;">Add 10 initiative to all dinoz in the group.<br />' +
'<span style="color:red;font-size:11px;font-weight:bold;">Gorilloz only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td>' +
'</tr><tr><td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=D9VVsvQJNnvVZ110&amp;chk=121712486"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style=" background-color:#D2D2D2 !important;">Salamander</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Blowtorch palm<br/>or Vigilance<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_2.gif" alt="Water" /> Fatal Hit</td>' +
'<td style="background-color:#DFDFDF !important;">Attacks an enemy with a strength of 40<img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" />.<br />' +
'<span style="color:red;font-size:11px;font-weight:bold;">Feros only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td></tr></table></div>' +
'<div style="float:left; width:100%;"><table><tr><th colspan="5" style="background-color:#E70000 !important; border-color:#fff;">&nbsp;STRENGTH PATH</th>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;1&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Strength</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">Increase the strength of all assaults by 1</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F9BFBF !important;">-</td>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;2&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Martial Arts</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">Increase the strength of all assaults by 2</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F9BFBF !important;">-</td>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;2&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Charge</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">Increases the strength of the first attack by 5</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F9BFBF !important;">-</td>' +
'</tr><tr><td style="background-color:#BEBEBE !important;">&nbsp;2&nbsp;</td><td style=" background-color:#D2D2D2 !important;">Divine Propulsion</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#DFDFDF !important;">Increases speed of fire attack by 30% and decreases fire element by 2<br />' +
'<span style="color:red;font-size:11px;font-weight:bold;">Quetzu only.</span></td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#DFDFDF !important;">-</td>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;3&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Blowtorch Palm</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">Attacks one enemy with a Fire power by 10 then decreases the Dinoz initiative by 15</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F7A6A6 !important;">weak</td>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;3&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Vigilance</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">Increases the Fire defense by 5</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F9BFBF !important;">-</td>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;3&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Waïkikidô</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">Increases the counter-attack chance by 10% and the maximum of health points by 20. Decreases the Dinoz initiative by 5</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F9BFBF !important;">-</td>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;3&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Kamikaze</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">Attacks one enemy with a Fire power 15 then the Dinoz loses half of his life</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F7A6A6 !important;">weak</td>' +
'</tr><tr><td style="background-color:#BEBEBE !important;">&nbsp;3&nbsp;</td><td style=" background-color:#D2D2D2 !important;">Infernal Talons</td>' +
'<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
'<td style="background-color:#DFDFDF !important;">Inflicts continuous fire damage on an adversary<br />' +
'<span style="color:red;font-size:11px;font-weight:bold;">Quetzu only.</span> <span style="font-size:11px;font-weight:bold;">The black flames does damage equal the flaming dinoz' +
' element (per round like Acid Blood), but the damage is based on the target (flaming) dinoz, not on the attackers (the quetzu) fire element.</span></td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#DFDFDF !important;">-</td>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;4&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Warlord</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">Increases the strength of all assaults of all Dinoz in the Group by 2</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F9BFBF !important;">-</td>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;4&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Ram</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">Increases the strength of the first assault by 20</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F9BFBF !important;">-</td>' +
'</tr><tr><th colspan="5" style="background-color:#E70000 !important; border-color:#fff;">&nbsp;BURNING CLAWS PATH</th>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;1&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Burning Claws</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">Increases the strength of all fire assaults by 7</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F9BFBF !important;">-</td>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;2&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Smashroom hunter</td>' +
'<td style="background-color:#8EAF02 !important;color:#FFFFFF;">&nbsp;C&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">Enables the Dinoz to hunt small animals in some places</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F9BFBF !important;">-</td>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;2&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Burning Breath</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">Attacks all enemies with a Fire power by 5</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F7A6A6 !important;">weak</td>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;3&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Giant Hunter</td>' +
'<td style="background-color:#8EAF02 !important;color:#FFFFFF;">&nbsp;C&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">Enables the Dinoz to hunt medium animals in some places</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F9BFBF !important;">-</td>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;3&nbsp;</td>' +
'<td style=" background-color:#F7A6A6 !important;">Lava Flow</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">Attack 1 enemy with Fire strength of 12</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F59999 !important;">normal</td>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;3&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Fire Ball</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">Attacks one enemy with a Fire power 7</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F7A6A6 !important;">weak</td>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;3&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Combustion</td>' +
'<td style="background-color:#1399EB !important;color:#FFFFFF;">&nbsp;E&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">All the enemies lose health points equal to their Wood element</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F7A6A6 !important;">weak</td>' +
' </tr><tr><td style="background-color:#F37F7F !important;">&nbsp;4&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Dragon Hunter</td>' +
'<td style="background-color:#8EAF02 !important;color:#FFFFFF;">&nbsp;C&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">Enables the Dinoz to hunt rare and dangerous animals in some places</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F9BFBF !important;">-</td>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;4&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Torch</td>' +
'<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">The Dinoz is on fire<br />Increases defense +10 fire (this part of the effect is not noted in the description)<br />' +
'<span style="font-size:11px;font-weight:bold;">When an enemy lands an attack it will loose up to 1-10' +
'<img src="http://en.dinorpg.com/img/icons/small_life_en.gif" alt="HP" />, ' +
' very effective, but your dinoz will also loose 1 HP after each attack</span></td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F9BFBF !important;">-</td>' +
'</tr><tr><th colspan="5" style="background-color:#E70000 !important; border-color:#fff;">&nbsp;STRENGTH PATH</th>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;1&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Wrath</td>' +
'<td style="background-color:#1399EB !important;color:#FFFFFF;">&nbsp;E&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">Increases the strength of the next assault by 25%</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F7A6A6 !important;">weak</td>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;2&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Fury</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">Increases the strength of all assaults by 3 and decreases all defenses by 2</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F9BFBF !important;">-</td>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;2&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Warm Blood</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">Increases the initiative by 4</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F9BFBF !important;">-</td>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;3&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Incandescent Aura</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">Increases the Fire element by 2</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F9BFBF !important;">-</td>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;3&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Vengeance</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">Increases the counter-attack chances by 5%</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F9BFBF !important;">-</td>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;3&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Burning Heart</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">Increases the strength of all assaults by 12 and increases the maximum health points by 20</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F9BFBF !important;">-</td>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;3&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Nap</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">The Dinoz recovers up to 20 health points and falls asleep</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F7A6A6 !important;">weak</td>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;4&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Meteors</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">Attacks all enemies with a Fire power 10</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F37F7F !important;">high</td>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;4&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Self-Control</td>' +
'<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">Prevents all negative status and decreases the initiative by 3 ' +
'<span style="font-size:11px;font-weight:bold;">Makes your Dinoz unaffected by any of the enemies attack effects like slowing it down with gel,' +
' marsh, vines or getting poisoned.</span></td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F9BFBF !important;">-</td>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;5&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Brave</td>' +
'<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">The Dinoz wont be able to be part of a Group anymore.' +
' Increases the Fire element by 6 the maximum life by 50 and the speed by 15%.</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F9BFBF !important;">-</td></tr></table></div>' +
'<div style="float:left; width:100%;"><table><tr><th colspan="5" style="background-color:#E70000 !important; border-color:#fff;">&nbsp;<img src="http://data.en.dinorpg.com/img/icons/obj_spher1.gif" alt="Fire Sphere" />&nbsp;SPHERE SKILLS</th>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;1&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Brazier</td>' +
'<td style="background-color:#1399EB !important;color:#FFFFFF;">&nbsp;E&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">Attacks all enemies with Fire at a strength of 3.</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F59999 !important;">normal</td>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;2&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Detonation</td>' +
'<td style="background-color:#1399EB !important;color:#FFFFFF;">&nbsp;E&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">The Dinoz loses 5 health points and gain 15 intiative.</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000; background-color:#E70000 !important;">very high</td>' +
'</tr><tr><td style="background-color:#F37F7F !important;">&nbsp;3&nbsp;</td><td style=" background-color:#F7A6A6 !important;">Heart of the Phoenix</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#F9BFBF !important;">Increases the health points recovered at rest by 15%.</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#F9BFBF !important;">-</td></tr></table></div>'

            break;
        case "http://en.dinorpg.com/img/icons/elem_1.gif": /* Wood Skills */

            node.innerHTML = '<div style="background-color:#BE741A !important; border-color:#FFFFFF; color:#FFFFFF;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_1.gif" /> <strong>WOOD</strong>' +
'<div style="float:left; width:100%;"><table><tr style="background-color:#BE741A !important;color:#FFFFFF"><th>&nbsp;Level 1</th><th>&nbsp;Level 2</th>' +
'<th >&nbsp;Level 3</th><th >&nbsp;Level 4</th><th>&nbsp;Level 5</th>' +
'</tr><tr><td rowspan="7" style="color:#363636; background-color:#DEB98C !important;">Carapace</td><td rowspan="3" style="color:#E50099; background-color:#E2C098 !important;">Sympathetic</td>' +
'<td rowspan="2" style="color:#E50099; background-color:#E5C7A3 !important;">Faroe Heritage</td><td style="color:#4F92C1; background-color:#E8CEAF !important;">Gorilloz Spirit</td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr><td style="color:#333333; background-color:#D2D2D2 !important;">Armour of Ifrit</td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr><td style="color:#267F00; background-color:#E5C7A3 !important;">Planner</td><td style="border:none; background-color:transparent;"></td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr><td rowspan="4" style="color:#4F92C1; background-color:#E2C098 !important;">Vines</td>' +
'<td rowspan="2" style="color:#4F92C1; background-color:#E5C7A3 !important;">Precocious Spring</td><td style="color:#363636; background-color:#E8CEAF !important;">Forest Keeper</td>' +
'<td style="color:#333333; background-color:#D8D8D8 !important;">Yggdrasil</td></tr><tr><td style="color:#333333; background-color:#D8D8D8 !important;">Hive Queen</td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr><td rowspan="2" style="color:#4F92C1; background-color:#E5C7A3 !important;">Primal State</td>' +
'<td style="color:#363636; color:#BBBBBB;background-color:#666666 !important;">Shock</td><td style="border:none; background-color:transparent;"></td></tr><tr><td style="color:#333333; background-color:#D2D2D2 !important;">Blessing of the Fairies</td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr><td rowspan="5" style="color:#363636; background-color:#E2C098 !important;">Endurance</td>' +
'<td rowspan="3" style="color:#363636; background-color:#E5C7A3 !important;">Growth</td><td rowspan="2" style="color:#E50099; background-color:#E8CEAF !important;">Cocoon</td>' +
'<td style="color:#363636; background-color:#EBD5BA !important;">Giant</td><td style="color:#363636; background-color:#EFDCC6 !important;">Colossive</td>' +
'</tr><tr><td style="color:#363636; color:#BBBBBB;background-color:#666666 !important;">Bazalt Armor</td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#363636; background-color:#E8CEAF !important;">Wide Jaw</td><td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td>' +
'</tr><tr><td rowspan="2" style="color:#267F00; background-color:#E5C7A3 !important;">Search</td><td style="color:#267F00; background-color:#E8CEAF !important;">Detective</td>' +
'<td style="color:#267F00; background-color:#EBD5BA !important;">Archeologist</td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#267F00; background-color:#E8CEAF !important;">Search Expert</td><td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td>' +
'</tr><tr><td rowspan="7" style="color:#363636; background-color:#DEB98C !important;">Savagery</td><td rowspan="4" style="color:#4F92C1; background-color:#E2C098 !important;">Korgon Reinforcement</td>' +
'<td style="color:#363636; background-color:#E5C7A3 !important;">Acrobat</td><td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td>' +
'</tr><tr><td rowspan="3" style="color:#363636; background-color:#E5C7A3 !important;">Wild Instinct</td><td style="color:#FFFFFF; color:#BBBBBB;background-color:#666666 !important;">Earth Tremor</td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr><td style="color:#B200FF; background-color:#E8CEAF !important;">Engineer</td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr><td style="color:#333333; background-color:#D2D2D2 !important;">Werewolf</td><td style="border:none; background-color:transparent;"></td>' +
'</tr><tr><td rowspan="3" style="color:#363636; background-color:#E2C098 !important;">Tenacity</td><td rowspan="2" style="color:#E50099; background-color:#E5C7A3 !important;">Charisma</td>' +
'<td style="color:#B200FF; background-color:#E8CEAF !important;">Leader</td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#333333; background-color:#D2D2D2 !important;">Grand High Babooner</td><td style="border:none; background-color:transparent;"></td>' +
'</tr><tr><td style="color:#4F92C1; background-color:#E5C7A3 !important;">Magic Resistance</td><td style="color:#363636; color:#BBBBBB;background-color:#666666 !important;">Tireless</td>' +
'<td style="border:none; background-color:transparent;"></td></tr>' +
'<tr><td colspan="5"><a href="http://dinorpg.novasoftware.pl/Skills/Wood" target="_blank" style="target-new: tab;">Wood skills</a></td></table></div>' +  /* skills table end */
'<div style="float:left; width:100%;"><table><tr>' +
'<th colspan="5" style="background-color:#BE741A !important; color:#fff;">&nbsp;DOUBLE SKILLS</th>' +
'</tr><tr><td style="background-color:#666666 !important;color:#BBBBBB;">Shock</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_1.gif" alt="Wood" /> Primal State<br /> ' +
'<img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" /> Gaia Path</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#DFDFDF !important;">Increases the elements Wood and Lightning. Adds the value of element Wood (onslaught) to Lightning and adds the value of' +
' Lightning element to the Wood element.</td>' +
'<td style="background-color:#D2D2D2 !important;">-</td>' +
'</tr><tr><td style="background-color:#666666 !important;color:#BBBBBB;">Basalt Armor</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_1.gif" alt="Wood" /> Cocoon<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Waikikido</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#DFDFDF !important;">Increases the armor of the Dinoz by 3.</td>' +
'<td style="background-color:#D2D2D2 !important;">-</td>' +
'</tr><tr><td style="background-color:#666666 !important;color:#BBBBBB;">Earth Tremor</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Palms Ejectable<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_1.gif" alt="Wood" /> Wild Instinct</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style="background-color:#DFDFDF !important;">Ground attack with a power of Wood + Air at a strength of 4.</td>' +
'<td style="background-color:#D2D2D2 !important;">weak</td>' +
'</tr><tr><td style="background-color:#666666 !important;color:#BBBBBB;">Tireless  </td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_2.gif" alt="Water" /> Aqueous Clone<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_1.gif" alt="Wood" /> Magic Resistance</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#DFDFDF !important;">Increases all defenses by 2.</td>' +
'<td style="background-color:#D2D2D2 !important;">-</td></tr></table></div>' +
'<div style="float:left; width:100%;"><table><tr>' +
'<th colspan="5" style="background-color:#BE741A !important; color:#fff;">&nbsp;INVOCATIONS</th>' +
'</tr><tr><td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=194j1tF6tlGm6000&amp;chk=155735376"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style="background-color:#D2D2D2 !important;">Armor of Ifrit</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_1.gif" alt="Wood" /> Faroe Heritage<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Fireball </td>' +
'<td style="background-color:#DFDFDF !important;">Improve <img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> ' +
' element defense by 20 points for the whole team.<br />' +
'<span style="color:red;font-size:11px;font-weight:bold;">Softpig only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td>' +
'</tr><tr><td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=B9DCTABPXtMk6000&amp;chk=254132324"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style="background-color:#D2D2D2 !important;">Yggdrasil</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Gathering<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_1.gif" alt="Wood" /> Forest Keeper</td>' +
'<td style="background-color:#DFDFDF !important;">+20 to wood defense for each dinoz on the team' +
'<br /><span style="color:red;font-size:11px;font-weight:bold;">Wanwan only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td>' +
'</tr><tr><td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=G9uzGJps8dLAi000&amp;chk=85870940"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style="background-color:#D2D2D2 !important;">Hive Queen</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Vivacious Wind<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_1.gif" alt="Wood" /> Precocious Spring</td>' +
'<td style="background-color:#DFDFDF !important;">Empty opponent dinoz endurance bar<br />' +
'<span style="color:red;font-size:11px;font-weight:bold;">Etherwasp only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td>' +
'</tr><tr><td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=A9XB6utlJYdV0000&amp;chk=198040964"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style="background-color:#D2D2D2 !important;">Blessing of the Fairies</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Burning Heart<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_1.gif" alt="Wood" /> Primal State</td>' +
'<td style="background-color:#DFDFDF !important;">Add 10 initiative to all dinoz in the group.<br />' +
'<span style="color:red;font-size:11px;font-weight:bold;">Gorilloz only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td>' +
'</tr><tr><td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=49MJoylhqec5U000&amp;chk=256037178"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style="background-color:#D2D2D2 !important;">Werewolf</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Vivacious Wind<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_1.gif" alt="Wood" /> Wild Instinct </td>' +
'<td style="background-color:#DFDFDF !important;">Attack all enemies with a power of 30<img src="http://en.dinorpg.com/img/icons/elem_1.gif" alt="Wood" /><br />' +
'<span style="color:red;font-size:11px;font-weight:bold;">Castivorous only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td>' +
'</tr><tr><td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=H5kr28zPT6bEM000&amp;chk=209617074"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style="background-color:#D2D2D2 !important;">Grand High Babooner</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_1.gif" alt="Wood" /> Charisma <br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" /> Lightning Dance</td>' +
'<td style="background-color:#DFDFDF !important;">+20% dodge to your team<br />' +
'<span style="color:red;font-size:11px;font-weight:bold;">Tofufu only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td></tr></table></div>' +
'<div style="float:left; width:100%;"><table><tr><th colspan="5" style="background-color:#BE741A !important; border-color:#fff;">&nbsp;CARAPACE PATH</th>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;1&nbsp;</td><td style="background-color:#E8CEAF !important;">Carapace</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Increases the armor by 1</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#EFDCC6 !important;">-</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;2&nbsp;</td><td style="background-color:#E8CEAF !important;">Sympathetic</td>' +
'<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">The Dinoz can be followed by an additional Dinoz</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#EFDCC6 !important;">-</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;2&nbsp;</td><td style="background-color:#E8CEAF !important;">Vines</td>' +
'<td style="background-color:#1399EB !important;color:#FFFFFF;">&nbsp;E&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Decreases the initiative of one enemy by 15</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8CEAF !important;">weak</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;3&nbsp;</td><td style="background-color:#E8CEAF !important;">Faroe Heritage</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Increases the strenght of the wood attacks by 12 and the armor by 1</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#EFDCC6 !important;">-</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;3&nbsp;</td><td style="background-color:#E8CEAF !important;">Planner</td>' +
'<td style="background-color:#8EAF02 !important;color:#FFFFFF;">&nbsp;C&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Enables the Dinoz to search an additional square</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#EFDCC6 !important;">-</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;3&nbsp;</td><td style="background-color:#E8CEAF !important;">Primal State</td>' +
'<td style="background-color:#1399EB !important;color:#FFFFFF;">&nbsp;E&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Cancels all positive status of the enemies and all negative status of the Group</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8CEAF !important;">weak</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;3&nbsp;</td><td style="background-color:#E8CEAF !important;">Precocious Spring</td>' +
'<td style="background-color:#1399EB !important;color:#FFFFFF;">&nbsp;E&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">All the other Dinoz in the Group recover health points up to the Wood element of the Dinoz</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8CEAF !important;">weak</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;4&nbsp;</td><td style="background-color:#E8CEAF !important;">Gorilloz Spirit</td>' +
'<td style="background-color:#1399EB !important;color:#FFFFFF;">&nbsp;E&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Calls a Gorilloz spirit to help in fight</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#DEB98C !important;">high</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;4&nbsp;</td><td style="background-color:#E8CEAF !important;">Forest Keeper</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Increases the Wood defense of all Dinoz in the Group by 3</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#EFDCC6 !important;">-</td>' +
'</tr><tr><th colspan="5" style="background-color:#BE741A !important; border-color:#fff;">&nbsp;ENDURANCE PATH</th>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;1&nbsp;</td><td style="background-color:#E8CEAF !important;">Endurance</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Increases the Wood defense by 2</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#EFDCC6 !important;">-</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;2&nbsp;</td><td style="background-color:#E8CEAF !important;">Growth</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Increases the strength of all assaults by 1 and increase the maximum' +
' <img src="http://en.dinorpg.com/img/icons/small_life_en.gif" alt="HP" /> by 20</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#EFDCC6 !important;">-</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;2&nbsp;</td><td style="background-color:#E8CEAF !important;">Search</td>' +
'<td style="background-color:#8EAF02 !important;color:#FFFFFF;">&nbsp;C&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Enables the Dinoz to find artifacts in some places</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#EFDCC6 !important;">-</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;3&nbsp;</td><td style="background-color:#E8CEAF !important;">Cocoon</td>' +
'<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Increases the speed of <img src="http://en.dinorpg.com/img/icons/small_life_en.gif" alt="HP" /> recovery when resting</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#EFDCC6 !important;">-</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;3&nbsp;</td><td style="background-color:#E8CEAF !important;">Wide Jaw</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Increases the strength of Wood assaults by 15</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#EFDCC6 !important;">-</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;3&nbsp;</td><td style="background-color:#E8CEAF !important;">Search Expert</td>' +
'<td style="background-color:#8EAF02 !important;color:#FFFFFF;">&nbsp;C&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Enables the Dinoz to search an additional square</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#EFDCC6 !important;">-</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;3&nbsp;</td><td style="background-color:#E8CEAF !important;">Detective</td>' +
'<td style="background-color:#8EAF02 !important;color:#FFFFFF;">&nbsp;C&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Enables the Dinoz to find uncommon artifacts in some places</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#EFDCC6 !important;">-</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;4&nbsp;</td><td style="background-color:#E8CEAF !important;">Giant</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Increases the assaults strength by 5, the max <img src="http://en.dinorpg.com/img/icons/small_life_en.gif" alt="HP" />' +
' by 30. Decreases the speed by 20%</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#EFDCC6 !important;">-</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;4&nbsp;</td><td style="background-color:#E8CEAF !important;">Archeologist</td>' +
'<td style="background-color:#8EAF02 !important;color:#FFFFFF;">&nbsp;C&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Enables the Dinoz to find rare or exceptional artifacts in some places</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#EFDCC6 !important;">-</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;5&nbsp;</td><td style="background-color:#E8CEAF !important;">Colossus</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Increases the strength of all assaults by 15 and the ' +
'<img src="http://en.dinorpg.com/img/icons/small_life_en.gif" alt="HP" /> by 50. Decreases speed by 50%</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#EFDCC6 !important;">-</td>' +
'</tr><tr><th colspan="5" style="background-color:#BE741A !important; border-color:#fff;">&nbsp;SAVAGERY PATH</th>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;1&nbsp;</td><td style="background-color:#E8CEAF !important;">Savagery</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Increases the power of Wood assaults by 5</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#EFDCC6 !important;">-</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;2&nbsp;</td><td style="background-color:#E8CEAF !important;">Korgon Reinforcement</td>' +
'<td style="background-color:#1399EB !important;color:#FFFFFF;">&nbsp;E&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Calls a Korgon to help in the fight</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E5C7A3 !important;">normal</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;2&nbsp;</td><td style="background-color:#E8CEAF !important;">Tenacity</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Increases the minimum damage by 1</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#EFDCC6 !important;">-</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;3&nbsp;</td><td style="background-color:#E8CEAF !important;">Acrobat</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Increases the speed by 15%</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#EFDCC6 !important;">-</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;3&nbsp;</td><td style="background-color:#E8CEAF !important;">Wild Instinct</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Increases the Wood element by 2</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#EFDCC6 !important;">-</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;3&nbsp;</td><td style="background-color:#E8CEAF !important;">Charisma</td>' +
'<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">The Dinoz can be followed by an additional Dinoz</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#EFDCC6 !important;">-</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;3&nbsp;</td><td style="background-color:#E8CEAF !important;">Magic Resistance</td>' +
'<td style="background-color:#1399EB !important;color:#FFFFFF;">&nbsp;E&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Cancels all negative status</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8CEAF !important;">weak</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;4&nbsp;</td><td style="background-color:#E8CEAF !important;">Engineer</td>' +
'<td style="background-color:#B200A5 !important;color:#FFFFFF;">&nbsp;U&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">All Dinoz can be equipped with an additional combat gear</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#EFDCC6 !important;">-</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;4&nbsp;</td><td style="background-color:#E8CEAF !important;">Leader</td>' +
'<td style="background-color:#B200A5 !important;color:#FFFFFF;">&nbsp;U&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Increases the maximum Dinoz number by 3</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#EFDCC6 !important;">-</td></tr></table></div>' +
'<div style="float:left; width:100%;"><table><tr><th colspan="5" style="background-color:#BE741A !important; border-color:#fff;">&nbsp;<img src="http://data.en.dinorpg.com/img/icons/obj_spher2.gif" alt="Wood Sphere" />&nbsp;SPHERE SKILLS</th>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;1&nbsp;</td><td style="background-color:#E8CEAF !important;">Acorn Thrower</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Attacks one nemy with Wood at a strenght of 5.</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E5C7A3 !important;">normal</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;2&nbsp;</td><td style="background-color:#E8CEAF !important;">Scratcher </td>' +
'<td style="background-color:#8EAF02 !important;color:#FFFFFF;">&nbsp;C&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Enables the Dinoz to search anadditional square.</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#EFDCC6 !important;">-</td>' +
'</tr><tr><td style="background-color:#DEB98C !important;">&nbsp;3&nbsp;</td><td style="background-color:#E8CEAF !important;">Good Whack</td>' +
'<td style="background-color:#1399EB !important;color:#FFFFFF;">&nbsp;E&nbsp;</td>' +
'<td style="background-color:#EFDCC6 !important;">Double the power of the next assault.</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#DEB98C !important;">high</td></tr></table></div>'

            break;
        case "http://en.dinorpg.com/img/icons/elem_2.gif": /* Water Skills */

            node.innerHTML = '<div style="background-color:#1399EB !important; border-color:#FFFFFF; color:#FFFFFF;"><img src="http://en.dinorpg.com/img/icons/elem_2.gif" /> Water' +
'<div style="float:left; width:100%;"><table><tr>' +
'<table><tr><th style="background-color:#1399EB !important; border-color:#fff; color:#fff;">Level 1</th>' +
'<th style="background-color:#1399EB !important; border-color:#fff; color:#fff;">Level 2</th>' +
'<th style="background-color:#1399EB !important; border-color:#fff; color:#fff;">Level 3</th>' +
'<th style="background-color:#1399EB !important; border-color:#fff; color:#fff;">Level 4</th>' +
'<th style="background-color:#1399EB !important; border-color:#fff; color:#fff;">Level 5</th></tr><tr>' +
'<td rowspan="5" style="color:#D30000; background-color:#89CCF5 !important;">Water Cannon</td>' +
'<td rowspan="3" style="color:#4F92C1; background-color:#95D1F6 !important;">Cold Shower</td>' +
'<td rowspan="2" style="color:#E50099; background-color:#A1D6F7 !important;">Sapper</td>' +
'<td style="color:#B200FF; background-color:#ADDBF8 !important;">Storekeeper</td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#363636; color:#BBBBBB;background-color:#666666 !important;">Bubble</td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#363636; background-color:#A1D6F7 !important;">Acupuncture</td>' +
'<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td rowspan="2" style="color:#D30000; background-color:#95D1F6 !important;">Gel</td>' +
'<td style="color:#D30000; background-color:#A1D6F7 !important;">Petrification</td>' +
'<td style="color:#D30000; background-color:#ADDBF8 !important;">Kaar-Sher Beam</td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#363636; background-color:#A1D6F7 !important;">Absolute Zero</td>' +
'<td style="color:#363636; color:#BBBBBB;background-color:#666666 !important;">Elementary Teacher</td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td rowspan="5" style="color:#363636; background-color:#95D1F6 !important;">Perception</td>' +
'<td rowspan="2" style="color:#267F00; background-color:#A1D6F7 !important;">Aperentice Fisherman</td>' +
'<td style="color:#4F92C1; background-color:#ADDBF8 !important;">March</td>' +
'<td style="color:#363636; color:#BBBBBB;background-color:#666666 !important;">Electrolysis</td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#267F00; background-color:#ADDBF8 !important;">Skilled Fisher</td>' +
'<td style="color:#267F00; background-color:#B8E0F9 !important;">Master Fisherman</td>' +
'<td style="color:#333333; background-color:#DFDFDF !important;">Sacred Whale</td></tr><tr>' +
'<td rowspan="3" style="color:#D30000; background-color:#A1D6F7 !important;">Tricky Hits</td>' +
'<td style="color:#D30000; background-color:#ADDBF8 !important;">Fatal Hits</td>' +
'<td style="color:#333333; background-color:#D8D8D8 !important;">Salamander</td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#363636; background-color:#ADDBF8 !important;">Undersea Training</td>' +
'<td style="color:#363636; background-color:#B8E0F9 !important;">Adv. Undersea Training</td>' +
'<td style="color:#E50099; background-color:#C4E5FA !important;">Life Guard</td>' +
'</tr><tr><td style="color:#333333; background-color:#D8D8D8 !important;">Hades</td>' +
'<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td rowspan="5" style="color:#363636; background-color:#89CCF5 !important;">Mutation</td>' +
'<td rowspan="2" style="color:#363636; background-color:#95D1F6 !important;">Underwater Karate</td>' +
'<td style="color:#4F92C1; background-color:#A1D6F7 !important;">Aqueous Clone</td>' +
'<td style="color:#363636; color:#BBBBBB;background-color:#666666 !important;">Tireless</td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#E50099; background-color:#A1D6F7 !important;">Poisoned Claws</td>' +
'<td style="color:#E50099; background-color:#ADDBF8 !important;">Acid Blood</td>' +
'<td style="color:#333333; background-color:#D8D8D8 !important;">Leviatan</td></tr><tr>' +
'<td rowspan="2" style="color:#E50099; background-color:#95D1F6 !important;">Ventral Pouch</td>' +
'<td style="color:#E50099; background-color:#A1D6F7 !important;">Without Mercy</td>' +
'<td style="color:#333333; background-color:#D2D2D2 !important;">Odine</td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#363636; background-color:#A1D6F7 !important;">Sumo</td>' +
'<td style="color:#B200FF; background-color:#ADDBF8 !important;">Cooker</td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#363636; background-color:#D2D2D2 !important;">Glowing Scales</td>' +
'<td style="color:#363636; background-color:#D8D8D8 !important;">Snakeskin</td></tr>' +
'<tr><td colspan="5"><a href="http://dinorpg.novasoftware.pl/Skills/Water" target="_blank" style="target-new: tab;">Water skills</a></td></table></div>' +
'<div style="float:left; width:100%;"><table><tr>' +
'<th colspan="5" style="background-color:#1399EB !important; color:#fff;">DOUBLE SKILLS</th>' +
'</tr><tr><td style="background-color:#666666;color:#BBBBBB;">Bubble</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_2.gif" alt="Water" /> Sapper<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Vaporous Form</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#DFDFDF !important;">Unaffected by all spells/skills without Wood spells/skills.<br />' +
'<span style="font-size:11px;">Bubble is a very good defense skill, it will stop attacks to the % value ' +
'of (water + air) / (sum of all elements) so for example dino with 30% water and 40% air ' +
'will eliminate 70% of the attack value.' +
' Does not stop the Venerable however.<br /></span></td>' +
'<td style="background-color:#C5C5C5 !important;">-</td></tr><tr>' +
'<td style="background-color:#666666;color:#BBBBBB;">Elementary Teacher</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_2.gif" alt="Water" /> Absolute Zero<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Combustion</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#DFDFDF !important;">Increase of 2 elements Water and Fire</td>' +
'<td style="background-color:#C5C5C5 !important;">-</td>' +
'</tr><tr><td style="background-color:#666666;color:#BBBBBB;">Electrolysis </td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_2.gif" alt="Water" /> Marsh<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" /> Lightning</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#DFDFDF !important;">Increases by 5% the Speed of all Dinoz group.</td>' +
'<td style="background-color:#C5C5C5 !important;">-</td></tr><tr>' +
'<td style="background-color:#666666;color:#BBBBBB;">Tireless  </td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_2.gif" alt="Water" /> Aqueous Clone<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_1.gif" alt="Wood" /> Magic Resistance</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#DFDFDF !important;">Increases all defenses by 2.</td>' +
'<td style="background-color:#C5C5C5 !important;">-</td></tr></table></div>' +
'<div style="float:left; width:100%;"><table><tr>' +
'<th colspan="5" style="background-color:#1399EB !important; color:#fff;">INVOCATIONS</th>' +
'</tr><tr><td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=294H72o5jtjyz000&amp;chk=198379612"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style="background-color:#D2D2D2 !important;">Sacred Whale</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" /> Adrenaline <br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_2.gif" alt="Water" /> Master Fisherman</td>' +
'<td style="background-color:#DFDFDF !important;">Improve water element defense by 20 points for the whole team.<br />' +
'<span style="color:red;font-size:11px;font-weight_bold;">Winks only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td>' +
'</tr><tr><td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=D9VVsvQJNnvVZ110&amp;chk=121712486"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style="background-color:#D2D2D2 !important;">Salamander</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Blowtorch palm <br />or Vigilance<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_2.gif" alt="Water" /> Fatal Hit</td>' +
'<td style="background-color:#DFDFDF !important;">Attacks an enemy with a strength of 40<img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" />.<br />' +
'<span style="color:red;font-size:11px;font-weight_bold;">Feros only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td>' +
'</tr><tr><td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=C93LSGvS7D6b5000&amp;chk=204596148"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style="background-color:#D2D2D2 !important;">Hades</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Fetit Breath<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_1.gif" alt="Wood" /> Tenacity<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_2.gif" alt="Water" /> Tricky Hits</td>' +
'<td style="background-color:#DFDFDF !important;">Poisons all enemies with a power of 17<br/>It also slows down enemies, though this seems to be bugged' +
'<br /><span style="color:red;font-size:11px;font-weight_bold;">Santaz only.</span></td>' +
'<td style="background-color:#C5C5C5 !important;">very high</td>' +
'</tr><tr><td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=F9dewY5ktLLxb000&amp;chk=85435258"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style="background-color:#D2D2D2 !important;">Leviatan</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Tornado <br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_2.gif" alt="Water" /> Acid Blood</td>' +
'<td style="background-color:#DFDFDF !important;">Attacks an enemy with a strength of 20<img src="http://en.dinorpg.com/img/icons/elem_2.gif" alt="Water" />' +
'<br /><span style="color:red;font-size:11px;font-weight_bold;">Mahamuti only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td>' +
'</tr><tr><td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=89IzFQnzOCWTW000&amp;chk=256395228"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style="background-color:#D2D2D2 !important;">Odine</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Vengeance <br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_2.gif" alt="Water" /> No Mercy</td>' +
'<td style="background-color:#DFDFDF !important;">Attacks an enemy with a strength of 30<img src="http://en.dinorpg.com/img/icons/elem_2.gif" alt="Water" />' +
'<br /><span style="color:red;font-size:11px;font-weight_bold;">Sirain only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td></tr></table></div>' +
'<div style="float:left; width:100%;"><table><tr><th colspan="5" style="background-color:#1399EB !important; border-color:#fff;">&nbsp;WATER CANNON PATH</th>' +
'</tr><tr><td style="background-color:#89CCF5 !important;">&nbsp;1&nbsp;</td><td style="background-color:#ADDBF8 !important;">Water Cannon</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">Attacks one enemy with a Water power 6</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#ADDBF8 !important;">weak</td></tr><tr>' +
'<td style=" background-color:#89CCF5 !important;">&nbsp;2&nbsp;</td><td style="background-color:#ADDBF8 !important;">Cold Shower</td>' +
'<td style="background-color:#1399EB !important;color:#FFFFFF;">&nbsp;E&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">Attacks all enemies with a Water power 2</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#ADDBF8 !important;">weak</td></tr><tr>' +
'<td style=" background-color:#89CCF5 !important;">&nbsp;2&nbsp;</td><td style="background-color:#ADDBF8 !important;">Gel</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">Attacks one enemy with a Water power 5. The enemy is after slower</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#ADDBF8 !important;">weak</td></tr><tr>' +
'<td style=" background-color:#89CCF5 !important;">&nbsp;3&nbsp;</td><td style="background-color:#ADDBF8 !important;">Acupuncture</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">Gives the status of healing. If the enemy lands an attack, the enemy loses 1 life point. ' +
'The Dinoz gain 1<img src="http://en.dinorpg.com/img/icons/small_life_en.gif" alt="HP" />.</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#C4E5FA !important;">-</td></tr><tr>' +
'<td style=" background-color:#89CCF5 !important;">&nbsp;3&nbsp;</td><td style="background-color:#ADDBF8 !important;">Sapper</td>' +
'<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">Increases chance of using battle gear by 50%</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#C4E5FA !important;">-</td></tr><tr>' +
'<td style=" background-color:#89CCF5 !important;">&nbsp;3&nbsp;</td><td style="background-color:#ADDBF8 !important;">Petrification</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">Petrifies an enemy. The enemy is turned into stone and is unable to use any skill or attack for a short time.</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#ADDBF8 !important;">weak</td></tr><tr>' +
'<td style=" background-color:#89CCF5 !important;">&nbsp;3&nbsp;</td><td style="background-color:#ADDBF8 !important;">Absolute Zero</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">Increase the defense against fire by 25</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#C4E5FA !important;">-</td></tr><tr>' +
'<td style=" background-color:#89CCF5 !important;">&nbsp;4&nbsp;</td><td style="background-color:#ADDBF8 !important;">Shop Keeper</td>' +
'<td style="background-color:#B200A5 !important;color:#FFFFFF;">&nbsp;U&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">Increases the maximum inventory with 50%</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#C4E5FA !important;">-</td></tr><tr>' +
'<td style=" background-color:#89CCF5 !important;">&nbsp;4&nbsp;</td><td style="background-color:#ADDBF8 !important;">Kaar-Sher Beam</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">Attacks all enemies with a water power 7</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#89CCF5 !important;">high</td></tr><tr>' +
'<th colspan="5" style="background-color:#1399EB !important; border-color:#fff;">&nbsp;MUTATION PATH</th>' +
'</tr><tr><td style=" background-color:#89CCF5 !important;">&nbsp;1&nbsp;</td><td style="background-color:#ADDBF8 !important;">Mutation</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">Increases the maximum <img src="http://en.dinorpg.com/img/icons/small_life_en.gif" alt="HP" /> by 30</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#C4E5FA !important;">-</td></tr><tr>' +
'<td style=" background-color:#89CCF5 !important;">&nbsp;2&nbsp;</td><td style="background-color:#ADDBF8 !important;">Underwater Karate</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">Increases the strength of all Water assaults and powers by 10</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#C4E5FA !important;">-</td></tr><tr>' +
'<td style=" background-color:#89CCF5 !important;">&nbsp;2&nbsp;</td><td style="background-color:#ADDBF8 !important;">Ventral Pouch</td>' +
'<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">Enables the Dinoz to be equipped with an additional battle item</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#C4E5FA !important;">-</td></tr><tr>' +
'<td style=" background-color:#BEBEBE !important;">&nbsp;2&nbsp;</td><td style="background-color:#D2D2D2 !important;">Glowing Scales</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#DFDFDF !important;">Increases armor by 2<br /><span style="color:red;font-size:11px;font-weight_bold;">Quetzu only.</span></td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#DFDFDF !important;">-</td>' +
'</tr><tr><td style=" background-color:#89CCF5 !important;">&nbsp;3&nbsp;</td><td style="background-color:#ADDBF8 !important;">Aqueous Clone</td>' +
'<td style="background-color:#1399EB !important;color:#FFFFFF;">&nbsp;E&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">Create a clone of the Dino with 1 point of life</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#89CCF5 !important;">high</td>' +
'</tr><tr><td style=" background-color:#89CCF5 !important;">&nbsp;3&nbsp;</td><td style="background-color:#ADDBF8 !important;">Poisoned Claws</td>' +
'<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">If one of the rounds of the Dinoz Water touches an enemy, it is poisoned</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#C4E5FA !important;">-</td>' +
'</tr><tr><td style=" background-color:#89CCF5 !important;">&nbsp;3&nbsp;</td><td style="background-color:#ADDBF8 !important;">Without Mercy</td>' +
'<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">Chooses the target with the least health points for each assault</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#C4E5FA !important;">-</td>' +
'</tr><tr><td style=" background-color:#89CCF5 !important;">&nbsp;3&nbsp;</td><td style="background-color:#ADDBF8 !important;">Sumo</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">Increases the maximum health points by 100.<br /> ' +
'<span style="color:red;font-size:11px;font-weight_bold;">The Dinoz will become twice as big: increase size</span></td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#C4E5FA !important;">-</td>' +
'</tr><tr><td style=" background-color:#BEBEBE !important;">&nbsp;3&nbsp;</td><td style="background-color:#D2D2D2 !important;">Snakeskin</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#DFDFDF !important;">Increases evasion by 10% and decreases water attack speed by 15%<br />' +
'<span style="color:red;font-size:11px;font-weight_bold;">Quetzu only.</span></td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#DFDFDF !important;">-</td>' +
'</tr><tr><td style=" background-color:#89CCF5 !important;">&nbsp;4&nbsp;</td><td style="background-color:#ADDBF8 !important;">Acid Blood</td>' +
'<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">If one of the enemy assaults hit the Dinoz, he can make the enemy lose some life, Dinoz will have a Sparkling Aura</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#C4E5FA !important;">-</td>' +
'</tr><tr><td style=" background-color:#89CCF5 !important;">&nbsp;4&nbsp;</td><td style="background-color:#ADDBF8 !important;">Cooker</td>' +
'<td style="background-color:#B200A5 !important;color:#FFFFFF;">&nbsp;U&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">Increases the life gain of the items by 10% for all the Dinoz</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#C4E5FA !important;">-</td>' +
'</tr><tr><th colspan="5" style="background-color:#1399EB !important; border-color:#fff;">&nbsp;PERCEPTION PATH</th></tr><tr>' +
'<td style=" background-color:#89CCF5 !important;">&nbsp;1&nbsp;</td><td style="background-color:#ADDBF8 !important;">Perception</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">Increases the strength of all Water assaults by 4 and enables your Dinoz to attack immaterial enemies</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#C4E5FA !important;">-</td>' +
'</tr><tr><td style=" background-color:#89CCF5 !important;">&nbsp;2&nbsp;</td><td style="background-color:#ADDBF8 !important;">Apprentice Fisher</td>' +
'<td style="background-color:#8EAF02 !important;color:#FFFFFF;">&nbsp;C&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">Enables the Dinoz to fish little fishes in some places</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#C4E5FA !important;">-</td>' +
'</tr><tr><td style=" background-color:#89CCF5 !important;">&nbsp;2&nbsp;</td><td style="background-color:#ADDBF8 !important;">Tricky Hits</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">Attacks one enemy. In case of success, the enemy lose half of his health points</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#ADDBF8 !important;">weak</td>' +
'</tr><tr><td style=" background-color:#89CCF5 !important;">&nbsp;3&nbsp;</td><td style="background-color:#ADDBF8 !important;">Marsh</td>' +
'<td style="background-color:#1399EB !important;color:#FFFFFF;">&nbsp;E&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">All the enemies are slow</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#ADDBF8 !important;">weak</td>' +
'</tr><tr><td style=" background-color:#89CCF5 !important;">&nbsp;3&nbsp;</td><td style="background-color:#ADDBF8 !important;">Skilled Fisher</td>' +
'<td style="background-color:#8EAF02 !important;color:#FFFFFF;">&nbsp;C&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">The Dinoz can catch big fishes in certain places</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#C4E5FA !important;">-</td>' +
'</tr><tr><td style=" background-color:#89CCF5 !important;">&nbsp;3&nbsp;</td><td style="background-color:#ADDBF8 !important;">Fatal Hits</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">Attacks one enemy. In case of succes, the enemy lose all of his health points.</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#ADDBF8 !important;">weak</td>' +
'</tr><tr><td style=" background-color:#89CCF5 !important;">&nbsp;3&nbsp;</td><td style="background-color:#ADDBF8 !important;">Underwater Training</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">Increases the maximum health points by 10</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#C4E5FA !important;">-</td>' +
'</tr><tr><td style=" background-color:#89CCF5 !important;">&nbsp;4&nbsp;</td><td style="background-color:#ADDBF8 !important;">Master Fisher</td>' +
'<td style="background-color:#8EAF02 !important;color:#FFFFFF;">&nbsp;C&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">The dinoz can catch rare and exceptional fish in certain places</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#C4E5FA !important;">-</td>' +
'</tr><tr><td style=" background-color:#89CCF5 !important;">&nbsp;4&nbsp;</td><td style="background-color:#ADDBF8 !important;">Advanced Underwater Training</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">Increases the maximum health points by 20</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#C4E5FA !important;">-</td>' +
'</tr><tr><td style=" background-color:#89CCF5 !important;">&nbsp;5&nbsp;</td><td style="background-color:#ADDBF8 !important;">Life Guard</td>' +
'<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">Increases the element of water by 5</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#C4E5FA !important;">-</td></tr></table></div>' +
'<div style="float:left; width:100%;"><table><tr><th colspan="5" style="background-color:#1399EB !important; border-color:#fff;">&nbsp;<img src="http://data.en.dinorpg.com/img/icons/obj_spher3.gif" alt="Water Sphere" />&nbsp;SPHERE SKILLS</th>' +
'</tr><tr><td style=" background-color:#89CCF5 !important;">&nbsp;1&nbsp;</td><td style="background-color:#ADDBF8 !important;">Vitality</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">Increases the maximum healyh points by 10.</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#C4E5FA !important;">-</td>' +
'</tr><tr><td style=" background-color:#89CCF5 !important;">&nbsp;2&nbsp;</td><td style="background-color:#ADDBF8 !important;">Liquid Stubs</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">Decreases the intiative of one enemy by 25.</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000; background-color:#1399EB !important;">very high</td>' +
'</tr><tr><td style=" background-color:#89CCF5 !important;">&nbsp;3&nbsp;</td><td style="background-color:#ADDBF8 !important;">Flood</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style="background-color:#C4E5FA !important;">Attacs all enemies with Water at a strenght of 10, and decreases the intiative of all enemy Dinoz by 8.</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000; background-color:#1399EB !important;">very high</td></tr></table></div>'

            break;
        case "http://en.dinorpg.com/img/icons/elem_3.gif": /* Lightning skills */
            node.innerHTML = '<div style="background-color:#FFBA00 !important; border-color:#FFFFFF; color:#FFFFFF;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_3.gif" /> <strong>LIGHTNING</strong></div>' +
 '<div style="float:left; width:100%;"><table><tr>' +
 '<table><tr><th style="background-color:#FFBA00 !important; border-color:#fff; color:#fff;">&nbsp;Level 1</th>' +
 '<th style="background-color:#FFBA00 !important; border-color:#fff; color:#fff;">&nbsp;Level 2</th>' +
 '<th style="background-color:#FFBA00 !important; border-color:#fff; color:#fff;">&nbsp;Level 3</th>' +
 '<th style="background-color:#FFBA00 !important; border-color:#fff; color:#fff;">&nbsp;Level 4</th>' +
 '<th style="background-color:#FFBA00 !important; border-color:#fff; color:#fff;">&nbsp;Level 5</th>' +
 '<th style="background-color:#FFBA00 !important; border-color:#fff; color:#fff;">&nbsp;Level 6</th>' +
 '</tr><tr><td rowspan="7" style = "color:#4F92C1;background-color:#FFDC7F !important;">Focus</td>' +
 '<td rowspan="5" style="color:#E50099;background-color:#FFE08C !important;">Concentration</td>' +
 '<td rowspan="2" style="color:#363636; background-color:#FFE399 !important;">Kaos Path</td>' +
 '<td style="color:#D30000; background-color:#FFE7A6 !important;">Blazing Twilight</td>' +
 '<td style="color:#363636; background-color:#FFEAB2 !important;">Corrosive Archangel</td>' +
 '<td style="color:#333333; background-color:#D2D2D2 !important;">Hercolubus</td>' +
 '</tr><tr><td style="color:#363636; color:#BBBBBB;background-color:#666666 !important;">Sprint</td>' +
 '<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
 '<td rowspan="2" style="color:#363636;background-color:#FFE399 !important;">Gaia Path</td><td style="color:#D30000;background-color:#FFE7A6 !important;">Leafy Dawn</td>' +
 '<td style="color:#363636; background-color:#FFEAB2 !important;">Genesive Archangel</td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
 '<td style="color:#363636; color:#BBBBBB;background-color:#666666 !important;">Shock</td><td style="border:none; background-color:transparent;"></td>' +
 '<td style="border:none; background-color:transparent;"></td></tr><tr><td style="color:#333333; background-color:#D2D2D2 !important;">Buddha</td>' +
 '<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td>' +
 '<td style="border:none; background-color:transparent;"></td></tr><tr>' +
 '<td rowspan="2" style="color:#E50099;background-color:#FFE08C !important;">Regeneration</td>' +
 '<td style="color:#E50099;background-color:#FFE399 !important;">Saving Pure</td>' +
 '<td style = "color:#267F00;background-color:#FFE7A6 !important;">Benediction Aura</td>' +
 '<td style="color:#B200FF;background-color:#FFEAB2 !important;">Priest</td><td style="border:none; background-color:transparent;"></td>' +
 '</tr><tr><td style = "color:#267F00;background-color:#FFE399 !important;">Hermetic Aura</td>' +
 '<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td>' +
 '<td style="border:none; background-color:transparent;"></td></tr><tr>' +
 '<td rowspan="6" style="color:#E50099;background-color:#FFE08C !important;">Intelligence</td>' +
 '<td rowspan="3" style="color:#E50099;background-color:#FFE399 !important;">First Aid</td>' +
 '<td rowspan="2" style="color:#363636;background-color:#FFE7A6 !important;">Adrenaline</td>' +
 '<td style="color:#363636; color:#BBBBBB;background-color:#666666 !important;">Overload</td><td style="border:none; background-color:transparent;"></td>' +
 '<td style="border:none; background-color:transparent;"></td></tr><tr>' +
 '<td style="color:#333333; background-color:#D8D8D8 !important;">Sacred Whale</td><td style="border:none; background-color:transparent;"></td>' +
 '<td style="border:none; background-color:transparent;"></td></tr><tr>' +
 '<td style="color:#E50099;background-color:#FFE7A6 !important;">Medicine</td><td style="color:#E50099;background-color:#FFEAB2 !important;">Hospital Poter</td>' +
 '<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
 '<td rowspan="3" style="color:#267F00;background-color:#FFE399 !important;">Lightning Conductor</td>' +
 '<td style="color:#363636;background-color:#FFE7A6 !important;">Diamant Fangs</td>' +
 '<td style="color:#333333; background-color:#D8D8D8 !important;">Vulcan</td>' +
 '<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
 '<td rowspan="2" style="color:#267F00;background-color:#FFE7A6 !important;">Elemental Fission</td>' +
 '<td style="color:#B200FF;background-color:#FFEAB2 !important;">Merchant</td><td style="border:none; background-color:transparent;"></td>' +
 '<td style="border:none; background-color:transparent;"></td></tr><tr><td style="color:#333333; background-color:#D8D8D8 !important;">Golem</td>' +
 '<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
 '<td rowspan="7" style = "color:#363636;background-color:#FFDC7F !important;">Celerity</td>' +
 '<td style="color:#363636;background-color:#FFE08C !important;">Lightning Attack</td><td style="color:#363636;background-color:#FFE399 !important;">Hazard</td>' +
 '<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
 '<td rowspan="6" style="color:#363636;background-color:#FFE08C !important;">Double Hit</td><td style="color:#E50099;background-color:#FFE399 !important;">Career Plan</td>' +
 '<td style="color:#E50099;background-color:#FFE7A6 !important;">Reincarnation</td><td style="border:none; background-color:transparent;"></td>' +
 '<td style="border:none; background-color:transparent;"></td></tr><tr>' +
 '<td rowspan="2" style="color:#D30000;background-color:#FFE399 !important;">Lightning Dance</td><td style="color:#333333; background-color:#D2D2D2 !important;">Fujin</td>' +
 '<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
 '<td style="color:#333333; background-color:#D2D2D2 !important;">Grand High Babooner</td>' +
 '<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
 '<td rowspan="3" style="color:#D30000;background-color:#FFE399 !important;">Lightning</td>' +
 '<td style="color:#363636; color:#BBBBBB;background-color:#666666 !important;">Electrolysis</td><td style="border:none; background-color:transparent;"></td>' +
 '<td style="border:none; background-color:transparent;"></td></tr><tr>' +
 '<td style="color:#333; background-color:#D8D8D8 !important;">Quetzalcoat</td>' +
 '<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
 '<td style="color:#333; background-color:#D8D8D8 !important;">Raijin</td><td style="border:none; background-color:transparent;"></td>' +
 '<td style="border:none; background-color:transparent;"></td></tr>' +
 '<tr><td colspan="6"><a href="http://dinorpg.novasoftware.pl/Skills/Lightning" target="_blank" style="target-new: tab;">Lightning skills</a></td></table></div>' +
 '<div style="float:left; width:100%;"><table><tr>' +
       '<th colspan="5" style="background-color:#FFBA00 !important; color:#fff;">&nbsp;<strong>LIGHTNING 50+</strong></th></tr><tr>' +
        '<th style="background-color:#FFBA00 !important; border-color:#fff; color:#fff; font-variant:small-caps;">&nbsp;Level 1</th>' +
        '<th style="background-color:#FFBA00 !important; border-color:#fff; color:#fff; font-variant:small-caps;">&nbsp;Level 2</th>' +
        '<th style="background-color:#FFBA00 !important; border-color:#fff; color:#fff; font-variant:small-caps;">&nbsp;Level 3</th>' +
        '<th style="background-color:#FFBA00 !important; border-color:#fff; color:#fff; font-variant:small-caps;">&nbsp;Level 4</th>' +
        '<th style="background-color:#FFBA00 !important; border-color:#fff; color:#fff; font-variant:small-caps;">&nbsp;Level 5</th></tr>' +
        '<tr><td rowspan="4" style="background-color:#FFDC7F !important; border-color:#fff; color:#393939;">Moral Support</td>' +
        '<td rowspan="2" style="background-color:#FFE08C !important; border-color:#fff; color:#393939;">Yellow Fever</td>' +
        '<td rowspan="2" style="background-color:#FFE399 !important; border-color:#fff; color:#4F92C1;">Chronic Cramp</td>' +
        '<td style="background-color:#FFE7A6 !important; border-color:#fff; color:#393939;">Electric Fence</td>' +
        '<td style="background-color:#FFEAB2 !important; border-color:#fff; color:#393939;">Force of Zeus</td></tr><tr>' +
        '<td style="background-color:#FFE7A6 !important; border-color:#fff; color:#393939;">Oracle</td>' +
        '<td style="background-color:#FFEAB2 !important; border-color:#fff; color:#393939;">Love Hertz</td></tr><tr>' +
        '<td rowspan="2" style="background-color:#FFE08C !important; border-color:#fff; color:#393939;">Cardiac Massage</td>' +
        '<td rowspan="2" style="background-color:#FFE399 !important; border-color:#fff; color:#4F92C1;">Sun Blindness</td>' +
        '<td style="background-color:#FFE7A6 !important; border-color:#fff; color:#393939;">Backup Battery</td>' +
        '<td style="background-color:#FFEAB2 !important; border-color:#fff; color:#D30000;">Air Receptacle</td></tr><tr>' +
        '<td style="background-color:#FFE7A6 !important; border-color:#fff; color:#E50099;">Einstein</td>' +
        '<td style="background-color:#FFEAB2 !important; border-color:#fff; color:#4F92C1;">St Elma\'s Fire</td></tr><tr>' +
        '<tr><td colspan="5"><a href="http://dinorpg.novasoftware.pl/Skills/Level50" target="_blank" style="target-new: tab;">Level 50 skills</a></td></table></div>' + 
 '<div style="float:left; width:100%;"><table><tr>' +
 '<th colspan="6" style="background-color:#FFBA00 !important; color:#fff;">&nbsp;DOUBLE SKILLS</th>' +
 '</tr><tr><td style="color:#BBBBBB; background-color:#666666 !important;">Sprint</td>' +
 '<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" /> Chaos Path<br />' +
 '<img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Kamikaze</td>' +
 '<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
 '<td style="background-color:#DFDFDF !important;">Increases the initiative by 6.</td>' +
 '<td style="color:#267F00; background-color:#C5C5C5 !important;">-</td></tr><tr>' +
 '<td style="color:#BBBBBB; background-color:#666666 !important;">Shock</td>' +
 '<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_1.gif" alt="Wood" /> Primal State<br />' +
 '<img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" />Gaia Path</td>' +
 '<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
 '<td style="background-color:#DFDFDF !important;">Increases the elements Wood and Lightning.' +
 ' Adds the value of element Wood (onslaught) to Lightning and adds the value of Lightning element to the Wood element.</td>' +
 '<td style="color:#267F00; background-color:#C5C5C5 !important;">-</td></tr><tr>' +
 '<td style="color:#BBBBBB; background-color:#666666 !important;">Overload </td>' +
 '<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Elasticity<br />' +
 '<img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" />Adrenaline</td>' +
 '<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
 '<td style="background-color:#DFDFDF !important;">Increases chances of multi attack by 15%.</td>' +
 '<td style="color:#267F00; background-color:#C5C5C5 !important;">-</td></tr><tr>' +
 '<td style="color:#BBBBBB; background-color:#666666 !important;">Electrolysis </td>' +
 '<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_2.gif" alt="Water" /> Marsh<br />' +
 '<img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" />Lightning</td>' +
 '<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
 '<td style="background-color:#DFDFDF !important;">Increases by 5% the Speed of all Dinoz group.</td>' +
 '<td style="color:#267F00; background-color:#C5C5C5 !important;">-</td></tr></table></div>' +
 '<div style="float:left; width:100%;"><table><tr><th colspan="6" style="background-color:#FFBA00 !important; border-color:#fff;">&nbsp;INVOCATIONS</th>' +
 '</tr><tr><td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
 ' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=996Dk2Gj03gOU000&amp;chk=40070414"' +
 ' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
 '<td style="background-color:#D2D2D2 !important;">Buddha</td>' +
 '<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Awakening <br />' +
 ' <img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" /> Concentration <br />' +
 ' <img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Martial Arts</td>' +
 ' <td style="background-color:#DFDFDF !important;">+10 defense to each element on each dinoz on the team<br />' +
 '<span style="color:red;font-size:11px;font-weight_bold;">Hippoclam only.</span></td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#BEBEBE !important;">very high</td></tr><tr>' +
 '<td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
 ' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=294H72o5jtjyz000&amp;chk=198379612"' +
 ' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
 '<td style="background-color:#D2D2D2 !important;">Sacred Whale</td>' +
 '<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" /> Adrenaline <br />' +
 '<img src="http://en.dinorpg.com/img/icons/elem_2.gif" alt="Water" /> Master Fisherman</td>' +
 '<td style="background-color:#DFDFDF !important;">Improve water element defense by 20 points for the whole team.<br />' +
 '<span style="color:red;font-size:11px;font-weight_bold;">Winks only.</span></td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#BEBEBE !important;">very high</td></tr><tr>' +
 '<td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
 ' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=09bgZuey1UGFZ000&amp;chk=3524596"' +
 ' menu="false" scale="exactfit" wmode="transparent" height="115" width="135"></embed></td>' +
 '<td style="background-color:#D2D2D2 !important;">Vulcan</td>' +
 '<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" /> Diamond Fangs <br />' +
 '<img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Lava Flow</td>' +
 '<td style="background-color:#DFDFDF !important;">Attack all enemies with a power of 20<img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /><br  />' +
 '<span style="color:red;font-size:11px;font-weight_bold;">Moueffe only.</span></td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#BEBEBE !important;">very high</td></tr><tr>' +
 '<td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
 ' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=593gzrKTAgcvD000&amp;chk=107161356"' +
 ' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
 '<td style="background-color:#D2D2D2 !important;">Golem</td>' +
 '<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Incandescent aura<br />' +
 '<img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" /> Elemental Fission</td>' +
 '<td style="background-color:#DFDFDF !important;">Increase +20<img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" />' +
 'defense for all Dinoz in your group<br /><span style="color:red;font-size:11px;font-weight_bold;">Rocky only.</span></td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#BEBEBE !important;">very high</td></tr><tr>' +
 '<td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
 ' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=79mDBweDvbHKz000&amp;chk=126292466"' +
 ' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
 '<td style="background-color:#D2D2D2 !important;">Fujin</td>' +
 '<td style="background-color:#C5C5C5 !important; nowrap"><img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Vacuum Disc <br />' +
 '<img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" /> Lightning Dance</td>' +
 '<td style="background-color:#DFDFDF !important;">Add 50% of speed to all in the group<br />' +
 '<span style="color:red;font-size:11px;font-weight_bold;">Cloudoz only.</span></td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#BEBEBE !important;">very high</td></tr><tr>' +
 '<td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
 ' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=H5kr28zPT6bEM000&amp;chk=209617074"' +
 ' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
 '<td style="background-color:#D2D2D2 !important;">Grand High Babooner</td>' +
 '<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_1.gif" alt="Wood" /> Charisma <br />' +
 '<img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" /> Lightning Dance</td>' +
 '<td style="background-color:#DFDFDF !important;">+20% dodge to your team<br />' +
 '<span style="color:red;font-size:11px;font-weight_bold;">Tofufu only.</span></td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#BEBEBE !important;">very high</td></tr><tr>' +
 '<td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
 ' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=I9XLZ0D3AHwlT110&amp;chk=186414950"' +
 ' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
 '<td style="background-color:#D2D2D2 !important;">Quetzalcoat</td>' +
 '<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" /> Lightning</td>' +
 '<td style="background-color:#DFDFDF !important;">Attacks all enemies with a Lightning power 40<br />' +
 '<span style="color:red;font-size:11px;font-weight_bold;">Quetzu only.</span></td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#BEBEBE !important;">very high</td></tr><tr>' +
 '<td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
 ' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=39jv0t6PxfCBE000&amp;chk=61542822"' +
 ' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
 '<td style="background-color:#D2D2D2 !important;">Raijin</td>' +
 '<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Elasticy <br />' +
 '<img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" /> Lightning</td>' +
 '<td style="background-color:#DFDFDF !important;">Attacks all enemies with a power of 20<img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" />' +
 '<br /><span style="color:red;font-size:11px;font-weight_bold;">Glidwings only.</span></td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#BEBEBE !important;">very high</td></tr><tr>' +
 '<td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
 ' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=J9dfNslrcLPF9110&amp;chk=122166522"' +
 ' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
 '<td style="background-color:#D2D2D2 !important;">Hercolubus</td>' +
 '<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" /> Corrosive Archangel <br />' +
 '<img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Vaparous Form</td>' +
 '<td style="background-color:#DFDFDF !important;">Attacks all enemies with an invocation of 30<img src="http://en.dinorpg.com/img/icons/elem_5.gif" alt="Non-Elemental" />' +
 '<br /><span style="color:red;font-size:11px;font-weight:bold;">Smog only.</span></td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#BEBEBE !important;">very high</td></tr></table>' +
 '</div>' +
 '<div style="float:left; width:100%;"><table><tr><th colspan="6" style="background-color:#FFBA00 !important; border-color:#fff;">&nbsp;FOCUS PATH</th>' +
 '</tr><tr><td style="background-color:#FFDC7F !important;">&nbsp;1&nbsp;</td>' +
 '<td style="background-color:#FFE7A6 !important;">Focus</td><td style="background-color:#1399EB !important;color:#FFFFFF;">&nbsp;E&nbsp;</td>' +
 '<td style="background-color:#FFEAB2 !important;">Enhances the strength of the next assault with a Lightning bonus 1</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFE7A6 !important;">weak</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;2&nbsp;</td><td style="background-color:#FFE7A6 !important;">Concentration</td>' +
 '<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
 '<td style="background-color:#FFEAB2 !important;">The assaults always target the same enemy</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFEAB2 !important;">-</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;2&nbsp;</td>' +
 '<td style="background-color:#FFE7A6 !important;">Regeneration</td>' +
 '<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
 '<td style="background-color:#FFEAB2 !important;">Increases the speed of health points recovering when resting, The Dinoz recovers 3HP each hour</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFEAB2 !important;">-</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;3&nbsp;</td><td style="background-color:#FFE7A6 !important;">Gaia Path</td>' +
 '<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
 '<td style="background-color:#FFEAB2 !important;">Increases the strength of Wood and Lightning defenses by 3</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFEAB2 !important;">-</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;3&nbsp;</td><td style="background-color:#FFE7A6 !important;">Kaos Path</td>' +
 '<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
 '<td style="background-color:#FFEAB2 !important;">Increases the strength of Fire and Lightning assaults by 6</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFEAB2 !important;">-</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;3&nbsp;</td><td style="background-color:#FFE7A6 !important;">Hermetic Aura</td>' +
 '<td style="background-color:#1399EB !important;color:#FFFFFF;">&nbsp;E&nbsp;</td>' +
 '<td style="background-color:#FFEAB2 !important;">Give the status Shield, dinoz has a yellow auro and when triggered increases all defense by 6</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFE7A6 !important;">weak</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;3&nbsp;</td><td style="background-color:#FFE7A6 !important;">Saving Puree</td>' +
 '<td style="background-color:#1399EB !important;color:#FFFFFF;">&nbsp;E&nbsp;</td>' +
 '<td style="background-color:#FFEAB2 !important;">Cancels all Negative Status of the Group</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFDC7F !important;">high</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;4&nbsp;</td><td style="background-color:#FFE7A6 !important;">Leafy Dawn</td>' +
 '<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
 '<td style="background-color:#FFEAB2 !important;">Regenerates all Dinoz in the Group up to Lightning 2 + Wood 2 health points</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000; background-color:#FFBA00 !important;">very high</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;3&nbsp;</td><td style="background-color:#FFE7A6 !important;">Blazing Twilight</td>' +
 '<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
 '<td style="background-color:#FFEAB2 !important;">Attacks all enemies with a power of Fire 6 + Lightning 6</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFDC7F !important;">high</td>' +
 '</tr><tr><td style="background-color:#FFDC7F !important;">&nbsp;3&nbsp;</td><td style="background-color:#FFE7A6 !important;">Benediction</td>' +
 '<td style="background-color:#1399EB !important;color:#FFFFFF;">&nbsp;E&nbsp;</td>' +
 '<td style="background-color:#FFEAB2 !important;">Gives the status Blessed to a group</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFE7A6 !important;">weak</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;5&nbsp;</td><td style="background-color:#FFE7A6 !important;">Genesive Archangel</td>' +
 '<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td><td style="background-color:#FFEAB2 !important;">Increases Wood Element by 2 and Lightning Element by 1</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFEAB2 !important;">-</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;5&nbsp;</td><td style="background-color:#FFE7A6 !important;">Corrosive Archangel</td>' +
 '<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td><td style="background-color:#FFEAB2 !important;">Increases the Fire Element by 2 and the Lightning Element by 1</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFEAB2 !important;">-</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;5&nbsp;</td><td style="background-color:#FFE7A6 !important;">Priest</td>' +
 '<td style="background-color:#B200A5 !important;color:#FFFFFF;">&nbsp;U&nbsp;</td>' +
 '<td style="background-color:#FFEAB2 !important;">Increases the speed of health points recovering of all Dinoz when resting</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFEAB2 !important;">-</td></tr><tr>' +
 '<th colspan="6" style="background-color:#FFBA00 !important; border-color:#fff;">&nbsp;INTELLIGENCE PATH</th>' +
 '</tr><tr><td style="background-color:#FFDC7F !important;">&nbsp;1&nbsp;</td><td style="background-color:#FFE7A6 !important;">Intelligence</td>' +
 '<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td><td style="background-color:#FFEAB2 !important;">Increases the experience gain at the end of the fight by 5%</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFEAB2 !important;">-</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;2&nbsp;</td><td style="background-color:#FFE7A6 !important;">Lightning Conductor</td>' +
 '<td style="background-color:#8EAF02 !important;color:#FFFFFF;">&nbsp;C&nbsp;</td>' +
 '<td style="background-color:#FFEAB2 !important;">Enables the Dinoz to absorb the lightning energy in some places</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFEAB2 !important;">-</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;2&nbsp;</td><td style="background-color:#FFE7A6 !important;">First Aid</td>' +
 '<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
 '<td style="background-color:#FFEAB2 !important;">The Dinoz will recover one health point at the end of the fight if he has lost some life</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFEAB2 !important;">-</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;3&nbsp;</td><td style="background-color:#FFE7A6 !important;">Diamant Fangs</td>' +
 '<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td><td style="background-color:#FFEAB2 !important;">Increases the strength of all assault by 2</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFEAB2 !important;">-</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;3&nbsp;</td><td style="background-color:#FFE7A6 !important;">Elemental Fission</td>' +
 '<td style="background-color:#8EAF02 !important;color:#FFFFFF;">&nbsp;C&nbsp;</td>' +
 '<td style="background-color:#FFEAB2 !important;">Enables the dinoz to collect all kind of element energy in some places</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFEAB2 !important;">-</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;3&nbsp;</td><td style="background-color:#FFE7A6 !important;">Adrenaline</td>' +
 '<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td><td style="background-color:#FFEAB2 !important;">Increases the speed of all Lightning attacks by 50%</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFEAB2 !important;">-</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;3&nbsp;</td><td style="background-color:#FFE7A6 !important;">Medicine</td>' +
 '<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td><td style="background-color:#FFEAB2 !important;">Enables to recover up to 3 health points at the end of the fight</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFEAB2 !important;">-</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;4&nbsp;</td><td style="background-color:#FFE7A6 !important;">Merchant</td>' +
 '<td style="background-color:#B200A5 !important;color:#FFFFFF;">&nbsp;U&nbsp;</td><td style="background-color:#FFEAB2 !important;">Decreases all prices in Dinoland shops by 10%</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFEAB2 !important;">-</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;4&nbsp;</td><td style="background-color:#FFE7A6 !important;">Hospital Porter</td>' +
 '<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
 '<td style="background-color:#FFEAB2 !important;">Enables one another Dinoz in the Group to recover up to 5 health points at the end of the fight</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFEAB2 !important;">-</td></tr><tr>' +
 '<th colspan="6" style="background-color:#FFBA00 !important; border-color:#fff;">&nbsp;CELERITY PATH</th>' +
 '</tr><tr><td style="background-color:#FFDC7F !important;">&nbsp;1&nbsp;</td><td style="background-color:#FFE7A6 !important;">Celerity</td>' +
 '<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td><td style="background-color:#FFEAB2 !important;">Increases the Dinoz speed by 15%</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFEAB2 !important;">-</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;2&nbsp;</td><td style="background-color:#FFE7A6 !important;">Lightning Attack</td>' +
 '<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td><td style="background-color:#FFEAB2 !important;">Increases the speed of all Lightning attacks by 40%</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFEAB2 !important;">-</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;2&nbsp;</td><td style="background-color:#FFE7A6 !important;">Double Hit</td>' +
 '<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td><td style="background-color:#FFEAB2 !important;">Increases the chances of multi-attacks by 20%</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFEAB2 !important;">-</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;3&nbsp;</td><td style="background-color:#FFE7A6 !important;">Hazard</td>' +
 '<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td><td style="background-color:#FFEAB2 !important;">Increases the initiative by 7</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFEAB2 !important;">-</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;3&nbsp;</td><td style="background-color:#FFE7A6 !important;">Lightning Dance</td>' +
 '<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td><td style="background-color:#FFEAB2 !important;">Attacks 5 times with a Lightning power 3</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFDC7F !important;">high</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;3&nbsp;</td><td style="background-color:#FFE7A6 !important;">Lightning</td>' +
 '<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td><td style="background-color:#FFEAB2 !important;">Attacks one enemy with a Lightning power 10</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFE399 !important;">normal</td>' +
 '</tr><tr><td style="background-color:#FFDC7F !important;">&nbsp;3&nbsp;</td><td style="background-color:#FFE7A6 !important;">Career Plan</td>' +
 '<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
 '<td style="background-color:#FFEAB2 !important;">Enables the Dinoz to throw again his element at the moment of his level changing, you can do over the level up segment 1 time</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFEAB2 !important;">-</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;4&nbsp;</td><td style="background-color:#FFE7A6 !important;">Reincarnation</td>' +
 '<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td><td style="background-color:#FFEAB2 !important;">The Dinoz will be able to be reincarnated from the level 40.<br />' +
 '<span style="color:red;font-size:11px;font-weight_bold;">That means that he will return to level 1, he will lose all his status items, all his skills and all his element points.' +
 'However he will obtain bonus of 5 points in various elements, as he would be in fact level 6. That will enables him  ' +
 'to be more powerful once he will have reached again his actual level.</span></td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFEAB2 !important;">-</td></tr></table></div>' + 
 '<div style="float:left; width:100%;"><table><tr><th colspan="6" style="background-color:#FFBA00 !important; border-color:#fff;">&nbsp;<img src="http://data.en.dinorpg.com/img/icons/obj_spher4.gif" alt="Lightning Sphere" />&nbsp;SPHERE SKILLS</th>' +
 '</tr><tr><td style="background-color:#FFDC7F !important;">&nbsp;1&nbsp;</td><td style="background-color:#FFE7A6 !important;">Reflex</td>' +
 '<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td><td style="background-color:#FFEAB2 !important;">Increases initiative by 5.</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFEAB2 !important;">-</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;2&nbsp;</td><td style="background-color:#FFE7A6 !important;">Sinuous Lightning</td>' +
 '<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td><td style="background-color:#FFEAB2 !important;">Attacks up to 3 enemies with Lightning at a power 10.</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000; background-color:#FFBA00 !important;">very high</td></tr><tr>' +
 '<td style="background-color:#FFDC7F !important;">&nbsp;3&nbsp;</td><td style="background-color:#FFE7A6 !important;">Survival</td>' +
 '<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td><td style="background-color:#FFEAB2 !important;">Allow Dinoz to escape one death in combat.</td>' +
 '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#FFEAB2 !important;">-</td></tr></table></div>' 

            break;
        case "http://en.dinorpg.com/img/icons/elem_4.gif": /* Air skills */
        node.innerHTML = '<div style="background-color:#A3D3F8 !important; border-color:#FFFFFF; color:#FFFFFF;"><img src="http://en.dinorpg.com/img/icons/elem_4.gif" /> <strong>AIR</strong>' +
'<div style="float:left; width:100%;"><table><tr>' +
'<th style="background-color:#A3D3F8 !important; border-color:#fff; color:#fff; font-variant:small-caps;">&nbsp;Level 1</th>' +
'<th style="background-color:#A3D3F8 !important; border-color:#fff; color:#fff; font-variant:small-caps;">&nbsp;Level 2</th>' +
'<th style="background-color:#A3D3F8 !important; border-color:#fff; color:#fff; font-variant:small-caps;">&nbsp;Level 3</th>' +
'<th style="background-color:#A3D3F8 !important; border-color:#fff; color:#fff; font-variant:small-caps;">&nbsp;Level 4</th>' +
'<th style="background-color:#A3D3F8 !important; border-color:#fff; color:#fff; font-variant:small-caps;">&nbsp;Level 5</th>' +
'<th style="background-color:#A3D3F8 !important; border-color:#fff; color:#fff; font-variant:small-caps;">&nbsp;Level 6</th>' +
'</tr><tr><td rowspan="6" style="color:#363636; background-color:#D1E9FB !important; border-color:#fff; ">Agility</td>' +
'<td rowspan="4" style="color:#363636; background-color:#D1E9FB !important; border-color:#fff; ">Dodge</td>' +
'<td rowspan="2" style="color:#D30000; background-color:#DAEDFC !important; border-color:#fff; ">Vacuum Disc</td>' +
'<td style="color:#D30000; background-color:#DFF0FD !important; border-color:#fff; ">Black Hole</td>' +
'<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#363636;background-color:#D2D2D2 !important; border-color:#fff; ">Fujin</td>' +
'<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td rowspan="2" style="color:#363636; background-color:#DAEDFC !important; border-color:#fff; ">Elasticy</td>' +
'<td style="color:#363636; color:#BBBBBB; background-color:#666666 !important; border-color:#fff; ">Overload</td>' +
'<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#363636;background-color:#D2D2D2 !important; border-color:#fff; ">Raijin</td><td style="border:none; background-color:transparent;"></td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td rowspan="2" style="color:#363636; background-color:#D1E9FB !important; border-color:#fff; ">Jump</td>' +
'<td style="color:#D30000; background-color:#DAEDFC !important; border-color:#fff; ">Attack Plunge</td>' +
'<td style="color:#E50099; background-color:#DFF0FD !important; border-color:#fff; ">Master Levitation</td>' +
'<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#363636; background-color:#DAEDFC !important; border-color:#fff; ">Stealth</td><td style="border:none; background-color:transparent;"></td>' +
'<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td rowspan="6" style="color:#E50099; background-color:#D1E9FB !important; border-color:#fff; ">Strategy</td>' +
'<td rowspan="2" style="color:#E50099; background-color:#DAEDFC !important; border-color:#fff; ">Analyze</td>' +
'<td style="color:#E50099; background-color:#DFF0FD !important; border-color:#fff; ">Specialist</td>' +
'<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#363636; background-color:#DFF0FD !important; border-color:#fff; ">Achilles\' Heel</td>' +
'<td style="color:#363636; color:#BBBBBB; background-color:#666666 !important; border-color:#fff; ">Vendetta</td>' +
'<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td rowspan="4" style="color:#267F00; background-color:#DAEDFC !important; border-color:#fff; ">Gathering</td>' +
'<td rowspan="2" style="color:#D30000; background-color:#DFF0FD !important; border-color:#fff; ">Toxic Cloud</td>' +
'<td rowspan="2" style="color:#E50099; background-color:#E3F2FD !important; border-color:#fff; ">Fetid Breath</td>' +
'<td style="color:#363636;background-color:#DFDFDF !important; border-color:#fff; ">Djinn</td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#363636;background-color:#D8D8D8 !important; border-color:#fff; ">Hades</td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#267F00; background-color:#DFF0FD !important; border-color:#fff; ">Sharp-Eye</td>' +
'<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#363636;background-color:#D2D2D2 !important; border-color:#fff; ">Yggdrail</td>' +
'<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td>' +
'<td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td rowspan="11" style="color:#D30000; background-color:#D1E9FB !important; border-color:#fff; ">Mistral</td>' +
'<td rowspan="5" style="color:#363636; background-color:#D1E9FB !important; border-color:#fff; ">Tai-Chi</td>' +
'<td rowspan="4" style="color:#363636; background-color:#DAEDFC !important; border-color:#fff; ">Awakening</td>' +
'<td style="color:#363636; background-color:#DFF0FD !important; border-color:#fff; ">Lonely Meditation</td>' +
'<td style="color:#363636; background-color:#E3F2FD !important; border-color:#fff; ">Trans. Meditation</td>' +
'<td style="color:#E50099; background-color:#E8F4FD !important; border-color:#fff; ">Immaterial</td></tr><tr>' +
'<td style="color:#B200FF; background-color:#DFF0FD !important; border-color:#fff; ">Proffesor</td>' +
'<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#363636;background-color:#D2D2D2 !important; border-color:#fff; ">Buddha</td>' +
'<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#363636;background-color:#D2D2D2 !important; border-color:#fff; ">Flying Totem</td>' +
'<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#D30000; background-color:#DAEDFC !important; border-color:#fff; ">Ejector Palms</td>' +
'<td style="color:#FFFFFF; color:#BBBBBB; background-color:#666666 !important; border-color:#fff; ">Earth Tremor</td>' +
'<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td rowspan="6" style="color:#D30000; background-color:#D1E9FB !important; border-color:#fff; ">Tornado</td>' +
'<td rowspan="3" style="color:#4F92C1; background-color:#DAEDFC !important; border-color:#fff; ">Viviacous Wind</td>' +
'<td style="color:#E50099; background-color:#DFF0FD !important; border-color:#fff; ">Life Breath</td>' +
'<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#363636;background-color:#D2D2D2 !important; border-color:#fff; ">Werewolf</td>' +
'<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#363636;background-color:#D2D2D2 !important; border-color:#fff; ">Hive Queen</td>' +
'<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td rowspan="2" style="color:#E50099; background-color:#DAEDFC !important; border-color:#fff; ">Vaporous Form</td>' +
'<td style="color:#FFFFFF; color:#BBBBBB; background-color:#666666 !important; border-color:#fff; ">Bubble</td>' +
'<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#363636;background-color:#D2D2D2 !important; border-color:#fff; ">Hercolubus</td>' +
'<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#363636;background-color:#D2D2D2 !important; border-color:#fff; ">Leviatan</td>' +
'<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr><tr>' +
'<td style="color:#D30000; background-color:#D1E9FB !important; border-color:#fff; ">Flight</td>' +
'<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td>' +
'<td style="border:none; background-color:transparent;"></td><td style="border:none; background-color:transparent;"></td></tr>' +
'<tr><td colspan="5"><a href="http://dinorpg.novasoftware.pl/Skills/Air" target="_blank" style="target-new: tab;">Air skills</a></td></table></div>' +
'<div style="float:left; width:100%;"><table><tr>' +
       '<th colspan="5" style="background-color:#A3D3F8 !important; color:#fff;">&nbsp;<strong>AIR 50+</strong></th></tr><tr>' +
        '<th style="background-color:#A3D3F8 !important; border-color:#fff; color:#fff; font-variant:small-caps;">&nbsp;Level 1</th>' +
        '<th style="background-color:#A3D3F8 !important; border-color:#fff; color:#fff; font-variant:small-caps;">&nbsp;Level 2</th>' +
        '<th style="background-color:#A3D3F8 !important; border-color:#fff; color:#fff; font-variant:small-caps;">&nbsp;Level 3</th>' +
        '<th style="background-color:#A3D3F8 !important; border-color:#fff; color:#fff; font-variant:small-caps;">&nbsp;Level 4</th>' +
        '<th style="background-color:#A3D3F8 !important; border-color:#fff; color:#fff; font-variant:small-caps;">&nbsp;Level 5</th></tr>' +
        '<tr><td rowspan="5" style="background-color:#DFF0FD !important; border-color:#fff; color:#363636;">Mind over Body</td>' +
        '<td rowspan="2" style="background-color:#DFF0FD !important; border-color:#fff; color:#363636;">All White on the Night</td>' +
        '<td style="background-color:#DFF0FD !important; border-color:#fff; color:#363636;">Double Face</td>' +
        '<td style="background-color:#DFF0FD !important; border-color:#fff; color:#D30000;">Uvavu</td>' +
        '<td style="background-color:#DFF0FD !important; border-color:#fff; color:#4F92C1;">Qi Gongb</td></tr><tr>' +
        '<td style="background-color:#DFF0FD !important; border-color:#fff; color:#363636;">Whips</td>' +
        '<td style="background-color:#DFF0FD !important; border-color:#fff; color:#363636;">Twinoid 500mg</td>' +
        '<td style="background-color:#DFF0FD !important; border-color:#fff; color:#D30000;">Sylphs</td></tr><tr>' +
        '<td rowspan="3" style="background-color:#DFF0FD !important; border-color:#fff; color:#363636;">Anaerobics</td>' +
        '<td style="background-color:#DFF0FD !important; border-color:#fff; color:#363636;">Angel Breath</td>' +
        '<td style="background-color:#DFF0FD !important; border-color:#fff; color:#267F00;">Harverster</td>' +
        '<td style="background-color:#DFF0FD !important; border-color:#fff; color:#B200FF;">Messiah</td></tr><tr>' +
        '<td rowspan="2" style="background-color:#DFF0FD !important; border-color:#fff; color:#363636;">Hurricane</td>' +
        '<td style="background-color:#DFF0FD !important; border-color:#fff; color:#B200FF;">Hades Store</td>' +
        '<td style="background-color:#DFF0FD !important; border-color:#fff; color:#4F92C1;">Mutiny</td></tr><tr>' +
        '<td style="background-color:#DFF0FD !important; border-color:#fff; color:#363636;">Heat Sink</td>' +
        '<td style="background-color:#DFF0FD !important; border-color:#fff; color:#4F92C1;">Sticking Hands</td></tr>' +
        '<tr><td colspan="5"><a href="http://dinorpg.novasoftware.pl/Skills/Level50" target="_blank" style="target-new: tab;">Level 50 skills</a></td></table></div>' +
'<div style="float:left; width:100%;"><table><tr>' +
'<th colspan="5" style="background-color:#A3D3F8 !important; color:#fff;">&nbsp;DOUBLE SKILLS</th>' +
'</tr><tr><td style="color:#BBBBBB; background-color:#666666 !important;">Overload </td>' +
'<td style="background-color:#C5C5C5 !important; " nowrap><img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Elasticity<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" /> Adrenaline</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#DFDFDF !important; ">Increases chances of multi attack by 15%.</td>' +
'<td style="background-color:#D2D2D2 !important;">-</td></tr><tr>' +
'<td style="color:#BBBBBB; background-color:#666666 !important;">Vendetta  </td>' +
'<td style="background-color:#C5C5C5 !important; " nowrap><img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Vengeance<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Achilles\' Heel</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#DFDFDF !important;">Increases the chance of counter-attacks by 20%.</td>' +
'<td style="background-color:#D2D2D2 !important; ">-</td></tr><tr>' +
'<td style="color:#BBBBBB; background-color:#666666 !important;">Earth Tremor</td>' +
'<td style="background-color:#C5C5C5 !important; " nowrap><img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Ejector Palms<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_1.gif" alt="Wood" /> Wild Instinct</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style="background-color:#DFDFDF !important; ">Ground attack with a power of Wood + Air at a strength of 4.</td>' +
'<td style="background-color:#D2D2D2 !important; ">weak</td></tr><tr>' +
'<td style="color:#BBBBBB; background-color:#666666 !important;">Bubble</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_2.gif" alt="Water" /> Sapper<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Vaporous Form</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style="background-color:#DFDFDF !important;">Unaffected by all spells/skills without Wood spells/skills.<br />' +
'<span style="font-size:11px;">Bubble is a very good defense skill as it brings back all damage to the % value ' +
'of (water + air) / (sum of all elements) so for example dino with 30% water and 40% air will ' +
'eliminate 70% of the attack value</span></td>' +
'<td style="background-color:#D2D2D2 !important;">-</td></tr></table></div>' +
'<div style="float:left; width:100%;"><table><tr><th colspan="5" style="background-color:#A3D3F8 !important; color:#fff;">&nbsp;INVOCATIONS</th>' +
'</tr><tr><td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=79mDBweDvbHKz000&amp;chk=126292466"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style="background-color:#D2D2D2 !important;">Fujin</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Vacuum Disc <br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" /> Lightning Dance</td>' +
'<td style="background-color:#DFDFDF !important;">Add 50% of speed to all in the group<br />' +
'<span style="color:red;font-size:11px;font-weight:bold;">Cloudoz only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td></tr><tr>' +
'<td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=39jv0t6PxfCBE000&amp;chk=61542822"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style="background-color:#D2D2D2 !important;">Raijin</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Elasticy <br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" /> Lightning</td>' +
'<td style="background-color:#DFDFDF !important;">Attacks all enemies with a power of 20<img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" />' +
'<br /><span style="color:red;font-size:11px;font-weight:bold;">Glidwings only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td></tr><tr>' +
'<td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=69aHSFJbl3vx1000&amp;chk=90560808"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style="background-color:#D2D2D2 !important;">Dijin</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Fetid Breath <br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Burning Breath</td>' +
'<td style="background-color:#DFDFDF !important;">Attacks all enemies with a power of 20<img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" />' +
'<br /><span style="color:red;font-size:11px;font-weight:bold;">Pteroz only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td></tr><tr>' +
'<td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=C93LSGvS7D6b5000&amp;chk=204596148"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style="background-color:#D2D2D2 !important;">Hades</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Fetit Breath<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_1.gif" alt="Wood" /> Tenacity<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_2.gif" alt="Water" /> Tricky Hits</td>' +
'<td style="background-color:#DFDFDF !important;">Poisons all enemies with a power of 17<br/>It also slows down enemies, though this seems to be bugged' +
'<br /><span style="color:red;font-size:11px;font-weight:bold;">Santaz only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td></tr><tr>' +
'<td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=B9DCTABPXtMk6000&amp;chk=254132324"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style="background-color:#D2D2D2 !important;">Yggdrasil</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Gathering<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_1.gif" alt="Wood" /> Forest Keeper</td>' +
'<td style="background-color:#DFDFDF !important;">+20 to wood defense for each dinoz on the team' +
'<br /><span style="color:red;font-size:11px;font-weight:bold;">Wanwan only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td></tr><tr>' +
'<td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=996Dk2Gj03gOU000&amp;chk=40070414"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style="background-color:#D2D2D2 !important;">Buddha</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Awakening <br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" /> Concentration <br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Martial Arts</td>' +
'<td style="background-color:#DFDFDF !important;">+10 defense to each element on each dinoz on the team<br />' +
'<span style="color:red;font-size:11px;font-weight:bold;">Hippoclam only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td></tr><tr>' +
'<td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=E9dgDKeTT9bq3000&amp;chk=193913480"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style="background-color:#D2D2D2 !important;">Flying Totem</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Awakening<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_0.gif" alt="Fire" /> Combustion </td>' +
'<td style="background-color:#DFDFDF !important;">Attacks an enemy with a strength of 30<img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" />' +
'<br /><span style="color:red;font-size:11px;font-weight:bold;">Kabuki only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td></tr><tr>' +
'<td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=49MJoylhqec5U000&amp;chk=256037178"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style="background-color:#D2D2D2 !important;">Werewolf</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Vivacious Wind<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_1.gif" alt="Wood" /> Wild Instinct </td>' +
'<td style="background-color:#DFDFDF !important;">Attack all enemies with a power of 30<img src="http://en.dinorpg.com/img/icons/elem_1.gif" alt="Wood" /><br />' +
'<span style="color:red;font-size:11px;font-weight:bold;">Castivorous only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td></tr><tr>' +
'<td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=G9uzGJps8dLAi000&amp;chk=85870940"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style="background-color:#D2D2D2 !important;">Hive Queen</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Fire" /> Vivacious Wind<br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_1.gif" alt="Wood" /> Precocious Spring</td>' +
'<td style="background-color:#DFDFDF !important;">Empty opponent dinoz endurance bar<br />' +
'<span style="color:red;font-size:11px;font-weight:bold;">Etherwasp only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td></tr><tr>' +
'<td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=F9dewY5ktLLxb000&amp;chk=85435258"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style="background-color:#D2D2D2 !important;">Leviatan</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Tornado <br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_2.gif" alt="Water" /> Acid Blood</td>' +
'<td style="background-color:#DFDFDF !important;">Attacks an enemy with a strength of 20<img src="http://en.dinorpg.com/img/icons/elem_2.gif" alt="Water" />' +
'<br /><span style="color:red;font-size:11px;font-weight:bold;">Mahamuti only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td></tr><tr>' +
'<td style="background-color:#BEBEBE !important;"><embed type="application/x-shockwave-flash" src="http://data.en.dinorpg.com/swf/8/dino.swf"' +
' style="border:none; background-color:transparent;" quality="high" allowscriptaccess="always" flashvars="flip=1&amp;data=J9dfNslrcLPF9110&amp;chk=122166522"' +
' menu="false" scale="default" wmode="transparent" height="115" width="135"></embed></td>' +
'<td style="background-color:#D2D2D2 !important;">Hercolubus</td>' +
'<td style="background-color:#C5C5C5 !important;" nowrap><img src="http://en.dinorpg.com/img/icons/elem_3.gif" alt="Lightning" /> Corrosive Archangel <br />' +
'<img src="http://en.dinorpg.com/img/icons/elem_4.gif" alt="Air" /> Vaparous Form</td>' +
'<td style="background-color:#DFDFDF !important;">Attacks all enemies with an invocation of 30<img src="http://en.dinorpg.com/img/icons/elem_5.gif" alt="Non-Elemental" />' +
'<br /><span style="color:red;font-size:11px;font-weight:bold;">Smog only.</span></td>' +
'<td style="background-color:#BEBEBE !important;">very high</td></tr></table></div>' +
'<div style="float:left; width:100%;"><table><tr><th colspan="6" style="background-color:#A3D3F8 !important; border-color:#fff;">&nbsp;AGILITY PATH</th>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;1&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Agility</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Increases the strength of all Air assaults by 5</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;2&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Dodge</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Increases evasion chance by 10%</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;2&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Jump</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Enables to attack flying enemies</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;3&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Vacuum Disc</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Attacks one enemy with an air strength of 12</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#D1E9FB !important;">high</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;3&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Elasticity</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Increaes the strength of air attacks by 10 and air defense by 3</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;3&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Plunging Attack</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Attacks one enemy with an assault with air bonus 2</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#DFF0FD !important;">weak</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;3&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Stealth</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Increases Air, water, Lightning defense by 2</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;4&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Black Hole</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Send an enemy into a parallel dimension</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000; background-color:#A3D3F8 !important;">very high</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;4&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Master Leviticus</td>' +
'<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">All dinoz in the group can attack an enemy in flight</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
'</tr><tr><th colspan="6" style="background-color:#A3D3F8 !important; border-color:#fff;">&nbsp;MISTRAL PATH</th>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;1&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Mistral</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Attack all enemies with an Air power of 3</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#DFF0FD !important;">weak</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;2&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Tornado</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Attacks all enemies with an Air power of 5</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#DAEDFC !important;">normal</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;2&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Tai-Chi</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Increases strength of all air assault by 15. Decreases the speed of air attacks by 20%</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;3&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Evil Awakening</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Decreases the speed of Air attacks by 20%</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;3&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Ejector Palms</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Attacks one enemy with an assault 2x strength then decreases the initiative by 15</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#DFF0FD !important;">weak</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;3&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Vaporous Form</td>' +
'<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Enables to gain the status Immaterial by defending himself</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;3&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Vivacious Wind</td>' +
'<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Gives the status accelarated, doubles speed </td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#DAEDFC !important;">normal</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;4&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Professor</td>' +
'<td style="background-color:#B200A5 !important;color:#FFFFFF;">&nbsp;U&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Increases the experience gain of all Dinoz by 5%</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;4&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Lonely meditation</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Increases Air defense by 3. Decreases the speed of air attacks by 50%</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;4&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Life Breath</td>' +
'<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Immune to the poison and curses</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;5&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Transcedental Meditation</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Increases air defense by 6. decreases the speed of Air attacks by 50%</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;6&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Immaterial (Etheral Form)</td>' +
'<td <td style="background-color:#1399EB !important;color:#FFFFFF;">&nbsp;E&nbsp;</td></td>' +
'<td style=" background-color:#E8F4FD !important; ">Dinoz becomes Immaterial</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
'</tr><tr><th colspan="6" style="background-color:#A3D3F8 !important; border-color:#fff;">&nbsp;STRATEGY PATH</th>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;1&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Strategy</td>' +
'<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Adopts the best attack strategy according to the enemies\' defenses</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;2&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Analyze</td>' +
'<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Choose the best target for each attack</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;2&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Gathering</td>' +
'<td style="background-color:#8EAF02 !important;color:#FFFFFF;">&nbsp;C&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Enables the Dinoz to gather plants in some places</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;3&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Specialist</td>' +
'<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">For the assault the weakest is replaced by the strongest, the lowest attack element will be deleted</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;3&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Achilles\' Heel</td>' +
'<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Increases the strength of all assaults by 2</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;3&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Toxic Cloud</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Poisons all enemies </td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#D1E9FB !important;">high</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;3&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Sharp-Eye</td>' +
'<td style="background-color:#8EAF02 !important;color:#FFFFFF;">&nbsp;C&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Enables the Dinoz to find exotic plants in some places</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;4&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Fetid Breath</td>' +
'<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Poisons all enemies touched by an assault, each hit is poisoning</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
'</tr><tr><th colspan="6" style="background-color:#A3D3F8 !important; border-color:#fff;">&nbsp;FLIGHT PATH</h3></th>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;1&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Flight</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">The Dinoz makes an assaults then takes flight. Reserved to the flying Dinoz</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#DFF0FD !important;">weak</td></tr></table></div>' +
'<div style="float:left; width:100%;"><table><tr><th colspan="6" style="background-color:#A3D3F8 !important; border-color:#fff;">&nbsp;<img src="http://data.en.dinorpg.com/img/icons/obj_spher5.gif" alt="Air Sphere" />&nbsp;SPHERE SKILLS</th>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;1&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Sting</td>' +
'<td <td style="background-color:#1399EB !important;color:#FFFFFF;">&nbsp;E&nbsp;</td></td>' +
'<td style=" background-color:#E8F4FD !important; ">Attacks one enemy with Ait at a strength of 3.</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#D1E9FB !important;">high</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;2&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Smelly Aura</td>' +
'<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">Poisons the enmemy if they make an assault against you.</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#D1E9FB !important;">high</td>' +
'</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;3&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Hypnosis</td>' +
'<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
'<td style=" background-color:#E8F4FD !important; ">An enemy joins your side.</td>' +
'<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000; background-color:#A3D3F8 !important;">very high</td></tr></table>' +
        '<div style="float:left; width:100%;">' +
        '<table><tr><th colspan="6" style="background-color:#A3D3F8 !important; border-color:#fff;">&nbsp;50+ PATH</th>' +
        '</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;1&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Mind over Body</td>' +
        '<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
        '<td style=" background-color:#E8F4FD !important; ">Increases a dinoz healing ability by 25%</td>' +
        '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
        '</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;2&nbsp;</td><td style=" background-color:#DFF0FD !important; ">All White on the Night</td>' +
        '<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
        '<td style=" background-color:#E8F4FD !important; ">+20 assault for the dinoz while being in Nimbao</td>' +
        '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
        '</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;2&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Anaerobics</td>' +
        '<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
        '<td style=" background-color:#E8F4FD !important; ">-25% endurance</td>' +
        '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
        '</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;3&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Double Face</td>' +
        '<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
        '<td style=" background-color:#E8F4FD !important; ">At the beginning of the fight +/-10 initiative (50%)</td>' +
        '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
        '</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;3&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Whips</td>' +
        '<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
        '<td style=" background-color:#E8F4FD !important; ">-15% healing ability</td>' +
        '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
        '</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;3&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Angel Breath</td>' +
        '<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
        '<td style=" background-color:#E8F4FD !important; ">+20 fire defense</td>' +
        '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
        '</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;3&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Hurricane</td>' +
        '<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
        '<td style=" background-color:#E8F4FD !important; ">+20 air assault</td>' +
        '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
        '</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;4&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Uvavu</td>' +
        '<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
        '<td style=" background-color:#E8F4FD !important; ">All Dinoz with an Air element of less than 10 points will lose 50% of their speed for the next three turns</td>' +
        '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#D1E9FB !important;">high</td>' +
        '</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;4&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Twinoid 500mg</td>' +
        '<td style="background-color:#BE741A !important;color:#FFFFFF;">&nbsp;P&nbsp;</td>' +
        '<td style=" background-color:#E8F4FD !important; ">+50% endurance</td>' +
        '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
        '</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;4&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Harvester</td>' +
        '<td style="background-color:#8EAF02 !important;color:#FFFFFF;">&nbsp;C&nbsp;</td>' +
        '<td style=" background-color:#E8F4FD !important; ">+1 gathering square</td>' +
        '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
        '</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;4&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Hades Store</td>' +
        '<td style="background-color:#FFBA00 !important;color:#FFFFFF;">&nbsp;S&nbsp;</td>' +
        '<td style=" background-color:#E8F4FD !important; ">+1 equip square</td>' +
        '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
        '</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;4&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Heat Sink</td>' +
        '<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
        '<td style=" background-color:#E8F4FD !important; ">Stop fire (spheral) A/E sills</td>' +
        '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
        '</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;5&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Qi Gong</td>' +
        '<td style="background-color:#1399EB !important;color:#FFFFFF;">&nbsp;E&nbsp;</td>' +
        '<td style=" background-color:#E8F4FD !important; ">Takes away all the endurance of an enemy</td>' +
        '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#A3D3F8 !important;">Very high</td>' +
        '</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;4&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Sylphs</td>' +
        '<td style="background-color:#E70000 !important;color:#FFFFFF;">&nbsp;A&nbsp;</td>' +
        '<td style=" background-color:#E8F4FD !important; ">Removes one opponent dinoz from battle</td>' +
        '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
        '</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;5&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Messiah</td>' +
        '<td style="background-color:#B200A5 !important;color:#FFFFFF;">&nbsp;U&nbsp;</td>' +
        '<td style=" background-color:#E8F4FD !important; ">+3 active dinoz on your account</td>' +
        '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#E8F4FD !important;">-</td>' +
        '</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;5&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Mutiny</td>' +
        '<td style="background-color:#1399EB !important;color:#FFFFFF;">&nbsp;E&nbsp;</td>' +
        '<td style=" background-color:#E8F4FD !important; ">Causes clones to attack their masters</td>' +
        '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#D1E9FB !important;">High</td>' +
        '</tr><tr><td style="background-color:#D1E9FB !important; ">&nbsp;5&nbsp;</td><td style=" background-color:#DFF0FD !important; ">Sticking Hands</td>' +
        '<td style="background-color:#1399EB !important;color:#FFFFFF;">&nbsp;E&nbsp;</td>' +
        '<td style=" background-color:#E8F4FD !important; ">Blocks an enemy\'s ability to dodge attacks</td>' +
        '<td style="font-size:12px;font-weight:bold;font-variant: small-caps;color:#000000;background-color:#DFF0FD !important;">Weak</td></tr></table></div>';

            break;

    }

    skillselect[0].parentNode.appendChild(node);
}
//toggleView();

/**
     * Add zoom functionality to image panels
     */
    
/*        var zooming=function(e){
            e=window.event ||e;
            var o=this,data=e.wheelDelta || -e.detail*40,zoom,size;
            if(!+'\v1'){//IE
                var oldWidth=o.offsetWidth;
                var oldHeight=o.offsetHeight;       
   
                zoom = parseInt(o.style.zoom) || 100;
                zoom += data / 12;
                if(zoom > zooming.min)
                    o.style.zoom = zoom + '%';
                e.returnValue=false;
   
                var newWidth=o.offsetWidth*zoom/100;
                var newHeight=o.offsetHeight*zoom/100;
                var scrollLeft = (o.parentNode.scrollLeft/oldWidth)*newWidth;
                var scrollTop = (o.parentNode.scrollTop/oldHeight)*newHeight;
               
                o.parentNode.scrollLeft = scrollLeft;
                o.parentNode.scrollTop = scrollTop;
            }else {
                size=o.getAttribute("_zoomsize").split(",");
                zoom=parseInt(o.getAttribute("_zoom")) ||100;
                zoom+=data/12;
                
                var oldWidth=o.offsetWidth;
                var oldHeight=o.offsetHeight;
                var newWidth=size[0]*zoom/100;
                var newHeight=size[1]*zoom/100;
                var scrollLeft = (o.parentNode.scrollLeft/oldWidth)*newWidth;
                var scrollTop = (o.parentNode.scrollTop/oldHeight)*newHeight;  

                if(zoom>zooming.min){
                    o.setAttribute("_zoom",zoom);
                    o.style.width=newWidth+"px";
                    o.parentNode.scrollLeft = scrollLeft;
                    o.parentNode.scrollTop = scrollTop;
                }
                e.preventDefault();
                e.stopPropagation();//for firefox3.6
            }
        }; 

    var addzooming =function(obj,min){// obj = image box, min defines the minimum image zoom size ,defaults to 50
        zooming.min=min || 50;
        obj.onmousewheel=zooming;
        if(/Firefox/.test(navigator.userAgent)) {//if Firefox
            obj.addEventListener("DOMMouseScroll",zooming,false);
            obj.setAttribute("_zoomsize",obj.naturalWidth+","+obj.naturalHeight);
        }
        else {
            obj.addEventListener("mousewheel",zooming,false);
        }
            
        }; 
    */
    var clickzoom = function(obj,min, max) {
        (obj.style.width == max) ? obj.style.width = min : obj.style.width = max;
    };

/* Show map(link) in dungeons */

var dungeondiv = document.getElementById("swf_djview");
var dungeontitle = "";
var dungeonswf = "";
var isdungeon = false;

if (dungeondiv) {
    var mapimage = "";
    var dungeonheader = document.getElementsByClassName("swf");
    for(var i=0;i<dungeonheader.length;i++) {
        if (dungeonheader[i].id.substr(0,9) == "swf_title") {
            dungeontitle = dungeonheader[i].id;
        }
        if (dungeonheader[i].id.substr(0,10) == "swf_djview") {
            isdungeon = true;
            dungeonswf = dungeonheader[i];
        }
    }
    var mapnode = document.createElement("div");
    var linknode = document.createElement("div");
    mapnode.id = "dungeonmap";
    mapnode.dataOrient = "center";
    mapnode.style = "width:800px;height:622px;position:relative; overflow:scroll;display:none;";
    
    var mapshow = document.createElement("a");
    var maplink = document.createElement("a");
    mapshow.setAttribute('href', '#');
    mapshow.addEventListener("click", function () { var x = document.getElementById("dungeonmap"); ((x.style.display == 'block') ? x.style.display = 'none' : x.style.display = 'block'); }, false);
    
    var linktext = "";
    
    if (isdungeon) {       
        switch (dungeontitle) {
            case 'swf_title_The Sewers of Monster Port':
                linktext = document.createTextNode('Show/Hide Dungeon Map');
                mapshow.appendChild(linktext);
                linknode.appendChild(mapshow);
                
                mapimage = document.createElement('img');
                mapimage.setAttribute("src","http://i.imgur.com/21nXPLo.jpg?1");
                mapimage.style.width = "1800px";
                mapimage.addEventListener("click",function(){clickzoom(this,'3500px','1800px');},false);
                //addzooming(mapimage);
                mapnode.appendChild(mapimage);
                
                //mapnode.innerHTML = '<img style="width:3500px;" src="http://i.imgur.com/21nXPLo.jpg?1" />';
                maplink.setAttribute('href', 'http://i.imgur.com/21nXPLo.jpg?1');
                maplink.setAttribute('target', '_blank');
                linktext = document.createTextNode('   -   ');
                linknode.appendChild(linktext);
                linktext = document.createTextNode('Link to external map');
                maplink.appendChild(linktext);
                linknode.appendChild(maplink);
                //linknode.innerHTML = '<a href="javascript:document.getElementById("dungeonmap").style.display == "block" ?  "  <a target="_blank" href="http://www.dinocenter.fr/images/laby/ilemonstre.jpg">Link to external map<a>';
                dungeonswf.parentNode.appendChild(linknode);
                dungeonswf.parentNode.appendChild(mapnode);
            break;
            case 'swf_title_The Katacombs':
                linktext = document.createTextNode('Show/Hide Dungeon Map Level 1');
                mapshow.appendChild(linktext);
                linknode.appendChild(mapshow);
                
                mapimage = document.createElement('img');
                mapimage.setAttribute("src","http://i.imgur.com/jooTB4p.jpg");
                mapimage.style.width = "900px";
                mapimage.addEventListener("click",function(){clickzoom(this,'900px','1800px');},false);
                //addzooming(mapimage);
                mapnode.appendChild(mapimage);
                
                maplink.setAttribute('href', 'http://i.imgur.com/jooTB4p.jpg');
                maplink.setAttribute('target', '_blank');
                linktext = document.createTextNode('   -   ');
                linknode.appendChild(linktext);
                linktext = document.createTextNode('Link to external map');
                maplink.appendChild(linktext);
                linknode.appendChild(maplink);
                
                var linknode2 = document.createElement("div");
                var linknode3 = document.createElement("div");
                var linknode4 = document.createElement("div");
                var mapnode2 = document.createElement("div");
                var mapnode3 = document.createElement("div");
                var mapnode4 = document.createElement("div");
                var mapshow2 = document.createElement("a");
                var mapshow3 = document.createElement("a");
                var mapshow4 = document.createElement("a");
                var maplink2 = document.createElement("a");
                var maplink3 = document.createElement("a");
                var maplink4 = document.createElement("a");

                mapnode2.id = "dungeonmap2"; mapnode2.dataOrient = "center"; mapnode2.style = "width:800px;height:622px;position:relative; overflow:scroll;display:none;";
                mapshow2.setAttribute('href', '#'); 
                mapshow2.addEventListener("click", function () { var x = document.getElementById("dungeonmap2"); ((x.style.display == 'block') ? x.style.display = 'none' : x.style.display = 'block'); }, false);
                linktext = document.createTextNode('Show/Hide Dungeon Map Level 2');
                mapshow2.appendChild(linktext);
                linknode2.appendChild(mapshow2);
                
                mapimage = document.createElement('img');
                mapimage.setAttribute("src","http://i.imgur.com/2TsEOVv.jpg");
                mapimage.style.width = "900px";
                mapimage.addEventListener("click",function(){clickzoom(this,'900px','1800px');},false);
                //addzooming(mapimage);
                mapnode2.appendChild(mapimage);
                
                maplink2.setAttribute('href', 'http://i.imgur.com/2TsEOVv.jpg');
                maplink2.setAttribute('target', '_blank');
                linktext = document.createTextNode('   -   ');
                linknode2.appendChild(linktext);
                linktext = document.createTextNode('Link to external map');
                maplink2.appendChild(linktext);
                linknode2.appendChild(maplink2);            
                
                mapnode3.id = "dungeonmap3"; mapnode3.dataOrient = "center"; mapnode3.style = "width:800px;height:622px;position:relative; overflow:scroll;display:none;";
                mapshow3.setAttribute('href', '#'); 
                mapshow3.addEventListener("click", function () { var x = document.getElementById("dungeonmap3"); ((x.style.display == 'block') ? x.style.display = 'none' : x.style.display = 'block'); }, false);
                linktext = document.createTextNode('Show/Hide Dungeon Map Level 3');
                mapshow3.appendChild(linktext);
                linknode3.appendChild(mapshow3);
                
                mapimage = document.createElement('img');
                mapimage.setAttribute("src","http://i.imgur.com/n25Hg1k.jpg");
                mapimage.style.width = "900px";
                mapimage.addEventListener("click",function(){clickzoom(this,'900px','1800px');},false);
                //addzooming(mapimage);
                mapnode3.appendChild(mapimage);
                
                maplink3.setAttribute('href', 'http://i.imgur.com/n25Hg1k.jpg');
                maplink3.setAttribute('target', '_blank');
                linktext = document.createTextNode('   -   ');
                linknode3.appendChild(linktext);
                linktext = document.createTextNode('Link to external map');
                maplink3.appendChild(linktext);
                linknode3.appendChild(maplink3);
                
                mapnode4.id = "dungeonmap4"; mapnode3.dataOrient = "center"; mapnode4.style = "width:800px;height:622px;position:relative; overflow:scroll;display:none;";
                mapshow4.setAttribute('href', '#'); 
                mapshow4.addEventListener("click", function () { var x = document.getElementById("dungeonmap4"); ((x.style.display == 'block') ? x.style.display = 'none' : x.style.display = 'block'); }, false);
                linktext = document.createTextNode('Show/Hide Dungeon Map Level 4');
                mapshow4.appendChild(linktext);
                linknode4.appendChild(mapshow4);
                
                mapimage = document.createElement('img');
                mapimage.setAttribute("src","http://i.imgur.com/xKPuVtG.jpg");
                mapimage.style.width = "900px";
                mapimage.addEventListener("click",function(){clickzoom(this,'900px','1800px');},false);
                //addzooming(mapimage);
                mapnode4.appendChild(mapimage);
                
                maplink4.setAttribute('href', 'http://i.imgur.com/xKPuVtG.jpg');
                maplink4.setAttribute('target', '_blank');
                linktext = document.createTextNode('   -   ');
                linknode4.appendChild(linktext);
                linktext = document.createTextNode('Link to external map');
                maplink4.appendChild(linktext);
                linknode4.appendChild(maplink4);
                
                
                dungeonswf.parentNode.appendChild(linknode);
                dungeonswf.parentNode.appendChild(linknode2);
                dungeonswf.parentNode.appendChild(linknode3);
                dungeonswf.parentNode.appendChild(linknode4);
                
                dungeonswf.parentNode.appendChild(mapnode);
                dungeonswf.parentNode.appendChild(mapnode2);
                dungeonswf.parentNode.appendChild(mapnode3);
                dungeonswf.parentNode.appendChild(mapnode4);
                
            break;
            case 'swf_title_The Temple of Quetzaco':
                linktext = document.createTextNode('Show/Hide Dungeon Map');
                mapshow.appendChild(linktext);
                linknode.appendChild(mapshow);
                
                mapimage = document.createElement('img');
                mapimage.setAttribute("src","http://imgup.motion-twin.com/dinorpg/0/b/d8d50e47_740115.jpg");
                mapimage.style.width = "900px";
                mapimage.addEventListener("click",function(){clickzoom(this,'2100px','900px');},false);
                //addzooming(mapimage);
                mapnode.appendChild(mapimage);
                
                maplink.setAttribute('href', 'http://imgup.motion-twin.com/dinorpg/0/b/d8d50e47_740115.jpg');
                maplink.setAttribute('target', '_blank');
                linktext = document.createTextNode('   -   ');
                linknode.appendChild(linktext);
                linktext = document.createTextNode('Link to external map');
                maplink.appendChild(linktext);
                linknode.appendChild(maplink);
                dungeonswf.parentNode.appendChild(linknode);
                dungeonswf.parentNode.appendChild(mapnode);
            break;
            case 'swf_title_Cuzcous Ruins':
                linktext = document.createTextNode('Show/Hide Dungeon Map Level 1');
                mapshow.appendChild(linktext);
                linknode.appendChild(mapshow);
                
                mapimage = document.createElement('img');
                mapimage.setAttribute("src","http://www.dinocenter.fr/images/laby/ruinescuzcous1.jpg");
                mapimage.style.width = "1800px";
                mapimage.addEventListener("click",function(){clickzoom(this,'1800px','3600px');},false);
                //addzooming(mapimage);
                mapnode.appendChild(mapimage);
                
                maplink.setAttribute('href', 'http://www.dinocenter.fr/images/laby/ruinescuzcous1.jpg');
                maplink.setAttribute('target', '_blank');
                linktext = document.createTextNode('   -   ');
                linknode.appendChild(linktext);
                linktext = document.createTextNode('Link to external map');
                maplink.appendChild(linktext);
                linknode.appendChild(maplink);
                
                var linknode2 = document.createElement("div");
                var linknode3 = document.createElement("div");
                var linknode4 = document.createElement("div");
                var linknode5 = document.createElement("div");
                var linknode6 = document.createElement("div");
                var linknode7 = document.createElement("div");
                var linknode8 = document.createElement("div");
                var linknode9 = document.createElement("div");
                var linknode10 = document.createElement("div");
                var linknode11 = document.createElement("div");
                var linknode12 = document.createElement("div");
                var mapnode2 = document.createElement("div");
                var mapnode3 = document.createElement("div");
                var mapnode4 = document.createElement("div");
                var mapnode5 = document.createElement("div");
                var mapnode6 = document.createElement("div");
                var mapnode7 = document.createElement("div");
                var mapnode8 = document.createElement("div");
                var mapnode9 = document.createElement("div");
                var mapnode10 = document.createElement("div");
                var mapnode11 = document.createElement("div");
                var mapnode12 = document.createElement("div");
                var mapshow2 = document.createElement("a");
                var mapshow3 = document.createElement("a");
                var mapshow4 = document.createElement("a");
                var mapshow5 = document.createElement("a");
                var mapshow6 = document.createElement("a");
                var mapshow7 = document.createElement("a");
                var mapshow8 = document.createElement("a");
                var mapshow9 = document.createElement("a");
                var mapshow10 = document.createElement("a");
                var mapshow11 = document.createElement("a");
                var mapshow12 = document.createElement("a");
                var maplink2 = document.createElement("a");
                var maplink3 = document.createElement("a");
                var maplink4 = document.createElement("a");
                var maplink5 = document.createElement("a");
                var maplink6 = document.createElement("a");
                var maplink7 = document.createElement("a");
                var maplink8 = document.createElement("a");
                var maplink9 = document.createElement("a");
                var maplink10 = document.createElement("a");
                var maplink11 = document.createElement("a");
                var maplink12 = document.createElement("a");

                mapnode2.id = "dungeonmap2"; mapnode2.dataOrient = "center"; mapnode2.style = "width:800px;height:622px;position:relative; overflow:scroll;display:none;";
                mapshow2.setAttribute('href', '#'); 
                mapshow2.addEventListener("click", function () { var x = document.getElementById("dungeonmap2"); ((x.style.display == 'block') ? x.style.display = 'none' : x.style.display = 'block'); }, false);
                linktext = document.createTextNode('Show/Hide Dungeon Map Level 2');
                mapshow2.appendChild(linktext);
                linknode2.appendChild(mapshow2);
                
                mapimage = document.createElement('img');
                mapimage.setAttribute("src","http://www.dinocenter.fr/images/laby/ruinescuzcous2.jpg");
                mapimage.style.width = "800px";
                mapimage.addEventListener("click",function(){clickzoom(this,'800px','1200px');},false);
                //addzooming(mapimage);
                mapnode2.appendChild(mapimage);
                
                maplink2.setAttribute('href', 'http://www.dinocenter.fr/images/laby/ruinescuzcous2.jpg');
                maplink2.setAttribute('target', '_blank');
                linktext = document.createTextNode('   -   ');
                linknode2.appendChild(linktext);
                linktext = document.createTextNode('Link to external map');
                maplink2.appendChild(linktext);
                linknode2.appendChild(maplink2);            
                
                mapnode3.id = "dungeonmap3"; mapnode3.dataOrient = "center"; mapnode3.style = "width:800px;height:622px;position:relative; overflow:scroll;display:none;";
                mapshow3.setAttribute('href', '#'); 
                mapshow3.addEventListener("click", function () { var x = document.getElementById("dungeonmap3"); ((x.style.display == 'block') ? x.style.display = 'none' : x.style.display = 'block'); }, false);
                linktext = document.createTextNode('Show/Hide Dungeon Map Level 3');
                mapshow3.appendChild(linktext);
                linknode3.appendChild(mapshow3);
                
                mapimage = document.createElement('img');
                mapimage.setAttribute("src","http://www.dinocenter.fr/images/laby/ruinescuzcous3.jpg");
                mapimage.style.width = "600px";
                mapimage.addEventListener("click",function(){clickzoom(this,'600px','1000px');},false);
                //addzooming(mapimage);
                mapnode3.appendChild(mapimage);
                
                maplink3.setAttribute('href', 'http://www.dinocenter.fr/images/laby/ruinescuzcous3.jpg');
                maplink3.setAttribute('target', '_blank');
                linktext = document.createTextNode('   -   ');
                linknode3.appendChild(linktext);
                linktext = document.createTextNode('Link to external map');
                maplink3.appendChild(linktext);
                linknode3.appendChild(maplink3);
                
                mapnode4.id = "dungeonmap4"; mapnode4.dataOrient = "center"; mapnode4.style = "width:800px;height:622px;position:relative; overflow:scroll;display:none;";
                mapshow4.setAttribute('href', '#'); 
                mapshow4.addEventListener("click", function () { var x = document.getElementById("dungeonmap4"); ((x.style.display == 'block') ? x.style.display = 'none' : x.style.display = 'block'); }, false);
                linktext = document.createTextNode('Show/Hide Dungeon Map Level 4');
                mapshow4.appendChild(linktext);
                linknode4.appendChild(mapshow4);
                
                mapimage = document.createElement('img');
                mapimage.setAttribute("src","http://www.dinocenter.fr/images/laby/ruinescuzcous4.jpg");
                mapimage.style.width = "600px";
                mapimage.addEventListener("click",function(){clickzoom(this,'600px','1000px');},false);
                //addzooming(mapimage);
                mapnode4.appendChild(mapimage);
                
                maplink4.setAttribute('href', 'http://www.dinocenter.fr/images/laby/ruinescuzcous4.jpg');
                maplink4.setAttribute('target', '_blank');
                linktext = document.createTextNode('   -   ');
                linknode4.appendChild(linktext);
                linktext = document.createTextNode('Link to external map');
                maplink4.appendChild(linktext);
                linknode4.appendChild(maplink4);
               
                mapnode5.id = "dungeonmap5"; mapnode5.dataOrient = "center"; mapnode5.style = "width:800px;height:622px;position:relative; overflow:scroll;display:none;";
                mapshow5.setAttribute('href', '#'); 
                mapshow5.addEventListener("click", function () { var x = document.getElementById("dungeonmap5"); ((x.style.display == 'block') ? x.style.display = 'none' : x.style.display = 'block'); }, false);
                linktext = document.createTextNode('Show/Hide Dungeon Map Level 5');
                mapshow5.appendChild(linktext);
                linknode5.appendChild(mapshow5);
                
                mapimage = document.createElement('img');
                mapimage.setAttribute("src","http://www.dinocenter.fr/images/laby/ruinescuzcous5.jpg");
                mapimage.style.width = "700px";
                mapimage.addEventListener("click",function(){clickzoom(this,'700px','1300px');},false);
                //addzooming(mapimage);
                mapnode5.appendChild(mapimage);
                
                maplink5.setAttribute('href', 'http://www.dinocenter.fr/images/laby/ruinescuzcous5.jpg');
                maplink5.setAttribute('target', '_blank');
                linktext = document.createTextNode('   -   ');
                linknode5.appendChild(linktext);
                linktext = document.createTextNode('Link to external map');
                maplink5.appendChild(linktext);
                linknode5.appendChild(maplink5);
          
                mapnode6.id = "dungeonmap6"; mapnode6.dataOrient = "center"; mapnode6.style = "width:800px;height:622px;position:relative; overflow:scroll;display:none;";
                mapshow6.setAttribute('href', '#'); 
                mapshow6.addEventListener("click", function () { var x = document.getElementById("dungeonmap6"); ((x.style.display == 'block') ? x.style.display = 'none' : x.style.display = 'block'); }, false);
                linktext = document.createTextNode('Show/Hide Dungeon Map Level 6');
                mapshow6.appendChild(linktext);
                linknode6.appendChild(mapshow6);
                
                mapimage = document.createElement('img');
                mapimage.setAttribute("src","http://www.dinocenter.fr/images/laby/ruinescuzcous6.jpg");
                mapimage.style.width = "800px";
                mapimage.addEventListener("click",function(){clickzoom(this,'800px','1400px');},false);
                //addzooming(mapimage);
                mapnode6.appendChild(mapimage);
                
                maplink6.setAttribute('href', 'http://www.dinocenter.fr/images/laby/ruinescuzcous6.jpg');
                maplink6.setAttribute('target', '_blank');
                linktext = document.createTextNode('   -   ');
                linknode6.appendChild(linktext);
                linktext = document.createTextNode('Link to external map');
                maplink6.appendChild(linktext);
                linknode6.appendChild(maplink6);
          
                
                mapnode7.id = "dungeonmap7"; mapnode7.dataOrient = "center"; mapnode7.style = "width:800px;height:622px;position:relative; overflow:scroll;display:none;";
                mapshow7.setAttribute('href', '#'); 
                mapshow7.addEventListener("click", function () { var x = document.getElementById("dungeonmap7"); ((x.style.display == 'block') ? x.style.display = 'none' : x.style.display = 'block'); }, false);
                linktext = document.createTextNode('Show/Hide Dungeon Map Level 7');
                mapshow7.appendChild(linktext);
                linknode7.appendChild(mapshow7);

                mapimage = document.createElement('img');
                mapimage.setAttribute("src","http://www.dinocenter.fr/images/laby/ruinescuzcous7.jpg");
                mapimage.style.width = "800px";
                mapimage.addEventListener("click",function(){clickzoom(this,'800px','1400px');},false);
                //addzooming(mapimage);
                mapnode7.appendChild(mapimage);
     
                maplink7.setAttribute('href', 'http://www.dinocenter.fr/images/laby/ruinescuzcous7.jpg');
                maplink7.setAttribute('target', '_blank');
                linktext = document.createTextNode('   -   ');
                linknode7.appendChild(linktext);
                linktext = document.createTextNode('Link to external map');
                maplink7.appendChild(linktext);
                linknode7.appendChild(maplink7);
           
                mapnode8.id = "dungeonmap8"; mapnode8.dataOrient = "center"; mapnode8.style = "width:800px;height:622px;position:relative; overflow:scroll;display:none;";
                mapshow8.setAttribute('href', '#'); 
                mapshow8.addEventListener("click", function () { var x = document.getElementById("dungeonmap8"); ((x.style.display == 'block') ? x.style.display = 'none' : x.style.display = 'block'); }, false);
                linktext = document.createTextNode('Show/Hide Dungeon Map Level 8');
                mapshow8.appendChild(linktext);
                linknode8.appendChild(mapshow8);
                
                mapimage = document.createElement('img');
                mapimage.setAttribute("src","http://www.dinocenter.fr/images/laby/ruinescuzcous8.jpg");
                mapimage.style.width = "700px";
                mapimage.addEventListener("click",function(){clickzoom(this,'700px','1300px');},false);
                //addzooming(mapimage);
                mapnode8.appendChild(mapimage);
                
                maplink8.setAttribute('href', 'http://www.dinocenter.fr/images/laby/ruinescuzcous8.jpg');
                maplink8.setAttribute('target', '_blank');
                linktext = document.createTextNode('   -   ');
                linknode8.appendChild(linktext);
                linktext = document.createTextNode('Link to external map');
                maplink8.appendChild(linktext);
                linknode8.appendChild(maplink8);
           
                mapnode9.id = "dungeonmap9"; mapnode9.dataOrient = "center"; mapnode9.style = "width:800px;height:622px;position:relative; overflow:scroll;display:none;";
                mapshow9.setAttribute('href', '#'); 
                mapshow9.addEventListener("click", function () { var x = document.getElementById("dungeonmap9"); ((x.style.display == 'block') ? x.style.display = 'none' : x.style.display = 'block'); }, false);
                linktext = document.createTextNode('Show/Hide Dungeon Map Level 9');
                mapshow9.appendChild(linktext);
                linknode9.appendChild(mapshow9);
                
                mapimage = document.createElement('img');
                mapimage.setAttribute("src","http://www.dinocenter.fr/images/laby/ruinescuzcous9.jpg");
                mapimage.style.width = "900px";
                mapimage.addEventListener("click",function(){clickzoom(this,'900px','1400px');},false);
                //addzooming(mapimage);
                mapnode9.appendChild(mapimage);
                
                maplink9.setAttribute('href', 'http://www.dinocenter.fr/images/laby/ruinescuzcous9.jpg');
                maplink9.setAttribute('target', '_blank');
                linktext = document.createTextNode('   -   ');
                linknode9.appendChild(linktext);
                linktext = document.createTextNode('Link to external map');
                maplink9.appendChild(linktext);
                linknode9.appendChild(maplink9);
        
                mapnode10.id = "dungeonmap10"; mapnode10.dataOrient = "center"; mapnode10.style = "width:800px;height:622px;position:relative; overflow:scroll;display:none;";
                mapshow10.setAttribute('href', '#'); 
                mapshow10.addEventListener("click", function () { var x = document.getElementById("dungeonmap10"); ((x.style.display == 'block') ? x.style.display = 'none' : x.style.display = 'block'); }, false);
                linktext = document.createTextNode('Show/Hide Dungeon Map Level 10');
                mapshow10.appendChild(linktext);
                linknode10.appendChild(mapshow10);
                
                mapimage = document.createElement('img');
                mapimage.setAttribute("src","http://www.dinocenter.fr/images/laby/ruinescuzcous10.jpg");
                mapimage.style.width = "900px";
                mapimage.addEventListener("click",function(){clickzoom(this,'900px','1400px');},false);
                //addzooming(mapimage);
                mapnode10.appendChild(mapimage);
                
                maplink10.setAttribute('href', 'http://www.dinocenter.fr/images/laby/ruinescuzcous10.jpg');
                maplink10.setAttribute('target', '_blank');
                linktext = document.createTextNode('   -   ');
                linknode10.appendChild(linktext);
                linktext = document.createTextNode('Link to external map');
                maplink10.appendChild(linktext);
                linknode10.appendChild(maplink10);
         
                mapnode11.id = "dungeonmap11"; mapnode11.dataOrient = "center"; mapnode11.style = "width:800px;height:622px;position:relative; overflow:scroll;display:none;";
                mapshow11.setAttribute('href', '#'); 
                mapshow11.addEventListener("click", function () { var x = document.getElementById("dungeonmap11"); ((x.style.display == 'block') ? x.style.display = 'none' : x.style.display = 'block'); }, false);
                linktext = document.createTextNode('Show/Hide Dungeon Map Level 11');
                mapshow11.appendChild(linktext);
                linknode11.appendChild(mapshow11);
                
                mapimage = document.createElement('img');
                mapimage.setAttribute("src","http://www.dinocenter.fr/images/laby/ruinescuzcous11.jpg");
                mapimage.style.width = "900px";
                mapimage.addEventListener("click",function(){clickzoom(this,'900px','1600px');},false);
                //addzooming(mapimage);
                mapnode11.appendChild(mapimage);
                
                maplink11.setAttribute('href', 'http://www.dinocenter.fr/images/laby/ruinescuzcous11.jpg');
                maplink11.setAttribute('target', '_blank');
                linktext = document.createTextNode('   -   ');
                linknode11.appendChild(linktext);
                linktext = document.createTextNode('Link to external map');
                maplink11.appendChild(linktext);
                linknode11.appendChild(maplink11);
      
                mapnode12.id = "dungeonmap12"; mapnode12.dataOrient = "center"; mapnode12.style = "width:800px;height:622px;position:relative; overflow:scroll;display:none;";
                mapshow12.setAttribute('href', '#'); 
                mapshow12.addEventListener("click", function () { var x = document.getElementById("dungeonmap12"); ((x.style.display == 'block') ? x.style.display = 'none' : x.style.display = 'block'); }, false);
                linktext = document.createTextNode('Show/Hide Dungeon Map Level 12');
                mapshow12.appendChild(linktext);
                linknode12.appendChild(mapshow12);
                
                mapimage = document.createElement('img');
                mapimage.setAttribute("src","http://www.dinocenter.fr/images/laby/ruinescuzcous12.jpg");
                mapimage.style.width = "600px";
                mapimage.addEventListener("click",function(){clickzoom(this,'600px','900px');},false);
                //addzooming(mapimage);
                mapnode12.appendChild(mapimage);
                
                maplink12.setAttribute('href', 'http://www.dinocenter.fr/images/laby/ruinescuzcous12.jpg');
                maplink12.setAttribute('target', '_blank');
                linktext = document.createTextNode('   -   ');
                linknode12.appendChild(linktext);
                linktext = document.createTextNode('Link to external map');
                maplink12.appendChild(linktext);
                linknode12.appendChild(maplink12);
        
                dungeonswf.parentNode.appendChild(linknode);
                dungeonswf.parentNode.appendChild(linknode2);
                dungeonswf.parentNode.appendChild(linknode3);
                dungeonswf.parentNode.appendChild(linknode4);
                dungeonswf.parentNode.appendChild(linknode5);
                dungeonswf.parentNode.appendChild(linknode6);
                dungeonswf.parentNode.appendChild(linknode7);
                dungeonswf.parentNode.appendChild(linknode8);
                dungeonswf.parentNode.appendChild(linknode9);
                dungeonswf.parentNode.appendChild(linknode10);
                dungeonswf.parentNode.appendChild(linknode11);
                dungeonswf.parentNode.appendChild(linknode12);
                
                dungeonswf.parentNode.appendChild(mapnode);
                dungeonswf.parentNode.appendChild(mapnode2);
                dungeonswf.parentNode.appendChild(mapnode3);
                dungeonswf.parentNode.appendChild(mapnode4);
                dungeonswf.parentNode.appendChild(mapnode5);
                dungeonswf.parentNode.appendChild(mapnode6);
                dungeonswf.parentNode.appendChild(mapnode7);
                dungeonswf.parentNode.appendChild(mapnode8);
                dungeonswf.parentNode.appendChild(mapnode9);
                dungeonswf.parentNode.appendChild(mapnode10);
                dungeonswf.parentNode.appendChild(mapnode11);
                dungeonswf.parentNode.appendChild(mapnode12);
                
            break;
        }
        

    }
}


function performAction(dinoId, action, referer) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    xmlhttp.open('GET', 'http://' + location.host + '/dino/' + dinoId + '/' + action, false);
    xmlhttp.setRequestHeader('User-agent', window.navigator.userAgent);
    xmlhttp.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;');
    xmlhttp.setRequestHeader('Referer', 'http://' + location.host + '/' + referer);
    xmlhttp.setRequestHeader('Cookie', document.cookie);
    xmlhttp.send();
    return xmlhttp.responseText;
}
