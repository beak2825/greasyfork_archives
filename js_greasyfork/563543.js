// ==UserScript==
// @name         Telegram Web - Allow Batch Saving Content - Shivaay
// @namespace    https://github.com/Shivaay20005
// @license      MIT
// @version      0.5
// @description  Bypass Telegram's saving content restrictions for media and text; batch download media from selected messages
// @author       Shivaay Developer
// @match        https://web.telegram.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=telegram.org
// @grant        unsafeWindow
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/477900/Telegram%20Web%20-%20Allow%20Saving%20Content.user.js
// @updateURL https://update.greasyfork.org/scripts/477900/Telegram%20Web%20-%20Allow%20Saving%20Content.meta.js
// ==/UserScript==

// Extract media from message and download to disc
function downloadMediaFromMessage(msg) {
    var myMedia;

    if (msg.media) {
        // Extract the media object; simple alternative to getMediaFromMessage
        myMedia = msg.media.document || msg.media.photo;
    }

    if (myMedia) {
        // Download media using the built-in function; auto sets file name and extension
        unsafeWindow.appDownloadManager.downloadToDisc({media: myMedia});
    }
}

// Throttle download of multiple medias by 1 second
function slowDown(secs, msg, btnElm, btnTxt, btnIco) {
    setTimeout(function () {
        btnElm.disabled = true;
        btnElm.style.opacity = 0.6;
        btnTxt.textContent = '..' + (secs + 1) + '..';
        btnIco.textContent = '🕔';

        downloadMediaFromMessage(msg);
    }, secs * 1000);
}

// Get message object then download
async function downloadSingleMedia(pid, mid) {
    // Get the message object based on peer and message ID
    var msg = await unsafeWindow.mtprotoMessagePort.getMessageByPeer(pid, mid);

    downloadMediaFromMessage(msg);
}

// Download multiple medias from selected messages
async function downloadSelectedMedia() {
    var msgs = await unsafeWindow.appImManager.chat.selection.getSelectedMessages();
    var secs = 0;

    var btnElm = document.querySelector('#batch-btn');
    var btnTxt = btnElm.querySelector('.i18n');
    var btnIco = btnElm.querySelector('.mytgico');

    msgs.forEach(function (msg, ind) {
        // Only process messages with media
        if (msg.media && (msg.media.document || msg.media.photo)) {
            slowDown(secs, msg, btnElm, btnTxt, btnIco);
            secs++;
        }

        // Reset the batch button after last download
        if (ind === msgs.length - 1) {
            setTimeout(function () {
                btnElm.disabled = false;
                btnElm.style.opacity = 1;
                btnTxt.textContent = 'D/L';
                btnIco.textContent = '📥';
            }, secs * 1000);
        }
    });
}

(function () {
    'use strict';

    if (window.location.pathname.startsWith('/a/')) {
        // Redirect to the WebK version from the WebA version
        window.location.replace(window.location.href.replace('.org/a/', '.org/k/'));
    } else {
        // The root element used for watching and listening
        var colCenter = document.querySelector('#column-center');

        // Array of class names for media; we only add Download button if these are right clicked
        var clArray = ['photo', 'audio', 'video', 'voice-message', 'media-round', 'grouped-item', 'document-container', 'sticker'];

        // HTML code for the Download button
        var btnHtml = '<div class="btn-menu-item rp-overflow" id="down-btn"><span class="mytgico btn-menu-item-icon" style="font-size: 16px;">📥</span><span class="i18n btn-menu-item-text">Download</span></div>';

        // HTML code for the batch D/L button
        var batchBtnHtml = '&nbsp;&nbsp;<button class="btn-primary btn-transparent text-bold" id="batch-btn" title="Download Media"><span class="mytgico" style="padding-bottom: 2px;">📥</span>&nbsp;<span class="i18n">D/L</span></button>';

        // A flag for checking if we need to add the Download button
        var needBtn = false;

        // Variables for the current message and peer ID
        var curMid, curPid, observer;

        // Add CSS styles to allow text selection
        GM_addStyle('.no-forwards .bubbles, .bubble, .bubble-content { -webkit-user-select: text!important; -moz-user-select: text!important; user-select: text!important; }');

        // Unlock Ctrl+C to copy selected text
        var origListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type) {
            if (type !== 'copy') {
                origListener.apply(this, arguments);
            }
        };

        colCenter.addEventListener('mouseup', function (e) {
            // Listen to the right mouse button clicks
            if (e.button === 2) {
                needBtn = false;
                // Test if the current chat has restricted content saving
                if (document.querySelector('.no-forwards')) {
                    // Find the closest element containing message and peer IDs
                    var closest = e.target.closest('[data-mid]');
                    if (closest) {
                        // Check if the element actually contains some media classes
                        if (clArray.some(function (clName) {
                            return closest.classList.contains(clName);
                        })) {
                            curMid = closest.dataset.mid;
                            curPid = closest.dataset.peerId;
                            needBtn = true;
                        }
                    }
                }
            }
        });

        observer = new MutationObserver(function (mutList) {
            mutList.forEach(function (mut) {
                mut.addedNodes.forEach(function (anod) {
                    // Check if context menu has been added to the DOM
                    if (anod.id === 'bubble-contextmenu' && needBtn) {
                        // Add the custom Download button and assign a click event
                        anod.querySelector('.btn-menu-item').insertAdjacentHTML('beforebegin', btnHtml);
                        anod.querySelector('#down-btn').addEventListener('click', function () {
                            downloadSingleMedia(curPid, curMid);
                        });
                    }

                    // Check if selection popup has been added to the DOM
                    if (anod.classList && anod.classList.contains('selection-wrapper')) {
                        anod.querySelector('.selection-container-left').insertAdjacentHTML('beforeend', batchBtnHtml);
                        anod.querySelector('#batch-btn').addEventListener('click', function () {
                            downloadSelectedMedia();
                        });
                    }
                });
            });
        });

        // Observe when context menu is added to the DOM
        observer.observe(colCenter, {
            subtree: true, childList: true
        });
    }
})();