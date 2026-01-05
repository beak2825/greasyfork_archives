// ==UserScript==
// @name        Show SDMB Who Posted
// @namespace   SDMB_ShowWhoPosted
// @version     0.5.0
// @description Shows "Who Posted" popup from a thread
// @author      TroutMan
// @include     http://boards.straightdope.com/sdmb/showthread.php*
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/9140/Show%20SDMB%20Who%20Posted.user.js
// @updateURL https://update.greasyfork.org/scripts/9140/Show%20SDMB%20Who%20Posted.meta.js
// ==/UserScript==

var threadId = qr_threadid.value;

element = document.evaluate(
    ".//td[@class='vbmenu_control']",
    document.body,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null);

var topToolBar = element.singleNodeValue.parentNode;

if (topToolBar !== null)
{
    var tableCell = document.createElement('td');
    tableCell.setAttribute('class', 'vbmenu_control');
    var link = document.createElement('a');
    link.setAttribute('href', 'misc.php?do=whoposted&t='+threadId);
    link.setAttribute('onclick', 'javascript: who(' + threadId +'); return false;');
    link.innerHTML = "Who Posted?";
    tableCell.appendChild(link);
    topToolBar.appendChild(tableCell);
}
