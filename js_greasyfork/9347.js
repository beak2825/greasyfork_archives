// ==UserScript==
// @name        utils for /r/p18s
// @namespace   http://www.reddit.com/user/nmtake
// @description /r/p18sが便利になるかもしれないツール（人柱版)。強制古い順ソート、コメント欄フロート、ユーザ名挿入など。
// @include     https://www.reddit.com/r/p18s/comments/*
// @version     0.3
// @grant       GM_addStyle
// @license     public domain
// @downloadURL https://update.greasyfork.org/scripts/9347/utils%20for%20rp18s.user.js
// @updateURL https://update.greasyfork.org/scripts/9347/utils%20for%20rp18s.meta.js
// ==/UserScript==

function insert_mention_button(comment) {
    var anc = comment.querySelector('.author');
    var textarea = document.querySelector('form.cloneable textarea');
    if (!anc || !textarea) return;

    var button = document.createElement('span');
    button.setAttribute('style', 'color: #DDD !important; front-size: 10px; margin: 0 8px;');
    button.textContent = '[mention]';
    button.addEventListener('mousedown', function(e) {
        if (window.getSelection().toString() === '') {
            textarea.value = '/u/' + anc.textContent + "\n\n" + textarea.value;
        } else {
            textarea.value = '/u/' + anc.textContent + " wrote: \n\n"
                + window.getSelection().toString().split("\n")
                .map(function(line) { return '> ' + line; }).join("\n")
                + "\n\n" + textarea.value;
        }
        var form = document.querySelector('form.cloneable');
        if (form) textarea.style.display = 'block';
    });
    anc.parentNode.insertBefore(button, anc.nextSibling); // insertAfter
}

function move_comment_form_to_bottom() {
    var form = document.querySelector('form.cloneable');
    if (!form) return;
    GM_addStyle('form.cloneable {position: fixed; bottom: 10px; right: 10px;'
                + 'background-color: lightgray !important; border-radius: 5px;'
                + 'border: 1px solid black; padding: 5px;} .usertext-edit .md { max-width: 80em; }'
                + 'form.cloneable textarea { display: none; }');
}

function sort_comments_by_old() {
    var sitetable = document.querySelector('.sitetable.nestedlisting');
    if (!sitetable) return;

    var comments = sitetable.querySelectorAll('.thing.comment');
    if (!comments.length) return;
    var clearleft = document.createElement('div');
    clearleft.setAttribute('class', 'clearleft');
    var sorted = [].slice.call(comments).sort(function(a, b) {
        return new Date(a.querySelector('.entry .tagline time').getAttribute('datetime'))
             - new Date(b.querySelector('.entry .tagline time').getAttribute('datetime'));
    });
    // XXX
    while (sitetable.firstNode) {
        sitetable.removeChild(sitetable.firstNode);
    }
    sorted.forEach(function(elem) {
        if (!elem.className.match(/clearleft/)) {
            sitetable.appendChild(elem);
            sitetable.appendChild(clearleft.cloneNode());
        }
    });
}

function is_logged_in() {
    return document.querySelector('form.cloneable') ? true : false;
}

var is_comment_form_exist = is_logged_in;

function scroll_to_bottom_comment() {
    var comments = document.querySelectorAll('.thing.comment');
    if (comments.length > 0) {
        comments[comments.length-1].scrollIntoView(false);
        window.scrollBy(0, 100);
    }
}

function scroll_to_kidoku_new() {
    var kidoku_new = document.querySelector('.kidoku_new');
    if (kidoku_new) {
        kidoku_new.scrollIntoView();
        window.scrollBy(0, -100);
    }
}

function main() {
    var sortmenu = document.querySelector('.menuarea .selected');
    if (!sortmenu) return;
    var selected = sortmenu.textContent;
    if (selected.match(/新着/) || selected.match(/new/)) {
        sort_comments_by_old();
        move_comment_form_to_bottom();
        if (document.querySelector('.kidoku_new')){ 
            scroll_to_kidoku_new();
        } else {
            scroll_to_bottom_comment();
        }
        var div_buttons = document.querySelector('form.cloneable .usertext-buttons');
        var textarea = document.querySelector('form.cloneable textarea');
        if (div_buttons && textarea) {
            div_buttons.addEventListener('mousedown', function(e) {
                if (textarea.style.display === 'none' || textarea.style.display === '') {
                    textarea.style.display = 'block';
                } else {
                    textarea.style.display = 'none';
                }
            });
        }
    }

    if (is_comment_form_exist()) {
        var comments = document.querySelectorAll('.thing.comment');
        for (var i = 0; i < comments.length; i++) {
            insert_mention_button(comments[i]);
        }
    }
}

main()

