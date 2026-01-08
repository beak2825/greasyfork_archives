// ==UserScript==
// @name         SEO Analyser Pro - 1.5
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Comprehensive SEO analysis tool with floating window
// @author       jotsaru0
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561839/SEO%20Analyser%20Pro%20-%2015.user.js
// @updateURL https://update.greasyfork.org/scripts/561839/SEO%20Analyser%20Pro%20-%2015.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Toggle with Ctrl+M
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'm') {
            e.preventDefault();
            toggleWindow();
        }
    });

    let isVisible = false;
    let floatingWindow = null;
    let selectedFilters = {
        headers: [],
        images: [],
        links: []
    };

    function toggleWindow() {
        if (!floatingWindow) {
            createFloatingWindow();
        }
        isVisible = !isVisible;
        floatingWindow.style.display = isVisible ? 'flex' : 'none';
        if (isVisible) {
            // Reset filters when opening
            selectedFilters = {
                headers: [],
                images: [],
                links: []
            };
            analyzePageSEO();
        }
    }

    function createFloatingWindow() {
        floatingWindow = document.createElement('div');
        floatingWindow.id = 'seo-analyzer-window';
        floatingWindow.innerHTML = `
            <div class="seo-header">
                <h2>SEO Analyzer</h2>
                <button class="close-btn" id="close-seo">×</button>
            </div>
            <div class="seo-tabs">
                <button class="tab-btn active" data-tab="meta">Meta</button>
                <button class="tab-btn" data-tab="headers">Headers</button>
                <button class="tab-btn" data-tab="images">Images</button>
                <button class="tab-btn" data-tab="links">Links</button>
                <button class="tab-btn" data-tab="schema">Schema</button>
            </div>
            <div class="seo-content">
                <div class="tab-content active" id="tab-meta"></div>
                <div class="tab-content" id="tab-headers"></div>
                <div class="tab-content" id="tab-images"></div>
                <div class="tab-content" id="tab-links"></div>
                <div class="tab-content" id="tab-schema"></div>
            </div>
        `;

        document.body.appendChild(floatingWindow);
        addStyles();
        attachEventListeners();
    }

    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #seo-analyzer-window {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 800px;
                max-height: 80vh;
                background: #ffffff;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                z-index: 999999;
                display: none;
                flex-direction: column;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            }

            .seo-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 24px;
                border-bottom: 1px solid #e5e7eb;
            }

            .seo-header h2 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: #111827;
            }

            .close-btn {
                background: none;
                border: none;
                font-size: 28px;
                color: #6b7280;
                cursor: pointer;
                padding: 0;
                width: 32px;
                height: 32px;
                border-radius: 6px;
                transition: all 0.2s;
            }

            .close-btn:hover {
                background: #f3f4f6;
                color: #111827;
            }

            .seo-tabs {
                display: flex;
                padding: 0 24px;
                border-bottom: 1px solid #e5e7eb;
                gap: 8px;
            }

            .tab-btn {
                background: none;
                border: none;
                padding: 12px 16px;
                font-size: 14px;
                font-weight: 500;
                color: #6b7280;
                cursor: pointer;
                border-bottom: 2px solid transparent;
                transition: all 0.2s;
            }

            .tab-btn:hover {
                color: #111827;
            }

            .tab-btn.active {
                color: #2563eb;
                border-bottom-color: #2563eb;
            }

            .seo-content {
                overflow-y: auto;
                padding: 24px;
                max-height: calc(80vh - 140px);
            }

            .tab-content {
                display: none;
            }

            .tab-content.active {
                display: block;
            }

            .seo-section {
                margin-bottom: 24px;
            }

            .seo-section h3 {
                font-size: 14px;
                font-weight: 600;
                color: #111827;
                margin: 0 0 12px 0;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .seo-field {
                margin-bottom: 16px;
                padding: 12px;
                background: #f9fafb;
                border-radius: 6px;
                border-left: 3px solid #e5e7eb;
            }

            .seo-field.warning {
                border-left-color: #f59e0b;
                background: #fffbeb;
            }

            .seo-field.error {
                border-left-color: #ef4444;
                background: #fef2f2;
            }

            .seo-field.success {
                border-left-color: #10b981;
                background: #f0fdf4;
            }

            .seo-label {
                font-size: 12px;
                font-weight: 600;
                color: #6b7280;
                margin-bottom: 4px;
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }

            .seo-value {
                font-size: 14px;
                color: #111827;
                word-wrap: break-word;
            }

            .seo-value code {
                background: #f3f4f6;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 13px;
                font-family: 'Courier New', monospace;
            }

            .serp-preview {
                background: #ffffff;
                border: 1px solid #e5e7eb;
                border-radius: 6px;
                padding: 16px;
                margin-top: 8px;
            }

            .serp-url {
                color: #1a0dab;
                font-size: 14px;
                margin-bottom: 4px;
            }

            .serp-title {
                color: #1a0dab;
                font-size: 18px;
                font-weight: 400;
                margin-bottom: 4px;
                line-height: 1.3;
            }

            .serp-description {
                color: #545454;
                font-size: 13px;
                line-height: 1.4;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                background: #ffffff;
                border-radius: 6px;
                overflow: hidden;
                margin-top: 8px;
            }

            th, td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid #e5e7eb;
                font-size: 13px;
            }

            th {
                background: #f9fafb;
                font-weight: 600;
                color: #111827;
                text-transform: uppercase;
                font-size: 11px;
                letter-spacing: 0.5px;
            }

            td {
                color: #374151;
            }

            tr:last-child td {
                border-bottom: none;
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 12px;
                margin-top: 8px;
            }

            .stat-card {
                background: #f9fafb;
                padding: 16px;
                border-radius: 6px;
                text-align: center;
                cursor: pointer;
                transition: all 0.2s;
                border: 2px solid transparent;
            }

            .stat-card:hover {
                background: #f3f4f6;
                transform: translateY(-2px);
            }

            .stat-card.selected {
                background: #eff6ff;
                border-color: #2563eb;
                box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
            }

            .stat-number {
                font-size: 24px;
                font-weight: 700;
                color: #111827;
                margin-bottom: 4px;
            }

            .stat-label {
                font-size: 12px;
                color: #6b7280;
                font-weight: 500;
            }

            .link-list {
                max-height: 300px;
                overflow-y: auto;
                margin-top: 8px;
            }

            .link-item {
                padding: 8px 12px;
                background: #f9fafb;
                border-radius: 4px;
                margin-bottom: 6px;
                font-size: 13px;
                word-break: break-all;
            }

            .link-item.broken {
                background: #fef2f2;
                color: #ef4444;
            }

            .hierarchy-item {
                margin-bottom: 8px;
                padding: 8px 12px;
                background: #f9fafb;
                border-radius: 4px;
            }

            .hierarchy-level {
                display: inline-block;
                width: 40px;
                font-weight: 600;
                color: #2563eb;
            }

            .schema-block {
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 6px;
                padding: 16px;
                margin-bottom: 12px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .schema-block:hover {
                background: #f3f4f6;
                border-color: #d1d5db;
            }

            .schema-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .schema-type {
                font-weight: 600;
                color: #2563eb;
                font-size: 14px;
                padding: 4px 8px;
                background: #eff6ff;
                border-radius: 4px;
                display: inline-block;
            }

            .schema-toggle {
                color: #6b7280;
                font-size: 20px;
                transition: transform 0.2s;
            }

            .schema-toggle.expanded {
                transform: rotate(180deg);
            }

            .schema-code {
                background: #1f2937;
                color: #f3f4f6;
                padding: 12px;
                border-radius: 4px;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                overflow-x: auto;
                white-space: pre-wrap;
                word-wrap: break-word;
                margin-top: 12px;
                display: none;
            }

            .schema-code.visible {
                display: block;
            }

            .schema-list {
                background: #f9fafb;
                border-radius: 6px;
                padding: 16px;
            }

            .schema-list-item {
                padding: 8px 12px;
                background: #ffffff;
                border-left: 3px solid #2563eb;
                border-radius: 4px;
                margin-bottom: 8px;
                font-size: 14px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .schema-list-type {
                font-weight: 600;
                color: #111827;
            }

            .schema-list-format {
                font-size: 12px;
                color: #6b7280;
                background: #f3f4f6;
                padding: 2px 8px;
                border-radius: 3px;
            }

            .no-schema {
                text-align: center;
                padding: 40px;
                color: #6b7280;
            }

            .selection-counter {
                background: #2563eb;
                color: white;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                display: inline-block;
                margin-bottom: 16px;
            }

            .selection-counter.hidden {
                display: none;
            }

            .filterable-section {
                transition: all 0.3s;
            }

            .filterable-section.hidden {
                display: none;
            }

            .header-row {
                cursor: pointer;
                transition: all 0.2s;
            }

            .header-row:hover {
                background: #f3f4f6;
            }

            .header-row.selected {
                background: #eff6ff;
                font-weight: 600;
            }

            .link-item {
                padding: 8px 12px;
                background: #f9fafb;
                border-radius: 4px;
                margin-bottom: 6px;
                font-size: 13px;
                word-break: break-all;
                transition: all 0.3s;
            }

            .link-item.hidden {
                display: none;
            }

            .clickable-link {
                color: #374151;
                text-decoration: none;
                transition: all 0.2s;
            }

            .clickable-link:hover {
                text-decoration: underline;
                font-weight: 700;
                color: #2563eb;
            }
        `;
        document.head.appendChild(style);
    }

    function attachEventListeners() {
        document.getElementById('close-seo').addEventListener('click', toggleWindow);

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                document.getElementById(`tab-${tab}`).classList.add('active');
            });
        });
    }

    function getMetaTag(name) {
        const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
        return meta ? meta.getAttribute('content') : 'Not found';
    }

    function analyzePageSEO() {
        analyzeMetaTab();
        analyzeHeadersTab();
        analyzeImagesTab();
        analyzeLinksTab();
        analyzeSchemaTab();
    }

    function analyzeMetaTab() {
        const title = document.title || 'No title';
        const description = getMetaTag('description');
        const canonical = document.querySelector('link[rel="canonical"]')?.href || 'Not found';
        const robots = getMetaTag('robots');
        const viewport = getMetaTag('viewport');
        const wordCount = document.body.innerText.split(/\s+/).length;

        const ogTitle = getMetaTag('og:title');
        const ogDescription = getMetaTag('og:description');
        const ogImage = getMetaTag('og:image');

        const twitterCard = getMetaTag('twitter:card');
        const twitterTitle = getMetaTag('twitter:title');
        const twitterDescription = getMetaTag('twitter:description');
        const twitterImage = getMetaTag('twitter:image');
        const twitterSite = getMetaTag('twitter:site');
        const twitterCreator = getMetaTag('twitter:creator');
        const twitterUrl = getMetaTag('twitter:url');
        const twitterDomain = getMetaTag('twitter:domain');

        const url = window.location.href;
        const displayUrl = new URL(url).hostname + new URL(url).pathname;

        document.getElementById('tab-meta').innerHTML = `
            <div class="seo-section">
                <div class="seo-field ${title.length > 60 ? 'warning' : 'success'}">
                    <div class="seo-label">Meta Title (${title.length} chars)</div>
                    <div class="seo-value">${title}</div>
                </div>

                <div class="seo-field ${description === 'Not found' ? 'error' : description.length > 160 ? 'warning' : 'success'}">
                    <div class="seo-label">Meta Description (${description.length} chars)</div>
                    <div class="seo-value">${description}</div>
                </div>

                <div class="seo-field">
                    <div class="seo-label">SERP Preview</div>
                    <div class="serp-preview">
                        <div class="serp-url">${displayUrl}</div>
                        <div class="serp-title">${title.substring(0, 60)}${title.length > 60 ? '...' : ''}</div>
                        <div class="serp-description">${description.substring(0, 160)}${description.length > 160 ? '...' : ''}</div>
                    </div>
                </div>

                <div class="seo-field ${canonical === 'Not found' ? 'warning' : 'success'}">
                    <div class="seo-label">Canonical URL</div>
                    <div class="seo-value">${canonical}</div>
                </div>

                <div class="seo-field">
                    <div class="seo-label">Robots</div>
                    <div class="seo-value">${robots}</div>
                </div>

                <div class="seo-field">
                    <div class="seo-label">Viewport</div>
                    <div class="seo-value">${viewport}</div>
                </div>

                <div class="seo-field">
                    <div class="seo-label">Word Count</div>
                    <div class="seo-value">${wordCount} words</div>
                </div>
            </div>

            <div class="seo-section">
                <h3>Open Graph Tags</h3>
                <div class="seo-field">
                    <div class="seo-label">OG:Title</div>
                    <div class="seo-value">${ogTitle}</div>
                </div>
                <div class="seo-field">
                    <div class="seo-label">OG:Description</div>
                    <div class="seo-value">${ogDescription}</div>
                </div>
                <div class="seo-field">
                    <div class="seo-label">OG:Image</div>
                    <div class="seo-value">${ogImage}</div>
                </div>
            </div>

            <div class="seo-section">
                <h3>Twitter Card Tags</h3>
                <div class="seo-field">
                    <div class="seo-label">Twitter:Card</div>
                    <div class="seo-value">${twitterCard}</div>
                </div>
                <div class="seo-field">
                    <div class="seo-label">Twitter:Title</div>
                    <div class="seo-value">${twitterTitle}</div>
                </div>
                <div class="seo-field">
                    <div class="seo-label">Twitter:Description</div>
                    <div class="seo-value">${twitterDescription}</div>
                </div>
                <div class="seo-field">
                    <div class="seo-label">Twitter:Image</div>
                    <div class="seo-value">${twitterImage}</div>
                </div>
                <div class="seo-field">
                    <div class="seo-label">Twitter:Site</div>
                    <div class="seo-value">${twitterSite}</div>
                </div>
                <div class="seo-field">
                    <div class="seo-label">Twitter:Creator</div>
                    <div class="seo-value">${twitterCreator}</div>
                </div>
                <div class="seo-field">
                    <div class="seo-label">Twitter:Url</div>
                    <div class="seo-value">${twitterUrl}</div>
                </div>
                <div class="seo-field">
                    <div class="seo-label">Twitter:Domain</div>
                    <div class="seo-value">${twitterDomain}</div>
                </div>
            </div>
        `;
    }

    function analyzeHeadersTab() {
        const headers = [];
        ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(tag => {
            document.querySelectorAll(tag).forEach(el => {
                headers.push({
                    level: tag.toUpperCase(),
                    text: el.innerText.trim()
                });
            });
        });

        const headerCounts = {
            H1: document.querySelectorAll('h1').length,
            H2: document.querySelectorAll('h2').length,
            H3: document.querySelectorAll('h3').length,
            H4: document.querySelectorAll('h4').length,
            H5: document.querySelectorAll('h5').length,
            H6: document.querySelectorAll('h6').length
        };

        const tableRows = Object.entries(headerCounts)
            .map(([level, count]) => `<tr class="header-row" data-header-level="${level}"><td>${level}</td><td>${count}</td></tr>`)
            .join('');

        const hierarchyHTML = headers
            .map(h => `<div class="hierarchy-item filterable-section" data-header-type="${h.level}"><span class="hierarchy-level">${h.level}</span>${h.text}</div>`)
            .join('');

        document.getElementById('tab-headers').innerHTML = `
            <div class="selection-counter hidden" id="header-counter">0 selected</div>
            <div class="seo-section">
                <h3>Header Count (Click to filter)</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Header Level</th>
                            <th>Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>

            <div class="seo-section">
                <h3>Heading Hierarchy</h3>
                ${hierarchyHTML || '<p>No headers found</p>'}
            </div>
        `;

        // Add click handlers for header filtering
        document.querySelectorAll('.header-row').forEach(row => {
            row.addEventListener('click', function() {
                const level = this.dataset.headerLevel;
                filterHeaders(level, this);
            });
        });
    }

    function filterHeaders(level, row) {
        const index = selectedFilters.headers.indexOf(level);

        if (index > -1) {
            selectedFilters.headers.splice(index, 1);
            row.classList.remove('selected');
        } else {
            if (selectedFilters.headers.length >= 3) {
                return;
            }
            selectedFilters.headers.push(level);
            row.classList.add('selected');
        }

        updateHeaderDisplay();
    }

    function updateHeaderDisplay() {
        const counter = document.getElementById('header-counter');
        const count = selectedFilters.headers.length;

        if (count > 0) {
            counter.textContent = `${count} selected`;
            counter.classList.remove('hidden');
        } else {
            counter.classList.add('hidden');
        }

        document.querySelectorAll('.hierarchy-item').forEach(item => {
            const type = item.dataset.headerType;
            if (count === 0 || selectedFilters.headers.includes(type)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }

    function analyzeImagesTab() {
        const images = Array.from(document.querySelectorAll('img'));
        const withAlt = images.filter(img => img.alt && img.alt.trim() !== '');
        const withoutAlt = images.filter(img => !img.alt || img.alt.trim() === '');

        const imageTypes = {};
        images.forEach(img => {
            const ext = img.src.split('.').pop().split('?')[0].toLowerCase();
            imageTypes[ext] = (imageTypes[ext] || 0) + 1;
        });

        const withAltRows = withAlt.map((img, idx) => {
            const ext = img.src.split('.').pop().split('?')[0].toLowerCase();
            return `<tr class="filterable-section" data-image-type="${ext}" data-alt-status="with"><td>${img.alt}</td><td>${ext}</td><td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><a href="${img.src}" target="_blank" class="clickable-link">${img.src}</a></td></tr>`;
        }).join('');

        const withoutAltRows = withoutAlt.map((img, idx) => {
            const ext = img.src.split('.').pop().split('?')[0].toLowerCase();
            return `<tr class="filterable-section" data-image-type="${ext}" data-alt-status="without"><td>${ext}</td><td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><a href="${img.src}" target="_blank" class="clickable-link">${img.src}</a></td></tr>`;
        }).join('');

        const typeStats = Object.entries(imageTypes)
            .map(([type, count]) => `<div class="stat-card" data-image-filter="${type}"><div class="stat-number">${count}</div><div class="stat-label">${type.toUpperCase()}</div></div>`)
            .join('');

        document.getElementById('tab-images').innerHTML = `
            <div class="selection-counter hidden" id="image-counter">0 selected</div>
            <div class="seo-section">
                <h3>Image Statistics (Click to filter by alt status)</h3>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${images.length}</div>
                        <div class="stat-label">Total Images</div>
                    </div>
                    <div class="stat-card" data-image-filter="with">
                        <div class="stat-number">${withAlt.length}</div>
                        <div class="stat-label">With Alt</div>
                    </div>
                    <div class="stat-card" data-image-filter="without">
                        <div class="stat-number">${withoutAlt.length}</div>
                        <div class="stat-label">Without Alt</div>
                    </div>
                </div>
            </div>

            <div class="seo-section">
                <h3>Image Types (Click to filter by type)</h3>
                <div class="stats-grid">
                    ${typeStats}
                </div>
            </div>

            <div class="seo-section">
                <h3>Images with Alt Tags</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Alt Text</th>
                            <th>Type</th>
                            <th>Source</th>
                        </tr>
                    </thead>
                    <tbody id="with-alt-tbody">
                        ${withAltRows || '<tr><td colspan="3">No images with alt tags</td></tr>'}
                    </tbody>
                </table>
            </div>

            <div class="seo-section">
                <h3>Images without Alt Tags</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Source</th>
                        </tr>
                    </thead>
                    <tbody id="without-alt-tbody">
                        ${withoutAltRows || '<tr><td colspan="2">All images have alt tags!</td></tr>'}
                    </tbody>
                </table>
            </div>
        `;

        // Add click handlers for image filtering
        document.querySelectorAll('[data-image-filter]').forEach(card => {
            card.addEventListener('click', function() {
                const type = this.dataset.imageFilter;
                filterImages(type, this);
            });
        });
    }

    function filterImages(type, card) {
        const index = selectedFilters.images.indexOf(type);

        if (index > -1) {
            selectedFilters.images.splice(index, 1);
            card.classList.remove('selected');
        } else {
            if (selectedFilters.images.length >= 3) {
                return;
            }
            selectedFilters.images.push(type);
            card.classList.add('selected');
        }

        updateImageDisplay();
    }

    function updateImageDisplay() {
        const counter = document.getElementById('image-counter');
        const count = selectedFilters.images.length;

        if (count > 0) {
            counter.textContent = `${count} selected`;
            counter.classList.remove('hidden');
        } else {
            counter.classList.add('hidden');
        }

        document.querySelectorAll('#with-alt-tbody .filterable-section, #without-alt-tbody .filterable-section').forEach(item => {
            const imageType = item.dataset.imageType;
            const altStatus = item.dataset.altStatus;

            let shouldShow = false;

            if (count === 0) {
                shouldShow = true;
            } else {
                // Check if any selected filter matches either the type or alt status
                for (const filter of selectedFilters.images) {
                    if (filter === imageType || filter === altStatus) {
                        shouldShow = true;
                        break;
                    }
                }
            }

            if (shouldShow) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }

    function analyzeLinksTab() {
        const links = Array.from(document.querySelectorAll('a[href]'));
        const currentHost = window.location.hostname;

        const internal = links.filter(a => {
            try {
                const url = new URL(a.href, window.location.href);
                return url.hostname === currentHost;
            } catch {
                return false;
            }
        });

        const external = links.filter(a => {
            try {
                const url = new URL(a.href, window.location.href);
                return url.hostname !== currentHost;
            } catch {
                return false;
            }
        });

        const unique = [...new Set(links.map(a => a.href))];
        const noFollow = links.filter(a => a.rel.includes('nofollow'));
        const noAnchor = links.filter(a => !a.innerText.trim());

        const internalList = internal.map(a => `<div class="link-item filterable-section" data-link-type="internal"><a href="${a.href}" target="_blank" class="clickable-link">${a.href}</a></div>`).join('');
        const externalList = external.map(a => `<div class="link-item filterable-section" data-link-type="external"><a href="${a.href}" target="_blank" class="clickable-link">${a.href}</a></div>`).join('');

        document.getElementById('tab-links').innerHTML = `
            <div class="selection-counter hidden" id="link-counter">0 selected</div>
            <div class="seo-section">
                <h3>Link Statistics (Click to filter)</h3>
                <div class="stats-grid">
                    <div class="stat-card" data-link-filter="all">
                        <div class="stat-number">${links.length}</div>
                        <div class="stat-label">Total Links</div>
                    </div>
                    <div class="stat-card" data-link-filter="internal">
                        <div class="stat-number">${internal.length}</div>
                        <div class="stat-label">Internal Links</div>
                    </div>
                    <div class="stat-card" data-link-filter="external">
                        <div class="stat-number">${external.length}</div>
                        <div class="stat-label">External Links</div>
                    </div>
                    <div class="stat-card" data-link-filter="unique">
                        <div class="stat-number">${unique.length}</div>
                        <div class="stat-label">Unique Links</div>
                    </div>
                    <div class="stat-card" data-link-filter="nofollow">
                        <div class="stat-number">${noFollow.length}</div>
                        <div class="stat-label">NoFollow Links</div>
                    </div>
                    <div class="stat-card" data-link-filter="noanchor">
                        <div class="stat-number">${noAnchor.length}</div>
                        <div class="stat-label">No Anchor Text</div>
                    </div>
                </div>
            </div>

            <div class="seo-section">
                <h3>Internal Links</h3>
                <div class="link-list">
                    ${internalList || '<p>No internal links found</p>'}
                </div>
            </div>

            <div class="seo-section">
                <h3>External Links</h3>
                <div class="link-list">
                    ${externalList || '<p>No external links found</p>'}
                </div>
            </div>
        `;

        // Store link data for filtering
        window.linkData = {
            all: links,
            internal: internal,
            external: external,
            unique: unique.map(href => links.find(a => a.href === href)),
            nofollow: noFollow,
            noanchor: noAnchor
        };

        // Add click handlers for link filtering
        document.querySelectorAll('[data-link-filter]').forEach(card => {
            card.addEventListener('click', function() {
                const type = this.dataset.linkFilter;
                filterLinks(type, this);
            });
        });
    }

    function filterLinks(type, card) {
        const index = selectedFilters.links.indexOf(type);

        if (index > -1) {
            selectedFilters.links.splice(index, 1);
            card.classList.remove('selected');
        } else {
            if (selectedFilters.links.length >= 3) {
                return;
            }
            selectedFilters.links.push(type);
            card.classList.add('selected');
        }

        updateLinkDisplay();
    }

    function updateLinkDisplay() {
        const counter = document.getElementById('link-counter');
        const count = selectedFilters.links.length;

        if (count > 0) {
            counter.textContent = `${count} selected`;
            counter.classList.remove('hidden');
        } else {
            counter.classList.add('hidden');
        }

        if (!window.linkData) return;

        // Get all links that match selected filters
        let filteredLinks = new Set();

        if (count === 0) {
            // Show all links
            document.querySelectorAll('.link-list .filterable-section').forEach(item => {
                item.classList.remove('hidden');
            });
            return;
        }

        // Collect links matching any selected filter
        selectedFilters.links.forEach(filter => {
            if (window.linkData[filter]) {
                window.linkData[filter].forEach(link => {
                    filteredLinks.add(link.href);
                });
            }
        });

        // Show/hide links based on filter
        document.querySelectorAll('.link-list .filterable-section').forEach(item => {
            const link = item.querySelector('a');
            if (link && filteredLinks.has(link.href)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }

    function analyzeSchemaTab() {
        const schemas = [];

        // Find JSON-LD schemas
        const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
        jsonLdScripts.forEach((script, index) => {
            try {
                const data = JSON.parse(script.textContent);
                const type = data['@type'] || (Array.isArray(data) ? data.map(d => d['@type']).join(', ') : 'Unknown');
                schemas.push({
                    type: type,
                    format: 'JSON-LD',
                    content: JSON.stringify(data, null, 2)
                });
            } catch (e) {
                schemas.push({
                    type: 'Invalid JSON-LD',
                    format: 'JSON-LD',
                    content: 'Error parsing JSON-LD schema'
                });
            }
        });

        // Find Microdata schemas
        const microdataItems = document.querySelectorAll('[itemscope]');
        if (microdataItems.length > 0) {
            const microdataTypes = [...new Set(Array.from(microdataItems).map(item => {
                return item.getAttribute('itemtype') || 'No type specified';
            }))];

            microdataTypes.forEach(type => {
                schemas.push({
                    type: type.split('/').pop() || 'Microdata',
                    format: 'Microdata',
                    content: `Found ${Array.from(microdataItems).filter(i => i.getAttribute('itemtype') === type).length} instance(s)`
                });
            });
        }

        // Find RDFa schemas
        const rdfaItems = document.querySelectorAll('[vocab], [typeof]');
        if (rdfaItems.length > 0) {
            const rdfaTypes = [...new Set(Array.from(rdfaItems).map(item => {
                return item.getAttribute('typeof') || 'No type specified';
            }))];

            rdfaTypes.forEach(type => {
                schemas.push({
                    type: type || 'RDFa',
                    format: 'RDFa',
                    content: `Found ${Array.from(rdfaItems).filter(i => i.getAttribute('typeof') === type).length} instance(s)`
                });
            });
        }

        let schemaHTML = '';

        if (schemas.length === 0) {
            schemaHTML = '<div class="no-schema">No schema markup found on this page</div>';
        } else {
            const stats = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${schemas.length}</div>
                        <div class="stat-label">Total Schemas</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${schemas.filter(s => s.format === 'JSON-LD').length}</div>
                        <div class="stat-label">JSON-LD</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${schemas.filter(s => s.format === 'Microdata').length}</div>
                        <div class="stat-label">Microdata</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${schemas.filter(s => s.format === 'RDFa').length}</div>
                        <div class="stat-label">RDFa</div>
                    </div>
                </div>
            `;

            const schemaList = schemas.map((schema, index) => `
                <div class="schema-list-item">
                    <span class="schema-list-type">${schema.type}</span>
                    <span class="schema-list-format">${schema.format}</span>
                </div>
            `).join('');

            const schemaBlocks = schemas.map((schema, index) => `
                <div class="schema-block" data-schema-index="${index}">
                    <div class="schema-header">
                        <div class="schema-type">${schema.format}: ${schema.type}</div>
                        <div class="schema-toggle">▼</div>
                    </div>
                    <div class="schema-code" id="schema-code-${index}">${schema.content}</div>
                </div>
            `).join('');

            schemaHTML = `
                <div class="seo-section">
                    <h3>Schema Statistics</h3>
                    ${stats}
                </div>
                <div class="seo-section">
                    <h3>All Schemas Found</h3>
                    <div class="schema-list">
                        ${schemaList}
                    </div>
                </div>
                <div class="seo-section">
                    <h3>Schema Markup Details</h3>
                    ${schemaBlocks}
                </div>
            `;
        }

        document.getElementById('tab-schema').innerHTML = schemaHTML;

        // Add click handlers for expanding/collapsing schemas
        document.querySelectorAll('.schema-block').forEach(block => {
            block.addEventListener('click', function() {
                const index = this.dataset.schemaIndex;
                const codeBlock = document.getElementById(`schema-code-${index}`);
                const toggle = this.querySelector('.schema-toggle');

                codeBlock.classList.toggle('visible');
                toggle.classList.toggle('expanded');
            });
        });
    }

})();