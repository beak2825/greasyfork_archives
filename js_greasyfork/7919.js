// License (WTFPL): http://www.wtfpl.net/

// ==UserScript==
// @name           Vimperator DuckDuckGo Tile Hints
// @version        0.1
// @description    Enables Vimperator to identify DuckDuckGo tiles (e.g. image or video tiles) as something that should be hinted.
// @license        WTFPL
// @namespace      https://greasyfork.org/en/users/8929-skoogit
// @include        https://duckduckgo.com/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/7919/Vimperator%20DuckDuckGo%20Tile%20Hints.user.js
// @updateURL https://update.greasyfork.org/scripts/7919/Vimperator%20DuckDuckGo%20Tile%20Hints.meta.js
// ==/UserScript==

// Trigger function when content is inserted into the div that wraps around all tiles
document.getElementById('zero_click_wrapper').addEventListener("DOMNodeInserted", function()
{
    // Set a dummy onclick attribute to every tile
    // This enables Vimperator to identify the tiles as something that should be hinted
    var tiles = document.getElementsByClassName('tile');
    for (i=0; i < tiles.length; i++)
        tiles[i].setAttribute('onclick', 'javascript:void();');
});