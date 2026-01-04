// ==UserScript==
// @name         RTV Hide Users
// @description  Hide specified user comments on RTVSLO portal
// @match        https://www.rtvslo.si/*
// @version      1.0
// @grant        none
// @namespace https://greasyfork.org/users/864537
// @downloadURL https://update.greasyfork.org/scripts/557076/RTV%20Hide%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/557076/RTV%20Hide%20Users.meta.js
// ==/UserScript==

(function () {
    // Add usernames here (case-sensitive)
    const blockedUsers = [
        "Iukace5"
    ];

    function hideBlocked() {
        const comments = document.querySelectorAll('.comment, .comment-container');

        comments.forEach(comment => {
            const userEl = comment.querySelector('.profile-name');
            if (!userEl) return;

            const username = userEl.textContent.trim();

            if (blockedUsers.includes(username)) {
                comment.style.display = "none";
            }
        });
    }

    // Run initially
    hideBlocked();

    // Observe dynamic comment loading
    const observer = new MutationObserver(hideBlocked);
    observer.observe(document.body, { childList: true, subtree: true });
})();