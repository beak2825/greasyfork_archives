// ==UserScript==
// @name         FV - Item Museum Links
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      2.5
// @description  Makes items link to their museum pages in Bazaar, Explorer, Stalls, and News
// @match        https://www.furvilla.com/bazaar
// @match        https://www.furvilla.com/career/explorer/*
// @match        https://www.furvilla.com/stall/*
// @match        https://www.furvilla.com/news*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562409/FV%20-%20Item%20Museum%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/562409/FV%20-%20Item%20Museum%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---------- Helper
    function extractItemIdFromUrl(url) {
        const match = url.match(/img\/items\/\d+\/(\d+)-/);
        return match ? match[1] : null;
    }

    function isAlreadyLinked(element) {
        return element.parentElement && element.parentElement.tagName === 'A';
    }

    function createMuseumLink(itemId, image) {
        const link = document.createElement('a');
        link.href = `https://www.furvilla.com/museum/item/${itemId}`;
        link.target = '_blank';
        link.title = 'View in Item Museum';
        link.style.cursor = 'pointer';
        link.style.display = 'inline-block';

        image.style.transition = 'all 0.2s ease';
        image.style.willChange = 'transform, opacity';

        link.addEventListener('mouseenter', function() {
            image.style.transform = 'scale(1.05)';
            image.style.opacity = '0.9';
        });

        link.addEventListener('mouseleave', function() {
            image.style.transform = 'scale(1)';
            image.style.opacity = '1';
        });

        return link;
    }

    function processBazaar() {
        document.querySelectorAll('.vendor-box img[src*="/img/items/"]').forEach(img => {
            if (isAlreadyLinked(img)) return;
            const itemId = extractItemIdFromUrl(img.src);
            if (itemId) {
                const link = createMuseumLink(itemId, img);
                img.parentNode.insertBefore(link, img);
                link.appendChild(img);
            }
        });
    }

    function processExplorer() {
        document.querySelectorAll('.explore-item:not(.museum-linked)').forEach(container => {
            const img = container.querySelector('img');
            if (!img || !img.src) return;

            const itemId = extractItemIdFromUrl(img.src);
            if (itemId) {
                const link = createMuseumLink(itemId, img);

                if (isAlreadyLinked(img)) {
                    img.parentNode.href = link.href;
                    img.parentNode.target = '_blank';
                } else {
                    img.parentNode.insertBefore(link, img);
                    link.appendChild(img);
                }

                container.classList.add('museum-linked');
            }
        });
    }

    function processStall() {
        document.querySelectorAll('ul.row.list-unstyled li img[src*="/img/items/"]').forEach(img => {
            if (isAlreadyLinked(img)) return;

            const itemId = extractItemIdFromUrl(img.src);
            if (itemId) {
                const link = createMuseumLink(itemId, img);
                link.style.display = 'block';

                img.parentNode.insertBefore(link, img);
                link.appendChild(img);
            }
        });
    }

    function processNews() {
        // news
        const selectors = ['.margin-2em img[src*="/img/items/"]', '.profanity-filter img[src*="/img/items/"]'];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(img => {
                if (isAlreadyLinked(img)) return;

                const itemId = extractItemIdFromUrl(img.src);
                if (itemId) {
                    const link = createMuseumLink(itemId, img);
                    img.parentNode.insertBefore(link, img);
                    link.appendChild(img);
                }
            });
        });
    }

    // ---------- Modal
    function processModal() {
        const modal = document.getElementById('modal');
        if (!modal) return;

        modal.querySelectorAll('img[src*="/img/items/"]').forEach(img => {
            if (isAlreadyLinked(img)) return;

            const itemId = extractItemIdFromUrl(img.src);
            if (itemId) {
                const link = createMuseumLink(itemId, img);
                img.parentNode.insertBefore(link, img);
                link.appendChild(img);
            }
        });
    }

    // ---------- Ini
    function initPage() {
        const path = window.location.pathname;

        document.removeEventListener('DOMContentLoaded', initPage);

        if (path.startsWith('/bazaar')) {
            processBazaar();
            processModal();
        } else if (path.startsWith('/career/explorer')) {
            processExplorer();
            setTimeout(processExplorer, 300);
            setTimeout(processExplorer, 1000);
        } else if (path.startsWith('/stall/')) {
            processStall();
        } else if (path === '/news' || path.startsWith('/news/')) {
            processNews();
        }
    }

    function setupObservers() {
        // Observer for modal
        const modalObserver = new MutationObserver(function(mutations) {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    processModal();
                    break;
                }
            }
        });
        
        const modal = document.getElementById('modal');
        if (modal) {
            modalObserver.observe(modal, { childList: true, subtree: true });
        }
        
        if (window.location.pathname.startsWith('/career/explorer')) {
            const explorerObserver = new MutationObserver(function() {
                setTimeout(processExplorer, 100);
            });
            
            explorerObserver.observe(document.body, { 
                childList: true, 
                subtree: true,
                attributes: false
            });
        }
        
        window.addEventListener('unload', function() {
            modalObserver.disconnect();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            requestAnimationFrame(function() {
                initPage();
                setupObservers();
            });
        });
    } else {
        requestAnimationFrame(function() {
            initPage();
            setupObservers();
        });
    }
    
    window.addEventListener('load', function() {
        setTimeout(initPage, 500);
    });

})();