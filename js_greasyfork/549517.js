// ==UserScript==
// @name        Reject ServiceWorker Auto (Simple)
// @namespace   rejectserviceWorkerAuto
// @version     1.7.5
// @description Blocks ServiceWorker on all websites. Advanced whitelist management with manual domain removal. Prevents PWA installations and background sync.
// @author      hongmd
// @license     MIT
// @homepageURL https://github.com/hongmd/userscript-improved
// @supportURL  https://github.com/hongmd/userscript-improved/issues
// @match       *://*/*
// @run-at      document-start
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @compatible  ScriptCat
// @compatible  Tampermonkey
// @compatible  Greasemonkey
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/549517/Reject%20ServiceWorker%20Auto%20%28Simple%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549517/Reject%20ServiceWorker%20Auto%20%28Simple%29.meta.js
// ==/UserScript==

'use strict';

// Constants for consistent messaging and configuration
const MESSAGES = {
    // Status messages
    BLOCKED: "ServiceWorker registration blocked",
    WHITELISTED: "Domain whitelisted - ServiceWorker allowed",
    ALREADY_EXISTS: "Domain already in whitelist",
    NOT_IN_WHITELIST: "Domain is not in whitelist",

    // Alert messages
    ADDED_TO_WHITELIST: (hostname) => `✅ Added "${hostname}" to whitelist!\n\nServiceWorker will NOT be blocked here.\nReload page to take effect.`,
    REMOVED_FROM_WHITELIST: (hostname) => `❌ Removed "${hostname}" from whitelist!\n\nServiceWorker will be blocked here.\nReload page to take effect.`,
    ALREADY_WHITELISTED: (hostname) => `Info: "${hostname}" is already in whitelist.`,
    NOT_WHITELISTED: (hostname) => `"${hostname}" is not in whitelist.`,
    WHITELIST_EMPTY: "📋 Whitelist is empty!\n\nNo domains to remove.",
    DOMAIN_NOT_FOUND: (domain, currentList) => `❌ Domain "${domain}" not found in whitelist.\n\nCurrent whitelist: ${currentList}`,
    MANUAL_REMOVAL_SUCCESS: (domain) => `✅ Removed "${domain}" from whitelist!\n\nServiceWorker will be blocked on this domain.\nReload the page if you're currently on it.`,

    // Error messages
    INIT_ERROR: "Failed to initialize menu items - falling back to blocking mode",
    STORAGE_ERROR: "Invalid stored data, resetting to empty array",
    INJECTION_ERROR: "Failed to block ServiceWorker - using fallback method",

    // Menu commands
    SHOW_WHITELIST: "📋 Show Whitelist Info",
    BLOCK_HERE: "🚫 Block ServiceWorker Here",
    ALLOW_HERE: "✅ Allow ServiceWorker Here",
    MANUAL_BLOCK: "🔧 Manual Block Now",
    REMOVE_FROM_WHITELIST: "🗑️ Remove from Whitelist"
};

const SCRIPT_NAME = 'rejectserviceWorkerAuto';
const STORAGE_PREFIX = `autoinject${SCRIPT_NAME}`;
const LOG_PREFIX = 'RSA:';

console.log(`${LOG_PREFIX} Script loaded for:`, document.domain);

let injectedStatus = false;
let hostArray = [];

/**
 * Injects ServiceWorker blocking logic using primary and fallback methods
 * Primary method: Overrides navigator.serviceWorker with a blocking proxy object
 * Fallback method: Overrides the register method directly for older browsers
 * Prevents PWA installations and background sync functionality
 */
function inject() {
    // Skip if running in frames or already injected
    if (window.self !== window.top) return;
    if (injectedStatus) return;

    // Block ServiceWorker registration
    if (typeof navigator !== 'undefined' && navigator.serviceWorker) {
        try {
            Object.defineProperty(navigator, 'serviceWorker', {
                value: {
                    register: () => Promise.reject(new Error("ServiceWorker registration blocked by RSA script")),
                    getRegistration: () => Promise.resolve(undefined),
                    getRegistrations: () => Promise.resolve([]),
                    ready: Promise.reject(new Error("ServiceWorker blocked"))
                },
                writable: false,
                configurable: false
            });
            console.log(`${LOG_PREFIX} ${MESSAGES.BLOCKED} on`, document.domain);
        } catch (e) {
            // Fallback method for older browsers
            navigator.serviceWorker.register = () => Promise.reject(new Error("ServiceWorker registration blocked"));
            console.warn(`${LOG_PREFIX} ${MESSAGES.INJECTION_ERROR} on`, document.domain);
        }
    }
    injectedStatus = true;
}

/**
 * Adds the current domain to the whitelist, allowing ServiceWorker registration
 * Updates persistent storage and provides user feedback
 * Requires page reload to take effect
 */
function addHost() {
    const hostname = location.hostname;
    if (!hostArray.includes(hostname)) {
        hostArray.push(hostname);
        GM_setValue(STORAGE_PREFIX, JSON.stringify(hostArray));
        console.log(`${LOG_PREFIX} Added`, hostname, 'to whitelist');
        alert(MESSAGES.ADDED_TO_WHITELIST(hostname));
    } else {
        alert(MESSAGES.ALREADY_WHITELISTED(hostname));
    }
}

/**
 * Displays comprehensive whitelist information including current domain status
 * Shows total count and lists all whitelisted domains
 * Provides clear visual indicators for whitelist status
 */
function showWhitelistInfo() {
    const hostname = location.hostname;
    const isWhitelisted = hostArray.includes(hostname);
    const currentStatus = isWhitelisted ? "WHITELISTED" : "BLOCKED";
    const statusIcon = isWhitelisted ? "✅" : "🚫";
    const totalSites = hostArray.length;

    let message = `${statusIcon} Current domain: ${hostname}\n`;
    message += `Status: ${currentStatus}\n\n`;
    message += `📋 Total whitelisted sites: ${totalSites}\n`;

    if (totalSites > 0) {
        message += "🔸 " + hostArray.join("\n🔸 ");
    }

    alert(message);
}

/**
 * Removes the current domain from the whitelist, enabling ServiceWorker blocking
 * Updates persistent storage and provides user feedback
 * Requires page reload to take effect
 */
function removeHost() {
    const hostname = location.hostname;
    const index = hostArray.indexOf(hostname);
    if (index > -1) {
        hostArray.splice(index, 1);
        GM_setValue(STORAGE_PREFIX, JSON.stringify(hostArray));
        console.log(`${LOG_PREFIX} Removed`, hostname, 'from whitelist');
        alert(MESSAGES.REMOVED_FROM_WHITELIST(hostname));
    } else {
        alert(MESSAGES.NOT_WHITELISTED(hostname));
    }
}

/**
 * Allows user to remove any domain from the whitelist by entering it manually
 * Provides a text input dialog for domain removal
 * Useful for managing whitelist without visiting each domain
 */
function removeFromWhitelist() {
    if (hostArray.length === 0) {
        alert(MESSAGES.WHITELIST_EMPTY);
        return;
    }

    const currentList = hostArray.join(", ");
    const domainToRemove = prompt(
        `🗑️ Remove domain from whitelist:\n\nCurrent whitelist: ${currentList}\n\nEnter domain to remove (without https://):`,
        ""
    );

    if (!domainToRemove?.trim()) return;

    const cleanDomain = domainToRemove.trim().toLowerCase();
    const index = hostArray.findIndex(host => host.toLowerCase() === cleanDomain);

    if (index > -1) {
        const removedDomain = hostArray.splice(index, 1)[0];
        GM_setValue(STORAGE_PREFIX, JSON.stringify(hostArray));
        console.log(`${LOG_PREFIX} Manually removed`, removedDomain, 'from whitelist');
        alert(MESSAGES.MANUAL_REMOVAL_SUCCESS(removedDomain));
    } else {
        alert(MESSAGES.DOMAIN_NOT_FOUND(cleanDomain, currentList));
    }
}

/**
 * Initializes the script by loading stored whitelist data and setting up menu commands
 * Handles data validation, error recovery, and dynamic menu configuration
 * Automatically injects blocking logic for non-whitelisted domains
 */
function initializeScript() {
    try {
        // Safe JSON parsing with validation
        const storedData = GM_getValue(STORAGE_PREFIX, "[]");
        if (typeof storedData === 'string' && storedData.trim()) {
            hostArray = JSON.parse(storedData);
            // Validate that result is an array
            if (!Array.isArray(hostArray)) {
                console.warn(`${LOG_PREFIX} ${MESSAGES.STORAGE_ERROR}`);
                hostArray = [];
            }
        } else {
            hostArray = [];
        }

        const hostname = location.hostname;
        const isWhitelisted = hostArray.includes(hostname);

        // Always show status info
        GM_registerMenuCommand(MESSAGES.SHOW_WHITELIST, showWhitelistInfo);
        GM_registerMenuCommand(MESSAGES.REMOVE_FROM_WHITELIST, removeFromWhitelist);

        if (isWhitelisted) {
            // Current domain is whitelisted
            GM_registerMenuCommand(MESSAGES.BLOCK_HERE, removeHost);
            GM_registerMenuCommand(MESSAGES.MANUAL_BLOCK, inject);
            console.log(`${LOG_PREFIX}`, hostname, MESSAGES.WHITELISTED);
        } else {
            // Current domain is not whitelisted (blocked by default)
            inject();
            GM_registerMenuCommand(MESSAGES.ALLOW_HERE, addHost);
            console.log(`${LOG_PREFIX} Auto-blocked ServiceWorker for`, hostname);
        }
    } catch (err) {
        console.error(`${LOG_PREFIX} ${MESSAGES.INIT_ERROR}`);
        console.error(err);
        // Fallback: always inject if there's an error
        inject();
    }
}

// Start the script
initializeScript();
