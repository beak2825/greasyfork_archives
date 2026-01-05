// ==UserScript==
// @name        NW - inventory names
// @description Prints NeverWinterOnline items in inventory (including content of user bags!)
// @include http://gateway*.playneverwinter.com/*
// @include https://gateway*.playneverwinter.com/*
// @include http://gateway.*.perfectworld.eu/*
// @include https://gateway.*.perfectworld.eu/*
// @grant       GM_addStyle
// @version 0.0.1.2015051501
// @namespace https://greasyfork.org/users/8151
// @downloadURL https://update.greasyfork.org/scripts/8506/NW%20-%20inventory%20names.user.js
// @updateURL https://update.greasyfork.org/scripts/8506/NW%20-%20inventory%20names.meta.js
// ==/UserScript==

/** based on NW -profession names by Rotten_mind
 *  https://greasyfork.org/en/scripts/7977-nw-profession-names
*/

function Print_inventory() {
    var _bags = unsafeWindow.client.dataModel.model.ent.main.inventory.bags;
    var _bagNames = ["1.", 
                     "2.", 
                     "3.", 
                     "4. User bags", 
                     "5. Personal bank", 
                     "6.", 
                     "7.", 
                     "8. Active companions", 
                     "9. Equipment - head", 
                     "10. Equipment- neck", 
                     "11. Equipment - chest", 
                     "12. Equipment - arms", 
                     "13. Equipment - belt", 
                     "14. Equipment - boots",
                     "15. Equipment - weapon & off-hand", 
                     "16. Equipment - shirt", 
                     "17. Equipment - pants", 
                     "18. Equipment - rings", 
                     "19. Proffesion assets", 
                     "20. Proffesion resources",
                     "21. Other currencies",
                     "22. Idle companions",
                     "23. Fashion - head",
                     "24.",
                     "25. Fashion - shirt",
                     "26. Fashion - pants",
                     "27. Active mount",
                     "28. Active slots",
                     "29. Primary artifact",
                     "30. Secondary artifacts",
                     "31.",
                     "32.",
                     "33.",
                     "34.",
                     "35.",
                     "36."];           
    var i = 0;
    $.each(_bags, function (bi, bag) {
        console.log(_bagNames[i++]);
        bag.slots.forEach(function (slot) {
            if (slot) console.log(slot.name + ": x" + slot.count);
        });
    });  
 
    // by Rotten_mind
    var _pbags = client.dataModel.model.ent.main.inventory.playerbags;
    // var _tmpBag1 = [];
    console.log("  . Content of user bags");
        $.each(_pbags, function (bi, bag) {
        bag.slots.forEach(function (slot) {
    //        _tmpBag1[_tmpBag1.length] = slot;
            if (slot !== null && slot && slot !== undefined) {
                console.log(slot.name + ": x" + slot.count); // normal inventory debug msg
            }
        });
    });
/*  
    // this piece of code shows tradeabe items i.e.:
    // - content of user bags (above) WITHOUT BINDED, 
    // - profession assets (currently not used),
    // - profession resource   
    var _pbags_crafting = client.dataModel.model.ent.main.inventory.tradebag; 
    var _tmpBag2 = [];
    _pbags_crafting.forEach(function (slot) {
        _tmpBag2[_tmpBag2.length] = slot;
        if (slot !== null && slot && slot !== undefined) {
            console.log(slot.name + ": x" + slot.count); 
        }
    });
*/
}    
    
/*--- Create a button in a container div.  It will be styled and
 positioned with CSS.
 */

var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="myButtonInventory" type="button">'
+ 'Don\'t click me! Okay, login first and then... click</button>'
;
zNode.setAttribute ('id', 'myContainerInventory');
document.body.appendChild (zNode);

//--- Activate the newly added button.
document.getElementById ("myButtonInventory").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {
    /*--- For our dummy action, we'll just add a line of text to the top
     of the screen.
     *///onclick();
    Print_inventory();
    var zNode       = document.createElement ('p');
    zNode.innerHTML = 'The button was clicked. Look console log';
    document.getElementById ("myContainerInventory").replaceChild (zNode, zNode);
}

//--- Style our newly added elements using CSS.
GM_addStyle ( multilineStr ( function () {/*!
 #myContainerInventory {
 position:               absolute;
 top:                    70px;
 left:                   0;
 font-size:              20px;
 background:             yellow;
 border:                 3px outset black;
 margin:                 5px;
 opacity:                0.9;
 z-index:                222;
 padding:                5px 20px;
 }
 #myButtonInventory {
 cursor:                 pointer;
 }
 #myContainerInventory p {
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