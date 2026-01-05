// ==UserScript==
// @name         MOL God Mode
// @namespace    http://www.chipstrips.com
// @version      0.1
// @description  Description
// @author       Chip Reinhardt
// @include      https://businessonline.motorolasolutions.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/9406/MOL%20God%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/9406/MOL%20God%20Mode.meta.js
// ==/UserScript==


createGodModeMenu();
addGodModeItem("Google", "http://www.google.com");

/*
var input=document.createElement("input");
input.type="button";
input.value="Ryan's Button";
input.onclick = showAlert;
input.setAttribute("style", "font-size:18px;position:absolute;top:0;left:0;");
document.body.appendChild(input); 
*/

function createGodModeMenu()
{
    menu = document.getElementById('masterul');
    godMenu = document.createElement('li');
    godMenuParent = document.createElement('a');
    godMenuParent.setAttribute('target','_top');
    godMenuParent.setAttribute('href','https://google.com');
    godMenuParent.setAttribute('id','parentnode');
    godMenuParent.setAttribute('style','padding-right: 20px;');
    godMenuParent.setAttribute('class','');
    godMenuParent.appendChild(document.createTextNode("God Mode"));

    godMenu.appendChild(godMenuParent);
    godMenu.setAttribute('style', 'z-index: 586;');

    godMenuList = document.createElement('ul');
    godMenuList.setAttribute('style','display: none; top: 33px; visibility: visible;');
    godMenuList.setAttribute('id','godMenu');

    godMenuList.appendChild(document.createElement('li'));
    godMenu.appendChild(godMenuList);
    menu.appendChild(godMenu);    
}

function addGodModeItem(label, link)
{
    m = document.getElementById('godMenu').firstChild;
    s = document.createElement('a');
    s.setAttribute('target','_top');
    s.setAttribute('href',link);
    s.appendChild(document.createTextNode(label));
    m.appendChild(s);
}
