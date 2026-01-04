// ==UserScript==
// @name         MAX OWNED LAND
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Keeps track of "max owned land"
// @author       OpenFront Masters x NewYearNewPhil
// @match        https://openfront.io/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558114/MAX%20OWNED%20LAND.user.js
// @updateURL https://update.greasyfork.org/scripts/558114/MAX%20OWNED%20LAND.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let maxOwned = JSON.parse(localStorage.getItem('maxOwned')) || {};
    let lastUrl = location.href;

    function formatPercentage(str) {
        return parseFloat(str.replace('%','').trim());
    }

    function updateMax(name, value) {
        if(!maxOwned[name] || value > maxOwned[name]) {
            maxOwned[name] = value;
            localStorage.setItem('maxOwned', JSON.stringify(maxOwned));
            return true;
        }
        return false;
    }

    function displayMax(node, name, currentValue) {
        let maxValue = maxOwned[name] || currentValue;
        let span = node.querySelector('.max-owned');
        if(!span) {
            span = document.createElement('span');
            span.className = 'max-owned';
            span.style.fontSize = '0.8em';
            span.style.color = '#ccc';
            span.style.marginLeft = '3px';
            node.appendChild(span);
        }
        span.textContent = `(max: ${maxValue}%)`;
    }

    function processRow(cols, nameIndex, ownedIndex) {
        const name = cols[nameIndex].textContent.trim();
        const ownedNode = cols[ownedIndex];
        const currentOwned = formatPercentage(ownedNode.textContent);
        const isNewMax = updateMax(name, currentOwned);
        displayMax(ownedNode, name, currentOwned);
        if(isNewMax) {
            ownedNode.querySelector('.max-owned').style.color = '#0f0';
            setTimeout(() => {
                ownedNode.querySelector('.max-owned').style.color = '#ccc';
            }, 1000);
        }
    }

    function processLeaderboard() {
        document.querySelectorAll('leader-board .contents').forEach(row => {
            const cols = row.children;
            if(cols.length >= 5) processRow(cols, 1, 2);
        });
    }

    function processTeamStats() {
        document.querySelectorAll('team-stats .contents').forEach(row => {
            const cols = row.children;
            if(cols.length >= 4) processRow(cols, 0, 1);
        });
    }

    function resetMaxOwned() {
        maxOwned = {};
        localStorage.removeItem('maxOwned');
        document.querySelectorAll('.max-owned').forEach(span => span.remove());
    }

    function processAll() {
        if(location.href !== lastUrl) {
            lastUrl = location.href;
            resetMaxOwned();
        }
        processLeaderboard();
        processTeamStats();
    }

    let scheduled = false;
    const observer = new MutationObserver(() => {
        if(!scheduled) {
            scheduled = true;
            setTimeout(() => {
                processAll();
                scheduled = false;
            }, 200);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    processAll();
})();