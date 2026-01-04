// ==UserScript==
// @name         PSNP THL Helper
// @namespace    http://tampermonkey.net/
// @version      5.2.1
// @description  Calculates trophy scores and eligibility for games and series on PSNProfiles using THL parameters.
// @author       Tim GT (discord: @tgtzlord) with the help of ChatGPT
// @license      MIT
// @match        https://psnprofiles.com/*
// @grant        GM_xmlhttpRequest
// @connect      psnprofiles.com
// @downloadURL https://update.greasyfork.org/scripts/553807/PSNP%20THL%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/553807/PSNP%20THL%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = window.location.href;


    const isSeriesPage = /^https:\/\/psnprofiles\.com\/series\/[^\/]+/.test(url);
    const isTrophiesPage = /^https:\/\/psnprofiles\.com\/trophies\/[^\/]+/.test(url);
    const isGameListsPage = /^https:\/\/psnprofiles\.com\//.test(url) && !/trophies/i.test(url);
    const isSearchPage = /^https:\/\/psnprofiles\.com\/search\/games[^\/]+/.test(url);
    const isGamesPage = /^https:\/\/psnprofiles\.com\/games[^\/]+/.test(url);


    if (!(isSeriesPage || isTrophiesPage || isGameListsPage || isSearchPage || isGamesPage)) {
        console.log('[PSNP THL Helper] Skipped: not a supported page.');
        return;
    }


    const hideFloatingMenu = isSeriesPage || isGameListsPage || isSearchPage || isGamesPage;


    const rarityWeights = {

        'Common': 1,
        'Uncommon': 1.5,
        'Rare': 3,
        'Very Rare': 6,
        'Ultra Rare': 9
    };
    const trophyValuesByImage = {
        '40-bronze.png': 1,
        'bronze.png': 1,
        '40-silver.png': 2,
        'silver.png': 2,
        '40-gold.png': 6,
        'gold.png': 6,
        '40-platinum.png': 12,
        'platinum.png': 12
    };
    let multiplier = 1;
    let hideEarned = false;
    let hideUnobtainable = false;
    const box = document.createElement('div');
    const scoreText = document.createElement('div');
    const calculateBtn = document.createElement('button');
    Object.assign(box.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: '#222',
        color: '#fff',
        padding: '10px 15px',
        borderRadius: '10px',
        fontSize: '15px',
        fontFamily: 'Arial, sans-serif',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        zIndex: 9999,
        lineHeight: '1.5em',
        maxWidth: '220px'
    });
    Object.assign(calculateBtn.style, {
        padding: '8px 12px',
        background: '#4CAF50',
        border: 'none',
        borderRadius: '5px',
        color: '#fff',
        fontWeight: 'bold',
        cursor: 'pointer',
        width: '100%',
        fontSize: '16px',
        marginBottom: '10px'
    });
    calculateBtn.textContent = 'Calculate Scores';
    scoreText.style.marginBottom = '10px';
    box.appendChild(scoreText);
    box.appendChild(calculateBtn);
    if (!hideFloatingMenu) document.body.appendChild(box);
    const emojiPanel = document.createElement('div');
    Object.assign(emojiPanel.style, {
        position: 'fixed',
        top: '90px',
        right: '20px',
        background: '#222',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: '10px',
        fontSize: '24px',
        fontFamily: 'Arial, sans-serif',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        zIndex: 10000,
        width: '50px',
        height: '50px',
        textAlign: 'center',
        lineHeight: '34px',
        userSelect: 'none'
    });
    emojiPanel.textContent = '⏳';
    if (!hideFloatingMenu) document.body.appendChild(emojiPanel);
    let goldenBtn, hideEarnedBtn, hideUnobtainableBtn;
    let togglesCreated = false;

    function createToggleButtons() {
        goldenBtn = document.createElement('button');
        hideEarnedBtn = document.createElement('button');
        hideUnobtainableBtn = document.createElement('button');
        const buttonStyle = {
            marginTop: '10px',
            marginRight: '10px',
            padding: '5px 10px',
            background: '#888',
            border: 'none',
            borderRadius: '5px',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer'
        };
        Object.assign(goldenBtn.style, buttonStyle);
        Object.assign(hideEarnedBtn.style, buttonStyle);
        Object.assign(hideUnobtainableBtn.style, buttonStyle);
        goldenBtn.textContent = 'Golden Game';
        goldenBtn.addEventListener('click', () => {
            multiplier = (multiplier === 1) ? 2 : 1;
            goldenBtn.style.background = (multiplier === 2) ? '#FFD700' : '#888';
            updateDisplay();
        });
        hideEarnedBtn.textContent = 'Hide Earned';
        hideEarnedBtn.addEventListener('click', () => {
            hideEarned = !hideEarned;
            hideEarnedBtn.style.background = hideEarned ? '#4CAF50' : '#888';
            updateDisplay();
        });
        hideUnobtainableBtn.textContent = 'Hide Unobtainable';
        hideUnobtainableBtn.addEventListener('click', () => {
            hideUnobtainable = !hideUnobtainable;
            hideUnobtainableBtn.style.background = hideUnobtainable ? '#4CAF50' : '#888';
            updateDisplay();
        });
        box.appendChild(goldenBtn);
        box.appendChild(hideEarnedBtn);
        box.appendChild(document.createElement('br'));
        box.appendChild(hideUnobtainableBtn);
    }
    calculateBtn.addEventListener('click', () => {
        if (!togglesCreated) {
            createToggleButtons();
            togglesCreated = true;
        }
        updateDisplay();
        fetch100ClubAndUpdateEmoji();
    });
    window.addEventListener('load', () => {
        if (!togglesCreated) {
            createToggleButtons();
            togglesCreated = true;
        }
        updateDisplay();
        fetch100ClubAndUpdateEmoji();
    });

    function getAllTrophyRows() {
        const rows = Array.from(document.querySelectorAll('table.zebra tbody tr, div.box table tbody tr'));
        return rows.filter(r => !!r.querySelector('td span.separator.left img'));
    }

    function getTrophyValueFromImg(img) {
        const src = img?.getAttribute('src') || '';
        const name = src.split('/').pop() || '';
        for (const key in trophyValuesByImage)
            if (name.includes(key) || src.includes(key)) return trophyValuesByImage[key];
        return 0;
    }

    function getRarityFromRow(tr) {
        const nobr = tr.querySelector('td.hover-hide span.separator.rarity span.typo-bottom nobr');
        if (!nobr) return 0;
        const t = nobr.textContent.trim();
        return rarityWeights[t] || 0;
    }

    function isRowEarned(tr) {
        return tr.classList.contains('completed');
    }

    function isRowUnobtainable(tr) {
        return !!tr.querySelector('td a picture.trophy.unearned.unobtainable');
    }

    function updateDisplay() {
        const rows = getAllTrophyRows();
        let totalTrophyScore = 0;
        let totalRarityScore = 0;
        rows.forEach(tr => {
            const parentBox = tr.closest('.box');
            const parentHidden = parentBox && parentBox.style.display === 'none';
            const manualHidden = tr.dataset.psnpHidden === '1';
            const earned = isRowEarned(tr);
            const unob = isRowUnobtainable(tr);
            const shouldHide = parentHidden || (hideEarned && earned) || (hideUnobtainable && unob);
            tr.style.display = shouldHide ? 'none' : '';
            tr.style.opacity = manualHidden ? '0.4' : '1';
            if (shouldHide || manualHidden) return;
            const img = tr.querySelector('td span.separator.left img');
            const trophyVal = getTrophyValueFromImg(img);
            const rarityVal = getRarityFromRow(tr);
            totalTrophyScore += trophyVal;
            totalRarityScore += rarityVal;
        });
        const finalTrophy = Math.max(0, totalTrophyScore) * multiplier;
        const finalRarity = Math.max(0, totalRarityScore) * multiplier;
        const total = finalTrophy + finalRarity;
        scoreText.innerHTML = `<strong>🏆 Trophy Score:</strong> ${finalTrophy}<br><strong>💠 Rarity Score:</strong> ${finalRarity.toFixed(1)}<br><strong>🧮 Total Score:</strong> ${total.toFixed(1)}`;
    }

    function parseTimeToMinutes(text) {
        if (!text) return null;
        const units = {
            year: 525600,
            month: 43200,
            week: 10080,
            day: 1440,
            hour: 60,
            minute: 1,
            second: 1 / 60
        };
        let total = 0;
        const regex = /([0-9]+)\s*(year|month|week|day|hour|minute|second)s?/gi;
        let m;
        while ((m = regex.exec(text)) !== null) {
            const val = parseInt(m[1], 10);
            const unit = m[2].toLowerCase();
            if (units[unit]) total += val * units[unit];
        }
        return total || null;
    }

    function fetch100ClubEmoji(slug, token = {}, maxRetries = 2) {
        return new Promise((resolve) => {
            if (token.cancelled) return resolve('❓');
            const url = `https://psnprofiles.com/100-club/${slug}`;
            let attempts = 0;

            const tryOnce = () => {
                if (token.cancelled) return resolve('❓');
                attempts++;

                GM_xmlhttpRequest({
                    method: 'GET',
                    url,
                    timeout: 8000,
                    onload(r) {
                        if (token.cancelled) return resolve('❓');

                        if (!r.responseText || r.status !== 200) {
                            if (attempts <= maxRetries) return setTimeout(tryOnce, 1000);
                            return resolve('⚠️');
                        }

                        try {
                            const doc = new DOMParser().parseFromString(r.responseText, 'text/html');
                            const selectors = [
                                'div.col-xs-4:nth-child(3) > table:nth-child(2) > tbody > tr:nth-child(1) > td:nth-child(4) > span > nobr',
                                'div.col-xs-4:nth-child(3) > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(4) > span > nobr',
                                'div.col-xs-4:nth-child(3) > table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(4) > span > nobr',
                                'div.col-xs-4:nth-child(3) > table:nth-child(2) > tbody > tr:nth-child(48) > td:nth-child(4) > span > nobr',
                                'div.col-xs-4:nth-child(3) > table:nth-child(2) > tbody > tr:nth-child(49) > td:nth-child(4) > span > nobr',
                                'div.col-xs-4:nth-child(3) > table:nth-child(2) > tbody > tr:nth-child(50) > td:nth-child(4) > span > nobr'
                            ];

                            const times = selectors.map(sel => {
                                const el = doc.querySelector(sel);
                                const text = el ? el.textContent.trim() : null;
                                return text ? parseMinutes(text) : null;
                            });

                            const [top1, top2, top3, top48, top49, top50] = times;
                            const top1Text = doc.querySelector(selectors[0])?.textContent.trim() || '';

                            const emoji = getEmojiFromTimes(top1, top2, top3, top48, top49, top50, top1Text);
                            if (token.cancelled) return resolve('❓');
                            resolve(emoji);
                        } catch (e) {
                            console.error('fetch100ClubEmoji parse error:', e);
                            if (attempts <= maxRetries) return setTimeout(tryOnce, 1000);
                            resolve('⚠️');
                        }
                    },
                    ontimeout() {
                        if (attempts <= maxRetries) return setTimeout(tryOnce, 1000);
                        resolve('⚠️');
                    },
                    onerror() {
                        if (attempts <= maxRetries) return setTimeout(tryOnce, 1000);
                        resolve('⚠️');
                    }
                });
            };

            tryOnce();
        });
    }


    (function handleDLCToggles() {
        let dlcIndex = 1;
        while (true) {
            const title = document.querySelector(`#DLC-${dlcIndex}.title.flex.v-align`);
            if (!title) break;
            const header = title.querySelector('h3');
            dlcIndex++;
            if (!header) continue;

            const parent = document.querySelector('div#content.page div.row div.col-xs');
            const children = Array.from(parent.children);
            const titleIndex = children.indexOf(title);
            let box = null;
            for (let i = titleIndex + 1; i < children.length; i++) {
                if (children[i].classList.contains('box')) {
                    box = children[i];
                    break;
                }
            }
            if (!box) continue;

            title.style.cursor = 'pointer';
            title.title = `Click to toggle DLC-${dlcIndex - 1}`;
            title.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                box.style.display = box.style.display === 'none' ? '' : 'none';
                updateDisplay();
            }, {
                passive: false
            });
        }
    })();
    async function fetch100ClubAndUpdateEmoji() {
        let slug = location.pathname.match(/\/trophies\/([^\/]+)/);
        if (!slug) {
            emojiPanel.textContent = '❓';
            return;
        }
        slug = slug[1];
        emojiPanel.textContent = '⏳';
        const emoji = await fetch100ClubEmoji(slug);
        emojiPanel.textContent = emoji;
    }

    function parseMinutes(text) {
        if (!text) return null;
        text = text.toLowerCase();
        const units = {
            year: 525600,
            month: 43200,
            week: 10080,
            day: 1440,
            hour: 60,
            minute: 1,
            second: 1 / 60
        };
        let total = 0;
        for (const [unit, m] of Object.entries(units)) {
            const regex = new RegExp(`(\\d+)\\s*${unit}`, 'g');
            let match;
            while ((match = regex.exec(text)) !== null) {
                total += parseInt(match[1], 10) * m;
            }
        }
        return total || null;
    }

    function getEmojiFromTimes(top1, top2, top3, top48, top49, top50, top1Text) {
        const top50Final = (top50 !== null && top50 !== undefined) ? top50 :
            (top49 !== null && top49 !== undefined) ? top49 :
            top48;

        const topsUnder5 = [top1, top2, top3].filter(t => t && t < 10).length;
        const topsOver60 = [top1, top2, top3].filter(t => t && t > 60).length;

        if (!top1Text) return '❓';

        if (/(\d+\s*day|\d+\s*week|\d+\s*month|\d+\s*year|6\s*hours|7\s*hours|8\s*hours|9\s*hours|10\s*hours)/i.test(top1Text))
            return '✅';

        if (topsUnder5 >= 1 && topsUnder5 <= 2 && topsOver60 >= 1 && top50Final && top50Final > 360)
            return '🤥';

        if ([top1, top2, top3, top50Final].every(t => t && t < 60))
            return '🅰️';

        if ((top1 && top1 < 60) || (top50Final && top50Final < 360))
            return '❌';

        if ([top1, top2, top3].every(t => t && t > 60) && (!top50Final || top50Final > 360))
            return '✅';

        return '❓';
    }

    function fetchTrophyScoreSeries(trophyUrl) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: trophyUrl,
                onload(response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const rows = doc.querySelectorAll('table.zebra > tbody > tr');
                    let totalScore = 0;
                    rows.forEach(row => {
                        const img = row.querySelector('td span.separator.left img');
                        const rarityEl = row.querySelector('td.hover-hide span.separator.rarity span.typo-bottom nobr');
                        if (!img || !rarityEl) return;
                        const src = img.getAttribute('src') || '';
                        const rarityText = rarityEl.textContent.trim();
                        if (!rarityWeights[rarityText]) return;
                        const baseScore = rarityWeights[rarityText];
                        let trophyValue = 0;
                        for (const key in trophyValuesByImage) {
                            if (src.includes(key)) {
                                trophyValue = trophyValuesByImage[key];
                                break;
                            }
                        }
                        totalScore += baseScore + trophyValue;
                    });
                    resolve(Math.round(totalScore));
                },
                onerror: () => resolve(0)
            });
        });
    }

    async function processSeries() {
        if (!location.pathname.startsWith('/series/')) return;
        const tables = document.querySelectorAll('table.box, table.zebra');
        if (!tables.length) return;
        for (const table of tables) {
            const rows = table.querySelectorAll('tbody > tr');
            if (!rows.length) continue;
            for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                let tdSelector = 'td:nth-child(2)';
                if (table.classList.contains('box') && rowIndex === 0) tdSelector = 'td:nth-child(3)';
                const row = rows[rowIndex];
                const link = row.querySelector(`${tdSelector} > div:nth-child(1) > span:nth-child(1) > a:nth-child(1)`);
                if (!link) continue;
                const trophyUrl = link.href;
                const slugMatch = trophyUrl.match(/\/trophies\/([^\/]+)/);
                const slug = slugMatch ? slugMatch[1] : null;
                const points = await fetchTrophyScoreSeries(trophyUrl);
                const emoji = slug ? await fetch100ClubEmojiSeries(slug) : '❓';
                let existingSpan = row.querySelector('.psnp-score-emoji');
                if (!existingSpan) {
                    existingSpan = document.createElement('span');
                    existingSpan.className = 'psnp-score-emoji';
                    existingSpan.style.marginLeft = '8px';
                    existingSpan.style.fontWeight = 'bold';
                    row.querySelector(`${tdSelector} > div:nth-child(1) > span:nth-child(1)`).appendChild(existingSpan);
                }
                existingSpan.textContent = `${points}pts ${emoji}`;
            }
        }
    }

    function enableDLCToggles() {
        const attachedFlag = 'data-psnp-dlc-attached';

        function attachToHeader(titleDiv) {
            if (!titleDiv || titleDiv.hasAttribute(attachedFlag)) return;
            const boxDiv = titleDiv.nextElementSibling;
            if (!boxDiv || !boxDiv.classList.contains('box')) {
                titleDiv.setAttribute(attachedFlag, '1');
                return;
            }
            titleDiv.style.cursor = 'pointer';
            titleDiv.title = titleDiv.title || 'Click to toggle this DLC';
            titleDiv.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                boxDiv.style.display = boxDiv.style.display === 'none' ? '' : 'none';
                updateDisplay();
            }, {
                passive: false
            });
            titleDiv.setAttribute(attachedFlag, '1');
        }

        function attachToAllHeaders() {
            const headers = document.querySelectorAll('div[id^="DLC-"] .title.flex.v-align, div[id^="DLC-"].title.flex.v-align');
            headers.forEach(h => attachToHeader(h));
        }
        attachToAllHeaders();
        const contentNode = document.querySelector('#content') || document.body;
        const observer = new MutationObserver(() => attachToAllHeaders());
        observer.observe(contentNode, {
            childList: true,
            subtree: true
        });
    }

    if (!/^https:\/\/psnprofiles\.com\/trophies\//.test(location.href)) {
        console.log('[PSNP] Skipping trophy toggle logic (not a trophy page)');
    } else {
        function enableTrophyRowToggles() {
            const attachedFlag = 'data-psnp-toggle-attached';
            const hasCheckFlag = 'data-psnp-has-checkcell';

            function rowHasCheckCell(tr) {
                if (!tr) return false;
                return !!tr.querySelector('td.check.form, td.check.form *');
            }

            function attachToRow(tr) {
                if (!tr || tr.hasAttribute(attachedFlag)) return;
                const img = tr.querySelector('td span.separator.left img');
                if (!img) return;

                if (rowHasCheckCell(tr)) tr.setAttribute(hasCheckFlag, '1');

                tr.dataset.psnpHidden = tr.dataset.psnpHidden || '0';
                tr.style.cursor = 'pointer';
                tr.title = 'Click to toggle trophy';

                tr.addEventListener('click', function(e) {
                    const linkClicked = e.target.closest('a');
                    const imageCell = tr.querySelector('td:nth-child(1)');
                    const imageCellClicked = imageCell && e.target.closest('td') === imageCell;

                    const insideCheckCell = e.target.closest('td.check.form') || (tr.hasAttribute(hasCheckFlag) && e.target.closest('[data-psnp-check-propagation]'));

                    const checkboxClicked = e.target.closest('input[type="checkbox"], label[for]');

                    if (linkClicked || imageCellClicked || insideCheckCell || checkboxClicked) return;

                    e.preventDefault();
                    e.stopPropagation();

                    tr.dataset.psnpHidden = tr.dataset.psnpHidden === '1' ? '0' : '1';
                    tr.style.opacity = tr.dataset.psnpHidden === '1' ? '0.4' : '1.0';
                    updateDisplay();
                }, {
                    passive: false
                });

                tr.setAttribute(attachedFlag, '1');
            }

            function attachAll() {
                const rows = getAllTrophyRows();
                rows.forEach(r => attachToRow(r));
            }

            const contentNode = document.querySelector('#content') || document.body;
            const observeForChecks = new MutationObserver((mutations) => {
                let needsAttachAll = false;
                for (const mut of mutations) {
                    if (mut.type === 'childList' && mut.addedNodes.length) {
                        mut.addedNodes.forEach(node => {
                            if (!(node instanceof Element)) return;
                            const checkCell = node.matches && node.matches('td.check.form') ? node : node.querySelector && node.querySelector('td.check.form');
                            if (checkCell) {
                                const tr = checkCell.closest('tr');
                                if (tr) tr.setAttribute(hasCheckFlag, '1');
                            }
                        });
                        needsAttachAll = true;
                    }
                    if (mut.type === 'attributes' && mut.target instanceof Element) {
                        const tr = mut.target.closest && mut.target.closest('tr');
                        if (tr && rowHasCheckCell(tr)) tr.setAttribute(hasCheckFlag, '1');
                        needsAttachAll = true;
                    }
                }
                if (needsAttachAll) attachAll();
            });
            observeForChecks.observe(contentNode, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'style']
            });

            attachAll();

            const observer = new MutationObserver(() => attachAll());
            observer.observe(contentNode, {
                childList: true,
                subtree: true
            });
        }

        if (typeof enableTrophyRowToggles === 'function') {
            try {
                enableTrophyRowToggles();
            } catch (e) {
                console.error('enableTrophyRowToggles error:', e);
            }
        } else {
            window.addEventListener('load', () => {
                if (typeof enableTrophyRowToggles === 'function') try {
                    enableTrophyRowToggles();
                } catch (e) {
                    console.error(e);
                }
            });
        }
    }

    // series and gamelist stuff
    (function() {
        'use strict';

        if (!location.hostname.endsWith('psnprofiles.com')) return;

        const rarityWeights = {
            'Common': 1,
            'Uncommon': 1.5,
            'Rare': 3,
            'Very Rare': 6,
            'Ultra Rare': 9
        };
        const trophyValuesByImage = {
            '40-bronze.png': 1,
            'bronze.png': 1,
            '40-silver.png': 2,
            'silver.png': 2,
            '40-gold.png': 6,
            'gold.png': 6,
            '40-platinum.png': 12,
            'platinum.png': 12
        };

        function log(...a) {
            console.log('[PSNP]', ...a);
        }

        function warn(...a) {
            console.warn('[PSNP]', ...a);
        }

        (function installUrlChangeEvent() {
            const wrap = (orig) => function() {
                const rv = orig.apply(this, arguments);
                window.dispatchEvent(new Event('psnp-url-change'));
                return rv;
            };
            history.pushState = wrap(history.pushState);
            history.replaceState = wrap(history.replaceState);
            window.addEventListener('popstate', () => window.dispatchEvent(new Event('psnp-url-change')));
        })();

        function parseMinutes(text) {
            if (!text) return null;
            text = text.toLowerCase();
            const units = {
                year: 525600,
                month: 43200,
                week: 10080,
                day: 1440,
                hour: 60,
                minute: 1
            };
            let total = 0;
            for (const [unit, m] of Object.entries(units)) {
                const regex = new RegExp(`(\\d+)\\s*${unit}`, 'g');
                let match;
                while ((match = regex.exec(text)) !== null) total += parseInt(match[1], 10) * m;
            }
            return total || null;
        }

        function getEmojiFromTimes(top1, top2, top3, top48, top49, top50, top1Text) {
            const top50Final = (top50 !== null && top50 !== undefined) ? top50 :
                (top49 !== null && top49 !== undefined) ? top49 :
                top48;
            const topsUnder5 = [top1, top2, top3].filter(t => t && t < 10).length;
            const topsOver60 = [top1, top2, top3].filter(t => t && t > 60).length;
            if (!top1Text) return '❓';
            if (/(\d+\s*day|\d+\s*week|\d+\s*month|\d+\s*year|6\s*hours|7\s*hours|8\s*hours|9\s*hours|10\s*hours)/i.test(top1Text)) return '✅';
            if (topsUnder5 >= 1 && topsUnder5 <= 2 && topsOver60 >= 1 && top50Final && top50Final > 360) return '🤥';
            if ([top1, top2, top3, top50Final].every(t => t && t < 60)) return '🅰️';
            if ((top1 && top1 < 60) || (top50Final && top50Final < 360)) return '❌';
            if ([top1, top2, top3].every(t => t && t > 60) && (!top50Final || top50Final > 360)) return '✅';
            return '❓';
        }

        function fetch100ClubEmoji(slug, token = {}, maxRetries = 2) {
            return new Promise((resolve) => {
                if (token.cancelled) return resolve('❓');
                const url = `https://psnprofiles.com/100-club/${slug}`;
                let attempts = 0;

                const tryOnce = () => {
                    if (token.cancelled) return resolve('❓');
                    attempts++;
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url,
                        timeout: 8000,
                        onload(r) {
                            if (token.cancelled) return resolve('❓');
                            if (!r.responseText || r.status !== 200) {
                                if (attempts <= maxRetries) return setTimeout(tryOnce, 1000);
                                return resolve('⚠️');
                            }
                            try {
                                const doc = new DOMParser().parseFromString(r.responseText, 'text/html');
                                const sels = [
                                    'div.col-xs-4:nth-child(3) > table:nth-child(2) > tbody > tr:nth-child(1) > td:nth-child(4) > span > nobr',
                                    'div.col-xs-4:nth-child(3) > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(4) > span > nobr',
                                    'div.col-xs-4:nth-child(3) > table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(4) > span > nobr',
                                    'div.col-xs-4:nth-child(3) > table:nth-child(2) > tbody > tr:nth-child(48) > td:nth-child(4) > span > nobr',
                                    'div.col-xs-4:nth-child(3) > table:nth-child(2) > tbody > tr:nth-child(49) > td:nth-child(4) > span > nobr',
                                    'div.col-xs-4:nth-child(3) > table:nth-child(2) > tbody > tr:nth-child(50) > td:nth-child(4) > span > nobr'
                                ];
                                const times = sels.map(sel => {
                                    const el = doc.querySelector(sel);
                                    return el ? parseMinutes(el.textContent.trim()) : null;
                                });
                                const top1Text = doc.querySelector(sels[0])?.textContent.trim();
                                const emoji = getEmojiFromTimes(...times, top1Text);
                                if (token.cancelled) return resolve('❓');
                                resolve(emoji);
                            } catch (e) {
                                if (attempts <= maxRetries) return setTimeout(tryOnce, 1000);
                                resolve('⚠️');
                            }
                        },
                        ontimeout: () => {
                            if (attempts <= maxRetries) return setTimeout(tryOnce, 1000);
                            resolve('⚠️');
                        },
                        onerror: () => {
                            if (attempts <= maxRetries) return setTimeout(tryOnce, 1000);
                            resolve('⚠️');
                        }
                    });
                };

                tryOnce();
            });
        }

        function fetchTrophyScore(url, token = {}, maxRetries = 2) {
            return new Promise((resolve) => {
                if (token.cancelled) return resolve(0);
                let attempts = 0;

                const tryOnce = () => {
                    if (token.cancelled) return resolve(0);
                    attempts++;
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url,
                        timeout: 8000,
                        onload(r) {
                            if (token.cancelled) return resolve(0);
                            if (!r.responseText || r.status !== 200) {
                                if (attempts <= maxRetries) return setTimeout(tryOnce, 1000);
                                return resolve(0);
                            }
                            try {
                                const doc = new DOMParser().parseFromString(r.responseText, 'text/html');
                                const rows = doc.querySelectorAll('table.zebra tbody tr');
                                let total = 0;
                                for (const row of rows) {
                                    if (token.cancelled) return resolve(0);
                                    const img = row.querySelector('td span.separator.left img');
                                    const rarityEl = row.querySelector('td.hover-hide span.separator.rarity span.typo-bottom nobr');
                                    if (!img || !rarityEl) continue;
                                    const src = img.getAttribute('src') || '';
                                    const rarity = rarityEl.textContent.trim();
                                    const base = rarityWeights[rarity] ?? 0;
                                    const mult = Object.entries(trophyValuesByImage)
                                        .find(([k]) => src.includes(k))?.[1] ?? 0;
                                    total += base + mult;
                                }
                                if (token.cancelled) return resolve(0);
                                resolve(Math.round(total));
                            } catch (e) {
                                if (attempts <= maxRetries) return setTimeout(tryOnce, 1000);
                                resolve(0);
                            }
                        },
                        ontimeout: () => {
                            if (attempts <= maxRetries) return setTimeout(tryOnce, 1000);
                            resolve(0);
                        },
                        onerror: () => {
                            if (attempts <= maxRetries) return setTimeout(tryOnce, 1000);
                            resolve(0);
                        }
                    });
                };

                tryOnce();
            });
        }


        (function addSpinnerStyle() {
            if (document.querySelector('#psnp-spinner-style')) return;
            const s = document.createElement('style');
            s.id = 'psnp-spinner-style';
            s.textContent = `
      .psnp-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(0,0,0,0.2);
        border-top:2px solid #333; border-radius:50%; animation:psnp-spin .8s linear infinite; margin-left:6px; }
      @keyframes psnp-spin { to { transform: rotate(360deg); } }
    `;
            document.head.appendChild(s);
        })();

        function getUsername(url) {
            const m = url.match(/\/trophies\/[^\/]+\/([^\/?#]+)/);
            if (m && m[1]) return m[1];
            const header = document.querySelector('div.user-nav a.dropdown-toggle span');
            return header ? header.textContent.trim() : null;
        }

        async function processGameListsOnce(token = {}) {
            log('processGameListsOnce starting');
            const rows = document.querySelectorAll('table.zebra.list-table tbody tr');
            if (!rows.length) return warn('no rows found');

            const spans = [];
            for (const row of rows) {
                if (token.cancelled) return log('processGameListsOnce aborted early');

                const link = row.querySelector('td div.ellipsis span a.title');
                if (!link) continue;
                const url = link.href;
                const slug = url.match(/\/trophies\/([^\/]+)/)?.[1];

                let span = link.parentElement.querySelector('.psnp-gamelist-score');
                if (!span) {
                    span = document.createElement('span');
                    span.className = 'psnp-gamelist-score';
                    span.style.marginLeft = '8px';
                    span.style.transition = 'opacity 0.5s ease';
                    span.style.fontWeight = 'bold';
                    span.innerHTML = `<span class="psnp-spinner"></span>`;
                    link.parentElement.appendChild(span);
                }

                try {
                    const [total, unearned, emoji] = await Promise.all([
                        fetchTrophyScore(url, token),
                        fetchTrophyScore(`${url}?trophies=unearned`, token),
                        slug ? fetch100ClubEmoji(slug, token) : Promise.resolve('❓')
                    ]);
                    if (token.cancelled) return log('processGameListsOnce aborted mid-fetch');

                    span.dataset.total = total;
                    span.dataset.unearned = unearned;
                    span.dataset.emoji = emoji;
                    span.textContent = `${total}pts ${emoji}`;
                    spans.push(span);
                } catch (err) {
                    if (!token.cancelled) console.warn('[PSNP] process row error:', err);
                }
            }

            if (window.psnpFlipTimer) clearInterval(window.psnpFlipTimer);
            let showingUnearned = false;
            window.psnpFlipTimer = setInterval(() => {
                if (token.cancelled) return;
                showingUnearned = !showingUnearned;
                for (const s of spans) {
                    const total = parseInt(s.dataset.total) || 0;
                    const unearned = parseInt(s.dataset.unearned) || 0;
                    const emoji = s.dataset.emoji || '';

                    if (unearned === total) {
                        s.textContent = `${total}pts ${emoji}`;
                        s.style.textShadow = 'none';
                        s.style.webkitTextStroke = '0';
                        continue;
                    }

                    s.style.opacity = '0';
                    setTimeout(() => {
                        if (token.cancelled) return;
                        if (showingUnearned) {
                            s.textContent = `${unearned}pts ${emoji}`;
                            s.style.textShadow = '0 0 0.5px black, 0 0 1px black';
                            s.style.webkitTextStroke = '0.25px white';
                        } else {
                            s.textContent = `${total}pts ${emoji}`;
                            s.style.textShadow = 'none';
                            s.style.webkitTextStroke = '0';
                        }
                        s.style.opacity = '1';
                    }, 250);
                }
            }, 6000);

            log('processGameListsOnce finished');
        }

        (function installGameListWatcher() {
            let currentToken = null;
            let observer = null;
            let abortLock = false;

            async function abortPreviousIfAny() {
                if (!currentToken) return;
                console.log('[PSNP] Aborting previous run...');
                abortLock = true;
                currentToken.cancelled = true;
                await new Promise(r => setTimeout(r, 1000));
                currentToken = null;
                abortLock = false;
            }

            async function safeRefresh(reason) {
                console.log(`[PSNP] safeRefresh triggered by ${reason}`);

                while (abortLock) {
                    console.log('[PSNP] Waiting for abort lock to clear...');
                    await new Promise(r => setTimeout(r, 1000));
                }

                if (currentToken) {
                    await abortPreviousIfAny();
                }

                const token = {
                    cancelled: false
                };
                currentToken = token;

                try {
                    await processGameListsOnce(token);
                } catch (err) {
                    console.warn('[PSNP] safeRefresh error', err);
                } finally {
                    if (currentToken === token) currentToken = null;
                }
            }

            function initWatcher() {
                const dropdown = document.querySelector(
                    'html body.app div.flex div.width div#content.page.clearfix div div.form.box div.row div.col-xs-3 label.select select'
                );
                if (!dropdown) {
                    console.log('[PSNP] no dropdown found for watcher');
                    return;
                }

                dropdown.addEventListener('change', () => safeRefresh('dropdown change'));

                if (observer) observer.disconnect();
                observer = new MutationObserver((muts) => {
                    for (const mut of muts) {
                        if ([...mut.addedNodes].some((n) => n.nodeType === 1 && n.matches('table.zebra.list-table'))) {
                            safeRefresh('DOM change');
                            break;
                        }
                    }
                });
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                console.log('[PSNP] Game List watcher active');
                safeRefresh('initial run');
            }

            if (location.hash.endsWith('#gamelists')) {
                setTimeout(initWatcher, 2000);
            }

            window.addEventListener('psnp-url-change', () => {
                if (location.hash.endsWith('#gamelists')) setTimeout(initWatcher, 2000);
            });
        })();


        async function processSeriesOnce() {
            try {
                if (!location.pathname.startsWith('/series/')) return;
                log('processSeriesOnce starting');

                const tables = document.querySelectorAll('table.box, table.zebra');
                if (!tables.length) {
                    warn('no series tables found');
                    return;
                }

                const spans = [];

                for (const table of tables) {
                    const rows = table.querySelectorAll('tbody > tr');
                    if (!rows.length) continue;

                    for (let i = 0; i < rows.length; i++) {
                        try {
                            let tdSelector = 'td:nth-child(2)';
                            if (table.classList.contains('box') && i === 0)
                                tdSelector = 'td:nth-child(3)';

                            const row = rows[i];
                            const link = row.querySelector(`${tdSelector} a[href*='/trophies/']`);
                            if (!link) continue;

                            const trophyUrl = link.href;
                            const slugMatch = trophyUrl.match(/\/trophies\/([^\/]+)/);
                            const slug = slugMatch ? slugMatch[1] : null;

                            let span = row.querySelector('.psnp-series-score');
                            if (!span) {
                                span = document.createElement('span');
                                span.className = 'psnp-series-score';
                                span.style.marginLeft = '8px';
                                span.style.transition = 'opacity 0.5s ease';
                                span.style.fontWeight = 'bold';
                                span.innerHTML = `<span class="psnp-spinner" aria-hidden="true"></span>`;
                                link.parentElement.appendChild(span);
                            } else {
                                span.innerHTML = `<span class="psnp-spinner" aria-hidden="true"></span>`;
                            }

                            const [total, unearned, emoji] = await Promise.all([
                                fetchTrophyScore(trophyUrl),
                                fetchTrophyScore(`${trophyUrl}?trophies=unearned`),
                                slug ? fetch100ClubEmoji(slug) : Promise.resolve('❓')
                            ]);

                            span.dataset.total = total;
                            span.dataset.unearned = unearned;
                            span.dataset.emoji = emoji;
                            span.textContent = `${total}pts ${emoji}`;
                            spans.push(span);

                            log(`series updated ${slug || trophyUrl}: total=${total}, unearned=${unearned}, emoji=${emoji}`);
                        } catch (e) {
                            warn('series row error', e);
                        }
                    }
                }

                if (window.psnpSeriesFlipTimer) clearInterval(window.psnpSeriesFlipTimer);
                let showingUnearned = false;
                window.psnpSeriesFlipTimer = setInterval(() => {
                    showingUnearned = !showingUnearned;
                    for (const s of spans) {
                        const total = parseInt(s.dataset.total) || 0;
                        const unearned = parseInt(s.dataset.unearned) || 0;
                        const emoji = s.dataset.emoji || '';

                        if (unearned === total) {
                            s.textContent = `${total}pts ${emoji}`;
                            s.style.textShadow = 'none';
                            s.style.webkitTextStroke = '0';
                            continue;
                        }

                        s.style.opacity = '0';
                        setTimeout(() => {
                            if (showingUnearned) {
                                s.textContent = `${unearned}pts ${emoji}`;
                                s.style.textShadow = '0 0 0.5px black, 0 0 1px black';
                                s.style.webkitTextStroke = '0.25px white';
                            } else {
                                s.textContent = `${total}pts ${emoji}`;
                                s.style.textShadow = 'none';
                                s.style.webkitTextStroke = '0';
                            }
                            s.style.opacity = '1';
                        }, 250);
                    }
                }, 6000);

                log('processSeriesOnce finished');
            } catch (e) {
                err('processSeriesOnce top-level', e);
            }
        }


        let lastUrl = location.href;
        async function handleUrlChange(newUrl) {
            if (newUrl === lastUrl) return;
            lastUrl = newUrl;
            if (newUrl.includes('/series/')) setTimeout(processSeriesOnce, 800);
            if (newUrl.endsWith('#gamelists')) setTimeout(processGameListsOnce, 2000);
        }

        if (location.href.endsWith('#gamelists')) setTimeout(processGameListsOnce, 2000);
        if (location.pathname.startsWith('/series/')) setTimeout(processSeriesOnce, 800);

        window.addEventListener('psnp-url-change', () => handleUrlChange(location.href));

        // games/search page stuff

        (function psnpEnhancer() {
            const flipInterval = 6000;
            const fetchDelay = 1000;
            const spans = [];
            let flipTimer = null;

            function sleep(ms) {
                return new Promise(r => setTimeout(r, ms));
            }

            async function processRow(row, linkSelector, spanClass) {
                const link = row.querySelector(linkSelector);
                if (!link) return;

                const url = link.href;
                const slug = url.match(/\/trophies\/([^\/]+)/)?.[1];

                let span = row.querySelector(`.${spanClass}`);
                if (!span) {
                    span = document.createElement('span');
                    span.className = spanClass;
                    span.style.marginLeft = '8px';
                    span.style.transition = 'opacity 0.5s ease';
                    span.style.fontWeight = 'bold';
                    span.innerHTML = `<span class="psnp-spinner"></span>`;
                    link.parentElement.appendChild(span);
                } else {
                    span.innerHTML = `<span class="psnp-spinner"></span>`;
                }

                await sleep(fetchDelay);

                const [total, unearned, emoji] = await Promise.all([
                    fetchTrophyScore(url),
                    fetchTrophyScore(`${url}?trophies=unearned`),
                    slug ? fetch100ClubEmoji(slug) : Promise.resolve('❓')
                ]);

                span.dataset.total = total;
                span.dataset.unearned = unearned;
                span.dataset.emoji = emoji;
                span.textContent = `${total}pts ${emoji}`;
                spans.push(span);
            }

            async function processAllRows(rows, linkSelector, spanClass) {
                for (const row of rows) {
                    await processRow(row, linkSelector, spanClass);
                }

                if (flipTimer) clearInterval(flipTimer);

                let showingUnearned = false;
                flipTimer = setInterval(() => {
                    showingUnearned = !showingUnearned;
                    for (const s of spans) {
                        const total = parseInt(s.dataset.total) || 0;
                        const unearned = parseInt(s.dataset.unearned) || 0;
                        const emoji = s.dataset.emoji || '';
                        if (unearned === total) {
                            s.textContent = `${total}pts ${emoji}`;
                            s.style.textShadow = 'none';
                            s.style.webkitTextStroke = '0';
                            continue;
                        }
                        s.style.opacity = '0';
                        setTimeout(() => {
                            if (showingUnearned) {
                                s.textContent = `${unearned}pts ${emoji}`;
                                s.style.textShadow = '0 0 0.5px black, 0 0 1px black';
                                s.style.webkitTextStroke = '0.25px white';
                            } else {
                                s.textContent = `${total}pts ${emoji}`;
                                s.style.textShadow = 'none';
                                s.style.webkitTextStroke = '0';
                            }
                            s.style.opacity = '1';
                        }, 250);
                    }
                }, flipInterval);
            }

            const isSearchPage = location.pathname.startsWith('/search');
            const isGamesPage = document.querySelector(
                'html body.app div.flex div.width div#content.page.higher div.row div.col-xs-8 div.box table#game_list.zebra tbody tr'
            );

            if (isSearchPage) {
                let searchObserver = null;
                let debounceTimer = null;
                let cancelToken = {
                    canceled: false
                };
                let lastSearchKey = null;

                function scheduleSearchProcess() {
                    const currentSearchKey = document.querySelector('#search-bar')?.value || location.href;
                    if (currentSearchKey === lastSearchKey) return;
                    lastSearchKey = currentSearchKey;

                    cancelToken.canceled = true;
                    if (debounceTimer) clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(() => {
                        cancelToken = {
                            canceled: false
                        };
                        const rows = document.querySelectorAll('#search-results table.box.zebra tbody tr');
                        if (rows.length) processAllRows(rows, 'td a.title', 'psnp-search-score');
                    }, 1000);
                }

                function initSearchWatcher() {
                    scheduleSearchProcess();
                    if (searchObserver) searchObserver.disconnect();
                    searchObserver = new MutationObserver(scheduleSearchProcess);
                    searchObserver.observe(document.querySelector('#search-results') || document.body, {
                        childList: true,
                        subtree: true
                    });
                }

                setTimeout(initSearchWatcher, 500);
                window.addEventListener('psnp-url-change', () => setTimeout(initSearchWatcher, 500));
            }

            if (isGamesPage) {
                const rows = document.querySelectorAll(
                    'html body.app div.flex div.width div#content.page.higher div.row div.col-xs-8 div.box table#game_list.zebra tbody tr'
                );
                if (rows.length) {
                    processAllRows(rows, 'td div.ellipsis span a.title', 'psnp-game-score');
                }
            }
        })();


    })();

    (function() {
        "use strict";

        const contrib = [
            "Gnillisch",
            "Fysh_Taco",
            "PeeWee-ITFC"
        ];

        const Lord = "TGTzLord13";

        const shownGoat = new Set();

        function waitForElement(selector, timeout = 10000) {
            return new Promise(resolve => {
                const start = Date.now();

                const check = () => {
                    const el = document.querySelector(selector);
                    if (el) return resolve(el);

                    if (Date.now() - start >= timeout)
                        return resolve(null);

                    requestAnimationFrame(check);
                };

                check();
            });
        }

        function createEmojiSpan(emoji) {
            const span = document.createElement("span");
            span.textContent = ` ${emoji}`;
            span.style.opacity = "0";
            span.style.transition = "opacity 0.5s ease";
            span.style.fontSize = "1em";
            span.style.display = "inline";
            span.style.verticalAlign = "middle";
            return span;
        }

        async function applyProfileEmojis() {
            if (!location.pathname.match(/^\/[^\/]+$/)) return;

            const wrapper = await waitForElement(
                "div#user-bar .profile-bar .flex .grow .ellipsis"
            );
            if (!wrapper) return;

            const nameSpan = wrapper.querySelector("span");
            if (!nameSpan) return;

            const username = nameSpan.textContent.trim();

            if (username === Lord) {
                if (!nameSpan.querySelector(".psnp-crown")) {
                    const crown = document.createElement("span");
                    crown.className = "psnp-crown";
                    crown.textContent = " 👑";

                    Object.assign(crown.style, {
                        opacity: "0",
                        transition: "opacity 0.8s ease",
                        position: "relative",
                        top: "-2px"

                    });

                    nameSpan.appendChild(crown);

                    requestAnimationFrame(() => {
                        crown.style.opacity = "1";
                        crown.style.fontSize = "1.1em";

                    });
                }
            }

            if (contrib.includes(username) && !shownGoat.has(username)) {
                shownGoat.add(username);

                const goat = document.createElement("span");
                goat.className = "psnp-goat";
                goat.textContent = " 🐐";

                Object.assign(goat.style, {
                    opacity: "0",
                    transition: "opacity 0.6s ease",
                    position: "relative",
                    top: "-1px"
                });

                nameSpan.appendChild(goat);

                requestAnimationFrame(() => {
                    goat.style.opacity = "1";
                });

                setTimeout(() => {
                    goat.style.opacity = "0";
                }, 2000);

                setTimeout(() => {
                    if (goat.parentNode) goat.remove();
                }, 5000);
            }
        }

        window.addEventListener("load", applyProfileEmojis);
        window.addEventListener("psnp-url-change", applyProfileEmojis);
    })();

})();