// ==UserScript==
// @name         Discord Auto Reply
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Auto reply to messages in Discord with misspelled text
// @author       Your Name
// @match        https://discord.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550281/Discord%20Auto%20Reply.user.js
// @updateURL https://update.greasyfork.org/scripts/550281/Discord%20Auto%20Reply.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        .auto-reply-container {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: #2f3136;
            border: 1px solid #4f545c;
            border-radius: 5px;
            padding: 10px;
            z-index: 1000;
            width: 300px;
            display: block;
        }
        .auto-reply-container input, .auto-reply-container button, .auto-reply-container select, .auto-reply-container textarea {
            margin: 5px 0;
            padding: 5px;
            width: calc(100% - 10px);
            box-sizing: border-box;
        }
        .auto-reply-container button {
            background: #7289da;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .auto-reply-container button:hover {
            background: #5b6fbe;
        }
        .auto-reply-container .minimize {
            position: absolute;
            top: 5px;
            right: 5px;
            background: #4f545c;
            color: white;
            border: none;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
        .auto-reply-container .draggable {
            cursor: move;
        }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.className = 'auto-reply-container draggable';
    container.innerHTML = `
        <div class="minimize" onclick="this.parentElement.style.display='none'">-</div>
        <select id="replyType">
            <option value="channel">Channel</option>
            <option value="dm">DM</option>
        </select>
        <input type="text" id="idInput" placeholder="Enter Channel/User ID">
        <textarea id="messageInput" placeholder="Enter your message with misspells"></textarea>
        <button onclick="startAutoReply()">Auto Reply</button>
    `;
    document.body.appendChild(container);

    let isDragging = false;
    let offsetX, offsetY;

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - container.getBoundingClientRect().left;
        offsetY = e.clientY - container.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            container.style.left = `${e.clientX - offsetX}px`;
            container.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    function startAutoReply() {
        const replyType = document.getElementById('replyType').value;
        const id = document.getElementById('idInput').value;
        const message = document.getElementById('messageInput').value;

        if (!id || !message) {
            alert('Please fill in all fields.');
            return;
        }

        const interval = setInterval(() => {
            if (replyType === 'channel') {
                const channel = discordApp.selectors.getChannelById(id);
                if (channel) {
                    const lastMessage = channel.messages[channel.messages.length - 1];
                    if (lastMessage && lastMessage.author.id !== discordApp.user.id) {
                        discordApp.sendMessage(channel.id, message);
                    }
                }
            } else if (replyType === 'dm') {
                const user = discordApp.selectors.getUserById(id);
                if (user) {
                    const lastMessage = user.dmChannel.messages[user.dmChannel.messages.length - 1];
                    if (lastMessage && lastMessage.author.id !== discordApp.user.id) {
                        discordApp.sendMessage(user.dmChannel.id, message);
                    }
                }
            }
        }, 5000); // Check every 5 seconds

        container.style.display = 'none';
    }

    // Expose the startAutoReply function to the global scope
    window.startAutoReply = startAutoReply;
})();