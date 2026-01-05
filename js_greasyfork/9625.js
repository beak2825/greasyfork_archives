// ==UserScript==
// @name         Warez-BB +
// @version      1.1
// @description  Enhance The Browsing Experience On Warez-BB.org
// @author       FuSiOn
// @match        https://www.warez-bb.org/viewforum.php?f=*
// @match        https://www.warez-bb.org/search.php*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @icon         https://i.postimg.cc/sXfbmM21/WBB-_CU.png
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @run-at       document-end
// @license      MIT
// @namespace https://greasyfork.org/users/10999
// @downloadURL https://update.greasyfork.org/scripts/9625/Warez-BB%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/9625/Warez-BB%20%2B.meta.js
// ==/UserScript==
debugger;
(function() {
    var logged = 0;
    var debug  = true,
        forumSection,
        fileHosts,
        IMDbData 		= GM_getValue('IMDbData', {}),
        SETTINGS_HTML	= '<div id="WBB"><div id="titlebar"><span class="expand">+</span><span class="title">WBB+ <span style="font-size: x-small;">v' + GM_info.script.version + '</span></span></div><div class="TABNAV"><div class="navbar"><ul class="tabslist row"><div class="tab active" id="General"><li>General</li><div class="tabPage"><ul><li><label for="debug">Enable Debug:</label><input type="checkbox" id="debug"></li><li><label for="hostIcon">Show Host Icons:</label><input type="checkbox" id="hostIcon"></li><li><label for="hostIcon-margin">Host Icon Margin:</label><input type="number" id="hostIcon-margin" min="0" max="5"></li><li><label for="hostIcon-size">Host Icon Size:</label><input type="number" id="hostIcon-size" min="16" max="32"></li><li><label for="showDescription">Show User Description:</label><input type="checkbox" id="showDescription"></li><li><label for="storeData">Store IMDb Data Locally:</label><input type="checkbox" id="storeData" checked><button id="delete">Delete</button></li></ul></div></div><div class="tab" id="movies"><li>Movies & TV Shows</li><div class="tabPage"><ul><li><label for="getIMDb">Get IMDb Info: </label><input id="getIMDb" type="checkbox"></li><li><label for="WatchList">In Watchlist: </label><input id="WatchList" type="color"></li><li><label for="UserListID">Userlist ID: </label><input id="UserListID" type="text"></li><li><label for="UserList">In Userlist: </label><input id="UserList" type="color"></li><li><label for="bothLists">In WatchList & Userlist: </label><input id="bothLists" type="color"></li></ul></div></div><div class="tab" id="games"><li>Games & Console Games</li><div class="tabPage"></div></div></ul><div class="space"></div></div></div><button id="save">Save</button></div>',
        IMDB_INFO_HTML 	= "<div class='IMDB'><table class='IMDBinfo'><tr id='left'><td rowspan='3' id='image'></td></tr><tr id='top'><td><div id='name'><span id='year'></span></div><div id='contentRating'><span></span></div><div id='duration'><span></span></div><div id='datePublished'><span></span></div><div id='genre'></div><div id='ratings'><canvas id='rStars' width='400' height='40'></canvas><div id='rating'><span id='ratingValue'></span><span id='bestRating'></span><span id='ratingCount'><span></span></span></div></div></td></tr><tr id='main'><td><div id='description'></div><div id='director'><h4></h4></div><div id='creator'><h4></h4></div><div id='actors'><h4>Stars:</h4><div id='actorsRow'></div></div><div id='trailer'><iframe src=''allowfullscreen='true' mozallowfullscreen='true' webkitallowfullscreen='true' frameborder='no' scrolling='no'></iframe></div></td></tr></table><div class='TABNAV'><div class='navbar'><ul class='tabslist column'><div class='tab active' id='showInfo'><li></li></div><div class='tab' id='playTrailer'><li></li></div></div>",
        stars          	= "https://s24.postimg.cc/91cjlsz05/star.png",
        play            = "https://s24.postimg.cc/pb2pop9o5/trailer.png",
        info            = "https://s24.postimg.cc/qouck08xh/info.png",
        defaultSettings = {
            'debug' : false,
            'hostIcon' : true,
            'iconSize': 20,
            'iconMargin': 2,
            'description': true,
            'getIMDb':true,
            'watchListColor':"#BEAB2A",
            'userListColor':"#2577A7",
            'joinedColor': "#77A725",
            'userList':""
        },
        standerdHeaders = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36",
        },
        settings  		= GM_getValue('settings', defaultSettings),
        RegEX 			= {
            "movies":       /^((?:[|\[({]?\s*(?:\w{2,5}(?:\.\w{2,3})?(?:\s?[\+|\/\-\s]+\s?(?:\w{2,5}(?:\.\w{2,3})?\s*|\d+|\+))*\+?(?=[|\])}])[|\])}](?!\]))\s*)*(?:(?:\w{2,5}(?:\.\w{2,3})?|\d+)\s*[|\])}])?)(.+?)([.\(\[\s\{](?:19|20)\d{2}(?:[-+](?:19|20)\d{2})?(?:[.\]\)\s\}]|$))(.*$)/i,
            "tv":           /^((?:[|\[({]?\s*(?:\w{2,5}(?:\.\w{2,3})?(?:\s?[\+|\/\-\s]+\s?(?:\w{2,5}(?:\.\w{2,3})?\s*|\d+|\+))*\+?(?=[|\])}])[|\])}](?!\]))\s*)*(?:(?:\w{2,5}(?:\.\w{2,3})?|\d+)\s*[|\])}])?)(.+?)()\W((?:[\[(]\s?)?(?:(?:(?:s?\d{1,2}-?)?e\d{1,2})|\d{1,2}x\d{1,2}|(?:(?:s|seasons?)\s?\d{1,2}(?:(?:-|\s)\d{1,2})*)|0?1(?:-\d{1,2})+|\d{1,2}[-\/.]\d{1,2}[-\/.]\d{4}|\d{4}[-\/.]\d{1,2}[-\/.]\d{1,2}|\w{3}.{1,2}\d{1,2}.{1,2}\d{4}|(?:19|20)\d{2}|\||complete|dvdrip|web-?(?:rip|dl)|(?:mini\W)?series?|blu-ray|hdtv|720p|1080p)(?:\s?[\])])?.*$)/i,
            "episode":      /(?:S\d{1,2}[\s-]E\d{1,2}[-\s]E\d{1,2}|S?\d{1,2}-?e\d{1,2}|\sE\d{1,2}(?:-?E\d{1,2})?|\d{1,2}x\d{1,2}|season\s\d{1,2}.?\sepisode\s\d{1,2})/i,
            "season":       /(?:\s|^)(?:S|seasons?)\s?(\d{1,2}(?:(?:-|\s)S?\d{1,2})*)(?![\dE]|.{1,2}episode)/i,
            "games":        /^((?:[|\[({]?\s*(?:\w{2,5}(?:\.\w{2,3})?(?:\s?[\+|\/\-\s]+\s?(?:\w{2,5}(?:\.\w{2,3})?\s*|\d+|\+))*\+?(?=[|\])}])[|\])}](?!\]))\s*)*(?:(?:\w{2,5}(?:\.\w{2,3})?|\d+)\s*[|\])}])?)(.+?)()((?:-?\s?[\[(+{]?\s?)?(?:\W(?:V|PATCH|BUILD|UPDATE)\W?\V?[(\[]?(?:\d+\.?)|\d+\.(\d+\.)+|(?:19|20)\d{2}|(?:FULL\W)?(?:(?:PRE-?)?CRACK(?:ED)?|ISO\W)|DLC|\W(?:(?:\d+\W)?LANG|PC|GOG|GOTY|GAME.OF.THE.(?:YEAR|CENTURY)|RIP|INCL?)(?:\W|$)|\WHD|ADDON|Directors\WCut|Master\WCollection|\w+\WEdition|MULTi\W?\d+|Complete|Language|(?:ENGLISH|\WENG\W)|EMULATED|(?:CP\W)?REPACK|Proper|RELOADED|CODEX|Razor|Black Box|ALiAS|FLT|WaLMaRT|PLAZA|KaOs|RiTUEL|SKIDROW|FINAL|AMPED|MACOSX|FULL|3DM|UNLOCKED|P2P|\d(?:[.,]\d+)?GB|[|])(?:\s?[\])])?.*$)/i,
            "console":      /^((?:[|\[({]?\s*(?:\w{2,5}(?:\.\w{2,3})?(?:\s?[\+|\/\-\s]+\s?(?:\w{2,5}(?:\.\w{2,3})?\s*|\d+|\+))*\+?(?=[|\])}])[|\])}](?!\]))\s*)*(?:(?:\w{2,5}(?:\.\w{2,3})?|\d+)\s*[|\])}])?)(.{3,}?)()((?:[\[(]\s?)?(?:\((?:19|20)\d{2}\)|(?:RF[.\s]?)?XBOX\s?360|(?:RF[.\s]?)?XBOX|360|X(?:BOX)?\s?ONE|PSP|PSX|PS1|PS2|PS3|PS4|PSN|\W[3n]\s?DS|\WDS|SNES|WII|WIIU|GAMECUBE|NTSC|PAL|USA|EUR|EU|MULTi11|REPACK|DLC|\WHD|PROPER|Ultimate\W(?:\w+\b\W)?Edition|Complete Edition|GOTY|GAME.OF.THE.YEAR|\d(?:[.,]\d+)?GB)(?!\w)(?:\s?[\])])?.*$)/i,
            "console_type": /(?:XBOX\s?360|XBOX|XONE|PSP|PS2|PS3|PS4|3\s?DS|DS|WII|WIIU|GAMECUBE)/i,
            "apps":         /^((?:[|\[({]?\s*(?:\w{2,5}(?:\.\w{2,3})?(?:\s?[\+|\/\-\s]+\s?(?:\w{2,5}(?:\.\w{2,3})?\s*|\d+|\+))*\+?(?=[|\])}])[|\])}](?!\]))\s*)*(?:(?:\w{2,5}(?:\.\w{2,3})?|\d+)\s*[|\])}])?)(.*?)()((?:(?:V?\d+\.(?:\d+\.?[a-z]?)+)?\W(?:V|PATCH|BUILD|UPDATE|ALPHA|BETA)\W?\V?[(\[]?(?:\d+\.?)|\d+\.(?:\d+\.?[a-z]?)+|Multilanguage|untouched|32\W64\W?bit|(?:64|32)b(?:it)?|WIN\W?(?:64|32)|WIN64\W32|WIN32\W64|x86|x64|[(\[]).*$)/i,
            "default":      /^((?:[|\[({]?\s*(?:\w{2,5}(?:\.\w{2,3})?(?:\s?[\+|\/\-\s]+\s?(?:\w{2,5}(?:\.\w{2,3})?\s*|\d+|\+))*\+?(?=[|\])}])[|\])}](?!\]))\s*)*(?:(?:\w{2,5}(?:\.\w{2,3})?|\d+)\s*[|\])}])?)(.*$)()()/i
        },
        addCSS 			= 	".userDescription{float: right;text-align: right;color: #536482;margin: 2px 7px 2px 0;word-spacing: -2px;}\n" +
        ".generalDescription{display:" + (settings.description ? 'block' : 'none') + ";margin-top: 2px;}\n" +
        ".hosts {margin: 3px 0 3px 0;}\n"+
        ".season,.episode,.genInfo{font-weight:bold;font-size: 9px;}\n" +
        ".tvDescription{margin-left:5px;}\n" +
        //".list-rows .pagination{position: absolute!important;}\n" +
        ".fileHost {margin-right: " + settings.iconMargin + "px;visibility:"+ (settings.hostIcon ? 'visible' : 'hidden')  +"}" +
        ".altHost  {display: inline-block;text-align: center;font-weight: bold; overflow: hidden;background-image: url(https://i.postimg.cc/Rhb2XTCL/Not_Listed-2.png);background-size: cover;}\n" +
        ".list-rows .rating,.list-rows .genre {color: #536482;font-weight: bold;font-family: 'Lucida Grande', Verdana, Helvetica, Arial, sans-serif;  border-bottom: 1px #E3E9F0 solid;border-right: 1px #E3E9F0 solid;  text-align: center;background-color: #EDF1F5;  vertical-align: middle;font-size: 10px;}\n" +
        ".rating{width:6%}\n" +
        ".ratVal{font-size:larger;display:none}\n" +
        ".ratVotes{font-weight: normal;display:none;}\n" +
        ".genre {width:15%;word-spacing: -3px}" +
        ".genre a{display:none;}\n" +
        ".topicrow:hover .rating,.topicrow:hover .genre{background-color: #F4F6F9;}\n"+
        ".TAG{font-weight:normal;font-size: 9px;}\n"+
        ".IMDB{display: inline-flex;position:relative;text-align: left;}\n"+
        "table.IMDBinfo {box-shadow: 0.3em 0.4em 0.6em 0.3em rgba(0,0,0,0.12);margin: 0!important;border-collapse: collapse;border-spacing: 0;color: darkslategray;-webkit-border-bottom-right-radius:0.83em;border-bottom-right-radius:0.83em;background: rgba(250,250,250,0.93);} \n"+
        "table.IMDBinfo tbody{margin: 0!important;}\n"+
        "#WBB{position: relative;overflow: hidden;width: 100%; border: 1px solid rgb(170, 170, 170); margin: 10px 0px; height: 30px; border-radius: 5px; background: linear-gradient(rgb(255, 255, 255) 20%, rgb(238, 238, 238))}\n"+
        "#WBB #titlebar{height: 30px;border-bottom-width: 1px; border-bottom-color: rgb(170, 170, 170); border-bottom-style: solid; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;background: linear-gradient(rgb(255, 255, 255) 20%, rgb(238, 238, 238));}\n"+
        "#WBB .expand{font-size: large;line-height: 30px;margin: 0 5px 0 0;border-right: 1px #AAA solid;height: 30px;width: 33px;display: inline-block;cursor: pointer;text-align: center;}\n"+
        "#WBB .title{line-height: 30px;font-weight: bold;}\n"+
        "#fullScreen {    width: 100%;background-color: rgba(0,0,0,0.9);position: fixed;top: 0px;bottom: 0px;opacity:0;}\n"+
        ".IMDBinfo td{padding:0;}\n"+
        ".IMDBinfo td>div{padding-left:15px;}\n"+
        ".IMDBinfo td>div a:first-of-type{margin-left: 20px;}\n"+
        ".IMDBinfo #left td{background: black;box-shadow:0.42em 0 0.83em 0.08em rgba(0,0,0,0.3);padding: 0;}\n"+
        ".IMDBinfo #left img {width:25.8em;height:38.3em;border:0.20em solid black;}\n"+
        ".IMDBinfo #top{position: relative!important;vertical-align: top;height:10.83em;border-top: 0.10em solid rgba(0,0,0,0.1);}\n"+
        ".IMDBinfo #name {font-size:1.67em;font-weight: bold;margin-top:0.6em;margin-bottom:0.17em;}\n"+
        ".IMDBinfo #title {font-size:small}\n"+
        ".IMDBinfo #year {margin-left: 5px;font-size:small}\n"+
        ".IMDBinfo #type,#contentRating{display: inline;margin-right: -0.83em;}\n"+
        ".IMDBinfo #contentRating>span,#type>span{border:0.10em solid darkgray;-webkit-border-radius:0.33em;border-radius: 0.33em;padding-left:0.33em;padding-right:0.33em;font-size:0.92em;font-weight: bold;color: darkgray;}\n"+
        ".IMDBinfo #duration, #datePublished  {display: inline;font-weight: bold;font-size:xx-small;margin-right: -15px;}\n"+
        ".IMDBinfo #genre {font-weight: bolder;margin-top:0.42em;}\n"+
        ".IMDBinfo #ratings {margin-top:0.42em;}\n"+
        ".IMDBinfo #rating {position: relative;color:#264040    !important;display: inline-block;margin-left:1.25em;}\n"+
        ".IMDBinfo #ratingValue{display: inline-block;font-weight: bold;font-size: x-large;}\n"+
        ".IMDBinfo #bestRating{display: inline-block;font-weight: normal;font-size: small;}\n"+
        ".IMDBinfo #ratingCount{display: block;font-size: smaller;}\n"+
        ".IMDBinfo #ratingCount>span{display: inline-block;font-weight: bold;}\n"+
        ".IMDBinfo #rStars{width:33.3em;height:3.3em;}\n"+
        ".IMDBinfo #main td{position: relative;vertical-align: text-top;}\n"+
        ".IMDBinfo #description{font-weight: normal;padding:0em 0.83em 0em 1.25em;margin-bottom:0.42em;font-size:1.08em;width:37.49em;text-align: left;}\n"+
        ".IMDBinfo p{font: inherit;}\n" +
        ".IMDBinfo #description .firstLetter{font-size:2.50em;font-weight:bold;font-family: serif;line-height: 0;}\n"+
        ".IMDBinfo h4{margin-top:0.42em;margin-bottom:0.42em;}\n"+
        ".IMDBinfo a:link{text-decoration: none; color: #6A5ACD;}\n"+
        ".IMDBinfo #actors a{display:inline-block;margin-right:2.08em;margin-bottom:2.50em;text-align:center;max-width:120px;position: relative;display: block;}\n"+
        ".IMDBinfo #actorsRow{display: flex;justify-content: space-around;/*padding-right: 2.50em; */}\n"+
        ".IMDBinfo #profielpic {display:block;height:7.33em;width:5.33em;left:0;right:0;border:0.10em solid rgba(0,0,0,0.5);margin-left: auto;margin-right: auto;margin-bottom: 0.3em;}\n"+
        ".IMDBinfo #description a,.IMDBinfo [class*=more],.IMDBinfo [href*=fullcredits],.IMDBinfo .ghost{display: none;}\n"+
        ".IMDBinfo #trailer{position: relative;display: none;padding-left:0;width:100%;height:100%;background-color:black;z-index: 0;-webkit-border-bottom-right-radius:0.83em;border-bottom-right-radius:0.83em;}\n"+
        ".IMDBinfo #trailer iframe{display: none;width:100%;height: 100%;position: relative;}\n"+
        ".IMDBinfo #director a ~ span{font-weight: bold;font-size: xx-small;} \n"+
        ".IMDBinfo #creator a ~ span{font-weight: bold;font-size: xx-small;} \n"+
        ".IMDBLink{height:1.67em;margin: 01.00em 02.50em;border:0.08em solid #000000;background:linear-gradient(#6A9FA8, #0E5567);color:#FFFFFF;}\n"+
        ".IMDBsettings#background{position:fixed;width:100%;height:100%;top:0;background:rgba(0,0,0,0.4)}\n"+
        ".IMDBsettings #settings{width:33.33em;height:33.33em; background: #eee;position: absolute;top: 50%;left: 50%;margin-left: 16.67em;margin-top: 16.67em;border:0.08em solid black;padding:1.67em}\n"+
        ".IMDBsettings h1{font-size:1.5em;}\n"+
        ".IMDB .TABNAV #showInfo li{ background-image: linear-gradient(to right,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.3) 50%,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.0) 100%),url(" + info + ")}\n"+
        ".IMDB .TABNAV #playTrailer li{background-image: linear-gradient(to right,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.3) 50%,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.0) 100%),url(" + play + ")}"+
        ".IMDB .TABNAV .tabslist{width: 3.33em;height: 10.83em;}\n"+
        ".TABNAV , .tabslist{top: 0;height:240px;right: 0;padding: 0!important;margin:0!important;}\n"+
        ".TABNAV  .tabslist {-moz-box-flex: 0;-webkit-box-flex: 0;width: auto;height: 25px;display: flex;max-height:10.83em;flex-direction: row;}\n"+
        ".TABNAV  .tabslist.row{flex-direction: row;}\n"+
        ".TABNAV  .tabslist.column{flex-direction: column;}\n"+
        ".TABNAV .navbar{display: -webkit-box;-webkit-box-orient: horizontal;display: -moz-box;-moz-box-orient: horizontal;}\n"+
        ".TABNAV .tabslist.row .tab{display: flex;height:100%;background: linear-gradient(rgba(240,240,240,0.8) 0%,rgba(235,235,235,0.6) 50%,rgba(225,225,225,0.6) 51%,rgba(230,230,230,0.8) 100%);}\n"+
        ".TABNAV .tabslist.column .tab{display: flex;height:100%;background: linear-gradient(to right, rgba(240,240,240,0.8) 0%,rgba(235,235,235,0.6) 50%,rgba(225,225,225,0.6) 51%,rgba(230,230,230,0.8) 100%);}\n"+
        ".TABNAV .tabslist.row .pressed{background:linear-gradient(rgba(235,235,235,0.6) 0%,rgba(225,225,225,0.8) 50%,rgba(210,210,210,0.8) 51%,rgba(235,235,235,0.6) 100%)!important;}\n"+
        ".TABNAV .tabslist.column .pressed{background:linear-gradient(to right, rgba(235,235,235,0.6) 0%,rgba(225,225,225,0.8) 50%,rgba(210,210,210,0.8) 51%,rgba(235,235,235,0.6) 100%)!important;}\n"+
        ".TABNAV .tabslist.row .active{background: linear-gradient(rgba(255,255,255,1) 0%,rgba(231,231,231,0.8) 50%,rgba(215,215,215,0.8) 51%,rgba(246,246,246,1) 100%)!important;}\n"+
        ".TABNAV .tabslist.column .active{background: linear-gradient(to right, rgba(255,255,255,1) 0%,rgba(231,231,231,0.8) 50%,rgba(215,215,215,0.8) 51%,rgba(246,246,246,1) 100%)!important;}\n"+
        ".TABNAV :not(.active).tab{border-bottom: 1px solid rgba(0,0,0,0.3);border-left: 0.10em solid rgba(0,0,0,0.1);}\n"+
        ".TABNAV :not(.active).tab .tabPage{visibility: hidden;}\n"+
        ".TABNAV .active.tab .tabPage{visibility: visible;}\n"+
        ".TABNAV .tabslist.row :not(.active):not(.pressed).tab:hover{background: linear-gradient(rgba(255,255,255,1) 0%,rgba(241,241,241,1) 42%,rgba(225,225,225,1) 51%,rgba(246,246,246,1) 100%);cursor:pointer;}\n"+
        ".TABNAV .tabslist.column :not(.active):not(.pressed).tab:hover{background: linear-gradient(to right, rgba(255,255,255,1) 0%,rgba(241,241,241,1) 42%,rgba(225,225,225,1) 51%,rgba(246,246,246,1) 100%);cursor:pointer;}\n"+
        ".TABNAV .active>li{box-shadow: 0.25em 0.10em 0.33em 0 rgba(0,0,0,0.1);}\n"+
        ".TABNAV .tabslist>.tab>li{padding-left: 10px;padding-right: 10px;line-height: 25px;position: relative;width: 100%;border-right: 0.10em solid rgba(0,0,0,0.3);list-style: none!important;border-top: 0.10em solid rgba(0,0,0,0.1);background-repeat:no-repeat;background-position:center;}\n"+
        ".TABNAV .space{-moz-box-flex: 1;-webkit-box-flex: 1;box-shadow: inset 0px -1px 2px rgba(0,0,0,0.1);border-bottom: 1px solid rgba(0,0,0,0.3);}\n"+
        ".TABNAV .tabPage {left: 0;right: 0;top: 57px;height: 210px;position: absolute;}\n"+
        ".TABNAV .tabPage>ul {margin-left: 20px;margin-top: 10px;}\n"+
        ".TABNAV .tabPage>ul>li {margin-top: 13px}\n"+
        ".TABNAV .tabPage>button{margin-left: 20px;position: absolute;bottom: 10px;}\n"+
        ".TABNAV .tabPage label{display: inline-block;width: 155px;}\n"+
        "#save {position: relative;left: 20px;}\n";
    $.fn.appendText = function(text) {
        return this.each(function() {
            var textNode = document.createTextNode(text);
            $(this).append(textNode);
        });
    };
    $.fn.prependText = function(text) {
        return this.each(function() {
            var textNode = document.createTextNode(text);
            $(this).prepend(textNode);
        });
    };
    $.expr[":"].containsI = $.expr.createPseudo(function(arg) {
        return function( elem ) {
            return $(elem).text().trim().toUpperCase()
                .indexOf(arg.trim().toUpperCase()) >= 0;
        };
    });
    $.expr[":"].containsX = $.expr.createPseudo(function(arg) {
        return function( elem ) {
            return $(elem).text().trim()
                .replace(/\s\([IVX]+\)\s/," ")
                .replace(/\sII(?:\s|:|$)/g,"2")
                .replace(/\sIII(?:\s|:|$)/g,"3")
                .replace(/\sIV(?:\s|:|$)/g,"4")
                .replace(/\sV(?:\s|:|$)/g,"5")
                .replace(/\sVI(?:\s|:|$)/g,"6")
                .replace(/\sVII(?:\s|:|$)/g,"7")
                .replace(/\sIIX(?:\s|:|$)/g,"8")
                .replace(/\sIX(?:\s|:|$)/g,"9")
                .replace(/\sX(?:\s|:|$)/g,"10")
                .replace(/the\b|part(?=\s?\d)/ig,"")
                .replace(/and/ig,"&")
                .replace(/(\W)@(\W)/ig,"$1AT$2")
                .replace(/(\w)@(\w)/ig,"$1A$2")
                .replace(/[Ã¤Ã Ã¢]/ig,"A")
                .replace(/Ã§/ig,"C")
                .replace(/[Ã©Ã¨Ã«Ãª]/ig,"E")
                .replace(/\W/g,"")
                .toUpperCase()
                .indexOf(arg.trim().replace(/\sII(?:\s|:|$)/g,"2")
                         .replace(/\sIII(?:\s|:|$)/g,"3")
                         .replace(/\sIV(?:\s|:|$)/g,"4")
                         .replace(/\sV(?:\s|:|$)/g,"5")
                         .replace(/\sVI(?:\s|:|$)/g,"6")
                         .replace(/\sVII(?:\s|:|$)/g,"7")
                         .replace(/\sIIX(?:\s|:|$)/g,"8")
                         .replace(/\sIX(?:\s|:|$)/g,"9")
                         .replace(/\sX(?:\s|:|$)/g,"10")
                         .replace(/the\b|part(?=\s?\d)|p(?=\d)|3d/ig,"")
                         .replace(/and/ig,"&")
                         .replace(/(\W)@(\W)/ig,"$1AT$2")
                         .replace(/(\w)@(\w)/ig,"$1A$2")
                         .replace(/[Ã¤Ã Ã¢]/ig,"A")
                         .replace(/Ã§/ig,"C")
                         .replace(/[Ã©Ã¨Ã«Ãª]/ig,"E")
                         .replace(/\W/g,"")
                         .toUpperCase()) >= 0;
        };
    });
    GM_addStyle(addCSS);
    if(document.URL.search(/viewforum.php\?f=4(?:&|$)/) > 0)	forumSection  = 'movies';
    if(document.URL.search(/viewforum.php\?f=57(?:&|$)/) > 0)	forumSection  = 'tv';
    if(document.URL.search(/viewforum.php\?f=5(?:&|$)/) > 0)	forumSection  = 'games';
    if(document.URL.search(/viewforum.php\?f=28(?:&|$)/) > 0)	forumSection  = 'console';
    if(document.URL.search(/viewforum.php\?f=3(?:&|$)/) > 0)	forumSection  = 'apps';
    if(!forumSection)											forumSection  = 'default';
    getJSON("http://pastebin.com/raw.php?i=yCwfr43g",init);
    //THIS IS TO SEE HOW MANY USERS INTALLED THE SCRIPT
    (function(){
        var FR = GM_getValue("WBB-CU-FirstRun",1);
        if(FR === 1 ){
            GM_xmlhttpRequest({
                method: "GET",
                url: "http://pastebin.com/raw.php?i=HnumG4Qs",
                onload: function(response) {
                    if(response.responseText === "Dummie"){
                        GM_setValue("WBB-CU-FirstRun",0);
                    }
                }
            });
        }
    })();
    //THIS IS FOR GETTING THE IMDB INFORMATION FOR MOVIE AND TV SHOWS
    var IMDb = {
        search: function(arg){
            var argType = typeof arg;
            if((argType != "object" && argType != "string") || (argType=== "object" && typeof arg.title === "undefined")){
                console.log("IMDB_SEARCH: Illegal arguments",arg);
                return;
            }
            if(argType === "string"){
                var str = arg.trim().match(/(.+?)\(?((?:19|20)\d\d)?\)?$/);
                arg = {};
                arg.title = str[1];
                arg.year  = str[2];
            }
            arg.year     = (typeof arg.year === "undefined")     ? ""                                 : arg.year;
            arg.type     = (typeof arg.type === "undefined")     ? "movies"                           : arg.type;
            arg.node     = (typeof arg.node === "undefined")     ? ""                                 : arg.node;
            arg.callback = (typeof arg.callback === "undefined") ? function(info){console.log(info);} : arg.callback;
            arg.retry    = (typeof arg.retry === "undefined")    ? false                              : arg.retry;
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.imdb.com/find?ref_=nv_sr_fn&s=all&q=" + encodeURIComponent(arg.title + arg.year) + ((arg.type === "tv")? "&ttype=tv":"&s=tt&ttype=ft&ref_=fn_ft"),
                headers: standerdHeaders,
                onload: function(response) {
                    if (response.status == 200) {
                        if(debug) console.log("IMDb.search",response.finalUrl);
                        if (!/<a name="tt"><\/a>[\w\W]+?<\/table>/i.test(response.responseText)) {
                            if (/No results found for/.test(response.responseText)) {
                                console.log("IMDB_Search: No result found for:", arg.title, arg.year);
                            } else {
                                console.log("IMDB_Search: A unknown error has occured:", arg.title, arg.year);
                            }
                            return;
                        }
                        var responseData = response.responseText.match(/<a name="tt"><\/a>[\w\W]+?<\/table>/i)[0]
                        .replace(/(<img[\w\W]+?src=)"[^"]+"/g, '$1""'),
                            selector = {
                                "movies" :'.findResult:containsX("' + arg.title + '"):not(:containsI("(video game)"),:containsI("(tv episode)"),:containsI("(tv series)"),:containsI("(tv mini-series)"),:containsI("(short)"))',
                                "tv":'.findResult:containsX("' + arg.title + '"):containsI("(TV Series)"),.findResult:containsX("' + arg.title + '"):containsI("(tv series)"),.findResult:containsX("' + arg.title + '"):containsI("(tv mini-series)")',
                                "game": '.findResult:containsX("' + arg.title + '"):containsI("(Video Game)")'
                            },
                            result,
                            results = $(selector[arg.type], responseData);
                        if (results.length > 0) {
                            if (results.length > 1) {
                                if (arg.year) {
                                    if (results.find(":contains('" + arg.year + "')").length === 0) {
                                        if (results.find(":contains('" + (parseInt(arg.year) - 1) + "')").length === 0) {
                                            results = results.find(":contains('" + (parseInt(arg.year) + 1) + "')");
                                        }else{
                                            results = results.find(":contains('" + (parseInt(arg.year) - 1).toString() + "')");
                                        }
                                    } else {
                                        results = results.find(":contains('" + arg.year + "')");
                                    }
                                }
                                if (results.length > 0) {
                                    $('small',results[0]).remove();
                                    result = $(results[0]).find("a").attr("href").match(/tt\d+/)[0];
                                    IMDb.info({id:result, node:arg.node, callback:arg.callback});
                                } else {
                                    console.log("IMDB_Search: ", "Found no match with the given query and year:", arg.title, arg.year);
                                }
                            } else {
                                $('small',results[0]).remove();
                                result = $(results[0]).find("a").attr("href").match(/tt\d+/)[0];
                                IMDb.info({id:result, node:arg.node, callback:arg.callback});
                            }
                        } else {
                            if ($('.findResult', responseData).length === 1) {
                                results = $('.findResult', responseData);
                                $('small',results[0]).remove();
                                result = $(results[0]).find("a").attr("href").match(/tt\d+/)[0];
                                IMDb.info({id:result, node:arg.node, callback:arg.callback});
                            } else {
                                if(arg.type === 'movies' && arg.retry === false && /[\[(][^\])]+[\])]/.test(arg.title)){
                                    IMDb.search({title:title.replace(/[\[(][^\])]+[\])]/,""), year:arg.year, node:arg.node, callback:arg.callback, retry:true});
                                }else{
                                    console.log("IMDB_Search: ", "Found no match with the given query:", arg.title, arg.year);
                                }
                            }
                        }
                    } else {
                        console.log(response.status + " " + response.statusText);
                    }
                }
            });
        },
        info: function(arg){
            var argType = typeof arg;
            if((argType != "object" && argType != "string") || (argType=== "object" && typeof arg.id === "undefined") || (argType === "string" && !(/^tt\d+$/.test(arg.trim())))){
                console.log("IMDB_INFO: Illegal arguments",arg);
                return;
            }
            if(argType === "string"){
                if(!/tt\d+/.test(arg)) return;
                arg = {id:arg.match(/tt\d+/)[0]};
            }
            if(!/tt\d+/.test(arg.id)) return;
            arg.id 	  	 = arg.id.match(/tt\d+/i)[0];
            arg.node     = (typeof arg.node === "undefined")     ? ""                                 : arg.node;
            arg.callback = (typeof arg.callback === "undefined") ? function(info){console.log(info);} : arg.callback;
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.imdb.com/title/" + arg.id,
                headers: standerdHeaders,
                onload: function(response) {
                    if (response.status == 200) {
                        if(debug) console.log("IMDb.info",response.finalUrl);
                        if(/\/combined$/.test(response.finalUrl)){
                            console.log('Please disable the setting "Always display full cast and crew credits" in your account.');
                            return;
                        }
                        if(!/<div id="title-overview-widget"[^>]+>[\w\W]+?<\/div>\W+?(?=<script>)/i.test(response.responseText)){
                            console.log('IMDb_GetInfo: ','Unknown error occurred.');
                            return;
                        }
                        var fullResponse = response.responseText.replace(/(<img[\w\W]+?src)=("https?:\/\/[^"]+")/g, '$1New=$2'),
                            responseData = fullResponse.match(/<div id="title-overview-widget"[^>]+>[\w\W]+?<\/div>\W+?(?=<script>)/i)[0],
                            IMDBJSON     = $.parseJSON(fullResponse.match(/<script type="application\/ld\+json">[^<]+/i)[0].replace('<script type="application/ld+json">',"")),
                            Info = {
                                "Title":  	     $('.title_wrapper h1',responseData).text().trim().replace(/\s?\((?:19|20)\d\d\)$/,"") ,
                                "Year":		     $('.header .nobr,#titleYear,[title="See more release dates"]',responseData)[0].textContent.trim().replace(/^.*\(|\)/g,""),
                                "ID":     	     arg.id,
                                "Rating": 	     typeof IMDBJSON.aggregateRating == 'undefined' ? '' : IMDBJSON.aggregateRating.ratingValue,
                                "ratingCount":   typeof IMDBJSON.aggregateRating == 'undefined' ? '' : IMDBJSON.aggregateRating.ratingCount,
                                "contentRating": typeof IMDBJSON.contentRating   == 'undefined' ? '' : IMDBJSON.contentRating,
                                "Duration":		 typeof IMDBJSON.duration        == 'undefined' ? '' : IMDBJSON.duration.replace(/PT(\d+)H(\d+)M/,'$1h $2min'),
                                "releaseDate":	 $('[title*="release dates"]', responseData).text().trim(),
                                "Genre":  	     typeof IMDBJSON.genre           == 'undefined' ? '' : IMDBJSON.genre.constructor()  == "" ? IMDBJSON.genre : IMDBJSON.genre.join(" | "),
                                "URL":    	     "http://www.imdb.com/title/" + arg.id,
                                "Poster": 	     IMDBJSON.image,
                                "Trailer":	     typeof IMDBJSON.trailer         == 'undefined' ? '' : "https://www.imdb.com" + IMDBJSON.trailer.embedUrl,
                                "InWatchList":   null,
                                "InLists":	     null,
                                "Description":   typeof IMDBJSON.description     == 'undefined' ? '' : IMDBJSON.description,
                                "Stars":	     typeof IMDBJSON.actor           == 'undefined' ? '' : !Array.isArray(IMDBJSON.actor) ? [IMDBJSON.actor] : IMDBJSON.actor,
                                "Director": 	 [],
                                "Creator":		 []
                            },
                            director = 	$('[itemprop="director"] a', responseData).has('[itemprop="name"]'),
                            creator	 =	$('[itemprop="creator"] a', responseData).has('[itemprop="name"]'),
                            logged 	 = 	/nblogout/.test(response.responseText);
                        Info.Stars.forEach(function(star){
                            if(star['@type'] = "Person"){
                                var img = $("img[alt=" + '"' + star.name + '"' + "]",fullResponse);
                                star.Image = typeof(img.attr("loadlate")) === 'undefined' ? img.attr("srcNew") : img.attr("loadlate");
                            }
                        });
                        director.each(function(){
                            Info.Director.push({
                                "Name": $('[itemprop="name"]',this).text(),
                                "URL":	'https://www.imdb.com' + $(this).attr('href'),
                            });
                        });
                        creator.each(function(){
                            Info.Creator.push({
                                "Name": $('[itemprop="name"]',this).text(),
                                "Type": this.nextSibling.nodeType === 3 ? this.nextSibling.textContent.replace(/\((.+)\)\W*$/,'$1').replace(',','').trim(): '',
                                "URL":	'https://www.imdb.com' + $(this).attr('href'),
                            });
                        });
                        if(logged){
                            GM_xmlhttpRequest({
                                method:  "POST",
                                url:     "https://www.imdb.com/list/_ajax/watchlist_has",
                                data:    "consts%5B%5D=" + Info.ID + "&tracking_tag=wlb-lite",
                                headers: Object.assign({"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},standerdHeaders),
                                onload:  function(response) {
                                    if(response.status == 200){
                                        if(debug) console.log("POST",response.finalUrl);
                                        var obj = JSON.parse(response.responseText.replace(/^"(.+)"$/,"'$1'"));
                                        if(obj.status === 200){
                                            if(typeof(obj.has[Info.ID]) !== "undefined"){
                                                Info.InWatchList = true;
                                            }else Info.InWatchList = false;
                                            GM_xmlhttpRequest({
                                                method:  "POST",
                                                url:     "https://www.imdb.com/list/_ajax/wlb_dropdown",
                                                data:    "tconst=" + Info.ID,
                                                headers:    {
                                                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                                                },
                                                onload:  function(response) {
                                                    if(response.status == 200){
                                                        var obj = JSON.parse(response.responseText);
                                                        if(obj.status === 200){
                                                            obj.items.forEach(function(item){
                                                                if(item.data_list_item_ids !== null){
                                                                    if(Info.InLists === null) Info.InLists = [];
                                                                    if(item.data_list_item_ids.length != 0){
                                                                        Info.InLists.push(item.data_list_id);
                                                                    }
                                                                }
                                                            });
                                                            arg.callback(Info,arg.node);
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    }
                                }
                            });
                        }else{
                            arg.callback(Info,arg.node);
                        }
                    }
                }
            });
        },
        inLists: function(arg){
            if(typeof arg === "string" && /^tt\d+$/.test(arg.trim())){
                arg = {id:arg};
            }
            arg.node     = (typeof arg.node === "undefined")     ? ""                                  : arg.node;
            arg.callback = (typeof arg.callback === "undefined") ? function(info){console.log(info);}  : arg.callback;
            GM_xmlhttpRequest({
                method:  "POST",
                url:     "https://www.imdb.com/list/_ajax/watchlist_has",
                data:    "consts%5B%5D=" + arg.id + "&tracking_tag=wlb-lite",
                headers: Object.assign({"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},standerdHeaders),
                onload:  function(response) {
                    if(response.status == 200){
                        if(debug) console.log("IMDb.inLists (watchlist)",response.finalUrl);
                        var obj = JSON.parse(response.responseText);
                        if(obj.status === 200){
                            var Info  = {};
                            if(typeof(obj.has[arg.id]) !== "undefined"){
                                Info.InWatchList = true;
                            }else Info.InWatchList = false;
                            GM_xmlhttpRequest({
                                method:  "POST",
                                url:     "https://www.imdb.com/list/_ajax/wlb_dropdown",
                                data:    "tconst=" + arg.id,
                                headers: Object.assign({"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},standerdHeaders),
                                onload:  function(response) {
                                    if(response.status == 200){
                                        if(debug) console.log("IMDb.inLists (userlist)",response.finalUrl);
                                        var obj = JSON.parse(response.responseText);
                                        if(obj.status === 200){
                                            Info.InLists = [];
                                            obj.items.forEach(function(item){
                                                if(item.data_list_item_ids !== null){
                                                    if(item.data_list_item_ids.length != 0){
                                                        Info.InLists.push(item.data_list_id);
                                                    }
                                                }
                                            });
                                            arg.callback(Info,arg.node);
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            });
        },
        getYouTube: function(arg){
            var argType = typeof arg;
            if((argType != "object" && argType != "string") || (argType=== "object" && typeof arg.title === "undefined")){
                console.log("getYouTube: Illegal arguments",arg);
                return;
            }
            if(argType === "string"){
                var str = arg.trim().match(/(.+?)\(?((?:19|20)\d\d)?\)?$/);
                arg = {};
                arg.title = str[1];
                arg.year  = str[2];
            }
            arg.node     = (typeof arg.node     === "undefined") ? ""                                 : arg.node;
            arg.year     = (typeof arg.year     === "undefined") ? ""                                 : arg.year;
            arg.callback = (typeof arg.callback === "undefined") ? function(info){console.log(info);} : arg.callback;
            GM_xmlhttpRequest({
                method:  "GET",
                url:     "https://www.youtube.com/results?search_query=" + encodeURIComponent(arg.title + ' ' + arg.year + " HD trailer " + arg.type) + '&app=desktop',
                headers: Object.assign({"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},standerdHeaders),
                onload:  function(response) {
                    if(response.status == 200){
                        var regex = new RegExp(arg.title.replace(/&/g,"&amp;") +'.+?(?:' + arg.year + ')?' + '\/watch\\?v=([^"]+)',"im"),
                            Info  = {Trailer:""};
                        /*if(lodegged == 0){
                            console.log(regex);
                            console.log(response.responseText);
                            logged == 1;
                       } */
                        if(regex.test(response.responseText)){
                            Info.Trailer  = "https://www.youtube.com/embed/" + regex.exec(response.responseText)[1];
                            arg.callback(Info,arg.node);
                        }
                    }
                }
            });
        }
    };
    var setIMDB = function(Info,item) {
        if(debug) console.log("setIMDB");
        var title, year, data,
            inLists = function(){
                if(Info.InLists === null) Info.InLists = [];
                if(!Info.InWatchList && Info.InLists.length === 0){
                    $(".REGEX2,.REGEX3",item).css("color","");
                    return;
                }
                if(Info.InWatchList){
                    $(".REGEX2,.REGEX3",item).css("color",settings.watchListColor);
                }
                if(Info.InLists.length !== 0){
                    if(Info.InLists.lastIndexOf(settings.userList) > -1){
                        if(Info.InWatchList){
                            $(".REGEX2,.REGEX3",item).css("color",settings.joinedColor);
                        }else{
                            $(".REGEX2,.REGEX3",item).css("color",settings.userListColor);
                        }
                    }
                }
            },
            loadData = function(){
                title  = item.find(".REGEX2").text()
                    .replace(/\sn\s|&amp;/,'&')
                    .replace(/\[?(?:Unrated|Extended Cut|Extended Bootleg|Extended|Collectors|Edition|Directors Cut)\]?/ig,'');
                year   = forumSection === 'tv' ? "" : item.find(".REGEX3").text().replace(/[()]/g,"");
                title  = cleanTitle(title) + year;
                data = IMDbData[title];
            },
            saveData = function(){
                IMDbData[title] = data;
                GM_setValue('IMDbData', IMDbData);
            };
        if(Object.keys(Info).length === 2){
            loadData();
            inLists();
            if (typeof data != 'undefined'){
                data.InWatchList = Info.InWatchList;
                data.InLists     = Info.InLists;
                saveData();
            }
            return;
        }
        if(Object.keys(Info).length === 1){
            loadData();
            if (typeof data != 'undefined'){
                data.Trailer = Info.Trailer;
                saveData();
                $(".genre a", item).attr('data-info',JSON.stringify(data));
            }
            return;
        }
        if(!settings.debug){
            Info.Title = Info.Title.replace(/\s\([IVX]+\)\s/," ");
            if(forumSection === "movies"){
                $(".REGEX2",item).html(Info.Title.replace(/\((?:19|20)\d{2}\)/i,"") + " ");
            }else if(forumSection === "tv"){
                $(".REGEX2",item).html(Info.Title.replace(/\(TV Series\)/i,"").replace(/\(TV([^)]\))/i,"($1"));
            }
            if($(".REGEX3",item).html() === ''){
                $(".REGEX3",item).html(' (' + Info.Year.replace(/((?:19|20)\d{2})(?!\W(?:19|20)\d{2}).*/,'$1') + ')');
                $(".REGEX3",item).insertAfter($('.REGEX2',item));
            }
            data = jQuery('.topictitle span',item).detach();
            $('.topictitle',item).text('');
            $('.topictitle',item).append(data);
            inLists();
        }
        if(parseInt(Info.Rating) > 0 ){
            $(".rating .ratVal", item).html(Info.Rating.replace(".", ","))
                .fadeIn(1000);
            $(".rating .ratVotes", item).html(Info.ratingCount + " Votes");
        }
        $(".genre a", item).html(typeof Info.Genre == "object" ?  Info.Genre.join(" | ") : Info.Genre)
            .attr("href",Info.URL)
            .fadeIn(1000);
        $(".genre a", item).attr('data-info',JSON.stringify(Info));
        if(!Info.Trailer){
            IMDb.getYouTube({title:Info.Title, year:Info.Year.match(/^\d+/),type: forumSection,callback:setIMDB,node:item});
        }
        if(this != window){
            title  = item.find(".REGEX2").text()
                .replace(/\sn\s|&amp;/,'&')
                .replace(/\[?(?:Unrated|Extended Cut|Extended Bootleg|Extended|Collectors|Edition|Directors Cut)\]?/ig,'');
            year   =  forumSection === 'tv' ? "" : item.find(".REGEX3").text().replace(/[()]/g,"");
            title  = cleanTitle(title) + year;
            if (typeof(IMDbData[title]) === 'undefined'){
                IMDbData[title] = Info;
                GM_setValue('IMDbData', IMDbData);
            }
        }
    };
    //THIS IS FOR GETTING THE IGN INFORMATION FOR GAMES
    var IGN = function(title,platform,item){
        (function() {
            GM_xmlhttpRequest({
                method:  "GET",
                url:     "http://www.ign.com/search?type=object&objectType=game&filter=games&q=" + title ,
                onload:  function(response) {
                    if(response.status === 200){
                        if (!/<div id="search-list"[\w\W]+?<!-- Right Rail -->/i.test(response.responseText)) {
                            if (/ Your search returned no matches./.test(response.responseText)) {
                                console.log("IGN_Search: No result found for:", title);
                            } else {
                                console.log("IGN_Search: A unknown error has occured:", title);
                            }
                            console.log('IGN_Search: Retrying search on GameSpot');
                            GameSpot(title,item);
                            return;
                        }
                        var responseData = response.responseText.match(/<div id="search-list"[\w\W]+?<!-- Right Rail -->/i)[0]
                        .replace(/(<img[\w\W]+?src=)"[^"]+"/g, '$1""'),
                            result = {
                                "Title": "",
                                "URL": ""
                            },
                            results = $(".search-item-title a:containsX('" + title +"')", responseData);
                        if (results.length > 0) {
                            result.Title = $(results[0]).text().trim();
                            if(platform && $(results[0]).parents(".search-item").find(".search-item-sub-title a:containsI('>" + platform + "<'):gt(0)").length > 0){
                                results = $(results[0]).parents(".search-item").find(".search-item-sub-title a:containsI('>" + platform + "<'):gt(0)");
                            }
                            result.URL =  $(results[0]).attr("href");
                            GetInfo(result,item);
                        }else{
                            console.log("IGN_Search: Found no match with the given query: ", title);
                            console.log('IGN_Search: Retrying search on GameSpot');
                            GameSpot(title,item);
                        }
                    }
                }
            });
        })();

        var GetInfo = function(result, item) {
            GM_xmlhttpRequest({
                method: "GET",
                url: result.URL,
                onload: function(response) {
                    if (response.status == 200) {
                        var responseData = response.responseText//.match(/<div id="object-stats-wrap"[\w\W]+?<\/div>\W+(?:<\/aside>)/i)[0]
                        .replace(/(<img[\w\W]+?src=)"[^"]+"/g, '$1""'),
                            year = $('.gameInfo-list div:contains("Date")',responseData).text().match(/\d{4}/),
                            Info = {
                                "Title":  result.Title + ((year === null) ? "" : " (" + year[0] + ")"),
                                "Rating": "",
                                "Count":  "",
                                "Genre":  "",
                                "URL":    result.URL,
                            };
                        if($('.communityRating .ratingValue',responseData).length > 0 ) {
                            Info.Rating = $(".communityRating .ratingValue",responseData)
                                .text()
                                .trim()
                                .replace('-.-','N/A');
                        }
                        if($('.communityRating .ratingCount',responseData).length > 0 ){
                            Info.Count = $(".communityRating .ratingCount",responseData)
                                .text()
                                .trim()
                                .match(/\d+/)[0];
                        }
                        if($(".gameInfo-list [href^='/games/editors-choice?genre=']",responseData).length > 0 ){
                            Info.Genre = $('.gameInfo-list div:contains("Genre")',responseData)
                                .text()
                                .replace(/\n|genre:|\s{2,}/ig," ")
                                .trim();
                        }
                        setIGN(Info, item);
                    }
                }
            });
        };
        var setIGN = function(Info, item) {
            if(!settings.debug){
                $(".REGEX2",item).html(Info.Title);
            }
            if(parseInt(Info.Rating) > 0 ){
                $(".rating .ratVal", item).html(Info.Rating.replace(".", ","))
                    .fadeIn(1000);
                $(".rating .ratVotes", item).html(Info.Count + " Votes");
            }
            $(".genre a", item).html(Info.Genre)
                .attr("href",Info.URL)
                .fadeIn(1000);
            $(".genre", item).css("word-spacing","0px");
        };
    };
    //THIS IS FOR GETTING THE GAMESPOT INFORMATION FOR GAMES
    var GameSpot = function(title,item){-
        (function() {
        GM_xmlhttpRequest({
            method:  "GET",
            url:     "http://www.gamespot.com/search/?indices%5B0%5D=game&q=" + title,
            onload:  function(response) {
                if(response.status === 200){
                    if (!/<ul class="search-results[\w\W]+?<\/ul>/i.test(response.responseText)) {
                        if (/We couldn't find what you are looking for.  Care to try again?/.test(response.responseText)) {
                            console.log("GameSpot_Search: No result found for:", title);
                        } else {
                            console.log("GameSpot_Search: A unknown error has occured:", title);
                        }
                        return;
                    }
                    var responseData = response.responseText.match(/<ul class="search-results[\w\W]+?<\/ul>/i)[0]
                    .replace(/(<img[\w\W]+?src=\W?)"[^"]+"/g, '$1""'),
                        result = {
                            "Title": "",
                            "URL": ""
                        },
                        results = $(".media a:containsX(" + title +")", responseData);
                    console.log("GS_INIT: ",title,item);
                    if (results.length > 0) {
                        result.Title = $(results[0]).text().trim();
                        result.URL = "http://www.gamespot.com" + $(results[0]).attr("href");
                        GetInfo(result,item);
                    }else{
                        console.log("GameSpot_Search: ", "Found no match with the given query:", title);
                    }
                }
            }
        });
    })();

                                        var GetInfo = function(result, item) {
                                            GM_xmlhttpRequest({
                                                method: "GET",
                                                url: result.URL,
                                                onload: function(response) {
                                                    if (response.status == 200) {
                                                        var responseData = response.responseText.match(/<div id="object-stats-wrap"[\w\W]+?<\/div>\W+(?:<\/aside>)/i)[0]
                                                        .replace(/(<img[\w\W]+?src=\W?)"[^"]+"/g, '$1""'),
                                                            year = $('.pod-objectStats-info__release',responseData).text().match(/\d{4}/),
                                                            Info = {
                                                                "Title":  result.Title + ((year === null) ? "" : " (" + year[0] + ")"),
                                                                "Rating": "",
                                                                "Count":  "",
                                                                "Genre":  "",
                                                                "URL":    result.URL,
                                                            };
                                                        console.log("GS_GetInfo: ",result,item);
                                                        Info.Rating = $(".breakdown-reviewScores__userAvg a",responseData).text().replace('0','');
                                                        Info.Count = $(".breakdown-reviewScores__userAvg dd",responseData).text().match(/\d+/)[0].replace('0','');
                                                        $(".pod-objectStats-additional [href^='/genre/']",responseData).each(function() {
                                                            if (Info.Genre !== "") {
                                                                Info.Genre += " | ";
                                                            }
                                                            Info.Genre += $(this).text();
                                                        });
                                                        setGameSpot(Info, item);
                                                    }
                                                }
                                            });
                                        };
                                        var setGameSpot = function(Info, item) {
                                            if(!settings.debug){
                                                $(".REGEX2",item).html(Info.Title);
                                            }
                                            console.log("GS_setGameSpot: ",Info,item);
                                            if(parseInt(Info.Rating) > 0 ){
                                                $(".rating .ratVal", item).html(Info.Rating.replace(".", ","))
                                                    .fadeIn(1000);
                                                $(".rating .ratVotes", item).html(Info.Count + " Votes");
                                            }
                                            $(".genre a", item).html(Info.Genre)
                                                .attr("href",Info.URL)
                                                .fadeIn(1000);
                                        };
                                       } ;
    //IS CALLED AFTER GETTING THE HOSTS DATA
    function init(data){
        console.log("WBB-CU:","init");
        fileHosts = data;
        if(forumSection === "movies" || forumSection === "tv" || forumSection === "console"  || forumSection === "games") reformat();
        loadSettings();
        cleanTopicTitels($(".cat-row:last ~ .list-rows a.topictitle,.search-view ~ .list-wrap .list-rows .topictitle > a:last-child,.topiclist.topics:last .row dt a.topictitle,.forumline:eq(0) tr:gt(-51) a.topictitle"));
    }
    //IF WHE ARE IN THE MOVIES OR TV SHOW SECTION THEN REFORMAT THE LAYOUT TO ADD THE GENRE AND RATING
    function reformat(){
        var header = $(".list-header").clone(), timer;
        $(".short-description",header).after('<div class="rating"><span>Rating</span></div><div class="genre"><span>Genre</span></div>');
        $(".cat-row:last").css("display","none");
        $(".cat-row:last").after(header);
        $(header).before(SETTINGS_HTML);
        $(".cat-row:last ~ .list-header .short-description").css("width","49%");
        $(".cat-row:last ~ .list-header .topics,.cat-row:last ~ .list-header .views").css("width","5%");
        $(".cat-row:last ~ .list-header .last-post").css("width","10%");
        $(".cat-row:last ~ .list-rows .description").css("width","46%");
        $(".cat-row:last ~ .list-rows .topics,.cat-row:last ~ .list-rows .views").css("width","5%");
        $(".cat-row:last ~ .list-rows .last-post").css("width","10%");
        $(".cat-row:last ~ .list-rows .description").after('<div class="rating"><div class="ratVal"></div><div class="ratVotes"></div></div><div class="genre"><a target="_blank"></a></div>');
        $('.cat-row:last ~ .list-rows .topicrow').on({
            'mouseover': function () {
                timer = setTimeout(function (el) {
                    $(el).find(".ratVotes").show("slow");
                }, 300,this);
            },
            'mouseout' : function () {
                clearTimeout(timer);
                $(this).find(".ratVotes").hide("fast");
            }
        });
    }
    //START CLEANING TOPIC TITLES
    function cleanTopicTitels(list) {
        //console.log("WBB-CU:","cleanTopicTitels:");
        $(list).each(function() {
            var curr = $(this).text(),
                match,
                parent = $($(this).parents(".list-rows,tr")[0]),
                isCollection = false;
            if (isTAG($(this).prev())) {
                $(this).prev().prependTo(this);
            }
            if(forumSection === "console"){
                match = curr.match(/^((?:[\[{(](?:[\w{2,5}.]+\b[\s+|\-\/\d]*)*[\]})]\s*)+)?((?:[\[(]\s?)?(?:XBOX\s?360|XBOX|PSP|PS2|PS3|PS4|3\s?DS|DS|WII|WIIU|GAMECUBE)(?:\s?[\])])?)/i);
                if(match){
                    var con = match[2];
                    curr = curr.replace(con,"") + " " + con;
                    $(this).text(curr);
                }
            }
            $(this).attr("title", curr);
            if(forumSection === 'movies'){
                if(!/collection|movies/i.test(curr)){
                    if(RegEX[forumSection].test(curr)){
                        match = curr.match(RegEX[forumSection]);
                    }else if(forumSection !== 'default'){
                        match = curr.match(RegEX['default']);
                    }
                }else{
                    match = curr.match(RegEX['default']);
                    isCollection = true;
                }
            }else{
                if(!/collection|games|ISO'?s|ROMS/i.test(curr)){
                    if(RegEX[forumSection].test(curr)){
                        match = curr.match(RegEX[forumSection]);
                    }else if(forumSection !== 'default'){
                        match = curr.match(RegEX['default']);
                    }
                }else{
                    match = curr.match(RegEX['default']);
                    isCollection = true;
                }
            }
            if (match) {
                var colors = ["orange", "blue", "green", "darkmagenta"],
                    template = $('<span class=""></span>'),
                    rep;
                for (i = 1; i < match.length; ++i) {
                    if (typeof match[i] !== "undefined" && match[i] !== " ") {
                        template.addClass('REGEX' + i);
                        if (settings.debug) template.css({ "background-color": colors[i - 1],"color": "white"});
                        switch (i) {
                            case 2:
                                template.text((/\s/.test(match[i]) !== true) ? match[i].replace(/\./g, " ") : match[i]);
                                if(!/\s$/.test(template.text())) template.text(template.text() + " " );
                                break;
                            case 3:
                                template.text(/\((?:19|20)\d{2}(?:[-+](?:19|20)\d{2})?\)/.test(match[i]) ? match[i] : (/(?:19|20)\d{2}(?:[-+](?:19|20)\d{2})?/.test(match[i])) ? ("(" + match[i].match(/(?:19|20)\d{2}(?:[-+](?:19|20)\d{2})?/)[0] + ")") : match[i]);
                                break;
                            default:
                                template.text(match[i]);
                                break;
                        }
                        $(this).html(curr.replace(match[i].replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;"), template[0].outerHTML));
                        curr = $(this).html();
                        template = $('<span class=""></span>');
                    }
                }
                if(!/\s/.test(parent.find(".REGEX2").text().trim())){
                    var nospace = parent.find(".REGEX2");
                    nospace.text(nospace.text().replace(/\.|_/g," "));
                }
                if(!isCollection){
                    if(forumSection === "movies" || forumSection === "tv"){
                        let title  = parent.find(".REGEX2").text()
                        .replace(/\sn\s|&amp;/,'&')
                        .replace(/\[?(?:Unrated|Extended Cut|Extended Bootleg|Extended|Collectors|Edition|Directors Cut|\sU[SK]\s)\]?/ig,''),
                            year   = parent.find(".REGEX3").text().replace(/[()]/g,""),
                            clTitle = cleanTitle(title) + year;
                        if (typeof(IMDbData[clTitle]) === 'undefined'){
                            IMDb.search({title:    /\s/.test(title.trim()) ? title : title.replace(/\./g," "),
                                         year:     year, node:parent,
                                         callback: setIMDB,
                                         type: forumSection
                                        });
                        }else{
                            var data = IMDbData[clTitle];
                            setIMDB(data,parent);
                            IMDb.inLists({id:data.ID,node:parent, callback:setIMDB});
                        }
                    }else if( forumSection === "console" || forumSection === "games"){
                        let title = parent.find(".REGEX2")
                        .text().trim()
                        .replace(/\sn\s|&amp;/,'&')
                        .replace(/\[?(?:\W$)\]?/ig,''),
                            platforum;
                        if(forumSection === "console"){
                            platforum = parent.find(".REGEX4")
                                .text()
                                .match(RegEX.console_type);
                        }else{
                            platforum = "PC";
                        }
                        IGN(/\s/.test(title.trim()) ? title : title.replace(/\./g," "),platforum,parent);
                    }
                }
            }
            parent = $(this).parents(".description");
            if ($("span:first:has(br),dt:first:has(br),span.gensmall:first:has(br)", parent).length > 0) {
                var org =  $(this).attr("title");
                curr = $("span:first:has(br),dt:first:has(br),span.gensmall:first:has(br)", parent);
                curr.html(curr.html().replace(/(<br>[^<]+)/, '<span id="userDescription">$1</span>'));
                $(".title a",parent).attr("title", org + "\x0A" + $("#userDescription",curr).text());
            }
            $(parent).parents('.list-rows').css('height','60px');
            $('span:first',parent).append($('.pagination',parent));
            $('span:first',parent).css({'display': 'inline-block',
                                        'position': 'absolute',
                                        'top': '12px'});
            setDescription($(parent.find(".REGEX4")));
            setHostIcons($(parent.find(".REGEX1")));
        });
        if (!settings.debug)$("span#userDescription,.REGEX4,.REGEX1").hide();
    }
    //SET THE DIFFERENT HOST ICON BASED ON TAG
    function setHostIcons(item){
        //console.log("WBB-CU:","setHostIcons");
        var TAG   = item.text().replace(/[\]\}]\s?[\[\{]/g,"|").replace(/[\[\](){}]|1LINK|1L/gi,"").toUpperCase().trim(),
            size  = settings.iconSize,
            HOSTS = removeDuplicates(TAG.split(/[/+|\s,\-]/)),
            icon  = "";
        for(i = 0;i < HOSTS.length;i++){
            if(fileHosts[HOSTS[i]]){
                icon = $("<img src='" + fileHosts[HOSTS[i]].ico + "' title='" + fileHosts[HOSTS[i]].host + "'>");
                icon.css({"height":size + "px"});
            }else if(HOSTS[i].match(/^\d$/)){
                icon = $("<span title='And " + HOSTS[i] + " more hosts!'>" + "+" + HOSTS[i] +"</span>");
                icon.css({"height": size  + "px","width": size  + "px","font-size": size / 2 + "px","line-height": size + "px"});
                icon.addClass("altHost");
            }else{
                icon = $("<span title='Not listed host.\nTAG:" + HOSTS[i] + "'>" + HOSTS[i] +"</span>");
                icon.css({"height": size  + "px","width": size  + "px","font-size": size / 2 + "px","line-height": size  + "px"});
                icon.addClass("altHost");
            }
            if(icon){
                icon.addClass("fileHost");
                var description = item.parents('.description').find('.userDescription');
                if($('.hosts',description).length === 0){
                    description.prepend('<div class="hosts"></div>');
                }
                $('.hosts',description).append(icon);
            }
        }
    }
    //SET ALL THE DESCRIPTION BASED ON USERS GIVEN DATA
    function setDescription(item) {
        //console.log("WBB-CU:","setDescription");
        var description = removeDuplicates((item.text() + " " + item.parents(".description,dl,.row1").find("#userDescription").text())
                                           .replace(/(?:1|single)\s?links?[\S]?/ig,"1L")
                                           .replace(/(\d+(?:[.,]\d+)?\s?(?:Gi?B|Mi?B))\WLINKS?/ig,function(a,b){return b.replace(/\./,",") + ",;,Links";})
                                           .replace(/(\d+(?:[.,]\d+)?)\s?(Gi?B|Mi?B|CH)/ig,function(a,b,c){return b.replace(/\./,",") + c.toUpperCase();})
                                           .replace(/DD5\.1/ig,"DD5,1")
                                           .replace(/(web|dts|XBOX)[\-\s](dl|ONE|360)/ig,"$1,;,$2")
                                           .replace(/(\d+),(\W?20\d{2})/ig,"$1-$2")
                                           .replace(/(V?\d+[\-\s.]?(?:\d+[\-\s.]?)*\W)?((?:(?:BETA|ALPHA|BUILD|UPDATE)\W?V?|V)\W?)(\d+[\.\s\-]?(\d+[\.\s\-]?)*)/gi,function(a,b,c,d){
            return ((typeof b === "undefined") ? '' : b.replace(/[.\-\s](\d+)/g,",$1")) + c.replace(/\W/g,",;,") + d.replace(/[.\-\s](\d+)/g,",$1");
        })
                                           .replace(/((?:[^V,]|^)\d+[\.\s\-](\d+[\.\s\-]?)*[a-z]?)(?=\W|$)/ig,function(a,b){
            return b.replace(/\./g,",");
        })
                                           .replace(/((?:ULTIMATE[\s.])?\w+\b[\s.]EDITION)/ig,function(a){return a.trim().replace(/[\s.]/g,",;,");})
                                           .replace(/(\d+)\WLANG(?:UAGE)?/ig,'MULTi$1')
                                           .replace(/Blu\WEvo|AGB\WGolden\WTeam|@Dake\WAI|VT\WTeam\WSub|Black\WBox|M\WTeam|PxHD\Wmobies|PS3\WTeam/,function(a){return a.replace(/[\-\s]/g,",;,");})
                                           .replace(/[=\/\+\-\[\]\(\)\/\.|_:]/g, " ")
                                           .replace(/\s{2,}/g," ")
                                           .replace(/,;,/g,"-").split(/\s/)),
            container = {
                "Source":    [],
                "Resolution":[],
                "Size":      [],
                "Container": [],
                "Video":     [],
                "Audio":     [],
                "Group":     [],
                "Console":   [],
                "Edition":   [],
                "Version":   [],
                "Update":    [],
                "Build":     [],
                "Extra":     [],
            },
            parent = item.parents(".description,.row1"),
            result = "";
        parent.append("<div class='userDescription'></div>");
        for (var des in description) {
            var value = description[des];
            switch (true) {
                case /^(?:dvd|dvdrip)$/i.test(value):
                    if(forumSection === "movies" || forumSection === "tv")
                        addInfo(container.Source, "DVD");
                    break;
                case /^(?:dvdr|dvd5|dvd9)$/i.test(value):
                    if(forumSection === "movies" || forumSection === "tv")
                        addInfo(container.Source, "Full-DVD");
                    break;
                case /^(?:bluray|brrip|bdrip|blu-ray|br)$/i.test(value):
                    if(forumSection === "movies" || forumSection === "tv")
                        addInfo(container.Source, "BluRay");
                    break;
                case /^(?:hddvd)$/.test(value):
                    if(forumSection === "movies" || forumSection === "tv")
                        addInfo(container.Source, "HD-DVD");
                    break;
                case /^(?:cam|camrip|hdcam)$/i.test(value):
                    if(forumSection === "movies" || forumSection === "tv")
                        addInfo(container.Source, "CAM");
                    break;
                case /^(?:r[1-9])$/i.test(value):
                    addInfo(container.Source, description[des].toUpperCase());
                    break;
                case /^(?:dvd)?scr(?:eener)?$/i.test(value):
                    addInfo(container.Source, "Screener");
                    break;
                case /^(?:(?:HD|HQ)?ts|telesync)$/i.test(value):
                    addInfo(container.Source, "TeleSync");
                    break;
                case /^(?:(?:HD|HQ)?tc|telecine)$/i.test(value):
                    addInfo(container.Source, "TeleCine");
                    break;
                case /^(?:wp|workprint)$/i.test(value):
                    addInfo(container.Source, "WorkPrint");
                    break;
                case /^(?:web-?dl|web)$/i.test(value):
                    addInfo(container.Source, "WEB-DL");
                    break;
                case /^(?:web-?rip)$/i.test(value):
                    addInfo(container.Source, "WEB-RIP");
                    break;
                case /^(?:web-?cap)$/i.test(value):
                    addInfo(container.Source, "WEB-CAP");
                    break;
                case /^(?:hdrip|hdtv)$/i.test(value):
                    addInfo(container.Source, "HDTV");
                    break;
                case /^(?:pdtv)$/i.test(value):
                    addInfo(container.Source, "PDTV");
                    break;
                case /^(?:PPV|PPVRip)$/i.test(value):
                    addInfo(container.Source, "PPV");
                    break;
                case /^(?:VODRip|VODR)$/i.test(value):
                    addInfo(container.Source, "VOD");
                    break;
                case /^(?:360p|480p|576p|720p(?:3D)?|1080p(?:3D)?)$/i.test(value):
                    addInfo(container.Resolution, description[des]);
                    break;
                case /^(?:x264|h264|x265|h265|hevc|dvix|xvid)$/i.test(value):
                    addInfo(container.Video, description[des].toUpperCase());
                    break;
                case /^(?:avi|mp4|mkv|asf|flv|f4v)$/i.test(value):
                    addInfo(container.Container, description[des].toUpperCase());
                    break;
                case /^(?:\d(?:,\d)?ch|dd5,1|dts-hd|dts|aac|ac3)$/i.test(value):
                    addInfo(container.Audio, description[des].toUpperCase().replace(/,/,"."));
                    break;
                case /^(?:\d+(?:,\d+)?(?:mi?b|gi?b))$/i.test(value):
                    addInfo(container.Size, description[des].toUpperCase().replace(/,/,"."));
                    break;
                case /UPDATE-V?(\d+(?:.\d+)*)/i.test(value):
                    addInfo(container.Update,
                            description[des].replace(/,/g,".")
                            .replace(/UPDATE-|v/ig,""));
                    break;
                case /BUILD-V?(\d+(?:.\d+)*)/i.test(value):
                    addInfo(container.Build,
                            description[des].replace(/,/g,".")
                            .replace(/BUILD-|v/ig,""));
                    break;
                case /^V?-?(\d+,(?!$)(\d+,?)*[a-z]?)$/i.test(value):
                    if(forumSection === "games" || forumSection === "apps" || forumSection === "console" )
                        addInfo(container.Version,
                                description[des].replace(/,/g,".")
                                .replace(/v-?/i,""));
                    break;
                case /^(?:V\d+)$/i.test(value):
                    addInfo(container.Version, "v" +
                            description[des].replace(/,/g,".")
                            .replace(/v/i,""));
                    break;
                case /Edition$/i.test(value):
                    addInfo(container.Edition,description[des].replace(/-Edition/g,"")
                            .replace(/-/," "));
                    break;
                case /^(?:XBOX-?ONE|XBOX|PS4|PS3|PS2|PSP|3DS|NDS|SNES|NES|WII?-U|WII|GAMECUBE|Dreamcast)$/i.test(value):
                    addInfo(container.Console, description[des].toUpperCase());
                    break;
                case /^(?:PS1|PSX)$/i.test(value):
                    addInfo(container.Console, "PS1");
                    break;
                case /^(?:XBOX-?360|X-?360)$/i.test(value):
                    addInfo(container.Console, "XBOX360");
                    break;
                case /^(?:HDC|SPRiNTER|LEGi0N|KaOs|GOG|Blu-Evo|AGB-Golden-Team|@Dake-AI|VT-Team-Sub|Black-Box|M-Team|PxHD-mobies|PS3-Team|FAS|3DM|ALI213|BiTE|CORE|Unleashed|PROPHET|RELOADED|CODEX|Razor|ALiAS|FLT|WaLMaRT|PLAZA|RiTUEL|SKIDROW|Mikas|BHRG|TiTAN|RLSM|RAV3N|NODLABS|RARBG|m2g|GAC|LiGHTFOR|Nocturnal|MARVEL|PLAYASiA|PSFR33|GLoBAL|SPARE|APATHY|STRANGE|DNL|Allstars|CONTRAST|PUSSYCAT|P2P|IPT|VENOM|iMARS|PROTOCOL|COMPLEX|ANTiDOTE|DUPLEX|UNLiMiTED|ACCiDENT|iND|ABSTRAKT|CLANDESTiNE|PSA|PHOBOS|3DT|PRoDJi|TLF|de[42]|decibeL|D-Z0N3|FoRM|FTW-HD|G3N3|HiFi|INtL|McXode|Penumbra|PUDDiNG|SaNcTi|Positive|BDbits|FraMeSToR|ALeSiO|FASM|NiBuRu|LoNeWolf|FLAWL3SS|HDxT|PrimeHD|Grond|MarGe|BluHD|3DNORD|RealHD|jack|RUXI|JEM|NTb|HiSD|CHD|CHDTV|CHDBits|CHD3D|CHDPAD|AREA11|HDTime|beAst|HDRemuX|TBH|3DV|playHD|playTV|playMUSIC|playON|playXD|playMB|FiLELiST|TvT|HDBrise|mkvrg|SpaceHD|RiplleyHD|RightSiZE|KM|Mikemelo1369|aZA|HDSTaRS|Gh0st|HiDt|ViSTA|HDMaNiAcS|BluDragon|KRaLiMaRKo|iMN|HiDe|HDViE|YoHo|HDC|NoVA|HDCITY|0DAY|CMCT|@GGZLI|MiniBD1080P|iCandy|HDMEvolution|MobileHD|FourGHD|ReMuXmE|MeRCuRY|DGN|HDL|ASUT|CwP|EbP|EPiK|Hanoi|HDAT|HDNews|HDO|Subits|L2Bits|SDvB|MySilu|HDROAD|HDS|HDSTAR|HDSPAD|HDWing|HDWTV|iHD|HDChina|kishd|FooKaS|Q0S|LTRG|KiSHD|BMDru|HDStar|OpenCD|LLM|KHQ|PxHD|PxEHD|Px3D|bxEHD|SKALiWAGZ|TBB|HANDJOB|CrEwSaDe|CtrlSD|SaM|Skullz|HaB|Wiki|NGB|BDClub|OoKU|TRiM|IVT|VTBT|VTMT|XTSF|DiRTY|ViKAT|Bunny|Chotab|VaAr3|Soul|Nero9|Green|JENC|tRuEHD|IJR|REVEiLLE|FUM|mSD|NhaNc3|MkvCage|VTMT(C)Z|AE|AJ8|AJP|Arucard|AW|BBW|BG|BoK|CRiSC|Crow|CtrlHD|D4|DiGG|DiR|disc|DBO|DON|DoNOLi|ESiR|ETH|fLAMEhd|FPG|FSK|Ft4U|fty|Funner|GMoRK|GoLDSToNE|H2|h264iRMU|HDB|HDBiRD|H@M|hymen|HZ|iLL|IMDTHS|iNFLiKTED|iOZO|J4F|JAVLiU|JCH|k2|KTN|KweeK|lulz|M794|MAGiC|MCR|MdM|MMI|Mojo|NaRB|NiX|NWO|OAS|ONYX|PerfectionHD|PHiN|PiNG|Prestige|Prime|PXE|QDP|QXE|RedÂµx|REPTiLE|RuDE|S26|sJR|SK|SLO|SPeSHaL|SrS|Thora|tK|TM|toho|TSE|VanRay|ViNYL|XSHD|YanY|Z|Zim'D|FGT|NoGRP|C4TV|CHAMPiONS|2HD|LOL|ASAP|KILLERS|DIMENSION|MixedPack|JIVE|AFG|kingdom|viethd|nCore|HDA|hijacked|anoXmous|SANTi|fanta|ind|ozlem|redblade|psychd|playnow|resurrection|cybermen|juggs|highcode|imp3ria|sinners|rarbg|budyzer|fico|ift|legion|evo|amiable|melite|ink|ebp|mchd|hdaccess|sparks|cadaver|fragment|jyk|rovers|lost|wiki|an0nym0us|ltu|taste|covziro|bipolar|rusted|brmp|blackjesus|geckos|tayto|hidt|sonido|majestic|nohate|alliance|kaka|yify|noscreens|shaanig|fwolf|eve|sadpanda|blitzcrieg|axxo|viznu)$/i.test(value):
                    addInfo(container.Group, description[des]);
                    break;
                case /^(?:\d+(?:,\d+)?(?:mb|gb)-LINKS\W?)$/i.test(value):
                    addInfo(container.Extra,description[des].replace(/-/," ")
                            .replace(/\W$/,""));
                    break;
                case /^(?:1L|EUR|USA|PAL|NTSC|RETAIL|MULTI\d+|REMASTERD|HD|PreCracked|REPACK|DLCs?|MacOSX?|CRACK|KEYGEN|SERIAL|PATCH|Portable|Cracked|SP\d)$/i.test(value):
                    addInfo(container.Extra,description[des]);
                    break;
            }
        }
        for (var TAG in container) {
            if (container[TAG].length > 0) {
                if (result !== "") result += " | ";
                result += "<span class='TAG'>"  + TAG + ": </span>" + "<span class='genInfo'>" + container[TAG].join("<span style='font-weight:normal'> - </span>") + "</span>";
            }
        }
        if (result !== "")$('.userDescription',parent).append("<div class='generalDescription'>" +  result + "</div>");
        if(forumSection === "tv"){
            var season,episode,match;
            if(RegEX.episode.test(item.text())){
                match  = item.text().match(RegEX.episode);
                if(!RegEX.season.test(item.text())){
                    try {
                        season = "<span class='TAG'>Season: </span><span class='season'>" +
                            match[0].trim()
                            .match(/S(?:eason\s?)?\d{1,2}|\d{1,2}x/)[0]
                            .replace(/[^\d]*(\d+)x?/,"$1")
                            .replace(/^(\d$)/,"0$1") + "</span>";
                    }catch(err) {
                        console.log('WBB-CU:','TV:',item.text(),err);
                    }
                }
                episode = "<span class='TAG'>Episode: </span><span class='episode'>" +
                    match[0].trim()
                    .replace(/season\s\d{1,2}.?\sepisode\s(\d{1,2})/i,"$1")
                    .replace(/(?:S\d+-?)?E(\d+)[\s\-]E?(\d+)/i,"$1 <span style='font-weight:normal'> To </span> $2")
                    .replace(/\d{1,2}x(\d{1,2})/,"$1")
                    .replace(/.+E(\d{1,2})/,"$1")
                    .replace(/(?:^|E)(\d)$/,"0$1") + "</span>";
                $('.userDescription',parent).prepend("<span class='tvDescription'>" +  episode + "</span>");
                if(season)$('.userDescription',parent).prepend("<span class='tvDescription'>" +  season  + "</span>");
            }
            if(RegEX.season.test(item.text())){
                match = item.text().match(RegEX.season);
                var seasons     = match[1].split("-");
                season = "<span class='TAG'>Season: </span><span class='season'>";
                if(seasons.length > 1){
                    season   += seasons[0].match(/\d{1,2}$/g)[0]
                        .replace(/^(\d)$/,"0$1") + "<span style='font-weight:normal'> To </span>" +
                        seasons[seasons.length-1].match(/\d{1,2}$/g)[0]
                        .replace(/^(\d)$/,"0$1")+ "</span>";
                }else{
                    season   += seasons[0].match(/\d+/g)[0].replace(/^(\d)$/,"0$1")+ "</span>";
                }
                $('.userDescription',parent).prepend("<span class='tvDescription'>" +  season  + "</span>");
            }
        }
    }
    function addInfo(Array,Info){
        if(Array.indexOf(Info) === -1)Array.push(Info);
    }
    function removeDuplicates(Array){
        return Array.filter(function(item, pos) {
            return ((item !== undefined && item !== "") ? Array.indexOf(item) == pos : null );
        });
    }
    function isTAG(element){
        return /((?:(?=\[|\w)\[?(?:\b\w{2,5}\b[+|\-\/\d]*)*\])+)/.test($(element).text());
    }
    function cleanTitle(title){
        return title.replace(/\sII(?:\s|$)/g,"2")
            .replace(/\sIII(?:\s|$)/g,"3")
            .replace(/\sIV(?:\s|$)/g,"4")
            .replace(/\sV(?:\s|$)/g,"5")
            .replace(/\sVI(?:\s|$)/g,"6")
            .replace(/\sVII(?:\s|$)/g,"7")
            .replace(/\sIIX(?:\s|$)/g,"8")
            .replace(/\sIX(?:\s|$)/g,"9")
            .replace(/\sX(?:\s|$)/g,"10")
            .replace(/the\b|part(?=\s?\d)|p(?=\d)|3d/ig,"")
            .replace(/and/ig,"&")
            .replace(/(\W)@(\W)/ig,"$1AT$2")
            .replace(/(\w)@(\w)/ig,"$1A$2")
            .replace(/[Ã¤Ã Ã¢]/ig,"A")
            .replace(/Ã§/ig,"C")
            .replace(/[Ã©Ã¨Ã«Ãª]/ig,"E")
            .replace(/\W/g,"")
            .toUpperCase();
    }
    function drawStars(rating,cv){
        var img = new Image();
        img.onload = function(){
            var context = cv.getContext('2d'),
                i = 400 * (rating / 10);
            context.drawImage(img,0,40,400,40,0,0,400,40);
            context.drawImage(img,0,0,i,40,0,0,i,40);
        };
        img.src = stars;
    }
    function GetIMG_B64(method,link,des){
        try {
            GM_xmlhttpRequest({
                method: method,
                url: link,
                overrideMimeType: 'text/plain; charset=x-user-defined',
                onload: function(response) {
                    if(response.status == "200"){
                        var img = "data:image/jpeg;base64," +  encode64(response.responseText);
                        $(des).attr("src",img);
                    }
                }
            });
        }catch(err) {
            console.log(err);
        }
    }
    function encode64(inputStr) {
        var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
            outputStr = "",
            i = 0;

        while (i<inputStr.length){
            //all three "& 0xff" added below are there to fix a known bug
            //with bytes returned by xhr.responseText
            var byte1 = inputStr.charCodeAt(i++) & 0xff,
                byte2 = inputStr.charCodeAt(i++) & 0xff,
                byte3 = inputStr.charCodeAt(i++) & 0xff,

                enc1 = byte1 >> 2,
                enc2 = ((byte1 & 3) << 4) | (byte2 >> 4),
                enc3, enc4;

            if (isNaN(byte2)){
                enc3 = enc4 = 64;
            }else{
                enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
                if (isNaN(byte3)){
                    enc4 = 64;
                }else{
                    enc4 = byte3 & 63;
                }
            }
            outputStr +=  b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
        }
        return outputStr;
    }
    $(document).on('click','.genre a',function(e){
        if($(this).attr('href').match(/imdb.com\/title\/tt.+$/i)){
            if(! e.ctrlKey){
                e.preventDefault();
                var Info   = JSON.parse($(this).attr('data-info')),
                    IMDB   = $(IMDB_INFO_HTML),
                    rating = parseFloat(Info.Rating.replace(",",".")),
                    title  = Info.Title.split(":");
                if(title.length > 2){
                    title = [title[0],title.slice(1,title.length).join(":")];
                }
                if(title.length === 2){
                    title[1] = "<span style='font-size: small;'>" + title[1] + "</span>";
                }
                title = title.join(':');
                $('#image',IMDB).append('<img>');
                $('#image img',IMDB).attr('src',Info.Poster.replace(/_V1_.+$/g,"_V1_SY466_AL_.jpg"));
                $('#name',IMDB).prepend(title);
                $('#year',IMDB).text('(' + Info.Year + ')');
                if(typeof(Info.contentRating) !== 'undefined')    $('#contentRating>span',IMDB).text(Info.contentRating);		                                               else $('#contentRating',IMDB).remove();
                if(typeof(Info.Duration)      !== 'undefined')    $('#duration>span',IMDB).text(Info.Duration);				                                               else $('#duration',IMDB).remove();
                if(typeof(Info.releaseDate)   !== 'undefined')    $('#datePublished>span',IMDB).text(' -' + Info.releaseDate);                                               else $('#datePublished',IMDB).remove();
                if(typeof(Info.Genre)         !== 'undefined')    $('#genre',IMDB).text(typeof Info.Genre == "object" ?  Info.Genre.join(" | ") : Info.Genre);			   else $('#genre',IMDB).remove();
                if(typeof(Info.Description)   !== 'undefined')    $('#description',IMDB).html(Info.Description.replace(/([A-Z])/,'<span class="firstLetter">$1</span>'));
                if (!isNaN(rating)){
                    drawStars(rating,$("#rStars",IMDB)[0]);
                    $("#ratingValue",IMDB).append(Info.Rating);
                    $("#bestRating",IMDB).append("| 10");
                    $('#ratingCount>span',IMDB).append(Info.ratingCount);
                    $('#ratingCount',IMDB).append(" Votes");
                }else $('#rating').remove();
                if(Info.Director.length > 0 ){
                    $('#director>h4',IMDB).text("Director:");
                    Info.Director.forEach(function(director){
                        var $director = $('#director',IMDB).append('<a target="_blank"><span></span></a>').find('a:last');
                        $director.attr('href',director.URL);
                        $('span',$director).text(director.Name);
                        $director.wrap('<div></div>');
                        //if($director.Type !== '')$director.parent().append(' (' + director.Type + ')');
                    });
                }
                if(Info.Creator.length > 0 ){
                    if(forumSection === "movies") $('#creator>h4',IMDB).text("Writer:");
                    if(forumSection === "tv") $('#creator>h4',IMDB).text("Creator:");
                    Info.Creator.forEach(function(creator){
                        var $creator = $('#creator',IMDB).append('<a target="_blank"><span></span></a>').find('a:last');
                        $creator.attr('href',creator.URL);
                        $('span',$creator).text(creator.Name);
                        $creator.wrap('<div></div>');
                        if(creator.Type !== '')$creator.parent().append('<span> (' + creator.Type + ')</span>');
                    });
                }
//DEBUG
                Info.Stars.forEach(function(actor){
                    var $actor = $('#actorsRow',IMDB).append('<a target="_blank" href=""><img id="profielpic"><span></span></a>').find('a:last'),
                        res = /([US][XY])(\d+)_CR(\d+),(\d+),(\d+),(\d+)_AL_\.jpg$/.exec(actor.Image),
                        url = "";
                    $actor.attr('href',"https://www.imdb.com" + actor.url);
                    console.log($actor,actor);
                    if(!/nopicture/.test(actor.Image) && typeof(actor.Image) !== 'undefined' && res){
                        url = actor.Image.replace(res[0],res[1] + (res[2]*2) + "_CR" + (res[3]*2) + "," + res[4] + "," + (res[5]*2) + "," + (res[6]*2) + "_AL_.jpg");
                        //GetIMG_B64("GET",url,$('img',$actor));
                        $('img' ,$actor).attr('src',url);
                    }else{
                        url = 'http://ia.media-imdb.com/images/G/01/imdb/images/nopicture/32x44/name-2138558783._CB379389446_.png'
                        //GetIMG_B64("GET",url,$('img',$actor));
                        $('img',$actor).attr('src',url);
                    }
                    $('span',$actor).text(actor.name);
                });
                $('body').append('<div id="fullScreen"></div>');
                $('#fullScreen').append(IMDB);
                name = "";
                IMDB.css({
                    'left': '50%',
                    'top': '50%',
                    'position': 'absolute',
                    'margin-left': '-' + (IMDB.width() / 2).toString() + 'px',
                    'margin-top': '-' + (IMDB.height() / 2).toString() + 'px'
                });
                if(Info.Trailer !== ""){
                    var height 	= 270 + (275 * ((($("#main  td",IMDB).width() - 480) / 4.8) / 100)),
                        trailer = Info.Trailer;
                    if(/imdb\.com/.test(trailer)){
                        trailer = trailer.replace("http://imdb","https://www.imdb").match(/.*vi\d+/)[0]  + "/imdb/embed?autoplay=false&width=" + $("#main  td",IMDB).width();
                    }
                    $("#trailer iframe",IMDB).attr("srcLink",trailer);
                    $("#trailer",IMDB).height($("#main  td",IMDB).height());
                    $("#trailer iframe",IMDB).height(height);
                    $("#trailer iframe",IMDB).css("top",($("#main  td",IMDB).height() -  height) / 2 );
                }else{
                    $("#playTrailer",IMDB.parent()).remove();
                }
                $('#fullScreen').animate({opacity: 1}, {queue: false, duration: 'slow'});
            }
        }
    });
    $(document).on('click','#fullScreen',function(e){
        var width  = $('.IMDB',this).width(),
            height = $('.IMDB',this).height(),
            x	   = $('.IMDB',this).position().left + parseFloat($('.IMDB',this).css('margin-left')),
            y	   = $('.IMDB',this).position().top + parseFloat($('.IMDB',this).css('margin-top'));
        if(e.clientX < x || e.clientX > x + width){
            $('#fullScreen').animate({
                "opacity" : "0",
            },{
                "complete" : function() {
                    $('#fullScreen').remove();
                }
            });
        }
        if(e.clientY < y || e.clientY > y + height){
            $('#fullScreen').animate({
                "opacity" : "0",
            },{
                "complete" : function() {
                    $('#fullScreen').remove();
                }
            });
        }
    });
    $(document).on('click','.expand:not(.expended)',function(){
        $('#WBB').animate({
            height: "300px"
        },300);
        $('.expand').addClass('expended');
        $('.expand').text("-");
        $('#titlebar').css({
            'border-bottom-left-radius' : '0px',
            'border-bottom-right-radius': '0px'
        });
    });
    $(document).on('click','.expended',function(){
        $('#WBB').animate({
            height: "30px"
        },300,function(){
            $('.expand').removeClass('expended');
            $('.expand').text("+");
            $('#titlebar').css({
                'border-bottom-left-radius' : '5px',
                'border-bottom-right-radius': '5px'
            });
        });
    });
    $(document).on("click",".tab:not(.active)",function(){
        $(this).addClass('active').siblings().removeClass('active');
        //$(this).css('border-bottom', 'none')
        //$(this).siblings().css('border-bottom', '1px solid rgba(0,0,0,0.3)')
    });
    $(document).on("mousedown mouseup",function(e){
        $(this).data("mouseDown", (e.type === "mousedown") ? true : false);
    });
    $(document).on("mousedown mouseenter",".tab:not(.active)",function(e){
        if (e.type === "mouseenter" && !$(document).data("mouseDown")) return;
        if (e.button === 0 )$(this).addClass('pressed');
    });
    $(document).on("mouseup mouseleave",".tab:not(.active)",function(e){
        if (e.button === 0)$(this).removeClass('pressed');
    });
    $(document).on("click","#save",function(){
        GM_setValue('settings', settings);
    });
    $(document).on('change','#debug',function(){
        settings.debug = $('#debug').prop('checked');
    });
    $(document).on('change','#getIMDb',function(){
        settings.getIMDb = $('#getIMDb').prop('checked');
    });
    $(document).on('change','#WatchList',function(){
        settings.watchListColor = $('#WatchList').val();
    });
    $(document).on('change','#UserListID',function(){
        settings.userList = $('#UserListID').val();
    });
    $(document).on('change','#UserList',function(){
        settings.userListColor = $('#UserList').val();
    });
    $(document).on('change','#bothLists',function(){
        settings.joinedColor = $('#bothLists').val();
    });
    $(document).on('change','#hostIcon',function(){
        settings.hostIcon = $('#hostIcon').prop('checked');
        $('.fileHost').css('visibility',(settings.hostIcon ? 'visible' : 'hidden'));
    });
    $(document).on('change','#showDescription',function(){
        settings.description = $('#showDescription').prop('checked');
        $('.generalDescription').css('display',(settings.description ? 'block' : 'none'));
    });
    $(document).on('change','#hostIcon-size',function(){
        settings.iconSize = $('#hostIcon-size').val();
        $('.fileHost').css({'height':$('#hostIcon-size').val() + 'px',
                            'width':$('#hostIcon-size').val() + 'px',
                            'font-size': $('#hostIcon-size').val() / 2 + 'px',
                            'line-height':$('#hostIcon-size').val() + 'px'});
    });
    $(document).on('change','#hostIcon-margin',function(){
        settings.iconMargin = $('#hostIcon-margin').val();
        $('.fileHost').css('margin-right',$('#hostIcon-margin').val() + 'px');
    });
    $(document).on("click","#delete",function(){
        GM_setValue('IMDbData', {});
    });
    $(document).on("click",".IMDB .tab:not(.active)",function(){
        var caller = $(this).parents(".IMDB"),
            width = $(".IMDBinfo #main  td",caller).width(),
            tableW = $(".IMDBinfo",caller).width();
        $(caller).find(".IMDBinfo #top td, .IMDBinfo #main td").css("width",width + 'px');
        $(this).addClass('active').siblings().removeClass('active');
        if($(".IMDBinfo #trailer",caller).css("display") == "none"){
            if($(".IMDBinfo #trailer iframe",caller).attr('src') === ''){
                var trailerURL = $(caller).find("#trailer iframe").attr("srcLink");
                $(caller).find("#trailer iframe").attr("src",trailerURL);
            }
            $(caller).find(".IMDBinfo #top div, .IMDBinfo #main div:not(#trailer):not(.IMDBnav)").fadeToggle(1000);
            setTimeout(function(){
                $(caller).find(".IMDBinfo #top td, .IMDBinfo #main td").animate({width:'0px'});
            },1000);
            setTimeout(function(){
                $(caller).find(".IMDBinfo #top td, .IMDBinfo #main td").animate({width:width + 'px'});
            },2000);
            setTimeout(function(){
                $(caller).find(".IMDBinfo #top div, .IMDBinfo #trailer, .IMDBinfo #trailer iframe").fadeToggle(1000);
            },2500);
        }else{
            $(caller).find(".IMDBinfo #top div, .IMDBinfo #trailer,.IMDBinfo #trailer iframe").fadeToggle(1000);
            setTimeout(function(){
                $(caller).find(".IMDBinfo #top td, .IMDBinfo #main td").animate({width:'0px'});
            },1000);
            setTimeout(function(){
                $(caller).find(".IMDBinfo #top td, .IMDBinfo #main td").animate({width:width + 'px'});
            },2000);
            setTimeout(function(){
                $(caller).find(".IMDBinfo #top div, .IMDBinfo #main div:not(#trailer):not(.IMDBnav)").fadeToggle(1000);
            },2500);
        }
    });
    function loadSettings(){
        if(typeof settings === 'string'){
            settings = defaultSettings;
            GM_setValue('settings', settings);
        }
        if(Object.keys(settings).length != Object.keys(defaultSettings).length){
            for(var setting in defaultSettings){
                if(!settings.hasOwnProperty(setting)){
                    settings[setting] = defaultSettings[setting];
                }
            }
        }
        $('#debug').prop('checked', settings.debug);
        $('#hostIcon').prop('checked',settings.hostIcon);
        $('#hostIcon-size').val(settings.iconSize);
        $('#hostIcon-margin').val(settings.iconMargin);
        $('#showDescription').prop('checked', settings.description);
        $('#getIMDb').prop('checked', settings.getIMDb);
        $('#WatchList').val(settings.watchListColor);
        $('#UserList').val(settings.userListColor);
        $('#UserListID').val(settings.userList);
        $('#bothLists').val(settings.joinedColor);
    }
    //GETTING THE DIFFERENT HOSTS DATA
    function getJSON(url,callback){
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            onload: function(response) {
                if(response.status == 200){
                    callback(JSON.parse(response.responseText));
                }else{
                    console.log(response.status + " " + response.statusText);
                }
            }
        });
    }
})();