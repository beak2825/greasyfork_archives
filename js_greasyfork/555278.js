// ==UserScript==
// @name         YT Comments Color v3
// @name:en      YT Comments Color v3
// @description  Change the comment area's display color to the same as the video description (a temporary solution to improve the custom background function of DeveloperMDCM/Youtube-tools-extension)
// @description:en Change the comment area's display color to the same as the video description (a temporary solution to improve the custom background function of DeveloperMDCM/Youtube-tools-extension)
// @author       Max
// @namespace    https://github.com/
// @version      3
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/555278/YT%20Comments%20Color%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/555278/YT%20Comments%20Color%20v3.meta.js
// ==/UserScript==

class HoverStyleManager {
    #propertiesToCopy = [
        '--yt-saturated-base-background',
        '--yt-saturated-raised-background',
        '--yt-saturated-additive-background',
        '--yt-saturated-text-primary',
        '--yt-saturated-text-secondary',
    ];
    #targetSelectors = [
        'div#title.ytd-watch-metadata',
        'div#description',
        'ytd-item-section-renderer[section-identifier="comment-item-section"]'
    ];
    constructor() {
        this.observer = null;
        this.init();
    }
    isMetadataStyleReady(element) {
        const style = getComputedStyle(element);
        return style.getPropertyValue('--yt-saturated-base-background').trim() !== '' &&
               style.getPropertyValue('--yt-saturated-text-primary').trim() !== '';
    }
    injectDefaultStyles() {
        const isDarkTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const defaultBgColor = isDarkTheme ? '#0f0f0f' : '#ffffff';
        const defaultTextColor = isDarkTheme ? '#f1f1f1' : '#030303';
        let cssRules = '';
        this.#targetSelectors.forEach(selector => {
            cssRules += `${selector}:hover {\n`;
            cssRules += `    background-color: ${defaultBgColor};\n`;
            cssRules += `    color: ${defaultTextColor};\n`;
            cssRules += '}\n';
        });
        GM_addStyle(cssRules);
    }
    injectMetadataStyles(metadataElement) {
        const style = getComputedStyle(metadataElement);
        let cssRules = '';
        this.#targetSelectors.forEach(selector => {
            cssRules += `${selector}:hover {\n`;
            this.#propertiesToCopy.forEach(prop => {
                const value = style.getPropertyValue(prop);
                if (value && value !== 'initial') {
                    cssRules += `    ${prop}: ${value};\n`;
                }
            });
            const bgColor = style.getPropertyValue('--yt-saturated-raised-background');
            const textColor = style.getPropertyValue('--yt-saturated-text-primary');
            if (bgColor && bgColor !== 'initial') {
                cssRules += `    background-color: ${bgColor};\n`;
            }
            if (textColor && textColor !== 'initial') {
                cssRules += `    color: ${textColor};\n`;
            }
            cssRules += '}\n';
        });
        GM_addStyle(cssRules);
    }
    setupObserver() {
        this.observer = new MutationObserver((mutations, obs) => {
            const metadataElement = document.querySelector('ytd-watch-metadata');
            if (metadataElement && this.isMetadataStyleReady(metadataElement)) {
                this.injectMetadataStyles(metadataElement);
                obs.disconnect();
            }
        });
        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    init() {
        this.injectDefaultStyles();
        const initialCheck = document.querySelector('ytd-watch-metadata');
        if (initialCheck && this.isMetadataStyleReady(initialCheck)) {
            this.injectMetadataStyles(initialCheck);
        } else {
            this.setupObserver();
        }
    }
}

new HoverStyleManager();