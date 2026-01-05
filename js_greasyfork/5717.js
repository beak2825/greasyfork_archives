// ==UserScript==
// @name           MetaFilter Filter By Favorites
// @namespace      http://namespace.kinobe.com/metafilter/
// @description    Allows users to view MetaFilter comments by favorite count.
// @include        /^https?://(www|ask|metatalk|fanfare|projects|music|irl)\.metafilter\.com/.*$/
// @include        http://mefi/*
// @version        1.1
// @grant GM.getValue
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @downloadURL https://update.greasyfork.org/scripts/5717/MetaFilter%20Filter%20By%20Favorites.user.js
// @updateURL https://update.greasyfork.org/scripts/5717/MetaFilter%20Filter%20By%20Favorites.meta.js
// ==/UserScript==

/*

 This copyright section and all credits in the script must be included in modifications or redistributions of this script.

 MetaFilterFilterByFavorites is Copyright (c) 2014, Jonathan Gordon
 MetaFilterFilterByFavorites is licensed under a Creative Commons Attribution-Share Alike 3.0 Unported License
 License information is available here: http://creativecommons.org/licenses/by-sa/3.0/

*/

/*
 This script borrows heavily from Jimmy Woods' MetaFilter favorite posts filter script
 http://userscripts.org/scripts/show/75332

 Also from Jordan Reiter's MetaFilter MultiFavorited Multiwidth - November Experiment
 http://userscripts.org/scripts/show/61012

 Please see the README.md for more info:

 https://greasyfork.org/scripts/5717-metafilter-filter-by-favorites

 Version 1.1
 - Uses gm4-polyfill.js to add support for Greasemonkey 4

 Version 1.0
 - Initial Release.
 */

var LogLevelEnum = {
    DEBUG:{value:0, name:"Debug"},
    INFO:{value:1, name:"Info"},
    WARN:{value:2, name:"Warn"},
    ERROR:{value:3, name:"Error"}
};

var SiteEnum = {
    WWW:{
        name:"www", titleRE:/^.+?\| MetaFilter$/, fav_prefix:"2"
    }, ASK:{
        name:"ask", titleRE:/^.+?\| Ask MetaFilter$/, fav_prefix:"4"
    }, TALK:{
        name:"talk", titleRE:/^.+?\| MetaTalk$/, fav_prefix:"6"
    }, PROJECTS:{
        name:"projects", titleRE:/^.+?\| MetaFilter Projects$/, fav_prefix:"13"
    }, MUSIC:{
        name:"music", titleRE:/^.+?\| MeFi Music$/, fav_prefix:"9"
    }, IRL:{
        name:"irl", titleRE:/^.+?\| IRL: MeFi Events$/, fav_prefix:"20"
    }, FANFARE:{
        name:"fanfare", titleRE:/^.+?\| FanFare$/, fav_prefix:"24"
    }
};

Global = {
    last_tr:null        // Reference to the last TR tag in the select table that a user clicked on.
    , table_bg_color:"#E6E6E6"   // Background color for the table rows.
    , selected_color:"#88c2d8"     // BG color for the selected table row.
    , hover_color:"#DC5E04"     // BG color for the selected table row.
    , favorite_color:"#ff7617"     // BG color for the selected table row.
    , max_count:100     // Largest possible # of favorites
    , min_count:0     // Smallest # of favorites that are highlighted
    , posts:[]        // Stores info about each post
    , max_favorites:0   // Highest favorite count so far.
    , doLog:true   // Should we log messages?
    , row_prefix:"summary_id_" // Used to set the ID for each row in the comment/favorite chart
    , logLevel:LogLevelEnum.INFO   // What's the default log level?
};


/**
 * ----------------------------------
 * Logger
 * ----------------------------------
 * Allows swapping out GM logger for console
 */
Logger = {

    log:function (message, logLevelEnum) {
        logLevelEnum = logLevelEnum || LogLevelEnum.INFO;

        if (Global.doLog && logLevelEnum.value >= Global.logLevel.value) {
            console.log(message);
        }
    }, debug:function (message) {
        Logger.log(message, LogLevelEnum.DEBUG);
    }, info:function (message) {
        Logger.log(message, LogLevelEnum.INFO);
    }, warn:function (message) {
        Logger.log(message, LogLevelEnum.WARN);
    }, error:function (message) {
        Logger.log(message, LogLevelEnum.ERROR);
    }
};

/**
 * ----------------------------------
 * Util
 * ----------------------------------
 * Various utility functions
 */
Util = {
    /**
     * Returns an array of DOM elements that match a given XPath expression.
     *
     * @param path string - Xpath expression to search for
     * @param from DOM Element - DOM element to search under. If not specified, document is used
     * @return Array - Array of selected nodes (if any)
     */
    getNodes:function (path, from) {

        Logger.debug("getNodes of path: " + path);

        from = from || document;

        var item, ret = [];
        var iterator = document.evaluate(path, from, null, XPathResult.ANY_TYPE, null);
        while (item = iterator.iterateNext()) {
            ret.push(item);
//            Logger.debug("Item is: "+item);

        }
        Logger.debug("Num elements found by getNodes: " + ret.length);
        return ret;
    },

    /**
     * Deletes a DOM element
     * @param DOM element - DOM element to remove
     * @return DOM element - the removed element
     */
    removeElement:function (element) {
        return element.parentNode.removeChild(element);
    },

    /**
     * Binds an event handler function to an object context, so that the handler can be executed as if it
     * was called using "this.<method name>(event)", i.e. it can use "this.foo" inside it.
     *
     * @param function method - a function to execute as an event handler
     * @param Object context - the object that will be used as context for the function, as if the function had been
     *          called as context.method(event);
     * @return function - the function to pass to addEventListener
     */
    bindAsEventHandler:function (method, context) {
        var __method = method;
        return function (event) {
            return __method.apply(context, [event]);
        }
    },

    //Finds y value of given object
    findPos: function (obj) {
    var current_top = 0;
    if (obj.offsetParent) {
        do {
            current_top += obj.offsetTop;
        } while (obj = obj.offsetParent);
    }
    return current_top;
    },

    simulateClickShow: function(id) {
        var elementById = document.getElementById(id);
        var prevPos = Util.findPos(elementById);
        Logger.debug("prevPos: " + prevPos);
        Logger.debug("Previous window.pageYOffset: " + window.pageYOffset);

        var diff = prevPos - window.pageYOffset;

        elementById.click();

        //Get object
        Logger.debug("Did we find SupportDiv? " + comment_anchor);

        //Scroll to location of SupportDiv on load
        var newPos = findPos(elementById);
        Logger.debug("newPos: " + newPos);
        Logger.debug("Current window.pageYOffset (before scrolling): " + window.pageYOffset);

        window.scroll(0, newPos - diff);
        Logger.debug("Current window.pageYOffset (after scrolling): " + window.pageYOffset);

}

};

/*
 * Event handler for when user clicks on a row
 */
function filterPosts(evt) {
    // Find the parent <TR> tag.

    Logger.debug("filterPosts");
    var t = evt.target;
    Logger.debug("t: " + t);
    while (null == t.getAttribute("id")) {
        Logger.debug("Looking for DIV");
        t = t.parentNode;
    }

    var summary_id = t.getAttribute('id');
    Logger.debug("t.id: " + summary_id);
    var summary_row_re = /^summary_id_(\d+)$/;
    var max_cnt = (summary_row_re.exec(summary_id) !== null) ? parseInt(RegExp.$1) : 0;

    Logger.debug("Parsed max_cnt: " + max_cnt);


    // Hide/unhide all posts that don't match the chosen fav count.
    var i = Global.posts.length;
    while (i--) {
        var is_showing = (Global.posts[i].div.style.display !== "none");
        var do_show = (Global.posts[i].num_favs >= max_cnt);

        Logger.debug("is_showing: " + is_showing);
        Logger.debug("do_show: " + do_show);

        if (do_show != is_showing) {
            Logger.debug("Hiding post: " + i);

            Global.posts[i].div.style.display = (do_show ? "" : "none");
            Global.posts[i].div.nextSibling.style.display = (do_show ? "" : "none");
            Global.posts[i].div.nextSibling.nextSibling.style.display = (do_show ? "" : "none");
        }
    }

    // Reset the color of the previous row to be clicked on.
    if (Global.last_tr !== null) {
        Logger.debug("Resetting the background color.");

        removeClass(Global.last_tr, "wrapperSelected");

    }
    // Set the color of the row we just clicked on
    addClass(t, "wrapperSelected");
    Global.last_tr = t;
}

function addClass(obj, className) {
    if (null != obj && undefined != obj) {
        var prevClass = obj.className;

        if (null != prevClass && undefined != prevClass) {
            if (!prevClass.match(new RegExp(className))) {
                obj.className = obj.className + " " + className;
            }
        }
    }
}

function removeClass(obj, className) {
    if (null != obj && undefined != obj) {
        var prevClass = obj.className;

        if (null != prevClass && undefined != prevClass) {
            var regExp = new RegExp(className);
            if (prevClass.match(regExp)) {
                obj.className = obj.className.replace(regExp, '');
            }
        }
    }

}

// ---------------------------



function getElementsByClassName(node, classname) {
    if (node.getElementsByClassName) { // use native implementation if available
        Logger.debug("Using native implementation of getElementsByClassName.");
        return node.getElementsByClassName(classname);
    } else {
        return (function getElementsByClass(searchClass, node) {
            node = node || document;
            var classElements = [], els = document.getElementsByTagName("*"), elsLen = els.length, pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)"), i, j;
            Logger.debug("Total elements: " + els.length);
            Logger.debug("Looking for" + searchClass);

            for (i = 0, j = 0; i < elsLen; i++) {

                var elsClassName = els[i].className;
                if ("" != elsClassName) {
//                    Logger.debug("Class of element: " + elsClassName);
                }
                if (pattern.test(elsClassName)) {
                    classElements[j] = els[i];
                    j++;
                }
            }
            return classElements;
        })(classname, node);
    }
}


// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js");
    script.addEventListener('load', function () {
        var script = document.createElement("script");
        script.textContent = "(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

function captureShowClick(e) {

    var click_target = e.target;
    while (click_target.tagName != "SPAN") {
        click_target = click_target.parentNode;
    }

    Logger.debug("e.target is: " + click_target);
    Logger.debug("e.target.id is: " + click_target.id);

    var recommended_re = /^(\d+)_(\d+)$/;

    var id = recommended_re.exec(click_target.id)[1];
    Logger.debug("ID is: " + id);
    var count = recommended_re.exec(click_target.id)[2];
    Logger.debug("Count is: " + count);

    var comment_anchor = Util.getNodes('.//a[@name="' + id + '"]')[0];

    simulateClickShow(Global.row_prefix + count);


//    simulateClickShow(id);
    return false;
}

function getSite() {

    // Which subsite are we on?
    var title = document.title;
    Logger.debug("document.title: >" + title + "<");

    for (var propertyName in SiteEnum) {
        // propertyName is what you want
        if (SiteEnum[propertyName].titleRE.test(title)) {
            return SiteEnum[propertyName];
        }
    }
    return null;

}

//check if the previous sibling node is an element node
function getPreviousElement(n) {
    var x = n.previousSibling;
    while (null != x && x.nodeType != 1) {
        x = x.previousSibling;
        Logger.debug("Previous sibling?: " + typeof x);
        Logger.debug("Previous sibling: " + x);
    }
    return x;
}
function init() {
    Logger.info("Loading MetaFilterFilterByFavorites...");

    // if we can't find comments, it's probably this is being called for a page we haven't excluded
    if (undefined == document.getElementById("posts")) {
        Logger.info("MetaFilterFilterByFavorites can not find top node. Exiting.");
        return;
    }

    Logger.debug("MetaFilterFilterByFavorites found top node. Continuing...");

    var site = getSite();

    if (null == site) {
        Logger.error("MetaFilterFilterByFavorites can not determine site. Exiting...");
        return;
    }

    Logger.debug("site: " + site.name);

    // Prepare array for storing counts of how many posts have been favorited this many times.
    var counts = [];
    for (var j = 0; j <= Global.max_count; j++) {
        counts[j] = 0;
    }

    // some useful regexes for parsing ids and such
    var numeric_re = /^(\d+)$/, favorites_re = /^(\d+)\sfavorite[s]?$/;

    // Get all comments and compile them into arrays
    var commentDivs = Util.getNodes('.//div[@id="posts"]//div[contains(concat(" ", normalize-space(@class), " "), " comments ")]');

    Logger.debug("Num comments found: " + commentDivs.length);

    // if there are no comments, don't show table
    if (0 == commentDivs.length) {
        Logger.info("MetaFilterFilterByFavorites can not find comments. Exiting.");
        return;
    }

    for (var i = 0; i < commentDivs.length; i++) {
        Logger.debug("MetaFilterFilterByFavorites found comment div. Continuing...");

        var comment_div = commentDivs[i];
        Logger.debug("Found comment_div: " + comment_div.textContent);

        var sibling_a = getPreviousElement(comment_div);

        // if the comment doesn't have a previous sibling, we're not interested
        if (null == sibling_a) {
            continue;
        }

        Logger.debug("sibling_a: " + typeof sibling_a);
        Logger.debug("sibling_a.name: " + sibling_a.name);

        var comment_div_id = sibling_a.name;
//        Logger.debug("Id is: " + comment_div_id);
        Logger.debug("comment_div_id: " + comment_div_id);

        if (comment_div_id !== undefined && numeric_re.test(comment_div_id)) {
            Logger.debug("Found a valid id: " + comment_div_id);


            var fav_count_a = Util.getNodes('.//span[@id="favcnt' + site.fav_prefix + comment_div_id + '"]/a')[0];
            Logger.debug("fav_count_a: " + fav_count_a);
            Logger.debug("typeof fav_count_a: " + typeof fav_count_a);

            var recommended_text = undefined !== fav_count_a ? fav_count_a.textContent : "0 favorites";

            var favorite_count = (favorites_re.exec(recommended_text) !== null) ? Math.min(parseInt(RegExp.$1), Global.max_count) : 0;
            Logger.debug("favorite_count: " + favorite_count);
            counts[favorite_count]++;
            Logger.debug("Done pushing recommended_count: " + favorite_count);

            // we only highlight if there's a fav count over the minimum
            if (favorite_count > Global.min_count) {
                Logger.debug("recommended_count > " + Global.min_count + ":  " + favorite_count);

                var recommendedWidthSize = (Math.round(favorite_count / 2) + 1);
                comment_div.style.borderLeft = '' + recommendedWidthSize + 'px solid ' + Global.favorite_color;
                comment_div.style.borderTop = '0px';
                comment_div.style.borderBottom = '0px';
                comment_div.style.paddingLeft = '5px';
            }


            Global.max_favorites = Math.max(favorite_count, Global.max_favorites);

            Logger.debug("Calculating max_favorites:" + Global.max_favorites);

            Global.posts.push({
                div:comment_div, num_favs:favorite_count
            });
            Logger.debug("Calculated max_favorites:" + favorite_count);

            var id_text = comment_div_id + "_" + favorite_count;
            Logger.debug("id_text" + id_text);
            var all_id_text = comment_div_id + "_0";
            var show_all_span = document.createElement('span');
            show_all_span.className = "click_count";
            show_all_span.id = all_id_text;

            var show_count_span = document.createElement('span');
            show_count_span.className = "click_count";
            show_count_span.id = id_text;
            show_all_span.innerHTML = "&nbsp;<a>Show: all</a>";
            show_count_span.innerHTML = "&nbsp;<a> / " + favorite_count + " and above</a>";

            var show_more_span = document.createElement('span');
            show_more_span.innerHTML = "&nbsp;<a href='#posts'> / More options</a>";

            var flag_div = Util.getNodes('.//span[@id="flag' + site.fav_prefix + comment_div_id + '"]', comment_div)[0];
            Logger.debug("Inserting show all");
            flag_div.parentNode.insertBefore(show_all_span, flag_div);

            if (favorite_count > Global.min_count) {
                Logger.debug("Inserting show count");
                flag_div.parentNode.insertBefore(show_count_span, flag_div);
            }

            Logger.debug("Inserting show more options");
            flag_div.parentNode.insertBefore(show_more_span, flag_div);

        }
    }
    Logger.debug("Done looping through comments!");

    GM.addStyle('#posts { margin-bottom: 1em; }');

    GM.addStyle('.chart {'
        + 'background-color: ' + Global.table_bg_color + ';'
        + 'font: 14px sans-serif;'
        + 'margin: 0px 4px;'
        + 'color: black;'
        + 'border:1px solid white;'
        + 'border-collapse:collapse;'
        + '}');


    GM.addStyle('.comms {'
        + 'margin-left: 1em;'
        + 'float: left;'
        + 'width: 5%;'
        + '}');

    GM.addStyle('.favs {'
        + 'float: left;'
        + 'background-color: ' + Global.favorite_color + ';'
        + 'margin-right: 4px;'
        + 'text-align: center;'
        + '}');

    GM.addStyle('.wrapper {'
        + 'display: block;'
        + 'padding: 3px 0px;'
        + '}');

    GM.addStyle('.wrapperSelected {'
        + 'background-color: ' + Global.selected_color + ';'
        + '}');

    GM.addStyle('.wrapper:hover {'
        + 'background-color: ' + Global.hover_color + ';'
        + '}');

    GM.addStyle('.clearfix:after {'
        + 'content: ".";'
        + 'display: block;'
        + 'height: 0;'
        + 'clear: both;'
        + 'visibility: hidden;'
        + '}');

    Logger.debug("Done adding style.");

    initTable(counts);
    document.addEventListener('keydown', function (e) {
        // pressed alt+g
        if (e.keyCode == 71 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) {
            simulateClickShow(Global.row_prefix + 0);
        }
    }, false);

    var allClickClasses = getElementsByClassName(document, "click_count");
    Logger.debug("allClickClasses count: " + allClickClasses.length);

    for (var k = 0; k < allClickClasses.length; k++) {
        var n = allClickClasses[k];
        Logger.debug("n is: " + n);
        Logger.debug("n.target is: " + n.target);
        n.addEventListener('click', captureShowClick, false);
    }

    Logger.info("Loading MetaFilterFilterByFavorites is complete.");
}

/**
 * Generates the table at the top of the page
 * @param counts - Array of post counts, from 0 to Global.max_total. [fav_count => # of posts]
 * @return void
 */
function initTable(counts) {
    Logger.debug("Total counts: " + counts);

    var dummyDiv = document.createElement('div');
    var data_rows_html = '<div class="chart" style="width: 70%;">';
    var m = Global.max_count + 1, cum_comment_total = 0;
    // Generate the table rows
    while (m-- >= 0) {

        // we only show differences where the comment count has increased, or the very last row, showing all
        if (counts[m] > 0 || m == 0) {
            cum_comment_total += counts[m];

            var recommendedWidthSize = (Math.round((m / Global.max_favorites) * 90));

            data_rows_html += '<div id="' + Global.row_prefix + m + '" class="wrapper clearfix"><div class="comms">' + cum_comment_total + '</div>'
                + '<div class="favs" style="width: ' + recommendedWidthSize + '%;">(' + ((m == 0) ? "All" : m) + ')</div>'
                + '</div>';

        }
    }

    // Insert table into page

    Logger.debug("data_rows_html: " + data_rows_html);
    dummyDiv.innerHTML = '<div>'
        + '<div id="MultiFavoritesOptions" class="clearfix" style="white-space:nowrap; padding: 3px 0;">Show me this many comments (with at least this many favorites)</div>'
        + data_rows_html
        + '</div>';
    var page_div = document.getElementById("posts");
    page_div.insertBefore(dummyDiv.firstChild, page_div.firstChild);

    // Add the event listeners.
    var rows = Util.getNodes('.//div[@class="wrapper clearfix"]');
    var n = rows.length;
    Logger.debug("Found rows: " + n);

    while (n--) {
        Logger.debug("addEventListener");
        rows[n].addEventListener('click', filterPosts, false);
    }
}

init();
