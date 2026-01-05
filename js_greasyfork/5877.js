// ==UserScript==
// @name       Filmtipset favorite lists
// @namespace  https://github.com/Row/filmtipset-userscripts
// @version    2.0.2
// @description Filmtipset favorite lists makes it possible to select movie lists and assign them custom colors. Colored markings are then placed on the movies, if they belong to the specific list.
// @match      http://www.filmtipset.se/*
// @copyright  2016+, Row
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/5877/Filmtipset%20favorite%20lists.user.js
// @updateURL https://update.greasyfork.org/scripts/5877/Filmtipset%20favorite%20lists.meta.js
// ==/UserScript==

(function( $, document ) {
"use strict";

// Unique for array
Array.prototype.unique = function() {
    var i, l,
        u = {},
        a = [];
    for (i = 0, l = this.length; i < l; ++i) {
        if (u.hasOwnProperty(this[i])) {
            continue;
        }
        a.push(this[i]);
        u[this[i]] = 1;
    }
    return a;
};

function ListHandler() {
var STORAGE_KEY = "filmtipsetListsV2",
    mLists,
    myDfds = [],
    //
    // Private methods
    //
    persist = function() {
        // Prototype breaks stringify, this is handled on parse
        GM_setValue(STORAGE_KEY, JSON.stringify(mLists));
    },
    collectObjects = function(htmlData, listId) {
        mLists[listId].objects = mLists[listId].objects.concat(parseObjects(htmlData));
    },
    collectListInfo = function(htmlData, listId) {
        var i,
            pagesUrls = [];

        var htmlDOM = $.parseHTML(htmlData);
        mLists[listId].title = $("h1", htmlDOM).text();
        $("a[href*='page_nr=']", htmlDOM).each(function(index, el) {
            var url = $(el).attr("href");
            if (url.indexOf("page_nr=1&") == -1)
                pagesUrls.push(url);
        });
        pagesUrls = pagesUrls.unique();
        for (i = 0; i < pagesUrls.length; i++) {
            var url = pagesUrls[i];
            myDfds.push($.get(url, function(data) {
                collectObjects(data, listId);
            })); // jshint ignore:line
        }
        collectObjects(htmlData, listId, myDfds);
        $.when.apply(window, myDfds).done(function() {
            setTimeout(persist, 100);
            myDfds = [];
        });
    },
    parseObjects = function(htmlData) {
        var list = [];
        htmlData.replace(/'info_(\d+)'/gm, function(m, n) {
            list.push(n);
        });
        return list.unique();
    },
    updateLists = function() {
        var listId, list,
            updateIntervalInMilliseconds = 60 * 60 * 24 * 1000,
            nextUpdate = new Date().getTime() - updateIntervalInMilliseconds;
        for (listId in mLists) {
            if (!mLists.hasOwnProperty(listId)) {
                continue;
            }
            list = mLists[listId];
            if (nextUpdate > list.lastUpdate) {
                list.objects = [];
                list.lastUpdate = new Date().getTime();
                $.get(list.url, function(data) {
                    collectListInfo(data, listId);
                }); // jshint ignore:line
                break; // update max one list per page load
            }
        }
    },
    loadLists = function() {
        try {
            var list,
                listId;

            mLists = JSON.parse(GM_getValue(STORAGE_KEY));

            // Helvetes, Prototype breaks the native stringify, remove
            // this in the future
            for (listId in mLists) {
                if (!mLists.hasOwnProperty(listId)) {
                    continue;
                }
                list = mLists[listId];
                if (typeof list.objects === "string") {
                    list.objects = JSON.parse(list.objects);
                }
            }
        } catch (err) {
            console.error("Limited support? Malformed JSON? First run?");
            mLists = {};
        }
    }; // end private methods and vars

    //
    // Public
    //
    this.getLists = function() {
        return mLists;
    };

    this.addList = function(url, title, color) {
        var listId = Date.now();
        loadLists(); // In case there are multiple tabs open
        mLists[listId] = {
            "title": title,
            "lastUpdate": 0,
            "listId": listId,
            "url": url,
            "color": color,
            "objects": []
        };
        updateLists();
    };

    this.hardRefresh = function(listId) {
        mLists[listId].lastUpdate = 0;
        updateLists();
    };

    this.removeList = function(listId) {
        delete mLists[listId];
        persist();
    };

    //
    // Init
    //
    loadLists();
    updateLists();
}

function renderAdmin(list) {
    var elBtn, elHld, elCol;
    if (!/package_view|dvd.html|bio.html|tv.html/.test(document.location.href)) {
        return;
    }
    elHld = $("<li class='add-new rightlink' />");
    $("#favoriteLists").append(elHld);
    $("<div class='in-list-admin'></div>").prependTo(elHld);
    elCol = $("<input type='text' value='#FF0000' />")
                .attr("title", "Färgkod på listan t.ex: #FF0000, yellow, blue");
    elCol.on("keyup change", function() {
        $(this).siblings(".in-list-admin").css("background", $(this).val());
    });
    elBtn = $("<button>Spara listan till favoriter</button>");
    elBtn.on("click", function() {
        var listUrl = document.location.href,
            title = $("h1").text();

        list.addList(listUrl, title, elCol.val());
        $("<span>Sparad</span>")
            .css({
                "color": "green",
                "font-weight": "bold"
            })
            .insertAfter(elBtn)
            .fadeOut(3000);
    });

    elCol.appendTo(elHld).change();
    elBtn.appendTo(elHld);
}

function renderList(aList) {
    var listId,
        elDestination = $("td > div.rightlink").last(),
        ul = $("<ul id='favoriteLists' />")
                .insertAfter(elDestination)
                .on("click", ".delete", function() {
                    list.removeList($(this).data("listId"));
                    $(this).parent().hide();
                })
                .on("click", ".refresh", function() {
                    list.hardRefresh($(this).data("listId"));
                }),
        lists = aList.getLists();
    $("<div class='rightlinkheader'>Favoritlistor</div>")
        .insertAfter(elDestination);

    if ($.isEmptyObject(lists)) {
        $("<li class='rightlink'>")
            .text("Gå till en lista för att lägga till den.")
            .appendTo(ul);
    }

    for (listId in lists) {
        var li, l, title;
        if (!lists.hasOwnProperty(listId)) {
            continue;
        }
        l = lists[listId];
        li = $("<li class='rightlink'>");
        title = l.objects.length + " filmer, Uppdaterad " +
             new Date(l.lastUpdate).toISOString().slice(0, 19).replace('T', ' ');
        li.attr("title", title).appendTo(ul);
        $("<a>").text(l.title).attr("href", l.url).appendTo(li);
        $("<div class='in-list-admin'></div>")
            .css("background", l.color)
            .prependTo(li);
        $("<button class='refresh'>↻</button>")
            .data("listId", listId).appendTo(li);
        $("<button class='delete'>X</button>")
            .data("listId", listId).appendTo(li);
    }
}

function isMoviePage() {
    return /\/film\//.test(document.location.href);
}

function renderMarkers(aLists) {
    var listId, list, i, renderer,
        lists = aLists.getLists();

    renderer = isMoviePage() ? new RenderSinglePage() : new RenderListPage();
    for (listId in lists) {
        if (!lists.hasOwnProperty(listId)) {
            continue;
        }
        list = lists[listId];
        renderer.list = list;
        for (i = 0; i < list.objects.length; i++) {
            renderer.render(list.objects[i]);
        }
        renderer.increaseOffset();
    }
}

/* Renderer classes for markers */
var Renderer = {
    list:null,
    offset: 0,
    increaseOffset: function() {
        this.offset++;
    },
};

function RenderSinglePage() {
    var currentId = $("input[type=hidden][name=object]").val();
    this.render = function(movieId) {
        if(currentId == movieId) {
            $(".movie_header").append(
                $("<div />")
                    .addClass("in-list-badge")
                    .css("background", this.list.color)
                    .text(this.list.title)
            );
        }
    };
}
RenderSinglePage.prototype = Renderer;

function RenderListPage() {
    this.render = function(movieId) {
        var elTarget = $("#info_" + movieId);
        if (elTarget.length) {
            $("<div />")
                .addClass("in-list")
                .css("background", this.list.color)
                .css("left", (this.offset * 7) + "px")
                .appendTo(elTarget.siblings(".row").first());
        }
    };
}
RenderListPage.prototype = Renderer;

// Init and render
GM_addStyle(
    "#favoriteLists {padding: 0 0 0 10px}" +
    "#favoriteLists>li {display: block;position:relative;}" +
    "#favoriteLists .delete {position:absolute;right:0;top:0;}" +
    "#favoriteLists .refresh {position:absolute;right: 24px;top: -1px;}" +
    "#favoriteLists>li button {display: none;}" +
    "#favoriteLists>li:hover button, #favoriteLists>li.add-new button {display: block;margin-top: 2px}" +
    ".in-list, .in-list-admin {z-index: 6;border: 1px solid #000000; border-radius: 4px;width: 8px; height: 8px;position: absolute}" +
    ".in-list {margin-left: 300px;top: 3px;}" +
    ".in-list-admin {margin-left: -12px; top:6px;}" +
    "li.add-new.rightlink {border: 1px solid #DEB887; border-radius: 5px; padding: 3px; padding-left: 22px; margin-left: -15px; background: #F9EEE0;}" +
    ".movie_header {position:relative;}" +
    ".in-list-badge {height: auto; width: auto; color: #FFF; float: right; position: relative; margin-left: 0.3em; padding: 0.4em 0.4em; letter-spacing: 0.05em; font-size: 11px; font-weight: 700; margin-bottom: 10px; margin-top: -29px; border: 1px solid #E2E2E2; border-radius: 3px; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;" 
);

var list = new ListHandler();
renderList(list);
renderMarkers(list);
renderAdmin(list);
})(unsafeWindow.jQuery, document); // jQuery from site
