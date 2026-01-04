// ==UserScript==
// @name         OriginsHelper
// @namespace    https://greasyfork.org/en/users/1525357-strike978
// @version      0.6
// @description  Instantly toggle a grouped macro-region DNA ethnicity table with confidence ranges on Ancestry
// @author       Omar Nunez
// @include      /^https:\/\/www\.ancestry\.[a-z.]+\/dna\/origins\/.*/
// @include      /^https:\/\/www\.ancestry\.[a-z.]+\/discoveryui-matches\/compare\/.*\/with\/.*/
// @license      CC BY-NC 4.0
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/552333/OriginsHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/552333/OriginsHelper.meta.js
// ==/UserScript==

/*
 * OriginsHelper - AncestryDNA Ethnicity Table Enhancer
 * Copyright (c) 2025 Omar Nunez
 * 
 * Licensed under Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
 * https://creativecommons.org/licenses/by-nc/4.0/
 */


(function() {
    'use strict';

    // Constants
    const BASE_ORIGIN = window.location.origin;
    const ETHNICITY_API_URL = (testId) => `${BASE_ORIGIN}/dna/origins/secure/tests/${testId}/v2/ethnicity`;
    const HTML2CANVAS_CDN = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
    // Added: Useful external links as constants
    const CONFIDENCE_RANGE_HELP_URL = `${BASE_ORIGIN}/cs/dna-help/ethnicity/bootstrapping`;
    const REGION_DETAILS_BASE_URL = `${BASE_ORIGIN}/dna/origins`;

    // Batch Ethnicity API (for compare pages)
    const BATCH_ETHNICITY_API_URL = (baseId) => `${BASE_ORIGIN}/dna/origins/secure/compare/${baseId}/batchEthnicity`;
    
    // Batch Communities API (for compare pages)
    const BATCH_COMMUNITIES_API_URL = (baseId) => `${BASE_ORIGIN}/dna/origins/secure/compare/${baseId}/batchCommunities`;
    const JOURNEY_NAMES_URL = 'https://admixr.com/ancestry/ancestry_journey_names.json';
    const REGION_NAMES_URL = 'https://admixr.com/ancestry/ancestry_region_names.json';
    
    // Utility: Extract compare IDs from URL
    function extractCompareIds() {
        // URL pattern: /discoveryui-matches/compare/{id1}/with/{id2}(/ethnicity)?
        const match = window.location.pathname.match(/\/compare\/([A-Fa-f0-9-]+)\/with\/([A-Fa-f0-9-]+)/i);
        if (!match) return null;
        return { id1: match[1], id2: match[2] };
    }

    // Insert buttons directly on compare page (used by observer)
    function insertComparePageButtons(compareDataEl) {
        const ids = extractCompareIds();
        if (!ids) {
            console.log('OriginsHelper: No compare IDs found in URL');
            return;
        }
        
        // Double-check that we're not inserting duplicates
        if (document.querySelector('button[data-origins-helper="ranges"]')) {
            console.log('OriginsHelper: Buttons already exist, skipping insertion');
            return;
        }
        
        console.log('OriginsHelper: Creating buttons for compare page');
        
        // Create button wrapper
        const buttonWrapper = document.createElement('div');
        buttonWrapper.style.cssText = 'margin-bottom:12px; display:flex; align-items:center; gap:10px;';
        buttonWrapper.setAttribute('data-origins-helper', 'wrapper'); // Add tracking
        
        // Create ranges button
        const rangesBtn = document.createElement('button');
        rangesBtn.setAttribute('data-origins-helper', 'ranges'); // Add tracking attribute
        rangesBtn.innerHTML = ICONS.ranges + 'Show Journeys & Confidence Ranges';
        rangesBtn.style.cssText = 'padding:7px 16px; font-size:15px; font-weight:600; background:#2563eb; color:#fff; border:1.5px solid #1e40af; border-radius:6px; cursor:pointer; display:flex; align-items:center; transition:background 0.15s;';
        rangesBtn.onmouseover = () => { rangesBtn.style.background = '#1d4ed8'; };
        rangesBtn.onmouseout = () => { rangesBtn.style.background = rangesBtn.disabled ? '#6b7280' : '#2563eb'; };

        rangesBtn.onclick = async () => {
            try {
                rangesBtn.innerHTML = ICONS.loading + 'Loading...';
                rangesBtn.disabled = true;
                rangesBtn.style.background = '#6b7280';
                
                // Use batch API to get confidence ranges for both people at once
                const batchUrl = BATCH_ETHNICITY_API_URL(ids.id1.toUpperCase());
                const payload = [ids.id1.toUpperCase(), ids.id2.toUpperCase()];
                
                const response = await fetch(batchUrl, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(payload)
                });
                
                const batchData = await response.json();
                
                // Fetch communities data
                const communitiesUrl = BATCH_COMMUNITIES_API_URL(ids.id1.toUpperCase());
                const communitiesPayload = [ids.id2];
                
                const communitiesResponse = await fetch(communitiesUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(communitiesPayload)
                });
                
                if (!communitiesResponse.ok) {
                    throw new Error(`Communities API HTTP ${communitiesResponse.status}: ${communitiesResponse.statusText}`);
                }
                
                const communitiesData = await communitiesResponse.json();
                
                // Add confidence ranges to the page
                await addConfidenceRangesToPageBatch(batchData, ids);
                
                // Add journeys data above the ethnicity data
                await addJourneysToPage(communitiesData, ids);
                
                // Update button to success state
                rangesBtn.innerHTML = ICONS.check + 'Ranges & Journeys Visible';
                rangesBtn.style.background = '#16a34a';
                rangesBtn.onmouseout = () => { rangesBtn.style.background = '#16a34a'; };
            } catch (err) {
                console.error('Error adding confidence ranges:', err);
                rangesBtn.innerHTML = ICONS.ranges + 'Failed - Retry';
                rangesBtn.disabled = false;
                rangesBtn.style.background = '#dc2626';
                rangesBtn.onmouseout = () => { rangesBtn.style.background = '#dc2626'; };
            }
        };
        
        // Create screenshot button
        const screenshotBtn = createScreenshotButton(async () => {
            const buttonWrapper = document.querySelector('[data-origins-helper="wrapper"]');
            if (buttonWrapper) {
                buttonWrapper.style.display = 'none';
                try {
                    await takeScreenshot(buttonWrapper.parentNode);
                } finally {
                    buttonWrapper.style.display = '';
                }
            }
        });
        screenshotBtn.style.marginLeft = '0'; // Remove default margin since we're using gap
        
        // Add buttons to wrapper
        buttonWrapper.appendChild(rangesBtn);
        buttonWrapper.appendChild(screenshotBtn);
        
        // Simple insertion - find the best location and insert
        const insertTarget = document.querySelector('.compare-data') || 
                             document.querySelector('[role="grid"]') || 
                             compareDataEl;
        
        if (insertTarget && insertTarget.parentNode) {
            insertTarget.parentNode.insertBefore(buttonWrapper, insertTarget);
        }
    }




    // Add confidence ranges to the compare page using batch API data
    async function addConfidenceRangesToPageBatch(batchData, ids) {
        try {
            const person1Id = ids.id1.toUpperCase();
            const person2Id = ids.id2.toUpperCase();
            
            // Collect all region keys from both people to fetch names
            const allRegionKeys = new Set();
            
            // Collect region keys from person 1
            if (batchData[person1Id] && batchData[person1Id].regions) {
                batchData[person1Id].regions.forEach(region => {
                    allRegionKeys.add(region.key);
                });
            }
            
            // Collect region keys from person 2  
            if (batchData[person2Id] && batchData[person2Id].regions) {
                batchData[person2Id].regions.forEach(region => {
                    allRegionKeys.add(region.key);
                });
            }
            
            // Fetch region names from the Names API
            const namesMap = await fetchRegionNames(Array.from(allRegionKeys));
            
            // Create maps of region name to confidence data for both people
            const person1RangesByName = {};
            const person2RangesByName = {};
            
            // Process person 1 data from batch response
            if (batchData[person1Id] && batchData[person1Id].regions) {
                batchData[person1Id].regions.forEach(region => {
                    // Use the fetched region name as the key
                    const regionName = namesMap[region.key] || region.key;
                    person1RangesByName[regionName] = {
                        lower: Math.round(region.lowerConfidence || 0),
                        upper: Math.round(region.upperConfidence || 0),
                        percentage: Math.round(region.percentage || 0)
                    };
                });
            }
            
            // Process person 2 data from batch response
            if (batchData[person2Id] && batchData[person2Id].regions) {
                batchData[person2Id].regions.forEach(region => {
                    // Use the fetched region name as the key
                    const regionName = namesMap[region.key] || region.key;
                    person2RangesByName[regionName] = {
                        lower: Math.round(region.lowerConfidence || 0),
                        upper: Math.round(region.upperConfidence || 0),
                        percentage: Math.round(region.percentage || 0)
                    };
                });
            }
            // Find all rows with percentage data
            const rows = document.querySelectorAll('[role="row"]');
            
            rows.forEach((row, rowIndex) => {
                // Look for row header (region name) and gridcells (percentages)
                const rowHeader = row.querySelector('[role="rowheader"]');
                const gridCells = row.querySelectorAll('[role="gridcell"]');
                
                if (!rowHeader || gridCells.length < 2) return;
                
                // Skip the duplicate/hidden rows (they have hideVisually class in rowheader)
                if (rowHeader.classList.contains('hideVisually')) {
                    return;
                }
                
                // Extract region name from row header
                let regionName = rowHeader.textContent?.trim();
                if (!regionName) return;
                
                // Clean up region name - remove macro region prefix if present
                // Example: "Iberian Peninsula : Portugal" -> "Portugal"
                if (regionName.includes(' : ')) {
                    regionName = regionName.split(' : ')[1].trim();
                }
                
                // Process each gridcell in this row
                gridCells.forEach((cell, cellIndex) => {
                    const text = cell.textContent?.trim();
                    
                    // Skip cells that don't contain just a percentage (already have ranges or are not percentages)
                    if (!text || !/^\d+%$/.test(text)) {
                        return;
                    }
                    
                    const percentage = parseInt(text.replace('%', ''));
                    
                    // Skip cells with 0% - no need to add ranges for regions someone doesn't have
                    if (percentage === 0) {
                        return;
                    }
                    
                    // Determine which person based on cell position (0 = left/person1, 1 = right/person2)
                    const isLeftPerson = cellIndex === 0;
                    const ranges = isLeftPerson ? person1RangesByName : person2RangesByName;
                    
                    // Look for matching region in the ranges
                    let matchedRange = null;
                    
                    // Debug logging
                    console.log(`Looking for match: regionName="${regionName}", percentage=${percentage}, isLeftPerson=${isLeftPerson}`);
                    
                    // First try exact name match with percentage verification
                    if (ranges[regionName] && ranges[regionName].percentage === percentage) {
                        matchedRange = ranges[regionName];
                        console.log(`✅ Exact match found: ${regionName} = ${percentage}% (${matchedRange.lower}-${matchedRange.upper}%)`);
                    } else {
                        // Try percentage match first (most reliable) - but ensure it's a reasonable match
                        for (const [rangeName, range] of Object.entries(ranges)) {
                            if (range.percentage === percentage) {
                                // Additional check: make sure the region names are somewhat related
                                const regionLower = regionName.toLowerCase();
                                const rangeLower = rangeName.toLowerCase();
                                
                                // If percentage matches exactly, use it (unless names are completely unrelated)
                                if (rangeLower.includes(regionLower) || regionLower.includes(rangeLower) || 
                                    rangeLower === regionLower || percentage >= 5) { // Accept high percentages even with name mismatches
                                    matchedRange = range;
                                    console.log(`✅ Percentage match found: ${regionName} (${percentage}%) matched with ${rangeName} (${range.percentage}%) = (${range.lower}-${range.upper}%)`);
                                    break;
                                }
                            }
                        }
                        
                        // If still no match, try fuzzy name matching with percentage proximity
                        if (!matchedRange) {
                            let bestMatch = null;
                            let bestScore = 0;
                            
                            for (const [rangeName, range] of Object.entries(ranges)) {
                                const regionLower = regionName.toLowerCase();
                                const rangeLower = rangeName.toLowerCase();
                                
                                // Calculate matching score
                                let score = 0;
                                if (rangeLower.includes(regionLower) || regionLower.includes(rangeLower)) {
                                    score += 10; // Name similarity bonus
                                }
                                
                                // Percentage proximity bonus (closer percentages get higher scores)
                                const percentageDiff = Math.abs(range.percentage - percentage);
                                if (percentageDiff <= 2) score += 5;
                                else if (percentageDiff <= 5) score += 2;
                                
                                if (score > bestScore && score >= 5) { // Minimum threshold
                                    bestScore = score;
                                    bestMatch = range;
                                }
                            }
                            
                            if (bestMatch) {
                                matchedRange = bestMatch;
                                console.log(`✅ Fuzzy match found: ${regionName} (${percentage}%) matched with score ${bestScore} = (${matchedRange.lower}-${matchedRange.upper}%)`);
                            }
                        }
                    }
                    
                    if (!matchedRange) {
                        console.log(`❌ No match found for: ${regionName} (${percentage}%)`);
                    }
                    
                    if (matchedRange) {
                        // Add confidence range to cell
                        const rangeText = ` (${matchedRange.lower}-${matchedRange.upper}%)`;
                        cell.textContent = cell.textContent + rangeText;
                    }
                });
            });
            
        } catch (err) {
            console.error('Error adding confidence ranges:', err);
        }
    }
    
    // Add journeys data to the compare page
    async function addJourneysToPage(communitiesData, ids) {
        try {
            console.log('OriginsHelper: Adding journeys data:', communitiesData);
            // Fetch journey names
            let journeyNamesMap = {};
            try {
                const namesData = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: JOURNEY_NAMES_URL,
                        onload: (response) => {
                            if (response.status === 200) {
                                try {
                                    resolve(JSON.parse(response.responseText));
                                } catch (e) {
                                    reject(new Error('Invalid JSON response'));
                                }
                            } else {
                                reject(new Error(`HTTP ${response.status}`));
                            }
                        },
                        onerror: () => reject(new Error('Network error'))
                    });
                });
                
                // Create a map of ID to name
                for (const [key, value] of Object.entries(namesData)) {
                    journeyNamesMap[key] = value.name;
                    if (value.subjourneys) {
                        for (const [subKey, subName] of Object.entries(value.subjourneys)) {
                            journeyNamesMap[subKey] = subName;
                        }
                    }
                }
            } catch (err) {
                console.warn('OriginsHelper: Failed to fetch journey names:', err.message, '- using IDs instead');
            }
            
            // Extract branches for the person (assuming the response has at least one person's data)
            const personData = Object.values(communitiesData)[0];
            if (!personData) {
                console.error('OriginsHelper: No person data found in communities response');
                return;
            }
            
            const branches = personData.branches || [];
            
            // Build journeys table HTML
            let html = `<h3 style="margin-top:0; margin-bottom:15px; color:#1f2937; font-size:18px; font-weight:600;">Ancestral journeys</h3>
                <table style="border-collapse:collapse; font-size:14px; background:#fff; margin-top:6px; width:100%; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                <thead><tr>
                    <th style="background:#2563eb; color:#fff; padding:10px 12px; font-weight:600; text-align:left; border-bottom:2px solid #1e40af;">Journey</th>
                    <th style="background:#2563eb; color:#fff; padding:10px 12px; font-weight:600; text-align:left; border-bottom:2px solid #1e40af;">Connection</th>
                    <th style="background:#2563eb; color:#fff; padding:10px 12px; font-weight:600; text-align:right; border-bottom:2px solid #1e40af;">Percentage</th>
                </tr></thead><tbody>`;
                
            if (branches.length > 0) {
                for (const branch of branches) {
                    // Main branch
                    const branchName = journeyNamesMap[branch.id] || branch.id;
                    const connectionColor = branch.connection === 'VERY_LIKELY' ? '#16a34a' : branch.connection === 'LIKELY' ? '#2563eb' : '#ea580c';
                    html += '<tr>';
                    html += `<td style="padding:10px 12px; font-weight:600; background:#f0f9ff; border-bottom:1px solid #e5e7eb; color:#1f2937;">${branchName}</td>`;
                    html += `<td style="padding:10px 12px; background:#f0f9ff; border-bottom:1px solid #e5e7eb;"><span style="display:inline-block; padding:2px 8px; background:${connectionColor}; color:#fff; border-radius:12px; font-size:12px; font-weight:500;">${branch.connection.replace('_', ' ')}</span></td>`;
                    html += `<td style="padding:10px 12px; background:#f0f9ff; border-bottom:1px solid #e5e7eb; text-align:right; font-weight:600; color:#1f2937;">${branch.connectionPercent}%</td>`;
                    html += '</tr>';
                    
                    // Communities
                    if (branch.communities && branch.communities.length > 0) {
                        for (const community of branch.communities) {
                            const communityName = journeyNamesMap[community.id] || community.id;
                            const communityConnectionColor = community.connection === 'VERY_LIKELY' ? '#16a34a' : community.connection === 'LIKELY' ? '#2563eb' : '#ea580c';
                            html += '<tr>';
                            html += `<td style="padding:8px 12px 8px 36px; background:#fafafa; border-bottom:1px solid #e5e7eb; color:#4b5563; font-style:italic;">└ ${communityName}</td>`;
                            html += `<td style="padding:8px 12px; background:#fafafa; border-bottom:1px solid #e5e7eb;"><span style="display:inline-block; padding:1px 6px; background:${communityConnectionColor}; color:#fff; border-radius:10px; font-size:11px; font-weight:500;">${community.connection.replace('_', ' ')}</span></td>`;
                            html += `<td style="padding:8px 12px; background:#fafafa; border-bottom:1px solid #e5e7eb; text-align:right; font-weight:500; color:#4b5563;">${community.connectionPercent}%</td>`;
                            html += '</tr>';
                        }
                    }
                }
            } else {
                html += '<tr><td colspan="3" style="padding:20px; text-align:center; color:#6b7280; font-style:italic; background:#f9fafb;">No journeys found</td></tr>';
            }
            html += '</tbody></table>';
            
            // Insert after the buttons, before the ethnicity data
            const journeysDiv = document.createElement('div');
            journeysDiv.innerHTML = html;
            const buttonWrapper = document.querySelector('[data-origins-helper="wrapper"]');
            if (buttonWrapper) {
                buttonWrapper.parentNode.insertBefore(journeysDiv, buttonWrapper.nextSibling);
                console.log('OriginsHelper: Journeys table inserted after buttons');
            } else {
                console.log('OriginsHelper: Button wrapper not found, cannot insert journeys');
            }
            
        } catch (err) {
            console.error('Error adding journeys:', err);
        }
    }
    
    // SVG Icons
    const ICONS = {
        table: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" style="vertical-align:middle; margin-right:7px;"><rect x="3" y="6" width="18" height="12" rx="2.5" stroke="#fff" stroke-width="2" fill="none"/><path d="M3 14h18" stroke="#fff" stroke-width="2"/></svg>',
        eyeOff: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" style="vertical-align:middle; margin-right:7px;"><path d="M17.94 17.94A10.06 10.06 0 0 1 12 19c-5 0-9.27-3.11-11-7 1.13-2.47 3.13-4.5 5.66-5.66m3.1-1.01A9.77 9.77 0 0 1 12 5c5 0 9.27 3.11 11 7a11.18 11.18 0 0 1-2.06 3.11M1 1l22 22" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="#fff" stroke-width="2" fill="none"/></svg>',
        camera: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" style="vertical-align:middle; margin-right:6px;"><rect x="3" y="7" width="18" height="12" rx="2" stroke="#fff" stroke-width="2" fill="#22c55e"/><circle cx="12" cy="13" r="3.5" stroke="#fff" stroke-width="2" fill="#22c55e"/><rect x="7" y="4" width="2" height="3" rx="1" fill="#22c55e" stroke="#fff" stroke-width="2"/></svg>',
        info: '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" style="display:inline; vertical-align:middle;"><circle cx="12" cy="12" r="10" stroke="#2563eb" stroke-width="2" fill="#fff"/><path d="M12 8.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-1 3.5h2v5h-2v-5z" fill="#2563eb"/></svg>',
        ranges: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" style="vertical-align:middle; margin-right:6px;"><path d="M3 12h18m-9-9v18" stroke="#fff" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="2" fill="#fff"/></svg>',
        check: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" style="vertical-align:middle; margin-right:6px;"><path d="M20 6L9 17l-5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        loading: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" style="vertical-align:middle; margin-right:6px; animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10" stroke="#fff" stroke-width="2" stroke-dasharray="31.416" stroke-dashoffset="31.416" opacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg><style>@keyframes spin { to { transform: rotate(360deg); } }</style>'
    };

    // Utility Functions
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);
            
            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => {
                observer.disconnect();
                reject(new Error('Timeout waiting for ' + selector));
            }, timeout);
        });
    }

    function extractTestId() {
        const pathMatch = window.location.pathname.match(/\/dna\/origins\/([A-Fa-f0-9-]+)/i);
        if (!pathMatch) throw new Error('Could not extract test ID from URL: ' + window.location.pathname);
        return pathMatch[1];
    }

    // API Functions
    async function fetchEthnicityData(testId) {
        const response = await fetch(ETHNICITY_API_URL(testId), { credentials: 'include' });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return response.json();
    }

    async function fetchRegionNames(keys) {
        try {
            const regionData = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: REGION_NAMES_URL,
                    onload: (response) => {
                        if (response.status === 200) {
                            try {
                                resolve(JSON.parse(response.responseText));
                            } catch (e) {
                                reject(new Error('Invalid JSON response'));
                            }
                        } else {
                            reject(new Error(`HTTP ${response.status}`));
                        }
                    },
                    onerror: () => reject(new Error('Network error'))
                });
            });

            // Create a map of region code to name
            const namesMap = {};
            if (regionData.items && Array.isArray(regionData.items)) {
                for (const item of regionData.items) {
                    namesMap[item.region] = item.name;
                }
            }
            return namesMap;
        } catch (err) {
            console.warn('OriginsHelper: Failed to fetch region names from admixr:', err.message, '- falling back to keys');
            // Fallback: return a map where key maps to itself
            const fallbackMap = {};
            keys.forEach(key => fallbackMap[key] = key);
            return fallbackMap;
        }
    }

    // Origins Table Functions (for individual ethnicity pages only)  
    function groupRegionsByMacro(regions) {
        const macroGroups = {};
        for (const region of regions) {
            if (!macroGroups[region.macroRegionKey]) macroGroups[region.macroRegionKey] = [];
            macroGroups[region.macroRegionKey].push(region);
        }
        return macroGroups;
    }

    function calculateMacroTotals(macroGroups) {
        return Object.keys(macroGroups)
            .map(macroKey => {
                const regions = macroGroups[macroKey];
                const macroTotal = regions.reduce((sum, r) => sum + (r.percentage || 0), 0);
                return { macroKey, regions, macroTotal };
            })
            .sort((a, b) => b.macroTotal - a.macroTotal);
    }

    function formatMacroRegionName(name) {
        return name
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    function sortRegions(regions) {
        return [...regions].sort((a, b) => {
            if (b.percentage !== a.percentage) return b.percentage - a.percentage;
            return b.lowerConfidence - a.lowerConfidence;
        });
    }

    async function generateSummaryTable() {
        try {
            const testId = extractTestId();
            
            // Fetch original ethnicity data
            const data = await fetchEthnicityData(testId);
            const regions = Array.isArray(data.regions) ? data.regions : [];
            const regionKeys = Array.from(new Set(regions.map(r => r.key)));
            const macroRegionKeys = Array.from(new Set(regions.map(r => r.macroRegionKey)));
            const allKeys = [...regionKeys, ...macroRegionKeys];
            
            const namesMap = await fetchRegionNames(allKeys);
            const macroGroups = groupRegionsByMacro(regions);
            const macroTotals = calculateMacroTotals(macroGroups);
            
            // Fetch branches data
            const branchesUrl = `${BASE_ORIGIN}/dna/origins/secure/tests/${testId}/branches`;
            const branchesResponse = await fetch(branchesUrl, { credentials: 'include' });
            if (!branchesResponse.ok) throw new Error(`Branches API HTTP ${branchesResponse.status}: ${branchesResponse.statusText}`);
            const branchesData = await branchesResponse.json();
            
            // Fetch journey names
            let journeyNamesMap = {};
            try {
                const namesData = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: JOURNEY_NAMES_URL,
                        onload: (response) => {
                            if (response.status === 200) {
                                try {
                                    resolve(JSON.parse(response.responseText));
                                } catch (e) {
                                    reject(new Error('Invalid JSON response'));
                                }
                            } else {
                                reject(new Error(`HTTP ${response.status}`));
                            }
                        },
                        onerror: () => reject(new Error('Network error'))
                    });
                });
                
                // Create a map of ID to name
                for (const [key, value] of Object.entries(namesData)) {
                    journeyNamesMap[key] = value.name;
                    if (value.subjourneys) {
                        for (const [subKey, subName] of Object.entries(value.subjourneys)) {
                            journeyNamesMap[subKey] = subName;
                        }
                    }
                }
            } catch (err) {
                console.warn('OriginsHelper: Failed to fetch journey names:', err.message, '- using IDs instead');
            }
            
            // Fetch region names from admixr
            let regionNamesMap = {};
            try {
                const regionData = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: REGION_NAMES_URL,
                        onload: (response) => {
                            if (response.status === 200) {
                                try {
                                    resolve(JSON.parse(response.responseText));
                                } catch (e) {
                                    reject(new Error('Invalid JSON response'));
                                }
                            } else {
                                reject(new Error(`HTTP ${response.status}`));
                            }
                        },
                        onerror: () => reject(new Error('Network error'))
                    });
                });
                
                // Create a map of region code to name
                if (regionData.items && Array.isArray(regionData.items)) {
                    for (const item of regionData.items) {
                        regionNamesMap[item.region] = item.name;
                    }
                }
            } catch (err) {
                console.warn('OriginsHelper: Failed to fetch region names:', err.message, '- using codes instead');
            }
            
            // Build original table HTML
            let html = `<h3 style="margin-top:0; margin-bottom:10px;">Regions</h3>
                <table style=\"border-collapse:collapse; font-size:13px; background:#fff; margin-top:6px; width:auto;\">
                <thead><tr>
                    <th style=\"border:1px solid #ccc; padding:3px 8px;\">Macro-Region</th>
                    <th style=\"border:1px solid #ccc; padding:3px 8px;\">Total %</th>
                    <th style=\"border:1px solid #ccc; padding:3px 8px;\">Region</th>
                    <th style=\"border:1px solid #ccc; padding:3px 8px;\">%<\/th>
                    <th style=\"border:1px solid #ccc; padding:3px 8px;\"><a href=\"${CONFIDENCE_RANGE_HELP_URL}\" target=\"_blank\" style=\"color:#1a0dab; text-decoration:none; display:inline;\" title=\"About confidence ranges\">${ICONS.info}<\/a> Range<\/th>
                <\/tr><\/thead><tbody>`;
                
            for (const { macroKey, regions: macroRegions, macroTotal } of macroTotals) {
                const macroName = namesMap[macroKey] || formatMacroRegionName(macroKey);
                const sortedRegions = sortRegions(macroRegions);
                
                let firstRow = true;
                for (const region of sortedRegions) {
                    const regionName = namesMap[region.key] || region.key;
                    const regionUrl = `${REGION_DETAILS_BASE_URL}/${testId}/regions/${region.key}`;
                    
                    html += '<tr>';
                    if (firstRow) {
                        html += `<td style="border:1px solid #ccc; padding:3px 8px; font-weight:bold; background:#f7f7e6;" rowspan="${macroRegions.length}">${macroName}</td>`;
                        html += `<td style="border:1px solid #ccc; padding:3px 8px; font-weight:bold; background:#f7f7e6; text-align:right;" rowspan="${macroRegions.length}">${Math.round(macroTotal)}%</td>`;
                        firstRow = false;
                    }
                    html += `<td style="border:1px solid #ccc; padding:3px 8px;"><a href="${regionUrl}" target="_blank" style="color:#1a0dab;"><strong>${regionName}</strong></a></td>`;
                    html += `<td style="border:1px solid #ccc; padding:3px 8px; text-align:right;">${Math.round(region.percentage)}%</td>`;
                    html += `<td style="border:1px solid #ccc; padding:3px 8px; text-align:right;">${Math.round(region.lowerConfidence)}–${Math.round(region.upperConfidence)}%</td>`;
                    html += '</tr>';
                }
            }
            html += '</tbody></table>';
            
            // Add branches table
            html += `<h3 style="margin-top:20px; margin-bottom:15px; color:#1f2937; font-size:18px; font-weight:600;">Journeys</h3>
                <table style="border-collapse:collapse; font-size:14px; background:#fff; margin-top:6px; width:100%; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                <thead><tr>
                    <th style="background:#2563eb; color:#fff; padding:10px 12px; font-weight:600; text-align:left; border-bottom:2px solid #1e40af;">Journey</th>
                    <th style="background:#2563eb; color:#fff; padding:10px 12px; font-weight:600; text-align:left; border-bottom:2px solid #1e40af;">Connection</th>
                    <th style="background:#2563eb; color:#fff; padding:10px 12px; font-weight:600; text-align:right; border-bottom:2px solid #1e40af;">Percentage</th>
                </tr></thead><tbody>`;
                
            for (const branch of branchesData) {
                // Main branch
                const branchName = journeyNamesMap[branch.id] || branch.id;
                const connectionColor = branch.connection === 'VERY_LIKELY' ? '#16a34a' : branch.connection === 'LIKELY' ? '#2563eb' : '#ea580c';
                html += '<tr>';
                html += `<td style="padding:10px 12px; font-weight:600; background:#f0f9ff; border-bottom:1px solid #e5e7eb; color:#1f2937;">${branchName}</td>`;
                html += `<td style="padding:10px 12px; background:#f0f9ff; border-bottom:1px solid #e5e7eb;"><span style="display:inline-block; padding:2px 8px; background:${connectionColor}; color:#fff; border-radius:12px; font-size:12px; font-weight:500;">${branch.connection.replace('_', ' ')}</span></td>`;
                html += `<td style="padding:10px 12px; background:#f0f9ff; border-bottom:1px solid #e5e7eb; text-align:right; font-weight:600; color:#1f2937;">${branch.connectionPercent}%</td>`;
                html += '</tr>';
                
                // Communities
                if (branch.communities && branch.communities.length > 0) {
                    for (const community of branch.communities) {
                        const communityName = journeyNamesMap[community.id] || community.id;
                        const communityConnectionColor = community.connection === 'VERY_LIKELY' ? '#16a34a' : community.connection === 'LIKELY' ? '#2563eb' : '#ea580c';
                        html += '<tr>';
                        html += `<td style="padding:8px 12px 8px 36px; background:#fafafa; border-bottom:1px solid #e5e7eb; color:#4b5563; font-style:italic;">└ ${communityName}</td>`;
                        html += `<td style="padding:8px 12px; background:#fafafa; border-bottom:1px solid #e5e7eb;"><span style="display:inline-block; padding:1px 6px; background:${communityConnectionColor}; color:#fff; border-radius:10px; font-size:11px; font-weight:500;">${community.connection.replace('_', ' ')}</span></td>`;
                        html += `<td style="padding:8px 12px; background:#fafafa; border-bottom:1px solid #e5e7eb; text-align:right; font-weight:500; color:#4b5563;">${community.connectionPercent}%</td>`;
                        html += '</tr>';
                    }
                }
            }
            html += '</tbody></table>';
            
            return html;
        } catch (err) {
            return `<strong>OriginsHelper:</strong> Error: ${err.message}`;
        }
    }

    // Screenshot Functions
    function createScreenshotButton(onClick) {
        const btn = document.createElement('button');
        btn.innerHTML = ICONS.camera + 'Take Screenshot';
        btn.title = 'Take Screenshot';
        btn.style.cssText = 'padding:7px 16px; font-size:15px; font-weight:600; background:#22c55e; color:#fff; border:1.5px solid #15803d; border-radius:6px; cursor:pointer; display:flex; align-items:center; transition:background 0.15s;';
        btn.onmouseover = () => { btn.style.background = '#16a34a'; };
        btn.onmouseout = () => { btn.style.background = '#22c55e'; };
        btn.addEventListener('click', onClick);
        return btn;
    }

    async function loadHtml2Canvas() {
        if (!window.html2canvas) {
            console.log('OriginsHelper: Loading html2canvas...');
            try {
                const scriptContent = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: HTML2CANVAS_CDN,
                        onload: (response) => {
                            if (response.status === 200) {
                                resolve(response.responseText);
                            } else {
                                reject(new Error(`HTTP ${response.status}`));
                            }
                        },
                        onerror: (error) => reject(error)
                    });
                });

                // Execute the script in the page context
                // Try eval first, then fallback to script injection
                try {
                    // eslint-disable-next-line no-eval
                    eval(scriptContent);
                } catch (evalErr) {
                    console.warn('OriginsHelper: eval failed, trying script injection:', evalErr);
                    const script = document.createElement('script');
                    script.textContent = scriptContent;
                    document.head.appendChild(script);
                }

                // Wait a bit for the script to initialize
                await new Promise(resolve => setTimeout(resolve, 200));

                if (!window.html2canvas) {
                    throw new Error('html2canvas not available after loading');
                }

                console.log('OriginsHelper: html2canvas loaded successfully');
            } catch (err) {
                console.error('OriginsHelper: Failed to load html2canvas:', err);
                throw err;
            }
        }
    }

    async function takeScreenshot(targetEl) {
        try {
            console.log('OriginsHelper: Starting screenshot process...');
            await loadHtml2Canvas();
            console.log('OriginsHelper: html2canvas loaded, capturing...');
            
            return new Promise((resolve, reject) => {
                window.html2canvas(targetEl, { 
                    backgroundColor: '#fff',
                    useCORS: true,
                    allowTaint: true
                }).then(canvas => {
                    console.log('OriginsHelper: Canvas created, opening window...');
                    const dataUrl = canvas.toDataURL('image/png');
                    const win = window.open('', '_blank');
                    if (win) {
                        win.document.write('<title>Screenshot - OriginsHelper</title><img src="' + dataUrl + '" style="max-width:100%; height:auto;">');
                        win.document.close();
                        resolve();
                    } else {
                        console.error('OriginsHelper: Failed to open screenshot window - popup blocked?');
                        alert('Screenshot captured but popup was blocked. Please allow popups for this site.');
                        reject(new Error('Popup blocked'));
                    }
                }).catch(err => {
                    console.error('OriginsHelper: html2canvas error:', err);
                    alert('Screenshot failed: ' + err.message);
                    reject(err);
                });
            });
        } catch (err) {
            console.error('OriginsHelper: Screenshot setup error:', err);
            alert('Screenshot setup failed: ' + err.message);
            throw err;
        }
    }



    // Origins Table Toggle (for individual ethnicity pages)
    class OriginsHelper {
        constructor() {
            this.showingTable = false;
            this.tableDiv = null;
            this.screenshotBtn = null;
            this.macroHTML = '';
        }

        async init() {
            try {
                const macroEl = await waitForElement('ul.macroRegions');
                this.macroHTML = macroEl.outerHTML;
                this.createUI(macroEl);
            } catch (err) {
                console.error('OriginsHelper: Failed to initialize', err);
            }
        }

        createUI(macroEl) {
            const toggleWrapper = document.createElement('div');
            toggleWrapper.style.cssText = 'margin-bottom:14px; display:flex; align-items:center; gap:18px;';
            
            const toggleBtn = document.createElement('button');
            toggleBtn.innerHTML = ICONS.table + '<span style="margin-left:7px;">View Grouped Table</span>';
            toggleBtn.style.cssText = 'padding:7px 18px; font-size:17px; font-weight:600; color:#fff; background:#2563eb; border:1.5px solid #1e40af; border-radius:7px; cursor:pointer; display:flex; align-items:center;';
            toggleBtn.onmouseover = () => { toggleBtn.style.background = '#1d4ed8'; };
            toggleBtn.onmouseout = () => { toggleBtn.style.background = this.showingTable ? '#dc2626' : '#2563eb'; };
            
            toggleWrapper.appendChild(toggleBtn);
            macroEl.parentNode.insertBefore(toggleWrapper, macroEl);
            
            toggleBtn.addEventListener('click', () => this.handleToggle(toggleBtn, toggleWrapper));
            this.toggleWrapper = toggleWrapper;
        }

        async handleToggle(toggleBtn, toggleWrapper) {
            if (!this.showingTable) {
                await this.showTable(toggleBtn, toggleWrapper);
            } else {
                this.hideTable(toggleBtn, toggleWrapper);
            }
        }

        async showTable(toggleBtn, toggleWrapper) {
            const currentMacro = document.querySelector('ul.macroRegions');
            if (!currentMacro) return;
            
            this.tableDiv = document.createElement('div');
            this.tableDiv.innerHTML = 'Loading...';
            currentMacro.parentNode.replaceChild(this.tableDiv, currentMacro);
            
            const html = await generateSummaryTable();
            this.tableDiv.innerHTML = html;
            
            this.showingTable = true;
            toggleBtn.innerHTML = ICONS.eyeOff + '<span style="margin-left:7px;">Back to Default View</span>';
            toggleBtn.style.background = '#dc2626';
            
            if (!this.screenshotBtn) {
                this.screenshotBtn = createScreenshotButton(() => {
                    takeScreenshot(this.tableDiv);
                });
                toggleWrapper.appendChild(this.screenshotBtn);
            }
        }

        hideTable(toggleBtn, toggleWrapper) {
            const macroList = document.createElement('div');
            macroList.innerHTML = this.macroHTML;
            const newMacro = macroList.firstElementChild;
            this.tableDiv.parentNode.replaceChild(newMacro, this.tableDiv);
            
            this.showingTable = false;
            toggleBtn.innerHTML = ICONS.table + '<span style="margin-left:7px;">View Grouped Table</span>';
            toggleBtn.style.background = '#2563eb';
            
            if (this.screenshotBtn) {
                toggleWrapper.removeChild(this.screenshotBtn);
                this.screenshotBtn = null;
            }
        }
    }


    // Initialize immediately for origins pages
    if (!window.location.pathname.includes('/discoveryui-matches/compare/')) {
        const app = new OriginsHelper();
        app.init();
    }
    
    // SMART APPROACH: Trigger on base compare URL, wait for ethnicity tab
    if (window.location.pathname.includes('/discoveryui-matches/compare/') && window.location.pathname.includes('/with/')) {
        console.log('✨ OriginsHelper: Compare page detected - waiting for ethnicity tab');
        
        let attemptCount = 0;
        const maxAttempts = 60; // Try for 1 minute
        
        function waitForEthnicityAndInsert() {
            attemptCount++;
            console.log(`⏳ Attempt ${attemptCount}: Checking for ethnicity tab...`);
            
            // Check if buttons already exist
            if (document.querySelector('button[data-origins-helper="ranges"]')) {
                console.log('✅ Buttons already exist, stopping');
                return true;
            }
            
            // Look for ethnicity tab link or ethnicity content
            const ethnicityLinks = document.querySelectorAll('a[href*="/ethnicity"]');
            const ethnicityContent = document.querySelector('[role="grid"], .compare-data, [role="row"]');
            const percentageElements = document.querySelectorAll('*');
            let hasEthnicityData = false;
            
            // Check if we have percentage data that looks like ethnicity
            for (const el of percentageElements) {
                const text = el.textContent || '';
                if (text.includes('%') && (text.includes('Iberian') || text.includes('Germanic') || text.includes('Celtic') || text.includes('Scandinavian') || text.includes('European'))) {
                    hasEthnicityData = true;
                    break;
                }
            }
            
            if (ethnicityLinks.length > 0) {
                console.log('📍 Found ethnicity tab link, clicking it...');
                ethnicityLinks[0].click();
                
                // Wait a moment for content to load, then try to insert
                setTimeout(() => {
                    const target = document.querySelector('[role="grid"], .compare-data') || document.body.firstElementChild;
                    if (target) {
                        console.log('🚀 Inserting buttons after clicking ethnicity tab');
                        insertComparePageButtons(target);
                    }
                }, 1500);
                return true;
            } else if (hasEthnicityData || ethnicityContent) {
                console.log('📊 Found ethnicity data, inserting buttons');
                const target = ethnicityContent || document.body.firstElementChild;
                insertComparePageButtons(target);
                return true;
            }
            
            console.log(`⏳ No ethnicity content yet (attempt ${attemptCount}/${maxAttempts})`);
            return false;
        }
        
        // Start checking immediately
        setTimeout(() => {
            console.log('✨ Starting ethnicity detection...');
            
            const interval = setInterval(() => {
                if (waitForEthnicityAndInsert() || attemptCount >= maxAttempts) {
                    clearInterval(interval);
                    if (attemptCount >= maxAttempts) {
                        console.log('❌ Gave up waiting for ethnicity content');
                    }
                }
            }, 2000); // Check every 2 seconds
            
        }, 1000); // Wait 1 second for initial page load
        
        // ALSO: Watch for URL changes (when switching between tabs)
        let lastUrl = window.location.href;
        const urlWatcher = setInterval(() => {
            if (window.location.href !== lastUrl) {
                lastUrl = window.location.href;
                console.log('🔄 URL changed, checking for ethnicity content again...');
                
                // Reset attempt count and check again
                setTimeout(() => {
                    if (window.location.href.includes('/ethnicity')) {
                        console.log('🎯 Now on ethnicity tab, inserting buttons...');
                        attemptCount = 0; // Reset counter
                        waitForEthnicityAndInsert();
                    }
                }, 500);
            }
        }, 1000);
        
        // ALSO: Watch for content changes (mutation observer)
        const contentObserver = new MutationObserver(() => {
            // Only check if we're on ethnicity tab and don't have buttons yet
            if (window.location.href.includes('/ethnicity') && !document.querySelector('button[data-origins-helper="ranges"]')) {
                console.log('🔄 Content changed on ethnicity tab, checking for insertion...');
                setTimeout(() => {
                    waitForEthnicityAndInsert();
                }, 1000);
            }
        });
        
        contentObserver.observe(document.body, { 
            childList: true, 
            subtree: true 
        });
    }

})();