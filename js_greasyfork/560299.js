// ==UserScript==
// @name         Grifftopia Points
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Gain points by commenting on Grifftopia!
// @author       alboxer2000
// @match        https://scratch.mit.edu/users/*
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560299/Grifftopia%20Points.user.js
// @updateURL https://update.greasyfork.org/scripts/560299/Grifftopia%20Points.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
    function getUsername() {
        const pathParts = window.location.pathname.split('/');
        
        return pathParts[2];
    }

    
    async function fetchAndDisplayPoints() {
        const targetUser = getUsername();
        if (!targetUser) return;

        const apiUrl = `https://raw.githubusercontent.com/alboxer2000/grifftopia-points/refs/heads/main/data.json`;

        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    
                    let points = 0;
                    
                    
                    if (Array.isArray(data)) {
                        const userEntry = data.find(u => u.username && u.username.toLowerCase() === targetUser.toLowerCase());
                        points = userEntry ? userEntry.points : 0;
                    } else if (typeof data === 'object') {
                        const keys = Object.keys(data);
                        const match = keys.find(k => k.toLowerCase() === targetUser.toLowerCase());
                        points = match ? data[match] : 0;
                    }

                    injectPointsUI(points);
                } catch (e) {
                    console.error("Failed to parse points data:", e);
                }
            },
            onerror: function(err) {
                console.error("Error fetching points:", err);
            }
        });
    }

   
    function injectPointsUI(points) {
        
        if (document.getElementById('scratch-points-display')) return;

        const container = document.querySelector('.header-text h2') || document.querySelector('.header-text');
        if (!container) return;

        const pointsBadge = document.createElement('span');
        pointsBadge.id = 'scratch-points-display';
        pointsBadge.innerText = ` ${points} GriffXP`;
        

        pointsBadge.style.fontSize = '0.65em';
        pointsBadge.style.color = '#4d97ff'; // Scratch Blue
        pointsBadge.style.backgroundColor = '#f2f2f2';
        pointsBadge.style.padding = '2px 8px';
        pointsBadge.style.borderRadius = '10px';
        pointsBadge.style.marginLeft = '10px';
        pointsBadge.style.verticalAlign = 'middle';
        pointsBadge.style.fontWeight = 'bold';
        pointsBadge.style.border = '1px solid #d9d9d9';
        pointsBadge.style.display = 'inline-block';

        container.appendChild(pointsBadge);
    }

    
    const observer = new MutationObserver((mutations) => {
        const container = document.querySelector('.header-text');
        if (container && !document.getElementById('scratch-points-display')) {
            fetchAndDisplayPoints();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    
    if (document.querySelector('.header-text')) {
        fetchAndDisplayPoints();
    }

})();