// ==UserScript==
// @name        Draggable Sidebar Elements
// @namespace   pxgamer
// @include     *kat.cr/*
// @exclude     *kat.cr/settings*
// @description Fully mushable sidebar
// @version     2.0
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/9966/Draggable%20Sidebar%20Elements.user.js
// @updateURL https://update.greasyfork.org/scripts/9966/Draggable%20Sidebar%20Elements.meta.js
// ==/UserScript==


var setSelector = "#sidebar";
var setCookieName = "sidebarOrder";
console.log(GM_getValue(setCookieName, ''));
$(".sliderbox").css('padding', '3px');

var i = 0;
var s = $(".sliderbox");
$(".sliderbox").each( function() {
    $(this).wrap('<li id="item-'+i+'" style="margin-bottom:2px"></li>');
    i++;
});

$('#sidebar').sortable({ containment: "#sidebar", scroll: false });

function getOrder() {
    GM_setValue(setCookieName, $(setSelector).sortable("toArray"));
}

function restoreOrder() {
    var list = $(setSelector);
    if (list === null) return false;

    var cookie = GM_getValue(setCookieName, '');
    if (!cookie) return false;

    var IDs = cookie;

    var items = list.sortable("toArray");

    var rebuild = [];
    for ( var v=0, len=items.length; v<len; v++ ){
        rebuild[items[v]] = items[v];
    }

    for (var i = 0, n = IDs.length; i < n; i++) {

        var itemID = IDs[i];

        if (itemID in rebuild) {

            var item = rebuild[itemID];

            if (item !== '') {
                var child = $("#sidebar.ui-sortable").children("#" + item);

                var savedOrd = $("#sidebar.ui-sortable").children("#" + itemID);

                child.remove();

                $("#sidebar.ui-sortable").filter(":first").append(savedOrd);
            }
        }
    }
}

jQuery(document).ready(function() {
    jQuery("#sidebar").sortable(
        {axis: "y",
         cursor: "move",
         update: function() { getOrder(); }
        }
    );

    restoreOrder();
});
