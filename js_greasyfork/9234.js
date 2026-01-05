// ==UserScript==
// @name         Tumblr note cleanup
// @namespace    Nope.
// @version      1.5
// @description  A small line of code that removes all the useless likes and reblogs without comments from the notes list below a post.
// @author       Dasky14
// @match        */post/*
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/9234/Tumblr%20note%20cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/9234/Tumblr%20note%20cleanup.meta.js
// ==/UserScript==
var LoopCount = 10;
var i = 0;

$('body').on('click', '.more_notes_link',function() {
    if (i == 0) {
        clearInterval(loadNotesInterval);
        var loadNotesInterval = setInterval(function() {
            if ($('.more_notes_link').length) {
                i++;
                $('.more_notes_link').click();
                if (i >= LoopCount) {
                    i = 0;
                    clearInterval(loadNotesInterval);
                }
            }
            else
            {
                i = 0;
                clearInterval(loadNotesInterval);
            }
        }, 1000)
    }
});

GM_addStyle ( ".notes .note.without_commentary{display:none} .notes .note.reply{display:inline}" );