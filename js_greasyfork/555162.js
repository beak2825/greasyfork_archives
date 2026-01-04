// ==UserScript==
// @name         X-Fwilter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Filter away self-reposts, videos, images, texts, ..
// @author       TheFeThrone
// @match        https://x.com/*
// @exclude      *://x.com/i/*
// @exclude      *://x.com/hashtag/*
// @exclude      *://x.com/notifications/*
// @exclude      *://x.com/settings/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/555162/X-Fwilter.user.js
// @updateURL https://update.greasyfork.org/scripts/555162/X-Fwilter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONSTANTS & CONFIG ---

    const FILTERS = {
        SelfPost: 'self',
        Video: 'video',
        Image: 'image',
        Text: 'text'
    };

    const ICONS = {
        retweet: "https://raw.githubusercontent.com/TheFeThrone/X-Fwilter/refs/heads/main/icons/selfretweet.svg",
        video: "https://raw.githubusercontent.com/TheFeThrone/X-Fwilter/refs/heads/main/icons/film.svg",
        image: "https://raw.githubusercontent.com/TheFeThrone/X-Fwilter/refs/heads/main/icons/image.svg",
        text: "https://raw.githubusercontent.com/TheFeThrone/X-Fwilter/refs/heads/main/icons/book.svg"
    };

    const FILTER_ICON_MAP = {
        SelfPost: 'retweet',
        Video: 'video',
        Image: 'image',
        Text: 'text'
    };

    let dynamicStyleElement = null;

    // --- STYLE MANAGEMENT ---

    function setupStyles() {
        GM_addStyle(`
            .fwilter-wrapper {
                display: flex;
                flex-direction: column;
                align-items: center;
                position: sticky;
            }
            #fwilter {
                display: flex;
            }
            #fwilter > div { margin: 0 8px; position: relative; } /* Added position relative */
            #fwilter input[type="checkbox"] { display: none; }

            #fwilter input[type="checkbox"] + label {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
                border: 1px solid #cfd9de;
                border-radius: 50%;
                cursor: pointer;
                transition: background-color 0.2s ease;
            }

            #fwilter input[type="checkbox"] + label::before {
                content: '';
                width: 20px;
                height: 20px;
                background-color: #c8a2c8;
                mask-image: var(--fwilter-visible-svg);
                mask-size: contain;
                mask-position: center;
                mask-repeat: no-repeat;
            }
            #fwilter input[type="checkbox"]:checked + label::before {
                background-color: #E0245E;
            }

            #fwilter input[type="checkbox"] + label::before:hover {
                background-color: violet;
            }
        `);

        // Inject icon definitions into the page
        let iconVariablesCSS = ':root {\n';
        for (const key in ICONS) {
            iconVariablesCSS += `    --icon-${key}-visible: url("${ICONS[key]}");\n`;
        }
        iconVariablesCSS += '}';
        const iconStyleElement = document.createElement('style');
        iconStyleElement.id = 'fwilter-icon-definitions';
        iconStyleElement.textContent = iconVariablesCSS;
        document.head.appendChild(iconStyleElement);
    }

    function updateFilterStyles() {
        let cssToApply = '';
        for (const [checkboxId, filterType] of Object.entries(FILTERS)) {
            const checkbox = document.getElementById(checkboxId);
            if (checkbox && checkbox.checked) {
                cssToApply += `[data-testid="cellInnerDiv"][fwilter-types~="${filterType}"] { display: none; }\n`;
            }
        }
        if (!dynamicStyleElement) {
            dynamicStyleElement = document.createElement('style');
            dynamicStyleElement.id = 'fwilter-dynamic-rules';
            document.head.appendChild(dynamicStyleElement);
        }
        dynamicStyleElement.textContent = cssToApply;
    }


    // --- UTILITY FUNCTIONS ---

    /**
     * Waits for a specific element to appear in the DOM.
     * @param {string} selector - The CSS selector for the element.
     * @returns {Promise<Element>}
     */
    function waitForElement(selector, base=document) {
        return new Promise(resolve => {
            if (base.querySelector(selector)) {
                return resolve(base.querySelector(selector));
            }

            const observer = new MutationObserver(() => {
                if (base.querySelector(selector)) {
                    resolve(base.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(base, {
                subtree: true,
                childList: true,
            });
        });
    }

    /**
     * Finds tweet that is self-repost.
     * @param {HTMLElement} tweet - The tweet element.
     * @returns {boolean} - True if the tweet was hidden.
     */
    function isSelfRepost(tweet) {
        const poster = tweet.querySelector('[data-testid="User-Name"] span span')?.textContent;
        const reposter = tweet.querySelector('[data-testid="socialContext"] span')?.textContent;
        if (poster && reposter && reposter.includes(poster)) {
            return true;
        }
        return false;
    }

    // --- TWEET PROCESSING ---
    /**
     * Main processing function for each tweet.
     * @param {HTMLElement} tweet - The tweet element.
     */
    function processTweet(tweet) {
        const types = [];

        if (isSelfRepost(tweet)) {
            types.push('self');
        }

        const tweetMedia = tweet.querySelector('div[data-testid="tweetPhoto"]');
        if (tweetMedia) {
            const hasVideo = tweetMedia.querySelector('video, [data-testid="previewInterstitial"]');
            const hasImage = tweetMedia.querySelector('img:not([src*="profile_images"]');

            if (hasVideo) {
                types.push('video');
            } else if (hasImage) {
                types.push('image');
            }
        } else {
            types.push('text');
        }

        tweet.setAttribute('fwilter-types', types.join(' '));
    }

    async function processExisting(){
        const timeline = await getTimeline();
        const first = await waitForElement('[data-testid="cellInnerDiv"]', timeline);
        if (first) {
            const tweets = Array.from(document.querySelectorAll('[data-testid="cellInnerDiv"]'));
            if(tweets.length==0) {
                return;
            }
            //showStatus("Processing existing tweets");
            for (const tweet of tweets) {
                await processTweet(tweet);
            }
        } else {
            return;
        }
    }

    async function createUI() {
        const timeline = await getTimeline();
        let uiBase = document.querySelector('[data-testid="primaryColumn"] .css-175oi2r.r-1awozwy.r-18u37iz.r-h3s6tt.r-1777fci.r-f8sm7e.r-13qz1uu.r-gu64tb');
        if (!uiBase || !uiBase.childNodes) {
            // Profile case
            const timelineTabs = document.getElementsByClassName("TimelineTabs");
            if (timelineTabs.length > 0) uiBase = timelineTabs[0];
        }
        // 1. Create a new wrapper for UI
        const flexWrapper = document.createElement('div');
        flexWrapper.className = 'fwilter-wrapper';

        // 2. Create the container for the filter buttons
        const fwilterContainer = document.createElement('div');
        fwilterContainer.id = 'fwilter';
        for (const purpose in FILTERS) {
            createCheckbox(purpose, fwilterContainer);
        }

        flexWrapper.appendChild(fwilterContainer);
        uiBase.appendChild(flexWrapper);

    }

    function createCheckbox(purpose, fwilterContainer) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = purpose;
        checkbox.addEventListener('change', updateFilterStyles);

        const label = document.createElement("label");
        label.htmlFor = purpose;
        label.title = purpose;

        const iconKey = FILTER_ICON_MAP[purpose];
        if (iconKey) {
            label.style.setProperty('--fwilter-visible-svg', `var(--icon-${iconKey}-visible)`);
        }

        const wrapper = document.createElement("div");
        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        fwilterContainer.appendChild(wrapper);
    }
    // --- FILTERING LOGIC ---

    function init() {
        createUI();
        setupStyles();
        updateFilterStyles();
        setTimeout( async function() {
            const timeline = await getTimeline();
            if (timeline) {
                feedObserver.observe(document.body, { childList: true, subtree: true });
                await processExisting();
            }
        }, 1000);
         // Run once on startup to apply initial filter state
    }


    // --- OBSERVERS ---


    const tweetObserver = new IntersectionObserver(async (entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const tweet = entry.target;
            await processTweet(tweet);
            tweetObserver.unobserve(tweet);
        }
    }, { root: document, rootMargin: "5px 0px" });

    const feedObserver = new MutationObserver(async (mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) {
                    const tweets =
                          node.matches('[data-testid="cellInnerDiv"]') ? [node] :
                          node.querySelectorAll('[data-testid="cellInnerDiv"]');
                    tweets.forEach( async tweet => {
                        if(!tweet.dataset.uncropid) {
                            tweetObserver.observe(tweet);
                        }
                    });
                }
            }
        }
    });

    async function getTimeline(){
        return await waitForElement('[aria-label*="Timeline"]');
    }


    init();
})();
