// ==UserScript==
// @name         HeroesRPGRedesign
// @author		 Karasu
// @version      0.1
// @match        http://heroesrpg.com/game.php
// @description Simple redesign for HeroesRPG. Allows Cutting Stone.
// @namespace https://greasyfork.org/users/9403
// @downloadURL https://update.greasyfork.org/scripts/8284/HeroesRPGRedesign.user.js
// @updateURL https://update.greasyfork.org/scripts/8284/HeroesRPGRedesign.meta.js
// ==/UserScript==

redesign = function (){
    // LIST OF ELEMENTS TO REMOVE
    var remId = ['header', 'footer'];
    var remParentId = [];
    // LIST OF ELEMENTS TO HIDE
    var hideId = ['main-stats', 'holder-right', 'chat1', 'main-nav'];
    // -----------------------------------------------------------------------------------
    var elementList; var idList;
    popIdList = function(id) {
        if(document.getElementById(id)) {
            elementList[elementList.length] = document.getElementById(id);
        } else { console.log('redesign(): element ' + id + ' not found.'); }
    }
    removeElements = function() {
        elementList = []; idList = remId;
        for (var i = 0; i < idList.length; i++) { popIdList(idList[i]); }
        for (var i = 0; i < elementList.length; i++) { elementList[i].remove(); }
    }
    removeParentElements = function() {
        elementList = []; idList = remParentId;
        for (var i = 0; i < idList.length; i++) { popIdList(idList[i]); }
        for (var i = 0; i < elementList.length; i++) { elementList[i].parentNode.remove(); }
    }
    hideElements = function() {
        elementList = []; idList = hideId;
        for (var i = 0; i < idList.length; i++) { popIdList(idList[i]); }
        for (var i = 0; i < elementList.length; i++) { elementList[i].style.display = 'none'; }
    }
    removeElements(); removeParentElements(); hideElements();
    
    // Modify channels
    document.getElementById('channels').innerHTML = '<button onclick="gather(4,1,1)">Cut Stone</button></div>';
    
    // New menu
    var para = document.createElement("div"); para.setAttribute("id", "newMenu");
    para.appendChild(document.getElementById('s_cname'));
    para.innerHTML = para.innerHTML + ' | Gold : '; para.appendChild(document.getElementById('s_gold'));
    para.innerHTML = para.innerHTML + ' | Credits : '; para.appendChild(document.getElementById('s_credits'));
    para.innerHTML = para.innerHTML + ' | '; para.appendChild(document.getElementById('s_quest1'));
    para.innerHTML = para.innerHTML + ' | '; para.appendChild(document.getElementById('s_quest2'));
    var child = document.getElementById('main-stats');
    document.getElementById('left').insertBefore(para, child);
    document.getElementById('s_cname')
    GM_addStyle('div#newMenu { color: #FFF; display:block; width:80%; padding: 5px; }');
}

redesign();