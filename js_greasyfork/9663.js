// ==UserScript==
// @name        Daily Mail: remove royalty
// @namespace   kwhitefoot@hotmail.com
// @description Remove royalty related articles from the Daily mail front page.
// @include     https://www.dailymail.co.uk/home/index.html
// @version     0.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9663/Daily%20Mail%3A%20remove%20royalty.user.js
// @updateURL https://update.greasyfork.org/scripts/9663/Daily%20Mail%3A%20remove%20royalty.meta.js
// ==/UserScript==

/*

Changes
  0.3: Changed to https

Adapted from PalinHider by pyro (http://www.metafilter.com/user/84673)

Removes links and articles from the main page that match a certain regex.

In my case the regex matches various royal and other attention seekers
as well as sport and the war ("Don't mention the war!").

Feel free to adapt it how you like.

*/

      
var matcher = new RegExp("duchess|abramovich|ww2|nazi|bodybuilder|prince|princess|beckham|mccann|markle|middleton|binge|royal|doubleclick|tvshowbiz|sport", "i")


function hideLinks() {
    "use strict";
    //alert("hideLinks");
    //var linkMatcher = new RegExp("/chinese/i");
    var links = document.getElementsByTagName("a"),
        keyVar,
        thisLink,
        linkText,
        linkHref;
   
    try {
        for (keyVar in links) {
            thisLink = links[keyVar];
            if (thisLink) {
                linkText = thisLink.innerHTML;
                linkHref = thisLink.href;
                if (linkText &&
                    ((linkHref.search(matcher) !== -1) ||
                     (linkText.search(matcher) !== -1))) {
                    //alert('match href ' + linkHref + ' it ' + linkText);
                    thisLink.parentNode.style.display = "none";
                    thisLink.parentNode.visibility = "hidden";
                }
            }
        }
    } catch (ex) {
        alert('caught ' + ex.toString());
    }
}


function hideHeadings() {
    "use strict";
    var elements = document.getElementsByTagName("h2"),
        element,
        text,
        i;
    //alert('a ' + elements.length.toString());
    try {
        for (i = 0; i< elements.length; i++) {
             element = elements[i];
             if (element) {
                 //alert('e ' + element.toString());
                 text = element.textContent;
                 //alert('t ' + text);
                 if (typeof text !== 'undefined') {
                     //alert('t ' + text + ' m: ' + text.search(matcher));
                     if (text.search(matcher) !== -1) {
                         //alert('match ' + text);
                         element.parentNode.style.display = "none";
                         element.parentNode.visibility = "hidden";
                     }
                 }
             }
         }        
    } catch (ex) {
        alert('b ex: ' + ex.toString());
    }
}
function hideArticles() {
    "use strict";
    var elements = document.getElementsByClassName("article"),
        element,
        text,
        i;
    //alert('a ' + elements.length.toString());
    try {
        for (i = 0; i< elements.length; i++) {
             element = elements[i];
             if (element) {
                 //alert('e ' + element.toString());
                 text = element.textContent;
                 //alert('t ' + text);
                 if (typeof text !== 'undefined') {
                     //alert('t ' + text + ' m: ' + text.search(matcher));
                     if (text.search(matcher) !== -1) {
                         //alert('match ' + text);
                         element.style.display = "none";
                         element.visibility = "hidden";
                     }
                 }
             }
         }        
    } catch (ex) {
        alert('b ex: ' + ex.toString());
    }
}

function hideClass(c) {

    var elements = document.getElementsByClassName(c),
        element,
        i;

    for (i = 0; i< elements.length; i++) {
        element = elements[i];
        element.remove();
    }
}

function hide() {
    hideArticles();
    hideLinks();
    hideHeadings();
    hideClass("fff-hottest-list");
}
try {

    //alert("1");
    hide();
    //alert("2");
    //window.setTimeout(hide, 1000);
    //alert("3");
    window.setInterval(hide, 10000);
    //alert("4");
} catch (ex) {
    alert('a ex: ' + ex.toString());
}
