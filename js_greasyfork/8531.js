// ==UserScript==
// @name         Greasy Fork Script Discussions
// @namespace    http://userscripts.org/users/zackton
// @description  Easily shows you what script discussions need a response.
// @include      https://greasyfork.org/*/users/*
// @run-at       document-end
// @grant        none
// @version      1.5
// @downloadURL https://update.greasyfork.org/scripts/8531/Greasy%20Fork%20Script%20Discussions.user.js
// @updateURL https://update.greasyfork.org/scripts/8531/Greasy%20Fork%20Script%20Discussions.meta.js
// ==/UserScript==

if (window.location.href.indexOf("ratings") == -1) {
    var url = document.URL;
    url += "?sort=ratings"
    window.location.href = url;
} else {
    Exec();
};

function Exec() {
    var Creator = document.title;
    var unread = document.querySelector("#control-panel");
    var appendH3 = document.createElement('h3');
    var appendUl = document.createElement('ul');
    appendUl.setAttribute('class','unresponded-list');
    appendH3.innerHTML = "Scripts awaiting responses:";
    unread.appendChild(appendH3);

    var number = "";
    number += document.URL.charAt(32);
    number += document.URL.charAt(33);
    number += document.URL.charAt(34);
    number += document.URL.charAt(35);
    document.querySelector('#user-discussions-on-scripts-written').children[0].children[0].innerHTML = "Discussions already responded to: " + "<a href=\"/en/forum/discussions/feed.rss?script_author=" + number + "\"><img src=\"/assets/feed-icon-14x14-ea341336588040dc7046d3423511d63d.png\"; alt=\"RSS Feed\" rel=\"nofollow\"></a>"


    for (var j = 0; j < document.getElementsByClassName("discussion-list")[0].children.length; j++) {
        if (typeof document.getElementsByClassName("discussion-list")[0].children[j].getElementsByTagName("a")[3] != 'undefined' && document.getElementsByClassName("discussion-list")[0].children[j].getElementsByTagName("a")[3] != 'null') {
            if (document.getElementsByClassName("discussion-list")[0].children[j].getElementsByTagName("a")[3].innerHTML != Creator) {
                unread.children[2].appendChild(appendUl).innerHTML += document.getElementsByClassName("discussion-list")[0].children[j].outerHTML;
                document.getElementsByClassName("discussion-list")[0].children[j].parentNode.removeChild(document.getElementsByClassName("discussion-list")[0].children[j]);
            };
        } else if (typeof document.getElementsByClassName("discussion-list")[0].children[j].getElementsByTagName("a")[3] == 'undefined' || document.getElementsByClassName("discussion-list")[0].children[j].getElementsByTagName("a")[3] == 'null') {
            unread.children[2].appendChild(appendUl).innerHTML += document.getElementsByClassName("discussion-list")[0].children[j].outerHTML;
            document.getElementsByClassName("discussion-list")[0].children[j].parentNode.removeChild(document.getElementsByClassName("discussion-list")[0].children[j]);
        };
    };

    if (typeof unread.children[2].children[0] == 'undefined' || unread.children[2].children[0] == 'null') {
        unread.children[2].appendChild(appendUl).innerHTML = "None!"
    };
};