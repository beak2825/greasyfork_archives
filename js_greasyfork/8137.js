// ==UserScript==
// @name        Nominate hack
// @description Nomination workaround
// @namespace   http://poems-and-quotes.com
// @include     http://www.best-love-poems.com/poems.php?id=*
// @include     http://www.friendship-poems.com/poems.php?id=*
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/8137/Nominate%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/8137/Nominate%20hack.meta.js
// ==/UserScript==

var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">'
                + 'Nominate Hack</button>'
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
    */
    var currentLocation = window.location.href;

var lovePoemTest = currentLocation.search("love"); 
var newLocation;
if (lovePoemTest != -1)
{
    newLocation = currentLocation.replace("http://www.best-love-poems.com/poems.php?id=", "http://www.poems-and-quotes.com/misc/poems.php?id=");
}

var friendshipPoemTest = currentLocation.search("friendship"); 
if (friendshipPoemTest != -1)
{
    newLocation = currentLocation.replace("http://www.friendship-poems.com/poems.php?id=", "http://www.poems-and-quotes.com/misc/poems.php?id=");
   
}

window.location = newLocation;
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