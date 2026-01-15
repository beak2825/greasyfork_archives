// ==UserScript==
// @name         Slow.pics Random Comparisons Link Generator
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Selects 10 random comparisons and generates links in [comparison=][/comparison] format
// @author       Auto
// @match        https://slow.pics/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-idle

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562462/Slowpics%20Random%20Comparisons%20Link%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/562462/Slowpics%20Random%20Comparisons%20Link%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function findComparisons() {
        const comparisons = [];
        let collection = null;
        let cdnUrl = 'https://i.slow.pics/';

        try {
            if (typeof unsafeWindow !== 'undefined') {
                if (unsafeWindow.collection) {
                    collection = unsafeWindow.collection;
                }
                if (unsafeWindow.cdnUrl) {
                    cdnUrl = unsafeWindow.cdnUrl;
                }
            }
        } catch (e) {}

        if (!collection) {
            const captureScript = document.createElement('script');
            captureScript.textContent = `
                (function() {
                    try {
                        if (typeof collection !== 'undefined') {
                            window.__slowpics_collection = JSON.parse(JSON.stringify(collection));
                        }
                        if (typeof cdnUrl !== 'undefined') {
                            window.__slowpics_cdnUrl = cdnUrl;
                        }
                    } catch(e) {
                        console.error('Error capturing collection:', e);
                    }
                })();
            `;
            (document.head || document.documentElement).appendChild(captureScript);
            captureScript.remove();

            if (window.__slowpics_collection) {
                collection = window.__slowpics_collection;
            }
            if (window.__slowpics_cdnUrl) {
                cdnUrl = window.__slowpics_cdnUrl;
            }
        }

        if (!collection) {
            const scripts = document.querySelectorAll('script:not([src])');
            for (const script of scripts) {
                const scriptText = script.textContent || script.innerHTML;
                const collectionMatch = scriptText.match(/var\s+collection\s*=\s*(\{[\s\S]*?\});/);
                if (collectionMatch) {
                    try {
                        const func = new Function('return ' + collectionMatch[1]);
                        collection = func();
                    } catch (e) {
                        try {
                            collection = JSON.parse(collectionMatch[1]);
                        } catch (e2) {
                            const comparisonsMatch = scriptText.match(/"comparisons"\s*:\s*(\[[\s\S]*?\])/);
                            if (comparisonsMatch) {
                                try {
                                    const comparisonsArray = JSON.parse(comparisonsMatch[1]);
                                    collection = { comparisons: comparisonsArray };
                                } catch (e3) {
                                    console.error('Failed to parse collection:', e3);
                                }
                            }
                        }
                    }
                }

                const cdnUrlMatch = scriptText.match(/var\s+cdnUrl\s*=\s*["']([^"']+)["']/);
                if (cdnUrlMatch) {
                    cdnUrl = cdnUrlMatch[1];
                }

                if (collection) break;
            }
        }

        if (!collection || !collection.comparisons || !Array.isArray(collection.comparisons)) {
            console.error('Could not find collection object on page');
            return [];
        }

        // Extract source names from the first comparison (if available)
        let sourceNames = [];
        if (collection.comparisons.length > 0 && collection.comparisons[0].images) {
            sourceNames = collection.comparisons[0].images.map(img => img.name || '').filter(name => name);
        }

        collection.comparisons.forEach((comparison) => {
            if (comparison.images && Array.isArray(comparison.images) && comparison.images.length >= 2) {
                const imageUrls = comparison.images.map(img => {
                    if (img.publicFileName) {
                        return cdnUrl + img.publicFileName;
                    }
                    return null;
                }).filter(url => url !== null);

                if (imageUrls.length >= 2) {
                    comparisons.push({
                        id: comparison.key,
                        name: comparison.name,
                        images: imageUrls,
                        sourceNames: sourceNames
                    });
                }
            }
        });

        return comparisons;
    }

    function getNumComparisons() {
        const saved = GM_getValue('numComparisons', 10);
        return parseInt(saved, 10) || 10;
    }

    function setNumComparisons(num) {
        GM_setValue('numComparisons', Math.max(1, Math.min(100, parseInt(num, 10) || 10)));
    }

    function processComparisons(allComparisons) {
        const totalComparisons = allComparisons.length;
        const numToSelect = Math.min(getNumComparisons(), totalComparisons);
        const shuffled = shuffle(allComparisons);
        const selectedComparisons = shuffled.slice(0, numToSelect);

        // Extract source names from the first comparison (if available)
        let sourceNames = [];
        if (selectedComparisons.length > 0 && selectedComparisons[0].sourceNames) {
            sourceNames = selectedComparisons[0].sourceNames;
        }

        // Build the comparison tag with source names
        const comparisonHeader = sourceNames.length > 0
            ? `[comparison=${sourceNames.join(', ')}]\n`
            : '[comparison=]\n';

        let output = comparisonHeader;

        selectedComparisons.forEach((comparison, index) => {
            comparison.images.forEach((imgUrl) => {
                const cleanUrl = imgUrl.split('?')[0];
                output += cleanUrl + '\n';
            });

            if (index < selectedComparisons.length - 1) {
                output += '\n';
            }
        });

        output += '[/comparison]';

        GM_setClipboard(output, 'text');
        showNotification(`Generated links for ${numToSelect} random comparisons! Copied to clipboard.`);

        console.log('=== Slow.pics Random Comparisons ===');
        console.log(`Total comparisons found: ${totalComparisons}`);
        console.log(`Randomly selected: ${numToSelect}`);
        console.log('\nGenerated Output:\n' + output);
        console.log('\nSelected comparisons details:');
        selectedComparisons.forEach((comp, idx) => {
            console.log(`  Comparison ${idx + 1} (${comp.name || comp.id}): ${comp.images.length} versions`);
            comp.images.forEach((url, i) => {
                console.log(`    Version ${i + 1}: ${url}`);
            });
        });
    }

    function generateComparisonLinks() {
        let allComparisons = findComparisons();

        if (allComparisons.length === 0) {
            setTimeout(() => {
                allComparisons = findComparisons();
                if (allComparisons.length === 0) {
                    alert('No comparisons found on this page. Make sure you are on a slow.pics comparison page.\n\nTry refreshing the page and clicking the button again.');
                    console.log('No comparisons found. Available window properties:',
                        Object.keys(window).filter(k => k.toLowerCase().includes('collection')));
                    return;
                }
                processComparisons(allComparisons);
            }, 500);
            return;
        }

        processComparisons(allComparisons);
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    GM_addStyle(`
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `);

    function addButton() {
        if (document.getElementById('slowpics-nav-item')) {
            return;
        }

        const navbarNav = document.querySelector('#navbar .navbar-nav');
        if (!navbarNav) {
            setTimeout(addButton, 500);
            return;
        }

        const navItem = document.createElement('div');
        navItem.id = 'slowpics-nav-item';
        navItem.className = 'nav-item dropdown';

        const navLink = document.createElement('a');
        navLink.className = 'nav-link dropdown-toggle';
        navLink.href = '#';
        navLink.id = 'slowpics-generator';
        navLink.setAttribute('data-bs-toggle', 'dropdown');
        navLink.setAttribute('aria-haspopup', 'true');
        navLink.setAttribute('aria-expanded', 'false');
        navLink.innerHTML = `<span class="d-none d-lg-inline">Generator</span> <span id="slowpics-count">${getNumComparisons()}</span>`;

        const dropdownMenu = document.createElement('div');
        dropdownMenu.className = 'dropdown-menu';
        dropdownMenu.setAttribute('aria-labelledby', 'slowpics-generator');
        dropdownMenu.style.cssText = 'min-width: 200px; padding: 12px;';

        const settingsDiv = document.createElement('div');
        settingsDiv.style.cssText = 'margin-bottom: 10px;';

        const label = document.createElement('label');
        label.textContent = 'Number of comparisons:';
        label.style.cssText = `
            display: block;
            margin-bottom: 5px;
            font-size: 12px;
            color:rgb(255, 255, 255);
            font-weight: 600;
        `;

        const input = document.createElement('input');
        input.type = 'number';
        input.min = '1';
        input.max = '100';
        input.value = getNumComparisons();
        input.className = 'form-control';
        input.style.cssText = `
            padding: 4px 8px;
            font-size: 13px;
            width: 100%;
            color: #212529;
        `;

        input.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        input.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });

        input.addEventListener('focus', (e) => {
            e.stopPropagation();
        });

        input.addEventListener('keydown', (e) => {
            e.stopPropagation();
        });

        input.addEventListener('change', (e) => {
            e.stopPropagation();
            const val = parseInt(e.target.value, 10);
            if (val >= 1 && val <= 100) {
                setNumComparisons(val);
                updateCount();
                updateGenerateButton();
            } else {
                e.target.value = getNumComparisons();
            }
        });

        const generateBtn = document.createElement('button');
        generateBtn.className = 'btn btn-success';
        generateBtn.id = 'slowpics-generate-btn';
        generateBtn.textContent = `Generate`;
        generateBtn.style.cssText = `
            width: 100%;
            padding: 6px 12px;
            font-size: 13px;
        `;

        generateBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            generateComparisonLinks();
            if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
                const bsDropdown = bootstrap.Dropdown.getInstance(navLink) || new bootstrap.Dropdown(navLink);
                if (bsDropdown) {
                    bsDropdown.hide();
                }
            }
        };

        function updateCount() {
            const countSpan = document.getElementById('slowpics-count');
            if (countSpan) {
                countSpan.textContent = getNumComparisons();
            }
        }

        function updateGenerateButton() {
            generateBtn.textContent = `Generate ${getNumComparisons()}`;
        }

        settingsDiv.appendChild(label);
        settingsDiv.appendChild(input);
        dropdownMenu.appendChild(settingsDiv);
        dropdownMenu.appendChild(generateBtn);

        navItem.appendChild(navLink);
        navItem.appendChild(dropdownMenu);

        const imageNavItem = navbarNav.querySelector('#images').closest('.nav-item.dropdown');
        if (imageNavItem && imageNavItem.nextSibling) {
            imageNavItem.parentNode.insertBefore(navItem, imageNavItem.nextSibling);
        } else if (imageNavItem) {
            imageNavItem.parentNode.appendChild(navItem);
        } else {
            navbarNav.appendChild(navItem);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addButton);
    } else {
        addButton();
    }

    setTimeout(addButton, 1000);
})();
