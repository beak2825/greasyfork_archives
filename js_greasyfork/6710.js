// ==UserScript==
// @name         Faster Repinning on Pinterest
// @namespace    http://www.gregschwartz.net
// @version      1
// @description  Decrease the number of clicks required to repin.
// @author       Greg Schwartz
// @match        http://www.pinterest.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/6710/Faster%20Repinning%20on%20Pinterest.user.js
// @updateURL https://update.greasyfork.org/scripts/6710/Faster%20Repinning%20on%20Pinterest.meta.js
// ==/UserScript==

function parseBoards(modal) {
    var boards = [];
    modal.find(".boardPickerInner ul li").each(function(i) {
        var t = $(this);
        boards[i] = {
            "id": t.data("id"),
            "name": t.text().trim(),
            "place": t.find(".placeIcon.hidden").length===0,
            "secret": t.find(".secretIcon.hidden").length===0,
            "collaborative": t.find(".collaborativeIcon.hidden").length===0,
        };
    });
    
    //sort boards
    boards.sort(function(a,b) {
        var aa = a.name.toLowerCase(), bb = b.name.toLowerCase();
        if (aa > bb) {
            return 1;
        }
        if (aa < bb) {
            return -1;
        }
        // a must be equal to b
        return 0;
    });

    return boards;
}

function makeNewBoardButton(modal) {
    return $('<button class="Module Button btn rounded">Add New Board</button>')
    .css({
        "margin-bottom": 5
    })
    .click(function(event) {
        var name = window.prompt("What would you like to name your new public board?");

        if(name !== null) {
            modal.find(".createBoardName").val(name);
            log("New board: "+ name);
            modal.find("button.createBoardButton").click();
        }
        event.preventDefault();
        
        var beforeLength = modal.find(".boardPickerInner ul li").length,
            intervalObj = setInterval(function() {
                if(modal.find(".boardPickerInner ul li").length > beforeLength) {
                    clearInterval(intervalObj);
                    modal.find(".btn.pinIt").click();
                }
            }, 100);
        return false;
    });
}

function makeBoardButton(modal, board) {
    return $('<button class="Module Button btn rounded primary" type="submit">' 
            + board.name
            + (board.collaborative || board.place || board.secret ? "<span class='iconWrapper'>" : "")
            + (board.collaborative ? "<span class='collaborativeIcon'></span>" : "")
            + (board.place ? "<span class='placeIcon'></span>" : "")
            + (board.secret ? "<span class='secretIcon'></span>" : "")
            + (board.collaborative || board.place || board.secret ? "</span>" : "")
            + '</button>'
        )
        .css({
            "margin-bottom": 5
        })
        .click(function() {
            $(".boardPickerItem[data-id="+ board.id +"]").click();
            log("selected board: "+ board.name);

            log("click the pin button");
            modal.find(".btn.pinIt").click();
        });
}

//redesign the modal and add the buttons
function alterWindow() {
    log("alterWindow()");
    
    //prevent running again on modal
    if($(".submitAndBoardButtons").length > 0)
        return;
    
    var modal = $(".modalContent form"),
        shareUI = modal.find(".socialShareWrapper"),
    	boards = parseBoards(modal),
        newButtons = $("<div class='submitAndBoardButtons BoardPickerOld'></div>");
    
    //hide boards LI
    modal.find("li.boardWrapper").hide();
    
    //hide close and pin buttons
    modal.find(".formFooter .formFooterButtons").hide();

    //move image to left and description to right
    modal.find(".ui-PinPreview").css({
        "float": "left",
        "margin": 15
    });
    modal.children("ul").css("margin", "0 0 0 167px")
        .find("h3").css("padding",0);
    modal.find(".ui-TextField").parent().css("margin-left", 0);
    
    //move social to be after description; force showing in case last pinned board was a private one
    modal.find("li.boardWrapper").next().append(shareUI);
    shareUI.show().css("margin-left", 0);

    //add wrapper to bottom
    modal.find(".formFooter").append(newButtons);
    newButtons.css("text-align", "center");
    
    //display other board buttons
    for(var i in boards) {
        //make button, add to modal
		newButtons.append(makeBoardButton(modal, boards[i]));
    }
    
    //add a gray new board button
    newButtons.append(makeNewBoardButton(modal));
    
    //add style to buttons
    modal.find(".iconWrapper").css({
        "background": "white",
        "margin-left": 3,
        "border-radius": 15,
        "padding": "0px 3px 0 2px"
    });
}

function log(text) {
    if(console && console.log) {
        console.log(text);
    }
}

//check for modal, if it's there, run alterWindow()
function checkForModal() {
    if($(".modalContent form").length === 0) {
        setTimeout(checkForModal, 50);
        return;
    }
    
    alterWindow();
}

function addPinButtonClickHandler() {
    log("addPinButtonClickHandler()");

    //when repin is clicked, run checkForModal
    $("button.repinSmall, button.repin").click(checkForModal);
    
    timerToAlterButtons = null;
}

var timerToAlterButtons;
$( document ).ajaxComplete(function( event, xhr, settings ) {
    if(!timerToAlterButtons) {
        timerToAlterButtons = setTimeout(addPinButtonClickHandler, 1000);
    }
});