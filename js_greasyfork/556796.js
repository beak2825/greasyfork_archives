// ==UserScript==
// @name         PractiScore Match Data Exporter (Tampermonkey/Chrome)
// @namespace    punctapracticaliberanda.example.com
// @version      1.0
// @description  Extracts matchDef and scores variables from PractiScore results pages and saves them as a ZIP file
// @match        https://practiscore.com/results/new/*
// @match        http://practiscore.com/results/new/*
// @grant        none
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/556796/PractiScore%20Match%20Data%20Exporter%20%28TampermonkeyChrome%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556796/PractiScore%20Match%20Data%20Exporter%20%28TampermonkeyChrome%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Extract the match ID from the URL
    function getMatchId() {
        const pathParts = window.location.pathname.split('/');
        const idIndex = pathParts.indexOf('new') + 1;
        return pathParts[idIndex] || 'unknown';
    }

    // Get JSZip from various possible locations (Tampermonkey compatibility)
    function getJSZip() {
        if (typeof JSZip !== 'undefined') {
            return JSZip;
        }
        if (typeof window !== 'undefined' && window.JSZip) {
            return window.JSZip;
        }
        return null;
    }

    // Wait for JSZip to be available
    function waitForJSZip(callback, maxAttempts = 50) {
        let attempts = 0;
        const checkInterval = setInterval(() => {
            attempts++;
            const JSZipLib = getJSZip();
            if (JSZipLib) {
                console.log('JSZip library loaded.');
                clearInterval(checkInterval);
                callback();
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.error('JSZip library not found after waiting.');
                alert('JSZip library failed to load. Please refresh the page.');
            }
        }, 100);
    }

    // Wait for the page to load and variables to be available
    function waitForVariables(callback, maxAttempts = 500) {
        let attempts = 0;
        const checkInterval = setInterval(() => {
            attempts++;
            if (window.matchDef && window.scores) {
                console.log('matchDef and scores found on this page.');
                clearInterval(checkInterval);
                callback();
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                let foundMatchDef = window.matchDef !== undefined;
                let foundScores = window.scores !== undefined;
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
                console.log('createZipBlob: Starting...');
                const JSZipLib = getJSZip();
                if (!JSZipLib) {
                    console.error('createZipBlob: JSZip library is not available.');
                    reject(new Error('JSZip library is not available.'));
                    return;
                }
                console.log('createZipBlob: JSZip library found.');

                const matchDef = window.matchDef;
                const scores = window.scores;
                const matchId = getMatchId();

                console.log('createZipBlob: matchDef:', !!matchDef, 'scores:', !!scores, 'matchId:', matchId);

                if(!matchDef) {
                    console.error('createZipBlob: matchDef not found.');
                    reject(new Error('matchDef not found on this page.'));
                    return;
                }

                if(!scores) {
                    console.error('createZipBlob: scores not found.');
                    reject(new Error('scores not found on this page.'));
                    return;
                }

                if(!matchId) {
                    console.error('createZipBlob: matchId not found.');
                    reject(new Error('matchId not found on this page.'));
                    return;
                }

                console.log('createZipBlob: Creating ZIP instance...');
                console.log('createZipBlob: JSZipLib constructor:', typeof JSZipLib);
                // Create a new ZIP file
                let zip;
                try {
                    zip = new JSZipLib();
                    console.log('createZipBlob: ZIP instance created:', !!zip);
                } catch (e) {
                    console.error('createZipBlob: Error creating ZIP instance:', e);
                    reject(e);
                    return;
                }

                try {
                    zip.file('match_def.json', JSON.stringify(matchDef, null, 2));
                    zip.file('scores.json', JSON.stringify(scores, null, 2));
                    console.log('createZipBlob: Files added to ZIP, generating blob...');
                } catch (e) {
                    console.error('createZipBlob: Error adding files to ZIP:', e);
                    reject(e);
                    return;
                }

                // Generate the ZIP file as a blob
                console.log('createZipBlob: Calling generateAsync with arraybuffer...');
                if (typeof zip.generateAsync !== 'function') {
                    console.error('createZipBlob: generateAsync is not a function:', typeof zip.generateAsync);
                    reject(new Error('generateAsync is not available on ZIP instance'));
                    return;
                }

                // Add timeout to detect if promise hangs
                const timeoutId = setTimeout(function() {
                    console.error('createZipBlob: generateAsync timed out after 10 seconds');
                    reject(new Error('ZIP generation timed out'));
                }, 10000);

                console.log('createZipBlob: Starting generateAsync promise with arraybuffer...');

                // Use setTimeout to defer execution - this can help promises resolve in Tampermonkey
                setTimeout(function() {
                    try {
                        // Use arraybuffer and convert to blob - this often works better in Tampermonkey
                        const generatePromise = zip.generateAsync({ type: 'arraybuffer' });
                        console.log('createZipBlob: generateAsync promise created:', !!generatePromise);

                        if (!generatePromise || typeof generatePromise.then !== 'function') {
                            clearTimeout(timeoutId);
                            console.error('createZipBlob: generateAsync did not return a promise');
                            reject(new Error('generateAsync did not return a valid promise'));
                            return;
                        }

                        generatePromise.then(function(arrayBuffer) {
                            clearTimeout(timeoutId);
                            console.log('createZipBlob: ArrayBuffer generated, size:', arrayBuffer.byteLength);
                            try {
                                const blob = new Blob([arrayBuffer], { type: 'application/zip' });
                                console.log('createZipBlob: Blob created from ArrayBuffer, size:', blob.size);
                                resolve({ blob: blob, filename: `${matchId}.zip` });
                            } catch (e) {
                                console.error('createZipBlob: Error creating blob from ArrayBuffer:', e);
                                reject(e);
                            }
                        }).catch(function(error) {
                            clearTimeout(timeoutId);
                            console.error('createZipBlob: Error in generateAsync:', error);
                            console.error('createZipBlob: Error stack:', error.stack);
                            reject(error);
                        });
                    } catch (error) {
                        clearTimeout(timeoutId);
                        console.error('createZipBlob: Exception in setTimeout:', error);
                        reject(error);
                    }
                }, 0);
            } catch (error) {
                console.error('createZipBlob: Exception caught:', error);
                reject(error);
            }
        });
    }

    // Create download button with anchor link
    function createDownloadButton() {
        // Check if button already exists
        if (document.getElementById('psa-download-link')) {
            console.log('Download button already exists.');
            return;
        }

        console.log('Creating download button...');

        // Ensure JSZip is available
        const JSZipLib = getJSZip();
        if (!JSZipLib) {
            console.error('JSZip is not available when creating button.');
            alert('JSZip library is not available. Please refresh the page.');
            return;
        }

        // Create ZIP blob first
        console.log('About to call createZipBlob()...');
        createZipBlob().then(function(result) {
            console.log('ZIP blob created successfully.');
            const blob = result.blob;
            const filename = result.filename;
            console.log('Creating blob URL...');
            const blobUrl = URL.createObjectURL(blob);
            console.log('Blob URL created:', blobUrl);

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

            // Ensure body exists before appending
            if (document.body) {
                document.body.appendChild(downloadLink);
                console.log('Download button added to page.');
            } else {
                console.error('document.body is not available.');
                // Wait a bit and try again
                setTimeout(function() {
                    if (document.body) {
                        document.body.appendChild(downloadLink);
                        console.log('Download button added to page (delayed).');
                    } else {
                        alert('Could not add download button: document.body not available.');
                    }
                }, 500);
            }
        }).catch(function(error) {
            console.error('Error creating ZIP file:', error);
            alert('Error creating ZIP file: ' + error.message);
        });
    }

    // Wait for page to load, then wait for JSZip, then variables, then create button
    function init() {
        waitForJSZip(function() {
            waitForVariables(createDownloadButton);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

