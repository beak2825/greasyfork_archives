// ==UserScript==
// @name        Hide SDMB Forum Threads
// @namespace   SDMB_HideThreads
// @version     0.6.2
// @description Hides threads in SDMB vBulletin board (or other compatible boards).
// @author      TroutMan
// @include     http://boards.straightdope.com/sdmb/forumdisplay.php*
// @include     http://boards.straightdope.com/sdmb/search.php*
// @include     https://boards.straightdope.com/sdmb/forumdisplay.php*
// @include     https://boards.straightdope.com/sdmb/search.php*
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/6803/Hide%20SDMB%20Forum%20Threads.user.js
// @updateURL https://update.greasyfork.org/scripts/6803/Hide%20SDMB%20Forum%20Threads.meta.js
// ==/UserScript==
var divider = "|||";
var threadIdListKey  = "threadIds_" + location.hostname;
// migrate old storage key to domain-specific key
if (GM_getValue("HideThreadFile", "").length > 0)
{
    GM_setValue("threadIds_boards.straightdope.com", GM_getValue("HideThreadFile", ""));
    GM_setValue("HideThreadFile", "");
}

unsafeWindow._hideThread =
    exportFunction(function(threadId, threadTitle)
                   {
                       window.setTimeout(SetThreadToHide, 0, threadId, threadTitle);
                       // alert('Thread added to hidden list: ' + threadId);
                   }, unsafeWindow);
unsafeWindow._hideThread();

AddConfigLink();
FilterThreads();

function UpdateHideList(list)
{
    window.setTimeout(GM_setValue, 0, threadIdListKey, titleEncode(list));
    GM_setValue(threadIdListKey, titleEncode(list));
}

// add threadId to storage
function SetThreadToHide(threadId, threadTitle)
{
    var currentFile = "";
    if (threadTitle.length > 40)
    {
        threadTitle = threadTitle.substr(0, 37) + '...';
    }
    currentFile = titleDecode(GM_getValue(threadIdListKey, "-----" + String.fromCharCode(10)));
    // append to list and save
    currentFile += divider + threadId + divider + threadTitle + String.fromCharCode(10);
    
    UpdateHideList(currentFile);
    // hide the thread
    var divElement = document.getElementById("td_threadtitle_" + threadId);
    HideThread(divElement.parentNode);
}

function HideThread(node)
{
    if (node.parentNode !== null)
    {
        node.parentNode.removeChild(node);
    }    
}

function AddHideThreadLink (thisElement, threadId, threadTitle)
{
    var link = document.createElement('a');
    link.setAttribute('href', 'javascript:_hideThread("' + threadId + '","' + titleEncode(threadTitle) + '")');
    link.setAttribute('style', 'float:right;font-size:x-small;');
    link.innerHTML = "Hide";
    thisElement.childNodes[1].appendChild(link);
} 

function FilterThreads()
{
    var hideFile = titleDecode(GM_getValue(threadIdListKey, ""));
    var hideGames = GM_getValue("HideThreadGameSetting", false);
    
    // get all <td> elements matching the thread pattern
    allElements = document.evaluate(
        './/td[contains(@id, "td_threadtitle_")]',
        document.body,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);
    
    for (var i = 0; i < allElements.snapshotLength; i++) {
        var thisElement = allElements.snapshotItem(i);
        var threadId = thisElement.getAttribute('id');
        if (threadId !== null)
        {
            threadId = threadId.substring(15);
            
            // get thread title to check for [GAME] threads and for a user-friendly display of hidden threads
            var titleNode = document.getElementById('thread_title_' + threadId);
            var threadTitle = titleNode.innerHTML;
            
            // hide game threads if [GAME] setting is checked
            if (hideGames && threadTitle.substr(0, 6).toUpperCase() == '[GAME]')
            {
                HideThread(thisElement.parentNode);
            }
            // hide threads matching IDs in the master hide file
            else if (hideFile.indexOf(divider + threadId + divider) >= 0)
            {
                HideThread(thisElement.parentNode);
            }
            else
            {
                AddHideThreadLink(thisElement, threadId, threadTitle);
            }
        }
    }
}

// functions to encode and decode titles - handles quotes and &amp
function titleEncode(str)
{
    if (typeof str == "string")
    {
        return encodeURI(str.replace(/&amp;/g, '&').replace(/"/g, '&quot;'));
    }
    else
    {
        return "";
    }
}
function titleDecode(str)
{
    return decodeURI(str).replace(/&quot;/g, '"');
}

function AddConfigLink()
{
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
        link.setAttribute('href', 'javascript:_OpenConfigWindow();');
        link.innerHTML = "Hidden Threads";
        tableCell.appendChild(link);
        topToolBar.appendChild(tableCell);
    }
}

unsafeWindow._OpenConfigWindow =
    exportFunction(function()
                   {
                       // load current settings
                       var hideGames = GM_getValue("HideThreadGameSetting", false);
                       $("#hideAllGame").prop("checked", hideGames);
                       
                       var list = titleDecode(GM_getValue(threadIdListKey, "-----"));
                       $("#hiddenThreadList").val(list);
                       
                       $("#hideThreadConfigPopup").show();
                   }, unsafeWindow);
unsafeWindow._OpenConfigWindow();

// Configuration popup
$("body").append ( '                                                  	        \
<div id="hideThreadConfigPopup" style="display: none;">             	        \
<p style="font-size:20px;font-weight:bold">SDMB Hidden Thread Configuration</p>	\
<form>                                                                          \
<input type="checkbox" id="hideAllGame">Hide all [GAME] threads                 \
<p style="font-weight:bold">Hidden threads - edit at your own risk<br>          \
<textarea id="hiddenThreadList" rows=15 cols=55></textarea></p>                 \
<p>&nbsp;</p>                                                                   \
<button id="hideThreadSave" type="button">Save Changes</button>                 \
<button id="hideThreadCancel" type="button">Cancel</button>                     \
</form>                                                                         \
</div>                                                                          \
' );

// save configuration edits
$("#hideThreadSave").click ( function () {
    var str = $("#hiddenThreadList").val();
    
    // save [GAME] setting
    var hideGames = $("#hideAllGame").prop("checked");
    window.setTimeout(GM_setValue, 0, "HideThreadGameSetting", hideGames);
    
    // save thread list
    var list = $("#hiddenThreadList").val();
    window.setTimeout(GM_setValue, 0, threadIdListKey, titleEncode(list));
    
    $("#hideThreadConfigPopup").hide();
} );

// close config popup without saving
$("#hideThreadCancel").click ( function () {
    $("#hideThreadConfigPopup").hide();
} );

// CSS styles for the config window
GM_addStyle ( "                             \
#hideThreadConfigPopup {                    \
position:               fixed;              \
top:                    10%;                \
left:                   50%;                \
padding:                2em;                \
background:             Gainsboro;          \
border:                 1px double black;   \
border-radius:          1ex;                \
z-index:                777;                \
}                                           \
#hideThreadConfigPopup button{              \
cursor:                 pointer;            \
-webkit-border-radius:  6;                  \
-moz-border-radius:     6;                  \
border-radius:          6px;                \
font-family:            Arial;              \
color:                  White;              \
font-size:              14px;               \
background:             DarkBlue;           \
padding:                6px 12px 6px 12px;  \
}                                           \
" );