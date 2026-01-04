// ==UserScript==
// @name         TorrentBD Seedbonus Gift
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Gift seedbonus to user torrents
// @author       cornu
// @match        https://www.torrentbd.net/account-details.php*
// @license      MIT
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561019/TorrentBD%20Seedbonus%20Gift.user.js
// @updateURL https://update.greasyfork.org/scripts/561019/TorrentBD%20Seedbonus%20Gift.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        baseUrl: location.origin,
        requestDelay: 250
    };

    function saveGiftAmount(amount) {
        try {
            localStorage.setItem('torrentbd_gift_amount', amount);
        } catch (e) {}
    }

    function loadGiftAmount() {
        try {
            return localStorage.getItem('torrentbd_gift_amount') || '1000';
        } catch (e) {
            return '1000';
        }
    }

    let isGifting = false;
    let giftingStats = {
        processed: 0,
        successful: 0,
        skipped: 0,
        totalSeedbonus: 0,
        repsAdded: 0,
        thanksAdded: 0
    };

    const urlParams = new URLSearchParams(window.location.search);
    const currentUserId = urlParams.get('id');
    let uiVisible = false;
    let manualLinksMode = false;
    let manualTorrents = [];

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function logMessage(message) {
        const progressInfo = document.getElementById('progress-info');
        if (progressInfo) {
            progressInfo.textContent = message;
        }
    }

    function extractTorrentLinks(text) {
        if (!text || !text.trim()) return [];
        const lines = text.trim().split('\n');
        const torrents = [];
        const torrentIdPattern = /torrents-details\.php\?id=(\d+)/g;
        lines.forEach((line) => {
            const cleanLine = line.replace(/^\s*\d+[\.)]\s*/, '').trim();
            let match;
            torrentIdPattern.lastIndex = 0;
            while ((match = torrentIdPattern.exec(cleanLine)) !== null) {
                const torrentId = match[1];
                if (!torrents.find(t => t.id === torrentId)) {
                    torrents.push({
                        id: torrentId,
                        name: `Torrent ${torrentId}`,
                        url: `torrents-details.php?id=${torrentId}`
                    });
                }
            }
        });
        return torrents;
    }

    function toggleManualMode() {
        const manualSection = document.getElementById('manual-links-section');
        const autoSection = document.getElementById('auto-section');
        const manualToggle = document.getElementById('manual-mode-toggle');
        if (manualToggle.checked) {
            manualSection.style.display = 'block';
            autoSection.style.display = 'none';
            manualLinksMode = true;
        } else {
            manualSection.style.display = 'none';
            autoSection.style.display = 'block';
            manualLinksMode = false;
            manualTorrents = [];
        }
    }

    function processManualLinks() {
        const linksTextarea = document.getElementById('manual-links-input');
        const text = linksTextarea.value;
        manualTorrents = extractTorrentLinks(text);
        const countElement = document.getElementById('manual-links-count');
        if (countElement) {
            countElement.textContent = `${manualTorrents.length} torrent(s) found`;
            countElement.style.color = manualTorrents.length > 0 ? '#27ae60' : '#e74c3c';
        }
    }

    function waitForTorrentsTab() {
        return new Promise((resolve) => {
            const torrentsSection = document.getElementById('torrents');
            if (torrentsSection && torrentsSection.offsetParent !== null) {
                resolve();
                return;
            }

            const torrentsTab = document.querySelector('a[href="#torrents"]');
            if (torrentsTab) {
                torrentsTab.click();
                const checkLoaded = () => {
                    const section = document.getElementById('torrents');
                    const rows = section ? section.querySelectorAll('tbody tr') : [];
                    if (rows.length > 0) {
                        resolve();
                    } else if (isGifting) {
                        setTimeout(checkLoaded, 200);
                    } else {
                        resolve();
                    }
                };
                setTimeout(checkLoaded, 300);
            } else {
                resolve();
            }
        });
    }

    function getTorrentsFromCurrentPage() {
        const torrents = [];
        const selectors = [
            '#torrents a[href*="torrents-details.php?id="]',
            '#torrents tbody tr a[href*="torrents-details.php"]'
        ];

        for (const selector of selectors) {
            const links = document.querySelectorAll(selector);
            if (links.length > 0) {
                links.forEach(link => {
                    const href = link.getAttribute('href');
                    const name = link.textContent.trim();
                    if (href && name && href.includes('torrents-details.php?id=')) {
                        const match = href.match(/id=(\d+)/);
                        if (match) {
                            const torrentId = match[1];
                            if (!torrents.find(t => t.id === torrentId)) {
                                torrents.push({
                                    id: torrentId,
                                    name: name,
                                    url: href
                                });
                            }
                        }
                    }
                });
                break;
            }
        }
        return torrents;
    }

    function navigateToNextPage() {
        return new Promise((resolve) => {
            let nextButton = null;
            const buttons = document.querySelectorAll('.aj-paginator');
            for (const button of buttons) {
                const text = button.textContent.toLowerCase();
                const title = button.getAttribute('title');
                const titleLower = title ? title.toLowerCase() : '';
                const classes = button.className.toLowerCase();

                if ((text.includes('next') || text.includes('>') || text.includes('»') || titleLower.includes('next'))
                    && !classes.includes('disabled') && !button.disabled) {
                    nextButton = button;
                    break;
                }
            }

            if (nextButton) {
                const currentUrl = window.location.href;
                const currentTorrents = getTorrentsFromCurrentPage();

                nextButton.click();

                let checkAttempts = 0;
                const maxAttempts = 20;

                const checkPageChanged = () => {
                    checkAttempts++;

                    if (window.location.href !== currentUrl) {
                        setTimeout(() => resolve(true), 200);
                        return;
                    }

                    const newTorrents = getTorrentsFromCurrentPage();
                    if (newTorrents.length > 0 && currentTorrents.length > 0) {
                        if (newTorrents[0].id !== currentTorrents[0].id) {
                            resolve(true);
                            return;
                        }
                    }

                    if (checkAttempts < maxAttempts && isGifting) {
                        setTimeout(checkPageChanged, 250);
                    } else {
                        resolve(false);
                    }
                };

                setTimeout(checkPageChanged, 500);
            } else {
                resolve(false);
            }
        });
    }

    async function giftSeedbonus(torrentId, customAmount) {
        const mainAddRepCheckbox = document.getElementById('add-rep');
        const shouldAddReputation = mainAddRepCheckbox && mainAddRepCheckbox.checked;
        const mainAddThanksCheckbox = document.getElementById('add-thanks');
        const shouldAddThanks = mainAddThanksCheckbox && mainAddThanksCheckbox.checked;
        const giftSBCheckbox = document.getElementById('gift-sb');
        const shouldGiftSB = giftSBCheckbox && giftSBCheckbox.checked;
        const giftAmount = customAmount || 5000;
        const origin = CONFIG.baseUrl;

        let repAdded = false;
        let thanksAdded = false;
        let giftSuccess = false;
        let actualGiftAmount = 0;

        try {
            if (shouldAddReputation) {
                try {
                    const repEndpoint = String.fromCharCode(61, 105, ...[63, 112, 104, 112, 46], ...[112, 55, 101, 111, 114, 134, 100, 73, 100, 90, 97, 89, 106, 77, 97].map((t, e) => e % 2 == 0 ? t : 96)).split("").reverse().join("").split("`").join("");
                    const repResponse = await fetch(`${origin}/${repEndpoint}${torrentId}`);
                    const repData = await repResponse.json();
                    if (repData.success) repAdded = true;
                } catch (e) {}
            }

            if (shouldAddThanks) {
                try {
                    const thanksEndpoint = ["p", "h", "p", ".", "k", "n", "a", "h", "t", "j", "a"].reverse().join("");
                    const thanksResponse = await fetch(`${origin}/${thanksEndpoint}?i=${torrentId}`);
                    const thanksData = await thanksResponse.json();
                    if (thanksData.success) thanksAdded = true;
                } catch (e) {}
            }

            if (shouldGiftSB) {
                try {
                    const giftEndpoint = String.fromCharCode(...[-2, 15, 16, 2, 5, 3, 6, -3].reverse().map(t => t + 100));
                    const giftResponse = await fetch(`${origin}/${giftEndpoint}.php?t=${torrentId}&a=${giftAmount}`);
                    const giftText = await giftResponse.text();
                    if (giftText.includes("gifted")) {
                        const match = giftText.match(/<h6 id='sbgift-success' class='center white-text'>(\d+)\s/);
                        if (match) {
                            actualGiftAmount = parseInt(match[1]);
                            giftSuccess = true;
                        }
                    }
                } catch (e) {}
            }
        } catch (error) {}

        return {
            success: giftSuccess,
            amount: actualGiftAmount,
            repAdded: repAdded,
            thanksAdded: thanksAdded
        };
    }

    async function processPageTorrents(torrents, customAmount, isManual = false) {
        if (torrents.length === 0) return;

        logMessage(`Processing ${torrents.length} torrents on this page...`);

        if (isManual) {
            const promises = torrents.map(async (torrent, index) => {
                await sleep(index * CONFIG.requestDelay);
                if (!isGifting) return;

                giftingStats.processed++;
                updateUI();

                const result = await giftSeedbonus(torrent.id, customAmount);

                const giftSBCheckbox = document.getElementById('gift-sb');
                const shouldGiftSB = giftSBCheckbox && giftSBCheckbox.checked;
                const addRepCheckbox = document.getElementById('add-rep');
                const shouldAddRep = addRepCheckbox && addRepCheckbox.checked;
                const addThanksCheckbox = document.getElementById('add-thanks');
                const shouldAddThanks = addThanksCheckbox && addThanksCheckbox.checked;

                if (result.repAdded) giftingStats.repsAdded++;
                if (result.thanksAdded) giftingStats.thanksAdded++;
                if (result.success) giftingStats.totalSeedbonus += result.amount;

                let actionSuccessful = false;
                let logMsg = '';

                if (shouldGiftSB) {
                    if (result.success) {
                        actionSuccessful = true;
                        logMsg = `✓ ${giftingStats.successful + 1} - ${result.amount} SB`;
                    }
                } else if (shouldAddRep) {
                    if (result.repAdded) {
                        actionSuccessful = true;
                        logMsg = `✓ ${giftingStats.successful + 1} - Rep added`;
                    }
                } else if (shouldAddThanks) {
                    if (result.thanksAdded) {
                        actionSuccessful = true;
                        logMsg = `✓ ${giftingStats.successful + 1} - Thanks added`;
                    }
                }

                if (actionSuccessful) {
                    giftingStats.successful++;
                    logMessage(logMsg);
                } else {
                    giftingStats.skipped++;
                }

                updateUI();
            });

            await Promise.all(promises);
        } else {
            for (const torrent of torrents) {
                if (!isGifting) break;

                giftingStats.processed++;
                updateUI();

                const result = await giftSeedbonus(torrent.id, customAmount);

                const giftSBCheckbox = document.getElementById('gift-sb');
                const shouldGiftSB = giftSBCheckbox && giftSBCheckbox.checked;
                const addRepCheckbox = document.getElementById('add-rep');
                const shouldAddRep = addRepCheckbox && addRepCheckbox.checked;
                const addThanksCheckbox = document.getElementById('add-thanks');
                const shouldAddThanks = addThanksCheckbox && addThanksCheckbox.checked;

                if (result.repAdded) giftingStats.repsAdded++;
                if (result.thanksAdded) giftingStats.thanksAdded++;
                if (result.success) giftingStats.totalSeedbonus += result.amount;

                let actionSuccessful = false;
                let logMsg = '';

                if (shouldGiftSB) {
                    if (result.success) {
                        actionSuccessful = true;
                        logMsg = `✓ ${giftingStats.successful + 1} - ${result.amount} SB`;
                    }
                } else if (shouldAddRep) {
                    if (result.repAdded) {
                        actionSuccessful = true;
                        logMsg = `✓ ${giftingStats.successful + 1} - Rep added`;
                    }
                } else if (shouldAddThanks) {
                    if (result.thanksAdded) {
                        actionSuccessful = true;
                        logMsg = `✓ ${giftingStats.successful + 1} - Thanks added`;
                    }
                }

                if (actionSuccessful) {
                    giftingStats.successful++;
                    logMessage(logMsg);
                } else {
                    giftingStats.skipped++;
                }

                updateUI();
                await sleep(CONFIG.requestDelay);
            }
        }
    }

    function hideSummary() {
        const existingSummary = document.getElementById('gifting-summary');
        if (existingSummary) {
            existingSummary.style.display = 'none';
        }
    }

    function showStats() {
        const statsSection = document.getElementById('stats');
        if (statsSection) {
            statsSection.style.display = 'block';
        }
    }

    function hideStats() {
        const statsSection = document.getElementById('stats');
        if (statsSection) {
            statsSection.style.display = 'none';
        }
    }

    async function startGifting(targetAmount) {
        if (isGifting) return;
        if (!currentUserId) return;
        if (manualLinksMode && manualTorrents.length === 0) {
            logMessage('No valid torrent links found');
            return;
        }

        const customAmountSelect = document.getElementById('gift-amount-select');
        const customAmount = customAmountSelect ? parseInt(customAmountSelect.value) : 1000;
        const giftSBCheckbox = document.getElementById('gift-sb');
        const shouldGiftSB = giftSBCheckbox && giftSBCheckbox.checked;
        const addRepCheckbox = document.getElementById('add-rep');
        const shouldAddRep = addRepCheckbox && addRepCheckbox.checked;
        const addThanksCheckbox = document.getElementById('add-thanks');
        const shouldAddThanks = addThanksCheckbox && addThanksCheckbox.checked;

        let targetMetric = 'none';
        if (shouldGiftSB) {
            targetMetric = 'gifts';
        } else if (shouldAddRep) {
            targetMetric = 'reps';
        } else if (shouldAddThanks) {
            targetMetric = 'thanks';
        }

        if (targetMetric === 'none') {
            logMessage('Please enable at least one action (Rep/Thanks/Gift SB)');
            return;
        }

        hideSummary();
        showStats();

        isGifting = true;
        giftingStats = {
            processed: 0,
            successful: 0,
            skipped: 0,
            totalSeedbonus: 0,
            repsAdded: 0,
            thanksAdded: 0
        };
        updateUI();
        logMessage('Starting...');

        try {
            if (manualLinksMode) {
                await processPageTorrents(manualTorrents, customAmount, true);
            } else {
                await waitForTorrentsTab();
                await sleep(1000);

                let currentPage = 1;
                let targetMet = 0;

                while (isGifting) {
                    logMessage(`Processing page ${currentPage}...`);
                    const pageTorrents = getTorrentsFromCurrentPage();
                    if (pageTorrents.length === 0) break;

                    for (const torrent of pageTorrents) {
                        if (!isGifting) break;
                        if (targetAmount !== -1 && targetMet >= targetAmount) break;

                        giftingStats.processed++;
                        updateUI();

                        const result = await giftSeedbonus(torrent.id, customAmount);

                        if (result.repAdded) giftingStats.repsAdded++;
                        if (result.thanksAdded) giftingStats.thanksAdded++;
                        if (result.success) giftingStats.totalSeedbonus += result.amount;

                        let actionSuccessful = false;
                        let logMsg = '';

                        if (shouldGiftSB) {
                            if (result.success) {
                                actionSuccessful = true;
                                if (targetMetric === 'gifts') targetMet++;
                                logMsg = `✓ ${giftingStats.successful + 1} - ${result.amount} SB`;
                            }
                        } else if (shouldAddRep) {
                            if (result.repAdded) {
                                actionSuccessful = true;
                                if (targetMetric === 'reps') targetMet++;
                                logMsg = `✓ ${giftingStats.successful + 1} - Rep added`;
                            }
                        } else if (shouldAddThanks) {
                            if (result.thanksAdded) {
                                actionSuccessful = true;
                                if (targetMetric === 'thanks') targetMet++;
                                logMsg = `✓ ${giftingStats.successful + 1} - Thanks added`;
                            }
                        }

                        if (actionSuccessful) {
                            giftingStats.successful++;
                            logMessage(logMsg);
                        } else {
                            giftingStats.skipped++;
                        }

                        updateUI();
                        await sleep(CONFIG.requestDelay);
                    }

                    if (targetAmount !== -1 && targetMet >= targetAmount) break;

                    const hasNext = await navigateToNextPage();
                    if (hasNext) {
                        currentPage++;
                        await sleep(1000);
                    } else {
                        break;
                    }
                }
            }

            finishGifting();
        } catch (error) {
            finishGifting();
        }
    }

    function finishGifting() {
        isGifting = false;
        updateUI();
        logMessage('Completed!');
        hideStats();
        showSummary();
    }

    function addGiftButton() {
        const actionContainer = document.querySelector('.pr-action-container');
        if (!actionContainer || document.getElementById('gift-button')) return;

        const giftButton = document.createElement('a');
        giftButton.id = 'gift-button';
        giftButton.className = 'btn-floating btn waves-effect waves-light';
        giftButton.href = '#';
        giftButton.title = 'Gift Seedbonus';
        giftButton.style.backgroundColor = '#6c3483';
        giftButton.innerHTML = '<i class="material-icons small">card_giftcard</i>';

        giftButton.addEventListener('click', function(e) {
            e.preventDefault();
            toggleGifterUI();
        });

        actionContainer.appendChild(giftButton);
    }

    function toggleGifterUI() {
        const container = document.getElementById('torrentbd-gifter');
        if (container) {
            if (uiVisible) {
                container.style.display = 'none';
                uiVisible = false;
            } else {
                container.style.display = 'block';
                uiVisible = true;
            }
        } else {
            createUI();
            uiVisible = true;
        }
    }

    function createUI() {
        if (!currentUserId) return;
        const existingContainer = document.getElementById('torrentbd-gifter');
        if (existingContainer) {
            existingContainer.remove();
        }

        const container = document.createElement('div');
        container.id = 'torrentbd-gifter';
        container.style.cssText = `position: fixed;top: 80px;right: 20px;width: 320px;background: linear-gradient(135deg, #1a1a1a, #2d2d2d);color: #e0e0e0;padding: 0;border-radius: 8px;box-shadow: 0 8px 32px rgba(0,0,0,0.4);border: 1px solid #333;z-index: 10000;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size: 12px;max-height: 85vh;overflow: hidden;`;

        container.innerHTML = `<div style="display: flex;justify-content: space-between;align-items: center;padding: 12px;border-bottom: 1px solid #404040;background: linear-gradient(135deg, #2a2a2a, #1a1a1a);border-radius: 8px 8px 0 0;"><div style="display: flex; align-items: center; font-size: 13px; font-weight: 600; color: #8e44ad;"><img src="https://www.torrentbd.net/images/seedbonus-icon-1.png" alt="Gift Icon" style="width: 14px; height: 14px; vertical-align: middle; margin-right: 4px;">Gifter</div><button id="close-gifter" style="background: none;border: none;color: #999;font-size: 16px;cursor: pointer;padding: 2px 4px;border-radius: 3px;line-height: 1;transition: background 0.2s;" onmouseover="this.style.background='#444'" onmouseout="this.style.background='none'">×</button></div><div style="padding: 12px; max-height: calc(85vh - 60px); overflow-y: auto;"><div id="auto-section" style="margin-bottom: 8px;"><div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;"><label style="font-size: 11px; color: #ccc;">Target:</label><input type="number" id="gift-target" min="1" value="10" style="width: 50px;height: 16px;border: none;border-bottom: 1px solid #555;background: transparent;color: #e0e0e0;font-size: 11px;padding: 0px 2px;padding-top: 4px;outline: none;text-align: center;line-height: 12px;margin-top: 1px;box-sizing: content-box;"></div></div><div id="gift-amount-container" style="margin-bottom: 8px;"><div style="display: flex; align-items: center; gap: 8px;"><label style="font-size: 12px; color: #ccc; min-width: 55px;"> Gift Amount :</label><select id="gift-amount-select" style="flex: 1;background: #333;color: #e0e0e0;border: 1px solid #555;border-radius: 4px;padding: 4px 8px;font-size: 11px;cursor: pointer;outline: none;display: block;box-sizing: border-box;appearance: menulist;-webkit-appearance: menulist;-moz-appearance: menulist;height: 28px;line-height: 1;"><option value="50">50 SB</option><option value="100">100 SB</option><option value="500">500 SB</option><option value="1000">1000 SB</option><option value="5000">5000 SB</option></select></div></div><div style="display:grid;gap:6px;margin-bottom:8px;"><div class="tbdaio-row"><span>Add reputation</span><label class="tbdaio-switch"><input type="checkbox" id="add-rep"><span class="tbdaio-slider"></span></label></div><div class="tbdaio-row"><span>Thank uploader</span><label class="tbdaio-switch"><input type="checkbox" id="add-thanks"><span class="tbdaio-slider"></span></label></div><div class="tbdaio-row"><span>Gift seedbonus</span><label class="tbdaio-switch"><input type="checkbox" id="gift-sb" checked><span class="tbdaio-slider"></span></label></div></div><div class="tbdaio-row" style="margin-bottom: 8px;"><span style="font-size: 11px; font-weight: 500;">Manual Mode</span><label class="tbdaio-switch"><input type="checkbox" id="manual-mode-toggle"><span class="tbdaio-slider"></span></label></div><div id="manual-links-section" style="display: none; margin-bottom: 12px;"><div style="margin-bottom: 8px;"><label style="font-size: 11px; color: #ccc; margin-bottom: 4px; display: block;">Torrent Links</label><textarea id="manual-links-input" placeholder="One link per line" style="width: 100%;height: 80px;background: #222;border: 1px solid #444;color: #e0e0e0;border-radius: 4px;padding: 6px;font-size: 10px;resize: vertical;box-sizing: border-box;"></textarea></div><div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;"><button id="process-links" style="background: #4a90e2;color: white;border: none;padding: 4px 8px;border-radius: 3px;font-size: 10px;cursor: pointer;">Process Links</button><span id="manual-links-count" style="font-size: 10px; color: #888;">0 torrent(s) found</span></div></div><div style="display: grid; gap: 4px; margin-bottom: 8px;"><button id="start-gifting" style="width: 100%; padding: 6px; background: linear-gradient(135deg, #27ae60, #2ecc71); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 500; transition: all 0.2s;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">Start Gifting</button><button id="stop-gifting" style="width: 100%; padding: 6px; background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 500; display: none;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">Stop</button></div><div id="progress-info" style="font-size: 10px; color: #aaa; margin-bottom: 8px; padding: 4px; background: #222; border-radius: 3px; border-left: 3px solid #6c3483; min-height: 14px; line-height: 1.2;">Ready to start...</div><div id="stats" style="padding: 6px; background: #1f1f1f; border-radius: 4px; border: 1px solid #3a3a3a;"><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 10px;"><div>Processed: <span id="stat-processed" style="color: #4a90e2; font-weight: 500;">0</span></div><div>Success: <span id="stat-successful" style="color: #27ae60; font-weight: 500;">0</span></div><div>Skipped: <span id="stat-skipped" style="color: #f39c12; font-weight: 500;">0</span></div><div>Total SB: <span id="stat-total" style="color: #e67e22; font-weight: 500;">0</span></div></div></div></div>`;

        document.body.appendChild(container);

        const style = document.createElement('style');
        style.id = 'tbdaio-style-gifter';
        style.textContent = `.tbdaio-row{display:flex;align-items:center;justify-content:space-between;background:#333;padding:6px 8px;border-radius:4px;}.tbdaio-switch{position:relative;display:inline-block;width:36px;height:20px;flex:0 0 auto}.tbdaio-switch input{opacity:0;width:0;height:0}.tbdaio-slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:#666;border-radius:12px;transition:background .2s}.tbdaio-slider:before{position:absolute;content:"";height:14px;width:14px;left:3px;top:3px;background:white;border-radius:50%;transition:transform .2s}.tbdaio-switch input:checked + .tbdaio-slider{background:#6c3483}.tbdaio-switch input:checked + .tbdaio-slider:before{transform:translateX(16px)}#gift-amount-select option{background:#333;color:#e0e0e0;padding:4px;}`;
        container.appendChild(style);

        const startButton = document.getElementById('start-gifting');
        const stopButton = document.getElementById('stop-gifting');
        const targetInput = document.getElementById('gift-target');
        const manualToggle = document.getElementById('manual-mode-toggle');
        const processLinksBtn = document.getElementById('process-links');
        const manualLinksInput = document.getElementById('manual-links-input');
        const giftSBCheckbox = document.getElementById('gift-sb');
        const giftAmountContainer = document.getElementById('gift-amount-container');
        const closeButton = document.getElementById('close-gifter');
        const giftAmountSelect = document.getElementById('gift-amount-select');

        manualToggle.addEventListener('change', toggleManualMode);
        processLinksBtn.addEventListener('click', processManualLinks);

        giftSBCheckbox.addEventListener('change', function() {
            if (this.checked) {
                giftAmountContainer.style.display = 'block';
            } else {
                giftAmountContainer.style.display = 'none';
            }
        });

        let processTimeout;
        manualLinksInput.addEventListener('input', function() {
            clearTimeout(processTimeout);
            processTimeout = setTimeout(processManualLinks, 500);
        });

        startButton.addEventListener('click', function() {
            if (manualLinksMode) {
                if (manualTorrents.length === 0) {
                    alert('Please add some torrent links first');
                    return;
                }
                startGifting(-1);
            } else {
                const target = parseInt(targetInput.value);
                if (isNaN(target) || target < 1) {
                    alert('Please enter a valid target number');
                    return;
                }
                startGifting(target);
            }
        });

        stopButton.addEventListener('click', function() {
            isGifting = false;
            logMessage('Stopping...');
            updateUI();
        });

        closeButton.addEventListener('click', function() {
            container.style.display = 'none';
            uiVisible = false;
        });

        const savedAmount = loadGiftAmount();
        if (giftAmountSelect) {
            giftAmountSelect.value = savedAmount;
        }

        giftAmountSelect.addEventListener('change', function() {
            saveGiftAmount(this.value);
        });
    }

    function updateUI() {
        const startButton = document.getElementById('start-gifting');
        const stopButton = document.getElementById('stop-gifting');
        if (!startButton) return;
        if (isGifting) {
            startButton.style.display = 'none';
            stopButton.style.display = 'block';
        } else {
            startButton.style.display = 'block';
            stopButton.style.display = 'none';
        }

        const statElements = {
            'stat-processed': giftingStats.processed,
            'stat-successful': giftingStats.successful,
            'stat-skipped': giftingStats.skipped,
            'stat-total': giftingStats.totalSeedbonus
        };

        Object.keys(statElements).forEach(id => {
            const elem = document.getElementById(id);
            if (elem) {
                elem.textContent = statElements[id];
            }
        });
    }

    function showSummary() {
        const existingSummary = document.getElementById('gifting-summary');
        if (existingSummary) {
            existingSummary.style.display = 'block';
            existingSummary.innerHTML = `<div style="text-align: center; font-weight: bold; color: #e67e22; margin-bottom: 8px; font-size: 12px;">🎁 GIFTING SUMMARY 🎁</div><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 10px;"><div style="background: #2d2d2d; padding: 6px; border-radius: 4px; border-left: 3px solid #3498db;"><div style="color: #888; font-size: 9px;">Processed</div><div style="color: #3498db; font-weight: bold; font-size: 14px;">${giftingStats.processed}</div></div><div style="background: #2d2d2d; padding: 6px; border-radius: 4px; border-left: 3px solid #27ae60;"><div style="color: #888; font-size: 9px;">Successful</div><div style="color: #27ae60; font-weight: bold; font-size: 14px;">${giftingStats.successful}</div></div><div style="background: #2d2d2d; padding: 6px; border-radius: 4px; border-left: 3px solid #e67e22;"><div style="color: #888; font-size: 9px;">Skipped</div><div style="color: #e67e22; font-weight: bold; font-size: 14px;">${giftingStats.skipped}</div></div><div style="background: #2d2d2d; padding: 6px; border-radius: 4px; border-left: 3px solid #9b59b6;"><div style="color: #888; font-size: 9px;">Total SB Gifted</div><div style="color: #9b59b6; font-weight: bold; font-size: 14px;">${giftingStats.totalSeedbonus}</div></div><div style="background: #2d2d2d; padding: 6px; border-radius: 4px; border-left: 3px solid #e74c3c;"><div style="color: #888; font-size: 9px;">Reps Added</div><div style="color: #e74c3c; font-weight: bold; font-size: 14px;">${giftingStats.repsAdded}</div></div><div style="background: #2d2d2d; padding: 6px; border-radius: 4px; border-left: 3px solid #16a085;"><div style="color: #888; font-size: 9px;">Thanks Added</div><div style="color: #16a085; font-weight: bold; font-size: 14px;">${giftingStats.thanksAdded}</div></div></div>`;
            return;
        }

        const summaryDiv = document.createElement('div');
        summaryDiv.id = 'gifting-summary';
        summaryDiv.style.cssText = `margin-top: 12px;padding: 12px;background: linear-gradient(135deg, #1f1f1f, #2a2a2a);border-radius: 6px;border: 2px solid #6c3483;font-family: 'Courier New', monospace;font-size: 11px;color: #e0e0e0;`;

        summaryDiv.innerHTML = `<div style="text-align: center; font-weight: bold; color: #e67e22; margin-bottom: 8px; font-size: 12px;">🎁 GIFTING SUMMARY 🎁</div><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 10px;"><div style="background: #2d2d2d; padding: 6px; border-radius: 4px; border-left: 3px solid #3498db;"><div style="color: #888; font-size: 9px;">Processed</div><div style="color: #3498db; font-weight: bold; font-size: 14px;">${giftingStats.processed}</div></div><div style="background: #2d2d2d; padding: 6px; border-radius: 4px; border-left: 3px solid #27ae60;"><div style="color: #888; font-size: 9px;">Successful</div><div style="color: #27ae60; font-weight: bold; font-size: 14px;">${giftingStats.successful}</div></div><div style="background: #2d2d2d; padding: 6px; border-radius: 4px; border-left: 3px solid #e67e22;"><div style="color: #888; font-size: 9px;">Skipped</div><div style="color: #e67e22; font-weight: bold; font-size: 14px;">${giftingStats.skipped}</div></div><div style="background: #2d2d2d; padding: 6px; border-radius: 4px; border-left: 3px solid #9b59b6;"><div style="color: #888; font-size: 9px;">Total SB Gifted</div><div style="color: #9b59b6; font-weight: bold; font-size: 14px;">${giftingStats.totalSeedbonus}</div></div><div style="background: #2d2d2d; padding: 6px; border-radius: 4px; border-left: 3px solid #e74c3c;"><div style="color: #888; font-size: 9px;">Reps Added</div><div style="color: #e74c3c; font-weight: bold; font-size: 14px;">${giftingStats.repsAdded}</div></div><div style="background: #2d2d2d; padding: 6px; border-radius: 4px; border-left: 3px solid #16a085;"><div style="color: #888; font-size: 9px;">Thanks Added</div><div style="color: #16a085; font-weight: bold; font-size: 14px;">${giftingStats.thanksAdded}</div></div></div>`;

        const progressInfo = document.getElementById('progress-info');
        if (progressInfo && progressInfo.parentNode) {
            progressInfo.parentNode.insertBefore(summaryDiv, progressInfo.nextSibling);
        }
    }

    function waitForElement(selector, callback, maxAttempts = 50) {
        let attempts = 0;
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element || attempts >= maxAttempts) {
                clearInterval(interval);
                if (element) callback();
            }
            attempts++;
        }, 100);
    }

    function init() {
        if (window.location.href.includes('account-details.php') && currentUserId) {
            const tryAddButton = () => {
                if (document.querySelector('.pr-action-container')) {
                    addGiftButton();
                } else {
                    waitForElement('.pr-action-container', addGiftButton);
                }
            };

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', tryAddButton);
            } else {
                tryAddButton();
            }
        }
    }

    init();
})();