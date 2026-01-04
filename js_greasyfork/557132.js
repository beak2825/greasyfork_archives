// ==UserScript==
// @name         FV - Necropost Warning (Forums)
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      1.4
// @description  Warn users if they are looking at old Furvilla threads.
// @author       necroam
// @match        https://www.furvilla.com/forums/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557132/FV%20-%20Necropost%20Warning%20%28Forums%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557132/FV%20-%20Necropost%20Warning%20%28Forums%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Conf
    const maxAgeInDays = 365;
    const necropostRulesLink = "https://www.furvilla.com/rules";
    const warningImage = "https://www.furvilla.com/img/items/1/1801-assorted-gears.png";
    // -------------------------------

    function parseCommentDate(dateString) {
        // Furvilla date format
        return new Date(dateString);
    }

    function insertWarningAfterLastComment(isOP) {
        const comments = document.querySelectorAll('.profanity-filter.thread-post');
        if (!comments.length) return;

        const last = comments[comments.length - 1];

        // Create warning container mimicking a Furvilla forum post
        const warningDiv = document.createElement('div');
        warningDiv.className = 'profanity-filter thread-post';

        // User info (fake user “Necropost Warning”)
        const userInfo = document.createElement('div');
        userInfo.className = 'thread-user-info';
        userInfo.style.background = 'none';
        userInfo.innerHTML = `
            <div class="avatar">
                <img src="${warningImage}" alt="Warning" style="width:100px; height:100px;">
            </div>
            <p><b>Necroposting Risk</b></p>
            <p><a href="${necropostRulesLink}" target="_blank" style="color:#d77da3; text-decoration:underline;">Site Rules</a></p>
        `;
        warningDiv.appendChild(userInfo);

        // Post content with OP note
        const postContent = document.createElement('div');
        postContent.className = 'thread-user-post';
        postContent.innerHTML = `

            <div class="thread-user-post-middle readable" style="color:inherit";><br>
                <b>This thread’s most recent post is over 365 days old.</b> Posting here may break necroposting forum rules.
                ${isOP ? "<br><br><br><b>Note:</b> Posts from the thread’s author are generally permitted." : ""}
            </div>
        `;
        warningDiv.appendChild(postContent);

        // Insert after last comment
        const referenceNode = last.nextElementSibling;
        if (referenceNode) {
            last.parentNode.insertBefore(warningDiv, referenceNode);
        } else {
            last.parentNode.appendChild(warningDiv);
        }
    }

    function checkLastComment() {
        const comments = document.querySelectorAll('.profanity-filter.thread-post');
        if (!comments.length) return;

        const lastComment = comments[comments.length - 1];

        // Date of last comment
        const dateElem = lastComment.querySelector('.thread-user-post-top a');
        if (!dateElem) return;
        const lastCommentDate = parseCommentDate(dateElem.textContent.trim());

        const now = new Date();
        const diffDays = (now - lastCommentDate) / (1000 * 60 * 60 * 24);

        if (diffDays <= maxAgeInDays) return; // recent enough, no warning

        const opUserElem = document.querySelector('.profanity-filter.thread-post .thread-user-info a');
        const currentUserElem = document.querySelector('#user-menu a');
        const currentUser = currentUserElem ? currentUserElem.textContent.trim() : "";
        const opUser = opUserElem ? opUserElem.textContent.trim() : "";
        const isOP = currentUser === opUser;

        insertWarningAfterLastComment(isOP);
    }

    window.addEventListener('load', checkLastComment);

})();
