// ==UserScript==
// @name           Storm8 Account Changer
// @namespace      Bennett
// @description    Change between Storm8 Accounts with tons of features
// @copyright      2013-2014
// @version        3.10
// @include        http://*.storm8.com/*
// @include        http://*.s8dev.org/*
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/6452/Storm8%20Account%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/6452/Storm8%20Account%20Changer.meta.js
// ==/UserScript==

//Global Array Function
var GM_SuperValue = new function () {
    var JSON_MarkerStr  = 'json_val: ';
    var FunctionMarker  = 'function_code: ';
    function ReportError (msg) {
        if (console && console.error)
            console.log (msg);
        else
            throw new Error (msg);
    }
    if (typeof GM_setValue != "function")
        ReportError ('This library requires Greasemonkey! GM_setValue is missing.');
    if (typeof GM_getValue != "function")
        ReportError ('This library requires Greasemonkey! GM_getValue is missing.');
    this.set = function (varName, varValue) {
        if ( ! varName) {
            ReportError ('Illegal varName sent to GM_SuperValue.set().');
            return;
        }
        if (/[^\w _-]/.test (varName) ) {
            ReportError ('Suspect, probably illegal, varName sent to GM_SuperValue.set().');
        }
        
        switch (typeof varValue) {
            case 'undefined':
                ReportError ('Illegal varValue sent to GM_SuperValue.set().');
                break;
            case 'boolean':
            case 'string':
                GM_setValue (varName, varValue);
                break;
            case 'number':
                if (varValue === parseInt (varValue)  &&  Math.abs (varValue) < 2147483647)
                {
                    GM_setValue (varName, varValue);
                    break;
                }
            case 'object':
                var safeStr = JSON_MarkerStr + JSON.stringify (varValue);
                GM_setValue (varName, safeStr);
                break;
            case 'function':
                var safeStr = FunctionMarker + varValue.toString ();
                GM_setValue (varName, safeStr);
                break;
            default:
                ReportError ('Unknown type in GM_SuperValue.set()!');
                break;
        }
    }
    this.get = function (varName, defaultValue) {
        if ( ! varName) {
            ReportError('Illegal varName sent to GM_SuperValue.get().');
            return;
        }
        if (/[^\w _-]/.test (varName) ) {
            ReportError('Suspect, probably illegal, varName sent to GM_SuperValue.get().');
        }
        var varValue = GM_getValue (varName);
        if (!varValue) return defaultValue;
        if (typeof varValue == "string") {
            var regxp       = new RegExp ('^' + JSON_MarkerStr + '(.+)$');
            var m           = varValue.match (regxp);
            if (m  &&  m.length > 1) {
                varValue    = JSON.parse ( m[1] );
                return varValue;
            }
            var regxp       = new RegExp ('^' + FunctionMarker + '((?:.|\n|\r)+)$');
            var m           = varValue.match (regxp);
            if (m  &&  m.length > 1) {
                varValue    = eval ('(' + m[1] + ')');
                return varValue;
            }
        }
        return varValue;
    }
};

//Global Variables
var ShowOrHide = GM_getValue("ShowOrHide", "block");
var SelectedMenuTab = GM_getValue("SelectedMenuTab", 1);
var CurrentVersion = "3.10";
var AccountLink = GM_getValue("AccountLink", false);
var AccountArray = GM_SuperValue.get("AccountArray", []);
var LinkArray = GM_SuperValue.get("LinkArray", []);
var UdidArray = GM_SuperValue.get("UdidArray", []);
var AccountSelected = GM_getValue("AccountSelected", false);
var DeviceSelected = GM_getValue("DeviceSelected", "Apple");
var game = String(location).split('/')[2].split('.')[0];
var HomeLink = "http://" + game + ".storm8.com/home.php";
var ReattackPUIDArray = GM_SuperValue.get("ReattackPUIDArray", []);
var ReattackPUIDSelected = GM_getValue("ReattackPUIDSelected", null);
var PathAttack = GM_getValue("PathAttack", false);
var page = String(location).split('/')[3].split('.php')[0];
var ReattackMethod = GM_getValue("ReattackMethod", "Alliance");
var SwitchAccountsAttack = GM_getValue("SwitchAccountsAttack", false);
var WinsOnlyAttack = GM_getValue("WinsOnlyAttack", false);
var AutoAttack = GM_getValue("AutoAttack", false);
var HospitalLink = "http://" + game + ".storm8.com/hospital.php";
var CurrentAmmo = parseInt(document.getElementById('staminaCurrent').innerHTML);
var CurrentHealth = parseInt(document.getElementById('healthCurrent').innerHTML);
var HitlistLink = "http://" + game + ".storm8.com/hitlist.php";
var BankLink = "http://" + game + ".storm8.com/bank.php";
var MissionType = GM_getValue("MissionType", "best");
var AutoMission = GM_getValue("AutoMission", false);
var MissionCategory = GM_getValue("MissionCategory", 1);
var MissionNumber = GM_getValue("MissionNumber", 1);
var MissionQuestion = GM_getValue("mission" + game, 0);
var HitlistKill = GM_getValue("HitlistKill", false);
var HitlistKillLevel = GM_getValue("HitlistKillLevel", "100-150");
var HitlistKillAmmo = GM_getValue("HitlistKillAmmo", 1);
var country = GM_getValue("country", 1);
var sanction = GM_getValue("sanction", false);
var SanctionNumber = GM_getValue("SanctionNumber", 25);
var SanctionAmount = GM_getValue("SanctionAmount", 10000);
var HitlistBountyAmountKill = GM_getValue("HitlistBountyAmountKill", false);
var HitlistBountyAmountKillAmount = GM_getValue("HitlistBountyAmountKillAmount", 10000);
var WinsOnlyKill = GM_getValue("WinsOnlyKill", false);
var SwitchAccountsKill = GM_getValue("SwitchAccountsKill", false);
var RandomSanctionNumber = GM_getValue("RandomSanctionNumber", 0);
var PUIDArray = GM_SuperValue.get("PUIDArray", []);
var PUIDSelected = GM_getValue("PUIDSelected", null);
var RandomSanctionMethod = GM_getValue("RandomSanctionMethod", "fight");
var search = GM_getValue("search", false);
var SearchPUID = GM_getValue("SearchPUID", "");
var CleanWall = GM_getValue("CleanWall", false);
var PUIDKill = GM_getValue("PUIDKill", false);
var UnhideNames = GM_getValue("UnhideNames", true);
var RandomSanction = GM_getValue("RandomSanction", false);
var HomeLink = "http://" + game + ".storm8.com/home.php";
var FightLink = "http://" + game + ".storm8.com/fight.php";
var AutoHeal = GM_getValue("AutoHeal", false);
var AutoHealHealthLimit = GM_getValue("AutoHealHealthLimit", 60);
var AutoHealTimer = GM_getValue("AutoHealTimer", "5-10");
var AutoHealDelay = GM_getValue("AutoHealDelay", RandomFromInterval(5000, 10000));
var RemoveAds = GM_getValue("RemoveAds", true);
var AttackReload = GM_getValue("AttackReload", false);
var WallClean = GM_getValue("WallClean", false);
var SpamOnly = GM_getValue("SpamOnly", true);
var AutoBank = GM_getValue("AutoBank", false);
var PathAttackDelay = GM_getValue("PathAttackDelay", true);
var ToggleHidden = GM_getValue("ToggleHidden", false);
var GlitchAuth = GM_getValue("GlitchAuth", "");
var GlitchTimes = GM_getValue("GlitchTimes", 1);
var UpdateDate = GM_getValue("UpdateDate", "69/69/6969");

if (String(HitlistKillLevel).indexOf("-") == -1 || String(HitlistKillLevel).indexOf(",") != -1) {
    HitlistKillLevel = "1-300";
    GM_setValue("HitlistKillLevel", HitlistKillLevel);
}

//Menu Creation
var tab1info = ""+
    "<input type='button' value='Open Acc.' id='AccountOpen' style='background: lightgreen;'>"+
    "<input type='button' value='Clear Acc.' id='AccountClear' style='background: lightgreen;'>"+
    "<input type='button' value='Clear All Acc.s' id='AccountClearAll' style='background: lightgreen;'>"+
    "<br>Acc: <select style='border: 1px solid green; width: 20em; background: black; text-align: left; color: #00ff00;' id='AccountSelectBox'></select>"+
    "<br><select style='border: 1px solid green; background: black; text-align: left; color: #00ff00;' id='DeviceSelectBox'>"+
    "<option value='apple'>Apple</option><option value='android'>Droid</option></select> "+
    "UDID: <input type='text' style='border: 1px solid green; width: 10em; color: #00ff00; background: black; text-align: center;' id='AccountTextBox'> "+
    "<input type='button' value='ADD' id='AccountAdd' style='background: lightgreen;'>"+
    "<br><input type='button' id='BackupUDID' value='Backup UDID' style='background: lightgreen;'>";
var tab2info = ""+
    "<input type='button' id='ReattackAddButton' value='Add to Path' style='background: lightgreen;'>"+
    "<input type='button' id='ReattackClearButton' value='Remove from Path' style='background: lightgreen;'>"+
    "<input type='button' id='ReattackClearAllButton' value='Clear Path' style='background: lightgreen;'><br>"+
    "Path: <select id='ReattackPUIDSelectBox' style='border: 1px solid green; width: 20em; color: #00ff00; background: black;'></select><br>"+ 
    "Start from: <select id='ReattackMethodSelectBox' style='background: black; border: 1px solid green; width: 6em; color: #00ff00;'>"+
    "<option value='Alliance'>Allies</option><option value='Pending'>Invite</option></select> "+
    "<input type='checkbox' id='PathAttackDelayCheckbox'> Delay<br>"+
    "<input type='checkbox' id='PathAttackCheckbox'> Path Attack "+
    "<input type='checkbox' id='ReattackSwitchAccountCheckbox'> Switch Acc.s"+
    "<br><br>"+
    "<input type='checkbox' id='AutoAttackCheckbox'> Auto Attack "+
    "<input type='checkbox' id='WinsOnlyAttackCheckbox'> Wins Only "+
    "<input type='checkbox' id='AttackReloadCheckbox'> Reload";
var tab3info = ""+
    "<input type='button' value='Get' id='PUIDGetButton' style='background: lightgreen;'><input type='button' value='Clr.' id='PUIDClearButton' style='background: lightgreen;'><input type='button' value='Clr. All' id='PUIDClearAllButton' style='background: lightgreen;'>"+
    "<input type='text' id='PUIDSetTextbox' style='border: 1px solid green; width: 7em; color: #00ff00; background: black; text-align: center;'><input type='button' value='Set' id='PUIDSetButton' style='background: lightgreen;'> <br>"+
    "PUID: <select style='border: 1px solid green; width: 20em; background: black; text-align: left; color: #00ff00;' id='PUIDSelectBox'></select><br>"+
    "<input type='checkbox' id='PUIDKillCheckbox'> PUID Kill "+
    "<input type='checkbox' id='HitlistBountyAmountKillCheckbox'> Kill at Bounty <input type='text' style='border: 1px solid green; width: 5em; color: #00ff00; background: black; text-align: center;' id='HitlistBountyAmountKillAmount' value=\"" + HitlistBountyAmountKillAmount + "\"> <br>"+
    "<input type='checkbox' id='HitlistKillCheckbox'> Kill range "+
    "<input type='text' style='border: 1px solid green; width: 4em; color: #00ff00; background: black; text-align: center;' id='HitlistKillLevelTextbox' value=\"" + HitlistKillLevel + "\"> "+
    "<span id='NoKillCountry'> NoKill <select style='border: 1px solid green; background: black; color: #00ff00; text-align: left;' id='CountrySelectBox'>"+
    "<option value='1'>Germany</option><option value='2'>UK</option><option value='3'>USA</option><option value='4'>China</option><option value='5'>Russia</option>"+
    "</select></span><br>"+
    "<input type='checkbox' id='WinsOnlyKillCheckbox'> Wins Only (for level killing only)<br>"+
    "Min. Ammo <input type='text' style='border: 1px solid green; width: 2em; color: #00ff00; background: black; text-align: center;' id='HitlistKillAmmoTextbox' value=\"" + HitlistKillAmmo + "\"> "+
    "<input type='checkbox' id='SwitchAccountsKillCheckbox'> Switch Kill Acc.s<br><br>"+
    "<input type='checkbox' id='SanctionCheckbox'> Hitlist "+
    "<input type='text' style='border: 1px solid green; width: 2em; color: #00ff00; background: black; text-align: center;' id='SanctionNumberTextbox' value=\"" + SanctionNumber + "\"> times for <input type='text' style='border: 1px solid green; width: 5em; color: #00ff00; background: black; text-align: center;' id='SanctionAmountTextbox' value=\"" + SanctionAmount + "\"> <br>"+
    "<input type='checkbox' id='RandomSanctionCheckbox'> Ran. H.L. "+
    "<input type='text' style='border: 1px solid green; width: 2em; color: #00ff00; background: black; text-align: center;' id='RandomSanctionNumberTextbox' value=\"" + RandomSanctionNumber + "\"> times from "+
    "<select style='border: 1px solid green; background: black; color: #00ff00; text-align: left;' id='RandomSanctionMethodSelectBox'>"+
    "<option value='fight'>Fight</option>"+
    "<option value='list'>List</option>"+
    "</select><br>";
var tab4info = ""+
    "<input type='checkbox' id='MissionCheckbox'>Missions "+
    "<select style='border: 1px solid green; background: black; color: #00ff00; text-align: left;' id='MissionTypeSelectBox'> "+
    "<option value='best'>Best</option> "+
    "<option value='specific'>Specific</option></select> "+
    "<br>Tab #: <input type='text' style='border: 1px solid green; width: 2em; color: #00ff00; background: black; text-align: center;' id='MissionCategoryTextbox' value=\"" + MissionCategory + "\"> "+
    "Mission #: <input type='text' style='border: 1px solid green; width: 2em; color: #00ff00; background: black; text-align: center;' id='MissionNumberTextbox' value=\"" + MissionNumber + "\">" +
    "<br>Auth: <input type='text' style='border: 1px solid green; width: 6em; color: #00ff00; background: black; text-align: center;' id='GlitchAuthTextbox' value=\"" + GlitchAuth + "\"> " +
    "<input type='button' id='GlitchMissionButton' value='Glitch' style='background: lightgreen;'>"+
    "<br><input type='checkbox' id='Glitch2'>2x <input type='checkbox' id='Glitch3'>3x";
var tab5info = ""+
    "<input type='checkbox' id='UnhideNamesCheckbox'> Unhide Names "+
    "<input type='checkbox' id='RemoveAdsCheckbox'> Remove Ads<br>"+
    "<input type='checkbox' id='AutoHealCheckbox'> Heal at <input type='text' style='border: 1px solid green; width: 2em; color: #00ff00; background: black; text-align: center;' id='AutoHealHealthLimitTexbox' value=\"" + AutoHealHealthLimit + "\"> every <input type='text' style='border: 1px solid green; width: 4em; color: #00ff00; background: black; text-align: center;' id='AutoHealTimerTextbox' value=\"" + AutoHealTimer + "\"> sec.s<br>"+
    "<input type='checkbox' id='SearchCheckbox'> Search PUID <input type='text' id='SearchPUIDTextbox' style='border: 1px solid green; width: 7em; color: #00ff00; background: black; text-align: center;' value=\"" + SearchPUID + "\"><br>"+
    "<input type='checkbox' id='WallCleanCheckbox'> Clean Wall "+
    "<input type='checkbox' id='SpamOnlyCheckbox'> Spam Only <br>"+
    "<input type='checkbox' id='AutoBankCheckbox'> Auto Bank <br>"+
    "<input type='button' value='Income ROI' id='ROIButton' style='background: lightgreen;'>";
var menu = document.createElement("div");
menu.setAttribute("id", "S8AccountMenu");
menu.innerHTML = "" +
    "<input type='button' id='hide' value='Hide' style='border: 1px solid red; background: blue;'> "+
    "<center style='line-height: 0px;'><img alt='Submit a Bug' id='BugButton' style='vertical-align: middle; height: 24px; width: 55px; margin-top: -24px;' src='data:image/jpeg;base64,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' /></center>" +
"<input type='button' id='FAQ' value='Guide' style='border: 1px solid blue; background: red; float: right; margin-top: -24px;'>"+
    "<p style='line-height: .25em;'>&nbsp;</p>"+
    "<center><input type='button' class='SelectTab' id='tab1' value='Acc.s' style='border: 1px solid darkgrey; background: grey;'><div style='width: 2%; display:inline-block'></div>"+
    "<input type='button' class='SelectTab' id='tab2' value='Att.' style='border: 1px solid darkgrey; background: grey;'><div style='width: 2%; display:inline-block'></div>"+
    "<input type='button' class='SelectTab' id='tab3' value='H.L.' style='border: 1px solid darkgrey; background: grey;'><div style='width: 2%; display:inline-block'></div>"+
    "<input type='button' class='SelectTab' id='tab4' value='Miss.' style='border: 1px solid darkgrey; background: grey;'><div style='width: 2%; display:inline-block'></div>"+
    "<input type='button' class='SelectTab' id='tab5' value='Ran.' style='border: 1px solid darkgrey; background: grey;'></center>"+
    "<p style='line-height: .25em;'>&nbsp;</p>";
menu.style.padding = "10px";
menu.style.display = ShowOrHide;
menu.style.position = "fixed";
menu.style.top = "20%";
menu.style.background = "black";
menu.style.zIndex = "1001";
menu.style.maxWidth = "320px";
menu.style.width = "95%";
document.body.insertBefore(menu, document.body.firstChild);
if (SelectedMenuTab == 1) {
    var tab = document.getElementById("tab1");
    tab.style.border = "1px solid darkgreen";
    tab.style.background = "green";
    menu.innerHTML += "<span id='tab1info'>" + tab1info + "</span>";
    menu.innerHTML += "<span id='tab2info' style='display: none;'>" + tab2info + "</span>";
    menu.innerHTML += "<span id='tab3info' style='display: none;'>" + tab3info + "</span>";
    menu.innerHTML += "<span id='tab4info' style='display: none;'>" + tab4info + "</span>";
    menu.innerHTML += "<span id='tab5info' style='display: none;'>" + tab5info + "</span>";
}
if (SelectedMenuTab == 2) {
    var tab = document.getElementById("tab2");
    tab.style.border = "1px solid darkgreen";
    tab.style.background = "green";
    menu.innerHTML += "<span id='tab1info' style='display: none;'>" + tab1info + "</span>";
    menu.innerHTML += "<span id='tab2info'>" + tab2info + "</span>";
    menu.innerHTML += "<span id='tab3info' style='display: none;'>" + tab3info + "</span>";
    menu.innerHTML += "<span id='tab4info' style='display: none;'>" + tab4info + "</span>";
    menu.innerHTML += "<span id='tab5info' style='display: none;'>" + tab5info + "</span>";
}
if (SelectedMenuTab == 3) {
    var tab = document.getElementById("tab3");
    tab.style.border = "1px solid darkgreen";
    tab.style.background = "green";
    menu.innerHTML += "<span id='tab1info' style='display: none;'>" + tab1info + "</span>";
    menu.innerHTML += "<span id='tab2info' style='display: none;'>" + tab2info + "</span>";
    menu.innerHTML += "<span id='tab3info'>" + tab3info + "</span>";
    menu.innerHTML += "<span id='tab4info' style='display: none;'>" + tab4info + "</span>";
    menu.innerHTML += "<span id='tab5info' style='display: none;'>" + tab5info + "</span>";
}
if (SelectedMenuTab == 4) {
    var tab = document.getElementById("tab4");
    tab.style.border = "1px solid darkgreen";
    tab.style.background = "green";
    menu.innerHTML += "<span id='tab1info' style='display: none;'>" + tab1info + "</span>";
    menu.innerHTML += "<span id='tab2info' style='display: none;'>" + tab2info + "</span>";
    menu.innerHTML += "<span id='tab3info' style='display: none;'>" + tab3info + "</span>";
    menu.innerHTML += "<span id='tab4info'>" + tab4info + "</span>";
    menu.innerHTML += "<span id='tab5info' style='display: none;'>" + tab5info + "</span>";
}
if (SelectedMenuTab == 5) {
    var tab = document.getElementById("tab5");
    tab.style.border = "1px solid darkgreen";
    tab.style.background = "green";
    menu.innerHTML += "<span id='tab1info' style='display: none;'>" + tab1info + "</span>";
    menu.innerHTML += "<span id='tab2info' style='display: none;'>" + tab2info + "</span>";
    menu.innerHTML += "<span id='tab3info' style='display: none;'>" + tab3info + "</span>";
    menu.innerHTML += "<span id='tab4info' style='display: none;'>" + tab4info + "</span>";
    menu.innerHTML += "<span id='tab5info'>" + tab5info + "</span>";
}

//Toggle Button Creation
var MenuToggle = document.createElement("input");
MenuToggle.setAttribute("id", "MenuToggle");
MenuToggle.setAttribute("type", "button");
MenuToggle.setAttribute("value", "-->");
if (ShowOrHide == "block") {
    MenuToggle.style.display = "none";
} else {
    MenuToggle.style.display = "block";
}
MenuToggle.style.padding = "10px";
MenuToggle.style.position = "fixed";
MenuToggle.style.top = "35%";
MenuToggle.style.background = "green";
MenuToggle.style.border = "1px solid yellow";
MenuToggle.style.zIndex = "1001";
MenuToggle.style["-webkit-user-select"] = "none";
document.body.insertBefore(MenuToggle, document.body.firstChild);

//Bank when out of cash to heal
if (page == "hospital") {
    var body = document.getElementsByTagName('body')[0].innerHTML;
    if (body.indexOf('to pay for that.') != -1) {
        GM_setValue('NeedToBank', true);
        document.location = BankLink;
        return;
    }
}
if (GM_getValue('NeedToBank', false)) {
    var cash = GetExactCash();
    if (cash > 0) postwith("bank.php", ['depositAmount', cash, 'action', 'Deposit']);
    else alert('You are broke!');
    GM_setValue('NeedToBank', false);
    GM_setValue('JustBanked', true);
    return;
}
if (GM_getValue('JustBanked', false)) {
    GM_setValue('JustBanked', false);
    setTimeout(function() { 
        document.location = HospitalLink;
    }, 500);
    return;
}

//Menu Toggle
if (ToggleHidden) {
    MenuToggle.style.display = "none";
    document.getElementById("inner-topbar").getElementsByTagName("a")[0].href = "#";
    document.getElementById("inner-topbar").getElementsByTagName("a")[0].addEventListener("click", function() {
        MenuToggle.style.display = "block";
        GM_setValue("ToggleHidden", false);
    });
}
var longpress;
var HideButton = document.getElementById("hide");
HideButton.addEventListener("click", ToggleVisibility);
MenuToggle.addEventListener("click", ToggleVisibility);
function ToggleVisibility() {
    if(longpress) {
        return false;
    }
    var MenuVisibility = window.getComputedStyle(menu, null).getPropertyValue("display");
    if (MenuVisibility == "block") {
        menu.style.display = "none";
        MenuToggle.style.display = "block";
        GM_setValue("ShowOrHide", "none");
    }
    if (MenuVisibility == "none") {
        menu.style.display = "block";
        MenuToggle.style.display = "none";
        GM_setValue("ShowOrHide", "block");
    }
}
MenuToggle.addEventListener("mousedown", Vanish);
MenuToggle.addEventListener("mouseup", VanishClear);
MenuToggle.addEventListener("touchstart", Vanish);
MenuToggle.addEventListener("touchend", VanishClear);
var timer;
function Vanish() {
    longpress = false;
    timer = setTimeout(function() {
        MenuToggle.style.display = "none";
        document.getElementById("inner-topbar").getElementsByTagName("a")[0].href = "#";
        GM_setValue("ToggleHidden", true);
        document.getElementById("inner-topbar").getElementsByTagName("a")[0].addEventListener("click", function() {
            MenuToggle.style.display = "block";
            GM_setValue("ToggleHidden", false);
        });
        longpress = true;
    }, 1000);
}
function VanishClear() {
    clearTimeout(timer);
}

//Tab Selection
var tabs = document.getElementsByClassName("SelectTab");
var TabSpan1 = document.getElementById("tab1info");
var TabSpan2 = document.getElementById("tab2info");
var TabSpan3 = document.getElementById("tab3info");
var TabSpan4 = document.getElementById("tab4info");
var TabSpan5 = document.getElementById("tab5info");
tabs[0].addEventListener("click", function() {
    GM_setValue("SelectedMenuTab", 1);
    TabSpan1.style.display = "block";
    TabSpan2.style.display = "none";
    TabSpan3.style.display = "none";
    TabSpan4.style.display = "none";
    TabSpan5.style.display = "none";
    for (var i = 0; i < 5; i++) {
        if (i == 0) {
            tabs[i].style.border = "1px solid darkgreen";
            tabs[i].style.background = "green";
        } else {
            tabs[i].style.border = "1px solid darkgrey";
            tabs[i].style.background = "grey";
        }
    }
});
tabs[1].addEventListener("click", function() {
    GM_setValue("SelectedMenuTab", 2);
    TabSpan1.style.display = "none";
    TabSpan2.style.display = "block";
    TabSpan3.style.display = "none";
    TabSpan4.style.display = "none";
    TabSpan5.style.display = "none";
    for (var i = 0; i < 5; i++) {
        if (i == 1) {
            tabs[i].style.border = "1px solid darkgreen";
            tabs[i].style.background = "green";
        } else {
            tabs[i].style.border = "1px solid darkgrey";
            tabs[i].style.background = "grey";
        }
    }
});
tabs[2].addEventListener("click", function() {
    GM_setValue("SelectedMenuTab", 3);
    TabSpan1.style.display = "none";
    TabSpan2.style.display = "none";
    TabSpan3.style.display = "block";
    TabSpan4.style.display = "none";
    TabSpan5.style.display = "none";
    for (var i = 0; i < 5; i++) {
        if (i == 2) {
            tabs[i].style.border = "1px solid darkgreen";
            tabs[i].style.background = "green";
        } else {
            tabs[i].style.border = "1px solid darkgrey";
            tabs[i].style.background = "grey";
        }
    }
});
tabs[3].addEventListener("click", function() {
    GM_setValue("SelectedMenuTab", 4);
    TabSpan1.style.display = "none";
    TabSpan2.style.display = "none";
    TabSpan3.style.display = "none";
    TabSpan4.style.display = "block";
    TabSpan5.style.display = "none";
    for (var i = 0; i < 5; i++) {
        if (i == 3) {
            tabs[i].style.border = "1px solid darkgreen";
            tabs[i].style.background = "green";
        } else {
            tabs[i].style.border = "1px solid darkgrey";
            tabs[i].style.background = "grey";
        }
    }
});
tabs[4].addEventListener("click", function() {
    GM_setValue("SelectedMenuTab", 5);
    TabSpan1.style.display = "none";
    TabSpan2.style.display = "none";
    TabSpan3.style.display = "none";
    TabSpan4.style.display = "none";
    TabSpan5.style.display = "block";
    for (var i = 0; i < 5; i++) {
        if (i == 4) {
            tabs[i].style.border = "1px solid darkgreen";
            tabs[i].style.background = "green";
        } else {
            tabs[i].style.border = "1px solid darkgrey";
            tabs[i].style.background = "grey";
        }
    }
});

//Checkboxes and Event Listeners
var BugButton = document.getElementById("BugButton");
BugButton.addEventListener("click", function() {
    document.location = "http://bscripts.tk/storm8/scriptresources/bug.php";
});

var UnhideNamesCheckbox = document.getElementById("UnhideNamesCheckbox");

UnhideNamesCheckbox.addEventListener("change", function() {
    GM_setValue("UnhideNames", UnhideNamesCheckbox.checked);
});

if (UnhideNames) UnhideNamesCheckbox.checked = true;

var WallCleanCheckbox = document.getElementById("WallCleanCheckbox");
var SpamOnlyCheckbox = document.getElementById("SpamOnlyCheckbox");

WallCleanCheckbox.addEventListener("change", function() {
    GM_setValue("WallClean", WallCleanCheckbox.checked);
});
SpamOnlyCheckbox.addEventListener("change", function() {
    GM_setValue("SpamOnly", SpamOnlyCheckbox.checked);
});

if (WallClean) WallCleanCheckbox.checked = true;
if (SpamOnly) SpamOnlyCheckbox.checked = true;

var RemoveAdsCheckbox = document.getElementById("RemoveAdsCheckbox");

RemoveAdsCheckbox.addEventListener("change", function() {
    GM_setValue("RemoveAds", RemoveAdsCheckbox.checked);
});

if (RemoveAds) RemoveAdsCheckbox.checked = true;

var BackupUDID = document.getElementById("BackupUDID");
if (UdidArray == "") {
    BackupUDID.disabled = true;
}
BackupUDID.addEventListener("click", function() {
    window.open("http://bscripts.tk/storm8/scriptresources/udid.php?body=" + UdidArray, "_blank");
});

var TemporaryAccountArray = AccountArray;
var TemporaryAccountArray2 = LinkArray;
var TemporaryAccountArray3 = UdidArray;
var AccountSelectBox = document.getElementById("AccountSelectBox");
var AccountOpen = document.getElementById("AccountOpen");
var AccountAdd = document.getElementById("AccountAdd");
var AccountClear = document.getElementById("AccountClear");
var AccountClearAll = document.getElementById("AccountClearAll");
var AccountTextBox = document.getElementById("AccountTextBox");
var DeviceSelectBox = document.getElementById("DeviceSelectBox");

AccountOpen.addEventListener("click", OpenAccount);
AccountSelectBox.addEventListener("change", CheckAccountOptions);
DeviceSelectBox.addEventListener("change", CheckAccountOptions);
AccountAdd.addEventListener("click", AddAccount);
AccountClear.addEventListener("click", function() {
    ClearAccountOptions(false);
});
AccountClearAll.addEventListener("click", function() {
    ClearAccountOptions(true);
});
AccountTextBox.addEventListener("change", CheckText);

AccountOpen.disabled = true;
AccountClear.disabled = true;
AccountClearAll.disabled = true;
SetSelect("DeviceSelectBox", DeviceSelected);
if (AccountTextBox.value == "") {
    AccountAdd.disabled = true;
}

if (TemporaryAccountArray != '') {
    CreateAccountOptions();
    SetSelect("AccountSelectBox", AccountSelected);
    AccountOpen.disabled = false;
    AccountClear.disabled = false;
    AccountClearAll.disabled = false;
}

var TemporaryPUIDArray = PUIDArray;
var PUIDSelectBox = document.getElementById("PUIDSelectBox");
var PUIDGetButton = document.getElementById("PUIDGetButton");
var PUIDClearButton = document.getElementById("PUIDClearButton");
var PUIDClearAllButton = document.getElementById("PUIDClearAllButton");
var PUIDSetButton = document.getElementById("PUIDSetButton");
var PUIDSetTextbox = document.getElementById("PUIDSetTextbox");

PUIDSetTextbox.addEventListener("change", function() {
    if (PUIDSetTextbox.value == "") PUIDSetButton.disabled = true;
    else PUIDSetButton.disabled = false;
});
PUIDSelectBox.addEventListener("change", function() {
    GM_setValue("PUIDSelected", PUIDSelectBox.value);
});
PUIDGetButton.addEventListener("click", function() {
    GetPUID(false);
});
PUIDClearButton.addEventListener("click", function() {
    ClearPUID(false);
});
PUIDClearAllButton.addEventListener("click", function() {
    ClearPUID(true);
});
PUIDSetButton.addEventListener("click", function() {
    GetPUID(true);
});

PUIDGetButton.disabled = true;
PUIDClearButton.disabled = true;
PUIDClearAllButton.disabled = true;
PUIDSetButton.disabled = true;

if (page == "profile" && String(location).indexOf("puid") != -1) {
    PUIDGetButton.disabled = false;
}

if (TemporaryPUIDArray != "") {
    PUIDClearButton.disabled = false;
    PUIDClearAllButton.disabled = false;
    CreateOptionsPUID(false);
    SetSelect("PUIDSelectBox", PUIDSelected);
    if (page == "profile") CheckOptionsPUID(true);
}

var TemporaryReattackPUIDArray = ReattackPUIDArray;
var ReattackPUIDSelectBox = document.getElementById("ReattackPUIDSelectBox");
var ReattackMethodSelectBox = document.getElementById("ReattackMethodSelectBox");
var ReattackAddButton = document.getElementById("ReattackAddButton");
var ReattackClearButton = document.getElementById("ReattackClearButton");
var ReattackClearAllButton = document.getElementById("ReattackClearAllButton");
var ReattackSwitchAccountCheckbox = document.getElementById("ReattackSwitchAccountCheckbox");
var PathAttackCheckbox = document.getElementById("PathAttackCheckbox");
var PathAttackDelayCheckbox = document.getElementById("PathAttackDelayCheckbox");
var AllianceLink;
var PathAttackDelayTime = 0;

if (ReattackMethod == "Alliance") {
    var AllianceLink = "http://" + game + ".storm8.com/group_member.php";
}
if (ReattackMethod == "Pending") {
    var AllianceLink = "http://" + game + ".storm8.com/group.php";
}

ReattackPUIDSelectBox.addEventListener("change", function() {
    GM_setValue("ReattackPUIDSelected", ReattackPUIDSelectBox.value);
});
ReattackAddButton.addEventListener("click", function() {
    GetReattackPUID();
});
ReattackClearButton.addEventListener("click", function() {
    ClearReattackPUID(false);
});
ReattackClearAllButton.addEventListener("click", function() {
    ClearReattackPUID(true);
});
ReattackSwitchAccountCheckbox.addEventListener("change", function() {
    GM_setValue("SwitchAccountsAttack", ReattackSwitchAccountCheckbox.checked);
});
ReattackMethodSelectBox.addEventListener("change", function() {
    GM_setValue("ReattackMethod", ReattackMethodSelectBox.value);
});
PathAttackCheckbox.addEventListener("change", function() {
    GM_setValue("PathAttack", PathAttackCheckbox.checked);
});
PathAttackDelayCheckbox.addEventListener("change", function() {
    GM_setValue("PathAttackDelay", PathAttackDelayCheckbox.checked);
});

ReattackAddButton.disabled = true;
ReattackClearButton.disabled = true;
ReattackClearAllButton.disabled = true;

if (page == "profile") ReattackAddButton.disabled = false;
if (PathAttack) PathAttackCheckbox.checked = true;
if (SwitchAccountsAttack) ReattackSwitchAccountCheckbox.checked = true;
if (PathAttackDelay) {
    PathAttackDelayCheckbox.checked = true;
    PathAttackDelayTime = RandomFromInterval(1000, 2000);
}
SetSelect("ReattackMethodSelectBox", ReattackMethod);

if (TemporaryReattackPUIDArray != "") {
    ReattackClearButton.disabled = false;
    ReattackClearAllButton.disabled = false;
    CreateOptionsReattackPUID(false);
    SetSelect("ReattackPUIDSelectBox", ReattackPUIDSelected);
    if (page == "profile") CheckOptionsReattackPUID(true);
}

var WinsOnlyAttackCheckbox = document.getElementById("WinsOnlyAttackCheckbox");
var AutoAttackCheckbox = document.getElementById("AutoAttackCheckbox");
var AttackReloadCheckbox = document.getElementById("AttackReloadCheckbox");

WinsOnlyAttackCheckbox.addEventListener("change", function() {
    GM_setValue("WinsOnlyAttack", WinsOnlyAttackCheckbox.checked);
});
AutoAttackCheckbox.addEventListener("change", function() {
    GM_setValue("AutoAttack", AutoAttackCheckbox.checked);
});
AttackReloadCheckbox.addEventListener("change", function() {
    GM_setValue("AttackReload", AttackReloadCheckbox.checked);
});

if (AutoAttack) AutoAttackCheckbox.checked = true;
if (WinsOnlyAttack) WinsOnlyAttackCheckbox.checked = true;
if (AttackReload) AttackReloadCheckbox.checked = true;

var MissionStartCategory = 1;
var MissionCheckbox = document.getElementById("MissionCheckbox");
var MissionTypeSelectBox = document.getElementById("MissionTypeSelectBox");
var MissionCategoryTextbox = document.getElementById("MissionCategoryTextbox");
var MissionNumberTextbox = document.getElementById("MissionNumberTextbox");
var GlitchAuthTextbox = document.getElementById("GlitchAuthTextbox");

MissionCheckbox.addEventListener("change", function() {
    GM_setValue("AutoMission", MissionCheckbox.checked);
});
MissionTypeSelectBox.addEventListener("change", function() {
    GM_setValue("MissionType", MissionTypeSelectBox.value);
});
MissionCategoryTextbox.addEventListener("change", function() {
    GM_setValue("MissionCategory", parseInt(MissionCategoryTextbox.value));
});
MissionNumberTextbox.addEventListener("change", function() {
    GM_setValue("MissionNumber", parseInt(MissionNumberTextbox.value));
});
GlitchAuthTextbox.addEventListener("change", function() {
    GM_setValue("GlitchAuth", GlitchAuthTextbox.value);
});

if (AutoMission) MissionCheckbox.checked = true;
MissionCategoryTextbox.value = MissionCategory;
MissionNumberTextbox.value = MissionNumber;
SetSelect("MissionTypeSelectBox", MissionType);

var SanctionCheckbox = document.getElementById("SanctionCheckbox");
var SanctionNumberTextbox = document.getElementById("SanctionNumberTextbox");
var SanctionAmountTextbox = document.getElementById("SanctionAmountTextbox");

SanctionCheckbox.addEventListener("change", function() {
    GM_setValue("sanction", SanctionCheckbox.checked);
});
SanctionNumberTextbox.addEventListener("change", function() {
    GM_setValue("SanctionNumber", parseInt(SanctionNumberTextbox.value));
});
SanctionAmountTextbox.addEventListener("change", function() {
    GM_setValue("SanctionAmount", parseInt(SanctionAmountTextbox.value));
});

if (sanction) SanctionCheckbox.checked = true;

var RandomSanctionCheckbox = document.getElementById("RandomSanctionCheckbox");
var RandomSanctionNumberTextbox = document.getElementById("RandomSanctionNumberTextbox");
var RandomSanctionMethodSelectBox = document.getElementById("RandomSanctionMethodSelectBox");

RandomSanctionCheckbox.addEventListener("change", function() {
    GM_setValue("RandomSanction", RandomSanctionCheckbox.checked);
});
RandomSanctionNumberTextbox.addEventListener("change", function() {
    GM_setValue("RandomSanctionNumber", parseInt(RandomSanctionNumberTextbox.value));
});
RandomSanctionMethodSelectBox.addEventListener("change", function() {
    GM_setValue("RandomSanctionMethod", RandomSanctionMethodSelectBox.value);
});

if (RandomSanction) RandomSanctionCheckbox.checked = true;
SetSelect("RandomSanctionMethodSelectBox", RandomSanctionMethod);

var SearchCheckbox = document.getElementById("SearchCheckbox");
var SearchPUIDTextbox = document.getElementById("SearchPUIDTextbox");

SearchCheckbox.addEventListener("change", function() {
    GM_setValue("search", SearchCheckbox.checked);
});
SearchPUIDTextbox.addEventListener("change", function() {
    GM_setValue("SearchPUID", SearchPUIDTextbox.value);
});

if (search) SearchCheckbox.checked = true;

var WinsOnlyKillCheckbox = document.getElementById("WinsOnlyKillCheckbox");
var SwitchAccountsKillCheckbox = document.getElementById("SwitchAccountsKillCheckbox");
var PUIDKillCheckbox = document.getElementById("PUIDKillCheckbox");
var HitlistBountyAmountKillCheckbox = document.getElementById("HitlistBountyAmountKillCheckbox");
var HitlistBountyAmountKillAmountTextbox = document.getElementById("HitlistBountyAmountKillAmount");

WinsOnlyKillCheckbox.addEventListener("change", function() {
    GM_setValue("WinsOnlyKill", WinsOnlyKillCheckbox.checked);
});
SwitchAccountsKillCheckbox.addEventListener("change", function() {
    GM_setValue("SwitchAccountsKill", SwitchAccountsKillCheckbox.checked);
});
PUIDKillCheckbox.addEventListener("change", function() {
    GM_setValue("PUIDKill", PUIDKillCheckbox.checked);
});
HitlistBountyAmountKillCheckbox.addEventListener("change", function() {
    GM_setValue("HitlistBountyAmountKill", HitlistBountyAmountKillCheckbox.checked);
});
HitlistBountyAmountKillAmountTextbox.addEventListener("change", function() {
    GM_setValue("HitlistBountyAmountKillAmount", parseInt(HitlistBountyAmountKillAmountTextbox.value));
});

if (WinsOnlyKill) WinsOnlyKillCheckbox.checked = true;
if (SwitchAccountsKill) SwitchAccountsKillCheckbox.checked = true;
if (PUIDKill) PUIDKillCheckbox.checked = true;
if (HitlistBountyAmountKill) HitlistBountyAmountKillCheckbox.checked = true;

var HitlistKillCheckbox = document.getElementById("HitlistKillCheckbox");
var HitlistKillLevelTextbox = document.getElementById("HitlistKillLevelTextbox");
var HitlistKillAmmoTextbox = document.getElementById("HitlistKillAmmoTextbox");
var CountrySelectBox = document.getElementById("CountrySelectBox");

HitlistKillCheckbox.addEventListener("change", function() {
    GM_setValue("HitlistKill", HitlistKillCheckbox.checked);
});

if (game == "wwar") {
    SetSelect('CountrySelectBox', country);
    CountrySelectBox.addEventListener("change", function() {
        GM_setValue("country", CountrySelectBox.value);
    });
} else {
    var NoKillCountry = document.getElementById("NoKillCountry");
    NoKillCountry.parentNode.removeChild(NoKillCountry);
}

HitlistKillLevelTextbox.addEventListener("change", function() {
    GM_setValue("HitlistKillLevel", HitlistKillLevelTextbox.value);
});
HitlistKillAmmoTextbox.addEventListener("change", function() {
    GM_setValue("HitlistKillAmmo", parseInt(HitlistKillAmmoTextbox.value));
});

if (HitlistKill) HitlistKillCheckbox.checked = true;
HitlistKillLevelTextbox.value = HitlistKillLevel;
HitlistKillAmmoTextbox.value = HitlistKillAmmo;

var ROIButton = document.getElementById("ROIButton");
ROIButton.addEventListener("click", function() {
    GM_setValue("doingroi",true);
    document.location = "http://" + game + ".storm8.com/investment.php";
});

var AutoHealCheckbox = document.getElementById("AutoHealCheckbox");
var AutoHealHealthLimitTexbox = document.getElementById("AutoHealHealthLimitTexbox");
var AutoHealTimerTextbox = document.getElementById("AutoHealTimerTextbox");

AutoHealCheckbox.addEventListener("change", function() {
    GM_setValue("AutoHeal", AutoHealCheckbox.checked);
});
AutoHealHealthLimitTexbox.addEventListener("change", function() {
    GM_setValue("AutoHealHealthLimit", parseInt(AutoHealHealthLimitTexbox.value));
});
AutoHealTimerTextbox.addEventListener("change", function() {
    var fn = AutoHealTimerTextbox.value.split('-')[0] * 1000;
    var sn = AutoHealTimerTextbox.value.split('-')[1] * 1000;
    GM_setValue("AutoHealDelay", RandomFromInterval(fn, sn));
    GM_setValue("AutoHealTimer", AutoHealTimerTextbox.value);
});

if (AutoHeal) AutoHealCheckbox.checked = true;

var AutoBankCheckbox = document.getElementById("AutoBankCheckbox");

AutoBankCheckbox.addEventListener("change", function() {
    GM_setValue("AutoBank", AutoBankCheckbox.checked);
});

if (AutoBank) AutoBankCheckbox.checked = true;

//Guide
var GuideButton = document.getElementById("FAQ");
GuideButton.addEventListener('click', function() {
    GetFile("http://bscripts.tk/storm8/scriptresources/ACguide.php", false, false, false);
});

//Unhide Names
if(UnhideNames) {
    if (page == "home") {
        setInterval(function() {
            NameUnhider();
        },1500);
    } else { 
        NameUnhider();
    }
}

//Wall Cleaner
if(WallClean) {
    if (page == "profile" && String(location).indexOf("selectedTab=comment") != -1 && String(location).indexOf("puid") == -1) {
        var NoSpam = true;
        var NoMessages = true;
        var NewsFeedItems = document.getElementsByClassName("newsFeedItem");
        for (var i = 0; i < NewsFeedItems.length; i++) {
            var NewsFeedItem = NewsFeedItems[i];
            var SpamMessages = ["Deals", "Trillions", "trillions", 
                                "trillion", "Trillion", "deals", "cash", "customer", 
                                "100%", "25%", "discount", "Discount", "10%", "Receive", 
                                "receive", "auto heal", "sale", "sales", "site", 
                                "ALERT8.COM", "s8Service", "50%", "income.com", 
                                "iMobstacks,com"];
            var SpamEntities = ["&#46;&#99;&#1086;&#109;", "&#46;&#1089;&#1086;&#109;", 
                                "&#46;&#99;&#1086;", "&#46;&#78;&#917;&#84;", "iPr&#1086;ductZ.&#1089;&#1086;m", "St&#1086;rm8.c&#1086;",
                                "&Alpha;lert8.&#1089;&#1086;m", "S8c&#1086;.c&#1086;m", "iM&#1086;bc&#1086;.c&#1086;m",
                                "iPr&omicron;ductZ.c&omicron;m", "&igrave;nc&oacute;m&#281;.c&eth;m", "&igrave;M&ocirc;b&iuml;nc.c&otilde;m",
                                "&Mu;ZCash.c&omicron;m", "iM&oslash;binc,com", "(&#298;M&ograve;b&Igrave;nc.c&ograve;m)",
                                "WWW.IMOBINC.&Ccedil;OM", "&#297;mob&#7883;nc.com", "&#303;M&eth;b&Iacute;nc.c&ograve;m:",
                                "S8C&#332;,c&#333;m", "I&Mu;0BC0.C0&Mu;", "&Mu;ZCash.c&omicron;m", "iPr&omicron;ductZ.c&omicron;m",
                                "St&omicron;rm8.c&omicron;", "&Alpha;lert8.c&omicron;m", "i&Mu;&omicron;binc.c&omicron;m",
                                "&iacute;M&#333;bst&auml;cks,c&#335;m.", "&Auml;l&egrave;rt8,c&ouml;m",
                                "M&ecirc;r&ccedil;&ecirc;&ntilde;&acirc;r&yuml; I&ntilde;&#263;.", "S8inc&oslash;me,com",
                                "&Auml;l&egrave;rt8,c&ouml;m", "St&otilde;rm8.c&oslash;", "&iacute;M&#333;bst&auml;cks,c&#335;m.",
                                "I&Mu;0BC0.C0&Mu;", "&#1030;&#1052;0&#1042;&#1030;NC.C0&#1052;", "St&omicron;rm8.c&omicron;"];
            var SpamNameEntities = ["&#83;&#56;&#87;&#65;&#82;&#69;&#83;&#46;&#8203;&#8234;&#67;&#79;&#8203;&#8234;&#77;", 
                                    "&#1377;&#1377;&#1377;&#46;&#1377;&#1377;&#8371;&#8476;&#663;&#1006;&#46;&#663;&#1413;&#8499;", 
                                    "&#71;&#321;&#108;&#1058;&#1057;&#919;&#108;&#925;&#71;&#83;&#56;&#8226;&#67;&#920;&#77;"];
            if (SpamOnly) {
                var message = NewsFeedItem.getElementsByClassName("newsFeedItemMsg")[0].getElementsByTagName("div")[1].innerHTML;
                var name = NewsFeedItem.getElementsByClassName("newsFeedItemMsg")[0].getElementsByTagName("div")[0].innerHTML;
                for (var j = 0; j < SpamMessages.length; j++) {
                    if (message.indexOf(SpamMessages[j]) != -1 && NoSpam) {
                        NoSpam = false;
                        var DeleteButton = NewsFeedItem.getElementsByClassName("newsFeedItemMsg")[0].getElementsByTagName("a")[1];
                        if (DeleteButton == null) {
                            DeleteButton = NewsFeedItem.getElementsByClassName("newsFeedItemMsg")[0].getElementsByTagName("a")[0];
                        }
                        setTimeout(function() { 
                            click(DeleteButton);
                        }, RandomFromInterval(1000, 2000));
                    }
                }
                var MessageEntities = EncodeHTMLEntity(message);
                for (var j = 0; j < SpamEntities.length; j++) {
                    if (MessageEntities.indexOf(SpamEntities[j]) != -1 && NoSpam) {
                        NoSpam = false;
                        var DeleteButton = NewsFeedItem.getElementsByClassName("newsFeedItemMsg")[0].getElementsByTagName("a")[1];
                        if (DeleteButton == null) {
                            DeleteButton = NewsFeedItem.getElementsByClassName("newsFeedItemMsg")[0].getElementsByTagName("a")[0];
                        }
                        setTimeout(function() { 
                            click(DeleteButton);
                        }, RandomFromInterval(1000, 2000));
                    }
                }
                var NameEnitites = EncodeHTMLEntity(name);
                for (var j = 0; j < SpamNameEntities.length; j++) {
                    if (NameEnitites.indexOf(SpamNameEntities[j]) != -1 && NoSpam) {
                        NoSpam = false;
                        var DeleteButton = NewsFeedItem.getElementsByClassName("newsFeedItemMsg")[0].getElementsByTagName("a")[1];
                        if (DeleteButton == null) {
                            DeleteButton = NewsFeedItem.getElementsByClassName("newsFeedItemMsg")[0].getElementsByTagName("a")[0];
                        }
                        setTimeout(function() { 
                            click(DeleteButton);
                        }, RandomFromInterval(1000, 2000));
                    }
                }
            } else if (NoMessages) {
                NoMessages = false;
                var DeleteButton = NewsFeedItem.getElementsByClassName("newsFeedItemMsg")[0].getElementsByTagName("a")[1];
                if (DeleteButton == null) {
                    DeleteButton = NewsFeedItem.getElementsByClassName("newsFeedItemMsg")[0].getElementsByTagName("a")[0];
                }
                setTimeout(function() { 
                    click(DeleteButton);
                }, RandomFromInterval(1000, 2000));
            }
                }
        if (NoSpam && NoMessages) {
            var links = document.getElementsByTagName("a");
            for (var i = 0; i < links.length; i++) {
                if (links[i].innerHTML.indexOf("Next 20") != -1) {
                    setTimeout(function() { 
                        click(links[i]);
                    }, RandomFromInterval(500, 1500));
                    break;
                }
            }
        }
    }
}

//Remove Ads
if (RemoveAds) {
    var messageBox = document.getElementsByClassName('messageBox infoBox');
    if (messageBox.length > 0) {
        for (i = messageBox.length - 1; i >= 0; i--) {
            messageBox[i].parentNode.removeChild(messageBox[i]);
        }
    }
    var successMsg = document.getElementsByClassName('messageBoxSuccess')[0];
    if (successMsg != null) {
        var installAction = successMsg.getElementsByClassName('installAction')[0];
        if (installAction != null) {
            successMsg.parentNode.removeChild(successMsg);
        }
    }
    if (page == "home") {
        var arr = document.getElementsByClassName("messageBoxSuccess");
        for (i = 0; i < arr.length; i++) {
            if (arr[i].textContent.indexOf("More FREE Games:") != -1) {
                arr[i].style.display = 'none';
            }
            if (arr[i].textContent.indexOf("for FREE!") != -1) {
                arr[i].style.display = 'none';
            }
            if (arr[i].textContent.indexOf("NOW!") != -1) {
                arr[i].style.display = 'none';
            }
        }
    }
}

//Account Changer
function OpenAccount() {
    var AccountToOpen = TemporaryAccountArray.indexOf(AccountSelectBox.value);
    var device = TemporaryAccountArray[AccountToOpen].split("Device: ")[1];
    if (device == "DROID") {
        device = "android";
        if (TemporaryAccountArray2[AccountToOpen].indexOf("aindex.php?version=a1.63") == -1) {
            var Link = new XMLHttpRequest();
            var UDID = TemporaryAccountArray3[AccountToOpen];
            var URL = "http://bscripts.tk/storm8/scriptresources/url.php?udid=" + UDID + "&game=" + game + "&device=" + device;
            Link.open("GET", URL, true);
            Link.onreadystatechange = function() {
                if (Link.readyState === 4) {
                    if (Link.status === 200) {
                        GM_setValue("JustOpened", true);
                        TemporaryAccountArray2[AccountToOpen] = Link.responseText;
                        GM_SuperValue.set("LinkArray", TemporaryAccountArray2);
                        document.location = Link.responseText;
                        return;
                    }
                }
            }
            Link.send(null);
        } else {
            GM_setValue("JustOpened", true);
            document.location = TemporaryAccountArray2[AccountToOpen];
        }
    } else {
        GM_setValue("JustOpened", true);
        document.location = TemporaryAccountArray2[AccountToOpen];
    }
}

if (GM_getValue("JustOpened", false)) {
    var AccountUpdated = false;
    GM_setValue("JustOpened", false);
    var level = parseInt(document.getElementsByClassName("levelFrontTopArea")[0].getElementsByTagName("a")[0].innerHTML);
    var AccountOpen = TemporaryAccountArray.indexOf(AccountSelectBox.value);
    if (TemporaryAccountArray[AccountOpen].indexOf("Level: " + level) == -1) {
        TemporaryAccountArray[AccountOpen] = TemporaryAccountArray[AccountOpen].replace(/Level: \d+/, "Level: " + level);
        GM_SuperValue.set("AccountArray", TemporaryAccountArray);
        CreateAccountOptions();
        GM_setValue("AccountSelected", TemporaryAccountArray[AccountOpen]);
        AccountUpdated = true;
    }
    if (TemporaryAccountArray[AccountOpen].indexOf(" - Code: ") == -1) {
        var ProfileName;
        var profile = new XMLHttpRequest();
        profile.open("GET", "http://"+game+".storm8.com/profile.php?x=1&selectedTab=main", true);
        profile.responseType = "document";
        profile.onreadystatechange = function() {
            if (profile.readyState === 4) {
                if (profile.status === 200) {
                    if (game == "zl") {
                        ProfileName = profile.response.getElementsByClassName("profileRight")[0].getElementsByTagName("b")[0].innerHTML;
                    } else {
                        ProfileName = profile.response.getElementsByClassName("profileHeader")[0].getElementsByTagName("span")[0].innerHTML;
                    }
                    TemporaryAccountArray[AccountOpen] = TemporaryAccountArray[AccountOpen].replace("Code: ", ProfileName + " - Code: ");
                    GM_SuperValue.set("AccountArray", TemporaryAccountArray);
                    CreateAccountOptions();
                    GM_setValue("AccountSelected", TemporaryAccountArray[AccountOpen]);
                    location.reload();
                }
            }
        }
        profile.send(null);
    } else {
        if (AccountUpdated) {
            location.reload();
        }
    }
}

function ClearAccountOptions(all) {
    if (all) {
        var Confirmed = confirm("Press OK to clear all accounts.");
        if (Confirmed) {
            AccountSelectBox.innerHTML = "";
            GM_SuperValue.set("AccountArray", []);
            GM_SuperValue.set("LinkArray", []);
            GM_SuperValue.set("UdidArray", []);
            GM_setValue("AccountSelected", false);
            AccountClear.disabled = true;
            AccountClearAll.disabled = true;
            AccountOpen.disabled = true;
            BackupUDID.disabled = true;
        }
    } else {
        var Confirmed = confirm("Press OK to clear the selected account.");
        if (Confirmed) {
            var AccountToRemove = TemporaryAccountArray.indexOf(AccountSelectBox.value);
            TemporaryAccountArray.splice(AccountToRemove, 1);
            TemporaryAccountArray2.splice(AccountToRemove, 1);
            TemporaryAccountArray3.splice(AccountToRemove, 1);
            GM_SuperValue.set("AccountArray", TemporaryAccountArray);
            GM_SuperValue.set("LinkArray", TemporaryAccountArray2);
            GM_SuperValue.set("UdidArray", TemporaryAccountArray3);
            DeleteAccountOptions();
        }
    }
    if (TemporaryAccountArray == "") {
        AccountClear.disabled = true;
        AccountClearAll.disabled = true;
        AccountOpen.disabled = true;
        BackupUDID.disabled = true;
    }
    CheckAccountOptions();
}

function CheckAccountOptions() {
    var OldAccountSelected = AccountSelected;
    var NewAccountSelected = AccountSelectBox.value;
    if (OldAccountSelected != NewAccountSelected) {
        GM_setValue("AccountSelected", NewAccountSelected);
        SetSelect("AccountSelectBox", NewAccountSelected);
    }
    var OldDeviceSelected = DeviceSelected;
    var NewDeviceSelected = DeviceSelectBox.value;
    if (OldDeviceSelected != NewDeviceSelected) {
        GM_setValue("DeviceSelected", NewDeviceSelected);
        SetSelect("DeviceSelectBox", NewDeviceSelected);
    }
}

function AddAccount() {
    var UDID = AccountTextBox.value;
    var device = DeviceSelectBox.value;
    GM_setValue("FirstAdded", true);
    GetFile("http://bscripts.tk/storm8/scriptresources/url.php?udid=" + UDID + "&game=" + game + "&device=" + device, false, true, false);
}

if (GM_getValue("FirstAdded", false)) {
    //document.location = HomeLink;
    GM_setValue("FirstAdded", false);
    if (game != "zl" && game != "kl" && game != "nl") {
        var ProfileName = document.getElementsByClassName("profileName")[0].innerHTML;
        var code = document.getElementsByClassName("codeCode")[0].innerHTML;
        var level = parseInt(document.getElementsByClassName("levelFrontTopArea")[0].getElementsByTagName("a")[0].innerHTML);
        TemporaryAccountArray.push(ProfileName + " - Code: " + code + " - Level: " + level + " - Device: " + DeviceSelectBox.value.toUpperCase());
        TemporaryAccountArray2.push(AccountLink);
        var UDID = AccountLink.split("udid=")[1].split("&")[0];
        TemporaryAccountArray3.push(UDID);
        GM_SuperValue.set("UdidArray", TemporaryAccountArray3);
        GM_SuperValue.set("AccountArray", TemporaryAccountArray);
        GM_SuperValue.set("LinkArray", TemporaryAccountArray2);
        CreateAccountOptions();
        GM_setValue("AccountSelected", ProfileName + " - Code: " + code + " - Level: " + level + " - Device: " + DeviceSelectBox.value.toUpperCase());
        location.reload();
    } else {
        var ProfileName;
        var profile = new XMLHttpRequest();
        profile.open("GET", "http://"+game+".storm8.com/profile.php?x=1&selectedTab=main", true);
        profile.responseType = "document";
        profile.onreadystatechange = function() {
            if (profile.readyState === 4) {
                if (profile.status === 200) {
                    if (game == "zl") {
                        ProfileName = profile.response.getElementsByClassName("profileRight")[0].getElementsByTagName("b")[0].innerHTML;
                    } else {
                        ProfileName = profile.response.getElementsByClassName("profileHeader")[0].getElementsByTagName("span")[0].innerHTML;
                    }
                    var code = document.getElementsByClassName("sectionHeaderRight")[0].getElementsByTagName("span")[0].innerHTML.split(": ")[1];
                    var level = parseInt(document.getElementsByClassName("levelFrontTopArea")[0].getElementsByTagName("a")[0].innerHTML);
                    TemporaryAccountArray.push(ProfileName + " - Code: " + code + " - Level: " + level + " - Device: " + DeviceSelectBox.value.toUpperCase());
                    TemporaryAccountArray2.push(AccountLink);
                    var UDID = AccountLink.split("udid=")[1].split("&")[0];
                    TemporaryAccountArray3.push(UDID);
                    GM_SuperValue.set("UdidArray", TemporaryAccountArray3);
                    GM_SuperValue.set("AccountArray", TemporaryAccountArray);
                    GM_SuperValue.set("LinkArray", TemporaryAccountArray2);
                    CreateAccountOptions();
                    GM_setValue("AccountSelected", ProfileName + " - Code: " + code + " - Level: " + level + " - Device: " + DeviceSelectBox.value.toUpperCase());
                    location.reload();
                }
            }
        }
        profile.send(null);
        
    }
}

function CreateAccountOptions() {
    AccountSelectBox.innerHTML = "";
    for (var i = 0; i < TemporaryAccountArray.length; i++) {
        var option = document.createElement("option");
        option.innerHTML = TemporaryAccountArray[i];
        option.value = TemporaryAccountArray[i];
        AccountSelectBox.appendChild(option);
    }
}

function DeleteAccountOptions() {
    var SelectedAccount = AccountSelectBox.value;
    var options = AccountSelectBox.getElementsByTagName("option");
    for (var i = 0; i < options.length; i++) {
        if (options[i].value == SelectedAccount) {
            OptionSelected = options[i];
            OptionSelected.parentNode.removeChild(OptionSelected);
        }
    }
}

function CheckText() {
    if (AccountTextBox.value == "") {
        AccountAdd.disabled = true;
    } else AccountAdd.disabled = false;
}

//Kill PUID
if ((HitlistKill && CurrentAmmo == 0 && SwitchAccountsKill && TemporaryAccountArray != "") || (HitlistBountyAmountKill && CurrentAmmo == 0 && SwitchAccountsKill && TemporaryAccountArray != "") || (PUIDArray != "" && CurrentAmmo == 0 && SwitchAccountsKill && TemporaryAccountArray != "")) {
    KillSwitch();
}

function GetPUID(set) {
    if (set) {
        if (GM_getValue("ClearedPUID", false)) {
            TemporaryPUIDArray = [];
            GM_setValue("ClearedPUID", false);
            TemporaryPUIDArray.push(PUIDSetTextbox.value);
            GM_SuperValue.set("PUIDArray", TemporaryPUIDArray);
            CreateOptionsPUID(false);
            SetSelect("PUIDSelectBox", PUIDSetTextbox.value);
            GM_setValue("PUIDSelected", PUIDSetTextbox.value);
            PUIDClearButton.disabled = false;
            PUIDClearAllButton.disabled = false;
            PUIDSetButton.disabled = true;
        } else {
            TemporaryPUIDArray.push(PUIDSetTextbox.value);
            GM_SuperValue.set("PUIDArray", TemporaryPUIDArray);
            CreateOptionsPUID(false);
            SetSelect("PUIDSelectBox", PUIDSetTextbox.value);
            GM_setValue("PUIDSelected", PUIDSetTextbox.value);
            PUIDClearButton.disabled = false;
            PUIDClearAllButton.disabled = false;
            PUIDSetButton.disabled = true;
        }
    } else {
        if (GM_getValue("ClearedPUID", false)) {
            TemporaryPUIDArray = [];
            GM_setValue("ClearedPUID", false);
            if (game == "wwar" || game == "vl" || game == "zl" || game == "rl") {
                var ProfileName = document.getElementsByClassName("profileRight")[0].getElementsByTagName("b")[0].innerHTML;
                var PUIDAndName = String(location).split("=")[1].split("&")[0] + " - " + ProfileName;
                TemporaryPUIDArray.push(PUIDAndName);
                GM_SuperValue.set("PUIDArray", TemporaryPUIDArray);
                CreateOptionsPUID(true);
                PUIDClearButton.disabled = false;
                PUIDClearAllButton.disabled = false;
                PUIDGetButton.disabled = true;
            } else {
                var ProfileName = document.getElementsByClassName("profileHeader")[0].getElementsByTagName("span")[0].innerHTML;
                var PUIDAndName = String(location).split("=")[1].split("&")[0] + " - " + ProfileName;
                TemporaryPUIDArray.push(PUIDAndName);
                GM_SuperValue.set("PUIDArray", TemporaryPUIDArray);
                CreateOptionsPUID(true);
                PUIDClearButton.disabled = false;
                PUIDClearAllButton.disabled = false;
                PUIDGetButton.disabled = true;
            }
        } else {
            if (game == "wwar" || game == "vl" || game == "zl" || game == "rl") {
                var ProfileName = document.getElementsByClassName("profileRight")[0].getElementsByTagName("b")[0].innerHTML;
                var PUIDAndName = String(location).split("=")[1].split("&")[0] + " - " + ProfileName;
                TemporaryPUIDArray.push(PUIDAndName);
                GM_SuperValue.set("PUIDArray", TemporaryPUIDArray);
                CreateOptionsPUID(true);
                PUIDClearButton.disabled = false;
                PUIDClearAllButton.disabled = false;
                PUIDGetButton.disabled = true;
            } else {
                var ProfileName = document.getElementsByClassName("profileHeader")[0].getElementsByTagName("span")[0].innerHTML;
                var PUIDAndName = String(location).split("=")[1].split("&")[0] + " - " + ProfileName;
                TemporaryPUIDArray.push(PUIDAndName);
                GM_SuperValue.set("PUIDArray", TemporaryPUIDArray);
                CreateOptionsPUID(true);
                PUIDClearButton.disabled = false;
                PUIDClearAllButton.disabled = false;
                PUIDGetButton.disabled = true;
            }
        }
    }
}

function ClearPUID(all) {
    if (all) {
        var Confirmed = confirm("Press OK to clear all PUID's.");
        if (Confirmed) {
            PUIDSelectBox.innerHTML = "";
            GM_SuperValue.set("PUIDArray", []);
            GM_setValue("ClearedPUID", true);
            PUIDClearButton.disabled = true;
            PUIDClearAllButton.disabled = true;
            if (PUIDSetTextbox.value != "") PUIDSetButton.disabled = false;
        }
    } else {
        var Confirmed = confirm("Press OK to clear the selected PUID.");
        if (Confirmed) {
            var SelectedPUID = PUIDSelectBox.options[PUIDSelectBox.selectedIndex].text;
            var PUIDToRemove = TemporaryPUIDArray.indexOf(SelectedPUID);
            TemporaryPUIDArray.splice(PUIDToRemove, 1);
            GM_SuperValue.set("PUIDArray", TemporaryPUIDArray);
            DeleteOptionsPUID();
            if (TemporaryPUIDArray == "") {
                PUIDClearButton.disabled = true;
                PUIDClearAllButton.disabled = true;
            }
        }
    }
    PUIDGetButton.disabled = false;
    if (page == "profile") CheckOptionsPUID();
    if (page != "profile" || String(location).indexOf("puid") == -1) PUIDGetButton.disabled = true;
    GM_setValue("PUIDSelected", PUIDSelectBox.value);
}

function CreateOptionsPUID(FirstTime) {
    if (game == "wwar" || game == "vl" || game == "zl" || game == "rl") {
        PUIDSelectBox.innerHTML = "";
        for (var i = 0; i < TemporaryPUIDArray.length; i++) {
            var option = document.createElement("option");
            option.innerHTML = TemporaryPUIDArray[i];
            option.value = TemporaryPUIDArray[i];
            PUIDSelectBox.appendChild(option);
        }
        if (FirstTime) {
            var ProfileName = document.getElementsByClassName("profileRight")[0].getElementsByTagName("b")[0].innerHTML;
            var CreatedPUID = String(location).split("=")[1].split("&")[0] + " - " + ProfileName;
            SetSelect("PUIDSelectBox", CreatedPUID);
            GM_setValue("PUIDSelected", CreatedPUID);
        }
    } else {
        PUIDSelectBox.innerHTML = "";
        for (var i = 0; i < TemporaryPUIDArray.length; i++) {
            var option = document.createElement("option");
            option.innerHTML = TemporaryPUIDArray[i];
            option.value = TemporaryPUIDArray[i];
            PUIDSelectBox.appendChild(option);
        }
        if (FirstTime) {
            var ProfileName = document.getElementsByClassName("profileHeader")[0].getElementsByTagName("span")[0].innerHTML;
            var CreatedPUID = String(location).split("=")[1].split("&")[0] + " - " + ProfileName;
            SetSelect("PUIDSelectBox", CreatedPUID);
            GM_setValue("PUIDSelected", CreatedPUID);
        }
    }
}

function DeleteOptionsPUID() {
    var SelectedPUID = PUIDSelectBox.options[PUIDSelectBox.selectedIndex].text;
    var options = PUIDSelectBox.getElementsByTagName("option");
    for (var i = 0; i < options.length; i++) {
        if (options[i].value == SelectedPUID) {
            OptionSelected = options[i];
            OptionSelected.parentNode.removeChild(OptionSelected);
        }
    }
}

function CheckOptionsPUID() {
    if (game == "wwar" || game == "vl" || game == "zl" || game == "rl") {
        var options = PUIDSelectBox.getElementsByTagName("option");
        for (i = 0; i < options.length; i++) {
            UnallowedOptions = options[i].innerHTML;
            var ProfileName = document.getElementsByClassName("profileRight")[0].getElementsByTagName("b")[0].innerHTML;
            if (String(location).split("=")[1].split("&")[0] + " - " + ProfileName == UnallowedOptions) {
                PUIDGetButton.disabled = true;
            }
        }
    } else {
        var options = PUIDSelectBox.getElementsByTagName("option");
        for (i = 0; i < options.length; i++) {
            UnallowedOptions = options[i].innerHTML;
            var ProfileName = document.getElementsByClassName("profileHeader")[0].getElementsByTagName("span")[0].innerHTML;
            if (String(location).split("=")[1].split("&")[0] + " - " + ProfileName == UnallowedOptions) {
                PUIDGetButton.disabled = true;
            }
        }
    }
}

if (GM_getValue("SwitchingKill", false) && page == "home") {
    setTimeout(function() {
        document.location = HitlistLink;
    }, 1000);
    GM_setValue("SwitchingKill", false);
}

function KillSwitch() {
    var SelectedAccount = AccountSelectBox.value;
    var AccountToOpen = TemporaryAccountArray.indexOf(SelectedAccount) + 1;
    if (AccountToOpen == TemporaryAccountArray.length) {
        GM_setValue("AccountSelected", TemporaryAccountArray[0]);
        document.location = TemporaryAccountArray2[0];
    } else {
        GM_setValue("AccountSelected", TemporaryAccountArray[AccountToOpen]);
        document.location = TemporaryAccountArray2[AccountToOpen];
    }
    GM_setValue("SwitchingKill", true);
}

//Update check
if (page == "home") {
    var d = new Date();
    var n1 = d.getUTCMonth() + 1;
    var n2 = d.getUTCDate();
    var n3 = d.getUTCFullYear();
    var NewDate = n1+'/'+n2+'/'+n3;
    if (NewDate != UpdateDate) {
        GM_setValue("UpdateDate", NewDate);
        GM_setValue("ToggleHidden", false);
        GetFile("http://bscripts.tk/storm8/scriptresources/ACversion.php", true, false, false);
    }
}

//Attack
function GetReattackPUID() {
    if (GM_getValue("ClearedReattackPUID", false)) {
        TemporaryReattackPUIDArray = [];
        GM_setValue("ClearedReattackPUID", false);
        if (game == "wwar" || game == "vl" || game == "zl" || game == "rl") {
            var ProfileName = document.getElementsByClassName("profileRight")[0].getElementsByTagName("b")[0].innerHTML;
            var ReattackPUIDAndName = String(location).split("=")[1].split("&")[0] + " - " + ProfileName;
            TemporaryReattackPUIDArray.push(ReattackPUIDAndName);
            GM_SuperValue.set("ReattackPUIDArray", TemporaryReattackPUIDArray);
            CreateOptionsReattackPUID(true);
            ReattackClearButton.disabled = false;
            ReattackClearAllButton.disabled = false;
            ReattackAddButton.disabled = true;
        } else {
            var ProfileName = document.getElementsByClassName("profileHeader")[0].getElementsByTagName("span")[0].innerHTML;
            var ReattackPUIDAndName = String(location).split("=")[1].split("&")[0] + " - " + ProfileName;
            TemporaryReattackPUIDArray.push(ReattackPUIDAndName);
            GM_SuperValue.set("ReattackPUIDArray", TemporaryReattackPUIDArray);
            CreateOptionsReattackPUID(true);
            ReattackClearButton.disabled = false;
            ReattackClearAllButton.disabled = false;
            ReattackAddButton.disabled = true;
        }
    } else {
        if (game == "wwar" || game == "vl" || game == "zl" || game == "rl") {
            var ProfileName = document.getElementsByClassName("profileRight")[0].getElementsByTagName("b")[0].innerHTML;
            var ReattackPUIDAndName = String(location).split("=")[1].split("&")[0] + " - " + ProfileName;
            TemporaryReattackPUIDArray.push(ReattackPUIDAndName);
            GM_SuperValue.set("ReattackPUIDArray", TemporaryReattackPUIDArray);
            CreateOptionsReattackPUID(true);
            ReattackClearButton.disabled = false;
            ReattackClearAllButton.disabled = false;
            ReattackAddButton.disabled = true;
        } else {
            var ProfileName = document.getElementsByClassName("profileHeader")[0].getElementsByTagName("span")[0].innerHTML;
            var ReattackPUIDAndName = String(location).split("=")[1].split("&")[0] + " - " + ProfileName;
            TemporaryReattackPUIDArray.push(ReattackPUIDAndName);
            GM_SuperValue.set("ReattackPUIDArray", TemporaryReattackPUIDArray);
            CreateOptionsReattackPUID(true);
            ReattackClearButton.disabled = false;
            ReattackClearAllButton.disabled = false;
            ReattackAddButton.disabled = true;
        }
    }
}

function ClearReattackPUID(all) {
    if (all) {
        var Confirmed = confirm("Press OK to clear the whole path.");
        if (Confirmed) {
            ReattackPUIDSelectBox.innerHTML = "";
            GM_SuperValue.set("ReattackPUIDArray", []);
            GM_setValue("ClearedReattackPUID", true);
            ReattackClearButton.disabled = true;
            ReattackClearAllButton.disabled = true;
            if (ReattackPUIDSetTextbox.value != "") ReattackPUIDSetButton.disabled = false;
        }
    } else {
        var Confirmed = confirm("Press OK to clear the selected path part.");
        if (Confirmed) {
            var SelectedReattackPUID = ReattackPUIDSelectBox.options[ReattackPUIDSelectBox.selectedIndex].text;
            var ReattackPUIDToRemove = TemporaryReattackPUIDArray.indexOf(SelectedReattackPUID);
            TemporaryReattackPUIDArray.splice(ReattackPUIDToRemove, 1);
            GM_SuperValue.set("ReattackPUIDArray", TemporaryReattackPUIDArray);
            DeleteOptionsReattackPUID();
            if (TemporaryReattackPUIDArray == "") {
                ReattackClearButton.disabled = true;
                ReattackClearAllButton.disabled = true;
            }
        }
    }
    ReattackAddButton.disabled = false;
    if (page == "profile") CheckOptionsReattackPUID();
    if (page != "profile") ReattackAddButton.disabled = true;
    GM_setValue("ReattackPUIDSelected", ReattackPUIDSelectBox.value);
}

function CreateOptionsReattackPUID(FirstTime) {
    if (game == "wwar" || game == "vl" || game == "zl" || game == "rl") {
        ReattackPUIDSelectBox.innerHTML = "";
        for (var i = 0; i < TemporaryReattackPUIDArray.length; i++) {
            var option = document.createElement("option");
            option.innerHTML = TemporaryReattackPUIDArray[i];
            option.value = TemporaryReattackPUIDArray[i];
            ReattackPUIDSelectBox.appendChild(option);
        }
        if (FirstTime) {
            var ProfileName = document.getElementsByClassName("profileRight")[0].getElementsByTagName("b")[0].innerHTML;
            var CreatedReattackPUID = String(location).split("=")[1].split("&")[0] + " - " + ProfileName;
            SetSelect("ReattackPUIDSelectBox", CreatedReattackPUID);
            GM_setValue("ReattackPUIDSelected", CreatedReattackPUID);
        }
    } else {
        ReattackPUIDSelectBox.innerHTML = "";
        for (var i = 0; i < TemporaryReattackPUIDArray.length; i++) {
            var option = document.createElement("option");
            option.innerHTML = TemporaryReattackPUIDArray[i];
            option.value = TemporaryReattackPUIDArray[i];
            ReattackPUIDSelectBox.appendChild(option);
        }
        if (FirstTime) {
            var ProfileName = document.getElementsByClassName("profileHeader")[0].getElementsByTagName("span")[0].innerHTML;
            var CreatedReattackPUID = String(location).split("=")[1].split("&")[0] + " - " + ProfileName;
            SetSelect("ReattackPUIDSelectBox", CreatedReattackPUID);
            GM_setValue("ReattackPUIDSelected", CreatedReattackPUID);
        }
    }
}

function DeleteOptionsReattackPUID() {
    var SelectedReattackPUID = ReattackPUIDSelectBox.options[ReattackPUIDSelectBox.selectedIndex].text;
    var options = ReattackPUIDSelectBox.getElementsByTagName("option");
    for (var i = 0; i < options.length; i++) {
        if (options[i].value == SelectedReattackPUID) {
            OptionSelected = options[i];
            OptionSelected.parentNode.removeChild(OptionSelected);
        }
    }
}

function CheckOptionsReattackPUID() {
    if (game == "wwar" || game == "vl" || game == "zl" || game == "rl") {
        var options = ReattackPUIDSelectBox.getElementsByTagName("option");
        for (i = 0; i < options.length; i++) {
            UnallowedOptions = options[i].innerHTML;
            var ProfileName = document.getElementsByClassName("profileRight")[0].getElementsByTagName("b")[0].innerHTML;
            if (String(location).split("=")[1].split("&")[0] + " - " + ProfileName == UnallowedOptions) {
                ReattackAddButton.disabled = true;
            }
        }
    } else {
        var options = ReattackPUIDSelectBox.getElementsByTagName("option");
        for (i = 0; i < options.length; i++) {
            UnallowedOptions = options[i].innerHTML;
            var ProfileName = document.getElementsByClassName("profileHeader")[0].getElementsByTagName("span")[0].innerHTML;
            if (String(location).split("=")[1].split("&")[0] + " - " + ProfileName == UnallowedOptions) {
                ReattackAddButton.disabled = true;
            }
        }
    }
}

if (PathAttack && TemporaryReattackPUIDArray != "" && CurrentAmmo > 0 && !GM_getValue('SwitchingAccountsAttack', false)) Reattack();
if (PathAttack && TemporaryReattackPUIDArray != "" && CurrentAmmo == 0 && SwitchAccountsAttack && TemporaryAccountArray != "") ReattackSwitch();
if (GM_getValue("SwitchingAccountsAttack", false) && page == "home") {
    setTimeout(function() {
        document.location = AllianceLink;
    }, 1000);
    GM_setValue("SwitchingAccountsAttack", false);
}

function ReattackSwitch() {
    var SelectedAccount = AccountSelectBox.value;
    var AccountToOpen = TemporaryAccountArray.indexOf(SelectedAccount) + 1;
    if (AccountToOpen == TemporaryAccountArray.length) {
        GM_setValue("AccountSelected", TemporaryAccountArray[0]);
        document.location = TemporaryAccountArray2[0];
    } else {
        GM_setValue("AccountSelected", TemporaryAccountArray[AccountToOpen]);
        document.location = TemporaryAccountArray2[AccountToOpen];
    }
    GM_setValue('SwitchingAccountsAttack', true);
}

function Reattack() {
    if (page != "hitlist" && page != "home") {
        if (CurrentHealth < 27) {
            if (page != "hospital") document.location = HospitalLink;
            else {
                setTimeout(function() { 
                    document.location = document.getElementsByClassName('tac healBtn')[0].getElementsByTagName('a')[0].href;
                }, PathAttackDelayTime);
            }
        }
        if (page == "hospital" && CurrentHealth > 26) document.location = AllianceLink;
        if (page == "group_member" && ReattackMethod == "Alliance") {
            SetSelect("ReattackPUIDSelectBox", ReattackPUIDArray[0]);
            GM_setValue("ReattackPUIDSelected", ReattackPUIDArray[0]);
            var allies = document.getElementsByClassName("nameColumn");
            var NumberOfAllies = allies.length;
            var LoopNumber = 0;
            for (var i = 0; i < NumberOfAllies; i++) {
                var LinkPUID = allies[i].getElementsByTagName("a")[0].href.split("=")[1].split("&")[0];
                if (LinkPUID == parseInt(ReattackPUIDArray[0])) {
                    var target = allies[i].getElementsByTagName("a")[0];
                    click(target);
                    break;
                }
                LoopNumber++;
                if (LoopNumber == NumberOfAllies) {
                    var NextLink = document.getElementsByTagName("a");
                    for (var i = 0; i < NextLink.length; i++) {
                        if (NextLink[i].innerHTML == "Next 100") click(NextLink[i]);
                    }
                }
            }
        }
        if (page == "group" && ReattackMethod == "Pending") {
            SetSelect("ReattackPUIDSelectBox", ReattackPUIDArray[0]);
            GM_setValue("ReattackPUIDSelected", ReattackPUIDArray[0]);
            var invite = document.getElementsByClassName("mobInviter");
            for (var i = 0; i < invite.length; i++) {
                var link = invite[i].getElementsByClassName("mobInviterInner");
                var LinkPUID = link[0].getElementsByTagName("a")[0].href.split("=")[1].split("&")[0];
                if (LinkPUID == parseInt(ReattackPUIDArray[0])) {
                    var invitee = link[0].getElementsByTagName("a")[0];
                    click(invitee);
                }
            }
        }
        var PathLength = ReattackPUIDArray.length;
        var CurrentReattackPUID = ReattackPUIDArray[ReattackPUIDSelectBox.selectedIndex];
        var NextReattackPUIDIndex = ReattackPUIDSelectBox.selectedIndex + 1;
        var NextReattackPUID = "";
        if (PathLength - 1 >= NextReattackPUIDIndex) NextReattackPUID = ReattackPUIDArray[NextReattackPUIDIndex];
        if (PathLength > 1 && NextReattackPUID != "") {
            if (page == "profile" && String(location).split("=")[1].split("&")[0] == parseInt(CurrentReattackPUID) && String(location).indexOf("comment") == -1) {
                document.location = document.getElementById("sectionTabs").getElementsByTagName("a")[1].href;
            }
            if (page == "profile" && String(location).split("=")[1].split("&")[0] == parseInt(CurrentReattackPUID) && String(location).indexOf("comment") != -1) {
                var links = document.links;
                var WasFound = false;
                for (var i = 0; i < links.length; i++) {
                    if (links[i].href.indexOf(parseInt(NextReattackPUID)) != -1) {
                        var linkHold = links[i];
                        SetSelect("ReattackPUIDSelectBox", ReattackPUIDArray[NextReattackPUIDIndex]);
                        GM_setValue("ReattackPUIDSelected", ReattackPUIDArray[NextReattackPUIDIndex]);
                        WasFound = true;
                        setTimeout(function() { 
                            click(linkHold);
                        }, PathAttackDelayTime);
                        break;
                    }
                }
                if (!WasFound) {
                    for (i = links.length - 1; i >= 0; i--) {
                        var test = links[i].innerHTML;
                        if (test.indexOf("Next") == 0) {
                            var linkHold = links[i];
                            setTimeout(function() { 
                                document.location = linkHold;
                            }, PathAttackDelayTime);
                            break;
                        }
                    }
                }
            }
        } else {
            if (page == "profile" && String(location).split("=")[1].split("&")[0] == parseInt(CurrentReattackPUID)) {
                var ProfileAttack = GetButtonByValue("Attack");
                if (game == "rl") ProfileAttack = GetButtonByValue("Race");
                click(ProfileAttack);
            }
            if (page == "fight" && String(location).split("=")[2].split("&")[0] == parseInt(CurrentReattackPUID)) {
                var attack = GetButtonByValue("Attack Again");
                if (game == "rl") attack = GetButtonByValue("Race Again");
                click(attack);
            }
        }
        var FightResult = document.getElementById("fightResult");
        if (FightResult) {
            if (document.getElementById("fightResult").innerHTML.indexOf("cannot") != -1) {
                if (GM_getValue("PathAttackRechecked", false)) {
                    GM_setValue("PathAttackRechecked", false);
                    ReattackSwitch();
                } else {
                    GM_setValue("PathAttackRechecked", true);
                    setTimeout(function() {
                        document.location = AllianceLink;
                    }, PathAttackDelayTime);
                }
            }
        }
    }
}

//Auto Attack
if (AutoAttack) {
    if (page == "fight" && CurrentHealth > 26) {
        if (document.getElementById("fightResult").innerHTML.indexOf("cannot") == -1) {
            var elementBtnMed = document.getElementsByClassName('btnMed')[2];
            var won = document.getElementsByClassName("lostFight").length;
            if (!WinsOnlyAttack && won && elementBtnMed != null) {
                var AttackURL = elementBtnMed.getAttribute("onclick").split("href='/")[1].split("';")[0];
                AttackURL = "http://" + game + ".storm8.com/" + AttackURL;
                document.location = AttackURL;
            }
            if (WinsOnlyAttack && won) {
                return;
            }
            if (elementBtnMed != null) {
                var AttackURL = elementBtnMed.getAttribute("onclick").split("href='/")[1].split("';")[0];
                AttackURL = "http://" + game + ".storm8.com/" + AttackURL;
                document.location = AttackURL;
            }
        }
        else if (AttackReload && document.getElementById("fightResult").innerHTML.indexOf("process") == -1) {
            setTimeout(function() {
                document.location.reload();
            }, RandomFromInterval(1500, 3000));
        }
            } else if (page == "fight" && CurrentHealth <= 26) {
                GM_setValue("AttackNeedToHeal",1);
                document.location = HospitalLink;
            } else if (page == "hospital" && CurrentHealth <= 26 && GM_getValue("AttackNeedToHeal",0) == 1) {
                GM_setValue("AttackNeedToHeal",2);
                document.location = document.getElementsByClassName("tac healBtn")[0].getElementsByTagName("a")[0].href;
            } else if (page == "hospital" && CurrentHealth > 26 && GM_getValue("AttackNeedToHeal",0) == 2) {
                GM_setValue("AttackNeedToHeal",0);
                window.history.go(-3);
            }
                }

//Missions
if (game == "zl") {
    MissionCategory += 4;
    MissionStartCategory += 4;
}
if (game == "vl") {
    MissionCategory += 10;
    MissionStartCategory += 10;
}
if (game == "zl" || game == "kl" || game == "rol") {
    document.getElementById("MissionTypeSelectBox").disabled = true;
    GM_setValue("MissionType", "specific");
}

if (page == "missions" && AutoMission) {
    var energy = document.getElementById("energyCurrent").innerHTML;
    if (MissionQuestion == 708 || MissionQuestion == 4316) {
        var MissionTable = document.getElementsByClassName("missionTable")[2];
        var EnergyNeeded = MissionTable.getElementsByClassName("requiredEnergy")[0].innerHTML;
        if (energy == EnergyNeeded) {
            click(document.getElementsByClassName("actionButton")[2]);
            GM_setValue("mission" + game, 0);
            return;
        } else {
            var time = RandomFromInterval(600000, 900000);
            setTimeout(function() {location.reload();}, time);
            return;
        }
    }
    if (MissionQuestion == 759 || MissionQuestion == 8810 || MissionQuestion == 617 || MissionQuestion == 738) {
        var MissionTable = document.getElementsByClassName("missionTable")[3];
        var EnergyNeeded = MissionTable.getElementsByClassName("requiredEnergy")[0].innerHTML;
        if (energy == EnergyNeeded) {
            click(document.getElementsByClassName("actionButton")[3]);
            GM_setValue("mission" + game, 0);
            return;
        } else {
            var time = RandomFromInterval(600000, 900000);
            setTimeout(function() {location.reload();}, time);
            return;
        }
    }
    if (MissionQuestion == 829 || MissionQuestion == 102) {
        var MissionTable = document.getElementsByClassName("missionTable")[5];
        var EnergyNeeded = MissionTable.getElementsByClassName("requiredEnergy")[0].innerHTML;
        if (energy == EnergyNeeded) {
            click(document.getElementsByClassName("actionButton")[5]);
            GM_setValue("mission" + game, 0);
            return;
        } else {
            var time = RandomFromInterval(600000, 900000);
            setTimeout(function() {location.reload();}, time);
            return;
        }
    }
    if (MissionQuestion == 9010 || MissionQuestion == 9310 || MissionQuestion == 4516) {
        var MissionTable = document.getElementsByClassName("missionTable")[9];
        var EnergyNeeded = MissionTable.getElementsByClassName("requiredEnergy")[0].innerHTML;
        if (energy == EnergyNeeded) {
            click(document.getElementsByClassName("actionButton")[9]);
            GM_setValue("mission" + game, 0);
            return;
        } else {
            var time = RandomFromInterval(600000, 900000);
            setTimeout(function() {location.reload();}, time);
            return;
        }
    }
    if (MissionQuestion == 9510 || MissionQuestion == 153 || MissionQuestion == 1012 || MissionQuestion == 6914) {
        var MissionTable = document.getElementsByClassName("missionTable")[7];
        var EnergyNeeded = MissionTable.getElementsByClassName("requiredEnergy")[0].innerHTML;
        if (energy == EnergyNeeded) {
            click(document.getElementsByClassName("actionButton")[7]);
            GM_setValue("mission" + game, 0);
            return;
        } else {
            var time = RandomFromInterval(600000, 900000);
            setTimeout(function() {location.reload();}, time);
            return;
        }
    }
    if (MissionQuestion == 486 || MissionQuestion == 6714 || MissionQuestion == 2616) {
        var MissionTable = document.getElementsByClassName("missionTable")[4];
        var EnergyNeeded = MissionTable.getElementsByClassName("requiredEnergy")[0].innerHTML;
        if (energy == EnergyNeeded) {
            click(document.getElementsByClassName("actionButton")[4]);
            GM_setValue("mission" + game, 0);
            return;
        } else {
            var time = RandomFromInterval(600000, 900000);
            setTimeout(function() {location.reload();}, time);
            return;
        }
    }
    if (MissionQuestion == 768949) {
        var MissionTable = document.getElementsByClassName("missionTable")[11];
        var EnergyNeeded = MissionTable.getElementsByClassName("requiredEnergy")[0].innerHTML;
        if (energy == EnergyNeeded) {
            click(document.getElementsByClassName("actionButton")[11]);
            GM_setValue("mission" + game, 0);
            return;
        } else {
            var time = RandomFromInterval(600000, 900000);
            setTimeout(function() {location.reload();}, time);
            return;
        }
    }
    if (MissionQuestion == 889) {
        var MissionTable = document.getElementsByClassName("missionTable")[0];
        var EnergyNeeded = MissionTable.getElementsByClassName("requiredEnergy")[0].innerHTML;
        if (energy == EnergyNeeded) {
            click(document.getElementsByClassName("actionButton")[0]);
            GM_setValue("mission" + game, 0);
            return;
        } else {
            var time = RandomFromInterval(600000, 900000);
            setTimeout(function() {location.reload();}, time);
            return;
        }
    }
    if (MissionQuestion == 1714) {
        var MissionTable = document.getElementsByClassName("missionTable")[8];
        var EnergyNeeded = MissionTable.getElementsByClassName("requiredEnergy")[0].innerHTML;
        if (energy == EnergyNeeded) {
            click(document.getElementsByClassName("actionButton")[8]);
            GM_setValue("mission" + game, 0);
            return;
        } else {
            var time = RandomFromInterval(600000, 900000);
            setTimeout(function() {location.reload();}, time);
            return;
        }
    }
    var mission = document.getElementsByClassName("boxedItem");
    for (var i = 0; i < mission.length; i++) {
        var failed = document.getElementsByClassName("fail").length;
        var HTMLDump = document.getElementsByTagName("body")[0].innerHTML;
        if (failed && (HTMLDump.indexOf("to complete the mission") != -1 || HTMLDump.indexOf("Buy the cars/parts for"))) {
            var BuyUnits = document.getElementsByClassName("btnMed btnDoAgain")[0];
            if (BuyUnits) {
                click(BuyUnits);
                return;
            }
            if (!BuyUnits) {
                var category = String(location).split("cat=")[1].split("&")[0];
                var job = String(location).split("jid=")[1].split("&")[0];
                if (job == "16" && category == "3" && game == "wwar") {
                    click(document.getElementsByClassName("actionButton")[0]);
                    return;
                }
                if (job == "20" && category == "4" && game == "wwar") {
                    click(document.getElementsByClassName("actionButton")[2]);
                    return;
                }
                if (job == "104" && category == "5" && game == "wwar") {
                    click(document.getElementsByClassName("actionButton")[1]);
                    return;
                }
                if (job == "70" && category == "8" && game == "wwar") {
                    document.location = "http://wwar.storm8.com/missions.php?cat=6";
                    GM_setValue("mission" + game, 708);
                    return;
                }
                if (job == "75" && category == "9" && game == "wwar") {
                    document.location = "http://wwar.storm8.com/missions.php?cat=7";
                    GM_setValue("mission" + game, 759);
                    return;
                }
                if (job == "82" && category == "9" && game == "wwar") {
                    document.location = "http://wwar.storm8.com/missions.php?cat=6";
                    GM_setValue("mission" + game, 829);
                    return;
                }
                if (job == "88" && category == "10" && game == "wwar") {
                    document.location = "http://wwar.storm8.com/missions.php?cat=8";
                    GM_setValue("mission" + game, 8810);
                    return;
                }
                if (job == "90" && category == "10" && game == "wwar") {
                    document.location = "http://wwar.storm8.com/missions.php?cat=8";
                    GM_setValue("mission" + game, 9010);
                    return;
                }
                if (job == "93" && category == "10" && game == "wwar") {
                    document.location = "http://wwar.storm8.com/missions.php?cat=9";
                    GM_setValue("mission" + game, 9310);
                    return;
                }
                if (job == "95" && category == "10" && game == "wwar") {
                    document.location = "http://wwar.storm8.com/missions.php?cat=6";
                    GM_setValue("mission" + game, 9510);
                    return;
                }
                if (job == "10" && category == "2" && game == "im") {
                    document.location = "http://im.storm8.com/missions.php?cat=1";
                    GM_setValue("mission" + game, 102);
                    return;
                }
                if (job == "13" && category == "2" && game == "im") {
                    click(document.getElementsByClassName("actionButton")[3]);
                    return;
                }
                if (job == "15" && category == "3" && game == "im") {
                    document.location = "http://im.storm8.com/missions.php?cat=2";
                    GM_setValue("mission" + game, 153);
                    return;
                }
                if (job == "48" && category == "6" && game == "im") {
                    document.location = "http://im.storm8.com/missions.php?cat=5";
                    GM_setValue("mission" + game, 486);
                    return;
                }
                if (job == "61" && category == "7" && game == "im") {
                    document.location = "http://im.storm8.com/missions.php?cat=6";
                    GM_setValue("mission" + game, 617);
                    return;
                }
                if (job == "73" && category == "8" && game == "im") {
                    document.location = "http://im.storm8.com/missions.php?cat=7";
                    GM_setValue("mission" + game, 738);
                    return;
                }
                if (((job == "76" && category == "8") || (job == "94" && category == "9")) && game == "im") {
                    document.location = "http://im.storm8.com/missions.php?cat=7";
                    GM_setValue("mission" + game, 768949);
                    return;
                }
                if (job == "88" && category == "9" && game == "im") {
                    document.location = "http://im.storm8.com/missions.php?cat=4";
                    GM_setValue("mission" + game, 889);
                    return;
                }
                if (job == "61" && category == "11" && game == "vl") {
                    click(document.getElementsByClassName("actionButton")[2]);
                    return;
                }
                if (job == "6" && category == "11" && game == "vl") {
                    click(document.getElementsByClassName("actionButton")[3]);
                    return;
                }
                if (job == "10" && category == "12" && game == "vl") {
                    document.location = "http://vl.storm8.com/missions.php?cat=11";
                    GM_setValue("mission" + game, 1012);
                    return;
                }
                if (job == "11" && category == "12" && game == "vl") {
                    click(document.getElementsByClassName("actionButton")[0]);
                    return;
                }
                if (job == "13" && category == "13" && game == "vl") {
                    click(document.getElementsByClassName("actionButton")[1]);
                    return;
                }
                if (job == "67" && category == "14" && game == "vl") {
                    document.location = "http://vl.storm8.com/missions.php?cat=13";
                    GM_setValue("mission" + game, 6714);
                    return;
                }
                if (job == "69" && category == "14" && game == "vl") {
                    document.location = "http://vl.storm8.com/missions.php?cat=13";
                    GM_setValue("mission" + game, 6914);
                    return;
                }
                if (job == "17" && category == "14" && game == "vl") {
                    document.location = "http://vl.storm8.com/missions.php?cat=13";
                    GM_setValue("mission" + game, 1714);
                    return;
                }
                if (job == "71" && category == "14" && game == "vl") {
                    click(document.getElementsByClassName("actionButton")[7]);
                    return;
                }
                if (job == "43" && category == "16" && game == "vl") {
                    document.location = "http://vl.storm8.com/missions.php?cat=14";
                    GM_setValue("mission" + game, 4316);
                    return;
                }
                if (job == "26" && category == "16" && game == "vl") {
                    document.location = "http://vl.storm8.com/missions.php?cat=15";
                    GM_setValue("mission" + game, 2616);
                    return;
                }
                if (job == "45" && category == "16" && game == "vl") {
                    document.location = "http://vl.storm8.com/missions.php?cat=15";
                    GM_setValue("mission" + game, 4516);
                    return;
                }
                if (job == "92" && category == "17" && game == "vl") {
                    click(document.getElementsByClassName("actionButton")[4]);
                    return;
                }
                if (job == "114" && category == "19" && game == "vl") {
                    click(document.getElementsByClassName("actionButton")[4]);
                    return;
                } else {
                    if (parseInt(job) > 0 && parseInt(category) > 0 && HTMLDump.indexOf("Refill") == -1) {
                        alert("You are missing a loot item and it has not been coded to go collect it automatically.");
                        return;
                    } else {
                        var time = RandomFromInterval(600000, 900000);
                        setTimeout(function() {
                            document.location= "http://" + game + ".storm8.com/missions.php?cat=" + category;
                        }, time);
                        return;
                    }
                }
            }
        }
        if ((String(location).indexOf("cat=") == -1 && String(location).indexOf("jid=") == -1) || (String(location).indexOf("buyMissingItems") != -1 && String(location).indexOf("cat=") == -1) || HTMLDump.indexOf("mastery for this category") != -1) {
            var tab = document.getElementsByClassName("selected")[0];
            if (tab) {
                var TabLink = tab.getElementsByTagName("a")[0];
                click(TabLink);
                return;
            } else {
                document.location = "http://" + game + ".storm8.com/missions.php?cat=" + MissionStartCategory;
                return;
            }
        }
        if ((String(location).indexOf("cat=") != -1 && parseInt(String(location).split("cat=")[1].split("&")[0]) > 25)) {
            document.location = "http://" + game + ".storm8.com/missions.php?cat=" + MissionStartCategory;
            return;
        }
        var MissionPart = mission[i].getElementsByClassName("missionTable")[0];
        var EnergyNeeded = parseInt(MissionPart.getElementsByClassName("requiredEnergy")[0].innerHTML);
        var DoIt = MissionPart.getElementsByClassName("actionButton")[0];
        if (game != "zl" && game != "kl" && game != "rol") {
            var PercentDone = MissionPart.getElementsByClassName("masteryBarProgress")[0].innerHTML.split("%")[0];
            if (MissionType == "best") {
                if (PercentDone != "100" && parseInt(energy) >= EnergyNeeded) {
                    click(DoIt);
                    return;
                }
                if (PercentDone != "100" && parseInt(energy) < EnergyNeeded && (i + 1) == mission.length) {
                    var category = String(location).split("cat=")[1].split("&")[0];
                    var time = RandomFromInterval(600000, 900000);
                    setTimeout(function() {
                        document.location = "http://" + game + ".storm8.com/missions.php?cat=" + category;
                    }, time);
                    return;
                }
                var BodyDump = document.getElementsByTagName("body")[0].innerHTML;
                var NoTags = BodyDump.replace(/(<([^>]+)>)/ig,"");
                var mastered = NoTags.match(/100%.Rank/g);
                if(mastered) {
                    if (mastered.length == mission.length) SwitchMission();
                }
            }
        }
        if (MissionType == "specific") {
            var category = String(parseInt(location.href.split("cat=")[1].split("&")[0]));
            if (category == MissionCategory) {
                var MissionIndex = MissionNumber - 1;
                var MissionPart = mission[MissionIndex].getElementsByClassName("missionTable")[0];
                var EnergyNeeded = parseInt(MissionPart.getElementsByClassName("requiredEnergy")[0].innerHTML);
                var DoIt = MissionPart.getElementsByClassName("actionButton")[0];
                if (parseInt(energy) >= EnergyNeeded) {
                    click(DoIt);
                    return;
                }
                if (parseInt(energy) < EnergyNeeded) {
                    var time = RandomFromInterval(600000, 900000);
                    setTimeout(function() {
                        document.location= "http://" + game + ".storm8.com/missions.php?cat=" + category;
                    }, time);
                    return;
                }
            }
        }
    }
}

function SwitchMission() {
    var category = parseInt(String(location).split("cat=")[1].split("&")[0]);
    var BodyDump = document.getElementsByTagName("body")[0].innerHTML;
    if (BodyDump.indexOf("cat=" + category) == -1) {
        document.location = HomeLink;
    }
    var NextCategory = category + 1;
    document.location = "http://" + game + ".storm8.com/missions.php?cat=" + NextCategory;
}

//Kill
if (page == "hitlist" && HitlistKill) AttackHitlist(WinsOnlyKill);

if (GM_getValue("heal", false)) {
    if (page == "hitlist" && CurrentHealth <= 26) {
        document.location = HospitalLink;
        return;
    } else if (page == "hospital" && CurrentHealth <= 26) {
        document.location = document.getElementsByClassName("tac healBtn")[0].getElementsByTagName("a")[0].href;
    } else if (page == "hospital" && CurrentHealth > 26) {
        document.location = HitlistLink;
        GM_setValue("heal", false);
    }
        }

function AttackHitlist(WinsOnly) {
    if (CurrentHealth <= 26) {
        GM_setValue("heal", true);
        return;
    }
    if (CurrentAmmo == 0) {
        var delay = Math.random() * 5;
        var time = document.getElementById("staminaType").innerHTML.split(":");
        var seconds = parseInt(time[0]) * 60 + parseInt(time[1]) + delay;
        HitlistKillAmmo = Math.max(1, HitlistKillAmmo);
        seconds = seconds + 100 * (HitlistKillAmmo - 1);
        setTimeout(function() {
            document.location = HitlistLink;
        }, Math.floor(1000 * seconds));
        return;
    }
    if (!WinsOnly) {
        var won = document.getElementsByClassName("lostFight").length;
        var alive = document.getElementsByClassName("doAgainTxt");
        if (won && alive.length > 0) {
            var next = alive[0].getElementsByTagName("input")[0];
            click(next);
            return;
        }
    }
    var levelRange = HitlistKillLevel.split("-");
    levelRange[0] = parseInt(levelRange[0]);
    levelRange[1] = parseInt(levelRange[1]);
    if (levelRange[1] < levelRange[0]) {
        var holder = levelRange[0];
        levelRange[0] = levelRange[1];
        levelRange[1] = holder;
        GM_setValue("HitlistKillLevel", levelRange[0] + "-" + levelRange[1]);
    }
    HitlistKillLevel = levelRange;
    var people = document.getElementsByClassName("fightTable");
    var found = false;
    for (i = 0; i < people.length; i++) {
        var fields = people[i].getElementsByTagName("td");
        if (game == "wwar" || game == "vl" || game == "zl" || game == "rl") {
            var level = parseInt(fields[1].getElementsByTagName("div")[1].innerHTML.substr(6));
            if (game == "wwar") {
                var TargetCountry = fields[0].getElementsByTagName("img")[0].src.split("/")[6].substr(0, 1);
                if (level <= HitlistKillLevel[1] && level >= HitlistKillLevel[0] && country != TargetCountry) {
                    var link = fields[5].getElementsByTagName("a")[0];
                    click(link);
                    found = true;
                    break;
                }
            }
            if (game == "vl" || game == "zl") {
                var level = parseInt(fields[1].getElementsByTagName("div")[1].innerHTML.substr(4));
                if (level <= HitlistKillLevel[1] && level >= HitlistKillLevel[0]) {
                    var link = fields[5].getElementsByTagName("a")[0];
                    click(link);
                    found = true;
                    break;
                }
            }
            if (game == "rl") {
                if (level <= HitlistKillLevel[1] && level >= HitlistKillLevel[0]) {
                    var link = fields[5].getElementsByTagName("a")[0];
                    click(link);
                    found = true;
                    break;
                }
            }
        } else {
            var level = parseInt(fields[0].getElementsByTagName("div")[1].innerHTML.substr(6));
            if (level <= HitlistKillLevel[1] && level >= HitlistKillLevel[0]) {
                var link = fields[4].getElementsByTagName("a")[0];
                click(link);
                found = true;
                break;
            }
        }
    }
    if (!found) setTimeout(function() {
        document.location = HitlistLink;
    }, RandomFromInterval(250, 1000));
}

//Random Sanction
if (page == "profile" && RandomSanction && RandomSanctionNumber > 0) {
    if (RandomSanctionMethod == "fight" || (RandomSanctionMethod == "list" && GM_getValue("RandomSanctionReady", false))) {
        GM_setValue("RandomSanctionReady", false);
        var buttons = document.getElementsByClassName("buttonHolder")[0].getElementsByTagName("input");
        click(buttons[buttons.length - 1]);
    }
    if (RandomSanctionMethod == "list" && GM_getValue("RandomSanctionQuestion", false)) {
        var links = document.getElementsByTagName("a");
        if (links) {
            var j = 0;
            for (var i = 0; i < links.length; i++) {
                var ProfileLink = links[i].href.indexOf("puid");
                var chance =RandomFromInterval(0,5);
                var NewsItem = document.getElementsByClassName("newsFeedItem");
                if (ProfileLink != -1) {
                    j++;
                    if (chance == 5) {
                        GM_setValue("RandomSanctionQuestion", false);
                        GM_setValue("RandomSanctionReady", true);
                        click(links[i]);
                    }
                }
                if (j == NewsItem.length) {
                    GM_setValue("RandomSanctionQuestion", false);
                    document.location = HitlistLink;
                }
            }
        } else {
            GM_setValue("RandomSanctionQuestion", false);
            document.location = HitlistLink;
        }
    }
    if (RandomSanctionMethod == "list" && GM_getValue("RandomSanctionHitlist", false)) {
        var CommentsTab = document.getElementById("sectionTabs").getElementsByTagName("a")[1].href;
        GM_setValue("RandomSanctionHitlist", false);
        GM_setValue("RandomSanctionQuestion", true);
        document.location = CommentsTab;
    }
}

if (page == "bounty" && RandomSanction && RandomSanctionNumber > 0) {
    var failed = document.getElementsByClassName("messageBoxFail")[0];
    if (failed) {
        var FailedReason = failed.innerHTML;
        if (FailedReason.indexOf("too many people") != -1) {
            GM_setValue("RandomSanctionOff", true);
            document.location = HomeLink;
        } else {
            if (RandomSanctionMethod == "fight") document.location = FightLink;
            if (RandomSanctionMethod == "list") document.location = HitlistLink;
        }
    }
    var form = document.getElementById("bountyForm");
    if (game == "im" || game == "rl") {
        var MinimumBounty = parseInt(form.getElementsByTagName("span")[0].innerHTML.replace(/,/g, "").replace(/[$]/g, ""));
    }
    else var MinimumBounty = parseInt(form.getElementsByTagName("span")[0].childNodes[1].nodeValue.replace(/,/g,""));
    form.getElementsByTagName("input")[0].value = MinimumBounty;
    if (!failed) {
        click(document.getElementById("bountyForm").getElementsByClassName("btnBroadcast")[0]);
        GM_setValue("RandomSanctionGo", true);
    }
}

if (page == "hitlist" && RandomSanction && GM_getValue("RandomSanctionGo", false)) {
    GM_setValue("RandomSanctionNumber", RandomSanctionNumber - 1);
    GM_setValue("RandomSanctionGo", false);
    if (RandomSanctionMethod == "fight") document.location = FightLink;
    if (RandomSanctionMethod == "list") document.location = HitlistLink;
}

if (page == "home" && GM_getValue("RandomSanctionOff", false)) {
    GM_setValue("RandomSanctionOff", false);
    GM_setValue("RandomSanction", false);
    document.getElementById("RandomSanctionCheckbox").checked = false;
}

if (((page == "fight" && RandomSanctionMethod == "fight") || (page == "hitlist" && RandomSanctionMethod == "list")) && RandomSanction && RandomSanctionNumber > 0 && !GM_getValue("heal", false)) {
    var links = document.getElementsByTagName("a");
    if (links) {
        var j = 0;
        for (var i = 0; i < links.length; i++) {
            var ProfileLink = links[i].href.indexOf("puid");
            var chance =RandomFromInterval(0,5);
            var FightTable = document.getElementsByClassName("fightTable");
            if (ProfileLink != -1) {
                j++;
                if (chance == 5) {
                    if (RandomSanctionMethod == "list") GM_setValue("RandomSanctionHitlist", true);
                    click(links[i]);
                }
            }
            if (j > 9) location.reload();
            if (j == FightTable.length) setTimeout(function() { 
                location.reload();
            }, RandomFromInterval(1000,2500));
        }
    } else setTimeout(function() { 
        location.reload();
    }, RandomFromInterval(1000,2500));
}

//Hitlist
if (SanctionNumber == 0 && GM_getValue("ResanctionTarget", false)) {
    GM_setValue("ResanctionTarget", false);
    document.location = HomeLink;
}

if (GM_getValue("ResanctionTarget", false) && sanction && SanctionNumber > 0) {
    if (page == "hitlist") {
        document.location = HomeLink;
    }
    if (page == "home") {
        setTimeout(HitlistHome, 2000);
    }
    if (page == "profile") {
        var buttons = document.getElementsByClassName("buttonHolder")[0].getElementsByTagName("input");
        click(buttons[buttons.length - 1]);
    }
}

function HitlistHome() {
    var links = document.getElementsByTagName("a");
    var found = false;
    for (i = 0; i < links.length; i++) {
        if (links[i].innerHTML == GM_getValue("ResanctionTarget", false)) {
            found = true;
            break;
        }
    }
    if (GM_getValue("RecheckSanctionHome", false) && !found) {
        GM_setValue("ResanctionTarget", false);
        GM_setValue("RecheckSanctionHome", false);
    }
    if (!found) {
        setTimeout(function() { 
            location.reload();
        }, RandomFromInterval(2500, 5000));
        GM_setValue("RecheckSanctionHome", true);
    } else {
        GM_setValue("RecheckSanctionHome", false);
        document.location = links[i];
    }
}

if (page == "bounty" && sanction && SanctionNumber > 0) {
    GM_setValue("ResanctionTarget", false);
    var form = document.getElementById("bountyForm");
    var target = document.getElementsByClassName("sectionHeader")[0].innerHTML.split('"')[1];
    form.getElementsByTagName("input")[0].value = SanctionAmount;
    GM_setValue("ResanctionTarget", target);
    GM_setValue("SanctionNumber", SanctionNumber - 1);
    var delay = 0;
    var fails = document.getElementsByClassName("messageBoxFail");
    if (fails.length > 0) {
        GM_setValue("SanctionNumber", SanctionNumber);
        if (fails[0].innerHTML.length == 114 + GM_getValue("ResanctionTarget", false).length || fails[0].innerHTML.length == 110 + GM_getValue("ResanctionTarget", false).length) {
            GM_setValue("ResanctionTarget", false);
            return;
        }
        delay = RandomFromInterval(3000, 10000);
    }
    setTimeout(function() {
        click(document.getElementById("bountyForm").getElementsByClassName("btnBroadcast")[0]);
    }, delay);
}

//PUID Kill/Kill at Bounty/PUID Search
if (search || (PUIDArray != "" && PUIDKill) || HitlistBountyAmountKill) {
    var PostComment = document.getElementsByClassName("btnMed btnPostComment");
    if (search && ((page == "profile" && PostComment.length > 0) || page == "group" || page == "group_member") && !CleanWall) {
        var links = document.links;
        var WasFound = false;
        for (i = 0; i < links.length; i++) {
            var LinkPUID = GetQueryVariable(links[i].href, "puid");
            if (LinkPUID == null) continue;
            var test = links[i].href;
            if (test.indexOf(SearchPUID) >= 0) {
                WasFound = true;
                document.location = links[i];
                break;
            }
            if (PUIDArray != "") {
                for (j = 0; j < PUIDArray.length; ++j) {
                    if (test.indexOf(SearchPUID) >= 0 || parseInt(PUIDArray[j]) == LinkPUID) {
                        WasFound = true;
                        document.location = links[i];
                        break;
                    }
                }
            }
        }
        if (!WasFound) {
            for (j = links.length - 1; j >= 0; j--) {
                var test2 = links[j].innerHTML;
                if (test2.indexOf("Next") == 0) {
                    document.location = links[j];
                    break;
                }
            }
        }
    }
    if (page == "hitlist") {
        if (CurrentHealth <= 26) {
            GM_setValue("heal", true);
        }
        if (!search) {
            var WasFound = false;
            var alive = document.getElementsByClassName("doAgainTxt");
            if (alive.length > 0) {
                var next = alive[0].getElementsByTagName("input")[0];
                if (CurrentAmmo >= HitlistKillAmmo) click(next);
                return;
            }
            var SanctionListPlayers = document.getElementsByClassName("fightTable");
            for (i = 0; i < SanctionListPlayers.length; i++) {
                var fields = SanctionListPlayers[i].getElementsByTagName("td");
                if (game == "wwar" || game == "vl" || game == "zl" || game == "rl") {
                    var name = fields[1].getElementsByTagName("a")[0].innerHTML;
                    var LinkPUID = GetQueryVariable(String(fields[1].getElementsByTagName("a")[0]), "puid");
                    for (j = 0; j < PUIDArray.length; ++j) {
                        var PlayerPUID = parseInt(PUIDArray[j]);
                        if (PlayerPUID == LinkPUID) {
                            WasFound = true;
                        }
                    }
                    if (HitlistBountyAmountKill && HitlistBountyAmountKillAmount != 0) {
                        if (game != "rl") {
                            var cash = fields[3].getElementsByClassName("cash")[0].getElementsByTagName("span")[0].innerHTML.split(">")[1];
                            if (cash == HitlistBountyAmountKillAmount) WasFound = true;
                            var cash2 = cash.replace(/\,/g, "");
                            if (cash2.indexOf("K") != -1) {
                                var cashK = cash2.split("K")[0] * 1000;
                                if (cashK == HitlistBountyAmountKillAmount) WasFound = true;
                            }
                            if (cash2.indexOf("M") != -1) {
                                var cashM = cash2.split("M")[0] * 1000000;
                                if (cashM == HitlistBountyAmountKillAmount) WasFound = true;
                            } else if (cash2 == HitlistBountyAmountKillAmount) WasFound = true;
                                } else {
                                    var cashD = fields[3].getElementsByClassName("cash")[0].getElementsByTagName("span")[0].innerHTML.split("$")[1];
                                    if (cashD == HitlistBountyAmountKillAmount) WasFound = true;
                                    var cash3 = cashD.replace(/\,/g, "");
                                    if (cash3.indexOf("K") != -1) {
                                        var cashK = cash3.split("K")[0] * 1000;
                                        if (cashK == HitlistBountyAmountKillAmount) WasFound = true;
                                    }
                                    if (cash3.indexOf("M") != -1) {
                                        var cashM = cash3.split("M")[0] * 1000000;
                                        if (cashM == HitlistBountyAmountKillAmount) WasFound = true;
                                    } else if (cash3 == HitlistBountyAmountKillAmount) WasFound = true;
                                        }
                    }
                    if (WasFound) {
                        var AttackButton = fields[5].getElementsByTagName("a")[0];
                        if (CurrentAmmo >= HitlistKillAmmo) click(AttackButton);
                        break;
                    }
                } else {
                    var name = fields[0].getElementsByTagName("a")[0].innerHTML;
                    var LinkPUID = GetQueryVariable(String(fields[0].getElementsByTagName("a")[0]), "puid");
                    for (j = 0; j < PUIDArray.length; ++j) {
                        var PlayerPUID = parseInt(PUIDArray[j]);
                        if (PlayerPUID == LinkPUID) {
                            WasFound = true;
                        }
                    }
                    if (HitlistBountyAmountKill && HitlistBountyAmountKillAmount != 0) {
                        if (game != "im") {
                            var cash = fields[2].getElementsByClassName("cash")[0].getElementsByTagName("span")[0].innerHTML.split(">")[1];
                            if (cash == HitlistBountyAmountKillAmount) WasFound = true;
                            var cash2 = cash.replace(/\,/g, "");
                            if (cash2.indexOf("K") != -1) {
                                var cashK = cash2.split("K")[0] * 1000;
                                if (cashK == HitlistBountyAmountKillAmount) WasFound = true;
                            }
                            if (cash2.indexOf("M") != -1) {
                                var cashM = cash2.split("M")[0] * 1000000;
                                if (cashM == HitlistBountyAmountKillAmount) WasFound = true;
                            } else if (cash2 == HitlistBountyAmountKillAmount) WasFound = true;
                                } else {
                                    var cashD = fields[2].getElementsByClassName("cash")[0].getElementsByTagName("span")[0].innerHTML.split("$")[1];
                                    if (cashD == HitlistBountyAmountKillAmount) WasFound = true;
                                    var cash3 = cashD.replace(/\,/g, "");
                                    if (cash3.indexOf("K") != -1) {
                                        var cashK = cash3.split("K")[0] * 1000;
                                        if (cashK == HitlistBountyAmountKillAmount) WasFound = true;
                                    }
                                    if (cash3.indexOf("M") != -1) {
                                        var cashM = cash3.split("M")[0] * 1000000;
                                        if (cashM == HitlistBountyAmountKillAmount) WasFound = true;
                                    } else if (cash3 == HitlistBountyAmountKillAmount) WasFound = true;
                                        }
                    }
                    if (WasFound) {
                        var AttackButton = fields[4].getElementsByTagName("a")[0];
                        if (CurrentAmmo >= HitlistKillAmmo) click(AttackButton);
                        break;
                    }
                }
            }
            if (!WasFound) {
                var tabs = document.getElementById("sectionTabs");
                setTimeout(function() {
                    document.location = tabs.getElementsByTagName("a")[1];
                }, RandomFromInterval(250, 1000));
            }
        } else {
            var links = document.links;
            var WasFound = false;
            for (i = 0; i < links.length; i++) {
                var test = links[i].href;
                if (test.indexOf(SearchPUID) >= 0) {
                    WasFound = true;
                    document.location = links[i];
                    break;
                }
            }
            if (!WasFound) {
                setTimeout(function() {
                    document.location = HitlistLink;
                }, RandomFromInterval(250, 1000));
            }
        }
    }
}

//ROI
if (GM_getValue("doingroi",false) && page == "investment") ROI();

function ROI() {
    var coh = GM_SuperValue.get("coh", 0);
    var owned = [];
    var buy = [];
    var cost = [];
    var roi = [];
    var eids = [];
    var inames = [];
    
    if (game == "vl") {
        var income = [50, 250, 800, 5000, 10000, 16000, 50000, 100000, 160000, 250000, 350000, 410000];
        var initCost = [2000, 10000, 30000, 200000, 500000, 1100000, 4000000, 10000000, 20000000, 40000000, 75000000, 90000000];
    }
    if (game == "wwar") {
        var income = [1000, 6500, 16500, 56000, 270000, 500000, 700000, 1200000, 1400000];
        var initCost = [25000, 220000, 800000, 4000000, 30000000, 90000000, 150000000, 500000000, 1200000000];
    }
    if (game == "im") {
        var income = [50, 250, 800, 5000, 10000, 16000, 50000, 100000, 160000, 250000, 275000, 300000, 350000, 375000, 400000, 430000];
        var initCost = [2000, 10000, 30000, 200000, 500000, 1100000, 4000000, 10000000, 20000000, 40000000, 55000000, 75000000, 105000000, 150000000, 250000000, 420000000];
    }
    if (game == "zl") {
        var income = [1, 5, 10, 25, 65, 110, 200, 350, 590, 900, 1500, 2700, 4200];
        var initCost = [40, 220, 500, 1500, 5000, 11000, 25000, 54000, 110000, 200000, 360000, 700000, 1200000];
    }
    if (game == "rl") {
        var income = [50, 100, 200, 400, 1000, 1500, 2700, 4800, 7500, 11500, 28000, 32000, 34000];
        var initCost = [3000, 7000, 15000, 55000, 175000, 330000, 700000, 1100000, 2000000, 3250000, 8500000, 12500000, 15000000];
    }
    if (game == "kl") {
        var income = [1, 5, 12, 50, 150, 250, 800, 1400, 2200, 3200, 4500, 6200, 15000];
        var initCost = [50, 250, 650, 2800, 9000, 14000, 50000, 100000, 180000, 320000, 540000, 1250000, 4000000];
    }
    if (game == "rol") {
        var income = [20, 40, 75, 240, 700, 1200, 2000, 2700, 5000, 7500, 12500];
        var initCost = [800, 1700, 3800, 14000, 50000, 100000, 200000, 330000, 720000, 1250000, 2500000];
    }
    if (game == "nl") {
        var income = [];
        var initCost = [];
    }
    if (game == "pl") {
        var income = [];
        var initCost = [];
    }
    
    var investitem = document.getElementsByClassName("investItem");
    for (var i = 0; i < investitem.length; i++) {
        var numown = investitem[i].getElementsByClassName("ownedNum")[0];
        if (numown) {
            var info = investitem[i].getElementsByClassName("reInfoItem")[0];
            var type = info.innerHTML.substr(0, 1);
            var investname = investitem[i].getElementsByClassName("reName")[0].innerHTML;
            if (type == "I") {
                var invid = investitem[i].getElementsByClassName("reBuyAction")[0].getElementsByTagName("a")[0].href.split("inv_id=")[1].split("&")[0];
                var rno = parseInt(numown.innerHTML.replace(/,/g, ""));
                if (rno < 32767) owned.push(rno);
                if (rno >= 32767) owned.push(1000000000000);
                inames.push(investname);
                buy.push(0);
                eids.push(parseInt(invid));
            }
        }
    }
    
    function askCash() {
        var cash = prompt("How much would you like to spend?", "0");
        if (cash != null && cash != "" && parseInt(cash) <= 5000000000000) {
            GM_SuperValue.set("coh", parseInt(cash));
            document.location = "http://" + game + ".storm8.com/investment.php";
        }
        if (parseInt(cash) > 5000000000000) {
            alert("Don't spend more than 5T at once");
            document.location = "http://" + game + ".storm8.com/investment.php";
        }
        if (cash == null) GM_setValue("doingroi", false);
    }
    
    function getClosestValue(a, x) {
        var lo, hi;
        for (var i = a.length; i--;) {
            if (a[i] <= x && (lo === undefined || lo < a[i])) lo = a[i];
            if (a[i] >= x && (hi === undefined || hi > a[i])) hi = a[i];
        }
        return [lo];
    }
    
    function whatToBuy() {
        for (var j = 0; j < owned.length; j++) {
            cost.push((1 + 0.1 * (owned[j] + buy[j])) * initCost[j]);
            roi.push(income[j] / cost[j]);
        }
        var toh = coh;
        while (toh > 0) {
            var wtb = getClosestValue(roi, 1);
            for (var i = 0; i < roi.length; i++) {
                if (wtb == roi[i]) {
                    toh = toh - cost[i];
                    if (toh > 0) {
                        buy[i] = buy[i] + 1;
                        cost[i] = (1 + 0.1 * (owned[i] + buy[i])) * initCost[i];
                        roi[i] = income[i] / cost[i];
                        if ((buy[i] + owned[i]) >= 32767) owned[i] = 1000000000000;
                    } else {
                        GM_SuperValue.set("coh", 0);
                        break;
                    }
                }
            }
        }
        var allz = 0;
        for (var z = 0; z < buy.length; z++) {
            if (buy[z] == 0) allz++;
        }
        if (allz == buy.length) {
            alert("You cannot afford to buy the best ROI.");
            GM_setValue("doingroi", false);
        } else {
            GM_SuperValue.set("buy", buy);
            document.location = "http://" + game + ".storm8.com/investment.php";
        }
    }
    
    function formulateBuy() {
        var buyarray = GM_SuperValue.get("buy", null);
        var timetr = 0;
        var waitbitch = 0;
        for (var i = 0; i < buyarray.length; i++) {
            if (buyarray[i] > 0 && waitbitch == 0) {
                waitbitch = 1;
                var numofinv = buyarray[i];
                var invidtobuy = eids[i];
                var p = confirm("You are about to buy " + numofinv + " " + inames[i] + "'s.");
                if (p) {
                    postwith("investment.php", ["inv_id", invidtobuy, "action", "buy", "numberOfInv", numofinv]);
                    buyarray[i] = 0;
                    GM_SuperValue.set("buy", buyarray);
                } else {
                    GM_SuperValue.set("buy", null);
                    GM_setValue("doingroi", false);
                    return;
                }
            }
            if (buyarray[i] == 0) timetr++;
            if (timetr == buyarray.length) {
                GM_SuperValue.set("buy", null);
                GM_setValue("doingroi", false);
            }
        }
    }
    if (coh > 0 && GM_SuperValue.get("buy", null) == null) whatToBuy();
    if (coh <= 0 && GM_SuperValue.get("buy", null) == null) askCash();
    if (GM_SuperValue.get("buy", null) != null) formulateBuy();
}

//Auto Heal
if (AutoHeal) {
    var fn = AutoHealTimerTextbox.value.split('-')[0] * 1000;
    var sn = AutoHealTimerTextbox.value.split('-')[1] * 1000;
    GM_setValue("AutoHealDelay", RandomFromInterval(fn, sn));
    var MaximumHealth = parseInt(document.getElementById('healthMax').innerHTML);
    if (AutoHealDelay > 0) setTimeout(function() {
        document.location = HospitalLink;
    }, AutoHealDelay);
    if (CurrentHealth < AutoHealHealthLimit && CurrentHealth < MaximumHealth) {
        if (page != "hospital") document.location = HospitalLink;
        else setTimeout(function() {
            document.location = document.getElementsByClassName('tac healBtn')[0].getElementsByTagName('a')[0].href;
        }, RandomFromInterval(1000,2000));
    }
}

//Auto Bank
if (AutoBank) {
    if (page != "bank") document.location = BankLink;
    if (page == "bank") {
        var cash = GetExactCash();
        if (cash > 0) {
            setTimeout(function() { 
                postwith("bank.php", ['depositAmount', cash, 'action', 'Deposit']);
            }, RandomFromInterval(10000, 60000));
        }
        if (cash == 0) {
            setTimeout(function() { 
                document.location.reload();
            }, RandomFromInterval(500000, 700000));
        }
    }
}

//File Retrieval
function GetFile(URL, IsUpdate, IsAdd, IsChange) {
    var File = new XMLHttpRequest();
    File.open("GET", URL, true);
    File.onreadystatechange = function() {
        if (File.readyState === 4) {
            if (File.status === 200) {
                if (!IsUpdate && IsAdd) {
                    var AccountLink = File.responseText;
                    GM_setValue("AccountLink", AccountLink);
                    document.location = AccountLink;
                }
                if (!IsUpdate && !IsAdd) {
                    alert(File.responseText);
                }
                if (IsUpdate && File.responseText != CurrentVersion && !IsAdd) {
                    GetFile('http://bscripts.tk/storm8/scriptresources/ACchange.php', false, false, true);
                }
            } else {
                if (IsUpdate) {
                    GetFile("https://dl.dropboxusercontent.com/s/e6a56fujhozoisj/version.txt?token_hash=AAEDWQ_6tdVlFwuFVt0KIMLgQaJM4HeTtBjKqyAGusW1ow&dl=1", true, false, false);
                } else if (IsChange) {
                    GetFile('https://dl.dropboxusercontent.com/s/vofzfoggdowkt49/update.txt?token_hash=AAGDO_ggm8F1PGk7GoL-jnYooWFYAww1_9WnOAo5vmEWZg&dl=1', false, false, true);
                } else {
                    GetFile("https://dl.dropboxusercontent.com/s/3key31ksgrlacrf/scriptfaq.txt?token_hash=AAHJh8a1sfzTOqZ-hTOvrGW6tqufJl40fXhgknkLpmkKiA&dl=1", false, false, false);
                }
            }
        }
    }
    File.send(null);
}

//Set Selected Value
function SetSelect(id, val) {
    var elem = document.getElementById(id);
    for (n = elem.length - 1; n >= 0; n--) {
        if (elem.options[n].value == val) {
            elem.options[n].selected = true;
        }
    }
}

//Get a button by value
function GetButtonByValue(value) {
    var els = document.getElementsByTagName('input');
    for (var i = 0, length = els.length; i < length; i++) {
        var el = els[i];
        if (el.type.toLowerCase() == 'button' && el.value.toLowerCase() == value.toLowerCase()) {
            return el;
            break;
        }
    }
}

//Click an element
function click(e, type) {
    if (!e) {
        return;
    }
    if (typeof e == 'string') e = document.getElementById(e);
    var evObj = document.createEvent('MouseEvents');
    evObj.initMouseEvent((type || 'click'), true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    e.dispatchEvent(evObj);
}

//Random integer
function RandomFromInterval(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

//Get Query Variable
function GetQueryVariable(query, variable) {
    var qm = query.indexOf('?');
    if (qm >= 0) query = query.substring(qm + 1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) return pair[1];
    }
}

//Unhide Names
function NameUnhider() {
    if (page == "home" || page == "group" || page == "group_member" || page == "fight" || page == "hitlist" || (page == "profile" && String(location).indexOf("selectedTab=comment") != -1)) {
        var links = document.getElementsByTagName("a");
        if (links) {
            for (var i = 0; i < links.length; i++) {
                if (links[i].href.indexOf("puid") != -1) {
                    var NameCheck = links[i].innerHTML;
                    var EntityOutput = String(EncodeHTML(NameCheck));
                    if (EntityOutput.length == 0) {
                        links[i].innerHTML = "CLICK ME!";
                        return;
                    }
                    if (EntityOutput.indexOf("&#8204;") != -1 || EntityOutput.indexOf("&#8207;") != -1) links[i].innerHTML = "CLICK ME!";
                    if (EntityOutput.indexOf("&#8235;") != -1 || EntityOutput.indexOf("&#8234;") != -1) links[i].innerHTML = "CLICK ME!";
                    if (EntityOutput.indexOf("&#12288;") != -1 || EntityOutput.indexOf("&#130;") != -1) links[i].innerHTML = "CLICK ME!";
                    if (EntityOutput.indexOf("&#8238;") != -1 || EntityOutput.indexOf("&#850;") != -1) links[i].innerHTML = "CLICK ME!";
                    if (EntityOutput.indexOf("&#8237;") != -1 || EntityOutput.indexOf("&#173;") != -1) links[i].innerHTML = "CLICK ME!";
                }
            }
        }
    }
}

//HTML Encoder
function EncodeHTML(str) {
    var buf = [];
    for (var i = str.length - 1; i >= 0; i--) {
        buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
    }
    return buf.join('');
}

//Post Form with Variables
function postwith(to, p) {
    var myForm = document.createElement("form");
    myForm.method = "post";
    myForm.action = to;
    for (var k = 0; k < p.length; k += 2) {
        var myInput = document.createElement("input");
        myInput.setAttribute("name", p[k]);
        myInput.setAttribute("value", p[k + 1]);
        myForm.appendChild(myInput);
    }
    document.body.appendChild(myForm);
    myForm.submit();
    document.body.removeChild(myForm);
}

//Get Exact Amount of Cash
function GetExactCash() {
    var body = document.getElementsByTagName("body")[0].innerHTML;
    var cash = 0;
    body = body.substr(body.indexOf("setTopBarTimerData"), body.indexOf("createTopBarTimer();") - body.indexOf("setTopBarTimerData"));
    body = body.substr(body.indexOf("bank.php"), body.indexOf("energy") - body.indexOf("bank.php"));
    cash = parseInt(body.substr(body.indexOf('"value":') + '"value":'.length, body.indexOf(',"maxValue"') - body.indexOf('"value":') - '"value":'.length));
    return cash;
}

//Convert a string into entities
function EncodeHTMLEntity(str) {
    var buf = [];
    for (var i=str.length-1;i>=0;i--) {
        buf.unshift(["&#", str[i].charCodeAt(), ";"].join(""));
    }
    return buf.join("");
}

//Mission Glitcher
var GlitchMissionButton = document.getElementById("GlitchMissionButton");
GlitchMissionButton.addEventListener("click", GlitchMission);
if (page != "bounty") {
    GlitchMissionButton.disabled = true;
}
var Glitch2 = document.getElementById("Glitch2");
Glitch2.addEventListener("change", function() {
    if (Glitch2.checked) {
        GM_setValue("GlitchTimes", 2);
        GlitchTimes = 2;
        Glitch3.checked = false;
    } else {
        GM_setValue("GlitchTimes", 1);
        GlitchTimes = 1;
    }
});
var Glitch3 = document.getElementById("Glitch3");
Glitch3.addEventListener("change", function() {
    if (Glitch3.checked) {
        GM_setValue("GlitchTimes", 3);
        GlitchTimes = 3;
        Glitch2.checked = false;
    } else {
        GM_setValue("GlitchTimes", 1);
        GlitchTimes = 1;
    }
});
if (GlitchTimes == 2) {
    Glitch2.checked = true;
}
else if (GlitchTimes == 3) {
    Glitch3.checked = true;
}
    
function GlitchMission() {
    if (page == "bounty") {
        GlitchMissionButton.disabled = true;
        var form = document.getElementById("bountyForm");
        var MinimumBounty;
        if (game == "im" || game == "rl") {
            MinimumBounty = parseInt(form.getElementsByTagName("span")[0].innerHTML.replace(/,/g, "").replace(/[$]/g, ""));
        }
        else MinimumBounty = parseInt(form.getElementsByTagName("span")[0].childNodes[1].nodeValue.replace(/,/g,""));
        var fixhl = form.attributes['onsubmit'].value.replace('return ', '');
        var script = document.createElement("script");
        script.innerHTML = fixhl;
        form.appendChild(script);
        var hitlisturl = form.attributes['action'].value;
        hitlisturl = hitlisturl.replace(/\//g, '');
        hitlisturl = "http://"+game+".storm8.com/"+hitlisturl;
        var cookie = document.cookie;
        var hlurl = "http://bscripts.tk/storm8/scriptresources/lootglitcher.php?"+
            "url="+encodeURIComponent(hitlisturl)+
            "&cookie="+encodeURIComponent(cookie)+
            "&bountyValue="+MinimumBounty+
            "&action="+form.getElementsByClassName("btnMed btnBroadcast")[0].value+
            "&game="+game+
            "&mission="+MissionCategory+"and"+MissionNumber+
            "&energy="+document.getElementById('energyCurrent').innerHTML+
            "&auth="+GlitchAuthTextbox.value+
            "&times="+GlitchTimes;
        var glitch = new XMLHttpRequest();
        glitch.open("GET", hlurl, true);
        glitch.onreadystatechange = function() {
            if (glitch.readyState == 4) {
                if (glitch.status == 200) {
                    var response = glitch.responseText.replace(/ \\n/g, '\n');
                    alert(response);
                    GlitchMissionButton.disabled = false;
                    document.location = HomeLink;
                } else {
                    alert("Please try again later.");
                    GlitchMissionButton.disabled = false;
                }
            }
        }
        glitch.send(null);
    }
}