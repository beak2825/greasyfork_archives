// ==UserScript==
// @name         ASStars Анализатор Трейдов (Поиск Твинов)
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Анализирует историю трейдов, выявляет подозрительную активность и предоставляет полный отчет по каждому пользователю.
// @author       Gemini AI (по просьбе Jerichorpg)
// @match        https://animestars.org/trades/history*
// @grant        GM_addStyle
// @license Admin
// @downloadURL https://update.greasyfork.org/scripts/557663/ASStars%20%D0%90%D0%BD%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%82%D0%BE%D1%80%20%D0%A2%D1%80%D0%B5%D0%B9%D0%B4%D0%BE%D0%B2%20%28%D0%9F%D0%BE%D0%B8%D1%81%D0%BA%20%D0%A2%D0%B2%D0%B8%D0%BD%D0%BE%D0%B2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557663/ASStars%20%D0%90%D0%BD%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%82%D0%BE%D1%80%20%D0%A2%D1%80%D0%B5%D0%B9%D0%B4%D0%BE%D0%B2%20%28%D0%9F%D0%BE%D0%B8%D1%81%D0%BA%20%D0%A2%D0%B2%D0%B8%D0%BD%D0%BE%D0%B2%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- НАСТРОЙКИ ---
    const FETCH_DELAY = 400;

    // --- НАСТРОЙКИ ФОРМУЛЫ ---
    const PROBABILITY_MIDPOINT = 7;
    const PROBABILITY_STEEPNESS = 0.35;
    const PROBABILITY_CEILING = 95;

    let isFetching = false;
    let cachedTrades = [];
    let cardDataCache = {};

    // --- СТИЛИ ИНТЕРФЕЙСА ---
    GM_addStyle(`
        #trade-analyzer-toggle-btn { position: fixed; bottom: 200px; left: 20px; z-index: 10000; background-color: #c0392b; color: white; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; border: none; font-size: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        #trade-analyzer-toggle-btn:hover { background-color: #e74c3c; transform: scale(1.1); }
        #trade-analyzer-overlay, #ta-details-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); z-index: 10001; display: none; }
        #trade-analyzer-container, #ta-details-container { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 900px; max-width: 95vw; max-height: 90vh; background-color: #2c2f33; border: 1px solid #9e294f; border-radius: 8px; z-index: 10002; color: #dcddde; box-shadow: 0 4px 15px rgba(0,0,0,0.5); display: none; font-family: sans-serif; flex-direction: column; }
        .ta-header { padding: 10px 15px; background-color: #1e2124; border-bottom: 1px solid #4f545c; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
        .ta-header h2 { margin: 0; font-size: 1.1em; }
        .ta-close-btn { cursor: pointer; font-size: 1.5em; font-weight: bold; user-select: none; }
        .ta-body { padding: 15px; display: flex; flex-direction: column; gap: 10px; flex-shrink: 0;}
        .ta-button-row { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 10px; }
        .ta-body button { padding: 10px; background-color: #9e294f; color: white; border: none; border-radius: 5px; font-size: 1em; cursor: pointer; transition: background-color 0.2s; }
        .ta-body button:hover:not(:disabled) { background-color: #7a1f3d; }
        .ta-body button:disabled { background-color: #555; cursor: not-allowed; opacity: 0.7; }
        #ta-load-btn { background-color: #27ae60; }
        #ta-load-btn:hover:not(:disabled) { background-color: #2ecc71; }
        #ta-export-btn { background-color: #2980b9; }
        #ta-export-btn:hover:not(:disabled) { background-color: #3498db; }
        #ta-status { font-size: 0.9em; text-align: center; color: #aaa; min-height: 1.2em; }
        #ta-results-container { overflow-y: auto; padding: 0 15px 15px; flex: 1; }
        #ta-results-table { width: 100%; border-collapse: collapse; font-size: 0.9em; }
        #ta-results-table th, #ta-results-table td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #4f545c; }
        #ta-results-table th { background-color: #1e2124; white-space: nowrap; }
        #ta-results-table td:first-child a.ta-details-link { color: #87CEEB; text-decoration: none; font-weight: bold; cursor: pointer; }
        #ta-results-table td:first-child a.ta-details-link:hover { text-decoration: underline; }
        .s-flow-positive { color: #e74c3c; font-weight: bold; }
        .flow-positive { color: #27ae60; font-weight: bold; }
        .flow-negative { color: #e74c3c; font-weight: bold; }
        .ta-prob-bar-container { background-color: #1e2124; border-radius: 5px; overflow: hidden; width: 100%; height: 20px; position: relative; }
        .ta-prob-bar { height: 100%; width: 0%; border-radius: 5px; transition: width 0.5s ease-in-out; }
        .ta-prob-text { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; text-shadow: 1px 1px 2px rgba(0,0,0,0.7); }
        #ta-details-container { z-index: 10003; }
        #ta-details-overlay { z-index: 10002; }

        /* --- СТИЛИ ДЛЯ КОМБИНИРОВАННОГО ОКНА --- */
        #ta-details-body { padding: 10px 15px 15px; flex: 1; overflow-y: auto; }
        #ta-details-body h3 { margin: 20px 0 10px 0; padding-bottom: 5px; border-bottom: 1px solid #4f545c; font-size: 1.1em; color: #ccc; }
        #ta-details-body h3:first-of-type { margin-top: 0; }
        .ta-section-divider { border: 0; border-top: 2px solid #4f545c; margin: 20px 0; }
        .ta-transit-item { border: 1px solid #4f545c; border-radius: 8px; margin-bottom: 15px; background-color: #1e2124; }
        .ta-transit-bridge { display: flex; align-items: center; justify-content: center; padding: 8px; gap: 10px; background-color: #111; font-weight: bold; }
        .ta-transit-bridge img { width: 40px; height: auto; border-radius: 4px; }
        .ta-transit-bridge .arrow { font-size: 1.2em; color: #888; }
        .ta-transit-trades-wrapper { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background-color: #4f545c; }
        .ta-trade-context { background-color: #2c2f33; padding: 10px; }
        .ta-trade-header { font-size: 0.9em; color: #aaa; margin-bottom: 8px; border-bottom: 1px solid #4f545c; padding-bottom: 5px; }
        .ta-trade-header a, .ta-transit-bridge a { color: #87CEEB; text-decoration: none; }
        .ta-trade-header a:hover, .ta-transit-bridge a:hover { text-decoration: underline; }
        .ta-history-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 10px; }
        .ta-history-item { border: 1px solid #4f545c; border-radius: 6px; background-color: #1e2124; }
        .ta-history-header { padding: 8px 12px; font-weight: bold; color: #ccc; border-bottom: 1px solid #4f545c; font-size: 0.9em; }
        .ta-history-body { display: flex; flex-direction: column; padding: 10px; gap: 10px; }
        .ta-cards-flow { display: flex; align-items: flex-start; gap: 8px; margin-top: 5px; }
        .ta-cards-flow .icon { width: 20px; height: 20px; line-height: 20px; text-align: center; border-radius: 50%; color: white; flex-shrink: 0; font-size: 16px; }
        .ta-cards-flow .icon-plus { background-color: #27ae60; }
        .ta-cards-flow .icon-minus { background-color: #c0392b; }
        .ta-cards-container { display: flex; flex-wrap: wrap; gap: 5px; }
        .ta-cards-container img { width: 50px; height: auto; border-radius: 4px; }
        .highlighted-card { border: 2px solid #f39c12; box-shadow: 0 0 10px #f39c12; }
    `);

    function createUI() {
        const toggleButton = document.createElement('button');
        toggleButton.id = 'trade-analyzer-toggle-btn';
        toggleButton.innerHTML = '💾';
        toggleButton.title = 'Анализатор Трейдов';
        document.body.appendChild(toggleButton);

        const overlay = document.createElement('div');
        overlay.id = 'trade-analyzer-overlay';
        document.body.appendChild(overlay);

        const container = document.createElement('div');
        container.id = 'trade-analyzer-container';
        container.innerHTML = `
            <div class="ta-header">
                <h2>Анализ трейдов на предмет твинов</h2>
                <span class="ta-close-btn">&times;</span>
            </div>
            <div class="ta-body">
                <div class="ta-button-row">
                    <button id="ta-scan-btn">Начать сканирование и анализ</button>
                    <button id="ta-load-btn">Загрузить из файла</button>
                    <button id="ta-export-btn" disabled>Экспорт в файл</button>
                </div>
                <div id="ta-status">Готов к работе. Версия 2.4</div>
            </div>
            <div id="ta-results-container">
                <table id="ta-results-table"></table>
            </div>
        `;
        document.body.appendChild(container);

        const detailsOverlay = document.createElement('div');
        detailsOverlay.id = 'ta-details-overlay';
        document.body.appendChild(detailsOverlay);

        const detailsContainer = document.createElement('div');
        detailsContainer.id = 'ta-details-container';
        detailsContainer.innerHTML = `
            <div class="ta-header">
                <h2 id="ta-details-title">Детали трейдов</h2>
                <span class="ta-close-btn">&times;</span>
            </div>
            <div id="ta-details-body"></div>
        `;
        document.body.appendChild(detailsContainer);

        toggleButton.addEventListener('click', togglePanel);
        overlay.addEventListener('click', togglePanel);
        container.querySelector('.ta-close-btn').addEventListener('click', togglePanel);
        detailsOverlay.addEventListener('click', toggleDetailsPanel);
        detailsContainer.querySelector('.ta-close-btn').addEventListener('click', toggleDetailsPanel);
        container.querySelector('#ta-scan-btn').addEventListener('click', startScanAndAnalysis);
        container.querySelector('#ta-load-btn').addEventListener('click', importData);
        container.querySelector('#ta-export-btn').addEventListener('click', exportData);
    }

    function togglePanel() {
        const overlay = document.getElementById('trade-analyzer-overlay');
        const container = document.getElementById('trade-analyzer-container');
        const isVisible = container.style.display === 'flex';
        container.style.display = isVisible ? 'none' : 'flex';
        overlay.style.display = isVisible ? 'none' : 'block';
    }

    function toggleDetailsPanel() {
        const overlay = document.getElementById('ta-details-overlay');
        const container = document.getElementById('ta-details-container');
        const isVisible = container.style.display === 'flex';
        container.style.display = isVisible ? 'none' : 'flex';
        overlay.style.display = isVisible ? 'none' : 'block';
    }

    function parseCardElement(cardElement) {
        const link = cardElement.href;
        const img = cardElement.querySelector('img');
        if (!link || !img) return null;
        const idMatch = link.match(/id=(\d+)/);
        const cardId = idMatch ? idMatch[1] : null;
        if (!cardId) return null;
        if (!cardDataCache[cardId]) {
            const imageSource = img.dataset.src || img.src;
            const rankMatch = imageSource.match(/\/cards_image\/\d+\/([sabcdef])\//i);
            cardDataCache[cardId] = {
                rank: rankMatch ? rankMatch[1].toUpperCase() : 'UNKNOWN',
                imgSrc: imageSource
            };
        }
        return { id: cardId, rank: cardDataCache[cardId].rank };
    }

    function parsePageForTrades(htmlText) {
        const doc = new DOMParser().parseFromString(htmlText, 'text/html');
        const tradeItems = doc.querySelectorAll('.history__item');
        const trades = [];
        if (tradeItems.length === 0) return { trades: [], isLastPage: true };
        tradeItems.forEach(item => {
            const partnerLink = item.querySelector('.history__name a');
            const dateElement = item.querySelector('.history__date');
            if (!partnerLink || !dateElement) return;
            const partnerName = partnerLink.textContent.trim();
            const date = dateElement.textContent.trim();
            const gainedCards = Array.from(item.querySelectorAll('.history__body--gained .history__body-item')).map(parseCardElement).filter(Boolean);
            const lostCards = Array.from(item.querySelectorAll('.history__body--lost .history__body-item')).map(parseCardElement).filter(Boolean);
            trades.push({ partnerName, gainedCards, lostCards, date });
        });
        const nextPageLink = doc.querySelector('.pagination__pages-btn a[href*="page/"]');
        return { trades, isLastPage: !nextPageLink };
    }

    function analyzeTrades(tradesToAnalyze) {
        if (tradesToAnalyze.length === 0) return [];
        const partnerData = {};
        const cardRankMap = {};
        const parseDate = (dateString) => { const [datePart] = dateString.split(' '); const [day, month, year] = datePart.split('.'); return new Date(year, month - 1, day); };

        tradesToAnalyze.forEach(trade => {
            const tradeDate = parseDate(trade.date);
            const { partnerName, gainedCards, lostCards } = trade;
            if (!partnerData[partnerName]) {
                partnerData[partnerName] = { cardsGiven: {}, cardsReceived: {}, totalTrades: 0, minDate: tradeDate, maxDate: tradeDate };
            }
            partnerData[partnerName].totalTrades++;
            if (tradeDate < partnerData[partnerName].minDate) partnerData[partnerName].minDate = tradeDate;
            if (tradeDate > partnerData[partnerName].maxDate) partnerData[partnerName].maxDate = tradeDate;
            [...lostCards, ...gainedCards].forEach(card => { if (card.id && !cardRankMap[card.id]) cardRankMap[card.id] = card.rank; });
            lostCards.forEach(card => { if (card.id) partnerData[partnerName].cardsGiven[card.id] = (partnerData[partnerName].cardsGiven[card.id] || 0) + 1; });
            gainedCards.forEach(card => { if (card.id) partnerData[partnerName].cardsReceived[card.id] = (partnerData[partnerName].cardsReceived[card.id] || 0) + 1; });
        });

        const finalResults = [];
        for (const partnerName in partnerData) {
            const data = partnerData[partnerName];
            const netCardsGiven = { ...data.cardsGiven };
            const netCardsReceived = { ...data.cardsReceived };

            for (const cardId in netCardsGiven) {
                if (netCardsReceived[cardId]) {
                    const loanedAmount = Math.min(netCardsGiven[cardId], netCardsReceived[cardId]);
                    netCardsGiven[cardId] -= loanedAmount;
                    netCardsReceived[cardId] -= loanedAmount;
                }
            }

            let netSFlow = 0;
            Object.keys(netCardsGiven).forEach(id => { if (netCardsGiven[id] > 0 && cardRankMap[id] === 'S') netSFlow += netCardsGiven[id]; });
            Object.keys(netCardsReceived).forEach(id => { if (netCardsReceived[id] > 0 && cardRankMap[id] === 'S') netSFlow -= netCardsReceived[id]; });
            // --- НОВЫЙ БЛОК ---
            // Считаем общее количество S-карт в обмене, чтобы оценить активность
            let sCardsTraded = 0;
            for (const cardId in data.cardsGiven) {
                if (cardRankMap[cardId] === 'S') {
                    sCardsTraded += data.cardsGiven[cardId];
                }
            }
            for (const cardId in data.cardsReceived) {
                if (cardRankMap[cardId] === 'S') {
                    sCardsTraded += data.cardsReceived[cardId];
                }
            }

            const netGivenTotal = Object.values(netCardsGiven).reduce((a, b) => a + b, 0);
            const netReceivedTotal = Object.values(netCardsReceived).reduce((a, b) => a + b, 0);
            const substantiveCardExchanges = netGivenTotal + netReceivedTotal; // Для формулы
            const cardImbalance = netReceivedTotal - netGivenTotal; // Для отображения

            const timeDiff = data.maxDate - data.minDate;
            const days = Math.max(1, timeDiff / (1000 * 60 * 60 * 24));
            const avgTradesPerDay = parseFloat((data.totalTrades / days).toFixed(2));

            let twinProbability = 0;
            if (netSFlow > 0) {
                twinProbability = 95 + (netSFlow - 1);
            } else if (substantiveCardExchanges > 0) {
                twinProbability = PROBABILITY_CEILING / (1 + Math.exp(-PROBABILITY_STEEPNESS * (substantiveCardExchanges - PROBABILITY_MIDPOINT)));
            }

            finalResults.push({ partnerName, totalTrades: data.totalTrades, cardImbalance, avgTradesPerDay, netSFlow, sCardsTraded, twinProbability: Math.min(99, Math.round(twinProbability)) });
        }

        return finalResults
            .filter(res => res.cardImbalance !== 0 || res.netSFlow !== 0 || res.sCardsTraded > 0)
            .sort((a, b) => b.twinProbability - a.twinProbability);
    }

    function displayResults(results) {
        const resultsTable = document.getElementById('ta-results-table');
        resultsTable.innerHTML = `
            <thead>
                <tr>
                    <th>Пользователь</th>
                    <th>Всего трейдов</th>
                    <th>Сред. трейдов/день</th>
                    <th>Итоговый дисбаланс (карт)</th>
                    <th>Чистый отток (S)</th>
                    <th style="width: 200px;">Вероятность (твин) %</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        const tbody = resultsTable.querySelector('tbody');
        if (results.length === 0) { tbody.innerHTML = `<tr><td colspan="6">Нет данных для анализа или все трейды сбалансированы.</td></tr>`; return; }

        results.forEach(res => {
            const prob = res.twinProbability;
            let barColor;
            if (prob < 15) barColor = '#27ae60';
            else if (prob < 40) barColor = '#f39c12';
            else if (prob < 75) barColor = '#e67e22';
            else barColor = '#c0392b';

            const tr = document.createElement('tr');
            const imbalanceSign = res.cardImbalance > 0 ? '+' : '';
            const imbalanceClass = res.cardImbalance > 0 ? 'flow-positive' : res.cardImbalance < 0 ? 'flow-negative' : '';

            tr.innerHTML = `
                <td><a class="ta-details-link">${res.partnerName}</a></td>
                <td>${res.totalTrades}</td>
                <td>${res.avgTradesPerDay}</td>
                <td class="${imbalanceClass}">${imbalanceSign}${res.cardImbalance}</td>
                <td class="${res.netSFlow > 0 ? 's-flow-positive' : ''}">${res.netSFlow > 0 ? '+' : ''}${res.netSFlow}</td>
                <td>
                    <div class="ta-prob-bar-container">
                         <div class="ta-prob-bar" style="width: ${prob}%; background-color: ${barColor};"></div>
                         <div class="ta-prob-text">${prob}%</div>
                    </div>
                </td>
            `;
            tr.querySelector('.ta-details-link').addEventListener('click', () => showTradeDetails(res.partnerName, cachedTrades));
            tbody.appendChild(tr);
        });
    }

    function showTradeDetails(partnerName, allTrades) {
        document.getElementById('ta-details-title').textContent = `Полный отчет по трейдам с ${partnerName}`;
        const detailsBody = document.getElementById('ta-details-body');
        detailsBody.innerHTML = '';

        const parseFullDate = (dateString) => {
            const [datePart, timePart] = dateString.split(' ');
            const [day, month, year] = datePart.split('.');
            return new Date(`${year}-${month}-${day}T${timePart || '00:00:00'}`);
        };

        let transitHtml = '<h3>Анализ транзитных карт</h3>';
        const transitData = [];
        const availableAcquisitions = [];
        allTrades.forEach(trade => {
            trade.gainedCards.forEach(card => { availableAcquisitions.push({ cardId: card.id, trade: trade, used: false }); });
        });
        const giveTrades = allTrades.filter(t => t.partnerName === partnerName && t.lostCards.length > 0).sort((a, b) => parseFullDate(a.date) - parseFullDate(b.date));

        giveTrades.forEach(giveTrade => {
            const dateGiven = parseFullDate(giveTrade.date);
            giveTrade.lostCards.forEach(lostCard => {
                const potentialMatch = availableAcquisitions
                    .filter(acq => acq.cardId === lostCard.id && !acq.used && parseFullDate(acq.trade.date) < dateGiven)
                    .sort((a, b) => parseFullDate(b.trade.date) - parseFullDate(a.trade.date))[0];
                if (potentialMatch) {
                    transitData.push({ cardId: lostCard.id, tradeIn: potentialMatch.trade, tradeOut: giveTrade });
                    potentialMatch.used = true;
                }
            });
        });

        transitData.sort((a, b) => parseFullDate(b.tradeOut.date) - parseFullDate(a.tradeOut.date));

        if (transitData.length === 0) {
            transitHtml += `<p style="text-align:center; padding: 10px;">Не найдено карт, которые были получены от других и затем переданы этому пользователю.</p>`;
        } else {
            const generateTradeContextHtml = (trade, highlightedCardId) => {
                const createLinks = (cards) => cards.map(card => {
                    const info = cardDataCache[card.id];
                    const highlightClass = (card.id === highlightedCardId) ? ' class="highlighted-card"' : '';
                    return `<a href="/cards/users/?id=${card.id}" target="_blank"><img src="${info ? info.imgSrc : ''}" title="ID: ${card.id}"${highlightClass}></a>`;
                }).join('') || '<span>-</span>';
                return `<div class="ta-cards-flow"><div class="icon icon-plus">+</div><div class="ta-cards-container">${createLinks(trade.gainedCards)}</div></div><div class="ta-cards-flow"><div class="icon icon-minus">-</div><div class="ta-cards-container">${createLinks(trade.lostCards)}</div></div>`;
            };
            transitData.forEach(transit => {
                const cardInfo = cardDataCache[transit.cardId];
                transitHtml += `<div class="ta-transit-item"><div class="ta-transit-bridge"><a href="/user/${transit.tradeIn.partnerName}/" target="_blank">${transit.tradeIn.partnerName}</a><span class="arrow">→</span><a href="/cards/users/?id=${transit.cardId}" target="_blank"><img src="${cardInfo ? cardInfo.imgSrc : ''}" title="ID: ${transit.cardId}"></a><span class="arrow">→</span><a href="/user/${transit.tradeOut.partnerName}/" target="_blank">${transit.tradeOut.partnerName}</a></div><div class="ta-transit-trades-wrapper"><div class="ta-trade-context"><div class="ta-trade-header"><strong>Получено от <a href="/user/${transit.tradeIn.partnerName}/" target="_blank">${transit.tradeIn.partnerName}</a></strong><br><small>${transit.tradeIn.date}</small></div>${generateTradeContextHtml(transit.tradeIn, transit.cardId)}</div><div class="ta-trade-context"><div class="ta-trade-header"><strong>Отдано <a href="/user/${transit.tradeOut.partnerName}/" target="_blank">${transit.tradeOut.partnerName}</a></strong><br><small>${transit.tradeOut.date}</small></div>${generateTradeContextHtml(transit.tradeOut, transit.cardId)}</div></div></div>`;
            });
        }

        let historyHtml = '<h3>Полная история обменов</h3>';
        const partnerTrades = allTrades
            .filter(t => t.partnerName === partnerName)
            .sort((a, b) => parseFullDate(b.date) - parseFullDate(a.date));

        if (partnerTrades.length === 0) {
            historyHtml += `<p style="text-align: center; padding: 10px;">Нет данных о трейдах с этим пользователем.</p>`;
        } else {
            let historyItemsHtml = '';
            partnerTrades.forEach(trade => {
                const gainedCardsHtml = trade.gainedCards.map(c => `<a href="/cards/users/?id=${c.id}" target="_blank"><img src="${cardDataCache[c.id] ? cardDataCache[c.id].imgSrc : ''}" title="ID: ${c.id}"></a>`).join('') || '<span>-</span>';
                const lostCardsHtml = trade.lostCards.map(c => `<a href="/cards/users/?id=${c.id}" target="_blank"><img src="${cardDataCache[c.id] ? cardDataCache[c.id].imgSrc : ''}" title="ID: ${c.id}"></a>`).join('') || '<span>-</span>';
                historyItemsHtml += `<div class="ta-history-item"><div class="ta-history-header">${trade.date}</div><div class="ta-history-body"><div class="ta-cards-flow"><div class="icon icon-plus">+</div><div class="ta-cards-container">${gainedCardsHtml}</div></div><div class="ta-cards-flow"><div class="icon icon-minus">-</div><div class="ta-cards-container">${lostCardsHtml}</div></div></div></div>`;
            });
            historyHtml += `<div class="ta-history-grid">${historyItemsHtml}</div>`;
        }

        detailsBody.innerHTML = transitHtml + '<hr class="ta-section-divider">' + historyHtml;
        toggleDetailsPanel();
    }

    function runAnalysisAndDisplay(trades) {
        const statusEl = document.getElementById('ta-status');
        statusEl.textContent = `Анализ ${trades.length} трейдов...`;
        const analysisData = analyzeTrades(trades);
        displayResults(analysisData);
        statusEl.textContent = 'Готово!';
    }

    async function startScanAndAnalysis() {
        if (isFetching) return;
        isFetching = true;
        const scanBtn = document.getElementById('ta-scan-btn');
        const statusEl = document.getElementById('ta-status');
        scanBtn.disabled = true;
        scanBtn.textContent = 'Идёт сканирование...';
        document.getElementById('ta-results-table').innerHTML = '';
        statusEl.textContent = 'Подготовка...';
        cachedTrades = [];
        cardDataCache = {};

        let page = 1;
        const requestUrl = new URL(window.location.href);
        const basePath = requestUrl.pathname.split('/page/')[0];

        while (true) {
            const pageUrl = new URL(requestUrl.origin + basePath);
            requestUrl.searchParams.forEach((value, key) => pageUrl.searchParams.set(key, value));
            pageUrl.pathname = (pageUrl.pathname.endsWith('/') ? pageUrl.pathname : pageUrl.pathname + '/') + `page/${page}/`;
            statusEl.textContent = `[Страница ${page}] Сканирование...`;
            try {
                const response = await fetch(pageUrl.toString());
                if (!response.ok) { statusEl.textContent = `Сканирование завершено на стр. ${page-1}. (Статус: ${response.status})`; break; }
                const htmlText = await response.text();
                const pageData = parsePageForTrades(htmlText);

                // --- ЛОГИРОВАНИЕ В КОНСОЛЬ ---
                console.group(`[Trade Analyzer] Сканирование страницы ${page}`);
                if (pageData.trades.length > 0) {
                    pageData.trades.forEach((trade, index) => {
                        console.log(`[Трейд ${index + 1}] Пользователь: ${trade.partnerName}, Получено: ${trade.gainedCards.length}, Отдано: ${trade.lostCards.length}`, trade);
                    });
                } else {
                    console.warn('Трейды на странице не найдены.');
                }
                console.groupEnd();
                // --- КОНЕЦ ЛОГИРОВАНИЯ ---

                if (pageData.trades.length === 0) { statusEl.textContent = `Сканирование завершено. На стр. ${page} нет трейдов.`; break; }
                cachedTrades.push(...pageData.trades);
                if (pageData.isLastPage) { statusEl.textContent = `Сканирование завершено. Всего ${page} страниц.`; break; }
                page++;
            } catch (error) { statusEl.textContent = `Ошибка на странице ${page}.`; break; }
            await new Promise(resolve => setTimeout(resolve, FETCH_DELAY));
        }

        runAnalysisAndDisplay(cachedTrades);

        document.getElementById('ta-export-btn').disabled = cachedTrades.length === 0;
        scanBtn.disabled = false;
        scanBtn.textContent = 'Сканировать и анализировать';
        isFetching = false;
    }

    function exportData() {
        if (cachedTrades.length === 0) { alert("Нет данных для экспорта."); return; }
        const exportObject = { trades: cachedTrades, cardCache: cardDataCache };
        const jsonData = JSON.stringify(exportObject, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ASStars_Trades_Export.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        document.getElementById('ta-status').textContent = 'Данные успешно экспортированы.';
    }

    function importData() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json,.txt';
        fileInput.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = readerEvent => {
                const statusEl = document.getElementById('ta-status');
                try {
                    const parsedData = JSON.parse(readerEvent.target.result);
                    if (Array.isArray(parsedData) && (parsedData.length === 0 || parsedData[0].partnerName)) {
                        cachedTrades = parsedData;
                        cardDataCache = {};
                    } else if (parsedData.trades && parsedData.cardCache) {
                        cachedTrades = parsedData.trades;
                        cardDataCache = parsedData.cardCache;
                    } else {
                        throw new Error("Неверная структура данных");
                    }
                    statusEl.textContent = `Загружено ${cachedTrades.length} трейдов. Готово к анализу.`;
                    runAnalysisAndDisplay(cachedTrades);
                    document.getElementById('ta-export-btn').disabled = false;
                } catch (err) {
                    statusEl.textContent = 'Ошибка! Неверный формат файла.';
                    alert('Файл поврежден или имеет неверный формат.');
                }
            };
            reader.readAsText(file);
        };
        fileInput.click();
    }

    createUI();
})();