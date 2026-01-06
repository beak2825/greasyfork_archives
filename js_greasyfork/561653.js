// ==UserScript==
// @name         FV - Explorer Finds Item Museum
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      1.2
// @description  Click on explore items to go to their corresponding item museum page.
// @match        https://www.furvilla.com/career/explorer/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561653/FV%20-%20Explorer%20Finds%20Item%20Museum.user.js
// @updateURL https://update.greasyfork.org/scripts/561653/FV%20-%20Explorer%20Finds%20Item%20Museum.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getItemIdFromImageUrl(imageUrl) {
        const match = imageUrl.match(/\/(\d+)-[^\/]+\.png$/i);
        return match ? match[1] : null;
    }

    function makeItemsClickable() {
        const itemContainers = document.querySelectorAll('.explore-item');

        itemContainers.forEach((container) => {
            if (container.classList.contains('museum-linked')) {
                return;
            }

            const img = container.querySelector('img');

            if (img && img.src) {
                const itemId = getItemIdFromImageUrl(img.src);

                if (itemId) {
                    const link = document.createElement('a');
                    link.href = `https://www.furvilla.com/museum/item/${itemId}`;
                    link.target = '_blank';
                    link.style.cursor = 'pointer';
                    link.style.display = 'inline-block';
                    link.style.textDecoration = 'none';
                    link.style.position = 'relative';

                    container.classList.add('museum-linked');

                    const parent = img.parentNode;

                    if (parent.tagName === 'A') {
                        parent.href = link.href;
                        parent.target = '_blank';
                        parent.style.cursor = 'pointer';
                    } else {
                        img.parentNode.insertBefore(link, img);
                        link.appendChild(img);
                    }

                    img.style.transition = 'all 0.2s ease';
                    link.addEventListener('mouseenter', () => {
                        img.style.transform = 'scale(1.05)';
                        img.style.filter = 'brightness(1.1)';
                    });
                    link.addEventListener('mouseleave', () => {
                        img.style.transform = 'scale(1)';
                        img.style.filter = 'brightness(1)';
                    });

                    link.addEventListener('click', (e) => {
                        e.stopPropagation();
                    });

                    link.title = `View in Item Museum`;
                }
            }
        });
    }

    function initialize() {
        makeItemsClickable();

        setTimeout(makeItemsClickable, 300);
        setTimeout(makeItemsClickable, 1000);
        setTimeout(makeItemsClickable, 2000);

        const observer = new MutationObserver((mutations) => {
            let shouldRun = false;

            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    shouldRun = true;
                    break;
                }

                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const target = mutation.target;
                    if (target.classList &&
                        (target.classList.contains('modal') || target.id === 'modal') &&
                        target.style.display === 'block') {
                        shouldRun = true;
                        break;
                    }
                }
            }

            if (shouldRun) {
                setTimeout(makeItemsClickable, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });

        window.addEventListener('beforeunload', () => {
            observer.disconnect();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            setTimeout(makeItemsClickable, 100);
        }
    });
})();