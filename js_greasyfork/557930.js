// ==UserScript==
// @name         Norsko - bandy a fLorbal
// @namespace    http://tampermonkey.net/
// @version      6.2
// @description  Překliky do detailů pro Norské bandy a florbal
// @author       Michal
// @license      MIT
// @match        https://bandyforbundet.no/tournament/bandy/
// @match        https://bandyforbundet.no/tournament/floorball/
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557930/Norsko%20-%20bandy%20a%20fLorbal.user.js
// @updateURL https://update.greasyfork.org/scripts/557930/Norsko%20-%20bandy%20a%20fLorbal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SPORTS_CONFIG = {
        bandy: {
            name: 'Bandy',
            sourceUrl: 'https://bandyforbundet.no/bandy/?page_id=6321#/sport/151/season/201066/region/439446/tournament/439465/tab/0',
            baseUrl: 'https://bandyforbundet.no/bandy/?page_id=6321#/'
        },
        floorball: {
            name: 'Floorball',
            sourceUrl: 'https://bandyforbundet.no/innebandy/?page_id=15828#/sport/72/season/201065/region/439506/tournament/440904/tab/0',
            baseUrl: 'https://bandyforbundet.no/innebandy/?page_id=15828#/'
        }
    };

    const SELECTORS = {
        agRoot: '.ag-root',
        agRow: '.ag-row',
        viewport: '.ag-body-viewport',
        dateCol: '[col-id="displayShortDate"]',
        timeCol: '[col-id="displayTime"]',
        teamsCol: '[col-id="tournamentHomeTeamName"]',
        streamCol: '[col-id="hasStreaming"]',
        venueCol: '[col-id="activityAreaName"]',
        homeTeam: '.home-team .team-name',
        awayTeam: '.away-team .team-name'
    };

    const TIMING = {
        gridWait: 1500,
        scrollDelay: 150,
        finalWait: 200,
        maxIterations: 25,
        stableThreshold: 3,
        timeout: 10000
    };

    const getCurrentSport = () => {
        const path = window.location.pathname;
        return path.includes('/floorball') ? 'floorball' : 'bandy';
    };

    const config = SPORTS_CONFIG[getCurrentSport()];

    const injectStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            * { box-sizing: border-box; }
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #fff; }
            .container { max-width: 1000px; margin: 0 auto; }
            .header { margin-bottom: 20px; }
            h1 { margin: 0 0 5px 0; font-size: 24px; font-weight: normal; color: #000; }
            .subtitle { margin: 0 0 15px 0; font-size: 14px; color: #666; }
            .nav { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #000; }
            .nav a { display: inline-block; padding: 8px 16px; margin-right: 10px; color: #000;
                     text-decoration: none; border: 1px solid #000; }
            .nav a:hover { background: #000; color: #fff; }
            .nav a.active { background: #000; color: #fff; }
            .loading { padding: 40px; text-align: center; color: #666; }
            .match-list { border-top: 1px solid #000; }
            .match-item { border-bottom: 1px solid #ddd; padding: 15px 0; display: block;
                          color: #000; text-decoration: none; cursor: pointer; }
            .match-item:hover { background: #f5f5f5; }
            .match-date-time { font-size: 13px; color: #666; margin-bottom: 8px; }
            .match-teams { font-size: 16px; margin-bottom: 5px; }
            .match-venue { font-size: 13px; color: #666; }
            .stream { display: inline; margin-left: 10px; color: #000; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;
                      font-size: 12px; color: #999; text-align: center; }
        `;
        document.head.appendChild(style);
    };

    const createPageLayout = () => {
        document.body.innerHTML = '';
        injectStyles();

        const container = document.createElement('div');
        container.className = 'container';

        const currentSport = getCurrentSport();
        const otherSport = currentSport === 'bandy' ? 'floorball' : 'bandy';

        container.innerHTML = `
            <div class="header">
                <h1>${config.name} - Nadcházející zápasy</h1>
                <p class="subtitle">Norges Bandyforbund</p>
            </div>
            <div class="nav">
                ${Object.entries(SPORTS_CONFIG).map(([key, sport]) => `
                    <a href="/tournament/${key}" class="${key === currentSport ? 'active' : ''}">
                        ${sport.name}
                    </a>
                `).join('')}
            </div>
            <div id="loading" class="loading">Načítám...</div>
        `;

        document.body.appendChild(container);
        return container;
    };

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const waitForElement = (doc, selector, timeout = TIMING.timeout) => {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkInterval = setInterval(() => {
                const element = doc.querySelector(selector);
                if (element) {
                    clearInterval(checkInterval);
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(checkInterval);
                    reject(new Error(`Element not found: ${selector}`));
                }
            }, 100);
        });
    };

    const scrollViewport = async (doc) => {
        const viewport = doc.querySelector(SELECTORS.viewport);
        if (!viewport) return;

        let previousCount = 0;
        let stableIterations = 0;

        for (let i = 0; i < TIMING.maxIterations; i++) {
            viewport.scrollTop = viewport.scrollHeight;
            await sleep(TIMING.scrollDelay);

            viewport.scrollTop = 0;
            await sleep(TIMING.scrollDelay);

            const currentCount = doc.querySelectorAll(SELECTORS.agRow).length;

            if (currentCount === previousCount) {
                stableIterations++;
                if (stableIterations >= TIMING.stableThreshold) break;
            } else {
                stableIterations = 0;
                previousCount = currentCount;
            }
        }

        viewport.scrollTop = 0;
        await sleep(TIMING.finalWait);
    };

    const extractMatchData = (row) => {
        const getText = (selector) => row.querySelector(selector)?.textContent?.trim() || '';
        const getAttr = (selector, attr) => row.querySelector(selector)?.getAttribute(attr);

        const teamsCell = row.querySelector(SELECTORS.teamsCol);
        const homeTeam = teamsCell?.querySelector(SELECTORS.homeTeam)?.textContent?.trim();
        const awayTeam = teamsCell?.querySelector(SELECTORS.awayTeam)?.textContent?.trim();
        const matchLink = teamsCell?.querySelector('a')?.getAttribute('href');
        const youtubeLink = row.querySelector(SELECTORS.streamCol)?.querySelector('a')?.getAttribute('href');

        return {
            date: getText(SELECTORS.dateCol),
            time: getText(SELECTORS.timeCol),
            homeTeam: homeTeam || '',
            awayTeam: awayTeam || '',
            matchLink: matchLink ? config.baseUrl + matchLink.substring(2) : null,
            youtubeLink: youtubeLink || null,
            venue: getText(SELECTORS.venueCol) || 'Není uvedeno'
        };
    };

    const extractMatches = (doc) => {
        const rows = Array.from(doc.querySelectorAll(SELECTORS.agRow));
        return rows
            .map(row => {
                try {
                    return extractMatchData(row);
                } catch (error) {
                    console.error('Row parsing error:', error);
                    return null;
                }
            })
            .filter(match => match && match.homeTeam && match.awayTeam);
    };

    const loadMatches = () => {
        return new Promise((resolve, reject) => {
            const iframe = document.createElement('iframe');
            iframe.style.cssText = 'position: absolute; left: -9999px; width: 1200px; height: 800px;';
            iframe.src = config.sourceUrl;

            const cleanup = () => {
                if (iframe.parentNode) {
                    document.body.removeChild(iframe);
                }
            };

            iframe.onload = async () => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                    await waitForElement(iframeDoc, SELECTORS.agRoot);
                    await sleep(TIMING.gridWait);
                    await scrollViewport(iframeDoc);

                    const matches = extractMatches(iframeDoc);
                    cleanup();
                    resolve(matches);
                } catch (error) {
                    cleanup();
                    reject(error);
                }
            };

            iframe.onerror = () => {
                cleanup();
                reject(new Error('Iframe loading failed'));
            };

            document.body.appendChild(iframe);
        });
    };

    const createMatchItem = (match) => {
        const item = document.createElement('a');
        item.className = 'match-item';
        item.href = '#';

        item.addEventListener('click', (e) => {
            e.preventDefault();
            if (match.matchLink) {
                window.history.pushState(null, '', match.matchLink);
            }
        });

        item.innerHTML = `
            <div class="match-date-time">${match.date} v ${match.time}</div>
            <div class="match-teams">
                <strong>${match.homeTeam}</strong> vs <strong>${match.awayTeam}</strong>
                ${match.youtubeLink ? '<span class="stream">[Live stream]</span>' : ''}
            </div>
            <div class="match-venue">${match.venue}</div>
        `;

        return item;
    };

    const renderMatches = (matches) => {
        const loading = document.getElementById('loading');
        if (loading) loading.remove();

        const container = document.querySelector('.container');
        const list = document.createElement('div');
        list.className = 'match-list';

        const fragment = document.createDocumentFragment();
        matches.forEach(match => {
            fragment.appendChild(createMatchItem(match));
        });
        list.appendChild(fragment);

        const footer = document.createElement('div');
        footer.className = 'footer';
        footer.textContent = `Celkem ${matches.length} zápasů`;

        container.appendChild(list);
        container.appendChild(footer);
    };

    const showError = (message) => {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.innerHTML = `<p style="color: #999;">${message}</p>`;
        }
    };

    const init = async () => {
        createPageLayout();

        try {
            const matches = await loadMatches();

            if (matches.length === 0) {
                showError('Nebyly nalezeny žádné zápasy');
                return;
            }

            renderMatches(matches);
        } catch (error) {
            console.error('Initialization error:', error);
            showError(`Chyba při načítání: ${error.message}`);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();