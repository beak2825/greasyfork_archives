// ==UserScript==
// @name         OpenRaid Highlight
// @version      1.1
// @namespace	 chawan
// @description  Highlights the selected keyword in the chat when it's posted
// @author       Chawan
// @match        http://openraid.eu/chat
// @match	 http://openraid.us/chat
// @downloadURL https://update.greasyfork.org/scripts/5614/OpenRaid%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/5614/OpenRaid%20Highlight.meta.js
// ==/UserScript==

var ChatBoxBody;
var Keyword = "";
var matchAll = true;

$(document).ready(function() {
     ChatBoxBody = document.getElementById("body");

    if(ChatBoxBody !== null) {
        AddInputBox();

        $("#matchButton").click(function() {
            changeMatch();
        });
        $("#highlightKeyword").on('input', function() {
           Keyword = $("#highlightKeyword").val().toLowerCase();
           console.log(Keyword);
        });
        setInterval(HighlightMessage, 1000);
    }
});

function AddInputBox() {
    console.log("We have the chatbox body and content");

    var inputField = document.createElement("input");
    inputField.setAttribute("id", "highlightKeyword");
    inputField.setAttribute("size", "100");
    inputField.setAttribute("autocomplete", "off");
    inputField.setAttribute("placeholder", "Enter a keyword to highlight in chat");
    inputField.style.float = "left";
    inputField.style.border = "1px solid #004455";
    inputField.style.borderRadius = "5px";
    inputField.style.marginLeft = "0px";
    inputField.style.marginTop = "5px";
    inputField.style.background = "#0F1219";
    inputField.style.color = "White";
    inputField.style.fontSize = "14px";

    var matchButton = document.createElement("button");
    matchButton.setAttribute("class", "btn btn-success");
    matchButton.setAttribute("id", "matchButton");
    matchButton.innerHTML = "Match all";
    matchButton.style.top = "1px";
    matchButton.style.position = "relative";
    matchButton.style.marginLeft = "5px";
    matchButton.style.marginTop = "5px";

    ChatBoxBody.appendChild(inputField);
    ChatBoxBody.appendChild(matchButton);
}

function HighlightMessage() {
    $(".chatline").each(function(index) {
        //console.log($(this).find(".messageText").text());
        if(wordInString($(this).find(".messageText").text().toLowerCase(), Keyword) && $(this).find(".messageText").css("background-color") != "rgb(255, 0, 0)" && Keyword.length > 0) {
            $(this).css("background-color", "rgb(255, 0, 0)");
        }
        else if($(this).css("background-color") == "rgb(255, 0, 0)") {
            $(this).css("background-color", "");
        }
    });
}

function changeMatch() {
    if (matchAll) {
        matchAll = false;
        $("#matchButton").html("Match word");
    } else {
        $("#matchButton").html("Match all");
        matchAll = true;
    }
}

function wordInString(s, word) {
    if (matchAll == true) {
        return s.indexOf(word) >= 0;
    } else {
        return new RegExp( '\\b' + word + '\\b', 'i').test(s);
    }
}