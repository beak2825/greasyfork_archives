// ==UserScript==
// @name        WaniKani: I Don't know button
// @namespace   wk-wakaran
// @version     1.2
// @author Niklas Barsk
// @description Adds an "I don't know the answer" button to reviews. When clicked it will submit an incorrect answer.
// @include     https://www.wanikani.com/subjects/review*
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/7576/WaniKani%3A%20I%20Don%27t%20know%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/7576/WaniKani%3A%20I%20Don%27t%20know%20button.meta.js
// ==/UserScript==

function onDontKnowClick(e) {
    if (isMeaning()) {
        document.getElementById("user-response").value="Aargh! What does that even mean? (╯°□°)╯︵ ┻━┻";
    }
    else {
        document.getElementById("user-response").value="さっぱりわからない";
    }
}

function isMeaning() {
    return document.querySelector(".quiz-input__question-type-container").getAttribute("data-question-type") == "meaning";
}

function addDontKnowButton() {
    var dontKnowButton = document.createElement("b");
    dontKnowButton.innerHTML = "?";
    dontKnowButton.setAttribute("style", "margin-left: 0.5em");
    dontKnowButton.onclick = onDontKnowClick;
    var form = document.querySelector(".quiz-input__input-container form");
    form.getElementsByTagName("button")[0].appendChild(dontKnowButton);
}

addDontKnowButton();
