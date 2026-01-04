// ==UserScript==
// @name         PTP Monitor - Background Fix
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Works better in background tabs
// @author       You
// @match        *://*/ptp/*
// @match        *://*/ptc/*
// @match        *://*/*platformsincome*
// @match        *://*/*subid=131370*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551941/PTP%20Monitor%20-%20Background%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/551941/PTP%20Monitor%20-%20Background%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Site verification
    const url = window.location.href.toLowerCase();
    if (!url.includes('/ptp/') && !url.includes('/ptc/') && 
        !url.includes('platformsincome') && !url.includes('subid=131370')) {
        return;
    }

    // Background-aware Config
    const CONFIG = {
        ACTIVE_CHECK: 10000,          // 10 seconds when tab active
        BACKGROUND_CHECK: 30000,      // 30 seconds when tab background
        CREDIT_FREEZE_TIME: 5 * 60 * 1000,
        RETRY_WAIT_TIME: 5 * 60 * 1000,
    };

    let state = {
        isMonitoring: true,
        lastCreditValue: null,
        lastCreditUpdateTime: Date.now(),
        retryMode: false,
        retryTimer: null,
        freezeTimer: null,
        isTabActive: true  // Track tab visibility
    };

    // Detect tab visibility changes
    document.addEventListener('visibilitychange', () => {
        state.isTabActive = !document.hidden;
        console.log(`Tab ${state.isTabActive ? 'active' : 'background'}`);
    });

    function createUI() {
        const ui = document.createElement('div');
        ui.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 8px 12px;
            font-size: 12px;
            font-family: Arial, sans-serif;
            border-radius: 5px;
            z-index: 10000;
            border: 1px solid #444;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
            min-width: 220px;
        `;
        ui.innerHTML = `
            <div style="margin-bottom: 5px; font-weight: bold; color: #4FC3F7;">
                PTP Monitor ${state.isTabActive ? '🟢' : '⚫'}
            </div>
            <div style="display: flex; justify-content: space-between; margin: 2px 0;">
                <span>Credit:</span>
                <span id="creditValue" style="color: #4CAF50; font-weight: bold;">--</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 2px 0;">
                <span>Status:</span>
                <span id="statusValue" style="color: #4CAF50;">Active</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 2px 0;">
                <span>Since Update:</span>
                <span id="timeValue">--</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 2px 0;">
                <span>Tab State:</span>
                <span id="tabState">${state.isTabActive ? 'ACTIVE' : 'BACKGROUND'}</span>
            </div>
            <button id="refreshBtn" style="margin-top: 5px; padding: 3px 8px; background: #2196F3; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; width: 100%;">🔄 Refresh Now</button>
        `;
        document.body.appendChild(ui);
        
        ui.querySelector('#refreshBtn').addEventListener('click', () => {
            window.location.reload();
        });
        
        return ui;
    }

    function updateUI(ui) {
        if (!ui) return;
        
        const currentCredit = getCurrentCredit();
        const timeSinceUpdate = Date.now() - state.lastCreditUpdateTime;
        const minutes = Math.floor(timeSinceUpdate / 60000);
        const seconds = Math.floor((timeSinceUpdate % 60000) / 1000);
        
        // Update all elements
        ui.querySelector('#creditValue').textContent = currentCredit !== null ? currentCredit.toFixed(3) : '--';
        ui.querySelector('#timeValue').textContent = `${minutes}m ${seconds}s`;
        ui.querySelector('#tabState').textContent = state.isTabActive ? 'ACTIVE' : 'BACKGROUND';
        
        const statusEl = ui.querySelector('#statusValue');
        if (state.retryMode) {
            statusEl.textContent = '🛑 RETRY MODE';
            statusEl.style.color = '#F44336';
            ui.style.border = '1px solid #F44336';
        } else if (timeSinceUpdate > CONFIG.CREDIT_FREEZE_TIME * 0.8) {
            statusEl.textContent = '⚠️ SOON REFRESH';
            statusEl.style.color = '#FF9800';
            ui.style.border = '1px solid #FF9800';
        } else {
            statusEl.textContent = state.isTabActive ? '✅ ACTIVE' : '⏸️ BACKGROUND';
            statusEl.style.color = state.isTabActive ? '#4CAF50' : '#9E9E9E';
            ui.style.border = '1px solid #444';
        }
        
        // Update title to show credit (helps keep tab active)
        document.title = `💰 ${currentCredit !== null ? currentCredit.toFixed(3) : '0.00'} - PTP`;
    }

    function getCurrentCredit() {
        const element = document.querySelector('b[id="sptdcnt"]');
        if (element) {
            const text = element.textContent || element.innerText;
            const match = text.match(/\d+\.\d+/);
            return match ? parseFloat(match[0]) : null;
        }
        return null;
    }

    function checkForRetryMessage() {
        const bodyText = document.body.innerText.toLowerCase();
        const retryPatterns = [
            'please retry again in a moment',
            'don\'t visit this ptp too often',
            'same device/ip address'
        ];
        
        const found = retryPatterns.some(pattern => bodyText.includes(pattern));
        
        if (found && !state.retryMode) {
            console.log('🛑 Retry message detected - waiting 5 minutes');
            state.retryMode = true;
            
            if (state.retryTimer) clearTimeout(state.retryTimer);
            
            state.retryTimer = setTimeout(() => {
                console.log('⏰ 5 minutes elapsed - refreshing page');
                window.location.reload();
            }, CONFIG.RETRY_WAIT_TIME);
            
            return true;
        } else if (!found && state.retryMode) {
            state.retryMode = false;
            if (state.retryTimer) {
                clearTimeout(state.retryTimer);
                state.retryTimer = null;
            }
        }
        
        return false;
    }

    function monitorCredit() {
        if (!state.isMonitoring || state.retryMode) return;

        const currentCredit = getCurrentCredit();
        
        if (currentCredit !== null) {
            if (state.lastCreditValue === null) {
                state.lastCreditValue = currentCredit;
                state.lastCreditUpdateTime = Date.now();
            } else if (currentCredit !== state.lastCreditValue) {
                state.lastCreditValue = currentCredit;
                state.lastCreditUpdateTime = Date.now();
                
                if (state.freezeTimer) {
                    clearTimeout(state.freezeTimer);
                    state.freezeTimer = null;
                }
            } else {
                const timeSinceUpdate = Date.now() - state.lastCreditUpdateTime;
                
                if (timeSinceUpdate >= CONFIG.CREDIT_FREEZE_TIME && !state.freezeTimer) {
                    console.log(`🔄 Credit frozen - refreshing page`);
                    window.location.reload();
                }
            }
        }
    }

    function startMonitoring() {
        const ui = createUI();
        console.log('🚀 PTP Monitor Started - Background Aware');
        
        // Smart interval based on tab state
        setInterval(() => {
            const checkInterval = state.isTabActive ? CONFIG.ACTIVE_CHECK : CONFIG.BACKGROUND_CHECK;
            
            if (!checkForRetryMessage()) {
                monitorCredit();
            }
            updateUI(ui);
        }, 5000); // Check every 5 seconds and adjust behavior
        
        // Keep tab somewhat active
        setInterval(() => {
            document.title = `💰 ${getCurrentCredit() || '0.00'} - PTP`;
        }, 30000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startMonitoring);
    } else {
        startMonitoring();
    }
})();