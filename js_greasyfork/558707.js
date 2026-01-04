// ==UserScript==
// @name           rutracker: убираем повторы из списка тем
// @version        1.0
// @include        https://rutracker.org/forum/viewforum.php?f=*
// @description Собирает темы с одинаковыми названиями фильмов в одну
// @grant       none
// @namespace rutracker
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558707/rutracker%3A%20%D1%83%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC%20%D0%BF%D0%BE%D0%B2%D1%82%D0%BE%D1%80%D1%8B%20%D0%B8%D0%B7%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%B0%20%D1%82%D0%B5%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/558707/rutracker%3A%20%D1%83%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC%20%D0%BF%D0%BE%D0%B2%D1%82%D0%BE%D1%80%D1%8B%20%D0%B8%D0%B7%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%B0%20%D1%82%D0%B5%D0%BC.meta.js
// ==/UserScript==

var run = function() {
    var rows = new Map();

    document.querySelectorAll('div.torTopic > a.torTopic').forEach(link => {
        var linkText = link.textContent;
        // console.log(linkText);
        var name = linkText.split('/')[0];
        if (!rows.has(name)) {
            rows.set(name, link.parentElement);
        } else {
            console.log(name);
            var initRow = rows.get(name);
            // console.log(initRow);
            initRow.innerHTML += '<br>' + link.parentElement.innerHTML;
            // div < td < tr
            link.parentElement.parentElement.parentElement.remove();
        }
    });
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}