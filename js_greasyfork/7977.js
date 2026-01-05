// ==UserScript==
// @name        NW_profession_names
// @include http://gateway*.playneverwinter.com/*
// @include https://gateway*.playneverwinter.com/*
// @include http://gateway.*.perfectworld.eu/*
// @include https://gateway.*.perfectworld.eu/*
// @grant       GM_addStyle
// @version 0.0.2
// @namespace https://greasyfork.org/users/2278
// @description Prins NW professions name to console
// @downloadURL https://update.greasyfork.org/scripts/7977/NW_profession_names.user.js
// @updateURL https://update.greasyfork.org/scripts/7977/NW_profession_names.meta.js
// ==/UserScript==

/*--- Create a button in a container div.  It will be styled and
 positioned with CSS.
 */
function onclick() {
    profession = window.prompt("Add profession name and look console log", "profession");
    return profession ;}






function Print_prodessions(proffession) {

    var tasks = unsafeWindow.client.dataModel.model.craftinglist['craft_' + proffession].entries.filter(function (entry) {
        return entry.def && entry.def.displayname;
    });
    //var tasks = unsafeWindow.client.dataModel.model.craftinglist['craft_' + 'Artificing'];
    var professuinlist = tasks.forEach(function (main) {
        main.consumables.forEach(function (slotconsum) {
            main.rewards.forEach(function (slotrewards) {
                console.log("LVL:" + main.def.requiredrank + ", ", "name: " + '"' + main.def.displayname + '", ', "task: " + '"' + main.def.name + '", ', main.rewards[0].hdef.replace('[',': "').replace(']', '", '), "Required:" + main.consumables[0].hdef.replace('@ItemDef[',' "').replace(']', '",'));
            });
        });
    });
}


var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">'
+ 'For Pete\'s sake, don\'t click me! okay, move to page where is profession what names you want print and then... click</button>'
;
zNode.setAttribute ('id', 'myContainer');
document.body.appendChild (zNode);

//--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {
    /*--- For our dummy action, we'll just add a line of text to the top
     of the screen.
     *///onclick();
    var zNode       = document.createElement ('p');
    zNode.innerHTML = 'The button was clicked. Look console log' + Print_prodessions(onclick());
    document.getElementById ("myContainer").replaceChild (zNode, zNode);
}

//--- Style our newly added elements using CSS.
GM_addStyle ( multilineStr ( function () {/*!
 #myContainer {
 position:               absolute;
 top:                    0;
 left:                   0;
 font-size:              20px;
 background:             orange;
 border:                 3px outset black;
 margin:                 5px;
 opacity:                0.9;
 z-index:                222;
 padding:                5px 20px;
 }
 #myButton {
 cursor:                 pointer;
 }
 #myContainer p {
 color:                  red;
 background:             white;
 }
 */} ) );

function multilineStr (dummyFunc) {
    var str = dummyFunc.toString ();
    str     = str.replace (/^[^\/]+\/\*!?/, '') // Strip function () { /*!
    .replace (/\s*\*\/\s*\}\s*$/, '')   // Strip */ }
    .replace (/\/\/.+$/gm, '') // Double-slash comments wreck CSS. Strip them.
    ;
    return str;
}