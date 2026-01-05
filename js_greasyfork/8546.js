// ==UserScript==
// @name         Mousehunt Auto Hunt
// @namespace    http://www.mousehuntgame.com
// @version      2
// @description  Auto hunting for Mousehunt game, including Kings Reward
// @author       Rick Su
// @match        https://www.mousehuntgame.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/8546/Mousehunt%20Auto%20Hunt.user.js
// @updateURL https://update.greasyfork.org/scripts/8546/Mousehunt%20Auto%20Hunt.meta.js
// ==/UserScript==

(function($) {
    console.log('Script started on ' + new Date());

    var doHorn = function() {
        $('.mousehuntHud-huntersHorn').click();
        console.log('Clicked on ' + new Date());
        console.log('Refreshing page in 30 seconds ...');
        setTimeout(function() { window.location.reload(); }, 30000);
    }, doPuzzle = function(puzzle_value) {
        var code = $(".mousehuntPage-puzzle-form-code");
        // Puzzle exists
        if(code.length) {
            code.val(puzzle_value);
            code.closest("form").submit();
            GM_setValue('next_puzzle', null);
            setTimeout(function() { window.location.reload(); }, 10000);
        }
    }, doNextPuzzle = function() {
        var url = 'https://www.mousehuntgame.com/puzzleimage.php?t=' + new Date().getTime() + '&snuid=' + user.sn_user_id + '&hash=' + user.unique_hash;
        var puzzle = $('<div><img src="' + url + '" /><input type="text" /><input type="button" value="Submit" /></div>');
        
        puzzle.find('input[type=button]').click(function() {
            GM_setValue('next_puzzle', puzzle.find('input[type=text]').val());
            window.location.reload();
        });
        
        $('body').prepend(puzzle);
    };


    var next_puzzle = GM_getValue('next_puzzle', null);

    if(!next_puzzle) {
        GM_notification({
            title : 'Kings Rewards',
            text : 'Notified on ' + new Date(),
            highlight : false,
            timeout : 0,
            onclick : function() { }
        }, function() { });
        
        doNextPuzzle();
    }

    console.log('Next Puzzle is ' + next_puzzle);

    if(user.has_puzzle) {
        if(next_puzzle)
            doPuzzle(next_puzzle);
    } else {
        console.log('Clicking in ' + user.next_activeturn_seconds + ' seconds ...');
        setTimeout(function() { doHorn(); }, user.next_activeturn_seconds * 1000);
    }
})(jQuery.noConflict(true));
