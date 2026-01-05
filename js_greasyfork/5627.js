// ==UserScript==
// @name        Duże zdjęcia wish.com
// @description Po kliknięciu na zdjęciu otwiera zdjęcie w nowej karcie
// @namespace   http://r4v.pl
// @include     http*://wish.com/*
// @include     http*://www.wish.com/*
// @version     2.1
// @downloadURL https://update.greasyfork.org/scripts/5627/Du%C5%BCe%20zdj%C4%99cia%20wishcom.user.js
// @updateURL https://update.greasyfork.org/scripts/5627/Du%C5%BCe%20zdj%C4%99cia%20wishcom.meta.js
// ==/UserScript==

    $(".contest-picture").click(function() {
        var style = $(this).attr("style");
        style = style.replace("background-image: url(", "");
        style = style.replace(");", "");
        style = style.replace("contest", "original");
        window.open(style);
    })