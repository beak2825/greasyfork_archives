// ==UserScript==
// @name         Neopets: Improve Page Titles
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.0.1
// @description  Removes "Neopets - " from the start of a tab/window's title and renames a few titles
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @homepage     https://github.com/saahphire/NeopetsUserscripts
// @match        *://*.neopets.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/548345/Neopets%3A%20Improve%20Page%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/548345/Neopets%3A%20Improve%20Page%20Titles.meta.js
// ==/UserScript==

/*
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•
.............................................................................................
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
    This script does the following:
    1. Removes the prefix "Neopets - " from each page title (the tab/window's name)
    2. Renames a page title in a board to its board's name and the current page
    3. Renames a page title in a topic to its topic's name and the current page
    4. Renames the guild board to "<Name of your guild> Chat"
    5. Renames your Shop Wizard title to "SW - Item Name"
    6. Adds the pet's name to the title when editing its petpage or petlookup
    ✦ ⌇ saahphire
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
.............................................................................................
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•
*/

/**
* Writes a string with the current page and the progress in the current board or topic
* @returns {string} A string in the format " [current/total]", or an empty string if there's only one page
*/
const getPages = () => {
    const activePage = document.getElementsByClassName("boardPageButton-active");
    if (!activePage || activePage.length == 0) return '';
    const currentPage = activePage[0].textContent;
    const pages = document.getElementsByClassName("boardPageButton");
    const lastPage = pages[pages.length - 2].textContent;
    const pageNumber = (isNaN(lastPage) || parseInt(lastPage) < parseInt(currentPage)) ? currentPage : lastPage;
    return ` [${currentPage}/${pageNumber}]`;
}

/**
* @returns {string} A string in the format "Topic name [currentpage/totalpages]", or "Topic name" if there's only one page
*/
const getTopicTitle = () => document.getElementsByTagName("h1")[0].textContent.replace(/Topic:\s+/, "").trim() + getPages();

/**
* @returns {string} A string in the format "Board name [currentpage/totalpages]", or "Topic name" if there's only one page
*/
const getBoardTitle = () => document.getElementsByTagName("h1")[0].textContent + getPages();

/**
* Checks whether there's an active search and renames the title if there is
* @param interval {number} The interval's identifier
*/
const renameSW = (interval) => {
    if(document.getElementsByClassName("wizard-results-text").length === 0) return;
    window.clearInterval(interval);
    document.title = `SW: ${document.getElementsByClassName("wizard-results-text")[0].getElementsByTagName("H3")[0].textContent}`;
}

/**
* @param identifier {string} A string that should be inside the current window's url
* @returns {boolean} Whether the current url includes the given identifier
*/
const isUrl = (identifier) => window.location.href.includes(identifier);

/**
* @returns {string} The new title for this page
*/
const getTitle = () => {
    if(isUrl('neoboards/topic.phtml?topic=')) return getTopicTitle();
    if(isUrl('neoboards/boardlist.phtml?')) return getBoardTitle();
    if(isUrl('guilds/guild_board.phtml?')) return document.querySelector(".contentHeader").innerText + " Chat";
    if(isUrl('editpage.phtml?pet_name=')) return `Edit ${window.location.href.match(/.+=(\w+)$/)[1]}'s Page`;
    if(isUrl('neopet_desc.phtml?edit_petname=')) return `Give ${window.location.href.match(/.+=(\w+)$/)[1]} a personality!`;
    return document.title.replace('Neopets - ', '');
}

(function() {
    'use strict';
    document.title = getTitle();
    if(isUrl('shops/wizard.phtml')) {
        const interval = setInterval(() => renameSW(interval), 200);
    }
})();
