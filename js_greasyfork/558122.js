// ==UserScript==
// @name         ByteByteGo Reference Linker
// @namespace    https://github.com/abd3lraouf
// @version      1.2.0
// @description  Converts [n] reference markers into clickable links on ByteByteGo courses. Click the reference to open the URL, or click the arrow to scroll to the References section.
// @author       abd3lraouf
// @license      MIT
// @match        https://bytebytego.com/*
// @match        https://*.bytebytego.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bytebytego.com
// @grant        none
// @run-at       document-idle
// @homepage     https://github.com/abd3lraouf/bytebytego-reference-linker
// @supportURL   https://github.com/abd3lraouf/bytebytego-reference-linker/issues
// @downloadURL https://update.greasyfork.org/scripts/558122/ByteByteGo%20Reference%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/558122/ByteByteGo%20Reference%20Linker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Store parsed references
    const references = new Map();

    // Parse references from the bottom of the page
    function parseReferences() {
        references.clear();

        // Find all text nodes that start with [n], [n]:, or n. pattern
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        // Pattern matches [n], [n]:, or n. at the start of text
        // Group 1: number from [n] format, Group 2: number from n. format, Group 3: description
        const refStartPattern = /^(?:\[(\d+)\]:?|(\d+)\.)\s*(.*)$/;

        let node;
        while (node = walker.nextNode()) {
            const text = node.textContent.trim();
            const match = text.match(refStartPattern);

            if (match) {
                const num = match[1] || match[2]; // Get number from either format
                let description = (match[3] || '').trim();
                let url = null;

                // First priority: check immediate next sibling for <a> tag
                // This is the most accurate method when [n] text is followed by <a>
                let sibling = node.nextSibling;
                while (sibling) {
                    if (sibling.nodeType === Node.ELEMENT_NODE && sibling.tagName === 'A') {
                        url = sibling.href;
                        description = description.replace(/:?\s*$/, '');
                        break;
                    }
                    // Stop if we hit a <br> or another reference pattern
                    if (sibling.nodeType === Node.ELEMENT_NODE && sibling.tagName === 'BR') break;
                    if (sibling.nodeType === Node.TEXT_NODE && sibling.textContent.trim().match(/^(?:\[\d+\]|\d+\.)/)) break;
                    sibling = sibling.nextSibling;
                }

                // If still no URL, check if the description itself contains a URL
                if (!url) {
                    const urlMatch = description.match(/(https?:\/\/[^\s]+)/);
                    if (urlMatch) {
                        url = urlMatch[1];
                        description = description.replace(/:?\s*https?:\/\/[^\s]+/, '').trim();
                    }
                }

                if (description || url) {
                    const parent = node.parentElement;
                    references.set(num, {
                        description: description || `Reference ${num}`,
                        url: url,
                        element: parent
                    });
                }
            }
        }

        // Second pass: parse from innerHTML for elements containing multiple references
        // This handles the case where all refs are in a single <p> tag
        document.querySelectorAll('p, div').forEach(container => {
            const html = container.innerHTML;

            // Pattern 1: [n] or [n]: followed by description, then <a href="url">
            const bracketRefPattern = /\[(\d+)\]:?\s*([^<]*?)\s*<a[^>]+href=["']([^"']+)["'][^>]*>/g;

            let match;
            while ((match = bracketRefPattern.exec(html)) !== null) {
                const num = match[1];
                if (!references.has(num)) {
                    let description = match[2].trim().replace(/:?\s*$/, '');
                    const url = match[3];

                    references.set(num, {
                        description: description || `Reference ${num}`,
                        url: url,
                        element: container
                    });
                }
            }

            // Pattern 2: n. followed by description, then <a href="url">
            const dotRefPattern = /(?:^|<br\s*\/?>|[\n\r])(\d+)\.\s*([^<]*?)\s*<a[^>]+href=["']([^"']+)["'][^>]*>/g;

            while ((match = dotRefPattern.exec(html)) !== null) {
                const num = match[1];
                if (!references.has(num)) {
                    let description = match[2].trim().replace(/:?\s*$/, '');
                    const url = match[3];

                    references.set(num, {
                        description: description || `Reference ${num}`,
                        url: url,
                        element: container
                    });
                }
            }
        });

        // Third pass: handle <ol> lists where reference number is implicit from list position
        // Find <ol> elements that come after a References/Resources header
        const resourcesHeader = getResourcesHeader();
        if (resourcesHeader) {
            let sibling = resourcesHeader.nextElementSibling;
            while (sibling) {
                if (sibling.tagName === 'OL') {
                    const listItems = sibling.querySelectorAll('li');
                    listItems.forEach((li, index) => {
                        const num = String(index + 1); // 1-indexed
                        if (!references.has(num)) {
                            const linkElement = li.querySelector('a[href]');
                            const url = linkElement ? linkElement.href : null;

                            // Get description: text content before the link
                            let description = '';
                            for (const node of li.childNodes) {
                                if (node.nodeType === Node.TEXT_NODE) {
                                    description += node.textContent;
                                } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'A') {
                                    description += node.textContent;
                                } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A') {
                                    break; // Stop at the link
                                }
                            }
                            description = description.trim().replace(/[.:]\s*$/, '');

                            if (url || description) {
                                references.set(num, {
                                    description: description || `Reference ${num}`,
                                    url: url,
                                    element: li
                                });
                            }
                        }
                    });
                    break; // Found the references list
                }
                // Stop if we hit another header
                if (sibling.tagName && sibling.tagName.match(/^H[1-6]$/)) break;
                sibling = sibling.nextElementSibling;
            }
        }
    }

    // Find the Resources/References section header
    function getResourcesHeader() {
        // Try both "resources" and "references" IDs, and both h2 and h3 tags
        return document.querySelector('h2#resources, h2#references, h3#resources, h3#references') ||
               // Fallback: find by text content
               Array.from(document.querySelectorAll('h2, h3')).find(h =>
                   /^(resources|references)$/i.test(h.textContent.trim())
               );
    }

    // Find the Resources/References section element
    function getResourcesSection() {
        const resourcesHeader = getResourcesHeader();
        if (resourcesHeader) {
            // Return the parent container or next sibling that contains the references
            let sibling = resourcesHeader.nextElementSibling;
            while (sibling) {
                if (sibling.tagName === 'P' || sibling.tagName === 'DIV') {
                    return sibling;
                }
                sibling = sibling.nextElementSibling;
            }
        }
        return null;
    }

    // Check if an element is inside the Resources/References section
    function isInResourcesSection(element) {
        const resourcesHeader = getResourcesHeader();
        if (!resourcesHeader) return false;

        // Check if element comes after the resources header
        let current = resourcesHeader.nextElementSibling;
        while (current) {
            if (current.contains(element) || current === element) {
                return true;
            }
            current = current.nextElementSibling;
        }
        return false;
    }

    // Find and linkify [n] markers in the content
    function linkifyReferences() {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const nodesToProcess = [];
        const markerPattern = /\[(\d+)\]/g;

        let node;
        while (node = walker.nextNode()) {
            // Skip if already processed or inside a link
            if (node.parentElement.closest('.ref-link-wrapper, a[href]')) continue;
            // Skip reference definitions at the bottom (in Resources section) - both [n] and n. formats
            if (node.textContent.trim().match(/^(?:\[\d+\]:?|\d+\.)\s/)) continue;
            // Skip if inside the Resources/References section
            if (isInResourcesSection(node.parentElement)) continue;

            if (markerPattern.test(node.textContent)) {
                nodesToProcess.push(node);
            }
            markerPattern.lastIndex = 0;
        }

        nodesToProcess.forEach(textNode => {
            const text = textNode.textContent;
            const parent = textNode.parentElement;

            // Don't process if parent is already a link
            if (parent.tagName === 'A') return;

            const fragment = document.createDocumentFragment();
            let lastIndex = 0;
            let match;

            markerPattern.lastIndex = 0;
            while ((match = markerPattern.exec(text)) !== null) {
                const num = match[1];
                const ref = references.get(num);

                // Add text before the match
                if (match.index > lastIndex) {
                    fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
                }

                // Create wrapper span for link + arrow
                const wrapper = document.createElement('span');
                wrapper.className = 'ref-link-wrapper';
                wrapper.style.cssText = 'display: inline-flex; align-items: center; gap: 1px;';

                // Create the main link element
                const link = document.createElement('a');
                link.textContent = match[0];
                link.className = 'ref-link';

                if (ref && ref.url) {
                    link.href = ref.url;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.title = `${ref.description}\n(Click to open link)`;
                } else {
                    link.href = '#';
                    link.title = ref ? ref.description : 'Reference not found';
                    link.addEventListener('click', (e) => e.preventDefault());
                }

                // Apply styles to main link
                link.style.cssText = `
                    color: #3b82f6;
                    text-decoration: none;
                    cursor: pointer;
                    font-weight: 500;
                    padding: 0 2px;
                    border-radius: 2px 0 0 2px;
                    transition: background-color 0.2s;
                `;

                link.addEventListener('mouseenter', () => {
                    link.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                });
                link.addEventListener('mouseleave', () => {
                    link.style.backgroundColor = '';
                });

                // Create down arrow button to scroll to reference
                const arrowBtn = document.createElement('span');
                arrowBtn.textContent = '↓';
                arrowBtn.className = 'ref-scroll-btn';
                arrowBtn.title = 'Scroll to reference';
                arrowBtn.style.cssText = `
                    color: #3b82f6;
                    cursor: pointer;
                    font-size: 0.75em;
                    padding: 0 3px;
                    border-radius: 0 2px 2px 0;
                    transition: background-color 0.2s;
                    user-select: none;
                `;

                arrowBtn.addEventListener('mouseenter', () => {
                    arrowBtn.style.backgroundColor = 'rgba(59, 130, 246, 0.15)';
                });
                arrowBtn.addEventListener('mouseleave', () => {
                    arrowBtn.style.backgroundColor = '';
                });

                arrowBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // First check if we have a stored element for this reference
                    const ref = references.get(num);
                    if (ref && ref.element) {
                        ref.element.scrollIntoView({ behavior: 'smooth', block: 'center' });

                        // Highlight effect
                        const originalBg = ref.element.style.backgroundColor;
                        ref.element.style.backgroundColor = '#fef08a';
                        ref.element.style.transition = 'background-color 0.3s';
                        setTimeout(() => {
                            ref.element.style.backgroundColor = originalBg;
                        }, 2000);
                        return;
                    }

                    // Fallback: Find and scroll to the reference in Resources section
                    const resourcesHeader = getResourcesHeader();
                    if (resourcesHeader) {
                        // First check for <ol> list (numbered list)
                        let sibling = resourcesHeader.nextElementSibling;
                        while (sibling) {
                            if (sibling.tagName === 'OL') {
                                const listItems = sibling.querySelectorAll('li');
                                const targetIndex = parseInt(num) - 1; // 0-indexed
                                if (listItems[targetIndex]) {
                                    const targetElement = listItems[targetIndex];
                                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

                                    const originalBg = targetElement.style.backgroundColor;
                                    targetElement.style.backgroundColor = '#fef08a';
                                    targetElement.style.transition = 'background-color 0.3s';
                                    setTimeout(() => {
                                        targetElement.style.backgroundColor = originalBg;
                                    }, 2000);
                                    return;
                                }
                            }
                            if (sibling.tagName && sibling.tagName.match(/^H[1-6]$/)) break;
                            sibling = sibling.nextElementSibling;
                        }

                        // Second, look for text patterns in <p> or <div>
                        const resourcesSection = getResourcesSection();
                        if (resourcesSection) {
                            const refPatternBracket = new RegExp(`\\[${num}\\]`);
                            const refPatternDot = new RegExp(`(^|\\s)${num}\\.\\s`);

                            const walker = document.createTreeWalker(
                                resourcesSection,
                                NodeFilter.SHOW_TEXT,
                                null,
                                false
                            );

                            let textNode;
                            while (textNode = walker.nextNode()) {
                                const text = textNode.textContent;
                                if (refPatternBracket.test(text) || refPatternDot.test(text)) {
                                    const targetElement = textNode.parentElement;
                                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

                                    const originalBg = targetElement.style.backgroundColor;
                                    targetElement.style.backgroundColor = '#fef08a';
                                    targetElement.style.transition = 'background-color 0.3s';
                                    setTimeout(() => {
                                        targetElement.style.backgroundColor = originalBg;
                                    }, 2000);
                                    return;
                                }
                            }
                        }

                        // Final fallback: scroll to header
                        resourcesHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });

                wrapper.appendChild(link);
                wrapper.appendChild(arrowBtn);
                fragment.appendChild(wrapper);
                lastIndex = markerPattern.lastIndex;
            }

            // Add remaining text
            if (lastIndex < text.length) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
            }

            // Replace the text node
            if (fragment.childNodes.length > 0) {
                parent.replaceChild(fragment, textNode);
            }
        });
    }

    // Main function
    function processPage() {
        parseReferences();
        linkifyReferences();
        console.log(`[ByteByteGo Refs] Found ${references.size} references`);
    }

    // Initial run with delay to ensure page is loaded
    setTimeout(processPage, 1000);

    // Re-run on dynamic content changes
    const observer = new MutationObserver((mutations) => {
        let shouldProcess = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                shouldProcess = true;
                break;
            }
        }
        if (shouldProcess) {
            setTimeout(processPage, 500);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();