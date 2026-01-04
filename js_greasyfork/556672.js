// ==UserScript==
// @name         Novelfire – Hide Spoilers + Block User
// @namespace    https://novelfire.net/
// @version      4.0
// @license      MIT
// @description  Adds Violentmonkey menu toggles for hiding spoilers & blocking users
// @match        https://novelfire.net/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/556672/Novelfire%20%E2%80%93%20Hide%20Spoilers%20%2B%20Block%20User.user.js
// @updateURL https://update.greasyfork.org/scripts/556672/Novelfire%20%E2%80%93%20Hide%20Spoilers%20%2B%20Block%20User.meta.js
// ==/UserScript==


// You can Toggle both functions(Hide blocked Users And Hide spoiler tag comments) by clicking on the extension icon, then find this script and there should be 2 buttons under it to toggle both things
// Add Blocked Users as told 3 lines below

(function() {
    'use strict';
    //You can enter user-ids which can be taken from the url and you open anyone's profile. You can add multiple by using commas. User-ids but be inside quotes('')
    //Example:- const BLOCKED_USERS = [00000,123456,123123];
    const BLOCKED_USERS = [];

    const STORAGE_KEY_SPOILERS = "nf_hide_spoilers";
    const STORAGE_KEY_USERS = "nf_hide_blocked_users";

    let hideSpoilers = localStorage.getItem(STORAGE_KEY_SPOILERS) === "true";
    let hideUserComments = localStorage.getItem(STORAGE_KEY_USERS) === "true";

    //----------------------------------------------------------
    // REGISTER VIOLENTMONKEY BUTTONS
    //----------------------------------------------------------

    function registerMenu() {
        GM_registerMenuCommand(
            (hideSpoilers ? "✔ " : "✘ ") + "Hide Spoilers",
            () => {
                hideSpoilers = !hideSpoilers;
                localStorage.setItem(STORAGE_KEY_SPOILERS, hideSpoilers);
                alert("Hide Spoilers: " + hideSpoilers);
                runHideLogic();
            }
        );

        GM_registerMenuCommand(
            (hideUserComments ? "✔ " : "✘ ") + "Hide Blocked Users",
            () => {
                hideUserComments = !hideUserComments;
                localStorage.setItem(STORAGE_KEY_USERS, hideUserComments);
                alert("Hide Blocked Users: " + hideUserComments);
                runHideLogic();
            }
        );
    }

    registerMenu();

    //----------------------------------------------------------
    // HIDING LOGIC
    //----------------------------------------------------------

    function runHideLogic() {
        // Unhide everything first so toggles work both ways
        document.querySelectorAll('.comment-item[data-hidden-by-script="true"]').forEach(el => {
            el.style.display = '';
            delete el.dataset.hiddenByScript;
        });

        // Hide spoiler comments
        if (hideSpoilers) {
            document.querySelectorAll('.comment-text[data-spoiler="1"]').forEach(sp => {
                const item = sp.closest('.comment-item');
                if (item) {
                    item.style.display = "none";
                    item.dataset.hiddenByScript = "true";
                }
            });
        }

        // Hide comments from blocked users
        if (hideUserComments) {
            BLOCKED_USERS.forEach(userId => {
                document.querySelectorAll(`a[href="https://novelfire.net/user/${userId}"]`).forEach(link => {
                    const item = link.closest('.comment-item');
                    if (item) {
                        item.style.display = "none";
                        item.dataset.hiddenByScript = "true";
                    }
                });
            });
        }
    }

    runHideLogic();

    const observer = new MutationObserver(runHideLogic);
    observer.observe(document.body, { childList: true, subtree: true });

})();
