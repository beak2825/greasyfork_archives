// ==UserScript==
// @name         Blacket Trade History Viewer
// @namespace    http://tampermonkey.net/
// @version      1
// @description  View your past trades stored in local storage (no db ofc)
// @author       FRANXE
// @match        *://*.blacket.org/*
// @grant        none
// @icon         blacket.org/content/blooks/Default.webp
// @downloadURL https://update.greasyfork.org/scripts/561793/Blacket%20Trade%20History%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/561793/Blacket%20Trade%20History%20Viewer.meta.js
// ==/UserScript==

//notes: minor bugs, first version, styling needs work... etc, anyways im activly working on this
(function() {
    'use strict';

    const waitForBlacket = setInterval(() => {
        if (typeof blacket !== 'undefined' && blacket.user) {
            clearInterval(waitForBlacket);
            initTradeHistory();
        }
    }, 100);

    function initTradeHistory() {
        const style = document.createElement('style');
        style.textContent = `
            .tradeHistoryNotification {
                position: absolute;
                width: 1.302vw;
                height: 1.302vw;
                background-color: #4e9fff;
                border-radius: 50%;
                box-shadow: inset 0 -0.156vw rgba(0, 0, 0, 0.2);
                text-align: center;
                font-family: Titan One;
                text-shadow: 0.000vw 0.000vw 0.260vw black;
                font-size: 0.781vw;
                display: flex;
                justify-content: center;
                color: white;
                left: -0.5vw;
                bottom: -0.5vw;
            }
            .tradeHistoryContainer {
                width: 100%;
                height: 30vw;
                display: flex;
                flex-direction: column;
                overflow: auto;
                overflow-x: hidden;
                margin-bottom: 0.5vw;
            }
            .tradeHistoryEntryWrapper {
                position: relative;
                margin: 0.5vw;
            }
            .tradeHistoryEntry {
                padding: 0.8vw;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 0.8vw;
                display: flex;
                flex-direction: row;
                gap: 0.8vw;
                padding-bottom: 1.2vw;
                padding-right: 1vw;
                cursor: pointer;
                box-shadow: inset 0 -0.3vw rgba(0, 0, 0, 0.2);
            }
            .tradeHistoryEntry:hover {
                background: rgba(0, 0, 0, 0.5);
            }
            .tradeHistoryLeftSide {
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .tradeHistoryIcon {
                width: 5vw;
                height: 5vw;
                object-fit: cover;
            }
            .tradeHistoryRightSide {
                position: relative;
                display: flex;
                justify-content: left;
                align-items: flex-start;
                flex-direction: column;
                color: white;
                width: 100%;
            }
            .tradeHistoryUsername {
                font-size: 1.3vw;
                font-weight: bold;
            }
            .tradeHistoryDetails {
                text-align: left;
                word-wrap: break-word;
                margin-top: 0.3vw;
                font-size: 0.9vw;
                line-height: 1.4;
            }
            .tradeHistoryDate {
                position: absolute;
                bottom: -0.8vw;
                right: 0;
                font-size: 0.75vw;
                opacity: 0.7;

            //under here is like stuff im keeping for the next update im releasing
            }
            .tradeHistoryBlookIcon {
                width: 1.8vw;
                height: 1.8vw;
                object-fit: contain;
                display: inline-block;
                vertical-align: middle;
            }
            .tradeHistoryTokenIcon {
                width: 1.3vw;
                height: 1.3vw;
                object-fit: contain;
                display: inline-block;
                vertical-align: middle;
                margin-bottom: 0.15vw;
            }
            .tradeHistoryTokenText {
                color: #ffd700;
                font-weight: bold;
                font-size: 0.85vw;
                display: inline-block;
                vertical-align: middle;
            }
            .tradeHistoryActionButtons {
                position: absolute;
                top: 0.3vw;
                right: 0.3vw;
                display: flex;
                gap: 0.2vw;
                align-items: center;
            }
            .tradeHistoryActionBtn {
                width: 1vw;
                height: 1vw;
                cursor: pointer;
                z-index: 15;
                position: relative;
            }
            .tradeHistoryActionBtn .styles__shadow___3GMdH-camelCase {
                filter: blur(0.052vw);
                opacity: 0.5;
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 0.15vw;
                background-color: rgba(0, 0, 0, 0.5);
                transition: all 0.1s ease;
            }
            .tradeHistoryActionBtn .styles__edge___3eWfq-camelCase {
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 0.15vw;
                box-shadow: inset 0 -0.08vw rgba(0, 0, 0, 0.2);
                transition: all 0.1s ease;
            }
            .tradeHistoryActionBtn .styles__front___vcvuy-camelCase {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
                border-radius: 0.15vw;
                font-size: 0.5vw;
                color: white;
                position: relative;
                top: -0.08vw;
                transition: all 0.1s ease;
            }
            .tradeHistoryActionBtn:hover .styles__front___vcvuy-camelCase {
                top: -0.12vw;
            }
            .tradeHistoryActionBtn:active .styles__front___vcvuy-camelCase {
                top: 0;
            }
            .tradeHistoryDeleteBtn .styles__shadow___3GMdH-camelCase {
                background-color: rgba(0, 0, 0, 0.5);
            }
            .tradeHistoryDeleteBtn .styles__edge___3eWfq-camelCase {
                background-color: #c92a2a;
            }
            .tradeHistoryDeleteBtn .styles__front___vcvuy-camelCase {
                background-color: #ff4e4e;
            }
            .tradeHistoryEditBtn .styles__shadow___3GMdH-camelCase {
                background-color: rgba(0, 0, 0, 0.5);
            }
            .tradeHistoryEditBtn .styles__edge___3eWfq-camelCase {
                background-color: #1971c2;
            }
            .tradeHistoryEditBtn .styles__front___vcvuy-camelCase {
                background-color: #4e9fff;
            }
            .tradeHistoryMoveBtn .styles__shadow___3GMdH-camelCase {
                background-color: rgba(0, 0, 0, 0.5);
            }
            .tradeHistoryMoveBtn .styles__edge___3eWfq-camelCase {
                background-color: #2b8a3e;
            }
            .tradeHistoryMoveBtn .styles__front___vcvuy-camelCase {
                background-color: #51cf66;
            }
            #tradeHistoryButton {
                margin-right: 0.5vw;
            }
        `;
        document.head.appendChild(style);

        const tradeHistoryButton = document.createElement('div');
        tradeHistoryButton.id = 'tradeHistoryButton';
        tradeHistoryButton.style.marginBottom = '0.182vw';
        tradeHistoryButton.className = 'styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase';
        tradeHistoryButton.innerHTML = `
            <div class="styles__shadow___3GMdH-camelCase"></div>
            <div class="styles__edge___3eWfq-camelCase" style="background-color: var(--accent);"></div>
            <div class="styles__front___vcvuy-camelCase styles__buttonInsideNoMinWidth___39vdp-camelCase" style="background-color: var(--primary);">
                <i class="fas fa-history" aria-hidden="true"></i>
            </div>
        `;

        const addButton = setInterval(() => {
            const inboxButton = document.getElementById('inboxButton');
            if (inboxButton) {
                clearInterval(addButton);
                inboxButton.parentNode.insertBefore(tradeHistoryButton, inboxButton.nextSibling);

                tradeHistoryButton.addEventListener('click', openTradeHistory);
            }
        }, 100);

        hookTradeCompletion();
    }

    function getTradeHistory() {
        const history = localStorage.getItem('blacket_trade_history');
        return history ? JSON.parse(history) : [];
    }

    function saveTradeToHistory(tradeData) {
        const history = getTradeHistory();
        history.unshift(tradeData);

        if (history.length > 50) {
            history.length = 50;
        }

        localStorage.setItem('blacket_trade_history', JSON.stringify(history));
    }

    function deleteTradeFromHistory(timestamp) {
        let history = getTradeHistory();
        history = history.filter(trade => trade.timestamp !== timestamp);
        localStorage.setItem('blacket_trade_history', JSON.stringify(history));
    }

    function clearAllTrades() {
        localStorage.setItem('blacket_trade_history', JSON.stringify([]));
    }

    function openTradeHistory() {
        const history = getTradeHistory();

        const modal = document.createElement('div');
        modal.id = 'tradeHistoryModal';
        modal.className = 'arts__modal___VpEAD-camelCase';
        modal.innerHTML = `
            <div class="styles__container___1BPm9-camelCase" style="width: 50vw; box-shadow: inset 0 -0.521vw rgba(0, 0, 0, 0.2); position: relative;">
                <div class="styles__text___KSL4--camelCase" style="text-align: left; font-size: 2vw; font-family: Titan One, sans-serif; font-weight: normal; margin-top: 0.2vw;">
                    Trade History
                </div>
                <div class="tradeHistoryClearAllBtn" id="clearAllTradesBtn">
                    <i class="fas fa-trash-alt"></i>
                    <span>Clear All</span>
                </div>
                <div class="styles__holder___3CEfN-camelCase">
                    <div class="tradeHistoryContainer">
                        ${history.length === 0 ? '<div style="color: white; text-align: center; padding: 2vw;">No trades yet!</div>' :
                          history.map(trade => createTradeEntry(trade)).join('')}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const clearAllBtn = document.getElementById('clearAllTradesBtn');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to clear all trade history? This cannot be undone.')) {
                    clearAllTrades();
                    modal.remove();
                    openTradeHistory();
                }
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    function createTradeEntry(trade) {
        const date = new Date(trade.timestamp);
        const formattedDate = date.toLocaleString();

        let yourItemsText = '';
        if (trade.yourItems && trade.yourItems.length > 0) {
            const items = trade.yourItems.map(item => `x${item.quantity} ${item.name}`);
            yourItemsText = items.join(', ');
        } else {
            yourItemsText = 'No blooks';
        }

        const yourTokensText = (trade.yourTokens && trade.yourTokens > 0) ? `${trade.yourTokens.toLocaleString()} tokens` : '0 tokens';

        let theirItemsText = '';
        if (trade.theirItems && trade.theirItems.length > 0) {
            const items = trade.theirItems.map(item => `x${item.quantity} ${item.name}`);
            theirItemsText = items.join(', ');
        } else {
            theirItemsText = 'No blooks';
        }

        const theirTokensText = (trade.theirTokens && trade.theirTokens > 0) ? `${trade.theirTokens.toLocaleString()} tokens` : '0 tokens';

        return `
            <div class="tradeHistoryEntryWrapper">
                <div class="tradeHistoryEntry">
                    <div class="tradeHistoryLeftSide">
                        <img class="tradeHistoryIcon" src="${trade.otherUser.avatar}" alt="${trade.otherUser.username}">
                    </div>
                    <div class="tradeHistoryRightSide">
                        <div class="tradeHistoryUsername">${trade.otherUser.username}</div>
                        <div class="tradeHistoryDetails">
                            <span style="font-size: 0.8vw; opacity: 0.8;">You gave: </span>${yourItemsText}, ${yourTokensText}
                            <br>
                            <span style="font-size: 0.8vw; opacity: 0.8;">You received: </span>${theirItemsText}, ${theirTokensText}
                        </div>
                        <div class="tradeHistoryDate">${formattedDate}</div>
                    </div>
                </div>
            </div>
        `;
    }

    function hookTradeCompletion() {
        const checkForSocket = setInterval(() => {
            if (typeof blacket !== 'undefined' && blacket.socket && blacket.socket.on) {
                clearInterval(checkForSocket);

                const originalOn = blacket.socket.on.bind(blacket.socket);

                blacket.socket.on = function(event, callback) {
                    if (event === 'trading-ongoing-complete') {
                        const wrappedCallback = function(data) {
                            callback(data);

                            if (!data.error && data.data && data.data.rewards) {
                                setTimeout(() => captureTrade(data.data), 100);
                            }
                        };
                        return originalOn(event, wrappedCallback);
                    }
                    return originalOn(event, callback);
                };
            }
        }, 100);
    }

    function captureTrade(completionData) {
        try {
            if (typeof blacket === 'undefined' || !blacket.trade || !blacket.user) {
                console.log('Trade data not available');
                return;
            }

            const trade = blacket.trade;
            const currentUser = blacket.user;

            console.log('Current user ID:', currentUser.id);
            console.log('Trade users:', Object.keys(trade.users));
            console.log('Trade object:', trade);

            const otherUserId = Object.keys(trade.users).find(id => id !== currentUser.id);
            if (!otherUserId) {
                console.error('Could not find other user ID');
                return;
            }

            console.log('Other user ID:', otherUserId);

            const currentUserData = trade.users[currentUser.id];
            const otherUserData = trade.users[otherUserId];

            console.log('Current user data:', currentUserData);
            console.log('Other user data:', otherUserData);
            console.log('Completion data:', completionData);

            blacket.requests.get(`/worker2/user/${otherUserId}`, (userData) => {
                if (userData.error) {
                    console.error('Failed to fetch user data:', userData);
                    return;
                }

                console.log('Fetched user data:', userData);

                const yourItems = Object.keys(currentUserData.blooks || {}).map(itemName => ({
                    name: itemName,
                    quantity: currentUserData.blooks[itemName],
                    image: blacket.blooks[itemName]?.image || '/content/blooks/Default.webp'
                }));

                const theirItems = Object.keys(completionData.rewards.blooks || {}).map(itemName => ({
                    name: itemName,
                    quantity: completionData.rewards.blooks[itemName],
                    image: blacket.blooks[itemName]?.image || '/content/blooks/Default.webp'
                }));

                console.log('Your items:', yourItems);
                console.log('Their items:', theirItems);

                const tradeData = {
                    timestamp: Date.now(),
                    otherUser: {
                        username: userData.user.username,
                        avatar: userData.user.avatar,
                        id: otherUserId
                    },
                    yourItems: yourItems,
                    theirItems: theirItems,
                    yourTokens: currentUserData.tokens || 0,
                    theirTokens: completionData.rewards.tokens || 0
                };

                console.log('Final trade data to save:', tradeData);

                saveTradeToHistory(tradeData);

                if (blacket.createToast) {
                    blacket.createToast({
                        title: "Trade Saved",
                        message: "Trade with " + tradeData.otherUser.username + " has been saved to history!",
                        icon: "/content/blooks/Success.webp",
                        time: 3000
                    });
                }
            });
        } catch (error) {
            console.error('Error capturing trade:', error);
        }
    }
})();