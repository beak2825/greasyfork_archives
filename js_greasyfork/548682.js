// ==UserScript==
// @name         Geoguessr GameMode ratings display on Multiplayer page
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Display individual game mode ratings with rating changes next to main rating
// @author       Flykii
// @match        https://www.geoguessr.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548682/Geoguessr%20GameMode%20ratings%20display%20on%20Multiplayer%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/548682/Geoguessr%20GameMode%20ratings%20display%20on%20Multiplayer%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    let hasBeenAdded = false;
    let isTrackingActive = false;
    
    function getRatingsFromData() {
        let gameData = null;
        
        const nextDataScript = document.getElementById('__NEXT_DATA__');
        if (nextDataScript) {
            try {
                const nextData = JSON.parse(nextDataScript.textContent);
                gameData = nextData.props?.pageProps?.progress?.gameModeRatings;
            } catch (e) {}
        }
        
        if (!gameData && window.__NEXT_DATA__) {
            try {
                gameData = window.__NEXT_DATA__.props?.pageProps?.progress?.gameModeRatings;
            } catch (e) {}
        }
        
        return gameData;
    }
    
    function getStoredRatings() {
        const stored = sessionStorage.getItem('geoguessr_ratings_tracker');
        return stored ? JSON.parse(stored) : null;
    }
    
    function storeRatings(ratings) {
        const ratingsToStore = {};
        if (ratings.standardDuels?.rating) ratingsToStore.standardDuels = ratings.standardDuels.rating;
        if (ratings.noMoveDuels?.rating) ratingsToStore.noMoveDuels = ratings.noMoveDuels.rating;
        if (ratings.nmpzDuels?.rating) ratingsToStore.nmpzDuels = ratings.nmpzDuels.rating;
        
        sessionStorage.setItem('geoguessr_ratings_tracker', JSON.stringify(ratingsToStore));
    }
    
    function calculateChange(current, previous) {
        if (!current || !previous || current === null || previous === null) return null;
        return Math.round(current - previous);
    }
    
    function formatRatingWithChange(ratingData, previousRating) {
        if (!ratingData || ratingData.rating === null || ratingData.rating === undefined) {
            return { text: 'N/A', color: '#999' };
        }
        
        const currentRating = Math.round(ratingData.rating);
        const change = calculateChange(currentRating, previousRating);
        
        let text = currentRating.toString();
        let color = '#4CAF50';
        
        if (change !== null && change !== 0) {
            const changeText = change > 0 ? `(+${change})` : `(${change})`;
            text += ` ${changeText}`;
            color = change > 0 ? '#4CAF50' : (change < 0 ? '#f44336' : '#4CAF50');
        }
        
        return { text, color };
    }
    
    function addRatingsDisplay() {
        if (hasBeenAdded) return;
        
        const ratingElement = document.querySelector('.division-header_rating__qBzHF');
        if (!ratingElement) return;
        
        if (document.querySelector('.custom-ratings-display')) {
            hasBeenAdded = true;
            return;
        }
        
        const gameData = getRatingsFromData();
        if (!gameData) return;
        
        const storedRatings = getStoredRatings();
        
        const ratingsContainer = document.createElement('div');
        ratingsContainer.className = 'custom-ratings-display';
        ratingsContainer.style.cssText = `
            margin-left: 15px;
            font-size: 14px;
            color: #666;
            display: flex;
            flex-direction: column;
            gap: 2px;
        `;
        
        const modes = [
            { key: 'standardDuels', label: 'moving rating' },
            { key: 'noMoveDuels', label: 'nm rating' },
            { key: 'nmpzDuels', label: 'nmpz rating' }
        ];
        
        modes.forEach(mode => {
            const previousRating = storedRatings ? storedRatings[mode.key] : null;
            const formatted = formatRatingWithChange(gameData[mode.key], previousRating);
            
            const ratingDiv = document.createElement('div');
            ratingDiv.textContent = `${mode.label}: ${formatted.text}`;
            ratingDiv.style.cssText = `
                font-weight: 500;
                color: ${formatted.color};
            `;
            ratingsContainer.appendChild(ratingDiv);
        });
        
        ratingElement.parentNode.insertBefore(ratingsContainer, ratingElement.nextSibling);
        hasBeenAdded = true;
        
        if (!isTrackingActive) {
            storeRatings(gameData);
            isTrackingActive = true;
        }
    }
    
    function updateRatingsAfterDuel() {
        const gameData = getRatingsFromData();
        if (gameData) {
            storeRatings(gameData);
        }
    }
    
    let lastUrl = location.href;
    function checkForNavigation() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            hasBeenAdded = false;
            
            if (location.pathname.includes('/duels/') && location.pathname.includes('/summary')) {
                setTimeout(updateRatingsAfterDuel, 2000);
            }
        }
    }
    
    const checkForRatingElement = setInterval(() => {
        checkForNavigation();
        
        if (!hasBeenAdded && document.querySelector('.division-header_rating__qBzHF')) {
            addRatingsDisplay();
            if (hasBeenAdded) {
                clearInterval(checkForRatingElement);
            }
        }
    }, 1000);
    
    setTimeout(() => {
        clearInterval(checkForRatingElement);
    }, 30000);
    
})();