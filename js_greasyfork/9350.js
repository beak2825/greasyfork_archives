// ==UserScript==
// @name         Trello Time Stamp
// @version      1.3
// @description  Button to add current time to current item
// @author       Evan Sutherland
// @description  Expands Trello cards for better viewing and editing on bigger screens.
// @match        https://*trello.com/b/*
// @match        https://*trello.com/c/*
// @include      https://*trello.com/b/*
// @include      https://*trello.com/c/*
// @grant        none
// @namespace TrelloTimeStamp
// @downloadURL https://update.greasyfork.org/scripts/9350/Trello%20Time%20Stamp.user.js
// @updateURL https://update.greasyfork.org/scripts/9350/Trello%20Time%20Stamp.meta.js
// ==/UserScript==
$(document).ajaxComplete(function() {
    $('.list-card').click(function(){
        var actionList = $('.other-actions').find('.u-clearfix');
        if(actionList.find('.fm-insert-date').length === 0){
            $(actionList).append('<a href="#" class="button-link fm-insert-date" title="insert current date time"><span class="icon-sm icon-calendar"></span>Time Stamp</a>').find('.fm-insert-date').click(function(){
                var currentDate = new Date(); 
                var hours = currentDate.getHours();
                var minutes = currentDate.getMinutes();
                if (hours   < 10) {hours   = "0"+hours;}
                if (minutes < 10) {minutes = "0"+minutes;}
                var timeStamp = hours+':'+minutes;

                $('.window-title-text').click();
                var currentText = $('.card-detail-window').find('.edit-heavy').find('textarea');
                currentText.val(currentText.val() + " " + timeStamp);
                $('.card-detail-window').find('.edit-heavy').find('input[type="submit"]').click();
                
                //mark with green label
                //$('.js-edit-labels').click();
                //$('.pop-over').find('.card-label-green').click();
                //$('.pop-over-header-close-btn').click();
                
                //close window
                //$('.dialog-close-button').click();
            });
        }
    });
});
