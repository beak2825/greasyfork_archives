// ==UserScript==
// @name         CharacterHub Pagination Fix
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Fixes broken pagination on CharacterHub character search
// @author       You
// @match        https://www.characterhub.org/characters*
// @match        https://chub.ai/characters*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559161/CharacterHub%20Pagination%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/559161/CharacterHub%20Pagination%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const RESULTS_PER_PAGE = 30;
    let totalCount = null;

    // Intercept fetch to get total count
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        let url = args[0];
        
        // If it's a search request, modify it to get count
        if (typeof url === 'string' && url.includes('gateway.chub.ai/search')) {
            url = url.replace('count=false', 'count=true');
            args[0] = url;
        }
        
        const response = await originalFetch.apply(this, args);
        
        // Clone response to read it without consuming it
        const clonedResponse = response.clone();
        
        // Try to extract total count from search responses
        if (typeof args[0] === 'string' && args[0].includes('gateway.chub.ai/search')) {
            try {
                const data = await clonedResponse.json();
                if (data?.data?.count !== undefined) {
                    // If this is just the page count, we need to calculate total differently
                    // For now, store it
                    console.log('Search response count:', data.data.count);
                }
            } catch (e) {
                // Ignore parsing errors
            }
        }
        
        return response;
    };

    // Get URL parameters
    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            search: params.get('search') || '',
            first: RESULTS_PER_PAGE,
            topics: params.get('topics') || '',
            excludetopics: params.get('excludetopics') || '',
            page: parseInt(params.get('page')) || 1,
            sort: params.get('sort') || 'default',
            venus: params.get('venus') || 'false',
            min_tokens: parseInt(params.get('min_tokens')) || 50,
            nsfw: params.get('nsfw') || 'true',
            nsfl: params.get('nsfl') || 'true'
        };
    }

    // Navigate to page
    function goToPage(pageNum) {
        const url = new URL(window.location);
        url.searchParams.set('page', pageNum);
        window.location.href = url.toString();
    }

    // Calculate total count by probing the API
    async function getTotalCount() {
        const params = getUrlParams();
        
        // Try with count=true first
        const url = new URL('https://gateway.chub.ai/search');
        Object.keys(params).forEach(key => {
            url.searchParams.set(key, params[key]);
        });
        url.searchParams.set('count', 'true');
        url.searchParams.set('first', '1'); // Just need 1 result to get the count
        
        try {
            const response = await fetch(url.toString());
            const data = await response.json();
            
            // Check various possible fields for total count
            if (data?.total) return data.total;
            if (data?.data?.total) return data.data.total;
            if (data?.data?.totalCount) return data.data.totalCount;
            
            // If no total field, we need to estimate by finding the last page
            // Try fetching a very high page number to see if it fails
            return await estimateTotalByProbing(params);
        } catch (error) {
            console.error('Error getting total count:', error);
            return await estimateTotalByProbing(params);
        }
    }

    // Estimate total by binary search for last page
    async function estimateTotalByProbing(params) {
        // Start by trying page 100, then adjust
        let lowPage = 1;
        let highPage = 1000; // Start with a high estimate
        let lastValidPage = 1;
        
        // Binary search for the last valid page
        while (lowPage <= highPage && highPage - lowPage > 1) {
            const midPage = Math.floor((lowPage + highPage) / 2);
            
            const url = new URL('https://gateway.chub.ai/search');
            Object.keys(params).forEach(key => {
                url.searchParams.set(key, params[key]);
            });
            url.searchParams.set('page', midPage);
            url.searchParams.set('first', RESULTS_PER_PAGE);
            
            try {
                const response = await fetch(url.toString());
                const data = await response.json();
                
                if (data?.data?.nodes && data.data.nodes.length > 0) {
                    lastValidPage = midPage;
                    lowPage = midPage;
                } else {
                    highPage = midPage;
                }
            } catch (error) {
                highPage = midPage;
            }
            
            // Safety limit
            if (highPage - lowPage <= 1) break;
        }
        
        // Return estimated total (last valid page * results per page)
        return lastValidPage * RESULTS_PER_PAGE + RESULTS_PER_PAGE;
    }

    // Create button
    function createButton(text, onClick, isActive = false) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.onclick = onClick;
        
        if (isActive) {
            btn.style.cssText = 'min-width: 32px; height: 32px; padding: 0 8px; margin: 0 4px; cursor: pointer; border: 1px solid #d9d9d9; background: #1890ff; color: white; border-radius: 2px; font-size: 14px; transition: all 0.3s;';
        } else {
            btn.style.cssText = 'min-width: 32px; height: 32px; padding: 0 8px; margin: 0 4px; cursor: pointer; border: 1px solid #d9d9d9; background: white; color: rgba(0,0,0,0.85); border-radius: 2px; font-size: 14px; transition: all 0.3s;';
            btn.onmouseover = () => {
                btn.style.borderColor = '#1890ff';
                btn.style.color = '#1890ff';
            };
            btn.onmouseout = () => {
                btn.style.borderColor = '#d9d9d9';
                btn.style.color = 'rgba(0,0,0,0.85)';
            };
        }
        
        return btn;
    }

    // Create disabled button
    function createDisabledButton(text) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.disabled = true;
        btn.style.cssText = 'min-width: 32px; height: 32px; padding: 0 8px; margin: 0 4px; border: 1px solid #d9d9d9; background: #f5f5f5; color: rgba(0,0,0,0.25); border-radius: 2px; font-size: 14px; cursor: not-allowed;';
        return btn;
    }

    // Create pagination UI
    function createPaginationUI(totalResults, currentPage) {
        const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);
        
        const container = document.createElement('div');
        container.className = 'custom-pagination-container';
        container.style.cssText = 'display: flex; align-items: center; justify-content: center; gap: 8px; padding: 16px 0; flex-wrap: wrap;';

        // Total text
        const totalText = document.createElement('span');
        totalText.textContent = `${totalResults.toLocaleString()} Total Results`;
        totalText.style.cssText = 'margin-right: 16px; color: rgba(0,0,0,0.85); font-size: 14px;';
        container.appendChild(totalText);

        // Previous 5 button
        if (currentPage > 5) {
            container.appendChild(createButton('<<', () => goToPage(Math.max(1, currentPage - 5))));
        } else {
            container.appendChild(createDisabledButton('<<'));
        }

        // Previous button
        if (currentPage > 1) {
            container.appendChild(createButton('<', () => goToPage(currentPage - 1)));
        } else {
            container.appendChild(createDisabledButton('<'));
        }

        // Page numbers
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        // First page
        if (startPage > 1) {
            container.appendChild(createButton('1', () => goToPage(1)));
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.style.cssText = 'padding: 0 8px; color: rgba(0,0,0,0.25);';
                container.appendChild(ellipsis);
            }
        }

        // Page range
        for (let i = startPage; i <= endPage; i++) {
            container.appendChild(createButton(i.toString(), () => goToPage(i), i === currentPage));
        }

        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.style.cssText = 'padding: 0 8px; color: rgba(0,0,0,0.25);';
                container.appendChild(ellipsis);
            }
            container.appendChild(createButton(totalPages.toString(), () => goToPage(totalPages)));
        }

        // Next button
        if (currentPage < totalPages) {
            container.appendChild(createButton('>', () => goToPage(currentPage + 1)));
        } else {
            container.appendChild(createDisabledButton('>'));
        }

        // Next 5 button
        if (currentPage < totalPages - 5) {
            container.appendChild(createButton('>>', () => goToPage(Math.min(totalPages, currentPage + 5))));
        } else {
            container.appendChild(createDisabledButton('>>'));
        }

        // Go to page
        const goToContainer = document.createElement('div');
        goToContainer.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-left: 16px;';
        
        const goToLabel = document.createElement('span');
        goToLabel.textContent = 'Go to';
        goToLabel.style.cssText = 'color: rgba(0,0,0,0.85); font-size: 14px;';
        
        const goToInput = document.createElement('input');
        goToInput.type = 'number';
        goToInput.min = '1';
        goToInput.max = totalPages.toString();
        goToInput.placeholder = 'Page';
        goToInput.style.cssText = 'width: 60px; height: 32px; padding: 4px 11px; border: 1px solid #d9d9d9; border-radius: 2px; font-size: 14px;';
        
        const goBtn = createButton('Go', () => {
            const page = parseInt(goToInput.value);
            if (page >= 1 && page <= totalPages) {
                goToPage(page);
            } else {
                alert(`Please enter a page number between 1 and ${totalPages}`);
            }
        });
        
        goToContainer.appendChild(goToLabel);
        goToContainer.appendChild(goToInput);
        goToContainer.appendChild(goBtn);
        container.appendChild(goToContainer);

        return container;
    }

    // Replace pagination
    async function replacePagination() {
        // Wait for pagination to appear
        let attempts = 0;
        let paginationContainer = null;
        
        while (attempts < 50) {
            paginationContainer = document.querySelector('.ant-pagination');
            if (paginationContainer) break;
            await new Promise(resolve => setTimeout(resolve, 200));
            attempts++;
        }
        
        if (!paginationContainer) {
            console.error('Could not find pagination container');
            return;
        }

        // Show loading
        const loadingDiv = document.createElement('div');
        loadingDiv.textContent = 'Loading pagination...';
        loadingDiv.style.cssText = 'text-align: center; padding: 20px; color: #1890ff;';
        paginationContainer.parentElement.appendChild(loadingDiv);
        paginationContainer.style.display = 'none';

        // Get total count
        const params = getUrlParams();
        const total = await getTotalCount();
        
        // Remove loading
        loadingDiv.remove();
        
        // Create new pagination
        const newPagination = createPaginationUI(total, params.page);
        paginationContainer.parentElement.insertBefore(newPagination, paginationContainer);
        paginationContainer.remove();
    }

    // Initialize
    async function init() {
        // Wait for page load
        if (document.readyState === 'loading') {
            await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
        }
        
        // Wait a bit for React to render
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Replace pagination
        await replacePagination();
    }

    // Run
    init();
})();