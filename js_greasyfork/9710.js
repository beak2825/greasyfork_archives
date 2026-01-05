// ==UserScript==
// @name        ARD-Mediathek-ANTI-FSK
// @description Entfernt die FSK-Hinweise der ARD-Mediathek und ersetzt sie durch das Video. :)
// @namespace   ardmediaantifsk
// @include     http://www.ardmediathek.de/*
// @include     http://ardmediathek.de/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9710/ARD-Mediathek-ANTI-FSK.user.js
// @updateURL https://update.greasyfork.org/scripts/9710/ARD-Mediathek-ANTI-FSK.meta.js
// ==/UserScript==

function removeFskPanels() {
    var nodeList = document.querySelectorAll(".fsk");
    for (var i = 0, length = nodeList.length; i < length; i++) {
        if (true !== nodeList[i].FSK_REMOVED) {
            nodeList[i].FSK_REMOVED = true;
            removeFskPanel(nodeList[i]);
        }
    }
}

function removeFskPanel(fskNode) {
    var nodeList = fskNode.querySelectorAll(".textWrapper");
    for (var i = 0, length = nodeList.length; i < length; i++) {
        nodeList[i].parentNode.removeChild(nodeList[i]);
    }

    nodeList = fskNode.querySelectorAll(".media");
    for (var i = 0, length = nodeList.length; i < length; i++) {
        addPlayerAttribute(nodeList[i]);
    }
}

function addPlayerAttribute(mediaNode) {
    var myParam = window.location.search.split('documentId=')[1] ? window.location.search.split('documentId=')[1] : '0';
    myParam = parseInt(myParam);
    if (myParam > 0) {
        mediaNode.setAttribute("data-ctrl-player", "{'id':'player','action':{'default':['init','calcCssClass','calcHeight']},'pcUrl':'/play/config/" + myParam + "','mcUrl':'/play/media/" + myParam + "'}");
    }
    app.initControllers(document.body);
}

var intervalId = setInterval(removeFskPanels, 1000);