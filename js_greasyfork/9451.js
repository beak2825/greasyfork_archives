// ==UserScript==
// @name        reddit styles
// @namespace   http://nucular.github.io
// @version     0.6.1
// @description reddit themes for the common folk
// @copyright   2015, nucular
// @license     MIT License
// @include     http://www.reddit.com/*
// @include     https://www.reddit.com/*
// @run-at      document-start
// @grant       GM_getValue
// @grant       GM_setValue
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/9451/reddit%20styles.user.js
// @updateURL https://update.greasyfork.org/scripts/9451/reddit%20styles.meta.js
// ==/UserScript==

var featured = [
    "NautClassic",
    "serene",
    "carbon",
    "edurne",
    "mindashq"
];

var activated = GM_getValue("activated", false);
var subreddit = GM_getValue("subreddit", "");
var excluded = GM_getValue("excluded", "").split(",");
var otherpages = GM_getValue("otherpages", true);
var dontoverride = GM_getValue("dontoverride", false);

function setActivated(a) {
    activated = a;
    GM_setValue("activated", a);
}

function setOtherPages(a) {
    otherpages = a;
    GM_setValue("otherpages", a);
}

function setDontOverride(a) {
    dontoverride = a;
    GM_setValue("dontoverride", a);
}

function setSubreddit(s) {
    var sane = s.replace(/\/r\/|[^\w]/g, "");
    subreddit = sane;
    if ($("#styles_subreddit").length > 0)
        $("#styles_subreddit").val(sane);
    GM_setValue("subreddit", sane);
}

function setExcluded(e) {
    var split = e.split(",");
    var sane = [];
    for (var i = 0; i < split.length; i++) {
        var v = split[i].replace(/\/r\/|[^\w*?+]/g, "");
        if (v)
            sane.push(v);
    }
    excluded = sane;
    sane = sane.join(",");
    if ($("#styles_excluded").length > 0)
        $("#styles_excluded").val(sane);
    GM_setValue("excluded", sane);
}

function loadStyle() {
    if (subreddit == "") {
        return;
    }
    // jQuery may not be loaded yet here
    var links = document.getElementsByTagName("link");
    var href = "https://www.reddit.com/r/" + subreddit + "/stylesheet/";
    
    var done = false;
    for (var i = 0; i < links.length; i++) {
        if (links[i].title == "applied_subreddit_stylesheet") {
            if (links[i].href != href)
                links[i].href = href;
            done = true;
        }
    }
    if (!done) {
        // Assume we're on another page
        var link = document.createElement("link");
        link.title = "applied_subreddit_stylesheet";
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
    }
}

function loadPrefs() {
    document.addEventListener("DOMContentLoaded", function() {
        $("<tr><th>reddit styles</th><td class='prefright'>"
         + "<input name='styles_activated' id='styles_activated' type='checkbox'>"
         + "<label class='' for='styles_activated'>activate <a href='https://greasyfork.org/en/scripts/9451-reddit-styles'>reddit styles</a></label> "
         + "<span class='details'>use the custom theme of any subreddit everywhere</span>"
         + "<br>"
         + "use theme from /r/<input name='styles_subreddit' id='styles_subreddit' type='text' style='width: 150px'> "
         + "<span class='details' id='styles_featured'>e.g.&nbsp;</span>"
         + "<br>"
         + "exclude subreddits <input name='styles_excluded' id='styles_excluded' type='text' style='width: 150px'> "
         + "<span class='details'>separated by commas, use * and ? as wildcards</span>"
         + "<br>"
         + "<input name='styles_otherpages' id='styles_otherpages' type='checkbox'>"
         + "<label class='' for='styles_otherpages'>style other pages too (if available)</label> "
         + "<span class='details'>e.g the front, subreddits, compose/messages and explore pages</span>"
         + "<br>"
         + "<input name='styles_dontoverride' id='styles_dontoverride' type='checkbox'>"
         + "<label class='' for='styles_dontoverride'>don't override if a subreddit already has a custom theme</label> "
         + "<span class='details'>this will delay the loading of your custom stylesheet though</span>"
         + "</tr></td>").prependTo(".content.preftable > tbody");
    
        for (var i = 0; i < featured.length; i++) {
            $("<a></a>")
                .attr("href", "https://www.reddit.com/r/" + featured[i])
                .text(featured[i])
                .appendTo("#styles_featured")
                .on("click", function(e) {
                    e.preventDefault();
                    setSubreddit($(this).text());
                });
            if (i < featured.length-1)
                $("<span>,</span>").appendTo("#styles_featured");
        }
    
        $("#styles_activated")
            .on("change", function(e) {
                setActivated(this.checked);
            })[0].checked = activated;
        $("#styles_otherpages")
            .on("change", function(e) {
                setOtherPages(this.checked);
            })[0].checked = otherpages;
        $("#styles_dontoverride")
            .on("change", function(e) {
                setDontOverride(this.checked);
            })[0].checked = dontoverride;
        $("#styles_subreddit")
            .val(subreddit)
            .on("change", function(e) {
                setSubreddit($(this).val());
            });
        $("#styles_excluded")
            .val(excluded.join(","))
            .on("change", function(e) {
                setExcluded($(this).val());
            });
    });
}


var page = window.location.pathname.match(/^(\/\w+)/);
if (!page) page = "/";
else page = page[1];

if (activated) {
    // Subreddits
    if (page == "/r") {
        var sub = window.location.pathname.match(/^\/r\/([\w+]+)/)[1];
        // First check if the sub is excluded
        for (var i = 0; i < excluded.length; i++) {
            if (sub.match(new RegExp("^" + excluded[i].replace(/([\*\?])/g, ".$1") + "$")))
                return;
        }
        // Gotta poke the server about this, sadly
        if (dontoverride) {
            var http = new XMLHttpRequest();
            http.open("HEAD", "https://www.reddit.com/r/" + sub + "/stylesheet/");
            http.onreadystatechange = function() {
                if (this.readyState == this.HEADERS_RECEIVED) {
                    if (this.status == 403 || this.status == 404) { // 403 = banned/private, 404 = no style
                        loadStyle();
                        setInterval(loadStyle, 300);
                    }
                }
            };
            http.send();
        } else {
            loadStyle();
            setInterval(loadStyle, 300);
        }
    }
    
    // Other areas
    else if (otherpages && page != "/prefs") { //(page == "/" || page == "/compose" || page == "/subreddits" || page == "/messages" || page == "/explore")) {
        loadStyle();
        setInterval(loadStyle, 300);
    }
}
// Preferences
if (page == "/prefs") {
    loadPrefs();
}
