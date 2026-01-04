// ==UserScript==
// @name YouTube Comment Thread CSS
// @namespace github.com/openstyles/stylus
// @version 0.0.1
// @description A new userstyle
// @author Me
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/561216/YouTube%20Comment%20Thread%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/561216/YouTube%20Comment%20Thread%20CSS.meta.js
// ==/UserScript==

(function() {
let css = `
    /* Insert code here... */
    ytd-comments#comments {
        ytd-comment-view-model[class][comment-threading-enabled] #author-thumbnail.ytd-comment-view-model {
            position: absolute;
            margin-left: 0;
            margin-right: 0;
            width: 26px;
            height: 26px;
            display: flex;
        }

        ytd-comment-view-model[class][comment-threading-enabled] #author-thumbnail.ytd-comment-view-model + * {
            margin-left: 36px;
        }

        ytd-comment-view-model[class][comment-threading-enabled] #author-thumbnail.ytd-comment-view-model * {
            max-height: 100%;
            max-width: 100%;
        }

        div.ytSubThreadThreadline[class] {
            position: absolute;
            display: none;
        }

        div.thread-hitbox.ytd-comment-thread-renderer[class] {
            position: absolute;
            width: 18px;
            border-left: 1px solid #3f3f3f;
            border-bottom: 1px solid #3f3f3f;
            border-radius: 0px 0 0 6px;
            margin-left: 12px;
            top: 32px;
            height: auto;
            bottom: 16px;
            box-sizing: border-box;
        }

        yt-sub-thread.ytSubThreadHost[class] {
            padding-left: 24px;
            box-sizing: border-box;
        }
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
