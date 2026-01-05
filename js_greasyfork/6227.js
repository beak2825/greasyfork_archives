// ==UserScript==
// @name         Qkam Login Details
// @namespace    https://qkam.dubizzle.com/qkam/
// @version      0.10
// @description  Getting Qkam user Mail
// @author       dubizzle
// @match        https://qkam.dubizzle.com/users/login/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/6227/Qkam%20Login%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/6227/Qkam%20Login%20Details.meta.js
// ==/UserScript==

if (!($ = window.jQuery)) { // typeof jQuery=='undefined' works too
    script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-1.11.0.min.js';
    script.onload = collectInformation;
    document.body.appendChild(script);
} else {
    collectInformation();
}

function collectInformation() {

	localStorage.clear();

    $('.auth .button').click(function() {
        var QkamData = {
            'email': $('#id_username').val(),
            'approve': 0,
            'delete': 0,
            'move:wow': 0,
            'move:quality': 0
        }
        localStorage.setItem("QkamCounter", JSON.stringify(QkamData));

    });
}