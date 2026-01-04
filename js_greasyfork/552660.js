// ==UserScript==
// @name         Youtube留言區上色
// @name:en      make YT comments background colorful
// @description  將留言區的顯示顏色改為與影片描述相同(旨在改善DeveloperMDCM/Youtube-tools-extension的自定背景功能的暫時解決方案)
// @description:en Change the comment area's display color to the same as the video description (a temporary solution to improve the custom background function of DeveloperMDCM/Youtube-tools-extension)

// @author       Max
// @namespace    https://github.com/Max46656

// @version      1.2.0
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/552660/Youtube%E7%95%99%E8%A8%80%E5%8D%80%E4%B8%8A%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/552660/Youtube%E7%95%99%E8%A8%80%E5%8D%80%E4%B8%8A%E8%89%B2.meta.js
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
