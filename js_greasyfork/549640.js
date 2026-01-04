// ==UserScript==
// @name         Indeed Fresh Job Highlighter with User Input (Brave-Optimized)
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Highlights fresh job postings on Indeed.com based on user-specified days. Optimized for Brave browser and logged-in users.
// @author       Grok
// @match        https://*.indeed.com/*
// @grant        none
// @run-at       document-idle
// @license      PNDT
// @downloadURL https://update.greasyfork.org/scripts/549640/Indeed%20Fresh%20Job%20Highlighter%20with%20User%20Input%20%28Brave-Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549640/Indeed%20Fresh%20Job%20Highlighter%20with%20User%20Input%20%28Brave-Optimized%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentMaxDays = localStorage.getItem('indeedFreshMaxDays') ? parseInt(localStorage.getItem('indeedFreshMaxDays'), 10) : 1;
    let isInitialized = false;

    // Function to parse days from date text
    function getDaysFromDateText(dateText) {
        if (!dateText) return Infinity;
        const normalizedText = dateText.toLowerCase().trim();
        if (normalizedText.includes('today') || normalizedText.includes('just posted') || normalizedText.includes('new') || normalizedText.includes('active today')) {
            return 0;
        }
        const match = normalizedText.match(/(\d+)\s*(days?|hrs?|hours?)\s*(ago)?/i);
        if (match) {
            const num = parseInt(match[1], 10);
            if (match[2].toLowerCase().startsWith('h') || normalizedText.includes('active')) {
                return 0;
            }
            return num;
        }
        if (normalizedText.includes('30+') || normalizedText.includes('<30')) {
            return normalizedText.includes('30+') ? Infinity : 29;
        }
        const postedMatch = normalizedText.match(/posted\s+(\d+)\s+days?\s+ago/i);
        return postedMatch ? parseInt(postedMatch[1], 10) : Infinity;
    }

    // Function to check if a job is fresh
    function isFreshJob(dateText, maxDays) {
        const days = getDaysFromDateText(dateText);
        return days <= maxDays && days !== Infinity;
    }

    // Function to clear previous highlights
    function clearHighlights() {
        const selectors = [
            '[data-jk]', '.jobsearch-SerpJobCard', '.job_seen_beacon',
            'div[role="article"]', '.css-1cp6a5z', '.jobCard_main',
            '.slider_container [data-jk]'
        ].join(', ');
        const jobCards = document.querySelectorAll(selectors);
        jobCards.forEach(card => {
            card.style.border = '';
            card.style.backgroundColor = '';
            card.style.padding = '';
            card.style.marginBottom = '';
            card.style.borderRadius = '';
            const freshLabel = card.querySelector('span.fresh-label');
            if (freshLabel) freshLabel.remove();
        });
        console.log('Highlights cleared. Processed:', jobCards.length, 'elements.');
    }

    // Function to highlight fresh jobs
    function highlightFreshJobs(maxDays) {
        clearHighlights();
        currentMaxDays = maxDays;
        localStorage.setItem('indeedFreshMaxDays', maxDays); // Persist user preference

        const selectors = [
            '[data-jk]', '.jobsearch-SerpJobCard', '.job_seen_beacon',
            'div[role="article"]', '.css-1cp6a5z', '.jobCard_main',
            '.slider_container [data-jk]'
        ].join(', ');
        let jobCards = document.querySelectorAll(selectors);

        // Narrowed fallback selector to reduce false positives
        if (jobCards.length === 0) {
            jobCards = document.querySelectorAll('div:has(a[href*="/viewjob"][data-jk])');
            console.warn('Using fallback selectors. Found:', jobCards.length, 'potential cards.');
        }

        console.log(`Found ${jobCards.length} potential job cards.`);

        let highlightedCount = 0;
        jobCards.forEach((card, index) => {
            let dateElement = card.querySelector('.date, time, [datetime], span[aria-label*="posted"], .css-1saizt3, .jobsearch-JobBeacon span:last-child, .postedTime');
            if (!dateElement) {
                const allSpans = card.querySelectorAll('span, time, div');
                for (let elem of allSpans) {
                    const text = elem.textContent || elem.getAttribute('aria-label') || '';
                    if (getDaysFromDateText(text) < Infinity) {
                        dateElement = elem;
                        console.log(`Fallback date found in card ${index}:`, text);
                        break;
                    }
                }
            }

            if (dateElement) {
                const dateText = dateElement.textContent.trim() || dateElement.getAttribute('aria-label') || '';
                console.log(`Card ${index} date text: "${dateText}" -> ${getDaysFromDateText(dateText)} days`);
                if (isFreshJob(dateText, maxDays)) {
                    card.style.border = '2px solid #00cc00';
                    card.style.backgroundColor = '#e6ffe6';
                    card.style.padding = '5px';
                    card.style.marginBottom = '10px';
                    card.style.borderRadius = '5px';

                    let titleElement = card.querySelector('h2 a, .title a, .jobTitle a, h2, .title, .jobTitle');
                    if (!titleElement) {
                        titleElement = card.querySelector('a[href*="/viewjob"]') || card.querySelector('h2');
                    }
                    if (titleElement && !titleElement.querySelector('span.fresh-label')) {
                        const freshLabel = document.createElement('span');
                        const daysAgo = getDaysFromDateText(dateText);
                        freshLabel.textContent = ` Fresh! (${daysAgo === 0 ? 'Today' : daysAgo + ' days ago'})`;
                        freshLabel.style.cssText = `
                            color: #00cc00; font-weight: bold; margin-left: 10px;
                            background-color: #ccffcc; padding: 2px 5px; border-radius: 3px;
                        `;
                        freshLabel.className = 'fresh-label';
                        freshLabel.setAttribute('aria-live', 'polite'); // Accessibility
                        titleElement.appendChild(freshLabel);
                        highlightedCount++;
                    }
                }
            } else {
                console.log(`No date element found in card ${index}.`);
            }
        });

        const statusElement = document.getElementById('fresh-status');
        if (statusElement) {
            if (jobCards.length === 0) {
                statusElement.textContent = 'No job listings found. Perform a search or disable Brave Shields.';
                statusElement.style.color = '#ff0000';
            } else {
                statusElement.textContent = `Highlighted ${highlightedCount} fresh jobs (≤ ${maxDays} days) out of ${jobCards.length}.`;
                statusElement.style.color = '#00cc00';
            }
        }
    }

    // Create control panel
    function createControlPanel() {
        if (document.getElementById('fresh-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'fresh-panel';
        panel.setAttribute('role', 'region');
        panel.setAttribute('aria-label', 'Fresh Job Highlighter Control Panel');
        panel.style.cssText = `
            position: fixed; top: 10px; right: 10px; background: #fff; border: 1px solid #ccc;
            padding: 10px; z-index: 10000; box-shadow: 0 2px 10px rgba(0,0,0,0.2); border-radius: 5px;
            font-family: Arial, sans-serif; font-size: 12px; max-width: 250px; min-width: 200px;
        `;

        const title = document.createElement('div');
        title.textContent = 'Fresh Job Highlighter (Brave)';
        title.style.cssText = 'font-weight: bold; margin-bottom: 5px; color: #333; font-size: 13px;';

        const instructions = document.createElement('div');
        instructions.textContent = '1. Search for jobs. 2. Enter days. 3. Click Apply.';
        instructions.style.cssText = 'font-size: 10px; color: #666; margin-bottom: 5px;';

        const label = document.createElement('label');
        label.setAttribute('for', 'days-input');
        label.textContent = 'Jobs within (days): ';
        label.style.cssText = 'display: block; margin-bottom: 5px;';

        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.value = currentMaxDays.toString();
        input.id = 'days-input';
        input.setAttribute('aria-label', 'Number of days for fresh jobs');
        input.style.cssText = 'width: 50px; margin-bottom: 5px;';

        const applyButton = document.createElement('button');
        applyButton.textContent = 'Apply Filter';
        applyButton.setAttribute('aria-label', 'Apply fresh job filter');
        applyButton.style.cssText = `
            background: #00cc00; color: #fff; border: none; padding: 5px 10px; cursor: pointer;
            border-radius: 3px; width: 100%; margin-bottom: 5px;
        `;

        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear Highlights';
        clearButton.setAttribute('aria-label', 'Clear job highlights');
        clearButton.style.cssText = `
            background: #ff6666; color: #fff; border: none; padding: 5px 10px; cursor: pointer;
            border-radius: 3px; width: 100%; margin-bottom: 5px;
        `;

        const statusElement = document.createElement('div');
        statusElement.id = 'fresh-status';
        statusElement.setAttribute('aria-live', 'polite');
        statusElement.textContent = 'Ready. Search for jobs to highlight.';
        statusElement.style.cssText = 'margin-top: 5px; font-size: 11px; color: #666;';

        // Event listeners
        applyButton.addEventListener('click', () => {
            const maxDays = parseInt(input.value, 10);
            if (isNaN(maxDays) || maxDays < 0 || input.value.trim() === '') {
                alert('Please enter a valid number of days (0 or greater).');
                input.value = currentMaxDays; // Reset to last valid value
                return;
            }
            highlightFreshJobs(maxDays);
        });

        clearButton.addEventListener('click', () => {
            clearHighlights();
            statusElement.textContent = 'Highlights cleared.';
            statusElement.style.color = '#666';
        });

        // Append elements
        panel.appendChild(title);
        panel.appendChild(instructions);
        panel.appendChild(label);
        panel.appendChild(input);
        panel.appendChild(applyButton);
        panel.appendChild(clearButton);
        panel.appendChild(statusElement);

        document.body.appendChild(panel);
        console.log('Fresh Job Highlighter panel created.');
    }

    // Wait for job listings
    function waitForJobListings(callback, maxWait = 30000) {
        let waited = 0;
        const checkInterval = setInterval(() => {
            waited += 1000;
            const hasJobs = document.querySelectorAll('[data-jk], .jobsearch-SerpJobCard').length > 0;
            const isSearchPage = window.location.search.includes('q=') || document.querySelector('.jobsearch-SerpJobCard');
            if (hasJobs || waited >= maxWait) {
                clearInterval(checkInterval);
                if (hasJobs) {
                    console.log('Job listings detected. Initializing...');
                    callback();
                } else {
                    console.warn('Timeout: No jobs found. Try disabling Brave Shields or performing a search.');
                }
            }
        }, 1000);
    }

    // Initialize
    if (!isInitialized) {
        isInitialized = true;
        waitForJobListings(() => {
            createControlPanel();
            setTimeout(() => highlightFreshJobs(currentMaxDays), 1000);
        }, 30000); // Reduced timeout to 30s for faster feedback

        if (window.location.search.includes('q=')) {
            setTimeout(() => {
                createControlPanel();
                highlightFreshJobs(currentMaxDays);
            }, 2000);
        }
    }

    // MutationObserver for dynamic content
    const observer = new MutationObserver((mutations) => {
        let shouldRehighlight = false;
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                const hasNewJobs = Array.from(mutation.addedNodes).some(node =>
                    node.nodeType === 1 && (
                        (node.matches && node.matches('[data-jk], .jobsearch-SerpJobCard')) ||
                        (node.querySelector && node.querySelector('[data-jk], .jobsearch-SerpJobCard'))
                    )
                );
                if (hasNewJobs) shouldRehighlight = true;
            }
        });
        if (shouldRehighlight) {
            console.log('New jobs detected. Rehighlighting...');
            setTimeout(() => {
                const input = document.getElementById('days-input');
                const maxDays = input ? parseInt(input.value, 10) : currentMaxDays;
                highlightFreshJobs(maxDays);
            }, 1000);
        }
    });

    // Observe specific containers to reduce performance impact
    const containers = document.querySelectorAll('#mosaic-provider-jobcards, #resultsCol, .jobsearch-ResultsList, .slider_container');
    if (containers.length > 0) {
        containers.forEach(container => {
            observer.observe(container, { childList: true, subtree: true });
        });
    } else {
        observer.observe(document.body, { childList: true, subtree: true });
    }

    console.log('Indeed Fresh Job Highlighter v4.1 loaded.');
})();