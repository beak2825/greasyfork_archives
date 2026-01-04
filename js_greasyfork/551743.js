// ==UserScript==
// @name         Nexus Mods Enhanced Auto Download
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically downloads from Nexus Mods without wait times. Supports Manual/Vortex/MO2/NMM downloads, auto-clicks slow download, and handles archived files.
// @author       Kristijan1001
// @match        https://www.nexusmods.com/*
// @match        https://nexusmods.com/*
// @icon         https://www.nexusmods.com/favicon.ico
// @run-at       document-idle
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551743/Nexus%20Mods%20Enhanced%20Auto%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/551743/Nexus%20Mods%20Enhanced%20Auto%20Download.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    // ========== AJAX REQUEST HANDLER ==========
    let ajaxRequestRaw;

    if (typeof(GM_xmlhttpRequest) !== "undefined") {
        ajaxRequestRaw = GM_xmlhttpRequest;
    } else if (typeof(GM) !== "undefined" && typeof(GM.xmlHttpRequest) !== "undefined") {
        ajaxRequestRaw = GM.xmlHttpRequest;
    }

    function ajaxRequest(obj) {
        if (!ajaxRequestRaw) {
            console.log("[Nexus Enhanced] Unable to request", obj);
            return;
        }

        const requestObj = {
            url: obj.url,
            method: obj.type,
            data: obj.data,
            headers: obj.headers
        };

        let loadCb = function(result) {
            if (result.readyState !== 4) {
                return;
            }

            if (result.status !== 200) {
                return obj.error(result);
            }

            return obj.success(result.responseText);
        };

        requestObj.onload = loadCb;
        requestObj.onerror = loadCb;

        ajaxRequestRaw(requestObj);
    }

    // ========== BUTTON STATE HELPERS ==========
    function btnError(button) {
        button.style.color = "red";
        button.innerText = "ERROR";
    }

    function btnSuccess(button) {
        button.style.color = "green";
        button.innerText = "LOADING";
    }

    function btnWait(button) {
        button.style.color = "yellow";
        button.innerText = "WAIT";
    }

    // ========== NO WAIT DOWNLOAD HANDLER ==========
    function clickListener(event) {
        const href = this.href || window.location.href;
        const params = new URL(href).searchParams;

        if (params.get("file_id")) {
            let button = event;
            if (this.href) {
                button = this;
                event.preventDefault();
            }
            btnWait(button);

            const section = document.getElementById("section");
            const gameId = section ? section.dataset.gameId : this.current_game_id;

            let fileId = params.get("file_id");
            if (!fileId) {
                fileId = params.get("id");
            }

            if (!params.get("nmm")) {
                ajaxRequest({
                    type: "POST",
                    url: "/Core/Libs/Common/Managers/Downloads?GenerateDownloadUrl",
                    data: "fid=" + fileId + "&game_id=" + gameId,
                    headers: {
                        Origin: "https://www.nexusmods.com",
                        Referer: href,
                        "Sec-Fetch-Site": "same-origin",
                        "X-Requested-With": "XMLHttpRequest",
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    success(data) {
                        if (data) {
                            try {
                                data = JSON.parse(data);

                                if (data.url) {
                                    btnSuccess(button);
                                    document.location.href = data.url;
                                }
                            } catch (e) {
                                console.error('[Nexus Enhanced] Error parsing response:', e);
                            }
                        }
                    },
                    error() {
                        btnError(button);
                    }
                });
            } else {
                ajaxRequest({
                    type: "GET",
                    url: href,
                    headers: {
                        Origin: "https://www.nexusmods.com",
                        Referer: document.location.href,
                        "Sec-Fetch-Site": "same-origin",
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    success(data) {
                        if (data) {
                            const text = String(data);

                            let downloadUrlMatch = text.match(/const downloadUrl = '([^']+)'/);
                            if (!downloadUrlMatch) {
                                downloadUrlMatch = text.match(/id="slowDownloadButton".*?data-download-url="([^"]+)"/);
                            }

                            const downloadUrl = downloadUrlMatch ? downloadUrlMatch[1].replaceAll('&amp;', '&') : null;
                            if (downloadUrl) {
                                btnSuccess(button);
                                document.location.href = downloadUrl;
                            } else {
                                btnError(button);
                            }
                        }
                    },
                    error(ajaxContext) {
                        console.error('[Nexus Enhanced] Ajax error:', ajaxContext.responseText);
                        btnError(button);
                    }
                });
            }

            const popup = this.parentNode;
            if (popup && popup.classList.contains("popup")) {
                popup.getElementsByTagName("button")[0].click();
                const popupButton = document.getElementById("popup" + fileId);
                if (popupButton) {
                    btnSuccess(popupButton);
                }
            }
        } else if (/ModRequirementsPopUp/.test(href)) {
            const fileId = params.get("id");

            if (fileId) {
                this.setAttribute("id", "popup" + fileId);
            }
        }
    }

    function addClickListener(el) {
        el.addEventListener("click", clickListener, true);
    }

    function addClickListeners(els) {
        for (let i = 0; i < els.length; i++) {
            addClickListener(els[i]);
        }
    }

    // ========== AUTO START FILE LINK ==========
    function getDonwloadButton(doc) {
        let button = doc.getElementById("slowDownloadButton");
        if (button) {
            return button;
        }

        button = doc.getElementById('upsell-cards');
        if (button) {
            const newBtn = button.lastChild?.getElementsByTagName('button');
            return newBtn ? newBtn[0] : button.lastChild;
        }

        button = doc.getElementById("startDownloadButton");
        if (button) {
            return button;
        }

        return null;
    }

    function autoStartFileLink() {
        if (/file_id=/.test(window.location.href)) {
            setTimeout(() => {
                let button = getDonwloadButton(document);
                if (!button) {
                    const sr = document.getElementsByTagName("mod-file-download");
                    if (sr && sr[0]?.shadowRoot) {
                        button = getDonwloadButton(sr[0].shadowRoot);
                    }
                }
                if (button) {
                    console.log('[Nexus Enhanced] Auto-starting file link download');
                    clickListener.call(button, button);
                }
            }, 1000);
        }
    }

    // ========== AUTO SLOW DOWNLOAD CLICKER ==========
    let autoClickAttempts = 0;
    const maxAutoClickAttempts = 60;

    function clickSlowDownload() {
        autoClickAttempts++;

        // Method 1: Look for slow download button by ID
        const slowButton = document.getElementById('slowDownloadButton');
        if (slowButton) {
            console.log('[Nexus Enhanced] Found slowDownloadButton by ID, clicking...');
            slowButton.click();
            return true;
        }

        // Method 2: Look for the mod-file-download component
        const modComponent = document.querySelector('mod-file-download');
        if (modComponent) {
            // Try to access shadow DOM if available
            try {
                if (modComponent.shadowRoot) {
                    const slowButtons = modComponent.shadowRoot.querySelectorAll('button, [role="button"], a');
                    for (const btn of slowButtons) {
                        const text = btn.textContent?.toLowerCase() || '';
                        if (text.includes('slow') && text.includes('download')) {
                            console.log('[Nexus Enhanced] Found slow download button in shadow DOM, clicking...');
                            btn.click();
                            return true;
                        }
                    }
                }
            } catch (e) {
                console.log('[Nexus Enhanced] Shadow DOM access failed:', e);
            }
        }

        // Method 3: Look for any button with "slow download" text
        const allButtons = document.querySelectorAll('button, a, [role="button"]');
        for (const btn of allButtons) {
            const text = btn.textContent?.toLowerCase() || '';
            if (text.includes('slow') && text.includes('download')) {
                console.log('[Nexus Enhanced] Found slow download button via text search, clicking...');
                btn.click();
                return true;
            }
        }

        // Method 4: Look specifically for the span structure
        const slowDownloadSpans = document.querySelectorAll('span');
        for (const span of slowDownloadSpans) {
            const trimmedText = span.textContent?.trim().toLowerCase() || '';
            if (trimmedText === 'slow download') {
                const button = span.closest('button, a, [role="button"]');
                if (button) {
                    console.log('[Nexus Enhanced] Found slow download via span structure, clicking...');
                    button.click();
                    return true;
                }
            }
        }

        return false;
    }

    function tryAutoClick() {
        if (autoClickAttempts >= maxAutoClickAttempts) {
            console.log('[Nexus Enhanced] Max auto-click attempts reached');
            return;
        }

        if (clickSlowDownload()) {
            console.log('[Nexus Enhanced] Successfully auto-clicked slow download button!');
            return;
        }

        setTimeout(tryAutoClick, 1000);
    }

    // ========== ARCHIVED FILE HANDLER ==========
    function archivedFile() {
        if (/[?&]category=archived/.test(window.location.href)) {
            console.log('[Nexus Enhanced] Processing archived files');
            const fileIds = document.getElementsByClassName("file-expander-header");
            const elements = document.getElementsByClassName("accordion-downloads");
            const path = `${location.protocol}//${location.host}${location.pathname}`;

            for (let i = 0; i < elements.length; i++) {
                elements[i].innerHTML = ''
                    + `<li><a class="btn inline-flex" href="${path}?tab=files&amp;file_id=${fileIds[i].getAttribute("data-id")}&amp;nmm=1" tabindex="0">`
                    + '<svg title="" class="icon icon-nmm"><use xlink:href="https://www.nexusmods.com/assets/images/icons/icons.svg#icon-nmm"></use></svg> <span class="flex-label">Mod manager download</span>'
                    + "</a></li><li></li><li>"
                    + `<li><a class="btn inline-flex" href="${path}?tab=files&amp;file_id=${fileIds[i].getAttribute("data-id")}" tabindex="0">`
                    + '<svg title="" class="icon icon-manual"><use xlink:href="https://www.nexusmods.com/assets/images/icons/icons.svg#icon-manual"></use></svg> <span class="flex-label">Manual download</span>'
                    + "</a></li>";
            }
        }
    }

    // ========== INITIALIZATION ==========
    function initializeAutoClick() {
        if (window.location.href.includes('?tab=files') ||
            window.location.href.includes('/files/') ||
            window.location.href.includes('file_id=') ||
            document.querySelector('mod-file-download')) {

            console.log('[Nexus Enhanced] Starting auto-click functionality...');

            setTimeout(tryAutoClick, 1000);

            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length > 0) {
                        for (const node of mutation.addedNodes) {
                            if (node.tagName === 'MOD-FILE-DOWNLOAD' ||
                                (node.querySelector && node.querySelector('mod-file-download'))) {
                                console.log('[Nexus Enhanced] Detected mod-file-download component added to DOM');
                                setTimeout(tryAutoClick, 500);
                                break;
                            }
                        }
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => observer.disconnect(), maxAutoClickAttempts * 1000);
        }
    }

    function initialize() {
        console.log('[Nexus Enhanced] Script initialized v1.1');

        // Handle archived files
        archivedFile();

        // Add click listeners to existing buttons
        addClickListeners(document.querySelectorAll("a.btn"));

        // Auto-start file link if on download page
        autoStartFileLink();

        // Initialize auto-click for slow download
        initializeAutoClick();

        // Observe for dynamically added buttons
        let observer = new MutationObserver((mutations) => {
            for (let i = 0; i < mutations.length; i++) {
                if (mutations[i].addedNodes) {
                    for (let x = 0; x < mutations[i].addedNodes.length; x++) {
                        const node = mutations[i].addedNodes[x];

                        if (node.tagName === "A" && node.classList.contains("btn")) {
                            addClickListener(node);
                        } else if (node.children && node.children.length > 0) {
                            addClickListeners(node.querySelectorAll("a.btn"));
                        }
                    }
                }
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    }

    // Start when page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();