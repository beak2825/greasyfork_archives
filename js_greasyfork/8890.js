// ==UserScript==
// @name          CS:GO Lounge Live
// @namespace     CSGOLoungeLive
// @author        soma
// @description   A csgolounge.com betting tool and enhancer.
// @include       http://csgolounge.com/
// @include       http://csgolounge.com/#
// @include       http://*.csgolounge.com/
// @include       https://csgolounge.com/
// @include       https://csgolounge.com/#
// @include       https://*.csgolounge.com/
// @require       http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @version       0.2.6.7
// @icon          http://img11.hostingpics.net/pics/365638LIVE.png
// @grant         GM_addStyle
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_xmlhttpRequest
// @grant         GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/8890/CS%3AGO%20Lounge%20Live.user.js
// @updateURL https://update.greasyfork.org/scripts/8890/CS%3AGO%20Lounge%20Live.meta.js
// ==/UserScript==

/* Note: You are ALLOWED to edit and/or modify this script if belonging credits are given and you have informed the author BEFORE publishing the modified version.
 *       You are NOT ALLOWED to sell whole or any parts of this script.
 *       (cl) 2015 - soma.
 *       For further information contact soma @steam id: "somq" or on reddit.
 * */
var defaultTheme = ' \
main {margin:0 auto; text-align:center;}\
.box {display: inline-block;float: none;}\
.standard{display: inline-block;float: none;}\
#feedsbox {display: inline-block;float: none;vertical-align: top;position:relative;}\
body {background-image: none;}\
.shownotav-btn:active { text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3); text-decoration: none; background-color: #eeeeee; border-color: #cfcfcf; color: #d4d4d4; } \
.shownotav-btn:hover, .button:focus, #switchmainviewa:hover, #switchmainviewa:hover { background-color: #f6f6f6; color:#999;} \
.shownotav-btn { letter-spacing: 5px; font-size: 16px; height: 50px; line-height: 40px; border-radius: 4px; background-color: #eeeeee; border: medium none; box-sizing: border-box; color: #666666; cursor: pointer; transition-duration: 0.3s; transition-property: all;; float: left; height: 40px; text-align: center; } \
.shownotav { width: 100%; padding: 0 50px; } \
main section.box {width: 68%;};\
.smallfont {font-size: 12px;} a.smallfont:hover {color:#666;}.teamadetails {width: 45%; float: left; text-align: center} .teambdetails{width: 45%; float: left; text-align: center} \
.vsdetails{width: 10%; float: left; text-align: center;font-size: 16px;} \
.detailsbox {border-radius: 8px; box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.5) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.5); float: left; font-size: 14px; margin: 16px 2%; padding: 2px 2%; width: 59%; display:none;}\
.teamtext {font-size:16px} \
.detailsbox>div { background: none repeat scroll 0 0 #c5c5c5; float: left; margin: 5px 5px 0 0; padding: 5px; }\
.details-betplaced .winsorloses { width:98%; }\
.details-betplaced { min-width: 300px; } \
.details-raw { text-align:left;line-height:16px }\
.c-loading {background-image: url("http://img4.hostingpics.net/pics/5276773011.gif"); height: 100px; position: absolute; width: 100px;}\
.matchleft {min-height: 70px;box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.5) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.5); border-radius: 8px; padding: 5px 0;max-width:1555px; width:63%;} section.box {width:98%; max-width:1430px;} .matchctn{float:left;width: 98%;} \
#c-overlay { background-color: rgba(0, 0, 0, 0.5); height: 100%; left: 0; position: absolute; top: 0; width: 100%; z-index: 10; }\
#switchmainview {float: right; display:none;}\
#mainloadingbar li {margin-left: auto; margin-right: auto; width: 260px;}\
.progress { box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.5) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.5); margin: 0 auto; width:200px; background: none repeat scroll 0 0 #ebebeb; border-left: 1px solid transparent; border-radius: 10px; border-right: 1px solid transparent; height: 20px;}\
.progress > span {background: linear-gradient(to bottom, #f0f0f0, #dbdbdb 70%, #cccccc) repeat scroll 0 0 #cccccc; border-color: #bfbfbf #b3b3b3 #9e9e9e; border-image: none; border-radius: 10px; border-style: solid; border-width: 1px; box-shadow: 0 1px rgba(255, 255, 255, 0.3) inset, 0 1px 2px rgba(0, 0, 0, 0.2); float: left; height: 18px;line-height: 4px; margin: 0 -1px; min-width: 30px; position: relative;text-align: right;} \
.progress > span > span { line-height: 17px; color: rgba(0, 0, 0, 0.7); font-size: 11px; font-weight: bold; padding: 0 8px; text-shadow: 0 1px rgba(255, 255, 255, 0.4);} \
.mb-loading { height: 25px;text-align: center; background: url("http://img11.hostingpics.net/pics/279433ajaxloader3.gif") no-repeat scroll center center rgba(0, 0, 0, 0);} \
.rounded-btn1{ display: block;width:40px; height:40px; border-top:2px solid #fff; border-radius:50%; background-color:#EEEEEE; background: linear-gradient(#EDEAE1,#CDC8B5); text-align:center; box-shadow: 0 5px 2px 3px rgba(158, 158, 158, 0.4), 0 3px 5px #B7B6B6, 0 0 0 2px #BBB7AE, inset 0 -3px 1px 2px rgba(186, 178, 165, 0.5), inset 0 3px 1px 2px rgba(246, 245, 241, 0.3); cursor:pointer; } .rounded-btn1:active{border-radius:50%; border-top:none; border:1px solid #BAB7AE; background-color:#EEEEEE; text-align:center; color:#BAB7AE; text-shadow: 0 1px 1px white, 0 1px 1px #BAB7AE; box-shadow: 0 0 0 0 #BBB7AE; } .rounded-btn1 span { font-size:30px; color:#666; text-shadow:2px 2px 0 rgba(255, 255, 255, 0.9);}\
.feeds {text-shadow: 1px 1px 0 #e5e5e5;margin: 16px 1%; font-size:14px;}\
#feedsbox {width:29%; margin: 10px 0.5%; overflow-y:auto;}\
.feeds-header {background: url("http://img11.hostingpics.net/pics/396420iconrssgrey.png") no-repeat scroll 0 0 / 33px auto rgba(0, 0, 0, 0)}\
.feedbox-title-inner { float:left; padding: 0 40px;}\
.feedstitle { height: 46px; opacity: 0.7; padding: 1%; text-align: center; text-align:left;}\
.feedstitle a { display: block; height: 100%; width: 100%; } \
#hltvfeed .feedstitle {background: url("http://img15.hostingpics.net/pics/49901496Zhddu.jpg") no-repeat scroll 50% center rgba(0, 0, 0, 0);}\
#redditfeed .feedstitle {background: url("http://img15.hostingpics.net/pics/464286reddit.png") no-repeat scroll 50% center rgba(0, 0, 0, 0);}\
#gosugamersfeed .feedstitle {background: url("http://img15.hostingpics.net/pics/241137gglogo.png") no-repeat scroll 50% center rgba(0, 0, 0, 0);}\
.feeds li { box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.5) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.5); padding: 1%; } \
.feedslinks-box {margin: 0 2% 16px;padding-top: 5px; text-align:left;}\
.feedslinks-box table { border: 1px solid #bbbbbb; width: 100%; }\
.feedslinks-box tr:nth-child(odd) { background-color: #bbbbbb; }\
.feedslinks-box tr:nth-child(even) { background-color: #cccccc; }\
.feedslinks-box td { border-bottom: 1px solid #dddddd; padding: 4px; }\
#feedsbox .feedslinks-box tr:hover {  background:#aaa; }\
.feedslinks-box a {display: block;}\
.feedslinks-box a:hover {opacity: 0.8; transition: 0.5s;}\
.main-feedbox2 {  background-color: #d0d0d0; border-radius: 5px;float: left;box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.5) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.5);width: 100%;}\
.main-feedbox {  background-color: #d0d0d0; border-radius: 5px;float: left;box-shadow: 1px 1px 1px 1px #bbb; width: 100%; border: 1px solid #bbb;}\
.line2a { padding-left: 10px; text-align: center;font-size: 14px;}\
.line2b { padding-right: 10px; text-align: center;font-size: 14px;}\
.matchbox-summary { float: left; font-size: 12px; margin: 16px 0; width: 15%;}\
.expandmatch-btn { color: #ddd; position:absolute; height: 20px; padding-left: 7px; font-size:20px;}\
.expmatchbtn-ctn { float: right; margin-right: 9px; height: 25px; width: 25px;}\
.infosbelow-lr {width: 35%; float: left;}\
.infosbelow-center { float: left; font-size: 14px; text-align: center; width: 30%; } \
.sumbox {text-align: center; background: #bababa; border-radius: 4px; float: left; margin: 2px 0; opacity: 0.9; padding: 4px 4px 4px 20px; border: 1px solid #9b9b9b;clear:both;}\
.suminfo {}\
.suminfo-info{background: url("http://img11.hostingpics.net/pics/344354iconinfov3.png") no-repeat scroll 2px center / 14px auto #ababab}\
.suminfo-bet{background: url("http://img15.hostingpics.net/pics/666500Dice.png") no-repeat scroll 2px center / 16px auto #ababab}\
.matchbox-summary .betplaced { background: url("http://img11.hostingpics.net/pics/788665dicegreen.png") no-repeat scroll 2px center / 16px auto #ababab; } \
.suminfo-warning{background: url("http://img15.hostingpics.net/pics/701001warning16x16.png") no-repeat scroll 2px center / 14px auto #ababab}\
.suminfo-error{background: url("http://img15.hostingpics.net/pics/477689error16x16.png") no-repeat scroll 2px center / 14px auto #ababab}\
.suminfo-error:hover{background: url("http://img15.hostingpics.net/pics/477689error16x16.png") no-repeat scroll 2px center / 14px auto #D7D7D7; transition: 0.5s; opacity: 0.9;}\
a .suminfo-info:hover { background: url("http://img11.hostingpics.net/pics/344354iconinfov3.png") no-repeat scroll 2px center / 14px auto #D7D7D7; transition: 0.5s; opacity: 0.9;}\
a .suminfo-bet:hover { background: url("http://img15.hostingpics.net/pics/666500Dice.png") no-repeat scroll 2px center / 16px auto #D7D7D7; transition: 0.5s; opacity: 0.9;}\
.feedloading {background: url("http://img4.hostingpics.net/pics/356667712.gif") no-repeat scroll 3px center transparent; height: 30px; width: 30px; display: block; position: absolute; margin: 13px 75%;}\
#feedstitle-loading {float: right; margin: 5px 15px 0 0; position:relative; width: 50px; background:url("http://img11.hostingpics.net/pics/460422feedstitleloading.gif") no-repeat scroll 3px center transparent;} \
aside#submenu {float:left;opacity: 0.9;border-radius: 0 0 10px;}\
main {padding-right:0;}\
#submenutoggle { background: none repeat scroll 0 0 #252525; float: right; font-size: 30px; height: 40px; opacity: 1; text-align: center; width: 200px; }\
aside#submenu > nav {margin:0}\
#shortsmb {  background: none repeat scroll 0 0 #252525; border-radius: 0 0 6px; float: left; font-size: 20px; opacity: 0.7; padding: 5px 10px 10px 5px; text-align: center;}\
#shortsmblink { color: #ff8a00;}\
.matchloading { background: url("http://img4.hostingpics.net/pics/5276773011.gif") no-repeat scroll 0 0 / 40px auto #cbcbcb; border-radius: 20px; height: 40px; left: 2%; margin: 5px; opacity: 0.6; width: 40px; }\
.matchloading-ctn { float: left; height: 50px; margin: 5px; position: absolute; width: 50px; }\
#infobox-wrapper {  background: none repeat scroll 0 0 #eee; border-radius: 5px 5px 0 0; bottom: 0; opacity: 0.9; padding: 15px 15px 10px; position: fixed; right: 50px; width: 430px; }\
.infobox-ctn {  background: none repeat scroll 0 0 #fff; border: 1px solid #ccc; border-radius: 3px; padding: 10px; text-align: center; }\
#settings-aliases {padding:5px 0;}\
 label { margin-left: 5px; float:right; font-size: 8px;background: none repeat scroll 0 0 rgb(138, 138, 138); border-radius: 14px; box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1) inset, 0 -1px 0 0 rgba(0, 0, 0, 0.1) inset; color: #fff; cursor: pointer; display: inline-block; font-style: normal; font-weight: bold; height: 20px; line-height: 20px; position: relative; text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1); transition: all 1s ease-in 0s; width: 50px; } \
 label i { background: none repeat scroll 0 0 rgb(255, 255, 255); border-radius: 20px; box-shadow: 0 -3px 3px 0 rgba(0, 0, 0, 0.1) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.4) inset, 0 2px 0 0 rgba(0, 0, 0, 0.2); display: block; height: 20px; position: absolute; right: 30px; top: 0px; transition: all 100ms ease 0s; width: 20px;} \
 label i:before {  background: none repeat scroll 0 0 rgb(239, 239, 239); border-radius: 12px; box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1) inset; content: ""; display: block; height: 8px; left: 50%; margin: -4px 0 0 -4px; position: absolute; top: 50%; width: 8px;} \
 label:active i:before { box-shadow: inset 0 1px 0 0 rgba(0, 0, 0, 0.3); } \
 label:before { content: "off"; margin-left: 20px; text-transform: uppercase; transition: all 200ms ease; } \
 input[type=checkbox]:checked ~ label:before { content: "on"; text-transform: uppercase; margin-right: 30px; margin-left: 5px; } \
 input[type=checkbox]:checked ~ label{ background: rgb(141,173,51); background: radial-gradient(center, ellipse cover, rgba(141,173,51,1) 0%, rgba(146,178,55,1) 24%, rgba(157,187,64,1) 55%, rgba(166,194,78,1) 100%); } \
 input[type=checkbox]:checked ~ label i { right: 0px; } \
 input[type=checkbox] { display:none; }\
 .matchmain { text-shadow: 0 1px 1px #ffffff; }\
.match {box-shadow:1px 2px 2px 2px #888;}\
.title { color: #999; float: left; position: relative; width: 98%;padding: 1% 1% 0;margin-left:0;text-transform: none;} \
.title:hover a {color: #999; text-shadow: none;}\
.title a{ color: #999; text-shadow: none;} \
#mainheader a:hover{ color: #777; text-shadow: none;} \
#mainheader { font-weight: 300; line-height: 16px;min-height: 40px;float:left; color: #777;font-size: 12px;width: 100%;border: 1px solid #ccc;}\
#mainheader .nomatchesfound {text-align:center;}\
#mainheader li { margin: 3px; padding: 2px;}\
.mainheader-c {}\
 .bets-header {background:url("http://cdn.csgolounge.com/img/bets.png") no-repeat;}\
 .mh-boxes {}\
 .mh-left {width:20%;float:left;padding:2px;}\
 .mh-center {width:50%;padding: 0 2px; margin:0 auto; text-align:center;max-height: 90px;}\
 .mh-right {width:175px;float:right;padding: 0 2px;}\
 #matchescount li {margin: 3px 0 0;}\
 #current-matchescount {font-weight:bold;}\
li.sticker { background: none repeat scroll 0 0 #e0e0e0; border-radius: 3px; box-shadow: 1px 1px 1px 1px #ccc; text-shadow: 0 1px 0px #fff;border-top: 1px solid #eee;} \
.austatus { font-weight: bold; text-align: center;}\
.austatus-inner { font-weight: normal; text-align:left; margin-top: 5px;}\
.numofm, .numofb  {font-weight:bold;}\
.au-lasttime { float:right; font-weight:bold;color: #8a8a8a;}\
.au-timeleft { float:right; font-weight:bold;color: #8a8a8a;}\
.scriptinfo-header {}\
#scriptinfo-box {font-size:12px;opacity:0.9;overflow-y:auto; max-height:80px; border: 1px solid #ccc;}\
#scriptinfo-box .linfo {background: url("http://img15.hostingpics.net/pics/169315info16x16.png") no-repeat 2px center scroll rgba(0, 0, 0, 0);}\
#scriptinfo-box .lwarning {background: url("http://img15.hostingpics.net/pics/701001warning16x16.png") no-repeat 2px center scroll rgba(0, 0, 0, 0);}\
#scriptinfo-box .lerror {background: url("http://img15.hostingpics.net/pics/477689error16x16.png") no-repeat scroll 2px center rgba(0, 0, 0, 0);}\
#mainheader #scriptinfo-box li { margin: 0;} \
.scriptinfo-hide { font-size: 20px; left: 73%; line-height: 15px;  position: absolute; }\
.timenow {float: left; margin-left: 20px;}\
.matchheader { background: #ccc; border-radius: 10px; border-top: 1px solid #ccc; float: left; font-size: 12px; line-height: 12px; margin-bottom: 4px; text-shadow: 1px 1px 0 #e5e5e5; color: #555;}\
.timeleft { color: #666; font-size: 13px; font-weight:bold}\
.timeRaw {font-size: 10px;}\
.eventm { color: #333; float: right; font-size: 12px; }\
.lspacer:after { content: "|"; }\
.matchheader span { float: left;} \
.lspacer { color: #777; font-size: 6px;}\
.lspacer-mh {  margin: 0 10px; }\
.lspacer-tc {  vertical-align: middle;}\
.matchstatus .matchislive {color: #72A326; text-shadow: 1px 1px 0px #4A7010; font-weight: bold;font-size: 12px;}\
.matchstatus .important-matchinfo {font-weight: bold; color: #D12121;font-size: 12px;}\
#force-refresh-ctn {float:right;}\
#force-refresh-ctn .fr-loading{ background-image: url("http://img15.hostingpics.net/pics/932558refreshanim.gif"); background-size: 16px auto; display: block; height: 16px; width: 16px; }\
#force-refresh-ctn .fr-notloading{ background-image: url("http://img15.hostingpics.net/pics/707861refreshfixed.png"); background-size: 16px auto; display: block; height: 16px; width: 16px;}\
.matchid { font-size:10px; }\
.detailsbox p strong {  font-weight: bold; } \
.detailsbox p { text-align:left; } \
';
GM_addStyle(defaultTheme);
// Grey scheme: Foreground color = #333333 // Background color = #bbbbbb

var scriptVersion = GM_info.script.version;
//console.log(version);
var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
console.log('@Greasemonkey/@Tampermonkey settings:', GM_info);
console.log('@JQuery: ', $.fn.jquery);
console.log('@CSGLounge Live version:', scriptVersion);

// Global settings
var settings = {
    "debug": {
        "global": false, // activates _log
        "feeds": "0",
        "autoUpdate": false // activate detailed autoupdate logging
    },
    "matchBoxStatus": "0", // Main view, boxes open, closed. feature disabled.
    "mainMenuStatus": "0", // 1 Show, 0 Hide main menu
    "updateDelay": "300000", // 5 mins = 300 seconds (*1000)
    "defaultTimeout": "10000", // 10 seconds
    "switches": {
        "completeinit": true,
        "feeds": true,
        "autoupdate": true,
        "feedsShow": true
    },
    "isNewVersion": {
        "oldVersion": "",
        "newVersion": "",
        "status": false
    },
    "isCsgo": true
};
// debug (forces settings rewrite)
//localStorage.setItem("loungeLiveSettings", JSON.stringify(settings));

var host = window.location.host;
if (host == "csgolounge.com") {
    settings.isCsgo = true;
}
;
if (host == "dota2lounge.com") {
    settings.isCsgo = false;
}
;

/* Check for a newer version not elegant at all, will do that in a proper way later*/
var scriptVersionChecker = (localStorage.getItem('loungeLive_lastversion') != scriptVersion);
if (scriptVersionChecker) {
    var currentVersion = localStorage.getItem('loungeLive_lastversion');
    localStorage.setItem("loungeLive_lastversion", scriptVersion);
    settings.isNewVersion.oldVersion = currentVersion;
    settings.isNewVersion.newVersion = scriptVersion;
    settings.isNewVersion.status = true;
    localStorage.removeItem("loungeLiveSettings");
    localStorage.setItem("loungeLiveSettings", JSON.stringify(settings));
}

var globalJobStatus = []; // global status for job to track if they are finished or not.
var globalData = {
    "count": {
        "matchesAvail": 0,
        "betsPlaced": 0
    }
};

if (localStorage.getItem("loungeLiveSettings") !== null) {
    settings = JSON.parse(localStorage.getItem("loungeLiveSettings"));
    console.log('@CSGLounge Live settings:', localStorage.getItem('loungeLiveSettings'));
}

// get base url in ff.
if (!isChrome) {
    var baseUrl = window.location.href;
    var regexp = /.*\/(.*?)$/;
    var match = regexp.exec(baseUrl);
    if (match[1] === '#') {
        var baseUrl = baseUrl.replace('#', '');
    }
} else {
    var baseUrl = "https://csgolounge.com/";
}

/*********************/
/* DEBUG AND HELPERS */
/*********************/
// debug log if activated
if (!isChrome) {
    _log = (function (undefined) { // if firefox
        var Log = Error; //  proper inheritance...?
        Log.prototype.write = function (args) {

            var lineNum = extractLineNumberFromStack(this.stack);
            var lineNumberStr = [[lineNum]];
            args = args.concat(lineNumberStr);
            args = sortArray(args);
            //                console.log(args);
            if (console && console.log) {
                if (console.log.apply) {
                    console.log.apply(console, args);
                } else {
                    console.log(args);
                } // nicer display in some browsers
            }
        };
        var extractLineNumberFromStack = function (stack) {

            var lineNum = stack.split('\n')[1];
            var lineNum = lineNum.split(' (')[0].substring(0, lineNum.length - 1);
            var lineNum = lineNum.split(':')[3].substring(0, lineNum.length - 1);
            return lineNum;
        };
        var sortArray = function (arrayTosort) { // swap 1st and last value.
            argsNew = [];
            for (var i = 0; i < arrayTosort.length; i++) {
                var j = i + 1;
                argsNew[j] = arrayTosort[i];
            }

            var lastItem = argsNew.pop();
            argsNew[0] = lastItem;
            return argsNew;
        };
        return function (params) {

            if (typeof settings.debug.global !== undefined || settings.debug.global)
                return;
            Log().write(Array.prototype.slice.call(arguments, 0));
        };
    })();
} else {
    _log = function (args) {
        if (settings.debug.global) {
            console.log(args);
        }
    };
}
pLog = _log;
auLog = function (args) {
//        console.log(['AU:'],' ', args);
    console.log(['AU:'], ' ', Array.prototype.slice.call(arguments, 0));
};
/* log tool */
window.log = function () {
    log.history = log.history || []; // store logs to an array for reference
    log.history.push(arguments);
    if (this.console && settings.debug.global) {
        console.log(Array.prototype.slice.call(arguments));
    }
};
l = function (args) {
    console.log(args);
};
_l = function (args) {
    console.log(args);
};

/****************/
/* SCRIPT START */
/****************/
/* Global Class - wrap basically every workers jobs - process detailled below... */
function globalClass(worker) {
    var self = this;
    this.worker = worker;
    this.job = {};
    this.job.init = true;
    this.job.done = false;
    this.job.update = false;
    this.job.retrieveMissing = false;
    this[this.worker] = {"data": []};
    console.log("Initializing INSTANCE for worker", this.worker, '', this[this.worker]);
    // matches ajax req errors & loading
    this.loading = {};
    this.loading.matchdiv = '<div class="matchloading-ctn"><div class="matchloading"></div></div>';
    // If error on retrieve is returned by matches ajax request: // errors.JOB.STRING
    this.errors = {};
    this.errors.match = {};
    this.errors.feeds = {};
    this.errors.match.aborted = 'Aborted';
    this.errors.match.timedOut = 'Timed out';
    this.errors.match.error = 'Error';
    this.errors.match.RetrieveFailedMatches = " item(s) failed to load."; // <a href='#' class='retrieve-failedmatches'>Retrieve missing item(s)</a>
    this.errors.feeds.timeout = "Feeds api didn't respond in time, please try again in one minute...";
    this.errors.feeds.abort = "Abort error, please try again later...";
    this.errors.feeds.errors = "There was an error, feeds api might be empty at the moment, please try again later...";
    this.liveNow = '<span class="matchislive">&nbsp; Live !</span>';

    this.lbtnSw = '<img src="http://img11.hostingpics.net/pics/677948livelogo.png" alt="Back to lounge Live">Lounge Live';
    this.showTradesbtnSw = '<img alt="Show trades" src="//cdn.csgolounge.com/img/my_trades.png">show trades';

    this.feedbox = '<section id="feedsbox"><div class="title"><div id="secondheader" class="feeds-header mainheader-c">&nbsp;<div class="feedbox-title-inner"><strong>Feeds</strong> </div><span id="feedstitle-loading" class="feedloading"></span></div></div></section>';

    this.feeds = {
        "data": [
            "reddit", "hltv"
        ],
        "feedsDatas": {
            "reddit": {
                "url": "https://vast-harbor-8484.herokuapp.com/api?feed=reddit",
                "datas": ""
            },
            "hltv": {
                "url": "https://vast-harbor-8484.herokuapp.com/api?feed=hltv",
                "datas": ""
            }
        }
    };

    this.propsContainers = {
        "bestOf": ".infosbelow-center",
        "dateRaw": ".dateRaw",
        "matchStatus": ".matchstatus",
        "hasItemsPlaced": "",
        "itemsPlaced": "",
        "mainstream": "",
        "matchNameA": ".teamtext:eq(0) b",
        "matchNameB": ".teamtext:eq(1) b",
        "msstatus": "",
        "peopleItemsNum": ".peopleItemsNum",
        "teamAReward": ".infosbelow-lr span:eq(0)",
        "teamAperc": ".teamtext:eq(0) i",
        "teamBReward": ".infosbelow-lr span:eq(1)",
        "teamBet": "",
        "teamBperc": ".teamtext:eq(1) i",
        "timeLeft": ".timeleft",
        "timeRaw": ".timeRaw",
        "valueBetA": "",
        "valueBetB": ""
    };
    // build an array containing all properties.
    var buildPropList = function (propsContainers) {
        var propsList = [];
        for (var properties in propsContainers) {
            propsList.push(properties);
        }
        return propsList;
    };
    this.propList = buildPropList(this.propsContainers);
    this.arrow = {};
    this.arrow.up = '<span style="color: green;">&#8593;</span>';
    this.arrow.down = '<span style="color: red;">&#8595;</span>';
    this.arrow.equal = '&nbsp;';
    this.arrow.err = '&nbsp;';
} /* ! globalClass(worker)*/


globalClass.prototype.initGlobalProcess = function () {
    _log('*** Global INIT for worker ' + this.worker + ' ***');
    var dfd = new jQuery.Deferred();
    return dfd.resolve(this);
}; // !initGlobalProcess

/*
 * monitorWorker method
 * @param {type} jobStatus = error || success
 * @param {type} container
 * @param {type} jobType = view || request
 * @param {type} id
 * @param {type} errorType = error details - eq. timeout, abort etc...
 * @feedsObj :
 loadingStatus.
 "index": 0,
 "totalItemsToLoad": dataLength,
 "globalMonitor": {
 "error": {"view" : 0, "request" : 0, "IDs" : [], "ctn" : []},
 "success": {"view" : 0, "request" : 0, "IDs" : [], "ctn" : []},
 "mustRetry": []
 }
 */
globalClass.prototype.monitorWorker = function (jobStatus, jobType, container, id, errorType) { // jobStatus = error || success, jobType = view || request, errorType = error details - eq. timeout, abort etc...
    _log('... currently monitoring "' + this.worker + '" worker ...');
    // monitor global responses status to count how many succeed and failed.
    var globalMonitor = this[this.worker].loadingStatus.globalMonitor; // example. this.initialization.loadingStatus.globalMonitor
//    console.log('MONITOR', globalMonitor[jobStatus][jobType], jobType)

    globalMonitor[jobStatus].IDs.push(id);
    globalMonitor[jobStatus].ctn.push(container);
    globalMonitor[jobStatus][jobType]++; // example. currentObj.success.view = 6.

    if (jobType === "view") { // update loading status when append are done.
        this[this.worker].loadingStatus.index = (++this[this.worker].loadingStatus.index);
    }
//    if(jobStatus === "error") { // send error to errorHandling method
//        this.errorHandling(jobStatus, jobType, container, id, "global");
//    }

};
globalClass.prototype.errorHandling = function (jobStatus, jobType, container, id, errorType) {
    var globalMonitor = this[this.worker].loadingStatus.globalMonitor; // example. this.initialization.loadingStatus.globalMonitor

    if (this.worker === "initialization" && jobType === "request") { // error
        $('#scriptinfo-box').prepend('<li class="lerror sticker"><span class="timenow">' + this.tools() + '</span>An error occured (' + errorType + ') while requesting match #' + id + '.</li>');
        container.find('.matchloading-ctn').remove();
        container.append(this.errors.match[errorType]);

        var summDest = container.find('.matchleft');
        var hasMBSumm = container.find('.matchbox-summary').length > 0 ? true : false;
        if (!hasMBSumm) {
            summDest.after('<div class="matchbox-summary"></div>');
        }
        var matchboxSummary = container.find('.matchbox-summary');
        var infoSticker = '<span class="sumbox suminfo-error firstretrieveerr"><a class="maindata-retrieve" href="#" title="Retrieve infos for this match manually"> Not up-to-date! (' + this.errors.match[errorType] + ') <br /> Click here to retrieve infos manually.</a></span>';
        matchboxSummary.html(infoSticker).delay(50).fadeOut().fadeIn('slow');

        setTimeout(function () {
            $('#mainloadingbar').fadeOut('slow');
            $('#matchescount').fadeOut('slow');
        }, 5000);
    }

    if (errorType === "done") {
        $('#scriptinfo-box').prepend('<li class="lerror sticker"><span class="timenow">' + this.tools() + '</span>' + globalMonitor.error.request + this.errors.match.RetrieveFailedMatches);
    }

};
globalClass.prototype.done = function () {
    console.log('ALLDONE: worker ', this.worker, ' has finished his jobs. obj:', this);

    // init is done
    if (this.worker === "initialization" && this.job.init && !this.job.retrieveMissing) {
        var globalMonitor = this[this.worker].loadingStatus.globalMonitor; // example. this.initialization.loadingStatus.globalMonitor

        // store data in globalData obj
        globalData.currentData = {};
        globalData.currentData = this[this.worker].data;
        // check for errors
        if (globalMonitor.error.request > 0) {
            this.errorHandling("error", "", "", "", "done");
        }
        if (globalMonitor.error.request === 0) {
            $('#scriptinfo-box').prepend('<li class="linfo sticker"><span class="timenow">' + this.tools() + '</span> ' + this.worker + ' done successfully.');
        }
        if (settings.isNewVersion.status) {
            if (currentVersion === null) {
                $('#scriptinfo-box').prepend('<li class="linfo sticker"><span class="timenow">' + this.tools() + '</span> Welcome to Lounge Live version ' + scriptVersion + ', everything loaded successfully. Enjoy !</li>');
            } else if (typeof currentVersion !== "undefined") {
                $('#scriptinfo-box').prepend('<li class="linfo sticker"><span class="timenow">' + this.tools() + '</span> Read more info about this update on <a href="https://www.reddit.com/r/LoungeLive/" target="_blank">Lounge Live subreddit</a>.</li>');
                $('#scriptinfo-box').prepend('<li class="linfo sticker"><span class="timenow">' + this.tools() + '</span> Lounge Live has updated from version ' + currentVersion + ' to ' + scriptVersion + ' successfully.</li>');
                settings.isNewVersion.status = false;
                localStorage.setItem("loungeLiveSettings", JSON.stringify(settings));
//    if (this.worker === "initialization" || this.worker === "basicInit") {
                if (isChrome) {
                    if ($('body').css('background').indexOf('imgur') > -1) {
                        var msgs = 'You probably have CleanLounge theme enabled';
                        var msge = ' Unfortunately, this script is currently not compatible with this theme. Even though it\'s compatible with Lounge Destroyer add-on. Please disable CleanLounge Theme for a proper layout.';
                        $('#scriptinfo-box').prepend('<li class="lerror sticker"><span class="timenow">' + this.tools() + '</span>' + msgs + msge);
                        alert(msgs + '\n Please disable CleanLounge Theme for a proper layout.');
                    }
                }
//    }
            }
            var self = this;
            /* MAIN STYLE*/
			if (!isChrome) {
				var mainStyle = $('head link[type="text/css"]').attr('href');
				if (typeof mainStyle != "undefined") {
					var mainStyle = mainStyle.replace(/\d+$/, '');
					if (mainStyle != '//cdn.csgolounge.com/css/gray.min.css?') {
						$.ajax({
							method: 'GET',
							url: 'ajax/setSkin?skin=1',
							success: function (response) {
								console.log(response);
							}
						});
						$('head link[type="text/css"]').attr('href', "//cdn.csgolounge.com/css/gray.min.css?");
					}
				}
			}
        }
    }
    if (this.job.retrieveMissing) {
        var globalMonitor = this[this.worker].loadingStatus.globalMonitor; // example. this.initialization.loadingStatus.globalMonitor
        if (globalMonitor.error.request === 0) {
            $('#scriptinfo-box').prepend('<li class="linfo sticker"><span class="timenow">' + this.tools() + '</span> Missing match(es) was/were retrieved successfully');
        }
        console.log('RETRIEVEMISSING', globalMonitor, globalMonitor.error.request, globalMonitor.success.IDs);
    }
    var dfd = new jQuery.Deferred();
    return dfd.resolve(this);
};
globalClass.prototype.initPageView = function () {
    _log('*** init Page View ***');

    var self = this;
    // logo
    if (settings.isCsgo) {
        $('body').find('header a:eq(0)').html('<img id="logo" alt="CS:GO Marketplace" src="http://img11.hostingpics.net/pics/797445csgllivelogo4.png">');
    }
    /*
     * http://img11.hostingpics.net/pics/797445csgllivelogo4.png
     * http://img11.hostingpics.net/pics/501830csgllivelogo.png
     * http://img11.hostingpics.net/pics/926464csgllivelogo2.png
     * http://img11.hostingpics.net/pics/357697csgllivelogo3.png
     */

    // Main view, boxes open, closed.
    initialization.matchBoxStatus = ' style="display:none;"';
    // hide main trade box
    $('#tradelist').parent().hide();
    $('#tradelist').hide();
    // Hide not available, add button
    var firstna = $('.matchmain .notavailable:first').parent();
    firstna.nextAll().andSelf().wrapAll("<div id='sh-na' style='display:none;'></div>")
            .parent().before('<a href="#" class ="shownotav-btn shownotav"><span>Show closed matches</span></a>');
    $("body").on("click", "a.shownotav-btn", function (e) {
        $('a.shownotav-btn').remove();
        $('#sh-na').slideDown('slow');
        e.preventDefault();
    });
    // Page Header
    $('.title, #bets').removeAttr('style');
    //matchheader
    $('.title:eq(1)').html('<div id="mainheader" class="bets-header mainheader-c"></div>');
    $('#mainheader').append('<div class="mh-boxes mh-left"><ul></ul> </div>');
    $('#mainheader').append('<div class="mh-boxes mh-right"><ul></ul></div></div>');
    $('#mainheader').append('<div class="mh-boxes mh-center"><ul id="scriptinfo-box"></ul></div>');
    $('.mh-left ul').append('<li class="sticker topcounts"></li>');
    if (settings.switches.autoupdate) {
        $('.mh-left ul').append('<li class="sticker austatus"><ul class="austatus-title"><li>Auto-Update Status<span id="force-refresh-ctn"><a id="force-refresh" class="fr-notloading" title="Force a page refresh"href="#"></a></span></li></ul><span class="austatus-inner"><ul><li>Last update: <span class="au-lasttime">-</span></li><li>Next update in: <span class="au-timeleft">-</span></li></ul></span>');
    }
    $('.mh-center').prepend('<span class="scriptinfo-header">Lounge Live version: ' + scriptVersion + ' - <a href="https://www.reddit.com/r/LoungeLive/" target="_blank" title="Report a bug, suggest a feature, read change logs.">reddit</a> - <a target="_blank" href="https://steamcommunity.com/tradeoffer/new/?partner=81839980&token=VqSHKQT0" title="support the cause !">steam donation</a></span>');
    $('.mh-center').prepend('<span class="scriptinfo-hide"><a href="#" title="Hide errors and warnings">-</a></span>');

    //matchheader
    $('.mh-right ul').append('<li>Matches Infos: <input type="checkbox" id="completeinit-switch" /> <label for="completeinit-switch" > <i></i> </label></li>');
    $('.mh-right ul').append('<li>Feeds: <input type="checkbox" id="feeds-switch" /> <label for="feeds-switch" > <i></i> </label></li>');
    $('.mh-right ul').append('<li>Auto Update: <input type="checkbox" id="autoupdate-switch" /> <label for="autoupdate-switch"> <i></i> </label></li>');
    $('.mh-right ul').append('<li>Feeds box: <input type="checkbox" id="feedsShow-switch" /> <label for="feedsShow-switch"> <i></i> </label></li>');

    // Switches status
    $('#completeinit-switch').attr('checked', settings.switches.completeinit);
    $('#feeds-switch').attr('checked', settings.switches.feeds);
    $('#feedsShow-switch').attr('checked', settings.switches.feedsShow);
    $('#autoupdate-switch').attr('checked', settings.switches.autoupdate);
    $("#mainheader").on("click", "input#completeinit-switch", function (e) {
        if ($('input#completeinit-switch').is(":checked")) {
            settings.switches.completeinit = true;
            $('#scriptinfo-box').prepend('<li class="linfo sticker"><span class="timenow">' + self.tools() + '</span>Matches infos have been activated.</li>');
        } else {
            if (settings.switches.autoupdate) {
                $('#scriptinfo-box').prepend('<li class="linfo sticker"><span class="timenow">' + self.tools() + '</span>Auto update disable have been forced.</li>');
            }
            settings.switches.completeinit = false;
            settings.switches.autoupdate = false;
            $('#autoupdate-switch').attr('checked', settings.switches.autoupdate);
            $('#scriptinfo-box').prepend('<li class="linfo sticker"><span class="timenow">' + self.tools() + '</span>Matches infos have been disabled.</li>');
        }
        localStorage.setItem("loungeLiveSettings", JSON.stringify(settings));
    });
    $("#mainheader").on("click", "input#feeds-switch", function (e) {
        settings.switches.feeds = $('input#feeds-switch').is(":checked") ? true : false;
        localStorage.setItem("loungeLiveSettings", JSON.stringify(settings));
        if (!settings.switches.feeds) {
            $('#scriptinfo-box').prepend('<li class="linfo sticker"><span class="timenow">' + self.tools() + '</span>Feeds have been disabled.</li>');
        }
        if (settings.switches.feeds) {
            $('#scriptinfo-box').prepend('<li class="linfo sticker"><span class="timenow">' + self.tools() + '</span>Feeds have been activated.</li>');
        }
    });
    $("#mainheader").on("click", "input#autoupdate-switch", function (e) {
        if ($('input#completeinit-switch').is(":checked") === false) {
            $('#autoupdate-switch').attr('checked', false);
            alert('Turn on "matches infos" first.');
            $('#scriptinfo-box').prepend('<li class="linfo sticker"><span class="timenow">' + self.tools() + '</span>Please turn on matches infos first if you want to enable auto-update.</li>');
        } else {
            settings.switches.autoupdate = $('input#autoupdate-switch').is(":checked") ? true : false;
            localStorage.setItem("loungeLiveSettings", JSON.stringify(settings));
            if (!settings.switches.autoupdate) {
                clearInterval(window.autoUpdate);
                clearInterval(window.autoUpdateTimer);
                $('.au-timeleft').html('-');
                $('#scriptinfo-box').prepend('<li class="linfo sticker"><span class="timenow">' + self.tools() + '</span>Auto update has just been stopped and disabled.</li>');
            }
            if (settings.switches.autoupdate) {
                $('#scriptinfo-box').prepend('<li class="linfo sticker"><span class="timenow">' + self.tools() + '</span>Auto update has been activated, please refresh the page to initialize it.</li>');
            }
        }


    });
    $("#mainheader").on("click", "input#feedsShow-switch", function (e) {
        settings.switches.feedsShow = $('input#feedsShow-switch').is(":checked") ? true : false;
        localStorage.setItem("loungeLiveSettings", JSON.stringify(settings));
        if (!settings.switches.feedsShow) {
            $('#scriptinfo-box').prepend('<li class="linfo sticker"><span class="timenow">' + self.tools() + '</span>Feeds box is now hidden.</li>');
            $('#feedsbox').hide();
        }
        if (settings.switches.feedsShow) {
            $('#scriptinfo-box').prepend('<li class="linfo sticker"><span class="timenow">' + self.tools() + '</span>Feeds box is now shown.</li>');
            $('#feedsbox').fadeIn('fast');
        }
    });
    
    // Hide lerror, lwarning in scriptinfo box
    $('#mainheader').on('click', '.scriptinfo-hide', function (e) {
        $('.lerror').slideToggle('fast');
        $('.lwarning').slideToggle('fast');
        $('.scriptinfo-hide a').text($('.lwarning').is(':visible') || $('.lerror').is(':visible') ? '+' : '-');
        e.preventDefault();
    });

    // Big Main Switch Button
    //$('#mainheader').append('<div id="switchmainview"><a href="#" id="switchmainviewa" class="rounded-btn1"><span>' + btnMatchBoxStatus + '</span></a></div>')

    $("#switchmainview").on("click", "a#switchmainviewa", function (e) {
        $(".detailsbox").slideToggle("fast", function () {
            $("#switchmainviewa span").text($('.detailsbox').is(':visible') ? "-" : "+");
        });
        e.preventDefault();
    });
    // Boxes expander
    $("#bets").on("click", "a.expandmatch-btn-a", function (e) {
        var $alinktext = $(e.target);
        var $detailsbox = $(e.target).parents().eq(2).find('.detailsbox');
        $detailsbox.slideToggle("fast", function () {
            $alinktext.text($detailsbox.is(':visible') ? "-" : "+");
        });
        e.preventDefault();
    });
    // SubMenu
    $('aside#submenu').prepend('<a id="submenutoggle"><span href="#" id="submenutogglelink">&#8592;</span></a>');
    $("#submenu").after('<a id="shortsmb" style="display:none;"><span id="shortsmblink" href="#">&#8600;</span></a>');
    if (settings.mainMenuStatus == '0') {
        $('aside#submenu').hide();
        $('#shortsmb').show();
    }

    $("body").on("click", "a#shortsmb", function (e) {
        $('#shortsmb').hide('fast');
        $("aside#submenu").show("slide");
        settings.mainMenuStatus = '1';
        localStorage.setItem("loungeLiveSettings", JSON.stringify(settings));
    });
    $("#submenu").on("click", "a#submenutoggle", function (e) {
        $("aside#submenu").hide("slide", function () {
            $('#shortsmb').show();
            settings.mainMenuStatus = '0';
            localStorage.setItem("loungeLiveSettings", JSON.stringify(settings));
        });
    });
    // Error link when a matchbox has failed to retrieve matchInfos
    // NOTE: USE initialization worker FOR THIS
    $(".match").on("click", "a.maindata-retrieve", function (e) {
        self.job.retrieveMissing = true;
        self.job.init = false;
        var selector = $(this).closest('.matchmain');
        selector.find('.error').remove();
        CompleteInitialization.call(self, self.worker, selector);
        e.preventDefault();
    });
    $("#error-matchesload").on("click", "a.retrieve-failedmatches", function (e) {
        var selector = self[self.worker].loadingStatus.globalMonitor.error.ctn;
        $('#error-matchesload').empty();
        $(selector).each(function (index, value) {
            value.find('.error').remove();
        });
        CompleteInitialization.call(self, this.worker, selector);
        e.preventDefault();
    });
    $("#force-refresh-ctn").on("click", "a#force-refresh", function (e) {
        console.log('refreshing auto update..');
        self.infobox('info', 'Forcing a page refresh...');
        $('#force-refresh').removeClass('fr-notloading').addClass('fr-loading');
//        clearInterval(window.autoUpdate);
//        clearInterval(window.autoUpdateTimer);
//        self.autoUpdateTimers();
//        UpdateInitialization();
//        window.autoUpdate = setInterval(function () {
//            self.autoUpdateTimers();
        UpdateInitialization();
//        FeedsInitialization();
//        }, settings.updateDelay);
        e.preventDefault();
    });
    // infobox
    $('main').append('<div id="infobox-wrapper" style="display: none;"><div class="infobox-ctn"></div></div>');
    // show trades
    $('#menu').append('<a href="#" class="showtrades"><img alt="Show trades" src="//cdn.csgolounge.com/img/my_trades.png">show trades</a>');

    $("#menu").on("click", "a.showtrades", function (e) {
        var ptl = [];
        ptl.push($('.box:eq(1)').fadeToggle('slow')); // matchbox
        ptl.push($('.box:eq(0)').fadeToggle('slow')); // trade box
        ptl.push($('.box:eq(0) #tradelist').fadeToggle('slow')); // tradebox inner
        $.when.apply($, ptl)
                .done(function () {
                    ($('.box:eq(1)').is(':visible') && !$('.box:eq(0)').is(':visible')) ? $('a.showtrades').hide().html(self.showTradesbtnSw).fadeIn('fast') : $('a.showtrades').hide().html(self.lbtnSw).fadeIn('fast');
                });
        e.preventDefault();
    });
    // Feedbox floating
    $(window).on("scroll", window, function (e) {
        var a = $(window).scrollTop();
        var b = $(window).height();
        if (a >= 74) {
            $('#feedsbox').css("top", a - 74);
            $('#feedsbox').css("max-height", b);
        }
        if (a <= 74) {
            $('#feedsbox').css("top", 0);
            $('#feedsbox').css("max-height", b - 74);
        }
    });
    $(window).bind("resize", function () {
        var a = $(window).scrollTop();
        var b = $(window).height();
        if (a >= 74) {
            $('#feedsbox').css("max-height", b);
        }
        if (a <= 74) {
            $('#feedsbox').css("max-height", b - 74);
        }
    });
    _log('-init page view done.');
    var dfd = new jQuery.Deferred();
    return dfd.resolve(this);
};
/* Loop through dom .matchmain and retrieve infos */
globalClass.prototype.parseMainPage = function (selector, rawData) {
    _log('*** parse Main Page ***');
    var data = (typeof rawData !== "undefined") ? rawData : 'body';
    if (typeof selector !== 'undefined' && selector !== "") {
        var matchesCtn = selector;
    } // If user has clicked to manually retrieve infos of a specific match
    else {
        var matchesCtn = $(data).find('.matchmain .match').not('.notavailable').parent();
    } //if not, selector is every match available on the page
    var csgl = {"data": []}; // global object, containing basically every data for every match.

    if (matchesCtn.length >= 1) {   // iterate through every matchmain box, find data, store it in csgl obj.
        $(matchesCtn).each(function (index, value) {

            var matchUrlDest = $(this).find('a').attr('href');
            var matchId = matchUrlDest.replace('match?m=', '').replace("predict?m=", "");
            var matchUrl = baseUrl + matchUrlDest;
            var matchCtn = $(this).find('a[href="match?m=' + matchId + '"]').closest('.match');
            var matchPercA = $(this).find('a[href="match?m=' + matchId + '"] div.teamtext:eq(0) i').text();
            var matchPercB = $(this).find('a[href="match?m=' + matchId + '"] div.teamtext:eq(1) i').text();
            var matchNameA = $(this).find('a[href="match?m=' + matchId + '"] div.teamtext:eq(0) b').text();
            var matchNameB = $(this).find('a[href="match?m=' + matchId + '"] div.teamtext:eq(1) b').text();
            matchCtn.append('<div class="matchloading-ctn"><div class="matchloading"></div></div>'); // init loading display

            var csglMatchData = {
                matchUrl: matchUrl,
                matchId: matchId,
                matchCtn: matchCtn,
                teamAperc: matchPercA,
                teamBperc: matchPercB,
                matchNameA: matchNameA,
                matchNameB: matchNameB
            };
            csgl.data.push(csglMatchData);
        }); // matches basic data retrieving has finished.

        this[this.worker].data = csgl.data; // Obj = this.worker.data[matches]

        // success
        _log('-parseMainPage success', this[this.worker].data);
        var dfd = new jQuery.Deferred();
        return dfd.resolve(this);
    } else {
        // escaped
        _log('parseMainPage escaped, no matches found'); // No matches has been found, append a message and retrieve the feed
//        updateLoading('', '1'); // Set progress bar to 100%
        $('#mainheader').append('<div class="nomatchesfound"><br />There are currently no matches to bet on ! ;( <br /> Try checking later...</div>');
    }

};
// gather and append global infos
globalClass.prototype.globalInfos = function () {
    _log('*** global infos ***');
    var numberOfMatchesS = $('body').find('.matchmain .match').not('.notavailable').parent().length; // ??!

    var dfd = new jQuery.Deferred();
    return dfd.resolve(this);
};
globalClass.prototype.initLoading = function () {    // init loading
    _log('... Init Loading ...');
    var data = this[this.worker].data;
    if (data === "undefined" || data === 0) {
        dataLength = 1;
    }

    if (typeof data === "object") {
        var dataLength = (Object.getOwnPropertyNames(data).length) - 1;
    } // USEFUL 'TILL I FIX THE WORKER OBJ FORMAT ?
    else {
        var dataLength = data.length;
    }

    this[this.worker].loadingStatus = {// loading vars
        "index": 0,
        "totalItemsToLoad": dataLength,
        "globalMonitor": {
            "error": {"view": 0, "request": 0, "IDs": [], "ctn": []},
            "success": {"view": 0, "request": 0, "IDs": [], "ctn": []},
            "mustRetry": []
        }  // index to monitor how many ajax requests succeed
    };
    // VIEW
    if (localStorage.getItem("loungeLiveSettings") !== null) {
        settings = JSON.parse(localStorage.getItem("loungeLiveSettings"));
        console.log('@CSGLounge Live settings:', localStorage.getItem('loungeLiveSettings'));
    }
    var hasFeedsbox = ($('main').find('#feedsbox')).length > 0 ? true : false;
    if (settings.switches.feeds && !hasFeedsbox) { // append feeds container and init loading gif
        $('main').append(this.feedbox);
    }
    if (!settings.switches.feedsShow) { // hide if hide is checked
        $('#feedsbox').hide();
    }
    if (this.worker === "feeds" && hasFeedsbox) { // append feeds container and init loading gif
        $.each(data, function (index, value) {
            if (($('main #feedsbox').find('#' + value + 'feed-ctn')).length == 0) {
                $('main #feedsbox').append('<article id="' + value + 'feed-ctn" class="feeds standard"> <div class="main-feedbox" id="' + value + 'feed"><span id="' + value + '-loading" class="feedloading" style="display:none;"></span><div class="feedstitle"> </div> <div class="feedslinks-box"><table><tbody></tbody></table></div> </div> </article>');
            }
        });
        $('.feedloading').fadeIn('fast');
    } else if (this.worker === "initialization" || this.worker === "basicInit") {    // matches count and loading bar
        if ($('#matchescount').length === 0) {
            $('#mainheader .mh-center ul').append('<li id="matchescount">loading: <span id="current-matchescount">0</span> / <span id="total-matchescount"></span></li>');
            $('#mainheader .mh-center ul').append('<li id="mainloadingbar"><div class="progress"><span style="width: 0%;"><span>0%</span></span></div></li>');
        }
        // matchescount
        var numberOfMatchesS = $('body').find('.matchmain .match').not('.notavailable').parent().length;
        $('.topcounts').html('<span class="numofm"> ' + numberOfMatchesS + '</span> matches available. <span class="lspacer lspacer-tc"></span> <span class="numofb">0</span> bet(s) placed.'); // dot = &#149;
        $('#mainheader #matchescount #total-matchescount').html(numberOfMatchesS);
    } else {    // any worker VIEW

    }
//    console.log("initloadingEND", this[this.worker].loadingStatus);
    var dfd = new jQuery.Deferred();
    return dfd.resolve(this);
};
// Ajax requests prototype, do the worker requests, parse the data, return whatever needed
globalClass.prototype.ajaxCalls = function (worker, job, url, id, container, timeout) {
    _log('... ajaxCalls ...');
    _log("Request sent for worker:", worker, " url: ", url, " id: ", id, " container: ", container);
    if (typeof timeout === "undefined") {
        timeout = settings.defaultTimeout;
    }

    this.genericCall = function () {
        var self = this;
        _log('ajax req for: ', worker, ' @: ', url, container);
        return $.ajax({
            method: 'GET',
            url: url,
            timeout: timeout,
            success: function (data) {   // Request complete, parse data
//                _log('request complete for: url:', url, ' id: ', id,' container:', container, 'RESULT=', data);
                _log("response received for worker:", worker, "url;", url);
            },
            onabort: function (data) {
                _log('onabort error throwed for request=> url:', url, ' id: ', id, ' container:', container, 'RESULT=', data);
            },
            ontimeout: function (data) {
                _log('ontimeout error throwed for request=> url:', url, ' id: ', id, ' container:', container, 'RESULT=', data);
            },
            onerror: function (data) {
                _log('onerror error throwed for request=> url:', url, ' id: ', id, ' container:', container, 'RESULT=', data);
            }
        });
    };
    return this.genericCall();
};

// Global INIT Parse each match page request
globalClass.prototype.parseMatchPageData = function (worker, job, url, id, container, data) {
    console.log('*!* parsing... ', id);
    _log('... parseMatchPageData ...');
    _log('parsing data for url:', url, ' id: ', id, ' container:', container);
    var self = this;
    var $d = $(data);
    var tar = '.box-shiny-alt:eq(0) .full .half:eq(0)';
    var tar = $d.find(tar);
    var teamAReward = tar.length > 0 ? tar.html().split("<br>")[1] : '';
    var tbr = '.box-shiny-alt:eq(0) .full .half:eq(1)';
    var tbr = $d.find(tbr);
    var teamBReward = tbr.length > 0 ? tbr.html().split("<br>")[1] : '';
    var vba = '.box-shiny-alt:eq(0) .full .half:eq(0)';
    var vba = $d.find(vba);
    var valueBetA = vba.length > 0 ? vba.html().split("<br>")[2] : '';
    var vbb = '.box-shiny-alt:eq(0) .full .half:eq(1)';
    var vbb = $d.find(vbb);
    var valueBetB = vbb.length > 0 ? vbb.html().split("<br>")[2] : '';
    var tl = '.box-shiny-alt:eq(0) .half:eq(0)';
    var tl = $d.find(tl);
    var timeLeft = tl.length > 0 ? tl.text() : '';
    var bo = '.box-shiny-alt:eq(0) .half:eq(1)';
    var bo = $d.find(bo);
    var bestOf = bo.length > 0 ? bo.text() : '';
    var t = '.box-shiny-alt:eq(0) .half:eq(2)';
    var t = $d.find(t);
    var time = t.length > 0 ? t.text() : '';
    var d = 'section.box:eq(0) .box-shiny-alt .half:eq(2)';
    var d = $d.find(d);
    var date = d.length > 0 ? d.attr("title") : '';
    var pin = 'section.box:eq(1) div.box-shiny-alt .full:eq(0)';
    var pin = $d.find(pin);
    var peopleItemsNum = pin.length > 0 ? pin.text() : '';
//            var matchDateFull = convertCsglDate(date, time);
//            var matchDateHuman = matchDateFull[1];
//            var matchDateRobot = matchDateFull[0];

    // Optional (itemsPlaced, mainstream)  // TODO: (I know it's ugly, just leaving it like this for readability until all these features are implemented)
    var mst = '.box-shiny-alt div:eq(4)'; // postponed, rules #x etc...
    if ($d.find(mst).length) {
        var matchStatus = $d.find(mst).text().trim();
    } else {
        var matchStatus = "";
    }

    var ip = '.box-shiny-alt .full:eq(2)';
    var tb = '.box-shiny-alt a.active';
    if ($d.find(ip).length) {
        var itemsPlaced = $d.find(ip).html();
        var teamBet = $d.find(tb).index();
        if (teamBet == '1') {
            var teamBet = 'a';
        }
        if (teamBet == '3') {
            var teamBet = 'b';
        }
        var hasItemsPlaced = true;
    } else {
        var itemsPlaced = 'No bet placed.';
        var hasItemsPlaced = false;
        var teamBet = false;
    }
    var ms = '#stream #mainstream';
    if ($d.find(ms).length) {
        var mainstream = $d.find(ms).html();
        var msstatus = '1';
    } else {
        var mainstream = 'No stream available';
        var msstatus = '0';
    }
//var streamlink = $('#chat_embed').attr("src");
//console.log(streamlink)
    $(self[self.worker].data).each(function (index, value) {
        if (value.matchId === id) {
            value.teamAReward = teamAReward;
            value.teamBReward = teamBReward;
            value.valueBetA = teamAReward;
            value.valueBetB = teamBReward;
            value.peopleItemsNum = $.trim(peopleItemsNum);
            value.timeLeft = timeLeft;
            value.bestOf = bestOf;
            value.timeRaw = $.trim(time);
            value.dateRaw = date;
            value.matchStatus = matchStatus;
//                        value.matchDateRobot = matchDateRobot;
//                        value.matchDateHuman = matchDateHuman;
            value.hasItemsPlaced = hasItemsPlaced;
            value.itemsPlaced = itemsPlaced;
            value.teamBet = teamBet;
            value.msstatus = msstatus;
            value.mainstream = mainstream;
        }

    });
    _log(self.worker + ' OBJ: ', self[self.worker]);
    // retrieve the object with data for the current "id"
    var result = $.grep(self[self.worker].data, function (e) {
        return e.matchId == id;
    });
    var data = result[0];
    _log('parseMatchPageData worker', worker, 'done for', url);
    var dfd = new jQuery.Deferred();
    return dfd.resolve(self, data, this);
//  dfd.resolve()
//  return dfd.promise(self, data, this);
};
/*
 * appendEachMatch Method
 * @param {type} worker
 * @param {type} job
 * @param {type} url
 * @param {type} id
 * @param {type} container
 * @param {type} data
 * @returns {this, container, id}
 */
globalClass.prototype.appendEachMatch = function (worker, job, url, id, container, data) {
    _log('*** appendEachMatch ***');
//    console.log("Appending match #",id, 'data:', data, this);
//

    // SummaryBox (labels eg. "No bet placed" "hltv link" "reddit link" etc..."
    var summDest = container.find('.matchleft');
    var hasMBSumm = container.find('.matchbox-summary').length > 0 ? true : false;
    if (!hasMBSumm) {
        summDest.after('<div class="matchbox-summary"></div>');
    }
    if (typeof (data.teamAperc) !== "undefined" && (data.teamAperc).length > 0) { // TODO: und && length vars checker
        //GATHER INFOS TO APPEND
//        var placedbet = !data.hasItemsPlaced ? data.itemsPlaced : '&nbsp;'; // TODO REM IF UNNEEDED
        // infos Below TeamA vs TeamB

        // LoungeDestroyer timezone conversion. Not really stolen, users asked for compatibility.
        // The purpose is not to have any duplicate features with other plugins/scripts, so this one is temporary 'til there is a better solution with LD devs.
//        if (isChrome) {
//            chrome.storage.local.get(function (data) {
////                @ localstorage LD vars.
////                changeTimeToLocal
////                displayTzAbbr
////                timezone
////                americanosTime
//                function convertLoungeTime(loungeTimeString) {
//                    if (data.userSettings.changeTimeToLocal != '0') {
//                        // I am no timezone expert, but I assume moment.js treats CET/CEST automatically
//                        var trimmedTime = loungeTimeString.replace('CET', '').replace('CEST', '').trim();
//
//                        // Intl.DateTimeFormat().resolved.timeZone, might be derpy in other browsers
//
//                        if (moment.tz.zone(timezoneName)) {
//                            var format = (data.userSettings.americanosTime == '0' ? 'HH:mm' : 'h:mm A');
//                            format = (data.userSettings.displayTzAbbr == '0' ? format : format + ' z');
//                            return moment.tz(trimmedTime, 'HH:mm', 'CET').tz(timezoneName).format(format);
//                        }
//                    }
//
//                    return false;
//                }
//                var d = data.userSettings;
//                var d = JSON.parse(d);
//                console.log('USER TIMEZONE', d.timezone);
//            });
//        }

        var teamAReward = typeof data.teamAReward == "undefined" || data.teamAReward == "undefined" ? "" : data.teamAReward;
        var teamBReward = typeof data.teamBReward == "undefined" || data.teamAReward == "undefined" ? "" : data.teamBReward;
        var teamAReward = data.teamAReward == "" ? "&nbsp;" : data.teamAReward;
        var teamBReward = data.teamBReward == "" ? "&nbsp;" : data.teamBReward;
        console.log('teamAReward', teamAReward);
        console.log('teamAReward', typeof teamAReward);
        var infosbelow = '<div class="infosbelow-lr infosbelow-tb"> <div class="line2a"><span title="csgolounge bet reward value">' + teamAReward + '</span></div> </div> <div class="infosbelow-center">&nbsp;' + data.bestOf + '</div> <div class="infosbelow-lr infosbelow-tb"> <div class="line2b"> <span title="csgolounge bet reward value">' + teamBReward + '</span> </div>';
        // Match box header (eg. time left, date cup etc...)
        var mDataHeaderSpacer = '<span class="lspacer lspacer-mh"></span>';
        var headerDTimeLeft = '<span class="timeleft">' + data.timeLeft + '</span>';
        var headerDMatchStatus = '<span class="matchstatus"></span>';
        var headerDTimeRaw = '<span class="timeRaw">&nbsp;&nbsp;(' + data.timeRaw + ')</span>';
        var headerDDateRaw = settings.isCsgo ? '<span class="dateRaw">' + data.dateRaw + '</span>' + mDataHeaderSpacer : "";
        var headerDPItemNum = '<span class="peopleItemsNum">' + data.peopleItemsNum + '</span>';
        var headerDEvent = '<span class="eventm">CCS</span>';
        container.parent().find('.whenm').remove(); // cleanup csgl whenm div in matchheader

        var notUpToDate = container.find('.suminfo-warning'); // check for not up-to-date sticker warning and remove if it exists
        var retrieveError = container.find('.suminfo-error'); // check for error sticker and remove if it exists
        if (notUpToDate.length > 0) {
            notUpToDate.remove();
        }
        if (retrieveError.length > 0) {
            retrieveError.remove();
        }
        // matchheader (time left, date, additionnal info, cup)
        var $w = $('body').find('a[href="match?m=' + id + '"]').parents().eq(2).find('.matchheader');
        var $w2 = $('body').find('a[href="match?m=' + id + '"]').parents().eq(2).find('.matchheader');
        var $w3 = container.parent().find('.matchheader');
        // APPEND
        // matchheader
//        console.log('** Appending (appendEachMatch): ***', data.matchStatus, worker, job, url, id, container, data, '$w2', $w2, '$w3', $w3, headerDTimeLeft + headerDMatchStatus + headerDTimeRaw + mDataHeaderSpacer + headerDDateRaw + mDataHeaderSpacer + headerDPItemNum);
        $w2.append(headerDTimeLeft + headerDMatchStatus + headerDTimeRaw + mDataHeaderSpacer + headerDDateRaw + headerDPItemNum);

        var msCtn = container.parent().find('.matchstatus');
        var msIICtn = container.parent().find('.important-matchinfo');
        if ((data.timeLeft).indexOf('ago') > -1 && (data.matchStatus == "")) {
            msCtn.html(this.liveNow);
        }
        if (typeof data.matchStatus !== "undefined" && data.matchStatus !== "") {
            var msCtn = container.parent().find('.matchstatus');
            msCtn.html('<span class="important-matchinfo">&nbsp;' + data.matchStatus + '&nbsp;</span>');
        }
        // remove matchstatus container if there is no important info anymore to display
        if (msIICtn.length > 0 && (typeof data.matchStatus == "undefined" || data.matchStatus == "")) {
            msCtn.remove();
        }
        // Teams percentages arrows boxes
        var teamTextA = container.parent().find('.teamtext').eq('0');
        var teamTextB = container.parent().find('.teamtext').eq('1').find('i');
        teamTextA.append('<span class="arrow-teama"></span>');
        teamTextB.before('<span class="arrow-teamb"></span>');

        // Infos below the TeamA vs TeamB part
        data.matchCtn.find('a:first').append(infosbelow);

        var hasDetailsBetBox = (container.find('.details-betplaced')).length > 0 ? true : false;

        if (data.hasItemsPlaced) {
            // details-box - details-betplaced
            if (!hasDetailsBetBox) {
                container.append('<div class="detailsbox details-betplaced"' + initialization.matchBoxStatus + '></div>');
            }
            // Dest container for details
            var detBoxBet = container.find('.details-betplaced');

            globalData.count.betsPlaced++;
            data.matchCtn.find('.matchbox-summary').append('<span class="sumbox suminfo-bet betplaced">A bet has been placed.</span>').delay(50).fadeIn('slow');
            $('.numofb').html(globalData.count.betsPlaced).delay(50).fadeOut().fadeIn('slow');
            // Expand button
            (data.matchCtn).prepend('<div class="expmatchbtn-ctn"><a class="expandmatch-btn-a"><span class="expandmatch-btn">+</span></a></div>');
            detBoxBet.append(data.itemsPlaced);
        } else {
            data.matchCtn.find('.matchbox-summary').append('<span class="sumbox suminfo-bet nobetplaced">No bet placed.</span>').delay(50).fadeIn('slow');
        }
        console.log('MS', data.msstatus, data.mainstream);
        // TODO: ADD STREAMLINK
        // MAINSTREAM
        // if (data.msstatus == '1') {
        // data.matchCtn.append('<div class="detailsbox"><div class="mainstream-btn"><a href="#" > class="sh-stream">SHOW HIDE STREAM</a></div><div class="mainstream" style="display: none;">'+data.mainstream+'</div>')
        // }
        // $('.sh-stream').click(function(){
        // var $t = $(this).parents().eq(2);
        // alert($t.find('.mainstream'))
        // return false;
        // });
        // loading display
        data.matchCtn.find('.matchloading-ctn').remove();
        console.log('append done for id:', id);
    }

    var dfd = new jQuery.Deferred();
    return dfd.resolve(this, container, id);
};
globalClass.prototype.updateLoading = function (loadingStatus) {
    var loadingStatus = this[this.worker].loadingStatus;
    if (this.worker === "feeds") {
        if (loadingStatus.index + 1 === loadingStatus.totalItemsToLoad) {  // feeds have finished loading
            $('.feedloading').fadeOut('fast');
        }
    } else if (this.worker === "initialization") { // status bar render for worker initialization
        var status = loadingStatus.index;
        var total = loadingStatus.totalItemsToLoad;
        var newPart = (status / total) * 100;
        var newPartShow = Math.round(newPart);
        $('.progress > span').css('width', newPart + '%');
        $('.progress > span > span').text(newPartShow + '%');
        if (status === total) {
            $('.progress > span').css('width', '100%');
            $('.progress > span > span').text('100%');
            $('#mainloadingbar').fadeOut('slow');
            $('#matchescount').fadeOut('slow');
        }
        $('#mainheader #matchescount #current-matchescount').html(loadingStatus.index); // loading counter "X"/y
    } else { // any worker
    }
};
/* *********** Feed Jobs *********** */

globalClass.prototype.appendEachFeed = function (worker, job, url, id, container, data) {
    _log('*** appendEachFeed ***');
    var self = this;
//    var data = JSON.parse(data.response);
    console.log('FEEDS', id, data);

    var date = data.datas.date;
    var data = data.datas.feedProperties;
    var feedData = '';
    $.each(data, function (index, value) {
        var feedUrl = typeof value.feedUrls !== "undefined" ? value.feedUrls.reddit : value.feedUrl; // value.feedUrls = (reddit links list) csgl, reddit, hltv.
        var feedDate = (value.feedDate).indexOf('Not found') > -1 ? "&nbsp;" : value.feedDate; // don't show "Not Found" text.
        feedData += '<tr><td><a href="' + feedUrl + '" target="_blank" title="' + value.feedCup + '">' + value.feedMatchname + '</a></td><td><a href="' + feedUrl + '" target="_blank" title="' + value.feedCup + '">' + feedDate + '</a></td></tr>';
        container.html(feedData);
    });

    if (id === "hltv" && data.datas !== "0") {
        var currentdate = new Date(parseInt(date));
        var dateTime = "<a href='http://www.hltv.org/' target='_blank'>Last Sync: <br />" + currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + "<br /> " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds() + "</a>";
        $('#hltvfeed .feedstitle').html(dateTime);
    }
    else {

    }
    if (id === "reddit" && data.datas !== "0") {
        var currentdate = new Date(parseInt(date));
        var dateTime = "<a href='http://www.reddit.com/r/csgobetting/' target='_blank'>Last Sync: <br />" + currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + "<br /> " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds() + "</a>";
        $('#redditfeed .feedstitle').html(dateTime);
        $.each(data, function (index, value) {
            var matchUrl = value.feedUrls.csgl;
            var matchUrlHltv = value.feedUrls.hltv;
            var matchUrlReddit = value.feedUrls.reddit;
            var idExp = /(\d+)(?!.*\d)/;
            if (matchUrl.indexOf('csgolounge.com/match?m=') > -1) {
                var matchId = idExp.exec(matchUrl)[0];
                var container = $('body').find('a[href="match?m=' + matchId + '"]').parents().eq(1);

                var sumBox = container.find('.matchbox-summary');
                var hasExpandBtn = (container.find('.expandmatch-btn')).length > 0 ? true : false;
                var hasDetailsRawBox = (container.find('.details-raw')).length > 0 ? true : false;

                // details-box - details-raw
                if (!hasDetailsRawBox) {
                    if (container.find('.expandmatch-btn').text() == "-") {
                        var displayStatus = "style='display:block;'";
                    }
                    else if (container.find('.expandmatch-btn').text() == "+") {
                        var displayStatus = "style='display:none;'";
                    }
                    container.append('<div class="detailsbox details-raw"' + displayStatus + '></div>');
                }
                // stickers
                var redditSticker = sumBox.find('.reddit-link');
                var hltvSticker = sumBox.find('.hltv-link');
                // Dest container for details
                var detBoxRaw = container.find('.details-raw');

                if (matchUrlReddit.length > 0) {
                    if (redditSticker.length > 0) {
                        redditSticker.remove();
                    }

                    sumBox.append('<a class="reddit-link" target="_blank" href="' + matchUrlReddit + '" ><span class="sumbox suminfo-info">reddit</span></a>');
                    if (!hasExpandBtn) {
                        container.prepend('<div class="expmatchbtn-ctn"><a class="expandmatch-btn-a"><span class="expandmatch-btn">+</span></a></div>');
                        var hasExpandBtn = true;
                    }
                }
//                if (redditSticker.length > 0) {
//                    sumBox.append('<a class="reddit-link" target="_blank" href="' + matchUrlReddit + '" ><span class="sumbox suminfo-info">reddit</span></a>');
//                }
                if (matchUrlHltv.length > 0) {
                    if (hltvSticker.length > 0) {
                        hltvSticker.remove();
                    }
                    sumBox.append('<a class="hltv-link" target="_blank" href="' + matchUrlHltv + '" ><span class="sumbox suminfo-info">hltv</span></a>');
                    if (!hasExpandBtn) {
                        container.prepend('<div class="expmatchbtn-ctn"><a class="expandmatch-btn-a"><span class="expandmatch-btn">+</span></a></div>');
                        var hasExpandBtn = true;
                    }
                }
//                if (hltvSticker.length == 0) {
//                    sumBox.append('<a class="hltv-link" target="_blank" href="' + matchUrlHltv + '" ><span class="sumbox suminfo-info">hltv</span></a>');
//                }


                var htm = $.parseHTML(value.rawData.selftextHTML);
                var htm = $.text(htm);
                var paragraphs = $(htm).find('p');
                detBoxRaw.empty();

                $.each(paragraphs, function (i, v) {
                    var txt = $(v).text();
                    if (txt.indexOf('Match Information') == -1 && txt.indexOf('Date') == -1 && txt.indexOf('Time') == -1 && txt.indexOf('Link') == -1) {
                        detBoxRaw.append(v);
                    }
                });
//                detBoxRaw.html(rawDetails).show();




//                var mapsCtn = detBox.find('.details-maps');
//                var playersCtn = detBox.find('.details-players');
//
//                if (value.maps.length > 1) {
//                    mapsCtn.append('Map(s): ' + value.maps);
//                    mapsCtn.show();
//                }
//
//                var playersListA = '<span style="font-weight:bold">' + value.teamA + ' : </span>';
//                var playersListB = '<span style="font-weight:bold">' + value.teamB + ' : </span>';
//                if (value.playersList.teamA[0] != "Notfound") {
//                    for (var i = 0; i < value.playersList.teamA.length; i++) {
//                        playersListA += ' ' + value.playersList.teamA[i] + ' - ';
//                        if (i === value.playersList.teamA.length - 1) {
//                            playersListA += ' ' + value.playersList.teamA[i] + '.';
//                        }
//                    }
//                }
//                if (value.playersList.teamB[0] != "Notfound") {
//                    for (var i = 0; i < value.playersList.teamB.length; i++) {
//                        playersListB += ' ' + value.playersList.teamB[i] + ' - ';
//                        if (i === value.playersList.teamB.length - 1) {
//                            playersListB += ' ' + value.playersList.teamB[i] + '.';
//                        }
//                    }
//                }
//                if (value.playersList.teamB[0] != "Notfound" || value.playersList.teamA[0] != "Notfound") {
//                    playersCtn.append(playersListA + '<br />' + playersListB);
//                    playersCtn.show();
//                }

//                console.log(matchId);
//                console.log('MAPS', value.maps);
//                console.log('teamA', value.playersList.teamA);
//                console.log('teamB', value.playersList.teamB);
            }
        });

    }

    var dfd = new jQuery.Deferred();
    return dfd.resolve(this, this[this.worker].loadingStatus);
};
/* *********** Update Page *********** */

globalClass.prototype.getMainPageDistant = function () {
    _l('*** Initialization of Update Page Data  ***');
//    globalData.currentData = globalClass.initialization.data;    // store local infos retrieved with initialization worker
    console.log("getMainPageDistant", "this", this, this.worker);
    var dfd = new jQuery.Deferred();
    return dfd.resolve(this);
};
globalClass.prototype.compareData = function () {
    /* CurrentData = data on the page before the update
     * NewData = data on the DISTANT page
     * DiffData = currentData (+ add - rem from newData)
     *            result of currentData and newData comparison (add&rem) => will use it to compare current props (diffData[]) with new props (newData[])
     */
    _log('*** Compare Page Data ***');
    //COMPARE
    var currentData = globalData.currentData;
    var newData = this[this.worker].data;
    console.log(this.tools(), 'globalData.currentData - compareData START', globalData.currentData);
    console.log(this.tools(), 'newData - compareData START', newData);
//    console.log(JSON.stringify(currentData))
//    console.log(JSON.stringify(newData))

    var globalMonitor = this[this.worker].loadingStatus.globalMonitor;
    if (globalMonitor.error.request > 0) { // if there was at least 1 req error in match pages requests.
        for (var i = 0; i < globalMonitor.error.IDs; i++) {

        }
    }

    /* DEBUG */
    // rem
//    newData.splice(1, 1) // completely removes item 1 of array until next item (1 item for 1 time)
    // add
//    var editThat = [];
//    newData.forEach(function (obj) { // cloning diffData with currentData
//        var clonedObj = {};
//        var clonedObj = jQuery.extend(true, {}, obj);
//        editThat.push(clonedObj);
//    });
//    editThat[1].matchId = "9999";
//    editThat[1].matchUrl = "http://csgolounge.com/match?m=9999";
//    var last = newData.length;
//    newData[last] = editThat[1];
    /* DEBUG */

    var propsToUpdate = []; // we are building this array a bit below, containing all properties to update.

    var diffData = []; // result of currentData and newData comparison (add&rem) => will use it to compare current props (diffData[]) with new props (newData[])

    currentData.forEach(function (obj) { // cloning diffData with currentData
        var clonedObj = {};
        var clonedObj = jQuery.extend(true, {}, obj); // true = deep copy, none or false = shallow copy
        diffData.push(clonedObj);
    });
    // matches to add & to remove.
    function dataDifferenceADD(currentData, newData) {
        var x = {};
        currentData.forEach(function (obj) {
            x[obj.matchId] = obj;
        });
        return newData.filter(function (obj) {
            return !(obj.matchId in x);
        });
    }
    function dataDifferenceREM(currentData, newData) {
        var x = {};
        newData.forEach(function (obj) {
            x[obj.matchId] = obj;
        });
        return currentData.filter(function (obj) {
            return !(obj.matchId in x);
        });
    }
    var toAdd = dataDifferenceADD(currentData, newData);
    console.log('"TOADD:"', toAdd);
    var toRem = dataDifferenceREM(currentData, newData);
    console.log('"TOREMOVE:"', toRem);
//    console.log("toAdd", JSON.stringify(toAdd))
//    console.log("newData", JSON.stringify(newData))
    toAdd.forEach(function (obj) { //add
        diffData.push(obj); // push toAdd to diffData OBJ
        propsToUpdate.push(obj);
    });
    toRem.forEach(function (obj) { //rem
        var index = diffData.map(function (x) {
            return x.matchId;
        }).indexOf(obj.matchId); // grep index of toRem matchId in currentData
        if (index > -1) {
            diffData.splice(index, 1); // remove toRem element(s) in diffData
        }
    });
    this.remAndAdd = {};
    this.remAndAdd.rem = toRem;
    this.remAndAdd.add = toAdd;
//    console.log("diffData", JSON.stringify(diffData))
//    console.log("newData", JSON.stringify(newData))

    /*
     #1 props checks
     - loop through each prop of newData
     => check if current prop is in diffData
     - if yes => compare values => if diff => update dom & obj
     - if no => update dom & obj
     */

    for (var i = 0; i < newData.length; i++) {
        var newValuesObj = newData[i];
        var matchId = newValuesObj.matchId; // GET MATCHID
        var currentValues = $.grep(diffData, function (element, index) { // Grep matchId in diffData
            return element.matchId === matchId;
        });
        console.log('@compareData: --------- Checking matchID: ', matchId, ' ---------');
        if (typeof currentValues !== "undefined" && currentValues.length !== 0) {
            var currentValuesObj = currentValues[0]; // item of diffData array with current/old values (eg. {matchId: 2185, matchCtn: "div"...})

            //console.log('currentValuesObj', currentValuesObj)

            // build a list of properties for each array of values
            var currentArrayOfProps = Object.getOwnPropertyNames(currentValuesObj);
            var newArrayOfProps = Object.getOwnPropertyNames(newValuesObj);
//                    console.log('allvars', newValuesObj, matchId, currentValuesObj, currentArrayOfProps, newArrayOfProps)

            percStatus = {}; // percentage status: up, down, equal, err status
            for (var j = 0; j < newArrayOfProps.length; j++) { // iterate over the props array from newData

                /* Results */
                // newValuesObj = obj from newData (eg. Object { matchUrl="http://csgolounge.com/match?m=3022",  matchId="3022",  matchCtn={...},  plus...})
                // currentValuesObj = obj from diffData (eg. Object { matchUrl="http://csgolounge.com/match?m=3022",  matchId="3022",  matchCtn={...},  plus...})
                // propNameToCheck / newArrayOfProps[j] = teamBReward
                // newValuesPropValue / newValuesObj[propNameToCheck] = 5.4 for 1
                /* !Results */

                var propNameToCheck = newArrayOfProps[j];
                var newValuesPropValue = newValuesObj[propNameToCheck];
                var currentValuesPropValue = currentValuesObj[propNameToCheck];
                if (settings.debug.autoUpdate) {
                    console.log('propNameToCheck', propNameToCheck);
                    console.log('newValuesObj', newValuesObj);
                    console.log('currentValuesObj', currentValuesObj);
                    console.log('newValuesPropValue', newValuesPropValue);
                    console.log('currentValuesPropValue', currentValuesPropValue);
                    console.log('newArrayOfProps', newArrayOfProps);
                    console.log('currentArrayOfProps', currentArrayOfProps);
                    console.log('newValuesPropValue', newValuesPropValue);
                    console.log('currentValuesPropValue', currentValuesPropValue);
                }
                if ((currentValuesPropValue !== newValuesPropValue) && typeof newValuesPropValue != "undefined") { // prop is different in newDatas & currentData, newData prop is defined.
                    if (settings.debug.autoUpdate) {
                        console.log('#' + matchId, 'currentValuesPropValue', currentValuesPropValue, 'newValuesPropValue', newValuesPropValue);
                    }
                    // we populate an array (propsToUpdate) containing objects with props to update. We set obj at the array id it was in newData.
                    // eg. newData[2] = { "matchId": "2789", "prop" : "value" ... } => propToUpdate[2] = { "matchId": "2789", "propXToUpdate" : "valueXToUpdate" ...}

                    if (propNameToCheck === "teamBperc" || propNameToCheck === "teamAperc") { // percentage status. Let's check if percentage goes up, down, stays equal or is in err. Access example: propsToUpdate[index].percStatus.teamAperc
                        percStatus[propNameToCheck] = currentValuesPropValue < newValuesPropValue ? "up" : currentValuesPropValue > newValuesPropValue ? "down" : currentValuesPropValue == newValuesPropValue ? "equal" : "err";
                    }

                    var elementPos = propsToUpdate.map(function (x) { // Checking if we have already an obj for this matchId in propsToUpdate
                        return x.matchId;
                    }).indexOf(newValuesObj.matchId); // id in array

                    if (elementPos === -1) { // we've no obj, creating it.
                        var objToPush = {// basic obj containing matchId.
                            "matchId": newValuesObj.matchId
                        };
                    }
                    // setting objToPush properties
                    objToPush[propNameToCheck] = newValuesPropValue; // populating current prop in our obj
                    if (typeof percStatus[propNameToCheck] !== "undefined" && percStatus[propNameToCheck].length > 0) { // add percStatus if we've it.
                        objToPush.percStatus = percStatus;
                    }
                    // pushing obj or updating propsToUpdate array.
                    if (elementPos === -1) {
                        propsToUpdate.push(objToPush); // pushing obj containing prop, or prop + matchId.
                    } else {
                        propsToUpdate[elementPos] = objToPush; // pushing obj containing prop, or prop + matchId.
                    }
                }

            } // !for loop (newArrayOfProps, properties list from newData)
        }
    } // !for loop (newData)

    console.log(this.tools(), 'newData - compareData END', newData);
    console.log(this.tools(), 'diffData - compareData END', diffData);
//    console.log(this.tools(), 'propsToUpdate - compareData END', propsToUpdate);
    globalData.currentData = newData; // update globalData Object
    this.propsToUpdate = propsToUpdate; // public prop, will be used by updateData to generate the VIEW
//    console.log(JSON.stringify(propsToUpdate))

    var dfd = new jQuery.Deferred();
    return dfd.resolve(this);
};
globalClass.prototype.updateData = function () {
//    _l('*** Update Page Data  ***');
    console.log('*** Update Page Data  ***', this.propsToUpdate);
    var self = this;
    // UPDATE
    /* 1) grep matchId
     * 2) find container in dom
     * 3) find props containers in matchmain container
     * 4) update containers
     */
//    var propsToUpdate = [{"matchId": "2904", "peopleItemsNum": "\n                20026 people placed 57614 items.\n                                "}, {"matchId": "2907", "teamBReward": "1.3 for 1", "valueBetB": "1.3 for 1", "peopleItemsNum": "\n                15373 people placed 44126 items.\n                                "}, {"matchId": "2905", "teamAReward": "3.24 for 1", "valueBetA": "3.24 for 1", "peopleItemsNum": "\n                11275 people placed 31350 items.\n                                "}, {"matchId": "2908", "teamBReward": "3.54 for 1", "valueBetB": "3.54 for 1", "peopleItemsNum": "\n                1279 people placed 3564 items.\n                                "}, {"matchId": "2911", "teamBReward": "3.71 for 1", "valueBetB": "3.71 for 1", "peopleItemsNum": "\n                722 people placed 1842 items.\n                                "}, {"matchId": "2910", "peopleItemsNum": "\n                894 people placed 2420 items.\n                                "}, {"matchId": "2909", "teamAReward": "1.91 for 1", "valueBetA": "1.91 for 1", "peopleItemsNum": "\n                567 people placed 1472 items.\n                                "}]
//    console.log(propsToUpdate.length)

    // ADD && REM TO DOM
    // REMOVES
    var addedMatchesCtn = []; // container to pass as selector to CompleteInitialization.call(that, worker, selector) for props loading
    var toAdd = this.remAndAdd.add;
    var toRem = this.remAndAdd.rem;
    // TO ADD DEBUG
//    var m = [];
//    $.each($('body').find('.matchmain .match').not('.notavailable').parent(), function (i, v) {
//        m.push(v)
//    });
//    console.log('v', m)
//    var toAdd = [m[1], m[3]]

    // TO REM DEBUG
//    var toRem = [{"matchUrl": "http://csgolounge.com/match?m=3076", "matchId": "3076", "matchCtn": {"0": {}, "length": 1, "prevObject": {"0": {}, "length": 1, "prevObject": {"0": {}, "context": {}, "length": 1}, "context": {}, "selector": "a[href=\"match?m=2957\"]"}, "context": {}}, "teamAperc": "84%", "teamBperc": "16%", "matchNameA": "A51", "matchNameB": "Incursion", "teamAReward": "0.05 to 0.19 for 1", "teamBReward": "5.14 for 1", "valueBetA": "0.05 to 0.19 for 1", "valueBetB": "5.14 for 1", "peopleItemsNum": "\n                37891 people placed 109923 items.\n                                ", "timeLeft": "1 hour from now", "bestOf": "Best of 3", "timeRaw": "\n                04:30 CEST            ", "dateRaw": "Thursday 2nd April 2015", "hasItemsPlaced": "0", "itemsPlaced": "No bet placed.", "teamBet": "0", "msstatus": "0", "mainstream": "No stream available"}];
//    var matchCtnx = $('body').find('a[href="match?m=3076"]').closest('.match').parent();    // debug
//    console.log(matchCtnx);
//    console.log(toRem);
//    toRem[0].matchCtn = matchCtnx;    // debug

    // Count bet placed
    $.each(globalData.currentData, function (i, v) {
        var subContainer = $('body').find('a[href="match?m=' + v.matchId + '"]').closest('.match');
        if (v.hasItemsPlaced) {
            globalData.count.betsPlaced++;
            $('.numofb').html(globalData.count.betsPlaced).delay(50).fadeOut().fadeIn('slow');
            subContainer.find('.nobetplaced').remove(); // remove sticker
            if (subContainer.find('.betplaced').length <= 0) { // append sticker if it's not present yet.
                subContainer.find('.matchbox-summary').append('<span class="sumbox suminfo-bet betplaced">A bet has been placed.</span>').delay(50).fadeIn('slow');
            }
            if (subContainer.find('.winsorloses').length <= 0) { // append items if it's not present yet.
                if (subContainer.find('.expandmatch-btn').text() == "-") {
                    var displayStatus = "style='display:block;'";
                }
                else if (subContainer.find('.expandmatch-btn').text() == "+") {
                    var displayStatus = "style='display:none;'";
                }
                subContainer.append('<div class="detailsbox details-betplaced"' + displayStatus + '>' + v.itemsPlaced + '</div>');
            }
        }
    });
    if (toRem.length > 0) {
        $('.numofm').html((globalData.currentData).length).delay(50).fadeOut().fadeIn('slow'); // update matches available count
    }
    if (toAdd.length > 0) {
        // detach all containers
        var matchmainCtn = $('body').find('.matchmain .match').not('.notavailable').parent();
        var detachedMM = [];
        $.each(matchmainCtn, function (i, v) { // detach all matches containers in detachedMM array
            var matchUrlDest = $(v).find('.matchleft a').attr('href');
            if (typeof matchUrlDest == "undefined") { // container is a predict.
                var matchUrlDest = $(v).find('.match a').attr('href');
            }
            var matchId = matchUrlDest.replace('match?m=', '').replace('predict?m=', '');
            //detached.push($(v).detach())
            var detachedMatches = {
            };
            detachedMatches.matchCtn = $(v).detach();
            detachedMatches.matchId = matchId;
            detachedMM.push(detachedMatches);
        });
        console.log('detachedMM', detachedMM);
        // rebuld the page with reattached matches containers and added match containers
        $.each(globalData.currentData, function (i, v) { // loop through newData (updated in the prev. step globaData.currentData object), for each entry, check if ctn is in DOM or in newData obj
            //   check if v.matchId is in a 'toAdd' match, if yes, grep matchCtn in newData, else attach current matchCtn
            var matchToAdd = $.grep(toAdd, function (element, index) { // check if match is in toAdd
                return element.matchId === v.matchId;
            });
            //var matchToAdd = matchToAdd[0];

            // matchIsNew so toAdd: yes, no.
            var matchIsNew = (matchToAdd.length > 0) ? true : false;
            if (matchIsNew) { // current matchId is also in toAdd.
                console.log('matchIsNew TRUE', matchToAdd[0].matchCtn);
                if (typeof matchToAdd[0].matchCtn !== 'undefined') {
                    $(matchToAdd[0].matchCtn).parent().insertBefore('.shownotav').delay(50).fadeOut().fadeIn('slow');
                    console.log('added new match:', v.matchCtn, v);
                    addedMatchesCtn.push($(matchToAdd[0].matchCtn).parent());
                    $('#scriptinfo-box').prepend('<li class="linfo sticker"><span class="timenow">' + self.tools() + '</span>A new match has been added ' + v.matchNameA + ' vs ' + v.matchNameB + ' <span class="matchid">(<a href="' + v.matchUrl + '" target="_blank">#' + v.matchId + '</a>)</span></li>');
                    $('.numofm').html((globalData.currentData).length).delay(50).fadeOut().fadeIn('slow');
                }
            }
            if (!matchIsNew) { // matchCtn is in detachedMatches
                var matchToReAppend = $.grep(detachedMM, function (element, index) {
//                    console.log('matchIsNOTNew', detachedMM, element, v.matchId);
                    //return element.matchId === v.matchId;
                    return element.matchId === v.matchId;
                });
                var matchToReAppend = matchToReAppend[0];
//                console.log('matchToReAppend, matchIsNOTNew ', matchToReAppend)
                if (typeof matchToReAppend.matchCtn !== 'undefined') {
                    $(matchToReAppend.matchCtn).insertBefore('.shownotav');
                }
            }
        });
    }
    // Properties update


    var propsToUpdate = this.propsToUpdate;
    function getPropValue(obj, prop) {
        var toRet;
        $.each(obj, function (propl, val) {
            if (propl === prop) {
                toRet = val;
                return false;
            }
        });
        return toRet;
    }
    var debugAU = false;
    for (var x = 0; x < propsToUpdate.length; x++) { // loop through propsToUpdate
        var obj = propsToUpdate[x]; // obj in propsToUpdate array
        var matchId = obj.matchId;

        var subContainer = $('body').find('a[href="match?m=' + matchId + '"]').closest('.match'); // .match ctn
        var container = subContainer.parent(); // .matchmain ctn

        if (debugAU) {
            console.log(['AU:'], ' ', '-------- check matchId:', matchId, ' ------');
            console.log(['AU:'], ' ', 'var x in propsToUpdate', 'container', container, 'obj', obj, 'prop', prop, 'dest', destCtn, 'destSel', destCtnSel);
        }
        for (var prop in obj) { // browse each prop of the obj
            if (debugAU) {
                console.log(['AU:'], ' ', '(var prop in obj)', 'prop', prop);
            }
            if (prop !== "matchId" || prop !== "teamBperc" || prop !== "teamAperc" || prop !== "percStatus" || prop !== "matchCtn") {
                var destCtnSel = getPropValue(this.propsContainers, prop); // where to append the prop
                var destCtn = container.find(destCtnSel);
                if (destCtn.length > 0) {
                    if (prop === "timeRaw") { // timeRaw formating (   (19:00 CEST) )
                        var newValue = '&nbsp;&nbsp;(' + obj[prop] + ')';
                    } else {
                        var newValue = obj[prop];
                    }
                    destCtn.html(newValue).delay(100).fadeOut().fadeIn('slow');
                    console.log('Updated matchId:', matchId, ' prop:', prop, ' with value:', newValue, 'in container:', destCtn);
                }
            }

            if (prop === "timeLeft") { // Live !, Postponed, Closed etc...
                console.log("PROPTIMELEFT:", prop, obj[prop], this, container, msCtn, this.liveNow, obj[prop].indexOf('ago'));
                if (obj[prop].indexOf('ago') > -1) {
                    var msCtn = container.find('.matchstatus');
                    msCtn.html(this.liveNow);
                }
            }

            if (prop === "percStatus") { // arrows
                if (typeof obj.percStatus.teamAperc !== "undefined") {
                    var destCtn = container.find('.arrow-teama');
                    if (typeof destCtn !== "undefined" && destCtn.length > 0) {
                        destCtn.html(this.arrow[obj.percStatus.teamAperc]).delay(100).fadeOut().fadeIn('slow');
                    }
                }
                if (typeof obj.percStatus.teamBperc !== "undefined") {
                    var destCtn = container.find('.arrow-teamb');
                    if (typeof destCtn !== "undefined" && destCtn.length > 0) {
                        destCtn.html(this.arrow[obj.percStatus.teamBperc]).delay(100).fadeOut().fadeIn('slow');
                    }
                }
            }
            if (prop === "teamBperc" || prop === "teamAperc") {
                var destCtnSel = getPropValue(this.propsContainers, prop); // where to append the prop
                var destCtn = container.find(destCtnSel);
                if (destCtn.length > 0) {
                    if (debugAU) {
                        console.log(['AU:'], ' ', 'prop', prop, 'dest', destCtn, 'destSel', destCtnSel);
                    }
                    var newValue = obj[prop];
                    destCtn.html(newValue).delay(100).fadeOut().fadeIn('slow');
                }
            }

        }   // for (var prop in obj)
    }   // for (var x in propsToUpdate)

    var dfd = new jQuery.Deferred();
    return dfd.resolve(this, toAdd, toRem);
};
globalClass.prototype.autoUpdateTimers = function () {
    var today = new Date();
    var hh = today.getHours();
    var mm = today.getMinutes();
    var ss = today.getSeconds();
    if (ss <= 9)
        ss = "0" + ss;
    if (mm <= 9)
        mm = "0" + mm;
    var timeNow = hh + ':' + mm + ':' + ss;
    $('.au-lasttime').html(timeNow);
//    var mins = settings.updateDelay;
    var secs = settings.updateDelay / 1000;
    var currentSeconds = 0;
    var currentMinutes = 0;
    if (typeof window.autoUpdateTimer != "undefined") {
        clearInterval(window.autoUpdateTimer);
    }

    window.autoUpdateTimer = setInterval(function () {
        auCountDown();
    }, 1000);
    function auCountDown() {
        currentMinutes = Math.floor(secs / 60);
        currentSeconds = secs % 60;
        if (currentSeconds <= 9)
            currentSeconds = "0" + currentSeconds;
        secs--;
        $('.au-timeleft').html(currentMinutes + "m " + currentSeconds + "s");
        if (secs === -1) {
            clearInterval(window.autoUpdateTimer);
            $('.au-timeleft').html('updating...');
        }
    }


};
/* *********** join Matches And Feed *********** */
globalClass.prototype.compareMatchesWithFeed = function () {
    _log('*** Compare Matches With Feeds ***');
};
globalClass.prototype.appendFeedToMatches = function () {
    _log('*** Append Feed to Matches ***');
};
globalClass.prototype.tools = function () {
    _log('*** tools ***');
    var today = new Date();
    var hh = today.getHours();
    var mm = today.getMinutes();
    var ss = today.getSeconds();
    if (ss <= 9)
        ss = "0" + ss;
    if (mm <= 9)
        mm = "0" + mm;
    var timeNow = hh + ':' + mm + ':' + ss;
    return timeNow;
};
globalClass.prototype.toolsx = {
    'time': function () {
        var today = new Date();
        var hh = today.getHours();
        var mm = today.getMinutes();
        var ss = today.getSeconds();
        if (ss <= 9)
            ss = "0" + ss;
        if (mm <= 9)
            mm = "0" + mm;
        var timeNow = hh + ':' + mm + ':' + ss;
        return timeNow;
    }
};
globalClass.prototype.infobox = function (status, message) { //         self.infobox('err', 'LOLOLOLO')
    _log('*** infobox ***');
    var defaultContainer = '#scriptinfo-box';
    switch (status) {
        case 'err':
            var errorType = 'lerror';
            break;
        case 'info':
            var errorType = 'linfo';
            break;
        case 'warn':
            var errorType = 'lwarning';
            break;
    }
    var defaultPrepend = $(defaultContainer).prepend('<li class="' + errorType + ' sticker"><span class="timenow">' + this.toolsx.time() + '</span> ' + message + '</li>');
};

function CompleteInitialization(worker, selector) {
//    var initGlobal = new globalClass('initialization'); // wrap init + get each match infos + appends
    var selector = (typeof selector === "undefined") ? "" : selector;
    this.job.retrieveMissing = (typeof selector != "undefined" && selector.length > 0) ? true : false;
    console.log('this (CompleteInitialization)', this, worker, selector, this.job.retrieveMissing);
    $.when(this.parseMainPage(selector)).then(function (that) {
        pLog('DONE:', 'parseMainPage', that);
        return that.globalInfos();
    }).then(function (that) {
        pLog('DONE:', 'globalInfos', that);
        return that.initLoading();
    }).then(function (that) {    // Get Match Infos LOOP
        var promisesCompleteInit = [];
        var data = that[that.worker].data;
        $.each(data, function (index, matchUrl) {
            var matchUrl = data[index].matchUrl;
            var matchId = data[index].matchId;
            var matchCtn = data[index].matchCtn;
            _log('curr =', matchUrl, that);
            var p = that.ajaxCalls(that.worker, that.job, matchUrl, matchId, matchCtn, settings.defaultTimeout); //
            promisesCompleteInit.push(p);
            p.done(function (data, textStatus, jqXHR) {
                var responseData = jqXHR.responseText;
                that.monitorWorker("success", "request", matchCtn, matchId); // monitor global responses status to count how many succeed and failed.

                // when request is done, process the data.
                $.when(that.parseMatchPageData(that.worker, that.job, matchUrl, matchId, matchCtn, responseData)).then(function (that, data) {
                    return that.appendEachMatch(that.worker, that.job, matchUrl, matchId, matchCtn, data);
                }).then(function (that, matchCtn, matchId) {
                    pLog('DONE: CompleteInitialization, appendEachMatch', that);
                    that.monitorWorker("success", "view", matchCtn, matchId); // monitor global responses status to count how many succeed and failed.
                    return that.updateLoading(that[that.worker].loadingStatus); // send each request status individually to updateLoading
                });
            });
            p.fail(function (jqXHR, stringStatus, exceptionObj) { // exceptionObj: "abort", "timeout", "No Transport".
                if (exceptionObj) {
                    switch (exceptionObj) {
                        case 'abort':
                            var errorType = 'abort';
                            that.errorHandling("error", "request", matchCtn, matchId, errorType);
                            that.monitorWorker("error", "request", matchCtn, matchId); // monitor global responses status to count how many succeed and failed.
                            break;
                        case 'timeout':
                            var errorType = 'timeout';
                            that.errorHandling("error", "request", matchCtn, matchId, errorType);
                            that.monitorWorker("error", "request", matchCtn, matchId); // monitor global responses status to count how many succeed and failed.
                            break;
                        case 'No Transport':
                            var errorType = 'No Transport';
                            that.errorHandling("error", "request", matchCtn, matchId, errorType);
                            that.monitorWorker("error", "request", matchCtn, matchId); // monitor global responses status to count how many succeed and failed.
                            break;
                    }
                } else {
                    var errorType = 'error';
                    that.errorHandling("error", "request", matchCtn, matchId, errorType);
                    that.monitorWorker("error", "request", matchCtn, matchId); // monitor global responses status to count how many succeed and failed.
                }
                pLog('Failed to retrieve a match in CompleteInitialization', errorType, matchUrl);
            });
        }); // each ended.

        $.when.apply($, promisesCompleteInit)
                .always(function () {
                    that.done();
                    pLog('DONE: CompleteInitialization ajax req and appends have just finished.');
                    if (settings.switches.feeds) {
                        FeedsInitialization();
                    }
                    if (settings.switches.autoupdate) {
                        console.log('Initializing Update in ' + settings.updateDelay / 1000 / 60 + ' minutes');
//                    console.log('GLOBALOBJ',that.initialization.data)
//                    console.log('GLOBALOBJ',globalData.currentData )
                        that.autoUpdateTimers();
                        window.autoUpdate = setInterval(function () {
                            console.log('UpdateInitialization');
                            that.autoUpdateTimers();
                            UpdateInitialization();
                        }, settings.updateDelay);
                    }
                })
                .done(function () {
                    console.log('Fired all methods for worker init without errors.');
                })
                .fail(function () {
                    console.log('Fired all methods for worker init WITH ERRORS.');
                });
    });
}
/*
 * @CompleteInitialization()
 "parseMainPage",
 "globalInfos",
 "initLoading",
 "getMatchInfos", // WRAPPED THIS DIRECTLY IN CompleteInitialization function.
 "ajaxCalls",
 "parseMatchPageData",
 "appendEachMatch",
 "updateLoading"
 */

function UpdateInitialization() {   // (AU = Auto Update)
    globalData.count.betsPlaced = 0;
    pLog('UpdateInitialization fired !');
    var initUpdate = new globalClass('updatePage'); // init page view only
    $.when(initUpdate.getMainPageDistant())
            .then(function (that) {
                var AUmainpage = initUpdate.ajaxCalls(initUpdate.worker, "updatePage", baseUrl, "", "", settings.defaultTimeout);
                AUmainpage.done(function (data, textStatus, jqXHR) {
                    pLog('req ', baseUrl, ' done.');
                    $.when(that.parseMainPage("", data))
                            .then(function (that) {
                                pLog('DONE:', 'globalInfos', that);
                                return that.initLoading();
                            })
                            /* ---------------- */
                            .then(function (that, data) {    // Get Match Infos LOOP
                                _log('parseMainPage DONE', that[that.worker]);
                                var promisesUpdateInit = [];
                                var promisesUpdateParsing = [];
                                var dataG = that[that.worker].data;
                                $.each(dataG, function (index, matchUrl) {
                                    var matchUrl = dataG[index].matchUrl;
                                    var matchId = dataG[index].matchId;
                                    var matchCtn = dataG[index].matchCtn;
                                    //console.log('curr =', matchUrl, that);
                                    var px = that.ajaxCalls(that.worker, that.job, matchUrl, matchId, matchCtn, settings.defaultTimeout); //
                                    promisesUpdateInit.push(px);
                                    px.done(function (data, textStatus, jqXHR) {    // ajax request is complete and has success status.
                                        var responseData = jqXHR.responseText;
                                        pLog('DONE', that.worker, that.job, matchUrl, matchId, matchCtn);
                                        that.monitorWorker("success", "request", matchCtn, matchId); // monitor global responses status to count how many succeed and failed.
                                        var matchboxSummary = $('body').find('a[href="match?m=' + matchId + '"]').closest('.match').find('.matchbox-summary');
                                        var ntuSticker = matchboxSummary.find('.notuptodate');
                                        if (ntuSticker.length > 0) {
                                            ntuSticker.delay(50).fadeOut().fadeIn('slow').remove();
                                        }   // not up-to-date sticker
                                        promisesUpdateParsing.push(that.parseMatchPageData(that.worker, that.job, matchUrl, matchId, matchCtn, responseData)); // Parse the data.
                                        if (promisesUpdateParsing.length === dataG.length) {    //  wait for all parsing promises returned by parseMatchPageData method.
                                            $.when.apply($, promisesUpdateParsing).then(
                                                    function (status) {
                                                        $.when(that.compareData())
                                                                .then(function (that) {
                                                                    return that.updateData();
                                                                }, function () {
                                                                    console.log('E R R O R');
                                                                })
                                                                .then(function (that, toAdd, toRem) { // datas append when a new match has been added.
                                                                    if (typeof toAdd != "undefined" && toAdd.length > 0) {
                                                                        console.log('UPDATEDATADONE (toAdd):', toAdd);
                                                                        for (var i = 0; i < toAdd.length; i++) {
                                                                            console.log('"TOADD:" Sending this to "appendEachMatch":', that.worker, that.job, toAdd[i].matchUrl, toAdd[i].matchId, toAdd[i].matchCtn, toAdd[i]);
                                                                            that.appendEachMatch(that.worker, that.job, toAdd[i].matchUrl, toAdd[i].matchId, toAdd[i].matchCtn, toAdd[i]);
                                                                        }
                                                                    }
                                                                    // when a match has been removed.
                                                                    if (typeof toRem != "undefined" && toRem.length > 0) {
                                                                        console.log('UPDATEDATADONE (toRem):', toRem);
                                                                        for (var i = 0; i < toRem.length; i++) {
                                                                            var matchUrl = toRem[i].matchUrl;
                                                                            var matchId = toRem[i].matchId;
                                                                            console.log('"TOREMOVE:" main obj:', toRem[i]);
                                                                            // find, detach and append match ctn to shna
                                                                            var toRemCtn = $('body').find('a[href="match?m=' + matchId + '"]').parents().eq(2);
                                                                            var detachedToRemCtn = toRemCtn.detach();
                                                                            detachedToRemCtn.appendTo('#sh-na').find('.match').addClass('notavailable');
                                                                            console.log('"TOREMOVE:" detached ctn #', matchId, detachedToRemCtn, 'and appended to #sh-na');
                                                                            // ajax call the match page to get the match result or status (winner/loser or postponed, closed etc...)
                                                                            $.when(that.ajaxCalls(that.worker, that.job, matchUrl, matchId, detachedToRemCtn, settings.defaultTimeout))
                                                                                    .done(function (data, textStatus, jqXHR) {
                                                                                        /* TODO: SHOULD NOT STANDS IN PROCESS, SHOULD BE IN A PRIVATE VIEW METHOD + VERY VERBOSE :( */
                                                                                        console.log('"TOREMOVE:" REMOVEDONE:', textStatus, jqXHR, matchUrl, matchId);
                                                                                        var data = $(data);
                                                                                        var resultSel = data.find('.box-shiny-alt:eq(0)');
                                                                                        var teamARes = resultSel.find('b:eq(0)');
                                                                                        var teamBRes = resultSel.find('b:eq(1)');
                                                                                        var teamARes = teamARes.text().trim();
                                                                                        var teamBRes = teamBRes.text().trim();
                                                                                        var wonAImg = '<img style="position: relative; left: 40px; top: -12px;" src="http://cdn.csgolounge.com/img/won.png">';
                                                                                        var wonBImg = '<img style="position: relative; left: 40px; top: -12px;" src="http://cdn.csgolounge.com/img/won.png">';
                                                                                        var checkStatus = "linfo";

                                                                                        var taIsWinner = teamARes.indexOf('(win)') > -1 ? true : false;
                                                                                        var tbIsWinner = teamBRes.indexOf('(win)') > -1 ? true : false;
                                                                                        if (taIsWinner || tbIsWinner) {
                                                                                            var matchResult = teamARes + ' vs ' + teamBRes;
                                                                                            if (taIsWinner) {
                                                                                                var ta = detachedToRemCtn.find('.teamtext:eq(0)').prev();
                                                                                                console.log("TOREMOVE:", 'win', detachedToRemCtn, ta);
                                                                                                ta.html(wonAImg);
                                                                                            }
                                                                                            if (tbIsWinner) {
                                                                                                var tb = detachedToRemCtn.find('.teamtext:eq(1)').prev();
                                                                                                console.log("TOREMOVE:", 'win', detachedToRemCtn, tb);
                                                                                                tb.html(wonBImg);
                                                                                            }
                                                                                        }
                                                                                        detachedToRemCtn.find('.matchislive').html(''); // cleanup 'live !' status.
                                                                                        var msSel = data.find('.box-shiny-alt div:eq(4)');
                                                                                        var matchStatus = msSel.text().trim();
                                                                                        if (matchStatus !== "") {
                                                                                            var matchResult = matchStatus;
                                                                                        }
                                                                                        if (typeof matchResult === "undefined") {
                                                                                            var matchResult = '<a href="' + matchUrl + '" target="_blank">Could not find result for this match, check it by clicking here</a>';
                                                                                            var checkStatus = "lwarning";
                                                                                        }
                                                                                        // apppend match status and prepend info
                                                                                        $('#scriptinfo-box').prepend('<li class="' + checkStatus + ' sticker"><span class="timenow">' + that.tools() + '</span>A match has been closed: ' + matchResult + ' <span class="matchid">(<a href="' + matchUrl + '" target="_blank">#' + matchId + '</a>)</span></li>');

                                                                                    })
                                                                                    .fail(function (jqXHR, stringStatus, exceptionObj) { // exceptionObj: "abort", "timeout", "No Transport".
                                                                                        console.log('"TOREMOVE:" REMOVEFAIL:', jqXHR, stringStatus, exceptionObj);
                                                                                    });
                                                                            // append status to ctn and info
                                                                        }
                                                                    }
                                                                }, function () {
                                                                    console.log('E R R O R: something went wrong while adding or removing a match.');
                                                                });
                                                    });
                                        }
                                    });
                                    px.fail(function (jqXHR, stringStatus, exceptionObj) { // exceptionObj: "abort", "timeout", "No Transport".
                                        var dfd = new jQuery.Deferred();
                                        promisesUpdateParsing.push(dfd.resolve()); // resolve the item that should have been parsed by promisesUpdateParsing anyway, we need to feed promisesUpdateParsing array to know all available  data have been parsed by parseMatchPageData.

                                        if (exceptionObj) {
                                            switch (exceptionObj) {
                                                case 'abort':
                                                    var error = 'abort';
                                                    break;
                                                case 'timeout':
                                                    var error = 'timeout';
                                                    break;
                                                case 'No Transport':
                                                    var error = 'No Transport';
                                                    break;
                                            }
                                        } else {
                                            var error = 'error';
                                        }
                                        that.monitorWorker("error", "request", matchCtn, matchId); // monitor global responses status to count how many succeed and failed.
                                        console.log('REQUESTFORAUFAILED:', that.worker, that.job, matchUrl, matchId, matchCtn, jqXHR, stringStatus, exceptionObj);
                                        var msg = ' There was an error while retrieving match #' + matchId + ' datas. Could not update it for now, trying again in ~' + settings.updateDelay / 1000 / 60 + ' minutes...';
                                        // sticker in matchbox summary
                                        var matchboxSummary = $('body').find('a[href="match?m=' + matchId + '"]').closest('.match').find('.matchbox-summary');
                                        var hasNTUSticker = matchboxSummary.find('.notuptodate').length > 0 ? true : false;
                                        var haserrSticker = matchboxSummary.find('.firstretrieveerr').length > 0 ? true : false;
                                        if (!hasNTUSticker && !haserrSticker) {
                                            var infoSticker = '<span class="sumbox suminfo-warning notuptodate"> Not up-to-date!</span>';
                                            matchboxSummary.append(infoSticker).delay(50).fadeOut().fadeIn('slow');
                                        }
                                        $('#scriptinfo-box').prepend('<li class="lwarning sticker"><span class="timenow">' + that.tools() + '</span>' + msg + '</li>');
                                    });
                                }); // each ended.

                                $.when.apply($, promisesUpdateInit) // All AutoUpdate ajax calls returned their promises.
                                        .done(function (that) {
                                            console.log('Fired all methods for worker UPDATEPAGE, all done without errors.');
                                            $('#force-refresh').removeClass('fr-loading').addClass('fr-notloading');
                                            if (settings.switches.feeds) {
                                                FeedsInitialization();
                                            }
                                        })
                                        .fail(function (that) {
                                            console.log('Fired all methods for worker UPDATEPAGE, all done WITH ERRORS.');
                                            $('#force-refresh').removeClass('fr-loading').addClass('fr-notloading');
                                        });
                            });
                });
                AUmainpage.fail(function (jqXHR, stringStatus, exceptionObj) { // exceptionObj: "abort", "timeout", "No Transport".
                    $('#scriptinfo-box').prepend('<li class="lerror sticker"><span class="timenow">' + that.tools() + '</span> Main page request for auto update failed. Site might be overloaded or your connection dropped ? If many tries fail again, please disable auto update until site trafic downs.');
                    console.log('Main page request for auto update failed.');
                });
            });
}
/*
 * @UpdateInitialization()
 *
 getMainPageDistant
 ajaxCalls
 parseMainPage
 initLoading
 each dataG
 ajaxCalls
 monitorWorker
 parseMatchPageData
 compareData
 if add => appendEachMatch
 */


function FeedsInitialization() {
    var initFeeds = new globalClass('feeds'); // Turn on feeds
    $.when(initFeeds.initGlobalProcess()).then(function (that) {
        pLog('DONE:', 'initGlobalProcess', that);
        return that.globalInfos();
    }).then(function (that) {
        pLog('DONE:', 'globalInfos', that);
        return that.initLoading();
    }).then(function (that) {
        pLog('DONE:', 'initLoading', that);
        that[that.worker] = that.feeds;
        // ask ajaxCalls to request each feeds
        $.each(that.feeds.data, function (index, feedName) {
            var url = that.feeds.feedsDatas[feedName].url;
            var feedContainer = $("#" + feedName + "feed .feedslinks-box tbody");
            var job = feedName;
            _log('feedName', that.worker, that.job, url, feedName, feedContainer);
            $.when(that.ajaxCalls(that.worker, that.job, url, feedName, feedContainer, 30000))
                    .done(function (data, textStatus, jqXHR) {
                        var responseData = jqXHR.responseJSON;
                        _log('AJAX CALL DONE', data, textStatus, jqXHR);
                        that.monitorWorker("success", "request", feedContainer, feedName);
                        // when request is done, process the data.
                        $.when(that.appendEachFeed(that.worker, that.job, url, feedName, feedContainer, responseData)).then(function (that, data) {
                            that.monitorWorker("success", "view", feedContainer, feedName);
                            return that.updateLoading(that.worker, that.job, url, feedName, feedContainer, data);
                        });
                    })
                    .fail(function (jqXHR, stringStatus, exceptionObj) { // exceptionObj: "abort", "timeout", "No Transport".
                        if (exceptionObj) {
                            switch (exceptionObj) {
                                case 'abort':
                                    var error = 'abort';
                                    if (feedName === "hltv") {
                                        $('#hltvfeed .feedslinks-box').append('<li>' + that.errors.feeds.abort + '</li>');
                                    }
                                    if (feedName === "reddit") {
                                        $('#redditfeed .feedslinks-box').append('<li>' + that.errors.feeds.abort + '</li>');
                                    }
                                    break;
                                case 'timeout':
                                    if (feedName === "hltv") {
                                        $('#hltvfeed .feedslinks-box').append('<li>' + that.errors.feeds.timeout + '</li>');
                                    }
                                    if (feedName === "reddit") {
                                        $('#redditfeed .feedslinks-box').append('<li>' + that.errors.feeds.timeout + '</li>');
                                    }
                                    var error = 'timeout';
                                    break;
                                case 'No Transport':
                                    if (feedName === "hltv") {
                                        $('#hltvfeed .feedslinks-box').append('<li>' + that.errors.feeds.errors + '</li>');
                                    }
                                    if (feedName === "reddit") {
                                        $('#redditfeed .feedslinks-box').append('<li>' + that.errors.feeds.errors + '</li>');
                                    }
                                    break;
                            }
                        } else {
                            var error = 'error';
                        }
                        that.monitorWorker("error", "request", feedContainer, feedName); // monitor global responses status to count how many succeed and failed.
                        pLog('Feeds failed to retrieve data', error, feedName, feedContainer);
                    });
        });
    }).done(function (that) {
        pLog('DONE:', 'ajaxCalls', that);
        pLog('done all.');
        initFeeds.done();
    });
}
/*
 * @Feeds()
 "initGlobalProcess",
 "globalInfos",
 "initLoading",
 "getFeeds",
 "ajaxCalls",
 "appendEachFeed",
 "updateLoading"
 */

function initialization(initType) {
//    var initGlobal = new globalClass('basicInit'); // init page view only
    var worker = 'initialization'; // default
    switch (initType) {
        case "complete":
            var worker = 'initialization';
            break;
        case "basic":
            var worker = 'basicInit';
            break;
    }
    var initGlobal = new globalClass(worker); // init page view only
    $.when(initGlobal.initGlobalProcess()).then(function (that) {
        pLog('DONE:', 'initGlobalProcess', that);
        return that.initPageView();
    }).then(function (that) {
        pLog('DONE:', 'initPageView', that);
    }).done(function (that) {
        pLog('DONE:', 'BasicInitialization', that);
        if (initType === "basic") { // a basic Init has been requested, finishing.
            return initGlobal.done();
        } else {    // a complete init has been requested, continueing.
            CompleteInitialization.call(initGlobal);
        }
    });
}
/*
 * @BasicInitialization()
 "initGlobalProcess",
 "initPageView"
 */
settings.switches.completeinit ? initialization('complete') : initialization('basic');


/* INSTANCES DECLARATIONS */
//UpdateInitialization();

//var initGlobal = new globalClass('basicInit'); // init page view only
//var initGlobal = new globalClass('UpdatePage'); // wrap init + get each match infos + appends

//var initGlobal = new globalClass('initialization'); // wrap init + get each match infos + appends
//initGlobal.initGlobalProcess();
//var initFeeds = new globalClass('feeds');
//initFeeds.initGlobalProcess();
//
//var initUpdatePage = new globalClass('UpdatePage'); // init updateData worker
//initUpdatePage.initGlobalProcess();
//



