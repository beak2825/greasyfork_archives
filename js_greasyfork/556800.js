// ==UserScript==
// @name         Disney Plus Subtitle Styler
// @namespace    https://tampermonkey.net/
// @version      2025.11.24
// @description  Replaces Disney Plus subtitles with the GothamPro font, enforces a transparent background, improves readability, and adds automatic line spacing control.
// @author       neura-neura
// @license      MIT
// @match        https://www.disneyplus.com/*
// @icon         https://www.disneyplus.com/favicon.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/556800/Disney%20Plus%20Subtitle%20Styler.user.js
// @updateURL https://update.greasyfork.org/scripts/556800/Disney%20Plus%20Subtitle%20Styler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Style variables for easy customization
    const fontFamily = "'GothamPro', sans-serif";
    const fontWeight = "500";
    const fontSize = "3rem"; // Adjust as needed
    const backgroundColor = "transparent";
    const textShadow = "rgb(0, 0, 0) 0px 0px 7px, rgba(0, 0, 0, 0.8) 0px 0px 18px";
    const position = "relative";
    const marginBottom = "8rem"; // Lifts subtitles upward
    const lineHeight = "1.5";
    const lineHeightReduced = "0.5"; // For two-line subtitles

    GM_addStyle(`
        @import url('https://cdn.jsdelivr.net/npm/gotham-pro-font@1.0.0/fonts.min.css');

        .dss-subtitle-renderer-cue,
        .hive-subtitle-renderer-cue {
            font-family: ${fontFamily} !important;
            font-weight: ${fontWeight} !important;
            font-size: ${fontSize} !important;
            background-color: ${backgroundColor} !important;
            position: ${position} !important;
            margin-bottom: ${marginBottom} !important;
            text-shadow: ${textShadow} !important;
            line-height: ${lineHeight} !important;
        }

        .dss-subtitle-renderer-cue > div,
        .hive-subtitle-renderer-cue > div {
            font-size: ${fontSize} !important;
            color: white !important;
            background-color: ${backgroundColor} !important;
            line-height: ${lineHeight} !important;
            text-shadow: ${textShadow} !important;
        }

        .dss-subtitle-renderer-cue > div > span,
        .hive-subtitle-renderer-cue > div > span {
            background-color: ${backgroundColor} !important;
            color: white !important;
        }

        .dss-subtitle-renderer-cue * {
            background-color: ${backgroundColor} !important;
        }

        .dss-subtitle-renderer-cue.serif,
        .hive-subtitle-renderer-cue.serif {
            font-family: serif !important;
        }

        .dss-subtitle-renderer-cue.fantasy,
        .hive-subtitle-renderer-cue.fantasy {
            font-family: fantasy !important;
        }

        .dss-subtitle-renderer-cue.monospace,
        .hive-subtitle-renderer-cue.monospace {
            font-family: monospace !important;
        }

        .hive-subtitle-renderer-cue-window {
            line-height: ${lineHeightReduced} !important;
        }

        .hive-subtitle-renderer-cue > div {
            line-height: ${lineHeight} !important;
        }

        .hive-subtitle-renderer-line {
            line-height: ${lineHeight} !important;
        }
    `);

    function inspectAndFixSubtitles() {
        const subtitleElements = document.querySelectorAll('.dss-subtitle-renderer-cue, .hive-subtitle-renderer-cue');

        if (subtitleElements.length > 0) {
            subtitleElements.forEach((subtitleElement) => {
                const computedStyles = window.getComputedStyle(subtitleElement);

                if (
                    computedStyles.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
                    computedStyles.backgroundColor !== 'transparent'
                ) {
                    subtitleElement.style.backgroundColor = "transparent";
                }

                const subtitleLines = subtitleElement.querySelectorAll('.hive-subtitle-renderer-line');

                subtitleLines.forEach((line) => {
                    const lineStyles = window.getComputedStyle(line);
                    if (
                        lineStyles.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
                        lineStyles.backgroundColor !== 'transparent'
                    ) {
                        line.style.backgroundColor = "transparent";
                    }
                });

                if (subtitleLines.length > 1) {
                    subtitleElement.style.lineHeight = lineHeightReduced;
                } else {
                    subtitleElement.style.lineHeight = lineHeight;
                }
            });
        } else {
            console.log("No subtitle elements found in the DOM.");
        }
    }

    function monitorSubtitlesContinually() {
        const observer = new MutationObserver(() => {
            inspectAndFixSubtitles();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    monitorSubtitlesContinually();
    inspectAndFixSubtitles();
})();
