// ==UserScript==
// @name         US Card Forum User Tag
// @namespace    https://www.uscardforum.com/
// @version      1.2
// @description  Tag users on US Card Forum with personal labels
// @author       Your Name
// @match        https://www.uscardforum.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555150/US%20Card%20Forum%20User%20Tag.user.js
// @updateURL https://update.greasyfork.org/scripts/555150/US%20Card%20Forum%20User%20Tag.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const STORAGE_KEY = 'uscardforum.user_tags.v1';
    const TAG_STYLE = 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 4px; padding: 2px 8px; margin-left: 8px; font-size: 11px; font-weight: 600; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.2); vertical-align: middle;';
    const BUTTON_STYLE = 'background: #667eea; color: white; border: none; border-radius: 4px; padding: 3px 8px; margin-left: 8px; cursor: pointer; font-size: 11px; transition: all 0.2s; vertical-align: middle;';

    // Storage functions
    function getTagMap() {
        const tagJsonStr = GM_getValue(STORAGE_KEY, '{}');
        return JSON.parse(tagJsonStr);
    }

    function saveTagMap(tagMap) {
        GM_setValue(STORAGE_KEY, JSON.stringify(tagMap));
    }

    function deleteTag(username) {
        const tagMap = getTagMap();
        delete tagMap[username];
        saveTagMap(tagMap);
    }

    // Create and display tag element
    function createTagElement(tagText) {
        const tagSpan = document.createElement('span');
        tagSpan.textContent = tagText;
        tagSpan.setAttribute('style', TAG_STYLE);
        tagSpan.className = 'user-custom-tag';
        return tagSpan;
    }

    // Create tag button
    function createTagButton(username, containerElement) {
        const tagMap = getTagMap();

        const button = document.createElement('button');
        button.textContent = '🏷️';
        button.className = 'tag-user-btn';
        button.setAttribute('style', BUTTON_STYLE);
        button.title = 'Tag this user';

        button.addEventListener('mouseenter', () => {
            button.style.background = '#5568d3';
        });
        button.addEventListener('mouseleave', () => {
            button.style.background = '#667eea';
        });

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const currentTag = tagMap[username] || '';
            const newTag = prompt(
                `Edit tag for user: ${username}\n\nEnter tags (comma-separated):\nExamples: "excellent debater", "helpful", "expert"`,
                currentTag
            );

            if (newTag !== null) {
                if (newTag.trim() === '') {
                    if (currentTag && confirm(`Remove all tags for ${username}?`)) {
                        deleteTag(username);
                        location.reload();
                    }
                } else {
                    tagMap[username] = newTag;
                    saveTagMap(tagMap);
                    location.reload();
                }
            }
        });

        return button;
    }

    // Add tags and button to a user element
    function processUserElement(userLink) {
        // Avoid processing twice
        if (userLink.hasAttribute('data-tag-processed')) {
            return;
        }
        userLink.setAttribute('data-tag-processed', 'true');

        // Skip if inside avatar elements
        if (userLink.closest('.post-avatar') || userLink.closest('.topic-avatar') || userLink.closest('.topic-poster') || userLink.closest('.topic-list-data')) {
            return;
        }

        const username = userLink.getAttribute('data-user-card') || userLink.textContent.trim();
        if (!username) return;

        const tagMap = getTagMap();
        const parentSpan = userLink.closest('.first.username') || userLink.parentElement;

        if (!parentSpan) return;

        // Add existing tags
        if (tagMap[username]) {
            const tags = tagMap[username].split(',').map(t => t.trim()).filter(t => t);
            tags.forEach(tag => {
                const tagElement = createTagElement(tag);
                parentSpan.appendChild(tagElement);
            });
        }

        // Add tag button
        const button = createTagButton(username, parentSpan);
        parentSpan.appendChild(button);
    }

    // Process all user links in posts
    function processPosts() {
        // Find all user links in post headers
        const userLinks = document.querySelectorAll('a[data-user-card][href^="/u/"]');
        userLinks.forEach(link => {
            processUserElement(link);
        });
    }

    // Process user profile page
    function processUserProfile() {
        // Profile page has different structure
        const profileHeader = document.querySelector('.user-profile-names .username');
        if (profileHeader && !profileHeader.hasAttribute('data-tag-processed')) {
            profileHeader.setAttribute('data-tag-processed', 'true');

            const username = profileHeader.textContent.trim();
            const tagMap = getTagMap();

            // Add tags
            if (tagMap[username]) {
                const tags = tagMap[username].split(',').map(t => t.trim()).filter(t => t);
                tags.forEach(tag => {
                    const tagElement = createTagElement(tag);
                    profileHeader.appendChild(tagElement);
                });
            }

            // Add button
            const button = createTagButton(username, profileHeader);
            profileHeader.appendChild(button);
        }
    }

    // Process user cards (popup when clicking username)
    function processUserCards() {
        const userCards = document.querySelectorAll('.user-card .names-link, .user-card .username');
        userCards.forEach(nameElement => {
            if (nameElement.hasAttribute('data-tag-processed')) return;
            nameElement.setAttribute('data-tag-processed', 'true');

            const username = nameElement.textContent.trim();
            const tagMap = getTagMap();

            // Add tags
            if (tagMap[username]) {
                const tags = tagMap[username].split(',').map(t => t.trim()).filter(t => t);
                tags.forEach(tag => {
                    const tagElement = createTagElement(tag);
                    nameElement.appendChild(tagElement);
                });
            }

            // Add button
            const button = createTagButton(username, nameElement);
            nameElement.appendChild(button);
        });
    }

    // Process topic lists
    function processTopicLists() {
        // Topic list poster names
        const posterLinks = document.querySelectorAll('.topic-list .posters a[data-user-card], .latest-topic-list-item a[data-user-card]');
        posterLinks.forEach(link => {
            if (link.hasAttribute('data-tag-processed')) return;
            link.setAttribute('data-tag-processed', 'true');

            const username = link.getAttribute('data-user-card') || link.getAttribute('title');
            if (!username) return;

            const tagMap = getTagMap();
            if (tagMap[username]) {
                const tags = tagMap[username].split(',').map(t => t.trim()).filter(t => t);
                tags.forEach(tag => {
                    const tagElement = createTagElement(tag);
                    tagElement.style.marginLeft = '4px';
                    link.parentElement.appendChild(tagElement);
                });
            }
        });
    }

    // Main processing function
    function processAll() {
        processPosts();
        processUserProfile();
        processUserCards();
        processTopicLists();
    }

    // Observer for dynamic content
    const observer = new MutationObserver((mutations) => {
        // Debounce to avoid excessive processing
        clearTimeout(window.tagProcessTimeout);
        window.tagProcessTimeout = setTimeout(() => {
            processAll();
        }, 100);
    });

    // Initialize
    function init() {
        console.log('US Card Forum User Tag script initialized');
        processAll();

        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('Found', document.querySelectorAll('a[data-user-card][href^="/u/"]').length, 'user links');
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();