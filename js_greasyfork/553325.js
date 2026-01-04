// ==UserScript==
// @name         Mobile Redirect Video to External App
// @namespace    http://tampermonkey.net/
// @version      4.8
// @description  Detects video sources by injecting code to bypass player sandboxing and uses robust redirect methods.
// @author       MasuRii
// @match        *://*/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553325/Mobile%20Redirect%20Video%20to%20External%20App.user.js
// @updateURL https://update.greasyfork.org/scripts/553325/Mobile%20Redirect%20Video%20to%20External%20App.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Script Configuration ---
    const INTENT_TYPE = 'CHOOSER'; // 'CHOOSER' or 'SPECIFIC_APP'
    const SPECIFIC_APP_PACKAGE = 'com.mxtech.videoplayer.pro';
    const BUTTON_TEXT = 'Open Externally';

    // --- Debug Mode ---
    const debugEnabled = GM_getValue('debugEnabled', false);

    GM_registerMenuCommand(`Toggle Debug Mode (Currently: ${debugEnabled ? 'ON' : 'OFF'})`, () => {
        const newState = !GM_getValue('debugEnabled', false);
        GM_setValue('debugEnabled', newState);
        alert(`Video Redirector: Debug mode has been turned ${newState ? 'ON' : 'OFF'}.\nPlease reload the page for changes to take full effect.`);
    });

    let redirectButton = null;
    let linkChooserModal = null;
    let inspectorButton = null;
    const videoSources = new Set();

    function log(message) {
        if (debugEnabled) {
            console.log('[Video Redirector] ' + message);
        }
    }

    function buildIntentUrl(videoUrl) {
        if (!videoUrl) return null;
        let intentUrl = `intent:${videoUrl}#Intent;action=android.intent.action.VIEW;type=video/*;launchFlags=0x10000000;`;
        if (INTENT_TYPE === 'SPECIFIC_APP' && SPECIFIC_APP_PACKAGE) {
            intentUrl += `package=${SPECIFIC_APP_PACKAGE};`;
        }
        intentUrl += 'end';
        return intentUrl;
    }

    function redirectToExternalApp(videoUrl) {
        const intentUrl = buildIntentUrl(videoUrl);
        if (intentUrl) {
            log(`Attempting single-video redirect via programmatic click: ${intentUrl}`);
            const link = document.createElement('a');
            link.href = intentUrl;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    function createLinkChooserModal() {
        if (document.getElementById('video-redirect-modal')) return;
        const modalContainer = document.createElement('div');
        modalContainer.id = 'video-redirect-modal';
        modalContainer.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Select a Video Link</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Click a link to open in your external player:</p>
                    <ul id="video-link-list"></ul>
                </div>
            </div>
        `;
        document.body.appendChild(modalContainer);
        linkChooserModal = modalContainer;
        const closeModal = () => linkChooserModal.style.display = 'none';
        modalContainer.querySelector('.modal-overlay').addEventListener('click', closeModal);
        modalContainer.querySelector('.modal-close').addEventListener('click', closeModal);
    }

    function showLinkChooser() {
        if (videoSources.size === 0) {
            alert('No valid video links found on this page.');
            return;
        }
        if (videoSources.size === 1) {
            const singleUrl = videoSources.values().next().value;
            redirectToExternalApp(singleUrl);
            return;
        }
        const listElement = linkChooserModal.querySelector('#video-link-list');
        listElement.innerHTML = '';
        videoSources.forEach(url => {
            const intentUrl = buildIntentUrl(url);
            if (!intentUrl) return;
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = intentUrl;
            link.textContent = url.length > 100 ? url.substring(0, 97) + '...' : url;
            link.title = url;
            link.addEventListener('click', () => {
                linkChooserModal.style.display = 'none';
            });
            listItem.appendChild(link);
            listElement.appendChild(listItem);
        });
        linkChooserModal.style.display = 'flex';
    }

    function createRedirectButton() {
        if (document.getElementById('video-redirect-button')) return;
        redirectButton = document.createElement('button');
        redirectButton.id = 'video-redirect-button';
        redirectButton.textContent = BUTTON_TEXT;
        redirectButton.addEventListener('click', showLinkChooser);
        document.body.appendChild(redirectButton);
    }

    function showRedirectButton() {
        if (redirectButton && videoSources.size > 0) {
            redirectButton.style.display = 'block';
        }
    }

    function findAdvancedPlayerSources() {
        document.addEventListener('VD_PlayerSourceFound', (e) => {
            const url = e.detail.url;
            if (url && !videoSources.has(url)) {
                videoSources.add(url);
                log(`Received player source via injection: ${url}`);
                showRedirectButton();
            }
        });
        const codeToInject = `
            (function() {
                if (typeof jwplayer !== 'function') return;
                const playerDivs = document.querySelectorAll('div.jwplayer[id]');
                playerDivs.forEach(div => {
                    try {
                        const player = jwplayer(div.id);
                        if (player && typeof player.getPlaylist === 'function') {
                            const playlist = player.getPlaylist();
                            playlist.forEach(item => {
                                const sources = (item.sources && Array.isArray(item.sources)) ? item.sources : [];
                                if (item.file) sources.push({ file: item.file });
                                sources.forEach(source => {
                                    if (source.file && typeof source.file === 'string' && !source.file.startsWith('blob:')) {
                                        document.dispatchEvent(new CustomEvent('VD_PlayerSourceFound', { detail: { url: source.file } }));
                                    }
                                });
                            });
                        }
                    } catch (err) {}
                });
            })();
        `;
        try {
            const script = document.createElement('script');
            script.textContent = codeToInject;
            (document.head || document.documentElement).appendChild(script);
            script.remove();
            log('Injected script to find player sources.');
        } catch (e) {
            log(`Error injecting script: ${e.message}`);
        }
    }

    function handleVideoElement(video) {
        const checkSrcAndStoreIt = () => {
            const videoSrc = video.currentSrc;
            if (videoSrc && !videoSrc.startsWith('blob:')) {
                if (!videoSources.has(videoSrc)) {
                    videoSources.add(videoSrc);
                    log(`Found standard <video> source: ${videoSrc}`);
                    showRedirectButton();
                }
            }
        };
        if (video.readyState >= 1) {
            checkSrcAndStoreIt();
        } else {
            video.addEventListener('loadedmetadata', checkSrcAndStoreIt, { once: true });
        }
        video.addEventListener('loadstart', () => setTimeout(checkSrcAndStoreIt, 100));
    }

    function createDebugInspector() {
        if (!debugEnabled || document.getElementById("video-redirect-inspector")) {
            return;
        }
        inspectorButton = document.createElement("button");
        inspectorButton.id = "video-redirect-inspector";
        inspectorButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5s-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z"/></svg>';
        inspectorButton.title = "Inspect Element for Debugging";
        inspectorButton.addEventListener("click", () => {
            log("INSPECTOR MODE ACTIVATED. Click on or near the video player.");
            document.body.style.cursor = "crosshair";
            document.body.addEventListener("click", inspectElement, { once: true, capture: true });
        });
        document.body.appendChild(inspectorButton);
    }

    function inspectElement(event) {
        event.preventDefault();
        event.stopPropagation();
        document.body.style.cursor = "default";
        let target = event.target;
        console.log("--- [Video Redirector] Inspector Report ---");
        console.log("User clicked on the element below. Analyzing its structure (up to 8 parents):");
        console.log("Please copy this report when asking for support for a new site.");
        for (let i = 0; i < 8 && target && target.tagName !== "BODY"; i++) {
            const id = target.id ? `#${target.id}` : "";
            const classes = target.className && typeof target.className === "string" ? `.${target.className.split(" ").join(".")}` : "";
            console.log(`[${i}] ${target.tagName}${id}${classes}`, target);
            target = target.parentElement;
        }
        console.log("--- End of Report ---");
    }

    function addGlobalStyles() {
        GM_addStyle(`
            #video-redirect-button {
                position: fixed; bottom: 15px; left: 50%;
                transform: translateX(-50%);
                z-index: 2147483646;
                padding: 8px 16px; font-size: 14px; color: white;
                background-color: rgba(0, 0, 0, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 20px; cursor: pointer;
                box-shadow: 0 2px 8px rgba(0,0,0,0.5);
                display: none; /* Initially hidden */
                backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
                transition: opacity 0.3s ease, transform 0.3s ease;
            }
            #video-redirect-button:hover {
                background-color: rgba(0, 0, 0, 0.8);
                transform: translateX(-50%) scale(1.05);
            }
            #video-redirect-inspector {
                position: fixed; bottom: 15px; right: 15px;
                z-index: 2147483646;
                width: 40px; height: 40px;
                background-color: rgba(100, 100, 100, 0.5);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
                transition: background-color 0.3s ease;
            }
            #video-redirect-inspector:hover {
                background-color: rgba(120, 0, 0, 0.7);
            }
            #video-redirect-modal {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                z-index: 2147483647;
                display: none; align-items: center; justify-content: center;
            }
            #video-redirect-modal .modal-overlay {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background-color: rgba(0,0,0,0.7);
            }
            #video-redirect-modal .modal-content {
                position: relative; z-index: 1;
                background-color: #2c2c2c; color: #f1f1f1;
                border-radius: 8px;
                width: 90%; max-width: 600px;
                max-height: 80vh;
                display: flex; flex-direction: column;
                box-shadow: 0 5px 15px rgba(0,0,0,0.5);
            }
            #video-redirect-modal .modal-header {
                padding: 15px; border-bottom: 1px solid #444;
                display: flex; justify-content: space-between; align-items: center;
            }
            #video-redirect-modal .modal-header h3 { margin: 0; font-size: 1.2em; }
            #video-redirect-modal .modal-close {
                background: none; border: none; font-size: 1.8em;
                color: #aaa; cursor: pointer; line-height: 1; padding: 0;
            }
            #video-redirect-modal .modal-close:hover { color: white; }
            #video-redirect-modal .modal-body { padding: 15px; overflow-y: auto; }
            #video-redirect-modal #video-link-list {
                list-style: none; padding: 0; margin: 0;
            }
            #video-redirect-modal #video-link-list li {
                margin-bottom: 10px;
            }
            #video-redirect-modal #video-link-list a {
                display: block; padding: 10px;
                background-color: #3a3a3a;
                border-radius: 4px;
                color: #aaddff; text-decoration: none;
                word-break: break-all;
                transition: background-color 0.2s ease;
            }
            #video-redirect-modal #video-link-list a:hover {
                background-color: #4f4f4f;
            }
        `);
    }

    // --- Initialization ---
    addGlobalStyles();
    createRedirectButton();
    createLinkChooserModal();
    createDebugInspector();

    document.querySelectorAll('video').forEach(handleVideoElement);

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.tagName === "VIDEO") {
                            handleVideoElement(node);
                        } else if (node.querySelectorAll) {
                            node.querySelectorAll("video").forEach(handleVideoElement);
                        }
                    }
                });
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(findAdvancedPlayerSources, 2500);

})();