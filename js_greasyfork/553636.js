// ==UserScript==
// @name         Action Buttons Fix (My Personalization)
// @version      1.0
// @description  Fixes watch action buttons issue with third-party YT tools, stable with MutationObserver.
// @author       original author: xX_LegendCraftd_Xx, + EterveNallo
// @icon         https://www.youtube.com/favicon.ico
// @namespace    https://greasyfork.org/en/users/933798
// @license      MIT
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553636/Action%20Buttons%20Fix%20%28My%20Personalization%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553636/Action%20Buttons%20Fix%20%28My%20Personalization%29.meta.js
// ==/UserScript==

const abtnconfig = {
    unsegmentLikeButton: false,
    noFlexibleItems: true
};

function updateBtns() {
    try {
        const watchFlexy = document.querySelector("ytd-watch-flexy");
        if (!watchFlexy?.data?.contents?.twoColumnWatchNextResults) return;

        const results = watchFlexy.data.contents.twoColumnWatchNextResults.results.results.contents;

        for (let i = 0; i < results.length; i++) {
            if (results[i].videoPrimaryInfoRenderer) {
                const actions = results[i].videoPrimaryInfoRenderer.videoActions.menuRenderer;

                if (abtnconfig.unsegmentLikeButton) {
                    if (actions.topLevelButtons[0].segmentedLikeDislikeButtonRenderer) {
                        const segmented = actions.topLevelButtons[0].segmentedLikeDislikeButtonRenderer;
                        actions.topLevelButtons.splice(0, 1);
                        actions.topLevelButtons.unshift(segmented.dislikeButton);
                        actions.topLevelButtons.unshift(segmented.likeButton);
                    }
                }

                if (abtnconfig.noFlexibleItems) {
                    for (let j = 0; j < actions.flexibleItems.length; j++) {
                        actions.topLevelButtons.push(
                            actions.flexibleItems[j].menuFlexibleItemRenderer.topLevelButton
                        );
                    }
                    delete actions.flexibleItems;
                }
            }
        }

        // Forzar actualización de Polymer
        const temp = watchFlexy.data;
        watchFlexy.data = {};
        watchFlexy.data = temp;

    } catch (err) {
        console.warn("Action Buttons Fix: error en updateBtns()", err);
    }
}

// ---- MutationObserver para estabilidad ----
function waitForFlexy(callback) {
    const observer = new MutationObserver(() => {
        const watchFlexy = document.querySelector("ytd-watch-flexy");
        if (watchFlexy?.data?.contents?.twoColumnWatchNextResults) {
            observer.disconnect();
            callback();
        }
    });
    observer.observe(document, { childList: true, subtree: true });
}

document.addEventListener("yt-page-data-updated", (e) => {
    if (e.detail.pageType === "watch") {
        waitForFlexy(updateBtns);
    }
});

// ---- Estilos CSS adicionales ----
(function() {
    const css = `
/* Additional fixes */
#actions.ytd-watch-metadata {
min-width: auto !important;
}
/*CENTRA TODOS LOS BOTONES DE UN VIDEO - Desactivado*/
/*#top-row.ytd-watch-metadata { justify-content: center !important; flex-direction: inherit !important }*/

/*CENTRA EL TITULO DE UN VIDEO*/
h1.style-scope.ytd-watch-metadata { justify-content: center !important; text-align: center !important }

/*Centra todos los botones*/
div#top-row.style-scope.ytd-watch-metadata { justify-content: center !important; flex-direction: inherit !important; display: flex !important }

/*Centro la etiqueta de doblado*/
ytd-badge-supported-renderer { display: flex !important; justify-content: center !important }

#flexible-item-buttons .ytd-menu-renderer, #top-level-buttons-computed yt-button-view-model.ytd-menu-renderer, ytd-download-button-renderer.style-scope.ytd-menu-renderer, ytd-button-renderer#loop-button {
margin-left: none !important
}`;
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        const styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }
})();
