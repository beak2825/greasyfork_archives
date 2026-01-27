// ==UserScript==
// @name         Kemono Tweaks & Player
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  Fetches post title for accuracy, features an expandable title header, and plays Media (Audio/Video) in a glassmorphism player. Supports Tampermonkey menu toggle for Video.
// @match        https://kemono.su/*
// @match        https://kemono.cr/*
// @match        https://coomer.su/*
// @match        https://coomer.party/*
// @author       medy17
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551036/Kemono%20Tweaks%20%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/551036/Kemono%20Tweaks%20%20Player.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const baseCss = "/* \n * No Tailwind preflight/base - we don't want to reset the host page styles!\n * Only include utilities for our player component\n */\n.kt-pointer-events-none {\n  pointer-events: none;\n}\n.kt-fixed {\n  position: fixed;\n}\n.kt-absolute {\n  position: absolute;\n}\n.kt-relative {\n  position: relative;\n}\n.kt-inset-0 {\n  inset: 0px;\n}\n.kt-left-0 {\n  left: 0px;\n}\n.kt-right-\\[-6px\\] {\n  right: -6px;\n}\n.kt-top-0 {\n  top: 0px;\n}\n.kt-top-1\\/2 {\n  top: 50%;\n}\n.kt-z-\\[-1\\] {\n  z-index: -1;\n}\n.kt-z-\\[10000\\] {\n  z-index: 10000;\n}\n.kt-z-\\[1\\] {\n  z-index: 1;\n}\n.kt-z-\\[2\\] {\n  z-index: 2;\n}\n.kt-m-5 {\n  margin: 1.25rem;\n}\n.kt-mb-4 {\n  margin-bottom: 1rem;\n}\n.kt-mt-1 {\n  margin-top: 0.25rem;\n}\n.kt-mt-2 {\n  margin-top: 0.5rem;\n}\n.kt-block {\n  display: block;\n}\n.kt-flex {\n  display: flex;\n}\n.kt-hidden {\n  display: none;\n}\n.kt-h-1 {\n  height: 0.25rem;\n}\n.kt-h-10 {\n  height: 2.5rem;\n}\n.kt-h-3 {\n  height: 0.75rem;\n}\n.kt-h-6 {\n  height: 1.5rem;\n}\n.kt-h-8 {\n  height: 2rem;\n}\n.kt-h-\\[110px\\] {\n  height: 110px;\n}\n.kt-h-\\[180px\\] {\n  height: 180px;\n}\n.kt-h-\\[18px\\] {\n  height: 18px;\n}\n.kt-h-\\[40\\%\\] {\n  height: 40%;\n}\n.kt-h-full {\n  height: 100%;\n}\n.kt-max-h-\\[180px\\] {\n  max-height: 180px;\n}\n.kt-w-0 {\n  width: 0px;\n}\n.kt-w-10 {\n  width: 2.5rem;\n}\n.kt-w-3 {\n  width: 0.75rem;\n}\n.kt-w-5 {\n  width: 1.25rem;\n}\n.kt-w-6 {\n  width: 1.5rem;\n}\n.kt-w-8 {\n  width: 2rem;\n}\n.kt-w-\\[110px\\] {\n  width: 110px;\n}\n.kt-w-\\[18px\\] {\n  width: 18px;\n}\n.kt-w-\\[40\\%\\] {\n  width: 40%;\n}\n.kt-w-\\[520px\\] {\n  width: 520px;\n}\n.kt-w-\\[70px\\] {\n  width: 70px;\n}\n.kt-w-\\[90\\%\\] {\n  width: 90%;\n}\n.kt-w-\\[95\\%\\] {\n  width: 95%;\n}\n.kt-w-full {\n  width: 100%;\n}\n.kt-min-w-0 {\n  min-width: 0px;\n}\n.kt-min-w-\\[90px\\] {\n  min-width: 90px;\n}\n.kt-max-w-\\[1000px\\] {\n  max-width: 1000px;\n}\n.kt-max-w-\\[650px\\] {\n  max-width: 650px;\n}\n.kt-flex-1 {\n  flex: 1 1 0%;\n}\n.kt-flex-shrink-0 {\n  flex-shrink: 0;\n}\n.kt-cursor-pointer {\n  cursor: pointer;\n}\n.kt-select-none {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n}\n.kt-flex-col {\n  flex-direction: column;\n}\n.kt-items-center {\n  align-items: center;\n}\n.kt-justify-end {\n  justify-content: flex-end;\n}\n.kt-justify-center {\n  justify-content: center;\n}\n.kt-justify-between {\n  justify-content: space-between;\n}\n.kt-gap-2\\.5 {\n  gap: 0.625rem;\n}\n.kt-gap-5 {\n  gap: 1.25rem;\n}\n.kt-overflow-hidden {\n  overflow: hidden;\n}\n.kt-text-ellipsis {\n  text-overflow: ellipsis;\n}\n.kt-whitespace-nowrap {\n  white-space: nowrap;\n}\n.kt-rounded {\n  border-radius: 0.25rem;\n}\n.kt-rounded-2xl {\n  border-radius: 1rem;\n}\n.kt-rounded-full {\n  border-radius: 9999px;\n}\n.kt-rounded-lg {\n  border-radius: 0.5rem;\n}\n.kt-border-none {\n  border-style: none;\n}\n.kt-bg-black\\/70 {\n  background-color: rgb(0 0 0 / 0.7);\n}\n.kt-bg-transparent {\n  background-color: transparent;\n}\n.kt-p-0 {\n  padding: 0px;\n}\n.kt-p-2 {\n  padding: 0.5rem;\n}\n.kt-p-5 {\n  padding: 1.25rem;\n}\n.kt-py-2\\.5 {\n  padding-top: 0.625rem;\n  padding-bottom: 0.625rem;\n}\n.kt-pb-2 {\n  padding-bottom: 0.5rem;\n}\n.kt-pb-2\\.5 {\n  padding-bottom: 0.625rem;\n}\n.kt-pr-2 {\n  padding-right: 0.5rem;\n}\n.kt-text-center {\n  text-align: center;\n}\n.kt-font-mono {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;\n}\n.kt-text-lg {\n  font-size: 1.125rem;\n  line-height: 1.75rem;\n}\n.kt-text-sm {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\n.kt-text-xs {\n  font-size: 0.75rem;\n  line-height: 1rem;\n}\n.kt-font-semibold {\n  font-weight: 600;\n}\n.kt-text-gray-400 {\n  --tw-text-opacity: 1;\n  color: rgb(156 163 175 / var(--tw-text-opacity, 1));\n}\n.kt-text-white {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity, 1));\n}\n.kt-opacity-0 {\n  opacity: 0;\n}\n.kt-opacity-20 {\n  opacity: 0.2;\n}\n.kt-opacity-90 {\n  opacity: 0.9;\n}\n.kt-transition-all {\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n.kt-transition-opacity {\n  transition-property: opacity;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n.kt-transition-transform {\n  transition-property: transform;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n\n/* \n * Base styles that apply to the host page elements\n * These use regular CSS (not Tailwind) to target Kemono's existing classes\n */\n\n.post-card {\n  position: relative !important;\n}\n\n.post-card__header {\n  padding: 5px !important;\n  z-index: 1 !important;\n  color: #fff !important;\n  white-space: nowrap !important;\n  overflow: hidden !important;\n  text-overflow: ellipsis !important;\n  max-width: 100% !important;\n  display: block !important;\n  position: relative !important;\n}\n\n.post-card:hover .post-card__header {\n  white-space: normal !important;\n  overflow: visible !important;\n  background: #2e1905 !important;\n  color: #fff !important;\n  padding: 4px 6px !important;\n  z-index: 9999 !important;\n  position: absolute !important;\n  width: auto !important;\n  max-width: 300px !important;\n  border-radius: 6px !important;\n}\n";

  const playerCss = "/* Modal Overlay */\n.kt-modal-overlay {\n    position: fixed;\n    inset: 0px;\n    z-index: 10000;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    background-color: rgb(0 0 0 / 0.7);\n    opacity: 0;\n    transition-property: opacity;\n    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    transition-duration: 300ms;\n    --tw-backdrop-blur: blur(4px);\n    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);\n}\n\n.kt-modal-overlay.kt-show {\n    opacity: 1;\n}\n\n/* Minimized State */\n.kt-modal-overlay.kt-minimized {\n    pointer-events: none;\n    background-color: transparent;\n    --tw-backdrop-blur:  ;\n    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);\n    align-items: flex-end;\n    justify-content: flex-end;\n}\n\n.kt-modal-overlay.kt-minimized .kt-player-container {\n    pointer-events: auto;\n    margin: 1.25rem;\n    width: 520px;\n    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);\n    transform: scale(1);\n}\n\n.kt-modal-overlay.kt-minimized .kt-album-art {\n    /* Visible in minimized mode */\n    display: flex !important;\n}\n\n.kt-modal-overlay.kt-minimized .kt-video-wrapper {\n    margin-bottom: 1rem;\n    height: 180px;\n    max-height: 180px;\n}\n\n.kt-modal-overlay.kt-minimized .kt-media-loader {\n    display: none;\n}\n\n.kt-modal-overlay.kt-minimized .kt-top-bar {\n    padding-bottom: 0.625rem;\n}\n\n.kt-modal-overlay.kt-minimized .kt-controls-right {\n    margin-left: 1rem;\n}\n\n/* Main Player Container */\n.kt-player-container {\n    position: relative;\n    z-index: 1;\n    overflow: hidden;\n    border-radius: 1rem;\n    box-sizing: border-box;\n    width: 90%;\n    max-width: 650px;\n    padding: 1.25rem;\n    display: flex;\n    flex-direction: column;\n    background-color: rgba(30, 30, 30, 0.95);\n    backdrop-filter: blur(20px);\n    -webkit-backdrop-filter: blur(20px);\n    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);\n    border: 1px solid rgba(255, 255, 255, 0.1);\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;\n    transform: scale(0.95) translateY(20px);\n    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n.kt-player-container.kt-video-mode {\n    width: 95%;\n    max-width: 1000px;\n}\n\n.kt-modal-overlay.kt-show .kt-player-container {\n    transform: scale(1) translateY(0);\n}\n\n/* Player Backdrop (blur effect) */\n.kt-player-backdrop {\n    pointer-events: none;\n    position: absolute;\n    inset: 0px;\n    z-index: -1;\n    opacity: 0.2;\n    background-size: cover;\n    background-position: center;\n    filter: blur(40px) saturate(150%);\n}\n\n/* Top Bar (Window Controls) */\n.kt-top-bar {\n    z-index: 20;\n    display: flex;\n    width: 100%;\n    justify-content: flex-end;\n    padding-bottom: 0.625rem;\n}\n\n.kt-window-controls {\n    display: flex;\n    gap: 0.5rem;\n}\n\n.kt-control-btn {\n    cursor: pointer;\n    border-radius: 9999px;\n    padding: 0.5rem;\n    --tw-text-opacity: 1;\n    color: rgb(255 255 255 / var(--tw-text-opacity, 1));\n    display: flex;\n    height: 2rem;\n    width: 2rem;\n    align-items: center;\n    justify-content: center;\n    transition-property: all;\n    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    transition-duration: 200ms;\n    background: rgba(0, 0, 0, 0.3);\n    backdrop-filter: blur(4px);\n    border: 1px solid rgba(255, 255, 255, 0.1);\n    font-size: 1.5rem;\n}\n\n.kt-control-btn:hover {\n    --tw-text-opacity: 1;\n    color: rgb(58 134 255 / var(--tw-text-opacity, 1));\n    background: rgba(255, 255, 255, 0.15);\n}\n\n.kt-control-btn.kt-close-btn:hover {\n    color: #ff4d4d;\n}\n\n/* Content Wrapper */\n.kt-content-wrapper {\n    position: relative;\n    z-index: 2;\n    display: flex;\n    width: 100%;\n    align-items: center;\n    gap: 1.25rem;\n}\n\n/* Video Wrapper */\n.kt-video-wrapper {\n    position: relative;\n    margin-bottom: 1rem;\n    width: 100%;\n    overflow: hidden;\n    border-radius: 0.5rem;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    background: #000;\n    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);\n}\n\n.kt-video-wrapper::after {\n    content: \"\";\n    pointer-events: none;\n    position: absolute;\n    inset: 0px;\n    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);\n}\n\n.kt-video-element {\n    display: block;\n    width: 100%;\n    outline: 2px solid transparent;\n    outline-offset: 2px;\n    max-height: 65vh;\n}\n\n/* Album Art */\n.kt-album-art {\n    height: 110px;\n    width: 110px;\n    flex-shrink: 0;\n    border-radius: 0.5rem;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    background-size: cover;\n    background-position: center;\n    background-color: rgba(255, 255, 255, 0.05);\n    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);\n    border: 1px solid rgba(255, 255, 255, 0.1);\n}\n\n.kt-album-art svg {\n    height: 40%;\n    width: 40%;\n    color: rgba(255, 255, 255, 0.2);\n}\n\n/* Main Column */\n.kt-main-column {\n    display: flex;\n    min-width: 0px;\n    flex: 1 1 0%;\n    flex-direction: column;\n    justify-content: center;\n}\n\n/* Title */\n.kt-title-container {\n    margin-bottom: 1rem;\n    display: flex;\n    cursor: pointer;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n            user-select: none;\n    align-items: center;\n    gap: 0.625rem;\n    padding-right: 0.625rem;\n}\n\n.kt-media-title {\n    min-width: 0px;\n    flex: 1 1 0%;\n    font-size: 1.125rem;\n    line-height: 1.75rem;\n    font-weight: 600;\n    --tw-text-opacity: 1;\n    color: rgb(255 255 255 / var(--tw-text-opacity, 1));\n    margin: 0px;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);\n}\n\n.kt-expand-arrow {\n    flex-shrink: 0;\n    font-size: 0.875rem;\n    line-height: 1.25rem;\n    --tw-text-opacity: 1;\n    color: rgb(156 163 175 / var(--tw-text-opacity, 1));\n    transition-property: transform;\n    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    transition-duration: 300ms;\n}\n\n.kt-title-container.kt-expanded .kt-media-title {\n    white-space: normal;\n    overflow-wrap: break-word;\n}\n\n.kt-title-container.kt-expanded .kt-expand-arrow {\n    --tw-rotate: 180deg;\n    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n\n/* Media Controls Container */\n.kt-controls-container {\n    width: 100%;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n            user-select: none;\n    --tw-text-opacity: 1;\n    color: rgb(255 255 255 / var(--tw-text-opacity, 1));\n}\n\n.kt-controls-container button {\n    cursor: pointer;\n    border-style: none;\n    background-color: transparent;\n    padding: 0px;\n    --tw-text-opacity: 1;\n    color: rgb(255 255 255 / var(--tw-text-opacity, 1));\n    opacity: 0.9;\n    transition-property: opacity;\n    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    transition-duration: 200ms;\n}\n\n.kt-controls-container button:hover {\n    opacity: 1;\n}\n\n.kt-controls-container button svg {\n    display: block;\n    height: 1.5rem;\n    width: 1.5rem;\n    stroke-width: 2;\n    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));\n}\n\n/* Controls Row */\n.kt-controls {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding-top: 0.5rem;\n    padding-bottom: 0.5rem;\n}\n\n.kt-controls-left,\n.kt-controls-right {\n    display: flex;\n    align-items: center;\n    gap: 1rem;\n}\n\n/* Play/Pause Button */\n.kt-play-pause-btn {\n    display: flex;\n    height: 2.5rem;\n    width: 2.5rem;\n    align-items: center;\n    justify-content: center;\n    border-radius: 9999px;\n    background: #fff !important;\n    color: #000 !important;\n    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);\n}\n\n.kt-play-pause-btn svg {\n    height: 18px;\n    width: 18px;\n    margin-left: 1px;\n}\n\n.kt-play-pause-btn .kt-play-icon {\n    display: block;\n    fill: currentColor;\n    stroke: none !important;\n}\n\n.kt-play-pause-btn .kt-pause-icon {\n    display: none;\n    fill: currentColor;\n    stroke: none !important;\n}\n\n.kt-player-container:not(.kt-paused) .kt-play-pause-btn .kt-play-icon {\n    display: none;\n}\n\n.kt-player-container:not(.kt-paused) .kt-play-pause-btn .kt-pause-icon {\n    display: block;\n    margin-left: 0;\n}\n\n/* Volume Container */\n.kt-volume-container {\n    display: flex;\n    align-items: center;\n    gap: 0.5rem;\n}\n\n.kt-volume-slider {\n    height: 0.25rem;\n    width: 70px;\n    cursor: pointer;\n    border-radius: 0.25rem;\n    -webkit-appearance: none;\n    -moz-appearance: none;\n         appearance: none;\n    background: rgba(255, 255, 255, 0.3);\n}\n\n.kt-volume-slider::-webkit-slider-thumb {\n    -webkit-appearance: none;\n    appearance: none;\n    width: 10px;\n    height: 10px;\n    background: #fff;\n    border-radius: 50%;\n    border: none;\n    cursor: pointer;\n}\n\n.kt-volume-slider::-moz-range-thumb {\n    width: 10px;\n    height: 10px;\n    background: #fff;\n    border-radius: 50%;\n    border: none;\n    cursor: pointer;\n}\n\n.kt-volume-btn svg {\n    height: 1.25rem;\n    width: 1.25rem;\n    stroke-width: 0;\n    fill: currentColor;\n}\n\n.kt-volume-btn .kt-low-volume-icon,\n.kt-volume-btn .kt-muted-icon {\n    display: none;\n}\n\n/* Time Display */\n.kt-time-container {\n    min-width: 90px;\n    white-space: nowrap;\n    text-align: center;\n    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;\n    font-size: 0.875rem;\n    line-height: 1.25rem;\n    color: rgba(255, 255, 255, 0.7);\n}\n\n/* Timeline */\n.kt-timeline-container {\n    margin-top: 0.375rem;\n    cursor: pointer;\n    padding-top: 0.625rem;\n    padding-bottom: 0.625rem;\n}\n\n.kt-timeline {\n    position: relative;\n    height: 0.25rem;\n    width: 100%;\n    border-radius: 0.25rem;\n    transition-property: all;\n    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    transition-duration: 200ms;\n    background-color: rgba(255, 255, 255, 0.15);\n}\n\n.kt-timeline-container:hover .kt-timeline {\n    height: 0.375rem;\n}\n\n.kt-timeline-container:hover .kt-progress-bar::after {\n    transform: translateY(-50%) scale(1);\n}\n\n.kt-progress-bar {\n    position: relative;\n    height: 100%;\n    width: 0px;\n    border-radius: 0.25rem;\n    background: linear-gradient(90deg, #3a86ff, #007bff);\n    transition: width 0.1s linear;\n}\n\n.kt-progress-bar::after {\n    content: \"\";\n    position: absolute;\n    right: -6px;\n    top: 50%;\n    height: 0.75rem;\n    width: 0.75rem;\n    border-radius: 9999px;\n    --tw-bg-opacity: 1;\n    background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));\n    transform: translateY(-50%) scale(0);\n    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n    transition: transform 0.2s;\n}\n\n.kt-buffered-bar,\n.kt-hover-indicator {\n    position: absolute;\n    top: 0px;\n    left: 0px;\n    height: 100%;\n    width: 0px;\n    border-radius: 0.25rem;\n    background-color: rgba(255, 255, 255, 0.2);\n}\n\n/* Media Loader */\n.kt-media-loader {\n    margin-top: 0.625rem;\n}\n\n.kt-progress-bar-loader {\n    height: 0.375rem;\n    width: 100%;\n    overflow: hidden;\n    border-radius: 0.25rem;\n    background-color: rgba(255, 255, 255, 0.1);\n}\n\n.kt-progress-fill {\n    height: 100%;\n    width: 0px;\n    background-image: linear-gradient(45deg, #007bff, #3a86ff);\n    transition: width 0.1s linear;\n}\n\n.kt-progress-text {\n    margin-top: 0.375rem;\n    text-align: center;\n    font-size: 0.75rem;\n    line-height: 1rem;\n    color: rgba(255, 255, 255, 0.6);\n}";

  function getConfig() {
    return {
      videoEnabled: GM_getValue("enableVideoPlayer", true)
    };
  }
  function registerMenuCommands(config) {
    GM_registerMenuCommand(
      `Video Player: ${config.videoEnabled ? "✅ ON" : "❌ OFF"} (Click to Toggle)`,
      () => {
        GM_setValue("enableVideoPlayer", !config.videoEnabled);
        location.reload();
      }
    );
  }

  function injectTitleShim() {
    const shimCode = `
    (function() {
      try {
        const S = String.prototype;
        const origSlice = S.slice;
        const origConcat = S.concat;
        let lastSliceValue = null;
        let lastSliceSource = null;
        
        Object.defineProperty(S, "slice", {
          configurable: true,
          writable: true,
          value: function(start, end) {
            const src = String(this);
            const out = origSlice.call(src, start, end);
            if (start === 0 && end === 50 && typeof out === "string" && src.length > 50) {
              lastSliceValue = out;
              lastSliceSource = src;
            } else {
              lastSliceValue = null;
              lastSliceSource = null;
            }
            return out;
          },
        });
        
        Object.defineProperty(S, "concat", {
          configurable: true,
          writable: true,
          value: function(...args) {
            try {
              if (
                (this === "" || String(this) === "") &&
                args.length === 2 &&
                args[1] === "..." &&
                typeof args[0] === "string" &&
                lastSliceValue !== null &&
                args[0] === lastSliceValue
              ) {
                return lastSliceSource;
              }
            } catch (e) {}
            return origConcat.apply(this, args);
          },
        });
      } catch (e) {}
    })();
  `;
    try {
      const script = document.createElement("script");
      script.textContent = shimCode;
      (document.head || document.documentElement).appendChild(script);
      script.remove();
    } catch {
    }
  }

  const icons = {
    music: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,3V12.26C11.5,12.09 11,12 10.5,12C8,12 6,14 6,16.5C6,19 8,21 10.5,21C13,21 15,19 15,16.5V6H19V3H12Z" /></svg>`,
    minimize: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19,13H5V11H19V13Z" /></svg>`,
    maximize: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19Z" /></svg>`,
    close: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg>`,
    play: `<svg class="kt-play-icon" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
    pause: `<svg class="kt-pause-icon" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`,
    volumeHigh: `<svg class="kt-high-volume-icon" viewBox="0 0 24 24"><path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" /></svg>`,
    volumeLow: `<svg class="kt-low-volume-icon" viewBox="0 0 24 24"><path d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z" /></svg>`,
    volumeMuted: `<svg class="kt-muted-icon" viewBox="0 0 24 24"><path d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,12.22 16.47,12.43 16.43,12.64L14,10.21V7.97C15.5,8.71 16.5,10.23 16.5,12Z" /></svg>`,
    fullscreen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>`,
    download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/></svg>`
  };

  function createPlayerTemplate() {
    return `
    <div class="kt-modal-overlay" id="kt-media-modal" style="display: none;">
      <div class="kt-player-container" id="kt-player-container">
        <div class="kt-player-backdrop"></div>

        <div class="kt-top-bar">
          <div class="kt-window-controls">
            <button id="kt-minimize-btn" class="kt-control-btn" aria-label="Minimize">
              ${icons.minimize}
            </button>
            <button id="kt-close-btn" class="kt-control-btn kt-close-btn" aria-label="Close">
              ${icons.close}
            </button>
          </div>
        </div>

        <!-- Video Element Wrapper -->
        <div class="kt-video-wrapper" style="display:none;">
          <video class="kt-video-element" id="kt-video-element" preload="metadata"></video>
        </div>

        <div class="kt-content-wrapper">
          <!-- Album Art (Audio Only) -->
          <div class="kt-album-art">
            ${icons.music}
          </div>

          <div class="kt-main-column">
            <div class="kt-title-container">
              <span class="kt-expand-arrow">▼</span>
              <h3 class="kt-media-title"></h3>
            </div>

            <!-- Audio Element (Hidden) -->
            <audio id="kt-audio-element" preload="metadata"></audio>

            <div class="kt-media-loader">
              <div class="kt-progress-bar-loader">
                <div class="kt-progress-fill"></div>
              </div>
              <div class="kt-progress-text">Buffering...</div>
            </div>

            <div class="kt-controls-container" style="display:none;">
              <div class="kt-timeline-container">
                <div class="kt-timeline">
                  <div class="kt-hover-indicator"></div>
                  <div class="kt-buffered-bar"></div>
                  <div class="kt-progress-bar"></div>
                </div>
              </div>
              <div class="kt-controls">
                <div class="kt-controls-left">
                  <button class="kt-play-pause-btn" aria-label="Play/Pause">
                    ${icons.play}
                    ${icons.pause}
                  </button>
                  <div class="kt-volume-container">
                    <button class="kt-volume-btn" aria-label="Mute/Unmute">
                      ${icons.volumeHigh}
                      ${icons.volumeLow}
                      ${icons.volumeMuted}
                    </button>
                    <input class="kt-volume-slider" type="range" min="0" max="1" step="any" value="1">
                  </div>
                  <div class="kt-time-container">
                    <span class="kt-current-time">0:00</span> / <span class="kt-total-time">0:00</span>
                  </div>
                </div>
                <div class="kt-controls-right">
                  <button class="kt-fullscreen-btn" aria-label="Fullscreen" style="display:none;">
                    ${icons.fullscreen}
                  </button>
                  <button class="kt-download-btn" aria-label="Download Media">
                    ${icons.download}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  }

  class MediaPlayer {
    isInitialized = false;
    elements = null;
    currentMediaEl = null;
    currentMediaUrl = null;
    currentFileName = "";
    currentType = "audio";
    activeRequest = null;
    lastVolume = 1;
    init() {
      if (this.isInitialized) return;
      const tempContainer = document.createElement("div");
      tempContainer.innerHTML = createPlayerTemplate().trim();
      const modal = tempContainer.firstChild;
      if (modal) {
        document.body.appendChild(modal);
      }
      this.elements = this.getElements();
      this.bindEvents();
      this.isInitialized = true;
    }
    getElements() {
      const $ = (sel) => {
        const el = document.querySelector(sel);
        if (!el) throw new Error(`Element not found: ${sel}`);
        return el;
      };
      return {
        modalOverlay: $("#kt-media-modal"),
        playerContainer: $("#kt-player-container"),
        backdrop: $(".kt-player-backdrop"),
        albumArt: $(".kt-album-art"),
        videoWrapper: $(".kt-video-wrapper"),
        audioEl: $("#kt-audio-element"),
        videoEl: $("#kt-video-element"),
        closeBtn: $("#kt-close-btn"),
        minimizeBtn: $("#kt-minimize-btn"),
        titleContainer: $(".kt-title-container"),
        titleEl: $(".kt-media-title"),
        loaderContainer: $(".kt-media-loader"),
        progressFill: $(".kt-progress-fill"),
        progressText: $(".kt-progress-text"),
        controlsContainer: $(".kt-controls-container"),
        playPauseBtn: $(".kt-play-pause-btn"),
        volumeBtn: $(".kt-volume-btn"),
        volumeSlider: $(".kt-volume-slider"),
        currentTimeEl: $(".kt-current-time"),
        totalTimeEl: $(".kt-total-time"),
        timelineContainer: $(".kt-timeline-container"),
        progressBar: $(".kt-progress-bar"),
        bufferedBar: $(".kt-buffered-bar"),
        hoverIndicator: $(".kt-hover-indicator"),
        downloadBtn: $(".kt-download-btn"),
        fullscreenBtn: $(".kt-fullscreen-btn")
      };
    }
    bindEvents() {
      const el = this.elements;
      el.closeBtn.addEventListener("click", () => this.close());
      el.minimizeBtn.addEventListener("click", (e) => this.toggleMinimize(e));
      el.modalOverlay.addEventListener("click", (e) => {
        if (e.target === el.modalOverlay) this.toggleMinimize(e);
      });
      el.titleContainer.addEventListener("click", () => {
        el.titleContainer.classList.toggle("kt-expanded");
      });
      [el.audioEl, el.videoEl].forEach((media) => {
        media.addEventListener("play", () => el.playerContainer.classList.remove("kt-paused"));
        media.addEventListener("pause", () => el.playerContainer.classList.add("kt-paused"));
        media.addEventListener("loadedmetadata", () => this.handleMetadataLoaded());
        media.addEventListener("timeupdate", () => this.handleTimeUpdate());
        media.addEventListener("progress", () => this.handleBufferUpdate());
        media.addEventListener("volumechange", () => this.updateVolumeUI());
        media.addEventListener("ended", () => el.playerContainer.classList.add("kt-paused"));
      });
      el.videoEl.addEventListener("click", () => this.togglePlay());
      el.videoEl.addEventListener("dblclick", () => this.toggleFullscreen());
      el.playPauseBtn.addEventListener("click", () => this.togglePlay());
      el.volumeBtn.addEventListener("click", () => this.toggleMute());
      el.volumeSlider.addEventListener("input", (e) => {
        if (this.currentMediaEl) {
          this.currentMediaEl.volume = parseFloat(e.target.value);
        }
      });
      el.downloadBtn.addEventListener("click", () => this.downloadMedia());
      el.fullscreenBtn.addEventListener("click", () => this.toggleFullscreen());
      el.timelineContainer.addEventListener("mousemove", (e) => this.handleTimelineHover(e));
      el.timelineContainer.addEventListener("click", (e) => this.handleTimelineSeek(e));
    }
    toggleMinimize(e) {
      e.stopPropagation();
      const el = this.elements;
      el.modalOverlay.classList.toggle("kt-minimized");
      const isMinimized = el.modalOverlay.classList.contains("kt-minimized");
      if (isMinimized) {
        document.body.style.overflow = "";
        el.minimizeBtn.innerHTML = icons.maximize;
      } else {
        document.body.style.overflow = "hidden";
        el.minimizeBtn.innerHTML = icons.minimize;
      }
    }
    toggleFullscreen() {
      if (this.currentType !== "video") return;
      const el = this.elements;
      if (!document.fullscreenElement) {
        if (el.videoEl.requestFullscreen) {
          el.videoEl.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
    handleMetadataLoaded() {
      if (!this.currentMediaEl) return;
      const el = this.elements;
      el.playerContainer.classList.add("kt-paused");
      el.totalTimeEl.textContent = this.formatTime(this.currentMediaEl.duration);
      this.currentMediaEl.volume = parseFloat(el.volumeSlider.value);
      this.updateVolumeUI();
      this.currentMediaEl.play().catch(() => {
      });
    }
    togglePlay() {
      if (!this.currentMediaEl) return;
      if (this.currentMediaEl.paused) {
        this.currentMediaEl.play();
      } else {
        this.currentMediaEl.pause();
      }
    }
    toggleMute() {
      if (!this.currentMediaEl) return;
      if (this.currentMediaEl.volume > 0) {
        this.lastVolume = this.currentMediaEl.volume;
        this.currentMediaEl.volume = 0;
      } else {
        this.currentMediaEl.volume = this.lastVolume;
      }
    }
    handleTimeUpdate() {
      if (!this.currentMediaEl) return;
      const el = this.elements;
      el.currentTimeEl.textContent = this.formatTime(this.currentMediaEl.currentTime);
      if (this.currentMediaEl.duration) {
        const percent = this.currentMediaEl.currentTime / this.currentMediaEl.duration * 100;
        el.progressBar.style.width = `${percent}%`;
      }
    }
    handleBufferUpdate() {
      if (!this.currentMediaEl || !this.currentMediaEl.duration) return;
      const el = this.elements;
      for (let i = 0; i < this.currentMediaEl.buffered.length; i++) {
        const start = this.currentMediaEl.buffered.start(i);
        const end = this.currentMediaEl.buffered.end(i);
        if (start <= this.currentMediaEl.currentTime && this.currentMediaEl.currentTime <= end) {
          const percent = end / this.currentMediaEl.duration * 100;
          el.bufferedBar.style.width = `${percent}%`;
          break;
        }
      }
    }
    handleTimelineHover(e) {
      const el = this.elements;
      const rect = el.timelineContainer.getBoundingClientRect();
      const pos = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
      el.hoverIndicator.style.width = `${pos / rect.width * 100}%`;
    }
    handleTimelineSeek(e) {
      if (!this.currentMediaEl) return;
      const el = this.elements;
      const rect = el.timelineContainer.getBoundingClientRect();
      const pos = Math.min(Math.max(0, e.clientX - rect.left), rect.width) / rect.width;
      this.currentMediaEl.currentTime = pos * this.currentMediaEl.duration;
    }
    updateVolumeUI() {
      if (!this.currentMediaEl) return;
      const el = this.elements;
      el.volumeSlider.value = String(this.currentMediaEl.volume);
      const highIcon = el.volumeBtn.querySelector(".kt-high-volume-icon");
      const lowIcon = el.volumeBtn.querySelector(".kt-low-volume-icon");
      const mutedIcon = el.volumeBtn.querySelector(".kt-muted-icon");
      [highIcon, lowIcon, mutedIcon].forEach((i) => i.style.display = "none");
      if (this.currentMediaEl.volume === 0 || this.currentMediaEl.muted) {
        mutedIcon.style.display = "block";
      } else if (this.currentMediaEl.volume < 0.5) {
        lowIcon.style.display = "block";
      } else {
        highIcon.style.display = "block";
      }
    }
    formatTime(t) {
      if (isNaN(t)) return "0:00";
      const result = new Date(t * 1e3).toISOString().substr(11, 8);
      return result.startsWith("00:") ? result.substr(3) : result;
    }
    formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals < 0 ? 0 : decimals))} ${sizes[i]}`;
    }
    downloadMedia() {
      if (!this.currentMediaEl) return;
      const url = this.currentMediaEl.src;
      const name = this.currentFileName || "kemono-media";
      if (typeof GM_download === "function") {
        GM_download({
          url,
          name,
          saveAs: true
        });
        return;
      }
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    handleKeyboardShortcuts = (e) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === "input") return;
      const el = this.elements;
      if (!el.modalOverlay.classList.contains("kt-show")) return;
      switch (e.key.toLowerCase()) {
        case "escape":
          this.close();
          break;
        case " ":
          if (activeTag !== "button") {
            e.preventDefault();
            this.togglePlay();
          }
          break;
        case "f":
          this.toggleFullscreen();
          break;
        case "m":
          this.toggleMute();
          break;
        case "arrowright":
          if (this.currentMediaEl) {
            this.currentMediaEl.currentTime = Math.min(
              this.currentMediaEl.duration,
              this.currentMediaEl.currentTime + 5
            );
          }
          break;
        case "arrowleft":
          if (this.currentMediaEl) {
            this.currentMediaEl.currentTime = Math.max(0, this.currentMediaEl.currentTime - 5);
          }
          break;
      }
    };
    open(url, fileName, type) {
      if (this.currentMediaUrl) {
        URL.revokeObjectURL(this.currentMediaUrl);
      }
      const el = this.elements;
      this.currentFileName = fileName;
      this.currentType = type;
      el.titleContainer.classList.remove("kt-expanded");
      el.modalOverlay.classList.remove("kt-minimized");
      el.minimizeBtn.innerHTML = icons.minimize;
      el.titleEl.textContent = fileName;
      el.loaderContainer.style.display = "block";
      el.controlsContainer.style.display = "none";
      el.progressFill.style.width = "0%";
      el.progressText.textContent = "Initializing...";
      el.modalOverlay.style.display = "flex";
      el.audioEl.pause();
      el.videoEl.pause();
      el.audioEl.removeAttribute("src");
      el.videoEl.removeAttribute("src");
      const img = document.querySelector(".post__thumbnail img") || document.querySelector(".post__content img") || document.querySelector(".user-header__avatar img") || document.querySelector("img.fancy-image__image");
      if (img && img.src) {
        el.backdrop.style.backgroundImage = `url('${img.src}')`;
        el.albumArt.style.backgroundImage = `url('${img.src}')`;
        el.albumArt.innerHTML = "";
      } else {
        el.backdrop.style.backgroundImage = "none";
        el.albumArt.style.backgroundImage = "none";
        el.albumArt.innerHTML = icons.music;
      }
      if (type === "video") {
        this.currentMediaEl = el.videoEl;
        el.playerContainer.classList.add("kt-video-mode");
        el.albumArt.style.display = "none";
        el.videoWrapper.style.display = "flex";
        el.fullscreenBtn.style.display = "block";
        el.videoEl.src = url;
        el.videoEl.load();
        el.loaderContainer.style.display = "none";
        el.controlsContainer.style.display = "block";
      } else {
        this.currentMediaEl = el.audioEl;
        el.playerContainer.classList.remove("kt-video-mode");
        el.albumArt.style.display = "flex";
        el.videoWrapper.style.display = "none";
        el.fullscreenBtn.style.display = "none";
        this.activeRequest = GM_xmlhttpRequest({
          method: "GET",
          url,
          responseType: "blob",
          onprogress: (p) => {
            if (p.lengthComputable) {
              const percent = Math.round(p.loaded / p.total * 100);
              el.progressFill.style.width = `${percent}%`;
              el.progressText.textContent = `Downloading... ${percent}% (${this.formatBytes(p.loaded)} / ${this.formatBytes(p.total)})`;
            }
          },
          onload: (res) => {
            this.activeRequest = null;
            this.currentMediaUrl = URL.createObjectURL(res.response);
            el.audioEl.src = this.currentMediaUrl;
            el.audioEl.load();
            el.loaderContainer.style.display = "none";
            el.controlsContainer.style.display = "block";
          },
          onerror: () => {
            this.activeRequest = null;
            el.progressText.textContent = "Error: Could not load audio file.";
          },
          onabort: () => {
            this.activeRequest = null;
          }
        });
      }
      setTimeout(() => el.modalOverlay.classList.add("kt-show"), 10);
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", this.handleKeyboardShortcuts);
    }
    close() {
      const el = this.elements;
      if (this.activeRequest) this.activeRequest.abort();
      if (this.currentMediaEl) this.currentMediaEl.pause();
      el.modalOverlay.classList.remove("kt-show");
      setTimeout(() => {
        el.modalOverlay.style.display = "none";
        el.modalOverlay.classList.remove("kt-minimized");
        if (this.currentMediaUrl) {
          URL.revokeObjectURL(this.currentMediaUrl);
          this.currentMediaUrl = null;
        }
        el.audioEl.removeAttribute("src");
        el.videoEl.removeAttribute("src");
        el.videoEl.load();
        el.audioEl.load();
        this.currentFileName = "";
      }, 300);
      document.body.style.overflow = "";
      document.removeEventListener("keydown", this.handleKeyboardShortcuts);
    }
  }

  try {
    const style = document.createElement("style");
    style.textContent = baseCss + playerCss;
    (document.head || document.documentElement).appendChild(style);
  } catch (e) {
  }
  let config;
  try {
    config = getConfig();
    registerMenuCommands(config);
  } catch (e) {
    console.error("[KemonoTweaks] Error loading config:", e);
    config = { videoEnabled: true };
  }
  try {
    injectTitleShim();
  } catch (e) {
    console.error("[KemonoTweaks] Error injecting title shim:", e);
  }
  const mediaPlayer = new MediaPlayer();
  function initializeScript() {
    try {
      mediaPlayer.init();
      const audioExtensions = /\.(mp3|wav|m4a|ogg|flac)$/i;
      const videoExtensions = /\.(mp4|m4v|webm|mov)$/i;
      window.addEventListener(
        "click",
        (e) => {
          const link = e.target.closest(
            'a[href*="?f="]'
          );
          if (link) {
            let type = null;
            let checkStr = "";
            try {
              const urlParams = new URLSearchParams(link.search);
              checkStr = urlParams.get("f") || "";
            } catch {
            }
            if (!checkStr) {
              checkStr = link.pathname;
            }
            if (audioExtensions.test(checkStr)) {
              type = "audio";
            } else if (config.videoEnabled && videoExtensions.test(checkStr)) {
              type = "video";
            }
            if (type) {
              e.preventDefault();
              e.stopPropagation();
              let title = "Media Player";
              const titleElement = document.querySelector("h1.post__title");
              if (titleElement) {
                title = titleElement.textContent?.trim() || title;
              } else if (checkStr) {
                title = decodeURIComponent(checkStr);
              }
              mediaPlayer.open(link.href, title, type);
            }
          }
        },
        true
        // Capture phase
      );
    } catch (e) {
      console.error("[KemonoTweaks] Error in initializeScript:", e);
    }
  }
  if (document.body) {
    initializeScript();
  } else {
    new MutationObserver((_, observer) => {
      if (document.body) {
        initializeScript();
        observer.disconnect();
      }
    }).observe(document.documentElement, { childList: true });
  }

})();
