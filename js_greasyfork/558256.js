// ==UserScript==
// @name                YouTube Undo Seek
// @icon                https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @author              ElectroKnight22
// @namespace           electroknight22_youtube_undo_seek_namespace
// @version             1.0.0
// @match               *://www.youtube.com/*
// @match               *://m.youtube.com/*
// @match               *://www.youtube-nocookie.com/*
// @exclude             *://www.youtube.com/live_chat*
// @require             https://update.greasyfork.org/scripts/549881/1708128/YouTube%20Helper%20API.js
// @run-at              document-idle
// @grant               none
// @inject-into         page
// @license             MIT
// @description         Undos and redos seek actions on YouTube with Ctrl+Z and Ctrl+Y.
// @downloadURL https://update.greasyfork.org/scripts/558256/YouTube%20Undo%20Seek.user.js
// @updateURL https://update.greasyfork.org/scripts/558256/YouTube%20Undo%20Seek.meta.js
// ==/UserScript==

/*jshint esversion: 11 */
/* global youtubeHelperApi */

(function () {
    'use strict';

    const api = youtubeHelperApi;
    if (!api) return console.error('[YouTube Undo Seek] Helper API not found.');

    const MERGE_THRESHOLD_MS = 1000;
    const MAXIMUM_STACK_SIZE = 30;

    const applicationState = {
        undoStack: [],
        redoStack: [],
        lastSeekEventTime: 0,
        isNavigationLocked: false,
        activeVideoElement: null,
        abortController: null,
    };

    const performNavigation = (sourceStack, destinationStack) => {
        if (sourceStack.length === 0 || api.video.isCurrentlyLive || api.player.isPlayingAds) return;

        destinationStack.push(api.apiProxy.getCurrentTime());

        applicationState.isNavigationLocked = true;
        const targetTime = sourceStack.pop();

        api.apiProxy.seekTo(targetTime, true);

        applicationState.activeVideoElement.addEventListener(
            'seeked',
            () => {
                applicationState.isNavigationLocked = false;
                applicationState.lastSeekEventTime = 0;
            },
            { once: true },
        );
    };

    const handleSeekingEvent = () => {
        if (applicationState.isNavigationLocked || api.player.isPlayingAds || api.video.isCurrentlyLive) return;

        const now = Date.now();
        const timeSinceLastSeek = now - applicationState.lastSeekEventTime;

        if (timeSinceLastSeek < MERGE_THRESHOLD_MS) {
            applicationState.lastSeekEventTime = now;
            return;
        }

        const originTime = api.video.realCurrentProgress;

        applicationState.undoStack.push(originTime);
        applicationState.redoStack.length = 0;

        applicationState.lastSeekEventTime = now;

        if (applicationState.undoStack.length > MAXIMUM_STACK_SIZE) {
            applicationState.undoStack.shift();
        }
    };

    const initializeVideoListeners = () => {

    applicationState.undoStack = [];
    applicationState.redoStack = [];
    applicationState.lastSeekEventTime = 0;

        const videoElement = api.player.videoElement;

        if (!videoElement || applicationState.activeVideoElement === videoElement) return;

        if (applicationState.abortController) applicationState.abortController.abort();

        applicationState.activeVideoElement = videoElement;
        applicationState.abortController = new AbortController();
        const signal = applicationState.abortController.signal;

        videoElement.addEventListener('seeking', handleSeekingEvent, { signal });
    };

    document.addEventListener('keydown', (event) => {
        if (!event.ctrlKey) return;

        const key = event.key.toLowerCase();
        if (key !== 'z' && key !== 'y') return;

        const activeElement = document.activeElement;
        const tagName = activeElement.tagName.toUpperCase();

        if (tagName === 'INPUT' || tagName === 'TEXTAREA' || activeElement.isContentEditable) return;

        event.preventDefault();

        switch (key) {
            case 'z':
                performNavigation(applicationState.undoStack, applicationState.redoStack);
                break;
            case 'y':
                performNavigation(applicationState.redoStack, applicationState.undoStack);
                break;
            default:
                break;
        }
    });

    api.eventTarget.addEventListener('yt-helper-api-ready', initializeVideoListeners);
})();