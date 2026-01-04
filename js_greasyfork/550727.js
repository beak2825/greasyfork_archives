// ==UserScript==
// @name         Rule34Video Universal Link Extractor
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Dynamically finds the content container to work on all video list pages. Extracts links, auto-navigates, and lets you name the output .txt file.
// @author       BohemianCorporal
// @match        https://rule34video.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550727/Rule34Video%20Universal%20Link%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/550727/Rule34Video%20Universal%20Link%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let allLinks = new Set();
    let isAutoGrabbing = false;
    let observer;

    // --- Create the UI Panel ---
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.bottom = '20px';
    panel.style.right = '20px';
    panel.style.backgroundColor = '#2c2c2e';
    panel.style.color = '#fff';
    panel.style.border = '1px solid #555';
    panel.style.padding = '15px';
    panel.style.zIndex = '10000';
    panel.style.borderRadius = '8px';
    panel.style.fontFamily = 'Arial, sans-serif';
    panel.style.fontSize = '14px';
    panel.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    panel.style.width = '230px';

    const title = document.createElement('h3');
    title.textContent = 'Link Extractor';
    title.style.margin = '0 0 10px 0';
    title.style.textAlign = 'center';
    title.style.borderBottom = '1px solid #555';
    title.style.paddingBottom = '5px';

    const getLinksButton = document.createElement('button');
    getLinksButton.textContent = 'Get Links for Current Page';
    getLinksButton.style.cssText = 'display:block; width:100%; margin-bottom:8px; padding:8px; cursor:pointer;';

    const autoGrabButton = document.createElement('button');
    autoGrabButton.textContent = 'Start Auto-Grab';
    autoGrabButton.style.cssText = 'display:block; width:100%; margin-bottom:15px; padding:8px; cursor:pointer; background-color: #4CAF50; color: white; border: none;';

    const filenameLabel = document.createElement('label');
    filenameLabel.textContent = 'Download Filename:';
    filenameLabel.style.cssText = 'display: block; margin-bottom: 5px; font-weight: bold;';

    const filenameInput = document.createElement('input');
    filenameInput.type = 'text';
    filenameInput.placeholder = 'e.g., my_collection';
    filenameInput.style.cssText = 'display:block; box-sizing: border-box; width: 100%; padding: 6px; margin-bottom: 10px; background-color: #444; color: #fff; border: 1px solid #666; border-radius: 4px;';

    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download All Links (.txt)';
    downloadButton.style.cssText = 'display:block; width:100%; padding:8px; cursor:pointer;';

    const statusDisplay = document.createElement('div');
    statusDisplay.textContent = 'Status: Idle';
    statusDisplay.style.cssText = 'margin-top: 10px; text-align: center; font-style: italic;';

    const linkCountDisplay = document.createElement('div');
    linkCountDisplay.textContent = 'Collected Links: 0';
    linkCountDisplay.style.marginTop = '5px';
    linkCountDisplay.style.textAlign = 'center';

    panel.appendChild(title);
    panel.appendChild(getLinksButton);
    panel.appendChild(autoGrabButton);
    panel.appendChild(filenameLabel);
    panel.appendChild(filenameInput);
    panel.appendChild(downloadButton);
    panel.appendChild(statusDisplay);
    panel.appendChild(linkCountDisplay);
    document.body.appendChild(panel);

    // --- Core Functions ---

    function updateLinkCount() {
        linkCountDisplay.textContent = `Collected Links: ${allLinks.size}`;
    }

    function getLinksFromCurrentPage() {
        const linkElements = document.querySelectorAll('a.th.js-open-popup');
        let newLinksFound = 0;
        linkElements.forEach(link => {
            const href = link.href;
            if (href && !allLinks.has(href)) {
                allLinks.add(href);
                newLinksFound++;
            }
        });
        console.log(`Found ${newLinksFound} new links. Total unique links: ${allLinks.size}`);
        updateLinkCount();
    }

    function runAutoGrabSequence() {
        if (!isAutoGrabbing) return;

        statusDisplay.textContent = 'Status: Grabbing links...';
        getLinksFromCurrentPage();

        const nextButton = document.querySelector('div.item.pager.next > a');

        // If there's no next button, we're done.
        if (!nextButton) {
            console.log("No 'next' button found. Reached the last page.");
            statusDisplay.textContent = 'Status: Last page reached.';
            stopAutoGrab();
            return;
        }

        // ** DYNAMICALLY FIND THE CONTAINER ID **
        const targetContainerId = nextButton.getAttribute('data-block-id');
        const targetNode = document.getElementById(targetContainerId);

        if (!targetNode) {
            console.error(`Video container with ID "${targetContainerId}" not found. Stopping.`);
            alert(`Error: Could not find the video container to watch. Stopping auto-grab.`);
            stopAutoGrab();
            return;
        }

        console.log(`Watching container: #${targetContainerId}`);
        observer = new MutationObserver((mutationsList, obs) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    console.log("New content loaded.");
                    statusDisplay.textContent = 'Status: Page loaded.';
                    obs.disconnect(); // Stop observing until the next cycle
                    // Short delay to ensure scripts on the page have finished processing
                    setTimeout(runAutoGrabSequence, 500);
                    break;
                }
            }
        });

        // Start observing before we click the next button
        observer.observe(targetNode, { childList: true, subtree: true });

        // Click the next button to load the new content
        console.log("Navigating to the next page...");
        statusDisplay.textContent = 'Status: Going to next page...';
        nextButton.click();
    }

    function startAutoGrab() {
        isAutoGrabbing = true;
        autoGrabButton.textContent = 'Stop Auto-Grab';
        autoGrabButton.style.backgroundColor = '#f44336';
        statusDisplay.textContent = 'Status: Starting...';
        runAutoGrabSequence();
    }

    function stopAutoGrab() {
        isAutoGrabbing = false;
        if (observer) observer.disconnect();
        autoGrabButton.textContent = 'Start Auto-Grab';
        autoGrabButton.style.backgroundColor = '#4CAF50';
        statusDisplay.textContent = 'Status: Idle';
    }

    // --- Button Event Listeners ---

    getLinksButton.addEventListener('click', getLinksFromCurrentPage);

    autoGrabButton.addEventListener('click', () => {
        if (isAutoGrabbing) {
            stopAutoGrab();
        } else {
            startAutoGrab();
        }
    });

    downloadButton.addEventListener('click', () => {
        if (allLinks.size === 0) {
            alert('No links have been collected yet. Use "Get Links" or "Start Auto-Grab" first.');
            return;
        }

        let filename = filenameInput.value.trim();
        if (filename === '') {
            filename = `video_links_${new Date().toISOString().slice(0, 10)}`;
        }

        const sanitizedFilename = filename.replace(/[\/\\?%*:|"<>]/g, '_');
        const fileContent = Array.from(allLinks).join('\n');
        const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `${sanitizedFilename}.txt`;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(downloadLink.href);
    });

})();