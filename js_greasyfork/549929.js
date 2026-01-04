// ==UserScript==
// @name         AlternativeTo.net: Homepage Up Top
// @namespace    https://greasyfork.org/en/users/1337417-mevanlc
// @version      1.1
// @description  Shows the official website link directly on AlternativeTo software pages
// @author       You
// @match        https://alternativeto.net/software/*
// @match        http://alternativeto.net/software/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549929/AlternativeTonet%3A%20Homepage%20Up%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/549929/AlternativeTonet%3A%20Homepage%20Up%20Top.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = false;
    const SCRIPT_NAME =
        (typeof GM_info !== 'undefined' && GM_info.script && GM_info.script.name)
            ? GM_info.script.name
            : 'AlternativeTo Homepage Injector';

    function logd(...args) {
        if (!DEBUG) return;
        console.log(`${SCRIPT_NAME}:`, ...args);
    }

    const state = {
        currentProductId: null,
        container: null,
        observer: null,
        navigationTimer: null,
        navigationListenersAttached: false,
    };

    logd('Script booted', { href: window.location.href });

    setupNavigationListeners();
    handleNavigation();

    function handleNavigation() {
        const pathname = window.location.pathname;
        const pageInfo = extractPageInfo(pathname);
        const productId = pageInfo ? pageInfo.productId : null;
        logd('Handling navigation', {
            pathname,
            productId,
            currentProductId: state.currentProductId,
            isAboutPage: pageInfo ? pageInfo.isAboutPage : false,
        });

        if (!pageInfo) {
            logd('Current page does not match software detail; performing cleanup');
            cleanupContainer();
            state.currentProductId = null;
            return;
        }

        if (state.currentProductId === productId && state.container) {
            logd('Product unchanged; ensuring container presence');
            if (pageInfo.isAboutPage) {
                populateHomepageFromDocument(document, productId, state.container);
            }
            insertHomepageContainer(state.container);
            return;
        }

        logd('Product changed; rebuilding container and data', {
            previous: state.currentProductId,
            next: productId,
        });

        cleanupContainer();

        state.currentProductId = productId;
        state.container = createHomepageContainer(productId);
        insertHomepageContainer(state.container);
        state.observer = setupMutationObserver(state.container);
        if (pageInfo.isAboutPage) {
            populateHomepageFromDocument(document, productId, state.container);
        } else {
            fetchHomepage(productId, state.container);
        }
    }

    function extractPageInfo(pathname) {
        const aboutMatch = pathname.match(/^\/software\/([^\/]+)\/about\/?$/);
        if (aboutMatch) {
            return {
                productId: aboutMatch[1],
                isAboutPage: true,
            };
        }

        const productMatch = pathname.match(/^\/software\/([^\/]+)\/?$/);
        if (productMatch) {
            return {
                productId: productMatch[1],
                isAboutPage: false,
            };
        }

        return null;
    }

    function cleanupContainer() {
        if (state.observer) {
            state.observer.disconnect();
            state.observer = null;
        }

        if (state.container) {
            if (state.container.isConnected) {
                state.container.remove();
            }
            state.container = null;
        }
    }

    function fetchHomepage(productId, homepageContainer) {
        const aboutUrl = `https://alternativeto.net/software/${productId}/about/`;
        logd('Initiating fetch to about page', { aboutUrl, productId });

        fetch(aboutUrl)
            .then(response => {
                logd('Received about page response', { status: response.status, ok: response.ok, productId });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                if (state.container !== homepageContainer || state.currentProductId !== productId) {
                    logd('Ignoring fetch result for stale product', {
                        productId,
                        currentProductId: state.currentProductId,
                    });
                    return;
                }

                logd('Parsing about page HTML', { productId });
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                applyHomepageToContainer({
                    homepageContainer,
                    homepageUrl: resolveHomepageUrlFromDocument(doc, productId),
                    productId,
                });
            })
            .catch(error => {
                if (state.container !== homepageContainer || state.currentProductId !== productId) {
                    logd('Fetch rejected for stale product', { error, productId });
                    return;
                }

                logd('Error fetching or processing about page', { error, productId });
                homepageContainer.innerHTML = '<span style="color: #ff6b6b;">Error loading website info</span>';
                console.error('AlternativeTo Homepage Injector error:', error);
            });
    }

    function populateHomepageFromDocument(doc, productId, homepageContainer) {
        logd('Populating homepage from current document', { productId });
        applyHomepageToContainer({
            homepageContainer,
            homepageUrl: resolveHomepageUrlFromDocument(doc, productId),
            productId,
        });
    }

    function resolveHomepageUrlFromDocument(doc, productId) {
        logd('Executing strategy 1: links with nearby "official" text', { productId });
        const allLinks = doc.querySelectorAll('a[href^="http"]:not([href*="alternativeto"])');
        for (const link of allLinks) {
            const prevText = (link.previousSibling && link.previousSibling.textContent) || '';
            const parentText = (link.parentElement && link.parentElement.textContent) || '';
            if (prevText.toLowerCase().includes('official') || parentText.toLowerCase().includes('official website')) {
                logd('Strategy 1 matched candidate link', { homepageUrl: link.href, productId });
                return link.href;
            }
        }

        logd('Strategy 1 failed, trying strategy 2: containers mentioning Website/Homepage', { productId });
        const possibleContainers = doc.querySelectorAll('div, p, li, td');
        for (const elem of possibleContainers) {
            const text = elem.textContent || '';
            if (text.includes('Website') || text.includes('Homepage')) {
                const link = elem.querySelector('a[href^="http"]:not([href*="alternativeto"])');
                if (link) {
                    logd('Strategy 2 matched candidate link', { homepageUrl: link.href, productId });
                    return link.href;
                }
            }
        }

        logd('Strategy 2 failed, trying strategy 3: first non-social external link', { productId });
        for (const link of allLinks) {
            const href = link.href;
            const text = link.textContent || '';
            if (!href.includes('facebook') &&
                !href.includes('twitter') &&
                !href.includes('youtube') &&
                !href.includes('github.com/sponsors') &&
                !href.includes('patreon') &&
                !href.includes('instagram') &&
                !href.includes('linkedin') &&
                text.length > 0) {
                logd('Strategy 3 matched candidate link', { homepageUrl: href, productId });
                return href;
            }
        }

        logd('All strategies failed to locate homepage URL', { productId });
        return null;
    }

    function applyHomepageToContainer({ homepageContainer, homepageUrl, productId }) {
        if (state.container !== homepageContainer || state.currentProductId !== productId) {
            logd('Container changed during processing; abandoning update', {
                productId,
                currentProductId: state.currentProductId,
            });
            return;
        }

        if (!homepageUrl) {
            homepageContainer.innerHTML = '<span style="color: #999;">Official website not available</span>';
            return;
        }

        logd('Homepage URL determined', { homepageUrl, productId });
        try {
            const url = new URL(homepageUrl);
            const cleanUrl = url.origin + url.pathname;
            logd('Normalized homepage URL', { cleanUrl, productId });
            homepageContainer.innerHTML = `
                <span style="font-weight: bold;">Official Website:</span>
                <a href="${homepageUrl}" target="_blank" rel="noopener noreferrer"
                   style="color: #0099ff; text-decoration: none; font-weight: 500;">
                    ${cleanUrl}
                    <span style="font-size: 12px; vertical-align: super;">&nearr;</span>
                </a>
            `;
        } catch (e) {
            logd('Failed to normalize URL, falling back to raw href', { error: e, productId });
            homepageContainer.innerHTML = `
                <span style="font-weight: bold;">Official Website:</span>
                <a href="${homepageUrl}" target="_blank" rel="noopener noreferrer"
                   style="color: #0099ff; text-decoration: none; font-weight: 500;">
                    ${homepageUrl}
                    <span style="font-size: 12px; vertical-align: super;">&nearr;</span>
                </a>
            `;
        }
    }

    function createHomepageContainer(productId) {
        logd('Creating homepage container element', { productId });
        const el = document.createElement('div');
        el.id = 'homepage-injector';
        el.dataset.productId = productId;
        el.style.cssText = `
            background: #f0f8ff;
            border: 2px solid #0099ff;
            border-radius: 8px;
            padding: 12px;
            margin: 15px 0;
            display: flex;
            align-items: center;
            gap: 10px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        `;
        el.innerHTML = '<span style="font-weight: bold;">Official Website:</span> <span style="color: #666;">Loading...</span>';
        return el;
    }

    function insertHomepageContainer(homepageContainer) {
        if (!homepageContainer) {
            return;
        }

        if (homepageContainer.isConnected) {
            logd('Homepage container already connected; skipping insert', { productId: homepageContainer.dataset.productId });
            return;
        }

        const existing = document.getElementById(homepageContainer.id);
        if (existing && existing !== homepageContainer) {
            logd('Replacing foreign element using homepage container id');
            existing.replaceWith(homepageContainer);
            return;
        }

        const titleElement = document.querySelector('h1');
        if (titleElement && titleElement.parentElement) {
            logd('Injecting container after title element');
            titleElement.parentElement.insertAdjacentElement('afterend', homepageContainer);
            return;
        }

        const mainContent = document.querySelector('main') || document.querySelector('[role="main"]') || document.body;
        if (mainContent) {
            logd('Title element not found; inserting container at beginning of main content');
            mainContent.insertAdjacentElement('afterbegin', homepageContainer);
        } else if (state.container === homepageContainer) {
            logd('No insertion target found; retrying shortly');
            setTimeout(() => {
                if (state.container === homepageContainer) {
                    insertHomepageContainer(homepageContainer);
                }
            }, 100);
        }
    }

    function setupMutationObserver(homepageContainer) {
        logd('Setting up mutation observer to protect container', { productId: homepageContainer.dataset.productId });
        const observer = new MutationObserver(() => {
            const pageInfo = extractPageInfo(window.location.pathname);
            const activeProductId = pageInfo ? pageInfo.productId : null;
            if (activeProductId !== state.currentProductId) {
                logd('Observer noticed product id change; scheduling navigation handling', {
                    activeProductId,
                    currentProductId: state.currentProductId,
                });
                scheduleNavigationCheck('observer-product-change');
                return;
            }

            const current = document.getElementById(homepageContainer.id);
            if (current === homepageContainer) {
                return;
            }

            if (current && current !== homepageContainer) {
                logd('Observer detected foreign element with homepage id; replacing');
                current.replaceWith(homepageContainer);
                return;
            }

            if (!homepageContainer.isConnected) {
                logd('Observer detected missing container; re-inserting');
                insertHomepageContainer(homepageContainer);
            }
        });

        (function startObserving() {
            const target = document.body || document.documentElement;
            if (!target) {
                logd('Observer target unavailable; retrying in 100ms');
                setTimeout(() => {
                    if (state.container === homepageContainer) {
                        startObserving();
                    }
                }, 100);
                return;
            }
            observer.observe(target, { childList: true, subtree: true });
            logd('Mutation observer attached');
        })();

        return observer;
    }

    function scheduleNavigationCheck(reason) {
        logd('Scheduling navigation check', {
            reason,
            existingTimer: Boolean(state.navigationTimer),
        });

        if (state.navigationTimer) {
            clearTimeout(state.navigationTimer);
        }

        state.navigationTimer = setTimeout(() => {
            state.navigationTimer = null;
            handleNavigation();
        }, 50);
    }

    function setupNavigationListeners() {
        if (state.navigationListenersAttached) {
            return;
        }
        state.navigationListenersAttached = true;

        const wrapHistory = method => {
            const original = history[method];
            if (typeof original !== 'function') {
                return;
            }
            history[method] = function(...args) {
                const result = original.apply(this, args);
                logd(`Detected ${method} navigation`, { args });
                scheduleNavigationCheck(method);
                return result;
            };
        };

        wrapHistory('pushState');
        wrapHistory('replaceState');

        window.addEventListener('popstate', () => scheduleNavigationCheck('popstate'));
        window.addEventListener('hashchange', () => scheduleNavigationCheck('hashchange'));
    }
})();
