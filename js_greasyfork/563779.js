// ==UserScript==
// @name         IMDb SeriesGraph Rating Colors
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Applies SeriesGraph rating color codes to IMDb episode heatmaps, histograms, and creates a Season Average section. Adds "Save Image" functionality with auto-transpose for long seasons.
// @author       Windy
// @match        https://www.imdb.com/title/*/ratings*
// @match        https://www.imdb.com/*/title/*/ratings*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imdb.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563779/IMDb%20SeriesGraph%20Rating%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/563779/IMDb%20SeriesGraph%20Rating%20Colors.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const BLEND_CAP = 0.8;
    const DEBOUNCE_TIME = 200; // ms
    const FETCH_DELAY = 1250;   // Time in ms to wait before fetching data
    const SHOW_TOOLTIPS = false; // Set to false to disable tooltips
    const TRANSPOSE_THRESHOLD = 25; // If episodes > this, swap X/Y axis in screenshot

    const COLOR_STOPS = [
        { val: 9.6, rgb: [29, 161, 242],  label: 'Masterpiece',   text: '#ffffff', showInLegend: true },
        { val: 9.0, rgb: [24, 106, 59],   label: 'Amazing',       text: '#ffffff', showInLegend: true },
        { val: 8.0, rgb: [40, 180, 99],   label: 'Great',         text: '#2a2a2a', showInLegend: true },
        { val: 7.0, rgb: [244, 208, 63],  label: 'Good',          text: '#2a2a2a', showInLegend: true },
        { val: 6.0, rgb: [243, 156, 18],  label: 'Average',       text: '#2a2a2a', showInLegend: true },
        { val: 5.0, rgb: [231, 76, 60],   label: 'Bad',           text: '#ffffff', showInLegend: true },
        { val: 4.0, rgb: [99, 57, 116],   label: 'Trash',         text: '#ffffff', showInLegend: false }, // Math Anchor
        { val: 0.0, rgb: [99, 57, 116],   label: 'Trash',         text: '#ffffff', showInLegend: true }
    ];

    const STORAGE_KEY_GRADIENT = 'sg_gradient_mode_enabled';

    let isGradientMode = localStorage.getItem(STORAGE_KEY_GRADIENT) === 'true';

    // Global Cache
    const TITLE_CACHE = new Map();
    const FETCH_PROMISES = new Map();

    // --- UTILS ---
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function rgbToString(rgb) {
        return `rgb(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])})`;
    }

    function blendColors(color1, color2, percentage) {
        const p = percentage;
        const w = 1 - p;
        const r = Math.sqrt((w * (color1[0] ** 2)) + (p * (color2[0] ** 2)));
        const g = Math.sqrt((w * (color1[1] ** 2)) + (p * (color2[1] ** 2)));
        const b = Math.sqrt((w * (color1[2] ** 2)) + (p * (color2[2] ** 2)));
        return [r, g, b];
    }

    function getStyleForRating(rating) {
        if (isGradientMode) {
            if (rating >= COLOR_STOPS[0].val) return { bg: rgbToString(COLOR_STOPS[0].rgb), text: COLOR_STOPS[0].text };
            if (rating <= COLOR_STOPS[COLOR_STOPS.length - 1].val) return { bg: rgbToString(COLOR_STOPS[COLOR_STOPS.length - 1].rgb), text: COLOR_STOPS[COLOR_STOPS.length - 1].text };
            for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
                const upper = COLOR_STOPS[i];
                const lower = COLOR_STOPS[i+1];
                if (rating < upper.val && rating >= lower.val) {
                    const range = upper.val - lower.val;
                    const rawProgress = (range === 0) ? 0 : (rating - lower.val) / range;
                    const weightedProgress = rawProgress * BLEND_CAP;
                    const finalRgb = blendColors(lower.rgb, upper.rgb, weightedProgress);
                    return { bg: rgbToString(finalRgb), text: lower.text };
                }
            }
        } else {
            for (const stop of COLOR_STOPS) {
                if (!stop.showInLegend && stop.val === 4.0) continue;
                if (rating >= stop.val) return { bg: rgbToString(stop.rgb), text: stop.text };
            }
            return { bg: rgbToString(COLOR_STOPS[COLOR_STOPS.length-1].rgb), text: '#ffffff' };
        }
    }

    function formatVoteCount(count) {
        if (!count) return '';
        if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
        if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
        return count;
    }

    // --- TITLE SCRAPER & FETCHER ---
    function scrapeVisibleTitles() {
        const items = document.querySelectorAll('.ipc-metadata-list-summary-item');
        items.forEach(item => {
            const link = item.querySelector('a.ipc-title-link-wrapper') || item.querySelector('a[href^="/title/"]');
            const titleEl = item.querySelector('.ipc-title__text');

            if (link && titleEl) {
                const rawHref = link.getAttribute('href');
                if(!rawHref) return;
                const href = rawHref.split('?')[0].replace(/\/$/, '');
                const text = titleEl.innerText.replace(/^\d+\.\s+/, '');
                TITLE_CACHE.set(href, text);
            }
        });
    }

    async function fetchEpisodeTitle(url) {
        const cleanUrl = url.split('?')[0].replace(/\/$/, '');
        if (TITLE_CACHE.has(cleanUrl)) return TITLE_CACHE.get(cleanUrl);
        if (FETCH_PROMISES.has(cleanUrl)) return FETCH_PROMISES.get(cleanUrl);

        const promise = (async () => {
            try {
                const resp = await fetch(cleanUrl);
                const text = await resp.text();
                // JSON-LD
                const jsonMatch = text.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
                if (jsonMatch && jsonMatch[1]) {
                    try {
                        const data = JSON.parse(jsonMatch[1]);
                        if (data.name) {
                            TITLE_CACHE.set(cleanUrl, data.name);
                            return data.name;
                        }
                    } catch(e) {}
                }
                // OG Meta
                const ogMatch = text.match(/<meta property="og:title" content="(.*?)"/);
                if (ogMatch) {
                    const cleanTitle = ogMatch[1].replace(/\(TV Episode.*$/, '').replace(/ - .*$/, '').trim();
                    TITLE_CACHE.set(cleanUrl, cleanTitle);
                    return cleanTitle;
                }
            } catch (e) { console.error("SG Colors: Failed to fetch title", e); }
            return null;
        })();

        FETCH_PROMISES.set(cleanUrl, promise);
        return promise;
    }

    // --- MAIN SERIES DATA FETCH (For Screenshot) ---
    async function fetchSeriesData() {
        const match = window.location.pathname.match(/\/title\/(tt\d+)/);
        if (!match) return null;
        const ttId = match[1];
        const url = `https://www.imdb.com/title/${ttId}/`;

        try {
            const resp = await fetch(url);
            const text = await resp.text();
            let data = { poster: null, rating: null, votes: null, title: null };

            // 1. Try JSON-LD
            const jsonMatch = text.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
            if (jsonMatch && jsonMatch[1]) {
                try {
                    const json = JSON.parse(jsonMatch[1]);
                    data.title = json.name;
                    data.poster = json.image;
                    if (json.aggregateRating) {
                        data.rating = json.aggregateRating.ratingValue;
                        data.votes = formatVoteCount(json.aggregateRating.ratingCount);
                    }
                } catch(e) {}
            }

            // 2. Fallbacks
            if (!data.poster) {
                const ogImg = text.match(/<meta property="og:image" content="(.*?)"/);
                if (ogImg) data.poster = ogImg[1];
            }
            if (data.poster && data.poster.includes('._V1_')) {
                data.poster = data.poster.replace(/(\._V1_)(.*)(\.jpg|\.png|\.jpeg)$/, '$1$3');
            }

            return data;
        } catch (e) {
            console.error("SG Colors: Fetch series data failed", e);
            return null;
        }
    }

    // --- CUSTOM TOOLTIP ---
    let tooltipEl = null;
    let hoverTimeout = null;

    function initTooltip() {
        if (document.getElementById('sg-custom-tooltip')) return;
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'sg-custom-tooltip';
        document.body.appendChild(tooltipEl);
    }

    function showTooltip(e, season, epNum, rating, href) {
        if (!SHOW_TOOLTIPS) return;
        if (!tooltipEl) initTooltip();
        if (hoverTimeout) clearTimeout(hoverTimeout);

        const cleanHref = href.split('?')[0].replace(/\/$/, '');
        let title = TITLE_CACHE.get(cleanHref);

        let html = `<div class="sg-tt-header">${season} Ep ${epNum} <span class="sg-tt-score">${rating}</span></div>`;

        if (title) {
            html += `<div class="sg-tt-title">${title}</div>`;
        } else {
            html += `<div class="sg-tt-loading">...</div>`;
            hoverTimeout = setTimeout(() => {
                fetchEpisodeTitle(href).then(fetchedTitle => {
                    if (fetchedTitle && tooltipEl.style.display === 'block' && tooltipEl.dataset.activeHref === cleanHref) {
                        const loadingEl = tooltipEl.querySelector('.sg-tt-loading');
                        if (loadingEl) loadingEl.outerHTML = `<div class="sg-tt-title">${fetchedTitle}</div>`;
                    }
                });
            }, FETCH_DELAY);
        }

        tooltipEl.innerHTML = html;
        tooltipEl.dataset.activeHref = cleanHref;
        tooltipEl.style.display = 'block';
        moveTooltip(e);
    }

    function moveTooltip(e) {
        if (!tooltipEl) return;
        const x = e.clientX + 15;
        const y = e.clientY + 15;
        const rect = tooltipEl.getBoundingClientRect();
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const finalX = (x + rect.width > winW) ? e.clientX - rect.width - 10 : x;
        const finalY = (y + rect.height > winH) ? e.clientY - rect.height - 10 : y;
        tooltipEl.style.left = finalX + 'px';
        tooltipEl.style.top = finalY + 'px';
    }

    function hideTooltip() {
        if (hoverTimeout) clearTimeout(hoverTimeout);
        if (tooltipEl) tooltipEl.style.display = 'none';
    }

    // --- SCREENSHOT HELPERS ---
    async function ensureAllSeasonsLoaded() {
        const MAX_CLICKS = 20;
        let clickCount = 0;
        const getBtn = () => document.querySelector('[data-testid="heatmap__load-seasons"]');
        let btn = getBtn();
        while (btn && clickCount < MAX_CLICKS) {
            btn.click();
            clickCount++;
            await new Promise(r => setTimeout(r, 600));
            btn = getBtn();
        }
        if (clickCount > 0) await new Promise(r => setTimeout(r, 500));
    }

    async function ensureAllEpisodesLoaded() {
        const MAX_CLICKS = 30;
        let clickCount = 0;
        const getArrow = () => document.querySelector('.ipc-pager--right.ipc-pager--visible');
        let arrow = getArrow();
        while (arrow && clickCount < MAX_CLICKS) {
            arrow.click();
            clickCount++;
            await new Promise(r => setTimeout(r, 250));
            arrow = getArrow();
        }
        if (clickCount > 0) await new Promise(r => setTimeout(r, 300));
    }

    // Extract table data into a JS object to handle transposition easier
    function getGridData() {
        const sCol = document.querySelector('[data-testid="heatmap__seasons-column"]');
        const eData = document.querySelector('[data-testid="heatmap__episode-data"]');
        if (!sCol || !eData) return null;

        const sRows = Array.from(sCol.querySelectorAll('tr'));
        const eRows = Array.from(eData.querySelectorAll('tr'));
        const rowCount = Math.min(sRows.length, eRows.length);

        let seasons = [];
        let maxEps = 0;

        for (let i = 0; i < rowCount; i++) {
            // FIX: Skip rows that are actually headers (containing <th> instead of ratings)
            if (eRows[i].querySelector('th')) continue;

            const epCells = eRows[i].querySelectorAll('td');
            // If row has no data cells, skip it (spacer/header)
            if (epCells.length === 0) continue;

            let name = sRows[i].innerText.trim();
            if (!name) name = `S${seasons.length + 1}`;

            let episodes = [];
            epCells.forEach((cell, idx) => {
                const a = cell.querySelector('a');
                if (a) {
                    episodes.push({
                        val: parseFloat(a.innerText.replace(',', '.')),
                        text: a.innerText
                    });
                } else {
                    episodes.push(null);
                }
            });

            if (episodes.length > maxEps) maxEps = episodes.length;
            seasons.push({ name, episodes });
        }

        return { seasons, maxEps };
    }

    // --- SCREENSHOT FUNCTIONALITY ---
    async function downloadGraph() {
        const btn = document.getElementById('sg-download-btn');
        const updateBtn = (text) => { if(btn) btn.innerText = text; };

        try {
            updateBtn('Loading Seasons...');
            await ensureAllSeasonsLoaded();

            updateBtn('Loading Episodes...');
            await ensureAllEpisodesLoaded();

            updateBtn('Fetching Data...');

            const seriesData = await fetchSeriesData();
            const gridData = getGridData();
            if (!gridData) throw new Error("Could not parse grid data");

            // --- TITLE FIX ---
            const domTitle = document.querySelector('[data-testid="hero__primary-text"]') ||
                             document.querySelector('h1[data-testid="hero__pageTitle"]') ||
                             document.querySelector('h2[data-testid="subtitle"]');
            let titleText = domTitle ? domTitle.innerText : (seriesData?.title || 'IMDb Chart');

            let posterSrc = seriesData?.poster;
            if (!posterSrc) {
                const lockup = document.querySelector('.ipc-lockup-overlay');
                const fallback = document.querySelector('.ipc-poster__poster-image img') || document.querySelector('[data-testid="hero-media__poster"] img');
                if (lockup && lockup.previousElementSibling?.tagName === 'IMG') {
                    posterSrc = lockup.previousElementSibling.src;
                } else if (fallback) {
                    posterSrc = fallback.src;
                }
            }

            // --- DETERMINE LAYOUT (Transpose Check) ---
            const shouldTranspose = gridData.maxEps > TRANSPOSE_THRESHOLD;

            // Calculate Widths
            const CELL_W = shouldTranspose ? 60 : 55; // Wider cells if Seasons on top
            const ROW_H = '45px';

            let dataTableWidth;
            if (shouldTranspose) {
                dataTableWidth = (gridData.seasons.length * CELL_W) + 60; // Seasons on X axis
            } else {
                dataTableWidth = (gridData.maxEps * CELL_W) + 120; // Episodes on X axis
            }

            const totalWidth = Math.max(1400, dataTableWidth + 350);

            const wrapper = document.createElement('div');
            wrapper.style.cssText = `position: absolute; top: 0; left: 0; z-index: -9999; background-color: #1F1F1F; color: #ffffff; width: ${totalWidth}px; font-family: Roboto, Helvetica, Arial, sans-serif; display: flex; flex-direction: row; border-radius: 4px; overflow: hidden;`;

            // Sidebar
            const sidebar = document.createElement('div');
            sidebar.style.cssText = `width: 320px; padding: 30px; display: flex; flex-direction: column; gap: 20px; background-color: #1a1a1a; border-right: 1px solid #333; flex-shrink: 0;`;

            if (posterSrc) {
                const imgContainer = document.createElement('div');
                imgContainer.style.cssText = `width: 100%; display: flex; justify-content: center; margin-bottom: 5px;`;
                const img = new Image();
                img.src = posterSrc;
                img.crossOrigin = "anonymous";
                img.style.cssText = `width: 100%; height: auto; border-radius: 8px; box-shadow: 0 8px 20px rgba(0,0,0,0.6);`;
                imgContainer.appendChild(img);
                sidebar.appendChild(imgContainer);
            }

            const hText = document.createElement('h1');
            hText.innerText = titleText;
            hText.style.cssText = `font-size: 26px; line-height: 1.2; margin: 0; color: #fff; font-weight: 800; text-align: center;`;
            sidebar.appendChild(hText);

            if (seriesData && seriesData.rating) {
                const rateBlock = document.createElement('div');
                rateBlock.style.cssText = `display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1);`;
                const scoreLine = document.createElement('div');
                scoreLine.style.cssText = `display: flex; align-items: center; gap: 8px;`;
                scoreLine.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#f5c518"><path d="M12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"></path></svg>
                    <span style="font-size: 28px; font-weight: bold; color: #fff;">${seriesData.rating}</span>
                `;
                const votesLine = document.createElement('div');
                votesLine.innerText = `${seriesData.votes} ratings`;
                votesLine.style.cssText = `font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;`;
                rateBlock.appendChild(scoreLine);
                rateBlock.appendChild(votesLine);
                sidebar.appendChild(rateBlock);
            }

            // Legend
            const legend = document.getElementById('sg-legend-container');
            if (legend) {
                const legendClone = legend.cloneNode(true);
                legendClone.querySelectorAll('.sg-toggle-wrapper, #sg-download-btn, .sg-control-group').forEach(c => c.remove());
                legendClone.style.cssText = `margin-top: 30px; padding: 15px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; white-space: normal;`;
                const itemsDiv = legendClone.querySelector('.sg-legend-items');
                if(itemsDiv) {
                    itemsDiv.style.display = 'flex';
                    itemsDiv.style.flexWrap = 'wrap';
                    itemsDiv.style.justifyContent = 'center';
                    itemsDiv.style.gap = '8px';
                }
                sidebar.appendChild(legendClone);
            }
            wrapper.appendChild(sidebar);

            const mainContent = document.createElement('div');
            mainContent.style.cssText = `flex-grow: 1; padding: 30px; background-color: #1F1F1F; display: flex; flex-direction: column; gap: 20px; overflow: visible; width: max-content;`;

            // Averages
            const avgPanel = document.getElementById('sg-season-averages-container');
            if (avgPanel) {
                const avgClone = avgPanel.cloneNode(true);
                avgClone.style.cssText = 'background: transparent; border: none; padding: 0; box-shadow: none;';
                const avgTitle = avgClone.querySelector('h3'); if(avgTitle) avgTitle.style.color = '#ffffff';
                const infoIcon = avgClone.querySelector('.sg-info-icon'); if (infoIcon) infoIcon.style.display = 'none';
                avgClone.querySelectorAll('.sg-season-card').forEach(card => {
                    card.style.borderColor = 'rgba(255,255,255,0.1)'; card.style.background = 'rgba(255,255,255,0.03)';
                    card.querySelector('.sg-season-label').style.color = '#ccc';
                    const score = card.querySelector('.sg-season-score');
                    const bg = score.style.backgroundColor;
                    if(bg && (bg.includes('231') || bg.includes('99') || bg.includes('24') || bg.includes('29'))) score.style.color = '#fff'; else score.style.color = '#2a2a2a';
                });
                mainContent.appendChild(avgClone);
            }

            // --- BUILD HEATMAP (TRANSPOSED VS NORMAL) ---
            const heatmapContainer = document.createElement('div');

            if (shouldTranspose) {
                // *** TRANSPOSED BUILD (Rows = Episodes, Cols = Seasons) ***
                const table = document.createElement('table');
                table.style.cssText = 'border-collapse: collapse; width: auto; font-size: 13px;';

                // Header (Seasons)
                const thead = document.createElement('thead');
                const hRow = document.createElement('tr');
                // Corner Cell
                const corner = document.createElement('th');
                corner.innerText = "Ep";
                corner.style.cssText = `padding: 8px; color: #bbbbbb; font-weight: 600; text-align: center; border-bottom: 1px solid #333; width: 40px;`;
                hRow.appendChild(corner);

                gridData.seasons.forEach(s => {
                    const th = document.createElement('th');
                    th.innerText = s.name.replace(/^Season\s/,'S'); // Shorten "Season 1" to "S1" if needed
                    th.style.cssText = `padding: 8px 4px; color: #e0e0e0; font-weight: bold; text-align: center; width: ${CELL_W}px;`;
                    hRow.appendChild(th);
                });
                thead.appendChild(hRow);
                table.appendChild(thead);

                // Body (Episodes)
                const tbody = document.createElement('tbody');
                for (let eIdx = 0; eIdx < gridData.maxEps; eIdx++) {
                    const row = document.createElement('tr');

                    // Ep Number Cell
                    const numCell = document.createElement('td');
                    numCell.innerText = eIdx + 1;
                    numCell.style.cssText = `padding: 4px; color: #bbbbbb; text-align: center; font-size: 11px; height: ${ROW_H}; vertical-align: middle;`;
                    row.appendChild(numCell);

                    // Data Cells
                    gridData.seasons.forEach(season => {
                        const td = document.createElement('td');
                        td.style.padding = '2px 4px';
                        td.style.verticalAlign = 'middle';

                        const epData = season.episodes[eIdx];
                        if (epData && !isNaN(epData.val)) {
                            const style = getStyleForRating(epData.val);
                            const div = document.createElement('div');
                            div.innerText = epData.val.toFixed(1);
                            div.style.cssText = `
                                width: 100%; height: 36px; display: flex; align-items: center; justify-content: center;
                                border-radius: 4px; background-color: ${style.bg}; color: ${style.text}; font-weight: 600;
                            `;
                            td.appendChild(div);
                        }
                        row.appendChild(td);
                    });
                    tbody.appendChild(row);
                }
                table.appendChild(tbody);
                heatmapContainer.appendChild(table);

            } else {
                // *** STANDARD BUILD (Rows = Seasons, Cols = Episodes) ***
                // We use cloning of the DOM because it preserves the exact look best for normal layouts
                const heatmapRow = document.createElement('div');
                heatmapRow.style.cssText = `display: flex; flex-direction: row; align-items: flex-start;`;

                const seasonTable = document.querySelector('[data-testid="heatmap__seasons-column"]');
                const episodeTable = document.querySelector('[data-testid="heatmap__episode-data"]');

                if (seasonTable && episodeTable) {
                    const sClone = seasonTable.cloneNode(true);
                    const eClone = episodeTable.cloneNode(true);

                    sClone.style.cssText = 'border-collapse: collapse; margin-right: 8px;';
                    eClone.style.cssText = 'border-collapse: collapse; width: auto; table-layout: auto;';

                    // Align Rows
                    const sRows = sClone.querySelectorAll('tr');
                    const eRows = eClone.querySelectorAll('tr');
                    const rowCount = Math.max(sRows.length, eRows.length);

                    for (let i = 0; i < rowCount; i++) {
                        if (sRows[i]) {
                            const cells = sRows[i].querySelectorAll('td, th');
                            cells.forEach(c => {
                                c.style.height = ROW_H;
                                c.style.padding = '0';
                                c.style.textAlign = 'center';
                                c.style.width = '60px';
                                c.style.verticalAlign = 'middle';
                                c.style.color = '#e0e0e0';
                                const innerDiv = c.querySelector('div');
                                if (innerDiv) {
                                    innerDiv.style.color = '#e0e0e0';
                                    innerDiv.style.display = 'flex';
                                    innerDiv.style.alignItems = 'center';
                                    innerDiv.style.justifyContent = 'center';
                                    innerDiv.style.height = '100%';
                                    innerDiv.style.width = '100%';
                                    innerDiv.style.transform = 'translateX(-8px)';
                                }
                            });
                        }
                        if (eRows[i]) {
                            const cells = eRows[i].querySelectorAll('td, th');
                            cells.forEach(c => {
                                c.style.height = ROW_H;
                                c.style.padding = '0 4px';
                                c.style.verticalAlign = 'middle';
                            });
                        }
                    }

                    // Style Episode Cells
                    eClone.querySelectorAll('*').forEach(el => {
                        if (el.classList.contains('sg-rating-text')) {
                            const bg = el.parentNode.style.backgroundColor;
                            el.style.color = (bg && (bg.includes('231') || bg.includes('99') || bg.includes('24') || bg.includes('29'))) ? '#ffffff' : '#2a2a2a';
                        } else if (el.tagName === 'TH') {
                            el.style.color = '#bbbbbb';
                            el.style.fontSize = '12px';
                        } else if (el.classList.contains('sg-rating-cell')) {
                            el.style.width = '48px';
                            el.style.height = '36px';
                            el.style.borderRadius = '4px';
                            el.style.display = 'flex';
                            el.style.alignItems = 'center';
                            el.style.justifyContent = 'center';
                        }
                    });

                    heatmapRow.appendChild(sClone);
                    heatmapRow.appendChild(eClone);
                    heatmapContainer.appendChild(heatmapRow);
                }
            }

            mainContent.appendChild(heatmapContainer);
            wrapper.appendChild(mainContent);
            document.body.appendChild(wrapper);

            updateBtn('Rendering...');
            await new Promise(r => setTimeout(r, 200));

            const canvas = await html2canvas(wrapper, {
                useCORS: true, backgroundColor: '#1F1F1F', scale: 2,
                width: totalWidth, windowWidth: totalWidth
            });

            const link = document.createElement('a');
            link.download = `${titleText.replace(/[^a-z0-9]/gi, '_')}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            document.body.removeChild(wrapper);

        } catch (e) {
            console.error("Screenshot failed:", e);
            alert("Could not generate image. Check console.");
        } finally {
            updateBtn('Save Image');
        }
    }

// --- CSS ---
    const STYLES = `
        /* Tooltip Styles */
        #sg-custom-tooltip {
            display: none; position: fixed; z-index: 10000; pointer-events: none;
            background: rgba(0, 0, 0, 0.9); color: #fff; padding: 10px 14px;
            border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            font-family: Roboto, Helvetica, Arial, sans-serif; font-size: 13px;
            border: 1px solid rgba(255,255,255,0.15); max-width: 300px;
        }
        .sg-tt-header { font-weight: 400; color: #bbb; display: flex; align-items: center; justify-content: space-between; gap: 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .sg-tt-score { font-weight: bold; color: #f5c518; font-size: 13px; }
        .sg-tt-title { font-weight: 700; font-size: 14px; line-height: 1.3; }
        .sg-tt-loading { font-style: italic; color: #888; font-size: 12px; margin-top: 2px; }

        /* General Styles */
        #sg-legend-container {
            display: flex; flex-wrap: nowrap; gap: 20px; margin: 16px 0 24px 0; padding: 12px 20px;
            align-items: center; justify-content: center;
            background: var(--ipt-on-base-alt-bg-color, rgba(0,0,0,0.03));
            border-radius: 12px; border: 1px solid var(--ipt-on-base-border-color, rgba(0,0,0,0.1));
            font-family: Roboto, Helvetica, Arial, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            white-space: nowrap;
        }
        .sg-legend-items { display: flex; flex-wrap: nowrap; gap: 8px; align-items: center; }
        .sg-badge {
            display: inline-flex; align-items: center; justify-content: center; padding: 5px 12px;
            border-radius: 20px; font-size: 12px; font-weight: 700; letter-spacing: 0.3px;
            cursor: help; text-shadow: 0 1px 1px rgba(0,0,0,0.1); user-select: none;
            border: 1px solid rgba(255,255,255,0.2); transition: transform 0.2s;
        }
        .sg-badge:hover { transform: translateY(-2px); }
        #sg-season-averages-container { margin: 0; display: flex; flex-direction: column; }
        #sg-season-averages-container .ipc-title,
        #sg-season-averages-container .ipc-title hgroup,
        #sg-season-averages-container .ipc-title__text { overflow: visible !important; text-overflow: clip !important; white-space: normal !important; }
        #sg-season-averages-container .ipc-title { margin-bottom: 0px !important; padding-bottom: 0px !important; }
        .sg-season-avg-grid { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px; padding: 0; margin-left: 10px; }
        .sg-season-card {
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            background: var(--ipt-on-base-alt-bg-color, rgba(255,255,255,0.03));
            border-radius: 8px; padding: 12px; min-width: 70px;
            border: 1px solid var(--ipt-on-base-border-color, rgba(255,255,255,0.1));
            transition: transform 0.2s;
        }
        .sg-season-card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.3); }
        .sg-season-label { font-size: 12px; font-weight: 600; text-transform: uppercase; opacity: 0.7; margin-bottom: 8px; }
        .sg-season-score {
            font-size: 18px; font-weight: bold; padding: 6px 14px; border-radius: 6px;
            text-align: center; width: 100%; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.15);
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            transition: background-color 0.2s ease, color 0.2s ease;
        }
        .sg-info-icon {
            display: inline-flex; justify-content: center; align-items: center;
            width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid currentColor;
            font-size: 12px; font-weight: bold; cursor: help; position: relative; opacity: 0.6;
            margin-left: 8px; vertical-align: middle; color: var(--ipt-on-base-textPrimary-color);
            transform: translateY(-1px);
        }
        .sg-info-icon:hover { opacity: 1; }
        .sg-tooltip {
            visibility: hidden; background-color: #222; color: #fff; text-align: center;
            border-radius: 6px; padding: 8px 12px; position: absolute; z-index: 9999;
            bottom: 135%; left: 50%; transform: translateX(-50%);
            width: 220px; font-size: 12px; font-weight: normal;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3); opacity: 0; transition: opacity 0.3s;
            pointer-events: none; border: 1px solid #444; line-height: 1.4;
        }
        .sg-info-icon:hover .sg-tooltip { visibility: visible; opacity: 1; }
        .sg-tooltip::after {
            content: ""; position: absolute; top: 100%; left: 50%; margin-left: -5px;
            border-width: 5px; border-style: solid; border-color: #222 transparent transparent transparent;
        }
        .sg-rating-cell {
            border-radius: 4px !important;
            background-image: linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.05) 100%);
            transition: background-color 0.2s ease;
        }
        .sg-rating-text { font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.25); }

        /* Controls */
        .sg-toggle-wrapper { display: flex; align-items: center; gap: 8px; margin-left: 10px; }
        .sg-toggle-label { font-size: 13px; font-weight: 600; cursor: pointer; user-select: none; color: var(--ipt-on-base-textPrimary-color, inherit); }
        .sg-switch { position: relative; display: inline-block; width: 36px; height: 20px; }
        .sg-switch input { opacity: 0; width: 0; height: 0; }
        .sg-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .3s; border-radius: 20px; }
        .sg-slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
        input:checked + .sg-slider { background-color: #f5c518; }
        input:checked + .sg-slider:before { transform: translateX(16px); }

        #sg-download-btn {
            background: none; border: 1px solid var(--ipt-on-base-border-color, rgba(255,255,255,0.2));
            color: var(--ipt-on-base-textPrimary-color, inherit);
            border-radius: 6px; padding: 4px 12px; cursor: pointer; font-size: 13px; font-weight: 600;
            transition: background 0.2s; display: flex; align-items: center; justify-content: center;
        }
        #sg-download-btn:hover { background: rgba(255,255,255,0.1); }
    `;

    // --- DOM FUNCTIONS ---

    function injectStyles() {
        if (!document.getElementById('sg-styles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'sg-styles';
            styleEl.innerHTML = STYLES;
            document.head.appendChild(styleEl);
        }
    }

    function injectLegend() {
        if (document.getElementById('sg-legend-container')) return;

        const target = document.querySelector('[data-testid="heatmap__root-element"]')
                    || document.querySelector('.ipc-chip-list')
                    || document.querySelector('[data-testid="histogram-container"]');
        if (!target) return;

        const container = document.createElement('div');
        container.id = 'sg-legend-container';

        const items = document.createElement('div');
        items.className = 'sg-legend-items';

        COLOR_STOPS.forEach(c => {
            if (!c.showInLegend) return;
            const b = document.createElement('div');
            b.className = 'sg-badge';
            b.style.backgroundColor = rgbToString(c.rgb);
            b.style.color = c.text;
            b.innerText = c.label;
            let max = (c.val === 9.6) ? 10.0 : (c.val + 0.9).toFixed(1);
            if (c.val === 9.0) max = 9.5; if (c.val === 5.0) max = 5.9; if (c.val === 0.0) max = 4.9;
            b.title = `${c.val} - ${max}`;
            items.appendChild(b);
        });

        // Gradient Toggle
        const gradWrap = document.createElement('div');
        gradWrap.className = 'sg-toggle-wrapper';
        gradWrap.innerHTML = `
            <label class="sg-toggle-label" for="sg-grad-sw">Gradient</label>
            <label class="sg-switch"><input type="checkbox" id="sg-grad-sw" ${isGradientMode?'checked':''}><span class="sg-slider"></span></label>
        `;

        // Save Image Button
        const dlBtn = document.createElement('button');
        dlBtn.id = 'sg-download-btn';
        dlBtn.innerText = 'Save Image';
        dlBtn.onclick = downloadGraph;

        // Append everything in one line (flex-wrap: wrap handles overflow if screen is small)
        container.append(items, gradWrap, dlBtn);

        gradWrap.querySelector('input').addEventListener('change', (e) => {
            isGradientMode = e.target.checked;
            localStorage.setItem(STORAGE_KEY_GRADIENT, isGradientMode);
            colorizeAndBind(true);
            injectAveragesPanel();
        });

        if (target.parentNode) target.parentNode.insertBefore(container, target);
    }

    function calculateAverages() {
        const results = [];
        const sCol = document.querySelector('[data-testid="heatmap__seasons-column"]');
        const eData = document.querySelector('[data-testid="heatmap__episode-data"]');
        if (!sCol || !eData) return results;

        const sRows = Array.from(sCol.querySelectorAll('td.ratings-heatmap__table-data'));
        const eRows = Array.from(eData.querySelectorAll('tbody tr'));
        const len = Math.min(sRows.length, eRows.length);

        for (let i = 0; i < len; i++) {
            const name = sRows[i].innerText.trim();
            const links = eRows[i].querySelectorAll('a');
            let sum = 0, count = 0;
            links.forEach(l => {
                const v = parseFloat(l.innerText.replace(',', '.'));
                if (!isNaN(v)) { sum += v; count++; }
            });
            if (count > 0) results.push({ name, avg: (sum/count).toFixed(1) });
        }
        return results;
    }

    function injectAveragesPanel() {
        const hmSec = document.querySelector('section[data-testid="sub-section-heatmap"]');
        const moreSec = document.querySelector('section[data-testid="more-from-section"]');
        if (!hmSec) return;

        const avgs = calculateAverages();
        if (!avgs.length) return;

        let panel = document.getElementById('sg-season-averages-container');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'sg-season-averages-container';
            panel.className = 'ipc-page-section ipc-page-section--base';
            panel.innerHTML = `
                <div class="ipc-title ipc-title--base ipc-title--section-title ipc-title--on-textPrimary">
                    <hgroup>
                        <h3 class="ipc-title__text">
                            <span>Season Averages</span>
                            <div class="sg-info-icon">i
                                <span class="sg-tooltip">Average calculated based on currently loaded episodes. Load more episodes to update.</span>
                            </div>
                        </h3>
                    </hgroup>
                </div>
                <div id="sg-season-avg-grid" class="sg-season-avg-grid"></div>
            `;
            if (moreSec && moreSec.parentNode) moreSec.parentNode.insertBefore(panel, moreSec);
            else hmSec.parentNode.insertBefore(panel, hmSec.nextSibling);
        }

        const grid = panel.querySelector('#sg-season-avg-grid');
        avgs.forEach(season => {
            let card = grid.querySelector(`.sg-season-card[data-season="${season.name}"]`);
            const style = getStyleForRating(parseFloat(season.avg));

            if (card) {
                const scoreDiv = card.querySelector('.sg-season-score');
                scoreDiv.innerText = season.avg;
                scoreDiv.dataset.rating = season.avg;
                scoreDiv.style.backgroundColor = style.bg;
                scoreDiv.style.color = style.text;
            } else {
                card = document.createElement('div');
                card.className = 'sg-season-card';
                card.dataset.season = season.name;
                card.innerHTML = `
                    <div class="sg-season-label">${season.name}</div>
                    <div class="sg-season-score" data-rating="${season.avg}" style="background-color:${style.bg}; color:${style.text}">${season.avg}</div>
                `;
                grid.appendChild(card);
            }
        });
    }

    // --- MAIN LOGIC ---

    function attachHoverEvents(element, seasonName, epNum, rating, href) {
        if (element.hasAttribute('title')) element.removeAttribute('title');

        const newEl = element.cloneNode(true);
        if(element.parentNode) element.parentNode.replaceChild(newEl, element);

        newEl.addEventListener('mouseenter', (e) => showTooltip(e, seasonName, epNum, rating, href));
        newEl.addEventListener('mousemove', (e) => moveTooltip(e));
        newEl.addEventListener('mouseleave', () => hideTooltip());

        return newEl;
    }

    function colorizeAndBind(forceUpdate = false) {
        scrapeVisibleTitles();

        const sCol = document.querySelector('[data-testid="heatmap__seasons-column"]');
        const eData = document.querySelector('[data-testid="heatmap__episode-data"]');

        if (sCol && eData) {
            const sRows = Array.from(sCol.querySelectorAll('td.ratings-heatmap__table-data'));
            const eRows = Array.from(eData.querySelectorAll('tbody tr'));
            const len = Math.min(sRows.length, eRows.length);

            for (let i = 0; i < len; i++) {
                const seasonName = sRows[i].innerText.trim() || `S${i+1}`;
                const cells = eRows[i].querySelectorAll('td.ratings-heatmap__table-data > div');

                cells.forEach((cell, index) => {
                    if (cell.dataset.sgProcessed && !forceUpdate) return;

                    const a = cell.querySelector('a');
                    if (a) {
                        const val = parseFloat(a.innerText.replace(',', '.'));
                        if (!isNaN(val)) {
                            const s = getStyleForRating(val);
                            cell.classList.add('sg-rating-cell');
                            cell.style.backgroundColor = s.bg;
                            a.classList.add('sg-rating-text');
                            a.style.color = s.text;

                            if (!cell.dataset.sgProcessed) {
                                const href = a.getAttribute('href');
                                if (href) {
                                    attachHoverEvents(a, seasonName, index + 1, val, href);
                                    cell.dataset.sgProcessed = "true";
                                }
                            }
                        }
                    }
                });
            }
        }

        document.querySelectorAll('.sg-season-score').forEach(div => {
            const val = parseFloat(div.dataset.rating);
            if (!isNaN(val)) {
                const s = getStyleForRating(val);
                div.style.backgroundColor = s.bg;
                div.style.color = s.text;
            }
        });

        document.querySelectorAll('[data-testid="histogram-container"] path[aria-label]').forEach(p => {
            const label = p.getAttribute('aria-label');
            const match = label && label.match(/^(\d+)/);
            if (match) {
                const val = parseFloat(match[1]);
                const s = getStyleForRating(val);
                p.style.fill = s.bg;
                p.style.stroke = s.bg;
            }
        });
    }

    function runUpdates(force = false) {
        injectLegend();
        injectAveragesPanel();
        colorizeAndBind(force);
    }

    const lazyUpdate = debounce(() => runUpdates(), DEBOUNCE_TIME);

    function init() {
        injectStyles();
        initTooltip();
        runUpdates();

        const obs = new MutationObserver((mutations) => {
            let changed = false;
            for (const m of mutations) {
                if (m.type === 'childList' && m.addedNodes.length) {
                    changed = true;
                    break;
                }
            }
            if (changed) lazyUpdate();
        });

        const body = document.querySelector('body');
        if (body) obs.observe(body, { childList: true, subtree: true });
    }

    init();

})();