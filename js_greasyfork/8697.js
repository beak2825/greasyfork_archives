// ==UserScript==
// @name        GmailDisplay
// @description Adds Gmail element
// @namespace   ag
// @include     https://mail.google.com/mail/u/0/h/*&v=c*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8697/GmailDisplay.user.js
// @updateURL https://update.greasyfork.org/scripts/8697/GmailDisplay.meta.js
// ==/UserScript==

var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">'
                + 'Analyze this E-Mail ! </button>'
                ;
zNode.setAttribute ('id', 'myContainer');
//document.body.appendChild (zNode);
document.getElementById ("guser").appendChild (zNode);
//guser

//var someDiv = document.getElementById("guser");

//--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {
    /*--- For our dummy action, we'll just add a line of text to the top
        of the screen.
    */
   var a=document.URL;
  var b=a.toString();
  var c=b.replace("v=c","v=om");
    //alert(c);
    document.location.href=c;
   // document.URL=c;
  //  document.URL(c);
    
   // var zNode       = document.createElement ('p');
    //zNode.innerHTML = 'The button was clicked.';
    //document.getElementById ("myContainer").appendChild (zNode);
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