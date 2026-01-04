// ==UserScript==
// @name         Get Pastebin Components
// @namespace    https://github.com/ApixCode/userscripts
// @version      1.1
// @description  Adds a button to Pastebin pages to extract and display the paste's components (title, author, content, etc.) in a convenient modal.
// @author       Kazuma
// @match        https://pastebin.com/*
// @exclude      https://pastebin.com/
// @exclude      https://pastebin.com/trends
// @exclude      https://pastebin.com/archive
// @exclude      https://pastebin.com/doc_*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pastebin.com
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/548328/Get%20Pastebin%20Components.user.js
// @updateURL https://update.greasyfork.org/scripts/548328/Get%20Pastebin%20Components.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
    GM_addStyle(`
        /* Style for our custom button */
        .get-components-btn {
            background-color: #0c709e;
            color: white;
            border: none;
            padding: 5px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-right: 15px;
            transition: background-color 0.2s;
        }
        .get-components-btn:hover {
            background-color: #0a587d;
        }

        /* Styles for the modal overlay and content box */
        .pb-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .pb-modal-content {
            background-color: #272822; /* Match Pastebin's dark theme */
            color: #f8f8f2;
            padding: 25px;
            border-radius: 8px;
            width: 80%;
            max-width: 900px;
            height: 85%;
            box-shadow: 0 5px 15px rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
        }
        .pb-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #555;
            padding-bottom: 15px;
            margin-bottom: 15px;
        }
        .pb-modal-header h2 {
            margin: 0;
            font-size: 20px;
        }
        .pb-modal-close-btn, .pb-modal-copy-btn {
            background: #555;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .pb-modal-close-btn:hover, .pb-modal-copy-btn:hover {
            background: #777;
        }
        .pb-modal-body {
            overflow-y: auto;
            flex-grow: 1;
        }
        .pb-modal-body h3 {
            margin-top: 15px;
            margin-bottom: 5px;
            color: #66d9ef; /* Syntax highlighting color for titles */
            border-bottom: 1px solid #444;
            padding-bottom: 3px;
        }
        .pb-modal-body pre {
            white-space: pre-wrap;
            word-wrap: break-word;
            background-color: #1e1e1e;
            padding: 10px;
            border-radius: 5px;
            font-size: 14px;
            max-height: 400px;
            overflow-y: auto;
        }
        .pb-modal-body p {
            margin: 5px 0;
        }
        .pb-modal-body strong {
            color: #a6e22e; /* Greenish for labels */
        }
    `);

    
    function getPasteData() {
        const pasteId = window.location.pathname.substring(1);

        const data = {
            title: document.querySelector('.info-top h2')?.textContent.trim() || 'N/A',
            author: document.querySelector('.info-bar .username a')?.textContent.trim() || 'Guest',
            date: document.querySelector('.info-bar .date span')?.getAttribute('title') || document.querySelector('.info-bar .date')?.textContent.trim() || 'N/A',
            syntax: document.querySelector('.info-bar .left a')?.textContent.trim() || 'N/A',
            views: document.querySelector('.info-bar .visits')?.textContent.trim().replace('views', '').trim() || 'N/A',
            pasteId: pasteId,
            url: window.location.href,
            rawUrl: `https://pastebin.com/raw/${pasteId}`,
            downloadUrl: `https://pastebin.com/dl/${pasteId}`,
            content: document.getElementById('paste_code')?.value || 'Could not find paste content.',
        };
        return data;
    }

    
    function showComponentsModal() {
        
        const data = getPasteData();

    
        if (document.querySelector('.pb-modal-overlay')) return;

        
        const overlay = document.createElement('div');
        overlay.className = 'pb-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'pb-modal-content';

        
        modal.innerHTML = `
            <div class="pb-modal-header">
                <h2>Paste Components</h2>
                <div>
                    <button class="pb-modal-copy-btn">Copy as JSON</button>
                    <button class="pb-modal-close-btn">&times; Close</button>
                </div>
            </div>
            <div class="pb-modal-body">
                <h3>Metadata</h3>
                <p><strong>Title:</strong> ${data.title}</p>
                <p><strong>Author:</strong> ${data.author}</p>
                <p><strong>Date:</strong> ${data.date}</p>
                <p><strong>Syntax:</strong> ${data.syntax}</p>
                <p><strong>Views:</strong> ${data.views}</p>
                <p><strong>Paste ID:</strong> ${data.pasteId}</p>
                <p><strong>Raw URL:</strong> <a href="${data.rawUrl}" target="_blank">${data.rawUrl}</a></p>

                <h3>Content</h3>
                <pre>${data.content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
            </div>
        `;

        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        
        const closeModal = () => document.body.removeChild(overlay);

        modal.querySelector('.pb-modal-close-btn').addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(); 
            }
        });

        const copyBtn = modal.querySelector('.pb-modal-copy-btn');
        copyBtn.addEventListener('click', () => {
            
            const jsonString = JSON.stringify(data, null, 2);
            GM_setClipboard(jsonString);

            
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy as JSON';
            }, 2000);
        });
    }

    
    function addButton() {
        const footer = document.querySelector('.post-footer-right');
        
        if (footer) {
            const getComponentsBtn = document.createElement('button');
            getComponentsBtn.textContent = 'Get Components';
            getComponentsBtn.className = 'get-components-btn';
            getComponentsBtn.addEventListener('click', showComponentsModal);

            footer.prepend(getComponentsBtn);
        }
    }

    
    addButton();

})();