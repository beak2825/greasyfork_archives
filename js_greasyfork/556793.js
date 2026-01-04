// ==UserScript==
// @name         PractiScore Match Data Exporter (Greasemonkey/Firefox)
// @namespace    punctapracticaliberanda.example.com
// @version      1.0
// @description  Extracts matchDef and scores variables from PractiScore results pages and saves them as a ZIP file
// @match        https://practiscore.com/results/new/*
// @match        http://practiscore.com/results/new/*
// @grant        unsafeWindow
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/556793/PractiScore%20Match%20Data%20Exporter%20%28GreasemonkeyFirefox%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556793/PractiScore%20Match%20Data%20Exporter%20%28GreasemonkeyFirefox%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Extract the match ID from the URL
    function getMatchId() {
        const pathParts = window.location.pathname.split('/');
        const idIndex = pathParts.indexOf('new') + 1;
        return pathParts[idIndex] || 'unknown';
    }

    // Wait for the page to load and variables to be available
    function waitForVariables(callback, maxAttempts = 50) {
        let attempts = 0;
        const checkInterval = setInterval(() => {
            attempts++;
            if (unsafeWindow.matchDef && unsafeWindow.scores) {
                console.log('matchDef and scores found on this page.');
                clearInterval(checkInterval);
                callback();
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                let foundMatchDef = unsafeWindow.matchDef !== undefined;
                let foundScores = unsafeWindow.scores !== undefined;
                let errorMessage = `matchDef: ${foundMatchDef}, scores: ${foundScores}`;
                console.error(`matchDef or scores not found after waiting: ${errorMessage}`);
                alert(`Could not find matchDef or scores variables on this page: ${errorMessage}`);
            }
        }, 100);
    }

    // Create ZIP file blob from match data
    function createZipBlob() {
        return new Promise(function(resolve, reject) {
            try {
                const matchDef = unsafeWindow.matchDef;
                const scores = unsafeWindow.scores;
                const matchId = getMatchId();

                if(!matchDef) {
                    reject(new Error('matchDef not found on this page.'));
                    return;
                }

                if(!scores) {
                    reject(new Error('scores not found on this page.'));
                    return;
                }

                if(!matchId) {
                    reject(new Error('matchId not found on this page.'));
                    return;
                }

                // Create a new ZIP file
                const zip = new JSZip();
                zip.file('match_def.json', JSON.stringify(matchDef, null, 2));
                zip.file('scores.json', JSON.stringify(scores, null, 2));

                // Generate the ZIP file as a blob
                zip.generateAsync({ type: 'blob' }).then(function(blob) {
                    resolve({ blob: blob, filename: `${matchId}.zip` });
                }).catch(function(error) {
                    reject(error);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    // Create download button with anchor link
    function createDownloadButton() {
        // Check if button already exists
        if (document.getElementById('psa-download-link')) {
            return;
        }

        // Create ZIP blob first
        createZipBlob().then(function(result) {
            const blob = result.blob;
            const filename = result.filename;
            const blobUrl = URL.createObjectURL(blob);

            const linkStyle = `
                padding: 10px 20px;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                min-width: 150px;
                text-decoration: none;
                display: inline-block;
                text-align: center;
                position: fixed;
                bottom: 10px;
                right: 10px;
                z-index: 10000;
                background-color: #4CAF50;
            `;

            // Download link (left-click downloads, right-click allows Save As)
            const downloadLink = document.createElement('a');
            downloadLink.id = 'psa-download-link';
            downloadLink.textContent = 'Download';
            downloadLink.href = blobUrl;
            downloadLink.download = filename;
            downloadLink.style.cssText = linkStyle;
            downloadLink.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#45a049';
            });
            downloadLink.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '#4CAF50';
            });

            document.body.appendChild(downloadLink);
        }).catch(function(error) {
            console.error('Error creating ZIP file:', error);
            alert('Error creating ZIP file: ' + error.message);
        });
    }

    // Wait for page to load, then wait for variables, then create button
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            waitForVariables(createDownloadButton);
        });
    } else {
        waitForVariables(createDownloadButton);
    }
})();
