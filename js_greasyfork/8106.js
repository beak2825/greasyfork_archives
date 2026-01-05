// ==UserScript==
// @name         Telesal lite
// @description  Makes telesal page black and shows only who wants to answer. Good to the podium. Use dolphin and tempermonkey add-on to make it work on android devices.
// @namespace    http://theanykey.se
// @include      http://*.telesal.org/*
// @include      *.telesal.org/*
// @version      1.9
// @downloadURL https://update.greasyfork.org/scripts/8106/Telesal%20lite.user.js
// @updateURL https://update.greasyfork.org/scripts/8106/Telesal%20lite.meta.js
// ==/UserScript==

// Auto fill login info
// Add info here to make the script auto fill
// OBS: the script will add a space after the username and password text
// You must remove these spaces yourself with your keyboard
// The page must detect real inputs, or backspace in this case, to allow you to login
TelesalUserName="";
TelesalPassword="";

// Check for top menu and remove it
var p = document.getElementsByClassName('menu-bar pull-right');
var cstr = "container-fluid-header";
for (var i=p.length; --i>=0;) 
{
    var n = p[i];
    while(n.className.split(" ").indexOf(cstr)==-1) { // won't work in older browsers
        n = n.parentNode;
    }
    if (n)
    {
    	n.parentNode.removeChild(n);
    }
}

// Remove foot
var elmFoot = document.getElementById("FooterContainer");
if (elmFoot)
{
	elmFoot.parentNode.removeChild(elmFoot);
}

// Start timer for dostuff when page is loaded
InitTimerDone=false;
myTimer=window.setInterval(function () {removeStuffAfterLoad()}, 5000);
MustReloadScriptWhenLogin=false;

// Start comment timer
myCommentTimer=window.setInterval(function () {checkIfSomeoneWantToComment()}, 1000);

function GiveAllIds()
{
    var currentNode,
        ni = document.createNodeIterator(document.documentElement, NodeFilter.SHOW_ELEMENT);
    var mycounter=0;
    while(currentNode = ni.nextNode()) {
        mycounter+=1;
        if (currentNode.getAttribute("id")==null)
        {
            currentNode.setAttribute("id", currentNode.nodeName + mycounter);
        }
    }    
}

function removeMeetingNotStartedYetAlarm()
{
    // Check for first class with "alert alert-info ng-scope" that is the alert
    var AlertNotStartetYet = document.getElementsByClassName('alert alert-info ng-scope')[0];
    if (AlertNotStartetYet)
    {
        AlertNotStartetYet.parentNode.removeChild(AlertNotStartetYet);
    }
    else
    {
        //alert("alert window not found!");   
    }
}

function removeHistoryView()
{
    // Check for first tag with "bt-history" that is the history view
    var HistoryView = document.getElementsByTagName('bt-history')[0];
    if (HistoryView)
    {
        HistoryView.parentNode.removeChild(HistoryView);
    }
    else
    {
        //alert("history view not found!");   
    }
}

function removeH3s()
{
    // Check for first tag with "H3" that is the head texts
    var HistoryView = document.getElementsByTagName('H3')[0];
    if (HistoryView)
    {
        HistoryView.parentNode.removeChild(HistoryView);
    }
    else
    {
        //alert("H3 not found!");   
    }
}

function removeTextHeadForTableWhoIsListening()
{
    // Check for first tag with "thead" that is the head texts
    var TableHeadText = document.getElementsByTagName('thead')[0];
    if (TableHeadText)
    {
        TableHeadText.parentNode.removeChild(TableHeadText);
    }
    else
    {
        //alert("Listeners head text not found!");   
    }
}

function ChangeCenterTable()
{
    // Get ContentContainer and set new class
    var ContentContainerClass = document.getElementById('ContentContainer');
    if (ContentContainerClass)
    {
        ContentContainerClass.setAttribute("class","ng-scope");
    }
    else
    {
        //alert("Content Container not found!");   
    }
}

function ChangeErrorDialog()
{
    // Get ContentContainer and set new class
    var ErrorDialog = document.getElementById('error-dialog');
    if (ErrorDialog)
    {
        ErrorDialog.setAttribute("class","ng-scope");
    }
    else
    {
        //alert("Error dialog not found!");   
    }
}

function setLargeFontAndBlackColor()
{
    var HtmlBody = document.getElementsByTagName('body')[0];
    if (HtmlBody)
    {
        HtmlBody.setAttribute("style", "font-size:28px ! important; background-color:#000000 ! important; color:#ffffff ! important;");
    }
    else
    {
     	//alert("Cant find html body!");   
    }
}

function addGlobalStyle(css) 
{
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function HidePhoneNumbers()
{
    addGlobalStyle('.participantNumber { font-size: 0px ! important; width:1px ! important; display: none ! important;}');
}

function HideAlerts()
{
    addGlobalStyle('.alert-danger { font-size: 0px ! important; width:1px ! important; display: none ! important;}');
    addGlobalStyle('.alert-info { font-size: 0px ! important; width:1px ! important; display: none ! important;}');
}

function HideCallersHistoryInfo()
{
    addGlobalStyle('.participantHistory { font-size: 0px ! important; width:1px ! important; display: none ! important;}');
}

function HideCallerEditButton()
{
    addGlobalStyle('.participantOptions { font-size: 0px ! important; width:1px ! important; display: none ! important;}');
}

function MakeMoreSpaceForSomeoneWantsToAnswerPopup()
{
    addGlobalStyle('#ContentContainer { padding: 60px 0px ! important; background-color: #000000 ! important;}');
}

function HideLine()
{
    addGlobalStyle('.table>thead>tr>th, .table>tbody>tr>th, .table>tfoot>tr>th, .table>thead>tr>td, .table>tbody>tr>td, .table>tfoot>tr>td { border-top: 0px #000000 ! important; background-color: #000000 ! important;}');
    addGlobalStyle('.table { border-color: #000000 ! important; background-color: #000000 ! important;}');
    // Bottom shadow line
    addGlobalStyle('.container-fluid-content { box-shadow: none ! important; }');
}

function MakeTableBlackAndWhite()
{
    addGlobalStyle('.table-striped>tbody>tr:nth-child(odd)>td { background-color: #000000 ! important;}');  
}

function SetAllBody()
{
    addGlobalStyle('.body { background-color: #000000 ! important;}');  
}

function SetBiggerButtonAndMoreSpace()
{
    addGlobalStyle('table, th, td {border-collapse: separate ! important; white-space: nowrap; overflow: hidden; text-overflow:ellipsis;}'); // Space between callers setup
    addGlobalStyle('.table-condensed>thead>tr>th, .table-condensed>tbody>tr>th, .table-condensed>tfoot>tr>th, .table-condensed>thead>tr>td, .table-condensed>tbody>tr>td, .table-condensed>tfoot>tr>td { padding: 0em 0em 5em ! important;}'); // Space between callers
    addGlobalStyle('.label { padding: .2em .6em 2em; ! important;}'); // Size of comment button
}

function checkForLoginFormAndLogin()
{
    // Get Login form
    var LoginForm = document.getElementById('loginform');
    if (LoginForm)
    {
        // Check if got login info
        if (TelesalUserName!=="")
        {
            // Found login form fill it in
            if (document.getElementsByTagName('input')[0].value=="") { document.getElementsByTagName('input')[0].value=TelesalUserName + " "; }
            if (document.getElementsByTagName('input')[1].value=="") { document.getElementsByTagName('input')[1].value=TelesalPassword + " "; }
            document.getElementsByTagName('input')[2].checked=true;
            // Click login (Wont work because of security)
            //document.getElementsByTagName('button')[0].click();
            // Set to reload the script when the login is done
        }
        MustReloadScriptWhenLogin=true;
        return false;
    }
    else
    {
        // Allready loged in / or logged in now continue run script
        return true;
    }
}

function checkIfGotaRoom()
{
    var p = document.getElementsByClassName('alert alert-info ng-scope');
    for (var i=p.length; --i>=0;)
    {      
        var n = p[i];
        if (n)
        {
            // Check if got room
            if (n.innerHTML.indexOf("No room displayable for current user")!==-1)
            {
                return false;
            }
        }
    }
    return true;
}

function removeStuffAfterLoad()
{
    if (checkForLoginFormAndLogin())
    {
        // Only run if we are logged in
        // Make sure we got a room
        if (checkIfGotaRoom())
        {
            removeMeetingNotStartedYetAlarm();
            removeHistoryView();
            //removeH3s();
            removeTextHeadForTableWhoIsListening();
            ChangeCenterTable();
            ChangeErrorDialog();
            setLargeFontAndBlackColor();
            HidePhoneNumbers();
            HideAlerts();
            HideCallersHistoryInfo();
            HideCallerEditButton();
            MakeMoreSpaceForSomeoneWantsToAnswerPopup();
            HideLine();
            MakeTableBlackAndWhite();
            SetAllBody();
            SetBiggerButtonAndMoreSpace();
            //GiveAllIds();
            InitTimerDone=true; // allow comment timer to the his stuff
            // Set dont need to run anymore
            MustReloadScriptWhenLogin=false;
        }
    }
    
    // Run once but if we need to login run until we login
    if (MustReloadScriptWhenLogin==false)
    {
    	window.clearInterval(myTimer); // Run only once
    }
}

function setAllCallersInvisible()
{
    var p = document.getElementsByClassName('participantName');
    for (var i=p.length; --i>=0;)
    {
        // First node is td with name
        // Parent node is the whole row        
        var n = p[i].parentNode;
        if (n)
        {
            // Set invisible
            n.setAttribute("style","display: none");
        }
    }
}

function setAllWhoWantsToCommentVisible()
{
    var p = document.getElementsByTagName('a');
    var cstr = "participantName";
    for (var i=p.length; --i>=0;) 
    {
        var n = p[i];
        // Ignore unknown caller link
        // Code:
        /*
        When button "I want to answer" is visible
        <a ng-click="unmuteParticipant(participant)" class="label label-primary ng-isolate-scope" bt-comment-request-highlight="" participant="participant"><span translate="PARTICIPANTS.WANTS_TO_COMMENT" class="ng-scope">Jag vill gärna svara!</span></a>        
        When button "Microfone is enabled" is visible (This code was changed sometime ago)
        <a ng-click="muteParticipant(participant)" class="label label-warning"><span translate="PARTICIPANTS.INFO.UNMUTED" class="ng-scope">Svarsmikrofonen är öppen!</span></a>
        */
        //if (n.getAttribute("bt-comment-request-highlight") !== null) // OLD CHECK
        if (n.getAttribute("ng-click") == "unmuteParticipant(participant)" || n.getAttribute("ng-click") == "muteParticipant(participant)")
        {
            if (n)
            {
                while(n.className.split(" ").indexOf(cstr)==-1) { // won't work in older browsers
                    n = n.parentNode;
                }
                // First node is td with name
                // Parent node is the whole row
                n = n.parentNode;
                if (n)
                {
                    // Check if Unknown Robert
                    if (n.getAttribute("UnknownRobert") == null)
                    {
                        // Set visible
                        n.setAttribute("style","display: inline ! important;");
                    }
                }
            }
        }
    }
}

function hideNoListenersMessage()
{
    var p = document.getElementsByTagName('td');
    for (var i=p.length; --i>=0;) 
    {
        var n = p[i];
        // Check if no particiants
        if (n.getAttribute("translate") !== null)
        {
            // Check if no particiants
            if (n.getAttribute("translate").indexOf("NO_PARTICIPANTS"))
            {
                // Set invisible
                n.setAttribute("style","display: none");
            }
        }
    } 	   
}

function hideUnKnownListenerMessage()
{
 	// bt-comment-request-highlight
    var p = document.getElementsByTagName('a');
    for (var i=p.length; --i>=0;) 
    {
        var n = p[i];
        // Check if not a comment link
        //if (n.getAttribute("bt-comment-request-highlight") == null && n.getAttribute("translate") !== "PARTICIPANTS.INFO.UNMUTED") // OLD CHECK
        if (n.getAttribute("ng-click") !== "unmuteParticipant(participant)" && n.getAttribute("ng-click") !== "muteParticipant(participant)" && n.getAttribute("translate") !== "PARTICIPANTS.INFO.UNMUTED")
        {
            // Set invisible
            n.setAttribute("style","display: none");
            
            // Set special tag on unknown listener so we can ignore the comment button
            // Get up one step: td
            // Get up one step: tr
            p = n.parentNode;
            p = p.parentNode;
            if (p)
            {
            	p.setAttribute("UnknownRobert","true");
            }
        }
    }     
}

function checkIfSomeoneWantToComment()
{
    if (InitTimerDone)
    {
        hideUnKnownListenerMessage();
        hideNoListenersMessage();
        setAllCallersInvisible();
        setAllWhoWantsToCommentVisible();
    }
}

//alert("All script loaded");