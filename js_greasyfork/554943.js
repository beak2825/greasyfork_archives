// ==UserScript==
// @name         CodeHS Video Skipper
// @namespace    https://thetridentguy.com
// @version      1.0.1
// @description  Skips videos in CodeHS assignments.
// @author       TheTridentGuy
// @match        https://codehs.com/student/*/section/*/assignment/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codehs.com
// @run-at document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554943/CodeHS%20Video%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/554943/CodeHS%20Video%20Skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let done_button = document.getElementById("done-button");
    if(done_button){
        fetch("/lms/ajax/submit_assignment", {
            method: "POST",
            headers: {
                "X-Csrftoken": new RegExp(/(?<=csrftoken=)[a-zA-Z0-9]+/gm).exec(document.cookie)[0],
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: `student_assignment_id=${document.querySelector("[data-said].current").dataset.said}&method=submit_assignment`
        });
        done_button.click();
    }
})();