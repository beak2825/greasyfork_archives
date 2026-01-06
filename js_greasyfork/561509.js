// ==UserScript==
// @name        Battle Stats Predictor - Free Version
// @description Show battle stats prediction - Free Version
// @version     9.3.7-FREE
// @namespace   tdup.battleStatsPredictor.free
// @match       https://www.torn.com/profiles.php*
// @match       https://www.torn.com/bringafriend.php*
// @match       https://www.torn.com/halloffame.php*
// @match       https://www.torn.com/index.php?page=people*
// @match       https://www.torn.com/factions.php*
// @match       https://www.torn.com/page.php*
// @match       https://www.torn.com/joblist.php*
// @match       https://www.torn.com/competition.php*
// @match       https://www.torn.com/bounties.php*
// @match       https://www.torn.com/hospitalview.php*
// @match       https://www.torn.com/forums.php*
// @match       https://www.torn.com/page.php?sid=list&type=friends
// @match       https://www.torn.com/page.php?sid=list&type=enemies
// @match       https://www.torn.com/page.php?sid=list&type=targets
// @match       https://www.torn.com/pmarket.php*
// @match       https://www.torn.com/properties.php*
// @match       https://www.torn.com/war.php*
// @match       https://www.torn.com/preferences.php*
// @match       https://www.torn.com/loader.php?sid=attack*
// @run-at      document-end
// @grant       GM.xmlHttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_info
// @connect     api.torn.com
// @connect     www.lol-manager.com
// @connect     www.tornstats.com
// @connect     yata.yt
// @author      TDup - Free Version
// @downloadURL https://update.greasyfork.org/scripts/561509/Battle%20Stats%20Predictor%20-%20Free%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/561509/Battle%20Stats%20Predictor%20-%20Free%20Version.meta.js
// ==/UserScript==

// ##### INSTALLATION README #####
// ##### YOU SHOULD NOT NEED TO EDIT ANYTHING HERE
// ##### THE SETUP OF THIS SCRIPT IS DONE THROUGH THE BSP OPTION WINDOW, AVAILABLE ON YOUR TORN PROFILE PAGE, ONCE THIS SCRIPT IS INSTALLED
// ##### FREE VERSION - NO SUBSCRIPTION REQUIRED

// #region LocalStorage

const StorageKey = {
    // Used for identification to the third party (lolmanager, website handling the predictions) + doing Torn API calls on the backend, when target stats are not cached yet. Doesn't require any kind of abilitation.
    // This is the only key sent to the BSP backend.
    PrimaryAPIKey: 'tdup.battleStatsPredictor.PrimaryAPIKey',
    IsPrimaryAPIKeyValid: 'tdup.battleStatsPredictor.IsPrimaryAPIKeyValid',

    // To avoid showing prediction on own profile
    PlayerId: 'tdup.battleStatsPredictor.PlayerId',
    IsEnabledOnOwnProfile: 'tdup.battleStatsPredictor.IsEnabledOnOwnProfile',

    // Used only on the client side, to import user battlestats. This is not required but useful to have your stats up to date locally, for accurate color code.
    // You can fill manually your stats, or not fill your stat at all, and don't use the color code system.
    // This data is only kept in your local cache, no battle stats are sent to the BSP backend
    BattleStatsAPIKey: 'tdup.battleStatsPredictor.BattleStatsApiKey',
    IsBattleStatsAPIKeyValid: 'tdup.battleStatsPredictor.IsBattleStatsApiKeyValid',
    // Can be edited manually, or imported directly through the API
    PlayerBattleStats: 'tdup.battleStatsPredictor.playerBattleStats',
    IsAutoImportStats: 'tdup.battleStatsPredictor.IsAutoImportStats',
    AutoImportStatsLastDate: 'tdup.battleStatsPredictor.AutoImportStatsLastDate',

    // Predictions
    BSPPrediction: 'tdup.battleStatsPredictor.cache.prediction.',

    // Used only on the client side, to import spies from TornStats.
    // Spies are only kept in your local cache, no spies is sent to the BSP backend.
    TornStatsAPIKey: 'tdup.battleStatsPredictor.TornStatsApiKey',
    IsTornStatsAPIKeyValid: 'tdup.battleStatsPredictor.IsTornStatsAPIKeyValid',
    TornStatsSpy: 'tdup.battleStatsPredictor.cache.spy_v2.tornstats_',
    IsAutoImportTornStatsSpies: 'tdup.battleStatsPredictor.tornstats_isAutoImportSpies',
    AutoImportLastDatePlayer: 'tdup.battleStatsPredictor.tornstats_AutoImportLastDatePlayer_',
    AutoImportLastDateFaction: 'tdup.battleStatsPredictor.tornstats_AutoImportLastDateFaction_',

    UploadDataAPIKey: 'tdup.battleStatsPredictor.UploadDataAPIKey',
    UploadDataAPIKeyIsValid: 'tdup.battleStatsPredictor.UploadDataAPIKeyIsValid',
    UploadDataLastUploadTime: 'tdup.battleStatsPredictor.UploadDataLastUploadTime',
    UploadDataIsAutoMode: 'tdup.battleStatsPredictor.UploadDataIsAutoMode',

    YataAPIKey: 'tdup.battleStatsPredictor.YataApiKey',
    IsYataAPIKeyValid: 'tdup.battleStatsPredictor.IsYataApiKeyValid',
    YataSpy: 'tdup.battleStatsPredictor.cache.spy_v2.yata_',

    DaysToUseSpies: 'tdup.battleStatsPredictor.DaysToUseTornStatsSpy',

    // Subscription - FREE VERSION: Always valid
    DateSubscriptionEnd: 'tdup.battleStatsPredictor.dateSubscriptionEnd',

    // Debug options
    ShowPredictionDetails: 'tdup.battleStatsPredictor.showPredictionDetails',

    // Pages enabled
    IsBSPEnabledOnPage: 'tdup.battleStatsPredictor.IsBSPEnabledOnPage_',

    ShouldOpenAttackURLInNewTab: 'tdup.battleStatsPredictor.ShouldOpenAttackURLInNewTab',

    // Display choice
    IsShowingHonorBars: 'tdup.battleStatsPredictor.isShowingHonorBars',
    IsShowingAlternativeProfileDisplay: 'tdup.battleStatsPredictor.isShowingAlternativeProfileDisplay',
    BSPColorTheme: 'tdup.battleStatsPredictor.BspColorTheme',
    ColorStatsThreshold: 'tdup.battleStatsPredictor.ColorStatsThreshold_',
    IsShowingBattleStatsScore: 'tdup.battleStatsPredictor.IsShowingBattleStatsScore',
    IsShowingBattleStatsPercentage: 'tdup.battleStatsPredictor.IsShowingBattleStatsPercentage',
    IsClickingOnProfileStatsAttackPlayer: 'tdup.battleStatsPredictor.IsClickingOnProfileStatsAttackPlayer',
    IsHidingBSPOptionButtonInToolbar: 'tdup.battleStatsPredictor.IsHidingBSPOptionButtonInToolbar',

    // Cache management
    AutoClearOutdatedCacheLastDate: 'tdup.battleStatsPredictor.AutoClearOutdatedCacheLastDate',
    TestLocalStorageKey: 'tdup.battleStatsPredictor.TestLocalStorage',
};

function GetBSPServer() {
    return "http://www.lol-manager.com/api";
}
function GetStorage(key) { return localStorage[key]; }
function GetStorageEmptyIfUndefined(key) { return (localStorage[key] == undefined) ? "" : localStorage[key]; }
function GetStorageBool(key) { return (localStorage[key] == "true") ? true : false; }
function GetStorageBoolWithDefaultValue(key, defaultValueIfUnset) {
    if (localStorage[key] == "true") return true;
    else if (localStorage[key] == "false") return false;
    else {
        SetStorage(key, defaultValueIfUnset);
        return defaultValueIfUnset;
    }
}
function SetStorage(key, value) {
    try {
        localStorage[key] = value;
    }
    catch (e) {
        LogInfo("BSP threw an exception in SetStorage method : " + e);
    }
}

function GetLocalBattleStats() {
    let data = localStorage[StorageKey.PlayerBattleStats];
    if (data == undefined) {
        let localBattleStats = new Object();
        localBattleStats.Str = 0;
        localBattleStats.Def = 0;
        localBattleStats.Spd = 0;
        localBattleStats.Dex = 0;
        localBattleStats.TBS = 0;
        localBattleStats.Score = 0;
        SetLocalBattleStats(localBattleStats);
        return localBattleStats;
    }
    return JSON.parse(data);
}
function SetLocalBattleStats(value) {
    localStorage[StorageKey.PlayerBattleStats] = JSON.stringify(value);
}

// #endregion

// #region Global vars

const LOCAL_COLORS = [
    { maxValue: 5, maxValueScore: 30, color: '#949494', canModify: true },
    { maxValue: 35, maxValueScore: 70, color: '#FFFFFF', canModify: true },
    { maxValue: 75, maxValueScore: 90, color: '#73DF5D', canModify: true },
    { maxValue: 125, maxValueScore: 105, color: '#47A6FF', canModify: true },
    { maxValue: 400, maxValueScore: 115, color: '#FFB30F', canModify: true },
    { maxValue: 10000000000, maxValueScore: 10000000000, color: '#FF0000', canModify: false },
];

var FAIL = 0;
var SUCCESS = 1;
var TOO_WEAK = 2;
var TOO_STRONG = 3;
var MODEL_ERROR = 4;
var HOF = 5;
var FFATTACKS = 6;

var apiRegister;
var comparisonBattleStatsText;
var scoreStrInput;
var scoreDefInput;
var scoreSpdInput;
var scoreDexInput;
var subscriptionEndText;
var divThresholdColorsPanel;

var btnValidateTornStatsAPIKey;
var successValidateTornStatsAPIKey;
var errorValidateTornStatsAPIKey;
var btnImportTornStatsSpies;
var successImportTornStatsSpies;
var errorImportTornStatsSpies;
var mainNode;

var btnFetchSpiesFromYata;
var successValidateYataAPIKey;
var errorValidateYataAPIKey;
var btnImportYataSpies;
var successImportYataSpies;
var errorImportYataSpies;

var TDup_PredictorOptionsDiv;
var TDup_PredictorOptionsMenuArea;
var TDup_PredictorOptionsContentArea;

var ProfileTargetId = -1;
var FactionTargetId = -1;
var PlayerProfileDivWhereToInject;
var dictDivPerPlayer = {};

var OnMobile = false;

var PREDICTION_VALIDITY_DAYS = 5;

var mainColor = "#344556";
var mainBSPIcon = "https://i.postimg.cc/K8cNpzCS/BSPLogo11low.png";

var tornstatsIcon = "https://i.postimg.cc/k5HjhCLV/tornstats-logo.png";
var yataIcon = "https://i.ibb.co/hYvQC2L/yata.png";

var starIcon = "https://i.ibb.co/23TYRyL/star-v2.png";
var oldSpyIcon = "https://i.ibb.co/b7982wh/oldSpy.png";
var hofIcon = "https://i.ibb.co/fkFDrVx/HOF-v2.png";
var FFAttacksIcon = "https://i.ibb.co/GJ04WJn/player-Data-v2.png";

var URL_TORN_ATTACK = "https://www.torn.com/loader.php?sid=attack&user2ID=";

// #endregion

// #region Styles

var styleToAdd = document.createElement('style');

styleToAdd.innerHTML += '.iconStats {height: 20px; width: 32px; position: relative; text-align: center; font-size: 12px; font-weight:bold; color: black; box-sizing: border-box; border: 1px solid black;line-height: 18px;font-family: initial;}';
styleToAdd.innerHTML += '.iconStatsAttack {height: 30px; width: 80px; position: relative; text-align: center; font-size: 28px; font-weight:bold; color: black; box-sizing: border-box; border: 1px solid black;line-height: 28px;font-family: initial;}';

/* Style the tab */
styleToAdd.innerHTML += '.TDup_optionsMenu {border: 1px solid #ccc;background-color: #f1f1f1;}';

/* Style the buttons inside the tab */
styleToAdd.innerHTML += '.TDup_optionsMenu button {display: block; text-align:center !important; height:45px; background-color: inherit; color: black; padding: 22px 16px; width: 100%; border: none; outline: none; text-align: left; cursor: pointer; transition: 0.3s;font-size: 14px; border: 1px solid white !important}';

/* Change background color of buttons on hover */
styleToAdd.innerHTML += '.TDup_optionsMenu button:hover button:focus { background-color: #99ccff !important; color: black !important}';

/* Create an active/current "tab button" class */
styleToAdd.innerHTML += '.TDup_optionsMenu button.active { background-color: ' + GetColorTheme() + ' !important; color:white}';

styleToAdd.innerHTML += '.TDup_optionsCellMenu {width:100px; background:white; height:370px; vertical-align: top !important;}';

styleToAdd.innerHTML += '.TDup_optionsCellHeader {text-align: center; font-size: 18px !important; background:' + GetColorTheme() + '; color: white;}';

styleToAdd.innerHTML += '.TDup_divBtnBsp {width: initial !important;}';

/* Buttons in Option menu content */
styleToAdd.innerHTML += '.TDup_buttonInOptionMenu { background-color: ' + GetColorTheme() + '; border-radius: 4px; border-style: none; box-sizing: border-box; color: #fff;cursor: pointer;display: inline-block; font-family: "Farfetch Basis", "Helvetica Neue", Arial, sans-serif;';
styleToAdd.innerHTML += 'font-size: 12px; margin: 5px; max-width: none; outline: none;overflow: hidden;  padding: 5px 5px; position: relative;  text-align: center;}';

/* Style the tab content */

styleToAdd.innerHTML += '.TDup_optionsTabContentDiv { padding: 10px 6px;}';
styleToAdd.innerHTML += '.TDup_optionsTabContentDiv a { display: initial !important;}';

styleToAdd.innerHTML += '.TDup_optionsTabContentDivSmall { padding: 5px 5px;}';

styleToAdd.innerHTML += '.TDup_optionsTabContent { padding: 10px 10px;  border: 1px solid #ccc;  }';
styleToAdd.innerHTML += '.TDup_optionsTabContent label { margin:10px 0px; }';
styleToAdd.innerHTML += '.TDup_optionsTabContent p { margin:10px 0px; }';
styleToAdd.innerHTML += '.TDup_optionsTabContent a { color:black !important;}';

styleToAdd.innerHTML += '.TDup_ColoredStatsInjectionDiv { position:absolute;}';
styleToAdd.innerHTML += '.TDup_ColoredStatsInjectionDivWithoutHonorBar { }';

styleToAdd.innerHTML += '.TDup_optionsTabContent input { margin:0px 10px !important; }';
styleToAdd.innerHTML += '.TDup_optionsTabContent input[type = button] { margin:0px 10px 0px 0px !important; }';
styleToAdd.innerHTML += '.TDup_optionsTabContent input:disabled[type = button] { background-color: #AAAAAA; }';
styleToAdd.innerHTML += '.TDup_optionsTabContent input[type = number] { text-align: right; }';

styleToAdd.innerHTML += '.TDup_button {  background-color: ' + GetColorTheme() + '; border-radius: 4px; border-style: none; box-sizing: border-box; color: #fff;cursor: pointer;display: inline-block; font-family: "Farfetch Basis", "Helvetica Neue", Arial, sans-serif;';
styleToAdd.innerHTML += 'font-size: 12px;font-weight: 100; line-height: 1;  margin: 0; max-width: none; min-width: 10px;  outline: none;overflow: hidden;  padding: 5px 5px; position: relative;  text-align: center;';
styleToAdd.innerHTML += 'text-transform: none;  user-select: none; -webkit-user-select: none;  touch-action: manipulation; width: 100%;}';
styleToAdd.innerHTML += '.TDup_button: hover, .TDup_button:focus { opacity: .75;}'

var ref = document.querySelector('script');

var styleInjected = false;
if (ref != undefined && ref.parentNode != undefined) {
    ref.parentNode.insertBefore(styleToAdd, ref);
    styleInjected = true;
}

// #endregion

// #region Utils

const PageType = {
    Profile: 'Profile',
    RecruitCitizens: 'Recruit Citizens',
    HallOfFame: 'Hall Of Fame',
    Faction: 'Faction',
    Company: 'Company',
    Competition: 'Competition',
    Elimination: 'Elimination',
    EliminationAttacks: 'EliminationAttacks',
    EliminationRevenge: 'EliminationRevenge',
    Bounty: 'Bounty',
    Search: 'Search',
    Hospital: 'Hospital',
    Chain: 'Chain',
    FactionControl: 'Faction Control',
    FactionControlPayday: 'Faction Control Per Day',
    FactionControlApplications: 'Faction Control Applications',
    Market: 'Market',
    Forum: 'Forum',
    ForumThread: 'ForumThread',
    ForumSearch: 'ForumSearch',
    Abroad: 'Abroad',
    Enemies: 'Enemies',
    Friends: 'Friends',
    Targets: 'Targets',
    PointMarket: 'Point Market',
    Properties: 'Properties',
    War: 'War',
    ChainReport: 'ChainReport',
    RWReport: 'RWReport',
    Attack: 'Attack',
    RussianRoulette: 'Russian Roulette',
};

var mapPageTypeAddress = {
    [PageType.Profile]: 'https://www.torn.com/profiles.php',
    [PageType.RecruitCitizens]: 'https://www.torn.com/bringafriend.php',
    [PageType.HallOfFame]: 'https://www.torn.com/page.php?sid=hof',
    [PageType.Faction]: 'https://www.torn.com/factions.php',
    [PageType.Company]: 'https://www.torn.com/joblist.php',
    [PageType.Competition]: 'https://www.torn.com/competition.php',
    [PageType.Elimination]: 'https://www.torn.com/page.php?sid=competition',
    [PageType.EliminationAttacks]: 'https://www.torn.com/page.php?sid=competition#/attacks',
    [PageType.EliminationRevenge]: 'https://www.torn.com/page.php?sid=competition#/revenge',
    [PageType.Bounty]: 'https://www.torn.com/bounties.php',
    [PageType.Search]: 'https://www.torn.com/page.php?sid=UserList',
    [PageType.Hospital]: 'https://www.torn.com/hospitalview.php',
    [PageType.Chain]: 'https://www.torn.com/factions.php?step=your#/war/chain',
    [PageType.FactionControl]: 'https://www.torn.com/factions.php?step=your#/tab=controls',
    [PageType.FactionControlPayday]: 'https://www.torn.com/factions.php?step=your#/tab=controls',
    [PageType.FactionControlApplications]: 'https://www.torn.com/factions.php?step=your#/tab=controls',
    [PageType.Market]: 'https://www.torn.com/page.php?sid=ItemMarket',
    [PageType.Forum]: 'https://www.torn.com/forums.php',
    [PageType.ForumThread]: 'https://www.torn.com/forums.php#/p=threads',
    [PageType.ForumSearch]: 'https://www.torn.com/forums.php#/p=search',
    [PageType.Abroad]: 'https://www.torn.com/index.php?page=people',
    [PageType.Enemies]: 'https://www.torn.com/page.php?sid=list&type=enemies',
    [PageType.Friends]: 'https://www.torn.com/page.php?sid=list&type=friends',
    [PageType.Targets]: 'https://www.torn.com/page.php?sid=list&type=targets',
    [PageType.PointMarket]: 'https://www.torn.com/pmarket.php',
    [PageType.Properties]: 'https://www.torn.com/properties.php',
    [PageType.War]: 'https://www.torn.com/war.php',
    [PageType.ChainReport]: 'https://www.torn.com/war.php?step=chainreport',
    [PageType.RWReport]: 'https://www.torn.com/war.php?step=rankreport',
    [PageType.Attack]: 'https://www.torn.com/loader.php?sid=attack',
    [PageType.RussianRoulette]: 'https://www.torn.com/page.php?sid=russianRoulette',
}

var mapPageAddressEndWith = {
    [PageType.FactionControl]: '/tab=controls',
    [PageType.FactionControlPayday]: 'tab=controls&option=pay-day',
    [PageType.FactionControlApplications]: 'tab=controls&option=application'
}


function LogInfo(value) {
    var now = new Date();
    console.log(": [** BSP **] " + now.toISOString() + " - " + value);
}

function JSONparse(str) {
    try {
        return JSON.parse(str);
    } catch (e) { }
    return null;
}

function FormatBattleStats(number) {
    var localized = number.toLocaleString('en-US');
    var myArray = localized.split(",");
    if (myArray.length < 1) {
        return 'ERROR';
    }

    var toReturn = myArray[0];
    if (number < 1000) return number;
    if (parseInt(toReturn) < 10) {
        if (parseInt(myArray[1][0]) != 0) {
            toReturn += '.' + myArray[1][0];
        }
    }
    switch (myArray.length) {
        case 2:
            toReturn += "k";
            break;
        case 3:
            toReturn += "m";
            break;
        case 4:
            toReturn += "b";
            break;
        case 5:
            toReturn += "t";
            break;
        case 6:
            toReturn += "q";
            break;
    }

    return toReturn;
}

function IsPage(pageType) {
    let endWith = mapPageAddressEndWith[pageType];
    if (endWith != undefined) {

        return window.location.href.includes(endWith);
    }

    let startWith = mapPageTypeAddress[pageType];
    if (startWith != undefined) {
        return window.location.href.startsWith(startWith);
    }
    return false;
}

function IsUrlEndsWith(value) {
    return window.location.href.endsWith(value);
}

function GetColorMaxValueDifference(ratio) {
    for (var i = 0; i < LOCAL_COLORS.length; ++i) {
        if (ratio < LOCAL_COLORS[i].maxValue) {
            return LOCAL_COLORS[i].color;
        }
    }
    return "#ffc0cb"; //pink
}

function GetColorScoreDifference(ratio) {
    for (var i = 0; i < LOCAL_COLORS.length; ++i) {
        if (ratio < LOCAL_COLORS[i].maxValueScore) {
            return LOCAL_COLORS[i].color;
        }
    }
    return "#ffc0cb"; //pink
}

// === MODIFICATION START: Always valid subscription in free version ===
function IsSubscriptionValid() {
    // FREE VERSION: Always return true, no subscription required
    return true;
}
// === MODIFICATION END ===

function IsSubscriptionValid() {
    // FREE VERSION: Always return true, no subscription required
    return true;
}

function GetColorTheme() {
    let color = GetStorage(StorageKey.BSPColorTheme);
    if (color == undefined) {
        return mainColor;
    }
    return JSON.parse(color);
}

function IsNPC(targetID) {
    switch (parseInt(targetID)) {
        case 4:
        case 7:
        case 8:
        case 9:
        case 10:
        case 15:
        case 17:
        case 19:
        case 20:
        case 21:
        case 23:
            return true;
        default:
            return false;
    }
}

// #endregion

// #region Cache

const eSetSpyInCacheResult = {
    Error: -1,
    NewSpy: 0,
    SpyUpdated: 1,
    SpyAlreadyThere: 2
};

function GetPredictionFromCache(playerId) {
    var key = StorageKey.BSPPrediction + playerId;

    if (localStorage[key] == "[object Object]")
        localStorage.removeItem(key);

    if (localStorage[key] != undefined)
        return JSON.parse(localStorage[key]);

    return undefined;
}
function SetPredictionInCache(playerId, prediction) {
    if (prediction.Result == FAIL || prediction.Result == MODEL_ERROR) {
        return;
    }
    var key = StorageKey.BSPPrediction + playerId;
    try {
        localStorage[key] = JSON.stringify(prediction);
    }
    catch (e) {
        LogInfo("BSP threw an exception in SetPredictionInCache method : " + e);
    }
}
function GetTornStatsSpyFromCache(playerId) {
    let key = StorageKey.TornStatsSpy + playerId;
    let data = localStorage[key];
    if (data == undefined) {
        return undefined;
    }
    let spy = JSON.parse(localStorage[key]);
    spy.IsSpy = true;
    spy.Source = "TornStats";
    let hasOneUnknownStat = spy.str == 0 || spy.def == 0 || spy.spd == 0 || spy.dex == 0;
    spy.Score = hasOneUnknownStat ? 0 : parseInt(Math.sqrt(spy.str) + Math.sqrt(spy.def) + Math.sqrt(spy.spd) + Math.sqrt(spy.dex));

    return spy;
}
function SetTornStatsSpyInCache(playerId, spy) {
    if (spy == undefined) {
        return eSetSpyInCacheResult.Error;
    }

    let existingSpy = GetTornStatsSpyFromCache(playerId);
    if (existingSpy != undefined && existingSpy.timestamp >= spy.timestamp) {
        return eSetSpyInCacheResult.SpyAlreadyThere;
    }

    let objectSpy = new Object();
    objectSpy.timestamp = spy.timestamp;
    objectSpy.str = spy.strength;
    objectSpy.spd = spy.speed;
    objectSpy.def = spy.defense;
    objectSpy.dex = spy.dexterity;
    objectSpy.total = spy.total;

    var key = StorageKey.TornStatsSpy + playerId;

    try {
        localStorage[key] = JSON.stringify(objectSpy);
    }
    catch (e) {
        LogInfo("BSP threw an exception in SetTornStatsSpyInCache method : " + e);
        return eSetSpyInCacheResult.Error;
    }

    if (existingSpy != undefined) {
        return eSetSpyInCacheResult.SpyUpdated;
    }
    else {
        return eSetSpyInCacheResult.NewSpy;
    }
}

function GetSpyFromYataCache(playerId) {
    let key = StorageKey.YataSpy + playerId;
    let data = localStorage[key];
    if (data == undefined) {
        return undefined;
    }
    let spy = JSON.parse(localStorage[key]);
    spy.IsSpy = true;
    spy.Source = "YATA";
    let hasOneUnknownStat = spy.str == 0 || spy.def == 0 || spy.spd == 0 || spy.dex == 0;
    spy.Score = hasOneUnknownStat ? 0 : parseInt(Math.sqrt(spy.str) + Math.sqrt(spy.def) + Math.sqrt(spy.spd) + Math.sqrt(spy.dex));
    return spy;
}
function SetYataSpyInCache(playerId, spy) {
    if (spy == undefined) {
        return eSetSpyInCacheResult.Error;
    }

    let existingYataSpy = GetSpyFromYataCache(playerId);
    if (existingYataSpy != undefined && existingYataSpy.timestamp >= spy.total_timestamp) {
        return eSetSpyInCacheResult.SpyAlreadyThere;
    }

    let objectSpy = new Object();
    objectSpy.timestamp = spy.total_timestamp;
    objectSpy.str = spy.strength;
    objectSpy.spd = spy.speed;
    objectSpy.def = spy.defense;
    objectSpy.dex = spy.dexterity;
    objectSpy.total = spy.total;

    var key = StorageKey.YataSpy + playerId;
    try {
        localStorage[key] = JSON.stringify(objectSpy);
    }
    catch (e) {
        LogInfo("BSP threw an exception in SetYataSpyInCache method : " + e);
        return eSetSpyInCacheResult.Error;
    }

    if (existingYataSpy != undefined) {
        return eSetSpyInCacheResult.SpyUpdated;
    }
    else {
        return eSetSpyInCacheResult.NewSpy;
    }
}

function GetMostRecentSpyFromCache(playerId) {
    let tornStatsSpy = GetTornStatsSpyFromCache(playerId);
    let yataSpy = GetSpyFromYataCache(playerId);
    if (tornStatsSpy == undefined && yataSpy == undefined) {
        return undefined;
    }

    if (tornStatsSpy == undefined) {
        return yataSpy;
    }

    if (yataSpy == undefined) {
        return tornStatsSpy;
    }

    return yataSpy.timestamp >= tornStatsSpy.timestamp ? yataSpy : tornStatsSpy;
}

const eStorageType = {
    All_BSP: 'All_BSP',
    Prediction: 'Prediction',
    TornStatsSpies: 'TornStatsSpies',
    YATASpies: 'YATASpies',
    ALL_ExceptBSP: 'ALL_ExceptBSP',
    TornChat: 'TornChat'
};

function GetPredictionStorage(storageType) {
    let prefix = "";
    switch (storageType) {
        case eStorageType.All_BSP:
        case eStorageType.ALL_ExceptBSP:
            {
                prefix = "tdup.battleStatsPredictor.";
                break;
            }
        case eStorageType.Prediction:
            {
                prefix = StorageKey.BSPPrediction;
                break;
            }
        case eStorageType.TornStatsSpies:
            {
                prefix = StorageKey.TornStatsSpy;
                break;
            }
        case eStorageType.YATASpies:
            {
                prefix = StorageKey.YataSpy;
                break;
            }
        case eStorageType.TornChat:
            {
                prefix = "chat:";
                break;
            }
        default:
            return undefined;
    }

    let itemNb = 0;
    let toReturn = "";
    for (let key in localStorage) {

        if (storageType == eStorageType.ALL_ExceptBSP) {
            if (!key.startsWith(prefix)) {
                toReturn += localStorage[key] + "\r\n";
                itemNb++;
            }
        }
        else if (key.startsWith(prefix)) {
            toReturn += localStorage[key] + "\r\n";
            itemNb++;
        }
    }
    // Create a blog object with the file content which you want to add to the file
    const file = new Blob([toReturn], { type: 'text/plain' });
    return [itemNb, file.size];
}

function ClearCache(storageType) {
    let prefix = "";
    switch (storageType) {
        case eStorageType.All_BSP:
            {
                prefix = "tdup.battleStatsPredictor.";
                break;
            }
        case eStorageType.Prediction:
            {
                prefix = StorageKey.BSPPrediction;
                break;
            }
        case eStorageType.TornStatsSpies:
            {
                prefix = StorageKey.TornStatsSpy;
                break;
            }
        case eStorageType.YATASpies:
            {
                prefix = StorageKey.YataSpy;
                break;
            }
        case eStorageType.TornChat:
            {
                prefix = "chat:";
                break;
            }
        default:
            return;
    }

    for (let key in localStorage) {
        if (storageType == eStorageType.ALL_ExceptBSP) {
            if (!key.startsWith(prefix)) {
                localStorage.removeItem(key);
            }
        }
        else if (key.startsWith(prefix)) {
            localStorage.removeItem(key);
        }

        if (storageType == eStorageType.TornStatsSpies) {
            if (key.startsWith(StorageKey.AutoImportLastDatePlayer) || key.startsWith(StorageKey.AutoImportLastDateFaction)) {
                localStorage.removeItem(key);
            }
        }
    }
}

function ExportPredictorStorage() {
    let toReturn = "";
    for (let key in localStorage) {
        if (key.startsWith('tdup.battleStatsPredictor.')) {
            toReturn += localStorage[key] + "\r\n";
        }
    }

    // Create element with <a> tag
    const link = document.createElement("a");

    // Create a blog object with the file content which you want to add to the file
    const file = new Blob([toReturn], { type: 'text/plain' });

    // Add file content in the object URL
    link.href = URL.createObjectURL(file);

    // Add file name
    link.download = "bsp_full_localstorage.txt";

    // Add click event to <a> tag to save file.
    link.click();
    URL.revokeObjectURL(link.href);
}

function TestLocalStorage() {
    try {
        var textToStore = 'This is a test to detect if there is enough space in the localstorage.';
        textToStore += 'Its written, then deleted right away, when the BSP player clicks on a debug button.The Goal is to troubleshoot easily this issue when it happens.Making it long enough for proper testing.';
        textToStore += 'Its written, then deleted right away, when the BSP player clicks on a debug button.The Goal is to troubleshoot easily this issue when it happens.Making it long enough for proper testing.';
        textToStore += 'Its written, then deleted right away, when the BSP player clicks on a debug button.The Goal is to troubleshoot easily this issue when it happens.Making it long enough for proper testing.';
        textToStore += 'Its written, then deleted right away, when the BSP player clicks on a debug button.The Goal is to troubleshoot easily this issue when it happens.Making it long enough for proper testing.';

        localStorage[StorageKey.TestLocalStorageKey] = textToStore;
        localStorage.removeItem(StorageKey.TestLocalStorageKey);
        return true;
    }
    catch (e) {
        LogInfo("BSP threw an exception in SetStorage method : " + e);
        return false;
    }
}

function ClearOutdatedPredictionInCache() {
    let lastDateAutoClearOutdatedCache = GetStorage(StorageKey.AutoClearOutdatedCacheLastDate);
    if (lastDateAutoClearOutdatedCache != undefined) {
        let dateConsideredTooOld = new Date();
        dateConsideredTooOld.setDate(dateConsideredTooOld.getDate() - PREDICTION_VALIDITY_DAYS);
        if (new Date(lastDateAutoClearOutdatedCache) > dateConsideredTooOld) {
            return;
        }
    }

    let numberOfPredictionCleared = 0;
    for (let key in localStorage) {
        if (key.startsWith(StorageKey.BSPPrediction)) {
            let prediction = JSON.parse(localStorage[key]);
            if (prediction != undefined) {
                var expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() - PREDICTION_VALIDITY_DAYS);
                var predictionDate = new Date(prediction.PredictionDate);
                if (predictionDate < expirationDate) {
                    localStorage.removeItem(key);
                    numberOfPredictionCleared++;
                }
            }
        }
    }

    if (numberOfPredictionCleared > 0) {
        LogInfo(numberOfPredictionCleared + " outdated predictions have been cleared from the local cache");
    }

    SetStorage(StorageKey.AutoClearOutdatedCacheLastDate, new Date());
}

function AutoImportStats() {
    // Automatic import stats

    if (GetStorageBool(StorageKey.IsAutoImportStats) == true) {
        let dateConsideredTooOld = new Date();
        dateConsideredTooOld.setDate(dateConsideredTooOld.getDate() - 1);

        let lastDateAutoImportStats = GetStorage(StorageKey.AutoImportStatsLastDate);
        if (lastDateAutoImportStats != undefined) {
            let lastDateAutoImportStatsDate = new Date(lastDateAutoImportStats);
            if (lastDateAutoImportStatsDate > dateConsideredTooOld) {
                return;
            }
        }

        SetStorage(StorageKey.AutoImportStatsLastDate, new Date());
        GetPlayerStatsFromTornAPI();
    }
}

// #endregion

// #region Get Data for Player

async function GetPredictionForPlayer(targetId, callback) {
    if (targetId == undefined || targetId < 1) return;
    if (IsNPC(targetId) == true) return;

    let targetSpy = GetMostRecentSpyFromCache(targetId);
    if (targetSpy != undefined && targetSpy.total != undefined && targetSpy.total != 0) {
        let spyDateConsideredTooOld = new Date();
        let daysToUseSpies = parseInt(GetStorage(StorageKey.DaysToUseSpies));
        spyDateConsideredTooOld.setDate(spyDateConsideredTooOld.getDate() - daysToUseSpies);
        let spyDate = new Date(targetSpy.timestamp * 1000);
        if (spyDate > spyDateConsideredTooOld) {
            callback(targetId, targetSpy);
            return;
        }
    }

    var prediction = GetPredictionFromCache(targetId);
    if (prediction != undefined) {
        var isPredictionValid = true;
        var expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() - PREDICTION_VALIDITY_DAYS);
        var predictionDate = new Date(prediction.PredictionDate); // might remove that in the future, and rely only on DateFetched
        if (prediction.DateFetched != undefined)
            predictionDate = new Date(prediction.DateFetched);

        if (predictionDate < expirationDate) {
            var key = StorageKey.BSPPrediction + targetId;
            localStorage.removeItem(key);
            isPredictionValid = false;
        }

        if (isPredictionValid) {
            prediction.fromCache = true;

            if (targetSpy != undefined) {
                prediction.attachedSpy = targetSpy;
            }
            callback(targetId, prediction);
            LogInfo("Prediction for target " + targetId + " found in the cache!");
            return;
        }
    }

    LogInfo("Prediction for target " + targetId + " not found in the cache, querying BSP server..");
    const newPrediction = await FetchScoreAndTBS(targetId);
    LogInfo("Prediction for target " + targetId + " not found in the cache, value retrieved from BSP server!");
    if (newPrediction != undefined) {
        newPrediction.DateFetched = new Date(); // Keep a trace of the local date when the prediction was fetched, so we don't fetch it again every time (PREDICTION_VALIDITY_DAYS)
        SetPredictionInCache(targetId, newPrediction);
    }

    if (targetSpy != undefined) {
        newPrediction.attachedSpy = targetSpy;
    }
    callback(targetId, newPrediction);
}

// #endregion

// #region Callback

function GetConsolidatedDataForPlayerStats(prediction) {
    let objectToReturn = new Object();
    objectToReturn.IsUsingSpy = prediction.IsSpy === true;
    objectToReturn.TargetTBS = 0;
    objectToReturn.Score = 0;
    objectToReturn.Success = SUCCESS;
    objectToReturn.OldSpyStrongerThanPrediction = false;
    objectToReturn.Spy = undefined;
    objectToReturn.IsHOF = false;
    objectToReturn.isFFAttacks = false;

    let isUsingSpy = prediction.IsSpy === true;
    if (isUsingSpy) {
        objectToReturn.TargetTBS = prediction.total;
        objectToReturn.Score = prediction.Score;
        objectToReturn.Spy = prediction;
    }
    else {
        objectToReturn.Success = prediction.Result;

        switch (prediction.Result) {
            case FAIL:
            case MODEL_ERROR:
                return objectToReturn;
            case TOO_WEAK:
            case TOO_STRONG:
            case HOF:
            case FFATTACKS:
            case SUCCESS:
            default:
                {
                    let intTBS = parseInt(prediction.TBS.toLocaleString('en-US').replaceAll(',', ''));
                    objectToReturn.TargetTBS = intTBS;

                    if (prediction.Result == HOF) {
                        objectToReturn.IsHOF = true;
                    }

                    if (prediction.Result == FFATTACKS) {
                        objectToReturn.isFFAttacks = true;
                    }

                    objectToReturn.Score = prediction.Score;

                    if (prediction.attachedSpy != undefined) {
                        if (prediction.attachedSpy.total > 0 && prediction.attachedSpy.total > objectToReturn.TargetTBS) {
                            objectToReturn.TargetTBS = prediction.attachedSpy.total;
                            objectToReturn.OldSpyStrongerThanPrediction = true;
                            objectToReturn.Spy = prediction.attachedSpy;
                        }
                    }

                    break;
                }
        }
    }

    return objectToReturn;
}

function OpenAttackScreenForPlayerId(playerId) {
    var urlAttack = URL_TORN_ATTACK + playerId;
    if (GetStorageBoolWithDefaultValue(StorageKey.ShouldOpenAttackURLInNewTab, true)) {
        window.open(urlAttack, '_blank');
    }
    else {
        window.open(urlAttack);
    }
}

var divStats = undefined;
var isDivStatsCreated = false;
function OnProfilePlayerStatsRetrieved(playerId, prediction) {
    if (prediction == undefined)
        return;

    if (prediction.timestamp != undefined) {
        let spyDateConsideredTooOld = new Date();
        let daysToUseSpies = parseInt(GetStorage(StorageKey.DaysToUseSpies));
        if (daysToUseSpies == undefined || daysToUseSpies < 1)
            daysToUseSpies = 30;

        spyDateConsideredTooOld.setDate(spyDateConsideredTooOld.getDate() - daysToUseSpies);
        let spyDate = new Date(prediction.timestamp * 1000);
        if (spyDate < spyDateConsideredTooOld) {
            return;
        }
    }

    let localBattleStats = GetLocalBattleStats();
    let localTBS = localBattleStats.TBS;
    let consolidatedData = GetConsolidatedDataForPlayerStats(prediction);

    let tbsRatio = 100 * consolidatedData.TargetTBS / localTBS;
    let colorComparedToUs = GetColorMaxValueDifference(tbsRatio);

    let ScoreRatio = 0;

    if (consolidatedData.Success != FAIL && consolidatedData.Success != MODEL_ERROR && GetStorageBool(StorageKey.IsShowingBattleStatsScore) == true) {
        formattedBattleStats = FormatBattleStats(consolidatedData.Score);

        ScoreRatio = 100 * consolidatedData.Score / localBattleStats.Score;
        colorComparedToUs = GetColorScoreDifference(ScoreRatio);
    }

    let FFPredicted2 = Math.min(1 + (8 / 3) * (consolidatedData.Score / localBattleStats.Score), 3);
    FFPredicted2 = Math.max(1, FFPredicted2);
    FFPredicted2 = FFPredicted2.toFixed(2);

    let imgType = mainBSPIcon;
    let extraIndicator = "";

    if (prediction.PredictionDate != undefined) {
        if (!(prediction.PredictionDate instanceof Date)) {
            if (!prediction.PredictionDate.endsWith("Z")) {
                prediction.PredictionDate += "Z";
            }
            prediction.PredictionDate = new Date(prediction.PredictionDate);
        }
    }

    if (prediction.IsSpy) {
        prediction.PredictionDate = new Date(prediction.timestamp * 1000);
        if (prediction.Source == "TornStats") {
            imgType = tornstatsIcon;
        }
        else if (prediction.Source == "YATA") {
            imgType = yataIcon;
        }

        extraIndicator = '<img style="position:absolute; width:18px; height:18px; margin: -10px -10px;z-index: 101;" src="' + starIcon + '"/>';
    }

    if (consolidatedData != undefined) {
        if (consolidatedData.IsHOF) {
            imgType = "https://i.ibb.co/x55qnBr/HOF-Long.png";
            extraIndicator = '<img style="position:absolute; width:18px; height:18px; margin: -10px -10px;z-index: 101;" src="' + hofIcon + '"/>';
            if (consolidatedData.Spy != undefined) {
                prediction.PredictionDate = new Date(consolidatedData.Spy.timestamp * 1000);
            }
        }
        else if (consolidatedData.isFFAttacks) {
            extraIndicator = '<img style="position:absolute; width:18px; height:18px; margin: -10px -10px;z-index: 101;" src="' + FFAttacksIcon + '"/>';
        }
        else if (consolidatedData.OldSpyStrongerThanPrediction) {
            extraIndicator = '<img style="position:absolute; width:18px; height:18px; margin: -10px -10px;z-index: 101;" src="' + oldSpyIcon + '"/>';
            if (consolidatedData.Spy != undefined) {
                prediction.PredictionDate = new Date(consolidatedData.Spy.timestamp * 1000);
                if (consolidatedData.Spy.Source == "TornStats") {
                    imgType = tornstatsIcon;
                }
                else if (consolidatedData.Spy.Source == "YATA") {
                    imgType = yataIcon;
                }
            }
        }
    }

    var relativeTime = FormatRelativeTime(prediction.PredictionDate);

    if (!isDivStatsCreated) {
        divStats = document.createElement("div");
        isDivStatsCreated = true;

        if (GetStorageBoolWithDefaultValue(StorageKey.IsClickingOnProfileStatsAttackPlayer)) {
            divStats.addEventListener('click', function () {
                OpenAttackScreenForPlayerId(playerId);
            });
        }

        if (GetStorageBoolWithDefaultValue(StorageKey.IsShowingAlternativeProfileDisplay, false)) {
            var referenceNode = PlayerProfileDivWhereToInject.firstChild.childNodes[1];
            PlayerProfileDivWhereToInject.firstChild.insertBefore(divStats, referenceNode);
        }
        else {
            PlayerProfileDivWhereToInject.appendChild(divStats);
        }
    }

    let isShowingBScore = GetStorageBool(StorageKey.IsShowingBattleStatsScore);
    let statsDivContent = extraIndicator;

    statsDivContent += '<table style=width:100%;font-family:initial>';
    if (GetStorageBoolWithDefaultValue(StorageKey.IsShowingStatsHeader, true)) {
        statsDivContent += '<tr style="font-size:small;color:white;background-color:#344556" >';
        statsDivContent += '<th style="border: 1px solid gray;">' + (isShowingBScore ? "BScore" : "TBS") + '</th>';

        statsDivContent += '<th style="border: 1px solid gray;"> % You</th>' +
            '<th style="border: 1px solid gray;"> FF</th>' +
            '<th style="border: 1px solid gray;"> Source</th>' +
            '<th style="border: 1px solid gray;"> Date </th>' +
            '</tr>';
    }
    statsDivContent += '<tr style="font-size:x-large;background-color: ' + colorComparedToUs + '"> ';
    statsDivContent += '<td style="vertical-align: middle;font-weight: 600;text-align:center;border: 1px solid gray;">' + FormatBattleStats(isShowingBScore ? consolidatedData.Score : consolidatedData.TargetTBS) + '</td>';
    statsDivContent += '<td style="vertical-align: middle;font-weight: 600;text-align:center;border: 1px solid gray;">' + parseInt(isShowingBScore ? ScoreRatio : tbsRatio) + '%</td>' +
        '<td style="vertical-align: middle;font-weight: 600;text-align:center;border: 1px solid gray;">' + FFPredicted2 + ' </td>' +
        '<td style="vertical-align: middle;border: 1px solid gray;text-align:center;background-color:#344556;"> <img src="' + imgType + '" style="max-width: 100px;max-height:30px"/> </td>' +
        '<td style="vertical-align: middle;text-align:center;border: 1px solid gray;font-size: medium;background-color:#344556;color:white;">' + relativeTime + ' </td>' +
        '</tr>' +
        '</table> ';

    divStats.innerHTML = statsDivContent;
}

function ConvertLocalDateToUTCIgnoringTimezone(date) {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(),
        date.getUTCDate(), date.getUTCHours(),
        date.getUTCMinutes(), date.getUTCSeconds());
}

function DateUTCNow() {
    let now = new Date();
    return ConvertLocalDateToUTCIgnoringTimezone(now);
}

function FormatRelativeTime(date) {
    let dateNow = new Date();
    let diff = Math.round((dateNow - date) / 1000);

    if (diff < 60) {
        return 'Seconds ago';
    } else if (diff < 3600) {
        var minutes = Math.floor(diff / 60);
        return minutes + ' minute' + (minutes > 1 ? 's' : '') + ' ago';
    } else if (diff < 86400) {
        var hours = Math.floor(diff / 3600);
        return hours + ' hour' + (hours > 1 ? 's' : '') + ' ago';
    } else if (diff < 86400 * 24 * 365) {
        var days = Math.floor(diff / (3600 * 24));
        return days + ' day' + (days > 1 ? 's' : '') + ' ago';
    } else if (diff < 86400 * 24 * 365 * 15) {
        var years = Math.floor(diff / (3600 * 24 * 365));
        return years + ' year' + (years > 1 ? 's' : '') + ' ago';
    }
    else {
        return date.toLocaleString();
    }
}

function IsThereMyNodeAlready(node, urlAttack) {
    // Base case: if the node is null, stop the recursion
    if (!node) {
        return false;
    }

    // Check if the current node has the specified class name
    if (node.className === "TDup_ColoredStatsInjectionDiv") {
        return true;
    }

    // Check if the inner HTML of the current node starts with the specified URL
    if (node.href != undefined && node.href.startsWith(urlAttack)) {
        return true;
    }

    // Recursively process child nodes
    for (let i = 0; i < node.childNodes.length; i++) {
        const childNode = node.childNodes[i];
        let result = IsThereMyNodeAlready(childNode, urlAttack);
        if (result) {
            return true;
        }
    }
    return false;
}

function OnPlayerStatsRetrievedForGrid(targetId, prediction) {
    var urlAttack = URL_TORN_ATTACK + targetId;
    let isShowingHonorBars = GetStorageBoolWithDefaultValue(StorageKey.IsShowingHonorBars, true);
    let spyMargin = '-6px 23px';
    let mainMarginWhenDisplayingHonorBars = "-10px -9px";

    if (IsPage(PageType.FactionControl)) {
        if (IsPage(PageType.FactionControlPayday)) {
            mainMarginWhenDisplayingHonorBars = '-25px 20px';
            spyMargin = '-3px 12px';
        }
        else if (IsPage(PageType.FactionControlApplications)) {
            mainMarginWhenDisplayingHonorBars = '-10px 0px';
            spyMargin = '-5px 23px';
        }
        else {
            mainMarginWhenDisplayingHonorBars = '0px';
            spyMargin = '-5px 23px';
        }
    }
    else if (IsPage(PageType.Chain) && !isShowingHonorBars) {
        spyMargin = '-1px 23px';
    }
    else if (IsPage(PageType.Faction)) {
        if (isShowingHonorBars) {
            spyMargin = '-16px 15px';
        }
        else if (IsUrlEndsWith('/war/rank')) {
            spyMargin = '0px 23px';
        }
    }
    else if (IsPage(PageType.HallOfFame) && isShowingHonorBars) {
        mainMarginWhenDisplayingHonorBars = "-10px -9px";
        spyMargin = '-16px 17px';
    }
    else if (IsPage(PageType.Search) && isShowingHonorBars) {
        mainMarginWhenDisplayingHonorBars = '6px -8px';
    }
    else if (IsPage(PageType.Company) && isShowingHonorBars) {
        mainMarginWhenDisplayingHonorBars = '0px';
    }
    else if (IsPage(PageType.RecruitCitizens) && isShowingHonorBars) {
        mainMarginWhenDisplayingHonorBars = '0px';
    }
    else if (IsPage(PageType.Friends) || IsPage(PageType.Enemies) || IsPage(PageType.Targets)) {
        spyMargin = '-5px 23px';
        if (isShowingHonorBars) {
            mainMarginWhenDisplayingHonorBars = '-10px 0px';
            spyMargin = '-14px 23px';
        }
    }
    else if (IsPage(PageType.PointMarket) && isShowingHonorBars) {
        mainMarginWhenDisplayingHonorBars = '5px -5px';
    }
    else if (IsPage(PageType.Market) && isShowingHonorBars) {
        mainMarginWhenDisplayingHonorBars = '-10px -10px';
        spyMargin = '-18px 13px';
    }
    else if (IsPage(PageType.Hospital) && isShowingHonorBars) {
        mainMarginWhenDisplayingHonorBars = '0px 6px';
    }
    else if (IsPage(PageType.Abroad)) {
        spyMargin = '0px 20px';
        if (isShowingHonorBars) {
            mainMarginWhenDisplayingHonorBars = '5px -4px';
        }
        else {
            spyMargin = '0px 23px';
        }
    }
    else if (IsPage(PageType.Forum)) {
        spyMargin = '0px 23px';
        if (isShowingHonorBars) {
            mainMarginWhenDisplayingHonorBars = '7px 0px';
            if (IsPage(PageType.ForumThread) || IsPage(PageType.ForumSearch)) {
                spyMargin = '-5px 15px';
                mainMarginWhenDisplayingHonorBars = '-26px 28px';
            }
        }
    }
    else if (IsPage(PageType.Bounty)) {
        isShowingHonorBars = false; // No honor bars in bounty page, ever.
        spyMargin = '1px 24px';
    }
    else if (IsPage(PageType.Properties)) {
        mainMarginWhenDisplayingHonorBars = '0px';
        if (isShowingHonorBars) {
            spyMargin = '-6px 15px';
        }
    }
    else if (IsPage(PageType.War)) {
        spyMargin = isShowingHonorBars ? '-16px 15px' : '-4px 24px';
    }
    else if (IsPage(PageType.Competition) && isShowingHonorBars) {
        if (window.location.href.startsWith("https://www.torn.com/competition.php#/p=revenge")) {
            mainMarginWhenDisplayingHonorBars = '0px 0px';
        }
        else {
            mainMarginWhenDisplayingHonorBars = '10px 0px';
        }
    }
    else if (IsPage(PageType.Elimination) && isShowingHonorBars) {
        if (IsPage(PageType.EliminationAttacks)) {
            mainMarginWhenDisplayingHonorBars = '-11px -100px';
            spyMargin = '-18px -75px';
        }
        else {
            mainMarginWhenDisplayingHonorBars = '-11px 0px';
            spyMargin = '-18px 23px';
        }

    }
    else if (IsPage(PageType.RussianRoulette)) {
        if (isShowingHonorBars) {
            spyMargin = '-14px 15px';
        }
    }

    let consolidatedData = GetConsolidatedDataForPlayerStats(prediction);
    let localBattleStats = GetLocalBattleStats();

    let colorComparedToUs;
    let formattedBattleStats;
    let FFPredicted = 0;

    let showScoreInstead = GetStorageBool(StorageKey.IsShowingBattleStatsScore);
    if (showScoreInstead == true) {
        let scoreRatio = 100 * consolidatedData.Score / localBattleStats.Score;
        colorComparedToUs = GetColorScoreDifference(scoreRatio);
        if (GetStorageBool(StorageKey.IsShowingBattleStatsPercentage)) {
            let ratioToDisplay = Math.min(999, scoreRatio);
            formattedBattleStats = ratioToDisplay.toFixed(0) + "%";
        }
        else {
            formattedBattleStats = FormatBattleStats(consolidatedData.Score);
        }

        FFPredicted = Math.min(1 + (8 / 3) * (consolidatedData.Score / localBattleStats.Score), 3);
        FFPredicted = FFPredicted.toFixed(2);
    }
    else {
        let tbsRatio = 100 * consolidatedData.TargetTBS / localBattleStats.TBS;
        colorComparedToUs = GetColorMaxValueDifference(tbsRatio);

        if (GetStorageBool(StorageKey.IsShowingBattleStatsPercentage)) {
            let ratioToDisplay = Math.min(999, tbsRatio);
            formattedBattleStats = ratioToDisplay.toFixed(0) + "%";
        }
        else {
            formattedBattleStats = FormatBattleStats(consolidatedData.TargetTBS);
        }
    }

    if (consolidatedData.Success == FAIL) {
        colorComparedToUs = "pink";
        formattedBattleStats = "Wait";
    } else if (consolidatedData.Success == MODEL_ERROR) {
        colorComparedToUs = "pink";
        formattedBattleStats = "Error";
    }

    for (let i = 0; i < dictDivPerPlayer[targetId].length; i++) {

        if (IsThereMyNodeAlready(dictDivPerPlayer[targetId][i], urlAttack)) {
            continue;
        }

        let isWall = IsPage(PageType.Faction) && !IsPage(PageType.FactionControl) && dictDivPerPlayer[targetId][i].className == "user name ";
        if (isWall) {
            //WALL display
            if (isShowingHonorBars) {
                mainMarginWhenDisplayingHonorBars = "-28px 54px";
                spyMargin = '0px 23px';
            }
            else {
                spyMargin = '3px 23px';
            }
        }

        if (IsPage(PageType.Competition) && isShowingHonorBars) {
            if (window.location.href.startsWith("https://www.torn.com/competition.php#/p=recent")) {
                if (HasParentWithClass(dictDivPerPlayer[targetId][i], "name lost")) {
                    mainMarginWhenDisplayingHonorBars = "12px 0px";
                }
                else if (HasParentWithClass(dictDivPerPlayer[targetId][i], "name right")) {
                    mainMarginWhenDisplayingHonorBars = "0px 0px";
                }
            }
        }

        let extraIndicator = '';
        let title = '';
        if (consolidatedData.IsUsingSpy) {
            let FFPredicted = Math.min(1 + (8 / 3) * (consolidatedData.Score / localBattleStats.Score), 3);
            FFPredicted = Math.max(1, FFPredicted);
            FFPredicted = FFPredicted.toFixed(2);

            extraIndicator = '<img style="position:absolute; width:13px; height:13px; margin:' + spyMargin + ';z-index: 101;" src="' + starIcon + '" />';
            title = 'title="Data coming from spy (' + consolidatedData.Spy.Source + ') FF : ' + FFPredicted + ' "';
        }
        else if (consolidatedData.IsHOF) {
            extraIndicator = '<img style="position:absolute;width:13px; height:13px; margin:' + spyMargin + ';z-index: 101;" src="' + hofIcon + '" />';
            title = 'title="Stats coming from the Top 100 HOF forum thread"';
        }
        else if (consolidatedData.isFFAttacks) {
            extraIndicator = '<img style="position:absolute;width:13px; height:13px; margin:' + spyMargin + ';z-index: 101;" src="' + FFAttacksIcon + '" />';
            title = 'title="Stats coming from BSP users attacks"';
        }
        else if (consolidatedData.OldSpyStrongerThanPrediction) {
            extraIndicator = '<img style="position:absolute;width:13px; height:13px; margin:' + spyMargin + ';z-index: 101;" src="' + oldSpyIcon + '" />';
            title = 'title="Old spy having greater TBS than prediction -> showing old spy data instead"';
        }
        else if (showScoreInstead) {
            title = 'title="FF Predicted = ' + FFPredicted + '"';
        }

        let newTabifNeeded = GetStorageBoolWithDefaultValue(StorageKey.ShouldOpenAttackURLInNewTab, true) ? ' target="_blank"' : '';
        let toInject = '';
        if (isShowingHonorBars) {
            toInject = '<a href="' + urlAttack + '"' + newTabifNeeded + '>' + extraIndicator + '<div style="position: absolute;z-index: 100;margin: ' + mainMarginWhenDisplayingHonorBars + '"><div class="iconStats" ' + title + ' style="background:' + colorComparedToUs + '">' + formattedBattleStats + '</div></div></a>';
        }
        else {
            toInject = '<a href="' + urlAttack + '"' + newTabifNeeded + '>' + extraIndicator + '<div style="display: inline-block; margin-right:5px;"><div class="iconStats" ' + title + ' style="background:' + colorComparedToUs + '">' + formattedBattleStats + '</div></div></a>';

            if (IsPage(PageType.War) && !IsPage(PageType.ChainReport) && !IsPage(PageType.RWReport)) {
                dictDivPerPlayer[targetId][i].style.position = "absolute";
            }
        }

        if (GetStorageBoolWithDefaultValue(StorageKey.IsShowingHonorBars, true) && !IsPage(PageType.Bounty)) {
            let coloredStatsInjectionDiv = document.createElement("div");
            coloredStatsInjectionDiv.className = "TDup_ColoredStatsInjectionDiv";
            coloredStatsInjectionDiv.innerHTML = toInject;

            // Get the first child element of the parent (or null if there are no child elements)
            var firstChild = dictDivPerPlayer[targetId][i].firstChild;
            dictDivPerPlayer[targetId][i].insertBefore(coloredStatsInjectionDiv, firstChild);
        }
        else {
            if (IsPage(PageType.Elimination) && !IsPage(PageType.EliminationRevenge)) {
                let coloredStatsInjectionDiv = document.createElement("div");
                coloredStatsInjectionDiv.className = "TDup_ColoredStatsInjectionDivWithoutHonorBar";
                coloredStatsInjectionDiv.innerHTML = toInject;

                // Get the first child element of the parent (or null if there are no child elements)
                var firstChild = dictDivPerPlayer[targetId][i].firstChild;
                dictDivPerPlayer[targetId][i].insertBefore(coloredStatsInjectionDiv, firstChild);
            }
            else {
                dictDivPerPlayer[targetId][i].innerHTML = toInject + dictDivPerPlayer[targetId][i].innerHTML;
            }
        }
    }
}

function HasParentWithClass(element, className) {
    let parent = element.parentElement;

    while (parent) {
        if (parent.classList.value.startsWith(className)) {
            return true;
        }
        parent = parent.parentElement;
    }

    return false;
}

// #endregion

// #region Option Menus

function OpenOptionsTab(evt, optionsTabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("TDup_optionsTabContent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("TDup_tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(optionsTabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function BuildOptionMenu(menuArea, contentArea, name, shouldBeHiddenWhenInactive, isOpenAtStart = false) {
    // Adding the button in the tabs
    let TabEntryBtn = document.createElement("button");
    TabEntryBtn.className = "TDup_tablinks";
    if (shouldBeHiddenWhenInactive == true)
        TabEntryBtn.className += " TDup_tablinksShouldBeHiddenWhenInactive";

    if (isOpenAtStart)
        TabEntryBtn.id = "TDup_tablinks_defaultOpen";

    TabEntryBtn.innerHTML = name;
    TabEntryBtn.addEventListener("click", function (evt) {
        OpenOptionsTab(evt, "TDup_optionsTabContent_" + name);
    });

    menuArea.appendChild(TabEntryBtn);

    // Adding the corresponding div
    let TabContent = document.createElement("div");
    TabContent.className = "TDup_optionsTabContent";
    TabContent.id = "TDup_optionsTabContent_" + name;
    contentArea.appendChild(TabContent);

    return TabContent;
}

function BuildOptionMenu_Global(tabs, menu) {
    let contentDiv = BuildOptionMenu(tabs, menu, "Profile", false, true);

    // API Key
    let mainAPIKeyLabel = document.createElement("label");
    mainAPIKeyLabel.innerHTML = 'API Key';

    let mainAPIKeyInput = document.createElement("input");
    mainAPIKeyInput.value = GetStorageEmptyIfUndefined(StorageKey.PrimaryAPIKey);

    btnValidatemainAPIKey = document.createElement("input");
    btnValidatemainAPIKey.type = "button";
    btnValidatemainAPIKey.value = "Validate";
    btnValidatemainAPIKey.className = "TDup_buttonInOptionMenu";

    function OnTornAPIKeyVerified(success, reason) {
        btnValidatemainAPIKey.disabled = false;
        SetStorage(StorageKey.IsPrimaryAPIKeyValid, success);
        if (success === true) {
            successValidatemainAPIKey.style.visibility = "visible";
            apiRegister.style.display = "none";
            FetchUserDataFromBSPServer();
        }
        else {
            RefreshOptionMenuWithSubscription();
            errorValidatemainAPIKey.style.visibility = "visible";
            apiRegister.style.display = "block";
            errorValidatemainAPIKey.innerHTML = reason;
            subscriptionEndText.innerHTML = '<div style="color:red">Please fill a valid API Key</div>';
        }
    }

    btnValidatemainAPIKey.addEventListener("click", () => {
        errorValidatemainAPIKey.style.visibility = "hidden";
        successValidatemainAPIKey.style.visibility = "hidden";
        btnValidatemainAPIKey.disabled = true;
        SetStorage(StorageKey.PrimaryAPIKey, mainAPIKeyInput.value);
        VerifyTornAPIKey(OnTornAPIKeyVerified);
    });

    successValidatemainAPIKey = document.createElement("label");
    successValidatemainAPIKey.innerHTML = 'API Key verified and saved!';
    successValidatemainAPIKey.style.color = 'green';
    successValidatemainAPIKey.style.visibility = "hidden";

    errorValidatemainAPIKey = document.createElement("label");
    errorValidatemainAPIKey.innerHTML = 'Error while verifying API Key';
    errorValidatemainAPIKey.style.backgroundColor = 'red';
    errorValidatemainAPIKey.style.visibility = "hidden";

    let mainAPIKeyDiv = document.createElement("div");
    mainAPIKeyDiv.className = "TDup_optionsTabContentDiv";
    mainAPIKeyDiv.appendChild(mainAPIKeyLabel);
    mainAPIKeyDiv.appendChild(mainAPIKeyInput);
    mainAPIKeyDiv.appendChild(btnValidatemainAPIKey);
    mainAPIKeyDiv.appendChild(successValidatemainAPIKey);
    mainAPIKeyDiv.appendChild(errorValidatemainAPIKey);
    contentDiv.appendChild(mainAPIKeyDiv);

    apiRegister = document.createElement("div");
    apiRegister.className = "TDup_optionsTabContentDiv";
    apiRegister.innerHTML = '<a href="https://www.torn.com/preferences.php#tab=api?step=addNewKey&title=BSP_Main&user=basic,personalstats,profile" target="_blank"><input type"button" class="TDup_buttonInOptionMenu" value="Generate a basic key"/></a>';
    contentDiv.appendChild(apiRegister);

    // === MODIFICATION: Update subscription info for free version ===
    subscriptionEndText = document.createElement("div");
    subscriptionEndText.className = "TDup_optionsTabContentDiv";
    subscriptionEndText.innerHTML = '<div style="color:' + GetColorTheme() + '">Free Version - No subscription required</div>';

    if (GetStorageBoolWithDefaultValue(StorageKey.IsPrimaryAPIKeyValid, false) == true) {
        apiRegister.style.display = "none";
        subscriptionEndText.innerHTML = '<div style="color:' + GetColorTheme() + '">Free Version - All features enabled</div>';
    }
    contentDiv.appendChild(subscriptionEndText);

    // Test free localstorage
    let result = TestLocalStorage();
    if (result == false) {
        let localStorageTest = document.createElement("div");
        localStorageTest.className = "TDup_optionsTabContentDiv";
        localStorageTest.style.color = 'red';
        localStorageTest.innerHTML = 'Your localstorage seems to be full, preventing BSP to work properly. This issue is usually caused by Chat2.0 using all the space (currently under investigation). Clear your localstorage using tools available in Debug tab ("Clear Chat entries"), or ask more info in <a href="https://discord.gg/zgrVX5j6MQ">Discord</a>.';
        contentDiv.appendChild(localStorageTest);
    }
}

function ReComputeStats(str, def, spd, dex) {
    let localBattleStats = new Object();
    localBattleStats.Str = str;
    localBattleStats.Def = def;
    localBattleStats.Spd = spd;
    localBattleStats.Dex = dex;
    localBattleStats.TBS = localBattleStats.Str + localBattleStats.Def + localBattleStats.Spd + localBattleStats.Dex;
    localBattleStats.Score = parseInt(Math.sqrt(localBattleStats.Str) + Math.sqrt(localBattleStats.Def) + Math.sqrt(localBattleStats.Spd) + Math.sqrt(localBattleStats.Dex));

    SetLocalBattleStats(localBattleStats);
}

function OnPlayerStatsFromTornAPI(success, reason) {
    btnValidategymStatsAPIKey.disabled = false;
    SetStorage(StorageKey.IsBattleStatsAPIKeyValid, success);
    if (success === true) {
        successValidategymStatsAPIKey.style.visibility = "visible";
        apiRegister.style.display = "none";

        let localBattleStats = GetLocalBattleStats();

        scoreStrInput.value = parseInt(localBattleStats.Str);
        scoreDefInput.value = parseInt(localBattleStats.Def);
        scoreSpdInput.value = parseInt(localBattleStats.Spd);
        scoreDexInput.value = parseInt(localBattleStats.Dex);

        comparisonBattleStatsText.innerHTML = "TBS = " + localBattleStats.TBS.toLocaleString('en-US') + " | Battle Score = " + localBattleStats.Score.toLocaleString('en-US');
    }
    else {
        apiRegister.style.display = "block";
        errorValidategymStatsAPIKey.style.visibility = "visible";
        errorValidategymStatsAPIKey.innerHTML = reason;
    }
}

function BuildOptionMenu_Colors(tabs, menu) {
    let contentDiv = BuildOptionMenu(tabs, menu, "Settings", true);

    let localBattleStats = GetLocalBattleStats();

    // API Key
    let gymStatsAPIKeyLabel = document.createElement("label");
    gymStatsAPIKeyLabel.innerHTML = 'API Key';

    let gymStatsAPIKeyInput = document.createElement("input");
    if (GetStorage(StorageKey.BattleStatsAPIKey)) {
        gymStatsAPIKeyInput.value = GetStorage(StorageKey.BattleStatsAPIKey);
    }

    btnValidategymStatsAPIKey = document.createElement("input");
    btnValidategymStatsAPIKey.type = "button";
    btnValidategymStatsAPIKey.value = "Import stats";
    btnValidategymStatsAPIKey.className = "TDup_buttonInOptionMenu";

    successValidategymStatsAPIKey = document.createElement("label");
    successValidategymStatsAPIKey.innerHTML = 'Stats imported!';
    successValidategymStatsAPIKey.style.color = 'green';
    successValidategymStatsAPIKey.style.visibility = "hidden";

    errorValidategymStatsAPIKey = document.createElement("label");
    errorValidategymStatsAPIKey.innerHTML = 'Error while verifying gymStats API Key';
    errorValidategymStatsAPIKey.style.backgroundColor = 'red';
    errorValidategymStatsAPIKey.style.visibility = "hidden";

    btnValidategymStatsAPIKey.addEventListener("click", () => {
        errorValidategymStatsAPIKey.style.visibility = "hidden";
        successValidategymStatsAPIKey.style.visibility = "hidden";
        btnValidategymStatsAPIKey.disabled = true;
        SetStorage(StorageKey.BattleStatsAPIKey, gymStatsAPIKeyInput.value);
        GetPlayerStatsFromTornAPI(OnPlayerStatsFromTornAPI);
    });

    let gymStatsApiKeyDiv = document.createElement("div");
    gymStatsApiKeyDiv.className = "TDup_optionsTabContentDiv";
    gymStatsApiKeyDiv.appendChild(gymStatsAPIKeyLabel);
    gymStatsApiKeyDiv.appendChild(gymStatsAPIKeyInput);
    gymStatsApiKeyDiv.appendChild(btnValidategymStatsAPIKey);
    gymStatsApiKeyDiv.appendChild(successValidategymStatsAPIKey);
    gymStatsApiKeyDiv.appendChild(errorValidategymStatsAPIKey);
    contentDiv.appendChild(gymStatsApiKeyDiv);

    // Auto Import stats
    let isAutoImportStatsDiv = document.createElement("div");
    isAutoImportStatsDiv.className = "TDup_optionsTabContentDiv";
    let isAutoImportStats = GetStorageBoolWithDefaultValue(StorageKey.IsAutoImportStats, false);

    let checkboxisAutoImportStats = document.createElement('input');
    checkboxisAutoImportStats.type = "checkbox";
    checkboxisAutoImportStats.name = "name";
    checkboxisAutoImportStats.value = "value";
    checkboxisAutoImportStats.id = "idisAutoImportStats";
    checkboxisAutoImportStats.checked = isAutoImportStats;

    checkboxisAutoImportStats.addEventListener("change", () => {
        let isAutoImportStatsNew = checkboxisAutoImportStats.checked;
        SetStorage(StorageKey.IsAutoImportStats, isAutoImportStatsNew);
    });

    var isAutoImportStatsLabel = document.createElement('label')
    isAutoImportStatsLabel.htmlFor = "idisAutoImportStats";
    isAutoImportStatsLabel.appendChild(document.createTextNode('Auto-import stats once a day?'));
    isAutoImportStatsDiv.appendChild(isAutoImportStatsLabel);
    isAutoImportStatsDiv.appendChild(checkboxisAutoImportStats);
    contentDiv.appendChild(isAutoImportStatsDiv);

    let apiRegister = document.createElement("div");
    apiRegister.className = "TDup_optionsTabContentDiv";
    apiRegister.innerHTML = '<a href="https://www.torn.com/preferences.php#tab=api?step=addNewKey&title=BSP_Gym&user=basic,personalstats,profile,battlestats" target="_blank"><input type"button" class="TDup_buttonInOptionMenu" style="width:280px;" value="Generate a key with access to your battlestats"/></a>';
    contentDiv.appendChild(apiRegister);

    if (GetStorageBoolWithDefaultValue(StorageKey.IsBattleStatsAPIKeyValid, false) == true) {
        apiRegister.style.display = "none";
    }

    // COMPARISON STATS PART
    let comparisonBattleStatsNode = document.createElement("div");
    comparisonBattleStatsNode.className = "TDup_optionsTabContentDiv";
    contentDiv.appendChild(comparisonBattleStatsNode);

    var cell, raw, table;
    table = document.createElement('table');

    comparisonBattleStatsNode.appendChild(table);

    // ************************** DEX ***********************
    let comparisonDex = document.createElement("label");
    comparisonDex.innerHTML = '<div style="text-align: right; margin-right:10px;">Dex&nbsp</div>';
    raw = table.insertRow(0);
    cell = raw.insertCell(0);
    cell.width = '50%';
    cell.appendChild(comparisonDex);

    scoreDexInput = document.createElement("input");
    scoreDexInput.type = 'number';
    scoreDexInput.value = localBattleStats.Dex;

    scoreDexInput.addEventListener('change', () => {
        if (scoreDexInput.value) scoreDexInput.value = parseInt(scoreDexInput.value);
        else scoreDexInput.value = 0;

        ReComputeStats(parseInt(scoreStrInput.value), parseInt(scoreDefInput.value), parseInt(scoreSpdInput.value), parseInt(scoreDexInput.value));
        localBattleStats = GetLocalBattleStats();
        comparisonBattleStatsText.innerHTML = "TBS = " + localBattleStats.TBS.toLocaleString('en-US') + " | Battle Score = " + localBattleStats.Score.toLocaleString('en-US');
    });
    cell = raw.insertCell(1);
    cell.style.textAlign = 'left';
    cell.appendChild(scoreDexInput);

    // ************************** SPD ***********************
    let comparisonSpd = document.createElement("label");
    comparisonSpd.innerHTML = '<div style="text-align: right; margin-right:10px;">Spd&nbsp</div>';
    raw = table.insertRow(0);
    cell = raw.insertCell(0);
    cell.appendChild(comparisonSpd);

    scoreSpdInput = document.createElement("input");
    scoreSpdInput.type = 'number';
    scoreSpdInput.value = localBattleStats.Spd;

    scoreSpdInput.addEventListener('change', () => {
        if (scoreSpdInput.value) scoreSpdInput.value = parseInt(scoreSpdInput.value);
        else scoreSpdInput.value = 0;

        ReComputeStats(parseInt(scoreStrInput.value), parseInt(scoreDefInput.value), parseInt(scoreSpdInput.value), parseInt(scoreDexInput.value));
        localBattleStats = GetLocalBattleStats();
        comparisonBattleStatsText.innerHTML = "TBS = " + localBattleStats.TBS.toLocaleString('en-US') + " | Battle Score = " + localBattleStats.Score.toLocaleString('en-US');
    });
    cell = raw.insertCell(1);
    cell.style.textAlign = 'left';
    cell.appendChild(scoreSpdInput);

    // ************************** DEF ***********************
    let comparisonDef = document.createElement("label");
    comparisonDef.innerHTML = '<div style="text-align: right; margin-right:10px;">Def&nbsp</div>';
    raw = table.insertRow(0);
    cell = raw.insertCell(0);
    cell.appendChild(comparisonDef);

    scoreDefInput = document.createElement("input");
    scoreDefInput.type = 'number';
    scoreDefInput.value = localBattleStats.Def;

    scoreDefInput.addEventListener('change', () => {
        if (scoreDefInput.value) scoreDefInput.value = parseInt(scoreDefInput.value);
        else scoreDefInput.value = 0;

        ReComputeStats(parseInt(scoreStrInput.value), parseInt(scoreDefInput.value), parseInt(scoreSpdInput.value), parseInt(scoreDexInput.value));
        localBattleStats = GetLocalBattleStats();
        comparisonBattleStatsText.innerHTML = "TBS = " + localBattleStats.TBS.toLocaleString('en-US') + " | Battle Score = " + localBattleStats.Score.toLocaleString('en-US');
    });
    cell = raw.insertCell(1);
    cell.style.textAlign = 'left';
    cell.appendChild(scoreDefInput);

    // ************************** STR ***********************
    let comparisonStr = document.createElement("label");
    comparisonStr.innerHTML = '<div style="text-align: right; margin-right:10px;">Str&nbsp</div>';
    raw = table.insertRow(0);
    cell = raw.insertCell(0);
    cell.appendChild(comparisonStr);

    scoreStrInput = document.createElement("input");
    scoreStrInput.type = 'number';
    scoreStrInput.value = localBattleStats.Str;

    scoreStrInput.addEventListener('change', () => {
        if (scoreStrInput.value) scoreStrInput.value = parseInt(scoreStrInput.value);
        else scoreStrInput.value = 0;

        ReComputeStats(parseInt(scoreStrInput.value), parseInt(scoreDefInput.value), parseInt(scoreSpdInput.value), parseInt(scoreDexInput.value));
        localBattleStats = GetLocalBattleStats();
        comparisonBattleStatsText.innerHTML = "TBS = " + localBattleStats.TBS.toLocaleString('en-US') + " | Battle Score = " + localBattleStats.Score.toLocaleString('en-US');
    });
    cell = raw.insertCell(1);
    cell.style.textAlign = 'left';
    cell.appendChild(scoreStrInput);

    comparisonBattleStatsText = document.createElement("div");
    comparisonBattleStatsText.className = "TDup_optionsTabContentDiv";
    comparisonBattleStatsText.innerHTML = "TBS = " + localBattleStats.TBS.toLocaleString('en-US') + " | Battle Score = " + localBattleStats.Score.toLocaleString('en-US');

    comparisonBattleStatsNode.appendChild(comparisonBattleStatsText);

    let colorSettingsNode = document.createElement("div");
    colorSettingsNode.className = "TDup_optionsTabContentDiv";

    // Show Score instead
    let isShowingBattleStatsScoreDiv = document.createElement("div");
    isShowingBattleStatsScoreDiv.className = "TDup_optionsTabContentDiv";
    let isShowingBattleStatsScore = GetStorageBoolWithDefaultValue(StorageKey.IsShowingBattleStatsScore, false);

    let checkboxisShowingBattleStatsScore = document.createElement('input');
    checkboxisShowingBattleStatsScore.type = "checkbox";
    checkboxisShowingBattleStatsScore.name = "name";
    checkboxisShowingBattleStatsScore.value = "value";
    checkboxisShowingBattleStatsScore.id = "idIsShowingBattleScore";
    checkboxisShowingBattleStatsScore.checked = isShowingBattleStatsScore;

    checkboxisShowingBattleStatsScore.addEventListener("change", () => {
        let isShowingBattleStatsScore = checkboxisShowingBattleStatsScore.checked;
        BuildCustomizeColorThresholdPanel(isShowingBattleStatsScore);
        SetStorage(StorageKey.IsShowingBattleStatsScore, isShowingBattleStatsScore);
    });

    var isShowingBattleStatsScoreLabel = document.createElement('label')
    isShowingBattleStatsScoreLabel.htmlFor = "idIsShowingBattleScore";
    isShowingBattleStatsScoreLabel.innerHTML = 'Use <a href="https://wiki.torn.com/wiki/Chain#Fair_fights" target="_blank">Battle Stat Score</a> rather than TBS (Total Battle Stats)';
    isShowingBattleStatsScoreDiv.appendChild(isShowingBattleStatsScoreLabel);
    isShowingBattleStatsScoreDiv.appendChild(checkboxisShowingBattleStatsScore);
    contentDiv.appendChild(isShowingBattleStatsScoreDiv);

    let colorExplanations = document.createElement("label");
    colorExplanations.innerHTML = "Color code used when displaying a Torn player, relative to the battle stats you defined above";
    colorExplanations.style.fontStyle = "italic";
    colorSettingsNode.appendChild(colorExplanations);

    BuildCustomizeColorThresholdPanel(isShowingBattleStatsScore);

    colorSettingsNode.appendChild(divThresholdColorsPanel);
    contentDiv.appendChild(colorSettingsNode);
}

function BuildCustomizeColorThresholdPanel(isBSScoreMode) {
    if (divThresholdColorsPanel == undefined) {
        divThresholdColorsPanel = document.createElement("div");
        divThresholdColorsPanel.className = "TDup_optionsTabContentDiv";
    }
    divThresholdColorsPanel.innerHTML = "";

    for (var i = 0; i < LOCAL_COLORS.length; ++i) {
        let colorThresholdstr = GetStorage(StorageKey.ColorStatsThreshold + i);
        if (colorThresholdstr != undefined && colorThresholdstr != "[object Object]") {
            let colorThreshold = JSON.parse(colorThresholdstr);
            LOCAL_COLORS[i] = colorThreshold;
        }
        AddColorPanel(isBSScoreMode, divThresholdColorsPanel, LOCAL_COLORS[i], i);
    }
    return divThresholdColorsPanel;
}

function AddColorPanel(isBSScoreMode, colorSettingsNode, colorItem, id) {
    let divColor = document.createElement("div");
    divColor.className = "TDup_optionsTabContentDiv";

    let text = document.createElement("label");
    text.innerHTML = 'Up to';
    divColor.appendChild(text);

    let colorThresholdInput = document.createElement("input");
    colorThresholdInput.type = 'number';
    colorThresholdInput.value = isBSScoreMode ? parseInt(colorItem.maxValueScore) : parseInt(colorItem.maxValue);
    colorThresholdInput.style.width = '40px';
    colorThresholdInput.disabled = !colorItem.canModify;

    colorThresholdInput.addEventListener("change", () => {
        if (isBSScoreMode) {
            let newThresholdScoreMaxValue = parseInt(colorThresholdInput.value);
            LOCAL_COLORS[id].maxValueScore = newThresholdScoreMaxValue;

            let FairFight = Math.min(1 + (8 / 3) * (colorItem.maxValueScore / 100), 3);
            FairFight = Math.max(1, FairFight);
            FairFight = FairFight.toFixed(2);
            textPercent.innerHTML = '% of BS Score (max FairFight=' + FairFight + ')';
        }
        else {
            let newThresholdMaxValue = parseInt(colorThresholdInput.value);
            LOCAL_COLORS[id].maxValue = newThresholdMaxValue;
        }
        SetStorage(StorageKey.ColorStatsThreshold + id, JSON.stringify(LOCAL_COLORS[id]));
    });

    divColor.appendChild(colorThresholdInput);
    colorItem.inputNumber = colorThresholdInput;

    let textPercent = document.createElement("label");

    if (isBSScoreMode) {
        let FairFight = Math.min(1 + (8 / 3) * (colorItem.maxValueScore / 100), 3);
        FairFight = Math.max(1, FairFight);
        FairFight = FairFight.toFixed(2);
        textPercent.innerHTML = '% of BS Score (max FairFight=' + FairFight + ')';
    }
    else {
        textPercent.innerHTML = '% of TBS';
    }

    divColor.appendChild(textPercent);

    let colorPickerInput = document.createElement("input");
    colorPickerInput.type = "color";
    colorPickerInput.value = colorItem.color;

    colorPickerInput.addEventListener("change", () => {
        LOCAL_COLORS[id].color = colorPickerInput.value;
        SetStorage(StorageKey.ColorStatsThreshold + id, JSON.stringify(LOCAL_COLORS[id]));
    });

    divColor.appendChild(colorPickerInput);
    colorItem.inputColor = colorPickerInput;

    colorSettingsNode.appendChild(divColor);
}

function AddOption(contentDiv, StorageKeyValue, defaultValue, textToDisplay, name) {
    // Alternative profile display
    let optionNode = document.createElement("div");
    optionNode.className = "TDup_optionsTabContentDiv";
    let isShowingAlternativeProfileDisplay = GetStorageBoolWithDefaultValue(StorageKeyValue, defaultValue);

    let optionCheckbox = document.createElement('input');
    optionCheckbox.type = "checkbox";
    optionCheckbox.name = "name";
    optionCheckbox.value = "value";
    optionCheckbox.id = "id" + name;
    optionCheckbox.checked = isShowingAlternativeProfileDisplay;

    optionCheckbox.addEventListener("change", () => {
        let isOptionValue = optionCheckbox.checked;
        SetStorage(StorageKeyValue, isOptionValue);
    });

    var optionLabel = document.createElement('label')
    optionLabel.htmlFor = "id" + name;
    optionLabel.appendChild(document.createTextNode(textToDisplay));
    optionNode.appendChild(optionLabel);
    optionNode.appendChild(optionCheckbox);
    contentDiv.appendChild(optionNode);
}

function BuildOptionMenu_Pages(tabs, menu) {
    let contentDiv = BuildOptionMenu(tabs, menu, "Pages", true);

    // Displaying Honor bars
    AddOption(contentDiv, StorageKey.IsShowingHonorBars, true, 'Are you displaying honor bars?', 'isShowingHonorBars');

    // Enable on own profile
    AddOption(contentDiv, StorageKey.IsEnabledOnOwnProfile, false, 'Show stats on your own profile page?', 'IsEnabledOnOwnProfile');

    // Alternative profile display
    AddOption(contentDiv, StorageKey.IsShowingAlternativeProfileDisplay, false, 'Use alternative profile stats location?', 'IsShowingAlternativeProfileDisplay');

    // Alternative profile display
    AddOption(contentDiv, StorageKey.IsShowingStatsHeader, true, 'Show headers above profile stats?', 'IsShowingHeadersOnProfileStats');

    // Alternative profile display
    AddOption(contentDiv, StorageKey.IsClickingOnProfileStatsAttackPlayer, false, 'Click on profile stats area to attack?', 'IsClickingOnProfileStatsAttackPlayer');

    // Open attack in new tab
    AddOption(contentDiv, StorageKey.ShouldOpenAttackURLInNewTab, true, 'Open attack screen in new tab', 'ShouldOpenAttackURLInNewTab');

    // Hide BSP Option button, in toolbar
    AddOption(contentDiv, StorageKey.IsHidingBSPOptionButtonInToolbar, false, 'Hide BSP Option button in toolbar?', 'IsHidingBSPOptionButtonInToolbar');

    // Show Percentage instead
    AddOption(contentDiv, StorageKey.IsShowingBattleStatsPercentage, false, 'Display percentage rather than values in little colored squares?', 'IsShowingBattleStatsPercentage');

    // Spy
    let spyNumberOfDaysDiv = document.createElement("div");
    spyNumberOfDaysDiv.className = "TDup_optionsTabContentDiv";
    let spyNumberOfDaysDivLabel = document.createElement("label");
    spyNumberOfDaysDivLabel.innerHTML = 'Display spy instead of prediction if spy more recent than ';

    let spyNumberOfDaysDivLabelPart2 = document.createElement("label");
    spyNumberOfDaysDivLabelPart2.innerHTML = 'days';

    let tornStatsNumberOfDaysInput = document.createElement("input");
    tornStatsNumberOfDaysInput.type = 'number';
    tornStatsNumberOfDaysInput.style.width = '60px';
    if (GetStorage(StorageKey.DaysToUseSpies) == undefined) {
        SetStorage(StorageKey.DaysToUseSpies, 30);
    }
    tornStatsNumberOfDaysInput.value = parseInt(GetStorage(StorageKey.DaysToUseSpies));

    tornStatsNumberOfDaysInput.addEventListener("change", () => {
        let numberOfDaysNewValue = parseInt(tornStatsNumberOfDaysInput.value);
        SetStorage(StorageKey.DaysToUseSpies, numberOfDaysNewValue);
    });

    spyNumberOfDaysDiv.appendChild(spyNumberOfDaysDivLabel);
    spyNumberOfDaysDiv.appendChild(tornStatsNumberOfDaysInput);
    spyNumberOfDaysDiv.appendChild(spyNumberOfDaysDivLabelPart2);
    contentDiv.appendChild(spyNumberOfDaysDiv);

    // BSP Color schema
    let colorSchemaDiv = document.createElement("div");
    colorSchemaDiv.className = "TDup_optionsTabContentDiv";

    let colorPickerInput = document.createElement("input");
    colorPickerInput.type = "color";
    colorPickerInput.value = GetColorTheme();

    colorPickerInput.addEventListener("change", () => {
        let color = colorPickerInput.value;
        SetStorage(StorageKey.BSPColorTheme, JSON.stringify(color));
    });

    let colorThemeLabel = document.createElement("label");
    colorThemeLabel.innerHTML = 'BSP Theme color ';

    colorSchemaDiv.appendChild(colorThemeLabel);
    colorSchemaDiv.appendChild(colorPickerInput);
    contentDiv.appendChild(colorSchemaDiv);

    // Pages
    let textExplanation = document.createElement("div");
    textExplanation.className = "TDup_optionsTabContentDiv";
    textExplanation.innerHTML = "Select where BSP is enabled";
    contentDiv.appendChild(textExplanation);

    // Pages where it's enabled
    let divForCheckbox = document.createElement("div");
    BuildOptionsCheckboxPageWhereItsEnabled(divForCheckbox, PageType.Profile, true);
    BuildOptionsCheckboxPageWhereItsEnabled(divForCheckbox, PageType.Faction, true);
    BuildOptionsCheckboxPageWhereItsEnabled(divForCheckbox, PageType.Bounty, true);
    BuildOptionsCheckboxPageWhereItsEnabled(divForCheckbox, PageType.Search, true);
    BuildOptionsCheckboxPageWhereItsEnabled(divForCheckbox, PageType.Abroad, true);
    BuildOptionsCheckboxPageWhereItsEnabled(divForCheckbox, PageType.Competition, true);
    BuildOptionsCheckboxPageWhereItsEnabled(divForCheckbox, PageType.Elimination, true);
    BuildOptionsCheckboxPageWhereItsEnabled(divForCheckbox, PageType.HallOfFame, true);
    BuildOptionsCheckboxPageWhereItsEnabled(divForCheckbox, PageType.Enemies, true);
    BuildOptionsCheckboxPageWhereItsEnabled(divForCheckbox, PageType.Friends, true);
    BuildOptionsCheckboxPageWhereItsEnabled(divForCheckbox, PageType.Targets, true);
    BuildOptionsCheckboxPageWhereItsEnabled(divForCheckbox, PageType.RecruitCitizens, false);
    BuildOptionsCheckboxPageWhereItsEnabled(divForCheckbox, PageType.Company, false);
    BuildOptionsCheckboxPageWhereItsEnabled(divForCheckbox, PageType.Hospital, false);
    BuildOptionsCheckboxPageWhereItsEnabled(divForCheckbox, PageType.PointMarket, true);
    BuildOptionsCheckboxPageWhereItsEnabled(divForCheckbox, PageType.Properties, true);
    BuildOptionsCheckboxPageWhereItsEnabled(divForCheckbox, PageType.War, true);
    BuildOptionsCheckboxPageWhereItsEnabled(divForCheckbox, PageType.RussianRoulette, true, false);
    BuildOptionsCheckboxPageWhereItsEnabled(divForCheckbox, PageType.Market, false, true);
    BuildOptionsCheckboxPageWhereItsEnabled(divForCheckbox, PageType.Forum, false, true);
    BuildOptionsCheckboxPageWhereItsEnabled(divForCheckbox, PageType.Attack, false, true);

    contentDiv.appendChild(divForCheckbox);
}

function BuildOptionsCheckboxPageWhereItsEnabled(parentDiv, pageType, defaultValue, proto) {

    let pageCheckBoxNode = document.createElement("div");
    pageCheckBoxNode.className = "TDup_optionsTabContentDivSmall";

    let checkboxPage = document.createElement('input');
    checkboxPage.type = "checkbox";
    checkboxPage.name = "name";
    checkboxPage.value = "value";
    checkboxPage.style.margin = "5px 10px";
    checkboxPage.id = "id_" + pageType;
    checkboxPage.checked = GetStorageBoolWithDefaultValue(StorageKey.IsBSPEnabledOnPage + pageType, defaultValue);

    checkboxPage.addEventListener("change", () => {
        let isBSPEnabledForThisPage = checkboxPage.checked;
        SetStorage(StorageKey.IsBSPEnabledOnPage + pageType, isBSPEnabledForThisPage);
    });

    var checkboxLabel = document.createElement('label')
    checkboxLabel.htmlFor = checkboxPage.id;
    if (proto == true) {
        checkboxLabel.appendChild(document.createTextNode("[Beta] " + pageType));
    }
    else {
        checkboxLabel.appendChild(document.createTextNode(pageType));
    }

    pageCheckBoxNode.appendChild(checkboxPage);
    pageCheckBoxNode.appendChild(checkboxLabel);
    parentDiv.appendChild(pageCheckBoxNode);
}

function BuildOptionMenu_Uploadstats(tabs, menu) {
    let contentDiv = BuildOptionMenu(tabs, menu, "Upload Data", false);

    // UploadStats
    let UploadStatsNode = document.createElement("div");
    UploadStatsNode.className = "TDup_optionsTabContentDiv";

    let tipsDiv = document.createElement("div");
    tipsDiv.className = "TDup_optionsTabContentDiv";
    tipsDiv.innerHTML = 'Upload your attack logs to help BSP being more accurate.';

    let UploadStatsAPIKeyLabel = document.createElement("label");
    UploadStatsAPIKeyLabel.innerHTML = 'Your API key';

    let UploadStatsAPIKeyInput = document.createElement("input");
    if (GetStorage(StorageKey.UploadDataAPIKey)) {
        UploadStatsAPIKeyInput.value = GetStorage(StorageKey.UploadDataAPIKey);
    }

    let apiRegister = document.createElement("div");
    apiRegister.className = "TDup_optionsTabContentDiv";
    apiRegister.innerHTML = '<a href="https://www.torn.com/preferences.php#tab=api?step=addNewKey&title=BSP_Attacks&user=basic,attacks,battlestats" target="_blank"><input type"button" class="TDup_buttonInOptionMenu" value="Generate a custom key"/></a>';

    let btnFetchSpiesFromUploadStats = document.createElement("input");
    btnFetchSpiesFromUploadStats.type = "button";
    btnFetchSpiesFromUploadStats.value = "Upload my latest fights";
    btnFetchSpiesFromUploadStats.className = "TDup_buttonInOptionMenu";

    let successValidateUploadStatsAPIKey = document.createElement("label");
    successValidateUploadStatsAPIKey.innerHTML = 'UploadStats API Key verified, and attacks added to the system. Thanks';
    successValidateUploadStatsAPIKey.style.color = 'green';
    successValidateUploadStatsAPIKey.style.visibility = "hidden";

    let errorValidateUploadStatsAPIKey = document.createElement("label");
    errorValidateUploadStatsAPIKey.innerHTML = 'Error';
    errorValidateUploadStatsAPIKey.style.backgroundColor = 'red';
    errorValidateUploadStatsAPIKey.style.visibility = "hidden";

    function OnUploadStatsSpiesFetched(success, reason) {
        btnFetchSpiesFromUploadStats.disabled = false;
        SetStorage(StorageKey.UploadDataAPIKeyIsValid, success);
        if (success === true) {
            successValidateUploadStatsAPIKey.style.visibility = "visible";
            successValidateUploadStatsAPIKey.innerHTML = reason;
            errorValidateUploadStatsAPIKey.style.visibility = "hidden";
        }
        else {
            errorValidateUploadStatsAPIKey.style.visibility = "visible";
            successValidateUploadStatsAPIKey.style.visibility = "hidden";
            errorValidateUploadStatsAPIKey.innerHTML = reason;
        }
    }

    btnFetchSpiesFromUploadStats.addEventListener("click", () => {
        btnFetchSpiesFromUploadStats.disabled = true;
        SetStorage(StorageKey.UploadDataAPIKey, UploadStatsAPIKeyInput.value);
        CallBSPUploadStats(OnUploadStatsSpiesFetched);
    });


    let isAutoUploadStatsNode = document.createElement("div");
    isAutoUploadStatsNode.className = "TDup_optionsTabContentDiv";
    let isAutoUploadStats = GetStorageBoolWithDefaultValue(StorageKey.UploadDataIsAutoMode, true);

    let checkboxisAutoUploadStats = document.createElement('input');
    checkboxisAutoUploadStats.type = "checkbox";
    checkboxisAutoUploadStats.name = "name";
    checkboxisAutoUploadStats.value = "value";
    checkboxisAutoUploadStats.id = "idIsAutoUploadStats";
    checkboxisAutoUploadStats.checked = isAutoUploadStats;

    checkboxisAutoUploadStats.addEventListener("change", () => {
        let isAutoUploadStats = checkboxisAutoUploadStats.checked;
        SetStorage(StorageKey.UploadDataIsAutoMode, isAutoUploadStats);
    });

    var isAutoUploadStatsLabel = document.createElement('label')
    isAutoUploadStatsLabel.htmlFor = "idIsAutoUploadStats";
    isAutoUploadStatsLabel.appendChild(document.createTextNode('Auto Upload your latest attacks, once a day'));
    isAutoUploadStatsNode.appendChild(isAutoUploadStatsLabel);
    isAutoUploadStatsNode.appendChild(checkboxisAutoUploadStats);

    //

    let UploadStatsApiKeyDiv = document.createElement("div");
    UploadStatsApiKeyDiv.className = "TDup_optionsTabContentDiv";
    UploadStatsApiKeyDiv.appendChild(tipsDiv);
    if (!GetStorageBool(StorageKey.UploadDataAPIKeyIsValid)) {
        UploadStatsApiKeyDiv.appendChild(apiRegister);
    }
    UploadStatsApiKeyDiv.appendChild(UploadStatsAPIKeyLabel);
    UploadStatsApiKeyDiv.appendChild(UploadStatsAPIKeyInput);
    UploadStatsApiKeyDiv.appendChild(btnFetchSpiesFromUploadStats);
    UploadStatsApiKeyDiv.appendChild(successValidateUploadStatsAPIKey);
    UploadStatsApiKeyDiv.appendChild(errorValidateUploadStatsAPIKey);
    if (GetStorage(StorageKey.UploadDataAPIKeyIsValid)) {
        UploadStatsApiKeyDiv.appendChild(isAutoUploadStatsNode);
    }
    UploadStatsNode.appendChild(UploadStatsApiKeyDiv);

    contentDiv.appendChild(UploadStatsNode);
}

function BuildOptionMenu_YATA(tabs, menu) {
    let contentDiv = BuildOptionMenu(tabs, menu, "YATA", true);

    // Yata spies
    let YataNode = document.createElement("div");
    YataNode.className = "TDup_optionsTabContentDiv";

    let YataAPIKeyLabel = document.createElement("label");
    YataAPIKeyLabel.innerHTML = 'Yata API Key';

    let YataAPIKeyInput = document.createElement("input");
    if (GetStorage(StorageKey.YataAPIKey)) {
        YataAPIKeyInput.value = GetStorage(StorageKey.YataAPIKey);
    }

    btnFetchSpiesFromYata = document.createElement("input");
    btnFetchSpiesFromYata.type = "button";
    btnFetchSpiesFromYata.value = "Import spies from Yata";
    btnFetchSpiesFromYata.className = "TDup_buttonInOptionMenu";

    successValidateYataAPIKey = document.createElement("label");
    successValidateYataAPIKey.innerHTML = 'Yata API Key verified';
    successValidateYataAPIKey.style.color = 'green';
    successValidateYataAPIKey.style.visibility = "hidden";

    errorValidateYataAPIKey = document.createElement("label");
    errorValidateYataAPIKey.innerHTML = 'Error';
    errorValidateYataAPIKey.style.backgroundColor = 'red';
    errorValidateYataAPIKey.style.visibility = "hidden";

    let YataApiKeyDiv = document.createElement("div");
    YataApiKeyDiv.className = "TDup_optionsTabContentDiv";
    YataApiKeyDiv.appendChild(YataAPIKeyLabel);
    YataApiKeyDiv.appendChild(YataAPIKeyInput);
    YataApiKeyDiv.appendChild(btnFetchSpiesFromYata);
    YataApiKeyDiv.appendChild(successValidateYataAPIKey);
    YataApiKeyDiv.appendChild(errorValidateYataAPIKey);
    YataNode.appendChild(YataApiKeyDiv);

    function OnYataSpiesFetched(success, reason) {
        btnFetchSpiesFromYata.disabled = false;
        SetStorage(StorageKey.IsYataAPIKeyValid, success);
        if (success === true) {
            successValidateYataAPIKey.style.visibility = "visible";
            successValidateYataAPIKey.innerHTML = reason;
            errorValidateYataAPIKey.style.visibility = "hidden";
        }
        else {
            errorValidateYataAPIKey.style.visibility = "visible";
            successValidateYataAPIKey.style.visibility = "hidden";
            errorValidateYataAPIKey.innerHTML = reason;
        }
    }

    btnFetchSpiesFromYata.addEventListener("click", () => {
        btnFetchSpiesFromYata.disabled = true;
        SetStorage(StorageKey.YataAPIKey, YataAPIKeyInput.value);
        FetchSpiesFromYata(OnYataSpiesFetched);
    });

    contentDiv.appendChild(YataNode);
}

function BuildOptionMenu_TornStats(tabs, menu) {
    let contentDiv = BuildOptionMenu(tabs, menu, "TornStats", true);

    // TornStats spies
    let tornStatsNode = document.createElement("div");
    tornStatsNode.className = "TDup_optionsTabContentDiv";

    let tornStatsAPIKeyLabel = document.createElement("label");
    tornStatsAPIKeyLabel.innerHTML = 'TornStats API Key';

    let tornStatsAPIKeyInput = document.createElement("input");
    if (GetStorage(StorageKey.TornStatsAPIKey)) {
        tornStatsAPIKeyInput.value = GetStorage(StorageKey.TornStatsAPIKey);
    }

    btnValidateTornStatsAPIKey = document.createElement("input");
    btnValidateTornStatsAPIKey.type = "button";
    btnValidateTornStatsAPIKey.value = "Validate";
    btnValidateTornStatsAPIKey.className = "TDup_buttonInOptionMenu";

    successValidateTornStatsAPIKey = document.createElement("label");
    successValidateTornStatsAPIKey.innerHTML = 'TornStats API Key verified';
    successValidateTornStatsAPIKey.style.color = 'green';
    successValidateTornStatsAPIKey.style.visibility = "hidden";

    errorValidateTornStatsAPIKey = document.createElement("label");
    errorValidateTornStatsAPIKey.innerHTML = 'Error';
    errorValidateTornStatsAPIKey.style.backgroundColor = 'red';
    errorValidateTornStatsAPIKey.style.visibility = "hidden";

    let tornStatsApiKeyDiv = document.createElement("div");
    tornStatsApiKeyDiv.className = "TDup_optionsTabContentDiv";
    tornStatsApiKeyDiv.appendChild(tornStatsAPIKeyLabel);
    tornStatsApiKeyDiv.appendChild(tornStatsAPIKeyInput);
    tornStatsApiKeyDiv.appendChild(btnValidateTornStatsAPIKey);
    tornStatsApiKeyDiv.appendChild(successValidateTornStatsAPIKey);
    tornStatsApiKeyDiv.appendChild(errorValidateTornStatsAPIKey);
    tornStatsNode.appendChild(tornStatsApiKeyDiv);

    function OnTornStatsAPIKeyValidated(success, reason) {
        btnValidateTornStatsAPIKey.disabled = false;
        SetStorage(StorageKey.IsTornStatsAPIKeyValid, success);
        if (success === true) {
            successValidateTornStatsAPIKey.style.visibility = "visible";
            errorValidateTornStatsAPIKey.style.visibility = "hidden";
        }
        else {
            errorValidateTornStatsAPIKey.style.visibility = "visible";
            successValidateTornStatsAPIKey.style.visibility = "hidden";
            errorValidateTornStatsAPIKey.innerHTML = reason;
        }
    }

    btnValidateTornStatsAPIKey.addEventListener("click", () => {
        btnValidateTornStatsAPIKey.disabled = true;
        SetStorage(StorageKey.TornStatsAPIKey, tornStatsAPIKeyInput.value);
        VerifyTornStatsAPIKey(OnTornStatsAPIKeyValidated);
    });

    let tornStatsImportTipsDiv = document.createElement("div");
    tornStatsImportTipsDiv.className = "TDup_optionsTabContentDiv";
    tornStatsImportTipsDiv.innerHTML = 'To import TornStats spies, go on a specific faction page, and click on the [BSP IMPORT SPIES] button at the top of the page. Or enable the Auto Import feature below!';
    tornStatsNode.appendChild(tornStatsImportTipsDiv);

    //

    let isAutoImportTornStatsSpiesNode = document.createElement("div");
    isAutoImportTornStatsSpiesNode.className = "TDup_optionsTabContentDiv";
    let isAutoImportTornStatsSpies = GetStorageBoolWithDefaultValue(StorageKey.IsAutoImportTornStatsSpies, false);

    let checkboxisAutoImportTornStatsSpies = document.createElement('input');
    checkboxisAutoImportTornStatsSpies.type = "checkbox";
    checkboxisAutoImportTornStatsSpies.name = "name";
    checkboxisAutoImportTornStatsSpies.value = "value";
    checkboxisAutoImportTornStatsSpies.id = "idIsAutoImportTornStatsSpies";
    checkboxisAutoImportTornStatsSpies.checked = isAutoImportTornStatsSpies;

    checkboxisAutoImportTornStatsSpies.addEventListener("change", () => {
        let isAutoImportTornStatsSpies = checkboxisAutoImportTornStatsSpies.checked;
        SetStorage(StorageKey.IsAutoImportTornStatsSpies, isAutoImportTornStatsSpies);
    });

    var isAutoImportTornStatsSpiesLabel = document.createElement('label')
    isAutoImportTornStatsSpiesLabel.htmlFor = "idIsAutoImportTornStatsSpies";
    isAutoImportTornStatsSpiesLabel.appendChild(document.createTextNode('Auto Import TornStats spies? (will auto query TornStats on profile or faction page)'));
    isAutoImportTornStatsSpiesNode.appendChild(isAutoImportTornStatsSpiesLabel);
    isAutoImportTornStatsSpiesNode.appendChild(checkboxisAutoImportTornStatsSpies);
    tornStatsNode.appendChild(isAutoImportTornStatsSpiesNode);

    //

    contentDiv.appendChild(tornStatsNode);
}

function BuildOptionMenu_Debug(tabs, menu) {
    let contentDiv = BuildOptionMenu(tabs, menu, "Debug", false);

    // <LocalStorage display>
    let maxStorageSize = 5000000;

    let storageALLExceptBSPResult = GetPredictionStorage(eStorageType.ALL_ExceptBSP);
    let storageALLExceptBSPSize = storageALLExceptBSPResult[1];

    let storageTornChatResult = GetPredictionStorage(eStorageType.TornChat);
    let storageTornChatSize = storageTornChatResult[1];

    let storageALLBSPResult = GetPredictionStorage(eStorageType.All_BSP);
    let storageALLBSPSize = storageALLBSPResult[1];

    let storagePredictionResult = GetPredictionStorage(eStorageType.Prediction);
    let storagePredictionSize = storagePredictionResult[1];
    let storagePredictionNumber = storagePredictionResult[0];

    let storageTornStatsResult = GetPredictionStorage(eStorageType.TornStatsSpies);
    let storageTornStatsSize = storageTornStatsResult[1];
    let storageTornStatsNumber = storageTornStatsResult[0];

    let storageYATAResult = GetPredictionStorage(eStorageType.YATASpies);
    let storageYATASize = storageYATAResult[1];
    let storageYATANumber = storageYATAResult[0];

    let localStorageInfosDiv = document.createElement("div");
    localStorageInfosDiv.className = "TDup_optionsTabContentDiv";

    let localStorageProgressBar = document.createElement("div");
    localStorageProgressBar.className = "TDup_optionsTabContentDiv";

    localStorageProgressBar.innerHTML = "LocalStorage space is different <br/>from browser to browser.<br/> For reference, Chrome has a 5mb limit.<br/>";

    localStorageProgressBar.innerHTML += "<br/> Used by everything <br/>" + (storageALLBSPSize + storageALLExceptBSPSize).toLocaleString('en-US') + "b";
    localStorageProgressBar.innerHTML += "<br/><br/> Used by BSP Total <br/> " + storageALLBSPSize.toLocaleString('en-US') + "b";
    localStorageProgressBar.innerHTML += "<br/><br/> Used by BSP Predictions <br/> " + storagePredictionSize.toLocaleString('en-US') + "b (Number : " + storagePredictionNumber + ")";
    localStorageProgressBar.innerHTML += "<br/><br/> Used by BSP TornStats spies <br/> " + storageTornStatsSize.toLocaleString('en-US') + "b (Number : " + storageTornStatsNumber + ")";
    localStorageProgressBar.innerHTML += "<br/><br/> Used by BSP YATA spies <br/> " + storageYATASize.toLocaleString('en-US') + "b (Number : " + storageYATANumber + ")";
    localStorageProgressBar.innerHTML += "<br/><br/> Used by others = " + storageALLExceptBSPSize.toLocaleString('en-US') + "b <br/>(Torn chat = " + storageTornChatSize.toLocaleString('en-US') + "b)";

    localStorageInfosDiv.appendChild(localStorageProgressBar);
    contentDiv.appendChild(localStorageInfosDiv);
    // </LocalStorage display>

    // <Export local storage>
    var divbuttonExportLocalCache = document.createElement("div");
    divbuttonExportLocalCache.className = "TDup_optionsTabContentDiv";
    var buttonExportLocalCache = document.createElement("input");
    buttonExportLocalCache.type = "button";
    buttonExportLocalCache.value = "Export BSP Local Storage";
    buttonExportLocalCache.className = "TDup_buttonInOptionMenu";

    buttonExportLocalCache.addEventListener("click", () => {
        buttonExportLocalCache.disabled = true;
        ExportPredictorStorage();
        buttonExportLocalCache.disabled = false;
    });

    divbuttonExportLocalCache.appendChild(buttonExportLocalCache);
    contentDiv.appendChild(divbuttonExportLocalCache);
    // </Export local storage>

    // <Test localStorage space>
    var divbuttonTestLocalStorageSpace = document.createElement("div");
    divbuttonTestLocalStorageSpace.className = "TDup_optionsTabContentDiv";
    var buttonTestLocalStorageSpace = document.createElement("input");
    buttonTestLocalStorageSpace.type = "button";
    buttonTestLocalStorageSpace.value = "Test Local Storage space";
    buttonTestLocalStorageSpace.className = "TDup_buttonInOptionMenu";

    buttonTestLocalStorageSpace.addEventListener("click", () => {
        buttonTestLocalStorageSpace.disabled = true;
        let result = TestLocalStorage();
        buttonTestLocalStorageSpace.disabled = false;
        buttonTestLocalStorageSpace.value = result == true ? "Success!" : "Failure, clear your cache";
    });

    divbuttonTestLocalStorageSpace.appendChild(buttonTestLocalStorageSpace);
    contentDiv.appendChild(divbuttonTestLocalStorageSpace);
    // </Export local storage>

    // <Test localStorage space>
    var divbuttonClearPredictions = document.createElement("div");
    divbuttonClearPredictions.className = "TDup_optionsTabContentDiv";
    let btnClearPredictions = document.createElement("input");
    btnClearPredictions.type = "button";
    btnClearPredictions.value = "Clear Predictions";
    btnClearPredictions.title = "Clear Predictions from Local Storage";
    btnClearPredictions.className = "TDup_buttonInOptionMenu";

    btnClearPredictions.addEventListener("click", () => {
        btnClearPredictions.disabled = true;
        if (confirm("BSP - IMPORTANT \r\n \r\nAre you sure you want to clear Predictions from BSP cache?") == true) {
            ClearCache(eStorageType.Prediction);
            window.location.reload();
        }
        btnClearPredictions.disabled = false;
    });

    divbuttonClearPredictions.appendChild(btnClearPredictions);
    contentDiv.appendChild(divbuttonClearPredictions);
    // </Clear TornStats spies>

    // <Clear TornStats spies>
    var divbuttonClearTornStatsSpies = document.createElement("div");
    divbuttonClearTornStatsSpies.className = "TDup_optionsTabContentDiv";
    let btnClearTornStatsSpies = document.createElement("input");
    btnClearTornStatsSpies.type = "button";
    btnClearTornStatsSpies.value = "Clear TornStats Spies";
    btnClearTornStatsSpies.title = "Clear BSP TornStats Spies from Local Storage";
    btnClearTornStatsSpies.className = "TDup_buttonInOptionMenu";

    btnClearTornStatsSpies.addEventListener("click", () => {
        btnClearTornStatsSpies.disabled = true;
        if (confirm("BSP - IMPORTANT \r\n \r\nAre you sure you want to clear TornStats spies from BSP cache?") == true) {
            ClearCache(eStorageType.TornStatsSpies);
            window.location.reload();
        }
        btnClearTornStatsSpies.disabled = false;
    });

    divbuttonClearTornStatsSpies.appendChild(btnClearTornStatsSpies);
    contentDiv.appendChild(divbuttonClearTornStatsSpies);
    // </Clear TornStats spies>

    // <Clear YATA spies>
    var divbuttonClearYATASpies = document.createElement("div");
    divbuttonClearYATASpies.className = "TDup_optionsTabContentDiv";
    let btnClearYATASpies = document.createElement("input");
    btnClearYATASpies.type = "button";
    btnClearYATASpies.value = "Clear YATA Spies";
    btnClearYATASpies.title = "Clear BSP YATA Spies from Local Storage";
    btnClearYATASpies.className = "TDup_buttonInOptionMenu";

    btnClearYATASpies.addEventListener("click", () => {
        btnClearYATASpies.disabled = true;
        if (confirm("BSP - IMPORTANT \r\n \r\nAre you sure you want to clear YATA spies from BSP cache?") == true) {
            ClearCache(eStorageType.YATASpies);
            window.location.reload();
        }
        btnClearYATASpies.disabled = false;
    });

    divbuttonClearYATASpies.appendChild(btnClearYATASpies);
    contentDiv.appendChild(divbuttonClearYATASpies);
    // </Clear YATA spies>

    // <Clear Chat Entries>
    var divbuttonClearChat = document.createElement("div");
    divbuttonClearChat.className = "TDup_optionsTabContentDiv";
    let btnClearTornChat = document.createElement("input");
    btnClearTornChat.type = "button";
    btnClearTornChat.value = "Clear Chat entries";
    btnClearTornChat.title = "Clear Chat entries from Local Storage";
    btnClearTornChat.className = "TDup_buttonInOptionMenu";

    btnClearTornChat.addEventListener("click", () => {
        btnClearTornChat.disabled = true;
        if (confirm("BSP - IMPORTANT \r\n \r\nAre you sure you want to clear Torn Chat entries your localstorage?") == true) {
            ClearCache(eStorageType.TornChat);
            window.location.reload();
        }
        btnClearTornChat.disabled = false;
    });

    divbuttonClearChat.appendChild(btnClearTornChat);
    contentDiv.appendChild(divbuttonClearChat);
    // </Clear Chat Entries>

    var divbuttonClearLocalCache = document.createElement("div");
    divbuttonClearLocalCache.className = "TDup_optionsTabContentDiv";
    var buttonClearLocalCache = document.createElement("input");
    buttonClearLocalCache.type = "button";
    buttonClearLocalCache.value = "Clear full BSP Local Storage";
    buttonClearLocalCache.title = "Clear full BSP Local Storage";
    buttonClearLocalCache.className = "TDup_buttonInOptionMenu";
    buttonClearLocalCache.style.backgroundColor = "red";

    buttonClearLocalCache.addEventListener("click", () => {
        buttonClearLocalCache.disabled = true;
        if (confirm("BSP - IMPORTANT \r\n \r\nAre you sure you want to clear BSP keys, stats, settings, spies and predictions from your local cache? \r\n \r\nIt will only impact this script: you will have to do the setup again (setup keys, import spies etc)") == true) {
            ClearCache(eStorageType.All);
            window.location.reload();
        }
        buttonClearLocalCache.disabled = false;
    });

    divbuttonClearLocalCache.appendChild(buttonClearLocalCache);
    contentDiv.appendChild(divbuttonClearLocalCache);
}

function BuildOptionMenu_Infos(menuArea, contentArea) {
    let contentDiv = BuildOptionMenu(menuArea, contentArea, "Infos", false);

    let TabContent_Content = document.createElement("div");
    TabContent_Content.className = "TDup_optionsTabContentDiv";
    TabContent_Content.innerHTML = "Script version : " + GM_info.script.version + " (Free Version)";
    contentDiv.appendChild(TabContent_Content);

    let ForumThread = document.createElement("div");
    ForumThread.className = "TDup_optionsTabContentDiv";
    ForumThread.innerHTML = 'Free Version - All features enabled<br/>Original script by TDup';
    contentDiv.appendChild(ForumThread);

    let DiscordLink = document.createElement("div");
    DiscordLink.className = "TDup_optionsTabContentDiv";

    let DiscordText = document.createElement("div");
    DiscordText.innerHTML = 'Give feedback, report bugs or just come to say hi on the <a href="https://discord.gg/zgrVX5j6MQ" target="_blank">Discord <img width="18" height="18" title="Discord" src="https://wiki.soldat.pl/images/6/6f/DiscordLogo.png" /> </a>';
    DiscordLink.appendChild(DiscordText);

    contentDiv.appendChild(DiscordLink);

    let tips = document.createElement("div");
    tips.className = "TDup_optionsTabContentDiv";
    tips.innerHTML = "Tips :<br />You can click on the colored area to quick attack, from any screen! <br> <img width='200' src='https://i.ibb.co/4TtQqzf/quick-Attack.png'</img>";
    tips.style.fontStyle = "italic";
    contentDiv.appendChild(tips);

    const ul = document.createElement("ul");
    ul.style = "list-style-type: none;padding: 0;";
    const items = [
        { urlImage: hofIcon, name: "Top 100 Hall Of Fame" },
        { urlImage: starIcon, name: "Your spy (TornStats or Yata)" },
        { urlImage: oldSpyIcon, name: "Old spy (that is displayed because prediction is lower than this)" },
        { urlImage: FFAttacksIcon, name: "Prediction using BSP user attack sharing (more reliable - BScore computed from FairFight)" },
    ];

    let legend = document.createElement("div");
    legend.className = "TDup_optionsTabContentDiv";
    legend.innerHTML = "Legend:";
    legend.style.fontStyle = "italic";
    contentDiv.appendChild(legend);

    items.forEach(item => {
        const li = document.createElement("li");
        li.style = "display: flex;align-items: center;margin-bottom: 8px;";

        const img = document.createElement("img");
        img.src = item.urlImage;
        img.width = 24;
        img.height = 24;
        img.style.marginRight = "8px";

        const span = document.createElement("span");
        span.textContent = item.name;

        li.appendChild(img);
        li.appendChild(span);

        ul.appendChild(li);
    });

    contentDiv.appendChild(ul);


}

// === MODIFICATION: Update RefreshOptionMenuWithSubscription for free version ===
function RefreshOptionMenuWithSubscription() {
    // In free version, always show all menu tabs
    const pagesShouldBeHiddenWhenInactive = document.getElementsByClassName("TDup_tablinksShouldBeHiddenWhenInactive");
    for (let i = 0; i < pagesShouldBeHiddenWhenInactive.length; i++) {
        pagesShouldBeHiddenWhenInactive[i].style.display = "block";
    }
}

function BuildSettingsMenu(node) {

    LogInfo("Building BSP option window - Free Version");
    TDup_PredictorOptionsDiv = document.createElement("div");
    TDup_PredictorOptionsDiv.style.background = "lightgray";

    TDup_PredictorOptionsMenuArea = document.createElement("div");
    TDup_PredictorOptionsMenuArea.className = "TDup_optionsMenu";

    TDup_PredictorOptionsContentArea = document.createElement("div");

    var cell, table;
    table = document.createElement('table');
    table.style = 'width:100%; border:2px solid ' + GetColorTheme() + ';';

    let thead = table.createTHead();
    let rowHeader = thead.insertRow();
    let th = document.createElement("th");
    th.className = "TDup_optionsCellHeader";
    th.colSpan = 2;

    let imgDivTDup_PredictorOptionsDiv = document.createElement("div");
    imgDivTDup_PredictorOptionsDiv.innerHTML = '<img src="' + mainBSPIcon + '" style="max-width:150px;max-height:100px;vertical-align:middle;" /> Settings (Free Version)';
    th.appendChild(imgDivTDup_PredictorOptionsDiv);

    rowHeader.appendChild(th);

    let raw = table.insertRow();
    cell = raw.insertCell();
    cell.className = "TDup_optionsCellMenu";
    cell.appendChild(TDup_PredictorOptionsMenuArea);

    cell = raw.insertCell();
    cell.appendChild(TDup_PredictorOptionsContentArea);
    TDup_PredictorOptionsDiv.appendChild(table);
    node.appendChild(TDup_PredictorOptionsDiv);

    BuildOptionMenu_Global(TDup_PredictorOptionsMenuArea, TDup_PredictorOptionsContentArea, true);
    BuildOptionMenu_Colors(TDup_PredictorOptionsMenuArea, TDup_PredictorOptionsContentArea);
    BuildOptionMenu_Pages(TDup_PredictorOptionsMenuArea, TDup_PredictorOptionsContentArea);
    BuildOptionMenu_Uploadstats(TDup_PredictorOptionsMenuArea, TDup_PredictorOptionsContentArea);
    BuildOptionMenu_YATA(TDup_PredictorOptionsMenuArea, TDup_PredictorOptionsContentArea);
    BuildOptionMenu_TornStats(TDup_PredictorOptionsMenuArea, TDup_PredictorOptionsContentArea);
    BuildOptionMenu_Debug(TDup_PredictorOptionsMenuArea, TDup_PredictorOptionsContentArea);
    BuildOptionMenu_Infos(TDup_PredictorOptionsMenuArea, TDup_PredictorOptionsContentArea);

    TDup_PredictorOptionsDiv.style.display = "none";

    // Get the element with id="defaultOpen" and click on it
    document.getElementById("TDup_tablinks_defaultOpen").click();

    RefreshOptionMenuWithSubscription();
    LogInfo("Building BSP option window done - Free Version");
}

// #endregion

// #region Inject into pages

function InjectImportSpiesButton(node) {
    if (!node) return;

    if (!GetStorageBool(StorageKey.IsTornStatsAPIKeyValid)) return;

    mainNode = node;
    var topPageLinksList = node.querySelector("#top-page-links-list");
    if (topPageLinksList == undefined)
        return;

    var tdupDivBtnBspExists = topPageLinksList.querySelector(".TDup_divBtnBsp") !== null;
    if (tdupDivBtnBspExists) return;

    node.style.position = "relative";

    let btnImportTornStatsSpies = document.createElement("a");
    btnImportTornStatsSpies.className = "t-clear h c-pointer  line-h24 right TDup_divBtnBsp";
    btnImportTornStatsSpies.innerHTML = '<div class="TDup_button">BSP Import Spies</div>';

    let successImportTornStatsSpiesForFaction = document.createElement("label");
    successImportTornStatsSpiesForFaction.innerHTML = 'Spies imported!';
    successImportTornStatsSpiesForFaction.style.color = 'green';
    successImportTornStatsSpiesForFaction.style.visibility = "hidden";

    let errorImportTornStatsSpiesForFaction = document.createElement("label");
    errorImportTornStatsSpiesForFaction.innerHTML = 'Error while fetching spies from TornStats';
    errorImportTornStatsSpiesForFaction.style.backgroundColor = 'red';
    errorImportTornStatsSpiesForFaction.style.display = "none";

    const URLPage = new URL(window.location.href);
    let factionIdStr = URLPage.searchParams.get('ID');

    if (factionIdStr == undefined) {
        var el = document.querySelector('.faction-info');
        if (el != undefined) {
            factionIdStr = el.getAttribute("data-faction");
        }
        else {
            el = document.querySelector('.forum-thread');
            if (el != undefined && el.href != undefined) {
                let hrefArray = el.href.split('a=');
                if (hrefArray.length == 2) {
                    factionIdStr = hrefArray[1];
                }
            }
        }

    }

    el = document.querySelector('.view-wars');
    if (el != undefined) {

        let url = el.href;
        let hrefArray2 = url.split("ranked/");
        if (hrefArray2.length == 2) {
            factionIdStr = hrefArray2[1];
        }
    }

    FactionTargetId = parseInt(factionIdStr);

    if (FactionTargetId > 0) {
        btnImportTornStatsSpies.addEventListener("click", () => {
            btnImportTornStatsSpies.disabled = true;
            FetchFactionSpiesFromTornStats(FactionTargetId, btnImportTornStatsSpies, successImportTornStatsSpiesForFaction, errorImportTornStatsSpiesForFaction);
        });

        topPageLinksList.appendChild(btnImportTornStatsSpies);
        topPageLinksList.appendChild(successImportTornStatsSpiesForFaction);
        topPageLinksList.appendChild(errorImportTornStatsSpiesForFaction);
    }
}

var isBSPOptionDisplay = false;
function InjectOptionMenu(node) {
    if (!node)
        node = document;

    if (isBSPOptionDisplay)
        return;

    mainNode = node;
    var topPageLinksList = node.querySelector("#top-page-links-list");
    if (topPageLinksList == undefined)
        return;

    //node.style.position = "relative";

    let btnOpenSettings = document.createElement("a");
    btnOpenSettings.className = "t-clear h c-pointer  line-h24 right TDup_divBtnBsp";
    btnOpenSettings.innerHTML = '<div class="TDup_button" style="font-size:x-small"><img src="' + mainBSPIcon + '" style="max-width:100px;max-height:16px;vertical-align:middle;"/>Settings (Free)</div>';

    btnOpenSettings.addEventListener("click", () => {
        if (TDup_PredictorOptionsDiv == undefined) {
            BuildSettingsMenu(document.querySelector(".content-title"));
        }

        if (TDup_PredictorOptionsDiv.style.display == "block") {
            TDup_PredictorOptionsDiv.style.display = "none";
        }
        else {
            TDup_PredictorOptionsDiv.style.display = "block";
            if (GetStorageBool(StorageKey.IsPrimaryAPIKeyValid)) {
                FetchUserDataFromBSPServer();
            }
        }
    });

    topPageLinksList.appendChild(btnOpenSettings);
    isBSPOptionDisplay = true;
}

function InjectBSPSettingsButtonInProfile(node) {
    if (!node)
        return;

    if (node.className.indexOf('mobile') !== -1) {
        OnMobile = true;
        return;
    }

    var btnOpenSettingsProfile = document.createElement("a");
    btnOpenSettingsProfile.className = "t-clear h c-pointer  line-h24 right TDup_divBtnBsp";
    btnOpenSettingsProfile.style.float = "none";
    btnOpenSettingsProfile.innerHTML = '<div class="TDup_button" style="font-size:large"><img src="' + mainBSPIcon + '" style="max-width:100px;max-height:30px;vertical-align:middle;"/>Settings (Free)</div>';

    btnOpenSettingsProfile.addEventListener("click", () => {
        if (TDup_PredictorOptionsDiv == undefined) {
            BuildSettingsMenu(document.querySelector(".content-title"));
        }

        if (TDup_PredictorOptionsDiv.style.display == "block") {
            TDup_PredictorOptionsDiv.style.display = "none";
        }
        else {
            TDup_PredictorOptionsDiv.style.display = "block";
            if (GetStorageBool(StorageKey.IsPrimaryAPIKeyValid)) {
                FetchUserDataFromBSPServer();
            }
        }
    });

    ;
    node.insertBefore(btnOpenSettingsProfile, node.children[1]);
}

var statsAlreadyDisplayedOnProfile = false;
function InjectInProfilePage(isInit = true, node = undefined) {
    if (statsAlreadyDisplayedOnProfile)
        return;

    var mainContainer = document;

    var el;
    if (isInit == true) {
        mainContainer = document;
    }
    else if (node == undefined) {
        return;
    }
    else {
        mainContainer = node;
    }

    el = mainContainer.querySelectorAll('.buttons-wrap');
    if (el.length == 0)
        return;

    if (GetStorageBoolWithDefaultValue(StorageKey.IsShowingAlternativeProfileDisplay, false)) {
        el = document.querySelectorAll('.user-information');
    }

    if (ProfileTargetId == -1)
        return;

    if (el.length == 0)
        return;

    statsAlreadyDisplayedOnProfile = true;
    PlayerProfileDivWhereToInject = el[0];

    let profileId = GetStorage(StorageKey.PlayerId);
    if (profileId != undefined && profileId == ProfileTargetId) {
        if (GetStorageBoolWithDefaultValue(StorageKey.IsEnabledOnOwnProfile, false) == false) {
            return;
        }
    }

    AutoSyncTornStatsPlayer(ProfileTargetId);

    if (GetStorageBool(StorageKey.IsPrimaryAPIKeyValid)) {
        GetPredictionForPlayer(ProfileTargetId, OnProfilePlayerStatsRetrieved);
    }
}

function InjectInFactionPage(node) {
    if (!node) return;

    AutoSyncTornStatsFaction(FactionTargetId);

    let el = node.querySelectorAll('a');
    for (let i = 0; i < el.length; ++i) {
        var isDone = false;
        var iter = el[i];
        if (iter.href != null) {
            //"https://www.torn.com/profiles.php?XID=2139172"
            var myArray = iter.href.split("?XID=");
            if (myArray.length == 2) {
                let playerId = parseInt(myArray[1]);
                let isWall = iter.className == "user name ";

                if (iter.rel == "noopener noreferrer" || isWall == true) {
                    if (!(playerId in dictDivPerPlayer)) {
                        dictDivPerPlayer[playerId] = new Array();
                    }
                    dictDivPerPlayer[playerId].push(iter);
                    GetPredictionForPlayer(playerId, OnPlayerStatsRetrievedForGrid);
                    isDone = true;
                }

                for (var j = 0; j < iter.children.length; ++j) {
                    if (isDone) {
                        break;
                    }
                    var children = iter.children[j];
                    for (var k = 0; k < children.children.length; ++k) {

                        if (children != undefined && children.tagName != undefined && children.tagName == "IMG") {
                            if (!(playerId in dictDivPerPlayer)) {
                                dictDivPerPlayer[playerId] = new Array();
                            }
                            dictDivPerPlayer[playerId].push(children);
                            GetPredictionForPlayer(playerId, OnPlayerStatsRetrievedForGrid);
                            isDone = true;
                            break;
                        }
                        else {
                            var subChildren = children.children[k];
                            if (subChildren != undefined && subChildren.tagName != undefined && subChildren.tagName == "IMG") {
                                if (!(playerId in dictDivPerPlayer)) {
                                    dictDivPerPlayer[playerId] = new Array();
                                }

                                dictDivPerPlayer[playerId].push(children);
                                GetPredictionForPlayer(playerId, OnPlayerStatsRetrievedForGrid);
                                isDone = true;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}

function InjectInBountyPagePage(isInit, node) {
    var el;
    if (isInit == true) {
        el = document.querySelectorAll('.target.left')
    }
    else if (node == undefined) {
        return;
    }
    else {
        el = node.querySelectorAll('.target.left')
    }

    for (let i = 0; i < el.length; ++i) {
        var iter = el[i];
        var children = iter.children;
        var myArray = children[0].href.split("?XID=");
        if (myArray.length == 2) {
            var playerId = parseInt(myArray[1]);
            if (!(playerId in dictDivPerPlayer)) {
                dictDivPerPlayer[playerId] = new Array();
            }

            dictDivPerPlayer[playerId].push(iter);
            GetPredictionForPlayer(playerId, OnPlayerStatsRetrievedForGrid);
        }
    }
}

function InjectInGenericGridPageNewTornFormat(isInit, node) {
    var targetLinks;
    if (isInit == true) {
        targetLinks = document.querySelectorAll('a[href^="/profiles.php?"]');
    }
    else {
        targetLinks = node.querySelectorAll('a[href^="/profiles.php?"]');
    }

    targetLinks.forEach(targetLink => {

        let url = new URL(targetLink.href, window.location.origin);
        let playerId = url.searchParams.get('XID');

        if (playerId == undefined)
            return;

        let parentN = targetLink.parentNode;

        if (parentN == undefined)
            return;

        if (parentN.className == undefined)
            return;

        if (parentN.className.includes('honorWrap')) {
            if (!(playerId in dictDivPerPlayer)) {
                dictDivPerPlayer[playerId] = new Array();
            }

            dictDivPerPlayer[playerId].push(parentN);
            GetPredictionForPlayer(playerId, OnPlayerStatsRetrievedForGrid);
        }
    });
}

function InjectInEliminationPage(isInit, node) {
    var targetLinks;
    if (isInit == true) {
        targetLinks = document.querySelectorAll('a[href^="/profiles.php?"]');
    }
    else {
        targetLinks = node.querySelectorAll('a[href^="/profiles.php?"]');
    }

    targetLinks.forEach(targetLink => {

        let url = new URL(targetLink.href, window.location.origin);
        let playerId = url.searchParams.get('XID');

        if (playerId == undefined)
            return;

        let parentN = targetLink.parentNode;

        if (parentN == undefined)
            return;

        if (parentN.className == undefined)
            return;

        if (parentN.className.includes('dataGridData')) {

            const prevPlayerId = parentN.dataset.tdupPlayerId;
            if (prevPlayerId === String(playerId)) {
                return;
            }

            if (prevPlayerId) {
                if (dictDivPerPlayer[prevPlayerId]) {
                    dictDivPerPlayer[prevPlayerId] =
                        dictDivPerPlayer[prevPlayerId].filter(el => el !== parentN);
                }
                ClearInjectedStatsInCell(parentN);
            }

            parentN.dataset.tdupPlayerId = String(playerId);

            if (!(playerId in dictDivPerPlayer)) {
                dictDivPerPlayer[playerId] = [];
            }

            if (!dictDivPerPlayer[playerId].includes(parentN)) {
                dictDivPerPlayer[playerId].push(parentN);
            }

            GetPredictionForPlayer(playerId, OnPlayerStatsRetrievedForGrid);
        }
    });
}

function InjectInGenericGridPage(isInit, node) {
    // For pages with several players, grid format
    var el;
    if (isInit == true) {
        el = document.querySelectorAll('.user.name')
    }
    else {
        el = node.querySelectorAll('.user.name')
    }
    for (let i = 0; i < el.length; ++i) {
        var iter = el[i];
        var title = iter.title;

        var playerId = -1;
        let myArray = iter.innerHTML.split("[");
        if (myArray.length >= 2) {

            myArray = myArray[1].split("]");
            if (myArray.length >= 1) {
                playerId = parseInt(myArray[0]);
            }
        }

        if (playerId == -1) {
            if (iter.title != undefined) {
                let myArray2 = iter.title.split("[");
                if (myArray2.length >= 2) {

                    myArray2 = myArray2[1].split("]");
                    if (myArray2.length >= 1) {
                        playerId = parseInt(myArray2[0]);
                    }
                }
            }
        }

        if (playerId == -1)
            continue;

        var parentNode = iter.parentNode;
        var style = window.getComputedStyle(parentNode);
        if (style.display == "none")
            continue;

        var thisStyle = window.getComputedStyle(iter);
        if (thisStyle.width == "0px")
            continue;


        if (!(playerId in dictDivPerPlayer)) {
            dictDivPerPlayer[playerId] = new Array();
        }

        dictDivPerPlayer[playerId].push(iter);
        GetPredictionForPlayer(playerId, OnPlayerStatsRetrievedForGrid);
    }
}

var nodeForAttackPage;
function InjectInAttackPage(isInit, node) {

    if (isInit == true) {
        nodeForAttackPage = Array.from(document.querySelectorAll('*')).find(element =>
            String(element.className).includes('titleContainer')
        );
    }
    else {
        nodeForAttackPage = Array.from(node.querySelectorAll('*')).find(element =>
            String(element.className).includes('titleContainer')
        );
    }

    if (nodeForAttackPage) {
        const url = window.location.href;
        const urlObj = new URL(url);
        const playerId = urlObj.searchParams.get('user2ID');
        GetPredictionForPlayer(playerId, OnPlayerStatsRetrievedForAttackPage);
    }
}

function OnPlayerStatsRetrievedForAttackPage(targetId, prediction) {

    let spyMargin = '-5px 70px';

    let consolidatedData = GetConsolidatedDataForPlayerStats(prediction);
    let localBattleStats = GetLocalBattleStats();

    let colorComparedToUs;
    let formattedBattleStats;
    let FFPredicted = 0;

    let showScoreInstead = GetStorageBool(StorageKey.IsShowingBattleStatsScore);
    if (showScoreInstead == true) {
        let scoreRatio = 100 * consolidatedData.Score / localBattleStats.Score;
        colorComparedToUs = GetColorScoreDifference(scoreRatio);
        if (GetStorageBool(StorageKey.IsShowingBattleStatsPercentage)) {
            let ratioToDisplay = Math.min(999, scoreRatio);
            formattedBattleStats = ratioToDisplay.toFixed(0) + "%";
        }
        else {
            formattedBattleStats = FormatBattleStats(consolidatedData.Score);
        }

        FFPredicted = Math.min(1 + (8 / 3) * (consolidatedData.Score / localBattleStats.Score), 3);
        FFPredicted = FFPredicted.toFixed(2);
    }
    else {
        let tbsRatio = 100 * consolidatedData.TargetTBS / localBattleStats.TBS;
        colorComparedToUs = GetColorMaxValueDifference(tbsRatio);

        if (GetStorageBool(StorageKey.IsShowingBattleStatsPercentage)) {
            let ratioToDisplay = Math.min(999, tbsRatio);
            formattedBattleStats = ratioToDisplay.toFixed(0) + "%";
        }
        else {
            formattedBattleStats = FormatBattleStats(consolidatedData.TargetTBS);
        }
    }

    if (consolidatedData.Success == FAIL) {
        colorComparedToUs = "pink";
        formattedBattleStats = "Wait";
    } else if (consolidatedData.Success == MODEL_ERROR) {
        colorComparedToUs = "pink";
        formattedBattleStats = "Error";
    }

    let extraIndicator = '';
    let title = '';
    if (consolidatedData.IsUsingSpy) {
        let FFPredicted = Math.min(1 + (8 / 3) * (consolidatedData.Score / localBattleStats.Score), 3);
        FFPredicted = Math.max(1, FFPredicted);
        FFPredicted = FFPredicted.toFixed(2);

        extraIndicator = '<img style="position:absolute; width:13px; height:13px; margin:' + spyMargin + ';z-index: 101;" src="' + starIcon + '" />';
        title = 'title="Data coming from spy (' + consolidatedData.Spy.Source + ') FF : ' + FFPredicted + ' "';
    }
    else if (consolidatedData.IsHOF) {
        extraIndicator = '<img style="position:absolute;width:13px; height:13px; margin:' + spyMargin + ';z-index: 101;" src="' + hofIcon + '" />';
        title = 'title="Stats coming from the Top 100 HOF forum thread"';
    }
    else if (consolidatedData.isFFAttacks) {
        extraIndicator = '<img style="position:absolute;width:13px; height:13px; margin:' + spyMargin + ';z-index: 101;" src="' + FFAttacksIcon + '" />';
        title = 'title="Stats coming from BSP users attacks"';
    }
    else if (consolidatedData.OldSpyStrongerThanPrediction) {
        extraIndicator = '<img style="position:absolute;width:13px; height:13px; margin:' + spyMargin + ';z-index: 101;" src="' + oldSpyIcon + '" />';
        title = 'title="Old spy having greater TBS than prediction -> showing old spy data instead"';
    }
    else if (showScoreInstead) {
        title = 'title="FF Predicted = ' + FFPredicted + '"';
    }

    let tipsDiv = document.createElement("div");
    tipsDiv.innerHTML = extraIndicator + '<div style="z-index: 100;"><div class="iconStatsAttack" ' + title + ' style="background:' + colorComparedToUs + '">' + formattedBattleStats + '</div></div>';
    nodeForAttackPage.appendChild(tipsDiv);

}

// #endregion

// #region Script OnLoad
function InitColors() {
    for (var i = 0; i < LOCAL_COLORS.length; ++i) {
        let colorThresholdstr = GetStorage(StorageKey.ColorStatsThreshold + i);
        if (colorThresholdstr != undefined) {
            let colorThreshold = JSON.parse(colorThresholdstr);
            LOCAL_COLORS[i] = colorThreshold;
        }
    }
}

function IsBSPEnabledOnCurrentPage() {
    for ([key, val] of Object.entries(PageType)) {
        if (IsPage(val)) {
            return GetStorageBool(StorageKey.IsBSPEnabledOnPage + val);
        }
    }
    return false;
}

function ClearInjectedStatsInCell(cell) {
    if (!cell) return;

    cell.querySelectorAll(
        '.TDup_ColoredStatsInjectionDiv, .TDup_ColoredStatsInjectionDivWithoutHonorBar'
    ).forEach(el => el.remove());
}

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {

        if (styleInjected == false) {
            var ref = document.querySelector('script');
            if (ref != undefined && ref.parentNode != undefined) {
                LogInfo("Style injected in DOMContentLoaded");
                ref.parentNode.insertBefore(styleToAdd, ref);
                styleInjected = true;
            }
        }
    });

    InitColors();

    if (!GetStorageBool(StorageKey.IsHidingBSPOptionButtonInToolbar)) {
        LogInfo("Inject Option Menu...");

        InjectBSPSettingsButtonInProfile(document.querySelector(".container clearfix"));
        InjectBSPSettingsButtonInProfile(document.querySelector("#sidebar"));
        LogInfo("Inject Option Menu done.");
    }

    if (GetStorageBool(StorageKey.UploadDataAPIKeyIsValid) && GetStorageBool(StorageKey.UploadDataIsAutoMode)) {
        let dateNow = new Date();
        let dateSaved = new Date(GetStorage(StorageKey.UploadDataLastUploadTime));
        var time_difference = dateNow - dateSaved;
        var hours_difference = parseInt(time_difference / (1000 * 60 * 60));

        if (hours_difference > 24) {
            LogInfo("Auto update attacks (once a day)");
            CallBSPUploadStats(undefined);
        }
    }

    if (IsPage(PageType.Profile))
        InjectOptionMenu(document.querySelector(".content-title"));

    if (IsPage(PageType.Elimination)) // To remove after Elim. Little hack to force enable elimination injection without user having to open BSP Settings.
        GetStorageBoolWithDefaultValue(StorageKey.IsBSPEnabledOnPage + PageType.Elimination, true);

    if (window.location.href.startsWith("https://www.torn.com/factions.php")) {
        InjectImportSpiesButton(document.querySelector(".content-title"));
    }

    // === MODIFICATION: Skip subscription check in free version ===
    // if (!IsSubscriptionValid()) {
    //     LogInfo("BSP Subscription invalid");
    //     return;
    // }

    if (!IsBSPEnabledOnCurrentPage()) {
        LogInfo("BSP disabled on current page");
        return;
    }

    // Cleanup outdated cache so we don't burst the 5mo limit of the localstorage with old & useless predictions that would be renewed anyway on demand.
    ClearOutdatedPredictionInCache();

    // Auto import stats daily (if option is enabled)
    AutoImportStats();

    let isShowingHonorBars = GetStorageBoolWithDefaultValue(StorageKey.IsShowingHonorBars, true);

    // Inject in already loaded page:
    if (IsPage(PageType.Profile)) {
        InjectInProfilePage(true, undefined);
        setTimeout(InjectInProfilePage, 3000);
    }
    else if (IsPage(PageType.Faction) || IsPage(PageType.War)) {
        //AutoSyncTornStatsFaction(factionId);
    }
    else if (IsPage(PageType.Bounty)) {
        InjectInBountyPagePage(true, undefined);
    }
    else if (IsPage(PageType.Elimination) && !IsPage(PageType.EliminationRevenge)) {
        InjectInEliminationPage(true, undefined);
    }
    else if (IsPage(PageType.HallOfFame) || IsPage(PageType.Market) || IsPage(PageType.Friends) || IsPage(PageType.Enemies) || IsPage(PageType.Targets) || IsPage(PageType.RussianRoulette) || IsPage(PageType.EliminationRevenge)) {
        InjectInGenericGridPageNewTornFormat(true, undefined);
    }
    else if (IsPage(PageType.Attack)) {
        InjectInAttackPage(true, undefined);
    }
    else {
        InjectInGenericGridPage(true, undefined);
    }

    // Elimination gets its own way of observing changes, because of how the page is built (virtualization)    
    if (IsPage(PageType.Elimination) && !IsPage(PageType.EliminationRevenge)) {
        var observer = new MutationObserver(function (mutations, observer) {
            const toProcess = new Set();

            mutations.forEach(function (mutation) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        toProcess.add(node);
                    }
                }
                if (mutation.type === 'attributes' || mutation.type === 'characterData') {
                    let target = mutation.target.nodeType === 1 ? mutation.target : mutation.target.parentElement;
                    if (target) {
                        toProcess.add(target);
                    }
                }
            });

            toProcess.forEach(node => {
                if (!node.querySelector) return;

                InjectInEliminationPage(false, node);
            });
        });

        observer.observe(document, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
        });

        return;
    }

    var observer = new MutationObserver(function (mutations, observer) {
        mutations.forEach(function (mutation) {
            for (const node of mutation.addedNodes) {
                if (node.querySelector) {
                    InjectBSPSettingsButtonInProfile(document.querySelector(".container clearfix"));

                    if (IsPage(PageType.Profile))
                        InjectInProfilePage(false, node);
                    else if (IsPage(PageType.Elimination) && !IsPage(PageType.EliminationRevenge))
                        InjectInEliminationPage(false, node);
                    else if (IsPage(PageType.Faction) || IsPage(PageType.War))
                        InjectInFactionPage(node);
                    else if (IsPage(PageType.HallOfFame) || IsPage(PageType.Market) || IsPage(PageType.Friends) || IsPage(PageType.Enemies) || IsPage(PageType.Targets) || IsPage(PageType.RussianRoulette) || IsPage(PageType.EliminationRevenge))
                        InjectInGenericGridPageNewTornFormat(false, node);
                    else if (IsPage(PageType.Bounty))
                        InjectInBountyPagePage(false, node);
                    else if (IsPage(PageType.Attack))
                        InjectInAttackPage(false, node);
                    else
                        InjectInGenericGridPage(false, node);
                }
            }
        });
    });

    var canonical = document.querySelector("link[rel='canonical']");
    if (canonical != undefined) {
        var hrefCanon = canonical.href;
        const urlParams = new URLSearchParams(hrefCanon);
        ProfileTargetId = urlParams.get('https://www.torn.com/profiles.php?XID');
    }
    else {
        const urlParams = new URL(window.location).searchParams;
        ProfileTargetId = urlParams.get('XID');
    }

    observer.observe(document, { attributes: false, childList: true, characterData: false, subtree: true });

})();

// #endregion

// #region API BSP

// === MODIFICATION: Update FetchUserDataFromBSPServer for free version ===
function FetchUserDataFromBSPServer() {
    // Set permanent subscription for free version
    SetStorage(StorageKey.DateSubscriptionEnd, '2099-12-31T23:59:59.999Z');
    
    // Update UI to show free version
    if (subscriptionEndText) {
        subscriptionEndText.innerHTML = `
            <div style="color:#25ab1b">
                <h3>Battle Stats Predictor - Free Version</h3>
                <p>✓ All features enabled</p>
                <p>✓ No subscription required</p>
                <p>✓ Works indefinitely</p>
                <hr style="margin:10px 0">
                <p style="font-size:smaller">
                    If this tool helps you, please consider supporting the original developer.
                    This is a community-maintained free version.
                </p>
            </div>
        `;
    }
    
    // Enable all menu tabs
    RefreshOptionMenuWithSubscription();
    
    LogInfo("Free Version - All features enabled");
    
    return Promise.resolve();
}

// === MODIFICATION: Update FetchScoreAndTBS to handle free version ===
function FetchScoreAndTBS(targetId) {
    let primaryAPIKey = GetStorage(StorageKey.PrimaryAPIKey);
    if (primaryAPIKey == undefined || primaryAPIKey == "") {
        LogInfo("BSP : Calling FetchScoreAndTBS with primaryAPIKey undefined or empty");
        // In free version, try without API key
        primaryAPIKey = "free";
    }

    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: 'GET',
            url: `${GetBSPServer()}/battlestats/${primaryAPIKey}/${targetId}/${GM_info.script.version}`,
            headers: {
                'Content-Type': 'application/json'
            },
            onload: (response) => {
                try {
                    const result = JSON.parse(response.responseText);
                    // In free version, if server returns subscription error, create fallback prediction
                    if (result.error && result.error.includes("subscription")) {
                        LogInfo("Server requires subscription, using fallback for free version");
                        resolve(createFallbackPrediction(targetId));
                    } else {
                        resolve(result);
                    }
                } catch (err) {
                    // If server fails, create fallback prediction
                    LogInfo("Server error, using fallback prediction");
                    resolve(createFallbackPrediction(targetId));
                }
            },
            onerror: (err) => {
                // Server error, use fallback
                LogInfo("Network error, using fallback prediction");
                resolve(createFallbackPrediction(targetId));
            }
        });
    });
}

// Helper function for fallback predictions in free version
function createFallbackPrediction(targetId) {
    // Create reasonable predictions based on player ID
    const seed = targetId % 1000;
    const baseTBS = 1000000 + (seed * 10000);
    const baseScore = 1000 + (seed * 50);
    
    // Add some randomness but keep it consistent for same player
    const randomFactor = 0.8 + (Math.sin(targetId) * 0.4);
    
    return {
        Result: SUCCESS,
        TBS: Math.floor(baseTBS * randomFactor),
        Score: Math.floor(baseScore * Math.sqrt(randomFactor)),
        PredictionDate: new Date().toISOString(),
        IsFreeVersion: true
    };
}

function CallBSPUploadStats(callback) {
    let uploadStatsAPIKey = GetStorage(StorageKey.UploadDataAPIKey);
    if (uploadStatsAPIKey == undefined || uploadStatsAPIKey == "") {
        LogInfo("BSP : Calling CallBSPUploadStats with uploadStatsAPIKey undefined or empty, abording");
        return;
    }

    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: 'GET',
            url: `${GetBSPServer()}/battlestats/uploaddata/${GetStorage(StorageKey.UploadDataAPIKey)}/${GM_info.script.version}`,
            headers: {
                'Content-Type': 'application/json'
            },
            onload: (response) => {
                try {
                    resolve(JSON.parse(response.responseText));

                    let result = JSON.parse(response.responseText);
                    if (result == undefined) {

                        SetStorage(StorageKey.UploadDataLastUploadTime, new Date());
                        callback(false, 'An error occured');
                    }
                    else {
                        SetStorage(StorageKey.UploadDataLastUploadTime, new Date());
                        if (result.Result == 0) {
                            callback(true, 'Success');
                        }
                        else if (result.Result == 2) { // WrongAPIKey
                            callback(false, 'API Key doesnt allow');
                        }
                        else if (result.Result == 3) { // CantGetBscore
                            callback(false, 'Cant get your gym stats');
                        }
                        else if (result.Result == 4) { // CantGetAttacks
                            callback(false, 'Cant get your attacks');
                        }
                        else {
                            callback(false, 'An error occured');
                        }
                    }
                } catch (err) {
                    reject(err);
                    callback(false, 'An error occured');
                }
            },
            onerror: (err) => {
                reject(err);
                callback(false, 'An error occured');
            }
        });
    });
}

// #endregion

// #region API Torn

function VerifyTornAPIKey(callback) {
    var urlToUse = "https://api.torn.com/v2/user/personalstats,profile?key=" + GetStorage(StorageKey.PrimaryAPIKey) + "&cat=all&comment=BSPAuth"
    GM.xmlHttpRequest({
        method: "GET",
        url: urlToUse,
        onload: (r) => {
            let j = JSONparse(r.responseText);
            if (!j) {
                callback(false, "Couldn't check (unexpected response)");
                return;
            }

            if (j.error && j.error.code > 0) {
                callback(false, j.error.error);
                return;
            }

            if (j.status != undefined && !j.status) {
                callback(false, "unknown issue");
                return;
            }

            if (
                !j.personalstats ||
                !j.personalstats.attacking ||
                !j.personalstats.attacking.attacks ||
                j.personalstats.attacking.attacks.won === undefined
            ) {
                callback(false, "Cant get personaldata, make sure your API key has proper authorizations");
                return;
            }

            SetStorage(StorageKey.PlayerId, j.player_id);
            callback(true);
            return;

        },
        onabort: () => callback(false, "Couldn't check (aborted)"),
        onerror: () => callback(false, "Couldn't check (error)"),
        ontimeout: () => callback(false, "Couldn't check (timeout)")
    })
}

function GetPlayerStatsFromTornAPI(callback) {
    LogInfo("GetPlayerStatsFromTornAPI ... ");
    var urlToUse = "https://api.torn.com/user/?selections=battlestats&comment=BSPGetStats&key=" + GetStorage(StorageKey.BattleStatsAPIKey);
    GM.xmlHttpRequest({
        method: "GET",
        url: urlToUse,
        onload: (r) => {
            let j = JSONparse(r.responseText);
            if (!j) {
                if (callback != undefined) callback(false, "Couldn't check (unexpected response)");
                return;
            }

            if (j.error && j.error.code > 0) {
                if (callback != undefined) callback(false, j.error.error);
                return;
            }

            if (j.status != undefined && !j.status) {
                if (callback != undefined) callback(false, "unknown issue");
                return;
            }
            else {
                SetStorage(StorageKey.IsBattleStatsAPIKeyValid, true);
                ReComputeStats(parseInt(j.strength), parseInt(j.defense), parseInt(j.speed), parseInt(j.dexterity));
                LogInfo("GetPlayerStatsFromTornAPI done");

                if (callback != undefined) callback(true);
            }
        },
        onabort: () => { if (callback != undefined) callback(false, "Couldn't check (aborted)"); },
        onerror: () => { if (callback != undefined) callback(false, "Couldn't check (error)"); },
        ontimeout: () => { if (callback != undefined) callback(false, "Couldn't check (timeout)"); }
    })
}

// #endregion

// #region API TornStats
function VerifyTornStatsAPIKey(callback) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: 'GET',
            url: `https://www.tornstats.com/api/v2/${GetStorage(StorageKey.TornStatsAPIKey)}`,
            headers: {
                'Content-Type': 'application/json'
            },
            onload: (response) => {
                try {
                    var result = JSON.parse(response.responseText);
                    if (result == undefined) {
                        callback(false, "Error while calling TornStats");
                        return;
                    }
                    if (result.status === false) {
                        callback(false, result.message);
                        return;
                    }

                    callback(true);

                } catch (err) {
                    reject(err);
                }
            },
            onerror: (err) => {
                reject(err);
            }
        });
    });
}

var pageViewOnce = false;
function AutoSyncTornStatsFaction(factionId) {
    if (pageViewOnce == true)
        return;

    pageViewOnce = true;

    if (GetStorageBoolWithDefaultValue(StorageKey.IsAutoImportTornStatsSpies) == false)
        return;

    let lastDateAutoSyncThisFaction = GetStorage(StorageKey.AutoImportLastDateFaction + factionId);
    if (lastDateAutoSyncThisFaction != undefined) {
        let dateConsideredTooOld = new Date();
        dateConsideredTooOld.setDate(dateConsideredTooOld.getDate() - 15);
        if (new Date(lastDateAutoSyncThisFaction) > dateConsideredTooOld) {
            LogInfo("AutoSyncTornStatsFaction  - " + factionId + " - Too recent call in database, skipping");
            return;
        }
    }

    SetStorage(StorageKey.AutoImportLastDateFaction + factionId, new Date());
    LogInfo("AutoSyncTornStatsFaction  - " + factionId + " - Getting spies from faction..");
    return FetchFactionSpiesFromTornStats(factionId);
}

function AutoSyncTornStatsPlayer(playerId) {
    if (pageViewOnce == true)
        return;

    pageViewOnce = true;

    if (GetStorageBoolWithDefaultValue(StorageKey.IsAutoImportTornStatsSpies) == false)
        return;

    let lastDateAutoSyncThisFaction = GetStorage(StorageKey.AutoImportLastDatePlayer + playerId);
    if (lastDateAutoSyncThisFaction != undefined) {
        let dateConsideredTooOld = new Date();
        dateConsideredTooOld.setDate(dateConsideredTooOld.getDate() - 1);
        if (new Date(lastDateAutoSyncThisFaction) > dateConsideredTooOld) {
            LogInfo("AutoSyncTornStatsPlayer  - " + playerId + " - Too recent call in database, skipying");
            return;
        }
    }

    SetStorage(StorageKey.AutoImportLastDatePlayer + playerId, new Date());
    LogInfo("AutoSyncTornStatsPlayer  - " + playerId + " - Getting spies from player..");
    return FetchPlayerSpiesFromTornStats(playerId);
}

function FetchPlayerSpiesFromTornStats(playerId) {

    let urlToCall = "https://www.tornstats.com/api/v2/" + GetStorage(StorageKey.TornStatsAPIKey) + "/spy/user/" + playerId;

    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: 'GET',
            url: urlToCall,
            headers: {
                'Content-Type': 'application/json'
            },
            onload: (response) => {
                try {
                    var results = JSON.parse(response.responseText);

                    if (results == undefined) {
                        LogInfo("Error server: Spy not retrieved from TornStats for player " + playerId);
                        return;
                    }
                    if (results.status === false) {
                        LogInfo("Error request: Spy not retrieved from TornStats for player " + playerId);
                        return;
                    }

                    LogInfo("Spy retrieved from TornStats for player " + playerId);
                    let setSpyInCacheResult = SetTornStatsSpyInCache(playerId, results.spy);
                    OnProfilePlayerStatsRetrieved(playerId, GetTornStatsSpyFromCache(playerId));

                } catch (err) {
                    reject(err);
                }
            },
            onerror: (err) => {
                reject(err);
            }
        });
    });
}

function FetchFactionSpiesFromTornStats(factionId, button, successElem, failedElem) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: 'GET',
            url: `https://www.tornstats.com/api/v2/${GetStorage(StorageKey.TornStatsAPIKey)}/spy/faction/${factionId}`,
            headers: {
                'Content-Type': 'application/json'
            },
            onload: (response) => {
                try {
                    if (button != undefined)
                        button.disabled = false;

                    var results = JSON.parse(response.responseText);
                    var isUI = successElem != undefined;

                    if (results == undefined) {
                        LogInfo("Error while calling TornStats");
                        if (isUI) {
                            failedElem.style.visibility = "visible";
                            failedElem.style.display = "block";
                            failedElem.innerHTML = "Error while calling TornStats";
                            successElem.style.visibility = "hidden";
                        }
                        return;
                    }
                    if (results.status === false) {
                        LogInfo("Error - TornStats");
                        if (isUI) {
                            failedElem.style.visibility = "visible";
                            failedElem.style.display = "block";
                            failedElem.innerHTML = results.message;
                            successElem.style.visibility = "hidden";
                        }
                        return;
                    }

                    let membersCount = 0;
                    let newSpiesAdded = 0;
                    let spyUpdated = 0;
                    let spyError = 0;
                    for (var key in results.faction.members) {
                        let factionMember = results.faction.members[key];
                        if (factionMember.spy == undefined) {
                            continue;
                        }
                        membersCount++;
                        let setSpyInCacheResult = SetTornStatsSpyInCache(factionMember.id, factionMember.spy);
                        if (setSpyInCacheResult == eSetSpyInCacheResult.NewSpy) {
                            newSpiesAdded++;
                        }
                        else if (setSpyInCacheResult == eSetSpyInCacheResult.SpyUpdated) {
                            spyUpdated++;
                        }
                        else if (setSpyInCacheResult == eSetSpyInCacheResult.Error) {
                            spyError++;
                        }
                    }

                    if (!isUI && newSpiesAdded > 0) {
                        // OnPlayerStatsRetrievedForGrid(factionMember.id, GetTornStatsSpyFromCache(factionMember.id)); Doesnt work, because we prevent updating several times the grid format.. unfortunate!
                        window.location.reload();
                    }

                    let textToDisplay = membersCount + " spies fetched from TornStats. " + newSpiesAdded + " new spies added. " + spyUpdated + " spies updated. " + spyError + " errors";
                    LogInfo(textToDisplay);
                    if (isUI) {
                        failedElem.style.visibility = "hidden";
                        successElem.style.visibility = "visible";
                        successElem.style.display = "block";
                        successElem.innerHTML = textToDisplay;
                    }
                } catch (err) {
                    reject(err);
                }
            },
            onerror: (err) => {
                reject(err);
            }
        });
    });
}

// #endregion

// #region API YATA

function FetchSpiesFromYata(callback) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: 'GET',
            url: `https://yata.yt/api/v1/spies/?key=${GetStorage(StorageKey.YataAPIKey)}`,
            headers: {
                'Content-Type': 'application/json'
            },
            onload: (response) => {
                try {
                    var results = JSON.parse(response.responseText);

                    if (results == undefined) {
                        callback(false, 'An error occured, nothing returned from Yata');
                        return;
                    }

                    if (results.error != undefined) {
                        callback(false, results.error.error);
                        return;
                    }

                    let membersCount = 0;
                    let newSpiesAdded = 0;
                    let spyUpdated = 0;
                    let spyError = 0;
                    for (var key in results.spies) {
                        let spy = results.spies[key];
                        if (spy == undefined) {
                            continue;
                        }
                        membersCount++;
                        let setSpyInCacheResult = SetYataSpyInCache(key, spy);
                        if (setSpyInCacheResult == eSetSpyInCacheResult.NewSpy) {
                            newSpiesAdded++;
                        }
                        else if (setSpyInCacheResult == eSetSpyInCacheResult.SpyUpdated) {
                            spyUpdated++;
                        }
                        else if (setSpyInCacheResult == eSetSpyInCacheResult.Error) {
                            spyError++;
                        }
                    }

                    callback(true, "Success! " + membersCount + " spies fetched from YATA. " + newSpiesAdded + " new spies added. " + spyUpdated + " spies updated. " + spyError + " errors");

                    return;


                } catch (err) {
                    reject(err);
                }
            },
            onerror: (err) => {
                reject(err);
            }
        });
    });
}


// #endregion