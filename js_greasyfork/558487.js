// ==UserScript==
// @name         DGG Custom Message Filter
// @description  Blocks new chat messages based on a user-defined JavaScript function.
// @version      1.0.0
// @match        https://www.destiny.gg/embed/chat
// @grant        none
// @namespace    jojo259
// @downloadURL https://update.greasyfork.org/scripts/558487/DGG%20Custom%20Message%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/558487/DGG%20Custom%20Message%20Filter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function shouldBlockMessage(
        username, // lowercased
        text, // raw text
        sublevel, // 0-5 integer
        tagcolor, // tag color e.g. "blue"
        mentions, // lowercased array of user mentions
        hour, // integer 0-24 i think
        watchingsame // watching same stream boolean
    ) {
        // example: block Radiant messages with gamba emote
        if (username == "radiant" && text.includes("GAMBA")) {
            return true;
        }
    }

    // --- 🛠️ Message Interception Logic (Do Not Edit Below) 🛠️ ---

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                // Check if the node is an actual chat message container 💬
                if (!(node instanceof HTMLElement) || !node.matches('.msg-chat')) return;

                const messageElement = node;

                // Get raw data attributes ⚙️
                const username = messageElement.dataset.username;
                const dataMentioned = messageElement.dataset.mentioned;
                const mentionedUsers = dataMentioned ? dataMentioned.split(' ').map(user => user.toLowerCase()) : [];

                // Get subscription level 🌟
                const flairElement = messageElement.querySelector('.flair.subscriber');
                let subscriberLevel = 0;
                if (flairElement) {
                    const title = flairElement.getAttribute('title');
                    const match = title.match(/Tier (\d+)/);
                    subscriberLevel = match ? parseInt(match[1], 5) : 1; // Default to 1 if it's just 'Subscriber'
                }

                // Get tag color 🌈
                const tagColorMatch = messageElement.className.match(/msg-tagged-(.+?)(?:\s|$)/);
                const tagColor = tagColorMatch ? tagColorMatch[1] : null;

                // Get watching-same state 👀
                const watchingSame = messageElement.classList.contains('watching-same');

                // Get message text and clean it 🧼
                const msgTextNode = messageElement.querySelector('.text');
                let messageText = '';
                if (msgTextNode) {
                    // Extract text content, replacing emotes and user tags with their text value
                    // This is complex because we need the *raw* text for the filter function
                    messageText = Array.from(msgTextNode.childNodes)
                        .map(child => {
                            if (child.nodeType === 3) return child.nodeValue; // Text node
                            if (child.matches && (child.matches('.chat-user') || child.matches('.emote'))) {
                                return child.textContent; // User tag or Emote text
                            }
                            return ''; // Ignore other elements like <br> or hidden HTML
                        })
                        .join('')
                        .trim()
                        .replace(/\s+/g, ' '); // Normalize internal whitespace

                }

                // Get time hour ⏰
                const timeElement = messageElement.querySelector('.time');
                const unixTimestamp = timeElement ? parseInt(timeElement.dataset.unixtimestamp, 10) : Date.now();
                const timeHour = new Date(unixTimestamp).getUTCHours(); // Use UTC hour for consistency with DGG timestamps


                // Execute the custom filter function! 🚀
                const params = {
                    username,
                    messageText,
                    subscriberLevel,
                    tagColor,
                    mentionedUsers,
                    timeHour,
                    watchingSame
                };

                try {
                    if (shouldBlockMessage(username, messageText, subscriberLevel, tagColor, mentionedUsers, timeHour, watchingSame)) {
                        // If the function returns true, remove the message! 👋
                        messageElement.remove();
                    }
                } catch (e) {
                    console.error('DGG Custom Message Filter: Error executing shouldBlockMessage', e, params);
                    // Fail safe: if the function errors, assume we should NOT block the message
                }
            });
        });
    });

    // Start observing the chat lines container 🔭
    observer.observe(document.querySelector('#chat-lines') || document.body, {
        childList: true,
        subtree: true
    });
})();