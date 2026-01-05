// ==UserScript==
// @name        Wanikani Scrollbox
// @namespace   wkscrollbox
// @description Adds a space on the dashboard that displays items randomly to help remember them without seeing them in 'the wild'.
// @exclude	*.wanikani.com
// @include     *.wanikani.com/dashboard*
// @version     0.9.1.3
// @author     Samuel H
// @grant       none

/* This script is licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) license
*  Details: http://creativecommons.org/licenses/by-nc/4.0/ */

//IMPORTANT: IF THIS IS THE FIRST TIME YOU'VE USED ONE OF MY SCRIPTS THEN YOU NEED TO PUT YOUR API KEY BETWEEN THE DOUBLE QUOTES ON THE LINE BELOW.
apiKey = "";
//Change this to false if you want the scrollbox section above the forum section.
SBPageTop = true;

$("head").append('<script src="https://rawgit.com/WaniKani/WanaKana/master/lib/wanakana.min.js" type="text/javascript"></script>' +
                 '<script src="https://rawgit.com/tobia/Pause/master/jquery.pause.min.js" type="text/javascript"></script>"');

function getSBSection() {
    var intSectionHeight = SBHeight * 100;
    var strSection = '<section id="scroll-box-section" style="width: 100%; height: ' + (intSectionHeight + 30) + 'px; border-radius: 5px; position: relative">' +
        '<div class="answer-exception-form" id="info-window" align="center" style="z-index: 101; display: none"></div>' +
        '<div id="scroll-box-buttons" style="width: 100%; height: 30px"></div>' +
        '<div id="sb-col-sel-tgl" class="Burned" style="border-top-right-radius: 5px; border-bottom-right-radius: 5px; -ms-writing-mode: tb-rl; -webkit-writing-mode: vertical-rl; display: none; color: #fff; text-shadow: none; ' + 
        '-moz-writing-mode: vertical-rl; -ms-writing-mode: vertical-rl; writing-mode: vertical-rl; width: 15px; height: ' + ((!SBLangJP) ? '55px; padding: 5px 10px 5px 15px' : '35px; padding: 20px 10px 10px 15px') +
        '; margin-top: 30px; right: -10px; position: absolute; background-image: linear-gradient(to bottom, #555, #4B4B4B);\"><span lang="jp" style="font-size: 20px; margin-bottom: 0px">' + ((!SBLangJP) ? "Color" : "色") + '</span></div>' +
        '<div id="sb-col-sel" class="Burned" style="border-top-right-radius: 5px; border-bottom-right-radius: 5px; right: 0px; background-color: #eee; position: absolute; width: 90px; height: 90px">' +
        '</div><div id="scroll-box" style="overflow: hidden; width: 100%; height: ' + intSectionHeight + 'px; border-radius: 5px; position: relative">' +
        '<div id="loadingSB" style="background-color: #d4d4d4; width: 100%; height: ' + intSectionHeight + 'px; border-radius: 5px; position: relative; text-align: center; padding-top: ' + (intSectionHeight * 0.375) + 'px"></div>' +
        '<div id="scroll-box-bg" style="background-color: #fff; width: 100%; height: ' + intSectionHeight + 'px; border-radius: 5px; position: absolute"></div>' +
        '</div></section>';
    return strSection;
}

function newSBItem() {
    
    var curSBI = -1;
    var SBIType = -1;
    var SBISrs = -1;
    var SBIIndex = -1;
    var indexArray = [];
    var indexArrayLoc = [];
    var iaLen = 0;
    
    if (SBRadicalsEnabled) {
        if (SBKanjiEnabled) {
            if (SBVocabularyEnabled) {
                if (SBApprenticeEnabled) {
                    indexArray = indexArray.concat(SBIndex.radicals.apprentice, SBIndex.kanji.apprentice, SBIndex.vocabulary.apprentice);
                    indexArrayLoc.push([0, 0, 0], [0, 1, SBIndexCount.radicals.apprentice], [0, 2, SBIndexCount.radicals.apprentice + SBIndexCount.kanji.apprentice]);
                    iaLen = indexArray.length;
                }
                if (SBGuruEnabled) {
                    indexArray = indexArray.concat(SBIndex.radicals.guru, SBIndex.kanji.guru, SBIndex.vocabulary.guru);
                    indexArrayLoc.push([1, 0, iaLen], [1, 1, iaLen + SBIndexCount.radicals.guru], [1, 2, iaLen + SBIndexCount.radicals.guru + SBIndexCount.kanji.guru]);
                    iaLen = indexArray.length;
                }
                if (SBMasterEnabled) {
                    indexArray = indexArray.concat(SBIndex.radicals.master, SBIndex.kanji.master, SBIndex.vocabulary.master);
                    indexArrayLoc.push([2, 0, iaLen], [2, 1, iaLen + SBIndexCount.radicals.master], [2, 2, iaLen + SBIndexCount.radicals.master + SBIndexCount.kanji.master]);
                    iaLen = indexArray.length;
                }
                if (SBEnlightenEnabled) {
                    indexArray = indexArray.concat(SBIndex.radicals.enlighten, SBIndex.kanji.enlighten, SBIndex.vocabulary.enlighten);
                    indexArrayLoc.push([3, 0, iaLen], [3, 1, iaLen + SBIndexCount.radicals.enlighten], [3, 2, iaLen + SBIndexCount.radicals.enlighten + SBIndexCount.kanji.enlighten]);
                    iaLen = indexArray.length;
                }
                if (SBBurnedEnabled) {
                    indexArray = indexArray.concat(SBIndex.radicals.burned, SBIndex.kanji.burned, SBIndex.vocabulary.burned);
                    indexArrayLoc.push([4, 0, iaLen], [4, 1, iaLen + SBIndexCount.radicals.burned], [4, 2, iaLen + SBIndexCount.radicals.burned + SBIndexCount.kanji.burned]);
                    iaLen = indexArray.length;
                }
                if (SBLockedEnabled) {
                    indexArray = indexArray.concat(SBIndex.radicals.locked, SBIndex.kanji.locked, SBIndex.vocabulary.locked);
                    indexArrayLoc.push([5, 0, iaLen], [5, 1, iaLen + SBIndexCount.radicals.locked], [5, 2, iaLen + SBIndexCount.radicals.locked + SBIndexCount.kanji.locked]);
                    iaLen = indexArray.length;
                }
            } else {
                if (SBApprenticeEnabled) {
                    indexArray = indexArray.concat(SBIndex.radicals.apprentice, SBIndex.kanji.apprentice);
                    indexArrayLoc.push([0, 0, 0], [0, 1, SBIndexCount.radicals.apprentice]);
                    iaLen = indexArray.length;
                }
                if (SBGuruEnabled) {
                    indexArray = indexArray.concat(SBIndex.radicals.guru, SBIndex.kanji.guru);
                    indexArrayLoc.push([1, 0, iaLen], [1, 1, iaLen + SBIndexCount.radicals.guru]);
                    iaLen = indexArray.length;
                }
                if (SBMasterEnabled) {
                    indexArray = indexArray.concat(SBIndex.radicals.master, SBIndex.kanji.master);
                    indexArrayLoc.push([2, 0, iaLen], [2, 1, iaLen + SBIndexCount.radicals.master]);
                    iaLen = indexArray.length;
                }
                if (SBEnlightenEnabled) {
                    indexArray = indexArray.concat(SBIndex.radicals.enlighten, SBIndex.kanji.enlighten);
                    indexArrayLoc.push([3, 0, iaLen], [3, 1, iaLen + SBIndexCount.radicals.enlighten]);
                    iaLen = indexArray.length;
                }
                if (SBBurnedEnabled) {
                    indexArray = indexArray.concat(SBIndex.radicals.burned, SBIndex.kanji.burned);
                    indexArrayLoc.push([4, 0, iaLen], [4, 1, iaLen + SBIndexCount.radicals.burned]);
                    iaLen = indexArray.length;
                }
                if (SBLockedEnabled) {
                    indexArray = indexArray.concat(SBIndex.radicals.locked, SBIndex.kanji.locked);
                    indexArrayLoc.push([5, 0, iaLen], [5, 1, iaLen + SBIndexCount.radicals.locked]);
                    iaLen = indexArray.length;
                }
            }
        } else {
            if (SBVocabularyEnabled) {
                if (SBApprenticeEnabled) {
                    indexArray = indexArray.concat(SBIndex.radicals.apprentice, SBIndex.vocabulary.apprentice);
                    indexArrayLoc.push([0, 0, 0], [0, 2, SBIndexCount.radicals.apprentice]);
                    iaLen = indexArray.length;
                }
                if (SBGuruEnabled) {
                    indexArray = indexArray.concat(SBIndex.radicals.guru, SBIndex.vocabulary.guru);
                    indexArrayLoc.push([1, 0, iaLen], [1, 2, iaLen + SBIndexCount.radicals.guru]);
                    iaLen = indexArray.length;
                }
                if (SBMasterEnabled) {
                    indexArray = indexArray.concat(SBIndex.radicals.master, SBIndex.vocabulary.master);
                    indexArrayLoc.push([2, 0, iaLen], [2, 2, iaLen + SBIndexCount.radicals.master]);
                    iaLen = indexArray.length;
                }
                if (SBEnlightenEnabled) {
                    indexArray = indexArray.concat(SBIndex.radicals.enlighten, SBIndex.vocabulary.enlighten);
                    indexArrayLoc.push([3, 0, iaLen], [3, 2, iaLen + SBIndexCount.radicals.enlighten]);
                    iaLen = indexArray.length;
                }
                if (SBBurnedEnabled) {
                    indexArray = indexArray.concat(SBIndex.radicals.burned, SBIndex.vocabulary.burned);
                    indexArrayLoc.push([4, 0, iaLen], [4, 2, iaLen + SBIndexCount.radicals.burned]);
                    iaLen = indexArray.length;
                }
                if (SBLockedEnabled) {
                    indexArray = indexArray.concat(SBIndex.radicals.locked, SBIndex.vocabulary.locked);
                    indexArrayLoc.push([5, 0, iaLen], [5, 2, iaLen + SBIndexCount.radicals.locked]);
                    iaLen = indexArray.length;
                }
            } else {
                if (SBApprenticeEnabled) {
                    indexArray = indexArray.concat(SBIndex.radicals.apprentice);
                    indexArrayLoc.push([0, 0, 0]);
                    iaLen = indexArray.length;
                }
                if (SBGuruEnabled) {
                    indexArray = indexArray.concat(SBIndex.radicals.guru);
                    indexArrayLoc.push([1, 0, iaLen]);
                    iaLen = indexArray.length;
                }
                if (SBMasterEnabled) {
                    indexArray = indexArray.concat(SBIndex.radicals.master);
                    indexArrayLoc.push([2, 0, iaLen]);
                    iaLen = indexArray.length;
                }
                if (SBEnlightenEnabled) {
                    indexArray = indexArray.concat(SBIndex.radicals.enlighten);
                    indexArrayLoc.push([3, 0, iaLen]);
                    iaLen = indexArray.length;
                }
                if (SBBurnedEnabled) {
                    indexArray = indexArray.concat(SBIndex.radicals.burned);
                    indexArrayLoc.push([4, 0, iaLen]);
                    iaLen = indexArray.length;
                }
                if (SBLockedEnabled) {
                    indexArray = indexArray.concat(SBIndex.radicals.locked);
                    indexArrayLoc.push([5, 0, iaLen]);
                    iaLen = indexArray.length;
                }
            }
        }
    } else if (SBKanjiEnabled) {
        if (SBVocabularyEnabled) {
            if (SBApprenticeEnabled) {
                indexArray = indexArray.concat(SBIndex.kanji.apprentice, SBIndex.vocabulary.apprentice);
                indexArrayLoc.push([0, 1, 0], [0, 2, SBIndexCount.kanji.apprentice]);
                iaLen = indexArray.length;
            }
            if (SBGuruEnabled) {
                indexArray = indexArray.concat(SBIndex.kanji.guru, SBIndex.vocabulary.guru);
                indexArrayLoc.push([1, 1, iaLen], [1, 2, iaLen + SBIndexCount.kanji.guru]);
                iaLen = indexArray.length;
            }
            if (SBMasterEnabled) {
                indexArray = indexArray.concat(SBIndex.kanji.master, SBIndex.vocabulary.master);
                indexArrayLoc.push([2, 1, iaLen], [2, 2, iaLen + SBIndexCount.kanji.master]);
                iaLen = indexArray.length;
            }
            if (SBEnlightenEnabled) {
                indexArray = indexArray.concat(SBIndex.kanji.enlighten, SBIndex.vocabulary.enlighten);
                indexArrayLoc.push([3, 1, iaLen], [3, 2, iaLen + SBIndexCount.kanji.enlighten]);
                iaLen = indexArray.length;
            }
            if (SBBurnedEnabled) {
                indexArray = indexArray.concat(SBIndex.kanji.burned, SBIndex.vocabulary.burned);
                indexArrayLoc.push([4, 1, iaLen], [4, 2, iaLen + SBIndexCount.kanji.burned]);
                iaLen = indexArray.length;
            }
            if (SBLockedEnabled) {
                indexArray = indexArray.concat(SBIndex.kanji.locked, SBIndex.vocabulary.locked);
                indexArrayLoc.push([5, 1, iaLen], [5, 2, iaLen + SBIndexCount.kanji.locked]);
                iaLen = indexArray.length;
            }
        } else {
            if (SBApprenticeEnabled) {
                indexArray = indexArray.concat(SBIndex.kanji.apprentice);
                indexArrayLoc.push([0, 1, 0]);
                iaLen = indexArray.length;
            }
            if (SBGuruEnabled) {
                indexArray = indexArray.concat(SBIndex.kanji.guru);
                indexArrayLoc.push([1, 1, iaLen]);
                iaLen = indexArray.length;
            }
            if (SBMasterEnabled) {
                indexArray = indexArray.concat(SBIndex.kanji.master);
                indexArrayLoc.push([2, 1, iaLen]);
                iaLen = indexArray.length;
            }
            if (SBEnlightenEnabled) {
                indexArray = indexArray.concat(SBIndex.kanji.enlighten);
                indexArrayLoc.push([3, 1, iaLen]);
                iaLen = indexArray.length;
            }
            if (SBBurnedEnabled) {
                indexArray = indexArray.concat(SBIndex.kanji.burned);
                indexArrayLoc.push([4, 1, iaLen]);
                iaLen = indexArray.length;
            }
            if (SBLockedEnabled) {
                indexArray = indexArray.concat(SBIndex.kanji.locked);
                indexArrayLoc.push([5, 1, iaLen]);
                iaLen = indexArray.length;
            }
        }
    } else {
        if (SBApprenticeEnabled) {
            indexArray = indexArray.concat(SBIndex.vocabulary.apprentice);
            indexArrayLoc.push([0, 2, 0]);
            iaLen = indexArray.length;
        }
        if (SBGuruEnabled) {
            indexArray = indexArray.concat(SBIndex.vocabulary.guru);
            indexArrayLoc.push([1, 2, iaLen]);
            iaLen = indexArray.length;
        }
        if (SBMasterEnabled) {
            indexArray = indexArray.concat(SBIndex.vocabulary.master);
            indexArrayLoc.push([2, 2, iaLen]);
            iaLen = indexArray.length;
        }
        if (SBEnlightenEnabled) {
            indexArray = indexArray.concat(SBIndex.vocabulary.enlighten);
            indexArrayLoc.push([3, 2, iaLen]);
            iaLen = indexArray.length;
        }
        if (SBBurnedEnabled) {
            indexArray = indexArray.concat(SBIndex.vocabulary.burned);
            indexArrayLoc.push([4, 2, iaLen]);
            iaLen = indexArray.length;
        }
        if (SBLockedEnabled) {
            indexArray = indexArray.concat(SBIndex.vocabulary.locked);
            indexArrayLoc.push([5, 2, iaLen]);
            iaLen = indexArray.length;
        }
    }
    //alert(Object.keys(indexArray).length)
    curSBI = rand(0, Object.keys(indexArray).length - 1);
    /*if (SBIType == 0) curSBType = 0;
    else { 
       	curSBType = rand(0, 1);
        
        if (SBIType == 1) {
            if (SBRadicalsEnabled) curSBI -= Object.keys(SBRadicalData).length;
        } else if (SBIType == 2) {
            if (SBRadicalsEnabled) {
                if (SBKanjiEnabled) curSBI -= (Object.keys(SBRadicalData).length + Object.keys(SBKanjiData).length);
                else curSBI -= (Object.keys(SBRadicalData).length);
            } else if (SBKanjiEnabled) curSBI -= Object.keys(SBKanjiData).length;
        }
    }*/
    //alert(SBLockedEnabled + " " + SBEnlightenEnabled + " " + SBApprenticeEnabled);
    
    var foundLoc = false;
    
    for (var t = 1; t <= Object.keys(indexArrayLoc).length; t++) {
        /*if (t < Object.keys(indexArrayLoc).length && indexArrayLoc[t-1][2] == indexArrayLoc[t][2]) {
            indexArrayLoc = indexArrayLoc.splice(t-1);
        }*/
        if (!foundLoc) {
            if (t == Object.keys(indexArrayLoc).length || curSBI < indexArrayLoc[t][2]) {
                SBIType = indexArrayLoc[t-1][1];
                SBIIndex = indexArray[curSBI];
                SBISrs = (SBIType == 0) ? SBRadicalData[SBIIndex].srs : ((SBIType == 1) ? SBKanjiData[SBIIndex].srs : SBVocabData[SBIIndex].srs);
                switch(SBISrs) {
                    case "apprentice":
                        SBISrs = 0;
                        break;
                    case "guru":
                        SBISrs = 1;
                        break;
                    case "master":
                        SBISrs = 2;
                        break;
                    case "enlighten":
                        SBISrs = 3;
                        break;
                    case "burned":
                        SBISrs = 4;
                        break;
                    case null:
                        SBISrs = 5;
                }
                if (SBISrs !== indexArrayLoc[t-1][0]) alert("SRS mismatch: " + indexArrayLoc[t-1][0] + " should be " + SBISrs);
                foundLoc = true;
            }
        }
    }
    
    var SBISize = rand(14, 49);
    var SBISpeed = rand(0.75, 1.25);
    var SBIx = 1170;
    var SBIy = 0;
    
    SBICount++;
    //alert(SBIndex.kanji);
    $("#scroll-box").prepend('<a href="https://www.wanikani.com/' + ((SBIType == 0) ? "radicals" : ((SBIType == 1) ? "kanji" : "vocabulary")) + '/' + 
                             ((SBIType == 0) ? SBRadicalData[SBIIndex].meaning : ((SBIType == 1) ? SBKanjiData[SBIIndex].character : SBVocabData[SBIIndex].character)) +
                             '" target="_blank" id="SBI' + SBICount + '" lang="ja" cc="' + ((SBIType == 0) ? SBIndexBG.radicals[SBIIndex] : ((SBIType == 1) ? SBIndexBG.kanji[SBIIndex] : SBIndexBG.vocabulary[SBIIndex])) +
                             '">' + ((SBIType == 0) ? SBRadicalData[SBIIndex].character : ((SBIType == 1) ? SBKanjiData[SBIIndex].character : SBVocabData[SBIIndex].character)) + '</a>');
    
    var SBI = $("#SBI" + SBICount);
    SBI.css({"font-size": SBISize, "text-decoration": "none", "line-height": (SBISize * 1.25) + "px", "min-width": (SBISize * 1.1) + "px", "text-align": "center", "padding": "0px " + ((SBISize / 35) * 2) + "px 0px " + ((SBISize / 35) * 2)  + "px"});
    var SBIw = SBI.width();
    var SBIh = SBI.height();
    //alert(SBIh);
    SBIy = rand(0, (SBHeight * 100) - (SBISize * 1.25));
    switch (SBISrs) {
        case 0:
            SBI.addClass("Apprentice");
            break;
        case 1:
            SBI.addClass("Guru");
            break;
        case 2:
            SBI.addClass("Master");
            break;
        case 3:
            SBI.addClass("Enlightened");
            break;
        case 4:
            SBI.addClass("Burned");
            break;
        case 5:
            SBI.addClass("Locked");
    }
    if (SBI.attr("cc") > 0) SBI.addClass("sbcc" + SBI.attr("cc"));
    SBI.css({"color": (((SBI.attr("cc") == 0 && SBISrs < 5) || SBI.attr("cc") > 1) ? "#fff" : (SBI.attr("cc") > 1) ? "#E3E3E3" : "#ccc"), "margin-top": SBIy, "left": SBIx + SBISize, "margin-right": -SBIw * 1.5, "border-radius": (SBISize * 0.15) + "px", "z-index": SBISize, "position": "absolute",
             "-webkit-touch-callout": "none", "-webkit-user-select": "none", "-khtml-user-select": "none", "-moz-user-select": "none", "-ms-user-select": "none", "user-select": "none"});
    SBI.animate({ "left": -SBIw*1.5}, {"duration": (SBISpeed * Math.pow((SBISize / 17), -1.1)) * 49000 / SBSpeed, "queue": false, "complete": function() {
        $(this).remove();
    }
                                      }, "linear" ).attr("speed", SBISpeed);
    SBI.mouseover(function() {
        SBPause = true;
        clearInterval(newSBItemTimer);
        
        var SBIP;
        
        for (var p = 1; p <= SBICount; p++) {
            SBIP = $("#SBI" + p);
            SBIP.pause();
        }
        
        if (SBColIndex > -1) $(this).attr("link", $(this).attr("href")).attr("href", "javascript:void(1)");
        else if (SBColIndex == 15) SBColIndex = rand(1, 14);
        
        SBSelect($(this), SBIType);
        $(this).attr("oldZ", $(this).css("z-index")).css("z-index", 99);
    }).mouseout(function() {
        SBPause = false;
        newSBItemTimer = setInterval(newSBItem, 1500 / SBSpeed);
        
        var SBIR;
        
        for (var r = 1; r <= SBICount; r++) {
            SBIR = $("#SBI" + r);
            SBIR.resume();
        }
        SBSelect(null);
        $(this).css({"z-index": $(this).attr("oldZ")});
        if (SBColIndex > -1) $(this).attr("href", $(this).attr("link")).removeAttr("link");
    }).mousedown(function() {
        if (SBColIndex > -1) {
            if (!$(this).hasClass("Locked")) {
                colIndex = (SBColIndex < 15) ? SBColIndex : rand(1, 14);
                if ($(this).attr("cctemp") === undefined) {
                    $(this).attr("cctemp", $(this).attr("cc"));
                    if ($(this).attr("cc") > 0) $(this).removeClass("sbcc" + $(this).attr("cc"));
                    if (colIndex > 0) $(this).attr("cc", colIndex).addClass("sbcc" + colIndex);
                    else $(this).attr("cc", 0).removeClass("sbcc" + $(this).attr("cc"));
                    if (colIndex == 1) $(this).css("color", "#aaa");
                    else if ($(this).attr("cctemp") == 1) $(this).css("color", "#fff");
                } else {
                    $(this).attr("cctemp2", $(this).attr("cc"));
                    if ($(this).attr("cc") > 0) $(this).removeClass("sbcc" + $(this).attr("cc"));
                    if ($(this).attr("cctemp") > 0) $(this).attr("cc", $(this).attr("cctemp")).addClass("sbcc" + $(this).attr("cctemp"));
                    else $(this).attr("cc", 0).removeClass("sbcc" + $(this).attr("cctemp"));
                    if ($(this).attr("cc") == 1) $(this).css("color", "#ccc");
                    else if ($(this).attr("cctemp2") == 1) $(this).css("color", "#fff");
                    $(this).attr("cctemp", $(this).attr("cctemp2")).removeAttr("cctemp2");
                    if (SBColIndex == 15) $(this).removeAttr("cctemp");
                }
                if ($(this).attr("link").indexOf("/radicals/") > 0) SBIndexBG.radicals[getSBIndex(0, $(this).attr("link").substring($(this).attr("link").indexOf("s/") + 2))] = colIndex;
                else if ($(this).attr("link").indexOf("/kanji/") > 0) SBIndexBG.kanji[getSBIndex(1, $(this).attr("link").substring($(this).attr("link").indexOf("i/") + 2))] = colIndex;
                else SBIndexBG.vocabulary[getSBIndex(2, $(this).attr("link").substring($(this).attr("link").indexOf("y/") + 2))] = colIndex;
                localStorage.setItem("SBIndexBG", JSON.stringify(SBIndexBG));
            }
        }
        /*$("#info-window").html('<span style="display:inline-block;padding:0.5em 0.7em 0.6em;background-color:#a2a2a2;color:#fff;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;-webkit-box-shadow:3px 3px 0 #e1e1e1;\
-moz-box-shadow:3px 3px 0 #e1e1e1;box-shadow:3px 3px 0 #e1e1e1;position: absolute; width: 560px; height: 410px; margin-top: 0px; margin-left: 30px; top: -200px; bottom: initial; left: initial; z-index: 102">\
<iframe src="' + $(this).attr("link") + '#information" width="550" height="400" style="position: relative; z-index: 103"></iframe></span>').css({"display": "block"}).addClass("animated fadeInUp");*/
    }).mouseup(function() {
    });
}

function getSBIndex(type, id) {
    if (type > 0) {
        if (type == 2) {
            for (var v = 0; v < Object.keys(SBVocabData).length; v++) {
                if (SBVocabData[v].character == id) {
                    return v;
                }
            }
        } else {
            for (var k = 0; k < Object.keys(SBKanjiData).length; k++) {
                if (SBKanjiData[k].character == id) {
                    return k;
                }
            }
        }
    } else {
        for (var r = 0; r < Object.keys(SBRadicalData).length; r++) {
            if (SBRadicalData[r].meaning == id) {
                return r;
            }
        }
    }
}

function getSBRadicalData() {
    
    if (!SBLangJP) $("#loadingSB").html('<h3 style="color: #00a0f1">Retrieving radical data...</h3>');
    else $("#loadingSB").html('<h3 style="color: #00a0f1">部首データを検索中…</h3>');
    
    var req = new XMLHttpRequest();
    
    req.open('GET', 'https://www.wanikani.com/api/user/' + apiKey + '/radicals/' + SBLevels, true);
    req.onreadystatechange = function() {
        if (req.readyState === 4) {
            if (req.status >= 200 && req.status < 400) {
                SBRadicalData = filterSBRadicalData(req.responseText.split('"character":"'));
                localStorage.setItem("SBRadicals", JSON.stringify(SBRadicalData));
                getSBKanjiData();
            } else {
                alert("error");
            }
        }
    };
    req.send();
    
}

function getSBKanjiData() {
    
    if (!SBLangJP) $("#loadingSB").html('<h3 style="color: #f100a0">Retrieving kanji data...</h3>');
    else $("#loadingSB").html('<h3 style="color: #f100a0">漢字データを検索中…</h3>');
    
    var req = new XMLHttpRequest();
    
    req.open('GET', 'https://www.wanikani.com/api/user/' + apiKey + '/kanji/' +  SBLevels , true);
    req.onreadystatechange = function() {
        if (req.readyState === 4) {
            if (req.status >= 200 && req.status < 400) {
                SBKanjiData = filterSBKanjiData(req.responseText.split('"character":"'));
                localStorage.setItem("SBKanji", JSON.stringify(SBKanjiData));
                getSBVocabData(true);
            } else {
                alert("error");
            }
        }
    };
    req.send();
    
}

function getSBVocabData(firstPart) {
    
    if (!SBLangJP) $("#loadingSB").html('<h3 style="color: #a000f1">Retrieving vocabulary data...</h3>');
    else $("#loadingSB").html('<h3 style="color: #a000f1">単語データを検索中…</h3>');
    
    var req = new XMLHttpRequest();
    req.open('GET', 'https://www.wanikani.com/api/user/' + apiKey + '/vocabulary/' + ((firstPart) ? SBLevels.substring(0, SBLevels.indexOf(",26")) : SBLevels.substring(SBLevels.indexOf("26"))), true);
    req.onreadystatechange = function() {
        if (req.readyState === 4) {
            if (req.status >= 200 && req.status < 400) {
                if (!firstPart) {
                    SBVocabData[1] = req.responseText.split('"character":"');
                    SBVocabData = filterSBVocabData(SBVocabData);
                    localStorage.setItem("SBVocab", JSON.stringify(SBVocabData));
                    localStorage.setItem("SBIndex", JSON.stringify(SBIndex));
                    localStorage.setItem("SBIndexCount", JSON.stringify(SBIndexCount));
                    initScrollBox();
                } else {
                    SBVocabData[0] = req.responseText.split('"character":"');
                    getSBVocabData(false);
                }
            } else {
                alert("error");
            }
        }
    };
    req.send();
}

function switchSBLang() {
    
    SBLangJP = !SBLangJP;
    
    if (SBLangJP) {
        $(".bsbsa span").html("見習い");
        $(".bsbsg span").html("尊師");
        $(".bsbsm span").html("達人");
        $(".bsbse span").html("啓発");
        $(".bsbsb span").html("焦げ");
        $(".bsbsl span").html("ロック");
        $(".bsbtc span").html("キャッシュ").css({"font-size": "14px", "padding-top": "3px"});
        $(".bsbts span").html("スタート\nボタン").css({"font-size": "14px"});
        $(".bsbmlh").html("高さの乗数").css({"font-size": "14px", "padding": "0px 5px 0px 10px"});
        $(".bsbmh").css("margin-top", "0px");
        $(".bsbmls").html("速度の乗数").css({"font-size": "14px", "padding-top": "0px"});
        $(".bsbms").css("margin-top", "-20px");
        $("#sb-col-sel-tgl span").html("色").parent().css({"padding": "20px 10px 10px 15px", "height": "35px"});
    } else {
        $(".bsbsa span").html("Appr");
        $(".bsbsg span").html("Guru");
        $(".bsbsm span").html("Master");
        $(".bsbse span").html("Enlight");
        $(".bsbsb span").html("Burned");
        $(".bsbsl span").html("Locked"); 
        $(".bsbtc span").html("Cache").css({"font-size": "inherit", "padding-top": "0px"});
        $(".bsbts span").html("Start\nButton").css({"font-size": "12px"});
        $(".bsbmlh").html("Height Multiplier").css({"font-size": "9px", "padding": "0px 5px 0px 5px"});
        $(".bsbmh").css("margin-top", "5px");
        $(".bsbmls").html("Speed Multiplier").css({"font-size": "9px", "padding-top": "8px"});
        $(".bsbms").css("margin-top", "-16px");
        $("#sb-col-sel-tgl span").html("Color").parent().css({"padding": "5px 10px 5px 15px", "height": "55px"});
    }
}

function SBResize() {
    var intSBHeight = SBHeight * 100;
    $("#scroll-box-section").css({"-webkit-transition": "1s ease-in-out",
                                      "-moz-transition": "1s ease-in-out",
                                      "-o-transition": "1s ease-in-out",
                                      "transition": "1s ease-in-out",
                                  	"height": (intSBHeight + 30) + "px"});
    $("#scroll-box, #scroll-box-bg").css({"-webkit-transition": "1s ease-in-out",
                                      "-moz-transition": "1s ease-in-out",
                                      "-o-transition": "1s ease-in-out",
                                      "transition": "1s ease-in-out",
                                      "height": intSBHeight + "px"});
}


function getSBWKData() {
    
    if (localStorage.getItem("SBRadicals") === null || localStorage.getItem("SBKanji") === null || localStorage.getItem("SBVocab") === null) getSBRadicalData();
    else {
        SBRadicalData = JSON.parse(localStorage.getItem("SBRadicals"));
        SBKanjiData = JSON.parse(localStorage.getItem("SBKanji"));
        SBVocabData = JSON.parse(localStorage.getItem("SBVocab"));
        initScrollBox();
    }
}

function clearSBItemData() {
    localStorage.removeItem("SBRadicals");
    localStorage.removeItem("SBKanji");
    localStorage.removeItem("SBVocab");
    localStorage.removeItem("SBIndex");
    localStorage.removeItem("SBIndexCount");
    SBIndex = {
        "radicals": {
            "apprentice": [], "guru": [], "master": [], "enlighten": [], "burned": [], "locked": []
        }, "kanji": {
            "apprentice": [], "guru": [], "master": [], "enlighten": [], "burned": [], "locked": []
        }, "vocabulary": {
            "apprentice": [], "guru": [], "master": [], "enlighten": [], "burned": [], "locked": []
        }
    };
    SBIndexCount = {
        "radicals": {
            "apprentice": 0, "guru": 0, "master": 0, "enlighten": 0, "burned": 0, "locked": 0
        }, "kanji": {
            "apprentice": 0, "guru": 0, "master": 0, "enlighten": 0, "burned": 0, "locked": 0
        }, "vocabulary": {
            "apprentice": 0, "guru": 0, "master": 0, "enlighten": 0, "burned": 0, "locked": 0
        }
    };
}

function initScrollBox() {
    if (Object.keys(SBIndexBG.vocabulary).length === 0) {
        for (var r = 0; r < Object.keys(SBRadicalData).length; r++) SBIndexBG.radicals.push(0);
        for (var k = 0; k < Object.keys(SBKanjiData).length; k++) SBIndexBG.kanji.push(0);
        for (var v = 0; v < Object.keys(SBVocabData).length; v++) SBIndexBG.vocabulary.push(0);
    }
    $("#loadingSB").remove();
    $("head").append("<style type=text/css>\
        #scroll-box-section span {\
        display: block;\
        margin-bottom: 0.5em;\
        font-weight: bold;\
        line-height: 1.0em;\
        }\
        .bsbi div, .bsbs div, .bsbt div, .bsbm div div {\
        background-color: rgb(49, 49, 49);\
        background-image: linear-gradient(to bottom, rgb(67, 67, 67), rgb(49, 49, 49));\
        color: #E3E3E3\
        -moz-box-shadow: inset 2px 2px 2px rgba(255, 255, 255, .2), inset -2px -2px 2px rgba(0, 0, 0, .2);\
        -webkit-box-shadow: inset 2px 2px 2px rgba(255, 255, 255, .2), inset -2px -2px 2px rgba(0, 0, 0, .2);\
        box-shadow: inset 2px 2px 2px rgba(255, 255, 255, .2), inset -2px -2px 2px rgba(0, 0, 0, .2);\
        }\
        .bsbir.on {\
        background-color: #00a0f1; background-image: linear-gradient(to bottom, #0af, #0093dd);\
        }\
        .bsbik.on {\
        background-color: #f100a0; background-image: linear-gradient(to bottom, #f0a, #dd0093);\
        }\
        .bsbiv.on {\
        background-color: #a000f1; background-image: linear-gradient(to bottom, #a0f, #9300dd);\
        }\
        .bsbt .on, .bsbm div .on {\
        background-color: #80c100; background-image: linear-gradient(to bottom, #8c0, #73ad00);\
        }\
        .Apprentice, .bsbsa.on {\
        background: #f100a0;\
        border-color: #f100a0;\
        background-image: linear-gradient(to bottom, #f0a, #dd0093);\
        }\
        .Guru, .bsbsg.on {\
        background: #882d9e;\
        border-color: #882d9e;\
        background-image: linear-gradient(to bottom, #aa38c6, #882d9e);\
        }\
        .Master, .bsbsm.on {\
        background: #294ddb;\
        border-color: #294ddb;\
        background-image: linear-gradient(to bottom, #5571e2, #294ddb);\
        }\
        .Enlightened, .bsbse.on {\
        background: #0093dd;\
        border-color: #0093dd;\
        background-image: linear-gradient(to bottom, #0af, #0093dd);\
        }\
        .Burned, .bsbsb.on {\
        background: #434343;\
        border-color: #434343;\
        background-image: linear-gradient(to bottom, #555, #434343);\
        }\
        .Locked, .bsbsl.on {\
        background: #868686;\
        border-color: #313131;\
        background-image: linear-gradient(to bottom, #bbb, #a3a3a3);\
        }\
        .on {\
        color: #FFF\
        }\
        .SBSelect {\
        opacity: 0.5;\
        pointer-events: none;\
        }\
        .sbcc0 {\
        background: #434343;\
        background-image: linear-gradient(90deg, #f100a0, #882d9e, #0093dd, #434343, #868686);\
        }\
        .sbcc1 {\
        background: #fff;\
        background-image: linear-gradient(to bottom, #fff, #e3e3e3);\
        }\
        .sbcc2 {\
        background: #131313;\
        background-image: linear-gradient(to bottom, #131313, #000);\
        }\
        .sbcc3 {\
        background: #ff1313;\
        background-image: linear-gradient(to bottom, #ff1313, #e30000);\
        }\
        .sbcc4 {\
        background: #f0a;\
        background-image: linear-gradient(to bottom, #fa0, #dd9300);\
        }\
        .sbcc5 {\
        background: #fe0;\
        background-image: linear-gradient(to bottom, #fe0, #e3d300);\
        }\
        .sbcc6 {\
        background: #28a0228;\
        background-image: linear-gradient(to bottom, #28a028, #1a931a);\
        }\
        .sbcc7 {\
        background: #58e058;\
        background-image: linear-gradient(to bottom, #58e058, #48d348);\
        }\
	   .sbcc8 {\
        background: #00f0fa;\
        background-image: linear-gradient(to bottom, #00f0fa, #00e3f0);\
        }\
        .sbcc9 {\
        background: #1313a0;\
        background-image: linear-gradient(to bottom, #1378a0, #006093);\
        }\
        .sbcc10 {\
        background: #1313a0;\
        background-image: linear-gradient(to bottom, #1313a0, #000093);\
        }\
        .sbcc11 {\
        background: #a858e0;\
        background-image: linear-gradient(to bottom, #a858e0, #9a4ad3);\
        }\
        .sbcc12 {\
		background: #ecbcf3;\
        background-image: linear-gradient(to bottom, #ecbcf3, #e0b0d6);\
        }\
        .sbcc13 {\
        background: #ec13a3;\
        background-image: linear-gradient(to bottom, #ec13a3, ##e00a90);\
        }\
        .sbcc14 {\
        background: #8c735a;\
        background-image: linear-gradient(to bottom, #8c735a, #806650);\
        }\
        .sbcc15 {\
		background: #fff;\
        background-image: linear-gradient(to bottom, #fff, #e3e3e3);\
        }\
        </style>");
    $("#scroll-box-buttons").append('<div class="bsbi" style="width: 0px; height: 0px; position: absolute; z-index: 11">\
        <div class="bsbir' + ((SBRadicalsEnabled) ? ' on' : '') + '" style="position: absolute"><span lang="ja" style="font-size: inherit">部首</span></div>\
        <div class="bsbik' + ((SBKanjiEnabled) ? ' on' : '') + '" style="margin-left: 56px; position: absolute"><span lang="ja" style="font-size: inherit;">漢字</span></div>\
        <div class="bsbiv' + ((SBVocabularyEnabled) ? ' on' : '') + '" style="margin-left: 112px; position: absolute"><span lang="ja" style="font-size: inherit">単語</span></div>\
        </div>\
        <div class="bsbs" style="width: 0px; height: 0px; position: absolute; z-index: 11">\
        <div class="bsbsa' + ((SBApprenticeEnabled) ? ' on' : '') + '" style="margin-left: 168px; position: absolute"><span lang="ja" style="font-size: inherit">' + ((!SBLangJP) ? "Appr" : "見習い") + '</span></div>\
        <div class="bsbsg' + ((SBGuruEnabled) ? ' on' : '') + '" style="margin-left: 248px; position: absolute"><span lang="ja" style="font-size: inherit">' + ((!SBLangJP) ? "Guru" : "尊師") + '</span></div>\
        <div class="bsbsm' + ((SBMasterEnabled) ? ' on' : '') + '" style="margin-left: 328px; position: absolute"><span lang="ja" style="font-size: inherit">' + ((!SBLangJP) ? "Master" : "達人") + '</span></div>\
        <div class="bsbse' + ((SBEnlightenEnabled) ? ' on' : '') + '" style="margin-left: 408px; position: absolute"><span lang="ja" style="font-size: inherit">' + ((!SBLangJP) ? "Enlight" : "啓発") + '</span></div>\
        <div class="bsbsb' + ((SBBurnedEnabled) ? ' on' : '') + '" style="margin-left: 488px; position: absolute"><span lang="ja" style="font-size: inherit">' + ((!SBLangJP) ? "Burned" : "焦げ") + '</span></div>\
        <div class="bsbsl' + ((SBLockedEnabled) ? ' on' : '') + '" style="margin-left: 568px; position: absolute"><span lang="ja" style="font-size: inherit">' + ((!SBLangJP) ? "Locked" : "ロック") + '</span></div></div>\
        <div class="bsbt" style="width: 0px; position: absolute; z-index: 11; margin-left: 648px">\
        <div class="bsbtj' + ((SBLangJP) ? ' on' : '') + '" style="position: absolute"><span lang="ja" style="font-size: inherit">日本語</span></div>\
        <div class="bsbtc' + ((SBUseCache) ? ' on' : '') + '" style="margin-left: 80px; position: absolute"><span lang="ja" style="font-size: ' + ((!SBLangJP) ? "inherit" : "14px; padding-top: 3px") + '">' + ((!SBLangJP) ? "Cache" : "キャッシュ") + '</span></div>\
        <div class="bsbts' + ((SBStart) ? ' on' : '') + '" style="margin-left: 160px; position: absolute"><span lang="ja" style="font-size: ' + ((!SBLangJP) ? "12px" : "14px") + '; margin-top: -3px">' + ((!SBLangJP) ? "Start\nButton" : "スタート\nボタン") + '</span></div>\></div>\
        </div>\
<div class="bsbm" style="width: 0px; margin-left: 888px; position: absolute; z-index: 11">\
<span class="bsbmlh" style="font-size: ' + ((!SBLangJP) ? "9" : "14") + 'px; width: 80px; padding: 0px 5px 0px ' + ((!SBLangJP) ? "5" : "10") + 'px; margin-bottom: 1px" lang="jp">' + ((!SBLangJP) ? "Height Multiplier" : "高さの乗数") + '</span>\
<div class="bsbmh" style="width: 0px; position: absolute' + ((!SBLangJP) ? "; margin-top: 5px" : "" ) + '">\
<div class="bsbmh0' + ((SBHeight == 1) ? ' on' : '') + '" style="position: absolute; margin-top: -15px; margin-left: 85px; width: 20px"><span style="font-size: 14px; width: 20px; padding: 2px 8px 2px 2px; margin-bottom: 0px" lang="jp">1x</div>\
<div class="bsbmh1' + ((SBHeight == 2) ? ' on' : '') + '" style="position: absolute; margin-top: -15px; margin-left: 113px; width: 20px"><span style="font-size: 14px; width: 20px; padding: 2px 8px 2px 2px; margin-bottom: 0px" lang="jp">2x</div>\
<div class="bsbmh2' + ((SBHeight == 3) ? ' on' : '') + '" style="position: absolute; margin-top: -15px; margin-left: 141px; width: 20px"><span style="font-size: 14px; width: 20px; padding: 2px 8px 2px 2px; margin-bottom: 0px" lang="jp">3x</div>\
<div class="bsbmh3' + ((SBHeight == 4) ? ' on' : '') + '" style="position: absolute; margin-top: -15px; margin-left: 169px; width: 20px"><span style="font-size: 14px; width: 20px; padding: 2px 8px 2px 2px; margin-bottom: 0px" lang="jp">4x</div>\
<div class="bsbmh4' + ((SBHeight == 5) ? ' on' : '') + '" style="position: absolute; margin-top: -15px; margin-left: 197px; width: 20px"><span style="font-size: 14px; width: 20px; padding: 2px 8px 2px 2px; margin-bottom: 0px" lang="jp">5x</div>\
</div><span class="bsbmls" style="font-size: ' + ((!SBLangJP) ? "9" : "14") + 'px; width: 80px; padding: ' + ((!SBLangJP) ? "8" : "0") + 'px 5px 0px 7px" lang="jp">' + ((!SBLangJP) ? "Speed Multiplier" : "速度の乗数") + '</span>\
<div class="bsbms" style="width: 0px; margin-top: -' + ((!SBLangJP) ? "16" : "20") + 'px; position: absolute">\
<div class="bsbms0' + ((SBSpeed == 0.5) ? ' on' : '') + '" style="position: absolute; margin-left: 85px; width: 20px"><span style="font-size: 14px; width: 20px; padding: 2px 8px 2px 2px; margin-bottom: 0px" lang="jp">0.5x</div>\
<div class="bsbms1' + ((SBSpeed == 1) ? ' on' : '') + '" style="position: absolute; margin-left: 113px; width: 20px"><span style="font-size: 14px; width: 20px; padding: 2px 8px 2px 2px; margin-bottom: 0px" lang="jp">1x</div>\
<div class="bsbms2' + ((SBSpeed == 1.5) ? ' on' : '') + '" style="position: absolute; margin-left: 141px; width: 20px"><span style="font-size: 14px; width: 20px; padding: 2px 8px 2px 2px; margin-bottom: 0px" lang="jp">1.5x</div>\
<div class="bsbms3' + ((SBSpeed == 2) ? ' on' : '') + '" style="position: absolute; margin-left: 169px; width: 20px"><span style="font-size: 14px; width: 20px; padding: 2px 8px 2px 2px; margin-bottom: 0px" lang="jp">2x</div>\
<div class="bsbms4' + ((SBSpeed == 2.5) ? ' on' : '') + '" style="position: absolute; margin-left: 197px; width: 20px"><span style="font-size: 14px; width: 20px; padding: 2px 8px 2px 2px; margin-bottom: 0px" lang="jp">2.5x</div>\
        </div>');
    $(".bsbi div, .bsbs div, .bsbt div, .bsbm div div span, .sb-col-sel-tgl span").css({"font-size": "20px", "text-shadow": "none", "-webkit-touch-callout": "none", "-webkit-user-select": "none", "-khtml-user-select": "none",
        "-moz-user-select": "none", "-ms-user-select": "none", "user-select": "none"});
    $(".bsbi div, .bsbs div, .bsbm div div, .bsbt div").css({"background-repeat": "repeat-x", "color": "#fff", "padding": "5px 4px 0px 4px", "text-align": "center", "vertical-align": "middle"});
    $(".bsbi div, .bsbs div, .bsbt div").css({"width": "72px"}).mouseover(function() {
        $(this).css("text-shadow", "0 0 0.2em #fff");
    }).mouseout(function() {
        $(this).css("text-shadow", "none");
    });
    $(".bsbi div, .bsbs div").css({"height": "24px"});
    $('.bsbi div').css({"width": "48px"}).click(function() {
        var cancel = false;
        if ($(this).hasClass("on")) {
            if ((SBRadicalsEnabled && SBKanjiEnabled) || (SBRadicalsEnabled && SBVocabularyEnabled) || (SBKanjiEnabled && SBVocabularyEnabled)) {
                if ($(this).attr("class") == "bsbir on") {
                    localStorage.setItem("SBRadicalsEnabled", false);
                    SBRadicalsEnabled = false;
                    $('a[href*="/radicals/"]').css("visibility", "hidden");
                } else if ($(this).attr("class") == "bsbik on") {
                    localStorage.setItem("SBKanjiEnabled", false);
                    SBKanjiEnabled = false;
                    $('a[href*="/kanji/"]').css("visibility", "hidden");
                } else if ($(this).attr("class") == "bsbiv on") {
                    localStorage.setItem("SBVocabularyEnabled", false);
                    SBVocabularyEnabled = false;
                    $('a[href*="/vocabulary/"]').css("visibility", "hidden");
                }
                    } else cancel = true;
        } else {
            if ($(this).attr("class") == "bsbir") {
                localStorage.removeItem("SBRadicalsEnabled");
                SBRadicalsEnabled = true;
                $('a[href*="/radicals/"]').css("visibility", "inherit");
            } else if ($(this).attr("class") == "bsbik") {
                localStorage.removeItem("SBKanjiEnabled");
                SBKanjiEnabled = true;
                $('a[href*="/kanji/"]').css("visibility", "inherit");
            } else if ($(this).attr("class") == "bsbiv") {
                localStorage.removeItem("SBVocabularyEnabled");
                SBVocabularyEnabled = true;
                $('a[href*="/vocabulary/"]').css("visibility", "inherit");
            }
                }
        if (!cancel) $(this).toggleClass("on");
    });
    $('.bsbs div').css({"font-size": "20px", "width": "72px"}).click(function() {
        var cancel = false;
        if ($(this).hasClass("on")) {
            if ((SBApprenticeEnabled && SBGuruEnabled) || (SBApprenticeEnabled && SBMasterEnabled) || (SBApprenticeEnabled && SBEnlightenEnabled) ||
                (SBApprenticeEnabled && SBBurnedEnabled) || (SBApprenticeEnabled && SBLockedEnabled) || (SBGuruEnabled && SBMasterEnabled) ||
                (SBGuruEnabled && SBEnlightenEnabled) || (SBGuruEnabled && SBBurnedEnabled) || (SBGuruEnabled && SBLockedEnabled) ||
                (SBMasterEnabled && SBEnlightenEnabled) || (SBMasterEnabled && SBBurnedEnabled) || (SBMasterEnabled && SBLockedEnabled) ||
                (SBEnlightenEnabled && SBBurnedEnabled) || (SBEnlightenEnabled && SBBurnedEnabled) || (SBBurnedEnabled && SBLockedEnabled)) {
                if ($(this).attr("class") == "bsbsa on") {
                    localStorage.setItem("SBApprenticeEnabled", false);
                    SBApprenticeEnabled = false;
                    $("a.Apprentice").css("visibility", "hidden");
                } else if ($(this).attr("class") == "bsbsg on") {
                    localStorage.setItem("SBGuruEnabled", false);
                    SBGuruEnabled = false;
                    $("a.Guru").css("visibility", "hidden");
                } else if ($(this).attr("class") == "bsbsm on") {
                    localStorage.setItem("SBMasterEnabled", false);
                    SBMasterEnabled = false;
                    $("a.Master").css("visibility", "hidden");
                } else if ($(this).attr("class") == "bsbse on") {
                    localStorage.setItem("SBEnlightenEnabled", false);
                    SBEnlightenEnabled = false;
                    $("a.Enlightened").css("visibility", "hidden");
                } else if ($(this).attr("class") == "bsbsb on") {
                    localStorage.setItem("SBBurnedEnabled", false);
                    SBBurnedEnabled = false;
                    $("a.Burned").css("visibility", "hidden");
                } else if ($(this).attr("class") == "bsbsl on") {
                    localStorage.setItem("SBLockedEnabled", false);
                    SBLockedEnabled = false;
                    $("a.Locked").css("visibility", "hidden");
                }
                    } else cancel = true;
        } else {
            if ($(this).attr("class") == "bsbsa") {
                localStorage.removeItem("SBApprenticeEnabled");
                SBApprenticeEnabled = true;
                $("a.Apprentice").css("visibility", "inherit");
            } else if ($(this).attr("class") == "bsbsg") {
                localStorage.removeItem("SBGuruEnabled");
                SBGuruEnabled = true;
                $("a.Guru").css("visibility", "inherit");
            } else if ($(this).attr("class") == "bsbsm") {
                localStorage.removeItem("SBMasterEnabled");
                SBMasterEnabled = true;
                $("a.Master").css("visibility", "inherit");
            } else if ($(this).attr("class") == "bsbse") {
                localStorage.removeItem("SBEnlightenEnabled");
                SBEnlightenEnabled = true;
                $("a.Enlightened").css("visibility", "inherit");
            } else if ($(this).attr("class") == "bsbsb") {
                localStorage.removeItem("SBBurnedEnabled");
                SBBurnedEnabled = true;
                $("a.Burned").css("visibility", "inherit");
            } else if ($(this).attr("class") == "bsbsl") {
                localStorage.removeItem("SBLockedEnabled");
                SBLockedEnabled = true;
                $("a.Locked").css("visibility", "inherit");
            }
                }
        if (!cancel) $(this).toggleClass("on");
    });
    $('.bsbm div div').css({"padding": "1px 4px 1px 4px"});
    $('.bsbm div div span').css({"font-size": "12px", "padding": "0px 0px 0px 0px"});
    $('.bsbm .bsbmh div').click(function() {
        $(".bsbm .bsbmh div").removeClass("on");
        $(this).addClass("on");
        SBHeight = parseInt($(this).children(".bsbm .bsbmh div span").html(), 10);
        SBResize();
        localStorage.setItem("SBHeight", SBHeight);
    });
    $('.bsbm .bsbms div').click(function() {
        $(".bsbm .bsbms div").removeClass("on");
        $(this).addClass("on");
        SBSpeed = parseFloat($(this).children(".bsbm .bsbms div span").html(), 2);
        clearInterval(newSBItemTimer);
        newSBItem();
        newSBItemTimer = setInterval(newSBItem, 1500 / SBSpeed);
        $('a[id*="SBI"]').each(function() {
                $(this).stop().animate({ "left": -$(this).width()*1.5}, {"duration": ($(this).attr("speed") * Math.pow((parseInt($(this).css("font-size"), 10) / 17), -1.1)) * 49000 / SBSpeed, "queue": false, "complete": function() {
            			$(this).remove();
        			}
        		}, "linear" );
        });
        localStorage.setItem("SBSpeed", SBSpeed);
    });
    $('.bsbt div').css({"height": "24px"}).click(function() {
        $(this).toggleClass("on");
        if ($(this).children(".bsbt div span").html() == "日本語") {
            if (!SBLangJP) localStorage.setItem("SBLangJP", true);
            else localStorage.removeItem("SBLangJP");
            switchSBLang();
        } else if ($(this).children(".bsbt div span").html() == "Cache" || $(this).children(".bsbt div span").html() == "キャッシュ") {
            if (!SBUseCache) localStorage.setItem("SBUseCache", true);
            else localStorage.removeItem("SBUseCache");
            SBUseCache = !SBUseCache;
        } else {
            if (SBStart) localStorage.setItem("SBStart", false);
            else localStorage.removeItem("SBStart");
            SBStart = !SBStart;
        }
    });
    $('#sb-col-sel-tgl').css("display", "initial").click(function() {
        if ($('#sb-col-sel-tgl').css("right") == "-10px") {
            SBColIndex = (SBColTemp > -1) ? SBColTemp : 0;
            
            $('#sb-col-sel-tgl').css({"-webkit-transition": "1s ease-in-out",
                                      "-moz-transition": "1s ease-in-out",
                                      "-o-transition": "1s ease-in-out",
                                      "transition": "1s ease-in-out"}
                                    ).css("right", "-95px");
            $('#sb-col-sel').css({"-webkit-transition": "1s ease-in-out",
                                  "-moz-transition": "1s ease-in-out",
                                  "-o-transition": "1s ease-in-out",
                                  "transition": "1s ease-in-out"}
                                ).css("right", "-85px");
        } else {
            $('a[cctemp]').removeAttr("cctemp");
            SBColIndex = -1;
            $("#sb-col-sel-tgl").css("right", "-10px");
            $("#sb-col-sel").css("right", "0px");
        }
    });
    for (var c = 0; c < 16; c++) {
        $("#sb-col-sel").append('<div class="sbcc' + c + '" style="width: 16px; height: 16px; left: ' + (9 + (20 * (c % 4))) + 'px; margin-top: ' + (7 + (20 * Math.floor(c / 4))) +
                                'px; position: absolute">' + ((c < 15) ? "" : '<span style="font-size: 16px; margin-left: 5px" lang="jp">?</span>') + '</div>');
        $(".sbcc" + c).click(function() {
            var index = parseInt($(this).attr("class").replace(/\D/g, ''));
            if (index !== SBColIndex || index == 15) {
                $('a[cctemp]').removeAttr("cctemp");
            	SBColSelect(index);
            }
        });
    }
    $(".sbcc1 span").css("pointer-events", "none");
    /*document.getElementById("scroll-box-bg").onmousedown = function(e) {
        var scrollBoxBg = document.getElementById("scroll-box-bg");
        scrollBoxBg.setAttribute("potX", e.pageX - $("#scroll-box-bg").offset().left);
        scrollBoxBg.onmousemove = function(e) {
            $("#scroll-box-bg").attr("potX", (e.pageX - $("#scroll-box-bg").offset().left));
        };
        scrollBoxBg.onmouseup = function() {
            $('a[id^="SB"]').each(function() {
                //$(this).css("left", ($(this).css("left") + $("#scroll-box-bg").attr("potX")) + "px");
                $(this).animate({"left": ($(this).left + $("#scroll-box-bg").attr("potX"))}, {"queue": false, "duration": 1667}, "linear");
            });
            document.getElementById("scroll-box-bg").setAttribute("potX", document.getElementById("scroll-box-bg").getAttribute("potX") - ((document.getElementById("scroll-box-bg").getAttribute("potX") > 0) ? 1 : -1));
        };
        //alert($("#scroll-box-bg").attr("potX"));
        //$("#scroll-box-bg").removeAttr("potX");
        scrollBoxBg.mousemove = null;
        scrollBoxBg.mouseup = null;
    };*/
    //for (var l = 0; l < Object.keys(SBIndex.vocabulary.locked).length; l++) alert(SBIndex.vocabulary.locked[l]);
    newSBItemTimer = setInterval(newSBItem, 1500);
}

function SBSelect(target, type) {
    $(".SBSelect").remove();
    if (target !== null) {
        var index = parseInt(target.attr("class").replace(/\D/g, ''));
        $('<div class="SBSelect">' + ((SBColIndex < 15 || target.hasClass("Locked")) ? "" : '<span lang="jp" style="color: black; font-size: ' + target.css("font-size") + '">?</span>') + '</div>').insertBefore($(target));
        $(".SBSelect").attr("style", $(target).attr("style")).css({"z-index": 100, "min-width": ($(target).width() - 4), "height": ($(target).height() - 4), "background": ((type === 0) ? "#0af" : ((type == 1) ? "#f0a" : "#a0f")),
                                                                   "border": "2px inset " + ((type === 0) ? "#0093dd" : ((type == 1) ? "#dd0093" : "#9300dd"))});
        if (SBColIndex > -1) {
            if (SBColIndex === 0) $(".SBSelect").css({"background": $(".sbcc0").css("background"), "border": $(".sbcc0").css("background"), "background-image": $(".sbcc0").css("background")});
            else if (SBColIndex > 0) $(".SBSelect").css({"background": $(".sbcc" + SBColIndex).css("background"), "border": $(".sbcc" + SBColIndex).css("background"), "background-image": $(".sbcc" + SBColIndex).css("background-image")});
        }
    }
}

function SBColSelect(index) {
    $('div[class^="sbcc"]').each(function() {
        if ($(this).css("border-width") == "2px") {
            $(this).css({"border-width": "0px", "margin-top": (parseInt($(this).css("margin-top"), 10) + 2) + "px", "margin-left": (parseInt($(this).css("margin-left"), 10) + 2) + "px"});
        }
    });
    if (index > -1) {
        $('.sbcc' + index + ':not(a)').css({"border": "2px ridge white", "margin-top": (parseInt($('.sbcc' + index).css("margin-top"), 10) - 2) + "px", "margin-left": (parseInt($('.sbcc' + index).css("margin-left"), 10) - 2) + "px"});
        SBColIndex = index;
        SBColTemp = SBColIndex;
    }
}

function rand(low, high) {
    return Math.floor(Math.random()*(high+1)) + low;
}

function filterSBRadicalData(data) {
    var dataArr = {};
    
    for (var d = 1; d < data.length; d++) {
        dataArr[Object.keys(dataArr).length] = {"character": data[d].substring(0, 1), "meaning": data[d].substring(data[d].indexOf('"meaning":"') + 11, data[d].indexOf('","image"')).split(", "),
                                                "image": data[d].substring(data[d].indexOf('"image":"') + 10, data[d].indexOf('","level"')).split(", "),
                                                "srs": ((data[d].indexOf('"srs":') > -1) ? data[d].substring(data[d].indexOf('"srs":"') + 7, data[d].indexOf('","unl')) : null)
                                               };
        if (dataArr[Object.keys(dataArr).length - 1].srs !== null) {
            SBIndex.radicals[dataArr[Object.keys(dataArr).length - 1].srs][SBIndexCount.radicals[dataArr[Object.keys(dataArr).length - 1].srs]] = d - 1;
            SBIndexCount.radicals[dataArr[Object.keys(dataArr).length - 1].srs]++;
        } else {
            SBIndex.radicals.locked[SBIndexCount.radicals.locked] = d - 1;
            SBIndexCount.radicals.locked++;
        }
    }
    
    //alert(SBIndexCount.radicals);
    
    return dataArr;
}

function filterSBKanjiData(data) {
    var dataArr = {};
    
    for (var d = 1; d < data.length; d++) {
        dataArr[Object.keys(dataArr).length] = {"character": data[d].substring(0, 1), "meaning": data[d].substring(data[d].indexOf('"meaning":"') + 11, data[d].indexOf('","onyomi"')).split(", "),
                                                "onyomi": data[d].substring(data[d].indexOf('"onyomi":"') + 10, data[d].indexOf('","kunyomi"')).split(", "), "kunyomi": data[d].substring(data[d].indexOf('"kunyomi":"') + 11,
                                                                                                                                                                                          data[d].indexOf('","important')).split(", "), "important_reading": data[d].substring(data[d].indexOf('"important_reading":"') + 21, data[d].indexOf('","level"')),
                                                "srs": ((data[d].indexOf('"srs":') > -1) ? data[d].substring(data[d].indexOf('"srs":"') + 7, data[d].indexOf('","unl')) : null)
                                               };
        if (dataArr[Object.keys(dataArr).length - 1].srs !== null) {
            SBIndex.kanji[dataArr[Object.keys(dataArr).length - 1].srs][SBIndexCount.kanji[dataArr[Object.keys(dataArr).length - 1].srs]] = d - 1;
            SBIndexCount.kanji[dataArr[Object.keys(dataArr).length - 1].srs]++;
        } else {
            SBIndex.kanji.locked[SBIndexCount.kanji.locked] = d - 1;
            SBIndexCount.kanji.locked++;
        }
    }
    
    return dataArr;
}

function filterSBVocabData(data) {
    var dataArr = {};
    
    for (var p = 0; p < Object.keys(data).length; p++) {
        for (var d = 1; d < Object.keys(data[p]).length; d++) {
            dataArr[Object.keys(dataArr).length] = {"character": data[p][d].substring(0, data[p][d].indexOf('"')), "kana": data[p][d].substring(data[p][d].indexOf('"kana":"') + 8, data[p][d].indexOf('","meaning"')).split(", "),
                                                    "meaning": (data[p][d].substring(data[p][d].indexOf('"meaning":"') + 11, data[p][d].indexOf('","level"'))).split(", "),
                                                    "srs": ((data[p][d].indexOf('"srs":') > -1) ? data[p][d].substring(data[p][d].indexOf('"srs":"') + 7, data[p][d].indexOf('","unl')) : null)
                                                   };
            if (dataArr[Object.keys(dataArr).length - 1].srs !== null) {
                SBIndex.vocabulary[dataArr[Object.keys(dataArr).length - 1].srs][SBIndexCount.vocabulary[dataArr[Object.keys(dataArr).length - 1].srs]] = Object.keys(dataArr).length - 1;
                SBIndexCount.vocabulary[dataArr[Object.keys(dataArr).length - 1].srs]++;
            } else {
                SBIndex.vocabulary.locked[SBIndexCount.vocabulary.locked] = Object.keys(dataArr).length - 1;
                SBIndexCount.vocabulary.locked++;
            }
        }
    }
    
    return dataArr;
}

cancelExecution = false;

if (localStorage.getItem("apiKey") !== null && localStorage.getItem("apiKey").length == 32) apiKey = localStorage.getItem("apiKey");
else if (apiKey.length == 32) localStorage.setItem("apiKey", apiKey);
    else {
        cancelExecution = true;
        alert("Please enter your API key near the top of the WanaKani Scroll Box userscript.");
    }

newSBItemTimer = 0;

if (!cancelExecution) {
    
    SBLangJP = (localStorage.getItem("SBLangJP") == null) ? false : true;
    SBUseCache = (localStorage.getItem("SBUseCache") == null) ? false : true;
    SBStart = (localStorage.getItem("SBStart") == null) ? true : false;
    if (localStorage.getItem("SBHeight") == null) localStorage.setItem("SBHeight", 2);
    SBHeight = localStorage.getItem("SBHeight");
    if (localStorage.getItem("SBSpeed") == null) localStorage.setItem("SBSpeed", 2);
    SBSpeed = localStorage.getItem("SBSpeed");
    SBICount = 0;
    SBColIndex = -1;
    SBColTemp = -1;
    SBPause = false;
    SBRadicalsEnabled = (localStorage.getItem("SBRadicalsEnabled") !== null) ? false : true;
    SBKanjiEnabled = (localStorage.getItem("SBKanjiEnabled") !== null) ? false : true;
    SBVocabularyEnabled = (localStorage.getItem("SBVocabularyEnabled") !== null) ? false : true;
    SBApprenticeEnabled = (localStorage.getItem("SBApprenticeEnabled") !== null) ? false : true;
    SBGuruEnabled = (localStorage.getItem("SBGuruEnabled") !== null) ? false : true;
    SBMasterEnabled = (localStorage.getItem("SBMasterEnabled") !== null) ? false : true;
    SBEnlightenEnabled = (localStorage.getItem("SBEnlightenEnabled") !== null) ? false : true;
    SBBurnedEnabled = (localStorage.getItem("SBBurnedEnabled") !== null) ? false : true;
    SBLockedEnabled = (localStorage.getItem("SBLockedEnabled") !== null) ? false : true;
    SBRadicalData = {};
    SBKanjiData = {};
    SBVocabData = {};
    SBLevels = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50";
    SBIndex = (localStorage.getItem("SBIndex") !== null) ? JSON.parse(localStorage.getItem("SBIndex")) : {
        "radicals": {
            "apprentice": [], "guru": [], "master": [], "enlighten": [], "burned": [], "locked": []
        }, "kanji": {
            "apprentice": [], "guru": [], "master": [], "enlighten": [], "burned": [], "locked": []
        }, "vocabulary": {
            "apprentice": [], "guru": [], "master": [], "enlighten": [], "burned": [], "locked": []
        }
    };
    SBIndexCount =  (localStorage.getItem("SBIndexCount") !== null) ? JSON.parse(localStorage.getItem("SBIndexCount")) : {
        "radicals": {
            "apprentice": 0, "guru": 0, "master": 0, "enlighten": 0, "burned": 0, "locked": 0
        }, "kanji": {
            "apprentice": 0, "guru": 0, "master": 0, "enlighten": 0, "burned": 0, "locked": 0
        }, "vocabulary": {
            "apprentice": 0, "guru": 0, "master": 0, "enlighten": 0, "burned": 0, "locked": 0
        }
    };
    SBIndexBG = (localStorage.getItem("SBIndexBG") !== null) ? JSON.parse(localStorage.getItem("SBIndexBG")) : { "radicals": [], "kanji": [], "vocabulary": [] };
    if (SBPageTop) $(getSBSection()).insertBefore($(".review-status ul"));
    else $(getSBSection()).insertAfter($(".span12 .row:first"));
    if (!SBLangJP) $("#loadingSB").html('<a lang="ja" href="javascript:void(0)" style="font-size: 52px; color: #434343; text-decoration: none">Start</a>');
    else $("#loadingSB").html('<a lang="ja" href="javascript:void(0)" style="font-size: 52px; color: #434343; text-decoration: none">開始</a>');
    $("#loadingSB a").click( function() {
        
        if (!SBUseCache) clearSBItemData(); 
        getSBWKData();
        
    });
    
    if (!SBStart) $("#loadingSB a").click();
    
}
// @downloadURL https://update.greasyfork.org/scripts/7140/Wanikani%20Scrollbox.user.js
// @updateURL https://update.greasyfork.org/scripts/7140/Wanikani%20Scrollbox.meta.js
// ==/UserScript==