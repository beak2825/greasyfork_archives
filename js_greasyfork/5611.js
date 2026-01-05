// ==UserScript==
// @name            Imgur Thumbnail Tag Remover
// @namespace       +mK or OMGWTFISTHIS
// @description     Removes the thumbnail tags.
// @include         *imgur.com*
// @version         1
// @require         http://code.jquery.com/jquery-1.10.2.min.js
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/5611/Imgur%20Thumbnail%20Tag%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/5611/Imgur%20Thumbnail%20Tag%20Remover.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}




var styles = [];

styles.push('.top-tag {display: none !important; }');

addGlobalStyle(styles.join(''));