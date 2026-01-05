// ==UserScript==
// @author      Jack_mustang
// @version     3.0
// @name        ExtendPornHub
// @description Remove ads, enlarges video, stops autoplay keeping buffering & block pop-ups
// @date        2017 October 3
// @include     *pornhub.com/*
// @include     *pornhubpremium.com/*
// @run-at      document-start
// @grant       none
// @license     Public Domain
// @icon        https://gmgmla.dm2301.livefilestore.com/y2pAKJYeZAp4tG23hG68x1mRuEUQXqb1MxdLbuqVnyyuHFxC7ra5Fc-tfq6hD-r9cNnVufT3egUHaimL547xDlESrOVmQsqNSJ5gzaiSccLYzo/ExtendPornHub-logo.png
// @namespace   649b97180995e878e7e91b2957ef3bbee0f840a0
// @downloadURL https://update.greasyfork.org/scripts/6587/ExtendPornHub.user.js
// @updateURL https://update.greasyfork.org/scripts/6587/ExtendPornHub.meta.js
// ==/UserScript==

if (!!window.location.hostname.match(/premium/)) {
    (function ExtendPornHubPremium(){
        changePlayer();
        window.addEventListener("DOMContentLoaded", function(){
            if(document.querySelector("#player")) {
                videoFunctions();
            }
        }, false);
    })();
    return;
}

// Block popups fallback
function NoOpen() { return 1; }
parent.open = NoOpen;
this.open = NoOpen;
window.open = NoOpen;
open = NoOpen;
window.open = function () { return; };
open = function () { return; };
this.open = function () { return; };
parent.open = function () { return; };

function fnull() {
    return null;
}

// Block ads
Object.defineProperty(window, "adDelivery", {
    get: fnull,
    set: fnull
});
Object.defineProperty(window, "tj_ads", {
    get: fnull,
    set: fnull
});
Object.defineProperty(window, "tj_channels", {
    get: fnull,
    set: fnull
});

window.EYP = {};
// stop autoplay
Object.defineProperty(window, "videoTimeTracking", {
    set: function (e) {
        // window.EYP.flashvars = ;
        Object.defineProperty(window, "flashvars_" + e.match(/\d+/)[0], {
            set: function (e) {
                e.autoplay = false;
                e.autoload = true;
                window.EYP.flashvars = e;
            },
            get: function () {
                return window.EYP.flashvars;
            }
        });
        window.EYP.videoTimeTracking = e;
    },
    get: function () {
        return window.EYP.videoTimeTracking;
    }
});

(function addStyle() {
    // While <head> is not loaded we keep trying
    if (!document.querySelector("head")) {
        return setTimeout(addStyle, 50);
    }

    // We create an object and start including its content to include in DOM at the end
    var ephcss =
    // Hide ads while we can't remove them
    "iframe, aside, figure," +
    // Ad area in gifs page
 //   ".gifsWrapper > div:first-child," +
    // Video being watched in one line
    ".videos-being-watched.logInHotContainer li:last-child," +
    // Ad Block Message
    ".abAlertShown," +
    // Change language notice
    "#countryRedirectMessage {" +
        "display: none !important;" +
    "}" +
    // Pornstars page
    "ul.top_trending_pornstar {" +
        "display: table !important;" +
        "margin: auto !important;" +
    "}" +
    "ul.top_trending_pornstar li {" +
        "display: table-cell !important;" +
    "}" +
    ".sectionWrapper .pornstarVideosCounter {" +
        "width: 100% !important;" +
    "}" +
    // Gifs page
    ".gifsWrapper ul.gifs li.first {" +
        "margin-right: 12px !important;" +
        "margin-top: 0 !important;" +
        "height: 353px !important;" +
        "margin-bottom: 12px !important;" +
    "}" +
    "@media only screen and (min-width: 1350px) {" +
        ".gifsWrapper ul.gifs li.first {" +
            "height: 381px !important;" +
        "}" +
        ".gifsWrapper ul.gifs li:nth-child(8) {" +
            "display: none !important;" +
        "}" +
    "}" +
    ".gifColumnLeft.float-left {" +
        "width: 100% !important;" +
    "}";

    // Inject created CSS
    var ephnode = document.createElement("style");
    ephnode.type = "text/css";
    ephnode.id = "EPH-style";
    ephnode.appendChild(document.createTextNode(ephcss));
    document.head.appendChild(ephnode);
}());

(function ExtendPornHub() {
    // Scroll, keyboard shortcut
    function videoStuff() {
        // Scroll video to middle of page
        function scrollthere() {
            var player = document.getElementById("player");
            var vh = player.offsetHeight;
            var vd = document.querySelector(".container").offsetTop + document.querySelector(".container").parentNode.offsetTop + document.querySelector(".video-wrapper").offsetTop;
            var fh = window.innerHeight;
            var sc = vd - ((fh - vh) / 2);
            window.scrollTo(0, sc);
            // console.info("** ExtendPornHub **\ntop: " + vd + ", height: " + vh + ", scrolled: " + sc + ", window: " + fh);
        }
        // Inject this function to page
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.innerHTML = scrollthere.toString();
        script.id = "EPH-scrollVid";
        document.body.appendChild(script);
        scrollthere();

        // Keyboard Shortcut for centring
        window.addEventListener("keyup", function(e) {
            if (e.ctrlKey && e.altKey && (e.code === "KeyC" || (e.code === undefined && e.keyCode === 67))) {
                scrollthere();
            }
        }, false);

        // Include button in right corner to center video on screen
        var node = document.createElement("div");
        node.setAttribute("style","position: fixed;" +
                                  "bottom: 0;" +
                                  "right: 0;" +
                                  "cursor: pointer;" +
                                  "border: 1px solid #313131;" +
                                  "border-top-left-radius: 5px;" +
                                  "color: #acacac;" +
                                  "font-weight: 700;" +
                                  "background: #2f2f2f;" +
                                  "text-align: center;" +
                                  "font-size: 12px;" +
                                  "padding: 7px 15px;" +
                                  "z-index: 999999;");
        node.setAttribute("onclick", "scrollthere();");
        node.setAttribute("title", "Use the keyboard shortcut Ctrl+Alt+C (For other keyboard layouts use the key where C should be on the QWERTY layout)");
        node.innerHTML = "Centre";
        node.id = "EPH-scroll";
        document.body.appendChild(node);

        // Add video download when not logged
        if( document.body.classList[0].search("logged-in") < 0 ) {
            var tab = document.querySelector(".download-tab");
            var dwlinks = "";

            for (var key in window.EYP.flashvars) {
                var quality = key.match(/quality_(\d+)p/);
                if (!!quality) {
                    dwlinks += "<a class='downloadBtn greyButton' target='_blank' href='" + EYP.flashvars[key] + "'><i></i>" + (quality[1] > 700 ? "<span>HD</span> " : "") + quality[1] + "</a>"
                }
            }

            tab.innerHTML = dwlinks;
        }
    }

    var observer = new MutationObserver(function (changes) {
        changes.forEach(function (chg) {
            if (!!chg.target.className) {
                // remove ad spaces
                if (!!chg.target.className.match(/removeAdsStyle/)) {
                    var node = chg.target.parentNode;
                    if (!!node.parentNode.className.match(node.className.substr(0, node.className.length - 1))) {
                        node = node.parentNode;
                    }
                    node.parentNode.removeChild(node);
                    return;
                }
                // wide player
                if (!!chg.target.id.match(/\bplayer\b/)) {
                    chg.target.className = "wide";
                    return;
                }
                if (!!chg.target.id.match(/main-container/) && !!chg.previousSibling && !!chg.previousSibling.id && !!chg.previousSibling.id.match(/rightColVideoPage/)) {
                    chg.previousSibling.className = "wide";
                    return;
                }
                // update wide player button / HTML5 only
                if (!!chg.target.className.match(/mhp1138_front/)) {
                    chg.target.childNodes.forEach(function (node) {
                        if (!!node.className.match(/mhp1138_cinema/)) {
                            node.className = "mhp1138_cinema mhp1138_cinemaState";
                            return;
                        }
                    });
                    return;
                }
                // centre video
                if (!!chg.target.className.match(/playerFlvContainer/)) {
                    chg.addedNodes.forEach(function (element) {
                        if (!!element && element.id === "pb_template") {
                            var node = document.createElement("div");
                            node.className = "mhp1138_playerStateIcon";
                            node.setAttribute("style", "opacity: 1");
                            node.innerHTML =
                                    "<div class='mhp1138_play' style='display: block'>" +
                                    "    <div class='mhp1138_icon mhp1138_icon-play'></div>" +
                                    "</div>" +
                                    "<div class='mhp1138_background'></div>";
                            element.appendChild(node);

                            videoStuff();
                            return;
                        }
                    });
                }
                return;
            }
        });
    });

    observer.observe(document, {childList: true, subtree: true});
}());
