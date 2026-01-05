// ==UserScript==
// @name        Autosmash
// @namespace   kingdomofloathing.com
// @author      benjy___mouse
// @description Choose items to pulverize. Pulverize all of them with one click.
// @include     http://*kingdomofloathing.com/craft.php*
// @include     http://*kingdomofloathing.com/account.php*
// @include     http://127.0.0.1:*/craft.php*
// @include     http://127.0.0.1:*/account.php*
// @version     01/2015
// @grant       GM_log
// @grant       GM_getValue
// @grant     	GM_setValue
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/7359/Autosmash.user.js
// @updateURL https://update.greasyfork.org/scripts/7359/Autosmash.meta.js
// ==/UserScript==

// GREASEMONKEY VALUES:
//   smashables    -- user-editable list of items marked for autosmashing
//   activeSession -- is there currently an autosmash session in progress?
//   sessionQueue  -- temporary script-editable copy of "smashables"

// How to use this script: Go to your account menu, click the "Autosmash" tab,
// and type the names of the items you want to autosmash. Click "Save". Then
// go to your crafting menu, click [smith stuff] if necessary. You should see
// a gray button with white text that says "Autosmash!". Click it!

// This script will smash ALL the items that you mark for autosmashing. There
// is currently no option to smash only one, smash all but one, etc. There is
// currently no support for different preferences for different characters. If
// you have other scripts modifying your [smith stuff] page, there is a good
// chance something will go horribly wrong. Happy smashing!

/********************************** RUNTIME **********************************/

// figure out what KoL page we're on
switch(document.location.pathname)
{
    case "/account.php":
        accountAction();
    break;

    case "/craft.php":
        if (document.querySelector("input").value == "smith")
            craftAction(false);
    break;

    default:  // do nothing if on irrelevant page
}

/************** ACCOUNT MENU FUNCTIONS: AUTOSMASH CONFIGURATION **************/

// make autosmash tab in account menu. major credit to the UpUp.us Auto Choice
// script, from which i copied most of this code.
function accountAction()
{
    var optionsList  = document.querySelector("ul");
    var autosmashTab = document.createElement("li");
    autosmashTab.id = "autosmash";
    var tabLabel = document.createElement("a");
    tabLabel.href = "#";
    var img = tabLabel.appendChild(document.createElement("img"));
    img.src = "http://images.kingdomofloathing.com/itemimages/hammer.gif"
    tabLabel.appendChild(document.createTextNode("Autosmash"));
    autosmashTab.appendChild(tabLabel);
    optionsList.appendChild(autosmashTab);

    tabLabel.addEventListener('click', function (e)
    {
        e.stopPropagation();
        document.querySelector(".active").className = "";
        document.querySelector("#autosmash").className = "active";
        document.querySelector("#guts").innerHTML = "<div class='scaffold'></div>";
        document.querySelector("#guts").appendChild(showList());
    }, false);
}

// show editable list of items for autosmashing
function showList()
{
    var guts = document.body.appendChild(document.createElement('div'));

    var helpMessage = document.createTextNode("Type the items you want to autosmash "
        + "into the text box. One item per line. Use the complete name, just as it "
        + "appears in the game, including capital letters, spaces, and punctuation. "
        + "It doesn't autosave, so make sure you click 'Save' when you're done.");
    guts.appendChild(helpMessage);
    guts.appendChild(document.createElement("p"));

    // textarea where you write the items you want to smash
    var autosmashList = document.createElement("textarea");
    autosmashList.style.width = "90%";
    autosmashList.rows = 16;
    autosmashList.value = GM_getValue("smashables", "");
    guts.appendChild(autosmashList);
    guts.appendChild(document.createElement("p"));

    // "Save" button
    var submitButton = document.createElement("button");
    submitButton.style.border = "2px black solid";
    submitButton.style.padding = "3px";
    submitButton.style.fontFamily = "arial";
    submitButton.style.fontSize = "10pt";
    submitButton.style.fontWeight = "bold";
    submitButton.style.color = "black";
    submitButton.style.background = "white";
    submitButton.appendChild(document.createTextNode("Save"));
    guts.appendChild(submitButton);

    submitButton.addEventListener('click', function (e)
    {
        e.stopPropagation();
        e.preventDefault();
        GM_setValue("smashables", autosmashList.value);
        var resultMessage = document.createTextNode(" Autosmash preferences saved!");
        guts.appendChild(resultMessage);
    }, false);

    return guts;
}

/**************** CRAFTING MENU FUNCTIONS: AUTOSMASH EXECUTION ****************/

// check if we're curently in the middle of an autosmash session
function craftAction(reloading)
{
    if (GM_getValue("activeSession", false))
        execute();
    // check if the smithing page has been reloaded; this prevents the creation
    // of duplicate autosmash buttons
    else if (!reloading)
        showButton();
}

// make the autosmash button and put it in the middle of the page
function showButton()
{
    var smashMenu = document.getElementsByTagName("p")[4];
    var autosmashButton = document.createElement("button");
    autosmashButton.style.border = "2px black solid";
    autosmashButton.style.padding = "3px";
    autosmashButton.style.fontFamily = "arial";
    autosmashButton.style.fontSize = "10pt";
    autosmashButton.style.fontWeight = "bold";
    autosmashButton.style.color = "white";
    autosmashButton.style.background = "#555555";
    autosmashButton.appendChild(document.createTextNode("Autosmash!"));
    smashMenu.appendChild(autosmashButton);

    // when the user clicks the autosmash button, create a temporary copy of the
    // list of autosmashable items (which the user typed into the account menu)
    // and begin a new autosmash session
    autosmashButton.addEventListener('click', function (e)
    {
        e.stopPropagation();
        e.preventDefault();
        GM_setValue("activeSession", true);
        GM_setValue("sessionQueue", GM_getValue("smashables", ""));
        execute();
    }, false);
}

// loop through the dropdown of pulverizable items, searching for a match for each
// entry in the list of autosmashable items. binary search would be faster here but
// i can't be bothered to implement it. this function runs once for each item in
// the list of autosmashables.
function execute()
{
    // dequeue the first item from the list of autosmashables
    var smashQueue = GM_getValue("sessionQueue", "");
    var m = smashQueue.indexOf("\n");
    if (m == -1)  // last autosmashable item reached, end autosmash session
    {
        var smashTarget = smashQueue;
        GM_setValue("activeSession", false);
        alert("Autosmash complete!");
    }
    else
    {
        var smashTarget = smashQueue.slice(0, m);
        GM_setValue("sessionQueue", smashQueue.slice(m+1));
    }

    // find the quantity field and the "Pulverize!" button on the page
    var pulverizeQtyFld = document.getElementsByName("qty")[1];
    var pulverizeButton = document.getElementsByClassName("button")[1];

    // parse dropdown of pulverizable items in inventory
    var itemArray = document.getElementsByName("smashitem")[0];  // returns a <select>
    var n = itemArray.options.length;
    var itemString = [];
    var itemName = "";
    var itemQty = 0;

    // don't start at i = 0 because the first option is "-select an item-"
    for (i = 1; i < n; i++)
    {
        // separate out item name and item quantity
        itemString = itemArray.options[i].text.split("(");
        itemName = itemString[0].slice(0, -1); // remove trailing space
        itemQty = itemString[1].slice(0, -1);  // remove trailing close parenthesis

        // smashing time!
        if (itemName == smashTarget)
        {
            var successfulSmash = true;
            itemArray.options[i].selected = true;
            pulverizeQtyFld.value = itemQty;
            pulverizeButton.click();
        }
    }
    // continue script if no matches found
    if (!successfulSmash)
        craftAction(true);
}