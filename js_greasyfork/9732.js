// ==UserScript==
// @name         WK Double Check
// @namespace    WKDblChk
// @version      0.2
// @description  Toggle the mark given by WaniKani
// @author       Ethan
// @include      http*://www.wanikani.com/review/session*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/9732/WK%20Double%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/9732/WK%20Double%20Check.meta.js
// ==/UserScript==

//Much of the following code is from the jQuery application extension used on WaniKani.com, which is resleased under the MIT license.
//Modifications have been made to the code where necessary.

var e = {
    processCompleted: function (e,t){
        //to have only the visual activity of the original function
        var s;
        s = $.jStorage.get("currentItem");
        if (t.mc >= 1 && t.rc >= 1 || e.charAt(0) === "r" && s.mc >= 1) {
            //srs level up/down
            $.jStorage.get("r/srsIndicator") && Srs.load($.jStorage.get(e), s.srs);

        }
    },
    processUncompleted: function (){
        //to reverse the changes that 'processCompleted' and 'renderPostAnswer' (and itself) makes
        //Toggle srs animation
        var oldSrs=document.getElementsByClassName("srs-down");
        if(oldSrs.length === 0){oldSrs=document.getElementsByClassName("srs-up")}
        if(typeof oldSrs[0] === "object"){
            var newSrs = oldSrs[0].cloneNode(true);
            newSrs.style.webkitAnimationDirection=newSrs.style.webkitAnimationDirection?"":"reverse"; //chrome
            newSrs.style.animationDirection=newSrs.style.animationDirection?"":"reverse";       //firefox
            oldSrs[0].parentNode.replaceChild(newSrs, oldSrs[0]);
        }
        //Change the meaning/reading correct/incorrect counters
        var currentItem = $.jStorage.get("currentItem");
        var currentId = (currentItem.voc?"v":currentItem.kan?"k":"r")+currentItem.id;
        var stats = $.jStorage.get(currentId);
        var questionType = $.jStorage.get("questionType");
        var counter = questionType[0];
        stats[counter+"c"]?
            delete stats[counter+"c"] && stats[counter+"i"]?stats[counter+"i"]++:stats[counter+"i"]=1:
        (stats[counter+"c"]=1) && stats[counter+"i"]?stats[counter+"i"]--:stats[counter+"i"]=0;

        //Toggle answer field class
        $("#answer-form fieldset").hasClass("incorrect") ? 
            $("#answer-form fieldset").addClass("correct").removeClass("incorrect") && $("#option-double-check").find("i").removeClass("icon-thumbs-up").addClass("icon-thumbs-down"):
        $("#answer-form fieldset").addClass("incorrect").removeClass("correct") && $("#option-double-check").find("i").removeClass("icon-thumbs-down").addClass("icon-thumbs-up");

    },
    commitAnswer: function (e,t){
        console.log(e,t);
        //to do all the 'point of no return commands previously performed by 'processCompleted'
        var n, r, i, s, o, u, a, f, l;
        if (t.mc >= 1 && t.rc >= 1 || e.charAt(0) === "r" && t.mc >= 1) {
            s = $.jStorage.get("currentItem");
            n = $.jStorage.get("activeQueue");
            f = $.jStorage.get("reviewQueue");
            t.mi = t.mi || 0;
            t.ri = t.ri || 0;
            l = "/json/progress?" + e + "[]=" + t.mi + "&" + e + "[]=" + t.ri;
            r = $.jStorage.get("completedCount") + 1
            $.jStorage.set("completedCount", r);

            a = function() {
                switch (e.charAt(0)) {
                    case "r":
                        return "recentCompletedRadicals";
                    case "k":
                        return "recentCompletedKanji";
                    case "v":
                        return "recentCompletedVocabulary"
                }
            }();


            i = $.jStorage.get(a) || [];
            i.push(e.slice(1));
            i = i.slice(Math.max(i.length - 10, 0));
            $.jStorage.set(a, i);
            $.jStorage.setTTL(a, 6e5), lastItems.addToList(e);
            //---where srs indicator used to be
            $.getJSON(l, function() {
                return !1
            }).done(function() {
                return !1
            }).fail(function() {
                var n;
                return n = $.jStorage.get("submitFailedQueue") || [], n.push({
                    id: e,
                    mi: t.mi,
                    ri: t.ri
                }), $.jStorage.set("submitFailedQueue", n)
            }), u = $.grep(n, function(e) {
                return e.id === s.id && (s.rad && e.rad || s.kan && e.kan || s.voc && e.voc) ? !1 : !0
            });
            if (!$.jStorage.get("r/wrap-up") && f.length !== 0) {
                o = 11 - u.length;
                while (o -= 1) u.push(f.pop());
                u.filter(function(e) {
                    return e
                })
            }
            return $.jStorage.set("activeQueue", u), $.jStorage.set("reviewQueue", f), $.jStorage.deleteKey(e)
        }
    },
    getQueueAndAssignQuestion: function() {
        var t, n, r, i, s, o;
        o = "/review/queue?", n = $.jStorage.get("recentCompletedRadicals") || [], t = $.jStorage.get("recentCompletedKanji") || [], r = $.jStorage.get("recentCompletedVocabulary") || [];
        if (n.length > 0)
            for (s in n)
                i = n[s], o += "r[]=" + i + "&";
        if (t.length > 0)
            for (s in t)
                i = t[s], o += "k[]=" + i + "&";
        if (r.length > 0)
            for (s in r)
                i = r[s], o += "v[]=" + i + "&";
        return $.getJSON(o, function(t) {
            var n;
            return n = t.splice(0, 10), $.jStorage.set("reviewQueue", t), $.jStorage.set("activeQueue", n), n.length > 0 ? ($("#reviews").is(":hidden") && $("#reviews").show(), e.nextQuestion()) : window.location = "/review/"
        }).done(function() {
            return e.countersReset()
        })
    },answerException: function(e) {
        var t, n;
        t = $("#additional-content"), n = $.jStorage.get("questionType"), $("#answer-exception").remove();
        if (!e.passed)
            return t.append($('<div id="answer-exception"><span>Need help? View the correct ' + n + " and mnemonic</span></div>").addClass("animated fadeInUp"));
        if (e.accurate && e.multipleAnswers)
            return t.append($('<div id="answer-exception"><span>Did you know this item has multiple possible ' + n + "s?</span></div>").addClass("animated fadeInUp"));
        if (!e.accurate)
            return t.append($('<div id="answer-exception"><span>Your answer was a bit off. Check the ' + n + " to make sure you are correct</span></div>").addClass("animated fadeInUp"))
            },buttons: function() {
                var t;
                return t = $("#user-response"), $("#submit-errors").hover(function() {
                    return $(this).children("#submit-errors-ext-text").css("display", "inline")
                }, function() {
                    return $(this).children("#submit-errors-ext-text").css("display", "none")
                }), $("#option-item-info").click(function() {
                    if (t.is(":disabled"))
                        return $("#answer-exception").remove()
                        }), $("#submit-errors").click(function() {
                    return e.submitFailedQueue({newQuestion: !1})
                })
            },counters: function() {
                return e.countersReset(), $.jStorage.listenKeyChange("questionCount", function(e, t) {
                    var n, r, i;
                    return r = $.jStorage.get("questionCount"), i = $.jStorage.get("wrongCount"), n = r === 0 ? 100 : Math.round((r - i) / r * 100), $("#correct-rate").html(n)
                }), $.jStorage.listenKeyChange("completedCount", function(e, t) {
                    var n, r, i;
                    return n = parseInt($("#completed-count").text()) + parseInt($("#available-count").text()), r = $.jStorage.get("completedCount"), i = Math.round(r / n * 100), i = isNaN(i) ? 0 : i, $("#completed-count").html(r), $("#progress-bar #bar").css("width", i + "%")
                }), $.jStorage.listenKeyChange("activeQueue", function(e, t) {
                    var n;
                    return n = $.jStorage.get("reviewQueue").length + $.jStorage.get("activeQueue").length, $("#available-count").html(n)
                })
            },countersIncr: function(e) {
                var t, n;
                return e || (n = $.jStorage.get("wrongCount") + 1, $.jStorage.set("wrongCount", n)), t = $.jStorage.get("questionCount") + 1, $.jStorage.set("questionCount", t)
            },countersReset: function() {
                return $.jStorage.set("questionCount", 0), $.jStorage.set("completedCount", 0), $.jStorage.set("wrongCount", 0)
            },load: function() {
                return e.submitFailedQueue({newQuestion: !0})
            },nextQuestion: function() {
                var t, n;
                return t = $.jStorage.get("activeQueue") || [], n = $.jStorage.get("r/wrap-up"), t.length > 0 ? e.randomQuestion() : n ? ($.jStorage.deleteKey("r/wrap-up"), window.location = "/review/") : e.submitFailedQueue({newQuestion: !0})
            },randomQuestion: function() {
                var e, t, n, r;
                return n = $.jStorage.get("activeQueue"), e = n[Math.floor(Math.random() * n.length)], t = e.kan ? $.jStorage.get("k" + e.id) : e.voc ? $.jStorage.get("v" + e.id) : void 0, r = e.rad ? "meaning" : t === null || typeof t.mc == "undefined" && typeof t.rc == "undefined" ? ["meaning", "reading"][Math.floor(Math.random() * 2)] : t.mc >= 1 ? "reading" : t.rc >= 1 ? "meaning" : void 0, $.jStorage.set("questionType", r), $.jStorage.set("currentItem", e)
            },renderPostAnswer: function(t) {
                return t.passed ? ($("#answer-form fieldset").addClass("correct"),$("#option-double-check").find("i").removeClass("icon-thumbs-up").addClass("icon-thumbs-down")) : $("#answer-form fieldset").addClass("incorrect"), $("#user-response").prop("disabled", !0), additionalContent.enableButtons(), lastItems.disableSessionStats(), e.countersIncr(t.passed), e.answerException(t), e.updateLocalItemStat(t.passed)
            },listenRenderView: function() {
                return $.jStorage.listenKeyChange("currentItem", function(e, t) {
                    var n, r, i;
                    return n = $.jStorage.get(e), r = $("#user-response"), i = $.jStorage.get("questionType"), $("html, body").animate({scrollTop: 0}, 200), additionalContent.disableItemInfo(), additionalContent.disableAudio(), Srs.remove(), $("#answer-form fieldset").removeClass(), r.prop("disabled", !1).val("").focus(), wanakana.unbind(r[0]), i === "reading" && wanakana.bind(r[0]), r.val(""), n.rad ? (n.custom_font_name ? $("#character span").html('<i class="radical-' + n.custom_font_name + '"></i>') : /.png/i.test(n.rad) ? $("#character span").html('<img src="https://s3.amazonaws.com/s3.wanikani.com/images/radicals/' + n.rad + '">') : $("#character span").html(n.rad), $("#character").removeClass().addClass("radical"), $("#question-type").removeClass().addClass(i), $("#question-type h1").html("Radical <strong>Name</strong>")) : n.kan ? ($("#character span").html(n.kan), $("#character").removeClass().addClass("kanji"), $("#question-type").removeClass().addClass(i), $("#question-type h1").html("Kanji <strong>" + i + "</strong>")) : n.voc && ($("#character span").html(n.voc), $("#character").removeClass().addClass("vocabulary"), $("#question-type").removeClass().addClass(i), $("#question-type h1").html("Vocabulary <strong>" + i + "</strong>")), i === "meaning" ? r.removeAttr("lang").attr("placeholder", "Your Response") : r.attr({lang: "ja",placeholder: "答え"}), loadingScreen.remove()
                })
            },submitFailedQueue: function(t) {
                var n, r, i, s;
                t.newQuestion = t.newQuestion || !1, i = $.jStorage.get("submitFailedQueue") || [];
                if (i.length > 0) {
                    s = "/json/progress?";
                    for (n in i)
                        r = i[n], s += r.id + "[]=" + r.mi + "&" + r.id + "[]=" + r.ri + "&";
                    return $.getJSON(s, function() {
                        return !1
                    }).done(function() {
                        $.jStorage.deleteKey("submitFailedQueue");
                        if (t.newQuestion === !0)
                            return e.getQueueAndAssignQuestion()
                            }).fail(function() {
                        return $("#timeout").show(), $("#timeout-session-end").show(), idleTime.view(), $("#timeout-idle").hide()
                    })
                }
                return e.getQueueAndAssignQuestion()
            },updateLocalItemStat: function(t) {
                var n, r, i, s, o;
                return n = $.jStorage.get("currentItem"), s = $.jStorage.get("questionType"), r = n.rad ? "r" : n.kan ? "k" : "v", r += n.id, i = $.jStorage.get(r) || {}, s === "meaning" ? t ? i.mc = 1 : i.mi = typeof i.mi == "undefined" ? 1 : i.mi + 1 : t ? i.rc = 1 : i.ri = typeof i.ri == "undefined" ? 1 : i.ri + 1, o = $.jStorage.set(r, i), $.jStorage.setTTL(r, 72e5), e.processCompleted(r, o);
            },listenSubmitFailedQueue: function() {
                return $.jStorage.listenKeyChange("submitFailedQueue", function(e, t) {
                    var n;
                    switch (t) {
                        case "deleted":
                            return !1;
                        case "updated":
                            return n = $.jStorage.get(e), $("#timeout").show(), $("#timeout-session-end").show(), idleTime.view(), $("#timeout-idle").hide()
                    }
                })
            },listenWrapUp: function() {
                return $.jStorage.deleteKey("r/wrap-up"), $.jStorage.listenKeyChange("activeQueue", function(e, t) {
                    var n;
                    if ($.jStorage.get("r/wrap-up"))
                        switch (t) {
                            case "updated":
                                return n = ($.jStorage.get("activeQueue") || []).length, $("#wrap-up-countdown").text(n)
                        }
                })
            }
};



function DoubleCheck(e){


    console.log("DoubleCheck loaded. e = ", e);
    $("#additional-content ul").append('<li id="option-double-check" class="disabled"><span title="Change Result"><i class="icon-thumbs-up"></i></span></li>');

    $("#additional-content ul li").css("width", "16.2%"); //make space in the buttons row
    var customStyle = document.createElement("style");
    customStyle.innerHTML = "#answer-exception span:before {left: 40.5%}"; //get the arrow to point to the eye again
    document.head.appendChild(customStyle);

    $("#option-double-check").click(function(){
        if (this.className !== "disabled"){


            e.processUncompleted();

            var t = $.jStorage.get("currentItem");
            var r = t.rad ? "r" : t.kan ? "k" : "v";
            r += t.id;
            var o = $.jStorage.get(r);
                console.log(r,o);
            e.processCompleted(r, o);
        }
    });

    $("#answer-form button")[0].id = "answer-submit", //give the existing button a hook
        $("#answer-submit").unbind();

    //Reassign click event for submission
    $("#answer-submit").click(function() {
        var t, n, r, i, s;
        r = $("#answer-form button");
        i = $("#answer-form form");
        s = $("#user-response");
        t = function() { //method to mark answer
            $("#option-double-check").removeClass("disabled");

            var t, n, r, o;
            return r = answerChecker.evaluate($.jStorage.get("questionType"), s.val()), $("html, body").animate({scrollTop: 0}, 200), r.exception ? (t = $.jStorage.get("currentItem"), i = $("#answer-form form"), o = $("#reviews"), i.is(":animated") || (o.css("overflow-x", "hidden"), n = t.emph === "onyomi" ? "on'yomi" : "kun'yomi", i.effect("shake", {}, 100, function() {
                return o.css("overflow-x", "visible"), i.append($('<div id="answer-exception" class="answer-exception-form"><span>WaniKani is looking for the ' + n + " reading</span></div>").addClass("animated fadeInUp"))
            }).find("input").focus()), !1) : (s.blur(), e.renderPostAnswer(r), !1)
        };
        n = function() { //method for after marking complete
            $("#option-double-check").addClass("disabled").find("i").removeClass("icon-thumbs-down").addClass("icon-thumbs-up");//reset the button


            var n = $.jStorage.get("currentItem");
            var r = n.rad ? "r" : n.kan ? "k" : "v";
            r += n.id;
            var i = $.jStorage.get(r) || {};
            e.commitAnswer(r, i)

            return $("#answer-exception").remove(), e.nextQuestion(), additionalContent.closeItemInfo(), !1
        };


        if (s.is(":disabled"))
            return n();
        if ($.jStorage.get("questionType") === "reading" && answerChecker.isAsciiPresent(s.val()) || $.jStorage.get("questionType") === "meaning" && answerChecker.isNonAsciiPresent(s.val()) || s.val().length === 0)
            return i.is(":animated") || ($("#reviews").css("overflow-x", "hidden"), i.effect("shake", {}, 100, function() {
                return $("#reviews").css("overflow-x", "visible")
            })), !1;
        if (s.val().length !== 0){
            return t();
        }
    });
}



if (document.readyState === 'complete'){
    console.info("About to initialise DoubleCheck");
    DoubleCheck(e);
} else {
    console.info("Window not ready yet, adding listener");
    window.addEventListener("load", function() { DoubleCheck(e); }, false);
}
