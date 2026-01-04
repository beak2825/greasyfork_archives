// ==UserScript==
// @name         RYM Genre/Charts Toolkit
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Toolkit for RYM: filtering, search, export, statistics, ad removal & more
// @author       dil83
// @license      MIT
// @match        https://rateyourmusic.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/553333/RYM%20GenreCharts%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/553333/RYM%20GenreCharts%20Toolkit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== AD REMOVAL =====
    const AdBlocker = {
        selectors: [
            'div.page_creative_frame',
            'div.connatix_video',
            '[class*="advertisement"]',
            '[id*="ad_"]',
            '.ad-container'
        ],
        
        remove: () => {
            AdBlocker.selectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(ad => {
                    ad.remove();
                    console.log(`[RYM Toolkit] Removed ad: ${selector}`);
                });
            });
        },
        
        init: () => {
            // Remove ads initially
            AdBlocker.remove();
            
            // Observe DOM changes to remove ads instantly when they appear
            const observer = new MutationObserver(() => {
                AdBlocker.remove();
            });
            
            observer.observe(document.body, { 
                childList: true, 
                subtree: true 
            });
            
            console.log('[RYM Toolkit] Ad blocker initialized');
        }
    };
    
    // Initialize ad blocker immediately (works on all pages)
    AdBlocker.init();

    // ===== UTILITY FUNCTIONS =====
    const Utils = {
        getMonthName: (n) => ["", "January", "February", "March", "April", "May", "June", 
                              "July", "August", "September", "October", "November", "December"][n] || "error",
        
        getLastDayOfMonth: (year, month) => new Date(year, month, 0).getDate(),
        
        formatDate: (date) => date.toISOString().slice(0, 10).replace(/-/g, '.'),
        
        debounce: (func, wait) => {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },
        
        parseRating: (text) => parseFloat(text.replace(/[^\d.]/g, '')) || 0,
        
        parseCount: (text) => {
            const match = text.match(/([\d.]+)([kKmM]?)/);
            if (!match) return 0;
            const num = parseFloat(match[1]);
            const mult = match[2].toLowerCase();
            return mult === 'k' ? num * 1000 : mult === 'm' ? num * 1000000 : num;
        }
    };
    const State = {
        currentDate: new Date(),
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth() + 1,
        currentDay: new Date().getDate(),
        isChartsPage: window.location.pathname.includes('/charts/'),
        isGenrePage: window.location.pathname.includes('/genre/'),
        theme: document.documentElement.className.match(/theme_(\w+)/)?.[1] || 'light',
        scrollInterval: null,
        isScrolling: false,
        highlightedItems: new Set(),
        
        getGenre: () => {
            const match = window.location.href.match(/g:([^/]+)/);
            if (match) return match[1];
            if (State.isGenrePage) {
                return window.location.pathname.split('/genre/')[1].replace('/', '');
            }
            return '';
        },        
        getCurrentFilter: () => {
            const periodPattern = /^(\d{4}s?|\d{4}-\d{4}|all-time|\d{4}\.\d{2}\.\d{2}-\d{4}\.\d{2}\.\d{2})$/;
            const pathParts = window.location.pathname.split('/');
            const periodIdx = pathParts.findIndex((part, idx) => idx === 4 && periodPattern.test(part));
            
            let year = State.currentYear;
            let period = 0;
            
            if (periodIdx !== -1) {
                const periodStr = pathParts[periodIdx];
                if (/^\d{4}$/.test(periodStr)) {
                    year = parseInt(periodStr);
                } else if (/^\d{4}\.\d{2}\.\d{2}-\d{4}\.\d{2}\.\d{2}$/.test(periodStr)) {
                    year = parseInt(periodStr.split('.')[0]);
                    period = parseInt(periodStr.split('.')[1]);
                }
            }
            return { year, period };
        }
    };
    const URLBuilder = {
        buildDateRange: (year, month) => {
            if (month < 1 || month > 12) return '';
            if (year > State.currentYear || (year === State.currentYear && month > State.currentMonth)) return '';
            
            let lastDay = Utils.getLastDayOfMonth(year, month);
            if (year === State.currentYear && month === State.currentMonth) {
                lastDay = Math.min(lastDay, State.currentDay);
            }
            
            const monthStr = month.toString().padStart(2, '0');
            const lastDayStr = lastDay.toString().padStart(2, '0');
            return `${year}.${monthStr}.01-${year}.${monthStr}.${lastDayStr}`;
        },
        
        getLastDaysRange: (days) => {
            const endDate = State.currentDate;
            const startDate = new Date(State.currentDate);
            startDate.setDate(endDate.getDate() - days + 1);
            return `${Utils.formatDate(startDate)}-${Utils.formatDate(endDate)}`;
        },
        
        buildFilterURL: (year, value) => {
            let filterPeriod = '';
            
            if (value > 12) {
                const daysMap = { 13: 7, 14: 14, 15: 30, 16: 90, 17: 180 };
                filterPeriod = URLBuilder.getLastDaysRange(daysMap[value]);
            } else if (value > 0) {
                filterPeriod = URLBuilder.buildDateRange(year, value);
            } else {
                if (year > State.currentYear) return null;
                filterPeriod = `${year}`;
            }
            
            if (!filterPeriod) return null;
            
            if (State.isGenrePage) {
                return `${window.location.origin}/charts/top/album/${filterPeriod}/g:${State.getGenre()}/`;
            }
            
            const path = window.location.pathname.replace(/\/+$/, '');
            const parts = path.split('/');
            const periodPattern = /^(\d{4}s?|\d{4}-\d{4}|all-time|\d{4}\.\d{2}\.\d{2}-\d{4}\.\d{2}\.\d{2})$/;
            let periodIdx = parts.findIndex((part, idx) => idx === 4 && periodPattern.test(part));
            
            if (periodIdx === -1) {
                parts.splice(4, 0, filterPeriod);
            } else {
                parts[periodIdx] = filterPeriod;
            }
            
            return window.location.origin + parts.join('/');
        }
    };

    // ===== DATA EXTRACTION =====
    const DataExtractor = {
        getChartItems: () => {
            let items = document.querySelectorAll('.page_charts_section_charts_item');
            let isCarousel = false;
            if (items.length === 0) {
                items = document.querySelectorAll('.page_section_charts_carousel_item');
                isCarousel = true;
            }
            return { items, isCarousel };
        },
        
        extractItemData: (item, index, isCarousel) => {
            const getData = (selector, attr = 'innerText') => {
                const el = item.querySelector(selector);
                return el ? (attr === 'innerText' ? el.innerText.trim() : el.getAttribute(attr)) : '';
            };
            
            const getMultiple = (selector) => 
                Array.from(item.querySelectorAll(selector)).map(el => el.innerText.trim()).join(', ');
            
            return {
                rank: isCarousel 
                    ? getData('.page_section_charts_carousel_number div') || (index + 1)
                    : getData('.page_charts_section_charts_item_number > div:first-child') || (index + 1),
                artist: getData('.artist a, .page_charts_section_charts_item_credited_links_primary a.artist'),
                release: getData('.release a, .page_charts_section_charts_item_title a .ui_name_locale_original'),
                date: getData('.page_charts_section_charts_item_date span, .chart_stats_release_date .rendered_text'),
                type: getData('.page_charts_section_charts_item_release_type'),
                primaryGenres: getMultiple('.page_charts_section_charts_item_genres_primary a'),
                secondaryGenres: getMultiple('.page_charts_section_charts_item_genres_secondary a'),
                descriptors: getMultiple('.page_charts_section_charts_item_genre_descriptors span'),
                rating: getData('.page_charts_section_charts_item_details_average_num, .chart_stats_rating_text'),
                ratingsCount: getData('.page_charts_section_charts_item_details_ratings .abbr, .chart_stats_ratings .abbr'),
                reviews: getData('.page_charts_section_charts_item_details_reviews .abbr, .chart_stats_reviews .abbr'),
                url: getData('.page_charts_section_charts_item_title a, .release a', 'href')
            };
        }
    };
    const UI = {
        createElement: (tag, props = {}, children = []) => {
            const el = document.createElement(tag);
            Object.entries(props).forEach(([key, value]) => {
                if (key === 'style' && typeof value === 'object') {
                    Object.assign(el.style, value);
                } else if (key.startsWith('on')) {
                    el.addEventListener(key.slice(2).toLowerCase(), value);
                } else {
                    el[key] = value;
                }
            });
            children.forEach(child => {
                if (typeof child === 'string') {
                    el.appendChild(document.createTextNode(child));
                } else if (child) {
                    el.appendChild(child);
                }
            });
            return el;
        },
        
        applyTheme: (element) => {
            if (State.theme !== 'light') {
                element.style.backgroundColor = '#333';
                element.style.color = '#fff';
                element.style.border = '1px solid #555';
            }
            return element;
        },
        
        createButton: (text, onClick, style = {}) => {
            const btn = UI.createElement('button', {
                textContent: text,
                onClick,
                style: { margin: '2px', padding: '5px 10px', cursor: 'pointer', ...style }
            });
            return UI.applyTheme(btn);
        },
        
        createInput: (type, props = {}) => {
            const input = UI.createElement('input', { type, ...props });
            return UI.applyTheme(input);
        },
        
        createSelect: (options, selectedValue, onChange) => {
            const select = UI.createElement('select', { onChange });
            options.forEach(({ value, text, selected }) => {
                const opt = UI.createElement('option', { 
                    value, 
                    textContent: text,
                    selected: selected || value == selectedValue 
                });
                select.appendChild(opt);
            });
            return UI.applyTheme(select);
        }
    };
    const Features = {
        // Year/Month Filter
        createDateFilter: () => {
            const container = UI.createElement('div', { style: { marginBottom: '10px' } });
            const { year, period } = State.getCurrentFilter();
            
            const yearOptions = Array.from({ length: State.currentYear - 1899 }, (_, i) => ({
                value: 1900 + i,
                text: 1900 + i
            }));
            
            const yearSelect = UI.createSelect(yearOptions, year, function() {
                const url = URLBuilder.buildFilterURL(parseInt(this.value), parseInt(monthSelect.value));
                if (url) window.location.href = url;
            });
            
            const monthOptions = [
                { value: 0, text: 'Select month' },
                ...Array.from({ length: 12 }, (_, i) => ({ value: i + 1, text: Utils.getMonthName(i + 1) })),
                { value: 0, text: '-----' },
                { value: 13, text: 'Last week' },
                { value: 14, text: 'Last 2 weeks' },
                { value: 15, text: 'Last 30 days' },
                { value: 16, text: 'Last 90 days' },
                { value: 17, text: 'Last 180 days' }
            ];
            
            const monthSelect = UI.createSelect(monthOptions, period, function() {
                const url = URLBuilder.buildFilterURL(parseInt(yearSelect.value), parseInt(this.value));
                if (url) window.location.href = url;
            });
            
            container.appendChild(document.createTextNode('Year: '));
            container.appendChild(yearSelect);
            container.appendChild(UI.createElement('br'));
            container.appendChild(document.createTextNode('Month/Period: '));
            container.appendChild(monthSelect);
            
            return container;
        },
        createCustomDateRange: () => {
            const container = UI.createElement('div', { style: { marginTop: '10px' } });
            const startInput = UI.createInput('date');
            const endInput = UI.createInput('date');
            
            const applyBtn = UI.createButton('Apply Custom Range', () => {
                const startDate = new Date(startInput.value);
                const endDate = new Date(endInput.value);
                
                if (startDate > State.currentDate || endDate > State.currentDate) {
                    alert("Future dates are not available.");
                    return;
                }
                
                const filterPeriod = `${startInput.value.replace(/-/g, '.')}-${endInput.value.replace(/-/g, '.')}`;
                const path = window.location.pathname.replace(/\/+$/, '').split('/');
                const periodPattern = /^(\d{4}s?|\d{4}-\d{4}|all-time|\d{4}\.\d{2}\.\d{2}-\d{4}\.\d{2}\.\d{2})$/;
                let periodIdx = path.findIndex((part, idx) => idx === 4 && periodPattern.test(part));
                
                if (periodIdx === -1) {
                    path.splice(4, 0, filterPeriod);
                } else {
                    path[periodIdx] = filterPeriod;
                }
                
                window.location.href = window.location.origin + path.join('/');
            });
            
            container.appendChild(document.createTextNode('Custom Start: '));
            container.appendChild(startInput);
            container.appendChild(document.createTextNode(' End: '));
            container.appendChild(endInput);
            container.appendChild(applyBtn);
            
            return container;
        },
        createToggle: () => {
            const isAlbum = window.location.pathname.includes('/album/');
            return UI.createButton(
                isAlbum ? 'Switch to Songs' : 'Switch to Albums',
                () => {
                    const newPath = window.location.pathname.replace(
                        /\/(album|song)\//,
                        `/${isAlbum ? 'song' : 'album'}/`
                    );
                    window.location.href = window.location.origin + newPath;
                }
            );
        },
        createQuickLinks: () => {
            const genre = State.getGenre();
            if (!genre) return null;
            
            const container = UI.createElement('div', { style: { marginTop: '10px' } });
            const links = [
                { text: 'Top Albums All-Time', url: `/charts/top/album/all-time/g:${genre}/` },
                { text: 'Top Songs All-Time', url: `/charts/top/song/all-time/g:${genre}/` },
                { text: `Top Albums ${State.currentYear}`, url: `/charts/top/album/${State.currentYear}/g:${genre}/` },
                { text: 'New Releases', url: `/new-music/g:${genre}/` }
            ];
            
            links.forEach(({ text, url }) => {
                container.appendChild(UI.createButton(text, () => {
                    window.location.href = window.location.origin + url;
                }));
            });
            
            return container;
        },
        createSearch: () => {
            const container = UI.createElement('div', { style: { marginTop: '10px' } });
            const searchInput = UI.createInput('text', { 
                placeholder: 'Search by artist/album/genre...',
                style: { width: '300px', marginRight: '5px' }
            });
            
            const filterSelect = UI.createSelect([
                { value: 'all', text: 'All' },
                { value: 'artist', text: 'Artist' },
                { value: 'album', text: 'Album' },
                { value: 'genre', text: 'Genre' }
            ], 'all', () => performSearch());
            
            const performSearch = Utils.debounce(() => {
                const query = searchInput.value.toLowerCase();
                const filterType = filterSelect.value;
                const { items } = DataExtractor.getChartItems();
                
                items.forEach(item => {
                    let shouldShow = !query;
                    
                    if (query) {
                        const text = item.innerText.toLowerCase();
                        if (filterType === 'all') {
                            shouldShow = text.includes(query);
                        } else if (filterType === 'artist') {
                            const artist = item.querySelector('.artist a')?.innerText.toLowerCase() || '';
                            shouldShow = artist.includes(query);
                        } else if (filterType === 'album') {
                            const album = item.querySelector('.release a')?.innerText.toLowerCase() || '';
                            shouldShow = album.includes(query);
                        } else if (filterType === 'genre') {
                            const genres = item.querySelector('.page_charts_section_charts_item_genres_primary')?.innerText.toLowerCase() || '';
                            shouldShow = genres.includes(query);
                        }
                    }
                    
                    item.style.display = shouldShow ? '' : 'none';
                });
            }, 300);
            
            searchInput.oninput = performSearch;
            
            container.appendChild(searchInput);
            container.appendChild(filterSelect);
            
            return container;
        },
        createExport: () => {
            const container = UI.createElement('div', { style: { marginTop: '10px' } });
            
            const exportMD = UI.createButton('Export to Markdown', () => {
                const { items, isCarousel } = DataExtractor.getChartItems();
                let md = '# RYM Chart\n\n| Rank | Artist | Release | Date | Type | Primary Genres | Secondary Genres | Descriptors | Rating | Ratings | Reviews |\n|------|--------|---------|------|------|----------------|------------------|-------------|--------|---------|--------|\n';
                
                items.forEach((item, index) => {
                    const data = DataExtractor.extractItemData(item, index, isCarousel);
                    md += `| ${data.rank} | ${data.artist} | ${data.release} | ${data.date} | ${data.type} | ${data.primaryGenres} | ${data.secondaryGenres} | ${data.descriptors} | ${data.rating} | ${data.ratingsCount} | ${data.reviews} |\n`;
                });
                
                const blob = new Blob([md], { type: 'text/markdown' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `rym_chart_${Date.now()}.md`;
                link.click();
            });
            
            const exportCSV = UI.createButton('Export to CSV', () => {
                const { items, isCarousel } = DataExtractor.getChartItems();
                let csv = 'Rank,Artist,Release,Date,Type,Primary Genres,Secondary Genres,Descriptors,Rating,Ratings,Reviews,URL\n';
                
                items.forEach((item, index) => {
                    const data = DataExtractor.extractItemData(item, index, isCarousel);
                    const row = [
                        data.rank, data.artist, data.release, data.date, data.type,
                        data.primaryGenres, data.secondaryGenres, data.descriptors,
                        data.rating, data.ratingsCount, data.reviews, data.url
                    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
                    csv += row + '\n';
                });
                
                const blob = new Blob([csv], { type: 'text/csv' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `rym_chart_${Date.now()}.csv`;
                link.click();
            });
            
            const exportJSON = UI.createButton('Export to JSON', () => {
                const { items, isCarousel } = DataExtractor.getChartItems();
                const data = Array.from(items).map((item, index) => 
                    DataExtractor.extractItemData(item, index, isCarousel)
                );
                
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `rym_chart_${Date.now()}.json`;
                link.click();
            });
            
            container.appendChild(exportMD);
            container.appendChild(exportCSV);
            container.appendChild(exportJSON);
            
            return container;
        },
        createStatistics: () => {
            const container = UI.createElement('div', { style: { marginTop: '10px', padding: '10px', border: '1px solid #ccc' } });
            const { items, isCarousel } = DataExtractor.getChartItems();
            
            if (items.length === 0) return null;
            
            const allData = Array.from(items).map((item, index) => 
                DataExtractor.extractItemData(item, index, isCarousel)
            );
            
            const ratings = allData.map(d => Utils.parseRating(d.rating)).filter(r => r > 0);
            const counts = allData.map(d => Utils.parseCount(d.ratingsCount)).filter(c => c > 0);
            
            const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : 'N/A';
            const avgCount = counts.length ? Math.round(counts.reduce((a, b) => a + b, 0) / counts.length) : 'N/A';
            const totalRatings = counts.reduce((a, b) => a + b, 0);
            
            const genres = {};
            allData.forEach(d => {
                d.primaryGenres.split(', ').forEach(g => {
                    if (g) genres[g] = (genres[g] || 0) + 1;
                });
            });
            
            const topGenre = Object.entries(genres).sort((a, b) => b[1] - a[1])[0];
            
            container.innerHTML = `
                <strong>Chart Statistics:</strong><br>
                Total Items: ${items.length}<br>
                Avg Rating: ${avgRating}<br>
                Avg Rating Count: ${avgCount}<br>
                Total Ratings: ${totalRatings.toLocaleString()}<br>
                Most Common Genre: ${topGenre ? `${topGenre[0]} (${topGenre[1]})` : 'N/A'}
            `;
            
            return container;
        },
        createAutoScroll: () => {
            const container = UI.createElement('div', { style: { marginTop: '10px' } });
            const speedInput = UI.createInput('range', {
                min: 1,
                max: 10,
                value: 5,
                style: { width: '100px', marginLeft: '5px' }
            });
            
            const toggleBtn = UI.createButton('Start Auto-Scroll', () => {
                State.isScrolling = !State.isScrolling;
                toggleBtn.textContent = State.isScrolling ? 'Stop Auto-Scroll' : 'Start Auto-Scroll';
                
                if (State.isScrolling) {
                    const speed = parseInt(speedInput.value);
                    State.scrollInterval = setInterval(() => window.scrollBy(0, speed * 2), 50);
                } else {
                    clearInterval(State.scrollInterval);
                }
            });
            
            container.appendChild(toggleBtn);
            container.appendChild(document.createTextNode(' Speed: '));
            container.appendChild(speedInput);
            document.addEventListener('keydown', (e) => {
                if (e.key === 's' && State.isScrolling) {
                    State.isScrolling = false;
                    toggleBtn.textContent = 'Start Auto-Scroll';
                    clearInterval(State.scrollInterval);
                }
            });
            
            return container;
        },
        createHighlighter: () => {
            const container = UI.createElement('div', { style: { marginTop: '10px' } });
            
            const ratingInput = UI.createInput('number', {
                placeholder: 'Min rating',
                step: '0.1',
                style: { width: '100px', marginRight: '5px' }
            });
            
            const highlightBtn = UI.createButton('Highlight High Rated', () => {
                const minRating = parseFloat(ratingInput.value) || 3.5;
                const { items, isCarousel } = DataExtractor.getChartItems();
                
                items.forEach((item, index) => {
                    const data = DataExtractor.extractItemData(item, index, isCarousel);
                    const rating = Utils.parseRating(data.rating);
                    
                    if (rating >= minRating) {
                        item.style.backgroundColor = State.theme === 'light' ? '#ffffcc' : '#444400';
                        State.highlightedItems.add(item);
                    }
                });
            });
            
            const clearBtn = UI.createButton('Clear Highlights', () => {
                State.highlightedItems.forEach(item => {
                    item.style.backgroundColor = '';
                });
                State.highlightedItems.clear();
            });
            
            container.appendChild(ratingInput);
            container.appendChild(highlightBtn);
            container.appendChild(clearBtn);
            
            return container;
        },
        createQuickFilters: () => {
            const container = UI.createElement('div', { style: { marginTop: '10px' } });
            
            const filters = [
                { text: 'This Month', period: State.currentMonth },
                { text: 'Last Month', period: State.currentMonth - 1 || 12 },
                { text: 'This Year', period: 0 },
                { text: 'Last 30 Days', period: 15 }
            ];
            
            filters.forEach(({ text, period }) => {
                container.appendChild(UI.createButton(text, () => {
                    const year = period === 0 || period >= State.currentMonth ? State.currentYear : State.currentYear;
                    const url = URLBuilder.buildFilterURL(year, period);
                    if (url) window.location.href = url;
                }, { fontSize: '12px' }));
            });
            
            return container;
        }
    };
    const init = () => {
        // Only show toolkit on charts and genre pages
        if (!State.isChartsPage && !State.isGenrePage) {
            console.log('[RYM Toolkit] Toolkit UI not shown (only on charts/genre pages), but ad blocker is active');
            return;
        }
        
        const toolkitDiv = UI.createElement('div', {
            className: 'page_section page_genre_section',
            style: {
                padding: '15px',
                marginBottom: '20px',
                backgroundColor: State.theme === 'light' ? '#f0f0f0' : '#222',
                color: State.theme === 'light' ? '#000' : '#fff',
                border: `1px solid ${State.theme === 'light' ? '#ccc' : '#444'}`
            }
        });
        
        toolkitDiv.appendChild(UI.createElement('h3', { textContent: '🛠️ RYM Toolkit by dil83' }));
        const adStatus = UI.createElement('div', {
            style: {
                fontSize: '11px',
                color: State.theme === 'light' ? '#006600' : '#00ff00',
                marginBottom: '8px',
                fontWeight: 'bold'
            },
            textContent: '✓ Ad Blocker Active (Site-wide)'
        });
        toolkitDiv.appendChild(adStatus);
        toolkitDiv.appendChild(Features.createDateFilter());
        toolkitDiv.appendChild(Features.createCustomDateRange());
        
        if (State.isChartsPage) {
            toolkitDiv.appendChild(UI.createElement('br'));
            toolkitDiv.appendChild(Features.createToggle());
            toolkitDiv.appendChild(Features.createQuickFilters());
            toolkitDiv.appendChild(Features.createSearch());
            toolkitDiv.appendChild(Features.createHighlighter());
            
            const stats = Features.createStatistics();
            if (stats) toolkitDiv.appendChild(stats);
            
            toolkitDiv.appendChild(Features.createExport());
        }
        
        if (State.isGenrePage) {
            const quickLinks = Features.createQuickLinks();
            if (quickLinks) toolkitDiv.appendChild(quickLinks);
        }
        
        toolkitDiv.appendChild(Features.createAutoScroll());
        
        const insertPoint = State.isChartsPage 
            ? document.querySelector('.page_chart_query_advanced')
            : document.querySelector('#page_genre_group_main_info_left');
        
        if (insertPoint) {
            insertPoint.prepend(toolkitDiv);
        }
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();