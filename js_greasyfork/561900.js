// ==UserScript==
// @name         Decrypt FileCrypt Links
// @version      2.0
// @description  Decrypt all FileCrypt links
// @author       SH3LL
// @grant        GM.xmlHttpRequest
// @match        *://filecrypt.cc/*
// @match        *://www.filecrypt.cc/*
// @match        *://filecrypt.co/*
// @match        *://www.filecrypt.co/*
// @run-at       document-end
// @connect      self
// @namespace https://greasyfork.org/users/762057
// @downloadURL https://update.greasyfork.org/scripts/561900/Decrypt%20FileCrypt%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/561900/Decrypt%20FileCrypt%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== CONFIGURATION ====================

    const CONFIG = {
        hostname: document.location.hostname,
        isDarkMode: !!document.head.querySelector('meta[name="theme-color"]')
    };

    const STYLES = {
        get bgColor() { return CONFIG.isDarkMode ? '#0b0d15' : 'white'; },
        get textColor() { return CONFIG.isDarkMode ? 'white' : 'black'; },
        get borderColor() { return CONFIG.isDarkMode ? '#444' : '#ddd'; },
        get buttonBg() { return CONFIG.isDarkMode ? '#333' : '#f0f0f0'; },
        get buttonHoverBg() { return CONFIG.isDarkMode ? '#555' : '#e0e0e0'; },
        get groupBg() { return CONFIG.isDarkMode ? '#1a1d2e' : '#f9f9f9'; }
    };

    // Storage for grouped links and UI elements
    const linkGroups = new Map();
    const groupElements = new Map();
    let mainContainer = null;
    let totalLinksCount = 0;
    let pendingCount = 0;

    // ==================== INITIALIZATION ====================

    function init() {
        removeUsenetAds();
        injectStyles();

        const path = document.location.href;

        if (path.includes('/Link/')) {
            handleSingleLink();
        } else if (path.includes('/Container/')) {
            handleContainer();
        }
    }

    function injectStyles() {
        const css = `
            .fc-bypass-container {
                background-color: ${STYLES.bgColor};
                border-radius: 10px;
                padding: 1em;
                margin: 1em 0;
                color: ${STYLES.textColor};
                z-index: 10;
                position: relative;
            }
            .fc-bypass-header {
                font-size: 1.2em;
                font-weight: bold;
                margin-bottom: 0.5em;
            }
            .fc-bypass-status {
                font-size: 0.9em;
                color: ${CONFIG.isDarkMode ? '#aaa' : '#666'};
                margin-bottom: 1em;
            }
            .fc-bypass-groups-wrapper {
                display: flex;
                flex-wrap: wrap;
                gap: 1em;
                align-items: flex-start;
                justify-content: center;
            }
            .fc-bypass-group {
                background-color: ${STYLES.groupBg};
                border: 1px solid ${STYLES.borderColor};
                border-radius: 8px;
                padding: 1em;
                display: inline-block;
                min-width: 200px;
                max-width: 100%;
            }
            .fc-bypass-group-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 1em;
                margin-bottom: 0.8em;
                padding-bottom: 0.5em;
                border-bottom: 1px solid ${STYLES.borderColor};
            }
            .fc-bypass-group-title {
                font-weight: bold;
                color: ${STYLES.textColor};
            }
            .fc-bypass-links-container {
                display: flex;
                flex-direction: column;
                gap: 0.4em;
            }
            .fc-bypass-link-row {
                display: inline-flex;
                align-items: center;
                gap: 0.5em;
            }
            .fc-bypass-link {
                color: ${STYLES.textColor};
                cursor: pointer;
                word-break: break-all;
            }
            .fc-bypass-link:hover {
                text-decoration: underline;
            }
            .fc-bypass-btn {
                background-color: ${STYLES.buttonBg};
                color: ${STYLES.textColor};
                border: 1px solid ${STYLES.borderColor};
                border-radius: 4px;
                padding: 0.3em 0.6em;
                cursor: pointer;
                font-size: 0.85em;
                white-space: nowrap;
                flex-shrink: 0;
            }
            .fc-bypass-btn:hover {
                background-color: ${STYLES.buttonHoverBg};
            }
            .fc-bypass-btn:disabled {
                opacity: 0.6;
                cursor: default;
            }
            .fc-bypass-btn-primary {
                background-color: #4a90d9;
                color: white;
                border-color: #3a7bc8;
            }
            .fc-bypass-btn-primary:hover {
                background-color: #3a7bc8;
            }
            .fc-bypass-controls {
                display: flex;
                gap: 0.5em;
                margin-bottom: 1em;
                flex-wrap: wrap;
                justify-content: center;
            }
        `;

        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // ==================== AD REMOVAL ====================

    function removeUsenetAds() {
        // Remove pink/usenet ads
        const allLinks = document.getElementsByTagName('A');
        for (const link of allLinks) {
            if (link.href && link.href.includes('/pink/')) {
                link.parentNode?.remove();
                break;
            }
        }

        // Remove ad containers by common patterns
        const adSelectors = [
            '[class*="usenet"]',
            '[class*="sponsor"]',
            '[id*="usenet"]',
            '[id*="sponsor"]'
        ];

        for (const selector of adSelectors) {
            const ads = document.querySelectorAll(selector);
            for (const ad of ads) {
                ad.remove();
            }
        }
    }

    // ==================== SINGLE LINK HANDLING ====================

    function handleSingleLink() {
        if (document.body.getElementsByTagName('SCRIPT').length > 0) return;

        window.stop();

        if (document.body.children.length > 0) {
            const intermediateLink = extractIntermediateLink(document.body.innerHTML);
            if (intermediateLink) resolveFinalLink(intermediateLink);
        } else {
            fetchAndExtractLink();
        }
    }

    function extractIntermediateLink(html) {
        const lastHttpIndex = html.lastIndexOf('http');
        if (lastHttpIndex === -1) return null;

        const idIndex = html.indexOf('id=', lastHttpIndex);
        if (idIndex === -1) return null;

        return html.substring(lastHttpIndex, idIndex + 43).replace('&amp;', '&');
    }

    function fetchAndExtractLink() {
        GM.xmlHttpRequest({
            method: 'GET',
            url: document.location.href,
            onload: (response) => {
                const intermediateLink = extractIntermediateLink(response.responseText);
                if (intermediateLink) resolveFinalLink(intermediateLink);
            }
        });
    }

    function resolveFinalLink(intermediateLink) {
        GM.xmlHttpRequest({
            method: 'GET',
            url: intermediateLink,
            onload: (response) => {
                top.location.href = response.finalUrl || intermediateLink;
            },
            onerror: () => {
                top.location.href = intermediateLink;
            }
        });
    }

    // ==================== CONTAINER HANDLING ====================

    function handleContainer() {
        const downloadBtn = document.querySelector('.download');
        if (!downloadBtn) return;

        const article = downloadBtn.closest('article')
                     || downloadBtn.parentNode?.parentNode?.parentNode?.parentNode;

        if (!article?.parentNode) return;

        mainContainer = createMainContainer();
        article.parentNode.insertBefore(mainContainer, article);

        extractLinksLocally();
    }

    function createMainContainer() {
        const container = document.createElement('DIV');
        container.className = 'fc-bypass-container';
        container.id = 'fc-bypass-main';

        // Header
        const header = document.createElement('DIV');
        header.className = 'fc-bypass-header';
        header.textContent = 'Decrypted Links';
        container.appendChild(header);

        // Status
        const status = document.createElement('DIV');
        status.className = 'fc-bypass-status';
        status.id = 'fc-bypass-status';
        status.textContent = 'Decrypting links...';
        container.appendChild(status);

        // Controls (copy all button)
        const controls = document.createElement('DIV');
        controls.className = 'fc-bypass-controls';
        controls.id = 'fc-bypass-controls';

        const copyAllBtn = createButton('Copy All Links', 'fc-bypass-btn fc-bypass-btn-primary', copyAllLinks);
        copyAllBtn.id = 'fc-bypass-copy-all';
        controls.appendChild(copyAllBtn);
        container.appendChild(controls);

        // Groups wrapper
        const groupsWrapper = document.createElement('DIV');
        groupsWrapper.className = 'fc-bypass-groups-wrapper';
        groupsWrapper.id = 'fc-bypass-groups';
        container.appendChild(groupsWrapper);

        return container;
    }

    // ==================== LINK EXTRACTION ====================

    function extractLinksLocally() {
        const encryptedButtons = findEncryptedButtons();

        if (encryptedButtons.length === 0) {
            updateStatus('No download links found on this page.', true);
            return;
        }

        pendingCount = encryptedButtons.length;
        console.log(`[Bypass FileCrypt] Found ${pendingCount} encrypted links`);
        updateStatus(`Decrypting ${pendingCount} links...`);

        encryptedButtons.forEach(button => processEncryptedButton(button));
    }

    function findEncryptedButtons() {
        let buttons = document.querySelectorAll("button.download[onclick*='openLink']");

        if (buttons.length === 0) {
            buttons = document.querySelectorAll("[onclick*='openLink']");
        }

        return Array.from(buttons);
    }

    function processEncryptedButton(button) {
        const onclick = button.getAttribute('onclick');
        const attrMatch = onclick.match(/this\.getAttribute\(['"]([^'"]+)['"]\)/);

        if (!attrMatch?.[1]) {
            onLinkProcessed();
            return;
        }

        const dataAttrName = attrMatch[1];
        const encryptedId = button.getAttribute(dataAttrName);

        if (!encryptedId) {
            onLinkProcessed();
            return;
        }

        // Determina lo stato del link dalla riga della tabella
        const row = button.closest('tr');
        let linkStatus = 'unknown'; // default: n/a
        if (row) {
            const statusIcon = row.querySelector('td.status i');
            if (statusIcon) {
                if (statusIcon.classList.contains('online')) {
                    linkStatus = 'online';
                } else if (statusIcon.classList.contains('offline')) {
                    linkStatus = 'offline';
                }
            }
        }

    const linkUrl = `https://${CONFIG.hostname}/Link/${encryptedId}.html`;
    fetchAndDecryptLink(linkUrl, linkStatus);
}

    function fetchAndDecryptLink(url, linkStatus = 'unknown') {
        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            onload: (response) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');
                const redirectUrl = findRedirectUrl(doc);

                if (redirectUrl) {
                    resolveAndDisplayLink(redirectUrl, linkStatus);
                } else {
                    onLinkProcessed();
                }
            },
            onerror: () => {
                console.log(`[Bypass FileCrypt] Error fetching: ${url}`);
                onLinkProcessed();
            }
        });
    }

    function findRedirectUrl(doc) {
        const scripts = doc.getElementsByTagName('SCRIPT');

        for (const script of scripts) {
            if (script.innerHTML.includes('top.location.href=')) {
                const parts = script.innerHTML.split("'");
                if (parts[1]) return parts[1];
            }
        }

        return null;
    }

    function resolveAndDisplayLink(encryptedUrl, linkStatus = 'unknown') {
        GM.xmlHttpRequest({
            method: 'GET',
            url: encryptedUrl,
            onload: (response) => {
                let finalUrl = response.finalUrl || encryptedUrl;
                finalUrl = transformUrl(finalUrl);

                console.log(`[Bypass FileCrypt] Decrypted: ${finalUrl}`);
                addLinkToUI(finalUrl, false, linkStatus);
                onLinkProcessed();
            },
            onerror: () => {
                console.log(`[Bypass FileCrypt] Error resolving: ${encryptedUrl}`);
                addLinkToUI(encryptedUrl, true, linkStatus);
                onLinkProcessed();
            }
        });
    }

    function transformUrl(url) {
        // Transform terabytez.org/login?redirect=XXX to terabytez.org/XXX
        if (url.includes('terabytez.org/login?redirect=')) {
            return url.replace('/login?redirect=', '/');
        }
        return url;
    }

    function onLinkProcessed() {
        pendingCount--;

        if (pendingCount > 0) {
            updateStatus(`Decrypting links... (${pendingCount} remaining)`);
        } else {
            if (totalLinksCount > 0) {
                updateStatus(`Done! ${totalLinksCount} link${totalLinksCount > 1 ? 's' : ''} decrypted.`);
            } else {
                updateStatus('No links could be decrypted.', true);
            }
        }
    }

    // ==================== LIVE UI UPDATES ====================

    function getHostFromUrl(url) {
        try {
            return new URL(url).hostname;
        } catch {
            return 'Unknown Host';
        }
    }

    function addLinkToUI(url, isError = false, linkStatus = 'unknown') {
        const host = getHostFromUrl(url);
        totalLinksCount++;

        if (!linkGroups.has(host)) {
            linkGroups.set(host, []);
        }
        linkGroups.get(host).push({ url, isError, linkStatus });

        if (!groupElements.has(host)) {
            const groupEl = createGroupElement(host);
            groupElements.set(host, groupEl);
            insertGroupSorted(groupEl, host);
        }

        const group = groupElements.get(host);
        const linksContainer = group.querySelector('.fc-bypass-links-container');
        const linkRow = createLinkRow(url, isError, linkStatus);
        linksContainer.appendChild(linkRow);

        updateGroupTitle(host);
    }

    function createGroupElement(host) {
        const group = document.createElement('DIV');
        group.className = 'fc-bypass-group';
        group.dataset.host = host;

        // Group header
        const groupHeader = document.createElement('DIV');
        groupHeader.className = 'fc-bypass-group-header';

        const title = document.createElement('SPAN');
        title.className = 'fc-bypass-group-title';
        title.textContent = host;
        groupHeader.appendChild(title);

        const copyGroupBtn = createButton('Copy Links', 'fc-bypass-btn', () => {
            const links = (linkGroups.get(host) || []).map(l => l.url);
            copyLinksToClipboard(links);
            showCopyFeedback(copyGroupBtn, 'Copied!');
        });
        groupHeader.appendChild(copyGroupBtn);

        group.appendChild(groupHeader);

        // Links container
        const linksContainer = document.createElement('DIV');
        linksContainer.className = 'fc-bypass-links-container';
        group.appendChild(linksContainer);

        return group;
    }

    function insertGroupSorted(groupEl, host) {
        const wrapper = document.getElementById('fc-bypass-groups');
        if (!wrapper) return;

        const existingGroups = Array.from(wrapper.children);
        let inserted = false;

        for (const existing of existingGroups) {
            const existingHost = existing.dataset.host;
            if (host.localeCompare(existingHost) < 0) {
                wrapper.insertBefore(groupEl, existing);
                inserted = true;
                break;
            }
        }

        if (!inserted) {
            wrapper.appendChild(groupEl);
        }
    }

    function updateGroupTitle(host) {
        const group = groupElements.get(host);
        if (!group) return;

        const title = group.querySelector('.fc-bypass-group-title');
        const count = linkGroups.get(host)?.length || 0;
        title.textContent = `${host} (${count})`;
    }

    function createLinkRow(url, isError = false, linkStatus = 'unknown') {
        const row = document.createElement('DIV');
        row.className = 'fc-bypass-link-row';

        const link = document.createElement('SPAN');
        link.className = 'fc-bypass-link';
        link.title = url;

        if (isError) {
            // Errore di risoluzione: rosso e non cliccabile
            link.textContent = `${truncateUrl(url)} (error)`;
            link.style.color = 'red';
            link.style.cursor = 'default';
        } else if (linkStatus === 'offline') {
            // Offline: rosso ma cliccabile
            link.textContent = truncateUrl(url);
            link.style.color = 'red';
            link.addEventListener('click', () => window.open(url, '_blank'));
        } else if (linkStatus === 'online') {
            // Online: verde
            link.textContent = truncateUrl(url);
            link.style.color = '#4CAF50';
            link.addEventListener('click', () => window.open(url, '_blank'));
        } else {
            // Unknown/N/A: colore di default
            link.textContent = truncateUrl(url);
            link.addEventListener('click', () => window.open(url, '_blank'));
        }

        row.appendChild(link);

        const copyBtn = createButton('Copy', 'fc-bypass-btn', () => {
            copyLinksToClipboard([url]);
            showCopyFeedback(copyBtn, 'Copied!');
        });
        row.appendChild(copyBtn);

        return row;
    }

    function createButton(text, className, onClick) {
        const btn = document.createElement('BUTTON');
        btn.className = className;
        btn.textContent = text;
        btn.addEventListener('click', onClick);
        return btn;
    }

    // ==================== UTILITY FUNCTIONS ====================

    function updateStatus(message, isError = false) {
        const status = document.getElementById('fc-bypass-status');
        if (status) {
            status.textContent = message;
            status.style.color = isError ? 'red' : (CONFIG.isDarkMode ? '#aaa' : '#666');
        }
    }
    function truncateUrl(url, maxLength = 40) {
        if (url.length <= maxLength) return url;

        const ellipsis = '...';
        const availableChars = maxLength - ellipsis.length;
        const startChars = Math.ceil(availableChars / 2);
        const endChars = Math.floor(availableChars / 2);

        return url.substring(0, startChars) + ellipsis + url.substring(url.length - endChars);
    }

    function copyLinksToClipboard(links) {
        const text = links.join('\n');
        navigator.clipboard.writeText(text);
    }

    function copyAllLinks() {
        const allLinks = [];
        const sortedHosts = Array.from(linkGroups.keys()).sort();

        for (const host of sortedHosts) {
            const links = linkGroups.get(host) || [];
            allLinks.push(...links.map(l => l.url));
        }

        if (allLinks.length === 0) {
            alert('No links to copy yet!');
            return;
        }

        copyLinksToClipboard(allLinks);

        const copyAllBtn = document.getElementById('fc-bypass-copy-all');
        if (copyAllBtn) {
            showCopyFeedback(copyAllBtn, `Copied ${allLinks.length}!`);
        }
    }

    function showCopyFeedback(button, message) {
        const originalText = button.textContent;
        button.textContent = message;
        button.disabled = true;

        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 1500);
    }

    // ==================== START ====================

    init();
})();