// ==UserScript==
// @name         GC Prevent Moving Neggsweeper Field
// @namespace    https://www.grundos.cafe/userlookup/?user=hazr
// @version      1.1
// @description  Prevents the neggfield from repositioning between moves due to random events and game messages by placing it below the banner.
// @author       hazr
// @license      MIT
// @match        https://www.grundos.cafe/games/neggsweeper/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555392/GC%20Prevent%20Moving%20Neggsweeper%20Field.user.js
// @updateURL https://update.greasyfork.org/scripts/555392/GC%20Prevent%20Moving%20Neggsweeper%20Field.meta.js
// ==/UserScript==

const NEW_GRID_STYLE = `
#container
{
    grid-template-areas:
        "atop atop    aio"
        "top  top     aio"
        "side banner  aio"
        "side negg    aio"
        "side event   aio"
        "side content aio"
        "side footer  aio"
        !important;
}
@media only screen and (max-width: 992px)
{
    #container
    {
        grid-template-areas:
            "atop      "
            "top       "
            "banner    "
            "negg      "
            "event     "
            "content   "
            "footer    "
            "bottom-bar"
            !important;
    }
}
#page_negg
{
    grid-area: negg; min-width: 595px;
}
`;

new MutationObserver(function(mutations)
{
    const neggfield = document.getElementById("neggsweeper_grid");
    if (neggfield)
    {
        const container = document.getElementById("container");
        if (container)
        {
            const newStyle = document.createElement("style");
            newStyle.textContent = NEW_GRID_STYLE;
            document.head.appendChild(newStyle);

            const newDiv = document.createElement("div");
            newDiv.id = "page_negg";
            container.appendChild(newDiv);

            let gameStatus = document.getElementById("move");
            if (gameStatus || (gameStatus = document.getElementById("neggsweeper_status")))
            {
                newDiv.appendChild(gameStatus);
            }

            newDiv.appendChild(neggfield);

            this.disconnect();
        }
    }
}).observe(document, {childList: true, subtree: true});
