// ==UserScript==
// @name         SweClockers JavaScript sidladdare
// @namespace    hAPsdWxok4bTePK8JZdG
// @author       LemonIllusion
// @version      2.0.2
// @match        https://www.sweclockers.com/forum/trad/*
// @match        https://www.sweclockers.com/forum/post/*
// @description  Lägger till en knapp som läser in kommande inlägg utan uppdatering av sidan.
// @downloadURL https://update.greasyfork.org/scripts/9915/SweClockers%20JavaScript%20sidladdare.user.js
// @updateURL https://update.greasyfork.org/scripts/9915/SweClockers%20JavaScript%20sidladdare.meta.js
// ==/UserScript==

function getDocument(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function() {
        callback(xhr.responseXML)
    });
    xhr.open("GET", url);
    xhr.responseType = "document";
    xhr.send();
}

let nextURL, canLoad = false;

HTMLDocument.prototype.hasNextPage = function() {
    return this.getElementsByClassName("next-page").length !== 0
};

HTMLDocument.prototype.getNextPageURL = function() {
    return this.getElementsByClassName("next-page")[0].href
};

HTMLDocument.prototype.prepareNextPage = function() {
    if (this.hasNextPage()) {
        nextURL = this.getNextPageURL();
        nextButton.setText("Ladda fler inlägg");
        nextButton.classList.add("clickable");
        canLoad = true;
    } else {
        nextButton.setText("Det finns inga fler inlägg att ladda");
    }
}

HTMLDocument.prototype.importPosts = function() {
    let forumPosts = this.getElementsByClassName("forumPosts")[0];
    nextButton.parentNode.insertBefore(forumPosts, nextButton);
    for (let script of forumPosts.getElementsByTagName("script")) {
        new Function(script.text)();
    }
}

let defaultNextButtons = document.getElementsByClassName("next-page");
let isCurrentPage = Array.from(document.getElementsByClassName("isCurrent")); // för HTMLCollections är dynamiska och loopar idiotiskt med for of

function loadNext() {
    if (canLoad) {
        canLoad = false;
        this.classList.remove("clickable");
        this.setText("Laddar...");
        getDocument(nextURL, function(doc) {
            doc.importPosts();
            doc.prepareNextPage();
            for (let button of defaultNextButtons) {
                button.href = nextURL;
            }
            for (let page of isCurrentPage) {
                page.classList.remove("isCurrent");
                isCurrentPage = [];
            }
        });
    }
}

{
    let style = document.createElement('style');
    document.head.appendChild(style);
    style.sheet.insertRule(".forumPosts {margin-bottom: 8px;}");
    style.sheet.insertRule(".nextButton {margin-bottom: 16px; text-align: center;}");
    style.sheet.insertRule(".nextButton.clickable {cursor: pointer}");
}

let nextButton = document.createElement("div");
nextButton.className = "forumPost nextButton";
nextButton.innerHTML = '<div class="postHeader table"><div class="row"><div class="cell">Förbereder...</div></div></div>';
nextButton.setText = function(text) {
    this.getElementsByClassName("cell")[0].innerHTML = text
};
nextButton.addEventListener("click", loadNext);
{
    let forumControls = document.getElementsByClassName("forumControls")[1];
    forumControls.parentNode.insertBefore(nextButton, forumControls);
}

document.prepareNextPage();