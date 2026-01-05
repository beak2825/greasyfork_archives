// ==UserScript==
// @name         eBay display feed item info
// @namespace    http://mbignell.com/
// @version      0.2
// @description  Shows hover information on feed
// @author       Mike Bignell
// @match        http://www.ebay.co.uk/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9516/eBay%20display%20feed%20item%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/9516/eBay%20display%20feed%20item%20info.meta.js
// ==/UserScript==

function setDivOpacity ()
{
    var allHoverInfos = document.getElementsByClassName("hover-info");

    for(var i = 0; i < allHoverInfos.length; i++)
    {
        var div = allHoverInfos[i];
        //console.log(div);
        
        if (div.getAttribute("style") == null)
        {
            div.setAttribute("style","opacity: 0.5;");
        }
    }
}

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
    // fired when a mutation occurs
    //console.log(mutations, observer);
    setDivOpacity();
});

observer.observe(document, {
    subtree: true,
    childList: true,
});
