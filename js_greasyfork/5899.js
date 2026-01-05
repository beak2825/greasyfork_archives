// ==UserScript==
// @name        Wanikani Self-Study Plus
// @namespace   wkselfstudyplus
// @description Adds an option to add and review your own custom vocabulary
// @include     *.wanikani.com/*
// @include     *.wanikani.com/chat/*
// @exclude	    *.wanikani.com
// @include     *.wanikani.com/dashboard*
// @include     *.wanikani.com/community*
// @require      https://cdn.jsdelivr.net/jquery.mockjax/1.6.1/jquery.mockjax.js
// @version     0.2.4
// @author      shudouken and Ethan
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5899/Wanikani%20Self-Study%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/5899/Wanikani%20Self-Study%20Plus.meta.js
// ==/UserScript==

//dont release until asdfadf fixed


/*
 *  This script is licensed under the Creative Commons License
 *  "Attribution-NonCommercial 3.0 Unported"
 *  
 *  More information at:
 *  http://creativecommons.org/licenses/by-nc/3.0/
 */
var APIkey = "YOUR_API_HERE";
var locksOn = true; //Disable vocab locks (unlocked items persist until deleted)
var lockDB = true; //Set to false to unlock Kanji is not available on WaniKani (ie. not returned by API)
var reverse = true; //Include English to ひらがな reading reviews
var debugging = true;
debugging = false;
var asWK = true; //Push user reviews into the main WK review queue

//shut up JSHint
/* jshint multistr: true , jquery: true, indent:2 */
/* global window, wanakana, Storage, XDomainRequest */

/*
 *  Debugging
 */

var scriptLog = debugging ? function (msg) {
    if (typeof msg === 'string') {
        window.console.log("WKSS: " + msg);
    } else {
        window.console.log("WKSS: ", msg);
    }
} : function () {
};


//convert localstorage User-Vocab for updates
function ConvertStorage(){
    var vocab = localGet("User-Vocab")||[];
    var v = vocab.length;
    while (v--){
        if (typeof vocab[v].due === "undefined"||vocab[v].due !== vocab[v].date + srsintervals[vocab[v].level]){
            //   scriptLog("Adding or modifying 'due' property to "+ vocab[v].kanji);
            // vocab[v].due = vocab[v].date + srsintervals[vocab[v].level];
        }
    }
    localSet("User-Vocab", vocab);
}

$("head").prepend('<script src="https://raw.githubusercontent.com/WaniKani/WanaKana/gh-pages/assets/js/wanakana.js" type="text/javascript"></script>');





//track versions & datatypes
var VersionData = {
    v: "0.1.13",
    propertyType: {meaning: "array", reading: "array", kanji: "string", i:"number", components: "array", date: "number", due: "number", locked: "string", manualLock: "string"},
    propertyDesc: {meaning: "list of meanings", reading: "list of readings", kanji: "item prompt", i:"item index", components: "kanji found in word", date: "timestamp of new level", due: "timestamp of item's next review", locked: "indicator of whether components are eligible", manualLock: "latch for 'locked' so failing components don't re-lock the item"}
};
localSet("WKSSdata", VersionData);


/*
 *  Settings and constants
 */

//Save API to local storage
var storedAPI = localStorage.getItem('WaniKani-API');
if (APIkey === "YOUR_API_HERE"){
    if (storedAPI !== null){
        APIkey = localStorage.getItem('WaniKani-API');
    }
}else{//API has been set in code.
    if (storedAPI !== APIkey){
        localSet('WaniKani-API', APIkey);//overwrite with new API
    }
}

///###############################################
// Config for window sizes in pixels

// add Window, standard 300 x 300
var addWindowHeight = 300;
var addWindowWidth = 300;

// export and import Window, standard 275 x 390
var exportImportWindowHeight = 275;
var exportImportWindowWidth = 390;

// edit Window, standard 380 x 800
var editWindowHeight = 380;
var editWindowWidth = 800;

// study(review) Window, standard 380 x 600
var studyWindowWidth = 600;

// result Window, standard 500 x 700
var resultWindowHeight = 500;
var resultWindowWidth = 700;

///###############################################

var errorAllowance = 4; //every x letters, you can make one mistake when entering the meaning

//srs 4h, 8h, 24h, 3d (guru), 1w, 2w (master), 1m (enlightened), 4m (burned)
var srslevels = [];
srslevels.push("Started");
srslevels.push("Apprentice");
srslevels.push("Apprentice");
srslevels.push("Apprentice");
srslevels.push("Apprentice");
srslevels.push("Guru");
srslevels.push("Guru");
srslevels.push("Master");
srslevels.push("Enlightened");
srslevels.push("Burned");

var srsintervals = [];
var hrs = 60*60*1000;
var days = 24*hrs;
var weeks = 7*days;
srsintervals.push(0);
srsintervals.push(4*hrs);
srsintervals.push(8*hrs);
srsintervals.push(1*days);
srsintervals.push(3*days);
srsintervals.push(1*weeks);
srsintervals.push(2*weeks);
srsintervals.push(730*hrs);//average month
srsintervals.push(2922*hrs);//average 4 months

//---
ConvertStorage();


//GM_addStyle shim for compatibility
function GM_addStyle(CssString){
    //get DOM head
    var head = document.getElementsByTagName('head')[0];
    if (head) {
        //build style tag
        var style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = CssString;
        //insert DOM style into head
        head.appendChild(style);
    }
}

/*
 *  JQuery fixes
 */
$("[placeholder]").focus(function () {
    var input = $(this);
    if (input.val() == input.attr("placeholder")) {
        input.val("''");
        input.removeClass("'placeholder'");
    }
}).blur(function () {
    var input = $(this);
    if (input.val() == "''" || input.val() == input.attr("placeholder")) {
        input.addClass("placeholder");
        input.val(input.attr("placeholder"));
    }
}).blur();

$("[placeholder]").parents("form").submit(function () {
    $(this).find("[placeholder]").each(function () {
        var input = $(this);
        if (input.val() == input.attr("placeholder")) {
            input.val("");
        }
    });
});


//--------------Start Insert Into WK Review Functions--------------

var WKItems = [];
var userVocab = localGet("User-Vocab")||[];
for (var i = 0; i < userVocab.length; i++){
    var dueNow = (userVocab[i].locked === "no" && userVocab[i].level < 9 && Date.now() > userVocab[i].due);

    if (dueNow){
        if (userVocab[i].kanji.length * userVocab[i].meaning[0].length * userVocab[i].reading[0].length){
            //Sorry, we need all three to add to WK review, no kana only without readings etc.
            scriptLog("item:" + userVocab[i].kanji + ", " + userVocab[i].locked +" === \"no\" && " + userVocab[i].level + " < 9 && " + Date.now() + " > " + userVocab[i].due);
            scriptLog(dueNow);
            WKItems.push(WKSS_to_WK(userVocab[i]));
        }else{
            scriptLog("Item " + userVocab[i].kanji + " could not be added, it is missing one or more of the essential fields for a WK vocabulary review");            
        }
    }
}

if (userVocab.length){
    console.log("first item regardless of being added to queue:", WKSS_to_WK(userVocab[0]), JSON.stringify(WKSS_to_WK(userVocab[0])));
}

console.log(WKItems);
//where the magic happens
if (asWK){
    $.jStorage.listenKeyChange("reviewQueue",joinReviews); 
}



function joinReviews(){
    console.log("joining reviews");
    $.jStorage.stopListening("reviewQueue", joinReviews);
    var WKreview = $.jStorage.get("reviewQueue")||[];
    var WKcombined = WKreview.concat(WKItems);
    $.jStorage.set("reviewQueue", WKcombined);
}

function WKSS_to_WK(WKSSItem){
    var WKItem = {};
    //    WKItem.aud = "";
    WKItem.en = WKSSItem.meaning.map(function(s) { return s.trim().replace(/\b\w/g , function(m){ return m.toUpperCase(); }); }); //trim whitespace and capitalize words
    WKItem.id = "WKSS" + WKSSItem.i;
    WKItem.kana = WKSSItem.reading;
    WKItem.srs = WKSSItem.level+1;//WK starts levels from 1, WKSS starts them from 0

    WKItem.syn = [];
    //Add synonyms of strings without bracketed info to get around checking the full string including brackets
    for (m = 0; m < WKSSItem.meaning.length; m++){
        var openBracket = WKSSItem.meaning[m].indexOf("(");
        if (openBracket !== -1 && WKSSItem.meaning[m].indexOf(")") !== -1){
            WKItem.syn.push(WKSSItem.meaning[m].substr(0, openBracket).trim().replace(/\b\w/g , function(m){ return m.toUpperCase()}));
        }
    }

    WKItem.voc = WKSSItem.kanji;
    //
    WKItem.components = WKSSItem.components;
    return WKItem;
}

function hijackRequests(){
    //{"level":"17","meaning_explanation":"This word consists of kanji with hiragana attached. Because the hiragana ends with an [ja]う[/ja] sound, you know this word is a verb. The kanji itself means [kanji]flourish[/kanji] or [kanji]prosperity[/kanji], so the verb vocab versions of these would be [vocabulary]to flourish[/vocabulary] or [vocabulary]to prosper[/vocabulary].","reading_explanation":"Since this word consists of a kanji with hiragana attached, you can bet that it will use the kun'yomi reading. You didn't learn that reading with this kanji, so here's a mnemonic to help you: What do you flourish at? You're an amazing [vocabulary]soccer[/vocabulary] ([ja]さか[/ja]) player who flourishes and prospers no matter where you go to play this wonderful (but not as good as baseball) sport.","en":"To Flourish, To Prosper","kana":"さかえる","sentences":[["中国には、覚せい剤の生産で栄えていた村がありました。","There was a village in China flourishing on their production of stimulants. "]],"parts_of_speech_ids":["4","19"],"part_of_speech":"Intransitive Verb, Ichidan Verb","audio":"2e194cbf194371cd478480d6ea67769da623e99a.mp3","meaning_note":null,"reading_note":null,"related":[{"kan":"栄","en":"Prosperity, Flourish","slug":"栄"}]}


    if (typeof $.mockjax === "function"){
        $.mockjax({
            url: /^\/json\/progress\?vWKSS(.+)\[\]=(.+)&vWKSS.+\[\]=(.+)$/,
            urlParams:["WKSSid", "MeaningWrong", "ReadingWrong"],
            response: function(settings) {
                // do any required cleanup
                var id = Number(settings.urlParams.WKSSid);
                var Mw = Number(settings.urlParams.MeaningWrong);
                var Rw = Number(settings.urlParams.ReadingWrong);
                var UserVocab = localGet("User-Vocab")||[];

                console.log("is this your card?", UserVocab[id]);
                if (UserVocab[id].due < Date.now()){//double check that item was due for review
                    if (Mw||Rw){
                        //drop levels if wrong

                        //Adapted from WaniKani's srs to authentically mimic level downs
                        var o = (Mw||0)+(Rw||0);
                        var t = UserVocab[id].level;
                        var r=t>=5?2*Math.round(o/2):1*Math.round(o/2);
                        var n=t-r<1?1:t-r;//don't stay on 'started'

                        UserVocab[id].level = n;
                    }else{
                        //increase level if none wrong
                        UserVocab[id].level++;
                    }
                    //Put UserVocab back in storage
                    UserVocab[id].date = Date.now();
                    UserVocab[id].due = Date.now() + srsintervals[UserVocab[id].level];
                    localSet("User-Vocab", UserVocab);
                    console.log(UserVocab[id].due +" > "+ Date.now() + " (" + ms2str(UserVocab[id].due - Date.now())+")");

                }else{
                    console.log("This item is not due for review yet, discarding results");
                }
                this.responseText = '{"vWKSS'+id.toString()+'":["'+Mw.toString()+'","'+Rw.toString()+'"]}';

            }
        });

        $.mockjax({
            url: /^\/json\/vocabulary\/WKSS(.+)/,
            urlParams:["WKSSid"],
            response: function(settings) {

                // Investigate the `settings` to determine the response...
                var id = settings.urlParams.WKSSid.toString();
                var currentItem = $.jStorage.get("currentItem");
                if (currentItem.id === "WKSS"+id){
                    console.log("as expected");               
                }
                var related = '[';
                for (i = 0; i < currentItem.components.length; i++){
                    related += '{"kan":"'+currentItem.components[i]+'","en":"","slug":"'+currentItem.components[i]+'"}';
                    related += (i+1<currentItem.components.length)?',':'';
                }
                related += ']';

                var respText = JSON.stringify({"level":"U",
                                               "meaning_explanation":"This is user-defined item. Meaning explanations are not supported at this time. [id: "+id+"]",
                                               "reading_explanation":"This is user-defined item. Reading explanations are not supported at this time. [id: "+id+"]",
                                               "en":currentItem.en.join(", "),
                                               "kana":currentItem.kana.join(", "),
                                               "sentences":[],
                                               "parts_of_speech_ids":[],
                                               "part_of_speech":[],
                                               "audio":null,
                                               "meaning_note":null,
                                               "reading_note":null,
                                               "related":JSON.parse(related)});
                this.responseText = respText;
            },
            onAfterComplete: function() {
                // do any required cleanup
                $(".user-synonyms").remove();
                // keeping the hooks for Community Mnemonics
                $("#note-meaning, #note-reading").html("");
            }
        });
    }
}
//--------------End Insert Into WK Review Functions--------------

/*
* populate reviews when menu button pressed
*/

window.generateReviewList = function() {
    //if menu is invisible, it is about to be visible
    if ( $("#WKSS_dropdown").is(":hidden") ){
        //This is really the only time it needs to run
        //unless we want to start updating in realtime by keeping track of the soonest item
        generateReviewList();
    }
};

/*
 *  Add Item
 */
// event function to open "add window" and close any other window that might be open at the time. 
window.WKSS_add = function () {
    //show the add window
    $("#add").show();
    //hide other windows
    $("#export").hide();
    $("#import").hide();
    $("#edit").hide();
    $("#selfstudy").hide();
};

//'add window' html text
var addHtml = '\n\
<div id="add" class="WKSS">\n\
<form id="addForm">\n\
<button id="AddCloseBtn" class="wkss-close" type="reset"><i class="icon-remove"></i></button>\n\
<h1>Add a new Item</h1>\n\
<input type="text" id="addKanji" placeholder="Enter 漢字, ひらがな or カタカナ">\n\
<input type="text" id="addReading" title="Leave empty to add vocabulary like する (to do)" placeholder="Enter reading">\n\
<input type="text" id="addMeaning" placeholder="Enter meaning">\n\
\n\
<p id="addStatus">Ready to add..</p>\n\
<button id="AddItemBtn" type="button">Add new Item</button>\n\
</form>\n\
</div>\n';

//add html to page source
$("body").append(addHtml);

//hide add window ("div add" code that was just appended)
$("#add").hide();

function handleAddClick(){

    var kanji = $("#addKanji").val().toLowerCase();
    var reading = $("#addReading").val().toLowerCase().split(/[,、]+\s*/); //split at , or 、followed by 0 or any number of spaces
    var meaning = $("#addMeaning").val().toLowerCase().split(/[,、]+\s*/);
    var success = false; //initalise values
    var meanlen = 0;

    var i = meaning.length;
    while (i--){
        meanlen += meaning[i].length;
    }

    //input is invalid: prompt user for valid input
    var item = {};
    if (kanji.length === 0 || meanlen === 0) {
        $("#addStatus").text("One or more required fields are empty!");
        if (kanji.length === 0) {
            $("#addKanji").addClass("error");
        } else {
            $("#addKanji").removeClass("error");
        }
        if (meanlen === 0) {
            $("#addMeaning").addClass("error");
        } else {
            $("#addMeaning").removeClass("error");
        }
    } else {
        scriptLog("building item: "+kanji);
        item.kanji = kanji;
        item.reading = reading; //optional
        item.meaning = meaning;

        success = true;
        scriptLog("item is valid");
    }

    //on successful creation of item
    if (success) {
        //clear error layout to required fields
        $("#addKanji").removeClass("error");
        $("#addMeaning").removeClass("error");



        //if there are already user items, retrieve vocabList
        // var vocabList = [];
        var vocabList = getFullList();

        scriptLog("vocabList retrieved, length: "+vocabList.length);
        //check stored user items for duplicates ****************** to do: option for editing duplicate item with new input
        if(checkForDuplicates(vocabList,item)) {
            $("#addStatus").text("Duplicate Item detected!");
            $("#addKanji").addClass("error");
            return;
        }

        setVocItem(item);

        scriptLog("clear form");
        $("#addForm")[0].reset();

        //--------------------------------------------------------------------------------------------------------
        if (item.manualLock === "yes" || item.manualLock === "DB" && lockDB){
            $("#addStatus").html("<i class=\"icon-lock\"></i> Added locked item");
        } else {
            $("#addStatus").html("<i class=\"icon-unlock\"></i>Added successfully");
        }
        //--------------------------------------------------------------------------------------------------------
    }
}


//function to fire on click event for "Add new Item"
$("#AddItemBtn").click(function () {
    handleAddClick();
});

$("#AddCloseBtn").click(function () {
    $("#add").hide();
    $("#addForm")[0].reset();
    $("#addStatus").text('Ready to add..');
    $("#addKanji").removeClass("error");
    $("#addMeaning").removeClass("error");
});



//---Function wrappers to facilitate use of one localstorage array
//---Maintains data integrity between previously two (vocab and srs)


function setSrsItem(srsitem,srsList){
    var index = srsitem.i;
    scriptLog("setSrsItem: ");

    if(srsList){
        if(srsList[index].kanji===srsitem.kanji){// try search by index

            scriptLog("success: "+srsitem.kanji+" found at index "+ index);
            //replace only the srs parts of the item  
            srsList[index].date = srsitem.date;
            srsList[index].level = srsitem.level;
            srsList[index].locked = srsitem.locked;
            srsList[index].manualLock = srsitem.manualLock;
        }else{ //backup plan (cycle through list?)
            scriptLog("SRS Kanji not found in vocablist, needs work");

        }
        scriptLog("item: ");
        return srsList;
    }
}

function getSrsList(){
    var srsList = getVocList();
    return srsList;
}

function getVocList(){
    var vocList = jQuery.parseJSON(localStorage.getItem('User-Vocab'))||[];
    if (vocList){
        var v=vocList.length;
        while(v--){
            vocList[v].i = v; //set index for item (->out)
        }
    }
    scriptLog("getVocList: ");
    return vocList;
}

function setVocItem(item){

    //Assumption: item comes only with kanji, reading and meaning

    item.level = 0;
    item.date = Date.now();
    item.manualLock = "";
    item = setLocks(item);
    item.due = item.date + srsintervals[item.level]; //0.1.9 adding in 'due' property to make review building simpler

    var found = false;
    var vocList = localGet('User-Vocab')||[];

    var v = vocList.length;
    while(v--){
        if (vocList[v].kanji === item.kanji){
            found = true;
            scriptLog("duplicate found, skipping item (give options in future)");

            //add meaning and reading to existing item
            //        vocList[v].meaning = item.meaning;
            //      vocList[v].reading = item.reading;
        }
    }
    if (!found) {
        //provide index for faster searches
        scriptLog(item.kanji +" not found in vocablist, adding now");
        item.i = vocList.length;
        vocList.push(item);

        localSet('User-Vocab',vocList);
    }
}

function getFullList(){
    var fullList = jQuery.parseJSON(localStorage.getItem('User-Vocab'))||[];
    if(!fullList){
        fullList=[];
    }
    return fullList;
}



//checks if an item is present in a list
function checkForDuplicates(list, item) {
    scriptLog("Check for dupes with:" + item.kanji);

    var i = list.length;
    while(i--){
        list[i].i = i; //set index property for quick lookup
        if(list[i].kanji == item.kanji)

            return true;
    }
    return false;
}

//manages .locked property of srsitem
/*This function manages the .locked and manualLock properties of srsitem
.locked is a real time evaluation of the item (is any of the kanji in the word locked?)
.manualLock will return 'no' if .locked has ever returned 'no'.
This is to stop items being locked again after they have been unlocked if any
of the kanji used falls below the unlock threshold
(eg. if the 勉 in 勉強 falls back to apprentice, we do not want to lock up 勉強 again.)
*/
function setLocks(item){
    //functions:
    //    isKanjiLocked(srsitem)

    //-----------------------]

    //once manualLock is "no" it stays "no"
    if (item.manualLock !== "no" && item.manualLock !== "n"){

        var kanjiList = localGet('User-KanjiList')||[];

        item.components = getComponents(item.kanji);

        var kanjiLockedResult = isKanjiLocked(item, kanjiList);
        item.locked = kanjiLockedResult[0];

        item.manualLock = item.locked;
    }else{
        item.manualLock = 'no';
    }

    scriptLog("setting locks for "+ item.kanji +": locked: "+item.locked+", manualLock: "+ item.manualLock);

    return item;
}

function isKanjiLocked(srsitem, kanjiList){
    //functions:
    //    getCompKanji(srsitem.kanji, kanjiList)

    //item unlocked by default
    //may have no kanji, only unlocked kanji will get through the code unflagged

    var locked = "no"; 
    if (locksOn){


        //get the kanji characters in the word.
        var componentList = getCompKanji(srsitem, kanjiList);
        // eg: componentList = getCompKanji("折り紙", kanjiList);
        // componentList = [{"kanji": "折", "srs": "guru"}, {"kanji": "紙", "srs": "apprentice"}]


        var c = componentList.length; 
        while(c--){
            //look for locked kanji in list
            if (componentList[c].srs == "apprentice" ||
                componentList[c].srs == "noServerResp"||
                componentList[c].srs == "unreached"
               ){

                //----could be apprentice etc. 
                //Simple: lock is 'yes'
                locked = "yes";
                // "yes":	item will be locked while there is no database connection.
                //			if the server response indicates that it has been unlocked, only then will it be available for review

                scriptLog("test srs for apprentice etc. 'locked': "+ locked);

                scriptLog(componentList[c].kanji +": "+componentList[c].srs +" -> "+ locked);

                break; // as soon as one kanji is locked, the whole item is locked
            }

            //DB locks get special state
            if (componentList[c].srs == "noMatchWK" || componentList[c].srs == "noMatchGuppy"){

                locked = "DB";
                //"DB"	: database limitations, one of two things
                //a. the kanji isn't in the database and the user is a guppy --could change if user subscribes or first two levels change/expand
                //b. the kanji isn't in the database and the user is a turtle --could change if more kanji added.

                scriptLog("test srs for unmatched kanji. 'locked': "+ locked);

                scriptLog(componentList[c].kanji +": "+componentList[c].srs +" -> "+ locked);


            }

        } //for char in componentList
        scriptLog("out of character loop");
    }
    //locked will be either "yes","no", or "DB"
    return [locked];
}
//--------

/*
 *  Edit Items
 */
window.WKSS_edit = function () {
    generateEditOptions();
    $("#edit").show();
    //hide other windows
    $("#export").hide();
    $("#import").hide();
    $("#add").hide();
    $("#selfstudy").hide();
};

$("body").append("                                                          \
<div id=\"edit\" class=\"WKSS\">                                               \
<form id=\"editForm\">                                                                    \
<button id=\"EditCloseBtn\" class=\"wkss-close\" type=\"button\"><i class=\"icon-remove\"></i></button>\
<h1>Edit your Vocab</h1>                                                \
<select id=\"editWindow\" size=\"8\"></select>\
<input type=\"text\" id=\"editItem\" name=\"\" size=\"40\" placeholder=\"Select vocab, click edit, change and save!\">\
\
<p id=\"editStatus\">Ready to edit..</p>\
<button id=\"EditEditBtn\" type=\"button\">Edit</button>\
<button id=\"EditSaveBtn\" type=\"button\">Save</button>         \
<button id=\"EditDeleteBtn\" type=\"button\" title=\"Delete selected item\">Delete</button>         \
<button id=\"EditDeleteAllBtn\" type=\"button\" title=\"本当にやるの？\">Delete All</button>   \
<button id=\"ResetLevelsBtn\" type=\"button\">Reset levels</button>         \
</form>                                                                   \
</div>");
$("#edit").hide();

$("#ResetLevelsBtn").click(function () {


    //var srslist = getSrsList();
    var srsList = jQuery.parseJSON(localStorage.getItem('User-Vocab'))||[];

    if (srsList) {
        var i = srsList.length;
        while(i--){
            srsList[i].level = 0;
            scriptLog("srsList[i].i before: "+srsList[i].i);
            srsList[i].i=i;
            scriptLog("srsList[i].i after: "+srsList[i].i);
            var srsList2 = localGet('User-Vocab')||[];

            srsList2 = setSrsItem(srsList[i],srsList2);
            localSet('User-Vocab', srsList2);

        }
    }
});


$("#EditEditBtn").click(function () {
    //get handle for 'select' area
    var select = document.getElementById("editWindow");

    //get the index for the currently selected item
    var index = select.selectedIndex; //select.options[select.selectedIndex].value is not required, option values are set to index
    var vocabList = getVocList();
    vocabList = vocabList.reverse();
    document.getElementById("editItem").value = JSON.stringify(vocabList[index]);
    document.getElementById("editItem").name = index; //using name to save the index
    $("#editStatus").text('Loaded item to edit');
});

$("#EditSaveBtn").click(function () {
    if ($("#editItem").val().length !== 0) {
        //-- be aware
        //deleting one item may cause mismatch if i is property of item in list
        try {
            var index = document.getElementById("editItem").name;
            var item = JSON.parse(document.getElementById("editItem").value.toLowerCase());
            var m = item.meaning.length;
            while(m--){
                if (item.meaning[m] === ""){
                    delete item.meaning[m];
                }
            }         
            var fullList = getFullList().reverse();


            if (isItemValid(item) &&//item is valid
                !(checkForDuplicates(fullList,item) && //kanji (if changed) is not already in the list
                  fullList[index].kanji !== item.kanji)) {//unless it is the item being edited


                var srslist = getSrsList().reverse();
                //get srs components of item(list)  

                fullList[index] = item;//does not have srs stuff, re-add it now

                scriptLog(fullList[index]);
                scriptLog(srslist[index]);
                fullList[index].date = srslist[index].date;
                fullList[index].level = srslist[index].level;
                fullList[index].locked = srslist[index].locked;
                fullList[index].manualLock = srslist[index].manualLock;

                fullList = fullList.reverse(); //reset order of array

                localSet('User-Vocab', fullList);

                generateEditOptions();
                $("#editStatus").html('Saved changes!');
                document.getElementById("editItem").value = "";
                document.getElementById("editItem").name = "";

            }else{            
                $("#editStatus").text('Invalid item or duplicate!');
                alert(isItemValid(item).toString() +" && ！("+ checkForDuplicates(fullList,item).toString()+" && !("+fullList[index].kanji+" !== "+item.kanji+")");

            }
        }
        catch (e) {
            $("#editStatus").text(e);
        }
    }
});

$("#EditDeleteBtn").click(function () {
    //select options element window
    var select = document.getElementById("editWindow");

    //index of selected item
    var item = select.options[select.selectedIndex].value;

    //fetch JSON strings from storage and convert them into Javascript literals
    var vocabList = getFullList();

    //starting at selected index, remove 1 entry (the selected index).
    if (item > -1) {
        if (vocabList !== null){
            vocabList.splice(item, 1);
        }
    }

    //yuck
    if (vocabList.length !== 0) {
        localSet('User-Vocab', vocabList);
    }
    else {
        localStorage.removeItem('User-Vocab');
    }

    updateEditGUI();

    $("#editStatus").text('Item deleted!');
});

function updateEditGUI(){

    generateEditOptions();
    document.getElementById("editItem").value = "";
    document.getElementById("editItem").name = "";

}

$("#EditDeleteAllBtn").click(function () {
    var deleteAll = confirm("Are you sure you want to delete all entries?");
    if (deleteAll) {

        //drop local storage
        localStorage.removeItem('User-Vocab');


        updateEditGUI();

        $("#editStatus").text('All items deleted!');
    }
});


$("#EditCloseBtn").click(function () {
    $("#edit").hide();
    $("#editForm")[0].reset();
    $("#editStatus").text('Ready to edit..');
});

//retrieve values from storage to populate 'editItems' menu
function generateEditOptions() {
    var select = document.getElementById('editWindow');

    //clear the menu (blank slate)
    while (select.firstChild) {
        select.removeChild(select.firstChild);
    }

    //check for items to add
    if (localStorage.getItem('User-Vocab')) {

        //retrieve from local storage
        var vocabList = getVocList();
        var srslist =  getSrsList();
        var options = [];
        //build option string
        var i = vocabList.length;
        while (i--){
            //form element to save string
            var opt = document.createElement('option');

            //dynamic components of string

            //when is this item up for review
            var due = srslist[i].due||srslist[i].date + srsintervals[srslist[i].level];
            var review = "";

            //no future reviews if burned
            if(srslist[i].level >= 9) {
                review = "Never";
            }

            //calculate next relative review time
            //current timestamp is past due date.
            else if(Date.now() >= due) {
                review = "Now" ;
            } 

            else {//turn number (milliseconds) into relatable string (hours, days, etc)
                review = ms2str(due - Date.now());            
            }//end if review is not 'never' or 'now'

            var text = vocabList[i].kanji + " & " + 
                vocabList[i].reading + " & " + 
                vocabList[i].meaning + " (" + 
                srslevels[srslist[i].level] + " - Review: " + 
                review + ") Locked: " + 
                srslist[i].manualLock;

            opt.value = i;
            opt.innerHTML = text;
            options.push(opt);//for future use (sorting data etc)
            select.appendChild(opt);//export item to option menu
        }
    }
}

function ms2str(milliseconds){
    var num; //number of months weeks hours etc
    //more time has elapsed than required for the level
    if(milliseconds <= 0) {
        return "Now" ;
    }
    if(milliseconds > 2628000000) {//About a month
        num = Math.floor(milliseconds/2628000000).toString()+" month";
        if (num !== "1 month"){
            return num+"s";
        }else{
            return num;
        }
    }
    if(milliseconds > 604800000) {//A week
        num = Math.floor(milliseconds/604800000).toString()+" week";
        if (num !== "1 week"){
            return num+"s";
        }else{
            return num;
        }
    }
    if(milliseconds > 86400000) {//A day
        num = Math.floor(milliseconds/86400000).toString()+" day";
        if (num !== "1 day"){
            return num+"s";
        }else{
            return num;
        }
    }
    if(milliseconds > 3600000) {//An hour
        num = Math.floor(milliseconds/3600000).toString()+" hour";
        if (num !== "1 hour"){
            return num+"s";
        }else{
            return num;
        }
    }
    if(milliseconds > 60000) {//A minute
        num = Math.floor(milliseconds/60000).toString()+" minute";
        if (num !== "1 minute"){
            return num+"s";
        }else{
            return num;
        }
    }
    if(milliseconds > 0) {//A second is 1000, but need to return something for less than one too
        num = Math.floor(milliseconds/1000).toString()+" second";
        if (num !== "1 second"){
            return num+"s";
        }else{
            return num;
        }
    }
}

/*
 *  Export
 */
window.WKSS_export = function () {
    $("#export").show();
    //hide other windows
    $("#add").hide();
    $("#import").hide();
    $("#edit").hide();
    $("#selfstudy").hide();
};

$("body").append('                                                          \
<div id="export" class="WKSS">                                               \
<form id="exportForm">                                                                    \
<button id="ExportCloseBtn" class="wkss-close" type="button"><i class="icon-remove"></i></button>\
<h1>Export Items</h1>                                                \
<textarea cols="50" rows="18" id="exportArea" placeholder="Export your stuff! Sharing is caring ;)"></textarea>                           \
\
<p id="exportStatus">Ready to export..</p>                                        \
<button id="ExportItemsBtn" type="button">Export Items</button>\
<button id="ExportSelectAllBtn" type="button">Select All</button>\
<button id="ExportCsvBtn" type="button">Export CSV</button>\
</form>                                                                   \
</div>');
$("#export").hide();


$("#ExportItemsBtn").click(function () {

    if (localStorage.getItem('User-Vocab')) {
        $("#exportForm")[0].reset();
        var vocabList = getVocList();
        $("#exportArea").text(JSON.stringify(vocabList));
        $("#exportStatus").text("Copy this text and share it with others!");
    }
    else {
        $("#exportStatus").text("Nothing to export yet :(");
    }
});

$("#ExportSelectAllBtn").click(function () {
    if ($("#exportArea").val().length !== 0) {
        select_all("exportArea");
        $("#exportStatus").text("Don't forget to CTRL + C!");
    }
});

$("#ExportCsvBtn").click(function () {
    var vocabList = getFullList();
    var CsvFile = createCSV(vocabList);
    window.open(CsvFile);
});

$("#ExportCloseBtn").click(function () {
    $("#export").hide();
    $("#exportForm")[0].reset();
    $("#exportArea").text("");
    $("#exportStatus").text('Ready to export..');
});

/*
 *  Import
 */
window.WKSS_import = function () {
    $("#import").show();
    //hide other windows
    $("#add").hide();
    $("#export").hide();
    $("#edit").hide();
    $("#selfstudy").hide();
};

$("body").append('                                                          \
<div id="import" class="WKSS">                                               \
<form id="importForm">                                                                    \
<button id="ImportCloseBtn" class="wkss-close" type="reset"><i class="icon-remove"></i></button>\
<h1>Import Items</h1>\
<textarea cols="50" rows="18" id="importArea" placeholder="Paste your stuff and hit the import button! Use with caution!"></textarea>                     \
\
<p id="importStatus">Ready to import..</p>                                        \
<label class="button" id="ImportItemsBtn" style="display:inline;">Import Items</label>\
\
<label id="ImportCsvBtn" class="button" style="display:inline;cursor: pointer;">Import CSV         \
\
<input type="file" id="upload" accept=".csv,.tsv" style="height:0px;width:0px;background:red;opacity:0;filter:opacity(1);" />\
\
</label>\
\
<label class="button" id="ImportWKBtn" style="display:inline;"><i class="icon-download-alt"></i> WK</label>\
</form>                                                                   \
</div>');
$("#import").hide();

function fileUpload (ev){
    var csvHeader = true;        //first row contains stuff like "Kanji/Vocab, Reading, Meaning" etc
    var tsvfile;          //tabs separate fields, commas seperate values? or false for vice versa
    var CSVs = ev.target.files;
    var name =CSVs[0].name;
    var colsplit, vsplit;
    if (name.substr(name.lastIndexOf("."),4)===".csv"){
        tsvfile = false;
        colsplit = ",";
        vsplit = "\t";
    }else{
        tsvfile = true;
        colsplit = "\t";
        vsplit = ",";
    }

    scriptLog("tsvfile: ");
    scriptLog("file uploaded: "+CSVs[0].name);
    var reader = new FileReader();
    reader.readAsText(CSVs[0]);
    reader.onload = function(ev){
        var csvString = ev.target.result;
        var csvRow = csvString.split("\n");
        //default column rows
        var k = 0;
        var r = 1;
        var m = 2;

        var i = csvRow.length;
        //process header, changing k,r,m if necessary       
        var JSONimport = [];
        while(i--){
            var row = csvRow[i];
            if ((csvHeader === true && i === 0)||  //  Skip header
                (row === "") // Skip empty rows
               ){
                scriptLog("Skipping row #"+i);

            }else{
                scriptLog(row);


                var elem = row.split(colsplit);
                var item = {};
                var c;

                if (elem[k]){
                    item.kanji = elem[k].trim();

                    if (elem[r]){

                        if (elem[r].indexOf(vsplit)>-1){
                            // eg 'reading 1[tab]reading 2[tab]reading 3'

                            item.reading = elem[r].split(vsplit);
                        }else{ //no tabs in string, single value
                            item.reading=[elem[r]];
                        }

                    }else{
                        item.reading=[""];
                    }

                    if (elem[m]){

                        if (elem[m].indexOf(vsplit)>-1){
                            // eg 'meaning 1[tab]meaning 2[tab]meaning 3'

                            item.meaning = elem[m].split("\t");
                        }else{ //no tabs in string, single value
                            item.meaning=[elem[m]];
                        }

                        c = item.meaning.length;

                        while(c--){
                            scriptLog("item.meaning["+c+"]: "+item.meaning[c]);
                        }
                    }else{//todo: provide overwrite option on forced meaning
                        item.meaning=[""];
                    }

                    JSONimport.push(item);
                }else{ // corrupt row ('kanji' is mandatory (can be kana-only word), is not present on row, skip
                }  
            }
        }
        var JSONstring = JSON.stringify(JSONimport);
        scriptLog(JSONimport);

        if (JSONstring.length !== 0) {
            try {
                var add = JSON.parse(JSONstring.toLowerCase());
                /*//---------/-------------
            if (!checkAdd(add)) {
                $("#importStatus").text("No valid input (duplicates?)!");
                return;
            }
//----------------------*/

                var a = add.length;
                while(a--){
                    setVocItem(add[a]);
                }

                $("#importStatus").text("Import successful!");

                $("#importForm")[0].reset();
                $("#importArea").text("");

            }
            catch (e) {
                $("#importStatus").text("Parsing Error!");
                scriptLog(e);
            }

        }
        else {
            $("#importStatus").text("Nothing to import :( Please paste your stuff first");
        }

    };
}
document.getElementById("upload").addEventListener('change', fileUpload, false);


$("#ImportCsvBtn").click(function () {
});

$("#ImportWKBtn").click(function(){
    getServerResp(APIkey,"vocabulary");
    scriptLog("maybe?");
});

$("#ImportItemsBtn").click(function () {

    if ($("#importArea").val().length !== 0) {
        try {
            var add = JSON.parse($("#importArea").val().toLowerCase());
            alert(JSON.stringify(add));
            if (checkAdd(add)) {
                $("#importStatus").text("No valid input (duplicates?)!");
                return;
            }

            var newlist;
            var srslist = [];
            if (localStorage.getItem('User-Vocab')) {
                var vocabList = getVocList();
                srslist = getSrsList();
                newlist = vocabList.concat(add);
            }
            else {
                newlist = add;


            }
            var i = add.length;
            while(i--){
                setVocItem(add[i]);
            }

            $("#importStatus").text("Import successful!");

            $("#importForm")[0].reset();
            $("#importArea").text("");

        }
        catch (e) {
            $("#importStatus").text("Parsing Error!");
            scriptLog(e);
        }

    }
    else {
        $("#importStatus").text("Nothing to import :( Please paste your stuff first");
    }
});

$("#ImportCloseBtn").click(function () {
    $("#import").hide();
    $("#importForm")[0].reset();
    $("#importArea").text("");
    $("#importStatus").text('Ready to import..');
});

/*
 *  Review Items
 */
window.WKSS_review = function () {

    //is there a session waiting in storage?  
    if(sessionStorage.getItem('User-Review')) {

        //show the selfstudy window
        $("#selfstudy").show();

        //hide other windows
        $("#add").hide();
        $("#export").hide();
        $("#edit").hide();
        $("#import").hide();

        startReview();
    }
};

$("body").append('                                                          \
<div id="selfstudy" class="WKSS">\
<button id="SelfstudyCloseBtn" class="wkss-close" type="button"><i class="icon-remove"></i></button>\
<h1>Review<span id="RevNum"></span></h1>\
<div id="wkss-kanji">\
<span id="rev-kanji"></span>\
</div><div id="wkss-type">\
<span id="rev-type"></span><br />\
</div><div id="wkss-solution">\
<span id="rev-solution"></span>\
</div><div id="wkss-input">\
<input type="text" id="rev-input" size="40" placeholder="">\
</div><span id="rev-index" style="display: block;"></span>\
\
<form id="audio-form">\
<label id="AudioButton" class="button">Play audio</label>\
<label id="WrapUpBtn"   class="button">Wrap Up</label>\
</form>\
<div id="rev-audio" style="display:none;"></div>\
</div>');
$("#selfstudy").hide();

$("#SelfstudyCloseBtn").click(function () {
    $("#selfstudy").hide();
    $("#rev-input").val("");
    reviewActive = false;
});

$("#WrapUpBtn").click(function() {
    var sessionList = sessionGet('User-Review')||[];
    var statsList = sessionGet('User-Stats')||[];
    //if an index in sessionList matches one in statsList, don't delete
    var sessionI = sessionList.length;
    var item = sessionGet('WKSS-item')||[];
    var arr2 = [];
    //for every item in sessionList, look for index in statsList,
    //if not there (-1) delete item from sessionList
    while (sessionI--){
        var index = findIndex(statsList,sessionList[sessionI]);
        if ((Math.sign(1/index) !== -1)||(sessionList[sessionI].index == item.index)){

            arr2.push(sessionList[sessionI]);
        }
    }


    scriptLog(arr2);
    sessionSet('User-Review', JSON.stringify(arr2));
});

//---------
// save to list based on .index property
function saveToSortedList(eList,eItem){
    var get = findIndex(eList,eItem);
    if (Math.sign(1/get) === -1){
        eList.splice(-get,0,eItem);
        return eList;
    }
}

function findIndex(values, target) {
    return binarySearch(values, target, 0, values.length - 1);
}

function binarySearch(values, target, start, end) {
    //scriptLog("binarySearch(values: ,target: , start: "+start+", end: "+end+")");

    if (start > end) { 
        //start has higher value than target, end has lower value
        //item belongs between
        // need to return 'start' with a flag that it hasn't been found
        //invert sign :)
        return -(start);


        //for testing truths
        //    return String(end)+" < "+item.index+" < "+String(start); 

    } //does not exist


    var middle = Math.floor((start + end) / 2);
    var value = values[middle];
    /*scriptLog("start.index: "+values[start].index);
scriptLog("middle.index: "+values[middle].index);
scriptLog("end.index: "+values[end].index);
*/
    if (Number(value.index) > Number(target.index)) { return binarySearch(values, target, start, middle-1); }
    if (Number(value.index) < Number(target.index)) { return binarySearch(values, target, middle+1, end); }
    return middle; //found!
}
//-------

$("#AudioButton").click(function () {
    OpenInNewTab(document.getElementById('rev-audio').innerHTML);
});

function OpenInNewTab(url )
{
    var win=window.open(url, '_blank');
    win.focus();
}

function playAudio() {

    var kanji = document.getElementById('rev-kanji').innerHTML;
    var kana = (document.getElementById('rev-solution').innerHTML.split(/[,、]+\s*/))[0];

    document.getElementById('rev-audio').innerHTML = "";
    document.getElementById('audio-form').action = "";
    //document.getElementById('AudioButton').disabled = true;

    if( !kanji.match(/[a-zA-Z]+/i) && !kana.match(/[a-zA-Z]+/i)) {

        kanji = encodeURIComponent(kanji);
        kana = encodeURIComponent(kana);
        var i;

        var newkanji = "";
        for(i = 1; i < kanji.length; i = i+3) {
            newkanji = newkanji.concat(kanji[i-1]);
            newkanji = newkanji.concat('2');
            newkanji = newkanji.concat('5');
            newkanji = newkanji.concat(kanji[i]);
            newkanji = newkanji.concat(kanji[i+1]);
        }

        var newkana = "";
        for(i = 1; i < kana.length; i = i+3) {
            newkana = newkana.concat(kana[i-1]);
            newkana = newkana.concat('2');
            newkana = newkana.concat('5');
            newkana = newkana.concat(kana[i]);
            newkana = newkana.concat(kana[i+1]);
        }

        var url = "http://www.csse.monash.edu.au/~jwb/audiock.swf?u=kana=" + newkana + "%26kanji=" + newkanji;

        scriptLog("Audio URL: " + url);

        document.getElementById('AudioButton').disabled = false;

        document.getElementById('rev-audio').innerHTML = url;

    }

}

var Rev_Item = function(prompt, kanji, type, solution, index){
    this.prompt = prompt;
    this.kanji = kanji;
    this.type = type;
    this.solution = solution;
    this.index = index;
};

function generateReviewList() {
    //don't interfere with an active session
    if (reviewActive){
        document.getElementById('user-review').innerHTML = "Review in Progress";
        return;
    }

    scriptLog("generateReviewList()");
    // function generateReviewList() builds a review session and updates the html menu to show number waiting.
    var numReviews = 0;
    var soonest;
    var next;

    var reviewList = [];

    //check to see if there is vocab already in offline storage
    if (localStorage.getItem('User-Vocab')) {
        var vocabList = getFullList();
        scriptLog(vocabList);
        var now = Date.now();

        //for each vocab in storage, get the amount of time vocab has lived       
        var i = vocabList.length;
        while(i--){
            var due = vocabList[i].date + srsintervals[vocabList[i].level];


            // if tem is unlocked and unburned
            if (vocabList[i].level < 9 &&
                (vocabList[i].manualLock === "no" || vocabList[i].manualLock === "n" ||
                 vocabList[i].manualLock ==="DB" && !lockDB )){
                // if it is past review time
                if(now >= due) {
                    // count vocab up for review
                    numReviews++;

                    // add item-meaning object to reviewList
                    // have made this optional for surname lists etc.
                    if (vocabList[i].meaning[0] !== "") {
                        //Rev_Item object args: prompt, kanji, type, solution, index
                        var revItem = new Rev_Item(vocabList[i].kanji, vocabList[i].kanji, "Meaning", vocabList[i].meaning, i);
                        reviewList.push(revItem);
                    }

                    // reading is optional, if there is a reading for the vocab, add its object.
                    if (vocabList[i].reading[0] !== "") {
                        //Rev_Item object args: prompt, kanji, type, solution, index
                        var revItem2 = new Rev_Item(vocabList[i].kanji, vocabList[i].kanji, "Reading", vocabList[i].reading, i);
                        reviewList.push(revItem2);
                    }

                    //if there is a meaning and reading, and reverse flag is true, test reading from english
                    if (vocabList[i].reading[0] !== "" && vocabList[i].meaning[0] !== "" && reverse){
                        //Rev_Item object args: prompt, kanji, type, solution, index
                        var revItem3 = new Rev_Item(vocabList[i].meaning.join(", "), vocabList[i].kanji, "Reverse", vocabList[i].reading, i);
                        reviewList.push(revItem3);
                    }

                }else{//unlocked/unburned but not time to review yet
                    scriptLog("setting soonest");
                    next = due - now;
                    if(soonest){
                        soonest = Math.min(soonest, next);
                    }else{
                        soonest = next;
                    }

                }
            }//end if item is up for review
        }// end iterate through vocablist 
    }// end if localStorage

    if (reviewList.length !== 0){

        //store reviewList in current session
        sessionSet('User-Review', JSON.stringify(reviewList));
        scriptLog(reviewList);

    }else{
        scriptLog("reviewList is empty: "+JSON.stringify(reviewList));
        if (typeof soonest !== "undefined"){
            document.getElementById('user-review').innerHTML = "Next Review in "+ms2str(soonest);
        }else{
            document.getElementById('user-review').innerHTML = "No Reviews Available";
        }
    }

    var strReviews = numReviews.toString();

    /* If you want to do the 42+ thing.
  if (numReviews > 42) {
    strReviews = "42+"; //hail the crabigator!
  }
  //*/

    // return the number of reviews
    scriptLog(numReviews.toString() +" reviews created");
    if (numReviews > 0){
        var reviewString = (soonest !== undefined)? "<br/>\
More to come in "+ms2str(soonest):"";
        document.getElementById('user-review').innerHTML = "Review (" + strReviews + ")" + reviewString;
    }
}

//global to keep track of when a review is in session.
var reviewActive = false;

function startReview() {
    scriptLog("startReview()");
    submit = true;
    reviewActive = true;
    //get the review 'list' from session storage, line up the first item in queue
    var reviewList = sessionGet('User-Review')||[];
    nextReview(reviewList);
}

function nextReview(reviewList) {
    //sets up the next item for review
    //uses functions:
    //    wanakana.bind/unbind

    var rnd = Math.floor(Math.random()*reviewList.length);  
    var item = reviewList[rnd];
    sessionSet('WKSS-item', JSON.stringify(item));
    sessionSet('WKSS-rnd', rnd);
    if (sessionStorage.getItem('User-Stats')){
        $("#RevNum").innerHtml = sessionGet('User-Stats').length;  
    }  
    document.getElementById('rev-kanji').innerHTML = item.prompt;
    document.getElementById('rev-type').innerHTML = item.type;
    var typeBgColor = 'grey';
    if (item.type.toLowerCase() == 'meaning'){
        typeBgColor = 'blue';
    } else if (item.type.toLowerCase() == 'reading'){
        typeBgColor = 'orange';
    } else if (item.type.toLowerCase() == 'reverse'){
        typeBgColor = 'orange';
    }
    document.getElementById('wkss-type').style.backgroundColor = typeBgColor;
    $("#rev-solution").removeClass("info");
    document.getElementById('rev-solution').innerHTML = item.solution;
    document.getElementById('rev-index').innerHTML = item.index;

    //initialise the input field
    $("#rev-input").focus();
    $("#rev-input").removeClass("caution");
    $("#rev-input").removeClass("error");
    $("#rev-input").removeClass("correct");
    $("#rev-input").val("");

    //check for alphabet letters and decide to bind or unbind wanakana
    if (item.solution[0].match(/[a-zA-Z]+/i)) {
        wanakana.unbind(document.getElementById('rev-input'));
        $('#rev-input').attr('placeholder','Your response');
        $('#rev-input').attr('lang','en');

    }
    else {
        wanakana.bind(document.getElementById('rev-input'));
        $('#rev-input').attr('placeholder','答え');
        $('#rev-input').attr('lang','ja');

    }

    playAudio();
}

function markAnswer(item) {
    //evaluate 'item' against the question.
    // match by index
    // get type of question
    // determine if right or wrong and return result appropriately

    //get the question
    var prompt = document.getElementById('rev-kanji').innerHTML.trim();
    //get the answer
    var answer = $("#rev-input").val().toLowerCase();
    //get the index
    var index = document.getElementById('rev-index').innerHTML.trim();
    //get the question type
    var type  = document.getElementById('rev-type').innerHTML.trim();

    var vocab = localGet("User-Vocab");

    //get the item if it is in the current session
    var storedItem = sessionGet(item.index);
    if (storedItem){

        item.numCorrect = storedItem.numCorrect;
        item.numWrong = storedItem.numWrong;
    }

    if (index == item.index){//-------------
        if (inputCorrect()){
            scriptLog(answer+"/"+item.solution[0]);
            if (!item.numCorrect){
                scriptLog("initialising numCorrect");
                item.numCorrect={};
            }

            scriptLog("Correct: "+ type);
            if (type == "Meaning"){
                if (!item.numCorrect.Meaning)
                    item.numCorrect.Meaning = 0;

                item.numCorrect.Meaning++;

            }
            if (type == "Reading"){
                if (!item.numCorrect.Reading)
                    item.numCorrect.Reading = 0;

                item.numCorrect.Reading++;
            }

            if (type == "Reverse"){
                if (!item.numCorrect.Reverse)
                    item.numCorrect.Reverse = 0;

                item.numCorrect.Reverse++;
            }

        }else{
            scriptLog(answer+"!="+item.solution);
            if (!item.numWrong){
                scriptLog("initialising numCorrect");
                item.numWrong={};
            }

            scriptLog("Wrong: "+ type);
            if (type == "Meaning"){
                if (!item.numWrong.Meaning)
                    item.numWrong.Meaning = 0;

                item.numWrong.Meaning++;

            }
            if (type == "Reading"){
                if (!item.numWrong.Reading)
                    item.numWrong.Reading = 0;

                item.numWrong.Reading++;

            }
            if (type == "Reverse"){
                if (!item.numWrong.Reverse)
                    item.numWrong.Reverse = 0;

                item.numWrong.Reverse++;
            }
        }

    } else {
        console.error("Error: indexes don't match");
    }

    return item;

}

function showResults() {

    var statsList = sessionGet('User-Stats')||[];
    sessionStorage.clear();

    console.log("statslist", statsList);
    var i =  statsList.length;
    while(i--){

        var voclist = getVocList();
        //slist[statsList[i].index].level;
        scriptLog("b");
        scriptLog("statslist[i]",statsList[i]);
        var altText = voclist[statsList[i].index].level;//+statsList[i].type;
        scriptLog("a");

        if (!statsList[i].numWrong) {
            if (statsList[i].numCorrect){
                if (statsList[i].numCorrect.Meaning)
                    altText = altText + " Meaning Correct x"+statsList[i].numCorrect.Meaning +"\n";
                if (statsList[i].numCorrect.Reading)
                    altText = altText + " Reading Correct x"+statsList[i].numCorrect.Reading +"\n";
                if (statsList[i].numCorrect.Reverse)
                    altText = altText + " Reverse Correct x"+statsList[i].numCorrect.Reverse +"\n";
            }

            document.getElementById("stats-a").innerHTML +=
                "<span class=\"rev-correct\"  title='"+altText+" +'>" + statsList[i].kanji + "</span>";
        } else {
            if (statsList[i].numWrong.Meaning)
                altText = altText + " Meaning Wrong x"+statsList[i].numWrong.Meaning +"\n";
            if (statsList[i].numWrong.Reading)
                altText = altText + " Reading Wrong x"+statsList[i].numWrong.Reading +"\n";
            if (statsList[i].numWrong.Reverse)
                altText = altText + " Reverse Wrong x"+statsList[i].numWrong.Reverse +"\n";
            if (statsList[i].numCorrect){
                if (statsList[i].numCorrect.Meaning)
                    altText = altText + " Meaning Correct x"+statsList[i].numCorrect.Meaning +"\n";
                if (statsList[i].numCorrect.Reading)
                    altText = altText + " Reading Correct x"+statsList[i].numCorrect.Reading +"\n";
                if (statsList[i].numCorrect.Reverse)
                    altText = altText + " Reverse Correct x"+statsList[i].numCorrect.Reverse +"\n";
            }


            //TODO sort into apprentice, guru, etc
            document.getElementById("stats-a").innerHTML += 
                "<span class=\"rev-error\"  title='"+altText+"'>" + statsList[i].kanji + "</span>";
        }
        console.log(statsList[i]);
        statsList[i] = updateSRS(statsList[i], voclist);

    }
    sessionSet("User-Stats",statsList);
    localSet("User-Vocab", voclist);

}

$("body").append('                                                          \
<div id="resultwindow" class="WKSS">                                    \
<button id="ReviewresultsCloseBtn" class="wkss-close" type="button"><i class="icon-remove"></i></button>\
<h1>Review Results</h1>\
<h2>All</h2>\
<div id="stats-a"></div>\
</div>');

$("#resultwindow").hide();

$("#ReviewresultsCloseBtn").click(function () {
    $("#resultwindow").hide();
    document.getElementById("stats-a").innerHTML = "";
});


//declare global values for keyup event
//is an answer being submitted?
var submit = true;

//jquery keyup event
$("#rev-input").keyup(function (e) {
    //functions:
    //  inputCorrect()   

    //check if key press was 'enter' (keyCode 13) on the way up
    //and keystate true (answer being submitted) 
    //and cursor is focused in reviewfield
    if (e.keyCode == 13 && submit === true) {
        var input = $("#rev-input").val();
        var reviewList = sessionGet('User-Review')||[];
        var rnd = sessionStorage.getItem('WKSS-rnd')||0;

        var item = sessionGet('WKSS-item');

        //-- starting implementation of forgiveness protocol

        item.forgive = [];//"ゆるす"]; //placeholder (許す to forgive)


        if (item === null){
            alert("Item Null??");
            reviewList.splice(rnd, 1);
        }else{
            //handle grading and storing solution

            //check for input, do nothing if none
            if(input.length === 0){
                return;
            }  

            //disable input after submission
            //document.getElementById('rev-input').disabled = true;


            //was the input correct?
            var correct = inputCorrect();

            //was the input forgiven?
            var forgiven = (~item.forgive.indexOf(input));

            if (correct) {
                //highlight in (default) green
                $("#rev-input").addClass("correct");
                //show answer
                $("#rev-solution").addClass("info");
            } else if (forgiven){
                $("#rev-input").addClass("caution");
            } else {
                //highight in red
                $("#rev-input").addClass("error");
                //show answer
                $("#rev-solution").addClass("info");
            }

            //remove from sessionList if correct
            if (correct) {
                scriptLog("correct answer");
                if (reviewList !== null){
                    var oldlen = reviewList.length;

                    reviewList.splice(rnd, 1);
                    scriptLog("sessionList.length: "+ oldlen +" -> "+reviewList.length);

                    //replace shorter (by one) sessionList to session 
                    if (reviewList.length !== 0) {
                        scriptLog("sessionList.length: "+ reviewList.length);
                        sessionSet('User-Review', JSON.stringify(reviewList));

                    } else {
                        //reveiw over, delete sessionlist from session
                        sessionStorage.removeItem('User-Review');
                    }
                }else{
                    console.error("Error: no review session found");
                }
            }else{
                //   if(forgiven){
                //     scriptLog(input +" has been forgiven. "+item.type);
                //   return;
                //}
                scriptLog("wrong answer");
            }

            item = markAnswer(item);

            sessionSet(item.index, item);


            var list = JSON.parse(sessionStorage.getItem("User-Stats"))||[];
            var found = false;

            if (list){
                var i = list.length;
                while(i--){
                    if (list[i].index == item.index) {
                        list[i] = item;								//replace item if it exists
                        found = true;
                        break;
                    }
                }
                if(!found){
                    list = saveToSortedList(list,item);
                }

            } else {
                list = [item];
            }

            sessionSet("User-Stats", JSON.stringify(list));
            //playAudio();

            //answer submitted, next 'enter' proceeds with script
            submit = false;
        }//null garbage collection
    }
    else if (e.keyCode == 13 && submit === false) {
        scriptLog("keystat = " + submit);

        //there are still more reviews in session?
        if (sessionStorage.getItem('User-Review')) {
            // scriptLog("found a 'User-Review': " + sessionStorage.getItem('User-Review'));

            setTimeout(function () {
                scriptLog("refreshing reviewList from storage");
                var reviewList = JSON.parse(sessionStorage.getItem('User-Review'));

                //cue up first remaining review
                nextReview(reviewList);
                scriptLog("checking for empty reviewList");
                if (reviewList.length === 0){

                    scriptLog("session over. reviewList: "+JSON.stringify(reviewList));
                    sessionStorage.removeItem("User-Review");
                }

                //         document.getElementById('rev-input').disabled = true;
                $("#rev-solution").removeClass("info");
                $("#selfstudy").hide().fadeIn('fast');

            }, 1);
        }
        else {
            // no review stored in session, review is over    
            setTimeout(function () {

                $("#selfstudy").hide();
                //document.getElementById('rev-input').disabled = false;
                $("#rev-solution").removeClass("info");
                scriptLog("showResults");  
                showResults();
                $("#resultwindow").show();
                scriptLog("showResults completed");

                //*/  //clear session
                sessionStorage.clear();
                reviewActive = false;


            }, 1);
        }
        submit = true;

    }
});


function updateSRS(stats, voclist) {


    var now = Date.now();
    if (voclist[stats.index].due < now){ //double check that the item was really up for review.
        if(!stats.numWrong && voclist[stats.index].level < 9) {//all correct (none wrong)
            voclist[stats.index].level++;
        }
        else {
            stats.numWrong = {};
            //Adapted from WaniKani's srs to authentically mimic level downs
            var o = (stats.numWrong.Meaning||0)+(stats.numWrong.Reading||0)+(stats.numWrong.Reverse||0);
            var t = voclist[stats.index].level;
            var r=t>=5?2*Math.round(o/2):1*Math.round(o/2);
            var n=t-r<1?1:t-r;

            voclist[stats.index].level = n;//don't stay on 'started'

        }


        voclist[stats.index].date = now;
        voclist[stats.index].due = now + srsintervals[voclist[stats.index].level];
        console.log("Next review in "+ms2str(srsintervals[voclist[stats.index].level]));

        return voclist;
    }
}

function localSet(strName, obj){
    scriptLog(strName + " is of type " + typeof obj);
    if (typeof obj === "object")
        obj=JSON.stringify(obj);
    localStorage.setItem(strName, obj);
}
function localGet(strName){
    var strObj = localStorage.getItem(strName);
    return parseString(strObj);
}
function sessionSet(strName, obj){
    scriptLog(strName + " is of type " + typeof obj);
    if (typeof obj === "object")
        obj=JSON.stringify(obj);
    sessionStorage.setItem(strName, obj);
}
function sessionGet(strName){
    var strObj = sessionStorage.getItem(strName);
    return parseString(strObj);
}

function parseString(strObj){
    //avoids duplication of code for sesssionGet and localGet
    var obj;
    try {
        obj = JSON.parse(strObj);
        scriptLog("Variable is of type " + typeof obj);
    }catch(e){
        if (e.name === "SyntaxError"){
            scriptLog(strName + " is an ordinary string that cannot be parsed.");
            obj = strObj;
        }else{
            console.error("Could not parse " + strObj + ". Error: ", e);
        }
    }
    return obj;

}

function unbracketSolution(solution){
    //takes an arry of strings and returns the portions before left brackets
    var unbracketed = [];
    i = solution.length;
    while(i--){
        var openBracket = solution[i].indexOf("(");
        if (openBracket !== -1){ //string contains a bracket
            unbracketed.push(solution[i].toLowerCase().substr(0, openBracket));
        }
    }
    return unbracketed;
}

function inputCorrect() {

    var input = $("#rev-input").val().toLowerCase().trim();
    var solution = document.getElementById('rev-solution').innerHTML.split(/[,、]+\s*/);
    var correctCharCount = 0;
    var returnvalue = false;

    scriptLog("Input: " + input);

    var append = unbracketSolution(solution);
    solution = solution.concat(append);
    var i = solution.length;
    while(i--){

        var threshold = 0;//how many characters can be wrong
        if(document.getElementById('rev-type').innerHTML == "Meaning") {
            threshold = Math.floor(solution[i].length / errorAllowance);
        }

        scriptLog("Checking " + solution[i] + " with threshold: " + threshold);

        var j;
        var lengthDiff = Math.abs(input.length - solution[i].length);
        if (lengthDiff > threshold){
            returnvalue = returnvalue || false;
            scriptLog("false at if branch " + input.length + " < " + JSON.stringify(solution[i]));//.length );//- threshold));
        } else { //difference in response length is within threshold
            j = input.length;
            while (j--) {
                if (input[j] == solution[i][j]) {
                    scriptLog (input[j] +" == "+ solution[i][j]);
                    correctCharCount++;
                }
            }
            if (correctCharCount >= solution[i].length - threshold){
                returnvalue = true;
            }
        }

    }

    scriptLog("Returning " + returnvalue);
    return returnvalue;
}

/*
 *  Adds the Button
 */
function addUserVocabButton() {
    scriptLog("addUserVocabButton()");
    //Functions (indirect)
    //    WKSS_add()
    //    WKSS_edit()
    //    WKSS_export()
    //    WKSS_import()
    //    WKSS_lock()
    //    WKSS_review()

    var nav = document.getElementsByClassName('nav');
    scriptLog("generating review list because: initialising script and populating reviews");


    if (nav&&nav.length>2) {
        nav[2].innerHTML = nav[2].innerHTML + "\n\
<li class=\"dropdown custom\">\n\
<a class=\"dropdown-toggle custom\" data-toggle=\"dropdown\" href=\"#\" onclick=\"generateReviewList();\">\n\
<span lang=\"ja\">自習</span>\n\
Self-Study <i class=\"icon-chevron-down\"></i>\n\
</a>\n\
<ul class=\"dropdown-menu\" id=\"WKSS_dropdown\">\n\
<li class=\"nav-header\">Customize</li>\n\
<li><a id=\"click\" href=\"#\" onclick=\"WKSS_add();\">Add</a></li>\n\
<li><a href=\"#\" onclick=\"WKSS_edit();\">Edit</a></li>\n\
<li><a href=\"#\" onclick=\"WKSS_export();\">Export</a></li>\n\
<li><a href=\"#\" onclick=\"WKSS_import();\">Import</a></li>\n\
<!--//   <li><a href=\"#\" onclick=\"WKSS_lock();\">Server Settings</a></li>//-->\n\
<li class=\"nav-header\">Learn</li>\n\
<li><a id=\"user-review\" href=\"#\" onclick=\"WKSS_review();\">Please wait...</a></li>\n\
</ul>\n\
</li>";


    }
}



/*
 *  Prepares the script
 */
function scriptInit() {
    scriptLog("scriptInit()");
    //functions:
    //    addUserVocabButton()
    //    logError(err)

    scriptLog("Initializing Wanikani UserVocab Script!");

    GM_addStyle(".custom .dropdown-menu {background-color: #DBA901 !important;}");
    GM_addStyle(".custom .dropdown-menu:after {border-bottom-color: #DBA901 !important;");
    GM_addStyle(".custom .dropdown-menu:before {border-bottom-color: #DBA901 !important;");
    GM_addStyle(".open .dropdown-toggle.custom {background-color: #FFC400 !important;}");
    GM_addStyle(".custom .dropdown-menu a:hover {background-color: #A67F00 !important;}");
    GM_addStyle(".custom:hover {color: #FFC400 !important;}");
    GM_addStyle(".custom:hover span {border-color: #FFC400 !important;}");
    GM_addStyle(".custom:focus {color: #FFC400 !important;}");
    GM_addStyle(".custom:focus span {border-color: #FFC400 !important;}");
    GM_addStyle(".open .custom span {border-color: #FFFFFF !important;}");
    GM_addStyle(".open .custom {color: #FFFFFF !important}");

    GM_addStyle("   \
.WKSS {\
position:fixed;\
z-index: 2;\
top:125px;\
left:50%;\
margin:0px;\
background: #FFF;\
padding: 5px;\
font: 12px \"ヒラギノ角ゴ Pro W3\", \"Hiragino Kaku Gothic Pro\",Osaka, \"メイリオ\", Meiryo, \"ＭＳ Ｐゴシック\", \"MS PGothic\", sans-serif;\
color: #888;\
text-shadow: 1px 1px 1px #FFF;\
border:1px solid #DDD;\
border-radius: 5px;\
-webkit-border-radius: 5px;\
-moz-border-radius: 5px;\
box-shadow: 10px 10px 5px #888888;\
}\
.WKSS h1 {\
font: 25px \"ヒラギノ角ゴ Pro W3\", \"Hiragino Kaku Gothic Pro\",Osaka, \"メイリオ\", Meiryo, \"ＭＳ Ｐゴシック\", \"MS PGothic\", sans-serif;\
padding-left: 5px;\
display: block;\
border-bottom: 1px solid #DADADA;\
margin: 0px;\
color: #888;\
}\
.WKSS h1>span {\
display: block;\
font-size: 11px;\
}\
.WKSS label {\
display: block;\
margin: 0px 0px 5px;\
}\
\
\
.WKSS label>span {\
float: left;\
width: 80px;\
text-align: right;\
padding-right: 10px;\
margin-top: 10px;\
color: #333;\
font-family: \"ヒラギノ角ゴ Pro W3\", \"Hiragino Kaku Gothic Pro\",Osaka, \"メイリオ\", Meiryo, \"ＭＳ Ｐゴシック\", \"MS PGothic\", sans-serif;\
font-weight: bold;\
}\
.WKSS input[type=\"text\"], .WKSS input[type=\"email\"], .WKSS textarea{\
border: 1px solid #CCC;\
color: #888;\
height: 20px;\
margin-bottom: 16px;\
margin-right: 6px;\
margin-top: 2px;\
outline: 0 none;\
padding: 6px 12px;\
width: 80%;\
border-radius: 4px;\
line-height: normal !important;\
-webkit-border-radius: 4px;\
-moz-border-radius: 4px;\
font: normal 14px/14px \"ヒラギノ角ゴ Pro W3\", \"Hiragino Kaku Gothic Pro\",Osaka, \"メイリオ\", Meiryo, \"ＭＳ Ｐゴシック\", \"MS PGothic\", sans-serif;\
-webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\
box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\
-moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\
}\
.WKSS select {\
border: 1px solid #CCC;\
color: #888;\
outline: 0 none;\
padding: 6px 12px;\
height: 160px !important;\
width: 95%;\
border-radius: 4px;\
-webkit-border-radius: 4px;\
-moz-border-radius: 4px;\
font: normal 14px/14px \"ヒラギノ角ゴ Pro W3\", \"Hiragino Kaku Gothic Pro\",Osaka, \"メイリオ\", Meiryo, \"ＭＳ Ｐゴシック\", \"MS PGothic\", sans-serif;\
-webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\
box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\
-moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\
#background: #FFF url('down-arrow.png') no-repeat right;\
#background: #FFF url('down-arrow.png') no-repeat right);\
appearance:none;\
-webkit-appearance:none;\
-moz-appearance: none;\
text-indent: 0.01px;\
text-overflow: '';\
}\
.WKSS textarea{\
height:100px;\
}\
.WKSS button, .button {\
position: relative;\
background: #FFF;\
border: 1px solid #CCC;\
padding: 10px 25px 10px 25px;\
color: #333;\
border-radius: 4px;\
display: inline !important;\
}\
.WKSS button:disabled {\
background: #EBEBEB;\
border: 1px solid #CCC;\
padding: 10px 25px 10px 25px;\
color: #333;\
border-radius: 4px;\
}\
.WKSS .button:hover, button:hover:enabled {\
color: #333;\
background-color: #EBEBEB;\
border-color: #ADADAD;\
}                                                          \
.WKSS button:hover:disabled {\
cursor: default\
}                                                          \
.error {border-color:#F00 !important; color: #F00 !important;}\
.caution {border-color:#F90 !important; color: #F90 !important;}\
.correct {border-color:#0F0 !important; color: #0F0 !important;}\
.info {border-color:#696969 !important; color: #696969 !important;}\
.rev-error {text-shadow:none; border: 1px solid #F00 !important;border-radius: 10px; background-color: #F00; padding:4px; margin:4px; color: #FFFFFF; font: normal 18px \"ヒラギノ角ゴ Pro W3\", \"Hiragino Kaku Gothic Pro\",Osaka, \"メイリオ\", Meiryo, \"ＭＳ Ｐゴシック\", \"MS PGothic\", sans-serif;}\
.rev-correct {text-shadow:none; border: 1px solid #088A08 !important;border-radius: 10px; background-color: #088A08; padding:4px; margin:4px; color: #FFFFFF; font: normal 18px \"ヒラギノ角ゴ Pro W3\", \"Hiragino Kaku Gothic Pro\",Osaka, \"メイリオ\", Meiryo, \"ＭＳ Ｐゴシック\", \"MS PGothic\", sans-serif;}");
    GM_addStyle("\
#add {\
width:" + addWindowWidth + "px;\
height:" + addWindowHeight + "px; \
margin-left:-" + addWindowWidth/2 + "px; \
}");
    GM_addStyle("\
#export, #import {\
background:#fff;\
width:" + exportImportWindowWidth + "px;\
height:" + exportImportWindowHeight + "px;\
margin-left:-" + exportImportWindowWidth/2 + "px; \
}");
    GM_addStyle("\
#edit {\
width:" + editWindowWidth + "px;\
height:" + editWindowHeight + "px; \
margin-left:-" + editWindowWidth/2 + "px; \
}");
    GM_addStyle("\
#selfstudy {\
left:50%;\
width:" + studyWindowWidth + "px;\
height:auto; \
margin-left:-" + studyWindowWidth/2 + "px; \
}");
    GM_addStyle("\
#resultwindow {\
left:50%;\
width:" + resultWindowWidth + "px;\
height:" + resultWindowHeight + "px; \
margin-left:-" + resultWindowWidth/2 + "px; \
}");
    GM_addStyle("\
#AudioButton {\
margin-top: 35px;\
position: relative;\
display: inline !important;\
-webkit-margin-before: 50px;\
}\
button.wkss-close {\
float:right;\
background-color:#ff4040;\
color:#fff;\
padding:0px;\
height:27px;\
width:27px\
}\
\
#wkss-close {\
float:right;\
background-color:#ff4040;\
color:#fff;\
padding:0px;\
height:27px;\
width:27px\
}\
#wkss-kanji, #rev-kanji {\
text-align:center !important;\
font-size:50px !important;\
background-color: #9400D3 !important;\
color: #FFFFFF !important;\
border-radius: 10px     10px      0px           0px;\
}\
#wkss-solution, #rev-solution {\
text-align: center !important;\
font-size:30px !important;\
color: #FFFFFF;\
padding: 2px;\
}\
#wkss-type{\
text-align:center !important;\
font-size:24px !important;\
background-color: #696969;\
color: #FFFFFF !important;\
border-radius: 0px     0px      10px           10px;\
}\
#rev-type {\
text-align:center !important;\
font-size:24px !important;\
color: #FFFFFF !important;\
border-radius: 0px     0px      10px           10px;\
}\
#wkss-input {\
text-align:center !important;\
font-size:40px !important;\
height: 80px !important;\
line-height: normal !important;\
}\
#rev-input {\
text-align:center !important;\
font-size:40px !important;\
height: 60px !important;\
line-height: normal !important;\
}");
    // Set up buttons
    try {
        if (typeof(Storage) !== "undefined") {
            addUserVocabButton();

            //provide warning to users trying to use the (incomplete) script.
            scriptLog("this script is still incomplete: \n\
It is provided as is without warranty express or implied\n\
in the hope that you may find it useful.");
        }
        else {
            scriptLog("Wanikani Self-Study: Your browser does not support localStorage.. Sorry :(");
        }
    }
    catch (err) {
        logError(err);
    }
}

/*
 * Helper Functions/Variables
 */

function isEmpty(value) {
    return (typeof value === "undefined" || value === null);
}

function select_all(str) {
    //eval can be harmful
    var text_val = document.getElementById(str);
    scriptLog(text_val);
    text_val.focus();
    text_val.select();
}

function checkAdd(add) {
    //take a JSON object (parsed from import window) and check with stored items for any duplicates
    // Returns true if each item in 'add' array is valid and
    //at least one of them already exists in storage
    var i = add.length;
    if(localStorage.getItem('User-Vocab')) {    
        var vocabList = getVocList();
        while(i--){
            if (isItemValid(add[i]) &&
                checkForDuplicates(vocabList,add[i]))
                return true;
        }
    }
    return false;
}


function isItemValid(add) {
    //validates an object representing vocab
    return (!isEmpty(add.kanji) && //kanji property exists
            !isEmpty(add.meaning) && //meaning property exists
            !isEmpty(add.reading)&& //reading property exists
            Object.prototype.toString.call(add.meaning) === '[object Array]'&&//meaning is an array
            Object.prototype.toString.call(add.reading) === '[object Array]');//reading is an array
}

/*
 * Error handling
 * Can use 'error.stack', not cross-browser (though it should work on Firefox and Chrome)
 */
function logError(error) {
    scriptLog("logError(error)");
    var stackMessage = "";
    if ("stack" in error)
        stackMessage = "\n\tStack: " + error.stack;

    scriptLog("WKSS: Error: " + error.name + "\n\tMessage: " + error.message + stackMessage);
    console.error("WKSS: Error: " + error.name + "\n\tMessage: " + error.message + stackMessage);
}


//*****Ethan's Functions*****
function handleReadyStateFour(xhrk, requestedItem){

    var localkanjiList = [];
    scriptLog("readystate: "+ xhrk.readyState);
    var resp = JSON.parse(xhrk.responseText);
    scriptLog("about to loop through requested information"); 

    var i=resp.requested_information.length||0;
    if (requestedItem === "kanji"){
        while(i--){
            //push response onto kanjilist variable
            if (resp.requested_information[i].user_specific !== null){
                localkanjiList.push({"character": resp.requested_information[i].character,
                                     "srs": resp.requested_information[i].user_specific.srs,
                                     "reading": resp.requested_information[i][resp.requested_information[i].important_reading].split(",")[0],
                                     "meaning": resp.requested_information[i].meaning.split(",")[0]
                                    });
            }else{
                localkanjiList.push({"character": resp.requested_information[i].character,
                                     "srs": "unreached"});
            }
        }
    }else if(requestedItem === "vocabulary"){
        while(i--){
            //push response onto kanjilist variable
            if (resp.requested_information[i].user_specific !== null||true){
                //build vocablist
                localkanjiList.push({"kanji": resp.requested_information[i].character,
                                     "reading": resp.requested_information[i].kana.split(","),
                                     "meaning": resp.requested_information[i].meaning.split(",")});
            }
        }
    }
    //return kanjiList
    //  scriptLog("Server responded with new kanjiList: \n"+JSON.stringify(kanjiList));
    return localkanjiList;

}


function getServerResp(APIkey, requestedItem){

    requestedItem = typeof requestedItem !== 'undefined' ? requestedItem : 'kanji';

    //functions:
    //    refreshLocks()
    //    generateReviewList()

    if (APIkey !== "test"){
        var levels = (requestedItem ==="kanji")? "/1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50":
        "/1,2,3,4,5,6,7,8,9,10";
        var xhrk = createCORSRequest("get", "https://www.wanikani.com/api/user/" + APIkey + "/" + requestedItem + levels);


        if (!isEmpty(xhrk)){

            xhrk.onreadystatechange = function() {
                if (xhrk.readyState == 4){

                    var kanjiList = handleReadyStateFour(xhrk,requestedItem);

                    if (requestedItem === 'kanji'){
                        localSet('User-KanjiList', kanjiList);
                        scriptLog(kanjiList);
                        //update locks in localStorage 
                        //pass kanjilist into this function
                        //(don't shift things through storage unecessarily)
                        refreshLocks();
                    }else{
                        var v = kanjiList.length;
                        scriptLog(v + " items found, attempting to import");
                        while (v--){
                            setVocItem(kanjiList[v]);
                        }
                    }
                    //------
                }
            };

            xhrk.send();
            scriptLog("below");  
        }
    } else {
        //dummy server response for testing.
        setTimeout(function () {
            var kanjiList = [];
            scriptLog("creating dummy response");
            kanjiList.push({"character": "猫", "srs": "noServerResp"});
            var SRS = "apprentice"; //prompt("enter SRS for 子", "guru");
            kanjiList.push({"character": "子", "srs": SRS});
            kanjiList.push({"character": "品", "srs": "guru"});
            kanjiList.push({"character": "供", "srs": "guru"});
            kanjiList.push({"character": "本", "srs": "guru"});
            kanjiList.push({"character": "聞", "srs": "apprentice"});
            kanjiList.push({"character": "人", "srs": "enlightened"});
            kanjiList.push({"character": "楽", "srs": "burned"});
            kanjiList.push({"character": "相", "srs": "guru"});
            kanjiList.push({"character": "卒", "srs": "noMatchWK"});
            kanjiList.push({"character": "無", "srs": "noMatchGuppy"});

            scriptLog("Server responded with dummy kanjiList: \n"+JSON.stringify(kanjiList));

            localSet('User-KanjiList', kanjiList);

            //update locks in localStorage
            refreshLocks();


        }, 10000);
    }   
}

function getComponents(kanji){
    scriptLog("getComponents(kanji)");
    //functions:
    //    none

    //takes in a string and returns an array containing only the kanji characters in the string.
    var components = [];

    for (var c = 0; c < kanji.length; c++){
        if(/^[\u4e00-\u9faf]+$/.test(kanji[c])) {
            components.push(kanji[c]);
        }
    }
    return components; 
}

function refreshLocks(){
    //functions:
    //    setLocks(srsitem)

    //scriptLog("refreshLocks()");
    if (localStorage.getItem('User-Vocab')) {

        var vocList = getSrsList();
        var i = vocList.length;
        var srsList2 = jQuery.parseJSON(localStorage.getItem('User-Vocab'));
        while(i--){
            scriptLog("vocList[i] = setLocks(vocList[i]);");
            vocList[i] = setLocks(vocList[i]);  
            scriptLog("setSrsItem(srsList[i]);");
            //Pull out list (whole thing)

            srsList2 = setSrsItem(vocList[i],srsList2);

        }
        localSet('User-Vocab', srsList2);
        //      scriptLog("Setting new locks: "+JSON.stringify(srsList));
    }else{
        scriptLog("no srs storage found");
    }
}

function getCompKanji(item, kanjiList){
    if (!kanjiList){
        kanjiList = [];
    }
    scriptLog("getCompKanji(item, kanjiList)");

    var compSRS = [];
    var kanjiReady = false; //indicates if the kanjiList has been populated
    var userGuppy = false; //indicates if kanjiList has less than 100 items
    var kanjiObj = {};

    //has the server responded yet
    if (kanjiList.length > 0){
        scriptLog("kanjiList is > 0");
        kanjiReady = true;

        //create lookup object
        for (k=0;k<kanjiList.length;k++){
            kanjiObj[kanjiList[k].character] = kanjiList[k];
        }

        //is there less than 100 kanji in the response
        if (kanjiList.length < 100){
            scriptLog("kanjiList is < 100");
            userGuppy = true;
        }
    }    

    var components = item.components;
    //for each kanji character component
    //    this is the outer loop since there will be far less of them than kanjiList
    for(var i = 0; i < components.length; i++){

        var matched = false;
        //for each kanji returned by the server
        // for(var j=0; j<kanjiList.length; j++){

        //if the kanji returned by the server matches the character in the item
        if (typeof kanjiObj[components[i]] !== 'undefined'){
            //      if (kanjiList[j].character == components[i]){
            compSRS[i] = {"kanji": components[i], "srs": kanjiObj[components[i]].srs};
            matched = true;

            // break; //kanji found: 'i' is its position in item components; 'j' is its postion in the 'kanjiList' server response
        }
        //}

        if (matched === false){ // character got all the way through kanjiList without a match.
            if (kanjiReady){ //was there a server response?
                if (userGuppy){ //is the user a guppy (kanji probably matches a turtles response)
                    scriptLog("matched=false, kanjiList.length: "+kanjiList.length);
                    compSRS[i] = {"kanji": components[i], "srs": "noMatchGuppy"};
                }else{ //user is a turtle, kanji must not have been added to WK (yet)
                    scriptLog("matched=false, kanjiList.length: "+kanjiList.length);
                    compSRS[i] = {"kanji": components[i], "srs": "noMatchWK"};
                }
            }else{
                scriptLog("matched=false, kanjiReady=false, noServerResp");
                compSRS[i] = {"kanji": components[i], "srs": "noServerResp"};
            }
        }
    }
    return compSRS; // compSRS is an array of the kanji with SRS values for each kanji component.
    // eg. 折り紙:
    // compSRS = [{"kanji": "折", "srs": "guru"}, {"kanji": "紙", "srs": "apprentice"}]
}

function createCORSRequest(method, url){
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr){
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest !== "undefined"){
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
}

function createCSV(JSONstring){
    var JSONobject = (typeof JSONstring === 'string') ? jQuery.parseJSON(JSONstring) : JSONstring;
    var key;
    var CSVarray = [];
    var header = [];  
    var id = JSONobject.length;
    if (id){//object not empty
        for (key in JSONobject[0]){
            if (JSONobject[0].hasOwnProperty(key)){
                header.push(key);
            }
        }
    }
    CSVarray.push(header.join(','));

    while(id--){
        var line = [];
        var h = header.length;
        while(h--){// only do keys in header, in the header's order. //JSONobject[id]){
            key = header[h];
            if(JSONobject[id][key] !== undefined){
                if (Array.isArray(JSONobject[id][key])){
                    //parse array here
                    line.push(JSONobject[id][key].join("\t"));
                }else{
                    line.push(JSONobject[id][key]);
                }
            }
        }line = line.reverse();
        CSVarray.push(line.join(','));
    }
    var CSVstring = CSVarray.join("\r\n");

    return encodeURI("data:text/csv;charset=utf-8," + CSVstring);
}



document.addEventListener("DOMContentLoaded", function() { hijackRequests(); });

document.addEventListener("DOMContentLoaded", function() {


    // Check for file API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {



    } else {
        alert('The File APIs are not fully supported in this browser.');
    }



    /*
 * Start the script
 */



    //unless the user navigated from the review directory, they are unlikely to have unlocked any kanji
    var noNewStuff = /^https:\/\/.*\.wanikani\.com\/.*/.test(document.referrer)&&!(/https:\/\/.*\.wanikani\.com\/review.*/.test(document.referrer));
    var usingHTTPS = /^https:/.test(window.location.href);

    if (usingHTTPS){
        if (!noNewStuff){  //Don't waste time if user is browsing site
            getServerResp(APIkey);
        }else{
            scriptLog("User is unlikely to have new kanji unlocked");
        }
        scriptInit();
    }else{
        scriptLog("Redirecting to https protocol");
        window.location.href = window.location.href.replace(/^http/, "https");
    }

});