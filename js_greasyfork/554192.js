// ==UserScript==
// @name         Sportlogiq: Frame Conflict Detector
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Detects and displays frame conflicts and assist links in the event list.
// @author       Volodymyr Kerdiak
// @match        https://app.sportlogiq.com/EventorApp.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554192/Sportlogiq%3A%20Frame%20Conflict%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/554192/Sportlogiq%3A%20Frame%20Conflict%20Detector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const FrameConflictDetector = {
        _observer: null,
        _tableObserver: null,
        _intervalId: null,
        _timestampsMap: new Map(),
        _defaultColor: '#f36d00',
        _highlightColor: '#ffffff',
        _okColor: '#28a745',
        _isHighlightMode: false,
        _isAssistHelperEnabled: true,

        init: function() {
            this._defaultColor = GM_getValue('conflictDetectorDefaultColor', '#f36d00');
            this._highlightColor = GM_getValue('conflictDetectorHighlightColor', '#ffffff');
            this._isAssistHelperEnabled = GM_getValue('assistHelperEnabled', true);
            this._registerMenuCommands();
            this._start();
        },

        _registerMenuCommands: function() {
            GM_registerMenuCommand('Configure Conflict Colors', this._configureColors.bind(this));
            GM_registerMenuCommand(`Toggle Assist Frame Helper (${this._isAssistHelperEnabled ? 'ON' : 'OFF'})`, this._toggleAssistHelper.bind(this));
        },

        _configureColors: function() {
            const newDefault = prompt('Enter default conflict icon color:', this._defaultColor);
            if (newDefault) GM_setValue('conflictDetectorDefaultColor', newDefault);
            const newHighlight = prompt('Enter highlight mode conflict icon color:', this._highlightColor);
            if (newHighlight) GM_setValue('conflictDetectorHighlightColor', newHighlight);
            alert('Colors updated. Page will reload.');
            window.location.reload();
        },

        _toggleAssistHelper: function() {
            const newState = !this._isAssistHelperEnabled;
            GM_setValue('assistHelperEnabled', newState);
            alert(`Assist Frame Helper is now ${newState ? 'ENABLED' : 'DISABLED'}. Page will reload.`);
            window.location.reload();
        },

        _start: function() {
            if (this._intervalId) return;
            this._intervalId = setInterval(() => {
                const targetTableBody = document.querySelector('#game-events tbody');
                const targetTable = document.getElementById('game-events');
                if (targetTableBody && targetTable) {
                    clearInterval(this._intervalId);
                    this._intervalId = null;
                    this._isHighlightMode = targetTable.classList.contains('highlight');
                    this._fullScanAndRender(targetTableBody);
                    this._observer = new MutationObserver((mutationsList) => {
                        for (const mutation of mutationsList) {
                            mutation.addedNodes.forEach(node => this._processAddedNode(node));
                            mutation.removedNodes.forEach(node => this._processRemovedNode(node));
                        }
                    });
                    this._observer.observe(targetTableBody, { childList: true, subtree: true });
                    this._tableObserver = new MutationObserver((mutationsList) => {
                        for (const mutation of mutationsList) {
                            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                                this._handleTableClassChange(mutation.target);
                            }
                        }
                    });
                    this._tableObserver.observe(targetTable, { attributes: true });
                }
            }, 500);
        },

        _handleTableClassChange: function(tableElement) {
            const hasHighlight = tableElement.classList.contains('highlight');
            if (hasHighlight !== this._isHighlightMode) {
                this._isHighlightMode = hasHighlight;
                this._timestampsMap.forEach((events, timestamp) => {
                    if (events.size > 0) this._updateIconsForTimestamp(timestamp);
                });
            }
        },

        _fullScanAndRender: function(tableBody) {
            this._timestampsMap.clear();
            const allRows = tableBody.querySelectorAll('tr');
            allRows.forEach(row => {
                const eventData = this._getEventData(row);
                if (eventData) {
                    if (!this._timestampsMap.has(eventData.timestamp)) {
                        this._timestampsMap.set(eventData.timestamp, new Set());
                    }
                    this._timestampsMap.get(eventData.timestamp).add(eventData);
                }
            });
            this._timestampsMap.forEach((events, timestamp) => this._updateIconsForTimestamp(timestamp));
            this._alignAllRows(allRows);
        },

        _processAddedNode: function(node) {
            if (node.nodeType !== 1) return;
            const rows = node.tagName === 'TR' ? [node] : node.querySelectorAll('tr');
            rows.forEach(row => {
                const eventData = this._getEventData(row);
                if (eventData) {
                    if (!this._timestampsMap.has(eventData.timestamp)) {
                        this._timestampsMap.set(eventData.timestamp, new Set());
                    }
                    this._timestampsMap.get(eventData.timestamp).add(eventData);
                    this._updateIconsForTimestamp(eventData.timestamp);
                }
                this._alignRow(row);
            });
        },

        _processRemovedNode: function(node) {
            if (node.nodeType !== 1) return;
            const rows = node.tagName === 'TR' ? [node] : node.querySelectorAll('tr');
            rows.forEach(row => {
                const eventData = this._getEventData(row);
                if (eventData) {
                    const events = this._timestampsMap.get(eventData.timestamp);
                    if (events) {
                        events.forEach(e => { if (e.row === row) events.delete(e); });
                        if (events.size > 0) {
                            this._updateIconsForTimestamp(eventData.timestamp);
                        } else {
                            this._timestampsMap.delete(eventData.timestamp);
                        }
                    }
                }
            });
        },

        _updateIconsForTimestamp: function(timestamp) {
            const events = this._timestampsMap.get(timestamp) || new Set();
            const eventArray = Array.from(events);
            const conflictColor = this._isHighlightMode ? this._highlightColor : this._defaultColor;

            const gameEvents = eventArray.filter(e => e.isGameEvent);
            const ourTeamNonAssistEvents = eventArray.filter(e => e.isPlayerEvent && !e.isAssist && e.team === 'ours');
            const opposingTeamNonAssistEvents = eventArray.filter(e => e.isPlayerEvent && !e.isAssist && e.team === 'opponent');
            const isOurTeamConflict = ourTeamNonAssistEvents.length > 1 || (ourTeamNonAssistEvents.length > 0 && gameEvents.length > 0);
            const isOpposingTeamConflict = opposingTeamNonAssistEvents.length > 1 || (opposingTeamNonAssistEvents.length > 0 && gameEvents.length > 0);

            eventArray.forEach(event => {
                let shouldHaveIcon = false;
                if (event.isPlayerEvent && !event.isAssist) {
                    if (event.team === 'ours' && isOurTeamConflict) shouldHaveIcon = true;
                    else if (event.team === 'opponent' && isOpposingTeamConflict) shouldHaveIcon = true;
                }
                this._renderConflictIcon(event.row, shouldHaveIcon, conflictColor);
            });

            if (this._isAssistHelperEnabled) {
                const processTeam = (teamEvents) => {
                    if (teamEvents.length === 0) return;
                    const hasAssist = teamEvents.some(e => e.isAssist);
                    if (hasAssist) {
                        const hasNonAssist = teamEvents.some(e => !e.isAssist);
                        const icon = hasNonAssist ? 'glyphicon-ok' : 'glyphicon-remove';
                        const iconColor = hasNonAssist ? this._okColor : conflictColor;
                        teamEvents.forEach(event => this._renderAssistIcon(event.row, true, iconColor, icon));
                    } else {
                        teamEvents.forEach(event => this._renderAssistIcon(event.row, false));
                    }
                };

                const ourTeamPlayerEvents = eventArray.filter(e => e.isPlayerEvent && e.team === 'ours');
                const opponentTeamPlayerEvents = eventArray.filter(e => e.isPlayerEvent && e.team === 'opponent');

                processTeam(ourTeamPlayerEvents);
                processTeam(opponentTeamPlayerEvents);
                gameEvents.forEach(event => this._renderAssistIcon(event.row, false));

            } else {
                eventArray.forEach(event => this._renderAssistIcon(event.row, false));
            }
        },

        _renderConflictIcon(row, showIcon, color) {
            let cell = row.querySelector('.frame-conflict-cell');
            if (!cell) { cell = document.createElement('td'); cell.className = 'frame-conflict-cell'; row.appendChild(cell); }
            if (showIcon) {
                cell.innerHTML = `<span class="glyphicon glyphicon-minus-sign" aria-hidden="true" title="Frame conflict detected" style="color: ${color}; font-size: 14px; vertical-align: middle;"></span>`;
                cell.style.width = '30px';
                cell.style.paddingBottom = '6px';
            } else {
                cell.innerHTML = '';
            }
        },

        _renderAssistIcon(row, showIcon, color, iconClass) {
            let cell = row.querySelector('.assist-helper-cell');
            if (!cell) {
                cell = document.createElement('td');
                cell.className = 'assist-helper-cell';
                const descCell = row.querySelector('td.description');
                if (descCell && descCell.nextSibling) {
                    descCell.parentNode.insertBefore(cell, descCell.nextSibling);
                } else {
                    row.appendChild(cell);
                }
            }
            if (showIcon) {
                cell.innerHTML = `<span class="glyphicon ${iconClass}" aria-hidden="true" title="Assist Frame Helper" style="color: ${color}; font-size: 14px; vertical-align: middle;"></span>`;
                cell.style.width = '30px';
                cell.style.textAlign = 'center';
                cell.style.paddingBottom = '6px';
            } else {
                cell.innerHTML = '';
            }
        },

        _getEventData: function(row) {
            if (!row.id) return null;
            const timeCell = row.querySelector('td.video-time');
            if (!timeCell) return null;
            const desc = row.querySelector('td.description')?.textContent.trim() || '';
            return { row: row, timestamp: timeCell.textContent.trim(), isPlayerEvent: row.id.startsWith('event-player-'), isGameEvent: row.id.startsWith('event-game-'), isAssist: desc.includes('1ST ASSIST') || desc.includes('2ND ASSIST'), team: row.classList.contains('opposing-team-event') ? 'opponent' : 'ours' };
        },

        _alignAllRows: function(rows) { rows.forEach(row => this._alignRow(row)); },
        _alignRow: function(row) { if (!row.querySelector('.frame-conflict-cell')) { const emptyCell = document.createElement('td'); emptyCell.className = 'frame-conflict-cell'; row.appendChild(emptyCell); } }
    };

    FrameConflictDetector.init();
})();