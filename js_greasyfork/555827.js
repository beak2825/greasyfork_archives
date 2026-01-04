// ==UserScript==
// @name         YouTube Quick Watch Later (10/25 UI)
// @namespace    http://tampermonkey.net/
// @version      4.5
// @description  Adds quick Watch Later button with customizable playlist
// @author       kavinned
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @icon         https://www.google.com/s2/favicons?sz=64&domain=YouTube.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555827/YouTube%20Quick%20Watch%20Later%20%281025%20UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555827/YouTube%20Quick%20Watch%20Later%20%281025%20UI%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const SAVE_BUTTON_TEXTS = [
        "Save", "儲存", "保存", "Guardar", "Sauvegarder",
        "Speichern", "Salvar", "Сохранить", "保存", "저장",
        "บันทึก", "Simpan", "Lưu"
    ];

    // Cached selectors for performance
    const SELECTORS = {
    buttonTarget: "#top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div",

    // FIXED - Only the video's "More actions" menu button
    menuButton: "ytd-watch-metadata ytd-menu-renderer button[aria-label*='More']",

    directSaveButton: "ytd-menu-renderer yt-button-view-model .yt-spec-button-shape-next__button-text-content, ytd-button-renderer button",
    menuSaveButtons: "#items > ytd-menu-service-item-renderer > tp-yt-paper-item > yt-formatted-string",
    playlists: "toggleable-list-item-view-model",
    playlistDialogs: "tp-yt-iron-dropdown.style-scope.ytd-popup-container"
};



    // Button existence cache
    let buttonExists = false;

    function getTargetPlaylist() {
        return GM_getValue("targetPlaylist", "Watch later");
    }

    function setTargetPlaylist(playlistName) {
        GM_setValue("targetPlaylist", playlistName);
        console.log(`✅ Target playlist set to: ${playlistName}`);
    }

    function containsSaveText(text) {
        return SAVE_BUTTON_TEXTS.some(saveText => text.includes(saveText));
    }

    // Consolidated save button finding logic
    function findAndClickSaveButton(callback) {
        // Try direct save button first
        const directSaveButton = Array.from(
            document.querySelectorAll(SELECTORS.directSaveButton)
        ).find(element => containsSaveText(element.textContent));

        if (directSaveButton) {
            console.log("🎯 Direct save button found");
            directSaveButton.click();
            if (callback) setTimeout(callback, 600);
            return;
        }

        // Try overflow menu
        console.log("🔍 Looking for save button in menu...");
        const menuButton = document.querySelector(SELECTORS.menuButton);
        if (!menuButton) return;

        menuButton.click();
        console.log("📂 Menu clicked");

        setTimeout(() => {
            const saveButtons = document.querySelectorAll(SELECTORS.menuSaveButtons);
            const saveButton = Array.from(saveButtons).find(btn => containsSaveText(btn.textContent));

            if (saveButton) {
                saveButton.click();
                if (callback) setTimeout(callback, 600);
            }
        }, 150);
    }

    function waitForPlaylists(callback, maxAttempts = 25, interval = 400) {
        let attempts = 0;

        const checkInterval = setInterval(() => {
            const playlists = document.querySelectorAll(SELECTORS.playlists);

            if (playlists.length > 0) {
                clearInterval(checkInterval);
                console.log(`✅ Found ${playlists.length} playlists after ${attempts + 1} attempts`);
                callback(playlists);
                return;
            }

            if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.log(`❌ Failed to find playlists after ${maxAttempts} attempts`);
                callback(null);
                return;
            }

            attempts++;
            if (attempts > 0 && attempts % 5 === 0) {
                console.log(`⏳ Fetching Playlists Attempt: ${attempts}`);
            }
        }, interval);
    }

    function isVideoInPlaylist(playlistElement) {
        const listItem = playlistElement.querySelector("yt-list-item-view-model");
        return listItem?.getAttribute("aria-pressed") === "true";
    }

    function getPlaylistName(playlistElement) {
        const nameElement = playlistElement.querySelector(".yt-list-item-view-model__text-wrapper span");
        return nameElement?.textContent.trim() || null;
    }

    function getClickableElement(playlistElement) {
        return playlistElement.querySelector("yt-list-item-view-model");
    }

    function createPlaylistSelectorModal() {
        const modal = document.createElement("div");
        modal.id = "playlist-selector-modal";

        const overlay = document.createElement("div");
        overlay.className = "playlist-modal-overlay";

        const content = document.createElement("div");
        content.className = "playlist-modal-content";

        const header = document.createElement("div");
        header.className = "playlist-modal-header";

        const title = document.createElement("h3");
        title.textContent = "Select Target Playlist";

        const closeBtn = document.createElement("button");
        closeBtn.className = "playlist-modal-close";
        closeBtn.textContent = "×";

        header.appendChild(title);
        header.appendChild(closeBtn);

        const body = document.createElement("div");
        body.className = "playlist-modal-body";

        const loading = document.createElement("p");
        loading.className = "playlist-loading";
        loading.textContent = "Loading playlists...";
        body.appendChild(loading);

        content.appendChild(header);
        content.appendChild(body);
        overlay.appendChild(content);
        modal.appendChild(overlay);

        document.body.appendChild(modal);
        return modal;
    }

    function closeYouTubeNativeDialog() {
        const dialogs = document.querySelectorAll(SELECTORS.playlistDialogs);
        const hasVisibleDialog = Array.from(dialogs).some(
            dialog => window.getComputedStyle(dialog).display !== 'none'
        );

        if (hasVisibleDialog) {
            console.log("🔴 Closing visible playlist dialog");
            document.querySelector(SELECTORS.menuButton)?.click();
        }
    }

    function showNotification(message) {
        const notification = document.createElement("div");
        notification.className = "playlist-notification";
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add("show"), 10);
        setTimeout(() => {
            notification.classList.remove("show");
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    function showPlaylistSelector() {
        const currentPlaylist = getTargetPlaylist();
        const modal = createPlaylistSelectorModal();
        const modalBody = modal.querySelector(".playlist-modal-body");
        const closeBtn = modal.querySelector(".playlist-modal-close");
        const overlay = modal.querySelector(".playlist-modal-overlay");

        const closeModal = () => {
            modal.remove();
            closeYouTubeNativeDialog();
        };

        closeBtn.addEventListener("click", closeModal);
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) closeModal();
        });

        // Use consolidated save button logic
        findAndClickSaveButton();

        waitForPlaylists((playlists) => {
            // Early return on error
            if (!playlists || playlists.length === 0) {
                modalBody.textContent = "";
                const error = document.createElement("p");
                error.className = "playlist-error";
                error.textContent = "Could not load playlists. Please try again.";
                modalBody.appendChild(error);
                return;
            }

            modalBody.textContent = "";

            // Query once, iterate efficiently
            playlists.forEach((playlist) => {
                const playlistName = getPlaylistName(playlist);
                if (!playlistName) return;

                const playlistItem = document.createElement("div");
                playlistItem.className = "playlist-item";

                const isActive = playlistName === currentPlaylist;
                if (isActive) {
                    playlistItem.classList.add("playlist-item-active");
                }

                const nameSpan = document.createElement("span");
                nameSpan.className = "playlist-name";
                nameSpan.textContent = playlistName;
                playlistItem.appendChild(nameSpan);

                if (isActive) {
                    const badge = document.createElement("span");
                    badge.className = "playlist-badge";
                    badge.textContent = "Current";
                    playlistItem.appendChild(badge);
                }

                playlistItem.addEventListener("click", () => {
                    setTargetPlaylist(playlistName);
                    closeModal();
                    showNotification(`Target playlist set to: ${playlistName}`);
                });

                modalBody.appendChild(playlistItem);
            });
        });
    }

    GM_registerMenuCommand("Change Target Playlist", showPlaylistSelector);

    function findPlaylistByName(playlistName, callback, maxAttempts = 25, interval = 400) {
        let attempts = 0;

        const checkInterval = setInterval(() => {
            const playlists = document.querySelectorAll(SELECTORS.playlists);

            // Query once per interval, iterate efficiently
            for (const playlist of playlists) {
                const name = getPlaylistName(playlist);
                if (name === playlistName) {
                    clearInterval(checkInterval);
                    console.log(`✅ Found playlist: ${playlistName}`);
                    callback(playlist);
                    return;
                }
            }

            if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.log(`❌ Playlist "${playlistName}" not found after ${maxAttempts} attempts`);
                callback(null);
                return;
            }

            attempts++;
        }, interval);
    }

    function handlePlaylistSelection() {
        const targetPlaylistName = getTargetPlaylist();

        findPlaylistByName(targetPlaylistName, (targetPlaylist) => {
            // Early return - found target playlist
            if (targetPlaylist) {
                handlePlaylistClick(targetPlaylist);
                return;
            }

            // Playlist not found - ask user
            const useWatchLater = confirm(
                `Playlist "${targetPlaylistName}" not found.\n\nDo you want to save to "Watch later" instead?`
            );

            if (useWatchLater) {
                setTargetPlaylist("Watch later");
                findPlaylistByName("Watch later", (watchLaterPlaylist) => {
                    if (watchLaterPlaylist) {
                        handlePlaylistClick(watchLaterPlaylist);
                        return;
                    }

                    // Watch later not found - use first available
                    const firstPlaylist = document.querySelector(SELECTORS.playlists);
                    if (firstPlaylist) {
                        handlePlaylistClick(firstPlaylist);
                    } else {
                        alert("Could not find any playlists.");
                    }
                });
                return;
            }

            // User wants to enter custom playlist name
            const newPlaylistName = prompt("Enter the exact playlist name you want to save to:");
            if (!newPlaylistName?.trim()) return;

            const trimmedName = newPlaylistName.trim();
            setTargetPlaylist(trimmedName);
            findPlaylistByName(trimmedName, (newPlaylist) => {
                if (newPlaylist) {
                    handlePlaylistClick(newPlaylist);
                } else {
                    alert(`Playlist "${trimmedName}" still not found. Please check the spelling and try again.`);
                }
            });
        });
    }

    function handlePlaylistClick(playlistElement) {
        const isInPlaylist = isVideoInPlaylist(playlistElement);
        const playlistName = getPlaylistName(playlistElement);
        const clickableElement = getClickableElement(playlistElement);

        // Early return on error
        if (!clickableElement) {
            console.error("❌ Could not find clickable element for playlist:", playlistName);
            alert("Error: Could not interact with playlist. Please try again.");
            return;
        }

        if (isInPlaylist) {
            const confirmRemove = confirm(
                `This video is already in your "${playlistName}" playlist. Do you want to remove it?`
            );
            if (confirmRemove) {
                console.log(`🗑️ Removing from playlist: ${playlistName}`);
                clickableElement.click();
            } else {
                closeYouTubeNativeDialog();
            }
            return;
        }

        // Not in playlist - add it
        console.log(`➕ Adding to playlist: ${playlistName}`);
        clickableElement.click();
    }

    function addWatchLaterButton() {
        // Use cached button check
        if (buttonExists) return;

        const targetDiv = document.querySelector(SELECTORS.buttonTarget);
        if (!targetDiv) return;

        if (document.querySelector(".quick-watch-later")) {
            buttonExists = true;
            return;
        }

        const button = document.createElement("button");
        button.className = "quick-watch-later";
        button.textContent = "WL";
        button.title = "Quick Watch Later (Right-click to change playlist)";

        button.addEventListener("click", () => {
            findAndClickSaveButton(handlePlaylistSelection);
        });

        button.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            e.stopPropagation();
            showPlaylistSelector();
        });

        targetDiv.appendChild(button);
        buttonExists = true;
        console.log("✅ WL button added");
    }

    // Reset button cache on navigation
    function resetButtonCache() {
        buttonExists = false;
    }

    // Handle navigation and inject button
    function handleNavigation() {
        if (!location.pathname.startsWith("/watch")) return;

        resetButtonCache();
        // Small delay to let YouTube render the button container
        setTimeout(addWatchLaterButton, 500);
    }

    // === PHASE 2 OPTIMIZATIONS ===

    // 1. Hook YouTube's native navigation event (primary)
    window.addEventListener('yt-navigate-finish', () => {
        console.log("🧭 YouTube navigation detected (yt-navigate-finish)");
        handleNavigation();
    });

    // 2. Hook History API (fallback for older YouTube or edge cases)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function() {
        const result = originalPushState.apply(this, arguments);
        window.dispatchEvent(new Event('locationchange'));
        return result;
    };

    history.replaceState = function() {
        const result = originalReplaceState.apply(this, arguments);
        window.dispatchEvent(new Event('locationchange'));
        return result;
    };

    window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('locationchange'));
    });

    window.addEventListener('locationchange', () => {
        console.log("🧭 Navigation detected (history API)");
        handleNavigation();
    });

    // 3. Debounced MutationObserver (last resort fallback)
    let debounceTimer;
    const debouncedObserver = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (location.pathname.startsWith("/watch")) {
                console.log("🧭 Navigation detected (debounced observer fallback)");
                handleNavigation();
            }
        }, 300);
    });

    // Observe a more specific target instead of entire body
    const observerTarget = document.querySelector('ytd-app') || document.body;
    debouncedObserver.observe(observerTarget, { childList: true, subtree: true });

    // Initial load
    if (location.pathname.startsWith("/watch")) {
        setTimeout(addWatchLaterButton, 2500);
    }

    GM_addStyle(`
        #top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div {
            display: flex;
            flex-direction: row-reverse;
            gap: 5px;
        }
        #top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div > button {
            flex-direction: row;
            border-radius: 24px;
            border: none;
            padding-left: 20px;
            padding-right: 20px;
            color: white;
            font-weight: bold;
            background: #272727;
            cursor: pointer;
            transition: all 0.15s ease;

            &:hover {
                background: #414141;
            }
        }
        .ryd-tooltip.ryd-tooltip-new-design {
            height: 0px !important;
            width: 0px !important;
        }
        @media only screen and (max-width: 1200px) {
            #top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div {
                flex-direction: column;
            }
            #top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div > button {
                padding: 10.5px 0px;
            }
        }

        #playlist-selector-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .playlist-modal-overlay {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.75);
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.15s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .playlist-modal-content {
            background: rgba(33, 33, 33, 0.98);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            animation: slideUp 0.2s ease;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .playlist-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .playlist-modal-header h3 {
            margin: 0;
            color: #fff;
            font-size: 18px;
            font-weight: 500;
        }

        .playlist-modal-close {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: #aaa;
            font-size: 28px;
            line-height: 1;
            cursor: pointer;
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            transition: all 0.15s ease;
        }

        .playlist-modal-close:hover {
            background: rgba(255, 255, 255, 0.15);
            color: #fff;
        }

        .playlist-modal-body {
            padding: 12px;
            overflow-y: auto;
            max-height: calc(80vh - 80px);
        }

        .playlist-modal-body::-webkit-scrollbar {
            width: 8px;
        }

        .playlist-modal-body::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
        }

        .playlist-modal-body::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
        }

        .playlist-modal-body::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .playlist-loading,
        .playlist-error {
            display: grid;
            place-items: center;
            padding: 80px 20px;
            min-height: 175px;
            text-align: center;
            color: #aaa;
            font-size: 32px;
            font-weight: 700;
        }

        .playlist-error {
            color: #f44336;
        }

        .playlist-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 14px 16px;
            margin: 4px 0;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.15s ease;
            border: 1px solid transparent;
        }

        .playlist-item:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
        }

        .playlist-item-active {
            background: rgba(62, 166, 255, 0.15);
            border-color: rgba(62, 166, 255, 0.4);
        }

        .playlist-item-active:hover {
            background: rgba(62, 166, 255, 0.2);
            border-color: rgba(62, 166, 255, 0.5);
        }

        .playlist-name {
            color: #fff;
            font-size: 14px;
            font-weight: 400;
        }

        .playlist-badge {
            background: #3ea6ff;
            color: #000;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
        }

        .playlist-notification {
            position: fixed;
            bottom: -100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(33, 33, 33, 0.95);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            color: #fff;
            padding: 16px 24px;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            transition: bottom 0.2s ease;
            font-size: 14px;
        }

        .playlist-notification.show {
            bottom: 24px;
        }
    `);
})();