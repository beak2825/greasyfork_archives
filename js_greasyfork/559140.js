// ==UserScript==
// @name            EB Points Viewer
// @version         2025.12.17
// @author          BonusJegeren
// @namespace       https://github.com/BonusJegeren/eb-points-viewer
// @icon            https://raw.githubusercontent.com/BonusJegeren/eb-points-viewer/main/assets/icon.png
// @description     Calculates and displays estimated EuroBonus Level and Bonus points on the SAS booking page.
// @description:nb  Beregner og viser estimert EuroBonus Nivå- og Bonuspoeng på SAS sin bookingsside.
// @description:sv  Beräknar och visar uppskattade EuroBonus Nivå- och Bonuspoäng på SAS bokningssida.
// @description:da  Beregner og viser estimerede EuroBonus Niveau- og Bonuspoint på SAS' bookingside.
// @keywords        sas, scandinavian airlines, eurobonus, flight, booking, points, miles
// @match           https://www.sas.no/*
// @match           https://www.sas.se/*
// @match           https://www.sas.dk/*
// @match           https://www.flysas.com/*
// @resource        aps https://raw.githubusercontent.com/BonusJegeren/eb-points-viewer/main/data/airports.json
// @resource        cfg https://raw.githubusercontent.com/BonusJegeren/eb-points-viewer/main/data/config.json
// @resource        css https://raw.githubusercontent.com/BonusJegeren/eb-points-viewer/main/styles/main.css
// @run-at          document-start
// @grant           GM_getResourceText
// @grant           GM_addStyle
// @compatible      chrome Tested with Tampermonkey
// @compatible      edge Tested with Tampermonkey
// @compatible      firefox Tested with Tampermonkey
// @license         GPL-3.0-or-later
// @noframes
// @contributionURL https://ko-fi.com/bonusjegeren
// @downloadURL https://update.greasyfork.org/scripts/559140/EB%20Points%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/559140/EB%20Points%20Viewer.meta.js
// ==/UserScript==
/*
 * Copyright (C) 2025 BonusJegeren
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See https://spdx.org/licenses/GPL-3.0-or-later.html for more details.
 */
(function () {
    'use strict';
    // --- Utility functions and constants ---
    const BOOKING_PATH = /\/book\/flights\/$/i;
    const isBookingPage = () => {
        const url = new URL(location.href);
        return BOOKING_PATH.test(url.pathname) && url.searchParams.get('bookingFlow') === 'revenue';
    };
    const resourceCache = {};
    const loadJSON = (name, fallback = {}) => {
        resourceCache[name] ??= (() => {
            try { return JSON.parse(GM_getResourceText(name)) || fallback; }
            catch (e) { console.error(`[EBPV] Error parsing '${name}'.`, e); return fallback; }
        })();
        return resourceCache[name];
    };
    const _log = (open, color, isError, title, ...data) => {
        const header = `%c[EBPV]%c ${title} @ ${new Date().toLocaleTimeString()}`;
        const styles = [`color: ${color}`, 'color: gray; font-weight: lighter;'];
        const print = (entry) => {
            if (entry && entry.group) {
                console.group(entry.group);
                (Array.isArray(entry.items) ? entry.items : [entry.items]).forEach(print);
                console.groupEnd();
            } else if (isError) {
                console.error(entry);
            } else console.log(entry);
        };
        if (data.length) { (open ? console.group : console.groupCollapsed)(header, ...styles); data.forEach(print); console.groupEnd(); }
        else console.log(header, ...styles);
    };
    const log = (title, ...data) => _log(false, '#2E8B57', false, title, ...data);
    log.open = (title, ...data) => _log(true, '#2E8B57', false, title, ...data);
    log.error = (title, ...data) => _log(false, '#DC143C', true, title, ...data);
    let scriptInitialized = false;

    // --- Main function ---
    const bootstrap = () => {
        if (scriptInitialized || !isBookingPage()) return;
        scriptInitialized = true;
        log('Booking page detected. Initializing script...');

        // --- Load resources and setup ---
        const airports = loadJSON('aps');
        const config = loadJSON('cfg');
        const defaults = { class: 'Class', bonus: 'Bonus', level: 'Level', points: 'Points', bonuspoints: 'Bonus points', levelpoints: 'Level points', tier: 'Membership tier', tiers: { M: 'Member', S: 'Silver', G: 'Gold', D: 'Diamond', P: 'Pandion' } };
        const translations = { ...config.translations, en: { ...defaults, ...(config.translations?.en || {}) } };
        const { carrierAlias = {}, classMap = {}, ebSchemes = {} } = config;
        const lang = document.documentElement.getAttribute('data-lang') || 'en';
        const text = translations[lang] || translations.en;
        const locale = document.documentElement.getAttribute('data-currency')?.toUpperCase() === 'EUR' ? undefined : lang;
        const tierLabels = text.tiers || defaults.tiers;
        const tierCodes = Object.keys(defaults.tiers);
        const getTierName = (tierCode) => tierLabels[tierCode] || tierCode;
        const formatNumber = new Intl.NumberFormat(locale).format;
        GM_addStyle(GM_getResourceText('css') || '');
        let ebTier = 'M';
        const flightData = { outbound: null, inbound: null };
        const activeOffers = { outbound: null, inbound: null };

        // --- Carrier name normalization and IATA extraction ---
        const normalizeString = (str) => str.toUpperCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/Æ/g, "AE").replace(/Ø/g, "O")
            .replace(/[^A-Z0-9]/g, "");

        // --- Build reverse carrier map ---
        const carrierMap = Object.entries(carrierAlias).reduce((map, [code, names]) => {
            names.forEach(name => { map[normalizeString(name)] = code });
            return map;
        }, {});

        // --- Extract IATA code from carrier name ---
        const getIATACode = (str) => {
            if (!str) return undefined;
            const up = str.toUpperCase();
            const extract = (sep, len) => up.lastIndexOf(sep) > -1 ? up.substring(up.lastIndexOf(sep) + len) : null;
            const opName = normalizeString(extract(" FOR ", 5) || extract(" OPERATED BY ", 13) || up);
            return (opName.length === 2 && carrierAlias[opName]) ? opName : (carrierMap[opName] || undefined);
        };

        // --- Vincenty formula for distance calculation ---
        const WGS84 = { a: 6378137, b: 6356752.314245, f: 1 / 298.257223563 };
        const milesCache = new Map();
        const toRad = (deg) => deg * Math.PI / 180;
        const getMiles = (iata1, iata2) => {
            const key = iata1 < iata2 ? `${iata1}-${iata2}` : `${iata2}-${iata1}`;
            if (milesCache.has(key)) return milesCache.get(key);
            const ap1 = airports[iata1], ap2 = airports[iata2];
            if (!ap1 || !ap2) return null;
            const [lat1, lon1] = ap1, [lat2, lon2] = ap2;
            const { a, b, f } = WGS84;
            const L = toRad(lon2 - lon1);
            const U1 = Math.atan((1 - f) * Math.tan(toRad(lat1)));
            const U2 = Math.atan((1 - f) * Math.tan(toRad(lat2)));
            const sinU1 = Math.sin(U1), cosU1 = Math.cos(U1);
            const sinU2 = Math.sin(U2), cosU2 = Math.cos(U2);
            let lambda = L, lambdaP, iterLimit = 100;
            let sinLambda, cosLambda, sinSigma, cosSigma, sigma, sinAlpha, cosSqAlpha, cos2SigmaM, C;
            do {
                sinLambda = Math.sin(lambda);
                cosLambda = Math.cos(lambda);
                sinSigma = Math.sqrt((cosU2 * sinLambda) ** 2 + (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) ** 2);
                if (sinSigma === 0) { milesCache.set(key, 0); return 0; }
                cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
                sigma = Math.atan2(sinSigma, cosSigma);
                sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma;
                cosSqAlpha = 1 - sinAlpha ** 2;
                cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha;
                if (isNaN(cos2SigmaM)) cos2SigmaM = 0;
                C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
                lambdaP = lambda;
                lambda = L + (1 - C) * f * sinAlpha * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM ** 2)));
            } while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0);
            if (iterLimit === 0) return null;
            const uSq = cosSqAlpha * (a ** 2 - b ** 2) / (b ** 2);
            const A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
            const B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
            const deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM ** 2) - B / 6 * cos2SigmaM * (-3 + 4 * sinSigma ** 2) * (-3 + 4 * cos2SigmaM ** 2)));
            const miles = Math.round(b * A * (sigma - deltaSigma) * 0.000621371);
            milesCache.set(key, miles);
            return miles;
        };

        // --- Read flights data ---
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            const result = originalOpen.apply(this, arguments);
            if (typeof url === 'string' && url.includes('api/offers/') && (url.includes('flights?') || url.includes('inbound?'))) {
                this.addEventListener('load', function () {
                    if (method && method.toUpperCase() === 'GET') {
                        try {
                            if (!this.responseText || this.responseText.trim().startsWith('<')) return;
                            const responseData = JSON.parse(this.responseText);
                            if (url.includes('flights?')) {
                                flightData.outbound = responseData;
                                log(`Outbound flights data loaded`, responseData);
                            } else if (url.includes('inbound?')) {
                                flightData.inbound = responseData;
                                log(`Inbound flights data loaded`, responseData);
                            }
                        } catch (e) {
                            log.error('Error parsing JSON data', e);
                        }
                    }
                });
            }
            return result;
        };

        // --- Points calculation ---
        const calculatePoints = (marketingCarrier, operatingCarrier, bookingClass, distance, fareFamily, tier, dep, arr) => {
            const ap1 = airports[dep], ap2 = airports[arr];
            const isCodeshare = operatingCarrier && operatingCarrier !== marketingCarrier;
            const result = (level, bonus, scheme, usedRule, ticketType) => ({ level, bonus, scheme, usedRule, ticketType, isCodeshare });
            const noPoints = (str) => result(0, 0, str, 'N/A', fareFamily);
            let scheme;
            if (marketingCarrier === 'SK') {
                if (isCodeshare && ebSchemes.skyteam.includes(operatingCarrier)) scheme = 'SKYTEAM';
                else if (isCodeshare && !ebSchemes.wetlease.includes(operatingCarrier)) scheme = operatingCarrier;
                else scheme = 'SK';
            } else if (!ebSchemes.carriers[marketingCarrier]) {
                return noPoints(`N/A (${marketingCarrier})`);
            } else {
                scheme = marketingCarrier;
            }
            let schemeData = ebSchemes.carriers[scheme];
            if (!schemeData) return noPoints(`${scheme} (No scheme)`);
            if (schemeData.ref) schemeData = ebSchemes.carriers[schemeData.ref];

            bookingClass = classMap[scheme]?.[bookingClass] || bookingClass;
            let selectedTable = null, usedRule = 'N/A', ticketType = fareFamily;

            if (schemeData.tables && schemeData.tableRules) {
                for (const rule of schemeData.tableRules) {
                    let match = true;
                    if (match && (rule.regions || rule.countries || rule.airports)) {
                        if (!ap1 || !ap2) {
                            match = false;
                        } else {
                            const checkAp = (ap, code) =>
                                (rule.regions || []).includes(ap[2]) ||
                                (rule.countries || []).includes(ap[3]) ||
                                (rule.airports || []).includes(code);
                            const mode = rule.matchMode || 'BOTH';
                            match = mode === 'BOTH'
                                ? checkAp(ap1, dep) && checkAp(ap2, arr)
                                : checkAp(ap1, dep) || checkAp(ap2, arr);
                        }
                    }
                    if (match && rule.minDist !== undefined && distance < rule.minDist) match = false;
                    if (match && rule.maxDist !== undefined && distance >= rule.maxDist) match = false;
                    if (match) {
                        usedRule = rule.use;
                        selectedTable = schemeData.tables[usedRule];
                        ticketType = rule.replaceType?.[fareFamily] || fareFamily;
                        break;
                    }
                }
            } else if (schemeData.table) {
                usedRule = 'DEFAULT';
                selectedTable = schemeData.table;
            }
            if (!Array.isArray(selectedTable)) return result(0, 0, scheme, usedRule, ticketType);
            const match = selectedTable.find(s => (!s.type || s.type === ticketType) && s.classes?.includes(bookingClass));
            if (!match) return result(0, 0, scheme, usedRule, ticketType);

            const tierMult = ebSchemes.status[tier] || 0;

            if (match.Md !== undefined || match.Mc !== undefined) {
                const dist = Math.min(Math.max(distance, schemeData.min || 0), schemeData.max || Infinity);
                const distMult = (match.Md || 0) / 100;
                const classMult = (match.Mc || 0) / 100;
                const level = schemeData.level ? Math.round(dist * (distMult + classMult)) : 0;
                const bonus = Math.round(dist * (distMult + classMult + distMult * tierMult));
                return result(level, bonus, scheme, usedRule, ticketType);
            }
            return result(match.level || 0, Math.round((match.bonus || 0) * (1 + tierMult)), scheme, usedRule, ticketType);
        };

        // --- UI Integration ---
        const updateTier = () => {
            const label = document.getElementById('ebpv-tier-text');
            const select = document.getElementById('ebpv-tier-select');
            if (label) {
                label.textContent = getTierName(ebTier);
                label.style.backgroundColor = `var(--color-${ebTier === 'D' ? 'diamond-hover' : defaults.tiers[ebTier].toLowerCase()})`;
                label.style.color = ['M', 'P'].includes(ebTier) ? 'var(--color-white)' : 'var(--color-text)';
            }
            if (select) select.value = ebTier;
        };

        window.addEventListener('load', () => {
            const profileIcon = document.getElementById('profile-icon');
            if (profileIcon) {
                const match = profileIcon.className.match(/profile-([MSGDP])/i);
                if (match) {
                    ebTier = match[1].toUpperCase();
                    updateTier();
                }
            }
        });

        const tierDropdown = () => {
            const targetContainer = document.querySelector('filter-sort .desktop-only');
            if (!targetContainer) return;
            if (document.getElementById('ebpv-tier-form')) return;
            targetContainer.style.display = 'flex';
            targetContainer.style.alignItems = 'baseline';
            targetContainer.style.justifyContent = 'flex-end';
            const form = document.createElement('form');
            form.id = 'ebpv-tier-form';
            form.className = 'revenue-sort';
            const options = tierCodes.map(code => `<option value="${code}">${getTierName(code)}</option>`).join('');
            form.innerHTML = `
                <p class="sorting-text">
                    <span class="sortlabel">${text.tier}: </span>
                    <span class="ebpv-selected-value">
                        <span id="ebpv-tier-text"></span>
                        <svg role="presentation" class="sas-book-icon i-arrow-down sas-book-icon-black"><use xlink:href="#in--arrow-down" href="#in--arrow-down"></use></svg>
                        <select id="ebpv-tier-select">
                            ${options}
                        </select>
                    </span>
                </p>
            `;
            targetContainer.insertBefore(form, targetContainer.firstChild);
            updateTier();
            const select = form.querySelector('#ebpv-tier-select');
            select.addEventListener('change', (e) => {
                ebTier = e.target.value;
                updateTier();
                ['outbound', 'inbound'].forEach(dir => {
                    if (activeOffers[dir]) {
                        const el = document.getElementById(activeOffers[dir]);
                        if (el) processOffer(el, dir);
                    }
                });
            });
        };

        const observer = new MutationObserver(() => {
            if (document.getElementById('ebpv-tier-form')) return;
            if (document.querySelector('filter-sort')) tierDropdown();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // --- Process flight offers ---
        const processOffer = (offersElement, direction) => {
            const carousel = offersElement.querySelector('tr.product-details-wrap .product-carousel-container ul');
            if (!carousel) return;

            const idValue = offersElement.id.split('_').pop();
            const flight = (direction === 'inbound')
                ? (flightData.inbound?.inboundFlights?.[idValue] || flightData.outbound?.inboundFlights?.[idValue])
                : flightData.outbound?.outboundFlights?.[idValue];

            if (!flight?.segments) return;

            const cards = carousel.querySelectorAll(':scope > li');
            const tableHeader = `<table style="width:100%; margin-bottom:5px;"><tr><th style="text-align:left">Segment</th><th style="text-align:center">${text.class}</th><th style="text-align:right">Miles</th><th style="text-align:right">${text.level}</th><th style="text-align:right">${text.bonus}</th></tr>`;

            const findProduct = (productName) => {
                for (const cabin of Object.values(flight.cabins)) {
                    for (const [key, val] of Object.entries(cabin)) {
                        if (key.toUpperCase() === productName) return val.products;
                    }
                }
            };

            const flightLog = [];
            cards.forEach((card, index) => {
                const cardTitle = card.querySelector('.card-title-wrapper .card-title .product-class-name-bold');
                if (!cardTitle) return log('No product found');
                const productName = cardTitle.textContent.trim().toUpperCase();
                const products = findProduct(productName);
                if (!products) return log(`No match for "${productName}"`);
                const product = Object.values(products)[0];
                const segmentsData = [];
                const fareKey = product.fareKey || "";
                let totalLevel = 0;
                let totalBonus = 0;
                let breakdownHtml = tableHeader;

                flight.segments.forEach((segment, i) => {
                    const bookingClass = fareKey[i] || 'O';
                    const iataDep = segment.departureAirport?.code;
                    const iataArr = segment.arrivalAirport?.code;
                    const miles = getMiles(iataDep, iataArr) || 0;
                    const marketingCarrier = segment.marketingCarrier?.code;
                    let operatingCarrier = segment.operatingCarrier?.code || segment.operatingCarrier?.name;
                    if (operatingCarrier?.length > 2) operatingCarrier = getIATACode(operatingCarrier);
                    const segPoints = calculatePoints(marketingCarrier, operatingCarrier, bookingClass, miles, productName, ebTier, iataDep, iataArr);
                    totalLevel += segPoints.level;
                    totalBonus += segPoints.bonus;
                    segmentsData.push(`Segment ${i + 1}: ${iataDep} -> ${iataArr} | MKT: ${marketingCarrier} | OPE: ${operatingCarrier} | Scheme: ${segPoints.scheme} | Rule: ${segPoints.usedRule} | Type: ${segPoints.ticketType}`);
                    breakdownHtml += `<tr><td>${iataDep}-${iataArr}</td><td style="text-align:center">${bookingClass}</td><td style="text-align:right">${formatNumber(miles)}</td><td style="text-align:right">${formatNumber(segPoints.level)}</td><td style="text-align:right">${formatNumber(segPoints.bonus)}</td></tr>`;
                });
                flightLog.push({ group: `${index + 1}. ${productName}`, items: segmentsData });
                breakdownHtml += '</table>';
                let tooltip = card.querySelector('.ebpv-tooltip');
                if (!tooltip) {
                    tooltip = document.createElement('div');
                    tooltip.className = 'ebpv-tooltip';
                    card.appendChild(tooltip);
                }
                tooltip.innerHTML = breakdownHtml;
                const priceElement = card.querySelector('.card-footer-price');
                const existingPoints = card.querySelector('.ebpv-points');
                if (priceElement && !existingPoints) {
                    const pointsDiv = document.createElement('div');
                    pointsDiv.className = 'ebpv-points';
                    pointsDiv.innerHTML = `<div>${text.levelpoints}: <span class="ebpv-level-points">${formatNumber(totalLevel)}</span><br>${text.bonuspoints}: <span class="ebpv-bonus-points">${formatNumber(totalBonus)}</span></div><svg role="presentation" class="ebpv-info-icon"><use xlink:href="#cl--info-circle" href="#cl--info-circle"></use></svg>`;
                    priceElement.style.flexWrap = 'wrap';
                    priceElement.appendChild(pointsDiv);
                } else if (existingPoints) {
                    existingPoints.querySelector('.ebpv-bonus-points').textContent = formatNumber(totalBonus);
                    existingPoints.querySelector('.ebpv-level-points').textContent = formatNumber(totalLevel);
                }
            });
            if (flightLog.length) log.open('Flight log', ...flightLog);
        };
        document.addEventListener('click', e => {
            const offersElement = e.target.closest('offers');
            if (!offersElement) return;
            const selectedOffer = offersElement.querySelector('div.flight-row.unbundle-selected-row');
            const direction = offersElement.id.includes('inbound') ? 'inbound' : 'outbound';
            if (!selectedOffer) {
                activeOffers[direction] = null;
                return;
            }
            if (offersElement.id === activeOffers[direction]) return;
            activeOffers[direction] = offersElement.id;
            processOffer(offersElement, direction);
        });
    };

    // --- Page navigation handling ---
    const initSPA = () => {
        ['pushState', 'replaceState'].forEach(method => {
            const original = history[method];
            if (typeof original === 'function') {
                history[method] = function (...args) {
                    const result = original.apply(this, args);
                    bootstrap();
                    return result;
                };
            }
        });
        window.addEventListener('popstate', bootstrap);
        window.addEventListener('hashchange', bootstrap);
    };

    initSPA();
    bootstrap();
})();
