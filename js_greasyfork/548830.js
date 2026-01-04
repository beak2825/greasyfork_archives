// ==UserScript==
// @name         Action Buttons Fix (modified, V2)
// @version      2025.10.24
// @description  This userscript fixes watch action buttons issue with third-party YT tools that puts this section in the side, along with browsers that are supported before 2018.
// @author       Joey_JTS (original author: xX_LegendCraftd_Xx)
// @icon         https://www.youtube.com/favicon.ico
// @namespace    https://greasyfork.org/en/users/933798
// @license      MIT
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/548830/Action%20Buttons%20Fix%20%28modified%2C%20V2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548830/Action%20Buttons%20Fix%20%28modified%2C%20V2%29.meta.js
// ==/UserScript==

const abtnconfig = {
    unsegmentLikeButton: false,
    noFlexibleItems: true
};

function updateBtns() {
    var watchFlexy = document.querySelector("ytd-watch-flexy");
    var results = watchFlexy.data.contents.twoColumnWatchNextResults.results.results.contents;

    for (var i = 0; i < results.length; i++) {
        if (results[i].videoPrimaryInfoRenderer) {
            var actions = results[i].videoPrimaryInfoRenderer.videoActions.menuRenderer;

            if (abtnconfig.unsegmentLikeButton) {
                if (actions.topLevelButtons[0].segmentedLikeDislikeButtonRenderer) {
                    var segmented = actions.topLevelButtons[0].segmentedLikeDislikeButtonRenderer;
                    actions.topLevelButtons.splice(0, 1);
                    actions.topLevelButtons.unshift(segmented.dislikeButton);
                    actions.topLevelButtons.unshift(segmented.likeButton);
                }
            }

            if (abtnconfig.noFlexibleItems) {
                for (var i = 0; i < actions.flexibleItems.length; i++) {
                    actions.topLevelButtons.push(actions.flexibleItems[i].menuFlexibleItemRenderer.topLevelButton);
                }

                delete actions.flexibleItems
            }
        }
    }

    var temp = watchFlexy.data;
    watchFlexy.data = {};
    watchFlexy.data = temp;
}

document.addEventListener("yt-page-data-updated", (e) => {
    if (e.detail.pageType == "watch") {
        updateBtns();
    }
});

(function() {
let css = `
/* Additional fixes */
#actions.ytd-watch-metadata {
min-width: auto !important
}

ytd-watch-metadata[action-buttons-update-owner-width] #actions.ytd-watch-metadata {
min-width: calc(50% - 6px) !important;
justify-content: flex-end !important
}

ytd-watch-metadata[action-buttons-update-owner-width] #owner.ytd-watch-metadata {
min-width: calc(50% - 6px) !important;
max-width: 100% !important;
margin-right: 12px !important
}

yt-button-view-model.ytd-menu-renderer .yt-spec-button-shape-next--size-m, ytd-download-button-renderer .yt-spec-button-shape-next--size-m, #loop-button > .yt-spec-button-shape-next--size-m {
margin-left: 8px !important
}

#flexible-item-buttons .ytd-menu-renderer, #top-level-buttons-computed yt-button-view-model.ytd-menu-renderer, ytd-download-button-renderer, ytd-button-renderer#loop-button {
margin-left: 0 !important
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();