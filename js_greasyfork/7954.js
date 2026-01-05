// ==UserScript==
// @name        WK Community Mnemonics
// @namespace   wkcm
// @description This script allows WaniKani members to contribute their own mnemonics which appear on any page that includes item info.
// @exclude		*.wanikani.com
// @exclude		*.wanikani.com/level/radicals*
// @include     *.wanikani.com/level/*
// @include     *.wanikani.com/kanji* 
// @include     *.wanikani.com/vocabulary*
// @include     *.wanikani.com/review/session
// @include     *.wanikani.com/lesson/session
// @version     0.9.7.8
// @author      Samuel H
// @grant       none

/* This script is licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) license
*  Details: http://creativecommons.org/licenses/by-nc/4.0/ */

CMVersion = "0.9.7.8";

CMIsReview = (window.location.pathname.indexOf("/review/") > -1);
CMIsLesson = (window.location.pathname.indexOf("/lesson/") > -1);
CMIsList = (!CMIsReview && !CMIsLesson && (new RegExp("level/[0-9]{1,2}$", "i").test(window.location.pathname.slice(window.location.pathname.indexOf("com/") + 2)) ||
           new RegExp("[kanji|vocabulary].[difficulty=[A-Z]$|$]", "i").test(window.location.pathname.slice(window.location.pathname.indexOf("com/") + 2))));
CMIsChrome = (navigator.userAgent.toLowerCase().indexOf('chrome') > -1);

$("head").prepend('<script src="https://rawgit.com/jsoma/tabletop/master/src/tabletop.js" type="text/javascript"></script>' +
                  '<script src="https://rawgit.com/jackmoore/autosize/v1/jquery.autosize.js" type="text/javascript"></script>');

if (CMIsReview || CMIsLesson) {
    $(document).ready(function() {
        var checkContentLoaded = setInterval(function() { 
            										if ((CMIsReview && $("#character span").html() !== "") || ($("#character").html() !== "" && $("#character").html() !== "&nbsp;")) {
            											clearInterval(checkContentLoaded);
                                                        checkCMNewestVersion(0)
        											}
                                                 }, 1000);
    });
} else {

    document.addEventListener("DOMContentLoaded", function() { checkCMNewestVersion(0); });

}

var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=1sXSNlOITCaNbXa4bUQSfk_5Uvja6qL3Wva8bPv-3B2o&output=html';

function checkCMNewestVersion(failCount) {
        
    $.ajax({
        url: "https://greasyfork.org/en/scripts/7954-wk-community-mnemonics/versions.html",
        success: function(data, textStatus, jqXHR) {
            var latestVersion = data.slice(data.indexOf('">v') + 3, data.indexOf("</a>", data.indexOf('">v') + 3));
            var versionChanges = "";
            
            if (CMVersionCheck.v !== latestVersion && CMVersion !== latestVersion) {
                CMVersionCheck.c = false;
                CMVersionCheck.v = latestVersion;
            }
            
            if (CMVersionCheck.c === false) {
                
                versionChanges = data.slice(data.indexOf("- ", data.indexOf("</time>")) + 2, data.indexOf("</li>", data.indexOf("</time>"))).trim().replace("&#39;", "'");
                
                if (latestVersion !== CMVersion && confirm('It looks like you aren\'t using the latest version of WaniKani Community Mnemonics (v' + latestVersion + ').\n\n' +
                                                           'This update contains the following change(s): \n"' + versionChanges + '"\n\nWhile it is not mandatory, it is highly recommended that you update.' +
                                                           'Will you update from v' + CMVersion + ' to v' + latestVersion + '?'))
                    window.open('https://greasyfork.org/scripts/7954-wk-community-mnemonics/code/WK%20Community%20Mnemonics.user.js', '_self');
                else CMVersionCheck.c = true;
                
            }
            
            localStorage.setItem("CMVersionCheck", JSON.stringify(CMVersionCheck));
            
            init();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            if (failCount < 3) checkCMNewestVersion(failCount + 1);
            else alert(failCount + "An error occured while trying to check the newest version of WaniKani Community Mnemonics: " + xhr.status + ": " + xhr.statusText + ". Make sure your internet connection is working " +
                       "properly and then reload the page to try again.");
        }
    });
}

function init() {
	
    if (!CMIsList) {
            
        if (CMIsReview) {
            initCMReview(false);
        } else if (CMIsLesson) {
            initCMLesson(false);
        } else {
            $('<h2>Community Meaning Mnemonic</h2><section id="cm-meaning" class="cm"><p class="loadingCM">Loading...</p></section>').insertAfter($("#note-meaning"));
            $('<h2>Community Reading Mnemonic</h2><section id="cm-reading" class="cm"><p class="loadingCM">Loading...</p></section>').insertAfter($("#note-reading"));
        }
        
    } else {
        $(".additional-info.level-list.legend li").parent().prepend(getCMLegend(true)).prepend(getCMLegend(false));
        $(".legend.level-list span.commnem").css("background-color", "#71aa00").parent().parent().parent().children("li").css("width", 188).parent().children("li:first-child, li:nth-child(6)")
        	.css("width", 187);
        $(".legend.level-list span.commnem-req").css("background-color", "#e1aa00");
    }
    
    //Start Code Credit: jsoma from Github
    try {
        Tabletop.init( { key: public_spreadsheet_url,
                        callback: showInfo,
                        simpleSheet: true } );
    } catch(e) {
        if (!CMIsReview && !CMIsLesson) $(".loadingCM").html("An error occurred while trying to access the database; reload the page to try again.");
        else alert('The following error occurred while trying to access the database: "' + e + '". If the problem persists, make sure your internet connection is working properly.');
   	}
    //End Code Credit
}

function initCMList() {
    initCMTableItems();
    if (CMIndex === 0) {
        CMType = "k";
        $("#level-" + window.location.pathname.slice(window.location.pathname.lastIndexOf("/") + 1) + "-kanji .character-item").each(checkCMComMnem);
        CMType = "v";
        $("#level-" + window.location.pathname.slice(window.location.pathname.lastIndexOf("/") + 1) + "-vocabulary .character-item").each(checkCMComMnem);
    } else {
        if (CMIndex === 1) {
            CMType = "k";
       		$(".character-item").each(checkCMComMnem);
        } else {
            CMType = "v";
        	$(".character-item").each(checkCMComMnem);
        }
    }
    
    $("head").append('<style type="text/css">' +
                         '.commnem-badge, .commnem-badge-req { position: absolute; left: 0 } ' +
                     '.commnem-badge:before, .commnem-badge-req:before { ' +
                         'content: "\\5171\"; display: block; position: absolute; top: -0.6em; left: -0.6em; width: 2em; height: 2em; color: #fff; font-size: 16px; font-weight: normal; ' +
						'line-height: 2.2em; -webkit-box-shadow: 0 -2px 0 rgba(0,0,0,0.2) inset,0 0 10px rgba(255,255,255,0.5); ' +
                         '-moz-box-shadow: 0 -2px 0 rgba(0,0,0,0.2) inset,0 0 10px rgba(255,255,255,0.5); box-shadow: 0 -2px 0 rgba(0,0,0,0.2) inset,0 0 10px rgba(255,255,255,0.5); ' +
                         '-webkit-border-radius: 50%; -moz-border-radius: 50%; border-radius: 50%; z-index: 999 }' +
                         'ul.multi-character-grid .commnem-badge:before, ul.multi-character-grid .commnem-badge-req:before { top: 1.1em; left: -1.1em; font-size: 11px; text-align: center }' +
                     '.commnem-badge:before { background-color: #71aa00; text-shadow: 0 2px 0 #1a5300; }' +
                     '.commnem-badge-req:before { background-color: #e1aa00; text-shadow: 0 2px 0 #7a5300 }</style>');
    $(".commnem-badge, .commnem-badge-req").fadeIn();
}

function checkCMComMnem() {
    CMChar = $(this).children("a").children(".character").text();
    CMIndex = getCMIndex() + 2;
    if (CMIndex > 1 && CMData[CMType][CMChar] !== undefined) {
        if (!CMInitData) {
            if (!CMDataMatch(CMData[CMType][CMChar])) {
                CMData[CMType][CMChar].m.t = CMTableData[CMIndex - 2].Meaning_Mnem.split("|");
                CMData[CMType][CMChar].m.u = CMTableData[CMIndex - 2].Meaning_User.split("|");
                CMData[CMType][CMChar].r.t = CMTableData[CMIndex - 2].Reading_Mnem.split("|");
                CMData[CMType][CMChar].r.u = CMTableData[CMIndex - 2].Reading_User.split("|");
            } else CMDataConvert();
        }
        if (CMData[CMType][CMChar].m.t[0].length > 0 || CMData[CMType][CMChar].r.t[0].length > 0 || CMData[CMType][CMChar].m.t[0] == "!" || CMData[CMType][CMChar].r.t[0] == "!") {
            var isReq = (CMData[CMType][CMChar].m.t[0] == "!" || CMData[CMType][CMChar].r.t[0] == "!");
            if (($(this).children(".recently-unlocked-badge").length > 0)) $(getCMBadge(true, isReq)).insertAfter($(this).children("span")).hide().prev().css("top", "-0.5em");
            else $(getCMBadge(false, isReq)).insertAfter($(this).children("span")).hide();
        }
    }
}

function getCMLegend(isReq) {
    return $('<li><div><span class="commnem' + ((isReq) ? "-req" : "") + '" lang="ja">共</span></div>' + ((isReq) ? "Mnemonic Requested" : "Community Mnemonics") + '</li>');
}

function getCMBadge(isRecent, isReq) {
    return $('<span lang="ja" ' + ((isRecent) ? ' style="top: ' + ((CMType == "k") ? '2.25em" ' : '1em" ') : '') + 'class="item-badge commnem-badge' + ((isReq) ? "-req" : "") + '"></span>');
}

function initCMReview(isLessonQuiz) {
    if (isLessonQuiz) {
        CMIsReview = true;
        
        $("#cm-meaning, #cm-reading").prev().remove();
        $("#cm-meaning, #cm-reading").remove();
        
        $("#supplement-nav li:nth-child(2), #supplement-nav li:nth-child(3)").off("click", clickCMLessonTab);
        $("#supplement-nav li:last-child").off("click", clickLastLessonTab);
        $("#batch-items li:not(.active)").off("click", clickCMLessonItem);
        
        var checkFirstItemLoaded = setInterval(function() {
            if ((!isLessonQuiz && $("#character span").html() !== "" && $("#character span").html() !== undefined) || (isLessonQuiz && $("#character").html() !== "" && $("#character").html() !== undefined))
                clearInterval(checkFirstItemLoaded);
                newCMReviewItem();
        }, 300);
    }
    
    $("#user-response").next().on("click", clickCMReviewSubmit);
    $("#all-info").on("click", clickCMReviewAllInfo);
}

function clickCMReviewSubmit() {
    if ($(this).prev().attr("disabled") == "disabled") {
        
        var oldChar = CMChar;
        var oldType = CMType;
        
        if (!CMIsLesson) {
            CMChar = decodeURIComponent($("#character span").html());
            CMType = $("#character").attr("class") !== "radical" ? (($("#character").attr("class") == "kanji") ? "k" : "v") : "r";
        } else {
            CMChar = decodeURIComponent($("#character").html());
            CMType = $("#main-info").attr("class") !== "radical" ? (($("#main-info").attr("class") == "kanji") ? "k" : "v") : "r";
        }
        
        if (oldChar !== CMChar || oldType !== CMType) {
            CMReady = false;
            newCMReviewItem();
        }
        
        var checkInfoLoaded = setInterval(function() {
            if (CMReady && !$("#screen-lesson-ready").is(":visible") && $("#item-info-col2").html().length > 0 && $("#option-item-info").hasClass("active") &&
                $("#additional-content-load").css("display") !== "block") {
                clearInterval(checkInfoLoaded);
                if ($("#cm-meaning").length == 0 && $("#cm-reading").length == 0) {
                    $('<h2>Community Meaning Mnemonic</h2><section id="cm-meaning" class="cm"><p class="loadingCM">Loading...</p></section>')
                    .insertAfter($("#note-meaning"));
                    $('<h2>Community Reading Mnemonic</h2><section id="cm-reading" class="cm"><p class="loadingCM">Loading...</p></section>')
                    .insertAfter($("#note-reading"));
                    if (CMType !== "r") loadCM(false, false);
                } else if ($("#item-info-col2 #cm-meaning").length === 0 && $("#item-info-col2 #cm-reading").length === 0) {
                    var checkPreloadReady = setInterval(function() {
                        if (CMPreloadReady) {
                            clearInterval(checkPreloadReady);
                            CMReady = false;
                            var meaning = $("#cm-meaning-container").detach();
                            var reading = $("#cm-reading-container").detach();
                            meaning.insertAfter($("#note-meaning")).children("h2, div").unwrap();
                            reading.insertAfter($("#note-reading")).children("h2, div").unwrap();
                            updateCMMargins(true, true);
                        }
                    }, 250);
                }
                if ($("#all-info").css("display") !== "none") {
                    if (!$("#question-type").hasClass("meaning") || CMType == "r") $("#cm-meaning").hide().prev().hide();
                    if (!$("#question-type").hasClass("reading") || CMType == "r") $("#cm-reading").hide().prev().hide();
                }
            } else if ($("#screen-lesson-ready").is(":visible") || $("#quiz").css("display") == "none") {
                clearInterval(checkInfoLoaded);
                if (CMIsReview) initCMLesson(true);
            } else if (CMReady && $("#cm-meaning").length === 0 && $("#cm-reading").length === 0) {
                $("#information")
                .append($('<div id="cm-meaning-container" style="display: none"><h2>Community Meaning Mnemonic</h2><section id="cm-meaning" class="cm"><p class="loadingCM">Loading...</p></section></div>'))
                .append($('<div id="cm-reading-container" style="display: none"><h2>Community Reading Mnemonic</h2><section id="cm-reading" class="cm"><p class="loadingCM">Loading...</p></section></div>'));
                if (CMType !== "r") loadCM(false, false);
            }
    	}, 500);
        $("#user-response").next().one("click", function() {
            setTimeout(function() {
                if (CMReady && !$("#screen-lesson-ready").is(":visible")) clearInterval(checkInfoLoaded);
            }, 500);
        });
    } else {
        setTimeout(function() {
            $("#cm-meaning-container").remove();
            $("#cm-reading-container").remove();
            CMReady = false;
            newCMReviewItem();
        }, 300);
    }
}

function clickCMReviewAllInfo() {
    $("#note-meaning + h2").show();
    $("#note-reading + h2").show();
    updateCMMargins(true, true);
}

function newCMReviewItem() {
    
    CMPreloadReady = false;
    
    if (!CMIsLesson) {
    	CMChar = decodeURIComponent($("#character span").html());
    	CMType = $("#character").attr("class") !== "radical" ? (($("#character").attr("class") == "kanji") ? "k" : "v") : "r";
    } else {
        CMChar = decodeURIComponent($("#character").html());
        CMType = $("#main-info").attr("class") !== "radical" ? (($("#main-info").attr("class") == "kanji") ? "k" : "v") : "r";
    }
    
    if (CMType !== "r") {
        $("#cm-meaning, #note-meaning + h2").remove();
        $("#cm-reading, #note-reading + h2").remove();
        if (CMData[CMType][CMChar] === undefined) {
            CMIndex = Object.keys(CMData.k).length + Object.keys(CMData.v).length + 2;
            CMSettings[CMType][CMChar] = {"m": {"p": "", "c": false}, "r": {"p": "", "c": false}};
            CMVotes[CMType][CMChar] = {"m": [], "r": []};
            CMData[CMType][CMChar] = {"i": CMIndex, "m": {"t": [""], "s": [], "u": [""]}, "r": {"t": [""], "s": [], "u": [""]}};
            CMPageIndex = {"m": 0, "r": 0};
            CMSortMap = getCMSortMap([], []);
            CMPageMap = getCMPageMap([], []);
            checkCMTableChanges(true);
            var checkPostReady = setInterval(function() {
                if (CMPostReady) {
                    clearInterval(checkPostReady);
                    postCM(0);
                }
            }, 200);
        } else {
            checkCMTableChanges(false);
            if (!CMInitData) CMDataConvert();
            CMSortMap = getCMSortMap(CMData[CMType][CMChar].m.s, CMData[CMType][CMChar].r.s);
            CMPageMap = getCMPageMap(CMData[CMType][CMChar].m.u, CMData[CMType][CMChar].r.u);
            CMSettingsCheck();
            if (CMVotes[CMType][CMChar] === undefined) CMVotes[CMType][CMChar] = {"m": [], "r": []};
        }
        if (CMData[CMType][CMChar] !== undefined) CMPageIndex = {"m": $.inArray( CMPageMap.m[CMSettings[CMType][CMChar].m.p], CMSortMap.m ),
                                                                 "r": $.inArray( CMPageMap.r[CMSettings[CMType][CMChar].r.p], CMSortMap.r )};
    }
}

function initCMLesson(fromLessonQuiz) {
    if (fromLessonQuiz) {
        CMIsReview = false;
        $("#user-response").next().off("click", clickCMReviewSubmit);
        $("#all-info").off("click", clickCMReviewAllInfo);
    }
    
    var checkLessonReady = setInterval(function() {
        if (!$("#screen-lesson-ready").is(":visible")) {
            clearInterval(checkLessonReady);
            
            if (fromLessonQuiz) {
                CMChar = decodeURIComponent($("#character").html());
                CMType = (($("#main-info").attr("class") !== "radical") ? (($("#main-info").attr("class") == "kanji") ? "k" : "v") : "r");
                
                if (CMType !== "r") {
                    $('<h2>Community Meaning Mnemonic</h2><div id="cm-meaning" class="cm"><p class="loadingCM">Loading...</p></div>')
                    .insertAfter($("#supplement-" + ((CMType == "k") ? "kan" : "voc") + "-meaning-notes"));
                    $('<h2>Community Reading Mnemonic</h2><div id="cm-reading" class="cm"><p class="loadingCM">Loading...</p></div>')
                    .insertAfter($("#supplement-" + ((CMType == "k") ? "kan" : "voc") + "-reading-notes"));
                }
                
                if (CMData[CMType][CMChar] === undefined) {
                    CMIndex = Object.keys(CMData.k).length + Object.keys(CMData.v).length + 2;
                    CMSettings[CMType][CMChar] = {"m": {"p": "", "c": false}, "r": {"p": "", "c": false}};
                    CMVotes[CMType][CMChar] = {"m": [], "r": []};
                    CMData[CMType][CMChar] = {"i": CMIndex, "m": {"t": [""], "s": [], "u": [""]}, "r": {"t": [""], "s": [], "u": [""]}};
                    CMPageIndex = {"m": 0, "r": 0};
                    CMSortMap = getCMSortMap([], []);
                    CMPageMap = getCMPageMap([], []);
                    checkCMTableChanges(true);
                    var checkPostReady = setInterval(function() {
                        if (CMPostReady) {
                            clearInterval(checkPostReady);
                            postCM(0);
                        }
                    }, 200);
                } else {
                    checkCMTableChanges(false);
                    if (!CMInitData) CMDataConvert();
                    CMSortMap = getCMSortMap(CMData[CMType][CMChar].m.s, CMData[CMType][CMChar].r.s);
                    CMPageMap = getCMPageMap(CMData[CMType][CMChar].m.u, CMData[CMType][CMChar].r.u);
                    CMSettingsCheck();
                    if (CMVotes[CMType][CMChar] === undefined) CMVotes[CMType][CMChar] = {"m": [], "r": []};
                }
                if (CMData[CMType][CMChar] !== undefined) CMPageIndex = {"m": $.inArray( CMPageMap.m[CMSettings[CMType][CMChar].m.p], CMSortMap.m ),
                                                                     "r": $.inArray( CMPageMap.r[CMSettings[CMType][CMChar].r.p], CMSortMap.r )};
                loadCM(false, false);
            }
            
            $("#supplement-nav li:nth-child(2), #supplement-nav li:nth-child(3)").on("click", clickCMLessonTab);
            $("#supplement-nav li:last-child").on("click", clickLastLessonTab);
            $("#batch-items li:not(.active)").on("click", clickCMLessonItem);
        }
    }, 300);
}

function clickCMLessonItem() {
    CMReady = false;
    setTimeout(function() {
        var prevType = CMType;
        CMChar = decodeURIComponent($("#character").html());
        CMType = ($("#main-info").attr("class") !== "radical") ? (($("#main-info").attr("class") == "kanji") ? "k" : "v") : "r";
        if (CMType !== "r") {
            if (CMType !== prevType) {
                $("#cm-meaning, #cm-reading").prev().remove();
                $("#cm-meaning, #cm-reading").remove();
                $('<h2>Community Meaning Mnemonic</h2><div id="cm-meaning" class="cm"><p class="loadingCM">Loading...</p></div>')
                .insertAfter($("#supplement-" + ((CMType == "k") ? "kan" : "voc") + "-meaning-notes"));
                $('<h2>Community Reading Mnemonic</h2><div id="cm-reading" class="cm"><p class="loadingCM">Loading...</p></div>')
                .insertAfter($("#supplement-" + ((CMType == "k") ? "kan" : "voc") + "-reading-notes"));
            } else $("#cm-meaning, #cm-reading").html('<p class="loadingCM">Loading...</p>');
            if (CMData[CMType][CMChar] === undefined) {
                CMIndex = Object.keys(CMData.k).length + Object.keys(CMData.v).length + 2;
                CMSettings[CMType][CMChar] = {"m": {"p": "", "c": false}, "r": {"p": "", "c": false}};
                CMVotes[CMType][CMChar] = {"m": [], "r": []};
                CMData[CMType][CMChar] = {"i": CMIndex, "m": {"t": [""], "s": [], "u": [""]}, "r": {"t": [""], "s": [], "u": [""]}};
                CMPageIndex = {"m": 0, "r": 0};
                CMSortMap = getCMSortMap([], []);
                CMPageMap = getCMPageMap([], []);
                checkCMTableChanges(true);
                var checkPostReady = setInterval(function() {
                    if (CMPostReady) {
                        clearInterval(checkPostReady);
                        postCM(0);
                    }
                }, 200);
            } else {
                checkCMTableChanges(false);
                if (!CMInitData) CMDataConvert();
                CMSortMap = getCMSortMap(CMData[CMType][CMChar].m.s, CMData[CMType][CMChar].r.s);
                CMPageMap = getCMPageMap(CMData[CMType][CMChar].m.u, CMData[CMType][CMChar].r.u);
                CMSettingsCheck();
                if (CMVotes[CMType][CMChar] === undefined) CMVotes[CMType][CMChar] = {"m": [], "r": []};
            }
            if (CMData[CMType][CMChar] !== undefined) CMPageIndex = {"m": $.inArray( CMPageMap.m[CMSettings[CMType][CMChar].m.p], CMSortMap.m ),
                                                                     "r": $.inArray( CMPageMap.r[CMSettings[CMType][CMChar].r.p], CMSortMap.r )};
            loadCM(false, false);
        }
        $("#supplement-nav li:last-child").off("click", clickLastLessonTab).on("click", clickLastLessonTab);
    }, 200);
}

function clickCMLessonTab() {
    var failCount = 0;
    var checkReady = setInterval(function() {
        if (CMReady) {
            clearInterval(checkReady);
            var failCount = 0;
            if ($(this).attr("data-index") == 1) {
                var checkMeaningVisible = setInterval(function() {
                    if ($("#cm-meaning p").width() > 0) {
                        clearInterval(checkMeaningVisible);
                        updateCMMargins(true, false);
                    } else if (failCount < 30) failCount++;
                        else clearInterval(checkMeaningVisible);
                }, 100);
            } else {
                var checkReadingVisible = setInterval(function() {
                    if ($("#cm-reading p").width() > 0) {
                        clearInterval(checkReadingVisible);
                        updateCMMargins(false, true);
                    } else if (failCount < 30) failCount++;
                        else clearInterval(checkReadingVisible);
                }, 100);
            }
        } else if (failCount < 10) failCount++;
        else clearInterval(checkReady);
    }, 200);
}

function clickLastLessonTab() {
    if ($("#batch-items .read").length >= $("#batch-items li").length - 2) {
        var checkLessonQuiz = setInterval(function() {
            if ($("#quiz").css("display") !== "none") {
                clearInterval(checkLessonQuiz);
                initCMReview(true);
            }
        }, 500);
        
        $("#supplement-nav li").one("click", function() {
            clearInterval(checkLessonQuiz);
        });
    }
}

function showInfo(data, tabletop) {
    
    var curItem = "";
    var curType = "";
    var curM = [];
    var curR = [];
    var curMText = "";
    var curRText = "";
    var curMScores = 0;
    var curRScores = 0;
    var curMUsers = "";
    var curRUsers = "";
    var curMLength = 0;
    var curRLength = 0;
    var curSortMap = [];
    var curPageMap = [];
    var newItem = true;
    var addItems = Object.keys(data).length;
    
    CMTableData = data;
    
    if (!CMIsList) {
        
        CMChar = (CMIsReview) ? decodeURIComponent($("#character span").html()) : ((CMIsLesson) ? decodeURIComponent($("#character").html()) :
            decodeURIComponent(window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1)));
        CMType = (CMIsReview) ? (($("#character").attr("class") !== "radical") ? (($("#character").attr("class") == "kanji") ? "k" : "v") : "r") :
            ((CMIsLesson) ? (($("#main-info").attr("class") !== "radical") ? (($("#main-info").attr("class") == "kanji") ? "k" : "v") : "r") : ((window.location.pathname.indexOf("kanji") > -1) ? "k" : "v"));
        
        for (var a = 0; a < Object.keys(data).length; a++) {
            if (data[a].Item.substring(1) == CMChar && data[a].Item.substring(0, 1) == CMType) {
                newItem = false;
                CMIndex = a + 2;
                break;
            }
        }
            
    } else {
        
        var urlString = window.location.pathname;
        
        newItem = false;
        
        if ((urlString).indexOf("/level/") > -1) CMIndex = 0;
        else {
            if ((urlString).indexOf("/kanji") > -1) CMIndex = 1;
            else CMIndex = 2;
        }
    }
    
    if (CMInitSettings || CMInitVotes) CMInitData = true;

    if (!CMInitData && !newItem && Object.keys(data).length > (Object.keys(CMData.k).length + Object.keys(CMData.v).length)) {
        var lastItem = data[Object.keys(CMData.k).length + Object.keys(CMData.v).length - 1].Item;
        if (lastItem == "k" + Object.keys(CMData.k)[Object.keys(CMData.k).length - 1] || lastItem == "v" + Object.keys(CMData.v)[Object.keys(CMData.v).length - 1]) addItems = Object.keys(CMData.k).length + Object.keys(CMData.v).length;
        else {
            CMInitData = true;
            CMData = {"k": [], "v": []};
        }
    } else if (!CMInitData && Object.keys(data).length < (Object.keys(CMData.k).length + Object.keys(CMData.v).length)) {
        CMInitData = true;
        CMData = {"k": [], "v": []};
    }
    
    for (var d = 0; d < Object.keys(data).length; d++) {
        
        if (CMInitData || d + 2 == CMIndex || d >= addItems) {
        	
            curItem = data[d].Item.substring(1);
        	curType = data[d].Item.substring(0, 1);
            curMText = data[d].Meaning_Mnem.split("|");
            curRText = data[d].Reading_Mnem.split("|");
            curMScores = data[d].Meaning_Score.split("|");
            curRScores = data[d].Reading_Score.split("|");
            curMUsers = data[d].Meaning_User.split("|");
            curRUsers = data[d].Reading_User.split("|");
            curMLength = curMUsers.length;
            curRLength = curRUsers.length;
            
            if (!CMIsList && !newItem && d + 2 == CMIndex) {
                if (CMData[CMType][CMChar] == undefined) {
                    CMData[CMType][CMChar] = {"m": {"t": curMText, "s": curMScores, "u": curMUsers}, "r": {"t": curRText, "s": curRScores, "u": curRUsers}};
                }
                if (!CMInitData) CMDataConvert();
                CMSortMap = getCMSortMap(curMScores, curRScores);
                CMPageMap = getCMPageMap(curMUsers, curRUsers);
            }
            
            curSortMap = (d + 2 !== CMIndex) ? getCMSortMap(curMScores, curRScores) : CMSortMap;
            curPageMap = (d + 2 !== CMIndex) ? getCMPageMap(curMUsers, curRUsers) : CMPageMap;

            if (CMInitSettings || CMSettings[curType][curItem] === undefined ) CMSettings[curType][curItem] = {"m": {"p": ((curMLength > 0) ? curMUsers[curSortMap.m[0]] : ""),
                "c": ((($.inArray( CMUser, curMUsers )) > -1))}, "r": {"p": ((curRLength > 0) ? curRUsers[curSortMap.r[0]] : ""), "c": (($.inArray( CMUser, curRUsers )) > -1)}};
            else {
                if (($.inArray( CMSettings[curType][curItem].m.p, curMUsers )) < 0) CMSettings[curType][curItem].m.p = curMUsers[curSortMap.m[0]];
                if (($.inArray( CMSettings[curType][curItem].r.p, curRUsers )) < 0) CMSettings[curType][curItem].r.p = curRUsers[curSortMap.r[0]];
                CMSettings[curType][curItem].m.c = (($.inArray( CMUser, curMUsers )) > -1);
                CMSettings[curType][curItem].r.c = (($.inArray( CMUser, curRUsers )) > -1);
            }
            if (CMInitVotes || CMVotes[curType][curItem] === undefined) {
                CMVotes[curType][curItem] = {"m": [], "r": []};
                for (var mv = 0; mv < curMLength; mv++) CMVotes[curType][curItem].m[curMUsers[mv] + ":" + curMText[mv]] = 0;
                for (var rv = 0; rv < curRLength; rv++) CMVotes[curType][curItem].r[curRUsers[rv] + ":" + curRText[rv]] = 0;
            }
            
            for (var ms = 0; ms < curMLength; ms++) curMScores[ms] = parseInt(curMScores[ms]);
            for (var rs = 0; rs < curRLength; rs++) curRScores[rs] = parseInt(curRScores[rs]);
            
            CMData[curType][curItem] = {"i": d + 2, "m": {"t": curMText, "s": curMScores, "u": curMUsers}, "r": {"t": curRText, "s": curRScores, "u": curRUsers}};
                                        
            curM = [];
            curR = [];
            
            if (!CMInitData && addItems == Object.keys(data).length) break;
            
        }
    }
    
    if (newItem) {
        if (CMChar.length > 0 && CMChar !== "&nbsp" && CMType !== "r") {
            CMIndex = (CMInitSettings) ? d : Object.keys(data).length + 2;
            CMSettings[CMType][CMChar] = {"m": {"p": "", "c": false}, "r": {"p": "", "c": false}};
            CMVotes[CMType][CMChar] = {"m": [], "r": []};
            CMData[CMType][CMChar] = {"i": d + 2, "m": {"t": [""], "s": [], "u": [""]}, "r": {"t": [""], "s": [], "u": [""]}};
            CMSortMap = getCMSortMap([], []);
            CMPageMap = getCMPageMap([], []);
            CMPageIndex.m = 0;
        	CMPageIndex.r = 0;
            postCM(0);
        }
    } else {
        if (!CMIsList) CMPageIndex = {"m": $.inArray( CMPageMap.m[CMSettings[CMType][CMChar].m.p], CMSortMap.m ), "r": $.inArray( CMPageMap.r[CMSettings[CMType][CMChar].r.p], CMSortMap.r )};
        CMReady = true;
    }
    
    saveCMData();
    saveCMSettings();
    if (CMInitVotes) saveCMVotes();
    
    if (CMIsLesson) {
        if (CMType !== "r") {
            $('<h2>Community Meaning Mnemonic</h2><div id="cm-meaning" class="cm"><p class="loadingCM">Loading...</p></div>')
                .insertAfter($("#supplement-" + ((CMType == "k") ? "kan" : "voc") + "-meaning-notes"));
            $('<h2>Community Reading Mnemonic</h2><div id="cm-reading" class="cm"><p class="loadingCM">Loading...</p></div>')
                .insertAfter($("#supplement-" + ((CMType == "k") ? "kan" : "voc") + "-reading-notes"));
    	}
    }
    
    if (!CMIsReview && !CMIsList) loadCM(false, false);
    else if (CMIsList) initCMList();
}

function updateCMText(isMeaning) {
    var isMeaningStr = ((isMeaning) ? "m" : "r");
    
    $("#cm-" + ((isMeaning) ? "meaning" : "reading") + " .cm-mnem-text").html(CMData[CMType][CMChar][isMeaningStr].t[CMSortMap[isMeaningStr][CMPageIndex[isMeaningStr]]] +
                        '<br />by <a href="https://www.wanikani.com/community/people/' + CMData[CMType][CMChar][isMeaningStr].u[CMSortMap[isMeaningStr][CMPageIndex[isMeaningStr]]] + '" target="_blank">' +
                        CMData[CMType][CMChar][isMeaningStr].u[CMSortMap[isMeaningStr][CMPageIndex[isMeaningStr]]] + '</a>');
    
    checkCMTextHighlight(isMeaning);
    
    if (CMData[CMType][CMChar][isMeaningStr].u[CMSortMap[isMeaningStr][CMPageIndex[isMeaningStr]]] == CMUser) $("#cm-" + ((isMeaning) ? "meaning" : "reading") + "-user-buttons div").removeClass("disabled");
    else $("#cm-" + ((isMeaning) ? "meaning" : "reading") + "-user-buttons div").addClass("disabled");
    
    updateCMMargins(isMeaning, !isMeaning);
    
    $("#cm-" + ((isMeaning) ? "meaning" : "reading") + "-score-num").html(CMData[CMType][CMChar][isMeaningStr].s[CMSortMap[isMeaningStr][CMPageIndex[isMeaningStr]]]);
    
    if (CMData[CMType][CMChar][isMeaningStr].s[CMSortMap[isMeaningStr][CMPageIndex[isMeaningStr]]] !== 0) {
        if (CMData[CMType][CMChar][isMeaningStr].s[CMSortMap[isMeaningStr][CMPageIndex[isMeaningStr]]] > 0) $("#cm-" + ((isMeaning) ? "meaning" : "reading") + "-score-num").removeClass("neg").addClass("pos");
        else $("#cm-" + ((isMeaning) ? "meaning" : "reading") + "-score-num").removeClass("pos").addClass("neg");
    } else $("#cm-" + ((isMeaning) ? "meaning" : "reading") + "-score-num").removeClass("pos").removeClass("neg");
}

function updateCMMargins(meaning, reading) {
   
    if (meaning) {
        $("#cm-meaning-info").css("margin-top", ($("#cm-meaning .cm-mnem-text").height() + 20 + ((CMIsReview || CMIsLesson) ? ((CMIsReview) ? 5 : 3) : 0)) + "px");
        $("#cm-meaning-user-buttons").css({"margin-top": "-20px"});
        $("#cm-meaning-next").css("margin-left", Math.min($("#cm-meaning .cm-mnem-text").width() + $("#cm-meaning-next").width() + 40,
                                                         		  $("#cm-meaning").width() - $("#cm-meaning-next").width() - 10) + "px");
    }
    if (reading) {
        $("#cm-reading-info").css("margin-top", ($("#cm-reading .cm-mnem-text").height() + 20 + ((CMIsReview || CMIsLesson) ? ((CMIsReview) ? 5 : 3) : 0)) + "px");
        $("#cm-reading-user-buttons").css({"margin-top": "-20px"});
        $("#cm-reading-next").css("margin-left", Math.min($("#cm-reading .cm-mnem-text").width() + $("#cm-reading-next").width() + 40,
                                  								  $("#cm-reading").width() - $("#cm-reading-next").width() - 10) + "px");
    }
}

function checkCMTextHighlight(isMeaning) {
    if (!CMIsReview && !CMIsLesson) {
        $("#cm-" + ((isMeaning) ? "meaning" : "reading") + " .cm-mnem-text").children("[class]").each(function() {
            if ($(this).attr("class").slice($(this).attr("class").indexOf("-") + 1) !== "highlight") $(this).attr("class", $(this).attr("class").slice($(this).attr("class").indexOf("-") + 1) + "-highlight");
        });
    }
}

function checkCMHTMLTags(text) {
    
    var isValid = true;
    var tags = ["b", "i", "u", "s", "span"];
    var regOpen;
    var regClose;
    var regBR;
    
    if (!new RegExp("<(a|script)", "ig").test($("#cm-reading-text").val())) {
        
        for (var c = 0; c < tags.length; c++) {
            
            if (tags[c] !== "span") {
                regOpen = new RegExp("<" + tags[c] + ">", "ig");
                regClose = new RegExp("</" + tags[c] + ">", "ig");
            } else {
                regOpen = new RegExp("<" + tags[c], "ig");
                regClose = new RegExp("</" + tags[c], "ig");
            }
            
            if (text.match(regOpen) !== null && text.match(regClose) !== null) {
                if (text.match(regOpen).length !== text.match(regClose).length) isValid = false;
            } else if (text.match(regOpen) !== null || text.match(regClose) !== null) isValid = false;
                
            if (!isValid) break;
            
        }
        
    } else return false;
        
    return isValid;
}

function checkCMTableChanges(post) {
    CMPostReady = false;
    try {
        Tabletop.init( { key: public_spreadsheet_url,
                        callback: onTableLoaded,
                        simpleSheet: true } );
    } catch(e) {
        if (!CMIsReview) $(".loadingCM").html("An error occurred while trying to access the database; reload the page to try again.");
        else alert('The following error occurred while trying to access the database: "' + e + '". If the problem persists, make sure your internet connection is working properly.');
   	}
    
    function onTableLoaded(data, tabletop) {
        CMTableData = data;
        initCMTableItems()
        CMIndex = getCMIndex() + 2;
        if (CMIndex < 2) CMIndex += data.length + 1;
        if (post) CMPostReady = true;
        else {
            if (!CMInitData && CMIndex < CMTableData.length) {
                if (!CMDataMatch(CMData[CMType][CMChar])) {
                    CMData[CMType][CMChar].m.t = CMTableData[CMIndex].Meaning_Mnem.split("|");
                    CMData[CMType][CMChar].m.u = CMTableData[CMIndex].Meaning_User.split("|");
                    CMData[CMType][CMChar].r.t = CMTableData[CMIndex].Reading_Mnem.split("|");
                    CMData[CMType][CMChar].r.u = CMTableData[CMIndex].Reading_User.split("|");
                    CMVotes[CMType][CMChar] = getCMVotes();
                } else CMDataConvert();
            }
            CMReady = true;
        }
    }
}

function initCMTableItems() {
    CMTableItems = [];
    for (var i = 0; i < CMTableData.length; i++) CMTableItems[i] = CMTableData[i].Item;
}

function getCMIndex() {
    return $.inArray(CMType + CMChar, CMTableItems);
}

function checkCMVotes(meaning, reading) {
    if (meaning && CMData[CMType][CMChar].m.t.length > 0 && CMVotes[CMType][CMChar].m[CMData[CMType][CMChar].m.u[CMSortMap.m[CMPageIndex.m]] + ":" + CMData[CMType][CMChar].m.t[CMSortMap.m[CMPageIndex.m]]] === undefined) {
        if (CMData[CMType][CMChar].m.t[0] !== "!") {
            CMVotes[CMType][CMChar].m[CMData[CMType][CMChar].m.u[CMSortMap.m[CMPageIndex.m]] + ":" + CMData[CMType][CMChar].m.t[CMSortMap.m[CMPageIndex.m]]] = 0;
            saveCMVotes();
        }
    }
    
    if (reading && CMData[CMType][CMChar].r.t.length > 0 && CMVotes[CMType][CMChar].r[CMData[CMType][CMChar].r.u[CMSortMap.r[CMPageIndex.r]] + ":" + CMData[CMType][CMChar].r.t[CMSortMap.r[CMPageIndex.r]]] === undefined) {
        if (CMData[CMType][CMChar].r.t[0] !== "!") {
            CMVotes[CMType][CMChar].r[CMData[CMType][CMChar].r.u[CMSortMap.r[CMPageIndex.r]] + ":" + CMData[CMType][CMChar].r.t[CMSortMap.r[CMPageIndex.r]]] = 0;
            saveCMVotes();
        }
    }
}

function getCMVotes() {
    var votes = {"m": [], "r": []};
    for (var mv = 0; mv < CMData[CMType][CMChar].m.t.length; mv++) {
        if (votes.m[CMData[CMType][CMChar].m.u[mv] + ":" + CMData[CMType][CMChar].m.t[mv]] === undefined)
            votes.m[CMData[CMType][CMChar].m.u[mv] + ":" + CMData[CMType][CMChar].m.t[mv]] = 0;
    }
    for (var rv = 0; rv < CMData[CMType][CMChar].r.t.length; rv++) {
        if (votes.r[CMData[CMType][CMChar].r.u[rv] + ":" + CMData[CMType][CMChar].r.t[rv]] === undefined)
            votes.r[CMData[CMType][CMChar].r.u[rv] + ":" + CMData[CMType][CMChar].r.t[rv]] = 0;
    }
    return votes;
}

function getCMSortMap(MScores, RScores) {
    var sortMap = {"m": [], "r": []};
    var MScoresSorted = [];
    var RScoresSorted = [];
        
    if (MScores[0] !== undefined && MScores[0] !== null) {
        
        MScoresSorted = MScores.slice(0).sort(sortByScore);
        
        for (var mu = 0; mu < MScores.length; mu++) {
            for (var ms = 0; ms < MScores.length; ms++) {
                if (sortMap.m[ms] == undefined && MScores[mu] == MScoresSorted[ms]) {
                    sortMap.m[ms] = mu;
                    break;
                }
            }
        }
        
    }
    
    if (RScores[0] !== undefined && RScores[0] !== null) {
        
        RScoresSorted = RScores.slice(0).sort(sortByScore);
        
        for (var ru = 0; ru < RScores.length; ru++) {
            for (var rs = 0; rs < RScores.length; rs++) {
                if (sortMap.r[rs] == undefined && RScores[ru] == RScoresSorted[rs]) {
                    sortMap.r[rs] = ru;
                    break;
                }
            }
        }
        
    }
    
    function sortByScore(a, b) {
        return b - a;
    }
    
    return sortMap;
}

function getCMPageMap(MUsers, RUsers) {
    var pageMap = {"m": {"": 0}, "r": {"": 0}};
    
    for (var m = 0; m < MUsers.length; m++) pageMap.m[MUsers[m]] = m;
    for (var r = 0; r < RUsers.length; r++) pageMap.r[RUsers[r]] = r;
    
    return pageMap;
}

function getCMContent(item, itemType, mnemType) {
    var CMItem = null;
    var CMMnemType = (mnemType == "m") ? "meaning" : "reading";
    var CMContent = '<p';
    var CMLen = CMData[itemType][item][mnemType].t.length;
    var CMPage = CMPageIndex[mnemType];
    if (CMData[itemType][item][mnemType].t[0].length > 0 && CMData[itemType][item][mnemType].t[0] !== "!") {
        CMItem = CMData[itemType][item][mnemType];
        CMContent = '<div id="cm-' + CMMnemType + '-prev" class="cm-prev'   + ((CMLen > 1 && CMPage > 0) ? "" : " disabled") + '"><span>◄</span></div>' + CMContent +  ' class="cm-mnem-text">' + CMItem.t[CMSortMap[mnemType][CMPage]] +
            '<br />by <a href="https://www.wanikani.com/community/people/' + CMItem.u[CMSortMap[mnemType][CMPage]] + '" target="_blank" >' +
            CMItem.u[CMSortMap[mnemType][CMPage]] + '</a></p><div id="cm-' + CMMnemType + '-next" class="cm-next' + ((CMLen > 1 && CMPage < CMLen - 1) ? "" : " disabled") + '"><span>►</span></div>' +
            '<div id="cm-' + CMMnemType + '-info" class="cm-info"><div class="cm-score">Score: <span id="cm-' + CMMnemType +
            '-score-num" class="cm-score-num' + ((CMItem.s[CMSortMap[mnemType][CMPage]] !== 0) ? ((CMItem.s[CMSortMap[mnemType][CMPage]] > 0) ? " pos" : " neg") : "") + '">' +
            CMItem.s[CMSortMap[mnemType][CMPage]] + '</span></div><div class="cm-upvote-highlight">Upvote</div><div class="cm-downvote-highlight">Downvote</div>' +
            '<div id="cm-' + CMMnemType + '-user-buttons" class="cm-user-buttons"><div class="cm-edit-highlight' + ((CMItem.u[CMSortMap[mnemType][CMPage]] !== CMUser) ? " disabled" : "") + '">Edit</div><div class="cm-delete-highlight' +
            ((CMItem.u[CMSortMap[mnemType][CMPage]] !== CMUser) ? " disabled" : "") + '">Delete</div></div><br /><div id="cm-' + CMMnemType + '-submit" class="cm-submit-highlight">Submit Yours</div></div>';
    } else {
        CMContent += '>Nobody has posted a mnemonic for this item\'s ' + CMMnemType + ' yet. If you like, you can be the first to submit one!</p><div id="cm-' + CMMnemType + '-info" class="cm-info cm-nomnem">' +
            '<div id="cm-' + CMMnemType + '-submit" class="cm-submit-highlight nomnem">Submit Yours</div><div id="cm-' + CMMnemType + '-req" class="cm-req-highlight">' +
            (($.inArray(CMUser, CMData[itemType][item][mnemType].u) < 0) ? "Make Request" : "Delete Request") + '</div>';
        if (CMData[itemType][item][mnemType].t[0].length > 0 && CMData[itemType][item][mnemType].u[0].length > 0)
            CMContent += '<br/><br/><p id="cm-' + CMMnemType + '-reqtext" class="cm-reqtext" style="margin-bottom: 0">Mnemonic requested by: ' + getCMReqList(CMData[itemType][item][mnemType].u) + "</p>";
        CMContent += "</div>";
    }
    return CMContent;
}

function getCMReqList(users) {
    var reqList = "";
    for (var u = 0; u < users.length; u++) {
        if (u > 0) {
            if (u < users.length - 1) reqList += ", ";
            else reqList += ((u > 1) ? "," : "") + " and ";
        }
        reqList += '<a href="https://www.wanikani.com/community/people/' + users[u] + '" target="_blank" >' + users[u] + '</a>';
    }
    return reqList
}

function getCMForm(mnemType) {
    var CMForm = '<form id="cm-' + mnemType + '-form" class="cm-form" onsubmit="return false"><div id="cm-' + mnemType + '-format" class="cm-format">' +
        '<div class="btn cm-format-btn cm-format-bold"><b>b</b></div><div class="btn cm-format-btn cm-format-italic"><i>i</i></div><div class="btn cm-format-btn cm-format-underline"><u>u</u></div>' +
        '<div class="btn cm-format-btn cm-format-strike"><s>s</s></div><div class="btn cm-format-btn cm-format-reading">読</div><div class="btn cm-format-btn cm-format-rad">部</div>' +
        '<div class="btn cm-format-btn cm-format-kan">漢</div><div class="btn cm-format-btn cm-format-voc">語</div></div><fieldset><textarea id="cm-' +
        mnemType + '-text" class="cm-text" maxlength="5000" placeholder="Submit a community mnemonic" style="overflow: hidden;' +
        'word-wrap: break-word; resize: none; height: ' + ((CMIsReview) ? "53" : "55") + 'px;"></textarea><button id="cm-' + mnemType +'-form-cancel" class="cm-form-cancel">Cancel</button><button id="cm-' + mnemType + '-form-submit" class="cm-form-submit disabled" type="button">Submit</button><span class="counter-note"' +
        'title="Characters Remaining">5000 <i class="icon-pencil"></i></span></fieldset></form>';
    return CMForm;
}

function CMDataMatch(storedData) {
    return (CMType + CMChar == CMTableData[CMIndex - 2].Item && storedData.m.t == CMTableData[CMIndex - 2].Meaning_Mnem && storedData.r.t == CMTableData[CMIndex - 2].Reading_Mnem &&
        storedData.m.u == CMTableData[CMIndex - 2].Meaning_User && storedData.r.u == CMTableData[CMIndex - 2].Reading_User);
}

function CMDataConvert() {
    CMData[CMType][CMChar].m.t = $.map(CMData[CMType][CMChar].m.t, function(mt) { return mt; });
    CMData[CMType][CMChar].m.s = $.map(CMData[CMType][CMChar].m.s, function(ms) { return ms; });
    CMData[CMType][CMChar].m.u = $.map(CMData[CMType][CMChar].m.u, function(mu) { return mu; });
    CMData[CMType][CMChar].r.t = $.map(CMData[CMType][CMChar].r.t, function(rt) { return rt; });
    CMData[CMType][CMChar].r.s = $.map(CMData[CMType][CMChar].r.s, function(rs) { return rs; });
    CMData[CMType][CMChar].r.u = $.map(CMData[CMType][CMChar].r.u, function(ru) { return ru; });
}

function CMSettingsCheck() {
    if (CMSettings[CMType][CMChar] === undefined) {
        CMSettings[CMType][CMChar] = {"m": {"p": CMData[CMType][CMChar].m.u[curSortMap.m[0]],
                                            "c": ($.inArray( CMUser, CMData[CMType][CMChar].m.u[curSortMap.m[0]] + 1))},
                                      "r": {"p": CMData[CMType][CMChar].r.u[curSortMap.m[0]],
                                            "c": ($.inArray( CMUser, CMData[CMType][CMChar].r.u[curSortMap.r[0]] + 1))}};
    } else {
        if (($.inArray( CMSettings[CMType][CMChar].m.p, CMData[CMType][CMChar].m.u[CMSortMap.m[0]] )) < 0) CMSettings[CMType][CMChar].m.p = CMData[CMType][CMChar].m.u[CMSortMap.m[0]];
        if (($.inArray( CMSettings[CMType][CMChar].r.p, CMData[CMType][CMChar].r.u[CMSortMap.r[0]] )) < 0) CMSettings[CMType][CMChar].r.p = CMData[CMType][CMChar].r.u[CMSortMap.r[0]];
        if (($.inArray( CMUser, CMData[CMType][CMChar].m.u[CMSortMap.m[0]] ) > -1) !== CMSettings[CMType][CMChar].m.c) CMSettings[CMType][CMChar].m.c = !CMSettings[CMType][CMChar].m.c;
        if (($.inArray( CMUser, CMData[CMType][CMChar].r.u[CMSortMap.r[0]] ) > -1) !== CMSettings[CMType][CMChar].r.c) CMSettings[CMType][CMChar].r.c = !CMSettings[CMType][CMChar].r.c;
    }
}

function loadCM(fromForm, meaning) {
    
    var failCount = 0;
    
    var checkCMReady = setInterval(function() {
        
        if (CMReady) {
        
            clearInterval(checkCMReady);
            
            CMPreloadReady = true;
        
            if (!fromForm) {
            
                if (!CMStylesAdded) {
                    $("head").append('<style type="text/css">' +
                                 '.cm-prev, .cm-next, .cm-upvote-highlight, .cm-downvote-highlight, .cm-delete-highlight, .cm-edit-highlight, .cm-submit-highlight, .cm-req-highlight { cursor: pointer !important }' +
                                 '.cm-prev, .cm-next { font-size: 50px; margin: 0px 0px 0px 0px; padding: 15px 10px 0px 0px; float: left' + ((CMIsReview || CMIsLesson) ? "; margin-top: -10px; padding: 0 " : "" ) + '}' +
                                 '.cm-prev.disabled, .cm-next.disabled { opacity: 0.25 }' +
                                 '.cm-prev span, .cm-next span { background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(rgb(85, 85, 85)), to(rgb(70, 70, 70))); -webkit-background-clip: text; ' +
                                 '-webkit-text-fill-color: transparent; -webkit-text-stroke: 2px black; background: -moz-gradient(linear, 0% 0%, 0% 100%, from(rgb(85, 85, 85)), to(rgb(70, 70, 70)));' +
                                 '-moz-background-clip: text; -moz-text-fill-color: transparent; -moz-text-stroke: 2px black }' +
                                 '.cm-next { position: absolute; pointer-events: none; padding-left: 10px }' +
                                 '.cm-next span { pointer-events: all }' +
                                 '.cm-mnem-text { position: absolute; margin: 0 190px 0 60px' + ((CMIsReview || CMIsLesson) ? "; padding: 0" : "" ) + '}' +
                                 '.cm-info { display: inline-block }' +
                                 '.cm-info, .cm-info div { margin-bottom: 0px !important }' +
                                 '.cm-score { float: left; width: 80px }' +
                                 '.cm-score-num { color: #555 }' +
                                 '.cm-score-num.pos { color: #5c5 }' +
                                 '.cm-score-num.neg { color: #c55 }' +
                                 '.cm-upvote-highlight, .cm-downvote-highlight, .cm-delete-highlight, .cm-edit-highlight, .cm-submit-highlight, .cm-req-highlight {' +
                                    'text-align: center; font-size: 14px; width: 75px; margin-right: 10px; float: left; background-repeat: repeat-x; cursor: help; padding: 1px 4px; color: #fff; ' +
                                    'text-shadow: 0 1px 0 rgba(0,0,0,0.2); white-space: nowrap; -webkit-border-radius: 3px; -moz-border-radius: 3px; border-radius: 3px; ' +
                                    '-webkit-box-shadow: 0 -2px 0 rgba(0,0,0,0.2) inset; -moz-box-shadow: 0 -2px 0 rgba(0,0,0,0.2) inset; box-shadow: 0 -2px 0 rgba(0,0,0,0.2) inset' +
                                 '} .cm-upvote-highlight { background-image: linear-gradient(to bottom, #5c5, #46ad46) }' +
                                 '.cm-downvote-highlight { background-image: linear-gradient(to bottom, #c55, #ad4646) }' +
                                 '.cm-user-buttons { position: absolute; margin-top: -34px }' +
                                 '.cm-delete-highlight, .cm-edit-highlight { font-size: 12px; width: 50px; height: 12px; line-height: 1 }' +
                                 '.cm-delete-highlight { background-image: linear-gradient(to bottom, #811, #6d0606); margin-right: 0 }' +
                                 '.cm-edit-highlight { background-image: linear-gradient(to bottom, #ccc, #adadad) }' +
                                 '.cm-delete-highlight.disabled, .cm-edit-highlight.disabled { display: none; pointer-events: none }' +
                                 '.cm-submit-highlight { margin-top: 10px; width: 100px; background-image: linear-gradient(to bottom, #555, #464646) }' +
                                 '.cm-submit-highlight.disabled { color: #8b8b8b !important }' +
                                 '.cm-req-highlight { margin-top: 10px; width: 100px; background-image: linear-gradient(to bottom, #ea5, #d69646) }' +
                                 '.cm-nomnem { margin-top: -10px !important }' + ((CMIsReview || CMIsLesson) ? ".cm-form fieldset { clear: left }" : "") +
                                 '.cm-format { margin: 0 !important }' +
                                 '.cm-format-btn { background-color: #f5f5f5; ' +
                                 'background-image: -moz-linear-gradient(top, #fff, #e6e6e6); background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#fff), to(#e6e6e6)); ' +
                                 'background-image: -webkit-linear-gradient(top, #fff, #e6e6e6); background-image: -o-linear-gradient(top, #fff, #e6e6e6); ' +
                                 'background-image: linear-gradient(to bottom, #fff, #e6e6e6); background-repeat: repeat-x; width: 10px; height: 10px; margin: 0 !important; ' +
                                 'padding: ' + ((CMIsReview || CMIsLesson) ? "7px 13px 13px 7px" : "8px 12px 12px 8px") + '; line-height: 1; float: left }' +
                                 '.cm-format-bold, .cm-format-underline, .cm-format-strike { padding-left: 10px; padding-right: 10px }' +
                                 '.cm-format-voc { ' + ((CMIsReview || CMIsLesson) ? "" : "float: none") + ' }' +
                                 '.cm-format-btn.active { background-color:#e6e6e6; background-color:#d9d9d9; background-image:none; outline:0; ' +
                                 '-webkit-box-shadow:inset 0 2px 4px rgba(0,0,0,0.15),0 1px 2px rgba(0,0,0,0.05);-moz-box-shadow:inset 0 2px 4px rgba(0,0,0,0.15),0 1px 2px rgba(0,0,0,0.05); ' +
                                 'box-shadow:inset 0 2px 4px rgba(0,0,0,0.15),0 1px 2px rgba(0,0,0,0.05) }' + 
                                 '.cm-delete-text { position: absolute; opacity: 0; text-align: center }' +
                                 '.cm-delete-text h3 { margin: 0 }</style>');
                    CMStylesAdded = true;
                }
                $(".loadingCM").remove();
            } else {
                if (meaning) $("#cm-meaning .note-meaning").remove();
                else $("#cm-reading .note-reading").remove();
            }
            
            if (!fromForm) checkCMVotes(true, true);
            
            if (!fromForm || meaning) {
                $("#cm-meaning").html($(getCMContent(CMChar, CMType, "m")));
                $("#cm-meaning-delete-text").css({"width": $("#cm-meaning").width() + "px",
                                                          "height": $("#cm-meaning-delete-text h3").height() + "px",
                                                         "padding": (($("#cm-meaning").height() - $("#cm-meaning-delete-text h3").height())/2) + "px 0"});
                updateCMMargins(true, false);
            }
            if (!fromForm || !meaning) {
                $("#cm-reading").html($(getCMContent(CMChar, CMType, "r")));
                $("#cm-reading-delete-text").css({"width": $("#cm-reading").width() + "px",
                                                          "height": $("#cm-reading-delete-text h3").height() + "px",
                                                         "padding": (($("#cm-reading").height() - $("#cm-reading-delete-text h3").height())/2) + "px 0"});
                updateCMMargins(false, true);
            }
            checkCMTextHighlight(true);
            checkCMTextHighlight(false);
            $(".cm-prev span, .cm-next span").click(function() {
                if (!$(this).parent().hasClass("disabled")) {
                    if ($(this).parent().parent().attr("id") == "cm-meaning") {
                        if ($(this).parent().attr("id") == "cm-meaning-prev") {
                            if (0 < CMPageIndex.m) {
                                CMPageIndex.m--;
                                CMSettings[CMType][CMChar].m.p = CMData[CMType][CMChar].m.u[CMSortMap.m[CMPageIndex.m]];
                                $("#cm-meaning-next").removeClass("disabled");
                                if (CMPageIndex.m < 1) $("#cm-meaning-prev").addClass("disabled");
                                checkCMVotes(true, false);
                            }
                        } else {
                            if (CMData[CMType][CMChar].m.t.length - 1 > CMPageIndex.m) {
                                CMPageIndex.m++;
                                CMSettings[CMType][CMChar].m.p = CMData[CMType][CMChar].m.u[CMSortMap.m[CMPageIndex.m]];
                                $("#cm-meaning-prev").removeClass("disabled");
                                if (CMPageIndex.m >= Object.keys(CMData[CMType][CMChar].m.t).length - 1) $("#cm-meaning-next").addClass("disabled");
                                checkCMVotes(true, false);
                            }
                        }
                        
                        updateCMText(true);
                            
                    } else {
                        if ($(this).parent().attr("id") == "cm-reading-prev") {
                            if (0 < CMPageIndex.r) {
                                CMPageIndex.r--;
                                CMSettings[CMType][CMChar].r.p = CMData[CMType][CMChar].r.u[CMSortMap.r[CMPageIndex.r]];
                                $("#cm-reading-next").removeClass("disabled");
                                if (CMPageIndex.r < 1) $("#cm-reading-prev").addClass("disabled");
                                checkCMVotes(false, true);
                            }
                        } else {
                            if (CMData[CMType][CMChar].r.t.length - 1 > CMPageIndex.r) {
                                CMPageIndex.r++;
                                CMSettings[CMType][CMChar].r.p = CMData[CMType][CMChar].r.u[CMSortMap.r[CMPageIndex.r]];
                                $("#cm-reading-prev").removeClass("disabled");
                                if (CMPageIndex.r >= Object.keys(CMData[CMType][CMChar].r.t).length - 1) $("#cm-reading-next").addClass("disabled");
                                checkCMVotes(false, true);
                            }
                        }
                        
                        updateCMText(false);
                        
                    }
                    
                    saveCMSettings();
                }
            });
            
            $(".cm-upvote-highlight, .cm-downvote-highlight").click(function() {
                
                var isMeaning = ($(this).parent().attr("id") == "cm-meaning-info");
                var key = CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].u[CMSortMap[((isMeaning) ? "m" : "r")][CMPageIndex[((isMeaning) ? "m" : "r")]]] + ":" +
                    CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].t[CMSortMap[((isMeaning) ? "m" : "r")][CMPageIndex[((isMeaning) ? "m" : "r")]]];
                
                if ((CMVotes[CMType][CMChar][((isMeaning) ? "m" : "r")][key] == 0 || ($(this).hasClass("cm-upvote-highlight") &&
                    CMVotes[CMType][CMChar][((isMeaning) ? "m" : "r")][key] == -1) || ($(this).hasClass("cm-downvote-highlight") &&
                    CMVotes[CMType][CMChar][((isMeaning) ? "m" : "r")][key] == 1))) {
                    
                    if (CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].u[CMSortMap[((isMeaning) ? "m" : "r")][CMPageIndex[((isMeaning) ? "m" : "r")]]] !== CMUser) {
                        if (isMeaning) {
                            if ($(this).hasClass("cm-upvote-highlight")) CMVotes[CMType][CMChar].m[key]++;
                            else CMVotes[CMType][CMChar].m[key]--;
                            if (CMVotes[CMType][CMChar].m[key] !== 0) CMData[CMType][CMChar].m.s[CMSortMap.m[CMPageIndex.m]] += CMVotes[CMType][CMChar].m[key];
                            else CMData[CMType][CMChar].m.s[CMSortMap.m[CMPageIndex.m]] += ($(this).hasClass("cm-upvote-highlight")) ? 1 : -1;
                            $("#cm-meaning-score-num").html(CMData[CMType][CMChar].m.s[CMSortMap.m[CMPageIndex.m]]);
                        } else {
                            if ($(this).hasClass("cm-upvote-highlight")) CMVotes[CMType][CMChar].r[key]++;
                            else CMVotes[CMType][CMChar].r[key]--;
                            if (CMVotes[CMType][CMChar].r[key] !== 0) CMData[CMType][CMChar].r.s[CMSortMap.r[CMPageIndex.r]] += CMVotes[CMType][CMChar].r[key];
                            else CMData[CMType][CMChar].r.s[CMSortMap.r[CMPageIndex.r]] += ($(this).hasClass("cm-upvote-highlight")) ? 1 : -1;
                            $("#cm-reading-score-num").html(CMData[CMType][CMChar].r.s[CMSortMap.r[CMPageIndex.r]]);
                        }
                        
                        if (CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].s[CMSortMap[((isMeaning) ? "m" : "r")][CMPageIndex[((isMeaning) ? "m" : "r")]]] !== 0) {
                            if (CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].s[CMSortMap[((isMeaning) ? "m" : "r")][CMPageIndex[((isMeaning) ? "m" : "r")]]] > 0) $("#cm-" + ((isMeaning) ? "meaning" : "reading") + "-score-num").removeClass("neg").addClass("pos");
                            else $("#cm-" + ((isMeaning) ? "meaning" : "reading") + "-score-num").removeClass("pos").addClass("neg");
                        } else $("#cm-" + ((isMeaning) ? "meaning" : "reading") + "-score-num").removeClass("pos").removeClass("neg");
                        
                        if (CMVotes[CMType][CMChar][((isMeaning) ? "m" : "r")][key] == -1) {
                        	if ((isMeaning && parseInt(CMTableData[CMIndex - 2].Meaning_Score.split("|")[CMSortMap.m[CMPageIndex.m]]) <= -9) ||
                            	(!isMeaning && parseInt(CMTableData[CMIndex - 2].Reading_Score.split("|")[CMSortMap.r[CMPageIndex.r]]) <= -9)) deleteCM(isMeaning, false);
                            else postCM(1);
                        } else postCM(1);
                        
                    } else alert("Sorry, you can't vote on your own mnemonic.");
                    
                } else alert("It looks like you've already " + ($(this).hasClass("cm-upvote-highlight") ? "up" : "down") + "voted this mnemonic.");
                
            });
            
            $(".cm-delete-highlight").click(function() {
                var isMeaning = ($(this).parent().attr("id") == "cm-meaning-user-buttons");
                if ($(this).html() == "Delete") {
                    $(this).html("Really Delete?").css({"font-size": "8px", "line-height": ((CMIsReview || CMIsLesson) ? "1.5" : "1.8")});
                    setTimeout(function() {
                        if ($("#cm-" + ((isMeaning) ? "meaning" : "reading") + "-info .cm-delete-highlight").attr("disabled") === undefined) {
                           $("#cm-" + ((isMeaning) ? "meaning" : "reading") + "-info .cm-delete-highlight").html("Delete").css({"font-size": "12px", "line-height": "1"});
                        }
                    }, 3000);
                } else {
                    $(this).attr("disabled", "disabled");
                    deleteCM(isMeaning, true);
                }
            });
            
            $(".cm-edit-highlight, .cm-submit-highlight").click(function() {
                
                var isEdit = ($(this).hasClass("cm-edit-highlight"));
                
                $(this).attr("disabled", "disabled");
                
                var isMeaning = ((isEdit && $(this).parent().attr("id") == "cm-meaning-user-buttons") || $(this).attr("id") == "cm-meaning-submit");
                if ((isEdit && ((isMeaning && CMSettings[CMType][CMChar].m.c) || (!isMeaning && CMSettings[CMType][CMChar].r.c))) ||
                    (!isEdit && ((isMeaning && !CMSettings[CMType][CMChar].m.c) || (!isMeaning && !CMSettings[CMType][CMChar].r.c)))) {
                    if (isEdit || CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].t.length < 10) {
                        if (isMeaning) $("#cm-meaning").html('<div class="note-meaning noswipe">' + getCMForm("meaning") + '</div>');
                        else $("#cm-reading").html('<div class="note-reading noswipe">' + getCMForm("reading") + '</div>');
                        if (isEdit) {
                            $("#cm-" + ((isMeaning) ? "meaning" : "reading") + " .cm-text").val(CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].t[CMSortMap[((isMeaning) ? "m" : "r")][CMPageIndex[((isMeaning) ? "m" : "r")]]])
                            	.css({"transition-duration": "0s", "-webkit-transition-duration": "0s", "-moz-transition-duration": "0s", "-o-transition-duration": "0s"});
                            $("#cm-" + ((isMeaning) ? "meaning" : "reading") + " .cm-text").autosize({"callback": function() {
                                	setTimeout(function() { $("#cm-" + ((isMeaning) ? "meaning" : "reading") + " .cm-text").css({"transition-duration": "0.2s", "-webkit-transition-duration": "0.2s", "-moz-transition-duration": "0.2s", "-o-transition-duration": "0.2s"}) }, 200);
                            	}
                          	});
                            $("#cm-" + (($(this).attr("id") == "cm-meaning-text") ? "meaning" : "reading") + "-form .counter-note").html($("#cm-" + ((isMeaning) ? "meaning" : "reading") +
                            	" .cm-text").attr("maxlength")-$("#cm-" + ((isMeaning) ? "meaning" : "reading") + " .cm-text").val().length + ' <i class="icon-pencil"></i>');
                        }
                        $("#cm-" + ((isMeaning) ? "meaning" : "reading") + " .cm-text").keydown(function() {
                            if (CMIsReview && !CMIsLesson) {
                                if ( event.which == 8 && (!CMIsChrome || $("#deleteButton").length > 0) ) {
                                    var selStart = $("#cm-" + ((isMeaning) ? "meaning" : "reading") + "-text").prop("selectionStart");
                                    var selEnd = $("#cm-" + ((isMeaning) ? "meaning" : "reading") + "-text").prop("selectionEnd");
                                    if (selEnd == CMSelTemp && selStart == selEnd) {
                                        selStart -= (selEnd - $(this).val().lastIndexOf("<", selStart));
                                        if ($(".cm-format-btn.active").length > 0) {
                                            $(".cm-format-btn").removeClass("active");
                                            CMSelTemp = -1;
                                        } else if ($(this).val().substr(selStart - 1, 1) == ">") {
                                            switch($(this).val().slice($(this).val().lastIndexOf("<", selStart - 1) + 1, selStart - 1)) {
                                                case "b":
                                                    $(".cm-format-bold").addClass("active");
                                                    break;
                                                case "i":
                                                    $(".cm-format-italic").addClass("active");
                                                    break;
                                                case "u":
                                                    $(".cm-format-underline").addClass("active");
                                                    break;
                                                case "s":
                                                    $(".cm-format-strike").addClass("active");
                                                    break;
                                                case 'span class="highlight-reading"':
                                                case 'span class="reading-highlight"':
                                                    $(".cm-format-reading").addClass("active");
                                                    break;
                                                case 'span class="highlight-radical"':
                                                case 'span class="radical-highlight"':
                                                    $(".cm-format-rad").addClass("active");
                                                    break;
                                                case 'span class="highlight-kanji"':
                                                case 'span class="kanji-highlight"':
                                                    $(".cm-format-kan").addClass("active");
                                                    break;
                                                case 'span class="highlight-vocabulary"':
                                                case 'span class="vocabulary-highlight"':
                                                    $(".cm-format-voc").addClass("active");
                                                    break;
                                                default:
                                            }
                                            CMSelTemp = selStart;
                                        }
                                    }
                                    if (selStart == selEnd) {
                                        if (selStart > 0) $(this).val($(this).val().slice(0, selEnd - 1) + $(this).val().slice(selEnd)).selectRange(selEnd - 1);
                                    } else $(this).val($(this).val().slice(0, selStart) + $(this).val().slice(selEnd)).selectRange(selStart);
                                    $("#cm-" + (($(this).attr("id") == "cm-meaning-text") ? "meaning" : "reading") + "-form .counter-note").html($(this).attr("maxlength")-$(this).val().length + '<i class="icon-pencil"></i>');
                                	$(this).trigger("input");
                                }
                        	}
                            if (event.which == 190) $(".cm-format-btn").removeClass("active");
                        });
                        $("#cm-" + ((isMeaning) ? "meaning" : "reading") + " .cm-text").on('input propertychange', function(e) {
                            if ($(this).val() !== "") $(".cm-form-submit").removeClass("disabled");
                            else $("button[type=submit]").addClass("disabled");
                            $(this).autosize();
                            $("#cm-" + (($(this).attr("id") == "cm-meaning-text") ? "meaning" : "reading") + "-form .counter-note").html($(this).attr("maxlength")-$(this).val().length + '<i class="icon-pencil"></i>');
                        }).focus();
                        $(".cm-format-btn").click(function() {
                            var isMeaningStr = ($(this).parent().attr("id") == "cm-meaning-format") ? "meaning" : "reading";
                            var selStart = $("#cm-" + isMeaningStr + "-text").prop("selectionStart");
                            var selEnd = $("#cm-" + isMeaningStr + "-text").prop("selectionEnd");
                            var formatType = "";
                            var tagStart = "";
                            var tagEnd = "";
                            var includesClass = false;
                            
                            CMSelTemp = -1;
                            
                            switch($(this).attr("class").slice($(this).attr("class").lastIndexOf("-") + 1, ((!$(this).hasClass("active")) ? $(this).attr("class").length : $(this).attr("class").lastIndexOf(" ")))) {
                                case "bold":
                                    tagStart = "b";
                                    break;
                                case "italic":
                                    tagStart = "i";
                                    break;
                                case "underline":
                                    tagStart = "u";
                                    break;
                                case "strike":
                                    tagStart = "s";
                                    break;
                                case "reading":
                                    tagStart = 'span class="highlight-reading"';
                                    includesClass = true;
                                    break;
                                case "rad":
                                    tagStart = 'span class="highlight-radical"';
                                    includesClass = true;
                                    break;
                                case "kan":
                                    tagStart = 'span class="highlight-kanji"';
                                    includesClass = true;
                                    break;
                                case "voc":
                                    tagStart = 'span class="highlight-vocabulary"';
                                    includesClass = true;
                                    break;
                                default:
                                    tagStart = "span";
                            }
                            
                            if (!$(this).hasClass("active")) {

                                if ($(this).parent().children(".active").length > 0) {
                                    tagEnd = "</" + ((CMLastTag.indexOf(" ") < 0) ? CMLastTag : CMLastTag.slice(0, CMLastTag.indexOf(" "))) + ">";
                                    $("#cm-" + isMeaningStr + "-text").val($("#cm-" + isMeaningStr + "-text").val().slice(0, selStart) + tagEnd + $("#cm-" + isMeaningStr + "-text").val().slice(selStart));
                                    if (selStart == selEnd) selStart += tagEnd.length;
									selEnd += tagEnd.length;
                                }
                                
                                $(".cm-format-btn").removeClass("active");
                                
                                CMSelTemp = selEnd + tagStart.length + 2;
                                
                                if (selStart == selEnd) {
                                    $("#cm-" + isMeaningStr + "-text").val($("#cm-" + isMeaningStr + "-text").val().slice(0, selStart) + "<" + tagStart +  ">" + $("#cm-" + isMeaningStr + "-text").val().slice(selStart));
                                    $(this).addClass("active");
                                } else {
                                    $("#cm-" + isMeaningStr + "-text").val($("#cm-" + isMeaningStr + "-text").val().slice(0, selStart) + "<" + tagStart + ">" +
                                        $("#cm-" + isMeaningStr + "-text").val().slice(selStart, selEnd) + "</" + ((!includesClass) ? tagStart : tagStart.slice(0, tagStart.indexOf(" "))) + ">"　+
                                        $("#cm-" + isMeaningStr + "-text").val().slice(selEnd));
                                }
                                
                            } else {
                                
                                if (selStart !== selEnd) {
                                    $("#cm-" + isMeaningStr + "-text").val($("#cm-" + isMeaningStr + "-text").val().slice(0, selStart) + $("#cm-" + isMeaningStr + "-text").val().slice(selEnd));
                                    selEnd = selStart;
                                }
                                
                                tagEnd = "</" + ((!includesClass) ? tagStart : tagStart.slice(0, tagStart.indexOf(" "))) + ">";
                                CMSelTemp = selStart + tagEnd.length;
                                
                                $("#cm-" + isMeaningStr + "-text").val($("#cm-" + isMeaningStr + "-text").val().slice(0, selStart) + tagEnd + $("#cm-" + isMeaningStr + "-text").val().slice(selStart))
                                									.selectRange(CMSelTemp);
                                
                                $(this).removeClass("active");
                                
                            }
                            
                            $("#cm-" + isMeaningStr + "-text").trigger("propertychange").focus();
                            
                            CMLastTag = tagStart;
                        });

                        $(".cm-form-submit").click(function() {
                            
                            $(this).prop("disabled", true).prev().prop("disabled", true).parent().prop("disabled", true);
                            
                            $("#cm-" + ((isMeaning) ? "meaning" : "reading") + "-format .active").trigger("click");
                            
                            var mnemText = "";
                            if (isEdit || !CMSettings[CMType][CMChar][((isMeaning) ? "m" : "r")].c) {
                                mnemText = $("#cm-" + ((isMeaning) ? "meaning" : "reading") + "-text").val().trim();
                                if (mnemText.length > 0) {
                                    if (!/[|]/.test(mnemText)) {
                                        if (!new RegExp(Base64.decode("ZnVja3xzaGl0fGRpY2t8bXkgY29ja3x5b3VyIGNvY2t8cyBjb2NrfHBlbmlzfHJhcGV8cmFwaW5nfHB1c3N5fGN1bnR8Y2xpdHxqaXp6fGN1bXxhbnVzfG5pZ2dlcnxmYWd8d" +
                                                                      "Gl0fHBvcm58bW9sZXN0fHBlZG98aGF2ZSBzZXh8aGFkIHNleA==").toLowerCase(), "i").test(mnemText)) {
                                            if (checkCMHTMLTags(mnemText)) {
                                                var firstChar = (mnemText.substring(0, 1) !== "<") ? mnemText.substring(0, 1) : mnemText.substring(mnemText.indexOf(">") + 1, 1);
                                                if (firstChar !== "!" ) {
                                                    
                                                    mnemText = (mnemText.substr(0, 1) !== "<") ? (firstChar.toUpperCase() + mnemText.substring(1)) : (mnemText.slice(0, mnemText.indexOf(">") + 1) +
                                                                mnemText.substr(mnemText.indexOf(">") + 1, 1).toUpperCase() + mnemText.substring(mnemText.indexOf(">") + 2));
                                                    if (!/[.|!|?|。|！]$/.test(mnemText.slice(mnemText.length - 1)) && mnemText.length < 500) {
                                                        if (mnemText.slice(mnemText.length - 1) == ">") mnemText += (!/[.|!|?|。|！]$/.test(mnemText.substr(mnemText.lastIndexOf("<") - 1, 1))) ? "." : "";
                                                        else mnemText += ".";
                                                    }
                                                    
                                                    if (isEdit) {
                                                        
                                                        var index = CMSortMap[((isMeaning) ? "m" : "r")][CMPageIndex[((isMeaning) ? "m" : "r")]];
                                                        
                                                        if (CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].t[index] !== (mnemText)) {
                                                            CMVotes[CMType][CMChar][((isMeaning) ? "m" : "r")][CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].u[index] + ":" + mnemText] = CMVotes[CMType][CMChar][((isMeaning) ? "m" : "r")][CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].u[index] + ":" + CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].t[index]];
                                                            delete CMVotes[CMType][CMChar][((isMeaning) ? "m" : "r")][CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].u[index] + ":" + CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].t[index]];
                                                            CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].t[index] = mnemText;
                                                            postCM(((isMeaning) ? 6 : 7));
                                                        } else $(this).prev().prop("disabled", false).trigger("click").prop("disabled", true);
                                                        
                                                    } else {
                                                        
                                                        if (CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].t[0].length > 0 && CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].t[0] !== "!") {
                                                            CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].t.push(mnemText);
                                                            CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].s.push(0);
                                                            CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].u.push(CMUser);
                                                        } else {
                                                            CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].t = [mnemText];
                                                            CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].s = [0];
                                                            CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].u = [CMUser];
                                                        }
                                                        
                                                        CMVotes[CMType][CMChar][((isMeaning) ? "m" : "r")][CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].u[CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].u.length - 1] +
                                                        	":" + CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].t[CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].t.length - 1]] = 0;
                                                        
                                                        if (CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].s.length < 1) {
                                                            
                                                            CMSortMap[((isMeaning) ? "m" : "r")].push(0);
                                                            CMPageIndex[((isMeaning) ? "m" : "r")] = 0;
                                                            
                                                        } else {
                                                            
                                                            for (var s = CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].s.length - 1; s >= 0; s--) {
                                                                if (CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].s[s] > -1 || s == 0) {
                                                                    CMSortMap[((isMeaning) ? "m" : "r")] = CMSortMap[((isMeaning) ? "m" : "r")].slice(0, s).concat([CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].s.length - 1].concat(CMSortMap[((isMeaning) ? "m" : "r")].slice(s)));
                                                                    CMPageIndex[((isMeaning) ? "m" : "r")] = s;
                                                                    break;
                                                                }
                                                            }
                                                            
                                                        }
                                                        
                                                        CMPageMap[((isMeaning) ? "m" : "r")][CMUser] = CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].t.length - 1;
                                                        postCM(((isMeaning) ? 2 : 3));
                                                    }
                                                } else {
                                                    alert("You may not begin a mnemonic with an exclamation mark (!) because it is used to indicate mnemonic requests.");
                                                    $(this).prop("disabled", false).prev().prop("disabled", false).parent().prop("disabled", false);
                                                }
                                        	} else {
                                                alert("Your mnemonic contains unclosed, unopened, or restricted HTML tags. These must be fixed before you can post your mnemonic.");
                                                $(this).prop("disabled", false).prev().prop("disabled", false).parent().prop("disabled", false);
                                            }
                                        } else {
                                            alert("Your mnemonic contains inappropriate or otherwise vulgar content. Please change your mnemonic to be more family-friendly because young children may use this script too.");
                                        	$(this).prop("disabled", false).prev().prop("disabled", false).parent().prop("disabled", false);
                                        }
                                    } else {
                                        alert("You may not use the vertical bar (|) in a mnemonic because it is used in the database as a separator.");
                                        $(this).prop("disabled", false).prev().prop("disabled", false).parent().prop("disabled", false);
                                    }
                                } else {
                                    alert("Sorry, that input is invalid. Please enter a proper mnemonic.");
                                    $(this).prop("disabled", false).prev().prop("disabled", false).parent().prop("disabled", false);
                                }
                            } else {
                                alert("Sorry, you've already submitted a " + ((isMeaning) ? "meaning" : "reading") + " mnemonic for this item. You must delete your old " + ((isMeaning) ? "meaning" : "reading") + " mnemonic submission to submit a new one.");
                        		$(this).prop("disabled", false).prev().prop("disabled", false).parent().prop("disabled", false);
                            }
                        });
                        
                        $(".cm-form-cancel").click(function() {
                            
                            $(this).prop("disabled", true).next().attr("disabled", "disabled").parent().prop("disabled", true);
                            
                            if ($(this).attr("id") == "cm-meaning-form-cancel") loadCM(true, true);
                            else loadCM(true, false);
                        });
                    } else alert("Sorry, but it appears that the limit of 10 mnemonics for this item's " + ((isMeaning) ? "meaning" : "reading") + " has been reached.");
                } else {
                    alert("Sorry, you've already submitted a " + ((isMeaning) ? "meaning" : "reading") + " mnemonic for this item. You must delete your old " +
                          ((isMeaning) ? "meaning" : "reading") + " mnemonic submission to submit a new one.");
                }
            });
            
            $(".cm-req-highlight").click(function() {
                
                var isMeaning = ($(this).attr("id") == "cm-meaning-req");
                var hasRequested = $.inArray(CMUser, CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].u) > -1;
                var reqText = $(this).next().next().next().html();
                
                if (!hasRequested) {
                    if (CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].u.length < 10) {
                        if (CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].u[0].length > 0) {
                            CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].u.push(CMUser);
                            $("#cm-" + ((isMeaning) ? "meaning" : "reading") + "-reqtext").html("Mnemonic requested by: " + getCMReqList(CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].u));
                        } else {
                            CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].t = ["!"];
                            CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].u = [CMUser];
                            $('<p id="cm-' + ((isMeaning) ? "meaning" : "reading") + '-reqtext" class="cm-reqtext" style="margin-bottom: 0">Mnemonic requested by: ' +
                            	getCMReqList(CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].u)).insertAfter($(this));
                        }
                        $(this).text("Delete Request");
                        saveCMData();
                        postCM(8);
                    } else alert("Sorry, but it appears that the limit of 10 mnemonic requests for this item's " + ((isMeaning) ? "meaning" : "reading") + " has been reached.");
                } else {
                    if (CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].u.length > 1) {
                        CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].u.splice(CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].u.indexOf(CMUser), 1);
                        $(this).next().next().next().html("Mnemonic requested by: " + getCMReqList(CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].u));
                    } else {
                        CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].t = [""];
                        CMData[CMType][CMChar][((isMeaning) ? "m" : "r")].u = [""];
                        $("#cm-" + ((isMeaning) ? "meaning" : "reading") + "-reqtext").remove();
                        $(this).parent().children("br").remove();
                    }
                    $(this).text("Make Request");
                    saveCMData();
                    postCM(9);
                }
            });
        } else {
            failCount++;
            if (failCount == 10) {
                $(".loadingCM").html('Loading seems to be taking longer than it should and something may have gone wrong. If this issue continues after reloading the page, make sure your ' +
                                                      'internet connection is working properly. If your internet is working properly and the issue persists, try temporarily disabling all other ' +
                                                      'userscripts and extensions and try again. If it persists and you\'ve ensured that other userscripts or extensions are not the cause, check ' +
                                                      '<a href="https://www.wanikani.com/chat/api-and-third-party-apps/7568" target="_blank">here</a> to see if anyone else is having this issue and, ' +
                                                      'if not, please report it and include your operating system, browser, and version of the WaniKani Community Mnemonics userscript ' +
                                                      '(which should be the newest to ensure minimal bugs).');
                clearInterval(checkCMReady);
            } else if (failCount < 10) $(".loadingCM").html($(".loadingCM").html() + ".");
        }
    }, 1000);
}

function deleteCM(isMeaning, isUser) {
    $('<div id="cm-' + ((isMeaning) ? "meaning" : "reading") + '-delete-text" class="cm-delete-text"><h3>Deleting Mnemonic...</h3></div>').insertBefore($("#cm-" + ((isMeaning) ? "meaning" : "reading")));
    $("#cm-" + ((isMeaning) ? "meaning" : "reading")).prev().css({"width": $("#cm-" + ((isMeaning) ? "meaning" : "reading")).width() + "px",
                                          "height": $("#cm-" + ((isMeaning) ? "meaning" : "reading")).prev().children("h3").height() + "px",
                                          "padding": (($("#cm-" + ((isMeaning) ? "meaning" : "reading")).height() - $("#cm-" + ((isMeaning) ? "meaning" : "reading")).prev().children("h3").height())/2) + "px 0"});
    $("#cm-" + ((isMeaning) ? "meaning" : "reading") + ", #cm-" + ((isMeaning) ? "meaning" : "reading") + "-delete-text").css({"-webkit-transition": "opacity 1s ease-in-out",
                                                                                                                               "-moz-transition": "opacity 1s ease-in-out",
                                                                                                                               "-o-transition": "opacity 1s ease-in-out",
                                                                                                                               "transition": "opacity 1s ease-in-out"});
    $("#cm-" + ((isMeaning) ? "meaning" : "reading")).css("opacity", "0").prev().css("opacity", "1");
    var curItem = CMData[CMType][CMChar][((isMeaning) ? "m" : "r")];
    var curItemSettings = CMSettings[CMType][CMChar][((isMeaning) ? "m" : "r")];
    var curItemVotes = CMVotes[CMType][CMChar][((isMeaning) ? "m" : "r")];
    var delIndex = CMSortMap[((isMeaning) ? "m" : "r")][CMPageIndex[((isMeaning) ? "m" : "r")]];
    var delUser = curItemSettings.p;
    delete CMVotes[CMType][CMChar][((isMeaning) ? "m" : "r")][curItem.u[delIndex] + ":" + curItem.t[delIndex]];
    if (curItem.t.length > 0) curItem.t.splice(delIndex, 1);
    else curItem.t[0] = "";
    curItem.s.splice(delIndex, 1);
    if (curItem.u.length > 0) curItem.u.splice(delIndex, 1);
    else curItem.u[0] = "";
    CMSettings[CMType][CMChar][((isMeaning) ? "m" : "r")] = {"p": ((delIndex > 0) ? curItem.u[CMSortMap[((isMeaning) ? "m" : "r")][CMPageIndex[((isMeaning) ? "m" : "r")] - 1]] : curItemSettings.p), "c": false};
    CMSortMap[((isMeaning) ? "m" : "r")] = getCMSortMap(((isMeaning) ? curItem.s : []), ((!isMeaning) ? curItem.s : []))[((isMeaning) ? "m" : "r")];
    CMPageMap[((isMeaning) ? "m" : "r")] = getCMPageMap(((isMeaning) ? curItem.u : []), ((!isMeaning) ? curItem.u : []))[((isMeaning) ? "m" : "r")];
    if (CMPageIndex[((isMeaning) ? "m" : "r")] >= curItem.t.length) {
        CMPageIndex[((isMeaning) ? "m" : "r")]--;
        curItemSettings.p = curItem.u[CMSortMap[((isMeaning) ? "m" : "r")][CMPageIndex[((isMeaning) ? "m" : "r")]]];
        $("#cm-" + ((isMeaning) ? "meaning" : "reading") + "-next").addClass("disabled");
        if (delIndex <= 1) $("#cm-" + ((isMeaning) ? "meaning" : "reading") + "-prev").addClass("disabled");
    } else if (delIndex < 1) $("#cm-" + ((isMeaning) ? "meaning" : "reading") + "-prev").addClass("disabled");
    postCM(((isMeaning) ? 4 : 5));
}

function postCM(postType) {
    
    if (postType == 0) CMData[CMType][CMChar].i = CMIndex;
    
    var serializedData = (postType == 0) ? 'Item=' + CMType + encodeURIComponent(CMChar) + "&Meaning_Mnem=&Reading_Mnem=&Meaning_Score=&Reading_Score=&Meaning_User=&Reading_User=&Index=" +
        CMData[CMType][CMChar].i : "Item=" + CMType + encodeURIComponent(CMChar) + "&Meaning_Mnem=" + encodeURIComponent(CMData[CMType][CMChar].m.t.join("|")) + "&Reading_Mnem=" +
        encodeURIComponent(CMData[CMType][CMChar].r.t.join("|")) + "&Meaning_Score=" + ((!isNaN(CMData[CMType][CMChar].m.s[0])) ? CMData[CMType][CMChar].m.s.join("|") : "") + "&Reading_Score=" +
        ((!isNaN(CMData[CMType][CMChar].r.s[0])) ? CMData[CMType][CMChar].r.s.join("|") : "") + "&Meaning_User=" + CMData[CMType][CMChar].m.u.join("|") + "&Reading_User=" +
        CMData[CMType][CMChar].r.u.join("|") + "&Index=" + CMData[CMType][CMChar].i;
    
    if ((postType !== 2 && postType !== 3) || CMSettings[CMType][CMChar][((postType == 2) ? "m" : "r")].c == false) {
        
        if (postType == 2 || postType == 3) CMSettings[CMType][CMChar][((postType == 2) ? "m" : "r")].c = true;
        
        $.ajax({
            url: "https://script.google.com/macros/s/AKfycbznhpL43Ix-qqO3sNcJmQeQk5dsdW6u0uaZ9to4_8TQho0qcm0/exec",
            type: "POST",
            data: serializedData,
            success: function(data, textStatus, jqXHR) {
                if (postType == 0) {
                    CMReady = true;
                } else {
                    if (postType > 1) {
                        if (postType == 2 || postType == 3) {
                            CMSettings[CMType][CMChar][((postType == 2) ? "m" : "r")].p = CMUser;
                            saveCMSettings();
                            loadCM(true, (postType == 2));
                        } else if (postType < 6) {
                            $("#cm-" + [((postType == 4) ? "meaning" : "reading")] + "-delete-text h3").html("Mnemonic successfully deleted!");
                            
                            if ((postType == 4 && CMData[CMType][CMChar].m.t.length > 0) || (postType == 5 && CMData[CMType][CMChar].r.t.length > 0)) {
                                updateCMText((postType == 4));
                            } else {
                                CMData[CMType][CMChar][((postType == 4) ? "m" : "r")] = {"t": [""], "s": [], "u": [""]};
                                loadCM(true, (postType == 4));
                            }
                            
                            saveCMSettings();
                            
                            setTimeout(function() {
                                
                                $("#cm-" + ((postType == 4) ? "meaning" : "reading") + "-user-buttons .cm-delete-highlight").html("Delete").css({"font-size": "12px", "line-height": "1"}).removeAttr("disabled");
                                $("#cm-" + ((postType == 4) ? "meaning" : "reading")).css("opacity", "1").prev().css("opacity", "0");
                                
                                setTimeout(function() {
                                    $("#cm-" + ((postType == 4) ? "meaning" : "reading")).css({"-webkit-transition": "none",
                                                                                               "-moz-transition": "none",
                                                                                               "-o-transition": "none",
                                                                                               "transition": "none"}).prev().remove();
                                }, 1000);
                                
                            }, 3000);
                        } else if (postType < 8) {
                            updateCMText((postType == 6));
                            loadCM(true, (postType == 6));
                        }
                    }
                    
                    saveCMVotes();
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("Error submitting data to database.");
            }
        });
    }
}

function saveCMData() {
       localStorage.setItem("CMData", JSON.stringify(CMData, function (key, value) {
        //Start Code Credit: Mike Samuel from Stack Overflow
        if (value && typeof value === 'object') {
            var replacement = {};
            for (var k in value) {
                if (Object.hasOwnProperty.call(value, k)) {
                    replacement[decodeURIComponent(k)] = value[k];
                }
            }
            return replacement;
        }
        return value;
        //End Code Credit
    }));
}

function saveCMSettings() {
    localStorage.setItem("CMSettings", JSON.stringify(CMSettings, function (key, value) {
        //Start Code Credit: Mike Samuel from Stack Overflow
        if (value && typeof value === 'object') {
            var replacement = {};
            for (var k in value) {
                if (Object.hasOwnProperty.call(value, k)) {
                    replacement[decodeURIComponent(k)] = value[k];
                }
            }
            return replacement;
        }
        return value;
        //End Code Credit
    }));
}

function saveCMVotes() {
    localStorage.setItem("CMVotes", JSON.stringify(CMVotes, function (key, value) {
        //Start Code Credit: Mike Samuel from Stack Overflow
        if (value && typeof value === 'object') {
            var replacement = {};
            for (var k in value) {
                if (Object.hasOwnProperty.call(value, k)) {
                    replacement[k] = value[k];
                }
            }
            return replacement;
        }
        return value;
        //End Code Credit
    }));
}

//Start Code Credit: Mark from Stack Overflow
$.fn.selectRange = function(start, end) {
    if(!end) end = start; 
    return this.each(function() {
        if (this.setSelectionRange) {
            this.focus();
            this.setSelectionRange(start, end);
        } else if (this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    });
}
//End Code Credit

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));
    o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){
    t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){
    var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);
  	t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){
    t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|
    (c2&63)<<6|c3&63);n+=3}}return t}};

CMTableData = [];
CMTableItems = [];
CMData = {"k": [], "v": []};
CMSettings = {"k": [], "v": []};
CMVotes = {"k": [], "v": []};
CMPageIndex = {"m": 0, "r": 0};
CMSortMap = {"m": [], "r": []};
CMPageMap = {"m": [], "r": []};
CMLastTag = {"m": "", "r": ""};
CMInitData = true;
CMInitSettings = true;
CMInitVotes = true;
CMStylesAdded = false;
CMReady = false;
CMPostReady = true;
CMPreloadReady = false;
CMIndex = -1;
CMSelTemp = -1; 
CMChar = "";
CMType = "";
CMUser = (CMIsReview || CMIsLesson) ? $("#report-errors a").attr("href") : $('.account .nav-header').next().children()[1].href;
CMUser = (CMIsReview || CMIsLesson) ? CMUser.slice(CMUser.indexOf("from%20") + 7, CMUser.indexOf("%20%28")) : CMUser.substring(CMUser.lastIndexOf("/") + 1);
CMVersionCheck = {"v": CMVersion, "c": false };

if (localStorage.getItem("CMVersionCheck") !== null) {
    CMVersionCheck = JSON.parse(localStorage.getItem("CMVersionCheck"));
    localStorage.setItem("CMVersionCheck", JSON.stringify(CMVersionCheck));
}

if (localStorage.getItem("CMData") !== null) {
        CMData = JSON.parse(localStorage.getItem("CMData"), function (key, value) {
            //Start Code Credit: Mike Samuel from Stack Overflow
            if (value && typeof value === 'object')
                for (var k in value) {
                    if (/^[A-Z]/.test(k) && Object.hasOwnProperty.call(value, k)) {
                    value[encodeURIComponent(k)] = value[k];
                    delete value[k];
                }
            }
            return value;
            //End Code Credit
    	});
   	CMInitData = false;
}

if (localStorage.getItem("CMSettings") !== null) {
    CMSettings = JSON.parse(localStorage.getItem("CMSettings"), function (key, value) {
        //Start Code Credit: Mike Samuel from Stack Overflow
    	if (value && typeof value === 'object')
    		for (var k in value) {
        		if (/^[A-Z]/.test(k) && Object.hasOwnProperty.call(value, k)) {
          		value[encodeURIComponent(k)] = value[k];
          		delete value[k];
        	}
      	}
      	return value;
        //End Code Credit
    });
    CMInitSettings = false;
}

if (localStorage.getItem("CMVotes") !== null) {
    CMVotes = JSON.parse(localStorage.getItem("CMVotes"));
    CMInitVotes = false;
}
// @downloadURL https://update.greasyfork.org/scripts/7954/WK%20Community%20Mnemonics.user.js
// @updateURL https://update.greasyfork.org/scripts/7954/WK%20Community%20Mnemonics.meta.js
// ==/UserScript==