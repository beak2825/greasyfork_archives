// ==UserScript==
// @name         Global Video Controls Hotkeys for Nontonime
// @namespace    https://github.com/dngda
// @version      1.0.3
// @description  Adds global video control hotkeys (space: play/pause, left/right: seek -5s/+5s) to Nontonime website.
// @author       @dngda
// @match        https://nontonime.vercel.app/anime/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vercel.app
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/556565/Global%20Video%20Controls%20Hotkeys%20for%20Nontonime.user.js
// @updateURL https://update.greasyfork.org/scripts/556565/Global%20Video%20Controls%20Hotkeys%20for%20Nontonime.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let seekDebounceTimer = null;
    let pendingSeekTime = 0;
    let toastHideTimer = null;
    let isSeeking = false;
    let wasPlayingBeforeSeek = false;
    let mouseMoveTimer = null;
    const MOUSE_IDLE_TIMEOUT = 2000; // 2 seconds

    //create element for toast in center of the video
    const toast = document.createElement("div");
    toast.style.position = "absolute";
    toast.style.top = "50%";
    toast.style.left = "50%";
    toast.style.transform = "translate(-50%, -50%)";
    toast.style.padding = "10px 20px";
    toast.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    toast.style.color = "white";
    toast.style.fontSize = "16px";
    toast.style.borderRadius = "5px";
    toast.style.zIndex = "9999";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.2s ease-in-out";
    toast.style.pointerEvents = "none";

    function init() {
        const video = document.querySelector("video");
        if (!video) return;

        video.parentElement.appendChild(toast);

        function hideToast() {
            toast.style.opacity = "0";
            clearTimeout(toastHideTimer);
        }

        function showToast(message, autohide = true) {
            toast.textContent = message;
            toast.style.opacity = "1";
            clearTimeout(toastHideTimer);

            if (autohide) {
                toastHideTimer = setTimeout(hideToast, 1000);
            }
        }

        function hideCursor() {
            video.parentElement.style.cursor = "none";
        }

        function showCursor() {
            video.parentElement.style.cursor = "default";
        }

        function resetMouseTimer() {
            showCursor();
            clearTimeout(mouseMoveTimer);
            mouseMoveTimer = setTimeout(hideCursor, MOUSE_IDLE_TIMEOUT);
        }

        // Mouse move listener for hiding/showing cursor
        video.parentElement.addEventListener("mousemove", resetMouseTimer);
        video.parentElement.addEventListener("mouseenter", resetMouseTimer);
        video.parentElement.addEventListener("mouseleave", () => {
            clearTimeout(mouseMoveTimer);
            showCursor();
        });

        // Video event listeners
        video.addEventListener("play", () => {
            if (!isSeeking) {
                hideToast();
            }
        });

        video.addEventListener("pause", () => {
            if (!isSeeking) {
                showToast("Paused", false);
            }
        });

        video.addEventListener("seeking", () => {
            if (pendingSeekTime !== 0) {
                const sign = pendingSeekTime > 0 ? "+" : "";
                showToast(`${sign}${pendingSeekTime}s`);
            }
        });

        // Keyboard controls
        document.addEventListener("keydown", function (event) {
            const activeElement = document.activeElement;
            const isInputFocused =
                activeElement &&
                (activeElement.tagName === "INPUT" ||
                    activeElement.tagName === "TEXTAREA" ||
                    activeElement.isContentEditable);

            if (isInputFocused) return;

            let seekTime = 5;
            if (event.shiftKey) {
                seekTime = 15;
            }

            switch (event.code) {
                case "Space":
                    event.preventDefault();
                    if (video.paused) {
                        video.play();
                    } else {
                        video.pause();
                    }
                    break;

                case "ArrowLeft":
                case "ArrowRight":
                    event.preventDefault();

                    const direction = event.code === "ArrowRight" ? 1 : -1;
                    pendingSeekTime += seekTime * direction;

                    if (!isSeeking) {
                        wasPlayingBeforeSeek = !video.paused;
                        isSeeking = true;

                        if (wasPlayingBeforeSeek) {
                            video.pause();
                        }
                    }

                    clearTimeout(seekDebounceTimer);
                    seekDebounceTimer = setTimeout(() => {
                        video.currentTime = Math.max(
                            0,
                            Math.min(
                                video.duration,
                                video.currentTime + pendingSeekTime
                            )
                        );
                        pendingSeekTime = 0;
                        isSeeking = false;

                        if (wasPlayingBeforeSeek) {
                            video.play();
                        } else {
                            showToast("Paused", false);
                        }
                    }, 500);

                    const sign = pendingSeekTime > 0 ? "+" : "";
                    showToast(`${sign}${pendingSeekTime}s`);
                    break;

                case "KeyF":
                    event.preventDefault();
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    } else {
                        video.parentElement.requestFullscreen();
                        hideCursor();
                    }
                    break;
            }
        });

        // Expand viewport
        const gridElement = document.querySelector(".grid-cols-1");
        if (gridElement) {
            gridElement.classList = [];
            gridElement.lastElementChild.style.marginTop = "50px";
        }
    }

    // Wait for the video element to be available
    const observer = new MutationObserver(() => {
        if (document.querySelector("video")) {
            init();
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
