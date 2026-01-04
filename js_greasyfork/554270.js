// ==UserScript==
// @name         Neopets: Count Posts
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.0.0
// @description  Counts your posts since a reference post in a guild board or a topic
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @homepage     https://github.com/saahphire/NeopetsUserscripts
// @match        *://*.neopets.com/guilds/guild_board.phtml*
// @match        *://*.neopets.com/neoboards/topic.phtml?topic=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      The Unlicense
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/554270/Neopets%3A%20Count%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/554270/Neopets%3A%20Count%20Posts.meta.js
// ==/UserScript==

/*
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
........................................................................................................................
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
    This script does the following:
    - Adds a button under every board/guild post to start a counter
    - Counts how many posts you have made ever since that reference post (including it)
    
    Please note that you need to start a counter to start counting in that topic/guild. Storage sizes would be off the
    charts otherwise. After you click a start button, you need to go to each page to count your posts in that page.
    Basically the order is: find your reference > click in every page between that reference and now > see the count

    ✦ ⌇ saahphire
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
........................................................................................................................
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
*/

const getId = () => {
    const matches = window.location.href.match(/topic=(\d+)/);
    return matches ? matches[1] : -1;
}

const getPage = () => window.location.href.match(/next=(\d+)/) ? window.location.href.match(/next=(\d+)/)[1] : 1;

const getUsername = () => document.querySelector(".text-muted, .eventIcon ~ .user a").textContent;

const getGuildMessageId = (messageIds, index) => parseInt(messageIds[index].href.match(/message_id=(\d+)/)[1]);

const getBoardMessageId = (pageId, index) => parseInt(`${pageId}${index < 10 ? 0 : ''}${index}`);

const scrapeAnyPage = async (id, username, getIdFunction, query) => {
    const data = await GM.getValue(`msg-${id}`, []);
    document.querySelectorAll(query).forEach((author, index) => {
        if(author.textContent !== username) return;
        const messageId = getIdFunction(index);
        if(!data.find(m => m === messageId)) data.push(messageId);
    });
    GM.setValue(`msg-${id}`, data);
}

const scrapeGuildPage = async (id, username) => {
    const messageIds = [...document.querySelectorAll('td[align="left"]:not(.content) > a:has(font)')];
    const getId = index => getGuildMessageId(messageIds, index);
    scrapeAnyPage(id, username, getId, 'td[align="center"][valign="top"][width="100"] font b');
}

const scrapeBoardPage = async (id, username) => {
    const pageId = getPage();
    const getId = index => getBoardMessageId(pageId, index);
    scrapeAnyPage(id, username, getId, '.postAuthorName');
}

const scrapePage = async (id, username, isGuild) => {
    return isGuild ? scrapeGuildPage(id, username) : scrapeBoardPage(id, username);
}

const retrieveCount = async (id, reference) => {
    const messages = (await GM.getValue(`msg-${id}`)).sort((a, b) => a - b);
    const cutoff = messages.findIndex(m => m >= reference);
    if(cutoff === -1) return 0;
    const valid = messages.slice(cutoff);
    return valid.length;
}

const addElements = async (id, ref, isGuild) => {
    const currentCount = ref ? await retrieveCount(id, ref) : "Not Started";
    document.querySelectorAll('.boardPostByline, td[align="center"][valign="top"][width="100"]').forEach((parent, index) => {
        const button = document.createElement("button");
        button.role = button;
        button.textContent = "Set counter";
        button.addEventListener("click", async () => {
            const newReference = parseInt(isGuild ? parent.parentElement.nextElementSibling.querySelector('td[align="left"]:not(.content) > a:has(font)').href.match(/message_id=(\d+)/)[1] : `${getPage()}${index < 10 ? 0 : ''}${index}`);
            GM.setValue(`ref-${id}`, newReference);
            await scrapePage(id, getUsername(), isGuild);
            const newCount = await retrieveCount(id, newReference)
            document.querySelectorAll(".saah-counter").forEach(counter => counter.textContent = `Count: ${newCount}`);
        });
        parent.appendChild(button);
        parent.insertAdjacentHTML("beforeEnd", `<p class="saah-counter">Count: ${currentCount}</p>`);
    });
}

const init = async () => {
    const isGuild = window.location.href.match("guild");
    const id = isGuild ? 'guild' : getId();
    const reference = await GM.getValue(`ref-${id}`);
    addElements(id, reference, isGuild);
    if(reference) scrapePage(id, getUsername(), isGuild);
}

//         postLeft.insertAdjacentHTML(`<button class="saah-counter">Reset Counter (<span class="saah-current-count">${counter ?? 'Not Active'}</span>)</button>`);
(function() {
    'use strict';
    init();
})();
