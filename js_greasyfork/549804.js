// ==UserScript==
// @name         Streamer Pings
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Play ping sound when logged-in user is mentioned in chat
// @author       You
// @match        https://fishtank.live/*
// @match        https://www.fishtank.live/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549804/Streamer%20Pings.user.js
// @updateURL https://update.greasyfork.org/scripts/549804/Streamer%20Pings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Streamer Pings] Plugin initialized');

    const PING_SOUND_URL = 'https://cdn.fishtank.live/sounds/mention.mp3';
    let currentUserName = null;
    let processedMessages = new Set(); // Track which messages we've already processed

    // Get the logged-in username
    function getLoggedInUsername() {
        const userElement = document.querySelector('.top-bar-user_display-name__bzlpw') ||
                           document.querySelector('.top-bar_username__nJaN2') ||
                           document.querySelector('[class*="display-name"]');
        return userElement ? userElement.textContent.trim() : null;
    }

    // Play the ping sound
    function playPingSound() {
        try {
            const audio = new Audio(PING_SOUND_URL);
            audio.volume = 0.7; // Adjust volume as needed
            audio.play().catch(error => {
                console.log('[Streamer Pings] Error playing sound:', error);
            });
            console.log('[Streamer Pings] Playing ping sound for mention');
        } catch (error) {
            console.error('[Streamer Pings] Failed to create audio:', error);
        }
    }

    // Generate a unique ID for a message based on its content and timestamp
    function getMessageId(messageElement) {
        const messageText = messageElement.querySelector('.chat-message-default_body__iFlH4')?.textContent || '';
        const username = messageElement.querySelector('.chat-message-default_user__uVNvH')?.textContent || '';
        const timestamp = messageElement.querySelector('.chat-message-default_timestamp__YpVpB')?.textContent || '';

        // Create a unique identifier combining username, message content, and timestamp
        return `${username}-${messageText.substring(0, 50)}-${timestamp}`;
    }

    // Check if a message mentions the current user
    function messageContainsPing(messageText, username) {
        if (!messageText || !username) return false;

        // Convert to lowercase for case-insensitive matching
        const lowerMessage = messageText.toLowerCase();
        const lowerUsername = username.toLowerCase();

        // Check for exact username match (word boundaries to avoid partial matches)
        const usernameRegex = new RegExp(`\\b${lowerUsername.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        return usernameRegex.test(messageText);
    }

    // Check for new messages that mention the user
    function checkForPings() {
        const username = getLoggedInUsername();
        if (!username) return;

        // Update current username if it changed
        if (currentUserName !== username) {
            currentUserName = username;
            console.log('[Streamer Pings] Logged in user detected:', currentUserName);
        }

        // Get all chat messages
        const messages = document.querySelectorAll('.chat-message-default_chat-message-default__JtJQL');

        messages.forEach(message => {
            const messageId = getMessageId(message);

            // Skip if we've already processed this message
            if (processedMessages.has(messageId)) return;

            // Mark this message as processed
            processedMessages.add(messageId);

            // Get the message text
            const messageTextElement = message.querySelector('.chat-message-default_body__iFlH4');
            const messageAuthor = message.querySelector('.chat-message-default_user__uVNvH');

            if (!messageTextElement || !messageAuthor) return;

            const messageText = messageTextElement.textContent;
            const author = messageAuthor.textContent.trim();

            // Don't ping for our own messages
            if (author === currentUserName) return;

            // Check if this message mentions the current user
            if (messageContainsPing(messageText, currentUserName)) {
                console.log('[Streamer Pings] User mentioned in message by', author, ':', messageText);
                playPingSound();
            }
        });

        // Clean up old processed messages to prevent memory buildup
        // Keep only the last 1000 message IDs
        if (processedMessages.size > 1000) {
            const messagesArray = Array.from(processedMessages);
            const toKeep = messagesArray.slice(-500); // Keep last 500
            processedMessages.clear();
            toKeep.forEach(id => processedMessages.add(id));
        }
    }

    // Start monitoring for pings
    function startPingMonitoring() {
        // Check every 500ms for new messages
        setInterval(checkForPings, 500);
        console.log('[Streamer Pings] Ping monitoring started');
    }

    // Wait for the page to load then start monitoring
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startPingMonitoring);
    } else {
        startPingMonitoring();
    }

    // Also start after a short delay to ensure everything is loaded
    setTimeout(startPingMonitoring, 2000);

})();