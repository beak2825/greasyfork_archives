// ==UserScript==
// @name         HEB Price Per Unit Sorter
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Sort HEB search results by price per quantity (lowest first)
// @author       You
// @match        https://www.heb.com/search*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556134/HEB%20Price%20Per%20Unit%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/556134/HEB%20Price%20Per%20Unit%20Sorter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Debounce function to limit how often sorting runs
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Normalize price to a common unit (lb) for comparison
    function normalizePrice(price, unit) {
        const unitLower = unit.toLowerCase();
        // Convert oz to lb (1 lb = 16 oz)
        if (unitLower === 'oz' || unitLower === 'ounce' || unitLower === 'ounces') {
            return price * 16; // Convert to price per lb
        }
        // lb, pound, pounds are already in the base unit
        if (unitLower === 'lb' || unitLower === 'pound' || unitLower === 'pounds') {
            return price;
        }
        // For other units, return as-is (can't convert)
        return price;
    }

    // Extract price per unit from product card text
    function extractPricePerUnit(card) {
        const text = card.textContent || '';
        const match = text.match(/\(([$]\d+\.\d+)\s*\/\s*(\w+)\)/);
        if (match) {
            const price = parseFloat(match[1].replace('$', ''));
            const unit = match[2];
            return {
                price: price,
                normalizedPrice: normalizePrice(price, unit),
                unit: unit,
                hasPrice: true
            };
        }
        return { price: Infinity, normalizedPrice: Infinity, unit: '', hasPrice: false };
    }

    // Find product card container for a product link
    function findProductCard(link) {
        let card = link;
        while (card && card.parentElement) {
            card = card.parentElement;
            const text = card.textContent || '';
            const hasPricePerUnit = text.match(/\([$]\d+\.\d+\s*\/\s*\w+\)/);
            if (hasPricePerUnit && card.tagName === 'DIV') {
                if (card.querySelector('a[href*="/product-detail/"]')) {
                    return card;
                }
            }
        }
        return null;
    }

    // Sort products by price per unit
    function sortProducts() {
        // Find all product detail links
        const productLinks = Array.from(document.querySelectorAll('a[href*="/product-detail/"]'));

        if (productLinks.length === 0) {
            return;
        }

        // Extract products with their price per unit
        // Use a Map to deduplicate by card element (in case a card has multiple links)
        const cardMap = new Map();
        productLinks.forEach(link => {
            const card = findProductCard(link);
            if (!card || cardMap.has(card)) return;

            const priceInfo = extractPricePerUnit(card);
            cardMap.set(card, {
                card: card,
                pricePerUnit: priceInfo.normalizedPrice,
                unit: priceInfo.unit,
                hasPrice: priceInfo.hasPrice
            });
        });

        const products = Array.from(cardMap.values());

        if (products.length === 0) {
            return;
        }

        // Sort by price per unit (ascending)
        products.sort((a, b) => {
            // Products with price come before products without price
            if (!a.hasPrice && b.hasPrice) return 1;
            if (a.hasPrice && !b.hasPrice) return -1;
            // Both have price or both don't - sort by price
            return a.pricePerUnit - b.pricePerUnit;
        });

        // Find the product grid container
        const firstProduct = products[0];
        let container = firstProduct.card.parentElement;

        // Try to find the container with class BasicGrid_basicGrid__dZgBP
        while (container && container !== document.body) {
            if (container.classList && container.classList.contains('BasicGrid_basicGrid__dZgBP')) {
                break;
            }
            container = container.parentElement;
        }

        // Fallback: use parent of first product if container not found
        if (!container || container === document.body) {
            container = firstProduct.card.parentElement;
        }

        // Reorder products in DOM
        // Find the direct child of container for each product card
        // (product cards are nested, so we need to find their container-wrapping parent)
        const wrapperElements = products.map(product => {
            let element = product.card;
            // Traverse up until we find the direct child of the container
            while (element && element.parentElement !== container) {
                element = element.parentElement;
                if (!element) break;
            }
            return element;
        }).filter(el => el !== null && el !== undefined);

        if (wrapperElements.length === 0) {
            return; // Can't find wrapper elements
        }

        // Create a set for quick lookup
        const wrapperSet = new Set(wrapperElements);

        // Find a reference node BEFORE removing elements
        // Look for the first wrapper and find its next sibling that is NOT a wrapper
        let referenceNode = null;

        for (let i = 0; i < container.children.length; i++) {
            const child = container.children[i];
            if (wrapperSet.has(child)) {
                // Look for next sibling that is NOT a wrapper
                for (let j = i + 1; j < container.children.length; j++) {
                    const sibling = container.children[j];
                    if (!wrapperSet.has(sibling)) {
                        referenceNode = sibling;
                        break;
                    }
                }
                break;
            }
        }

        // Remove wrapper elements from their current positions
        wrapperElements.forEach(wrapper => {
            if (wrapper.parentElement === container) {
                container.removeChild(wrapper);
            }
        });

        // Insert sorted wrapper elements at the correct position
        if (referenceNode && referenceNode.parentElement === container) {
            // Insert before the reference node
            wrapperElements.forEach(wrapper => {
                container.insertBefore(wrapper, referenceNode);
            });
        } else {
            // Append to end
            wrapperElements.forEach(wrapper => {
                container.appendChild(wrapper);
            });
        }
    }

    // Create and add sort button
    function createSortButton() {
        // Find the sort controls area - look for the select dropdown
        let buttonContainer = null;
        let sortSelect = null;

        // Try to find the sort select element
        sortSelect = document.querySelector('select[aria-label*="Sort"], select[aria-label*="sort"]') ||
            Array.from(document.querySelectorAll('select')).find(sel =>
                sel.textContent && (
                    sel.textContent.includes('Sort') ||
                    sel.textContent.includes('Best match') ||
                    sel.textContent.includes('Price low')
                )
            );

        if (sortSelect) {
            // Find the parent container that holds the sort controls
            // Look for a container that has both the select and results count
            let current = sortSelect.parentElement;
            while (current && current !== document.body) {
                // Check if this container seems like the controls area
                const text = current.textContent || '';
                if (text.includes('results') || text.includes('Sort')) {
                    buttonContainer = current;
                    break;
                }
                current = current.parentElement;
            }

            // If we didn't find a good container, use the select's parent
            if (!buttonContainer) {
                buttonContainer = sortSelect.parentElement;
            }
        }

        // Fallback: find the results header area
        if (!buttonContainer) {
            const main = document.querySelector('main');
            if (main) {
                const resultsArea = Array.from(main.children).find(child =>
                    child.textContent && child.textContent.includes('results')
                );
                if (resultsArea) {
                    buttonContainer = resultsArea;
                }
            }
        }

        // Final fallback
        if (!buttonContainer) {
            buttonContainer = document.body;
        }

        // Create button
        const button = document.createElement('button');
        button.textContent = 'Sort by Price/Unit';
        button.style.cssText = `
            margin-left: 12px;
            padding: 8px 16px;
            background-color: #0073aa;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#005a87';
        });
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#0073aa';
        });

        button.addEventListener('click', () => {
            button.textContent = 'Sorting...';
            button.disabled = true;
            sortProducts();
            setTimeout(() => {
                button.textContent = 'Sort by Price/Unit';
                button.disabled = false;
            }, 500);
        });

        // Insert button next to sort controls
        if (sortSelect && sortSelect.parentElement) {
            // Insert after the select's parent wrapper
            sortSelect.parentElement.insertAdjacentElement('afterend', button);
        } else if (buttonContainer) {
            // Try to find select in container and place button nearby
            const selectInContainer = buttonContainer.querySelector('select');
            if (selectInContainer && selectInContainer.parentElement) {
                selectInContainer.parentElement.insertAdjacentElement('afterend', button);
            } else {
                buttonContainer.appendChild(button);
            }
        } else {
            document.body.appendChild(button);
        }
    }

    // Wait for page to load and add button
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(createSortButton, 1000);
        });
    } else {
        setTimeout(createSortButton, 1000);
    }

})();

