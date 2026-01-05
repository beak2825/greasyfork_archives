// ==UserScript==
// @name        Check Praised Comments
// @description Check Praised Comments Using Button
// @namespace   http://poems-and-quotes.com
// @include     http://www.poems-and-quotes.com/author.html?id=*
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/8167/Check%20Praised%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/8167/Check%20Praised%20Comments.meta.js
// ==/UserScript==

var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">'
                + 'See Praised Comments</button>'
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

    newLocation = currentLocation.replace("http://www.poems-and-quotes.com/author.html?id=", "http://www.poems-and-quotes.com/author_comments_praised.html?id=");


window.location = newLocation;
}

//--- Style our newly added elements using CSS.
GM_addStyle ( multilineStr ( function () {/*!
    #myContainer {
        position:               absolute;
        top:                    0;
        left:                   0;
        font-size:              20px;
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