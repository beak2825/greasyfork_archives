// ==UserScript==
// @name         Lichess.org TV++
// @version      0.1
// @description  Advanced Lichess.org TV page.
// @author       ekin@gmx.us
// @match        http://*.lichess.org/tv
// @grant        none
// @namespace https://greasyfork.org/users/6473
// @downloadURL https://update.greasyfork.org/scripts/6171/Lichessorg%20TV%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/6171/Lichessorg%20TV%2B%2B.meta.js
// ==/UserScript==

$(function() {

    // Player colors adding to left of username
    
    var config = {
 		piece: {
            style: "top: auto !important; left: 5px !important; width: 20px !important; height: 20px !important; opacity: 0.5 !important;"
 		},
        table: {
            style: "margin-left: 15px !important;"
 		}
	};
    
    var main_player_table = $(".table_wrap > .table > .username");
	var second_player_table = $(".table_wrap > .table > .table_inner > .username");
    var main_player_color = "white";
    var second_player_color = "black";
    
    if (/black/i.test(main_player_table.attr("class"))) {
       	main_player_color = "black";
        second_player_color = "white"
    }
    
    main_player_table.before("<div class=\"cg-piece pawn "+main_player_color+"\" style=\""+config.piece.style+"\"></div>");
    second_player_table.before("<div class=\"cg-piece pawn "+second_player_color+"\" style=\""+config.piece.style+"\"></div>");
    
    main_player_table.children("a").removeAttr("data-icon");
    second_player_table.children("a").removeAttr("data-icon");
    
    main_player_table.children("a").attr("style", config.table.style);
    second_player_table.children("a").attr("style", config.table.style);
    
    
    
    // Set visible on/off TV watchers & save visible info to local storage
    
    var config = {
        watchers: {
            style: "opacity: 0.5 !important;"
 		}
	};
    
    var watchers_table = $(".under_chat > .watchers");
    
    watchers_table.before("<input type=\"checkbox\" value=\"on\" id=\"watchers_visible\" style=\""+config.watchers.style+"\" checked><label for=\"watchers_visible\"> Show watchers</label>");
    
    if (localStorage.getItem("watchers_visible") == null) {
        localStorage.setItem("watchers_visible", "on");
    }
    
    $("#watchers_visible").change(function() {
        if($(this).is(":checked")) {
            localStorage.setItem("watchers_visible", "on");
        	watchers_table.removeAttr("style");
       		watchers_table.attr("style", "visibility: visible");
        }
        else {
            localStorage.setItem("watchers_visible", "off");
            watchers_table.removeAttr("style");
       		watchers_table.attr("style", "visibility: hidden");
        }
    });

    if (localStorage.getItem("watchers_visible") == "on") {
       watchers_table.removeAttr("style");
       watchers_table.attr("style", "visibility: visible");
    }
    else {
       $("#watchers_visible").removeAttr("checked");
       watchers_table.removeAttr("style");
       watchers_table.attr("style", "visibility: hidden");
    }
    
});