// ==UserScript==
// @name        Google Emails
// @description Displays possible email address on google page in an easy to read format.
// @version       0.2
// @include       https://www.google.com/search*
// @author        Cristo
// @copyright    2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/9839/Google%20Emails.user.js
// @updateURL https://update.greasyfork.org/scripts/9839/Google%20Emails.meta.js
// ==/UserScript==

function gready() {
    var handle = document.getElementsByClassName('rc');
    for (var f = 0; f < handle.length; f++) {
        var text_block = handle[f].getElementsByClassName('st')[0]
        var hold_block = '';
        var singles = text_block.innerHTML.split(' ');
        for (var u = 0; u < singles.length; u++) {
            if (singles[u].indexOf('@') > -1 && singles[u].indexOf('.') > -1) {
                var email = singles[u].replace(/<\/?(em|wbr)>/g,'');
                var em = document.createElement('em');
                em.style.color = '#b20000';
                em.innerHTML = email;
                hold_block = hold_block + ' ' + em.outerHTML;
            } else {
                hold_block = hold_block + ' ' + singles[u];
            }
        }
        text_block.innerHTML = hold_block;
    }
}
document.addEventListener('DOMSubtreeModified', check, false);
function check(i) {
    if (i.target.tagName == 'DIV' && i.target.id == 'search' && i.target.innerHTML.length > 0) {
        gready();
    }
}
document.onload = gready();