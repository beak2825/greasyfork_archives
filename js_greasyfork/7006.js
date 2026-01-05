// ==UserScript==
// @name        Wanikani Burn Reviews
// @namespace   wkburnreview
// @description This script was deleted from Greasy Fork, and due to its negative effects, it has been automatically removed from your browser.
// @exclude	*.wanikani.com
// @include     *.wanikani.com/dashboard*
// @version     0.9.5.1
// @author     Samuel H
// require     https://raw.githubusercontent.com/WaniKani/WanaKana/master/lib/wanakana.min.js //IMPORTANT: ADD @ BEFORE require
// @grant       none

/* This script is licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) license
*  Details: http://creativecommons.org/licenses/by-nc/4.0/ */

//IMPORTANT: YOU MUST PASTE YOUR API KEY BELOW INSIDE THE QUOTES FOR THIS SCRIPT TO WORK PROPERLY
apiKey = "ENTER API KEY HERE";
//CHANGE THIS TO true IF YOU WANT TO LOAD PREVIOUS DATA AND SKIP LOADING: IF YOU DO THIS YOU MUST RUN THE SCRIPT WITH useCache = false FOR IT TO UPDATE YOUR BURNED ITEMS
useCache = false; //true;

function getSection() {
    var strSection = '<div class="span4">\
		<section class="burn-reviews kotoba-table-list dashboard-sub-section" style="z-index: 2; position: absolute; width: 370px">\
			<h3 class="small-caps">Burn Reviews</h3>\
			<div id="loading" align="center" style="position: absolute; background-color: #d4d4d4; margin-top: -1px; padding-top: 42px; width: 370px; height: 99px"></div>\
			<div class="see-more" style="margin-top: 140px">\
			<a href="javascript:void" id="new-item" class="small-caps">New Item</a>\
    		</div>\
    	</section>\
	</div><!-- span4 -->';
    return strSection;
}

function getFadeCSS() {
    var strFadeIn = '<style type="text/css">\
	.fadeIn {\
        -webkit-animation: fadein 1s;\
           -moz-animation: fadein 1s;\
            -ms-animation: fadein 1s;\
             -o-animation: fadein 1s;\
                animation: fadein 1s;\
    }\
    @keyframes fadein {\
        from { opacity: 0; }\
        to   { opacity: 0.75; }\
    }\
    @-moz-keyframes fadein {\
        from { opacity: 0; }\
        to   { opacity: 0.75; }\
    }\
    @-webkit-keyframes fadein {\
        from { opacity: 0; }\
        to   { opacity: 0.75; }\
    }\
    @-ms-keyframes fadein {\
        from { opacity: 0; }\
        to   { opacity: 0.75; }\
    }\
    @-o-keyframes fadein {\
        from { opacity: 0; }\
        to   { opacity: 0.75; }\
    }\
	.fadeOut {\
        -webkit-animation: fadeout 1s;\
           -moz-animation: fadeout 1s;\
            -ms-animation: fadeout 1s;\
             -o-animation: fadeout 1s;\
                animation: fadeout 1s;\
    }\
    @keyframes fadeout {\
        from { opacity: 0.75; }\
        to   { opacity: 0; }\
    }\
    @-moz-keyframes fadeout {\
        from { opacity: 0.75; }\
        to   { opacity: 0; }\
    }\
    @-webkit-keyframes fadeout {\
        from { opacity: 0.75; }\
        to   { opacity: 0; }\
    }\
    @-ms-keyframes fadeout {\
        from { opacity: 0.75; }\
        to   { opacity: 0; }\
    }\
    @-o-keyframes fadeout {\
        from { opacity: 0.75; }\
        to   { opacity: 0; }\
    }\
    </style>';
    return strFadeIn;
}

function getButtonCSS() {
    var strButtons = '<style type="text/css">\
    				.brb div {\
    				background-color: rgb(67, 67, 67);\
					background-image: linear-gradient(to bottom, rgb(85, 85, 85), rgb(67, 67, 67));\
    				color: rgb(98, 98, 98);\
					}\
                    .brbr.on {\
                    	background-color: #00a0f1; background-image: linear-gradient(to bottom, #0af, #0093dd);\
					}\
    				.brbk.on {\
                    	background-color: #f100a0; background-image: linear-gradient(to bottom, #f0a, #dd0093);\
					}\
					.brbv.on {\
                    	background-color: #a000f1; background-image: linear-gradient(to bottom, #a0f, #9300dd);\
					}\
	</style>';
    return strButtons;
}

function rand(low, high) {
    return Math.floor(Math.random()*(high+1)) + low;
}

function filterRadicalData(data) {
    var dataArr = {};
    
    for (var d = 1; d < data.length; d++) {
        if (data[d].indexOf('"burned":true') > -1) {
            dataArr[Object.keys(dataArr).length] = {"character": data[d].substring(0, 1), "meaning": data[d].substring(data[d].indexOf('"meaning":"') + 11, data[d].indexOf('","image"')).split(", "),
            	"image": data[d].substring(data[d].indexOf('"image":"') + 10, data[d].indexOf('","level"')).split(", ")};
        }
    }
        
    return dataArr;
}

function filterKanjiData(data) {
    var dataArr = {};
    
    for (var d = 1; d < data.length; d++) {
        if (data[d].indexOf('"burned":true') > -1) {
            dataArr[Object.keys(dataArr).length] = {"character": data[d].substring(0, 1), "meaning": data[d].substring(data[d].indexOf('"meaning":"') + 11, data[d].indexOf('","onyomi"')).split(", "),
            	"onyomi": data[d].substring(data[d].indexOf('"onyomi":"') + 10, data[d].indexOf('","kunyomi"')).split(", "), "kunyomi": data[d].substring(data[d].indexOf('"kunyomi":"') + 11,
                data[d].indexOf('","important')).split(", "), "important_reading": data[d].substring(data[d].indexOf('"important_reading":"') + 21, data[d].indexOf('","level"'))};
        }
    }
        
    return dataArr;
}

function filterVocabData(data) {
    var dataArr = {};
    
    for (var l = 0; l < Object.keys(data).length; l++) {
        for (var d = 1; d < Object.keys(data[l]).length; d++) {
            if (data[l][d].indexOf('"burned":true') > -1) {
                dataArr[Object.keys(dataArr).length] = {"character": data[l][d].substring(0, data[l][d].indexOf('"')), "kana": data[l][d].substring(data[l][d].indexOf('"kana":"') + 8, data[l][d].indexOf('","meaning"')).split(", "),
                    "meaning": (data[l][d].substring(data[l][d].indexOf('"meaning":"') + 11, data[l][d].indexOf('","level"'))).split(", ")};
            }
        }
    }
    
    return dataArr;
}

function getBurnReview(firstReview) {
    
    curBRAnswered = false;
    
    $("#user-response").attr("disabled", false).focus();
    
    if (!firstReview) {
        
        $(".answer-exception-form").css("display", "none");
        
        if ((curBRItemType == 0 && curBRProgress > 0) || curBRProgress == 2) {
            newBRItem();
            updateBRItem(true);
        }
        
        if (curBRItemType > 0 && (curBRProgress < 1 || $("#answer-form fieldset").hasClass("correct"))) {
            if (curBRType == 0) {
                curBRType = 1;
                wanakana.bind(document.getElementById('user-response'));
                $("#user-response").attr({lang:"ja",placeholder:"答え"});
                $("#question-type").removeClass("meaning").addClass("reading");
            } else {
                curBRType = 0;
                wanakana.unbind(document.getElementById('user-response'));
                $("#user-response").removeAttr("lang").attr("placeholder","Your Response");
                $("#question-type").removeClass("reading").addClass("meaning");
            }
        }  else if (curBRItemType == 0) {
            wanakana.unbind(document.getElementById('user-response'));
            $("#user-response").removeAttr("lang").attr("placeholder","Your Response");
            $("#question-type").removeClass("reading").addClass("meaning");
        }
         document.getElementById("question-type-text").innerHTML = (curBRType == 0) ? "Meaning" : ((curBRItemType == 1) ? ((kanjiData[curBRItem]["important_reading"] == "onyomi") ? "Onyomi Reading" : "Kunyomi Reading") : "Reading");
            
        
        document.getElementById('user-response').value = "";
        $("#answer-form fieldset").removeClass("correct").removeClass("incorrect");
        
    } else {
        
        document.getElementById("new-item").onclick = skipItem;
        
        $("body").prepend('<div id="dim-overlay" style="position: fixed; background-color: black; opacity: 0.75; width: ' + $("html").css("width") + '; height: ' + $("html").css("height") + '; z-index: 1; margin-top: -122px; padding-bottom: 122px; display: none"></div>');
        
        newBRItem();
        
        var characterText = (curBRItemType == 0) ? radicalData[curBRItem]["character"] : ((curBRItemType == 1) ? kanjiData[curBRItem]["character"] : vocabData[curBRItem]["character"]);
        var reviewTypeText = ((curBRType < 1) ? "Meaning" : (curBRItemType == 0) ? radicalData[curBRItem]["character"] :
                             ((curBRItemType == 1) ?kanjiData[curBRItem]["important_reading"].substring(0, 1).toUpperCase() + kanjiData[curBRItem]["important_reading"].substring(1) + " Reading" : "Reading"));
        
        strReview = '<div class="answer-exception-form" id="answer-exception" align="center" style="position: absolute; width: 310px; margin-top: 78px; margin-left: 30px; top: initial; bottom: initial; left: initial; display: none"><span>Answer goes here</span></div>\
						<div id="question" style="position: absolute; background-color: #d4d4d4; margin-top: -1px; width: 370px; height: 142px">\
                            <div class="brb" style="width: 30px; height: 35px; position: absolute; margin-top: 1px; z-index: 11;">\
                                <div class="brbr' + ((radicalsEnabled) ? ' on' : '') + '"><span lang="ja">部首</span></div>\
                                <div class="brbk' + ((kanjiEnabled) ? ' on' : '') + '"><span lang="ja">漢字</span></div>\
                                <div class="brbv' + ((vocabularyEnabled) ? ' on' : '') + '"><span lang="ja">単語</span></div>\
                            </div>\
                            <div class="brk"><span class="bri" lang="ja">' + characterText + '</span></div>\
                            <div id="question-type" style="margin: 0px 30px 0px 30px; height: 33px"><h1 id="question-type-text" align="center" style="margin: -6px 30px 0px 30px">' + reviewTypeText + '</h1></div>\
                            <div id="answer-form"><form onSubmit="return false"><fieldset style="padding: 0px 0px 0px 0px; margin: 0px 30px 0px 30px">\
                                <input autocapitalize="off" autocomplete="off" autocorrect="off" id="user-response" name="user-response" placeholder="Your Response" type="text" style="height: 35px; margin-bottom: 0px"></input>\
                                <button style="width: 0px; height: 34px; padding: 0px 20px 0px 5px; top: 0px; right: 0px"><i class="icon-chevron-right" onclick="checkBurnReviewAnswer()"></i></button>\
                            </fieldset></form></div>\
                    	</div>\
                    </div>';
        
    	return strReview;
    }
}

function newBRItem() {

    if (radicalsEnabled) {
        if (kanjiEnabled) {
            if (vocabularyEnabled) {
                curBRItem = rand(1, Object.keys(radicalData).length + Object.keys(kanjiData).length + Object.keys(vocabData).length - 1);
                curBRItemType = (curBRItem < Object.keys(radicalData).length) ? 0 : ((curBRItem < Object.keys(radicalData).length + Object.keys(kanjiData).length) ? 1 : 2);
            } else {
                curBRItem = rand(1, Object.keys(radicalData).length + Object.keys(kanjiData).length - 1);
                curBRItemType = (curBRItem < Object.keys(radicalData).length) ? 0 : 1;
            }
        } else {
            if (vocabularyEnabled) {
                curBRItem = rand(1, Object.keys(radicalData).length + Object.keys(vocabData).length - 1);
                curBRItemType = (curBRItem < Object.keys(radicalData).length) ? 0 : 2;
            } else {
            	curBRItem = rand(1, Object.keys(radicalData).length - 1);
                curBRItemType = 0;
            }
        }
    } else if (kanjiEnabled) {
        if (vocabularyEnabled) {
            curBRItem = rand(1, Object.keys(kanjiData).length + Object.keys(vocabData).length - 1);
            curBRItemType = (curBRItem < Object.keys(radicalData).length) ? 0 : 1;
        } else {
            curBRItem = rand(1, Object.keys(kanjiData).length - 1);
            curBRItemType = 1;
        }
    } else {
        curBRItem = rand(1, Object.keys(vocabData).length - 1);
        curBRItemType = 2;
    }
    if (curBRItemType == 0) curBRType = 0;
    else { 
       	curBRType = rand(0, 1);
        
        if (curBRItemType == 1) {
            if (radicalsEnabled) curBRItem -= Object.keys(radicalData).length;
        } else if (curBRItemType == 2) {
            if (radicalsEnabled) {
                if (kanjiEnabled) curBRItem -= (Object.keys(radicalData).length + Object.keys(kanjiData).length);
                else curBRItem -= (Object.keys(radicalData).length);
            } else if (kanjiEnabled) curBRItem -= Object.keys(kanjiData).length;
        }
    }
    curBRProgress = 0;
    
}

function updateBRItem(updateText) {
    
    if (updateText) $(".bri").html(((curBRItemType == 0) ? radicalData[curBRItem]["character"] : (curBRItemType == 1) ? kanjiData[curBRItem]["character"] : vocabData[curBRItem]["character"]));
    
    var bg = (curBRItemType == 0) ? "#00a0f1" : ((curBRItemType == 1) ? "#f100a0" : "#a000f1");
    var bgi = "linear-gradient(to bottom, ";
    
    bgi += (curBRItemType == 0) ? "#0af, #0093dd" : ((curBRItemType == 1) ? "#f0a, #dd0093" : "#a0f, #9300dd");
    $(".brk").css({"background-color": bg,
                   "background-image": bgi,
                   "background-repeat": "repeat-x",
                   "width": "310px",
                   "height": "39px",
                   "padding-top": "28px",
                   "padding-bottom": "3px",
                   "margin-top": "1px",
                   "margin-left": "30px",
                   "text-align": "center"});
    
}

function skipItem() {
   	curBRProgress = 2;
    getBurnReview(false);
    return false;
}

function getRadicalData() {
    
    $("#loading").html('<h3 style="color: #00a0f1">Retrieving radical data...</h3>');
    
    var req = new XMLHttpRequest();
    
    req.open('GET', 'https://www.wanikani.com/api/user/' + apiKey + '/radicals', true);
    req.onreadystatechange = function() {
        if (req.readyState === 4) {
            if (req.status >= 200 && req.status < 400) {
                radicalData = filterRadicalData(req.responseText.split('"character":"'));
                localStorage.setItem("burnedRadicals", JSON.stringify(radicalData));
				getKanjiData();
            } else {
                alert("error");
            }
        }
    };
    req.send();
    
}

function getKanjiData() {
    
    $("#loading").html('<h3 style="color: #f100a0">Retrieving kanji data...</h3>');
    
    var req = new XMLHttpRequest();
    
    req.open('GET', 'https://www.wanikani.com/api/user/' + apiKey + '/kanji', true);
    req.onreadystatechange = function() {
        if (req.readyState === 4) {
            if (req.status >= 200 && req.status < 400) {
                kanjiData = filterKanjiData(req.responseText.split('"character":"'));
                localStorage.setItem("burnedKanji", JSON.stringify(kanjiData));
                getVocabData(1);
            } else {
                alert("error");
            }
        }
    };
    req.send();

}

function getVocabData(lv) {
    
    $("#loading").html('<h3 style="color: #a000f1">Retrieving vocabulary data...</h3>');
        
    var req = new XMLHttpRequest();
    req.open('GET', 'https://www.wanikani.com/api/user/' + apiKey + '/vocabulary/' + lv, true);
    req.onreadystatechange = function() {
        if (req.readyState === 4) {
            if (req.status >= 200 && req.status < 400) {
                vocabData[lv - 1] = req.responseText.split('"character":"');
                if (lv == parseInt($(".dropdown-toggle span").html())) {
                    vocabData = filterVocabData(vocabData);
                    localStorage.setItem("burnedVocab", JSON.stringify(vocabData));
                    initBurnReviews();
                } else {
                    getVocabData(lv + 1);
                }
            } else {
                alert("error");
            }
        }
    };
    req.send();

}

function getWKData() {
    
    /*localStorage.removeItem("radicalsEnabled");
    localStorage.removeItem("kanjiEnabled");
    localStorage.removeItem("vocabularyEnabled");*/
    
    if (localStorage.getItem("radicalsEnabled") !== null) radicalsEnabled = false;
    if (localStorage.getItem("kanjiEnabled") !== null) kanjiEnabled = false;
    if (localStorage.getItem("vocabularyEnabled") !== null) vocabularyEnabled = false;
    
    if (localStorage.getItem("burnedRadicals") == null) getRadicalData();
    else if (localStorage.getItem("burnedKanji") == null) getKanjiData();
    else if (localStorage.getItem("burnedVocab") == null) getVocabData(1);
    else {
		radicalData = JSON.parse(localStorage.getItem("burnedRadicals"));
        kanjiData = JSON.parse(localStorage.getItem("burnedKanji"));
        vocabData = JSON.parse(localStorage.getItem("burnedVocab"));
        initBurnReviews();
    }
}

function clearBurnedItemData() {
    localStorage.removeItem("burnedRadicals");
    localStorage.removeItem("burnedKanji");
    localStorage.removeItem("burnedVocab");
}

function confirmRes() {
    $(".answer-exception-form").css({"display": "block", "opacity": "0", "-webkit-transform": "translateY(20px)"}).removeClass("animated fadeInUp");
    $(".answer-exception-form span").html("");
    $(".answer-exception-form").addClass("animated fadeInUp")
    $(".answer-exception-form span").html('Are you sure you want to <a href="https://www.wanikani.com/retired/' +
            ((curBRItemType == 0) ? 'radicals/' + radicalData[curBRItem]["character"] : ((curBRItemType == 1) ? 'kanji/' + kanjiData[curBRItem]["character"] :
            'vocabulary/' +  vocabData[curBRItem]["character"])) + '?resurrect=true" class="btn btn-mini resurrect-btn" data-method="put" rel="nofollow">Resurrect</a> the ' + 
    		((curBRItemType == 1) ? 'kanji item "' + kanjiData[curBRItem]["character"] : 'vocabulary item "' + vocabData[curBRItem]["character"]) + '"?');
    document.getElementById("answer-exception").onclick = "return false";
    return false;
}

function initBurnReviews() {
	
    $("#loading").remove();
    $("head").append('<link rel="stylesheet" type="text/css" href="https://s3.amazonaws.com/s3.wanikani.com/assets/v03/review/application-a81ab5242aa869ac1165a37e1c04de33.css" />');
    $(getFadeCSS()).appendTo($("head"));
    $(getButtonCSS()).appendTo($("head"));
    $("ul").css("padding-left", "0px");
    $(getBurnReview(true)).insertAfter($(".burn-reviews.kotoba-table-list.dashboard-sub-section h3"));
    updateBRItem(false);
    if (curBRType == 0) {
        wanakana.unbind(document.getElementById('user-response'));
        $("#user-response").removeAttr("lang").attr("placeholder","Your Response");
        $("#question-type").addClass("meaning");
    } else {
        wanakana.bind(document.getElementById('user-response'));
        $("#user-response").attr({lang:"ja",placeholder:"答え"});
        $("#question-type").addClass("reading");
    }
    $(".brb div").css({"background-repeat": "repeat-x", "color": "#fff", "padding": "3px 5px 0px 5px", "width": "20px", "height": "32px", "vertical-align": "middle", 
                       "font-size": "14px"}).mouseover(function() {
        $(this).css("text-shadow", "0 0 0.2em #fff");
    }).mouseout(function() {
        $(this).css("text-shadow", "");
    }).click(function() {
        var cancel = false;
        if ($(this).hasClass("on")) {
            if ((radicalsEnabled && kanjiEnabled) || (radicalsEnabled && vocabularyEnabled) || (kanjiEnabled && vocabularyEnabled)) {
                if ($(this).attr("class") == "brbr on") {
                    localStorage.setItem("radicalsEnabled", false);
                    radicalsEnabled = false;
                    if (curBRItemType == 0) skipItem();
                } else if ($(this).attr("class") == "brbk on") {
                    localStorage.setItem("kanjiEnabled", false);
                    kanjiEnabled = false;
                    if (curBRItemType == 1) skipItem();
                } else if ($(this).attr("class") == "brbv on") {
                    localStorage.setItem("vocabularyEnabled", false);
                    vocabularyEnabled = false;
                    if (curBRItemType == 2) skipItem();
                }
            } else cancel = true;
        } else {
            if ($(this).attr("class") == "brbr") {
                localStorage.removeItem("radicalsEnabled");
                radicalsEnabled = true;
            } else if ($(this).attr("class") == "brbk") {
                localStorage.removeItem("kanjiEnabled");
                kanjiEnabled = true;
            } else if ($(this).attr("class") == "brbv") {
                localStorage.removeItem("vocabularyEnabled");
                vocabularyEnabled = true;
            }
        }
        if (!cancel) $(this).toggleClass("on");
    });
    $(".brb div span").css({"-ms-writing-mode": "tb-rl", "-webkit-writing-mode": "vertical-rl", "-moz-writing-mode": "vertical-rl", "-ms-writing-mode": "vertical-rl", "writing-mode": "vertical-rl",
                           "-webkit-touch-callout": "none", "-webkit-user-select": "none", "-khtml-user-select": "none", "-moz-user-select": "none", "-ms-user-select": "none", "user-select": "none", "cursor":"default"});
    $(".bri").css({"color": "#ffffff",
                   "font-size": "48px",
                   "text-shadow": "0 1px 0 rgba(0,0,0,0.2)"});
    $(".brk").click(function () {
        if ($("#dim-overlay").css("display") == "none") {
            $(".burn-reviews.kotoba-table-list.dashboard-sub-section").css({"-webkit-transition": "1s ease-in-out",
                                                                             "-moz-transition": "1s ease-in-out",
                                                                             "-o-transition": "1s ease-in-out",
                         													"transition": "1s ease-in-out"}).css("transform", "scaleX(2)scaleY(2)").one('transitionend webkitTransitionEnd', function() {
            	$("#dim-overlay").removeClass("fadeIn");
                if (queueBRAnim) {
                    queueBRAnim = false;
                    allowQueueBRAnim = false;
					$("#dim-overlay").trigger("click");
                } else allowQueueBRAnim = true;
            });
            $("#dim-overlay").css("display", "block").addClass("fadeIn");
    	} else if (!queueBRAnim && allowQueueBRAnim) queueBRAnim = true;
    });
    
    $("#dim-overlay").click(function () {
        if (!$(this).hasClass("fadeIn")) {
            $(this).addClass("fadeOut");
            $(".burn-reviews.kotoba-table-list.dashboard-sub-section").one('transitionend webkitTransitionEnd', function() {
                $("#dim-overlay").removeClass("fadeOut").css("display", "none");
                if (queueBRAnim) {
                    queueBRAnim = false;
                    allowQueueBRAnim = false;
					$(".brk").trigger("click");
                } else allowQueueBRAnim = true;
            });
            $(".burn-reviews.kotoba-table-list.dashboard-sub-section").css("transform", "scaleX(1)scaleY(1)");
        } else if (!queueBRAnim && allowQueueBRAnim) queueBRAnim = true;
    });
        
    $(".answer-exception-form span").css({"background-color": "rgba(162, 162, 162, 0.75)", "box-shadow": "3px 3px 0 rgba(225, 225, 225, 0.75)"});
}

function checkBurnReviewAnswer() {
    var response = $("#user-response").val().toLowerCase();
    var match = false;
    var answers;
    
    $("#user-response").attr("disabled", true);
    
    if (curBRType == 0) answers = (curBRItemType == 0) ? radicalData[curBRItem]["meaning"] : ((curBRItemType == 1) ? kanjiData[curBRItem]["meaning"] : vocabData[curBRItem]["meaning"]);
    else answers = (curBRItemType == 1) ? kanjiData[curBRItem][kanjiData[curBRItem]["important_reading"]] : vocabData[curBRItem]["kana"];
    
    if (answers instanceof Array) {
        for (var a = 0; a < Object.keys(answers).length; a++) {
            if (response == answers[a]) match = true;
        }
    } else if (response == answers) match = true;
        
   	//alert(evaluate(((curBRType == 0) ? "meaning" : "reading"),$("#user-response").val()).join(","));
        
   	if (match) {
        $("#answer-form fieldset").removeClass("incorrect");
    	$("#answer-form fieldset").addClass("correct");
        curBRProgress++;
    } else {
        $("#answer-form fieldset").removeClass("correct");
        $("#answer-form fieldset").addClass("incorrect");
        $(".answer-exception-form span").html('The answer was:<br />"' + ((answers instanceof Array) ? answers.join(", ") : answers) + '"<br /><a href="#"' +
            ' class="btn btn-mini resurrect-btn">Resurrect</a> this item?');
        $(".answer-exception-form").css({"display": "block"}).addClass("animated fadeInUp");
        document.getElementById("answer-exception").getElementsByTagName("span")[0].getElementsByTagName("a")[0].onclick = confirmRes;
    }    
    
    curBRAnswered = true;
}

function evaluate(e,t){
     var n,r,i,s,o,u,a,f,l,c,h;
     i=[];
     u=[];
     s=((curBRItemType == 1) ? kanjiData[curBRItem]["character"] : vocabData[curBRItem]["character"]);
     n=!1;
     l=!1;
     f=!1;
     o=!1;
     t=$.trim(t);
     e==="reading"&&(t=t.replace("n","ん"));
     $("#user-response").val(t);
     if(e==="reading"){
         s.kan?(s.emph==="onyomi"?(i=s.on,u=s.kun):(i=s.kun,u=s.on),o=checkIfOtherKanjiReading(t,u,i)):s.voc&&(i=s.kana),i.length>1&&(f=!0);
         for(a in i)
             r=i[a];
         t===r&&(l=!0,n=!0);
     } else {
         i=$.merge(s.en,s.syn);
         i.length>1&&(f=!0);
         t=stringFormat(t);
         for(a in i)
             r=i[a];
         r=stringFormat(r);
         h=levenshteinDistance(r,t);
         c=distanceTolerance(r);
         h<=c&&(l=!0);
         h===0&&(n=!0)
     } return {passed:l,accurate:n,multipleAnswers:f,exception:o};
}

function checkIfOtherKanjiReading(e,t,n){
    var r,i,s;
    s=!1;
    for(i in t)r=t[i];
    e===r.replace(/\..*/,"")&&(s=!0)
    for(i in n)
        r=n[i];
    e===r&&(s=!1);
    return s;
}

function isAsciiPresent(e){
    return e=e[e.length-1]==="n"?e.slice(0,-1):e;
    /[\000-\177]/.test(e);
}

function stringFormat(e){
    return e=e.toLowerCase().replace("-"," ").replace(".","").replace("'","");
    e.substr(-1)==="s"&&(e=e.slice(0,-1)),e;
}

function distanceTolerance(e){
    switch(e.length){
        case 1:case 2:case 3:return 0;
        case 4:case 5:return 1;
        case 6:case 7:return 2;
        default:return 2+Math.floor(e.length/7)*1;
    }
}

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 13) { //Enter
        if (!curBRAnswered) checkBurnReviewAnswer();
        else getBurnReview(false);
	}
 });

curBRItem = -1;
curBRType = -1;
curBRItemType = -1;
curBRProgress = 0;
curBRAnswered = false;
queueBRAnim = false;
allowQueueBRAnim = true;
radicalsEnabled = true;
kanjiEnabled = true;
vocabularyEnabled = true;
radicalData = "";
kanjiData = "";
vocabData = {};

$(".low-percentage.kotoba-table-list.dashboard-sub-section").parent().wrap('<div class="col" style="float: left; width: 370px; margin-right: 30px"></div>');
$(getSection()).insertAfter($(".low-percentage.kotoba-table-list.dashboard-sub-section").parent());

if (!useCache) clearBurnedItemData(); 
getWKData();
// @downloadURL https://update.greasyfork.org/scripts/7006/Wanikani%20Burn%20Reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/7006/Wanikani%20Burn%20Reviews.meta.js
// ==/UserScript==