// ==UserScript==
// @name         Joybuy.nl Price Tracker
// @namespace    http://tampermonkey.net/
// @version      2.5.1
// @description  Track product prices with search, filter, and hover preview
// @author       Keon
// @match        https://www.joybuy.nl/*
// @match        https://joybuy.nl/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-idle
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/563031/Joybuynl%20Price%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/563031/Joybuynl%20Price%20Tracker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== ROBUST SELECTORS ====================

    const SELECTORS = {
        productName: [
            'h1[class*="skuTitle"]',
            'h1[class*="title"]',
            'h1[class*="name"]',
            '.product_main h1',
            'main h1'
        ],

        currentPrice: [
            'div[class*="Price"][class*="Real"] span',
            'div[class*="price"][class*="real"] span',
            'span[style*="color: rgb(225, 37, 27)"]',
            'span[style*="color: rgb(204, 12, 28)"]',
            'span[style*="font-size: 32px"]',
            'span[style*="font-size: 20px"]',
            'div[class*="price"] span'
        ],

        originalPrice: [
            'span[style*="line-through"]',
            'del',
            's',
            'div[class*="original"] span[style*="line-through"]',
            'div[class*="Original"] span[style*="line-through"]'
        ],

        productCards: [
            'div[class*="product_card"]',
            'div[class*="Product_card"]',
            'div[class*="productCard"]',
            '[data-exp*="skuid"]'
        ],

        searchProductName: [
            'span[class*="name"]',
            'span[class*="Name"]',
            'span[class*="title"]',
            'h3',
            'h2'
        ],

        searchPrice: [
            'div[class*="realPrice"] span',
            'div[class*="Real"] span',
            'span[style*="color: rgb(204, 12, 28)"]',
            'span[style*="color: rgb(225, 37, 27)"]'
        ]
    };

    // ==================== HELPER FUNCTIONS ====================

    function isSearchPage() {
        const pathname = window.location.pathname;
        return pathname === '/s' || pathname.startsWith('/s/') || pathname.includes('/search');
    }

    function isProductPage() {
        return window.location.pathname.match(/\/product\/|\/dp\//);
    }

    function findElement(selectors, context = document) {
        for (let selector of selectors) {
            try {
                const element = context.querySelector(selector);
                if (element) return element;
            } catch (e) {
                console.warn('Invalid selector:', selector);
            }
        }
        return null;
    }

    function findElements(selectors, context = document) {
        for (let selector of selectors) {
            try {
                const elements = context.querySelectorAll(selector);
                if (elements.length > 0) return elements;
            } catch (e) {
                console.warn('Invalid selector:', selector);
            }
        }
        return [];
    }

    function extractPrice(element) {
        if (!element) return null;

        const text = element.textContent || element.innerText;

        const patterns = [
            /€?\s*(\d+)[,.](\d{2})/,
            /(\d+)[,.](\d{2})\s*€?/,
            /€?\s*(\d+)/
        ];

        for (let pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                const price = parseFloat(`${match[1]}.${match[2] || '00'}`);
                if (!isNaN(price) && price > 0) {
                    return price;
                }
            }
        }

        return null;
    }

    function extractPriceFromContainer(container) {
        const spans = container.querySelectorAll('span');
        const prices = [];

        for (let span of spans) {
            const style = span.getAttribute('style') || '';
            const text = span.textContent || '';

            const hasLargeFont = style.includes('font-size: 20px') || style.includes('font-size: 32px');
            const hasRedColor = style.includes('rgb(204, 12, 28)') || style.includes('rgb(225, 37, 27)');
            const hasEuro = text.includes('€');
            const hasNumber = /\d/.test(text);

            if ((hasLargeFont || hasRedColor || hasEuro) && hasNumber) {
                const price = extractPrice(span);
                if (price) {
                    prices.push(price);
                }
            }
        }

        return prices.length > 0 ? Math.max(...prices) : null;
    }

    // ==================== DATA MANAGEMENT ====================

    function getStoredData() {
        return JSON.parse(GM_getValue('joybuyPriceTracking', '{}'));
    }

    function saveData(data) {
        GM_setValue('joybuyPriceTracking', JSON.stringify(data));
    }

    function getConfig() {
        return JSON.parse(GM_getValue('joybuyPriceTrackerConfig', JSON.stringify({
            autoTrackProductPage: true,
            autoTrackSearchPage: false,
            trackOnScroll: true,
            scrollDebounceMs: 2000,
            //silentMode: true
        })));
    }

    function saveConfig(config) {
        GM_setValue('joybuyPriceTrackerConfig', JSON.stringify(config));
    }

    function getProductId() {
        const urlPatterns = [
            /\/product\/(\d+)/,
            /\/dp\/[^/]+\/(\d+)/,
            /\/(\d{7,})/
        ];

        for (let pattern of urlPatterns) {
            const match = window.location.pathname.match(pattern);
            if (match) return match[1];
        }

        const expElements = document.querySelectorAll('[data-exp]');
        for (let elem of expElements) {
            try {
                const expData = elem.getAttribute('data-exp');
                const parsed = JSON.parse(expData);

                const jsonParam = parsed.json_param;
                if (jsonParam) {
                    const param = typeof jsonParam === 'string' ? JSON.parse(jsonParam) : jsonParam;
                    if (param.mainskuid) return param.mainskuid.toString();
                    if (param.skuid) return param.skuid.toString();
                }
            } catch (e) {
                continue;
            }
        }

        return null;
    }

    function extractProductInfo() {
        try {
            const nameElement = findElement(SELECTORS.productName);
            const name = nameElement ? nameElement.textContent.trim() : null;

            let price = null;
            const priceElement = findElement(SELECTORS.currentPrice);
            if (priceElement) {
                price = extractPrice(priceElement);
            }

            if (!price) {
                const priceContainer = document.querySelector('[class*="price"], [class*="Price"]');
                if (priceContainer) {
                    price = extractPriceFromContainer(priceContainer);
                }
            }

            let originalPrice = null;
            const originalPriceElement = findElement(SELECTORS.originalPrice);
            if (originalPriceElement) {
                originalPrice = extractPrice(originalPriceElement);
            }

            const productId = getProductId();

            console.log('Extraction result:', { name, price, originalPrice, productId });

            return {
                name,
                price,
                originalPrice,
                url: window.location.href,
                productId
            };
        } catch (error) {
            console.error('Error extracting product info:', error);
            return { name: null, price: null, originalPrice: null, url: window.location.href, productId: null };
        }
    }

    function extractSearchResultProducts() {
        const products = [];
        const productCards = findElements(SELECTORS.productCards);

        console.log('Found product cards:', productCards.length);

        productCards.forEach(card => {
            try {
                let productId = null;
                let price = null;
                let originalPrice = null;

                const expData = card.getAttribute('data-exp') || card.closest('[data-exp]')?.getAttribute('data-exp');
                if (expData) {
                    try {
                        const parsed = JSON.parse(expData);
                        if (parsed.json_param) {
                            const jsonParam = typeof parsed.json_param === 'string'
                                ? JSON.parse(parsed.json_param)
                                : parsed.json_param;
                            productId = jsonParam.skuid?.toString();
                            price = jsonParam.firprice ? parseFloat(jsonParam.firprice) : null;
                            originalPrice = jsonParam.secprice ? parseFloat(jsonParam.secprice) : null;
                        }
                    } catch (e) {
                        console.warn('Failed to parse data-exp:', e);
                    }
                }

                const nameElement = findElement(SELECTORS.searchProductName, card);
                const name = nameElement ? nameElement.textContent.trim() : null;

                let url = null;
                const linkElement = card.querySelector('a[href*="/dp/"]') ||
                    card.querySelector('a[href*="/product/"]') ||
                    card.closest('a[href*="/dp/"]') ||
                    card.querySelector('a');

                if (linkElement) {
                    const href = linkElement.getAttribute('href');
                    url = href.startsWith('http') ? href : 'https://www.joybuy.nl' + href;

                    if (!productId) {
                        const match = href.match(/\/(\d{7,})/);
                        if (match) productId = match[1];
                    }
                }

                if (!price) {
                    const priceElement = findElement(SELECTORS.searchPrice, card);
                    if (priceElement) {
                        price = extractPrice(priceElement);
                    }

                    if (!price) {
                        price = extractPriceFromContainer(card);
                    }
                }

                if (!originalPrice) {
                    const originalElements = card.querySelectorAll('span[style*="line-through"]');
                    for (let elem of originalElements) {
                        const p = extractPrice(elem);
                        if (p && p > (price || 0)) {
                            originalPrice = p;
                            break;
                        }
                    }
                }

                if (productId && name && price && url) {
                    products.push({
                        productId,
                        name,
                        price,
                        originalPrice,
                        url,
                        cardElement: card
                    });
                    console.log('Extracted product:', { productId, name, price, originalPrice });
                }
            } catch (error) {
                console.error('Error extracting product from card:', error);
            }
        });

        return products;
    }

    // ==================== TRACKING FUNCTIONS ====================

    function trackCurrentProduct(silent = false) {
        const info = extractProductInfo();

        console.log('Track button clicked - Extracted product info:', info);

        if (!info.productId) {
            showNotification('无法识别产品ID\n请确保在产品页面上', 'error');
            return false;
        }

        if (!info.name || !info.price) {
            showNotification('无法提取产品信息\n产品名: ' + (info.name ? '✓' : '✗') + '\n价格: ' + (info.price ? '✓' : '✗'), 'error');
            return false;
        }

        const data = getStoredData();
        const productId = info.productId;

        if (!data[productId]) {
            data[productId] = {
                name: info.name,
                url: info.url,
                originalPrice: info.originalPrice,
                prices: []
            };
        }

        data[productId].name = info.name;
        data[productId].url = info.url;
        if (info.originalPrice) {
            data[productId].originalPrice = info.originalPrice;
        }

        const today = new Date().toISOString().split('T')[0];
        const lastPrice = data[productId].prices[data[productId].prices.length - 1];

        if (lastPrice && lastPrice.date.startsWith(today) && lastPrice.price === info.price) {
            showNotification(`今日已记录: €${info.price}`, 'info');
            return false;
        }

        data[productId].prices.push({
            price: info.price,
            date: new Date().toISOString()
        });

        saveData(data);

        //if (!silent) {
            const discount = info.originalPrice ?
                Math.round((1 - info.price / info.originalPrice) * 100) : 0;

            showNotification(
                `✓ 已追踪\n${info.name.substring(0, 30)}...\n当前价格: €${info.price}` +
                (discount > 0 ? `\n折扣: ${discount}%` : ''),
                'success'
            );
        //}

        return true;
    }

function trackBulkProducts(silent = false) {
    const products = extractSearchResultProducts();

    if (products.length === 0) {
        if (!silent) showNotification('未找到可追踪的产品\n请确保在搜索结果页面', 'error');
        return;
    }

    const data = getStoredData();
    let newCount = 0;
    let updateCount = 0;

    products.forEach(product => {
        const productId = product.productId;

        if (!data[productId]) {
            data[productId] = {
                name: product.name,
                url: product.url,
                originalPrice: product.originalPrice,
                prices: []
            };
            newCount++;
        } else {
            data[productId].name = product.name;
            data[productId].url = product.url;
            if (product.originalPrice) {
                data[productId].originalPrice = product.originalPrice;
            }
        }

        const today = new Date().toISOString().split('T')[0];
        const lastPrice = data[productId].prices[data[productId].prices.length - 1];

        if (!lastPrice || !lastPrice.date.startsWith(today) || lastPrice.price !== product.price) {
            data[productId].prices.push({
                price: product.price,
                date: new Date().toISOString()
            });
            updateCount++;
        }
    });

    saveData(data);

    // Always show notification when not silent (regardless of whether there were updates)
    //if (!silent) {
        if (newCount > 0 || updateCount > 0) {
            showNotification(
                `✓ 批量追踪完成\n找到 ${products.length} 个产品\n新增 ${newCount} 个\n更新 ${updateCount} 条价格记录`,
                'success'
            );
        } else {
            // Show info even when no updates
            showNotification(
                `✓ 批量追踪完成\n找到 ${products.length} 个产品\n今日价格无变化`,
                'info'
            );
        }
    //}

    // Refresh hover previews after bulk tracking
    setTimeout(() => {
        addHoverPreviews();
    }, 500);

    return { total: products.length, newCount, updateCount };
}

    function removeProduct(productId) {
        const data = getStoredData();
        if (data[productId]) {
            const productName = data[productId].name;
            delete data[productId];
            saveData(data);
            showNotification(`已删除: ${productName.substring(0, 30)}...`, 'info');
            if (document.getElementById('priceTrackerDashboard')) {
                showDashboard();
            }
        }
    }

    // ==================== EXPORT FUNCTIONS ====================

    function downloadJSON() {
        const data = getStoredData();
        const count = Object.keys(data).length;

        if (count === 0) {
            showNotification('没有数据可导出', 'error');
            return;
        }

        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `joybuy-tracker-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification(`已导出 ${count} 个产品的数据`, 'success');
    }

    function downloadCSV() {
        const data = getStoredData();
        let csv = 'Product ID,Product Name,Date,Price,Original Price,URL\n';

        let rowCount = 0;
        Object.entries(data).forEach(([productId, product]) => {
            product.prices.forEach(priceEntry => {
                const date = new Date(priceEntry.date).toISOString().split('T')[0];
                csv += `"${productId}","${product.name.replace(/"/g, '""')}","${date}","${priceEntry.price}","${product.originalPrice || ''}","${product.url}"\n`;
                rowCount++;
            });
        });

        if (rowCount === 0) {
            showNotification('没有数据可导出', 'error');
            return;
        }

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `joybuy-tracker-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification(`已导出 ${rowCount} 条价格记录`, 'success');
    }

    // ==================== CHART RENDERING ====================

    function createPriceChart(prices, width = 600, height = 200) {
        if (prices.length === 0) return '<p class="pt-no-data">暂无价格历史</p>';

        const minPrice = Math.min(...prices.map(p => p.price));
        const maxPrice = Math.max(...prices.map(p => p.price));
        const priceRange = maxPrice - minPrice;
        const padding = priceRange * 0.1 || 1;

        const chartHeight = height;
        const chartWidth = width;
        const leftPadding = width > 300 ? 50 : 35;
        const rightPadding = 20;
        const topPadding = 20;
        const bottomPadding = width > 300 ? 40 : 30;

        const plotWidth = chartWidth - leftPadding - rightPadding;
        const plotHeight = chartHeight - topPadding - bottomPadding;

        const points = prices.map((p, i) => {
            const x = leftPadding + (i / (prices.length - 1 || 1)) * plotWidth;
            const y = topPadding + plotHeight - ((p.price - minPrice + padding) / (priceRange + 2 * padding)) * plotHeight;
            return { x, y, price: p.price, date: p.date };
        });

        const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        const areaData = `M ${points[0].x} ${topPadding + plotHeight} ${pathData} L ${points[points.length - 1].x} ${topPadding + plotHeight} Z`;

        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        };

        const fontSize = width > 300 ? 11 : 9;

        let svg = `
            <svg class="pt-chart" width="${chartWidth}" height="${chartHeight}" viewBox="0 0 ${chartWidth} ${chartHeight}">
                <line x1="${leftPadding}" y1="${topPadding}" x2="${leftPadding}" y2="${topPadding + plotHeight}" stroke="#e0e0e0" stroke-width="1"/>
                <line x1="${leftPadding}" y1="${topPadding + plotHeight}" x2="${leftPadding + plotWidth}" y2="${topPadding + plotHeight}" stroke="#e0e0e0" stroke-width="1"/>

                <path d="${areaData}" fill="rgba(102, 126, 234, 0.1)" />
                <path d="${pathData}" fill="none" stroke="#667eea" stroke-width="2" />

                ${points.map((p, i) => `
                    <circle cx="${p.x}" cy="${p.y}" r="4" fill="#667eea" class="pt-chart-point" data-index="${i}"/>
                `).join('')}

                ${points.filter(p => p.price === minPrice).map(p => `
                    <circle cx="${p.x}" cy="${p.y}" r="6" fill="none" stroke="#28a745" stroke-width="2"/>
                    <text x="${p.x}" y="${p.y - 12}" text-anchor="middle" font-size="${fontSize}" fill="#28a745" font-weight="bold">最低</text>
                `).join('')}
                ${points.filter(p => p.price === maxPrice).map(p => `
                    <circle cx="${p.x}" cy="${p.y}" r="6" fill="none" stroke="#dc3545" stroke-width="2"/>
                    <text x="${p.x}" y="${p.y - 12}" text-anchor="middle" font-size="${fontSize}" fill="#dc3545" font-weight="bold">最高</text>
                `).join('')}

                <text x="${leftPadding - 10}" y="${topPadding + 5}" text-anchor="end" font-size="${fontSize}" fill="#6c757d">€${(maxPrice + padding).toFixed(2)}</text>
                <text x="${leftPadding - 10}" y="${topPadding + plotHeight}" text-anchor="end" font-size="${fontSize}" fill="#6c757d">€${(minPrice - padding).toFixed(2)}</text>

                ${prices.length <= 10 && width > 300 ? points.map((p, i) => `
                    <text x="${p.x}" y="${topPadding + plotHeight + 20}" text-anchor="middle" font-size="${fontSize - 1}" fill="#6c757d">${formatDate(p.date)}</text>
                `).join('') : `
                    <text x="${points[0].x}" y="${topPadding + plotHeight + 20}" text-anchor="start" font-size="${fontSize - 1}" fill="#6c757d">${formatDate(points[0].date)}</text>
                    <text x="${points[points.length - 1].x}" y="${topPadding + plotHeight + 20}" text-anchor="end" font-size="${fontSize - 1}" fill="#6c757d">${formatDate(points[points.length - 1].date)}</text>
                `}
            </svg>
        `;

        return svg;
    }

    // ==================== IMPORT FUNCTIONS ====================

    function importJSON() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const text = await file.text();
                const importedData = JSON.parse(text);

                // Validate the data structure
                if (typeof importedData !== 'object') {
                    throw new Error('Invalid JSON format');
                }

                const currentData = getStoredData();
                let newCount = 0;
                let updateCount = 0;

                // Merge imported data with existing data
                Object.entries(importedData).forEach(([productId, product]) => {
                    if (!currentData[productId]) {
                        currentData[productId] = product;
                        newCount++;
                    } else {
                        // Merge prices, avoiding duplicates
                        const existingDates = new Set(
                            currentData[productId].prices.map(p => p.date)
                        );

                        product.prices.forEach(priceEntry => {
                            if (!existingDates.has(priceEntry.date)) {
                                currentData[productId].prices.push(priceEntry);
                                updateCount++;
                            }
                        });

                        // Sort prices by date
                        currentData[productId].prices.sort(
                            (a, b) => new Date(a.date) - new Date(b.date)
                        );

                        // Update product info
                        currentData[productId].name = product.name;
                        currentData[productId].url = product.url;
                        if (product.originalPrice) {
                            currentData[productId].originalPrice = product.originalPrice;
                        }
                    }
                });

                saveData(currentData);
                showNotification(
                    `✓ 导入成功\n新增 ${newCount} 个产品\n新增 ${updateCount} 条价格记录`,
                    'success'
                );

                // Refresh dashboard if open
                if (document.getElementById('priceTrackerDashboard')) {
                    showDashboard();
                }
            } catch (error) {
                console.error('Import error:', error);
                showNotification(`导入失败: ${error.message}`, 'error');
            }
        };

        input.click();
    }

    function importCSV() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const text = await file.text();
                const lines = text.split('\n').filter(line => line.trim());

                if (lines.length < 2) {
                    throw new Error('CSV file is empty');
                }

                // Skip header
                const dataLines = lines.slice(1);
                const currentData = getStoredData();
                let newProducts = 0;
                let newPrices = 0;

                dataLines.forEach(line => {
                    // Parse CSV line (handle quoted fields)
                    const matches = line.match(/("(?:[^"]|"")*"|[^,]*)/g);
                    if (!matches || matches.length < 6) return;

                    const [productId, name, date, price, originalPrice, url] = matches.map(
                        field => field.replace(/^"|"$/g, '').replace(/""/g, '"').trim()
                    );

                    if (!productId || !name || !date || !price || !url) return;

                    const priceValue = parseFloat(price);
                    if (isNaN(priceValue)) return;

                    if (!currentData[productId]) {
                        currentData[productId] = {
                            name: name,
                            url: url,
                            originalPrice: originalPrice ? parseFloat(originalPrice) : null,
                            prices: []
                        };
                        newProducts++;
                    }

                    // Create a Set of existing dates (normalized to date-only)
                    const existingDates = new Set(
                        currentData[productId].prices.map(p =>
                            new Date(p.date).toISOString().split('T')[0]
                        )
                    );

                    // Check if this date already exists
                    if (!existingDates.has(date)) {
                        currentData[productId].prices.push({
                            price: priceValue,
                            date: new Date(date + 'T00:00:00.000Z').toISOString()
                        });
                        newPrices++;
                    }

                    // Update product info (keep the latest)
                    currentData[productId].name = name;
                    currentData[productId].url = url;
                    if (originalPrice) {
                        currentData[productId].originalPrice = parseFloat(originalPrice);
                    }
                });

                // Sort all prices by date
                Object.values(currentData).forEach(product => {
                    product.prices.sort((a, b) => new Date(a.date) - new Date(b.date));
                });

                saveData(currentData);
                showNotification(
                    `✓ 导入成功\n新增 ${newProducts} 个产品\n新增 ${newPrices} 条价格记录`,
                    'success'
                );

                // Refresh dashboard if open
                if (document.getElementById('priceTrackerDashboard')) {
                    showDashboard();
                }
            } catch (error) {
                console.error('Import error:', error);
                showNotification(`导入失败: ${error.message}`, 'error');
            }
        };

        input.click();
    }

    // ==================== DASHBOARD WITH SEARCH ====================

    function showDashboard() {
        const data = getStoredData();
        const productCount = Object.keys(data).length;
        const totalPrices = Object.values(data).reduce((sum, p) => sum + p.prices.length, 0);

        const existing = document.getElementById('priceTrackerDashboard');
        if (existing) existing.remove();

        const dashboard = document.createElement('div');
        dashboard.id = 'priceTrackerDashboard';
        dashboard.innerHTML = `
            <div class="pt-header">
                <h2>价格追踪器</h2>
                <button class="pt-close">✕</button>
            </div>
            <div class="pt-stats">
                <div class="pt-stat">
                    <span class="pt-stat-value">${productCount}</span>
                    <span class="pt-stat-label">追踪产品</span>
                </div>
                <div class="pt-stat">
                    <span class="pt-stat-value">${totalPrices}</span>
                    <span class="pt-stat-label">价格记录</span>
                </div>
            </div>
            <div class="pt-search-container">
                <input type="text" id="ptSearchInput" class="pt-search-input" placeholder="🔍 搜索产品名称...">
                <div class="pt-filter-buttons">
                    <button class="pt-filter-btn pt-filter-active" data-filter="all">全部</button>
                    <button class="pt-filter-btn" data-filter="price-drop">价格下降</button>
                    <button class="pt-filter-btn" data-filter="price-up">价格上涨</button>
                    <button class="pt-filter-btn" data-filter="recent">最近更新</button>
                </div>
            </div>
<div class="pt-settings">
    <details class="pt-settings-details">
        <summary class="pt-settings-summary">⚙️ 设置</summary>
        <div class="pt-settings-content">
            <label class="pt-setting-item">
                <input type="checkbox" id="ptAutoTrackProduct" ${getConfig().autoTrackProductPage ? 'checked' : ''}>
                <span>自动追踪产品页面</span>
                <small>访问产品详情页时自动记录价格</small>
            </label>
            <label class="pt-setting-item">
                <input type="checkbox" id="ptAutoTrackSearch" ${getConfig().autoTrackSearchPage ? 'checked' : ''}>
                <span>自动追踪搜索结果</span>
                <small>在搜索页面自动追踪所有可见产品</small>
            </label>
            <label class="pt-setting-item">
                <input type="checkbox" id="ptTrackOnScroll" ${getConfig().trackOnScroll ? 'checked' : ''} ${!getConfig().autoTrackSearchPage ? 'disabled' : ''}>
                <span>滚动停止时追踪</span>
                <small>等待滚动停止后再追踪（减少资源消耗）</small>
            </label>
        </div>
    </details>
</div>
            <div class="pt-actions">
                <button class="pt-btn pt-btn-primary" id="ptExportJSON">导出 JSON</button>
                <button class="pt-btn pt-btn-primary" id="ptExportCSV">导出 CSV</button>
                <button class="pt-btn pt-btn-success" id="ptImportJSON">导入 JSON</button>
                <button class="pt-btn pt-btn-success" id="ptImportCSV">导入 CSV</button>
                <button class="pt-btn pt-btn-danger" id="ptClearAll">清空数据</button>
            </div>
            <div class="pt-products" id="ptProductList"></div>
        `;

        document.body.appendChild(dashboard);

        // Close button
        dashboard.querySelector('.pt-close').addEventListener('click', () => {
            dashboard.remove();
        });

        // Render products
        renderDashboardProducts();

        // Search functionality
        const searchInput = document.getElementById('ptSearchInput');
        searchInput.addEventListener('input', (e) => {
            renderDashboardProducts(e.target.value, getCurrentFilter());
        });

        // Filter functionality
        document.querySelectorAll('.pt-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.pt-filter-btn').forEach(b => b.classList.remove('pt-filter-active'));
                e.target.classList.add('pt-filter-active');
                renderDashboardProducts(searchInput.value, e.target.dataset.filter);
            });
        });

        // Event listeners
        document.getElementById('ptExportJSON').addEventListener('click', downloadJSON);
        document.getElementById('ptExportCSV').addEventListener('click', downloadCSV);
        document.getElementById('ptImportJSON').addEventListener('click', importJSON);
        document.getElementById('ptImportCSV').addEventListener('click', importCSV);
        document.getElementById('ptClearAll').addEventListener('click', clearAllData);

        // Settings event listeners
        const autoTrackProductCheckbox = document.getElementById('ptAutoTrackProduct');
        const autoTrackSearchCheckbox = document.getElementById('ptAutoTrackSearch');
        const trackOnScrollCheckbox = document.getElementById('ptTrackOnScroll');

        autoTrackProductCheckbox.addEventListener('change', (e) => {
            const config = getConfig();
            config.autoTrackProductPage = e.target.checked;
            saveConfig(config);
            showNotification(
                e.target.checked ? '✓ 已启用产品页面自动追踪' : '✗ 已禁用产品页面自动追踪',
                'info'
            );
        });

        autoTrackSearchCheckbox.addEventListener('change', (e) => {
            const config = getConfig();
            config.autoTrackSearchPage = e.target.checked;
            saveConfig(config);
            trackOnScrollCheckbox.disabled = !e.target.checked;
            showNotification(
                e.target.checked ? '✓ 已启用搜索页面自动追踪' : '✗ 已禁用搜索页面自动追踪',
                'info'
            );
        });

        trackOnScrollCheckbox.addEventListener('change', (e) => {
            const config = getConfig();
            config.trackOnScroll = e.target.checked;
            saveConfig(config);
            showNotification(
                e.target.checked ? '✓ 滚动停止时追踪' : '✗ 立即追踪',
                'info'
            );
        });

    }

    function getCurrentFilter() {
        const activeBtn = document.querySelector('.pt-filter-btn.pt-filter-active');
        return activeBtn ? activeBtn.dataset.filter : 'all';
    }

    function renderDashboardProducts(searchTerm = '', filter = 'all') {
        const data = getStoredData();
        const productList = document.getElementById('ptProductList');

        if (Object.keys(data).length === 0) {
            productList.innerHTML = '<p class="pt-empty">暂无追踪产品</p>';
            return;
        }

        let products = Object.entries(data);

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            products = products.filter(([id, product]) =>
                product.name.toLowerCase().includes(term) ||
                id.includes(term)
            );
        }

        products = products.filter(([id, product]) => {
            if (filter === 'all') return true;

            const prices = product.prices;
            if (prices.length < 2) return false;

            const currentPrice = prices[prices.length - 1].price;
            const firstPrice = prices[0].price;

            if (filter === 'price-drop') {
                return currentPrice < firstPrice;
            } else if (filter === 'price-up') {
                return currentPrice > firstPrice;
            } else if (filter === 'recent') {
                const lastUpdate = new Date(prices[prices.length - 1].date);
                const threeDaysAgo = new Date();
                threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
                return lastUpdate >= threeDaysAgo;
            }

            return true;
        });

        products.sort((a, b) => {
            const dateA = new Date(a[1].prices[a[1].prices.length - 1].date);
            const dateB = new Date(b[1].prices[b[1].prices.length - 1].date);
            return dateB - dateA;
        });

        if (products.length === 0) {
            productList.innerHTML = '<p class="pt-empty">未找到匹配的产品</p>';
            return;
        }

        productList.innerHTML = '';

        products.forEach(([productId, product]) => {
            const prices = product.prices;
            const currentPrice = prices[prices.length - 1].price;
            const minPrice = Math.min(...prices.map(p => p.price));
            const maxPrice = Math.max(...prices.map(p => p.price));
            const firstPrice = prices[0].price;
            const priceChange = ((currentPrice - firstPrice) / firstPrice * 100).toFixed(1);

            const productCard = document.createElement('div');
            productCard.className = 'pt-product-card';
            productCard.innerHTML = `
                <div class="pt-product-header">
                    <h3 class="pt-product-name" title="${product.name}">${product.name}</h3>
                    <button class="pt-delete-btn" data-product-id="${productId}" title="删除">🗑️</button>
                </div>
                <div class="pt-product-info">
                    <div class="pt-price-current">
                        当前: <strong>€${currentPrice.toFixed(2)}</strong>
                        ${priceChange != 0 ? `<span class="${priceChange > 0 ? 'pt-price-up' : 'pt-price-down'}">${priceChange > 0 ? '↑' : '↓'}${Math.abs(priceChange)}%</span>` : ''}
                    </div>
                    <div class="pt-price-range">
                        最低: €${minPrice.toFixed(2)} | 最高: €${maxPrice.toFixed(2)}
                    </div>
                    <div class="pt-price-history">
                        记录 ${prices.length} 次 | 最后更新: ${new Date(prices[prices.length - 1].date).toLocaleDateString('zh-CN')}
                    </div>
                </div>
                <div class="pt-chart-container">
                    ${createPriceChart(prices)}
</div>
<a href="${product.url}" target="_blank" class="pt-product-link">查看产品 →</a>
`;
            productList.appendChild(productCard);
        });

        addChartTooltips();

        document.querySelectorAll('.pt-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                if (confirm('确定要删除此产品的追踪记录吗？')) {
                    removeProduct(productId);
                }
            });
        });
    }

    function addChartTooltips() {
        const points = document.querySelectorAll('.pt-chart-point');
        const data = getStoredData();

        points.forEach(point => {
            point.addEventListener('mouseenter', function (e) {
                const card = this.closest('.pt-product-card');
                const productId = card.querySelector('.pt-delete-btn').dataset.productId;
                const product = data[productId];
                const index = parseInt(this.dataset.index);
                const priceData = product.prices[index];

                const tooltip = document.createElement('div');
                tooltip.className = 'pt-chart-tooltip-show';
                tooltip.innerHTML = `
                <div><strong>€${priceData.price.toFixed(2)}</strong></div>
                <div>${new Date(priceData.date).toLocaleDateString('zh-CN')}</div>
            `;
                tooltip.style.left = e.pageX + 'px';
                tooltip.style.top = (e.pageY - 50) + 'px';

                document.body.appendChild(tooltip);
                this._tooltip = tooltip;
            });

            point.addEventListener('mouseleave', function () {
                if (this._tooltip) {
                    this._tooltip.remove();
                    this._tooltip = null;
                }
            });
        });
    }

    function clearAllData() {
        if (confirm('确定要清空所有追踪数据吗？此操作不可恢复！')) {
            GM_setValue('joybuyPriceTracking', '{}');
            showNotification('所有数据已清空', 'info');
            const dashboard = document.getElementById('priceTrackerDashboard');
            if (dashboard) dashboard.remove();
        }
    }

    // ==================== SEARCH RESULTS HOVER PREVIEW ====================

    function addHoverPreviews() {
        if (!isSearchPage()) {
            console.log('Not on search page, skipping hover previews');
            return;
        }

        // Remove existing indicators first
        document.querySelectorAll('.pt-tracking-indicator').forEach(el => el.remove());

        const data = getStoredData();
        console.log('Adding hover previews, tracked products:', Object.keys(data).length);

        const products = extractSearchResultProducts();
        console.log('Found products on page:', products.length);

        const HIDE_DELAY = 100;

        products.forEach(product => {
            const productId = product.productId;
            const card = product.cardElement;

            if (data[productId]) {
                console.log('Adding indicator for product:', productId);

                // Make card position relative if not already
                if (getComputedStyle(card).position === 'static') {
                    card.style.position = 'relative';
                }

                // Add tracking indicator
                const indicator = document.createElement('div');
                indicator.className = 'pt-tracking-indicator';
                indicator.innerHTML = '📊';
                indicator.title = '已追踪 - 悬停查看价格历史';
                card.appendChild(indicator);

                // Add hover preview on indicator only
                indicator.addEventListener('mouseenter', function (e) {
                    e.stopPropagation();
                    console.log('Mouse entered indicator:', productId);

                    // Remove any existing preview
                    const existingPreview = document.querySelector('.pt-hover-preview');
                    if (existingPreview) existingPreview.remove();

                    const trackedProduct = data[productId];
                    const prices = trackedProduct.prices;

                    const currentPrice = prices[prices.length - 1].price;
                    const minPrice = Math.min(...prices.map(p => p.price));
                    const maxPrice = Math.max(...prices.map(p => p.price));

                    const preview = document.createElement('div');
                    preview.className = 'pt-hover-preview';

                    preview.innerHTML = `
                    <div class="pt-hover-preview-header">
                        <strong>价格历史</strong>
                        <span class="pt-hover-preview-close">✕</span>
                    </div>
                    <div class="pt-hover-preview-stats">
                        <div>当前: <strong>€${currentPrice.toFixed(2)}</strong></div>
                        <div>最低: <span style="color: #28a745">€${minPrice.toFixed(2)}</span></div>
                        <div>最高: <span style="color: #dc3545">€${maxPrice.toFixed(2)}</span></div>
                    </div>
                    <div class="pt-hover-preview-chart">
                        ${createPriceChart(prices, 300, 150)}
                    </div>
                    <div class="pt-hover-preview-footer">
                        记录 ${prices.length} 次价格变化
                    </div>
                `;

                    document.body.appendChild(preview);

                    // Position the preview near the indicator
                    const indicatorRect = this.getBoundingClientRect();
                    const previewWidth = 320;

                    let left = indicatorRect.right + 10;
                    let top = indicatorRect.top + window.scrollY - 50;

                    // Adjust if preview goes off screen
                    if (left + previewWidth > window.innerWidth) {
                        left = indicatorRect.left - previewWidth - 10;
                    }

                    if (left < 0) {
                        left = 10;
                    }

                    preview.style.left = left + 'px';
                    preview.style.top = top + 'px';

                    // Store reference
                    indicator._hoverPreview = preview;

                    // Close button
                    preview.querySelector('.pt-hover-preview-close').addEventListener('click', () => {
                        preview.remove();
                        indicator._hoverPreview = null;
                    });

                    // Keep preview visible when hovering over it
                    preview.addEventListener('mouseenter', function () {
                        clearTimeout(this._hideTimeout);
                    });

                    preview.addEventListener('mouseleave', function () {
                        this._hideTimeout = setTimeout(() => {
                            this.remove();
                            indicator._hoverPreview = null;
                        }, HIDE_DELAY);
                    });
                });

                indicator.addEventListener('mouseleave', function () {
                    if (this._hoverPreview) {
                        this._hoverPreview._hideTimeout = setTimeout(() => {
                            if (this._hoverPreview && !this._hoverPreview.matches(':hover')) {
                                this._hoverPreview.remove();
                                this._hoverPreview = null;
                            }
                        }, HIDE_DELAY);
                    }
                });
            }
        });

        console.log('Hover previews added');
    }

    // ==================== AUTO-TRACKING ====================

    let scrollTimer = null;
    let hasTrackedOnScroll = false;

    function autoTrackProductPage() {
        const config = getConfig();
        if (!config.autoTrackProductPage) return;

        const productId = getProductId();
        if (!productId) return;

        if (isSearchPage()) return;

        console.log('Auto-tracking product page:', productId);
        trackCurrentProduct();
    }

    function autoTrackSearchPage() {
        const config = getConfig();
        if (!config.autoTrackSearchPage) return;

        if (!isSearchPage()) return;

        console.log('Auto-tracking search page');
        trackBulkProducts();
    }

    function trackVisibleProductsOnScroll() {
        const config = getConfig();
        if (!config.trackOnScroll || !config.autoTrackSearchPage) return;
        if (!isSearchPage()) return;

        // Clear existing timer
        if (scrollTimer) {
            clearTimeout(scrollTimer);
        }

        // Set new timer
        scrollTimer = setTimeout(() => {
            if (!hasTrackedOnScroll) {
                console.log('Scroll stopped, tracking visible products...');
                autoTrackSearchPage();
                hasTrackedOnScroll = true;
            }
        }, config.scrollDebounceMs);
    }

    function setupAutoTracking() {
        const config = getConfig();

        // Auto-track on product pages
        if (isProductPage()) {
            setTimeout(() => {
                autoTrackProductPage();
            }, 2000);
        }

        // Auto-track on search pages (on scroll stop)
        if (isSearchPage()) {
            hasTrackedOnScroll = false;

            if (config.trackOnScroll && config.autoTrackSearchPage) {
                window.addEventListener('scroll', trackVisibleProductsOnScroll, { passive: true });
            } else if (config.autoTrackSearchPage) {
                // Track immediately if not waiting for scroll
                setTimeout(() => {
                    autoTrackSearchPage();
                }, 2000);
            }
        }
    }

    // ==================== NOTIFICATION ====================

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `pt-notification pt-notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('pt-notification-show'), 10);

        setTimeout(() => {
            notification.classList.remove('pt-notification-show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // ==================== UI BUTTONS ====================

    function addTrackingButton() {
        const onSearchPage = isSearchPage();
        const productId = getProductId();

        // On product page, we need a product ID; on search page, we need product cards
        if (!onSearchPage && !productId) {
            console.log('No product ID found, not adding tracking button');
            return;
        }

        if (onSearchPage) {
            const products = findElements(SELECTORS.productCards);
            if (products.length === 0) {
                console.log('No product cards found on search page');
                return;
            }
        }

        const existing = document.getElementById('priceTrackerBtn');
        if (existing) existing.remove();

        const button = document.createElement('button');
        button.id = 'priceTrackerBtn';
        button.innerHTML = onSearchPage ? '📊 批量追踪' : '📊 追踪价格';
        button.addEventListener('click', function (e) {
            console.log('Track button clicked!');
            e.preventDefault();
            e.stopPropagation();
            if (onSearchPage) {
                trackBulkProducts();
            } else {
                trackCurrentProduct();
            }
        });
        document.body.appendChild(button);

        console.log(onSearchPage ? 'Bulk tracking button added' : 'Tracking button added for product:', productId);
    }


    function addDashboardButton() {
        const existing = document.getElementById('dashboardBtn');
        if (existing) existing.remove();

        const button = document.createElement('button');
        button.id = 'dashboardBtn';
        button.innerHTML = '📈';
        button.title = '打开价格追踪器';
        button.addEventListener('click', function (e) {
            console.log('Dashboard button clicked!');
            e.preventDefault();
            e.stopPropagation();
            showDashboard();
        });
        document.body.appendChild(button);

        console.log('Dashboard button added');
    }

    // ==================== STYLES ====================

    GM_addStyle(`
    #priceTrackerBtn {
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        padding: 12px 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
    }

    #priceTrackerBtn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0,0,0,0.2);
    }

    #dashboardBtn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        width: 56px;
        height: 56px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 24px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    }

    #dashboardBtn:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    }

    #priceTrackerDashboard {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 900px;
        max-height: 85vh;
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        z-index: 10000;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .pt-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .pt-header h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
    }

    .pt-close {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        transition: background 0.2s;
    }

    .pt-close:hover {
        background: rgba(255,255,255,0.3);
    }

    .pt-stats {
        display: flex;
        gap: 20px;
        padding: 20px 20px 0 20px;
        background: #f8f9fa;
    }

    .pt-stat {
        flex: 1;
        text-align: center;
        padding: 15px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .pt-stat-value {
        display: block;
        font-size: 32px;
        font-weight: 700;
        color: #667eea;
        margin-bottom: 5px;
    }

    .pt-stat-label {
        display: block;
        font-size: 14px;
        color: #6c757d;
    }

    .pt-search-container {
        padding: 15px 20px;
        background: #f8f9fa;
    }

    .pt-search-input {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e9ecef;
        border-radius: 8px;
        font-size: 14px;
        transition: all 0.2s;
        margin-bottom: 12px;
    }

    .pt-search-input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .pt-settings {
    padding: 0 20px 15px 20px;
    background: #f8f9fa;
}

.pt-settings-details {
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    overflow: hidden;
}

.pt-settings-summary {
    padding: 12px 16px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    color: #212529;
    user-select: none;
    list-style: none;
}

.pt-settings-summary::-webkit-details-marker {
    display: none;
}

.pt-settings-summary:hover {
    background: #f8f9fa;
}

.pt-settings-content {
    padding: 12px 16px;
    border-top: 1px solid #e9ecef;
}

.pt-setting-item {
    display: flex;
    flex-direction: column;
    padding: 10px 0;
    cursor: pointer;
    border-bottom: 1px solid #f8f9fa;
}

.pt-setting-item:last-child {
    border-bottom: none;
}

.pt-setting-item input[type="checkbox"] {
    margin-right: 8px;
    cursor: pointer;
}

.pt-setting-item span {
    font-size: 14px;
    color: #212529;
    margin-bottom: 4px;
}

.pt-setting-item small {
    font-size: 12px;
    color: #6c757d;
    margin-left: 24px;
}

.pt-setting-item input[type="checkbox"]:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

    .pt-filter-buttons {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }

    .pt-filter-btn {
        padding: 6px 12px;
        border: 1px solid #e9ecef;
        background: white;
        border-radius: 6px;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .pt-filter-btn:hover {
        border-color: #667eea;
        color: #667eea;
    }

    .pt-filter-active {
        background: #667eea;
        color: white;
        border-color: #667eea;
    }

    .pt-actions {
        display: flex;
        gap: 10px;
        padding: 0 20px 20px 20px;
        background: #f8f9fa;
    }

    .pt-btn {
        flex: 1;
        padding: 10px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.2s;
    }

    .pt-btn-primary {
        background: #667eea;
        color: white;
    }

    .pt-btn-primary:hover {
        background: #5568d3;
    }

    .pt-btn-success {
    background: #28a745;
    color: white;
    }

    .pt-btn-success:hover {
    background: #218838;
    }

    .pt-btn-danger {
        background: #dc3545;
        color: white;
    }

    .pt-btn-danger:hover {
        background: #c82333;
    }

    .pt-products {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
    }

    .pt-empty {
        text-align: center;
        color: #6c757d;
        padding: 40px;
        font-size: 16px;
    }

    .pt-product-card {
        background: white;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
        transition: all 0.2s;
    }

    .pt-product-card:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        border-color: #667eea;
    }

    .pt-product-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
    }

    .pt-product-name {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #212529;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .pt-delete-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 18px;
        padding: 4px;
        opacity: 0.6;
        transition: opacity 0.2s;
    }

    .pt-delete-btn:hover {
        opacity: 1;
    }

    .pt-product-info {
        margin-bottom: 12px;
    }

    .pt-price-current {
        font-size: 18px;
        color: #212529;
        margin-bottom: 8px;
    }

    .pt-price-current strong {
        color: #667eea;
        font-size: 20px;
    }

    .pt-price-up {
        color: #dc3545;
        font-size: 14px;
        margin-left: 8px;
    }

    .pt-price-down {
        color: #28a745;
        font-size: 14px;
        margin-left: 8px;
    }

    .pt-price-range, .pt-price-history {
        font-size: 13px;
        color: #6c757d;
        margin-bottom: 4px;
    }

    .pt-chart-container {
        margin: 16px 0;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 8px;
        position: relative;
    }

    .pt-chart {
        width: 100%;
        height: auto;
    }

    .pt-chart-point {
        cursor: pointer;
        transition: r 0.2s;
    }

    .pt-chart-point:hover {
        r: 6;
    }

    .pt-chart-tooltip-show {
        position: absolute;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        pointer-events: none;
        z-index: 10001;
        white-space: nowrap;
    }

    .pt-no-data {
        text-align: center;
        color: #6c757d;
        padding: 20px;
        font-size: 14px;
    }

    .pt-product-link {
        display: inline-block;
        color: #667eea;
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        transition: color 0.2s;
    }

    .pt-product-link:hover {
        color: #5568d3;
    }

    .pt-tracking-indicator {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(102, 126, 234, 0.95);
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        z-index: 100;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .pt-tracking-indicator:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }

    .pt-hover-preview {
        position: absolute;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        padding: 16px;
        width: 320px;
        z-index: 10002;
        border: 2px solid #667eea;
    }

    .pt-hover-preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid #e9ecef;
    }

    .pt-hover-preview-header strong {
        font-size: 16px;
        color: #212529;
    }

    .pt-hover-preview-close {
        cursor: pointer;
        color: #6c757d;
        font-size: 18px;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s;
    }

    .pt-hover-preview-close:hover {
        background: #f8f9fa;
        color: #212529;
    }

    .pt-hover-preview-stats {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        font-size: 13px;
    }

    .pt-hover-preview-stats strong {
        color: #667eea;
    }

    .pt-hover-preview-chart {
        margin-bottom: 12px;
        padding: 8px;
        background: #f8f9fa;
        border-radius: 6px;
    }

    .pt-hover-preview-footer {
        font-size: 12px;
        color: #6c757d;
        text-align: center;
    }

    .pt-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10003;
        max-width: 300px;
        opacity: 0;
        transform: translateX(400px);
        transition: all 0.3s ease;
        white-space: pre-line;
        font-size: 14px;
    }

    .pt-notification-show {
        opacity: 1;
        transform: translateX(0);
    }

    .pt-notification-success {
        border-left: 4px solid #28a745;
    }

    .pt-notification-error {
        border-left: 4px solid #dc3545;
    }

    .pt-notification-info {
        border-left: 4px solid #667eea;
    }
`);

    // ==================== INITIALIZATION ====================

    GM_registerMenuCommand('📊 追踪当前产品', trackCurrentProduct);
    GM_registerMenuCommand('📋 批量追踪搜索结果', trackBulkProducts);
    GM_registerMenuCommand('📈 打开控制面板', showDashboard);
    GM_registerMenuCommand('💾 导出 JSON', downloadJSON);
    GM_registerMenuCommand('📄 导出 CSV', downloadCSV);
    GM_registerMenuCommand('📥 导入 JSON', importJSON);
    GM_registerMenuCommand('📋 导入 CSV', importCSV);
    GM_registerMenuCommand('🗑️ 清空所有数据', clearAllData);

    // Initialize on page load
    function initializeScript() {
        console.log('Initializing Price Tracker...');
        console.log('Current URL:', window.location.href);
        console.log('Is search page:', isSearchPage());
        console.log('Is product page:', isProductPage());

        addTrackingButton();
        addDashboardButton();
        addHoverPreviews();
        setupAutoTracking();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initializeScript, 1500);
        });
    } else {
        setTimeout(initializeScript, 1500);
    }

    // Re-add hover previews when navigating on search page (for SPA behavior)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log('URL changed, reinitializing...');
            setTimeout(initializeScript, 2000);
        }
    }).observe(document, { subtree: true, childList: true });
})();