// ==UserScript==
// @name           Makerworld Enhancements
// @description    Enhancements for Makerworld website
// @version        1.0.4
// @icon           https://raw.githubusercontent.com/JMcrafter26/userscripts/main/makerworld-enhancements/icon.png?raw=true
//
// @author         Cufiy (aka JMcrafter26) <https://cufiy.net>
// @namespace      https://github.com/JMcrafter26/userscripts
//
// @supportURL     https://github.com/JMcrafter26/userscripts/issues
// @homepageURL    https://github.com/JMcrafter26/userscripts/tree/main/makerworld-enhancements
//
// @license        AGPL-3.0
// @copyright      Copyright (C) 2025, Cufiy
//
// @match          https://makerworld.com/*
// @match          https://makerworld.com.cn/*
//
// @run-at         document-end
//
// @downloadURL https://update.greasyfork.org/scripts/560107/Makerworld%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/560107/Makerworld%20Enhancements.meta.js
// ==/UserScript==

/**
 * Makerworld Enhancements Userscript
 *
 * @see http://wiki.greasespot.net/API_reference
 * @see http://wiki.greasespot.net/Metadata_Block
 */
(function () {

    const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles-icon lucide-sparkles"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>`;

    function getEnhancementOptions(context = 'card') {
        const options = [
            {
                text: 'Search on Printables',
                icon: 'https://unpkg.com/lucide-static@latest/icons/search.svg',
                for: 'card,details',
                action: (contextData) => {
                    const name = context === 'details' ? getModelNameFromPage() : getCardName(contextData);
                    if (!name) {
                        alert('Could not find design name.');
                        return;
                    }
                    const query = encodeURIComponent(name);
                    window.open(`https://www.printables.com/search?q=${query}`, '_blank');
                }
            },
            {
                text: 'Search on Thingiverse',
                icon: 'https://unpkg.com/lucide-static@latest/icons/search.svg',
                for: 'card,details',
                action: (contextData) => {
                    const name = context === 'details' ? getModelNameFromPage() : getCardName(contextData);
                    if (!name) {
                        alert('Could not find design name.');
                        return;
                    }
                    const query = encodeURIComponent(name);
                    window.open(`https://www.thingiverse.com/search?q=${query}`, '_blank');
                }
            },
            {
                text: 'Open in Bambu Studio',
                icon: 'https://unpkg.com/lucide-static@latest/icons/box.svg',
                for: 'card',
                action: (contextData) => {
                    const url = context === 'details' ? window.location.href : getCardUrl(contextData);
                    if (!url) {
                        alert('Could not find design URL.');
                        return;
                    }
                    getModelDetails(url).then(data => {
                        if (!data) {
                            alert('Could not fetch model details.');
                            return;
                        }
                        const printProfiles = data.pageProps?.design?.instances || [];
                        if (!printProfiles || printProfiles.length === 0) {
                            alert('No print profiles found for this model.');
                            return;
                        }
                        const firstProfileId = printProfiles[0].id;
                        const modelSlug = getModelSlug(url);
                        try {
                            openInBambuStudio(firstProfileId, modelSlug);
                        } catch (error) {
                            console.error('Error opening in Bambu Studio:', error);
                            alert('An error occurred while trying to open in Bambu Studio.');
                        }
                    });
                }
            },
            {
                text: 'Download 3MF Model',
                icon: 'https://unpkg.com/lucide-static@latest/icons/download.svg',
                for: 'card',
                action: (contextData) => {
                    const url = context === 'details' ? window.location.href : getCardUrl(contextData);
                    if (!url) {
                        alert('Could not find design URL.');
                        return;
                    }
                    getModelDetails(url).then(data => {
                        if (!data) {
                            alert('Could not fetch model details.');
                            return;
                        }
                        const printProfiles = data.pageProps?.design?.instances || [];
                        if (!printProfiles || printProfiles.length === 0) {
                            alert('No print profiles found for this model.');
                            return;
                        }
                        const firstProfileId = printProfiles[0].id;
                        const modelSlug = getModelSlug(url);
                        getDownloadUrl(firstProfileId, modelSlug).then(downloadUrl => {
                            if (!downloadUrl) {
                                alert('Could not get download URL for 3MF file.');
                                return;
                            }
                            window.open(downloadUrl, '_blank');
                        });
                    });
                }
            }
        ];

        // Filter options based on context
        return options.filter(option => {
            const contexts = option.for.split(',').map(c => c.trim());
            return contexts.includes(context);
        });
    }

    function isModelViewPage() {
        return /\/models\/[\w-]+/.test(window.location.pathname);
    }

    function getDesignCards() {
        return document.querySelectorAll('.js-design-card');
    }

    function addButtonToDesignCard(card) {
        // Prevent duplicate buttons
        if (card.querySelector('.enhancement-btn')) {
            return;
        }
        
        // Mark card as processed
        card.setAttribute('data-enhanced', 'true');
        const button = document.createElement('button');
        button.className = 'enhancement-btn';
        button.innerHTML = logoSvg;

        // check if cards first child is a div with a span inside
        const firstChild = card.firstElementChild;
        if (firstChild && firstChild.tagName.toLowerCase() === 'div' && firstChild.querySelector('span')) {
            button.classList.add('enhancement-btn-offset');
        }
        button.title = 'Makerworld Enhancement';
        card.classList.add('enhancement-card');
        card.appendChild(button);
        addPopover(button, card);
    }

    function addPopover(enhanceBtn, card) {
        console.log('Adding popover to button');
        // new popover for enhancement
        const popover = document.createElement('div');
        popover.classList.add('enhancement-popover', 'MuiPaper-root', 'MuiPaper-elevation', 'MuiPaper-rounded', 'MuiPaper-elevation8', 'MuiPopover-paper', 'MuiMenu-paper', 'MuiMenu-paper', 'mw-css-kqqlx6');
        
        const optionsList = document.createElement('ul');
        optionsList.classList.add('enhancement-options-list');

        const options = getEnhancementOptions('card');

        options.forEach(option => {
            const listItem = document.createElement('li');
            listItem.classList.add('enhancement-option-item');
            
            listItem.innerHTML = `${option.icon ? `<img src="${option.icon}" class="enhancement-option-icon">` : ''}${option.text}`;
            listItem.addEventListener('click', () => {
                option.action(card);
                document.body.removeChild(popover);
            });
            optionsList.appendChild(listItem);
        });
        popover.appendChild(optionsList);
        enhanceBtn.addEventListener('click', (e) => {
            console.log('Enhancement button clicked');
            e.stopPropagation();
            // remove existing popovers
            const existingPopovers = document.querySelectorAll('.enhancement-popover');
            if (existingPopovers.length > 0) {
                existingPopovers.forEach(p => {
                    if (p.parentNode) {
                        p.parentNode.removeChild(p);
                    }
                });
            }
            card.appendChild(popover);
        });
    }

    function getModelNameFromPage() {
        // Try to get from h1 tag
        const h1 = document.querySelector('h1');
        if (h1) {
            return h1.innerText.trim();
        }
        // Fallback to page title
        const title = document.title;
        if (title) {
            return title.split('|')[0].trim();
        }
        return false;
    }

    function getCardName(card) {
        const titleElement = card.querySelector('.design-bottom-row .translated-text a');
        if (titleElement) {
            return titleElement.innerText.trim();
        }
        return false;
    }

    function getCardUrl(card) {
        const linkElement = card.querySelector('.design-bottom-row .translated-text a');
        if (linkElement) {
            return linkElement.href;
        }
        return false;
    }

    function getModelSlug(url) {
        const match = url.match(/\/models\/([\w-]+)/);
        return match ? match[1] : null;
    }

    function getNextJSBuildId() {
        // get buildId from window.__NEXT_DATA__.buildId if available
        if (window.__NEXT_DATA__ && window.__NEXT_DATA__.buildId) {
            return window.__NEXT_DATA__.buildId;
        }
        // search on the entire html page for "buildId":"{buildId}" and return the buildId
        const html = document.documentElement.innerHTML;
        const match = html.match(/"buildId":"([\w\d]+)"/);
        return match ? match[1] : null;
    }

    function openInBambuStudio(printProfileId, modelSlug) {
        getDownloadUrl(printProfileId, modelSlug).then(downloadUrl => {
            if (!downloadUrl) {
                alert('Could not get download URL for F3MF file.');
                return;
            }
            // split the downloadUrl by ? and add a space after the ?
            const [baseUrl, query] = downloadUrl.split('?');
            const bambuStudioUrl = `bambustudio://open?file=${encodeURIComponent(baseUrl + (query ? '?' + query : ''))}`;
            try {
                console.log('Attempting to open Bambu Studio with URL:', bambuStudioUrl);
                window.location.href = bambuStudioUrl;
            } catch (error) {
                console.error('Error opening Bambu Studio:', error);
                alert('An error occurred while trying to open Bambu Studio. Please ensure Bambu Studio is installed.');
            }
        });
    }

    async function getDownloadUrl(printProfileId, modelSlug) {
        try {
    const response = await fetch(`https://makerworld.com/api/v1/design-service/instance/${printProfileId}/f3mf?type=download`, {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0",
        "Accept": "*/*",
        "Accept-Language": "en-US;q=0.7,en;q=0.3",
        "X-BBL-Client-Type": "web",
        "X-BBL-Client-Version": "00.00.00.01",
        "X-BBL-App-Source": "makerworld",
        "X-BBL-Client-Name": "MakerWorld",
        "Content-Type": "application/json",
        "Sec-GPC": "1",
        "Alt-Used": "makerworld.com",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Priority": "u=0"
    },
    "referrer": `https://makerworld.com/en/models/${modelSlug}`,
    "method": "GET",
    "mode": "cors"
});
        if (response.ok) {
            console.log('F3MF file download response received.');
            const data = await response.json();
            if (data && data.url) {
                return data.url;
            } else if (data && data.code == 1 && data.captchaId) {
                alert('Captcha required to download this F3MF file. Please complete the captcha on the Makerworld website and try again.');
                return null;
            } else {
                console.error('No download URL found in response data.');
                return null;
            }
        } else {
            if (response.status === 418) {
                alert('Captcha required to download this F3MF file. Please complete the captcha on the Makerworld website and try again.');
                return null;
            }
            alert('Failed to download F3MF file from Makerworld.');
        }
        } catch (error) {
            console.error('Error downloading F3MF file:', error);
            alert('An error occurred while downloading the F3MF file.');
        }
    }

    async function getModelDetails(url, modelId = null) {
        // if modelid is not set, get it from url: e.g. https://makerworld.com/de/models/1866618-wheel-loader-kit-card#profileId-1997183 --> 1866618
        if (!modelId) {
            const match = url.match(/\/models\/(\d+)/);
            if (match) {
                modelId = match[1];
            }
        }
        if (!modelId) {
            return null;
        }

        const moduleSlug = getModelSlug(url);
        if (!moduleSlug) {
            return null;
        }

        console.log('Fetching model details for model ID:', modelId);
        console.log('Using module slug:', moduleSlug);

        let fetchUrl = `https://makerworld.com/_next/data/${getNextJSBuildId()}/de/models/${moduleSlug}.json?designId=${moduleSlug}`;
        try {
        const response = await fetch(fetchUrl, {
            "credentials": "include",
            "headers": {
                "User-Agent": window.navigator.userAgent,
                "Accept": "*/*",
                "Accept-Language": "en-US;q=0.7,en;q=0.3",
                "x-nextjs-data": "1",
                "Sec-GPC": "1",
                "Alt-Used": "makerworld.com",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "Priority": "u=0"
            },
            "referrer": "https://makerworld.com/de",
            "method": "GET",
            "mode": "cors"
        });
        const data = await response.json();
        console.log('Fetched model details:', data);


        return data;
        } catch (error) {
            console.error('Error fetching model details:', error);
            return null;
        }
    }

    function addButtonGroupToModelView() {
        // Find the stats div
        const statsDiv = document.querySelector('.mw-css-pn2l0k');
        if (!statsDiv || statsDiv.hasAttribute('data-enhancement-added')) {
            return;
        }

        statsDiv.setAttribute('data-enhancement-added', 'true');

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'enhancement-button-group';
        
        const buttons = getEnhancementOptions('details');

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.className = 'enhancement-model-btn';
            button.innerHTML = `${btn.icon ? `<img src="${btn.icon}" class="enhancement-option-icon">` : ''}${btn.text}`;
            button.addEventListener('click', () => btn.action(null));
            buttonGroup.appendChild(button);
        });

        // Insert after the stats div
        statsDiv.parentNode.insertBefore(buttonGroup, statsDiv.nextSibling);
    }

    function injectCSS() {
        const style = document.createElement('style');
        style.innerHTML = `
        .enhancement-card {
            position: relative;
        }
        .enhancement-btn {
            background: transparent;
            border: none;
            cursor: pointer;
            position: absolute;
            top: 0px;
            left: 0px;
            z-index: 1000;
            width: 32px;
            height: 32px;
            padding: 4px;
            border-radius: 0 0 3px 0;
            color: #b0fd41;
            background-color: rgba(0, 0, 0);

        }
        .enhancement-btn-offset {
            left: 32px;
        }
        .enhancement-popover {
            position: absolute;
            top: 36px;
            left: 0;
            z-index: 1001;
            width: 200px;
            height: auto;
            max-height: 300px;
            padding: 8px 0;
            background-color: rgb(45, 45, 49);
            border: 0.9px solid rgb(82, 82, 82);
            border-radius: .35em;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
            color: rgb(239, 239, 240);
            overflow-y: auto;
            transition: opacity 0.211s cubic-bezier(0.4, 0, 0.2, 1), transform 0.141s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .enhancement-options-list {
            margin: 0;
            padding: 0;
            list-style: none;
        }
        .enhancement-option-item {
            padding: 4px 16px 4px 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            user-select: none;
            border-radius: 2px;

            
            font-family: "Open Sans", "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue";
            font-size: 14px;
            font-weight: 600;
        }
        .enhancement-option-item:hover {
            background-color: rgba(52, 53, 58, 1);
        }
        .enhancement-option-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            background-size: contain;
            background-repeat: no-repeat;
            vertical-align: middle;
            margin-right: 8px;
            filter: invert(1);
        }
        .enhancement-button-group {
            display: flex;
            align-items: center;
            height: 46px;
            margin-top: 16px;
            flex-wrap: wrap;
            border: 1px solid rgb(82, 82, 82);
            border-radius: 4px;
            background-color: transparent;
        }
        .enhancement-model-btn {
            height: 46px;
            background-color: transparent;
            border: transparent;
            padding: 0 12px;
            margin: 0;
            border-right: 1px solid rgb(82, 82, 82);
            color: rgb(239, 239, 240);
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s ease;
        }
        .enhancement-model-btn:hover {
            background-color: rgba(52, 53, 58, 1);
        }
        .enhancement-model-btn img {
            width: 16px;
            height: 16px;
            filter: invert(1);
        }
        `;
        document.head.appendChild(style);
        console.log('Injected custom CSS for enhancement popover.');
    }

    function addMutationObserver() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    // Check the node itself
                    if (node.nodeType === 1) {
                        if (node.classList && node.classList.contains('js-design-card') && !node.hasAttribute('data-enhanced')) {
                            addButtonToDesignCard(node);
                        }
                        // Also check child nodes (for nested structures)
                        const childCards = node.querySelectorAll && node.querySelectorAll('.js-design-card');
                        if (childCards && childCards.length > 0) {
                            childCards.forEach(card => {
                                if (!card.hasAttribute('data-enhanced')) {
                                    addButtonToDesignCard(card);
                                }
                            });
                        }
                        // Check for model view stats div
                        if (isModelViewPage()) {
                            const statsDiv = node.querySelector && node.querySelector('.mw-css-pn2l0k');
                            if (statsDiv && !statsDiv.hasAttribute('data-enhancement-added')) {
                                addButtonGroupToModelView();
                            }
                        }
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function enhanceMakerworld() {
        injectCSS();
        
        if (isModelViewPage()) {
            // On model view page, add button group
            addButtonGroupToModelView();
        } else {
            // On other pages, add buttons to design cards
            const designCards = getDesignCards();
            designCards.forEach(card => {
                addButtonToDesignCard(card);
            });
        }
        
        addMutationObserver();
        
        // Single event listener for closing popovers (event delegation)
        document.addEventListener('click', (e) => {
            // Don't close if clicking on enhancement button
            if (e.target.closest('.enhancement-btn')) {
                return;
            }
            const existingPopovers = document.querySelectorAll('.enhancement-popover');
            existingPopovers.forEach(p => {
                if (p.parentNode) {
                    p.parentNode.removeChild(p);
                }
            });
        });
    }

    console.log('Makerworld Enhancements by Cufiy loaded.');
    enhanceMakerworld();
})();