// ==UserScript==
// @name         Reddit - Auto Show Collapsed Comments
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Reddit - Auto Show First-Level Collapsed Comments/Replies. Reddit - 自动显示第一级的折叠评论
// @author       Martin______X
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557310/Reddit%20-%20Auto%20Show%20Collapsed%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/557310/Reddit%20-%20Auto%20Show%20Collapsed%20Comments.meta.js
// ==/UserScript==

const simpleClick = (async (button) => {
    button.click();
});
const moreCommentsInterval = setInterval(() => {
    try {
        let comments = document.querySelectorAll('shreddit-comment[thingid]');
        for (let i = 0; i < comments.length; i++) {
            let comment = comments[i];
            if (!comment.hasAttribute("banger")) {
                if (comment.hasAttribute("collapsed")) {
                    let button = comment.shadowRoot.querySelector("button");
                    if (button) {
                        simpleClick(button);
                    }
                }
                comment.setAttribute("banger", "");
            }
        }

        let tracker = document.querySelector('faceplate-tracker[noun="load_more_comments"]');
        if (tracker) {
            let button = tracker.querySelector("button");
            if (button) {
                simpleClick(button);
            }
        }
    } catch (error) {
        //console.error(error)
    }
}, 1);