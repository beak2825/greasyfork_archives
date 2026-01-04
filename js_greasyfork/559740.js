// ==UserScript==
// @name         Kemono.cr Attachment Link Manager
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Fetch and manage attachment links on Kemono.cr posts with filter support
// @author       viatana35
// @license      GNUGPLV3
// @match        https://kemono.cr/patreon/user/*/post/*
// @grant        GM_download
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/559740/Kemonocr%20Attachment%20Link%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/559740/Kemonocr%20Attachment%20Link%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Storage keys
    const STORAGE_KEY = 'kemono_attachment_links';
    const BANNED_WORDS_KEY = 'kemono_banned_words';

    // Function to fetch all attachment links on the page, filtered by banned words
    function fetchAttachmentLinks() {
        const links = [];
        const bannedWords = JSON.parse(localStorage.getItem(BANNED_WORDS_KEY) || '[]');
        const attachmentElements = document.querySelectorAll('ul.post__attachments li.post__attachment a.post__attachment-link');

        if (attachmentElements.length === 0) {
            alert('No attachment links found on this page.');
            return links;
        }

        attachmentElements.forEach(element => {
            const href = element.getAttribute('href');
            const text = element.textContent.toLowerCase();
            if (href) {
                let isBanned = false;
                bannedWords.forEach(word => {
                    if (text.includes(word.toLowerCase())) {
                        isBanned = true;
                    }
                });
                if (!isBanned) {
                    links.push(href);
                }
            }
        });
        return links;
    }

    // Function to save links to localStorage
    function saveLinksToStorage(links) {
        const existingLinks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const newLinks = links.filter(link => !existingLinks.includes(link));
        if (newLinks.length > 0) {
            const updatedLinks = [...existingLinks, ...newLinks];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLinks));
        }
    }

    // Function to get the number of stored links
    function getStoredLinksCount() {
        const links = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        return links.length;
    }

    // Function to download links as a text file
    function downloadLinksAsText() {
        const links = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if (links.length === 0) {
            alert('No links to download.');
            return;
        }
        const blob = new Blob([links.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        GM_download({
            url: url,
            name: 'kemono_attachment_links.txt',
            saveAs: true
        });
    }

    // Function to remove current page links from localStorage
    function removeCurrentPageLinks() {
        const currentLinks = fetchAttachmentLinks();
        const storedLinks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const updatedLinks = storedLinks.filter(link => !currentLinks.includes(link));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLinks));
        alert('Current page links removed from storage.');
    }

    // Function to remove all links from localStorage
    function removeAllLinks() {
        if (confirm('Are you sure you want to delete all links?')) {
            localStorage.removeItem(STORAGE_KEY);
            alert('All links removed from storage.');
        }
    }

    // Function to add a banned word
    function addBannedWord() {
        const wordInput = document.getElementById('bannedWordInput');
        const word = wordInput.value.trim();
        if (word === '') {
            alert('Please enter a word to ban.');
            return;
        }
        const bannedWords = JSON.parse(localStorage.getItem(BANNED_WORDS_KEY) || '[]');
        if (!bannedWords.includes(word)) {
            bannedWords.push(word);
            localStorage.setItem(BANNED_WORDS_KEY, JSON.stringify(bannedWords));
            wordInput.value = '';
            updateBannedWordsDropdown();
        }
    }

    // Function to remove a banned word
    function removeBannedWord(word) {
        const bannedWords = JSON.parse(localStorage.getItem(BANNED_WORDS_KEY) || '[]');
        const updatedWords = bannedWords.filter(w => w !== word);
        localStorage.setItem(BANNED_WORDS_KEY, JSON.stringify(updatedWords));
        updateBannedWordsDropdown();
    }

    // Function to clear all banned words
    function clearAllBannedWords() {
        if (confirm('Are you sure you want to clear all banned words?')) {
            localStorage.removeItem(BANNED_WORDS_KEY);
            updateBannedWordsDropdown();
        }
    }

    // Function to update the banned words dropdown
    function updateBannedWordsDropdown() {
        const dropdown = document.getElementById('bannedWordsDropdown');
        dropdown.innerHTML = '';
        const bannedWords = JSON.parse(localStorage.getItem(BANNED_WORDS_KEY) || '[]');

        if (bannedWords.length === 0) {
            dropdown.innerHTML = '<div style="padding: 5px;">No banned words.</div>';
            return;
        }

        const clearAllButton = document.createElement('button');
        clearAllButton.textContent = 'Clear All';
        clearAllButton.style.marginBottom = '5px';
        clearAllButton.addEventListener('click', clearAllBannedWords);
        dropdown.appendChild(clearAllButton);

        bannedWords.forEach(word => {
            const wordDiv = document.createElement('div');
            wordDiv.style.display = 'flex';
            wordDiv.style.justifyContent = 'space-between';
            wordDiv.style.padding = '5px';

            const wordSpan = document.createElement('span');
            wordSpan.textContent = word;
            wordSpan.style.color = 'black';

            const removeButton = document.createElement('button');
            removeButton.textContent = '✕';
            removeButton.style.marginLeft = '5px';
            removeButton.addEventListener('click', () => removeBannedWord(word));

            wordDiv.appendChild(wordSpan);
            wordDiv.appendChild(removeButton);
            dropdown.appendChild(wordDiv);
        });
    }

    // Function to create the control panel
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.right = '10px';
        panel.style.zIndex = '9999';
        panel.style.backgroundColor = '#f0f0f0';
        panel.style.padding = '10px';
        panel.style.borderRadius = '5px';
        panel.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        // Download button
        const downloadButton = document.createElement('button');
        downloadButton.textContent = `Download List (${getStoredLinksCount()})`;
        downloadButton.style.marginRight = '10px';
        downloadButton.addEventListener('click', downloadLinksAsText);

        // Delete current links button
        const removeCurrentButton = document.createElement('button');
        removeCurrentButton.textContent = 'Delete Current Links';
        removeCurrentButton.style.marginRight = '10px';
        removeCurrentButton.addEventListener('click', removeCurrentPageLinks);

        // Delete all button
        const removeAllButton = document.createElement('button');
        removeAllButton.textContent = 'Delete All';
        removeAllButton.style.marginRight = '10px';
        removeAllButton.addEventListener('click', removeAllLinks);

        // Filter input and button
        const filterDiv = document.createElement('div');
        filterDiv.style.marginTop = '10px';

        const wordInput = document.createElement('input');
        wordInput.type = 'text';
        wordInput.id = 'bannedWordInput';
        wordInput.placeholder = 'Enter word to ban';
        wordInput.style.marginRight = '5px';

        const addWordButton = document.createElement('button');
        addWordButton.textContent = 'Add';
        addWordButton.addEventListener('click', addBannedWord);

        filterDiv.appendChild(wordInput);
        filterDiv.appendChild(addWordButton);

        // Show banned words button
        const showBannedWordsButton = document.createElement('button');
        showBannedWordsButton.textContent = 'Show Banned Words';
        showBannedWordsButton.style.marginTop = '5px';
        showBannedWordsButton.addEventListener('click', () => {
            const dropdown = document.getElementById('bannedWordsDropdown');
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });

        // Banned words dropdown
        const bannedWordsDropdown = document.createElement('div');
        bannedWordsDropdown.id = 'bannedWordsDropdown';
        bannedWordsDropdown.style.display = 'none';
        bannedWordsDropdown.style.position = 'absolute';
        bannedWordsDropdown.style.right = '0';
        bannedWordsDropdown.style.top = '100%';
        bannedWordsDropdown.style.backgroundColor = '#fff';
        bannedWordsDropdown.style.border = '1px solid #ccc';
        bannedWordsDropdown.style.padding = '5px';
        bannedWordsDropdown.style.borderRadius = '5px';
        bannedWordsDropdown.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        bannedWordsDropdown.style.zIndex = '10000';
        bannedWordsDropdown.style.width = '200px';

        panel.appendChild(downloadButton);
        panel.appendChild(removeCurrentButton);
        panel.appendChild(removeAllButton);
        panel.appendChild(filterDiv);
        panel.appendChild(showBannedWordsButton);
        panel.appendChild(bannedWordsDropdown);

        document.body.appendChild(panel);
        updateBannedWordsDropdown();
    }

    // Main function to run on page load
    function main() {
        console.log('Kemono.cr Attachment Link Manager script running...');
        const links = fetchAttachmentLinks();
        if (links.length > 0) {
            saveLinksToStorage(links);
        }
        createControlPanel();
    }

    // Wait for the page to load
    window.addEventListener('load', function() {
        const checkExist = setInterval(function() {
            if (document.querySelector('a.header-link.home')) {
                clearInterval(checkExist);
                main();
            }
        }, 100);
    });
})();
